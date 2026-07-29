"use strict";

const instrument = require("../../../pilot-v2/generated/instrument-v2.1.json");
const { registry, score: responseScore } = require("../../../pilot-v2/scale-registry.js");

const CONSTRUCTS = Object.freeze({
  emotional_eating: ["Сэтгэл хөдлөлтэй холбоотой идэлт", "Сэтгэл хөдлөлтэй холбоотой идэх хандлагын дэмжлэг."],
  external_cue_reactivity: ["Гадаад өдөөлтийн нөлөө", "Харагдах, үнэртэх зэрэг гадаад дохионы нөлөө."],
  uncontrolled_eating: ["Хяналт алдагдсан мэт идэлт", "Идэх явцыг зогсоох, хэмжээг барихад мэдрэгдсэн бэрхшээл."],
  eating_self_efficacy: ["Хооллолтын өөртөө итгэх итгэл", "Нөхцөл бүрд хооллолтын сонголтоо удирдах итгэл."],
  hunger_satiety_awareness: ["Өлсгөлөн, цадалтын мэдрэмж", "Биеийн өлсгөлөн, цадалтын дохиог анзаарах чадвар."],
  habit_automaticity: ["Дадлын автомат байдал", "Хооллох үйлдэл бодолгүй, автоматаар өрнөх хандлага."],
  body_image_avoidance: ["Биеийн дүр төрхөөс зайлсхийх", "Биеийн дүр төрхтэй холбоотой зайлсхийх хандлага."],
  implementation_maintenance_friction: ["Төлөвлөгөөг хэрэгжүүлэх саад", "Санааг бодит үйлдэл болгон үргэлжлүүлэхэд мэдрэгдсэн саад."],
  restrictive_rebound: ["Хэт хязгаарлалтын буцалт", "Хэт хязгаарласны дараах буцаж идэх хандлага."]
});
const ORDER = Object.freeze(Object.keys(CONSTRUCTS));
const FORBIDDEN_REPORT_TERMS = Object.freeze(["percentile", "risk level", "clinical cut-off", "normal", "abnormal", "diagnostic"]);
const DISCLAIMER = "Энэ оноо хүн амын нормтой харьцуулаагүй, баталгаажсан өндөр/дунд/бага ангилал биш pilot profile score.";

function scorePilot(answers = {}) {
  const buckets = Object.fromEntries(ORDER.map(key => [key, []]));
  for (const item of instrument.items) {
    if (item.pilotRole !== "scored_core_candidate") continue;
    const selected = answers[item.itemKey];
    if (selected === undefined || selected === null || String(selected) === "NA") continue;
    const numeric = responseScore(item.responseScaleId, selected);
    if (numeric === null) continue;
    if (!["higher_barrier", "higher_capability"].includes(item.scoringDirection)) throw new Error(`Missing direction: ${item.itemKey}`);
    buckets[item.construct].push(item.scoringDirection === "higher_capability" ? 4 - numeric : numeric);
  }
  const constructs = {};
  for (const key of ORDER) {
    const totalItems = instrument.items.filter(item => item.construct === key && item.pilotRole === "scored_core_candidate").length;
    const validItems = buckets[key].length;
    const required = key === "restrictive_rebound" ? totalItems : Math.max(4, Math.ceil(totalItems * 0.8));
    const scorable = validItems >= required;
    const rawMean = scorable ? buckets[key].reduce((sum, value) => sum + value, 0) / validItems : null;
    constructs[key] = {
      key, name: CONSTRUCTS[key][0], validItems, totalItems, requiredItems: required,
      dataStatus: !scorable ? "insufficient_data" : validItems === totalItems ? "complete" : "partial_scorable",
      rawMean, transformedScore: rawMean === null ? null : Math.round(rawMean / 4 * 1000) / 10
    };
  }
  return { constructs, validConstructCount: Object.values(constructs).filter(item => item.transformedScore !== null).length };
}
function evaluateResponseQuality(answers = {}) {
  const scoredCodes = instrument.items.filter(item => item.pilotRole === "scored_core_candidate")
    .map(item => answers[item.itemKey]).filter(code => code != null && String(code) !== "NA").map(String);
  const researchItem = instrument.items.find(item => item.pilotRole === "non_scored_research_quality");
  return {
    straightLinePattern: scoredCodes.length === 48 && new Set(scoredCodes).size === 1,
    researchItemRecorded: researchItem ? answers[researchItem.itemKey] != null : false,
    affectsProfileScores: false
  };
}

function boundedInterpretation(item) {
  if (item.transformedScore === null) return "Энэ чиглэлд хангалттай хариулт бүрдээгүй.";
  return `${item.name} чиглэл таны хариултад ${item.transformedScore >= 50 ? "илүү хүчтэй дэмжигдсэн" : "харьцангуй бага дэмжигдсэн"}. Энэ нь зөвхөн таны pilot профайл доторх дүрслэл.`;
}

