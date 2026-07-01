# Work Pack 8 Owner Review Pack

## Recommendation Enum

READY FOR OWNER REVIEW OF COPY DECISION PLAN

## Repository State

### git status --short

```text
?? audits/mvp-diagnostic-migration/work-pack-8/
?? audits/sprint-36-paid-depth-prototype/
```

### git diff --stat

```text
```

### runtime and test-runner diff

```text
```

## Validation Commands and Results

```text
git status --short: PASS (WP8 docs untracked; unrelated audits/sprint-36-paid-depth-prototype/ also untracked)
git diff --check: PASS
node --check app.js: PASS
node --check tests/driver-stack/driverStackReportObject.mjs: PASS
node tests/driver-stack/driverStackReportObject.test.js: PASS (driverStackReportObject tests passed)
node tests/driver-stack/driverStackContract.test.js: PASS (driverStackContract tests passed)
node tests/driver-stack/driverStackFixtures.test.js: PASS (driverStackFixtures tests passed)
node tests/driver-stack/driverStackSafetyInvariants.test.js: PASS (driverStackSafetyInvariants tests passed)
npm test: PASS (All tests passed)
fixture-decision-output-examples.json validation: PASS (2 results, both pass true, both runtime gates false)
runtime and test-runner diff: PASS (empty diff)
deprecated risk flag scan: PASS (no matches)
```

## Changed Files List

```text
audits/mvp-diagnostic-migration/work-pack-8/OWNER_REVIEW_PACK_WP8.md
audits/mvp-diagnostic-migration/work-pack-8/all-or-nothing-copy-decision-plan.md
audits/mvp-diagnostic-migration/work-pack-8/copy-decision-implementation-plan.md
audits/mvp-diagnostic-migration/work-pack-8/copy-risk-flags-spec.md
audits/mvp-diagnostic-migration/work-pack-8/fixture-decision-output-examples.json
audits/mvp-diagnostic-migration/work-pack-8/pcos-body-uncertainty-copy-decision-plan.md
audits/mvp-diagnostic-migration/work-pack-8/proposed-copy-decision-schema.md
audits/mvp-diagnostic-migration/work-pack-8/runtime-gate-checklist.md
audits/mvp-diagnostic-migration/work-pack-8/work-pack-8-recommendation.md
```

## Explicit Confirmation

- No runtime changes
- No app.js changes
- No tests/run-all.js changes
- No scoring/fixture changes
- No WP4 report object contract changes
- No WP4 tests changes
- No production report rendering changes
- No PDF generated
- No deploy
- QPay/backend/payment/pricing/entitlement unchanged

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-8/copy-decision-implementation-plan.md

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

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-8/proposed-copy-decision-schema.md

# Work Pack 8 Proposed Copy Decision Schema

This document proposes a future test-only schema. It is not implemented in WP8 and must not be treated as a WP4 report object contract change.

## Exact pseudo-shape

```js
{
  fixtureName: string,
  decisionStatus: "owner_recommended" | "owner_approved" | "hold",
  hiddenFoodFunctionKey: string | null,
  supplementaryNarrative: null | {
    id: string,
    appliesTo: string[],
    purpose: string,
    requiredInUserCopy: boolean,
    userFacingCopyRule: string,
    forbiddenClaims: string[]
  },
  softMedicalContextBridge: null | {
    id: string,
    appliesTo: string[],
    requiredInUserCopy: boolean,
    doesNotChangeSafetyMode: boolean,
    suppressesOrdinaryExperiment: boolean,
    requiredLanguage: string[],
    forbiddenClaims: string[]
  },
  copyRiskFlags: string[],
  structureDecisionNotes: string[],
  runtimeGate: {
    canRenderInRuntime: boolean,
    requiredBeforeRuntime: string[]
  }
}
```

## Field meanings

