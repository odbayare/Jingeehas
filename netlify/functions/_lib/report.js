"use strict";

const { ANSWER_SIGNAL_CONTRACT, directivesFor } = require("./report-signals.js");
const { PATTERN_PRIORITY, evaluatePatterns } = require("./report-patterns.js");
const { PATTERN_COPY, RECOMMENDATIONS, INTERACTION_COPY, PROTECTIVE_COPY, evidenceSentence, protectiveSynthesis, protectiveInterpretation } = require("./report-copy.js");

const REPORT_VERSION = "jingeehas-case-formulation-v3-owner-review";
const QUESTIONNAIRE_VERSION = "jingeehas-production-2026-07";

function answerText(value) {
  return Array.isArray(value) ? value.join(", ") : String(value ?? "").trim();
}

function buildEvidence(answerRows = [], summaryRows = []) {
  const evidence = { signals: [], protective: [], contradictions: [], neutral: [], excluded: [], routingOnly: [], contexts: [], unmappedQuestions: [], summaries: [] };
  const seenQuestions = new Set();
  for (const row of answerRows) {
    if (!row?.questionId || seenQuestions.has(row.questionId)) continue;
    seenQuestions.add(row.questionId);
    const contract = ANSWER_SIGNAL_CONTRACT[row.questionId];
    const directives = directivesFor(row.questionId, row.value);
    if (!contract || directives == null) { evidence.unmappedQuestions.push(row.questionId); continue; }
    for (const directive of directives) {
      const base = { questionId: row.questionId, dimension: contract.dimension, answerCategory: Array.isArray(row.value) ? "multi" : contract.valueType || "single" };
      if (directive.signal) {
        const item = { ...base, ...directive };
        evidence.signals.push(item);
        if (directive.protective) evidence.protective.push(item);
        else if (directive.effect < 0) evidence.contradictions.push(item);
        if (directive.contextOnly || directive.guidanceOnly) evidence.contexts.push(item);
      } else if (directive.excluded) evidence.excluded.push(base);
      else if (directive.routingOnly) evidence.routingOnly.push(base);
      else evidence.neutral.push({ ...base, contextValue: directive.contextValue });
    }
  }
  evidence.summaries = summaryRows.filter(row => answerText(row.text)).map(row => ({
    checkpointId: row.checkpointId, text: answerText(row.text), sourceQuestionIds: Array.isArray(row.sourceQuestionIds) ? row.sourceQuestionIds : []
  }));
  return evidence;
}

function evidenceQuality(evidence = {}) {
  const informative = (evidence.signals || []).filter(item => !item.contextOnly && !item.guidanceOnly && item.effect !== 0);
  const questions = new Set(informative.map(item => item.questionId));
  const dimensions = new Set(informative.map(item => item.dimension));
  const patternResult = evaluatePatterns(evidence.signals || []);
  const mode = patternResult.supported.length ? "sufficient" : questions.size >= 3 && dimensions.size >= 2 ? "limited" : "insufficient";
  return { mode, questionCount: questions.size, dimensionCount: dimensions.size, dimensions: [...dimensions], patternResult };
}

function patternObject(candidate) {
  const copy = PATTERN_COPY[candidate.id];
  return {
    id: candidate.id, category: candidate.category, title: candidate.title, explanation: copy.explanation,
    evidenceSummary: evidenceSentence(candidate.id, candidate.supporting), effectOnWeightLoss: copy.effectOnWeightLoss,
    interactionsWith: [], uncertainty: copy.uncertainty, recommendationId: candidate.recommendationId
  };
}

function strengthItems(evidence) {
  const seen = new Set();
  return (evidence.protective || []).flatMap(row => {
    const text = PROTECTIVE_COPY[row.signal];
    if (!text || seen.has(text)) return [];
    seen.add(text); return [{ signal: row.signal, text }];
  });
}

function contradictionItems(evidence, candidates) {
  const supportedSignals = new Set(candidates.flatMap(candidate => candidate.signals));
  const seen = new Set();
  return (evidence.contradictions || []).filter(row => !row.protective).flatMap(row => {
    if (!supportedSignals.has(row.signal) || seen.has(row.signal)) return [];
    seen.add(row.signal);
    const text = PROTECTIVE_COPY[row.signal] || "Зарим хариулт энэ чиглэл тогтмол саад болдоггүйг харуулсан тул дүгнэлтийг болгоомжтой тайлбарлав.";
    return [{ signal: row.signal, text }];
  });
}

