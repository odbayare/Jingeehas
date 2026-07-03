# WP22 Risk Register

| Risk | Severity | Trigger | Mitigation | Status |
| --- | --- | --- | --- | --- |
| production visible surfaces enabled by default | BLOCKER | Runtime integration guard defaults true. | `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION` defaults false and tests assert it. | MITIGATED |
| default report output changes | BLOCKER | `renderReport()` changes while guard is disabled. | Test compares default render output and confirms no visible surface labels. | MITIGATED |
| paid surfaces visible without access | BLOCKER | `paidSections` render when `hasPaidAccess !== true`. | Integration passes paid access through WP20 helper and tests unpaid hidden state. | MITIGATED |
| safety guidance hidden by payment | BLOCKER | `safetyGuidanceSections` disappear in unpaid or failed access states. | Tests confirm safety renders without payment in enabled paths. | MITIGATED |
| safety guidance hidden in professional/urgent mode | BLOCKER | Safety modes suppress every visible surface. | Tests confirm professional/urgent and boolean safety flags render safety only. | MITIGATED |
| internalDiagnostics rendered | BLOCKER | Integration places forbidden diagnostic field. | Integration only uses WP20 visible helper output and tests scan HTML. | MITIGATED |
| ownerDebug rendered | BLOCKER | Integration places forbidden owner debug field. | Integration only uses WP20 visible helper output and tests scan HTML. | MITIGATED |
| payment/QPay/backend regression | BLOCKER | WP22 touches forbidden payment/backend files. | No payment/QPay/backend/pricing/entitlement files changed. | MITIGATED |
| deploy before approval | BLOCKER | WP22 deploys or edits deploy/PDF files. | No deploy/PDF files changed and no deploy performed. | MITIGATED |

## Release Boundary

Production release is NOT approved by WP22.
