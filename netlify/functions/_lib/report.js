"use strict";

const { ANSWER_SIGNAL_CONTRACT, directivesFor } = require("./report-signals.js");
const { PATTERN_PRIORITY, evaluatePatterns } = require("./report-patterns.js");
const { PATTERN_COPY, PATTERN_PUBLIC_TITLES, CONTEXT_PUBLIC_TITLES, SENTENCE_TEMPLATES, RECOMMENDATIONS, STRATEGY_COPY, INTERACTION_COPY, PROTECTIVE_COPY } = require("./report-copy.js");

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
    carTravel: signals.has("car_travel_context"),
    homeWork: signals.has("home_work_context"),
    bloodPressure
  });
}

function sentenceComposer(evidence, evaluated, facts) {
  const positiveRows = (evidence.signals || []).filter(row => row.effect > 0);
  const positiveSignals = new Set(positiveRows.map(row => row.signal));
  const protectiveRows = evidence.protective || [];
  const protectiveSignals = new Set(protectiveRows.map(row => row.signal));
  const patternRows = new Map((evaluated.candidates || []).map(candidate => [candidate.id, candidate.supporting || []]));
  const supportedPatterns = new Set((evaluated.supported || []).map(candidate => candidate.id));
  const stopContext = (evidence.neutral || []).find(row => row.questionId === "Q-METHOD-STOP" && String(row.contextValue || "").trim());
  const contextRows = Object.freeze({
    injury_or_pain_evidence: [
      ...positiveRows.filter(row => row.signal === "injury_or_pain_barrier"),
      ...(facts.openInjuryCorroboration && stopContext ? [{ questionId: stopContext.questionId }] : [])
    ],
    blood_pressure_followup: (evidence.contexts || []).filter(row => row.questionId === "Q-BLOOD-PRESSURE" && row.guidanceOnly && row.effect > 0),
    glucose_followup: (evidence.contexts || []).filter(row => row.questionId === "Q-GLUCOSE" && row.guidanceOnly && row.effect > 0),
    unsupervised_medication: (evidence.contexts || []).filter(row => row.questionId === "Q-METHOD-MEDICATION" && row.guidanceOnly && row.effect > 0),
    reproductive_followup: (evidence.contexts || []).filter(row => ["MC-01", "PREG-GATE"].includes(row.questionId) && row.guidanceOnly && row.effect > 0)
  });
  const sentenceEvidence = [];

  function matches(gate) {
    return (gate.requiredSignals || []).every(signal => positiveSignals.has(signal))
      && (gate.forbiddenSignals || []).every(signal => !positiveSignals.has(signal))
      && (gate.requiredProtectiveSignals || []).every(signal => protectiveSignals.has(signal))
      && (gate.requiredPatterns || []).every(pattern => supportedPatterns.has(pattern))
      && (gate.requiredContexts || []).every(context => (contextRows[context] || []).length)
      && (gate.forbiddenContexts || []).every(context => !(contextRows[context] || []).length);
  }

  function questionIdsFor(gate) {
    const signalNames = new Set([...(gate.requiredSignals || []), ...(gate.requiredProtectiveSignals || [])]);
    const rows = [
      ...positiveRows.filter(row => signalNames.has(row.signal)),
      ...protectiveRows.filter(row => signalNames.has(row.signal)),
      ...(gate.requiredPatterns || []).flatMap(pattern => patternRows.get(pattern) || []),
      ...(gate.requiredContexts || []).flatMap(context => contextRows[context] || [])
    ];
    return [...new Set(rows.map(row => row.questionId).filter(Boolean))];
  }

  function record(sentenceTemplateId, gate, text, section) {
    if (sentenceEvidence.some(item => item.sentenceTemplateId === sentenceTemplateId && item.section === section)) return text;
    sentenceEvidence.push({
      sentenceTemplateId,
      section,
      requiredSignals: gate.requiredSignals || [],
      forbiddenSignals: gate.forbiddenSignals || [],
      requiredProtectiveSignals: gate.requiredProtectiveSignals || [],
      requiredPatterns: gate.requiredPatterns || [],
      requiredContexts: gate.requiredContexts || [],
      actualSupportingQuestionIds: questionIdsFor(gate)
    });
    return text;
  }

  function render(sentenceTemplateId, section) {
    const template = SENTENCE_TEMPLATES[sentenceTemplateId];
    if (!template || !matches(template)) return null;
    return record(sentenceTemplateId, template, template.text, section);
  }

  function recordRule(sentenceTemplateId, gate, text, section) {
    if (!matches(gate)) return null;
    return record(sentenceTemplateId, gate, text, section);
  }

  return { render, recordRule, sentenceEvidence };
}

