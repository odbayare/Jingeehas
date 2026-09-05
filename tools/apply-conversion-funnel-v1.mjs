import fs from "node:fs";
import path from "node:path";

const COUNT_TEASER_SCHEMA_VERSION = "jingeehas-initial-result-v3-counts";

function functionSource(fn, targetName) {
  return fn.toString().replace(/^function\s+[^\s(]+/, `function ${targetName}`).replace(/^async function\s+[^\s(]+/, `async function ${targetName}`);
}

function replaceFunction(source, name, nextName, replacement) {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf(`function ${nextName}(`, start);
  if (start < 0 || end <= start) throw new Error(`Conversion funnel function boundary missing: ${name} -> ${nextName}`);
  return `${source.slice(0, start)}${replacement.trim()}\n${source.slice(end)}`;
}

function replaceNamedFunction(source, name, replacement) {
  const markers = [`async function ${name}(`, `function ${name}(`];
  let start = -1;
  for (const marker of markers) {
    start = source.indexOf(marker);
    if (start >= 0) break;
  }
  if (start < 0) return null;
  const braceStart = source.indexOf("{", start);
  if (braceStart < 0) throw new Error(`Conversion funnel function body missing: ${name}`);
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
    if (char === "}" && --depth === 0) return `${source.slice(0, start)}${replacement.trim()}${source.slice(index + 1)}`;
  }
  throw new Error(`Conversion funnel function end missing: ${name}`);
}

function replaceUntilMarker(source, functionName, endMarker, replacement) {
  const start = source.indexOf(`function ${functionName}(`);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end <= start) throw new Error(`Conversion funnel block boundary missing: ${functionName} -> ${endMarker}`);
  return `${source.slice(0, start)}${replacement.trim()}\n${source.slice(end)}`;
}

function renderPersonalizedConversionProof() {
  const result = state.initialResult;
  if (!result || result.schemaVersion !== "jingeehas-initial-result-v3-counts" || result.mode !== "counts") return "";
  const patternCount = Math.max(0, Number(result.patternCount || 0));
  const interactionCount = Math.max(0, Number(result.interactionCount || 0));
  if (!patternCount && !interactionCount) return `<section class="report-contents-preview" aria-label="Таны хариултын хувийн мэдээлэл"><p class="eyebrow">ТАНЫ ХАРИУЛТААС</p><p><strong>Таны хариултыг нэгтгэсэн хувийн тайлан бэлэн боллоо.</strong></p><p class="muted">Тод хэв маяг ажиглагдаагүй бол бүрэн тайланд зохиомол дүгнэлт нэмэхгүй.</p></section>`;
  const patterns = patternCount ? `<strong>${patternCount} хэв маяг</strong>` : "";
  const interactions = interactionCount ? `<strong>${interactionCount} уялдаа холбоо</strong>` : "";
  const summary = patternCount && interactionCount
    ? `Бүрэн тайланд дэлгэрүүлж тайлбарлах ${patterns}, тэдгээрийн хооронд ${interactions} ажиглагдсан байна.`
    : patternCount
      ? `Бүрэн тайланд дэлгэрүүлж тайлбарлах ${patterns} ажиглагдсан байна.`
      : `Бүрэн тайланд дэлгэрүүлж тайлбарлах ${interactions} ажиглагдсан байна.`;
  return `<section class="report-contents-preview" aria-label="Таны хариултын хувийн мэдээлэл"><p class="eyebrow">ТАНЫ ХАРИУЛТААС</p><p>${summary}</p><p class="muted">Энд зөвхөн тоог харуулж байна. Нэр, тайлбар, илрэх нөхцөл болон удирдах алхмууд бүрэн тайланд нээгдэнэ.</p></section>`;
}

