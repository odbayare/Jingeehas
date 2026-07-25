"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const migrationDir = path.join(root, "supabase", "migrations");
const migration = fs.readFileSync(path.join(migrationDir, "20260725153009_admin_paid_first_funnel_analytics.sql"), "utf8");
const gateway = fs.readFileSync(path.join(root, "supabase/functions/jingeehas-database-gateway/index.ts"), "utf8");
const endpoint = fs.readFileSync(path.join(root, "netlify/functions/admin-analytics-daily.js"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

for (const field of ["cta_sessions", "preparation_sessions", "cta_to_preparation_sessions", "direct_preparation_sessions", "expired_unpaid_invoices", "revenue_mnt"]) assert(migration.includes(field), field);
assert.match(migration, /session_id_hash/);
assert.match(migration, /not e\.is_admin and not e\.is_owner_preview and not e\.is_test/);
assert.match(gateway, /get_admin_paid_first_funnel_analytics/);
assert.match(endpoint, /getAdminPaidFirstFunnelAnalytics/);
assert.match(app, /Шууд төлбөрийн бэлтгэлд орсон/);
assert.match(app, /Төлбөр-эхэнд урсгалын бодит төлөв/);
assert.match(app, /data-action="toggle-admin-hourly"/);
assert.match(app, /slice\(-24\)\.reverse\(\)/);
assert(!app.includes("QPay төлбөрийн дэлгэц"), "obsolete QPay dashboard label is removed from the compact dashboard");
assert(!fs.existsSync(path.join(migrationDir, "20260722075053_clarify_funnel_visitor_coverage.sql")));
assert(!fs.existsSync(path.join(migrationDir, "20260722081512_allow_payment_preparation_analytics_event.sql")));

const cutover = Date.parse("2026-07-21T16:17:45.493Z");
const events = [
  { visitor: "old", session: "old-s", name: "landing_viewed", at: cutover - 1000 },
  { visitor: "old", session: "new-s", name: "landing_viewed", at: cutover + 1000 },
  { visitor: "new", session: "cta-s", name: "landing_viewed", at: cutover + 2000 },
  { visitor: "new", session: "cta-s", name: "landing_cta_clicked", at: cutover + 3000 },
  { visitor: "direct", session: "direct-s", name: "payment_preparation_viewed", at: cutover + 4000 },
  { visitor: "new", session: "cta-s", name: "payment_preparation_viewed", at: cutover + 5000 }
];
const firstLanding = new Map(); for (const event of events.filter(item => item.name === "landing_viewed")) firstLanding.set(event.visitor, Math.min(firstLanding.get(event.visitor) ?? Infinity, event.at));
const eligible = [...firstLanding.values()].filter(at => at >= cutover).length;
const cta = new Set(events.filter(item => item.name === "landing_cta_clicked" && item.at >= cutover).map(item => item.session));
const preparation = new Set(events.filter(item => item.name === "payment_preparation_viewed" && item.at >= cutover).map(item => item.session));
assert.equal(eligible, 1, "pre-cutover first landing is excluded even when the visitor returns");
assert.equal([...cta].filter(id => preparation.has(id)).length, 1, "CTA/preparation intersection ignores delivery order");
assert.equal([...preparation].filter(id => !cta.has(id)).length, 1, "direct preparation remains separate");
for (const text of ["commercial_flow_version = 'prepaid_v2'", "p.status = 'paid'", "e.status = 'active'"]) assert(migration.includes(text) || fs.readFileSync(path.join(migrationDir, "20260725155251_correct_paid_first_cohort.sql"), "utf8").includes(text));
console.log("admin funnel migration reconciliation tests passed");
