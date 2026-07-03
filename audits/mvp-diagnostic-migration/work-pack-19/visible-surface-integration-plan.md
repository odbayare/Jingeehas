# WP19 Visible Surface Integration Plan

## WP19 Purpose

WP19 is a docs-only visible surface integration plan.

It plans how these adapter payload surfaces could later become visible in runtime UI:

- `previewSections`
- `paidSections`
- `safetyGuidanceSections`

WP19 keeps these adapter payload surfaces non-user-facing forever unless separately approved for admin-only debugging:

- `internalDiagnostics`
- `ownerDebug`

## Current State

- WP17 added a disabled shadow runtime adapter integration.
- `ENABLE_RUNTIME_ADAPTER_SHADOW = false`.
- `prepareRuntimeAdapterShadowSignal()` exists as an internal validation helper.
- The shadow helper call inside `renderReport()` is ignored and non-rendering.
- WP18 accepted planning a future visible surface integration.
- WP18 GO decision is `GO - READY TO PLAN VISIBLE SURFACE INTEGRATION`.
- Visible runtime report rendering is still not approved.
- Production rendering remains HOLD.
- Deploy/PDF/QPay/backend/payment/pricing remains HOLD.

## What WP18 GO Actually Allows

WP18 GO allows WP19 to plan visible surface integration.

WP18 GO does not approve visible runtime rendering.

WP18 GO does not approve production rendering.

WP18 GO does not approve deploy, PDF generation, report copy rewrite, payment/QPay/backend changes, pricing/entitlement changes, scoring changes, or runtime implementation.

## What Remains Blocked

- no production rendering
- no deploy
- no PDF
- no payment/QPay/backend change
- no pricing/entitlement change
- no report copy rewrite
- no scoring change
- no internal diagnostics rendering
- no owner debug rendering
- no `app.js` change
- no test change
- no visible UI change

## Why Visible Surface Planning Is Needed Before Implementation

The adapter payload contains multiple surface types with different user-facing and safety/payment rules.

Planning is required before implementation because:

- `previewSections` may be free/preview-facing but still needs copy QA;
- `paidSections` may be paid-report-facing but must not block safety guidance;
- `safetyGuidanceSections` must remain visible without payment if surfaced later;
- `internalDiagnostics` must never be user-facing;
- `ownerDebug` must never be user-facing;
- report copy, payment behavior, entitlement behavior, and safety routing must remain stable until separately approved.

## Exact Proposed WP20 Goal

WP20 — Limited Visible Surface Prototype

WP20 may only prototype visible surfaces if the owner accepts WP19.

The proposed WP20 goal is to prototype a limited, owner-reviewed, non-production mapping from adapter payload surfaces to visible runtime UI slots while preserving all WP19 safety, payment, copy, and rollback gates.

## Exact Non-Goals

WP19 does not approve production rendering.

WP19 does not approve visible runtime report rendering.

WP19 does not approve deployment.

WP19 does not approve PDF generation.

WP19 does not approve payment, QPay, backend, pricing, or entitlement changes.

WP19 does not approve report copy rewrite.

WP19 does not approve scoring changes.

WP19 does not approve `internalDiagnostics` rendering.

WP19 does not approve `ownerDebug` rendering.

WP19 does not approve WP14 adapter contract changes.

WP19 does not approve WP3 scoring/fixture changes, WP4 report object contract changes, WP9 metadata contract changes, or WP10/WP12 renderer contract changes.

## Required Rule

WP20 may only prototype visible surfaces if the owner accepts WP19.

## Conclusion

Visible runtime report rendering is NOT approved by WP19.
