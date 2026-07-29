"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const save = fs.readFileSync(path.join(root, "netlify/functions/weight-assessment-save.js"), "utf8");
const assessment = fs.readFileSync(path.join(root, "netlify/functions/_lib/assessment.js"), "utf8");

for (const marker of ["answerSaveQueue", "enqueueAnswerSave", "flushAnswerSaves", "retryAnswerSaves", "completionStarted"]) assert(app.includes(marker), marker);
assert.match(app, /state\.questionIndex = currentIndex \+ 1; render\(\{ focus: false \}\); return/);
assert.match(app, /Object\.fromEntries\(batch\)/);
assert.match(app, /await flushAnswerSaves\(\)/);
assert.match(app, /data-action="retry-answer-saves"/);
assert.match(save, /saveAssessment\(database, session\.id, body, new Date\(\), owned\)/);
assert.match(save, /void markAnswersRecordedSafe/);
assert.match(assessment, /assessment\.sessionId === sessionId \? null/);
assert(!app.includes("Хариултыг хадгалж байна..."));
assert(!app.includes("const slowTimer = setTimeout"));
console.log("optimistic answer-save contract tests passed");
