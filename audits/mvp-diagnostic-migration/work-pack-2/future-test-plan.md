# Future Test Plan

Scope: future tests only. Do not add tests or change runtime as part of this work pack.

## Test Strategy

The future migration should be test-first and parallel:

```text
existing mechanism engine remains unchanged
new test-only driver stack calculator reads current evidence
tests compare expected driver-stack contract
runtime behavior changes only after contract is stable
```

## Test Categories

### 1. Crosswalk Unit Tests

Purpose:
Verify old mechanism evidence maps to expected new driver candidates.

Example assertions:

- `hungerSafety` evidence maps to `meal_gap`, `evening_hunger`, and `hunger_safety`.
- `cue` evidence maps to exact environment driver when option metadata is specific.
- `collapse` evidence maps to `all_or_nothing` and `monday_restart`.
- `medical` evidence can elevate safety keys.

Do not assert user-facing report copy.

### 2. Direct Answer Override Tests

Purpose:
Verify exact answer options refine the generic old mechanism mapping.

Examples:

- Delivery answer maps to `delivery_app`, not just `low_friction_default`.
- Food photo answer maps to `food_photo_cue`.
- Social refusal answer maps to `social_table` and `belonging`.
- "Маргааш илүү чанга" maps to `punishment_restriction`.

### 3. Driver Score Weight Tests

Purpose:
Verify scoring is explainable and conservative.

Examples:

- Stage-only evidence stays `possible` unless strong direct safety.
- Diary repeated on 3+ days becomes `strong`.
- Confirmed diary narrative weighs more than unconfirmed raw text.
- Contradiction can reduce a one-time assumption.

### 4. Driver Stack Contract Tests

Purpose:
Verify full output object shape and required fields.

Assertions:

- `version` exists.
- `safety_route` exists.
- `driver_scores` includes expected keys.
- `primary_driver` is non-safety when ordinary report is allowed.
- `secondary_drivers` include overlapping layers.
- `interaction_pattern` has stable ID.
- `vulnerable_moment` has required components.
- `first_gentle_change` targets modifiable driver.
- `removed_feature_diary_confirmation_targets` are present.

### 5. Vulnerable Moment Tests

Purpose:
Verify vulnerable moment combines time, state, trigger, and function.

Examples:

- Evening + meal gap + fatigue + delivery app -> `evening_meal_gap_fatigue_delivery`.
- Stress + decompression + guilt -> `stress_decompression_guilt`.
- Body signal + medical concern -> safety/professional-first moment.

### 6. Safety Invariant Tests

Purpose:
Protect current safety behavior.

Required assertions:

- Mode4 urgent suppresses ordinary report, paywall, and ordinary experiment.
- Mode3 professional-first suppresses ordinary 14-day experiment.
- Medical red flags outrank ordinary driver-stack output.
- Compensatory behavior maps to `professional_first`.
- Severe body distress does not receive shame-based diet advice.
- Payment/entitlement state cannot hide safety output.

### 7. Diary Confirmation Tests

Purpose:
Verify 7-day diary can confirm or weaken the initial driver stack.

Examples:

- 5 days with meal gaps confirms `meal_gap`.
- 5 days with low energy/default choice confirms `fatigue + low_friction_default`.
- No-unplanned days produce protective-condition evidence.
- Diary contradiction weakens stage-only reward.

### 8. Fixture Archetype Tests

Purpose:
Run the archetype plan in `fixture-archetype-plan.md`.

Minimum fixtures:

- evening meal gap + fatigue + delivery;
- stress decompression + guilt;
- cue/food photo;
- social/alcohol;
- restriction/Monday restart;
- sleep/circadian;
- loneliness/emptiness;
- body change/shame;
- medical/professional-first;
- contradiction fixture.

## Existing Tests To Preserve

Future work must preserve the spirit of these existing areas:

| Existing test area | Reason |
|---|---|
| safety readiness | Safety routes are non-negotiable. |
| evidence scoring calibration | Current mechanism evidence must remain stable. |
| question metadata mechanisms | New driver metadata should build on current metadata. |
| report bible sections | Report structure should not regress. |
| virtual user QA | Multi-scenario behavior should remain plausible. |
| payment/paywall tests | Safety/payment boundaries must remain intact. |
| mock backend entitlements | Entitlement behavior must not be accidentally changed. |
| coach/report sharing tests | Driver-stack work should not alter coach/admin flows. |

## Test Data Handling

- Use synthetic fixtures only.
- Do not include real user data.
- Do not include raw sensitive text in expected outputs unless needed for fixture clarity.
- Prefer reason codes over long raw narrative assertions.
- Keep safety fixture text minimal but sufficient.

## Non-Goals

- No PDF generation tests in Work Pack 2.
- No visual/browser tests in Work Pack 2.
- No QPay tests in Work Pack 2.
- No deployment tests in Work Pack 2.
- No production smoke tests in Work Pack 2.

## Recommended Future Test File Names

Potential names for a later implementation work pack:

```text
tests/driver-taxonomy-crosswalk.test.js
tests/driver-scoring-contract.test.js
tests/driver-stack-fixtures.test.js
tests/vulnerable-moment-contract.test.js
tests/driver-stack-safety-invariants.test.js
```

These should not be added until the owner approves moving from docs/spec to test implementation.
