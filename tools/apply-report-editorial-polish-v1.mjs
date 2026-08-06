import fs from "node:fs";
import path from "node:path";

const V7 = "jingeehas-case-formulation-v7-semantic-builder";
const V8 = "jingeehas-case-formulation-v8-editorial-polish";

function replaceNamedFunction(source, name, replacement) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Editorial function missing: ${name}`);
  const braceStart = source.indexOf("{", start + marker.length);
  if (braceStart < 0) throw new Error(`Editorial function body missing: ${name}`);
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
  throw new Error(`Editorial function end missing: ${name}`);
}

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Editorial anchor missing: ${label}`);
  return source.replace(from, to);
}

function replaceAll(source, replacements) {
  let output = source;
  for (const [from, to] of replacements) output = output.split(from).join(to);
  return output;
}

const TERMINOLOGY = Object.freeze([
  ["хамгаалах хүчин зүйл", "түшиг болох давуу тал"],
  ["Хамгаалах хүчин зүйл", "Түшиг болох давуу тал"],
  ["хэрэгжүүлэх босго", "хэрэгжүүлэхэд шаардагдах ачаалал"],
  ["суурь зураглал", "эхлэх цэг"],
  ["нөлөөлөгч нөхцөл", "нөлөөлөх нөхцөл"],
  ["өөрчлөлтийг тууштай барих", "өөрчлөлтөө удаан үргэлжлүүлэх"],
  ["өдөр тутам хадгалж болох", "өдөр тутам хэрэгжүүлж болох"],
  ["орчны хоолны дохио", "хоолтой холбоотой орчны нөлөө"]
]);

const POLITE_REGISTER = Object.freeze([
  ["тэмдэглэ.", "тэмдэглээрэй."],
  ["сонго.", "сонгоорой."],
  ["бич.", "бичээрэй."],
  ["бэлд.", "бэлдээрэй."],
  ["шалга.", "шалгаарай."],
  ["үргэлжлүүл.", "үргэлжлүүлээрэй."],
  ["өөрчил.", "өөрчлөөрэй."],
  ["багасга.", "багасгаарай."],
  ["тогтоо.", "тогтоогоорой."],
  ["нэрлэ.", "нэрлээрэй."],
  ["соль.", "солиорой."],
  ["хий.", "хийгээрэй."],
  ["гүй бай.", "гүй байгаарай."]
]);

const NATURAL_COPY = Object.freeze([
  ["Стресс нэмэгдэх үед хоол нь түр тайвшрах, амрах эсвэл анхаарлаа өөр тийш шилжүүлэх арга болж мэднэ.", "Стресс нэмэгдэхэд хоол идэх нь түр тайвшрах эсвэл бодлоо сарниулах арга мэт санагдаж болно."],
  ["Хэрэв хоол тухайн мөчид түр амсхийх мэт мэдрэмж өгдөг бол стрессийн шалтгаан хэвээр үлдэхэд идэх хүсэл дахин төрж болно.", "Стрессийн шалтгаан хэвээр байвал түр тайвширсны дараа идэх хүсэл дахин төрж болно."],
  ["Энэ нь онош биш бөгөөд сэтгэл хөдлөл бүр хооллолтыг өөрчилдөг гэсэн үг биш.", "Энэ нь онош биш; стресс бүр хооллолтод нөлөөлнө гэсэн үг биш."],
  ["Өлсөөгүй үед орчны зарим дохио идэх хүсэл төрүүлж болно.", "Өлсөөгүй үед харагдах байдал, үнэр, аппын мэдэгдэл зэрэг орчны нөлөө идэх хүсэл төрүүлж болно."],
  ["Орчин хоолыг дахин дахин сануулахад төлөвлөөгүй үед идэх нь нэмэгдэж, хоолны хэмнэл алдагдахад нөлөөлдөг.", "Ийм нөлөө давтагдвал төлөвлөөгүй идэх нь нэмэгдэж, хоолны хэмнэл алдагдаж болно."],
  ["Орчны дохио дангаараа бүх сонголтыг тайлбарлахгүй.", "Орчин дангаараа таны бүх сонголтыг тайлбарлахгүй."],
  ["Хоолны зай уртсах эсвэл тогтмол бус болох үед өлсөлтийн дохио хэт хүчтэй болсны дараа анзаарагддаг.", "Хоолны зай уртрахад өлсөлт хэт хүчтэй болсны дараа л анзаарагдаж болно."],
  ["Орой хэт өлсөхөд идэх хэмжээ, хурд, сонголтоо тайван тохируулахад хэцүү болдог.", "Хэт өлссөн үед идэх хэмжээ, хурд, сонголтоо тайван тохируулахад хэцүү болдог."],
  ["Өдөр бүр ижил биш тул яг аль цагт хүндрэл үүсдгийг ажиглах хэрэгтэй.", "Энэ байдал өдөр бүр ижил биш байж болно."],
  ["Нойр дутуу эсвэл тасалдсан өдөр бодож төлөвлөх тэнхээ оройдоо багасдаг.", "Нойр дутуу эсвэл тасалдсан өдөр төлөвлөж, сонголт хийх тэнхээ багасч болно."],
  ["Ядарсан үед хоол бэлтгэх, сонголтоо урьдчилан бодох тэнхээ багасч, тогтвортой төлөвлөгөө барихад саад болдог.", "Ядарсан үед хоол бэлтгэх, урьдчилан сонгох нь хэцүү болж, төлөвлөгөөгөө тогтвортой үргэлжлүүлэхэд саад болж болно."],
  ["Өдөр тутмын бодит нөхцөлтэй нийцэхгүй төлөвлөгөө сайн санаатай байсан ч тогтмол хэрэгжихгүй үлддэг.", "Өдөр тутмын бодит нөхцөлтэй нийцэхгүй төлөвлөгөөг тогтмол хэрэгжүүлэхэд хэцүү байдаг."],
  ["Хэрэгжүүлэх босго өндөр байх тусам бодит нөхцөл өөрчлөгдөхөд төлөвлөгөөнөөс гарах нь амархан болдог.", "Хэрэгжүүлэхэд шаардагдах ачаалал их байх тусам нөхцөл өөрчлөгдөхөд төлөвлөгөөг үргэлжлүүлэхэд хэцүү болдог."],
  ["Энэ тайланг эцсийн онош гэж бус, дараагийн ажиглалтаа хаанаас эхлэхийг заах суурь зураглал болгон ашиглана.", "Энэ тайланг эцсийн дүгнэлт бус, дараагийн ажиглалтаа хаанаас эхлэхийг заах эхлэх цэг болгон ашиглаарай."]
]);

