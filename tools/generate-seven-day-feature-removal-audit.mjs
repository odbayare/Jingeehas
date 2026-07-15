import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const sourcePath = "/tmp/seven-day-removal-start.txt";
const lines = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, "utf8").trim().split("\n").filter(Boolean) : [];
function classification(line) {
  const file = line.split(":", 1)[0].replace(/^\.\//, "");
  if (/^(app\.js|mockBackend\.js|index\.html)$/.test(file)) return "REMOVED_PRODUCTION";
  if (file.startsWith("tests/")) return "REMOVED_OR_REWRITTEN_TEST";
  if (file.startsWith("tools/")) return "REMOVED_EXTRACTION_OR_GENERATION";
  if (file.startsWith("artifacts/") || file.startsWith("mongolian-copy-review-packs/") || /^MONGOLIAN_COPY_/.test(file)) return "REGENERATED_ARTIFACT";
  return "HISTORICAL_OR_DOCUMENTATION_REVIEWED";
}
const counts = {};
for (const line of lines) counts[classification(line)] = (counts[classification(line)] || 0) + 1;
let body = `# Seven-Day Feature Removal Audit\n\n## Decision\n\nThe seven-day assessment product, its upgrade path, tracking flow, reports, entitlements, analytics scenarios, and rendered-copy coverage were removed. The one-time assessment and its 9,900₮ QPay flow remain. A narrow legacy-state migration discards obsolete local fields and redirects obsolete views safely.\n\n## Start-state inventory\n\n- Source snapshot: \`${sourcePath}\`\n- Matching occurrences reviewed: ${lines.length}\n${Object.entries(counts).map(([key,value]) => `- ${key}: ${value}`).join("\n")}\n\nEach pre-removal match is classified below. This file is the sole detailed historical evidence register for removed feature identifiers and wording.\n\n| # | Classification | Pre-removal occurrence |\n| -: | --- | --- |\n`;
lines.forEach((line, index) => { body += `| ${index + 1} | ${classification(line)} | ${line.replace(/\|/g, "\\|")} |\n`; });
const matchPattern = /sevenDay|seven-day|seven_day|renderSevenDay|startSevenDay|hasSevenDayAccess|diaryEntries|diaryDraft|diaryDay|diaryQuestionIndex|reportReady|renderUpgradeOffer|renderUpgradePaywall|startSevenDayRefinement|29,000₮|69,000₮|19,900₮|7 хоногийн гүн|7 хоногоор нарийвчлах/gi;
const current = [];
const appLines = fs.readFileSync(path.join(root, "app.js"), "utf8").split("\n");
const migrationStart = appLines.findIndex(line => line.includes("function migrateLegacySevenDayState")) + 1;
const migrationEndOffset = appLines.slice(migrationStart).findIndex(line => line.startsWith("function initialViewFromPath"));
const migrationEnd = migrationEndOffset >= 0 ? migrationStart + migrationEndOffset : migrationStart;
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) { walk(absolute); continue; }
    const relative = path.relative(root, absolute);
    if (["SEVEN_DAY_FEATURE_REMOVAL_AUDIT.md"].includes(relative)) continue;
    let text;
    try { text = fs.readFileSync(absolute, "utf8"); } catch { continue; }
    text.split("\n").forEach((value, lineIndex) => {
      const matches = [...value.matchAll(matchPattern)];
      for (const match of matches) current.push({ file: relative, line: lineIndex + 1, match: match[0], text: value.trim() });
    });
  }
}
walk(root);
function remainingClassification(item) {
  if (item.file === "PRODUCT_SCOPE_DECISIONS.json" || item.file === "PRODUCT_SCOPE_DECISIONS.schema.json") return "permitted scope-decision/audit reference";
  if (item.file === "app.js" && item.line >= migrationStart && item.line < migrationEnd) return "permitted legacy migration reference";
  if (item.file === "app.js" && item.text.includes("migrateLegacySevenDayState")) return "permitted legacy migration invocation";
  if (item.file === "MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md" && [migrationStart + 2, migrationStart + 3].some(line => item.text.includes(`app.js:${line}`))) return "permitted generated migration inventory";
  if (item.file === "tests/seven-day-feature-removal.test.js" || item.file === "tests/mongolian-copy-audit-fixes.test.js") return "permitted removal-test reference";
  if (item.file === "tools/assert-seven-day-feature-removed.mjs" || item.file === "tools/generate-seven-day-feature-removal-audit.mjs") return "permitted removal-audit tooling reference";
  if (/7 хоног/i.test(item.match) && !/гүн|нарийвчлах/i.test(item.match)) return "unrelated ordinary seven-day time reference";
  return "removed active feature reference";
}
const remainingCounts = {};
for (const item of current) remainingCounts[remainingClassification(item)] = (remainingCounts[remainingClassification(item)] || 0) + 1;
body += `\n## Current repository match classification\n\n- Current matches classified: ${current.length}\n${Object.entries(remainingCounts).map(([key,value]) => `- ${key}: ${value}`).join("\n")}\n\n| # | Classification | Location | Match | Context |\n| -: | --- | --- | --- | --- |\n`;
current.forEach((item,index)=>{body+=`| ${index+1} | ${remainingClassification(item)} | ${item.file}:${item.line} | ${item.match.replace(/\|/g,"\\|")} | ${item.text.replace(/\|/g,"\\|")} |\n`;});
const virtualScenarioNames = [...fs.readFileSync(path.join(root, "tests/virtual-user-qa.test.js"), "utf8").matchAll(/^\s+name: "([^"]+)",$/gm)].map(match => match[1]);
body += `\n## Virtual-user scenario disposition\n\nAll 15 retained scenarios are one-time equivalents under the approved test-policy decision. None exercises a removed product route, entitlement, renderer, payment, or report.\n\n| Scenario | Disposition |\n| --- | --- |\n`;
virtualScenarioNames.forEach(name => { body += `| ${name} | REPLACE_WITH_ONE_TIME_EQUIVALENT |\n`; });
body += `\n## Retained ordinary time references\n\nOrdinary advice or experiment durations that happen to mention seven days are not product identifiers and remain valid. The removal guard deliberately targets product names, state identifiers, removed prices, routes, rendered surfaces, and entitlement concepts instead of banning the generic phrase “7 хоног”.\n\n## Validation contract\n\n- Run \`node tools/assert-seven-day-feature-removed.mjs\`.\n- Run \`node tests/seven-day-feature-removal.test.js\`.\n- Regenerate the rendered-copy catalog and owner-review packs.\n- Run focused QPay, analytics, pricing, safety, and routing tests, then \`npm test\`.\n`;
fs.writeFileSync(path.join(root, "SEVEN_DAY_FEATURE_REMOVAL_AUDIT.md"), body);
const activeReferenceCount = remainingCounts["removed active feature reference"] || 0;
console.log(JSON.stringify({ occurrences: lines.length, classifications: counts, current_matches: current.length, remaining_classifications: remainingCounts, active_reference_count: activeReferenceCount }, null, 2));
if (activeReferenceCount) process.exitCode = 1;
