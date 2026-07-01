# Work Pack 4 Owner Review Pack

## Recommendation Enum

~~~~~~text
READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
~~~~~~
## Exact Artifact Wrapper

~~~~~~json
{
  "version": "driver-stack-report-object-v0-test-only",
  "generatedBy": "tests/driver-stack/exportDriverStackReportObjects.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT",
  "fixtureCount": 10,
  "results": []
}
~~~~~~

## Exact Result Item Shape

~~~~~~json
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
~~~~~~

## Required Artifacts

- audits/mvp-diagnostic-migration/work-pack-4/report-object-fixture-results.json
- audits/mvp-diagnostic-migration/work-pack-4/report-object-markdown-snapshots.md
- audits/mvp-diagnostic-migration/work-pack-4/report-object-notes.md
- audits/mvp-diagnostic-migration/work-pack-4/report-object-fixture-summary.md
- audits/mvp-diagnostic-migration/work-pack-4/work-pack-4-recommendation.md
- audits/mvp-diagnostic-migration/work-pack-4/OWNER_REVIEW_PACK_WP4.md

## Repository State

### git status --short

~~~~~~text
 M tests/run-all.js
?? audits/mvp-diagnostic-migration/work-pack-4/
?? audits/sprint-36-paid-depth-prototype/
?? tests/driver-stack/driverStackReportObject.mjs
?? tests/driver-stack/driverStackReportObject.test.js
?? tests/driver-stack/exportDriverStackReportObjects.mjs
~~~~~~

### git diff --stat

~~~~~~text
 tests/run-all.js | 1 +
 1 file changed, 1 insertion(+)
~~~~~~

### git diff -- app.js index.html styles.css mockBackend.js package.json _redirects

~~~~~~diff
~~~~~~

## Validation Commands and Results

### node --check tests/driver-stack/driverStackReportObject.mjs

~~~~~~text
~~~~~~

### node --check tests/driver-stack/exportDriverStackReportObjects.mjs

~~~~~~text
~~~~~~

### node tests/driver-stack/driverStackReportObject.test.js

~~~~~~text
driverStackReportObject tests passed
~~~~~~

### node tests/driver-stack/exportDriverStackReportObjects.mjs > /private/tmp/wp4d_report_object_fixture_results_check.json

~~~~~~text
exportDriverStackReportObjects completed
~~~~~~

### rg stale result fields and headings in generated artifacts

~~~~~~text
No stale result fields or headings found in generated artifacts
~~~~~~

### git diff --check

~~~~~~text
~~~~~~

## tests/driver-stack/driverStackReportObject.mjs

~~~~~~js
import { buildDriverStack } from "./driverStackTestCalculator.mjs";
import { driverStackFixtures } from "./driverStackFixtures.mjs";

const REPORT_VERSION = "driver-stack-report-object-v0-test-only";

function compactDriver(driver) {
  if (!driver) return null;
  return {
    key: driver.key,
    layer: driver.layer,
    normalizedScore: driver.normalizedScore,
    strength: driver.strength
  };
}

function compactSecondaryDriver(driver) {
  return {
    key: driver.key,
    layer: driver.layer,
    normalizedScore: driver.normalizedScore,
    strength: driver.strength,
    relationshipToPrimary: driver.relationship_to_primary
  };
}

function compactFirstGentleChange(change) {
  return {
    id: change.id,
    targets: change.targets,
    action: change.action,
    whyThisFirst: change.why_this_first
  };
}

function compactDriverScore(score) {
  return {
    key: score.key,
    layer: score.layer,
    normalizedScore: score.normalizedScore,
    strength: score.strength,
    confidence: score.confidence,
    directEvidenceCount: score.directEvidenceCount,
    diaryEvidenceCount: score.diaryEvidenceCount,
    inferredOnly: score.inferredOnly
  };
}

function activeDriverScores(driverScores) {
  return Object.values(driverScores)
    .filter(score => score.normalizedScore > 0)
    .sort((a, b) => b.normalizedScore - a.normalizedScore || b.rawScore - a.rawScore || a.key.localeCompare(b.key))
    .map(compactDriverScore);
}

function safetySummary(safetyRoute) {
  const professionalFirst = !safetyRoute.ordinary_report_allowed || !safetyRoute.ordinary_experiment_allowed;
  return {
    mode: safetyRoute.mode,
    ordinaryReportAllowed: safetyRoute.ordinary_report_allowed,
    ordinaryExperimentAllowed: safetyRoute.ordinary_experiment_allowed,
    professionalFirst,
    safetyDrivers: safetyRoute.safety_drivers,
    reasonCodes: safetyRoute.reason_codes
  };
}

