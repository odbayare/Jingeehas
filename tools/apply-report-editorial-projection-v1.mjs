import fs from "node:fs";
import path from "node:path";

const V8 = "jingeehas-case-formulation-v8-editorial-polish";

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Editorial projection anchor missing: ${label}`);
  return source.replace(from, to);
}

export function applyReportEditorialProjectionV1(root) {
  const reportPath = path.join(root, "netlify", "functions", "_lib", "report.js");
  let source = fs.readFileSync(reportPath, "utf8");
  source = replaceRequired(
    source,
    `    for (const pattern of safe.influencingPatterns || []) {
      if (Array.isArray(pattern.paragraphs) && pattern.paragraphs.length) {`,
    `    for (const pattern of safe.influencingPatterns || []) {
      if (safe.version === "${V8}" && !(Array.isArray(pattern.paragraphs) && pattern.paragraphs.length)
        && pattern.evidenceSummary && pattern.effectOnWeightLoss) delete pattern.explanation;
      if (Array.isArray(pattern.paragraphs) && pattern.paragraphs.length) {`,
    "V8 influencing-pattern projection"
  );
  source = replaceRequired(
    source,
    `      if (context?.isPattern) {
        delete context.summary;
        if (Array.isArray(context.paragraphs) && context.paragraphs.length) {`,
    `      if (context?.isPattern) {
        delete context.summary;
        if (safe.version === "${V8}" && context.evidenceSummary && context.effectOnWeightLoss) delete context.explanation;
        if (Array.isArray(context.paragraphs) && context.paragraphs.length) {`,
    "V8 contextual-pattern projection"
  );
  fs.writeFileSync(reportPath, source);
}