function contextualFactors(evidence, contextualPatterns, supportedIds) {
  const items = contextualPatterns.map(candidate => ({
    id: candidate.id, title: candidate.title, explanation: PATTERN_COPY[candidate.id].explanation,
    evidenceSummary: evidenceSentence(candidate.id, candidate.supporting), effectOnWeightLoss: PATTERN_COPY[candidate.id].effectOnWeightLoss
  }));
  const contextSignals = new Set((evidence.contexts || []).map(row => row.signal));
  const positiveSignals = new Set((evidence.signals || []).filter(row => row.effect > 0).map(row => row.signal));
  if (contextSignals.has("food_discomfort_context")) items.push({ id: "food_discomfort_context", title: "Хоолны дараах биеийн мэдрэмж", explanation: "Зарим хүнсний дараах тавгүй мэдрэмжийг хоол, хэмжээ, тухайн үеийн нөхцөлтэй нь хамт ажиглах нь хэрэгтэй." });
  if (contextSignals.has("alcohol_food_change")) items.push({ id: "alcohol_food_change", title: "Согтууруулах ундааны дараах хоолны сонголт", explanation: "Хэрэглэсэн үед идэх хэмжээ эсвэл сонголт өөрчлөгдсөн бол тэр нөхцөлийг тусад нь ажиглах хэрэгтэй." });
  if (!supportedIds.has("previous_attempt_sustainability") && (positiveSignals.has("schedule_mismatch") || positiveSignals.has("practical_barrier"))) {
    items.push({ id: "daily_life_constraints", title: "Өдөр тутмын хэрэгжүүлэх нөхцөл", explanation: "Цагийн хуваарь болон зардал нь сайн төлөвлөгөөг ч тогтмол хэрэгжүүлэх боломжийг хязгаарлаж болно." });
  }
  return items;
}

function previousAttemptAnalysis(evidence) {
  const tracked = new Set(["activity_based_method", "sustained_attempt", "initial_attempt_success", "short_lived_attempt", "attempt_not_sustained", "weight_regain", "sustainability_barrier", "strict_rule_barrier", "schedule_mismatch", "practical_barrier"]);
  const rows = (evidence.signals || []).filter(row => tracked.has(row.signal));
  const signals = new Set(rows.filter(row => row.effect > 0).map(row => row.signal));
  const stopContext = (evidence.neutral || []).find(row => row.questionId === "Q-METHOD-STOP" && String(row.contextValue || "").trim());
  if (new Set(rows.map(row => row.questionId)).size < 2 && !stopContext) return null;
  const injury = /гэмт|өвд|бэрт/i.test(String(stopContext?.contextValue || ""));
  if (signals.has("activity_based_method") && signals.has("sustained_attempt") && signals.has("initial_attempt_success") && signals.has("weight_regain")) {
    const hasConstraints = signals.has("schedule_mismatch") || signals.has("practical_barrier") || injury;
    return {
      summary: `Өмнөх хөдөлгөөнд суурилсан арга эхэндээ жин бууруулж, нэг жилээс урт үргэлжилжээ.${injury ? " Гэмтлийн улмаас зогссоны" : " Арга зогссоны"} дараа ${hasConstraints ? "цагийн хуваарь, зардал, биеийн нөхцөлтэй нийцэх" : "өдөр тутамд багтах"} орлуулах хувилбар бэлэн байгаагүй бөгөөд жин хэсэгчлэн буцсан байна.`,
      interpretation: "Энд гол саад нь эхлэх чадвар эсвэл тууштай байдал биш. Харин ажиллаж байсан нөхцөл тасрах үед үр дүнгээ хадгалах доод хувилбар, дахин орох дүрэм бэлэн байгаагүйд байж болох юм."
    };
  }
  return {
    summary: "Өмнөх оролдлогын эхний үр дүн, үргэлжилсэн хугацаа, зогссон шалтгаан, дараах өөрчлөлтийг хамтад нь харахад тухайн арга өдөр тутмын амьдралд хэр нийцэж байсныг дахин үнэлэх шаардлагатай байна.",
    interpretation: "Дахин яг ижил арга эхлүүлэхээс өмнө өмнөх оролдлого тасарсан нөхцөлд ажиллах доод хувилбарыг бэлдэх нь илүү тогтвортой эхлэл өгнө."
  };
}

