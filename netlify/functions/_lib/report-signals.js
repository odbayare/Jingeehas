"use strict";

const signal = (name, effect, extra = {}) => Object.freeze({ signal: name, effect, ...extra });
const neutral = Object.freeze({ neutral: true });
const excluded = Object.freeze({ excluded: true });
const routingOnly = Object.freeze({ routingOnly: true });
const protective = (name, effect = -2) => signal(name, effect, { protective: true });

function optionMap(options, resolver) {
  return Object.freeze(Object.fromEntries(options.map(option => [option, Object.freeze(resolver(option))])));
}

const METHOD_OPTIONS = ["Хоолны дэглэм", "Илчлэг тоолох", "Мацаг барих", "Нүүрс ус багасгах", "Дасгал хөдөлгөөн", "Алхалт", "Жин хасах эм", "Хоолны дуршил бууруулах бүтээгдэхүүн", "Нэмэлт бүтээгдэхүүн", "Мэргэжлийн хоолзүйчийн зөвлөгөө", "Сэтгэлзүйн зөвлөгөө", "Мэс заслын арга", "Онлайн хөтөлбөр эсвэл апп", "Өөр арга"];
const restrictiveMethod = option => ["Хоолны дэглэм", "Илчлэг тоолох", "Мацаг барих", "Нүүрс ус багасгах"].includes(option);

