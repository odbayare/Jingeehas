"use strict";

const { ANSWER_SIGNAL_CONTRACT, directivesFor } = require("./report-signals.js");
const { PATTERN_PRIORITY, evaluatePatterns } = require("./report-patterns.js");
const { PATTERN_COPY, RECOMMENDATIONS, INTERACTION_COPY, PROTECTIVE_COPY, evidenceSentence, protectiveSynthesis, protectiveInterpretation } = require("./report-copy.js");

const REPORT_VERSION = "jingeehas-case-formulation-v4-generic";
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

function positiveSignals(evidence) {
  return new Set((evidence.signals || []).filter(row => row.effect > 0).map(row => row.signal));
}

function factGates(evidence) {
  const signals = positiveSignals(evidence);
  const stopContext = (evidence.neutral || []).find(row => row.questionId === "Q-METHOD-STOP" && String(row.contextValue || "").trim());
  const stopText = String(stopContext?.contextValue || "");
  const openInjury = /гэмт|бэрт/i.test(stopText);
  const openPain = /өвдөлт|өвдө/i.test(stopText);
  const openMovementLimit = /хөдөлгөөний хязгаар/i.test(stopText);
  const structuredPhysicalConstraint = signals.has("injury_or_pain_barrier");
  const physicalConstraint = structuredPhysicalConstraint ? "өвдөлт эсвэл хөдөлгөөний хязгаарлалт" : openInjury ? "гэмтэл" : openPain ? "өвдөлт" : openMovementLimit ? "хөдөлгөөний хязгаарлалт" : null;
  const bloodPressure = (evidence.contexts || []).some(row => row.questionId === "Q-BLOOD-PRESSURE" && row.guidanceOnly && row.effect > 0);
  return Object.freeze({
    activityBasedMethod: signals.has("activity_based_method"),
    mediumDuration: signals.has("medium_duration_attempt"),
    sustainedAttempt: signals.has("sustained_attempt"),
    initialSuccess: signals.has("initial_attempt_success"),
    weightRegain: signals.has("weight_regain"),
    schedule: signals.has("schedule_barrier"),
    cost: signals.has("cost_barrier"),
    access: signals.has("access_barrier"),
    support: signals.has("support_barrier"),
    injury: Boolean(physicalConstraint),
    physicalConstraint,
    structuredInjury: structuredPhysicalConstraint,
    openInjuryCorroboration: openInjury || openPain || openMovementLimit,
    lowMovement: signals.has("low_movement"),
    bloodPressure
  });
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
    const copy = PROTECTIVE_COPY[row.signal];
    if (!copy || seen.has(copy)) return [];
    seen.add(copy);
    return [{ signal: row.signal, text: copy }];
  });
}

function contradictionItems(evidence, candidates) {
  const supportedSignals = new Set(candidates.flatMap(candidate => candidate.signals));
  const seen = new Set();
  return (evidence.contradictions || []).filter(row => !row.protective).flatMap(row => {
    if (!supportedSignals.has(row.signal) || seen.has(row.signal)) return [];
    seen.add(row.signal);
    const copy = PROTECTIVE_COPY[row.signal] || "Зарим хариулт энэ чиглэл тогтмол саад болдоггүйг харуулсан тул дүгнэлтийг болгоомжтой тайлбарлав.";
    return [{ signal: row.signal, text: copy }];
  });
}

