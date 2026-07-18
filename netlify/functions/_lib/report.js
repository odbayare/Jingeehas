"use strict";

const { ANSWER_SIGNAL_CONTRACT, directivesFor } = require("./report-signals.js");
const { PATTERN_PRIORITY, evaluatePatterns } = require("./report-patterns.js");
const { PATTERN_COPY, PATTERN_PUBLIC_TITLES, CONTEXT_PUBLIC_TITLES, SENTENCE_TEMPLATES, RECOMMENDATIONS, STRATEGY_COPY, INTERACTION_COPY, PROTECTIVE_COPY, sentenceTemplateMatches } = require("./report-copy.js");

const REPORT_VERSION = "jingeehas-case-formulation-v5-attribution";
const { QUESTIONNAIRE_VERSION, LEGACY_QUESTIONNAIRE_VERSION } = require("../../../questions.js");

function answerText(value) {
  return Array.isArray(value) ? value.join(", ") : String(value ?? "").trim();
}

function buildEvidence(answerRows = [], summaryRows = [], metadata = {}) {
  const answerMap = Object.fromEntries(answerRows.filter(row => row?.questionId).map(row => [row.questionId, row.value]));
  const pastMethods = Array.isArray(answerMap["Q-METHOD-PAST"]) ? answerMap["Q-METHOD-PAST"].filter(item => item !== "Ямар нэг арга хэрэглэж үзээгүй") : [];
  const linkedLongestMethod = metadata.linkedLongestMethod || answerMap["Q-METHOD-LONGEST"] || (pastMethods.length === 1 ? pastMethods[0] : null);
  const evidence = { signals: [], protective: [], contradictions: [], neutral: [], excluded: [], routingOnly: [], contexts: [], unmappedQuestions: [], summaries: [],
    questionnaireVersion: metadata.questionnaireVersion || LEGACY_QUESTIONNAIRE_VERSION, linkedLongestMethod,
    answerMap };
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
  if (["Дасгал хөдөлгөөн", "Алхалт"].includes(linkedLongestMethod)) {
    evidence.signals.push({ questionId: "Q-METHOD-LONGEST", dimension: "linked_previous_method", signal: "activity_based_method", effect: 2, derived: true });
  }
  return evidence;
}

function positiveSignals(evidence) {
  return new Set((evidence.signals || []).filter(row => row.effect > 0).map(row => row.signal));
}

function factGates(evidence) {
  const signals = positiveSignals(evidence);
  const protectiveSignals = new Set((evidence.protective || []).map(row => row.signal));
  const answerMap = evidence.answerMap || {};
  const pastMethods = Array.isArray(answerMap["Q-METHOD-PAST"])
    ? answerMap["Q-METHOD-PAST"].filter(method => method !== "Ямар нэг арга хэрэглэж үзээгүй")
    : [];
  const linkedMethod = evidence.linkedLongestMethod || (pastMethods.length === 1 ? pastMethods[0] : null);
  const validLinkedMethod = Boolean(linkedMethod && pastMethods.includes(linkedMethod));
  const duration = String(answerMap["Q-METHOD-DURATION"] || "").trim();
  const explicitImplementation = /(?:хэрэгжүүл|үргэлжлүүл|баримтал|дагаж|туршиж).{0,50}(?:өдөр|долоо хоног|сар|жил|хугацаа)/i.test(`${answerMap["Q-METHOD-STOP"] || ""} ${answerMap["OPEN-PAST"] || ""}`);
  const explicitMaintainedResult = /(?:жин|үр дүн).{0,50}(?:буур|зорилгодоо хүр|хадгал|тогтвортой болг)/i.test(`${answerMap["Q-METHOD-STOP"] || ""} ${answerMap["OPEN-PAST"] || ""}`);
  const noRegainAfterSuccess = answerMap["Q-METHOD-REGAIN"] === "Үгүй"
    && (answerMap["Q-METHOD-RESULT"] === "Жин буурсан" || explicitMaintainedResult);
  const stopContext = (evidence.neutral || []).find(row => row.questionId === "Q-METHOD-STOP" && String(row.contextValue || "").trim());
  const stopText = String(stopContext?.contextValue || "");
  const openInjury = /гэмт|бэрт/i.test(stopText);
  const openPain = /өвдөлт|өвдөж|өвдсөн|өвдөх/i.test(stopText);
  const openMovementLimit = /хөдөлгөөний хязгаар/i.test(stopText);
  const explicitInjuryStop = /(?:гэмт|бэрт).{0,60}(?:улмаас|учраас|болоод|шалтгаан|зогсо|үргэлжлүүлэх боломжгүй)|(?:улмаас|учраас|болоод|шалтгаан).{0,60}(?:гэмт|бэрт)/i.test(stopText);
  const explicitVoluntaryStop = !explicitInjuryStop && /өөрийн хүсэлтээр|өөрөө зогсоосон|зогсоохоор шийд|болихоор шийд|хэрэгжүүлэхээ больсон/i.test(stopText);
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
    openInjury,
    openPain,
    openMovementLimit,
    explicitInjuryStop,
    explicitVoluntaryStop,
    openInjuryCorroboration: openInjury || openPain || openMovementLimit,
    lowMovement: signals.has("low_movement") || signals.has("very_low_movement"),
    carTravel: signals.has("car_travel_context"),
    homeWork: signals.has("home_work_context"),
    bloodPressure,
    noRegainAfterSuccess,
    implementationExperience: pastMethods.length > 0 && validLinkedMethod && ((duration && duration !== "Тодорхой санахгүй") || explicitImplementation),
    commonEatingBarriersProtected: ["emotional_eating", "environmental_cue_reactivity", "hunger_recognition_difficulty", "satiety_difficulty", "portion_difficulty"].every(signal => protectiveSignals.has(signal)),
    environmentalCues: Array.isArray(answerMap["Q-CUE"])
      ? answerMap["Q-CUE"].filter(cue => !["Аль нь ч үгүй", "Хариулахгүй"].includes(cue))
      : [],
    menstrualAnswer: answerMap["MC-01"] || null
  });
}

