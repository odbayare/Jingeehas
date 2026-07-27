# QPay browser-independent recovery and callback design

Status: callback contract implemented. The supplied QPay API documents define a GET callback with an untrusted payment-id notification parameter. The callback is never treated as payment authority and independently retrieves the payment from QPay before changing Jingeehas state.

Implemented production-safe design:

1. QPay calls `GET <callback_url>?qpay_payment_id=<provider payment ID>`.
2. The callback returns `HTTP 200`, `Content-Type: text/plain`, body `SUCCESS` after safely handling the notification. It does not require a customer browser session.
3. The query parameter is only an untrusted trigger; the endpoint independently calls authenticated QPay `GET /v2/payment/{qpay_payment_id}`.
4. Exact payment ID, `PAID` status, amount `9,900`, currency `MNT`, `object_type=INVOICE`, persisted invoice association, product code, and unique provider payment ID are mandatory.
5. After a prepaid invoice is persisted, the server creates one high-entropy handoff credential. Only a hash and encrypted-at-rest token/code are stored; provider IDs and invoice IDs are not encoded in the credential.
6. The payment page exposes a copyable code and a fragment link at `/assessment/recover#token=<opaque-token>`. The client removes the fragment with `replaceState` before rendering or analytics and POSTs the token to `weight-access-handoff-redeem`.
7. Redemption is single-use, expiry-bound, rate-limited by hashed token/IP, creates one `assessment_sessions` row with `source=recovery`, preserves the original session, and returns only the safe next route. It does not grant entitlement or mark payment paid.
8. Callback provider lookup has a hashed payment-ID burst limit and hashed source-IP limit. Already-paid-and-entitled callbacks exit locally without a provider request. All valid and invalid GET callbacks return the same `SUCCESS` response.
9. After callback confirmation, the linked recovery session follows the normal entitlement gate and can open questions or a completed report. No second entitlement or ownership reassignment is possible.

The supplied documents do not define a callback signature or authenticated source header. No signature or source-IP allowlist is assumed. Rate limits store only bounded hashes. Unknown, malformed, unpaid, mismatched, expired, and rate-limited notifications remain non-authorizing and are handled with bounded diagnostics.
