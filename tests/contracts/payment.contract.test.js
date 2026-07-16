"use strict";
process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "test-pepper-value-with-at-least-32-characters";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter } = require("../../netlify/functions/_lib/store.js");
const { createSession } = require("../../netlify/functions/_lib/session.js");
const { createAssessment } = require("../../netlify/functions/_lib/assessment.js");
const { createInvoice, checkPayment } = require("../../netlify/functions/_lib/payment.js");
const { safeAppLinks } = require("../../netlify/functions/_lib/qpay.js");
const { PRODUCT } = require("../../netlify/functions/_lib/config.js");
const { saveRecoveryContacts } = require("../../netlify/functions/_lib/recovery.js");
const { saveSafetyCheck } = require("../../netlify/functions/_lib/safety.js");

(async () => {
  const database = new MemoryDatabaseAdapter();
  const { session } = await createSession(database);
  const safety = await saveSafetyCheck(database, session.id, { age: 30, selfHarm: "Үгүй", acuteMedical: ["Аль нь ч үгүй"], compensatoryBehavior: "Үгүй", medicalSuitability: "Үргэлжлүүлэхэд тохиромжтой" });
  const contact = await saveRecoveryContacts(database, session.id, { phone: "99112233" });
  const assessment = await createAssessment(database, session.id, { recoveryContactGroupId: contact.contactGroupId, safetyCheckId: safety.safetyCheckId });
  let createCount = 0;
  let checkCount = 0;
  const provider = {
    async createInvoice() { createCount += 1; return { invoiceId: "inv-1", qrText: "safe-qr", urls: [] }; },
    async checkPayment() { checkCount += 1; return { rows: [{ payment_id: "provider-1", payment_status: "PAID", payment_amount: PRODUCT.amount }] }; }
  };

  await assert.rejects(() => createInvoice(database, provider, session.id, { assessmentId: assessment.id, amount: 1 }), error => error.code === "invalid_amount");
  const invoice = await createInvoice(database, provider, session.id, { assessmentId: assessment.id, productCode: PRODUCT.code, amount: PRODUCT.amount });
  assert.equal(invoice.status, "pending");
  assert.equal(createCount, 1);
  const duplicate = await createInvoice(database, provider, session.id, { assessmentId: assessment.id });
  assert.equal(duplicate.paymentId, invoice.paymentId);
  assert.equal(duplicate.reused, true);
  assert.equal(createCount, 1);

  const paid = await checkPayment(database, provider, session.id, { paymentId: invoice.paymentId });
  assert.equal(paid.status, "paid");
  assert.equal(paid.entitlement, true);
  const paidAgain = await checkPayment(database, provider, session.id, { paymentId: invoice.paymentId });
  assert.equal(paidAgain.status, "paid");
  assert.equal(checkCount, 1);
  const entitlements = await database.find("entitlements", { assessmentId: assessment.id });
  assert.equal(entitlements.length, 1);
  await database.delete("entitlements", entitlements[0].id);
  const repaired = await checkPayment(database, provider, session.id, { paymentId: invoice.paymentId });
  assert.equal(repaired.status, "paid");
  assert.equal(repaired.entitlement, true);
  assert.equal(checkCount, 1, "a confirmed payment must repair entitlement without rechecking QPay");
  assert.equal((await database.find("entitlements", { assessmentId: assessment.id })).length, 1);

  const safe = safeAppLinks([
    { name: "Bad", link: "javascript:alert(1)" }, { name: "Data", link: "data:text/html,x" },
    { name: "HTTP", link: "http://bank.example/x" }, { name: "HTTPS", link: "https://bank.example/pay" },
    { name: "App", link: "bankapp://pay/1" }
  ], { allowedSchemes: ["bankapp"], allowedHosts: ["bank.example"] });
  assert.deepEqual(safe.map(item => item.name), ["HTTPS", "App"]);
  console.log("QPay API contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
