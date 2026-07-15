# WP57 No-Account Contact Capture Summary

## Result

No-account contact capture MVP is implemented before QPay payment for the Weight Loss one-time test flow.

## Public Flow

1. Landing page
2. `Тест эхлэх`
3. Contact info capture
4. QPay payment
5. Payment confirmed
6. Test opens
7. Report appears on screen
8. User can copy the report
9. User can print or save as PDF through browser print

## User-Facing Copy Added

```text
Бүртгэл шаардлагагүй.

Төлбөр баталгаажсаны дараа тест нээгдэнэ. Тест бөглөсний дараа таны тайлан шууд дэлгэц дээр гарна.
```

## Contact Capture

- Captures optional name.
- Requires at least one recovery/support contact: phone or email.
- Does not create a login or account.
- Does not claim backend report delivery.
- Does not send email.
- Does not create a permanent report link.

## Payment Gate

- QPay invoice UI is hidden until contact info is saved.
- `createWeightQpayInvoice()` also guards against direct invoice creation before saved contact info.
- Paid-first assessment gate remains unchanged: only confirmed paid access opens the test.

## Report Delivery UI

- Paid report remains visible on screen.
- Added `Тайлан хуулж авах` button.
- Added `Хэвлэх / PDF хадгалах` button using browser print.
- Shows saved contact info as support/recovery context.

## Invariants Preserved

- Price remains `9,900₮`.
- `STANDARD_WEIGHT_PRICE_MNT = 9900`.
- Product code remains `WEIGHT_TEST_ONE_TIME`.
- QPay endpoints remain:
  - `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-create-invoice`
  - `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-check-payment`
- No backend/payment/entitlement changes.
- No report scoring logic changes.
- Protected folder untouched.
