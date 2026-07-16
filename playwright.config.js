"use strict";
const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
  testDir: "tests/e2e", timeout: 30000, expect: { timeout: 5000 }, fullyParallel: false, workers: 1, reporter: "line",
  use: { baseURL: "http://127.0.0.1:4178", trace: "retain-on-failure" },
  webServer: { command: "node tests/e2e/server.js", url: "http://127.0.0.1:4178", reuseExistingServer: false, timeout: 15000 }
});
