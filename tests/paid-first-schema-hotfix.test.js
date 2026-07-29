"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migrationPath = path.join(__dirname, "..", "supabase", "migrations", "20260724170700_repair_paid_first_schema_contracts.sql");
const migration = fs.readFileSync(migrationPath, "utf8");

assert(migration.startsWith("begin;"), "hotfix migration is transactional");
assert(migration.trim().endsWith("commit;"), "hotfix migration commits transactionally");
assert(migration.includes("alter table jingeehas.assessments\n  alter column safety_check_id drop not null;"), "paid-first safety check is nullable");
assert(migration.includes("alter table jingeehas.analytics_events\n  drop constraint if exists analytics_events_event_name_check;"), "analytics check is replaced forward-only");

const allowedEvents = [
  "landing_viewed", "landing_cta_clicked", "start_cta_clicked", "payment_preparation_viewed",
  "assessment_started", "assessment_completed", "paywall_viewed", "invoice_created",
  "payment_confirmed", "invoice_create_failed", "payment_check_started", "payment_check_failed",
  "recovery_requested", "recovery_succeeded", "report_opened"
];
for (const eventName of allowedEvents) assert(migration.includes(`'${eventName}'::text`), `allowed analytics event missing: ${eventName}`);
assert.equal((migration.match(/'[^']+'::text/g) || []).length, allowedEvents.length, "event allowlist has no unapproved entries");
assert(migration.includes("20260724170700_repair_paid_first_schema_contracts"), "migration is recorded");
assert(!migration.includes("drop table jingeehas.assessments"), "assessment table is preserved");
assert(!migration.includes("drop constraint assessments_safety"), "safety foreign-key contract is preserved");

console.log("paid-first schema hotfix migration contract tests passed");
