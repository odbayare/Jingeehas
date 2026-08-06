"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const fixtures = require("./fixtures/report-gold-profiles.js");

const V7 = "jingeehas-case-formulation-v7-semantic-builder";
const V8 = "jingeehas-case-formulation-v8-editorial-polish";
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
function visibleSections(full) {
  return app._test.buildReportSections(full).filter(section => section.visible);
}
function textFromHtml(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
}
function renderedText(full) {
  return textFromHtml(visibleSections(full).flatMap(section => [section.heading, ...section.paragraphs]).join(" "));
}

const multi = reportModule.publicReport(reportFor("stress eating + poor sleep + evening hunger"));
assert.equal(multi.version, V8);
assert.equal(validateReportForActivation(reportFor("stress eating + poor sleep + evening hunger")).valid, true);

const publicText = JSON.stringify(multi);
for (const phrase of ["хамгаалах хүчин зүйл", "хэрэгжүүлэх босго", "суурь зураглал", "нөлөөлөгч нөхцөл", "өөрчлөлтийг тууштай барих", "өдөр тутам хадгалж болох", "орчны хоолны дохио"]) {
  assert(!publicText.includes(phrase), `technical public phrase remains: ${phrase}`);
}
assert(!/(?:тэмдэглэ|сонго|бич|бэлд|шалга|үргэлжлүүл|өөрчил|багасга|тогтоо|нэрлэ|соль|хий)\./.test(publicText), "blunt imperative remains in V8 public report");
assert(!/гүй бай\./.test(publicText), "blunt negative imperative remains in V8 public report");

const multiSections = visibleSections(multi);
const management = multiSections.find(section => section.id === "management");
assert(management);
assert.equal(management.heading, "ХЭВ МАЯГ БҮРТ ЯАЖ ХАНДАХ ВЭ?");
const context = multiSections.find(section => section.id === "context");
const contextHtml = context?.paragraphs.join(" ") || "";
for (const module of multi.managementModules || []) {
  const observe = module.fields?.find(field => field.key === "observe")?.body;
  if (observe) assert(!contextHtml.includes(observe), `management observation repeated in context: ${module.title}`);
  assert.equal(module.fields?.find(field => field.key === "trigger")?.label, "Ямар нөхцөл давтагдаж байна вэ?");
}

const patternSection = multiSections.find(section => section.id === "patterns");
assert(patternSection);
const patternArticles = patternSection.paragraphs.join(" ").match(/<article class="report-pattern">[\s\S]*?<\/article>/g) || [];
assert(patternArticles.length > 0);
for (const article of patternArticles) {
  assert((article.match(/<p>/g) || []).length <= 3, "V8 pattern card exceeds three paragraphs");
}
assert(renderedText(multi).length < 15000, "multi-factor V8 report exceeds editorial reading-load limit");

const neutral = reportModule.publicReport(reportFor("fully routed neutral protective"));
assert.equal(neutral.version, V8);
const neutralSections = visibleSections(neutral);
assert(neutralSections.some(section => section.id === "neutral-limits"));
for (const limit of neutral.neutralResult?.limits || []) {
  assert(neutralSections.find(section => section.id === "neutral-limits").paragraphs.join(" ").includes(limit));
}
assert(renderedText(neutral).length < 7000, "neutral V8 report exceeds editorial reading-load limit");

const historicalV7 = JSON.parse(JSON.stringify(multi));
historicalV7.version = V7;
const v7Ids = visibleSections(historicalV7).map(section => section.id);
for (const id of ["overview", "patterns", "management", "initial-actions", "recovery"]) {
  assert(v7Ids.includes(id), `historical V7 semantic snapshot section missing: ${id}`);
}
assert.notEqual(visibleSections(historicalV7).find(section => section.id === "management")?.heading, "ХЭВ МАЯГ БҮРТ ЯАЖ ХАНДАХ ВЭ?", "V8 editorial heading leaked into historical V7 snapshot");

console.log("V8 report editorial and reading-load tests passed");
