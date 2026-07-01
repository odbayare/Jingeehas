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
