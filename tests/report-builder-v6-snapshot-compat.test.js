"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const fixtures = require("./fixtures/report-gold-profiles.js");
const questions = require("../questions.js");
const canonicalReport = require("../netlify/functions/_lib/report.js");

const generatedRoot = path.join(__dirname, "..", ".generated-copy-hotfix");
const generatedReport = require(path.join(generatedRoot, "netlify", "functions", "_lib", "report.js"));
const app = require(path.join(__dirname, "..", "dist", "app.js"));

const rows = answers => Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
function historicalV6(name) {
  const fixture = fixtures.find(item => item.name === name);
  assert(fixture, `fixture missing: ${name}`);
  const linkedLongestMethod = fixture.answers["Q-METHOD-LONGEST"] || questions.autoLinkedLongestMethod(fixture.answers);
  const full = canonicalReport.buildFullReport(
    canonicalReport.buildEvidence(rows(fixture.answers), [], { questionnaireVersion: questions.QUESTIONNAIRE_VERSION, linkedLongestMethod }),
    new Date("2026-08-05T00:00:00.000Z"),
    { questionnaireVersion: questions.QUESTIONNAIRE_VERSION }
  );
  assert.equal(full.version, "jingeehas-case-formulation-v6-actionable-management");
  return generatedReport.publicReport(full);
}

const multi = historicalV6("stress eating + poor sleep + evening hunger");
assert(Array.isArray(multi.additionalPatternActions) && multi.additionalPatternActions.length, "V6 public projection must preserve historical planning fields");
assert(multi.managementModules.some(module => module.observe && !module.fields), "V6 flat management shape must remain intact");
assert(multi.difficultMomentPlan && multi.fallbackPlan, "V6 recovery structures must remain intact");
const multiSections = app._test.buildReportSections(multi).filter(section => section.visible);
const multiIds = multiSections.map(section => section.id);
for (const id of ["overview", "patterns", "management", "difficult-moment", "initial-actions", "fallback"]) {
  assert(multiIds.includes(id), `V6 section missing: ${id}`);
}
assert(!multiIds.includes("recovery"), "V6 snapshot must not be forced into V7 recovery shape");
const multiHtml = multiSections.flatMap(section => section.paragraphs).join(" ");
assert(multiHtml.includes('data-report-version="v6"'), "V6 compatibility renderer was not used");
assert(multiHtml.includes(multi.managementModules[0].observe), "V6 management observation hidden");
assert(multiHtml.includes(multi.managementModules[0].resume), "V6 per-pattern recovery guidance hidden");
assert(multiHtml.includes(multi.fallbackPlan.resume), "V6 fallback guidance hidden");
assert(!/<dd>\s*<\/dd>/.test(multiHtml), "V6 compatibility renderer produced an empty definition");

app._test.setState({ ownerPreview: true, report: { fullReport: multi } });
const multiPage = app.renderForPath("/report");
assert(multiPage.includes("Бүрэн тайлан"));
assert(multiPage.includes(multi.managementModules[0].observe), "V6 restored report page lost management content");
assert(multiPage.includes(multi.fallbackPlan.resume), "V6 restored report page lost fallback content");

const neutral = historicalV6("fully routed neutral protective");
assert(neutral.neutralResult?.observation?.variable, "V6 neutral observation must remain in historical payload");
assert(neutral.managementModules.length === 1 && neutral.managementModules[0].observe, "V6 neutral synthetic management module must remain intact");
const neutralSections = app._test.buildReportSections(neutral).filter(section => section.visible);
const neutralIds = neutralSections.map(section => section.id);
for (const id of ["overview", "management", "difficult-moment", "initial-actions", "fallback"]) {
  assert(neutralIds.includes(id), `V6 neutral section missing: ${id}`);
}
assert(!neutralIds.includes("neutral-observation"), "V6 neutral snapshot must not be forced into V7 neutral section shape");
const neutralHtml = neutralSections.flatMap(section => section.paragraphs).join(" ");
assert(neutralHtml.includes(neutral.neutralResult.observation.variable), "V6 neutral observation hidden");
assert(neutralHtml.includes(neutral.managementModules[0].observe), "V6 neutral management guidance hidden");
assert(!/<dd>\s*<\/dd>/.test(neutralHtml), "V6 neutral compatibility renderer produced an empty definition");

console.log("historical V6 report snapshot compatibility tests passed");
