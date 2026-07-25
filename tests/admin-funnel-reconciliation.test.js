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
assert.match(app, /data-action="toggle-admin-hourly"/);
assert.match(app, /slice\(-24\)\.reverse\(\)/);
assert(!app.includes("QPay төлбөрийн дэлгэц"), "obsolete QPay dashboard label is removed from the compact dashboard");
assert(!fs.existsSync(path.join(migrationDir, "20260722075053_clarify_funnel_visitor_coverage.sql")));
assert(!fs.existsSync(path.join(migrationDir, "20260722081512_allow_payment_preparation_analytics_event.sql")));
console.log("admin funnel migration reconciliation tests passed");
