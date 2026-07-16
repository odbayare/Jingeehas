const { spawnSync } = require("node:child_process");

const tests = [
  "tests/removal-guard.test.js",
  "tests/safety-gate.test.js",
  "tests/safety-branching.test.js",
  "tests/report-evidence.test.js",
  "tests/question-bank.test.js",
  "tests/accessibility-print.test.js",
  "tests/security-routing-metadata.test.js",
  "tests/security.test.js",
  "tests/contracts/assessment.contract.test.js",
  "tests/contracts/payment.contract.test.js",
  "tests/contracts/recovery.contract.test.js"
  ,"tests/contracts/advisor-auth.contract.test.js"
];
for (const file of tests) {
  const result = spawnSync(process.execPath, [file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
