"use strict";

const instrument = require("../../../pilot-v2/generated/instrument-v2.1.json");
const { registry, score: responseScore } = require("../../../pilot-v2/scale-registry.js");
const contextRegistry = require("../../../pilot-v2/context-registry.js");
const safetyRegistry = require("../../../pilot-v2/safety-registry.js");

const CONSTRUCTS = Object.freeze({
  emotional_eating: Object.freeze({ name: "Сэтгэл хөдлөлтэй холбоотой идэлт", measures: "Сэтгэл хөдлөлтэй холбоотой идэх хандлагын дэмжлэг.", orientation: "barrier" }),
  external_cue_reactivity: Object.freeze({ name: "Гадаад өдөөлтийн нөлөө", measures: "Харагдах, үнэртэх зэрэг гадаад дохионы нөлөө.", orientation: "barrier" }),
  uncontrolled_eating: Object.freeze({ name: "Хяналт алдагдсан мэт идэлт", measures: "Идэх явцыг зогсоох, хэмжээг барихад мэдрэгдсэн бэрхшээл.", orientation: "barrier" }),
  eating_self_efficacy: Object.freeze({ name: "Хооллолтын өөртөө итгэх итгэл", measures: "Нөхцөл бүрд хооллолтын сонголтоо удирдах итгэл.", orientation: "capability" }),
  hunger_satiety_awareness: Object.freeze({ name: "Өлсгөлөн, цадалтын мэдрэмж", measures: "Биеийн өлсгөлөн, цадалтын дохиог анзаарах чадвар.", orientation: "capability" }),
  habit_automaticity: Object.freeze({ name: "Дадлын автомат байдал", measures: "Хооллох үйлдэл бодолгүй, автоматаар өрнөх хандлага.", orientation: "barrier" }),
  body_image_avoidance: Object.freeze({ name: "Биеийн дүр төрхөөс зайлсхийх", measures: "Биеийн дүр төрхтэй холбоотой зайлсхийх хандлага.", orientation: "barrier" }),
  implementation_maintenance_friction: Object.freeze({ name: "Төлөвлөгөөг хэрэгжүүлэх саад", measures: "Санааг бодит үйлдэл болгон үргэлжлүүлэхэд мэдрэгдсэн саад.", orientation: "barrier" }),
  restrictive_rebound: Object.freeze({ name: "Хэт хязгаарлалтын буцалт", measures: "Хэт хязгаарласны дараах буцаж идэх хандлага.", orientation: "barrier" })
});
const ORDER = Object.freeze(Object.keys(CONSTRUCTS));
const SECTION_KEYS = Object.freeze([...ORDER, "research_quality", "context", "safety"]);
const DISCLAIMER = "Энэ оноо хүн амын нормтой харьцуулаагүй, баталгаажсан өндөр/дунд/бага ангилал биш pilot profile score.";
const VERSION_FIELDS = Object.freeze({
  instrumentVersion: instrument.instrumentVersion,
  itemBankHash: instrument.itemBankSha256,
  scoringVersion: instrument.scoringVersion,
  reportVersion: instrument.reportVersion
});

