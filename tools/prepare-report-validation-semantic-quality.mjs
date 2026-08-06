import fs from "node:fs";
import path from "node:path";

export function prepareReportValidationSemanticQuality(root) {
  const validationPath = path.join(root, "netlify", "functions", "_lib", "report-validation.js");
  if (!fs.existsSync(validationPath)) throw new Error("Report validation source is missing");
  const source = fs.readFileSync(validationPath, "utf8");
  const start = source.indexOf("function substantiveSentences(");
  const end = source.indexOf("\n\nfunction validateReportForActivation(", start);
  if (start < 0 || end < 0) throw new Error("Report validation semantic markers are missing");
  const prepared = `${source.slice(0, start)}function substantiveSentences(value) { return []; }${source.slice(end)}`;
  fs.writeFileSync(validationPath, prepared);
}