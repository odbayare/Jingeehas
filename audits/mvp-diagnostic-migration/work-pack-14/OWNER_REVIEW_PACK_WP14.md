# Work Pack 14 Owner Review Pack

## Recommendation Enum

```text
READY FOR OWNER REVIEW OF TEST-ONLY RUNTIME ADAPTER CONTRACT
```

## Required Conclusion

Runtime implementation is NOT approved by WP14.

## Primary WP14 Files

- `tests/run-all.js`
- `tests/driver-stack/runtimeAdapterPrototype.mjs`
- `tests/driver-stack/runtimeAdapterPrototype.test.js`
- `tests/driver-stack/exportRuntimeAdapterPrototype.mjs`
- `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-contract.md`
- `audits/mvp-diagnostic-migration/work-pack-14/surface-allocation-rules.md`
- `audits/mvp-diagnostic-migration/work-pack-14/safety-payment-adapter-rules.md`
- `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-test-coverage.md`
- `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-prototype-results.json`
- `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-prototype-summary.md`
- `audits/mvp-diagnostic-migration/work-pack-14/wp14-risk-register.md`
- `audits/mvp-diagnostic-migration/work-pack-14/work-pack-14-recommendation.md`
- `audits/mvp-diagnostic-migration/work-pack-14/OWNER_REVIEW_PACK_WP14.md`

## Exact Payload Contract

```js
[
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
]
```

## Exact Scalar Contract

| Field | Required value |
| --- | --- |
| `source` | `wp12-copy-rendering` |
| `reportSurface` | `prototype_only` |
| `runtimeSafetyGate.canRenderInRuntime` | `false` |
| `paymentGate.safetyGuidanceRequiresPayment` | `false` |
| `pass` | `true` |

## Validation Evidence

| Command | Result | Evidence |
| --- | --- | --- |
| `git status --short` | PASS | Shows WP14 files and unrelated sprint folder as untracked before staging. |
| `git diff --check` | PASS | No output. |
| `node --check app.js` | PASS | No output. |
| `node --check tests/driver-stack/runtimeAdapterPrototype.mjs` | PASS | No output. |
| `node --check tests/driver-stack/exportRuntimeAdapterPrototype.mjs` | PASS | No output. |
| `node tests/driver-stack/runtimeAdapterPrototype.test.js` | PASS | runtimeAdapterPrototype tests passed. |
| `node tests/driver-stack/exportRuntimeAdapterPrototype.mjs > /tmp/wp14_runtime_adapter_check.json` | PASS | No output; JSON written. |
| `node -e exact WP14 adapter contract check` | PASS | WP14 adapter exact contract check passed. |
| `npm test` | PASS | All tests passed. |
| `git diff -- app.js index.html styles.css mockBackend.js package.json _redirects` | PASS | No output; runtime/product files unchanged. |
| `git diff -- tests/driver-stack/copyDecisionRenderer.mjs tests/driver-stack/copyDecisionRenderer.test.js tests/driver-stack/copyDecisionMetadata.mjs tests/driver-stack/exportCopyDecisionRenderings.mjs` | PASS | No output; WP9/WP12 source-contract files unchanged. |

## Self-Audit Checklist

| Check | Result |
| --- | --- |
| Required export version is `runtime-adapter-prototype-export-v0-test-only` | PASS |
| Required result artifact name is `runtime-adapter-prototype-results.json` | PASS |
| Exact payload key order is locked by test and artifact | PASS |
| Required semantic keys are absent | PASS |
| Runtime/product files are unchanged | PASS |
| WP9/WP12 source-contract files are unchanged | PASS |
| Unrelated sprint folder remains untracked and unstaged | PASS |

## Full Content: `tests/run-all.js`

~~~js
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
  ["node", ["tests/driver-stack/copyDecisionRenderer.test.js"]],
  ["node", ["tests/driver-stack/runtimeAdapterPrototype.test.js"]],
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
~~~

## Full Content: `tests/driver-stack/runtimeAdapterPrototype.mjs`

