"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { QUESTIONS } = require("../questions.js");
const { mappingCoverage } = require("../netlify/functions/_lib/report-signals.js");
const { buildEvidence, evidenceQuality, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");
const fixtures = require("./fixtures/report-gold-profiles.js");

const rows = answers => Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
const reportFor = answers => buildFullReport(buildEvidence(rows(answers)), new Date("2026-07-17T00:00:00Z"));
function substantiveSentences(value) { return JSON.stringify(value).split(/[.!?]\s*/).map(item => item.replace(/[{}\[\]"\\]/g, "").trim()).filter(item => item.length > 45); }

const coverage = mappingCoverage(QUESTIONS);
assert.equal(coverage.percent, 100);
assert.deepEqual(coverage.unmappedQuestions, []);
assert.deepEqual(coverage.unmappedOptions, []);

const unknown = buildEvidence([{ questionId: "Q-UNKNOWN", value: "anything" }]);
assert.deepEqual(unknown.unmappedQuestions, ["Q-UNKNOWN"]);
assert.equal(unknown.signals.length, 0);

const stableEmotion = reportFor({ "Q-EMOTION": "Өөрчлөгддөггүй", "Q-METHOD-BARRIERS": ["Стресс ба сэтгэл хөдлөл"] });
const strongEmotion = reportFor({ "Q-EMOTION": "Нэлээд нэмэгддэг", "Q-METHOD-BARRIERS": ["Стресс ба сэтгэл хөдлөл"] });
assert(!stableEmotion.influencingPatterns.some(pattern => pattern.id === "emotional_regulation"));
assert(strongEmotion.influencingPatterns.some(pattern => pattern.id === "emotional_regulation"));
assert.notDeepEqual(stableEmotion.influencingPatterns, strongEmotion.influencingPatterns);

const neutralEvidence = buildEvidence(rows({ "Q-EMOTION": "Тодорхой биш", "Q-SATIETY": "Хариулахгүй", "Q-CUE": ["Аль нь ч үгүй"] }));
assert.equal(evidenceQuality(neutralEvidence).questionCount, 1, "neutral/excluded answers must not increase evidence quality");
assert.equal(reportFor({ "Q-EMOTION": "Нэлээд нэмэгддэг" }).influencingPatterns.length, 0, "one answer must never create a pattern");

for (const fixture of fixtures) {
  const report = reportFor(fixture.answers);
  const ids = report.influencingPatterns.map(pattern => pattern.id);
  const contextualIds = report.contextualFactors.map(item => item.id);
  for (const expected of fixture.expectedPatterns) assert(ids.includes(expected), `${fixture.name}: missing ${expected}; got ${ids.join(",")}`);
  for (const expected of fixture.expectedContextualFactors) assert(contextualIds.includes(expected), `${fixture.name}: missing contextual ${expected}; got ${contextualIds.join(",")}`);
  for (const absent of fixture.absentPatterns) assert(!ids.includes(absent), `${fixture.name}: unexpected ${absent}`);
  if (fixture.expectedProtectiveSignal) assert(report.protectiveFactors.some(item => item.signal === fixture.expectedProtectiveSignal), `${fixture.name}: missing protective factor`);
  if (fixture.expectedFirstStep) assert.equal(report.prioritizedStartingAction?.recommendationId, fixture.expectedFirstStep, `${fixture.name}: wrong first step`);
  assert.equal(new Set(ids).size, ids.length, `${fixture.name}: duplicate pattern`);
  assert(ids.length <= 4, `${fixture.name}: major pattern readability cap exceeded`);
  const actionIds = report.additionalPatternActions.filter(Boolean).map(action => action.patternId);
  assert.deepEqual(new Set(actionIds), new Set(ids), `${fixture.name}: every major pattern needs one recommendation`);
  const publicText = JSON.stringify(publicReport(report));
  assert(!/Q-[A-Z]|S1-|MC-/.test(publicText), `${fixture.name}: raw question ID leaked`);
  assert(!publicText.includes("өдөр тутмын хэв маяг"));
  assert(!/Итгэлцлийн түвшин|confidence|\d+%/.test(publicText));
  assert(!/\$\{label\}-(тэй|той)/.test(publicText));
  const profileSentences = substantiveSentences(publicReport(report));
  assert.equal(profileSentences.length, new Set(profileSentences).size, `${fixture.name}: repeated substantive sentence`);
  for (const phrase of fixture.prohibited) assert(!publicText.includes(phrase), `${fixture.name}: prohibited guidance ${phrase}`);
}

const multi = reportFor(fixtures[0].answers);
assert(multi.influencingPatterns.length >= 3);
assert(multi.interactionSummary.length >= 2);
assert(new Set(multi.additionalPatternActions.map(item => item.recommendationId)).size === multi.additionalPatternActions.length);

const transition = reportFor(fixtures.find(item => item.name === "sustained movement attempt with explicit constraints").answers);
assert(!transition.influencingPatterns.some(item => item.id === "low_movement"), "low movement must not be a psychological or behavioral pattern");
assert(transition.contextualFactors.some(item => item.id === "low_movement"), "low movement must remain a contextual influencing factor");
assert(transition.influencingPatterns.every(item => item.category !== "psychological"), "this profile does not support a psychological pattern");
assert(transition.protectiveSynthesis.includes("гол саад болж харагдсангүй"));
assert(transition.protectiveInterpretation.includes("давуу талыг харуулна"));
assert(transition.previousAttemptAnalysis.summary.includes("нэг жилээс урт"));
assert(transition.previousAttemptAnalysis.summary.includes("гэмтэл"));
assert(transition.previousAttemptAnalysis.interpretation.includes("тууштай байх чадвар"));
assert(transition.professionalGuidance.includes("Хэрэв даралт сүүлийн үед давтан хэвийн бус"));
assert(transition.urgentGuidance.includes("яаралтай тусламж"));
assert.notEqual(transition.prioritizedStartingAction.recommendationId, "professional_check");
assert.equal(transition.prioritizedStartingAction.plan.duration, "Эхний 7 хоногт туршина");
assert(transition.prioritizedStartingAction.plan.costBoundary.includes("төлбөр"));
assert(transition.prioritizedStartingAction.plan.injuryBoundary.includes("зовиур"));
assert(transition.prioritizedStartingAction.plan.anchor.includes("тогтвортой давтагддаг"));
assert(transition.prioritizedStartingAction.plan.record.includes("минут"));
assert(transition.prioritizedStartingAction.plan.maintenanceRule.includes("давхар нөхөхгүй"));
const rejectedMeta = ["хангалттай дэмжигдсэн", "зэрэг дэмжигдээгүй", "Зохиомол харилцан холбоо", "дангаараа тусдаа хэв маяг", "дангаараа шинэ хэв маяг"];
for (const phrase of rejectedMeta) assert(!JSON.stringify(publicReport(transition)).includes(phrase), `report leaked engine language: ${phrase}`);

const genericTransitionAnswers = {
  "Q-METHOD-PAST": ["Дасгал хөдөлгөөн"], "Q-METHOD-DURATION": "1 жилээс урт",
  "Q-METHOD-RESULT": "Жин буурсан", "Q-METHOD-REGAIN": "Хэсэгчлэн нэмэгдсэн",
  "Q-METHOD-BARRIERS": ["Үр дүн удаан харагдах"], "Q-TRAVEL": "Машинаар", "Q-MOVEMENT": "Бага"
};
const withoutInjury = reportFor(genericTransitionAnswers);
const withInjury = reportFor({ ...genericTransitionAnswers, "Q-METHOD-STOP": "Дасгал хийх үед гэмтэл гарсан тул зогсоосон" });
const withoutInjuryText = JSON.stringify(publicReport(withoutInjury));
const withInjuryText = JSON.stringify(publicReport(withInjury));
assert(!/хуучин гэмт|гэмтэл|өвдөлт|Зовиур/.test(withoutInjuryText), "injury language requires injury evidence");
assert(/гэмтэл|өвдөлт|Зовиур/.test(withInjuryText), "explicit injury evidence must change injury guidance");
assert.notEqual(withoutInjuryText, withInjuryText, "injury evidence must materially change the report");

const withoutCost = reportFor(genericTransitionAnswers);
const withCost = reportFor({ ...genericTransitionAnswers, "Q-METHOD-BARRIERS": ["Үр дүн удаан харагдах", "Зардал"] });
const withoutCostText = JSON.stringify(publicReport(withoutCost));
const withCostText = JSON.stringify(publicReport(withCost));
assert(!/зардал|төлбөр/i.test(withoutCostText), "cost wording requires explicit cost evidence");
assert(/зардал|төлбөр/i.test(withCostText), "explicit cost evidence must change cost interpretation");
assert.notEqual(withoutCostText, withCostText, "cost evidence must materially change the report");

const withoutSchedule = reportFor(genericTransitionAnswers);
const withSchedule = reportFor({ ...genericTransitionAnswers, "Q-METHOD-BARRIERS": ["Үр дүн удаан харагдах", "Цагийн хуваарь"] });
const withoutScheduleText = JSON.stringify(publicReport(withoutSchedule));
const withScheduleText = JSON.stringify(publicReport(withSchedule));
assert(!/цагийн хуваарь|Завгүй/.test(withoutScheduleText), "schedule wording requires explicit schedule evidence");
assert(/цагийн хуваарь|Завгүй/.test(withScheduleText), "explicit schedule evidence must change schedule interpretation");
assert.notEqual(withoutScheduleText, withScheduleText, "schedule evidence must materially change the report");

const withoutRegain = reportFor({ ...genericTransitionAnswers, "Q-METHOD-REGAIN": "Үгүй" });
assert(!JSON.stringify(publicReport(withoutRegain)).includes("зогссоны дараа жин"), "regain wording requires positive regain evidence");
const withoutInitialSuccess = reportFor({ ...genericTransitionAnswers, "Q-METHOD-RESULT": "Жин тогтвортой байсан" });
assert(!JSON.stringify(publicReport(withoutInitialSuccess)).includes("эхэндээ жин бууруулсан"), "initial-success wording requires explicit success evidence");
const withoutLongDuration = reportFor({ ...genericTransitionAnswers, "Q-METHOD-DURATION": "6–12 сар" });
assert(!JSON.stringify(publicReport(withoutLongDuration)).includes("нэг жилээс урт"), "long-duration wording requires the exact duration gate");

const reportSource = fs.readFileSync(require.resolve("../netlify/functions/_lib/report.js"), "utf8");
for (const forbiddenName of ["ownerLike", "ownerProfile", "ownerReport", "ownerSpecialCase"]) assert(!reportSource.includes(forbiddenName), `user-specific production branch remains: ${forbiddenName}`);
assert.equal((reportSource.match(/function buildFullReport/g) || []).length, 1, "all assessments must use one generic report builder");

const openOnly = reportFor({ "OPEN-PAST": "Бүх зүйл нурсан мэт санагдсан" });
assert.equal(openOnly.influencingPatterns.length, 0, "open text cannot independently create a pattern");

const raw = buildFullReport(buildEvidence(rows(fixtures[0].answers)));
assert(raw.internalEvidenceMap.signals.every(item => item.questionId));
assert(!Object.hasOwn(publicReport(raw), "internalEvidenceMap"));

const sentences = substantiveSentences(publicReport(multi));
assert.equal(sentences.length, new Set(sentences).size, "substantive sentences must not repeat across report fields");

console.log("deterministic multi-factor report tests passed");
