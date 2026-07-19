"use strict";

const PRODUCT = Object.freeze({ name: "Илүүдэл жингээс салах тест үнэлгээ", code: "WEIGHT_TEST_ONE_TIME", amount: 9900, displayPrice: "9,900₮" });
const SUPPORT_EMAIL = "jingeehas@gmail.com";
const WEIGHT_TEST_COMING_SOON_MODE = false;
const PAYMENT_COPY = Object.freeze({
  creating: "QPay нэхэмжлэл үүсгэж байна…",
  create_unknown: "Нэхэмжлэл үүссэн эсэхийг баталгаажуулах шаардлагатай байна. Давтан нэхэмжлэл үүсгэхгүйгээр дэмжлэгтэй холбогдоно уу.",
  reconciling: "Өмнөх нэхэмжлэлийн төлөвийг QPay талаас шалгаж байна…",
  create_failed_confirmed: "Өмнөх оролдлогоор нэхэмжлэл үүсээгүй нь баталгаажсан. Шинэ оролдлогыг дэмжлэгээр зөвшөөрүүлнэ үү.",
  pending: "Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.",
  checking: "Төлбөрийг шалгаж байна…",
  paidBeforeTest: "Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ.",
  paidAfterAssessment: "Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ."
});
const PAYMENT_STATES = new Set(["idle", "creating", "create_unknown", "reconciling", "pending", "checking", "paid", "create_error", "create_failed_confirmed", "check_error", "expired", "failed", "cancelled", "paid_but_not_unlocked"]);
const ADMIN_REPORT_PREVIEW_STORAGE_KEY = "jingeehas_admin_report_preview_assessment";
const questionApi = typeof require === "function" ? require("./questions.js") : window.JingeehasQuestions;
const EXCLUSIVE = new Set(["Аль нь ч үгүй", "Аль нь ч биш", "Онц өөрчлөлтгүй", "Хариулахгүй", "Одоогоор ямар нэг арга хэрэглээгүй", "Ямар нэг арга хэрэглэж үзээгүй", "Мэргэжлийн дэмжлэг аваагүй", "Тодорхой саад байгаагүй"]);
const BRANCH_PREFIXES = Object.freeze({ "Q-SEX": ["MC-", "PREG-", "MENO-"], "MC-GATE": ["MC-"], "ALC-GATE": ["ALC-"], "TOB-GATE": ["TOB-"], "PREG-GATE": ["PREG-"], "Q-METHOD-PAST": ["Q-METHOD-LONGEST", "Q-METHOD-DURATION", "Q-METHOD-STOP", "Q-METHOD-RESULT", "Q-METHOD-REGAIN", "Q-METHOD-SUPPORT", "Q-METHOD-MEDICATION"] });

