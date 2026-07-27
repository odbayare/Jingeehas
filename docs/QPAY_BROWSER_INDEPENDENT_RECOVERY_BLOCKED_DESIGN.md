# QPay browser-independent recovery: callback-led design

Status: callback contract implemented. The supplied QPay API documents define a GET callback with an untrusted payment-id notification parameter. The callback is never treated as payment authority and independently retrieves the payment from QPay before changing Jingeehas state.

The production-safe design is:

1. QPay calls `GET <callback_url>?qpay_payment_id=<provider payment ID>`.
2. The callback returns `HTTP 200`, `Content-Type: text/plain`, body `SUCCESS` after safely handling the notification. It does not require a customer browser session.
3. The query parameter is only an untrusted trigger; the endpoint independently calls authenticated QPay `GET /v2/payment/{qpay_payment_id}`.
4. Exact payment ID, `PAID` status, amount `9,900`, currency `MNT`, `object_type=INVOICE`, persisted invoice association, product code, and unique provider payment ID are mandatory.
5. The server grants the existing idempotent entitlement and issues a short-lived, single-use recovery exchange token. Raw invoice IDs and provider payment IDs are never returned.
6. The user returns from an in-app browser to a normal browser with only that opaque exchange token. Redemption is POST-only, rate-limited by hashed IP and token, constant-response on failure, non-enumerable, and bound to the paid entitlement.
7. Successful redemption creates a new owned session link to the same assessment and entitlement. It cannot create a second entitlement or reassign payment ownership.

The supplied documents do not define a callback signature or authenticated source header. No signature or source IP is assumed. Unknown, malformed, unpaid, and mismatched notifications remain non-authorizing and are handled with bounded diagnostics.
