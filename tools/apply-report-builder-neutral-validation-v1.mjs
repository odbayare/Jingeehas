import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Neutral validation function missing: ${name}`);
  const braceStart = source.indexOf("{", start + marker.length);
  if (braceStart < 0) throw new Error(`Neutral validation body missing: ${name}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) { if (char === "\n") lineComment = false; continue; }
    if (blockComment) { if (char === "*" && next === "/") { blockComment = false; index += 1; } continue; }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; index += 1; continue; }
    if (char === "\"" || char === "'" || char === "`") { quote = char; continue; }
    if (char === "{") depth += 1;
    if (char === "}" && --depth === 0) return `${source.slice(0, start)}${replacement}${source.slice(index + 1)}`;
  }
  throw new Error(`Neutral validation function end missing: ${name}`);
}

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Neutral validation anchor missing: ${label}`);
  return source.replace(from, to);
}

const NARRATIVE_SENTENCES = `function substantiveSentences(report) {
  const values = [];
  const add = value => {
    if (Array.isArray(value)) { for (const item of value) add(item); return; }
    if (typeof value === "string" && value.trim()) values.push(value);
  };

  add(report?.overallPicture);
  for (const pattern of report?.influencingPatterns || []) {
    if (Array.isArray(pattern?.paragraphs) && pattern.paragraphs.length) add(pattern.paragraphs);
    else add([pattern?.explanation, pattern?.evidenceSummary, pattern?.effectOnWeightLoss, pattern?.uncertainty]);
  }
  for (const context of report?.contextualFactors || []) {
    if (context?.isPattern) {
      if (Array.isArray(context?.paragraphs) && context.paragraphs.length) add(context.paragraphs);
      else add([context?.explanation, context?.evidenceSummary, context?.effectOnWeightLoss, context?.uncertainty]);
    } else add(context?.summary || context?.explanation);
  }
  for (const interaction of report?.interactionSummary || []) add(interaction?.explanation);
  add(report?.previousAttemptAnalysis?.paragraphs || [report?.previousAttemptAnalysis?.summary, report?.previousAttemptAnalysis?.interpretation]);
  add(report?.protectiveSectionSummary);
  for (const item of report?.protectiveFactors || []) add(item?.text || item);
  for (const item of report?.contradictions || []) add(item?.text || item);

  const neutral = report?.neutralResult;
  if (neutral) add([
    neutral.overview,
    neutral.notStronglySupported,
    neutral.notStronglySupportedFallback,
    neutral.strengths,
    neutral.strengthsFallback,
    neutral.limits,
    neutral.professionalScope
  ]);
  add([report?.professionalGuidance, report?.urgentGuidance]);

  const sentences = [];
  for (const value of values) for (const item of value.split(/[.!?]\\s*/)) {
    const sentence = item.replace(/[{}\\[\\]"\\\\]/g, "").trim();
    if (sentence.length > 45) sentences.push(sentence);
  }
  return sentences;
}`;

function patchReport(source) {
  let output = replaceRequired(
    source,
    "  const neutralPlan = managementModules.length ? null : neutralActionablePlan(neutral);",
    "  const neutralPlan = neutral ? neutralActionablePlan(neutral) : null;",
    "neutral plan selection"
  );
  output = replaceRequired(
    output,
    "    previousAttemptAnalysis: previous, interactionSummary: interactions,\n    prioritizedStartingAction: firstAction, additionalPatternActions,",
    "    previousAttemptAnalysis: previous, interactionSummary: neutralPlan ? [] : interactions,\n    prioritizedStartingAction: neutralPlan ? null : firstAction, additionalPatternActions: neutralPlan ? [] : additionalPatternActions,",
    "neutral narrative and action projection"
  );
  output = replaceRequired(
    output,
    "    combinedManagementPlan: combinedPlan,\n    additionalInteractionManagementPlans: interactionPlans.slice(1),",
    "    combinedManagementPlan: neutralPlan ? null : combinedPlan,\n    additionalInteractionManagementPlans: neutralPlan ? [] : interactionPlans.slice(1),",
    "neutral interaction projection"
  );
  return output;
}

function patchValidation(source) {
  let output = replaceNamedFunction(source, "substantiveSentences", NARRATIVE_SENTENCES);
  output = replaceRequired(
    output,
    "  if (supportedPatternCount && modules.length !== supportedPatternCount) errors.push(\"supported_pattern_management_coverage\");",
    "  if (!fullReport?.neutralResult && supportedPatternCount && modules.length !== supportedPatternCount) errors.push(\"supported_pattern_management_coverage\");",
    "neutral management coverage"
  );
  output = replaceRequired(
    output,
    "  if (deliverablePatterns(fullReport).length !== renderedPatternCount) errors.push(\"counted_pattern_delivery_gap\");",
    "  if (!fullReport?.neutralResult && deliverablePatterns(fullReport).length !== renderedPatternCount) errors.push(\"counted_pattern_delivery_gap\");",
    "neutral pattern delivery coverage"
  );
  return output;
}

export function applyReportBuilderNeutralValidationV1(root) {
  const reportPath = path.join(root, "netlify", "functions", "_lib", "report.js");
  const validationPath = path.join(root, "netlify", "functions", "_lib", "report-validation.js");
  if (!fs.existsSync(reportPath) || !fs.existsSync(validationPath)) throw new Error("Neutral validation sources are missing");
  fs.writeFileSync(reportPath, patchReport(fs.readFileSync(reportPath, "utf8")));
  fs.writeFileSync(validationPath, patchValidation(fs.readFileSync(validationPath, "utf8")));
}
