# Paywall V2a + 39,000₮ draft audit

Status: **DRAFT_ONLY — pending production publication**. The public production price remains 9,900₮ until an owner-authorized release and required database migration.

## Preflight

- Baseline `origin/main`: `0e1713a9db7b1a2da9bf2b62e618c16a5bb32455`
- Branch: `codex/paywall-v2a-39000-draft`
- Isolated worktree: `/Users/odbayare/Documents/Codex/jingeehas-paywall-v2a-39000-draft`
- Initial isolated-worktree status: clean
- Canonical workspace was dirty and was not modified.

## Pricing-reference classification

The repository-wide audit covered `9900`, `9,900`, `9,900₮`, `WEIGHT_TEST_ONE_TIME`, `PRODUCT.amount`, and `PRODUCT.displayPrice`. Every match falls under the path-level classifications below; generated `dist`, `staging`, and runtime manifests are validated separately after builds.

### Current runtime

`app.js`; `meta-pixel.js`; `netlify/functions/_lib/{assessment,config,meta-capi,payment,qpay}.js`; `database/schema.sql`; `supabase/migrations/20260818090000_allow_paywall_v2a_price.sql`; `tools/{apply-mongolian-copy-hotfix,apply-paywall-v2a-39000,apply-post-assessment-payment-copy-v1,apply-post-assessment-paywall-approved-copy-v1,apply-post-assessment-paywall-flow-v1,build-staging,generate-production-manifest,verify-production-package,verify-qpay-config,verify-staging-package}.mjs`.

The older V1 transform files remain compatibility inputs, but the final V2a overlay is authoritative and runs after them. `netlify/functions/_lib/{admin,advisor}.js` and corresponding schema references use 9,900 only as the existing advisor commission ceiling/totals assumption; these are not the product-price authority and were left unchanged because commission economics were not authorized for redesign. `.github/workflows/jingeehas-netlify-production.yml` contains 9900 only in the established Netlify site identifier, not a price.

### Current tests

`tests/{meta-capi,paid-first-flow,post-assessment-paywall-flow,question-bank,security}.test.js`; `tests/contracts/{advisor-auth,assessment,free-initial-result-funnel,payment,recovery}.contract.test.js`; `tests/e2e/{product-flow.spec,server}.js`. Current product expectations use 39,000; explicit 9,900 cases verify legacy transaction compatibility. Analytics test fixtures retain historical/synthetic 9,900 revenue where the fixture is specifically about prior data rather than current catalog pricing.

### Current documentation

`README.md`; `docs/{PRODUCT_REGISTRY,EVENT_TAXONOMY,TRACKING_AND_CAPI}.md`. These describe 39,000 as pending production publication and do not claim it is live.

### Historical evidence / intentionally unchanged

`artifacts/staging-package-manifest.json` before regeneration; `audits/virtual-cohort-v1/QUALITY_AUDIT.md`; `docs/{AUDIENCE_CREATIVE_POLICY,BUDGET_GUARDRAILS,CAMPAIGN_STOP_LOSS_STATE_20260801.json,LAUNCH_MARKETING_PACK,META_ASSET_MAP,NETLIFY_PRODUCTION_DEPLOY_20260801.json,OWNER_LAUNCH_REVIEW,PRODUCTION_CERTIFICATION,QPAY_SANDBOX_CERTIFICATION}.md`; `tools/{meta-jingeehas-draft,run-virtual-cohort-audit}.mjs`; dated or snapshot-oriented tests including campaign attribution, daily funnel analytics, and report snapshot versioning.

These files truthfully record the previous 9,900 period, synthetic historical fixtures, or paused ad-creative state. They were not globally rewritten. Meta campaigns, audiences, creative, budgets, Pixel/Dataset settings, QPay merchant settings, and production data were not mutated.

## Measurement contract

- Primary KPI after an owner-authorized publish: confirmed revenue / eligible paywall exposure.
- Also report: confirmed payment / eligible paywall exposure.
- Secondary diagnostic: valid full-report CTA initiation / paywall exposure.
- Treatment begins at the actual production publish timestamp. Earlier observations remain a pre-V2 historical benchmark, not a causal A/B control.