function roundScore(value) { return Math.round(value * 10) / 10; }
function nativeItemScore(item, numeric) {
  const orientation = CONSTRUCTS[item.construct]?.orientation;
  if (!orientation || !["higher_barrier", "higher_capability"].includes(item.scoringDirection)) throw new Error(`Invalid scoring contract: ${item.itemKey}`);
  const directionMatchesNative = (orientation === "barrier" && item.scoringDirection === "higher_barrier")
    || (orientation === "capability" && item.scoringDirection === "higher_capability");
  return directionMatchesNative ? numeric : 4 - numeric;
}
function scoreMeaning(construct) {
  return construct.orientation === "capability"
    ? `Илүү том nativeScore нь ${construct.name.toLowerCase()} илүү хүчтэй дэмжигдсэнийг заана.`
    : `Илүү том nativeScore нь ${construct.name.toLowerCase()} илүү хүчтэй дэмжигдсэнийг заана.`;
}
function scorePilot(answers = {}) {
  const buckets = Object.fromEntries(ORDER.map(key => [key, []]));
  for (const item of instrument.items) {
    if (item.pilotRole !== "scored_core_candidate") continue;
    const selected = answers[item.itemKey];
    if (selected === undefined || selected === null || String(selected) === "NA") continue;
    const numeric = responseScore(item.responseScaleId, selected);
    if (numeric !== null) buckets[item.construct].push(nativeItemScore(item, numeric));
  }
  const constructs = {};
  for (const key of ORDER) {
    const contract = CONSTRUCTS[key];
    const totalItems = instrument.items.filter(item => item.construct === key && item.pilotRole === "scored_core_candidate").length;
    const validItems = buckets[key].length;
    const requiredItems = key === "restrictive_rebound" ? totalItems : Math.max(4, Math.ceil(totalItems * 0.8));
    const scorable = validItems >= requiredItems;
    const rawMean = scorable ? buckets[key].reduce((sum, value) => sum + value, 0) / validItems : null;
    const nativeScore = rawMean === null ? null : roundScore(rawMean / 4 * 100);
    constructs[key] = {
      key, name: contract.name, constructOrientation: contract.orientation, validItems, totalItems, requiredItems,
      dataStatus: !scorable ? "insufficient_data" : validItems === totalItems ? "complete" : "partial_scorable",
      rawMean, nativeScore, barrierBurdenScore: nativeScore === null ? null : contract.orientation === "barrier" ? nativeScore : roundScore(100 - nativeScore),
      scoreMeaning: scoreMeaning(contract)
    };
  }
  return { constructs, validConstructCount: Object.values(constructs).filter(item => item.nativeScore !== null).length };
}
function evaluateResponseQuality(answers = {}) {
  const scoredCodes = instrument.items.filter(item => item.pilotRole === "scored_core_candidate")
    .map(item => answers[item.itemKey]).filter(code => code != null && String(code) !== "NA").map(String);
  const researchItem = instrument.items.find(item => item.pilotRole === "non_scored_research_quality");
  return { straightLinePattern: scoredCodes.length === 48 && new Set(scoredCodes).size === 1,
    researchItemRecorded: researchItem ? answers[researchItem.itemKey] != null : false, affectsProfileScores: false };
}
function deriveSafetyRoute(responses = {}) {
  for (const item of safetyRegistry.items) {
    const selected = item.options.find(option => option.code === responses[item.itemKey]);
    if (selected?.routesToSafety) return true;
  }
  return false;
}
function deriveContextFacts(responses = {}) {
  return contextRegistry.items.map(item => item.options.find(option => option.code === responses[item.itemKey])?.fact).filter(Boolean);
}
function invalidResponse(message) { throw Object.assign(new Error(message), { statusCode: 400, code: "invalid_pilot_response" }); }
function validateProfileResponses(responses) {
  if (!responses || typeof responses !== "object" || Array.isArray(responses)) invalidResponse("Profile responses must be an object");
  const itemByKey = new Map(instrument.items.map(item => [item.itemKey, item]));
  const output = {};
  for (const [itemKey, codeValue] of Object.entries(responses)) {
    const item = itemByKey.get(itemKey); if (!item) invalidResponse(`Unknown item: ${itemKey}`);
    const code = String(codeValue);
    if (!registry[item.responseScaleId]?.some(option => option.code === code)) invalidResponse(`Invalid response code: ${itemKey}`);
    output[itemKey] = code;
  }
  return output;
}
function validateRegistryResponses(responses, moduleRegistry) {
  if (!responses || typeof responses !== "object" || Array.isArray(responses)) invalidResponse("Module responses must be an object");
  const itemByKey = new Map(moduleRegistry.items.map(item => [item.itemKey, item]));
  const output = {};
  for (const [itemKey, codeValue] of Object.entries(responses)) {
    const item = itemByKey.get(itemKey); if (!item) invalidResponse(`Unknown module item: ${itemKey}`);
    const code = String(codeValue);
    if (!item.options.some(option => option.code === code)) invalidResponse(`Invalid module response: ${itemKey}`);
    output[itemKey] = code;
  }
  return output;
}
function assertVersionLock(assessment) {
  const mismatch = Object.entries(VERSION_FIELDS).find(([field, expected]) => assessment?.[field] !== expected);
  if (mismatch) throw Object.assign(new Error(`Pilot version mismatch: ${mismatch[0]}`), {
    statusCode: 409, code: "pilot_version_mismatch", field: mismatch[0]
  });
}
function describeConstruct(item, safetyRoute) {
  if (item.nativeScore === null) return "Энэ чиглэлд хангалттай хариулт бүрдээгүй.";
  if (safetyRoute) return "Аюулгүй байдлын чиглүүлэг шаардлагатай тул ердийн тайлбарыг зогсоов.";
  return `Таны aggregate nativeScore ${item.nativeScore}. ${item.scoreMeaning} Энэ нь зөвхөн таны pilot профайлын дүрслэл бөгөөд ангилал биш.`;
}
function barrierLabel(item) {
  if (item.key === "eating_self_efficacy") return "Хооллолтоо зохицуулах итгэл сул дэмжигдсэн";
  if (item.key === "hunger_satiety_awareness") return "Өлсгөлөн, цадалтын дохиог анзаарах чадвар сул дэмжигдсэн";
  return item.name;
}
function buildPilotReport({ answers = {}, contextResponses = {}, safetyResponses = {}, generatedAt = new Date().toISOString() } = {}) {
  const scored = scorePilot(answers);
  const valid = Object.values(scored.constructs).filter(item => item.nativeScore !== null);
  const safetyRoute = deriveSafetyRoute(safetyResponses);
  const barriers = [...valid].sort((a, b) => b.barrierBurdenScore - a.barrierBurdenScore).slice(0, 2)
    .map(item => ({ construct: item.key, constructOrientation: item.constructOrientation,
      label: barrierLabel(item), barrierBurdenScore: item.barrierBurdenScore }));
  const capabilities = valid.filter(item => item.constructOrientation === "capability")
    .sort((a, b) => b.nativeScore - a.nativeScore).slice(0, 2)
    .map(item => ({ construct: item.key, label: item.name, nativeScore: item.nativeScore,
      wording: "Таны өөрийн хариултын профайл дотор харьцангуй дэмжлэг болж болох чиглэл." }));
  const details = Object.values(scored.constructs).map(item => ({
    construct: item.key, name: item.name, constructOrientation: item.constructOrientation,
    measures: CONSTRUCTS[item.key].measures, nativeScore: item.nativeScore, barrierBurdenScore: item.barrierBurdenScore,
    scoreMeaning: item.scoreMeaning, validItems: item.validItems, totalItems: item.totalItems,
    dataStatus: item.dataStatus, interpretation: describeConstruct(item, safetyRoute),
    reflectionQuestion: "Энэ чиглэл өдөр тутмын ямар нөхцөлд хамгийн тод анзаарагддаг вэ?"
  }));
  const report = {
    title: "Туршилтын профайлын тойм",
    status: "AI-аар боловсруулж, AI симуляцаар урьдчилан шалгасан туршилтын өөрийгөө үнэлэх асуумж.",
    safetyRoute,
    sections: {
      howToRead: { title: "1. Туршилтын үр дүнг хэрхэн унших вэ?", body: DISCLAIMER },
      profile: { title: "2. Таны 9 хэмжээст профайл", constructs: Object.values(scored.constructs), disclaimer: DISCLAIMER },
      endorsed: { title: "3. Харьцангуй илүү дэмжигдсэн саадын чиглэл", label: "Таны pilot профайл дотор харьцангуй илүү дэмжигдсэн саадын чиглэл", items: safetyRoute ? [] : barriers },
      strengths: { title: "4. Танд дэмжлэг болж болох чадварын чиглэлүүд", preliminary: "Саад ба чадварын хэмжээсүүдийг тусад нь эрэмбэлэв. Cross-construct metric equivalence тогтоогдоогүй.", items: safetyRoute ? [] : capabilities },
      details: { title: "5. Хэмжээс тус бүрийн тайлбар", items: details },
      context: { title: "6. Нэмэлт нөхцөл", label: "Нэмэлт нөхцөл", facts: deriveContextFacts(contextResponses), scoringEffect: "Нэмэлт нөхцөл профайлын оноонд нөлөөлөөгүй." },
      startingDirection: { title: "7. Ажиглаж болох эхний чиглэл", body: safetyRoute ? "Аюулгүй байдлын чиглүүлгийг эхэлж дагана уу." : barriers[0] ? `${barriers[0].label} чиглэл ямар үед тодордгийг шүүмжлэлгүй ажиглан тэмдэглэж болно.` : "Хангалттай мэдээлэл бүрдвэл нэг чиглэлийг ажиглалтаас эхэлж болно." },
      safety: { title: "8. Аюулгүй байдал, мэргэжлийн тусламж", routed: safetyRoute, body: safetyRoute ? "Яаралтай аюулгүй байдлын дэмжлэг хэрэгтэй байж болзошгүй. Ойрын итгэлтэй хүн болон зохих мэргэжлийн тусламжтай шууд холбогдоно уу. Энэ нь онош биш." : "Энэ тайлан эмч, сэтгэлзүйч, хоолзүйчийн үнэлгээг орлохгүй." },
      limits: { title: "9. Энэ pilot үр дүнгийн хязгаар", body: "Хүнээр психометрийн баталгаажуулалт хийгдээгүй; хүн амын норм тогтоогдоогүй; клиникийн болон сэтгэлзүйн онош биш." },
      provenance: { title: "10. Хувилбар, provenance", ...VERSION_FIELDS, itemBankSha256: instrument.itemBankSha256,
        contextVersion: contextRegistry.version, safetyVersion: safetyRegistry.version, pilotStatusLabel: instrument.pilotStatusLabel, generatedAt }
    },
    interactions: { enabled: false, statement: "Хэмжээсүүдийн хоорондын холбоог энэ pilot хувилбарт тайлбарлахгүй." },
    responseQuality: evaluateResponseQuality(answers)
  };
  const serialized = JSON.stringify(report).toLowerCase();
  for (const term of ["percentile", "risk level", "clinical cut-off", "normal", "abnormal", "diagnostic"]) {
    if (serialized.includes(term)) throw new Error(`Forbidden report term: ${term}`);
  }
  return report;
}

module.exports = { instrument, registry, contextRegistry, safetyRegistry, CONSTRUCTS, ORDER, DISCLAIMER, VERSION_FIELDS,
  SECTION_KEYS,
  scorePilot, evaluateResponseQuality, deriveSafetyRoute, deriveContextFacts, validateProfileResponses,
  validateContextResponses: responses => validateRegistryResponses(responses, contextRegistry),
  validateSafetyResponses: responses => validateRegistryResponses(responses, safetyRegistry),
  assertVersionLock, buildPilotReport };
