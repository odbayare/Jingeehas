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
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-S04": "Үгүй",
      ...stageAnswers
    },
    diaryEntries: [],
    ...extras
  });
  return normalize(_internal.renderReport());
}

function assertSimpleStructure(report) {
  [
    "Товч хариу",
    "Таны гол гацдаг мөч",
    "Энэ юу гэсэн үг вэ?",
    "Эхлээд хийх нэг жижиг зүйл",
    "Одоогоор түр болгоомжлох зүйл"
  ].forEach(phrase => assert(report.includes(phrase), `ordinary report should include ${phrase}`));
  assert(report.indexOf("Товч хариу") < report.indexOf("Дэлгэрэнгүй тайлан харах"), "simple answer should appear before detailed report separator");
  assert(report.indexOf("Дэлгэрэнгүй тайлан харах") < report.indexOf("Гол зураг"), "detailed report should be secondary");
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
    "механизм"
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
  assert(collapseReport.includes("дараагийн хоолноос хэвийн үргэлжлүүлэх"));

  const rewardDeficitReport = setOrdinaryReport({
    "S1-V01": "Өдөржин хүүхэд, бусдын хэрэгцээ гээд өөрийгөө хамгийн сүүлд тавьдаг. Орой миний цаг болж амттай юм идмээр санагддаг.",
    "S1-R02": ["Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед"]
  });
  assertSimpleStructure(rewardDeficitReport);
  assert(rewardDeficitReport.includes("өөрийгөө хойш тавьсны дараа"));
  assert(rewardDeficitReport.includes("жижиг шагнал"));

  const cueReport = setOrdinaryReport({
    "S1-F01": ["Харагдаад эсвэл үнэртээд идмээр болсон"],
    "S1-R02": ["Хоолны зураг эсвэл захиалгын апп харахад"]
  });
  assertSimpleStructure(cueReport);
  assert(cueReport.includes("Хоол харагдах"));
  assert(cueReport.includes("захиалгын апп"));
  assert(cueReport.includes("нэг дохиог"));

  const cycleReport = setOrdinaryReport({
    "MC-GATE": "Тийм, хамаарна",
    "MC-03": "Сарын тэмдэг ирэхээс хэд хоногийн өмнө",
    "MC-04": ["Амттай юм, гурилан зүйл илүү хүсдэг"],
    "S1-R02": ["Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"]
  });
  assert(cycleReport.includes("Нэмэлтээр анхаарах зүйл"));
  assert(cycleReport.includes("Энэ нь онош биш"));

  const feedback = normalize(_internal.renderInternalTesterFeedbackSurvey());
  assert(feedback.includes("Тайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?"));
  assert(feedback.includes("Дахин уншиж байж ойлгосон"));

  const professionalReport = setOrdinaryReport({ "S1-S03": "Одоо давтагддаг" });
  assert(professionalReport.includes("мэргэжлийн хүнтэй ярилцахад илүүдэхгүй"));
  assert(!professionalReport.includes("Товч хариу"));
  assert(!professionalReport.includes("Эхлээд хийх нэг жижиг зүйл"));

  const urgentReport = setOrdinaryReport({ "S1-S04": "Одоо идэвхтэй бодогдож байна" });
  assert(urgentReport.includes("Яаралтай аюулгүй байдлын зөвлөмж"));
  assert(!urgentReport.includes("Товч хариу"));
  assert(!urgentReport.includes("Эхлээд хийх нэг жижиг зүйл"));
}

run();
console.log("result-comprehension tests passed");
