"use strict";

const { ANSWER_SIGNAL_CONTRACT, directivesFor } = require("./report-signals.js");
const { PATTERN_PRIORITY, evaluatePatterns } = require("./report-patterns.js");
const { PATTERN_COPY, RECOMMENDATIONS, INTERACTION_COPY, PROTECTIVE_COPY, evidenceSentence } = require("./report-copy.js");

const REPORT_VERSION = "jingeehas-case-formulation-v2-owner-review";
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
    id: candidate.id, title: candidate.title, explanation: copy.explanation,
    evidenceSummary: evidenceSentence(candidate.supporting, candidate.title), effectOnWeightLoss: copy.effectOnWeightLoss,
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
    const text = PROTECTIVE_COPY[row.signal] || "Эсрэг утгатай хариулт байсан тул энэ чиглэлийн дүгнэлтийг болгоомжтой тайлбарлав.";
    return [{ signal: row.signal, text }];
  });
}

function contextualFactors(evidence, contextualPatterns) {
  const items = contextualPatterns.map(candidate => ({ id: candidate.id, title: candidate.title, explanation: PATTERN_COPY[candidate.id].uncertainty }));
  const contextSignals = new Set((evidence.contexts || []).map(row => row.signal));
  const positiveSignals = new Set((evidence.signals || []).filter(row => row.effect > 0).map(row => row.signal));
  if (contextSignals.has("food_discomfort_context")) items.push({ id: "food_discomfort_context", title: "Хоолны дараах биеийн мэдрэмж", explanation: "Зарим хүнсний дараах тавгүй мэдрэмжийг тусдаа ажиглаж болно. Энэ мэдээлэл дангаараа сэтгэлзүйн гол хэв маяг үүсгэхгүй." });
  if (contextSignals.has("alcohol_food_change")) items.push({ id: "alcohol_food_change", title: "Согтууруулах ундааны дараах хоолны сонголт", explanation: "Хэрэглэсэн үед идэх хэмжээ эсвэл сонголт өөрчлөгдсөн бол тэр нөхцөлийг тусад нь ажиглах хэрэгтэй." });
  if (positiveSignals.has("schedule_mismatch")) items.push({ id: "schedule_mismatch", title: "Цагийн хуваарийн бодит саад", explanation: "Цагийн хуваарь тогтвортой үргэлжлүүлэхэд саад болсон ч энэ хариулт дангаараа тусдаа хэв маяг тогтоохгүй." });
  if (positiveSignals.has("practical_barrier")) items.push({ id: "practical_barrier", title: "Хэрэгжүүлэх зардлын нөхцөл", explanation: "Зардал нь сайн төлөвлөгөөг ч өдөр тутам хэрэгжүүлэх боломжийг хязгаарлаж болно." });
  return items;
}

function previousAttemptAnalysis(evidence) {
  const attemptSignals = new Set(["restrictive_method_current", "restrictive_method_past", "short_lived_attempt", "initial_attempt_response", "attempt_not_sustained", "weight_regain", "sustainability_barrier", "strict_rule_barrier", "schedule_mismatch"]);
  const rows = (evidence.signals || []).filter(row => attemptSignals.has(row.signal));
  const attemptQuestionIds = new Set(rows.map(row => row.questionId));
  const stopContext = (evidence.neutral || []).find(row => row.questionId === "Q-METHOD-STOP" && String(row.contextValue || "").trim());
  if (attemptQuestionIds.size < 2 && !stopContext) return null;
  const signals = new Set(rows.map(row => row.signal));
  const details = [];
  if (signals.has("initial_attempt_response")) details.push("Эхний үед жин буурсан нь өмнөх оролдлогод ажилласан хэсэг байсныг харуулж байна.");
  if (rows.some(row => row.signal === "short_lived_attempt" && row.protective)) details.push("Нэг жилээс урт үргэлжлүүлж чадсан нь тогтвортой байлгах бодит чадвар байгааг харуулж байна.");
  if (signals.has("weight_regain")) details.push("Аргаа зогсоосны дараа жин хэсэгчлэн буцсан тул зогссон шалтгаан болон дахин эхлэх боломжийг хамт харах хэрэгтэй.");
  if (stopContext) details.push(`Таны тайлбарт “${String(stopContext.contextValue).trim().slice(0, 300)}” гэж тэмдэглэсэн.`);
  return {
    summary: details.join(" ") || "Өмнөх оролдлогын эхний үр дүнгээс гадна хэр удаан үргэлжилсэн, хаана зогссон, дараа нь юу болсон зэрэг нь хамтдаа чухал харагдаж байна.",
    interpretation: "Дахин яг ижил арга эхлүүлэхээс өмнө өмнөх оролдлого тасарсан нэг цэгийг өөрчлөх нь илүү тогтвортой эхлэл өгнө."
  };
}

