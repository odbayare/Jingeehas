# WP55 Branded Subdomain Verification Checklist

## Recommendation

`HOLD - DNS REQUIRED BEFORE LIFEPATTERN LINK SWITCH`

## Verification Steps

| Step | Command / Check | Expected result | Current result |
| --- | --- | --- | --- |
| Netlify site mapping | `netlify api getSite --data '{"site_id":"fb4def02-8e5d-4f00-8996-8cae09ed836f"}'` | `custom_domain` is `weight.lifepattern.live` | Passed |
| DNS lookup | `nslookup weight.lifepattern.live` | Resolves to Netlify target | Blocked: `NXDOMAIN` |
| HTTPS root | `curl -I https://weight.lifepattern.live` | HTTP 200 | Blocked: could not resolve host |
| TLS certificate | `netlify api showSiteTLSCertificate --data '{"site_id":"fb4def02-8e5d-4f00-8996-8cae09ed836f"}'` | Certificate object present | Blocked: `null` |
| Fallback URL | `curl -I https://weight-loss-deep-pattern-9900.netlify.app` | HTTP 200 | Passed |
| App asset smoke | `curl -s https://weight-loss-deep-pattern-9900.netlify.app/app.js` | CTA, price, product code, QPay endpoints unchanged | Passed |

## Link Switch Rule

LifePattern card link may switch to `https://weight.lifepattern.live` only after the branded domain returns HTTP 200.

## Next Owner Action

Add DNS record:

`weight.lifepattern.live CNAME weight-loss-deep-pattern-9900.netlify.app`

Then rerun the verification steps above.
