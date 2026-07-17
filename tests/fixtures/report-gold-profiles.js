"use strict";

const profile = (name, answers, expectedPatterns, options = {}) => Object.freeze({
  name, answers, expectedPatterns, absentPatterns: options.absentPatterns || [],
  expectedContextualFactors: options.expectedContextualFactors || [],
  expectedProtectiveSignal: options.expectedProtectiveSignal || null,
  expectedFirstStep: options.expectedFirstStep || null,
  prohibited: options.prohibited || []
});

module.exports = Object.freeze([
  profile("stress eating + poor sleep + evening hunger", {
    "Q-EMOTION": "Нэлээд нэмэгддэг", "Q-SLEEP-DURATION": "4–6 цаг", "Q-SLEEP-QUALITY": "Өглөө ядарсан хэвээр байдаг",
    "Q-MEAL-RHYTHM": "5 цагаас урт", "Q-HUNGER": "Хэт өлссөний дараа анзаардаг",
    "Q-METHOD-BARRIERS": ["Стресс ба сэтгэл хөдлөл", "Ядаргаа эсвэл нойр", "Өлсөх эсвэл цадах мэдрэмж"]
  }, ["emotional_regulation", "irregular_meals_late_hunger", "hunger_satiety"], { expectedContextualFactors: ["sleep_fatigue"], expectedFirstStep: "anchor_one_meal_time" }),
  profile("environmental cues + sedentary routine + irregular meals", {
    "Q-CUE": ["Хоол харагдах", "Хоол захиалгын апп нээх"], "Q-PORTION": ["Амттан"],
    "Q-TRAVEL": "Машинаар", "Q-MOVEMENT": "Маш бага", "Q-MEAL-RHYTHM": "Тогтмол биш",
    "Q-HUNGER": "Хэт өлссөний дараа анзаардаг", "Q-METHOD-BARRIERS": ["Гэр бүл эсвэл орчны нөлөө"]
  }, ["environmental_cues", "irregular_meals_late_hunger"], { expectedContextualFactors: ["low_movement"], expectedFirstStep: "anchor_one_meal_time" }),
  profile("restrictive dieting + regain + rigid restart", {
    "Q-METHOD-PAST": ["Хоолны дэглэм", "Мацаг барих"], "Q-METHOD-DURATION": "2–8 долоо хоног",
    "Q-METHOD-REGAIN": "Ихэнх нь эргэн нэмэгдсэн", "Q-METHOD-BARRIERS": ["Хэт хатуу дүрэм"]
  }, ["restrictive_rebound", "previous_attempt_sustainability"], { expectedFirstStep: "remove_one_strict_rule" }),
  profile("satiety difficulty + emotional eating + food availability", {
    "Q-SATIETY": "Ихэнхдээ хэцүү", "Q-HUNGER": "Заримдаа анзаардаг", "Q-PORTION": ["Амттан", "Давслаг зууш"],
    "Q-EMOTION": "Нэлээд нэмэгддэг", "Q-CUE": ["Хоол харагдах", "Хоолны үнэр үнэртэх"],
    "Q-METHOD-BARRIERS": ["Стресс ба сэтгэл хөдлөл", "Гэр бүл эсвэл орчны нөлөө"]
  }, ["hunger_satiety", "emotional_regulation", "environmental_cues"], { expectedFirstStep: "mid_meal_pause" }),
  profile("routine barriers with protective emotional answer", {
    "Q-EMOTION": "Өөрчлөгддөггүй", "Q-METHOD-DURATION": "2–8 долоо хоног",
    "Q-METHOD-BARRIERS": ["Цагийн хуваарь", "Ядаргаа эсвэл нойр"], "Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн амардаг"
  }, ["plan_daily_life_mismatch"], { expectedProtectiveSignal: "emotional_eating", expectedFirstStep: "minimum_viable_plan", absentPatterns: ["emotional_regulation", "sleep_fatigue"] }),
  profile("emotional eating dominant", {
    "Q-EMOTION": "Нэлээд нэмэгддэг", "Q-METHOD-BARRIERS": ["Стресс ба сэтгэл хөдлөл"], "Q-MEAL-RHYTHM": "3–4 цаг", "Q-SATIETY": "Амар"
  }, ["emotional_regulation"], { expectedFirstStep: "pause_before_emotional_eating", expectedProtectiveSignal: "regular_meal_rhythm" }),
  profile("environmental cue dominant", {
    "Q-CUE": ["Хоол харагдах", "Бусад хүн идэж байх"], "Q-PORTION": ["Түргэн хоол"], "Q-METHOD-BARRIERS": ["Гэр бүл эсвэл орчны нөлөө"]
  }, ["environmental_cues"], { expectedFirstStep: "change_one_visible_cue" }),
  profile("irregular meals and late hunger", {
    "Q-MEAL-RHYTHM": "Тогтмол биш", "Q-HUNGER": "Хэт өлссөний дараа анзаардаг", "Q-METHOD-BARRIERS": ["Өлсөх эсвэл цадах мэдрэмж"]
  }, ["irregular_meals_late_hunger", "hunger_satiety"], { expectedFirstStep: "anchor_one_meal_time" }),
  profile("sleep fatigue context", {
    "Q-SLEEP-DURATION": "4 цагаас бага", "Q-SLEEP-QUALITY": "Олон сэрдэг", "Q-METHOD-BARRIERS": ["Ядаргаа эсвэл нойр"]
  }, [], { expectedContextualFactors: ["sleep_fatigue"] }),
  profile("satiety and portion difficulty", {
    "Q-HUNGER": "Хэт өлссөний дараа анзаардаг", "Q-SATIETY": "Ихэнхдээ хэцүү", "Q-PORTION": ["Амттан"]
  }, ["hunger_satiety"], { expectedFirstStep: "mid_meal_pause" }),
  profile("restrictive attempt and regain", {
    "Q-METHOD-CURRENT": ["Мацаг барих"], "Q-METHOD-PAST": ["Нүүрс ус багасгах"], "Q-METHOD-REGAIN": "Өмнөхөөс илүү нэмэгдсэн"
  }, ["restrictive_rebound"], { expectedFirstStep: "remove_one_strict_rule" }),
  profile("plan incompatible with routine", {
    "Q-METHOD-DURATION": "2 долоо хоногоос бага", "Q-METHOD-BARRIERS": ["Цагийн хуваарь", "Зардал"]
  }, ["plan_daily_life_mismatch"], { expectedFirstStep: "minimum_viable_plan" }),
  profile("stable eating with low movement only", {
    "Q-MEAL-RHYTHM": "3–4 цаг", "Q-HUNGER": "Амар", "Q-SATIETY": "Амар", "Q-EMOTION": "Өөрчлөгддөггүй",
    "Q-CUE": ["Аль нь ч үгүй"], "Q-TRAVEL": "Машинаар", "Q-MOVEMENT": "Маш бага"
  }, [], { expectedContextualFactors: ["low_movement"], expectedProtectiveSignal: "emotional_eating" }),
  profile("owner maintenance transition profile", {
    "Q-MEAL-RHYTHM": "4–5 цаг", "Q-HUNGER": "Амар", "Q-SATIETY": "Амар", "Q-PORTION": ["Тодорхой хоол байхгүй"],
    "Q-EMOTION": "Өөрчлөгддөггүй", "Q-CUE": ["Аль нь ч үгүй"], "Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн амардаг",
    "Q-TRAVEL": "Машинаар", "Q-MOVEMENT": "Бага", "Q-BLOOD-PRESSURE": "Хэвийн хэмжээнээс бага эсвэл их гарч байсан",
    "Q-METHOD-PAST": ["Дасгал хөдөлгөөн"], "Q-METHOD-DURATION": "1 жилээс урт", "Q-METHOD-STOP": "Усанд сэлдэг байж байгаад гэмтлийн улмаас сэлэхээ зогсоосон. Буцааж эхлүүлж амжихгүй 6 жил болж байна",
    "Q-METHOD-RESULT": "Жин буурсан", "Q-METHOD-REGAIN": "Хэсэгчлэн нэмэгдсэн", "Q-METHOD-BARRIERS": ["Цагийн хуваарь", "Зардал"]
  }, ["previous_attempt_sustainability"], { expectedContextualFactors: ["low_movement"], expectedFirstStep: "maintenance_movement_bridge", expectedProtectiveSignal: "emotional_eating", absentPatterns: ["emotional_regulation", "hunger_satiety", "environmental_cues"] }),
  profile("mixed weak evidence", {
    "Q-EMOTION": "Бага зэрэг нэмэгддэг", "Q-SLEEP-QUALITY": "Заримдаа тасалддаг", "Q-MOVEMENT": "Бага", "Q-MEAL-RHYTHM": "4–5 цаг"
  }, [], { absentPatterns: ["emotional_regulation", "sleep_fatigue", "low_movement", "irregular_meals_late_hunger"] }),
  profile("mostly neutral and prefer not to answer", {
    "Q-EMOTION": "Хариулахгүй", "Q-SATIETY": "Хариулахгүй", "Q-CUE": ["Хариулахгүй"], "Q-HUNGER": "Тодорхой биш",
    "Q-FOOD-FEELING": ["Тодорхой хоол анзаараагүй"], "Q-PORTION": ["Тодорхой хоол байхгүй"]
  }, [], { absentPatterns: ["emotional_regulation", "environmental_cues", "hunger_satiety"] })
]);
