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
    answers: {}, questionIndex: 0, validationError: "", report: null, recovery: { recoveryId: "", message: "", error: "" },
    inviteToken: "", invitation: null, advisor: { profile: null, dashboard: null, temporaryPasswordChange: false, error: "" },
    admin: { authenticated: false, created: null, error: "" }, busy: false };
}
let state = createState();
let testComingSoonOverride = null;
function isComingSoon() { return testComingSoonOverride === null ? WEIGHT_TEST_COMING_SOON_MODE : testComingSoonOverride; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
function escapeAttribute(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }

const ROUTES = Object.freeze({
  "/": "landing", "/about": "about", "/methodology": "methodology", "/assessment/start": "assessmentStart", "/assessment/payment": "payment",
  "/assessment/questions": "questions", "/report": "report", "/recovery": "recovery"
  , "/advisor/login": "advisorLogin", "/advisor/dashboard": "advisorDashboard", "/admin": "admin",
  "/privacy": "privacy", "/terms": "terms", "/support": "support", "/data-deletion": "dataDeletion"
});
function routeName(pathname) { return ROUTES[String(pathname || "/").replace(/\/+$/, "") || "/"] || "notFound"; }
function navigation() { return `<nav class="site-nav" aria-label="Үндсэн цэс"><a href="/" data-route>Нүүр</a><a href="/about" data-route>Тестийн тухай</a><a href="/recovery" data-route>Тайлан сэргээх</a></nav>`; }
function footer() { return `<footer class="site-footer"><p>${PRODUCT.name}</p><nav aria-label="Арга зүй, хууль, тусламжийн холбоос"><a href="/methodology" data-route>Арга зүй</a> · <a href="/privacy" data-route>Нууцлалын бодлого</a> · <a href="/terms" data-route>Үйлчилгээний нөхцөл</a> · <a href="/support" data-route>Төлбөрийн тусламж</a> · <a href="/data-deletion" data-route>Өгөгдөл устгах хүсэлт</a></nav></footer>`; }

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
function renderPayment() {
  const payment = state.payment || { status: "idle" };
  const statusCopy = payment.status === "creating" ? PAYMENT_COPY.creating : payment.status === "checking" ? PAYMENT_COPY.checking : payment.status === "paid" ? PAYMENT_COPY.paidBeforeTest : payment.status === "pending" ? PAYMENT_COPY.pending : "";
  return `<div class="page">${navigation()}<main class="content-card"><h1 id="page-title" tabindex="-1">Төлбөр ба тайлан сэргээх мэдээлэл</h1>
    ${state.invitation ? `<section class="invite-card"><h2>Зөвлөхийн урилга ирсэн байна</h2><p>${escapeHtml(state.invitation.advisorName || "Зөвлөх")} танд энэ тест үнэлгээг санал болгосон байна.</p><form id="consent-form"><fieldset><legend>Тайлан хуваалцах зөвшөөрөл</legend><label class="option-label"><input type="radio" name="consent" value="yes" required><span>Би тест үнэлгээний бүрэн тайланг ${escapeHtml(state.invitation.advisorName || "Зөвлөх")} зөвлөх харахыг зөвшөөрч байна.</span></label><label class="option-label"><input type="radio" name="consent" value="no" required><span>Бүрэн тайлангаа хуваалцахгүй.</span></label></fieldset><p>Миний асуулт бүрд өгсөн түүхий хариултыг тусад нь харуулахгүй.</p><button class="button" type="submit">Сонголтоо баталгаажуулах</button></form></section>` : !state.assessmentId ? `<form id="contact-form" novalidate><p>Имэйл хаягаа оруулна уу. Төлбөртэй бүрэн тайлангаа өөр төхөөрөмжөөс сэргээхэд ашиглана. Утсаар сэргээх үйлчилгээ одоогоор нээгдээгүй.</p>
      <label class="field" for="contact-email"><span>Имэйл</span><input id="contact-email" name="email" type="email" autocomplete="email" required></label>
      <p id="contact-error" class="error" role="alert" aria-live="assertive"></p><button class="button" type="submit" ${state.busy ? "disabled" : ""}>Мэдээллээ хадгалаад төлбөр рүү үргэлжлүүлэх</button></form>` : `
      <section aria-labelledby="payment-title"><h2 id="payment-title">QPay нэхэмжлэл</h2><p class="price">Үнэ: ${PRODUCT.displayPrice}</p>
        <p class="payment-status" role="status" aria-live="polite">${escapeHtml(statusCopy)}</p>
        ${payment.qrImage ? `<img class="qpay-qr" src="data:image/png;base64,${escapeAttribute(payment.qrImage)}" alt="QPay QR код">` : ""}
        ${payment.expiresAt ? `<p>Нэхэмжлэлийн хугацаа: <time datetime="${escapeAttribute(payment.expiresAt)}">${escapeHtml(new Date(payment.expiresAt).toLocaleString("mn-MN"))}</time></p>` : ""}
        ${["pending", "check_error", "paid_but_not_unlocked"].includes(payment.status) ? `<button class="button" type="button" data-action="check-payment">${payment.status === "paid_but_not_unlocked" ? "Тайлангийн эрхээ дахин нээх" : "Төлбөр шалгах"}</button>` : payment.status === "paid" ? `<a class="button" href="/assessment/questions" data-route>Тестээ эхлүүлэх</a>` : `<button class="button" type="button" data-action="create-invoice">${PRODUCT.displayPrice}-ийн QPay нэхэмжлэл үүсгэх</button>`}
      </section>`}</main>${footer()}</div>`;
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
  const questions = questionApi.visibleQuestions(state.answers);
  state.questionIndex = Math.min(state.questionIndex, Math.max(0, questions.length - 1));
  const question = questions[state.questionIndex];
  const percent = Math.round(((state.questionIndex + 1) / questions.length) * 100);
  return `<div class="page assessment-page"><main class="content-card"><progress role="progressbar" aria-label="Тест бөглөх явц" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" value="${percent}" max="100">${percent}%</progress>
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
    ${!recovery.recoveryId ? `<form id="recovery-request-form" novalidate><p>Төлбөр хийхдээ ашигласан имэйл хаягаа оруулна уу. Утсаар сэргээх үйлчилгээ одоогоор нээгдээгүй.</p><label class="field"><span>Имэйл</span><input name="email" type="email" autocomplete="email" required></label><button class="button" type="submit">Баталгаажуулах код авах</button></form>` : `<form id="recovery-confirm-form"><p>${escapeHtml(recovery.message)}</p><label class="field"><span>Баталгаажуулах код</span><input name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required></label><button class="button" type="submit">Тайлан сэргээх</button></form>`}
    <p class="error" role="alert" aria-live="assertive">${escapeHtml(recovery.error)}</p></main>${footer()}</div>`;
}
function money(value) { return `${Number(value || 0).toLocaleString("en-US")}₮`; }
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
  return `<div class="page"><main class="content-card"><h1 id="page-title" tabindex="-1">Зөвлөхийн удирдлага</h1><form id="admin-advisor-form"><label class="field"><span>Зөвлөхийн нэр</span><input name="name" required></label><label class="field"><span>Зөвлөхийн имэйл</span><input name="email" type="email" required></label><label class="field"><span>Нэг төлбөрөөс зөвлөхөд олгох шимтгэл (₮)</span><input name="commissionAmount" type="number" min="0" max="9900" value="4000" required></label><button class="button" type="submit">Зөвлөх нэмэх</button></form>${state.admin.created ? `<div class="notice" role="status"><p>Түр нууц үгийг зөвхөн одоо хуулж авна уу.</p><code>${escapeHtml(state.admin.created.temporaryPassword)}</code></div>` : ""}<p class="error">${escapeHtml(state.admin.error)}</p></main></div>`;
}
function legalPage(title, body) { return `<div class="page">${navigation()}<main class="content-card legal-page"><h1 id="page-title" tabindex="-1">${escapeHtml(title)}</h1>${body}</main>${footer()}</div>`; }
function renderPrivacy() { return legalPage("Нууцлалын бодлого", `<p>Тестийн хариулт, аюулгүй байдлын шинж, холбоо барих мэдээлэл нь тайлан гаргах, төлбөр баталгаажуулах, тайлан сэргээх зорилгоор серверт хадгалагдана. Холбоо барих мэдээллийг шифрлэж, хайлтын утгыг тусад нь хэшлэнэ.</p><p>Түүхий хариултыг QPay нэхэмжлэлийн тайлбар, төлбөрийн мэдээлэл эсвэл ерөнхий хэрэглээний хэмжилтэд дамжуулахгүй. Зөвлөх зөвхөн таны тодорхой зөвшөөрөлтэй бүрэн тайланг харж болох бөгөөд асуулт бүрийн түүхий хариултыг тусад нь харахгүй.</p><p>Байнгын зочны мөрдөлт одоогоор эхлээгүй. Ирээдүйд ийм хэмжилт нэмэх бол хадгалалт эхлэхээс өмнө ил тод зөвшөөрөл авна.</p>`); }
function renderTerms() { return legalPage("Үйлчилгээний нөхцөл", `<p>Энэ тест үнэлгээ нь насанд хүрсэн хэрэглэгчийн өөрийн хариултад тулгуурласан ажиглалт гаргана. Эмнэлгийн онош, эмчилгээ, яаралтай тусламжийг орлохгүй.</p><p>Нэг удаагийн бүтээгдэхүүний үнэ ${PRODUCT.displayPrice}. Бүрэн тайлан зөвхөн сервер төлбөрийг баталгаажуулсны дараа нээгдэнэ. Аюулгүй байдлын зөвлөмж төлбөргүй.</p>`); }
function renderSupport() { return legalPage("Төлбөрийн тусламж", `<p>Нэхэмжлэл үүсэхгүй, хугацаа дууссан, эсвэл төлбөр баталгаажсан ч бүрэн тайлан нээгдэхгүй бол дахин төлөхөөсөө өмнө “Төлбөр шалгах” үйлдлийг ашиглана уу.</p><p>Тайлангаа өөр төхөөрөмжөөс авах бол <a href="/recovery" data-route>Тайлан сэргээх</a> хэсэгт төлбөр хийхдээ ашигласан имэйл хаягаа оруулна уу. Утсаар сэргээх үйлчилгээ одоогоор нээгдээгүй.</p>`); }
function renderDataDeletion() { return legalPage("Өгөгдөл устгах хүсэлт", state.assessmentId ? `<p>Одоогийн баталгаажсан тест үнэлгээтэй холбоотой өгөгдөл устгах хүсэлт илгээж болно. Хүсэлтийг шалгах хугацаанд тайлан сэргээх боломж хязгаарлагдаж болно.</p><button class="button danger" type="button" data-action="request-deletion">Устгах хүсэлт илгээх</button><p class="notice" role="status">${escapeHtml(state.deletionMessage || "")}</p>` : `<p>Өгөгдлийн эзэмшлийг баталгаажуулахын тулд эхлээд <a href="/recovery" data-route>тайлангаа сэргээнэ үү</a>. Дараа нь энэ хуудсанд буцаж хүсэлт илгээнэ.</p>`); }
function renderForPath(pathname) {
  const route = routeName(pathname);
  if (route === "landing") return renderLanding();
  if (route === "about") return renderAbout();
  if (route === "methodology") return renderMethodology();
  if (isComingSoon() && ["assessmentStart", "payment", "questions", "report"].includes(route)) return renderComingSoon();
  if (route === "assessmentStart") return renderSafetyGate();
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
  if (state.inviteToken) {
    state.invitation = await api("/.netlify/functions/advisor-invite-resolve", { method: "POST", body: JSON.stringify({ inviteToken: state.inviteToken }) });
    state.inviteToken = ""; state.busy = false; render(); return;
  }
  const assessment = await api("/.netlify/functions/weight-assessment-create", { method: "POST", body: JSON.stringify({ safetyCheckId: state.safetyCheckId, recoveryContactGroupId: state.contactGroupId }) });
  state.assessmentId = assessment.assessmentId; state.busy = false; render();
}
async function submitConsent(form) {
  const accepted = formObject(form).consent === "yes";
  const result = await api("/.netlify/functions/advisor-consent", { method: "POST", body: JSON.stringify({ coachClientId: state.invitation.coachClientId, consent: accepted }) });
  const assessment = await api("/.netlify/functions/weight-assessment-create", { method: "POST", body: JSON.stringify({ safetyCheckId: state.safetyCheckId, recoveryContactGroupId: state.contactGroupId, ...(accepted ? { coachClientId: result.coachClientId } : {}) }) });
  state.assessmentId = assessment.assessmentId; state.invitation = null; render();
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
async function advisorLoginSubmit(form) { const result = await api("/.netlify/functions/advisor-login", { method: "POST", body: JSON.stringify(formObject(form)) }); state.advisor.profile = result; state.advisor.temporaryPasswordChange = result.forcePasswordChange; if (result.forcePasswordChange) render(); else { state.advisor.dashboard = await api("/.netlify/functions/advisor-dashboard", { method: "GET" }); navigate("/advisor/dashboard"); } }
async function advisorPasswordSubmit(form) { await api("/.netlify/functions/advisor-password-change", { method: "POST", body: JSON.stringify(formObject(form)) }); state.advisor.temporaryPasswordChange = false; state.advisor.dashboard = await api("/.netlify/functions/advisor-dashboard", { method: "GET" }); navigate("/advisor/dashboard"); }
async function advisorInviteSubmit(form) { const result = await api("/.netlify/functions/advisor-client-invite", { method: "POST", body: JSON.stringify(formObject(form)) }); state.advisor.dashboard = { ...state.advisor.dashboard, inviteToken: result.inviteToken }; render(); }
async function adminLoginSubmit(form) { await api("/.netlify/functions/admin-login", { method: "POST", body: JSON.stringify(formObject(form)) }); state.admin.authenticated = true; state.admin.error = ""; render(); }
async function adminAdvisorSubmit(form) { const input = formObject(form); input.commissionAmount = Number(input.commissionAmount); state.admin.created = await api("/.netlify/functions/admin-advisor-create", { method: "POST", body: JSON.stringify(input) }); render(); }
async function restoreServerState() {
  const route = routeName(window.location.pathname);
  if (route === "advisorDashboard") { try { state.advisor.dashboard = await api("/.netlify/functions/advisor-dashboard", { method: "GET" }); } catch {} return; }
  if (isComingSoon() || !["payment", "questions", "report", "dataDeletion"].includes(route)) return;
  try {
    const restored = await api("/.netlify/functions/weight-session-state", { method: "GET" });
    if (!restored.assessment) return;
    state.assessmentId = restored.assessment.assessmentId; state.payment = restored.payment || state.payment;
    state.answers = restored.answers || {}; state.report = restored.report || null;
  } catch {}
}

function bind(root) {
  root.querySelectorAll("a[data-route]").forEach(link => link.addEventListener("click", event => { event.preventDefault(); navigate(link.getAttribute("href")); }));
  root.querySelectorAll("[data-question]").forEach(input => input.addEventListener(input.type === "text" || input.tagName === "TEXTAREA" ? "input" : "change", () => updateAnswer(input)));
  root.querySelector("#safety-form")?.addEventListener("submit", event => { event.preventDefault(); submitSafety(event.currentTarget).catch(error => { state.busy = false; render(); const node = document.getElementById("safety-error"); if (node) node.textContent = error.message; }); });
  root.querySelector("#contact-form")?.addEventListener("submit", event => { event.preventDefault(); submitContact(event.currentTarget).catch(error => { state.busy = false; render(); const node = document.getElementById("contact-error"); if (node) node.textContent = error.message; }); });
  root.querySelector("#consent-form")?.addEventListener("submit", event => { event.preventDefault(); submitConsent(event.currentTarget).catch(() => { state.validationError = "Сонголтыг хадгалж чадсангүй."; render(); }); });
  root.querySelector("#question-form")?.addEventListener("submit", event => { event.preventDefault(); nextQuestion().catch(() => { state.validationError = "Хариултыг хадгалж чадсангүй. Дахин оролдоно уу."; render(); }); });
  root.querySelector("#recovery-request-form")?.addEventListener("submit", event => { event.preventDefault(); requestRecovery(event.currentTarget).catch(error => { state.recovery.error = error.message; render(); }); });
  root.querySelector("#recovery-confirm-form")?.addEventListener("submit", event => { event.preventDefault(); confirmRecovery(event.currentTarget).catch(() => { state.recovery.error = "Баталгаажуулах код буруу эсвэл хугацаа дууссан байна."; render(); }); });
  root.querySelector("#advisor-login-form")?.addEventListener("submit", event => { event.preventDefault(); advisorLoginSubmit(event.currentTarget).catch(() => { state.advisor.error = "Имэйл эсвэл нууц үг буруу байна."; render(); }); });
  root.querySelector("#advisor-password-form")?.addEventListener("submit", event => { event.preventDefault(); advisorPasswordSubmit(event.currentTarget).catch(() => { state.advisor.error = "Нууц үгийг сольж чадсангүй."; render(); }); });
  root.querySelector("#advisor-invite-form")?.addEventListener("submit", event => { event.preventDefault(); advisorInviteSubmit(event.currentTarget).catch(() => { state.advisor.error = "Урилга үүсгэж чадсангүй."; render(); }); });
  root.querySelector("#admin-login-form")?.addEventListener("submit", event => { event.preventDefault(); adminLoginSubmit(event.currentTarget).catch(() => { state.admin.error = "Нэвтрэх мэдээлэл буруу байна."; render(); }); });
  root.querySelector("#admin-advisor-form")?.addEventListener("submit", event => { event.preventDefault(); adminAdvisorSubmit(event.currentTarget).catch(() => { state.admin.error = "Зөвлөх үүсгэж чадсангүй."; render(); }); });
  root.querySelector('[data-action="create-invoice"]')?.addEventListener("click", createInvoice);
  root.querySelector('[data-action="check-payment"]')?.addEventListener("click", checkPayment);
  root.querySelector('[data-action="previous-question"]')?.addEventListener("click", () => { state.questionIndex = Math.max(0, state.questionIndex - 1); state.validationError = ""; render(); });
  root.querySelector('[data-action="print-report"]')?.addEventListener("click", () => window.print());
  root.querySelector('[data-action="advisor-logout"]')?.addEventListener("click", async () => { await api("/.netlify/functions/advisor-logout", { method: "POST", body: "{}" }); state.advisor = createState().advisor; navigate("/advisor/login"); });
  root.querySelectorAll("[data-advisor-report]").forEach(button => button.addEventListener("click", async () => { const result = await api(`/.netlify/functions/advisor-report?assessmentId=${encodeURIComponent(button.dataset.advisorReport)}`, { method: "GET" }); state.report = { assessmentId: result.assessmentId, fullReport: result.fullReport, entitled: true }; navigate("/report"); }));
  root.querySelector('[data-action="request-deletion"]')?.addEventListener("click", async () => { const result = await api("/.netlify/functions/weight-data-deletion-request", { method: "POST", body: JSON.stringify({ assessmentId: state.assessmentId }) }); state.deletionMessage = result.status === "pending" ? "Таны хүсэлтийг хүлээн авлаа." : "Хүсэлтийн төлөв шинэчлэгдлээ."; render(); });
}
function render(options = {}) {
  if (typeof document === "undefined") return "";
  const root = document.getElementById("app"); if (!root) return "";
  root.innerHTML = renderForPath(window.location.pathname); bind(root);
  const heading = document.getElementById("page-title"); if (options.focus !== false && heading) heading.focus();
  return root.innerHTML;
}
function navigate(pathname, options = {}) { if (typeof window === "undefined") return; window.history[options.replace ? "replaceState" : "pushState"]({}, "", pathname); render(); }
function captureInviteToken() { if (typeof window === "undefined") return; const url = new URL(window.location.href); const token = url.searchParams.get("invite"); if (!token) return; state.inviteToken = token; url.searchParams.delete("invite"); window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`); }
if (typeof window !== "undefined") { window.addEventListener("popstate", async () => { await restoreServerState(); render(); }); window.addEventListener("DOMContentLoaded", async () => { captureInviteToken(); await restoreServerState(); render({ focus: false }); }); }
if (typeof module !== "undefined") module.exports = { PRODUCT, PAYMENT_COPY, PAYMENT_STATES, WEIGHT_TEST_COMING_SOON_MODE, isComingSoon, routeName, renderForPath, contactValidation, setPaymentStatus, money,
  _test: { setComingSoon(value) { testComingSoonOverride = Boolean(value); }, resetComingSoon() { testComingSoonOverride = null; }, setState(value) { state = { ...createState(), ...value }; }, getState() { return state; } } };
