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

async function saveSafetyCheck(database, sessionId, input, now = new Date()) {
  const result = evaluateSafetyGate(input);
  const id = randomId("sc_");
  await database.insert("safety_checks", { id, sessionId, result, createdAt: now.toISOString() });
  return { safetyCheckId: id, ...result, guidance: result.route === "eligible" ? null : ROUTE_COPY[result.route] };
}

module.exports = { ROUTE_COPY, evaluateSafetyGate, saveSafetyCheck };
