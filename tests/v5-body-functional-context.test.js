"use strict";

const assert = require("node:assert/strict");
const questions = require("../questions.js");
const { buildEvidence, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");
const { mappingCoverage } = require("../netlify/functions/_lib/report-signals.js");
const { calculateAssessmentSafety } = require("../netlify/functions/_lib/safety.js");
const { deriveBodyFunctionalContext } = require("../netlify/functions/_lib/body-context.js");
const { v5ProfessionalGuidance } = require("../netlify/functions/_lib/v5-context.js");
const { enrichV5BodyContext } = require("../netlify/functions/weight-assessment-complete.js");
const { assignCurrentQuestionnaireToNewAssessment } = require("../netlify/functions/weight-assessment-create.js");

const V4 = questions.HOUSEHOLD_CONTEXT_QUESTIONNAIRE_VERSION || "jingeehas-production-2026-08-v4-household-context";
const V5 = questions.BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION;

assert.equal(V5, "jingeehas-production-2026-09-v5-body-functional-context", "V5 version constant must be exact");
assert.equal(questions.CURRENT_QUESTIONNAIRE_VERSION, V5, "new assessments must use V5");
assert.equal(questions.QUESTIONNAIRE_VERSION, V4, "compatibility alias must preserve V4 historical callers");

for (const id of ["Q-WAIST", "Q-FUNCTION", "Q-MEDICAL-MONITORING", "REPRO-STATUS", "Q-ALCOHOL-FOOD"]) {
  assert(questions.questionById(id, V5), `${id} must exist in V5`);
}
for (const id of ["Q-FOOD-FEELING", "Q-GLUCOSE", "Q-BLOOD-PRESSURE", "MC-GATE", "ALC-GATE", "TOB-GATE", "TOB-01", "PREG-GATE", "PREG-BREASTFEEDING", "MENO-GATE", "S1-S03-TYPE", "S1-S03-FREQUENCY", "OPEN-PAST"]) {
  assert.equal(questions.questionById(id, V5), null, `${id} must be retired in V5`);
  assert(questions.questionById(id, V4), `${id} must remain available in V4`);
}

assert.equal(questions.questionById("Q-WAIST", V5).required, false);
assert.equal(questions.questionById("Q-WAIST", V5).unit, "см");
assert(questions.questionById("Q-WAIST", V5).text.includes("Мэдэхгүй бол алгасаж болно"));
assert.equal(
  questions.questionById("Q-FUNCTION", V5).text,
  "Сүүлийн 3 сарын хугацаанд дараах өдөр тутмын үйлдлүүдээс аль нь танд мэдэгдэхүйц хэцүү байсан бэ?"
);
assert.equal(
  questions.validateAnswer(questions.questionById("Q-FUNCTION", V5), ["Аль нь ч биш", "Алхах эсвэл шатаар өгсөх"], { version: V5 }),
  "Зөв хариулт сонгоно уу."
);

const reproBase = { "Q-SEX": "Эмэгтэй" };
assert(questions.visibleQuestions(reproBase, V5).some(question => question.id === "REPRO-STATUS"));
assert(!questions.visibleQuestions(reproBase, V5).some(question => question.id === "MC-01"));
assert(questions.visibleQuestions({ ...reproBase, "REPRO-STATUS": ["Сарын тэмдгийн мөчлөгтэй"] }, V5).some(question => question.id === "MC-01"));
assert.equal(
  questions.validateAnswer(questions.questionById("REPRO-STATUS", V5), ["Аль нь ч биш", "Хөхүүл"], { answers: reproBase, version: V5 }),
  "Зөв хариулт сонгоно уу."
);

const noMaintenance = {
  "Q-METHOD-PAST": ["Хоолны дэглэм"],
  "Q-METHOD-DURATION": "2–8 долоо хоног",
  "Q-METHOD-RESULT": "Жин буурсан",
  "Q-METHOD-REGAIN": "Нэлээд нэмэгдсэн"
};
assert(!questions.visibleQuestions(noMaintenance, V5).some(question => question.id === "Q-MAINTENANCE-PLAN"));
const maintenanceEligible = { ...noMaintenance, "Q-METHOD-DURATION": "6–12 сар" };
assert(questions.visibleQuestions(maintenanceEligible, V5).some(question => question.id === "Q-MAINTENANCE-PLAN"));

const compensatoryRoute = questions.visibleQuestions({ "S1-S03": "Сүүлийн 28 хоногт байсан" }, V5);
assert.equal(compensatoryRoute.at(-1).id, "S1-B01", "recent compensatory behavior must stop before commercial method-history questions after higher-priority safety triage");
assert(!compensatoryRoute.some(question => question.id === "Q-METHOD-CURRENT"));
const selfHarmRoute = questions.visibleQuestions({ "S1-S03": "Үгүй", "S1-S04": "Хааяа" }, V5);
assert.equal(selfHarmRoute.at(-1).id, "S1-S04-NOW", "recent self-harm screen must stop at immediate-risk follow-up");
assert(!selfHarmRoute.some(question => question.id === "S1-B01"));
const acuteRoute = questions.visibleQuestions({ "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Ухаан балартах"] }, V5);
assert.equal(acuteRoute.at(-1).id, "S1-B01", "acute medical signal must terminate commercial routing");
const safeRoute = questions.visibleQuestions({ "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"] }, V5);
assert(safeRoute.some(question => question.id === "Q-METHOD-CURRENT"), "non-triggering safety answers must preserve the commercial questionnaire");
const historicalCompensatoryRoute = questions.visibleQuestions({ "S1-S03": "Сүүлийн 28 хоногт байсан" }, V4);
assert(historicalCompensatoryRoute.some(question => question.id === "S1-S03-TYPE"), "V4 safety branching must remain unchanged");
assert(historicalCompensatoryRoute.some(question => question.id === "Q-METHOD-CURRENT"), "V4 commercial route must remain unchanged");