| Field | Meaning |
| --- | --- |
| `fixtureName` | Approved WP3/WP4 fixture name. |
| `decisionStatus` | Owner decision lifecycle for the copy decision metadata. |
| `hiddenFoodFunctionKey` | Existing hidden food function from the WP4 artifact. Must not change scoring. |
| `supplementaryNarrative` | Optional non-primary narrative required for user-facing copy. |
| `softMedicalContextBridge` | Optional non-blocking medical-context bridge that does not change safety mode. |
| `copyRiskFlags` | Explicit copy QA risks future tests should inspect. |
| `structureDecisionNotes` | Human-readable summary of the WP7 decision. |
| `runtimeGate` | Explicit runtime HOLD status and requirements before future integration. |

## Proposed fixture object: `all_or_nothing_restriction_rebound`

```js
{
  fixtureName: "all_or_nothing_restriction_rebound",
  decisionStatus: "owner_recommended",
  hiddenFoodFunctionKey: "hunger_safety",
  supplementaryNarrative: {
    id: "restriction_rebound_relief",
    appliesTo: [
      "all_or_nothing",
      "strict_diet",
      "meal_gap",
      "evening_hunger",
      "all_or_nothing_punishment_restriction"
    ],
    purpose: "Explain relief from failure, punishment, and restart pressure while preserving hunger_safety as the body-state hidden function.",
    requiredInUserCopy: true,
    userFacingCopyRule: "User copy must include both hunger-safety and relief/restart-pressure narrative.",
    forbiddenClaims: [
      "the user is weak",
      "the user failed",
      "stricter dieting is the solution",
      "hunger is the only explanation"
    ]
  },
  softMedicalContextBridge: null,
  copyRiskFlags: [
    "restriction_rebound_shame_risk",
    "hunger_safety_underexplains_rebound",
    "strict_diet_advice_risk",
    "next_meal_reset_rule_may_sound_punitive",
    "internal_key_leak_risk",
    "runtime_integration_hold",
    "production_rendering_hold"
  ],
  structureDecisionNotes: [
    "Keep hunger_safety as the hidden food function.",
    "Add restriction_rebound_relief as supplementary narrative in future copy.",
    "Do not change scoring, fixtures, or WP4 report object contract in WP8."
  ],
  runtimeGate: {
    canRenderInRuntime: false,
    requiredBeforeRuntime: [
      "Owner approval of copy decision metadata.",
      "Test-only prototype proves supplementaryNarrative renders without internal keys.",
      "Runtime copy includes hunger-safety and relief/restart-pressure narrative.",
      "No strict diet or shame-language regression."
    ]
  }
}
```

## Proposed fixture object: `pcos_body_uncertainty_control`

```js
{
  fixtureName: "pcos_body_uncertainty_control",
  decisionStatus: "owner_recommended",
  hiddenFoodFunctionKey: "control_regain",
  supplementaryNarrative: null,
  softMedicalContextBridge: {
    id: "body_uncertainty_soft_medical_context",
    appliesTo: [
      "body_change_uncertainty",
      "control_regain",
      "pcos_body_uncertainty_control",
      "body_neutral_private_tracking"
    ],
    requiredInUserCopy: true,
    doesNotChangeSafetyMode: true,
    suppressesOrdinaryExperiment: false,
    requiredLanguage: [
      "Энэ нь онош биш.",
      "тодорхойгүй байдал",
      "хяналтаа буцааж авах оролдлого",
      "тодруулах хэрэгтэй байж магадгүй"
    ],
    forbiddenClaims: [
      "PCOS caused this",
      "hormones caused this",
      "medication caused this",
      "glucose caused this",
      "medical cause is known",
      "ordinary observation is treatment"
    ]
  },
  copyRiskFlags: [
    "medical_cause_implication_risk",
    "body_uncertainty_sensitivity",
    "tracking_may_become_obsessive",
    "ordinary_mode_needs_soft_medical_bridge",
    "internal_key_leak_risk",
    "runtime_integration_hold",
    "production_rendering_hold"
  ],
  structureDecisionNotes: [
    "Keep mode1 ordinary safety mode.",
    "Keep control_regain as the hidden food function.",
    "Add body_uncertainty_soft_medical_context bridge in future copy.",
    "Do not claim PCOS, hormones, medication, glucose, or medical cause as fact."
  ],
  runtimeGate: {
    canRenderInRuntime: false,
    requiredBeforeRuntime: [
      "Owner approval of copy decision metadata.",
      "Test-only prototype proves softMedicalContextBridge is present.",
      "Copy says this is not diagnosis.",
      "Copy preserves ordinary observation unless professional-first is triggered.",
      "No medical-cause implication regression."
    ]
  }
}
```