function professionalGuidance(evidence) {
  const rows = (evidence.contexts || []).filter(row => row.guidanceOnly && row.effect > 0);
  const items = [];
  if (rows.some(row => row.questionId === "Q-BLOOD-PRESSURE")) items.push("Хэрэв даралт сүүлийн үед давтан хэвийн бус гарч байгаа, эсвэл дагалдах шинж илэрдэг бол хөдөлгөөний ачааллаа нэмэхээс өмнө эмчтэй зөвлөнө үү.");
  if (rows.some(row => row.questionId === "Q-GLUCOSE")) items.push("Хэрэв цусан дахь сахар сүүлийн үед давтан хэвийн бус гарч байгаа, эсвэл дагалдах шинж илэрдэг бол хоолны зайг огцом уртасгалгүй эмчтэй зөвлөнө үү.");
  if (rows.some(row => row.questionId === "Q-METHOD-BARRIERS")) items.push("Өвдөлт эсвэл хөдөлгөөний хязгаарлалт үргэлжилж байгаа бол хөдөлгөөний шинэ төлөвлөгөөг мэргэжлийн хүнтэй тохируулна уу.");
  if (rows.some(row => row.questionId === "Q-METHOD-MEDICATION")) items.push("Эмчийн хяналтгүй эм хэрэглэсэн бол дахин хэрэглэхээсээ өмнө эмч эсвэл эм зүйчтэй зөвлөлдөнө үү.");
  if (rows.some(row => ["MC-01", "PREG-GATE"].includes(row.questionId))) items.push("Нөхөн үржихүйн эсвэл мөчлөгийн нөхцөлтэй холбоотой өөрчлөлт байгаа бол жин бууруулах том төлөвлөгөөг мэргэжлийн хүнтэй тохируулна уу.");
  return items.length ? items.join(" ") : null;
}

function ownerLikeFormulation(evidence, supportedIds) {
  const positive = new Set((evidence.signals || []).filter(row => row.effect > 0).map(row => row.signal));
  const protective = new Set((evidence.protective || []).map(row => row.signal));
  const protectiveCluster = ["emotional_eating", "environmental_cue_reactivity", "hunger_recognition_difficulty", "satiety_difficulty", "short_sleep", "poor_sleep_quality", "portion_difficulty"].filter(signal => protective.has(signal)).length >= 5;
  return supportedIds.has("previous_attempt_sustainability") && supportedIds.has("low_movement") && positive.has("sustained_attempt") && positive.has("initial_attempt_success") && positive.has("weight_regain") && protectiveCluster;
}

