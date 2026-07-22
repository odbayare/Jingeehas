"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
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
  await addAssessment(database, "synthetic", "prepaid_v2", dayStart, { startedAt: "2026-07-21T22:00:00.000Z", excluded: true });
  await addEvent(database, "synthetic-section", "paywall_viewed", "2026-07-21T17:50:00.000Z", { assessmentId: "synthetic", visitorIdHash: "synthetic-visitor", isTest: true });

  const aggregate = await database.getDailyFunnelAnalytics("2026-07-22", "2026-07-22");
  assert.equal(aggregate.currentFlow.assessmentsStarted, 3);
  assert.equal(aggregate.legacyFlow.assessmentsStarted, 9, "legacy start uses created_at even when updated_at is outside range");
  assert.equal(aggregate.currentFlow.paymentsConfirmed, 4); assert.equal(aggregate.legacyFlow.paymentsConfirmed, 1);
  assert.equal(aggregate.conversions.paymentToStart.entryCount, 4); assert.equal(aggregate.conversions.paymentToStart.convertedCount, 3);
  assert.equal(aggregate.conversions.paymentToStart.rate, 0.75, "four paid prepaid assessments and three starts is 75%");
  assert.equal(aggregate.coverage.flowState, "mixed");
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

  const missing = new MemoryDatabaseAdapter();
  await addAssessment(missing, "missing-section", "prepaid_v2", dayStart);
  await addPayment(missing, "missing-section", "missing-payment", "2026-07-21T18:00:00.000Z", "2026-07-21T18:01:00.000Z");
  const noSection = await missing.getDailyFunnelAnalytics("2026-07-22", "2026-07-22");
  assert.equal(noSection.conversions.paymentSectionToInvoice.rate, null); assert.equal(noSection.conversions.paymentSectionToInvoice.status, "no_denominator");
  assert.equal(noSection.conversions.visitorToPaymentSection.status, "tracking_unavailable", "missing visitor linkage is not approximated");

  assert.equal(app.WEIGHT_TEST_COMING_SOON_MODE, false); assert.equal(app._test.conversionDisplay({ status: "no_denominator", rate: null }), '<span title="Сонгосон хугацаанд энэ шатны эхлэх бүртгэл байхгүй.">—</span>');
  app._test.setState({ admin: { ...app._test.getState().admin, authenticated: true, owner: true, analytics: { ...app._test.getState().admin.analytics,
    preset: "last7", startDate: "2026-07-22", endDate: "2026-07-22", days: aggregate.days, currentFlow: aggregate.currentFlow,
    priorCurrentFlow: null, legacyFlow: aggregate.legacyFlow, conversions: aggregate.conversions, coverage: aggregate.coverage, loading: false } } });
  const dashboard = app._test.renderAdminAnalytics();
  assert(dashboard.includes("Тест эхлүүлсэн хувь: 75.0%")); assert(!dashboard.includes("900.0%"));
  assert(dashboard.includes("Legacy тест эхлүүлсэн: 9")); assert(dashboard.includes("Legacy төлбөр: 1"));
  assert(dashboard.includes("Сонгосон хугацаанд хуучин болон төлбөр-эхэнд урсгалын бүртгэл хоёулаа байна. Урсгал хоорондын тоог хольж хувь тооцоогүй."));
  const headers = ["Огноо", "Зочин", "Төлбөрийн хэсэг", "Хүрсэн хувь", "Нэхэмжлэл", "Нэхэмжлэл үүсгэсэн хувь", "Төлбөр", "Төлбөр төлсөн хувь", "Тест эхлүүлсэн", "Тест эхлүүлсэн хувь", "Тест дуусгасан", "Дуусгасан хувь", "Тайлан нээсэн", "Тайлан нээсэн хувь", "Орлого"];
  let offset = -1; for (const header of headers) { const next = dashboard.indexOf(`<th>${header}</th>`); assert(next > offset, `daily header order: ${header}`); offset = next; }
  assert(!/(NaN|Infinity|null|undefined|legacy_postpaid_v1|prepaid_v2)/.test(dashboard));

  await database.insert("admin_accounts", { id: "admin-owner", status: "active", isOwner: true });
  const session = await createRoleSession(database, { ...ADMIN_SESSION, ownerId: "admin-owner" });
  const endpoint = require("../netlify/functions/admin-analytics-daily.js").handler;
  const response = await endpoint({ httpMethod: "GET", headers: { cookie: session.cookie.split(";")[0] }, queryStringParameters: { startDate: "2026-07-22", endDate: "2026-07-22" } });
  assert.equal(response.statusCode, 200); const body = JSON.parse(response.body);
  assert.equal(body.coverage.flowState, "mixed"); assert.equal(body.currentFlow.assessmentsStarted, 3); assert.equal(body.legacyFlow.assessmentsStarted, 9);

  const source = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
  assert(!source.includes("Math.min(100"), "rates are not clamped");
  assert(!source.includes("rate(total.assessmentsStarted, total.paymentsConfirmed)"), "frontend does not recompute payment-to-start from totals");
  assert(!source.includes("rate(day.paywallViews, day.assessmentsCompleted)"), "daily table does not divide paywall by completed");
  const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260722041203_repair_flow_aware_funnel_cohort_analytics.sql"), "utf8");
  for (const expected of ["2026-07-21T16:17:45.493Z", "commercial_flow_version = 'prepaid_v2'", "a.started_at >= e.granted_at", "revoke all on function", "Asia/Ulaanbaatar"]) assert(migration.includes(expected), expected);
  assert(!migration.includes("updated_at"), "flow presence never uses updated_at");
  console.log("flow-aware daily funnel analytics tests passed");
})().catch(error => { console.error(error); process.exit(1); });
