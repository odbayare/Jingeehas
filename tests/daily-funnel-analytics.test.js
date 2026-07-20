"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { setDatabaseForTests } = require("../netlify/functions/_lib/store.js");
const { UUID, hashAnonymous, clientContext, eventRow, recordEvent, browserOriginAllowed, isKnownBotRequest,
  browserEventIdempotencyKey, flagsFromEvent } = require("../netlify/functions/_lib/analytics.js");
const app = require("../app.js");

(async () => {
  const database = new MemoryDatabaseAdapter(); setDatabaseForTests(database);
  const visitorId = "11111111-1111-4111-8111-111111111111";
  const sessionId = "22222222-2222-4222-8222-222222222222";
  const context = clientContext({ visitorId, sessionId, utmSource: "meta", utmCampaign: "launch", referrer: "https://facebook.com/path", deviceClass: "mobile" });
  assert.equal(context.visitorIdHash, hashAnonymous("visitor", visitorId));
  assert.notEqual(context.visitorIdHash, visitorId);
  assert.equal(context.referrerHost, "facebook.com");
  assert(!JSON.stringify(context).includes("/path"));

  const first = eventRow("landing_viewed", context, {}, { eventId: "33333333-3333-4333-8333-333333333333", now: new Date("2026-07-19T16:30:00Z") });
  assert(UUID.test(first.id)); assert.equal(first.occurredAt, "2026-07-19T16:30:00.000Z");
  const landingKey = browserEventIdempotencyKey("landing_viewed", context, null, new Date(first.occurredAt));
  await recordEvent(database, "landing_viewed", context, {}, { eventId: first.eventId, idempotencyKey: landingKey, now: new Date(first.occurredAt) });
  assert.equal(await recordEvent(database, "landing_viewed", context, {}, { eventId: first.eventId }), null, "event_id retry is idempotent");
  assert.equal(await recordEvent(database, "landing_viewed", context, {}, { eventId: crypto.randomUUID(), idempotencyKey: landingKey }), null, "same visitor/day landing refresh is idempotent");
  const priorContext = clientContext({ visitorId: "44444444-4444-4444-8444-444444444444", sessionId: "55555555-5555-4555-8555-555555555555" });
  await recordEvent(database, "landing_viewed", priorContext, {}, { now: new Date("2026-07-19T15:59:59.999Z") });
  await recordEvent(database, "landing_viewed", context, {}, { now: new Date("2026-07-19T15:59:58.999Z") });
  await recordEvent(database, "assessment_started", context, { assessmentId: "wa_test" }, { idempotencyKey: "assessment_started:wa_test", now: new Date("2026-07-19T16:31:00Z") });
  await recordEvent(database, "assessment_completed", context, { assessmentId: "wa_test" }, { idempotencyKey: "assessment_completed:wa_test", now: new Date("2026-07-19T16:32:00Z") });
  await recordEvent(database, "paywall_viewed", context, { assessmentId: "wa_test" }, { idempotencyKey: "paywall_viewed:wa_test", now: new Date("2026-07-19T16:33:00Z") });
  assert.equal(await recordEvent(database, "paywall_viewed", context, { assessmentId: "wa_test" }, { idempotencyKey: "paywall_viewed:wa_test", now: new Date("2026-07-19T16:34:00Z") }), null, "payment section refresh is idempotent");
  await recordEvent(database, "invoice_created", context, { assessmentId: "wa_test", invoiceId: "INV-1", paymentId: "wp_test", amountMnt: 9900 }, { idempotencyKey: "invoice_created:INV-1", now: new Date("2026-07-19T16:34:00Z") });
  await recordEvent(database, "payment_confirmed", context, { assessmentId: "wa_test", invoiceId: "INV-1", paymentId: "wp_test", amountMnt: 9900 }, { idempotencyKey: "payment_confirmed:wp_test", now: new Date("2026-07-19T16:35:00Z") });
  await recordEvent(database, "payment_confirmed", context, { assessmentId: "wa_forged", invoiceId: "INV-FORGED", paymentId: "wp_forged", amountMnt: 9900 }, { now: new Date("2026-07-19T16:35:30Z") });
  await recordEvent(database, "landing_viewed", context, {}, { isAdmin: true, now: new Date("2026-07-19T16:36:00Z") });
  await database.insert("assessments", { id: "wa_test", sessionId: "ws_test", status: "complete", createdAt: "2026-07-19T16:31:00.000Z", completedAt: "2026-07-19T16:32:00.000Z" });
  await database.insert("payments", { id: "wp_test", assessmentId: "wa_test", status: "paid", invoiceId: "INV-1", amount: 9900, createdAt: "2026-07-19T16:34:00.000Z", paidAt: "2026-07-19T16:35:00.000Z" });
  await database.insert("entitlements", { id: "we_test", assessmentId: "wa_test", paymentId: "wp_test", status: "active", grantedAt: "2026-07-19T16:35:00.000Z" });
  const aggregate = await database.getDailyFunnelAnalytics("2026-07-20", "2026-07-20"); const days = aggregate.days;
  assert.deepEqual(days[0], { date: "2026-07-20", uniqueVisitors: 1, landingViews: 1, assessmentsStarted: 1, assessmentsCompleted: 1,
    paywallViews: 1, invoicesCreated: 1, paymentsConfirmed: 1, revenueMnt: 9900 });
  const boundaryAggregate = await database.getDailyFunnelAnalytics("2026-07-19", "2026-07-20");
  assert.deepEqual(boundaryAggregate.days.map(row => [row.date, row.uniqueVisitors]), [["2026-07-19", 2], ["2026-07-20", 1]], "UTC timestamps group on Ulaanbaatar midnight");
  assert.equal(boundaryAggregate.summary.uniqueVisitors, 2, "range visitors are distinct across days rather than summed daily uniques");

  assert.equal(browserOriginAllowed({ headers: { origin: "https://jingeehas.fit", host: "jingeehas.fit" } }), true);
  assert.equal(browserOriginAllowed({ headers: { origin: "https://evil.example", host: "jingeehas.fit" } }), false);
  assert.equal(isKnownBotRequest({ httpMethod: "POST", headers: { "user-agent": "facebookexternalhit/1.1" } }), true);
  assert.equal(isKnownBotRequest({ httpMethod: "POST", headers: { "user-agent": "Mozilla/5.0 [FBAN/FB4A;FBAV/500.0]" } }), false, "Facebook in-app users are not link-preview bots");
  assert.equal(isKnownBotRequest({ httpMethod: "HEAD", headers: {} }), true);
  assert.equal(flagsFromEvent({ headers: { host: "jingeehas.fit", cookie: "jingeehas_advisor=active" } }).isAdmin, true, "advisor traffic is excluded from public visitors");
  assert.equal(flagsFromEvent({ httpMethod: "POST", headers: { host: "jingeehas.fit", "user-agent": "Playwright/1.0" } }).isTest, true, "automated production checks are excluded from business metrics");
  const collect = require("../netlify/functions/analytics-collect.js").handler;
  const invalid = await collect({ httpMethod: "POST", headers: { origin: "https://evil.example", host: "jingeehas.fit" }, body: JSON.stringify({}) });
  assert.equal(invalid.statusCode, 403);
  const rejectedName = await collect({ httpMethod: "POST", headers: { origin: "https://jingeehas.fit", host: "jingeehas.fit" }, body: JSON.stringify({ eventId: crypto.randomUUID(), eventName: "payment_confirmed", context: { visitorId, sessionId } }) });
  assert.equal(rejectedName.statusCode, 400, "browser cannot forge server-authoritative payment event");

  assert.equal(app.WEIGHT_TEST_COMING_SOON_MODE, false);
  assert.equal(app._test.rate(1, 0), "—");
  assert.deepEqual(app._test.analyticsRange("last7", new Date("2026-07-19T04:00:00Z")), { startDate: "2026-07-13", endDate: "2026-07-19" });
  app._test.setState({ admin: { ...app._test.getState().admin, authenticated: true, owner: true,
    analytics: { preset: "last7", startDate: "2026-07-14", endDate: "2026-07-20", days, priorDays: [], summary: aggregate.summary, priorSummary: null, coverage: aggregate.coverage, loading: false, error: "" } } });
  const dashboard = app._test.renderAdminAnalytics();
  for (const label of ["Өдөр тутмын үзүүлэлт", "Цагийн бүс: Улаанбаатар", "Зочилсон хүн", "Тест эхлүүлсэн", "Тест дуусгасан", "Төлбөрийн хэсэг үзсэн", "Нэхэмжлэл үүсгэсэн", "Төлбөр төлсөн", "Орлого", "Өдөр тутмын зочны тоо нь тухайн өдрийн давтагдаагүй зочдыг харуулна."]) assert(dashboard.includes(label), label);
  assert(!dashboard.includes("Paywall"));
  assert.equal((dashboard.match(/Сонгосон хугацааг өмнөх ижил хугацаатай харьцуулах боломжгүй байна\./g) || []).length, 1);
  assert.equal((dashboard.match(/Өмнөх хугацаатай харьцуулах боломжгүй/g) || []).length, 0);
  assert.equal(app._test.comparison(2, 0), "—");

  const source = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
  assert(!source.includes("localStorage"), "analytics does not use persistent localStorage tracking");
  const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260719090000_add_daily_funnel_analytics.sql"), "utf8");
  for (const rule of ["enable row level security", "revoke all on table jingeehas.analytics_events from public, anon, authenticated", "Asia/Ulaanbaatar", "analytics_events_idempotency_uidx"]) assert(migration.includes(rule), rule);
  for (const prohibited of ["email", "phone", "raw_answer", "user_agent"]) assert(!/create table jingeehas\.analytics_events[\s\S]*?\);/.exec(migration)[0].includes(prohibited), prohibited);
  const repair = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260720073844_repair_daily_funnel_source_of_truth.sql"), "utf8");
  for (const canonical of ["from jingeehas.assessments", "from jingeehas.payments", "join jingeehas.payments", "Asia/Ulaanbaatar", "payment_section_tracking_started_at"]) assert(repair.includes(canonical), canonical);
  console.log("daily funnel analytics tests passed");
})().catch(error => { console.error(error); process.exit(1); });
