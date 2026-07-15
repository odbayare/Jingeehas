# Driver Scoring Spec

Scope: test-only scoring specification. This document defines a future parallel driver-score layer. It must not modify current runtime scoring, `app.js`, questions, reports, PDF generation, backend/payment/QPay/pricing/entitlement, prompts, or deployment behavior.

## Inputs

The test-only calculator should consume current exported evidence, not replace it.

```text
stageAnswers
stageVoiceSummaries
removedEntries
current mechanism evidence from calculateMechanismEvidence()
current ranked patterns from rankedPatterns()
safety route from reportMode()
question metadata from getQuestionMetadata()
option metadata from getOptionMetadata()
```

## Output

```text
driver_scores: {
  [driver_key]: {
    rawScore,
    expectedMaxScore,
    normalizedScore,
    strength,
    evidence_strength,
    source_breakdown,
    evidence_items,
    related_old_mechanisms,
    confidence,
    safety_weight
  }
}
```

## Raw score vs normalized score

The test-only driver layer must keep raw evidence math separate from the score used in fixtures and future report assertions.

Definitions:

- `rawScore`: sum of weighted evidence points for a driver before normalization.
- `expectedMaxScore`: driver-specific expected useful maximum. This is not a theoretical maximum; it is the score at which the driver has enough evidence to be treated as fully active for product/report purposes.
- `normalizedScore`: 0-10 score used for report-contract tests, fixture assertions, and owner review language.
- `strength`: normalized activity label: `inactive`, `weak`, `moderate`, `strong`, `very_strong`, or `safety`.

Baseline formula:

```js
normalizedScore = Math.min(10, Math.round((rawScore / expectedMaxScore) * 10))
```

Rules:

- `expectedMaxScore` must be explicit per driver or per driver family before Work Pack 3 fixture assertions are finalized.
- Safety drivers can still carry `rawScore` and `normalizedScore`, but `strength: "safety"` and safety route must override ordinary ranking.
- Runtime scoring must not use `normalizedScore` until a later approved implementation work pack.
- Fixture assertions should prefer `normalizedScore` and `strength` over raw point totals.

Suggested default `expectedMaxScore` values for test-only planning:

| Driver family | Suggested `expectedMaxScore` | Reason |
|---|---:|---|
| Body/rhythm | 8 | Diary repetition can confirm these quickly. |
| Psychology | 7 | Direct emotion evidence plus diary confirmation should be enough. |
| Food function | 7 | Function often comes from direct answer plus narrative evidence. |
| Habit/environment | 6 | A specific environment cue can be actionable with fewer signals. |
| Restriction/rebound | 7 | Needs cognition/history plus recurrence or narrative evidence. |
| Safety | 3 | Safety is threshold/route based, not ordinary ranking. |

Strength labels from normalized score:

| Strength | Condition |
|---|---|
| `inactive` | `normalizedScore` is 0. |
| `weak` | `normalizedScore` is 1-3. |
| `moderate` | `normalizedScore` is 4-6. |
| `strong` | `normalizedScore` is 7-8. |
| `very_strong` | `normalizedScore` is 9-10. |
| `safety` | Safety threshold or current safety route is active, regardless of ordinary score. |

## Driver Layers

| Layer | Driver keys |
|---|---|
| Body/rhythm | `shift_work`, `sleep_disruption`, `meal_gap`, `evening_hunger`, `fatigue`, `body_change_uncertainty`, `medical_concern` |
| Psychology | `stress`, `anxiety`, `anger_resentment`, `loneliness`, `emptiness`, `shame`, `guilt`, `loss_of_control_feeling` |
| Food function | `quick_recovery`, `decompression`, `comfort`, `self_reward`, `loneliness_soothing`, `control_regain`, `hunger_safety`, `belonging`, `escape_from_shame`, `escape_from_failure` |
| Habit/environment | `visible_snacks`, `delivery_app`, `nearby_store`, `cafeteria`, `food_photo_cue`, `social_table`, `alcohol_context`, `low_friction_default` |
| Restriction/rebound | `all_or_nothing`, `monday_restart`, `strict_diet`, `fasting_rebound`, `carb_cut_rebound`, `punishment_restriction` |
| Safety | `binge_risk`, `compensatory_behavior`, `severe_body_distress`, `medical_red_flag`, `professional_first` |

