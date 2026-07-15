const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const forbidden = ["life", "pattern"].join("");
const forbiddenRe = new RegExp(forbidden, "i");
const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root })
  .toString("utf8").split("\0").filter(Boolean);

for (const file of tracked) {
  const target = path.join(root, file);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) continue;
  const content = fs.readFileSync(target);
  if (content.includes(0)) continue;
  assert(!forbiddenRe.test(content.toString("utf8")), `${file} contains forbidden cross-project content`);
}

const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'));
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'));
assert(appSource.includes('const WEIGHT_TEST_FUNNEL_ENDPOINT = "/.netlify/functions/track-funnel-event";'));
assert(!/https?:\/\//i.test(appSource.match(/const WEIGHT_TEST_QPAY_ENDPOINTS = \{[\s\S]*?\};/)?.[0] || ""));
assert(appSource.includes('<a class="button secondary" href="/">Нүүр хуудас руу буцах</a>'));

const manifest = JSON.parse(fs.readFileSync(path.join(root, "MONGOLIAN_COPY_APPROVED_REPLACEMENTS.json"), "utf8"));
assert.strictEqual(manifest.approval_status, "APPROVED");
assert.strictEqual(manifest.replacements.length, 1);
const replacement = manifest.replacements[0];
assert.strictEqual(replacement.id, "COPY-0005");
assert.strictEqual(replacement.source_file, "app.js");
assert.strictEqual(replacement.surface, "COMING_SOON");
assert.strictEqual(replacement.current_exact_text, `Life${"P"}attern нүүр хуудас руу буцах`);
assert.strictEqual(replacement.approved_exact_text, "Нүүр хуудас руу буцах");
assert.strictEqual(replacement.approved_by, "product_owner");
assert.strictEqual(replacement.approval_date, "2026-07-15");

const generated = [
  "MONGOLIAN_COPY_REVIEW_CATALOG.md",
  "MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md",
  "MONGOLIAN_COPY_DUPLICATE_INDEX.md",
  "MONGOLIAN_COPY_SURFACE_COVERAGE.md",
  "MONGOLIAN_COPY_ENGINEERING_VALIDATION.md",
  "artifacts/mongolian-rendered-copy.json",
  "artifacts/mongolian-copy-stats.json",
  ...fs.readdirSync(path.join(root, "mongolian-copy-review-packs")).map(file => `mongolian-copy-review-packs/${file}`)
];
generated.forEach(file => assert(!forbiddenRe.test(fs.readFileSync(path.join(root, file), "utf8")), `${file} contains forbidden generated content`));

console.log("cross-project contamination regression tests passed");
