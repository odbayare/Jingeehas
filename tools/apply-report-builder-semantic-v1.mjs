import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Semantic refactor function missing: ${name}`);
  const braceStart = source.indexOf("{", start + marker.length);
  if (braceStart < 0) throw new Error(`Semantic refactor function body missing: ${name}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") { blockComment = false; index += 1; }
      continue;
    }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; index += 1; continue; }
    if (char === "\"" || char === "'" || char === "`") { quote = char; continue; }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return `${source.slice(0, start)}${replacement}${source.slice(index + 1)}`;
    }
  }
  throw new Error(`Semantic refactor function end missing: ${name}`);
}

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Semantic refactor anchor missing: ${label}`);
  return source.replace(from, to);
}

const MANAGEMENT_MODULE = `function managementModule(candidate, pattern, facts) {
  const copy = PATTERN_MANAGEMENT_MODULES[candidate.id];
  if (!copy || !pattern) return null;
  const selectedCues = candidate.id === "environmental_cues" ? facts.environmentalCues || [] : [];
  const cueLabel = selectedCues.length
    ? naturalList(selectedCues.map((cue, index) => index === 0 ? cue : \`\${cue.charAt(0).toLowerCase()}\${cue.slice(1)}\`))
    : null;
  const observe = cueLabel ? \`\${cueLabel} үед өлсөөгүй ч идэх хүсэл төрж буй эсэхийг анзаараарай.\` : copy.observe;
  const prepare = candidate.id === "environmental_cues" && selectedCues.length ? environmentalCueCopy(facts).strategy : copy.prepare;
  return {
    patternId: candidate.id,
    title: pattern.title,
    evidenceNote: "Доорх зөвлөмжийг дээр тайлбарласан нөхцөлтэйгээ уялдуулан хэрэглээрэй.",
    fields: [
      { key: "observe", label: "Юуг анзаарах вэ?", body: observe },
      { key: "trigger", label: "Юунаас өдөөгдөж байгааг хэрхэн таних вэ?", body: "Энэ нөхцөл үүсэхийн өмнө байсан газар, цаг, мэдрэмж эсвэл үйл явдлаас аль нь давтагдаж байгааг тэмдэглээрэй." },
      { key: "prepare", label: "Урьдчилан юу бэлдэх вэ?", body: prepare },
      { key: "inMoment", label: "Тухайн үед юу хийж болох вэ?", body: copy.inMoment },
      { key: "avoidRigidDemand", label: "Юуг хэт хатуу шаардахгүй байх вэ?", body: copy.avoidRigidDemand },
      { key: "professionalHelp", label: "Хэзээ мэргэжлийн тусламж авах вэ?", body: copy.professionalHelp }
    ]
  };
}`;

const COMBINED_MANAGEMENT_PLAN = `function combinedManagementPlan(patternIds, prioritized, modules) {
  const pair = Array.isArray(patternIds) ? [...new Set(patternIds)] : [];
  if (pair.length !== 2 || modules.length < 2) return null;
  const pairModules = pair.map(id => modules.find(item => item.patternId === id)).filter(Boolean);
  if (pairModules.length !== 2) return null;
  const primary = pairModules.find(item => item.patternId === prioritized?.id) || pairModules[0];
  const secondary = pairModules.find(item => item.patternId !== primary.patternId);
  if (!secondary) return null;
  const fieldBody = (module, key) => module.fields?.find(field => field.key === key)?.body || "";
  const reasonByPattern = {
    irregular_meals_late_hunger: "Хоолны зай болон өлсөх мэдрэмжийг нэг өдрийн дотор шууд ажиглаж, нэг тогтвортой хоолны цагаар шалгаж болох тул үүнээс эхэлнэ.",
    hunger_satiety: "Өлсөх, цадах мэдрэмжийг нэг хоолны үеэр шууд ажиглаж, жижиг завсарлагаар шалгаж болох тул үүнээс эхэлнэ.",
    emotional_regulation: "Идэх хүсэл нэмэгдэх мөчийг өдөр тутмын нөхцөлд шууд ажиглаж, нэг богино завсарлагаар шалгаж болох тул үүнээс эхэлнэ.",
    environmental_cues: "Нэг тодорхой орчны дохиог өөрчлөөд нөлөөг нь тусад нь ажиглаж болох тул үүнээс эхэлнэ.",
    sleep_fatigue: "Ядарсан үед хэрэгжих хялбар хувилбарыг урьдчилан бэлдэх нь шууд туршиж болох алхам тул үүнээс эхэлнэ.",
    restrictive_rebound: "Нэг хатуу дүрмийг уян болгох нь бүх төлөвлөгөөг зэрэг өөрчлөхгүйгээр нөлөөг нь шалгах боломжтой тул үүнээс эхэлнэ.",
    plan_daily_life_mismatch: "Өдөр тутамд багтах хамгийн хялбар хувилбарыг сонгох нь шууд хэрэгжүүлж болох алхам тул үүнээс эхэлнэ.",
    previous_attempt_sustainability: "Өмнөх арга боломжгүй үед хэрэглэх орлуулах хувилбарыг бэлдэх нь үр дүнгээ хадгалах хамгийн шууд алхам тул үүнээс эхэлнэ."
  };
  return {
    patternIds: [primary.patternId, secondary.patternId],
    startWith: { title: primary.title, body: fieldBody(primary, "observe") },
    why: \`\${reasonByPattern[primary.patternId] || "Эхний нөлөөг богино хугацаанд шууд ажиглаж, нэг жижиг өөрчлөлтөөр шалгаж болох тул үүнээс эхэлнэ."} Дараа нь хоёр дахь нөлөө мөн тэр үед давхцаж байгаа эсэхийг шалгана.\`,
    nextStep: { title: secondary.title, body: fieldBody(secondary, "prepare") },
    combinedAction: { title: "Хоёр хэв маягийг зэрэг удирдах арга", body: combinedManagementAction(primary.patternId, secondary.patternId) }
  };
}`;

const NEUTRAL_ACTIONABLE_PLAN = `function neutralActionablePlan(neutral) {
  const observation = neutral?.observation;
  if (!observation) return null;
  const directionSummary = String(neutral.strengths?.[0] || neutral.notStronglySupported?.[0] || neutral.strengthsFallback || neutral.overview?.at(-1) || "Одоогийн хариултаар нэг хэв маяг хүчтэй ялгараагүй байна");
  return {
    neutralActionPlan: {
      title: "Одоо танд тохирч байгаа хэвшлээ хадгалах",
      directionSummary,
      observation: {
        variable: observation.variable,
        action: observation.action,
        keepConstant: observation.keepConstant,
        decisionRule: observation.decisionRule
      }
    },
    firstActions: [
      { order: 1, patternTitle: "Ажиглах зүйл", action: \`\${observation.variable}-ийг сонгоорой.\` },
      { order: 2, patternTitle: "Нэг ажиглалт", action: "Сонгосон мөчид нэг ажиглалт хийж, нөлөөлсөн нөхцөлийг тэмдэглээрэй." },
      { order: 3, patternTitle: "Дараагийн шийдвэр", action: "Тэмдэглэлээ эргэн хараад одоогийн хэвшлээ хадгалах эсэхээ нэг удаа шийдээрэй." }
    ],
    recoveryPlan: {
      introduction: "Ажиглалт өдөр бүр яг ижил хэрэгжихгүй байж болно. Нэг удаа тэмдэглэж чадаагүй нь бүх ажиглалт хэрэггүй болсон гэсэн үг биш.",
      steps: [
        { key: "notice", label: "Юу саад болсныг анзаарах", body: "Ажиглалтад ямар бодит нөхцөл саад болсныг нэг өгүүлбэрээр тэмдэглээрэй." },
        { key: "resume", label: "Дараагийн мөчөөс үргэлжлүүлэх", body: "Алгассан ажиглалтыг нөхөхгүйгээр дараагийн сонгосон мөчөөс үргэлжлүүлээрэй." },
        { key: "fit", label: "Бодит амьдралдаа тохируулах", body: "Сонгосон мөч тохирохгүй байвал ажиглах зүйлээ бус, хийх мөчийг нэг удаа солиорой." }
      ],
      rules: ["Шинэ хориг эсвэл шаардлагагүй засах дүрэм нэмэхгүй байгаарай."]
    }
  };
}`;

const RECOVERY_PLAN = `function recoveryPlan(modules, combinedPlan, planFallback) {
  const primary = Array.isArray(modules) ? modules[0] : null;
  if (!primary || !planFallback) return null;
  const fieldBody = key => primary.fields?.find(field => field.key === key)?.body || "";
  return {
    introduction: planFallback.introduction,
    steps: [
      { key: "notice", label: "Юу болж байгааг анзаарах", body: fieldBody("observe") },
      { key: "inMoment", label: "Тухайн мөчид хийх нэг үйлдэл", body: fieldBody("inMoment") },
      { key: "prepare", label: "Урьдчилан бэлдэх зүйл", body: fieldBody("prepare") },
      { key: "resume", label: "Дараагийн боломжит мөчөөс үргэлжлүүлэх", body: planFallback.resume }
    ],
    combinedAction: combinedPlan?.combinedAction?.body || null,
    rules: [planFallback.softenRule, planFallback.recheckTrigger, planFallback.fitDailyLife].filter(Boolean)
  };
}`;

const RENDER_MANAGEMENT_MODULES = `function renderManagementModules(modules = []) {
  return modules.map(module => \`<article class="management-module"><h3>\${escapeHtml(module.title)}</h3><p class="management-evidence-link">\${escapeHtml(module.evidenceNote)}</p>
    <dl>\${(module.fields || []).map(field => \`<dt>\${escapeHtml(field.label)}</dt><dd>\${escapeHtml(field.body)}</dd>\`).join("")}</dl></article>\`).join("");
}`;

const RENDER_COMBINED_PLAN = `function renderCombinedPlan(plan) {
  if (!plan) return "";
  return \`<dl class="combined-management-plan">
    <dt>Эхэлж аль хэв маягийн нөлөөг багасгах вэ?</dt><dd><strong>\${escapeHtml(plan.startWith.title)}:</strong> <span>\${escapeHtml(plan.startWith.body)}</span></dd>
    <dt>Яагаад үүнээс эхлэх вэ?</dt><dd>\${escapeHtml(plan.why)}</dd>
    <dt>Дараагийн алхам юу вэ?</dt><dd><strong>\${escapeHtml(plan.nextStep.title)}:</strong> <span>\${escapeHtml(plan.nextStep.body)}</span></dd>
    <dt>Хоёр хэв маягийг зэрэг удирдахад ямар арга тохирох вэ?</dt><dd><strong>\${escapeHtml(plan.combinedAction.title)}:</strong> <span>\${escapeHtml(plan.combinedAction.body)}</span></dd>
  </dl>\`;
}`;

const RENDER_RECOVERY_PLAN = `function renderRecoveryPlan(plan) {
  if (!plan) return "";
  return \`\${renderReportParagraphs([plan.introduction])}<ol class="recovery-plan">
    \${(plan.steps || []).map(step => \`<li><strong>\${escapeHtml(step.label)}</strong><p>\${escapeHtml(step.body)}</p></li>\`).join("")}
    \${plan.combinedAction ? \`<li><strong>Хоёр нөхцөл давхцвал</strong><p>\${escapeHtml(plan.combinedAction)}</p></li>\` : ""}
  </ol>\${(plan.rules || []).length ? \`<ul class="recovery-rules">\${plan.rules.map(rule => \`<li>\${escapeHtml(rule)}</li>\`).join("")}</ul>\` : ""}\`;
}

function renderNeutralActionPlan(plan) {
  if (!plan) return "";
  return \`<h3>\${escapeHtml(plan.title)}</h3>\${renderReportParagraphs([plan.directionSummary])}<dl>
    <dt>Ажиглах нэг зүйл</dt><dd>\${escapeHtml(plan.observation.variable)}</dd>
    <dt>Юу хийх вэ?</dt><dd>\${escapeHtml(plan.observation.action)}</dd>
    <dt>Юуг өөрчлөхгүй вэ?</dt><dd>\${escapeHtml(plan.observation.keepConstant)}</dd>
    <dt>Дараагийн шийдвэрийн дүрэм</dt><dd>\${escapeHtml(plan.observation.decisionRule)}</dd>
  </dl>\`;
}`;

const RENDER_INITIAL_ACTIONS = `function renderInitialActions(full) {
  const actions = full.initialActions || [];
  const primary = full.prioritizedStartingAction && !full.planDecisionPending && !full.prioritizedStartingAction.planDecisionPending
    ? \`<div class="primary-management-direction"><h3>Эхлэх үндсэн чиглэл</h3>\${renderReportParagraphs([full.prioritizedStartingAction.action, full.prioritizedStartingAction.priorityReason || full.prioritizedStartingAction.reason])}\${renderPlanDetails(full.prioritizedStartingAction.plan)}</div>\`
    : "";
  return \`\${primary}<ol class="initial-action-list">\${actions.map(item => \`<li><strong>\${escapeHtml(item.patternTitle)}:</strong> <span>\${escapeHtml(item.action)}</span></li>\`).join("")}</ol>\`;
}`;

const BUILD_REPORT_SECTIONS = `function buildReportSections(full) {
  const guidance = full.neutralResult?.professionalScope || full.professionalGuidance || full.urgentGuidance
    ? renderReportParagraphs([full.neutralResult?.professionalScope, full.professionalGuidance, full.urgentGuidance])
    : "";
  if (full.neutralResult) {
    const neutral = full.neutralResult;
    const strengths = neutral.strengths?.length ? neutral.strengths : [neutral.strengthsFallback].filter(Boolean);
    const absent = neutral.notStronglySupported?.length ? neutral.notStronglySupported : [neutral.notStronglySupportedFallback].filter(Boolean);
    return [
      { id: "neutral-overview", heading: "ТАНЫ ХАРИУЛТААР ЮУ ХАРАГДАВ?", paragraphs: [renderReportParagraphs([...(neutral.overview || []), ...absent])], visible: true },
      { id: "neutral-strengths", heading: "ОДОО ТАНД ТҮШИГ БОЛОХ ЗҮЙЛС", paragraphs: [renderReportParagraphs(strengths)], visible: strengths.length > 0 },
      { id: "neutral-observation", heading: "НЭГ ЗҮЙЛИЙГ ӨӨРЧЛӨХГҮЙГЭЭР АЖИГЛАХ АРГА", paragraphs: [renderNeutralActionPlan(full.neutralActionPlan)], visible: Boolean(full.neutralActionPlan) },
      { id: "recovery", heading: "ТӨЛӨВЛӨГӨӨ АЛДАГДСАН ҮЕД ХЭРХЭН ҮРГЭЛЖЛҮҮЛЭХ ВЭ?", paragraphs: [renderRecoveryPlan(full.recoveryPlan)], visible: Boolean(full.recoveryPlan) },
      { id: "guidance", heading: "ХЭЗЭЭ МЭРГЭЖЛИЙН ХҮНТЭЙ ЗӨВЛӨЛДӨХ ВЭ?", paragraphs: [guidance], visible: Boolean(guidance) }
    ];
  }
  const patterns = renderPatternArticles(full);
  const interactions = (full.interactionSummary || []).map(item => \`<p>\${escapeHtml(item.explanation)}</p>\`).join("");
  const nonPatternContexts = (full.contextualFactors || []).filter(item => !item.isPattern).map(item => \`<article><h3>\${escapeHtml(item.title)}</h3>\${renderReportParagraphs([item.summary || item.explanation])}</article>\`).join("");
  const triggerContexts = (full.managementModules || []).map(module => {
    const observe = module.fields?.find(field => field.key === "observe")?.body;
    return observe ? \`<article><h3>\${escapeHtml(module.title)}</h3><p>\${escapeHtml(observe)}</p></article>\` : "";
  }).join("");
  const previous = full.previousAttemptAnalysis ? \`<article><h3>Өмнөх оролдлогын нөхцөл</h3>\${renderReportParagraphs(full.previousAttemptAnalysis.paragraphs || [full.previousAttemptAnalysis.summary, full.previousAttemptAnalysis.interpretation])}</article>\` : "";
  return [
    { id: "overview", heading: "ТАНЫ ҮР ДҮНГИЙН ТОЙМ", paragraphs: [renderResultOverview(full)], visible: true },
    { id: "patterns", heading: "ТАНД НӨЛӨӨЛЖ БУЙ ХЭВ МАЯГУУД", paragraphs: [patterns], visible: Boolean(patterns) },
    { id: "interactions", heading: "ХЭВ МАЯГУУДЫН УЯЛДАА", paragraphs: [interactions], visible: Boolean(interactions && (full.managementModules || []).length >= 2) },
    { id: "context", heading: "ЯМАР ҮЕД ИЛҮҮ ХҮЧТЭЙ БОЛДОГ ВЭ?", paragraphs: [\`\${triggerContexts}\${nonPatternContexts}\${previous}\`], visible: Boolean(triggerContexts || nonPatternContexts || previous) },
    { id: "management", heading: "ХЭВ МАЯГ БҮРИЙН НӨЛӨӨГ ХЭРХЭН УДИРДАХ ВЭ?", paragraphs: [renderManagementModules(full.managementModules)], visible: (full.managementModules || []).length > 0 },
    { id: "combined-management", heading: "ХААНААС ЭХЭЛЖ, ЯМАР ДАРААЛЛААР АЖИЛЛАХ ВЭ?", paragraphs: [renderCombinedPlans(full)], visible: Boolean(full.combinedManagementPlan || (full.additionalInteractionManagementPlans || []).length) },
    { id: "initial-actions", heading: "ЭХЭЛЖ ХЭРЭГЖҮҮЛЭХ 3 АЛХАМ", paragraphs: [renderInitialActions(full)], visible: (full.initialActions || []).length === 3 },
    { id: "recovery", heading: "ТӨЛӨВЛӨГӨӨ АЛДАГДСАН ҮЕД ХЭРХЭН ҮРГЭЛЖЛҮҮЛЭХ ВЭ?", paragraphs: [renderRecoveryPlan(full.recoveryPlan)], visible: Boolean(full.recoveryPlan) },
    { id: "guidance", heading: "ХЭЗЭЭ МЭРГЭЖЛИЙН ХҮНТЭЙ ЗӨВЛӨЛДӨХ ВЭ?", paragraphs: [guidance], visible: Boolean(guidance) }
  ];
}`;

const VALIDATE_REPORT = `function validateReportForActivation(fullReport) {
  const errors = [];
  if (!fullReport || typeof fullReport !== "object") errors.push("report_payload_missing");
  if (fullReport?.version !== REPORT_VERSION) errors.push("report_engine_version_mismatch");
  if (fullReport?.planDecisionPending === true || fullReport?.planAppendices) errors.push("plan_selection_pending");
  const publicPayload = publicReport(fullReport);
  const publicText = JSON.stringify(publicPayload);
  for (const term of PROHIBITED_PUBLIC_TERMS) if (publicText.includes(term)) errors.push(\`prohibited_public_term:\${term}\`);
  if (/\\b(?:Q-[A-Z0-9-]+|S1-[A-Z0-9-]+|MC-[A-Z0-9-]+)\\b/.test(publicText)) errors.push("internal_question_or_signal_id");
  if (/\\b(?:score|threshold)\\b/i.test(publicText)) errors.push("internal_score_or_threshold");
  const plan = fullReport?.prioritizedStartingAction?.plan;
  if (fullReport?.prioritizedStartingAction?.recommendationId === "maintenance_movement_bridge") {
    if (!plan || /\\d|хоног|долоо хоног|минут|дор хаяж/.test(JSON.stringify(plan))) errors.push("numeric_launch_plan");
    for (const field of ["duration", "variable", "fallback", "success"]) if (!String(plan?.[field] || "").trim()) errors.push(\`nonnumeric_plan_missing:\${field}\`);
  }
  const required = fullReport?.neutralResult
    ? [fullReport.neutralResult.overview, fullReport.neutralResult.limits, fullReport.neutralResult.observation, fullReport.neutralActionPlan]
    : [fullReport?.overallPicture, fullReport?.influencingPatterns, fullReport?.additionalPatternActions, fullReport?.prioritizedStartingAction];
  if (required.some(value => value == null || (Array.isArray(value) && value.length === 0))) errors.push("empty_required_section");
  const modules = fullReport?.managementModules || [];
  if (!fullReport?.neutralResult && !modules.length) errors.push("management_modules_missing");
  if (fullReport?.neutralResult && modules.length) errors.push("neutral_must_not_use_pattern_modules");
  for (const [index, module] of modules.entries()) {
    if (!String(module?.title || "").trim()) errors.push(\`management_module_\${index}_missing:title\`);
    if (!String(module?.evidenceNote || "").trim()) errors.push(\`management_module_\${index}_missing:evidenceNote\`);
    const fields = Array.isArray(module?.fields) ? module.fields : [];
    for (const key of ["observe", "trigger", "prepare", "inMoment", "avoidRigidDemand", "professionalHelp"]) {
      const field = fields.find(item => item?.key === key);
      if (!String(field?.label || "").trim() || !String(field?.body || "").trim()) errors.push(\`management_module_\${index}_missing:\${key}\`);
    }
  }
  const supportedPatternCount = (fullReport?.internalEvidenceMap?.patternEvidence || []).filter(item => item.supported).length;
  if (supportedPatternCount && modules.length !== supportedPatternCount) errors.push("supported_pattern_management_coverage");
  const renderedPatternCount = [
    ...(fullReport?.influencingPatterns || []),
    ...(fullReport?.contextualFactors || []).filter(item => item?.isPattern)
  ].reduce((ids, pattern) => ids.add(pattern?.id), new Set()).size;
  if (deliverablePatterns(fullReport).length !== renderedPatternCount) errors.push("counted_pattern_delivery_gap");
  const renderedInteractionCount = (fullReport?.interactionSummary || []).length;
  if (deliverableInteractions(fullReport).length !== renderedInteractionCount) errors.push("counted_interaction_delivery_gap");
  const plans = [fullReport?.combinedManagementPlan, ...(fullReport?.additionalInteractionManagementPlans || [])].filter(Boolean);
  for (const [index, interaction] of plans.entries()) {
    for (const part of [interaction.startWith, interaction.nextStep, interaction.combinedAction]) {
      if (!String(part?.title || "").trim() || !String(part?.body || "").trim()) errors.push(\`combined_plan_\${index}_structured_part_missing\`);
    }
    if (!String(interaction.why || "").trim()) errors.push(\`combined_plan_\${index}_missing:why\`);
  }
  const recovery = fullReport?.recoveryPlan;
  if (!String(recovery?.introduction || "").trim()) errors.push("recovery_plan_missing:introduction");
  if (!Array.isArray(recovery?.steps) || recovery.steps.length < 3) errors.push("recovery_plan_missing:steps");
  else for (const [index, step] of recovery.steps.entries()) {
    if (!String(step?.label || "").trim() || !String(step?.body || "").trim()) errors.push(\`recovery_step_\${index}_missing\`);
  }
  if (!Array.isArray(fullReport?.initialActions) || fullReport.initialActions.length !== 3) errors.push("initial_actions_must_equal_three");
  else for (const [index, action] of fullReport.initialActions.entries()) {
    if (!String(action?.action || "").trim() || !String(action?.patternTitle || "").trim()) errors.push(\`initial_action_\${index}_not_attributed\`);
  }
  if (Object.hasOwn(publicPayload, "difficultMomentPlan") || Object.hasOwn(publicPayload, "fallbackPlan")) errors.push("legacy_recovery_shape_exposed");
  const sentences = substantiveSentences(publicPayload);
  if (sentences.length !== new Set(sentences).size) errors.push("duplicate_substantive_paragraph");
  return { valid: errors.length === 0, errors, publicPayload };
}`;

function patchReport(source) {
  let output = source.replace('const REPORT_VERSION = "jingeehas-case-formulation-v6-actionable-management";', 'const REPORT_VERSION = "jingeehas-case-formulation-v7-semantic-builder";');
  output = replaceNamedFunction(output, "managementModule", MANAGEMENT_MODULE);
  output = replaceNamedFunction(output, "combinedManagementPlan", COMBINED_MANAGEMENT_PLAN);
  output = replaceNamedFunction(output, "neutralActionablePlan", NEUTRAL_ACTIONABLE_PLAN);
  output = replaceNamedFunction(output, "difficultMomentPlan", RECOVERY_PLAN);
  output = replaceRequired(output,
    '  const neutralPlan = managementModules.length ? null : neutralActionablePlan(neutral);\n  const resolvedManagementModules = neutralPlan ? [neutralPlan.managementModule] : managementModules;\n  const resolvedFallbackPlan = neutralPlan ? neutralPlan.fallbackPlan : planFallback;\n  const difficultPlan = difficultMomentPlan(resolvedManagementModules, combinedPlan, resolvedFallbackPlan);',
    '  const neutralPlan = managementModules.length ? null : neutralActionablePlan(neutral);\n  const resolvedManagementModules = neutralPlan ? [] : managementModules;\n  const resolvedRecoveryPlan = neutralPlan?.recoveryPlan || recoveryPlan(managementModules, combinedPlan, planFallback);',
    "buildFullReport semantic plan resolution"
  );
  output = replaceRequired(output,
    '    managementModules: resolvedManagementModules,\n    combinedManagementPlan: combinedPlan,\n    additionalInteractionManagementPlans: interactionPlans.slice(1),\n    difficultMomentPlan: difficultPlan,\n    initialActions: neutralPlan ? neutralPlan.firstActions : initialActions,\n    fallbackPlan: resolvedFallbackPlan,',
    '    managementModules: resolvedManagementModules,\n    combinedManagementPlan: combinedPlan,\n    additionalInteractionManagementPlans: interactionPlans.slice(1),\n    neutralActionPlan: neutralPlan?.neutralActionPlan || null,\n    recoveryPlan: resolvedRecoveryPlan,\n    initialActions: neutralPlan ? neutralPlan.firstActions : initialActions,',
    "buildFullReport semantic public shape"
  );
  return output;
}

function patchApp(source) {
  let output = replaceNamedFunction(source, "renderManagementModules", RENDER_MANAGEMENT_MODULES);
  output = replaceNamedFunction(output, "renderCombinedPlan", RENDER_COMBINED_PLAN);
  output = replaceNamedFunction(output, "renderDifficultMomentPlan", RENDER_RECOVERY_PLAN);
  output = replaceNamedFunction(output, "renderInitialActions", RENDER_INITIAL_ACTIONS);
  output = replaceNamedFunction(output, "buildReportSections", BUILD_REPORT_SECTIONS);
  return output;
}

export function applyReportBuilderSemanticV1(root) {
  const reportPath = path.join(root, "netlify", "functions", "_lib", "report.js");
  const validationPath = path.join(root, "netlify", "functions", "_lib", "report-validation.js");
  if (!fs.existsSync(reportPath) || !fs.existsSync(validationPath)) throw new Error("Semantic report-builder source is missing");
  fs.writeFileSync(reportPath, patchReport(fs.readFileSync(reportPath, "utf8")));
  fs.writeFileSync(validationPath, replaceNamedFunction(fs.readFileSync(validationPath, "utf8"), "validateReportForActivation", VALIDATE_REPORT));
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (fs.existsSync(appPath)) fs.writeFileSync(appPath, patchApp(fs.readFileSync(appPath, "utf8")));
  }
}