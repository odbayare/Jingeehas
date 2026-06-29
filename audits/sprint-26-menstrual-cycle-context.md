# Sprint 26 — Menstrual Cycle Context Layer

## Source

Internal human feedback noted that appetite, cravings, mood, sleep, swelling, fatigue, and food choices can change around the menstrual cycle, but the assessment had no respectful way to capture that context.

## Research Summary

- Appetite and energy intake can increase from follicular to luteal/premenstrual days for some users.
- Sweet, salty, and high-fat cravings can increase in the premenstrual/luteal period for some users.
- Resting metabolic rate may rise slightly in the luteal phase, but effects vary and should not be overused as an explanation.
- Insulin sensitivity, sleep, fatigue, mood, swelling, contraception, PCOS, postpartum/breastfeeding, perimenopause, stress, low energy availability, and disordered eating can change or weaken simple calendar-phase inference.
- The product should treat cycle information as context, not as diagnosis or a single-cause explanation.

## Product Decision

Added `menstrual_cycle_context` as a context layer. It can modify interpretation of appetite increase, sweet/salty craving, emotional eating, sleep-energy mismatch, hunger-safety, body-signal concerns, and restriction-collapse risk around premenstrual days.

It does not become a primary mechanism by default.

## Questions Added

- `MC-GATE`: opt-in gate for menstrual-cycle questions.
- `MC-INTRO`: respectful module explanation.
- `MC-01` through `MC-07`: cycle regularity, approximate timing, appetite timing, premenstrual changes, intake/frequency change, confidence modifiers, and cycle disruption with restriction/exercise.
- `D-MC-01` through `D-MC-03`: daily cycle phase, daily cycle-linked appetite, and body/sleep/fatigue effect when relevant.

Existing appetite/function questions now include:

- `Мөчлөгийн тодорхой өдрүүдэд илүү хүчтэй болдог`
- `Сарын тэмдэг ирэхийн өмнөх өдрүүдэд`
- `Сарын тэмдэгтэй холбоотой мэт санагдсан`

## Tags And Evidence

New evidence tags include:

- `menstrual_cycle_context`
- `premenstrual_appetite_shift`
- `cycle_hunger_increase`
- `cycle_sweet_craving`
- `cycle_salty_fat_craving`
- `cycle_mood_eating`
- `cycle_sleep_fatigue`
- `cycle_bloating_body_signal`
- `irregular_cycle_professional_check`
- `amenorrhea_3_months`
- `restriction_exercise_cycle_disruption`
- `cycle_modifier_confidence_low`

## Report Changes

Added optional section:

`Мөчлөгтэй холбоотой анхаарах зүйл`

The section explains cycle-linked appetite/craving as a possible context, not a cause or diagnosis. If confidence is low, the report says calendar-day inference should not be interpreted rigidly.

Avoid-list and 14-day experiment modifiers now caution against starting overly strict food rules during premenstrual days, treating temporary swelling/weight change as fat gain, or reading cravings only as discipline failure.

## Safety Logic

Cycle data alone does not trigger Mode 4.

Professional-first can trigger when cycle disruption combines with stronger safety context, such as:

- missed period for 3 months plus restriction/exercise disruption
- irregular cycle plus PCOS concern plus glucose/BP/body concern
- postpartum/breastfeeding plus strong body-signal concern

Isolated irregularity/missed period remains a professional-check context, not an urgent route.

## Tests Added

Added `tests/menstrual-cycle-context.test.js` covering:

- gate exists
- gate no skips module
- gate yes renders module
- appetite/craving/daily options include cycle context
- daily questions render only when active
- cycle evidence remains context, not primary mechanism
- premenstrual craving adds report note
- irregular/amenorrhea combined cases route safely
- isolated cycle irregularity does not trigger Mode 4
- confidence-lowering modifiers use non-deterministic copy
- Mode 4 urgent safety remains unchanged
- three virtual cycle users A/B/C

## Validation Results

Passed:

- `node --check app.js`
- `node --check scripts/run-virtual-user-audit.mjs`
- `node scripts/run-virtual-user-audit.mjs --assert-clean`
  - 10 PASS
  - 0 PARTIAL
  - 0 FAIL
  - P0/P1/P2 = 0
  - readiness score = 96
  - recommendation = READY FOR INTERNAL HUMAN TESTING
- `npm test`
- `node --check scripts/export-virtual-reports-pdf.mjs`
- `node scripts/export-virtual-reports-pdf.mjs`
  - rawReports = 10
  - bannedTermsFound = 0
  - Mode 3/4 reports = user-08, user-09, user-10
- `git diff --check`

## Remaining Concerns

The cycle layer is intentionally conservative. It may need human tester feedback for wording sensitivity, especially around PCOS, postpartum/breastfeeding, perimenopause, missed periods, and opt-out comfort.

## Recommendation

READY FOR INTERNAL HUMAN TESTING WITH MENSTRUAL-CYCLE CONTEXT
