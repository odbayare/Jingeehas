import { buildDriverStack } from "./driverStackTestCalculator.mjs";
import { driverStackFixtures } from "./driverStackFixtures.mjs";

const REPORT_VERSION = "driver-stack-report-object-v0-test-only";

function compactDriver(driver) {
  if (!driver) return null;
  return {
    key: driver.key,
    layer: driver.layer,
    normalizedScore: driver.normalizedScore,
    strength: driver.strength
  };
}

function compactSecondaryDriver(driver) {
  return {
    key: driver.key,
    layer: driver.layer,
    normalizedScore: driver.normalizedScore,
    strength: driver.strength,
    relationshipToPrimary: driver.relationship_to_primary
  };
}

function compactFirstGentleChange(change) {
  return {
    id: change.id,
    targets: change.targets,
    action: change.action,
    whyThisFirst: change.why_this_first
  };
}

function compactDriverScore(score) {
  return {
    key: score.key,
    layer: score.layer,
    normalizedScore: score.normalizedScore,
    strength: score.strength,
    confidence: score.confidence,
    directEvidenceCount: score.directEvidenceCount,
    diaryEvidenceCount: score.diaryEvidenceCount,
    inferredOnly: score.inferredOnly
  };
}

function activeDriverScores(driverScores) {
  return Object.values(driverScores)
    .filter(score => score.normalizedScore > 0)
    .sort((a, b) => b.normalizedScore - a.normalizedScore || b.rawScore - a.rawScore || a.key.localeCompare(b.key))
    .map(compactDriverScore);
}

function safetySummary(safetyRoute) {
  const professionalFirst = !safetyRoute.ordinary_report_allowed || !safetyRoute.ordinary_experiment_allowed;
  return {
    mode: safetyRoute.mode,
    ordinaryReportAllowed: safetyRoute.ordinary_report_allowed,
    ordinaryExperimentAllowed: safetyRoute.ordinary_experiment_allowed,
    professionalFirst,
    safetyDrivers: safetyRoute.safety_drivers,
    reasonCodes: safetyRoute.reason_codes
  };
}

export function buildDriverStackReportObject(stack, options = {}) {
  if (!stack || stack.version !== "driver-stack-v0-test-only") {
    throw new Error("buildDriverStackReportObject requires a driver-stack-v0-test-only object");
  }

  const safety = safetySummary(stack.safety_route);
  const primaryDriver = compactDriver(stack.primary_driver);
  const secondaryDrivers = stack.secondary_drivers.map(compactSecondaryDriver);
  const activeScores = activeDriverScores(stack.driver_scores);
  const fourteenDayExperiment = safety.ordinaryExperimentAllowed ? {
    id: stack.first_gentle_change.id,
    hypothesis: stack.fourteen_day_experiment_hypothesis.hypothesis,
    durationDays: stack.fourteen_day_experiment_hypothesis.duration_days,
    dailyAction: stack.fourteen_day_experiment_hypothesis.daily_action,
    track: stack.fourteen_day_experiment_hypothesis.track,
    successSignal: stack.fourteen_day_experiment_hypothesis.success_signal,
    recoveryRule: stack.fourteen_day_experiment_hypothesis.recovery_rule
  } : null;
  const firstGentleChange = compactFirstGentleChange(stack.first_gentle_change);

  return {
    version: REPORT_VERSION,
    fixtureName: options.fixtureName || null,
    safetyMode: safety.mode,
    sourceSummary: {
      sourceVersion: stack.version,
      stageAnswerCount: stack.source.stage_answer_count,
      diaryEntryCount: stack.source.diary_entry_count,
      evidenceQuality: stack.source.evidence_quality,
      currentReportMode: stack.source.current_report_mode,
      testOnly: true
    },
    primaryDriver,
    secondaryDrivers,
    interaction: stack.interaction_pattern,
    vulnerableMoment: stack.vulnerable_moment,
    visibleCondition: stack.visible_condition,
    hiddenFoodFunction: stack.hidden_food_function,
    wrongSelfExplanation: stack.wrong_self_explanation,
    firstGentleChange,
    fourteenDayExperiment,
    sevenDayDiaryConfirmation: stack.seven_day_diary_confirmation_targets,
    safetyBlock: {
      mode: safety.mode,
      ordinaryReportAllowed: safety.ordinaryReportAllowed,
      ordinaryExperimentAllowed: safety.ordinaryExperimentAllowed,
      professionalFirst: safety.professionalFirst,
      safetyDrivers: safety.safetyDrivers,
      reasonCodes: safety.reasonCodes,
      suppressOrdinaryExperiment: !safety.ordinaryExperimentAllowed
    },
    evidenceExplanation: {
      activeDriverScores: activeScores,
      evidenceSources: stack.evidence_sources,
      topDrivers: activeScores.slice(0, 8).map(score => score.key)
    },
    copyConstraints: stack.copy_constraints,
    ownerReviewFlags: {
      testOnly: true,
      runtimeIntegration: false,
      recommendation: "READY FOR OWNER REVIEW OF TEST-ONLY REPORT OBJECT",
      runtimeIntegrationEnabled: false,
      modifiesAppJs: false,
      modifiesRuntimeReport: false,
      modifiesReportCopy: false,
      modifiesPdf: false,
      modifiesPaymentOrEntitlement: false,
      noDeploy: true,
      noDietPlan: stack.copy_constraints.includes("no_diet_plan"),
      noCalorieTracking: stack.copy_constraints.includes("no_calorie_tracking"),
      noOneTypeLabel: stack.copy_constraints.includes("no_one_type_label"),
      noShameLanguage: stack.copy_constraints.includes("no_shame_language"),
      safetySuppressesOrdinaryExperiment: !safety.professionalFirst || !safety.ordinaryExperimentAllowed
    }
  };
}

