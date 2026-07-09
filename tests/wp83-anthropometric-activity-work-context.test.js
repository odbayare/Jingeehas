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
  const context = _internal.calculateAnthropometricContext({
    "S1-C01": "35",
    "S1-C03": "175",
    "S1-C04": "92",
    "S1-C05": "80"
  });
  assert.strictEqual(_internal.calculateBmi(92, 175), 30);
  assert.strictEqual(context.currentBmi, 30);
  assert.strictEqual(context.targetBmi, 26.1);
  assert.strictEqual(context.weightToLoseKg, 12);
  assert.strictEqual(context.percentOfCurrent, 13);
  assert.strictEqual(context.fasterWeeks, 13);
  assert.strictEqual(context.slowerWeeks, 27);
  assert.strictEqual(context.hasValidLoss, true);

  const invalid = _internal.calculateAnthropometricContext({ "S1-C03": "", "S1-C04": "92", "S1-C05": "80" });
  assert.strictEqual(invalid.currentBmi, null);
  assert.strictEqual(invalid.targetBmi, null);
  assert.strictEqual(invalid.invalidOrMissing, true);

  const lowTarget = _internal.calculateAnthropometricContext({ "S1-C03": "175", "S1-C04": "65", "S1-C05": "50" });
  assert.strictEqual(lowTarget.targetTooLow, true);
  assert.strictEqual(lowTarget.hasValidLoss, false, "target BMI under 18.5 must suppress ordinary timeline");

  const questionText = stageOneQuestions.map(question => question.text).join("\n");
  assertIncludesAll(questionText, [
    "Таны ажил өдөрт ихэвчлэн ямар хөдөлгөөн шаарддаг вэ?",
    "Та ажил, сургууль, өдөр тутмын гол газраа ихэвчлэн яаж очдог вэ?",
    "Дасгалаас гадна өдөр тутамдаа хэр их хөдөлгөөнтэй байдаг вэ?",
    "Таны ажлын цагийн хэмнэл аль нь вэ?",
    "Ажил дээрээ хооллох боломж тань ихэвчлэн ямар байдаг вэ?",
    "Ажлын дараа таны бие, сэтгэл ихэвчлэн ямар байдаг вэ?",
    "Таны ажил дараах нөхцөлүүдийн аль нэгтэй холбоотой юу?"
  ]);
  const questionOptions = stageOneQuestions.flatMap(question => question.options || []).join("\n");
  assertIncludesAll(questionOptions, [
    "Ихэнхдээ суугаа ажил",
    "Хүнд биеийн хүчний ажил",
    "Жолоо барьж удаан суудаг ажил",
    "Гэрээсээ ажилладаг",
    "Ээлжийн ажилтай",
    "Шөнийн ээлжтэй",
    "Заримдаа хоол алгасдаг",
    "Ихэвчлэн яарч иддэг",
    "Ажлын байранд зууш, амттан, ундаа ойр байдаг",
    "Тоос, утаа, үнэр, химийн бодистой орчин",
    "Их халуун эсвэл их хүйтэн орчин",
    "Хүнд зүйл өргөдөг",
    "Аюулгүй ажиллагаа их шаарддаг"
  ]);

  const sedentary = renderPaidReport({
    "S1-WC01": "Ихэнхдээ суугаа ажил",
    "S1-WC02": "Машинаар явдаг, бараг алхдаггүй",
    "S1-WC03": "Маш бага — ихэнхдээ суудаг",
    "S1-WC04": "Өдрийн тогтмол цагтай",
    "S1-WC05": ["Гадуур хоол / хүргэлт их хэрэглэдэг"],
    "S1-WC06": ["Сэтгэлээр ядарсан байдаг"],
    "S1-WC07": ["Стресс өндөртэй"],
    "S1-E01": "Нэлээд давтагддаг",
    "S1-E02": ["Стресс"],
    "S1-F01": ["Тайвширмаар санагдсан", "Ядарсан"]
  });
  assertIncludesAll(sedentary, [
    "Биеийн суурь зураглал",
    "Одоогийн BMI",
    "Зорилтот BMI",
    "Хасах шаардлагатай жин",
    "Одоогийн жингийн хэдэн хувь",
    "Бодит хугацааны баримжаа",
    "ойролцоогоор 13–27 долоо хоног",
    "Өдөр тутмын хөдөлгөөн ба ажлын нөхцөл таны зорилтод яаж нөлөөлж байна вэ?",
    "Sedentary-low-NEAT + stress eating loop",
    "суух блок таслах",
    "Танд тохирох эхний стратеги"
  ]);
  assertExcludesAll(sedentary, ["go to gym", "фитнес рүү яв", "Day 1–3"]);

  const heavyWork = renderPaidReport({
    "S1-WC01": "Хүнд биеийн хүчний ажил",
    "S1-WC05": ["Заримдаа хоол алгасдаг", "Хоол идэх цаг, орчин тогтмол биш"],
    "S1-WC06": ["Биеэр ядарсан байдаг", "Хоол захиалах, бэлэн юм идэх нь хамгийн амар санагддаг"],
    "S1-WC07": ["Хүнд зүйл өргөдөг"],
    "S1-M01": "Өдөр бага идээд орой нөхдөг",
    "S1-F01": ["Ядарсан", "Хамгийн амар сонголт нь тэр байсан"]
  });
  assertIncludesAll(heavyWork, [
    "Heavy-work recovery/missed-meal loop",
    "асуудал хөдөлгөөн дутагдахдаа биш",
    "орой нөхөх идэлт",
    "Эхний стратеги бол илүү их дасгал биш",
    "backup хоол/зууш",
    "ус"
  ]);
  assertExcludesAll(heavyWork, ["илүү их дасгал хий", "хүнд дасгалаар өөрийгөө шийтгэх"]);

  const workFromHome = renderPaidReport({
    "S1-WC01": "Одоогоор ажил хийдэггүй",
    "S1-WC02": "Гэрээсээ ажилладаг",
    "S1-WC04": "Гэрээсээ ажилладаг",
    "S1-WC05": ["Ажлын байранд зууш, амттан, ундаа ойр байдаг"],
    "S1-F01": ["Харагдаад эсвэл үнэртээд идмээр болсон"]
  });
  assertIncludesAll(workFromHome, [
    "Work-from-home cue loop",
    "нэг гол зууш/ундааг нэг алхам холдуулаад",
    "transition break"
  ]);

  const shiftWork = renderPaidReport({
    "S1-WC04": "Шөнийн ээлжтэй",
    "S1-WC05": ["Хоол идэх цаг, орчин тогтмол биш"],
    "S1-WC06": ["Шууд амрах эсвэл унтмаар санагддаг"],
    "S1-N01": "Тогтворгүй"
  });
  assertIncludesAll(shiftWork, [
    "Shift-work rhythm loop",
    "Ээлжийн цагтаа таарсан хоолны anchor",
    "сэрсний дараах эхний хоол"
  ]);
  assert(!shiftWork.includes("орой хоол идэхгүй") || shiftWork.includes("гол шийдэл биш"), "shift report must avoid generic no-evening-food rule");

  const safety = renderPaidReport({
    "S1-B01": ["Толгой эргэх", "Зүрх дэлсэх", "Сахар унасан мэт"],
    "S1-B02": "Тийм, санаа зовоосон",
    "S1-WC07": ["Аюулгүй ажиллагаа их шаарддаг"],
    "S1-S04": "Үгүй"
  }, {
    safetyFlags: ["S1-B02:professional"]
  });
  assertIncludesAll(safety, [
    "Эхлээд мэргэжлийн хүнтэй ярилцах нь зөв байна",
    "Энэ нь онош гэсэн үг биш"
  ]);
  assertExcludesAll(safety, [
    "Бодит хугацааны баримжаа",
    "ойролцоогоор 13–27 долоо хоног",
    "Танд илүү тохирох эхний стратеги",
    "илүү их дасгал хий"
  ]);

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
console.log("wp83 anthropometric activity work context tests passed");