function optimizedReportPaywallContent(embedded = false) {
  const completed = state.assessmentStatus === "complete";
  const heading = embedded
    ? `<h2 id="full-report-value-title">Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо</h2>`
    : `<h1 id="page-title" tabindex="-1">Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо</h1>`;
  return `<section class="report-paywall sealed-paywall" aria-labelledby="${embedded ? "full-report-value-title" : "page-title"}"><p class="eyebrow">ТЕСТ ДУУСЛАА</p>
    ${heading}
    <p class="paywall-lead">Тестийн хариултуудыг тань нэгтгэн, жин хасах төлөвлөгөөгөө дагахад ямар нөхцөл хүндрэл үүсгэж болох, өөр дээрээ юуг анзаарах, юунаас эхлэхийг бүрэн тайланд харуулна.</p>
    ${renderPersonalizedConversionProof()}
    <section class="premium-price-block" aria-label="Бүрэн тайлангийн үнэ ба төлбөр"><p class="premium-price-label">ТАНЫ ХУВИЙН БҮРЭН ТАЙЛАН</p><p class="premium-price">${PRODUCT.displayPrice}</p><p class="premium-price-support">Нэг удаагийн төлбөр</p>
      ${completed ? `<button class="button paywall-primary-cta" type="button" data-action="continue-to-payment" ${state.busy ? "disabled" : ""}>${state.busy ? "НЭХЭМЖЛЭЛ ҮҮСГЭЖ БАЙНА…" : `БҮРЭН ТАЙЛАНГАА НЭЭХ · ${PRODUCT.displayPrice}`}</button>` : `<p class="notice">Тестийг бүрэн дуусгасны дараа тайлангаа нээх сонголт гарна.</p>`}
      <p class="paywall-payment-note">QPay · Төлбөр баталгаажмагц бүрэн тайлан нээгдэнэ</p>
    </section>
    <details class="report-contents-preview"><summary><strong>Бүрэн тайланд юу багтах вэ?</strong></summary><h2 id="report-contents-title">Бүрэн тайлангаас та:</h2>
      <ul><li>Таны хариултаас юу хамгийн тод ажиглагдсаныг</li><li>Ямар нөхцөлд хүндрэл нэмэгдэж болох, хэд хэдэн хэв маяг зэрэг ажиглагдсан бол тэдгээрийн уялдаа холбоог</li><li>Өөр дээрээ юу ажиглаж, ямар алхмаас эхэлж болохыг харна</li></ul>
    </details>
    <p class="paywall-trust-copy">Тайлангийн агуулгыг таны өгсөн хариултад тулгуурлан бүрдүүлнэ. Тод хэв маяг ажиглагдаагүй бол зохиомол дүгнэлт нэмэхгүй.</p>
    <p class="muted paywall-boundary">Энэ тайлан нь эмнэлгийн болон сэтгэл зүйн онош биш.</p>
  </section>`;
}

function renderQpayAppCard(item, index = 0) {
  const label = qpayAppLabel(item, index);
  const logo = item.logo ? `<img class="qpay-app-logo" src="${escapeAttribute(item.logo)}" alt="" loading="lazy">` : `<span class="qpay-app-logo qpay-app-logo-fallback" aria-hidden="true">${qpayAppInitial(label)}</span>`;
  return `<li><a class="qpay-app-card" data-qpay-app-link href="${escapeAttribute(item.link || item.url || "")}" rel="noopener noreferrer">${logo}<span>${escapeHtml(label)}</span></a></li>`;
}

function optimizedRenderQpayAppGrid(payment = {}) {
  const urls = (Array.isArray(payment.urls) ? payment.urls : []).filter(item => String(item.link || item.url || ""));
  if (!urls.length) return "";
  const shortUrl = urls.find(item => item.kind === "qpay_short_url") || urls.find(item => qpayAppLabel(item).trim().toLowerCase() === "qpay") || null;
  const apps = urls.filter(item => item !== shortUrl && item.kind !== "qpay_short_url");
  const quickApps = apps.slice(0, 6);
  const otherApps = apps.slice(6);
  return `<section class="qpay-app-section" aria-labelledby="qpay-app-title"><h3 id="qpay-app-title">QPay-аар төлөх</h3>
    ${shortUrl ? `<a class="button paywall-primary-cta" data-qpay-app-link href="${escapeAttribute(shortUrl.link || shortUrl.url || "")}" rel="noopener noreferrer">QPay-аар ${PRODUCT.displayPrice} төлөх</a><p class="muted">QPay холбоосоор төлбөрийн сонголтоо шууд нээнэ.</p>` : ""}
    ${quickApps.length ? `<h3>Банкны апп-аар шууд төлөх</h3><p class="muted">Банк эсвэл wallet апп-аа сонгоход төлбөрийн мэдээлэл шууд нээгдэнэ.</p><ul class="qpay-app-grid">${quickApps.map((item, index) => renderQpayAppCard(item, index)).join("")}</ul>` : ""}
    ${otherApps.length ? `<details class="report-contents-preview"><summary><strong>Бусад банк, wallet харах (${otherApps.length})</strong></summary><ul class="qpay-app-grid">${otherApps.map((item, index) => renderQpayAppCard(item, index + quickApps.length)).join("")}</ul></details>` : ""}
  </section>`;
}

