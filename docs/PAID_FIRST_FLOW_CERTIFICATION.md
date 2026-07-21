# Paid-first flow certification

Certification records aggregate counts only; it never prints emails, phone numbers, raw answers, report payloads, or health information.

Pre-migration production baseline recorded on 2026-07-21:

- assessments: 8 (`draft`: 5, `complete`: 3)
- payments/invoices: 3
- verified payments: 2
- entitlements: 2
- advisor commissions: 0
- legacy report snapshots: 3
- versioned report snapshots: 2

Immediately after migration, 10 assessments existed (`draft`: 7, `complete`: 3). The two additional draft rows were created by live traffic between the initial read-only baseline and migration; this run created no production assessment. All 10 were classified as legacy, and financial/report counts stayed exactly unchanged.

Required post-migration checks:

1. The same financial and report counts remain unchanged.
2. All eight pre-existing assessments are `legacy_postpaid_v1`.
3. No pre-existing row has `started_at` populated by the migration.
4. RLS remains enabled and `anon`/`authenticated` have no direct table privileges.
5. A transaction rollback probe leaves counts unchanged.
6. Focused unit/contract/E2E tests prove unpaid question, answer, completion, and report denial; invoice idempotency; single entitlement grant; first-start immutability; legacy continuation; recovery routing; and synthetic preview exclusion.
