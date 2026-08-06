const { spawnSync } = require("node:child_process");

const tests = [
  "tests/removal-guard.test.js",
  "tests/safety-gate.test.js",
  "tests/safety-branching.test.js",
  "tests/direct-assessment-start.test.js",
  "tests/paid-first-flow.test.js",
  "tests/post-assessment-paywall-flow.test.js",
  "tests/post-assessment-personalized-result-runtime.test.js",
  "tests/report-evidence-versioned.test.js",
  "tests/report-snapshot-versioning.test.js",
  "tests/report-attribution-v2.test.js",
  "tests/report-factuality-v2-1.test.js",
  "tests/report-copy-exactness-v2-2.test.js",
  "tests/report-v2-2-p2-closeout.test.js",
  "tests/full-report-core-customer-value.test.js",
  "tests/report-builder-semantic-v7.test.js",
  "tests/report-builder-v6-snapshot-compat.test.js",
  "tests/report-builder-v7-review-regressions.test.js",
  "tests/report-editorial-v8.test.js",
  "tests/report-editorial-low-movement-v8.test.js",
  "tests/question-bank-versioned.test.js",
  "tests/questionnaire-versioning.test.js",
  "tests/questionnaire-v3-safety-routing.test.js",
  "tests/assessment-flow-regression-versioned.test.js",
  "tests/accessibility-print.test.js",
  "tests/security-routing-metadata.test.js",
  "tests/methodology-content.test.js",
  "tests/security.test.js",
  "tests/certification-tools.test.js",
  "tests/admin-bootstrap.test.js",
  "tests/daily-funnel-analytics.test.js",
  "tests/campaign-attribution-analytics.test.js",
  "tests/question-progress-analytics.test.js",
  "tests/meta-capi.test.js",
  "tests/meta-paused-draft-builder.test.mjs",
  "tests/landing-personal-attribute-policy.test.js",
  "tests/contracts/owner-preview.contract.test.js",
  "tests/contracts/assessment-versioned.test.js",
  "tests/contracts/free-initial-result-funnel-versioned.test.js",
  "tests/contracts/payment.contract.test.js",
  "tests/contracts/recovery.contract.test.js",
  "tests/contracts/advisor-auth.contract.test.js"
];
for (const file of tests) {
  const result = spawnSync(process.execPath, [file], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
