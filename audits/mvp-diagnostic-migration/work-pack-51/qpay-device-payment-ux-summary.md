# WP51 QPay Device Payment UX Summary

## Decision

Desktop and laptop payment surfaces are QR-first. Mobile browser, mobile webapp, and coarse-pointer payment surfaces are app-grid-first, with QR available only as an optional collapsed secondary control.

## Changed Files

- `app.js`
- `styles.css`
- `tests/qpay-device-payment-ux.test.js`
- `tests/run-all.js`
- `audits/mvp-diagnostic-migration/work-pack-51/qpay-device-payment-ux-summary.md`
- `audits/mvp-diagnostic-migration/work-pack-51/OWNER_REVIEW_PACK_WP51.md`

## Desktop Behavior

- Renders a large centered QPay QR code first.
- Keeps QPay app/bank links secondary.
- Keeps invoice reference visible.
- Keeps payment retry and back actions visible.

## Mobile Behavior

- Renders QPay app/bank links as the primary touch-friendly grid.
- Uses logo/icon values from QPay invoice URL data when present.
- Uses a neutral app-name badge fallback when invoice URL data has no logo.
- Keeps QR hidden by default inside a collapsed `QR кодоор төлөх` control.

## QPay Regression Boundary

- One-time label remains `9,900₮`.
- `STANDARD_WEIGHT_PRICE_MNT` remains `9900`.
- QPay amount remains `9900`.
- Product code remains `WEIGHT_TEST_ONE_TIME`.
- QPay endpoints remain on `https://www.lifepattern.live/.netlify/functions/...`.
- Pending QPay payment does not unlock the test.
- Paid-first gating and entitlement logic were not changed.

## Validation

- `node --check app.js` passed.
- `node --check tests/qpay-device-payment-ux.test.js` passed.
- `node tests/qpay-device-payment-ux.test.js` passed.
- `node tests/live-payment-qpay-flow-qa.test.js` passed.
- `node tests/payment-qpay-production-hardening-audit.test.js` passed.
- `node tests/paid-first-gate-emergency.test.js` passed.
- `npm test` passed.
- `git diff --check` passed.

## Deploy

- Deploy ID: `6a4890bcf7d97f893bc61d6d`
- Production URL: `https://weight-loss-deep-pattern-9900.netlify.app`
- Unique deploy URL: `https://6a4890bcf7d97f893bc61d6d--weight-loss-deep-pattern-9900.netlify.app`

## Post-Deploy Smoke

- Production URL returned HTTP 200.
- Live `app.js` contains `qpay-desktop-primary`, `qpay-mobile-primary`, `normalizeQpayAppLinks`, `STANDARD_WEIGHT_PRICE_MNT = 9900`, `WEIGHT_TEST_ONE_TIME`, and unchanged QPay endpoints.
- Live `styles.css` contains `qpay-app-grid`, `qpay-mobile-primary`, `qpay-desktop-primary`, `qpay-qr-large`, and the mobile/coarse-pointer responsive rule.
