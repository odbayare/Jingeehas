"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const app = require("../app.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { createAssessment } = require("../netlify/functions/_lib/assessment.js");
const { calculateAssessmentSafety } = require("../netlify/functions/_lib/safety.js");

(async () => {
  app._test.setComingSoon(false);
  const start = app.renderForPath("/assessment/start");
  for (const expected of ["Тестээ эхлүүлэх", "Зөв, буруу хариулт байхгүй. Өөрт хамгийн ойр санагдсан хариултаа сонгоорой.", "Таны хариултаас шалтгаалан зарим асуулт нэмэгдэж болно.", ">Эхлэх</button>"]) assert(start.includes(expected), expected);
  for (const removed of ['id="safety-form"', 'id="contact-email"', "9,900₮", "QPay", "10 минут", "12 / 40"]) assert(!start.includes(removed), removed);
  const legacyContact = app.renderForPath("/assessment/contact");
  assert(legacyContact.includes("QPay-аар 9,900₮ төлөөд тестээ эхлүүлэх"), "historical prepaid contact route remains available");
  const appSource = fs.readFileSync(require.resolve("../app.js"), "utf8");
  for (const removed of ["renderSafetyCheck", "submitSafety", "#safety-form", 'api("/.netlify/functions/weight-safety-gate"']) assert(!appSource.includes(removed), removed);
  const startFreeSource = /async function startFreeAssessment\(form\) \{[\s\S]*?\n\}/.exec(appSource)?.[0] || "";
  assert(startFreeSource.indexOf("await ensureSession();") < startFreeSource.indexOf("weight-assessment-create"), "free start creates or resumes the authenticated session before protected writes");
  assert(!startFreeSource.includes("safetyCheckId"), "public free creation does not send a pre-payment safety record");

  const database = new MemoryDatabaseAdapter(); const now = new Date("2026-07-20T00:00:00Z");
  await database.insert("sessions", { id: "ws-direct", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + 3600000).toISOString(), revokedAt: null });
  const assessment = await createAssessment(database, "ws-direct", { prepaid: true }, now);
  assert.equal(assessment.commercialFlowVersion, "prepaid_v2");
  assert.equal(assessment.status, "payment_pending");
  const safetyCheck = await database.get("safety_checks", assessment.safetyCheckId);
  assert.equal(safetyCheck.result.route, "pending_assessment");
  assert.equal(safetyCheck.result.category, "assessment_safety_questions");
  assert.equal(calculateAssessmentSafety({ "Q-AGE": 30, "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"] }).route, "eligible");
  assert.equal(calculateAssessmentSafety({ "Q-AGE": 30, "S1-S04": "Одоо идэвхтэй бодогдож байна" }).route, "urgent_self_harm");
  app._test.resetComingSoon();
  console.log("direct assessment start regression tests passed");
})().catch(error => { console.error(error); process.exit(1); });
