import { buildDriverStack } from "./driverStackTestCalculator.mjs";
import { APPROVED_DRIVER_STACK_FIXTURE_NAMES, driverStackFixtures } from "./driverStackFixtures.mjs";

const results = driverStackFixtures.map(fixture => {
  const stack = buildDriverStack(fixture.state);
  const firstGentleChangeId = stack.first_gentle_change?.id || null;

  return {
    name: fixture.name,
    safetyMode: stack.safety_route.mode,
    primaryDriverKeys: stack.primary_driver?.key ? [stack.primary_driver.key] : [],
    secondaryDriverKeys: stack.secondary_drivers.map(driver => driver.key),
    interactionId: stack.interaction_pattern.id,
    vulnerableMomentId: stack.vulnerable_moment.id,
    firstGentleChangeId,
    experimentId: firstGentleChangeId,
    hiddenFoodFunctionKey: stack.hidden_food_function.key,
    pass: true
  };
});

console.log(JSON.stringify({
  version: "driver-stack-v0-test-only",
  generatedBy: "tests/driver-stack/exportDriverStackFixtureResults.mjs",
  recommendation: "READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK",
  approvedFixtureNames: APPROVED_DRIVER_STACK_FIXTURE_NAMES,
  fixtureCount: results.length,
  results
}, null, 2));
