import fs from "node:fs";
import path from "node:path";

const FREE_FLOW = "free_assessment_postpaid_v1";

function replaceNamedFunction(source, name, replacement) {
  const marker = `function ${name}(`;
  const asyncMarker = `async function ${name}(`;
  let start = source.indexOf(asyncMarker);
  if (start < 0) start = source.indexOf(marker);
  if (start < 0) throw new Error(`Post-assessment flow function missing: ${name}`);
  const braceStart = source.indexOf("{", start);
  if (braceStart < 0) throw new Error(`Post-assessment flow body missing: ${name}`);
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
  throw new Error(`Post-assessment flow function end missing: ${name}`);
}

const LOCKED_TITLES = `const LOCKED_REPORT_TITLES = Object.freeze([
  "Таны үр дүнгийн тойм",
  "Танд нөлөөлж буй хэв маяг ба нотолгоо",
  "Хэв маягуудын уялдаа",
  "Өдөр тутам нөлөөлөх нөхцөл",
  "Хэв маяг бүрт яаж хандах вэ?",
  "Эхэлж хэрэгжүүлэх 3 алхам",
  "Төлөвлөгөө алдагдсан үед хэрхэн үргэлжлүүлэх вэ?"
]);`;

const RETIRED_CONTACT = `function renderAssessmentContact() {
  return \`<div class="page">\${navigation()}<main class="content-card checkout-preparation"><p class="eyebrow">Үнэгүй тест</p><h1 id="page-title" tabindex="-1">Тестийн өмнө төлбөр шаардахгүй</h1>
    <p>Жин хасахтай холбоотой сэтгэл зүйн болон зан үйлийн хэв маягаа тодруулах тестийг эхлээд бүрэн бөглөнө.</p>
    <p>Тест дууссаны дараа таны хариултад тулгуурласан бүрэн тайлан бэлэн болсон дэлгэц гарч, тайлангаа нээх эсэхээ тэр үед шийднэ.</p>
    <a class="button" href="/assessment/start" data-route>Тестээ үнэгүй эхлүүлэх</a>
    <p class="muted">Тест бөглөхөд төлбөр, картын мэдээлэл эсвэл QPay нэхэмжлэл шаардахгүй.</p></main>\${footer()}</div>\`;
}`;

const TRUST_PAYWALL = `function reportPaywallContent(embedded = false) {
  const completed = state.assessmentStatus === "complete";
  const heading = embedded
    ? \`<h2 id="full-report-value-title">Таны хариултад тулгуурласан бүрэн тайлан бэлэн</h2>\`
    : \`<h1 id="page-title" tabindex="-1">Таны хариултад тулгуурласан бүрэн тайлан бэлэн</h1>\`;
  return \`<section class="report-paywall" aria-labelledby="\${embedded ? "full-report-value-title" : "page-title"}"><p class="eyebrow">Тест дууслаа</p>
    \${heading}
    <p>Таны өгсөн хариултуудыг нэгтгэн тайланг боловсруулсан. Бүрэн тайлангаас жин хасах оролдлогод тань нөлөөлж буй хэв маяг, өдөр тутмын нөхцөл болон эхэлж хэрэгжүүлэх бодит алхмуудаа харна.</p>
    <p>Хэд хэдэн хэв маяг зэрэг илэрсэн бол тэдгээрийн уялдааг тайлбарлана. Тод хэв маяг илрээгүй бол зохиомол асуудал нэмэхгүй; одоо танд түшиг болж буй давуу тал, цааш ажиглах чиглэлийг харуулна.</p>
    <section class="paywall-trust" aria-labelledby="paywall-trust-title"><h2 id="paywall-trust-title">Төлбөр хийхээс өмнө мэдэх зүйлс</h2>
      <ul>
        <li>Тайлан зөвхөн таны тестийн хариултаар дэмжигдсэн мэдээлэлд тулгуурлана.</li>
        <li>\${PRODUCT.displayPrice} нь нэг удаагийн төлбөр. Захиалга болон автоматаар сунгалт байхгүй.</li>
        <li>QPay төлбөр баталгаажмагц бүрэн тайлан шууд нээгдэнэ.</li>
        <li>Энэ тайлан нь эмнэлгийн болон сэтгэл зүйн онош биш.</li>
      </ul>
    </section>
    <section class="locked-report-preview" aria-labelledby="locked-report-title"><h2 id="locked-report-title">Бүрэн тайланд нээгдэх хэсгүүд</h2>
      <ol aria-label="Төлбөрийн дараа нээгдэх долоон хэсэг">\${LOCKED_REPORT_TITLES.map(title => \`<li><span>\${escapeHtml(title)}</span></li>\`).join("")}</ol>
    </section>
    <p class="paywall-closing"><strong>Та тестээ аль хэдийн бүрэн дуусгасан.</strong> Одоо зөвхөн боловсруулсан тайлангаа нээх эсэхээ шийднэ.</p>
    \${completed ? \`<button class="button paywall-primary-cta" type="button" data-action="continue-to-payment" \${state.busy ? "disabled" : ""}>\${state.busy ? "Нэхэмжлэл үүсгэж байна…" : \`Бүрэн тайлангаа нээх — \${PRODUCT.displayPrice}\`}</button>\` : \`<p class="notice">Тестийг бүрэн дуусгасны дараа тайлангаа нээх сонголт гарна.</p>\`}
    <p class="muted paywall-note">Төлбөртэй холбоотой тусламж хэрэгтэй бол \${supportContactLink()} хаягаар холбогдоно уу.</p>
  </section>\`;
}`;

