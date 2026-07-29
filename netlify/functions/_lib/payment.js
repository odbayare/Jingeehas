"use strict";

const { PRODUCT } = require("./config.js");
const { randomId, hashToken } = require("./crypto.js");
const { ownedAssessment } = require("./assessment.js");
const { isPrepaid } = require("./commercial-flow.js");

const ACTIVE = new Set(["creating", "create_unknown", "reconciling", "pending", "checking", "check_error"]);
const AMBIGUOUS_CREATE = new Set(["create_error", "create_unknown", "reconciling"]);
const SAFE_SENDER_INVOICE_MAX_LENGTH = 45;

function senderInvoiceNumber() {
  const value = randomId("jh_");
  if (value.length > SAFE_SENDER_INVOICE_MAX_LENGTH) throw new Error("Sender invoice reference exceeds provider limit");
  return value;
}

function requestFingerprint(sessionId, assessmentId) {
  return hashToken([sessionId, assessmentId, PRODUCT.code, PRODUCT.amount].join("|"));
}

function maskedReference(value) {
  const text = String(value || "");
  return text ? `${text.slice(0, 3)}…${text.slice(-4)}` : "absent";
}

function providerFailureEvidence(error, senderInvoiceNo, timestamp) {
  return {
    event: "qpay_invoice_create_unknown",
    failureClass: String(error?.failureClass || "missing_expected_fields"),
    providerHttpStatus: Number.isInteger(error?.providerHttpStatus) ? error.providerHttpStatus : null,
    providerResponseShape: error?.providerResponseShape || "unavailable",
    requestReachedProvider: error?.requestReachedProvider ?? "unknown",
    requestTimestamp: timestamp,
    senderInvoiceReference: maskedReference(senderInvoiceNo)
  };
}
function publicPayment(payment) {
  return {
    paymentId: payment.id, assessmentId: payment.assessmentId, productCode: payment.productCode,
    amount: payment.amount, status: payment.status, invoiceId: payment.invoiceId || null,
    expiresAt: payment.expiresAt || null, qrText: payment.qrText || "", qrImage: payment.qrImage || "",
    urls: payment.urls || [], entitlement: payment.entitlement || null, nextRoute: payment.nextRoute || null
  };
}

async function validateInvoiceRequest(database, sessionId, input) {
  const assessment = await ownedAssessment(database, sessionId, input.assessmentId);
  const validStatus = isPrepaid(assessment) ? assessment.status === "payment_pending" : assessment.status === "complete";
  if (!validStatus || assessment.safetyRoute) throw Object.assign(new Error("Assessment is not eligible for payment"), { statusCode: 409, code: "assessment_incomplete" });
  const recoveryContacts = await database.find("recovery_contacts", { sessionId, assessmentId: assessment.id });
  if (!recoveryContacts.length) throw Object.assign(new Error("Recovery contact required"), { statusCode: 400, code: "recovery_contact_required" });
  if ((await database.find("entitlements", { assessmentId: assessment.id, status: "active" })).length) {
    throw Object.assign(new Error("Assessment is already paid"), { statusCode: 409, code: "already_entitled" });
  }
  if (input.productCode && input.productCode !== PRODUCT.code) throw Object.assign(new Error("Invalid product"), { statusCode: 400, code: "invalid_product" });
  if (input.amount != null && Number(input.amount) !== PRODUCT.amount) throw Object.assign(new Error("Invalid amount"), { statusCode: 400, code: "invalid_amount" });
  return assessment;
}

async function createInvoiceAttempt(database, provider, sessionId, assessment, now, replacementForPaymentId = null) {
  const id = randomId("wp_");
  const senderInvoiceNo = senderInvoiceNumber();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
  const timestamp = now.toISOString();
  await database.insert("payments", { id, sessionId, assessmentId: assessment.id, productCode: PRODUCT.code,
    amount: PRODUCT.amount, status: "creating", senderInvoiceNo, invoiceId: null, expiresAt,
    qrText: "", qrImage: "", urls: [], requestFingerprint: requestFingerprint(sessionId, assessment.id),
    reconciliationStatus: "not_required", replacementForPaymentId,
    createdAt: timestamp, updatedAt: timestamp, paidAt: null });
  try {
    const invoice = await provider.createInvoice({ senderInvoiceNo, amount: PRODUCT.amount });
    if (!invoice?.invoiceId) throw Object.assign(new Error("Missing invoice ID"), {
      failureClass: "missing_expected_fields", providerHttpStatus: 200,
      providerResponseShape: invoice && typeof invoice === "object" ? Object.keys(invoice).sort() : typeof invoice,
      requestReachedProvider: true, createOutcomeUnknown: true
    });
    const pending = await database.update("payments", id, { status: "pending", invoiceId: invoice.invoiceId,
      qrText: String(invoice.qrText || ""), qrImage: String(invoice.qrImage || ""), urls: invoice.urls || [],
      reconciliationStatus: "not_required", updatedAt: timestamp });
    return { ...publicPayment(pending), reused: false };
  } catch (error) {
    const evidence = providerFailureEvidence(error, senderInvoiceNo, timestamp);
    console.error(JSON.stringify(evidence));
    await database.update("payments", id, { status: "create_unknown", reconciliationStatus: "required", updatedAt: timestamp });
    throw Object.assign(new Error("Invoice creation outcome requires reconciliation"), {
      statusCode: 502, code: "invoice_create_unknown", failureEvidence: evidence, cause: error
    });
  }
}

