"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const distAppPath = path.join(__dirname, "..", "dist", "app.js");
const generatedInitialResultPath = path.join(__dirname, "..", ".generated-copy-hotfix", "netlify", "functions", "_lib", "initial-result.js");
assert(fs.existsSync(distAppPath), "production app must be generated before personalized-result runtime test");
assert(fs.existsSync(generatedInitialResultPath), "generated count-only initial-result backend is missing");

const appSource = fs.readFileSync(distAppPath, "utf8");
for (const expected of [
  "initialResult: null, initialResultError",
  "async function loadInitialResult()",
  "/.netlify/functions/weight-assessment-initial-result?assessmentId=",
  "route === \"assessmentResult\" && restored.nextRoute === \"/assessment/result\"",
  "data-action=\"retry-initial-result\""
]) assert(appSource.includes(expected), `personalized-result client lifecycle missing: ${expected}`);

const completionRouteStart = appSource.indexOf('if (completed.nextRoute === "/assessment/result")');
const completionNavigate = appSource.indexOf('navigate("/assessment/result")', completionRouteStart);
const completionLoad = appSource.indexOf("loadInitialResult().then", completionRouteStart);
assert(completionRouteStart >= 0, "personalized result completion branch is missing");
assert(completionNavigate > completionRouteStart, "personalized result route does not open after completion");
assert(completionLoad > completionNavigate, "initial result must load after the result screen opens rather than blocking navigation");

const {
  INITIAL_RESULT_SCHEMA_VERSION,
  SEALED_INITIAL_RESULT_SCHEMA_VERSION,
  buildInitialResult,
  publicInitialResult
} = require(generatedInitialResultPath);

function pattern(id) {
  return {
    id,
    title: `SERVER ONLY ${id}`,
    evidenceSummary: `SERVER ONLY EVIDENCE ${id}`,
    effectOnWeightLoss: `SERVER ONLY EFFECT ${id}`
  };
}

function moduleFor(id) {
  return {
    patternId: id,
    fields: [
      { key: "observe", body: `observe ${id}` },
      { key: "prepare", body: `prepare ${id}` },
      { key: "inMoment", body: `inMoment ${id}` }
    ]
  };
}

const fullReport = {
  influencingPatterns: [pattern("p1"), pattern("p2"), pattern("p3")],
  contextualFactors: [],
  managementModules: [moduleFor("p1"), moduleFor("p2"), moduleFor("p3")],
  interactionSummary: [
    { id: "p1-p2", patternIds: ["p1", "p2"], explanation: "SERVER ONLY INTERACTION" },
    { id: "observed_context", patternIds: ["p2", "p3"], explanation: "not countable" }
  ],
  combinedManagementPlan: {
    patternIds: ["p1", "p2"],
    startWith: { title: "Start", body: "Start body" },
    why: "Why",
    nextStep: { title: "Next", body: "Next body" },
    combinedAction: { title: "Together", body: "Together body" }
  },
  additionalInteractionManagementPlans: []
};

const built = buildInitialResult(fullReport);
assert.equal(INITIAL_RESULT_SCHEMA_VERSION, "jingeehas-initial-result-v2-count-only");
assert.deepEqual(
  { mode: built.mode, patternCount: built.patternCount, interactionCount: built.interactionCount },
  { mode: "summary", patternCount: 3, interactionCount: 1 }
);
assert.equal(built.lockedSections.length, 7);

const projectedFromSealed = publicInitialResult(
  { schemaVersion: SEALED_INITIAL_RESULT_SCHEMA_VERSION, mode: "sealed" },
  fullReport
);
assert.deepEqual(projectedFromSealed, built, "historical sealed snapshot must project to current count-only result without snapshot mutation");

const publicSerialized = JSON.stringify(projectedFromSealed);
for (const forbidden of [
  "SERVER ONLY p1",
  "SERVER ONLY EVIDENCE",
  "SERVER ONLY EFFECT",
  "SERVER ONLY INTERACTION",
  "primaryPattern",
  "recommendations",
  "internalEvidenceMap"
]) assert(!publicSerialized.includes(forbidden), `count-only initial result leaked ${forbidden}`);

const zeroInteractionReport = {
  ...fullReport,
  interactionSummary: [],
  combinedManagementPlan: null
};
const zeroInteraction = buildInitialResult(zeroInteractionReport);
assert.equal(zeroInteraction.patternCount, 3);
assert.equal(zeroInteraction.interactionCount, 0);

const neutral = buildInitialResult({ neutralResult: { summary: "SERVER ONLY NEUTRAL" } });
assert.deepEqual(
  { mode: neutral.mode, patternCount: neutral.patternCount, interactionCount: neutral.interactionCount },
  { mode: "neutral", patternCount: 0, interactionCount: 0 }
);
assert(!JSON.stringify(neutral).includes("SERVER ONLY NEUTRAL"));

console.log("personalized initial-result client lifecycle and count-only backend contract passed");