function contextualFactors(evidence, contextualPatterns, supportedIds, facts) {
  const items = contextualPatterns.map(candidate => ({
    id: candidate.id, title: candidate.title, explanation: PATTERN_COPY[candidate.id].explanation,
    evidenceSummary: evidenceSentence(candidate.id, candidate.supporting), effectOnWeightLoss: PATTERN_COPY[candidate.id].effectOnWeightLoss
  }));
  const contextSignals = new Set((evidence.contexts || []).map(row => row.signal));
  if (contextSignals.has("food_discomfort_context")) items.push({ id: "food_discomfort_context", title: "Хоолны дараах биеийн мэдрэмж", explanation: "Зарим хүнсний дараах тавгүй мэдрэмжийг хоол, хэмжээ, тухайн үеийн нөхцөлтэй нь хамт ажиглах нь хэрэгтэй." });
  if (contextSignals.has("alcohol_food_change")) items.push({ id: "alcohol_food_change", title: "Согтууруулах ундааны дараах хоолны сонголт", explanation: "Хэрэглэсэн үед идэх хэмжээ эсвэл сонголт өөрчлөгдсөн бол тэр нөхцөлийг тусад нь ажиглах хэрэгтэй." });
  if (!supportedIds.has("previous_attempt_sustainability")) {
    if (facts.schedule) items.push({ id: "schedule_barrier", title: "Цагийн хуваарийн саад", explanation: "Цагийн хуваарь тогтвортой үргэлжлүүлэхэд бодит саад болсон байна." });
    if (facts.cost) items.push({ id: "cost_barrier", title: "Зардлын саад", explanation: "Зардал нь төлөвлөгөөг тогтмол хэрэгжүүлэх боломжийг хязгаарласан байна." });
  }
  if (facts.injury && !contextualPatterns.some(item => item.id === "injury_or_pain_barrier")) items.push({ id: "injury_or_pain_barrier", title: "Хөдөлгөөний биеийн нөхцөл", explanation: `Өмнөх хөдөлгөөн зогсоход ${facts.physicalConstraint} нөлөөлсөн байна.` });
  return items;
}

function previousAttemptAnalysis(evidence, facts) {
  const tracked = new Set(["activity_based_method", "medium_duration_attempt", "sustained_attempt", "initial_attempt_success", "short_lived_attempt", "attempt_not_sustained", "weight_regain", "sustainability_barrier", "strict_rule_barrier", "schedule_barrier", "cost_barrier"]);
  const rows = (evidence.signals || []).filter(row => tracked.has(row.signal));
  if (new Set(rows.map(row => row.questionId)).size < 2) return null;
  const sentences = [];
  if (facts.activityBasedMethod && facts.initialSuccess) sentences.push("Өмнөх хөдөлгөөнд суурилсан арга эхэндээ жин бууруулсан байна.");
  else if (facts.initialSuccess) sentences.push("Өмнөх арга эхэндээ жин бууруулсан байна.");
  if (facts.sustainedAttempt) sentences.push("Тэр аргыг нэг жилээс урт үргэлжлүүлсэн нь тодорхой хугацаанд тогтвортой хэрэгжүүлж чадсаныг харуулна.");
  else if (facts.mediumDuration) sentences.push("Тэр аргыг 6–12 сар үргэлжлүүлсэн нь тодорхой хугацаанд тогтвортой хэрэгжүүлж чадсаныг харуулна.");
  if (facts.injury) sentences.push(`Өмнөх хөдөлгөөн зогсоход ${facts.physicalConstraint} нөлөөлсөн байна.`);
  if (facts.weightRegain) sentences.push("Арга зогссоны дараа жин буцсан байна.");
  if (facts.schedule) sentences.push("Цагийн хуваарь дараагийн аргыг тогтвортой хэрэгжүүлэхэд саад болсон байна.");
  if (facts.cost) sentences.push("Зардал дараагийн аргыг тогтвортой хэрэгжүүлэхэд саад болсон байна.");
  if (!sentences.length) sentences.push("Өмнөх оролдлогын хугацаа, үр дүн болон зогссон нөхцөлийг хамтад нь харах шаардлагатай байна.");
  const interpretation = facts.initialSuccess && (facts.sustainedAttempt || facts.mediumDuration)
    ? `Энэ нь эхлэх эсвэл тууштай байх чадвар дутсаныг бус, арга тасрах үед үр дүнгээ хадгалах хувилбар шаардлагатайг харуулж байна.${facts.schedule || facts.cost || facts.injury ? " Дараагийн хувилбар нь зөвхөн үр дүнтэй байхаас гадна сонгосон бодит саадуудад нийцэх хэрэгтэй." : ""}`
    : facts.weightRegain
      ? "Дараагийн төлөвлөгөөнд арга тасрах үеийн доод хувилбар болон буцах дүрмийг урьдчилж оруулах нь тохиромжтой."
      : "Өмнөх аргыг яг давтахаас өмнө ажилласан хэсэг болон тасарсан нөхцөлийг салгаж харах нь тохиромжтой.";
  return { summary: sentences.join(" "), interpretation };
}

