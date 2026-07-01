import { buildFixtureCopyDecisionMetadataList } from "./copyDecisionMetadata.mjs";
import { driverStackFixtures } from "./driverStackFixtures.mjs";

const results = buildFixtureCopyDecisionMetadataList(driverStackFixtures);

console.log(JSON.stringify({
  version: "copy-decision-metadata-v0-test-only",
  generatedBy: "tests/driver-stack/exportCopyDecisionMetadata.mjs",
  recommendation: "READY FOR OWNER REVIEW OF TEST-ONLY COPY DECISION METADATA",
  fixtureCount: results.length,
  results
}, null, 2));
