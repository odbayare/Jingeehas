# Future WP19 Scope Proposal

## Exact future work pack name

WP19 — Visible Surface Integration Plan

## Purpose

This artifact proposes the narrow next work pack that may follow WP18 if the owner accepts the visible surface decision gate.

WP19 is proposed as a visible surface plan or owner-approved prototype only. WP18 does not approve production rendering.

## Required WP19 rules

WP19 may not deploy production visible report rendering.

WP19 may only plan or prototype visible surfaces behind explicit owner-approved gates.

Production release requires a later deploy-specific work pack.

## Proposed WP19 objective

WP19 may plan or prototype how the WP14 adapter payload fields could map to visible report surfaces:

- `previewSections`
- `paidSections`
- `safetyGuidanceSections`

WP19 must keep the following fields non-user-facing:

- `internalDiagnostics`
- `ownerDebug`

## Proposed allowed WP19 planning work

WP19 may produce docs that define:

- the intended visible destination for `previewSections`;
- the intended visible destination for `paidSections`;
- the intended visible destination for `safetyGuidanceSections`;
- the required safety/payment gates;
- the required copy review gates;
- the required test coverage before any visible prototype;
- the rollback plan for any future runtime branch;
- the owner decision required before production rendering.

WP19 may produce a prototype only if the owner explicitly widens WP19 beyond docs.

## Proposed WP19 non-goals

WP19 should not approve production rendering.

WP19 should not change QPay, backend, payment, pricing, entitlement, deploy configuration, or PDF generation unless separately approved.

WP19 should not change WP3 scoring/fixtures, WP4 report object contract, WP9 metadata contract, WP10/WP12 renderer contract, or WP14 adapter contract unless separately approved.

WP19 should not change report copy unless the owner explicitly asks for copy work.

## Required conclusion

Visible runtime report rendering is NOT approved by WP18.
