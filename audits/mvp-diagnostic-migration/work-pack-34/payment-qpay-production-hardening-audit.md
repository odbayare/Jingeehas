# WP34 Payment / QPay Production Hardening Audit

## Scope

WP34 is audit-only. It inspects payment/QPay production readiness and adds regression coverage without changing payment behavior, pricing, QPay endpoints, backend behavior, entitlement logic, report logic, deploy config, or PDF output.

## Inspected Surfaces

- Price constants in `app.js`.
- `WEIGHT_TEST_PRODUCT_CODE`.
- QPay create/check endpoint strings.
- One-time amount helper behavior.
- `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, and `hasUpgradeAccess()`.
- `mockBackend.js` product amount map, product-code mapping, and entitlement type creation.
- Unpaid one-time report output.
- Paid one-time report output.
- Payment failed one-time report output.
- Professional-first report output.
- Urgent safety report output.
- Render-time `localStorage` behavior.
- Render-time mock backend state behavior.

## Findings

| Area | Result | Evidence |
| --- | --- | --- |
| guards | PASS | `ENABLE_VISIBLE_SURFACE_PROTOTYPE = false` and `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true` remain asserted in the WP34 test. |
| price constants | PASS | WP34 test asserts all public price labels plus `STANDARD_WEIGHT_PRICE_MNT`, `COACH_WEIGHT_PRICE_MNT`, `COACH_COMMISSION_MNT`, and `WEIGHT_TEST_AMOUNT_MNT`. |
| QPay endpoints | PASS | WP34 test asserts `/.netlify/functions/qpay-create-invoice` and `/.netlify/functions/qpay-check-payment`. |
| product code | PASS | WP34 test asserts `WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME"` and the mock backend one-time product-code mapping. |
| entitlement helpers | PASS | WP34 test asserts source helper expressions and behavior for false access, local paid flags, paid QPay status, and backend one-time entitlement. |
| unpaid output | PASS | Unpaid report keeps safety visible and does not show paid-only depth or paid cycle sections. |
| paid output | PASS | Paid report shows paid depth and experiment sections. |
| payment failed output | PASS | Failed payment output keeps safety visible, keeps first signal visible, and offers retry/recreate-QR wording. |
| professional/urgent | PASS | Professional and urgent outputs remain safety-only and do not show ordinary paid depth, ordinary experiment, or paid CTA. |
| internal leak | PASS | WP34 test rejects `internalDiagnostics`, `ownerDebug`, `fixtureName`, `runtimeGate`, `decisionStatus`, and `rendererMode`. |
| payment copy | PASS | WP34 test rejects fake urgency, fake scarcity, fear pressure, and shame-pressure phrases. |
| render storage mutation | PASS | WP34 test verifies render paths do not call `localStorage.setItem` or `localStorage.removeItem`. |
| backend mutation | PASS | WP34 test snapshots mock backend state and verifies render paths do not mutate it. |

## Conclusion

WP34 audit found no production-hardening blocker in the currently deployed payment/QPay boundary. No behavior changes were made.
