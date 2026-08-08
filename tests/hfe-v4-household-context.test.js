"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const questions = require("../questions.js");
const app = require("../app.js");
const { buildEvidence, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");
const { CONTEXT_OPTION_FLAGS, deriveHouseholdContext } = require("../netlify/functions/_lib/household-context.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { saveAssessment } = require("../netlify/functions/_lib/assessment.js");

const V3 = questions.ROUTING_SAFETY_QUESTIONNAIRE_VERSION;
const V4 = questions.QUESTIONNAIRE_VERSION;
const householdOptions = questions.questionById("HFE-HOUSEHOLD", V4).options;
const contextQuestion = questions.questionById("HFE-CONTEXT", V4);
const contextOptions = contextQuestion.options;
const allContextOptions = Object.keys(CONTEXT_OPTION_FLAGS);

function rows(answers) {
  return Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
}

function reportFor(answers, version = V4) {
  const evidence = buildEvidence(rows(answers), [], { questionnaireVersion: version });
  return { evidence, report: buildFullReport(evidence, new Date("2026-08-08T00:00:00.000Z"), { questionnaireVersion: version }) };
}

function coreSnapshot(value) {
  const { evidence, report } = value;
  return {
    rawScores: report.internalEvidenceMap.patternEvidence.map(item => ({ id: item.id, score: item.score })),
    normalizedScores: report.internalEvidenceMap.patternEvidence.map(item => ({ id: item.id, score: item.score, threshold: item.threshold })),
    activePatternIds: report.internalEvidenceMap.patternEvidence.filter(item => item.supported).map(item => item.id),
    patternRank: report.internalEvidenceMap.patternEvidence.map(item => item.id),
    patternCount: report.internalEvidenceMap.patternEvidence.filter(item => item.supported).length,
    protective: evidence.protective.map(item => ({ questionId: item.questionId, signal: item.signal, effect: item.effect })),
    neutral: Boolean(report.neutralResult),
    countedInteractionIds: report.interactionSummary.map(item => item.id),
    countedInteractionCount: report.interactionSummary.length
  };
}

assert.equal(V4, "jingeehas-production-2026-08-v4-household-context", "hfe-v4-version-isolation");
assert.equal(questions.QUESTIONS.filter(question => question.id.startsWith("HFE-")).length, 2, "HFE V1 must contain exactly two questions");
for (const version of [questions.LEGACY_QUESTIONNAIRE_VERSION, questions.PREVIOUS_QUESTIONNAIRE_VERSION, V3]) {
  assert(!questions.visibleQuestions({}, version).some(question => question.id.startsWith("HFE-")), "hfe-old-versions-do-not-show-new-questions");
  assert.equal(deriveHouseholdContext({}, version).status, "not_assessed", "historical HFE must be not_assessed");
}

const household = questions.questionById("HFE-HOUSEHOLD", V4);
assert.equal(questions.validateAnswer(household, ["Ганцаараа", "Хүүхэдтэй"], { version: V4 }), "Зөв хариулт сонгоно уу.", "hfe-household-alone-exclusive");
assert.equal(questions.validateAnswer(household, ["Хань эсвэл хамтрагчтай", "Хүүхэдтэй", "Эцэг эх, төрөл садантай", "Бусад хүнтэй"], { version: V4 }), "");
assert.equal(questions.validateAnswer(contextQuestion, ["Дээрхээс аль нь ч тогтмол тохиолддоггүй", contextOptions[0]], { answers: { "HFE-HOUSEHOLD": ["Хүүхэдтэй"] }, version: V4 }), "Зөв хариулт сонгоно уу.", "hfe-context-none-exclusive");
assert.equal(questions.validateAnswer(contextQuestion, ["Хариулахгүй", contextOptions[0]], { answers: { "HFE-HOUSEHOLD": ["Хүүхэдтэй"] }, version: V4 }), "Зөв хариулт сонгоно уу.");
assert.equal(questions.validateAnswer(contextQuestion, allContextOptions, { answers: { "HFE-HOUSEHOLD": ["Хүүхэдтэй"] }, version: V4 }), "", "all eight factual conditions must be selectable");

assert(!questions.visibleQuestions({ "HFE-HOUSEHOLD": ["Ганцаараа"], "HFE-CONTEXT": allContextOptions }, V4).some(question => question.id === "HFE-CONTEXT"), "hfe-context-hidden-for-alone");
assert(questions.visibleQuestions({ "HFE-HOUSEHOLD": ["Хүүхэдтэй"] }, V4).some(question => question.id === "HFE-CONTEXT"));
assert.deepEqual(deriveHouseholdContext({ "HFE-HOUSEHOLD": ["Ганцаараа"], "HFE-CONTEXT": allContextOptions }, V4).flags, [], "stale context must be ignored for alone profile");

app._test.setState({ questionnaireVersion: V4, answers: { "HFE-HOUSEHOLD": ["Хүүхэдтэй"], "HFE-CONTEXT": allContextOptions } });
app._test.updateAnswer({ dataset: { question: "HFE-HOUSEHOLD" }, value: "Ганцаараа", checked: true });
assert.deepEqual(app._test.getState().answers["HFE-HOUSEHOLD"], ["Ганцаараа"], "UI must select alone exclusively");
assert.equal(app._test.getState().answers["HFE-CONTEXT"], undefined, "hfe-stale-context-pruned-after-back-navigation");
app._test.setState({ questionnaireVersion: V4, answers: { "HFE-CONTEXT": [contextOptions[0]] } });
app._test.updateAnswer({ dataset: { question: "HFE-CONTEXT" }, value: "Дээрхээс аль нь ч тогтмол тохиолддоггүй", checked: true });
assert.deepEqual(app._test.getState().answers["HFE-CONTEXT"], ["Дээрхээс аль нь ч тогтмол тохиолддоггүй"], "UI none selection must be exclusive");

const coreAnswers = {
  "Q-MEAL-RHYTHM": "Тогтмол биш",
  "Q-HUNGER": "Хэт өлссөний дараа анзаардаг",
  "Q-CUE": ["Хоол харагдах", "Бусад хүн идэж байх"],
  "Q-METHOD-PAST": ["Хоолны дэглэм"],
  "Q-METHOD-DURATION": "2–8 долоо хоног",
  "Q-METHOD-BARRIERS": ["Гэр бүл эсвэл орчны нөлөө", "Цагийн хуваарь"]
};
const livesAlone = reportFor({ ...coreAnswers, "HFE-HOUSEHOLD": ["Ганцаараа"] });
const historical = reportFor(coreAnswers, V3);
const noConstraint = reportFor({ ...coreAnswers, "HFE-HOUSEHOLD": ["Хань эсвэл хамтрагчтай"], "HFE-CONTEXT": ["Дээрхээс аль нь ч тогтмол тохиолддоггүй"] });
const everyContext = reportFor({ ...coreAnswers, "HFE-HOUSEHOLD": ["Хань эсвэл хамтрагчтай", "Хүүхэдтэй"], "HFE-CONTEXT": allContextOptions });
assert.deepEqual(coreSnapshot(livesAlone), coreSnapshot(noConstraint), "coreResult(HFE_A) === coreResult(HFE_B)");
assert.deepEqual(coreSnapshot(livesAlone), coreSnapshot(everyContext), "coreResult(HFE_A) === coreResult(HFE_D)");
assert.deepEqual(coreSnapshot(historical), coreSnapshot(everyContext), "historical/no-HFE core scoring must equal V4 HFE core scoring");
assert.equal(historical.report.householdContextStatus, "not_assessed", "hfe-not-assessed-is-not-absent");
assert.equal(everyContext.report.householdContextLinks.length, 5, "hfe-household-context-links-are-non-counted");
assert(everyContext.report.householdContextLinks.every(link => link.counted === false));
assert.equal(everyContext.report.interactionSummary.length, livesAlone.report.interactionSummary.length, "hfe-does-not-change-counted-interactions");
assert.equal(everyContext.report.internalEvidenceMap.patternEvidence.find(item => item.id === "environmental_cues").score, livesAlone.report.internalEvidenceMap.patternEvidence.find(item => item.id === "environmental_cues").score, "hfe-social-cue-does-not-double-score-q-cue");

const modules = new Map(everyContext.report.managementModules.map(module => [module.patternId, module]));
assert(modules.get("plan_daily_life_mismatch").prepare.includes("порц"), "hfe-other-meal-preparer-adapts-recommendation");
assert(!modules.get("plan_daily_life_mismatch").prepare.includes("тусдаа хоол бэлтгэ"), "hfe-autonomy-adapts-recommendation");
assert(modules.get("irregular_meals_late_hunger").prepare.includes("нэг хооллох зангуу"), "hfe-meal-delay-adapts-recommendation");
assert(everyContext.report.prioritizedStartingAction.action.includes("нэг хооллох зангуу"), "meal-delay feasibility must reach the prioritized action");
assert(everyContext.report.additionalPatternActions.find(action => action.patternId === "plan_daily_life_mismatch").action.includes("порц"), "other-preparer feasibility must reach the recommendation action");
assert(modules.get("environmental_cues").prepare.includes("харилцааг хадгал"), "hfe-social-eating-preserves-social-connection");
assert(!JSON.stringify(everyContext.report).includes("Танай гэр бүл таны жин хасалтад саад"), "hfe-support-copy-does-not-blame-family");
const publicHouseholdReport = JSON.stringify(publicReport(everyContext.report));
assert(!publicHouseholdReport.includes("household_food_exposure"), "public report must not expose internal household flag IDs");
assert(!publicHouseholdReport.includes("HFE-CONTEXT"), "public report must not expose HFE source question IDs");

const generatedReportPath = path.join(__dirname, "..", ".generated-copy-hotfix", "netlify", "functions", "_lib", "report.js");
const generatedQuestionsPath = path.join(__dirname, "..", "dist", "questions.js");
assert(fs.existsSync(generatedReportPath) && fs.existsSync(generatedQuestionsPath), "generated HFE runtime must exist");
const generatedReportModule = require(generatedReportPath);
const generatedQuestions = require(generatedQuestionsPath);
const generatedReportFor = answers => {
  const evidence = generatedReportModule.buildEvidence(rows(answers), [], { questionnaireVersion: V4 });
  return { evidence, report: generatedReportModule.buildFullReport(evidence, new Date("2026-08-08T00:00:00.000Z"), { questionnaireVersion: V4 }) };
};
assert.deepEqual(coreSnapshot(generatedReportFor({ ...coreAnswers, "HFE-HOUSEHOLD": ["Ганцаараа"] })), coreSnapshot(generatedReportFor({ ...coreAnswers, "HFE-HOUSEHOLD": ["Хүүхэдтэй"], "HFE-CONTEXT": allContextOptions })), "generated HFE runtime must preserve exact core scoring");
assert.equal(generatedQuestions.questionById("HFE-CONTEXT", V4).text, contextQuestion.text, "generated HFE text must remain exact");
assert.deepEqual(generatedQuestions.questionById("HFE-CONTEXT", V4).options, contextOptions, "generated canonical HFE options must remain exact");

const autonomyOnly = reportFor({ ...coreAnswers, "HFE-HOUSEHOLD": ["Хүүхэдтэй"], "HFE-CONTEXT": [contextOptions[4]] });
assert(autonomyOnly.report.managementModules.find(module => module.patternId === "plan_daily_life_mismatch").prepare.includes("тусдаа хоол бэлтгэхгүйгээр"), "hfe-autonomy-adapts-recommendation");
assert(autonomyOnly.report.additionalPatternActions.find(action => action.patternId === "plan_daily_life_mismatch").action.includes("тусдаа хоол бэлтгэхгүйгээр"));

const foodExposureOnly = reportFor({ ...coreAnswers, "HFE-HOUSEHOLD": ["Хүүхэдтэй"], "HFE-CONTEXT": [contextOptions[5]] });
const environmentModule = foodExposureOnly.report.managementModules.find(module => module.patternId === "environmental_cues");
assert(environmentModule.prepare.includes("нэг хүнсний"), "hfe-food-exposure-adapts-recommendation");
assert(!environmentModule.prepare.includes("бүх зууш, амттаныг хая"));

const neutralCore = { "Q-MEAL-RHYTHM": "4–5 цаг", "Q-HUNGER": "Тодорхой биш", "Q-CUE": ["Аль нь ч үгүй"] };
const neutralA = reportFor({ ...neutralCore, "HFE-HOUSEHOLD": ["Ганцаараа"] });
const neutralB = reportFor({ ...neutralCore, "HFE-HOUSEHOLD": ["Хүүхэдтэй"], "HFE-CONTEXT": [contextOptions[2]] });
assert.equal(Boolean(neutralA.report.neutralResult), Boolean(neutralB.report.neutralResult), "hfe-does-not-change-neutral-classification");
assert(neutralB.report.neutralResult.overview.join(" ").includes("өөрийн хоол хойшлох"), "neutral report may state direct household context");

function defaultValue(question) {
  if (question.id === "Q-AGE") return 35;
  if (question.id === "Q-HEIGHT") return 170;
  if (question.id === "Q-WEIGHT") return 80;
  if (question.id === "Q-TARGET") return 70;
  if (question.id === "Q-SEX") return "Эмэгтэй";
  if (question.id === "MC-GATE") return "Тийм, хамаарна";
  if (question.id === "ALC-GATE" || question.id === "TOB-GATE") return "Хааяа";
  if (question.id === "S1-S03") return "Сүүлийн 28 хоногт байсан";
  if (question.id === "S1-S04") return "Хааяа";
  if (question.id === "Q-METHOD-PAST") return ["Хоолны дэглэм", "Дасгал хөдөлгөөн"];
  if (question.id === "Q-METHOD-RESULT") return "Жин буурсан";
  if (question.id === "HFE-HOUSEHOLD") return ["Хань эсвэл хамтрагчтай"];
  if (question.id === "HFE-CONTEXT") return allContextOptions;
  if (question.type === "number") return question.min;
  if (question.type === "multi") return [question.options[0]];
  if (question.type === "text") return "Өдөр тутмын хуваарьтай нийцээгүй.";
  return question.options[0];
}
function completeRoute(version, overrides = {}) {
  const answers = { ...overrides };
  for (let pass = 0; pass < 8; pass += 1) for (const question of questions.visibleQuestions(answers, version)) if (answers[question.id] == null) answers[question.id] = defaultValue(question);
  return { answers, route: questions.visibleQuestions(answers, version) };
}
const minBefore = completeRoute(V3, { "Q-SEX": "Эрэгтэй", "ALC-GATE": "Үгүй", "TOB-GATE": "Үгүй", "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"], "Q-METHOD-PAST": ["Ямар нэг арга хэрэглэж үзээгүй"] }).route.length;
const minAfterAlone = completeRoute(V4, { "Q-SEX": "Эрэгтэй", "ALC-GATE": "Үгүй", "TOB-GATE": "Үгүй", "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"], "Q-METHOD-PAST": ["Ямар нэг арга хэрэглэж үзээгүй"], "HFE-HOUSEHOLD": ["Ганцаараа"] }).route.length;
const maxBefore = completeRoute(V3).route.length;
const maxAfter = completeRoute(V4).route.length;
assert.deepEqual({ minBefore, minAfterAlone, maxBefore, maxAfter }, { minBefore: 26, minAfterAlone: 27, maxBefore: 44, maxAfter: 46 }, "hfe-max-route-is-46-or-less");
assert(maxAfter <= questions.MAX_ROUTED_QUESTION_COUNT);

