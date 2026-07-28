# Jingeehas current-instrument forensic audit

> **DESIGN PHASE ONLY**
> **NOT YET PSYCHOMETRICALLY VALIDATED**
> **NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS**
> **NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS**

**Audit target:** `agent/full-landing-copy-and-direct-payment-v2`
**Snapshot reviewed:** local branch HEAD `f6b07c92598c2a6d57e39dcd71d4c3a5a7cbb668`
**Review date:** 2026-07-28
**Scope:** `questions.js`, `report-signals.js`, `report-patterns.js`, `report-copy.js`, `report.js`, report tests, landing copy, and methodology copy.

## Status and classification

The production questionnaire is a hand-authored, rules-based self-reflection and case-formulation product. It is **not currently a psychometric instrument**: it does not estimate multi-item latent constructs, report reliability, use population norms, or have demonstrated factor, criterion, predictive, or measurement-invariance evidence.

This is a documentation audit only. No production questions, scoring, reports, payments, data, tests, or code were changed.

## How the current engine works

`report-signals.js` maps selected answers to named signals with manually assigned effects. Effects include `+1`, `+2`, `+3`, `-1`, `-2`, and `-3`. Negative values are used as protective/contradictory evidence; positive values are summed as support. Multi-select questions can contribute the same effect more than once through different selected options.

`report-patterns.js` then:

1. optionally derives `strict_open_text_anchor` and `maintenance_gap_explicit` from exact Mongolian regular expressions, each with a hand-authored `+4`;
2. sums eligible positive effects;
3. requires at least one mandatory anchor;
4. requires custom minimum counts of question IDs and dimensions;
5. applies custom thresholds;
6. ranks supported patterns using a separate priority table;
7. enables an interaction when its component patterns (and, once, additional signals) co-occur.

These rules can improve deterministic attribution, but deterministic provenance is not empirical validity.

## Question-level audit

“Report repeats answer” means the report may restate, closely summarize, or directly condition copy on that answer. It does not mean every response always appears. “Suitable” assesses the **current item as written**, not the topic’s suitability for a future scale. No listed weight has empirical calibration evidence in the repository.

