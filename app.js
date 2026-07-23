"use strict";

const PRODUCT = Object.freeze({ name: "Илүүдэл жингээс салах тест үнэлгээ", code: "WEIGHT_TEST_ONE_TIME", amount: 9900, displayPrice: "9,900₮" });
const SUPPORT_EMAIL = "support@jingeehas.fit";
const WEIGHT_TEST_COMING_SOON_MODE = false;
const VERIFIED_LANDING_DURATION = "10–15 минут";
const PAYMENT_COPY = Object.freeze({
  creating: "QPay нэхэмжлэл үүсгэж байна…",
  create_unknown: "Нэхэмжлэл үүссэн эсэхийг баталгаажуулах шаардлагатай байна. Давтан нэхэмжлэл үүсгэхгүйгээр дэмжлэгтэй холбогдоно уу.",
  reconciling: "Өмнөх нэхэмжлэлийн төлөвийг QPay талаас шалгаж байна…",
  create_failed_confirmed: "Өмнөх оролдлогоор нэхэмжлэл үүсээгүй нь баталгаажсан. Шинэ оролдлогыг дэмжлэгээр зөвшөөрүүлнэ үү.",
  pending: "QPay төлбөрөө хийсний дараа тест автоматаар нээгдэнэ.",
  checking: "Төлбөрийг шалгаж байна…",
  paid_but_not_unlocked: "Төлбөр баталгаажсан. Тест нээх эрхийг серверээс дахин шалгана уу.",
  paidBeforeTest: "Төлбөр баталгаажлаа. Тест нээгдлээ.",
  paidAfterAssessment: "Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ."
});
const PAYMENT_STATES = new Set(["idle", "creating", "create_unknown", "reconciling", "pending", "checking", "paid", "create_error", "create_failed_confirmed", "check_error", "expired", "failed", "cancelled", "paid_but_not_unlocked"]);
const ADMIN_REPORT_PREVIEW_STORAGE_KEY = "jingeehas_admin_report_preview_assessment";
const questionApi = typeof require === "function" ? require("./questions.js") : window.JingeehasQuestions;
const EXCLUSIVE = new Set(["Аль нь ч үгүй", "Аль нь ч биш", "Онц өөрчлөлтгүй", "Хариулахгүй", "Одоогоор ямар нэг арга хэрэглээгүй", "Ямар нэг арга хэрэглэж үзээгүй", "Мэргэжлийн дэмжлэг аваагүй", "Тодорхой саад байгаагүй"]);
const BRANCH_PREFIXES = Object.freeze({ "Q-SEX": ["MC-", "PREG-", "MENO-"], "MC-GATE": ["MC-"], "ALC-GATE": ["ALC-"], "TOB-GATE": ["TOB-"], "PREG-GATE": ["PREG-"], "Q-METHOD-PAST": ["Q-METHOD-LONGEST", "Q-METHOD-DURATION", "Q-METHOD-STOP", "Q-METHOD-RESULT", "Q-METHOD-REGAIN", "Q-METHOD-SUPPORT", "Q-METHOD-MEDICATION"] });

