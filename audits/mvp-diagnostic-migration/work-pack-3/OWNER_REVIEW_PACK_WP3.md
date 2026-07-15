# Work Pack 3 Owner Review Pack

## Recommendation Enum

~~~~~~text
READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK
~~~~~~
## Fixture Result Artifact Wrapper Contract

~~~~~~json
{
  "version": "driver-stack-v0-test-only",
  "generatedBy": "tests/driver-stack/exportDriverStackFixtureResults.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK",
  "approvedFixtureNames": [],
  "fixtureCount": 10,
  "results": []
}
~~~~~~

## Compact Result Item Contract

~~~~~~json
{
  "name": "shift_work_recovery_only",
  "safetyMode": "mode1",
  "primaryDriverKeys": ["shift_work"],
  "secondaryDriverKeys": ["quick_recovery"],
  "interactionId": "shift_work_recovery_only",
  "vulnerableMomentId": "shift_work_recovery_only",
  "firstGentleChangeId": "shift_recovery_anchor",
  "experimentId": "shift_recovery_anchor",
  "hiddenFoodFunctionKey": "quick_recovery",
  "pass": true
}
~~~~~~

## Repository State

### git status --short

~~~~~~text
 M tests/run-all.js
?? audits/mvp-diagnostic-migration/work-pack-3/
?? audits/sprint-36-paid-depth-prototype/
?? tests/driver-stack/
~~~~~~

### git diff --stat

~~~~~~text
 tests/run-all.js | 3 +++
 1 file changed, 3 insertions(+)
~~~~~~

### git diff -- tests/run-all.js

