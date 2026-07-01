# Work Pack 3 Fixture Results Summary

## Source

Fixture results were generated from:

- `tests/driver-stack/driverStackTestCalculator.mjs`
- `tests/driver-stack/driverStackFixtures.mjs`

Machine-readable results are saved in:

- `audits/mvp-diagnostic-migration/work-pack-3/driver-stack-fixture-results.json`

The Work Pack 3D result artifact uses the final camelCase wrapper and summary keys, while preserving the official camelCase public driver score fields.

Work Pack 3E confirms the artifact wrapper keys are exactly `version`, `generatedBy`, `recommendation`, `approvedFixtureNames`, `fixtureCount`, and `results`.

Work Pack 3F reduces each `results[]` item to compact owner-review fields only: `name`, `safetyMode`, `primaryDriverKeys`, `secondaryDriverKeys`, `interactionId`, `vulnerableMomentId`, `firstGentleChangeId`, `experimentId`, `hiddenFoodFunctionKey`, and `pass`.

## Fixture coverage

| Fixture | Safety mode | Primary driver | Interaction pattern | First gentle change |
| --- | --- | --- | --- | --- |
| `shift_work_recovery_only` | `mode1` | `shift_work` | `shift_work_recovery_only` | `shift_recovery_anchor` |
| `shift_work_loneliness_combo` | `mode1` | `shift_work` | `shift_work_loneliness_combo` | `shift_recovery_connection_slot` |
| `remote_work_visible_snacks` | `mode1` | `visible_snacks` | `cue_reward_low_friction_default` | `move_one_cue` |
| `stress_delivery_app_comfort` | `mode1` | `stress` | `stress_delivery_app_comfort` | `pre_delivery_decompression_pause` |
| `meal_gap_evening_hunger` | `mode1` | `meal_gap` | `meal_gap_evening_hunger` | `bridge_meal_before_evening` |
| `all_or_nothing_restriction_rebound` | `mode1` | `all_or_nothing` | `all_or_nothing_punishment_restriction` | `next_meal_reset_rule` |
| `social_weekend_alcohol_monday_restart` | `mode1` | `social_table` | `social_belonging_alcohol` | `social_choice_script` |
| `body_shame_restriction` | `mode1` | `body_change_uncertainty` | `body_shame_restriction` | `body_neutral_private_tracking` |
| `pcos_body_uncertainty_control` | `mode1` | `body_change_uncertainty` | `pcos_body_uncertainty_control` | `body_neutral_private_tracking` |
| `medication_body_concern_professional_check` | `mode3` | `null` | `medical_first_body_signal` | `professional_discussion_summary` |

## Assertions covered

The fixture tests assert that:

- fixture names match the approved exact 10 names and order
- removed helper fixtures are not included in the main fixture set
- every fixture produces the exact expected primary driver or safety-null primary
- every fixture produces the expected hidden food function
- public driver scores use official WP2A camelCase fields
- public driver score confidence values use `possible`, `moderate`, `strong`, or `safety`
- fixture result artifact wrapper and summary keys use the final camelCase contract
- fixture result artifact wrapper rejects stale `generated_by`, `approved_fixture_names`, and `fixture_count` keys
- fixture result artifact items reject debug/full fields such as `driverScores`, `topDriverScores`, `description`, and report permission fields
- expected drivers are present with nonzero normalized scores
- expected interaction patterns are selected
- expected first gentle changes are selected
- expected safety modes are respected
- professional-first cases suppress ordinary reports and ordinary experiments
- the output never becomes a one-type label
- repeated diary evidence can outweigh stage-only reward evidence
- unrelated saturation is capped in stress, cue, social, sleep, shift-work, and PCOS fixtures

## Safety fixture behavior

`medication_body_concern_professional_check` routes to `mode3`, suppresses ordinary report/experiment output, and returns `professional_discussion_summary`.

`pcos_body_uncertainty_control` remains `mode1` in the test fixture because it is designed to test body uncertainty and control-regain pressure without escalating to professional-first. More severe body distress should be covered by a separate future safety fixture.

An additional safety invariant test constructs an urgent `S1-S04` case and verifies `mode4` behavior.

## Validation commands

The Work Pack 3 validation set is:

```sh
node tests/driver-stack/driverStackContract.test.js
node tests/driver-stack/driverStackFixtures.test.js
node tests/driver-stack/driverStackSafetyInvariants.test.js
node tests/driver-stack/exportDriverStackFixtureResults.mjs
npm test
git diff --check
```

## Interpretation

The test-only calculator demonstrates that the current system can be extended into an explicit driver-stack contract without replacing the existing mechanism system.

The strongest next-step value is not runtime adoption yet. The next value is owner review of the test contract, fixture archetypes, safety invariants, and driver tie-breakers.
