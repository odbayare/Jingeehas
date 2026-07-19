# Report snapshot versioning certification

## Scope

Certification covers schema constraints, private access, legacy backfill, checksum equality, activation atomicity, concurrency, rollback, fallback precedence, idempotent regeneration, protected financial records, and isolated backup/restore.

No report payload, raw answer, contact value, health detail, or private identifier is recorded in this document.

## Production baseline before migration

| Record | Count |
| --- | ---: |
| Assessments | 2 |
| Legacy report snapshots | 1 |
| Payments | 2 |
| Entitlements | 1 |
| Recovery contacts | 2 |
| Recovery challenges | 0 |

The baseline was obtained through aggregate database metadata and count-only queries.

## Isolated database certification

The migration was applied to an isolated PostgreSQL 16 cluster seeded with non-private certification records.

| Check | Result |
| --- | --- |
| Migration transaction | PASS |
| Legacy row count unchanged | PASS |
| Backfill count equals legacy count | PASS |
| One legacy assessment maps once | PASS |
| Canonical payload checksum equality | PASS |
| RLS enabled | PASS |
| `anon` table access denied | PASS |
| `authenticated` table access denied | PASS |
| backend role access retained | PASS |
| Version-table foreign keys covered by indexes | PASS |
| Legacy fallback with no active version | PASS |
| Active version precedence | PASS |
| Partial unique active index | PASS |
| Two simultaneous activation attempts leave one active | PASS |
| Stale activation preserves prior active version | PASS |
| Successful activation supersedes prior active version | PASS |
| Payment count and content unchanged | PASS |
| Entitlement count and content unchanged | PASS |
| Transactional temporary backup/restore count | PASS |
| Transactional temporary backup/restore checksums | PASS |

## Application certification

Focused tests cover:

- legacy-only reads;
- active-version override;
- inactive and failed isolation;
- activation and rollback;
- concurrent activation;
- idempotent operation keys;
- unchanged completion state;
- zero payment, entitlement, and QPay actions;
- recovery and owner-preview active resolution;
- print/PDF use of the resolved active report;
- immutable legacy snapshots;
- no owner-specific inference branch;
- no report-content logging;
- enabled coming-soon protection.

## Production certification

Production migration counts, checksums, access grants, advisors, deployment identifiers, owner activation history, and before/after financial counts are recorded in the PR and final release report after the production transaction completes.
