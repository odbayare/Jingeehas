# Jingeehas gifting — local review candidate

This checkout is `/Users/odbayare/Documents/Codex/2026-10-10/task-2/Jingeehas`, branch `codex/gifting-review`. No push, PR creation, merge, deployment, hosted migration, real invoice/payment, live email, or configuration credential change was performed.

## Baseline and discovery

Fetched `odbayare/Jingeehas` and based this branch on main `916087012bd139aee279d21dfef69bd56796a63d`, the audited PR #70 release. Read the recent PRs (including open paywall draft #68), all available remote branch names and gift-related commit history; no existing gifting implementation was found. #68 and the original user checkout are untouched. The original local checkout was stale and dirty, so work lives in an independent clone.

The independently fetched public production manifest SHA-256 is `10703712bf8590ad82a72c2a7503fab4951e94f78972eb5df95ed20e36006f6f`, exactly matching PR #70's release record. This is lineage evidence, not a payment/configuration certification. No repository AGENTS.md exists on this baseline; the global AGENTS.md is empty. Relevant local memory cautions that historical production/price/measurement records must be reconfirmed. The Supabase skill was read; its current RLS docs were checked: https://supabase.com/docs/guides/database/postgres/row-level-security . The changelog markdown could not be fetched with the web tool.

## Review behavior

- Landing has a secondary **Бэлэглэх** link. `/gift.html` uses the existing product catalog: one recipient, current 19,900 MNT, optional 280-character encouraging note, no recipient identity/email collection.
- The recipient can decline without consuming anything. Explicit acceptance atomically creates a fresh private V5 assessment with an active full-report entitlement. Existing assessment questions, scoring, safety classification, report snapshots and recovery flows run unchanged. The buyer receives only order/payment state, never recipient identity, assessment ID, answers, weight, health context or report.
- Self-gifting is supported through the same explicit acceptance and creates a separate own assessment. Paying alone never grants assessment/report access.
- Gift orders use their own table and invoice reference namespace (`jg_`). The existing QPay client creates/checks invoices; the existing provider callback dispatches those references to the gift path. Ordinary payments and their callback, analytics and CAPI behavior remain on their original path. Gift orders do not create ordinary `payments` rows or ordinary purchase/CAPI events.
- Only a provider PAID row with the exact server amount and payment ID can confirm a pending order. Callback repeats are idempotent. A late valid confirmation can recover a paid invoice beyond the 15-minute display timer. Unpaid, wrong-amount and provider-error orders issue no gift. Verified late funds on canceled or closed orders are retained as paid_review, with no automatic gift issuance; ordinary payment-ID conflicts are also held for review. An ambiguous invoice create is retained for reconciliation, never retried by creating another provider invoice. One unresolved invoice per buyer is enforced in SQL.
- Buyers generate a shareable fragment link only after confirmed payment. Tokens have 256 random bits; only SHA-256 hashes persist. Gift pages load no analytics/Meta scripts, remove the fragment immediately, use no-referrer, POST tokens in request bodies, and render notes as text. Link generation rotates the previous token. Links default to 30 days, configurable through the non-secret JINGEEHAS_GIFT_LINK_DAYS (1–365); **the purchased, unclaimed entitlement itself has no expiry in this proposed implementation**.
- The buyer can save a separate offline recovery code to recover order management in a new browser/session and obtain a fresh link. Only its hash persists; the code is shown on demand and must be saved by the buyer. It never grants recipient assessment access. Regenerating the recovery code invalidates the old one. If both session and saved code are lost, the existing owner can perform audited recovery after independently verifying buyer identity; this revokes old buyer capabilities and cannot change a claimed recipient. See SUPPORT_AND_RELEASE.md.
- Claims lock the gift row and commit the safety-check shell, recipient-owned assessment, entitlement and claimed state together. Concurrent claim attempts produce one winner. Same-recipient retries resume the existing assessment; other recipients/replayed or expired links get a generic unavailable result. Recovery after recipient-session loss uses the existing recipient-controlled assessment email recovery if they saved their own recovery email; it does not use the buyer's code.
- The new POST API requires a valid existing session, same HTTPS origin, and the existing preview gate. `JINGEEHAS_GIFTING_ENABLED` defaults off. This non-secret switch has not been installed or enabled anywhere. Existing callbacks for gift references can reconcile previously created obligations even if the purchase switch is later disabled.

## Proposed database change — NOT applied

`schema-proposal.sql` is outside the migration directory intentionally: the installed Supabase executable fails with `bad CPU type in executable`, so its required migration-generation command cannot run on this Mac. Generate a proper migration with a working CLI only at the approved release stage.

