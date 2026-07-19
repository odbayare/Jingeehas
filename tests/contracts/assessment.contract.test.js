"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const { setDatabaseForTests } = require("../../netlify/functions/_lib/store.js");
const { MemoryDatabaseAdapter } = require("../support/memory-database.js");

const database = new MemoryDatabaseAdapter();
setDatabaseForTests(database);
const start = require("../../netlify/functions/weight-session-start.js").handler;
const create = require("../../netlify/functions/weight-assessment-create.js").handler;
const save = require("../../netlify/functions/weight-assessment-save.js").handler;
const complete = require("../../netlify/functions/weight-assessment-complete.js").handler;
const report = require("../../netlify/functions/weight-assessment-report.js").handler;
const sessionState = require("../../netlify/functions/weight-session-state.js").handler;
const deletion = require("../../netlify/functions/weight-data-deletion-request.js").handler;

function event(httpMethod, body, cookie = "", query = {}) {
  return { httpMethod, body: body ? JSON.stringify(body) : null, headers: { cookie }, queryStringParameters: query };
}
function credential(value) { return String(value).split(";")[0]; }

(async () => {
  const started = await start(event("POST"));
  assert.equal(started.statusCode, 201);
  const cookie = credential(started.headers["set-cookie"]);
  assert.match(cookie, /jingeehas_session=/);
  const sessionBody = JSON.parse(started.body);
  assert.match(sessionBody.sessionId, /^ws_/);
  const safetyCheckId = "sc-contract";
  await database.insert("safety_checks", { id: safetyCheckId, sessionId: sessionBody.sessionId, result: { route: "eligible" }, createdAt: new Date().toISOString() });

  const resumed = await start(event("POST", null, cookie));
  assert.equal(JSON.parse(resumed.body).resumed, true);

  const created = await create(event("POST", { safetyCheckId }, cookie));
  assert.equal(created.statusCode, 201);
  const assessmentId = JSON.parse(created.body).assessmentId;

  const answers = {
    "Q-AGE": 30, "Q-SEX": "Эрэгтэй", "Q-HEIGHT": 170, "Q-WEIGHT": 80,
    "Q-MEAL-RHYTHM": "3–4 цаг", "Q-HUNGER": "Амар", "Q-SATIETY": "Амар",
    "Q-EMOTION": "Өөрчлөгддөггүй", "Q-CUE": ["Аль нь ч үгүй"],
    "Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн амардаг", "Q-MOVEMENT": "Дунд",
    "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"],
    "Q-METHOD-CURRENT": ["Одоогоор ямар нэг арга хэрэглээгүй"],
    "Q-METHOD-PAST": ["Ямар нэг арга хэрэглэж үзээгүй"],
    "Q-METHOD-BARRIERS": ["Тодорхой саад байгаагүй"]
  };
  const saved = await save(event("PATCH", { assessmentId, answers, confirmedSummaries: { "C-1": "Баталгаажсан" } }, cookie));
  assert.equal(saved.statusCode, 200);
  assert.equal((await database.find("assessment_answers", { assessmentId })).length, Object.keys(answers).length);
  assert.equal((await database.find("assessment_summaries", { assessmentId })).length, 1);

  const rejectedSexRoute = await save(event("PATCH", { assessmentId, answers: { "MC-GATE": "Тийм, хамаарна" } }, cookie));
  assert.equal(rejectedSexRoute.statusCode, 400);
  assert.equal(JSON.parse(rejectedSexRoute.body).error, "inapplicable_question");
  assert.equal((await database.find("assessment_answers", { assessmentId, questionId: "MC-GATE" })).length, 0);

  const completed = await complete(event("POST", { assessmentId }, cookie));
  assert.equal(JSON.parse(completed.body).reportMode, "limited");
  const reportResult = await report(event("GET", null, cookie, { assessmentId }));
  const reportBody = JSON.parse(reportResult.body);
  assert.equal(reportBody.entitled, false);
  assert.equal(reportBody.fullReport, null);
  await database.insert("entitlements", { id: "we-contract", sessionId: sessionBody.sessionId, assessmentId, paymentId: "wp-contract", productCode: "WEIGHT_TEST_ONE_TIME", status: "active", grantedAt: new Date().toISOString() });
  const entitledReport = JSON.parse((await report(event("GET", null, cookie, { assessmentId }))).body);
  assert(entitledReport.fullReport);
  assert(!Object.hasOwn(entitledReport.fullReport, "internalEvidenceMap"));
  assert(!/Q-[A-Z]|S1-|MC-/.test(JSON.stringify(entitledReport.fullReport)), "public report API must not expose raw question IDs");
  const restored = JSON.parse((await sessionState(event("GET", null, cookie))).body);
  assert.equal(restored.assessment.assessmentId, assessmentId);
  assert.equal(restored.report.reportMode, "limited");
  const deletionResult = await deletion(event("POST", { assessmentId }, cookie));
  assert.equal(deletionResult.statusCode, 202);
  const duplicateDeletion = await deletion(event("POST", { assessmentId }, cookie));
  assert.equal(JSON.parse(duplicateDeletion.body).requestId, JSON.parse(deletionResult.body).requestId);

  const other = await start(event("POST"));
  const otherCookie = credential(other.headers["set-cookie"]);
  const denied = await report(event("GET", null, otherCookie, { assessmentId }));
  assert.equal(denied.statusCode, 404);

  const safetyCreated = await create(event("POST", { safetyCheckId }, cookie));
  const safetyAssessmentId = JSON.parse(safetyCreated.body).assessmentId;
  await save(event("PATCH", { assessmentId: safetyAssessmentId, answers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" } }, cookie));
  const safetyCompleted = await complete(event("POST", { assessmentId: safetyAssessmentId }, cookie));
  assert.equal(JSON.parse(safetyCompleted.body).safetyRoute, "urgent_self_harm");
  const safetyReport = JSON.parse((await report(event("GET", null, cookie, { assessmentId: safetyAssessmentId }))).body);
  assert.equal(safetyReport.safetyRoute, "urgent_self_harm");
  assert.match(safetyReport.initialView.guidance.title, /Яаралтай/);
  console.log("assessment API contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
