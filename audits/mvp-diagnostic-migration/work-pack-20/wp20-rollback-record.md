# WP20 Rollback Record

## Rollback Scope

WP20 is revertible as one ordinary source change set before commit.

After commit, rollback is one commit revert.

WP20 visible surface prototype is revertible with one commit revert.

## Files In Rollback Scope

- `app.js`
- `tests/visible-surface-prototype.test.js`
- `tests/run-all.js`
- `audits/mvp-diagnostic-migration/work-pack-20/*`

## Rollback Command After Commit

```bash
git revert <wp20_commit_sha>
```

Exact rollback command template:

```bash
git revert <WP20_COMMIT_HASH>
npm test
```

## Rollback Verification

Run:

```bash
node --check app.js
node tests/runtime-adapter-shadow-integration.test.js
npm test
```

Confirm:

- `ENABLE_VISIBLE_SURFACE_PROTOTYPE` is removed or remains disabled by the revert target;
- `tests/visible-surface-prototype.test.js` is removed by the revert target;
- production report output remains unchanged;
- QPay, payment, backend, pricing, entitlement, deploy, and PDF files remain untouched.

## Deploy Status

No deploy reversal is required because WP20 does not deploy.
