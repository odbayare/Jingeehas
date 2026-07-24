const { spawnSync } = require("node:child_process");

const tests = [
  "tests/removal-guard.test.js",
  "tests/safety-gate.test.js",
  "tests/safety-branching.test.js",
  "tests/direct-assessment-start.test.js",
  "tests/paid-first-flow.test.js",
  "tests/paid-first-schema-hotfix.test.js",
  "tests/report-evidence.test.js",
  "tests/report-snapshot-versioning.test.js",
  "tests/report-attribution-v2.test.js",
  "tests/report-factuality-v2-1.test.js",
  "tests/report-copy-exactness-v2-2.test.js",
  "tests/report-v2-2-p2-closeout.test.js",
  "tests/question-bank.test.js",
  "tests/questionnaire-versioning.test.js",
  "tests/assessment-flow-regression.test.js",
  "tests/accessibility-print.test.js",
  "tests/security-routing-metadata.test.js",
  "tests/methodology-content.test.js",
  "tests/security.test.js",
  "tests/certification-tools.test.js",
  "tests/admin-bootstrap.test.js",
  "tests/daily-funnel-analytics.test.js",
  "tests/question-progress-analytics.test.js",
  "tests/contracts/owner-preview.contract.test.js",
  "tests/contracts/assessment.contract.test.js",
  "tests/contracts/payment.contract.test.js",
  "tests/contracts/recovery.contract.test.js"
  ,"tests/contracts/advisor-auth.contract.test.js"
];
for (const file of tests) {
  const result = spawnSync(process.execPath, [file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
