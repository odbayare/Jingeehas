"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const fixtures = require("./fixtures/report-gold-profiles.js");

const generatedRoot = path.join(__dirname, "..", ".generated-copy-hotfix");
const reportModule = require(path.join(generatedRoot, "netlify", "functions", "_lib", "report.js"));
const { validateReportForActivation } = require(path.join(generatedRoot, "netlify", "functions", "_lib", "report-validation.js"));
const app = require(path.join(__dirname, "..", "dist", "app.js"));

const byName = Object.fromEntries(fixtures.map(fixture => [fixture.name, fixture]));
const rows = answers => Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
function reportFor(name) {
  const fixture = byName[name];
  assert(fixture, `fixture missing: ${name}`);
  return reportModule.buildFullReport(
    reportModule.buildEvidence(rows(fixture.answers), [], { questionnaireVersion: "jingeehas-production-2026-08-v3-routing-safety" }),
    new Date("2026-08-06T00:00:00.000Z"),
    { questionnaireVersion: "jingeehas-production-2026-08-v3-routing-safety" }
  );
}

for (const name of ["sleep fatigue context", "stable eating with low movement only"]) {
  const full = reportFor(name);
  const publicFull = reportModule.publicReport(full);
  assert(full.neutralResult, `${name}: contextual-only profile must use neutral result`);
  assert(full.neutralActionPlan, `${name}: neutral action plan missing`);
  assert.equal(full.managementModules.length, 0, `${name}: contextual pattern module leaked into neutral shape`);
  assert.equal(full.interactionSummary.length, 0, `${name}: interaction narrative leaked into neutral shape`);
  assert.equal(full.combinedManagementPlan, null, `${name}: combined plan leaked into neutral shape`);
  assert.deepEqual(full.additionalInteractionManagementPlans, [], `${name}: additional interaction plans leaked into neutral shape`);
  const validation = validateReportForActivation(full);
  assert.equal(validation.valid, true, `${name}: activation failed: ${validation.errors.join(", ")}`);
  const sectionIds = app._test.buildReportSections(publicFull).filter(section => section.visible).map(section => section.id);
  assert(sectionIds.includes("neutral-overview"), `${name}: neutral overview missing`);
  assert(sectionIds.includes("neutral-observation"), `${name}: neutral observation missing`);
  assert(sectionIds.includes("recovery"), `${name}: neutral recovery missing`);
  assert(!sectionIds.includes("management"), `${name}: pattern management section rendered on neutral report`);
}

for (const name of ["environmental cue dominant", "environmental cues + sedentary routine + irregular meals"]) {
  const full = reportFor(name);
  const validation = validateReportForActivation(full);
  assert.equal(validation.valid, true, `${name}: valid repeated operational guidance must not block delivery: ${validation.errors.join(", ")}`);
}

const narrativeDuplicate = reportFor("stress eating + poor sleep + evening hunger");
const duplicatedSentence = narrativeDuplicate.influencingPatterns.find(pattern => pattern.effectOnWeightLoss)?.effectOnWeightLoss;
assert(duplicatedSentence, "narrative duplicate fixture lacks a pattern effect");
assert(narrativeDuplicate.interactionSummary.length, "narrative duplicate fixture lacks an interaction");
narrativeDuplicate.interactionSummary[0].explanation = duplicatedSentence;
const duplicateValidation = validateReportForActivation(narrativeDuplicate);
assert.equal(duplicateValidation.valid, false, "true narrative duplication must remain blocked");
assert(duplicateValidation.errors.includes("duplicate_substantive_paragraph"), "narrative duplicate error missing");

console.log("V7 Codex review regression tests passed");
