"use strict";

const REPORT_PATTERNS = Object.freeze({
  emotional_regulation: {
    id: "emotional_regulation", category: "psychological", title: "Сэтгэл хөдлөл ихсэх үед хоол руу татагдах хэв маяг",
    mandatoryAnchors: ["emotional_eating"], supportingSignals: ["emotional_barrier"], contradictions: ["emotional_eating"], contextualSignals: [],
    signals: ["emotional_eating", "emotional_barrier"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "pause_before_emotional_eating"
  },
  environmental_cues: {
    id: "environmental_cues", category: "behavioral", title: "Орчны дохио идэх хүсэлд нөлөөлөх хэв маяг",
    mandatoryAnchors: ["environmental_cue_reactivity"], supportingSignals: ["environmental_barrier", "environmental_portion_trigger"], contradictions: ["environmental_cue_reactivity"], contextualSignals: ["home_environment_exposure"],
    signals: ["environmental_cue_reactivity", "environmental_barrier", "environmental_portion_trigger", "home_environment_exposure"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "change_one_visible_cue"
  },
  irregular_meals_late_hunger: {
    id: "irregular_meals_late_hunger", category: "behavioral", title: "Хоолны зай уртсаж, өлсөлт оройтож мэдрэгдэх хэв маяг",
    mandatoryAnchors: ["meal_gap", "irregular_meal_rhythm"], supportingSignals: ["late_hunger_recognition", "hunger_satiety_barrier"], contradictions: ["regular_meal_rhythm"], contextualSignals: [],
    signals: ["meal_gap", "irregular_meal_rhythm", "late_hunger_recognition", "hunger_satiety_barrier", "regular_meal_rhythm"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "anchor_one_meal_time"
  },
  hunger_satiety: {
    id: "hunger_satiety", category: "behavioral", title: "Өлсөх, цадах мэдрэмжийг цагт нь анзаарахад хүндрэлтэй хэв маяг",
    mandatoryAnchors: ["hunger_recognition_difficulty", "satiety_difficulty"], supportingSignals: ["portion_difficulty", "hunger_satiety_barrier"], contradictions: ["hunger_recognition_difficulty", "satiety_difficulty"], contextualSignals: [],
    signals: ["hunger_recognition_difficulty", "satiety_difficulty", "portion_difficulty", "hunger_satiety_barrier"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "mid_meal_pause"
  },
  sleep_fatigue: {
    id: "sleep_fatigue", category: "contextual", title: "Нойр, ядаргаа өдөр тутмын сонголтыг хүндрүүлэх нөхцөл",
    mandatoryAnchors: ["short_sleep", "poor_sleep_quality", "sleep_fatigue"], supportingSignals: ["fatigue_barrier"], contradictions: ["short_sleep", "poor_sleep_quality"], contextualSignals: [],
    signals: ["short_sleep", "poor_sleep_quality", "sleep_fatigue", "fatigue_barrier"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "fixed_wind_down"
  },
  low_movement: {
    id: "low_movement", category: "contextual", title: "Өдрийн хөдөлгөөний суурь түвшин бага байх нөхцөл",
    mandatoryAnchors: ["very_low_movement", "low_movement"], supportingSignals: [], contradictions: ["high_movement"], contextualSignals: ["car_travel_context", "home_work_context"],
    signals: ["very_low_movement", "low_movement", "high_movement", "car_travel_context", "home_work_context"],
    minQuestionIds: 1, minDimensions: 1, threshold: 2,
    recommendationId: "one_movement_anchor"
  },
  restrictive_rebound: {
    id: "restrictive_rebound", category: "behavioral", title: "Хэт хатуу дүрмээс болж төлөвлөгөөг бүхэлд нь орхих хэв маяг",
    mandatoryAnchors: ["strict_rule_barrier", "strict_open_text_anchor"], supportingSignals: ["short_lived_attempt", "weight_regain"], contradictions: [], contextualSignals: ["restrictive_method_current", "restrictive_method_past"],
    signals: ["restrictive_method_current", "restrictive_method_past", "short_lived_attempt", "weight_regain", "strict_rule_barrier", "strict_open_text_anchor"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "remove_one_strict_rule"
  },
  plan_daily_life_mismatch: {
    id: "plan_daily_life_mismatch", category: "behavioral", title: "Төлөвлөгөө өдөр тутмын амьдралтай нийцэхгүй байх саад",
    mandatoryAnchors: ["schedule_barrier", "fatigue_barrier", "cost_barrier"], supportingSignals: ["short_lived_attempt", "access_barrier", "support_barrier"], contradictions: ["sustainability_barrier"], contextualSignals: [],
    signals: ["schedule_barrier", "short_lived_attempt", "cost_barrier", "access_barrier", "support_barrier", "fatigue_barrier", "sustainability_barrier"],
    minQuestionIds: 2, minDimensions: 2, threshold: 4,
    recommendationId: "minimum_viable_plan"
  },
  previous_attempt_sustainability: {
    id: "previous_attempt_sustainability", category: "behavioral", title: "Арга тасарсны дараа үр дүнгээ хадгалах хувилбаргүй үлдэх",
    mandatoryAnchors: ["maintenance_gap_explicit"], supportingSignals: ["medium_duration_attempt", "sustained_attempt", "initial_attempt_success", "weight_regain"], contradictions: ["weight_regain"], contextualSignals: ["schedule_barrier", "cost_barrier"],
    signals: ["medium_duration_attempt", "sustained_attempt", "initial_attempt_success", "weight_regain", "maintenance_gap_explicit", "schedule_barrier", "cost_barrier"],
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

function preciseOpenTextSignals(answerMap = {}) {
  const text = `${answerMap["Q-METHOD-STOP"] || ""} ${answerMap["OPEN-PAST"] || ""}`.toLowerCase();
  const restriction = /(олон\s+хориг|бүрэн\s+хориг|маш\s+хатуу|хэт\s+хатуу|мацаг.{0,30}хатуу\s+дүрэм)/i.test(text);
  const collapse = /(нэг\s+удаа.{0,40}зөрч.{0,60}(бүх|бүрэн).{0,30}орх|бүтэлгүйтэл\s+гэж\s+үз|бүх\s+төлөвлөгөөгөө\s+орх|хуучин.{0,30}бүрэн\s+буц)/i.test(text);
  const maintenanceGap = /(орлуулах\s+хувилбар.{0,35}(бэлэн\s+байгаагүй|байгаагүй)|өөр\s+хувилбар.{0,35}(байгаагүй|бэлэн\s+байгаагүй)|fallback|нөөц\s+төлөвлөгөө.{0,20}байгаагүй)/i.test(text);
  const rows = [];
  if (restriction && collapse) rows.push({ questionId: "OPEN-PAST", dimension: "attempt_context", signal: "strict_open_text_anchor", effect: 4 });
  if (maintenanceGap) rows.push({ questionId: "OPEN-PAST", dimension: "attempt_context", signal: "maintenance_gap_explicit", effect: 4 });
  return rows;
}

function evaluatePatterns(signalRows = [], evidence = {}) {
  const rowsWithDerived = [...signalRows, ...preciseOpenTextSignals(evidence.answerMap || {})];
  const candidates = Object.values(REPORT_PATTERNS).map(pattern => {
    const relevant = rowsWithDerived.filter(row => pattern.signals.includes(row.signal));
    const supporting = relevant.filter(row => row.effect > 0 && !row.guidanceOnly && (!row.contextOnly || pattern.category === "contextual"));
    const questionIds = new Set(supporting.map(row => row.questionId));
    const dimensions = new Set(supporting.map(row => row.dimension));
    const contradicting = relevant.filter(row => row.effect < 0);
    const anchors = supporting.filter(row => (pattern.mandatoryAnchors || []).includes(row.signal));
    const sharedContext = relevant.filter(row => (pattern.contextualSignals || []).includes(row.signal) && row.effect > 0);
    const score = supporting.reduce((sum, row) => sum + Number(row.effect || 0), 0) + sharedContext.reduce((sum, row) => sum + Number(row.effect || 0), 0);
    let specialEligible = true;
    if (pattern.id === "irregular_meals_late_hunger" && evidence.answerMap?.["Q-MEAL-RHYTHM"] === "3–4 цаг") specialEligible = false;
    if (pattern.id === "previous_attempt_sustainability") {
      const past = Array.isArray(evidence.answerMap?.["Q-METHOD-PAST"]) ? evidence.answerMap["Q-METHOD-PAST"] : [];
      const linked = past.length === 1 || Boolean(evidence.linkedLongestMethod || evidence.answerMap?.["Q-METHOD-LONGEST"]);
      const duration = ["6–12 сар", "1 жилээс урт"].includes(evidence.answerMap?.["Q-METHOD-DURATION"]);
      specialEligible = linked && duration && evidence.answerMap?.["Q-METHOD-RESULT"] === "Жин буурсан" && ["Хэсэгчлэн нэмэгдсэн", "Ихэнх нь эргэн нэмэгдсэн", "Өмнөхөөс илүү нэмэгдсэн"].includes(evidence.answerMap?.["Q-METHOD-REGAIN"]);
    }
    const eligible = anchors.length > 0 && specialEligible && questionIds.size >= pattern.minQuestionIds && dimensions.size >= pattern.minDimensions;
    return { ...pattern, score, eligible, supporting, contradicting, mandatoryAnchor: anchors.map(row => ({ signal: row.signal, questionId: row.questionId })),
      independentSupportingQuestionIds: [...new Set(supporting.filter(row => !anchors.includes(row)).map(row => row.questionId))],
      sharedContextualEvidence: sharedContext.map(row => ({ signal: row.signal, questionId: row.questionId })),
      contradictionEvidence: contradicting.map(row => ({ signal: row.signal, questionId: row.questionId })), questionIds: [...questionIds], dimensions: [...dimensions] };
  }).sort((left, right) => right.score - left.score || (PATTERN_PRIORITY[right.id] || 0) - (PATTERN_PRIORITY[left.id] || 0) || left.id.localeCompare(right.id));

  const supported = candidates.filter(candidate => candidate.eligible && candidate.score >= candidate.threshold);
  const nonContextual = supported.filter(candidate => candidate.category !== "contextual");
  const influencingPatterns = nonContextual.slice(0, 4);
  const contextualPatterns = [...supported.filter(candidate => candidate.category === "contextual"), ...nonContextual.slice(4)];
  const supportedIds = new Set(supported.map(candidate => candidate.id));
  const positiveSignals = new Set(rowsWithDerived.filter(row => row.effect > 0).map(row => row.signal));
  const interactions = INTERACTION_RULES.filter(rule => rule.patterns.every(id => supportedIds.has(id)) && (rule.requiredSignals || []).every(signal => positiveSignals.has(signal)));
  return { influencingPatterns, contextualPatterns, supported, interactions, candidates };
}

module.exports = { REPORT_PATTERNS, PATTERN_PRIORITY, INTERACTION_RULES, evaluatePatterns };
