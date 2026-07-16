"use strict";
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
for (const file of fs.readdirSync(__dirname).filter(name => name.endsWith(".contract.test.js")).sort()) {
  const result = spawnSync(process.execPath, [path.join(__dirname, file)], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
