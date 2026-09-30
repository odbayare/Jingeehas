"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const appPath = path.join(__dirname, "..", "app.js");
const tick = () => new Promise(resolve => setImmediate(resolve));

function harness() {
  const requests = [];
  const timers = new Map();
  const renders = [];
  let timerId = 0;
  const location = { pathname: "/assessment/payment" };
  const sandbox = {
    module: { exports: {} }, require: createRequire(appPath), console, URL, URLSearchParams, Date,
    window: { location, addEventListener() {}, history: {
      pushState(_state, _unused, target) { location.pathname = target; },
      replaceState(_state, _unused, target) { location.pathname = target; }
    } },
    document: { hidden: false, addEventListener() {}, getElementById() { return null; }, querySelector() { return null; } },
    setTimeout(callback) { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
    fetch(url, options) {
      return new Promise((resolve, reject) => requests.push({ url, options,
        respond(body, status = 200) { resolve({ ok: status >= 200 && status < 300, status, json: async () => body }); }, reject }));
    },
    recordRender(options) { renders.push(options); }
  };
  vm.runInNewContext(`${fs.readFileSync(appPath, "utf8")}
    // DOM preservation is covered by Playwright. Keep render's polling side effect
    // here while observing only the async controller state and network boundary.
    render = function(options = {}) { recordRender(options); schedulePaymentPolling(); };
    module.exports.runtime = { checkPayment, applyAssessmentState, schedulePaymentPolling,
      createInvoice, continueToPayment, getInFlight: () => paymentCheckInFlight };
  `, sandbox, { filename: appPath });
  const app = sandbox.module.exports;
  const payment = id => ({ paymentId: `payment-${id}`, status: "pending", urls: [] });
  const restore = id => app.runtime.applyAssessmentState({ assessment: { assessmentId: id, status: "complete",
    commercialFlowVersion: "free_assessment_postpaid_v1" }, payment: payment(id) });
  const set = id => app._test.setState({ assessmentId: id, assessmentStatus: "complete",
    commercialFlowVersion: "free_assessment_postpaid_v1", payment: payment(id) });
  function fireTimer() {
    assert.equal(timers.size, 1, "expected exactly one pending poll");
    const [id, callback] = [...timers][0]; timers.delete(id); callback();
  }
  return { app, requests, timers, renders, location, set, restore, payment, fireTimer };
}

(async () => {
  // A manual check owns only its per-payment lock. Restoring a different
  // assessment must not leak global busy state or allow duplicate invoice work.
  {
    const h = harness(); h.set("old-manual");
    const pending = h.app.runtime.checkPayment();
    assert.equal(h.app._test.getState().busy, false);
    assert.equal(h.app._test.getState().payment.status, "checking");
    assert(!h.app.renderForPath("/assessment/payment").includes('data-action="create-invoice"'));
    await h.app.runtime.createInvoice();
    await h.app.runtime.continueToPayment();
    await h.app.runtime.checkPayment();
    assert.equal(h.requests.length, 1, "in-flight checks must block another check or invoice action");
    h.restore("new-manual");
    h.requests[0].respond(h.payment("old-manual"));
    await pending;
    assert.equal(h.app._test.getState().busy, false, "obsolete manual request left the restored assessment busy");
    assert.equal(h.app._test.getState().assessmentId, "new-manual");
    assert.equal(h.app._test.getState().payment.paymentId, "payment-new-manual");
    assert.equal(h.app.runtime.getInFlight(), null);
    assert.equal(h.timers.size, 1, "restored checkout must have a replacement polling timer");
  }

  // A timer for a newer checkout can fire while the old network call still
  // owns the lock. Its skipped poll must be rearmed when that old call finishes.
  {
    const h = harness(); h.set("old-auto");
    const pending = h.app.runtime.checkPayment({ automatic: true });
    h.restore("new-auto"); h.app.runtime.schedulePaymentPolling(); h.fireTimer();
    assert.equal(h.requests.length, 1);
    assert.equal(h.timers.size, 0);
    h.requests[0].respond(h.payment("old-auto"));
    await pending;
    assert.equal(h.app._test.getState().payment.paymentId, "payment-new-auto", "late payment response overwrote restored state");
    assert.equal(h.app._test.getState().payment.status, "pending");
    assert.equal(h.timers.size, 1, "old request consumed the newer checkout's polling loop");
    h.fireTimer();
    assert.equal(h.requests.length, 2);
    assert.equal(JSON.parse(h.requests[1].options.body).paymentId, "payment-new-auto");
    h.requests[1].respond(h.payment("new-auto")); await tick();
    assert.equal(h.app.runtime.getInFlight(), null);
    assert.equal(h.timers.size, 1);
  }

  // A payment controller must not clear busy state owned by a newer user action.
  {
    const h = harness(); h.set("old-busy");
    const pending = h.app.runtime.checkPayment({ automatic: true });
    h.restore("new-busy"); h.app._test.getState().busy = true;
    h.requests[0].respond(h.payment("old-busy")); await pending;
    assert.equal(h.app._test.getState().busy, true);
    assert.equal(h.app.runtime.getInFlight(), null);
  }

  // Payment confirmation can arrive before a transient report-fetch failure.
  // A retry checks authoritative state again and then loads the report.
  {
    const h = harness(); h.set("report-retry");
    const paid = { ...h.payment("report-retry"), status: "paid", nextRoute: "/report" };
    const pending = h.app.runtime.checkPayment({ automatic: true });
    h.requests[0].respond(paid); await tick();
    assert(h.requests[1].url.includes("weight-assessment-report?assessmentId=report-retry"));
    h.requests[1].respond({ error: "temporarily_unavailable" }, 503); await pending;
    assert.equal(h.app._test.getState().payment.status, "check_error");
    assert.equal(h.app._test.getState().report, null);
    assert.equal(h.location.pathname, "/assessment/payment");
    assert.equal(h.timers.size, 1);
    assert.equal(h.app.runtime.getInFlight(), null);
    const retry = h.app.runtime.checkPayment();
    h.requests[2].respond(paid); await tick();
    const report = { entitled: true, fullReport: { sections: [] } };
    h.requests[3].respond(report); await retry;
    assert.equal(h.app._test.getState().payment.status, "paid");
    assert.equal(h.app._test.getState().report, report);
    assert.equal(h.location.pathname, "/report");
    assert.equal(h.app.runtime.getInFlight(), null);
    assert.equal(h.timers.size, 0);
    assert(h.requests.every(request => !request.url.includes("qpay-create-invoice")));
  }

  // Leaving checkout while report loading must not allow its late completion
  // to navigate the user away from the page they chose.
  {
    const h = harness(); h.set("late-report");
    const pending = h.app.runtime.checkPayment({ automatic: true });
    h.requests[0].respond({ ...h.payment("late-report"), status: "paid", nextRoute: "/report" }); await tick();
    h.location.pathname = "/support";
    h.requests[1].respond({ entitled: true, fullReport: { sections: [] } }); await pending;
    assert.equal(h.location.pathname, "/support");
    assert.equal(h.app.runtime.getInFlight(), null);
    assert.equal(h.timers.size, 0);
  }

  console.log("Payment polling stale-request cleanup, ownership, report retry, and navigation runtime tests passed");
})().catch(error => { console.error(error); process.exitCode = 1; });
