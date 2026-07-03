# WP20 Risk Register

| Risk | Severity | Trigger | Mitigation | Status |
| --- | --- | --- | --- | --- |
| visible surfaces accidentally enabled | BLOCKER | Guard defaults true or production route wires prototype output. | `ENABLE_VISIBLE_SURFACE_PROTOTYPE` defaults false and disabled helper path returns empty HTML. | MITIGATED |
| paid sections visible without entitlement | HIGH | `paidSections` render when `hasPaidAccess !== true`. | `paidSections` render only when `hasPaidAccess === true`. | MITIGATED |
| safety guidance hidden by payment | BLOCKER | `safetyGuidanceSections` disappear in unpaid or failed-payment prototype paths. | Safety guidance renders without paid access and during payment-failed test case. | MITIGATED |
| safety guidance hidden in professional/urgent mode | BLOCKER | Safety guidance disappears for `mode: "professional"`, `mode: "urgent"`, `professionalFirst: true`, or `urgent: true`. | Safety guidance renders in all safety-mode paths while preview and paid surfaces are suppressed. | MITIGATED |
| internalDiagnostics rendered | BLOCKER | Helper reads or renders `internalDiagnostics`. | Helper reads only allowed surface arrays and tests scan rendered HTML. | MITIGATED |
| ownerDebug rendered | BLOCKER | Helper reads or renders `ownerDebug`. | Helper reads only allowed surface arrays and tests scan rendered HTML. | MITIGATED |
| adapter field names visible | HIGH | Rendered prototype HTML includes adapter field names. | Tests scan output for adapter field names. | MITIGATED |
| internal key leak | HIGH | Rendered prototype HTML includes fixture names, runtime keys, or internal mode strings. | Sanitizer and tests remove and scan internal key text. | MITIGATED |
| medical-cause implication | HIGH | Visible prototype copy implies medical cause claims. | Safety copy scan checks medical/cause phrase risk and WP20 does not rewrite report copy. | MITIGATED |
| diagnosis/treatment claim | HIGH | Rendered prototype HTML includes diagnosis, treatment, or prescribing claim words. | Sanitizer and tests remove and scan English diagnosis, treatment, and prescribing claim words. | MITIGATED |
| payment mechanics in sensitive guidance | BLOCKER | Safety guidance includes QPay, checkout, unlock, payment terms, or currency symbols. | Sanitizer and tests scan payment mechanics terms and currency symbols. | MITIGATED |
| report copy regression | HIGH | WP20 changes production report copy instead of prototype-only adapter payload rendering. | Prototype only converts WP14 adapter payload `title` and `body` fields under explicit test/internal control. | MITIGATED |
| localStorage mutation | HIGH | Visible prototype reads or writes localStorage. | Tests install a throwing localStorage getter and confirm no access. | MITIGATED |
| payment/QPay/backend regression | BLOCKER | WP20 modifies payment, QPay, backend, pricing, or entitlement behavior. | Forbidden-file diffs stay empty and tests verify payment constants and entitlement checks remain unchanged. | MITIGATED |
| deploy before approval | BLOCKER | WP20 deploys or changes deploy/PDF files before owner approval. | No deploy/PDF commands are run and forbidden deploy/PDF diffs stay empty. | MITIGATED |
| rollback not clean | HIGH | WP20 cannot be reverted with one commit revert. | Rollback record defines one-commit revert and `npm test` verification. | MITIGATED |

## Open Release Risk

Production visible runtime rendering remains HOLD and requires a later owner-approved work pack.
