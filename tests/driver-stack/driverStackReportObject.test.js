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
