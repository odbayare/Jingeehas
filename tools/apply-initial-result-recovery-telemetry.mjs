import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function replaceOnce(file, before, after, label) {
  const source = fs.readFileSync(file, "utf8");
  const count = source.split(before).length - 1;
  if (count !== 1) throw new Error(`PATCH_MATCH_INVALID:${label}:${count}`);
  fs.writeFileSync(file, source.replace(before, after));
}

const appPath = path.join(root, "app.js");
const analyticsPath = path.join(root, "netlify/functions/_lib/analytics.js");
const collectPath = path.join(root, "netlify/functions/analytics-collect.js");

replaceOnce(
  appPath,
  '    answers: {}, questionIndex: 0, validationError: "", report: null, initialResult: null,',
  '    answers: {}, questionIndex: 0, validationError: "", report: null, initialResult: null, initialResultError: "",',
  "state.initialResultError"
);

replaceOnce(
  appPath,
  'async function loadInitialResult() {\n  state.initialResult = await api(`/.netlify/functions/weight-assessment-initial-result?assessmentId=${encodeURIComponent(state.assessmentId)}`, { method: "GET" });\n  return state.initialResult;\n}',
  'async function loadInitialResult() {\n  state.initialResultError = "";\n  try {\n    state.initialResult = await api(`/.netlify/functions/weight-assessment-initial-result?assessmentId=${encodeURIComponent(state.assessmentId)}`, { method: "GET" });\n    return state.initialResult;\n  } catch (error) {\n    state.initialResult = null;\n    state.initialResultError = "Эхний үр дүнг ачаалж чадсангүй. Дахин оролдоно уу.";\n    trackEvent("initial_result_load_failed", state.assessmentId || "", `initial_result_load_failed:${state.assessmentId || "unknown"}`);\n    throw error;\n  }\n}',
  "loadInitialResult"
);

replaceOnce(
  appPath,
  '      if (restored.nextRoute === "/assessment/questions") await authorizeAssessmentQuestions(analyticsIdentity());\n      if (restored.nextRoute === "/assessment/result") await loadInitialResult();\n      state.busy = false;\n      navigate(restored.nextRoute || "/assessment/questions");\n      return;',
  '      if (restored.nextRoute === "/assessment/questions") await authorizeAssessmentQuestions(analyticsIdentity());\n      if (restored.nextRoute === "/assessment/result") {\n        state.busy = false;\n        navigate("/assessment/result");\n        try { await loadInitialResult(); } catch {}\n        render({ focus: false });\n        return;\n      }\n      state.busy = false;\n      navigate(restored.nextRoute || "/assessment/questions");\n      return;',
  "resume-route-first"
);

replaceOnce(
  appPath,
  '    if (completed.nextRoute === "/assessment/result") { await loadInitialResult(); navigate("/assessment/result"); return; }',
  '    if (completed.nextRoute === "/assessment/result") {\n      navigate("/assessment/result");\n      try { await loadInitialResult(); } catch {}\n      render({ focus: false });\n      return;\n    }',
  "completion-route-first"
);

replaceOnce(
  appPath,
  'function renderInitialResult() {\n  const result = state.initialResult;\n  if (!result) return `<div class="page">${navigation()}<main class="content-card initial-result-loading"><h1 id="page-title" tabindex="-1">Таны хариултыг нэгтгэж байна…</h1><p role="status">Хариултуудын давтагдсан холбоог шалгаж байна.</p></main>${footer()}</div>`;',
  'function renderInitialResult() {\n  const result = state.initialResult;\n  if (state.initialResultError) return `<div class="page">${navigation()}<main class="content-card initial-result-error"><h1 id="page-title" tabindex="-1">Эхний үр дүнг ачаалж чадсангүй</h1><p>Хариулт хадгалагдсан бөгөөд тест дууссан хэвээр байна.</p><p>Интернэт холболтоо шалгаад дахин оролдоно уу.</p><button class="button" type="button" data-action="retry-initial-result">Дахин оролдох</button></main>${footer()}</div>`;\n  if (!result) return `<div class="page">${navigation()}<main class="content-card initial-result-loading"><h1 id="page-title" tabindex="-1">Таны хариултыг нэгтгэж байна…</h1><p role="status">Хариултуудын давтагдсан холбоог шалгаж байна.</p></main>${footer()}</div>`;',
  "renderInitialResult-error"
);

replaceOnce(
  appPath,
  '  root.querySelector(\'[data-action="skip-result-email"]\')?.addEventListener("click", () => { state.resultEmail.skipped = true; render({ focus: false }); });',
  '  root.querySelector(\'[data-action="skip-result-email"]\')?.addEventListener("click", () => { state.resultEmail.skipped = true; render({ focus: false }); });\n  root.querySelector(\'[data-action="retry-initial-result"]\')?.addEventListener("click", () => {\n    if (state.busy) return;\n    state.busy = true; state.initialResultError = ""; render({ focus: false });\n    loadInitialResult().then(() => { state.busy = false; render(); }).catch(() => { state.busy = false; render(); });\n  });',
  "bind-retry-initial-result"
);

replaceOnce(
  analyticsPath,
  'const BROWSER_EVENTS = new Set(["landing_viewed", "start_cta_clicked", "payment_preparation_viewed", "paywall_viewed", "recovery_requested"]);',
  'const BROWSER_EVENTS = new Set(["landing_viewed", "start_cta_clicked", "payment_preparation_viewed", "paywall_viewed", "recovery_requested", "initial_result_load_failed"]);',
  "analytics-browser-event"
);

replaceOnce(
  analyticsPath,
  '  if (name === "start_cta_clicked" && context.sessionIdHash) return `start_cta_clicked:${context.sessionIdHash}`;\n  return null;',
  '  if (name === "start_cta_clicked" && context.sessionIdHash) return `start_cta_clicked:${context.sessionIdHash}`;\n  if (name === "initial_result_load_failed" && assessmentId) return `initial_result_load_failed:${assessmentId}`;\n  return null;',
  "analytics-idempotency"
);

replaceOnce(
  collectPath,
  '  if (["paywall_viewed", "report_opened"].includes(body.eventName) && !assessmentId) {',
  '  if (["paywall_viewed", "report_opened", "initial_result_load_failed"].includes(body.eventName) && !assessmentId) {',
  "analytics-assessment-required"
);

for (const [file, required] of [
  [appPath, ["initialResultError", "initial_result_load_failed", "retry-initial-result"]],
  [analyticsPath, ["initial_result_load_failed"]],
  [collectPath, ["initial_result_load_failed"]]
]) {
  const source = fs.readFileSync(file, "utf8");
  for (const token of required) if (!source.includes(token)) throw new Error(`PATCH_TOKEN_MISSING:${path.relative(root, file)}:${token}`);
}

console.log(JSON.stringify({ status: "APPLIED", files: ["app.js", "netlify/functions/_lib/analytics.js", "netlify/functions/analytics-collect.js"] }));