async function createInvoice(database, provider, sessionId, input = {}, now = new Date()) {
  const assessment = await validateInvoiceRequest(database, sessionId, input);
  const payments = await database.find("payments", { sessionId, assessmentId: assessment.id, productCode: PRODUCT.code });
  const ambiguous = payments.find(payment => AMBIGUOUS_CREATE.has(payment.status) ||
    payment.status === "creating" && (!payment.expiresAt || new Date(payment.expiresAt) <= now));
  if (ambiguous) throw Object.assign(new Error("Existing invoice attempt requires reconciliation"), {
    statusCode: 409, code: "invoice_reconciliation_required", paymentId: ambiguous.id
  });
  if (payments.some(payment => payment.status === "create_failed_confirmed")) {
    throw Object.assign(new Error("A confirmed failed attempt requires an explicitly linked replacement"), {
      statusCode: 409, code: "replacement_authorization_required"
    });
  }
  const active = payments.find(payment => ACTIVE.has(payment.status) && payment.expiresAt && new Date(payment.expiresAt) > now && (payment.status === "creating" || payment.invoiceId));
  if (active) return { ...publicPayment(active), reused: true };
  for (const stale of payments.filter(payment => ACTIVE.has(payment.status))) await database.update("payments", stale.id, { status: "expired", updatedAt: now.toISOString() });
  return createInvoiceAttempt(database, provider, sessionId, assessment, now);
}

async function reconcileInvoiceCreation(database, provider, sessionId, input = {}, now = new Date()) {
  const payment = await database.get("payments", input.paymentId);
  if (!payment || payment.sessionId !== sessionId) throw Object.assign(new Error("Payment not found"), { statusCode: 404, code: "payment_not_found" });
  if (!AMBIGUOUS_CREATE.has(payment.status)) throw Object.assign(new Error("Payment is not reconcilable"), { statusCode: 409, code: "payment_not_reconcilable" });
  await database.update("payments", payment.id, { status: "reconciling", reconciliationStatus: "in_progress", updatedAt: now.toISOString() });
  let result;
  try { result = await provider.reconcileInvoice({ senderInvoiceNo: payment.senderInvoiceNo, createdAt: payment.createdAt }); }
  catch { result = { state: "unknown" }; }
  if (result?.state === "exists" && result.invoice?.invoiceId) {
    const invoice = result.invoice;
    if (invoice.amount != null && Number(invoice.amount) !== payment.amount) throw Object.assign(new Error("Reconciled invoice amount mismatch"), { statusCode: 409, code: "invoice_mismatch" });
    return publicPayment(await database.update("payments", payment.id, { status: "pending", invoiceId: invoice.invoiceId,
      qrText: String(invoice.qrText || ""), qrImage: String(invoice.qrImage || ""), urls: invoice.urls || [],
      expiresAt: invoice.expiresAt || payment.expiresAt, reconciliationStatus: "existing_invoice_recovered", updatedAt: now.toISOString() }));
  }
  if (result?.state === "absent") {
    return publicPayment(await database.update("payments", payment.id, { status: "create_failed_confirmed",
      reconciliationStatus: "absence_confirmed", updatedAt: now.toISOString() }));
  }
  await database.update("payments", payment.id, { status: "create_unknown", reconciliationStatus: "required", updatedAt: now.toISOString() });
  throw Object.assign(new Error("Provider invoice state is still ambiguous"), { statusCode: 409, code: "invoice_reconciliation_blocked" });
}

