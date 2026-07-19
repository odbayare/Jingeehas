# Report snapshot versioning rollback

## Principles

- Never drop, rename, truncate, update, or delete `jingeehas.report_snapshots` during rollback.
- Never delete version history to make a rollback appear successful.
- Never alter payment, entitlement, recovery-contact, or assessment-completion records.
- Keep coming-soon enabled throughout rollback.

## Migration failure

The schema creation and legacy backfill run in one transaction. Any source-count, distinct-assessment, checksum, protected-table hash, constraint, or grant failure aborts the transaction. The pre-migration application continues reading the untouched legacy table.

## Activation failure

Activation locks all versions for the target assessment. A stale expected snapshot, invalid target status, constraint failure, or final active-count failure aborts the transaction. The previous active report remains active. The generated target remains inactive only when creation succeeded before activation; it is never public.

## Application deployment rollback

Redeploy the last known-good commit to the existing Netlify site. The old application reads the unchanged legacy table. Do not reverse or delete the version table during the application rollback. Once the corrected version-aware application is redeployed, active-version precedence resumes.

## Data restoration certification

Before production migration, preserve an aggregate schema/count/checksum record through the approved database backup mechanism. Restore into an isolated target and verify:

1. legacy snapshot count and aggregate checksum;
2. versioned snapshot count and per-row payload checksums;
3. one-active-version invariant;
4. assessment foreign keys and zero orphans;
5. payment and entitlement counts and aggregate checksums;
6. RLS and role grants.

The isolated certification uses a transactional copy of the version table and verifies row counts and payload checksums before rolling it back. Production backup status must also be confirmed before migration application.

## Emergency report rollback

Do not rewrite a superseded row. If an accepted active report must be replaced, generate a new version from the approved source and activate that new version using the expected-current-snapshot contract. This preserves the complete audit chain.
