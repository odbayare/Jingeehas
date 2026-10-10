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
- Only a provider PAID row with the exact server amount and payment ID can confirm a pending order. Callback repeats are idempotent. A late valid confirmation can recover a paid invoice beyond the 15-minute display timer. Canceled, unpaid, wrong-amount and provider-error orders issue no gift. An ambiguous invoice create is retained for reconciliation, never retried by creating another provider invoice. One unresolved invoice per buyer is enforced in SQL.
- Buyers generate a shareable fragment link only after confirmed payment. Tokens have 256 random bits; only SHA-256 hashes persist. Gift pages load no analytics/Meta scripts, remove the fragment immediately, use no-referrer, POST tokens in request bodies, and render notes as text. Link generation rotates the previous token. Links last 30 days; **the purchased, unclaimed entitlement itself has no expiry in this proposed implementation**.
- The buyer can save a separate offline recovery code to recover order management in a new browser/session and obtain a fresh link. Only its hash persists; the code is shown on demand and must be saved by the buyer. It never grants recipient assessment access. Regenerating the recovery code invalidates the old one. If both session and saved code are lost, authenticated support recovery remains to be designed.
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

PGlite executes real SQL but serializes commands within one engine; concurrent promises establish one-winner semantics, not native PostgreSQL independent-connection contention/load evidence. Release review must validate the same SQL on a disposable native PostgreSQL instance, including concurrent connections, grants/gateway behavior and rollback. No production SQL was queried or executed.

## Observed results

- PASS: final `npm test` including disposable SQL gifting tests, `test:contracts`, syntax checks and `git diff --check`.
- PASS: full Chromium suite **48/48**, including the original 45 tests and the first three gifting tests, ordinary payment/report/recovery regressions and the exact 15-user sequential safety/commercial flow.
- PASS: after final recovery/UI and same-tab-link changes, focused Chromium **12/12** (all five gifting tests plus seven affected landing/hero checks). The full suite was not unnecessarily repeated after changes scoped to gifting and its landing link.
- PASS: final production package (15 static files, 78 function files) and staging package (96 files, 43 functions). These are local generated packages only.
- Mobile recipient screenshot: `evidence/recipient-375.png`, inspected visually; no horizontal overflow and explicit acceptance/decline.
- Exact logs and public baseline manifest are in `evidence/`. All API/payment/SQL fixtures are synthetic. Cross-origin/unauthenticated/default-disabled API checks and revoked-session recovery denial also pass.

## Remaining owner decisions and release gates

1. Approve the neutral Mongolian copy, self-gift choice, offline buyer-code UX and 30-day **link** lifetime. Link possession determines the first recipient; no named recipient is prebound. Do not send unsolicited weight-related gifts.
2. Approve final gift/refund/consumer-rights terms. No-expiry and no discretionary refund are only prior AI Course parity proposals. This draft implements no entitlement expiry but makes **no no-refund promise** and preserves statutory rights in visible copy. Safety-routed recipients, paid canceled invoices, lost buyer recovery codes and provider-create ambiguity need an operational resolution policy before selling gifts.
3. Design support reconciliation for `create_unknown`/unresolved invoices and paid-after-cancellation cases before enabling sales; the draft intentionally blocks automatic replacement invoices. A buyer can manually recheck a pending invoice after its display timer expires.
4. Confirm whether gift sales should have a separate admin revenue view and privacy-safe aggregate tracking. Ordinary analytics/CAPI currently exclude gifts to preserve their existing cohorts. No bearer, note or recipient PII is sent to analytics.
5. Review/generate/apply the migration and separately deploy the gateway/function/static candidate only with release approval; validate preview/native SQL and current server credentials read-only. Enable the non-secret feature switch only after those checks. No deployment or hosted permission changes are authorized by this artifact.

The feature is a tested local review candidate, not a production-ready payment certification.
