"use strict";
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const replacements = Object.freeze({
  "assessment.contract.test.js": "assessment-versioned.test.js",
  "free-initial-result-funnel.contract.test.js": "free-initial-result-funnel-versioned.test.js"
});
const files = fs.readdirSync(__dirname).filter(name => name.endsWith(".contract.test.js")).sort();
for (const file of files) {
  const target = replacements[file] || file;
  const result = spawnSync(process.execPath, [path.join(__dirname, target)], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
