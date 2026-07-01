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
    packageType: "seven-day",
    stageAnswers: {},
    stageVoiceSummaries: {},
    preliminary: [],
    diaryEntries: [],
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
  const diaryDays = new Set(score.evidence_items.map(item => item.day_number).filter(Boolean)).size;
  if (score.normalizedScore >= 7 || diaryDays >= 3) return "strong";
  if (score.normalizedScore >= 4 || diaryDays >= 2) return "moderate";
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
  (state.diaryEntries || []).forEach(entry => {
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
  return match("general_driver_stack", fallback, "Several drivers overlap; diary evidence should clarify which one is easiest to change first.", "seven_day_confirmation");
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
  const [id, targets, action] = map[interactionPattern.id] || ["seven_day_confirmation", [], "Use 7-day diary confirmation before choosing the first change."];
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

export function buildSevenDayConfirmationTargets(driverScores, vulnerableMoment) {
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
  const confirmationTargets = buildSevenDayConfirmationTargets(scores, vulnerableMoment);

  return {
    version: "driver-stack-v0-test-only",
    source: {
      stage_answer_count: Object.values(state.stageAnswers || {}).filter(value => Array.isArray(value) ? value.length : value !== "" && value !== undefined && value !== null).length,
      diary_entry_count: (state.diaryEntries || []).length,
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
    seven_day_diary_confirmation_targets: confirmationTargets,
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
