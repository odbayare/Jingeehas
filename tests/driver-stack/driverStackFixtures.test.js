const assert = require("assert");
const { execFileSync } = require("child_process");

(async () => {
  const { buildDriverStack } = await import("./driverStackTestCalculator.mjs");
  const { APPROVED_DRIVER_STACK_FIXTURE_NAMES, driverStackFixtures } = await import("./driverStackFixtures.mjs");

  assert.deepStrictEqual(
    driverStackFixtures.map(fixture => fixture.name),
    APPROVED_DRIVER_STACK_FIXTURE_NAMES,
    "fixture names must match approved Work Pack 3B names exactly and in order"
  );

  const results = driverStackFixtures.map(fixture => ({
    fixture,
    stack: buildDriverStack(fixture.state)
  }));

  results.forEach(({ fixture, stack }) => {
    const expected = fixture.expected;
    const primaryKey = stack.primary_driver?.key || null;
    const secondaryKeys = stack.secondary_drivers.map(driver => driver.key);

    assert.strictEqual(primaryKey, expected.primary, `${fixture.name}: primary driver`);
    expected.secondaryInclude.forEach(key => {
      assert(secondaryKeys.includes(key) || (stack.driver_scores[key]?.normalizedScore || 0) >= 3, `${fixture.name}: missing secondary/active driver ${key}`);
    });
    assert.strictEqual(stack.interaction_pattern.id, expected.interaction, `${fixture.name}: interaction`);
    assert.strictEqual(stack.hidden_food_function.key, expected.hiddenFoodFunction, `${fixture.name}: hidden food function`);
    assert.strictEqual(stack.first_gentle_change.id, expected.firstGentleChange, `${fixture.name}: first gentle change`);
    assert.strictEqual(stack.safety_route.mode, expected.safetyMode, `${fixture.name}: safety mode`);
    if (Object.prototype.hasOwnProperty.call(expected, "ordinaryAllowed")) {
      assert.strictEqual(stack.safety_route.ordinary_report_allowed, expected.ordinaryAllowed, `${fixture.name}: ordinary report allowed`);
      assert.strictEqual(stack.safety_route.ordinary_experiment_allowed, expected.ordinaryAllowed, `${fixture.name}: ordinary experiment allowed`);
    }
    assert(!stack.primary_driver || stack.primary_driver.not_a_type === true, `${fixture.name}: must not become one-type label`);

    Object.entries(expected.scoreAtLeast || {}).forEach(([key, min]) => {
      assert((stack.driver_scores[key]?.normalizedScore || 0) >= min, `${fixture.name}: ${key} expected >= ${min}, got ${stack.driver_scores[key]?.normalizedScore}`);
    });
    Object.entries(expected.scoreAtMost || {}).forEach(([key, max]) => {
      assert((stack.driver_scores[key]?.normalizedScore || 0) <= max, `${fixture.name}: ${key} expected <= ${max}, got ${stack.driver_scores[key]?.normalizedScore}`);
    });
  });

  const stress = results.find(item => item.fixture.name === "stress_delivery_app_comfort").stack;
  assert.notStrictEqual(stress.hidden_food_function.key, "hunger_safety", "stress fixture must not collapse into hunger safety");

  const cue = results.find(item => item.fixture.name === "remote_work_visible_snacks").stack;
  assert.notStrictEqual(cue.hidden_food_function.key, "hunger_safety", "cue fixture must not collapse into hunger safety");

  const social = results.find(item => item.fixture.name === "social_weekend_alcohol_monday_restart").stack;
  assert.notStrictEqual(social.hidden_food_function.key, "hunger_safety", "social fixture must not collapse into hunger safety");

  const shift = results.find(item => item.fixture.name === "shift_work_loneliness_combo").stack;
  assert.strictEqual(shift.primary_driver.key, "shift_work");
  assert.strictEqual(shift.hidden_food_function.key, "loneliness_soothing");

  assert(!results.some(item => item.fixture.name === "sleep_disruption_circadian_reward"), "future helper fixture must not be in main fixture set");
  assert(!results.some(item => item.fixture.name === "stage_reward_diary_meal_gap_contradiction"), "future helper fixture must not be in main fixture set");

  const artifact = JSON.parse(execFileSync("node", ["tests/driver-stack/exportDriverStackFixtureResults.mjs"], { encoding: "utf8" }));
  assert.deepStrictEqual(Object.keys(artifact), [
    "version",
    "generatedBy",
    "recommendation",
    "approvedFixtureNames",
    "fixtureCount",
    "results"
  ], "fixture result artifact wrapper keys must match final camelCase contract");
  [
    "generated_by",
    "approved_fixture_names",
    "fixture_count"
  ].forEach(key => {
    assert(!Object.prototype.hasOwnProperty.call(artifact, key), `artifact wrapper must not include stale key ${key}`);
  });
  assert.strictEqual(artifact.generatedBy, "tests/driver-stack/exportDriverStackFixtureResults.mjs");
  assert.strictEqual(artifact.recommendation, "READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK");
  assert.deepStrictEqual(artifact.approvedFixtureNames, APPROVED_DRIVER_STACK_FIXTURE_NAMES);
  assert.strictEqual(artifact.fixtureCount, 10);
  assert.strictEqual(artifact.results.length, 10);
  assert.deepStrictEqual(
    artifact.results.map(result => result.name),
    APPROVED_DRIVER_STACK_FIXTURE_NAMES,
    "artifact result fixture names must match approved names exactly and in order"
  );
  artifact.results.forEach(result => {
    assert.deepStrictEqual(Object.keys(result), [
      "name",
      "safetyMode",
      "primaryDriverKeys",
      "secondaryDriverKeys",
      "interactionId",
      "vulnerableMomentId",
      "firstGentleChangeId",
      "experimentId",
      "hiddenFoodFunctionKey",
      "pass"
    ], `${result.name}: compact artifact result keys`);
    assert.strictEqual(result.pass, true, `${result.name}: pass flag`);
    [
      "fixtureName",
      "description",
      "ordinaryReportAllowed",
      "ordinaryExperimentAllowed",
      "primaryDriver",
      "primaryNormalizedScore",
      "secondaryDrivers",
      "interactionPattern",
      "vulnerableMoment",
      "visibleCondition",
      "hiddenFoodFunction",
      "wrongSelfExplanation",
      "firstGentleChange",
      "experimentDurationDays",
      "confirmationTargets",
      "safetyDrivers",
      "driverScores",
      "topDriverScores",
      "fixture_name",
      "mode",
      "primary_driver",
      "secondary_drivers",
      "interaction_pattern",
      "vulnerable_moment",
      "first_gentle_change",
      "hidden_food_function"
    ].forEach(key => {
      assert(!Object.prototype.hasOwnProperty.call(result, key), `${result.name}: no removed artifact key ${key}`);
    });
  });

  console.log("driverStackFixtures tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