function optimizedRenderPayment() {
  const payment = state.payment || { status: "idle" };
  const createBlocked = ["creating", "create_error", "create_unknown", "reconciling", "create_failed_confirmed"].includes(payment.status);
  const prepaid = state.commercialFlowVersion === "prepaid_v2";
  const statusCopy = payment.status === "paid"
    ? (prepaid ? PAYMENT_COPY.paidBeforeTest : PAYMENT_COPY.paidAfterAssessment)
    : (!prepaid && payment.status === "pending" ? "QPay төлбөрөө хийсний дараа бүрэн тайлан автоматаар нээгдэнэ." : PAYMENT_COPY[payment.status] || "");
  const paymentReady = prepaid ? state.assessmentStatus === "payment_pending" : state.assessmentStatus === "complete";
  return `<div class="page">${prepaid ? navigation() : paywallNavigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">${prepaid ? "Төлбөрөө баталгаажуулж байна" : "Бүрэн тайлангаа нээх"}</h1>
      <p>${prepaid ? "Тест үнэлгээ болон бүрэн хувийн тайлан" : "Төлбөр баталгаажмагц таны бүрэн тайлан автоматаар нээгдэнэ."}</p>
      <section aria-labelledby="payment-title"><h2 id="payment-title">QPay нэхэмжлэл</h2><p class="price">Үнэ: ${PRODUCT.displayPrice}</p>
        ${prepaid ? `<p class="notice">QPay төлбөрөө хийсний дараа тест автоматаар нээгдэнэ.</p>` : paymentReady ? "" : `<p class="notice">QPay төлбөрийн товч тест үнэлгээг бүрэн дуусгасны дараа нээгдэнэ.</p>`}
        <p class="payment-status" role="status" aria-live="polite">${escapeHtml(statusCopy)}</p>
        ${payment.status !== "paid" ? renderQpayPaymentOptions(payment) : ""}
        ${payment.status !== "paid" && payment.expiresAt ? `<p>Нэхэмжлэлийн хугацаа: <time datetime="${escapeAttribute(payment.expiresAt)}">${escapeHtml(new Date(payment.expiresAt).toLocaleString("mn-MN"))}</time></p>` : ""}
        ${["pending", "check_error", "paid_but_not_unlocked"].includes(payment.status) ? `<button class="button" type="button" data-action="check-payment">Төлбөр шалгах</button>` : payment.status === "paid" ? (prepaid ? "" : `<p class="notice">Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ.</p><a class="button" href="/report" data-route>Бүрэн тайлан харах</a>`) : !paymentReady || createBlocked || prepaid ? "" : `<button class="button" type="button" data-action="create-invoice">${PRODUCT.displayPrice}-ийн QPay нэхэмжлэл үүсгэх</button>`}
      </section></main>${footer()}</div>`;
}

async function optimizedLoadInitialResult() {
  if (!state.assessmentId) return null;
  if (state.initialResultLoading) return state.initialResult || null;
  state.initialResultLoading = true;
  try {
    const result = await api(`/.netlify/functions/weight-assessment-initial-result?assessmentId=${encodeURIComponent(state.assessmentId)}`, { method: "GET" });
    state.initialResult = result || null;
    state.initialResultError = "";
    return state.initialResult;
  } catch (error) {
    state.initialResultError = String(error?.body?.error || error?.message || "initial_result_unavailable");
    throw error;
  } finally {
    state.initialResultLoading = false;
  }
}

function optimizedPublicInitialResult(initialView = {}, fullReport = null) {
  const historical = [LEGACY_INITIAL_RESULT_SCHEMA_VERSION, COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION]
    .includes(initialView?.schemaVersion);
  const eligible = initialView?.schemaVersion === INITIAL_RESULT_SCHEMA_VERSION && initialView?.mode === "sealed";
  if ((eligible || historical) && fullReport) {
    const patterns = deliverablePatterns(fullReport);
    const interactions = deliverableInteractions(fullReport, patterns);
    return {
      schemaVersion: COUNT_TEASER_SCHEMA_VERSION,
      mode: "counts",
      patternCount: patterns.length,
      interactionCount: interactions.length
    };
  }
  return eligible ? { ...SEALED_PAYWALL } : null;
}

