# WP54 Branded Domain Migration Checklist

## Preferred Domain

`https://weight.lifepattern.live`

## Current State

| Check | Result | Evidence |
| --- | --- | --- |
| Current Weight Loss production URL | Active | `https://weight-loss-deep-pattern-9900.netlify.app` returned HTTP 200. |
| Preferred branded domain DNS | Not configured | `nslookup weight.lifepattern.live` returned `NXDOMAIN`. |
| Preferred branded domain HTTP | Not reachable | `curl -I https://weight.lifepattern.live` could not resolve host. |
| DNS change | Not performed | WP54 does not modify DNS blindly. |
| LifePattern link change | Deferred | Do not point LifePattern to `weight.lifepattern.live` until DNS and Netlify mapping are live. |

## Owner Actions Needed

1. Confirm `weight.lifepattern.live` as the final Weight Loss branded subdomain.
2. Add `weight.lifepattern.live` to the `weight-loss-deep-pattern-9900` Netlify site domain settings.
3. Add the required DNS record at the LifePattern DNS provider.
4. Wait for Netlify SSL to become active.
5. Verify `https://weight.lifepattern.live` returns HTTP 200.
6. Verify Weight Loss app assets load under the branded domain.
7. Verify QPay create/check endpoints still work from the branded domain.
8. Only after the branded domain is live, update LifePattern root Weight Loss card link from the Netlify URL to `https://weight.lifepattern.live`.

## Technical Checklist

| Step | Owner / Technical action | Success signal |
| --- | --- | --- |
| Domain approval | Owner confirms `weight.lifepattern.live`. | Domain decision recorded. |
| Netlify mapping | Add subdomain to Weight Loss Netlify site. | Netlify shows domain assigned to correct site. |
| DNS record | Add DNS record requested by Netlify. | `nslookup weight.lifepattern.live` resolves. |
| SSL | Wait for Netlify managed certificate. | HTTPS returns valid certificate and HTTP 200. |
| Asset smoke | Load `/app.js` and `/styles.css`. | Both return HTTP 200 from branded domain. |
| App smoke | Open root page. | Landing renders `Илүүдэл жингээс салах тест үнэлгээ`. |
| Payment smoke | Create/check QPay invoice without completing payment. | Amount/product/endpoints unchanged; pending does not unlock. |
| LifePattern link update | Update TIAS repo card URL after branded domain is live. | `https://www.lifepattern.live` no longer exposes the Netlify URL for Weight Loss. |
| Rollback | Revert LifePattern card URL to Netlify URL if branded domain fails. | Root card remains functional. |

## Recommendation

`HOLD - BRANDED DOMAIN DNS REQUIRED`