function professionalGuidance(evidence, facts) {
  const rows = (evidence.contexts || []).filter(row => row.guidanceOnly && row.effect > 0);
  const items = [];
  if (facts.bloodPressure) items.push("Хэрэв даралт сүүлийн үед давтан хэвийн бус гарч байгаа, эсвэл дагалдах шинж илэрдэг бол хөдөлгөөний ачааллаа нэмэхээс өмнө эмчтэй зөвлөнө үү.");
  if (rows.some(row => row.questionId === "Q-GLUCOSE")) items.push("Хэрэв цусан дахь сахар сүүлийн үед давтан хэвийн бус гарч байгаа, эсвэл дагалдах шинж илэрдэг бол хоолны зайг огцом уртасгалгүй эмчтэй зөвлөнө үү.");
  if (facts.injury) items.push(`${facts.physicalConstraint.charAt(0).toUpperCase()}${facts.physicalConstraint.slice(1)} үргэлжилж байгаа бол хөдөлгөөний шинэ хувилбарыг мэргэжлийн хүнтэй тохируулна уу.`);
  if (rows.some(row => row.questionId === "Q-METHOD-MEDICATION")) items.push("Эмчийн хяналтгүй эм хэрэглэсэн бол дахин хэрэглэхээсээ өмнө эмч эсвэл эм зүйчтэй зөвлөлдөнө үү.");
  if (rows.some(row => ["MC-01", "PREG-GATE"].includes(row.questionId))) items.push("Нөхөн үржихүйн эсвэл мөчлөгийн нөхцөлтэй холбоотой өөрчлөлт байгаа бол жин бууруулах том төлөвлөгөөг мэргэжлийн хүнтэй тохируулна уу.");
  return items.length ? items.join(" ") : null;
}

function recommendationFor(candidate, facts) {
  if (candidate.id !== "previous_attempt_sustainability") return { recommendationId: candidate.recommendationId, ...RECOMMENDATIONS[candidate.recommendationId] };
  const constraints = [];
  if (facts.schedule) constraints.push("цагийн хуваарьт багтах");
  if (facts.cost) constraints.push("нэмэлт зардал шаардахгүй");
  if (facts.access) constraints.push("хүртээмжтэй");
  if (facts.support) constraints.push("шаардлагатай дэмжлэгтэй");
  if (facts.injury) constraints.push("биеийн дурдсан нөхцөлийг сэдрээхгүй");
  const movementChoice = facts.activityBasedMethod || facts.lowMovement
    ? `${facts.injury ? "өөрт эвтэйхэн бага ачааллын" : "алхалт, сууж хийх хөдөлгөөн эсвэл өөрт эвтэйхэн бага ачааллын"} хувилбараас сонгоно`
    : "өдөр тутамд хэрэгжүүлж болох доод хувилбарыг сонгоно";
  return {
    recommendationId: "build_maintenance_bridge",
    action: `Өмнөх аргыг яг хуучнаар нь сэргээхээс илүү ${constraints.length ? `${constraints.join(", ")} ` : ""}${movementChoice}; мөн тасарсан өдрийн буцах дүрмийг урьдчилж тогтооно.`,
    reason: "Ингэснээр зөвхөн дахин эхлэх бус, нөхцөл өөрчлөгдөх үед үр дүнгээ хадгалах хэсгийг төлөвлөгөөнд оруулна."
  };
}