## Evidence Weights

The scoring spec should start conservative and explainable.

| Evidence source | Suggested points | Reason |
|---|---:|---|
| Stage 1 direct answer option | 1.0 | Self-report signal, useful but not observed over time. |
| Stage 1 direct safety answer | 3.0 safety-weighted | Safety should outrank ordinary interpretation. |
| Stage voice confirmed summary | 1.5 | User-confirmed narrative is stronger than a single option. |
| Daily structured answer | 1.5 | Daily evidence is closer to behavior. |
| Daily adaptive probe answer | 2.0 | Probe is selected because preliminary evidence already suggested relevance. |
| Daily confirmed narrative summary | 2.5 | Highest non-safety behavioral evidence. |
| Repeated diary pattern on 2 days | +1.5 | Recurrence matters for driver stack. |
| Repeated diary pattern on 3-4 days | +3.0 | Strong repeated signal. |
| Repeated diary pattern on 5+ days | +5.0 | Very strong repeated signal. |
| Contradiction from diary | -2.0 to -4.0 | Diary should be able to weaken one-time assumptions. |
| Safety override | route override, not just points | Safety is a mode decision, not a normal score contest. |

## Evidence Strength Labels

These labels are retained for evidence quality. They should not replace the normalized `strength` field above.

| Label | Suggested condition |
|---|---|
| `possible` | Score 1.0-2.9 from one-time/stage evidence only. |
| `moderate` | Score 3.0-5.9, or appears in at least 2 diary days. |
| `strong` | Score 6.0+, appears in at least 3 diary days, or has confirmed narrative + structured evidence. |
| `safety` | Any safety key above threshold or current `reportMode()` is `professional`/`urgent`. |
| `contradicted` | Stage signal exists but diary repeatedly supports another explanation. |

## Old Mechanism Weight Mapping

| Old mechanism | Default driver score additions |
|---|---|
| `reward` | `self_reward +1`, `comfort +0.5`, `quick_recovery +0.5` when fatigue is present |
| `regulation` | `decompression +1`, specific emotion key +1 if known, `comfort +0.5` |
| `hungerSafety` | `meal_gap +1`, `evening_hunger +1` if evening evidence, `hunger_safety +1` |
| `glucose` | `medical_concern +1.5`, `medical_red_flag +2` if measured/urgent, `professional_first +3` if safety condition |
| `satiety` | `loss_of_control_feeling +1`, `binge_risk +2` only when severe/frequent |
| `cue` | exact environment key +1.5; `low_friction_default +1` |
| `collapse` | `all_or_nothing +1`, `monday_restart +1`, `guilt +0.5`, `punishment_restriction +1` when "tighten tomorrow" evidence |
| `executive` | `fatigue +1`, `low_friction_default +1`, `quick_recovery +0.5` |
| `circadian` | `sleep_disruption +1`, `fatigue +1`, `evening_hunger +0.5` |
| `social` | `social_table +1`, `belonging +1`, `alcohol_context +1` only with alcohol evidence |
| `medical` | `medical_concern +1.5`, `body_change_uncertainty +0.5`, safety keys when red flags |
| `autonomy` | `anger_resentment +1`, `strict_diet +1`, `control_regain +0.5` |
| `physiological` | `medical_concern +1`, `meal_gap +0.5`, `quick_recovery +0.5` |
| `decisionDefault` | `low_friction_default +1.5`, exact environment key +1 |
| `rewardDeficit` | `self_reward +1`, `emptiness +1` if flat/empty evidence, `comfort +0.5` |
| `roleOverload` | `fatigue +1`, `self_reward +0.5`, `comfort +0.5`, `low_friction_default +0.5` |
| `shameAvoidance` | `shame +1`, `guilt +1`, `escape_from_shame +1`, safety keys if severe |
| `bodySafety` | `body_change_uncertainty +1`, `shame +1`, `escape_from_shame +1`, `severe_body_distress +2` if intense |
| `identity` | `escape_from_failure +1`, `shame +0.5`, `all_or_nothing +0.5` |
| `perfectionism` | `all_or_nothing +1`, `strict_diet +1`, `monday_restart +0.5`, `punishment_restriction +0.5` |