function professionalGuidance(evidence) {
  const rows = (evidence.contexts || []).filter(row => row.guidanceOnly && row.effect > 0);
  const items = [];
  if (rows.some(row => row.questionId === "Q-BLOOD-PRESSURE")) items.push("Цусны даралт хэвийн хэмжээнээс бага эсвэл их гарч байсан тул хөдөлгөөн, хооллолтын том өөрчлөлтөөс өмнө эмчтэй зөвлөлдөх нь зөв.");
  if (rows.some(row => row.questionId === "Q-GLUCOSE")) items.push("Цусан дахь сахар хэвийн хэмжээнээс бага эсвэл их гарч байсан бол хоолны зайг огцом уртасгахгүй, эмчтэй зөвлөлдөнө үү.");
  if (rows.some(row => row.questionId === "Q-METHOD-BARRIERS")) items.push("Өвдөлт эсвэл хөдөлгөөний хязгаарлалт байгаа бол хөдөлгөөний шинэ төлөвлөгөөг мэргэжлийн хүнтэй тохируулна уу.");
  if (rows.some(row => row.questionId === "Q-METHOD-MEDICATION")) items.push("Эмчийн хяналтгүй эм хэрэглэсэн бол дахин хэрэглэхээсээ өмнө эмч эсвэл эм зүйчтэй зөвлөлдөнө үү.");
  if (rows.some(row => ["MC-01", "PREG-GATE"].includes(row.questionId))) items.push("Нөхөн үржихүйн эсвэл мөчлөгийн нөхцөлтэй холбоотой өөрчлөлт байгаа бол жин бууруулах том төлөвлөгөөг мэргэжлийн хүнтэй тохируулна уу.");
  return items.length ? items.join(" ") : null;
}

