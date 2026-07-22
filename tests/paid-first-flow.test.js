"use strict";
process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "paid-first-test-recovery-pepper-1234567890";

const assert = require("node:assert/strict");
const app = require("../app.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { saveSafetyCheck } = require("../netlify/functions/_lib/safety.js");
const { saveRecoveryContacts } = require("../netlify/functions/_lib/recovery.js");
const { createAssessment, saveAssessment, completeAssessment, reportForSession } = require("../netlify/functions/_lib/assessment.js");
const { createInvoice, checkPayment } = require("../netlify/functions/_lib/payment.js");
const { nextRoute } = require("../netlify/functions/_lib/commercial-flow.js");

(async () => {
  const database = new MemoryDatabaseAdapter(); const now = new Date("2026-07-21T08:00:00Z");
  await database.insert("sessions", { id: "ws-prepaid", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + 3600000).toISOString(), revokedAt: null });
  const blocked = await saveSafetyCheck(database, "ws-prepaid", { age: 30, selfHarm: "Одоо идэвхтэй бодогдож байна", acuteMedical: ["Аль нь ч үгүй"] }, now);
  assert.notEqual(blocked.route, "eligible");
  assert.equal((await database.find("payments", {})).length, 0, "blocked safety route creates no invoice");

  const safety = await saveSafetyCheck(database, "ws-prepaid", { age: 30, selfHarm: "Үгүй", acuteMedical: ["Аль нь ч үгүй"], compensatoryBehavior: "Үгүй", medicalSuitability: "Үргэлжлүүлэхэд тохиромжтой" }, now);
  const contact = await saveRecoveryContacts(database, "ws-prepaid", { email: "paid-first@example.com" }, now);
  const assessment = await createAssessment(database, "ws-prepaid", { prepaid: true, safetyCheckId: safety.safetyCheckId, recoveryContactGroupId: contact.contactGroupId }, now);
  assert.equal(assessment.commercialFlowVersion, "prepaid_v2");
  assert.equal(assessment.status, "payment_pending"); assert.equal(assessment.startedAt, null);
  assert.equal(await nextRoute(database, assessment), "/assessment/payment");
  await assert.rejects(() => saveAssessment(database, "ws-prepaid", { assessmentId: assessment.id, answers: { "Q-AGE": 30 } }, now), error => error.code === "payment_required");
  await assert.rejects(() => completeAssessment(database, "ws-prepaid", { assessmentId: assessment.id }, now), error => error.code === "payment_required");
  await assert.rejects(() => reportForSession(database, "ws-prepaid", assessment.id), error => error.code === "payment_required");

  let creates = 0;
  const provider = { async createInvoice() { creates += 1; return { invoiceId: "INV-PREPAID-1", qrText: "stub", urls: [{ name: "Тест банк", link: "https://example.test/pay" }] }; },
    async checkPayment() { return { rows: [{ payment_status: "PAID", payment_amount: 9900, payment_id: "provider-paid-1" }] }; } };
  const first = await createInvoice(database, provider, "ws-prepaid", { assessmentId: assessment.id }, now);
  const retry = await createInvoice(database, provider, "ws-prepaid", { assessmentId: assessment.id }, now);
  assert.equal(first.paymentId, retry.paymentId); assert.equal(creates, 1, "duplicate checkout creates one invoice");
  const paid = await checkPayment(database, provider, "ws-prepaid", { paymentId: first.paymentId }, new Date(now.getTime() + 1000));
  assert.equal(paid.nextRoute, "/assessment/questions"); assert.equal((await database.find("entitlements", { assessmentId: assessment.id })).length, 1);
  const started = await saveAssessment(database, "ws-prepaid", { assessmentId: assessment.id, answers: { "Q-AGE": 30 } }, new Date(now.getTime() + 2000));
  assert.equal(started.status, "in_progress"); assert.equal(started.startedAt, "2026-07-21T08:00:02.000Z");
  const refreshed = await saveAssessment(database, "ws-prepaid", { assessmentId: assessment.id, answers: { "Q-AGE": 31 } }, new Date(now.getTime() + 3000));
  assert.equal(refreshed.startedAt, started.startedAt, "started_at is immutable after first persisted answer");

  const prep = app.renderForPath("/assessment/contact");
  for (const copy of ["Тест үнэлгээ болон хувийн тайлангаа авах", "Тест үнэлгээ болон бүрэн хувийн тайлан", "9,900₮", "QPay-аар төлөөд тестээ эхлүүлэх"]) assert(prep.includes(copy), copy);
  app._test.setState({ commercialFlowVersion: "prepaid_v2", assessmentStatus: "complete", report: { fullReport: {} } });
  assert(!app.renderForPath("/assessment/completed").includes("Бүрэн тайлангийн үнэ"));
  app._test.setState({ questionsAuthorized: false });
  assert(!app.renderForPath("/assessment/questions").includes("Q-AGE"), "question UI fails closed before server authorization");
  assert(!String(app.renderForPath).includes("create-invoice"), "report route has no second payment control");
  assert.equal(app.PRODUCT.amount, 9900);

  await database.insert("sessions", { id: "ws-legacy", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + 3600000).toISOString(), revokedAt: null });
  const legacy = await createAssessment(database, "ws-legacy", {}, now);
  assert.equal(legacy.status, "draft"); assert.equal(legacy.commercialFlowVersion, "legacy_postpaid_v1");
  await saveAssessment(database, "ws-legacy", { assessmentId: legacy.id, answers: { "Q-AGE": 30 } }, now);

  console.log("paid-first assessment flow tests passed");
})().catch(error => { console.error(error); process.exit(1); });
