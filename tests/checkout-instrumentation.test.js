"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const analytics = fs.readFileSync(path.join(root, "netlify/functions/_lib/analytics.js"), "utf8");
const collectSource = fs.readFileSync(path.join(root, "netlify/functions/analytics-collect.js"), "utf8");
const assessmentSource = fs.readFileSync(path.join(root, "netlify/functions/weight-assessment-create.js"), "utf8");
const invoiceSource = fs.readFileSync(path.join(root, "netlify/functions/qpay-create-invoice.js"), "utf8");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const migration = fs.readFileSync(path.join(root, "supabase/migrations/20260725162225_instrument_checkout_submission_and_diagnostics.sql"), "utf8");

for (const event of ["payment_cta_clicked", "assessment_shell_created", "assessment_shell_create_failed", "invoice_create_started"]) assert(analytics.includes(`"${event}"`), event);
assert.match(collectSource, /BROWSER_EVENTS/);
assert.match(assessmentSource, /assessment_shell_created/);
assert.match(assessmentSource, /assessment_shell_create_failed/);
assert.match(assessmentSource, /failureCategory/);
assert.match(invoiceSource, /invoice_create_started/);
assert.match(invoiceSource, /safeFailureCategory/);
assert.match(appSource, /trackEvent\("payment_cta_clicked"/);
for (const field of ["payment_cta_sessions", "assessment_shells_created", "assessment_shell_create_failures", "invoice_create_attempts", "invoice_create_failures"]) assert(migration.includes(field), field);
assert.match(migration, /not e\.is_admin and not e\.is_owner_preview and not e\.is_test/);
assert(!invoiceSource.includes("errorCode"));
assert(!assessmentSource.includes("error\.stack"));
console.log("checkout instrumentation contract tests passed");
