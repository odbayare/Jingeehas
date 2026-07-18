"use strict";

const assert = require("node:assert/strict");
const cohort = require("./fixtures/virtual-cohort-v1.js");
const questions = require("../questions.js");
const { buildEvidence, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");

const links = Object.freeze({
  "VU-01": "Хоолны дэглэм", "VU-02": "Илчлэг тоолох", "VU-03": "Хоолны дэглэм",
  "VU-05": "Онлайн хөтөлбөр эсвэл апп", "VU-06": "Хоолны дэглэм", "VU-10": "Алхалт"
});

function report(profile, overrides = {}) {
  const answers = { ...profile.answers, ...overrides };
  const linkedLongestMethod = links[profile.id] || questions.autoLinkedLongestMethod(answers);
  if (links[profile.id]) answers["Q-METHOD-LONGEST"] = links[profile.id];
  const rows = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
  return buildFullReport(buildEvidence(rows, [], { questionnaireVersion: questions.QUESTIONNAIRE_VERSION, linkedLongestMethod }), new Date("2026-07-18T00:00:00.000Z"), { questionnaireVersion: questions.QUESTIONNAIRE_VERSION });
}

const byId = Object.fromEntries(cohort.map(profile => [profile.id, profile]));
const reports = Object.fromEntries(cohort.map(profile => [profile.id, report(profile)]));
const patternIds = id => reports[id].influencingPatterns.map(item => item.id);
const publicText = id => JSON.stringify(publicReport(reports[id]));

for (const id of ["VU-01", "VU-02", "VU-03", "VU-04"]) {
  assert(!patternIds(id).includes("restrictive_rebound"), `${id}: method type/regain must not imply strictness`);
  assert(!publicText(id).includes("бүрэн хоригийн оронд"), `${id}: strict-rule recommendation must remain gated`);
}
assert(patternIds("VU-06").includes("restrictive_rebound"));
assert(publicText("VU-06").includes("Хэт хатуу дүрмээс болж төлөвлөгөөг бүхэлд нь орхих хэв маяг"));

assert(!patternIds("VU-04").includes("irregular_meals_late_hunger"), "3–4 hour rhythm is a hard contradiction to irregular meals");
assert(patternIds("VU-04").includes("hunger_satiety"), "late hunger may still support hunger/satiety");
assert(patternIds("VU-03").includes("irregular_meals_late_hunger"), "5+ hour rhythm anchors irregular meals");

for (const [movement, expectedSignal, forbidden] of [
  ["Маш бага", "very_low_movement", "Өдрийн нийт хөдөлгөөн их"],
  ["Бага", "low_movement", "маш бага гэж үнэлсэн"],
  ["Дунд", null, "Өдрийн нийт хөдөлгөөн их"],
  ["Их", "high_movement", "өдрийн нийт хөдөлгөөнөө бага"]
]) {
  const current = report(byId["VU-08"], { "Q-MOVEMENT": movement, "Q-TRAVEL": "Өөр хэлбэрээр" });
  const signals = current.internalEvidenceMap.signals.map(item => item.signal);
  if (expectedSignal) assert(signals.includes(expectedSignal), `${movement}: missing exact movement semantic`);
  else assert(!signals.some(item => ["very_low_movement", "low_movement", "high_movement"].includes(item)), `${movement}: must remain neutral`);
  assert(!JSON.stringify(publicReport(current)).includes(forbidden), `${movement}: public wording overstates movement`);
}

for (const id of ["VU-01", "VU-02", "VU-03", "VU-04"]) assert(!patternIds(id).includes("previous_attempt_sustainability"), `${id}: regain without explicit maintenance gap is insufficient`);
assert(patternIds("VU-07").includes("previous_attempt_sustainability"));
assert(reports["VU-07"].internalEvidenceMap.factGates.explicitInjuryStop);
assert(!report(byId["VU-07"], { "Q-METHOD-STOP": "Өвдөг хааяа өвддөг ч аргаа өөрийн хүсэлтээр зогсоосон.", "OPEN-PAST": "Өвдөлтөө ажиглаж байсан." }).internalEvidenceMap.factGates.explicitInjuryStop, "generic pain must not become injury-caused stopping");

assert(reports["VU-02"].contextualFactors.some(item => item.id === "low_movement"), "low movement must survive crowded pattern output");
assert(publicText("VU-09").includes("Сарын тэмдгийн мөчлөг тогтмол бус байгаа нь жингийн шалтгааныг дангаараа тогтоохгүй"));

const expectedFirst = {
  "VU-01": "pause_before_emotional_eating", "VU-02": "change_one_visible_cue", "VU-03": "anchor_one_meal_time",
  "VU-04": "mid_meal_pause", "VU-05": "schedule_fatigue_default", "VU-06": "remove_one_strict_rule",
  "VU-07": "maintenance_movement_bridge"
};
for (const [id, recommendationId] of Object.entries(expectedFirst)) assert.equal(reports[id].prioritizedStartingAction?.recommendationId, recommendationId, `${id}: first experiment mismatch`);
assert.equal(reports["VU-08"].neutralResult.subtype, "low_movement");
assert.equal(reports["VU-09"].neutralResult.subtype, "biological");
assert.equal(reports["VU-10"].neutralResult.subtype, "protective");
assert.equal(new Set(["VU-08", "VU-09", "VU-10"].map(id => reports[id].neutralResult.observation.variable)).size, 3, "neutral subtype actions must materially differ");

for (const current of Object.values(reports)) for (const trace of current.internalEvidenceMap.patternEvidence) {
  assert(Array.isArray(trace.mandatoryAnchor));
  assert(Array.isArray(trace.independentSupportingQuestionIds));
  assert(Array.isArray(trace.sharedContextualEvidence));
  assert(Array.isArray(trace.contradictions));
}

const legacyMulti = { ...byId["VU-07"].answers, "Q-METHOD-PAST": ["Дасгал хөдөлгөөн", "Хоолны дэглэм"] };
const legacyReport = buildFullReport(buildEvidence(Object.entries(legacyMulti).map(([questionId, value]) => ({ questionId, value }))));
assert(!legacyReport.influencingPatterns.some(item => item.id === "previous_attempt_sustainability"), "legacy multi-method history without linkage cannot activate maintenance attribution");
assert(!JSON.stringify(publicReport(legacyReport)).includes("Өмнөх арга хөдөлгөөнд суурилж байжээ"), "legacy multi-method chronology must not identify a method");

console.log("V2 report attribution, guidance, and first-experiment tests passed");
