"use strict";
const assert = require("node:assert/strict");
process.env.NODE_ENV = "test";
const { createInvoice } = require("../netlify/functions/_lib/payment.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");

async function fixture(status, entitled = true) {
  const db = new MemoryDatabaseAdapter();
  await db.insert("sessions", { id: "ws-paid-check", tokenHash: "hash", createdAt: "2026-07-27T00:00:00.000Z", expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null });
  await db.insert("assessments", { id: "wa-paid-check", sessionId: "ws-paid-check", status, commercialFlowVersion: "prepaid_v2", questionnaireVersion: "v1", startedAt: null, safetyRoute: null });
  if (entitled) await db.insert("entitlements", { id: "ent-paid-check", assessmentId: "wa-paid-check", paymentId: "pay-paid-check", status: "active", grantedAt: "2026-07-27T00:00:00.000Z" });
  return db;
}

(async () => {
  let providerCalls = 0;
  const inProgress = await fixture("in_progress");
  const complete = await fixture("complete");
  await assert.rejects(() => createInvoice(inProgress, { async createInvoice() { providerCalls += 1; } }, "ws-paid-check", { assessmentId: "wa-paid-check" }), error => ["already_entitled", "assessment_incomplete"].includes(error.code));
  await assert.rejects(() => createInvoice(complete, { async createInvoice() { providerCalls += 1; } }, "ws-paid-check", { assessmentId: "wa-paid-check" }), error => ["already_entitled", "assessment_incomplete"].includes(error.code));
  assert.equal(providerCalls, 0);
  const pending = await fixture("payment_pending", false); let created = 0;
  const result = await createInvoice(pending, { async createInvoice() { created += 1; return { invoiceId: "INV-PENDING", qrText: "qr", urls: [] }; } }, "ws-paid-check", { assessmentId: "wa-paid-check" });
  assert.equal(created, 1); assert.equal(result.invoiceId, "INV-PENDING");
  const app = require("fs").readFileSync("app.js", "utf8");
  assert(app.includes("payment-empty-state")); assert(app.includes("Нүүр хуудас руу буцах")); assert(app.includes("error?.body?.nextRoute"));
  console.log("already-paid checkout blank-state tests passed");
})().catch(error => { console.error(error); process.exit(1); });
