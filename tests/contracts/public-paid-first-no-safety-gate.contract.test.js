"use strict";
process.env.NODE_ENV = "test";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const app = require("../../app.js");
const { MemoryDatabaseAdapter } = require("../support/memory-database.js");
const { createAssessment } = require("../../netlify/functions/_lib/assessment.js");
const { calculateAssessmentSafety } = require("../../netlify/functions/_lib/safety.js");

(async () => {
  app._test.setComingSoon(false);
  const start = app.renderForPath("/assessment/start");
  const legacy = app.renderForPath("/assessment/contact");
  for (const expected of ["Тест үнэлгээгээ эхлүүлэх", 'id="contact-email"', "QPay-аар төлөөд тестээ эхлүүлэх"]) assert(start.includes(expected), expected);
  for (const forbidden of ['id="safety-form"', "Төлбөрөөс өмнөх аюулгүй байдлын шалгалт", "Үргэлжлүүлэхэд тохиромжтой эсэхийг шалгах"]) assert(!start.includes(forbidden), forbidden);
  assert.equal(legacy, start);

  const source = fs.readFileSync(require.resolve("../../app.js"), "utf8");
  for (const forbidden of ["renderSafetyCheck", "submitSafety", "#safety-form", 'api("/.netlify/functions/weight-safety-gate"']) assert(!source.includes(forbidden), forbidden);

  const database = new MemoryDatabaseAdapter();
  const now = new Date("2026-07-29T00:00:00.000Z");
  await database.insert("sessions", { id: "ws-no-pre-gate", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + 3600000).toISOString(), revokedAt: null });
  const assessment = await createAssessment(database, "ws-no-pre-gate", { prepaid: true }, now);
  assert.equal(assessment.commercialFlowVersion, "prepaid_v2");
  assert.equal(assessment.status, "payment_pending");
  const placeholder = await database.get("safety_checks", assessment.safetyCheckId);
  assert.deepEqual(placeholder.result, { route: "pending_assessment", mode: "pending", category: "assessment_safety_questions" });

  assert.equal(calculateAssessmentSafety({ "Q-AGE": 30, "S1-S03": "Үгүй", "S1-S04": "Одоо идэвхтэй бодогдож байна", "S1-B01": ["Аль нь ч үгүй"] }).route, "urgent_self_harm");
  app._test.resetComingSoon();
  console.log("public paid-first flow has no interactive pre-payment safety gate");
})().catch(error => { console.error(error); process.exit(1); });
