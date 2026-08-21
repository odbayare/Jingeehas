# Жингээ Хас 39,000₮ clean-control measurement contract

## Cohort boundary

The clean control includes only acquisition sessions whose locked first-touch field is exactly:

`utm_content = price_aligned_39000_control_v1`

The acquisition row is the first `free_assessment_started` event for a `funnel_key_hash`. Later direct visits or later UTM values do not overwrite it. Any funnel or assessment touched by an admin, owner-preview, or test event is excluded. Assessments linked through `assessment_sessions.source = 'owner'` are also excluded.

## Canonical metrics

| Metric | Canonical grain | Window / denominator | Exclusions | Deduplication key |
|---|---|---|---|---|
| Visitors | anonymous visitor with an exact clean-control landing | selected Ulaanbaatar date window | non-clean UTM, legacy, Reel, unattributed, owner/test | `visitor_id_hash` |
| Assessment starts | first clean start event per assessment funnel | start event occurred in selected window | same cohort exclusions | `free_assessment_started + funnel_key_hash` |
| Assessment completions | first clean completion event per assessment funnel | completion event occurred in selected window | same cohort exclusions | `free_assessment_completed + funnel_key_hash` |
| Safety-flow bypass | completed clean assessment mapped to canonical `report_mode = safety` or non-null `safety_route` | clean completions | same cohort exclusions | HMAC mapping from assessment ID to `funnel_key_hash` |
| Commercial eligible | completed clean assessment without a safety route | clean completions | same cohort exclusions | HMAC mapping from assessment ID to `funnel_key_hash` |
| Confirmed paywall view | first server-validated post-assessment paywall event | clean attributed funnel; event in selected window | safety routes cannot create this event | `post_assessment_paywall_viewed + funnel_key_hash` |
| Paywall CTA | first full-report CTA event | clean attributed funnel; event in selected window | same cohort exclusions | `full_report_cta_clicked + funnel_key_hash` |
| Invoice | first invoice-created event | clean attributed funnel; event in selected window | same cohort exclusions | `invoice_created + funnel_key_hash` |
| Provider-confirmed paid | first payment-confirmed event after provider verification | clean attributed funnel; event in selected window | QA/preview/unknown commercial payments excluded upstream | `payment_confirmed + funnel_key_hash` |
| Merchant-settled paid | unavailable | no settlement ledger exists | never inferred from provider confirmation | not applicable |
| Revenue | sum of clean provider-confirmed payment event amounts | selected window, MNT | legacy 9,900₮ and all non-clean payments excluded | one amount per deduplicated payment-confirmed funnel |

## Canonical rates

| Rate | Numerator | Denominator |
|---|---|---|
| LPV → Start | clean landing visitors with a later clean start | clean landing visitors |
| Start → Completion | clean starts with a later completion | clean starts |
| Completion → Safety bypass | safety classifications | clean completions |
| Completion → Commercial eligible | eligible classifications | clean completions |
| Eligible → Paywall | eligible assessments with confirmed paywall | commercial eligible assessments |
| Paywall → CTA | clean CTA events after paywall | confirmed clean paywall views |
| CTA → Invoice | clean invoices after CTA | clean CTA events |
| Invoice → Provider-confirmed paid | clean provider-confirmed payments after invoice | clean invoices |
| LPV → Provider-confirmed paid | clean provider-confirmed payments | clean landing visitors |

Every rendered rate must show its numerator and denominator. A stage count divided by another independently windowed stage count is diagnostic only and must not be labelled as a linked cohort conversion.

## Reconciliation contracts

- `completed = safety_bypass + commercial_eligible`. Any unmatched canonical assessment is visible as unclassified and fails the invariant.
- `commercial_eligible = eligible_paywall_confirmed + explained_delivery_exception`. The exception count is visible; it is never folded into safety bypass.
- The main event funnel uses first event per `event_name + funnel_key_hash` and `occurred_at` windowing.
- The question-progress panel uses canonical assessment `started_at`, `status`, and `completed_at`. These counts are intentionally labelled as a different grain.
- The first-time visitor card assigns a visitor to the date of their first landing after the free-flow cutover. Campaign visitor rows count visitors who landed during the selected window. Returning visitors explain the current 248 versus 256 difference.

## Experiment checkpoint

Checkpoint 1 is 20 clean completions. Before 20, status is `COLLECTING`. At or after 20:

- eligibility rate at least 40%: `READY FOR CHECKPOINT`, continue toward 20 clean paywall views;
- eligibility rate 30–39%: `EARLY WARNING`, continue while inspecting traffic composition;
- eligibility rate below 30%: `EARLY WARNING`, flag acquisition-fit concern.

This status never changes campaign delivery or safety rules automatically.
