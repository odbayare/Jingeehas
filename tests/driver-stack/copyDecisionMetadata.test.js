const assert = require("assert");
const { execFileSync } = require("child_process");

(async () => {
  const {
    buildCopyDecisionMetadata,
    buildFixtureCopyDecisionMetadata,
    buildFixtureCopyDecisionMetadataList,
    isCopyDecisionFixture
  } = await import("./copyDecisionMetadata.mjs");
  const { buildFixtureReportObject } = await import("./driverStackReportObject.mjs");
  const { driverStackFixtures } = await import("./driverStackFixtures.mjs");
  const staleHungerReboundFlag = ["hunger", "only", "underexplains", "rebound"].join("_");
  const stalePaymentSafetyFlag = ["must", "not", "block", "safety", "behind", "payment"].join("_");

  [
    buildCopyDecisionMetadata,
    buildFixtureCopyDecisionMetadata,
    buildFixtureCopyDecisionMetadataList,
    isCopyDecisionFixture
  ].forEach(fn => assert.strictEqual(typeof fn, "function"));

  assert.strictEqual(isCopyDecisionFixture("all_or_nothing_restriction_rebound"), true);
  assert.strictEqual(isCopyDecisionFixture("pcos_body_uncertainty_control"), true);
  assert.strictEqual(isCopyDecisionFixture("meal_gap_evening_hunger"), false);

  const metadataList = buildFixtureCopyDecisionMetadataList(driverStackFixtures);
  assert.strictEqual(metadataList.length, 2);
  metadataList.forEach(metadata => {
    assert.deepStrictEqual(Object.keys(metadata), [
      "version",
      "fixtureName",
      "decisionStatus",
      "safetyMode",
      "hiddenFoodFunctionKey",
      "supplementaryNarrative",
      "softMedicalContextBridge",
      "copyRiskFlags",
      "structureDecisionNotes",
      "runtimeGate",
      "pass"
    ]);
    assert.strictEqual(metadata.version, "copy-decision-metadata-v0-test-only");
    assert.strictEqual(metadata.pass, true);
    assert.strictEqual(metadata.runtimeGate.canRenderInRuntime, false, `${metadata.fixtureName}: runtime must remain gated`);
    assert(Array.isArray(metadata.runtimeGate.requiredBeforeRuntime));
    assert(metadata.runtimeGate.requiredBeforeRuntime.length > 0);
    assert(metadata.copyRiskFlags.includes("internal_key_leak_risk"), `${metadata.fixtureName}: internal key risk must be explicit`);
    assert.strictEqual(metadata.decisionStatus, "owner_recommended");
    assert(!Object.prototype.hasOwnProperty.call(metadata, "testOnly"));
    assert(!Object.prototype.hasOwnProperty.call(metadata, "source"));
    assert(!Object.prototype.hasOwnProperty.call(metadata, "runtimeIntegrationEnabled"));
    assert(!Object.prototype.hasOwnProperty.call(metadata, "html"));
    assert(!Object.prototype.hasOwnProperty.call(metadata, "pdf"));
    assert(!Object.prototype.hasOwnProperty.call(metadata, "localStorage"));
    assert(!Object.prototype.hasOwnProperty.call(metadata, "appJs"));
  });

  const decisionMetadata = metadataList.filter(metadata => metadata.decisionStatus === "owner_recommended");
  assert.deepStrictEqual(decisionMetadata.map(metadata => metadata.fixtureName), [
    "all_or_nothing_restriction_rebound",
    "pcos_body_uncertainty_control"
  ]);

  const allOrNothing = metadataList.find(metadata => metadata.fixtureName === "all_or_nothing_restriction_rebound");
  assert.strictEqual(allOrNothing.decisionStatus, "owner_recommended");
  assert.strictEqual(allOrNothing.hiddenFoodFunctionKey, "hunger_safety");
  assert.strictEqual(allOrNothing.safetyMode, "mode1");
  assert.strictEqual(allOrNothing.supplementaryNarrative.id, "restriction_rebound_relief");
  assert.strictEqual(allOrNothing.supplementaryNarrative.requiredInUserCopy, true);
  assert.strictEqual(allOrNothing.softMedicalContextBridge, null);
  assert(allOrNothing.copyRiskFlags.includes("restriction_rebound_shame_risk"));
  assert(allOrNothing.copyRiskFlags.includes("hunger_safety_underexplains_rebound"));
  assert(allOrNothing.copyRiskFlags.includes("punishment_restart_pressure"));
  assert(!allOrNothing.copyRiskFlags.includes(staleHungerReboundFlag));

  const pcos = metadataList.find(metadata => metadata.fixtureName === "pcos_body_uncertainty_control");
  assert.strictEqual(pcos.decisionStatus, "owner_recommended");
  assert.strictEqual(pcos.safetyMode, "mode1");
  assert.strictEqual(pcos.hiddenFoodFunctionKey, "control_regain");
  assert.strictEqual(pcos.supplementaryNarrative, null);
  assert.strictEqual(pcos.softMedicalContextBridge.id, "body_uncertainty_soft_medical_context");
  assert.strictEqual(pcos.softMedicalContextBridge.doesNotChangeSafetyMode, true);
  assert.strictEqual(pcos.softMedicalContextBridge.suppressesOrdinaryExperiment, false);
  assert(pcos.softMedicalContextBridge.requiredLanguage.includes("Энэ нь онош биш."));
  assert(pcos.softMedicalContextBridge.requiredLanguage.includes("тодруулах хэрэгтэй байж магадгүй"));
  assert(pcos.copyRiskFlags.includes("medical_cause_implication_risk"));
  assert(pcos.copyRiskFlags.includes("payment_blocking_safety_risk"));
  assert(!pcos.copyRiskFlags.includes(stalePaymentSafetyFlag));

  const mealGapFixture = driverStackFixtures.find(fixture => fixture.name === "meal_gap_evening_hunger");
  const mealGap = buildFixtureCopyDecisionMetadata(mealGapFixture);
  assert.strictEqual(mealGap, null);
  const professionalFirstFixture = driverStackFixtures.find(fixture => fixture.name === "medication_body_concern_professional_check");
  const professionalFirst = buildFixtureCopyDecisionMetadata(professionalFirstFixture);
  assert.strictEqual(professionalFirst, null);

  const reportObject = buildFixtureReportObject(driverStackFixtures.find(fixture => fixture.name === "all_or_nothing_restriction_rebound"));
  const directMetadata = buildCopyDecisionMetadata(reportObject);
  assert.strictEqual(directMetadata.supplementaryNarrative.id, "restriction_rebound_relief");
  const ordinaryReportObject = buildFixtureReportObject(mealGapFixture);
  assert.strictEqual(buildCopyDecisionMetadata(ordinaryReportObject), null);
  const professionalFirstReportObject = buildFixtureReportObject(professionalFirstFixture);
  assert.strictEqual(buildCopyDecisionMetadata(professionalFirstReportObject), null);

  const artifact = JSON.parse(execFileSync("node", ["tests/driver-stack/exportCopyDecisionMetadata.mjs"], { encoding: "utf8" }));
  assert.deepStrictEqual(Object.keys(artifact), [
    "version",
    "generatedBy",
    "recommendation",
    "fixtureCount",
    "results"
  ]);
  assert.strictEqual(artifact.version, "copy-decision-metadata-v0-test-only");
  assert.strictEqual(artifact.generatedBy, "tests/driver-stack/exportCopyDecisionMetadata.mjs");
  assert.strictEqual(artifact.recommendation, "READY FOR OWNER REVIEW OF TEST-ONLY COPY DECISION METADATA");
  assert.strictEqual(artifact.fixtureCount, 2);
  assert.deepStrictEqual(artifact.results.map(result => result.fixtureName), [
    "all_or_nothing_restriction_rebound",
    "pcos_body_uncertainty_control"
  ]);
  artifact.results.forEach(result => {
    assert.deepStrictEqual(Object.keys(result), [
      "version",
      "fixtureName",
      "decisionStatus",
      "safetyMode",
      "hiddenFoodFunctionKey",
      "supplementaryNarrative",
      "softMedicalContextBridge",
      "copyRiskFlags",
      "structureDecisionNotes",
      "runtimeGate",
      "pass"
    ]);
    assert.strictEqual(result.decisionStatus, "owner_recommended");
    assert.strictEqual(result.runtimeGate.canRenderInRuntime, false);
    assert.strictEqual(result.pass, true);
  });

  assert.throws(() => buildCopyDecisionMetadata({ version: "not-report-object" }), /requires a driver-stack-report-object-v0-test-only object/);

  console.log("copyDecisionMetadata tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
