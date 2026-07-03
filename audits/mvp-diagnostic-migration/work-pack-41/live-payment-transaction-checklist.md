# WP41 Live Payment Transaction Checklist

## Owner-Assisted Flow

- [ ] Open production URL: `https://clever-souffle-1e5f74.netlify.app`.
- [ ] Complete the test until the unpaid / locked report appears.
- [ ] Confirm preview is visible.
- [ ] Confirm safety guidance is visible.
- [ ] Confirm paid depth is locked.
- [ ] Click payment CTA.
- [ ] Confirm invoice / QR / bank links appear.
- [ ] Record timestamp, browser, device, and URL.
- [ ] Owner decides whether to complete real payment.

## If Payment Is Completed

- [ ] Confirm payment status check.
- [ ] Confirm entitlement unlock.
- [ ] Confirm paid report visible.
- [ ] Reload page and confirm access persists.
- [ ] Record final result as `LIVE PAYMENT PASSED` if all checks pass.

## If Payment Is Not Completed

- [ ] Do not simulate or force payment completion.
- [ ] Record as owner-deferred live transaction.
- [ ] Final result: `LIVE PAYMENT DEFERRED BY OWNER`.

## Issue Capture

- Timestamp:
- Browser:
- Device:
- URL:
- Screenshot path:
- Payment state:
- Owner decision:
- Result enum:
- Notes:
