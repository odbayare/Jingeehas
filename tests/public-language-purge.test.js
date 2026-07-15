const assert = require("assert");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal, allQuestionObjects } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function assertAbsent(text, phrases, label) {
  phrases.forEach(phrase => {
    assert(!text.toLowerCase().includes(phrase.toLowerCase()), `${label} should not include public English/mixed term: ${phrase}`);
  });
}

function setBase(overrides = {}) {
  mockBackend.resetMockBackend();
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    removedFeaturePaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Хоол захиалах", "Ойр байсан зууш"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [{ key: "executive", score: 5, label: "хүчтэй нийцэж байна" }],
    ...overrides
  });
}

function publicScreensText() {
  setBase();
  const landing = _internal.renderLanding();
  const about = _internal.renderAbout();
  const choice = _internal.renderChoice();
  const oneTimeStart = _internal.renderOneTimeStart();
  const oneTimePaywall = _internal.renderReport();

  setBase();
  _internal.startLeadCapture("one-time");
  const leadCapture = _internal.renderLeadCapture();
  const leadThankYou = _internal.renderLeadThankYou();

  const questionText = allQuestionObjects().map(question => [question.text, ...(question.options || [])].join(" ")).join("\n");

  return normalize([landing, about, choice, oneTimeStart, oneTimePaywall, leadCapture, leadThankYou, questionText].join("\n"));
}

function run() {
  const publicText = publicScreensText();
  assertAbsent(publicText, [
    "pattern",
    "reward",
    "diary",
    "Preview",
    "Trigger",
    "sample report",
    "Missed day",
    "failure",
    "Calorie",
    "Executive Load Failure",
    "low-friction default",
    "Decision fatigue",
    "delivery/snack",
    "leverage point",
    "Food-as-Regulation",
    "Decision-Default",
    "Hunger-Safety",
    "Demo unlock хийх",
    "fake payment",
    "validation",
    "purchase intent",
    "lead capture",
    "Diary үргэлжлүүлэх",
    "upgrade боломж",
    "Утас эсвэл email",
    "email үлдээнэ үү",
    "craving"
  ], "public entry/paywall/lead screens");

  assert(publicText.includes("Нэг удаагийн гүн анализ"));
  assert(publicText.includes("Хамгийн тод давтагддаг нөхцөл"));
  assert(publicText.includes("9,900₮ төлөөд тайлангаа нээх"));
  assert(publicText.includes("тайлангийн жишээ"));
  assert(publicText.includes("Утас эсвэл имэйл"));
  assert(publicText.includes("Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?"));
  assert(!publicText.includes("[REMOVED_FEATURE_PRICE]"));

  setBase({ oneTimePaid: false });
  const paywall = normalize(_internal.renderReport());
  assert(!paywall.includes("Executive Load Failure"), "one-time paywall must not expose internal mechanism label");

  setBase({ oneTimePaid: true });
  const oneTimeFullReport = normalize(_internal.renderReport());
  ["1. Гол зураглал", "2. Энэ дүгнэлт юунд тулгуурласан бэ?", "3. Таны хамгийн магадлалтай гол хэв маяг", "7. 7–14 хоногийн нэг хувьсагчийн туршилт"].forEach(phrase => {
    assert(oneTimeFullReport.includes(phrase), `one-time report should include Mongolian replacement: ${phrase}`);
  });
  assert(!oneTimeFullReport.includes("давтамжтай нийцэж байна"));
  assertAbsent(oneTimeFullReport, ["Executive Load Failure", "low-friction default", "Decision fatigue", "leverage point", "diary"], "one-time full report");

  setBase();
  _internal.startLeadCapture("one-time");
  const leadCapture = normalize(_internal.renderLeadCapture());
  assert(leadCapture.includes("тайлангийн жишээ"));
  assert(!leadCapture.includes("sample report"));
  assert(!leadCapture.includes("Demo unlock хийх"));

  setBase({ demoMode: true });
  _internal.startLeadCapture("one-time");
  const demoLeadCapture = normalize(_internal.renderLeadCapture());
  assert(demoLeadCapture.includes("Дотоод туршилтаар нээх"), "demo/internal mode should keep unlock available");
  _internal.demoCompletePayment("one-time");
  assert.strictEqual(_internal.hasOneTimeReportAccess(), true, "demo unlock still grants internal test access");
}

run();
console.log("public-language-purge tests passed");
