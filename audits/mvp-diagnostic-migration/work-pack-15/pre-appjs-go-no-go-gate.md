# WP15 Pre-app.js Go/No-Go Gate

## Purpose

This document defines the go/no-go gate before any future `app.js` work is proposed.

## Current Decision

```text
GO - READY TO PLAN SHADOW APPJS INTEGRATION
```

GO does not approve runtime implementation.

GO only approves planning a future shadow integration work pack.

Production rendering remains blocked.

## Go/No-Go Results

| Gate | Required | WP15 result | Go/No-Go | Decision |
| --- | --- | --- | --- | --- |
| WP14 payload contract exact | Exact keys and scalar values pass | PASS | GO | Owner-review ready |
| Adapter remains test-only | `adapterMode === "test_only"` | PASS | GO | Owner-review ready |
| Runtime remains disabled | `runtimeSafetyGate.canRenderInRuntime === false` | PASS | GO | Owner-review ready |
| Production surface absent | `reportSurface === "prototype_only"` | PASS | GO | Owner-review ready |
| Safety guidance not paywalled | `paymentGate.safetyGuidanceRequiresPayment === false` | PASS | GO | Owner-review ready |
| Runtime/product files untouched | Forbidden diffs empty | PASS | GO | Owner-review ready |
| WP9/WP12 contracts untouched | Source-contract diffs empty | PASS | GO | Owner-review ready |
| Full tests green | `npm test` passes | PASS | GO | Owner-review ready |
| Runtime implementation approval | Separate owner approval required | NOT GRANTED | NO-GO | Must remain HOLD |
| Production user-facing rendering approval | Separate owner approval required | NOT GRANTED | NO-GO | Must remain HOLD |

## Required Checklist

- [ ] Owner accepts WP15 QA
- [ ] No FAIL status remains in adapter QA
- [ ] Safety guidance remains outside payment
- [ ] Internal diagnostics remain non-user-facing
- [ ] Owner debug remains non-user-facing
- [ ] app.js scope is limited to future shadow-only integration
- [ ] rollback plan exists before any runtime release
- [ ] deploy remains blocked until later owner approval

## Allowed Future Consideration

WP16 may be proposed as a scoped runtime shadow integration plan.

WP16 must still preserve these constraints:

- no production user-facing rendering without separate owner approval;
- no payment, QPay, backend, pricing, entitlement, deploy, or PDF work;
- no WP3 scoring or fixture changes;
- no WP4/WP9/WP10/WP12 contract changes;
- no weakening of safety/payment boundaries;
- no visible report behavior change in the same pack unless explicitly approved.

## Not Approved

WP15 does not approve:

- editing `app.js`;
- runtime implementation;
- production report rendering;
- deploy;
- PDF generation;
- payment/QPay/backend/pricing/entitlement work;
- adapter code changes;
- test changes.

## Exact Conclusion

Runtime implementation is NOT approved by WP15.
