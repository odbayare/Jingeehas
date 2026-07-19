# Staging database certification

Current database gate: **PASS**. The private schema, dedicated-secret Edge Function authentication, authenticated external lifecycle, production server-side environment injection, logical backup, and disposable local restore are certified. This does not authorize a website deployment or public launch.

## Verified infrastructure

- Provider: **Supabase**
- Hosting project: **Enneagram test** (`nemgfbanmwqudjfzddrn`)
- Project API origin: `https://nemgfbanmwqudjfzddrn.supabase.co`
- Isolation model: private PostgreSQL schema `jingeehas`
- Gateway: Supabase Edge Function `jingeehas-database-gateway`
- Gateway base URL: `https://nemgfbanmwqudjfzddrn.supabase.co/functions/v1/jingeehas-database-gateway`
- Final adapter URL: `https://nemgfbanmwqudjfzddrn.supabase.co/functions/v1/jingeehas-database-gateway/transaction`
- Gateway status: **ACTIVE**, version 5, platform JWT verification disabled
- Database-side insert/get/delete/transaction/rollback/cleanup: **PASS**
- Unauthorized gateway test: **PASS** (missing bearer `401`, invalid bearer `401`, GET `405`)
- Authenticated Edge gateway lifecycle: **PASS** (insert/get/update/find/delete/rollback/cleanup)
- Application environment injection: **PASS** (server-side production context; credential value never displayed)
- Backup/restore: **PASS** (access-controlled logical backup and disposable PostgreSQL 17 local restore)

Using the existing Enneagram project does not share application tables. Isolation is enforced by the separate `jingeehas` schema, removal of `anon` and `authenticated` table privileges, RLS default-deny, private operation functions, a service-role-only public RPC bridge, and a dedicated-secret Edge Function gateway. Enneagram continues to use its existing `public` schema.

## Server configuration and stable adapter contract

Configure only in an owner-authorized Netlify staging/preview environment:

```text
JINGEEHAS_DATABASE_API_URL=https://nemgfbanmwqudjfzddrn.supabase.co/functions/v1/jingeehas-database-gateway
JINGEEHAS_DATABASE_API_KEY=<dedicated high-entropy gateway secret; server-side only>
```

The blank committed template is `config/staging.env.example`. Store the same generated value only as Supabase Edge Function secret `JINGEEHAS_GATEWAY_SECRET` and Netlify server-side `JINGEEHAS_DATABASE_API_KEY`. It must not be a Supabase publishable/secret key, anon/service-role JWT, or user JWT. Never place it in a repository file, browser variable, PR, issue, chat, log, screenshot, or artifact. Rotate this dedicated value independently if exposed; do not rotate the shared Supabase JWT secret.

`netlify/functions/_lib/store.js` contains the stable adapter; there is no separate `_lib/database.js`. It treats the URL as a base, appends exactly `/transaction`, sends `Authorization: Bearer <JINGEEHAS_DATABASE_API_KEY>` and `Content-Type: application/json`, and uses an eight-second timeout. Neither database variable appears in browser code. Production has no memory fallback; the in-memory adapter is under `tests/support` only.

## Field mapping and operation contract

Application JSON uses camelCase; the gateway maps it to PostgreSQL snake_case and reverses the mapping. Examples include `sessionId ↔ session_id`, `assessmentId ↔ assessment_id`, `tokenHash ↔ token_hash`, `contactHash ↔ contact_hash`, `senderInvoiceNo ↔ sender_invoice_no`, `providerPaymentId ↔ provider_payment_id`, `createdAt ↔ created_at`, `updatedAt ↔ updated_at`, `expiresAt ↔ expires_at`, `paidAt ↔ paid_at`, `grantedAt ↔ granted_at`, `coachId ↔ coach_id`, and `adminId ↔ admin_id`.

The service-role-only RPC accepts allowlisted `get`, `find`, `insert`, `update`, `upsert`, `delete`, and atomic `transaction` operations. Rollback certification sends `{ action: "transaction", rollback: true, operations: [...] }`. Unknown actions, tables, fields, and nested transactions must fail closed.

## Table and integrity checklist

The private schema contains 22 tables, all with RLS enabled and no browser-facing policy: `sessions`, `safety_checks`, `assessments`, `assessment_sessions`, `assessment_answers`, `assessment_summaries`, `report_snapshots`, `payments`, `entitlements`, `recovery_contacts`, `recovery_challenges`, `advisor_accounts`, `advisor_sessions`, `advisor_clients`, `advisor_commissions`, `advisor_report_access_logs`, `admin_accounts`, `admin_sessions`, `admin_audit_logs`, `data_deletion_requests`, `certification_records`, and `schema_migrations`.

Database-side verification records 32 foreign keys, 69 indexes, unique session/invoice/invite/payment constraints, recovery hash/rate indexes, advisor dashboard indexes, entitlement/commission idempotency, timestamp/expiry checks, and migration versions `2026071601_initial_certifiable_schema`, `2026071602_transaction_rpc`, and `2026071603_edge_gateway_contract`.

