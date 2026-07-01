# Work Pack 4 Report Object Fixture Summary

## Source

Fixture report objects were generated from:

- `tests/driver-stack/driverStackReportObject.mjs`
- `tests/driver-stack/driverStackFixtures.mjs`

Machine-readable compact results are saved in:

- `audits/mvp-diagnostic-migration/work-pack-4/report-object-fixture-results.json`

Markdown review snapshots are saved in:

- `audits/mvp-diagnostic-migration/work-pack-4/report-object-markdown-snapshots.md`

## Fixture coverage

| Fixture | Safety mode | Primary driver | Ordinary experiment | First gentle change |
| --- | --- | --- | --- | --- |
| `shift_work_recovery_only` | `mode1` | `shift_work` | enabled | `shift_recovery_anchor` |
| `shift_work_loneliness_combo` | `mode1` | `shift_work` | enabled | `shift_recovery_connection_slot` |
| `remote_work_visible_snacks` | `mode1` | `visible_snacks` | enabled | `move_one_cue` |
| `stress_delivery_app_comfort` | `mode1` | `stress` | enabled | `pre_delivery_decompression_pause` |
| `meal_gap_evening_hunger` | `mode1` | `meal_gap` | enabled | `bridge_meal_before_evening` |
| `all_or_nothing_restriction_rebound` | `mode1` | `all_or_nothing` | enabled | `next_meal_reset_rule` |
| `social_weekend_alcohol_monday_restart` | `mode1` | `social_table` | enabled | `social_choice_script` |
| `body_shame_restriction` | `mode1` | `body_change_uncertainty` | enabled | `body_neutral_private_tracking` |
| `pcos_body_uncertainty_control` | `mode1` | `body_change_uncertainty` | enabled | `body_neutral_private_tracking` |
| `medication_body_concern_professional_check` | `mode3` | `null` | suppressed | `professional_discussion_summary` |

## Assertions covered

The report object tests assert that:

- all 10 approved fixture names and order are preserved
- report object exports exist
- each report object has exactly the requested stable top-level keys
- owner review flags keep runtime, report copy, PDF, and payment integration disabled
- owner review flags include `testOnly`, `runtimeIntegration`, `modifiesRuntimeReport`, and `noDeploy`
- compact fixture artifact wrapper uses exactly `version`, `generatedBy`, `recommendation`, `fixtureCount`, and `results`
- compact fixture result rows use exactly `name`, `safetyMode`, `primaryDriverKey`, `secondaryDriverKeys`, `interactionId`, `vulnerableMomentId`, `hiddenFoodFunctionKey`, `firstGentleChangeId`, `experimentDurationDays`, `professionalFirst`, and `pass`
- the eight report question fields are populated
- ordinary mode1 report objects include a 14-day experiment object
- professional-first mode3 report objects suppress ordinary experiment output
- markdown snapshots include the required exact Mongolian report section headings
- markdown snapshots are review-only and avoid forbidden copy framing
- old debug fields such as `driverStack`, `reportAnswers`, `sections`, `moduleOrder`, and `runtimeIntegration` are absent

## Validation commands

```sh
node --check tests/driver-stack/driverStackReportObject.mjs
node --check tests/driver-stack/exportDriverStackReportObjects.mjs
node tests/driver-stack/driverStackReportObject.test.js
node tests/driver-stack/exportDriverStackReportObjects.mjs
npm test
git diff --check
```
