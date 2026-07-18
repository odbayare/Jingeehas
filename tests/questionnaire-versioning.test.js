"use strict";

const assert = require("node:assert/strict");
const questions = require("../questions.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { createAssessment, saveAssessment } = require("../netlify/functions/_lib/assessment.js");

function route(answers, version = questions.QUESTIONNAIRE_VERSION) {
  return questions.visibleQuestions(answers, version);
}

(async () => {
  const none = { "Q-METHOD-PAST": ["Ямар нэг арга хэрэглэж үзээгүй"] };
  assert(!route(none).some(question => question.id === "Q-METHOD-LONGEST"));
  assert.equal(questions.autoLinkedLongestMethod(none), null);

  const single = { "Q-METHOD-PAST": ["Өөр арга"] };
  assert(!route(single).some(question => question.id === "Q-METHOD-LONGEST"), "one selected method must auto-bind without UI friction");
  assert.equal(questions.autoLinkedLongestMethod(single), "Өөр арга");

  const multi = { "Q-METHOD-PAST": ["Дасгал хөдөлгөөн", "Өөр арга", "Хоолны дэглэм"] };
  const longest = route(multi).find(question => question.id === "Q-METHOD-LONGEST");
  assert(longest?.required);
  assert.deepEqual(longest.options, multi["Q-METHOD-PAST"], "dynamic options must be the selected set only");
  assert.equal(questions.validateAnswer(longest, "Алхалт", { answers: multi }), "Зөв хариулт сонгоно уу.");
  assert.equal(questions.validateAnswer(longest, "Өөр арга", { answers: multi }), "");
  assert(!route(multi, questions.LEGACY_QUESTIONNAIRE_VERSION).some(question => question.id === "Q-METHOD-LONGEST"), "legacy route must not inject the new question");

  const database = new MemoryDatabaseAdapter();
  const now = new Date("2026-07-18T00:00:00.000Z");
  await database.insert("sessions", { id: "ws-version", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: "2026-07-19T00:00:00.000Z", revokedAt: null });
  await database.insert("safety_checks", { id: "sc-version", sessionId: "ws-version", result: { route: "eligible" }, createdAt: now.toISOString() });
  const created = await createAssessment(database, "ws-version", { safetyCheckId: "sc-version" }, now);
  assert.equal(created.questionnaireVersion, questions.QUESTIONNAIRE_VERSION, "new assessments must pin the current questionnaire version");

  await database.insert("assessments", { id: "wa-legacy-draft", sessionId: "ws-version", status: "draft", createdAt: now.toISOString(), updatedAt: now.toISOString() });
  const savedLegacy = await saveAssessment(database, "ws-version", { assessmentId: "wa-legacy-draft", answers: { "Q-METHOD-PAST": ["Хоолны дэглэм", "Дасгал хөдөлгөөн"] } }, now);
  assert.equal(savedLegacy.questionnaireVersion, undefined, "legacy draft must retain its original version marker");
  await assert.rejects(
    () => saveAssessment(database, "ws-version", { assessmentId: "wa-legacy-draft", answers: { "Q-METHOD-LONGEST": "Дасгал хөдөлгөөн" } }, now),
    error => error.code === "invalid_question"
  );

  console.log("questionnaire method-link versioning tests passed");
})().catch(error => { console.error(error); process.exit(1); });