function personalizedStartingAction(evidence, ownerLike, prioritized) {
  if (ownerLike) return {
    patternId: "previous_attempt_sustainability", recommendationId: "maintenance_movement_bridge",
    action: "Дараагийн 14 хоногт долоо хоногийн 5 өдөр, өдрийн хамгийн тогтмол үндсэн хоолны дараа ойр орчимдоо төлбөргүй 12 минут тайван алхана.",
    reason: "Энэ нь өмнөх хөдөлгөөнд суурилсан аргын хэрэгтэй хэсгийг цаг, зардал, биеийн нөхцөлд багтах доод хувилбараар сэргээж, үр дүнгээ хадгалах шилжилтийг туршина.",
    priorityReason: "Хоолны хатуу дүрэм нэмэхээс илүү одоо харагдсан бодит саад болох хөдөлгөөний суурь түвшин, тасарсны дараах буцах хувилбарт шууд чиглэнэ.",
    plan: {
      duration: "14 хоног",
      option: "Ойр орчимдоо тусгай хэрэгсэл, төлбөр шаардахгүй тайван алхалт",
      injuryBoundary: "Хуучин гэмтсэн хэсэг өвдөх, хавдах, доголох эсвэл өвдөлт нэмэгдэхэд тухайн өдрийн алхалтыг зогсоож, үргэлжилбэл мэргэжлийн хүнтэй зөвлөнө.",
      anchor: "Өдрийн хамгийн тогтмол үндсэн хоолны дараа",
      frequency: "Долоо хоногт 5 өдөр, нэг удаа 12 минут",
      record: "Өдөр, бүтэн эсвэл богино хувилбар, алхсан минут, өвдөлт байгаа эсэх, алхалтын өмнөх ба дараах тэнхээг тэмдэглэнэ.",
      success: "14 хоногийн 10 төлөвлөсөн өдрөөс дор хаяж 8-д бүтэн эсвэл богино хувилбараа хийж, өвдөлт нэмэгдээгүй бол амжилт гэж үзнэ; энэ хугацаанд жингээр дүгнэхгүй.",
      fallback: "Завгүй өдөр ижил зангууны дараа 5 минут тайван алхах богино хувилбарыг хийнэ.",
      maintenanceRule: "Алгассан өдрийг маргааш давхар нөхөхгүй; дараагийн төлөвлөсөн өдөр хэвийн хувилбараасаа үргэлжлүүлнэ."
    }
  };
  if (!prioritized) return null;
  const recommendation = RECOMMENDATIONS[prioritized.recommendationId];
  return {
    patternId: prioritized.id, recommendationId: prioritized.recommendationId,
    action: `Эхний 7–14 хоногт дараах нэг алхмыг туршина: ${recommendation.action.charAt(0).toLowerCase()}${recommendation.action.slice(1)}`,
    reason: "Өөрчлөлтийг нэг зүйлээр эхлүүлснээр бодит амьдралд хэрэгжиж байгаа эсэхийг тодорхой ажиглаж, дараагийн алхмаа баримжаатай сонгоно.",
    priorityReason: "Энэ алхам одоо харагдсан гол саадтай шууд холбоотой бөгөөд эхний 7–14 хоногт ажиглаж болохоор жижиг байна."
  };
}

function overallPicture(evidence, influencingPatterns, supportedIds, ownerLike) {
  if (ownerLike) return "Таны хариултаар стрессийн үед идэх, хоол харагдахад татагдах, цадсанаа мэдрэхэд хүндрэх эсвэл нойр муугаас хоолны сонголт алдагдах нь гол саад болж харагдсангүй. Харин өдрийн хөдөлгөөн бага байх, өмнөх арга цаг, зардал болон биеийн нөхцөлтэй урт хугацаанд нийцээгүй байх нь илүү бодит саад болжээ.\n\nӨмнөх оролдлого эхэндээ үр дүнтэй, нэг жилээс урт үргэлжилсэн нь та тогтвортой өөрчлөлт хийж чаддагийг харуулна. Гол асуудал нь эхлэх чадвар бус, арга тасарсан үед үр дүнгээ хадгалах өөр хувилбар байгаагүйд байж болох юм.";
  if (influencingPatterns.length) return `${influencingPatterns.map(item => item.title).join(", ")} таны хариултад давтагдан харагдсан. Эдгээрийг тус тусад нь биш, өдөр тутмын нөхцөл болон өмнөх оролдлогын туршлагатай хамт авч үзэх нь илүү хэрэгтэй.`;
  if (supportedIds.has("low_movement")) return "Хооллолтын нийтлэг сэтгэлзүйн саад хүчтэй харагдсангүй. Харин өдрийн хөдөлгөөний суурь түвшин бага байгаа нөхцөлд амьдралд багтах, тогтвортой хөдөлгөөний нэг хувилбарыг турших нь тохиромжтой.";
  return "Таны одоогийн хариултаар хооллолтын нийтлэг сэтгэлзүйн саадууд хүчтэй харагдсангүй. Одоо байгаа давуу талуудаа хадгалж, бодит амьдралд хамгийн их саад болдог нөхцөлөө нэг нэгээр нь ажиглах нь тохиромжтой.";
}

