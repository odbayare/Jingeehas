# WP45 Custom Domain Owner Decision Checklist

## Current Production Context

- Netlify site name: `clever-souffle-1e5f74`
- Current production URL: `https://clever-souffle-1e5f74.netlify.app`
- Metadata readiness commit: `2efb7e3 Add custom domain metadata readiness`

## Owner Decisions Needed

- Owner must choose final domain.
- Confirm whether the domain is already purchased.
- Confirm DNS provider.
- Decide whether the public address should be root domain or subdomain.
- Decide whether `www` should redirect to root or root should redirect to `www`.
- Confirm who will make DNS changes.
- Confirm whether Netlify domain mapping should be owner action or separately approved technical action.
- Confirm whether any deploy is approved later if production release is needed.

## Boundary

WP45 does not modify DNS without owner action.

- No DNS change.
- No Netlify domain mapping change.
- No deploy.
- No PDF generation.
- No payment/backend/QPay/pricing/entitlement change.
- No report logic change.
- Protected folder `audits/sprint-36-paid-depth-prototype/` untouched.