function createState() {
  return { contactGroupId: "", assessmentId: "", assessmentStatus: "", commercialFlowVersion: "", questionsAuthorized: false, questionnaireVersion: questionApi?.QUESTIONNAIRE_VERSION || "", payment: { status: "idle" },
    answers: {}, questionIndex: 0, validationError: "", report: null, recovery: { recoveryId: "", message: "", error: "" },
    inviteToken: "", invitation: null, advisor: { profile: null, dashboard: null, temporaryPasswordChange: false, error: "" },
    admin: { authenticated: false, owner: false, created: null, reportCandidates: [], regenerationKeys: {}, regenerated: null, error: "",
      analytics: { preset: "last7", startDate: "", endDate: "", days: [], priorDays: [], summary: null, priorSummary: null,
        allFlows: null, currentFlow: null, priorCurrentFlow: null, legacyFlow: null, conversions: null, coverage: null, landingCutoverHourly: { hours: [], totals: {} }, loading: false, error: "",
        questionProgress: { summary: null, questions: [], expanded: false, showAll: false } } }, ownerPreview: false, busy: false, slowSave: false };
}
let state = createState();
let testComingSoonOverride = null;
let paymentPollTimer = null;
let paymentPollingStartedAt = 0;
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
let lastTrackedQuestionKey = "";
function trackEvent(eventName, assessmentId = "", dedupeKey = "") {
  if (typeof fetch === "undefined" || typeof window === "undefined") return;
  const key = dedupeKey || `${eventName}:${assessmentId}`; if (trackedPageEvents.has(key)) return; trackedPageEvents.add(key);
  fetch("/.netlify/functions/analytics-collect", { method: "POST", credentials: "same-origin", keepalive: true,
    headers: { "content-type": "application/json" }, body: JSON.stringify({ eventId: browserUuid(), eventName, assessmentId: assessmentId || undefined, context: analyticsIdentity() }) })
    .then(response => { if (!response.ok) console.warn(JSON.stringify({ event: "analytics_delivery_failed", eventName, status: response.status })); })
    .catch(() => console.warn(JSON.stringify({ event: "analytics_delivery_failed", eventName, status: "network_error" })));
}
function trackRenderedQuestion() {
  if (typeof fetch === "undefined" || typeof window === "undefined" || !state.assessmentId) return;
  const question = questionApi.visibleQuestions(state.answers, state.questionnaireVersion)[state.questionIndex]; if (!question) return;
  const key = `${state.assessmentId}:${state.questionnaireVersion}:${question.id}`; if (key === lastTrackedQuestionKey) return; lastTrackedQuestionKey = key;
  fetch("/.netlify/functions/weight-question-progress", { method: "POST", credentials: "same-origin", keepalive: true,
    headers: { "content-type": "application/json" }, body: JSON.stringify({ assessmentId: state.assessmentId, questionId: question.id }) })
    .then(response => { if (!response.ok) { if (lastTrackedQuestionKey === key) lastTrackedQuestionKey = ""; console.warn(JSON.stringify({ event: "question_progress_delivery_failed", status: response.status })); } })
    .catch(() => { if (lastTrackedQuestionKey === key) lastTrackedQuestionKey = ""; console.warn(JSON.stringify({ event: "question_progress_delivery_failed", status: "network_error" })); });
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
  const count = questionApi?.MAX_ROUTED_QUESTION_COUNT || 40;
  const questionCountCopy = `${count} орчим асуулт`;
  const micro = `${questionCountCopy} · ${VERIFIED_LANDING_DURATION} · Дэлгэрэнгүй хувийн тайлан`;
  const primary = `Тест өгөх — ${PRODUCT.displayPrice}`;
  return `<div class="page landing-page">${navigation()}<main>
    <section class="hero landing-hero" aria-labelledby="page-title"><div class="hero-copy">
      <p class="hero-eyebrow">Жин хасахад саад болж буй сэтгэлзүйн шалтгааны тест</p>
      <h1 id="page-title" tabindex="-1">Та жингээ хасах гэж олон удаа оролдсон ч үр дүн гарахгүй байна уу?</h1>
      <p class="hero-lead approved-copy">Хүн бүрд жин хасалтыг нь эхнээс нь эвддэг өөрийн гэсэн зуршил байдаг. Энэ тест таных юу болохыг олж харахад тусална.</p>
      <p class="landing-microcopy">${micro} · ${PRODUCT.displayPrice}</p>
      <div class="hero-actions"><a class="button primary-cta" href="/assessment/start" data-route data-primary-cta>${primary}</a><a class="text-link" href="#sample-report">Жишээ тайлан үзэх</a></div>
    </div><div class="hero-visual" aria-hidden="true"><div class="hero-art"></div><div class="hero-steps"><p><strong>01</strong> Асуултад хариулна</p><p><strong>02</strong> Давтагддаг хэв маягаа олно</p><p><strong>03</strong> Дэлгэрэнгүй тайлангаа авна</p><p><strong>04</strong> Жин хасахад өөрт тохирох арга барилаа ойлгоно</p><small>Онош биш. Өөрийгөө танин мэдэх үнэлгээ.</small></div></div></section>
    <section class="trust-columns" aria-label="Үнэлгээний давуу тал"><article><h2>Нууцлал хамгаалагдсан</h2><p>Таны хариулт бусад хэрэглэгчид харагдахгүй. Мэдээлэл боловсруулах нөхцөлийг <a href="/privacy" data-route>Нууцлалын бодлогоос</a> үзнэ үү.</p></article><article><h2>Судалгаанд суурилсан</h2><p>Хоолны зан үйл, сэтгэл хөдлөл, нойрыг үнэлдэг олон улсын арга зүйг баримталсан.</p></article><article><h2>${VERIFIED_LANDING_DURATION}</h2><p>Нэг суултаар дуусгаад дэлгэрэнгүй тайлангаа авна.</p></article></section>
    <section class="mirror-section" aria-labelledby="mirror-title"><p class="eyebrow">Танд танил байж болох мөчлөгүүд</p><h2 id="mirror-title">Та эдгээрийг өөр дээрээ анзаарч байсан уу?</h2><div class="mirror-grid">
      <article><h3>“Даваа гарагаас” гэдэг мөчлөг</h3><p>“Даваа гарагаас эхэлнэ” гэж хэлээгүй хүн ховор доо. Эхний гурван өдөр чадна. Дараа нь нэг хүнд өдөр, нэг төрсөн өдөр — л гэсээр буцаад хуучин хэвэндээ орчихдог.</p></article>
      <article><h3>Гар аяндаа</h3><p>Хэцүү өдрийн орой гар аяндаа хөргөгч рүү явдаг. Өлсөөгүй байгаагаа мэднэ. Гэхдээ зогсдоггүй.</p></article>
      <article><h3>Өдөр нь болдог, орой нь болдоггүй</h3><p>Өдөржин барьчихаад оройдоо эвддэг. Дараа нь өөртөө уурлана. Маргааш орой нь дахиад л.</p></article>
      <article><h3>Хүнтэй байхдаа өөр</h3><p>Хүнтэй суухдаа “би их иддэггүй ээ” гэдэг. Ганцаараа үлдэхээрээ нөхдөг. Үүнийг хэн ч мэддэггүй.</p></article>
      <article><h3>Хассан жин буцаад ирдэг</h3><p>Гурван сар зүтгэж хассан таван килограмм зун гэхэд буцаад ирчихсэн. Дээрээс нь хоёрыг дагуулаад.</p></article>
      <article><h3>Толь хэцүү болсон</h3><p>Зурагнаас өөрийгөө хайхаа больсон. Жин нь ч яах вэ — толь нь хэцүү болсон.</p></article>
    </div><p class="section-close">Тест эдгээрийн аль нь танд хамгийн олон давтагдаж байгааг тайлангаар харуулна.</p></section>
    <section class="cta-banner" aria-label="Тест эхлүүлэх"><p>Эдгээрийн аль нэг нь танил санагдсан уу?</p><p>${questionCountCopy}-д хариулаад өөрт тань давтагддаг зүйлсийн тайлангаа авна.</p><a class="button primary-cta" href="/assessment/start" data-route data-primary-cta>${primary}</a></section>
    <section class="value-section" aria-labelledby="show-title"><p class="eyebrow">Таны хариултаас</p><h2 id="show-title">Энэ үнэлгээ юуг харуулах вэ?</h2><div class="value-grid"><article><h3>01 — Юу давтагдаад байгааг</h3><p>Хяналт алдалт тань санамсаргүй биш — тодорхой цаг, тодорхой нөхцөлд давтагддаг. Тэр цэгүүдийг нь харуулна.</p></article><article><h3>02 — Юу таныг идэхэд хүргэдгийг</h3><p>Заримдаа өлсгөлөн. Олон тохиолдолд өөр зүйл: ядаргаа, уйтгар, дарамт. Аль нь танд илүү нөлөөлж байгааг ялгаж харуулна.</p></article><article><h3>03 — Өмнөх оролдлогууд яагаад унасныг</h3><p>Диет, дасгал, бэлдмэл — та заавал муу хийсэн гэсэн үг биш. Танд тохироогүй зүйл дээр удаан зүтгэсэн байх магадлалтай. Тайлан боломжит шалтгаануудыг нь таны хариулттай холбож тайлбарлана.</p></article><article><h3>04 — Танд зориулсан тайлан</h3><p>Ерөнхий зөвлөгөө биш. Таны хариултаас гарсан, таны тухай бичсэн тайлан.</p></article></div></section>
    <section class="value-section" aria-labelledby="learn-title"><p class="eyebrow">Төлбөрөөс өмнө тодорхой мэдэх зүйл</p><h2 id="learn-title">Үнэлгээ хийлгэснээр юу мэдэж авах вэ?</h2><div class="value-grid"><article><h3>Хувийн зураглал</h3><p>Таны хариултад хамгийн тогтвортой давтагдсан хандлага, өдөөгчийг эрэмбэлж харуулна.</p></article><article><h3>Амьдрал дээр хэрхэн илэрдэг тайлбар</h3><p>Ажлын дарамт, гэр орны орчин, нойр, амралтын өдрүүд таны хооллолтод хэрхэн нөлөөлдгийг өдөр тутмын жишээтэй холбоно.</p></article><article><h3>Зуршил чинь хэзээ тус болж байсан, одоо хаана саад болж байгаа</h3><p>Нэг үед таныг тайвруулж байсан зуршил одоо хаана саад болж байгааг ялгаж тайлбарлана.</p></article><article><h3>Одоо анзаарах 3 жижиг алхам</h3><p>Өөрийгөө хүчээр өөрчлөх том амлалт биш, дараагийн долоо хоногт туршиж болох бодит ажиглалт авна.</p></article></div></section>
    <section id="sample-report" class="sample-report" aria-labelledby="sample-title"><p class="eyebrow">Нэргүй жишээ</p><h2 id="sample-title">Таны тайлан ийм бүтэцтэй байна</h2><p class="muted">Доорх нь нэргүй жишээ. Энэ нь таны үр дүн биш; тайлангийн нарийвчлал, бүтэц, хэлбэрийг урьдчилж харуулж байна.</p><div class="sample-report-card"><p class="sample-kicker">ГОЛ ЗУРШИЛ — Стрессээ хоолоор дардаг</p><p>Таны хариултаас харахад та өлссөндөө гэхээсээ илүү ачааллаа буулгах гэж иддэг бололтой. Ялангуяа хүнд өдрийн орой энэ нь хамгийн тод илэрдэг.</p><p class="sample-kicker">АМЬДРАЛ ДЭЭР</p><p>Өдөржин дэглэмээ барьж гүрийсэн хэрнээ орой болоход тэсвэр алддаг. Ажлын өдрүүдээр дэглэмээ барьсан мөртлөө амралтын өдөр сахилга батаа алдаж магад. Энэ тэнцвэргүй хэлхээ таны жин хасахад нөлөөлж буй гол саад байж магад. Гэхдээ тэвчээрийн дутагдалтай байна гэж дүгнэх үндэслэл биш.</p><p class="sample-kicker">ЭХНИЙ АЛХАМ</p><p>Эхний долоо хоногт юу ч хасах гэж яарах хэрэггүй. Ганцхан зүйл тэмдэглээд үз: хэзээ, ямар мэдрэмжтэй үедээ идэв. Ингээд харахад зураг өөрөө гарч ирдэг.</p></div><p class="section-close">Таны хариултад харагдсан давтагддаг зүйл, өдөөгч, мөчлөгийг ойлгоход зориулсан хувийн эргэцүүлэл өгнө.</p></section>
    <section class="cta-banner" aria-label="Дараагийн оролдлого"><p>Дараагийн оролдлогоо өмнөхөөсөө өөр эхлүүлье.</p><p>Эхлээд юу саад болоод байгаагаа мэдэж аваарай.</p><a class="button primary-cta" href="/assessment/start" data-route data-primary-cta>${primary}</a></section>
    <section class="methodology-summary compact-methodology" aria-labelledby="methodology-title"><p class="eyebrow">Үндсэн ойлголт</p><h2 id="methodology-title">Яагаад хоолны дэглэм барих, дасгал хөдөлгөөн хийх дангаараа хангалтгүй байдаг вэ?</h2><p>Юу идэх ёстойгоо мэдэхгүй хүн гэж бараг байхгүй. Яагаад иддэгээ мэддэг хүн л ховор. Дэглэм тэр хоёрын зөрүүн дээр унадаг.</p><p class="methodology-principle">Илүүдэл жин нь тэвчээр дутсаных биш. Давтагддаг зүйлээ хараагүй байхад ямар ч оролдлого эхнээсээ хүндэрдэг.</p><div class="methodology-pillars"><article><h3>Хоолны зан үйлийн судалгаа</h3><p>Хязгаарлалт, цадалт, хяналт алдалтын хэв маяг хэрхэн үүсдэг вэ?</p></article><article><h3>Сэтгэл хөдлөлийн хооллолт</h3><p>Стресс, уйтгар, ганцаардал идэх зан үйлд хэрхэн нөлөөлдөг вэ?</p></article><article><h3>Нойр ба амьдралын хэмнэл</h3><p>Нойр, ядаргаа, хуваарь жинтэй хэрхэн холбогддог вэ?</p></article><article><h3>Аюулгүй байдлын дохио</h3><p>Мэргэжлийн тусламж хэрэгтэйг илтгэх дохио хариултаас илэрвэл тайланд анхааруулж, хаашаа хандахыг зааж өгнө.</p></article></div><p>Үнэлгээ нь нэг асуулт, нэг оноогоор дүгнэдэггүй — хариултын давтамж, хоорондын уялдаагаар хамгийн чухал чиглэлийг эрэмбэлдэг.</p><a class="text-link" href="/methodology" data-route>Арга зүйн дэлгэрэнгүйг унших</a></section>
    <section class="faq-section" aria-labelledby="faq-title"><p class="eyebrow">Тодорхой хариултууд</p><h2 id="faq-title">Асуух зүйл байвал</h2><details><summary>Энэ үнэлгээний зориулалт юу вэ?</summary><p>Жин хасах гэж оролдоод бүтэхгүй байгаагийн цаана яг юу нуугдаад байгааг олж харахад тусална. Хаанаас эхлэхээ мэдчихсэн хүн дэмий зүтгэдэггүй.</p></details><details><summary>Энэ эмнэлгийн онош уу?</summary><p>Үгүй. Онош тавихгүй, эмч, сэтгэлзүйч, хоолзүйчийг орлохгүй. Харин мэргэжлийн хүнтэй уулзах болбол юугаа ярихаа мэдчихсэн очно.</p></details><details><summary>Миний мэдээлэл хэрхэн хадгалагдах вэ?</summary><p>Таны хариултыг та л харна. Дэлгэрэнгүйг <a href="/privacy" data-route>Нууцлалын бодлогоос</a> үзээрэй.</p></details><details><summary>Төлбөр төлсний дараа юу болох вэ?</summary><p>Төлбөр баталгаажмагц тест шууд нээгдэнэ. Дуусмагц тайлан тань бэлэн болно. Имэйл, кодоороо хожим дахин нээж үзнэ.</p></details><details><summary>Төлбөр төлсөн ч эрх нээгдэхгүй бол яах вэ?</summary><p><a href="/support" data-route>Messenger-ээр бичээрэй.</a> Төлбөрийг шалгаад эрхийг тань сэргээж өгнө.</p></details><details><summary>Асуулт хүнд санагдвал яах вэ?</summary><p>Түр завсарлаад дараа үргэлжлүүлж болно. Зөв, буруу хариулт гэж байхгүй — үнэнээрээ хариулсан хүний тайлан л оносон гардаг.</p></details></section>
    <section class="closing-section" aria-labelledby="closing-title"><h2 id="closing-title">Юу саад болоод байгаагаа мэдчихвэл ажил хөнгөрдөг</h2><p>Олон оролдлого бүтээгүй нь та чадваргүйдээ биш. Юу таныг унагаад байгааг хараагүй явсных. Тэрийг нэг харчихвал дараагийн оролдлого огт өөр эхэлдэг.</p><p class="methodology-principle">Өөртэйгөө тэмцэхээсээ өмнө өөрийгөө нэг сонсоод үзье.</p><a class="button primary-cta" href="/assessment/start" data-route data-primary-cta>${primary}</a><p class="landing-microcopy">${questionCountCopy} · ${VERIFIED_LANDING_DURATION} · Хувийн тайлан</p></section>
  </main>${footer()}</div>`;
}
function renderAbout() {
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Тест үнэлгээний тухай</h1>
    <p>Таны шууд өгсөн хариултаас давтагдсан хэв маяг болон ажиглалтыг ялгаж, эхний зураглал гаргана. Төлбөр баталгаажсаны дараа тестээ бөглөж, таны хариултад тулгуурласан бүрэн тайлангаа авна.</p>
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
function renderAssessmentContact() {
  return `<div class="page">${navigation()}<main class="content-card checkout-preparation"><p class="eyebrow">Нэг удаагийн төлбөр</p><h1 id="page-title" tabindex="-1">Тест үнэлгээ болон хувийн тайлангаа авах</h1>
    <p><strong>Тест үнэлгээ болон бүрэн хувийн тайлан</strong></p><p class="price">${PRODUCT.displayPrice} — нэг удаагийн төлбөр</p>
    <ul><li>Бүрэн тест үнэлгээ</li><li>Дэлгэрэнгүй хувийн тайлан</li><li>Тайлангаа хадгалж, дахин нээх боломж</li></ul>
    <form id="contact-form" novalidate><h2>Имэйлээр эрхээ хадгалах</h2><label class="field" for="contact-email"><span>Имэйл</span><input id="contact-email" name="email" type="email" autocomplete="email" required></label>
    <p class="muted">Имэйл хаягийг төлбөр, тестийн явц болон тайлангаа өөр төхөөрөмжөөс сэргээхэд ашиглана.</p><p>Таны мэдээлэл бусад хэрэглэгчид харагдахгүй.</p>
    ${state.invitation ? `<section class="invite-card"><h2>Зөвлөхийн урилга ирсэн байна</h2><p>${escapeHtml(state.invitation.advisorName || "Зөвлөх")} танд тест үнэлгээг санал болгосон байна.</p><fieldset><legend>Тайлан хуваалцах сонголт</legend><label class="option-label"><input type="radio" name="consent" value="yes" required><span>Бүрэн тайлангаа зөвлөхтэй хуваалцана.</span></label><label class="option-label"><input type="radio" name="consent" value="no" required><span>Бүрэн тайлангаа хуваалцахгүй.</span></label></fieldset><p>Асуулт бүрийн түүхий хариултыг зөвлөхөд харуулахгүй.</p></section>` : ""}
    <p id="contact-error" class="error" role="alert" aria-live="assertive"></p><button class="button" type="submit" ${state.busy ? "disabled" : ""}>${state.busy ? "Бэлтгэж байна…" : "QPay-аар төлөөд тестээ эхлүүлэх"}</button>
    <p>Төлбөр баталгаажсаны дараа тест шууд нээгдэнэ.</p><p><a href="/terms" data-route>Үйлчилгээний нөхцөл</a> · <a href="/privacy" data-route>Нууцлалын бодлого</a> · <a href="/support" data-route>Төлбөрийн тусламж</a></p></form></main>${footer()}</div>`;
}
function renderAssessmentCompleted() {
  if (state.commercialFlowVersion === "prepaid_v2") return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Тест дууслаа. Таны тайланг боловсруулж байна.</h1><p role="status">Бүрэн тайланг ачаалж байна…</p></main>${footer()}</div>`;
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
  const prepaid = state.commercialFlowVersion === "prepaid_v2";
  const paymentReady = prepaid ? state.assessmentStatus === "payment_pending" : state.assessmentStatus === "complete";
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">${prepaid ? "Төлбөрөө баталгаажуулж байна" : "Бүрэн тайлангаа нээх"}</h1>
      <p>${prepaid ? "Тест үнэлгээ болон бүрэн хувийн тайлан" : "Жин хасалтад тань нөлөөлж буй сэтгэлзүйн шалтгаан, хэв маяг болон танд тохирох өөрчлөлтийн чиглэлийг агуулсан бүрэн тайлангаа нээнэ үү."}</p>
      <section aria-labelledby="payment-title"><h2 id="payment-title">QPay нэхэмжлэл</h2><p class="price">Үнэ: ${PRODUCT.displayPrice}</p>
        ${prepaid ? `<p class="notice">QPay төлбөрөө хийсний дараа тест автоматаар нээгдэнэ.</p>` : paymentReady ? "" : `<p class="notice">QPay төлбөрийн товч тест үнэлгээг бүрэн дуусгасны дараа нээгдэнэ.</p>`}
        <p class="payment-status" role="status" aria-live="polite">${escapeHtml(statusCopy)}</p>
        ${payment.status !== "paid" && payment.qrImage ? `<img class="qpay-qr" src="data:image/png;base64,${escapeAttribute(payment.qrImage)}" alt="QPay QR код">` : ""}
        ${payment.status !== "paid" && Array.isArray(payment.urls) && payment.urls.length ? `<ul class="payment-app-links">${payment.urls.filter(item => /^https:\/\//.test(String(item.link || item.url || ""))).map(item => `<li><a class="button secondary" href="${escapeAttribute(item.link || item.url)}" rel="noopener">${escapeHtml(item.name || item.description || "Банкны апп")}</a></li>`).join("")}</ul>` : ""}
        ${payment.status !== "paid" && payment.expiresAt ? `<p>Нэхэмжлэлийн хугацаа: <time datetime="${escapeAttribute(payment.expiresAt)}">${escapeHtml(new Date(payment.expiresAt).toLocaleString("mn-MN"))}</time></p>` : ""}
        ${["pending", "check_error", "paid_but_not_unlocked"].includes(payment.status) ? `<button class="button" type="button" data-action="check-payment">Төлбөр шалгах</button>` : payment.status === "paid" ? (prepaid ? `<p class="notice">Төлбөр баталгаажлаа. Тест нээгдлээ.</p>` : `<p class="notice">Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ.</p><a class="button" href="/report" data-route>Бүрэн тайлан харах</a>`) : !paymentReady || createBlocked || prepaid ? "" : `<button class="button" type="button" data-action="create-invoice">${PRODUCT.displayPrice}-ийн QPay нэхэмжлэл үүсгэх</button>`}
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
    <p class="muted">Өөрт хамгийн ойр хариултаа сонгоорой. Таны явц автоматаар хадгалагдана.</p>
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
  paymentsConfirmed: total.paymentsConfirmed + Number(day.paymentsConfirmed || 0), reportsOpened: total.reportsOpened + Number(day.reportsOpened || 0), revenueMnt: total.revenueMnt + Number(day.revenueMnt || 0) }),
  { uniqueVisitors: 0, landingViews: 0, assessmentsStarted: 0, assessmentsCompleted: 0, paywallViews: 0, invoicesCreated: 0, paymentsConfirmed: 0, reportsOpened: 0, revenueMnt: 0 }); }