## Proposed neutral fixture object for comparison

```js
{
  fixtureName: "meal_gap_evening_hunger",
  decisionStatus: "hold",
  hiddenFoodFunctionKey: "hunger_safety",
  supplementaryNarrative: null,
  softMedicalContextBridge: null,
  copyRiskFlags: [
    "internal_key_leak_risk",
    "hunger_safety_may_sound_alarming",
    "runtime_integration_hold",
    "production_rendering_hold"
  ],
  structureDecisionNotes: [
    "No WP7 structure decision required.",
    "Copy polish only."
  ],
  runtimeGate: {
    canRenderInRuntime: false,
    requiredBeforeRuntime: [
      "Future runtime copy layer approved.",
      "Internal keys translated.",
      "Hunger safety explained without alarm."
    ]
  }
}
```

## Proposed professional-first comparison object

```js
{
  fixtureName: "medication_body_concern_professional_check",
  decisionStatus: "hold",
  hiddenFoodFunctionKey: "quick_recovery",
  supplementaryNarrative: null,
  softMedicalContextBridge: null,
  copyRiskFlags: [
    "professional_first_safety_copy_required",
    "medical_cause_implication_risk",
    "payment_blocking_safety_risk",
    "runtime_integration_hold",
    "production_rendering_hold"
  ],
  structureDecisionNotes: [
    "Professional-first safety remains separate from WP8 soft medical context bridge.",
    "Ordinary experiment remains suppressed by existing safety route.",
    "WP8 does not replace professional-first behavior."
  ],
  runtimeGate: {
    canRenderInRuntime: false,
    requiredBeforeRuntime: [
      "Professional-first safety copy approved.",
      "Safety copy visible without payment.",
      "Ordinary experiment remains suppressed.",
      "No diagnosis or fear-pressure regression."
    ]
  }
}
```

## Future validation expectations

A future test-only prototype should assert:

- Only the two WP7 decision fixtures receive the new decision metadata.
- `all_or_nothing_restriction_rebound` receives `supplementaryNarrative`.
- `pcos_body_uncertainty_control` receives `softMedicalContextBridge`.
- Neither fixture changes WP3 driver scores or WP4 report object fields.
- `runtimeGate.canRenderInRuntime` remains false.
- Forbidden claims are present in the metadata and can be checked by future copy tests.

## What remains HOLD

- Implementing this schema in code
- Updating tests
- Updating `tests/run-all.js`
- Changing WP4 report object contract
- Runtime integration
- Production report rendering
- PDF generation
- Deploy
- Backend/payment/QPay/pricing/entitlement

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-8/all-or-nothing-copy-decision-plan.md

# Work Pack 8 All-or-Nothing Copy Decision Plan

Focus fixture: `all_or_nothing_restriction_rebound`

## Current WP4 object facts

- Fixture name: `all_or_nothing_restriction_rebound`
- Safety mode: `mode1`
- Primary driver: `all_or_nothing`
- Secondary drivers: `meal_gap`, `evening_hunger`, `strict_diet`
- Interaction ID: `all_or_nothing_punishment_restriction`
- Vulnerable moment ID: `all_or_nothing_punishment_restriction`
- Hidden food function: `hunger_safety`
- First gentle change: `next_meal_reset_rule`
- 14-day experiment duration: 14
- Professional-first: false

## WP7 recommended decision

