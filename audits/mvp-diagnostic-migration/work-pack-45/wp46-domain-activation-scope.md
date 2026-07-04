# WP46 Domain Activation Scope

## Work Pack

WP46 — Custom Domain Activation / SSL Verification

## WP46 May

- Use owner-provided domain.
- Verify Netlify domain mapping.
- Verify DNS/SSL.
- Verify production page load on custom domain.
- Verify report/paywall/safety flow on custom domain.
- Deploy only if owner explicitly requests a redeploy.

## WP46 Must Not

- Change QPay/backend/payment/pricing.
- Change report logic.
- Generate PDF.
- Render `internalDiagnostics` or `ownerDebug`.
- Touch protected folder `audits/sprint-36-paid-depth-prototype/`.

## Owner Inputs Required

- Exact custom domain.
- Confirmation that owner DNS action is complete.
- Preferred root/`www` redirect direction.
- Explicit deploy approval if a redeploy is requested.

## Validation Expectations

- Custom domain resolves correctly.
- SSL is active with no browser warning.
- Root/`www` behavior matches owner decision.
- Public page and relative assets load.
- Report/paywall/safety flow behaves like the current Netlify production URL.
- No QPay/backend/payment/pricing diffs.
- No report logic diffs.
- Protected folder remains untouched.
