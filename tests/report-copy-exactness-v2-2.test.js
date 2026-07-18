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

const menstrualCopy = Object.freeze({
  "Заримдаа зөрдөг": "Та мөчлөг тань заримдаа зөрдөг гэж хариулжээ. Энэ нь жингийн өөрчлөлтийн шалтгааныг дангаараа тогтоохгүй. Хэрэв зөрүү давтагдах, удаан үргэлжлэх эсвэл танд санаа зовнил төрүүлэх бол эмэгтэйчүүдийн эмчтэй зөвлөнө үү.",
  "Ихэнхдээ тогтмол биш": "Сарын тэмдгийн мөчлөг тань ихэнхдээ тогтмол биш гэж хариулжээ. Энэ нь жингийн өөрчлөлтийн шалтгааныг дангаараа тогтоохгүй. Хэрэв энэ байдал үргэлжилж байгаа эсвэл танд санаа зовнил төрүүлж байвал эмэгтэйчүүдийн эмчтэй зөвлөнө үү.",
  "Сүүлийн 3 сард ирээгүй": "Та сүүлийн гурван сард сарын тэмдэг ирээгүй гэж хариулжээ. Үүний шалтгааныг энэ тестээр тогтоох боломжгүй тул эмэгтэйчүүдийн эмчтэй зөвлөнө үү."
});
for (const [answer, expected] of Object.entries(menstrualCopy)) {
  const current = reportFor("VU-06", { "MC-01": answer });
  assert(current.professionalGuidance?.includes(expected), `${answer}: exact menstrual guidance missing`);
  for (const [otherAnswer, otherCopy] of Object.entries(menstrualCopy)) if (otherAnswer !== answer) {
    assert(!current.professionalGuidance.includes(otherCopy), `${answer}: guidance from ${otherAnswer} leaked`);
  }
  assert(rendered(current).includes(expected), `${answer}: exact guidance is hidden from the rendered report`);
}
const regularCycle = reportFor("VU-06", { "MC-01": "Тогтмол" });
assert(!regularCycle.professionalGuidance, "regular cycle must not render irregular-cycle guidance");
for (const phrase of Object.values(menstrualCopy)) assert(!rendered(regularCycle).includes(phrase));
for (const prohibitedDiagnosis of ["PCOS", "дааврын тэнцвэргүй", "үргүйдэл", "цэвэршилт", "жирэмсэн байж болзошгүй"]) {
  for (const answer of [...Object.keys(menstrualCopy), "Тогтмол"]) assert(!rendered(reportFor("VU-06", { "MC-01": answer })).includes(prohibitedDiagnosis), `${answer}: prohibited diagnosis leaked`);
}
assert.equal(reportFor("VU-06").professionalGuidance, menstrualCopy["Заримдаа зөрдөг"]);
assert.equal(reportFor("VU-09").professionalGuidance, menstrualCopy["Ихэнхдээ тогтмол биш"]);

const cueOptions = ["Хоол харагдах", "Хоолны үнэр үнэртэх", "Хоол захиалгын апп нээх", "Бусад хүн идэж байх"];
function selectedCueSentence(cues) {
  const normalized = cues.map((cue, index) => index === 0 ? cue : `${cue.charAt(0).toLowerCase()}${cue.slice(1)}`);
  const list = normalized.length === 1 ? normalized[0] : `${normalized.slice(0, -1).join(", ")} эсвэл ${normalized.at(-1)}`;
  return `${list} үед өлсөөгүй байсан ч идэх хүсэл төрдөг гэж хариулжээ.`;
}
function assertCueReport(cues) {
  const current = reportFor("VU-02", { "Q-CUE": cues });
  const pattern = current.influencingPatterns.find(item => item.id === "environmental_cues");
  assert(pattern, `${cues.join(" + ")}: environmental pattern missing`);
  assert.equal(pattern.evidenceSummary, selectedCueSentence(cues), `${cues.join(" + ")}: selected-cue sentence mismatch`);
  for (const option of cueOptions.filter(option => !cues.includes(option))) assert(!pattern.evidenceSummary.includes(option.toLowerCase()), `${cues.join(" + ")}: unselected cue ${option} leaked`);
  return current;
}
for (const cue of cueOptions) assertCueReport([cue]);
for (let left = 0; left < cueOptions.length; left += 1) for (let right = left + 1; right < cueOptions.length; right += 1) assertCueReport([cueOptions[left], cueOptions[right]]);
const vu02 = assertCueReport(byId["VU-02"].answers["Q-CUE"]);
assert.equal(vu02.influencingPatterns.find(item => item.id === "environmental_cues").evidenceSummary, "Хоол харагдах, хоол захиалгын апп нээх эсвэл бусад хүн идэж байх үед өлсөөгүй байсан ч идэх хүсэл төрдөг гэж хариулжээ.");
assert(!vu02.influencingPatterns.find(item => item.id === "environmental_cues").evidenceSummary.includes("үнэр"), "VU-02 must not name the unselected smell cue");
assert(!rendered(vu02).includes("үнэр"), "VU-02 rendered report must contain zero unselected smell cues");
assert(vu02.prioritizedStartingAction.action.includes("Өлсөөгүй үед идэх хүсэл хамгийн их төрүүлдэг нэг орчны дохиог сонгож, түүний хүртээмж эсвэл нөлөөг нэг аргаар багасгана."), "VU-02 multi-cue experiment must remain generic");
for (const excluded of [["Аль нь ч үгүй"], ["Хариулахгүй"]]) {
  const current = reportFor("VU-02", { "Q-CUE": excluded });
  assert(!current.influencingPatterns.some(item => item.id === "environmental_cues"), `${excluded[0]} must not create an environmental pattern`);
  assert(!current.prioritizedStartingAction || current.prioritizedStartingAction.patternId !== "environmental_cues", `${excluded[0]} must not create an environmental experiment`);
}

const expectedSleepAction = "Шөнийн дуудлага эсвэл урт ажлын өдрийн дараа хэрэглэх, урьдчилан сонгосон, бэлтгэл бага шаарддаг нэг хялбар хувилбар бэлдэнэ.";
const expectedSleepVariable = "шөнийн дуудлага эсвэл урт ажлын өдрийн дараах урьдчилан сонгосон хялбар хувилбар";
const vu05 = reportFor("VU-05");
assert.equal(vu05.prioritizedStartingAction.action, expectedSleepAction);
assert.equal(vu05.prioritizedStartingAction.plan.variable, expectedSleepVariable);
assert(!/хоол|алхалт|дасгал/.test(`${vu05.prioritizedStartingAction.action} ${vu05.prioritizedStartingAction.plan.variable}`), "VU-05 copy must not invent a food or movement prescription");
for (const profile of cohort) assert(!rendered(reportFor(profile.id)).includes("өгөгдмөл хувилбар"), `${profile.id}: public default-option wording leaked`);

console.log("V2.2 copy-exactness rendering tests passed");
