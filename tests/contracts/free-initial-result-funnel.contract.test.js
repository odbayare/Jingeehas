"use strict";

process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 11).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "free-flow-recovery-pepper-with-32-characters";
process.env.ANALYTICS_HASH_PEPPER = "free-flow-analytics-pepper-with-32-characters";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const { setDatabaseForTests } = require("../../netlify/functions/_lib/store.js");
const { MemoryDatabaseAdapter } = require("../support/memory-database.js");
const { createAssessment, saveAssessment, completeAssessment, reportForSession } = require("../../netlify/functions/_lib/assessment.js");
const { INITIAL_RESULT_SCHEMA_VERSION, buildInitialResult, publicInitialResult } = require("../../netlify/functions/_lib/initial-result.js");
const { createInvoice, checkPayment } = require("../../netlify/functions/_lib/payment.js");
const { nextRoute } = require("../../netlify/functions/_lib/commercial-flow.js");

const database = new MemoryDatabaseAdapter();
setDatabaseForTests(database);
const startSession = require("../../netlify/functions/weight-session-start.js").handler;
const create = require("../../netlify/functions/weight-assessment-create.js").handler;
const questions = require("../../netlify/functions/weight-assessment-questions.js").handler;
const save = require("../../netlify/functions/weight-assessment-save.js").handler;
const complete = require("../../netlify/functions/weight-assessment-complete.js").handler;
const initialResult = require("../../netlify/functions/weight-assessment-initial-result.js").handler;
const emailSave = require("../../netlify/functions/weight-result-email-save.js").handler;
const report = require("../../netlify/functions/weight-assessment-report.js").handler;
const analyticsCollect = require("../../netlify/functions/analytics-collect.js").handler;

function event(httpMethod, body, cookie = "", query = {}) {
  return { httpMethod, body: body ? JSON.stringify(body) : null, headers: { cookie, host: "localhost" }, queryStringParameters: query };
}
function credential(value) { return String(value).split(";")[0]; }
function body(result) { return JSON.parse(result.body); }

const completeAnswers = {
  "Q-AGE": 30, "Q-SEX": "Эрэгтэй", "Q-HEIGHT": 170, "Q-WEIGHT": 80,
  "Q-MEAL-RHYTHM": "3–4 цаг", "Q-HUNGER": "Амар", "Q-SATIETY": "Амар",
  "Q-EMOTION": "Өөрчлөгддөггүй", "Q-CUE": ["Аль нь ч үгүй"],
  "Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн амардаг", "Q-MOVEMENT": "Дунд",
  "S1-S03": "Үгүй", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"],
  "Q-METHOD-CURRENT": ["Одоогоор ямар нэг арга хэрэглээгүй"],
  "Q-METHOD-PAST": ["Ямар нэг арга хэрэглэж үзээгүй"],
  "Q-METHOD-BARRIERS": ["Тодорхой саад байгаагүй"]
};