function sentenceComposer(evidence, evaluated, facts) {
  const positiveRows = (evidence.signals || []).filter(row => row.effect > 0);
  const positiveSignals = new Set(positiveRows.map(row => row.signal));
  const protectiveRows = evidence.protective || [];
  const protectiveSignals = new Set(protectiveRows.map(row => row.signal));
  const patternRows = new Map((evaluated.candidates || []).map(candidate => [candidate.id, candidate.supporting || []]));
  const supportedPatterns = new Set((evaluated.supported || []).map(candidate => candidate.id));
  const influencingPatterns = new Set((evaluated.influencingPatterns || []).map(candidate => candidate.id));
  const stopContext = (evidence.neutral || []).find(row => row.questionId === "Q-METHOD-STOP" && String(row.contextValue || "").trim());
  const contextRows = Object.freeze({
    injury_or_pain_evidence: [
      ...positiveRows.filter(row => row.signal === "injury_or_pain_barrier"),
      ...(facts.openInjuryCorroboration && stopContext ? [{ questionId: stopContext.questionId }] : [])
    ],
    explicit_injury_stop_context: facts.explicitInjuryStop && !facts.openPain && !facts.openMovementLimit && stopContext ? [{ questionId: stopContext.questionId }] : [],
    explicit_voluntary_stop_context: facts.explicitVoluntaryStop && stopContext ? [{ questionId: stopContext.questionId }] : [],
    blood_pressure_followup: (evidence.contexts || []).filter(row => row.questionId === "Q-BLOOD-PRESSURE" && row.guidanceOnly && row.effect > 0),
    glucose_followup: (evidence.contexts || []).filter(row => row.questionId === "Q-GLUCOSE" && row.guidanceOnly && row.effect > 0),
    unsupervised_medication: (evidence.contexts || []).filter(row => row.questionId === "Q-METHOD-MEDICATION" && row.guidanceOnly && row.effect > 0),
    menstrual_sometimes_irregular: facts.menstrualAnswer === "Заримдаа зөрдөг" ? [{ questionId: "MC-01" }] : [],
    menstrual_mostly_irregular: facts.menstrualAnswer === "Ихэнхдээ тогтмол биш" ? [{ questionId: "MC-01" }] : [],
    menstrual_absent_three_months: facts.menstrualAnswer === "Сүүлийн 3 сард ирээгүй" ? [{ questionId: "MC-01" }] : [],
    pregnancy_followup: (evidence.contexts || []).filter(row => row.questionId === "PREG-GATE" && row.guidanceOnly && row.effect > 0),
    reproductive_followup: (evidence.contexts || []).filter(row => ["MC-01", "PREG-GATE"].includes(row.questionId) && row.guidanceOnly && row.effect > 0)
  });
  const sentenceEvidence = [];

  function matches(gate) {
    return sentenceTemplateMatches(gate, {
      positiveSignals,
      protectiveSignals,
      supportedPatterns,
      influencingPatterns,
      contexts: Object.keys(contextRows).filter(context => (contextRows[context] || []).length)
    });
  }

  function questionIdsFor(gate) {
    const signalNames = new Set([...(gate.requiredSignals || []), ...(gate.requiredProtectiveSignals || [])]);
    const rows = [
      ...positiveRows.filter(row => signalNames.has(row.signal)),
      ...protectiveRows.filter(row => signalNames.has(row.signal)),
      ...(gate.requiredPatterns || []).flatMap(pattern => patternRows.get(pattern) || []),
      ...(gate.requiredContexts || []).flatMap(context => contextRows[context] || [])
    ];
    if (gate.requiredPatternCount != null) rows.push(...positiveRows, ...protectiveRows);
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
      forbiddenPatterns: gate.forbiddenPatterns || [],
      requiredPatternCount: gate.requiredPatternCount ?? null,
      requiredProtectiveCount: gate.requiredProtectiveCount ?? null,
      requiredContexts: gate.requiredContexts || [],
      forbiddenContexts: gate.forbiddenContexts || [],
      text,
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
  const patternResult = evaluatePatterns(evidence.signals || [], evidence);
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
  return composer.render("context_very_low_car", section)
    || composer.render("context_very_low_home", section)
    || composer.render("context_very_low_only", section)
    || composer.render("context_low_car", section)
    || composer.render("context_low_home", section)
    || composer.render("context_low_only", section);
}

function environmentalCueEvidence(facts, composer, section) {
  const cues = facts.environmentalCues || [];
  if (!cues.length) return null;
  const normalized = cues.map((cue, index) => index === 0 ? cue : `${cue.charAt(0).toLowerCase()}${cue.slice(1)}`);
  const selected = normalized.length === 1
    ? normalized[0]
    : `${normalized.slice(0, -1).join(", ")} эсвэл ${normalized.at(-1)}`;
  return composer.recordRule(
    "evidence_environmental_selected_cues",
    { requiredPatterns: ["environmental_cues"] },
    `${selected} үед өлсөөгүй байсан ч идэх хүсэл төрдөг гэж хариулжээ.`,
    section
  );
}

function patternObject(candidate, composer, facts, section = "2") {
  const copy = PATTERN_COPY[candidate.id];
  const patternGate = { requiredPatterns: [candidate.id] };
  const evidenceSummary = candidate.id === "low_movement"
    ? movementEvidenceNarrative(composer, section)
    : candidate.id === "environmental_cues"
      ? environmentalCueEvidence(facts, composer, section)
      : composer.render(PATTERN_EVIDENCE_TEMPLATES[candidate.id], section);
  const paragraphs = candidate.id === "previous_attempt_sustainability"
    ? (() => {
      const injuryCluster = composer.render("evidence_previous_attempt_injury_cluster", section);
      return injuryCluster ? [injuryCluster] : [
        composer.render("evidence_previous_attempt_complete", section) || evidenceSummary,
        facts.explicitInjuryStop
          ? composer.render("evidence_previous_attempt_maintenance", section)
          : composer.render("evidence_previous_attempt_meaning_voluntary", section)
            || composer.render("evidence_previous_attempt_meaning_neutral", section)
      ].filter(Boolean);
    })()
    : null;
  return {
    id: candidate.id, category: candidate.category, title: PATTERN_PUBLIC_TITLES[candidate.id] || candidate.title,
    explanation: composer.recordRule(`pattern_${candidate.id}_explanation`, patternGate, copy.explanation, section),
    evidenceSummary,
    effectOnWeightLoss: composer.recordRule(`pattern_${candidate.id}_effect`, patternGate, copy.effectOnWeightLoss, section),
    paragraphs, interactionsWith: [],
    uncertainty: composer.recordRule(`pattern_${candidate.id}_uncertainty`, patternGate, copy.uncertainty, section),
    recommendationId: candidate.recommendationId
  };
}

function strengthItems(evidence, composer, facts) {
  const seen = new Set();
  const strengths = (evidence.protective || []).flatMap(row => {
    if (row.signal === "weight_regain" && !facts.noRegainAfterSuccess) return [];
    if (row.signal === "sustainability_barrier" && !facts.implementationExperience) return [];
    const copy = PROTECTIVE_COPY[row.signal];
    if (!copy || seen.has(copy)) return [];
    seen.add(copy);
    const text = composer.recordRule(`strength_detail_${row.signal}`, { requiredProtectiveSignals: [row.signal] }, copy, "6");
    return text ? [{ signal: row.signal, text }] : [];
  });
  const rhythmCaveat = composer.recordRule(
    "strength_regular_rhythm_hunger_caveat",
    { requiredProtectiveSignals: ["regular_meal_rhythm"], requiredSignals: ["hunger_recognition_difficulty", "satiety_difficulty"] },
    "Харин өлсөх, цадах дохиогоо цагт нь анзаарах хүндрэл тусдаа хэвээр байна.",
    "6"
  );
  if (rhythmCaveat) strengths.push({ signal: "regular_meal_rhythm_hunger_caveat", text: rhythmCaveat });
  return strengths;
}

function naturalList(items) {
  if (items.length <= 1) return items[0] || "";
  return `${items.slice(0, -1).join(", ")} болон ${items.at(-1)}`;
}

function sentenceCase(text) {
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : text;
}

function groupedNeutralStrengths(strengths) {
  const signals = new Set(strengths.map(item => item.signal));
  const groups = [];
  const body = [
    signals.has("hunger_recognition_difficulty") ? "өлсөх мэдрэмжээ анзаарах" : null,
    signals.has("satiety_difficulty") ? "цадсанаа мэдээд зогсох" : null,
    signals.has("portion_difficulty") ? "идэх хэмжээгээ тохируулах" : null
  ].filter(Boolean);
  if (body.length) groups.push(`${sentenceCase(naturalList(body))} нь ашиглаж болох давуу тал байна.`);

  const protections = [
    signals.has("emotional_eating") ? "стрессийн үеийн идэх хүсэл" : null,
    signals.has("environmental_cue_reactivity") ? "орчны хоолны дохио" : null,
    signals.has("short_sleep") || signals.has("poor_sleep_quality") ? "нойрны хугацаа, чанар" : null
  ].filter(Boolean);
  if (protections.length) groups.push(`${sentenceCase(naturalList(protections))} нь гол саад болж харагдсангүй.`);

  const routine = [
    signals.has("high_movement") ? "өдрийн хөдөлгөөний түвшин" : null,
    signals.has("regular_meal_rhythm") ? "тогтвортой хоолны хэмнэл" : null
  ].filter(Boolean);
  if (routine.length) groups.push(`${sentenceCase(naturalList(routine))} нь өдөр тутмын төлөвлөгөөнд ашиглаж болох давуу тал байна.`);

  const experience = [
    signals.has("sustained_attempt") || signals.has("medium_duration_attempt") ? "өмнөх аргаа удаан хугацаанд үргэлжлүүлсэн" : null,
    signals.has("initial_attempt_success") ? "эхний үр дүн гаргаж чадсан" : null,
    signals.has("weight_regain") ? "үр дүнгээ хадгалсан" : null,
    signals.has("sustainability_barrier") ? "тодорхой саадгүй хэрэгжүүлсэн" : null,
    signals.has("professional_support") ? "мэргэжлийн дэмжлэг ашигласан" : null
  ].filter(Boolean);
  if (experience.length) groups.push(`${sentenceCase(naturalList(experience))} туршлага нь дараагийн өөрчлөлтөд ашиглаж болох давуу тал байна.`);
  return groups;
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
    summary: `${candidate.id === "low_movement" ? movementEvidenceNarrative(composer, "4") : composer.render(PATTERN_EVIDENCE_TEMPLATES[candidate.id], "4")} ${candidate.id === "low_movement" && facts.commonEatingBarriersProtected
      ? composer.recordRule("context_low_movement_protective_eating", { requiredPatterns: ["low_movement"], requiredProtectiveSignals: ["emotional_eating", "environmental_cue_reactivity", "hunger_recognition_difficulty", "satiety_difficulty", "portion_difficulty"] }, "Хооллолттой холбоотой нийтлэг саад хүчтэй илрээгүй боловч өдөр тутмын хөдөлгөөн бага байх нь зорилгод хүрэх хурдад нөлөөлж болно.", "4")
      : PATTERN_COPY[candidate.id].effectOnWeightLoss}`
  }));
  const foodDiscomfort = composer.render("context_food_discomfort", "4");
  if (foodDiscomfort) items.push({ id: "food_discomfort_context", title: "Хоолны дараах биеийн мэдрэмж", summary: foodDiscomfort });
  const alcoholFoodChange = composer.render("context_alcohol_food_change", "4");
  if (alcoholFoodChange) items.push({ id: "alcohol_food_change", title: "Согтууруулах ундааны дараах хоолны сонголт", summary: alcoholFoodChange });
  const schedule = composer.render("context_schedule", "4");
  if (schedule) items.push({ id: "schedule_barrier", title: "Цагийн хуваарьт багтах шаардлага", summary: schedule });
  const cost = composer.render("context_cost", "4");
  if (cost) items.push({ id: "cost_barrier", title: "Зардал тогтвортой үргэлжлүүлэхэд нөлөөлсөн нь", summary: cost });
  const injuryImpossible = composer.render("context_injury_impossible", "4");
  const injuryDifficult = composer.render("context_injury_difficult", "4");
  if (injuryImpossible) items.push({ id: "injury_or_pain_barrier", title: "Өмнөх гэмтлийг дараагийн хөдөлгөөнд харгалзах шаардлага", summary: injuryImpossible });
  else if (injuryDifficult) items.push({ id: "injury_or_pain_barrier", title: CONTEXT_PUBLIC_TITLES.injury_or_pain_barrier, summary: injuryDifficult });
  return items;
}