| Question ID | Claimed construct / role | Current weight(s) | Evidence | Type | Report repeats answer? | Weight empirically supported? | Suitable for subscale? | Recommendation |
|---|---|---:|---|---|---|---|---|---|
| Q-AGE | Age / eligibility and body context | none | single item | contextual | Sometimes as body-goal context | No | No | context-only |
| Q-SEX | Biological-sex routing | none | single item | medical/contextual | No | No | No | context-only |
| Q-HEIGHT | Height / BMI input | none | single item | medical/contextual | Sometimes as BMI context | No | No | No | context-only |
| Q-WEIGHT | Current weight / BMI input | none | single item | medical/contextual | Sometimes as body-goal context | No | No | No | context-only |
| Q-TARGET | Target weight | none | single item | contextual | Sometimes as body-goal context | No | No | No | context-only |
| Q-MEAL-RHYTHM | Meal regularity / long gaps | -2, +3 | single item | behavioral | Yes, in meal-rhythm conclusions | No | Limited; categorical timing is better as context/behavior | rewrite |
| Q-HUNGER | Hunger-signal awareness | -3, +1, +2, +3 | single item | psychological/behavioral | Yes | No | Potentially, after frequency framing and item expansion | rewrite |
| Q-SATIETY | Satiety awareness / stopping | -3, +1, +3 | single item | psychological/behavioral | Yes | No | Potentially, after item expansion | rewrite |
| Q-FOOD-FEELING | Food-specific discomfort | +1 per named food | single question, multi-select | medical/contextual | Yes, as food context | No | No | context-only |
| Q-PORTION | Food-specific portion difficulty | -2, +1 per selected food; may emit two +1 signals | single question, multi-select | behavioral | Yes | No | No; food checklist is not a reflective scale | rewrite |
| Q-EMOTION | Stress-related appetite/eating desire | -3, +1, +3 | single item | psychological | Yes, often nearly directly | No | Potentially, but one stress item cannot establish emotional eating | rewrite |
| Q-CUE | External cue reactivity | -3 or +2 per cue | single question, multi-select | psychological/behavioral | Yes; selected cues may select exact advice | No | No as written; cue count is confounded with score | rewrite |
| Q-SLEEP-DURATION | Typical sleep duration | -2, +2, +3 | single item | contextual | Yes | No | No | context-only |
| Q-SLEEP-QUALITY | Sleep quality / fatigue | -3, +1, +3 | single item | contextual/medical | Yes | No | No in psychological totals | context-only |
| Q-TRAVEL | Travel/work arrangement | -2, +1, +2; home work emits two +1 signals | single item | contextual | Yes, as movement/home context | No | No | context-only |
| Q-MOVEMENT | Overall movement level | -3, +2, +3 | single item | behavioral/contextual | Yes | No | No; retain as context, not psychological score | context-only |
| Q-GLUCOSE | Prior glucose measurement result | -1, +2 guidance-only | single item | medical | Yes, only for guidance when abnormal | No | No | context-only |
| Q-BLOOD-PRESSURE | Prior blood-pressure result | -1, +2 guidance-only | single item | medical | Yes, only for guidance when abnormal | No | No | context-only |
| MC-GATE | Menstrual-module routing | none | single item | medical/contextual | No | No | No | context-only |
| MC-01 | Menstrual regularity | +1 guidance-only | single item | medical | Yes, with answer-specific guidance | No | No | context-only |
| ALC-GATE | Alcohol-use routing | +1 for “regular” | single item | behavioral/contextual | Sometimes | No | No | context-only |
| ALC-01 | Eating change with alcohol | -2, +2 | single item | behavioral/contextual | Yes | No | No | context-only |
| TOB-GATE | Nicotine-use routing | none | single item | medical/contextual | No | No | No | context-only |
| TOB-01 | Appetite change with nicotine | +1 for rebound | single item | medical/contextual | Sometimes | No | No | context-only |
| PREG-GATE | Pregnancy/postpartum/lactation context | +2 guidance-only for applicable states | single item | medical | Yes, as professional guidance | No | No | context-only |
| MENO-GATE | Menopause relevance | none | single item | medical/contextual | Limited | No | No | context-only |
| S1-S03 | Compensatory behaviors | -3, +3 guidance-only | single compound item | safety | Yes, in safety routing/guidance | No | No; combines four behaviors and time states | safety-only |
| S1-S04 | Self-harm thoughts | -3, +3 guidance-only | single item | safety | Yes, in urgent routing/guidance | No | No | safety-only |
| S1-B01 | Acute physical warning signs | -3 or +3 per selected sign, guidance-only | single question, multi-select | safety/medical | Yes, in urgent routing/guidance | No | No | safety-only |
| Q-METHOD-CURRENT | Current weight-loss methods; restriction proxy | +1 per restrictive method | single question, multi-select | contextual/behavioral | Yes, as method context | No | No; method choice is not restraint severity | context-only |
| Q-METHOD-PAST | Past methods; restriction proxy | +1 per restrictive method | single question, multi-select | contextual/behavioral | Yes | No | No | context-only |
| Q-METHOD-LONGEST | Longest past method | none; may derive +2 activity signal | single item | contextual | Yes | No | No | context-only |
| Q-METHOD-DURATION | Duration of longest attempt | +3, +2, +1; protective +1/+2 for longer duration | single item | contextual/behavioral | Yes | No | No | context-only |
| Q-METHOD-STOP | Why the attempt stopped | none directly; regex can contribute derived +4 | single open text | contextual | Yes, through fact gates and copied context | No | No; regex is brittle and language-dependent | context-only |
| Q-METHOD-RESULT | Initial result | protective +2 or adverse +1/+2 | single item | contextual | Yes | No | No | context-only |
| Q-METHOD-REGAIN | Regain after stopping | -3, +2, +3 | single item | contextual/behavioral | Yes | No | No | context-only |
| Q-METHOD-SUPPORT | Professional support | -1 per selected professional | single question, multi-select | contextual | Yes, as strength/context | No | No | context-only |
| Q-METHOD-MEDICATION | Medication/supplement supervision | +2 guidance-only for unsupervised medicine | single item | medical | Yes, as guidance | No | No | context-only |
| Q-METHOD-BARRIERS | Self-selected barriers | -2, +1, +2, +3 per selected barrier | single question, multi-select | mixed psychological/behavioral/contextual/medical | Yes, extensively | No | No; it mixes constructs and can largely predetermine the report | rewrite |
| OPEN-PAST | Open description of prior attempt | none directly; regex can contribute derived +4 | single open text | contextual | Yes, through fact gates and report language | No | No | context-only |

## Pattern gates, thresholds, and anchors

| Current pattern | Mandatory anchor(s) | Minimum questions / dimensions | Threshold |
|---|---|---:|---:|
| emotional_regulation | emotional_eating | 2 / 2 | 4 |
| environmental_cues | environmental_cue_reactivity | 2 / 2 | 4 |
| irregular_meals_late_hunger | meal_gap or irregular_meal_rhythm | 2 / 2 | 4 |
| hunger_satiety | hunger_recognition_difficulty or satiety_difficulty | 2 / 2 | 4 |
| sleep_fatigue | short_sleep, poor_sleep_quality, or sleep_fatigue | 2 / 2 | 4 |
| low_movement | very_low_movement or low_movement | 1 / 1 | 2 |
| restrictive_rebound | strict_rule_barrier or regex-derived strict_open_text_anchor | 2 / 2 | 4 |
| plan_daily_life_mismatch | schedule, fatigue, or cost barrier | 2 / 2 | 4 |
| previous_attempt_sustainability | regex-derived maintenance_gap_explicit | 3 / 3 | 6 plus special history gate |

The mandatory anchors and thresholds are design decisions, not empirically estimated cut points. The `previous_attempt_sustainability` special gate additionally requires a linked method, duration of at least 6 months, initial weight loss, and later regain. `irregular_meals_late_hunger` is force-disabled when the meal-rhythm answer is “3–4 hours.”

## Unvalidated interaction rules

