"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const app = require("../app.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { createAssessment } = require("../netlify/functions/_lib/assessment.js");

(async () => {
  app._test.setComingSoon(false);
  const start = app.renderForPath("/assessment/start");
  assert(start.includes('id="contact-form"'), "start route opens payment preparation directly");
  assert(start.includes("9,900₮"));
  assert(!start.includes("Үргэлжлүүлэхэд тохиромжтой эсэхийг шалгах"));
  const appSource = fs.readFileSync(require.resolve("../app.js"), "utf8");
  assert(!appSource.includes('api("/.netlify/functions/weight-safety-gate"'));
  const submitContactSource = /async function submitContact\(form\) \{[\s\S]*?\n\}/.exec(appSource)?.[0] || "";
  assert(submitContactSource.includes("await ensureSession();"), "contact submit creates or resumes the authenticated session before protected writes");
  assert(!submitContactSource.includes("weight-recovery-contact-save"), "public checkout does not save recovery contact before payment");
  assert(submitContactSource.includes("weight-assessment-create"), "public checkout creates the assessment shell");

  const database = new MemoryDatabaseAdapter(); const now = new Date("2026-07-20T00:00:00Z");
  await database.insert("sessions", { id: "ws-direct", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + 3600000).toISOString(), revokedAt: null });
  const assessment = await createAssessment(database, "ws-direct", {}, now);
  assert.equal(assessment.safetyCheckId, null, "prepaid shell does not create a safety row");
  assert.equal((await database.find("safety_checks", { sessionId: "ws-direct" })).length, 0);
  app._test.resetComingSoon();
  console.log("direct assessment start regression tests passed");
})().catch(error => { console.error(error); process.exit(1); });
