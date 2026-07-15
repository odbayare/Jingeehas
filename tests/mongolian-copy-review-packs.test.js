const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");

const root = path.resolve(__dirname, "..");
const packDir = path.join(root, "mongolian-copy-review-packs");
const metrics = JSON.parse(fs.readFileSync(path.join(packDir, "REVIEW_PACK_METRICS.json"), "utf8"));
const artifact = JSON.parse(fs.readFileSync(path.join(root, "artifacts/mongolian-rendered-copy.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "MONGOLIAN_COPY_APPROVED_REPLACEMENTS.json"), "utf8"));
const files = fs.readdirSync(packDir).filter(file => file.endsWith(".md"));
const contents = Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(packDir, file), "utf8")]));
const combined = Object.values(contents).join("\n");

assert.strictEqual(metrics.catalog_entry_count, artifact.entries.length);
assert.strictEqual(metrics.unique_items_assigned, artifact.entries.length);
assert.strictEqual(metrics.unassigned_items, 0);
for (let index = 0; index < artifact.entries.length; index += 1) {
  const id = `COPY-${String(index + 1).padStart(4, "0")}`;
  assert(Array.isArray(metrics.assigned_ids[id]) && metrics.assigned_ids[id].length > 0, `${id} must be assigned or in no-review appendix`);
}

[
  "Suggested replacement", "Recommended wording", "Better version",
  "Орлуулах санал", "Зөв хувилбар", "Санал болгож буй"
].forEach(phrase => assert(!combined.includes(phrase), `forbidden proposal phrase found: ${phrase}`));
assert(!/^[-*] Approved exact text:[^\S\r\n]*\S+/m.test(combined), "approved exact text fields must remain blank");
assert(!/^[-*] Approved by:[^\S\r\n]*\S+/m.test(combined), "approved-by fields must remain blank");
assert(!/^[-*] Approval date:[^\S\r\n]*\S+/m.test(combined), "approval-date fields must remain blank");

for (const [file, text] of Object.entries(contents)) {
  for (const block of text.split(/(?=^## COPY-\d+)/m).filter(part => /^## COPY-\d+/m.test(part))) {
    assert(/- Render proof: \S/.test(block), `${file} item must have render proof`);
    assert(/- Source mapping: (RESOLVED|UNRESOLVED)/.test(block), `${file} item must have resolved or unresolved source mapping`);
    assert(/- Approved exact text:\s*\n/.test(block), `${file} item must have blank approval field`);
  }
}

for (const file of files) {
  const itemCount = (contents[file].match(/^## COPY-\d+/gm) || []).length;
  if (/^01_P0_MIXED_LANGUAGE_BATCH_/.test(file)) assert(itemCount <= 30, `${file} exceeds 30 items`);
  if (/^02_P0_SAFETY_CRITICAL_BATCH_/.test(file)) assert(itemCount <= 25, `${file} exceeds 25 items`);
  if (/^03_P0_PAYMENT_CRITICAL_BATCH_/.test(file)) assert(itemCount <= 25, `${file} exceeds 25 items`);
  if (/^05_P1_REPORT_REGISTER_BATCH_/.test(file)) assert(itemCount <= 30, `${file} exceeds 30 items`);
}

const questionFiles = Object.entries(contents).filter(([file]) => /^07_P2_QUESTIONS_/.test(file));
[
  "GENERAL", "WEIGHT_HISTORY", "PRIOR_ATTEMPTS", "MEAL_RHYTHM", "HUNGER_SATIETY", "EMOTIONAL_EATING",
  "ENVIRONMENTAL_TRIGGERS", "SLEEP_ENERGY", "WORK_CONTEXT", "BODY_MEDICAL", "MENSTRUAL_CYCLE",
  "SAFETY"
].forEach(domain => assert(files.some(file => file.startsWith(`07_P2_QUESTIONS_${domain}_BATCH_`)), `${domain} question pack must exist`));
for (const question of app.stageOneQuestions) {
  const owning = questionFiles.find(([, text]) => text.includes(question.text) && (question.options || []).every(option => text.includes(`- ${option}`)));
  assert(owning, `${question.id} must stay with all owning answer options`);
}
assert(/^## COPY-\d+/m.test(contents["08_P2_ACCESSIBILITY.md"]), "accessibility pack must contain attribute-only copy");

assert.strictEqual(manifest.approval_status, "APPROVED");
assert(manifest.replacements.length > 0);
assert(!fs.existsSync(path.join(root, "mongolian-copy-normalizer.js")));
assert(!fs.existsSync(path.join(root, "mongolian-copy-domain-normalizer.js")));

assert(!combined.match(/removedFeature|removed-feature|removed_feature|DIARY_QUESTION|UPGRADE_OFFER/), "removed product concepts must not enter review packs");

console.log("mongolian-copy-review-packs integrity tests passed");
