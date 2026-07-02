# WP15 Risk Register

## Purpose

This document captures remaining risks before any future scoped `app.js` runtime shadow integration pack.

| Risk | Severity | Trigger | Mitigation | Gate decision |
| --- | --- | --- | --- | --- |
| app.js touched too early | HIGH | `app.js` is edited before owner accepts WP15 and approves WP16 scope. | Keep `app.js` blocked until a future owner-approved shadow integration pack. | BLOCK |
| runtime behavior changes before shadow QA | HIGH | Visible report behavior changes before shadow-only QA exists. | Require no-visible-output shadow QA before any production behavior change. | BLOCK |
| safety guidance payment-gated | BLOCKER | `safetyGuidanceSections` is hidden by payment, lock, failure, or entitlement state. | Preserve safety guidance outside payment and test unpaid states. | BLOCK |
| internal diagnostics visible to users | HIGH | `internalDiagnostics` appears in a user-facing report surface. | Keep diagnostics internal and add future no-leak tests. | BLOCK |
| ownerDebug visible to users | HIGH | `ownerDebug` appears in a user-facing report surface. | Keep owner debug admin-only and scan rendered output. | BLOCK |
| paid/free surface mismatch | MEDIUM | Preview exposes paid depth or paid surface hides required ordinary depth. | Preserve surface allocation tests before runtime rendering. | REVISE BEFORE APPJS |
| medical-cause implication | HIGH | Copy implies body changes are caused by PCOS, medication, glucose, or hormones. | Preserve non-causal language and run forbidden phrase scans. | BLOCK |
| diagnosis/treatment claim | BLOCKER | Copy claims diagnosis, treatment, or medical advice. | Keep non-diagnostic wording and block runtime release on claim detection. | BLOCK |
| production deploy before approval | BLOCKER | Production deploy occurs before owner approves release scope. | Keep deploy blocked and require owner release gate. | BLOCK |
| rollback not ready | HIGH | Runtime release is proposed without rollback plan. | Require rollback path before any runtime release. | BLOCK |
| QPay/payment mechanics leaking into copy | HIGH | Sensitive copy mentions payment mechanics, unlocks, QPay, or pricing. | Keep payment mechanics outside sensitive copy. | BLOCK |
| feature flag accidentally enabled | HIGH | Shadow integration flag enables user-visible rendering unexpectedly. | Default flags off and verify disabled production behavior. | BLOCK |

## Exact Conclusion

Runtime implementation is NOT approved by WP15.
