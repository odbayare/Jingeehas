"use strict";

process.env.NODE_ENV = "production";
const assert = require("node:assert/strict");
const questions = require("../questions.js");
const { questionAnalytics } = require("../netlify/functions/_lib/question-analytics.js");
const { saveAssessment, completeAssessment } = require("../netlify/functions/_lib/assessment.js");
const { markAnswersRecordedSafe } = require("../netlify/functions/_lib/question-progress.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");

const versions = [
  questions.LEGACY_QUESTIONNAIRE_VERSION,
  questions.PREVIOUS_QUESTIONNAIRE_VERSION,
  questions.ROUTING_SAFETY_QUESTIONNAIRE_VERSION,
  questions.HOUSEHOLD_CONTEXT_QUESTIONNAIRE_VERSION,
  questions.BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION
];
const V4 = questions.HOUSEHOLD_CONTEXT_QUESTIONNAIRE_VERSION;
const V5 = questions.BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION;

function index(version, id) { return questions.orderedQuestions(version).findIndex(question => question.id === id); }

for (const version of versions) {
  const ordered = questions.orderedQuestions(version);
  assert.equal(new Set(ordered.map(question => question.id)).size, ordered.length, `${version} order has no duplicates`);
  for (const question of ordered) {
    if (question.parent && ordered.some(candidate => candidate.id === question.parent)) {
      assert(index(version, question.parent) < index(version, question.id), `${version}: ${question.parent} precedes ${question.id}`);
    }
    assert.equal(questionAnalytics(question.id, version).questionOrder, index(version, question.id) + 1, `${version}: analytics shares canonical order`);
  }
}

assert(index(V4, "MC-GATE") < index(V4, "MC-01"), "V4 keeps MC-GATE before MC-01");
assert.equal(index(V4, "REPRO-STATUS"), -1, "V4 does not gain REPRO-STATUS");
assert(index(V5, "REPRO-STATUS") < index(V5, "MC-01"), "V5 moves MC-01 after REPRO-STATUS");
const femaleMenstrual = { "Q-SEX": "Эмэгтэй", "REPRO-STATUS": ["Сарын тэмдгийн мөчлөгтэй"] };
const femaleOther = { "Q-SEX": "Эмэгтэй", "REPRO-STATUS": ["Аль нь ч биш"] };
assert(questions.visibleQuestions(femaleMenstrual, V5).some(question => question.id === "MC-01"));
assert(!questions.visibleQuestions(femaleOther, V5).some(question => question.id === "MC-01"));
assert(!questions.visibleQuestions({ "Q-SEX": "Эрэгтэй" }, V5).some(question => ["REPRO-STATUS", "MC-01"].includes(question.id)));

for (const id of ["Q-TARGET", "Q-WAIST", "Q-FUNCTION", "Q-MEDICAL-MONITORING"]) {
  const question = questions.questionById(id, V5);
  assert.equal(questions.isBlankAnswerValue(question, null), true);
  assert.equal(questions.isBlankAnswerValue(question, undefined), true);
  assert.equal(questions.isBlankAnswerValue(question, ""), true);
  assert.equal(questions.isBlankAnswerValue(question, []), true);
  assert.equal(questions.isBlankAnswerValue(question, "Хариулахгүй"), false);
  assert.equal(questions.isBlankAnswerValue(question, ["Хариулахгүй"]), false);
}

