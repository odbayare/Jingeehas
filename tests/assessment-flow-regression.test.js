"use strict";
const assert = require("node:assert/strict");
const questions = require("../questions.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { saveAssessment, completeAssessment } = require("../netlify/functions/_lib/assessment.js");

function defaultValue(question) {
  if (question.id === "Q-AGE") return 35;
  if (question.id === "Q-HEIGHT") return 170;
  if (question.id === "Q-WEIGHT") return 80;
  if (question.id === "Q-TARGET") return 70;
  if (question.id === "S1-S03" || question.id === "S1-S04") return "Үгүй";
  if (question.id === "S1-B01") return ["Аль нь ч үгүй"];
  if (question.id === "Q-METHOD-CURRENT") return ["Алхалт"];
  if (question.id === "Q-METHOD-PAST") return ["Хоолны дэглэм", "Дасгал хөдөлгөөн"];
  if (question.type === "number") return question.min;
  if (question.type === "multi") return [question.options[0]];
  if (question.type === "text") return "Өдөр тутмын хуваарьтай нийцээгүй тул тогтвортой үргэлжлээгүй.";
  return question.options[0];
}

function routedAnswers(overrides = {}) {
  const answers = { "Q-SEX": "Эрэгтэй", ...overrides };
  for (let pass = 0; pass < 4; pass += 1) {
    for (const question of questions.visibleQuestions(answers)) {
      if (answers[question.id] == null) answers[question.id] = defaultValue(question);
    }
  }
  return answers;
}

function assertRoute(name, overrides, requiredIds = [], excludedIds = []) {
  const answers = routedAnswers(overrides);
  const route = questions.visibleQuestions(answers);
  const ids = route.map(question => question.id);
  assert.equal(new Set(ids).size, ids.length, `${name}: duplicate questions`);
  assert(ids.length <= questions.MAX_ROUTED_QUESTION_COUNT, `${name}: route exceeds maximum`);
  for (const id of requiredIds) assert(ids.includes(id), `${name}: missing ${id}`);
  for (const id of excludedIds) assert(!ids.includes(id), `${name}: unexpected ${id}`);
  for (const question of route) assert.equal(questions.validateAnswer(question, answers[question.id]), "", `${name}: invalid ${question.id}`);
  return { answers, ids };
}

class ReportFailureDatabase extends MemoryDatabaseAdapter {
  async transaction(operations, options) {
    if (operations.some(operation => operation.table === "report_snapshots")) throw Object.assign(new Error("simulated report persistence failure"), { statusCode: 503 });
    return super.transaction(operations, options);
  }
}

async function seededAssessment(database, suffix) {
  const sessionId = `ws-${suffix}`;
  const assessmentId = `wa-${suffix}`;
  const now = new Date().toISOString();
  await database.insert("sessions", { id: sessionId, tokenHash: `hash-${suffix}`, createdAt: now, expiresAt: new Date(Date.now() + 3600000).toISOString(), revokedAt: null });
  await database.insert("assessments", { id: assessmentId, sessionId, safetyCheckId: `sc-${suffix}`, status: "draft", reportMode: null, safetyRoute: null, createdAt: now, updatedAt: now, completedAt: null });
  return { sessionId, assessmentId };
}

(async () => {
  const male = assertRoute("adult male", { "Q-SEX": "Эрэгтэй" }, ["Q-METHOD-PAST"], ["MC-GATE", "MC-01", "PREG-GATE", "MENO-GATE"]);
  assert(!questions.visibleQuestions({ ...male.answers, "MC-GATE": "Тийм, хамаарна", "MC-01": "Тогтмол" }).some(question => question.id === "MC-01"), "nested sex-specific questions must remain excluded even with stale child answers");
  const female = assertRoute("menstruating female", { "Q-SEX": "Эмэгтэй", "MC-GATE": "Тийм, хамаарна", "ALC-GATE": "Хааяа", "TOB-GATE": "Хааяа" }, ["MC-GATE", "MC-01", "PREG-GATE", "MENO-GATE", "ALC-01", "TOB-01"]);
  assert.equal(female.ids.length, questions.MAX_ROUTED_QUESTION_COUNT, "female full route defines the exact maximum");
  assertRoute("post-menopausal female", { "Q-SEX": "Эмэгтэй", "MC-GATE": "Үгүй, хамаарахгүй", "MENO-GATE": "Тийм, хамаарна" }, ["MENO-GATE"], ["MC-01"]);
  assertRoute("prefer not to answer", { "Q-SEX": "Хариулахгүй байхыг хүсэж байна" }, [], ["MC-GATE", "MC-01", "PREG-GATE", "MENO-GATE"]);
  assertRoute("no previous attempts", { "Q-METHOD-PAST": ["Ямар нэг арга хэрэглэж үзээгүй"] }, ["Q-METHOD-BARRIERS"], ["Q-METHOD-DURATION", "Q-METHOD-STOP", "Q-METHOD-RESULT", "Q-METHOD-REGAIN"]);
  assertRoute("multiple prior attempts", { "Q-METHOD-PAST": ["Хоолны дэглэм", "Дасгал хөдөлгөөн"] }, ["Q-METHOD-DURATION", "Q-METHOD-STOP", "Q-METHOD-RESULT", "Q-METHOD-REGAIN"]);
  assertRoute("medication supported", { "Q-METHOD-PAST": ["Жин хасах эм"], "Q-METHOD-MEDICATION": "Эмчийн хяналттай эм хэрэглэсэн" }, ["Q-METHOD-MEDICATION"]);
  assertRoute("emotional eating", { "Q-EMOTION": "Нэлээд нэмэгддэг" }, ["Q-EMOTION"]);
  assertRoute("sleep risk", { "Q-SLEEP-DURATION": "4 цагаас бага", "Q-SLEEP-QUALITY": "Өглөө ядарсан хэвээр байдаг" }, ["Q-SLEEP-DURATION", "Q-SLEEP-QUALITY"]);
  assertRoute("safety escalation", { "S1-S04": "Одоо идэвхтэй бодогдож байна" }, ["S1-S04"]);

  const database = new MemoryDatabaseAdapter();
  const seeded = await seededAssessment(database, "retry");
  const finalText = "Монгол кирилл хариулт: өмнөх арга удаан үргэлжлээгүй.";
  await saveAssessment(database, seeded.sessionId, { assessmentId: seeded.assessmentId, answers: { ...male.answers, "OPEN-PAST": finalText } });
  await saveAssessment(database, seeded.sessionId, { assessmentId: seeded.assessmentId, answers: { "OPEN-PAST": finalText } });
  const openRows = await database.find("assessment_answers", { assessmentId: seeded.assessmentId, questionId: "OPEN-PAST" });
  assert.equal(openRows.length, 1, "retry after a lost response must upsert one answer");
  assert.equal(openRows[0].value, finalText);
  const firstCompletion = await completeAssessment(database, seeded.sessionId, { assessmentId: seeded.assessmentId });
  const secondCompletion = await completeAssessment(database, seeded.sessionId, { assessmentId: seeded.assessmentId });
  assert.equal(firstCompletion.status, "complete");
  assert.equal(secondCompletion.status, "complete");
  assert.equal((await database.find("report_snapshots", { assessmentId: seeded.assessmentId })).length, 1, "completion must be idempotent");
  const report = await database.get("report_snapshots", seeded.assessmentId);
  assert(!report.fullReport.internalEvidenceMap.signals.some(item => item.questionId === "Q-SEX"), "routing intake must not become an identity claim");
  assert(!JSON.stringify(report.fullReport.influencingPatterns).includes("Q-SEX"), "public formulation must not expose routing intake");

  const failingDatabase = new ReportFailureDatabase();
  const failing = await seededAssessment(failingDatabase, "report-failure");
  await saveAssessment(failingDatabase, failing.sessionId, { assessmentId: failing.assessmentId, answers: { ...male.answers, "OPEN-PAST": finalText } });
  await assert.rejects(() => completeAssessment(failingDatabase, failing.sessionId, { assessmentId: failing.assessmentId }), /simulated report/);
  assert.equal((await failingDatabase.get("assessments", failing.assessmentId)).status, "draft", "report failure must not partially complete assessment");
  assert.equal((await failingDatabase.find("assessment_answers", { assessmentId: failing.assessmentId, questionId: "OPEN-PAST" })).length, 1, "report failure must not erase final answer");

  console.log("assessment flow regression and 10-profile route audit passed");
})().catch(error => { console.error(error); process.exit(1); });
