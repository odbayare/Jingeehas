# Driver Stack Contract

Scope: test-only contract for a future parallel driver-stack object. This is not a runtime implementation and must not change existing app behavior.

## Purpose

The driver stack makes explicit what the current mechanism system already implies:

```text
one user != one type
one user = overlapping driver stack
```

The contract should be generated from current answers, diary evidence, old mechanisms, and safety route, then used in tests before it is used in user-facing reports.

## Contract Shape

```json
{
  "version": "driver-stack-v0-test-only",
  "source": {
    "stage_answer_count": 0,
    "diary_entry_count": 0,
    "evidence_quality": "one_time|insufficient|limited|usable|full",
    "current_report_mode": "deep|check|professional|urgent"
  },
  "safety_route": {
    "mode": "mode1|mode2|mode3|mode4",
    "ordinary_report_allowed": true,
    "ordinary_experiment_allowed": true,
    "safety_drivers": [],
    "reason_codes": []
  },
  "driver_scores": {},
  "primary_driver": {},
  "secondary_drivers": [],
  "interaction_pattern": {},
  "vulnerable_moment": {},
  "visible_condition": {},
  "hidden_food_function": {},
  "wrong_self_explanation": {},
  "first_gentle_change": {},
  "fourteen_day_experiment_hypothesis": {},
  "removed_feature_diary_confirmation_targets": [],
  "evidence_sources": [],
  "copy_constraints": []
}
```

## `source`

| Field | Meaning |
|---|---|
| `stage_answer_count` | Number of answered Stage 1 questions. |
| `diary_entry_count` | Number of diary entries. |
| `evidence_quality` | Mirrors current readiness/evidence quality: one-time, insufficient, limited, usable, full. |
| `current_report_mode` | Current report mode from existing safety/report logic. |

## `safety_route`

Safety route is evaluated before ordinary driver-stack output.

| Field | Meaning |
|---|---|
| `mode` | Current mode1/mode2/mode3/mode4 equivalent. |
| `ordinary_report_allowed` | False for urgent/professional-first routes. |
| `ordinary_experiment_allowed` | False for urgent/professional-first routes. |
| `safety_drivers` | Safety keys: `binge_risk`, `compensatory_behavior`, `severe_body_distress`, `medical_red_flag`, `professional_first`. |
| `reason_codes` | Evidence-coded reasons without exposing private raw text. |

## `driver_scores`

Each driver score should use this shape:

```json
{
  "meal_gap": {
    "rawScore": 0,
    "expectedMaxScore": 8,
    "normalizedScore": 0,
    "strength": "inactive",
    "evidence_strength": "possible|moderate|strong|safety|contradicted",
    "layer": "body_rhythm",
    "source_breakdown": {
      "stage": 0,
      "stage_summary": 0,
      "diary": 0,
      "diary_summary": 0,
      "repetition_bonus": 0,
      "safety": 0
    },
    "related_old_mechanisms": ["hungerSafety"],
    "evidence_items": []
  }
}
```

## `primary_driver`

Primary driver is the best explanation for the user's current easiest leverage point, not the whole person.

```json
{
  "key": "meal_gap",
  "layer": "body_rhythm",
  "rawScore": 6,
  "expectedMaxScore": 8,
  "normalizedScore": 8,
  "strength": "strong",
  "evidence_strength": "strong",
  "why_primary": "Repeated diary days show meal gaps before evening eating.",
  "not_a_type": true
}
```

Rules:

- Never select a safety key as ordinary primary.
- Prefer repeated diary evidence over one-time evidence.
- Prefer the driver with the clearest gentle first change when scores tie.
- Preserve secondary drivers even when primary is strong.

## `secondary_drivers`

Secondary drivers should explain overlap.

```json
[
  {
    "key": "fatigue",
    "layer": "body_rhythm",
    "relationship_to_primary": "makes meal-gap evenings harder",
    "normalizedScore": 6,
    "strength": "moderate",
    "evidence_strength": "moderate"
  }
]
```

Rules:

- Include up to 3.
- Prefer different layers.
- Include lower-scoring drivers when they explain interaction.
- Do not duplicate primary under a different label.
- Use `normalizedScore` and `strength` for fixture assertions; keep `rawScore` for auditability.

