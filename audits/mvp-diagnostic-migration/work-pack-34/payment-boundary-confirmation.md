# WP34 Payment Boundary Confirmation

| Boundary | Result | Evidence |
| --- | --- | --- |
| price constants unchanged | PASS | `tests/payment-qpay-production-hardening-audit.test.js` asserts price labels and numeric constants in `app.js`, plus `PRODUCT_AMOUNTS` in `mockBackend.js`. |
| QPay endpoint unchanged | PASS | Test asserts the create/check endpoint strings remain `/.netlify/functions/qpay-create-invoice` and `/.netlify/functions/qpay-check-payment`. |
| product code unchanged | PASS | Test asserts `WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME"` and the mock backend one-time product-code mapping. |
| entitlement logic unchanged | PASS | Test asserts helper source expressions and behavior for local flags, paid QPay status, and backend entitlement state. |
| paid depth gated | PASS | Unpaid render rejects paid-only depth; paid render requires paid depth. |
| safety guidance ungated | PASS | Unpaid, paid, failed payment, professional, and urgent renders require `Аюулгүй байдлын сануулга`. |
| payment failed does not hide safety | PASS | Failed payment render requires free-preview preservation and retry/recreate-QR wording. |
| professional/urgent safety only | PASS | Professional and urgent renders reject ordinary paid depth, ordinary experiment, and paid CTA. |
| no fake urgency | PASS | Test rejects fake urgency, fake scarcity, limited-seat/last-chance wording, fear-pressure phrases, and shame-pressure phrases. |
| no internal leak | PASS | Test rejects internal diagnostic/runtime/test metadata in rendered output. |
| no render storage mutation | PASS | Test spies on global `localStorage` and rejects render-time set/remove calls. |
| no backend mutation from render | PASS | Test snapshots `mockBackend.getMockBackendState()` around render calls and requires equality. |