function startingAction(prioritized, facts) {
  if (!prioritized) return null;
  const recommendation = recommendationFor(prioritized, facts);
  if (prioritized.id !== "previous_attempt_sustainability" || !(facts.activityBasedMethod || facts.lowMovement)) return {
    patternId: prioritized.id, recommendationId: recommendation.recommendationId,
    action: `Эхний 7–14 хоногт дараах нэг алхмыг туршина: ${recommendation.action.charAt(0).toLowerCase()}${recommendation.action.slice(1)}`,
    reason: "Өөрчлөлтийг нэг зүйлээр эхлүүлснээр бодит амьдралд хэрэгжиж байгаа эсэхийг тодорхой ажиглаж, дараагийн алхмаа баримжаатай сонгоно.",
    priorityReason: "Энэ алхам одоо харагдсан гол саадтай шууд холбоотой бөгөөд ажиглаж болохоор жижиг байна."
  };
  const plan = {
    duration: "Эхний 7 хоногт туршина",
    option: facts.injury ? "Биеийн дурдсан нөхцөлд тохирох, зовиур сэдрээхгүй бага ачааллын хөдөлгөөнөөс сонгоно" : "Алхалт, сууж хийх хөдөлгөөн эсвэл өөрт эвтэйхэн өөр бага ачааллын хөдөлгөөнөөс сонгоно",
    anchor: "Өдөр бүр тогтвортой давтагддаг нэг үйл явдлын дараа",
    frequency: "Өөрийн бодит боломжтой өдрүүдийг эхлэхээсээ өмнө сонгоно",
    record: `Сонгосон хөдөлгөөн, хийсэн минут, хийхэд хэр эвтэйхэн байсныг тэмдэглэнэ${facts.injury ? ", мөн зовиур өөрчлөгдсөн эсэхийг тэмдэглэнэ" : ""}.`,
    success: "Сонгосон хувилбар өдөр тутмын амьдралд дахин давтаж болохоор байвал амжилт гэж үзнэ; эхний долоо хоногт жингээр дүгнэхгүй.",
    fallback: facts.schedule ? "Завгүй өдөр үндсэн хувилбарынхаа урьдчилж сонгосон богино хувилбарыг хийнэ." : "Үндсэн хувилбар тухайн өдөр багтахгүй бол урьдчилж сонгосон богино хувилбарыг хийнэ.",
    maintenanceRule: "Алгассан өдрийг дараагийн өдөр давхар нөхөхгүй; дараагийн сонгосон өдрөөс хэвийн үргэлжлүүлнэ."
  };
  if (facts.injury) plan.injuryBoundary = "Дурдсан зовиур нэмэгдэх, хавдах, доголох эсвэл хөдөлгөөн хязгаарлагдвал тухайн өдрийн хөдөлгөөнийг зогсоож, үргэлжилбэл мэргэжлийн хүнтэй зөвлөнө.";
  if (facts.cost) plan.costBoundary = "Нэмэлт төлбөр, тоног төхөөрөмж шаардахгүй хувилбарыг сонгоно.";
  return {
    patternId: prioritized.id, recommendationId: "maintenance_movement_bridge",
    action: "Эхний 7 хоногт өөрт тохирох нэг бага ачааллын хөдөлгөөний хувилбар болон тасарсан өдрийн буцах дүрмийг туршина.",
    reason: facts.activityBasedMethod ? "Энэ нь өмнөх хөдөлгөөнд суурилсан аргын хэрэгтэй хэсгийг яг хуучнаар давтахгүйгээр, одоогийн нөхцөлд давтаж болох хувилбараар шалгана." : "Энэ нь өдрийн хөдөлгөөний суурь түвшинд тохирох, одоогийн нөхцөлд давтаж болох хувилбарыг шалгана.",
    priorityReason: "Эхний алхам нь тайланд харагдсан хөдөлгөөний нөхцөл болон үр дүнгээ хадгалах шилжилтийн саадтай шууд холбоотой.",
    plan
  };
}