WP7 recommended Option B:

- Keep `hunger_safety` as the current hidden food function.
- Add a future supplementary narrative layer for restriction/rebound relief.
- Do not change WP3 scoring, WP3 fixtures, WP4 report object contract, or runtime behavior now.

## Proposed `supplementaryNarrative`

- Field: `supplementaryNarrative`
- Exact narrative ID: `restriction_rebound_relief`
- Applies to: `all_or_nothing`, `strict_diet`, `meal_gap`, `evening_hunger`, `all_or_nothing_punishment_restriction`
- Required in future user copy: true
- Purpose: explain relief from failure / punishment / restart pressure while preserving `hunger_safety` as the body-state explanation.

## Copy components

### Hunger-safety explanation

Future copy must explain that the body may be protecting against strong hunger after restriction, long gaps, or evening hunger. This should remain body-neutral and non-shaming.

### Relief from failure pressure

Future copy must explain that the user may also be trying to get temporary relief from the feeling that they have already failed.

### Punishment/restart pressure

Future copy must name the pressure of "tomorrow I must be stricter" without encouraging stricter dieting.

### Next-meal reset as gentleness

Future copy must frame `next_meal_reset_rule` as a gentle next-meal reset, not another rule, punishment, or compensation plan.

## Forbidden copy

Do not use or imply:

- weak / failed
- stricter dieting
- discipline failure
- compensate tomorrow
- hunger as the only explanation

## Proposed user-facing paragraph draft in Mongolian

`Энд зөвхөн өлсөлт биш, “аль хэдийн алдсан” гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Хэт чанга барих, удаан өлсөх, дараа нь маргааш илүү чангална гэж бодох нь rebound-ийн дарамтыг нэмэгдүүлж болно. Тиймээс эхний алхам нь өөрийгөө шийтгэх биш, дараагийн хоолоо зөөлөн эхлүүлж биеийн өлсөлт болон restart дарамт хоёр хэр өөрчлөгдөхийг ажиглах юм.`

## Test-only acceptance criteria

A future test-only prototype should pass only if:

- `hiddenFoodFunctionKey` remains `hunger_safety`.
- `supplementaryNarrative.id` is `restriction_rebound_relief`.
- `supplementaryNarrative.requiredInUserCopy` is true.
- `softMedicalContextBridge` is null.
- `copyRiskFlags` include `restriction_rebound_shame_risk`, `hunger_safety_underexplains_rebound`, and `punishment_restart_pressure`.
- User-facing draft includes both hunger-safety and relief/restart-pressure concepts.
- User-facing draft does not say the user is weak, failed, undisciplined, or should compensate tomorrow.
- `runtimeGate.canRenderInRuntime` remains false.

## Runtime gate

Runtime integration remains HOLD. Future runtime copy may not render this fixture until:

- owner approves the copy decision metadata
- future tests prove `restriction_rebound_relief` is attached
- the copy includes both hunger-safety and relief/restart-pressure narrative
- strict dieting and shame-language regressions are blocked
- internal keys are not rendered to the user

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-8/pcos-body-uncertainty-copy-decision-plan.md

# Work Pack 8 PCOS / Body Uncertainty Copy Decision Plan

Focus fixture: `pcos_body_uncertainty_control`

## Current WP4 object facts

- Fixture name: `pcos_body_uncertainty_control`
- Safety mode: `mode1`
- Primary driver: `body_change_uncertainty`
- Secondary drivers: `control_regain`
- Interaction ID: `pcos_body_uncertainty_control`
- Vulnerable moment ID: `pcos_body_uncertainty_control`
- Hidden food function: `control_regain`
- First gentle change: `body_neutral_private_tracking`
- 14-day experiment duration: 14
- Professional-first: false

## WP7 recommended decision

WP7 recommended Option B:

- Keep ordinary mode as `mode1`.
- Keep current hidden food function as `control_regain`.
- Add a mandatory soft medical-context bridge in future copy.
- Do not change safety routing now.
- Do not claim PCOS, hormones, medication, glucose, or any medical cause as fact.