const ANSWER_SIGNAL_CONTRACT = Object.freeze({
  "Q-AGE": { dimension: "demographic", valueType: "number", classification: "routing_only" },
  "Q-SEX": { dimension: "demographic", options: optionMap(["Эмэгтэй", "Эрэгтэй", "Хариулахгүй байхыг хүсэж байна"], () => [routingOnly]) },
  "Q-HEIGHT": { dimension: "anthropometric", valueType: "number", classification: "routing_only" },
  "Q-WEIGHT": { dimension: "anthropometric", valueType: "number", classification: "routing_only" },
  "Q-TARGET": { dimension: "anthropometric", valueType: "number", classification: "neutral_context" },
  "Q-MEAL-RHYTHM": { dimension: "meal_rhythm", options: {
    "3–4 цаг": [protective("regular_meal_rhythm")], "4–5 цаг": [signal("meal_gap", 1)],
    "5 цагаас урт": [signal("meal_gap", 3)], "Тогтмол биш": [signal("irregular_meal_rhythm", 3)]
  } },
  "Q-HUNGER": { dimension: "interoception", options: {
    "Амар": [protective("hunger_recognition_difficulty", -3)], "Заримдаа анзаардаг": [signal("hunger_recognition_difficulty", 1)],
    "Хэт өлссөний дараа анзаардаг": [signal("late_hunger_recognition", 3), signal("hunger_recognition_difficulty", 2)], "Тодорхой биш": [neutral]
  } },
  "Q-SATIETY": { dimension: "interoception", options: {
    "Амар": [protective("satiety_difficulty", -3)], "Заримдаа хэцүү": [signal("satiety_difficulty", 1)],
    "Ихэнхдээ хэцүү": [signal("satiety_difficulty", 3)], "Хариулахгүй": [excluded]
  } },
  "Q-FOOD-FEELING": { dimension: "food_context", options: optionMap(["Тослог, шарсан хоол", "Гурилан хоол", "Сүү, сүүн бүтээгдэхүүн", "Чихэрлэг зүйл", "Тодорхой хоол анзаараагүй", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Тодорхой хоол анзаараагүй" ? [neutral] : [signal("food_discomfort_context", 1, { contextOnly: true })]) },
  "Q-PORTION": { dimension: "portion_context", options: optionMap(["Амттан", "Давслаг зууш", "Түргэн хоол", "Гурилан хоол", "Тодорхой хоол байхгүй", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Тодорхой хоол байхгүй" ? [protective("portion_difficulty", -2)] : [signal("portion_difficulty", 1), signal("environmental_portion_trigger", 1)]) },
  "Q-EMOTION": { dimension: "emotional_context", options: {
    "Өөрчлөгддөггүй": [protective("emotional_eating", -3)], "Бага зэрэг нэмэгддэг": [signal("emotional_eating", 1)],
    "Нэлээд нэмэгддэг": [signal("emotional_eating", 3)], "Тодорхой биш": [neutral], "Хариулахгүй": [excluded]
  } },
  "Q-CUE": { dimension: "environment", options: optionMap(["Хоол харагдах", "Хоолны үнэр үнэртэх", "Хоол захиалгын апп нээх", "Бусад хүн идэж байх", "Аль нь ч үгүй", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Аль нь ч үгүй" ? [protective("environmental_cue_reactivity", -3)] : [signal("environmental_cue_reactivity", 2)]) },
  "Q-SLEEP-DURATION": { dimension: "sleep", options: {
    "4 цагаас бага": [signal("short_sleep", 3)], "4–6 цаг": [signal("short_sleep", 2)],
    "6–8 цаг": [protective("short_sleep", -2)], "8 цагаас их": [neutral]
  } },
  "Q-SLEEP-QUALITY": { dimension: "sleep_quality", options: {
    "Сайн амардаг": [protective("poor_sleep_quality", -3)], "Заримдаа тасалддаг": [signal("poor_sleep_quality", 1)],
    "Олон сэрдэг": [signal("poor_sleep_quality", 3)], "Өглөө ядарсан хэвээр байдаг": [signal("sleep_fatigue", 3)]
  } },
  "Q-TRAVEL": { dimension: "movement_context", options: {
    "Алхдаг": [protective("sedentary_context", -2)], "Нийтийн тээврээр": [neutral], "Машинаар": [signal("car_travel_context", 2)],
    "Гэрээсээ ажилладаг": [signal("home_work_context", 1), signal("home_environment_exposure", 1)], "Өөр хэлбэрээр": [neutral]
  } },
  "Q-MOVEMENT": { dimension: "movement", options: {
    "Маш бага": [signal("low_movement", 3)], "Бага": [signal("low_movement", 2)], "Дунд": [signal("low_movement", -1)], "Их": [protective("low_movement", -3)]
  } },
  "Q-GLUCOSE": { dimension: "medical_context", options: {
    "Хэмжиж байгаагүй": [neutral], "Хэвийн": [protective("medical_followup_context", -1)],
    "Хэвийн хэмжээнээс бага эсвэл их гарч байсан": [signal("medical_followup_context", 2, { guidanceOnly: true })], "Хариулахгүй": [excluded]
  } },
  "Q-BLOOD-PRESSURE": { dimension: "medical_context", options: {
    "Хэмжиж байгаагүй": [neutral], "Хэвийн": [protective("medical_followup_context", -1)],
    "Хэвийн хэмжээнээс бага эсвэл их гарч байсан": [signal("medical_followup_context", 2, { guidanceOnly: true })], "Хариулахгүй": [excluded]
  } },
  "MC-GATE": { dimension: "medical_context", options: optionMap(["Тийм, хамаарна", "Үгүй, хамаарахгүй", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : [routingOnly]) },
  "MC-01": { dimension: "medical_context", options: optionMap(["Тогтмол", "Заримдаа зөрдөг", "Ихэнхдээ тогтмол биш", "Сүүлийн 3 сард ирээгүй", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Тогтмол" ? [neutral] : [signal("professional_guidance_context", 1, { guidanceOnly: true })]) },
  "ALC-GATE": { dimension: "substance_context", options: {
    "Үгүй": [neutral], "Хааяа": [neutral], "Тогтмол": [signal("alcohol_context", 1, { contextOnly: true })], "Хариулахгүй": [excluded]
  } },
  "ALC-01": { dimension: "substance_context", options: {
    "Өөрчлөгддөггүй": [signal("alcohol_food_change", -2)], "Идэх хэмжээ нэмэгддэг": [signal("alcohol_food_change", 2)],
    "Давслаг эсвэл тослог хоол илүү хүсдэг": [signal("alcohol_food_change", 2)], "Тодорхой биш": [neutral], "Хариулахгүй": [excluded]
  } },
  "TOB-GATE": { dimension: "substance_context", options: optionMap(["Үгүй", "Хааяа", "Тогтмол", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : [neutral]) },
  "TOB-01": { dimension: "substance_context", options: optionMap(["Өөрчлөгддөггүй", "Багасдаг", "Дараа нь нэмэгддэг", "Тодорхой биш", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Дараа нь нэмэгддэг" ? [signal("appetite_rebound_context", 1, { contextOnly: true })] : [neutral]) },
  "PREG-GATE": { dimension: "medical_context", options: optionMap(["Үгүй", "Жирэмсэн", "Төрсний дараах 0–6 сар", "Төрсний дараах 6–24 сар", "Хөхүүл", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Үгүй" ? [neutral] : [signal("professional_guidance_context", 2, { guidanceOnly: true })]) },
  "MENO-GATE": { dimension: "medical_context", options: optionMap(["Тийм, хамаарна", "Үгүй, хамаарахгүй", "Тодорхойгүй", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : [neutral]) },
  "S1-S03": { dimension: "safety", options: optionMap(["Үгүй", "Өмнө байсан", "Одоо хааяа", "Одоо давтагддаг", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Үгүй" ? [protective("compensatory_behavior", -3)] : [signal("compensatory_behavior", 3, { guidanceOnly: true })]) },
  "S1-S04": { dimension: "safety", options: optionMap(["Үгүй", "Өнгөрсөнд байсан", "Одоо хааяа бодогддог", "Одоо идэвхтэй бодогдож байна", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Үгүй" ? [protective("self_harm_context", -3)] : [signal("self_harm_context", 3, { guidanceOnly: true })]) },
  "S1-B01": { dimension: "safety", options: optionMap(["Будилах", "Ухаан балартах", "Бие огцом муудах", "Аль нь ч үгүй", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Аль нь ч үгүй" ? [protective("urgent_body_signal", -3)] : [signal("urgent_body_signal", 3, { guidanceOnly: true })]) },
  "Q-METHOD-CURRENT": { dimension: "current_method", options: Object.freeze({ ...optionMap(METHOD_OPTIONS, option => restrictiveMethod(option) ? [signal("restrictive_method_current", 1)] : [neutral]), "Одоогоор ямар нэг арга хэрэглээгүй": [neutral] }) },
  "Q-METHOD-PAST": { dimension: "previous_method", options: Object.freeze({ ...optionMap(METHOD_OPTIONS, option => restrictiveMethod(option) ? [signal("restrictive_method_past", 1)] : ["Дасгал хөдөлгөөн", "Алхалт"].includes(option) ? [signal("activity_based_method", 2)] : [neutral]), "Ямар нэг арга хэрэглэж үзээгүй": [neutral] }) },
  "Q-METHOD-DURATION": { dimension: "attempt_duration", options: {
    "2 долоо хоногоос бага": [signal("short_lived_attempt", 3)], "2–8 долоо хоног": [signal("short_lived_attempt", 2)],
    "2–6 сар": [signal("short_lived_attempt", 1)], "6–12 сар": [signal("medium_duration_attempt", 1, { protective: true })], "1 жилээс урт": [signal("sustained_attempt", 2, { protective: true })], "Тодорхой санахгүй": [neutral]
  } },
  "Q-METHOD-STOP": { dimension: "attempt_context", valueType: "text", classification: "neutral_context" },
  "Q-METHOD-RESULT": { dimension: "attempt_result", options: {
    "Жин буурсан": [signal("initial_attempt_success", 2, { protective: true })], "Жин тогтвортой байсан": [neutral],
    "Жин нэмэгдсэн": [signal("attempt_not_sustained", 2)], "Тодорхой өөрчлөлт ажиглагдаагүй": [signal("attempt_not_sustained", 1)], "Тодорхой санахгүй": [neutral]
  } },
  "Q-METHOD-REGAIN": { dimension: "attempt_result", options: {
    "Үгүй": [protective("weight_regain", -3)], "Хэсэгчлэн нэмэгдсэн": [signal("weight_regain", 2)],
    "Ихэнх нь эргэн нэмэгдсэн": [signal("weight_regain", 2)], "Өмнөхөөс илүү нэмэгдсэн": [signal("weight_regain", 3)], "Тодорхой санахгүй": [neutral]
  } },
  "Q-METHOD-SUPPORT": { dimension: "support_context", options: optionMap(["Эмч", "Хоолзүйч", "Сэтгэлзүйч", "Дасгал хөдөлгөөний мэргэжилтэн", "Бусад мэргэжилтэн", "Мэргэжлийн дэмжлэг аваагүй", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Мэргэжлийн дэмжлэг аваагүй" ? [neutral] : [protective("professional_support", -1)]) },
  "Q-METHOD-MEDICATION": { dimension: "medical_context", options: optionMap(["Үгүй", "Эмчийн хяналттай эм хэрэглэсэн", "Эмчийн хяналтгүй эм хэрэглэсэн", "Нэмэлт бүтээгдэхүүн хэрэглэсэн", "Тодорхойгүй", "Хариулахгүй"], option => option === "Хариулахгүй" ? [excluded] : option === "Эмчийн хяналтгүй эм хэрэглэсэн" ? [signal("professional_guidance_context", 2, { guidanceOnly: true })] : [neutral]) },
  "Q-METHOD-BARRIERS": { dimension: "sustainability_barrier", options: {
    "Цагийн хуваарь": [signal("schedule_barrier", 3)], "Өлсөх эсвэл цадах мэдрэмж": [signal("hunger_satiety_barrier", 2)],
    "Стресс ба сэтгэл хөдлөл": [signal("emotional_barrier", 3)], "Гэр бүл эсвэл орчны нөлөө": [signal("environmental_barrier", 3)],
    "Зардал": [signal("cost_barrier", 1)], "Ядаргаа эсвэл нойр": [signal("fatigue_barrier", 3)],
    "Өвдөлт эсвэл хөдөлгөөний хязгаарлалт": [signal("injury_or_pain_barrier", 2, { contextOnly: true, guidanceOnly: true })],
    "Үр дүн удаан харагдах": [signal("sustainability_barrier", 2)], "Хэт хатуу дүрэм": [signal("strict_rule_barrier", 3)],
    "Тодорхой саад байгаагүй": [protective("sustainability_barrier", -2)], "Хариулахгүй": [excluded]
  } },
  "OPEN-PAST": { dimension: "attempt_context", valueType: "text", classification: "neutral_context" }
});

function directivesFor(questionId, value) {
  const contract = ANSWER_SIGNAL_CONTRACT[questionId];
  if (!contract) return null;
  if (contract.valueType) {
    if (value == null || String(value).trim() === "") return [];
    return [{ [contract.classification === "routing_only" ? "routingOnly" : "neutral"]: true, contextValue: value }];
  }
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap(option => contract.options?.[option] || []);
}

function mappingCoverage(questions = []) {
  const unmappedQuestions = [];
  const unmappedOptions = [];
  for (const question of questions) {
    const contract = ANSWER_SIGNAL_CONTRACT[question.id];
    if (!contract) { unmappedQuestions.push(question.id); continue; }
    for (const option of question.options || []) {
      if (!Object.hasOwn(contract.options || {}, option) || !Array.isArray(contract.options[option]) || !contract.options[option].length) unmappedOptions.push(`${question.id}:${option}`);
    }
  }
  const mapped = questions.length - unmappedQuestions.length;
  return { percent: questions.length ? Math.round((mapped / questions.length) * 10000) / 100 : 100, unmappedQuestions, unmappedOptions };
}

module.exports = { ANSWER_SIGNAL_CONTRACT, directivesFor, mappingCoverage };