function previousAttemptAnalysis(evidence, facts, composer) {
  const tracked = new Set(["activity_based_method", "medium_duration_attempt", "sustained_attempt", "initial_attempt_success", "short_lived_attempt", "attempt_not_sustained", "weight_regain", "sustainability_barrier", "strict_rule_barrier", "schedule_barrier", "cost_barrier"]);
  const rows = (evidence.signals || []).filter(row => tracked.has(row.signal));
  if (new Set(rows.map(row => row.questionId)).size < 2) return null;
  const worked = [composer.render("attempt_method_movement", "5"), composer.render("attempt_duration_long", "5"), composer.render("attempt_duration_medium", "5"), composer.render("attempt_initial_success", "5")].filter(Boolean);
  const practicalBarrier = composer.render("attempt_schedule_cost", "5")
    || composer.render("attempt_schedule_only", "5")
    || composer.render("attempt_cost_only", "5");
  const broke = [composer.render("previous_method_stopped_due_to_injury", "5") || composer.render("attempt_injury_stop_general", "5"), composer.render("attempt_weight_regain", "5"), practicalBarrier].filter(Boolean);
  return { paragraphs: [worked.join(" "), broke.join(" ")].filter(Boolean) };
}

function professionalGuidance(composer) {
  const injury = composer.render("guidance_injury_exact", "10") || composer.render("guidance_injury_general", "10");
  const menstrual = composer.render("guidance_menstrual_sometimes_irregular", "10")
    || composer.render("guidance_menstrual_mostly_irregular", "10")
    || composer.render("guidance_menstrual_absent_three_months", "10");
  const items = [composer.render("guidance_blood_pressure", "10"), composer.render("guidance_glucose", "10"), injury, composer.render("guidance_medication", "10"), menstrual, composer.render("guidance_pregnancy", "10")].filter(Boolean);
  return items.length ? items.join(" ") : null;
}

