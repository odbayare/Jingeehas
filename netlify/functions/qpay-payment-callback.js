"use strict";

const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { response } = require("./_lib/http.js");
const { PRODUCT } = require("./_lib/config.js");
const { isFreeAssessmentPostpaid } = require("./_lib/commercial-flow.js");
const { assessmentContext, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");
const { analyticsFlagsForPayment } = require("./_lib/payment-context.js");
const {
  SAFE_SENDER_INVOICE_MAX_LENGTH,
  isSupportedPaymentAmount,
  confirmedProviderPayment,
  grantEntitlement,
  publicPayment
} = require("./_lib/payment.js");

function callbackReference(event = {}) {
  const value = String(event.queryStringParameters?.senderInvoiceNo || "").trim();
  if (!value || value.length > SAFE_SENDER_INVOICE_MAX_LENGTH) return "";
  return value;
}

async function confirmCallbackPayment(database, provider, senderInvoiceNo, now = new Date()) {
  if (!senderInvoiceNo) return { state: "ignored" };
  const rows = await database.find("payments", { senderInvoiceNo });
  const payment = rows[0];
  if (!payment || !payment.invoiceId || payment.productCode !== PRODUCT.code || !isSupportedPaymentAmount(payment.amount)) {
    return { state: "ignored" };
  }

  if (payment.status === "paid" || payment.status === "paid_but_not_unlocked") {
    try {
      const repaired = await grantEntitlement(database, payment, payment.sessionId, now);
      return { state: "paid", payment: publicPayment({ ...repaired, entitlement: true }) };
    } catch {
      await database.update("payments", payment.id, { status: "paid_but_not_unlocked", updatedAt: now.toISOString() });
      return { state: "retry" };
    }
  }

  let providerResult;
  try { providerResult = await provider.checkPayment(payment.invoiceId); }
  catch { return { state: "retry" }; }

  const paidRow = confirmedProviderPayment(providerResult, payment.amount);
  if (!paidRow) return { state: "retry" };

  const confirmed = await database.update("payments", payment.id, {
    status: "checking",
    paidAt: payment.paidAt || now.toISOString(),
    providerPaymentId: String(paidRow.payment_id || paidRow.id || ""),
    updatedAt: now.toISOString()
  });
  try {
    const paid = await grantEntitlement(database, confirmed, payment.sessionId, now);
    return { state: "paid", payment: publicPayment({ ...paid, entitlement: true }) };
  } catch {
    await database.update("payments", payment.id, { status: "paid_but_not_unlocked", updatedAt: now.toISOString() });
    return { state: "retry" };
  }
}

async function recordCallbackConfirmation(database, payment) {
  if (!payment?.paymentId) return;
  const authoritative = await database.get("payments", payment.paymentId);
  if (!authoritative) return;
  const assessment = await database.get("assessments", authoritative.assessmentId);
  const freeFlow = isFreeAssessmentPostpaid(assessment);
  const measurementFlags = analyticsFlagsForPayment(authoritative);
  const context = await assessmentContext(database, authoritative.assessmentId);
  const key = freeFlow ? funnelKeyHash(authoritative.assessmentId) : null;
  await recordEventSafe(database, "payment_confirmed", context,
    freeFlow
      ? { funnelKeyHash: key, amountMnt: authoritative.amount }
      : { assessmentId: authoritative.assessmentId, invoiceId: authoritative.invoiceId, paymentId: authoritative.id, amountMnt: authoritative.amount },
    { idempotencyKey: freeFlow ? `payment_confirmed:${key}` : `payment_confirmed:${authoritative.id}`, ...measurementFlags });
}

exports.handler = async event => {
  if (!["GET", "POST"].includes(event.httpMethod)) return response(405, { error: "method_not_allowed" }, { allow: "GET, POST" });
  const senderInvoiceNo = callbackReference(event);
  if (!senderInvoiceNo) return response(200, { ok: true });

  const database = getDatabase();
  const result = await confirmCallbackPayment(database, getQPayProvider(), senderInvoiceNo);
  if (result.state === "ignored") return response(200, { ok: true });
  if (result.state !== "paid") return response(503, { ok: false, error: "verification_pending" });
  await recordCallbackConfirmation(database, result.payment);
  return response(200, { ok: true });
};

exports._test = { callbackReference, confirmCallbackPayment, recordCallbackConfirmation };