function createState() {
  return { safetyResult: null, safetyCheckId: "", contactGroupId: "", assessmentId: "", assessmentStatus: "", questionnaireVersion: questionApi?.QUESTIONNAIRE_VERSION || "", payment: { status: "idle" },
    answers: {}, questionIndex: 0, validationError: "", report: null, recovery: { recoveryId: "", message: "", error: "" },
    inviteToken: "", invitation: null, advisor: { profile: null, dashboard: null, temporaryPasswordChange: false, error: "" },
    admin: { authenticated: false, owner: false, created: null, reportCandidates: [], regenerationKeys: {}, regenerated: null, error: "",
      analytics: { preset: "last7", startDate: "", endDate: "", days: [], priorDays: [], summary: null, priorSummary: null, loading: false, error: "" } }, ownerPreview: false, busy: false, slowSave: false };
}
let state = createState();
let testComingSoonOverride = null;
function isComingSoon() { return testComingSoonOverride === null ? WEIGHT_TEST_COMING_SOON_MODE : testComingSoonOverride; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
function escapeAttribute(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }
function supportContactLink() { return `<a href="mailto:${escapeAttribute(SUPPORT_EMAIL)}">${escapeHtml(SUPPORT_EMAIL)}</a>`; }

const ANALYTICS_COOKIE = "jingeehas_analytics";
function browserUuid() { if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID(); return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, token => { const value = Math.random() * 16 | 0; return (token === "x" ? value : (value & 3) | 8).toString(16); }); }
function analyticsIdentity(now = Date.now()) {
  if (typeof document === "undefined") return {};
  let saved = {};
  try { const raw = document.cookie.split(";").map(item => item.trim()).find(item => item.startsWith(`${ANALYTICS_COOKIE}=`)); if (raw) saved = JSON.parse(decodeURIComponent(raw.slice(ANALYTICS_COOKIE.length + 1))); } catch { saved = {}; }
  const params = new URLSearchParams(window.location.search); const touch = {};
  for (const key of ["source", "medium", "campaign", "content", "term"]) { const value = params.get(`utm_${key}`); if (value) touch[`utm${key[0].toUpperCase()}${key.slice(1)}`] = value.slice(0, 100); }
  try { if (document.referrer) touch.referrerHost = new URL(document.referrer).hostname; } catch {}
  const expired = !Number(saved.seen) || now - Number(saved.seen) > 30 * 60 * 1000;
  const next = { visitorId: /^[0-9a-f-]{36}$/i.test(saved.visitorId || "") ? saved.visitorId : browserUuid(),
    sessionId: !expired && /^[0-9a-f-]{36}$/i.test(saved.sessionId || "") ? saved.sessionId : browserUuid(), seen: now,
    firstTouch: saved.firstTouch || touch };
  document.cookie = `${ANALYTICS_COOKIE}=${encodeURIComponent(JSON.stringify(next))}; Path=/; Max-Age=31536000; Secure; SameSite=Lax`;
  const width = window.innerWidth || 1024; return { visitorId: next.visitorId, sessionId: next.sessionId, ...next.firstTouch, ...touch,
    deviceClass: width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop" };
}
const trackedPageEvents = new Set();
function trackEvent(eventName, assessmentId = "", dedupeKey = "") {
  if (typeof fetch === "undefined" || typeof window === "undefined") return;
  const key = dedupeKey || `${eventName}:${assessmentId}`; if (trackedPageEvents.has(key)) return; trackedPageEvents.add(key);
  fetch("/.netlify/functions/analytics-collect", { method: "POST", credentials: "same-origin", keepalive: true,
    headers: { "content-type": "application/json" }, body: JSON.stringify({ eventId: browserUuid(), eventName, assessmentId: assessmentId || undefined, context: analyticsIdentity() }) }).catch(() => {});
}

const ROUTES = Object.freeze({
  "/": "landing", "/about": "about", "/methodology": "methodology", "/assessment/start": "assessmentStart", "/assessment/contact": "assessmentContact",
  "/assessment/questions": "questions", "/assessment/completed": "assessmentCompleted", "/assessment/payment": "payment", "/report": "report", "/recovery": "recovery"
  , "/advisor/login": "advisorLogin", "/advisor/dashboard": "advisorDashboard", "/admin": "admin",
  "/privacy": "privacy", "/terms": "terms", "/support": "support", "/data-deletion": "dataDeletion"
});
const OWNER_PREVIEW_ROUTES = new Set(["assessmentStart", "assessmentContact", "assessmentCompleted", "payment", "questions", "report", "recovery", "dataDeletion"]);
function routeName(pathname) { return ROUTES[String(pathname || "/").replace(/\/+$/, "") || "/"] || "notFound"; }
function navigation() { return `<nav class="site-nav" aria-label="Үндсэн цэс"><a href="/" data-route>Нүүр</a><a href="/about" data-route>Тестийн тухай</a><a href="/recovery" data-route>Тайлан сэргээх</a></nav>`; }
function footer() { return `<footer class="site-footer"><p>${PRODUCT.name}</p><nav aria-label="Арга зүй, хууль, тусламжийн холбоос"><a href="/methodology" data-route>Арга зүй</a> · <a href="/privacy" data-route>Нууцлалын бодлого</a> · <a href="/terms" data-route>Үйлчилгээний нөхцөл</a> · <a href="/support" data-route>Төлбөрийн тусламж</a> · <a href="/data-deletion" data-route>Өгөгдөл устгах хүсэлт</a></nav><p>Дэмжлэг: ${supportContactLink()}</p></footer>`; }

function renderLanding() {
  return `<div class="page landing-page">${navigation()}<main><section class="hero" aria-labelledby="page-title"><div class="hero-copy">
    <p class="eyebrow">Сэтгэлзүйн хэв маяг, далд зуршлын үнэлгээ</p><h1 id="page-title" tabindex="-1">${PRODUCT.name}</h1>
    <div class="approved-copy"><p>Илүүдэл жин үүсгэж буй сэтгэлзүйн шалтгаанаа илрүүл.</p><p>Ямар далд зуршлууд илүүдэл жин үүсэхэд нөлөөлж буйг тайлж мэд.</p><p>Жин хасахад тань тохирох дөт хэв маяг, дасгал сургуулилтын чиглэлээ мэдэж ав.</p></div>
    <p class="price">Үнэ: ${PRODUCT.displayPrice}</p><a class="button" href="/assessment/start" data-route>Тест бөглөх</a>
    </div><div class="hero-visual" aria-hidden="true"></div></section>
    <section class="methodology-summary" aria-labelledby="methodology-title">
      <div class="methodology-heading"><p class="eyebrow">Үнэлгээний зарчим</p><h2 id="methodology-title">Арга зүй ба судалгааны үндэслэл</h2>
      <p>Энэхүү үнэлгээний арга зүйг боловсруулахдаа хооллолтын зан үйл, сэтгэл хөдлөлөөс шалтгаалсан хооллолт, хяналт алдах эрсдэл, өөрийгөө зохицуулах итгэл, нойр, биеийн идэвх болон жинтэй холбоотой амьдралын чанарыг үнэлдэг олон улсад хэрэглэгддэг асуумж, клиникийн хүрээнүүдийг харьцуулан судалсан.</p>
      <p class="methodology-principle">Үнэлгээ нь нэг асуулт эсвэл нэг нийт оноогоор дүгнэхгүй. Таны хариултаас илэрч буй давтагдсан хэв маяг, болзошгүй саад болон аюулгүй байдлын дохиог тус тусад нь авч үзнэ.</p></div>
      <div class="methodology-pillars">
        <article><h3>Аюулгүй байдлын дохио</h3><p>Хооллолтын эмгэг, хяналт алдах зан үйл, сэтгэл зүйн өндөр ачаалал болон нойрны эрсдэлтэй холбоотой анхаарах шинж байгаа эсэхийг эхэлж шалгана.</p></article>
        <article><h3>Сэтгэлзүй ба зан үйлийн хэв маяг</h3><p>Сэтгэл хөдлөл, гаднын өдөөгч, хэт хязгаарлалт, цадалт ба өлсөлтийн дохио, өөрийгөө зохицуулах итгэл болон өмнөх жин хасах оролдлогын давталтыг хамтад нь авч үзнэ.</p></article>
        <article><h3>Өдөр тутмын саад ба орчны нөлөө</h3><p>Нойр, ядаргаа, хөдөлгөөний идэвх, ажлын хуваарь, гэр бүлийн орчин болон өдөр тутмын амьдралд жинтэй холбоотой үүсэж буй саадыг хамтад нь үнэлнэ.</p></article>
      </div>
      <div class="methodology-disclosure">
        <p><strong>Судалж харьцуулсан арга зүй:</strong> Арга зүйн судалгаанд TFEQ, DEBQ, AEBQ, EEQ, BEDS-7, SCOFF, WEL-SF, STOP-Bang, PHQ-9, IPAQ, IWQOL-Lite зэрэг хэрэгслүүд, мөн Obesity Canada, AACE, NICE-ийн жингийн менежментийн хүрээнүүдийг авч үзсэн.</p>
        <p>Эдгээр хэрэгслийг нэг багц болгон шууд хуулбарлаагүй. Харин ямар домайныг авч үзэх, ямар үед аюулгүй байдлын анхааруулга өгөх, ямар мэдээллийг мэргэжлийн тусламжтай холбох шаардлагатайг тодорхойлоход судалгааны суурь болгон ашигласан.</p>
        <h3>Тайлан хэрхэн гардаг вэ?</h3><p>Тайлан нь нэг хариултаар дүгнэлт хийхгүй. Хариултын давтамж, хоорондын уялдаа, давтагдсан нөхцөл, баталгаажуулсан ажиглалт болон аюулгүй байдлын дохиог хамтад нь авч үзэж, хамгийн чухал байж болох хэв маягийг эрэмбэлнэ.</p>
        <p class="methodology-limitation">Энэхүү тест үнэлгээ нь эмнэлгийн онош тавихгүй, хооллолтын эмгэгийг оношлохгүй бөгөөд эмч, сэтгэлзүйч, хоолзүйчийн үнэлгээг орлохгүй. Энэ нь таны жингийн менежментэд нөлөөлж болзошгүй хэв маягийг таньж ойлгох, аль чиглэлээс эхэлж ажиллахаа тодорхойлоход зориулсан мэдээллийн хэрэгсэл юм.</p>
        <a class="button secondary" href="/methodology" data-route>Арга зүйг дэлгэрэнгүй унших</a>
      </div>
    </section></main>${footer()}</div>`;
}
function renderAbout() {
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Тест үнэлгээний тухай</h1>
    <p>Таны шууд өгсөн хариултаас давтагдсан хэв маяг болон ажиглалтыг ялгаж, эхний зураглал гаргана. Төлбөр баталгаажсаны дараа тест бөглөж, бүрэн тайлангаа авна.</p>
    <p>Энэ нь эмнэлгийн онош, эмчилгээний зөвлөгөө биш.</p><a class="button" href="/assessment/start" data-route>Тест бөглөх</a></main>${footer()}</div>`;
}
function renderMethodology() {
  return `<div class="page">${navigation()}<main class="content-card methodology-page"><header><p class="eyebrow">Үнэлгээний ил тод тайлбар</p><h1 id="page-title" tabindex="-1">Арга зүй ба судалгааны үндэслэл</h1>
    <p>Энэхүү үнэлгээ нь жин хасахад хүндрэл учруулж болзошгүй сэтгэлзүй, зан үйл, нойр, хөдөлгөөн болон өдөр тутмын орчны хүчин зүйлсийг хамтатган авч үзнэ.</p>
    <p>Биеийн жинг зөвхөн хүсэл зориг, хоолны дэглэм эсвэл дасгал хөдөлгөөний нэг хүчин зүйлээр тайлбарлахгүй. Хүний нөхцөл, туршлага, эрүүл мэнд болон орчны нөлөө харилцан холбоотой байж болзошгүйг харгалзана.</p></header>
    <section aria-labelledby="eating-tools"><h2 id="eating-tools">Хооллолтын зан үйлийн судалгаа</h2>
      <p><strong>TFEQ / TFEQ-R18</strong> хэрэгслийн хязгаарлалт, хяналт алдах болон сэтгэл хөдлөлтэй холбоотой хооллолтыг ялган авч үздэг зарчмыг судалсан.</p>
      <p><strong>DEBQ</strong> хэрэгслийн сэтгэл хөдлөл, гаднын өдөөгч болон хязгаарласан хооллолтын хэв маягийг ялгах хандлагыг харьцуулсан.</p>
      <p><strong>AEBQ</strong> хэрэгслийн хоолонд хандах болон хоолноос зайлсхийх шинж, өлсөлт ба цадалтын мэдрэмжийг авч үздэг хүрээг судалсан.</p>
      <p><strong>EEQ</strong> хэрэгслийн сэтгэл хөдлөлөөс шалтгаалсан хооллолтын нөхцөлийг ажиглах хандлагыг харьцуулсан. Эдгээр хэрэгслийн асуултыг хуулбарлаагүй бөгөөд үйлдвэрлэлийн тест эдгээр хэмжүүрийг давтаж байна гэж үзэхгүй.</p>
    </section>
    <section aria-labelledby="safety-tools"><h2 id="safety-tools">Аюулгүй байдлын шалгалтын судалгаа</h2>
      <p><strong>BEDS-7</strong>, <strong>SCOFF</strong>, <strong>PHQ-9</strong>, <strong>STOP-Bang</strong> хэрэгслүүдийг хяналт алдах хооллолт, хооллолтын эмгэгийн анхаарах шинж, сэтгэл зүйн өндөр ачаалал болон нойрны эрсдэлийн дохиог хэрхэн ялгадаг талаас нь авч үзсэн.</p>
      <p>Энэ судалгаа нь эрсдэлийн дохио илэрвэл төлбөрөөс өмнө анхааруулах, шаардлагатай үед мэргэжлийн тусламж руу чиглүүлэх зарчимд мэдээлэл өгсөн. Тест нь эдгээр эмгэг, нөхцөлийг оношлохгүй.</p>
    </section>
    <section aria-labelledby="regulation-tools"><h2 id="regulation-tools">Өөрийгөө зохицуулах итгэл, хөдөлгөөн ба амьдралын ачаалал</h2>
      <p><strong>WEL / WEL-SF</strong> хэрэгслүүдийг өөр өөр нөхцөлд хооллолтоо зохицуулж чадна гэсэн итгэлийг ойлгох, <strong>IPAQ</strong>-ийг биеийн идэвхийн хэв маягийг авч үзэх, <strong>IWQOL-Lite</strong>-ийг жинтэй холбоотой өдөр тутмын үйл ажиллагаа болон амьдралын чанарт үзүүлэх нөлөөг ойлгох чиглэлээр судалсан.</p>
    </section>
    <section aria-labelledby="clinical-frameworks"><h2 id="clinical-frameworks">Жингийн менежментийн клиникийн хүрээнүүд</h2>
      <p><strong>Obesity Canada 5As</strong>, <strong>Obesity Canada 4Ms</strong>, <strong>AACE</strong>, <strong>NICE</strong>-ийн хүрээнүүдийг харьцуулан авч үзсэн.</p>
      <ul><li>Жингийн талаар ярилцахын өмнө зөвшөөрөл авах;</li><li>сэтгэл зүй, бие махбод, бодисын солилцоо болон нийгэм, орчны нөхцөлийг хамтад нь авч үзэх;</li><li>хүнд тохирсон бодит зорилго тодорхойлох;</li><li>шаардлагатай үед мэргэжлийн тусламж руу чиглүүлэх;</li><li>цахим хэрэгслийг онош биш, дэмжлэг болгон ашиглах.</li></ul>
    </section>
    <section aria-labelledby="report-principles"><h2 id="report-principles">Тайлан гаргах зарчим</h2>
      <p>Тайлан нь нэг хариулт эсвэл нэг нийт оноогоор дүгнэхгүй. Хариултын давтамж, хоорондын уялдаа, давтагдсан нөхцөл, баталгаажуулсан ажиглалт болон аюулгүй байдлын дохиог хамтад нь авч үзнэ. Нотолгоо хүрэлцэхгүй үед хатуу дүгнэлт хийхгүй бөгөөд ажиглалтыг болзошгүй хэв маяг гэж тайлбарлана.</p>
    </section>
    <section aria-labelledby="commercial-benchmark"><h2 id="commercial-benchmark">Үйлчилгээний туршлагын харьцуулалт</h2>
      <p><strong>Noom</strong>, <strong>WeightWatchers</strong>, <strong>Calibrate</strong>, <strong>Wegovy consumer quiz</strong>-ийг хэрэглэгчийг эхлүүлэх дараалал, аюулгүй байдлын шалгалт, мэргэжилтэн рүү чиглүүлэх болон хувь хүнд тохирсон төлөвлөгөө танилцуулах ерөнхий хэв маягийн түвшинд харьцуулсан.</p>
      <p>Энэ нь дээрх үйлчилгээтэй хамтран ажилладаг, тэдний зөвшөөрөл эсвэл дэмжлэгийг авсан гэсэн утга агуулахгүй.</p>
    </section>
    <section aria-labelledby="methodology-limitations"><h2 id="methodology-limitations">Арга зүйн хязгаарлалт</h2>
      <ul><li>Өөрийн мэдээлсэн хариултад дурсамжийн алдаа байж болно.</li><li>Нийгэмд таалагдах байдлаар хариулах хандлага нөлөөлж болно.</li><li>Монгол хэрэглэгчдийн орон нутгийн жишиг үзүүлэлт хараахан тогтоогдоогүй.</li><li>Энэхүү тест үнэлгээ нь онош тавихгүй.</li><li>Эмч, сэтгэлзүйч, хоолзүйчийн үнэлгээг орлохгүй.</li><li>Ирээдүйд яг хэдэн килограмм жин хасахыг таамаглах боломжгүй.</li></ul>
    </section>
    <footer class="methodology-version"><p><strong>Арга зүйн хувилбар:</strong> 1.0<br><strong>Сүүлийн шинэчлэл:</strong> 2026 оны 7 дугаар сар</p></footer>
  </main>${footer()}</div>`;
}
function renderComingSoon() {
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Тун удахгүй</h1>
    <p>Тест үнэлгээний сервер талын хамгаалалт, төлбөр болон тайлан сэргээх үйлдэл бүрэн баталгаажсаны дараа нээгдэнэ.</p>
    <a class="button secondary" href="/" data-route>Нүүр рүү буцах</a></main>${footer()}</div>`;
}
function safetyGuidance(result) {
  const guidance = result.guidance || {};
  return `<div class="page"><main class="content-card safety-route" aria-live="polite"><h1 id="page-title" tabindex="-1">${escapeHtml(guidance.title || "Аюулгүй байдлын зөвлөмж")}</h1>
    <p>${escapeHtml(guidance.body || "")}</p><p class="notice">Энэ зөвлөмж төлбөргүй.</p>
    <a class="button danger" href="tel:103">${escapeHtml(guidance.action || "Тусламж авах")}</a></main>${footer()}</div>`;
}
function renderSafetyGate() {
  if (state.safetyResult && state.safetyResult.route !== "eligible") return safetyGuidance(state.safetyResult);
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Төлбөрөөс өмнөх аюулгүй байдлын шалгалт</h1>
    <p>Энэ хэсэг төлбөргүй. Тест үнэлгээ танд тохирох эсэхийг эхэлж шалгана.</p>
    <form id="safety-form" novalidate>
      <label class="field" for="safety-age"><span>Таны нас</span><input id="safety-age" name="age" type="number" min="1" max="120" required></label>
      ${radioGroup("selfHarm", "Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?", ["Үгүй", "Өнгөрсөнд байсан", "Одоо хааяа бодогддог", "Одоо идэвхтэй бодогдож байна", "Хариулахгүй"], true)}
      ${checkboxGroup("acuteMedical", "Одоо дараах шинжээс аль нэг нь илэрч байна уу?", ["Будилах", "Ухаан балартах", "Бие огцом муудах", "Аль нь ч үгүй"], true)}
      ${radioGroup("compensatoryBehavior", "Идсэнээ буцаахын тулд зориудаар бөөлжих, туулгах эм хэрэглэх, хэт их дасгал хийх эсвэл олон цаг хоолгүй явах тохиолдол гардаг уу?", ["Үгүй", "Өмнө байсан", "Одоо хааяа", "Одоо давтагддаг", "Хариулахгүй"], true)}
      ${radioGroup("medicalSuitability", "Эмчтэй эхэлж зөвлөлдөх шаардлагатай гэж танд өмнө нь хэлж байсан уу?", ["Үргэлжлүүлэхэд тохиромжтой", "Эмчтэй эхэлж зөвлөлдөх шаардлагатай", "Хариулахгүй"], true)}
      <p id="safety-error" class="error" role="alert" aria-live="assertive"></p><button class="button" type="submit" ${state.busy ? "disabled" : ""}>Тохирох эсэхийг шалгах</button>
    </form></main>${footer()}</div>`;
}
function radioGroup(name, legend, options, required = false) {
  return `<fieldset><legend>${escapeHtml(legend)}</legend>${options.map(option => `<label class="option-label"><input type="radio" name="${escapeAttribute(name)}" value="${escapeAttribute(option)}" ${required ? "required" : ""}><span>${escapeHtml(option)}</span></label>`).join("")}</fieldset>`;
}
function checkboxGroup(name, legend, options) {
  return `<fieldset><legend>${escapeHtml(legend)}</legend>${options.map(option => `<label class="option-label"><input type="checkbox" name="${escapeAttribute(name)}" value="${escapeAttribute(option)}"><span>${escapeHtml(option)}</span></label>`).join("")}</fieldset>`;
}
function renderAssessmentContact() {
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Тайлан авах мэдээллээ хадгалах</h1>
    ${state.invitation ? `<section class="invite-card"><h2>Зөвлөхийн урилга ирсэн байна</h2><p>${escapeHtml(state.invitation.advisorName || "Зөвлөх")} танд энэ тест үнэлгээг санал болгосон байна.</p><form id="consent-form"><fieldset><legend>Тайлан хуваалцах зөвшөөрөл</legend><label class="option-label"><input type="radio" name="consent" value="yes" required><span>Би тест үнэлгээний бүрэн тайланг ${escapeHtml(state.invitation.advisorName || "Зөвлөх")} зөвлөх харахыг зөвшөөрч байна.</span></label><label class="option-label"><input type="radio" name="consent" value="no" required><span>Бүрэн тайлангаа хуваалцахгүй.</span></label></fieldset><p>Миний асуулт бүрд өгсөн түүхий хариултыг тусад нь харуулахгүй.</p><button class="button" type="submit">Сонголтоо баталгаажуулах</button></form></section>` : `<form id="contact-form" novalidate><p>Имэйл хаягаа оруулна уу. Бүрэн тайлангаа өөр төхөөрөмжөөс сэргээхэд ашиглана. Утсаар сэргээх үйлчилгээ одоогоор нээгдээгүй.</p>
      <label class="field" for="contact-email"><span>Имэйл</span><input id="contact-email" name="email" type="email" autocomplete="email" required></label>
      <p id="contact-error" class="error" role="alert" aria-live="assertive"></p><button class="button" type="submit" ${state.busy ? "disabled" : ""}>Мэдээллээ хадгалаад тест рүү үргэлжлүүлэх</button></form>`}</main>${footer()}</div>`;
}
function renderAssessmentCompleted() {
  const completed = state.assessmentStatus === "complete";
  return `<div class="page">${navigation()}<main class="content-card completion-card"><p class="completion-mark" aria-hidden="true">✓</p><h1 id="page-title" tabindex="-1">Таны хариултуудыг цуглуулж дууслаа</h1>
    <p>Таны өгсөн хариултуудад үндэслэн жин хасахад тань нөлөөлж буй сэтгэлзүйн хэв маяг, далд зуршил болон тогтвортой өөрчлөлт хийхэд саад болж буй хүчин зүйлсийг нэгтгэн тайлан боловсруулна.</p>
    <p>Дэлгэрэнгүй тайландаа та:</p><ul><li>жин хасалтад саад болж буй гол сэтгэлзүйн шалтгаанууд;</li><li>хооллолт, сэтгэл хөдлөл, зуршлын холбоо;</li><li>өмнөх оролдлогууд яагаад тогтвортой үргэлжлээгүй байж болох шалтгаан;</li><li>танд илүү тохирох өөрчлөлтийн чиглэл</li></ul><p>зэргийг харна.</p>
    <p class="price">Бүрэн тайлангийн үнэ: ${PRODUCT.displayPrice}</p>
    ${completed ? `<button class="button" type="button" data-action="continue-to-payment" ${state.busy ? "disabled" : ""}>${state.busy ? "Үргэлжлүүлж байна..." : "Дэлгэрэнгүй тайлангаа авах"}</button>` : `<p class="notice">Тест үнэлгээг бүрэн дуусгасны дараа тайлангийн төлбөр рүү үргэлжлүүлнэ.</p>`}
    <p class="muted">Төлбөр төлсний дараа тайлан тань шууд нээгдэнэ.</p></main>${footer()}</div>`;
}
function renderPayment() {
  const payment = state.payment || { status: "idle" };
  const statusCopy = payment.status === "paid" ? PAYMENT_COPY.paidBeforeTest : PAYMENT_COPY[payment.status] || "";
  const createBlocked = ["creating", "create_error", "create_unknown", "reconciling", "create_failed_confirmed"].includes(payment.status);
  const paymentReady = state.assessmentStatus === "complete";
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Бүрэн тайлангаа нээх</h1>
      <p>Жин хасалтад тань нөлөөлж буй сэтгэлзүйн шалтгаан, хэв маяг болон танд тохирох өөрчлөлтийн чиглэлийг агуулсан бүрэн тайлангаа нээнэ үү.</p>
      <section aria-labelledby="payment-title"><h2 id="payment-title">QPay нэхэмжлэл</h2><p class="price">Үнэ: ${PRODUCT.displayPrice}</p>
        ${paymentReady ? "" : `<p class="notice">QPay төлбөрийн товч тест үнэлгээг бүрэн дуусгасны дараа нээгдэнэ.</p>`}
        <p class="payment-status" role="status" aria-live="polite">${escapeHtml(statusCopy)}</p>
        ${payment.status !== "paid" && payment.qrImage ? `<img class="qpay-qr" src="data:image/png;base64,${escapeAttribute(payment.qrImage)}" alt="QPay QR код">` : ""}
        ${payment.status !== "paid" && payment.expiresAt ? `<p>Нэхэмжлэлийн хугацаа: <time datetime="${escapeAttribute(payment.expiresAt)}">${escapeHtml(new Date(payment.expiresAt).toLocaleString("mn-MN"))}</time></p>` : ""}
        ${["pending", "check_error", "paid_but_not_unlocked"].includes(payment.status) ? `<button class="button" type="button" data-action="check-payment">${payment.status === "paid_but_not_unlocked" ? "Тайлангийн эрхээ дахин нээх" : "Төлбөр шалгах"}</button>` : payment.status === "paid" ? `<a class="button" href="/report" data-route>Бүрэн тайлан харах</a>` : !paymentReady || createBlocked ? "" : `<button class="button" type="button" data-action="create-invoice">${PRODUCT.displayPrice}-ийн QPay нэхэмжлэл үүсгэх</button>`}
      </section></main>${footer()}</div>`;
}
function renderQuestionInput(question, value) {
  const validity = `aria-invalid="${state.validationError ? "true" : "false"}" aria-describedby="question-error"`;
  if (question.type === "number") return `<label class="field" for="answer-${question.id}"><span>${escapeHtml(question.text)} (${escapeHtml(question.unit)})</span><input id="answer-${question.id}" data-question="${question.id}" type="number" min="${question.min}" max="${question.max}" value="${escapeAttribute(value || "")}" ${validity} ${question.required ? "required" : ""}></label>`;
  if (question.type === "text") return `<label class="field" for="answer-${question.id}"><span>${escapeHtml(question.text)}</span><textarea id="answer-${question.id}" data-question="${question.id}" maxlength="${question.maxLength}" ${validity}>${escapeHtml(value || "")}</textarea></label>`;
  const values = Array.isArray(value) ? value : [];
  const type = question.type === "multi" ? "checkbox" : "radio";
  return `<fieldset><legend>${escapeHtml(question.text)}</legend>${question.options.map(option => `<label class="option-label"><input type="${type}" name="answer-${question.id}" data-question="${question.id}" value="${escapeAttribute(option)}" ${validity} ${(type === "checkbox" ? values.includes(option) : value === option) ? "checked" : ""}><span>${escapeHtml(option)}</span></label>`).join("")}</fieldset>`;
}
function renderQuestions() {
  const questions = questionApi.visibleQuestions(state.answers, state.questionnaireVersion);
  state.questionIndex = Math.min(state.questionIndex, Math.max(0, questions.length - 1));
  const question = questions[state.questionIndex];
  const percent = Math.round(((state.questionIndex + 1) / questions.length) * 100);
  return `<div class="page assessment-page"><main class="content-card"><progress role="progressbar" aria-label="Тест бөглөх явц" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" value="${percent}" max="100">${percent}%</progress>
    <p>${state.questionIndex + 1} / ${questions.length}</p><h1 id="page-title" tabindex="-1">${escapeHtml(question.section)}</h1>
    <p class="muted">Өөрт хамгийн ойр хариултаа сонгоорой. Таны хариултын зураглал тест дууссаны дараа гарна.</p>
    <form id="question-form" novalidate aria-busy="${state.busy ? "true" : "false"}">${renderQuestionInput(question, state.answers[question.id])}<p id="question-error" class="error" role="alert" aria-live="assertive">${escapeHtml(state.validationError)}</p>
      <div class="save-status" role="status" aria-live="polite">${state.busy ? `<span class="spinner" aria-hidden="true"></span>${state.slowSave ? "Хариултыг хадгалж байна..." : "Хадгалж байна..."}` : ""}</div>
      <div class="actions">${state.questionIndex > 0 ? `<button class="button secondary" type="button" data-action="previous-question" ${state.busy ? "disabled" : ""}>Буцах</button>` : ""}<button class="button" type="submit" ${state.busy ? "disabled" : ""}>${state.busy ? "Хадгалж байна..." : state.questionIndex === questions.length - 1 ? "Тестийг дуусгах" : "Үргэлжлүүлэх"}</button></div>
    </form></main>${footer()}</div>`;
}
function renderReportParagraphs(values = []) { return values.filter(Boolean).map(value => `<p>${escapeHtml(value)}</p>`).join(""); }
function renderPlanDetails(plan) {
  if (!plan) return "";
  const fields = plan.kind === "emotional_observation"
    ? [["Ажиглах мөч", plan.trigger], ["Хийх нэг үйлдэл", plan.action], ["Юуг ажиглах вэ?", plan.observe], ["Юуг өөрчлөхгүй вэ?", plan.keepConstant], ["Амжилтыг хэрхэн таних вэ?", plan.success], ["Алгассан ажиглалтын дараа", plan.fallback]]
    : plan.kind === "meal_timing_observation"
      ? [["Туршиж буй нэг зүйл", plan.variable], ["Юуг ажиглах вэ?", plan.observe], ["Юуг өөрчлөхгүй вэ?", plan.keepConstant], ["Амжилтыг хэрхэн таних вэ?", plan.success], ["Алгассан өдрийн дараа", plan.fallback]]
    : [["Туршиж буй нэг зүйл", plan.variable], ["Хугацаа", plan.duration], ["Хийх хувилбар", plan.option], ["Өмнөх гэмтэлтэй холбоотой зовиур", plan.injuryBoundary], ["Нэмэлт зардал", plan.additionalCost], ["Тогтмол хийх мөч", plan.anchor], ["Давтамж", plan.frequency], ["Юуг тэмдэглэх вэ?", plan.record], ["Амжилтыг хэрхэн хэмжих вэ?", plan.success], ["Завгүй өдрийн богино хувилбар", plan.fallback], ["Алгассан өдрийн дүрэм", plan.maintenanceRule]];
  const visibleFields = fields.filter(([, value]) => value);
  return visibleFields.length ? `<dl>${visibleFields.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("")}</dl>` : "";
}

function buildReportSections(full) {
  if (full.neutralResult) {
    const neutral = full.neutralResult;
    const strengths = neutral.strengths?.length ? neutral.strengths : [neutral.strengthsFallback].filter(Boolean);
    const absent = neutral.notStronglySupported?.length ? neutral.notStronglySupported : [neutral.notStronglySupportedFallback].filter(Boolean);
    return [
      { id: "overview", heading: "Ерөнхий зураг", paragraphs: [renderReportParagraphs(neutral.overview)], visible: neutral.overview?.length > 0 },
      { id: "not-strongly-supported", heading: "Ямар нийтлэг саад хүчтэй илрээгүй вэ?", paragraphs: [renderReportParagraphs(absent)], visible: absent.length > 0 },
      { id: "strengths", heading: "Танд байгаа давуу тал", paragraphs: [renderReportParagraphs(strengths)], visible: strengths.length > 0 },
      { id: "limits", heading: "Энэ асуумжаар юуг дүгнэж болохгүй вэ?", paragraphs: [renderReportParagraphs(neutral.limits)], visible: neutral.limits?.length > 0 },
      { id: "observation", heading: "Дараагийн хугацаанд юу ажиглаж болох вэ?", paragraphs: [`<dl><dt>Туршиж буй нэг зүйл</dt><dd>${escapeHtml(neutral.observation?.variable)}</dd><dt>Ажиглах нэг зүйл</dt><dd>${escapeHtml(neutral.observation?.action)}</dd><dt>Юуг өөрчлөхгүй вэ?</dt><dd>${escapeHtml(neutral.observation?.keepConstant)}</dd><dt>Дараагийн шийдвэрийн дүрэм</dt><dd>${escapeHtml(neutral.observation?.decisionRule)}</dd></dl>`], visible: Boolean(neutral.observation?.variable && neutral.observation?.action && neutral.observation?.decisionRule) },
      { id: "professional", heading: "Хэзээ мэргэжлийн хүнтэй зөвлөлдөх вэ?", paragraphs: [renderReportParagraphs([neutral.professionalScope])], visible: Boolean(neutral.professionalScope) }
    ];
  }
  const major = full.influencingPatterns || [];
  const compactMultiPattern = major.length >= 3;
  const actions = (full.additionalPatternActions || []).filter(item => item?.action && (item.patternTitle || item.patternId));
  const patternHeading = major.length <= 1 ? "Жин хасалтад нөлөөлж буй гол хэв маяг" : "Жин хасалтад нөлөөлж буй гол хэв маягууд";
  const interactionHeading = major.length === 1 ? "Гол хэв маяг өдөр тутмын нөхцөлтэй хэрхэн холбогдож байна вэ?" : "Эдгээр хэв маяг хэрхэн хоорондоо холбогдож байна вэ?";
  return [
    { id: "overview", heading: "Таны хариултаас харагдсан ерөнхий зураг", paragraphs: [renderReportParagraphs(Array.isArray(full.overallPicture) ? full.overallPicture : [full.overallPicture])], visible: Boolean(full.overallPicture) },
    { id: "patterns", heading: patternHeading, paragraphs: [major.map(pattern => `<article><h3>${escapeHtml(pattern.title)}</h3>${renderReportParagraphs(pattern.paragraphs || (compactMultiPattern ? [pattern.evidenceSummary, pattern.effectOnWeightLoss, pattern.uncertainty] : [pattern.explanation, pattern.evidenceSummary, pattern.effectOnWeightLoss, pattern.uncertainty]))}</article>`).join("")], visible: major.length > 0 },
    { id: "interactions", heading: interactionHeading, paragraphs: [(full.interactionSummary || []).map(item => `<p>${escapeHtml(item.explanation)}</p>`).join("")], visible: (full.interactionSummary || []).length > 0 },
    { id: "context", heading: "Нэмэлт нөлөөлөгч нөхцөл", paragraphs: [(full.contextualFactors || []).map(item => `<article><h3>${escapeHtml(item.title)}</h3>${renderReportParagraphs([item.summary || item.explanation, ...(item.summary ? [] : [item.evidenceSummary, item.effectOnWeightLoss])])}</article>`).join("")], visible: (full.contextualFactors || []).length > 0 },
    { id: "previous", heading: "Өмнөх оролдлого яагаад үргэлжлээгүй байж болох вэ?", paragraphs: [full.previousAttemptAnalysis ? renderReportParagraphs(full.previousAttemptAnalysis.paragraphs || [full.previousAttemptAnalysis.summary, full.previousAttemptAnalysis.interpretation]) : ""], visible: Boolean(full.previousAttemptAnalysis) },
    { id: "strengths", heading: "Танд байгаа давуу тал", paragraphs: [renderReportParagraphs([full.protectiveSectionSummary, ...(!full.protectiveSectionSummary ? (full.protectiveFactors || []).map(item => item.text) : []), ...(full.contradictions || []).map(item => item.text)])], visible: Boolean(full.protectiveSectionSummary || (full.protectiveFactors || []).length || (full.contradictions || []).length) },
    { id: "direction", heading: "Танд илүү тохирох өөрчлөлтийн чиглэл", paragraphs: [actions.map(item => `<article><h3>${escapeHtml(item.patternTitle || major.find(pattern => pattern.id === item.patternId)?.title || "Өөрчлөлтийн чиглэл")}</h3>${renderReportParagraphs(compactMultiPattern ? [item.action] : [item.action, item.reason])}</article>`).join("")], visible: actions.length > 0 },
    { id: "experiment", heading: "Эхний туршилт", paragraphs: [full.prioritizedStartingAction && !full.planDecisionPending && !full.prioritizedStartingAction.planDecisionPending ? `${renderReportParagraphs(compactMultiPattern ? [full.prioritizedStartingAction.action, full.prioritizedStartingAction.priorityReason || full.prioritizedStartingAction.reason] : [full.prioritizedStartingAction.action, full.prioritizedStartingAction.reason, full.prioritizedStartingAction.priorityReason])}${renderPlanDetails(full.prioritizedStartingAction.plan)}` : ""], visible: Boolean(full.prioritizedStartingAction && !full.planDecisionPending && !full.prioritizedStartingAction.planDecisionPending) },
    { id: "avoid", heading: "Одоогоор юуг зэрэг өөрчлөхгүй байх вэ?", paragraphs: [renderReportParagraphs([full.avoidForNow])], visible: Boolean(full.avoidForNow) },
    { id: "guidance", heading: "Хэзээ мэргэжлийн хүнтэй зөвлөлдөх вэ?", paragraphs: [renderReportParagraphs([full.professionalGuidance, full.urgentGuidance])], visible: Boolean(full.professionalGuidance || full.urgentGuidance) }
  ];
}

function renderMultiFactorReport(full) {
  const visibleSections = buildReportSections(full).filter(section => section.visible);
  return `${navigation()}<main id="report-content" class="report-content"><header class="report-header"><p>${escapeHtml(full.productName)}</p><h1 id="page-title" tabindex="-1">Бүрэн тайлан</h1><time datetime="${escapeAttribute(full.reportDate)}">${escapeHtml(new Date(full.reportDate).toLocaleDateString("mn-MN"))}</time></header>
    ${visibleSections.map((section, index) => `<section class="report-section" data-report-section="${escapeAttribute(section.id)}"><h2>${index + 1}. ${escapeHtml(section.heading)}</h2>${section.paragraphs.join("")}</section>`).join("")}
    <button class="button print-hide" type="button" data-action="print-report">Хэвлэх эсвэл PDF-ээр хадгалах</button></main>${footer()}`;
}
function renderReport() {
  const report = state.report;
  if (!report) return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Тайлан</h1><p role="status">Тайланг ачаалж байна…</p></main>${footer()}</div>`;
  if (report.safetyRoute) return safetyGuidance({ guidance: report.initialView?.guidance, route: report.safetyRoute });
  if (!report.fullReport) return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Эхний зураглал</h1><p>${escapeHtml(report.initialView?.coverage || "")}</p><p>Бүрэн тайлан нээх эрх серверээс баталгаажаагүй байна.</p></main>${footer()}</div>`;
  const full = report.fullReport;
  if (Array.isArray(full.influencingPatterns)) return `<div class="page report-page">${renderMultiFactorReport(full)}</div>`;
  return `<div class="page report-page">${navigation()}<main id="report-content" class="report-content"><header class="report-header"><p>${escapeHtml(full.productName)}</p><h1 id="page-title" tabindex="-1">Бүрэн тайлан</h1><time datetime="${escapeAttribute(full.reportDate)}">${escapeHtml(new Date(full.reportDate).toLocaleDateString("mn-MN"))}</time></header>
    <p class="coverage">${escapeHtml(full.coverage)}</p>${full.sections.map(section => `<section class="report-section"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p></section>`).join("")}
    ${full.experiment ? `<section class="report-section"><h2>Хэрэгжүүлж үзэх нэг өөрчлөлт</h2><dl><dt>Өөрчлөх нэг зүйл</dt><dd>${escapeHtml(full.experiment.variable)}</dd><dt>Юу хийх вэ?</dt><dd>${escapeHtml(full.experiment.action)}</dd><dt>Юуг ажиглах вэ?</dt><dd>${escapeHtml(full.experiment.observe)}</dd><dt>Юуг өөрчлөхгүй хэвээр үлдээх вэ?</dt><dd>${escapeHtml(full.experiment.keepConstant)}</dd></dl></section>` : ""}
    <button class="button print-hide" type="button" data-action="print-report">Хэвлэх эсвэл PDF-ээр хадгалах</button></main>${footer()}</div>`;
}
function renderRecovery() {
  const recovery = state.recovery;
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Тайлан сэргээх</h1>
    ${!recovery.recoveryId ? `<form id="recovery-request-form" novalidate><p>Төлбөр хийхдээ ашигласан имэйл хаягаа оруулна уу. Утсаар сэргээх үйлчилгээ одоогоор нээгдээгүй.</p><label class="field"><span>Имэйл</span><input name="email" type="email" autocomplete="email" required></label><button class="button" type="submit">Баталгаажуулах код авах</button></form>` : `<form id="recovery-confirm-form"><p>${escapeHtml(recovery.message)}</p><label class="field"><span>Баталгаажуулах код</span><input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required></label><button class="button" type="submit">Тайлан сэргээх</button></form>`}
    <p class="error" role="alert" aria-live="assertive">${escapeHtml(recovery.error)}</p><p>Сэргээхэд тусламж хэрэгтэй бол ${supportContactLink()} хаягаар холбогдоно уу.</p></main>${footer()}</div>`;
}
function money(value) { return `${Number(value || 0).toLocaleString("en-US")}₮`; }
function isoDay(date) { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit" }).format(date); }
function shiftDay(day, offset) { const date = new Date(`${day}T12:00:00+08:00`); date.setUTCDate(date.getUTCDate() + offset); return isoDay(date); }
function analyticsRange(preset, now = new Date()) {
  const today = isoDay(now); const monthStart = `${today.slice(0, 8)}01`;
  if (preset === "today") return { startDate: today, endDate: today };
  if (preset === "yesterday") { const yesterday = shiftDay(today, -1); return { startDate: yesterday, endDate: yesterday }; }
  if (preset === "last30") return { startDate: shiftDay(today, -29), endDate: today };
  if (preset === "thisMonth") return { startDate: monthStart, endDate: today };
  if (preset === "previousMonth") { const endDate = shiftDay(monthStart, -1); return { startDate: `${endDate.slice(0, 8)}01`, endDate }; }
  return { startDate: shiftDay(today, -6), endDate: today };
}
function analyticsTotals(days = []) { return days.reduce((total, day) => ({ uniqueVisitors: total.uniqueVisitors + Number(day.uniqueVisitors || 0), landingViews: total.landingViews + Number(day.landingViews || 0),
  assessmentsStarted: total.assessmentsStarted + Number(day.assessmentsStarted || 0), assessmentsCompleted: total.assessmentsCompleted + Number(day.assessmentsCompleted || 0),
  paywallViews: total.paywallViews + Number(day.paywallViews || 0), invoicesCreated: total.invoicesCreated + Number(day.invoicesCreated || 0),
  paymentsConfirmed: total.paymentsConfirmed + Number(day.paymentsConfirmed || 0), revenueMnt: total.revenueMnt + Number(day.revenueMnt || 0) }),
  { uniqueVisitors: 0, landingViews: 0, assessmentsStarted: 0, assessmentsCompleted: 0, paywallViews: 0, invoicesCreated: 0, paymentsConfirmed: 0, revenueMnt: 0 }); }
function rate(numerator, denominator) { return denominator ? `${(100 * numerator / denominator).toFixed(1)}%` : "—"; }
function comparison(current, prior) { if (!prior) return "Өмнөх хугацаатай харьцуулах боломжгүй"; const change = 100 * (current - prior) / prior; return `Өмнөх хугацаанаас ${change >= 0 ? "+" : ""}${change.toFixed(1)}%`; }
function renderAdminAnalytics() {
  const analytics = state.admin.analytics; const total = analytics.summary || analyticsTotals(analytics.days); const prior = analytics.priorSummary || analyticsTotals(analytics.priorDays);
  const card = (label, value, conversion, key) => `<article><h3>${label}</h3><p class="metric-value">${value}</p><p>${conversion}</p><p class="metric-compare">${comparison(total[key], prior[key])}</p></article>`;
  const stages = [["Зочилсон", total.uniqueVisitors], ["Тест эхлүүлсэн", total.assessmentsStarted], ["Тест дуусгасан", total.assessmentsCompleted], ["Paywall харсан", total.paywallViews], ["Нэхэмжлэл үүсгэсэн", total.invoicesCreated], ["Төлбөр төлсөн", total.paymentsConfirmed]];
  return `<section class="analytics-dashboard" aria-labelledby="analytics-title"><h2 id="analytics-title">Өдөр тутмын үзүүлэлт</h2><p>Цагийн бүс: Улаанбаатар</p>
    <form id="analytics-filter-form" class="analytics-filters"><label><span>Хугацаа</span><select name="preset"><option value="today"${analytics.preset === "today" ? " selected" : ""}>Өнөөдөр</option><option value="yesterday"${analytics.preset === "yesterday" ? " selected" : ""}>Өчигдөр</option><option value="last7"${analytics.preset === "last7" ? " selected" : ""}>Сүүлийн 7 хоног</option><option value="last30"${analytics.preset === "last30" ? " selected" : ""}>Сүүлийн 30 хоног</option><option value="thisMonth"${analytics.preset === "thisMonth" ? " selected" : ""}>Энэ сар</option><option value="previousMonth"${analytics.preset === "previousMonth" ? " selected" : ""}>Өмнөх сар</option><option value="custom"${analytics.preset === "custom" ? " selected" : ""}>Өөр хугацаа</option></select></label><label><span>Эхлэх өдөр</span><input type="date" name="startDate" value="${escapeAttribute(analytics.startDate)}"></label><label><span>Дуусах өдөр</span><input type="date" name="endDate" value="${escapeAttribute(analytics.endDate)}"></label><button class="button compact" type="submit">Харах</button></form>
    ${analytics.loading ? `<p role="status">Үзүүлэлтийг ачаалж байна…</p>` : ""}${analytics.error ? `<p class="error">${escapeHtml(analytics.error)}</p>` : ""}
    <div class="metric-grid analytics-metrics">${card("Зочилсон хүн", total.uniqueVisitors, `Эхлүүлсэн: ${rate(total.assessmentsStarted, total.uniqueVisitors)}`, "uniqueVisitors")}${card("Тест эхлүүлсэн", total.assessmentsStarted, `Дуусгасан: ${rate(total.assessmentsCompleted, total.assessmentsStarted)}`, "assessmentsStarted")}${card("Тест дуусгасан", total.assessmentsCompleted, `Paywall: ${rate(total.paywallViews, total.assessmentsCompleted)}`, "assessmentsCompleted")}${card("Paywall харсан", total.paywallViews, `Нэхэмжлэл: ${rate(total.invoicesCreated, total.paywallViews)}`, "paywallViews")}${card("Төлбөр төлсөн", total.paymentsConfirmed, `Нэхэмжлэлээс: ${rate(total.paymentsConfirmed, total.invoicesCreated)}`, "paymentsConfirmed")}${card("Орлого", money(total.revenueMnt), `Зочиноос төлбөр: ${rate(total.paymentsConfirmed, total.uniqueVisitors)}`, "revenueMnt")}</div>
    <ol class="funnel-visual" aria-label="Үндсэн хөрвөлтийн дараалал">${stages.map(([label, value], index) => `<li><span>${label}</span><strong>${value}</strong>${index ? `<small>${rate(value, stages[index - 1][1])}</small>` : ""}</li>`).join("")}</ol>
    <div class="table-scroll" tabindex="0"><table><thead><tr><th>Огноо</th><th>Зочин</th><th>Эхэлсэн</th><th>Эхлэх хувь</th><th>Дууссан</th><th>Дуусгах хувь</th><th>Paywall</th><th>Paywall хүрэлт</th><th>Нэхэмжлэл</th><th>Нэхэмжлэл үүсгэх хувь</th><th>Төлбөр</th><th>Нэхэмжлэл төлөгдөх хувь</th><th>Paywall төлөгдөх хувь</th><th>Нийт худалдан авалт</th><th>Орлого</th></tr></thead><tbody>${analytics.days.map(day => `<tr><td>${escapeHtml(day.date)}</td><td>${day.uniqueVisitors}</td><td>${day.assessmentsStarted}</td><td>${rate(day.assessmentsStarted, day.uniqueVisitors)}</td><td>${day.assessmentsCompleted}</td><td>${rate(day.assessmentsCompleted, day.assessmentsStarted)}</td><td>${day.paywallViews}</td><td>${rate(day.paywallViews, day.assessmentsCompleted)}</td><td>${day.invoicesCreated}</td><td>${rate(day.invoicesCreated, day.paywallViews)}</td><td>${day.paymentsConfirmed}</td><td>${rate(day.paymentsConfirmed, day.invoicesCreated)}</td><td>${rate(day.paymentsConfirmed, day.paywallViews)}</td><td>${rate(day.paymentsConfirmed, day.uniqueVisitors)}</td><td>${money(day.revenueMnt)}</td></tr>`).join("")}</tbody></table></div></section>`;
}
function renderAdvisorLogin() {
  if (state.advisor.temporaryPasswordChange) return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Нууц үгээ солино уу</h1><form id="advisor-password-form"><label class="field"><span>Одоогийн нууц үг</span><input name="currentPassword" type="password" autocomplete="current-password" required></label><label class="field"><span>Шинэ нууц үг</span><input name="newPassword" type="password" autocomplete="new-password" minlength="12" required></label><button class="button" type="submit">Нууц үг солих</button></form><p class="error">${escapeHtml(state.advisor.error)}</p></main></div>`;
  return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Зөвлөх нэвтрэх</h1><form id="advisor-login-form"><label class="field"><span>Имэйл</span><input name="email" type="email" autocomplete="username" required></label><label class="field"><span>Нууц үг</span><input name="password" type="password" autocomplete="current-password" required></label><button class="button" type="submit">Нэвтрэх</button></form><p class="error">${escapeHtml(state.advisor.error)}</p></main></div>`;
}
function renderAdvisorDashboard() {
  const dashboard = state.advisor.dashboard;
  if (!dashboard) return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Зөвлөхийн самбар</h1><p>Мэдээллийг ачаалахын тулд нэвтэрнэ үү.</p><a class="button" href="/advisor/login" data-route>Нэвтрэх</a></main></div>`;
  return `<div class="page"><main class="content-card dashboard"><h1 id="page-title" tabindex="-1">Зөвлөхийн самбар</h1><div class="metric-grid"><article><h2>Үйлчлүүлэгчдийн нийт төлбөр</h2><p>${money(dashboard.totals.clientPayments)}</p></article><article><h2>Таны нийт шимтгэл</h2><p>${money(dashboard.totals.commissionTotal)}</p></article><article><h2>Олгохоор хүлээгдэж буй шимтгэл</h2><p>${money(dashboard.totals.commissionPending)}</p></article><article><h2>Олгосон шимтгэл</h2><p>${money(dashboard.totals.commissionPaid)}</p></article></div>
    <form id="advisor-invite-form"><h2>Үйлчлүүлэгч урих</h2><label class="field"><span>Үйлчлүүлэгчийн имэйл</span><input name="email" type="email" required></label><label class="field"><span>Нэр</span><input name="name"></label><button class="button" type="submit">Урилга үүсгэх</button></form>${dashboard.inviteToken ? `<p class="notice">Нэг удаагийн урилгын холбоос: <code>/assessment/start?invite=${escapeHtml(dashboard.inviteToken)}</code></p>` : ""}
    <div class="table-scroll" tabindex="0"><table><thead><tr><th>Нэр</th><th>Төлөв</th><th>Тайлан</th></tr></thead><tbody>${dashboard.clients.map(client => `<tr><td>${escapeHtml(client.name || "Нэргүй")}</td><td>${escapeHtml(client.status)}</td><td>${client.assessmentId ? `<button class="button compact" type="button" data-advisor-report="${escapeAttribute(client.assessmentId)}">Бүрэн тайлан харах</button>` : "—"}</td></tr>`).join("")}</tbody></table></div><button class="button secondary" type="button" data-action="advisor-logout">Гарах</button></main></div>`;
}
function renderAdmin() {
  if (!state.admin.authenticated) return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Удирдлагын нэвтрэх хэсэг</h1><form id="admin-login-form"><label class="field"><span>Имэйл</span><input name="email" type="email" autocomplete="username" required></label><label class="field"><span>Нууц үг</span><input name="password" type="password" autocomplete="current-password" required></label><button class="button" type="submit">Нэвтрэх</button></form><p class="error">${escapeHtml(state.admin.error)}</p></main></div>`;
  const reportRows = (state.admin.reportCandidates || []).map(candidate => `<tr><td>${escapeHtml(candidate.reportMode || "—")}</td><td>${candidate.activeVersionNumber ? `v${escapeHtml(candidate.activeVersionNumber)}` : "Legacy"}</td><td>${candidate.acceptedEngineActive ? "Идэвхтэй" : `<button class="button compact" type="button" data-regenerate-report="${escapeAttribute(candidate.assessmentId)}">Шинэ хувилбар үүсгэж идэвхжүүлэх</button>`}</td><td><button class="button compact secondary" type="button" data-preview-report="${escapeAttribute(candidate.assessmentId)}">Тайлан харах</button></td></tr>`).join("");
  const reportAdmin = state.admin.owner ? `${renderAdminAnalytics()}<section aria-labelledby="report-version-title"><h2 id="report-version-title">Тайлангийн хувилбарын удирдлага</h2><p>Хуучин тайланг өөрчлөхгүйгээр шинэ хувилбар үүсгэж, шалгалт амжилттай бол идэвхжүүлнэ.</p>${reportRows ? `<div class="table-scroll" tabindex="0"><table><thead><tr><th>Төлөв</th><th>Идэвхтэй хувилбар</th><th>Үйлдэл</th><th>Урьдчилан харах</th></tr></thead><tbody>${reportRows}</tbody></table></div>` : `<p>Шинэчлэх боломжтой дууссан тайлан олдсонгүй.</p>`}${state.admin.regenerated ? `<p class="notice" role="status">Тайлангийн v${escapeHtml(state.admin.regenerated.versionNumber)} хувилбар идэвхжлээ.</p>` : ""}</section>` : "";
  return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Зөвлөхийн удирдлага</h1>${state.admin.owner ? `<section aria-labelledby="owner-preview-title"><h2 id="owner-preview-title">Эзэмшигчийн бодит туршилт</h2><p>Нийтийн “Тун удахгүй” хамгаалалтыг өөрчлөхгүйгээр 2 цагийн турш бодит тестийг шалгана.</p><button class="button" type="button" data-action="start-owner-preview">Бодит тестийг шалгах</button>${state.ownerPreview ? `<button class="button secondary" type="button" data-action="revoke-owner-preview">Туршилтын эрхийг цуцлах</button>` : ""}</section>` : ""}${reportAdmin}<form id="admin-advisor-form"><label class="field"><span>Зөвлөхийн нэр</span><input name="name" required></label><label class="field"><span>Зөвлөхийн имэйл</span><input name="email" type="email" required></label><label class="field"><span>Нэг төлбөрөөс зөвлөхөд олгох шимтгэл (₮)</span><input name="commissionAmount" type="number" min="0" max="9900" value="4000" required></label><button class="button" type="submit">Зөвлөх нэмэх</button></form>${state.admin.created ? `<div class="notice" role="status"><p>Түр нууц үгийг зөвхөн одоо хуулж авна уу.</p><code>${escapeHtml(state.admin.created.temporaryPassword)}</code></div>` : ""}<p class="error">${escapeHtml(state.admin.error)}</p><button class="button secondary" type="button" data-action="admin-logout">Гарах</button></main></div>`;
}
function legalPage(title, body) { return `<div class="page">${navigation()}<main class="content-card legal-page"><h1 id="page-title" tabindex="-1">${escapeHtml(title)}</h1>${body}</main>${footer()}</div>`; }
function renderPrivacy() { return legalPage("Нууцлалын бодлого", `<p>Үйлчилгээ үзүүлэгч: Customer Business Development LLC-ийн ажиллуулдаг Jingeehas. Үйлчилгээ Монгол Улсын харьяалалд үйл ажиллагаа явуулна.</p><p>Тестийн хариулт, аюулгүй байдлын шинж, холбоо барих мэдээлэл нь тайлан гаргах, төлбөр баталгаажуулах, тайлан сэргээх зорилгоор серверт хадгалагдана. Холбоо барих мэдээллийг шифрлэж, хайлтын утгыг тусад нь хэшлэнэ.</p><p>Түүхий хариултыг QPay нэхэмжлэлийн тайлбар, төлбөрийн мэдээлэл эсвэл ерөнхий хэрэглээний хэмжилтэд дамжуулахгүй. Зөвлөх зөвхөн таны тодорхой зөвшөөрөлтэй бүрэн тайланг харж болох бөгөөд асуулт бүрийн түүхий хариултыг тусад нь харахгүй.</p><p>Хэрэглэгч зөвшөөрлөө цуцалж, хууль болон төлбөрийн бүртгэлээр заавал хадгалах мэдээллээс бусдыг устгуулах хүсэлт гаргаж болно. Баталгаажсан устгах хүсэлтийг 30 хоногийн дотор шийдвэрлэнэ.</p><p>Үйлчилгээний үндсэн үе шатны ашиглалтыг сайжруулахын тулд нэр, холбоо барих мэдээлэл, тестийн хариулт агуулаагүй нууцлагдсан зочин болон сессийн танигчаар өдрийн нийлбэр үзүүлэлт хэмжинэ. Төхөөрөмжийн хурууны хээ үүсгэхгүй бөгөөд түүхий IP хаяг хадгалахгүй.</p><p>Нууцлалын хүсэлт: ${supportContactLink()}.</p>`); }
function renderTerms() { return legalPage("Үйлчилгээний нөхцөл", `<p>Үйлчилгээ үзүүлэгч: Customer Business Development LLC-ийн ажиллуулдаг Jingeehas. Үйлчилгээ Монгол Улсын харьяалалд үйл ажиллагаа явуулна.</p><p>Энэ тест үнэлгээ нь насанд хүрсэн хэрэглэгчийн өөрийн хариултад тулгуурласан ажиглалт гаргана. Эмнэлгийн онош тавихгүй бөгөөд эмч, сэтгэлзүйч, хоолзүйчийн зөвлөгөө, эмчилгээ, яаралтай тусламжийг орлохгүй.</p><p>Нэг удаагийн бүтээгдэхүүний үнэ ${PRODUCT.displayPrice}. Бүрэн тайлан зөвхөн сервер төлбөрийг баталгаажуулсны дараа нээгдэнэ. Аюулгүй байдлын зөвлөмж төлбөргүй.</p><p>Давхар төлбөр, баталгаатай системийн алдаа, эсвэл төлбөр төлсөн боловч бүрэн тайланг техникийн шалтгаанаар өгөөгүй бөгөөд дэмжлэгээр шийдвэрлэж чадаагүй тохиолдлыг шалгаж, буцаан олголтын хүсэлтийг хянан шийдвэрлэнэ.</p><p>Нөхцөлтэй холбоотой хүсэлт: ${supportContactLink()}.</p>`); }
function renderSupport() { return legalPage("Төлбөрийн тусламж", `<p>Үйлчилгээ үзүүлэгч: Customer Business Development LLC-ийн ажиллуулдаг Jingeehas.</p><p>Нэхэмжлэл үүсэхгүй, хугацаа дууссан, эсвэл төлбөр баталгаажсан ч бүрэн тайлан нээгдэхгүй бол дахин төлөхөөсөө өмнө “Төлбөр шалгах” үйлдлийг ашиглана уу.</p><p>Тайлангаа өөр төхөөрөмжөөс авах бол <a href="/recovery" data-route>Тайлан сэргээх</a> хэсэгт төлбөр хийхдээ ашигласан имэйл хаягаа оруулна уу. Утсаар сэргээх үйлчилгээ одоогоор нээгдээгүй.</p><p>Дэмжлэгийн имэйл: ${supportContactLink()}.</p>`); }
function renderDataDeletion() { const contact = `<p>Устгах хүсэлтийн тусламж: ${supportContactLink()}.</p>`; return legalPage("Өгөгдөл устгах хүсэлт", (state.assessmentId ? `<p>Одоогийн баталгаажсан тест үнэлгээтэй холбоотой өгөгдөл устгах хүсэлт илгээж болно. Баталгаажсан хүсэлтийг 30 хоногийн дотор шийдвэрлэнэ. Хууль болон төлбөрийн бүртгэлээр заавал хадгалах мэдээлэл үлдэж болох бөгөөд хүсэлтийг шалгах хугацаанд тайлан сэргээх боломж хязгаарлагдаж болно.</p><button class="button danger" type="button" data-action="request-deletion">Устгах хүсэлт илгээх</button><p class="notice" role="status">${escapeHtml(state.deletionMessage || "")}</p>` : `<p>Өгөгдлийн эзэмшлийг баталгаажуулахын тулд эхлээд <a href="/recovery" data-route>тайлангаа сэргээнэ үү</a>. Дараа нь энэ хуудсанд буцаж хүсэлт илгээнэ. Баталгаажсан хүсэлтийг 30 хоногийн дотор шийдвэрлэнэ.</p>`) + contact); }
function renderForPath(pathname) {
  const route = routeName(pathname);
  if (route === "landing") return renderLanding();
  if (route === "about") return renderAbout();
  if (route === "methodology") return renderMethodology();
  if (isComingSoon() && OWNER_PREVIEW_ROUTES.has(route) && !state.ownerPreview) return renderComingSoon();
  if (route === "assessmentStart") return renderSafetyGate();
  if (route === "assessmentContact") return renderAssessmentContact();
  if (route === "assessmentCompleted") return renderAssessmentCompleted();
  if (route === "payment") return renderPayment();
  if (route === "questions") return renderQuestions();
  if (route === "report") return renderReport();
  if (route === "recovery") return renderRecovery();
  if (route === "advisorLogin") return renderAdvisorLogin();
  if (route === "advisorDashboard") return renderAdvisorDashboard();
  if (route === "admin") return renderAdmin();
  if (route === "privacy") return renderPrivacy();
  if (route === "terms") return renderTerms();
  if (route === "support") return renderSupport();
  if (route === "dataDeletion") return renderDataDeletion();
  return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Хуудас олдсонгүй</h1><a class="button" href="/" data-route>Нүүр рүү буцах</a></main>${footer()}</div>`;
}

async function api(path, options = {}) {
  const response = await fetch(path, { ...options, credentials: "same-origin", headers: { "content-type": "application/json", ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(body.error || "server_error"), { status: response.status, body });
  return body;
}
async function ensureSession() { return api("/.netlify/functions/weight-session-start", { method: "POST", body: "{}" }); }
function formObject(form) { const data = new FormData(form); return Object.fromEntries(data.entries()); }
function contactValidation(input) {
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(input.email).trim())) return "Имэйл хаягаа зөв оруулна уу.";
  if (!String(input.email || "").trim()) return "Имэйл хаягаа оруулна уу.";
  return "";
}
function setPaymentStatus(status, patch = {}) { state.payment = { ...state.payment, ...patch, status: PAYMENT_STATES.has(status) ? status : "failed" }; }
function saveAdminReportPreviewAssessment(assessmentId, storage = typeof sessionStorage === "undefined" ? null : sessionStorage) { storage?.setItem(ADMIN_REPORT_PREVIEW_STORAGE_KEY, String(assessmentId || "")); }
function loadAdminReportPreviewAssessment(storage = typeof sessionStorage === "undefined" ? null : sessionStorage) { return String(storage?.getItem(ADMIN_REPORT_PREVIEW_STORAGE_KEY) || ""); }
function clearAdminReportPreviewAssessment(storage = typeof sessionStorage === "undefined" ? null : sessionStorage) { storage?.removeItem(ADMIN_REPORT_PREVIEW_STORAGE_KEY); }

async function submitSafety(form) {
  const input = formObject(form); input.acuteMedical = new FormData(form).getAll("acuteMedical");
  if (!input.age || !input.selfHarm || !input.acuteMedical.length || !input.compensatoryBehavior || !input.medicalSuitability) throw new Error("Бүх асуултад хариулна уу.");
  state.busy = true; render();
  await ensureSession();
  state.safetyResult = await api("/.netlify/functions/weight-safety-gate", { method: "POST", body: JSON.stringify(input) });
  state.safetyCheckId = state.safetyResult.safetyCheckId; state.busy = false;
  if (state.safetyResult.route === "eligible") navigate("/assessment/contact"); else render();
}
async function submitContact(form) {
  const input = formObject(form); const error = contactValidation(input); if (error) throw new Error(error);
  state.busy = true; render();
  const contact = await api("/.netlify/functions/weight-recovery-contact-save", { method: "POST", body: JSON.stringify(input) });
  state.contactGroupId = contact.contactGroupId;
  if (state.inviteToken) {
    state.invitation = await api("/.netlify/functions/advisor-invite-resolve", { method: "POST", body: JSON.stringify({ inviteToken: state.inviteToken }) });
    state.inviteToken = ""; state.busy = false; render(); return;
  }
  const assessment = await api("/.netlify/functions/weight-assessment-create", { method: "POST", body: JSON.stringify({ safetyCheckId: state.safetyCheckId, recoveryContactGroupId: state.contactGroupId, analyticsContext: analyticsIdentity() }) });
  state.assessmentId = assessment.assessmentId; state.assessmentStatus = assessment.status; state.questionnaireVersion = assessment.questionnaireVersion || state.questionnaireVersion; state.busy = false; navigate("/assessment/questions");
}
async function submitConsent(form) {
  const accepted = formObject(form).consent === "yes";
  const result = await api("/.netlify/functions/advisor-consent", { method: "POST", body: JSON.stringify({ coachClientId: state.invitation.coachClientId, consent: accepted }) });
  const assessment = await api("/.netlify/functions/weight-assessment-create", { method: "POST", body: JSON.stringify({ safetyCheckId: state.safetyCheckId, recoveryContactGroupId: state.contactGroupId, analyticsContext: analyticsIdentity(), ...(accepted ? { coachClientId: result.coachClientId } : {}) }) });
  state.assessmentId = assessment.assessmentId; state.assessmentStatus = assessment.status; state.questionnaireVersion = assessment.questionnaireVersion || state.questionnaireVersion; state.invitation = null; navigate("/assessment/questions");
}
async function createInvoice() {
  if (state.busy || state.assessmentStatus !== "complete") return;
  state.busy = true;
  setPaymentStatus("creating"); render();
  try { state.payment = await api("/.netlify/functions/qpay-create-invoice", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId, productCode: PRODUCT.code, amount: PRODUCT.amount }) }); }
  catch (error) {
    const ambiguous = ["invoice_create_unknown", "invoice_reconciliation_required", "replacement_authorization_required"].includes(error?.body?.error);
    setPaymentStatus(ambiguous ? "create_unknown" : "create_error");
  } finally { state.busy = false; } render();
}
function continueToPayment() {
  if (state.busy || state.assessmentStatus !== "complete") return;
  state.busy = true; render({ focus: false });
  window.requestAnimationFrame(() => { state.busy = false; navigate("/assessment/payment"); });
}
async function checkPayment() {
  setPaymentStatus("checking"); render();
  try { state.payment = await api("/.netlify/functions/qpay-check-payment", { method: "POST", body: JSON.stringify({ paymentId: state.payment.paymentId }) }); if (state.payment.status === "paid") state.report = await loadReport(); }
  catch { setPaymentStatus("check_error"); } render();
}
function updateAnswer(input) {
  const question = questionApi.questionById(input.dataset.question); if (!question) return;
  const previousValue = state.answers[question.id];
  if (question.type === "multi") {
    const current = Array.isArray(state.answers[question.id]) ? state.answers[question.id] : [];
    const selected = input.value;
    let next;
    if (EXCLUSIVE.has(selected)) next = input.checked ? [selected] : [];
    else {
      const withoutExclusive = current.filter(value => !EXCLUSIVE.has(value) && value !== selected);
      if (input.checked && withoutExclusive.length >= question.max) { state.validationError = `Та хамгийн ихдээ ${question.max} хариулт сонгох боломжтой.`; render(); return; }
      next = input.checked ? [...withoutExclusive, selected] : withoutExclusive;
    }
    state.answers[question.id] = next;
  } else state.answers[question.id] = input.value;
  if (previousValue !== state.answers[question.id] && BRANCH_PREFIXES[question.id]) {
    for (const key of Object.keys(state.answers)) {
      if (key !== question.id && BRANCH_PREFIXES[question.id].some(prefix => key.startsWith(prefix))) delete state.answers[key];
    }
  }
  state.validationError = "";
}
async function nextQuestion() {
  if (state.busy) return;
  const questions = questionApi.visibleQuestions(state.answers, state.questionnaireVersion); const question = questions[state.questionIndex];
  const error = questionApi.validateAnswer(question, state.answers[question.id], { answers: state.answers, version: state.questionnaireVersion });
  if (error) { state.validationError = error; render(); return; }
  state.busy = true; state.slowSave = false; state.validationError = ""; render({ focus: false });
  const slowTimer = setTimeout(() => { if (state.busy) { state.slowSave = true; render({ focus: false }); } }, 1000);
  try {
    const saved = await api("/.netlify/functions/weight-assessment-save", { method: "PATCH", body: JSON.stringify({ assessmentId: state.assessmentId, answers: { [question.id]: state.answers[question.id] } }) });
    if (!saved.savedQuestionIds?.includes(question.id)) throw Object.assign(new Error("answer_not_confirmed"), { body: { error: "answer_not_confirmed" } });
    const routedQuestions = questionApi.visibleQuestions(state.answers, state.questionnaireVersion);
    const persistedIndex = routedQuestions.findIndex(item => item.id === question.id);
    if (persistedIndex >= 0 && persistedIndex < routedQuestions.length - 1) {
      state.questionIndex = persistedIndex + 1; state.validationError = ""; state.busy = false; state.slowSave = false; render(); return;
    }
    const completed = await api("/.netlify/functions/weight-assessment-complete", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId }) });
    state.assessmentStatus = completed.status; state.busy = false; state.slowSave = false;
    if (completed.safetyRoute) { state.report = await loadReport(); navigate("/report"); return; }
    navigate("/assessment/completed");
  } catch (requestError) {
    const code = requestError?.body?.error;
    if (code === "assessment_incomplete" && requestError.body.questionId) {
      const routedQuestions = questionApi.visibleQuestions(state.answers, state.questionnaireVersion);
      const missingIndex = routedQuestions.findIndex(item => item.id === requestError.body.questionId);
      if (missingIndex >= 0) state.questionIndex = missingIndex;
      state.validationError = "Шаардлагатай өмнөх асуултын хариулт дутуу байна. Хариултаа нөхөөд дахин үргэлжлүүлнэ үү.";
    } else if (["preview_required", "preview_expired", "session_expired"].includes(code)) {
      state.validationError = "Туршилтын эрхийн хугацаа дууссан байна. Удирдлагын хэсгээс эрхээ дахин нээнэ үү.";
    } else if (code === "invalid_answer" || code === "inapplicable_question") {
      state.validationError = "Энэ хариултыг хадгалах боломжгүй байна. Сонголтоо шалгаад дахин оролдоно уу.";
    } else state.validationError = "Хариултыг серверт баталгаажуулж чадсангүй. Таны оруулсан хариулт хадгалагдсан хэвээр; дахин оролдоно уу.";
    state.busy = false; state.slowSave = false; render({ focus: false });
  } finally { clearTimeout(slowTimer); }
}
async function loadReport() { return api(`/.netlify/functions/weight-assessment-report?assessmentId=${encodeURIComponent(state.assessmentId)}`, { method: "GET" }); }
async function requestRecovery(form) {
  const input = formObject(form); const error = contactValidation(input); if (error) throw new Error(error);
  const result = await api("/.netlify/functions/weight-recovery-request", { method: "POST", body: JSON.stringify(input) });
  trackEvent("recovery_requested", "", `recovery_requested:${result.recoveryId}`);
  state.recovery = { recoveryId: result.recoveryId, message: result.message, error: "" }; render();
}
async function confirmRecovery(form) {
  const input = formObject(form);
  const result = await api("/.netlify/functions/weight-recovery-confirm", { method: "POST", body: JSON.stringify({ recoveryId: state.recovery.recoveryId, code: input.code }) });
  state.assessmentId = result.assessmentId; state.report = await loadReport(); navigate("/report");
}
async function advisorLoginSubmit(form) { const result = await api("/.netlify/functions/advisor-login", { method: "POST", body: JSON.stringify(formObject(form)) }); state.advisor.profile = result; state.advisor.temporaryPasswordChange = result.forcePasswordChange; if (result.forcePasswordChange) render(); else { state.advisor.dashboard = await api("/.netlify/functions/advisor-dashboard", { method: "GET" }); navigate("/advisor/dashboard"); } }
async function advisorPasswordSubmit(form) { await api("/.netlify/functions/advisor-password-change", { method: "POST", body: JSON.stringify(formObject(form)) }); state.advisor.temporaryPasswordChange = false; state.advisor.dashboard = await api("/.netlify/functions/advisor-dashboard", { method: "GET" }); navigate("/advisor/dashboard"); }
async function advisorInviteSubmit(form) { const result = await api("/.netlify/functions/advisor-client-invite", { method: "POST", body: JSON.stringify(formObject(form)) }); state.advisor.dashboard = { ...state.advisor.dashboard, inviteToken: result.inviteToken }; render(); }
async function loadAdminReportCandidates() { if (!state.admin.owner) return; const result = await api("/.netlify/functions/admin-report-regeneration-candidates", { method: "GET" }); state.admin.reportCandidates = result.candidates || []; state.admin.reportEngineVersion = result.reportEngineVersion; state.admin.reportSchemaVersion = result.reportSchemaVersion; state.admin.generationReason = result.generationReason; }
async function loadAdminAnalytics(preset = state.admin.analytics.preset, custom = {}) {
  if (!state.admin.owner) return; const analytics = state.admin.analytics;
  const selected = preset === "custom" ? { startDate: custom.startDate, endDate: custom.endDate } : analyticsRange(preset);
  analytics.preset = preset; analytics.startDate = selected.startDate; analytics.endDate = selected.endDate; analytics.loading = true; analytics.error = ""; render({ focus: false });
  const length = Math.floor((Date.parse(`${selected.endDate}T00:00:00Z`) - Date.parse(`${selected.startDate}T00:00:00Z`)) / 86400000) + 1;
  const priorEnd = shiftDay(selected.startDate, -1); const priorStart = shiftDay(priorEnd, -(length - 1));
  try {
    const [current, prior] = await Promise.all([
      api(`/.netlify/functions/admin-analytics-daily?startDate=${selected.startDate}&endDate=${selected.endDate}`, { method: "GET" }),
      api(`/.netlify/functions/admin-analytics-daily?startDate=${priorStart}&endDate=${priorEnd}`, { method: "GET" })
    ]);
    analytics.days = current.days || []; analytics.priorDays = prior.days || []; analytics.summary = current.summary || null; analytics.priorSummary = prior.summary || null;
  } catch { analytics.error = "Өдөр тутмын үзүүлэлтийг ачаалж чадсангүй."; }
  analytics.loading = false;
}
async function adminLoginSubmit(form) { const result = await api("/.netlify/functions/admin-login", { method: "POST", body: JSON.stringify(formObject(form)) }); state.admin.authenticated = true; state.admin.owner = result.owner === true; state.admin.error = ""; await Promise.all([loadAdminReportCandidates(), loadAdminAnalytics()]); render(); }
async function adminAdvisorSubmit(form) { const input = formObject(form); input.commissionAmount = Number(input.commissionAmount); state.admin.created = await api("/.netlify/functions/admin-advisor-create", { method: "POST", body: JSON.stringify(input) }); render(); }
async function startOwnerPreview() {
  const preview = await api("/.netlify/functions/admin-preview-start", { method: "POST", body: "{}" });
  const fresh = createState();
  state = { ...fresh, admin: state.admin, ownerPreview: true };
  if (preview.resumeDraft) {
    window.history.pushState({}, "", "/assessment/questions");
    await restoreServerState();
    render();
  } else navigate("/assessment/start");
}
async function revokeOwnerPreview() { await api("/.netlify/functions/admin-preview-revoke", { method: "POST", body: "{}" }); clearAdminReportPreviewAssessment(); state.ownerPreview = false; render(); }
async function regenerateAdminReport(assessmentId) {
  const candidate = state.admin.reportCandidates.find(item => item.assessmentId === assessmentId); if (!candidate || state.busy) return;
  state.busy = true; state.admin.error = ""; render({ focus: false });
  const operationKey = state.admin.regenerationKeys[assessmentId] || `report-${crypto.randomUUID()}`;
  state.admin.regenerationKeys[assessmentId] = operationKey;
  try {
    state.admin.regenerated = await api("/.netlify/functions/admin-regenerate-report-version", { method: "POST", body: JSON.stringify({
      assessmentId, generationReason: state.admin.generationReason, expectedCurrentSnapshotId: candidate.activeSnapshotId || "legacy",
      requestedReportEngineVersion: state.admin.reportEngineVersion, operationKey
    }) });
    delete state.admin.regenerationKeys[assessmentId]; await loadAdminReportCandidates();
  } finally { state.busy = false; render(); }
}
async function previewAdminReport(assessmentId) {
  await api("/.netlify/functions/admin-preview-start", { method: "POST", body: "{}" });
  state.ownerPreview = true;
  state.report = await api(`/.netlify/functions/admin-report-preview?assessmentId=${encodeURIComponent(assessmentId)}`, { method: "GET" });
  saveAdminReportPreviewAssessment(assessmentId);
  navigate("/report");
}
async function restoreServerState() {
  const route = routeName(window.location.pathname);
  if (route === "admin") { try { const admin = await api("/.netlify/functions/admin-session-state", { method: "GET" }); state.admin.authenticated = true; state.admin.owner = admin.owner === true; await Promise.all([loadAdminReportCandidates(), loadAdminAnalytics()]); try { await api("/.netlify/functions/admin-preview-status", { method: "GET" }); state.ownerPreview = true; } catch {} } catch {} return; }
  if (route === "advisorDashboard") { try { state.advisor.dashboard = await api("/.netlify/functions/advisor-dashboard", { method: "GET" }); } catch {} return; }
  if (isComingSoon() && OWNER_PREVIEW_ROUTES.has(route)) { try { await api("/.netlify/functions/admin-preview-status", { method: "GET" }); state.ownerPreview = true; } catch { state.ownerPreview = false; return; } }
  if (route === "report" && state.ownerPreview) {
    const previewAssessmentId = loadAdminReportPreviewAssessment();
    if (previewAssessmentId) {
      try {
        const admin = await api("/.netlify/functions/admin-session-state", { method: "GET" });
        if (admin.owner === true) {
          state.assessmentId = previewAssessmentId;
          state.report = await api(`/.netlify/functions/admin-report-preview?assessmentId=${encodeURIComponent(previewAssessmentId)}`, { method: "GET" });
          return;
        }
      } catch {}
    }
  }
  if (!["assessmentCompleted", "payment", "questions", "report", "dataDeletion"].includes(route)) return;
  try {
    const restored = await api("/.netlify/functions/weight-session-state", { method: "GET" });
    if (!restored.assessment) return;
    state.assessmentId = restored.assessment.assessmentId; state.assessmentStatus = restored.assessment.status; state.questionnaireVersion = restored.assessment.questionnaireVersion || questionApi.LEGACY_QUESTIONNAIRE_VERSION; state.payment = restored.payment || state.payment;
    state.answers = restored.answers || {}; state.report = restored.report || null;
    if (restored.assessment.status === "draft") {
      const routedQuestions = questionApi.visibleQuestions(state.answers, state.questionnaireVersion);
      const firstIncomplete = routedQuestions.findIndex(question => questionApi.validateAnswer(question, state.answers[question.id], { answers: state.answers, version: state.questionnaireVersion }));
      state.questionIndex = firstIncomplete >= 0 ? firstIncomplete : Math.max(0, routedQuestions.length - 1);
    }
  } catch {}
}