async function createReplacementInvoice(database, provider, sessionId, input = {}, now = new Date()) {
  const failed = await database.get("payments", input.paymentId);
  if (!failed || failed.sessionId !== sessionId) throw Object.assign(new Error("Payment not found"), { statusCode: 404, code: "payment_not_found" });
  if (failed.status !== "create_failed_confirmed" || failed.reconciliationStatus !== "absence_confirmed") {
    throw Object.assign(new Error("Provider absence is not confirmed"), { statusCode: 409, code: "invoice_absence_not_confirmed" });
  }
  const assessment = await validateInvoiceRequest(database, sessionId, { assessmentId: failed.assessmentId, productCode: failed.productCode, amount: failed.amount });
  const payments = await database.find("payments", { sessionId, assessmentId: assessment.id, productCode: PRODUCT.code });
  if (payments.some(payment => ACTIVE.has(payment.status))) throw Object.assign(new Error("Active invoice exists"), { statusCode: 409, code: "active_invoice_exists" });
  return createInvoiceAttempt(database, provider, sessionId, assessment, now, failed.id);
}

function confirmedProviderPayment(result, expectedAmount) {
  const rows = Array.isArray(result?.rows) ? result.rows : Array.isArray(result?.payments) ? result.payments : [];
  return rows.find(row => String(row.payment_status || row.status || "").toUpperCase() === "PAID" && Number(row.payment_amount || row.amount) === expectedAmount) || null;
}

async function grantEntitlement(database, payment, sessionId, now) {
  const entitlementId = `${payment.assessmentId}:${PRODUCT.code}`;
  await database.upsert("entitlements", entitlementId, { sessionId, assessmentId: payment.assessmentId,
    paymentId: payment.id, productCode: PRODUCT.code, status: "active", grantedAt: now.toISOString() });
  const contacts = await database.find("recovery_contacts", { sessionId, assessmentId: payment.assessmentId });
  for (const contact of contacts) await database.update("recovery_contacts", contact.id, {
    paymentId: payment.id, entitlementId, updatedAt: now.toISOString()
  });
  const assessment = await database.get("assessments", payment.assessmentId);
  if (isPrepaid(assessment) && assessment.status === "payment_pending") {
    await database.update("assessments", assessment.id, { status: "paid_ready", updatedAt: now.toISOString() });
  }
  if (assessment?.coachClientId) {
    const client = await database.get("advisor_clients", assessment.coachClientId);
    if (client?.coachId) await database.upsert("advisor_commissions", payment.id, { coachId: client.coachId,
      paymentId: payment.id, amount: Number(client.commissionAmount || 4000), status: "pending", createdAt: now.toISOString() });
  }
  const paid = await database.update("payments", payment.id, { status: "paid", updatedAt: now.toISOString() });
  return { ...paid, nextRoute: isPrepaid(assessment) ? "/assessment/questions" : "/report" };
}

async function checkPayment(database, provider, sessionId, input = {}, now = new Date()) {
  const payment = await database.get("payments", input.paymentId);
  if (!payment || payment.sessionId !== sessionId) throw Object.assign(new Error("Payment not found"), { statusCode: 404, code: "payment_not_found" });
  if (payment.productCode !== PRODUCT.code || payment.amount !== PRODUCT.amount) throw Object.assign(new Error("Payment mismatch"), { statusCode: 409, code: "payment_mismatch" });
  if (payment.status === "paid" || payment.status === "paid_but_not_unlocked") {
    try { return publicPayment({ ...(await grantEntitlement(database, payment, sessionId, now)), entitlement: true }); }
    catch { return publicPayment(await database.update("payments", payment.id, { status: "paid_but_not_unlocked", updatedAt: now.toISOString() })); }
  }
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

  const confirmed = await database.update("payments", payment.id, { status: "checking", paidAt: now.toISOString(), updatedAt: now.toISOString(),
    providerPaymentId: String(paidRow.payment_id || paidRow.id || "") });
  try {
    return publicPayment({ ...(await grantEntitlement(database, confirmed, sessionId, now)), entitlement: true });
  } catch {
    return publicPayment(await database.update("payments", payment.id, { status: "paid_but_not_unlocked", updatedAt: now.toISOString() }));
  }
}

module.exports = { ACTIVE, AMBIGUOUS_CREATE, SAFE_SENDER_INVOICE_MAX_LENGTH, senderInvoiceNumber, requestFingerprint,
  providerFailureEvidence, publicPayment, createInvoice, reconcileInvoiceCreation, createReplacementInvoice,
  confirmedProviderPayment, grantEntitlement, checkPayment };
