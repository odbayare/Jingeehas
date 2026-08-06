"use strict";

process.env.NODE_ENV = "test";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const distAppPath = path.join(__dirname, "..", "dist", "app.js");
const appSource = fs.readFileSync(distAppPath, "utf8");
const app = require(distAppPath);
const questions = require(path.join(__dirname, "..", "dist", "questions.js"));

assert(appSource.includes("const answerSaveQueue ="), "single-flight answer save queue is missing");
assert(appSource.includes("queueMicrotask(pumpAnswerSaveQueue)"), "background save worker is not scheduled independently of navigation");
assert(appSource.includes("await flushAnswerSaves();"), "final completion does not flush pending saves");
assert(appSource.includes('data-action="retry-answer-saves"'), "retryable save failure control is missing");
assert(!appSource.includes("state.slowSave"), "blocking slow-save state returned");
assert(!appSource.includes("Хариултыг хадгалж байна..."), "blocking slow-save message returned");

const originalFetch = global.fetch;
const deferred = [];
let activeRequests = 0;
let maximumActiveRequests = 0;
let requestCount = 0;

function tick() {
  return new Promise(resolve => setImmediate(resolve));
}

(async () => {
  try {
    app._test.resetAnswerSaveQueue();
    app._test.setState({
      assessmentId: "wa-nonblocking-save",
      assessmentStatus: "in_progress",
      commercialFlowVersion: "free_assessment_postpaid_v1",
      questionnaireVersion: questions.QUESTIONNAIRE_VERSION,
      questionsAuthorized: true,
      answers: { "Q-AGE": 30 },
      questionIndex: 0,
      busy: false
    });

    global.fetch = (url, options = {}) => {
      assert(String(url).includes("weight-assessment-save"), `unexpected request during answer-save regression: ${url}`);
      const payload = JSON.parse(options.body || "{}");
      requestCount += 1;
      activeRequests += 1;
      maximumActiveRequests = Math.max(maximumActiveRequests, activeRequests);
      return new Promise(resolve => {
        deferred.push(() => {
          activeRequests -= 1;
          resolve({
            ok: true,
            status: 200,
            async json() { return { savedQuestionIds: Object.keys(payload.answers || {}) }; }
          });
        });
      });
    };

    const firstStartedAt = Date.now();
    const firstTransition = app._test.nextQuestion();
    assert.equal(app._test.getState().questionIndex, 1, "first next question did not render immediately");
    assert.equal(app._test.getState().busy, false, "background save incorrectly blocks the next question");
    assert(Date.now() - firstStartedAt < 100, "first transition waited for the network save");
    await firstTransition;
    await tick();
    assert.equal(requestCount, 1, "first answer save did not start in the background");

    app._test.getState().answers["Q-SEX"] = "Эрэгтэй";
    const secondStartedAt = Date.now();
    const secondTransition = app._test.nextQuestion();
    assert.equal(app._test.getState().questionIndex, 2, "second next question did not render while the first save was pending");
    assert.equal(app._test.getState().busy, false, "pending save disabled the next question");
    assert(Date.now() - secondStartedAt < 100, "second transition waited for the in-flight save");
    await secondTransition;
    await tick();
    assert.equal(requestCount, 1, "a concurrent save worker started while the first request was in flight");

    deferred.shift()();
    await tick();
    await tick();
    assert.equal(requestCount, 2, "queued second answer was not persisted after the first save completed");
    assert.equal(maximumActiveRequests, 1, "answer saves were not single-flight");

    deferred.shift()();
    await app._test.flushAnswerSaves();
    await tick();
    assert.equal(app._test.getState().saveStatus, "saved");
    assert.equal(app._test.answerSaveQueue.pending.size, 0);
    assert.equal(app._test.answerSaveQueue.inFlight, null);
    assert.equal(app._test.answerSaveQueue.worker, null);
  } finally {
    global.fetch = originalFetch;
    app._test.resetAnswerSaveQueue();
  }

  console.log("non-blocking answer-save runtime regression passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
