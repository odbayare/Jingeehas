# WP27 Runtime Payload Test Coverage

## Test File

`tests/runtime-visible-surface-payload-connection.test.js`

## Coverage

- Both visible-surface guards remain false.
- Runtime payload builder exists.
- Runtime payload builder returns runtime context payload, not WP14 `test_only` payload.
- Runtime payload omits `internalDiagnostics` and `ownerDebug`.
- Runtime payload keeps safety outside payment.
- Runtime payload marks paid sections as paid-access only.
- Default `renderReport()` output remains unchanged while guard is false.
- Default `renderReport()` does not mutate state, payments, or entitlements.
- Enabled internal helper path renders:
  - unpaid: preview + safety
  - paid: preview + paid + safety
  - professional: safety only
  - urgent: safety only
- Rendered HTML does not leak adapter keys, fixture names, QPay/payment text, or medical claim language.

## Validation

- `node --check app.js`: PASS
- `node --check tests/runtime-visible-surface-payload-connection.test.js`: PASS
- `node tests/runtime-visible-surface-payload-connection.test.js`: PASS
- `npm test`: PASS; `All tests passed`
