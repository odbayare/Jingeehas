# Work Pack 8 Copy Decision Implementation Plan

## Purpose of WP8

WP8 defines a test-only implementation plan for the copy decisions made in WP7. It does not implement a runtime copy layer, does not change the WP4 report object contract, does not change WP3 scoring or fixtures, and does not change production report rendering.

The purpose is to describe how a future non-runtime prototype could attach copy decision metadata to the two copy-sensitive fixtures:

- `all_or_nothing_restriction_rebound`
- `pcos_body_uncertainty_control`

## Source decisions from WP7

WP7 recommended Option B for both unresolved fixtures.

For `all_or_nothing_restriction_rebound`:

- Keep current hidden food function: `hunger_safety`
- Add a future supplementary narrative layer for restriction/rebound relief
- Do not replace hunger safety
- Do not change scoring or fixture behavior

For `pcos_body_uncertainty_control`:

- Keep current safety mode: `mode1`
- Keep current hidden food function: `control_regain`
- Add a mandatory soft medical-context bridge in future copy
- Do not change safety routing now

## Owner decision record is not runtime approval

The WP7 owner decision record, even after it is filled, should not be treated as runtime approval. It is approval for copy architecture direction only unless the owner explicitly approves a later implementation work pack.

Runtime integration remains HOLD until a future work pack proves:

- copy-layer behavior in tests
- no internal key leaks
- professional-first and medical-context boundaries
- no payment blocking of safety content
- no production report rendering regressions

## Future copy-layer concept

A future test-only copy layer may sit after the WP4 report object:

```text
WP3 driver stack
→ WP4 report object
→ future copy decision metadata
→ future test-only copy renderer
→ owner review artifact
```

The copy decision layer would not alter driver scores, primary driver, hidden food function, safety mode, or fixture behavior. It would attach rendering guidance and copy risk constraints for specific fixtures.

## Proposed future non-runtime fields

### `supplementaryNarrative`

Purpose: add a required secondary narrative when the main hidden food function is correct but incomplete.

Initial planned use:

- Fixture: `all_or_nothing_restriction_rebound`
- Narrative ID: `restriction_rebound_relief`
- Purpose: explain relief from failure, punishment, and restart pressure

### `softMedicalContextBridge`

Purpose: add a non-blocking medical-context bridge without changing safety mode.

Initial planned use:

- Fixture: `pcos_body_uncertainty_control`
- Bridge ID: `body_uncertainty_soft_medical_context`
- Purpose: prevent medical-cause implication while keeping ordinary observation path

### `copyRiskFlags`

Purpose: make copy risks explicit for future tests and owner QA.

Initial planned flags:

- `restriction_rebound_shame_risk`
- `hunger_safety_underexplains_rebound`
- `medical_cause_implication_risk`
- `body_uncertainty_sensitivity`
- `payment_blocking_safety_risk`

### `structureDecisionNotes`

Purpose: preserve the owner-approved decision in a stable, readable artifact.

Example:

- `Keep hunger_safety and add restriction_rebound_relief narrative.`
- `Keep mode1 and add body_uncertainty_soft_medical_context bridge.`

## Why these are not added to WP4 in WP8

These fields are not added to WP4 in WP8 because:

- WP8 is docs-only and planning-only.
- WP4 report object contract remains HOLD.
- Adding fields would require test updates and artifact regeneration.
- The owner has not approved a test-only implementation yet.
- Runtime integration remains HOLD.
- Production rendering remains HOLD.

## Future implementation plan for `all_or_nothing_restriction_rebound`

### Current state

- Current hidden function remains: `hunger_safety`
- Current primary driver: `all_or_nothing`
- Current secondary drivers: `meal_gap`, `evening_hunger`, `strict_diet`
- Current interaction: `all_or_nothing_punishment_restriction`
- Current first gentle change: `next_meal_reset_rule`

### Future supplementary narrative ID

`restriction_rebound_relief`

### Copy purpose

Explain relief from failure / punishment / restart pressure.

The future copy should say that hunger safety explains the body side of the rebound, while restriction/rebound relief explains the emotional pressure side:

- "I already failed"
- "tomorrow I must be stricter"
- "I need relief from the pressure"
- "the next meal can reset gently, not punish"

### Future copy-layer attachment rule

Pseudo-rule:

```text
if fixtureName == "all_or_nothing_restriction_rebound":
  keep hiddenFoodFunctionKey == "hunger_safety"
  attach supplementaryNarrative.id == "restriction_rebound_relief"
  require user copy to include hunger-safety explanation
  require user copy to include relief/restart-pressure explanation
```

### Runtime copy gate

Future runtime copy must include both:

- Hunger-safety explanation: the body may be protecting against strong hunger after restriction.
- Relief/restart-pressure narrative: the user may also be trying to escape failure pressure, punishment restriction, or stricter-tomorrow burden.

