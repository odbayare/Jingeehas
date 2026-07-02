# WP18 Visible Surface Readiness Review

## Purpose

This WP18 artifact reviews whether the WP17 disabled shadow runtime integration is ready for the owner to consider a future visible report surface plan.

It is a decision-gate review only. It does not implement or approve visible rendering.

## Reviewed surfaces

| Surface | Source payload | Readiness status | Remaining risk | Decision |
| --- | --- | --- | --- | --- |
| `previewSections` | WP14 test-only runtime adapter payload | Structurally ready for future planning | Needs copy QA before any user-facing rendering | NEEDS COPY QA |
| `paidSections` | WP14 test-only runtime adapter payload | Structurally ready for future planning | Must not block safety guidance or change payment behavior | READY TO PLAN |
| `safetyGuidanceSections` | WP14 test-only runtime adapter payload | Structurally ready for future planning | Needs safety QA and must remain outside payment gating | NEEDS SAFETY QA |
| `internalDiagnostics` | WP14 test-only runtime adapter payload | Not a user-facing surface | Must never be rendered to users | BLOCKED |
| `ownerDebug` | WP14 test-only runtime adapter payload | Not a user-facing surface | Must never be rendered to users | BLOCKED |

## Required surface rules

internalDiagnostics must never be user-facing.

ownerDebug must never be user-facing.

safetyGuidanceSections must remain visible without payment if surfaced later.

paidSections may be gated only if safety guidance remains unblocked.

WP18 does not approve rendering any surface to users.

## Readiness rationale

- WP17 proves the first `app.js` touchpoint can exist while `ENABLE_RUNTIME_ADAPTER_SHADOW = false`.
- WP17 proves the shadow call inside `renderReport()` is ignored.
- WP17 tests scan returned HTML for adapter field names and raw fixture names.
- WP14 keeps the adapter output in `reportSurface = prototype_only`.
- WP14 keeps `runtimeSafetyGate.canRenderInRuntime = false`.
- WP14 keeps `paymentGate.safetyGuidanceRequiresPayment = false`.

## Readiness decision

Visible surface planning may be considered next as a future WP19 plan or owner-approved prototype.

Visible runtime report rendering is NOT approved by WP18.