function overallPicture(influencingPatterns, contextualPatterns, protectiveText, previous, facts) {
  const psychological = influencingPatterns.filter(item => item.category === "psychological");
  const behavioral = influencingPatterns.filter(item => item.category === "behavioral");
  const paragraphs = [];
  if (psychological.length) paragraphs.push(`Сэтгэлзүйн талаас ${psychological.map(item => item.title).join(", ")} таны хариултад давтагдан харагдсан.`);
  else if (protectiveText) paragraphs.push(protectiveText);
  if (behavioral.length) paragraphs.push(`Өдөр тутмын зан үйл, өмнөх оролдлогын талаас ${behavioral.map(item => item.title.charAt(0).toLowerCase() + item.title.slice(1)).join(", ")} илүү тод харагдсан.`);
  if (contextualPatterns.length) paragraphs.push(`Нөлөөлөгч нөхцөлд ${contextualPatterns.map(item => item.title.charAt(0).toLowerCase() + item.title.slice(1)).join(", ")} багтаж байна.`);
  if (previous) {
    const previousFacts = [];
    if (facts.initialSuccess) previousFacts.push("эхэндээ үр дүн гарсан");
    if (facts.sustainedAttempt) previousFacts.push("нэг жилээс урт үргэлжилсэн");
    else if (facts.mediumDuration) previousFacts.push("6–12 сар үргэлжилсэн");
    if (facts.weightRegain) previousFacts.push("зогссоны дараа жин буцсан");
    if (previousFacts.length) paragraphs.push(`Өмнөх оролдлогоос ${previousFacts.join(", ")} баримтууд нь эхлэх чадвараас илүү үр дүнгээ хадгалах шилжилтийг анхаарах шаардлагатайг харуулж байна.`);
  }
  return paragraphs.length ? paragraphs.join("\n\n") : "Одоогийн хариултаар нэг чиглэлийг гол шалтгаан гэж түрүүлж нэрлэхээс илүү бодит амьдралд саад болдог нөхцөлөө нэг нэгээр нь ажиглах нь тохиромжтой.";
}

function buildFullReport(evidence = {}, now = new Date()) {
  const quality = evidenceQuality(evidence);
  const evaluated = quality.patternResult;
  const facts = factGates(evidence);
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
  const previous = previousAttemptAnalysis(evidence, facts);
  const protection = protectiveSynthesis(evidence.protective);
  const contextual = contextualFactors(evidence, evaluated.contextualPatterns, supportedIds, facts);
  const additionalPatternActions = evaluated.influencingPatterns.map(candidate => ({ patternId: candidate.id, patternTitle: candidate.title, ...recommendationFor(candidate, facts) }));
  return {
    version: REPORT_VERSION, questionnaireVersion: QUESTIONNAIRE_VERSION,
    productName: "Илүүдэл жингээс салах тест үнэлгээ", reportDate: now.toISOString(), mode: quality.mode,
    overallPicture: overallPicture(influencingPatterns, contextualPatternObjects, protection, previous, facts), influencingPatterns,
    contextualFactors: contextual,
    protectiveSynthesis: protection, protectiveInterpretation: protectiveInterpretation(evidence.protective), protectiveFactors: strengthItems(evidence), contradictions: contradictionItems(evidence, evaluated.candidates),
    previousAttemptAnalysis: previous, interactionSummary: interactions,
    prioritizedStartingAction: startingAction(prioritized, facts), additionalPatternActions,
    avoidForNow: influencingPatterns.length ? `Олон дүрэм, хоолны хатуу хориг, хөдөлгөөний том төлөвлөгөөг зэрэг эхлүүлэхгүй.${facts.injury ? " Биеийн дурдсан нөхцөлийг үл тоон ачааллаа нэмэхгүй." : ""} Эхний 7–14 хоногт зөвхөн эрэмбэлсэн нэг алхмаа туршина.` : null,
    professionalGuidance: professionalGuidance(evidence, facts),
    urgentGuidance: facts.bloodPressure ? "Ухаан балартах, цээжээр хүчтэй өвдөх, амьсгал огцом давчдах зэрэг яаралтай шинж илэрвэл энэ төлөвлөгөөг үргэлжлүүлэхгүй, яаралтай тусламж авна уу." : null,
    internalEvidenceMap: {
      mappedQuestionCount: new Set([...(evidence.signals || []), ...(evidence.neutral || []), ...(evidence.excluded || []), ...(evidence.routingOnly || [])].map(row => row.questionId)).size,
      informativeQuestionCount: quality.questionCount, unmappedQuestions: evidence.unmappedQuestions || [], factGates: facts,
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
