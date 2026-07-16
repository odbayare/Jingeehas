# Staging recovery certification

Current status: **IMPLEMENTATION PASS / LIVE DELIVERY WAITING** — database-backed rate limiting, encryption/hash configuration, sender settings, and provider-mock tests pass. Resend domain verification, `RECOVERY_DELIVERY_API_KEY`, a current database gateway credential, staging deployment approval, and an owner-designated test email remain external gates.

## Configuration and privacy boundary

- Channel: normalized email addresses only. Phone recovery is explicitly unavailable.
- `RECOVERY_ENCRYPTION_KEY`: base64-encoded 32-byte AES-256-GCM key.
- `RECOVERY_HASH_PEPPER`: at least 32 characters, distinct from the encryption key.
- `RECOVERY_DELIVERY_API_URL=https://api.resend.com/emails` and `RECOVERY_DELIVERY_API_KEY`: Resend HTTPS email delivery.
- `RECOVERY_SENDER_EMAIL=no-reply@mail.jingeehas.fit`, `RECOVERY_SENDER_NAME=Jingeehas`, and `RECOVERY_CHANNEL=email`.
- `RECOVERY_RATE_LIMIT_STORE=database`: confirms that challenge/rate records use the shared database, not process memory.

The database stores a keyed lookup hash and AES-GCM ciphertext, not plaintext contact data. Plaintext exists only in server memory while calling the delivery adapter. Codes, secrets, full contacts, ciphertext, and provider credentials must not be logged. Evidence may contain only a masked destination and opaque provider-message ID.

## Delivery contract

The recovery service gives `{ channel, destination, code, expiresInMinutes }` to the adapter. The adapter posts Resend's `from`, `to`, `subject`, `text`, and `html` fields to `https://api.resend.com/emails` with a bearer API key. It requires an opaque provider message ID in the successful response. Challenge evidence records `pending`, `sent`, `failed`, `suppressed`, or `superseded`, plus an attempted timestamp and opaque provider identifier.

Configured sender: `Jingeehas <no-reply@mail.jingeehas.fit>`. Resend domain status remains **PENDING**. The subject is `Jingeehas тайлан сэргээх баталгаажуулах код`; the body contains only the six-digit code, expiry, ignore-if-not-requested notice, no-share warning, and Jingeehas support identity.

Provider-mock coverage passes for success, 4xx, 5xx, timeout, invalid JSON, missing provider ID, secret-log suppression, and absence of assessment/report/payment content.

The provider timeout is eight seconds. The application does not automatically retry a timed-out send because duplicate delivery can confuse recipients. A user-initiated resend creates a new code, supersedes older active challenges, and counts toward the hourly abuse limit. Database uniqueness enforces a one-minute cooldown independently for contact, IP, and session; rolling limits are five per contact, twenty per IP, and five per session per hour. Code consumption and wrong-attempt increments are row-locked in PostgreSQL.

## Abuse and lifecycle controls

- Six cryptographically random digits; only the hash is stored.
- Ten-minute expiry; maximum five confirmation attempts.
- Maximum five requests per contact, five per session, and twenty per IP per rolling hour in shared database storage, with one-minute cooldown uniqueness for each dimension.
- New request invalidates older unconsumed challenges for that rate key.
- Unknown contacts receive the same public response and a `suppressed` record; no message is sent.
- Successful use marks the challenge used, verifies the contact, creates a new HTTP-only session, and links only the entitled assessment.
- A used, expired, superseded, or five-attempt challenge cannot restore access.

## Owner-assisted staging script

Do not run until the exact phrase `STAGING DEPLOY APPROVED` has been supplied and the owner has designated a staging-only test contact.

1. Record staging deployment ID and commit SHA.
2. Create and pay one approved QPay sandbox assessment as described in `QPAY_SANDBOX_CERTIFICATION.md`.
3. In a clean browser context, open `/recovery` and submit the masked designated contact.
4. Record delivery state, masked destination, opaque provider ID, request and receipt timestamps.
5. Submit one deliberately wrong code and confirm the attempt counter increments without revealing eligibility.
6. Request a resend and verify the previous code becomes `superseded` and cannot be used.
7. Enter the newest code and verify the entitled assessment/report appears in the clean browser.
8. Retry the used code and confirm rejection.
9. Verify exactly one recovered assessment-session link for the new session.
10. Exercise the hourly resend ceiling without sending messages to any non-designated contact.
11. Remove or revoke staging certification records under the agreed retention procedure.

## Evidence required

- Deployment ID and commit SHA
- Masked channel/destination
- Challenge IDs and states (never code/hash)
- Provider opaque ID and timestamps
- Expiry, attempt, resend, supersession, and used-code results
- New-browser session and assessment ownership result
- Entitlement/report restoration result
- Rate-limit storage/result
- Cleanup result
- Owner/operator and final PASS/FAIL decision