export function buildFixtureReportObject(fixture) {
  const stack = buildDriverStack(fixture.state);
  return buildDriverStackReportObject(stack, { fixtureName: fixture.name });
}

export function buildFixtureReportObjects(fixtures = driverStackFixtures) {
  return fixtures.map(buildFixtureReportObject);
}

export function renderDriverStackReportMarkdown(reportObject) {
  const primary = reportObject.primaryDriver?.key || "professional_first";
  const secondary = reportObject.secondaryDrivers.map(driver => driver.key).join(", ") || "none";
  const lines = [
    `# Driver Stack Report Object: ${reportObject.fixtureName || "unlabeled"}`,
    "",
    ...(reportObject.safetyBlock.professionalFirst ? [
      "## Аюулгүй байдлын чиглэл",
      "",
      `- ${reportObject.safetyMode}`,
      ""
    ] : []),
    "## Ил харагдаж байгаа зүйл",
    "",
    `- ${reportObject.visibleCondition.key}`,
    "",
    "## Цаана нь ажиллаж байгаа зүйл",
    "",
    `- ${secondary}`,
    "",
    "## Эмзэг мөч",
    "",
    `- ${reportObject.vulnerableMoment.id}`,
    "",
    "## Хоолны далд үүрэг",
    "",
    `- ${reportObject.hiddenFoodFunction.key}`,
    "",
    "## Буруу өөр тайлбар",
    "",
    `- ${reportObject.wrongSelfExplanation.key}`,
    "",
    "## Эхний зөөлөн өөрчлөлт",
    "",
    `- ${reportObject.firstGentleChange.id}`,
    "",
    "## 14 хоногийн туршилтын таамаг",
    "",
    `- ${reportObject.fourteenDayExperiment?.id || "suppressed"}`,
    "",
    "## 7 хоногийн баталгаажуулах тэмдэглэл",
    "",
    `- ${reportObject.sevenDayDiaryConfirmation.map(target => target.driver_key).join(", ")}`,
    "",
    "## Техникийн owner review snapshot",
    "",
    `- Version: ${reportObject.version}`,
    `- Test only: ${reportObject.sourceSummary.testOnly}`,
    `- Safety mode: ${reportObject.safetyMode}`,
    `- Ordinary report allowed: ${reportObject.safetyBlock.ordinaryReportAllowed}`,
    `- Ordinary experiment allowed: ${reportObject.safetyBlock.ordinaryExperimentAllowed}`,
    `- Primary driver: ${primary}`,
    `- Secondary drivers: ${secondary}`,
    `- Interaction: ${reportObject.interaction.id}`,
    `- Vulnerable moment: ${reportObject.vulnerableMoment.id}`,
    `- Visible condition: ${reportObject.visibleCondition.key}`,
    `- Hidden food function: ${reportObject.hiddenFoodFunction.key}`,
    `- First gentle change: ${reportObject.firstGentleChange.id}`,
    `- Fourteen day experiment: ${reportObject.fourteenDayExperiment?.id || "suppressed"}`,
    `- Seven day confirmation: ${reportObject.sevenDayDiaryConfirmation.map(target => target.driver_key).join(", ")}`,
    "",
    "## Owner Review Flags",
    "",
    ...Object.entries(reportObject.ownerReviewFlags).map(([key, value]) => `- ${key}: ${value}`)
  ];
  return `${lines.join("\n")}\n`;
}
