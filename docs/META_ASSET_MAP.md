# Jingeehas Meta Asset Map

Updated: 2026-08-01

| Asset | Identifier | Status |
|---|---|---|
| Facebook Page | `61591885352742` | KNOWN; access not verified in this branch |
| Instagram account | UNKNOWN | BLOCKED |
| Business Portfolio | UNKNOWN | BLOCKED |
| Ad account | UNKNOWN | BLOCKED |
| Dedicated dataset/pixel | UNKNOWN | BLOCKED |
| Domain verification for `jingeehas.fit` | UNKNOWN | BLOCKED |
| CAPI access token | Secret; not stored in repository | REQUIRED |
| Graph/Marketing API version | `v25.0` default, environment-overridable | READY |
| Production Netlify site | Existing Jingeehas site | KNOWN; no deploy in this change |

## Isolation rule

Jingeehas must not reuse Astros, LifePattern, AI Course or Skill Matrix Page, Instagram identity, ad account, dataset/pixel, CAPI token, audience or campaign naming. If a shared ad account is temporarily unavoidable, every object must use the `JINGEEHAS` prefix and the `WEIGHT_TEST_ONE_TIME` product mapping.

## Activation gate

Do not set `META_CAPI_ENABLED=true` or `META_BROWSER_PIXEL_ENABLED=true` until the dedicated dataset/pixel ID, token permissions, domain, browser/server Test Events and deduplication are verified. Do not activate paid delivery until the exact ad account and Instagram identity are confirmed.