The proposal adds private `jingeehas.gift_orders`, RLS, constraints and indexes; makes `entitlements.payment_id` nullable; adds a unique gift-order reference and an exactly-one-source CHECK. All existing ordinary entitlement rows retain their payment source. No existing row is updated. A seeded historical 9,900 MNT ordinary entitlement was verified byte-for-byte unchanged across the proposal. A separate service-only RPC is routed by the existing authenticated gateway; the ordinary RPC is unchanged. The private transactional function follows the existing privileged gateway architecture with an empty search path, explicit service-role JWT check and revoked PUBLIC/anon/authenticated execution. The public wrapper is SECURITY INVOKER. This is a deliberate service-only transaction boundary, not an auth-identity shortcut.

No new configuration secrets are generated. Gift/recovery bearer tokens are per-purchase capabilities, not platform credentials. Nothing grants purchaser access to `assessment_sessions`.

## Validation and reproduction

Run `npm ci`, then:

```sh
npm test
npm run test:gifting
npm run test:contracts
npm run test:e2e
npm run verify:production-package
npm run build:staging
npm run verify:staging-package
git diff --check
```

`@electric-sql/pglite` is pinned at 0.4.6 with a lockfile as a dev dependency. `tests/gifting.test.js` executes the exact proposed SQL in a disposable PostgreSQL WASM engine with a mocked QPay provider and synthetic sessions. It exercises idempotent invoice creation and callbacks, provider failures/amount mismatch, no unpaid link issuance, cross-buyer denial, concurrent one-winner claims, explicit acceptance, forced mid-claim transaction rollback, replay, expired link/rotation without losing the purchase, buyer-code recovery/rebinding, self-gift, cancellation, ambiguous create, unresolved-invoice guard, buyer/recipient ownership, no ordinary payment writes, SQL role denial and the default-disabled/same-origin gates.

Browser tests use generated production gifting bytes and intercepted mock API responses. They cover paid-only link availability, reload/resume, explicit acceptance/decline, fragment removal, no gifting analytics calls, plain-text malicious note rendering, disabled purchases and buyer recovery. Existing Chromium regressions cover ordinary assessment/QPay/polling/recovery/report and 15 virtual users.

PGlite serializes commands within one engine. Independent connection validation is now complete locally using disposable native PostgreSQL 16.14, with separate psql processes and deliberate row-lock waits. Run `npm run test:gifting:native` with native PostgreSQL binaries available; the helper disables TCP, uses a private Unix socket directory and removes its synthetic cluster afterward. It tests the exact schema proposal and actual gateway handler with mocked provider/network boundaries. No production SQL was queried or executed.

## Observed results

- PASS: unit tests, gifting SQL tests, contracts and whitespace checks.
- PASS: full Chromium **53/53**, including eight gifting cases and all ordinary assessment/payment/report/recovery and 15 virtual-user regressions.
- PASS: native independent-connection races: eight simultaneous creates issue one invoice; six-recipient claims have one winner; cancellation/callback races retain confirmed funds; expiry while waiting and forced mid-claim failure create no orphan records. Owner recovery/claim races preserve recipient privacy.
- PASS: real native role denial, revoked owner denial, HTTP authentication/origin checks and actual gateway dispatch; ordinary checkout invoice/payment-source isolation. Invoice persistence survives buyer-session expiry while the mocked provider responds.
- PASS: independent entitled-recipient safety fixture keeps the commercial report null, rejects another invoice, denies buyer access and writes no ordinary payment row.
- PASS: final rebuilt gifting browser cases **8/8**. Local production/staging packages verified. Mobile recipient screenshot `evidence/recipient-375.png` was visually inspected.
- Exact synthetic test logs and public baseline manifest are in `evidence/`.

## Remaining owner decisions and release gates

See [SUPPORT_AND_RELEASE.md](SUPPORT_AND_RELEASE.md) for state-by-state reconciliation, owner attestation requirements, lost-code recovery and logging acceptance criteria. The support API is implemented and tested locally; merchant-ledger verification and buyer identity proof require an approved operational procedure before sales.

Final gift/refund/consumer-rights terms, neutral Mongolian copy, self-gifting, link lifetime and offline recovery UX need owner review. No-expiry is implemented as a proposed entitlement policy; no discretionary-refund policy is not asserted, and statutory rights remain preserved. Safety-routed recipients and held paid value require an approved remedy process. Privacy-safe aggregate tracking/revenue reporting remains a product decision.

Release requires a compatible Supabase CLI to generate the formal migration (the installed binary is incompatible), approved hosted auth/logging configuration checks, an authorized preview verification of the exact candidate, and separate release approval. No credentials or new permissions are needed for this local implementation. Gifting remains disabled. No push, deployment, production migration, real payment, live email or Library upload occurred.