Financial, entitlement, consent, and audit relations restrict deletion and require a retention/anonymization procedure. Assessment answers, summaries, snapshots, and recovered session links follow the schema’s controlled deletion rules. Payment confirmation, entitlement, contact linking, and commission creation remain one logical idempotent transaction boundary.

## Configuration-only and authenticated checks

`npm run verify:database-config` validates the exact HTTPS host/path and logical final URL without network access. With no secret it reports `BLOCKED`. It rejects HTTP, the wrong project/function, an already-appended `/transaction`, short/whitespace credentials, Supabase publishable/secret formats, anon/service-role/user JWTs, and secrets supplied to the ordinary verifier. It never prints the credential length or prefix.

`npm run verify:database-gateway-auth` always runs missing, invalid, and GET probes. When the dedicated secret is securely injected, it also performs one authenticated read-only `get` probe and requires HTTP 200 with no record. It rejects sensitive response details and never prints the credential.

The authenticated lifecycle is separate:

```bash
JINGEEHAS_EXTERNAL_DATABASE_CERTIFICATION=approved npm run certify:database-external
```

Run only in an authorized environment where both database variables are injected securely. The command prints operation names and PASS/FAIL only. It uses unique records in `certification_records` and proves insert, get, update, find, delete, absence, rollback, and cleanup. It never touches user, payment, entitlement, recovery, report, advisor, or admin tables.

## Supabase backup and restore runbook

Status: **PASS**. An access-controlled logical backup was restored into a disposable local PostgreSQL 17 instance and verified without modifying the source project or Enneagram's `public` schema. The following remains the repeatable runbook for future owner-authorized restore exercises. Follow the current [Supabase CLI backup/restore guide](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) and [database connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres).

### 1. Confirm tools and flags

Run before assuming locally installed CLI behavior:

```bash
supabase --version
supabase db dump --help
psql --version
```

Use a direct connection when IPv6/direct connectivity is available; otherwise use the Supavisor **session** connection. Do not use the serverless transaction pooler for migrations, dumps, or restores. Obtain source and disposable-target connection strings through the Supabase dashboard and inject them securely; never commit or print database passwords.

### 2. Role backup

```bash
supabase db dump --db-url "$SOURCE_DB_URL" -f roles.sql --role-only
```

The roles dump is project-wide sensitive material. Encrypt it, restrict access, and review managed-role implications before restoring it to another Supabase project.

### 3. Jingeehas schema backup

```bash
supabase db dump --db-url "$SOURCE_DB_URL" -f jingeehas-schema.sql --schema jingeehas
```

Verify that the dump contains only the private `jingeehas` schema and its functions, grants, RLS, constraints, indexes, and migration table.

### 4. Jingeehas data backup

```bash
supabase db dump --db-url "$SOURCE_DB_URL" -f jingeehas-data.sql --use-copy --data-only --schema jingeehas
```

Store roles, schema, and data files encrypted and record hashes, timestamps, CLI/Postgres versions, source project ref, and operator without recording credentials or private row contents.

### 5. Restore into an authorized disposable target

Create or designate a disposable target only with separate owner authorization. Enable required extensions/settings first, then use its direct/session connection:

```bash
psql \
  --single-transaction \
  --variable ON_ERROR_STOP=1 \
  --file roles.sql \
  --file jingeehas-schema.sql \
  --command 'SET session_replication_role = replica' \
  --file jingeehas-data.sql \
  --dbname "$TARGET_DB_URL"
```

If managed roles already exist, review the role restore instead of ignoring errors. Do not restore into the source project.

### 6. Jingeehas-only verification

Verify exactly 22 `jingeehas` tables, expected migration versions, RLS enabled on every table, no `anon`/`authenticated` privileges or policies, service-role bridge restrictions, row counts and hashes appropriate to the backup, constraints/indexes, and disposable CRUD/rollback cleanup. Confirm the target’s unrelated `public`, `auth`, and `storage` schemas were not modified by the Jingeehas restore.

### 7. Target cleanup

Record verification evidence, revoke temporary credentials, securely destroy local plaintext dumps, and delete the disposable target only with its explicit owner approval. A backup is not certified until restore verification and cleanup both pass.

## Failure and evidence record

On failure, stop, retain coming-soon mode, revoke temporary credentials, attempt certification-record cleanup, and do not report PASS. Record project/gateway identifier, commit SHA, migration versions, operation PASS/FAIL, HTTP statuses without bodies, disposable IDs, backup file hashes, restore target, cleanup result, timestamps, and operator. Never record service-role/database credentials or private data.

Current status: schema, migration inventory, dedicated gateway authentication, authenticated lifecycle, server-side production credential injection, access-controlled logical backup, and disposable PostgreSQL 17 restore are **PASS**. The live recovery run also verified the repaired `report_snapshots.assessment_id` get/update path through the gateway. The repair changed neither schema tables, RLS, nor RPC grants. Certification left no residual rows. The shared Supabase service-role credential is absent from Netlify and remains internal to the Edge Function runtime.
