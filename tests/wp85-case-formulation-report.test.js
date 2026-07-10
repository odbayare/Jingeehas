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
      "S1-C03": "175",
      "S1-C04": "92",
      "S1-C05": "80",
      "S1-S04": "Үгүй",
      ...stageAnswers
    },
    ...extras
  });
  return normalize(_internal.renderReport());
}

function assertIncludesAll(text, expected) {
  expected.forEach(item => assert(text.includes(item), `expected to include: ${item}`));
}

function assertExcludesAll(text, forbidden) {
  forbidden.forEach(item => assert(!text.includes(item), `expected to exclude: ${item}`));
}

function mechanismCount(text) {
  return (text.match(/Итгэлцлийн түвшин/g) || []).length;
}

function assertNoWp86InternalLabels(text) {
  assertExcludesAll(text, [
    "answer-by-answer",
    "case mechanism",
    "Evidence cluster",
    "Loop explanation",
    "First practical experiment",
    "Digestive discomfort",
    "restriction/rebound",
    "late-heavy-meal",
    "Sedentary-low-NEAT"
  ]);
}

function run() {
  const dairyOnly = renderPaidReport({
    "S1-FR01": ["Сүү, сүүн бүтээгдэхүүн"],
    "S1-FR02": ["Гэдэс дүүрдэг", "Хий ихэсдэг"]
  });
  assertIncludesAll(dairyOnly, [
    "Гол зураглал",
    "Таны хамгийн магадлалтай гол хэв маяг",
    "Гол биш боловч ажиглах хэрэгтэй зүйл",
    "Сүү, сүүн бүтээгдэхүүний дараах тавгүй мэдрэмж одоогоор жингийн гол шалтгаан гэж харагдахгүй байна",
    "хангалтгүй",
    "Хүнсний зохицол, шингэц ба цатгалан мэдрэмж"
  ]);
  assert.strictEqual((dairyOnly.match(/Сүү, сүүн бүтээгдэхүүний биеийн мэдрэмж/g) || []).length, 0, "isolated dairy must not create a long dairy mini-section");
  assertExcludesAll(dairyOnly.toLowerCase(), ["lactose", "celiac", "ibs", "gerd"]);

  const dairyRestriction = renderPaidReport({
    "S1-FR01": ["Сүү, сүүн бүтээгдэхүүн", "Их хэмжээтэй оройн хоол"],
    "S1-FR02": ["Гэдэс дүүрдэг", "Хүнд оргидог"],
    "S1-FR03": ["Их хэмжээгээр идсэн үед", "Орой эсвэл унтахын өмнө идсэн үед"],
    "S1-FR06": ["Тийм, сүү, сүүн бүтээгдэхүүн", "Хасах гэж оролдсон ч удаан үргэлжлээгүй"],
    "S1-W06": "Маргааш илүү чанга барина гэж боддог"
  });
  assertIncludesAll(dairyRestriction, [
    "Оройн хүнд хоол, биеийн тавгүйрхэл ба дараагийн өдрийн хэт засах эрсдэл",
    "Юунд тулгуурлаж байна вэ",
    "Яаж давтагдаж болох вэ",
    "Эхний туршиж үзэх зүйл",
    "өөрөө оношлохгүй"
  ]);
  assertNoWp86InternalLabels(dairyRestriction);
  assertExcludesAll(dairyRestriction, ["lactose", "Сүү, сүүн бүтээгдэхүүнийг бүр мөсөн хас"]);

  const flourSweet = renderPaidReport({
    "S1-F01": ["Ядарсан", "Хамгийн амар сонголт нь тэр байсан"],
    "S1-M02": "3-4",
    "S1-FR01": ["Гурилан бүтээгдэхүүн", "Чихэрлэг зүйл", "Хийжүүлсэн эсвэл чихэрлэг ундаа"],
    "S1-FR02": ["Амархан дахин өлсдөг", "Илүү их идмээр болдог"],
    "S1-FR03": ["Өдөр хоол алгасаад орой идсэн үед"],
    "S1-FR05": ["Чихэр, шоколад, амттан", "Талх, нарийн боов"]
  });
  assertIncludesAll(flourSweet, [
    "Цатгалан мэдрэмж тогтворгүй болж, хэмжээгээ барихад хэцүү болох үе",
    "хоол холдсон",
    "уураг/ногоотой хослуулах",
    "Бүх гурилыг хорихгүй"
  ]);
  assertExcludesAll(flourSweet, ["бүх гурилан хүнсийг шууд бүрэн хорих.", "all flour is forbidden"]);

  const redMeat = renderPaidReport({
    "S1-FR01": ["Улаан мах", "Их хэмжээтэй оройн хоол"],
    "S1-FR02": ["Хүнд оргидог", "Цээж хорсдог"],
    "S1-FR03": ["Их хэмжээгээр идсэн үед", "Орой эсвэл унтахын өмнө идсэн үед"]
  });
  assertIncludesAll(redMeat, [
    "Оройн хүнд хоол, биеийн тавгүйрхэл ба дараагийн өдрийн хэт засах эрсдэл",
    "оройн цаг",
    "порц",
    "бэлтгэл",
    "Улаан махыг бүр мөсөн хорихгүй"
  ]);
  assertExcludesAll(redMeat, ["улаан мах таарахгүй", "цусны бүлэгт тохирох", "цусны бүлгээр"]);

  const broadScenario = renderPaidReport({
    "S1-WC01": "Ихэнхдээ суугаа ажил",
    "S1-WC02": "Машинаар явдаг, бараг алхдаггүй",
    "S1-WC06": ["Сэтгэлээр ядарсан байдаг"],
    "S1-WC07": ["Стресс өндөртэй"],
    "S1-F01": ["Ядарсан", "Тайвширмаар санагдсан", "Харагдаад эсвэл үнэртээд идмээр болсон"],
    "S1-E01": "Нэлээд давтагддаг",
    "S1-E02": ["Стресс"],
    "S1-FR01": ["Сүү, сүүн бүтээгдэхүүн"],
    "S1-FR02": ["Гэдэс дүүрдэг"]
  });
  const count = mechanismCount(broadScenario);
  assert(count >= 1 && count <= 2, `mechanism count must be 1-2, got ${count}`);
  assertIncludesAll(broadScenario, [
    "Биеийн суурь зураглал",
    "Өдөр тутмын хөдөлгөөн ба ажлын нөхцөл",
    "Хүнсний зохицол, шингэц ба цатгалан мэдрэмж",
    "Гол биш боловч ажиглах хэрэгтэй зүйл",
    "Танд тохирох эхний стратеги",
    "7–14 хоногийн нэг хувьсагчийн туршилт"
  ]);

  [dairyRestriction, flourSweet, redMeat, broadScenario].forEach(report => {
    assertIncludesAll(report, [
      "Итгэлцлийн түвшин",
      "Юунд тулгуурлаж байна вэ",
      "Яаж давтагдаж болох вэ",
      "Эхний туршиж үзэх зүйл"
    ]);
    assertNoWp86InternalLabels(report);
    assert(!report.includes("механизмыг дэмжиж байгаа нэг дохио"), "must not repeat mechanical evidence wording");
  });

  assert(!/\bархи\b/i.test(appSource), "must not introduce user-facing архи");
  assert(!appSource.includes("согтууруулах ундаа орж ир"), "must not introduce awkward alcohol wording");
  assert(!appSource.includes("Day 1–3"), "must not introduce English day labels");
  assert(!appSource.includes("WP64"), "must not leak WP64");
  assertExcludesAll(appSource, ["цусны бүлэгт тохирох", "цусны бүлгээр", "O бүлэг", "A бүлэг", "B бүлэг", "AB бүлэг"]);
  assert(appSource.includes("const WEIGHT_TEST_COMING_SOON_MODE = true;"), "coming-soon guard must stay true");
  assert(appSource.includes("const WEIGHT_TEST_QA_PAYMENT_BYPASS = false;"), "QA payment bypass must stay false");
  assert(appSource.includes("const WEIGHT_TEST_QA_SKIP_PAYWALL = false;"), "QA skip paywall must stay false");
  assert(appSource.includes('oneTime: "9,900₮"'), "one-time price must stay 9,900₮");
  assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price must stay 29,000₮");
  assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
  assert(appSource.includes("qpay-create-invoice") && appSource.includes("qpay-check-payment"), "QPay endpoint strings must remain unchanged");
}

run();
console.log("wp85 case formulation report tests passed");
