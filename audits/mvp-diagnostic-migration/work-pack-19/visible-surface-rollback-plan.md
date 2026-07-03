# WP19 Visible Surface Rollback Plan

## Purpose

This artifact defines the rollback plan required before any future WP20 visible surface prototype can be committed or released.

WP19 does not implement rollback code and does not approve visible runtime rendering.

## Rollback Trigger

Rollback is required if any future WP20 prototype:

- renders visible surfaces outside owner-approved gates;
- hides safety guidance behind payment, entitlement, payment failure, or report locked state;
- renders `internalDiagnostics` or `ownerDebug` to users;
- changes report copy without owner-approved copy QA;
- changes payment, QPay, backend, pricing, or entitlement behavior;
- changes localStorage persistence without explicit approval;
- breaks urgent or professional routes;
- fails full regression tests;
- is deployed before deploy-specific approval.

## Rollback Method

WP20 visible surface prototype must be revertible with a single commit revert.

The future WP20 implementation must keep all prototype changes scoped so one commit revert returns the app to the pre-WP20 state.

## Expected Revert Command

```bash
git revert <WP20_COMMIT_HASH>
npm test
```

## What To Inspect After Rollback

After rollback, inspect:

- `app.js`;
- `tests/visible-surface-prototype.test.js`, if it existed;
- `tests/run-all.js`, if WP20 touched it;
- `index.html`;
- `styles.css`;
- `mockBackend.js`;
- `package.json`;
- `_redirects`;
- backend/payment/QPay/pricing/entitlement files;
- PDF scripts;
- WP3/WP4/WP9/WP10/WP12/WP14 contract files.

Expected result: only the revert commit remains, and visible prototype behavior is gone.

## Smoke Tests After Rollback

Run:

```bash
git diff --check
npm test
git diff -- app.js
git diff -- tests/run-all.js
git diff -- index.html styles.css mockBackend.js package.json _redirects
git diff -- tests/driver-stack/runtimeAdapterPrototype.mjs tests/driver-stack/runtimeAdapterPrototype.test.js tests/driver-stack/exportRuntimeAdapterPrototype.mjs
```

Expected:

- full test suite passes;
- no adapter internal fields render to users;
- safety/professional routes remain protected;
- payment behavior remains unchanged;
- deploy remains blocked.

## Owner Notification Requirement

The owner must be notified after rollback with:

- rollback commit hash;
- reason for rollback;
- tests run;
- remaining risks;
- confirmation that deploy did not occur.

## No-Deploy Rollback Note

WP19 does not approve deploy.

WP20 may not deploy.

If a future prototype fails before deploy approval, rollback remains local or review-branch only.

Production release requires a later deploy-specific work pack.

## Conclusion

Visible runtime report rendering is NOT approved by WP19.
