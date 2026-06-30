# Experiment and Diary Map

## Current 7-Day Diary Flow

The 7-day flow is already present in `app.js`.

| Area | Current implementation | Notes for migration |
|---|---|---|
| Diary unlock | `renderUnlock()` shows 7-day readiness expectations and starts diary. | Do not change now. Later, make readiness explicitly about confirming driver stack. |
| Daily question selection | `getDiaryQuestions()` uses daily core questions, optional menstrual questions, and adaptive probes based on top preliminary mechanisms. | Strong foundation for driver confirmation. |
| No-unplanned-day branch | If `unplanned_eating_count === "Үгүй"`, diary asks a shorter flow and asks what helped. | Important for first gentle change and protective conditions. |
| Adaptive probes | `probeBank` adds driver-specific daily questions for reward, hunger safety, regulation, executive load, collapse, glucose, circadian, and cue. | Needs new probes for social/alcohol, loneliness/emptiness, shame/body image, nearby store/cafeteria, shift work. |
| Diary save | `saveDiaryEntry()` stores local entry, generated micro-insight, safety flags, and moves to report readiness at 5+ entries. | Good persistence shape for static MVP. |
| Readiness | `reportReadiness()` uses 0-1 insufficient, 2-3 limited, 4 usable but no full report, 5+ full report. | Good threshold; add confirmation criteria later. |
| Daily summary | `generateDailySummaryBullets()` and `createConfirmedSummaryObject()` convert structured answers and text into confirmed evidence tags. | Strong evidence-quality pattern. |
| Safety | `diaryEntrySafetyFlags()` catches urgent/professional terms from diary evidence. | Preserve as invariant. |

## Current 14-Day Experiment Flow

| Area | Current implementation | Notes for migration |
|---|---|---|
| Mechanism-level experiment | `mechanisms[*].experiment` contains short experiment copy for each old mechanism. | Useful but old taxonomy. |
| Voice-level staged experiment | `REPORT_VOICE_LIBRARY[*].experiment` and `renderStagedExperiment()` render staged 14-day experiments. | Current main report path uses this. |
| Older experiment object | `experimentFor()` builds goal/actions/track/success/recovery, but some old report code after early return is not currently reached. | Later cleanup should remove dead code or reuse it intentionally. |
| Safety suppression | Mode3/mode4 suppress ordinary 14-day experiment. | Must preserve. |
| Body-check modification | Mode2 adds caution against fasting/meal skipping/aggressive restriction. | Must preserve. |

## Mapping Current Diary Signals to New Drivers

| Current diary signal | Current source | New driver keys |
|---|---|---|
| Meal skipped / 5+ hour gap | `D-C01`, tags `skipped_meal`, `meal_gap_5h_plus` | `meal_gap`, `evening_hunger`, `hunger_safety` |
| Evening / night vulnerable time | `D-C03` | `evening_hunger`, `fatigue`, `sleep_disruption`, `shift_work` if added |
| High hunger | `D-C04` | `evening_hunger`, `hunger_safety`, `meal_gap` |
| Low hunger but craving | `D-C04` + unplanned count | `self_reward`, `comfort`, `decompression`, `visible_snacks`, `delivery_app` |
| Food function | `D-C05` | `quick_recovery`, `decompression`, `comfort`, `self_reward`, `hunger_safety`, `belonging`, `control_regain` |
| Daily emotion | `D-C06` | `stress`, `anxiety`, `anger_resentment`, `loneliness`, `emptiness`, `fatigue` |
| Stress score | `D-C07` | `stress`, `decompression` |
| Energy score | `D-C08` | `fatigue`, `sleep_disruption`, `quick_recovery`, `low_friction_default` |
| Sleep | `D-C09` | `sleep_disruption`, `fatigue` |
| Drinks/alcohol | `D-C10` | `alcohol_context`, `sleep_disruption`, `fatigue` |
| Body signals | `D-C11` | `medical_concern`, `medical_red_flag`, `professional_first` |
| Movement/pain/fatigue | `D-C12` | `fatigue`, `medical_concern`, possible `punishment_restriction` if paired with overexercise |
| What helped | `D-C13` | first gentle change candidates; `low_friction_default` inverse |
| Raw reflection | `D-V01` | all driver keys; highest narrative evidence |
| Menstrual daily context | `D-MC-*` | `body_change_uncertainty`, `fatigue`, `sleep_disruption`, `medical_concern`, interaction modifiers |

## What 7-Day Diary Should Confirm Later

The new product principle requires the diary to confirm a stack, not a type.

Recommended future confirmation contract:

| Confirmation target | Example evidence |
|---|---|
| Primary driver | Appears on 3+ diary days or has strong confirmed narrative evidence. |
| Secondary driver | Appears on 2+ diary days or repeatedly co-occurs with primary. |
| Interaction | Same combination appears at least twice, e.g. `meal_gap + fatigue + delivery_app`. |
| Vulnerable moment | Time/context repeats, e.g. "орой, хоолны зай уртссан, тэнхээ 3/10". |
| First gentle change | A helpful condition appears in no-unplanned or lower-intensity days. |
| Safety | Any urgent/professional signal overrides experiment and ordinary report. |

## Missing Diary Coverage

- Shift-work day/night rhythm.
- Nearby store/cafeteria default.
- Delivery app friction and food photo exposure as separate daily signals.
- Alcohol/social table context.
- Loneliness vs emptiness vs belonging.
- Shame/body image/stigma after eating or before tracking.
- Explicit compensatory behavior or overexercise daily safety check, with professional-first routing.
