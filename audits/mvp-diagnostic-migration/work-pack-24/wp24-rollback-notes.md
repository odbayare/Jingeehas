# WP24 Rollback Notes

## Current Deploy

- Deploy ID: `6a4754ee78d1263be76ccef0`
- Production URL: `https://clever-souffle-1e5f74.netlify.app`
- Unique deploy URL: `https://6a4754ee78d1263be76ccef0--clever-souffle-1e5f74.netlify.app`

## Rollback Approach

If the WP24 deploy needs to be rolled back, use Netlify's deploy rollback UI or CLI to restore the previous known-good production deploy.

## Rollback Boundary

- Do not enable public visible runtime surfaces during rollback.
- Do not change QPay/backend/payment/pricing/entitlement logic during rollback.
- Do not generate PDF during rollback.
- Do not render `internalDiagnostics` or `ownerDebug`.

## Post-Rollback Checks

After rollback, run:

```bash
curl -I https://clever-souffle-1e5f74.netlify.app
curl -s https://clever-souffle-1e5f74.netlify.app/app.js | grep -F "const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;"
curl -s https://clever-souffle-1e5f74.netlify.app/app.js | grep -F "const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = false;"
```

## Rollback Status

Rollback was not required during WP24.
