"use strict";
const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { createInvoice, validateInvoiceRequest } = require("./_lib/payment.js");
const { isFreeAssessmentPostpaid } = require("./_lib/commercial-flow.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");
const { analyticsFlagsForPayment, paymentClassification } = require("./_lib/payment-context.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessment = await validateInvoiceRequest(database, session.id, body);
  const freeFlow = isFreeAssessmentPostpaid(assessment);
  const key = freeFlow ? funnelKeyHash(body.assessmentId) : null;
  const requestFlags = flagsFromEvent(event);
  const classification = paymentClassification(event, requestFlags);
  if (freeFlow) await recordEventSafe(database, "full_report_cta_clicked", await assessmentContext(database, body.assessmentId), { funnelKeyHash: key }, {
    idempotencyKey: `full_report_cta_clicked:${key}`,
    ...requestFlags
  });
  let payment;
  try { payment = await createInvoice(database, getQPayProvider(), session.id, body, new Date(), classification); }
  catch (error) {
    await recordEventSafe(database, "invoice_create_failed", await assessmentContext(database, body.assessmentId),
      freeFlow ? { funnelKeyHash: key } : { assessmentId: body.assessmentId },
      { metadata: { errorCode: String(error?.code || "invoice_create_failed").slice(0, 80) }, ...requestFlags });
    throw error;
  }
  const authoritativePayment = payment.paymentId ? await database.get("payments", payment.paymentId) : null;
  const measurementFlags = analyticsFlagsForPayment(authoritativePayment || classification);
  if (payment.invoiceId) await recordEventSafe(database, "invoice_created", await assessmentContext(database, payment.assessmentId),
    freeFlow
      ? { funnelKeyHash: key, amountMnt: payment.amount }
      : { assessmentId: payment.assessmentId, invoiceId: payment.invoiceId, paymentId: payment.paymentId, amountMnt: payment.amount },
    { idempotencyKey: freeFlow ? `invoice_created:${key}` : `invoice_created:${payment.invoiceId}`, ...measurementFlags });
  return response(200, payment);
});
