"use strict";
const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { checkPayment } = require("./_lib/payment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const existing = await database.get("payments", body.paymentId);
  const context = existing ? await assessmentContext(database, existing.assessmentId) : {};
  if (existing?.sessionId === session.id) await recordEventSafe(database, "payment_check_started", context,
    { assessmentId: existing.assessmentId, invoiceId: existing.invoiceId, paymentId: existing.id }, { ...flagsFromEvent(event) });
  let payment;
  try { payment = await checkPayment(database, getQPayProvider(), session.id, body); }
  catch (error) {
    if (existing?.sessionId === session.id) await recordEventSafe(database, "payment_check_failed", context,
      { assessmentId: existing.assessmentId, invoiceId: existing.invoiceId, paymentId: existing.id },
      { metadata: { errorCode: String(error?.code || "payment_check_failed").slice(0, 80) }, ...flagsFromEvent(event) });
    throw error;
  }
  if (payment.status === "check_error") await recordEventSafe(database, "payment_check_failed", context,
    { assessmentId: payment.assessmentId, invoiceId: payment.invoiceId, paymentId: payment.paymentId }, { ...flagsFromEvent(event) });
  if (payment.status === "paid") await recordEventSafe(database, "payment_confirmed", await assessmentContext(database, payment.assessmentId),
    { assessmentId: payment.assessmentId, invoiceId: payment.invoiceId, paymentId: payment.paymentId, amountMnt: payment.amount },
    { idempotencyKey: `payment_confirmed:${payment.paymentId}`, ...flagsFromEvent(event) });
  return response(200, payment);
});
