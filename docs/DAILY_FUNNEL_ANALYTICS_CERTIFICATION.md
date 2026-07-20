# Daily funnel analytics certification

## Pre-deploy checks

1. Apply `20260719090000_add_daily_funnel_analytics.sql` to the linked Jingeehas project.
2. Confirm `analytics_events` is in the private `jingeehas` schema, RLS is enabled, and `anon`/`authenticated` have no table or function privileges.
3. Confirm indexes exist for event/time, assessment, invoice, payment, campaign, rate limiting, event ID, and critical idempotency.
4. Set a dedicated random `ANALYTICS_HASH_PEPPER` of at least 32 characters in Netlify production functions. Never print it.
5. Record assessment, payment, entitlement, report-snapshot, and QPay-invoice counts. Applying the migration must not change them.

## 2026-07-20 production root cause

The dashboard originally counted every funnel stage from `analytics_events`. Visitor instrumentation began at 2026-07-19 22:18 Ulaanbaatar time, after all four then-existing assessments had already been created. The selected 2026-07-14 through 2026-07-20 range therefore showed hundreds of distinct first-party visitor-cookie landing users but zero starts, even though canonical records contained four assessments, two completions, two successful invoices, and two provider-confirmed entitled payments. This was a source-of-truth/query defect, not an event-name or timezone mismatch and not evidence that every visitor started a test.

Migration `20260720073844_repair_daily_funnel_source_of_truth.sql` changes the aggregate RPC to use canonical assessment/payment/entitlement records while retaining distinct eligible visitor and payment-section view events. It does not fabricate historical visitor or payment-section rows.

## Deterministic probes

- Insert synthetic rows marked `is_test=true`; prove the owner aggregate excludes them.
- Insert two landing rows for one visitor; prove raw views are two and unique visitors are one.
- Retry an identical event ID and a critical idempotency key; prove no duplicate row.
- Place a row just after 16:00 UTC and prove it belongs to the following Ulaanbaatar calendar date.
- Retry a confirmed-payment event and prove payment count and revenue remain one.
- Query a zero-denominator day and prove the UI displays `—`.
- Attempt browser ingestion of `payment_confirmed`; require HTTP 400.
- Attempt direct `anon` and `authenticated` table reads/writes; require denial.
- Attempt a non-owner admin aggregate read; require denial.

## Production acceptance

- Landing, assessment start/completion, payment screen, report, and recovery remain usable if `analytics-collect` is unavailable.
- No QPay invoice or payment is created for certification.
- Existing financial row counts are unchanged.
- Owner dashboard loads at 375px and desktop without page-level horizontal overflow; only the daily table scrolls horizontally.
- `WEIGHT_TEST_COMING_SOON_MODE=false` in browser and server before and after deploy.
