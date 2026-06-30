# Driver Taxonomy Crosswalk

Scope: docs/spec only. This crosswalk maps the current mechanism vocabulary to the proposed driver-stack taxonomy. It does not replace current scoring, questions, reports, safety routing, PDF generation, payment, QPay, pricing, entitlement, backend, prompts, or deployment behavior.

## Migration Principle

The current system should not be replaced. It already has mechanism scoring, evidence aggregation, diary evidence, safety routing, and report modules. The migration should add a parallel driver-stack interpretation layer:

```text
answers + diary evidence
-> current mechanism evidence
-> new driver scores
-> driver stack contract
```

## Current Mechanism To New Driver Crosswalk

### `reward`

Current mechanism:
`reward`

Meaning in current system:
Reward-seeking, stimulation compensation, "нэг гоё юм", sweet/craving pull, and pleasant feeling after eating.

New driver candidates:
`self_reward`, `comfort`, `quick_recovery`, `emptiness`, `food_photo_cue`, `visible_snacks`, `delivery_app`

Mapping confidence:
high for `self_reward`; medium for `comfort`, `quick_recovery`, `emptiness`; low-to-medium for environment cues unless option evidence is present.

Potential ambiguity:
Reward can mean genuine pleasure deficit, sensory cue response, emotional comfort, boredom, or low-energy quick recovery. It should not become a single user type.

Recommended migration handling:
Score `self_reward` by default. Add `comfort` when after-eating relief or emotional language appears. Add `quick_recovery` when fatigue/low energy is present. Add environment drivers only when cue/app/snack evidence is present.

### `regulation`

Current mechanism:
`regulation`

Meaning in current system:
Food-as-regulation: stress, anxiety, anger, sadness, loneliness, or emotional load where food creates a short decompression effect.

New driver candidates:
`stress`, `anxiety`, `anger_resentment`, `loneliness`, `decompression`, `comfort`, `quick_recovery`, `guilt`

Mapping confidence:
high for `stress`, `decompression`, `comfort`; medium for specific emotions unless answer option or narrative identifies them.

Potential ambiguity:
The old mechanism groups many emotions. The new taxonomy should split the psychology driver from the food function.

Recommended migration handling:
Use question/option evidence to choose the specific psychology key first, then score `decompression` or `comfort` as the function. Do not infer `loneliness` or `anger_resentment` unless explicitly present.

### `hungerSafety`

Current mechanism:
`hungerSafety`

Meaning in current system:
Hunger-safety/scarcity protection: meal gaps, fear of later hunger, evening rebound after under-eating, difficulty leaving food.

New driver candidates:
`meal_gap`, `evening_hunger`, `hunger_safety`, `fasting_rebound`, `strict_diet`, `anxiety`

Mapping confidence:
high for `meal_gap`, `evening_hunger`, `hunger_safety`; medium for `fasting_rebound` and `strict_diet` when restriction history is present.

Potential ambiguity:
Hunger-safety may be body rhythm, food function, or restriction rebound depending on evidence source.

Recommended migration handling:
Split into body/rhythm (`meal_gap`, `evening_hunger`) and food function (`hunger_safety`). Add restriction/rebound only when past method, fasting, meal skipping, or "маргаашаас чанга" evidence exists.

### `glucose`

Current mechanism:
`glucose`

Meaning in current system:
Glucose-safety/hypoglycemia-like concern: sugar drop feelings, measured glucose/blood pressure concerns, insulin/sugar-lowering medication, confusion/fainting-like signals.

New driver candidates:
`medical_concern`, `medical_red_flag`, `professional_first`, `quick_recovery`, `meal_gap`

Mapping confidence:
high for `medical_concern`, `medical_red_flag`, `professional_first`; medium for `quick_recovery` and `meal_gap`.

Potential ambiguity:
Some glucose-like sensations are user concern, some are urgent/professional-first safety signals. The product must not diagnose.

Recommended migration handling:
Preserve safety-first routing. When medication, measured abnormal values, confusion, fainting, or strong body signal evidence appears, safety keys must outrank ordinary driver-stack interpretation.

### `satiety`

Current mechanism:
`satiety`

Meaning in current system:
Difficulty sensing fullness, continuing after fullness, or not distinguishing hunger from emotion/fatigue.

New driver candidates:
`loss_of_control_feeling`, `binge_risk`, `hunger_safety`, `comfort`, `decompression`

Mapping confidence:
medium overall; high for `loss_of_control_feeling` when answer text says control feels lost.

Potential ambiguity:
Weak satiety clarity is not automatically binge risk. It can be meal-gap rebound, emotional eating, speed, distraction, or safety concern.

Recommended migration handling:
Map to `loss_of_control_feeling` when control wording is present. Map to `binge_risk` only when high frequency/severity/safety answers support it. Pair with body/function drivers instead of making satiety a standalone type.

