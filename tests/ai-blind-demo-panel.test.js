const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const panelPath = path.join(root, "AI_BLIND_DEMO_PANEL.md");
const readmePath = path.join(root, "README.md");

assert(fs.existsSync(panelPath), "AI_BLIND_DEMO_PANEL.md should exist");

const panel = fs.readFileSync(panelPath, "utf8");
const readme = fs.readFileSync(readmePath, "utf8");

const participantHeadings = panel.match(/^## Participant \d+ - /gm) || [];
assert.strictEqual(participantHeadings.length, 12, "panel should include 12 participants");

[
  "# AI Blind Demo Panel",
  "## Executive Summary",
  "### Scores",
  "| Payment intent",
  "## Cross-Participant Findings",
  "## Decision"
].forEach(text => {
  assert(panel.includes(text), `panel should include ${text}`);
});

[
  "Comprehension",
  "Choice clarity",
  "Question clarity",
  "Report relevance",
  "Trust",
  "AI smell risk",
  "Payment intent"
].forEach(metric => {
  const count = (panel.match(new RegExp(`\\| ${metric.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\|`, "g")) || []).length;
  assert(count >= 12, `panel should include ${metric} for each participant`);
});

[
  "S1-V",
  "D-SUM",
  "reportUse",
  "safetyTrigger",
  "high_hunger",
  "reward_pull",
  "food_as_regulation",
  "Data Quality",
  "Primary Pattern",
  "Hidden Function",
  "Trigger ->",
  "100%",
  "сахилга батгүй",
  "залхуу",
  "өөрийгөө хяна"
].forEach(term => {
  assert(!panel.includes(term), `panel should not expose forbidden term: ${term}`);
});

assert(readme.includes("AI_BLIND_DEMO_PANEL.md"), "README should link to the AI blind demo panel");

console.log("AI blind demo panel checks passed");