## Proposed `softMedicalContextBridge`

- Field: `softMedicalContextBridge`
- Exact bridge ID: `body_uncertainty_soft_medical_context`
- Applies to: `body_change_uncertainty`, `control_regain`, `pcos_body_uncertainty_control`, `body_neutral_private_tracking`
- Required in future user copy: true
- Does not change safety mode: true
- Suppresses ordinary experiment: false
- Purpose: prevent medical-cause implication while keeping ordinary observation path.

## Copy components

### Ordinary mode remains `mode1`

Future copy must preserve ordinary mode. It should not route this fixture to professional-first unless another safety route triggers that behavior.

### 14-day observation remains allowed

The 14-day experiment remains an observation experiment. It is not treatment, diagnosis, or medical advice.

### Bridge says this is not diagnosis

The bridge must explicitly say: `Энэ нь онош биш.`

### Bridge does not claim PCOS/hormones/medication/glucose as cause

The bridge must state that the report is not claiming PCOS, hormones, medication, glucose, or medical cause as fact.

### Body-neutral wording

Future copy must use body-neutral language such as `тодорхойгүй байдал` and `хяналтаа буцааж авах оролдлого`.

## Forbidden copy

Do not use or imply:

- PCOS caused it
- hormones caused it
- medication caused it
- glucose caused it
- this is a diagnosis
- this is treatment advice

## Proposed user-facing paragraph draft in Mongolian

`Энэ нь онош биш. Биеийн өөрчлөлт юунаас болж байгааг мэдэхгүй байх тодорхойгүй байдал нь хяналтаа буцааж авах оролдлогыг нэмэгдүүлж байж магадгүй. Энэ нь PCOS, даавар, эм, глюкоз, эсвэл өөр нэг шалтгаанаас болсон гэж хэлж байгаа хэрэг биш; харин ийм нөхцөлд биеийн дохиог тайван ажиглаж, хэрэв санаа зовоож байвал тодруулах хэрэгтэй байж магадгүй гэсэн зөөлөн чиглэл юм.`

## Test-only acceptance criteria

A future test-only prototype should pass only if:

- `safetyMode` remains `mode1`.
- `hiddenFoodFunctionKey` remains `control_regain`.
- `softMedicalContextBridge.id` is `body_uncertainty_soft_medical_context`.
- `softMedicalContextBridge.doesNotChangeSafetyMode` is true.
- `softMedicalContextBridge.suppressesOrdinaryExperiment` is false.
- `supplementaryNarrative` is null.
- `copyRiskFlags` include `medical_cause_implication_risk`, `body_uncertainty_sensitivity`, `soft_professional_context_needed`, and `ordinary_experiment_allowed_with_medical_bridge`.
- Required language includes `Энэ нь онош биш.` and `тодруулах хэрэгтэй байж магадгүй`.
- Forbidden claims include PCOS, hormones, medication, glucose, diagnosis, and treatment claims.
- `runtimeGate.canRenderInRuntime` remains false.

## Runtime gate

Runtime integration remains HOLD. Future runtime copy may not render this fixture until:

- owner approves the copy decision metadata
- future tests prove `body_uncertainty_soft_medical_context` is attached
- the copy includes a non-diagnostic bridge
- ordinary observation remains allowed unless professional-first is triggered
- medical-cause implication claims are blocked
- internal keys are not rendered to the user

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-8/copy-risk-flags-spec.md

# Work Pack 8 Copy Risk Flags Spec

This spec defines future copy risk flags for a test-only copy decision prototype. It does not implement flags in runtime code.