const allV5Questions = questions.QUESTIONS.map(question => questions.questionById(question.id, V5)).filter(Boolean);
assert.deepEqual(mappingCoverage(allV5Questions).unmappedQuestions, []);
assert.deepEqual(mappingCoverage(allV5Questions).unmappedOptions, []);

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

const derivedBody = deriveBodyFunctionalContext(bodyContext);
assert.equal(derivedBody.bmi, 31.14);
assert.equal(derivedBody.waistToHeightRatio, 0.618);
assert.equal(derivedBody.targetGapKg, 15);
assert.equal(derivedBody.diagnostic, false);
assert.equal(derivedBody.counted, false);
assert(derivedBody.functionalFlags.includes("functional_walking_constraint"));

const maintenanceAnswers = {
  "Q-METHOD-PAST": ["Хоолны дэглэм"],
  "Q-METHOD-DURATION": "6–12 сар",
  "Q-METHOD-RESULT": "Жин буурсан",
  "Q-METHOD-REGAIN": "Нэлээд нэмэгдсэн",
  "Q-MAINTENANCE-PLAN": "Үгүй, өөр хувилбар бэлдээгүй"
};
const maintenanceEvidence = buildEvidence(rows(maintenanceAnswers), [], { questionnaireVersion: V5 });
assert(maintenanceEvidence.signals.some(row => row.questionId === "Q-MAINTENANCE-PLAN" && row.signal === "maintenance_gap_explicit" && row.effect === 4), "structured maintenance answer must create the explicit maintenance-gap anchor");
const maintenanceReport = buildFullReport(maintenanceEvidence, new Date("2026-09-07T00:00:00.000Z"), { questionnaireVersion: V5 });
assert(maintenanceReport.internalEvidenceMap.patternEvidence.some(item => item.id === "previous_attempt_sustainability" && item.supported), "structured maintenance evidence must activate the repaired maintenance pattern when all gates are met");

const guidance = v5ProfessionalGuidance({ "Q-MEDICAL-MONITORING": "Хоёуланг нь", "REPRO-STATUS": ["Хөхүүл"] });
assert.equal(guidance.length, 3);
assert(guidance.join(" ").includes("Цусан дахь сахараа"));
assert(guidance.join(" ").includes("Цусны даралтаа"));
assert(guidance.join(" ").includes("хөхүүл үед"));

