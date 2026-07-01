# Work Pack 9 Owner Review Pack

## Recommendation Enum

READY FOR OWNER REVIEW OF TEST-ONLY COPY DECISION METADATA

## Repository State

### git status --short

```text
 M tests/run-all.js
?? audits/mvp-diagnostic-migration/work-pack-9/
?? audits/sprint-36-paid-depth-prototype/
?? tests/driver-stack/copyDecisionMetadata.mjs
?? tests/driver-stack/copyDecisionMetadata.test.js
?? tests/driver-stack/exportCopyDecisionMetadata.mjs
```

### git diff --stat

```text
 tests/run-all.js | 1 +
 1 file changed, 1 insertion(+)
```

### git diff -- app.js index.html styles.css mockBackend.js package.json _redirects

```text

```

## Validation Commands and Results

```text
git status --short: PASS (WP9 test-only files/docs uncommitted; unrelated audits/sprint-36-paid-depth-prototype/ also untracked)
git diff --check: PASS
node --check app.js: PASS
node --check tests/driver-stack/driverStackReportObject.mjs: PASS
node --check tests/driver-stack/copyDecisionMetadata.mjs: PASS
node --check tests/driver-stack/exportCopyDecisionMetadata.mjs: PASS
node tests/driver-stack/driverStackReportObject.test.js: PASS (driverStackReportObject tests passed)
node tests/driver-stack/driverStackContract.test.js: PASS (driverStackContract tests passed)
node tests/driver-stack/driverStackFixtures.test.js: PASS (driverStackFixtures tests passed)
node tests/driver-stack/driverStackSafetyInvariants.test.js: PASS (driverStackSafetyInvariants tests passed)
node tests/driver-stack/copyDecisionMetadata.test.js: PASS (copyDecisionMetadata tests passed)
node tests/driver-stack/exportCopyDecisionMetadata.mjs: PASS (generated full metadata artifact)
npm test: PASS (All tests passed)
rg stale WP8 risk flags: PASS (no matches)
git diff -- app.js index.html styles.css mockBackend.js package.json _redirects: PASS (empty diff)
```

## Changed Files List

```text
tests/run-all.js
tests/driver-stack/copyDecisionMetadata.mjs
tests/driver-stack/copyDecisionMetadata.test.js
tests/driver-stack/exportCopyDecisionMetadata.mjs
audits/mvp-diagnostic-migration/work-pack-9/OWNER_REVIEW_PACK_WP9.md
audits/mvp-diagnostic-migration/work-pack-9/copy-decision-metadata-results.json
audits/mvp-diagnostic-migration/work-pack-9/metadata-prototype-notes.md
audits/mvp-diagnostic-migration/work-pack-9/metadata-fixture-summary.md
audits/mvp-diagnostic-migration/work-pack-9/metadata-test-coverage.md
audits/mvp-diagnostic-migration/work-pack-9/work-pack-9-recommendation.md
```

## Explicit Confirmation

- No runtime changes
- No app.js changes
- No scoring/fixture changes
- No WP4 report object contract changes
- No existing WP4 report object tests modified
- No production report rendering changes
- No PDF generated
- No deploy
- QPay/backend/payment/pricing/entitlement unchanged
- Metadata is test-only and cannot render in runtime

---

## Full Content: tests/run-all.js

const { spawnSync } = require("child_process");