(async () => {
  const database = new MemoryDatabaseAdapter();
  const now = new Date("2026-08-08T00:00:00.000Z");
  await database.insert("sessions", { id: "ws-hfe", tokenHash: "hash", createdAt: now.toISOString(), expiresAt: "2026-08-09T00:00:00.000Z", revokedAt: null });
  await database.insert("assessments", { id: "wa-hfe", sessionId: "ws-hfe", status: "draft", questionnaireVersion: V4, createdAt: now.toISOString(), updatedAt: now.toISOString() });
  await saveAssessment(database, "ws-hfe", { assessmentId: "wa-hfe", answers: { "HFE-HOUSEHOLD": ["Хүүхэдтэй"] } }, now);
  await saveAssessment(database, "ws-hfe", { assessmentId: "wa-hfe", answers: { "HFE-CONTEXT": allContextOptions } }, now);
  await saveAssessment(database, "ws-hfe", { assessmentId: "wa-hfe", answers: { "HFE-HOUSEHOLD": ["Ганцаараа"] } }, now);
  assert.equal((await database.find("assessment_answers", { assessmentId: "wa-hfe", questionId: "HFE-CONTEXT" })).length, 0, "server must delete stale hidden HFE context");
  console.log("HFE V4 versioning, routing, scoring firewall, context links, feasibility, and stale-answer tests passed");
})().catch(error => { console.error(error); process.exit(1); });
