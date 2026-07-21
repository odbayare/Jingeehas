"use strict";
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const questionBank = require("../questions.js");
const { QUESTIONS } = questionBank;
const app = require("../app.js");
const { SENTENCE_TEMPLATES, sentenceTemplateMatches } = require("../netlify/functions/_lib/report-copy.js");
const { mappingCoverage } = require("../netlify/functions/_lib/report-signals.js");
const { buildEvidence, evidenceQuality, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");
const fixtures = require("./fixtures/report-gold-profiles.js");
const forbiddenPublicTerms = ["арга тасрах", "арга тасарсан", "арга тасарсны", "арга тасрахад", "төлөвлөгөө тасрах", "төлөвлөгөө тасарсан", "дэглэм тасрах", "хадгалж үлдэх", "өмнөх оролдлого үргэлжлэхээ болих", "анзаарах хэцүү", "сэтгэл хөдлөлөө зохицуулах нөөц", "эрсдэлийг бууруулж байна", "шилжилтийн саад", "үр дүнгээ хадгалах шилжилт", "залгамж хувилбар", "Зангуу", "зангуун", "Доод хувилбар", "доод хувилбар", "Зардлын зааг", "Биеийн дурдсан нөхцөл", "биеийн дурдсан нөхцөл", "аюулгүй хувилбар", "нэг чиглэлд давхацсан", "гол анхаарах хэв маягийн нэг", "Та хүндрэл давтагддаг нөхцөлийг ялгаж хариулсан", "төлөвлөөгүй идэлт", "идэлт"];
const internalReviewTerms = ["OWNER REVIEW REQUIRED", "OWNER APPROVED", "Candidate A", "Candidate B", "review status", "templateId", "signalId", "questionId", "evidence-gate", "debug", "QA note", "planDecisionPending"];

const rows = answers => Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
const reportFor = answers => buildFullReport(buildEvidence(rows(answers)), new Date("2026-07-17T00:00:00Z"));
function substantiveSentences(value) { return JSON.stringify(value).split(/[.!?]\s*/).map(item => item.replace(/[{}\[\]"\\]/g, "").trim()).filter(item => item.length > 45); }

for (const [templateId, template] of Object.entries(SENTENCE_TEMPLATES)) {
  const state = {
    positiveSignals: [...(template.requiredSignals || [])],
    protectiveSignals: [...(template.requiredProtectiveSignals || [])],
    supportedPatterns: [...(template.requiredPatterns || [])],
    influencingPatterns: template.requiredPatternCount == null
      ? [...(template.requiredPatterns || [])]
      : Array.from({ length: template.requiredPatternCount }, (_, index) => `counted-pattern-${index}`),
    contexts: [...(template.requiredContexts || [])]
  };
  if (template.requiredProtectiveCount != null) {
    while (state.protectiveSignals.length < template.requiredProtectiveCount) state.protectiveSignals.push(`counted-protective-${state.protectiveSignals.length}`);
  }
  assert(sentenceTemplateMatches(template, state), `${templateId}: all declared gates must pass`);
  const requiredGroups = [
    ["requiredSignals", "positiveSignals"],
    ["requiredProtectiveSignals", "protectiveSignals"],
    ["requiredPatterns", "supportedPatterns"],
    ["requiredContexts", "contexts"]
  ];
  for (const [gateName, stateName] of requiredGroups) for (const required of template[gateName] || []) {
    const missing = { ...state, [stateName]: state[stateName].filter(value => value !== required) };
    assert(!sentenceTemplateMatches(template, missing), `${templateId}: ${gateName} ${required} must be independently required`);
  }
  for (const forbidden of template.forbiddenSignals || []) assert(!sentenceTemplateMatches(template, { ...state, positiveSignals: [...state.positiveSignals, forbidden] }), `${templateId}: contradictory signal ${forbidden} must suppress copy`);
  for (const forbidden of template.forbiddenPatterns || []) assert(!sentenceTemplateMatches(template, { ...state, supportedPatterns: [...state.supportedPatterns, forbidden] }), `${templateId}: contradictory pattern ${forbidden} must suppress copy`);
  for (const forbidden of template.forbiddenContexts || []) assert(!sentenceTemplateMatches(template, { ...state, contexts: [...state.contexts, forbidden] }), `${templateId}: contradictory context ${forbidden} must suppress copy`);
  if (template.requiredPatternCount != null) assert(!sentenceTemplateMatches(template, { ...state, influencingPatterns: [...state.influencingPatterns, "extra-pattern"] }), `${templateId}: pattern-count gate must reject a conflicting count`);
  if (template.requiredProtectiveCount != null) assert(!sentenceTemplateMatches(template, { ...state, protectiveSignals: [...state.protectiveSignals, "extra-protective"] }), `${templateId}: protective-count gate must reject a conflicting answer`);
  else assert(sentenceTemplateMatches(template, { ...state, protectiveSignals: [...state.protectiveSignals, "unrelated-protective-answer"] }), `${templateId}: unrelated protective evidence must not suppress eligible copy`);
}

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
  if (fixture.expectedFirstStep) {
    const selectedRecommendation = report.prioritizedStartingAction?.recommendationId || report.planAppendices?.candidateB?.recommendationId;
    assert.equal(selectedRecommendation, fixture.expectedFirstStep, `${fixture.name}: wrong first step`);
  }
  assert.equal(new Set(ids).size, ids.length, `${fixture.name}: duplicate pattern`);
  assert(ids.length <= 4, `${fixture.name}: major pattern readability cap exceeded`);
  const actionIds = report.additionalPatternActions.filter(Boolean).map(action => action.patternId);
  assert.deepEqual(new Set(actionIds), new Set(ids), `${fixture.name}: every major pattern needs one recommendation`);
  const publicText = JSON.stringify(publicReport(report));
  const renderedPublic = app._test.buildReportSections(publicReport(report)).filter(section => section.visible).map(section => section.paragraphs.join(" ")).join(" ");
  for (const term of internalReviewTerms) {
    assert(!publicText.includes(term), `${fixture.name}: internal review metadata leaked into public object: ${term}`);
    assert(!renderedPublic.includes(term), `${fixture.name}: internal review metadata leaked into rendered report: ${term}`);
  }
  assert(!/\b(?:emotional_regulation|environmental_cues|previous_attempt_sustainability|schedule_barrier|cost_barrier|Q-[A-Z]|S1-|MC-)\b/.test(publicText), `${fixture.name}: internal signal, pattern, or question ID leaked`);
  assert(!/Q-[A-Z]|S1-|MC-/.test(publicText), `${fixture.name}: raw question ID leaked`);
  assert(!publicText.includes("өдөр тутмын хэв маяг"));
  assert(!/Итгэлцлийн түвшин|confidence|\d+%/.test(publicText));
  assert(!/\$\{label\}-(тэй|той)/.test(publicText));
  if (report.neutralResult) {
    assert.equal(report.overallPicture, null, `${fixture.name}: neutral mode must use its dedicated overview`);
    assert(report.neutralResult.strengths.length <= 4, `${fixture.name}: neutral strengths must have at most four narrative groups`);
  }
  else assert(Array.isArray(report.overallPicture) && report.overallPicture.length <= 3, `${fixture.name}: section 1 must have at most three paragraphs`);
  if (report.previousAttemptAnalysis) assert(report.previousAttemptAnalysis.paragraphs.length <= 2, `${fixture.name}: section 5 must have at most two paragraphs`);
  assert(!/QPay|нэхэмжлэл үүсгэх/.test(publicText), `${fixture.name}: report generation must not create or advertise an invoice`);
  if (report.prioritizedStartingAction) for (const direction of report.additionalPatternActions) assert.notEqual(direction.action, report.prioritizedStartingAction.action, `${fixture.name}: section 7 and section 8 must have distinct jobs`);
  for (const phrase of forbiddenPublicTerms) assert(!publicText.includes(phrase), `${fixture.name}: forbidden public label ${phrase}`);
  const profileSentences = substantiveSentences(publicReport(report));
  assert.equal(profileSentences.length, new Set(profileSentences).size, `${fixture.name}: repeated substantive sentence`);
  for (const phrase of fixture.prohibited) assert(!publicText.includes(phrase), `${fixture.name}: prohibited guidance ${phrase}`);
}

const multi = reportFor(fixtures[0].answers);
const mealTimingPriority = "Хоолны зайг эхэлж тогтворжуулснаар хэт өлсөлтийн нөлөөг багасгаж, өлсөх болон цадах дохиогоо анзаарах хүндрэл хэр өөрчлөгдөж байгааг илүү тод ажиглана. Стрессийн үеийн идэх хүсэл тусдаа хэвээр байгаа эсэхийг мөн ажиглана.";
assert(multi.influencingPatterns.length >= 3);
assert(multi.interactionSummary.length >= 2);
assert(new Set(multi.additionalPatternActions.map(item => item.recommendationId)).size === multi.additionalPatternActions.length);
assert.equal(multi.protectiveSectionSummary, null, "a profile without meaningful protective evidence must omit the strengths synthesis");
assert.equal(multi.protectiveFactors.length, 0, "strengths must not be fabricated from answer completeness");
assert.equal(multi.prioritizedStartingAction.priorityReason, mealTimingPriority, "multi-pattern report must explain meal-timing priority");
const multiPublicText = JSON.stringify(publicReport(multi));
assert(multiPublicText.includes("Хоол хоорондын зай тань урт байдаг бөгөөд өлсөлт хэт хүчтэй болсон хойно л анзаарагддаг гэж хариулжээ."));
assert(multiPublicText.includes("Орой хэт өлсөхөд"));
assert(multiPublicText.includes("хооллож эхлэх болон идэхээ зогсоох мөч"));
assert(multiPublicText.includes("идэхээ зогсоох мөч"));
assert(multiPublicText.includes("Ийм үед идэх хэмжээгээ тайван тохируулахад хэцүү болж болно."));
for (const unsupportedEnvironment of ["таваг", "орчин", "харагдах хоол", "food availability"]) assert(!multiPublicText.toLowerCase().includes(unsupportedEnvironment), `environmental wording requires environmental evidence: ${unsupportedEnvironment}`);
const environmentalHunger = reportFor(fixtures.find(item => item.name === "satiety difficulty + emotional eating + food availability").answers);
const environmentalHungerText = JSON.stringify(publicReport(environmentalHunger));
assert(environmentalHunger.influencingPatterns.some(item => item.id === "environmental_cues"), "paired positive fixture must support environmental cues");
assert(/орчин|харагдах|үнэр/.test(environmentalHungerText), "environmental wording must remain available when independently supported");
assert.equal(multi.prioritizedStartingAction.plan.kind, "meal_timing_observation");
assert.equal(multi.prioritizedStartingAction.plan.variable, "нэг тогтвортой хоолны цаг");
assert.equal(multi.prioritizedStartingAction.plan.observe, "Сонгосон хоолны өмнөх өлсөлт, орой хэт өлсөх эсэх болон идэхээ зогсооход хэр амар байсныг тэмдэглэнэ.");
assert.equal(multi.prioritizedStartingAction.plan.keepConstant, "Бусад хоолны цаг, идэх хэмжээ болон цэсийг зориуд өөрчлөхгүй.");
assert.equal(multi.prioritizedStartingAction.plan.fallback, "Нэг өдөр сонгосон цагаа баримтлаагүй бол нөхөж хэт өөрчлөхгүй; дараагийн боломжтой өдрөөс хэвийн үргэлжлүүлнэ.");
assert.equal(multi.prioritizedStartingAction.plan.success, "Сонгосон хоолны цаг бодит амьдралд давтагдаж болох эсэх болон оройн хэт өлсөлтийн байдал өөрчлөгдөж байгаа эсэхийг ажиглана. Жингийн тоогоор дүгнэхгүй.");
assert(!/хөдөлгөөн|нойр/.test(JSON.stringify(multi.prioritizedStartingAction.plan)), "meal experiment must not add a second movement or sleep intervention");
const renderedMulti = app._test.buildReportSections(publicReport(multi)).filter(section => section.visible).map(section => section.paragraphs.join(" ")).join(" ");
for (const label of ["Юуг ажиглах вэ?", "Юуг өөрчлөхгүй вэ?", "Амжилтыг хэрхэн таних вэ?", "Алгассан өдрийн дараа"]) assert(renderedMulti.includes(label), `rendered multi experiment missing field: ${label}`);
assert(!JSON.stringify(publicReport(reportFor(fixtures.find(item => item.name === "emotional eating dominant").answers))).includes(mealTimingPriority), "meal-timing priority requires both meal-rhythm and hunger/satiety patterns");
assert(!JSON.stringify(publicReport(reportFor(fixtures.find(item => item.name === "environmental cue dominant").answers))).includes(mealTimingPriority), "unrelated patterns must not receive meal-timing priority copy");

const transition = reportFor(fixtures.find(item => item.name === "sustained movement attempt with explicit constraints").answers);
assert(!transition.influencingPatterns.some(item => item.id === "low_movement"), "low movement must not be a psychological or behavioral pattern");
assert(transition.contextualFactors.some(item => item.id === "low_movement"), "low movement must remain a contextual influencing factor");
assert(transition.influencingPatterns.every(item => item.category !== "psychological"), "this profile does not support a psychological pattern");
assert(transition.protectiveSectionSummary.includes("өлсөх, цадах мэдрэмжээ харьцангуй сайн анзаардаг"));
assert(transition.protectiveSectionSummary.includes("өөрчлөлтийг тууштай барих чадвартайг"));
assert.equal(transition.influencingPatterns.find(item => item.id === "previous_attempt_sustainability").title, "Өмнөх аргын үр дүнг хадгалах төлөвлөгөө дутсан нь");
const ownerPattern = transition.influencingPatterns.find(item => item.id === "previous_attempt_sustainability");
const ownerPatternCopy = "Таны хувьд гол хүндрэл нь өөрчлөлт эхлүүлэх чадвар биш. Харин ажиллаж байсан хөдөлгөөнөө үргэлжлүүлэх боломжгүй болсон үед өмнөх үр дүнг хадгалах, өдөр тутмын амьдралд хэрэгжүүлж болох өөр төлөвлөгөө бэлэн байгаагүйд байна.";
assert.deepEqual(ownerPattern.paragraphs, [ownerPatternCopy], "owner main-pattern section must use one concise formulation");
assert(transition.additionalPatternActions.find(item => item.patternId === "previous_attempt_sustainability").action.includes("өдөр тутмын амьдралд тогтмол хэрэгжүүлж болох"), "section 7 must use the approved daily-life wording");
assert(transition.contextualFactors.find(item => item.id === "low_movement").summary.includes("өдрийн нийт хөдөлгөөнөө бага"));
assert(transition.previousAttemptAnalysis.paragraphs.join(" ").includes("нэг жилээс урт"));
assert(transition.previousAttemptAnalysis.paragraphs.join(" ").includes("гэмт"));
const injuryChronology = "Таны дурдсан гэмтлийн улмаас өмнөх хөдөлгөөнөө үргэлжлүүлэх боломжгүй болжээ.";
assert(transition.previousAttemptAnalysis.paragraphs.join(" ").includes(injuryChronology));
assert(!transition.previousAttemptAnalysis.paragraphs.join(" ").includes("Таны дурдсан өвдөлт эсвэл хөдөлгөөний хязгаарлалт"));
assert(transition.previousAttemptAnalysis.paragraphs.join(" ").includes("Цагийн хуваарь болон зардал нь дараагийн төлөвлөгөөг тогтвортой хэрэгжүүлэхэд нэмэлт саад болжээ."));
assert(transition.professionalGuidance.includes("Хэрэв даралт сүүлийн үед давтан хэвийн бус"));
assert(transition.urgentGuidance.includes("яаралтай тусламж"));
assert.equal(transition.planDecisionPending, false);
assert.equal(transition.planAppendices, null);
assert.equal(transition.prioritizedStartingAction.recommendationId, "maintenance_movement_bridge");
assert(!/\d/.test(JSON.stringify(transition.prioritizedStartingAction.plan)), "selected maintenance plan must remain nonnumeric");
assert.equal(transition.prioritizedStartingAction.plan.duration, "Эхлэх өдөр болон үр дүнгээ эргэн харах өдрөө урьдчилан сонгоно.");
assert.equal(transition.prioritizedStartingAction.plan.success, "Урьдчилан сонгосон мөчүүдэд үндсэн эсвэл богино хувилбарыг бодитоор давтаж болох эсэхийг ажиглана.");
assert.equal(transition.prioritizedStartingAction.plan.variable, "өдөр тутмын амьдралд давтаж болох нэг хөдөлгөөний хэмнэл");
assert.equal(transition.prioritizedStartingAction.plan.anchor, "Өдөр бүр эсвэл тогтмол давтагддаг, урьдчилан сонгосон нэг үйл явдлын дараа.");
assert.equal(transition.prioritizedStartingAction.plan.injuryBoundary, "Өмнөх гэмтэлтэй холбоотой зовиур нэмэгдвэл тухайн өдрийн хөдөлгөөнийг зогсооно. Зовиур үргэлжилбэл мэргэжлийн хүнтэй зөвлөнө.");
assert(!JSON.stringify(transition.prioritizedStartingAction).includes("өдөр тутам давтаж"), "selected plan must not imply daily frequency");
assert(!JSON.stringify(transition.prioritizedStartingAction).includes("зовиур мэдрэгдвэл"), "selected plan must respond to symptom increase, not any sensation");
assert(!/хоног|долоо хоног|минут|дор хаяж|\d/.test(JSON.stringify(transition.prioritizedStartingAction)), "selected plan must contain no fixed duration, frequency, minute, or completion threshold");
assert(transition.prioritizedStartingAction.priorityReason.includes("тусдаа өөрчлөлт бус"));
const transitionPublicText = JSON.stringify(publicReport(transition));
assert.equal(transitionPublicText.split(injuryChronology).length - 1, 1, "explicit injury chronology must appear exactly once");
assert.equal(transitionPublicText.split("Өмнөх аргаа нэг жилээс урт хугацаанд хэрэгжүүлж, эхний үр дүн гаргаж чадсан").length - 1, 1, "protective synthesis must appear once");
assert(!/Цагийн хуваарь саад болсон,|Зардал саад болсон,|Гэмтэл саад болсон,/.test(transitionPublicText), "evidence must be a narrative, not comma-separated fragments");
const rejectedMeta = ["хангалттай дэмжигдсэн", "зэрэг дэмжигдээгүй", "Зохиомол харилцан холбоо", "дангаараа тусдаа хэв маяг", "дангаараа шинэ хэв маяг"];
for (const phrase of rejectedMeta) assert(!JSON.stringify(publicReport(transition)).includes(phrase), `report leaked engine language: ${phrase}`);

const ownerSections = app._test.buildReportSections(publicReport(transition)).filter(section => section.visible && ["overview", "patterns", "previous", "strengths", "direction"].includes(section.id));
const ownerSectionSentences = ownerSections.map(section => ({
  id: section.id,
  sentences: substantiveSentences(section.paragraphs.join(" ").replace(/<[^>]+>/g, " "))
}));
const allOwnerSentences = ownerSectionSentences.flatMap(section => section.sentences);
assert.equal(allOwnerSentences.length, new Set(allOwnerSentences).size, "owner report must not repeat a substantive sentence across section responsibilities");
function wordSet(text) { return new Set(text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(word => word.length > 3)); }
for (let left = 0; left < ownerSections.length; left += 1) for (let right = left + 1; right < ownerSections.length; right += 1) {
  const a = wordSet(ownerSections[left].paragraphs.join(" ").replace(/<[^>]+>/g, " "));
  const b = wordSet(ownerSections[right].paragraphs.join(" ").replace(/<[^>]+>/g, " "));
  const overlap = [...a].filter(word => b.has(word)).length / Math.max(1, new Set([...a, ...b]).size);
  assert(overlap < 0.55, `owner sections ${ownerSections[left].id}/${ownerSections[right].id} are substantively too similar (${overlap})`);
}

const genericTransitionAnswers = {
  "Q-METHOD-PAST": ["Дасгал хөдөлгөөн"], "Q-METHOD-DURATION": "1 жилээс урт",
  "Q-METHOD-RESULT": "Жин буурсан", "Q-METHOD-REGAIN": "Хэсэгчлэн нэмэгдсэн",
  "Q-METHOD-BARRIERS": ["Үр дүн удаан харагдах"], "Q-TRAVEL": "Машинаар", "Q-MOVEMENT": "Бага",
  "OPEN-PAST": "Өмнөх аргын дараа үргэлжлүүлэх орлуулах хувилбар бэлэн байгаагүй."
};
const withoutInjury = reportFor(genericTransitionAnswers);
const withInjury = reportFor({ ...genericTransitionAnswers, "Q-METHOD-STOP": "Дасгал хийх үед гэмтэл гарсан тул зогсоосон" });
const withoutInjuryText = JSON.stringify(publicReport(withoutInjury));
const withInjuryText = JSON.stringify(publicReport(withInjury));
assert(!/хуучин гэмт|гэмтэл|өвдөлт|Зовиур/.test(withoutInjuryText), "injury language requires injury evidence");
assert(/гэмтэл|өвдөлт|Зовиур/.test(withInjuryText), "explicit injury evidence must change injury guidance");
assert.notEqual(withoutInjuryText, withInjuryText, "injury evidence must materially change the report");
assert(!withoutInjuryText.includes("үргэлжлүүлэх боломжгүй болсон"), "forced-continuation wording requires explicit evidence");
assert(withInjuryText.includes(injuryChronology), "explicit injury stop must use the exact chronology wording");
assert(withInjuryText.includes(ownerPatternCopy), "fully supported injury cluster must use the concise maintenance formulation");
assert.equal(withInjuryText.split(injuryChronology).length - 1, 1, "injury chronology must not repeat across sections");
assert(!withoutInjury.contextualFactors.some(item => item.id === "injury_or_pain_barrier"), "injury context requires injury evidence");
assert(withInjury.contextualFactors.some(item => item.id === "injury_or_pain_barrier" && item.title === "Өмнөх гэмтлийг дараагийн хөдөлгөөнд харгалзах шаардлага"), "explicit injury stop must use the required heading");
assert(withInjury.contextualFactors.some(item => item.summary === "Дараагийн хөдөлгөөнөө сонгохдоо гэмтэлтэй холбоотой зовиур нэмэгдэхгүй байхыг харгалзана."), "injury context must not repeat the chronology");
const structuredInjuryOnly = reportFor({ ...genericTransitionAnswers, "Q-METHOD-BARRIERS": ["Үр дүн удаан харагдах", "Өвдөлт эсвэл хөдөлгөөний хязгаарлалт"] });
assert(!JSON.stringify(publicReport(structuredInjuryOnly)).includes("үргэлжлүүлэх боломжгүй болсон"), "a generic physical barrier must not imply inability to continue");

const voluntaryStop = reportFor({ ...genericTransitionAnswers, "Q-METHOD-STOP": "Өөрийн хүсэлтээр аргаа зогсоохоор шийдсэн." });
const unknownStop = reportFor({ ...genericTransitionAnswers, "Q-METHOD-STOP": "Тодорхой санахгүй байна." });
assert(JSON.stringify(publicReport(voluntaryStop)).includes("Өмнөх аргаа зогсоосны дараа үр дүнг өдөр тутам хадгалах өөр хувилбар бэлэн байгаагүй байна."), "voluntary stopping must use the voluntary branch");
assert(JSON.stringify(publicReport(unknownStop)).includes("Өмнөх оролдлого үргэлжлээгүй үед үр дүнг өдөр тутам хадгалах өөр хувилбар бэлэн байгаагүй байна."), "unknown stopping must use the neutral branch");
assert(!JSON.stringify(publicReport(voluntaryStop)).includes("Гэмтлийн улмаас"), "voluntary stopping must not use injury wording");

const withoutCost = reportFor(genericTransitionAnswers);
const withCost = reportFor({ ...genericTransitionAnswers, "Q-METHOD-BARRIERS": ["Үр дүн удаан харагдах", "Зардал"] });
const withoutCostText = JSON.stringify(publicReport(withoutCost));
const withCostText = JSON.stringify(publicReport(withCost));
assert(!/зардал|төлбөр/i.test(withoutCostText), "cost wording requires explicit cost evidence");
assert(/зардал|төлбөр/i.test(withCostText), "explicit cost evidence must change cost interpretation");
assert.notEqual(withoutCostText, withCostText, "cost evidence must materially change the report");
assert(!Object.hasOwn(withoutCost.prioritizedStartingAction.plan || {}, "additionalCost"), "cost plan field requires explicit cost evidence");
assert(Object.hasOwn(withCost.prioritizedStartingAction.plan || {}, "additionalCost"), "cost evidence must add the cost plan field");

const withoutSchedule = reportFor(genericTransitionAnswers);
const withSchedule = reportFor({ ...genericTransitionAnswers, "Q-METHOD-BARRIERS": ["Үр дүн удаан харагдах", "Цагийн хуваарь"] });
const withoutScheduleText = JSON.stringify(publicReport(withoutSchedule));
const withScheduleText = JSON.stringify(publicReport(withSchedule));
assert(!/цагийн хуваарь|Завгүй/.test(withoutScheduleText), "schedule wording requires explicit schedule evidence");
assert(/цагийн хуваарь|Завгүй/.test(withScheduleText), "explicit schedule evidence must change schedule interpretation");
assert.notEqual(withoutScheduleText, withScheduleText, "schedule evidence must materially change the report");
assert(!withoutSchedule.prioritizedStartingAction.plan?.fallback.includes("Завгүй"), "busy-day wording requires schedule evidence");
assert(withSchedule.prioritizedStartingAction.plan?.fallback.includes("Завгүй"), "schedule evidence must add busy-day wording");

const withoutRegain = reportFor({ ...genericTransitionAnswers, "Q-METHOD-REGAIN": "Үгүй" });
assert(!JSON.stringify(publicReport(withoutRegain)).includes("Үүний дараа жин буцжээ"), "regain wording requires positive regain evidence");
const withoutInitialSuccess = reportFor({ ...genericTransitionAnswers, "Q-METHOD-RESULT": "Жин тогтвортой байсан" });
assert(!JSON.stringify(publicReport(withoutInitialSuccess)).includes("Эхний үед жин буурсан"), "initial-success wording requires explicit success evidence");
const withoutLongDuration = reportFor({ ...genericTransitionAnswers, "Q-METHOD-DURATION": "6–12 сар" });
assert(!JSON.stringify(publicReport(withoutLongDuration)).includes("нэг жилээс урт"), "long-duration wording requires the exact duration gate");

const reportSource = fs.readFileSync(require.resolve("../netlify/functions/_lib/report.js"), "utf8");
for (const forbiddenName of ["ownerLike", "ownerProfile", "ownerReport", "ownerSpecialCase"]) assert(!reportSource.includes(forbiddenName), `user-specific production branch remains: ${forbiddenName}`);
assert.equal((reportSource.match(/function buildFullReport/g) || []).length, 1, "all assessments must use one generic report builder");
assert.equal((reportSource.match(/prioritizedStartingAction:/g) || []).length, 1, "the report must expose one first-action variable only");

const openOnly = reportFor({ "OPEN-PAST": "Бүх зүйл нурсан мэт санагдсан" });
assert.equal(openOnly.influencingPatterns.length, 0, "open text cannot independently create a pattern");

const raw = buildFullReport(buildEvidence(rows(fixtures[0].answers)));
assert(raw.internalEvidenceMap.signals.every(item => item.questionId));
assert(raw.internalEvidenceMap.sentenceEvidence.length > 0);
assert(raw.internalEvidenceMap.sentenceEvidence.every(item => item.sentenceTemplateId && item.section && item.text && Array.isArray(item.actualSupportingQuestionIds)));
assert(raw.internalEvidenceMap.sentenceEvidence.some(item => item.sentenceTemplateId === "pattern_emotional_regulation_explanation"), "pattern explanations must have trace IDs");
assert(raw.internalEvidenceMap.sentenceEvidence.some(item => item.sentenceTemplateId.startsWith("strategy_")), "strategy sentences must have trace IDs");
assert(!Object.hasOwn(publicReport(raw), "internalEvidenceMap"));

const sentences = substantiveSentences(publicReport(multi));
assert.equal(sentences.length, new Set(sentences).size, "substantive sentences must not repeat across report fields");

const noMedicalTrigger = reportFor({ "Q-EMOTION": "Нэлээд нэмэгддэг", "Q-METHOD-BARRIERS": ["Стресс ба сэтгэл хөдлөл"] });
assert.equal(noMedicalTrigger.professionalGuidance, null, "medical guidance requires its exact trigger");
assert.equal(noMedicalTrigger.urgentGuidance, null, "urgent guidance requires its exact trigger");
const bloodPressureTrigger = reportFor({ "Q-BLOOD-PRESSURE": "Хэвийн хэмжээнээс бага эсвэл их гарч байсан" });
assert(bloodPressureTrigger.professionalGuidance.includes("даралт сүүлийн үед давтан хэвийн бус"));
assert(bloodPressureTrigger.urgentGuidance.includes("яаралтай тусламж"));

const emotionalReport = reportFor(fixtures.find(item => item.name === "emotional eating dominant").answers);
const emotionalPublicText = JSON.stringify(publicReport(emotionalReport));
assert(emotionalPublicText.includes("Хоол хоорондын зай тань тогтвортой байгаа нь хоолны цаг тогтмол бус байх асуудал гол саад биш гэдгийг харуулна."));
assert(emotionalPublicText.includes("Цадсанаа анзаараад зогсож чаддаг нь идэх хэмжээгээ тохируулахад ашиглаж болох бодит давуу тал юм."));
const conditionalRelief = "Хэрэв хоол тухайн мөчид түр амсхийх мэт мэдрэмж өгдөг бол стрессийн шалтгаан хэвээр үлдэхэд идэх хүсэл дахин төрж болно.";
assert(JSON.stringify(publicReport(emotionalReport)).includes(conditionalRelief), "supported emotional report must distinguish hypothesis from fact");
assert(!JSON.stringify(publicReport(withoutInjury)).includes(conditionalRelief), "food-as-relief hypothesis requires emotional evidence");
assert(!JSON.stringify(publicReport(emotionalReport)).includes("түр тайвшрал"), "emotional experiment must not present temporary relief as a confirmed fact");
assert(!JSON.stringify(publicReport(emotionalReport)).includes("хоолоор түр тайвширсны дараа"), "pattern interaction must not present food-as-relief as a confirmed chronology");
assert.equal(emotionalReport.prioritizedStartingAction.reason, "Энэ туршилт хоолыг хорихгүйгээр тухайн мөчид хоол ямар хэрэгцээг нөхөж байгаа мэт санагддаг, идсэний дараа тэр хэрэгцээ хэрхэн өөрчлөгддөгийг ажиглана.");
assert(!JSON.stringify(publicReport(emotionalReport)).includes("түр тайвшрал дараагийн сонголтод хэрхэн нөлөөлдгийг шалгана"));
assert.equal(emotionalReport.prioritizedStartingAction.plan.kind, "emotional_observation");
assert.equal(emotionalReport.prioritizedStartingAction.plan.variable, "стресс нэмэгдэх мөчид хэрэгцээгээ ялгаж анзаарах богино завсарлага");
assert(emotionalReport.prioritizedStartingAction.plan.action.includes("Одоо биеэрээ өлсөж байна уу"));
assert(emotionalReport.prioritizedStartingAction.plan.observe.includes("дараагийн сонголтод"));
assert(emotionalReport.prioritizedStartingAction.plan.keepConstant.includes("зориуд өөрчлөхгүй"));
assert(emotionalReport.prioritizedStartingAction.plan.success);
assert(emotionalReport.prioritizedStartingAction.plan.fallback.includes("нөхөж давтахгүй"));
assert(!/\d/.test(JSON.stringify(emotionalReport.prioritizedStartingAction.plan)), "emotional experiment must not contain unapproved numbers");

const neutralFixture = fixtures.find(item => item.name === "fully routed neutral protective");
const neutralRoute = questionBank.visibleQuestions(neutralFixture.answers);
const neutralReport = reportFor(neutralFixture.answers);
assert.equal(neutralRoute.length, questionBank.MAX_ROUTED_QUESTION_COUNT - 1, "single-method fixture auto-binds the longest method without adding a visible question");
assert.equal(neutralRoute.filter(question => question.required).length, 23, "neutral route required-question coverage changed");
assert.equal(neutralRoute.filter(question => neutralFixture.answers[question.id] != null).length, neutralRoute.length, "neutral fixture must answer every routed question");
assert.deepEqual(neutralRoute.filter(question => questionBank.validateAnswer(question, neutralFixture.answers[question.id])).map(question => question.id), [], "neutral fixture must complete without validation errors");
assert.equal(neutralReport.influencingPatterns.length, 0);
assert(neutralReport.neutralResult.overview.length >= 2, "neutral report needs two meaningful conclusions");
const neutralPublicText = JSON.stringify(publicReport(neutralReport));
assert(neutralPublicText.includes("Энэ нь хүндрэл огт байхгүй гэсэн үг биш. Харин асуумжид хамрагдсан чиглэлүүдээс аль нэг нь бусдаасаа илүү тод, давтагдсан хэв маяг болж ялгараагүйг илэрхийлнэ."));
for (const missingDataCopy of ["хангалттай мэдээлэл бүрдээгүй", "мэдээлэл хүрэлцээгүй"]) assert(!neutralPublicText.includes(missingDataCopy), `fully routed neutral report must not receive missing-data wording: ${missingDataCopy}`);
const incompleteNeutralText = JSON.stringify(publicReport(reportFor({ "Q-EMOTION": "Өөрчлөгддөггүй" })));
assert(incompleteNeutralText.includes("мэдээлэл хүрэлцээгүй"), "incomplete assessment must retain separately gated insufficient-information copy");
assert.equal(neutralReport.neutralResult.strengths.length, 4, "neutral strengths must be grouped into four narratives");
const groupedNeutralStrengths = JSON.stringify(neutralReport.neutralResult.strengths);
for (const expectedStrength of ["өлсөх мэдрэмжээ анзаарах", "цадсанаа мэдээд зогсох", "идэх хэмжээгээ тохируулах", "стрессийн үеийн идэх хүсэл", "орчны хоолны дохио", "нойрны хугацаа, чанар", "өдрийн хөдөлгөөний түвшин", "тогтвортой хоолны хэмнэл", "өмнөх аргаа удаан хугацаанд үргэлжлүүлсэн"]) assert(groupedNeutralStrengths.toLowerCase().includes(expectedStrength), `neutral report missing grouped strength: ${expectedStrength}`);
assert(!groupedNeutralStrengths.includes("үр дүнгээ хадгалсан"), "no-regain without explicit initial success must not become a maintenance strength");
assert(!groupedNeutralStrengths.includes("эрсдэлийг бууруулж байна"), "neutral strengths must not claim causal risk reduction");
assert.equal(neutralReport.neutralResult.limits.length, 1, "neutral limitation must not repeat the observation rationale");
assert(!neutralPublicText.includes("Асуумжийн хариултаар тод хэв маяг ялгараагүй тул өдөр тутмын бодит нөхцөл хэд хэдэн удаа давтагдаж байгаа эсэхийг ажиглавал дараагийн дүгнэлт илүү тод болно."), "redundant neutral observation rationale remains");
assert(!JSON.stringify(neutralReport.neutralResult).includes("өмнөх оролдлогын явцын талаар илүү дэлгэрэнгүй мэдээлэл"), "fully routed neutral report must not claim previous-attempt information is missing");
const emotionOnlyNeutral = reportFor({ "Q-EMOTION": "Өөрчлөгддөггүй" });
assert.equal(emotionOnlyNeutral.neutralResult.strengths.length, 1);
assert(emotionOnlyNeutral.neutralResult.strengths[0].includes("Стрессийн үеийн идэх хүсэл"));
assert(!JSON.stringify(emotionOnlyNeutral.neutralResult.strengths).includes("өлсөх мэдрэмжээ"), "neutral group must not claim unsupported body-signal strength");
assert(neutralReport.neutralResult.limits.some(item => item.includes("оношлохгүй")));
assert(neutralReport.neutralResult.observation.action);
assert.equal(neutralReport.neutralResult.subtype, "protective");
assert.equal(neutralReport.neutralResult.observation.variable, "одоо тогтвортой ажиллаж буй хоол, хөдөлгөөний хэмнэл");
assert(neutralReport.neutralResult.observation.decisionRule);
assert(!/гэмтэл|зардал|цагийн хуваарь|даралт|эм хэрэглэх/i.test(JSON.stringify(neutralReport.neutralResult)), "neutral report must not insert unsupported advice");
assert(!Object.hasOwn(publicReport(neutralReport), "professionalGuidance"), "neutral public payload must not repeat its professional-scope guidance in an unused top-level field");
const sleepContextReport = reportFor(fixtures.find(item => item.name === "sleep fatigue context").answers);
assert(sleepContextReport.contextualFactors.some(item => item.id === "sleep_fatigue"), "supported sleep context must remain contextual");
assert(JSON.stringify(sleepContextReport.neutralResult.overview).includes("нойр, ядаргаа нь өдөр тутмын сонголтод нөлөөлөх нөхцөл"), "neutral mode must retain its supported contextual finding");

const sourceCopy = ["../netlify/functions/_lib/report-copy.js", "../netlify/functions/_lib/report.js", "../app.js"].map(file => fs.readFileSync(require.resolve(file), "utf8")).join("\n");
for (const phrase of forbiddenPublicTerms) assert(!sourceCopy.includes(phrase), `forbidden source copy: ${phrase}`);
assert(!/openai|anthropic|\bllm\b/i.test(reportSource), "report copy must not be generated by a runtime AI service");
assert(!/\$\{[^}]+\}-(тэй|той|аас)/.test(sourceCopy), "Mongolian suffixes must not be attached dynamically to labels");

const tenProfiles = [
  "sustained movement attempt with explicit constraints", "emotional eating dominant", "environmental cue dominant",
  "irregular meals and late hunger", "sleep fatigue context", "satiety and portion difficulty",
  "restrictive attempt and regain", "plan incompatible with routine", "stress eating + poor sleep + evening hunger",
  "mostly neutral and prefer not to answer"
].map(name => fixtures.find(item => item.name === name));
assert(tenProfiles.every(Boolean), "ten-profile copy QA fixtures must exist");
const tenReports = tenProfiles.map(fixture => publicReport(reportFor(fixture.answers)));
for (const [index, report] of tenReports.entries()) {
  const text = JSON.stringify(report);
  assert(!/арга тасар|төлөвлөгөө тасар|дэглэм тасар/i.test(text), `${tenProfiles[index].name}: incorrect stop idiom leaked`);
  for (const phrase of forbiddenPublicTerms) assert(!text.includes(phrase), `${tenProfiles[index].name}: forbidden copy ${phrase}`);
  assert((text.match(/байж болно/g) || []).length <= 3, `${tenProfiles[index].name}: excessive hedge copy`);
  const pendingPublicPlan = report.influencingPatterns.some(pattern => pattern.title === "Өмнөх аргын үр дүнг хадгалах төлөвлөгөө дутсан нь") && !report.prioritizedStartingAction;
  assert.equal(report.influencingPatterns.length ? 1 : 0, report.prioritizedStartingAction || pendingPublicPlan ? 1 : 0, `${tenProfiles[index].name}: exactly one first-action decision when patterns exist`);
}
function sentenceSet(report) { return new Set(substantiveSentences(report)); }
function jaccard(left, right) {
  const a = sentenceSet(left); const b = sentenceSet(right);
  const intersection = [...a].filter(item => b.has(item)).length;
  return intersection / Math.max(1, new Set([...a, ...b]).size);
}
const similarityRows = [];
for (let left = 0; left < tenReports.length; left += 1) for (let right = left + 1; right < tenReports.length; right += 1) {
  const similarity = jaccard(tenReports[left], tenReports[right]);
  similarityRows.push({ left: tenProfiles[left].name, right: tenProfiles[right].name, similarity });
  assert(similarity < 0.7, `${tenProfiles[left].name} and ${tenProfiles[right].name}: personalized reports are too similar (${similarity})`);
}
assert.equal(similarityRows.length, 45, "ten profiles require a complete pairwise similarity report");

const numericDecision = fs.readFileSync(require.resolve("../docs/REPORT_NUMERIC_OWNER_DECISION.md"), "utf8");
assert(numericDecision.includes("OWNER REVIEW REQUIRED"));
assert(!numericDecision.includes("OWNER APPROVED"));

const frozenFileHashes = Object.freeze({
  "netlify/functions/_lib/report-signals.js": "9b0f5926b274cea21cf256c8033a8ca8639267319f1115633b162c5d22d0493e",
  "netlify/functions/_lib/report-patterns.js": "489110da1226350da09e775b63741deefead01172cebbb67044372ac60e5b97f",
  "netlify/functions/_lib/safety.js": "406551d98b383a4905bd24dd6ccd9970552725f88374c0e5a10f3419590f0607",
  "netlify/functions/_lib/payment.js": "f8f8cd9a00abb4179525ebda2c2fc0b13c64072d93e908213b4a04a2c2d66e87",
  "netlify/functions/_lib/recovery.js": "60a78d270997e28ab6985c878d3ee55cb9792061a0daa9eaa4becf7c35a3d765",
  "questions.js": "ac79aa5e83d6c37234f886f2683fd036ba80862afa5f3b6f3d8b2131f7f22d14"
});
for (const [file, expectedHash] of Object.entries(frozenFileHashes)) {
  const actualHash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  assert.equal(actualHash, expectedHash, `${file}: frozen semantics changed`);
}

console.log("deterministic multi-factor report tests passed");
