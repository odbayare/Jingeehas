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
  assert(start.includes('id="contact-email"'), "start route opens the assessment setup directly");
  for (const removed of ["safety-form", "Төлбөрөөс өмнөх аюулгүй байдлын шалгалт", "Тест үнэлгээ танд тохирох эсэхийг эхэлж шалгана", "Тохирох эсэхийг шалгах"]) {
    assert(!start.includes(removed), removed);
  }
  const appSource = fs.readFileSync(require.resolve("../app.js"), "utf8");
  assert(!appSource.includes("function renderSafetyGate"));
  assert(!appSource.includes('api("/.netlify/functions/weight-safety-gate"'));

  const database = new MemoryDatabaseAdapter(); const now = new Date("2026-07-20T00:00:00Z");
  await database.insert("sessions", { id: "ws-direct", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + 3600000).toISOString(), revokedAt: null });
  const assessment = await createAssessment(database, "ws-direct", {}, now);
  const safetyCheck = await database.get("safety_checks", assessment.safetyCheckId);
  assert.equal(safetyCheck.result.route, "pending_assessment");
  assert.equal(calculateAssessmentSafety({ "Q-AGE": 30, "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"] }).route, "eligible");
  assert.equal(calculateAssessmentSafety({ "Q-AGE": 30, "S1-S04": "Одоо идэвхтэй бодогдож байна" }).route, "urgent_self_harm");
  app._test.resetComingSoon();
  console.log("direct assessment start regression tests passed");
})().catch(error => { console.error(error); process.exit(1); });