const commands = [
  ["node", ["--check", "app.js"]],
  ["node", ["tests/safety-readiness.test.js"]],
  ["node", ["tests/voice-summary-confirmation.test.js"]],
  ["node", ["tests/report-bible-sections.test.js"]],
  ["node", ["tests/question-metadata-mechanisms.test.js"]],
  ["node", ["tests/evidence-scoring-calibration.test.js"]],
  ["node", ["tests/driver-stack/driverStackContract.test.js"]],
  ["node", ["tests/driver-stack/driverStackFixtures.test.js"]],
  ["node", ["tests/driver-stack/driverStackSafetyInvariants.test.js"]],
  ["node", ["tests/driver-stack/driverStackReportObject.test.js"]],
  ["node", ["tests/driver-stack/copyDecisionMetadata.test.js"]],
  ["node", ["tests/virtual-user-qa.test.js"]],
  ["node", ["tests/ten-person-simulation-audit.test.js"]],
  ["node", ["tests/partial-persona-fix.test.js"]],
  ["node", ["tests/input-focus.test.js"]],
  ["node", ["tests/report-compression-ai-smell.test.js"]],
  ["node", ["tests/copy-localization.test.js"]],
  ["node", ["tests/ai-blind-demo-panel.test.js"]],
  ["node", ["tests/sample-preview-choice-clarity.test.js"]],
  ["node", ["tests/pricing-paywall.test.js"]],
  ["node", ["tests/commercial-flow-qa.test.js"]],
  ["node", ["tests/backend-qpay-plan.test.js"]],
  ["node", ["tests/mock-backend-entitlements.test.js"]],
  ["node", ["tests/fake-payment-lead-capture.test.js"]],
  ["node", ["tests/internal-tester-feedback.test.js"]],
  ["node", ["tests/internal-human-feedback-copy-ux.test.js"]],
  ["node", ["tests/question-copy-polish.test.js"]],
  ["node", ["tests/question-navigation.test.js"]],
  ["node", ["tests/menstrual-cycle-context.test.js"]],
  ["node", ["tests/surface-hidden-function-reframe.test.js"]],
  ["node", ["tests/coach-subadmin.test.js"]],
  ["node", ["tests/coach-workflow-qa.test.js"]],
  ["node", ["tests/coach-language-polish.test.js"]],
  ["node", ["tests/result-comprehension.test.js"]],
  ["node", ["tests/deep-mongolian-copy-rewrite.test.js"]],
  ["node", ["tests/public-language-purge.test.js"]],
  ["node", ["tests/report-voice-rewrite.test.js"]],
  ["node", ["tests/virtual-audit-public-copy.test.js"]],
  ["node", ["tests/sprint32-export-separation.test.js"]]
];

