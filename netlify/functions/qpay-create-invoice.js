"use strict";
const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { createInvoice } = require("./_lib/payment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, recordEventSafe, safeFailureCategory } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  let payment;
  const context = await assessmentContext(database, body.assessmentId);
  await recordEventSafe(database, "invoice_create_started", context, { assessmentId: body.assessmentId }, {
    idempotencyKey: `invoice_create_started:${body.assessmentId}`, ...flagsFromEvent(event)
  });
  try { payment = await createInvoice(database, getQPayProvider(), session.id, body); }
  catch (error) {
    await recordEventSafe(database, "invoice_create_failed", context, { assessmentId: body.assessmentId },
      { idempotencyKey: `invoice_create_failed:${body.assessmentId}`, metadata: { failureCategory: safeFailureCategory(error) }, ...flagsFromEvent(event) });
    throw error;
  }
  if (payment.invoiceId) await recordEventSafe(database, "invoice_created", await assessmentContext(database, payment.assessmentId),
    { assessmentId: payment.assessmentId, invoiceId: payment.invoiceId, paymentId: payment.paymentId, amountMnt: payment.amount },
    { idempotencyKey: `invoice_created:${payment.invoiceId}`, ...flagsFromEvent(event) });
  return response(200, payment);
});
