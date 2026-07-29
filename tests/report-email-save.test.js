"use strict";
process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 3).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "report-email-test-pepper-123456789012345";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { saveEntitledReportEmail, decryptContact } = require("../netlify/functions/_lib/recovery.js");

(async () => {
  const db = new MemoryDatabaseAdapter();
  const assessment = { id: "wa-report-email", sessionId: "ws-email", status: "complete", commercialFlowVersion: "prepaid_v2" };
  await db.insert("assessments", assessment);
  await db.insert("payments", { id: "wp-email", assessmentId: assessment.id, sessionId: assessment.sessionId, status: "paid", amount: 9900 });
  await db.insert("entitlements", { id: `${assessment.id}:WEIGHT_TEST_ONE_TIME`, assessmentId: assessment.id, paymentId: "wp-email", status: "active" });
  const first = await saveEntitledReportEmail(db, assessment.sessionId, assessment, { email: "Owner@example.com" }, new Date("2026-07-24T00:00:00Z"));
  assert.equal(first.alreadySaved, false);
  assert.equal(decryptContact(first.contact.encryptedContact), "owner@example.com");
  assert.equal(first.contact.paymentId, "wp-email");
  assert.equal(first.contact.entitlementId, `${assessment.id}:WEIGHT_TEST_ONE_TIME`);
  assert.equal((await db.find("recovery_contacts", { assessmentId: assessment.id })).length, 1);
  const retry = await saveEntitledReportEmail(db, assessment.sessionId, assessment, { email: "owner@example.com" });
  assert.equal(retry.alreadySaved, true);
  assert.equal((await db.find("recovery_contacts", { assessmentId: assessment.id })).length, 1);
  await assert.rejects(() => saveEntitledReportEmail(db, "other-session", assessment, { email: "bad" }), error => error.code === "invalid_email");
  console.log("report email save tests passed");
})().catch(error => { console.error(error); process.exit(1); });