function evidenceQuality(evidence = {}) {
  const informative = (evidence.signals || []).filter(item => !item.contextOnly && !item.guidanceOnly && item.effect !== 0);
  const questions = new Set(informative.map(item => item.questionId));
  const dimensions = new Set(informative.map(item => item.dimension));
  const patternResult = evaluatePatterns(evidence.signals || []);
  const mode = patternResult.supported.length ? "sufficient" : questions.size >= 3 && dimensions.size >= 2 ? "limited" : "insufficient";
  return { mode, questionCount: questions.size, dimensionCount: dimensions.size, dimensions: [...dimensions], patternResult };
}

const PATTERN_EVIDENCE_TEMPLATES = Object.freeze({
  emotional_regulation: "evidence_emotional",
  environmental_cues: "evidence_environmental",
  irregular_meals_late_hunger: "evidence_meal_rhythm",
  hunger_satiety: "evidence_hunger_satiety",
  sleep_fatigue: "evidence_sleep",
  restrictive_rebound: "evidence_restrictive",
  plan_daily_life_mismatch: "evidence_plan_mismatch",
  previous_attempt_sustainability: "evidence_previous_attempt"
});

function movementEvidenceNarrative(composer, section) {
  return composer.render("context_low_car", section)
    || composer.render("context_low_home", section)
    || composer.render("context_low_only", section);
}

function patternObject(candidate, composer, section = "2") {
  const copy = PATTERN_COPY[candidate.id];
  const evidenceSummary = candidate.id === "low_movement"
    ? movementEvidenceNarrative(composer, section)
    : composer.render(PATTERN_EVIDENCE_TEMPLATES[candidate.id], section);
  return {
    id: candidate.id, category: candidate.category, title: PATTERN_PUBLIC_TITLES[candidate.id] || candidate.title, explanation: copy.explanation,
    evidenceSummary, effectOnWeightLoss: copy.effectOnWeightLoss,
    interactionsWith: [], uncertainty: copy.uncertainty, recommendationId: candidate.recommendationId
  };
}

