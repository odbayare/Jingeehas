import fs from "node:fs";
import path from "node:path";

function namedFunctionRange(source, name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`V6 compatibility function missing: ${name}`);
  const braceStart = source.indexOf("{", start + marker.length);
  if (braceStart < 0) throw new Error(`V6 compatibility body missing: ${name}`);
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
    if (char === "}" && --depth === 0) return { start, end: index + 1, text: source.slice(start, index + 1) };
  }
  throw new Error(`V6 compatibility function end missing: ${name}`);
}

const LEGACY_HELPERS = `function renderLegacyManagementModulesV6(modules = []) {
  return modules.map(module => \`<article class="management-module" data-report-version="v6"><h3>\${escapeHtml(module.title)}</h3><p class="management-evidence-link">\${escapeHtml(module.evidenceLink)}</p>
    <dl><dt>Юуг анзаарах вэ?</dt><dd>\${escapeHtml(module.observe)}</dd>
      <dt>Юунаас өдөөгдөж байгааг хэрхэн таних вэ?</dt><dd>\${escapeHtml(module.triggerRecognition)}</dd>
      <dt>Урьдчилан юу бэлдэх вэ?</dt><dd>\${escapeHtml(module.prepare)}</dd>
      <dt>Тухайн үед юу хийж болох вэ?</dt><dd>\${escapeHtml(module.inMoment)}</dd>
      <dt>Юуг хэт хатуу шаардахгүй байх вэ?</dt><dd>\${escapeHtml(module.avoidRigidDemand)}</dd>
      <dt>Төлөвлөснөөрөө яваагүй үед хэрхэн үргэлжлүүлэх вэ?</dt><dd>\${escapeHtml(module.resume)}</dd>
      <dt>Хэзээ мэргэжлийн тусламж авах вэ?</dt><dd>\${escapeHtml(module.professionalHelp)}</dd></dl></article>\`).join("");
}

function renderLegacyCombinedPlanV6(plan) {
  if (!plan) return "";
  return \`<dl class="combined-management-plan" data-report-version="v6"><dt>Эхэлж аль хэв маягийн нөлөөг багасгах вэ?</dt><dd>\${escapeHtml(plan.startWith)}</dd>
    <dt>Яагаад үүнээс эхлэх вэ?</dt><dd>\${escapeHtml(plan.why)}</dd>
    <dt>Дараагийн алхам юу вэ?</dt><dd>\${escapeHtml(plan.nextStep)}</dd>
    <dt>Хоёр хэв маягийг хамтад нь удирдах ямар арга тохирох вэ?</dt><dd>\${escapeHtml(plan.combinedAction)}</dd></dl>\`;
}

function renderLegacyCombinedPlansV6(full) {
  return [full.combinedManagementPlan, ...(full.additionalInteractionManagementPlans || [])].filter(Boolean).map(renderLegacyCombinedPlanV6).join("");
}

function renderLegacyDifficultMomentPlanV6(plan) {
  if (!plan) return "";
  return \`<ol class="difficult-moment-plan" data-report-version="v6">
    <li><strong>Юу болж байгааг анзаарах</strong><span>\${escapeHtml(plan.notice)}</span></li>
    <li><strong>Тухайн мөчид хийх нэг үйлдэл</strong><span>\${escapeHtml(plan.inMoment)}</span></li>
    <li><strong>Өдөөлтийг багасгах нэг арга</strong><span>\${escapeHtml(plan.reduceTrigger)}</span>\${plan.combinedAction ? \`<span>\${escapeHtml(plan.combinedAction)}</span>\` : ""}</li>
    <li><strong>Дараагийн хоол эсвэл өдрөөс үргэлжлүүлэх</strong><span>\${escapeHtml(plan.resume)}</span></li>
  </ol>\`;
}

function renderLegacyFallbackPlanV6(plan) {
  if (!plan) return "";
  return \`\${renderReportParagraphs([plan.introduction])}<ul class="fallback-plan" data-report-version="v6">
    <li>\${escapeHtml(plan.resume)}</li><li>\${escapeHtml(plan.softenRule)}</li>
    <li>\${escapeHtml(plan.recheckTrigger)}</li><li>\${escapeHtml(plan.fitDailyLife)}</li></ul>\`;
}

function buildLegacyReportSectionsV6(full) {
  const patterns = renderPatternArticles(full);
  const interactions = (full.interactionSummary || []).map(item => \`<p>\${escapeHtml(item.explanation)}</p>\`).join("");
  const nonPatternContexts = (full.contextualFactors || []).filter(item => !item.isPattern).map(item => \`<article><h3>\${escapeHtml(item.title)}</h3>\${renderReportParagraphs([item.summary || item.explanation])}</article>\`).join("");
  const triggerContexts = (full.managementModules || []).map(module => \`<article><h3>\${escapeHtml(module.title)}</h3><p>\${escapeHtml(module.observe)}</p></article>\`).join("");
  const previous = full.previousAttemptAnalysis ? \`<article><h3>Өмнөх оролдлогын нөхцөл</h3>\${renderReportParagraphs(full.previousAttemptAnalysis.paragraphs || [full.previousAttemptAnalysis.summary, full.previousAttemptAnalysis.interpretation])}</article>\` : "";
  const guidance = full.neutralResult?.professionalScope || full.professionalGuidance || full.urgentGuidance
    ? renderReportParagraphs([full.neutralResult?.professionalScope, full.professionalGuidance, full.urgentGuidance])
    : "";
  return [
    { id: "overview", heading: "ТАНЫ ҮР ДҮНГИЙН ТОЙМ", paragraphs: [renderResultOverview(full)], visible: true },
    { id: "patterns", heading: "ТАНД НӨЛӨӨЛЖ БУЙ ХЭВ МАЯГУУД", paragraphs: [patterns], visible: Boolean(patterns) },
    { id: "interactions", heading: "ХЭВ МАЯГУУДЫН УЯЛДАА", paragraphs: [interactions], visible: Boolean(interactions && (full.managementModules || []).length >= 2) },
    { id: "context", heading: "ЯМАР ҮЕД ИЛҮҮ ХҮЧТЭЙ БОЛДОГ ВЭ?", paragraphs: [\`\${triggerContexts}\${nonPatternContexts}\${previous}\`], visible: Boolean(triggerContexts || nonPatternContexts || previous) },
    { id: "management", heading: "ХЭВ МАЯГ БҮРИЙН НӨЛӨӨГ ХЭРХЭН УДИРДАХ ВЭ?", paragraphs: [renderLegacyManagementModulesV6(full.managementModules)], visible: (full.managementModules || []).length > 0 },
    { id: "combined-management", heading: "НЭГДСЭН УДИРДАХ ДАРААЛАЛ", paragraphs: [renderLegacyCombinedPlansV6(full)], visible: Boolean(full.combinedManagementPlan || (full.additionalInteractionManagementPlans || []).length) },
    { id: "difficult-moment", heading: "Хэцүү үеийг хэрхэн даван туулах вэ?", paragraphs: [renderLegacyDifficultMomentPlanV6(full.difficultMomentPlan)], visible: Boolean(full.difficultMomentPlan) },
    { id: "initial-actions", heading: "ЭХЭЛЖ ХЭРЭГЖҮҮЛЭХ 3 АЛХАМ", paragraphs: [renderInitialActions(full)], visible: (full.initialActions || []).length === 3 },
    { id: "fallback", heading: "Төлөвлөснөөрөө явж чадаагүй үед хэрхэн үргэлжлүүлэх вэ?", paragraphs: [renderLegacyFallbackPlanV6(full.fallbackPlan)], visible: Boolean(full.fallbackPlan) },
    { id: "guidance", heading: "ХЭЗЭЭ МЭРГЭЖЛИЙН ХҮНТЭЙ ЗӨВЛӨЛДӨХ ВЭ?", paragraphs: [guidance], visible: Boolean(guidance) }
  ];
}
`;

export function applyReportBuilderV6SnapshotCompatibility(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    const source = fs.readFileSync(appPath, "utf8");
    if (source.includes("function buildLegacyReportSectionsV6(")) continue;
    const range = namedFunctionRange(source, "buildReportSections");
    const semanticFunction = range.text.replace("function buildReportSections(", "function buildSemanticReportSectionsV7(");
    const wrapper = `function buildReportSections(full) {
  const semanticV7 = full?.version === "jingeehas-case-formulation-v7-semantic-builder" || Boolean(full?.neutralActionPlan || full?.recoveryPlan);
  return semanticV7 ? buildSemanticReportSectionsV7(full) : buildLegacyReportSectionsV6(full);
}`;
    const replacement = `${LEGACY_HELPERS}\n${semanticFunction}\n\n${wrapper}`;
    fs.writeFileSync(appPath, `${source.slice(0, range.start)}${replacement}${source.slice(range.end)}`);
  }
}
