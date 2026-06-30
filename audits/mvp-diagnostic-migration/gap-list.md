# Gap List

## High-Priority Conceptual Gaps

| Gap | Why it matters | Current partial coverage | Migration recommendation |
|---|---|---|---|
| New driver keys do not exist as canonical internal keys. | Target product needs `answers -> driver scores -> stack`, not old mechanism names. | Current mechanism keys are rich but named differently. | Add a mapping layer first; do not replace scoring directly. |
| Driver stack is not a first-class output object. | Product principle says one user is not one type. | `primaryMechanism`, `secondaryMechanisms`, `supportingMechanisms` exist inside evidence calculation. | Create a structured `driver_stack` object later. |
| Vulnerable moment is not canonical. | Report must answer the user's most vulnerable moment. | `stuckMoment`, `D-V01`, `triggerMapRows()`, and `beforeEatingItems()` exist. | Standardize `vulnerable_moment = time + body_state + emotion + environment + function`. |
| Secondary and interaction drivers are under-explained. | Stack logic requires interactions, not only top pattern. | `identifyMechanismCombinations()` exists. | Expand combinations using new driver keys and include them in report output. |
| 7-day diary confirmation is not explicit enough. | Diary should confirm primary, secondary, interaction, and first gentle change. | Readiness threshold and refinement bullets exist. | Add confirmation criteria before changing runtime. |
| Safety taxonomy is not aligned to requested keys. | Safety must remain professional-first and auditable. | Mode3/mode4 and body-check mode exist. | Map current flags to `binge_risk`, `compensatory_behavior`, `severe_body_distress`, `medical_red_flag`, `professional_first`. |

## Driver Coverage Gaps

| New layer | Strong current coverage | Weak/missing coverage |
|---|---|---|
| Body and rhythm | `meal_gap`, `evening_hunger`, `sleep_disruption`, `fatigue`, `medical_concern` | `shift_work` needs direct questions; `body_change_uncertainty` is indirect. |
| Psychology | `stress`, `anxiety`, `anger_resentment`, `loneliness`, `emptiness`, `shame`, `guilt`, `loss_of_control_feeling` | Loneliness/emptiness need clearer separation; shame/body image needs dedicated nonjudgmental mapping. |
| Food function | `decompression`, `comfort`, `self_reward`, `hunger_safety`, `control_regain` | `quick_recovery`, `loneliness_soothing`, `belonging`, `escape_from_shame`, `escape_from_failure` need explicit mapping. |
| Habit / environment | `visible_snacks`, `delivery_app`, `food_photo_cue`, `social_table`, `low_friction_default` | `nearby_store`, `cafeteria`, `alcohol_context` are weak or indirect. |
| Restriction / rebound | `all_or_nothing`, `monday_restart`, `strict_diet`, `fasting_rebound`, `carb_cut_rebound`, `punishment_restriction` | Carb-cut rebound is implied but not explicit enough; punishment restriction should connect to compensatory behavior. |
| Shame / body image / stigma | shame/guilt after eating, body-safety pause | Severe body distress and stigma context are not systematically scored. |
| Safety / professional-first | medical/professional/urgent modes | Need clearer mapping to requested safety keys and binge/compensatory thresholds. |

## Implementation Gaps To Address Later

- The report calculation and report rendering are tightly coupled in `app.js`.
- Old mechanism names and public voice keys are mixed with report generation.
- `renderOneTimeReport()` has unreachable older report code after an early `return renderHumanReadableReport(...)`.
- Tests validate current mechanism behavior but not the new driver taxonomy.
- The mock backend stores primary/secondary mechanisms but not the requested driver-stack shape.
- PDF export scripts may not reflect any future driver-stack report unless updated separately.

## Things That Are Not Gaps

- The current system is not a simple single-route report. It already ranks mechanisms and supports safety routes.
- The 7-day diary already exists and has readiness gates.
- User-confirmed narrative evidence already exists and should be preserved.
- Safety-first suppression of ordinary experiments already exists and should be preserved.