function buildPilotReport({ answers = {}, context = {}, safety = null, generatedAt = new Date().toISOString() } = {}) {
  const scored = scorePilot(answers);
  const valid = Object.values(scored.constructs).filter(item => item.transformedScore !== null);
  const ranked = scored.validConstructCount >= 6 ? [...valid].sort((a, b) => b.transformedScore - a.transformedScore).slice(0, 2).map(item => ({
    construct: item.key, label: item.name, score: item.transformedScore
  })) : [];
  const strengths = [...valid].sort((a, b) => a.transformedScore - b.transformedScore).slice(0, 2).map(item => ({
    construct: item.key, label: item.name, wording: "Таны өөрийн хариултын профайл дотор харьцангуй дэмжлэг болж болох чиглэл."
  }));
  const safetyRoute = safety?.urgent === true || safety?.selfHarm === true || safety?.compensatoryBehavior === true;
  const detail = Object.values(scored.constructs).map(item => ({
    construct: item.key, name: item.name, measures: CONSTRUCTS[item.key][1],
    largerScoreMeaning: item.key === "eating_self_efficacy" || item.key === "hunger_satiety_awareness"
      ? "Илүү том оноо нь энэ pilot contract-д тухайн таатай чадварын дэмжлэг бага байсныг заана."
      : "Илүү том оноо нь энэ pilot contract-д тухайн саад илүү дэмжигдсэнийг заана.",
    aggregateScore: item.transformedScore, validItems: item.validItems, totalItems: item.totalItems,
    dataStatus: item.dataStatus, interpretation: safetyRoute ? "Аюулгүй байдлын чиглүүлэг шаардлагатай тул ердийн тайлбарыг зогсоов." : boundedInterpretation(item),
    reflectionQuestion: "Энэ чиглэл өдөр тутмын ямар нөхцөлд хамгийн тод анзаарагддаг вэ?"
  }));
  const report = {
    title: "Туршилтын профайлын тойм",
    status: "AI-аар боловсруулж, AI симуляцаар урьдчилан шалгасан туршилтын өөрийгөө үнэлэх асуумж.",
    sections: {
      howToRead: { title: "1. Туршилтын үр дүнг хэрхэн унших вэ?", body: DISCLAIMER },
      profile: { title: "2. Таны 9 хэмжээст профайл", constructs: Object.values(scored.constructs), disclaimer: DISCLAIMER },
      endorsed: { title: "3. Хамгийн хүчтэй дэмжигдсэн чиглэлүүд", label: "Таны өөрийн хариултын профайл дотор хамгийн хүчтэй дэмжигдсэн чиглэлүүд", items: safetyRoute ? [] : ranked },
      strengths: { title: "4. Танд дэмжлэг болж болох чиглэлүүд", preliminary: "Хэмжээсүүд ижил баталгаажсан метриктэй гэсэн үг биш; энэ бол урьдчилсан within-profile тайлбар.", items: safetyRoute ? [] : strengths },
      details: { title: "5. Хэмжээс тус бүрийн тайлбар", items: detail },
      context: { title: "6. Нэмэлт нөхцөл", label: "Нэмэлт нөхцөл", facts: { ...context }, scoringEffect: "Оноонд нөлөөлөөгүй." },
      startingDirection: { title: "7. Ажиглаж болох эхний чиглэл", body: safetyRoute ? "Ердийн профайл тайлбарыг үргэлжлүүлэхээс өмнө аюулгүй тусламжийн чиглүүлгийг дагана уу." : ranked[0] ? `${ranked[0].label} ямар үед тодордгийг шүүмжлэлгүй ажиглан тэмдэглэж болно.` : "Хангалттай мэдээлэл бүрдвэл нэг чиглэлийг ажиглалтаас эхэлж болно." },
      safety: { title: "8. Аюулгүй байдал, мэргэжлийн тусламж", routed: safetyRoute, body: safetyRoute ? "Яаралтай аюулгүй байдлын дэмжлэг хэрэгтэй байж болзошгүй. Ойрын итгэлтэй хүн болон зохих мэргэжлийн тусламжтай шууд холбогдоно уу. Энэ нь онош биш." : "Энэ тайлан эмч, сэтгэлзүйч, хоолзүйчийн үнэлгээг орлохгүй." },
      limits: { title: "9. Энэ pilot үр дүнгийн хязгаар", body: "Хүнээр психометрийн баталгаажуулалт хийгдээгүй; хүн амын норм тогтоогдоогүй; клиникийн болон сэтгэлзүйн онош биш." },
      provenance: { title: "10. Хувилбар, provenance", instrumentVersion: instrument.instrumentVersion, itemBankSha256: instrument.itemBankSha256, scoringVersion: instrument.scoringVersion, reportVersion: instrument.reportVersion, pilotStatusLabel: instrument.pilotStatusLabel, generatedAt }
    },
    interactions: { enabled: false, statement: "Хэмжээсүүдийн хоорондын холбоог энэ pilot хувилбарт тайлбарлахгүй." },
    safetyRoute,
    responseQuality: evaluateResponseQuality(answers)
  };
  const serialized = JSON.stringify(report).toLowerCase();
  for (const term of FORBIDDEN_REPORT_TERMS) if (serialized.includes(term)) throw new Error(`Forbidden report term: ${term}`);
  return report;
}

module.exports = { instrument, registry, CONSTRUCTS, ORDER, DISCLAIMER, scorePilot, evaluateResponseQuality, buildPilotReport };
