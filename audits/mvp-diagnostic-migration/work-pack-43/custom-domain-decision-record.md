# WP43 Custom Domain Decision Record

## Current Findings

- Title present: `Жин хасалтын гүн зураглал`
- Meta description missing.
- Open Graph/social preview metadata missing.
- Favicon/icon references missing.
- No current Netlify URL hardcoded in `index.html`, `app.js`, or `mockBackend.js`.
- Public shell uses relative asset/script refs and is custom-domain friendly.
- DNS/deploy/PDF/payment/backend/QPay/pricing/entitlements untouched.

## Decision Table

| Decision area | Current state | Recommendation | Owner decision needed |
| --- | --- | --- | --- |
| custom domain | Current production URL is `https://clever-souffle-1e5f74.netlify.app`; no custom domain is configured in this pack. | Choose the final public domain before metadata or canonical URL work. | Approve exact custom domain spelling. |
| DNS setup | DNS was not changed. | Keep DNS unchanged until owner approves a domain implementation window. | Approve DNS provider access/action and timing. |
| Netlify domain mapping | Netlify domain mapping was not changed. | Prepare mapping notes in WP44 after the custom domain is approved. | Approve whether WP44 may add/map the domain in Netlify. |
| SSL | SSL was not inspected or changed for a custom domain. | Verify SSL only after owner DNS action and Netlify domain mapping. | Approve post-DNS SSL verification scope. |
| public product name | Current title/product wording is `Жин хасалтын гүн зураглал`. | Keep current name unless owner wants a launch-brand rename. | Confirm final public product name. |
| title/meta description | Title is present; meta description is missing. | Add owner-approved title/meta description in WP44. | Approve final title and meta description copy. |
| social preview | Open Graph/social preview metadata is missing. | Add owner-approved social preview tags after domain/name decision. | Approve Open Graph title, description, image, and canonical URL. |
| favicon/app icon | Favicon/icon references are missing. | Add favicon/app icon references only if approved assets exist. | Approve icon assets or decide to defer. |
| QPay/payment domain implication | No QPay/backend/payment/pricing/entitlement files were changed; no current Netlify URL is hardcoded in public HTML/app/mock backend surfaces. | Keep payment scope separate; do not change QPay/backend/payment/pricing during domain metadata work. | Confirm whether any payment-provider domain review is needed outside WP44. |
| rollback | No DNS/deploy/runtime changes were made, so rollback is documentation-only for WP43. | For WP44, record how to revert metadata and Netlify domain mapping notes before any approved deploy. | Approve rollback expectation before implementation. |

## Boundary

- No DNS change.
- No deploy.
- No PDF generation.
- No QPay/backend/payment/pricing/entitlement change.
- Protected folder `audits/sprint-36-paid-depth-prototype/` untouched.
