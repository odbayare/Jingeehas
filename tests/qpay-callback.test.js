"use strict";
const assert = require("node:assert/strict");
process.env.NODE_ENV = "test";
process.env.QPAY_API_BASE_URL = "https://merchant.qpay.test";
process.env.QPAY_CLIENT_ID = "client";
process.env.QPAY_CLIENT_SECRET = "secret";
process.env.QPAY_INVOICE_CODE = "invoice-code";
process.env.QPAY_CALLBACK_ORIGIN = "https://jingeehas.fit";
process.env.QPAY_ALLOWED_APP_SCHEMES = "bankapp";
process.env.QPAY_ALLOWED_HTTPS_HOSTS = "qpay.mn";

const { setDatabaseForTests } = require("../netlify/functions/_lib/store.js");
const { QPayClient, safeShortUrl, tokenExpiry } = require("../netlify/functions/_lib/qpay.js");
const { confirmCallbackPayment } = require("../netlify/functions/_lib/payment.js");
const callback = require("../netlify/functions/qpay-payment-callback.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");

function baseRows() {
  return { session: { id: "ws-callback", tokenHash: "hash", createdAt: "2026-07-27T00:00:00.000Z", expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null },
    assessment: { id: "wa-callback", sessionId: "ws-callback", status: "payment_pending", commercialFlowVersion: "prepaid_v2", questionnaireVersion: "v1", startedAt: null, safetyRoute: null },
    payment: { id: "wp-callback", sessionId: "ws-callback", assessmentId: "wa-callback", productCode: "WEIGHT_TEST_ONE_TIME", amount: 9900, status: "pending", invoiceId: "INV-CALLBACK", providerPaymentId: null, senderInvoiceNo: "S-CALLBACK", expiresAt: "2027-01-01T00:00:00.000Z", paidAt: null, qrText: "", qrImage: "", urls: [], createdAt: "2026-07-27T00:00:00.000Z", updatedAt: "2026-07-27T00:00:00.000Z" } };
}
function makeDb() { const db = new MemoryDatabaseAdapter(); const rows = baseRows(); return db.insert("sessions", rows.session).then(() => db.insert("assessments", rows.assessment)).then(() => db.insert("payments", rows.payment)).then(() => db); }

(async () => {
  const db = await makeDb(); setDatabaseForTests(db);
  const paidProvider = { async getPayment(id) { return { payment_id: id, payment_status: "PAID", payment_amount: 9900, payment_currency: "MNT", object_type: "INVOICE", object_id: "INV-CALLBACK" }; } };
  const confirmed = await confirmCallbackPayment(db, paidProvider, "QPAY-PAYMENT-1");
  assert.equal(confirmed.status, "paid"); assert.equal((await db.find("entitlements", { assessmentId: "wa-callback" })).length, 1);
  const duplicate = await confirmCallbackPayment(db, paidProvider, "QPAY-PAYMENT-1"); assert.equal(duplicate.status, "paid"); assert.equal((await db.find("entitlements", { assessmentId: "wa-callback" })).length, 1);

  const wrongAmount = await makeDb(); const wrongProvider = { async getPayment(id) { return { payment_id: id, payment_status: "PAID", payment_amount: 1, payment_currency: "MNT", object_type: "INVOICE", object_id: "INV-CALLBACK" }; } }; assert.equal(await confirmCallbackPayment(wrongAmount, wrongProvider, "QPAY-WRONG"), null); assert.equal((await wrongAmount.find("entitlements", {})).length, 0);

  assert.equal((await callback.handler({ httpMethod: "POST", queryStringParameters: { qpay_payment_id: "QPAY-PAYMENT-1" } })).statusCode, 405);
  const originalFetch = global.fetch; const requests = [];
  global.fetch = async (url, options = {}) => { requests.push({ url, options }); if (url.endsWith("/v2/auth/token")) return { ok: true, async json() { return { access_token: "token", expires_in: Math.floor(Date.now() / 1000) + 3600 }; } }; if (url.includes("/v2/payment/")) return { ok: true, async text() { return JSON.stringify({ payment_id: "QPAY-ENDPOINT", payment_status: "PAID", payment_amount: 9900, payment_currency: "MNT", object_type: "INVOICE", object_id: "INV-CALLBACK" }); } }; throw new Error("unexpected"); };
  const endpointDb = await makeDb(); setDatabaseForTests(endpointDb); const result = await callback.handler({ httpMethod: "GET", queryStringParameters: { qpay_payment_id: "QPAY-ENDPOINT" }, headers: { host: "jingeehas.fit" } }); assert.equal(result.statusCode, 200); assert.equal(result.body, "SUCCESS"); assert(requests.some(item => item.url.endsWith("/v2/payment/QPAY-ENDPOINT") && item.options.method === "GET")); assert.equal((await endpointDb.find("entitlements", {})).length, 1);

  const unknownDb = new MemoryDatabaseAdapter(); let unknownLookups = 0; setDatabaseForTests(unknownDb);
  global.fetch = async (url) => { if (url.endsWith("/v2/auth/token")) return { ok: true, async json() { return { access_token: "token", expires_in: 60 }; } }; if (url.includes("/v2/payment/")) { unknownLookups += 1; return { ok: true, async text() { return JSON.stringify({ payment_id: "QPAY-UNKNOWN", payment_status: "PAID", payment_amount: 9900, payment_currency: "MNT", object_type: "INVOICE", object_id: "INV-NONE" }); } }; } throw new Error("unexpected"); };
  for (let index = 0; index < 4; index += 1) { const limited = await callback.handler({ httpMethod: "GET", queryStringParameters: { qpay_payment_id: "QPAY-UNKNOWN" }, headers: { "x-forwarded-for": "198.51.100.20" } }); assert.equal(limited.statusCode, 200); assert.equal(limited.body, "SUCCESS"); }
  assert.equal(unknownLookups, 3); assert.equal((await unknownDb.find("qpay_callback_rate_limits", {})).every(row => !JSON.stringify(row).includes("QPAY-UNKNOWN") && !JSON.stringify(row).includes("198.51.100.20")), true);

  const invoiceClient = new QPayClient({ baseUrl: "https://merchant.qpay.test", clientId: "client", clientSecret: "secret", invoiceCode: "invoice-code", callbackOrigin: "https://jingeehas.fit", allowedSchemes: ["bankapp"], allowedHosts: ["qpay.mn"] });
  global.fetch = async (url, options = {}) => { if (url.endsWith("/v2/auth/token")) return { ok: true, async json() { return { access_token: "token", expires_in: Math.floor(Date.now() / 1000) + 3600 }; } }; return { ok: true, async text() { return JSON.stringify({ invoice_id: "INV-1", qr_text: "QR", qPay_deeplink: [{ name: "Bank", link: "bankapp://pay" }], qPay_shortUrl: "https://qpay.mn/i/INV-1" }); } }; };
  const invoice = await invoiceClient.createInvoice({ senderInvoiceNo: "S-1", amount: 9900 }); assert.equal(invoice.urls.length, 1); assert.equal(invoice.shortUrl, "https://qpay.mn/i/INV-1"); assert.equal(safeShortUrl("javascript:alert(1)", invoiceClient.config), null);
  assert.equal(tokenExpiry(Math.floor(Date.now() / 1000) + 60) > Date.now(), true); assert.equal(tokenExpiry(60) > Date.now(), true);
  global.fetch = originalFetch;
  console.log("QPay callback, response mapping, and token expiry tests passed");
})().catch(error => { console.error(error); process.exit(1); });
