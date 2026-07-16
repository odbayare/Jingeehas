import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const isolatedMigrationFixture = "tests/fixtures/legacy-state.json";
const pieces = [
  ["probe", "Bank"], ["D", "-P-"], ["daily", "_core"], ["daily", "_probe"],
  ["daily", "_diary"], ["removed", "FeaturePaid"], ["removed", "_feature"],
  ["removed", "_feature_access"], ["removed", "Entries"], ["upgrade", "Paid"],
  ["upgrade", "_access"], ["seven", "Day"], ["seven", "-day"], ["seven", "_day"],
  ["diary", "Entries"], ["diary", "Draft"], ["diary", "Day"],
  ["diary", "QuestionIndex"], ["diary", "SummaryUi"], ["29,", "000₮"],
  ["69,", "000₮"], ["19,", "900₮"]
];
const forbidden = pieces.map(parts => parts.join(""));
const files = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], {
  cwd: root,
  encoding: "utf8"
}).trim().split("\n").filter(Boolean);
const failures = [];

for (const relative of files) {
  if (relative === isolatedMigrationFixture) continue;
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) continue;
  if (!fs.statSync(absolute).isFile()) continue;
  const source = fs.readFileSync(absolute);
  if (source.includes(0)) continue;
  const text = source.toString("utf8").toLowerCase();
  const matches = forbidden.filter(token => text.includes(token.toLowerCase()));
  if (matches.length) failures.push(`${relative}: ${matches.join(", ")}`);
}

if (failures.length) {
  console.error(`Deleted-product references remain:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Deleted-product repository guard passed");
