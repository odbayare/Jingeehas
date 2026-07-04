# WP55 Branded Subdomain Netlify Mapping Record

## Target

- Weight Loss Netlify project: `weight-loss-deep-pattern-9900`
- Site ID: `fb4def02-8e5d-4f00-8996-8cae09ed836f`
- Desired branded domain: `https://weight.lifepattern.live`
- Existing production fallback: `https://weight-loss-deep-pattern-9900.netlify.app`

## Netlify Mapping Result

`weight.lifepattern.live` was added to the Weight Loss Netlify site as the custom domain.

Evidence from `netlify api getSite`:

| Field | Result |
| --- | --- |
| `custom_domain` | `weight.lifepattern.live` |
| `url` | `http://weight.lifepattern.live` |
| `ssl_url` | `https://weight.lifepattern.live` |
| `domain_aliases` | `[]` |
| `deploy_id` | `6a48d05617f0202ae76da01f` |
| `automatic_tls_provisioning` | `true` |

## Current Blocker

DNS is not configured yet.

| Check | Result |
| --- | --- |
| `nslookup weight.lifepattern.live` | `NXDOMAIN` |
| `curl -I https://weight.lifepattern.live` | Could not resolve host |
| `showSiteTLSCertificate` | `null` |
| `curl -I https://weight-loss-deep-pattern-9900.netlify.app` | HTTP 200 |

## Required DNS Action

Create the DNS record with the LifePattern DNS provider:

| Host | Type | Target |
| --- | --- | --- |
| `weight` | `CNAME` | `weight-loss-deep-pattern-9900.netlify.app` |

Do not update LifePattern's Weight Loss card link until:

1. `nslookup weight.lifepattern.live` resolves.
2. `https://weight.lifepattern.live` returns HTTP 200.
3. Netlify TLS certificate is active.
4. Weight Loss app assets load from the branded domain.

## Boundary Confirmation

- No Weight Loss product logic changed.
- No price changes.
- `9,900₮` remains current.
- `STANDARD_WEIGHT_PRICE_MNT = 9900` remains current.
- Product code remains `WEIGHT_TEST_ONE_TIME`.
- QPay endpoints remain unchanged.
- Paid-first gate unchanged.
- Scoring/report logic unchanged.
- Backend/payment/entitlement unchanged.
- Protected folder untouched.