### `cue`

Current mechanism:
`cue`

Meaning in current system:
Cue-conditioned automatic eating from visible snacks, smell, food photos, ordering apps, or nearby easy choices.

New driver candidates:
`visible_snacks`, `delivery_app`, `food_photo_cue`, `low_friction_default`, `nearby_store`, `cafeteria`

Mapping confidence:
high for `visible_snacks`, `delivery_app`, `food_photo_cue`, `low_friction_default`; low for `nearby_store` and `cafeteria` until direct questions exist.

Potential ambiguity:
Cue may be sensory exposure, app friction, convenience default, or reward craving.

Recommended migration handling:
Use exact evidence source: snack visibility -> `visible_snacks`; delivery/app/photo -> `delivery_app`/`food_photo_cue`; easiest option -> `low_friction_default`. Add `nearby_store`/`cafeteria` only after future questions.

### `collapse`

Current mechanism:
`collapse`

Meaning in current system:
Control-collapse cycle: "өнөөдөр өнгөрлөө", "маргаашаас", guilt, shame, and difficulty resuming after one deviation.

New driver candidates:
`all_or_nothing`, `monday_restart`, `punishment_restriction`, `escape_from_failure`, `guilt`, `shame`, `loss_of_control_feeling`

Mapping confidence:
high for `all_or_nothing`, `monday_restart`, `guilt`; medium for `punishment_restriction`, `escape_from_failure`, `shame`.

Potential ambiguity:
Collapse can be cognitive all-or-nothing, shame avoidance, compensatory restriction, or identity/failure expectation.

Recommended migration handling:
Split cognitive rebound from emotional function. If "маргааш илүү чанга" appears, score `punishment_restriction`. If "би чаддаггүй" appears, score `escape_from_failure` and wrong self-explanation.

### `executive`

Current mechanism:
`executive`

Meaning in current system:
Executive load failure: user knows what to do but has no energy/time/decision capacity, so easiest food wins.

New driver candidates:
`fatigue`, `low_friction_default`, `quick_recovery`, `delivery_app`, `visible_snacks`, `meal_gap`

Mapping confidence:
high for `fatigue` and `low_friction_default`; medium for `quick_recovery` and environment keys.

Potential ambiguity:
Executive load can be fatigue, time scarcity, decision overload, role overload, or environment default.

Recommended migration handling:
Score `fatigue` and `low_friction_default` by default. Add `delivery_app`/`visible_snacks` from answer options. Add `meal_gap` when skipped meals are part of the same evidence.

### `circadian`

Current mechanism:
`circadian`

Meaning in current system:
Sleep/energy mismatch: poor sleep, unstable rhythm, low evening energy, and next-day sweet/craving pull.

New driver candidates:
`sleep_disruption`, `fatigue`, `evening_hunger`, `quick_recovery`, `shift_work`

Mapping confidence:
high for `sleep_disruption` and `fatigue`; medium for `evening_hunger`; low for `shift_work` until direct evidence exists.

Potential ambiguity:
Sleep disruption may be caused by shift work, postpartum, stress, caffeine, medical concern, or ordinary schedule pressure.

Recommended migration handling:
Keep `sleep_disruption` and `fatigue` separate. Add `shift_work` only with direct shift-work evidence. Add `medical_concern` when sleep apnea or severe symptoms appear.

### `social`

Current mechanism:
`social`

Meaning in current system:
Social belonging food pattern: pressure, difficulty refusing, eating with others, or belonging through shared food.

New driver candidates:
`social_table`, `belonging`, `loneliness`, `loneliness_soothing`, `alcohol_context`, `anger_resentment`

Mapping confidence:
high for `social_table`; medium for `belonging`; low-to-medium for loneliness/alcohol until evidence is explicit.

Potential ambiguity:
Social eating can be belonging, pressure, alcohol context, loneliness soothing, or family/work obligation.

Recommended migration handling:
Score `social_table` when social context is explicit. Add `belonging` when refusal/belonging language appears. Add `alcohol_context` only after current drink/alcohol diary evidence or future direct question.

### `medical`

Current mechanism:
`medical`

Meaning in current system:
Medical, medication, pregnancy/postpartum, swelling, fatigue, measured body concerns, and professional-check friction.

New driver candidates:
`medical_concern`, `medical_red_flag`, `professional_first`, `body_change_uncertainty`, `fatigue`, `sleep_disruption`

Mapping confidence:
high for `medical_concern`, `medical_red_flag`, `professional_first`; medium for `body_change_uncertainty` and fatigue.

Potential ambiguity:
Medical concern is a safety/context layer, not an ordinary behavior driver.

Recommended migration handling:
Treat medical drivers as guardrails and context modifiers. If red flags are present, do not let ordinary driver-stack output lead the recommendation.

