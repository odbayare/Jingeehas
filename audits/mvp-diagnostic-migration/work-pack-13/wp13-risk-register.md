# WP13 Risk Register

## Purpose

This risk register captures runtime-integration risks that must be resolved before any future implementation work begins.

WP13 is docs-only. The risks below do not approve implementation, runtime rendering, deploy, PDF generation, or payment/backend changes.

## Risk table

| Risk | Severity | Why it matters | Required mitigation before runtime |
| --- | --- | --- | --- |
| Internal key leakage | High | Test-only fields such as fixture names, driver keys, metadata flags, and runtime gates would confuse users and expose implementation details. | Add runtime adapter tests that scan every user-facing field for internal keys. |
| Safety guidance hidden by payment | High | Professional/medical-context guidance must not be treated as premium content. | Add unpaid-state tests proving safety/professional guidance renders before entitlement. |
| Professional-first route shows ordinary experiment | High | Safety routing can be weakened if ordinary experiments appear when professional-first guidance should lead. | Add tests proving ordinary experiment sections are suppressed when safety requires it. |
| Medical-cause implication | High | Sensitive body-change copy could imply PCOS, hormones, medication, glucose, or diagnosis. | Preserve non-diagnostic language and scan for forbidden medical-cause phrases. |
| Diet-plan regression | Medium | All-or-nothing copy could regress into macro or strict diet instruction. | Scan for macro-prescriptive and punishment/restriction wording before release. |
| Payment mechanics in user-facing copy | Medium | Product mechanics can make sensitive guidance feel withheld or transactional. | Keep payment policy outside report-body copy and review rendered strings. |
| Preview exposes paid depth | Medium | Preview may accidentally reveal full ordinary report depth. | Add preview/paid allocation tests in a future adapter work pack. |
| Paid report hides safety bridge | High | Paid gating must not hide safety/professional copy. | Add explicit safety-over-payment tests. |
| Runtime adapter mutates contracts | High | WP3/WP4/WP9/WP10/WP12 contracts are the audit trail. | Adapter must consume existing outputs without mutating their contracts. |
| Deploy without rollback | High | Report rendering bugs could affect paid users and safety flows. | Require preview deploy proof, rollback path, and post-deploy smoke checks. |

## Decision status by risk

| Risk area | WP13 decision | Future gate |
| --- | --- | --- |
| Runtime rendering | HOLD | Requires approved adapter, shadow runtime, and owner review. |
| Safety/payment boundary | HOLD for implementation; planned only | Requires unpaid-state tests and manual QA. |
| Production report copy | HOLD | Requires owner copy review on future surfaced copy. |
| Payment/QPay/backend/pricing/entitlement | HOLD | Separate approved work pack only. |
| PDF generation | HOLD | Separate approved work pack only. |
| Deploy | HOLD | Requires release candidate QA, rollback plan, and explicit owner approval. |

## Owner decision required before implementation

Owner must approve a future runtime adapter contract before any `app.js` work starts.

## Required conclusion

Runtime implementation is NOT approved by WP13.
