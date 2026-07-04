# WP45 Owner Review Pack - Custom Domain Owner Action / DNS Verification

## Recommendation

CUSTOM DOMAIN OWNER ACTION READY

## Changed Files

- `audits/mvp-diagnostic-migration/work-pack-45/custom-domain-owner-decision-checklist.md`
- `audits/mvp-diagnostic-migration/work-pack-45/dns-verification-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-45/netlify-domain-mapping-notes.md`
- `audits/mvp-diagnostic-migration/work-pack-45/wp46-domain-activation-scope.md`
- `audits/mvp-diagnostic-migration/work-pack-45/work-pack-45-recommendation.md`
- `audits/mvp-diagnostic-migration/work-pack-45/OWNER_REVIEW_PACK_WP45.md`

## Production Context

- Netlify site name: `clever-souffle-1e5f74`
- Current production URL: `https://clever-souffle-1e5f74.netlify.app`
- Metadata readiness commit: `2efb7e3 Add custom domain metadata readiness`

## Owner Decisions Needed

- Choose final custom domain.
- Confirm whether the domain is already purchased.
- Confirm DNS provider.
- Decide root domain vs subdomain.
- Decide `www` to root or root to `www` redirect direction.
- Confirm who will perform DNS changes.
- Confirm whether Netlify domain mapping will be owner action or separately approved technical action.
- Confirm whether a future deploy is approved if production release is needed.

## DNS Plan

The DNS verification plan covers:

- choose domain.
- add domain to Netlify.
- set DNS record.
- verify SSL.
- verify root/`www` redirect.
- verify production page load.
- verify app assets load.
- verify report flow.
- verify QPay/payment implication.
- rollback to Netlify URL if needed.

## Netlify Mapping Notes

- No Netlify config file changes approved.
- Domain mapping should be done through Netlify UI unless owner explicitly approves config change.
- Expected checks include domain assignment to site `clever-souffle-1e5f74`, active SSL, latest valid production deploy, and public app file loading.
- WP45 does not deploy.

## WP46 Scope

`WP46 — Custom Domain Activation / SSL Verification` may use the owner-provided domain, verify Netlify domain mapping, verify DNS/SSL, verify production page load on the custom domain, verify report/paywall/safety flow on the custom domain, and deploy only if owner explicitly requests a redeploy.

WP46 must not change QPay/backend/payment/pricing, change report logic, generate PDF, render `internalDiagnostics` or `ownerDebug`, or touch protected folder `audits/sprint-36-paid-depth-prototype/`.

## Validation

- `git status --short` reviewed WP45 working tree state.
- `git diff --check` passed.
- Guard grep checks passed for `ENABLE_VISIBLE_SURFACE_PROTOTYPE = false` and `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true`.
- `npm test` passed.
- Forbidden runtime/test/deploy diff checks were empty.
- WP14 runtime adapter diff checks were empty.
- `git diff --cached --name-only` was empty.

## No Code Changes

- No `app.js` change.
- No `index.html` change.
- No `styles.css` change.
- No `mockBackend.js` change.
- No `package.json` change.
- No `_redirects` change.

## No Test Changes

- No `tests/run-all.js` change.
- No test file changes.

## Explicit Non-Actions

- No DNS change.
- No Netlify domain mapping change.
- No deploy.
- No PDF generation.
- No payment/backend change.
- No QPay/pricing/entitlement change.
- No report logic change.

## Protected Folder

Protected folder `audits/sprint-36-paid-depth-prototype/` was not touched, staged, moved, deleted, or committed.
