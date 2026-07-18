"use strict";

const assert = require("node:assert/strict");
const cohort = require("./fixtures/virtual-cohort-v2.js");
const questions = require("../questions.js");
const app = require("../app.js");
const { buildEvidence, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");

const byId = Object.fromEntries(cohort.map(profile => [profile.id, profile]));
const rows = answers => Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
function reportFor(id) {
  const answers = byId[id].answers;
  const linkedLongestMethod = answers["Q-METHOD-LONGEST"] || questions.autoLinkedLongestMethod(answers);
  return buildFullReport(
    buildEvidence(rows(answers), [], { questionnaireVersion: questions.QUESTIONNAIRE_VERSION, linkedLongestMethod }),
    new Date("2026-07-18T06:00:00.000Z"),
    { questionnaireVersion: questions.QUESTIONNAIRE_VERSION }
  );
}
function sectionsFor(id) { return app._test.buildReportSections(publicReport(reportFor(id))).filter(section => section.visible); }
function textFor(id) { return sectionsFor(id).flatMap(section => section.paragraphs).join(" ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }

const neutralIds = ["VU-08", "VU-09", "VU-10"];
const neutralTexts = neutralIds.map(textFor);
for (const [index, id] of neutralIds.entries()) {
  const report = publicReport(reportFor(id));
  const text = neutralTexts[index];
  assert(report.neutralResult, `${id}: neutral route changed`);
  assert(report.neutralResult.overview.some(sentence => sentence.includes("хэв маяг")), `${id}: uncertainty statement missing`);
  assert(report.neutralResult.strengths.length > 0, `${id}: supported strengths missing`);
  assert(report.neutralResult.limits.some(sentence => sentence.includes("оношлохгүй")), `${id}: assessment limit missing`);
  assert(report.neutralResult.observation.action, `${id}: observation step missing`);
  assert(report.neutralResult.observation.decisionRule, `${id}: next-step rule missing`);
  assert(!Object.hasOwn(report.neutralResult, "reportUse"), `${id}: repeated generic report-use sentence remains`);
  assert.equal(report.neutralResult.limits.length, 1, `${id}: repeated scope sentence remains`);
  assert(text.includes(report.neutralResult.observation.variable), `${id}: personalized observation variable hidden`);
}
assert.equal(new Set(neutralIds.map(id => publicReport(reportFor(id)).neutralResult.subtype)).size, 3, "neutral profiles must retain distinct subtypes");
assert.equal(new Set(neutralIds.map(id => publicReport(reportFor(id)).neutralResult.observation.variable)).size, 3, "neutral profiles must retain distinct personalized observations");

const removedGenericExperimentReason = "Өөрчлөлтийг нэг зүйлээр эхлүүлснээр бодит амьдралд хэрэгжиж байгаа эсэхийг тодорхой ажиглаж, дараагийн алхмаа баримжаатай сонгоно.";
for (const id of ["VU-03", "VU-06"]) {
  const full = reportFor(id);
  const sections = sectionsFor(id);
  const text = textFor(id);
  assert.equal(full.influencingPatterns.length, 3, `${id}: every supported major pattern must remain`);
  for (const pattern of full.influencingPatterns) {
    assert(text.includes(pattern.title), `${id}: pattern title hidden: ${pattern.id}`);
    assert(text.includes(pattern.evidenceSummary), `${id}: attribution hidden: ${pattern.id}`);
    assert(text.includes(pattern.effectOnWeightLoss), `${id}: pattern effect hidden: ${pattern.id}`);
    assert(text.includes(pattern.uncertainty), `${id}: uncertainty hidden: ${pattern.id}`);
    assert(!text.includes(pattern.explanation), `${id}: redundant generic explanation remains: ${pattern.id}`);
  }
  for (const interaction of full.interactionSummary) assert(text.includes(interaction.explanation), `${id}: interaction logic hidden`);
  for (const context of full.contextualFactors) assert(text.includes(context.summary || context.explanation), `${id}: contextual guidance hidden`);
  assert(text.includes(full.prioritizedStartingAction.action), `${id}: first experiment hidden`);
  assert(text.includes(full.prioritizedStartingAction.priorityReason || full.prioritizedStartingAction.reason), `${id}: experiment fit rationale hidden`);
  assert(!text.includes(removedGenericExperimentReason), `${id}: generic experiment explanation remains`);
  if (full.professionalGuidance) assert(text.includes(full.professionalGuidance), `${id}: safety guidance hidden`);
  for (const html of sections.flatMap(section => section.paragraphs)) {
    for (const paragraph of html.match(/<p>.*?<\/p>/g) || []) {
      const sentenceCount = paragraph.replace(/<[^>]+>/g, "").split(/[.!?](?:\s|$)/u).filter(Boolean).length;
      assert(sentenceCount <= 3, `${id}: paragraph exceeds three sentences`);
    }
  }
}

assert(textFor("VU-03").includes("Цагийн хуваарьт багтах шаардлага"), "VU-03 schedule context changed");
assert(textFor("VU-06").includes("эмэгтэйчүүдийн эмчтэй зөвлөнө үү"), "VU-06 safety guidance changed");

console.log("V2.2 P2 neutral repetition and mobile-length closeout passed");
