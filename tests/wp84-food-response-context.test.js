const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { stageOneQuestions, _internal } = app;
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
      "S1-F01": ["Ядарсан"],
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

function run() {
  const foodQuestions = stageOneQuestions.filter(question => question.id.startsWith("S1-FR"));
  assert.strictEqual(foodQuestions.length, 7, "WP84 should add seven food-response context questions");
  assert.strictEqual(foodQuestions[0].stageTitle, "Үе 1 · Хүнсний зохицол ба биед өгөх мэдрэмж");

  const questionText = foodQuestions.map(question => question.text).join("\n");
  const helperText = foodQuestions.map(question => question.helper || "").join("\n");
  const optionText = foodQuestions.flatMap(question => question.options || []).join("\n");
  assertIncludesAll(questionText, [
    "Ямар хүнс идсэний дараа таны биед хүнд, тавгүй эсвэл шингэц муутай санагдах үе байдаг вэ?",
    "Тэр хүнсийг идсэний дараа танд ихэвчлэн юу мэдрэгддэг вэ?",
    "Энэ мэдрэмж ихэвчлэн ямар үед илүү тод илэрдэг вэ?",
    "Ямар төрлийн хоол идсэний дараа танд цатгалан, хөнгөн, тогтвортой санагддаг вэ?",
    "Аль төрлийн хүнсийг идэж эхлэхээр хэмжээг нь барихад хамгийн хэцүү байдаг вэ?",
    "Та ямар нэг хүнсийг ‘надад зохихгүй’ гэж бодоод бүрэн хасаж үзсэн үү?"
  ]);
  assertIncludesAll(helperText, [
    "Энэ нь цусны бүлгийн тухай биш",
    "өөрийн анзаарсан мэдрэмж, шингэц, өлсөлт, цатгалан байдал"
  ]);
  assertIncludesAll(optionText, [
    "Улаан мах",
    "Тослог / шарсан хоол",
    "Гурилан бүтээгдэхүүн",
    "Талх, нарийн боов",
    "Гоймон, банш, хуушуур зэрэг гурилан хоол",
    "Цагаан будаа ихтэй хоол",
    "Сүү, сүүн бүтээгдэхүүн",
    "Чихэрлэг зүйл",
    "Хийжүүлсэн эсвэл чихэрлэг ундаа",
    "Халуун ногоотой хоол",
    "Шош, вандуй, буурцаг",
    "Байцаа, брокколи зэрэг зарим ногоо",
    "Их хэмжээтэй оройн хоол",
    "Согтууруулах ундаа хэрэглэсэн үеийн хоол",
    "Гэдэс дүүрдэг",
    "Хий ихэсдэг",
    "Хүнд оргидог",
    "Цээж хорсдог",
    "Нойр хүрдэг",
    "Амархан дахин өлсдөг",
    "Илүү их идмээр болдог",
    "Маргааш нь бие хавагнасан мэт санагддаг",
    "Өтгөн хатах эсвэл суулгах үе байдаг",
    "Их хэмжээгээр идсэн үед",
    "Орой эсвэл унтахын өмнө идсэн үед",
    "Өдөр хоол алгасаад орой идсэн үед",
    "Яарч идсэн үед",
    "Стресстэй үед",
    "Ядарсан үед",
    "Согтууруулах ундаа хэрэглэсэн үед",
    "Хөдөлгөөн багатай өдөр",
    "Ажлын дараа",
    "Өндөг",
    "Тахиа, загас зэрэг хөнгөн уурагтай хоол",
    "Улаан мах бага хэмжээгээр",
    "Шөлтэй хоол",
    "Ногоо ихтэй хоол",
    "Будаа, ногоо, уураг хосолсон хоол",
    "Тараг, аарц, сүүн бүтээгдэхүүн",
    "Самар, үр зэрэг бага хэмжээний тослог хүнс",
    "Жимс",
    "Гэрийн энгийн хоол",
    "Чихэр, шоколад, амттан",
    "Чипс, давслаг зууш",
    "Шарсан / тослог хоол",
    "Түргэн хоол",
    "Согтууруулах ундаа хэрэглэсэн үеийн зууш"
  ]);
  assert(!/цусны бүлг.*(юу|аль|сонго|оруул)/i.test(questionText), "must not ask for blood type");
  assertExcludesAll(optionText, ["O бүлэг", "A бүлэг", "B бүлэг", "AB бүлэг"]);
  assertExcludesAll(appSource, ["цусны бүлэгт тохирох", "цусны бүлгээр", "O бүлэг", "A бүлэг", "B бүлэг", "AB бүлэг"]);

  const redMeat = renderPaidReport({
    "S1-FR01": ["Улаан мах", "Их хэмжээтэй оройн хоол"],
    "S1-FR02": ["Хүнд оргидог", "Цээж хорсдог"],
    "S1-FR03": ["Их хэмжээгээр идсэн үед", "Орой эсвэл унтахын өмнө идсэн үед"],
    "S1-FR04": ["Шөлтэй хоол"],
    "S1-FR05": ["Оройн их хоол"]
  });
  assertIncludesAll(redMeat, [
    "Хүнсний зохицол, шингэц ба цатгалан мэдрэмж",
    "Энэ хэсэг нь цусны бүлгийн тухай биш",
    "late-heavy-meal discomfort loop",
    "оройн цаг",
    "порц",
    "бэлтгэл",
    "Улаан махыг бүр мөсөн хорихгүй",
    "7–14 хоногийн нэг хувьсагчийн туршилт"
  ]);
  assertExcludesAll(redMeat, ["улаан махыг бүр мөсөн хас", "цусны бүлэгт тохирох", "цусны бүлгээр"]);

  const flourSweet = renderPaidReport({
    "S1-FR01": ["Гурилан бүтээгдэхүүн", "Чихэрлэг зүйл", "Хийжүүлсэн эсвэл чихэрлэг ундаа"],
    "S1-FR02": ["Амархан дахин өлсдөг", "Илүү их идмээр болдог"],
    "S1-FR03": ["Өдөр хоол алгасаад орой идсэн үед"],
    "S1-FR05": ["Чихэр, шоколад, амттан", "Талх, нарийн боов"]
  });
  assertIncludesAll(flourSweet, [
    "satiety instability + easy-overeat loop",
    "порц",
    "уураг/ногоотой хослуулах",
    "Бүх гурилыг хорихгүй",
    "Хэмжээ барихад хэцүү хүнс"
  ]);
  assertExcludesAll(flourSweet, ["бүх гурилыг хорих.", "бүх гурилан хүнсийг хорих"]);

  const dairy = renderPaidReport({
    "S1-FR01": ["Сүү, сүүн бүтээгдэхүүн"],
    "S1-FR02": ["Гэдэс дүүрдэг", "Хий ихэсдэг", "Өтгөн хатах эсвэл суулгах үе байдаг"],
    "S1-FR04": ["Тараг, аарц, сүүн бүтээгдэхүүн"]
  });
  assertIncludesAll(dairy, [
    "Гол биш боловч ажиглах хэрэгтэй зүйл",
    "Сүү, сүүн бүтээгдэхүүний дараах тавгүй мэдрэмж одоогоор жингийн гол механизм гэж харагдахгүй байна",
    "хангалтгүй",
    "мэргэжлийн хүнтэй ярилц"
  ]);
  assertExcludesAll(dairy.toLowerCase(), ["lactose", "celiac", "ibs", "gerd"]);

  const eliminationRisk = renderPaidReport({
    "S1-FR06": ["Тийм, гурилан бүтээгдэхүүн", "Тийм, сүү, сүүн бүтээгдэхүүн", "Хасах гэж оролдсон ч удаан үргэлжлээгүй"],
    "S1-W06": "Одоо бүх юм нурчихлаа гэж санагддаг"
  });
  assertIncludesAll(eliminationRisk, [
    "Strict elimination/rebound loop",
    "олон хүнсийг нэг дор бүрэн хасах",
    "Нэг хүнс эсвэл нэг нөхцөл",
    "нэг хувьсагч",
    "Бусад хүнсийг зэрэг хорихгүй"
  ]);
  assertExcludesAll(eliminationRisk, ["цусны бүлэгт тохирох", "цусны бүлгээр"]);

  const flags = _internal.foodResponseFlags({
    "S1-FR01": ["Сүү, сүүн бүтээгдэхүүн", "Гурилан бүтээгдэхүүн"],
    "S1-FR02": ["Гэдэс дүүрдэг", "Амархан дахин өлсдөг"],
    "S1-FR06": ["Тийм, гурилан бүтээгдэхүүн"]
  });
  assert.strictEqual(flags.dairy, true);
  assert.strictEqual(flags.flour, true);
  assert.strictEqual(flags.digestive, true);
  assert.strictEqual(flags.hungerRebound, true);
  assert.strictEqual(flags.eliminationRisk, true);

  assert(!/\bархи\b/i.test(appSource), "must not introduce user-facing архи");
  assert(!appSource.includes("согтууруулах ундаа орж ир"), "must not introduce awkward alcohol wording");
  assert(!appSource.includes("Day 1–3"), "must not introduce English day labels");
  assert(!appSource.includes("WP64"), "must not leak WP64");
  assert(appSource.includes("const WEIGHT_TEST_COMING_SOON_MODE = true;"), "coming-soon guard must stay true");
  assert(appSource.includes("const WEIGHT_TEST_QA_PAYMENT_BYPASS = false;"), "QA payment bypass must stay false");
  assert(appSource.includes("const WEIGHT_TEST_QA_SKIP_PAYWALL = false;"), "QA skip paywall must stay false");
  assert(appSource.includes('oneTime: "9,900₮"'), "one-time price must stay 9,900₮");
  assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price must stay 29,000₮");
  assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
  assert(appSource.includes("qpay-create-invoice") && appSource.includes("qpay-check-payment"), "QPay endpoint strings must remain unchanged");
}

run();
console.log("wp84 food response context tests passed");
