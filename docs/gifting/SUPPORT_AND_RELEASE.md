# Gift recovery operations and release gates

This is review-only local preparation. Gifting remains disabled. No merchant call, email, hosted migration, deployed configuration or production log setting was changed. The API operations below require the existing authenticated owner admin cookie and HTTPS same origin; they do not introduce a new credential or a new operator role.

## State and paid-value rules

| State | Meaning and allowed resolution |
|---|---|
| creating | Order is committed before the provider call. Do not create a replacement. An interrupted create becomes create_unknown when its callback arrives; support cannot attach an invoice while creating is less than two minutes old. |
| create_unknown | Provider outcome is ambiguous. Callback returns RETRY/503 while its local invoice ID is missing. Support verifies the stored sender reference in the merchant ledger and attaches that existing invoice; payment-check then determines pending/paid. |
| pending | Existing invoice can be checked; no entitlement or share link until provider-confirmed payment. |
| canceled | Local request to stop the order; **not** evidence that QPay voided it. The unresolved-order constraint blocks another invoice until merchant closure is verified. |
| closed_unpaid | Owner verified that the merchant invoice is void/closed without funds, with an evidence reference. Callback mapping is retained. Unexpected later verified funds become paid_review rather than being discarded. |
| paid_review | Exact verified payment is stored with paid_at and provider payment ID; no link or entitlement can issue. Buyer can save/use their private recovery code. Cancellation conflicts can be released as a gift only after the buyer explicitly chooses that resolution. A payment ID overlapping an ordinary checkout cannot be released through this operation. |
| paid | Confirmed unclaimed gift. Buyer may regenerate a claim link or save/download an offline recovery code. |
| claimed | One recipient-bound assessment and entitlement. Support cannot rebind, reset or reveal the recipient's data. |

Payment confirmation never calls provider create. Neither recovery, closure, release nor duplicate callbacks create replacement invoices. Receipt capture and order-state changes are guarded by the gift row lock. No existing ordinary payment or entitlement row is rewritten. Seller policy decisions must not convert an ambiguous/unpaid order into paid rights.

## Minimal support procedure

Use `POST /.netlify/functions/gift-support` from the existing same-origin owner session. The backend rechecks active owner account, session purpose, expiry and revocation in SQL. API projection contains only order/payment references and review state; no recipient ID, assessment, note, token or recovery code. Failed verification must stop the process rather than guessing.

All mutations require an `operationKey` UUID and an opaque `evidenceRef` (8–80 letters/numbers/underscores/hyphens). Use a support-case identifier, never a name, email, health detail, URL, bearer token or full payment proof. Reusing the same operation key is idempotent; audit rows commit atomically with the mutation.

1. **lookup / check**: identify order by the buyer's displayed order reference. Read merchant sender/invoice references as owner; check invokes the existing authenticated QPay payment-check implementation. It does not create an invoice or send a message.
2. **attach_invoice**: independently verify the existing merchant invoice belongs to this order's exact stored sender reference and server amount. Supply its `invoiceId` and `providerReferenceVerified:true`. The binding is immutable, unique across gifts and cannot reference an existing ordinary checkout invoice. The backend checks the invoice for payment after attachment; merely attaching an invoice never establishes paid rights. For a previously closed/canceled order, payment becomes review-held.
3. **close_unpaid**: obtain actual merchant confirmation that the invoice is void/closed and cannot intentionally collect further funds, or that no invoice exists. Absence of PAID rows today is **not** sufficient. Supply `providerClosedVerified:true`. The backend rechecks current payment when an invoice ID exists and SQL refuses closure of a confirmed paid order. Callback mapping remains for any unexpected late payment.
4. **release_paid_value**: for paid-after-cancellation, authenticate the purchaser and obtain their explicit request to receive the gift rather than a payment remedy. Supply `buyerRequestedGift:true`. Only verified paid_review value can move to paid; no recipient assessment/entitlement is granted by this action. The buyer still shares the link and the recipient still explicitly accepts. Source-conflict reviews cannot be released through this route.
5. **rebind_buyer**: when buyer session and code are lost, require merchant payment/order evidence plus independent purchaser verification through the approved support process. Obtain the new authenticated buyer session ID, then supply `buyerSessionId` and `buyerVerified:true`. SQL requires that target session to be live. This is restricted to unclaimed orders; it revokes the old claim/recovery capabilities. It never adds an assessment_sessions row. The verified buyer generates new capabilities in their own session; support receives none.

