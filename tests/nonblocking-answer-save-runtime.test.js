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
assert(appSource.includes("queueMicrotask(pumpAnswerSaveQueue)"), "queued follow-up saves are not scheduled after the active worker");
assert(appSource.includes("keepalive: true"), "answer saves are not protected across page unloads");
assert(appSource.includes("await flushAnswerSaves();"), "final completion does not flush pending saves");
assert(appSource.includes('data-action="retry-answer-saves"'), "retryable save failure control is missing");
assert(!appSource.includes("state.slowSave"), "blocking slow-save state returned");
assert(!appSource.includes("Хариултыг хадгалж байна..."), "blocking slow-save message returned");

const originalFetch = global.fetch;

function tick() {
  return new Promise(resolve => setImmediate(resolve));
}

(async () => {
  try {
    const deferred = [];
    let activeRequests = 0;
    let maximumActiveRequests = 0;
    let requestCount = 0;

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
      assert.equal(options.keepalive, true, "background answer save must be unload-safe");
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
    assert.equal(requestCount, 1, "first answer save was not dispatched before navigation could unload the page");
    await firstTransition;

    app._test.getState().answers["Q-SEX"] = "Эрэгтэй";
    const secondStartedAt = Date.now();
    const secondTransition = app._test.nextQuestion();
    assert.equal(app._test.getState().questionIndex, 2, "second next question did not render while the first save was pending");
    assert.equal(app._test.getState().busy, false, "pending save disabled the next question");
    assert(Date.now() - secondStartedAt < 100, "second transition waited for the in-flight save");
    assert.equal(requestCount, 1, "a concurrent save worker started while the first request was in flight");
    await secondTransition;

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

    // An obsolete branch answer must not return to the retry queue after its in-flight request fails.
    app._test.resetAnswerSaveQueue();
    app._test.setState({
      assessmentId: "wa-obsolete-branch-save",
      assessmentStatus: "in_progress",
      commercialFlowVersion: "free_assessment_postpaid_v1",
      questionnaireVersion: questions.QUESTIONNAIRE_VERSION,
      questionsAuthorized: true,
      answers: {
        "Q-METHOD-PAST": ["Алхалт"],
        "Q-METHOD-LONGEST": "Алхалт"
      },
      questionIndex: 0,
      busy: false
    });

    let rejectObsolete;
    global.fetch = (_url, options = {}) => {
      assert.equal(options.keepalive, true);
      return new Promise((_resolve, reject) => { rejectObsolete = reject; });
    };
    app._test.enqueueAnswerSave("Q-METHOD-LONGEST", "Алхалт");
    const obsoleteWorker = app._test.answerSaveQueue.worker;
    app._test.getState().answers["Q-METHOD-PAST"] = ["Ямар нэг арга хэрэглэж үзээгүй"];
    delete app._test.getState().answers["Q-METHOD-LONGEST"];
    rejectObsolete(new Error("network_failure"));
    await obsoleteWorker;
    await tick();
    assert.equal(app._test.answerSaveQueue.pending.has("Q-METHOD-LONGEST"), false, "obsolete branch answer returned to pending saves");
    assert.equal(app._test.answerSaveQueue.failed.has("Q-METHOD-LONGEST"), false, "obsolete branch answer became permanently retryable");
    assert.equal(app._test.answerSaveQueue.paused, false, "obsolete failed request paused the current valid queue");

    // Restoring a stale server snapshot must preserve in-flight/pending local answers.
    app._test.resetAnswerSaveQueue();
    app._test.setState({
      assessmentId: "wa-restore-merge",
      assessmentStatus: "in_progress",
      commercialFlowVersion: "free_assessment_postpaid_v1",
      questionnaireVersion: questions.QUESTIONNAIRE_VERSION,
      answers: { "Q-AGE": 31, "Q-SEX": "Эрэгтэй" },
      busy: false
    });
    app._test.answerSaveQueue.inFlight = new Map([["Q-AGE", 31]]);
    app._test.answerSaveQueue.pending.set("Q-SEX", "Эрэгтэй");
    app._test.applyAssessmentState({
      assessment: {
        assessmentId: "wa-restore-merge",
        status: "in_progress",
        commercialFlowVersion: "free_assessment_postpaid_v1",
        questionnaireVersion: questions.QUESTIONNAIRE_VERSION
      },
      answers: { "Q-AGE": 30 }
    });
    assert.equal(app._test.getState().answers["Q-AGE"], 31, "stale server value replaced an in-flight local answer");
    assert.equal(app._test.getState().answers["Q-SEX"], "Эрэгтэй", "pending local answer was lost during restore");

    // A queued controller change must also remove stale server-side descendant answers locally.
    app._test.answerSaveQueue.inFlight = null;
    app._test.answerSaveQueue.pending.clear();
    app._test.answerSaveQueue.pending.set("Q-METHOD-PAST", ["Ямар нэг арга хэрэглэж үзээгүй"]);
    app._test.applyAssessmentState({
      assessment: {
        assessmentId: "wa-restore-merge",
        status: "in_progress",
        commercialFlowVersion: "free_assessment_postpaid_v1",
        questionnaireVersion: questions.QUESTIONNAIRE_VERSION
      },
      answers: {
        "Q-AGE": 31,
        "Q-SEX": "Эрэгтэй",
        "Q-METHOD-PAST": ["Алхалт"],
        "Q-METHOD-LONGEST": "Алхалт"
      }
    });
    assert.deepEqual(app._test.getState().answers["Q-METHOD-PAST"], ["Ямар нэг арга хэрэглэж үзээгүй"]);
    assert.equal(Object.prototype.hasOwnProperty.call(app._test.getState().answers, "Q-METHOD-LONGEST"), false, "stale branch descendant returned from server restore");
  } finally {
    global.fetch = originalFetch;
    app._test.resetAnswerSaveQueue();
  }

  console.log("non-blocking answer-save runtime regression passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
