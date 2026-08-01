# Jingeehas Approval and Security

Updated: 2026-08-01

## Owner approval

Owner approved the following payload in chat on 2026-08-01 Asia/Ulaanbaatar:

- paid creative: `Jingeehas_Reel_Paid_Cut_V1.mp4`;
- Sales campaign optimized for Purchase;
- initial daily budget USD 3.00;
- target authoritative CPA ≤ USD 1.00;
- TIAS V3-style broad test and guarded optimization logic;
- tracking certification before ACTIVE delivery.

Approval does not authorize:

- a different creative, copy, CTA, destination, audience or optimization event;
- a daily budget above USD 3.00;
- a monthly/portfolio cap change;
- reuse of another product's Meta assets;
- activation before tracking and asset gates pass.

Any payload change invalidates this approval and requires a new explicit approval.

## Secret controls

- Meta access tokens exist only in server environment variables.
- Tokens, dataset IDs requiring confidentiality, billing information and user data must not appear in browser source, repository, logs, PR text or campaign names.
- Use least-privilege system-user access, 2FA and separate staging/production credentials.
- Browser config exposes only an enable flag, numeric Pixel ID, generic product code, price and currency.

## Audit record requirement

Every Meta mutation must record idempotency key, before/after state, object type and ID, budget impact, reason, approver, approval time, expiry, API result, post-verification and rollback status.
