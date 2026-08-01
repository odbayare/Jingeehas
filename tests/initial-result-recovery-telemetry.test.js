"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../app.js");
const analytics = require("../netlify/functions/_lib/analytics.js");

const root = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const collectSource = fs.readFileSync(path.join(root, "netlify/functions/analytics-collect.js"), "utf8");
const migrationSource = fs.readFileSync(path.join(root, "supabase/migrations/20260801104500_allow_initial_result_load_failed_event.sql"), "utf8");

assert(analytics.BROWSER_EVENTS.has("initial_result_load_failed"));
assert.equal(
  analytics.browserEventIdempotencyKey(
    "initial_result_load_failed",
    { sessionIdHash: "a".repeat(64) },
    "assessment_safe_123",
    new Date("2026-08-01T10:45:00.000Z")
  ),
  "initial_result_load_failed:assessment_safe_123"
);

assert(collectSource.includes('["paywall_viewed", "report_opened", "initial_result_load_failed"]'));
assert(migrationSource.includes("'initial_result_load_failed'::text"));
assert(!migrationSource.match(/raw[_ -]?(answer|result)|email|phone|bmi|body_weight/i));

assert(appSource.includes('initialResultError: ""'));
assert(appSource.includes('trackEvent("initial_result_load_failed"'));
assert(appSource.includes('data-action="retry-initial-result"'));
assert(appSource.includes('root.querySelector(\'[data-action="retry-initial-result"]\')'));
assert(!appSource.includes('initial_result_load_failed", state.assessmentId, error'));
assert(!appSource.includes('initial_result_load_failed", state.assessmentId, requestError'));

const completionBranch = appSource.indexOf('if (completed.nextRoute === "/assessment/result")');
assert(completionBranch >= 0);
const completionSlice = appSource.slice(completionBranch, completionBranch + 500);
assert(completionSlice.indexOf('navigate("/assessment/result")') >= 0);
assert(completionSlice.indexOf("await loadInitialResult()") >= 0);
assert(
  completionSlice.indexOf('navigate("/assessment/result")') < completionSlice.indexOf("await loadInitialResult()"),
  "Completion must route to the recoverable result page before loading the result API"
);

const restoreBranch = appSource.indexOf('if (restored.nextRoute === "/assessment/result")');
assert(restoreBranch >= 0);
const restoreSlice = appSource.slice(restoreBranch, restoreBranch + 600);
assert(restoreSlice.indexOf('navigate("/assessment/result")') >= 0);
assert(restoreSlice.indexOf("await loadInitialResult()") >= 0);
assert(
  restoreSlice.indexOf('navigate("/assessment/result")') < restoreSlice.indexOf("await loadInitialResult()"),
  "Resume must route to the recoverable result page before loading the result API"
);

app._test.setComingSoon(false);
app._test.setState({
  assessmentId: "assessment_safe_123",
  assessmentStatus: "complete",
  initialResult: null,
  initialResultError: "Эхний үр дүнг ачаалж чадсангүй. Дахин оролдоно уу."
});
const errorPage = app.renderForPath("/assessment/result");
assert(errorPage.includes("Эхний үр дүнг ачаалж чадсангүй"));
assert(errorPage.includes('data-action="retry-initial-result"'));
assert(!errorPage.includes("assessment_safe_123"));
app._test.resetComingSoon();

console.log("initial-result recovery telemetry tests passed");
