"use strict";

const assert = require("node:assert/strict");
const cohort = require("./fixtures/virtual-cohort-v2.js");
const questions = require("../questions.js");
const app = require("../app.js");
const { buildEvidence, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");

const byId = Object.fromEntries(cohort.map(profile => [profile.id, profile]));
const rows = answers => Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
function reportFor(id, overrides = {}) {
  const answers = { ...byId[id].answers, ...overrides };
  const linkedLongestMethod = answers["Q-METHOD-LONGEST"] || questions.autoLinkedLongestMethod(answers);
  return buildFullReport(
    buildEvidence(rows(answers), [], { questionnaireVersion: questions.QUESTIONNAIRE_VERSION, linkedLongestMethod }),
    new Date("2026-07-18T06:00:00.000Z"),
    { questionnaireVersion: questions.QUESTIONNAIRE_VERSION }
  );
}
function rendered(report) {
  return app._test.buildReportSections(publicReport(report)).filter(section => section.visible).flatMap(section => section.paragraphs).join(" ");
}

const stableRhythm = "Хоол хоорондын зай тань тогтвортой байгаа нь хоолны цаг тогтмол бус байх асуудал гол саад биш гэдгийг харуулна.";
const lateHungerCaveat = "Харин өлсөх, цадах дохиогоо цагт нь анзаарах хүндрэл тусдаа хэвээр байна.";
const falseLateHungerStrength = "Таны хоолны хэмнэл тогтвортой байгаа нь хэт өлсөлт одоогийн гол саад биш байгааг харуулна.";
const vu04 = reportFor("VU-04");
const vu04Text = rendered(vu04);
assert(vu04.influencingPatterns.some(pattern => pattern.id === "hunger_satiety"), "VU-04 must retain hunger/satiety difficulty");
assert(!vu04.influencingPatterns.some(pattern => pattern.id === "irregular_meals_late_hunger"), "VU-04 stable rhythm must suppress only the irregular-meal pattern");
assert(vu04Text.includes(stableRhythm), "VU-04 must describe the narrow stable-rhythm strength");
assert(vu04Text.includes(lateHungerCaveat), "VU-04 must preserve the independently supported late-hunger difficulty");
assert(!vu04Text.includes(falseLateHungerStrength), "VU-04 must not contradict late-hunger evidence");

const maintenanceStrength = "Өмнөх оролдлогын дараа жин буцаагүй нь тогтвортой болгож чадсан зүйл байсныг харуулж байна.";
const noChangeNoRegain = reportFor("VU-05");
const weightLossNoRegain = reportFor("VU-05", { "Q-METHOD-RESULT": "Жин буурсан", "Q-METHOD-REGAIN": "Үгүй" });
assert(!noChangeNoRegain.protectiveFactors.some(item => item.text === maintenanceStrength), "no change + no regain is not maintenance success");
assert(weightLossNoRegain.protectiveFactors.some(item => item.text === maintenanceStrength), "weight loss + no regain may support maintenance strength");
for (const result of ["Жин нэмэгдсэн", "Тодорхой санахгүй"]) {
  assert(!reportFor("VU-05", { "Q-METHOD-RESULT": result, "Q-METHOD-REGAIN": "Үгүй" }).protectiveFactors.some(item => item.text === maintenanceStrength), `${result} + no regain is not maintenance success`);
}
assert(reportFor("VU-10").protectiveFactors.some(item => item.text === maintenanceStrength), "explicit target achievement/maintenance + no regain may support maintenance strength");

const noMethod = reportFor("VU-08");
assert(!noMethod.protectiveFactors.some(item => item.signal === "sustainability_barrier"), "no-method route must not create implementation experience");
assert(!rendered(noMethod).includes("тодорхой саадгүй хэрэгжүүлсэн"), "VU-08 public report must not claim an implementation experience");
assert(reportFor("VU-09").protectiveFactors.some(item => item.signal === "sustainability_barrier"), "a real linked method with duration and no stated barrier may support implementation experience");

for (const profile of cohort) {
  const text = rendered(reportFor(profile.id));
  assert(!text.includes("Хооллолт өөрчлөгдөөгүй"), `${profile.id}: unsupported comparative eating statement leaked`);
  assert(!/арга тасар|төлөвлөгөө тасар|дэглэм тасар/i.test(text), `${profile.id}: forbidden method/plan stop idiom leaked`);
}
const vu07Movement = reportFor("VU-07").contextualFactors.find(item => item.id === "low_movement");
assert(vu07Movement.summary.includes("Хооллолттой холбоотой нийтлэг саад хүчтэй илрээгүй боловч өдөр тутмын хөдөлгөөн бага байх нь зорилгод хүрэх хурдад нөлөөлж болно."));
const vu02Movement = reportFor("VU-02").contextualFactors.find(item => item.id === "low_movement");
assert(vu02Movement.summary.includes("Өдөр тутмын хөдөлгөөн бага байх нь зорилгод хүрэх хурдад нөлөөлж болно."));
assert(!vu02Movement.summary.includes("Хооллолттой холбоотой нийтлэг саад"), "protective eating synthesis requires all relevant protective domains");

const genericCue = "Өлсөөгүй үед идэх хүсэл хамгийн их төрүүлдэг нэг орчны дохиог сонгож, түүний хүртээмж эсвэл нөлөөг нэг аргаар багасгана.";
const cueCases = [
  { cue: "Хоол харагдах", must: "ил харагддаг нэг хүнсийг", mayNameFood: true },
  { cue: "Хоол захиалгын апп нээх", must: "мэдэгдлийг унтраах эсвэл нүүр дэлгэцийн товчлолыг", mayNameFood: false },
  { cue: "Бусад хүн идэж байх", must: "урьдчилсан хариу эсвэл өөр үйлдлийг", mayNameFood: false },
  { cue: "Хоолны үнэр үнэртэх", must: genericCue, mayNameFood: false }
];
for (const testCase of cueCases) {
  const current = reportFor("VU-02", { "Q-CUE": [testCase.cue] });
  const experiment = current.prioritizedStartingAction.action;
  assert(current.overallPicture.includes("Өлсөөгүй үед орчны зарим дохио идэх хүсэлд тань нөлөөлдөг байна."), `${testCase.cue}: overview must not invent a different cue`);
  assert(experiment.includes(testCase.must), `${testCase.cue}: experiment does not match cue`);
  if (!testCase.mayNameFood) assert(!experiment.includes("хүнс"), `${testCase.cue}: experiment must not invent a food target`);
}
const multiCue = reportFor("VU-02");
assert(multiCue.prioritizedStartingAction.action.includes(genericCue), "multiple cues must use the no-strongest-cue fallback");
assert(!multiCue.prioritizedStartingAction.action.includes("хүнс"), "multi-cue experiment must not invent a food target");
const noCue = reportFor("VU-02", { "Q-CUE": ["Аль нь ч үгүй"] });
assert(!noCue.influencingPatterns.some(pattern => pattern.id === "environmental_cues"), "no-cue option must not create an environmental experiment");

const defaultMealReason = "Хоолны зайг эхэлж тогтворжуулснаар хэт өлсөлтийн нөлөөг багасгаж, өлсөх болон цадах дохиогоо анзаарах хүндрэл хэр өөрчлөгдөж байгааг илүү тод ажиглана.";
const stressReason = "Стрессийн үеийн идэх хүсэл тусдаа хэвээр байгаа эсэхийг мөн ажиглана.";
const mealNoEmotion = reportFor("VU-03");
assert.equal(mealNoEmotion.prioritizedStartingAction.priorityReason, defaultMealReason);
assert(!mealNoEmotion.prioritizedStartingAction.priorityReason.includes("Стресс"), "meal timing must not mention stress without an emotional pattern");
const mealWithEmotion = reportFor("VU-03", { "Q-EMOTION": "Нэлээд нэмэгддэг", "Q-METHOD-BARRIERS": ["Цагийн хуваарь", "Өлсөх эсвэл цадах мэдрэмж", "Стресс ба сэтгэл хөдлөл"] });
assert(mealWithEmotion.influencingPatterns.some(pattern => pattern.id === "emotional_regulation"), "paired fixture must independently support emotional regulation");
assert.equal(mealWithEmotion.prioritizedStartingAction.priorityReason, `${defaultMealReason} ${stressReason}`);

console.log("V2.1 factuality gates and report-level contradictions passed");