function rate(numerator, denominator) { return denominator ? `${(100 * numerator / denominator).toFixed(1)}%` : "—"; }
function comparison(current, prior) { if (!Number.isFinite(Number(prior)) || Number(prior) === 0) return "—"; const change = 100 * (Number(current) - Number(prior)) / Number(prior); return Number.isFinite(change) ? `Өмнөх хугацаанаас ${change >= 0 ? "+" : ""}${change.toFixed(1)}%` : "—"; }
function safeRate(value) { return value != null && Number.isFinite(Number(value)) ? `${(Number(value) * 100).toFixed(1)}%` : "—"; }
function compactNumber(value) { const number = Number(value || 0); return Number.isInteger(number) ? String(number) : number.toFixed(1); }
function questionProgressWarning(covered) {
  if (Number(covered) < 10) return "Түүвэр бага тул уналтын үзүүлэлтийг урьдчилсан дохио гэж үзнэ.";
  if (Number(covered) < 30) return "Түүвэр нэмэгдэж байна. Гол уналтын цэгүүдийг ажиглана.";
  return "";
}
function renderQuestionRows(rows) {
  return rows.map(row => { const eligible = Number(row.dropoffEligibleCount || 0); const rate = eligible > 0
    ? safeRate(Number(row.confirmedStoppedCount || 0) / eligible)
    : `<span title="Хэмжихэд хараахан хангалттай live хугацаа бүрдээгүй.">—</span>`;
    return `<tr><td>${escapeHtml(row.sectionLabel || row.sectionKey || "—")}</td><td><code>${escapeHtml(row.questionId)}</code>${row.versionBadge ? ` <span class="question-version-badge">${escapeHtml(row.versionBadge)}</span>` : ""} — ${escapeHtml(row.analyticsLabel || row.questionId)}</td><td>${Number(row.totalReachedCount || 0)}</td><td>${Number(row.totalAnsweredCount || 0)}</td><td>${Number(row.activeAtQuestionCount || 0)}</td><td>${eligible}</td><td>${Number(row.confirmedStoppedCount || 0)}</td><td>${rate}</td></tr>`; }).join("");
}
function formatAnalyticsDate(value) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const byType = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${byType.year}.${byType.month}.${byType.day}`;
}
function formatAnalyticsDateTime(value) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(value));
  const byType = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${byType.year}.${byType.month}.${byType.day} ${byType.hour}:${byType.minute}`;
}
function renderQuestionProgressAnalytics() {
  const progress = state.admin.analytics.questionProgress || { summary: null, questions: [], expanded: false, showAll: false }; const summary = progress.summary || {};
  const cohort = Number(summary.cohortStarted || 0); const covered = Number(summary.coveredAssessments || 0); const completed = Number(summary.completedCount || 0);
  const liveCovered = Number(summary.liveProgressAssessments || 0); const backfillOnly = Number(summary.backfillOnlyAssessments || 0);
  const questions = progress.questions || []; const topFive = questions.filter(row => Number(row.confirmedStoppedCount || 0) > 0 && Number(row.dropoffEligibleCount || 0) > 0).slice(0, 5); const warning = questionProgressWarning(covered);
  const started = summary.instrumentationStartedAt ? formatAnalyticsDate(summary.instrumentationStartedAt) : "бүртгэл үүссэн өдрөөс";
  const table = rows => `<div class="table-scroll question-progress-table" tabindex="0"><table><thead><tr><th>Үе шат</th><th>Асуулт</th><th>Нийт хүрсэн</th><th>Хариулсан</th><th>Идэвхтэй &lt;24ц</th><th>Уналтад тооцсон</th><th>24+ц зогссон</th><th>Уналтын хувь</th></tr></thead><tbody>${renderQuestionRows(rows)}</tbody></table></div>`;
  return `<section class="question-progress-card${progress.expanded ? " is-expanded" : ""}" aria-labelledby="question-progress-title"><h3 id="question-progress-title">Тестийн явц ба уналт</h3>
    <div class="question-progress-summary"><article><span>Явц бүртгэгдсэн</span><strong>${covered} / ${cohort} үнэлгээ</strong></article><article><span>Дундаж хүрсэн асуулт</span><strong>${compactNumber(summary.averageQuestionsReached)}</strong></article><article><span>Дуусгасан</span><strong>${completed} / ${cohort} буюу ${cohort ? safeRate(completed / cohort) : "—"}</strong></article><article><span>Хамгийн олон зогссон цэг</span><strong>${summary.topStopLabel ? `${escapeHtml(summary.topStopLabel)} — ${Number(summary.topStopCount || 0)} хүн` : "Одоогоор бүртгэгдээгүй"}</strong></article></div>
    <p class="question-progress-coverage">Нийт эхэлсэн: ${cohort}. Явцтай: ${covered}. Хамралт: ${cohort ? safeRate(covered / cohort) : "—"}.</p>
    <button class="button compact secondary question-progress-toggle" type="button" data-action="toggle-question-progress" aria-expanded="${progress.expanded}" aria-controls="question-progress-details">Асуултын явцыг дэлгэрэнгүй харах</button>
    ${progress.expanded ? `<div id="question-progress-details">${topFive.length ? `<h4>Хамгийн их уналттай цэгүүд</h4>${table(topFive)}` : `<p>24 цагаас хуучин зогсолт одоогоор бүртгэгдээгүй байна.</p>`}
      <p>Уналтын хувь нь зөвхөн бодитоор бүртгэгдсэн бөгөөд 24 цагийн ажиглалтын хугацаа бүрдсэн тестүүдэд тооцогдоно. Өмнөх хадгалагдсан хариултууд нийт хүрсэн, хариулсан тоонд багтсан боловч уналтын хувь бодоход орохгүй.</p>
      <p>Сүүлийн 24 цагт идэвхтэй байгаа тестийг зогссон гэж тооцоогүй.</p>
      <p class="analytics-coverage">Live явцтай: ${liveCovered}. Зөвхөн өмнөх хадгалагдсан хариултын нотолгоотой: ${backfillOnly}. Дундаж хүрсэн асуулт нь нийт батлагдсан асуултын нотолгоонд тулгуурлана.</p>${warning ? `<p class="analytics-comparison-note">${escapeHtml(warning)}</p>` : ""}
      <p class="analytics-coverage">Асуултын явцын нарийвчилсан бүртгэл ${escapeHtml(started)}-ээс эхэлсэн. Өмнөх хариултуудыг зөвхөн хадгалагдсан бодит хариултаар нөхөн тооцов.</p>
      <button class="button compact secondary question-progress-toggle" type="button" data-action="toggle-all-questions" aria-expanded="${progress.showAll}" aria-controls="question-progress-all">Бүх асуултыг харах</button>
      ${progress.showAll ? `<div id="question-progress-all"><h4>Бүх бүртгэгдсэн асуулт</h4>${table(questions)}</div>` : ""}</div>` : ""}</section>`;
}
function hasAnalyticsData(summary) { return summary && ["eligibleVisitors", "uniqueVisitors", "assessmentsStarted", "assessmentsCompleted", "paymentSectionViews", "invoicesCreated", "paymentsConfirmed"].some(key => Number(summary[key] || 0) > 0); }
const CONVERSION_REASONS = Object.freeze({
  no_denominator: "Сонгосон хугацаанд энэ шатны эхлэх бүртгэл байхгүй.",
  no_paid_first_visitors: "Сонгосон хугацаанд төлбөр-эхэнд урсгалын зочны бүлэг байхгүй.",
  visitor_assessment_linkage_unavailable: "Зочныг төлбөрийн хэсгийн үнэлгээтэй найдвартай холбох бүртгэл хүрэлцэхгүй.",
  no_paid_first_payment_section_entries: "Сонгосон хугацаанд төлбөрийн хэсэгт хүрсэн төлбөр-эхэнд үнэлгээ байхгүй.",
  no_paid_first_invoice_entries: "Сонгосон хугацаанд үүссэн төлбөр-эхэнд нэхэмжлэл байхгүй.",
  no_paid_first_payment_entries: "Сонгосон хугацаанд баталгаажсан төлбөр-эхэнд төлбөр байхгүй.",
  no_paid_first_start_entries: "Сонгосон хугацаанд эхэлсэн төлбөр-эхэнд тест байхгүй.",
  no_paid_first_complete_entries: "Сонгосон хугацаанд дууссан төлбөр-эхэнд тест байхгүй."
});
function conversionDisplay(conversion) {
  if (conversion?.status === "available" && conversion.rate != null) return safeRate(conversion.rate);
  const reason = CONVERSION_REASONS[conversion?.reason] || CONVERSION_REASONS[conversion?.status] || "Энэ хөрвөлтийн хувийг ижил cohort-оор тооцох боломжгүй.";
  return `<span title="${escapeAttribute(reason)}">—</span>`;
}
function analyticsCoverageCopy(coverage) {
  const notices = [];
  if (coverage?.visitorTrackingStartedAt) notices.push(`Зочны ерөнхий хэмжилт ${formatAnalyticsDate(coverage.visitorTrackingStartedAt)}-өөс эхэлсэн. Үүнээс өмнөх зочны үзэлтийн мэдээлэл бүрэн биш байж болно.`);
  if (coverage?.paidFirstCutoverAt) {
    const [date, time] = formatAnalyticsDateTime(coverage.paidFirstCutoverAt).split(" ");
    notices.push(`Төлбөр-эхэнд урсгал ${date}-ны ${time} цагаас эхэлсэн. Үндсэн funnel-ийн шинэ зочин нь энэ мөчөөс хойш анх орсон хэрэглэгчдийг харуулна.`);
  }
  return notices;
}
function analyticsFlowStateCopy(coverage, legacy) {
  const flowState = coverage?.flowState || "empty";
  if (flowState === "mixed") return "Сонгосон хугацаанд хуучин болон төлбөр-эхэнд урсгалын бүртгэл хоёулаа байна. Урсгал хоорондын тоог хольж хувь тооцоогүй.";
  if (flowState === "legacy_with_prepaid_visitors") return `Сонгосон хугацаанд төлбөр-эхэнд урсгалын шинэ зочид бүртгэгдсэн боловч төлбөрийн хэсэгт хүрсэн шинэ тест хараахан байхгүй. Эхэлсэн ${Number(legacy?.assessmentsStarted || 0)} тест нь хуучин төлбөрийн урсгалд хамаарна.`;
  if (flowState === "legacy_only") return "Сонгосон хугацааны тест болон зочны бүртгэлүүд хуучин төлбөрийн урсгалд хамаарна. Төлбөр-эхэнд урсгалын хөрвөлтийн хувь хараахан үүсээгүй.";
  if (flowState === "prepaid_visitors_only") return "Төлбөр-эхэнд урсгалын шинэ зочид бүртгэгдсэн боловч дараагийн шатанд хүрсэн тест хараахан байхгүй.";
  return "";
}
function renderAdminAnalytics() {
  const analytics = state.admin.analytics; const total = analytics.currentFlow || {}; const prior = analytics.priorCurrentFlow || {};
  const legacy = analytics.legacyFlow || {}; const conversions = analytics.conversions || {}; const priorAvailable = hasAnalyticsData(analytics.priorCurrentFlow);
  const coverage = analytics.coverage || {}; const legacyPresent = coverage.legacyActivityPresent === true; const coverageNotices = analyticsCoverageCopy(coverage); const flowNotice = analyticsFlowStateCopy(coverage, legacy);
  const allMeasuredVisitors = Number(coverage.allMeasuredVisitors ?? analytics.allFlows?.uniqueVisitors ?? 0);
  const card = (label, value, description, key) => `<article><h3>${label}</h3><p class="metric-value">${value}</p><p>${description}</p><p class="metric-compare">${priorAvailable ? comparison(total[key], prior[key]) : "—"}</p></article>`;
  const stages = [["Шинэ зочин", total.eligibleVisitors || 0, null], ["QPay төлбөрийн дэлгэц", total.paymentSectionViews || 0, conversions.visitorToPaymentSection], ["Нэхэмжлэл", total.invoicesCreated || 0, conversions.paymentSectionToInvoice], ["Төлбөр", total.paymentsConfirmed || 0, conversions.invoiceToPayment], ["Тест эхлүүлсэн", total.assessmentsStarted || 0, conversions.paymentToStart], ["Тест дуусгасан", total.assessmentsCompleted || 0, conversions.startToComplete], ["Тайлан нээсэн", total.reportsOpened || 0, conversions.completeToReportOpen]];
  const dailyUnavailable = `<span title="Өдөр тутмын шатны хугацаа өөр байж болох тул хувь тооцоогүй.">—</span>`;
  const landingCtaClicks = Number(total.landingCtaClicks || 0);
  const paymentPreparationViews = Number(total.paymentPreparationViews || 0);
  const hourlyRows = analytics.landingCutoverHourly?.hours || [];
  const landingConversion = (numerator, denominator) => denominator > 0 ? safeRate(numerator / denominator) : "—";
  return `<section class="analytics-dashboard" aria-labelledby="analytics-title"><h2 id="analytics-title">Өдөр тутмын үзүүлэлт</h2><p><strong>Одоогийн урсгал: Төлбөр эхэнд</strong></p><p>Цагийн бүс: Улаанбаатар</p>
    <form id="analytics-filter-form" class="analytics-filters"><label><span>Хугацаа</span><select name="preset"><option value="today"${analytics.preset === "today" ? " selected" : ""}>Өнөөдөр</option><option value="yesterday"${analytics.preset === "yesterday" ? " selected" : ""}>Өчигдөр</option><option value="last7"${analytics.preset === "last7" ? " selected" : ""}>Сүүлийн 7 хоног</option><option value="last30"${analytics.preset === "last30" ? " selected" : ""}>Сүүлийн 30 хоног</option><option value="thisMonth"${analytics.preset === "thisMonth" ? " selected" : ""}>Энэ сар</option><option value="previousMonth"${analytics.preset === "previousMonth" ? " selected" : ""}>Өмнөх сар</option><option value="custom"${analytics.preset === "custom" ? " selected" : ""}>Өөр хугацаа</option></select></label><label><span>Эхлэх өдөр</span><input type="date" name="startDate" value="${escapeAttribute(analytics.startDate)}"></label><label><span>Дуусах өдөр</span><input type="date" name="endDate" value="${escapeAttribute(analytics.endDate)}"></label><button class="button compact" type="submit">Харах</button></form>
    ${analytics.loading ? `<p role="status">Үзүүлэлтийг ачаалж байна…</p>` : ""}${analytics.error ? `<p class="error">${escapeHtml(analytics.error)}</p>` : ""}
    <p class="analytics-context"><strong>Сонгосон хугацаанд хэмжигдсэн нийт зочин: ${allMeasuredVisitors}</strong></p>
    ${coverageNotices.map(notice => `<p class="analytics-coverage">${escapeHtml(notice)}</p>`).join("")}
    ${flowNotice ? `<p class="notice">${escapeHtml(flowNotice)}</p>` : ""}
    ${!priorAvailable ? `<p class="analytics-comparison-note">Сонгосон хугацааг өмнөх ижил хугацаатай харьцуулах боломжгүй байна.</p>` : ""}
    <section class="landing-micro-funnel" aria-labelledby="landing-micro-funnel-title"><h3 id="landing-micro-funnel-title">Нүүр хуудасны эхний хөрвөлт</h3><div class="metric-grid analytics-metrics"><article><h3>Шинэ зочин</h3><p class="metric-value">${Number(total.eligibleVisitors || 0)}</p></article><article><h3>Үндсэн CTA дарсан</h3><p class="metric-value">${landingCtaClicks}</p></article><article><h3>Төлбөрийн бэлтгэлд хүрсэн</h3><p class="metric-value">${paymentPreparationViews}</p></article><article><h3>Зочин → CTA</h3><p class="metric-value">${landingConversion(landingCtaClicks, Number(total.eligibleVisitors || 0))}</p></article><article><h3>CTA → төлбөрийн бэлтгэл</h3><p class="metric-value">${landingConversion(paymentPreparationViews, landingCtaClicks)}</p></article></div></section>
    <section class="landing-micro-funnel" aria-labelledby="landing-cutover-hourly-title"><h3 id="landing-cutover-hourly-title">Deploy-оос хойших цагийн эхний хөрвөлт</h3><p class="analytics-hourly-note">Төлбөрийн бэлтгэл нь үнэ, имэйл болон авах зүйлсээ харсан үе. QPay төлбөрийн дэлгэц нь нэхэмжлэл үүсгэхийн өмнөх дараагийн шат. Cutover-оос хойших цаг бүрийн шинэ зочин, CTA болон бэлтгэлд хүрсэн тоог харуулна.</p><div class="table-scroll" tabindex="0"><table><thead><tr><th>Цаг</th><th>Шинэ зочин / цаг</th><th>CTA дарсан</th><th>Төлбөрийн бэлтгэлд хүрсэн</th></tr></thead><tbody>${hourlyRows.map(row => `<tr><td>${escapeHtml(row.hour || "—")}</td><td>${Number(row.newVisitors ?? row.new_visitors ?? 0)}</td><td>${Number(row.ctaClicks ?? row.cta_clicks ?? 0)}</td><td>${Number(row.paymentPreparationViews ?? row.payment_preparation_views ?? 0)}</td></tr>`).join("")}</tbody></table></div></section>
    <div class="metric-grid analytics-metrics">${card("Төлбөр-эхэнд урсгалын шинэ зочин", total.eligibleVisitors || 0, `QPay төлбөрийн дэлгэцэд хүрсэн хувь: ${conversionDisplay(conversions.visitorToPaymentSection)}`, "eligibleVisitors")}${card("QPay төлбөрийн дэлгэц", total.paymentSectionViews || 0, `Нэхэмжлэл үүсгэсэн хувь: ${conversionDisplay(conversions.paymentSectionToInvoice)}`, "paymentSectionViews")}${card("Нэхэмжлэл", total.invoicesCreated || 0, `Төлбөр төлсөн хувь: ${conversionDisplay(conversions.invoiceToPayment)}`, "invoicesCreated")}${card("Төлбөр", total.paymentsConfirmed || 0, `Тест эхлүүлсэн хувь: ${conversionDisplay(conversions.paymentToStart)}`, "paymentsConfirmed")}${card("Тест эхлүүлсэн", total.assessmentsStarted || 0, `Тест дуусгасан хувь: ${conversionDisplay(conversions.startToComplete)}`, "assessmentsStarted")}${card("Тест дуусгасан", total.assessmentsCompleted || 0, `Тайлан нээсэн хувь: ${conversionDisplay(conversions.completeToReportOpen)}`, "assessmentsCompleted")}${card("Тайлан нээсэн", total.reportsOpened || 0, "Бүрэн тайлан серверээр нээгдсэн", "reportsOpened")}${card("Орлого", money(total.revenueMnt), "Серверээр баталгаажсан төлбөр", "revenueMnt")}</div>
    <ol class="funnel-visual" aria-label="Үндсэн хөрвөлтийн дараалал">${stages.map(([label, value, conversion]) => `<li><span>${label}</span><strong>${value}</strong>${conversion ? `<small>${conversionDisplay(conversion)}</small>` : ""}</li>`).join("")}</ol>
    ${legacyPresent ? `<aside class="analytics-coverage" aria-label="Хуучин төлбөрийн урсгал"><p><strong>Хуучин урсгалын бодит бүртгэл</strong></p><ul><li>Legacy тест эхлүүлсэн: ${Number(legacy.assessmentsStarted || 0)}</li><li>Legacy тест дуусгасан: ${Number(legacy.assessmentsCompleted || 0)}</li><li>Legacy нэхэмжлэл: ${Number(legacy.invoicesCreated || 0)}</li><li>Legacy төлбөр: ${Number(legacy.paymentsConfirmed || 0)}</li><li>Legacy орлого: ${money(legacy.revenueMnt)}</li></ul></aside>` : ""}
    ${renderQuestionProgressAnalytics()}
    <p class="analytics-daily-note">Доорх хүснэгт төлбөр-эхэнд урсгалын үзүүлэлтийг өдрөөр харуулна.</p>
    <div class="table-scroll" tabindex="0"><table><thead><tr><th>Огноо</th><th>Шинэ зочин</th><th>QPay төлбөрийн дэлгэц</th><th>Хүрсэн хувь</th><th>Нэхэмжлэл</th><th>Нэхэмжлэл үүсгэсэн хувь</th><th>Төлбөр</th><th>Төлбөр төлсөн хувь</th><th>Тест эхлүүлсэн</th><th>Тест эхлүүлсэн хувь</th><th>Тест дуусгасан</th><th>Дуусгасан хувь</th><th>Тайлан нээсэн</th><th>Тайлан нээсэн хувь</th><th>Орлого</th></tr></thead><tbody>${analytics.days.map(day => `<tr><td>${escapeHtml(day.date)}</td><td>${day.uniqueVisitors}</td><td>${day.paymentSectionViews}</td><td>${dailyUnavailable}</td><td>${day.invoicesCreated}</td><td>${dailyUnavailable}</td><td>${day.paymentsConfirmed}</td><td>${dailyUnavailable}</td><td>${day.assessmentsStarted}</td><td>${dailyUnavailable}</td><td>${day.assessmentsCompleted}</td><td>${dailyUnavailable}</td><td>${day.reportsOpened}</td><td>${dailyUnavailable}</td><td>${money(day.revenueMnt)}</td></tr>`).join("")}</tbody></table></div></section>`;
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
  if (route === "assessmentStart") return renderAssessmentContact();
  if (route === "assessmentContact") return renderAssessmentContact();
  if (route === "assessmentCompleted") return renderAssessmentCompleted();
  if (route === "payment") return renderPayment();
  if (route === "questions") return state.questionsAuthorized ? renderQuestions() : `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Төлбөрийн эрхийг шалгаж байна</h1><p role="status">Тест нээх эрхийг серверээс баталгаажуулж байна…</p></main>${footer()}</div>`;
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

async function submitContact(form) {
  const input = formObject(form); const error = contactValidation(input); if (error) throw new Error(error);
  state.busy = true; render();
  await ensureSession();
  if (state.inviteToken) { state.invitation = await api("/.netlify/functions/advisor-invite-resolve", { method: "POST", body: JSON.stringify({ inviteToken: state.inviteToken }) }); state.inviteToken = ""; render(); }
  const contact = await api("/.netlify/functions/weight-recovery-contact-save", { method: "POST", body: JSON.stringify(input) });
  state.contactGroupId = contact.contactGroupId;
  let coachClientId = null;
  if (state.invitation) {
    if (!input.consent) throw new Error("Тайлан хуваалцах сонголтоо хийнэ үү.");
    const consent = await api("/.netlify/functions/advisor-consent", { method: "POST", body: JSON.stringify({ coachClientId: state.invitation.coachClientId, consent: input.consent === "yes" }) });
    if (input.consent === "yes") coachClientId = consent.coachClientId;
  }
  const assessment = await api("/.netlify/functions/weight-assessment-create", { method: "POST", body: JSON.stringify({ prepaid: true,
    recoveryContactGroupId: state.contactGroupId, analyticsContext: analyticsIdentity(), ...(coachClientId ? { coachClientId } : {}) }) });
  state.assessmentId = assessment.assessmentId; state.assessmentStatus = assessment.status; state.commercialFlowVersion = assessment.commercialFlowVersion;
  state.questionnaireVersion = assessment.questionnaireVersion || state.questionnaireVersion;
  if (assessment.previewBypass) {
    const access = await api("/.netlify/functions/weight-assessment-questions", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId }) });
    state.assessmentStatus = access.status; state.startedAt = access.startedAt || state.startedAt; state.questionsAuthorized = true;
    state.busy = false; navigate("/assessment/questions"); return;
  }
  try { state.payment = await api("/.netlify/functions/qpay-create-invoice", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId }) }); }
  catch (requestError) { const ambiguous = ["invoice_create_unknown", "invoice_reconciliation_required", "replacement_authorization_required"].includes(requestError?.body?.error); setPaymentStatus(ambiguous ? "create_unknown" : "create_error"); }
  state.busy = false; navigate("/assessment/payment");
}
async function submitConsent(form) {
  const accepted = formObject(form).consent === "yes";
  const result = await api("/.netlify/functions/advisor-consent", { method: "POST", body: JSON.stringify({ coachClientId: state.invitation.coachClientId, consent: accepted }) });
  const assessment = await api("/.netlify/functions/weight-assessment-create", { method: "POST", body: JSON.stringify({ recoveryContactGroupId: state.contactGroupId, analyticsContext: analyticsIdentity(), ...(accepted ? { coachClientId: result.coachClientId } : {}) }) });
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
  if (state.busy || !state.payment?.paymentId) return;
  state.busy = true;
  setPaymentStatus("checking"); render();
  try {
    state.payment = await api("/.netlify/functions/qpay-check-payment", { method: "POST", body: JSON.stringify({ paymentId: state.payment.paymentId }) });
    if (state.payment.status === "paid") {
      if (state.commercialFlowVersion === "prepaid_v2") {
        state.assessmentStatus = "paid_ready";
        try {
          const access = await api("/.netlify/functions/weight-assessment-questions", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId }) });
          state.assessmentStatus = access.status; state.startedAt = access.startedAt || state.startedAt; state.questionsAuthorized = true;
        } catch {
          setPaymentStatus("paid_but_not_unlocked"); state.questionsAuthorized = false; state.busy = false; render(); return;
        }
      }
      state.busy = false; navigate(state.payment.nextRoute || (state.commercialFlowVersion === "prepaid_v2" ? "/assessment/questions" : "/report")); return;
    }
  }
  catch { setPaymentStatus("check_error"); } finally { state.busy = false; } render();
}
function schedulePaymentPolling() {
  if (typeof window === "undefined") return;
  if (paymentPollTimer) { clearTimeout(paymentPollTimer); paymentPollTimer = null; }
  const payment = state.payment || {};
  if (routeName(window.location.pathname) !== "payment" || !["pending", "check_error"].includes(payment.status) || !payment.paymentId) return;
  if (!paymentPollingStartedAt) paymentPollingStartedAt = Date.now();
  const expired = payment.expiresAt && Date.parse(payment.expiresAt) <= Date.now();
  if (expired || Date.now() - paymentPollingStartedAt > 15 * 60 * 1000) return;
  paymentPollTimer = setTimeout(() => { if (!document.hidden) checkPayment(); else schedulePaymentPolling(); }, document.hidden ? 12000 : 4000);
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
    if (state.commercialFlowVersion === "prepaid_v2") { state.report = await loadReport(); navigate("/report"); return; }
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
  state.assessmentId = result.assessmentId; navigate(result.nextRoute || "/report"); await restoreServerState(); render();
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
    const [current, prior, questionProgress] = await Promise.all([
      api(`/.netlify/functions/admin-analytics-daily?startDate=${selected.startDate}&endDate=${selected.endDate}`, { method: "GET" }),
      api(`/.netlify/functions/admin-analytics-daily?startDate=${priorStart}&endDate=${priorEnd}`, { method: "GET" }),
      api(`/.netlify/functions/admin-question-progress?startDate=${selected.startDate}&endDate=${selected.endDate}`, { method: "GET" })
    ]);
    analytics.days = current.days || []; analytics.priorDays = prior.days || []; analytics.summary = current.summary || null; analytics.priorSummary = prior.summary || null;
    analytics.allFlows = current.allFlows || current.summary || null; analytics.currentFlow = current.currentFlow || null; analytics.priorCurrentFlow = prior.currentFlow || null;
    analytics.legacyFlow = current.legacyFlow || null; analytics.conversions = current.conversions || null; analytics.coverage = current.coverage || null; analytics.landingCutoverHourly = current.landingCutoverHourly || { hours: [], totals: {} };
    analytics.questionProgress.summary = questionProgress.summary || null; analytics.questionProgress.questions = questionProgress.questions || [];
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
  if (state.inviteToken && ["assessmentStart", "assessmentContact"].includes(route)) { try { state.invitation = await api("/.netlify/functions/advisor-invite-resolve", { method: "POST", body: JSON.stringify({ inviteToken: state.inviteToken }) }); state.inviteToken = ""; } catch {} }
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
    if (!restored.assessment) { if (route === "questions") navigate("/assessment/start", { replace: true }); return; }
    state.assessmentId = restored.assessment.assessmentId; state.assessmentStatus = restored.assessment.status; state.commercialFlowVersion = restored.assessment.commercialFlowVersion || "legacy_postpaid_v1"; state.questionnaireVersion = restored.assessment.questionnaireVersion || questionApi.LEGACY_QUESTIONNAIRE_VERSION; state.payment = restored.payment || state.payment;
    state.answers = restored.answers || {}; state.report = restored.report || null;
    if (restored.nextRoute && route === "questions" && restored.nextRoute !== "/assessment/questions") { navigate(restored.nextRoute, { replace: true }); return; }
    if (route === "questions" && restored.nextRoute === "/assessment/questions") {
      const access = await api("/.netlify/functions/weight-assessment-questions", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId }) });
      state.assessmentStatus = access.status; state.startedAt = access.startedAt || state.startedAt; state.questionsAuthorized = true;
    }
    if (["draft", "paid_ready", "in_progress"].includes(restored.assessment.status)) {
      const routedQuestions = questionApi.visibleQuestions(state.answers, state.questionnaireVersion);
      const firstIncomplete = routedQuestions.findIndex(question => questionApi.validateAnswer(question, state.answers[question.id], { answers: state.answers, version: state.questionnaireVersion }));
      state.questionIndex = firstIncomplete >= 0 ? firstIncomplete : Math.max(0, routedQuestions.length - 1);
    }
  } catch {}
}

