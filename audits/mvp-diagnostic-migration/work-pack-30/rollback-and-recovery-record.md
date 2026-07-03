# WP30 Rollback And Recovery Record

## Current production references

- Current production commit: `fd56961`
- Latest audit commit: `af90025`
- Latest deploy ID: `6a47773c43a1b7fed95d0b25`
- Production URL: `https://clever-souffle-1e5f74.netlify.app`
- Unique deploy URL: `https://6a47773c43a1b7fed95d0b25--clever-souffle-1e5f74.netlify.app`

## Rollback command

```bash
git revert fd56961
npm test
```

## Rollback intent

Reverting `fd56961` disables the public runtime visible report surface enablement while preserving the audit history that followed it.

## Recovery validation

After rollback, run:

```bash
git diff --check
npm test
grep -F "const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;" app.js
grep -F "const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = false;" app.js
git diff -- index.html styles.css mockBackend.js package.json _redirects
git diff -- tests/driver-stack/runtimeAdapterPrototype.mjs tests/driver-stack/runtimeAdapterPrototype.test.js tests/driver-stack/exportRuntimeAdapterPrototype.mjs
```

## Recovery boundary

- Do not change QPay/backend/payment/pricing/entitlement logic during rollback.
- Do not render `internalDiagnostics`.
- Do not render `ownerDebug`.
- Do not generate PDF as part of rollback.
- Keep `audits/sprint-36-paid-depth-prototype/` untouched.
