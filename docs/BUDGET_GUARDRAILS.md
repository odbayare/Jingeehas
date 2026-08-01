# Jingeehas Budget Guardrails

Updated: 2026-08-01

## Approved limits

| Guardrail | Value | Status |
|---|---:|---|
| Initial daily budget | USD 3.00 | APPROVED |
| Target authoritative CPA | USD 1.00 maximum target | APPROVED target |
| Campaign/ad-set activation | Tracking and assets must PASS | REQUIRED |
| Single scale step | 10–15% maximum | APPROVED rule |
| Re-evaluation interval | 72 hours minimum | APPROVED rule |
| Monthly product cap | UNKNOWN | BLOCKED |
| Portfolio cap | UNKNOWN | BLOCKED |

## Economics

Gross price is 9,900 MNT. Maximum economically sustainable CPA cannot be certified until payment fees, tax, refund rate, variable cost and required contribution margin are known. USD 1.00 is therefore an acquisition target, not a certified maximum CPA.

## Mutation enforcement

- Reject any create/update payload with daily budget above USD 3.00 unless a newer approval explicitly replaces it.
- Reject budget increases above 15% per action.
- Reject any second increase within 72 hours.
- Reject activation when monthly cap is missing.
- Reject activation when tracking, restrictions, billing, token or asset state is UNKNOWN/FAIL.
- Store before/after budget, reason, approver, approval timestamp, expiry and rollback status.

Meta delivery may vary around a daily budget; monitoring must evaluate cumulative spend against both daily pacing and the unresolved monthly cap rather than assuming an exact per-day charge.
