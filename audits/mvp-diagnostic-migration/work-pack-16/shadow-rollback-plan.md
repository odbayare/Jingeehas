# WP16 Shadow Rollback Plan

## Purpose

This document defines the rollback plan required before any future WP17 runtime code is committed.

WP16 is docs-only.

Runtime implementation is NOT approved by WP16.

## Rollback principle

Shadow integration must be reversible with a narrow revert. WP17 must not require rollback across payment, backend, PDF, deploy, pricing, entitlement, WP3, WP4, WP9, WP10, or WP12 files.

## Required pre-commit rollback record

Before any WP17 code is committed, the WP17 owner pack must record:

- pre-WP17 commit hash;
- WP17 commit hash if already committed;
- exact changed files;
- exact shadow flag name;
- exact shadow helper name;
- exact test files added;
- exact rollback command;
- post-rollback validation commands.

## Required flag rollback

Rollback must remove:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

Rollback must also remove:

- shadow helper;
- shadow call inside `renderReport()`;
- test-only internal hook;
- WP17 shadow tests;
- WP17 owner-review artifacts if rolling back the whole work pack.

## Rollback command patterns

If WP17 has been committed:

```bash
git revert <wp17_commit_hash>
npm test
```

If WP17 is uncommitted:

```bash
git restore app.js <approved_wp17_test_files>
npm test
```

The exact `<approved_wp17_test_files>` list must be written in the WP17 owner pack before commit.

## Rollback triggers

Rollback is required if any of these occur:

- visible report HTML changes when the shadow flag is disabled;
- paywall HTML changes when the shadow flag is disabled;
- professional-first route changes when the shadow flag is disabled;
- urgent safety route changes when the shadow flag is disabled;
- localStorage key or state shape changes;
- adapter payload is visible in returned HTML;
- internal keys become user-facing;
- payment, QPay, pricing, backend, entitlement, or coach behavior changes;
- safety guidance becomes payment-gated;
- tests fail;
- PDF is generated;
- deploy is attempted.

## Post-rollback validation

Required post-rollback commands:

```bash
git status --short
git diff --check
node --check app.js
npm test
git diff -- index.html styles.css mockBackend.js package.json _redirects tests/run-all.js
git diff -- tests/driver-stack/runtimeAdapterPrototype.mjs tests/driver-stack/runtimeAdapterPrototype.test.js tests/driver-stack/exportRuntimeAdapterPrototype.mjs
```

## Scope preservation

Rollback must not touch:

- `audits/sprint-36-paid-depth-prototype/`;
- payment/QPay/backend/pricing/entitlement files;
- PDF scripts;
- deploy configuration;
- WP3 scoring/fixtures;
- WP4 report object contract;
- WP9 metadata contract;
- WP10/WP12 renderer contract;
- WP14 adapter files unless a future owner-approved WP17 scope modified them.

Runtime implementation is NOT approved by WP16.
