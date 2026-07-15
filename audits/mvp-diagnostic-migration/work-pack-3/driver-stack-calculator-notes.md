# Work Pack 3 Driver Stack Calculator Notes

## Scope

Work Pack 3 adds a parallel, test-only driver stack calculator.

It does not replace the current questionnaire, mechanism scoring, report generation, PDF flow, payment flow, entitlement flow, QPay flow, backend flow, or deploy configuration.

Runtime application files remain out of scope. The calculator lives under `tests/driver-stack/` and is executed only by tests.

## Files added

- `tests/driver-stack/driverStackTestCalculator.mjs`
- `tests/driver-stack/driverStackFixtures.mjs`
- `tests/driver-stack/driverStackContract.test.js`
- `tests/driver-stack/driverStackFixtures.test.js`
- `tests/driver-stack/driverStackSafetyInvariants.test.js`
- `tests/driver-stack/exportDriverStackFixtureResults.mjs`

## Work Pack 3A Patch

Work Pack 3A fixes the partial Work Pack 3 implementation while keeping the work test-only.

The patch adds the approved calculator export names:

- `calculateTestDriverStack(input)`
- `normalizeDriverScore(rawScore, expectedMaxScore)`
- `strengthFromNormalizedScore(normalizedScore, isSafety)`
- `selectPrimaryDriver(driverScores, safetyRoute)`
- `selectSecondaryDrivers(driverScores, primaryDriver, safetyRoute)`
- `buildInteractionPattern(driverScores, primaryDriver, secondaryDrivers)`
- `buildVulnerableMoment(input, driverScores, interactionPattern, safetyRoute)`
- `buildFirstGentleChange(driverScores, interactionPattern, safetyRoute)`
- `buildFourteenDayExperimentHypothesis(firstGentleChange, vulnerableMoment, interactionPattern)`
- `buildRemovedFeatureConfirmationTargets(driverScores, vulnerableMoment)`

It also tightens fixture assertions so wrong primaries, wrong hidden food functions, unrelated score saturation, and missing safety overrides fail tests.

## Work Pack 3B Patch

Work Pack 3B is the final contract-compliance patch for the test-only driver stack.

It fixes:

- the main fixture list to exactly the approved 10 WP3B fixture names and order;
- the public `driver_scores` object to the official WP2A camelCase score contract;
- the fixture result JSON shape to include `approvedFixtureNames`, official `driverScores`, and top-score summaries using the same public fields;
- the owner recommendation status to remain review-required before any runtime implementation.

Removed fixtures are retained only as `futureDriverStackFixtures` helpers and are not included in `driverStackFixtures` or the generated fixture result JSON.

## Work Pack 3C Patch

Work Pack 3C changes metadata and artifact contract only.

It keeps scoring logic, fixture behavior, and expected fixture outputs unchanged while correcting:

- recommendation enum: `READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK`;
- public driver score confidence enum to `possible`, `moderate`, `strong`, or `safety`.

## Work Pack 3D Patch

Work Pack 3D changes the generated fixture result artifact shape only.

It keeps scoring logic, fixture behavior, fixture names, expected fixture outputs, and runtime behavior unchanged while correcting:

- fixture result JSON wrapper keys to the final camelCase artifact contract;
- fixture result summary keys to the final camelCase artifact contract;
- artifact shape tests so stale snake_case summary keys fail.

## Work Pack 3E Patch

Work Pack 3E is a final artifact key verification patch only.

It keeps scoring logic, fixture behavior, fixture names, expected fixture outputs, and runtime behavior unchanged while locking the generated artifact wrapper to:

```json
{
  "version": "driver-stack-v0-test-only",
  "generatedBy": "tests/driver-stack/exportDriverStackFixtureResults.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK",
  "approvedFixtureNames": [],
  "fixtureCount": 10,
  "results": []
}
```

The fixture tests now explicitly reject stale wrapper keys: `generated_by`, `approved_fixture_names`, and `fixture_count`.

## Work Pack 3F Patch

Work Pack 3F changes only the generated fixture result item shape.

It keeps scoring logic, fixture behavior, fixture names, expected fixture outputs, and runtime behavior unchanged while reducing each `results[]` item to the compact owner-review artifact shape:

```json
{
  "name": "shift_work_recovery_only",
  "safetyMode": "mode1",
  "primaryDriverKeys": ["shift_work"],
  "secondaryDriverKeys": ["quick_recovery"],
  "interactionId": "shift_work_recovery_only",
  "vulnerableMomentId": "shift_work_recovery_only",
  "firstGentleChangeId": "shift_recovery_anchor",
  "experimentId": "shift_recovery_anchor",
  "hiddenFoodFunctionKey": "quick_recovery",
  "pass": true
}
```

