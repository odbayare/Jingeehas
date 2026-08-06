import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Semantic quality function missing: ${name}`);
  const braceStart = source.indexOf("{", start + marker.length);
  if (braceStart < 0) throw new Error(`Semantic quality body missing: ${name}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) { if (char === "\n") lineComment = false; continue; }
    if (blockComment) { if (char === "*" && next === "/") { blockComment = false; index += 1; } continue; }
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
    if (char === "}" && --depth === 0) return `${source.slice(0, start)}${replacement}${source.slice(index + 1)}`;
  }
  throw new Error(`Semantic quality function end missing: ${name}`);
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
  const triggerByPattern = {
    emotional_regulation: "Идэх хүсэл нэмэгдэхийн өмнө байсан мэдрэмж, үйл явдал эсвэл орчноос аль нь давтагдаж байгааг тэмдэглээрэй.",
    environmental_cues: "Орчны дохио нөлөөлөхийн өмнөх газар, цаг болон нөхцөлөөс аль нь давтагдаж байгааг тэмдэглээрэй.",
    irregular_meals_late_hunger: "Хоолны зай уртсахын өмнөх цагийн хуваарь, ажил эсвэл бэлтгэлээс аль нь давтагдаж байгааг тэмдэглээрэй.",
    hunger_satiety: "Өлсөх эсвэл цадах дохиогоо оройтож анзаарахын өмнөх хоол, хурд болон нөхцөлөөс аль нь давтагдаж байгааг тэмдэглээрэй.",
    sleep_fatigue: "Ядаргаа нэмэгдэхийн өмнөх нойрны хугацаа, ажлын ачаалал болон өдөр тутмын нөхцөлөөс аль нь давтагдаж байгааг тэмдэглээрэй.",
    restrictive_rebound: "Хатуу дүрмээ бүхэлд нь орхих бодол төрөхийн өмнөх сонголт, мэдрэмж болон нөхцөлийг тэмдэглээрэй.",
    plan_daily_life_mismatch: "Төлөвлөгөө багтахаа болихын өмнөх цаг, зардал, бэлтгэл эсвэл орчны нөхцөлийг тэмдэглээрэй.",
    previous_attempt_sustainability: "Үндсэн арга боломжгүй болохын өмнөх бодит нөхцөл болон орлуулах хувилбар байсан эсэхийг тэмдэглээрэй."
  };
  return {
    patternId: candidate.id,
    title: pattern.title,
    fields: [
      { key: "observe", label: "Юуг анзаарах вэ?", body: observe },
      { key: "trigger", label: "Юунаас өдөөгдөж байгааг хэрхэн таних вэ?", body: triggerByPattern[candidate.id] || "Энэ нөхцөл үүсэхийн өмнөх бодит үйл явдлаас аль нь давтагдаж байгааг тэмдэглээрэй." },
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
  const startBody = {
    irregular_meals_late_hunger: "Хоолны зай хамгийн их уртсах нэг өдрийг сонгож ажиглаарай.",
    hunger_satiety: "Өлсөх, цадах мэдрэмжээ анзаарахад хамгийн хэцүү нэг хоолыг сонгож ажиглаарай.",
    emotional_regulation: "Идэх хүсэл нэмэгддэг нэг сэтгэл хөдлөлийн мөчийг сонгож ажиглаарай.",
    environmental_cues: "Идэх хүсэл төрүүлдэг нэг орчны дохиог сонгож ажиглаарай.",
    sleep_fatigue: "Ядаргаа нэмэгддэг нэг давтагддаг мөчийг сонгож ажиглаарай.",
    restrictive_rebound: "Хамгийн их дарамт үүсгэдэг нэг хатуу дүрмийг сонгож ажиглаарай.",
    plan_daily_life_mismatch: "Төлөвлөгөө хамгийн их багтдаггүй нэг бодит нөхцөлийг сонгож ажиглаарай.",
    previous_attempt_sustainability: "Өмнөх арга боломжгүй болсон нэг гол нөхцөлийг сонгож ажиглаарай."
  };
  const nextBody = {
    irregular_meals_late_hunger: "Дараагийн алхамд барьж болох нэг тогтвортой хоолны цагийг сонгоорой.",
    hunger_satiety: "Дараагийн алхамд нэг хоолны дунд цадалтын мэдрэмжээ шалгах сануулга бэлдээрэй.",
    emotional_regulation: "Дараагийн алхамд идэхийн өмнө хийх нэг богино үйлдлийг сонгоорой.",
    environmental_cues: "Дараагийн алхамд нэг орчны дохионы хүртээмжийг багасгах аргыг сонгоорой.",
    sleep_fatigue: "Дараагийн алхамд ядарсан үед хэрэглэх бэлтгэл бага шаарддаг хувилбар бэлдээрэй.",
    restrictive_rebound: "Дараагийн алхамд нэг хатуу дүрмийг өдөр тутам хэрэгжих уян хувилбараар солиорой.",
    plan_daily_life_mismatch: "Дараагийн алхамд завгүй өдөр ч багтах хамгийн хялбар хувилбарыг сонгоорой.",
    previous_attempt_sustainability: "Дараагийн алхамд үндсэн арга боломжгүй үед хэрэглэх орлуулах хувилбар бэлдээрэй."
  };
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
    startWith: { title: primary.title, body: startBody[primary.patternId] || "Эхний нөлөө илрэх нэг мөчийг сонгож ажиглаарай." },
    why: reasonByPattern[primary.patternId] || "Эхний нөлөөг богино хугацаанд шууд ажиглаж, нэг жижиг өөрчлөлтөөр шалгаж болох тул үүнээс эхэлнэ.",
    nextStep: { title: secondary.title, body: nextBody[secondary.patternId] || "Дараагийн нөлөөнд тохирох нэг бэлтгэсэн үйлдлийг сонгоорой." },
    combinedAction: { title: "Хоёр хэв маягийг зэрэг удирдах арга", body: combinedManagementAction(primary.patternId, secondary.patternId) }
  };
}`;

const RECOVERY_PLAN = `function recoveryPlan(modules, combinedPlan, planFallback) {
  const primary = Array.isArray(modules) ? modules[0] : null;
  if (!primary || !planFallback) return null;
  return {
    introduction: planFallback.introduction,
    steps: [
      { key: "notice", label: "Юу болж байгааг анзаарах", body: "Төлөвлөгөө алдагдсан мөчид ямар нөхцөл давтагдсаныг нэг өгүүлбэрээр тэмдэглээрэй." },
      { key: "inMoment", label: "Тухайн мөчид хийх нэг үйлдэл", body: "Нөхцөл хүндрэхэд урьдчилан сонгосон хамгийн хялбар үйлдлээ хэрэглээрэй." },
      { key: "prepare", label: "Урьдчилан бэлдэх зүйл", body: "Ийм мөчид ашиглах нэг богино хувилбарыг урьдчилан бэлдээрэй." },
      { key: "resume", label: "Дараагийн боломжит мөчөөс үргэлжлүүлэх", body: planFallback.resume }
    ],
    rules: [planFallback.softenRule, planFallback.recheckTrigger, planFallback.fitDailyLife].filter(Boolean)
  };
}`;

const RENDER_MANAGEMENT_MODULES = `function renderManagementModules(modules = []) {
  if (!modules.length) return "";
  const intro = '<p class="management-section-intro">Доорх зөвлөмжийг дээр тайлбарласан нөхцөлтэйгээ уялдуулан хэрэглээрэй.</p>';
  const articles = modules.map(module => \`<article class="management-module"><h3>\${escapeHtml(module.title)}</h3>
    <dl>\${(module.fields || []).map(field => \`<dt>\${escapeHtml(field.label)}</dt><dd>\${escapeHtml(field.body)}</dd>\`).join("")}</dl></article>\`).join("");
  return \`\${intro}\${articles}\`;
}`;

const SUBSTANTIVE_SENTENCES = `function substantiveSentences(value) {
  const metadataKeys = new Set(["id", "key", "label", "title", "patternId", "patternIds", "order", "version", "schemaVersion", "recommendationId", "questionnaireVersion"]);
  const sentences = [];
  function visit(current, key = "") {
    if (current == null || metadataKeys.has(key)) return;
    if (typeof current === "string") {
      for (const item of current.split(/[.!?]\\s*/)) {
        const sentence = item.replace(/[{}\\[\\]"\\\\]/g, "").trim();
        if (sentence.length > 45) sentences.push(sentence);
      }
      return;
    }
    if (Array.isArray(current)) {
      for (const item of current) visit(item, key);
      return;
    }
    if (typeof current === "object") {
      for (const [childKey, childValue] of Object.entries(current)) visit(childValue, childKey);
    }
  }
  visit(value);
  return sentences;
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

export function applyReportBuilderSemanticV1Quality(root) {
  const reportPath = path.join(root, "netlify", "functions", "_lib", "report.js");
  const validationPath = path.join(root, "netlify", "functions", "_lib", "report-validation.js");
  if (!fs.existsSync(reportPath) || !fs.existsSync(validationPath)) throw new Error("Semantic quality sources are missing");
  let report = fs.readFileSync(reportPath, "utf8");
  report = replaceNamedFunction(report, "managementModule", MANAGEMENT_MODULE);
  report = replaceNamedFunction(report, "combinedManagementPlan", COMBINED_MANAGEMENT_PLAN);
  report = replaceNamedFunction(report, "recoveryPlan", RECOVERY_PLAN);
  fs.writeFileSync(reportPath, report);

  let validation = fs.readFileSync(validationPath, "utf8");
  validation = replaceNamedFunction(validation, "substantiveSentences", SUBSTANTIVE_SENTENCES);
  validation = replaceNamedFunction(validation, "validateReportForActivation", VALIDATE_REPORT);
  fs.writeFileSync(validationPath, validation);

  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    fs.writeFileSync(appPath, replaceNamedFunction(fs.readFileSync(appPath, "utf8"), "renderManagementModules", RENDER_MANAGEMENT_MODULES));
  }
}