### `autonomy`

Current mechanism:
`autonomy`

Meaning in current system:
Resistance to strict rules or restriction; user's need to preserve choice.

New driver candidates:
`anger_resentment`, `strict_diet`, `punishment_restriction`, `control_regain`, `all_or_nothing`

Mapping confidence:
medium overall; high when option says anger/resistance.

Potential ambiguity:
Autonomy can be healthy preference, rebound from over-control, or shame response.

Recommended migration handling:
Do not pathologize autonomy. Map to `anger_resentment` only when emotional resistance is explicit. Use it to shape the first gentle change toward choice-preserving structure.

### `physiological`

Current mechanism:
`physiological`

Meaning in current system:
Body reactivity to hunger or meal gaps: shaking, heart racing, sweating, dizziness, headache, pressure-like signals.

New driver candidates:
`medical_concern`, `medical_red_flag`, `meal_gap`, `quick_recovery`, `professional_first`

Mapping confidence:
high for `medical_concern`; medium for `meal_gap` and `quick_recovery`.

Potential ambiguity:
Body sensations can be benign hunger discomfort, anxiety, glucose concern, blood pressure concern, or urgent signal.

Recommended migration handling:
Safety first. If evidence is mild and tied to long meal gaps, pair `meal_gap` with `medical_concern`. If confusion/fainting or measured concern appears, route to safety/professional-first.

### `decisionDefault`

Current mechanism:
`decisionDefault`

Meaning in current system:
The available/default/easiest choice wins when the intended choice is not ready.

New driver candidates:
`low_friction_default`, `delivery_app`, `nearby_store`, `cafeteria`, `visible_snacks`, `fatigue`

Mapping confidence:
high for `low_friction_default`; medium for specific environment keys.

Potential ambiguity:
Default choice can come from delivery, store, cafeteria, home snack, fatigue, or lack of planning.

Recommended migration handling:
Score `low_friction_default` by default and attach specific environment keys only when evidence names them. Use this mechanism heavily for first gentle change because it is often easiest to change.

### `rewardDeficit`

Current mechanism:
`rewardDeficit`

Meaning in current system:
The user has little pleasure/rest/self-attention during the day and food becomes the reward slot.

New driver candidates:
`emptiness`, `self_reward`, `comfort`, `quick_recovery`, `fatigue`

Mapping confidence:
high for `self_reward`; medium for `emptiness`, `comfort`, and `fatigue`.

Potential ambiguity:
Reward deficit may be boredom, loneliness, role overload, depression-like flatness, or simple lack of rest.

Recommended migration handling:
Require emotion/diary evidence to distinguish `emptiness` from `fatigue` or `loneliness`. First gentle change should usually be a non-food reward/rest slot, not restriction.

### `roleOverload`

Current mechanism:
`roleOverload`

Meaning in current system:
The user puts others first; their own meal/rest is delayed until food becomes relief or compensation.

New driver candidates:
`fatigue`, `self_reward`, `comfort`, `low_friction_default`, `stress`, `anger_resentment`

Mapping confidence:
medium overall because role overload is currently detected mostly through narrative and option hints.

Potential ambiguity:
Role overload may look like reward, fatigue, stress, resentment, or environment default.

Recommended migration handling:
Use as an interaction/context modifier. It should influence first gentle change toward one protected self-first anchor.

### `shameAvoidance`

Current mechanism:
`shameAvoidance`

Meaning in current system:
Food or avoidance behavior helps the user escape shame, guilt, tracking, body attention, or a failure loop.

New driver candidates:
`shame`, `guilt`, `escape_from_shame`, `severe_body_distress`, `binge_risk`, `professional_first`

Mapping confidence:
high for `shame`, `guilt`, `escape_from_shame`; medium for `severe_body_distress` and `binge_risk` depending severity.

Potential ambiguity:
Shame can be ordinary guilt, body-image distress, eating-disorder risk, or identity/failure expectation.

Recommended migration handling:
Score shame/guilt normally at lower severity, but elevate to safety keys when severe distress, compensatory behavior, or strong loss-of-control evidence is present.

### `bodySafety`

Current mechanism:
`bodySafety`

Meaning in current system:
Body visibility, before/after photos, tracking, weighing, public attention, or body-image distress creates a need for safety and avoidance.

New driver candidates:
`severe_body_distress`, `body_change_uncertainty`, `shame`, `escape_from_shame`, `professional_first`

Mapping confidence:
high for `shame` and `escape_from_shame`; medium for `severe_body_distress`; medium for `body_change_uncertainty`.

Potential ambiguity:
Body safety can be normal privacy preference or clinically significant distress. The system should not over-escalate without severity evidence.

Recommended migration handling:
Use body-neutral report tone. Escalate to professional-first only when severe distress, compensatory behavior, or safety language appears.

### `identity`

