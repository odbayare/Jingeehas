"use strict";
process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 9).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "another-test-pepper-value-at-least-32-characters";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter } = require("../support/memory-database.js");
const { createSession, authenticateSession } = require("../../netlify/functions/_lib/session.js");
const { createAssessment, reportForSession } = require("../../netlify/functions/_lib/assessment.js");
const { saveRecoveryContacts, requestRecovery, confirmRecovery, validateContacts, PHONE_ERROR, EMAIL_ERROR } = require("../../netlify/functions/_lib/recovery.js");
const { PRODUCT } = require("../../netlify/functions/_lib/config.js");
const { saveSafetyCheck } = require("../../netlify/functions/_lib/safety.js");

(async () => {
  assert.throws(() => validateContacts({ phone: "1" }), error => error.message === PHONE_ERROR);
  assert.throws(() => validateContacts({ email: "a" }), error => error.message === EMAIL_ERROR);
  assert.deepEqual(validateContacts({ phone: "99112233", email: "USER@example.com" }), { phone: "+97699112233", email: "user@example.com" });

  const database = new MemoryDatabaseAdapter();
  const original = await createSession(database);
  const safety = await saveSafetyCheck(database, original.session.id, { age: 31, selfHarm: "Үгүй", acuteMedical: ["Аль нь ч үгүй"], compensatoryBehavior: "Үгүй", medicalSuitability: "Үргэлжлүүлэхэд тохиромжтой" });
  const group = await saveRecoveryContacts(database, original.session.id, { email: "paid@example.com" });
  const assessment = await createAssessment(database, original.session.id, { recoveryContactGroupId: group.contactGroupId, safetyCheckId: safety.safetyCheckId });
  const paymentId = "payment-recovery";
  const entitlementId = `${assessment.id}:${PRODUCT.code}`;
  await database.insert("payments", { id: paymentId, sessionId: original.session.id, assessmentId: assessment.id, productCode: PRODUCT.code, amount: PRODUCT.amount, status: "paid" });
  await database.insert("entitlements", { id: entitlementId, sessionId: original.session.id, assessmentId: assessment.id, paymentId, productCode: PRODUCT.code, status: "active", grantedAt: new Date().toISOString() });
  const contacts = await database.find("recovery_contacts", { assessmentId: assessment.id });
  await database.update("recovery_contacts", contacts[0].id, { paymentId, entitlementId });
  await database.insert("report_snapshots", { id: assessment.id, assessmentId: assessment.id, sessionId: original.session.id, reportMode: "limited", safetyRoute: null, initialView: {}, fullReport: { ok: true }, createdAt: new Date().toISOString() });

  let sent = null;
  const requested = await requestRecovery(database, { async send(payload) { sent = payload; } }, { email: "paid@example.com" }, "ip-1");
  assert(sent && /^\d{6}$/.test(sent.code));
  assert.equal(sent.destination, "paid@example.com");
  assert(!Object.hasOwn(sent, "encryptedContact"));
  const challengeAfterSend = await database.get("recovery_challenges", requested.recoveryId);
  assert.equal(challengeAfterSend.deliveryStatus, "sent");
  let newest = null;
  const resent = await requestRecovery(database, { async send(payload) { newest = payload; return { providerId: "provider-2" }; } }, { email: "paid@example.com" }, "ip-1");
  assert.equal((await database.get("recovery_challenges", requested.recoveryId)).deliveryStatus, "superseded");
  await assert.rejects(() => confirmRecovery(database, { recoveryId: requested.recoveryId, code: sent.code }), error => error.code === "invalid_recovery_code");
  assert.equal((await database.get("recovery_challenges", resent.recoveryId)).deliveryProviderId, "provider-2");
  const recovered = await confirmRecovery(database, { recoveryId: resent.recoveryId, code: newest.code });
  const cookie = recovered.cookie.split(";")[0];
  const session = await authenticateSession(database, { headers: { cookie } });
  const report = await reportForSession(database, session.id, assessment.id);
  assert.equal(report.entitled, true);
  assert.deepEqual(report.fullReport, { ok: true });
  await assert.rejects(() => confirmRecovery(database, { recoveryId: resent.recoveryId, code: newest.code }), error => error.code === "invalid_recovery_code");

  const unknown = await requestRecovery(database, { async send() { throw new Error("must not send"); } }, { email: "unknown@example.com" }, "ip-2");
  assert.match(unknown.message, /Хэрэв/);
  console.log("recovery API contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