## Direct Answer Overrides

Direct answer evidence should override generic mechanism mapping where possible.

| Evidence phrase / source | Driver keys |
|---|---|
| meal skipped, 5+ hours, day under-eating | `meal_gap`, `evening_hunger`, `hunger_safety` |
| "орой" plus hunger/low energy | `evening_hunger`, `fatigue` |
| stress | `stress`, `decompression` |
| worry/anxiety | `anxiety`, `comfort` or `decompression` |
| anger/resistance | `anger_resentment`, `strict_diet` |
| loneliness | `loneliness`, `loneliness_soothing`, `belonging` depending context |
| empty/flat feeling | `emptiness`, `comfort`, `self_reward` |
| guilt/shame/hiding | `guilt`, `shame`, `escape_from_shame` |
| loss of control | `loss_of_control_feeling`, possible `binge_risk` |
| visible snack | `visible_snacks`, `low_friction_default` |
| delivery/app | `delivery_app`, `low_friction_default` |
| food photo | `food_photo_cue` |
| social refusal difficulty | `social_table`, `belonging` |
| alcohol | `alcohol_context`, `social_table` |
| fasting/meal skipping diet | `strict_diet`, `fasting_rebound`, `meal_gap` |
| carb cutting | `strict_diet`, `carb_cut_rebound` |
| "tomorrow stricter" | `monday_restart`, `punishment_restriction`, `all_or_nothing` |
| vomiting/laxative/compensatory exercise | `compensatory_behavior`, `professional_first` |
| active self-harm/confusion/fainting | `professional_first`, current urgent safety route |

## Primary Driver Selection

Primary driver should not be chosen from safety keys. Safety keys determine routing first.

Suggested selection:

1. If current `reportMode()` is `urgent`, return safety route and suppress ordinary primary.
2. If current `reportMode()` is `professional`, return professional-first route and suppress ordinary experiment.
3. Remove safety keys from ordinary primary selection.
4. Choose highest `strong` non-safety driver.
5. Prefer repeated diary evidence over one-time self-report.
6. If tied, prefer the driver with the clearest first gentle change.

## Secondary Driver Selection

Secondary drivers should explain the stack, not duplicate the primary.

Suggested selection:

- choose up to 3 non-safety drivers;
- require `moderate` or better unless one-time report has limited evidence;
- prefer different layers, e.g. body/rhythm + environment + psychology;
- include a lower score driver if it explains the interaction more clearly.

## Contradiction Rules

| Stage signal | Diary contradiction | Handling |
|---|---|---|
| `self_reward` high | repeated `meal_gap + evening_hunger` | Reduce reward; elevate body/rhythm and hunger safety. |
| `stress/decompression` high | repeated low energy/default choice | Keep stress as secondary; elevate `fatigue + low_friction_default`. |
| `strict_diet` high | no restriction/rebound diary evidence | Keep possible; do not make primary without recurrence. |
| `visible_snacks` high | no cue days, but repeated loneliness | Lower environment; elevate psychology/food function. |
| one-time medical concern | diary safety signal absent | Keep body-check caution; do not remove safety context. |

## Safety Scoring

Safety scoring is not ordinary ranking. It must route.

| Safety driver | Trigger threshold |
|---|---|
| `medical_red_flag` | measured abnormal value, insulin/sugar-lowering medication, confusion/fainting-like signal, severe swelling/breathlessness, or current mode2/mode3 evidence |
| `professional_first` | mode3/professional route, compensatory behavior, severe body distress, medical red flag, under-18, pregnancy/postpartum caution when needed |
| `compensatory_behavior` | vomiting, laxative use, repeated overexercise to compensate, long food deprivation as compensation |
| `binge_risk` | strong loss-of-control + hiding/shame + frequency/severity |
| `severe_body_distress` | intense body shame/visibility avoidance + distress/safety implications |

## Non-Goals

- Do not change current score weights in runtime.
- Do not rename existing mechanisms in runtime.
- Do not change report copy.
- Do not change safety routes.
- Do not change payment or entitlement behavior.
