# QPay browser-independent recovery: blocked secure design

Status: not deployed. The current QPay Merchant V2 public documentation and downloadable Postman collection do not define a callback signature, authenticated source header, request method, or callback payload contract. A callback-derived recovery shortcut would therefore be insecure.

The production-safe design is:

1. QPay calls a dedicated callback endpoint using a documented, verifiable provider-origin contract.
2. The endpoint resolves a merchant-generated opaque invoice reference, then independently calls QPay `/v2/payment/check`.
3. Exact amount `9,900`, the persisted invoice association, and a non-empty unique provider payment ID are mandatory.
4. The server grants the existing idempotent entitlement and issues a short-lived, single-use recovery exchange token. Raw invoice IDs and provider payment IDs are never returned.
5. The user returns from an in-app browser to a normal browser with only that opaque exchange token. Redemption is POST-only, rate-limited by hashed IP and token, constant-response on failure, non-enumerable, and bound to the paid entitlement.
6. Successful redemption creates a new owned session link to the same assessment and entitlement. It cannot create a second entitlement or reassign payment ownership.

Information required from QPay before implementation:

- callback HTTP method and exact query/body schema;
- signature or authenticated-source mechanism, including canonicalization and replay window;
- official source-IP ranges only if IP allowlisting is part of the contract;
- retry schedule and required acknowledgement response;
- sandbox fixture or signed sample callback.
