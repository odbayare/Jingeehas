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

function mechanismCount(text) {
  return (text.match(/Итгэлцлийн түвшин/g) || []).length;
}

function assertAbsent(text, phrases, label = "report") {
  phrases.forEach(phrase => assert(!text.includes(phrase), `${label} must not include: ${phrase}`));
}

function run() {
  const heavyFoodSedentary = renderPaidReport({
    "S1-WC01": "Ихэнхдээ суугаа ажил",
    "S1-WC02": "Машинаар явдаг, бараг алхдаггүй",
    "S1-WC06": ["Сэтгэлээр ядарсан байдаг"],
    "S1-WC07": ["Стресс өндөртэй"],
    "S1-FR01": ["Их хэмжээтэй оройн хоол", "Тослог/шарсан хоол"],
    "S1-FR02": ["Хүнд оргидог", "Цээж хорсдог"],
    "S1-FR03": ["Их хэмжээгээр идсэн үед", "Орой эсвэл унтахын өмнө идсэн үед"],
    "S1-W06": "Маргааш илүү чанга барина гэж боддог"
  });

  assert(heavyFoodSedentary.includes("Оройн хүнд хоол, биеийн тавгүйрхэл ба дараагийн өдрийн хэт засах эрсдэл"));
  assert(!heavyFoodSedentary.includes("Digestive discomfort → restriction/rebound loop"));
  assert(!heavyFoodSedentary.includes("late-heavy-meal discomfort loop"));
  assert(mechanismCount(heavyFoodSedentary) >= 1 && mechanismCount(heavyFoodSedentary) <= 2, "WP86 report must show only primary + optional secondary mechanism");

  assertAbsent(heavyFoodSedentary, [
    "answer-by-answer",
    "case mechanism",
    "Evidence cluster",
    "Loop explanation",
    "First practical experiment",
    "Digestive discomfort",
    "restriction/rebound",
    "late-heavy-meal",
    "Sedentary-low-NEAT",
    "context"
  ], "humanized report");

  assert(!heavyFoodSedentary.includes("механизмыг дэмжиж байгаа нэг дохио"), "evidence section must use natural explanation");
  assert(heavyFoodSedentary.includes("Оройн хоол ба биеийн мэдрэмж"));

  assert(heavyFoodSedentary.includes("Зөвхөн нэг хувьсагч өөрчил"), "strategy must include one food variable");
  assert(heavyFoodSedentary.includes("Өдөржин суусан эсэхээ тэмдэглэж болно, гэхдээ хөдөлгөөнийг өөрчлөхгүй"), "sedentary background must be observed without adding a second intervention");
  assert(heavyFoodSedentary.includes("Хүнд оргих, өлсөх, цээж хорсох, хавагнасан мэт мэдрэмж"), "experiment must track specific body markers");

  assertAbsent(heavyFoodSedentary, [
    "очсон хойноо шууд шийдэх гэж оролдох",
    "татгалзах эвгүй мэдрэмжийг буруутгах",
    "Улаан мах хүнд санагддаг",
    "Тамхи",
    "Согтууруулах ундаа хэрэглэсэн",
    "Эмийн хэрэглээ, даралт"
  ], "irrelevance-gated report");

  const redMeatSelected = renderPaidReport({
    "S1-FR01": ["Улаан мах", "Их хэмжээтэй оройн хоол"],
    "S1-FR02": ["Хүнд оргидог"],
    "S1-FR03": ["Орой эсвэл унтахын өмнө идсэн үед"]
  });
  assert(redMeatSelected.includes("Улаан мах хүнд санагддаг"), "red meat can appear when selected");

  assert(appSource.includes("const WEIGHT_TEST_COMING_SOON_MODE = true;"));
  assert(appSource.includes("const WEIGHT_TEST_QA_PAYMENT_BYPASS = false;"));
  assert(appSource.includes("const WEIGHT_TEST_QA_SKIP_PAYWALL = false;"));
  assert(appSource.includes("qpay-create-invoice") && appSource.includes("qpay-check-payment"));
}

run();
console.log("wp86 humanized case formulation tests passed");
