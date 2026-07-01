# Work Pack 7 Structure Decision Matrix

| Fixture | Current issue | Copy-only fix possible? | Needs future structure change? | Recommended option | Runtime gate |
| --- | --- | --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | `hunger_safety` explains the body-state rebound but under-explains relief from failure, punishment, and restart pressure. | Yes, partly. Copy can add a supplementary relief/rebound narrative. | Not immediately. Future structure may add `supplementaryNarrative` if owner wants testable explicit output. | Option B — Keep `hunger_safety`, add future supplementary narrative layer for restriction/rebound relief. | Runtime copy must include both hunger-safety and relief/restart-pressure narrative before integration. |
| `pcos_body_uncertainty_control` | Ordinary mode is structurally plausible, but PCOS/body uncertainty copy can sound medically casual without a bridge. | Yes. Copy can add a mandatory soft medical-context bridge while keeping ordinary mode. | Not immediately. Future structure may add `softMedicalContextBridge` if owner wants explicit report-object support. | Option B — Keep ordinary mode, add mandatory soft medical-context bridge in copy. | Runtime copy must say this is not diagnosis and must not claim PCOS/hormones/medication/glucose as cause. |

## Owner approval checklist

- [ ] Owner confirms `all_or_nothing_restriction_rebound` should keep `hunger_safety` as current hidden food function.
- [ ] Owner confirms future copy should add restriction/rebound relief narrative for `all_or_nothing_restriction_rebound`.
- [ ] Owner confirms `pcos_body_uncertainty_control` should remain ordinary `mode1`.
- [ ] Owner confirms future copy should include a mandatory soft medical-context bridge for `pcos_body_uncertainty_control`.
- [ ] Owner confirms no WP3 scoring changes are approved in WP7.
- [ ] Owner confirms no WP4 report object contract changes are approved in WP7.
- [ ] Owner confirms runtime integration remains HOLD.

## What can be approved now

- Copy architecture direction for both unresolved fixtures.
- Owner recommendation to use Option B for both fixtures.
- Future copy guardrails for restriction/rebound relief and PCOS/body uncertainty.
- A future implementation idea to add explicit narrative fields later, if needed.

## What cannot be approved now

- Runtime integration.
- Production report rendering.
- WP3 scoring changes.
- WP3 fixture behavior changes.
- WP4 report object contract changes.
- WP4 tests changes.
- Safety-routing changes.
- PDF generation.
- Deploy.
- Backend/payment/QPay/pricing/entitlement changes.