const MANAGEMENT_MODULE = `function managementModule(candidate, pattern, facts) {
  const copy = PATTERN_MANAGEMENT_MODULES[candidate.id];
  if (!copy || !pattern) return null;
  const selectedCues = candidate.id === "environmental_cues" ? facts.environmentalCues || [] : [];
  const cueLabel = selectedCues.length
    ? naturalList(selectedCues.map((cue, index) => index === 0 ? cue : \`\${cue.charAt(0).toLowerCase()}\${cue.slice(1)}\`))
    : null;
  const observe = cueLabel ? \`\${cueLabel} үед өлсөөгүй ч идэх хүсэл төрж байгаа эсэхийг анзаараарай.\` : copy.observe;
  const prepare = candidate.id === "environmental_cues" && selectedCues.length ? environmentalCueCopy(facts).strategy : copy.prepare;
  const triggerByPattern = {
    emotional_regulation: "Идэх хүсэл нэмэгдэхийн өмнөх мэдрэмж, үйл явдал эсвэл орчноос аль нь давтагдаж байгааг тэмдэглээрэй.",
    environmental_cues: "Идэх хүсэл төрөхийн өмнөх газар, цаг, харагдах зүйлээс аль нь давтагдаж байгааг тэмдэглээрэй.",
    irregular_meals_late_hunger: "Хоолны зай уртрахын өмнөх хуваарь, ажил эсвэл бэлтгэлээс аль нь давтагдаж байгааг тэмдэглээрэй.",
    hunger_satiety: "Өлсөх, цадах мэдрэмжээ оройтож анзаарах үед хоол, идэх хурд, орчноос аль нь давтагдаж байгааг тэмдэглээрэй.",
    sleep_fatigue: "Ядаргаа нэмэгдэхийн өмнөх нойр, ажлын ачаалал, хуваариас аль нь давтагдаж байгааг тэмдэглээрэй.",
    restrictive_rebound: "Хатуу дүрмээ бүхэлд нь орхих бодол төрөхийн өмнөх сонголт, мэдрэмжээс аль нь давтагдаж байгааг тэмдэглээрэй.",
    plan_daily_life_mismatch: "Төлөвлөгөө багтахаа болих үед цаг, зардал, бэлтгэл, орчноос аль нь саад болсныг тэмдэглээрэй.",
    previous_attempt_sustainability: "Үндсэн арга боломжгүй болсон нөхцөл болон орлуулах хувилбар байсан эсэхийг тэмдэглээрэй."
  };
  return {
    patternId: candidate.id,
    title: pattern.title,
    fields: [
      { key: "observe", label: "Юуг анзаарах вэ?", body: observe },
      { key: "trigger", label: "Ямар нөхцөл давтагдаж байна вэ?", body: triggerByPattern[candidate.id] || "Энэ хүндрэл үүсэхийн өмнөх нөхцөлөөс аль нь давтагдаж байгааг тэмдэглээрэй." },
      { key: "prepare", label: "Урьдчилан юу бэлдэх вэ?", body: prepare },
      { key: "inMoment", label: "Тухайн үед юу хийж болох вэ?", body: copy.inMoment },
      { key: "avoidRigidDemand", label: "Юуг хэт хатуу шаардахгүй байх вэ?", body: copy.avoidRigidDemand },
      { key: "professionalHelp", label: "Хэзээ мэргэжлийн хүнтэй зөвлөлдөх вэ?", body: copy.professionalHelp }
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
    environmental_cues: "Идэх хүсэл төрүүлдэг нэг орчны нөлөөг сонгож ажиглаарай.",
    sleep_fatigue: "Ядаргаа нэмэгддэг нэг давтагддаг мөчийг сонгож ажиглаарай.",
    restrictive_rebound: "Хамгийн их дарамт үүсгэдэг нэг хатуу дүрмийг сонгож ажиглаарай.",
    plan_daily_life_mismatch: "Төлөвлөгөө багтдаггүй нэг бодит нөхцөлийг сонгож ажиглаарай.",
    previous_attempt_sustainability: "Өмнөх арга боломжгүй болсон нэг гол нөхцөлийг сонгож ажиглаарай."
  };
  const nextBody = {
    irregular_meals_late_hunger: "Дараагийн алхамд барьж болох нэг тогтвортой хоолны цагийг сонгоорой.",
    hunger_satiety: "Дараагийн алхамд хоолны дунд цадалтын мэдрэмжээ шалгах нэг сануулга бэлдээрэй.",
    emotional_regulation: "Дараагийн алхамд идэхийн өмнө хийх нэг богино үйлдлийг сонгоорой.",
    environmental_cues: "Дараагийн алхамд нэг орчны нөлөөг багасгах аргыг сонгоорой.",
    sleep_fatigue: "Дараагийн алхамд ядарсан үед хэрэглэх бэлтгэл багатай хувилбар бэлдээрэй.",
    restrictive_rebound: "Дараагийн алхамд нэг хатуу дүрмийг хэрэгжихүйц уян хувилбараар солиорой.",
    plan_daily_life_mismatch: "Дараагийн алхамд завгүй өдөр ч багтах хамгийн хялбар хувилбарыг сонгоорой.",
    previous_attempt_sustainability: "Дараагийн алхамд үндсэн арга боломжгүй үед хэрэглэх хувилбар бэлдээрэй."
  };
  const reasonByPattern = {
    irregular_meals_late_hunger: "Хоолны зайг нэг өдрийн дотор ажиглаж, нэг тогтвортой цагаар шалгах боломжтой тул үүнээс эхэлнэ.",
    hunger_satiety: "Өлсөх, цадах мэдрэмжийг нэг хоолны үеэр ажиглаж болох тул үүнээс эхэлнэ.",
    emotional_regulation: "Идэх хүсэл нэмэгдэх мөчийг өдөр тутмын нөхцөлд шууд ажиглаж болох тул үүнээс эхэлнэ.",
    environmental_cues: "Нэг орчны нөлөөг өөрчлөөд үр дүнг нь тусад нь ажиглаж болох тул үүнээс эхэлнэ.",
    sleep_fatigue: "Ядарсан үед хэрэглэх хялбар хувилбарыг шууд туршиж болох тул үүнээс эхэлнэ.",
    restrictive_rebound: "Нэг хатуу дүрмийг уян болгоод үр дүнг нь тусад нь ажиглаж болох тул үүнээс эхэлнэ.",
    plan_daily_life_mismatch: "Өдөр тутамд багтах нэг хувилбарыг шууд туршиж болох тул үүнээс эхэлнэ.",
    previous_attempt_sustainability: "Үндсэн арга боломжгүй үед хэрэглэх хувилбарыг шууд бэлдэж болох тул үүнээс эхэлнэ."
  };
  return {
    patternIds: [primary.patternId, secondary.patternId],
    startWith: { title: primary.title, body: startBody[primary.patternId] || "Эхний нөлөө илрэх нэг мөчийг сонгож ажиглаарай." },
    why: reasonByPattern[primary.patternId] || "Эхний нөлөөг нэг жижиг өөрчлөлтөөр шалгаж болох тул үүнээс эхэлнэ.",
    nextStep: { title: secondary.title, body: nextBody[secondary.patternId] || "Дараагийн нөлөөнд тохирох нэг бэлтгэсэн үйлдлийг сонгоорой." },
    combinedAction: { title: "Хоёр нөлөө давхцвал", body: combinedManagementAction(primary.patternId, secondary.patternId) }
  };
}`;