const recentCompensatory = calculateAssessmentSafety({ "S1-S03": "Сүүлийн 28 хоногт байсан" });
assert.equal(recentCompensatory.route, "eating_behavior_professional");
const urgentSelfHarm = calculateAssessmentSafety({ "S1-S04": "Хааяа", "S1-S04-NOW": "Тийм" });
assert.equal(urgentSelfHarm.route, "urgent_self_harm");

async function runtimeContracts() {
  const updateCalls = [];
  const versionDb = { update: async (table, id, patch) => { updateCalls.push({ table, id, patch }); return { id, ...patch }; } };
  const fresh = { id: "fresh_v5", questionnaireVersion: V4 };
  await assignCurrentQuestionnaireToNewAssessment(versionDb, fresh, [], new Date("2026-09-07T01:00:00.000Z"));
  assert.equal(fresh.questionnaireVersion, V5, "fresh assessment must be assigned V5");
  assert.equal(updateCalls.length, 1);
  const resumed = { id: "resume_v4", questionnaireVersion: V4 };
  await assignCurrentQuestionnaireToNewAssessment(versionDb, resumed, [{ id: "resume_v4" }], new Date("2026-09-07T01:00:00.000Z"));
  assert.equal(resumed.questionnaireVersion, V4, "resumed V4 assessment must not be upgraded");
  assert.equal(updateCalls.length, 1, "resume must not write a version upgrade");

  const enrichmentAnswers = {
    ...core,
    "Q-HEIGHT": 170,
    "Q-WEIGHT": 90,
    "Q-TARGET": 75,
    "Q-WAIST": 105,
    "Q-FUNCTION": ["Алхах эсвэл шатаар өгсөх"],
    "Q-MEDICAL-MONITORING": "Цусны даралт",
    "REPRO-STATUS": ["Хөхүүл", "Цэвэршилтийн шилжилтийн үе эсвэл цэвэршсэн"]
  };
  const baseEvidence = buildEvidence(rows(core), [], { questionnaireVersion: V5 });
  const snapshot = { assessmentId: "a_v5", fullReport: buildFullReport(baseEvidence, new Date("2026-09-07T00:00:00.000Z"), { questionnaireVersion: V5 }) };
  const enrichmentDb = {
    get: async (table, id) => table === "report_snapshots" && id === "a_v5" ? snapshot : null,
    find: async (table, filters) => table === "assessment_answers" && filters.assessmentId === "a_v5" ? rows(enrichmentAnswers) : [],
    update: async (table, id, patch) => { assert.equal(table, "report_snapshots"); assert.equal(id, "a_v5"); snapshot.fullReport = patch.fullReport; return { ...snapshot }; }
  };
  const assessment = { id: "a_v5", questionnaireVersion: V5, reportMode: "sufficient" };
  await enrichV5BodyContext(enrichmentDb, assessment);
  await enrichV5BodyContext(enrichmentDb, assessment);
  const bodyFactors = snapshot.fullReport.contextualFactors.filter(item => item.title === "Биеийн суурь хэмжилтийн мэдээлэл");
  assert.equal(bodyFactors.length, 1, "retry must not duplicate body factor");
  const functionalFactors = snapshot.fullReport.contextualFactors.filter(item => item.title === "Өдөр тутмын хөдөлгөөний нөхцөл");
  assert.equal(functionalFactors.length, 1, "retry must not duplicate functional factor");
  assert(snapshot.fullReport.professionalGuidance.includes("Цусны даралтаа"));
  assert(snapshot.fullReport.professionalGuidance.includes("хөхүүл үед"));
  const safePublic = JSON.stringify(publicReport(snapshot.fullReport));
  assert(safePublic.includes("Биеийн суурь хэмжилтийн мэдээлэл"));
  assert(!safePublic.includes("bodyContext"));
  assert(!safePublic.includes("functional_walking_constraint"), "internal functional ID must be removed by public report sanitization");
}

runtimeContracts().then(() => console.log("v5-body-functional-context.test.js PASS")).catch(error => { console.error(error); process.exitCode = 1; });
