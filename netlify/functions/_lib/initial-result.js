"use strict";

const INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-initial-result-v2-count-only";
const LEGACY_INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-initial-result-v1";
const LOCKED_REPORT_TITLES = Object.freeze([
  "Танд нөлөөлж буй хэв маягууд",
  "Хэв маягуудын уялдаа холбоо",
  "Ямар үед илүү хүчтэй болдог",
  "Сэтгэлзүйн хэв маягаа хэрхэн удирдах вэ?",
  "Хэцүү үеийг хэрхэн даван туулах вэ?",
  "Эхэлж хэрэгжүүлэх 3 алхам",
  "Төлөвлөснөөрөө явж чадаагүй үед хэрхэн үргэлжлүүлэх вэ?"
]);

function hasText(value) {
  if (Array.isArray(value)) return value.some(hasText);
  return String(value || "").trim().length > 0;
}

function supportedPatterns(fullReport = {}) {
  return [
    ...(Array.isArray(fullReport.influencingPatterns) ? fullReport.influencingPatterns : []),
    ...(Array.isArray(fullReport.contextualFactors) ? fullReport.contextualFactors.filter(item => item?.isPattern) : [])
  ];
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
      && hasText(module.observe)
      && hasText(module.prepare)
      && hasText(module.inMoment);
    if (delivered) seen.add(key);
    return Boolean(delivered);
  });
}

function planPairKey(plan = {}) {
  const ids = Array.isArray(plan.patternIds) ? [...new Set(plan.patternIds.map(String))] : [];
  return ids.length === 2 ? ids.sort().join("::") : "";
}

function deliverableInteractions(fullReport = {}, patterns = deliverablePatterns(fullReport)) {
  const patternIds = new Set(patterns.map(pattern => String(pattern.id || "")));
  const plans = [
    fullReport.combinedManagementPlan,
    ...(Array.isArray(fullReport.additionalInteractionManagementPlans) ? fullReport.additionalInteractionManagementPlans : [])
  ].filter(Boolean);
  const planPairs = new Set(plans.filter(plan => ["startWith", "why", "nextStep", "combinedAction"].every(field => hasText(plan[field]))).map(planPairKey).filter(Boolean));
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

function buildInitialResult(fullReport = {}) {
  const patterns = deliverablePatterns(fullReport);
  const neutral = Boolean(fullReport.neutralResult) || patterns.length === 0;
  return {
    schemaVersion: INITIAL_RESULT_SCHEMA_VERSION,
    mode: neutral ? "neutral" : "summary",
    patternCount: neutral ? 0 : patterns.length,
    interactionCount: neutral ? 0 : deliverableInteractions(fullReport, patterns).length,
    lockedSections: [...LOCKED_REPORT_TITLES]
  };
}

function validLockedSections(initialView = {}) {
  return Array.isArray(initialView.lockedSections)
    && initialView.lockedSections.length === LOCKED_REPORT_TITLES.length
    && LOCKED_REPORT_TITLES.every((title, index) => initialView.lockedSections[index] === title);
}

function publicInitialResult(initialView = {}, fullReport = null) {
  let projected = initialView?.schemaVersion === LEGACY_INITIAL_RESULT_SCHEMA_VERSION
    ? buildInitialResult(fullReport || {})
    : initialView;
  if (projected?.schemaVersion === INITIAL_RESULT_SCHEMA_VERSION && fullReport) projected = buildInitialResult(fullReport);
  if (projected?.schemaVersion !== INITIAL_RESULT_SCHEMA_VERSION || !validLockedSections(projected)) return null;
  if (!["summary", "neutral"].includes(projected.mode)) return null;
  const neutral = projected.mode === "neutral";
  const rawPatternCount = Math.trunc(Number(projected.patternCount));
  const rawInteractionCount = Math.trunc(Number(projected.interactionCount));
  if (!neutral && (!Number.isInteger(rawPatternCount) || rawPatternCount < 1 || rawPatternCount > 20)) return null;
  if (!neutral && (!Number.isInteger(rawInteractionCount) || rawInteractionCount < 0 || rawInteractionCount > 20)) return null;
  const patternCount = neutral ? 0 : rawPatternCount;
  const interactionCount = neutral ? 0 : rawInteractionCount;
  return {
    mode: neutral ? "neutral" : "summary",
    patternCount,
    interactionCount,
    lockedSections: [...LOCKED_REPORT_TITLES]
  };
}

module.exports = {
  INITIAL_RESULT_SCHEMA_VERSION,
  LEGACY_INITIAL_RESULT_SCHEMA_VERSION,
  LOCKED_REPORT_TITLES,
  supportedPatterns,
  deliverablePatterns,
  deliverableInteractions,
  buildInitialResult,
  publicInitialResult
};