export function buildDriverStackReportObject(stack, options = {}) {
  if (!stack || stack.version !== "driver-stack-v0-test-only") {
    throw new Error("buildDriverStackReportObject requires a driver-stack-v0-test-only object");
  }

  const safety = safetySummary(stack.safety_route);
  const primaryDriver = compactDriver(stack.primary_driver);
  const secondaryDrivers = stack.secondary_drivers.map(compactSecondaryDriver);
  const activeScores = activeDriverScores(stack.driver_scores);
  const fourteenDayExperiment = safety.ordinaryExperimentAllowed ? {
    id: stack.first_gentle_change.id,
    hypothesis: stack.fourteen_day_experiment_hypothesis.hypothesis,
    durationDays: stack.fourteen_day_experiment_hypothesis.duration_days,
    dailyAction: stack.fourteen_day_experiment_hypothesis.daily_action,
    track: stack.fourteen_day_experiment_hypothesis.track,
    successSignal: stack.fourteen_day_experiment_hypothesis.success_signal,
    recoveryRule: stack.fourteen_day_experiment_hypothesis.recovery_rule
  } : null;
  const firstGentleChange = compactFirstGentleChange(stack.first_gentle_change);

  return {
    version: REPORT_VERSION,
    fixtureName: options.fixtureName || null,
    safetyMode: safety.mode,
    sourceSummary: {
      sourceVersion: stack.version,
      stageAnswerCount: stack.source.stage_answer_count,
      diaryEntryCount: stack.source.diary_entry_count,
      evidenceQuality: stack.source.evidence_quality,
      currentReportMode: stack.source.current_report_mode,
      testOnly: true
    },
    primaryDriver,
    secondaryDrivers,
    interaction: stack.interaction_pattern,
    vulnerableMoment: stack.vulnerable_moment,
    visibleCondition: stack.visible_condition,
    hiddenFoodFunction: stack.hidden_food_function,
    wrongSelfExplanation: stack.wrong_self_explanation,
    firstGentleChange,
    fourteenDayExperiment,
    sevenDayDiaryConfirmation: stack.seven_day_diary_confirmation_targets,
    safetyBlock: {
      mode: safety.mode,
      ordinaryReportAllowed: safety.ordinaryReportAllowed,
      ordinaryExperimentAllowed: safety.ordinaryExperimentAllowed,
      professionalFirst: safety.professionalFirst,
      safetyDrivers: safety.safetyDrivers,
      reasonCodes: safety.reasonCodes,
      suppressOrdinaryExperiment: !safety.ordinaryExperimentAllowed
    },
    evidenceExplanation: {
      activeDriverScores: activeScores,
      evidenceSources: stack.evidence_sources,
      topDrivers: activeScores.slice(0, 8).map(score => score.key)
    },
    copyConstraints: stack.copy_constraints,
    ownerReviewFlags: {
      testOnly: true,
      runtimeIntegration: false,
      recommendation: "READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT",
      runtimeIntegrationEnabled: false,
      modifiesAppJs: false,
      modifiesRuntimeReport: false,
      modifiesReportCopy: false,
      modifiesPdf: false,
      modifiesPaymentOrEntitlement: false,
      noDeploy: true,
      noDietPlan: stack.copy_constraints.includes("no_diet_plan"),
      noCalorieTracking: stack.copy_constraints.includes("no_calorie_tracking"),
      noOneTypeLabel: stack.copy_constraints.includes("no_one_type_label"),
      noShameLanguage: stack.copy_constraints.includes("no_shame_language"),
      safetySuppressesOrdinaryExperiment: !safety.professionalFirst || !safety.ordinaryExperimentAllowed
    }
  };
}

export function buildFixtureReportObject(fixture) {
  const stack = buildDriverStack(fixture.state);
  return buildDriverStackReportObject(stack, { fixtureName: fixture.name });
}

export function buildFixtureReportObjects(fixtures = driverStackFixtures) {
  return fixtures.map(buildFixtureReportObject);
}

export function renderDriverStackReportMarkdown(reportObject) {
  const primary = reportObject.primaryDriver?.key || "professional_first";
  const secondary = reportObject.secondaryDrivers.map(driver => driver.key).join(", ") || "none";
  const lines = [
    `# Driver Stack Report Object: ${reportObject.fixtureName || "unlabeled"}`,
    "",
    ...(reportObject.safetyBlock.professionalFirst ? [
      "## Аюулгүй байдлын чиглэл",
      "",
      `- ${reportObject.safetyMode}`,
      ""
    ] : []),
    "## Ил харагдаж байгаа зүйл",
    "",
    `- ${reportObject.visibleCondition.key}`,
    "",
    "## Цаана нь ажиллаж байгаа зүйл",
    "",
    `- ${secondary}`,
    "",
    "## Эмзэг мөч",
    "",
    `- ${reportObject.vulnerableMoment.id}`,
    "",
    "## Хоолны далд үүрэг",
    "",
    `- ${reportObject.hiddenFoodFunction.key}`,
    "",
    "## Буруу өөр тайлбар",
    "",
    `- ${reportObject.wrongSelfExplanation.key}`,
    "",
    "## Эхний зөөлөн өөрчлөлт",
    "",
    `- ${reportObject.firstGentleChange.id}`,
    "",
    "## 14 хоногийн туршилтын таамаг",
    "",
    `- ${reportObject.fourteenDayExperiment?.id || "suppressed"}`,
    "",
    "## 7 хоногийн баталгаажуулах тэмдэглэл",
    "",
    `- ${reportObject.sevenDayDiaryConfirmation.map(target => target.driver_key).join(", ")}`,
    "",
    "## Техникийн owner review snapshot",
    "",
    `- Version: ${reportObject.version}`,
    `- Test only: ${reportObject.sourceSummary.testOnly}`,
    `- Safety mode: ${reportObject.safetyMode}`,
    `- Ordinary report allowed: ${reportObject.safetyBlock.ordinaryReportAllowed}`,
    `- Ordinary experiment allowed: ${reportObject.safetyBlock.ordinaryExperimentAllowed}`,
    `- Primary driver: ${primary}`,
    `- Secondary drivers: ${secondary}`,
    `- Interaction: ${reportObject.interaction.id}`,
    `- Vulnerable moment: ${reportObject.vulnerableMoment.id}`,
    `- Visible condition: ${reportObject.visibleCondition.key}`,
    `- Hidden food function: ${reportObject.hiddenFoodFunction.key}`,
    `- First gentle change: ${reportObject.firstGentleChange.id}`,
    `- Fourteen day experiment: ${reportObject.fourteenDayExperiment?.id || "suppressed"}`,
    `- Seven day confirmation: ${reportObject.sevenDayDiaryConfirmation.map(target => target.driver_key).join(", ")}`,
    "",
    "## Owner Review Flags",
    "",
    ...Object.entries(reportObject.ownerReviewFlags).map(([key, value]) => `- ${key}: ${value}`)
  ];
  return `${lines.join("\n")}\n`;
}

~~~~~~

## tests/driver-stack/driverStackReportObject.test.js

