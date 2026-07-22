"use strict";
const questionBank = require("../../../questions.js");

const LABELS = Object.freeze({
  "Q-AGE": "Нас", "Q-SEX": "Хүйс", "Q-HEIGHT": "Өндөр", "Q-WEIGHT": "Одоогийн жин", "Q-TARGET": "Зорилтот жин",
  "Q-MEAL-RHYTHM": "Хооллох хэмнэл", "Q-HUNGER": "Өлсөх дохио", "Q-SATIETY": "Цадах дохио", "Q-FOOD-FEELING": "Хоолны дараах мэдрэмж",
  "Q-PORTION": "Хоолны хэмжээ", "Q-EMOTION": "Сэтгэл хөдлөл ба хооллолт", "Q-CUE": "Орчны дохио", "Q-SLEEP-DURATION": "Унтах хугацаа",
  "Q-SLEEP-QUALITY": "Нойрны чанар", "Q-TRAVEL": "Зорчих хэлбэр", "Q-MOVEMENT": "Өдрийн хөдөлгөөн", "Q-GLUCOSE": "Цусан дахь сахар",
  "Q-BLOOD-PRESSURE": "Цусны даралт", "MC-GATE": "Мөчлөгийн асуултын хамаарал", "MC-01": "Мөчлөгийн тогтмол байдал",
  "ALC-GATE": "Согтууруулах ундааны хэрэглээ", "ALC-01": "Ундаа ба хоолны сонголт", "TOB-GATE": "Никотины хэрэглээ", "TOB-01": "Никотин ба хоолны дуршил",
  "PREG-GATE": "Жирэмслэлт ба төрсний дараах үе", "MENO-GATE": "Цэвэршилтийн үе", "S1-S03": "Нөхөн төлөх зан үйл",
  "S1-S04": "Өөртөө хор хүргэх бодол", "S1-B01": "Биеийн яаралтай шинж", "Q-METHOD-CURRENT": "Одоо хэрэглэж буй арга",
  "Q-METHOD-PAST": "Өмнө туршсан арга", "Q-METHOD-LONGEST": "Хамгийн удаан үргэлжилсэн арга", "Q-METHOD-DURATION": "Оролдлогын хугацаа",
  "Q-METHOD-STOP": "Оролдлого зогссон шалтгаан", "Q-METHOD-RESULT": "Оролдлогын эхний үр дүн", "Q-METHOD-REGAIN": "Жин эргэн нэмэгдсэн эсэх",
  "Q-METHOD-SUPPORT": "Мэргэжлийн дэмжлэг", "Q-METHOD-MEDICATION": "Эм ба нэмэлт бүтээгдэхүүн", "Q-METHOD-BARRIERS": "Үргэлжлүүлэхэд саад болсон зүйл",
  "OPEN-PAST": "Өмнөх оролдлогын тайлбар"
});
const SECTION_KEYS = Object.freeze({ "Суурь мэдээлэл": "baseline", "Хооллох хэмнэл": "meal_rhythm", "Өлсөх ба цадах дохио": "hunger_satiety",
  "Хооллосны дараах мэдрэмж ба цадалт": "post_meal", "Сэтгэл хөдлөл": "emotion", "Орчны дохио": "environment", "Нойр": "sleep",
  "Өдөр тутмын хөдөлгөөн": "movement", "Биеийн шинж": "physical_signs", "Сарын тэмдгийн мөчлөг": "menstrual_cycle",
  "Согтууруулах ундааны хэрэглээ": "alcohol", "Тамхины хэрэглээ": "tobacco", "Жирэмслэлт ба төрсний дараах үе": "pregnancy_postpartum",
  "Цэвэршилтийн үе": "menopause", "Аюулгүй байдлын дохио": "safety", "Жин бууруулах аргын түүх": "method_history", "Өмнөх оролдлого": "past_attempt" });

function questionAnalytics(id, version = questionBank.QUESTIONNAIRE_VERSION) {
  const question = questionBank.questionById(id, version); if (!question) return null;
  let branchDepth = 0; let parent = question.parent;
  while (parent) { branchDepth += 1; parent = questionBank.questionById(parent, version)?.parent; }
  const analyticsLabel = LABELS[question.id] || question.id; const sectionKey = SECTION_KEYS[question.section] || "other";
  const canonicalText = String(question.text || "").trim().replace(/\s+/g, " ");
  return { questionId: question.id, analyticsLabel, sectionKey, sectionLabel: question.section, canonicalText,
    meaningIdentity: [question.id, sectionKey, question.section, analyticsLabel, canonicalText].join("\u001f"),
    questionOrder: questionBank.QUESTIONS.findIndex(item => item.id === question.id) + 1, branchDepth };
}
module.exports = { LABELS, SECTION_KEYS, questionAnalytics };