const INITIAL_RESULT = `function renderInitialResult() {
  return \`<div class="page">\${navigation()}<main class="content-card result-page sealed-paywall" aria-labelledby="page-title">\${reportPaywallContent()}</main>\${footer()}</div>\`;
}`;

const START_FREE = `async function startFreeAssessment(form) {
  if (state.busy) return;
  const input = formObject(form);
  state.busy = true; state.validationError = ""; render({ focus: false });
  try {
    await ensureSession();
    const restored = await api("/.netlify/functions/weight-session-state", { method: "GET" });
    const resumableFreeAssessment = restored.assessment?.commercialFlowVersion === "${FREE_FLOW}";
    if (resumableFreeAssessment) {
      applyAssessmentState(restored);
      if (restored.nextRoute === "/assessment/questions") await authorizeAssessmentQuestions(analyticsIdentity());
      state.busy = false;
      navigate(restored.nextRoute || "/assessment/questions");
      return;
    }
    let coachClientId = null;
    if (state.invitation) {
      if (!input.consent) throw new Error("Тайлан хуваалцах сонголтоо хийнэ үү.");
      const consent = await api("/.netlify/functions/advisor-consent", {
        method: "POST",
        body: JSON.stringify({ coachClientId: state.invitation.coachClientId, consent: input.consent === "yes" })
      });
      if (input.consent === "yes") coachClientId = consent.coachClientId;
    }
    const analyticsContext = analyticsIdentity();
    const assessment = await api("/.netlify/functions/weight-assessment-create", {
      method: "POST",
      body: JSON.stringify({ analyticsContext, ...(coachClientId ? { coachClientId } : {}) })
    });
    state.assessmentId = assessment.assessmentId;
    state.assessmentStatus = assessment.status;
    state.commercialFlowVersion = assessment.commercialFlowVersion;
    state.questionnaireVersion = assessment.questionnaireVersion || state.questionnaireVersion;
    state.invitation = null;
    if (assessment.status === "complete") {
      state.report = await loadReport();
      state.busy = false;
      navigate(state.report?.fullReport ? "/report" : "/assessment/result");
      return;
    }
    await authorizeAssessmentQuestions(analyticsContext);
    state.busy = false;
    navigate("/assessment/questions");
  } catch (error) {
    state.busy = false;
    state.validationError = error.message || "Тестийг эхлүүлж чадсангүй. Дахин оролдоно уу.";
    render({ focus: false });
  }
}`;

function patchLockedTitles(source) {
  const start = source.indexOf("const LOCKED_REPORT_TITLES = Object.freeze([");
  const endMarker = "]);";
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error("Locked report title block missing");
  return `${source.slice(0, start)}${LOCKED_TITLES}${source.slice(end + endMarker.length)}`;
}

function patchPaymentStatus(source) {
  const statusLine = /^\s*const statusCopy = payment\.status === "paid" \? .*;$/m;
  const prepaidLine = /^\s*const prepaid = state\.commercialFlowVersion === "prepaid_v2";$/m;
  if (!statusLine.test(source) || !prepaidLine.test(source)) {
    throw new Error("Post-assessment flow anchor missing: flow-aware paid status copy");
  }
  let output = source.replace(statusLine, "");
  output = output.replace(prepaidLine, `  const prepaid = state.commercialFlowVersion === "prepaid_v2";\n  const statusCopy = payment.status === "paid" ? (prepaid ? PAYMENT_COPY.paidBeforeTest : PAYMENT_COPY.paidAfterAssessment) : PAYMENT_COPY[payment.status] || "";`);
  return output;
}

export function applyPostAssessmentPaywallFlowV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    let source = fs.readFileSync(appPath, "utf8");
    source = patchLockedTitles(source);
    source = replaceNamedFunction(source, "renderAssessmentContact", RETIRED_CONTACT);
    source = replaceNamedFunction(source, "reportPaywallContent", TRUST_PAYWALL);
    source = replaceNamedFunction(source, "renderInitialResult", INITIAL_RESULT);
    source = replaceNamedFunction(source, "startFreeAssessment", START_FREE);
    source = patchPaymentStatus(source);
    fs.writeFileSync(appPath, source);
  }
}
