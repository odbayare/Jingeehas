# Work Pack 8 Runtime Gate Checklist

This checklist is a planning artifact only. It does not approve runtime integration, production report rendering, PDF generation, deploy, payment changes, scoring changes, fixture changes, or WP4 report object contract changes.

## Required gates before runtime integration

- [ ] Owner decision record filled.
- [ ] Copy decision plan approved.
- [ ] Test-only prototype created.
- [ ] No internal key leakage.
- [ ] Professional-first safety copy unblocked.
- [ ] Medical context bridge non-diagnostic.
- [ ] Restriction/rebound narrative non-shaming.
- [ ] 14-day experiment remains test, not command.
- [ ] 7-day diary remains observation, not judgment.
- [ ] No PDF generation until report copy approved.
- [ ] No deploy until regression QA passes.

## Gate details

### Owner decision record filled

The owner must explicitly approve the selected WP7/WP8 direction for both `all_or_nothing_restriction_rebound` and `pcos_body_uncertainty_control`.

### Copy decision plan approved

The owner must approve the proposed `supplementaryNarrative`, `softMedicalContextBridge`, `copyRiskFlags`, and `runtimeGate` planning rules before any test-only implementation.

### Test-only prototype created

A future prototype must remain test-only and must not modify runtime app behavior, WP3 scoring, WP3 fixtures, or the WP4 report object contract unless a later work pack explicitly approves that scope.

### No internal key leakage

Future rendered copy must not expose internal keys such as `hunger_safety`, `restriction_rebound_relief`, `body_uncertainty_soft_medical_context`, `control_regain`, or `body_change_uncertainty`.

### Professional-first safety copy unblocked

Safety guidance and professional-first copy must be visible without payment. Payment, entitlement, QPay, or pricing logic must not block safety content.

### Medical context bridge non-diagnostic

The `pcos_body_uncertainty_control` bridge must say this is not diagnosis and must not claim PCOS, hormones, medication, glucose, or medical cause as fact.

### Restriction/rebound narrative non-shaming

The `all_or_nothing_restriction_rebound` narrative must not call the user weak, failed, undisciplined, or in need of stricter dieting.

### 14-day experiment remains test, not command

The experiment must be framed as a hypothesis and observation period, not a compliance task, diet order, or weight-loss command.

### 7-day diary remains observation, not judgment

The diary must help confirm patterns and signals. It must not grade the user or become a shame/compliance tracker.

### No PDF generation until report copy approved

PDF generation remains HOLD until production report copy and safety copy are separately approved.

### No deploy until regression QA passes

No deploy is allowed until a future runtime implementation has regression QA proving no runtime, payment, safety, or report-rendering regressions.
