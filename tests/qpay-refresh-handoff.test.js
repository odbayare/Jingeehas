"use strict";
const assert = require("node:assert/strict");
process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "pepper-value-with-more-than-32-characters";
const { QPayClient } = require("../netlify/functions/_lib/qpay.js");
const { issueAccessHandoff, redeemAccessHandoff } = require("../netlify/functions/_lib/handoff.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");

function dbFixture() {
  const db = new MemoryDatabaseAdapter();
  return Promise.all([
    db.insert("sessions", { id: "ws-handoff", tokenHash: "hash", createdAt: "2026-07-27T00:00:00.000Z", expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null }),
    db.insert("assessments", { id: "wa-handoff", sessionId: "ws-handoff", status: "payment_pending", commercialFlowVersion: "prepaid_v2", questionnaireVersion: "v1", startedAt: null, safetyRoute: null }),
    db.insert("payments", { id: "wp-handoff", sessionId: "ws-handoff", assessmentId: "wa-handoff", productCode: "WEIGHT_TEST_ONE_TIME", amount: 9900, status: "pending", invoiceId: "INV-HANDOFF", providerPaymentId: null, createdAt: "2026-07-27T00:00:00.000Z", updatedAt: "2026-07-27T00:00:00.000Z", expiresAt: "2027-01-01T00:00:00.000Z" })
  ]).then(() => db);
}

(async () => {
  const originalFetch = global.fetch; const requests = [];
  const client = new QPayClient({ baseUrl: "https://merchant.qpay.test", clientId: "client", clientSecret: "secret", invoiceCode: "invoice", callbackOrigin: "https://jingeehas.fit", allowedSchemes: [], allowedHosts: [] });
  client.cachedToken = { value: "old-access", refreshToken: "old-refresh", expiresAt: Date.now() + 1000 };
  global.fetch = async (url, options = {}) => { requests.push({ url, options }); return { ok: true, async json() { return { access_token: "new-access", expires_in: 60 }; } }; };
  assert.equal(await client.token(), "new-access");
  const refresh = requests[0]; assert.equal(refresh.options.method, "POST"); assert.equal(refresh.options.headers.authorization, "Bearer old-refresh"); assert.equal("body" in refresh.options, false); assert.equal(refresh.options.headers.authorization.includes("Basic"), false);

  const fallback = new QPayClient(client.config); fallback.cachedToken = { value: "old", refreshToken: "refresh", expiresAt: Date.now() + 1000 }; const fallbackCalls = [];
  global.fetch = async (url, options = {}) => { fallbackCalls.push({ url, options }); if (url.endsWith("/v2/auth/refresh")) return { ok: false, status: 401, async json() { return {}; } }; return { ok: true, async json() { return { access_token: "fresh", expires_in: Math.floor(Date.now() / 1000) + 120 }; } }; };
  assert.equal(await fallback.token(), "fresh"); assert.equal(fallbackCalls.length, 2); assert.equal(fallback.cachedToken.refreshToken, null);

  const db = await dbFixture(); const payment = await db.get("payments", "wp-handoff"); const handoff = await issueAccessHandoff(db, payment, new Date("2026-07-27T01:00:00Z"));
  assert(handoff.link.includes("/assessment/recover#token=")); assert(!handoff.link.includes("?")); assert(handoff.code.length >= 20);
  const stored = (await db.find("access_handoffs", { paymentId: "wp-handoff" }))[0]; assert(stored); assert(!stored.encryptedToken.includes(handoff.link)); assert(!JSON.stringify(stored).includes(handoff.code));
  const token = decodeURIComponent(handoff.link.split("#token=")[1]); const redeemed = await redeemAccessHandoff(db, token, { headers: { "x-forwarded-for": "198.51.100.3" } }, new Date("2026-07-27T02:00:00Z"));
  assert.equal(redeemed.status, "ok"); assert.equal(redeemed.nextRoute, "/assessment/payment"); assert.equal((await db.find("assessment_sessions", { assessmentId: "wa-handoff", source: "recovery" })).length, 1);
  const second = await redeemAccessHandoff(db, token, { headers: { "x-forwarded-for": "198.51.100.3" } }, new Date("2026-07-27T02:01:00Z")); assert.equal(second.status, "invalid"); assert.equal((await db.find("entitlements", {})).length, 0);
  global.fetch = originalFetch;
  console.log("QPay refresh, callback abuse guard, and cross-browser handoff tests passed");
})().catch(error => { console.error(error); process.exit(1); });
