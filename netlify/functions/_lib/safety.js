"use strict";

const { randomId } = require("./crypto.js");

const ROUTE_COPY = Object.freeze({
  urgent_self_harm: {
    title: "Яаралтай тусламж аваарай",
    body: "Та яг одоо өөртөө хор хүргэх эрсдэлтэй бол ганцаараа үлдэхгүй, итгэдэг хүнтэйгээ хамт байж, 103 дугаар эсвэл хамгийн ойрын яаралтай тусламжийн тасагт нэн даруй хандана уу.",
    action: "Яаралтай тусламжтай холбогдох"
  },
  mental_health_support: {
    title: "Сэтгэцийн эрүүл мэндийн мэргэжлийн дэмжлэг аваарай",
    body: "Өөртөө хор хүргэх бодол хааяа төрж байгаа тул тестийн төлбөр хийхээс өмнө сэтгэцийн эрүүл мэндийн мэргэжилтэн эсвэл итгэдэг хүнтэйгээ өнөөдөр ярилцаарай.",
    action: "Дэмжлэг авах"
  },
  urgent_medical_symptom: {
    title: "Биеийн яаралтай шинжийг эхэлж шалгуулаарай",
    body: "Одоогийн будилах, ухаан балартах эсвэл бие огцом муудах шинж илэрсэн бол 103 дугаар эсвэл хамгийн ойрын яаралтай тусламжийн тасагт хандана уу.",
    action: "Яаралтай тусламжтай холбогдох"
  },
  eating_behavior_professional: {
    title: "Мэргэжлийн хүнтэй эхэлж зөвлөлдөөрэй",
    body: "Идсэнээ буцаахын тулд хийж буй үйлдэл одоо давтагдаж байгаа тул жин хасах төлөвлөгөө эхлэхээс өмнө эмч эсвэл хооллолтын эмгэгийн чиглэлээр ажилладаг мэргэжилтэнтэй зөвлөлдөнө үү.",
    action: "Мэргэжлийн тусламж авах"
  },
  medical_professional: {
    title: "Эмчтэй эхэлж зөвлөлдөөрэй",
    body: "Таны сонгосон нөхцөлд жин хасах тестээс өмнө эмчийн үнэлгээ илүү тохиромжтой.",
    action: "Эмчтэй зөвлөлдөх"
  }
});

function provenance(category, questionId, value, severity, route) {
  return { mode: severity === "urgent" ? "urgent" : "professional", category,
    triggerQuestionIds: [questionId], triggerValues: Array.isArray(value) ? value : [value], severity, route };
}

function evaluateSafetyGate(input = {}) {
  const age = Number(input.age);
  if (!Number.isInteger(age) || age < 18 || age > 120) return provenance("age", "AGE-01", input.age, "professional", "medical_professional");
  if (input.selfHarm === "Одоо идэвхтэй бодогдож байна") return provenance("self_harm", "SAFE-SH-01", input.selfHarm, "urgent", "urgent_self_harm");
  if (input.selfHarm === "Одоо хааяа бодогддог") return provenance("self_harm", "SAFE-SH-01", input.selfHarm, "professional", "mental_health_support");
  const medical = Array.isArray(input.acuteMedical) ? input.acuteMedical.filter(value => value !== "Аль нь ч үгүй") : [];
  if (medical.length) return provenance("acute_medical", "SAFE-MED-01", medical, "urgent", "urgent_medical_symptom");
  if (["Одоо хааяа", "Одоо давтагддаг"].includes(input.compensatoryBehavior)) {
    return provenance("compensatory_eating", "SAFE-EAT-01", input.compensatoryBehavior, "professional", "eating_behavior_professional");
  }
  if (input.medicalSuitability === "Эмчтэй эхэлж зөвлөлдөх шаардлагатай") {
    return provenance("medical", "SAFE-MED-02", input.medicalSuitability, "professional", "medical_professional");
  }
  return { mode: "eligible", category: "eligible", triggerQuestionIds: [], triggerValues: [], severity: "none", route: "eligible" };
}

function possibleOpenTextSafety(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return null;
  const negated = /төрөөгүй|байгаагүй|тохиолдоогүй|үгүй|биш|огт.*гүй/.test(text);
  const aboutOther = /найз|дүү|ах|эгч|танил|өөр хүн|хүний тухай/.test(text);
  const pastOnly = /өмнө нь|өнгөрсөнд|багадаа|олон жилийн өмнө/.test(text) && !/одоо|өнөөдөр|яг одоо/.test(text);
  if (negated || aboutOther || pastOnly) return null;
  if (/өөртөө хор|амиа хор|амьдрахыг хүсэхгүй/.test(text)) return "self_harm";
  if (/ухаан балар|будилах|ухаан алд|гэнэт мууд/.test(text)) return "acute_medical";
  return null;
}

function calculateAssessmentSafety(answers = {}) {
  const selfHarm = answers["S1-S04"];
  if (selfHarm === "Одоо идэвхтэй бодогдож байна") return provenance("self_harm", "S1-S04", selfHarm, "urgent", "urgent_self_harm");
  if (selfHarm === "Одоо хааяа бодогддог") return provenance("self_harm", "S1-S04", selfHarm, "professional", "mental_health_support");
  const acute = (Array.isArray(answers["S1-B01"]) ? answers["S1-B01"] : []).filter(value => /будилах|ухаан балар|ухаан алд|огцом мууд/.test(value.toLowerCase()));
  if (acute.length) return provenance("acute_medical", "S1-B01", acute, "urgent", "urgent_medical_symptom");
  const compensatory = answers["S1-S03"];
  if (["Одоо хааяа", "Одоо давтагддаг"].includes(compensatory)) return provenance("compensatory_eating", "S1-S03", compensatory, "professional", "eating_behavior_professional");
  for (const [questionId, value] of Object.entries(answers)) {
    if (typeof value !== "string" || !questionId.startsWith("OPEN-")) continue;
    const category = possibleOpenTextSafety(value);
    if (!category) continue;
    const confirmation = answers[`SAFETY-CONFIRM-${questionId}`];
    if (!confirmation) return { mode: "confirmation_required", category, triggerQuestionIds: [questionId], triggerValues: [value], severity: "unknown", route: "confirmation_required" };
    if (confirmation === "Одоо идэвхтэй бодогдож байна") return provenance("self_harm", `SAFETY-CONFIRM-${questionId}`, confirmation, "urgent", "urgent_self_harm");
    if (confirmation === "Одоо хааяа бодогддог") return provenance("self_harm", `SAFETY-CONFIRM-${questionId}`, confirmation, "professional", "mental_health_support");
    if (confirmation === "Одоо илэрч байна") return provenance("acute_medical", `SAFETY-CONFIRM-${questionId}`, confirmation, "urgent", "urgent_medical_symptom");
  }
  return { mode: "eligible", category: "eligible", triggerQuestionIds: [], triggerValues: [], severity: "none", route: "eligible" };
}

async function saveSafetyCheck(database, sessionId, input, now = new Date()) {
  const result = evaluateSafetyGate(input);
  const id = randomId("sc_");
  await database.insert("safety_checks", { id, sessionId, result, createdAt: now.toISOString() });
  return { safetyCheckId: id, ...result, guidance: result.route === "eligible" ? null : ROUTE_COPY[result.route] };
}

module.exports = { ROUTE_COPY, evaluateSafetyGate, possibleOpenTextSafety, calculateAssessmentSafety, saveSafetyCheck };