The fixture artifact no longer exports debug/full fields such as `fixtureName`, `description`, `ordinaryReportAllowed`, `ordinaryExperimentAllowed`, `primaryDriver`, `primaryNormalizedScore`, `secondaryDrivers`, `interactionPattern`, `vulnerableMoment`, `visibleCondition`, `hiddenFoodFunction`, `wrongSelfExplanation`, `firstGentleChange`, `experimentDurationDays`, `confirmationTargets`, `safetyDrivers`, `driverScores`, or `topDriverScores`.

## Test runner registration

`tests/run-all.js` now includes the three driver-stack tests so `npm test` validates the test-only migration contract.

This is a test harness change only. It does not alter runtime app behavior.

## Inputs

The calculator accepts a current app-style state shape:

- `packageType`
- `stageAnswers`
- `stageVoiceSummaries`
- `preliminary`
- `removedEntries`

It imports existing app exports in read-only fashion:

- `calculateMechanismEvidence`
- `getOptionMetadata`
- `mechanismNamesByKey`
- `createConfirmedSummaryObject` for fixture construction

The calculator uses existing mechanism evidence as an input layer rather than replacing it.

## Output contract

The output follows the Work Pack 2/2A driver-stack contract:

- `version`
- `source`
- `safety_route`
- `driver_scores`
- `primary_driver`
- `secondary_drivers`
- `interaction_pattern`
- `vulnerable_moment`
- `visible_condition`
- `hidden_food_function`
- `wrong_self_explanation`
- `first_gentle_change`
- `fourteen_day_experiment_hypothesis`
- `removed_feature_diary_confirmation_targets`
- `evidence_sources`
- `copy_constraints`

## Raw and normalized scoring

Each driver score contains:

- `rawScore`: summed weighted evidence points
- `expectedMaxScore`: driver-specific useful maximum
- `normalizedScore`: 0-10 score used in fixture assertions
- `strength`: inactive, weak, moderate, strong, very_strong, or safety
- `confidence`: possible, moderate, strong, or safety
- `evidenceItems`: public evidence item list
- `relatedOldMechanisms`: current-system mechanisms used as inferred evidence
- `directEvidenceCount`: count of non-inferred non-repetition evidence items
- `diaryEvidenceCount`: count of diary or diary-summary evidence items
- `inferredOnly`: true when the score is supported only by inferred old-mechanism evidence

Baseline normalization:

```js
normalizedScore = Math.min(10, Math.round((rawScore / expectedMaxScore) * 10))
```

## Mechanism crosswalk

The calculator maps current mechanism keys into new driver keys using the Work Pack 2 crosswalk:

- `reward`
- `regulation`
- `hungerSafety`
- `glucose`
- `satiety`
- `cue`
- `collapse`
- `executive`
- `circadian`
- `social`
- `medical`
- `autonomy`
- `physiological`
- `decisionDefault`
- `rewardDeficit`
- `roleOverload`
- `shameAvoidance`
- `bodySafety`
- `identity`
- `perfectionism`

The mapping is intentionally test-only and conservative. It preserves old mechanisms as evidence in `related_old_mechanisms`.

## Direct evidence signals

The calculator also reads:

- current option metadata tags
- stage answer text
- confirmed stage summaries
- diary structured fields
- confirmed diary summaries
- repeated diary-day evidence

Diary repetition gives additional evidence weight when a driver appears across multiple days.

Work Pack 3A narrows these signals to avoid false saturation:

- `хоол алгасаагүй` no longer counts as `meal_gap`.
- Generic legacy `hungerSafety` does not automatically dominate stress, cue, social, sleep, or loneliness fixtures.
- Confirmed summary text is used, but broad app-generated summary tags are not used as driver-score evidence in this test-only layer.
- Hidden food function is selected by interaction-specific food-function preference before generic score rank.

## Safety handling

Safety drivers outrank ordinary driver selection.

If professional-first evidence is active, the calculator:

- sets `ordinary_report_allowed` to `false`
- sets `ordinary_experiment_allowed` to `false`
- sets `primary_driver` to `null`
- returns `professional_discussion_summary`
- sets the ordinary 14-day experiment duration to `0`

Safety invariants are covered by `tests/driver-stack/driverStackSafetyInvariants.test.js`.

## Non-runtime guarantee

The implementation does not:

- modify `app.js`
- change questions
- change current scoring
- change report copy
- change PDF generation
- change localStorage behavior
- change backend/payment/QPay/pricing/entitlement
- deploy anything

## Known limitations

This is not production scoring.

It is a migration bridge for tests, owner review, and future implementation planning. Thresholds and tie-breakers are deliberately explicit so they can be reviewed before any runtime work begins.
