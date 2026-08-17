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
| Price | 39,000 MNT, one-time — DRAFT_ONLY, pending production publication; live price remains 9,900 MNT | DRAFT |
| Commercial flow | Free assessment → sealed paywall → optional 39,000 MNT personalized full report | DRAFT |
| Source of truth | Provider-confirmed QPay payment | PASS |
| Production source | `d239c99239404306a06074ebfbacd615b7b70914` | PASS |
| Production deploy | Netlify `6a6dbae714b3bb6785cdcdcf` | PASS |
| Landing policy | Neutral/non-diagnostic production copy | PASS |
| Meta tracking foundation | Pixel/CAPI code deployed, disabled by default | PASS FOUNDATION / DELIVERY BLOCKED |
| Primary Meta objective | Sales | APPROVED |
| Optimization event | Purchase | BLOCKED until Test Events PASS |
| Target authoritative CPA | ≤ USD 1.00 | APPROVED operating target, not guaranteed |
| Initial daily budget | USD 3.00 | APPROVED |
| Execution mode | APPROVED_EXECUTION, tracking-first | ACTIVE spend still BLOCKED |
| Product daily cap | USD 3.00 | APPROVED |
| August 2026 product monthly ceiling | USD 93.00 | APPROVED DERIVED CEILING |
| Portfolio cap / remaining capacity | UNKNOWN | BLOCKED |
| Net revenue assumptions | Fees, tax, refunds and variable cost UNKNOWN | WARNING |

## Production tracking state

```json
{
  "enabled": false,
  "pixelId": "",
  "productCode": "WEIGHT_TEST_ONE_TIME",
  "amount": 39000,
  "currency": "MNT"
}
```

The disabled state is intentional until a dedicated Jingeehas dataset/pixel, read credential, domain state, Test Events and browser/server Purchase deduplication are verified.

## Prohibited marketing data

Do not send weight, BMI, body measurements, answers, psychological pattern names, scores, report content, safety answers, email, phone, child data or diagnosis-related data to Meta assets, URLs, UTMs, event metadata, campaign names or logs.

## Allowed Meta commerce data

`value`, `currency`, `order_id`, `content_ids`, `content_type`, generic `product_code`, browser identifiers required for event matching, and request IP/user-agent at the server event boundary.
