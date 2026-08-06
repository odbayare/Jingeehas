"use strict";

const INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-post-assessment-paywall-v1";
const LEGACY_INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-initial-result-v1";
const COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-initial-result-v2-count-only";
const SEALED_PAYWALL = Object.freeze({ schemaVersion: INITIAL_RESULT_SCHEMA_VERSION, mode: "sealed" });

function hasText(value) {
  if (Array.isArray(value)) return value.some(hasText);
  if (value && typeof value === "object") return Object.values(value).some(hasText);
  return String(value || "").trim().length > 0;
}

function supportedPatterns(fullReport = {}) {
  return [
    ...(Array.isArray(fullReport.influencingPatterns) ? fullReport.influencingPatterns : []),
    ...(Array.isArray(fullReport.contextualFactors) ? fullReport.contextualFactors.filter(item => item?.isPattern) : [])
  ];
}

function moduleField(module = {}, key) {
  const structured = Array.isArray(module.fields) ? module.fields.find(field => field?.key === key)?.body : null;
  return structured || module[key] || null;
}

function deliverablePatterns(fullReport = {}) {
  const modules = Array.isArray(fullReport.managementModules) ? fullReport.managementModules : [];
  const seen = new Set();
  return supportedPatterns(fullReport).filter(pattern => {
    const key = String(pattern?.id || pattern?.title || "").trim();
    if (!key || seen.has(key)) return false;
    const module = modules.find(item => String(item?.patternId || "") === String(pattern?.id || ""));
    const delivered = hasText(pattern?.title)
      && hasText(pattern?.evidenceSummary || pattern?.paragraphs || pattern?.explanation)
      && hasText(pattern?.effectOnWeightLoss)
      && module
      && hasText(moduleField(module, "observe"))
      && hasText(moduleField(module, "prepare"))
      && hasText(moduleField(module, "inMoment"));
    if (delivered) seen.add(key);
    return Boolean(delivered);
  });
}

function planPairKey(plan = {}) {
  const ids = Array.isArray(plan.patternIds) ? [...new Set(plan.patternIds.map(String))] : [];
  return ids.length === 2 ? ids.sort().join("::") : "";
}

function structuredPlanPart(value) {
  if (value && typeof value === "object") return hasText(value.title) && hasText(value.body);
  return hasText(value);
}

function deliverableInteractions(fullReport = {}, patterns = deliverablePatterns(fullReport)) {
  const patternIds = new Set(patterns.map(pattern => String(pattern.id || "")));
  const plans = [
    fullReport.combinedManagementPlan,
    ...(Array.isArray(fullReport.additionalInteractionManagementPlans) ? fullReport.additionalInteractionManagementPlans : [])
  ].filter(Boolean);
  const planPairs = new Set(plans.filter(plan =>
    structuredPlanPart(plan.startWith)
    && hasText(plan.why)
    && structuredPlanPart(plan.nextStep)
    && structuredPlanPart(plan.combinedAction)
  ).map(planPairKey).filter(Boolean));
  const seen = new Set();
  return (Array.isArray(fullReport.interactionSummary) ? fullReport.interactionSummary : []).filter(interaction => {
    if (String(interaction?.id || "").startsWith("observed_")) return false;
    const ids = Array.isArray(interaction?.patternIds) ? [...new Set(interaction.patternIds.map(String))] : [];
    const key = ids.length === 2 ? ids.sort().join("::") : "";
    if (!key || seen.has(key) || !hasText(interaction?.explanation) || !ids.every(id => patternIds.has(id)) || !planPairs.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildInitialResult() {
  return { ...SEALED_PAYWALL };
}

function publicInitialResult(initialView = {}, fullReport = null) {
  if (initialView?.schemaVersion === INITIAL_RESULT_SCHEMA_VERSION && initialView?.mode === "sealed") {
    return { ...SEALED_PAYWALL };
  }
  const historical = [LEGACY_INITIAL_RESULT_SCHEMA_VERSION, COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION]
    .includes(initialView?.schemaVersion);
  return historical && fullReport ? { ...SEALED_PAYWALL } : null;
}

module.exports = {
  INITIAL_RESULT_SCHEMA_VERSION,
  LEGACY_INITIAL_RESULT_SCHEMA_VERSION,
  COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION,
  supportedPatterns,
  deliverablePatterns,
  deliverableInteractions,
  buildInitialResult,
  publicInitialResult
};