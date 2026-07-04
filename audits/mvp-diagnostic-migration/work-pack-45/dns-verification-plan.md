# WP45 DNS Verification Plan

## Context

- Netlify site name: `clever-souffle-1e5f74`
- Current production URL: `https://clever-souffle-1e5f74.netlify.app`
- DNS changes are owner action only.

## Verification Table

| Step | Owner action | Technical verification | Success signal |
| --- | --- | --- | --- |
| choose domain | Owner selects exact final domain and confirms root/subdomain preference. | Record exact domain spelling in the owner pack before any mapping or DNS verification. | Final domain is written down with no ambiguity. |
| add domain to Netlify | Owner approves or performs adding the domain to the correct Netlify site. | Check domain is assigned to Netlify site `clever-souffle-1e5f74`. | Netlify shows the domain attached to the intended site. |
| set DNS record | Owner updates DNS at the DNS provider. | Verify DNS record resolves toward Netlify using DNS lookup after propagation. | Domain resolves to Netlify target without stale or conflicting records. |
| verify SSL | Owner waits for DNS propagation and Netlify certificate provisioning. | Inspect HTTPS certificate status for the custom domain. | HTTPS loads without certificate warning. |
| verify root/www redirect | Owner confirms preferred redirect direction: `www` to root or root to `www`. | Request both hostnames and inspect redirect/status behavior. | Preferred hostname returns 200 and alternate hostname redirects as approved. |
| verify production page load | Owner approves checking the custom domain in browser or HTTP smoke. | Load custom domain root path and inspect status/body. | Public page loads successfully on the custom domain. |
| verify app assets load | Owner approves asset smoke on custom domain. | Confirm `styles.css`, `mockBackend.js`, and `app.js` load from relative paths. | No missing public app assets on custom domain. |
| verify report flow | Owner approves public flow smoke on custom domain. | Walk the public assessment/report flow without changing report logic. | Report/paywall/safety flow behaves like Netlify production URL. |
| verify QPay/payment implication | Owner confirms whether any payment-provider domain review is required separately. | Verify no QPay/backend/payment/pricing code diffs and document any external provider follow-up. | Payment code remains unchanged; any provider-domain work is separately tracked. |
| rollback to Netlify URL if needed | Owner confirms fallback messaging and rollback expectation. | Keep `https://clever-souffle-1e5f74.netlify.app` available as fallback while custom domain is corrected. | Owner has a clear fallback URL if domain/SSL/DNS is not ready. |

## Non-Actions

- WP45 does not change DNS.
- WP45 does not change Netlify domain mapping.
- WP45 does not deploy.
- WP45 does not change payment/backend/report logic.
