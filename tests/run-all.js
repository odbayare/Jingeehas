const { spawnSync } = require("child_process");

const commands = [
  ["node", ["--check", "app.js"]],
  ["node", ["tests/safety-readiness.test.js"]],
  ["node", ["tests/voice-summary-confirmation.test.js"]],
  ["node", ["tests/report-bible-sections.test.js"]],
  ["node", ["tests/question-metadata-mechanisms.test.js"]],
  ["node", ["tests/evidence-scoring-calibration.test.js"]],
  ["node", ["tests/virtual-user-qa.test.js"]],
  ["node", ["tests/ten-person-simulation-audit.test.js"]],
  ["node", ["tests/partial-persona-fix.test.js"]],
  ["node", ["tests/input-focus.test.js"]],
  ["node", ["tests/report-compression-ai-smell.test.js"]],
  ["node", ["tests/copy-localization.test.js"]],
  ["node", ["tests/ai-blind-demo-panel.test.js"]],
  ["node", ["tests/sample-preview-choice-clarity.test.js"]],
  ["node", ["tests/pricing-paywall.test.js"]],
  ["node", ["tests/commercial-flow-qa.test.js"]],
  ["node", ["tests/backend-qpay-plan.test.js"]],
  ["node", ["tests/mock-backend-entitlements.test.js"]],
  ["node", ["tests/fake-payment-lead-capture.test.js"]],
  ["node", ["tests/internal-tester-feedback.test.js"]],
  ["node", ["tests/internal-human-feedback-copy-ux.test.js"]],
  ["node", ["tests/question-copy-polish.test.js"]],
  ["node", ["tests/deep-mongolian-copy-rewrite.test.js"]],
  ["node", ["tests/public-language-purge.test.js"]],
  ["node", ["tests/report-voice-rewrite.test.js"]],
  ["node", ["tests/virtual-audit-public-copy.test.js"]]
];

for (const [command, args] of commands) {
  const label = [command, ...args].join(" ");
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log("\nAll tests passed");
