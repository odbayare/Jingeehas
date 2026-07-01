import { renderFixtureCopyDecisionSectionList } from "./copyDecisionRenderer.mjs";
import { driverStackFixtures } from "./driverStackFixtures.mjs";

const results = renderFixtureCopyDecisionSectionList(driverStackFixtures);

console.log(JSON.stringify({
  version: "copy-decision-rendering-v0-test-only",
  generatedBy: "tests/driver-stack/exportCopyDecisionRenderings.mjs",
  recommendation: "READY FOR OWNER REVIEW OF TEST-ONLY COPY RENDERER",
  fixtureCount: results.length,
  results
}, null, 2));
