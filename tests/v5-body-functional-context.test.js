"use strict";

const assert = require("node:assert/strict");
const questions = require("../questions.js");
const { buildEvidence, buildFullReport } = require("../netlify/functions/_lib/report.js");
const { calculateAssessmentSafety } = require("../netlify/functions/_lib/safety.js");

const V4 = questions.HOUSEHOLD_CONTEXT_QUESTIONNAIRE_VERSION || "jingeehas-production-2026-08-v4-household-context";
const V5 = questions.BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION;

assert.equal(V5, "jingeehas-production-2026-09-v5-body-functional-context", "V5 version constant must be exact");
assert.equal(questions.QUESTIONNAIRE_VERSION, V5, "new assessments must use V5");

const v5Ids = new Set(questions.visibleQuestions({}, V5).map(question => question.id));
for (const id of ["Q-WAIST", "Q-FUNCTION", "Q-MEDICAL-MONITORING", "REPRO-STATUS", "Q-ALCOHOL-FOOD"]) {
  assert(questions.questionById(id, V5), `${id} must exist in V5`);
}
for (const id of ["Q-FOOD-FEELING", "Q-GLUCOSE", "Q-BLOOD-PRESSURE", "MC-GATE", "ALC-GATE", "TOB-GATE", "TOB-01", "PREG-GATE", "PREG-BREASTFEEDING", "MENO-GATE", "S1-S03-TYPE", "S1-S03-FREQUENCY", "OPEN-PAST"]) {
  assert.equal(questions.questionById(id, V5), null, `${id} must be retired in V5`);
  assert(questions.questionById(id, V4), `${id} must remain available in V4`);
}

assert.equal(questions.questionById("Q-WAIST", V5).required, false);
assert.equal(questions.questionById("Q-WAIST", V5).unit, "см");
assert.equal(
  questions.questionById("Q-FUNCTION", V5).text,
  "Сүүлийн 3 сарын хугацаанд дараах өдөр тутмын үйлдлүүдээс аль нь танд мэдэгдэхүйц хэцүү байсан бэ?"
);

const reproBase = { "Q-SEX": "Эмэгтэй" };
assert(questions.visibleQuestions(reproBase, V5).some(question => question.id === "REPRO-STATUS"));
assert(!questions.visibleQuestions(reproBase, V5).some(question => question.id === "MC-01"));
assert(questions.visibleQuestions({ ...reproBase, "REPRO-STATUS": ["Сарын тэмдгийн мөчлөгтэй"] }, V5).some(question => question.id === "MC-01"));

const noMaintenance = {
  "Q-METHOD-PAST": ["Хоолны дэглэм"],
  "Q-METHOD-DURATION": "2–8 долоо хоног",
  "Q-METHOD-RESULT": "Жин буурсан",
  "Q-METHOD-REGAIN": "Нэлээд нэмэгдсэн"
};
assert(!questions.visibleQuestions(noMaintenance, V5).some(question => question.id === "Q-MAINTENANCE-PLAN"));
const maintenanceEligible = { ...noMaintenance, "Q-METHOD-DURATION": "6–12 сар" };
assert(questions.visibleQuestions(maintenanceEligible, V5).some(question => question.id === "Q-MAINTENANCE-PLAN"));

function rows(answers) {
  return Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
}
function coreSnapshot(answers) {
  const evidence = buildEvidence(rows(answers), [], { questionnaireVersion: V5 });
  const report = buildFullReport(evidence, new Date("2026-09-07T00:00:00.000Z"), { questionnaireVersion: V5 });
  return {
    patterns: report.internalEvidenceMap.patternEvidence.map(item => ({ id: item.id, score: item.score, supported: item.supported })),
    interactions: report.interactionSummary.map(item => item.id)
  };
}

const core = {
  "Q-MEAL-RHYTHM": "Тогтмол биш",
  "Q-HUNGER": "Хэт өлссөний дараа анзаардаг",
  "Q-SATIETY": "Заримдаа хэцүү",
  "Q-PORTION": ["Амттан"],
  "Q-EMOTION": "Нэлээд нэмэгддэг",
  "Q-CUE": ["Хоол харагдах"],
  "Q-SLEEP-DURATION": "4–6 цаг",
  "Q-SLEEP-QUALITY": "Тааруу",
  "Q-MOVEMENT": "Бага",
  "Q-METHOD-PAST": ["Хоолны дэглэм"],
  "Q-METHOD-DURATION": "2–8 долоо хоног",
  "Q-METHOD-RESULT": "Тодорхой өөрчлөлт ажиглагдаагүй",
  "Q-METHOD-BARRIERS": ["Цагийн хуваарь"]
};
const bodyContext = {
  ...core,
  "Q-HEIGHT": 170,
  "Q-WEIGHT": 90,
  "Q-TARGET": 75,
  "Q-WAIST": 105,
  "Q-FUNCTION": ["Алхах эсвэл шатаар өгсөх", "Бөхийх, гутлаа өмсөх зэрэг хөдөлгөөн"],
  "Q-MEDICAL-MONITORING": "Цусны даралт"
};
assert.deepEqual(coreSnapshot(core), coreSnapshot(bodyContext), "body/function context must not change core pattern scoring or counted interactions");

const maintenanceAnswers = {
  "Q-METHOD-PAST": ["Хоолны дэглэм"],
  "Q-METHOD-DURATION": "6–12 сар",
  "Q-METHOD-RESULT": "Жин буурсан",
  "Q-METHOD-REGAIN": "Нэлээд нэмэгдсэн",
  "Q-MAINTENANCE-PLAN": "Үгүй, өөр хувилбар бэлдээгүй"
};
const maintenanceEvidence = buildEvidence(rows(maintenanceAnswers), [], { questionnaireVersion: V5 });
assert(maintenanceEvidence.signals.some(row => row.questionId === "Q-MAINTENANCE-PLAN" && row.signal === "maintenance_gap_explicit" && row.effect === 4), "structured maintenance answer must create the explicit maintenance-gap anchor");

const recentCompensatory = calculateAssessmentSafety({ "S1-S03": "Сүүлийн 28 хоногт байсан" });
assert.equal(recentCompensatory.route, "eating_behavior_professional");
const urgentSelfHarm = calculateAssessmentSafety({ "S1-S04": "Хааяа", "S1-S04-NOW": "Тийм" });
assert.equal(urgentSelfHarm.route, "urgent_self_harm");

console.log("v5-body-functional-context.test.js PASS");