## Future implementation plan for `pcos_body_uncertainty_control`

### Current state

- Current safety mode remains: `mode1`
- Current hidden function remains: `control_regain`
- Current primary driver: `body_change_uncertainty`
- Current secondary driver: `control_regain`
- Current first gentle change: `body_neutral_private_tracking`
- Current ordinary experiment remains available

### Future bridge ID

`body_uncertainty_soft_medical_context`

### Copy purpose

Prevent medical-cause implication while keeping ordinary observation path.

The future copy should say:

- "Энэ нь онош биш."
- Body uncertainty may increase the need to regain control.
- The report is not saying PCOS, hormones, medication, glucose, or any medical cause explains the result.
- If symptoms are strong, frequent, or concerning, professional clarification is appropriate.
- The 14-day experiment remains observation, not treatment.

### Future copy-layer attachment rule

Pseudo-rule:

```text
if fixtureName == "pcos_body_uncertainty_control":
  keep safetyMode == "mode1"
  keep hiddenFoodFunctionKey == "control_regain"
  attach softMedicalContextBridge.id == "body_uncertainty_soft_medical_context"
  require user copy to include non-diagnostic bridge
  do not suppress ordinary experiment unless professional-first is triggered elsewhere
```

### Runtime copy gate

Future runtime copy must:

- Include non-diagnostic bridge.
- Preserve ordinary observation unless professional-first is triggered.
- Avoid medical-cause claims.
- Avoid body blame.

## Exact future fields/rules a test-only prototype should use

A future test-only prototype should create a fixture-level decision object using:

- `fixtureName`
- `decisionStatus`
- `hiddenFoodFunctionKey`
- `supplementaryNarrative`
- `softMedicalContextBridge`
- `copyRiskFlags`
- `structureDecisionNotes`
- `runtimeGate`

The object should be derived from fixture/report-object identity and owner-approved rules, not from changed WP3 scoring.

## Copy risk flags to produce

For `all_or_nothing_restriction_rebound`:

- `restriction_rebound_shame_risk`
- `hunger_safety_underexplains_rebound`
- `strict_diet_advice_risk`
- `next_meal_reset_rule_may_sound_punitive`

For `pcos_body_uncertainty_control`:

- `medical_cause_implication_risk`
- `body_uncertainty_sensitivity`
- `tracking_may_become_obsessive`
- `ordinary_mode_needs_soft_medical_bridge`

For both:

- `internal_key_leak_risk`
- `runtime_integration_hold`
- `production_rendering_hold`

## Fixture examples that should prove the decision logic

Future test-only examples should include:

1. `all_or_nothing_restriction_rebound`
   - `hiddenFoodFunctionKey` remains `hunger_safety`
   - `supplementaryNarrative.id` is `restriction_rebound_relief`
   - no `softMedicalContextBridge`
   - runtime gate remains false

2. `pcos_body_uncertainty_control`
   - `safetyMode` remains `mode1`
   - `hiddenFoodFunctionKey` remains `control_regain`
   - `softMedicalContextBridge.id` is `body_uncertainty_soft_medical_context`
   - `softMedicalContextBridge.suppressesOrdinaryExperiment` is false
   - runtime gate remains false

3. A normal copy-polish fixture such as `meal_gap_evening_hunger`
   - no supplementary narrative
   - no soft medical bridge
   - only standard copy risk flags

4. A professional-first fixture such as `medication_body_concern_professional_check`
   - professional-first safety remains separate
   - ordinary experiment remains suppressed
   - WP8 soft medical bridge does not replace professional-first behavior

## What must be tested before runtime integration

Before runtime integration, future tests must prove:

- Internal keys do not render directly.
- `all_or_nothing_restriction_rebound` includes both hunger-safety and relief/restart-pressure narrative.
- `pcos_body_uncertainty_control` includes the non-diagnostic medical-context bridge.
- PCOS, hormones, medication, glucose, and medical cause are never claimed as fact.
- `pcos_body_uncertainty_control` keeps ordinary observation unless professional-first is triggered.
- Professional-first safety remains unblocked by payment.
- The 14-day experiment is framed as a test, not a diet instruction.
- No fixture becomes a one-type label.
- Copy risk flags are present for sensitive fixtures.

## What remains HOLD

- Runtime integration
- Production report rendering
- WP3 scoring
- WP3 fixtures
- WP4 report object contract
- WP4 tests
- PDF generation
- Deploy
- Backend/payment/QPay/pricing/entitlement
- localStorage behavior

## Recommended next work pack

Recommended next work pack: Work Pack 9 — Test-Only Copy Decision Metadata Prototype.

That future pack may add test-only files and fixtures for the proposed schema, but only after owner review of WP8.
