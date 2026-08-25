"use strict";

process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { PRODUCT } = require("../netlify/functions/_lib/config.js");
const { paymentLinks, safeShortUrl, QPayClient } = require("../netlify/functions/_lib/qpay.js");
const callback = require("../netlify/functions/qpay-payment-callback.js")._test;

(async () => {
  const qpayConfig = {
    baseUrl: "https://merchant.qpay.mn",
    clientId: "test",
    clientSecret: "test",
    invoiceCode: "TEST",
    callbackOrigin: "https://jingeehas.fit",
    allowedSchemes: [],
    allowedHosts: []
  };

  assert.equal(safeShortUrl("https://qpay.mn/q/test", qpayConfig), "https://qpay.mn/q/test");
  assert.equal(safeShortUrl("javascript:alert(1)", qpayConfig), "");
  assert.equal(safeShortUrl("https://evil.example/q/test", qpayConfig), "");

  const shortOnly = paymentLinks({ qPay_shortUrl: "https://qpay.mn/q/test", urls: [] }, qpayConfig);
  assert.equal(shortOnly.length, 1);
  assert.equal(shortOnly[0].kind, "qpay_short_url");
  assert.equal(shortOnly[0].description, "QPay төлбөрийн холбоос");

  const mixed = paymentLinks({
    qPay_shortUrl: "https://qpay.mn/q/test",
    urls: [{ name: "Khan", description: "Хаан банк", link: "khanbank://q?invoice=test" }]
  }, qpayConfig);
  assert.equal(mixed.length, 2);
  assert.equal(mixed[0].kind, "bank_app");
  assert.equal(mixed[1].kind, "qpay_short_url");

  const client = new QPayClient(qpayConfig);
  let requestBody;
  client.request = async (path, body) => {
    assert.equal(path, "/v2/invoice");
    requestBody = body;
    return { invoice_id: "inv-short", qPay_shortUrl: "https://qpay.mn/q/short", qr_text: "qr", qr_image: "image", urls: [] };
  };
  const invoice = await client.createInvoice({ senderInvoiceNo: "jh_callback_test", amount: PRODUCT.amount });
  assert(requestBody.callback_url.includes("/.netlify/functions/qpay-payment-callback?senderInvoiceNo=jh_callback_test"));
  assert.equal(invoice.urls[0].kind, "qpay_short_url");

  const database = new MemoryDatabaseAdapter();
  await database.insert("assessments", {
    id: "assessment-callback", sessionId: "session-callback", status: "complete",
    commercialFlowVersion: "free_assessment_postpaid_v1", safetyRoute: null,
    createdAt: "2026-08-25T00:00:00.000Z", updatedAt: "2026-08-25T00:00:00.000Z"
  });
  await database.insert("payments", {
    id: "payment-callback", sessionId: "session-callback", assessmentId: "assessment-callback",
    productCode: PRODUCT.code, amount: PRODUCT.amount, status: "expired",
    senderInvoiceNo: "jh_callback_expired", invoiceId: "invoice-callback",
    expiresAt: "2026-08-25T00:15:00.000Z", createdAt: "2026-08-25T00:00:00.000Z",
    updatedAt: "2026-08-25T00:15:01.000Z", paidAt: null, urls: []
  });

  let checks = 0;
  const provider = {
    async checkPayment(invoiceId) {
      checks += 1;
      assert.equal(invoiceId, "invoice-callback");
      return { rows: [{ payment_id: "provider-paid", payment_status: "PAID", payment_amount: PRODUCT.amount }] };
    }
  };
  const paid = await callback.confirmCallbackPayment(database, provider, "jh_callback_expired", new Date("2026-08-25T01:00:00.000Z"));
  assert.equal(paid.state, "paid", "provider callback must recover an exact paid invoice even after local UI expiry");
  assert.equal(paid.payment.status, "paid");
  assert.equal(paid.payment.entitlement, true);
  assert.equal(checks, 1);
  assert.equal((await database.find("entitlements", { assessmentId: "assessment-callback", status: "active" })).length, 1);

  const paidAgain = await callback.confirmCallbackPayment(database, provider, "jh_callback_expired", new Date("2026-08-25T01:01:00.000Z"));
  assert.equal(paidAgain.state, "paid");
  assert.equal(checks, 1, "idempotent callback must not re-check an already confirmed payment");

  await database.insert("assessments", {
    id: "assessment-mismatch", sessionId: "session-mismatch", status: "complete",
    commercialFlowVersion: "free_assessment_postpaid_v1", safetyRoute: null,
    createdAt: "2026-08-25T00:00:00.000Z", updatedAt: "2026-08-25T00:00:00.000Z"
  });
  await database.insert("payments", {
    id: "payment-mismatch", sessionId: "session-mismatch", assessmentId: "assessment-mismatch",
    productCode: PRODUCT.code, amount: PRODUCT.amount, status: "pending",
    senderInvoiceNo: "jh_callback_mismatch", invoiceId: "invoice-mismatch",
    expiresAt: "2026-08-25T02:00:00.000Z", createdAt: "2026-08-25T00:00:00.000Z",
    updatedAt: "2026-08-25T00:00:00.000Z", paidAt: null, urls: []
  });
  const mismatch = await callback.confirmCallbackPayment(database, {
    async checkPayment() { return { rows: [{ payment_id: "wrong", payment_status: "PAID", payment_amount: 9900 }] }; }
  }, "jh_callback_mismatch", new Date("2026-08-25T01:00:00.000Z"));
  assert.equal(mismatch.state, "retry");
  assert.equal((await database.find("entitlements", { assessmentId: "assessment-mismatch" })).length, 0);

  assert.equal(callback.callbackReference({ queryStringParameters: { senderInvoiceNo: "jh_callback_expired" } }), "jh_callback_expired");
  assert.equal(callback.callbackReference({ queryStringParameters: { senderInvoiceNo: "x".repeat(100) } }), "");
  assert.equal((await callback.confirmCallbackPayment(database, provider, "missing-reference")).state, "ignored");

  console.log("QPay mobile handoff and provider callback tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
