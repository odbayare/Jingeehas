const { spawnSync } = require("node:child_process");

const tests = ["tests/removal-guard.test.js", "tests/contracts/assessment.contract.test.js"];
for (const file of tests) {
  const result = spawnSync(process.execPath, [file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
