# Report snapshot versioning migration

## Purpose

This migration adds immutable report history without changing the existing `jingeehas.report_snapshots` table. The legacy table remains the fallback source for older application versions and for assessments that have no active versioned snapshot.

The accepted report engine remains `jingeehas-case-formulation-v5-attribution`. Report inference, copy, payment, entitlement, recovery, and assessment-completion semantics are unchanged.

## Identifier compatibility

Jingeehas assessment IDs are canonical text identifiers such as the existing `wa_…` values. Therefore `report_snapshot_versions.assessment_id` and `source_legacy_assessment_id` use `text` foreign keys to `jingeehas.assessments(id)`. Converting canonical assessment IDs to UUID would be destructive and backward-incompatible. New `snapshot_id` values are UUIDs as required.

## Schema

`jingeehas.report_snapshot_versions` contains:

- UUID snapshot identity;
- text assessment foreign key;
- monotonically increasing version number per assessment;
- report engine and report schema versions;
- private JSON report payload and SHA-256 checksum;
- generated, active, superseded, or failed status;
- active, creation, activation, and supersession metadata;
- immutable legacy-source reference;
- an idempotency operation key.

Database constraints enforce status/active consistency and unique `(assessment_id, version_number)`. A partial unique index enforces at most one active version per assessment. RLS is enabled, direct `anon` and `authenticated` privileges are revoked, and only the existing backend `service_role` is granted table access.

## Transactional legacy backfill

The migration transaction:

1. hashes the complete legacy, payment, and entitlement tables for mutation detection;
2. maps each legacy snapshot exactly once to version 1;
3. stores a canonical report payload and database-calculated SHA-256 checksum;
4. marks accepted-engine or safety-only legacy rows active;
5. records unversioned report rows as `failed` with `legacy_backfill_failed_quality`, while keeping the legacy fallback available;
6. verifies source count, inserted count, distinct assessment count, and payload checksums;
7. verifies the legacy, payment, and entitlement hashes did not change;
8. aborts the entire migration if any invariant fails.

No legacy row is updated or deleted.

## Gateway operations

The existing dedicated-secret gateway dispatches these backend-only operations:

- `get_active_report_snapshot`
- `list_report_snapshot_versions`
- `get_report_snapshot_version`
- `create_report_snapshot_version`
- `activate_report_snapshot_version`

Read precedence is active version first, then immutable legacy fallback. Public application endpoints never return version history, inactive or failed payloads, checksums, operation keys, generation reasons, or creator metadata.

## Activation

Activation uses a per-assessment transaction advisory lock plus row locks. It verifies the generated target and expected current active snapshot, supersedes the prior active version, activates the target, and checks that exactly one active row remains. Any exception rolls back the complete activation transaction.

## Regeneration

Owner regeneration is a separate administrator-only operation. It does not reuse assessment completion. It requires an active owner administrator session, same-origin request, accepted engine version, expected active snapshot, generation reason, and idempotency key. It reads the completed assessment and saved answers, runs the single generic report builder, validates the public report, creates one generated version, and activates it atomically.

The operation does not create or update payments, entitlements, QPay invoices, recovery challenges, assessment completion state, or legacy snapshots.
