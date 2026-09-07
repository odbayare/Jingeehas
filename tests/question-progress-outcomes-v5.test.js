"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { normalizeQuestionProgressSummary } = require("../netlify/functions/admin-question-progress.js");

const split = normalizeQuestionProgressSummary({
  cohortStarted: 20,
  coveredAssessments: 18,
  liveProgressAssessments: 17,
  backfillOnlyAssessments: 1,
  coverageRate: 0.9,
  averageQuestionsReached: 30,
  completedCount: 12,
  completionRate: 0.6,
  terminalCompletedCount: 12,
  terminalCompletionRate: 0.6,
  commercialCompletedCount: 8,
  safetyExitCount: 4,
  commercialEligibleStartedCount: 16,
  commercialCompletionRate: 0.5,
  safetyExitRate: 0.2,
  activeInProgressCount: 2,
  instrumentationStartedAt: "2026-09-07T00:00:00.000Z"
});
assert.equal(split.completedCount, 12, "legacy completion alias remains terminal completion");
assert.equal(split.completionRate, 0.6, "legacy completion-rate alias remains terminal completion rate");
assert.equal(split.terminalCompletedCount, 12);
assert.equal(split.commercialCompletedCount, 8);
assert.equal(split.safetyExitCount, 4);
assert.equal(split.commercialEligibleStartedCount, 16);
assert.equal(split.commercialCompletionRate, 0.5);
assert.equal(split.safetyExitRate, 0.2);

const legacy = normalizeQuestionProgressSummary({ cohortStarted: 10, completedCount: 6, completionRate: 0.6 });
assert.equal(legacy.terminalCompletedCount, 6, "legacy backend response still maps to terminal completion");
assert.equal(legacy.safetyExitCount, 0, "legacy response cannot invent historical safety exits");
assert.equal(legacy.commercialCompletedCount, 6, "legacy response remains backward compatible until migration is applied");
assert.equal(legacy.commercialEligibleStartedCount, 10);
assert.equal(legacy.commercialCompletionRate, 0.6);
assert.equal(legacy.safetyExitRate, 0);

const migrationPath = path.join(__dirname, "..", "supabase", "migrations", "20260907104746_v5_split_question_progress_terminal_outcomes.sql");
const sql = fs.readFileSync(migrationPath, "utf8");
for (const token of [
  "terminal_completed_count",
  "commercial_completed_count",
  "safety_exit_count",
  "commercial_eligible_started_count",
  "terminal_completion_rate",
  "commercial_completion_rate",
  "safety_exit_rate"
]) assert(sql.includes(`'${token}'`), `migration must expose ${token}`);
assert(sql.includes("c.report_mode = 'safety' or c.safety_route is not null"), "safety outcome must use authoritative assessment classification");
assert(sql.includes("coalesce(c.report_mode, '') <> 'safety'"), "commercial completion must exclude safety reports");
assert(sql.includes("'completed_count', outcome_totals.terminal_completed_count"), "legacy completed_count must remain terminal completion");
assert(sql.includes("'completion_rate'"), "legacy completion_rate must remain available");
assert(!sql.includes("update jingeehas.assessments"), "analytics migration must not rewrite historical assessments");
assert(!sql.includes("delete from jingeehas.assessments"), "analytics migration must not delete historical assessments");

console.log("question-progress-outcomes-v5.test.js PASS");
