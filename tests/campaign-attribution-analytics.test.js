"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { setDatabaseForTests } = require("../netlify/functions/_lib/store.js");
const { assessmentContext } = require("../netlify/functions/_lib/analytics.js");
const { createRoleSession, ADMIN_SESSION } = require("../netlify/functions/_lib/auth.js");
const app = require("../app.js");

const META = { utmSource: "meta", utmMedium: "paid_social", utmCampaign: "jingeehas_traffic_lpv_reel_v1",
  utmContent: "paid_cut_v1_lpv", utmTerm: "broad_25plus" };
const LATER = { utmSource: "meta", utmMedium: "paid_social", utmCampaign: "later_campaign",
  utmContent: "later_content", utmTerm: "later_term" };
const funnel = "a".repeat(64); const unattributedFunnel = "b".repeat(64); const ownerFunnel = "c".repeat(64);

async function event(database, id, eventName, occurredAt, extra = {}) {
  await database.insert("analytics_events", { id, eventId: `event-${id}`, eventName, occurredAt, createdAt: occurredAt,
    isAdmin: false, isOwnerPreview: false, isTest: false, ...extra });
}

(async () => {
  const previousWindow = global.window; const previousDocument = global.document;
  let cookie = "";
  global.document = { referrer: "https://facebook.com/reel/1", get cookie() { return cookie; }, set cookie(value) { cookie = value.split(";")[0]; } };
  global.window = { location: { search: "?utm_source=meta&utm_medium=paid_social&utm_campaign=campaign_a&utm_content=creative_a&utm_term=broad" }, innerWidth: 390 };
  const acquired = app._test.analyticsIdentity(1000);
  assert.equal(acquired.utmCampaign, "campaign_a", "Meta UTM landing binds campaign acquisition");
  global.window.location.search = "?utm_source=meta&utm_medium=paid_social&utm_campaign=campaign_b&utm_content=creative_b";
  assert.equal(app._test.analyticsIdentity(2000).utmCampaign, "campaign_a", "later paid UTM does not overwrite session acquisition");
  global.window.location.search = "";
  assert.equal(app._test.analyticsIdentity(3000).utmCampaign, "campaign_a", "later direct navigation does not erase acquisition");
  const newDirectSession = app._test.analyticsIdentity(31 * 60 * 1000);
  assert.equal(newDirectSession.utmCampaign, undefined); assert.equal(newDirectSession.referrerHost, "facebook.com", "unattributed referrer remains bounded and readable");
  global.window = previousWindow; global.document = previousDocument;

  const database = new MemoryDatabaseAdapter(); setDatabaseForTests(database);
  await event(database, "landing-meta", "landing_viewed", "2026-08-05T01:00:00.000Z", { visitorIdHash: "visitor-meta", ...META });
  const funnelStages = [
    ["start", "free_assessment_started", "2026-08-05T01:05:00.000Z"],
    ["complete", "free_assessment_completed", "2026-08-05T01:10:00.000Z"],
    ["paywall", "post_assessment_paywall_viewed", "2026-08-05T01:11:00.000Z"],
    ["cta", "full_report_cta_clicked", "2026-08-05T01:12:00.000Z"],
    ["invoice", "invoice_created", "2026-08-05T01:13:00.000Z"],
    ["payment", "payment_confirmed", "2026-08-05T01:14:00.000Z"],
    ["report", "full_report_opened", "2026-08-05T01:15:00.000Z"]
  ];
  for (const [id, name, time] of funnelStages) await event(database, id, name, time, { funnelKeyHash: funnel,
    visitorIdHash: "visitor-meta", ...(name === "free_assessment_started" ? META : LATER), ...(name === "payment_confirmed" ? { amountMnt: 9900 } : {}) });
  await event(database, "landing-direct", "landing_viewed", "2026-08-05T02:00:00.000Z", { visitorIdHash: "visitor-direct" });
  await event(database, "start-direct", "free_assessment_started", "2026-08-05T02:05:00.000Z", { funnelKeyHash: unattributedFunnel, visitorIdHash: "visitor-direct" });
  await event(database, "owner-start", "free_assessment_started", "2026-08-05T03:00:00.000Z", { funnelKeyHash: ownerFunnel, visitorIdHash: "visitor-owner", isOwnerPreview: true, ...META });
  await event(database, "owner-payment", "payment_confirmed", "2026-08-05T03:05:00.000Z", { funnelKeyHash: ownerFunnel, amountMnt: 9900, isOwnerPreview: true, ...META });

  const context = await assessmentContext(database, "unused-assessment");
  assert.deepEqual(context, {}, "unknown historical assessment remains readable without fabricated attribution");
  const aggregate = await database.getDailyFunnelAnalytics("2026-08-05", "2026-08-05");
  const meta = aggregate.campaignAttribution.rows.find(row => row.utmCampaign === META.utmCampaign);
  const direct = aggregate.campaignAttribution.rows.find(row => row.unattributed);
  assert.deepEqual({ visitors: meta.visitors, starts: meta.assessmentsStarted, complete: meta.assessmentsCompleted,
    paywall: meta.paywallViews, cta: meta.fullReportCtaClicks, invoice: meta.invoicesCreated, payment: meta.paymentsConfirmed,
    report: meta.reportsOpened, revenue: meta.revenueMnt }, { visitors: 1, starts: 1, complete: 1, paywall: 1, cta: 1,
    invoice: 1, payment: 1, report: 1, revenue: 9900 }, "all stages preserve the acquisition campaign");
  assert.equal(aggregate.campaignAttribution.rows.some(row => row.utmCampaign === LATER.utmCampaign), false, "later event UTM cannot overwrite assessment acquisition");
  assert.equal(direct.visitors, 1); assert.equal(direct.assessmentsStarted, 1, "unattributed traffic remains separate");
  assert.deepEqual(aggregate.campaignAttribution.excluded, { eventCount: 2, paymentCount: 1, revenueMnt: 9900 }, "owner/test payment and revenue are diagnostic-only");
  assert.equal(aggregate.currentFlow.paymentsConfirmed, 1); assert.equal(aggregate.currentFlow.revenueMnt, 9900, "all-site real totals remain unchanged and exclude owner funnel");

  await database.insert("admin_accounts", { id: "owner", status: "active", isOwner: true });
  const session = await createRoleSession(database, { ...ADMIN_SESSION, ownerId: "owner" });
  const endpoint = require("../netlify/functions/admin-analytics-daily.js").handler;
  const response = await endpoint({ httpMethod: "GET", headers: { cookie: session.cookie.split(";")[0] }, queryStringParameters: { startDate: "2026-08-05", endDate: "2026-08-05" } });
  assert.equal(response.statusCode, 200); const body = JSON.parse(response.body);
  assert.equal(body.campaignAttribution.rows[0].utmSource, "meta");
  const keys = []; const collectKeys = value => { if (!value || typeof value !== "object") return; for (const [key, item] of Object.entries(value)) { keys.push(key); collectKeys(item); } };
  collectKeys(body.campaignAttribution);
  for (const forbidden of ["answers", "report", "reports", "score", "email", "assessmentId", "visitorIdHash", "sessionIdHash", "paymentId"]) assert(!keys.includes(forbidden), `attribution output excludes ${forbidden}`);

  const html = app._test.renderCampaignAttribution(body.campaignAttribution);
  for (const label of ["Campaign attribution", "Unattributed", "Зочин", "Тест эхлүүлсэн", "Тест дуусгасан", "Тайлан бэлэн дэлгэц", "Бүрэн тайлан нээх товч", "Нэхэмжлэл", "Төлбөр", "Бүрэн тайлан нээсэн", "Бодит орлого", "Visitor → Start", "Landing → Payment", "Owner / test traffic excluded"]) assert(html.includes(label), label);
  assert(html.includes('scope="row"')); assert(html.includes('role="region"')); assert(!html.includes("later_campaign"));

  const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260805030025_add_campaign_attribution_analytics.sql"), "utf8");
  for (const expected of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "post_assessment_paywall_viewed", "excluded_funnels", "get_daily_funnel_analytics_v2", "revoke all on function"]) assert(migration.includes(expected), expected);
  assert(!migration.includes("assessment_answers")); assert(!migration.includes("report_snapshots"));
  console.log("campaign attribution analytics tests passed");
})().catch(error => { console.error(error); process.exit(1); });
