"use strict";

const { REPORT_VERSION, publicReport } = require("./report.js");

const PROHIBITED_PUBLIC_TERMS = Object.freeze([
  "OWNER REVIEW REQUIRED", "OWNER APPROVED", "Candidate A", "Candidate B", "review status",
  "templateId", "signalId", "questionId", "evidence-gate", "debug", "QA note",
  "арга тасрах", "арга тасарсан", "арга тасарсны", "нэг удаа хазайх", "хэмнэлдээ эргэн орох",
  "зорилгодоо заавал хүрнэ", "жин хасах нь амар болно"
]);

function substantiveSentences(value) {
  return JSON.stringify(value).split(/[.!?]\s*/).map(item => item.replace(/[{}\[\]"\\]/g, "").trim()).filter(item => item.length > 45);
}

function validateReportForActivation(fullReport) {
  const errors = [];
  if (!fullReport || typeof fullReport !== "object") errors.push("report_payload_missing");
  if (fullReport?.version !== REPORT_VERSION) errors.push("report_engine_version_mismatch");
  if (fullReport?.planDecisionPending === true || fullReport?.planAppendices) errors.push("plan_selection_pending");
  const publicPayload = publicReport(fullReport);
  const publicText = JSON.stringify(publicPayload);
  for (const term of PROHIBITED_PUBLIC_TERMS) if (publicText.includes(term)) errors.push(`prohibited_public_term:${term}`);
  if (/\b(?:Q-[A-Z0-9-]+|S1-[A-Z0-9-]+|MC-[A-Z0-9-]+)\b/.test(publicText)) errors.push("internal_question_or_signal_id");
  if (/\b(?:score|threshold)\b/i.test(publicText)) errors.push("internal_score_or_threshold");
  const plan = fullReport?.prioritizedStartingAction?.plan;
  if (fullReport?.prioritizedStartingAction?.recommendationId === "maintenance_movement_bridge") {
    if (!plan || /\d|хоног|долоо хоног|минут|дор хаяж/.test(JSON.stringify(plan))) errors.push("numeric_launch_plan");
    for (const field of ["duration", "variable", "fallback", "success"]) if (!String(plan?.[field] || "").trim()) errors.push(`nonnumeric_plan_missing:${field}`);
  }
  const required = fullReport?.neutralResult
    ? [fullReport.neutralResult.overview, fullReport.neutralResult.limits, fullReport.neutralResult.observation]
    : [fullReport?.overallPicture, fullReport?.influencingPatterns, fullReport?.additionalPatternActions, fullReport?.prioritizedStartingAction];
  if (required.some(value => value == null || (Array.isArray(value) && value.length === 0))) errors.push("empty_required_section");
  const modules = fullReport?.managementModules || [];
  if (!modules.length) errors.push("management_modules_missing");
  for (const [index, module] of modules.entries()) {
    for (const field of ["title", "evidenceLink", "observe", "prepare", "inMoment", "avoidRigidDemand", "professionalHelp"]) {
      if (!String(module?.[field] || "").trim()) errors.push(`management_module_${index}_missing:${field}`);
    }
  }
  const supportedPatternCount = (fullReport?.internalEvidenceMap?.patternEvidence || []).filter(item => item.supported).length;
  if (supportedPatternCount && modules.length !== supportedPatternCount) errors.push("supported_pattern_management_coverage");
  if (supportedPatternCount >= 2 && (!fullReport?.interactionSummary?.length || !fullReport?.combinedManagementPlan)) errors.push("combined_guidance_missing");
  if (!Array.isArray(fullReport?.initialActions) || fullReport.initialActions.length !== 3) errors.push("initial_actions_must_equal_three");
  else for (const [index, action] of fullReport.initialActions.entries()) {
    if (!String(action?.action || "").trim() || !String(action?.patternTitle || "").trim()) errors.push(`initial_action_${index}_not_attributed`);
  }
  for (const field of ["introduction", "resume", "softenRule", "recheckTrigger", "fitDailyLife"]) {
    if (!String(fullReport?.fallbackPlan?.[field] || "").trim()) errors.push(`fallback_plan_missing:${field}`);
  }
  const sentences = substantiveSentences(publicPayload);
  if (sentences.length !== new Set(sentences).size) errors.push("duplicate_substantive_paragraph");
  return { valid: errors.length === 0, errors, publicPayload };
}

module.exports = { PROHIBITED_PUBLIC_TERMS, validateReportForActivation };
