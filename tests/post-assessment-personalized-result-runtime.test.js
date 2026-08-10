"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const distAppPath = path.join(__dirname, "..", "dist", "app.js");
const generatedInitialResultPath = path.join(__dirname, "..", ".generated-copy-hotfix", "netlify", "functions", "_lib", "initial-result.js");
assert(fs.existsSync(distAppPath), "production app must be generated before sealed-result runtime test");
assert(fs.existsSync(generatedInitialResultPath), "generated sealed initial-result backend is missing");

const appSource = fs.readFileSync(distAppPath, "utf8");
for (const forbidden of [
  "initialResult: null, initialResultError",
  "async function loadInitialResult()",
  "/.netlify/functions/weight-assessment-initial-result?assessmentId=",
  "data-action=\"retry-initial-result\""
]) assert(!appSource.includes(forbidden), `sealed client still loads a free personalized result: ${forbidden}`);

const renderStart = appSource.indexOf("function renderInitialResult()");
const renderEnd = appSource.indexOf("function renderAssessmentCompleted()", renderStart);
assert(renderStart >= 0 && renderEnd > renderStart, "sealed result renderer is missing");
const renderSource = appSource.slice(renderStart, renderEnd);
for (const expected of ["Тест дууслаа", "Таны тайлан бэлэн боллоо", "Бүрэн тайлангаа нээх —"])
  assert(renderSource.includes(expected), `sealed result copy missing: ${expected}`);
for (const forbidden of ["state.initialResult", "patternCount", "interactionCount", "primaryPattern", "lockedSections"])
  assert(!renderSource.includes(forbidden), `sealed result renderer reads personalized data: ${forbidden}`);

const {
  INITIAL_RESULT_SCHEMA_VERSION,
  LEGACY_INITIAL_RESULT_SCHEMA_VERSION,
  COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION,
  buildInitialResult,
  publicInitialResult
} = require(generatedInitialResultPath);

const fullReport = {
  influencingPatterns: [{
    id: "p1",
    title: "SERVER ONLY PATTERN",
    evidenceSummary: "SERVER ONLY CONDITION",
    effectOnWeightLoss: "SERVER ONLY REASON"
  }],
  recommendations: ["SERVER ONLY ACTION"]
};
const sealed = { schemaVersion: INITIAL_RESULT_SCHEMA_VERSION, mode: "sealed" };

assert.equal(INITIAL_RESULT_SCHEMA_VERSION, "jingeehas-post-assessment-paywall-v1");
assert.deepEqual(buildInitialResult(fullReport), sealed);
assert.deepEqual(publicInitialResult(sealed, fullReport), sealed);
assert.deepEqual(publicInitialResult({ schemaVersion: LEGACY_INITIAL_RESULT_SCHEMA_VERSION, title: "LEAK" }, fullReport), sealed);
assert.deepEqual(publicInitialResult({ schemaVersion: COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION, patternCount: 3 }, fullReport), sealed);

const serialized = JSON.stringify([
  buildInitialResult(fullReport),
  publicInitialResult({ schemaVersion: COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION, patternCount: 3 }, fullReport)
]);
for (const forbidden of ["SERVER ONLY", "patternCount", "interactionCount", "primaryPattern", "recommendations"])
  assert(!serialized.includes(forbidden), `sealed initial result leaked ${forbidden}`);

console.log("sealed initial-result client and backend contract passed");