function bind(root) {
  root.querySelectorAll("a[data-route]").forEach(link => link.addEventListener("click", event => { event.preventDefault(); if (window.location.pathname === "/" && link.hasAttribute("data-primary-cta")) trackEvent("landing_cta_clicked"); navigate(link.getAttribute("href")); }));
  root.querySelectorAll("[data-question]").forEach(input => input.addEventListener(["text", "number"].includes(input.type) || input.tagName === "TEXTAREA" ? "input" : "change", () => updateAnswer(input)));
  root.querySelector("#contact-form")?.addEventListener("submit", event => { event.preventDefault(); submitContact(event.currentTarget).catch(error => { state.busy = false; render(); const node = document.getElementById("contact-error"); if (node) node.textContent = error.message; }); });
  root.querySelector("#consent-form")?.addEventListener("submit", event => { event.preventDefault(); submitConsent(event.currentTarget).catch(() => { state.validationError = "Сонголтыг хадгалж чадсангүй."; render(); }); });
  root.querySelector("#question-form")?.addEventListener("submit", event => { event.preventDefault(); nextQuestion(); });
  root.querySelector("#recovery-request-form")?.addEventListener("submit", event => { event.preventDefault(); requestRecovery(event.currentTarget).catch(error => { state.recovery.error = error?.body?.error === "recovery_unavailable" || error.message === "recovery_unavailable" ? "Сэргээх кодыг одоогоор илгээж чадсангүй. Түр хүлээгээд дахин оролдоно уу." : "Сэргээх хүсэлтийг одоогоор боловсруулах боломжгүй байна."; render(); }); });
  root.querySelector("#recovery-confirm-form")?.addEventListener("submit", event => { event.preventDefault(); confirmRecovery(event.currentTarget).catch(() => { state.recovery.error = "Баталгаажуулах код буруу эсвэл хугацаа дууссан байна."; render(); }); });
  root.querySelector("#advisor-login-form")?.addEventListener("submit", event => { event.preventDefault(); advisorLoginSubmit(event.currentTarget).catch(() => { state.advisor.error = "Имэйл эсвэл нууц үг буруу байна."; render(); }); });
  root.querySelector("#advisor-password-form")?.addEventListener("submit", event => { event.preventDefault(); advisorPasswordSubmit(event.currentTarget).catch(() => { state.advisor.error = "Нууц үгийг сольж чадсангүй."; render(); }); });
  root.querySelector("#advisor-invite-form")?.addEventListener("submit", event => { event.preventDefault(); advisorInviteSubmit(event.currentTarget).catch(() => { state.advisor.error = "Урилга үүсгэж чадсангүй."; render(); }); });
  root.querySelector("#admin-login-form")?.addEventListener("submit", event => { event.preventDefault(); adminLoginSubmit(event.currentTarget).catch(() => { state.admin.error = "Нэвтрэх мэдээлэл буруу байна."; render(); }); });
  root.querySelector("#admin-advisor-form")?.addEventListener("submit", event => { event.preventDefault(); adminAdvisorSubmit(event.currentTarget).catch(() => { state.admin.error = "Зөвлөх үүсгэж чадсангүй."; render(); }); });
  root.querySelector("#analytics-filter-form")?.addEventListener("submit", event => { event.preventDefault(); const input = formObject(event.currentTarget); loadAdminAnalytics(input.preset, input).then(() => render()).catch(() => { state.admin.analytics.error = "Хугацааг шалгана уу."; render(); }); });
  root.querySelector('[data-action="toggle-question-progress"]')?.addEventListener("click", () => { const progress = state.admin.analytics.questionProgress; progress.expanded = !progress.expanded; if (!progress.expanded) progress.showAll = false; render({ focus: false }); });
  root.querySelector('[data-action="toggle-all-questions"]')?.addEventListener("click", () => { const progress = state.admin.analytics.questionProgress; progress.showAll = !progress.showAll; render({ focus: false }); });
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
  if (["assessmentStart", "assessmentContact"].includes(route)) trackEvent("payment_preparation_viewed", "", "payment_preparation_viewed:page-load");
  if (route === "payment") trackEvent("paywall_viewed", state.assessmentId || undefined);
  if (route === "questions" && state.questionsAuthorized && state.assessmentId) trackRenderedQuestion();
  const heading = document.getElementById("page-title"); if (options.focus !== false && heading) heading.focus();
  schedulePaymentPolling();
  return root.innerHTML;
}
function navigate(pathname, options = {}) { if (typeof window === "undefined") return; window.history[options.replace ? "replaceState" : "pushState"]({}, "", pathname); render(); }
function captureInviteToken() { if (typeof window === "undefined") return; const url = new URL(window.location.href); const token = url.searchParams.get("invite"); if (!token) return; state.inviteToken = token; url.searchParams.delete("invite"); window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`); }
if (typeof window !== "undefined") { window.addEventListener("popstate", async () => { await restoreServerState(); render(); }); window.addEventListener("DOMContentLoaded", async () => { captureInviteToken(); await restoreServerState(); render({ focus: false }); }); }
if (typeof module !== "undefined") module.exports = { PRODUCT, PAYMENT_COPY, PAYMENT_STATES, WEIGHT_TEST_COMING_SOON_MODE, isComingSoon, routeName, renderForPath, contactValidation, setPaymentStatus, money,
  saveAdminReportPreviewAssessment, loadAdminReportPreviewAssessment, clearAdminReportPreviewAssessment,
  _test: { setComingSoon(value) { testComingSoonOverride = Boolean(value); }, resetComingSoon() { testComingSoonOverride = null; }, setState(value) { state = { ...createState(), ...value }; }, getState() { return state; }, buildReportSections,
    analyticsRange, analyticsTotals, rate, safeRate, comparison, conversionDisplay, hasAnalyticsData, analyticsCoverageCopy, analyticsFlowStateCopy, questionProgressWarning, formatAnalyticsDate, formatAnalyticsDateTime,
    renderQuestionRows, renderQuestionProgressAnalytics, renderAdminAnalytics } };
