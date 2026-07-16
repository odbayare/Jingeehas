"use strict";

const DIMENSIONS = Object.freeze({
  "Q-AGE": "суурь мэдээлэл", "Q-HEIGHT": "суурь мэдээлэл", "Q-WEIGHT": "суурь мэдээлэл", "Q-TARGET": "суурь мэдээлэл",
  "Q-MEAL-RHYTHM": "хооллох хэмнэл", "Q-HUNGER": "өлсөх ба цадах дохио", "Q-SATIETY": "өлсөх ба цадах дохио",
  "Q-EMOTION": "сэтгэл хөдлөл", "Q-CUE": "орчны дохио", "Q-SLEEP-DURATION": "унтах хугацаа",
  "Q-SLEEP-QUALITY": "унтах чанар", "Q-MOVEMENT": "өдөр тутмын хөдөлгөөн", "Q-TRAVEL": "зорчих хэлбэр",
  "Q-PORTION": "идэх хэмжээ", "Q-FOOD-FEELING": "хоолны дараах мэдрэмж", "OPEN-PAST": "өмнөх оролдлого"
});

function dimensionFor(questionId) {
  if (DIMENSIONS[questionId]) return DIMENSIONS[questionId];
  if (questionId.startsWith("S1-")) return "аюулгүй байдлын дохио";
  if (questionId.startsWith("MC-")) return "мөчлөгийн нөхцөл";
  return "өдөр тутмын хэв маяг";
}

function answerText(value) {
  return Array.isArray(value) ? value.join(", ") : String(value ?? "").trim();
}

function buildEvidence(answerRows = [], summaryRows = []) {
  const direct = answerRows.filter(row => answerText(row.value)).map(row => ({
    questionId: row.questionId, dimension: dimensionFor(row.questionId), sourceType: "structured_answer",
    text: answerText(row.value), direct: true
  }));
  const summaries = summaryRows.filter(row => row.text).map(row => ({
    questionId: row.checkpointId, dimension: "баталгаажсан тайлбар", sourceType: "confirmed_summary",
    text: String(row.text), direct: false
  }));
  const seenQuestion = new Set();
  const seenDimensionSource = new Set();
  return [...direct, ...summaries].filter(item => {
    if (item.direct && seenQuestion.has(item.questionId)) return false;
    const dimensionSource = `${item.dimension}:${item.sourceType}`;
    if (seenDimensionSource.has(dimensionSource) && !item.direct) return false;
    if (item.direct) seenQuestion.add(item.questionId);
    seenDimensionSource.add(dimensionSource);
    return true;
  });
}

function evidenceQuality(evidence = []) {
  const direct = evidence.filter(item => item.direct && item.dimension !== "суурь мэдээлэл" && item.dimension !== "аюулгүй байдлын дохио");
  const questions = new Set(direct.map(item => item.questionId));
  const dimensions = new Set(direct.map(item => item.dimension));
  const mode = questions.size >= 8 && dimensions.size >= 3 ? "sufficient" : questions.size >= 4 && dimensions.size >= 2 ? "limited" : "insufficient";
  return { mode, questionCount: questions.size, dimensionCount: dimensions.size, dimensions: [...dimensions] };
}

function patternCandidates(evidence) {
  const byDimension = new Map();
  for (const item of evidence.filter(entry => entry.direct && entry.dimension !== "суурь мэдээлэл" && entry.dimension !== "аюулгүй байдлын дохио")) {
    const group = byDimension.get(item.dimension) || [];
    group.push(item);
    byDimension.set(item.dimension, group);
  }
  return [...byDimension.entries()].map(([dimension, items]) => ({ dimension, items, score: items.length }))
    .sort((left, right) => right.score - left.score || left.dimension.localeCompare(right.dimension, "mn"));
}

function singleVariableExperiment(primary) {
  const variable = primary?.dimension || "хооллох үеийн нэг нөхцөл";
  return {
    variable,
    action: `${variable}-тэй холбоотой нэг давтагддаг мөчид хийх сонголтоо урьдчилж нэгээр тогтооно.`,
    observe: "Тэр мөчид өлсөх мэдрэмж, сэтгэл санаа, сонголт хэрхэн өөрчлөгдсөнийг богино тэмдэглэнэ.",
    keepConstant: "Бусад хоол, хөдөлгөөн, унтах хэмнэлээ зориуд өөрчлөхгүй хэвээр үлдээнэ."
  };
}

