# Work Pack 10 Copy Rendering Fixture Summary

Source artifact: `copy-rendering-results.json`

| Fixture | Renderer mode | Decision status | Runtime render allowed | Sections | Main copy proof | Pass |
| --- | --- | --- | --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | `test_only` | `owner_recommended` | false | 5 | hunger-safety plus restriction/rebound relief | true |
| `pcos_body_uncertainty_control` | `test_only` | `owner_recommended` | false | 5 | non-diagnostic body-uncertainty bridge | true |

## Omitted fixtures

All fixtures outside the WP9 copy decision metadata return `null` or are omitted. The professional-first fixture `medication_body_concern_professional_check` is explicitly tested as omitted so WP10 does not hijack safety routing with a soft medical bridge.

## User-facing copy surface

The exported artifact includes full rendering objects with `sections`, `fullUserFacingText`, and `qualityChecks` for owner review. This text is still test-only and not runtime-approved.

## Non-goals confirmed

- No runtime rendering.
- No production report rendering.
- No `app.js` integration.
- No scoring change.
- No fixture behavior change.
- No WP4 report object contract change.
- No PDF generation.
- No deploy.
- No payment/QPay/backend work.