function strengthItems(evidence, composer) {
  const seen = new Set();
  return (evidence.protective || []).flatMap(row => {
    const copy = PROTECTIVE_COPY[row.signal];
    if (!copy || seen.has(copy)) return [];
    seen.add(copy);
    const text = composer.recordRule(`strength_detail_${row.signal}`, { requiredProtectiveSignals: [row.signal] }, copy, "6");
    return text ? [{ signal: row.signal, text }] : [];
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

function contextualFactors(evidence, contextualPatterns, facts, composer) {
  const items = contextualPatterns.map(candidate => ({
    id: candidate.id,
    title: CONTEXT_PUBLIC_TITLES[candidate.id] || candidate.title,
    summary: `${candidate.id === "low_movement" ? movementEvidenceNarrative(composer, "4") : composer.render(PATTERN_EVIDENCE_TEMPLATES[candidate.id], "4")} ${PATTERN_COPY[candidate.id].effectOnWeightLoss}`
  }));
  const contextSignals = new Set((evidence.contexts || []).map(row => row.signal));
  if (contextSignals.has("food_discomfort_context")) items.push({ id: "food_discomfort_context", title: "Хоолны дараах биеийн мэдрэмж", summary: "Зарим хүнсний дараах тавгүй мэдрэмжийг хоол, хэмжээ, тухайн үеийн нөхцөлтэй нь хамт ажиглах нь хэрэгтэй." });
  if (contextSignals.has("alcohol_food_change")) items.push({ id: "alcohol_food_change", title: "Согтууруулах ундааны дараах хоолны сонголт", summary: "Хэрэглэсэн үед идэх хэмжээ эсвэл сонголт өөрчлөгдсөн бол тэр нөхцөлийг тусад нь ажиглах хэрэгтэй." });
  const schedule = composer.render("context_schedule", "4");
  if (schedule) items.push({ id: "schedule_barrier", title: "Цагийн хуваарьт багтах шаардлага", summary: schedule });
  const cost = composer.render("context_cost", "4");
  if (cost) items.push({ id: "cost_barrier", title: "Зардал тогтвортой үргэлжлүүлэхэд нөлөөлсөн нь", summary: cost });
  const injury = composer.render("context_injury", "4");
  if (injury) items.push({ id: "injury_or_pain_barrier", title: CONTEXT_PUBLIC_TITLES.injury_or_pain_barrier, summary: injury });
  return items;
}

function previousAttemptAnalysis(evidence, facts, composer) {
  const tracked = new Set(["activity_based_method", "medium_duration_attempt", "sustained_attempt", "initial_attempt_success", "short_lived_attempt", "attempt_not_sustained", "weight_regain", "sustainability_barrier", "strict_rule_barrier", "schedule_barrier", "cost_barrier"]);
  const rows = (evidence.signals || []).filter(row => tracked.has(row.signal));
  if (new Set(rows.map(row => row.questionId)).size < 2) return null;
  const worked = [composer.render("attempt_method_movement", "5"), composer.render("attempt_duration_long", "5"), composer.render("attempt_duration_medium", "5"), composer.render("attempt_initial_success", "5")].filter(Boolean);
  const broke = [composer.render("attempt_injury_stop", "5"), composer.render("attempt_weight_regain", "5"), composer.render("attempt_schedule", "5"), composer.render("attempt_cost", "5"), composer.render("attempt_interpretation", "5")].filter(Boolean);
  return { paragraphs: [worked.join(" "), broke.join(" ")].filter(Boolean) };
}

function professionalGuidance(composer) {
  const items = ["guidance_blood_pressure", "guidance_glucose", "guidance_injury", "guidance_medication", "guidance_reproductive"].map(id => composer.render(id, "10")).filter(Boolean);
  return items.length ? items.join(" ") : null;
}

function recommendationFor(candidate, facts, composer) {
  if (candidate.id !== "previous_attempt_sustainability") return { recommendationId: candidate.recommendationId, ...STRATEGY_COPY[candidate.recommendationId] };
  const fitSentences = [composer.render("recommendation_schedule_fit", "7"), composer.render("recommendation_cost_fit", "7")].filter(Boolean);
  return {
    recommendationId: "build_maintenance_bridge",
    action: `Өмнөх аргыг яг хуучнаар нь давтахаас илүү өдөр тутам үргэлжлүүлж болох орлуулах төлөвлөгөө бэлдэнэ. ${fitSentences.join(" ")}`.trim(),
    reason: "Орлуулах төлөвлөгөө нь үндсэн хувилбар, нөхцөл хүндрэхэд хийх богино хувилбар, тасарсны дараа буцах дүрэм гэсэн гурван хэсэгтэй байна."
  };
}

function startingAction(prioritized, facts, composer) {
  if (!prioritized) return null;
  const recommendation = recommendationFor(prioritized, facts, composer);
  if (prioritized.id !== "previous_attempt_sustainability" || !(facts.activityBasedMethod || facts.lowMovement)) return {
    patternId: prioritized.id, recommendationId: recommendation.recommendationId,
    action: `Эхний туршилтаар дараах нэг алхмыг хийнэ: ${RECOMMENDATIONS[prioritized.recommendationId].action.charAt(0).toLowerCase()}${RECOMMENDATIONS[prioritized.recommendationId].action.slice(1)}`,
    reason: "Өөрчлөлтийг нэг зүйлээр эхлүүлснээр бодит амьдралд хэрэгжиж байгаа эсэхийг тодорхой ажиглаж, дараагийн алхмаа баримжаатай сонгоно.",
    priorityReason: "Энэ алхам одоо харагдсан гол саадтай шууд холбоотой бөгөөд ажиглаж болохоор жижиг байна."
  };
  const plan = {
    duration: "14 хоног",
    option: composer.render("plan_option_injury", "8") || composer.render("plan_option_general", "8"),
    anchor: "Өдөр бүр тогтвортой давтагддаг нэг үйл явдлын дараа",
    frequency: "Долоо хоногт сонгосон дор хаяж 4 өдөр",
    record: `Сонгосон хөдөлгөөн, хийсэн минут, хийхэд хэр эвтэйхэн байсныг тэмдэглэнэ.${facts.injury ? " Өмнөх гэмтэлтэй холбоотой зовиур өөрчлөгдсөн эсэхийг мөн тэмдэглэнэ." : ""}`,
    success: composer.render("plan_success_injury", "8") || composer.render("plan_success_general", "8"),
    fallback: composer.render("plan_fallback_schedule", "8") || composer.render("plan_fallback_general", "8"),
    maintenanceRule: "Алгассан өдрийг дараагийн өдөр давхар нөхөхгүй; дараагийн сонгосон өдрөөс хэвийн үргэлжлүүлнэ."
  };
  const injuryBoundary = composer.render("plan_injury_stop", "8");
  const additionalCost = composer.render("plan_cost", "8");
  if (injuryBoundary) plan.injuryBoundary = injuryBoundary;
  if (additionalCost) plan.additionalCost = additionalCost;
  return {
    patternId: prioritized.id, recommendationId: "maintenance_movement_bridge",
    action: "Дараагийн 14 хоногт нэг бага ачааллын хөдөлгөөн болон тасарсан өдрийн буцах дүрмийг хамтад нь туршина.",
    reason: "Энэ туршилт өмнөх аргыг бүхэлд нь давтахгүйгээр, одоогийн амьдралд багтах хөдөлгөөнийг олж шалгана.",
    priorityReason: "Өдөр тутмын хөдөлгөөн болон арга тасарсны дараах төлөвлөгөөг нэг алхмаар шалгах боломжтой тул үүнийг эхэнд эрэмбэлэв.",
    plan
  };
}

function overallPicture(evaluated, composer) {
  const overviewIds = {
    emotional_regulation: "overview_emotional", environmental_cues: "overview_environmental", irregular_meals_late_hunger: "overview_meal_rhythm",
    hunger_satiety: "overview_hunger_satiety", restrictive_rebound: "overview_restrictive", plan_daily_life_mismatch: "overview_plan_mismatch",
    previous_attempt_sustainability: "overview_previous_attempt"
  };
  const primary = evaluated.influencingPatterns.map(item => composer.render(overviewIds[item.id], "1")).filter(Boolean);
  const context = [
    ...(evaluated.contextualPatterns || []).map(item => composer.render(item.id === "low_movement" ? "overview_low_movement" : item.id === "sleep_fatigue" ? "overview_sleep" : null, "1")),
    composer.render("overview_schedule", "1"), composer.render("overview_cost", "1"), composer.render("overview_injury", "1")
  ].filter(Boolean);
  const protective = [composer.render("overview_protective_core", "1"), composer.render("overview_strategy_direction", "1")].filter(Boolean);
  const paragraphs = [primary.join(" "), context.join(" "), protective.join(" ")].filter(Boolean);
  return paragraphs.length ? paragraphs.slice(0, 3) : ["Одоогийн хариултаар нэг чиглэлийг гол шалтгаан гэж нэрлэх хангалттай давхцал харагдсангүй. Өдөр тутамд саад болдог нөхцөлөө нэг нэгээр нь ажиглах нь тохиромжтой."];
}

function buildFullReport(evidence = {}, now = new Date()) {
  const quality = evidenceQuality(evidence);
  const evaluated = quality.patternResult;
  const facts = factGates(evidence);
  const composer = sentenceComposer(evidence, evaluated, facts);
  const influencingPatterns = evaluated.influencingPatterns.map(candidate => patternObject(candidate, composer, "2"));
  const contextualPatternObjects = evaluated.contextualPatterns.map(candidate => patternObject(candidate, composer, "4"));
  const allPatternObjects = [...influencingPatterns, ...contextualPatternObjects];
  const patternById = new Map(allPatternObjects.map(pattern => [pattern.id, pattern]));
  const interactions = evaluated.interactions.filter(rule => rule.patterns.every(id => patternById.has(id))).map(rule => ({
    id: rule.id,
    patternIds: rule.patterns,
    explanation: composer.recordRule(`interaction_${rule.id}`, { requiredPatterns: rule.patterns, requiredSignals: rule.requiredSignals || [] }, INTERACTION_COPY[rule.id], "3")
  }));
  for (const interaction of interactions) for (const id of interaction.patternIds) {
    const pattern = patternById.get(id);
    pattern.interactionsWith = [...new Set([...pattern.interactionsWith, ...interaction.patternIds.filter(other => other !== id)])];
  }
  const prioritized = evaluated.influencingPatterns.slice().sort((left, right) => (PATTERN_PRIORITY[right.id] || 0) - (PATTERN_PRIORITY[left.id] || 0) || right.score - left.score)[0] || null;
  const supportedIds = new Set(evaluated.supported.map(item => item.id));
  const previous = previousAttemptAnalysis(evidence, facts, composer);
  const contextual = contextualFactors(evidence, evaluated.contextualPatterns, facts, composer);
  const protectiveSection = [composer.render("strength_body", "6"), composer.render("strength_common_barriers", "6"), composer.render("strength_adherence_success", "6"), composer.render("strength_strategy", "6")].filter(Boolean).join(" ") || null;
  const strengths = strengthItems(evidence, composer);
  const additionalPatternActions = evaluated.influencingPatterns.map(candidate => ({ patternId: candidate.id, patternTitle: PATTERN_PUBLIC_TITLES[candidate.id] || candidate.title, ...recommendationFor(candidate, facts, composer) }));
  const firstAction = startingAction(prioritized, facts, composer);
  const professional = professionalGuidance(composer);
  const urgent = composer.render("guidance_urgent_blood_pressure", "10");
  return {
    version: REPORT_VERSION, questionnaireVersion: QUESTIONNAIRE_VERSION,
    productName: "Илүүдэл жингээс салах тест үнэлгээ", reportDate: now.toISOString(), mode: quality.mode,
    overallPicture: overallPicture(evaluated, composer), influencingPatterns,
    contextualFactors: contextual,
    protectiveSectionSummary: protectiveSection, protectiveFactors: strengths, contradictions: contradictionItems(evidence, evaluated.candidates),
    previousAttemptAnalysis: previous, interactionSummary: interactions,
    prioritizedStartingAction: firstAction, additionalPatternActions,
    avoidForNow: influencingPatterns.length ? "Эхний туршилтын хугацаанд хоолны шинэ хатуу хориг болон олон шинэ дүрмийг зэрэг нэмэхгүй. Сонгосон нэг алхам өдөр тутмын амьдралд багтаж байгаа эсэхийг эхэлж ажиглана." : null,
    professionalGuidance: professional,
    urgentGuidance: urgent,
    internalEvidenceMap: {
      mappedQuestionCount: new Set([...(evidence.signals || []), ...(evidence.neutral || []), ...(evidence.excluded || []), ...(evidence.routingOnly || [])].map(row => row.questionId)).size,
      informativeQuestionCount: quality.questionCount, unmappedQuestions: evidence.unmappedQuestions || [], factGates: facts,
      signals: (evidence.signals || []).map(row => ({ questionId: row.questionId, dimension: row.dimension, signal: row.signal, effect: row.effect, protective: row.protective === true, contextOnly: row.contextOnly === true, guidanceOnly: row.guidanceOnly === true })),
      patternEvidence: evaluated.candidates.map(candidate => ({ id: candidate.id, category: candidate.category, supported: supportedIds.has(candidate.id), score: candidate.score, threshold: candidate.threshold, questionIds: candidate.questionIds, dimensions: candidate.dimensions })),
      sentenceEvidence: composer.sentenceEvidence,
      recommendationSelection: firstAction ? { patternId: firstAction.patternId, recommendationId: firstAction.recommendationId, reason: "The highest-priority eligible influencing pattern selected one first action; all other supported patterns retain their own section-7 direction." } : null
    }
  };
}

function publicReport(fullReport) {
  if (!fullReport || typeof fullReport !== "object") return fullReport;
  const { internalEvidenceMap: _internalEvidenceMap, evidence: _legacyEvidence, ...safe } = fullReport;
  return safe;
}

module.exports = { REPORT_VERSION, QUESTIONNAIRE_VERSION, buildEvidence, evidenceQuality, buildFullReport, publicReport };