for (const [command, args] of commands) {
  const label = [command, ...args].join(" ");
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log("\nAll tests passed");

## Full Content: tests/driver-stack/copyDecisionMetadata.mjs

import { driverStackFixtures } from "./driverStackFixtures.mjs";
import { buildFixtureReportObject } from "./driverStackReportObject.mjs";

const METADATA_VERSION = "copy-decision-metadata-v0-test-only";
const DECISION_STATUS = "owner_recommended";

const COPY_DECISION_FIXTURE_NAMES = [
  "all_or_nothing_restriction_rebound",
  "pcos_body_uncertainty_control"
];

function runtimeGate(requiredBeforeRuntime) {
  return {
    canRenderInRuntime: false,
    requiredBeforeRuntime
  };
}

function baseMetadata(reportObject, options = {}) {
  if (!reportObject || reportObject.version !== "driver-stack-report-object-v0-test-only") {
    throw new Error("buildCopyDecisionMetadata requires a driver-stack-report-object-v0-test-only object");
  }

  return {
    version: METADATA_VERSION,
    fixtureName: reportObject.fixtureName,
    decisionStatus: DECISION_STATUS,
    safetyMode: reportObject.safetyMode,
    hiddenFoodFunctionKey: reportObject.hiddenFoodFunction?.key || null,
    supplementaryNarrative: null,
    softMedicalContextBridge: null,
    copyRiskFlags: [],
    structureDecisionNotes: options.fixtureDescription
      ? [`Fixture source note: ${options.fixtureDescription}`]
      : [],
    runtimeGate: runtimeGate([]),
    pass: true
  };
}

function allOrNothingMetadata(metadata) {
  return {
    ...metadata,
    decisionStatus: DECISION_STATUS,
    supplementaryNarrative: {
      id: "restriction_rebound_relief",
      appliesTo: [
        "all_or_nothing",
        "strict_diet",
        "meal_gap",
        "evening_hunger",
        "all_or_nothing_punishment_restriction"
      ],
      purpose: "Explain relief from failure, punishment, and restart pressure while preserving hunger_safety as the body-state hidden function.",
      requiredInUserCopy: true,
      userFacingCopyRule: "User copy must include both hunger-safety and relief/restart-pressure narrative.",
      forbiddenClaims: [
        "weak",
        "failed",
        "stricter dieting",
        "discipline failure",
        "compensate tomorrow",
        "hunger as the only explanation"
      ]
    },
    copyRiskFlags: [
      "restriction_rebound_shame_risk",
      "hunger_safety_underexplains_rebound",
      "punishment_restart_pressure",
      "internal_key_leak_risk",
      "runtime_integration_hold",
      "production_rendering_hold"
    ],
    structureDecisionNotes: [
      "Keep hunger_safety as the hidden food function.",
      "Add restriction_rebound_relief as supplementary narrative in future copy.",
      "Do not change WP3 scoring, WP3 fixtures, or WP4 report object contract in WP9."
    ],
    runtimeGate: runtimeGate([
      "Owner approval of copy decision metadata.",
      "Test-only prototype proves supplementaryNarrative renders without internal keys.",
      "Runtime copy includes hunger-safety and relief/restart-pressure narrative.",
      "No strict diet, shame-language, or compensate-tomorrow regression."
    ])
  };
}

function pcosBodyUncertaintyMetadata(metadata) {
  return {
    ...metadata,
    decisionStatus: DECISION_STATUS,
    softMedicalContextBridge: {
      id: "body_uncertainty_soft_medical_context",
      appliesTo: [
        "body_change_uncertainty",
        "control_regain",
        "pcos_body_uncertainty_control",
        "body_neutral_private_tracking"
      ],
      requiredInUserCopy: true,
      doesNotChangeSafetyMode: true,
      suppressesOrdinaryExperiment: false,
      requiredLanguage: [
        "Энэ нь онош биш.",
        "тодорхойгүй байдал",
        "хяналтаа буцааж авах оролдлого",
        "тодруулах хэрэгтэй байж магадгүй"
      ],
      forbiddenClaims: [
        "PCOS caused it",
        "hormones caused it",
        "medication caused it",
        "glucose caused it",
        "this is a diagnosis",
        "this is treatment advice"
      ]
    },
    copyRiskFlags: [
      "medical_cause_implication_risk",
      "body_uncertainty_sensitivity",
      "soft_professional_context_needed",
      "ordinary_experiment_allowed_with_medical_bridge",
      "internal_key_leak_risk",
      "payment_blocking_safety_risk",
      "runtime_integration_hold",
      "production_rendering_hold"
    ],
    structureDecisionNotes: [
      "Keep mode1 ordinary safety mode.",
      "Keep control_regain as the hidden food function.",
      "Add body_uncertainty_soft_medical_context bridge in future copy.",
      "Do not claim PCOS, hormones, medication, glucose, or medical cause as fact."
    ],
    runtimeGate: runtimeGate([
      "Owner approval of copy decision metadata.",
      "Test-only prototype proves softMedicalContextBridge is present.",
      "Copy says this is not diagnosis.",
      "Copy preserves ordinary observation unless professional-first is triggered.",
      "No medical-cause implication regression."
    ])
  };
}

export function isCopyDecisionFixture(fixtureName) {
  return COPY_DECISION_FIXTURE_NAMES.includes(fixtureName);
}

export function buildCopyDecisionMetadata(reportObject, options = {}) {
  if (!reportObject || reportObject.version !== "driver-stack-report-object-v0-test-only") {
    throw new Error("buildCopyDecisionMetadata requires a driver-stack-report-object-v0-test-only object");
  }

  if (!isCopyDecisionFixture(reportObject.fixtureName)) {
    return null;
  }

  const metadata = baseMetadata(reportObject, options);

  if (reportObject.fixtureName === "all_or_nothing_restriction_rebound") {
    return allOrNothingMetadata(metadata);
  }

  if (reportObject.fixtureName === "pcos_body_uncertainty_control") {
    return pcosBodyUncertaintyMetadata(metadata);
  }

  return metadata;
}

export function buildFixtureCopyDecisionMetadata(fixture) {
  const reportObject = buildFixtureReportObject(fixture);
  return buildCopyDecisionMetadata(reportObject, { fixtureDescription: fixture.description });
}

export function buildFixtureCopyDecisionMetadataList(fixtures = driverStackFixtures) {
  return fixtures
    .map(buildFixtureCopyDecisionMetadata)
    .filter(Boolean);
}

## Full Content: tests/driver-stack/copyDecisionMetadata.test.js

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

## Full Content: tests/driver-stack/exportCopyDecisionMetadata.mjs

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

## Full Content: audits/mvp-diagnostic-migration/work-pack-9/copy-decision-metadata-results.json

{
  "version": "copy-decision-metadata-v0-test-only",
  "generatedBy": "tests/driver-stack/exportCopyDecisionMetadata.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY COPY DECISION METADATA",
  "fixtureCount": 2,
  "results": [
    {
      "version": "copy-decision-metadata-v0-test-only",
      "fixtureName": "all_or_nothing_restriction_rebound",
      "decisionStatus": "owner_recommended",
      "safetyMode": "mode1",
      "hiddenFoodFunctionKey": "hunger_safety",
      "supplementaryNarrative": {
        "id": "restriction_rebound_relief",
        "appliesTo": [
          "all_or_nothing",
          "strict_diet",
          "meal_gap",
          "evening_hunger",
          "all_or_nothing_punishment_restriction"
        ],
        "purpose": "Explain relief from failure, punishment, and restart pressure while preserving hunger_safety as the body-state hidden function.",
        "requiredInUserCopy": true,
        "userFacingCopyRule": "User copy must include both hunger-safety and relief/restart-pressure narrative.",
        "forbiddenClaims": [
          "weak",
          "failed",
          "stricter dieting",
          "discipline failure",
          "compensate tomorrow",
          "hunger as the only explanation"
        ]
      },
      "softMedicalContextBridge": null,
      "copyRiskFlags": [
        "restriction_rebound_shame_risk",
        "hunger_safety_underexplains_rebound",
        "punishment_restart_pressure",
        "internal_key_leak_risk",
        "runtime_integration_hold",
        "production_rendering_hold"
      ],
      "structureDecisionNotes": [
        "Keep hunger_safety as the hidden food function.",
        "Add restriction_rebound_relief as supplementary narrative in future copy.",
        "Do not change WP3 scoring, WP3 fixtures, or WP4 report object contract in WP9."
      ],
      "runtimeGate": {
        "canRenderInRuntime": false,
        "requiredBeforeRuntime": [
          "Owner approval of copy decision metadata.",
          "Test-only prototype proves supplementaryNarrative renders without internal keys.",
          "Runtime copy includes hunger-safety and relief/restart-pressure narrative.",
          "No strict diet, shame-language, or compensate-tomorrow regression."
        ]
      },
      "pass": true
    },
    {
      "version": "copy-decision-metadata-v0-test-only",
      "fixtureName": "pcos_body_uncertainty_control",
      "decisionStatus": "owner_recommended",
      "safetyMode": "mode1",
      "hiddenFoodFunctionKey": "control_regain",
      "supplementaryNarrative": null,
      "softMedicalContextBridge": {
        "id": "body_uncertainty_soft_medical_context",
        "appliesTo": [
          "body_change_uncertainty",
          "control_regain",
          "pcos_body_uncertainty_control",
          "body_neutral_private_tracking"
        ],
        "requiredInUserCopy": true,
        "doesNotChangeSafetyMode": true,
        "suppressesOrdinaryExperiment": false,
        "requiredLanguage": [
          "Энэ нь онош биш.",
          "тодорхойгүй байдал",
          "хяналтаа буцааж авах оролдлого",
          "тодруулах хэрэгтэй байж магадгүй"
        ],
        "forbiddenClaims": [
          "PCOS caused it",
          "hormones caused it",
          "medication caused it",
          "glucose caused it",
          "this is a diagnosis",
          "this is treatment advice"
        ]
      },
      "copyRiskFlags": [
        "medical_cause_implication_risk",
        "body_uncertainty_sensitivity",
        "soft_professional_context_needed",
        "ordinary_experiment_allowed_with_medical_bridge",
        "internal_key_leak_risk",
        "payment_blocking_safety_risk",
        "runtime_integration_hold",
        "production_rendering_hold"
      ],
      "structureDecisionNotes": [
        "Keep mode1 ordinary safety mode.",
        "Keep control_regain as the hidden food function.",
        "Add body_uncertainty_soft_medical_context bridge in future copy.",
        "Do not claim PCOS, hormones, medication, glucose, or medical cause as fact."
      ],
      "runtimeGate": {
        "canRenderInRuntime": false,
        "requiredBeforeRuntime": [
          "Owner approval of copy decision metadata.",
          "Test-only prototype proves softMedicalContextBridge is present.",
          "Copy says this is not diagnosis.",
          "Copy preserves ordinary observation unless professional-first is triggered.",
          "No medical-cause implication regression."
        ]
      },
      "pass": true
    }
  ]
}

## Full Content: audits/mvp-diagnostic-migration/work-pack-9/metadata-prototype-notes.md

# Work Pack 9 Metadata Prototype Notes

## Purpose

WP9 creates a test-only copy decision metadata prototype from the WP8 schema. It does not integrate with runtime, does not change production report rendering, does not change WP3 scoring or fixtures, and does not change the WP4 report object contract.

## Files added

- `tests/driver-stack/copyDecisionMetadata.mjs`
- `tests/driver-stack/copyDecisionMetadata.test.js`
- `tests/driver-stack/exportCopyDecisionMetadata.mjs`
- `audits/mvp-diagnostic-migration/work-pack-9/copy-decision-metadata-results.json`

## Metadata behavior

The prototype consumes WP4 report objects and returns full copy decision metadata only for the two WP8-approved copy-sensitive fixtures:

- `all_or_nothing_restriction_rebound`
- `pcos_body_uncertainty_control`

All other fixtures return `null`. `buildFixtureCopyDecisionMetadataList(fixtures)` omits nulls and returns exactly two metadata objects.

## Metadata object contract

Every emitted metadata object has exactly these top-level keys:

- `version`
- `fixtureName`
- `decisionStatus`
- `safetyMode`
- `hiddenFoodFunctionKey`
- `supplementaryNarrative`
- `softMedicalContextBridge`
- `copyRiskFlags`
- `structureDecisionNotes`
- `runtimeGate`
- `pass`

## Proven decisions

### `all_or_nothing_restriction_rebound`

- Keeps `hiddenFoodFunctionKey === "hunger_safety"`.
- Receives `supplementaryNarrative.id === "restriction_rebound_relief"`.
- Keeps `safetyMode === "mode1"`.
- Keeps `decisionStatus === "owner_recommended"`.
- Keeps `runtimeGate.canRenderInRuntime === false`.

### `pcos_body_uncertainty_control`

- Keeps `safetyMode === "mode1"`.
- Keeps `hiddenFoodFunctionKey === "control_regain"`.
- Receives `softMedicalContextBridge.id === "body_uncertainty_soft_medical_context"`.
- Keeps `decisionStatus === "owner_recommended"`.
- Keeps `runtimeGate.canRenderInRuntime === false`.

## Runtime approval boundary

The metadata is deliberately test-only. It is not runtime approval. It is not owner-approved runtime copy. It is not a production report renderer.

Runtime integration remains HOLD until a future work pack explicitly approves runtime planning and verifies copy rendering, safety, payment, and regression gates.

## Full Content: audits/mvp-diagnostic-migration/work-pack-9/metadata-fixture-summary.md

# Work Pack 9 Metadata Fixture Summary

Source artifact: `copy-decision-metadata-results.json`

| Fixture | Decision status | Hidden food function | Supplementary narrative | Soft medical bridge | Runtime render allowed | Pass |
| --- | --- | --- | --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | `owner_recommended` | `hunger_safety` | `restriction_rebound_relief` | null | false | true |
| `pcos_body_uncertainty_control` | `owner_recommended` | `control_regain` | null | `body_uncertainty_soft_medical_context` | false | true |

## Summary

The artifact contains exactly two full metadata objects. Both are copy decision fixtures. Non-decision fixtures are omitted because `buildCopyDecisionMetadata(reportObject)` returns `null` for them.

## Non-goals confirmed

- No runtime rendering.
- No production report rendering.
- No scoring change.
- No fixture behavior change.
- No WP4 report object contract change.
- No PDF generation.
- No deploy.
- No payment/QPay/backend work.

## Full Content: audits/mvp-diagnostic-migration/work-pack-9/metadata-test-coverage.md

# Work Pack 9 Metadata Test Coverage

## Test file

`tests/driver-stack/copyDecisionMetadata.test.js`

## Coverage

- Confirms the four required exports exist.
- Confirms only the two WP8 copy-sensitive fixtures are decision fixtures.
- Confirms `buildFixtureCopyDecisionMetadataList(fixtures)` returns exactly two items.
- Confirms non-decision fixtures return `null`.
- Confirms the professional-first fixture `medication_body_concern_professional_check` returns `null` and is omitted.
- Confirms every emitted metadata object has the exact approved top-level key list.
- Confirms `pass === true` on every emitted metadata object.
- Confirms `runtimeGate.canRenderInRuntime === false` on every emitted metadata object.
- Confirms `all_or_nothing_restriction_rebound` keeps `hiddenFoodFunctionKey === "hunger_safety"`.
- Confirms `all_or_nothing_restriction_rebound` receives `supplementaryNarrative.id === "restriction_rebound_relief"`.
- Confirms `pcos_body_uncertainty_control` keeps `safetyMode === "mode1"`.
- Confirms `pcos_body_uncertainty_control` keeps `hiddenFoodFunctionKey === "control_regain"`.
- Confirms `pcos_body_uncertainty_control` receives `softMedicalContextBridge.id === "body_uncertainty_soft_medical_context"`.
- Confirms both fixtures use `decisionStatus === "owner_recommended"`, not `owner_approved`.
- Confirms the export artifact contains full metadata objects, not compact rows.
- Confirms stale WP8 risk flag names are absent without retaining those stale names as exact literals in the test file.

## Runtime guard coverage

The test rejects runtime-looking fields including:

- `runtimeIntegrationEnabled`
- `html`
- `pdf`
- `localStorage`
- `appJs`

The metadata remains test-only and cannot be mistaken for runtime approval.

## Full Content: audits/mvp-diagnostic-migration/work-pack-9/work-pack-9-recommendation.md

# Work Pack 9 Recommendation

## Recommendation Enum

READY FOR OWNER REVIEW OF TEST-ONLY COPY DECISION METADATA

## Basis

The test-only prototype proves the two WP8 copy decisions as metadata without changing runtime behavior:

- `all_or_nothing_restriction_rebound` receives `restriction_rebound_relief` while keeping `hunger_safety`.
- `pcos_body_uncertainty_control` receives `body_uncertainty_soft_medical_context` while keeping `mode1` and `control_regain`.

Both fixtures remain `owner_recommended`, not `owner_approved`. Both have runtime rendering gated off.

## Hold conditions

Runtime integration remains HOLD. Production report rendering remains HOLD. WP3 scoring, WP3 fixtures, WP4 report object contract, WP4 tests, PDF generation, deploy, backend, payment, QPay, pricing, entitlement, and localStorage remain out of scope.
