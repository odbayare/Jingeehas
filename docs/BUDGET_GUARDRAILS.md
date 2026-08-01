# Jingeehas Budget Guardrails

Updated: 2026-08-01

## Approved limits

| Guardrail | Value | Status |
|---|---:|---|
| Initial daily budget | USD 3.00 | APPROVED |
| Target authoritative CPA | USD 1.00 maximum operating target | APPROVED target |
| Campaign/ad-set activation | Tracking and assets must PASS | REQUIRED |
| Single scale step | 10–15% maximum | APPROVED rule |
| Re-evaluation interval | 72 hours minimum | APPROVED rule |
| August 2026 product monthly ceiling | USD 93.00 | APPROVED DERIVED CEILING |
| Portfolio monthly cap / remaining capacity | UNKNOWN | BLOCKED |

The USD 93.00 product ceiling is the strict mathematical maximum of the approved USD 3.00 daily budget across all 31 days of August 2026. It does not increase the approved daily budget, authorize activation, or guarantee that Meta will spend the full amount.

## Economics

Gross price is 9,900 MNT. Maximum economically sustainable CPA cannot be certified until payment fees, tax, refund rate, variable cost and required contribution margin are known. USD 1.00 is therefore the owner-approved operating acquisition target and stop/hold threshold, not a certified contribution-margin CPA.

## Mutation enforcement

- Reject any create/update payload with daily budget above USD 3.00 unless a newer exact approval replaces it.
- Reject any August 2026 Jingeehas payload or cumulative pacing state that could exceed USD 93.00 product spend.
- Reject budget increases above 15% per action.
- Reject any second increase within 72 hours.
- Reject activation when portfolio cap or remaining capacity is missing.
- Reject activation when tracking, restrictions, billing, token or asset state is UNKNOWN/FAIL.
- Store before/after budget, cumulative monthly spend, reason, approver, approval timestamp, expiry and rollback status.

Meta delivery may vary around a daily budget. Monitoring must evaluate cumulative spend against the USD 3.00 daily setting, the USD 93.00 August product ceiling and the unresolved portfolio cap rather than assuming an exact per-day charge.
