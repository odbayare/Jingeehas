const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
assert(process.env.CROSS_PROJECT_FORBIDDEN_TOKEN, "runtime contamination token is required");
execFileSync("node", ["tools/assert-no-cross-project-contamination.mjs"], {
  cwd: root,
  env: process.env,
  stdio: "inherit"
});

const manifest = JSON.parse(fs.readFileSync(path.join(root, "MONGOLIAN_COPY_APPROVED_REPLACEMENTS.json"), "utf8"));
assert.strictEqual(manifest.approval_status, "EMPTY_NOT_APPROVED");
assert.deepStrictEqual(manifest.replacements, []);

const registry = JSON.parse(fs.readFileSync(path.join(root, "APPLIED_OWNER_CORRECTIONS.json"), "utf8"));
assert.strictEqual(registry.schema_version, 1);
assert.strictEqual(registry.records.length, 1);
assert.deepStrictEqual(registry.records[0], {
  id: "COPY-0005",
  source_file: "app.js",
  surface: "COMING_SOON",
  former_text_marker: "[CROSS_PROJECT_NAME_REMOVED]",
  approved_exact_text: "Нүүр хуудас руу буцах",
  approved_by: "product_owner",
  approval_date: "2026-07-15",
  status: "APPLIED",
  notes: "A name belonging to a different project was removed from this repository."
});
const prohibitedFields = ["former_exact_text", "current_exact_text", "old_text", "old_url", "former_url", "encoded_text"];
prohibitedFields.forEach(field => assert(!Object.hasOwn(registry.records[0], field), `${field} must not be retained`));

const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
assert(appSource.includes('<a class="button secondary" href="/">Нүүр хуудас руу буцах</a>'));
assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'));
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'));
assert(appSource.includes('const WEIGHT_TEST_FUNNEL_ENDPOINT = "/.netlify/functions/track-funnel-event";'));

console.log("decoded cross-project contamination regression tests passed");
