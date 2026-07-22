"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { setDatabaseForTests } = require("../netlify/functions/_lib/store.js");
const { createRoleSession, ADMIN_SESSION } = require("../netlify/functions/_lib/auth.js");
const app = require("../app.js");

async function addAssessment(database, id, flow, createdAt, { startedAt = null, completedAt = null, status = "draft", excluded = false } = {}) {
  await database.insert("assessments", { id, sessionId: `session_${id}`, commercialFlowVersion: flow, createdAt, startedAt, completedAt, status, updatedAt: "2027-01-01T00:00:00.000Z" });
  if (excluded) await database.insert("analytics_events", { id: `excluded_${id}`, eventId: `excluded-event-${id}`, assessmentId: id, eventName: "assessment_started", occurredAt: createdAt, isAdmin: true, isOwnerPreview: false, isTest: false });
}
async function addPayment(database, assessmentId, id, createdAt, grantedAt, amount = 9900) {
  await database.insert("payments", { id, assessmentId, status: "paid", invoiceId: `INV-${id}`, amount, createdAt, paidAt: grantedAt });
  await database.insert("entitlements", { id: `ent-${id}`, assessmentId, paymentId: id, status: "active", grantedAt });
}
async function addEvent(database, id, eventName, occurredAt, { assessmentId = null, visitorIdHash = null, isTest = false } = {}) {
  await database.insert("analytics_events", { id, eventId: `event-${id}`, eventName, occurredAt, assessmentId, visitorIdHash, isAdmin: false, isOwnerPreview: false, isTest });
}

