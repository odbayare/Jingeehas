# WP22 Runtime Visible Surface Test Coverage

## Test File

`tests/runtime-visible-surface-integration.test.js`

## Assertions Covered

- `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION` defaults false;
- disabled integration returns the original report HTML unchanged;
- default `renderReport()` output remains unchanged;
- default `renderReport()` does not include visible prototype surface labels;
- enabled unpaid integration places preview plus safety;
- enabled paid integration places preview plus paid plus safety;
- professional mode places safety only;
- urgent mode places safety only;
- `professionalFirst: true` places safety only;
- `urgent: true` places safety only;
- `internalDiagnostics` never renders;
- `ownerDebug` never renders;
- adapter field names and raw fixture names do not render;
- QPay/payment/unlock/premium text does not render;
- diagnosis/treatment/medical-cause text does not render.

## Regression

Full regression command:

```bash
npm test
```