const RENDER_PATTERN_ARTICLES = `function renderPatternArticles(full) {
  const major = full.influencingPatterns || [];
  const editorialV8 = full?.version === "${V8}";
  const majorArticles = major.map(pattern => {
    const paragraphs = editorialV8
      ? (Array.isArray(pattern.paragraphs) && pattern.paragraphs.length
        ? pattern.paragraphs
        : [pattern.evidenceSummary, pattern.effectOnWeightLoss, pattern.uncertainty])
      : (pattern.paragraphs || (major.length >= 3
        ? [pattern.evidenceSummary, pattern.effectOnWeightLoss, pattern.uncertainty]
        : [pattern.explanation, pattern.evidenceSummary, pattern.effectOnWeightLoss, pattern.uncertainty]));
    return \`<article class="report-pattern"><h3>\${escapeHtml(pattern.title)}</h3>\${renderReportParagraphs(paragraphs)}</article>\`;
  });
  const contextualArticles = (full.contextualFactors || []).filter(item => item.isPattern).map(item => {
    const paragraphs = editorialV8
      ? [item.evidenceSummary, item.effectOnWeightLoss, item.uncertainty]
      : [item.explanation, item.evidenceSummary, item.effectOnWeightLoss, item.uncertainty];
    return \`<article class="report-pattern"><h3>\${escapeHtml(item.title)}</h3>\${renderReportParagraphs(paragraphs)}</article>\`;
  });
  return [...majorArticles, ...contextualArticles].join("");
}`;