function bind(root) {
  root.querySelectorAll("a[data-route]").forEach(link => link.addEventListener("click", event => { event.preventDefault(); if (window.location.pathname === "/" && link.getAttribute("href") === "/assessment/start") trackEvent("start_cta_clicked", "", `start_cta_clicked:${Date.now()}`); navigate(link.getAttribute("href")); }));
  root.querySelectorAll("[data-question]").forEach(input => input.addEventListener(input.type === "text" || input.tagName === "TEXTAREA" ? "input" : "change", () => updateAnswer(input)));
  root.querySelector("#safety-form")?.addEventListener("submit", event => { event.preventDefault(); submitSafety(event.currentTarget).catch(error => { state.busy = false; render(); const node = document.getElementById("safety-error"); if (node) node.textContent = error.message; }); });
  root.querySelector("#contact-form")?.addEventListener("submit", event => { event.preventDefault(); submitContact(event.currentTarget).catch(error => { state.busy = false; render(); const node = document.getElementById("contact-error"); if (node) node.textContent = error.message; }); });
  root.querySelector("#consent-form")?.addEventListener("submit", event => { event.preventDefault(); submitConsent(event.currentTarget).catch(() => { state.validationError = "Сонголтыг хадгалж чадсангүй."; render(); }); });
  root.querySelector("#question-form")?.addEventListener("submit", event => { event.preventDefault(); nextQuestion(); });
  root.querySelector("#recovery-request-form")?.addEventListener("submit", event => { event.preventDefault(); requestRecovery(event.currentTarget).catch(error => { state.recovery.error = error.message; render(); }); });
  root.querySelector("#recovery-confirm-form")?.addEventListener("submit", event => { event.preventDefault(); confirmRecovery(event.currentTarget).catch(() => { state.recovery.error = "Баталгаажуулах код буруу эсвэл хугацаа дууссан байна."; render(); }); });
  root.querySelector("#advisor-login-form")?.addEventListener("submit", event => { event.preventDefault(); advisorLoginSubmit(event.currentTarget).catch(() => { state.advisor.error = "Имэйл эсвэл нууц үг буруу байна."; render(); }); });
  root.querySelector("#advisor-password-form")?.addEventListener("submit", event => { event.preventDefault(); advisorPasswordSubmit(event.currentTarget).catch(() => { state.advisor.error = "Нууц үгийг сольж чадсангүй."; render(); }); });
  root.querySelector("#advisor-invite-form")?.addEventListener("submit", event => { event.preventDefault(); advisorInviteSubmit(event.currentTarget).catch(() => { state.advisor.error = "Урилга үүсгэж чадсангүй."; render(); }); });
  root.querySelector("#admin-login-form")?.addEventListener("submit", event => { event.preventDefault(); adminLoginSubmit(event.currentTarget).catch(() => { state.admin.error = "Нэвтрэх мэдээлэл буруу байна."; render(); }); });
  root.querySelector("#admin-advisor-form")?.addEventListener("submit", event => { event.preventDefault(); adminAdvisorSubmit(event.currentTarget).catch(() => { state.admin.error = "Зөвлөх үүсгэж чадсангүй."; render(); }); });
  root.querySelector("#analytics-filter-form")?.addEventListener("submit", event => { event.preventDefault(); const input = formObject(event.currentTarget); loadAdminAnalytics(input.preset, input).then(() => render()).catch(() => { state.admin.analytics.error = "Хугацааг шалгана уу."; render(); }); });
  root.querySelector('[data-action="start-owner-preview"]')?.addEventListener("click", () => startOwnerPreview().catch(() => { state.admin.error = "Бодит тестийн эрх нээж чадсангүй."; render(); }));
  root.querySelector('[data-action="revoke-owner-preview"]')?.addEventListener("click", () => revokeOwnerPreview().catch(() => { state.admin.error = "Туршилтын эрхийг цуцалж чадсангүй."; render(); }));
  root.querySelectorAll("[data-regenerate-report]").forEach(button => button.addEventListener("click", () => regenerateAdminReport(button.dataset.regenerateReport).catch(() => { state.busy = false; state.admin.error = "Тайлангийн шинэ хувилбарыг үүсгэж чадсангүй."; render(); })));
  root.querySelectorAll("[data-preview-report]").forEach(button => button.addEventListener("click", () => previewAdminReport(button.dataset.previewReport).catch(() => { state.admin.error = "Тайланг нээж чадсангүй."; render(); })));
  root.querySelector('[data-action="create-invoice"]')?.addEventListener("click", createInvoice);
  root.querySelector('[data-action="continue-to-payment"]')?.addEventListener("click", continueToPayment);
  root.querySelector('[data-action="check-payment"]')?.addEventListener("click", checkPayment);
  root.querySelector('[data-action="previous-question"]')?.addEventListener("click", () => { state.questionIndex = Math.max(0, state.questionIndex - 1); state.validationError = ""; render(); });
  root.querySelector('[data-action="print-report"]')?.addEventListener("click", () => window.print());
  root.querySelector('[data-action="advisor-logout"]')?.addEventListener("click", async () => { await api("/.netlify/functions/advisor-logout", { method: "POST", body: "{}" }); state.advisor = createState().advisor; navigate("/advisor/login"); });
  root.querySelector('[data-action="admin-logout"]')?.addEventListener("click", async () => { await api("/.netlify/functions/admin-logout", { method: "POST", body: "{}" }); clearAdminReportPreviewAssessment(); state.admin = createState().admin; state.ownerPreview = false; render(); });
  root.querySelectorAll("[data-advisor-report]").forEach(button => button.addEventListener("click", async () => { const result = await api(`/.netlify/functions/advisor-report?assessmentId=${encodeURIComponent(button.dataset.advisorReport)}`, { method: "GET" }); state.report = { assessmentId: result.assessmentId, fullReport: result.fullReport, entitled: true }; navigate("/report"); }));
  root.querySelector('[data-action="request-deletion"]')?.addEventListener("click", async () => { const result = await api("/.netlify/functions/weight-data-deletion-request", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId }) }); state.deletionMessage = result.status === "pending" ? "Таны хүсэлтийг хүлээн авлаа." : "Хүсэлтийн төлөв шинэчлэгдлээ."; render(); });
}
function render(options = {}) {
  if (typeof document === "undefined") return "";
  const root = document.getElementById("app"); if (!root) return "";
  root.innerHTML = renderForPath(window.location.pathname); bind(root);
  const route = routeName(window.location.pathname);
  if (route === "landing") trackEvent("landing_viewed", "", "landing_viewed:page-load");
  if (route === "payment" && state.assessmentStatus === "complete") trackEvent("paywall_viewed", state.assessmentId);
  if (route === "report" && state.report) trackEvent("report_opened", state.assessmentId);
  const heading = document.getElementById("page-title"); if (options.focus !== false && heading) heading.focus();
  return root.innerHTML;
}
function navigate(pathname, options = {}) { if (typeof window === "undefined") return; window.history[options.replace ? "replaceState" : "pushState"]({}, "", pathname); render(); }
function captureInviteToken() { if (typeof window === "undefined") return; const url = new URL(window.location.href); const token = url.searchParams.get("invite"); if (!token) return; state.inviteToken = token; url.searchParams.delete("invite"); window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`); }
if (typeof window !== "undefined") { window.addEventListener("popstate", async () => { await restoreServerState(); render(); }); window.addEventListener("DOMContentLoaded", async () => { captureInviteToken(); await restoreServerState(); render({ focus: false }); }); }
if (typeof module !== "undefined") module.exports = { PRODUCT, PAYMENT_COPY, PAYMENT_STATES, WEIGHT_TEST_COMING_SOON_MODE, isComingSoon, routeName, renderForPath, contactValidation, setPaymentStatus, money,
  saveAdminReportPreviewAssessment, loadAdminReportPreviewAssessment, clearAdminReportPreviewAssessment,
  _test: { setComingSoon(value) { testComingSoonOverride = Boolean(value); }, resetComingSoon() { testComingSoonOverride = null; }, setState(value) { state = { ...createState(), ...value }; }, getState() { return state; }, buildReportSections,
    analyticsRange, analyticsTotals, rate, comparison, renderAdminAnalytics } };
