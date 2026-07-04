# WP59 Weight Loss Funnel / Report Event Tracking Summary

## Scope

WP59 adds real client-side Weight Loss event tracking for events that happen in the no-account paid-first flow. It does not change scoring, report logic, QPay payment creation/check logic, price, entitlement rules, or backend payment confirmation.

## Events Emitted

- `landing_viewed`
- `contact_submitted`
- `qpay_invoice_requested`
- `qpay_invoice_created`
- `payment_check_started`
- `payment_confirmed`
- `test_started`
- `test_completed`
- `report_generated`
- `report_copy_clicked`
- `report_print_clicked`

## Tracking Destination

Events are sent to:

`https://www.lifepattern.live/.netlify/functions/track-funnel-event`

Each event includes product-scoped metadata:

- `product_code: WEIGHT_TEST_ONE_TIME`
- `product_label: Илүүдэл жингээс салах тест үнэлгээ`
- `amount_mnt: 9900`

Contact fields, names, raw answers, secrets, and token-like values are not sent as analytics metadata.

## Non-Changes

- Price remains `9,900₮`.
- Amount remains `9900`.
- Product code remains `WEIGHT_TEST_ONE_TIME`.
- QPay endpoints remain unchanged.
- Paid-first gate remains unchanged.
- Report/scoring logic remains unchanged.
- No fake funnel, completion, report, or visitor metrics were added.