const BUILD_SEMANTIC_SECTIONS = `function buildSemanticReportSectionsV7(full) {
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
      { id: "neutral-limits", heading: "ЭНЭ ТЕСТЭЭР ЮУГ ДҮГНЭЖ БОЛОХГҮЙ ВЭ?", paragraphs: [renderReportParagraphs(neutral.limits || [])], visible: (neutral.limits || []).length > 0 },
      { id: "neutral-observation", heading: "НЭГ ЗҮЙЛИЙГ ӨӨРЧЛӨХГҮЙГЭЭР АЖИГЛАХ АРГА", paragraphs: [renderNeutralActionPlan(full.neutralActionPlan)], visible: Boolean(full.neutralActionPlan) },
      { id: "recovery", heading: "ТӨЛӨВЛӨГӨӨ АЛДАГДСАН ҮЕД ХЭРХЭН ҮРГЭЛЖЛҮҮЛЭХ ВЭ?", paragraphs: [renderRecoveryPlan(full.recoveryPlan)], visible: Boolean(full.recoveryPlan) },
      { id: "guidance", heading: "ХЭЗЭЭ МЭРГЭЖЛИЙН ХҮНТЭЙ ЗӨВЛӨЛДӨХ ВЭ?", paragraphs: [guidance], visible: Boolean(guidance) }
    ];
  }
  const patterns = renderPatternArticles(full);
  const interactions = (full.interactionSummary || []).map(item => \`<p>\${escapeHtml(item.explanation)}</p>\`).join("");
  const nonPatternContexts = (full.contextualFactors || []).filter(item => !item.isPattern).map(item => \`<article><h3>\${escapeHtml(item.title)}</h3>\${renderReportParagraphs([item.summary || item.explanation])}</article>\`).join("");
  const previous = full.previousAttemptAnalysis ? \`<article><h3>Өмнөх оролдлогын нөхцөл</h3>\${renderReportParagraphs(full.previousAttemptAnalysis.paragraphs || [full.previousAttemptAnalysis.summary, full.previousAttemptAnalysis.interpretation])}</article>\` : "";
  const editorialV8 = full?.version === "${V8}";
  const triggerContexts = editorialV8 ? "" : (full.managementModules || []).map(module => {
    const observe = module.fields?.find(field => field.key === "observe")?.body;
    return observe ? \`<article><h3>\${escapeHtml(module.title)}</h3><p>\${escapeHtml(observe)}</p></article>\` : "";
  }).join("");
  const contextHtml = \`\${triggerContexts}\${nonPatternContexts}\${previous}\`;
  return [
    { id: "overview", heading: "ТАНЫ ҮР ДҮНГИЙН ТОЙМ", paragraphs: [renderResultOverview(full)], visible: true },
    { id: "patterns", heading: "ТАНД НӨЛӨӨЛЖ БУЙ ХЭВ МАЯГУУД", paragraphs: [patterns], visible: Boolean(patterns) },
    { id: "interactions", heading: "ХЭВ МАЯГУУДЫН УЯЛДАА", paragraphs: [interactions], visible: Boolean(interactions && (full.managementModules || []).length >= 2) },
    { id: "context", heading: "ЯМАР ҮЕД ИЛҮҮ ХҮЧТЭЙ БОЛДОГ ВЭ?", paragraphs: [contextHtml], visible: Boolean(contextHtml) },
    { id: "management", heading: editorialV8 ? "ХЭВ МАЯГ БҮРТ ЯАЖ ХАНДАХ ВЭ?" : "ХЭВ МАЯГ БҮРИЙН НӨЛӨӨГ ХЭРХЭН УДИРДАХ ВЭ?", paragraphs: [renderManagementModules(full.managementModules)], visible: (full.managementModules || []).length > 0 },
    { id: "combined-management", heading: "ХААНААС ЭХЭЛЖ, ЯМАР ДАРААЛЛААР АЖИЛЛАХ ВЭ?", paragraphs: [renderCombinedPlans(full)], visible: Boolean(full.combinedManagementPlan || (full.additionalInteractionManagementPlans || []).length) },
    { id: "initial-actions", heading: "ЭХЭЛЖ ХЭРЭГЖҮҮЛЭХ 3 АЛХАМ", paragraphs: [renderInitialActions(full)], visible: (full.initialActions || []).length === 3 },
    { id: "recovery", heading: "ТӨЛӨВЛӨГӨӨ АЛДАГДСАН ҮЕД ХЭРХЭН ҮРГЭЛЖЛҮҮЛЭХ ВЭ?", paragraphs: [renderRecoveryPlan(full.recoveryPlan)], visible: Boolean(full.recoveryPlan) },
    { id: "guidance", heading: "ХЭЗЭЭ МЭРГЭЖЛИЙН ХҮНТЭЙ ЗӨВЛӨЛДӨХ ВЭ?", paragraphs: [guidance], visible: Boolean(guidance) }
  ];
}`;

