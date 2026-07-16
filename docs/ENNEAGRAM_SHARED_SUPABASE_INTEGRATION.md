# Jingeehas shared Supabase integration

## Decision

Jingeehas uses the existing `Enneagram test` Supabase project (`nemgfbanmwqudjfzddrn`) to avoid a separate monthly project charge.

Jingeehas data is isolated in the dedicated PostgreSQL schema:

```text
jingeehas
```

The Enneagram product continues to use the existing `public` schema.

## Isolation controls

- `anon` has no `USAGE` privilege on `jingeehas`.
- `authenticated` has no `USAGE` privilege on `jingeehas`.
- Neither role has table privileges in the schema.
- `service_role` is the only application role granted schema/table/sequence access.
- RLS is enabled on every Jingeehas table as defense in depth.
- Netlify Functions remain the only intended application caller.
- No database credential may be included in frontend code or public artifacts.

## Provisioned database state

- 22 tables
- 22 tables with RLS enabled
- 32 foreign keys
- 69 indexes
- migration versions:
  - `2026071601_initial_certifiable_schema`
  - `2026071602_transaction_rpc`
  - `2026071603_edge_gateway_contract`

The `public` schema retained its six pre-existing application tables during provisioning.

## HTTPS adapter

Supabase Edge Function:

```text
jingeehas-database-api
```

Expected Netlify environment configuration:

```text
JINGEEHAS_DATABASE_API_URL=https://nemgfbanmwqudjfzddrn.supabase.co/functions/v1/jingeehas-database-api
JINGEEHAS_DATABASE_API_KEY=<server-only privileged Supabase JWT>
```

The adapter appends `/transaction` to the base URL.

The key must be stored only in Netlify server-side environment configuration. It must never be prefixed with a public-client environment name or exposed to browser JavaScript.

## Supported operations

- `get`
- `find`
- `insert`
- `update`
- `upsert`
- `delete`
- atomic `transaction`
- rollback-only certification transaction

Both the Edge Function and SQL RPC enforce a fixed Jingeehas table allowlist. Nested transactions and requests containing more than 100 operations are rejected.

## Verification completed

- schema migration: PASS
- foreign keys and constraints: PASS
- covering indexes for Jingeehas foreign keys: PASS
- RLS coverage: PASS
- role isolation: PASS
- SQL RPC operation contract: PASS
- rollback transaction: PASS, zero persisted probe rows
- Edge Function deployment: ACTIVE, JWT verification enabled
- deployed function source recorded under `supabase/functions/jingeehas-database-api/index.ts`

## Remaining certification work

- inject the two database environment variables into an authorized Netlify staging context;
- run an authenticated HTTPS roundtrip through the Edge Function;
- run a backup and restoration exercise;
- confirm application CRUD and rollback behavior from the staged Netlify Functions;
- retain `WEIGHT_TEST_COMING_SOON_MODE = true` until all external launch gates pass.

No application staging deployment, QPay request, payment, DNS change, merge, or coming-soon change was performed during database provisioning.