| Flag | Meaning | When triggered | Required copy guardrail | Runtime gate implication |
| --- | --- | --- | --- | --- |
| `restriction_rebound_shame_risk` | Copy could make the user feel weak, failed, or morally judged after restriction/rebound. | Trigger for `all_or_nothing_restriction_rebound` and any future punishment/restriction fixture. | Use non-shaming language; say rebound is not discipline failure. | Runtime copy blocked until shame-language checks pass. |
| `hunger_safety_underexplains_rebound` | `hunger_safety` explains body-state rebound but not emotional relief/restart pressure. | Trigger when hidden function is `hunger_safety` and interaction includes all-or-nothing or punishment restriction. | Include supplementary relief/restart-pressure narrative. | Runtime copy blocked until both hunger-safety and relief narrative are present. |
| `punishment_restart_pressure` | Copy must address the pressure to punish oneself or restart stricter tomorrow. | Trigger for `all_or_nothing_restriction_rebound`. | Frame next-meal reset as gentleness, not compensation or stricter dieting. | Runtime copy blocked if it recommends stricter dieting or compensate-tomorrow framing. |
| `medical_cause_implication_risk` | Copy could imply PCOS, hormones, medication, glucose, or medical cause as fact. | Trigger for `pcos_body_uncertainty_control`, professional-first fixtures, and future body-state uncertainty cases. | Include "Энэ нь онош биш" and uncertainty language. | Runtime copy blocked until medical-cause claims are absent. |
| `body_uncertainty_sensitivity` | Body uncertainty copy can become exposing, body-blaming, or too medical. | Trigger when primary driver is `body_change_uncertainty`. | Use body-neutral wording and avoid appearance judgment. | Runtime copy blocked until body-neutral review passes. |
| `soft_professional_context_needed` | Ordinary-mode copy needs a soft bridge to professional clarification without safety escalation. | Trigger for `pcos_body_uncertainty_control`. | Use "тодруулах хэрэгтэй байж магадгүй" without changing mode or diagnosing. | Runtime copy blocked until non-blocking bridge is present. |
| `ordinary_experiment_allowed_with_medical_bridge` | Ordinary observation remains allowed even with a soft medical-context bridge. | Trigger for `pcos_body_uncertainty_control` while safety mode remains `mode1`. | Keep the 14-day experiment as observation, not treatment. | Runtime copy blocked if the bridge suppresses ordinary observation without professional-first trigger. |
| `internal_key_leak_risk` | Internal keys could leak into user-facing copy. | Trigger for every fixture until a copy translation layer exists. | Translate all keys into approved Mongolian copy. | Runtime copy blocked until internal key leak tests pass. |
| `payment_blocking_safety_risk` | Safety or professional-context guidance could be hidden behind payment. | Trigger for safety, professional-first, and medical-context copy. | Safety and professional-context copy must be visible before payment. | Runtime copy blocked until payment-boundary checks pass. |

## Flag usage rules

- Flags are future QA metadata, not user-facing copy.
- Flags should be generated in test-only artifacts before runtime implementation.
- Flags should not change WP3 scoring, WP3 fixtures, or WP4 report object fields.
- Flags should not render in production reports.
- Flags should drive future tests and owner review.

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-8/runtime-gate-checklist.md

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

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-8/fixture-decision-output-examples.json

