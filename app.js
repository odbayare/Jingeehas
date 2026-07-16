"use strict";

const PRODUCT = Object.freeze({ name: "Илүүдэл жингээс салах тест үнэлгээ", code: "WEIGHT_TEST_ONE_TIME", amount: 9900, displayPrice: "9,900₮" });
const WEIGHT_TEST_COMING_SOON_MODE = true;
const PAYMENT_COPY = Object.freeze({
  creating: "QPay нэхэмжлэл үүсгэж байна…",
  pending: "Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.",
  checking: "Төлбөрийг шалгаж байна…",
  paidBeforeTest: "Төлбөр баталгаажлаа. Одоо тестээ эхлүүлнэ үү.",
  paidAfterAssessment: "Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ."
});
const PAYMENT_STATES = new Set(["idle", "creating", "pending", "checking", "paid", "create_error", "check_error", "expired", "failed", "cancelled", "paid_but_not_unlocked"]);
const questionApi = typeof require === "function" ? require("./questions.js") : window.JingeehasQuestions;
const EXCLUSIVE = new Set(["Аль нь ч үгүй", "Аль нь ч биш", "Онц өөрчлөлтгүй", "Хариулахгүй"]);
const BRANCH_PREFIXES = Object.freeze({ "MC-GATE": ["MC-"], "ALC-GATE": ["ALC-"], "TOB-GATE": ["TOB-"], "PREG-GATE": ["PREG-"] });

