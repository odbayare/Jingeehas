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
