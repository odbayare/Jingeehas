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
