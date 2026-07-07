const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function setOneTime(overrides = {}) {
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
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "decisionDefault", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    contactCapture: {
      name: "Pricing QA",
      phone: "99119911",
      email: "",
      saved: true,
      message: "",
      copyStatus: ""
    },
    stageVoiceSummaries: {},
    diaryEntries: [],
    ...overrides
  });
}

function setSevenDay(overrides = {}) {
  _internal.setTestState({
    packageType: "seven-day",
    view: "sevenDayStart",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "decisionDefault", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    stageAnswers: {},
    diaryEntries: [],
    ...overrides
  });
}

function setMode3Unpaid() {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: { "S1-B03": "Тийм" },
    diaryEntries: []
  });
}

function setMode4Unpaid() {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
    diaryEntries: []
  });
}

function assertNoPressureCopy(text) {
  [
    "жинхэнэ шалтгаанаа нээ",
    "заавал",
    "100%",
    "оношоо харах"
  ].forEach(phrase => {
    assert(!text.includes(phrase), `paywall pressure phrase should be absent: ${phrase}`);
  });
}

function run() {
  const choice = normalize(_internal.renderChoice());
  assert(choice.includes("Нэг удаагийн гүн анализ"), "One-Time commercial title should use analysis wording");
  assert(choice.includes("Үндсэн үнэ 9,900₮"), "One-Time anchor price should be visible");
  assert(!choice.includes("Нээлтийн урамшуулалт үнэ 9,900₮"), "Coach discount should not appear as public promo price");
  assert(choice.includes("9,900₮ төлөөд тайлангаа нээх"), "One-Time card should use standard paid report CTA");
  assert(choice.includes("7 хоногийн гүн анализ"), "7-Day commercial title should use analysis wording");
  assert(choice.includes("Үндсэн үнэ 69,000₮"), "7-Day anchor price should be visible");
  assert(choice.includes("Нээлтийн урамшуулалт үнэ 29,000₮"), "7-Day promo price should be visible");
  assert(choice.includes("29,000₮ төлөөд 7 хоногийн үнэлгээ эхлүүлэх"), "7-Day card should use promo CTA");
  assert(!choice.includes("6,900₮"), "old One-Time price should be absent");
  assert(!choice.includes("12,900₮"), "old upgrade price should be absent");
  assert(!choice.includes("19,900₮"), "upgrade price should not appear on product cards");

  setOneTime();
  const unpaidOneTime = normalize(_internal.renderReport());
  assert(unpaidOneTime.includes("Таны эхний зураглал бэлэн боллоо"));
  assert(unpaidOneTime.includes("Хамгийн түрүүнд харагдаж буй зүйл"));
  assert(unpaidOneTime.includes("Үндсэн үнэ 9,900₮"));
  assert(unpaidOneTime.includes("Төлөх үнэ 9,900₮"));
  assert(unpaidOneTime.includes("9,900₮ төлөөд бүрэн тайлангаа нээх"));
  assert(!unpaidOneTime.includes("Энэ бүртгэл бодит төлбөр авахгүй"));
  assert(!unpaidOneTime.includes("Та авах сонирхолтой эсэхээ л үлдээж байна"));
  assert(!unpaidOneTime.includes("Demo unlock хийх"));
  assert(!unpaidOneTime.includes("6,900₮"));
  assert(!unpaidOneTime.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?"));
  assert(!unpaidOneTime.includes("14 хоногийн эхний туршилт Өдөр бүр хийх"));
  assertNoPressureCopy(unpaidOneTime);

  _internal.demoCompletePayment("one-time");
  const paidOneTime = normalize(_internal.renderReport());
  assert(paidOneTime.includes("2. Яагаад давтагдаад байна вэ?"));
  assert(paidOneTime.includes("5. 14 хоногийн жижиг туршилт"));
  assert(!paidOneTime.includes("Нарийвчлах үнэ"));
  assert(!paidOneTime.includes("19,900₮ төлөөд 7 хоногоор нарийвчлах"));
  assert(!paidOneTime.includes("12,900₮"));

  setSevenDay();
  const unpaidSevenDayStart = normalize(_internal.renderSevenDayStart());
  assert(unpaidSevenDayStart.includes("Үндсэн үнэ 69,000₮"));
  assert(unpaidSevenDayStart.includes("Нээлтийн урамшуулалт үнэ 29,000₮"));
  assert(unpaidSevenDayStart.includes("29,000₮ төлөөд эхлүүлэх"));
  assert(!unpaidSevenDayStart.includes("6,900₮"));
  assert(!unpaidSevenDayStart.includes("12,900₮"));
  assert(!unpaidSevenDayStart.includes("19,900₮"));
  assert(!unpaidSevenDayStart.includes("Demo unlock хийх"));
  const blockedUnlock = normalize(_internal.renderUnlock());
  assert(blockedUnlock.includes("7 хоногийн гүн анализаа нээх"));
  assert(!blockedUnlock.includes("1 дэх өдрөө эхлүүлэх"));
  assertNoPressureCopy(unpaidSevenDayStart);

  _internal.demoCompletePayment("seven-day");
  const unlockedDiary = normalize(_internal.renderUnlock());
  assert(unlockedDiary.includes("1 дэх өдрөө эхлүүлэх"));
  assert(unlockedDiary.includes("Орой бүр 3–5 минут"));

  setMode4Unpaid();
  const urgent = normalize(_internal.renderReport());
  assert(urgent.includes("Одоо жин хасах тухай биш"));
  assert(!urgent.includes("29,000₮"));
  assert(!urgent.includes("төлөөд бүрэн тайлангаа нээх"));

  setMode3Unpaid();
  const professional = normalize(_internal.renderReport());
  assert(professional.includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"));
  assert(professional.includes("Доорх богино нэгтгэлийг мэргэжлийн хүнтэй ярилцахдаа авч очиж болно."));
  assert(!professional.includes("29,000₮"));
  assert(!professional.includes("14 хоногийн туршилт"));
}

run();
console.log("pricing-paywall tests passed");
