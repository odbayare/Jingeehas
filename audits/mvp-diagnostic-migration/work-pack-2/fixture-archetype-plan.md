# Fixture Archetype Plan

Scope: test fixture planning only. These are not user-facing personas and should not be used to label real users. They exist to test the future driver-stack contract.

## Fixture Design Principles

- Each fixture should include current `stageAnswers` and optional `diaryEntries`.
- Each fixture should still pass through the current mechanism engine.
- Expected results should assert new driver-stack fields, not report copy.
- Safety fixtures must verify ordinary report/experiment suppression.
- Fixtures should test overlap and contradiction, not one-driver purity.

## Proposed Fixtures

### 1. Evening Meal Gap + Fatigue + Delivery

Purpose:
Validate body/rhythm plus environment stack.

Expected old mechanisms:
`hungerSafety`, `executive`, `circadian`, `decisionDefault`

Expected new drivers:
Primary: `meal_gap` or `evening_hunger`
Secondary: `fatigue`, `delivery_app`, `low_friction_default`
Food function: `hunger_safety`, `quick_recovery`

Expected interaction:
`meal_gap_fatigue_low_friction_default`

Expected first gentle change:
Planned bridge meal/snack before long gap plus one default dinner option.

### 2. Stress Decompression + Guilt Loop

Purpose:
Validate psychology + food function + rebound.

Expected old mechanisms:
`regulation`, `collapse`, possibly `shameAvoidance`

Expected new drivers:
Primary: `stress`
Secondary: `decompression`, `guilt`, `all_or_nothing`
Food function: `decompression`, `comfort`

Expected interaction:
`stress_decompression_guilt`

Expected first gentle change:
Pre-eating pause or decompression ritual before food decision.

### 3. Visible Snack / Food Photo Cue

Purpose:
Validate habit/environment drivers.

Expected old mechanisms:
`cue`, `reward`, `decisionDefault`

Expected new drivers:
Primary: `visible_snacks` or `food_photo_cue`
Secondary: `low_friction_default`, `self_reward`
Food function: `self_reward`

Expected interaction:
`cue_reward_low_friction_default`

Expected first gentle change:
Move one cue farther away and prepare one desired default.

### 4. Social Table + Belonging + Alcohol

Purpose:
Validate social and alcohol context.

Expected old mechanisms:
`social`, possible `reward`, possible `collapse`

Expected new drivers:
Primary: `social_table`
Secondary: `belonging`, `alcohol_context`, `monday_restart`
Food function: `belonging`

Expected interaction:
`social_belonging_alcohol`

Expected first gentle change:
One pre-decided social script or boundary that preserves belonging.

Current gap:
Alcohol context is only partially captured through diary drinks; future direct question may be needed.

### 5. Restriction / Monday Restart Rebound

Purpose:
Validate restriction/rebound stack.

Expected old mechanisms:
`collapse`, `perfectionism`, `autonomy`, `hungerSafety`

Expected new drivers:
Primary: `all_or_nothing`
Secondary: `monday_restart`, `strict_diet`, `punishment_restriction`, `fasting_rebound`
Food function: `control_regain`, `escape_from_failure`

Expected interaction:
`all_or_nothing_punishment_restriction`

Expected first gentle change:
Next-meal reset and a 70% good-enough rule.

### 6. Sleep Disruption / Circadian Reward Pull

Purpose:
Validate sleep/body rhythm and reward overlap.

Expected old mechanisms:
`circadian`, `reward`, `executive`

Expected new drivers:
Primary: `sleep_disruption`
Secondary: `fatigue`, `quick_recovery`, `self_reward`
Food function: `quick_recovery`

Expected interaction:
`sleep_disruption_fatigue_reward`

Expected first gentle change:
Morning/first meal anchor, caffeine timing, and planned evening rest.

### 7. Loneliness / Emptiness Soothing

Purpose:
Validate distinct psychology and food-function separation.

Expected old mechanisms:
`regulation`, `rewardDeficit`, `social`

Expected new drivers:
Primary: `loneliness` or `emptiness`
Secondary: `loneliness_soothing`, `comfort`, `self_reward`
Food function: `loneliness_soothing` or `comfort`

Expected interaction:
`loneliness_comfort_reward_deficit`

Expected first gentle change:
Non-food contact/comfort slot or evening support ritual.

Current gap:
Current questions include loneliness and empty feeling but could distinguish them more clearly later.

### 8. Body Change Uncertainty + Shame

Purpose:
Validate body image/stigma and safety boundary.

Expected old mechanisms:
`bodySafety`, `shameAvoidance`, `identity`, possible `medical`

Expected new drivers:
Primary: `body_change_uncertainty`
Secondary: `shame`, `escape_from_shame`, possible `severe_body_distress`
Food function: `escape_from_shame`

Expected interaction:
`body_change_uncertainty_shame`

Expected first gentle change:
Body-neutral private tracking or professional-first summary depending severity.

Safety expectation:
If distress is severe, ordinary experiment should be suppressed or softened.

### 9. Medical Red Flag / Professional First

Purpose:
Validate safety route priority.

Expected old mechanisms:
`medical`, `glucose`, `physiological`

Expected new drivers:
Safety: `medical_red_flag`, `professional_first`
Ordinary drivers: optional, not leading

Expected interaction:
`medical_first_body_signal`

Expected first gentle change:
No ordinary weight-loss experiment. Prepare professional discussion summary.

Safety expectation:
Mode3 or mode4 must override payment, report, and ordinary experiment.

### 10. Stage Says Reward, Diary Shows Meal Gap

Purpose:
Validate contradiction handling.

Expected old mechanisms:
Stage: `reward`
Diary: `hungerSafety`, `circadian`, `executive`

Expected new drivers:
Primary after diary: `meal_gap` or `evening_hunger`
Secondary: `self_reward`, `fatigue`

Expected interaction:
`meal_gap_fatigue_reward`

Expected first gentle change:
Bridge meal before reward restriction.

Contradiction expectation:
One-time reward assumption should be weakened, not erased.

## Fixture Data Requirements

Each future fixture should include:

```text
name
description
stageAnswers
stageVoiceSummaries if needed
diaryEntries if needed
expectedCurrentMode
expectedOldMechanisms
expectedDriverStack
expectedSafetyRoute
expectedVulnerableMoment
expectedFirstGentleChange
expectedDiaryConfirmationTargets
expectedNormalizedDriverScores
```

## Minimum Acceptance Criteria

- At least 10 fixtures.
- At least 3 include 5+ diary entries.
- At least 2 are one-time-only.
- At least 2 are safety/professional-first.
- At least 1 tests contradiction.
- At least 1 tests no-unplanned-day/protective conditions.
- No fixture should assert a one-type label.
- Fixture assertions should use `normalizedScore` and `strength`, not fragile raw point totals.
