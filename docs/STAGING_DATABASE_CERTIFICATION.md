# Staging database certification

Current status: **BLOCKED** — no staging database provider or credentials have been supplied. This document prepares certification without selecting a provider.

## Required configuration

- `JINGEEHAS_DATABASE_API_URL`: HTTPS origin implementing `GET /health` and `POST /transaction`.
- `JINGEEHAS_DATABASE_API_KEY`: bearer credential supplied only through the privileged staging environment.
- External execution additionally requires the explicit CLI flag `--external-certification`.

Never place either value in the repository, command output, screenshots, or PR text.

## Schema deployment and migration

1. Provision an owner-approved PostgreSQL database and HTTPS adapter service.
2. Take a provider snapshot before changing an existing database.
3. In a privileged SQL session, run `psql --set ON_ERROR_STOP=1 --file database/schema.sql "$DATABASE_URL"` for a new empty database.
4. Confirm `schema_migrations.version = 2026071601_initial_certifiable_schema`.
5. For an existing database, generate and owner-review an additive migration from the canonical schema; do not rerun the initial schema blindly.
6. Run `npm run verify:database-config -- --external-certification` from a secret-injected staging environment.
7. Record only the evidence fields below, then remove shell/environment credentials.

Every future schema change requires an immutable migration version, pre-change backup, forward procedure, and rollback procedure. Never edit an already-applied migration record.

## HTTPS adapter contract and field mapping

`GET /health` returns `{ "status": "ok" }`. `POST /transaction` accepts `get`, `find`, `insert`, `update`, `upsert`, `delete`, `schema`, and atomic `transaction` actions. A rollback certification request uses `{ action: "transaction", rollback: true, operations: [...] }` and must return `{ rolledBack: true }` without persisting its operations.

Application JSON uses camelCase; the adapter maps it to PostgreSQL snake_case and reverses the mapping on responses. Examples: `sessionId ↔ session_id`, `assessmentId ↔ assessment_id`, `tokenHash ↔ token_hash`, `contactHash ↔ contact_hash`, `senderInvoiceNo ↔ sender_invoice_no`, `providerPaymentId ↔ provider_payment_id`, `createdAt ↔ created_at`, `updatedAt ↔ updated_at`, `expiresAt ↔ expires_at`, `paidAt ↔ paid_at`, `grantedAt ↔ granted_at`, `coachId ↔ coach_id`, and `adminId ↔ admin_id`. JSONB values remain JSON values. Unknown table names, fields, filters, and actions must be rejected.

## Table checklist

| Table | Key/uniqueness | Required lookup or relationship |
| --- | --- | --- |
| `sessions` | PK `id`; unique `token_hash` | active expiry index |
| `safety_checks` | PK `id`; FK session | session/time index |
| `assessments` | PK `id`; FK session/safety/advisor client | session dashboard index |
| `assessment_sessions` | PK; unique assessment/session | recovered-session lookup |
| `assessment_answers` | PK; unique assessment/question | assessment cascade |
| `assessment_summaries` | PK; unique assessment/checkpoint | assessment cascade |
| `report_snapshots` | PK/FK assessment | session ownership |
| `payments` | PK; unique invoice and sender invoice | session/assessment/product and status/expiry indexes |
| `entitlements` | PK; unique assessment/product and payment/product | payment and assessment FKs |
| `recovery_contacts` | PK; unique group/type | type/hash and assessment indexes |
| `recovery_challenges` | PK | distributed rate-key/contact/time indexes, expiry and attempt checks |
| `advisor_accounts` | PK; unique email | normalized identity |
| `advisor_sessions` | PK; unique token hash | active token/expiry lookup |
| `advisor_clients` | PK; unique invite hash | advisor/status/time dashboard and contact hash indexes |
| `advisor_commissions` | PK; unique payment | advisor/status/time dashboard; idempotent payment commission |
| `advisor_report_access_logs` | PK | advisor/time audit index |
| `admin_accounts` | PK; unique email | active administrator identity |
| `admin_sessions` | PK; unique token hash | active token/expiry lookup |
| `admin_audit_logs` | PK; FK administrator | administrator/time audit index |
| `data_deletion_requests` | PK; one pending request per assessment | ownership FKs and partial unique index |

`schema_migrations` versions migrations. `certification_records` exists only for disposable, non-user staging certification writes.

## Transaction and deletion boundaries

Payment confirmation, entitlement upsert, recovery-contact linkage, and advisor-commission upsert form one logical transaction in the adapter. Unique payment/product constraints provide idempotency if a retry follows a process interruption. Certification must prove rollback before launch.

Assessment answers, summaries, snapshots, and recovered session links cascade with assessment deletion. Financial, entitlement, consent, audit, and deletion-request relationships restrict deletion and require an owner/legal-approved retention or anonymization operation. No direct cascading deletion of payment evidence is permitted.

## Backup, restore, failure, and rollback

Create an encrypted provider snapshot and record its opaque identifier and timestamp. Restore it into an isolated database, run the schema verifier against that restored endpoint, compare migration versions and row counts, then destroy the isolated restore. A backup is not certified until restoration succeeds.

On failure: stop certification, keep coming-soon enabled, revoke temporary API credentials, remove disposable records if safe, restore the pre-change snapshot when schema/data changed, verify the restored health/schema, and record the failure without secrets.

## Evidence record

- Provider/project identifier (non-secret):
- Adapter deployment identifier:
- Commit SHA:
- Migration version:
- Health-check timestamp/result:
- Required tables/columns result:
- Disposable write/read/delete result:
- Transaction rollback result:
- Backup opaque identifier/timestamp:
- Restore target and verification result:
- Cleanup result:
- Operator and owner approval:
- Final status: **BLOCKED**
