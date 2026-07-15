# WP16 Risk Register

## Purpose

This document records risks for a future WP17 shadow runtime adapter integration.

WP16 is docs-only.

Runtime implementation is NOT approved by WP16.

## Risk table

| Risk | Severity | Trigger | Mitigation | WP17 gate |
| --- | --- | --- | --- | --- |
| app.js visible behavior change | HIGH | Returned report HTML, route output, paywall copy, button behavior, or safety/professional output changes with flag false. | Snapshot existing report outputs and compare with `ENABLE_RUNTIME_ADAPTER_SHADOW = false`. | Block WP17 commit until unchanged-output tests pass. |
| feature flag accidentally enabled | BLOCKER | Flag defaults true, can be enabled by URL/localStorage/payment/deploy/backend state, or lacks owner-approved test-only control. | Use exact `ENABLE_RUNTIME_ADAPTER_SHADOW = false`; forbid URL, storage, payment, deploy, and backend enablement. | Block WP17 commit until flag contract is exact. |
| adapter output rendered to users | BLOCKER | Adapter payload, preview sections, paid sections, safety sections, diagnostics, or owner debug appear in DOM or returned HTML. | Keep adapter output internal-only and scan returned HTML for adapter field names/content. | Block WP17 commit until no-render tests pass. |
| payment/entitlement mutation | BLOCKER | QPay constants, prices, product codes, access helpers, mockBackend payment state, or entitlement behavior changes. | Do not touch payment/QPay/backend/pricing/entitlement files or helper behavior. | Block WP17 commit until forbidden diffs and access tests pass. |
| localStorage regression | HIGH | Shadow path reads/writes storage, calls `saveState()`, adds keys, or persists adapter diagnostics. | Forbid localStorage access unless separately approved; test state and storage shape. | Block WP17 commit until storage no-mutation tests pass. |
| existing report flow broken | HIGH | One-time, removed-feature, readiness, professional, urgent, stage, or diary flow changes. | Add branch coverage for existing report flow with flag false. | Block WP17 commit until full report-flow regression passes. |
| adapter failure breaks user flow | HIGH | Adapter error throws into runtime report rendering or blocks user navigation/report output. | Contain adapter failures to test-only enabled path; disabled path must not invoke risky code. | Block WP17 commit until failure-containment tests pass. |
| internal keys visible | BLOCKER | Fixture names, mechanism keys, `ownerDebug`, `internalDiagnostics`, test-only status, or runtime gate metadata appear to users. | Scan returned HTML and user-facing fields for internal keys. | Block WP17 commit until leakage scans pass. |
| safety guidance hidden | BLOCKER | Safety/professional guidance becomes payment-gated or ordinary experiments appear on professional-first route. | Preserve `paymentGate.safetyGuidanceRequiresPayment === false` and safety/professional branch priority. | Block WP17 commit until safety/payment tests pass. |
| deploy before approval | BLOCKER | Preview or production deploy is attempted before explicit owner approval. | Keep WP17 local/test-only; record no deploy in owner pack. | Block WP17 completion if any deploy occurs. |
| rollback not clean | HIGH | WP17 cannot be reverted without touching unrelated payment/backend/PDF/deploy/scoring files. | Record exact changed files and rollback command before commit. | Block WP17 commit until rollback plan is complete. |
| scope creep into production rendering | BLOCKER | WP17 renders adapter sections, changes production report surface, or expands into visible UI. | Keep WP17 shadow-only and disabled by default. | Block WP17 commit until scope diff and no-render evidence pass. |
| module-format widening | MEDIUM | ESM/CommonJS/browser-script mismatch causes app build restructure or broad import changes. | Keep invocation test-only if direct import widens scope; avoid build refactor. | Block WP17 commit if implementation requires unapproved build changes. |
| unrelated untracked folder touched | MEDIUM | `audits/sprint-36-paid-depth-prototype/` is modified, staged, deleted, or committed. | Leave unrelated folder untouched and verify `git status --short`. | Block WP17 completion if folder is touched. |
| WP14 adapter modified by accident | MEDIUM | WP14 adapter module/test/exporter diff appears without approval. | Add explicit diff check for WP14 adapter files. | Block WP17 commit until WP14 adapter diffs are empty. |

## Open risks after WP16

WP16 does not prove:

- runtime code can safely import the ESM adapter;
- browser runtime can execute the adapter without build changes;
- a visible report surface is ready;
- payment-gated report rendering is ready;
- mobile UI is ready for new adapter-rendered content;
- deploy rollback is rehearsed.

Those risks must remain HOLD until later owner-approved work packs.

## Required decision

WP17 may proceed only if the owner accepts the risks and exact patch scope in WP16.

Runtime implementation is NOT approved by WP16.
