const assert = require("assert");
const { spawnSync } = require("child_process");

const result = spawnSync(process.execPath, ["scripts/run-virtual-user-audit.mjs", "--assert-clean"], {
  encoding: "utf8"
});

if (result.status !== 0) {
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  process.exit(result.status || 1);
}

const summary = JSON.parse(result.stdout);

assert.strictEqual(summary.users, 10);
assert.strictEqual(summary.p0, 0);
assert.strictEqual(summary.p1, 0);
assert.strictEqual(summary.fail, 0);
assert(summary.readinessScore >= 95, "virtual audit readiness should stay at least 95/100");

console.log("virtual-audit-public-copy.test.js passed");
