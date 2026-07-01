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
