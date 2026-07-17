"use strict";
process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "test-pepper-value-with-at-least-32-characters";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter } = require("../support/memory-database.js");
const { createSession } = require("../../netlify/functions/_lib/session.js");
const { createAssessment } = require("../../netlify/functions/_lib/assessment.js");
const {
  SAFE_SENDER_INVOICE_MAX_LENGTH, senderInvoiceNumber, createInvoice, reconcileInvoiceCreation,
  createReplacementInvoice, checkPayment
} = require("../../netlify/functions/_lib/payment.js");
const { safeAppLinks, responseShape } = require("../../netlify/functions/_lib/qpay.js");
const { PRODUCT } = require("../../netlify/functions/_lib/config.js");
const { saveRecoveryContacts } = require("../../netlify/functions/_lib/recovery.js");
const { saveSafetyCheck } = require("../../netlify/functions/_lib/safety.js");

async function context() {
  const database = new MemoryDatabaseAdapter();
  const { session } = await createSession(database);
  const safety = await saveSafetyCheck(database, session.id, { age: 30, selfHarm: "Үгүй", acuteMedical: ["Аль нь ч үгүй"], compensatoryBehavior: "Үгүй", medicalSuitability: "Үргэлжлүүлэхэд тохиромжтой" });
  const contact = await saveRecoveryContacts(database, session.id, { phone: "99112233" });
  const assessment = await createAssessment(database, session.id, { recoveryContactGroupId: contact.contactGroupId, safetyCheckId: safety.safetyCheckId });
  return { database, session, assessment };
}

function ambiguousError(failureClass, providerHttpStatus = null) {
  return Object.assign(new Error("redacted provider failure"), {
    failureClass, providerHttpStatus, providerResponseShape: { error: { code: "string" } },
    requestReachedProvider: providerHttpStatus == null ? "unknown" : true, createOutcomeUnknown: true
  });
}

async function expectUnknownCreate(provider) {
  const test = await context();
  const originalError = console.error;
  const evidence = [];
  console.error = value => evidence.push(JSON.parse(value));
  try {
    await assert.rejects(() => createInvoice(test.database, provider, test.session.id, { assessmentId: test.assessment.id }), error => error.code === "invoice_create_unknown");
  } finally { console.error = originalError; }
  const payments = await test.database.find("payments", { assessmentId: test.assessment.id });
  assert.equal(payments.length, 1);
  assert.equal(payments[0].status, "create_unknown");
  assert.equal(payments[0].reconciliationStatus, "required");
  assert.ok(payments[0].requestFingerprint);
  assert.equal(evidence.length, 1);
  assert.ok(!JSON.stringify(evidence[0]).includes(payments[0].senderInvoiceNo), "logs must mask the full sender reference");
  return { ...test, payment: payments[0] };
}

