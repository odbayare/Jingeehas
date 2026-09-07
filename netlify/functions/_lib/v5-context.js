"use strict";

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function v5ProfessionalGuidance(answerMap = {}) {
  const items = [];
  const monitoring = answerMap["Q-MEDICAL-MONITORING"];
  if (["Цусан дахь сахар", "Хоёуланг нь"].includes(monitoring)) {
    items.push("Цусан дахь сахараа тогтмол хянах шаардлагатай гэж танд хэлсэн бол жинтэй холбоотой томоохон өөрчлөлт эхлэхдээ эмчтэйгээ тохируулна уу.");
  }
  if (["Цусны даралт", "Хоёуланг нь"].includes(monitoring)) {
    items.push("Цусны даралтаа тогтмол хянах шаардлагатай гэж танд хэлсэн бол жинтэй холбоотой томоохон өөрчлөлт эхлэхдээ эмчтэйгээ тохируулна уу.");
  }

  const reproductive = Array.isArray(answerMap["REPRO-STATUS"]) ? answerMap["REPRO-STATUS"] : [];
  if (reproductive.some(value => ["Жирэмсэн", "Төрсний дараах 0–6 сар", "Төрсний дараах 6–24 сар", "Хөхүүл"].includes(value))) {
    items.push("Жирэмсэн, төрсний дараах эсвэл хөхүүл үед жинтэй холбоотой томоохон өөрчлөлтийг эмчтэйгээ тохируулна уу.");
  }
  return unique(items);
}

function v5AdditionalContextFactors(answerMap = {}) {
  const reproductive = Array.isArray(answerMap["REPRO-STATUS"]) ? answerMap["REPRO-STATUS"] : [];
  const items = [];
  if (reproductive.includes("Цэвэршилтийн шилжилтийн үе эсвэл цэвэршсэн")) {
    items.push(Object.freeze({
      id: "menopause_life_stage_context",
      title: "Амьдралын үеийн нөхцөл",
      summary: "Та цэвэршилтийн шилжилтийн үе эсвэл цэвэршсэн гэж хариулсан байна. Энэ мэдээллийг жингийн шалтгаан гэж үзэхгүй, харин төлөвлөгөөг тайлбарлах амьдралын үеийн нөхцөл болгон авч үзэв.",
      certainty: "direct_self_report_non_causal",
      counted: false
    }));
  }
  return items;
}

function appendGuidance(existing, additions = []) {
  const pieces = unique([String(existing || "").trim(), ...additions.map(value => String(value || "").trim())]);
  return pieces.length ? pieces.join(" ") : null;
}

module.exports = { v5ProfessionalGuidance, v5AdditionalContextFactors, appendGuidance };
