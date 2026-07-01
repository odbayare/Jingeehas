# Work Pack 9 Metadata Fixture Summary

Source artifact: `copy-decision-metadata-results.json`

| Fixture | Decision status | Hidden food function | Supplementary narrative | Soft medical bridge | Runtime render allowed | Pass |
| --- | --- | --- | --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | `owner_recommended` | `hunger_safety` | `restriction_rebound_relief` | null | false | true |
| `pcos_body_uncertainty_control` | `owner_recommended` | `control_regain` | null | `body_uncertainty_soft_medical_context` | false | true |

## Summary

The artifact contains exactly two full metadata objects. Both are copy decision fixtures. Non-decision fixtures are omitted because `buildCopyDecisionMetadata(reportObject)` returns `null` for them.

## Non-goals confirmed

- No runtime rendering.
- No production report rendering.
- No scoring change.
- No fixture behavior change.
- No WP4 report object contract change.
- No PDF generation.
- No deploy.
- No payment/QPay/backend work.