function environmentalCueCopy(facts) {
  const cues = facts.environmentalCues || [];
  const generic = "Өлсөөгүй үед идэх хүсэл хамгийн их төрүүлдэг нэг орчны дохиог сонгож, түүний хүртээмж эсвэл нөлөөг нэг аргаар багасгана.";
  if (cues.length !== 1) return { action: generic, strategy: generic };
  if (cues[0] === "Хоол харагдах") return {
    action: "Давтагдан ил харагддаг нэг хүнсийг нүдэнд шууд өртөхгүй газар байрлуулна.",
    strategy: "Бүх орчноо нэг дор өөрчлөхгүй; давтагдан ил харагддаг нэг хүнсийг нүдэнд шууд өртөхгүй газар байрлуулна."
  };
  if (cues[0] === "Хоол захиалгын апп нээх") return {
    action: "Хоол захиалгын аппын нэг нэвтрэх дохиог багасгана: мэдэгдлийг унтраах эсвэл нүүр дэлгэцийн товчлолыг далд байрлуулна.",
    strategy: "Хоол захиалгын аппын мэдэгдэл эсвэл нүүр дэлгэцийн товчлолын аль нэгийг багасгаж, апп руу автоматаар орох дохиог өөрчилнө."
  };
  if (cues[0] === "Бусад хүн идэж байх") return {
    action: "Бусад хүн идэж байх нөхцөлд хэрэглэх нэг урьдчилсан хариу эсвэл өөр үйлдлийг бэлдэнэ.",
    strategy: "Бусад хүн идэж байх үед дагаж идэхээс өмнө хэрэглэх нэг урьдчилсан хариу эсвэл өөр үйлдлийг бэлдэнэ."
  };
  return { action: generic, strategy: generic };
}

function recommendationFor(candidate, facts, composer) {
  const gate = { requiredPatterns: [candidate.id] };
  if (candidate.id === "environmental_cues") {
    const cue = environmentalCueCopy(facts);
    return {
      recommendationId: candidate.recommendationId,
      action: composer.recordRule("strategy_environmental_cues_action", gate, cue.strategy, "7"),
      reason: composer.recordRule("strategy_environmental_cues_reason", gate, "Нэг тодорхой орчны дохиог өөрчлөх нь олон дүрэм нэмэхгүйгээр түүний нөлөөг шалгах боломж өгнө.", "7")
    };
  }
  if (candidate.id !== "previous_attempt_sustainability") {
    const copy = STRATEGY_COPY[candidate.recommendationId];
    return {
      recommendationId: candidate.recommendationId,
      action: composer.recordRule(`strategy_${candidate.id}_action`, gate, copy.action, "7"),
      reason: composer.recordRule(`strategy_${candidate.id}_reason`, gate, copy.reason, "7")
    };
  }
  const fitSentences = [composer.render("recommendation_schedule_fit", "7"), composer.render("recommendation_cost_fit", "7")].filter(Boolean);
  const baseAction = composer.recordRule("strategy_previous_attempt_action", gate, "Өмнөх аргыг яг хуучнаар нь давтахаас илүү өдөр тутмын амьдралд тогтмол хэрэгжүүлж болох орлуулах төлөвлөгөө бэлдэнэ.", "7");
  return {
    recommendationId: "build_maintenance_bridge",
    action: `${baseAction} ${fitSentences.join(" ")}`.trim(),
    reason: composer.recordRule("strategy_previous_attempt_reason", gate, "Орлуулах төлөвлөгөө нь үндсэн хувилбар, нөхцөл хүндрэхэд хийх богино хувилбар, алгассан өдрийн дараа хэвийн үргэлжлүүлэх дүрэм гэсэн гурван хэсэгтэй байна.", "7")
  };
}

