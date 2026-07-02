const assert = require("assert");
const { execFileSync } = require("child_process");

(async () => {
  const {
    buildRuntimeAdapterPayload,
    buildRuntimeAdapterPayloadFromFixtures,
    collectAdapterUserFacingText,
    hasAdapterInternalKeyLeak,
    validateRuntimeAdapterPayload
  } = await import("./runtimeAdapterPrototype.mjs");
  const { renderFixtureCopyDecisionSectionList } = await import("./copyDecisionRenderer.mjs");
  const { driverStackFixtures } = await import("./driverStackFixtures.mjs");

  [
    buildRuntimeAdapterPayload,
    buildRuntimeAdapterPayloadFromFixtures,
    collectAdapterUserFacingText,
    hasAdapterInternalKeyLeak,
    validateRuntimeAdapterPayload
  ].forEach(fn => assert.strictEqual(typeof fn, "function"));

  assert.throws(
    () => buildRuntimeAdapterPayload(null),
    /requires an array of WP12 copy renderings/
  );
  assert.throws(
    () => buildRuntimeAdapterPayload([{ version: "wrong" }]),
    /requires copy-decision-rendering-v0-test-only renderings/
  );

  const sourceRenderings = renderFixtureCopyDecisionSectionList(driverStackFixtures);
  const sourceBefore = JSON.stringify(sourceRenderings);
  const payload = buildRuntimeAdapterPayload(sourceRenderings);
  assert.strictEqual(JSON.stringify(sourceRenderings), sourceBefore, "Adapter must not mutate WP12 source renderings");

  assert.deepStrictEqual(Object.keys(payload), [
    "version",
    "adapterMode",
    "source",
    "generatedFrom",
    "reportSurface",
    "previewSections",
    "paidSections",
    "safetyGuidanceSections",
    "internalDiagnostics",
    "ownerDebug",
    "runtimeSafetyGate",
    "paymentGate",
    "qualityChecks",
    "pass"
  ]);
  assert.strictEqual(payload.version, "runtime-adapter-payload-v0-test-only");
  assert.strictEqual(payload.adapterMode, "test_only");
  assert.strictEqual(payload.source, "wp12-copy-rendering");
  assert.strictEqual(payload.reportSurface, "prototype_only");
  assert.deepStrictEqual(payload.generatedFrom, [
    "WP3 driver stack",
    "WP4 report object",
    "WP9 copy decision metadata",
    "WP12 polished copy renderer",
    "WP14 test-only runtime adapter prototype"
  ]);
  assert.strictEqual(payload.runtimeSafetyGate.canRenderInRuntime, false);
  assert.strictEqual(payload.runtimeSafetyGate.status, "HOLD");
  assert.strictEqual(payload.paymentGate.implemented, false);
  assert.strictEqual(payload.paymentGate.safetyGuidanceBypassesPayment, true);
  assert.strictEqual(payload.paymentGate.safetyGuidanceRequiresPayment, false);
  assert.strictEqual(payload.ownerDebug.sourceRendererVersion, "copy-decision-rendering-v0-test-only");
  assert.strictEqual(payload.ownerDebug.sourceRenderingCount, 2);
  assert.strictEqual(payload.ownerDebug.sourceRuntimeCanRender, false);

  assert.strictEqual(payload.previewSections.length, 2);
  assert.strictEqual(payload.paidSections.length, 7);
  assert.strictEqual(payload.safetyGuidanceSections.length, 1);
  assert.strictEqual(payload.internalDiagnostics.length, 2);
  assert.strictEqual(payload.ownerDebug.sourceFixtureNames.length, 2);

  [
    ...payload.previewSections,
    ...payload.paidSections,
    ...payload.safetyGuidanceSections
  ].forEach(section => {
    assert.deepStrictEqual(Object.keys(section), ["title", "body"]);
    assert.strictEqual(typeof section.title, "string");
    assert.strictEqual(typeof section.body, "string");
    assert(section.title.length > 0);
    assert(section.body.length > 20);
  });

  const userFacingText = collectAdapterUserFacingText(payload);
  assert(userFacingText.includes("Бие дараагийн хоол найдвартай ирэхийг"));
  assert(userFacingText.includes("Энэ нь онош биш."));
  assert(userFacingText.includes("Зөөлөн мэргэжлийн гүүр"));
  assert.strictEqual(hasAdapterInternalKeyLeak(payload), false);
  [
    "all_or_nothing_restriction_rebound",
    "pcos_body_uncertainty_control",
    "runtimeGate",
    "decisionStatus",
    "rendererMode",
    "fixtureName",
    "owner_recommended",
    "test_only",
    "mode1"
  ].forEach(forbidden => {
    assert(!userFacingText.includes(forbidden), `User-facing adapter text leaked ${forbidden}`);
  });

  assert.deepStrictEqual(payload.ownerDebug.sourceFixtureNames, [
    "all_or_nothing_restriction_rebound",
    "pcos_body_uncertainty_control"
  ]);
  payload.internalDiagnostics.forEach(diagnostic => {
    assert.strictEqual(diagnostic.decisionStatus, "owner_recommended");
    assert.strictEqual(diagnostic.rendererMode, "test_only");
    assert.strictEqual(diagnostic.runtimeGate.canRenderInRuntime, false);
    assert.strictEqual(diagnostic.sourcePass, true);
  });

  assert.deepStrictEqual(payload.qualityChecks, {
    userFacingInternalKeyLeak: false,
    surfacesSeparated: true,
    safetyGuidanceBypassesPayment: true,
    runtimeSafetyGateHold: true,
    sourceRendererGateRespected: true,
    exactFixtureCount: true
  });
  assert.strictEqual(payload.pass, true);
  assert.deepStrictEqual(validateRuntimeAdapterPayload(payload), {
    pass: true,
    errors: []
  });

  const fromFixtures = buildRuntimeAdapterPayloadFromFixtures(driverStackFixtures);
  assert.strictEqual(fromFixtures.pass, true);
  assert.strictEqual(fromFixtures.ownerDebug.sourceRenderingCount, 2);

  const leakedPayload = {
    ...payload,
    previewSections: [
      { title: "runtimeGate", body: "all_or_nothing_restriction_rebound" }
    ],
    paidSections: [],
    safetyGuidanceSections: []
  };
  assert.strictEqual(hasAdapterInternalKeyLeak(leakedPayload), true);
  assert.strictEqual(validateRuntimeAdapterPayload(leakedPayload).pass, false);

  const artifact = JSON.parse(execFileSync("node", ["tests/driver-stack/exportRuntimeAdapterPrototype.mjs"], { encoding: "utf8" }));
  assert.deepStrictEqual(Object.keys(artifact), [
    "version",
    "generatedBy",
    "recommendation",
    "runtimeIntegrationApproved",
    "payload"
  ]);
  assert.strictEqual(artifact.version, "runtime-adapter-prototype-export-v0-test-only");
  assert.strictEqual(artifact.generatedBy, "tests/driver-stack/exportRuntimeAdapterPrototype.mjs");
  assert.strictEqual(artifact.recommendation, "READY FOR OWNER REVIEW OF TEST-ONLY RUNTIME ADAPTER CONTRACT");
  assert.strictEqual(artifact.runtimeIntegrationApproved, false);
  assert.strictEqual(artifact.payload.pass, true);
  assert.strictEqual(artifact.payload.runtimeSafetyGate.canRenderInRuntime, false);
  assert.strictEqual(hasAdapterInternalKeyLeak(artifact.payload), false);

  console.log("runtimeAdapterPrototype tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
