"use strict";

const FUNCTION_FLAGS = Object.freeze({
  "Алхах эсвэл шатаар өгсөх": "functional_walking_constraint",
  "Хэсэг хугацаанд зогсох эсвэл алхах": "functional_standing_constraint",
  "Бөхийх, гутлаа өмсөх зэрэг хөдөлгөөн": "functional_bending_constraint",
  "Хувцаслах эсвэл хувийн арчилгаагаа хийх": "functional_self_care_constraint",
  "Гэрийн ажил эсвэл өдөр тутмын ажлаа хийх": "functional_daily_activity_constraint"
});

const FUNCTION_COPY = Object.freeze({
  functional_walking_constraint: "Алхах эсвэл шатаар өгсөх үйлдэл танд мэдэгдэхүйц хэцүү байсан гэж хариулсан байна.",
  functional_standing_constraint: "Хэсэг хугацаанд зогсох эсвэл алхах үйлдэл танд мэдэгдэхүйц хэцүү байсан гэж хариулсан байна.",
  functional_bending_constraint: "Бөхийх, гутлаа өмсөх зэрэг хөдөлгөөн танд мэдэгдэхүйц хэцүү байсан гэж хариулсан байна.",
  functional_self_care_constraint: "Хувцаслах эсвэл хувийн арчилгааны зарим үйлдэл танд мэдэгдэхүйц хэцүү байсан гэж хариулсан байна.",
  functional_daily_activity_constraint: "Гэрийн ажил эсвэл өдөр тутмын ажлын зарим үйлдэл танд мэдэгдэхүйц хэцүү байсан гэж хариулсан байна."
});

function finiteNumber(value) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function rounded(value, places = 2) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function deriveBodyFunctionalContext(answerMap = {}) {
  const heightCm = finiteNumber(answerMap["Q-HEIGHT"]);
  const weightKg = finiteNumber(answerMap["Q-WEIGHT"]);
  const targetWeightKg = finiteNumber(answerMap["Q-TARGET"]);
  const waistCm = finiteNumber(answerMap["Q-WAIST"]);
  const functionalAnswers = Array.isArray(answerMap["Q-FUNCTION"]) ? answerMap["Q-FUNCTION"] : [];
  const functionalFlags = functionalAnswers.flatMap(answer => FUNCTION_FLAGS[answer] ? [FUNCTION_FLAGS[answer]] : []);

  const bmi = heightCm && weightKg ? rounded(weightKg / ((heightCm / 100) ** 2), 2) : null;
  const waistToHeightRatio = heightCm && waistCm ? rounded(waistCm / heightCm, 3) : null;
  const targetGapKg = weightKg != null && targetWeightKg != null ? rounded(weightKg - targetWeightKg, 1) : null;
  const hasBody = [heightCm, weightKg, targetWeightKg, waistCm].some(value => value != null);
  const hasFunction = functionalAnswers.length > 0;
  const status = hasBody && hasFunction ? "assessed" : hasBody || hasFunction ? "partial" : "not_assessed";

  return Object.freeze({
    status,
    heightCm,
    weightKg,
    targetWeightKg,
    targetGapKg,
    waistCm,
    bmi,
    waistToHeightRatio,
    functionalFlags: Object.freeze(functionalFlags),
    certainty: "self_report_context",
    diagnostic: false,
    counted: false
  });
}

function bodyContextFactors(context) {
  if (!context || context.status === "not_assessed") return [];
  const items = [];
  if (context.heightCm != null && context.weightKg != null) {
    items.push(Object.freeze({
      id: "body_measurement_context",
      title: "Биеийн суурь хэмжилтийн мэдээлэл",
      summary: context.waistCm != null
        ? "Таны оруулсан өндөр, жин, бүсэлхийн тойргийг биеийн суурь нөхцөлийг тайлбарлах нэмэлт мэдээлэл болгон ашиглав. Эдгээр хэмжилт дангаараа онош тогтоохгүй."
        : "Таны оруулсан өндөр, жинг биеийн суурь нөхцөлийг тайлбарлах нэмэлт мэдээлэл болгон ашиглав. Эдгээр хэмжилт дангаараа онош тогтоохгүй.",
      bodyContext: true,
      certainty: "self_report_context",
      counted: false
    }));
  }
  for (const flag of context.functionalFlags || []) {
    items.push(Object.freeze({
      id: flag,
      title: "Өдөр тутмын хөдөлгөөний нөхцөл",
      summary: `${FUNCTION_COPY[flag]} Энэ тест тухайн хүндрэлийн шалтгааныг тогтоохгүй.`,
      bodyContext: true,
      certainty: "direct_self_report_non_causal",
      counted: false
    }));
  }
  return items;
}

function bodyRecommendationFeasibilityModifiers(context) {
  return (context?.functionalFlags || []).map(flag => Object.freeze({
    id: `BODY-MOD-${flag.replace(/^functional_/, "").replaceAll("_", "-").toUpperCase()}`,
    functionalFlag: flag,
    certainty: "direct_self_report_non_causal",
    changesCoreRecommendation: false,
    counted: false
  }));
}

module.exports = {
  FUNCTION_FLAGS,
  deriveBodyFunctionalContext,
  bodyContextFactors,
  bodyRecommendationFeasibilityModifiers
};
