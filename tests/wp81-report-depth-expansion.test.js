const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function renderPaidReport(stageAnswers, extras = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    internalTest: true,
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    preliminary: [],
    diaryEntries: [],
    stageVoiceSummaries: {},
    safetyFlags: [],
    stageAnswers: {
      "S1-C01": "35",
      "S1-C02": "Эрэгтэй",
      "S1-S04": "Үгүй",
      ...stageAnswers
    },
    ...extras
  });
  return normalize(_internal.renderReport());
}

function assertIncludesAll(haystack, expected) {
  expected.forEach(item => assert(haystack.includes(item), `expected report to include: ${item}`));
}

function assertExcludesAll(haystack, forbidden) {
  forbidden.forEach(item => assert(!haystack.includes(item), `expected report to exclude: ${item}`));
}

function assertGlobalGuards(text) {
  assertExcludesAll(text, [
    "Day 1–3",
    "согтууруулах ундаа орж ир",
    "Гол гацалт Гол гацалт",
    "WP64"
  ]);
  assert(!/\bархи\b/i.test(text), "user-facing report must not use архи");
  assert.strictEqual(_internal.WEIGHT_TEST_COMING_SOON_MODE, true, "repo source coming-soon guard must remain true");
  assert(appSource.includes('oneTime: "9,900₮"'), "price copy must remain 9,900₮");
  assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
  assert(appSource.includes("qpay-create-invoice") && appSource.includes("qpay-check-payment"), "QPay endpoints must remain unchanged");
}

function run() {
  const alcoholOvercorrection = renderPaidReport({
    "S1-W04": ["Завсарлагатай мацаг / мацаг барих", "Алхалт нэмэх"],
    "S1-W06": "Маргааш илүү чанга барина гэж боддог",
    "S1-F01": ["Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон", "Ядарсан"],
    "S1-A01": "7 хоногт 1–2 удаа хэрэглэдэг",
    "S1-A02": ["Зууш, шарсан эсвэл давслаг зүйл нэмэгддэг", "Нойр муудаж, маргааш хоолны хэмнэл алдагддаг"],
    "S1-A03": ["Давслаг, шөлтэй, тослог хоол хүсдэг", "Маргааш нь хоолоо илүү чанга барина гэж боддог"],
    "S1-MV01": ["Алхалт"],
    "S1-MV02": "Ядаргаа"
  });

  assertIncludesAll(alcoholOvercorrection, [
    "Гол зураглал",
    "Энэ дүгнэлт юунд тулгуурласан бэ?",
    "Таны хамгийн магадлалтай 2–3 механизм",
    "Итгэлцлийн түвшин",
    "Evidence cluster",
    "Loop explanation",
    "Согтууруулах ундаа хэрэглэсэн",
    "согтууруулах ундаа хэрэглэсний маргааш",
    "Одоогоор юуг хийхгүй байх вэ?",
    "Хэрэв дахин хазайвал яах вэ?",
    "Танд тохирох эхний стратеги",
    "1–3 дахь өдөр",
    "4–10 дахь өдөр",
    "11–14 дахь өдөр",
    "Дараагийн хоол бол шийтгэл биш, хэвийн үргэлжлэх цэг"
  ]);
  assert(alcoholOvercorrection.length >= 8500, `case-formulation alcohol report should be substantial, got ${alcoholOvercorrection.length}`);
  assertGlobalGuards(alcoholOvercorrection);

  const stressFatigueCue = renderPaidReport({
    "S1-F01": ["Тайвширмаар санагдсан", "Ядарсан", "Харагдаад эсвэл үнэртээд идмээр болсон"],
    "S1-E01": "Нэлээд давтагддаг",
    "S1-E02": ["Стресс", "Санаа зовнил"],
    "S1-N01": "4-6 цаг",
    "S1-N02": "Ихэвчлэн",
    "S1-M02": "3-4",
    "S1-A01": "Огт хэрэглэдэггүй"
  });
  assertIncludesAll(stressFatigueCue, [
    "Таны хамгийн магадлалтай 2–3 механизм",
    "Fatigue/easy-choice loop",
    "Итгэлцлийн түвшин",
    "Evidence cluster",
    "Loop explanation",
    "7–14 хоногийн нэг хувьсагчийн туршилт",
    "Одоогоор юуг хийхгүй байх вэ?"
  ]);
  assertExcludesAll(stressFatigueCue, [
    "согтууруулах ундаа хэрэглэсэн орой",
    "Согтууруулах ундаа хэрэглэсэн үеийн сонголт",
    "Согтууруулах ундаа өөрөө илчлэгтэй."
  ]);
  assert(stressFatigueCue.length >= 8000, `stress/fatigue/cue report should be substantial, got ${stressFatigueCue.length}`);
  assertGlobalGuards(stressFatigueCue);

  const bodySignalSafety = renderPaidReport({
    "S1-B01": ["Толгой эргэх", "Зүрх дэлсэх", "Сахар унасан мэт"],
    "S1-B02": "Тийм, санаа зовоосон",
    "S1-W04": ["Орой хоол идэхгүй байх"],
    "S1-S04": "Үгүй"
  }, {
    safetyFlags: ["S1-B02:professional"]
  });
  assertIncludesAll(bodySignalSafety, [
    "Эхлээд мэргэжлийн хүнтэй ярилцах нь зөв байна",
    "Энэ нь онош гэсэн үг биш",
    "биеийн талаа шалгах",
    "мэргэжлийн хүнтэй ярилцахдаа авч очиж болно"
  ]);
  assertExcludesAll(bodySignalSafety, [
    "8. 7–14 хоногийн туршилт",
    "Таны гол давтагдаж буй механизм",
    "өөрийгөө шийтгэх дасгал хий",
    "огцом дэглэм эхлүүл"
  ]);
  assertGlobalGuards(bodySignalSafety);
}

run();
console.log("wp81 report depth expansion tests passed");
