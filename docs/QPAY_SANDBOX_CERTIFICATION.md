# QPay sandbox certification

Current status: **PROVIDER SANDBOX UNAVAILABLE / SAFE LIVE CONFIGURATION PASS**. The authenticated TIAS/LifePattern source uses the live `merchant.qpay.mn` Merchant V2 environment and exposes no isolated sandbox/test endpoint. Its reusable merchant configuration is installed in Jingeehas production with the Jingeehas callback origin and protected product/price invariants. Configuration verification and an authenticated pre-provider live probe pass without creating an invoice or calling QPay.

## Configuration-only readiness

Required variables are `QPAY_API_BASE_URL`, `QPAY_CLIENT_ID`, `QPAY_CLIENT_SECRET`, `QPAY_INVOICE_CODE`, `QPAY_CALLBACK_ORIGIN`, `QPAY_ALLOWED_APP_SCHEMES`, and `QPAY_ALLOWED_HTTPS_HOSTS`. `npm run verify:qpay-config` validates their shape, HTTPS origins, and allowlists without making a network request.

The live probe authenticates a disposable Jingeehas session and submits an intentionally nonexistent assessment ID. HTTP 404 proves the production function loaded QPay configuration before the request failed safely at assessment ownership; no provider request, invoice, payment, entitlement, or residual session remains.

Protected invariants: product `WEIGHT_TEST_ONE_TIME`, amount `9900`, display price `9,900₮`, create endpoint `/.netlify/functions/qpay-create-invoice`, and check endpoint `/.netlify/functions/qpay-check-payment`.

Authentication uses `POST /v2/auth/token`; creation uses `POST /v2/invoice`; verification uses `POST /v2/payment/check`. The server owns product/amount, session and assessment ownership, invoice reuse/expiry, and safe application links. A callback URL is a notification location only; it never substitutes for provider payment verification or user authorization. Duplicate callbacks/checks must not create a second entitlement or commission.

## Exact owner-assisted lifecycle

Run only after both `STAGING DEPLOY APPROVED` and `QPAY SANDBOX TEST APPROVED` are present.

1. Start a fresh staging session.
2. Pass the free safety and eligibility gate.
3. Enter a designated recovery contact.
4. Create an assessment draft.
5. Create one sandbox invoice.
6. Verify product code `WEIGHT_TEST_ONE_TIME` and amount `9900` in server and sandbox records.
7. Inspect the QR and confirm every application/HTTPS link is allowlisted.
8. Complete the sandbox payment using the owner-approved sandbox instrument.
9. Use the server payment-check action.
10. Verify exactly one payment record and the expected transitions (`creating → pending → checking → paid`).
11. Verify exactly one active entitlement.
12. When an advisor invitation is used, verify exactly one pending advisor commission for the payment.
13. Complete the assessment.
14. Retrieve the entitled report in the original browser.
15. Recover the report in a second clean browser context using `STAGING_RECOVERY_CERTIFICATION.md`.
16. Repeat payment check and callback notification; verify no duplicate entitlement or commission.
17. Verify advisor access, payment, recovery, and admin audit evidence without exposing answers or contacts.
18. Revoke or clean up sandbox certification records under the owner-approved retention procedure.

Also exercise invoice reuse before expiry, replacement after expiry, wrong product/amount rejection, wrong session/assessment rejection, provider-check failure, `paid_but_not_unlocked` repair, unsafe link filtering, and duplicate-check concurrency. Do not create a second invoice merely to test idempotency.

## Evidence record

- Staging deployment identifier:
- Commit SHA:
- Payment record ID:
- Assessment ID:
- Invoice ID (masked):
- Product code:
- Amount:
- Payment state transitions and timestamps:
- Entitlement count:
- Advisor commission count/not applicable:
- Original-browser report result:
- Recovery result:
- Duplicate check/callback result:
- Relevant audit-log opaque IDs:
- Cleanup result:
- Owner/operator:
- Final status: **PROVIDER SANDBOX UNAVAILABLE; CONTROLLED OWNER-ASSISTED LIVE PAYMENT REQUIRED**

Never record credentials, tokens, full invoice identifiers, full contacts, QR payloads, or private assessment answers.
