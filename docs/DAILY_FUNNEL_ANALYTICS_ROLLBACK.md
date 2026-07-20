# Daily funnel analytics rollback

Application rollback is safe because analytics is additive and fail-open. Redeploy the last accepted application commit to stop new browser/server event writes while leaving existing analytics rows private.

Do not drop `jingeehas.analytics_events` during an application rollback. Retaining it preserves audit history and avoids destructive schema work. The owner dashboard endpoint may be disabled with the application rollback; assessment, payment, entitlement, report, and recovery paths remain independent.

If the migration transaction fails, PostgreSQL rolls back table, indexes, functions, grants, and the migration-record insert together. If a post-deploy defect is found, confirm the prior application is live, verify the public assessment remains enabled, and compare financial counts to their pre-deploy values. Removing stored analytics data requires a separate authorized retention decision.

For the source-of-truth repair, restore the previous `get_daily_funnel_analytics(date,date)` function from `20260719090000_add_daily_funnel_analytics.sql`. No table or customer-row rollback is required. Keep the current table, RLS, grants, events, assessments, payments, and entitlements unchanged.
