"use strict";

const { PRODUCT } = require("./config.js");
const { randomId } = require("./crypto.js");
const { ownedAssessment } = require("./assessment.js");

const ACTIVE = new Set(["creating", "pending", "checking", "check_error"]);
function publicPayment(payment) {
  return {
    paymentId: payment.id, assessmentId: payment.assessmentId, productCode: payment.productCode,
    amount: payment.amount, status: payment.status, invoiceId: payment.invoiceId || null,
    expiresAt: payment.expiresAt || null, qrText: payment.qrText || "", qrImage: payment.qrImage || "",
    urls: payment.urls || [], entitlement: payment.entitlement || null
  };
}

async function createInvoice(database, provider, sessionId, input = {}, now = new Date()) {
  const assessment = await ownedAssessment(database, sessionId, input.assessmentId);
  const safetyCheck = await database.get("safety_checks", assessment.safetyCheckId);
  if (!safetyCheck || safetyCheck.result?.route !== "eligible") throw Object.assign(new Error("Payment blocked by safety route"), { statusCode: 409, code: "safety_route_required" });
  const recoveryContacts = await database.find("recovery_contacts", { sessionId, assessmentId: assessment.id });
  if (!recoveryContacts.length) throw Object.assign(new Error("Recovery contact required"), { statusCode: 400, code: "recovery_contact_required" });
  if (input.productCode && input.productCode !== PRODUCT.code) throw Object.assign(new Error("Invalid product"), { statusCode: 400, code: "invalid_product" });
  if (input.amount != null && Number(input.amount) !== PRODUCT.amount) throw Object.assign(new Error("Invalid amount"), { statusCode: 400, code: "invalid_amount" });
  const payments = await database.find("payments", { sessionId, assessmentId: assessment.id, productCode: PRODUCT.code });
  const active = payments.find(payment => ACTIVE.has(payment.status) && payment.expiresAt && new Date(payment.expiresAt) > now && (payment.status === "creating" || payment.invoiceId));
  if (active) return { ...publicPayment(active), reused: true };
  for (const stale of payments.filter(payment => ACTIVE.has(payment.status))) await database.update("payments", stale.id, { status: "expired", updatedAt: now.toISOString() });

  const id = randomId("wp_");
  const senderInvoiceNo = randomId("jingeehas_");
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
  await database.insert("payments", { id, sessionId, assessmentId: assessment.id, productCode: PRODUCT.code,
    amount: PRODUCT.amount, status: "creating", senderInvoiceNo, invoiceId: null, expiresAt,
    qrText: "", qrImage: "", urls: [], createdAt: now.toISOString(), updatedAt: now.toISOString(), paidAt: null });
  try {
    const invoice = await provider.createInvoice({ senderInvoiceNo, amount: PRODUCT.amount });
    if (!invoice.invoiceId) throw new Error("Missing invoice ID");
    const pending = await database.update("payments", id, { status: "pending", invoiceId: invoice.invoiceId,
      qrText: String(invoice.qrText || ""), qrImage: String(invoice.qrImage || ""), urls: invoice.urls || [], updatedAt: now.toISOString() });
    return { ...publicPayment(pending), reused: false };
  } catch (error) {
    await database.update("payments", id, { status: "create_error", updatedAt: now.toISOString() });
    throw Object.assign(new Error("Invoice creation failed"), { statusCode: 502, code: "create_error", cause: error });
  }
}

function confirmedProviderPayment(result, expectedAmount) {
  const rows = Array.isArray(result?.rows) ? result.rows : Array.isArray(result?.payments) ? result.payments : [];
  return rows.find(row => String(row.payment_status || row.status || "").toUpperCase() === "PAID" && Number(row.payment_amount || row.amount) === expectedAmount) || null;
}

async function checkPayment(database, provider, sessionId, input = {}, now = new Date()) {
  const payment = await database.get("payments", input.paymentId);
  if (!payment || payment.sessionId !== sessionId) throw Object.assign(new Error("Payment not found"), { statusCode: 404, code: "payment_not_found" });
  if (payment.productCode !== PRODUCT.code || payment.amount !== PRODUCT.amount) throw Object.assign(new Error("Payment mismatch"), { statusCode: 409, code: "payment_mismatch" });
  if (payment.status === "paid") return publicPayment({ ...payment, entitlement: true });
  if (payment.expiresAt && new Date(payment.expiresAt) <= now) {
    return publicPayment(await database.update("payments", payment.id, { status: "expired", updatedAt: now.toISOString() }));
  }
  if (!payment.invoiceId) throw Object.assign(new Error("Invoice missing"), { statusCode: 409, code: "invoice_missing" });
  await database.update("payments", payment.id, { status: "checking", updatedAt: now.toISOString() });
  let providerResult;
  try { providerResult = await provider.checkPayment(payment.invoiceId); }
  catch { return publicPayment(await database.update("payments", payment.id, { status: "check_error", updatedAt: now.toISOString() })); }
  const paidRow = confirmedProviderPayment(providerResult, PRODUCT.amount);
  if (!paidRow) return publicPayment(await database.update("payments", payment.id, { status: "pending", updatedAt: now.toISOString() }));

  const paid = await database.update("payments", payment.id, { status: "paid", paidAt: now.toISOString(), updatedAt: now.toISOString(),
    providerPaymentId: String(paidRow.payment_id || paidRow.id || "") });
  try {
    const entitlementId = `${payment.assessmentId}:${PRODUCT.code}`;
    await database.upsert("entitlements", entitlementId, { sessionId, assessmentId: payment.assessmentId,
      paymentId: payment.id, productCode: PRODUCT.code, status: "active", grantedAt: now.toISOString() });
    const contacts = await database.find("recovery_contacts", { sessionId, assessmentId: payment.assessmentId });
    for (const contact of contacts) await database.update("recovery_contacts", contact.id, {
      paymentId: payment.id, entitlementId, updatedAt: now.toISOString()
    });
    const assessment = await database.get("assessments", payment.assessmentId);
    if (assessment?.coachClientId) {
      const client = await database.get("advisor_clients", assessment.coachClientId);
      if (client?.coachId) await database.upsert("advisor_commissions", payment.id, { coachId: client.coachId,
        paymentId: payment.id, amount: Number(client.commissionAmount || 4000), status: "pending", createdAt: now.toISOString() });
    }
    return publicPayment({ ...paid, entitlement: true });
  } catch {
    return publicPayment(await database.update("payments", payment.id, { status: "paid_but_not_unlocked", updatedAt: now.toISOString() }));
  }
}

module.exports = { ACTIVE, publicPayment, createInvoice, confirmedProviderPayment, checkPayment };
