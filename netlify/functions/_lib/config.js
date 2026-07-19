"use strict";

const PRODUCT = Object.freeze({ code: "WEIGHT_TEST_ONE_TIME", amount: 9900 });
const TABLES = Object.freeze([
  "sessions", "assessment_sessions", "safety_checks", "assessments", "assessment_answers", "assessment_summaries",
  "report_snapshots", "report_snapshot_versions", "payments", "entitlements", "recovery_contacts",
  "advisor_accounts", "advisor_sessions", "advisor_clients", "advisor_commissions",
  "advisor_report_access_logs", "admin_accounts", "admin_sessions", "admin_audit_logs", "recovery_challenges", "data_deletion_requests",
  "schema_migrations", "certification_records"
  , "analytics_events"
]);

function databaseConfig(env = process.env) {
  const url = String(env.JINGEEHAS_DATABASE_API_URL || "").replace(/\/+$/, "");
  const apiKey = String(env.JINGEEHAS_DATABASE_API_KEY || "");
  if (!url || !apiKey || !url.startsWith("https://")) {
    const error = new Error("Production database is not configured");
    error.statusCode = 503;
    error.code = "database_unavailable";
    throw error;
  }
  return { url, apiKey };
}

module.exports = { PRODUCT, TABLES, databaseConfig };
