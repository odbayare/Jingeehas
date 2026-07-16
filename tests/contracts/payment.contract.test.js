"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter } = require("../../netlify/functions/_lib/store.js");
const { createSession } = require("../../netlify/functions/_lib/session.js");
const { createAssessment } = require("../../netlify/functions/_lib/assessment.js");
const { createInvoice, checkPayment } = require("../../netlify/functions/_lib/payment.js");
const { safeAppLinks } = require("../../netlify/functions/_lib/qpay.js");
const { PRODUCT } = require("../../netlify/functions/_lib/config.js");

(async () => {
  const database = new MemoryDatabaseAdapter();
  const { session } = await createSession(database);
  const assessment = await createAssessment(database, session.id);
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
  assert.equal((await database.find("entitlements", { assessmentId: assessment.id })).length, 1);

  const safe = safeAppLinks([
    { name: "Bad", link: "javascript:alert(1)" }, { name: "Data", link: "data:text/html,x" },
    { name: "HTTP", link: "http://bank.example/x" }, { name: "HTTPS", link: "https://bank.example/pay" },
    { name: "App", link: "bankapp://pay/1" }
  ], { allowedSchemes: ["bankapp"], allowedHosts: ["bank.example"] });
  assert.deepEqual(safe.map(item => item.name), ["HTTPS", "App"]);
  console.log("QPay API contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