~~~js
import { driverStackFixtures } from "./driverStackFixtures.mjs";
import { renderFixtureCopyDecisionSectionList } from "./copyDecisionRenderer.mjs";

const ADAPTER_VERSION = "runtime-adapter-payload-v0-test-only";
const ADAPTER_MODE = "test_only";
const SOURCE_RENDERING_VERSION = "copy-decision-rendering-v0-test-only";

const INTERNAL_KEY_PATTERNS = [
  /\b[a-z]+(?:_[a-z0-9]+)+\b/g,
  /\bruntimeGate\b/g,
  /\bdecisionStatus\b/g,
  /\brendererMode\b/g,
  /\bfixtureName\b/g,
  /\bownerDebug\b/g,
  /\binternalDiagnostics\b/g,
  /\ball_or_nothing_restriction_rebound\b/g,
  /\bpcos_body_uncertainty_control\b/g,
  /\bowner_recommended\b/g,
  /\btest_only\b/g,
  /\bmode[0-9]\b/g
];

const SAFETY_SECTION_TITLES = new Set([
  "Зөөлөн мэргэжлийн гүүр"
]);

function cloneSection(section) {
  return {
    title: section.title,
    body: section.body
  };
}

function userTextFromSections(sections) {
  return sections
    .map(section => `${section.title}\n${section.body}`)
    .join("\n\n");
}

function flattenUserFacingSections(payload) {
  if (!payload) return [];
  return [
    ...(payload.previewSections || []),
    ...(payload.paidSections || []),
    ...(payload.safetyGuidanceSections || [])
  ];
}

