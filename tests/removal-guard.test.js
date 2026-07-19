const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "legacy-state.json"), "utf8"));
assert(Object.keys(fixture).length > 0, "isolated migration fixture must remain explicit");

const result = spawnSync(process.execPath, ["tools/verify-removed-product.mjs"], {
  cwd: root,
  encoding: "utf8"
});
assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
console.log("removed product guard test passed");
