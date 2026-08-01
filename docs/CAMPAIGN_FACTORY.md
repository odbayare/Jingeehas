# Jingeehas Campaign Factory

Updated: 2026-08-01
Status: OWNER APPROVED PAYLOAD; META OBJECTS NOT CREATED

## Approved Reel V1 draft

| Level | Name / setting |
|---|---|
| Campaign | `JINGEEHAS | Sales | Purchase | Reel V1 | 2026-08-01` |
| API objective | `OUTCOME_SALES` |
| Buying type | `AUCTION` |
| Campaign budget | Off; ad-set budget control |
| Campaign status | `PAUSED` on creation |
| Ad set | `JINGEEHAS | MN | Broad 25-65 | Purchase | USD3 | V1` |
| Conversion location | Website |
| Optimization | `OFFSITE_CONVERSIONS` + `PURCHASE` |
| Bid strategy | `LOWEST_COST_WITHOUT_CAP` |
| Daily budget | USD 3.00; raw minor-unit value `300` only after account currency is confirmed USD |
| Geography | Mongolia |
| Age | 25–65 |
| Gender | All |
| Audience | Broad; no sensitive interests or assessment-result targeting |
| Placements | No placement restriction in draft; Meta-compatible broad delivery |
| Creative | `JINGEEHAS | Paid Cut V1 | Video | 9x16` |
| Ad | `JINGEEHAS | Paid Cut V1 | Learn More | V1` |
| Page | Runtime preflight must resolve the conflicting Page candidates |
| Instagram | Must be present and exactly match the configured Jingeehas identity |
| CTA | `LEARN_MORE` |
| Destination | Approved `jingeehas.fit` URL and generic UTM only |

Approved destination:

`https://jingeehas.fit/?utm_source=meta&utm_medium=paid_social&utm_campaign=jingeehas_sales_purchase_reel_v1&utm_content=paid_cut_v1&utm_term=broad_25plus`

## Builder modes

`tools/meta-jingeehas-draft.mjs` supports three explicit modes:

1. `--plan` — local payload and approval-fingerprint output; no network request.
2. `--preflight` — read-only account, Page, Instagram, pixel and campaign audit.
3. `--execute-paused <media.mp4>` — guarded creation of PAUSED campaign, ad set, video, creative and ad.

The execute mode is blocked unless all required IDs and secrets are supplied at runtime, the monthly cap and audio rights are explicitly acknowledged, the approved payload fingerprint matches, preflight returns PASS, and no active/exact duplicate Jingeehas campaign exists.

## Mutation and rollback rules

- Every created campaign, ad set and ad must have requested status `PAUSED`.
- Post-read verification must prove no created delivery object is ACTIVE and the ad-set daily budget is exactly `300` minor units.
- Any partial failure triggers reverse-order deletion attempts for every newly created object, including uploaded ad video.
- Runtime audit records contain IDs, state, budget impact, approval fingerprint and rollback result, but never access tokens.
- Do not activate if the payload differs from this document.
- Do not substitute Traffic, Engagement or Landing Page View optimization for Purchase without a separate owner decision.
- Do not enable creative features that generate or alter copy, crop, imagery or video treatment.

## Public Page Reel boundary

The guarded builder creates an ad video/creative and PAUSED ad; it does not claim that a public Page Reel was published. Public Page Reel publication is a separate external mutation requiring the resolved Page identity, Page-level permission, commercial audio-rights confirmation and a post-publication read-back.