(async () => {
  const database = new MemoryDatabaseAdapter(); setDatabaseForTests(database);
  const dayStart = "2026-07-21T16:20:00.000Z";
  for (let index = 1; index <= 9; index += 1) await addAssessment(database, `legacy-${index}`, "legacy_postpaid_v1", `2026-07-21T17:0${index}:00.000Z`, { status: index <= 2 ? "complete" : "draft", completedAt: index <= 2 ? `2026-07-21T18:1${index}:00.000Z` : null });
  await addPayment(database, "legacy-1", "legacy-payment", "2026-07-21T18:00:00.000Z", "2026-07-21T18:01:00.000Z");

  for (let index = 1; index <= 4; index += 1) {
    const id = `prepaid-${index}`; const visitor = `visitor-${index}`;
    await addAssessment(database, id, "prepaid_v2", dayStart, { startedAt: index <= 3 ? `2026-07-21T2${index}:00:00.000Z` : null,
      status: index <= 2 ? "complete" : "paid_ready", completedAt: index <= 2 ? `2026-07-22T0${index}:00:00.000Z` : null });
    await addEvent(database, `landing-${index}`, "landing_viewed", `2026-07-21T16:${20 + index}:00.000Z`, { visitorIdHash: visitor });
    await addEvent(database, `section-${index}`, "paywall_viewed", `2026-07-21T17:0${index}:00.000Z`, { assessmentId: id, visitorIdHash: visitor });
    await addPayment(database, id, `payment-${index}`, `2026-07-21T18:0${index}:00.000Z`, `2026-07-21T19:0${index}:00.000Z`);
    if (index <= 2) await addEvent(database, `report-${index}`, "report_opened", `2026-07-22T0${index + 2}:00:00.000Z`, { assessmentId: id, visitorIdHash: visitor });
  }
  await addEvent(database, "pre-cutover-landing", "landing_viewed", "2026-07-21T16:05:00.000Z", { visitorIdHash: "pre-cutover-visitor" });
  await addAssessment(database, "synthetic", "prepaid_v2", dayStart, { startedAt: "2026-07-21T22:00:00.000Z", excluded: true });
  await addEvent(database, "synthetic-section", "paywall_viewed", "2026-07-21T17:50:00.000Z", { assessmentId: "synthetic", visitorIdHash: "synthetic-visitor", isTest: true });

  const aggregate = await database.getDailyFunnelAnalytics("2026-07-22", "2026-07-22");
  assert.equal(aggregate.currentFlow.assessmentsStarted, 3);
  assert.equal(aggregate.legacyFlow.assessmentsStarted, 9, "legacy start uses created_at even when updated_at is outside range");
  assert.equal(aggregate.currentFlow.paymentsConfirmed, 4); assert.equal(aggregate.legacyFlow.paymentsConfirmed, 1);
  assert.equal(aggregate.conversions.paymentToStart.entryCount, 4); assert.equal(aggregate.conversions.paymentToStart.convertedCount, 3);
  assert.equal(aggregate.conversions.paymentToStart.rate, 0.75, "four paid prepaid assessments and three starts is 75%");
  assert.equal(aggregate.coverage.flowState, "mixed");
  assert.equal(aggregate.coverage.allMeasuredVisitors, 5);
  assert.equal(aggregate.coverage.paidFirstEligibleVisitors, 4);
  assert.equal(aggregate.currentFlow.eligibleVisitors, 4, "the current funnel denominator remains the paid-first cohort");
  for (const metric of Object.values(aggregate.conversions)) {
    assert(metric.convertedCount <= metric.entryCount, "same-cohort conversion is bounded");
    if (metric.status === "available") assert(metric.rate >= 0 && metric.rate <= 1);
  }
  assert.equal(aggregate.allFlows.paymentsConfirmed, 5); assert.equal(aggregate.allFlows.revenueMnt, 49500, "financial truth includes both flows once");
  assert.equal(aggregate.days[0].assessmentsStarted, 3, "daily table is prepaid only");

  const legacyOnly = new MemoryDatabaseAdapter();
  for (let index = 0; index < 9; index += 1) await addAssessment(legacyOnly, `old-${index}`, "legacy_postpaid_v1", "2026-07-21T17:00:00.000Z");
  await addPayment(legacyOnly, "old-0", "old-payment", "2026-07-21T18:00:00.000Z", "2026-07-21T18:01:00.000Z");
  const historical = await legacyOnly.getDailyFunnelAnalytics("2026-07-22", "2026-07-22");
  assert.equal(historical.currentFlow.assessmentsStarted, 0); assert.equal(historical.legacyFlow.assessmentsStarted, 9);
  assert.equal(historical.conversions.paymentToStart.rate, null); assert.equal(historical.coverage.flowState, "legacy_only");

  const legacyWithVisitors = new MemoryDatabaseAdapter();
  await addAssessment(legacyWithVisitors, "old-with-visitor", "legacy_postpaid_v1", "2026-07-21T17:00:00.000Z");
  await addEvent(legacyWithVisitors, "new-visitor", "landing_viewed", "2026-07-21T17:10:00.000Z", { visitorIdHash: "new-visitor" });
  const legacyVisitorAggregate = await legacyWithVisitors.getDailyFunnelAnalytics("2026-07-22", "2026-07-22");
  assert.equal(legacyVisitorAggregate.coverage.flowState, "legacy_with_prepaid_visitors");
  assert.equal(legacyVisitorAggregate.coverage.prepaidAssessmentActivityPresent, false);
  assert.equal(legacyVisitorAggregate.coverage.prepaidVisitorActivityPresent, true);

  const visitorsOnly = new MemoryDatabaseAdapter();
  await addEvent(visitorsOnly, "visitor-only", "landing_viewed", "2026-07-21T17:10:00.000Z", { visitorIdHash: "visitor-only" });
  const visitorAggregate = await visitorsOnly.getDailyFunnelAnalytics("2026-07-22", "2026-07-22");
  assert.equal(visitorAggregate.coverage.flowState, "prepaid_visitors_only");

  const missing = new MemoryDatabaseAdapter();
  await addAssessment(missing, "missing-section", "prepaid_v2", dayStart);
  await addPayment(missing, "missing-section", "missing-payment", "2026-07-21T18:00:00.000Z", "2026-07-21T18:01:00.000Z");
  const noSection = await missing.getDailyFunnelAnalytics("2026-07-22", "2026-07-22");
  assert.equal(noSection.conversions.paymentSectionToInvoice.rate, null); assert.equal(noSection.conversions.paymentSectionToInvoice.status, "no_denominator");
  assert.equal(noSection.conversions.visitorToPaymentSection.status, "tracking_unavailable", "missing visitor linkage is not approximated");

  assert.equal(app.WEIGHT_TEST_COMING_SOON_MODE, false); assert.equal(app._test.conversionDisplay({ status: "no_denominator", rate: null }), '<span title="Сонгосон хугацаанд энэ шатны эхлэх бүртгэл байхгүй.">—</span>');
  assert.equal(app._test.formatAnalyticsDate("2026-07-18T16:00:00.000Z"), "2026.07.19");
  assert.equal(app._test.formatAnalyticsDateTime("2026-07-21T16:17:45.493Z"), "2026.07.22 00:17");
  for (const locale of ["en_US.UTF-8", "de_DE.UTF-8", "mn_MN.UTF-8"]) {
    const rendered = execFileSync(process.execPath, ["-e", "process.env.NODE_ENV='test'; const a=require('./app.js'); process.stdout.write(a._test.formatAnalyticsDateTime('2026-07-21T16:17:45.493Z'));"], { cwd: path.join(__dirname, ".."), env: { ...process.env, LANG: locale, LC_ALL: locale }, encoding: "utf8" });
    assert.equal(rendered, "2026.07.22 00:17", `analytics date is locale-independent under ${locale}`);
  }
  const coverageCopy = app._test.analyticsCoverageCopy({ visitorTrackingStartedAt: "2026-07-18T16:00:00.000Z", paidFirstCutoverAt: "2026-07-21T16:17:45.493Z" });
  assert.deepEqual(coverageCopy, [
    "Зочны ерөнхий хэмжилт 2026.07.19-өөс эхэлсэн. Үүнээс өмнөх зочны үзэлтийн мэдээлэл бүрэн биш байж болно.",
    "Төлбөр-эхэнд урсгал 2026.07.22-ны 00:17 цагаас эхэлсэн. Үндсэн funnel-ийн шинэ зочин нь энэ мөчөөс хойш анх орсон хэрэглэгчдийг харуулна."
  ]);
  assert.equal(app._test.analyticsFlowStateCopy(legacyVisitorAggregate.coverage, legacyVisitorAggregate.legacyFlow), "Сонгосон хугацаанд төлбөр-эхэнд урсгалын шинэ зочид бүртгэгдсэн боловч төлбөрийн хэсэгт хүрсэн шинэ тест хараахан байхгүй. Эхэлсэн 1 тест нь хуучин төлбөрийн урсгалд хамаарна.");
  assert.equal(app._test.analyticsFlowStateCopy(historical.coverage, historical.legacyFlow), "Сонгосон хугацааны тест болон зочны бүртгэлүүд хуучин төлбөрийн урсгалд хамаарна. Төлбөр-эхэнд урсгалын хөрвөлтийн хувь хараахан үүсээгүй.");
  assert.equal(app._test.analyticsFlowStateCopy(visitorAggregate.coverage, visitorAggregate.legacyFlow), "Төлбөр-эхэнд урсгалын шинэ зочид бүртгэгдсэн боловч дараагийн шатанд хүрсэн тест хараахан байхгүй.");
  app._test.setState({ admin: { ...app._test.getState().admin, authenticated: true, owner: true, analytics: { ...app._test.getState().admin.analytics,
    preset: "last7", startDate: "2026-07-22", endDate: "2026-07-22", days: aggregate.days, currentFlow: aggregate.currentFlow,
    priorCurrentFlow: null, legacyFlow: aggregate.legacyFlow, conversions: aggregate.conversions, coverage: aggregate.coverage, loading: false } } });
  const dashboard = app._test.renderAdminAnalytics();
  assert(dashboard.includes("Тест эхлүүлсэн хувь: 75.0%")); assert(!dashboard.includes("900.0%"));
  assert(dashboard.includes("Legacy тест эхлүүлсэн: 9")); assert(dashboard.includes("Legacy төлбөр: 1"));
  assert(dashboard.includes("Сонгосон хугацаанд хэмжигдсэн нийт зочин: 5"));
  assert(dashboard.includes("Төлбөр-эхэнд урсгалын шинэ зочин"));
  assert(dashboard.includes("Хуучин урсгалын бодит бүртгэл"));
  assert(dashboard.includes("Доорх хүснэгт төлбөр-эхэнд урсгалын үзүүлэлтийг өдрөөр харуулна."));
  assert(dashboard.includes("Сонгосон хугацаанд хуучин болон төлбөр-эхэнд урсгалын бүртгэл хоёулаа байна. Урсгал хоорондын тоог хольж хувь тооцоогүй."));
  const headers = ["Огноо", "Шинэ зочин", "Төлбөрийн хэсэг", "Хүрсэн хувь", "Нэхэмжлэл", "Нэхэмжлэл үүсгэсэн хувь", "Төлбөр", "Төлбөр төлсөн хувь", "Тест эхлүүлсэн", "Тест эхлүүлсэн хувь", "Тест дуусгасан", "Дуусгасан хувь", "Тайлан нээсэн", "Тайлан нээсэн хувь", "Орлого"];
  let offset = -1; for (const header of headers) { const next = dashboard.indexOf(`<th>${header}</th>`); assert(next > offset, `daily header order: ${header}`); offset = next; }
  assert(!/(NaN|Infinity|null|undefined|legacy_postpaid_v1|prepaid_v2)/.test(dashboard));

  const trackingDatabase = new MemoryDatabaseAdapter(); setDatabaseForTests(trackingDatabase);
  const collect = require("../netlify/functions/analytics-collect.js").handler;
  const browserContext = { visitorId: "11111111-1111-4111-8111-111111111111", sessionId: "22222222-2222-4222-8222-222222222222", deviceClass: "mobile" };
  const collectEvent = (eventName, eventId, assessmentId) => collect({ httpMethod: "POST", headers: { origin: "http://localhost:4178", host: "localhost:4178", "user-agent": "Safari" }, body: JSON.stringify({ eventName, eventId, assessmentId, context: browserContext }) });
  assert.equal((await collectEvent("landing_viewed", "33333333-3333-4333-8333-333333333333")).statusCode, 202);
  assert.equal((await collectEvent("landing_viewed", "44444444-4444-4444-8444-444444444444")).statusCode, 202);
  assert.equal((await collectEvent("payment_preparation_viewed", "77777777-7777-4777-8777-777777777777")).statusCode, 202);
  assert.equal((await collectEvent("payment_preparation_viewed", "88888888-8888-4888-8888-888888888888")).statusCode, 202);
  assert.equal((await collectEvent("paywall_viewed", "55555555-5555-4555-8555-555555555555", "track-assessment")).statusCode, 202);
  assert.equal((await collectEvent("paywall_viewed", "66666666-6666-4666-8666-666666666666", "track-assessment")).statusCode, 202);
  const tracked = await trackingDatabase.find("analytics_events", {});
  assert.equal(tracked.filter(row => row.eventName === "landing_viewed").length, 1, "landing refresh remains idempotent per visitor and day");
  assert.equal(tracked.filter(row => row.eventName === "payment_preparation_viewed").length, 1, "payment preparation render is idempotent per public session");
  assert.equal(tracked.filter(row => row.eventName === "paywall_viewed").length, 1, "payment preparation refresh remains idempotent per assessment");
  assert.equal((await trackingDatabase.find("payments", {})).length, 0, "payment-section tracking requires no QPay invoice");
  setDatabaseForTests(database);

  await database.insert("admin_accounts", { id: "admin-owner", status: "active", isOwner: true });
  const session = await createRoleSession(database, { ...ADMIN_SESSION, ownerId: "admin-owner" });
  const endpoint = require("../netlify/functions/admin-analytics-daily.js").handler;
  const unauthorized = await endpoint({ httpMethod: "GET", headers: {}, queryStringParameters: { startDate: "2026-07-22", endDate: "2026-07-22" } });
  assert.equal(unauthorized.statusCode, 401);
  const response = await endpoint({ httpMethod: "GET", headers: { cookie: session.cookie.split(";")[0] }, queryStringParameters: { startDate: "2026-07-22", endDate: "2026-07-22" } });
  assert.equal(response.statusCode, 200); const body = JSON.parse(response.body);
  assert.equal(body.coverage.flowState, "mixed"); assert.equal(body.currentFlow.assessmentsStarted, 3); assert.equal(body.legacyFlow.assessmentsStarted, 9);
  assert.equal(body.coverage.allMeasuredVisitors, 5); assert.equal(body.coverage.paidFirstEligibleVisitors, 4);
  const responseKeys = []; const collectKeys = value => { if (!value || typeof value !== "object") return; for (const [key, item] of Object.entries(value)) { responseKeys.push(key); collectKeys(item); } }; collectKeys(body);
  for (const forbidden of ["name", "email", "phone", "assessmentId", "sessionId", "visitorIdHash", "rawEvents", "answers", "reports", "paymentId"]) assert(!responseKeys.includes(forbidden), `aggregate API excludes ${forbidden}`);

  const source = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
  assert(!source.includes("Math.min(100"), "rates are not clamped");
  assert(!source.includes("rate(total.assessmentsStarted, total.paymentsConfirmed)"), "frontend does not recompute payment-to-start from totals");
  assert(!source.includes("rate(day.paywallViews, day.assessmentsCompleted)"), "daily table does not divide paywall by completed");
  const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260722041203_repair_flow_aware_funnel_cohort_analytics.sql"), "utf8");
  for (const expected of ["2026-07-21T16:17:45.493Z", "commercial_flow_version = 'prepaid_v2'", "a.started_at >= e.granted_at", "revoke all on function", "Asia/Ulaanbaatar"]) assert(migration.includes(expected), expected);
  assert(!migration.includes("updated_at"), "flow presence never uses updated_at");
  const clarityMigration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260722075053_clarify_funnel_visitor_coverage.sql"), "utf8");
  for (const expected of ["all_measured_visitors", "paid_first_eligible_visitors", "prepaid_assessment_activity_present", "prepaid_visitor_activity_present", "legacy_with_prepaid_visitors", "revoke all on function"]) assert(clarityMigration.includes(expected), expected);
  const preparationMigration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260722081512_allow_payment_preparation_analytics_event.sql"), "utf8");
  for (const expected of ["analytics_events_event_name_check", "payment_preparation_viewed", "schema_migrations"]) assert(preparationMigration.includes(expected), expected);
  console.log("flow-aware daily funnel analytics tests passed");
})().catch(error => { console.error(error); process.exit(1); });
