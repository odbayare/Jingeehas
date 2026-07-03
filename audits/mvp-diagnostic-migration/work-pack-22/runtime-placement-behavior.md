# WP22 Runtime Placement Behavior

| Surface | Enabled test-only placement | Default behavior | Access rule | Safety rule |
| --- | --- | --- | --- | --- |
| `previewSections` | Placed after base report content and before section end. | Not rendered. | May render without paid access when owner guard is enabled in tests. | Suppressed in professional/urgent safety modes. |
| `paidSections` | Placed after preview content in paid report surface. | Not rendered. | Renders only when `hasPaidAccess === true`. | Suppressed in professional/urgent safety modes. |
| `safetyGuidanceSections` | Placed with visible surfaces and remains available in safety modes. | Not rendered. | Renders without payment when owner guard is enabled in tests. | Must remain visible without payment. |
| `internalDiagnostics` | Never placed. | Never rendered. | No user access. | Never user-facing. |
| `ownerDebug` | Never placed. | Never rendered. | No user access. | Never user-facing. |

## Placement

The integration helper uses `before-section-end` placement in tests and ordinary report wiring.

Production release is NOT approved by WP22.
