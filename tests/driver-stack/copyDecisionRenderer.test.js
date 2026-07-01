const assert = require("assert");
const { execFileSync } = require("child_process");

(async () => {
  const {
    renderCopyDecisionSections,
    renderFixtureCopyDecisionSections,
    renderFixtureCopyDecisionSectionList,
    collectUserFacingText,
    hasInternalKeyLeak
  } = await import("./copyDecisionRenderer.mjs");
  const { buildFixtureCopyDecisionMetadata } = await import("./copyDecisionMetadata.mjs");
  const { driverStackFixtures } = await import("./driverStackFixtures.mjs");

  [
    renderCopyDecisionSections,
    renderFixtureCopyDecisionSections,
    renderFixtureCopyDecisionSectionList,
    collectUserFacingText,
    hasInternalKeyLeak
  ].forEach(fn => assert.strictEqual(typeof fn, "function"));

  assert.strictEqual(renderCopyDecisionSections(null), null);
  assert.throws(
    () => renderCopyDecisionSections({ version: "not-copy-decision-metadata-v0-test-only" }),
    /requires copy-decision-metadata-v0-test-only metadata/
  );

  const renderings = renderFixtureCopyDecisionSectionList(driverStackFixtures);
  assert.strictEqual(renderings.length, 2);
  assert.deepStrictEqual(renderings.map(rendering => rendering.fixtureName), [
    "all_or_nothing_restriction_rebound",
    "pcos_body_uncertainty_control"
  ]);

  renderings.forEach(rendering => {
    assert.deepStrictEqual(Object.keys(rendering), [
      "version",
      "fixtureName",
      "decisionStatus",
      "safetyMode",
      "rendererMode",
      "sections",
      "fullUserFacingText",
      "qualityChecks",
      "runtimeGate",
      "pass"
    ]);
    assert.strictEqual(rendering.version, "copy-decision-rendering-v0-test-only");
    assert.strictEqual(rendering.decisionStatus, "owner_recommended");
    assert.strictEqual(rendering.rendererMode, "test_only");
    assert.strictEqual(rendering.runtimeGate.canRenderInRuntime, false);
    assert.strictEqual(rendering.pass, true);
    assert(Array.isArray(rendering.sections));
    assert.strictEqual(rendering.sections.length, 5);
    rendering.sections.forEach(section => {
      assert.deepStrictEqual(Object.keys(section), ["title", "body"]);
      assert.strictEqual(typeof section.title, "string");
      assert.strictEqual(typeof section.body, "string");
      assert(section.body.length > 20);
    });
    assert.deepStrictEqual(Object.keys(rendering.qualityChecks), [
      "internalKeyLeak",
      "shameLanguage",
      "medicalCauseClaim",
      "diagnosisClaim",
      "treatmentAdvice",
      "runtimeGateRespected",
      "experimentIsObservation",
      "diaryIsObservation"
    ]);
    assert.strictEqual(rendering.qualityChecks.internalKeyLeak, false);
    assert.strictEqual(rendering.qualityChecks.shameLanguage, false);
    assert.strictEqual(rendering.qualityChecks.medicalCauseClaim, false);
    assert.strictEqual(rendering.qualityChecks.diagnosisClaim, false);
    assert.strictEqual(rendering.qualityChecks.treatmentAdvice, false);
    assert.strictEqual(rendering.qualityChecks.runtimeGateRespected, true);
    assert.strictEqual(rendering.qualityChecks.experimentIsObservation, true);
    assert.strictEqual(rendering.qualityChecks.diaryIsObservation, true);
    assert.strictEqual(rendering.runtimeGate.canRenderInRuntime, false);
    assert.strictEqual(rendering.sections.length, 5);
    const userFacingText = collectUserFacingText(rendering);
    assert.strictEqual(userFacingText, rendering.fullUserFacingText);
    assert(userFacingText.length > 100);
    assert.strictEqual(hasInternalKeyLeak(userFacingText), false, `${rendering.fixtureName}: user-facing copy leaked an internal key`);
    [
      "hunger_safety",
      "restriction_rebound_relief",
      "control_regain",
      "body_uncertainty_soft_medical_context",
      "owner_recommended",
      "test_only",
      "mode1",
      "runtimeGate"
    ].forEach(forbidden => {
      assert(!userFacingText.includes(forbidden), `${rendering.fixtureName}: leaked ${forbidden}`);
    });
  });

  const allOrNothing = renderings.find(rendering => rendering.fixtureName === "all_or_nothing_restriction_rebound");
  const allOrNothingText = collectUserFacingText(allOrNothing);
  assert(allOrNothingText.includes("удаан хорьсон хэмнэл аюулгүй хооллох дохио"));
  assert(allOrNothingText.includes("Энд зөвхөн өлсөлт биш"));
  assert(allOrNothingText.includes("аль хэдийн алдсан"));
  assert(allOrNothingText.includes("Дахин эхлэх дарамт"));
  assert(allOrNothingText.includes("шийтгэхгүйгээр"));
  assert(allOrNothingText.includes("7 хоногийн баталгаажуулах тэмдэглэл"));
  assert(allOrNothingText.includes("өөрийгөө шүүхэд биш"));
  assert(!allOrNothingText.includes("сул дорой"));
  assert(!allOrNothingText.includes("хатуу дэглэм"));
  assert(!allOrNothingText.includes("маргааш нөх"));

  const pcos = renderings.find(rendering => rendering.fixtureName === "pcos_body_uncertainty_control");
  const pcosText = collectUserFacingText(pcos);
  assert.strictEqual(pcos.safetyMode, "mode1");
  assert(pcosText.includes("Энэ нь онош биш."));
  assert(pcosText.includes("тодорхойгүй байдал"));
  assert(pcosText.includes("тодруулах хэрэгтэй байж магадгүй"));
  assert(pcosText.includes("биеийг шүүхгүйгээр"));
  assert(pcosText.includes("7 хоногийн баталгаажуулах тэмдэглэл"));
  assert(pcosText.includes("өөрөө оношлохын оронд"));
  assert(!pcosText.includes("PCOS"));
  assert(!pcosText.includes("даавраас болсон"));
  assert(!pcosText.includes("эмнээс болсон"));
  assert(!pcosText.includes("глюкозоос болсон"));
  assert(!pcosText.includes("оношилгоо"));
  assert(!pcosText.includes("эмчилгээ"));

  const mealGapFixture = driverStackFixtures.find(fixture => fixture.name === "meal_gap_evening_hunger");
  assert.strictEqual(renderFixtureCopyDecisionSections(mealGapFixture), null);
  const professionalFirstFixture = driverStackFixtures.find(fixture => fixture.name === "medication_body_concern_professional_check");
  assert.strictEqual(renderFixtureCopyDecisionSections(professionalFirstFixture), null);

  const professionalFirstMetadata = buildFixtureCopyDecisionMetadata(professionalFirstFixture);
  assert.strictEqual(renderCopyDecisionSections(professionalFirstMetadata), null);
  assert.strictEqual(collectUserFacingText(null), "");
  assert.strictEqual(hasInternalKeyLeak("Энгийн хэрэглэгчид харагдах Монгол өгүүлбэр."), false);
  assert.strictEqual(hasInternalKeyLeak("hunger_safety"), true);

  const artifact = JSON.parse(execFileSync("node", ["tests/driver-stack/exportCopyDecisionRenderings.mjs"], { encoding: "utf8" }));
  assert.deepStrictEqual(Object.keys(artifact), [
    "version",
    "generatedBy",
    "recommendation",
    "fixtureCount",
    "results"
  ]);
  assert.strictEqual(artifact.version, "copy-decision-rendering-v0-test-only");
  assert.strictEqual(artifact.generatedBy, "tests/driver-stack/exportCopyDecisionRenderings.mjs");
  assert.strictEqual(artifact.recommendation, "READY FOR OWNER REVIEW OF TEST-ONLY COPY RENDERER");
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
      "rendererMode",
      "sections",
      "fullUserFacingText",
      "qualityChecks",
      "runtimeGate",
      "pass"
    ]);
    assert.strictEqual(result.decisionStatus, "owner_recommended");
    assert.strictEqual(result.rendererMode, "test_only");
    assert.strictEqual(result.runtimeGate.canRenderInRuntime, false);
    assert.strictEqual(result.qualityChecks.internalKeyLeak, false);
    assert.strictEqual(result.qualityChecks.runtimeGateRespected, true);
    assert.strictEqual(result.qualityChecks.experimentIsObservation, true);
    assert.strictEqual(result.qualityChecks.diaryIsObservation, true);
    assert.strictEqual(result.sections.length, 5);
    assert.strictEqual(result.pass, true);
  });

  console.log("copyDecisionRenderer tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
