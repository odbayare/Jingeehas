# Report Module Map

This file maps current report modules to the new target report questions. It is audit-only and does not prescribe copy changes for the current runtime.

## Current Report Modules

| Current module / function | Current output role | New target report question served | Current strength | Migration note |
|---|---|---|---|---|
| `renderReport()` | Main report router: safety mode, paywall/readiness, one-time/full report branching | All | Strong | Keep as orchestrator; later separate calculation from rendering. |
| `reportMode()` | Chooses `deep`, `check`, `professional`, or `urgent` | Safety / professional-first | Strong | Remap to safety keys: `medical_red_flag`, `compensatory_behavior`, `severe_body_distress`, `professional_first`. |
| `rankedPatterns()` | Ranks primary/secondary mechanisms | Primary + secondary drivers | Strong | Rename/remap mechanism keys to driver-stack output. |
| `calculateMechanismEvidence()` | Builds evidence from stage answers, summaries, diary entries | Driver scores, primary/secondary/supporting drivers | Strong | This is the migration anchor. |
| `identifyMechanismCombinations()` | Detects mechanism interactions | Primary + secondary + interaction | Medium | Expand to explicit interaction explanations using new keys. |
| `renderSimpleResultSection()` | Four-card summary: stuck moment, meaning, first step, avoid for now | Vulnerable moment; visible condition; wrong self-explanation; first gentle change | Strong | Already close to target; standardize fields. |
| `renderSurfaceHiddenSection()` | Visible condition vs hidden mechanism | Visible condition; hidden function | Strong | Keep concept; map to new layer names. |
| `renderHumanReadableReport()` | Main modern report body | Most target questions | Strong | Current primary report renderer. |
| `renderOneTimeReport()` | Currently returns `renderHumanReadableReport()` immediately; older body after return is dead code | One-time report | Mixed | Dead code should not be changed now, but migration should remove or archive later. |
| `REPORT_VOICE_LIBRARY` and `reportVoiceFor()` | Pattern-specific narrative, cycle, first step, experiment | Wrong self-explanation; first gentle change; 14-day experiment | Strong | Needs driver-stack composition instead of one voice dominating. |
| `getSimpleResultSummary()` | Simple summary per voice | Vulnerable moment; meaning; first step; avoid | Strong | Remap output to standard `driver_stack_summary`. |
| `foodFunctionIntro()` | Explains function food serves | Hidden function | Strong | Map to food-function keys. |
| `cycleMapSteps()` | Explains repeated loop | Interaction / vulnerable moment | Medium | Good structure; should become interaction-aware and driver-stack-aware. |
| `refinementBullets()` | Explains what 7-day diary can clarify | 7-day diary confirmation | Medium | Needs stronger confirmation contract. |
| `renderStagedExperiment()` | Shows staged experiment paragraphs | 14-day experiment | Strong | Good, but experiment should be generated from first gentle change and driver stack. |
| `professionalCheckHtml()` | Professional-check note | Safety/professional-first | Strong | Keep untouched until safety migration. |
| `bodySafetyPauseHtml()` | Body shame/visibility caution | Shame/body image/stigma; safety | Medium | Important, but should map to explicit `severe_body_distress` threshold. |
| `menstrualCycleContextHtml()` | Cycle context note | Body/rhythm and medical concern | Medium | Good body-rhythm module; should be folded into driver stack as context/interaction. |

## Target Report Questions

| Target question | Current coverage | Gap |
|---|---|---|
| 1. What is the user’s most vulnerable moment? | Partly covered by `getSimpleResultSummary().stuckMoment`, `D-V01`, `triggerMapRows()`, and `beforeEatingItems()`. | Needs explicit canonical field that combines time + state + trigger, e.g. "орой + тэнхээ багассан + хоолны зай уртссан". |
| 2. What visible condition is present? | Covered by `renderSurfaceHiddenSection()` and context helpers. | Needs stable mapping from answers to visible condition, not only voice-key heuristic. |
| 3. What hidden function is food serving? | Covered by `foodFunctionIntro()`, `hiddenFunctionItems()`, and `REPORT_VOICE_LIBRARY.needs`. | Needs standardized food-function keys: `quick_recovery`, `decompression`, `comfort`, etc. |
| 4. What secondary drivers are also active? | Covered by `secondaryMechanisms` and `compressedSecondaryPatterns()`. | Output should explicitly show primary + secondary + why secondary matters. |
| 5. What wrong self-explanation may be making it worse? | Covered by `notProblem`, `notRealProblemCopy()`, `previousAttemptsCopy()`. | Needs explicit field tied to shame/restriction/rebound drivers. |
| 6. What is the first gentle change? | Covered by `firstStep`, `leveragePoint()`, and voice experiments. | Should be chosen by lowest-friction modifiable driver, not just primary mechanism. |
| 7. What should the 14-day experiment test? | Covered by `renderStagedExperiment()` and `experimentFor()`. | Needs consistent hypothesis format: "If we change X, then Y vulnerable moment should soften." |
| 8. What should the 7-day diary confirm? | Covered by `refinementBullets()`, `reportReadiness()`, `triggerMapRows()`. | Needs explicit confirmation metrics for primary, secondary, interaction, and safety. |

## Current Report Mode Assessment

| Mode | Current behavior | Migration handling |
|---|---|---|
| `deep` / mode1 | Ordinary report with primary pattern, hidden function, cycle, first step, 14-day experiment. | Keep and remap to driver-stack. |
| `check` / mode2 | Ordinary report plus professional-check caution when body signals are notable. | Keep; tie to `medical_concern` and avoid unsafe experiments. |
| `professional` / mode3 | Suppresses ordinary report and ordinary 14-day experiment; gives professional-first summary. | Preserve as safety invariant. |
| `urgent` / mode4 | Suppresses ordinary report and directs immediate safety support. | Preserve as safety invariant. |

## Report Migration Shape

Recommended future internal report object:

```text
driver_scores
primary_driver
secondary_drivers
interaction_pattern
vulnerable_moment
visible_condition
hidden_food_function
wrong_self_explanation
first_gentle_change
fourteen_day_experiment
seven_day_confirmation_plan
safety_route
evidence_sources
```