function startingAction(prioritized, facts, composer) {
  if (!prioritized) return null;
  const recommendation = recommendationFor(prioritized, facts, composer);
  const patternGate = { requiredPatterns: [prioritized.id] };
  if (prioritized.id === "emotional_regulation") return {
    patternId: prioritized.id,
    recommendationId: recommendation.recommendationId,
    action: composer.recordRule("experiment_emotional_action", patternGate, "Стресс нэмэгдэж, хоол авах гэж буй мөчид ямар хэрэгцээ хамгийн хүчтэй байгааг ажиглана.", "8"),
    reason: composer.recordRule("experiment_emotional_reason", patternGate, "Энэ туршилт хоолыг хорихгүйгээр тухайн мөчид хоол ямар хэрэгцээг нөхөж байгаа мэт санагддаг, идсэний дараа тэр хэрэгцээ хэрхэн өөрчлөгддөгийг ажиглана.", "8"),
    priorityReason: composer.recordRule("experiment_emotional_priority", patternGate, "Стресс болон идэх хүсэл давтагдан холбоотой байсан тул өөр нэг зан үйлийг зэрэг өөрчлөхгүйгээр энэ холбоог эхэлж ажиглана.", "8"),
    plan: {
      kind: "emotional_observation",
      variable: "стресс нэмэгдэх мөчид хэрэгцээгээ ялгаж анзаарах богино завсарлага",
      trigger: composer.render("emotional_experiment_trigger", "8"),
      action: composer.render("emotional_experiment_action", "8"),
      observe: composer.render("emotional_experiment_observe", "8"),
      keepConstant: composer.render("emotional_experiment_constant", "8"),
      success: composer.render("emotional_experiment_success", "8"),
      fallback: composer.render("emotional_experiment_fallback", "8")
    }
  };
  if (prioritized.id === "sleep_fatigue") return {
    patternId: prioritized.id,
    recommendationId: "schedule_fatigue_default",
    action: composer.recordRule("experiment_sleep_schedule_action", patternGate, "Шөнийн дуудлага эсвэл урт ажлын өдрийн дараа хэрэглэх, урьдчилан сонгосон, бэлтгэл бага шаарддаг нэг хялбар хувилбар бэлдэнэ.", "8"),
    reason: composer.recordRule("experiment_sleep_schedule_reason", patternGate, "Нойр болон ядаргаа давтагдсан үед төлөвлөгөө хуваарьт багтахаа больсон тул урьдчилан сонгосон хялбар хувилбар бодит нөхцөлд ажиллах эсэхийг шалгана.", "8"),
    priorityReason: composer.recordRule("experiment_sleep_schedule_priority", patternGate, "Ядарсан өдрийн шийдвэрийн ачааллыг багасгах нь энэ тайланд харагдсан нойр, хуваарийн холбоотой хамгийн шууд нийцнэ.", "8"),
    plan: {
      kind: "schedule_fatigue_default",
      variable: "шөнийн дуудлага эсвэл урт ажлын өдрийн дараах урьдчилан сонгосон хялбар хувилбар",
      action: "Тухайн нөхцөл үүсэхээс өмнө нэмэлт бэлтгэл шаардахгүй, өөрийн боломжид нийцсэн нэг хувилбарыг бичиж сонгоно.",
      observe: "Тэр хувилбарыг ядарсан өдөр санаж, бодитоор ашиглаж чадсан эсэхээ л тэмдэглэнэ.",
      keepConstant: "Бусад хоол, хөдөлгөөн, нойрны дүрмийг зэрэг өөрчлөхгүй.",
      fallback: "Үндсэн хувилбар багтахгүй бол түүнээс ч бага бэлтгэлтэй хувилбарыг хэрэглэнэ; өнжсөн бол нөхөж хийхгүй.",
      success: "Дараагийн шөнийн дуудлага эсвэл урт ажлын өдрийн дараа сонгосон хувилбар бодит амьдралд багтсан эсэхээр дүгнэнэ.",
      maintenanceRule: "Алгассан өдрийн дараа дараагийн тохирох ажлын өдрөөс хэвийн үргэлжлүүлнэ."
    }
  };
  if (prioritized.id === "environmental_cues") {
    const cue = environmentalCueCopy(facts);
    return {
      patternId: prioritized.id,
      recommendationId: recommendation.recommendationId,
      action: composer.recordRule("experiment_environmental_cues_action", patternGate, `Эхний туршилтаар дараах нэг алхмыг хийнэ. ${cue.action}`, "8"),
      reason: composer.recordRule("experiment_environmental_cues_reason", patternGate, "Нэг орчны дохионы хүртээмж эсвэл нөлөөг өөрчилснөөр төлөвлөөгүй идэх хүсэлд тухайн дохио хэр нөлөөлдгийг тусад нь ажиглана.", "8"),
      priorityReason: composer.recordRule("experiment_environmental_cues_priority", patternGate, "Энэ алхам дэмжигдсэн орчны дохиотой шууд холбоотой бөгөөд бусад хооллолтын дүрмийг зэрэг өөрчлөхгүй.", "8")
    };
  }
  if (prioritized.id !== "previous_attempt_sustainability" || !(facts.activityBasedMethod || facts.lowMovement)) {
    const mealTimingPriority = prioritized.id === "irregular_meals_late_hunger"
      ? [composer.render("experiment_meal_timing_priority", "8"), composer.render("experiment_meal_timing_stress", "8")].filter(Boolean).join(" ")
      : null;
    const result = {
      patternId: prioritized.id, recommendationId: recommendation.recommendationId,
      action: composer.recordRule(`experiment_${prioritized.id}_action`, patternGate, `Эхний туршилтаар дараах нэг алхмыг хийнэ: ${RECOMMENDATIONS[prioritized.recommendationId].action.charAt(0).toLowerCase()}${RECOMMENDATIONS[prioritized.recommendationId].action.slice(1)}`, "8"),
      reason: composer.recordRule(`experiment_${prioritized.id}_reason`, patternGate, "Өөрчлөлтийг нэг зүйлээр эхлүүлснээр бодит амьдралд хэрэгжиж байгаа эсэхийг тодорхой ажиглаж, дараагийн алхмаа баримжаатай сонгоно.", "8"),
      priorityReason: mealTimingPriority
        || composer.recordRule(`experiment_${prioritized.id}_priority`, patternGate, "Энэ алхам одоо харагдсан гол саадтай шууд холбоотой бөгөөд ажиглаж болохоор жижиг байна.", "8")
    };
    if (mealTimingPriority) result.plan = {
      kind: "meal_timing_observation",
      variable: "нэг тогтвортой хоолны цаг",
      observe: "Сонгосон хоолны өмнөх өлсөлт, орой хэт өлсөх эсэх болон идэхээ зогсооход хэр амар байсныг тэмдэглэнэ.",
      keepConstant: "Бусад хоолны цаг, идэх хэмжээ болон цэсийг зориуд өөрчлөхгүй.",
      fallback: "Нэг өдөр сонгосон цагаа баримтлаагүй бол нөхөж хэт өөрчлөхгүй; дараагийн боломжтой өдрөөс хэвийн үргэлжлүүлнэ.",
      success: "Сонгосон хоолны цаг бодит амьдралд давтагдаж болох эсэх болон оройн хэт өлсөлтийн байдал өөрчлөгдөж байгаа эсэхийг ажиглана. Жингийн тоогоор дүгнэхгүй."
    };
    return result;
  }
  const recordBase = composer.recordRule("plan_movement_record", patternGate, "Сонгосон хөдөлгөөн, хийсэн минут, хийхэд хэр эвтэйхэн байсныг тэмдэглэнэ.", "8");
  const recordInjury = composer.recordRule("plan_movement_record_injury", { requiredContexts: ["injury_or_pain_evidence"] }, "Өмнөх гэмтэлтэй холбоотой зовиур өөрчлөгдсөн эсэхийг мөн тэмдэглэнэ.", "8");
  const candidateAPlan = {
    kind: "movement_rhythm",
    variable: "өдөр тутам давтаж болох нэг хөдөлгөөний хэмнэл",
    duration: composer.recordRule("plan_movement_duration_candidate", patternGate, "14 хоног", "8"),
    option: composer.render("plan_option_injury", "8") || composer.render("plan_option_general", "8"),
    anchor: composer.recordRule("plan_movement_anchor", patternGate, "Өдөр бүр тогтвортой давтагддаг нэг үйл явдлын дараа", "8"),
    frequency: composer.recordRule("plan_movement_frequency_candidate", patternGate, "Долоо хоногт сонгосон дор хаяж 4 өдөр", "8"),
    record: [recordBase, recordInjury].filter(Boolean).join(" "),
    success: composer.render("plan_success_injury", "8") || composer.render("plan_success_general", "8"),
    fallback: composer.render("plan_fallback_schedule", "8") || composer.render("plan_fallback_general", "8"),
    maintenanceRule: composer.recordRule("plan_movement_return_rule", patternGate, "Алгассан өдрийг дараагийн өдөр давхар нөхөхгүй; дараагийн сонгосон өдрөөс хэвийн үргэлжлүүлнэ.", "8")
  };
  const candidateBPlan = {
    kind: "movement_rhythm",
    variable: "өдөр тутмын амьдралд давтаж болох нэг хөдөлгөөний хэмнэл",
    duration: "Эхлэх өдөр болон үр дүнгээ эргэн харах өдрөө урьдчилан сонгоно.",
    option: composer.render("plan_option_injury", "8") || composer.render("plan_option_general", "8"),
    anchor: "Өдөр бүр эсвэл тогтмол давтагддаг, урьдчилан сонгосон нэг үйл явдлын дараа.",
    frequency: "Урьдчилан сонгосон боломж бүрд",
    record: ["Сонгосон хөдөлгөөн, хийсэн хугацаа, хийхэд хэр эвтэйхэн байсныг тэмдэглэнэ.", recordInjury].filter(Boolean).join(" "),
    fallback: facts.schedule
      ? "Завгүй өдөр үндсэн хувилбараасаа мэдэгдэхүйц богино, бага ачааллын хувилбарыг хийнэ."
      : "Үндсэн хувилбар тухайн өдөр багтахгүй бол мэдэгдэхүйц богино, бага ачааллын хувилбарыг хийнэ.",
    success: "Урьдчилан сонгосон мөчүүдэд үндсэн эсвэл богино хувилбарыг бодитоор давтаж болох эсэхийг ажиглана.",
    maintenanceRule: "Алгассан боломжийг дараагийн өдөр давхар нөхөхгүй; дараагийн сонгосон боломжоос хэвийн үргэлжлүүлнэ."
  };
  const injuryBoundary = composer.render("plan_injury_stop_exact", "8") || composer.render("plan_injury_stop_general", "8");
  const candidateBInjuryBoundary = facts.explicitInjuryStop
    ? "Өмнөх гэмтэлтэй холбоотой зовиур нэмэгдвэл тухайн өдрийн хөдөлгөөнийг зогсооно. Зовиур үргэлжилбэл мэргэжлийн хүнтэй зөвлөнө."
    : injuryBoundary;
  const additionalCost = composer.render("plan_cost", "8");
  if (injuryBoundary) candidateAPlan.injuryBoundary = injuryBoundary;
  if (candidateBInjuryBoundary) candidateBPlan.injuryBoundary = candidateBInjuryBoundary;
  if (additionalCost) { candidateAPlan.additionalCost = additionalCost; candidateBPlan.additionalCost = additionalCost; }
  const shared = {
    patternId: prioritized.id,
    recommendationId: "maintenance_movement_bridge",
    reason: composer.recordRule("experiment_movement_reason", patternGate, "Энэ туршилт өмнөх аргыг бүхэлд нь давтахгүйгээр, одоогийн амьдралд багтах нэг хөдөлгөөнийг олж шалгана.", "8"),
    priorityReason: composer.recordRule("experiment_movement_safeguards", patternGate, `${facts.schedule ? "Завгүй өдрийн" : "Үндсэн хувилбар багтахгүй өдрийн"} богино хувилбар болон алгассан өдрийн дараа хэвийн үргэлжлүүлэх дүрэм нь тусдаа өөрчлөлт бус, нэг хөдөлгөөний хэмнэлийг алдагдуулахгүй байхад зориулсан хамгаалалт юм.`, "8")
  };
  return { ...shared,
    action: composer.recordRule("experiment_movement_action_candidate_b", patternGate, "Өдөр тутмын амьдралд давтаж болох нэг хөдөлгөөний хэмнэлийг туршиж, эхлэх болон эргэн харах өдрөө урьдчилан сонгоно.", "8"),
    plan: candidateBPlan
  };
}