## `interaction_pattern`

Interaction pattern explains the stack.

```json
{
  "id": "meal_gap_fatigue_low_friction_default",
  "drivers": ["meal_gap", "fatigue", "delivery_app"],
  "plain_language": "When meals are delayed and evening energy is low, the easiest available food wins.",
  "confidence": "moderate|strong",
  "observed_on_days": [1, 3, 5],
  "first_lever": "planned_bridge_meal_plus_default_dinner"
}
```

Interaction IDs should be stable for tests.

## `vulnerable_moment`

The vulnerable moment must combine time, body state, emotion/psychology, environment, and food function when available. See `vulnerable-moment-contract.md`.

## `visible_condition`

Visible condition is what appears on the surface.

Examples:

- "орой хоол захиалах"
- "ажлын дараа амттай зүйл хүсэх"
- "хоолны зай уртсаад орой нөхөх"
- "сошиал үед татгалзах хэцүү байх"
- "жин/бие өөрчлөгдөхөд санаа зовох"

## `hidden_food_function`

Hidden food function should use food-function keys.

```json
{
  "key": "hunger_safety",
  "supporting_keys": ["quick_recovery"],
  "plain_language": "Food is helping the user feel safe from later hunger and low energy.",
  "evidence_strength": "strong"
}
```

## `wrong_self_explanation`

This field names the explanation likely making the cycle worse.

Examples:

- "I have no discipline" when the stronger stack is `meal_gap + fatigue`.
- "I failed today, so tomorrow must be stricter" when `all_or_nothing + punishment_restriction` is active.
- "My body is the enemy" when `body_change_uncertainty + shame` is active.

## `first_gentle_change`

The first gentle change should be:

- small;
- non-punitive;
- safe;
- linked to the easiest modifiable driver;
- not an aggressive diet rule;
- compatible with safety route.

```json
{
  "id": "bridge_meal_before_evening",
  "targets": ["meal_gap", "evening_hunger"],
  "action": "Before a 5+ hour gap, add one planned bridge meal/snack.",
  "why_this_first": "It changes the body/rhythm driver before willpower is needed.",
  "avoid": ["fasting", "skipping dinner", "punishment restriction"]
}
```

## `fourteen_day_experiment_hypothesis`

Hypothesis format:

```text
If we gently change [first_lever], then [vulnerable_moment] should become less intense/frequent because [primary interaction].
```

Example:

```json
{
  "hypothesis": "If we add a planned bridge meal before long gaps, evening delivery urgency should soften because hunger safety is no longer starting from a depleted state.",
  "duration_days": 14,
  "daily_action": "planned bridge meal before 5+ hour gap",
  "track": ["hunger_level", "evening_energy", "unplanned_eating_count"],
  "success_signal": "fewer high-hunger evenings or less urgent delivery pull",
  "recovery_rule": "If a day is missed, resume at the next meal without tightening tomorrow."
}
```

## `removed_feature_diary_confirmation_targets`

Each target should specify what diary evidence would confirm, weaken, or redirect the stack.

```json
[
  {
    "driver_key": "meal_gap",
    "confirm_if": "Meal gap appears before unplanned eating on 3+ days.",
    "weaken_if": "Unplanned eating occurs mostly without meal gaps.",
    "diary_fields": ["meal_rhythm", "hunger_level", "main_moment_time"]
  }
]
```

## `evidence_sources`

Evidence source objects should be compact and non-sensitive.

```json
{
  "source_type": "stage_option|stage_summary|diary_option|diary_summary|safety",
  "question_id": "S1-M03",
  "day_number": null,
  "driver_keys": ["meal_gap", "evening_hunger"],
  "old_mechanisms": ["hungerSafety"],
  "weight": 1.0,
  "user_confirmed": false
}
```

## Copy Constraints

The driver stack should carry constraints to prevent harmful report copy.

Examples:

- `no_diet_plan`
- `no_calorie_tracking`
- `no_one_type_label`
- `no_shame_language`
- `no_ordinary_experiment_when_professional_first`
- `no_paywall_blocks_safety`
- `body_neutral_language`