function patchApp(appPath) {
  let source = fs.readFileSync(appPath, "utf8");

  if (!source.includes("function renderPersonalizedConversionProof(")) {
    const marker = "function reportPaywallContent(embedded = false) {";
    if (!source.includes(marker)) throw new Error(`Conversion proof insertion point missing: ${appPath}`);
    source = source.replace(marker, `${functionSource(renderPersonalizedConversionProof, "renderPersonalizedConversionProof")}\n${marker}`);
  }

  source = replaceFunction(source, "reportPaywallContent", "renderLegacyPostResultPaywall", functionSource(optimizedReportPaywallContent, "reportPaywallContent"));
  if (!source.includes("function renderQpayAppCard(")) {
    const marker = "function renderQpayAppGrid(payment = {}) {";
    if (!source.includes(marker)) throw new Error(`QPay app-card insertion point missing: ${appPath}`);
    source = source.replace(marker, `${functionSource(renderQpayAppCard, "renderQpayAppCard")}\n${marker}`);
  }
  source = replaceFunction(source, "renderQpayAppGrid", "renderQpayPaymentOptions", functionSource(optimizedRenderQpayAppGrid, "renderQpayAppGrid"));
  source = replaceFunction(source, "renderPayment", "renderQuestionInput", functionSource(optimizedRenderPayment, "renderPayment"));

  const loader = functionSource(optimizedLoadInitialResult, "loadInitialResult");
  const replacedLoader = replaceNamedFunction(source, "loadInitialResult", loader);
  if (replacedLoader === null) {
    const marker = 'async function loadReport() { return api(`/.netlify/functions/weight-assessment-report?assessmentId=${encodeURIComponent(state.assessmentId)}`, { method: "GET" }); }';
    if (!source.includes(marker)) throw new Error(`Initial-result loader insertion point missing: ${appPath}`);
    source = source.replace(marker, `${marker}\n${loader}`);
  } else source = replacedLoader;

  const restoreFrom = 'applyAssessmentState(restored);\n    if (route === "assessmentResult" && restored.nextRoute !== "/assessment/result") { navigate(restored.nextRoute || "/assessment/start", { replace: true }); return; }';
  const restoreTo = 'applyAssessmentState(restored);\n    if (route === "assessmentResult" && restored.nextRoute === "/assessment/result") await loadInitialResult().catch(() => null);\n    if (route === "assessmentResult" && restored.nextRoute !== "/assessment/result") { navigate(restored.nextRoute || "/assessment/start", { replace: true }); return; }';
  if (!source.includes('restored.nextRoute === "/assessment/result") await loadInitialResult().catch(() => null)')) {
    if (!source.includes(restoreFrom)) throw new Error(`Initial-result restore insertion point missing: ${appPath}`);
    source = source.replace(restoreFrom, restoreTo);
  }

  fs.writeFileSync(appPath, source);
}

function patchInitialResult(modulePath) {
  let source = fs.readFileSync(modulePath, "utf8");
  if (!source.includes(`const COUNT_TEASER_SCHEMA_VERSION = "${COUNT_TEASER_SCHEMA_VERSION}";`)) {
    const marker = 'const COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION = "jingeehas-initial-result-v2-count-only";';
    if (!source.includes(marker)) throw new Error(`Count teaser schema insertion point missing: ${modulePath}`);
    source = source.replace(marker, `${marker}\nconst COUNT_TEASER_SCHEMA_VERSION = "${COUNT_TEASER_SCHEMA_VERSION}";`);
  }
  source = replaceUntilMarker(source, "publicInitialResult", "module.exports", functionSource(optimizedPublicInitialResult, "publicInitialResult"));
  const exportFrom = '  COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION,\n';
  const exportTo = '  COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION,\n  COUNT_TEASER_SCHEMA_VERSION,\n';
  if (!source.includes("  COUNT_TEASER_SCHEMA_VERSION,")) {
    if (!source.includes(exportFrom)) throw new Error(`Count teaser export insertion point missing: ${modulePath}`);
    source = source.replace(exportFrom, exportTo);
  }
  fs.writeFileSync(modulePath, source);
}

export function applyConversionFunnelV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (fs.existsSync(appPath)) patchApp(appPath);
  }
  const initialResultPath = path.join(root, "netlify", "functions", "_lib", "initial-result.js");
  if (!fs.existsSync(initialResultPath)) throw new Error(`Generated initial-result module missing: ${initialResultPath}`);
  patchInitialResult(initialResultPath);
}
