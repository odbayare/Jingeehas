const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function setOrdinaryReport(stageAnswers = {}, extras = {}) {
  _internal.setTestState({
    packageType: "one-time",
    internalTest: true,
    oneTimePaid: true,
    removedFeaturePaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-S04": "Үгүй",
      ...stageAnswers
    },
    removedEntries: [],
    ...extras
  });
  return normalize(_internal.renderReport());
}

function assertSimpleStructure(report) {
  [
    "1. Гол зураглал",
    "2. Энэ дүгнэлт юунд тулгуурласан бэ?",
    "3. Таны хамгийн магадлалтай гол хэв маяг",
    "5. Танд тохирох эхний стратеги",
    "7. 7–14 хоногийн нэг хувьсагчийн туршилт",
    "Тайлангаа хадгалах"
  ].forEach(phrase => assert(report.includes(phrase), `ordinary report should include ${phrase}`));
  assert(report.replace(/^Тайлан\s+/, "").startsWith("1. Гол зураглал"), "paid report should start with the case formulation");
  assert(report.indexOf("1. Гол зураглал") < report.indexOf("7. 7–14 хоногийн нэг хувьсагчийн туршилт"), "paid report should keep one clear ordered structure");
  assert(report.indexOf("7. 7–14 хоногийн нэг хувьсагчийн туршилт") < report.indexOf("Тайлангаа хадгалах"), "save actions should come after the experiment");
}

function assertNoConfusingReportWords(report) {
  [
    "тасалдал",
    "дэглэм тасалдал",
    "тасарсан",
    "тасардаг",
    "тасалдах",
    "тасалдвал",
    "давтамж гэх давтамж",
    "гэх давтамжтай нийцэж байна",
    "хүчтэй нийцэж байна",
    "дунд зэрэг нийцэж байна",
    "Нурах давтамж",
    "шийдвэрийн ачаалал",
    "тухайн мөчид хоол дараах хэрэгцээний нэгийг түр нөхөж байсан байж магадгүй",
    "харагдаж байна",
    "энэ эхний зураглал",
    "давтагддагийг харна",
    "давтагдаж байна",
    "нөхцөлд давтагддаг",
    "орчин өөрөө идэх шийдвэрийг",
    "Дэлгэрэнгүй тайлан харах",
    "Товч хариу",
    "Дэлгэрэнгүй тайлан",
    "7 хоногийн тэмдэглэл юуг тодруулах вэ?",
    "[REMOVED_FEATURE_REFINEMENT]",
    "Илүү нарийвчилж болох хэсгүүд",
    "Гүн зураглалд харах хэсэг"
  ].forEach(phrase => assert(!report.includes(phrase), `public report should not contain confusing phrase: ${phrase}`));
}

function run() {
  const collapseReport = setOrdinaryReport({
    "S1-W03": "Бараг бүх оролдлогоос хойш",
    "S1-W06": "Өнөөдөр өнгөрлөө, маргаашаас",
    "S1-F02": "Одоо бүх юм дууссан",
    "S1-X03": "Маш хүчтэй"
  });
  assertSimpleStructure(collapseReport);
  assertNoConfusingReportWords(collapseReport);
  assert(collapseReport.includes("Өнөөдөр өнгөрлөө"));
  assert(collapseReport.includes("ердийн хэмжээтэй хэвийн хоол руу буцах"));

  const rewardDeficitReport = setOrdinaryReport({
    "S1-V01": "Өдөржин хүүхэд, бусдын хэрэгцээ гээд өөрийгөө хамгийн сүүлд тавьдаг. Орой миний цаг болж амттай юм идмээр санагддаг.",
    "S1-R02": ["Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед"]
  });
  assertSimpleStructure(rewardDeficitReport);
  assert(rewardDeficitReport.includes("өөрийгөө хамгийн сүүлд"));
  assert(!rewardDeficitReport.includes("миний юм"));
  assert(!rewardDeficitReport.includes("ганц жижиг баяр"));
  assert(!rewardDeficitReport.includes("өөртөө өгөх нэг жижиг зүйл болдог"));

  const cueReport = setOrdinaryReport({
    "S1-F01": ["Харагдаад эсвэл үнэртээд идмээр болсон"],
    "S1-R02": ["Хоолны зураг эсвэл захиалгын апп харахад"]
  });
  assertSimpleStructure(cueReport);
  assert(cueReport.includes("зууш") || cueReport.includes("Зууш"));
  assert(cueReport.includes("захиалгын апп"));
  assert(cueReport.includes("нэг зүйлийг нэг алхам холдуул"));

  const cycleReport = setOrdinaryReport({
    "S1-C02": "Эмэгтэй",
    "MC-GATE": "Тийм, хамаарна",
    "MC-03": "Сарын тэмдэг ирэхээс хэд хоногийн өмнө",
    "MC-04": ["Амттай юм, гурилан зүйл илүү хүсдэг", "Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг", "Ядаргаа, нойр муудахтай давхцдаг"],
    "S1-R02": ["Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"]
  });
  assertSimpleStructure(cycleReport);
  assert(cycleReport.includes("Сарын тэмдэг ирэхээс хэд хоногийн өмнө"));
  assert(!cycleReport.includes("Өдөржин өөрийн хэрэгцээ хамгийн сүүлд"));
  assert(!cycleReport.includes("надад ч гэсэн нэг юм хэрэгтэй"));
  assert(!cycleReport.includes("Нэмэлтээр анхаарах зүйл"));
  assert(cycleReport.includes("1. Гол зураглал"));
  assert(!cycleReport.includes("7 хоногийн тэмдэглэл юуг тодруулах вэ?"));
  assert(!cycleReport.includes("Сарын тэмдэг ирэхийн өмнөх өдрүүдэд идэх хүсэл хэр өөр байна вэ?"));
  assert(!cycleReport.includes("Дэлгэрэнгүй тайлан харах"));
  assert(!cycleReport.includes("Нэмэлтээр анхаарах зүйл: Нэмэлтээр анхаарах зүйл"));
  ["даавраас болж байна", "энэ бол PMS", "эмэгтэй хүмүүс бүгд", "заавал"].forEach(phrase => {
    assert(!cycleReport.includes(phrase), `cycle simple result should not overstate: ${phrase}`);
  });

  const feedback = normalize(_internal.renderInternalTesterFeedbackSurvey());
  assert(feedback.includes("Тайлангийн эхний “Гол гацалт” хэсэг ойлгомжтой байсан уу?"));
  assert(feedback.includes("Дахин уншиж байж ойлгосон"));
  assert(feedback.includes("9,900 төгрөгөөр"));
  assert(!feedback.includes("9,900 төлж"));
  assert(!feedback.includes("9,900₮ төлж"));
  assert(!feedback.includes("9,900-өөр"));
  assert(!feedback.includes("9,900₮-өөр"));

  const professionalReport = setOrdinaryReport({ "S1-S03": "Одоо давтагддаг" });
  assert(professionalReport.includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"));
  assert(!professionalReport.includes("1. Энэ тайлан юунд тулгуурласан бэ?"));
  assert(!professionalReport.includes("7. 7–14 хоногийн туршилт"));

  const urgentReport = setOrdinaryReport({ "S1-S04": "Одоо идэвхтэй бодогдож байна" });
  assert(urgentReport.includes("Яаралтай аюулгүй байдлын зөвлөмж"));
  assert(!urgentReport.includes("1. Энэ тайлан юунд тулгуурласан бэ?"));
  assert(!urgentReport.includes("7. 7–14 хоногийн туршилт"));
}

run();
console.log("result-comprehension tests passed");
