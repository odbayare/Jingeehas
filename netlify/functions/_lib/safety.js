"use strict";

const { randomId } = require("./crypto.js");

const ROUTE_COPY = Object.freeze({
  urgent_self_harm: {
    title: "Яаралтай тусламж аваарай",
    body: "Та яг одоо өөртөө хор хүргэж болзошгүй гэж мэдэрч байвал ганцаараа бүү үлдээрэй. Итгэдэг хүнтэйгээ хамт байж, 103 дугаарт залгах эсвэл хамгийн ойрын яаралтай тусламжийн тасагт нэн даруй очоорой.",
    action: "Яаралтай тусламжтай холбогдох"
  },
  mental_health_support: {
    title: "Сэтгэцийн эрүүл мэндийн мэргэжлийн дэмжлэг аваарай",
    body: "Өөртөө хор хүргэх бодол сүүлийн үед төрсөн бол өнөөдөр итгэдэг хүнтэйгээ ярилцаж, сэтгэцийн эрүүл мэндийн мэргэжилтэнтэй холбогдоорой.",
    action: "Дэмжлэг авах"
  },
  urgent_medical_symptom: {
    title: "Биеийн яаралтай шинжийг эхэлж шалгуулаарай",
    body: "Ухаан санаа будилах, ухаан балартах эсвэл бие огцом муудах шинж илэрсэн бол 103 дугаарт залгах эсвэл хамгийн ойрын яаралтай тусламжийн тасагт нэн даруй очоорой.",
    action: "Яаралтай тусламжтай холбогдох"
  },
  eating_behavior_professional: {
    title: "Мэргэжлийн хүнтэй эхэлж зөвлөлдөөрэй",
    body: "Идсэн хоолоо нөхөх эсвэл жин нэмэхээс сэргийлэх зорилготой үйлдэл сүүлийн 28 хоногт гарсан тул жин хасах төлөвлөгөө эхлэхээс өмнө эмч эсвэл хооллолтын эмгэгийн чиглэлээр ажилладаг мэргэжилтэнтэй зөвлөлдөөрэй.",
    action: "Мэргэжлийн тусламж авах"
  },
  medical_professional: {
    title: "Эмчтэй эхэлж зөвлөлдөөрэй",
    body: "Таны өгсөн хариултаас жинтэй холбоотой томоохон өөрчлөлт эхлэхийн өмнө эмчтэй зөвлөлдөх шаардлагатай нөхцөл харагдлаа.",
    action: "Эмчтэй зөвлөлдөх"
  }
});

function provenance(category, questionId, value, severity, route) {
  return {
    mode: severity === "urgent" ? "urgent" : "professional",
    category,
    triggerQuestionIds: [questionId],
    triggerValues: Array.isArray(value) ? value : [value],
    severity,
    route
  };
}

function currentSelfHarmRoute(value, questionId = "S1-S04-NOW") {
  if (["Тийм", "Эргэлзэж байна", "Одоо идэвхтэй бодогдож байна"].includes(value)) {
    return provenance("self_harm", questionId, value, "urgent", "urgent_self_harm");
  }
  return null;
}

function recentSelfHarmRoute(value, questionId = "S1-S04") {
  if (["Хааяа", "Олон өдөр", "Бараг өдөр бүр", "Одоо хааяа бодогддог"].includes(value)) {
    return provenance("self_harm", questionId, value, "professional", "mental_health_support");
  }
  if (value === "Одоо идэвхтэй бодогдож байна") {
    return provenance("self_harm", questionId, value, "urgent", "urgent_self_harm");
  }
  return null;
}

function compensatoryRoute(value, questionId = "S1-S03") {
  if (["Сүүлийн 28 хоногт байсан", "Одоо хааяа", "Одоо давтагддаг"].includes(value)) {
    return provenance("compensatory_eating", questionId, value, "professional", "eating_behavior_professional");
  }
  return null;
}

function evaluateSafetyGate(input = {}) {
  const age = Number(input.age);
  if (!Number.isInteger(age) || age < 18 || age > 120) {
    return provenance("age", "AGE-01", input.age, "professional", "medical_professional");
  }
  const immediate = currentSelfHarmRoute(input.selfHarmNow || input.currentSelfHarmRisk, "SAFE-SH-NOW");
  if (immediate) return immediate;
  const recent = recentSelfHarmRoute(input.selfHarm, "SAFE-SH-01");
  if (recent) return recent;
  const medical = Array.isArray(input.acuteMedical) ? input.acuteMedical.filter(value => value !== "Аль нь ч үгүй") : [];
  if (medical.length) return provenance("acute_medical", "SAFE-MED-01", medical, "urgent", "urgent_medical_symptom");
  const compensatory = compensatoryRoute(input.compensatoryBehavior, "SAFE-EAT-01");
  if (compensatory) return compensatory;
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
  const immediate = currentSelfHarmRoute(answers["S1-S04-NOW"]);
  if (immediate) return immediate;
  const recent = recentSelfHarmRoute(answers["S1-S04"]);
  if (recent) return recent;

  const acute = (Array.isArray(answers["S1-B01"]) ? answers["S1-B01"] : [])
    .filter(value => /будилах|ухаан балар|ухаан алд|огцом мууд/.test(value.toLowerCase()));
  if (acute.length) return provenance("acute_medical", "S1-B01", acute, "urgent", "urgent_medical_symptom");

  const compensatory = compensatoryRoute(answers["S1-S03"]);
  if (compensatory) return compensatory;

  for (const [questionId, value] of Object.entries(answers)) {
    if (typeof value !== "string" || !questionId.startsWith("OPEN-")) continue;
    const category = possibleOpenTextSafety(value);
    if (!category) continue;
    const confirmation = answers[`SAFETY-CONFIRM-${questionId}`];
    if (!confirmation) {
      return {
        mode: "confirmation_required",
        category,
        triggerQuestionIds: [questionId],
        triggerValues: [value],
        severity: "unknown",
        route: "confirmation_required"
      };
    }
    const confirmedImmediate = currentSelfHarmRoute(confirmation, `SAFETY-CONFIRM-${questionId}`);
    if (confirmedImmediate) return confirmedImmediate;
    const confirmedRecent = recentSelfHarmRoute(confirmation, `SAFETY-CONFIRM-${questionId}`);
    if (confirmedRecent) return confirmedRecent;
    if (confirmation === "Одоо илэрч байна") {
      return provenance("acute_medical", `SAFETY-CONFIRM-${questionId}`, confirmation, "urgent", "urgent_medical_symptom");
    }
  }
  return { mode: "eligible", category: "eligible", triggerQuestionIds: [], triggerValues: [], severity: "none", route: "eligible" };
}

async function saveSafetyCheck(database, sessionId, input, now = new Date()) {
  const result = evaluateSafetyGate(input);
  const id = randomId("sc_");
  await database.insert("safety_checks", { id, sessionId, result, createdAt: now.toISOString() });
  return { safetyCheckId: id, ...result, guidance: result.route === "eligible" ? null : ROUTE_COPY[result.route] };
}

module.exports = {
  ROUTE_COPY,
  evaluateSafetyGate,
  possibleOpenTextSafety,
  calculateAssessmentSafety,
  saveSafetyCheck
};