~~~~~~diff
diff --git a/tests/run-all.js b/tests/run-all.js
index 740d1d0..5e0643e 100644
--- a/tests/run-all.js
+++ b/tests/run-all.js
@@ -7,6 +7,9 @@ const commands = [
   ["node", ["tests/report-bible-sections.test.js"]],
   ["node", ["tests/question-metadata-mechanisms.test.js"]],
   ["node", ["tests/evidence-scoring-calibration.test.js"]],
+  ["node", ["tests/driver-stack/driverStackContract.test.js"]],
+  ["node", ["tests/driver-stack/driverStackFixtures.test.js"]],
+  ["node", ["tests/driver-stack/driverStackSafetyInvariants.test.js"]],
   ["node", ["tests/virtual-user-qa.test.js"]],
   ["node", ["tests/ten-person-simulation-audit.test.js"]],
   ["node", ["tests/partial-persona-fix.test.js"]],
~~~~~~

## Validation Commands and Results

### node tests/driver-stack/driverStackContract.test.js

~~~~~~text
driverStackContract tests passed
~~~~~~

### node tests/driver-stack/driverStackFixtures.test.js

~~~~~~text
driverStackFixtures tests passed
~~~~~~

### node tests/driver-stack/driverStackSafetyInvariants.test.js

~~~~~~text
driverStackSafetyInvariants tests passed
~~~~~~

### node tests/driver-stack/exportDriverStackFixtureResults.mjs > /private/tmp/wp3f_owner_export_check.json

~~~~~~text
exportDriverStackFixtureResults completed
~~~~~~

### rg removed fixture result artifact keys

~~~~~~text
No removed debug/full result keys found
~~~~~~

### git diff --check

~~~~~~text
~~~~~~

## tests/run-all.js

~~~~~~js
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

~~~~~~

## tests/driver-stack/driverStackTestCalculator.mjs

~~~~~~js
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const app = require("../../app.js");

const {
  calculateMechanismEvidence,
  getOptionMetadata,
  mechanismNamesByKey
} = app;

export const DRIVER_LAYERS = {
  body_rhythm: ["shift_work", "sleep_disruption", "meal_gap", "evening_hunger", "fatigue", "body_change_uncertainty", "medical_concern"],
  psychology: ["stress", "anxiety", "anger_resentment", "loneliness", "emptiness", "shame", "guilt", "loss_of_control_feeling"],
  food_function: ["quick_recovery", "decompression", "comfort", "self_reward", "loneliness_soothing", "control_regain", "hunger_safety", "belonging", "escape_from_shame", "escape_from_failure"],
  habit_environment: ["visible_snacks", "delivery_app", "nearby_store", "cafeteria", "food_photo_cue", "social_table", "alcohol_context", "low_friction_default"],
  restriction_rebound: ["all_or_nothing", "monday_restart", "strict_diet", "fasting_rebound", "carb_cut_rebound", "punishment_restriction"],
  safety: ["binge_risk", "compensatory_behavior", "severe_body_distress", "medical_red_flag", "professional_first"]
};

const EXPECTED_MAX_BY_LAYER = {
  body_rhythm: 12,
  psychology: 10,
  food_function: 10,
  habit_environment: 9,
  restriction_rebound: 10,
  safety: 3
};

const EXPECTED_MAX_BY_DRIVER = {
  shift_work: 8,
  body_change_uncertainty: 8,
  medical_concern: 8
};

const DRIVER_PRIORITY = [
  "meal_gap",
  "evening_hunger",
  "stress",
  "visible_snacks",
  "food_photo_cue",
  "social_table",
  "all_or_nothing",
  "sleep_disruption",
  "shift_work",
  "quick_recovery",
  "body_change_uncertainty",
  "medical_concern",
  "fatigue",
  "low_friction_default",
  "loneliness",
  "monday_restart",
  "decompression",
  "comfort",
  "self_reward"
];

const OLD_MECHANISM_TO_DRIVERS = {
  reward: [["self_reward", 0.45], ["comfort", 0.2]],
  regulation: [["decompression", 0.45], ["comfort", 0.25]],
  hungerSafety: [["hunger_safety", 0.15]],
  glucose: [["medical_concern", 0.8], ["medical_red_flag", 0.6], ["professional_first", 0.6]],
  satiety: [["loss_of_control_feeling", 0.45]],
  cue: [["low_friction_default", 0.45], ["visible_snacks", 0.45], ["food_photo_cue", 0.45]],
  collapse: [["all_or_nothing", 0.45], ["monday_restart", 0.45], ["guilt", 0.25], ["escape_from_failure", 0.25]],
  executive: [["fatigue", 0.45], ["low_friction_default", 0.45], ["quick_recovery", 0.2]],
  circadian: [["sleep_disruption", 0.25], ["fatigue", 0.25]],
  social: [["social_table", 0.45], ["belonging", 0.45]],
  medical: [["medical_concern", 0.8], ["body_change_uncertainty", 0.25], ["professional_first", 0.25]],
  autonomy: [["anger_resentment", 0.45], ["strict_diet", 0.45], ["control_regain", 0.25]],
  physiological: [["medical_concern", 0.35], ["quick_recovery", 0.2]],
  decisionDefault: [["low_friction_default", 0.7]],
  rewardDeficit: [["self_reward", 0.45], ["emptiness", 0.45], ["comfort", 0.25]],
  roleOverload: [["fatigue", 0.45], ["self_reward", 0.25], ["comfort", 0.25], ["low_friction_default", 0.25]],
  shameAvoidance: [["shame", 0.45], ["guilt", 0.45], ["escape_from_shame", 0.45]],
  bodySafety: [["body_change_uncertainty", 0.45], ["shame", 0.45], ["escape_from_shame", 0.45], ["severe_body_distress", 0.45]],
  identity: [["escape_from_failure", 0.45], ["shame", 0.25], ["all_or_nothing", 0.25]],
  perfectionism: [["all_or_nothing", 0.45], ["strict_diet", 0.45], ["monday_restart", 0.25], ["punishment_restriction", 0.25]]
};

const MECHANISM_NAME_TO_KEY = Object.fromEntries(
  Object.entries(mechanismNamesByKey).map(([key, name]) => [name, key])
);

export function emptyTestState(overrides = {}) {
  return {
    packageType: "removed-feature",
    stageAnswers: {},
    stageVoiceSummaries: {},
    preliminary: [],
    removedEntries: [],
    ...overrides
  };
}

export function makeConfirmedSummary(appExports, { kind = "diary", id = "D-V01", dayNumber = 1, structured = {}, bullets = [] } = {}) {
  return appExports.createConfirmedSummaryObject({
    kind,
    id,
    dayNumber,
    rawText: `fixture raw ${dayNumber}`,
    structured,
    aiSummaryBullets: bullets.length ? bullets : ["Тэмдэглэл баталгаажсан"],
    mode: "confirm"
  });
}

export function makeDiaryEntry(appExports, day, overrides = {}, bullets = []) {
  const structured = {
    diary_id: `fixture-${day}`,
    day_number: day,
    date: `2026-07-${String(day).padStart(2, "0")}`,
    meal_rhythm: "Тогтуун, хоол алгасаагүй",
    unplanned_eating_count: "Үгүй",
    main_moment_time: "Өнөөдөр тийм зүйл гараагүй",
    hunger_level: "3",
    food_function: [],
    emotion: "Тайван",
    stress_score: "2",
    energy_score: "7",
    sleep: ["6-8 цаг"],
    drinks: ["Ус голдуу"],
    body_signals: ["Аль нь ч үгүй"],
    movement: "Бага зэрэг алхсан",
    pattern_probes: {},
    ...overrides
  };
  const confirmedSummaryObject = Object.prototype.hasOwnProperty.call(overrides, "confirmedSummaryObject")
    ? overrides.confirmedSummaryObject
    : makeConfirmedSummary(appExports, { dayNumber: day, structured, bullets });
  return { ...structured, confirmedSummaryObject };
}

function allDriverKeys() {
  return Object.values(DRIVER_LAYERS).flat();
}

function layerForDriver(key) {
  return Object.entries(DRIVER_LAYERS).find(([, keys]) => keys.includes(key))?.[0] || "unknown";
}

function expectedMaxForDriver(key) {
  if (EXPECTED_MAX_BY_DRIVER[key]) return EXPECTED_MAX_BY_DRIVER[key];
  return EXPECTED_MAX_BY_LAYER[layerForDriver(key)] || 10;
}

export function normalizeDriverScore(rawScore, expectedMaxScore) {
  if (!Number.isFinite(rawScore) || !Number.isFinite(expectedMaxScore) || expectedMaxScore <= 0) return 0;
  return Math.min(10, Math.round((Math.max(0, rawScore) / expectedMaxScore) * 10));
}

export function strengthFromNormalizedScore(normalizedScore, isSafety = false) {
  if (isSafety) return "safety";
  if (normalizedScore === 0) return "inactive";
  if (normalizedScore <= 3) return "weak";
  if (normalizedScore <= 6) return "moderate";
  if (normalizedScore <= 8) return "strong";
  return "very_strong";
}

function evidenceStrengthFor(score, isSafety = false) {
  if (isSafety) return "safety";
  const removedDays = new Set(score.evidence_items.map(item => item.day_number).filter(Boolean)).size;
  if (score.normalizedScore >= 7 || removedDays >= 3) return "strong";
  if (score.normalizedScore >= 4 || removedDays >= 2) return "moderate";
  if (score.normalizedScore > 0) return "possible";
  return "insufficient";
}

function confidenceFor(score) {
  if (score.evidence_strength === "safety") return "safety";
  if (score.evidence_strength === "strong") return "strong";
  if (score.evidence_strength === "moderate") return "moderate";
  return "possible";
}

function createScore(key) {
  return {
    key,
    rawScore: 0,
    expectedMaxScore: expectedMaxForDriver(key),
    normalizedScore: 0,
    strength: "inactive",
    evidence_strength: "insufficient",
    layer: layerForDriver(key),
    source_breakdown: {
      stage: 0,
      stage_summary: 0,
      diary: 0,
      diary_summary: 0,
      repetition_bonus: 0,
      safety: 0
    },
    related_old_mechanisms: [],
    evidence_items: [],
    confidence: "none",
    safety_weight: 0
  };
}

function ensureScores(scores) {
  allDriverKeys().forEach(key => {
    scores[key] = scores[key] || createScore(key);
  });
  return scores;
}

function addScore(scores, key, amount, sourceType, evidence = {}) {
  if (!key || !Number.isFinite(amount)) return;
  scores[key] = scores[key] || createScore(key);
  scores[key].rawScore += amount;
  if (scores[key].source_breakdown[sourceType] !== undefined) {
    scores[key].source_breakdown[sourceType] += amount;
  }
  if (sourceType === "safety") {
    scores[key].safety_weight += amount;
  }
  if (evidence.oldMechanism && !scores[key].related_old_mechanisms.includes(evidence.oldMechanism)) {
    scores[key].related_old_mechanisms.push(evidence.oldMechanism);
  }
  scores[key].evidence_items.push({
    source_type: sourceType,
    question_id: evidence.questionId || null,
    day_number: evidence.dayNumber || null,
    weight: amount,
    old_mechanism: evidence.oldMechanism || null,
    reason: evidence.reason || null
  });
}

function normalizeScores(scores, safetyDrivers = []) {
  ensureScores(scores);
  Object.values(scores).forEach(score => {
    score.rawScore = Math.max(0, Number(score.rawScore.toFixed(2)));
    score.expectedMaxScore = expectedMaxForDriver(score.key);
    score.normalizedScore = normalizeDriverScore(score.rawScore, score.expectedMaxScore);
    const isSafety = safetyDrivers.includes(score.key);
    score.strength = strengthFromNormalizedScore(score.normalizedScore, isSafety);
    score.evidence_strength = evidenceStrengthFor(score, isSafety);
    score.confidence = confidenceFor(score);
    score.safety_weight = Number(score.safety_weight.toFixed(2));
  });
  return scores;
}

function textIncludes(text, ...terms) {
  const source = String(text || "").toLowerCase();
  return terms.some(term => source.includes(term.toLowerCase()));
}

function addTagSignal(scores, tag, amount, sourceType, evidence = {}) {
  const map = {
    skipped_meal: [["meal_gap", 1]],
    meal_gap_5h_plus: [["meal_gap", 1.25], ["evening_hunger", 0.5]],
    evening_unplanned_eating: [["evening_hunger", 0.75]],
    high_hunger: [["evening_hunger", 0.75]],
    low_hunger_craving: [["self_reward", 0.75], ["comfort", 0.5]],
    reward_pull: [["self_reward", 1]],
    food_as_regulation: [["decompression", 1], ["comfort", 0.75]],
    hunger_safety: [["hunger_safety", 1]],
    executive_load: [["fatigue", 0.75], ["low_friction_default", 0.5]],
    default_delivery: [["delivery_app", 1], ["low_friction_default", 1]],
    cue_trigger: [["visible_snacks", 1], ["food_photo_cue", 0.75]],
    social_pressure: [["social_table", 1], ["belonging", 1]],
    autonomy_rebellion: [["anger_resentment", 1], ["strict_diet", 0.5]],
    control_collapse: [["all_or_nothing", 1], ["monday_restart", 1]],
    shame_guilt: [["shame", 1], ["guilt", 0.75], ["escape_from_shame", 0.75]],
    role_overload: [["fatigue", 0.75], ["self_reward", 0.5]],
    body_safety: [["body_change_uncertainty", 1], ["shame", 0.75], ["escape_from_shame", 0.75]],
    circadian_crash: [["sleep_disruption", 1], ["fatigue", 0.75]],
    glucose_like_signal: [["medical_concern", 1], ["medical_red_flag", 1]],
    physiological_reactivity: [["medical_concern", 1], ["quick_recovery", 0.5]],
    bp_concern: [["medical_concern", 1], ["medical_red_flag", 1]],
    swelling_signal: [["medical_concern", 1], ["medical_red_flag", 1]],
    self_harm_signal: [["professional_first", 3]],
    urgent_confusion_fainting: [["medical_red_flag", 3], ["professional_first", 3]]
  };
  (map[tag] || []).forEach(([driver, weight]) => addScore(scores, driver, amount * weight, sourceType, evidence));
}

function addOptionMetadataSignals(scores, questionId, answer, sourceType, dayNumber = null) {
  const values = Array.isArray(answer) ? answer : [answer];
  values.filter(value => value !== undefined && value !== null && value !== "").forEach(value => {
    const meta = getOptionMetadata(questionId, value);
    (meta?.tags || []).forEach(tag => addTagSignal(scores, tag, 0.75, sourceType, { questionId, dayNumber, reason: `tag:${tag}` }));
  });
}

function addTextSignals(scores, text, sourceType, evidence = {}) {
  const add = (key, amount, reason) => addScore(scores, key, amount, sourceType, { ...evidence, reason });
  const deniesMealGap = textIncludes(text, "алгасаагүй", "хоол алгасаагүй", "зай хэтрээгүй");

  if (textIncludes(text, "ээлж", "шөнийн ажил", "night shift", "shift")) add("shift_work", 1.25, "shift_work_text");
  if (!deniesMealGap && textIncludes(text, "5+", "хоол алгас", "хоолны зай", "удаан юм идээгүй")) add("meal_gap", 1, "meal_gap_text");
  if (textIncludes(text, "орой хүчтэй өлс", "оройн өлс", "шөнө өлс")) add("evening_hunger", 0.75, "evening_hunger_text");
  if (textIncludes(text, "ядар", "тэнхээ", "energy бага", "эрч хүч")) {
    add("fatigue", 0.8, "fatigue_text");
    add("quick_recovery", 0.5, "fatigue_text");
  }
  if (textIncludes(text, "нойр", "4-6", "4 цагаас")) add("sleep_disruption", 1, "sleep_text");
  if (textIncludes(text, "стресс", "stress")) add("stress", 1, "stress_text");
  if (textIncludes(text, "санаа зов", "түгш")) add("anxiety", 0.75, "anxiety_text");
  if (textIncludes(text, "уур", "эсэргүүц")) add("anger_resentment", 0.75, "anger_text");
  if (textIncludes(text, "control", "хяналт", "буцааж авах")) add("control_regain", 3, "control_regain_text");
  if (textIncludes(text, "ганцаард")) {
    add("loneliness", 1, "loneliness_text");
    add("loneliness_soothing", 0.75, "loneliness_text");
  }
  if (textIncludes(text, "хоосон")) add("emptiness", 1, "emptiness_text");
  if (textIncludes(text, "тайвш", "амсхий")) {
    add("decompression", 1, "decompression_text");
    add("comfort", 0.75, "decompression_text");
  }
  if (textIncludes(text, "амттай", "нэг гоё", "шагна")) add("self_reward", 1, "reward_text");
  if (textIncludes(text, "delivery", "захиал")) {
    add("delivery_app", 1, "delivery_text");
    add("low_friction_default", 0.75, "delivery_text");
  }
  if (textIncludes(text, "харагд", "үнэр", "зураг", "snack", "зууш")) add("visible_snacks", 0.8, "cue_text");
  if (textIncludes(text, "food зураг", "хоолны зураг")) add("food_photo_cue", 1, "food_photo_text");
  if (textIncludes(text, "хамгийн амар", "бэлэн")) add("low_friction_default", 0.75, "default_text");
  if (textIncludes(text, "хүмүүс", "татгалзах", "social", "найз")) {
    add("social_table", 1, "social_text");
    add("belonging", 0.8, "social_text");
  }
  if (textIncludes(text, "алкоголь", "архи")) add("alcohol_context", 1.25, "alcohol_text");
  if (textIncludes(text, "мацаг")) {
    add("strict_diet", 0.75, "fasting_text");
    add("fasting_rebound", 1, "fasting_text");
  }
  if (textIncludes(text, "нүүрс ус")) {
    add("strict_diet", 0.75, "carb_cut_text");
    add("carb_cut_rebound", 1, "carb_cut_text");
  }
  if (textIncludes(text, "маргааш", "даваа", "monday", "дахин эхэл", "өнгөрлөө", "бүх юм дууссан")) {
    add("monday_restart", 1, "restart_text");
    add("all_or_nothing", 1, "restart_text");
  }
  if (textIncludes(text, "чанга барина", "хатуу дүрэм", "чанга дүрэм", "нөхөх")) {
    add("punishment_restriction", 1.5, "punishment_text");
    add("strict_diet", 0.75, "punishment_text");
  }
  if (textIncludes(text, "ич", "нуух", "shame")) {
    add("shame", 4, "shame_text");
    add("escape_from_shame", 3, "shame_text");
  }
  if (textIncludes(text, "гэмш")) add("guilt", 1, "guilt_text");
  if (textIncludes(text, "хяналтаа алд")) add("loss_of_control_feeling", 1, "loss_control_text");
  if (textIncludes(text, "pcos", "даавар", "сарын тэмдэг", "бие өөрчлөгд")) add("body_change_uncertainty", 2, "body_change_text");
  if (textIncludes(text, "бөөлж", "туулга", "хэт их дасгал")) add("compensatory_behavior", 3, "compensatory_text");
  if (textIncludes(text, "сахар", "даралт", "гар салгалах", "зүрх дэлсэх", "толгой эргэх", "хаваг", "амьсгаад")) {
    add("medical_concern", 1, "medical_text");
    add("quick_recovery", 0.5, "medical_text");
  }
  if (textIncludes(text, "будилах", "ухаан балар", "ухаан ал", "өөртөө хор", "амиа")) add("professional_first", 3, "urgent_text");
}

function addOldMechanismSignals(scores, mechanismEvidence) {
  Object.entries(mechanismEvidence.mechanisms || {}).forEach(([mechanismName, item]) => {
    const oldMechanism = MECHANISM_NAME_TO_KEY[mechanismName];
    const mapping = OLD_MECHANISM_TO_DRIVERS[oldMechanism] || [];
    const multiplier = Math.max(0.25, Math.min(1.5, item.score / 8));
    mapping.forEach(([driver, weight]) => {
      const sourceType = item.diaryScore > item.stageScore ? "diary" : "stage";
      addScore(scores, driver, weight * multiplier, sourceType, {
        oldMechanism,
        reason: `old_mechanism:${oldMechanism}`
      });
    });
    (item.contradictionSignals || []).forEach(signal => {
      addTextSignals(scores, signal, "diary", { oldMechanism, reason: "contradiction_signal" });
    });
  });
}

function addStageSignals(scores, state) {
  Object.entries(state.stageAnswers || {}).forEach(([questionId, answer]) => {
    addOptionMetadataSignals(scores, questionId, answer, "stage");
    addTextSignals(scores, Array.isArray(answer) ? answer.join(" ") : answer, "stage", { questionId });
    if (questionId === "S1-S03" && !["", "Үгүй", "Хариулахгүй"].includes(String(answer || ""))) {
      addScore(scores, "compensatory_behavior", 3, "safety", { questionId, reason: "compensatory_behavior_answer" });
      addScore(scores, "professional_first", 3, "safety", { questionId, reason: "compensatory_behavior_answer" });
      addScore(scores, "punishment_restriction", 1, "stage", { questionId, reason: "compensatory_behavior_answer" });
    }
    if (questionId === "S1-B03" && !["", "Үгүй", "Хариулахгүй"].includes(String(answer || ""))) {
      addScore(scores, "medical_red_flag", 3, "safety", { questionId, reason: "medical_red_flag_answer" });
      addScore(scores, "professional_first", 3, "safety", { questionId, reason: "medical_red_flag_answer" });
    }
    if (questionId === "S1-B02" && !["", "Үгүй", "Хариулахгүй"].includes(String(answer || ""))) {
      addScore(scores, "medical_concern", 1.5, "stage", { questionId, reason: "medical_concern_answer" });
    }
    if (questionId === "S1-C06" && Array.isArray(answer) && answer.length) {
      addScore(scores, "body_change_uncertainty", 3, "stage", { questionId, reason: "body_change_goal_answer" });
    }
    if (questionId === "S1-S04" && !["", "Үгүй", "Хариулахгүй"].includes(String(answer || ""))) {
      addScore(scores, "professional_first", 3, "safety", { questionId, reason: "self_harm_answer" });
    }
  });
  Object.values(state.stageVoiceSummaries || {}).forEach(summary => {
    if (!summary?.userConfirmed) return;
    addTextSignals(scores, (summary.confirmedSummary || []).join(" "), "stage_summary", { questionId: summary.checkpointId });
  });
}

function addDiarySignals(scores, state) {
  (state.removedEntries || []).forEach(entry => {
    const dayNumber = entry.day_number;
    const mealText = String(entry.meal_rhythm || "");
    const momentText = String(entry.main_moment_time || "");
    const foodFunctionText = (entry.food_function || []).join(" ");
    const emotionText = String(entry.emotion || "");
    const sleepText = (entry.sleep || []).join(" ");
    const drinksText = (entry.drinks || []).join(" ");
    const bodyText = (entry.body_signals || []).join(" ");
    const probeText = Object.values(entry.pattern_probes || {}).flat().join(" ");
    const hunger = Number(entry.hunger_level);
    const stress = Number(entry.stress_score);
    const energy = Number(entry.energy_score);

    addTextSignals(scores, [mealText, foodFunctionText, emotionText, sleepText, drinksText, bodyText, probeText].join(" "), "diary", { dayNumber });

    const hasMealGap = !textIncludes(mealText, "алгасаагүй", "хоол алгасаагүй", "зай хэтрээгүй")
      && textIncludes(mealText, "хоол хоорондын зай", "хоол алгас", "5+", "нэг хоол алгас");
    const isEvening = textIncludes(momentText, "орой", "шөнө");
    if (hasMealGap) {
      addScore(scores, "meal_gap", 1.5, "diary", { dayNumber, reason: "structured_meal_gap" });
      if (isEvening || hunger >= 7) addScore(scores, "evening_hunger", 1.2, "diary", { dayNumber, reason: "meal_gap_evening_or_high_hunger" });
    }
    if (hunger >= 7 && hasMealGap) {
      addScore(scores, "hunger_safety", 0.9, "diary", { dayNumber, reason: "high_hunger_with_meal_gap" });
    }
    if (hunger <= 3 && textIncludes(foodFunctionText, "амттай", "шагна", "харагдаад", "үнэртээд")) {
      addScore(scores, "self_reward", 0.9, "diary", { dayNumber, reason: "low_hunger_reward_pull" });
    }
    if (energy <= 3) addScore(scores, "fatigue", 1.2, "diary", { dayNumber, reason: "low_energy_score" });
    if (stress >= 7) addScore(scores, "stress", 1.2, "diary", { dayNumber, reason: "high_stress_score" });

    const summary = entry.confirmedSummaryObject;
    if (summary?.userConfirmed) {
      addTextSignals(scores, (summary.confirmedSummary || []).join(" "), "diary_summary", { dayNumber });
    }
  });

  Object.values(scores).forEach(score => {
    const days = new Set(score.evidence_items.map(item => item.day_number).filter(Boolean));
    if (days.size >= 5) addScore(scores, score.key, 2, "repetition_bonus", { reason: "repeated_5_days" });
    else if (days.size >= 3) addScore(scores, score.key, 1.25, "repetition_bonus", { reason: "repeated_3_days" });
    else if (days.size >= 2) addScore(scores, score.key, 0.75, "repetition_bonus", { reason: "repeated_2_days" });
  });
}

function determineSafety(scores, mechanismEvidence) {
  const safetyDrivers = new Set();
  const reasonCodes = [];
  if (mechanismEvidence.safetyRoute === "mode4") {
    safetyDrivers.add("professional_first");
    reasonCodes.push("current_mode4_urgent");
  }
  if (mechanismEvidence.safetyRoute === "mode3") {
    safetyDrivers.add("professional_first");
    reasonCodes.push("current_mode3_professional");
  }
  ["medical_red_flag", "compensatory_behavior", "severe_body_distress", "binge_risk"].forEach(key => {
    if ((scores[key]?.rawScore || 0) >= expectedMaxForDriver(key)) {
      safetyDrivers.add(key);
      reasonCodes.push(`${key}_threshold`);
    }
  });
  if ([...safetyDrivers].some(key => ["medical_red_flag", "compensatory_behavior", "severe_body_distress", "binge_risk"].includes(key))) {
    safetyDrivers.add("professional_first");
  }
  return { safetyDrivers: [...safetyDrivers], reasonCodes };
}

function currentModeFromSafetyRoute(route) {
  return { mode1: "deep", mode2: "check", mode3: "professional", mode4: "urgent" }[route] || "deep";
}

function sourceEvidenceQuality(state, mechanismEvidence) {
  if (state.packageType === "one-time") return "one_time";
  return mechanismEvidence.evidenceQuality || "insufficient";
}

function safetyDriversFromRoute(safetyRoute) {
  return safetyRoute?.safety_drivers || safetyRoute?.safetyDrivers || [];
}

function isOrdinaryAllowed(safetyRoute) {
  const mode = safetyRoute?.mode;
  return !["mode3", "mode4"].includes(mode) && !safetyDriversFromRoute(safetyRoute).includes("professional_first");
}

function sortedOrdinaryDrivers(driverScores, safetyRoute) {
  const safetyDrivers = safetyDriversFromRoute(safetyRoute);
  return Object.values(driverScores)
    .filter(score => score.normalizedScore > 0)
    .filter(score => score.layer !== "safety")
    .filter(score => !safetyDrivers.includes(score.key))
    .sort((a, b) => {
      const diaryDelta = (b.source_breakdown.diary + b.source_breakdown.diary_summary) - (a.source_breakdown.diary + a.source_breakdown.diary_summary);
      if (Math.abs(diaryDelta) >= 1 && b.normalizedScore === a.normalizedScore) return diaryDelta;
      if (b.normalizedScore !== a.normalizedScore) return b.normalizedScore - a.normalizedScore;
      if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore;
      return DRIVER_PRIORITY.indexOf(a.key) - DRIVER_PRIORITY.indexOf(b.key);
    });
}

export function selectPrimaryDriver(driverScores, safetyRoute) {
  if (!isOrdinaryAllowed(safetyRoute)) return null;
  const scores = driverScores;
  const ordinary = sortedOrdinaryDrivers(scores, safetyRoute);
  const active = key => (scores[key]?.normalizedScore || 0) >= 4;

  if (active("stress") && (active("decompression") || active("comfort"))) return scores.stress;
  if (active("visible_snacks") || active("food_photo_cue")) return (scores.visible_snacks?.normalizedScore || 0) >= (scores.food_photo_cue?.normalizedScore || 0) ? scores.visible_snacks : scores.food_photo_cue;
  if (active("social_table") && active("belonging")) return scores.social_table;
  if (active("all_or_nothing") && (active("monday_restart") || active("punishment_restriction"))) return scores.all_or_nothing;
  if (active("sleep_disruption") && active("fatigue")) return scores.sleep_disruption;
  if (active("shift_work") && active("quick_recovery")) return scores.shift_work;
  if (active("shift_work") && active("loneliness")) return scores.shift_work;
  if (active("body_change_uncertainty") && active("shame")) return scores.body_change_uncertainty;
  if (active("body_change_uncertainty") && active("control_regain")) return scores.body_change_uncertainty;
  if (active("meal_gap") && active("evening_hunger")) return scores.meal_gap.normalizedScore >= scores.evening_hunger.normalizedScore ? scores.meal_gap : scores.evening_hunger;
  return ordinary[0] || null;
}

export function selectSecondaryDrivers(driverScores, primaryDriver, safetyRoute) {
  if (!isOrdinaryAllowed(safetyRoute)) return [];
  const selected = [];
  const seen = new Set(primaryDriver ? [primaryDriver.key] : []);
  const seenLayers = new Set(primaryDriver ? [primaryDriver.layer] : []);
  sortedOrdinaryDrivers(driverScores, safetyRoute).forEach(score => {
    if (selected.length >= 3 || seen.has(score.key) || score.normalizedScore < 3) return;
    if (!seenLayers.has(score.layer) || selected.length >= 1) {
      selected.push(score);
      seen.add(score.key);
      seenLayers.add(score.layer);
    }
  });
  return selected;
}

function observedDaysForDrivers(driverScores, drivers) {
  return [...new Set(drivers.flatMap(driver => (driverScores[driver]?.evidence_items || []).map(item => item.day_number).filter(Boolean)))].sort((a, b) => a - b);
}

export function buildInteractionPattern(driverScores, primaryDriver, secondaryDrivers) {
  const has = key => (driverScores[key]?.normalizedScore || 0) >= 3;
  const strong = key => (driverScores[key]?.normalizedScore || 0) >= 7;
  const match = (id, drivers, plain, firstLever) => ({
    id,
    drivers: drivers.filter(has),
    plain_language: plain,
    confidence: drivers.some(strong) ? "strong" : "moderate",
    observed_on_days: observedDaysForDrivers(driverScores, drivers),
    first_lever: firstLever
  });

  if (has("medical_red_flag") || has("professional_first")) {
    return match("medical_first_body_signal", ["medical_concern", "medical_red_flag", "professional_first"], "Body signals should be clarified before ordinary weight-loss advice.", "professional_discussion_summary");
  }
  if (has("body_change_uncertainty") && has("shame")) {
    if (has("strict_diet") || has("punishment_restriction")) {
      return match("body_shame_restriction", ["body_change_uncertainty", "shame", "strict_diet", "punishment_restriction", "escape_from_shame"], "Body shame is linking to stricter restriction and escape-from-shame pressure.", "body_neutral_private_tracking");
    }
    return match("body_change_uncertainty_shame", ["body_change_uncertainty", "shame", "escape_from_shame"], "Body change concern and shame make ordinary tracking feel unsafe.", "body_neutral_private_tracking");
  }
  if (has("body_change_uncertainty") && has("control_regain")) {
    return match("pcos_body_uncertainty_control", ["body_change_uncertainty", "control_regain", "shame"], "Body-change uncertainty is creating a pressure to regain control through stricter rules.", "body_neutral_private_tracking");
  }
  if (has("shift_work") && has("loneliness")) {
    return match("shift_work_loneliness_combo", ["shift_work", "sleep_disruption", "fatigue", "loneliness", "loneliness_soothing"], "Irregular work rhythm and lonely recovery windows make food a fast soothing point.", "shift_recovery_connection_slot");
  }
  if (has("shift_work") && (has("quick_recovery") || has("fatigue"))) {
    return match("shift_work_recovery_only", ["shift_work", "fatigue", "quick_recovery"], "Irregular work rhythm creates a recovery window where fast food relief is more likely.", "shift_recovery_anchor");
  }
  if (has("stress") && has("delivery_app")) {
    return match("stress_delivery_app_comfort", ["stress", "delivery_app", "decompression", "comfort", "low_friction_default"], "Stress and delivery-app friction make food a fast comfort/decompression default.", "pre_delivery_decompression_pause");
  }
  if (has("stress") && (has("decompression") || has("comfort"))) {
    return match("stress_decompression_guilt", ["stress", "decompression", "comfort", "guilt"], "Food is functioning as a fast decompression point after emotional load.", "pre_eating_decompression_pause");
  }
  if ((has("visible_snacks") || has("food_photo_cue")) && has("self_reward")) {
    return match("cue_reward_low_friction_default", ["visible_snacks", "food_photo_cue", "self_reward", "low_friction_default"], "Visible or one-tap food cues start the eating loop before hunger is checked.", "cue_distance_plus_default_choice");
  }
  if (has("social_table") && has("belonging")) {
    return match("social_belonging_alcohol", ["social_table", "belonging", "alcohol_context"], "Social context makes refusing or choosing differently more difficult.", "choice_preserving_social_script");
  }
  if (has("all_or_nothing") && (has("monday_restart") || has("punishment_restriction"))) {
    return match("all_or_nothing_punishment_restriction", ["all_or_nothing", "monday_restart", "punishment_restriction"], "One deviation turns into a stricter restart loop.", "next_meal_reset_rule");
  }
  if (has("sleep_disruption") && (has("fatigue") || has("self_reward"))) {
    return match("sleep_disruption_fatigue_reward", ["sleep_disruption", "fatigue", "quick_recovery", "self_reward"], "Sleep disruption and low energy make fast reward or recovery food more likely.", "sleep_energy_anchor");
  }
  if (has("meal_gap") && has("evening_hunger")) {
    return match("meal_gap_evening_hunger", ["meal_gap", "evening_hunger", "fatigue", "hunger_safety"], "Meal gaps are turning into evening hunger and hunger-safety pressure.", "planned_bridge_meal_plus_default_dinner");
  }
  if (has("meal_gap") && (has("fatigue") || has("delivery_app") || has("low_friction_default"))) {
    return match("meal_gap_fatigue_low_friction_default", ["meal_gap", "evening_hunger", "fatigue", "delivery_app", "low_friction_default"], "When meals are delayed and evening energy is low, the easiest available food wins.", "planned_bridge_meal_plus_default_dinner");
  }
  if (has("loneliness") || has("emptiness")) {
    return match("loneliness_comfort_reward_deficit", ["loneliness", "emptiness", "loneliness_soothing", "comfort", "self_reward"], "Loneliness or emptiness makes food a soothing or attention substitute.", "non_food_connection_slot");
  }
  const fallback = [primaryDriver?.key, ...secondaryDrivers.map(driver => driver.key)].filter(Boolean).slice(0, 3);
  return match("general_driver_stack", fallback, "Several drivers overlap; diary evidence should clarify which one is easiest to change first.", "removed_feature_confirmation");
}

export function buildVulnerableMoment(input, driverScores, interactionPattern, safetyRoute) {
  const drivers = interactionPattern.drivers || [];
  const has = key => drivers.includes(key) || (driverScores[key]?.normalizedScore || 0) >= 4;
  const time_window = has("shift_work") ? "shift_recovery_window" : has("evening_hunger") || has("fatigue") ? "evening" : has("social_table") ? "social_event" : "unknown";
  const body_state = ["shift_work", "meal_gap", "evening_hunger", "fatigue", "sleep_disruption", "medical_concern", "body_change_uncertainty"].filter(has);
  const psychology_state = ["stress", "anxiety", "anger_resentment", "loneliness", "emptiness", "shame", "guilt"].filter(has);
  const environment_trigger = ["delivery_app", "visible_snacks", "food_photo_cue", "social_table", "alcohol_context", "low_friction_default"].filter(has);
  const food_function = ["hunger_safety", "quick_recovery", "decompression", "comfort", "self_reward", "loneliness_soothing", "belonging", "escape_from_shame", "escape_from_failure"].filter(has);
  const restriction_context = ["all_or_nothing", "monday_restart", "strict_diet", "fasting_rebound", "carb_cut_rebound", "punishment_restriction"].filter(has);
  const safetyDrivers = safetyDriversFromRoute(safetyRoute);
  return {
    id: interactionPattern.id === "general_driver_stack" ? "general_vulnerable_moment" : interactionPattern.id,
    time_window,
    body_state,
    psychology_state,
    environment_trigger,
    food_function,
    restriction_context,
    safety_context: safetyDrivers,
    plain_language: interactionPattern.plain_language,
    confidence: safetyDrivers.length ? "safety" : interactionPattern.confidence || "moderate",
    evidence_sources: [],
    diary_confirmation_targets: []
  };
}

function visibleConditionFor(primaryDriver, interactionPattern) {
  const key = primaryDriver?.key;
  const copy = {
    shift_work: "Irregular work rhythm creates vulnerable recovery windows.",
    meal_gap: "Meals are delayed and evening hunger becomes harder to steer.",
    evening_hunger: "Evening hunger becomes the visible pressure point.",
    fatigue: "Low energy makes the easiest option more likely.",
    delivery_app: "Ordering food becomes the visible low-friction behavior.",
    visible_snacks: "Visible snacks or cues are starting the loop.",
    food_photo_cue: "Food images cue wanting before hunger is checked.",
    stress: "Stress is present before eating decisions shift.",
    all_or_nothing: "One deviation turns into a full restart feeling.",
    social_table: "Social table pressure makes choosing differently harder.",
    sleep_disruption: "Poor sleep and low energy are shaping food pull.",
    body_change_uncertainty: "Body change concern is making tracking or change feel unsafe.",
    medical_concern: "Body signals need clarification before ordinary change advice."
  }[key] || interactionPattern.plain_language;
  return { key: key || "unknown", plain_language: copy };
}

function hiddenFunctionFor(driverScores, interactionPattern) {
  const interactionPreference = {
    meal_gap_fatigue_low_friction_default: ["hunger_safety", "quick_recovery"],
    meal_gap_evening_hunger: ["hunger_safety", "quick_recovery"],
    shift_work_recovery_only: ["quick_recovery"],
    stress_delivery_app_comfort: ["decompression", "comfort"],
    stress_decompression_guilt: ["decompression", "comfort"],
    cue_reward_low_friction_default: ["self_reward"],
    social_belonging_alcohol: ["belonging"],
    all_or_nothing_punishment_restriction: ["control_regain", "escape_from_failure"],
    sleep_disruption_fatigue_reward: ["quick_recovery", "self_reward"],
    shift_work_loneliness_combo: ["loneliness_soothing", "comfort", "quick_recovery"],
    loneliness_comfort_reward_deficit: ["loneliness_soothing", "comfort"],
    body_change_uncertainty_shame: ["escape_from_shame"],
    body_shame_restriction: ["escape_from_shame", "control_regain"],
    pcos_body_uncertainty_control: ["control_regain", "escape_from_shame"],
    medical_first_body_signal: ["quick_recovery"]
  }[interactionPattern.id] || [];
  const candidates = [...interactionPreference, "decompression", "comfort", "self_reward", "loneliness_soothing", "quick_recovery", "hunger_safety", "belonging", "escape_from_shame", "escape_from_failure", "control_regain"]
    .map(key => driverScores[key])
    .filter(Boolean)
    .filter(score => score.normalizedScore > 0);
  const selected = candidates[0] || null;
  return {
    key: selected?.key || "unknown",
    supporting_keys: candidates.slice(1, 3).map(item => item.key),
    plain_language: selected ? `Food is serving ${selected.key} in the current driver stack.` : "Food function needs more evidence.",
    evidence_strength: selected?.evidence_strength || "insufficient"
  };
}

function wrongSelfExplanationFor(driverScores) {
  const has = key => (driverScores[key]?.normalizedScore || 0) >= 4;
  if (has("meal_gap") || has("fatigue")) return { key: "not_lack_of_discipline", plain_language: "This is not simply lack of discipline; body rhythm and energy are shaping the moment." };
  if (has("all_or_nothing") || has("punishment_restriction")) return { key: "stricter_tomorrow_makes_it_worse", plain_language: "The stricter tomorrow explanation may be keeping the rebound loop active." };
  if (has("shame") || has("body_change_uncertainty")) return { key: "body_blame_increases_avoidance", plain_language: "Blaming the body may increase avoidance rather than make change easier." };
  return { key: "willpower_only_is_incomplete", plain_language: "A willpower-only explanation is incomplete because multiple drivers overlap." };
}

export function buildFirstGentleChange(driverScores, interactionPattern, safetyRoute) {
  const safetyDrivers = safetyDriversFromRoute(safetyRoute);
  if (safetyDrivers.length) {
    return {
      id: "professional_discussion_summary",
      targets: safetyDrivers,
      action: "Prepare a short professional discussion summary before ordinary weight-loss experiments.",
      why_this_first: "Safety and professional-first signals outrank ordinary behavior change.",
      avoid: ["fasting", "punishment restriction", "ordinary 14-day weight-loss experiment"]
    };
  }
  const map = {
    meal_gap_fatigue_low_friction_default: ["bridge_meal_before_evening", ["meal_gap", "evening_hunger"], "Before a 5+ hour gap, add one planned bridge meal/snack and one easy dinner default."],
    meal_gap_evening_hunger: ["bridge_meal_before_evening", ["meal_gap", "evening_hunger"], "Before a 5+ hour gap, add one planned bridge meal/snack."],
    shift_work_recovery_only: ["shift_recovery_anchor", ["shift_work", "quick_recovery"], "Plan one small recovery anchor after the shift before choosing food."],
    stress_delivery_app_comfort: ["pre_delivery_decompression_pause", ["stress", "delivery_app", "decompression"], "Pause before opening the delivery app and use one short decompression action first."],
    stress_decompression_guilt: ["pre_eating_decompression_pause", ["stress", "decompression"], "Add a 60-second decompression pause before deciding what to eat."],
    cue_reward_low_friction_default: ["move_one_cue", ["visible_snacks", "food_photo_cue"], "Move one strong cue farther away and prepare one desired default."],
    social_belonging_alcohol: ["social_choice_script", ["social_table", "belonging"], "Prepare one short social choice sentence before the table context starts."],
    all_or_nothing_punishment_restriction: ["next_meal_reset_rule", ["all_or_nothing", "punishment_restriction"], "Use a next-meal reset rule instead of a stricter tomorrow rule."],
    sleep_disruption_fatigue_reward: ["sleep_energy_anchor", ["sleep_disruption", "fatigue"], "Protect one sleep/first-meal/energy anchor before the evening pull."],
    shift_work_loneliness_combo: ["shift_recovery_connection_slot", ["shift_work", "loneliness"], "Plan one recovery window after shift work with a small non-food connection or comfort slot."],
    loneliness_comfort_reward_deficit: ["non_food_connection_slot", ["loneliness", "comfort"], "Plan one small non-food comfort or contact slot before the usual vulnerable time."],
    body_change_uncertainty_shame: ["body_neutral_private_tracking", ["body_change_uncertainty", "shame"], "Use private, body-neutral tracking rather than public or shame-based measures."],
    body_shame_restriction: ["body_neutral_private_tracking", ["body_change_uncertainty", "shame"], "Use private, body-neutral tracking and avoid stricter punishment rules."],
    pcos_body_uncertainty_control: ["body_neutral_private_tracking", ["body_change_uncertainty", "control_regain"], "Use body-neutral tracking and one non-punitive control cue."],
    medical_first_body_signal: ["professional_discussion_summary", ["medical_concern"], "Collect body-signal notes for a professional conversation before changing diet rules."]
  };
  const [id, targets, action] = map[interactionPattern.id] || ["removed_feature_confirmation", [], "Use 7-day diary confirmation before choosing the first change."];
  return {
    id,
    targets,
    action,
    why_this_first: "This is the lowest-friction modifiable point in the current driver stack.",
    avoid: ["one-type label", "punishment restriction", "aggressive diet rule"]
  };
}

export function buildFourteenDayExperimentHypothesis(firstGentleChange, vulnerableMoment, interactionPattern) {
  if (firstGentleChange.id === "professional_discussion_summary") {
    return {
      hypothesis: "Ordinary 14-day weight-loss experiment is paused while safety/professional-first signals are clarified.",
      duration_days: 0,
      daily_action: "professional-first summary",
      track: ["body_signals", "safety_context"],
      success_signal: "professional-first next step is clear",
      recovery_rule: "Do not compensate with fasting or stricter restriction."
    };
  }
  return {
    hypothesis: `If we gently change ${firstGentleChange.id}, then ${vulnerableMoment.id} should become less intense or less frequent because ${interactionPattern.id} is being tested.`,
    duration_days: 14,
    daily_action: firstGentleChange.action,
    track: [...new Set([...vulnerableMoment.body_state, ...vulnerableMoment.environment_trigger, ...vulnerableMoment.food_function])].slice(0, 5),
    success_signal: "The vulnerable moment becomes easier to notice or softer in intensity.",
    recovery_rule: "If a day is missed, resume at the next meal without tightening tomorrow."
  };
}

function fieldsForDriver(key) {
  const map = {
    shift_work: ["sleep", "energy_score", "main_moment_time"],
    meal_gap: ["meal_rhythm", "hunger_level"],
    evening_hunger: ["main_moment_time", "hunger_level"],
    fatigue: ["energy_score", "sleep"],
    sleep_disruption: ["sleep", "energy_score"],
    stress: ["stress_score", "emotion"],
    delivery_app: ["food_function", "raw_reflection"],
    visible_snacks: ["food_function", "raw_reflection"],
    food_photo_cue: ["food_function", "raw_reflection"],
    social_table: ["main_moment_time", "food_function", "drinks"],
    all_or_nothing: ["food_function", "raw_reflection"],
    medical_concern: ["body_signals"],
    body_change_uncertainty: ["body_signals", "raw_reflection"],
    shame: ["emotion", "raw_reflection"],
    loneliness: ["emotion", "main_moment_time", "raw_reflection"]
  };
  return map[key] || ["raw_reflection", "food_function"];
}

export function buildRemovedFeatureConfirmationTargets(driverScores, vulnerableMoment) {
  const candidates = Object.values(driverScores)
    .filter(score => score.layer !== "safety")
    .filter(score => score.normalizedScore >= 3)
    .sort((a, b) => b.normalizedScore - a.normalizedScore || b.rawScore - a.rawScore)
    .slice(0, 5)
    .map(score => ({
      driver_key: score.key,
      confirm_if: `${score.key} appears with the vulnerable moment on 2-3 diary days.`,
      weaken_if: `Diary entries repeatedly show the vulnerable moment without ${score.key}.`,
      diary_fields: fieldsForDriver(score.key)
    }));
  return candidates.concat({
    driver_key: "vulnerable_moment",
    confirm_if: "The same time/state/function combination repeats.",
    weaken_if: "The difficult moments occur in unrelated contexts.",
    diary_fields: ["main_moment_time", "meal_rhythm", "food_function", "raw_reflection"]
  });
}

function evidenceSources(driverScores) {
  return Object.values(driverScores).flatMap(score => score.evidence_items.slice(0, 5).map(item => ({
    source_type: item.source_type,
    question_id: item.question_id,
    day_number: item.day_number,
    driver_keys: [score.key],
    old_mechanisms: item.old_mechanism ? [item.old_mechanism] : [],
    weight: item.weight,
    user_confirmed: ["stage_summary", "diary_summary"].includes(item.source_type)
  })));
}

function publicEvidenceItem(item) {
  return {
    sourceType: item.source_type,
    questionId: item.question_id,
    dayNumber: item.day_number,
    weight: item.weight,
    oldMechanism: item.old_mechanism,
    reason: item.reason
  };
}

function toPublicDriverScore(score) {
  const evidenceItems = score.evidence_items.map(publicEvidenceItem);
  const directEvidenceCount = evidenceItems.filter(item => !item.oldMechanism && item.sourceType !== "repetition_bonus").length;
  const diaryEvidenceCount = evidenceItems.filter(item => ["diary", "diary_summary"].includes(item.sourceType)).length;
  return {
    key: score.key,
    layer: score.layer,
    rawScore: score.rawScore,
    expectedMaxScore: score.expectedMaxScore,
    normalizedScore: score.normalizedScore,
    strength: score.strength,
    confidence: score.confidence,
    evidenceItems,
    relatedOldMechanisms: score.related_old_mechanisms,
    directEvidenceCount,
    diaryEvidenceCount,
    inferredOnly: score.rawScore > 0 && directEvidenceCount === 0
  };
}

function publicDriverScores(driverScores) {
  return Object.fromEntries(
    Object.entries(driverScores).map(([key, score]) => [key, toPublicDriverScore(score)])
  );
}

export function calculateTestDriverStack(input = {}) {
  const state = emptyTestState(input);
  const mechanismEvidence = calculateMechanismEvidence(state);
  const scores = {};

  addOldMechanismSignals(scores, mechanismEvidence);
  addStageSignals(scores, state);
  addDiarySignals(scores, state);

  const preliminarySafety = determineSafety(scores, mechanismEvidence);
  normalizeScores(scores, preliminarySafety.safetyDrivers);
  const safety = determineSafety(scores, mechanismEvidence);
  normalizeScores(scores, safety.safetyDrivers);

  const safetyRoute = {
    mode: mechanismEvidence.safetyRoute,
    ordinary_report_allowed: !["mode3", "mode4"].includes(mechanismEvidence.safetyRoute) && !safety.safetyDrivers.includes("professional_first"),
    ordinary_experiment_allowed: !["mode3", "mode4"].includes(mechanismEvidence.safetyRoute) && !safety.safetyDrivers.includes("professional_first"),
    safety_drivers: safety.safetyDrivers,
    reason_codes: safety.reasonCodes
  };
  const primary = selectPrimaryDriver(scores, safetyRoute);
  const secondary = selectSecondaryDrivers(scores, primary, safetyRoute);
  const interaction = buildInteractionPattern(scores, primary, secondary);
  const vulnerableMoment = buildVulnerableMoment(state, scores, interaction, safetyRoute);
  const visibleCondition = visibleConditionFor(primary, interaction);
  const hiddenFoodFunction = hiddenFunctionFor(scores, interaction);
  const wrongSelfExplanation = wrongSelfExplanationFor(scores);
  const firstGentleChange = buildFirstGentleChange(scores, interaction, safetyRoute);
  const experiment = buildFourteenDayExperimentHypothesis(firstGentleChange, vulnerableMoment, interaction);
  const confirmationTargets = buildRemovedFeatureConfirmationTargets(scores, vulnerableMoment);

  return {
    version: "driver-stack-v0-test-only",
    source: {
      stage_answer_count: Object.values(state.stageAnswers || {}).filter(value => Array.isArray(value) ? value.length : value !== "" && value !== undefined && value !== null).length,
      diary_entry_count: (state.removedEntries || []).length,
      evidence_quality: sourceEvidenceQuality(state, mechanismEvidence),
      current_report_mode: currentModeFromSafetyRoute(mechanismEvidence.safetyRoute)
    },
    safety_route: safetyRoute,
    driver_scores: publicDriverScores(scores),
    primary_driver: primary ? {
      key: primary.key,
      layer: primary.layer,
      rawScore: primary.rawScore,
      expectedMaxScore: primary.expectedMaxScore,
      normalizedScore: primary.normalizedScore,
      strength: primary.strength,
      evidence_strength: primary.evidence_strength,
      why_primary: `${primary.key} is the most actionable high-scoring non-safety driver.`,
      not_a_type: true
    } : null,
    secondary_drivers: secondary.map(score => ({
      key: score.key,
      layer: score.layer,
      relationship_to_primary: primary ? `${score.key} overlaps with ${primary.key}` : "safety route suppresses ordinary primary",
      normalizedScore: score.normalizedScore,
      strength: score.strength,
      evidence_strength: score.evidence_strength
    })),
    interaction_pattern: interaction,
    vulnerable_moment: vulnerableMoment,
    visible_condition: visibleCondition,
    hidden_food_function: hiddenFoodFunction,
    wrong_self_explanation: wrongSelfExplanation,
    first_gentle_change: firstGentleChange,
    fourteen_day_experiment_hypothesis: experiment,
    removed_feature_diary_confirmation_targets: confirmationTargets,
    evidence_sources: evidenceSources(scores),
    copy_constraints: [
      "no_diet_plan",
      "no_calorie_tracking",
      "no_one_type_label",
      "no_shame_language",
      "no_ordinary_experiment_when_professional_first",
      "no_paywall_blocks_safety",
      "body_neutral_language"
    ]
  };
}

export function buildDriverStack(inputState = {}) {
  return calculateTestDriverStack(inputState);
}

export function summarizeDriverStack(stack) {
  return {
    fixture: stack.fixture || null,
    mode: stack.safety_route.mode,
    primary: stack.primary_driver?.key || null,
    secondary: stack.secondary_drivers.map(item => item.key),
    interaction: stack.interaction_pattern.id,
    vulnerableMoment: stack.vulnerable_moment.id,
    firstGentleChange: stack.first_gentle_change.id,
    safetyDrivers: stack.safety_route.safety_drivers
  };
}

~~~~~~

## tests/driver-stack/driverStackFixtures.mjs

~~~~~~js
import { createRequire } from "module";
import { makeConfirmedSummary, makeDiaryEntry } from "./driverStackTestCalculator.mjs";

const require = createRequire(import.meta.url);
const app = require("../../app.js");

function repeat(count, factory) {
  return Array.from({ length: count }, (_, index) => factory(index + 1));
}

function summary(day, structured, bullets) {
  return makeConfirmedSummary(app, { dayNumber: day, structured, bullets });
}

function entry(day, overrides = {}, bullets = []) {
  return makeDiaryEntry(app, day, overrides, bullets);
}

export const APPROVED_DRIVER_STACK_FIXTURE_NAMES = [
  "shift_work_recovery_only",
  "shift_work_loneliness_combo",
  "remote_work_visible_snacks",
  "stress_delivery_app_comfort",
  "meal_gap_evening_hunger",
  "all_or_nothing_restriction_rebound",
  "social_weekend_alcohol_monday_restart",
  "body_shame_restriction",
  "pcos_body_uncertainty_control",
  "medication_body_concern_professional_check"
];

export const driverStackFixtures = [
  {
    name: "shift_work_recovery_only",
    description: "Shift work disrupts recovery rhythm without loneliness or meal-gap dominance.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-N01": "4-6 цаг",
        "S1-N02": "Маш тод"
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Тогтуун, хоол алгасаагүй",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Шөнийн ээлжийн дараа",
        hunger_level: "3",
        food_function: ["Ядарсан", "Түр тэнхээ авах хэрэгтэй байсан"],
        emotion: "Тайван",
        energy_score: "2",
        sleep: ["Өдөр унтсан, ээлжийн ажилтай"],
        pattern_probes: { shift_recovery: "Шөнийн ажил shift дууссаны дараа recovery хэрэгтэй болдог" }
      }, ["Шөнийн shift дууссаны дараа тэнхээ багассан", "Хоол хурдан recovery мэт санагдсан"]))
    },
    expected: {
      primary: "shift_work",
      secondaryInclude: ["fatigue", "quick_recovery"],
      hiddenFoodFunction: "quick_recovery",
      interaction: "shift_work_recovery_only",
      firstGentleChange: "shift_recovery_anchor",
      safetyMode: "mode1",
      scoreAtLeast: { shift_work: 7, fatigue: 7, quick_recovery: 5 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3, loneliness: 3 }
    }
  },
  {
    name: "shift_work_loneliness_combo",
    description: "Shift work and lonely recovery windows make food a soothing/default point.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-E02": ["Ганцаардал", "Хоосон мэт мэдрэмж"],
        "S1-R02": ["Ганцаардсан үед"]
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Тогтуун, хоол алгасаагүй",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Шөнийн ээлжийн дараа",
        hunger_level: "3",
        food_function: ["Тайвширмаар байсан", "Ганцаардсан үед"],
        emotion: "Ганцаардсан",
        energy_score: "4",
        sleep: ["Өдөр унтсан, ээлжийн ажилтай"],
        pattern_probes: { shift_recovery: "Шөнийн ажил shift дууссаны дараа ганцаарддаг" }
      }, ["Шөнийн shift дууссаны дараа ганцаардсан", "Хоол тайвшруулах, хүнтэй байгаа мэт мэдрэмж өгсөн"]))
    },
    expected: {
      primary: "shift_work",
      secondaryInclude: ["loneliness", "loneliness_soothing"],
      hiddenFoodFunction: "loneliness_soothing",
      interaction: "shift_work_loneliness_combo",
      firstGentleChange: "shift_recovery_connection_slot",
      safetyMode: "mode1",
      scoreAtLeast: { shift_work: 7, loneliness: 7, loneliness_soothing: 6 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "remote_work_visible_snacks",
    description: "Remote work desk snacks and food images create cue-based eating without hunger dominance.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-L04": "Харагдвал бараг автоматаар иддэг",
        "S1-L05": "Маш хүчтэй",
        "S1-R02": ["Хоолны зураг эсвэл захиалгын апп харахад"]
      },
      removedEntries: repeat(5, day => entry(day, {
        unplanned_eating_count: "Тийм, хоёр удаа",
        main_moment_time: "Гэрээс ажиллаж байх үед",
        hunger_level: "2",
        food_function: ["Харагдаад эсвэл үнэртээд идмээр болсон", "Амттай юм идмээр байсан"],
        emotion: "Тайван",
        pattern_probes: { remote_cue: "Remote work desk дээр зууш харагдсан" }
      }, ["Remote work үед desk дээрх зууш харагдахад идэх хүсэл нэмэгдсэн", "Food зураг cue болсон"]))
    },
    expected: {
      primary: "visible_snacks",
      secondaryInclude: ["self_reward", "low_friction_default"],
      hiddenFoodFunction: "self_reward",
      interaction: "cue_reward_low_friction_default",
      firstGentleChange: "move_one_cue",
      safetyMode: "mode1",
      scoreAtLeast: { visible_snacks: 7, self_reward: 7 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3, stress: 3 }
    }
  },
  {
    name: "stress_delivery_app_comfort",
    description: "Stress and delivery-app default make food a comfort/decompression tool.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-E01": "Ихэвчлэн тэгдэг",
        "S1-E02": ["Стресс", "Санаа зовнил"],
        "S1-L02": ["Хоол захиалах"]
      },
      removedEntries: repeat(5, day => entry(day, {
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Ажлын дараа",
        hunger_level: "3",
        food_function: ["Тайвширмаар байсан", "Хамгийн амар нь delivery байсан"],
        emotion: "Стресс",
        stress_score: "8",
        energy_score: "5",
        pattern_probes: { default_app: "Стрессийн дараа delivery app нээсэн" }
      }, ["Стрессийн дараа delivery app хамгийн амар сонголт болсон", "Хоол comfort, decompression үүрэгтэй байсан"]))
    },
    expected: {
      primary: "stress",
      secondaryInclude: ["decompression", "delivery_app", "comfort"],
      hiddenFoodFunction: "decompression",
      interaction: "stress_delivery_app_comfort",
      firstGentleChange: "pre_delivery_decompression_pause",
      safetyMode: "mode1",
      scoreAtLeast: { stress: 7, decompression: 7, delivery_app: 5 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "meal_gap_evening_hunger",
    description: "Long meal gaps lead to evening hunger and low-friction default food.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-M01": "Өдөр бага идээд орой нөхдөг",
        "S1-M02": "Бараг өдөр бүр"
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Хоол хоорондын зай хэтэрсэн",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Орой",
        hunger_level: "8",
        food_function: ["Дараа өлсөхөөс санаа зовсон", "Хамгийн амар нь тэр байсан"],
        emotion: "Ядарсан",
        energy_score: "2"
      }, ["Орой хоолны хооронд 5+ цагийн зай гарсан", "Оройн өлсөлт хүчтэй байсан", "Оройн energy бага байсан"]))
    },
    expected: {
      primary: "meal_gap",
      secondaryInclude: ["evening_hunger", "fatigue"],
      hiddenFoodFunction: "hunger_safety",
      interaction: "meal_gap_evening_hunger",
      firstGentleChange: "bridge_meal_before_evening",
      safetyMode: "mode1",
      scoreAtLeast: { meal_gap: 7, evening_hunger: 7, hunger_safety: 6 },
      scoreAtMost: { stress: 3, social_table: 3, loneliness: 3 }
    }
  },
  {
    name: "all_or_nothing_restriction_rebound",
    description: "All-or-nothing restriction and stricter-tomorrow restart create rebound.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-W04": ["Мацаг", "Нүүрс ус хасах"],
        "S1-W06": "Маргааш илүү чанга барина",
        "S1-X03": "Маш хүчтэй"
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Нэг хоол алгассан",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Орой",
        hunger_level: "7",
        food_function: ["Дараа өлсөхөөс санаа зовсон"],
        emotion: "Санаа зовсон",
        pattern_probes: { control_collapse: "Тийм", tighten_tomorrow: "Тийм" }
      }, ["Өнөөдөр өнгөрлөө гэж бодсон", "Маргааш илүү чанга барина гэж бодсон", "Мацагийн дараа орой хүчтэй өлссөн"]))
    },
    expected: {
      primary: "all_or_nothing",
      secondaryInclude: ["monday_restart", "punishment_restriction"],
      hiddenFoodFunction: "hunger_safety",
      interaction: "all_or_nothing_punishment_restriction",
      firstGentleChange: "next_meal_reset_rule",
      safetyMode: "mode1",
      scoreAtLeast: { all_or_nothing: 7, monday_restart: 7, punishment_restriction: 6 },
      scoreAtMost: { stress: 4, social_table: 3 }
    }
  },
  {
    name: "social_weekend_alcohol_monday_restart",
    description: "Weekend social table plus alcohol leads to Monday restart thinking.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-F01": ["Татгалзах эвгүй байсан"],
        "S1-W06": "Маргааш илүү чанга барина"
      },
      removedEntries: repeat(5, day => entry(day, {
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Weekend хүмүүсийн уулзалтын үед",
        hunger_level: "4",
        food_function: ["Татгалзах эвгүй байсан"],
        emotion: "Тайван",
        drinks: ["Алкоголь"],
        pattern_probes: { monday_restart: "Даваа гарагт дахин эхэлнэ гэж бодсон" }
      }, ["Weekend social table дээр татгалзах эвгүй байсан", "Архи social context-той давхцсан", "Monday restart бодол гарсан"]))
    },
    expected: {
      primary: "social_table",
      secondaryInclude: ["belonging", "alcohol_context", "monday_restart"],
      hiddenFoodFunction: "belonging",
      interaction: "social_belonging_alcohol",
      firstGentleChange: "social_choice_script",
      safetyMode: "mode1",
      scoreAtLeast: { social_table: 7, belonging: 7, alcohol_context: 6, monday_restart: 3 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "body_shame_restriction",
    description: "Body shame links to stricter restriction and escape-from-shame function.",
    state: {
      packageType: "one-time",
      stageAnswers: {
        "S1-C06": ["Гадаад төрхөө өөрчлөх", "Хувцсандаа тухтай байх"],
        "S1-W04": ["Мацаг", "Нүүрс ус хасах"],
        "S1-W06": "Маргааш илүү чанга барина"
      },
      stageVoiceSummaries: {
        "S1-V01": makeConfirmedSummary(app, {
          kind: "stage",
          id: "S1-V01",
          structured: {},
          bullets: ["Зураг харах үед ичих, нуух хүсэл нэмэгддэг", "Ичсэн үедээ маргааш илүү чанга барина гэж боддог"]
        })
      },
      removedEntries: []
    },
    expected: {
      primary: "body_change_uncertainty",
      secondaryInclude: ["shame", "strict_diet", "punishment_restriction"],
      hiddenFoodFunction: "escape_from_shame",
      interaction: "body_shame_restriction",
      firstGentleChange: "body_neutral_private_tracking",
      safetyMode: "mode1",
      scoreAtLeast: { body_change_uncertainty: 4, shame: 4, strict_diet: 2, punishment_restriction: 2 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "pcos_body_uncertainty_control",
    description: "PCOS/body-change uncertainty creates control-regain pressure without professional-first red flags.",
    state: {
      packageType: "one-time",
      stageAnswers: {
        "S1-C06": ["Гадаад төрхөө өөрчлөх", "Хувцсандаа тухтай байх"],
        "S1-W06": "Би угаасаа чаддаггүй юм байна"
      },
      stageVoiceSummaries: {
        "S1-V01": makeConfirmedSummary(app, {
          kind: "stage",
          id: "S1-V01",
          structured: {},
          bullets: ["PCOS болон дааврын өөрчлөлтөөс болж бие өөрчлөгдөхөд эргэлзээ төрдөг", "Control буцааж авахын тулд чанга дүрэм хэрэгтэй мэт санагддаг"]
        })
      },
      removedEntries: []
    },
    expected: {
      primary: "body_change_uncertainty",
      secondaryInclude: ["control_regain"],
      hiddenFoodFunction: "control_regain",
      interaction: "pcos_body_uncertainty_control",
      firstGentleChange: "body_neutral_private_tracking",
      safetyMode: "mode1",
      scoreAtLeast: { body_change_uncertainty: 4, control_regain: 3 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  },
  {
    name: "medication_body_concern_professional_check",
    description: "Medication/body concern should suppress ordinary experiment and route professional-first.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-B03": "Тийм",
        "S1-B02": "Тийм, санаа зовоосон"
      },
      removedEntries: repeat(2, day => entry(day, {
        meal_rhythm: "Тогтуун, хоол алгасаагүй",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Өдөр",
        hunger_level: "5",
        food_function: ["Бие эвгүйрхэх вий гэж санаа зовсон"],
        body_signals: ["Сахар унасан мэт санагдах", "Толгой эргэх"],
        confirmedSummaryObject: summary(day, {}, ["Medication болон сахар унасан мэт санаа зовсон", "Толгой эргэх биеийн дохио байсан"])
      }))
    },
    expected: {
      primary: null,
      secondaryInclude: [],
      hiddenFoodFunction: "quick_recovery",
      interaction: "medical_first_body_signal",
      firstGentleChange: "professional_discussion_summary",
      safetyMode: "mode3",
      ordinaryAllowed: false,
      scoreAtLeast: { medical_concern: 6, medical_red_flag: 7, professional_first: 7 },
      scoreAtMost: { meal_gap: 3, evening_hunger: 3, hunger_safety: 3 }
    }
  }
];

export const futureDriverStackFixtures = [
  {
    name: "sleep_disruption_circadian_reward",
    description: "Future helper fixture retained outside the approved WP3B result set.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-N01": "4-6 цаг",
        "S1-N02": "Маш тод",
        "S1-R01": "Бараг өдөр бүр"
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Тогтуун, хоол алгасаагүй",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Орой",
        hunger_level: "3",
        food_function: ["Амттай юм идмээр байсан", "Ядарсан"],
        emotion: "Ядарсан",
        energy_score: "2",
        sleep: ["4-6 цаг", "Олон сэрсэн, чанар муу"]
      }, ["Нойр муу, оройн energy бага байсан", "Амттай юм хурдан тэнхээ өгөх шиг санагдсан"]))
    }
  },
  {
    name: "stage_reward_diary_meal_gap_contradiction",
    description: "Future helper fixture retained outside the approved WP3B result set.",
    state: {
      packageType: "removed-feature",
      stageAnswers: {
        "S1-R01": "Өдөрт олон удаа",
        "S1-R02": ["Амт, үнэр, мэдрэмж татах үед"]
      },
      removedEntries: repeat(5, day => entry(day, {
        meal_rhythm: "Хоол хоорондын зай хэтэрсэн",
        unplanned_eating_count: "Тийм, нэг удаа",
        main_moment_time: "Орой",
        hunger_level: "9",
        food_function: ["Өлссөндөө", "Дараа өлсөхөөс санаа зовсон"],
        emotion: "Ядарсан",
        energy_score: "2"
      }, ["Орой хоолны зай уртссан", "Өлсөлт өндөр байсан", "Амттай зүйлээс илүү дараа өлсөхөөс санаа зовсон"]))
    }
  }
];