{
  "version": "copy-decision-implementation-plan-v0-test-only",
  "generatedBy": "audits/mvp-diagnostic-migration/work-pack-8",
  "recommendation": "READY FOR OWNER REVIEW OF COPY DECISION PLAN",
  "fixtureCount": 2,
  "results": [
    {
      "fixtureName": "all_or_nothing_restriction_rebound",
      "decisionStatus": "owner_recommended",
      "hiddenFoodFunctionKey": "hunger_safety",
      "supplementaryNarrative": {
        "id": "restriction_rebound_relief",
        "appliesTo": [
          "all_or_nothing",
          "strict_diet",
          "meal_gap",
          "evening_hunger",
          "all_or_nothing_punishment_restriction"
        ],
        "purpose": "Explain relief from failure, punishment, and restart pressure while preserving hunger_safety as the body-state hidden function.",
        "requiredInUserCopy": true,
        "userFacingCopyRule": "User copy must include both hunger-safety and relief/restart-pressure narrative.",
        "forbiddenClaims": [
          "weak",
          "failed",
          "stricter dieting",
          "discipline failure",
          "compensate tomorrow",
          "hunger as the only explanation"
        ]
      },
      "softMedicalContextBridge": null,
      "copyRiskFlags": [
        "restriction_rebound_shame_risk",
        "hunger_safety_underexplains_rebound",
        "punishment_restart_pressure",
        "internal_key_leak_risk"
      ],
      "structureDecisionNotes": [
        "Keep hunger_safety as the hidden food function.",
        "Add restriction_rebound_relief as supplementary narrative in future copy.",
        "Do not change WP3 scoring, WP3 fixtures, or WP4 report object contract in WP8."
      ],
      "runtimeGate": {
        "canRenderInRuntime": false,
        "requiredBeforeRuntime": [
          "Owner approval of copy decision metadata.",
          "Future tests prove supplementaryNarrative renders without internal keys.",
          "Runtime copy includes hunger-safety and relief/restart-pressure narrative.",
          "No strict diet, shame-language, or compensate-tomorrow regression."
        ]
      },
      "pass": true
    },
    {
      "fixtureName": "pcos_body_uncertainty_control",
      "decisionStatus": "owner_recommended",
      "hiddenFoodFunctionKey": "control_regain",
      "supplementaryNarrative": null,
      "softMedicalContextBridge": {
        "id": "body_uncertainty_soft_medical_context",
        "appliesTo": [
          "body_change_uncertainty",
          "control_regain",
          "pcos_body_uncertainty_control",
          "body_neutral_private_tracking"
        ],
        "requiredInUserCopy": true,
        "doesNotChangeSafetyMode": true,
        "suppressesOrdinaryExperiment": false,
        "requiredLanguage": [
          "Энэ нь онош биш.",
          "тодорхойгүй байдал",
          "хяналтаа буцааж авах оролдлого",
          "тодруулах хэрэгтэй байж магадгүй"
        ],
        "forbiddenClaims": [
          "PCOS caused it",
          "hormones caused it",
          "medication caused it",
          "glucose caused it",
          "this is a diagnosis",
          "this is treatment advice"
        ]
      },
      "copyRiskFlags": [
        "medical_cause_implication_risk",
        "body_uncertainty_sensitivity",
        "soft_professional_context_needed",
        "ordinary_experiment_allowed_with_medical_bridge",
        "internal_key_leak_risk",
        "payment_blocking_safety_risk"
      ],
      "structureDecisionNotes": [
        "Keep mode1 ordinary safety mode.",
        "Keep control_regain as the hidden food function.",
        "Add body_uncertainty_soft_medical_context bridge in future copy.",
        "Do not claim PCOS, hormones, medication, glucose, or medical cause as fact."
      ],
      "runtimeGate": {
        "canRenderInRuntime": false,
        "requiredBeforeRuntime": [
          "Owner approval of copy decision metadata.",
          "Future tests prove softMedicalContextBridge is present.",
          "Copy says this is not diagnosis.",
          "Copy preserves ordinary observation unless professional-first is triggered.",
          "No medical-cause implication regression."
        ]
      },
      "pass": true
    }
  ]
}

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-8/work-pack-8-recommendation.md

# Work Pack 8 Recommendation

## Recommendation Enum

READY FOR OWNER REVIEW OF COPY DECISION PLAN

## Basis

All required WP8 planning documents exist, the two copy-sensitive fixtures are covered, and `fixture-decision-output-examples.json` includes exactly two result items with `pass: true`.

Covered fixtures:

- `all_or_nothing_restriction_rebound`
- `pcos_body_uncertainty_control`

## Hold conditions

Runtime integration remains HOLD. Production report rendering remains HOLD. WP3 scoring, WP3 fixtures, WP4 report object contract, WP4 tests, `tests/run-all.js`, PDF generation, deploy, backend, payment, QPay, pricing, entitlement, and localStorage remain out of scope.
