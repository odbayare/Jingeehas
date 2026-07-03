# WP19 Risk Register

| Risk | Severity | Trigger | Mitigation | Gate decision |
| --- | --- | --- | --- | --- |
| visible surface rendered too early | BLOCKER | WP19 is treated as implementation approval. | Repeat that visible runtime report rendering is not approved by WP19. | BLOCKED |
| WP17 shadow flag used as production gate | BLOCKER | `ENABLE_RUNTIME_ADAPTER_SHADOW` is treated as production rendering approval. | Require explicit future owner-approved prototype gate. | BLOCKED |
| safety guidance hidden by payment | BLOCKER | `safetyGuidanceSections` is hidden by payment, entitlement, payment failure, or report lock. | Require safety guidance outside payment in WP20 tests. | BLOCKED |
| internal diagnostics exposed | BLOCKER | `internalDiagnostics` appears in user-facing HTML. | Keep internal diagnostics non-user-facing forever unless separately approved for admin-only debugging. | BLOCKED |
| owner debug exposed | BLOCKER | `ownerDebug` appears in user-facing HTML. | Keep owner debug non-user-facing forever unless separately approved for admin-only debugging. | BLOCKED |
| preview exposes paid depth | HIGH | `previewSections` leaks paid-depth report content. | Require explicit preview destination and copy QA. | NEEDS GATE |
| paid surface blocks safety guidance | BLOCKER | Paid report gating blocks safety/professional guidance. | Require paid sections may be gated only if safety guidance remains unblocked. | BLOCKED |
| report copy rewrite sneaks in | HIGH | Future prototype changes current report copy without approval. | Require copy invariance tests or separate copy approval. | NEEDS COPY QA |
| diagnosis/treatment claim appears | BLOCKER | Visible surfaces add diagnosis, treatment, or medical-cause claims. | Require safety/copy QA before any visible prototype. | BLOCKED |
| payment mechanics in sensitive copy | HIGH | Safety/professional guidance includes purchase pressure or payment mechanics. | Keep sensitive guidance outside payment mechanics. | NEEDS COPY QA |
| deploy before approval | BLOCKER | Prototype is deployed before deploy-specific owner approval. | Keep deploy blocked until later deploy-specific work pack. | BLOCKED |
| rollback not ready | HIGH | Future prototype lacks rollback plan. | Require rollback plan before visible runtime release. | NEEDS ROLLBACK |
| WP14 adapter contract drift | HIGH | Future work changes adapter fields or gates. | Require separate owner approval before WP14 adapter contract changes. | BLOCKED |

## Severity Enum

Allowed severity values:

- LOW
- MEDIUM
- HIGH
- BLOCKER

## Current Risk Conclusion

No WP19 blocker remains for planning-only owner review.

Visible runtime report rendering is NOT approved by WP19.
