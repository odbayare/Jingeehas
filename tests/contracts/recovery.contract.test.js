"use strict";
process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 9).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "another-test-pepper-value-at-least-32-characters";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter } = require("../support/memory-database.js");
const { createSession, authenticateSession } = require("../../netlify/functions/_lib/session.js");
const { createAssessment, reportForSession } = require("../../netlify/functions/_lib/assessment.js");
const { saveRecoveryContacts, requestRecovery, confirmRecovery, validateContacts, recoveryEmail, RecoveryDeliveryClient,
  RECOVERY_SUBJECT, PHONE_ERROR, EMAIL_ERROR, EMAIL_ONLY_ERROR } = require("../../netlify/functions/_lib/recovery.js");
const { PRODUCT } = require("../../netlify/functions/_lib/config.js");
const { saveSafetyCheck } = require("../../netlify/functions/_lib/safety.js");

(async () => {
  assert.throws(() => validateContacts({ phone: "1" }), error => error.message === PHONE_ERROR);
  assert.throws(() => validateContacts({ email: "a" }), error => error.message === EMAIL_ERROR);
  assert.deepEqual(validateContacts({ phone: "99112233", email: "USER@example.com" }), { phone: "+97699112233", email: "user@example.com" });
  assert.throws(() => recoveryEmail({ phone: "99112233" }), error => error.message === EMAIL_ONLY_ERROR);

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

  const baseTime = new Date("2026-07-16T12:00:00.000Z");
  const context = { ip: "ip-1", session: "session-1" };
  let sent = null;
  const requested = await requestRecovery(database, { async send(payload) { sent = payload; } }, { email: "paid@example.com" }, context, baseTime);
  assert(sent && /^\d{6}$/.test(sent.code));
  assert.equal(sent.destination, "paid@example.com");
  assert(!Object.hasOwn(sent, "encryptedContact"));
  const challengeAfterSend = await database.get("recovery_challenges", requested.recoveryId);
  assert.equal(challengeAfterSend.deliveryStatus, "sent");
  await assert.rejects(() => requestRecovery(database, { async send() {} }, { email: "paid@example.com" }, context, baseTime), error => error.code === "rate_limited");
  let newest = null;
  const resentTime = new Date(baseTime.getTime() + 61_000);
  const resent = await requestRecovery(database, { async send(payload) { newest = payload; return { providerId: "provider-2" }; } }, { email: "paid@example.com" }, context, resentTime);
  assert.equal((await database.get("recovery_challenges", requested.recoveryId)).deliveryStatus, "superseded");
  await assert.rejects(() => confirmRecovery(database, { recoveryId: requested.recoveryId, code: sent.code }, resentTime), error => error.code === "invalid_recovery_code");
  assert.equal((await database.get("recovery_challenges", resent.recoveryId)).deliveryProviderId, "provider-2");
  const recovered = await confirmRecovery(database, { recoveryId: resent.recoveryId, code: newest.code }, new Date(resentTime.getTime() + 1_000));
  const cookie = recovered.cookie.split(";")[0];
  const session = await authenticateSession(database, { headers: { cookie } });
  const report = await reportForSession(database, session.id, assessment.id);
  assert.equal(report.entitled, true);
  assert.deepEqual(report.fullReport, { ok: true });
  await assert.rejects(() => confirmRecovery(database, { recoveryId: resent.recoveryId, code: newest.code }, new Date(resentTime.getTime() + 2_000)), error => error.code === "invalid_recovery_code");

  const unknown = await requestRecovery(database, { async send() { throw new Error("must not send"); } }, { email: "unknown@example.com" },
    { ip: "ip-2", session: "session-2" }, new Date(baseTime.getTime() + 130_000));
  assert.match(unknown.message, /Хэрэв/);

  const concurrentTime = new Date(baseTime.getTime() + 190_000);
  const concurrent = await Promise.allSettled([
    requestRecovery(database, { async send() { throw new Error("must not send"); } }, { email: "parallel@example.com" }, { ip: "ip-parallel", session: "session-a" }, concurrentTime),
    requestRecovery(database, { async send() { throw new Error("must not send"); } }, { email: "parallel@example.com" }, { ip: "ip-parallel", session: "session-b" }, concurrentTime)
  ]);
  assert.equal(concurrent.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(concurrent.filter(result => result.status === "rejected" && result.reason.code === "rate_limited").length, 1);

  let attemptCode = null;
  const attemptTime = new Date(baseTime.getTime() + 251_000);
  const attemptChallenge = await requestRecovery(database, { async send(payload) { attemptCode = payload.code; } }, { email: "paid@example.com" }, context, attemptTime);
  for (let index = 0; index < 5; index += 1) {
    await assert.rejects(() => confirmRecovery(database, { recoveryId: attemptChallenge.recoveryId, code: "000000" }, new Date(attemptTime.getTime() + index)), error => error.code === "invalid_recovery_code");
  }
  assert.equal((await database.get("recovery_challenges", attemptChallenge.recoveryId)).attempts, 5);
  await assert.rejects(() => confirmRecovery(database, { recoveryId: attemptChallenge.recoveryId, code: attemptCode }, new Date(attemptTime.getTime() + 6_000)), error => error.code === "invalid_recovery_code");

  let oneTimeCode = null;
  const oneTime = new Date(baseTime.getTime() + 312_000);
  const oneTimeChallenge = await requestRecovery(database, { async send(payload) { oneTimeCode = payload.code; } }, { email: "paid@example.com" }, context, oneTime);
  const confirmations = await Promise.allSettled([
    confirmRecovery(database, { recoveryId: oneTimeChallenge.recoveryId, code: oneTimeCode }, new Date(oneTime.getTime() + 1_000)),
    confirmRecovery(database, { recoveryId: oneTimeChallenge.recoveryId, code: oneTimeCode }, new Date(oneTime.getTime() + 1_000))
  ]);
  assert.equal(confirmations.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(confirmations.filter(result => result.status === "rejected" && result.reason.code === "invalid_recovery_code").length, 1);

  const originalFetch = globalThis.fetch;
  let resendRequest = null;
  globalThis.fetch = async (url, init) => { resendRequest = { url, init }; return { ok: true, json: async () => ({ id: "email-1" }) }; };
  try {
    const client = new RecoveryDeliveryClient({ RECOVERY_DELIVERY_API_URL: "https://api.resend.com/emails", RECOVERY_DELIVERY_API_KEY: "test-key",
      RECOVERY_SENDER_EMAIL: "no-reply@mail.jingeehas.fit", RECOVERY_SENDER_NAME: "Jingeehas", RECOVERY_CHANNEL: "email" });
    const delivered = await client.send({ destination: "owner@example.com", code: "123456", expiresInMinutes: 10 });
    assert.equal(delivered.providerId, "email-1");
    const resendBody = JSON.parse(resendRequest.init.body);
    assert.equal(resendRequest.url, "https://api.resend.com/emails");
    assert.equal(resendBody.subject, RECOVERY_SUBJECT);
    assert.equal(resendBody.from, "Jingeehas <no-reply@mail.jingeehas.fit>");
    assert.deepEqual(resendBody.to, ["owner@example.com"]);
    assert.match(resendBody.text, /123456/);
    assert.match(resendBody.text, /10 минут/);
    assert.match(resendBody.text, /хэнд ч бүү хэл/);
    assert(!/report|health|assessment/i.test(resendBody.text));
  } finally { globalThis.fetch = originalFetch; }
  console.log("recovery API contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
