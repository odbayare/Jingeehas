# Vulnerable Moment Contract

Scope: test-only contract for the "most vulnerable moment" field. No runtime files or report copy are changed by this document.

## Purpose

The vulnerable moment is the clearest practical answer to:

```text
When does the user's driver stack become active?
```

It should not be a personality type. It should be a repeatable situation made of state + context + function.

## Contract Shape

```json
{
  "id": "evening_meal_gap_fatigue_delivery",
  "time_window": "evening|night|morning|afternoon|social_event|post_shift|unknown",
  "body_state": ["meal_gap", "evening_hunger", "fatigue"],
  "psychology_state": ["stress"],
  "environment_trigger": ["delivery_app", "low_friction_default"],
  "food_function": ["hunger_safety", "quick_recovery"],
  "restriction_context": ["fasting_rebound"],
  "safety_context": [],
  "plain_language": "Орой хоолны зай уртсаж, тэнхээ багассан үед хоол захиалах хамгийн амар сонголт болж байна.",
  "confidence": "possible|moderate|strong|safety",
  "evidence_sources": [],
  "diary_confirmation_targets": []
}
```

## Required Components

| Component | Required? | Notes |
|---|---|---|
| `time_window` | Preferred | Use diary time if available; use report voice/stage evidence if one-time only. |
| `body_state` | Preferred | Meal gap, hunger, sleep, fatigue, body concern. |
| `psychology_state` | Optional but important | Stress, anxiety, anger, loneliness, emptiness, shame, guilt. |
| `environment_trigger` | Optional but practical | Snack visibility, app, photo, social table, alcohol, low-friction default. |
| `food_function` | Required when ordinary report allowed | What food is doing for the user. |
| `restriction_context` | Optional | All-or-nothing, Monday restart, strict diet, rebound. |
| `safety_context` | Required when safety signal exists | Must override ordinary experiment when needed. |
| `plain_language` | Required | Non-shaming, body-neutral, practical. |

## Vulnerable Moment Selection Rules

1. Safety route first:
   - If urgent, vulnerable moment should become safety moment, not eating-behavior moment.
   - If professional-first, vulnerable moment should focus on body/safety context and suppress ordinary weight-loss experiment.
2. Use repeated diary evidence when available.
3. If no diary evidence, use Stage 1 direct option + confirmed narrative.
4. Prefer moments with a clear first gentle change.
5. Do not overfit to one old mechanism.
6. Do not label the user as a type.

## Common Moment Templates

| Template ID | Driver combination | Plain-language shape |
|---|---|---|
| `evening_meal_gap_fatigue` | `meal_gap + evening_hunger + fatigue` | Long gaps and low evening energy make urgent eating more likely. |
| `stress_decompression_evening` | `stress/anxiety + decompression + evening` | Food becomes the quickest pause after emotional load. |
| `low_friction_delivery_fatigue` | `fatigue + delivery_app + low_friction_default` | The easiest available option wins when decision energy is gone. |
| `visible_snack_automatic` | `visible_snacks + food_photo_cue + low_friction_default` | What is visible or one tap away starts eating before hunger is checked. |
| `social_belonging_table` | `social_table + belonging + alcohol_context` | Social context makes refusing or choosing differently difficult. |
| `restriction_monday_restart` | `all_or_nothing + monday_restart + punishment_restriction` | One deviation turns into "today is over, tomorrow stricter." |
| `body_change_shame` | `body_change_uncertainty + shame + escape_from_shame` | Body concern and shame make ordinary tracking feel unsafe. |
| `medical_first_body_signal` | `medical_concern + medical_red_flag + professional_first` | Body signals should be clarified before ordinary weight-loss advice. |

## Confidence Rules

| Confidence | Suggested condition |
|---|---|
| `possible` | One-time/stage signal only, no diary repetition. |
| `moderate` | Stage + one diary day, or 2 diary days with related evidence. |
| `strong` | 3+ diary days, or confirmed narrative plus repeated structured evidence. |
| `safety` | Safety route is mode3/mode4 or safety driver threshold is crossed. |

## Evidence Examples

### Strong ordinary moment

```json
{
  "id": "evening_meal_gap_fatigue_delivery",
  "time_window": "evening",
  "body_state": ["meal_gap", "evening_hunger", "fatigue"],
  "psychology_state": [],
  "environment_trigger": ["delivery_app", "low_friction_default"],
  "food_function": ["hunger_safety", "quick_recovery"],
  "restriction_context": [],
  "safety_context": [],
  "confidence": "strong"
}
```

### Professional-first moment

```json
{
  "id": "body_signal_meal_gap_professional_first",
  "time_window": "evening",
  "body_state": ["meal_gap", "medical_concern"],
  "psychology_state": ["anxiety"],
  "environment_trigger": [],
  "food_function": ["hunger_safety"],
  "restriction_context": ["fasting_rebound"],
  "safety_context": ["medical_red_flag", "professional_first"],
  "confidence": "safety"
}
```

## Diary Confirmation Targets

Each vulnerable moment should produce 3-5 diary confirmation targets.

| Target | Example |
|---|---|
| Time confirmation | Does this happen mostly in the evening or night? |
| Body-state confirmation | Does hunger/fatigue/body signal appear before the eating moment? |
| Function confirmation | Does food create safety, decompression, reward, belonging, or escape? |
| Environment confirmation | Was the easiest option visible, nearby, social, or app-based? |
| Recovery confirmation | What helped on days without unplanned eating? |

## Copy Rules

- Use "moment", "condition", "driver", or "stack", not "type".
- Avoid "willpower failure".
- Avoid diet-plan phrasing.
- Avoid moralizing food.
- Mention uncertainty when evidence is one-time only.
- Show safety routing before ordinary behavior interpretation.
