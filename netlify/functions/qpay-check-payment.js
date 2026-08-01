"use strict";
const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { checkPayment } = require("./_lib/payment.js");
const { isFreeAssessmentPostpaid } = require("./_lib/commercial-flow.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");
const { deliverConfirmedPurchaseSafe, purchaseEventId } = require("./_lib/meta-capi.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const existing = await database.get("payments", body.paymentId);
  const context = existing ? await assessmentContext(database, existing.assessmentId) : {};
  const assessment = existing ? await database.get("assessments", existing.assessmentId) : null;
  const freeFlow = isFreeAssessmentPostpaid(assessment);
  const key = freeFlow ? funnelKeyHash(existing?.assessmentId) : null;
  const analyticsValues = freeFlow
    ? { funnelKeyHash: key }
    : { assessmentId: existing?.assessmentId, invoiceId: existing?.invoiceId, paymentId: existing?.id };
  const requestFlags = flagsFromEvent(event);
  if (existing?.sessionId === session.id) await recordEventSafe(database, "payment_check_started", context,
    analyticsValues, requestFlags);
  let payment;
  try { payment = await checkPayment(database, getQPayProvider(), session.id, body); }
  catch (error) {
    if (existing?.sessionId === session.id) await recordEventSafe(database, "payment_check_failed", context,
      analyticsValues,
      { metadata: { errorCode: String(error?.code || "payment_check_failed").slice(0, 80) }, ...requestFlags });
    throw error;
  }
  if (payment.status === "check_error") await recordEventSafe(database, "payment_check_failed", context,
    freeFlow ? { funnelKeyHash: key } : { assessmentId: payment.assessmentId, invoiceId: payment.invoiceId, paymentId: payment.paymentId }, requestFlags);
  if (payment.status === "paid") {
    await recordEventSafe(database, "payment_confirmed", await assessmentContext(database, payment.assessmentId),
      freeFlow
        ? { funnelKeyHash: key, amountMnt: payment.amount }
        : { assessmentId: payment.assessmentId, invoiceId: payment.invoiceId, paymentId: payment.paymentId, amountMnt: payment.amount },
      { idempotencyKey: freeFlow ? `payment_confirmed:${key}` : `payment_confirmed:${payment.paymentId}`, ...requestFlags });
    await deliverConfirmedPurchaseSafe(database, payment.paymentId, event, { flags: requestFlags });
    const authoritativePayment = await database.get("payments", payment.paymentId);
    const eventId = purchaseEventId(authoritativePayment || payment);
    if (eventId) payment = { ...payment, purchaseEventId: eventId };
  }
  return response(200, payment);
});
