# Jingeehas Product Registry

Updated: 2026-08-01
Owner: Э.Одбаяр
Timezone: Asia/Ulaanbaatar

## Product

| Field | Value | Status |
|---|---|---|
| Product code | `WEIGHT_TEST_ONE_TIME` | PASS |
| Public name | Илүүдэл жингээс салах тест үнэлгээ | PASS |
| Domain | `https://jingeehas.fit` | PASS |
| Price | 9,900 MNT, one-time | PASS |
| Commercial flow | Free assessment → initial result → optional 9,900 MNT full report | PASS |
| Source of truth | Provider-confirmed QPay payment | PASS |
| Primary Meta objective | Sales | APPROVED |
| Optimization event | Purchase | BLOCKED until Test Events PASS |
| Target authoritative CPA | ≤ USD 1.00 | APPROVED target, not guaranteed |
| Initial daily budget | USD 3.00 | APPROVED |
| Execution mode | APPROVED_EXECUTION, tracking-first | ACTIVE spend still BLOCKED |
| Product daily cap | USD 3.00 | APPROVED |
| Product monthly cap | UNKNOWN | BLOCKED |
| Net revenue assumptions | Fees, tax, refunds and variable cost UNKNOWN | WARNING |

## Prohibited marketing data

Do not send weight, BMI, body measurements, answers, psychological pattern names, scores, report content, safety answers, email, phone, child data or diagnosis-related data to Meta assets, URLs, UTMs, event metadata, campaign names or logs.

## Allowed Meta commerce data

`value`, `currency`, `order_id`, `content_ids`, `content_type`, generic `product_code`, browser identifiers required for event matching, and request IP/user-agent at the server event boundary.
