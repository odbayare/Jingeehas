# WP39 Incident Response Runbook

## Incident Table

| Incident | Detection signal | Immediate action | Rollback / fix path |
| --- | --- | --- | --- |
| site down | Production URL does not return a usable page, returns repeated non-200 responses, or users report total load failure. | Check Netlify deploy status and confirm whether the issue is deploy-wide or local/network-specific. | If tied to latest release, roll back to the last known good deploy or revert the suspected commit, then run `npm test`. |
| report surface missing | Unpaid report no longer shows the public visible preview or expected report surface. | Pause launch promotion and reproduce with the unpaid report path. | Restore the last known good report rendering change; validate with public visible surface and launch smoke tests. |
| paid content visible without access | Paid-only depth appears for unpaid / locked users. | Treat as a launch blocker and stop further promotion. | Revert the gating-related change immediately; validate unpaid, paid, professional, and urgent paths before redeploy. |
| safety guidance hidden | Safety guidance is missing from unpaid, paid, failed payment, professional, or urgent output. | Treat as a safety blocker and stop launch activity until restored. | Restore ungated safety guidance and validate with smoke, trust, and monitoring tests. |
| QPay/payment confusion | Users cannot understand payment retry/recheck state, or payment failure appears to remove free preview/safety guidance. | Confirm whether this is copy confusion or actual payment behavior failure. | If copy-only, prepare a minimal copy patch; if payment behavior, escalate separately without changing pricing or entitlement logic ad hoc. |
| internal leak | Public output includes `internalDiagnostics`, `ownerDebug`, `fixtureName`, `runtimeGate`, `decisionStatus`, or `rendererMode`. | Treat as a release blocker and capture the exact route/output. | Remove the leak, run internal leak tests, and redeploy only after public output is clean. |
| mobile layout issue | Report, paywall, CTA, or safety copy is clipped, overlapped, or unreadable on mobile. | Reproduce on a mobile viewport and identify whether it blocks comprehension or payment. | Patch the smallest layout/readability issue and validate with mobile visible surface QA. |
| copy/trust complaint | User feedback flags shame framing, medical overclaim, fake urgency/scarcity, or confusing paid/free boundary. | Capture exact copy and route, then classify severity. | Make minimal trust-safe copy polish; do not add fear, pressure, fake scarcity, or medical diagnosis/treatment claims. |
| deploy rollback needed | A confirmed production blocker cannot be safely patched immediately. | Stop new release activity and identify the last known good deploy/commit. | Roll back via Netlify deploy controls or revert the suspected commit, then run validation before any new production deploy. |

## Rollback Commands

```bash
git revert fd56961
npm test
```

## Guard Checks After Any Incident Fix

```bash
grep -F "const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;" app.js
grep -F "const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;" app.js
```

## Production Boundary

- Do not change QPay, backend, payment behavior, pricing, product code, or entitlement logic during incident triage unless the owner explicitly approves that scope.
- Do not hide safety guidance behind payment.
- Do not show paid depth without access.
- Do not generate PDF as part of incident response.
