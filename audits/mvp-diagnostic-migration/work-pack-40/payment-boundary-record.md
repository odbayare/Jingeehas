# WP40 Payment Boundary Record

| Boundary | Result | Evidence |
| --- | --- | --- |
| prototype guard | PASS | `tests/live-payment-qpay-flow-qa.test.js` asserts `ENABLE_VISIBLE_SURFACE_PROTOTYPE = false`. |
| runtime visible integration guard | PASS | `tests/live-payment-qpay-flow-qa.test.js` asserts `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true`. |
| price constants | PASS | Test asserts price labels and MNT constants remain unchanged. |
| product code | PASS | Test asserts `WEIGHT_TEST_ONE_TIME` remains unchanged. |
| QPay create endpoint | PASS | Test asserts `/.netlify/functions/qpay-create-invoice` remains unchanged. |
| QPay check endpoint | PASS | Test asserts `/.netlify/functions/qpay-check-payment` remains unchanged. |
| QPay payload | PASS | Test asserts create payload uses `WEIGHT_TEST_PRODUCT_CODE` and `currentOneTimePriceMnt()`. |
| unpaid gating | PASS | Test asserts unpaid output shows CTA/safety and hides paid depth. |
| paid access | PASS | Test asserts paid output shows paid report depth. |
| failed payment | PASS | Test asserts retry/help copy and safety guidance remain visible. |
| entitlement helpers | PASS | Test asserts unpaid false, paid QPay true, and backend entitlement true paths. |
| internal leak | PASS | Test denies `internalDiagnostics`, `ownerDebug`, `fixtureName`, `runtimeGate`, `decisionStatus`, and `rendererMode`. |
| pressure copy | PASS | Test denies fake urgency, fake scarcity, and fear/shame pressure terms. |
| localStorage mutation | PASS | Test wraps render paths with a mutation spy and denies `setItem` / `removeItem`. |
