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
- spend cap or pacing breach.

## Response sequence

1. Pause the affected ad/ad set/campaign without increasing any other budget.
2. Record exact time, product, object IDs, spend, confirmed payments and tracking state.
3. Disable `META_CAPI_ENABLED` and/or `META_BROWSER_PIXEL_ENABLED` when tracking itself is unsafe.
4. Do not revoke customer entitlement or alter confirmed payment records.
5. Compare provider-confirmed payments, production payments, internal `payment_confirmed` events and Meta events.
6. Identify duplicate, missing, delayed or misattributed events.
7. Rotate the CAPI token if exposure is suspected.
8. Repair in staging, rerun Test Events and deduplication certification.
9. Obtain approval if the campaign payload or budget must change.
10. Resume only after post-verification and documented rollback readiness.

## Sensitive-data incident

Treat any transmission of weight, BMI, answers, pattern/result information, report content, email, phone, recovery data or safety route as a security incident. Stop transmission, preserve minimal evidence without copying the sensitive value, rotate credentials as needed and document remediation.