~~~~~~

## tests/driver-stack/driverStackContract.test.js

~~~~~~js
const assert = require("assert");

(async () => {
  const calculator = await import("./driverStackTestCalculator.mjs");
  const { driverStackFixtures } = await import("./driverStackFixtures.mjs");
  const {
    buildDriverStack,
    calculateTestDriverStack,
    normalizeDriverScore,
    strengthFromNormalizedScore,
    selectPrimaryDriver,
    selectSecondaryDrivers,
    buildInteractionPattern,
    buildVulnerableMoment,
    buildFirstGentleChange,
    buildFourteenDayExperimentHypothesis,
    buildRemovedFeatureConfirmationTargets
  } = calculator;

  [
    calculateTestDriverStack,
    normalizeDriverScore,
    strengthFromNormalizedScore,
    selectPrimaryDriver,
    selectSecondaryDrivers,
    buildInteractionPattern,
    buildVulnerableMoment,
    buildFirstGentleChange,
    buildFourteenDayExperimentHypothesis,
    buildRemovedFeatureConfirmationTargets
  ].forEach(fn => assert.strictEqual(typeof fn, "function"));

  assert.strictEqual(normalizeDriverScore(5, 10), 5);
  assert.strictEqual(normalizeDriverScore(100, 10), 10);
  assert.strictEqual(strengthFromNormalizedScore(0, false), "inactive");
  assert.strictEqual(strengthFromNormalizedScore(5, false), "moderate");
  assert.strictEqual(strengthFromNormalizedScore(8, false), "strong");
  assert.strictEqual(strengthFromNormalizedScore(9, false), "very_strong");
  assert.strictEqual(strengthFromNormalizedScore(2, true), "safety");

  const stack = buildDriverStack(driverStackFixtures[0].state);

  assert.strictEqual(stack.version, "driver-stack-v0-test-only");
  assert(stack.source);
  assert.strictEqual(typeof stack.source.stage_answer_count, "number");
  assert.strictEqual(typeof stack.source.diary_entry_count, "number");
  assert(stack.safety_route);
  assert(Object.prototype.hasOwnProperty.call(stack.safety_route, "ordinary_report_allowed"));
  assert(stack.driver_scores);
  assert(stack.primary_driver);
  assert.strictEqual(stack.primary_driver.not_a_type, true);
  assert(Array.isArray(stack.secondary_drivers));
  assert(stack.interaction_pattern.id);
  assert(stack.vulnerable_moment.id);
  assert(stack.visible_condition.plain_language);
  assert(stack.hidden_food_function.key);
  assert(stack.wrong_self_explanation.key);
  assert(stack.first_gentle_change.id);
  assert(stack.fourteen_day_experiment_hypothesis.hypothesis);
  assert(Array.isArray(stack.removed_feature_diary_confirmation_targets));
  assert(stack.removed_feature_diary_confirmation_targets.length >= 2);
  assert(Array.isArray(stack.evidence_sources));
  assert(stack.copy_constraints.includes("no_one_type_label"));
  assert(stack.copy_constraints.includes("no_ordinary_experiment_when_professional_first"));

  Object.values(stack.driver_scores).forEach(score => {
    assert.deepStrictEqual(Object.keys(score).sort(), [
      "confidence",
      "diaryEvidenceCount",
      "directEvidenceCount",
      "evidenceItems",
      "expectedMaxScore",
      "inferredOnly",
      "key",
      "layer",
      "normalizedScore",
      "rawScore",
      "relatedOldMechanisms",
      "strength"
    ].sort(), `${score.key}: official driver score keys`);
    assert(Number.isFinite(score.rawScore), `${score.key}: rawScore`);
    assert(Number.isFinite(score.expectedMaxScore), `${score.key}: expectedMaxScore`);
    assert(Number.isInteger(score.normalizedScore), `${score.key}: normalizedScore integer`);
    assert(score.normalizedScore >= 0 && score.normalizedScore <= 10, `${score.key}: normalizedScore range`);
    assert(["inactive", "weak", "moderate", "strong", "very_strong", "safety"].includes(score.strength), `${score.key}: strength`);
    assert(score.layer, `${score.key}: layer`);
    assert(Object.prototype.hasOwnProperty.call(score, "confidence"), `${score.key}: confidence`);
    assert(["possible", "moderate", "strong", "safety"].includes(score.confidence), `${score.key}: approved confidence enum`);
    assert(Array.isArray(score.evidenceItems), `${score.key}: evidenceItems`);
    assert(Array.isArray(score.relatedOldMechanisms), `${score.key}: relatedOldMechanisms`);
    assert(Number.isInteger(score.directEvidenceCount), `${score.key}: directEvidenceCount`);
    assert(Number.isInteger(score.diaryEvidenceCount), `${score.key}: diaryEvidenceCount`);
    assert.strictEqual(typeof score.inferredOnly, "boolean", `${score.key}: inferredOnly`);
    assert(!Object.prototype.hasOwnProperty.call(score, "evidence_items"), `${score.key}: no snake evidence_items`);
    assert(!Object.prototype.hasOwnProperty.call(score, "related_old_mechanisms"), `${score.key}: no snake related_old_mechanisms`);
  });

  console.log("driverStackContract tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});

~~~~~~

## tests/driver-stack/driverStackFixtures.test.js

~~~~~~js
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

~~~~~~

## tests/driver-stack/driverStackSafetyInvariants.test.js

~~~~~~js
const assert = require("assert");

(async () => {
  const { buildDriverStack } = await import("./driverStackTestCalculator.mjs");
  const { driverStackFixtures } = await import("./driverStackFixtures.mjs");

  const medicalFixture = driverStackFixtures.find(fixture => fixture.name === "medication_body_concern_professional_check");
  const medical = buildDriverStack(medicalFixture.state);

  assert.strictEqual(medical.safety_route.mode, "mode3");
  assert.strictEqual(medical.safety_route.ordinary_report_allowed, false);
  assert.strictEqual(medical.safety_route.ordinary_experiment_allowed, false);
  assert(medical.safety_route.safety_drivers.includes("professional_first"));
  assert(medical.safety_route.safety_drivers.includes("medical_red_flag"));
  assert.strictEqual(medical.primary_driver, null);
  assert.strictEqual(medical.first_gentle_change.id, "professional_discussion_summary");
  assert.strictEqual(medical.fourteen_day_experiment_hypothesis.duration_days, 0);
  assert(medical.copy_constraints.includes("no_ordinary_experiment_when_professional_first"));
  assert(medical.copy_constraints.includes("no_paywall_blocks_safety"));

  const urgent = buildDriverStack({
    packageType: "removed-feature",
    stageAnswers: {
      "S1-S04": "Одоо идэвхтэй бодогдож байна"
    },
    removedEntries: []
  });
  assert.strictEqual(urgent.safety_route.mode, "mode4");
  assert.strictEqual(urgent.safety_route.ordinary_report_allowed, false);
  assert.strictEqual(urgent.safety_route.ordinary_experiment_allowed, false);
  assert(urgent.safety_route.safety_drivers.includes("professional_first"));
  assert.strictEqual(urgent.primary_driver, null);
  assert.strictEqual(urgent.fourteen_day_experiment_hypothesis.duration_days, 0);

  const compensatory = buildDriverStack({
    packageType: "one-time",
    stageAnswers: {
      "S1-S03": "Одоо давтагддаг"
    },
    stageVoiceSummaries: {},
    removedEntries: []
  });
  assert(compensatory.driver_scores.compensatory_behavior || compensatory.driver_scores.professional_first);
  assert(compensatory.safety_route.safety_drivers.includes("professional_first"));
  assert.strictEqual(compensatory.safety_route.ordinary_experiment_allowed, false);

  console.log("driverStackSafetyInvariants tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});

~~~~~~

## tests/driver-stack/exportDriverStackFixtureResults.mjs

~~~~~~js
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

~~~~~~

## audits/mvp-diagnostic-migration/work-pack-3/driver-stack-calculator-notes.md

~~~~~~md
# Work Pack 3 Driver Stack Calculator Notes

## Scope

Work Pack 3 adds a parallel, test-only driver stack calculator.

It does not replace the current questionnaire, mechanism scoring, report generation, PDF flow, payment flow, entitlement flow, QPay flow, backend flow, or deploy configuration.

Runtime application files remain out of scope. The calculator lives under `tests/driver-stack/` and is executed only by tests.

## Files added

- `tests/driver-stack/driverStackTestCalculator.mjs`
- `tests/driver-stack/driverStackFixtures.mjs`
- `tests/driver-stack/driverStackContract.test.js`
- `tests/driver-stack/driverStackFixtures.test.js`
- `tests/driver-stack/driverStackSafetyInvariants.test.js`
- `tests/driver-stack/exportDriverStackFixtureResults.mjs`

## Work Pack 3A Patch

Work Pack 3A fixes the partial Work Pack 3 implementation while keeping the work test-only.

The patch adds the approved calculator export names:

- `calculateTestDriverStack(input)`
- `normalizeDriverScore(rawScore, expectedMaxScore)`
- `strengthFromNormalizedScore(normalizedScore, isSafety)`
- `selectPrimaryDriver(driverScores, safetyRoute)`
- `selectSecondaryDrivers(driverScores, primaryDriver, safetyRoute)`
- `buildInteractionPattern(driverScores, primaryDriver, secondaryDrivers)`
- `buildVulnerableMoment(input, driverScores, interactionPattern, safetyRoute)`
- `buildFirstGentleChange(driverScores, interactionPattern, safetyRoute)`
- `buildFourteenDayExperimentHypothesis(firstGentleChange, vulnerableMoment, interactionPattern)`
- `buildRemovedFeatureConfirmationTargets(driverScores, vulnerableMoment)`

It also tightens fixture assertions so wrong primaries, wrong hidden food functions, unrelated score saturation, and missing safety overrides fail tests.

## Work Pack 3B Patch

Work Pack 3B is the final contract-compliance patch for the test-only driver stack.

It fixes:

- the main fixture list to exactly the approved 10 WP3B fixture names and order;
- the public `driver_scores` object to the official WP2A camelCase score contract;
- the fixture result JSON shape to include `approvedFixtureNames`, official `driverScores`, and top-score summaries using the same public fields;
- the owner recommendation status to remain review-required before any runtime implementation.

Removed fixtures are retained only as `futureDriverStackFixtures` helpers and are not included in `driverStackFixtures` or the generated fixture result JSON.

## Work Pack 3C Patch

Work Pack 3C changes metadata and artifact contract only.

It keeps scoring logic, fixture behavior, and expected fixture outputs unchanged while correcting:

- recommendation enum: `READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK`;
- public driver score confidence enum to `possible`, `moderate`, `strong`, or `safety`.

## Work Pack 3D Patch

Work Pack 3D changes the generated fixture result artifact shape only.

It keeps scoring logic, fixture behavior, fixture names, expected fixture outputs, and runtime behavior unchanged while correcting:

- fixture result JSON wrapper keys to the final camelCase artifact contract;
- fixture result summary keys to the final camelCase artifact contract;
- artifact shape tests so stale snake_case summary keys fail.

## Work Pack 3E Patch

Work Pack 3E is a final artifact key verification patch only.

It keeps scoring logic, fixture behavior, fixture names, expected fixture outputs, and runtime behavior unchanged while locking the generated artifact wrapper to:

```json
{
  "version": "driver-stack-v0-test-only",
  "generatedBy": "tests/driver-stack/exportDriverStackFixtureResults.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK",
  "approvedFixtureNames": [],
  "fixtureCount": 10,
  "results": []
}
```

The fixture tests now explicitly reject stale wrapper keys: `generated_by`, `approved_fixture_names`, and `fixture_count`.

## Work Pack 3F Patch

Work Pack 3F changes only the generated fixture result item shape.

It keeps scoring logic, fixture behavior, fixture names, expected fixture outputs, and runtime behavior unchanged while reducing each `results[]` item to the compact owner-review artifact shape:

```json
{
  "name": "shift_work_recovery_only",
  "safetyMode": "mode1",
  "primaryDriverKeys": ["shift_work"],
  "secondaryDriverKeys": ["quick_recovery"],
  "interactionId": "shift_work_recovery_only",
  "vulnerableMomentId": "shift_work_recovery_only",
  "firstGentleChangeId": "shift_recovery_anchor",
  "experimentId": "shift_recovery_anchor",
  "hiddenFoodFunctionKey": "quick_recovery",
  "pass": true
}
```

The fixture artifact no longer exports debug/full fields such as `fixtureName`, `description`, `ordinaryReportAllowed`, `ordinaryExperimentAllowed`, `primaryDriver`, `primaryNormalizedScore`, `secondaryDrivers`, `interactionPattern`, `vulnerableMoment`, `visibleCondition`, `hiddenFoodFunction`, `wrongSelfExplanation`, `firstGentleChange`, `experimentDurationDays`, `confirmationTargets`, `safetyDrivers`, `driverScores`, or `topDriverScores`.

## Test runner registration

`tests/run-all.js` now includes the three driver-stack tests so `npm test` validates the test-only migration contract.

This is a test harness change only. It does not alter runtime app behavior.

## Inputs

The calculator accepts a current app-style state shape:

- `packageType`
- `stageAnswers`
- `stageVoiceSummaries`
- `preliminary`
- `removedEntries`

It imports existing app exports in read-only fashion:

- `calculateMechanismEvidence`
- `getOptionMetadata`
- `mechanismNamesByKey`
- `createConfirmedSummaryObject` for fixture construction

The calculator uses existing mechanism evidence as an input layer rather than replacing it.

## Output contract

The output follows the Work Pack 2/2A driver-stack contract:

- `version`
- `source`
- `safety_route`
- `driver_scores`
- `primary_driver`
- `secondary_drivers`
- `interaction_pattern`
- `vulnerable_moment`
- `visible_condition`
- `hidden_food_function`
- `wrong_self_explanation`
- `first_gentle_change`
- `fourteen_day_experiment_hypothesis`
- `removed_feature_diary_confirmation_targets`
- `evidence_sources`
- `copy_constraints`

## Raw and normalized scoring

Each driver score contains:

- `rawScore`: summed weighted evidence points
- `expectedMaxScore`: driver-specific useful maximum
- `normalizedScore`: 0-10 score used in fixture assertions
- `strength`: inactive, weak, moderate, strong, very_strong, or safety
- `confidence`: possible, moderate, strong, or safety
- `evidenceItems`: public evidence item list
- `relatedOldMechanisms`: current-system mechanisms used as inferred evidence
- `directEvidenceCount`: count of non-inferred non-repetition evidence items
- `diaryEvidenceCount`: count of diary or diary-summary evidence items
- `inferredOnly`: true when the score is supported only by inferred old-mechanism evidence

Baseline normalization:

```js
normalizedScore = Math.min(10, Math.round((rawScore / expectedMaxScore) * 10))
```

## Mechanism crosswalk

The calculator maps current mechanism keys into new driver keys using the Work Pack 2 crosswalk:

- `reward`
- `regulation`
- `hungerSafety`
- `glucose`
- `satiety`
- `cue`
- `collapse`
- `executive`
- `circadian`
- `social`
- `medical`
- `autonomy`
- `physiological`
- `decisionDefault`
- `rewardDeficit`
- `roleOverload`
- `shameAvoidance`
- `bodySafety`
- `identity`
- `perfectionism`

The mapping is intentionally test-only and conservative. It preserves old mechanisms as evidence in `related_old_mechanisms`.

## Direct evidence signals

The calculator also reads:

- current option metadata tags
- stage answer text
- confirmed stage summaries
- diary structured fields
- confirmed diary summaries
- repeated diary-day evidence

Diary repetition gives additional evidence weight when a driver appears across multiple days.

Work Pack 3A narrows these signals to avoid false saturation:

- `хоол алгасаагүй` no longer counts as `meal_gap`.
- Generic legacy `hungerSafety` does not automatically dominate stress, cue, social, sleep, or loneliness fixtures.
- Confirmed summary text is used, but broad app-generated summary tags are not used as driver-score evidence in this test-only layer.
- Hidden food function is selected by interaction-specific food-function preference before generic score rank.

## Safety handling

Safety drivers outrank ordinary driver selection.

If professional-first evidence is active, the calculator:

- sets `ordinary_report_allowed` to `false`
- sets `ordinary_experiment_allowed` to `false`
- sets `primary_driver` to `null`
- returns `professional_discussion_summary`
- sets the ordinary 14-day experiment duration to `0`

Safety invariants are covered by `tests/driver-stack/driverStackSafetyInvariants.test.js`.

## Non-runtime guarantee

The implementation does not:

- modify `app.js`
- change questions
- change current scoring
- change report copy
- change PDF generation
- change localStorage behavior
- change backend/payment/QPay/pricing/entitlement
- deploy anything

## Known limitations

This is not production scoring.

It is a migration bridge for tests, owner review, and future implementation planning. Thresholds and tie-breakers are deliberately explicit so they can be reviewed before any runtime work begins.

~~~~~~

## audits/mvp-diagnostic-migration/work-pack-3/fixture-results-summary.md

~~~~~~md
# Work Pack 3 Fixture Results Summary

## Source

Fixture results were generated from:

- `tests/driver-stack/driverStackTestCalculator.mjs`
- `tests/driver-stack/driverStackFixtures.mjs`

Machine-readable results are saved in:

- `audits/mvp-diagnostic-migration/work-pack-3/driver-stack-fixture-results.json`

The Work Pack 3D result artifact uses the final camelCase wrapper and summary keys, while preserving the official camelCase public driver score fields.

Work Pack 3E confirms the artifact wrapper keys are exactly `version`, `generatedBy`, `recommendation`, `approvedFixtureNames`, `fixtureCount`, and `results`.

Work Pack 3F reduces each `results[]` item to compact owner-review fields only: `name`, `safetyMode`, `primaryDriverKeys`, `secondaryDriverKeys`, `interactionId`, `vulnerableMomentId`, `firstGentleChangeId`, `experimentId`, `hiddenFoodFunctionKey`, and `pass`.

## Fixture coverage

| Fixture | Safety mode | Primary driver | Interaction pattern | First gentle change |
| --- | --- | --- | --- | --- |
| `shift_work_recovery_only` | `mode1` | `shift_work` | `shift_work_recovery_only` | `shift_recovery_anchor` |
| `shift_work_loneliness_combo` | `mode1` | `shift_work` | `shift_work_loneliness_combo` | `shift_recovery_connection_slot` |
| `remote_work_visible_snacks` | `mode1` | `visible_snacks` | `cue_reward_low_friction_default` | `move_one_cue` |
| `stress_delivery_app_comfort` | `mode1` | `stress` | `stress_delivery_app_comfort` | `pre_delivery_decompression_pause` |
| `meal_gap_evening_hunger` | `mode1` | `meal_gap` | `meal_gap_evening_hunger` | `bridge_meal_before_evening` |
| `all_or_nothing_restriction_rebound` | `mode1` | `all_or_nothing` | `all_or_nothing_punishment_restriction` | `next_meal_reset_rule` |
| `social_weekend_alcohol_monday_restart` | `mode1` | `social_table` | `social_belonging_alcohol` | `social_choice_script` |
| `body_shame_restriction` | `mode1` | `body_change_uncertainty` | `body_shame_restriction` | `body_neutral_private_tracking` |
| `pcos_body_uncertainty_control` | `mode1` | `body_change_uncertainty` | `pcos_body_uncertainty_control` | `body_neutral_private_tracking` |
| `medication_body_concern_professional_check` | `mode3` | `null` | `medical_first_body_signal` | `professional_discussion_summary` |

## Assertions covered

The fixture tests assert that:

- fixture names match the approved exact 10 names and order
- removed helper fixtures are not included in the main fixture set
- every fixture produces the exact expected primary driver or safety-null primary
- every fixture produces the expected hidden food function
- public driver scores use official WP2A camelCase fields
- public driver score confidence values use `possible`, `moderate`, `strong`, or `safety`
- fixture result artifact wrapper and summary keys use the final camelCase contract
- fixture result artifact wrapper rejects stale `generated_by`, `approved_fixture_names`, and `fixture_count` keys
- fixture result artifact items reject debug/full fields such as `driverScores`, `topDriverScores`, `description`, and report permission fields
- expected drivers are present with nonzero normalized scores
- expected interaction patterns are selected
- expected first gentle changes are selected
- expected safety modes are respected
- professional-first cases suppress ordinary reports and ordinary experiments
- the output never becomes a one-type label
- repeated diary evidence can outweigh stage-only reward evidence
- unrelated saturation is capped in stress, cue, social, sleep, shift-work, and PCOS fixtures

## Safety fixture behavior

`medication_body_concern_professional_check` routes to `mode3`, suppresses ordinary report/experiment output, and returns `professional_discussion_summary`.

`pcos_body_uncertainty_control` remains `mode1` in the test fixture because it is designed to test body uncertainty and control-regain pressure without escalating to professional-first. More severe body distress should be covered by a separate future safety fixture.

An additional safety invariant test constructs an urgent `S1-S04` case and verifies `mode4` behavior.

## Validation commands

The Work Pack 3 validation set is:

```sh
node tests/driver-stack/driverStackContract.test.js
node tests/driver-stack/driverStackFixtures.test.js
node tests/driver-stack/driverStackSafetyInvariants.test.js
node tests/driver-stack/exportDriverStackFixtureResults.mjs
npm test
git diff --check
```

## Interpretation

The test-only calculator demonstrates that the current system can be extended into an explicit driver-stack contract without replacing the existing mechanism system.

The strongest next-step value is not runtime adoption yet. The next value is owner review of the test contract, fixture archetypes, safety invariants, and driver tie-breakers.

~~~~~~

## audits/mvp-diagnostic-migration/work-pack-3/driver-stack-fixture-results.json

~~~~~~json
{
  "version": "driver-stack-v0-test-only",
  "generatedBy": "tests/driver-stack/exportDriverStackFixtureResults.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK",
  "approvedFixtureNames": [
    "shift_work_recovery_only",
    "shift_work_loneliness_combo",
    "remote_work_visible_snacks",
    "stress_delivery_app_comfort",
    "meal_gap_evening_hunger",
    "all_or_nothing_restriction_rebound",
    "social_weekend_alcohol_monday_restart",
    "body_shame_restriction",
    "pcos_body_uncertainty_control",
    "medication_body_concern_professional_check"
  ],
  "fixtureCount": 10,
  "results": [
    {
      "name": "shift_work_recovery_only",
      "safetyMode": "mode1",
      "primaryDriverKeys": [
        "shift_work"
      ],
      "secondaryDriverKeys": [
        "quick_recovery"
      ],
      "interactionId": "shift_work_recovery_only",
      "vulnerableMomentId": "shift_work_recovery_only",
      "firstGentleChangeId": "shift_recovery_anchor",
      "experimentId": "shift_recovery_anchor",
      "hiddenFoodFunctionKey": "quick_recovery",
      "pass": true
    },
    {
      "name": "shift_work_loneliness_combo",
      "safetyMode": "mode1",
      "primaryDriverKeys": [
        "shift_work"
      ],
      "secondaryDriverKeys": [
        "decompression",
        "loneliness",
        "comfort"
      ],
      "interactionId": "shift_work_loneliness_combo",
      "vulnerableMomentId": "shift_work_loneliness_combo",
      "firstGentleChangeId": "shift_recovery_connection_slot",
      "experimentId": "shift_recovery_connection_slot",
      "hiddenFoodFunctionKey": "loneliness_soothing",
      "pass": true
    },
    {
      "name": "remote_work_visible_snacks",
      "safetyMode": "mode1",
      "primaryDriverKeys": [
        "visible_snacks"
      ],
      "secondaryDriverKeys": [
        "self_reward",
        "food_photo_cue",
        "low_friction_default"
      ],
      "interactionId": "cue_reward_low_friction_default",
      "vulnerableMomentId": "cue_reward_low_friction_default",
      "firstGentleChangeId": "move_one_cue",
      "experimentId": "move_one_cue",
      "hiddenFoodFunctionKey": "self_reward",
      "pass": true
    },
    {
      "name": "stress_delivery_app_comfort",
      "safetyMode": "mode1",
      "primaryDriverKeys": [
        "stress"
      ],
      "secondaryDriverKeys": [
        "low_friction_default",
        "delivery_app",
        "decompression"
      ],
      "interactionId": "stress_delivery_app_comfort",
      "vulnerableMomentId": "stress_delivery_app_comfort",
      "firstGentleChangeId": "pre_delivery_decompression_pause",
      "experimentId": "pre_delivery_decompression_pause",
      "hiddenFoodFunctionKey": "decompression",
      "pass": true
    },
    {
      "name": "meal_gap_evening_hunger",
      "safetyMode": "mode1",
      "primaryDriverKeys": [
        "meal_gap"
      ],
      "secondaryDriverKeys": [
        "low_friction_default",
        "quick_recovery",
        "hunger_safety"
      ],
      "interactionId": "meal_gap_evening_hunger",
      "vulnerableMomentId": "meal_gap_evening_hunger",
      "firstGentleChangeId": "bridge_meal_before_evening",
      "experimentId": "bridge_meal_before_evening",
      "hiddenFoodFunctionKey": "hunger_safety",
      "pass": true
    },
    {
      "name": "all_or_nothing_restriction_rebound",
      "safetyMode": "mode1",
      "primaryDriverKeys": [
        "all_or_nothing"
      ],
      "secondaryDriverKeys": [
        "meal_gap",
        "evening_hunger",
        "strict_diet"
      ],
      "interactionId": "all_or_nothing_punishment_restriction",
      "vulnerableMomentId": "all_or_nothing_punishment_restriction",
      "firstGentleChangeId": "next_meal_reset_rule",
      "experimentId": "next_meal_reset_rule",
      "hiddenFoodFunctionKey": "hunger_safety",
      "pass": true
    },
    {
      "name": "social_weekend_alcohol_monday_restart",
      "safetyMode": "mode1",
      "primaryDriverKeys": [
        "social_table"
      ],
      "secondaryDriverKeys": [
        "all_or_nothing",
        "monday_restart",
        "belonging"
      ],
      "interactionId": "social_belonging_alcohol",
      "vulnerableMomentId": "social_belonging_alcohol",
      "firstGentleChangeId": "social_choice_script",
      "experimentId": "social_choice_script",
      "hiddenFoodFunctionKey": "belonging",
      "pass": true
    },
    {
      "name": "body_shame_restriction",
      "safetyMode": "mode1",
      "primaryDriverKeys": [
        "body_change_uncertainty"
      ],
      "secondaryDriverKeys": [
        "shame",
        "escape_from_shame",
        "strict_diet"
      ],
      "interactionId": "body_shame_restriction",
      "vulnerableMomentId": "body_shame_restriction",
      "firstGentleChangeId": "body_neutral_private_tracking",
      "experimentId": "body_neutral_private_tracking",
      "hiddenFoodFunctionKey": "escape_from_shame",
      "pass": true
    },
    {
      "name": "pcos_body_uncertainty_control",
      "safetyMode": "mode1",
      "primaryDriverKeys": [
        "body_change_uncertainty"
      ],
      "secondaryDriverKeys": [
        "control_regain"
      ],
      "interactionId": "pcos_body_uncertainty_control",
      "vulnerableMomentId": "pcos_body_uncertainty_control",
      "firstGentleChangeId": "body_neutral_private_tracking",
      "experimentId": "body_neutral_private_tracking",
      "hiddenFoodFunctionKey": "control_regain",
      "pass": true
    },
    {
      "name": "medication_body_concern_professional_check",
      "safetyMode": "mode3",
      "primaryDriverKeys": [],
      "secondaryDriverKeys": [],
      "interactionId": "medical_first_body_signal",
      "vulnerableMomentId": "medical_first_body_signal",
      "firstGentleChangeId": "professional_discussion_summary",
      "experimentId": "professional_discussion_summary",
      "hiddenFoodFunctionKey": "quick_recovery",
      "pass": true
    }
  ]
}

~~~~~~

## audits/mvp-diagnostic-migration/work-pack-3/work-pack-3-recommendation.md

~~~~~~md
# Work Pack 3 Recommendation

## Recommendation

Keep Work Pack 3 as a test-only migration layer until owner review is complete.

The current system should remain the production source of truth for questions, scoring, report copy, diary behavior, safety routing, PDF generation, payment, QPay, backend, pricing, and entitlement behavior.

## What Work Pack 3 proves

Work Pack 3 shows that the accepted migration direction is feasible:

```text
answers + diary evidence
-> old mechanisms
-> new driver scores
-> primary driver
-> secondary drivers
-> interaction pattern
-> vulnerable moment
-> hidden food function
-> first gentle change
-> 14-day experiment hypothesis
-> 7-day diary confirmation targets
```

It also shows that professional-first safety can override ordinary behavior-change output in the new driver-stack contract.

## Work Pack 3A Patch Result

Work Pack 3A should be treated as the corrected owner-review version of Work Pack 3.

It fixes:

- missing calculator export names;
- incomplete driver score object fields;
- non-approved fixture names;
- missing `shift_work_loneliness_combo`;
- missing `pcos_body_uncertainty_shame`;
- score saturation from false meal-gap matches and broad legacy tags;
- hidden food function selection falling back to `hunger_safety` too often;
- loose tests that allowed wrong outputs to pass.

## Work Pack 3B Patch Result

Work Pack 3B should be treated as the contract-compliant owner-review version of Work Pack 3.

Recommendation enum:

```text
READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK
```

This enum means the test-only driver stack is ready for owner review, but no runtime integration, report generation, scoring change, PDF change, backend/payment/QPay/pricing/entitlement change, or deploy should happen yet.

Work Pack 3B fixes:

- exact approved fixture names and order;
- official WP2A public driver score fields;
- fixture result JSON shape;
- keeping removed fixtures outside the main result set;
- recommendation status before future implementation.

## Work Pack 3C Metadata Patch

Work Pack 3C changes metadata and artifact contract only.

It fixes:

- recommendation enum to `READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK`;
- public driver score confidence values to the approved enum: `possible`, `moderate`, `strong`, `safety`.

It does not change scoring logic, fixture behavior, expected fixture outputs, runtime behavior, PDF generation, backend/payment/QPay/pricing/entitlement, or deploy configuration.

## Work Pack 3D Artifact Shape Patch

Work Pack 3D changes only the fixture result artifact shape.

It fixes:

- fixture result JSON wrapper keys to the final camelCase contract;
- fixture result JSON per-fixture summary keys to the final camelCase contract;
- artifact-shape assertions so stale snake_case result keys fail.

It does not change scoring logic, fixture behavior, fixture names, expected fixture outputs, runtime behavior, PDF generation, backend/payment/QPay/pricing/entitlement, or deploy configuration.

## Work Pack 3E Artifact Key Patch

Work Pack 3E is the final artifact key verification patch only.

It confirms the fixture result JSON wrapper is exactly:

```json
{
  "version": "driver-stack-v0-test-only",
  "generatedBy": "tests/driver-stack/exportDriverStackFixtureResults.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY DRIVER STACK",
  "approvedFixtureNames": [],
  "fixtureCount": 10,
  "results": []
}
```

It also adds a test guard against stale wrapper keys: `generated_by`, `approved_fixture_names`, and `fixture_count`.

It does not change scoring logic, fixture behavior, fixture names, expected fixture outputs, runtime behavior, PDF generation, backend/payment/QPay/pricing/entitlement, or deploy configuration.

## Work Pack 3F Compact Result Patch

Work Pack 3F changes only the generated fixture result item shape.

It reduces each `results[]` item to:

```json
{
  "name": "shift_work_recovery_only",
  "safetyMode": "mode1",
  "primaryDriverKeys": ["shift_work"],
  "secondaryDriverKeys": ["quick_recovery"],
  "interactionId": "shift_work_recovery_only",
  "vulnerableMomentId": "shift_work_recovery_only",
  "firstGentleChangeId": "shift_recovery_anchor",
  "experimentId": "shift_recovery_anchor",
  "hiddenFoodFunctionKey": "quick_recovery",
  "pass": true
}
```

It removes debug/full export fields from the artifact, including `fixtureName`, `description`, `ordinaryReportAllowed`, `ordinaryExperimentAllowed`, `primaryDriver`, `primaryNormalizedScore`, `secondaryDrivers`, `interactionPattern`, `vulnerableMoment`, `visibleCondition`, `hiddenFoodFunction`, `wrongSelfExplanation`, `firstGentleChange`, `experimentDurationDays`, `confirmationTargets`, `safetyDrivers`, `driverScores`, and `topDriverScores`.

It does not change scoring logic, fixture behavior, fixture names, expected fixture outputs, runtime behavior, PDF generation, backend/payment/QPay/pricing/entitlement, or deploy configuration.

## What should be reviewed before implementation

Owner review should focus on:

- whether the driver tie-breakers match the desired product explanation
- whether safety-null primary behavior is correct for `mode3` and `mode4`
- whether diary repetition weights are too strong, too weak, or acceptable
- whether direct text/tag signals are acceptable as a test bridge
- whether the fixture set covers enough edge cases before runtime scoring work
- whether first gentle changes are the right action vocabulary

## Recommended next work pack

Before any runtime implementation, create a small Work Pack 3A review patch if needed.

Possible future items:

- add more contradiction fixtures
- add fixtures for `binge_risk`, `compensatory_behavior`, and `severe_body_distress`
- add fixtures for cafeteria, nearby store, and strict diet
- add fixture snapshots for one-time versus removed-feature evidence quality

Only after owner approval should a future Work Pack 4 propose runtime integration.

## Do not do yet

Do not:

- change `app.js`
- rewrite questions
- rewrite reports
- change current scoring
- regenerate PDF
- deploy
- enable QPay
- change backend/payment/pricing/entitlement behavior
- change production or localStorage behavior

## Commit guidance

When approved, commit only:

- `audits/mvp-diagnostic-migration/work-pack-3/`
- `tests/driver-stack/`
- the test-only addition to `tests/run-all.js`

Do not include unrelated audit folders or runtime files.

~~~~~~