function createState() {
  return { safetyResult: null, safetyCheckId: "", contactGroupId: "", assessmentId: "", payment: { status: "idle" },
    answers: {}, questionIndex: 0, validationError: "", report: null, recovery: { recoveryId: "", message: "", error: "" }, busy: false };
}
let state = createState();
let testComingSoonOverride = null;
function isComingSoon() { return testComingSoonOverride === null ? WEIGHT_TEST_COMING_SOON_MODE : testComingSoonOverride; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
function escapeAttribute(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }

const ROUTES = Object.freeze({
  "/": "landing", "/about": "about", "/assessment/start": "assessmentStart", "/assessment/payment": "payment",
  "/assessment/questions": "questions", "/report": "report", "/recovery": "recovery"
});
function routeName(pathname) { return ROUTES[String(pathname || "/").replace(/\/+$/, "") || "/"] || "notFound"; }
function navigation() { return `<nav class="site-nav" aria-label="Үндсэн цэс"><a href="/" data-route>Нүүр</a><a href="/about" data-route>Тестийн тухай</a><a href="/recovery" data-route>Тайлан сэргээх</a></nav>`; }
function footer() { return `<footer class="site-footer"><p>${PRODUCT.name}</p></footer>`; }

function renderLanding() {
  return `<div class="page landing-page">${navigation()}<main><section class="hero" aria-labelledby="page-title"><div class="hero-copy">
    <p class="eyebrow">Сэтгэлзүйн хэв маяг, далд зуршлын үнэлгээ</p><h1 id="page-title" tabindex="-1">${PRODUCT.name}</h1>
    <div class="approved-copy"><p>Илүүдэл жин үүсгэж буй сэтгэлзүйн шалтгаанаа илрүүл.</p><p>Ямар далд зуршлууд илүүдэл жин үүсэхэд нөлөөлж буйг тайлж мэд.</p><p>Жин хасахад тань тохирох дөт хэв маяг, дасгал сургуулилтын чиглэлээ мэдэж ав.</p></div>
    <p class="price">Үнэ: ${PRODUCT.displayPrice}</p><a class="button" href="/assessment/start" data-route>Тест бөглөх</a>
    </div><div class="hero-visual" aria-hidden="true"></div></section></main>${footer()}</div>`;
}
function renderAbout() {
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Тест үнэлгээний тухай</h1>
    <p>Таны шууд өгсөн хариултаас давтагдсан хэв маяг болон ажиглалтыг ялгаж, эхний зураглал гаргана. Төлбөр баталгаажсаны дараа тест бөглөж, бүрэн тайлангаа авна.</p>
    <p>Энэ нь эмнэлгийн онош, эмчилгээний зөвлөгөө биш.</p><a class="button" href="/assessment/start" data-route>Тест бөглөх</a></main>${footer()}</div>`;
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
function renderPayment() {
  const payment = state.payment || { status: "idle" };
  const statusCopy = payment.status === "creating" ? PAYMENT_COPY.creating : payment.status === "checking" ? PAYMENT_COPY.checking : payment.status === "paid" ? PAYMENT_COPY.paidBeforeTest : payment.status === "pending" ? PAYMENT_COPY.pending : "";
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Төлбөр ба тайлан сэргээх мэдээлэл</h1>
    ${!state.assessmentId ? `<form id="contact-form" novalidate><p>Утас эсвэл имэйлийн аль нэгийг оруулна уу. Төлбөртэй бүрэн тайлангаа өөр төхөөрөмжөөс сэргээхэд ашиглана.</p>
      <label class="field" for="contact-phone"><span>Утас</span><input id="contact-phone" name="phone" type="tel" autocomplete="tel"></label>
      <label class="field" for="contact-email"><span>Имэйл</span><input id="contact-email" name="email" type="email" autocomplete="email"></label>
      <p id="contact-error" class="error" role="alert" aria-live="assertive"></p><button class="button" type="submit" ${state.busy ? "disabled" : ""}>Мэдээллээ хадгалаад төлбөр рүү үргэлжлүүлэх</button></form>` : `
      <section aria-labelledby="payment-title"><h2 id="payment-title">QPay нэхэмжлэл</h2><p class="price">Үнэ: ${PRODUCT.displayPrice}</p>
        <p class="payment-status" role="status" aria-live="polite">${escapeHtml(statusCopy)}</p>
        ${payment.qrImage ? `<img class="qpay-qr" src="data:image/png;base64,${escapeAttribute(payment.qrImage)}" alt="QPay QR код">` : ""}
        ${payment.expiresAt ? `<p>Нэхэмжлэлийн хугацаа: <time datetime="${escapeAttribute(payment.expiresAt)}">${escapeHtml(new Date(payment.expiresAt).toLocaleString("mn-MN"))}</time></p>` : ""}
        ${payment.status === "pending" || payment.status === "check_error" ? `<button class="button" type="button" data-action="check-payment">Төлбөр шалгах</button>` : payment.status === "paid" ? `<a class="button" href="/assessment/questions" data-route>Тестээ эхлүүлэх</a>` : `<button class="button" type="button" data-action="create-invoice">${PRODUCT.displayPrice}-ийн QPay нэхэмжлэл үүсгэх</button>`}
      </section>`}</main>${footer()}</div>`;
}
function renderQuestionInput(question, value) {
  if (question.type === "number") return `<label class="field" for="answer-${question.id}"><span>${escapeHtml(question.text)} (${escapeHtml(question.unit)})</span><input id="answer-${question.id}" data-question="${question.id}" type="number" min="${question.min}" max="${question.max}" value="${escapeAttribute(value || "")}" ${question.required ? "required" : ""}></label>`;
  if (question.type === "text") return `<label class="field" for="answer-${question.id}"><span>${escapeHtml(question.text)}</span><textarea id="answer-${question.id}" data-question="${question.id}" maxlength="${question.maxLength}">${escapeHtml(value || "")}</textarea></label>`;
  const values = Array.isArray(value) ? value : [];
  const type = question.type === "multi" ? "checkbox" : "radio";
  return `<fieldset><legend>${escapeHtml(question.text)}</legend>${question.options.map(option => `<label class="option-label"><input type="${type}" name="answer-${question.id}" data-question="${question.id}" value="${escapeAttribute(option)}" ${(type === "checkbox" ? values.includes(option) : value === option) ? "checked" : ""}><span>${escapeHtml(option)}</span></label>`).join("")}</fieldset>`;
}
function renderQuestions() {
  const questions = questionApi.visibleQuestions(state.answers);
  state.questionIndex = Math.min(state.questionIndex, Math.max(0, questions.length - 1));
  const question = questions[state.questionIndex];
  const percent = Math.round(((state.questionIndex + 1) / questions.length) * 100);
  return `<div class="page assessment-page"><main class="content-card"><div class="progress" role="progressbar" aria-label="Тест бөглөх явц" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>
    <p>${state.questionIndex + 1} / ${questions.length}</p><h1 id="page-title" tabindex="-1">${escapeHtml(question.section)}</h1>
    <p class="muted">Өөрт хамгийн ойр хариултаа сонгоорой. Таны хариултын зураглал тест дууссаны дараа гарна.</p>
    <form id="question-form" novalidate>${renderQuestionInput(question, state.answers[question.id])}<p id="question-error" class="error" role="alert" aria-live="assertive">${escapeHtml(state.validationError)}</p>
      <div class="actions">${state.questionIndex > 0 ? `<button class="button secondary" type="button" data-action="previous-question">Буцах</button>` : ""}<button class="button" type="submit">${state.questionIndex === questions.length - 1 ? "Тайлан харах" : "Үргэлжлүүлэх"}</button></div>
    </form></main>${footer()}</div>`;
}
function renderReport() {
  const report = state.report;
  if (!report) return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Тайлан</h1><p role="status">Тайланг ачаалж байна…</p></main>${footer()}</div>`;
  if (report.safetyRoute) return safetyGuidance({ guidance: report.initialView?.guidance, route: report.safetyRoute });
  if (!report.fullReport) return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Эхний зураглал</h1><p>${escapeHtml(report.initialView?.coverage || "")}</p><p>Бүрэн тайлан нээх эрх серверээс баталгаажаагүй байна.</p></main>${footer()}</div>`;
  const full = report.fullReport;
  return `<div class="page report-page">${navigation()}<main id="report-content" class="report-content"><header class="report-header"><p>${escapeHtml(full.productName)}</p><h1 id="page-title" tabindex="-1">Бүрэн тайлан</h1><time datetime="${escapeAttribute(full.reportDate)}">${escapeHtml(new Date(full.reportDate).toLocaleDateString("mn-MN"))}</time></header>
    <p class="coverage">${escapeHtml(full.coverage)}</p>${full.sections.map(section => `<section class="report-section"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p></section>`).join("")}
    ${full.experiment ? `<section class="report-section"><h2>Хэрэгжүүлж үзэх нэг өөрчлөлт</h2><dl><dt>Өөрчлөх нэг зүйл</dt><dd>${escapeHtml(full.experiment.variable)}</dd><dt>Юу хийх вэ?</dt><dd>${escapeHtml(full.experiment.action)}</dd><dt>Юуг ажиглах вэ?</dt><dd>${escapeHtml(full.experiment.observe)}</dd><dt>Юуг өөрчлөхгүй хэвээр үлдээх вэ?</dt><dd>${escapeHtml(full.experiment.keepConstant)}</dd></dl></section>` : ""}
    <button class="button print-hide" type="button" data-action="print-report">Хэвлэх эсвэл PDF-ээр хадгалах</button></main>${footer()}</div>`;
}
function renderRecovery() {
  const recovery = state.recovery;
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Тайлан сэргээх</h1>
    ${!recovery.recoveryId ? `<form id="recovery-request-form" novalidate><p>Төлбөр хийхдээ ашигласан утас эсвэл имэйлээ оруулна уу.</p><label class="field"><span>Утас</span><input name="phone" type="tel" autocomplete="tel"></label><label class="field"><span>Имэйл</span><input name="email" type="email" autocomplete="email"></label><button class="button" type="submit">Баталгаажуулах код авах</button></form>` : `<form id="recovery-confirm-form"><p>${escapeHtml(recovery.message)}</p><label class="field"><span>Баталгаажуулах код</span><input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required></label><button class="button" type="submit">Тайлан сэргээх</button></form>`}
    <p class="error" role="alert" aria-live="assertive">${escapeHtml(recovery.error)}</p></main>${footer()}</div>`;
}
function renderForPath(pathname) {
  const route = routeName(pathname);
  if (route === "landing") return renderLanding();
  if (route === "about") return renderAbout();
  if (isComingSoon() && ["assessmentStart", "payment", "questions", "report"].includes(route)) return renderComingSoon();
  if (route === "assessmentStart") return renderSafetyGate();
  if (route === "payment") return renderPayment();
  if (route === "questions") return renderQuestions();
  if (route === "report") return renderReport();
  if (route === "recovery") return renderRecovery();
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
  const phoneRaw = String(input.phone || "").replace(/[\s()-]/g, "");
  const phone = phoneRaw.replace(/^\+976/, "").replace(/^976(?=\d{8}$)/, "");
  if (phoneRaw && !/^[2-9]\d{7}$/.test(phone)) return "Утасны дугаараа зөв оруулна уу.";
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(input.email).trim())) return "Имэйл хаягаа зөв оруулна уу.";
  if (!phoneRaw && !String(input.email || "").trim()) return "Утас эсвэл имэйлийн аль нэгийг оруулна уу.";
  return "";
}
function setPaymentStatus(status, patch = {}) { state.payment = { ...state.payment, ...patch, status: PAYMENT_STATES.has(status) ? status : "failed" }; }

async function submitSafety(form) {
  const input = formObject(form); input.acuteMedical = new FormData(form).getAll("acuteMedical");
  if (!input.age || !input.selfHarm || !input.acuteMedical.length || !input.compensatoryBehavior || !input.medicalSuitability) throw new Error("Бүх асуултад хариулна уу.");
  state.busy = true; render();
  await ensureSession();
  state.safetyResult = await api("/.netlify/functions/weight-safety-gate", { method: "POST", body: JSON.stringify(input) });
  state.safetyCheckId = state.safetyResult.safetyCheckId; state.busy = false;
  if (state.safetyResult.route === "eligible") navigate("/assessment/payment"); else render();
}
async function submitContact(form) {
  const input = formObject(form); const error = contactValidation(input); if (error) throw new Error(error);
  state.busy = true; render();
  const contact = await api("/.netlify/functions/weight-recovery-contact-save", { method: "POST", body: JSON.stringify(input) });
  state.contactGroupId = contact.contactGroupId;
  const assessment = await api("/.netlify/functions/weight-assessment-create", { method: "POST", body: JSON.stringify({ safetyCheckId: state.safetyCheckId, recoveryContactGroupId: state.contactGroupId }) });
  state.assessmentId = assessment.assessmentId; state.busy = false; render();
}
async function createInvoice() {
  setPaymentStatus("creating"); render();
  try { state.payment = await api("/.netlify/functions/qpay-create-invoice", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId, productCode: PRODUCT.code, amount: PRODUCT.amount }) }); }
  catch { setPaymentStatus("create_error"); } render();
}
async function checkPayment() {
  setPaymentStatus("checking"); render();
  try { state.payment = await api("/.netlify/functions/qpay-check-payment", { method: "POST", body: JSON.stringify({ paymentId: state.payment.paymentId }) }); }
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
      if (input.checked && withoutExclusive.length >= question.max) { state.validationError = "Та хамгийн ихдээ 3 хариулт сонгох боломжтой."; render(); return; }
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
  const questions = questionApi.visibleQuestions(state.answers); const question = questions[state.questionIndex];
  const error = questionApi.validateAnswer(question, state.answers[question.id]);
  if (error) { state.validationError = error; render(); return; }
  await api("/.netlify/functions/weight-assessment-save", { method: "PATCH", body: JSON.stringify({ assessmentId: state.assessmentId, answers: { [question.id]: state.answers[question.id] } }) });
  if (state.questionIndex < questions.length - 1) { state.questionIndex += 1; state.validationError = ""; render(); return; }
  const completed = await api("/.netlify/functions/weight-assessment-complete", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId }) });
  if (completed.safetyRoute) { state.report = await loadReport(); navigate("/report"); return; }
  state.report = await loadReport(); navigate("/report");
}
async function loadReport() { return api(`/.netlify/functions/weight-assessment-report?assessmentId=${encodeURIComponent(state.assessmentId)}`, { method: "GET" }); }
async function requestRecovery(form) {
  const input = formObject(form); const error = contactValidation(input); if (error) throw new Error(error);
  const result = await api("/.netlify/functions/weight-recovery-request", { method: "POST", body: JSON.stringify(input) });
  state.recovery = { recoveryId: result.recoveryId, message: result.message, error: "" }; render();
}
async function confirmRecovery(form) {
  const input = formObject(form);
  const result = await api("/.netlify/functions/weight-recovery-confirm", { method: "POST", body: JSON.stringify({ recoveryId: state.recovery.recoveryId, code: input.code }) });
  state.assessmentId = result.assessmentId; state.report = await loadReport(); navigate("/report");
}

function bind(root) {
  root.querySelectorAll("a[data-route]").forEach(link => link.addEventListener("click", event => { event.preventDefault(); navigate(link.getAttribute("href")); }));
  root.querySelectorAll("[data-question]").forEach(input => input.addEventListener(input.type === "text" || input.tagName === "TEXTAREA" ? "input" : "change", () => updateAnswer(input)));
  root.querySelector("#safety-form")?.addEventListener("submit", event => { event.preventDefault(); submitSafety(event.currentTarget).catch(error => { state.busy = false; render(); const node = document.getElementById("safety-error"); if (node) node.textContent = error.message; }); });
  root.querySelector("#contact-form")?.addEventListener("submit", event => { event.preventDefault(); submitContact(event.currentTarget).catch(error => { state.busy = false; render(); const node = document.getElementById("contact-error"); if (node) node.textContent = error.message; }); });
  root.querySelector("#question-form")?.addEventListener("submit", event => { event.preventDefault(); nextQuestion().catch(() => { state.validationError = "Хариултыг хадгалж чадсангүй. Дахин оролдоно уу."; render(); }); });
  root.querySelector("#recovery-request-form")?.addEventListener("submit", event => { event.preventDefault(); requestRecovery(event.currentTarget).catch(error => { state.recovery.error = error.message; render(); }); });
  root.querySelector("#recovery-confirm-form")?.addEventListener("submit", event => { event.preventDefault(); confirmRecovery(event.currentTarget).catch(() => { state.recovery.error = "Баталгаажуулах код буруу эсвэл хугацаа дууссан байна."; render(); }); });
  root.querySelector('[data-action="create-invoice"]')?.addEventListener("click", createInvoice);
  root.querySelector('[data-action="check-payment"]')?.addEventListener("click", checkPayment);
  root.querySelector('[data-action="previous-question"]')?.addEventListener("click", () => { state.questionIndex = Math.max(0, state.questionIndex - 1); state.validationError = ""; render(); });
  root.querySelector('[data-action="print-report"]')?.addEventListener("click", () => window.print());
}
function render(options = {}) {
  if (typeof document === "undefined") return "";
  const root = document.getElementById("app"); if (!root) return "";
  root.innerHTML = renderForPath(window.location.pathname); bind(root);
  const heading = document.getElementById("page-title"); if (options.focus !== false && heading) heading.focus();
  return root.innerHTML;
}
function navigate(pathname, options = {}) { if (typeof window === "undefined") return; window.history[options.replace ? "replaceState" : "pushState"]({}, "", pathname); render(); }
if (typeof window !== "undefined") { window.addEventListener("popstate", () => render()); window.addEventListener("DOMContentLoaded", () => render({ focus: false })); }
if (typeof module !== "undefined") module.exports = { PRODUCT, PAYMENT_COPY, PAYMENT_STATES, WEIGHT_TEST_COMING_SOON_MODE, isComingSoon, routeName, renderForPath, contactValidation, setPaymentStatus,
  _test: { setComingSoon(value) { testComingSoonOverride = Boolean(value); }, resetComingSoon() { testComingSoonOverride = null; }, setState(value) { state = { ...createState(), ...value }; }, getState() { return state; } } };
