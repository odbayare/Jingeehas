# Jingeehas Meta Incident Runbook

Updated: 2026-08-01

## Immediate pause conditions

Pause affected paid delivery and preserve evidence when any of these occurs:

- Purchase events stop while confirmed QPay payments continue;
- Meta Purchase exceeds confirmed payments after deduplication allowance;
- value, currency or product code mismatch;
- sensitive assessment data appears in payloads, URLs, UTMs, names or logs;
- unknown active campaign or unauthorized budget mutation;
- ad account restriction, billing failure, token loss or dataset permission loss;
- landing, QPay, entitlement or report access failure;
- spend cap or pacing breach;
- at least 100 paid landing sessions are observed with zero provider-confirmed purchases;
- spend reaches the configured daily budget with zero provider-confirmed purchases after the observation gate.

## Current P0 incident

Campaign `52503252094202` has generated 1,365 paid landing sessions and 1,279 unique paid visitors with zero confirmed purchases in the observed campaign cohort. The free-funnel-live cohort has 157 paid landing sessions and zero purchases. This meets the high-traffic pause recommendation even though exact Meta spend and effective status remain UNKNOWN.

Canonical evidence:

`docs/JINGEEHAS_CAMPAIGN_INCIDENT_20260801.md`

Do not classify visits, CTA clicks, assessment starts or completions as sales success.

## Response sequence

1. Pause the affected ad/ad set/campaign without increasing any other budget.
2. Record exact time, product, object IDs, spend, confirmed payments and tracking state.
3. Disable `META_CAPI_ENABLED` and/or `META_BROWSER_PIXEL_ENABLED` when tracking itself is unsafe.
4. Do not revoke customer entitlement or alter confirmed payment records.
5. Compare provider-confirmed payments, production payments, internal `payment_confirmed` events and Meta events.
6. Identify duplicate, missing, delayed or misattributed events.
7. Rotate the CAPI token if exposure is suspected.
8. Repair in staging, rerun Test Events and deduplication certification.
9. Obtain a new exact approval if the campaign payload, creative or budget changes.
10. Resume only after post-verification and documented rollback readiness.

When Meta credentials are unavailable, record `pauseRecommended=true` and `pausePerformed=false`; do not claim the campaign was paused. Escalate the missing credential as a blocking incident and continue production/payment reconciliation.

## Sensitive-data incident

Treat any transmission of weight, BMI, answers, pattern/result information, report content, email, phone, recovery data or safety route as a security incident. Stop transmission, preserve minimal evidence without copying the sensitive value, rotate credentials as needed and document remediation.
