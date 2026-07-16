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
jingeehas-database-gateway
```

Expected Netlify environment configuration:

```text
JINGEEHAS_DATABASE_API_URL=https://nemgfbanmwqudjfzddrn.supabase.co/functions/v1/jingeehas-database-gateway
JINGEEHAS_DATABASE_API_KEY=<blank in repository; dedicated high-entropy gateway secret in Netlify only>
```

The adapter appends `/transaction` to the base URL.

The same generated value is stored only as Supabase Edge Function secret `JINGEEHAS_GATEWAY_SECRET` and Netlify server-side `JINGEEHAS_DATABASE_API_KEY`. It is not a Supabase API key or JWT and must never be prefixed with a public-client environment name or exposed to browser JavaScript. The function keeps `SUPABASE_SERVICE_ROLE_KEY` internal for its service-role-only RPC call.

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
- Edge Function deployment: ACTIVE
- unauthorized Edge Function access: PASS (missing bearer `401`, invalid bearer `401`, GET `405`; read-only probes, no record created)
- authenticated Edge Function lifecycle: PASS (insert/get/update/find/delete/rollback/cleanup, no residual certification rows)
- access-controlled logical backup and disposable PostgreSQL 17 local restore: PASS
- active function disables platform JWT verification, rejects Supabase API-key/JWT formats, and validates the bearer value against `JINGEEHAS_GATEWAY_SECRET` using constant-time comparison
- `SUPABASE_SERVICE_ROLE_KEY` remains internal to the Edge Function and is used only for the service-role-only RPC bridge
- deployable function source and `verify_jwt = false` configuration are versioned under `supabase/functions/jingeehas-database-gateway` and `supabase/config.toml`

## Remaining launch work

- retain `WEIGHT_TEST_COMING_SOON_MODE = true` until recovery delivery, QPay sandbox, real administrator, support inbox, and final owner approval gates pass;
- repeat database certification only after a gateway, RPC, schema, or credential change.

Only the updated Supabase Edge Function was deployed for this certification. No Jingeehas website deployment, QPay request, payment, DNS change, PR merge, or coming-soon change was performed.