function overallPicture(evaluated, composer) {
  const overviewIds = {
    emotional_regulation: "overview_emotional", environmental_cues: "overview_environmental", irregular_meals_late_hunger: "overview_meal_rhythm",
    hunger_satiety: "overview_hunger_satiety", restrictive_rebound: "overview_restrictive", plan_daily_life_mismatch: "overview_plan_mismatch",
    previous_attempt_sustainability: "overview_previous_attempt"
  };
  const primary = evaluated.influencingPatterns.map(item => composer.render(overviewIds[item.id], "1")).filter(Boolean);
  const practicalCluster = composer.render("overview_practical_cluster", "1");
  const context = practicalCluster ? [practicalCluster] : [
    ...(evaluated.contextualPatterns || []).map(item => composer.render(item.id === "low_movement" ? "overview_low_movement" : item.id === "sleep_fatigue" ? "overview_sleep" : null, "1")),
    composer.render("overview_schedule", "1"), composer.render("overview_cost", "1"), composer.render("overview_injury", "1")
  ].filter(Boolean);
  const protective = [composer.render("overview_protective_core", "1"), composer.render("overview_strategy_direction", "1")].filter(Boolean);
  const paragraphs = [primary.join(" "), context.join(" "), protective.join(" ")].filter(Boolean);
  return paragraphs.length ? paragraphs.slice(0, 3) : [composer.render("neutral_no_pattern", "neutral_overview"), composer.render("neutral_meaning_complete", "neutral_overview")].filter(Boolean);
}