function buildFullReport(evidence = {}, now = new Date()) {
  const quality = evidenceQuality(evidence);
  const evaluated = quality.patternResult;
  const influencingPatterns = evaluated.influencingPatterns.map(patternObject);
  const contextualPatternObjects = evaluated.contextualPatterns.map(patternObject);
  const allPatternObjects = [...influencingPatterns, ...contextualPatternObjects];
  const patternById = new Map(allPatternObjects.map(pattern => [pattern.id, pattern]));
  const interactions = evaluated.interactions.filter(rule => rule.patterns.every(id => patternById.has(id))).map(rule => ({ id: rule.id, patternIds: rule.patterns, explanation: INTERACTION_COPY[rule.id] }));
  for (const interaction of interactions) for (const id of interaction.patternIds) {
    const pattern = patternById.get(id);
    pattern.interactionsWith = [...new Set([...pattern.interactionsWith, ...interaction.patternIds.filter(other => other !== id)])];
  }
  const prioritized = evaluated.influencingPatterns.slice().sort((left, right) => (PATTERN_PRIORITY[right.id] || 0) - (PATTERN_PRIORITY[left.id] || 0) || right.score - left.score)[0] || null;
  const supportedIds = new Set(evaluated.supported.map(item => item.id));
  const ownerLike = ownerLikeFormulation(evidence, supportedIds);
  const additionalPatternActions = evaluated.influencingPatterns.map(candidate => ({ patternId: candidate.id, patternTitle: candidate.title, recommendationId: candidate.recommendationId, ...RECOMMENDATIONS[candidate.recommendationId] }));
  return {
    version: REPORT_VERSION, questionnaireVersion: QUESTIONNAIRE_VERSION,
    productName: "Илүүдэл жингээс салах тест үнэлгээ", reportDate: now.toISOString(), mode: quality.mode,
    overallPicture: overallPicture(evidence, influencingPatterns, supportedIds, ownerLike), influencingPatterns,
    contextualFactors: contextualFactors(evidence, evaluated.contextualPatterns, supportedIds),
    protectiveSynthesis: protectiveSynthesis(evidence.protective), protectiveInterpretation: protectiveInterpretation(evidence.protective), protectiveFactors: strengthItems(evidence), contradictions: contradictionItems(evidence, evaluated.candidates),
    previousAttemptAnalysis: previousAttemptAnalysis(evidence), interactionSummary: interactions,
    prioritizedStartingAction: personalizedStartingAction(evidence, ownerLike, prioritized), additionalPatternActions,
    avoidForNow: ownerLike ? "Хоол, порц, нойрыг зэрэг засах шинэ дүрэм нэмэхгүй. Хуучин гэмтлээ үл тоон хөдөлгөөнийг огцом нэмэхгүй, завгүй эсвэл алгассан өдрийн дараа ачааллаа давхар нөхөхгүй." : influencingPatterns.length ? "Олон дүрэм, хоолны хатуу хориг, хөдөлгөөний том төлөвлөгөөг зэрэг эхлүүлэхгүй. Эхний 7–14 хоногт зөвхөн эрэмбэлсэн нэг алхмаа туршина." : null,
    professionalGuidance: professionalGuidance(evidence),
    urgentGuidance: (evidence.contexts || []).some(row => row.questionId === "Q-BLOOD-PRESSURE" && row.guidanceOnly && row.effect > 0) ? "Ухаан балартах, цээжээр хүчтэй өвдөх, амьсгал огцом давчдах зэрэг яаралтай шинж илэрвэл энэ төлөвлөгөөг үргэлжлүүлэхгүй, яаралтай тусламж авна уу." : null,
    internalEvidenceMap: {
      mappedQuestionCount: new Set([...(evidence.signals || []), ...(evidence.neutral || []), ...(evidence.excluded || []), ...(evidence.routingOnly || [])].map(row => row.questionId)).size,
      informativeQuestionCount: quality.questionCount, unmappedQuestions: evidence.unmappedQuestions || [],
      signals: (evidence.signals || []).map(row => ({ questionId: row.questionId, dimension: row.dimension, signal: row.signal, effect: row.effect, protective: row.protective === true, contextOnly: row.contextOnly === true, guidanceOnly: row.guidanceOnly === true })),
      patternEvidence: evaluated.candidates.map(candidate => ({ id: candidate.id, category: candidate.category, supported: supportedIds.has(candidate.id), score: candidate.score, threshold: candidate.threshold, questionIds: candidate.questionIds, dimensions: candidate.dimensions }))
    }
  };
}

function publicReport(fullReport) {
  if (!fullReport || typeof fullReport !== "object") return fullReport;
  const { internalEvidenceMap: _internalEvidenceMap, evidence: _legacyEvidence, ...safe } = fullReport;
  return safe;
}

module.exports = { REPORT_VERSION, QUESTIONNAIRE_VERSION, buildEvidence, evidenceQuality, buildFullReport, publicReport };
