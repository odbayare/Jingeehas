# WP18 Risk Register

| Risk | Severity | Trigger | Mitigation | Gate decision |
| --- | --- | --- | --- | --- |
| visible surface rendered too early | BLOCKER | Future work renders adapter surfaces before owner approval. | Keep WP18 as planning-only and require later explicit owner approval for rendering. | BLOCKED |
| safety guidance hidden by payment | BLOCKER | Safety guidance is placed behind payment, entitlement, report lock, or payment failure state. | Require safety guidance always-visible rule and tests before any visible prototype. | BLOCKED |
| internal diagnostics exposed | BLOCKER | `internalDiagnostics` appears in user-facing HTML. | Treat internal diagnostics as never user-facing and require leak tests. | BLOCKED |
| owner debug exposed | BLOCKER | `ownerDebug` appears in user-facing HTML. | Treat owner debug as never user-facing and require leak tests. | BLOCKED |
| paid/free surface mismatch | HIGH | Free preview exposes paid-only content, or paid content blocks safety guidance. | Require WP19 surface allocation map before prototype. | NEEDS GATE |
| medical-cause implication | HIGH | Visible copy implies medical cause without review. | Require copy/safety QA before any user-facing surface. | NEEDS SAFETY QA |
| diagnosis/treatment claim | BLOCKER | Visible copy diagnoses, treats, or prescribes. | Block rendering until safety review confirms claim boundaries. | BLOCKED |
| payment mechanics in sensitive copy | HIGH | Safety/professional guidance contains purchase pressure or payment mechanics. | Keep sensitive guidance separate from payment copy. | NEEDS COPY QA |
| report copy regression | HIGH | Future surface work changes current report copy unintentionally. | Require output invariance tests or explicit copy-change approval. | NEEDS TEST |
| mobile readability failure | MEDIUM | Future visible surfaces overflow, overlap, or become unreadable on mobile. | Require visual/mobile QA before any release-specific work pack. | NEEDS UI QA |
| deploy before approval | BLOCKER | Any deploy occurs before a deploy-specific owner approval. | Keep deploy blocked until later owner-approved deploy work pack. | BLOCKED |
| rollback not ready | HIGH | Visible runtime release proceeds without rollback plan. | Require rollback plan before any visible runtime release. | NEEDS ROLLBACK |
| WP17 shadow flag accidentally used as production gate | BLOCKER | `ENABLE_RUNTIME_ADAPTER_SHADOW` is treated as production rendering approval. | Keep flag false and require separate production rendering gate. | BLOCKED |

## Severity enum

Allowed severity values are:

- LOW
- MEDIUM
- HIGH
- BLOCKER

## Current risk conclusion

No WP18 blocker remains for planning-only owner review.

Visible runtime report rendering is NOT approved by WP18.
