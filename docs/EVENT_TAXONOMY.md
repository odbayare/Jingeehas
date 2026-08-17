# Jingeehas Event Taxonomy

Updated: 2026-08-01

## Meta events

| Event | Browser | Server | Authority |
|---|---:|---:|---|
| `PageView` | Yes | No | Page render after Pixel config is enabled |
| `ViewContent` | Yes | No | Landing/product content render |
| `InitiateCheckout` | Yes | No | QPay invoice exists in `pending` or `paid` state |
| `Purchase` | Yes | Yes | Provider-confirmed QPay payment, exact server-stored transaction amount (39,000 MNT current draft or 9,900 MNT legacy), stable provider payment ID and active entitlement path |

## Purchase contract

- Event name: `Purchase`.
- Event ID: deterministic `jh_purchase_<sha256-prefix>` derived from generic product code plus provider payment authority.
- Browser `eventID` and server `event_id` must be identical.
- Value: actual server-created payment amount (`39000` for new V2a transactions; `9900` for legitimate legacy transactions).
- Currency: `MNT`.
- Content ID/product code: `WEIGHT_TEST_ONE_TIME`.
- Order ID: local payment ID; provider payment ID is not exposed to the browser.
- Admin, owner preview and automated test events are excluded from production CAPI delivery.

## Forbidden payload fields

Never transmit assessment ID, raw answers, question IDs, weight, BMI, body measurements, eating-behaviour answers, psychological pattern names, report content, scores, email, phone, recovery contacts, safety route, diagnosis or treatment data.

## Internal analytics

Existing privacy-preserving `payment_confirmed` remains the reconciliation event. Meta attribution does not replace confirmed QPay payment or the production order/payment record.