(async () => {
  const database = new MemoryDatabaseAdapter();
  const now = new Date("2026-09-08T00:00:00.000Z");
  await database.insert("sessions", { id: "ws-v5-hotfix", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null });
  await database.insert("assessments", { id: "wa-v5-hotfix", sessionId: "ws-v5-hotfix", status: "draft", commercialFlowVersion: "free_assessment_postpaid_v1",
    questionnaireVersion: V5, startedAt: null, createdAt: now.toISOString(), updatedAt: now.toISOString() });

  for (const id of ["Q-TARGET", "Q-WAIST", "Q-FUNCTION", "Q-MEDICAL-MONITORING"]) {
    const result = await saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { [id]: null } }, now);
    assert.deepEqual(result.savedQuestionIds, []);
    assert.deepEqual(result.clearedQuestionIds, [id]);
    assert.deepEqual(result.processedQuestionIds, [id]);
    assert.equal(await database.get("assessment_answers", `wa-v5-hotfix:${id}`), null);
  }
  await assert.rejects(
    () => saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { "Q-AGE": null } }, now),
    error => error.code === "invalid_answer"
  );

  const refusal = await saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { "Q-MEDICAL-MONITORING": "Хариулахгүй" } }, now);
  assert.deepEqual(refusal.savedQuestionIds, ["Q-MEDICAL-MONITORING"]);
  assert.equal((await database.get("assessment_answers", "wa-v5-hotfix:Q-MEDICAL-MONITORING")).value, "Хариулахгүй");
  const cleared = await saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { "Q-MEDICAL-MONITORING": null } }, now);
  assert(cleared.clearedQuestionIds.includes("Q-MEDICAL-MONITORING"));
  assert.equal(await database.get("assessment_answers", "wa-v5-hotfix:Q-MEDICAL-MONITORING"), null, "answer-back-clear deletes the row");

  await saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { "Q-SEX": "Эмэгтэй", "REPRO-STATUS": ["Сарын тэмдгийн мөчлөгтэй"], "MC-01": "Тогтмол" } }, now);
  const reproChanged = await saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { "REPRO-STATUS": ["Аль нь ч биш"] } }, now);
  assert(reproChanged.clearedQuestionIds.includes("MC-01"));
  assert.equal(await database.get("assessment_answers", "wa-v5-hotfix:MC-01"), null, "changing REPRO prunes stale MC answer");
  await saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { "REPRO-STATUS": ["Сарын тэмдгийн мөчлөгтэй"], "MC-01": "Тогтмол" } }, now);
  const sexChanged = await saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { "Q-SEX": "Эрэгтэй" } }, now);
  assert(sexChanged.clearedQuestionIds.includes("REPRO-STATUS"));
  assert(sexChanged.clearedQuestionIds.includes("MC-01"));

  const event = { headers: { host: "jingeehas.fit", "user-agent": "Mozilla/5.0" } };
  const blank = await saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { "Q-WAIST": null } }, now);
  await markAnswersRecordedSafe(database, await database.get("assessments", "wa-v5-hotfix"), blank.savedQuestionIds, event, now);
  assert.equal((await database.find("assessment_question_progress", { assessmentId: "wa-v5-hotfix" })).some(row => row.questionId === "Q-WAIST" && row.answeredAt), false, "blank skip never advances answered_at");
  const substantive = await saveAssessment(database, "ws-v5-hotfix", { assessmentId: "wa-v5-hotfix", answers: { "Q-WAIST": 88 } }, now);
  await markAnswersRecordedSafe(database, await database.get("assessments", "wa-v5-hotfix"), substantive.savedQuestionIds, event, now);
  assert((await database.find("assessment_question_progress", { assessmentId: "wa-v5-hotfix" })).some(row => row.questionId === "Q-WAIST" && row.answeredAt));

  const u06 = require("./fixtures/v5-virtual-users.js").find(profile => profile.id === "U06");
  const reportDatabase = new MemoryDatabaseAdapter();
  await reportDatabase.insert("sessions", { id: "ws-u06", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null });
  await reportDatabase.insert("safety_checks", { id: "sc-u06", sessionId: "ws-u06", result: { route: "pending_assessment" }, createdAt: now.toISOString() });
  await reportDatabase.insert("assessments", { id: "wa-u06", sessionId: "ws-u06", status: "in_progress", commercialFlowVersion: "free_assessment_postpaid_v1",
    questionnaireVersion: V5, safetyCheckId: "sc-u06", startedAt: now.toISOString(), createdAt: now.toISOString(), updatedAt: now.toISOString() });
  for (const question of questions.visibleQuestions(u06.answers, V5)) {
    await saveAssessment(reportDatabase, "ws-u06", { assessmentId: "wa-u06", answers: { [question.id]: u06.blank.includes(question.id) ? null : u06.answers[question.id] } }, now);
  }
  const u06Completed = await completeAssessment(reportDatabase, "ws-u06", { assessmentId: "wa-u06" }, now);
  assert.equal(u06Completed.status, "complete", "duplicate pattern-pair interactions must not block completion");

  console.log("v5-sequential-hotfix.test.js PASS");
})().catch(error => { console.error(error); process.exit(1); });
