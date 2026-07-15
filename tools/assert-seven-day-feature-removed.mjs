import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const files = [
  "app.js", "mockBackend.js", "index.html",
  "artifacts/mongolian-rendered-copy.json",
  "MONGOLIAN_COPY_REVIEW_CATALOG.md", "MONGOLIAN_COPY_SURFACE_COVERAGE.md",
  ...fs.readdirSync(path.join(root, "mongolian-copy-review-packs")).map(name => `mongolian-copy-review-packs/${name}`)
];
const banned = /sevenDay|seven-day|seven_day|dailyCore|dailyMenstrual|diaryEntries|diaryDraft|diaryDay|diaryQuestionIndex|renderDiary|renderSevenDay|renderUpgrade|upgradePaid|29,000₮|69,000₮|19,900₮|7 хоногийн гүн зураглал|7 хоногийн үнэлгээ|7\s*(?:хоногийн|өдрийн)\s+(?:богино\s+)?тэмдэглэл/gi;
const eveningDiaryPair = /Орой бүр 3–5 минут[\s\S]{0,240}(?:тэмдэглэл|өдөр тутмын|өдрийн тэмдэглэл|7\s*(?:хоногийн|өдрийн))/gi;
const failures = [];

for (const file of files) {
  let source = fs.readFileSync(path.join(root, file), "utf8");
  if (file === "app.js") {
    source = source.replace(/function migrateLegacySevenDayState[\s\S]*?\n}\n\nfunction initialViewFromPath/, "function initialViewFromPath");
    source = source.replaceAll("migrateLegacySevenDayState", "legacyStateMigration");
  }
  const matches = [...source.matchAll(banned)].map(match => match[0]);
  matches.push(...[...source.matchAll(eveningDiaryPair)].map(match => match[0]));
  if (matches.length) failures.push(`${file}: ${[...new Set(matches)].join(", ")}`);
}

if (failures.length) {
  console.error("Forbidden removed-feature signals remain:\n" + failures.join("\n"));
  process.exit(1);
}
console.log("seven-day feature removal guard passed");
