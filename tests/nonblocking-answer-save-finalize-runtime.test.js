"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appSource = fs.readFileSync(path.join(__dirname, "..", "dist", "app.js"), "utf8");

for (const expected of [
  "generation: 0",
  "answerSaveQueue.generation += 1",
  "const generation = answerSaveQueue.generation",
  "const assessmentId = state.assessmentId",
  "answerSaveQueue.generation !== generation",
  "answerSaveQueue.worker !== worker",
  "function updateAnswerSaveStatus()",
  "if (answerSaveQueue.paused) render({ focus: false }); else updateAnswerSaveStatus();"
]) assert(appSource.includes(expected), `final non-blocking save guard missing: ${expected}`);

const pumpStart = appSource.indexOf("function pumpAnswerSaveQueue()");
const enqueueStart = appSource.indexOf("function enqueueAnswerSave", pumpStart);
assert(pumpStart >= 0 && enqueueStart > pumpStart, "answer save pump source is missing");
const pumpSource = appSource.slice(pumpStart, enqueueStart);
assert(!pumpSource.includes("answerSaveQueue.inFlight = null; answerSaveQueue.worker = null; render({ focus: false });"), "successful save still rebuilds the active question form");
assert(pumpSource.includes("body: JSON.stringify({ assessmentId, answers: Object.fromEntries(batch) })"), "worker does not retain its original assessment identity");

console.log("non-blocking answer-save active-input and stale-worker guards passed");
