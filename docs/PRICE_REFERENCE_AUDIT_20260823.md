# 19,900 MNT price reference audit

Audit date: 2026-08-23  
Current authority: `product-config.js` → `FULL_REPORT_PRICE_MNT = 19900`, `priceVersion = p19900_v1`

The post-change repository search covers `39000`, `39,000`, `39 000`, `39k`, `9900`, `9,900`, product constants, payment amounts, UI, functions, migrations, tests, generated manifests, admin analytics, and Meta draft tooling. There are zero unexplained current-live 39,000/9,900 offer references.

| Classification | Remaining references |
|---|---|
| `CURRENT_LIVE_BUG` | None |
| `LEGACY_REQUIRED` | `product-config.js`, payment verification, Meta CAPI actual-amount allowlist, DB amount constraints, advisor commission ceiling, admin historical labels, clean-control analytics, persisted revenue aggregation |
| `HISTORICAL_DOCUMENTATION` | dated certification/deploy snapshots, virtual-cohort audit, prior launch/owner records explicitly marked or intrinsically dated |
| `TEST_FIXTURE` | payment compatibility, historical cohort/revenue, stale 39,000 invoice, CAPI actual-amount, admin segmentation, and UI non-leak assertions under `tests/` |
| `MIGRATION_HISTORY` | `20260818090000_allow_paywall_v2a_price.sql`, `PAYWALL_V2A_39000_DRAFT.md`, and named V2a transformation compatibility code |

Current live paths derive 19,900 MNT from the shared catalog: landing, post-assessment paywall, checkout, terms disclosure, QPay invoice creation, new-event offer metadata, production/staging manifests, and current admin heading. The active approved Meta creative is no-price; the guarded future paused-draft builder is also no-price and imports the current product amount only for its internal plan contract.

Historical 9,900 and 39,000 values are retained only where the stored transaction/exposure or named historical cohort must remain truthful. The migration contains no payment, entitlement, or revenue-row rewrite.
