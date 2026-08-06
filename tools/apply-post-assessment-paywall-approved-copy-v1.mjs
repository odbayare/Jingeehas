import fs from "node:fs";
import path from "node:path";

function replaceNamedFunction(source, name, replacement) {
  const marker = `function ${name}(`;
  const asyncMarker = `async function ${name}(`;
  let start = source.indexOf(asyncMarker);
  if (start < 0) start = source.indexOf(marker);
  if (start < 0) throw new Error(`Approved paywall function missing: ${name}`);
  const braceStart = source.indexOf("{", start);
  if (braceStart < 0) throw new Error(`Approved paywall body missing: ${name}`);
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
  throw new Error(`Approved paywall function end missing: ${name}`);
}

function replaceOnce(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Approved personalized-result insertion missing: ${label}`);
  return source.replace(from, to);
}

const TRUST_PAYWALL = `function reportPaywallContent(embedded = false) {
  const completed = state.assessmentStatus === "complete";
  const heading = embedded
    ? \`<h2 id="full-report-value-title">Бүрэн тайлангаас авах зүйлс</h2>\`
    : \`<h1 id="page-title" tabindex="-1">Бүрэн тайлангаас авах зүйлс</h1>\`;
  return \`<section class="report-paywall personalized-result-paywall" aria-labelledby="\${embedded ? "full-report-value-title" : "page-title"}"><p class="eyebrow">Бүрэн тайлан</p>
    \${heading}
    <section class="locked-report-preview" aria-labelledby="locked-report-title"><h2 id="locked-report-title">Тайланд дэлгэрэнгүй нээгдэх хэсгүүд</h2>
      <ol aria-label="Төлбөрийн дараа нээгдэх долоон хэсэг">\${LOCKED_REPORT_TITLES.map(title => \`<li><span>\${escapeHtml(title)}</span></li>\`).join("")}</ol>
    </section>
    <section class="paywall-trust" aria-labelledby="paywall-trust-title"><h2 id="paywall-trust-title">Төлбөр хийхээс өмнө мэдэх зүйлс</h2>
      <ul>
        <li>Тайлан зөвхөн таны тестийн хариултаар дэмжигдсэн мэдээлэлд тулгуурлана.</li>
        <li>\${PRODUCT.displayPrice} нь нэг удаагийн төлбөр. Захиалга болон автоматаар сунгалт байхгүй.</li>
        <li>QPay төлбөр баталгаажмагц бүрэн тайлан шууд нээгдэнэ.</li>
        <li>Энэ тайлан нь эмнэлгийн болон сэтгэл зүйн онош биш.</li>
      </ul>
    </section>
    \${completed ? \`<button class="button paywall-primary-cta" type="button" data-action="continue-to-payment" \${state.busy ? "disabled" : ""}>\${state.busy ? "Нэхэмжлэл үүсгэж байна…" : \`Бүрэн тайлангаа нээх — \${PRODUCT.displayPrice}\`}</button>\` : \`<p class="notice">Тестийг бүрэн дуусгасны дараа тайлангаа нээх сонголт гарна.</p>\`}
    <p class="muted paywall-note">Төлбөртэй холбоотой тусламж хэрэгтэй бол \${supportContactLink()} хаягаар холбогдоно уу.</p>
  </section>\`;
}`;

const INITIAL_RESULT = `function renderInitialResult() {
  const result = state.initialResult;
  if (!result) {
    const loadingBody = state.initialResultError
      ? \`<h1 id="page-title" tabindex="-1">Таны үр дүнг ачаалж чадсангүй</h1><p role="alert">\${escapeHtml(state.initialResultError)}</p><button class="button" type="button" data-action="retry-initial-result">Дахин ачаалах</button>\`
      : \`<h1 id="page-title" tabindex="-1">Таны хариултыг нэгтгэж байна…</h1><p role="status">Тайлангийн тоон үр дүнг ачаалж байна.</p>\`;
    return \`<div class="page">\${navigation()}<main class="content-card initial-result-loading">\${loadingBody}</main>\${footer()}</div>\`;
  }
  const neutral = result.mode === "neutral";
  const patternCount = neutral ? 0 : Math.max(1, Math.trunc(Number(result.patternCount) || 0));
  const interactionCount = neutral ? 0 : Math.max(0, Math.trunc(Number(result.interactionCount) || 0));
  let resultBlock;
  if (neutral) {
    resultBlock = \`<section class="initial-result-summary neutral-result-summary" aria-labelledby="page-title"><p class="eyebrow">Таны үр дүн</p><h1 id="page-title" tabindex="-1">Таны тайланд хүчтэй давамгай нэг хэв маяг илрээгүй</h1>
      <p>Таны хариултад тулгуурлан хүчтэй саад болж буй сэтгэл зүйн хэв маяг гэж зохиомлоор дүгнэсэнгүй.</p>
      <p class="paywall-closing">Бүрэн тайлангаас одоо танд түшиг болж буй давуу тал, өдөр тутам ажиглах нөхцөл болон тогтвортой байдлаа хадгалах алхмуудыг харна.</p></section>\`;
  } else {
    const interactionCopy = interactionCount > 0
      ? "<p>Эдгээрийн дундаас <strong>" + escapeHtml(interactionCount) + " чухал уялдаа холбоо</strong> илэрсэн. Эдгээр хэв маяг давхцах үедээ бие биеийнхээ нөлөөг нэмэгдүүлж, жин хасах зорилгод тань хүчтэй саад болж байж болохыг таны хариултууд харууллаа.</p><p>Түүнчлэн эдгээр сэтгэл зүйн хэв маяг давхцсан үед хэрхэн удирдахаа сайн мэдэхгүй байгаа зураглал таны хариултаас гарлаа.</p>"
      : "<p>Эдгээр хэв маягийн хооронд батлагдсан хүчтэй давхцал илрээгүй. Гэхдээ хэв маяг тус бүр өөр өөр нөхцөлд жин хасах оролдлогыг тань хүндрүүлж байж болохыг таны хариултууд харууллаа.</p>";
    resultBlock = \`<section class="initial-result-summary personalized-result-summary" aria-labelledby="page-title"><p class="eyebrow">Таны үр дүн</p><h1 id="page-title" tabindex="-1">Таны тайланд \${escapeHtml(patternCount)} хэв маяг илэрлээ</h1>
      \${interactionCopy}
      <p class="paywall-closing">Бүрэн тайлангаас танд ямар хэв маягууд байгааг, тэдгээр нь ямар үед давхцаж хүчтэй нөлөөлдгийг, мөн тэдгээрийг хэрхэн удирдаж жин хасах зорилгодоо илүү хялбар, тогтвортой хүрч болохыг ойлгож аваарай.</p></section>\`;
  }
  return \`<div class="page">\${navigation()}<main class="content-card result-page">\${resultBlock}\${reportPaywallContent(true)}</main>\${footer()}</div>\`;
}`;

const COUNT_ONLY_BACKEND = `"use strict";

const INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-initial-result-v2-count-only";
const LEGACY_INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-initial-result-v1";
const SEALED_INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-post-assessment-paywall-v1";
const LOCKED_REPORT_TITLES = Object.freeze([
  "Таны үр дүнгийн тойм",
  "Танд нөлөөлж буй хэв маяг ба нотолгоо",
  "Хэв маягуудын уялдаа",
  "Өдөр тутам нөлөөлөх нөхцөл",
  "Хэв маяг бүрт яаж хандах вэ?",
  "Эхэлж хэрэгжүүлэх 3 алхам",
  "Төлөвлөгөө алдагдсан үед хэрхэн үргэлжлүүлэх вэ?"
]);

function hasText(value) {
  if (Array.isArray(value)) return value.some(hasText);
  if (value && typeof value === "object") return Object.values(value).some(hasText);
  return String(value || "").trim().length > 0;
}

function supportedPatterns(fullReport = {}) {
  return [
    ...(Array.isArray(fullReport.influencingPatterns) ? fullReport.influencingPatterns : []),
    ...(Array.isArray(fullReport.contextualFactors) ? fullReport.contextualFactors.filter(item => item?.isPattern) : [])
  ];
}

function moduleField(module = {}, key) {
  const structured = Array.isArray(module.fields) ? module.fields.find(field => field?.key === key)?.body : null;
  return structured || module[key] || null;
}

function deliverablePatterns(fullReport = {}) {
  const modules = Array.isArray(fullReport.managementModules) ? fullReport.managementModules : [];
  const seen = new Set();
  return supportedPatterns(fullReport).filter(pattern => {
    const key = String(pattern?.id || pattern?.title || "").trim();
    if (!key || seen.has(key)) return false;
    const module = modules.find(item => String(item?.patternId || "") === String(pattern?.id || ""));
    const delivered = hasText(pattern?.title)
      && hasText(pattern?.evidenceSummary || pattern?.paragraphs || pattern?.explanation)
      && hasText(pattern?.effectOnWeightLoss)
      && module
      && hasText(moduleField(module, "observe"))
      && hasText(moduleField(module, "prepare"))
      && hasText(moduleField(module, "inMoment"));
    if (delivered) seen.add(key);
    return Boolean(delivered);
  });
}

function planPairKey(plan = {}) {
  const ids = Array.isArray(plan.patternIds) ? [...new Set(plan.patternIds.map(String))] : [];
  return ids.length === 2 ? ids.sort().join("::") : "";
}

function structuredPlanPart(value) {
  if (value && typeof value === "object") return hasText(value.title) && hasText(value.body);
  return hasText(value);
}

function deliverableInteractions(fullReport = {}, patterns = deliverablePatterns(fullReport)) {
  const patternIds = new Set(patterns.map(pattern => String(pattern.id || "")));
  const plans = [
    fullReport.combinedManagementPlan,
    ...(Array.isArray(fullReport.additionalInteractionManagementPlans) ? fullReport.additionalInteractionManagementPlans : [])
  ].filter(Boolean);
  const planPairs = new Set(plans.filter(plan =>
    structuredPlanPart(plan.startWith)
    && hasText(plan.why)
    && structuredPlanPart(plan.nextStep)
    && structuredPlanPart(plan.combinedAction)
  ).map(planPairKey).filter(Boolean));
  const seen = new Set();
  return (Array.isArray(fullReport.interactionSummary) ? fullReport.interactionSummary : []).filter(interaction => {
    if (String(interaction?.id || "").startsWith("observed_")) return false;
    const ids = Array.isArray(interaction?.patternIds) ? [...new Set(interaction.patternIds.map(String))] : [];
    const key = ids.length === 2 ? ids.sort().join("::") : "";
    if (!key || seen.has(key) || !hasText(interaction?.explanation) || !ids.every(id => patternIds.has(id)) || !planPairs.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildInitialResult(fullReport = {}) {
  const patterns = deliverablePatterns(fullReport);
  const neutral = Boolean(fullReport.neutralResult) || patterns.length === 0;
  return {
    schemaVersion: INITIAL_RESULT_SCHEMA_VERSION,
    mode: neutral ? "neutral" : "summary",
    patternCount: neutral ? 0 : patterns.length,
    interactionCount: neutral ? 0 : deliverableInteractions(fullReport, patterns).length,
    lockedSections: [...LOCKED_REPORT_TITLES]
  };
}

function validLockedSections(value = {}) {
  return Array.isArray(value.lockedSections)
    && value.lockedSections.length === LOCKED_REPORT_TITLES.length
    && LOCKED_REPORT_TITLES.every((title, index) => value.lockedSections[index] === title);
}

function publicInitialResult(initialView = {}, fullReport = null) {
  const projected = fullReport
    ? buildInitialResult(fullReport)
    : initialView?.schemaVersion === INITIAL_RESULT_SCHEMA_VERSION
      ? initialView
      : null;
  if (!projected || !validLockedSections(projected) || !["summary", "neutral"].includes(projected.mode)) return null;
  const neutral = projected.mode === "neutral";
  const patternCount = Math.trunc(Number(projected.patternCount));
  const interactionCount = Math.trunc(Number(projected.interactionCount));
  if (!neutral && (!Number.isInteger(patternCount) || patternCount < 1 || patternCount > 20)) return null;
  if (!neutral && (!Number.isInteger(interactionCount) || interactionCount < 0 || interactionCount > 20)) return null;
  return {
    schemaVersion: INITIAL_RESULT_SCHEMA_VERSION,
    mode: neutral ? "neutral" : "summary",
    patternCount: neutral ? 0 : patternCount,
    interactionCount: neutral ? 0 : interactionCount,
    lockedSections: [...LOCKED_REPORT_TITLES]
  };
}

module.exports = {
  INITIAL_RESULT_SCHEMA_VERSION,
  LEGACY_INITIAL_RESULT_SCHEMA_VERSION,
  SEALED_INITIAL_RESULT_SCHEMA_VERSION,
  LOCKED_REPORT_TITLES,
  supportedPatterns,
  deliverablePatterns,
  deliverableInteractions,
  buildInitialResult,
  publicInitialResult
};
`;

function patchPersonalizedResultFlow(source) {
  if (!source.includes("initialResult: null")) {
    source = replaceOnce(
      source,
      'answers: {}, questionIndex: 0, validationError: "", report: null,',
      'answers: {}, questionIndex: 0, validationError: "", report: null, initialResult: null, initialResultError: "",',
      "initial-result state"
    );
  }
  if (!source.includes("async function loadInitialResult()")) {
    source = replaceOnce(
      source,
      'async function loadReport() { return api(`/.netlify/functions/weight-assessment-report?assessmentId=${encodeURIComponent(state.assessmentId)}`, { method: "GET" }); }',
      'async function loadInitialResult() {\n  try {\n    const result = await api(`/.netlify/functions/weight-assessment-initial-result?assessmentId=${encodeURIComponent(state.assessmentId)}`, { method: "GET" });\n    state.initialResult = result; state.initialResultError = ""; return result;\n  } catch (error) {\n    state.initialResult = null; state.initialResultError = "Таны үр дүнг одоогоор ачаалж чадсангүй. Дахин оролдоно уу."; throw error;\n  }\n}\nasync function loadReport() { return api(`/.netlify/functions/weight-assessment-report?assessmentId=${encodeURIComponent(state.assessmentId)}`, { method: "GET" }); }',
      "initial-result loader"
    );
  }
  source = replaceOnce(
    source,
    'if (completed.nextRoute === "/assessment/result") { navigate("/assessment/result"); return; }',
    'if (completed.nextRoute === "/assessment/result") { try { await loadInitialResult(); } catch {} navigate("/assessment/result"); return; }',
    "completion initial-result load"
  );
  source = replaceOnce(
    source,
    'if (route === "assessmentResult" && restored.nextRoute !== "/assessment/result") { navigate(restored.nextRoute || "/assessment/start", { replace: true }); return; }',
    'if (route === "assessmentResult" && restored.nextRoute !== "/assessment/result") { navigate(restored.nextRoute || "/assessment/start", { replace: true }); return; }\n    if (route === "assessmentResult" && restored.nextRoute === "/assessment/result") { try { await loadInitialResult(); } catch {} }',
    "reload initial-result load"
  );
  source = replaceOnce(
    source,
    'if (restored.nextRoute === "/assessment/questions") await authorizeAssessmentQuestions(analyticsIdentity());\n      state.busy = false;\n      navigate(restored.nextRoute || "/assessment/questions");',
    'if (restored.nextRoute === "/assessment/questions") await authorizeAssessmentQuestions(analyticsIdentity());\n      if (restored.nextRoute === "/assessment/result") { try { await loadInitialResult(); } catch {} }\n      state.busy = false;\n      navigate(restored.nextRoute || "/assessment/questions");',
    "resumed initial-result load"
  );
  source = replaceOnce(
    source,
    'if (assessment.status === "complete") {\n      state.report = await loadReport();\n      state.busy = false;\n      navigate(state.report?.fullReport ? "/report" : "/assessment/result");\n      return;\n    }',
    'if (assessment.status === "complete") {\n      state.report = await loadReport();\n      if (!state.report?.fullReport) { try { await loadInitialResult(); } catch {} }\n      state.busy = false;\n      navigate(state.report?.fullReport ? "/report" : "/assessment/result");\n      return;\n    }',
    "completed resume initial-result load"
  );
  if (!source.includes("retry-initial-result\"]')?.addEventListener")) {
    source = replaceOnce(
      source,
      'root.querySelector(\'[data-action="create-invoice"]\')?.addEventListener("click", createInvoice);',
      'root.querySelector(\'[data-action="retry-initial-result"]\')?.addEventListener("click", () => { state.initialResultError = ""; render({ focus: false }); loadInitialResult().then(() => render()).catch(() => render()); });\n  root.querySelector(\'[data-action="create-invoice"]\')?.addEventListener("click", createInvoice);',
      "initial-result retry binding"
    );
  }
  return source;
}

export function applyPostAssessmentPaywallApprovedCopyV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    let source = fs.readFileSync(appPath, "utf8");
    source = replaceNamedFunction(source, "reportPaywallContent", TRUST_PAYWALL);
    source = replaceNamedFunction(source, "renderInitialResult", INITIAL_RESULT);
    source = patchPersonalizedResultFlow(source);
    fs.writeFileSync(appPath, source);
  }
  const backendPath = path.join(root, "netlify", "functions", "_lib", "initial-result.js");
  if (!fs.existsSync(backendPath)) throw new Error(`Generated initial-result backend missing: ${backendPath}`);
  fs.writeFileSync(backendPath, COUNT_ONLY_BACKEND);
}
