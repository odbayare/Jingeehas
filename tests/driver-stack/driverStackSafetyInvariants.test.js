const assert = require("assert");

(async () => {
  const { buildDriverStack } = await import("./driverStackTestCalculator.mjs");
  const { driverStackFixtures } = await import("./driverStackFixtures.mjs");

  const medicalFixture = driverStackFixtures.find(fixture => fixture.name === "medication_body_concern_professional_check");
  const medical = buildDriverStack(medicalFixture.state);

  assert.strictEqual(medical.safety_route.mode, "mode3");
  assert.strictEqual(medical.safety_route.ordinary_report_allowed, false);
  assert.strictEqual(medical.safety_route.ordinary_experiment_allowed, false);
  assert(medical.safety_route.safety_drivers.includes("professional_first"));
  assert(medical.safety_route.safety_drivers.includes("medical_red_flag"));
  assert.strictEqual(medical.primary_driver, null);
  assert.strictEqual(medical.first_gentle_change.id, "professional_discussion_summary");
  assert.strictEqual(medical.fourteen_day_experiment_hypothesis.duration_days, 0);
  assert(medical.copy_constraints.includes("no_ordinary_experiment_when_professional_first"));
  assert(medical.copy_constraints.includes("no_paywall_blocks_safety"));

  const urgent = buildDriverStack({
    packageType: "removed-feature",
    stageAnswers: {
      "S1-S04": "Одоо идэвхтэй бодогдож байна"
    },
    removedEntries: []
  });
  assert.strictEqual(urgent.safety_route.mode, "mode4");
  assert.strictEqual(urgent.safety_route.ordinary_report_allowed, false);
  assert.strictEqual(urgent.safety_route.ordinary_experiment_allowed, false);
  assert(urgent.safety_route.safety_drivers.includes("professional_first"));
  assert.strictEqual(urgent.primary_driver, null);
  assert.strictEqual(urgent.fourteen_day_experiment_hypothesis.duration_days, 0);

  const compensatory = buildDriverStack({
    packageType: "one-time",
    stageAnswers: {
      "S1-S03": "Одоо давтагддаг"
    },
    stageVoiceSummaries: {},
    removedEntries: []
  });
  assert(compensatory.driver_scores.compensatory_behavior || compensatory.driver_scores.professional_first);
  assert(compensatory.safety_route.safety_drivers.includes("professional_first"));
  assert.strictEqual(compensatory.safety_route.ordinary_experiment_allowed, false);

  console.log("driverStackSafetyInvariants tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
