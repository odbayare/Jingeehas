# WP21 Production Placement Decision

| Surface | Future placement | Access rule | Safety rule | Decision |
| --- | --- | --- | --- | --- |
| `previewSections` | Free or locked preview area above paid-depth report content. | May render without paid access. | Must not expose paid-only depth or internal fields. | previewSections may go into free/locked preview area. |
| `paidSections` | Paid full report area after entitlement/access is confirmed. | Render only with paid access. | Must not contain or hide safety guidance. | paidSections may go into paid full report area only with paid access. |
| `safetyGuidanceSections` | Safety/professional guidance area outside payment and locked-report gates. | Render without payment when present. | Must remain visible in unpaid, payment-failed, report-locked, professional, and urgent paths. | safetyGuidanceSections must be outside payment gate. |
| `internalDiagnostics` | None. | No user access. | Never render to users. | internalDiagnostics are never user-facing. |
| `ownerDebug` | None. | No user access. | Never render to users. | ownerDebug is never user-facing. |

## Release Boundary

WP21 does not approve production release.