(async () => {
  const sealedView = buildInitialResult({ personalized: "ignored" });
  assert.deepEqual(sealedView, { schemaVersion: INITIAL_RESULT_SCHEMA_VERSION, mode: "sealed" });
  assert.deepEqual(publicInitialResult(sealedView), sealedView);

  const migration = fs.readFileSync(require.resolve("../../supabase/migrations/20260731024831_free_assessment_initial_result_funnel.sql"), "utf8");
  for (const expected of [
    "free_assessment_postpaid_v1", "funnel_key_hash", "report_snapshots_safe_initial_result_shape_check",
    "report_snapshot_versions_safe_initial_result_shape_check", "analytics_flow_cutovers", "enable row level security",
    "free_assessment_started", "free_assessment_completed", "initial_result_viewed", "result_email_saved",
    "full_report_cta_clicked", "full_report_opened", "landing_cta_clicked", "payment_cta_clicked",
    "checkout_submitted", "assessment_shell_created", "invoice_create_started", "payment_page_rendered",
    "Asia/Ulaanbaatar", "no_denominator"
  ]) assert(migration.includes(expected), expected);
  assert(!/\bupdate\s+jingeehas\.(?:assessments|assessment_answers|payments|entitlements|report_snapshots)\b/i.test(migration), "migration must not rewrite customer records");
  const sealedMigration = fs.readFileSync(require.resolve("../../supabase/migrations/20260804043918_map_post_assessment_paywall_analytics.sql"), "utf8");
  assert(sealedMigration.includes("post_assessment_paywall_viewed"));
  assert(sealedMigration.includes("event_name in ('initial_result_viewed', 'post_assessment_paywall_viewed')"), "reporting keeps historical event compatibility");
  assert(!/\b(?:insert|update|delete)\s+(?:into\s+|from\s+)?jingeehas\.(?:assessments|assessment_answers|payments|entitlements|report_snapshots)\b/i.test(sealedMigration), "sealed analytics migration must not rewrite customer records");

  const sessionResult = await startSession(event("POST"));
  const cookie = credential(sessionResult.headers["set-cookie"]);
  const sessionId = body(sessionResult).sessionId;
  const analyticsContext = {
    visitorId: "10000000-0000-4000-8000-000000000001",
    sessionId: "20000000-0000-4000-8000-000000000002",
    deviceClass: "mobile",
    utmCampaign: "free-flow-contract"
  };

  const firstCreate = body(await create(event("POST", { prepaid: true, analyticsContext }, cookie)));
  const retryCreate = body(await create(event("POST", { analyticsContext }, cookie)));
  assert.equal(firstCreate.commercialFlowVersion, "free_assessment_postpaid_v1");
  assert.equal(firstCreate.status, "draft");
  assert.equal(retryCreate.assessmentId, firstCreate.assessmentId, "double create returns the same free assessment");
  assert.equal((await database.find("assessments", { sessionId })).length, 1);
  assert.equal((await database.find("payments", { assessmentId: firstCreate.assessmentId })).length, 0);
  assert.equal((await database.find("recovery_contacts", { assessmentId: firstCreate.assessmentId })).length, 0);

  const access = body(await questions(event("POST", { assessmentId: firstCreate.assessmentId, analyticsContext }, cookie)));
  assert.equal(access.status, "in_progress");
  assert.ok(access.startedAt);
  assert.equal(await nextRoute(database, await database.get("assessments", firstCreate.assessmentId)), "/assessment/questions");

  const saved = await save(event("PATCH", { assessmentId: firstCreate.assessmentId, answers: completeAnswers }, cookie));
  assert.equal(saved.statusCode, 200);
  const completed = body(await complete(event("POST", { assessmentId: firstCreate.assessmentId }, cookie)));
  assert.equal(completed.status, "complete");
  assert.equal(completed.nextRoute, "/assessment/result");
  assert.equal((await database.find("report_snapshots", { assessmentId: firstCreate.assessmentId })).length, 1);

  const paywallTracked = await analyticsCollect({
    httpMethod: "POST",
    headers: { cookie, host: "localhost", origin: "https://localhost", "user-agent": "Safari" },
    body: JSON.stringify({
      eventId: "30000000-0000-4000-8000-000000000003",
      eventName: "post_assessment_paywall_viewed",
      assessmentId: firstCreate.assessmentId,
      context: analyticsContext
    })
  });
  assert.equal(paywallTracked.statusCode, 202);

  const unpaidReport = body(await report(event("GET", null, cookie, { assessmentId: firstCreate.assessmentId })));
  assert.equal(unpaidReport.entitled, false);
  assert.equal(unpaidReport.fullReport, null);
  assert.deepEqual(unpaidReport.initialView, { schemaVersion: INITIAL_RESULT_SCHEMA_VERSION, mode: "sealed" });
  const initial = body(await initialResult(event("GET", null, cookie, { assessmentId: firstCreate.assessmentId })));
  assert.deepEqual(Object.keys(initial).sort(), ["currency", "mode", "price", "schemaVersion"].sort());
  assert.equal(initial.schemaVersion, INITIAL_RESULT_SCHEMA_VERSION);
  assert.equal(initial.mode, "sealed");
  assert.equal(initial.price, 9900);
  assert.equal(initial.currency, "MNT");
  const serializedInitial = JSON.stringify(initial);
  for (const forbidden of ["patternCount", "interactionCount", "primaryPattern", "lockedSections", "title", "summary", "Q-AGE", "S1-S04", "internalEvidenceMap", "threshold", "confidence", "recommendations", "fullReport", "providerPaymentId"]) {
    assert(!serializedInitial.includes(forbidden), `initial result leaked ${forbidden}`);
  }

  const [storedSnapshot] = await database.find("report_snapshots", { assessmentId: firstCreate.assessmentId });
  assert.deepEqual(storedSnapshot.initialView, { schemaVersion: INITIAL_RESULT_SCHEMA_VERSION, mode: "sealed" }, "new completion stores sealed initial view");
  const sealedInitialView = structuredClone(storedSnapshot.initialView);
  const legacyInitialView = {
    schemaVersion: "jingeehas-initial-result-v1",
    mode: "pattern",
    primaryPattern: { title: "SERVER ONLY LEGACY TITLE", summary: "SERVER ONLY LEGACY SUMMARY" },
    additionalPatternCount: 3,
    lockedSections: ["legacy"]
  };
  await database.update("report_snapshots", storedSnapshot.id, { initialView: structuredClone(legacyInitialView) });
  const legacyProjected = body(await initialResult(event("GET", null, cookie, { assessmentId: firstCreate.assessmentId })));
  assert.deepEqual(Object.keys(legacyProjected).sort(), ["currency", "mode", "price", "schemaVersion"].sort());
  assert.equal(legacyProjected.mode, "sealed");
  assert(!JSON.stringify(legacyProjected).includes("SERVER ONLY LEGACY"), "V1 title and summary never reach the client");
  assert.deepEqual((await database.get("report_snapshots", storedSnapshot.id)).initialView, legacyInitialView, "V1 projection performs no snapshot mutation");
  const countOnlyInitialView = {
    schemaVersion: "jingeehas-initial-result-v2-count-only",
    mode: "summary",
    patternCount: 4,
    interactionCount: 2,
    lockedSections: ["SERVER ONLY LOCKED TITLE"]
  };
  await database.update("report_snapshots", storedSnapshot.id, { initialView: structuredClone(countOnlyInitialView) });
  const countOnlyProjected = body(await initialResult(event("GET", null, cookie, { assessmentId: firstCreate.assessmentId })));
  assert.deepEqual(countOnlyProjected, { schemaVersion: INITIAL_RESULT_SCHEMA_VERSION, mode: "sealed", price: 9900, currency: "MNT" });
  assert.deepEqual((await database.get("report_snapshots", storedSnapshot.id)).initialView, countOnlyInitialView, "count-only projection performs no snapshot mutation");
  await database.update("report_snapshots", storedSnapshot.id, { initialView: sealedInitialView });

  const otherSession = await startSession(event("POST"));
  const otherCookie = credential(otherSession.headers["set-cookie"]);
  assert.equal((await initialResult(event("GET", null, otherCookie, { assessmentId: firstCreate.assessmentId }))).statusCode, 404);

  let providerCreates = 0;
  const provider = {
    async createInvoice(input) {
      providerCreates += 1;
      assert.equal(input.amount, 9900);
      return { invoiceId: "free-contract-invoice", qrText: "safe", urls: [] };
    },
    async checkPayment() {
      return { rows: [{ payment_id: "provider-free-contract", payment_status: "PAID", payment_amount: 9900 }] };
    }
  };
  const invoice = await createInvoice(database, provider, sessionId, {
    assessmentId: firstCreate.assessmentId,
    productCode: "CLIENT_OVERRIDE_IGNORED",
    amount: 1
  });
  assert.equal(invoice.status, "pending");
  assert.equal(invoice.amount, 9900);
  assert.equal(providerCreates, 1);
  assert.equal((await database.find("entitlements", { assessmentId: firstCreate.assessmentId })).length, 0);
  assert.equal(await nextRoute(database, await database.get("assessments", firstCreate.assessmentId)), "/assessment/payment");

  const emailFirst = body(await emailSave(event("POST", { assessmentId: firstCreate.assessmentId, email: "person@example.com" }, cookie)));
  const emailRetry = body(await emailSave(event("POST", { assessmentId: firstCreate.assessmentId, email: "person@example.com" }, cookie)));
  assert.equal(emailFirst.saved, true);
  assert.equal(emailRetry.saved, true);
  const contacts = await database.find("recovery_contacts", { assessmentId: firstCreate.assessmentId });
  assert.equal(contacts.length, 1);
  assert.notEqual(contacts[0].encryptedContact, "person@example.com");

  const paid = await checkPayment(database, provider, sessionId, { paymentId: invoice.paymentId });
  assert.equal(paid.status, "paid");
  assert.equal(paid.nextRoute, "/report");
  const paidAgain = await checkPayment(database, provider, sessionId, { paymentId: invoice.paymentId });
  assert.equal(paidAgain.status, "paid");
  assert.equal((await database.find("entitlements", { assessmentId: firstCreate.assessmentId, status: "active" })).length, 1);
  assert.equal(await nextRoute(database, await database.get("assessments", firstCreate.assessmentId)), "/report");
  const paidReport = await reportForSession(database, sessionId, firstCreate.assessmentId);
  assert.ok(paidReport.fullReport);
  assert.equal((await database.find("report_snapshots", { assessmentId: firstCreate.assessmentId })).length, 1, "payment reuses the immutable completion snapshot");

  const newSession = body(await startSession(event("POST")));
  const safety = await createAssessment(database, newSession.sessionId, { flowVersion: "free_assessment_postpaid_v1" });
  await saveAssessment(database, newSession.sessionId, { assessmentId: safety.id, answers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" } });
  const safetyCompleted = await completeAssessment(database, newSession.sessionId, { assessmentId: safety.id });
  assert.equal(safetyCompleted.safetyRoute, "urgent_self_harm");
  assert.equal(await nextRoute(database, safetyCompleted), "/report");
  await assert.rejects(() => createInvoice(database, provider, newSession.sessionId, { assessmentId: safety.id }), error => error.code === "assessment_incomplete");

  const prepaidSession = body(await startSession(event("POST")));
  const prepaid = await createAssessment(database, prepaidSession.sessionId, { prepaid: true });
  assert.equal(prepaid.commercialFlowVersion, "prepaid_v2");
  await assert.rejects(() => saveAssessment(database, prepaidSession.sessionId, { assessmentId: prepaid.id, answers: { "Q-AGE": 30 } }), error => error.code === "payment_required");
  const legacySession = body(await startSession(event("POST")));
  const legacy = await createAssessment(database, legacySession.sessionId, {});
  assert.equal(legacy.commercialFlowVersion, "legacy_postpaid_v1");

  const freeEvents = (await database.find("analytics_events", {})).filter(row => row.funnelKeyHash);
  assert.ok(freeEvents.some(row => row.eventName === "free_assessment_started"));
  assert.ok(freeEvents.some(row => row.eventName === "free_assessment_completed"));
  const paywallEvent = freeEvents.find(row => row.eventName === "post_assessment_paywall_viewed");
  assert.ok(paywallEvent);
  assert.equal(paywallEvent.deviceClass, "mobile");
  assert.equal(paywallEvent.utmCampaign, "free-flow-contract");
  assert.equal(paywallEvent.metadata.flowVersion, "free_assessment_postpaid_v1");
  assert.ok(!freeEvents.some(row => row.eventName === "initial_result_viewed"));
  assert.ok(freeEvents.some(row => row.eventName === "result_email_saved"));
  assert(freeEvents.every(row => !row.assessmentId && !row.invoiceId && !row.paymentId), "new funnel analytics stores no raw operational IDs");

  console.log("free assessment and sealed-paywall funnel contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