Current mechanism:
`identity`

Meaning in current system:
Learned failure expectation, "I cannot do this", self-concept conflict, and giving up before trying.

New driver candidates:
`shame`, `escape_from_failure`, `all_or_nothing`, `guilt`, `control_regain`

Mapping confidence:
medium.

Potential ambiguity:
Identity evidence is often narrative and may overlap with perfectionism, shame, or repeated failed diets.

Recommended migration handling:
Use primarily for wrong self-explanation and report tone. Do not make it a primary driver unless repeated narrative evidence confirms it.

### `perfectionism`

Current mechanism:
`perfectionism`

Meaning in current system:
Tight plans, 100% standards, "failure" framing, and inability to accept 70% progress.

New driver candidates:
`all_or_nothing`, `strict_diet`, `monday_restart`, `punishment_restriction`, `control_regain`

Mapping confidence:
high for `all_or_nothing` and `strict_diet`; medium for `control_regain`.

Potential ambiguity:
Perfectionism can be restriction, shame, identity, or control/regain function.

Recommended migration handling:
Map to restriction/rebound drivers and wrong self-explanation. First gentle change should include a good-enough rule, not a stricter plan.



# Driver Scoring Spec

Scope: test-only scoring specification. This document defines a future parallel driver-score layer. It must not modify current runtime scoring, `app.js`, questions, reports, PDF generation, backend/payment/QPay/pricing/entitlement, prompts, or deployment behavior.

## Inputs

The test-only calculator should consume current exported evidence, not replace it.

```text
stageAnswers
stageVoiceSummaries
diaryEntries
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
  "seven_day_diary_confirmation_targets": [],
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

## `seven_day_diary_confirmation_targets`

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
- `seven_day_diary_confirmation_targets` are present.

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



# Work Pack 2 Recommendation

Recommendation: proceed with a test-only driver-stack layer before changing runtime behavior.

## Summary

Work Pack 1 found that the current Weight Test system is not a simple route-based prototype. It already has:

- rich current mechanism keys;
- answer-option scoring;
- question metadata;
- evidence aggregation;
- confirmed narrative summaries;
- diary repetition evidence;
- report readiness;
- safety modes;
- report modules;
- professional-first and urgent safety suppression.

Therefore, the correct migration is not replacement. The correct migration is an explicit driver-stack layer built on top of the current mechanism engine.

## Recommended Order

### 1. Keep current runtime frozen

Do not change:

- `app.js`
- questions
- current reports
- current scoring
- PDF generation
- backend/mock backend behavior
- payment/QPay/pricing/entitlement
- prompts
- deploy configuration

### 2. Approve the Work Pack 2 contracts

Review and approve:

- `driver-taxonomy-crosswalk.md`
- `driver-scoring-spec.md`
- `driver-stack-contract.md`
- `vulnerable-moment-contract.md`
- `fixture-archetype-plan.md`
- `future-test-plan.md`

### 3. Next implementation should be tests-only

The next work pack should add a parallel test-only calculator and fixtures. It should not render new report copy yet.

Proposed next work pack:

```text
Work Pack 3 — Test-Only Driver Stack Calculator
```

Allowed scope for Work Pack 3:

- add a non-runtime helper under `tests/` or `tools/`;
- add fixture JSON/JS objects;
- add tests that call current exported internals from `app.js`;
- assert driver-stack contract output;
- keep all app behavior unchanged.

Disallowed scope for Work Pack 3:

- no report copy changes;
- no question changes;
- no scoring replacement;
- no PDF regeneration;
- no payment/backend/QPay changes;
- no deploy.

## Acceptance Criteria For Work Pack 3

- Existing `npm test` still passes.
- New driver-stack tests pass.
- Current mechanism evidence remains available.
- Driver-stack output includes:
  - primary driver;
  - secondary drivers;
  - normalized driver scores;
  - strength labels;
  - interaction pattern;
  - vulnerable moment;
  - hidden food function;
  - first gentle change;
  - 14-day experiment hypothesis;
  - 7-day diary confirmation targets;
  - safety route.
- Safety/professional-first modes suppress ordinary experiment in contract output.
- No user-facing runtime changes.

## Product Guardrails

- This is not a diet plan.
- This is not a calorie tracker.
- This is not a one-type personality report.
- A user has a driver stack, not a type.
- The first change should be gentle and low-friction.
- Safety/professional-first routes must outrank ordinary report logic.
- 7-day diary should confirm, weaken, or redirect the initial stack.

## Recommended Owner Decision

Approve the driver-stack direction if the owner agrees with these statements:

1. Old mechanisms remain the evidence backbone.
2. New drivers are a translation and stacking layer.
3. Driver scoring should be test-only before runtime.
4. Report copy should change only after driver-stack tests are stable.
5. Safety and payment boundaries remain unchanged.
