"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const fixtures = require("./fixtures/report-gold-profiles.js");

const generatedRoot = path.join(__dirname, "..", ".generated-copy-hotfix");
const reportModule = require(path.join(generatedRoot, "netlify", "functions", "_lib", "report.js"));
const { validateReportForActivation } = require(path.join(generatedRoot, "netlify", "functions", "_lib", "report-validation.js"));
const app = require(path.join(__dirname, "..", "dist", "app.js"));

const rows = answers => Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
const reportFor = answers => reportModule.buildFullReport(
  reportModule.buildEvidence(rows(answers), [], { questionnaireVersion: "jingeehas-production-2026-08-v3-routing-safety" }),
  new Date("2026-08-06T00:00:00.000Z"),
  { questionnaireVersion: "jingeehas-production-2026-08-v3-routing-safety" }
);
const duplicateSentences = value => {
  const metadataKeys = new Set(["id", "key", "label", "title", "patternId", "patternIds", "order", "version", "schemaVersion", "recommendationId", "questionnaireVersion"]);
  const sentences = [];
  function visit(current, key = "") {
    if (current == null || metadataKeys.has(key)) return;
    if (typeof current === "string") {
      for (const item of current.split(/[.!?]\s*/)) {
        const sentence = item.replace(/[{}\[\]"\\]/g, "").trim();
        if (sentence.length > 45) sentences.push(sentence);
      }
      return;
    }
    if (Array.isArray(current)) {
      for (const item of current) visit(item, key);
      return;
    }
    if (typeof current === "object") {
      for (const [childKey, childValue] of Object.entries(current)) visit(childValue, childKey);
    }
  }
  visit(value);
  const counts = new Map();
  for (const sentence of sentences) counts.set(sentence, (counts.get(sentence) || 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([sentence, count]) => `${count}x ${sentence}`);
};

const multiFixture = fixtures.find(item => item.name === "stress eating + poor sleep + evening hunger");
const neutralFixture = fixtures.find(item => item.name === "fully routed neutral protective");
assert(multiFixture && neutralFixture);

const multiFull = reportFor(multiFixture.answers);
const multi = reportModule.publicReport(multiFull);
assert.equal(multi.version, "jingeehas-case-formulation-v7-semantic-builder");
assert(multi.managementModules.length >= 2, "multi-factor report must retain supported management coverage");
for (const module of multi.managementModules) {
  assert(module.title);
  assert(!Object.hasOwn(module, "evidenceNote"), "module-level repeated intro must be removed");
  assert(Array.isArray(module.fields));
  assert.deepEqual(module.fields.map(field => field.key), ["observe", "trigger", "prepare", "inMoment", "avoidRigidDemand", "professionalHelp"]);
  for (const field of module.fields) assert(field.label && field.body);
  for (const legacy of ["evidenceLink", "observe", "triggerRecognition", "prepare", "inMoment", "avoidRigidDemand", "resume", "professionalHelp"]) {
    assert(!Object.hasOwn(module, legacy), `legacy flat management field remains: ${legacy}`);
  }
  const moduleText = JSON.stringify(module);
  assert(!moduleText.includes("хэв маяг-ийн"));
  assert(!moduleText.includes(`${module.title} эхлэхийн өмнө`), "raw pattern title remains in trigger body");
}

const interactionPlans = [multi.combinedManagementPlan, ...(multi.additionalInteractionManagementPlans || [])].filter(Boolean);
assert.equal(interactionPlans.length, multi.interactionSummary.length);
for (const plan of interactionPlans) {
  for (const part of [plan.startWith, plan.nextStep, plan.combinedAction]) assert(part.title && part.body);
  assert(plan.why);
  const bodyText = `${plan.why} ${plan.combinedAction.body}`;
  assert(!bodyText.includes("хэв маяг-ийн"));
  assert(!bodyText.includes("; Дараа"));
  assert(!bodyText.includes("; Тэр"));
}

assert(multi.recoveryPlan?.introduction);
assert(multi.recoveryPlan.steps.length >= 4);
for (const step of multi.recoveryPlan.steps) assert(step.label && step.body);
assert(!Object.hasOwn(multi, "difficultMomentPlan"));
assert(!Object.hasOwn(multi, "fallbackPlan"));
assert.equal(multi.initialActions.length, 3);
const multiValidation = validateReportForActivation(multiFull);
assert.equal(multiValidation.valid, true, `${multiValidation.errors.join(", ")}; duplicates=${JSON.stringify(duplicateSentences(multi))}`);

const multiSections = app._test.buildReportSections(multi).filter(section => section.visible);
const multiIds = multiSections.map(section => section.id);
assert.equal(multiIds.filter(id => id === "recovery").length, 1);
assert(!multiIds.includes("difficult-moment"));
assert(!multiIds.includes("fallback"));
const multiHtml = multiSections.flatMap(section => section.paragraphs).join(" ");
assert(multiHtml.includes('class="management-section-intro"'));
assert.equal((multiHtml.match(/management-section-intro/g) || []).length, 1, "management intro must appear once per section");
assert(multiHtml.includes('class="recovery-plan"'));
assert(/<strong>[^<]+:<\/strong>\s+<span>/.test(multiHtml), "title/action separator is missing");
assert(!/<strong>[^<]+<\/strong><span>/.test(multiHtml), "title and body remain directly concatenated");

const neutralFull = reportFor(neutralFixture.answers);
const neutral = reportModule.publicReport(neutralFull);
assert(neutral.neutralResult);
assert(neutral.neutralActionPlan);
assert.equal(neutral.managementModules.length, 0, "neutral report must not synthesize a pattern module");
assert(neutral.recoveryPlan?.steps?.length >= 3);
assert(!Object.hasOwn(neutral, "difficultMomentPlan"));
assert(!Object.hasOwn(neutral, "fallbackPlan"));
const coreStrength = "Өлсөх мэдрэмжээ анзаарах болон цадсанаа мэдээд зогсох нь ашиглаж болох давуу тал байна";
assert((JSON.stringify(neutral).match(new RegExp(coreStrength, "g")) || []).length <= 1, "neutral strength prefix is repeated");
const neutralValidation = validateReportForActivation(neutralFull);
assert.equal(neutralValidation.valid, true, `${neutralValidation.errors.join(", ")}; duplicates=${JSON.stringify(duplicateSentences(neutral))}`);

const neutralSections = app._test.buildReportSections(neutral).filter(section => section.visible);
assert.deepEqual(neutralSections.map(section => section.id), ["neutral-overview", "neutral-strengths", "neutral-observation", "recovery", "guidance"]);
const neutralHtml = neutralSections.flatMap(section => section.paragraphs).join(" ");
assert(neutralHtml.includes("НЭГ ЗҮЙЛИЙГ ӨӨРЧЛӨХГҮЙГЭЭР АЖИГЛАХ АРГА") === false, "section heading must not leak into body HTML");
assert(neutralHtml.includes('class="recovery-plan"'));

console.log("semantic report-builder V7 regression tests passed");