function buildFullReport(evidence = {}, now = new Date()) {
  const quality = evidenceQuality(evidence);
  const evaluated = quality.patternResult;
  const influencingPatterns = evaluated.influencingPatterns.map(patternObject);
  const patternById = new Map(influencingPatterns.map(pattern => [pattern.id, pattern]));
  const interactions = evaluated.interactions.filter(rule => rule.patterns.every(id => patternById.has(id))).map(rule => ({
    id: rule.id, patternIds: rule.patterns, explanation: INTERACTION_COPY[rule.id]
  }));
  for (const interaction of interactions) for (const id of interaction.patternIds) {
    const pattern = patternById.get(id);
    pattern.interactionsWith = [...new Set([...pattern.interactionsWith, ...interaction.patternIds.filter(other => other !== id)])];
  }
  const prioritized = evaluated.influencingPatterns.slice().sort((left, right) => (PATTERN_PRIORITY[right.id] || 0) - (PATTERN_PRIORITY[left.id] || 0) || right.score - left.score)[0] || null;
  const prioritizedRecommendation = prioritized ? RECOMMENDATIONS[prioritized.recommendationId] : null;
  const guidance = professionalGuidance(evidence);
  const additionalPatternActions = evaluated.influencingPatterns.filter(candidate => guidance || candidate.id !== prioritized?.id).map(candidate => ({
    patternId: candidate.id, patternTitle: candidate.title, recommendationId: candidate.recommendationId, ...RECOMMENDATIONS[candidate.recommendationId]
  }));
  const overallPicture = influencingPatterns.length
    ? influencingPatterns.length === 1
      ? "Нэг нөлөөлөгч хэв маяг таны хариултаар хангалттай дэмжигдсэн. Энэ нь жин хасалтад нөлөөлөх цорын ганц шалтгаан гэсэн үг биш."
      : `${influencingPatterns.length} тусдаа нөлөөлөгч хэв маяг таны хариултаар хангалттай дэмжигдсэн. Эдгээр нь нэг шалтгаан биш бөгөөд зарим үед хоорондоо давхцаж болно.`
    : quality.mode === "limited"
      ? "Зарим нөлөөлөгч нөхцөл харагдсан ч тусдаа хэв маяг гэж дүгнэхэд хоёр ба түүнээс олон бие даасан хариулт хүрэлцсэнгүй."
      : "Одоогийн хариултаар жин хасалтад нөлөөлөх тодорхой хэв маяг нэрлэхэд мэдээлэл хүрэлцэхгүй байна.";
  return {
    version: REPORT_VERSION, questionnaireVersion: QUESTIONNAIRE_VERSION,
    productName: "Илүүдэл жингээс салах тест үнэлгээ", reportDate: now.toISOString(), mode: quality.mode,
    overallPicture, influencingPatterns,
    contextualFactors: contextualFactors(evidence, evaluated.contextualPatterns),
    protectiveFactors: strengthItems(evidence), contradictions: contradictionItems(evidence, evaluated.candidates),
    previousAttemptAnalysis: previousAttemptAnalysis(evidence),
    interactionSummary: interactions,
    prioritizedStartingAction: guidance ? {
      patternId: null, recommendationId: "professional_check", action: "Цусны даралтын хэмжилтийн талаар эхлээд эмчтэй зөвлөлдөнө үү.",
      reason: "Аюулгүй байдлыг тодруулсны дараа өөрт эвтэйхэн хөдөлгөөний хэмжээг сонгох нь зөв.",
      priorityReason: "Аюулгүй байдлын нөхцөл бусад өөрчлөлтөөс түрүүлж тавигдана."
    } : prioritized ? {
      patternId: prioritized.id, recommendationId: prioritized.recommendationId, action: prioritizedRecommendation.action,
      reason: prioritizedRecommendation.reason, priorityReason: "Энэ алхам хэрэгжүүлэхэд харьцангуй энгийн, аюулгүй тул эхэнд тавив."
    } : null,
    additionalPatternActions,
    avoidForNow: influencingPatterns.length ? "Олон дүрэм, хоолны хатуу хориг, хөдөлгөөний том төлөвлөгөөг зэрэг эхлүүлэхгүй. Эхний 7–14 хоногт зөвхөн эрэмбэлсэн нэг алхмаа туршина." : null,
    professionalGuidance: guidance,
    internalEvidenceMap: {
      mappedQuestionCount: new Set([...(evidence.signals || []), ...(evidence.neutral || []), ...(evidence.excluded || []), ...(evidence.routingOnly || [])].map(row => row.questionId)).size,
      informativeQuestionCount: quality.questionCount, unmappedQuestions: evidence.unmappedQuestions || [],
      signals: (evidence.signals || []).map(row => ({ questionId: row.questionId, dimension: row.dimension, signal: row.signal, effect: row.effect, protective: row.protective === true })),
      patternEvidence: evaluated.candidates.map(candidate => ({ id: candidate.id, supported: evaluated.supported.some(item => item.id === candidate.id), score: candidate.score, questionIds: candidate.questionIds, dimensions: candidate.dimensions }))
    }
  };
}

function publicReport(fullReport) {
  if (!fullReport || typeof fullReport !== "object") return fullReport;
  const { internalEvidenceMap: _internalEvidenceMap, evidence: _legacyEvidence, ...safe } = fullReport;
  return safe;
}

module.exports = { REPORT_VERSION, QUESTIONNAIRE_VERSION, buildEvidence, evidenceQuality, buildFullReport, publicReport };