function neutralSubtype(evidence, contextual, strengths) {
  if (contextual.some(item => item.id === "low_movement")) return "low_movement";
  if ((evidence.contexts || []).some(row => ["MC-01", "PREG-GATE", "MENO-GATE"].includes(row.questionId) && row.guidanceOnly && row.effect > 0)) return "biological";
  if (strengths.length >= 5) return "protective";
  return "indeterminate";
}

function neutralObservation(subtype, composer) {
  if (subtype === "low_movement") return {
    variable: "өдөр тутмын нэг тогтмол үйл явдлын дараах эвтэйхэн хөдөлгөөний боломж",
    action: "Сонгосон мөчид өөрт эвтэйхэн, давтаж болох нэг хөдөлгөөний хувилбарыг туршаад хийхэд ямар нөхцөл дэмжсэн эсвэл саад болсныг тэмдэглэнэ.",
    keepConstant: "Хоолны хэмнэл болон бусад сайн ажиллаж буй дадлыг зориуд өөрчлөхгүй.",
    decisionRule: "Давтаж болох нөхцөл тодорвол тэр мөчөө хадгална; багтахгүй бол хөдөлгөөний төрлийг бус, хийх мөчийг нэг удаа солино."
  };
  if (subtype === "biological") return {
    variable: "мөчлөгийн өөрчлөлт болон тухайн үеийн өдөр тутмын мэдрэмж",
    action: "Мөчлөгийн огноо, үргэлжилсэн өөрчлөлт болон санаа зовоосон шинж байгаа эсэхийг товч тэмдэглэнэ.",
    keepConstant: "Дэмжигдээгүй хооллолтын асуудлыг засах шинэ дүрэм нэмэхгүй.",
    decisionRule: "Өөрчлөлт үргэлжилбэл эсвэл санаа зовнил төрүүлбэл тэмдэглэлээ эмэгтэйчүүдийн эмчтэй ярилцахдаа ашиглана."
  };
  if (subtype === "protective") return {
    variable: "одоо тогтвортой ажиллаж буй хоол, хөдөлгөөний хэмнэл",
    action: "Ажиллаж буй хэмнэлээ өөрчлөхгүй хадгалаад, алдагдсан тохиолдолд ямар нөхцөл нөлөөлснийг л тэмдэглэнэ.",
    keepConstant: "Шинэ хориг, засах дүрэм эсвэл шаардлагагүй туршилт нэмэхгүй.",
    decisionRule: "Хэмнэл тогтвортой хэвээр бол одоогийн аргаа хадгална; давтагдсан өөрчлөлт гарвал зөвхөн тэр нөхцөлийг дараа нь шинжилнэ."
  };
  return {
    variable: "нэг давтагддаг хооллох мөчийг өөрчлөлтгүйгээр ажиглах",
    action: composer.render("neutral_observation_action", "neutral_observation"),
    keepConstant: composer.render("neutral_observation_constant", "neutral_observation"),
    decisionRule: composer.render("neutral_decision_rule", "neutral_observation")
  };
}

function neutralResult(evidence, composer, strengths, contextual = [], quality = {}, professional = null) {
  const contextualTemplateIds = {
    sleep_fatigue: "neutral_context_sleep", low_movement: "neutral_context_movement",
    schedule_barrier: "neutral_context_schedule", cost_barrier: "neutral_context_cost",
    injury_or_pain_barrier: "neutral_context_injury", food_discomfort_context: "neutral_context_food",
    alcohol_food_change: "neutral_context_alcohol"
  };
  const contextualSummary = contextual.map(item => composer.render(contextualTemplateIds[item.id], "neutral_overview")).filter(Boolean).join(" ");
  const subtype = neutralSubtype(evidence, contextual, strengths);
  return {
    subtype,
    overview: [
      composer.render("neutral_no_pattern", "neutral_overview"),
      contextualSummary,
      composer.render(quality.mode === "insufficient" ? "neutral_meaning_insufficient" : "neutral_meaning_complete", "neutral_overview")
    ].filter(Boolean),
    notStronglySupported: ["neutral_absent_emotional", "neutral_absent_environmental", "neutral_absent_body_signals", "neutral_absent_sleep", "neutral_absent_portion"].map(id => composer.render(id, "neutral_absent")).filter(Boolean),
    notStronglySupportedFallback: composer.render("neutral_absent_fallback", "neutral_absent"),
    strengths: groupedNeutralStrengths(strengths),
    strengthsFallback: composer.render("neutral_strengths_fallback", "neutral_strengths"),
    limits: [composer.render("neutral_limits", "neutral_limits"), composer.render("neutral_more_information", "neutral_limits")].filter(Boolean),
    observation: neutralObservation(subtype, composer),
    professionalScope: professional || composer.render("neutral_professional_scope", "neutral_guidance"),
    reportUse: composer.render("neutral_report_use", "neutral_use")
  };
}

