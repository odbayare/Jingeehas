# Supabase migration reconciliation — 2026-07-25

## Scope

This record documents reconciliation of the linked production migration history
for project `nemgfbanmwqudjfzddrn`. It contains no customer identifiers,
financial identifiers, answers, contact data, or secrets.

## Preservation and fetch

- Branch: `agent/full-landing-copy-and-direct-payment-v2`
- Source HEAD: `9f3a5c8b0f4019cfd600b1940f2fd9514570082b`
- Local migration backup: `/var/folders/6m/vvxl5v454f326rrmysm_xdmh0000gn/T/tmp.4aoiyG6ZH8/jingeehas-local-migrations`
- Original local migration count: 21
- Canonical fetch: `supabase migration fetch --linked`, executed in a disposable project copy.
- Fetched production migration count: 26

The fetched inventory was treated as the authoritative production timestamp
and filename source. The two exceptions below retain the repository SQL because
production schema and ledger evidence show that the fetched statement snapshots
are incomplete or contain a historical ledger typo.

## Canonical timestamp mappings

The following local files were proven equivalent after removing only comments,
insignificant whitespace, and terminal semicolons, then renamed with `git mv`:

| Production version | Previous local version |
| --- | --- |
| 20260716200716 | 20260717201500 |
| 20260717070952 | 20260717052252 |
| 20260717070959 | 20260717065319 |
| 20260717071101 | 20260717071032 |
| 20260717071158 | 20260717071119 |
| 20260719141028 | 20260719090000 |
| 20260720085252 | 20260720073844 |
| 20260721152722 | 20260721143352 |
| 20260721165943 | 20260721165021 |
| 20260722020016 | 20260722015052 |
| 20260722042433 | 20260722041203 |
| 20260722160603 | 20260722151611 |
| 20260722160610 | 20260722160108 |

The following fetched historical files were added unchanged because no local
equivalent existed:

`20260716115009`, `20260716115857`, `20260716120053`, `20260716122550`,
`20260716122640`, `20260716142053`, `20260716142113`, and `20260716142236`.

The former local-only wrappers `20260722075053_clarify_funnel_visitor_coverage`
and `20260722081512_allow_payment_preparation_analytics_event` were removed
from the canonical replay inventory. The production `20260722042433` function
already contains the coverage semantics from the first wrapper, and the
forward-only `20260724170700` hotfix supersedes the second wrapper's event
constraint. Both remain recorded in the private application ledger; removing
their duplicate replay files does not remove or alter production objects.

## Resolved exceptions

### 20260716172640 — recovery rate limits

The fetched statement snapshot inserts the private application-ledger value
`20260716172059_harden_email_recovery_rate_limits`; the repository SQL inserts
`20260716172640_harden_email_recovery_rate_limits`. Production
`jingeehas.schema_migrations` contains the repository value, and the function
and schema bodies are equivalent. The repository filename and SQL were
therefore retained. The fetched value is recorded as a historical statement-
snapshot anomaly and is not introduced into new environments.

### 20260721080832 — question progress

The repository SQL is the replayable canonical source. Git history confirms it
creates and backfills `assessments.questionnaire_version`, sets its default and
`NOT NULL` constraint, performs assessment-specific answer backfill, and keeps
live-only stop-position logic. Production confirms the column is `NOT NULL`
with default `jingeehas-production-2026-07`, progress rows agree with their
assessment version, and the deployed progress functions validate the stored
version. The fetched snapshot omits those schema operations and changes the
live/canonical evidence rules, so it was not substituted.

## Production evidence

Read-only checks confirmed:

- `assessments.safety_check_id` is nullable;
- the existing safety foreign key remains present;
- `analytics_events_event_name_check` includes `landing_cta_clicked` and all
  previously allowed events;
- `20260724170700_repair_paid_first_schema_contracts` exists in
  `jingeehas.schema_migrations`;
- no protected data mutation was required for reconciliation.

## Canonicalization rule

Production migration timestamps and filenames are canonical when the SQL is
equivalent. When a fetched SQL snapshot conflicts with production schema,
private-ledger values, or Git-established replay semantics, the repository
SQL is retained and the exception is documented here. No migration is marked
applied solely to make a list appear clean, and no historical SQL is replayed
against production during reconciliation.
