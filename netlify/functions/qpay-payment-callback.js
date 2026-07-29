"use strict";

const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { confirmCallbackPayment } = require("./_lib/payment.js");
const { assessmentContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");
const { allowProviderLookup } = require("./_lib/qpay-callback.js");
const CALLBACK_PAYMENT_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/;

function successResponse() {
  return { statusCode: 200, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" }, body: "SUCCESS" };
}

exports.handler = async event => {
  if (String(event.httpMethod || "GET").toUpperCase() !== "GET") return { statusCode: 405, headers: { allow: "GET", "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ error: "method_not_allowed" }) };
  const providerPaymentId = String(event.queryStringParameters?.qpay_payment_id || "").trim();
  if (!CALLBACK_PAYMENT_ID.test(providerPaymentId)) return successResponse();
  try {
    const database = getDatabase();
    const lookup = await allowProviderLookup(database, providerPaymentId, event, new Date());
    if (!lookup.allowed) {
      if (!lookup.fastPath) console.info(JSON.stringify({ event: "qpay_callback_unverified", category: "rate_limited" }));
      return successResponse();
    }
    const payment = await confirmCallbackPayment(database, getQPayProvider(), providerPaymentId, new Date());
    if (payment?.status === "paid") {
      const context = await assessmentContext(database, payment.assessmentId);
      await recordEventSafe(database, "payment_confirmed", context, { assessmentId: payment.assessmentId, invoiceId: payment.invoiceId, paymentId: payment.paymentId, amountMnt: payment.amount }, {
        idempotencyKey: `payment_confirmed:${payment.paymentId}`, ...flagsFromEvent(event)
      });
    } else console.info(JSON.stringify({ event: "qpay_callback_unverified", category: "payment_not_authorized" }));
  } catch (error) {
    console.warn(JSON.stringify({ event: "qpay_callback_failed", category: String(error?.code || "server_error").slice(0, 40) }));
  }
  return successResponse();
};

module.exports = { CALLBACK_PAYMENT_ID, successResponse, handler: exports.handler };
