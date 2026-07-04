const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;
const root = path.join(__dirname, "..");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function setOneTime(overrides = {}) {
  mockBackend.resetMockBackend();
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" }
    ],
    diaryEntries: [],
    ...overrides
  });
}

function setSevenDay(overrides = {}) {
  mockBackend.resetMockBackend();
  _internal.setTestState({
    packageType: "seven-day",
    view: "sevenDayStart",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" }
    ],
    diaryEntries: [],
    ...overrides
  });
}

function run() {
  setOneTime();
  _internal.startLeadCapture("one-time");
  let capture = normalize(_internal.renderLeadCapture());
  assert(capture.includes("Нээлтийн туршилтын бүртгэл"));
  assert(capture.includes("Нэг удаагийн гүн анализ"));
  assert(capture.includes("9,900₮"));

  _internal.submitLeadCapture();
  capture = normalize(_internal.renderLeadCapture());
  assert(capture.includes("Утас эсвэл имэйл үлдээнэ үү."), "lead form should require contact");
  assert.strictEqual(mockBackend.getLeadIntents().length, 0);

  _internal.updateLeadField("name", "Tester");
  _internal.updateLeadField("contact", "tester@example.com");
  _internal.updateLeadField("willingness", "Тийм, энэ үнээр авахад бэлэн");
  _internal.updateLeadField("comment", "Тайлангийн жишээ тодорхой байвал авна.");
  _internal.submitLeadCapture();
  const leads = mockBackend.getLeadIntents();
  assert.strictEqual(leads.length, 1);
  assert.strictEqual(leads[0].productType, "one_time");
  assert.strictEqual(leads[0].priceMnt, 9900);
  assert.strictEqual(leads[0].contact, "tester@example.com");
  assert.strictEqual(leads[0].willingness, "Тийм, энэ үнээр авахад бэлэн");
  assert(normalize(_internal.renderLeadThankYou()).includes("Баярлалаа. Таны сонирхлыг бүртгэлээ"));

  setSevenDay();
  _internal.startLeadCapture("seven-day");
  capture = normalize(_internal.renderLeadCapture());
  assert(capture.includes("7 хоногийн гүн анализ"));
  assert(capture.includes("29,000₮"));

  setOneTime({ oneTimePaid: true, view: "upgradePaywall" });
  _internal.startLeadCapture("upgrade");
  capture = normalize(_internal.renderLeadCapture());
  assert(capture.includes("7 хоногоор нарийвчлах эрх"));
  assert(capture.includes("19,900₮"));

  _internal.updateLeadField("contact", "99112233");
  _internal.updateLeadField("willingness", "Сонирхож байна, гэхдээ эхлээд тайлангийн жишээ хармаар байна");
  _internal.submitLeadCapture();
  const summary = mockBackend.summarizeLeadIntents();
  assert.strictEqual(summary.totalLeads, 1);
  assert.strictEqual(summary.byProduct.upgrade.count, 1);
  assert.strictEqual(summary.byProduct.upgrade.averagePriceMnt, 19900);
  assert.strictEqual(summary.willingness["Сонирхож байна, гэхдээ эхлээд тайлангийн жишээ хармаар байна"], 1);
  assert(normalize(_internal.renderValidationSummary()).includes("Сонирхлын нэгтгэл"));

  mockBackend.resetMockBackend();
  setSevenDay();
  _internal.demoCompletePayment("seven-day");
  assert.strictEqual(_internal.hasSevenDayAccess(), true, "Demo unlock should still work for internal testing");
  assert.strictEqual(mockBackend.summarizeLeadIntents().demoUnlocks, 1);

  setOneTime({
    stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
    preliminary: []
  });
  const urgent = normalize(_internal.renderReport());
  assert(urgent.includes("Одоо жин хасах тухай биш"));
  assert(!urgent.includes("Нээлтийн туршилтын бүртгэл"));
  assert(!urgent.includes("төлөөд бүрэн тайлангаа нээх"));

  setOneTime({
    stageAnswers: { "S1-B03": "Тийм" },
    preliminary: []
  });
  const professional = normalize(_internal.renderReport());
  assert(professional.includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"));
  assert(!professional.includes("9,900₮"));
  assert(!professional.includes("төлөөд"));

  const doc = fs.readFileSync(path.join(root, "FAKE_PAYMENT_VALIDATION.md"), "utf8");
  assert(doc.includes("# Fake Payment Validation"));
  assert(doc.includes("Proceed-To-QPay Threshold"));

  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  assert(readme.includes("FAKE_PAYMENT_VALIDATION.md"), "README should link fake payment validation doc");
}

run();
console.log("fake-payment-lead-capture tests passed");
