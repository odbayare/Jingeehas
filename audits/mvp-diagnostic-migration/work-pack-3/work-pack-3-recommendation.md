# Work Pack 3 Recommendation

## Recommendation

Keep Work Pack 3 as a test-only migration layer until owner review is complete.

The current system should remain the production source of truth for questions, scoring, report copy, diary behavior, safety routing, PDF generation, payment, QPay, backend, pricing, and entitlement behavior.

## What Work Pack 3 proves

Work Pack 3 shows that the accepted migration direction is feasible:

```text
answers + diary evidence
-> old mechanisms
-> new driver scores
-> primary driver
-> secondary drivers
-> interaction pattern
-> vulnerable moment
-> hidden food function
-> first gentle change
-> 14-day experiment hypothesis
-> 7-day diary confirmation targets
```

It also shows that professional-first safety can override ordinary behavior-change output in the new driver-stack contract.

## Work Pack 3A Patch Result

Work Pack 3A should be treated as the corrected owner-review version of Work Pack 3.

It fixes:

- missing calculator export names;
- incomplete driver score object fields;
- non-approved fixture names;
- missing `shift_work_loneliness_combo`;
- missing `pcos_body_uncertainty_shame`;
- score saturation from false meal-gap matches and broad legacy tags;
- hidden food function selection falling back to `hunger_safety` too often;
- loose tests that allowed wrong outputs to pass.

## Work Pack 3B Patch Result

Work Pack 3B should be treated as the contract-compliant owner-review version of Work Pack 3.

Recommendation enum:

```text
READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK
```

This enum means the test-only driver stack is ready for owner review, but no runtime integration, report generation, scoring change, PDF change, backend/payment/QPay/pricing/entitlement change, or deploy should happen yet.

Work Pack 3B fixes:

- exact approved fixture names and order;
- official WP2A public driver score fields;
- fixture result JSON shape;
- keeping removed fixtures outside the main result set;
- recommendation status before future implementation.

## Work Pack 3C Metadata Patch

Work Pack 3C changes metadata and artifact contract only.

It fixes:

- recommendation enum to `READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK`;
- public driver score confidence values to the approved enum: `possible`, `moderate`, `strong`, `safety`.

It does not change scoring logic, fixture behavior, expected fixture outputs, runtime behavior, PDF generation, backend/payment/QPay/pricing/entitlement, or deploy configuration.

## Work Pack 3D Artifact Shape Patch

Work Pack 3D changes only the fixture result artifact shape.

It fixes:

- fixture result JSON wrapper keys to the final camelCase contract;
- fixture result JSON per-fixture summary keys to the final camelCase contract;
- artifact-shape assertions so stale snake_case result keys fail.

It does not change scoring logic, fixture behavior, fixture names, expected fixture outputs, runtime behavior, PDF generation, backend/payment/QPay/pricing/entitlement, or deploy configuration.

## Work Pack 3E Artifact Key Patch

Work Pack 3E is the final artifact key verification patch only.

It confirms the fixture result JSON wrapper is exactly:

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

It also adds a test guard against stale wrapper keys: `generated_by`, `approved_fixture_names`, and `fixture_count`.

It does not change scoring logic, fixture behavior, fixture names, expected fixture outputs, runtime behavior, PDF generation, backend/payment/QPay/pricing/entitlement, or deploy configuration.

## Work Pack 3F Compact Result Patch

Work Pack 3F changes only the generated fixture result item shape.

It reduces each `results[]` item to:

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

It removes debug/full export fields from the artifact, including `fixtureName`, `description`, `ordinaryReportAllowed`, `ordinaryExperimentAllowed`, `primaryDriver`, `primaryNormalizedScore`, `secondaryDrivers`, `interactionPattern`, `vulnerableMoment`, `visibleCondition`, `hiddenFoodFunction`, `wrongSelfExplanation`, `firstGentleChange`, `experimentDurationDays`, `confirmationTargets`, `safetyDrivers`, `driverScores`, and `topDriverScores`.

It does not change scoring logic, fixture behavior, fixture names, expected fixture outputs, runtime behavior, PDF generation, backend/payment/QPay/pricing/entitlement, or deploy configuration.

## What should be reviewed before implementation

Owner review should focus on:

- whether the driver tie-breakers match the desired product explanation
- whether safety-null primary behavior is correct for `mode3` and `mode4`
- whether diary repetition weights are too strong, too weak, or acceptable
- whether direct text/tag signals are acceptable as a test bridge
- whether the fixture set covers enough edge cases before runtime scoring work
- whether first gentle changes are the right action vocabulary

## Recommended next work pack

Before any runtime implementation, create a small Work Pack 3A review patch if needed.

Possible future items:

- add more contradiction fixtures
- add fixtures for `binge_risk`, `compensatory_behavior`, and `severe_body_distress`
- add fixtures for cafeteria, nearby store, and strict diet
- add fixture snapshots for one-time versus removed-feature evidence quality

Only after owner approval should a future Work Pack 4 propose runtime integration.

## Do not do yet

Do not:

- change `app.js`
- rewrite questions
- rewrite reports
- change current scoring
- regenerate PDF
- deploy
- enable QPay
- change backend/payment/pricing/entitlement behavior
- change production or localStorage behavior

## Commit guidance

When approved, commit only:

- `audits/mvp-diagnostic-migration/work-pack-3/`
- `tests/driver-stack/`
- the test-only addition to `tests/run-all.js`

Do not include unrelated audit folders or runtime files.
