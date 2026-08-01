# Jingeehas Meta Asset Map

Updated: 2026-08-01

| Asset | Identifier / evidence | Status |
|---|---|---|
| Facebook Page candidate A | `1166984263175073` — prior authenticated Ads Manager audit labeled Жингээ Хас | WARNING; fresh Graph read required |
| Facebook Page candidate B | `61591885352742` — public/profile reference used during Page setup | WARNING; conflicts with candidate A |
| Instagram account | No connected identity found in prior audit | BLOCKED |
| Business Portfolio | UNKNOWN | BLOCKED |
| Ad account | `981721134334269` — prior authenticated audit: USD, Asia/Ulaanbaatar, status 1 | WARNING; shared multi-product account and fresh read required |
| Existing Jingeehas campaign | `52503252094202` — prior authenticated audit reported ACTIVE with raw daily budget `300` | WARNING; must reconcile before creating another campaign |
| Dedicated dataset/pixel | UNKNOWN | BLOCKED |
| Domain verification for `jingeehas.fit` | UNKNOWN | BLOCKED |
| CAPI access token | Secret; not stored in repository | REQUIRED |
| Marketing API token | Secret; not stored in repository | REQUIRED |
| Graph/Marketing API version | Must be explicitly configured and pass live preflight | REQUIRED |
| Production Netlify site | Existing Jingeehas site | DEPLOYMENT STATE UNKNOWN for Meta foundation |

## Evidence boundary

The identifiers above are provisional evidence from an earlier authenticated audit, not a current PASS. The guarded preflight must read the account, Page, Instagram identity, pixel/dataset and campaign list directly before any mutation. The Page-ID conflict must be resolved through a successful Page Graph read; no runtime code hardcodes either candidate.

## Isolation rule

The ad account is shared with other products, so separate-account isolation is not currently achieved. Until a dedicated account exists, every Jingeehas object must enforce all of the following:

- `JINGEEHAS` object-name prefix;
- destination host `jingeehas.fit`;
- product code `WEIGHT_TEST_ONE_TIME`;
- Jingeehas-only Page and Instagram identity;
- Jingeehas-only pixel/dataset;
- no reuse of Astros, LifePattern, AI Course or Skill Matrix audiences or events.

## Activation gate

Do not set `META_CAPI_ENABLED=true` or `META_BROWSER_PIXEL_ENABLED=true` until the dedicated pixel/dataset, token permissions, domain, browser/server Test Events and deduplication are verified. Do not create even PAUSED objects until the existing active Jingeehas campaign, Page identity, Instagram identity, monthly cap and audio rights are resolved by preflight and explicit acknowledgements.
