"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const fixtures = require("./fixtures/report-gold-profiles.js");

const generatedRoot = path.join(__dirname, "..", ".generated-copy-hotfix");
const reportModule = require(path.join(generatedRoot, "netlify", "functions", "_lib", "report.js"));
const { validateReportForActivation } = require(path.join(generatedRoot, "netlify", "functions", "_lib", "report-validation.js"));
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

for (const name of ["environmental cues + sedentary routine + irregular meals", "sustained movement attempt with explicit constraints"]) {
  const full = reportFor(name);
  const validation = validateReportForActivation(full);
  assert.equal(validation.valid, true, `${name}: activation failed: ${validation.errors.join(", ")}`);
  const lowMovement = [
    ...(full.influencingPatterns || []),
    ...(full.contextualFactors || []).filter(item => item.isPattern)
  ].find(item => item.id === "low_movement");
  assert(lowMovement, `${name}: low-movement pattern missing`);
  const plans = [full.combinedManagementPlan, ...(full.additionalInteractionManagementPlans || [])]
    .filter(plan => plan && (plan.patternIds || []).includes("low_movement"));
  assert(plans.length, `${name}: low-movement interaction plan missing`);
  for (const plan of plans) {
    assert(!JSON.stringify(plan).includes("Дараагийн нөлөөнд тохирох нэг бэлтгэсэн үйлдлийг сонгоорой."), `${name}: generic low-movement fallback remains`);
    if (plan.nextStep?.title === lowMovement.title) {
      assert(plan.nextStep.body.includes("богино хөдөлгөөнийг сонгоорой"), `${name}: low-movement next step is not actionable`);
    }
    if (plan.startWith?.title === lowMovement.title) {
      assert(plan.startWith.body.includes("Хөдөлгөөн хамгийн бага"), `${name}: low-movement starting observation missing`);
      assert(plan.why.includes("богино хөдөлгөөн"), `${name}: low-movement priority reason missing`);
    }
  }
}

console.log("V8 low-movement interaction-plan tests passed");