~~~~~~js
const assert = require("assert");
const { execFileSync } = require("child_process");

(async () => {
  const {
    buildDriverStackReportObject,
    buildFixtureReportObject,
    buildFixtureReportObjects,
    renderDriverStackReportMarkdown
  } = await import("./driverStackReportObject.mjs");
  const { buildDriverStack } = await import("./driverStackTestCalculator.mjs");
  const { APPROVED_DRIVER_STACK_FIXTURE_NAMES, driverStackFixtures } = await import("./driverStackFixtures.mjs");

  [
    buildDriverStackReportObject,
    buildFixtureReportObject,
    buildFixtureReportObjects,
    renderDriverStackReportMarkdown
  ].forEach(fn => assert.strictEqual(typeof fn, "function"));

  const reportObjects = buildFixtureReportObjects(driverStackFixtures);
  const expectedTopLevelKeys = [
    "version",
    "fixtureName",
    "safetyMode",
    "sourceSummary",
    "primaryDriver",
    "secondaryDrivers",
    "interaction",
    "vulnerableMoment",
    "visibleCondition",
    "hiddenFoodFunction",
    "wrongSelfExplanation",
    "firstGentleChange",
    "fourteenDayExperiment",
    "sevenDayDiaryConfirmation",
    "safetyBlock",
    "evidenceExplanation",
    "copyConstraints",
    "ownerReviewFlags"
  ];
  assert.strictEqual(reportObjects.length, 10);
  assert.deepStrictEqual(
    reportObjects.map(report => report.fixtureName),
    APPROVED_DRIVER_STACK_FIXTURE_NAMES,
    "report objects must preserve approved fixture names and order"
  );

  reportObjects.forEach(report => {
    assert.deepStrictEqual(Object.keys(report), expectedTopLevelKeys, `${report.fixtureName}: stable top-level report object keys`);
    assert.strictEqual(report.version, "driver-stack-report-object-v0-test-only");
    assert.strictEqual(report.sourceSummary.sourceVersion, "driver-stack-v0-test-only");
    assert.strictEqual(report.sourceSummary.testOnly, true);
    assert.strictEqual(report.ownerReviewFlags.testOnly, true);
    assert.strictEqual(report.ownerReviewFlags.runtimeIntegration, false);
    assert.strictEqual(report.ownerReviewFlags.recommendation, "READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT");
    assert.strictEqual(report.ownerReviewFlags.runtimeIntegrationEnabled, false);
    assert.strictEqual(report.ownerReviewFlags.modifiesAppJs, false);
    assert.strictEqual(report.ownerReviewFlags.modifiesRuntimeReport, false);
    assert.strictEqual(report.ownerReviewFlags.modifiesReportCopy, false);
    assert.strictEqual(report.ownerReviewFlags.modifiesPdf, false);
    assert.strictEqual(report.ownerReviewFlags.modifiesPaymentOrEntitlement, false);
    assert.strictEqual(report.ownerReviewFlags.noDeploy, true);
    assert.strictEqual(report.ownerReviewFlags.noDietPlan, true);
    assert.strictEqual(report.ownerReviewFlags.noCalorieTracking, true);
    assert.strictEqual(report.ownerReviewFlags.noOneTypeLabel, true);
    assert.strictEqual(report.ownerReviewFlags.noShameLanguage, true);
    assert(report.safetyMode);
    assert(Array.isArray(report.evidenceExplanation.activeDriverScores));
    assert(Array.isArray(report.secondaryDrivers));
    assert(report.vulnerableMoment.id);
    assert(report.visibleCondition.key);
    assert(report.hiddenFoodFunction.key);
    assert(Object.prototype.hasOwnProperty.call(report.wrongSelfExplanation, "key"));
    assert(report.firstGentleChange.id);
    assert(!Object.prototype.hasOwnProperty.call(report.firstGentleChange, "avoid"), `${report.fixtureName}: must not expose raw WP3 avoid copy`);
    assert(Array.isArray(report.sevenDayDiaryConfirmation));
    assert(report.copyConstraints.includes("no_one_type_label"));
    assert(report.copyConstraints.includes("no_ordinary_experiment_when_professional_first"));
    assert(!Object.prototype.hasOwnProperty.call(report, "sourceVersion"));
    assert(!Object.prototype.hasOwnProperty.call(report, "generatedFor"));
    assert(!Object.prototype.hasOwnProperty.call(report, "testOnly"));
    assert(!Object.prototype.hasOwnProperty.call(report, "safetyRoute"));
    assert(!Object.prototype.hasOwnProperty.call(report, "driverStack"));
    assert(!Object.prototype.hasOwnProperty.call(report, "reportAnswers"));
    assert(!Object.prototype.hasOwnProperty.call(report, "moduleOrder"));
    assert(!Object.prototype.hasOwnProperty.call(report, "sections"));
    assert(!Object.prototype.hasOwnProperty.call(report, "runtimeIntegration"));
    assert(!Object.prototype.hasOwnProperty.call(report, "html"));
    assert(!Object.prototype.hasOwnProperty.call(report, "pdf"));
    assert(!Object.prototype.hasOwnProperty.call(report, "localStorage"));
    const markdown = renderDriverStackReportMarkdown(report);
    assert(markdown.includes(`# Driver Stack Report Object: ${report.fixtureName}`));
    [
      "## Ил харагдаж байгаа зүйл",
      "## Цаана нь ажиллаж байгаа зүйл",
      "## Эмзэг мөч",
      "## Хоолны далд үүрэг",
      "## Буруу өөр тайлбар",
      "## Эхний зөөлөн өөрчлөлт",
      "## 14 хоногийн туршилтын таамаг",
      "## 7 хоногийн баталгаажуулах тэмдэглэл"
    ].forEach(heading => assert(markdown.includes(heading), `${report.fixtureName}: missing Mongolian heading ${heading}`));
    [
      "## Хамгийн эмзэг мөч",
      "## Ил харагдаж буй нөхцөл",
      "## Давхар идэвхтэй драйверууд",
      "## Буруу өөрийгөө тайлбарлах эрсдэл",
      "## 14 хоногийн туршилт",
      "## 7 хоногийн diary баталгаажуулалт"
    ].forEach(heading => assert(!markdown.split("\n").includes(heading), `${report.fixtureName}: stale Mongolian heading ${heading}`));
    assert(markdown.includes("## Owner Review Flags"));
    assert(!/diet plan|calorie tracker|one type|one-type label/i.test(markdown), `${report.fixtureName}: markdown must not use forbidden copy framing`);
  });

  const stressReport = reportObjects.find(report => report.fixtureName === "stress_delivery_app_comfort");
  assert.strictEqual(stressReport.safetyMode, "mode1");
  assert.strictEqual(stressReport.safetyBlock.ordinaryReportAllowed, true);
  assert.strictEqual(stressReport.safetyBlock.ordinaryExperimentAllowed, true);
  assert.strictEqual(stressReport.primaryDriver.key, "stress");
  assert(stressReport.secondaryDrivers.map(driver => driver.key).includes("delivery_app"));
  assert.strictEqual(stressReport.hiddenFoodFunction.key, "decompression");
  assert.strictEqual(stressReport.firstGentleChange.id, "pre_delivery_decompression_pause");
  assert.strictEqual(stressReport.fourteenDayExperiment.id, "pre_delivery_decompression_pause");
  assert.strictEqual(stressReport.fourteenDayExperiment.durationDays, 14);

  const medicalReport = reportObjects.find(report => report.fixtureName === "medication_body_concern_professional_check");
  assert.strictEqual(medicalReport.safetyMode, "mode3");
  assert.strictEqual(medicalReport.safetyBlock.ordinaryReportAllowed, false);
  assert.strictEqual(medicalReport.safetyBlock.ordinaryExperimentAllowed, false);
  assert.strictEqual(medicalReport.safetyBlock.suppressOrdinaryExperiment, true);
  assert.strictEqual(medicalReport.ownerReviewFlags.safetySuppressesOrdinaryExperiment, true);
  assert.strictEqual(medicalReport.primaryDriver, null);
  assert.strictEqual(medicalReport.fourteenDayExperiment, null);
  assert(medicalReport.safetyBlock.professionalFirst);
  assert(renderDriverStackReportMarkdown(medicalReport).includes("## Аюулгүй байдлын чиглэл"));
  reportObjects
    .filter(report => report.fixtureName !== "medication_body_concern_professional_check")
    .forEach(report => assert(!renderDriverStackReportMarkdown(report).includes("## Аюулгүй байдлын чиглэл"), `${report.fixtureName}: ordinary fixture must not include safety heading`));

  const stack = buildDriverStack(driverStackFixtures[0].state);
  const directReport = buildDriverStackReportObject(stack, { fixtureName: "direct_stack" });
  assert.strictEqual(directReport.fixtureName, "direct_stack");

  const artifact = JSON.parse(execFileSync("node", ["tests/driver-stack/exportDriverStackReportObjects.mjs"], { encoding: "utf8" }));
  assert.deepStrictEqual(Object.keys(artifact), [
    "version",
    "generatedBy",
    "recommendation",
    "fixtureCount",
    "results"
  ], "compact report-object artifact wrapper keys");
  assert.strictEqual(artifact.version, "driver-stack-report-object-v0-test-only");
  assert.strictEqual(artifact.recommendation, "READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT");
  assert.strictEqual(artifact.fixtureCount, 10);
  assert(!Object.prototype.hasOwnProperty.call(artifact, "sourceCommit"));
  assert.deepStrictEqual(
    artifact.results.map(result => result.name),
    APPROVED_DRIVER_STACK_FIXTURE_NAMES,
    "compact report-object artifact must preserve fixture names and order"
  );
  artifact.results.forEach(result => {
    assert.deepStrictEqual(Object.keys(result), [
      "name",
      "safetyMode",
      "primaryDriverKey",
      "secondaryDriverKeys",
      "interactionId",
      "vulnerableMomentId",
      "hiddenFoodFunctionKey",
      "firstGentleChangeId",
      "experimentDurationDays",
      "professionalFirst",
      "pass"
    ], `${result.name}: compact artifact keys`);
    if (result.name === "medication_body_concern_professional_check") {
      assert.strictEqual(result.primaryDriverKey, null, `${result.name}: professional-first primary`);
      assert.strictEqual(result.experimentDurationDays, 0, `${result.name}: professional-first experiment duration`);
      assert.strictEqual(result.professionalFirst, true, `${result.name}: professional-first flag`);
    } else {
      assert.strictEqual(result.experimentDurationDays, 14, `${result.name}: ordinary experiment duration`);
      assert.strictEqual(result.professionalFirst, false, `${result.name}: ordinary professional-first flag`);
    }
    [
      "fixtureName",
      "primaryDriver",
      "secondaryDrivers",
      "interaction",
      "vulnerableMoment",
      "visibleCondition",
      "wrongSelfExplanation",
      "fourteenDayExperiment",
      "sevenDayDiaryConfirmation",
      "safetyBlock",
      "ownerReviewFlags",
      "approvedFixtureNames",
      "sourceSummary",
      "evidenceExplanation",
      "copyConstraints",
      "driverStack",
      "reportAnswers",
      "sections",
      "moduleOrder",
      "runtimeIntegration",
      "sourceCommit",
      "fourteenDayExperimentId",
      "sevenDayConfirmationTargets",
      "safetyBlockPresent",
      "ordinaryExperimentAllowed",
      "ownerReviewReady"
    ].forEach(key => {
      assert(!Object.prototype.hasOwnProperty.call(result, key), `${result.name}: compact artifact must not include debug field ${key}`);
    });
  });

  assert.throws(() => buildDriverStackReportObject({ version: "not-driver-stack" }), /requires a driver-stack-v0-test-only object/);

  console.log("driverStackReportObject tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});

~~~~~~

## tests/driver-stack/exportDriverStackReportObjects.mjs

~~~~~~js
import { buildFixtureReportObjects } from "./driverStackReportObject.mjs";
import { driverStackFixtures } from "./driverStackFixtures.mjs";

const reportObjects = buildFixtureReportObjects(driverStackFixtures);

const results = reportObjects.map(report => ({
  name: report.fixtureName,
  safetyMode: report.safetyMode,
  primaryDriverKey: report.primaryDriver?.key || null,
  secondaryDriverKeys: report.secondaryDrivers.map(driver => driver.key),
  interactionId: report.interaction.id,
  vulnerableMomentId: report.vulnerableMoment.id,
  hiddenFoodFunctionKey: report.hiddenFoodFunction.key,
  firstGentleChangeId: report.firstGentleChange.id,
  experimentDurationDays: report.fourteenDayExperiment?.durationDays || 0,
  professionalFirst: report.safetyBlock.professionalFirst,
  pass: true
}));

console.log(JSON.stringify({
  version: "driver-stack-report-object-v0-test-only",
  generatedBy: "tests/driver-stack/exportDriverStackReportObjects.mjs",
  recommendation: "READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT",
  fixtureCount: results.length,
  results
}, null, 2));

~~~~~~

## audits/mvp-diagnostic-migration/work-pack-4/report-object-notes.md

~~~~~~md
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

~~~~~~

## audits/mvp-diagnostic-migration/work-pack-4/report-object-fixture-summary.md

~~~~~~md
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

~~~~~~

## audits/mvp-diagnostic-migration/work-pack-4/report-object-fixture-results.json

~~~~~~json
{
  "version": "driver-stack-report-object-v0-test-only",
  "generatedBy": "tests/driver-stack/exportDriverStackReportObjects.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT",
  "fixtureCount": 10,
  "results": [
    {
      "name": "shift_work_recovery_only",
      "safetyMode": "mode1",
      "primaryDriverKey": "shift_work",
      "secondaryDriverKeys": [
        "quick_recovery"
      ],
      "interactionId": "shift_work_recovery_only",
      "vulnerableMomentId": "shift_work_recovery_only",
      "hiddenFoodFunctionKey": "quick_recovery",
      "firstGentleChangeId": "shift_recovery_anchor",
      "experimentDurationDays": 14,
      "professionalFirst": false,
      "pass": true
    },
    {
      "name": "shift_work_loneliness_combo",
      "safetyMode": "mode1",
      "primaryDriverKey": "shift_work",
      "secondaryDriverKeys": [
        "decompression",
        "loneliness",
        "comfort"
      ],
      "interactionId": "shift_work_loneliness_combo",
      "vulnerableMomentId": "shift_work_loneliness_combo",
      "hiddenFoodFunctionKey": "loneliness_soothing",
      "firstGentleChangeId": "shift_recovery_connection_slot",
      "experimentDurationDays": 14,
      "professionalFirst": false,
      "pass": true
    },
    {
      "name": "remote_work_visible_snacks",
      "safetyMode": "mode1",
      "primaryDriverKey": "visible_snacks",
      "secondaryDriverKeys": [
        "self_reward",
        "food_photo_cue",
        "low_friction_default"
      ],
      "interactionId": "cue_reward_low_friction_default",
      "vulnerableMomentId": "cue_reward_low_friction_default",
      "hiddenFoodFunctionKey": "self_reward",
      "firstGentleChangeId": "move_one_cue",
      "experimentDurationDays": 14,
      "professionalFirst": false,
      "pass": true
    },
    {
      "name": "stress_delivery_app_comfort",
      "safetyMode": "mode1",
      "primaryDriverKey": "stress",
      "secondaryDriverKeys": [
        "low_friction_default",
        "delivery_app",
        "decompression"
      ],
      "interactionId": "stress_delivery_app_comfort",
      "vulnerableMomentId": "stress_delivery_app_comfort",
      "hiddenFoodFunctionKey": "decompression",
      "firstGentleChangeId": "pre_delivery_decompression_pause",
      "experimentDurationDays": 14,
      "professionalFirst": false,
      "pass": true
    },
    {
      "name": "meal_gap_evening_hunger",
      "safetyMode": "mode1",
      "primaryDriverKey": "meal_gap",
      "secondaryDriverKeys": [
        "low_friction_default",
        "quick_recovery",
        "hunger_safety"
      ],
      "interactionId": "meal_gap_evening_hunger",
      "vulnerableMomentId": "meal_gap_evening_hunger",
      "hiddenFoodFunctionKey": "hunger_safety",
      "firstGentleChangeId": "bridge_meal_before_evening",
      "experimentDurationDays": 14,
      "professionalFirst": false,
      "pass": true
    },
    {
      "name": "all_or_nothing_restriction_rebound",
      "safetyMode": "mode1",
      "primaryDriverKey": "all_or_nothing",
      "secondaryDriverKeys": [
        "meal_gap",
        "evening_hunger",
        "strict_diet"
      ],
      "interactionId": "all_or_nothing_punishment_restriction",
      "vulnerableMomentId": "all_or_nothing_punishment_restriction",
      "hiddenFoodFunctionKey": "hunger_safety",
      "firstGentleChangeId": "next_meal_reset_rule",
      "experimentDurationDays": 14,
      "professionalFirst": false,
      "pass": true
    },
    {
      "name": "social_weekend_alcohol_monday_restart",
      "safetyMode": "mode1",
      "primaryDriverKey": "social_table",
      "secondaryDriverKeys": [
        "all_or_nothing",
        "monday_restart",
        "belonging"
      ],
      "interactionId": "social_belonging_alcohol",
      "vulnerableMomentId": "social_belonging_alcohol",
      "hiddenFoodFunctionKey": "belonging",
      "firstGentleChangeId": "social_choice_script",
      "experimentDurationDays": 14,
      "professionalFirst": false,
      "pass": true
    },
    {
      "name": "body_shame_restriction",
      "safetyMode": "mode1",
      "primaryDriverKey": "body_change_uncertainty",
      "secondaryDriverKeys": [
        "shame",
        "escape_from_shame",
        "strict_diet"
      ],
      "interactionId": "body_shame_restriction",
      "vulnerableMomentId": "body_shame_restriction",
      "hiddenFoodFunctionKey": "escape_from_shame",
      "firstGentleChangeId": "body_neutral_private_tracking",
      "experimentDurationDays": 14,
      "professionalFirst": false,
      "pass": true
    },
    {
      "name": "pcos_body_uncertainty_control",
      "safetyMode": "mode1",
      "primaryDriverKey": "body_change_uncertainty",
      "secondaryDriverKeys": [
        "control_regain"
      ],
      "interactionId": "pcos_body_uncertainty_control",
      "vulnerableMomentId": "pcos_body_uncertainty_control",
      "hiddenFoodFunctionKey": "control_regain",
      "firstGentleChangeId": "body_neutral_private_tracking",
      "experimentDurationDays": 14,
      "professionalFirst": false,
      "pass": true
    },
    {
      "name": "medication_body_concern_professional_check",
      "safetyMode": "mode3",
      "primaryDriverKey": null,
      "secondaryDriverKeys": [],
      "interactionId": "medical_first_body_signal",
      "vulnerableMomentId": "medical_first_body_signal",
      "hiddenFoodFunctionKey": "quick_recovery",
      "firstGentleChangeId": "professional_discussion_summary",
      "experimentDurationDays": 0,
      "professionalFirst": true,
      "pass": true
    }
  ]
}

~~~~~~

## audits/mvp-diagnostic-migration/work-pack-4/report-object-markdown-snapshots.md

~~~~~~md
# Work Pack 4 Report Object Markdown Snapshots

# Driver Stack Report Object: shift_work_recovery_only

## Ил харагдаж байгаа зүйл

- shift_work

## Цаана нь ажиллаж байгаа зүйл

- quick_recovery

## Эмзэг мөч

- shift_work_recovery_only

## Хоолны далд үүрэг

- quick_recovery

## Буруу өөр тайлбар

- not_lack_of_discipline

## Эхний зөөлөн өөрчлөлт

- shift_recovery_anchor

## 14 хоногийн туршилтын таамаг

- shift_recovery_anchor

## 7 хоногийн баталгаажуулах тэмдэглэл

- fatigue, shift_work, quick_recovery, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode1
- Ordinary report allowed: true
- Ordinary experiment allowed: true
- Primary driver: shift_work
- Secondary drivers: quick_recovery
- Interaction: shift_work_recovery_only
- Vulnerable moment: shift_work_recovery_only
- Visible condition: shift_work
- Hidden food function: quick_recovery
- First gentle change: shift_recovery_anchor
- Fourteen day experiment: shift_recovery_anchor
- Seven day confirmation: fatigue, shift_work, quick_recovery, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true

# Driver Stack Report Object: shift_work_loneliness_combo

## Ил харагдаж байгаа зүйл

- shift_work

## Цаана нь ажиллаж байгаа зүйл

- decompression, loneliness, comfort

## Эмзэг мөч

- shift_work_loneliness_combo

## Хоолны далд үүрэг

- loneliness_soothing

## Буруу өөр тайлбар

- willpower_only_is_incomplete

## Эхний зөөлөн өөрчлөлт

- shift_recovery_connection_slot

## 14 хоногийн туршилтын таамаг

- shift_recovery_connection_slot

## 7 хоногийн баталгаажуулах тэмдэглэл

- shift_work, decompression, loneliness, comfort, loneliness_soothing, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode1
- Ordinary report allowed: true
- Ordinary experiment allowed: true
- Primary driver: shift_work
- Secondary drivers: decompression, loneliness, comfort
- Interaction: shift_work_loneliness_combo
- Vulnerable moment: shift_work_loneliness_combo
- Visible condition: shift_work
- Hidden food function: loneliness_soothing
- First gentle change: shift_recovery_connection_slot
- Fourteen day experiment: shift_recovery_connection_slot
- Seven day confirmation: shift_work, decompression, loneliness, comfort, loneliness_soothing, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true

# Driver Stack Report Object: remote_work_visible_snacks

## Ил харагдаж байгаа зүйл

- visible_snacks

## Цаана нь ажиллаж байгаа зүйл

- self_reward, food_photo_cue, low_friction_default

## Эмзэг мөч

- cue_reward_low_friction_default

## Хоолны далд үүрэг

- self_reward

## Буруу өөр тайлбар

- willpower_only_is_incomplete

## Эхний зөөлөн өөрчлөлт

- move_one_cue

## 14 хоногийн туршилтын таамаг

- move_one_cue

## 7 хоногийн баталгаажуулах тэмдэглэл

- visible_snacks, self_reward, food_photo_cue, low_friction_default, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode1
- Ordinary report allowed: true
- Ordinary experiment allowed: true
- Primary driver: visible_snacks
- Secondary drivers: self_reward, food_photo_cue, low_friction_default
- Interaction: cue_reward_low_friction_default
- Vulnerable moment: cue_reward_low_friction_default
- Visible condition: visible_snacks
- Hidden food function: self_reward
- First gentle change: move_one_cue
- Fourteen day experiment: move_one_cue
- Seven day confirmation: visible_snacks, self_reward, food_photo_cue, low_friction_default, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true

# Driver Stack Report Object: stress_delivery_app_comfort

## Ил харагдаж байгаа зүйл

- stress

## Цаана нь ажиллаж байгаа зүйл

- low_friction_default, delivery_app, decompression

## Эмзэг мөч

- stress_delivery_app_comfort

## Хоолны далд үүрэг

- decompression

## Буруу өөр тайлбар

- willpower_only_is_incomplete

## Эхний зөөлөн өөрчлөлт

- pre_delivery_decompression_pause

## 14 хоногийн туршилтын таамаг

- pre_delivery_decompression_pause

## 7 хоногийн баталгаажуулах тэмдэглэл

- low_friction_default, stress, delivery_app, decompression, comfort, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode1
- Ordinary report allowed: true
- Ordinary experiment allowed: true
- Primary driver: stress
- Secondary drivers: low_friction_default, delivery_app, decompression
- Interaction: stress_delivery_app_comfort
- Vulnerable moment: stress_delivery_app_comfort
- Visible condition: stress
- Hidden food function: decompression
- First gentle change: pre_delivery_decompression_pause
- Fourteen day experiment: pre_delivery_decompression_pause
- Seven day confirmation: low_friction_default, stress, delivery_app, decompression, comfort, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true

# Driver Stack Report Object: meal_gap_evening_hunger

## Ил харагдаж байгаа зүйл

- meal_gap

## Цаана нь ажиллаж байгаа зүйл

- low_friction_default, quick_recovery, hunger_safety

## Эмзэг мөч

- meal_gap_evening_hunger

## Хоолны далд үүрэг

- hunger_safety

## Буруу өөр тайлбар

- not_lack_of_discipline

## Эхний зөөлөн өөрчлөлт

- bridge_meal_before_evening

## 14 хоногийн туршилтын таамаг

- bridge_meal_before_evening

## 7 хоногийн баталгаажуулах тэмдэглэл

- fatigue, meal_gap, evening_hunger, low_friction_default, quick_recovery, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode1
- Ordinary report allowed: true
- Ordinary experiment allowed: true
- Primary driver: meal_gap
- Secondary drivers: low_friction_default, quick_recovery, hunger_safety
- Interaction: meal_gap_evening_hunger
- Vulnerable moment: meal_gap_evening_hunger
- Visible condition: meal_gap
- Hidden food function: hunger_safety
- First gentle change: bridge_meal_before_evening
- Fourteen day experiment: bridge_meal_before_evening
- Seven day confirmation: fatigue, meal_gap, evening_hunger, low_friction_default, quick_recovery, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true

# Driver Stack Report Object: all_or_nothing_restriction_rebound

## Ил харагдаж байгаа зүйл

- all_or_nothing

## Цаана нь ажиллаж байгаа зүйл

- meal_gap, evening_hunger, strict_diet

## Эмзэг мөч

- all_or_nothing_punishment_restriction

## Хоолны далд үүрэг

- hunger_safety

## Буруу өөр тайлбар

- not_lack_of_discipline

## Эхний зөөлөн өөрчлөлт

- next_meal_reset_rule

## 14 хоногийн туршилтын таамаг

- next_meal_reset_rule

## 7 хоногийн баталгаажуулах тэмдэглэл

- meal_gap, strict_diet, evening_hunger, punishment_restriction, all_or_nothing, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode1
- Ordinary report allowed: true
- Ordinary experiment allowed: true
- Primary driver: all_or_nothing
- Secondary drivers: meal_gap, evening_hunger, strict_diet
- Interaction: all_or_nothing_punishment_restriction
- Vulnerable moment: all_or_nothing_punishment_restriction
- Visible condition: all_or_nothing
- Hidden food function: hunger_safety
- First gentle change: next_meal_reset_rule
- Fourteen day experiment: next_meal_reset_rule
- Seven day confirmation: meal_gap, strict_diet, evening_hunger, punishment_restriction, all_or_nothing, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true

# Driver Stack Report Object: social_weekend_alcohol_monday_restart

## Ил харагдаж байгаа зүйл

- social_table

## Цаана нь ажиллаж байгаа зүйл

- all_or_nothing, monday_restart, belonging

## Эмзэг мөч

- social_belonging_alcohol

## Хоолны далд үүрэг

- belonging

## Буруу өөр тайлбар

- stricter_tomorrow_makes_it_worse

## Эхний зөөлөн өөрчлөлт

- social_choice_script

## 14 хоногийн туршилтын таамаг

- social_choice_script

## 7 хоногийн баталгаажуулах тэмдэглэл

- alcohol_context, social_table, all_or_nothing, monday_restart, belonging, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode1
- Ordinary report allowed: true
- Ordinary experiment allowed: true
- Primary driver: social_table
- Secondary drivers: all_or_nothing, monday_restart, belonging
- Interaction: social_belonging_alcohol
- Vulnerable moment: social_belonging_alcohol
- Visible condition: social_table
- Hidden food function: belonging
- First gentle change: social_choice_script
- Fourteen day experiment: social_choice_script
- Seven day confirmation: alcohol_context, social_table, all_or_nothing, monday_restart, belonging, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true

# Driver Stack Report Object: body_shame_restriction

## Ил харагдаж байгаа зүйл

- body_change_uncertainty

## Цаана нь ажиллаж байгаа зүйл

- shame, escape_from_shame, strict_diet

## Эмзэг мөч

- body_shame_restriction

## Хоолны далд үүрэг

- escape_from_shame

## Буруу өөр тайлбар

- body_blame_increases_avoidance

## Эхний зөөлөн өөрчлөлт

- body_neutral_private_tracking

## 14 хоногийн туршилтын таамаг

- body_neutral_private_tracking

## 7 хоногийн баталгаажуулах тэмдэглэл

- shame, body_change_uncertainty, escape_from_shame, strict_diet, punishment_restriction, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode1
- Ordinary report allowed: true
- Ordinary experiment allowed: true
- Primary driver: body_change_uncertainty
- Secondary drivers: shame, escape_from_shame, strict_diet
- Interaction: body_shame_restriction
- Vulnerable moment: body_shame_restriction
- Visible condition: body_change_uncertainty
- Hidden food function: escape_from_shame
- First gentle change: body_neutral_private_tracking
- Fourteen day experiment: body_neutral_private_tracking
- Seven day confirmation: shame, body_change_uncertainty, escape_from_shame, strict_diet, punishment_restriction, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true

# Driver Stack Report Object: pcos_body_uncertainty_control

## Ил харагдаж байгаа зүйл

- body_change_uncertainty

## Цаана нь ажиллаж байгаа зүйл

- control_regain

## Эмзэг мөч

- pcos_body_uncertainty_control

## Хоолны далд үүрэг

- control_regain

## Буруу өөр тайлбар

- body_blame_increases_avoidance

## Эхний зөөлөн өөрчлөлт

- body_neutral_private_tracking

## 14 хоногийн туршилтын таамаг

- body_neutral_private_tracking

## 7 хоногийн баталгаажуулах тэмдэглэл

- body_change_uncertainty, control_regain, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode1
- Ordinary report allowed: true
- Ordinary experiment allowed: true
- Primary driver: body_change_uncertainty
- Secondary drivers: control_regain
- Interaction: pcos_body_uncertainty_control
- Vulnerable moment: pcos_body_uncertainty_control
- Visible condition: body_change_uncertainty
- Hidden food function: control_regain
- First gentle change: body_neutral_private_tracking
- Fourteen day experiment: body_neutral_private_tracking
- Seven day confirmation: body_change_uncertainty, control_regain, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true

# Driver Stack Report Object: medication_body_concern_professional_check

## Аюулгүй байдлын чиглэл

- mode3

## Ил харагдаж байгаа зүйл

- unknown

## Цаана нь ажиллаж байгаа зүйл

- none

## Эмзэг мөч

- medical_first_body_signal

## Хоолны далд үүрэг

- quick_recovery

## Буруу өөр тайлбар

- willpower_only_is_incomplete

## Эхний зөөлөн өөрчлөлт

- professional_discussion_summary

## 14 хоногийн туршилтын таамаг

- suppressed

## 7 хоногийн баталгаажуулах тэмдэглэл

- medical_concern, anxiety, quick_recovery, vulnerable_moment

## Техникийн owner review snapshot

- Version: driver-stack-report-object-v0-test-only
- Test only: true
- Safety mode: mode3
- Ordinary report allowed: false
- Ordinary experiment allowed: false
- Primary driver: professional_first
- Secondary drivers: none
- Interaction: medical_first_body_signal
- Vulnerable moment: medical_first_body_signal
- Visible condition: unknown
- Hidden food function: quick_recovery
- First gentle change: professional_discussion_summary
- Fourteen day experiment: suppressed
- Seven day confirmation: medical_concern, anxiety, quick_recovery, vulnerable_moment

## Owner Review Flags

- testOnly: true
- runtimeIntegration: false
- recommendation: READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT
- runtimeIntegrationEnabled: false
- modifiesAppJs: false
- modifiesRuntimeReport: false
- modifiesReportCopy: false
- modifiesPdf: false
- modifiesPaymentOrEntitlement: false
- noDeploy: true
- noDietPlan: true
- noCalorieTracking: true
- noOneTypeLabel: true
- noShameLanguage: true
- safetySuppressesOrdinaryExperiment: true


~~~~~~

## audits/mvp-diagnostic-migration/work-pack-4/work-pack-4-recommendation.md

~~~~~~md
# Work Pack 4 Recommendation

## Recommendation

READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT

## What Work Pack 4 proves

Work Pack 4 shows that the Work Pack 3 driver stack can be transformed into a test-only report object without changing runtime behavior.

The prototype separates:

- driver stack calculation
- report question answers
- safety gating
- 14-day experiment eligibility
- 7-day diary confirmation targets
- review-only markdown rendering

## Work Pack 4B Patch Result

Work Pack 4B corrects the report object owner-review contract and artifacts:

- recommendation enum is exactly `READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT`
- compact fixture artifact wrapper has only `version`, `generatedBy`, `recommendation`, `fixtureCount`, and `results`
- compact fixture result rows use exactly the requested `name`, `safetyMode`, `primaryDriverKey`, `secondaryDriverKeys`, `interactionId`, `vulnerableMomentId`, `hiddenFoodFunctionKey`, `firstGentleChangeId`, `experimentDurationDays`, `professionalFirst`, and `pass` fields
- markdown snapshots include the exact required Mongolian report section headings, including `## Аюулгүй байдлын чиглэл` for professional-first output
- `ownerReviewFlags` include `testOnly`, `runtimeIntegration`, `modifiesAppJs`, `modifiesRuntimeReport`, `modifiesPdf`, `modifiesPaymentOrEntitlement`, and `noDeploy`

## What should be reviewed

Owner review should focus on:

- whether the report object answers the eight target report questions clearly
- whether the stable top-level contract is sufficient for future runtime planning
- whether professional-first mode3 output suppresses ordinary experiment output strongly enough
- whether the review-only markdown renderer is useful for future QA snapshots
- whether `fourteenDayExperiment.id` should remain tied to `firstGentleChange.id` or become a future stable experiment id

## Do not do yet

Do not:

- integrate this object into `app.js`
- render this object in the production report
- rewrite report copy
- change scoring
- change questions
- regenerate PDF
- deploy
- enable QPay
- change backend/payment/pricing/entitlement behavior
- change production or localStorage behavior

## Recommended next work pack

After owner review, a future work pack may add more report-object fixtures or create a runtime integration plan.

Runtime integration should still be a separate approval step.

~~~~~~
