"use strict";
const assert = require("node:assert/strict");
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

const owner = reportFor(fixtures.find(item => item.name === "owner maintenance transition profile").answers);
assert(!owner.influencingPatterns.some(item => item.id === "low_movement"), "low movement must not be a psychological or behavioral pattern");
assert(owner.contextualFactors.some(item => item.id === "low_movement"), "low movement must remain a contextual influencing factor");
assert(owner.influencingPatterns.every(item => item.category !== "psychological"), "owner answers do not support a psychological pattern");
assert(owner.protectiveSynthesis.includes("гол саад болж харагдсангүй"));
assert(owner.protectiveInterpretation.includes("давуу талыг харуулна"));
assert(owner.protectiveInterpretation.includes("хөдөлгөөний хэмнэл"));
assert(owner.previousAttemptAnalysis.summary.includes("нэг жилээс урт"));
assert(owner.previousAttemptAnalysis.summary.includes("Гэмтлийн улмаас"));
assert(owner.previousAttemptAnalysis.interpretation.includes("эхлэх чадвар"));
assert(owner.professionalGuidance.includes("Хэрэв даралт сүүлийн үед давтан хэвийн бус"));
assert(owner.urgentGuidance.includes("яаралтай тусламж"));
assert.notEqual(owner.prioritizedStartingAction.recommendationId, "professional_check");
assert.equal(owner.prioritizedStartingAction.plan.duration, "14 хоног");
assert(owner.prioritizedStartingAction.plan.option.includes("төлбөр шаардахгүй"));
assert(owner.prioritizedStartingAction.plan.injuryBoundary.includes("өвдөх"));
assert(owner.prioritizedStartingAction.plan.anchor.includes("үндсэн хоолны дараа"));
assert(owner.prioritizedStartingAction.plan.frequency.includes("5 өдөр"));
assert(owner.prioritizedStartingAction.plan.record.includes("минут"));
assert(owner.prioritizedStartingAction.plan.success.includes("дор хаяж 8"));
assert(owner.prioritizedStartingAction.plan.fallback.includes("5 минут"));
assert(owner.prioritizedStartingAction.plan.maintenanceRule.includes("давхар нөхөхгүй"));
const rejectedMeta = ["хангалттай дэмжигдсэн", "зэрэг дэмжигдээгүй", "Зохиомол харилцан холбоо", "дангаараа тусдаа хэв маяг", "дангаараа шинэ хэв маяг"];
for (const phrase of rejectedMeta) assert(!JSON.stringify(publicReport(owner)).includes(phrase), `owner report leaked engine language: ${phrase}`);

const openOnly = reportFor({ "OPEN-PAST": "Бүх зүйл нурсан мэт санагдсан" });
assert.equal(openOnly.influencingPatterns.length, 0, "open text cannot independently create a pattern");

const raw = buildFullReport(buildEvidence(rows(fixtures[0].answers)));
assert(raw.internalEvidenceMap.signals.every(item => item.questionId));
assert(!Object.hasOwn(publicReport(raw), "internalEvidenceMap"));

const sentences = substantiveSentences(publicReport(multi));
assert.equal(sentences.length, new Set(sentences).size, "substantive sentences must not repeat across report fields");

console.log("deterministic multi-factor report tests passed");