Ten hand-authored co-occurrence rules currently enter report generation when their component patterns are supported:

`meal_hunger_satiety`, `sleep_plan`, `sleep_emotion`, `emotion_restriction`, `cue_meal_rhythm`, `cue_satiety`, `cue_movement`, `restriction_sustainability`, `routine_sustainability`, and `movement_maintenance`.

The last also requires `activity_based_method`, `sustained_attempt`, and `weight_regain`. None is shown in the repository to have been fitted, cross-validated, calibrated, or tested for incremental validity. Their public explanations therefore exceed what mere co-occurrence can establish.

## Single-item constructs and answer paraphrasing

The apparent constructs for emotional eating, cue reactivity, meal rhythm, hunger awareness, satiety awareness, movement, sleep duration, and sleep quality each depend on one question (or a multi-select checklist treated as one question). Some patterns combine two or more questions, but combining unlike single indicators under hand-written rules does not create a psychometric subscale.

`report-copy.js` often converts these answers into fluent narrative. Tests strongly protect factual attribution, prevent invented facts, and check report snapshots. Those are valuable software-quality controls. They do not show that a construct was measured reliably. Several narratives closely restate selected responses; for example, stress-related desire, long meal gaps, late hunger recognition, low movement, sleep disruption, and selected barriers can appear almost directly in the report.

## Landing and methodology claims

### Claims that are appropriately bounded

- “Онош биш” and the statements that the product does not replace clinicians.
- The methodology limitation that Mongolian local norms are not yet established.
- The statement that exact future weight loss cannot be predicted.
- The disclosure that referenced instruments were studied and their items were not copied.

### Claims requiring restriction until validation

- “Жин хасахад саад болж буй сэтгэлзүйн шалтгааны тест” implies causal psychological identification.
- “Судалгаанд суурилсан” and “олон улсын арга зүйг баримталсан” can be read as instrument-level validation rather than literature-informed design.
- “Тест эдгээрийн аль нь танд хамгийн олон давтагдаж байгааг ... харуулна” overstates coverage because several examples (loss of control, eating alone, body-image avoidance) are not measured with adequate items.
- “Хариултын давтамж” is inaccurate: the current response options usually do not use a common recall period or frequency scale.
- “хоорондын уялдаа” and interaction language imply empirically established relationships, although rules are hand-authored.
- “баталгаажуулсан ажиглалт” is ambiguous and may be mistaken for psychometric validation.
- “яг юу нуугдаад байгааг,” “гол сэтгэлзүйн шалтгаанууд,” “далд зуршил,” and “танд илүү тохирох” imply causal discovery or treatment matching.
- “үнэнээрээ хариулсан хүний тайлан л оносон гардаг” asserts accuracy without criterion evidence.

Until validation, describe the current output as a **rules-based, self-reported reflection** that organizes answers into preliminary themes. Do not call it validated, normed, diagnostic, causal, predictive, or psychometric.

## Report-test audit

The reviewed report tests provide meaningful **software and copy assurance**, including:

- mapping/coverage and evidence-gate behavior;
- deterministic pattern threshold and contradiction behavior;
- neutral-report fallback behavior;
- factual attribution and prevention of invented cues/context;
- exact-copy and report-schema expectations;
- snapshot versioning, immutable historical access, and activation validation;
- public/internal payload separation;
- safety routing and guidance behavior.

Representative reviewed files include `methodology-content.test.js`, `neutral-report-v3.test.js`, `report-attribution-v2.test.js`, `report-copy-exactness-v2-2.test.js`, `report-evidence.test.js`, `report-factuality-v2-1.test.js`, `report-snapshot-versioning.test.js`, and related report tests on the target branch.

These tests answer questions such as “did the code apply the intended rule?” and “did copy stay tied to an answer?” They do **not** answer:

- whether the item measures the intended latent construct;
- whether multiple items form a stable subscale;
- whether weights or thresholds are calibrated;
- whether score differences exceed measurement error;
- whether interactions add predictive value;
- whether conclusions generalize beyond fixtures;
- whether group comparisons are fair or invariant;
- whether a report direction improves behavior or weight outcomes.

Fixture coverage and passing assertions must therefore not be described as psychometric validation.

## Missing measurement evidence

The reviewed repository contains no documented:

- population norms or representative Mongolian reference distribution;
- internal-consistency estimates (omega or alpha) for intended subscales;
- test–retest reliability;
- exploratory or confirmatory factor validation;
- criterion or predictive validity;
- convergent or discriminant validity;
- measurement invariance across relevant groups;
- calibration of `+1/+2/+3`, negative protective weights, `+4` regex anchors, thresholds, priority scores, or interaction rules;
- uncertainty interval tied to measurement error.

## Overall conclusion

The current product has careful software provenance and safety routing, but its measurement layer is a deterministic inference system built from single items, mixed checklists, custom weights, mandatory anchors, thresholds, regex rules, and unvalidated interactions. It should remain classified as a rules-based self-reflection product until a new multi-item instrument completes the staged validation plan.

**Verdict: DESIGN PHASE ONLY — NOT YET VALIDATED, NOT READY FOR PRODUCTION CLAIMS.**
