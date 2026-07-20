"use strict";
const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { createInvoice } = require("./_lib/payment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  let payment;
  try { payment = await createInvoice(database, getQPayProvider(), session.id, body); }
  catch (error) {
    await recordEventSafe(database, "invoice_create_failed", await assessmentContext(database, body.assessmentId), { assessmentId: body.assessmentId },
      { metadata: { errorCode: String(error?.code || "invoice_create_failed").slice(0, 80) }, ...flagsFromEvent(event) });
    throw error;
  }
  if (payment.invoiceId) await recordEventSafe(database, "invoice_created", await assessmentContext(database, payment.assessmentId),
    { assessmentId: payment.assessmentId, invoiceId: payment.invoiceId, paymentId: payment.paymentId, amountMnt: payment.amount },
    { idempotencyKey: `invoice_created:${payment.invoiceId}`, ...flagsFromEvent(event) });
  return response(200, payment);
});
