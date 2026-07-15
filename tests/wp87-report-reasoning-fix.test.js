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
    removedFeaturePaid: false,
    upgradePaid: false,
    preliminary: [],
    removedEntries: [],
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

function countOccurrences(text, phrase) {
  return (String(text).match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
}

function run() {
  const flexibleIrregular = renderPaidReport({
    "S1-W06": "Дараагийн хоолноосоо хэвийн үргэлжлүүлье гэж боддог",
    "S1-W04": ["Усанд сэлэх"],
    "S1-MV01": ["Усанд сэлэх"],
    "S1-WC01": "Ихэнхдээ суугаа ажил",
    "S1-WC04": "Тогтмол бус цагтай",
    "S1-WC06": ["Сэтгэлээр ядарсан байдаг"],
    "S1-WC07": ["Стресс өндөртэй"],
    "S1-FR01": ["Их хэмжээтэй оройн хоол", "Тослог/шарсан хоол"],
    "S1-FR02": ["Хүнд оргидог", "Цээж хорсдог"],
    "S1-FR03": ["Их хэмжээгээр идсэн үед", "Орой эсвэл унтахын өмнө идсэн үед"]
  });

  const firstHeadingIndex = flexibleIrregular.indexOf("1. Гол зураглал");
  const metaIndex = flexibleIrregular.indexOf("хариулт бүрийг тусад нь тайлбарлахгүй");
  assert(firstHeadingIndex >= 0, "report should start with main case formulation");
  assert(metaIndex === -1 || metaIndex > firstHeadingIndex, "report must not begin with duplicated answer-by-answer meta explanation");
  assert(countOccurrences(flexibleIrregular, "хариулт бүрийг тусад нь тайлбарлахгүй") <= 1);

  assert(flexibleIrregular.includes("Оройн хоол ба биеийн мэдрэмж"));
  assert(flexibleIrregular.includes("Өдөр тутмын хөдөлгөөн ба ажлын хэмнэл"));
  assert(flexibleIrregular.includes("Зорилтот жингийн хүрээ"));
  assert(countOccurrences(flexibleIrregular, "Энэ нь оройн цаг, хоолны хэмжээ, тослог бэлтгэлтэй холбоотой") <= 1);
  assert(countOccurrences(flexibleIrregular, "Энэ нь хоол холдох, ядаргаа, хэмжээг нь барихад хэцүү") <= 1);

  assert(flexibleIrregular.includes("Хамгаалах хүчин зүйл"));
  assert(flexibleIrregular.includes("Сайн тал нь, та нэг удаа хазайсны дараа дараагийн хоолноос хэвийн үргэлжлүүлэх бодолтой байна."));
  assert(flexibleIrregular.includes("1. Оройн хүнд хоол ба биеийн тавгүй мэдрэмж"));
  assert(!flexibleIrregular.includes("1. Оройн хүнд хоол, биеийн тавгүйрхэл ба дараагийн өдрийн хэт засах эрсдэл"));

  assert(flexibleIrregular.includes("Ажлын цаг тогтмол бус үед хоолны хэмнэл өдөр бүр адил байхгүй байж болно."));
  assert(!flexibleIrregular.includes("Ээлжийн эсвэл шөнийн ажилтай үед"));

  assert(flexibleIrregular.includes("Өмнө нь усанд сэлэхийг туршиж байсан нь нам ачаалалтай хөдөлгөөн танд боломжтой байж болохыг харуулж байна."));
  assert(!flexibleIrregular.includes("Усанд сэлэх") || !flexibleIrregular.includes("нэмэлт нотолгоо"));

  assert(flexibleIrregular.includes("Зөвхөн нэг хувьсагч өөрчил"));
  assert(flexibleIrregular.includes("хөдөлгөөнийг өөрчлөхгүй"));
  assert(!flexibleIrregular.includes("Өдөрт 2 удаа 5–10 минут суултаа тасалж алх"));

  [
    "Улаан мах хүнд санагддаг",
    "Тамхи",
    "Согтууруулах ундаа хэрэглэсэн",
    "Эмийн хэрэглээ, даралт",
    "цусны бүлгээр",
    "цусны бүлгийн"
  ].forEach(phrase => assert(!flexibleIrregular.includes(phrase), `irrelevant phrase leaked: ${phrase}`));

  [
    "архи",
    "согтууруулах ундаа орж ир",
    "Day 1–3",
    "WP64"
  ].forEach(phrase => assert(!flexibleIrregular.includes(phrase), `forbidden phrase leaked: ${phrase}`));

  const shiftNight = renderPaidReport({
    "S1-WC04": "Шөнийн ээлжтэй",
    "S1-WC05": ["Хоол идэх цаг, орчин тогтмол биш"],
    "S1-WC06": ["Шууд амрах эсвэл унтмаар санагддаг"],
    "S1-N01": "Тогтворгүй"
  });
  assert(shiftNight.includes("Ээлжийн эсвэл шөнийн ажилтай үед"), "shift/night copy should appear when explicitly selected");

  assert(appSource.includes("const WEIGHT_TEST_COMING_SOON_MODE = true;"));
  assert(appSource.includes("const WEIGHT_TEST_QA_PAYMENT_BYPASS = false;"));
  assert(appSource.includes("const WEIGHT_TEST_QA_SKIP_PAYWALL = false;"));
  assert(appSource.includes("9,900₮"));
  assert(appSource.includes("WEIGHT_TEST_ONE_TIME"));
  assert(appSource.includes("qpay-create-invoice") && appSource.includes("qpay-check-payment"));
  assert(!appSource.includes("цусны бүлгээр"));
  assert(!appSource.includes("цусны бүлгийн"));
}

run();
console.log("wp87 report reasoning fix tests passed");