function buildFullReport(evidence = {}, now = new Date(), metadata = {}) {
  const quality = evidenceQuality(evidence);
  const evaluated = quality.patternResult;
  const facts = factGates(evidence);
  const composer = sentenceComposer(evidence, evaluated, facts);
  const influencingPatterns = evaluated.influencingPatterns.map(candidate => patternObject(candidate, composer, facts, "2"));
  const contextualPatternObjects = evaluated.contextualPatterns.map(candidate => patternObject(candidate, composer, facts, "4"));
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
  const sleepCandidate = evaluated.supported.find(item => item.id === "sleep_fatigue");
  const prioritized = sleepCandidate && facts.schedule
    ? sleepCandidate
    : evaluated.influencingPatterns.slice().sort((left, right) => (PATTERN_PRIORITY[right.id] || 0) - (PATTERN_PRIORITY[left.id] || 0) || right.score - left.score)[0] || null;
  const supportedIds = new Set(evaluated.supported.map(item => item.id));
  const previous = previousAttemptAnalysis(evidence, facts, composer);
  const contextual = contextualFactors(evidence, evaluated.contextualPatterns, facts, composer);
  const strengths = strengthItems(evidence, composer, facts);
  const protectiveSection = [composer.render("strength_body", "6"), composer.render("strength_common_barriers", "6"), composer.render("strength_adherence_success", "6")].filter(Boolean).join(" ") || null;
  const additionalPatternActions = evaluated.influencingPatterns.map(candidate => ({ patternId: candidate.id, patternTitle: PATTERN_PUBLIC_TITLES[candidate.id] || candidate.title, ...recommendationFor(candidate, facts, composer) }));
  const startDecision = startingAction(prioritized, facts, composer);
  const planDecisionPending = startDecision?.planDecisionPending === true;
  const firstAction = planDecisionPending ? null : startDecision;
  const professional = professionalGuidance(composer);
  const urgent = composer.render("guidance_urgent_blood_pressure", "10");
  const neutral = influencingPatterns.length ? null : neutralResult(evidence, composer, strengths, contextual, quality, professional);
  const overview = neutral ? null : overallPicture(evaluated, composer);
  const avoidForNow = influencingPatterns.length
    ? composer.recordRule("avoid_simultaneous_changes", { requiredPatterns: evaluated.influencingPatterns.map(item => item.id) }, "Эхний туршилтын хугацаанд хоолны шинэ хатуу хориг болон олон шинэ дүрмийг зэрэг нэмэхгүй. Сонгосон нэг алхам өдөр тутмын амьдралд багтаж байгаа эсэхийг эхэлж ажиглана.", "9")
    : null;
  return {
    version: REPORT_VERSION, questionnaireVersion: metadata.questionnaireVersion || evidence.questionnaireVersion || LEGACY_QUESTIONNAIRE_VERSION,
    productName: "Илүүдэл жингээс салах тест үнэлгээ", reportDate: now.toISOString(), mode: quality.mode,
    overallPicture: overview, influencingPatterns,
    contextualFactors: contextual,
    neutralResult: neutral,
    protectiveSectionSummary: protectiveSection, protectiveFactors: strengths, contradictions: contradictionItems(evidence, evaluated.candidates),
    previousAttemptAnalysis: previous, interactionSummary: interactions,
    prioritizedStartingAction: firstAction, additionalPatternActions,
    planDecisionPending,
    planAppendices: planDecisionPending ? {
      recommendedCandidate: startDecision.recommendedCandidate,
      selectedCandidate: startDecision.selectedCandidate,
      candidateA: startDecision.candidateA,
      candidateB: startDecision.candidateB
    } : null,
    avoidForNow,
    professionalGuidance: professional,
    urgentGuidance: urgent,
    internalEvidenceMap: {
      mappedQuestionCount: new Set([...(evidence.signals || []), ...(evidence.neutral || []), ...(evidence.excluded || []), ...(evidence.routingOnly || [])].map(row => row.questionId)).size,
      informativeQuestionCount: quality.questionCount, unmappedQuestions: evidence.unmappedQuestions || [], factGates: facts,
      signals: (evidence.signals || []).map(row => ({ questionId: row.questionId, dimension: row.dimension, signal: row.signal, effect: row.effect, protective: row.protective === true, contextOnly: row.contextOnly === true, guidanceOnly: row.guidanceOnly === true })),
      patternEvidence: evaluated.candidates.map(candidate => ({ id: candidate.id, category: candidate.category, supported: supportedIds.has(candidate.id), score: candidate.score, threshold: candidate.threshold,
        mandatoryAnchor: candidate.mandatoryAnchor || [], independentSupportingQuestionIds: candidate.independentSupportingQuestionIds || [],
        sharedContextualEvidence: candidate.sharedContextualEvidence || [], contradictions: candidate.contradictionEvidence || [],
        questionIds: candidate.questionIds, dimensions: candidate.dimensions })),
      sentenceEvidence: composer.sentenceEvidence,
      recommendationSelection: firstAction ? { patternId: firstAction.patternId, recommendationId: firstAction.recommendationId, reason: "The highest-priority eligible influencing pattern selected one first action; all other supported patterns retain their own section-7 direction." } : planDecisionPending ? { patternId: prioritized.id, recommendationId: "maintenance_movement_bridge", reason: "Numeric plan selection remains pending; no public first action is selected." } : null
    }
  };
}

function publicReport(fullReport) {
  if (!fullReport || typeof fullReport !== "object") return fullReport;
  const pending = fullReport.planDecisionPending === true;
  const internalKeys = new Set([
    "internalEvidenceMap", "evidence", "planDecisionPending", "planAppendices", "parameterApprovalStatus",
    "candidateA", "candidateB", "recommendedCandidate", "selectedCandidate", "id", "patternId", "patternIds", "interactionsWith",
    "recommendationId", "signal", "questionId", "questionIds", "sentenceTemplateId", "requiredSignals",
    "forbiddenSignals", "requiredProtectiveSignals", "requiredPatterns", "forbiddenPatterns", "requiredContexts",
    "forbiddenContexts", "actualSupportingQuestionIds"
  ]);
  function sanitize(value) {
    if (Array.isArray(value)) return value.map(sanitize);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).filter(([key]) => !internalKeys.has(key)).map(([key, child]) => [key, sanitize(child)]));
  }
  const safe = sanitize(fullReport);
  if (pending) safe.prioritizedStartingAction = null;
  return safe;
}

module.exports = { REPORT_VERSION, QUESTIONNAIRE_VERSION, buildEvidence, evidenceQuality, buildFullReport, publicReport };
