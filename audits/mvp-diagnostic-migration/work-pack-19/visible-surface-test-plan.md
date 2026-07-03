# WP19 Visible Surface Test Plan

## Purpose

This artifact defines the required test plan for any future WP20 visible surface prototype.

WP19 does not add tests and does not modify runtime behavior.

## Test Plan Table

| Test area | Test type | Required assertion | Blocks WP20 commit if failing? |
| --- | --- | --- | --- |
| preview surface rendering behind owner-approved guard | Runtime/unit test | `previewSections` render only when the owner-approved visible prototype guard is enabled. | Yes |
| paid surface rendering behind paid access | Runtime/unit test | `paidSections` render only with paid access and do not appear in unpaid preview. | Yes |
| safety guidance visible without payment | Runtime/unit test | `safetyGuidanceSections` remain visible without payment if surfaced later. | Yes |
| internalDiagnostics not rendered | Leak test | `internalDiagnostics` never appears in returned user HTML. | Yes |
| ownerDebug not rendered | Leak test | `ownerDebug` never appears in returned user HTML. | Yes |
| no adapter field names visible | Leak test | Adapter field names do not appear as visible user text. | Yes |
| no internal keys visible | Leak test | Internal keys, fixture names, diagnostics, and owner debug keys do not appear in visible output. | Yes |
| no diagnosis/treatment claim | Copy/safety test | Visible copy does not diagnose, treat, prescribe, or replace professional care. | Yes |
| no payment mechanics in sensitive guidance | Copy/payment test | Sensitive guidance contains no pricing, QPay, unlock, checkout, or payment mechanics. | Yes |
| professional-first route suppression | Runtime/unit test | Professional-first routes do not show ordinary paid experiments. | Yes |
| urgent route suppression | Runtime/unit test | Urgent routes do not show ordinary paid experiments. | Yes |
| payment failure keeps safety visible | Runtime/unit test | Payment failure does not hide safety guidance. | Yes |
| restore/reload entitlement behavior unchanged | Regression test | Existing entitlement restore/reload behavior remains unchanged. | Yes |
| localStorage behavior unchanged unless explicitly approved | Regression test | No new localStorage persistence occurs unless separately approved. | Yes |
| current report output unchanged where surfaces not enabled | Output invariance test | Existing report HTML remains unchanged when visible surfaces are disabled. | Yes |
| mobile/readability smoke | Visual/manual QA | Visible prototype output is readable on mobile without overlap or clipping. | Yes |
| full `npm test` | Full regression | Full test suite passes. | Yes |
| no deploy/PDF/payment/backend touched | Forbidden diff check | Deploy, PDF, payment, QPay, backend, pricing, and entitlement files remain untouched. | Yes |

## WP19 Boundary

WP19 does not add or modify tests.

WP19 only defines future WP20 test requirements.

## Conclusion

Visible runtime report rendering is NOT approved by WP19.
