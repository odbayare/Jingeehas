"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter, setDatabaseForTests } = require("../../netlify/functions/_lib/store.js");

const database = new MemoryDatabaseAdapter();
setDatabaseForTests(database);
const start = require("../../netlify/functions/weight-session-start.js").handler;
const create = require("../../netlify/functions/weight-assessment-create.js").handler;
const save = require("../../netlify/functions/weight-assessment-save.js").handler;
const complete = require("../../netlify/functions/weight-assessment-complete.js").handler;
const report = require("../../netlify/functions/weight-assessment-report.js").handler;

function event(httpMethod, body, cookie = "", query = {}) {
  return { httpMethod, body: body ? JSON.stringify(body) : null, headers: { cookie }, queryStringParameters: query };
}

(async () => {
  const started = await start(event("POST"));
  assert.equal(started.statusCode, 201);
  const cookie = started.headers["set-cookie"].split(";")[0];
  assert.match(cookie, /^jingeehas_session=/);
  const sessionBody = JSON.parse(started.body);
  assert.match(sessionBody.sessionId, /^ws_/);

  const resumed = await start(event("POST", null, cookie));
  assert.equal(JSON.parse(resumed.body).resumed, true);

  const created = await create(event("POST", {}, cookie));
  assert.equal(created.statusCode, 201);
  const assessmentId = JSON.parse(created.body).assessmentId;

  const answers = Object.fromEntries(Array.from({ length: 8 }, (_, index) => [`Q-${index + 1}`, `A-${index + 1}`]));
  const saved = await save(event("PATCH", { assessmentId, answers, confirmedSummaries: { "C-1": "Баталгаажсан" } }, cookie));
  assert.equal(saved.statusCode, 200);
  assert.equal((await database.find("assessment_answers", { assessmentId })).length, 8);
  assert.equal((await database.find("assessment_summaries", { assessmentId })).length, 1);

  const completed = await complete(event("POST", { assessmentId }, cookie));
  assert.equal(JSON.parse(completed.body).reportMode, "sufficient");
  const reportResult = await report(event("GET", null, cookie, { assessmentId }));
  const reportBody = JSON.parse(reportResult.body);
  assert.equal(reportBody.entitled, false);
  assert.equal(reportBody.fullReport, null);

  const other = await start(event("POST"));
  const otherCookie = other.headers["set-cookie"].split(";")[0];
  const denied = await report(event("GET", null, otherCookie, { assessmentId }));
  assert.equal(denied.statusCode, 404);
  console.log("assessment API contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