function buildFullReport(evidence = [], now = new Date()) {
  const quality = evidenceQuality(evidence);
  const candidates = patternCandidates(evidence);
  const primary = quality.mode === "sufficient" ? candidates[0] || null : null;
  const secondary = quality.mode === "sufficient" && candidates[1]?.score >= 2 && candidates[1].dimension !== primary?.dimension ? candidates[1] : null;
  const experiment = quality.mode === "sufficient" && primary ? singleVariableExperiment(primary) : null;
  const coverage = `Тайлбарын үндэслэл: ${quality.questionCount} өөр асуултын хариулт${quality.dimensions.length ? ` · ${quality.dimensions.join(", ")}` : ""}`;
  const observation = quality.mode === "sufficient"
    ? `Таны хариултад ${primary.dimension}-тэй холбоотой ажиглалт хамгийн олон давтагдсан байна.`
    : quality.mode === "limited"
      ? "Одоогийн хариултаар болгоомжтой ажиглалт хийх боломжтой ч хувь хүний шалтгаан, магадлал эсвэл жинд үзүүлэх нөлөөг дүгнэхэд хүрэлцэхгүй байна."
      : "Хувь хүнд тохирсон хэв маяг тайлбарлахад мэдээлэл хүрэлцэхгүй байна.";
  return {
    productName: "Илүүдэл жингээс салах тест үнэлгээ", reportDate: now.toISOString(), mode: quality.mode,
    coverage, evidence: evidence.filter(item => item.direct), primaryPattern: primary?.dimension || null,
    secondaryPattern: secondary?.dimension || null, experiment,
    sections: [
      { title: "1. Таны хамгийн тод ажиглагдсан хэв маяг", body: observation },
      { title: "2. Энэ тайлбар ямар хариултад тулгуурласан бэ?", body: coverage },
      { title: "3. Таны хариултад хамгийн олон давтагдсан хэв маяг", body: primary ? primary.dimension : "Одоогоор нэрлэхэд мэдээлэл хүрэлцэхгүй." },
      { title: "4. Нэмэлт ажиглалт", body: secondary ? secondary.dimension : "Тусдаа хоёрдогч хэв маяг тогтоох хангалттай, давхцаагүй ажиглалт алга." },
      { title: "5. Эхэлж туршиж болох нэг алхам", body: experiment ? experiment.action : "Дараагийн хэдэн асуултад хариулж мэдээллээ гүйцээнэ үү." },
      { title: "6. Болгоомжлох зүйл", body: "Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах аргаар тайланг ашиглахгүй." },
      { title: "7. Хэрэгжүүлж үзэх нэг өөрчлөлт", body: experiment ? experiment.action : "Одоогоор хувь хүнд тохирсон өөрчлөлт санал болгохгүй." },
      { title: "8. Өөртөө хэлэх өгүүлбэр", body: "Нэг хариулт миний зан чанарыг тодорхойлохгүй. Би давтагдсан нөхцөлөө ажиглаж чадна." },
      { title: "9. Мэргэжлийн хүнтэй зөвлөлдөх шаардлагатай байж болох нөхцөл", body: "Шинж давтагдах, бие огцом муудах, эсвэл хооллолттой холбоотой аюулгүй байдлын дохио илэрвэл мэргэжлийн хүнтэй зөвлөлдөнө үү." },
      { title: "10. Одоо юунаас эхлэх вэ?", body: experiment ? `Юуг ажиглах вэ? ${experiment.observe} Юуг өөрчлөхгүй хэвээр үлдээх вэ? ${experiment.keepConstant}` : "Хариулаагүй асуултаа нөхөж, дараа нь тайлангаа дахин гаргана уу." },
      { title: "Хооллосны дараах мэдрэмж ба цадалт", body: "Идсэний дараа тавгүй мэдрэмж төрүүлсэн хоол болон идэх хэмжээгээ тохируулахад хэцүү санагддаг хоолыг тусад нь ажиглана." }
    ]
  };
}

module.exports = { DIMENSIONS, dimensionFor, buildEvidence, evidenceQuality, patternCandidates, singleVariableExperiment, buildFullReport };
