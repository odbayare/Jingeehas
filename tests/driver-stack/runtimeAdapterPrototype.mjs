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