The verification flags are explicit owner attestations, **not automated identity or merchant proof**. Evidence review and operator conduct remain mandatory. This initial version supplies owner-authenticated operations and audit records, not an automated helpdesk/refund system. No refund or email send is performed. Recipient recovery continues through their own saved recovery email and existing verification flow; buyer evidence is never sufficient to recover recipient answers/report. If a recipient lacks a saved recovery contact, do not reset their claimed gift: require a separately designed recipient-verification process.

## Policy choices retained for review

- Unclaimed paid entitlement has no expiry; this is a proposed policy, not a verified existing Jingeehas promise. The bought value is retained when a link expires.
- Link lifetime defaults to 30 days. Non-secret `JINGEEHAS_GIFT_LINK_DAYS` can configure 1–365 days; the public link response/copy reports that duration. No new configuration value was installed. Replacing a link invalidates its previous token.
- Existing customer session lifetime remains 30 days. Buyer recovery code has no automatic expiry; hash-only storage, regeneration invalidates the previous code, and the UI offers a download. Treat the code as private, separate from the recipient link.
- Refund/no-discretionary-refund terms are not implemented or verified. Recommend a buyer-verifiable remedy for unused gifts and payment/service failures while preserving mandatory rights; claimed-gift and safety-outcome remedies require owner/legal approval. Never disclose a safety category or health answer to justify a buyer remedy.
- Buyer sees only payment/order-used state. First valid accepting recipient binds once; self-gift remains explicit. No unsolicited recipient emails are sent.

## Infrastructure logging acceptance requirements

Before sales, review existing hosting, gateway, proxy/APM and operator-browser logging configurations read-only:

- Never retain raw gift claim/recovery tokens, URLs containing fragments/capabilities, note text or recipient answers/health/report content in analytics, HTTP body capture, exception context, traces, HAR exports or support tickets.
- Gift pages load no Meta/analytics code and clear fragments immediately. API capabilities travel in POST bodies; hash-only database storage does **not** certify that infrastructure body logging is disabled.
- Owner support logs should retain opaque case/order references and state/action outcomes only. Keep detailed merchant evidence in the approved private support system with restricted access and retention; do not paste evidence into the API audit reference.
- Existing gateway configuration/authentication uses the existing dedicated secret and service-role credential. Neither is exposed to the browser or emitted by tests. No production logging setting was inspected/changed by this work.

These are release acceptance checks, not instructions to alter production logging now.

## Validation and exact next gate

`npm run test:gifting:native` creates and destroys a private disposable PostgreSQL cluster under /tmp, with Unix sockets only, TCP disabled and no password/production credential. Requires native initdb/pg_ctl/psql, PostgreSQL 16+ and Node with stripTypeScriptTypes support. Native 16.14 passed on this Mac. Tests use multiple backend connections, prove lock blocking with pg_stat_activity, and exercise 8 duplicate creates; 5 six-recipient claim races; 6 payment/cancellation races; callback replay; closure then late payment; missing/expired-session invoice persistence; unpaid reconciliation; ordinary source conflicts; forced rollback; token/session expiry during a lock wait; support-rebind/claim races; owner/session/role denial; and execution of the actual gateway handler with only mocked HTTP and native local RPC results.

PGlite 0.4.6 remains the reproducible default SQL/unit fixture in npm test. It executes real SQL but serializes its single client; native tests now add the independent-connection evidence previously missing. A separate gifted-entitlement safety fixture also passed (guidance/null commercial report, buyer denied, invoice blocked, no payment rows). Local fixture success does not certify hosted configuration, production PostgreSQL version/load or genuine QPay merchant connectivity.

Resolved locally: separate-connection concurrency; loss of callback acknowledgement for missing IDs; loss of late canceled payment; protected merchant attachment; payer/session interruption; owner-only audited recovery; source isolation; no-paid-rights-on-unpaid reconciliation.

True remaining launch gates: approve terms and support verification/remedy policy; train an existing authorized owner operator; verify infrastructure body logging/current hosted gateway permissions read-only; generate a formal migration with a compatible CLI and validate exact candidate in an authorized disposable/preview environment. The installed x86_64 Supabase CLI cannot run on this Mac and blocks migration generation only; native SQL tests pass without it. Then separately approve applying the migration, deploying gateway/functions/static candidate and enabling `JINGEEHAS_GIFTING_ENABLED`. Until those checks and approvals, leave the switch off. No production operation is authorized by this document.
