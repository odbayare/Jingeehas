"use strict";

const assert = require("node:assert/strict");
const questions = require("../questions.js");
const profiles = require("./fixtures/v5-virtual-users.js");
const { calculateAssessmentSafety } = require("../netlify/functions/_lib/safety.js");
const { buildEvidence, buildFullReport } = require("../netlify/functions/_lib/report.js");
const { validateReportForActivation } = require("../netlify/functions/_lib/report-validation.js");
const V5 = questions.BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION;

const rows = answers => Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
function result(profile) {
  const route = questions.visibleQuestions(profile.answers, V5);
  const routeIds = route.map(question => question.id);
  for (const question of route) assert.equal(questions.validateAnswer(question, profile.blank.includes(question.id) ? null : profile.answers[question.id], { answers: profile.answers, version: V5 }), "", `${profile.id}:${question.id}`);
  const safety = calculateAssessmentSafety(profile.answers);
  if (safety.route !== "eligible") return { id: profile.id, routeIds, route: safety.route, patterns: [], interactions: [], contextual: [] };
  const evidence = buildEvidence(rows(profile.answers), [], { questionnaireVersion: V5, linkedLongestMethod: questions.autoLinkedLongestMethod(profile.answers, V5) });
  const report = buildFullReport(evidence, new Date("2026-09-08T00:00:00.000Z"), { questionnaireVersion: V5 });
  assert.equal(validateReportForActivation(report).valid, true, `${profile.id} report passes activation contract`);
  return { id: profile.id, routeIds, route: "commercial_eligible", report,
    patterns: report.internalEvidenceMap.patternEvidence.map(item => ({ id: item.id, score: item.score, supported: item.supported })),
    interactions: report.interactionSummary.map(item => item.id),
    coreTitles: report.influencingPatterns.map(item => item.title), contextual: report.contextualFactors.map(item => item.title) };
}

const results = profiles.map(result);
assert.equal(results.length, 15);
assert.equal(results.filter(item => item.route === "commercial_eligible").length, 12);
assert.deepEqual(results.slice(12).map(item => item.route), ["eating_behavior_professional", "urgent_self_harm", "urgent_medical_symptom"]);
for (const item of results.slice(12)) assert(!item.routeIds.some(id => id.startsWith("Q-METHOD-")), `${item.id} stops before method history`);

const byId = id => results.find(item => item.id === id);
assert.deepEqual(byId("U02").patterns, byId("U12").patterns, "body/function context does not change core pattern scores");
assert.deepEqual(byId("U02").interactions, byId("U12").interactions, "body/function context does not change counted interactions");
assert.deepEqual(byId("U09").patterns, byId("U10").patterns, "household context does not change core pattern scores");
assert.deepEqual(byId("U09").interactions, byId("U10").interactions, "household context does not change counted interactions");
assert.notDeepEqual(byId("U09").contextual, byId("U10").contextual, "household context remains contextual and visible");
assert(byId("U08").report.internalEvidenceMap.signals.some(item => item.signal === "maintenance_gap_explicit"), "U08 has maintenance gap anchor");
assert(!byId("U11").report.internalEvidenceMap.signals.some(item => item.signal === "maintenance_gap_explicit"), "U11 clear plan has no maintenance gap anchor");
for (const item of results.filter(result => result.report)) {
  assert(item.coreTitles.every(title => !item.contextual.includes(title)), `${item.id} core and contextual titles remain separate`);
}

console.log(`V5_LOGIC_15_RESULTS=${JSON.stringify(results.map(item => ({ id: item.id, route: item.route, logicalQuestionCount: item.routeIds.length,
  supportedPatternIds: item.patterns.filter(pattern => pattern.supported).map(pattern => pattern.id), interactions: item.interactions,
  coreTitles: item.coreTitles || [], contextualTitles: item.contextual })))} `);
console.log("v5-virtual-user-logic.test.js PASS");