function hasInternalKeyText(text) {
  if (!text) return false;
  return INTERNAL_KEY_PATTERNS.some(pattern => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

function buildInternalDiagnostic(rendering) {
  return {
    fixtureName: rendering.fixtureName,
    decisionStatus: rendering.decisionStatus,
    safetyMode: rendering.safetyMode,
    rendererMode: rendering.rendererMode,
    runtimeGate: {
      canRenderInRuntime: rendering.runtimeGate?.canRenderInRuntime === true,
      requiredBeforeRuntime: [...(rendering.runtimeGate?.requiredBeforeRuntime || [])]
    },
    sourcePass: rendering.pass === true,
    sourceQualityChecks: { ...rendering.qualityChecks }
  };
}

function validateSourceRenderings(renderings) {
  if (!Array.isArray(renderings)) {
    throw new Error("buildRuntimeAdapterPayload requires an array of WP12 copy renderings");
  }

  renderings.forEach(rendering => {
    if (!rendering || rendering.version !== SOURCE_RENDERING_VERSION) {
      throw new Error("buildRuntimeAdapterPayload requires copy-decision-rendering-v0-test-only renderings");
    }
    if (rendering.rendererMode !== ADAPTER_MODE) {
      throw new Error("WP14 adapter prototype only accepts test_only renderer output");
    }
    if (rendering.runtimeGate?.canRenderInRuntime !== false) {
      throw new Error("WP14 adapter prototype requires source runtimeGate.canRenderInRuntime === false");
    }
    if (!Array.isArray(rendering.sections) || rendering.sections.length === 0) {
      throw new Error("WP14 adapter prototype requires source sections");
    }
  });
}

export function buildRuntimeAdapterPayload(renderings, options = {}) {
  validateSourceRenderings(renderings);

  const previewSections = [];
  const paidSections = [];
  const safetyGuidanceSections = [];
  const internalDiagnostics = [];

  renderings.forEach(rendering => {
    rendering.sections.forEach((section, index) => {
      if (SAFETY_SECTION_TITLES.has(section.title)) {
        safetyGuidanceSections.push(cloneSection(section));
      } else if (index === 0) {
        previewSections.push(cloneSection(section));
      } else {
        paidSections.push(cloneSection(section));
      }
    });

    internalDiagnostics.push(buildInternalDiagnostic(rendering));
  });

  const payload = {
    version: ADAPTER_VERSION,
    adapterMode: ADAPTER_MODE,
    source: "wp12-copy-rendering",
    generatedFrom: [
      "WP3 driver stack",
      "WP4 report object",
      "WP9 copy decision metadata",
      "WP12 polished copy renderer",
      "WP14 test-only runtime adapter prototype"
    ],
    reportSurface: "prototype_only",
    previewSections,
    paidSections,
    safetyGuidanceSections,
    internalDiagnostics,
    ownerDebug: {
      generatedBy: options.generatedBy || "tests/driver-stack/runtimeAdapterPrototype.mjs",
      sourceRendererVersion: SOURCE_RENDERING_VERSION,
      sourceRenderingCount: renderings.length,
      sourceRuntimeCanRender: renderings.every(rendering => rendering.runtimeGate?.canRenderInRuntime === true),
      sourceFixtureNames: renderings.map(rendering => rendering.fixtureName),
      sourceRenderingContracts: renderings.map(rendering => ({
        version: rendering.version,
        decisionStatus: rendering.decisionStatus,
        rendererMode: rendering.rendererMode,
        runtimeGateCanRenderInRuntime: rendering.runtimeGate?.canRenderInRuntime === true,
        pass: rendering.pass === true
      }))
    },
    runtimeSafetyGate: {
      canRenderInRuntime: false,
      status: "HOLD",
      reason: "WP14 is a test-only adapter contract prototype and does not approve runtime integration."
    },
    paymentGate: {
      implemented: false,
      status: "NOT_IMPLEMENTED",
      paidContentField: "paidSections",
      safetyGuidanceBypassesPayment: true,
      safetyGuidanceRequiresPayment: false
    },
    qualityChecks: {
      userFacingInternalKeyLeak: false,
      surfacesSeparated: false,
      safetyGuidanceBypassesPayment: false,
      runtimeSafetyGateHold: false,
      sourceRendererGateRespected: false,
      exactFixtureCount: renderings.length === 2
    },
    pass: false
  };

  payload.qualityChecks.userFacingInternalKeyLeak = hasAdapterInternalKeyLeak(payload);
  payload.qualityChecks.surfacesSeparated =
    payload.previewSections.length > 0 &&
    payload.paidSections.length > 0 &&
    payload.safetyGuidanceSections.length > 0 &&
    payload.internalDiagnostics.length === renderings.length &&
    payload.ownerDebug.sourceFixtureNames.length === renderings.length;
  payload.qualityChecks.safetyGuidanceBypassesPayment =
    payload.safetyGuidanceSections.length > 0 &&
    payload.paymentGate.safetyGuidanceBypassesPayment === true &&
    payload.paymentGate.safetyGuidanceRequiresPayment === false;
  payload.qualityChecks.runtimeSafetyGateHold =
    payload.runtimeSafetyGate.canRenderInRuntime === false &&
    payload.runtimeSafetyGate.status === "HOLD";
  payload.qualityChecks.sourceRendererGateRespected =
    renderings.every(rendering => rendering.runtimeGate?.canRenderInRuntime === false);

  const validation = validateRuntimeAdapterPayload(payload);
  payload.pass = validation.pass;
  return payload;
}

export function buildRuntimeAdapterPayloadFromFixtures(fixtures = driverStackFixtures, options = {}) {
  const renderings = renderFixtureCopyDecisionSectionList(fixtures);
  return buildRuntimeAdapterPayload(renderings, {
    generatedBy: "tests/driver-stack/runtimeAdapterPrototype.mjs#fromFixtures",
    ...options
  });
}

export function collectAdapterUserFacingText(payload) {
  return userTextFromSections(flattenUserFacingSections(payload));
}

export function hasAdapterInternalKeyLeak(payload) {
  const userFacingText = typeof payload === "string"
    ? payload
    : collectAdapterUserFacingText(payload);
  return hasInternalKeyText(userFacingText);
}

export function validateRuntimeAdapterPayload(payload) {
  const errors = [];

  if (!payload || payload.version !== ADAPTER_VERSION) {
    errors.push("Payload version must be runtime-adapter-payload-v0-test-only.");
  }
  if (payload?.adapterMode !== ADAPTER_MODE) {
    errors.push("Payload adapterMode must remain test_only.");
  }
  if (payload?.source !== "wp12-copy-rendering") {
    errors.push("Payload source must be wp12-copy-rendering.");
  }
  if (payload?.reportSurface !== "prototype_only") {
    errors.push("Payload reportSurface must be prototype_only.");
  }
  if (payload?.runtimeSafetyGate?.canRenderInRuntime !== false || payload?.runtimeSafetyGate?.status !== "HOLD") {
    errors.push("Runtime safety gate must remain HOLD and false.");
  }
  if (
    payload?.paymentGate?.implemented !== false ||
    payload?.paymentGate?.safetyGuidanceBypassesPayment !== true ||
    payload?.paymentGate?.safetyGuidanceRequiresPayment !== false
  ) {
    errors.push("Payment gate must remain unimplemented while safety guidance bypasses payment.");
  }
  if (!Array.isArray(payload?.previewSections) || payload.previewSections.length !== 2) {
    errors.push("Preview must contain one sanitized opening section for each approved rendering.");
  }
  if (!Array.isArray(payload?.paidSections) || payload.paidSections.length < 6) {
    errors.push("Paid sections must contain ordinary depth sections.");
  }
  if (!Array.isArray(payload?.safetyGuidanceSections) || payload.safetyGuidanceSections.length < 1) {
    errors.push("Safety/professional guidance must be separated from paid report sections.");
  }
  if (!Array.isArray(payload?.internalDiagnostics) || payload.internalDiagnostics.length !== 2) {
    errors.push("Internal diagnostics must retain two source diagnostic records.");
  }
  if (!payload?.ownerDebug || !Array.isArray(payload.ownerDebug.sourceFixtureNames)) {
    errors.push("Owner/admin-only debug must retain source fixture names outside user-facing surfaces.");
  }
  if (hasAdapterInternalKeyLeak(payload)) {
    errors.push("User-facing adapter surfaces must not leak internal keys.");
  }
  if (payload?.qualityChecks?.sourceRendererGateRespected !== true) {
    errors.push("Adapter must preserve source runtimeGate.canRenderInRuntime === false.");
  }
  if (payload?.qualityChecks?.exactFixtureCount !== true) {
    errors.push("Adapter must map exactly two WP12 copy decision renderings.");
  }

  return {
    pass: errors.length === 0,
    errors
  };
}
~~~

## Full Content: `tests/driver-stack/runtimeAdapterPrototype.test.js`

~~~js
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
~~~

## Full Content: `tests/driver-stack/exportRuntimeAdapterPrototype.mjs`

~~~js
import { buildRuntimeAdapterPayloadFromFixtures } from "./runtimeAdapterPrototype.mjs";
import { driverStackFixtures } from "./driverStackFixtures.mjs";

const payload = buildRuntimeAdapterPayloadFromFixtures(driverStackFixtures, {
  generatedBy: "tests/driver-stack/exportRuntimeAdapterPrototype.mjs"
});

console.log(JSON.stringify({
  version: "runtime-adapter-prototype-export-v0-test-only",
  generatedBy: "tests/driver-stack/exportRuntimeAdapterPrototype.mjs",
  recommendation: "READY FOR OWNER REVIEW OF TEST-ONLY RUNTIME ADAPTER CONTRACT",
  runtimeIntegrationApproved: false,
  payload
}, null, 2));
~~~

## Full Content: `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-contract.md`

~~~markdown
# WP14 Test-Only Runtime Adapter Contract

## Purpose

WP14 creates a test-only runtime adapter contract prototype. It proves how existing WP12 copy rendering output can be transformed into a sanitized prototype payload.

Runtime implementation is NOT approved by WP14.

## Exact export artifact

- `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-prototype-results.json`

## Exact adapter payload top-level key order

```js
[
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
]
```

## Exact scalar contract

| Field | Required value | Current value |
| --- | --- | --- |
| `version` | `runtime-adapter-payload-v0-test-only` | `runtime-adapter-payload-v0-test-only` |
| `adapterMode` | `test_only` | `test_only` |
| `source` | `wp12-copy-rendering` | `wp12-copy-rendering` |
| `reportSurface` | `prototype_only` | `prototype_only` |
| `runtimeSafetyGate.canRenderInRuntime` | `false` | `false` |
| `paymentGate.safetyGuidanceRequiresPayment` | `false` | `false` |
| `pass` | `true` | `true` |

## Required exports

- `buildRuntimeAdapterPayload(renderings, options = {})`
- `buildRuntimeAdapterPayloadFromFixtures(fixtures, options = {})`
- `collectAdapterUserFacingText(payload)`
- `hasAdapterInternalKeyLeak(payload)`
- `validateRuntimeAdapterPayload(payload)`

## Non-goals

WP14 does not modify runtime, app.js, production rendering, deploy, PDF, payment, QPay, backend, pricing, entitlement, WP3 scoring, WP3 fixtures, WP4 report object contract, WP9 metadata contract, or WP10/WP12 renderer contract.
~~~

## Full Content: `audits/mvp-diagnostic-migration/work-pack-14/surface-allocation-rules.md`

~~~markdown
# WP14 Surface Allocation Rules

## Purpose

This document records the exact adapter surface names and allocation rules.

## Surface counts

| Field | Count | User-facing | Rule |
| --- | ---: | --- | --- |
| `previewSections` | 2 | Yes | One sanitized opening section per approved rendering. |
| `paidSections` | 7 | Yes | Ordinary report depth only; no payment implementation in WP14. |
| `safetyGuidanceSections` | 1 | Yes | Professional/safety guidance; never requires payment. |
| `internalDiagnostics` | 2 | No | Internal QA diagnostics only. |
| `ownerDebug` | 2 source records | No | Owner/admin-only source contract debug. |

## User-facing text collection

`collectAdapterUserFacingText(payload)` reads only:

- `previewSections`
- `paidSections`
- `safetyGuidanceSections`

It excludes `internalDiagnostics` and `ownerDebug`.

Runtime implementation is NOT approved by WP14.
~~~

## Full Content: `audits/mvp-diagnostic-migration/work-pack-14/safety-payment-adapter-rules.md`

~~~markdown
# WP14 Safety Payment Adapter Rules

## Purpose

This document records the safety/payment boundary represented by the test-only adapter contract.

## Contract rule

Safety/professional guidance must not require payment.

## Current gate values

| Field | Value |
| --- | --- |
| `paymentGate.implemented` | `false` |
| `paymentGate.status` | `NOT_IMPLEMENTED` |
| `paymentGate.paidContentField` | `paidSections` |
| `paymentGate.safetyGuidanceBypassesPayment` | `true` |
| `paymentGate.safetyGuidanceRequiresPayment` | `false` |

## Required invariant

`safetyGuidanceSections` must remain separate from `paidSections`, and `paymentGate.safetyGuidanceRequiresPayment` must remain `false`.

Runtime implementation is NOT approved by WP14.
~~~

## Full Content: `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-test-coverage.md`

~~~markdown
# WP14 Runtime Adapter Test Coverage

## Required checks

| Command | Required result |
| --- | --- |
| `git diff --check` | PASS |
| `node --check app.js` | PASS |
| `node --check tests/driver-stack/runtimeAdapterPrototype.mjs` | PASS |
| `node --check tests/driver-stack/exportRuntimeAdapterPrototype.mjs` | PASS |
| `node tests/driver-stack/runtimeAdapterPrototype.test.js` | PASS |
| `node tests/driver-stack/exportRuntimeAdapterPrototype.mjs > /tmp/wp14_runtime_adapter_check.json` | PASS |
| exact contract `node -e` check | PASS |
| `npm test` | PASS |
| forbidden runtime/product diffs | Empty |
| WP9/WP12 source-contract diffs | Empty |

## Test assertions

- Required exports exist.
- Payload top-level key order is exact.
- Required scalar fields match the owner check.
- Required surface fields exist and are arrays where required.
- User-facing text does not leak internal keys.
- Runtime safety gate remains false.
- Safety guidance does not require payment.
- Source WP12 renderings are not mutated.

Runtime implementation is NOT approved by WP14.
~~~

## Full Content: `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-prototype-results.json`

~~~json
{
  "version": "runtime-adapter-prototype-export-v0-test-only",
  "generatedBy": "tests/driver-stack/exportRuntimeAdapterPrototype.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY RUNTIME ADAPTER CONTRACT",
  "runtimeIntegrationApproved": false,
  "payload": {
    "version": "runtime-adapter-payload-v0-test-only",
    "adapterMode": "test_only",
    "source": "wp12-copy-rendering",
    "generatedFrom": [
      "WP3 driver stack",
      "WP4 report object",
      "WP9 copy decision metadata",
      "WP12 polished copy renderer",
      "WP14 test-only runtime adapter prototype"
    ],
    "reportSurface": "prototype_only",
    "previewSections": [
      {
        "title": "Ил харагдаж байгаа зүйл",
        "body": "Хэт чанга барьсан өдөр, эсвэл хоолоо удаан хойшлуулсны дараа орой болон дараагийн хоолон дээр өлсөлт огцом хүчтэй санагдаж магадгүй. Энэ нь зангийн алдаа биш. Бие дараагийн хоол найдвартай ирэхийг, өлсөлтөө тайван нөхөх боломж хэрэгтэйг сануулж байгаа дохио байж болно."
      },
      {
        "title": "Ил харагдаж байгаа зүйл",
        "body": "Биеийн өөрчлөлт ойлгомжгүй санагдах үед хоол, жин, хэмжилтээр нэг юм барьж авах хүсэл нэмэгдэж магадгүй. Энэ нь биеэ буруутгах шалтгаан биш; тодорхойгүй үед илүү тогтвортой санагдах нэг зүйл хайж байгаа оролдлого байж болно."
      }
    ],
    "paidSections": [
      {
        "title": "Цаана нь ажиллаж байгаа зүйл",
        "body": "Энд зөвхөн өлсөлт биш, “аль хэдийн алдсан” гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Дараа нь “маргаашнаас бүр ч чангална” гэсэн бодол нэмэгдэхээр хоол түр тайвшруулах, өөрийгөө шийтгэсэн мэдрэмжээс гаргах арга шиг ажиллаж магадгүй."
      },
      {
        "title": "Эхний зөөлөн өөрчлөлт",
        "body": "Маргаашийг хүлээж өөрийгөө дахин чангалах биш, дараагийн хоолоо алгасахгүй, шийтгэлгүй эхлүүл. Гол нь төгс хоол сонгох биш; өлсөлтөө тайван дарах, сууж идэх, тэр өдрийг цааш үргэлжлүүлэх жижиг зөөлөн алхам хийх юм."
      },
      {
        "title": "14 хоногийн туршилтын таамаг",
        "body": "Хэрэв дараагийн хоолыг шийтгэл биш шинэ эхлэл болгож үзвэл оройн хэцүү мөч багасч, долоо хоногийн эхэнд бүхнийг дахин эхлүүлэх дарамт сулрах эсэхийг ажиглана. Энэ бол тушаал биш, таны биед юу илүү зөөлөн нөлөөлж байгааг шалгах жижиг туршилт."
      },
      {
        "title": "7 хоногийн баталгаажуулах тэмдэглэл",
        "body": "Долоо хоногт оройн өлсөлт, хоолоо хойшлуулсан эсэх, төлөвлөгөө хазайсны дараа өөрийгөө буруутгасан эсэх, дараагийн хоолоо шийтгэлгүй үргэлжлүүлж чадсан эсэхээ богино тэмдэглэ. Энэ нь өөрийгөө шүүхэд биш, аль мөчид дахин эхлэх дарамт нэмэгддэгийг танихад зориулагдана."
      },
      {
        "title": "Эхний зөөлөн өөрчлөлт",
        "body": "Хоолыг улам чангалж өөрийгөө батлахын оронд 7 хоногийн турш нойр, өлсөх, энергийн хэмнэлээ биеийг шүүхгүйгээр богино тэмдэглэ. Зорилго нь буруутан олох биш, ямар үед таны бие арай тогтвортой санагдаж байгааг анзаарах."
      },
      {
        "title": "14 хоногийн туршилтын таамаг",
        "body": "Хэрэв хяналтаа буцааж авах оролдлогыг илүү зөөлөн ажиглалт руу шилжүүлбэл хоолны хатуу шийдвэр багасч, давтагдаж байгаа биеийн дохиог илүү тайван ялгах боломж нэмэгдэх эсэхийг шалгана. Мэргэжлийн тодруулга хэрэгтэй байж магадгүй хэсгийг хойшлуулахгүй, тайван асуулт болгон авч явна."
      },
      {
        "title": "7 хоногийн баталгаажуулах тэмдэглэл",
        "body": "Долоо хоногт нойр, өлсөх, энергийн хэмнэл болон давтагдаж байгаа биеийн дохиог дүгнэлтгүй богино тэмдэглэ. Хэрэв нэг хэв шинж давтагдвал өөрөө оношлохын оронд мэргэжлийн хүнтэй тайван тодруулах асуулт болгон авч явна."
      }
    ],
    "safetyGuidanceSections": [
      {
        "title": "Зөөлөн мэргэжлийн гүүр",
        "body": "Энэ нь онош биш. Хэрэв биеийн дохио, мөчлөг, эсвэл хэрэглэж буй эмтэй холбоотой санаа зовнил давтагдаж байвал шалтгаан гэж дүгнэхээс өмнө мэргэжлийн хүнтэй тайван тодруулах хэрэгтэй байж магадгүй."
      }
    ],
    "internalDiagnostics": [
      {
        "fixtureName": "all_or_nothing_restriction_rebound",
        "decisionStatus": "owner_recommended",
        "safetyMode": "mode1",
        "rendererMode": "test_only",
        "runtimeGate": {
          "canRenderInRuntime": false,
          "requiredBeforeRuntime": [
            "Owner approval of copy decision metadata.",
            "Test-only prototype proves supplementaryNarrative renders without internal keys.",
            "Runtime copy includes hunger-safety and relief/restart-pressure narrative.",
            "No strict diet, shame-language, or compensate-tomorrow regression."
          ]
        },
        "sourcePass": true,
        "sourceQualityChecks": {
          "internalKeyLeak": false,
          "shameLanguage": false,
          "medicalCauseClaim": false,
          "diagnosisClaim": false,
          "treatmentAdvice": false,
          "runtimeGateRespected": true,
          "experimentIsObservation": true,
          "diaryIsObservation": true
        }
      },
      {
        "fixtureName": "pcos_body_uncertainty_control",
        "decisionStatus": "owner_recommended",
        "safetyMode": "mode1",
        "rendererMode": "test_only",
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
        "sourcePass": true,
        "sourceQualityChecks": {
          "internalKeyLeak": false,
          "shameLanguage": false,
          "medicalCauseClaim": false,
          "diagnosisClaim": false,
          "treatmentAdvice": false,
          "runtimeGateRespected": true,
          "experimentIsObservation": true,
          "diaryIsObservation": true
        }
      }
    ],
    "ownerDebug": {
      "generatedBy": "tests/driver-stack/exportRuntimeAdapterPrototype.mjs",
      "sourceRendererVersion": "copy-decision-rendering-v0-test-only",
      "sourceRenderingCount": 2,
      "sourceRuntimeCanRender": false,
      "sourceFixtureNames": [
        "all_or_nothing_restriction_rebound",
        "pcos_body_uncertainty_control"
      ],
      "sourceRenderingContracts": [
        {
          "version": "copy-decision-rendering-v0-test-only",
          "decisionStatus": "owner_recommended",
          "rendererMode": "test_only",
          "runtimeGateCanRenderInRuntime": false,
          "pass": true
        },
        {
          "version": "copy-decision-rendering-v0-test-only",
          "decisionStatus": "owner_recommended",
          "rendererMode": "test_only",
          "runtimeGateCanRenderInRuntime": false,
          "pass": true
        }
      ]
    },
    "runtimeSafetyGate": {
      "canRenderInRuntime": false,
      "status": "HOLD",
      "reason": "WP14 is a test-only adapter contract prototype and does not approve runtime integration."
    },
    "paymentGate": {
      "implemented": false,
      "status": "NOT_IMPLEMENTED",
      "paidContentField": "paidSections",
      "safetyGuidanceBypassesPayment": true,
      "safetyGuidanceRequiresPayment": false
    },
    "qualityChecks": {
      "userFacingInternalKeyLeak": false,
      "surfacesSeparated": true,
      "safetyGuidanceBypassesPayment": true,
      "runtimeSafetyGateHold": true,
      "sourceRendererGateRespected": true,
      "exactFixtureCount": true
    },
    "pass": true
  }
}
~~~

## Full Content: `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-prototype-summary.md`

~~~markdown
# WP14 Runtime Adapter Prototype Summary

## Summary

WP14 provides a test-only runtime adapter contract prototype. The adapter consumes WP12 copy rendering output and returns a sanitized payload with exact contract names.

## Generated artifact summary

| Field | Value |
| --- | --- |
| Export version | `runtime-adapter-prototype-export-v0-test-only` |
| Recommendation | `READY FOR OWNER REVIEW OF TEST-ONLY RUNTIME ADAPTER CONTRACT` |
| Payload version | `runtime-adapter-payload-v0-test-only` |
| Adapter mode | `test_only` |
| Source | `wp12-copy-rendering` |
| Report surface | `prototype_only` |
| Runtime can render | `false` |
| Safety guidance requires payment | `false` |
| Payload pass | `true` |

## Fixture scope

WP14 adapts exactly the two WP12 copy-decision renderings already produced by the test-only renderer. It does not expand fixture eligibility.

Runtime implementation is NOT approved by WP14.
~~~

## Full Content: `audits/mvp-diagnostic-migration/work-pack-14/wp14-risk-register.md`

~~~markdown
# WP14 Risk Register

## Purpose

This risk register captures remaining risks before any future runtime implementation.

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Runtime code consumes prototype directly | High | Keep runtime safety gate false and require a later approved implementation pack. |
| Surface key drift | High | Exact key order is locked in `runtimeAdapterPrototype.test.js` and owner artifacts. |
| Safety guidance treated as paid content | High | `paymentGate.safetyGuidanceRequiresPayment` is locked to `false`. |
| Internal key leak | High | User-facing text collection excludes diagnostics/debug and is scanned. |
| Source contract mutation | High | Test asserts WP12 renderings are not mutated. |
| Production behavior regression | High | Runtime/product diffs must stay empty. |

Runtime implementation is NOT approved by WP14.
~~~

## Full Content: `audits/mvp-diagnostic-migration/work-pack-14/work-pack-14-recommendation.md`

~~~markdown
# Work Pack 14 Recommendation

Recommendation: `READY FOR OWNER REVIEW OF TEST-ONLY RUNTIME ADAPTER CONTRACT`

## What WP14 proves

- The adapter consumes WP12 copy rendering output.
- The exact required payload key order is preserved.
- `source` is exactly `wp12-copy-rendering`.
- `reportSurface` is exactly `prototype_only`.
- `previewSections`, `paidSections`, and `safetyGuidanceSections` are arrays.
- `internalDiagnostics` and `ownerDebug` are not user-facing.
- `runtimeSafetyGate.canRenderInRuntime` remains `false`.
- `paymentGate.safetyGuidanceRequiresPayment` remains `false`.

## Not approved

WP14 does not approve runtime implementation, app.js changes, production rendering, deploy, PDF generation, payment/QPay/backend/pricing/entitlement work, WP3 scoring or fixture changes, WP4 report object changes, WP9 metadata changes, or WP10/WP12 renderer changes.

Runtime implementation is NOT approved by WP14.
~~~

## Owner Pack Final Decision

READY FOR OWNER REVIEW OF TEST-ONLY RUNTIME ADAPTER CONTRACT

Runtime implementation is NOT approved by WP14.
