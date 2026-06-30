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