function patchReportCopy(source) {
  return replaceAll(replaceAll(source, NATURAL_COPY), [...TERMINOLOGY, ...POLITE_REGISTER]);
}

function patchReport(source) {
  let output = replaceRequired(
    source,
    `const REPORT_VERSION = "${V7}";`,
    `const REPORT_VERSION = "${V8}";`,
    "editorial report version"
  );
  output = replaceNamedFunction(output, "managementModule", MANAGEMENT_MODULE);
  output = replaceNamedFunction(output, "combinedManagementPlan", COMBINED_MANAGEMENT_PLAN);
  output = replaceAll(output, [...TERMINOLOGY, ...POLITE_REGISTER]);
  output = replaceRequired(
    output,
    `const semanticV7 = safe.version === "${V7}";`,
    `const semanticV7 = ["${V7}", "${V8}"].includes(safe.version);`,
    "semantic public projection versions"
  );
  return output;
}

function patchApp(source) {
  let output = replaceNamedFunction(source, "renderPatternArticles", RENDER_PATTERN_ARTICLES);
  output = replaceNamedFunction(output, "buildSemanticReportSectionsV7", BUILD_SEMANTIC_SECTIONS);
  output = replaceRequired(
    output,
    `const semanticV7 = full?.version === "${V7}" || Boolean(full?.neutralActionPlan || full?.recoveryPlan);`,
    `const semanticV7 = ["${V7}", "${V8}"].includes(full?.version) || Boolean(full?.neutralActionPlan || full?.recoveryPlan);`,
    "semantic renderer versions"
  );
  return output;
}

export function applyReportEditorialPolishV1(root) {
  const reportCopyPath = path.join(root, "netlify", "functions", "_lib", "report-copy.js");
  const reportPath = path.join(root, "netlify", "functions", "_lib", "report.js");
  if (!fs.existsSync(reportCopyPath) || !fs.existsSync(reportPath)) throw new Error("Editorial report sources are missing");
  fs.writeFileSync(reportCopyPath, patchReportCopy(fs.readFileSync(reportCopyPath, "utf8")));
  fs.writeFileSync(reportPath, patchReport(fs.readFileSync(reportPath, "utf8")));
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (fs.existsSync(appPath)) fs.writeFileSync(appPath, patchApp(fs.readFileSync(appPath, "utf8")));
  }
}
