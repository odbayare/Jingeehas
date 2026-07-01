# Work Pack 4 Report Object Notes

## Scope

Work Pack 4 adds a test-only report object prototype built from the Work Pack 3 driver stack output.

It does not integrate with runtime report rendering, rewrite report copy, change scoring, change questions, regenerate PDF, deploy, enable QPay, or touch backend/payment/pricing/entitlement behavior.

## Files added

- `tests/driver-stack/driverStackReportObject.mjs`
- `tests/driver-stack/driverStackReportObject.test.js`
- `tests/driver-stack/exportDriverStackReportObjects.mjs`
- `audits/mvp-diagnostic-migration/work-pack-4/report-object-fixture-results.json`
- `audits/mvp-diagnostic-migration/work-pack-4/report-object-markdown-snapshots.md`

## Exports

`tests/driver-stack/driverStackReportObject.mjs` exports:

- `buildDriverStackReportObject(stack, options = {})`
- `buildFixtureReportObject(fixture)`
- `buildFixtureReportObjects(fixtures)`
- `renderDriverStackReportMarkdown(reportObject)`

## Input

The builder accepts a `driver-stack-v0-test-only` object from `tests/driver-stack/driverStackTestCalculator.mjs`.

Fixture helpers build report objects from the approved Work Pack 3 fixtures without changing fixture names, fixture behavior, scoring, or expected outputs.

## Output

The report object version is `driver-stack-report-object-v0-test-only`.

The object includes:

- `version`
- `fixtureName`
- `safetyMode`
- `sourceSummary`
- `primaryDriver`
- `secondaryDrivers`
- `interaction`
- `vulnerableMoment`
- `visibleCondition`
- `hiddenFoodFunction`
- `wrongSelfExplanation`
- `firstGentleChange`
- `fourteenDayExperiment`
- `sevenDayDiaryConfirmation`
- `safetyBlock`
- `evidenceExplanation`
- `copyConstraints`
- `ownerReviewFlags`

## Report questions covered

The stable top-level fields answer:

- vulnerable moment
- visible condition
- hidden food function
- secondary drivers
- wrong self-explanation
- first gentle change
- 14-day experiment identifier
- 7-day diary confirmation targets

## Safety behavior

Mode3/mode4 or professional-first output suppresses ordinary 14-day experiment output in the report object.

Professional-first report objects set `fourteenDayExperiment` to `null` and set `safetyBlock.suppressOrdinaryExperiment` to `true`.

## Runtime guardrails

Every report object includes:

```json
{
  "ownerReviewFlags": {
    "testOnly": true,
    "runtimeIntegration": false,
    "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT",
    "runtimeIntegrationEnabled": false,
    "modifiesAppJs": false,
    "modifiesRuntimeReport": false,
    "modifiesReportCopy": false,
    "modifiesPdf": false,
    "modifiesPaymentOrEntitlement": false,
    "noDeploy": true,
    "noDietPlan": true,
    "noCalorieTracking": true,
    "noOneTypeLabel": true,
    "noShameLanguage": true
  }
}
```

The compact fixture artifact contains only owner-review fixture result rows, not full report object debug dumps.

The compact fixture artifact wrapper is exactly:

```json
{
  "version": "driver-stack-report-object-v0-test-only",
  "generatedBy": "tests/driver-stack/exportDriverStackReportObjects.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT",
  "fixtureCount": 10,
  "results": []
}
```

Each compact fixture result row is exactly:

```json
{
  "name": "shift_work_recovery_only",
  "safetyMode": "mode1",
  "primaryDriverKey": "shift_work",
  "secondaryDriverKeys": ["quick_recovery"],
  "interactionId": "shift_work_recovery_only",
  "vulnerableMomentId": "shift_work_recovery_only",
  "hiddenFoodFunctionKey": "quick_recovery",
  "firstGentleChangeId": "shift_recovery_anchor",
  "experimentDurationDays": 14,
  "professionalFirst": false,
  "pass": true
}
```

Markdown snapshots include the required Mongolian section headings:

- `## Аюулгүй байдлын чиглэл` for professional-first reports
- `## Ил харагдаж байгаа зүйл`
- `## Цаана нь ажиллаж байгаа зүйл`
- `## Эмзэг мөч`
- `## Хоолны далд үүрэг`
- `## Буруу өөр тайлбар`
- `## Эхний зөөлөн өөрчлөлт`
- `## 14 хоногийн туршилтын таамаг`
- `## 7 хоногийн баталгаажуулах тэмдэглэл`
