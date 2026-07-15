# WP54 Primary CTA Update Summary

## Summary

Updated the active public Weight Loss landing CTA from:

`Тест үнэлгээг эхлүүлэх`

to:

`Тест эхлэх`

## Scope

- User-facing CTA copy only.
- Button behavior remains `setView('choice')`.
- No route, payment, entitlement, scoring, report, backend, or QPay endpoint logic changed.

## Guardrails Preserved

- Price remains `9,900₮`.
- `STANDARD_WEIGHT_PRICE_MNT` remains `9900`.
- Product code remains `WEIGHT_TEST_ONE_TIME`.
- QPay endpoints remain:
  - `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-create-invoice`
  - `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-check-payment`
- Paid-first gate unchanged.
- Protected folder untouched.

## Validation

- `git diff --check` passed.
- `node --check app.js` passed.
- `node --check tests/primary-cta-text.test.js` passed.
- `node tests/primary-cta-text.test.js` passed.
- `node tests/paid-first-gate-emergency.test.js` passed.
- `npm test` passed.
- CTA grep confirmed `Тест эхлэх` is present.
- Old CTA grep confirmed `Тест үнэлгээг эхлүүлэх` is absent from `app.js` and `tests`.

## Deploy

- Deploy ID: `6a48d05617f0202ae76da01f`
- Production URL: `https://weight-loss-deep-pattern-9900.netlify.app`
- Unique deploy URL: `https://6a48d05617f0202ae76da01f--weight-loss-deep-pattern-9900.netlify.app`

## Post-Deploy Smoke

- Production URL returned HTTP 200.
- Live `app.js` contains `Тест эхлэх`.
- Live `app.js` does not contain `Тест үнэлгээг эхлүүлэх`.
- Live `app.js` keeps `STANDARD_WEIGHT_PRICE_MNT = 9900`, `WEIGHT_TEST_ONE_TIME`, and existing QPay endpoints.
