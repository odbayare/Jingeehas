"use strict";

const REPORT_PATTERNS = Object.freeze({
  emotional_regulation: {
    id: "emotional_regulation", category: "psychological", title: "Сэтгэл хөдлөл ихсэх үед хоол руу татагдах хэв маяг",
    signals: ["emotional_eating", "emotional_barrier"], contradictions: ["emotional_eating"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "pause_before_emotional_eating"
  },
  environmental_cues: {
    id: "environmental_cues", category: "behavioral", title: "Орчны дохио идэх хүсэлд нөлөөлөх хэв маяг",
    signals: ["environmental_cue_reactivity", "environmental_barrier", "environmental_portion_trigger", "home_environment_exposure"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "change_one_visible_cue"
  },
  irregular_meals_late_hunger: {
    id: "irregular_meals_late_hunger", category: "behavioral", title: "Хоолны зай уртсаж, өлсөлт оройтож мэдрэгдэх хэв маяг",
    signals: ["meal_gap", "irregular_meal_rhythm", "late_hunger_recognition", "hunger_satiety_barrier"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "anchor_one_meal_time"
  },
  hunger_satiety: {
    id: "hunger_satiety", category: "behavioral", title: "Өлсөх, цадах мэдрэмжийг цагт нь анзаарахад хүндрэлтэй хэв маяг",
    signals: ["hunger_recognition_difficulty", "satiety_difficulty", "portion_difficulty", "hunger_satiety_barrier"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "mid_meal_pause"
  },
  sleep_fatigue: {
    id: "sleep_fatigue", category: "contextual", title: "Нойр, ядаргаа өдөр тутмын сонголтыг хүндрүүлэх нөхцөл",
    signals: ["short_sleep", "poor_sleep_quality", "sleep_fatigue", "fatigue_barrier"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "fixed_wind_down"
  },
  low_movement: {
    id: "low_movement", category: "contextual", title: "Өдрийн хөдөлгөөний суурь түвшин бага байх нөхцөл",
    signals: ["sedentary_context", "low_movement"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "one_movement_anchor"
  },
  restrictive_rebound: {
    id: "restrictive_rebound", category: "behavioral", title: "Хэт хатуу арга удаан үргэлжлэхгүй буцах хэв маяг",
    signals: ["restrictive_method_current", "restrictive_method_past", "short_lived_attempt", "weight_regain", "strict_rule_barrier"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "remove_one_strict_rule"
  },
  plan_daily_life_mismatch: {
    id: "plan_daily_life_mismatch", category: "behavioral", title: "Төлөвлөгөө өдөр тутмын амьдралтай нийцэхгүй байх саад",
    signals: ["schedule_mismatch", "short_lived_attempt", "practical_barrier", "fatigue_barrier"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "minimum_viable_plan"
  },
  previous_attempt_sustainability: {
    id: "previous_attempt_sustainability", category: "behavioral", title: "Арга зогссоны дараах үр дүнгээ хадгалах шилжилтийн саад",
    signals: ["activity_based_method", "sustained_attempt", "initial_attempt_success", "short_lived_attempt", "attempt_not_sustained", "weight_regain", "sustainability_barrier", "strict_rule_barrier", "schedule_mismatch", "practical_barrier"],
    minQuestionIds: 3, minDimensions: 3, threshold: 6,
    recommendationId: "build_maintenance_bridge"
  }
});

const PATTERN_PRIORITY = Object.freeze({
  restrictive_rebound: 90, irregular_meals_late_hunger: 85, hunger_satiety: 80,
  emotional_regulation: 75, sleep_fatigue: 70, plan_daily_life_mismatch: 65,
  environmental_cues: 60, previous_attempt_sustainability: 55, low_movement: 50
});

const INTERACTION_RULES = Object.freeze([
  { id: "meal_hunger_satiety", patterns: ["irregular_meals_late_hunger", "hunger_satiety"] },
  { id: "sleep_plan", patterns: ["sleep_fatigue", "plan_daily_life_mismatch"] },
  { id: "sleep_emotion", patterns: ["sleep_fatigue", "emotional_regulation"] },
  { id: "emotion_restriction", patterns: ["emotional_regulation", "restrictive_rebound"] },
  { id: "cue_meal_rhythm", patterns: ["environmental_cues", "irregular_meals_late_hunger"] },
  { id: "cue_satiety", patterns: ["environmental_cues", "hunger_satiety"] },
  { id: "cue_movement", patterns: ["environmental_cues", "low_movement"] },
  { id: "restriction_sustainability", patterns: ["restrictive_rebound", "previous_attempt_sustainability"] },
  { id: "routine_sustainability", patterns: ["plan_daily_life_mismatch", "previous_attempt_sustainability"] },
  { id: "movement_maintenance", patterns: ["previous_attempt_sustainability", "low_movement"], requiredSignals: ["activity_based_method", "sustained_attempt", "weight_regain"] }
]);

function evaluatePatterns(signalRows = []) {
  const candidates = Object.values(REPORT_PATTERNS).map(pattern => {
    const relevant = signalRows.filter(row => pattern.signals.includes(row.signal));
    const supporting = relevant.filter(row => row.effect > 0 && !row.contextOnly && !row.guidanceOnly);
    const questionIds = new Set(supporting.map(row => row.questionId));
    const dimensions = new Set(supporting.map(row => row.dimension));
    const score = relevant.reduce((sum, row) => sum + Number(row.effect || 0), 0);
    const eligible = questionIds.size >= pattern.minQuestionIds && dimensions.size >= pattern.minDimensions;
    return { ...pattern, score, eligible, supporting, contradicting: relevant.filter(row => row.effect < 0), questionIds: [...questionIds], dimensions: [...dimensions] };
  }).sort((left, right) => right.score - left.score || (PATTERN_PRIORITY[right.id] || 0) - (PATTERN_PRIORITY[left.id] || 0) || left.id.localeCompare(right.id));

  const supported = candidates.filter(candidate => candidate.eligible && candidate.score >= candidate.threshold);
  const nonContextual = supported.filter(candidate => candidate.category !== "contextual");
  const influencingPatterns = nonContextual.slice(0, 4);
  const contextualPatterns = [...supported.filter(candidate => candidate.category === "contextual"), ...nonContextual.slice(4)];
  const supportedIds = new Set(supported.map(candidate => candidate.id));
  const positiveSignals = new Set(signalRows.filter(row => row.effect > 0).map(row => row.signal));
  const interactions = INTERACTION_RULES.filter(rule => rule.patterns.every(id => supportedIds.has(id)) && (rule.requiredSignals || []).every(signal => positiveSignals.has(signal)));
  return { influencingPatterns, contextualPatterns, supported, interactions, candidates };
}

module.exports = { REPORT_PATTERNS, PATTERN_PRIORITY, INTERACTION_RULES, evaluatePatterns };
