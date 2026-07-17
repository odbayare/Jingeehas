"use strict";

const REPORT_PATTERNS = Object.freeze({
  emotional_regulation: {
    id: "emotional_regulation", title: "Сэтгэл хөдлөл ихсэх үед хоол руу татагдах хэв маяг",
    signals: ["emotional_eating", "emotional_barrier"], contradictions: ["emotional_eating"],
    minQuestionIds: 2, minDimensions: 2, primaryThreshold: 4, secondaryThreshold: 4,
    recommendationId: "pause_before_emotional_eating"
  },
  environmental_cues: {
    id: "environmental_cues", title: "Орчны дохио идэх хүсэлд нөлөөлөх хэв маяг",
    signals: ["environmental_cue_reactivity", "environmental_barrier", "environmental_portion_trigger", "home_environment_exposure"],
    minQuestionIds: 2, minDimensions: 2, primaryThreshold: 4, secondaryThreshold: 4,
    recommendationId: "change_one_visible_cue"
  },
  irregular_meals_late_hunger: {
    id: "irregular_meals_late_hunger", title: "Хоолны зай уртсаж, өлсөлт оройтож мэдрэгдэх хэв маяг",
    signals: ["meal_gap", "irregular_meal_rhythm", "late_hunger_recognition", "hunger_satiety_barrier"],
    minQuestionIds: 2, minDimensions: 2, primaryThreshold: 4, secondaryThreshold: 4,
    recommendationId: "anchor_one_meal_time"
  },
  hunger_satiety: {
    id: "hunger_satiety", title: "Өлсөх, цадах мэдрэмжийг цагт нь анзаарахад хүндрэлтэй хэв маяг",
    signals: ["hunger_recognition_difficulty", "satiety_difficulty", "portion_difficulty", "hunger_satiety_barrier"],
    minQuestionIds: 2, minDimensions: 2, primaryThreshold: 4, secondaryThreshold: 4,
    recommendationId: "mid_meal_pause"
  },
  sleep_fatigue: {
    id: "sleep_fatigue", title: "Нойр, ядаргаа өдөр тутмын сонголтыг хүндрүүлэх нөхцөл",
    signals: ["short_sleep", "poor_sleep_quality", "sleep_fatigue", "fatigue_barrier"],
    minQuestionIds: 2, minDimensions: 2, primaryThreshold: 4, secondaryThreshold: 4,
    recommendationId: "fixed_wind_down"
  },
  low_movement: {
    id: "low_movement", title: "Өдрийн хөдөлгөөн бага байх нөхцөл",
    signals: ["sedentary_context", "low_movement"],
    minQuestionIds: 2, minDimensions: 2, primaryThreshold: 4, secondaryThreshold: 4,
    recommendationId: "one_movement_anchor"
  },
  restrictive_rebound: {
    id: "restrictive_rebound", title: "Хэт хатуу арга удаан үргэлжлэхгүй буцах хэв маяг",
    signals: ["restrictive_method_current", "restrictive_method_past", "short_lived_attempt", "weight_regain", "strict_rule_barrier"],
    minQuestionIds: 2, minDimensions: 2, primaryThreshold: 4, secondaryThreshold: 4,
    recommendationId: "remove_one_strict_rule"
  },
  plan_daily_life_mismatch: {
    id: "plan_daily_life_mismatch", title: "Төлөвлөгөө өдөр тутмын амьдралтай нийцэхгүй байх саад",
    signals: ["schedule_mismatch", "short_lived_attempt", "practical_barrier", "fatigue_barrier"],
    minQuestionIds: 2, minDimensions: 2, primaryThreshold: 4, secondaryThreshold: 4,
    recommendationId: "minimum_viable_plan"
  },
  previous_attempt_sustainability: {
    id: "previous_attempt_sustainability", title: "Өмнөх оролдлогын тогтвортой байдлын саад",
    signals: ["short_lived_attempt", "attempt_not_sustained", "weight_regain", "sustainability_barrier", "strict_rule_barrier", "schedule_mismatch"],
    minQuestionIds: 2, minDimensions: 2, primaryThreshold: 4, secondaryThreshold: 4,
    recommendationId: "review_failure_point"
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
  { id: "routine_sustainability", patterns: ["plan_daily_life_mismatch", "previous_attempt_sustainability"] }
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

  const supported = candidates.filter(candidate => candidate.eligible && candidate.score >= candidate.primaryThreshold);
  const influencingPatterns = supported.slice(0, 4);
  const contextualPatterns = supported.slice(4);
  const supportedIds = new Set(supported.map(candidate => candidate.id));
  const interactions = INTERACTION_RULES.filter(rule => rule.patterns.every(id => supportedIds.has(id)));
  return { influencingPatterns, contextualPatterns, supported, interactions, candidates };
}

module.exports = { REPORT_PATTERNS, PATTERN_PRIORITY, INTERACTION_RULES, evaluatePatterns };