(async () => {
  assert.ok(senderInvoiceNumber().length <= SAFE_SENDER_INVOICE_MAX_LENGTH, "QPay sender reference must fit the documented limit");

  // Baseline success and payment lifecycle remains idempotent.
  const baseline = await context();
  let createCount = 0;
  let checkCount = 0;
  const provider = {
    async createInvoice() { createCount += 1; return { invoiceId: "inv-1", qrText: "safe-qr", urls: [] }; },
    async checkPayment() { checkCount += 1; return { rows: [{ payment_id: "provider-1", payment_status: "PAID", payment_amount: PRODUCT.amount }] }; }
  };
  await assert.rejects(() => createInvoice(baseline.database, provider, baseline.session.id, { assessmentId: baseline.assessment.id, amount: 1 }), error => error.code === "invalid_amount");
  const invoice = await createInvoice(baseline.database, provider, baseline.session.id, { assessmentId: baseline.assessment.id, productCode: PRODUCT.code, amount: PRODUCT.amount });
  assert.equal(invoice.status, "pending");
  assert.equal(createCount, 1);
  const duplicate = await createInvoice(baseline.database, provider, baseline.session.id, { assessmentId: baseline.assessment.id });
  assert.equal(duplicate.paymentId, invoice.paymentId);
  assert.equal(duplicate.reused, true);
  assert.equal(createCount, 1);

  const paid = await checkPayment(baseline.database, provider, baseline.session.id, { paymentId: invoice.paymentId });
  assert.equal(paid.status, "paid");
  assert.equal(paid.entitlement, true);
  const paidAgain = await checkPayment(baseline.database, provider, baseline.session.id, { paymentId: invoice.paymentId });
  assert.equal(paidAgain.status, "paid");
  assert.equal(checkCount, 1);
  const entitlements = await baseline.database.find("entitlements", { assessmentId: baseline.assessment.id });
  assert.equal(entitlements.length, 1);
  await baseline.database.delete("entitlements", entitlements[0].id);
  const repairedEntitlement = await checkPayment(baseline.database, provider, baseline.session.id, { paymentId: invoice.paymentId });
  assert.equal(repairedEntitlement.status, "paid");
  assert.equal(repairedEntitlement.entitlement, true);
  assert.equal(checkCount, 1);

  // 1. Provider creates the invoice but the response times out.
  let timeoutCreates = 0;
  const timeout = await expectUnknownCreate({ async createInvoice() { timeoutCreates += 1; throw ambiguousError("provider_timeout"); } });
  // 6. No blind retry: the preserved unknown attempt blocks another create.
  await assert.rejects(() => createInvoice(timeout.database, { async createInvoice() { timeoutCreates += 1; } }, timeout.session.id, { assessmentId: timeout.assessment.id }), error => error.code === "invoice_reconciliation_required");
  assert.equal(timeoutCreates, 1);

  // 2. A provider 500 after processing is also unknown, never confirmed absent.
  await expectUnknownCreate({ async createInvoice() { throw ambiguousError("provider_5xx", 500); } });

  // 3. Malformed JSON and a success object missing invoice_id are both unknown.
  await expectUnknownCreate({ async createInvoice() { throw ambiguousError("malformed_json", 200); } });
  await expectUnknownCreate({ async createInvoice() { return { qrText: "orphaned-success-response" }; } });

  // 4 and 7. Reconciliation repairs the existing row in place when the invoice exists.
  const exists = await expectUnknownCreate({ async createInvoice() { throw ambiguousError("unknown_transport_failure"); } });
  const recovered = await reconcileInvoiceCreation(exists.database, {
    async reconcileInvoice({ senderInvoiceNo }) {
      assert.equal(senderInvoiceNo, exists.payment.senderInvoiceNo);
      return { state: "exists", invoice: { invoiceId: "recovered-invoice", amount: PRODUCT.amount, qrText: "recovered-qr", urls: [] } };
    }
  }, exists.session.id, { paymentId: exists.payment.id });
  assert.equal(recovered.paymentId, exists.payment.id);
  assert.equal(recovered.status, "pending");
  assert.equal((await exists.database.find("payments", { assessmentId: exists.assessment.id })).length, 1);

  // 5 and 8. Replacement is permitted only after an explicit provider absence result.
  const absent = await expectUnknownCreate({ async createInvoice() { throw ambiguousError("provider_timeout"); } });
  await assert.rejects(() => createReplacementInvoice(absent.database, { async createInvoice() {} }, absent.session.id, { paymentId: absent.payment.id }), error => error.code === "invoice_absence_not_confirmed");
  const confirmedAbsent = await reconcileInvoiceCreation(absent.database, {
    async reconcileInvoice() { return { state: "absent" }; }
  }, absent.session.id, { paymentId: absent.payment.id });
  assert.equal(confirmedAbsent.status, "create_failed_confirmed");
  let replacementCreates = 0;
  const replacement = await createReplacementInvoice(absent.database, {
    async createInvoice() { replacementCreates += 1; return { invoiceId: "replacement-invoice", qrText: "replacement-qr", urls: [] }; }
  }, absent.session.id, { paymentId: absent.payment.id });
  assert.equal(replacementCreates, 1);
  assert.equal(replacement.status, "pending");
  const replacementRows = await absent.database.find("payments", { assessmentId: absent.assessment.id });
  assert.equal(replacementRows.length, 2);
  assert.equal(replacementRows.find(row => row.id === replacement.paymentId).replacementForPaymentId, absent.payment.id);
  assert.notEqual(replacementRows.find(row => row.id === replacement.paymentId).senderInvoiceNo, absent.payment.senderInvoiceNo);

  // Unsupported lookup returns to a terminal-safe unknown state and still blocks creation.
  const unsupported = await expectUnknownCreate({ async createInvoice() { throw ambiguousError("provider_timeout"); } });
  await assert.rejects(() => reconcileInvoiceCreation(unsupported.database, { async reconcileInvoice() { return { state: "unsupported" }; } }, unsupported.session.id, { paymentId: unsupported.payment.id }), error => error.code === "invoice_reconciliation_blocked");
  assert.equal((await unsupported.database.get("payments", unsupported.payment.id)).status, "create_unknown");

  const safe = safeAppLinks([
    { name: "Bad", link: "javascript:alert(1)" }, { name: "Data", link: "data:text/html,x" },
    { name: "HTTP", link: "http://bank.example/x" }, { name: "HTTPS", link: "https://bank.example/pay" },
    { name: "App", link: "bankapp://pay/1" }
  ], { allowedSchemes: ["bankapp"], allowedHosts: ["bank.example"] });
  assert.deepEqual(safe.map(item => item.name), ["HTTPS", "App"]);
  assert.deepEqual(responseShape({ error: { code: "X", private: "never log values" } }), { error: { code: "string", private: "string" } });
  console.log("QPay API contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
