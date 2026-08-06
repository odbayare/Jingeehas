import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Public projection function missing: ${name}`);
  const braceStart = source.indexOf("{", start + marker.length);
  if (braceStart < 0) throw new Error(`Public projection body missing: ${name}`);
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
  throw new Error(`Public projection function end missing: ${name}`);
}

const PUBLIC_REPORT = `function publicReport(fullReport) {
  if (!fullReport || typeof fullReport !== "object") return fullReport;
  const pending = fullReport.planDecisionPending === true;
  const internalKeys = new Set([
    "internalEvidenceMap", "evidence", "planDecisionPending", "planAppendices", "parameterApprovalStatus",
    "candidateA", "candidateB", "recommendedCandidate", "selectedCandidate", "id", "patternId", "patternIds", "interactionsWith",
    "recommendationId", "signal", "questionId", "questionIds", "sentenceTemplateId", "requiredSignals",
    "forbiddenSignals", "requiredProtectiveSignals", "requiredPatterns", "forbiddenPatterns", "requiredContexts",
    "forbiddenContexts", "actualSupportingQuestionIds"
  ]);
  function sanitize(value) {
    if (Array.isArray(value)) return value.map(sanitize);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).filter(([key]) => !internalKeys.has(key)).map(([key, child]) => [key, sanitize(child)]));
  }
  const safe = polishPublicText(sanitize(fullReport));

  // These values are report-engine planning artifacts. The public renderer does
  // not consume them, and retaining them duplicates guidance already delivered
  // by the semantic management and initial-action sections.
  delete safe.additionalPatternActions;

  for (const pattern of safe.influencingPatterns || []) {
    // A paragraph cluster is the complete rendered representation for this
    // pattern. Do not also expose the unused component strings.
    if (Array.isArray(pattern.paragraphs) && pattern.paragraphs.length) {
      delete pattern.explanation;
      delete pattern.evidenceSummary;
      delete pattern.effectOnWeightLoss;
      delete pattern.uncertainty;
    }
  }

  for (const context of safe.contextualFactors || []) {
    if (context?.isPattern) {
      // Pattern cards render their semantic component fields. The synthetic
      // summary concatenates those same sentences and is not rendered.
      delete context.summary;
      if (Array.isArray(context.paragraphs) && context.paragraphs.length) {
        delete context.explanation;
        delete context.evidenceSummary;
        delete context.effectOnWeightLoss;
        delete context.uncertainty;
      }
    }
  }

  // Neutral reports render the evidence-gated guidance from
  // neutralResult.professionalScope. Do not expose the duplicate top-level alias.
  if (safe.neutralResult) delete safe.professionalGuidance;
  if (pending) safe.prioritizedStartingAction = null;
  return safe;
}`;

function patchValidationMetadata(source) {
  const from = '"patternId", "patternIds", "order", "version"';
  const to = '"patternId", "patternIds", "patternTitle", "order", "version"';
  if (source.includes(to)) return source;
  if (!source.includes(from)) throw new Error("Validation metadata insertion point missing");
  return source.replace(from, to);
}

export function applyReportBuilderSemanticV1PublicProjection(root) {
  const reportPath = path.join(root, "netlify", "functions", "_lib", "report.js");
  const validationPath = path.join(root, "netlify", "functions", "_lib", "report-validation.js");
  let reportSource = fs.readFileSync(reportPath, "utf8");
  reportSource = replaceNamedFunction(reportSource, "publicReport", PUBLIC_REPORT);
  fs.writeFileSync(reportPath, reportSource);

  const validationSource = patchValidationMetadata(fs.readFileSync(validationPath, "utf8"));
  fs.writeFileSync(validationPath, validationSource);
}
