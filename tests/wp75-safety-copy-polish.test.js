const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

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
    stageAnswers: {
      "S1-S04": "Үгүй",
      ...stageAnswers
    },
    diaryEntries: [],
    ...extras
  });
  return _internal.renderReport();
}

function cycleText(html) {
  const marker = '<div class="cycle-map">';
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const rest = html.slice(start + marker.length);
  const end = rest.indexOf("</div>");
  return normalize(end >= 0 ? rest.slice(0, end) : rest);
}

function run() {
  const professionalSafety = normalize(renderPaidReport({
    "S1-C02": "Эмэгтэй",
    "S1-B05": "Хөхүүл",
    "S1-B02": "Тийм, санаа зовоосон",
    "MC-GATE": "Тийм, хамаарна",
    "MC-06": ["Төрсний дараах эсвэл хөхүүл үе"]
  }));

  assert(professionalSafety.includes("Эхлээд мэргэжлийн хүнтэй ярилцах нь зөв байна"), "professional safety route should keep the safety-first headline");
  assert(professionalSafety.includes("Доорх богино нэгтгэлийг мэргэжлийн хүнтэй ярилцахдаа авч очиж болно."), "professional safety route should use the polished short-summary sentence");
  assert(!professionalSafety.includes("Ярилцах товч нэгтгэл доор байна. ярилцахад авч очих богино нэгтгэл гаргана."), "professional safety route should not repeat the short-summary idea");
  assert(!professionalSafety.includes("7. 7–14 хоногийн туршилт"), "professional safety route must not show an ordinary experiment");
  assert(!/онош тав|эмчилгээ|өвчтэй|сахилга батгүй|мацаг барь|огцом хас гэж/i.test(professionalSafety), "professional safety route must avoid diagnosis, treatment, shame, and extreme-diet claims");

  const urgentSafety = normalize(renderPaidReport({
    "S1-C01": "33",
    "S1-S04": "Одоо идэвхтэй бодогдож байна"
  }, {
    safetyFlags: ["S1-S04:urgent"]
  }));
  assert(urgentSafety.includes("Одоо жин хасах тухай биш"), "urgent route should keep the safety-first opening");
  assert(urgentSafety.includes("Ганцаараа битгий үлдээрэй"), "urgent route should keep immediate safety wording");
  assert(!urgentSafety.includes("14 хоногийн туршилт"), "urgent route must suppress ordinary experiment copy");
  assert(!urgentSafety.includes("9,900₮ төлөөд"), "urgent route must not show commercial CTA copy");

  const bodySignal = normalize(renderPaidReport({
    "S1-C02": "Эрэгтэй",
    "S1-B01": ["Гар салгалах"],
    "S1-F01": ["Тайвширмаар санагдсан"],
    "S1-F02": "Тайвширдаг"
  }));
  assert(bodySignal.includes("8. Аюулгүй байдлын сануулга"), "body-signal route should keep the safety reminder section");
  assert(bodySignal.includes("мэргэжлийн хүнтэй ярилцах"), "body-signal route should keep professional safety guidance");
  assert(!/онош тав|эмчилгээ|өвчтэй|сахилга батгүй/i.test(bodySignal), "body-signal route must avoid diagnostic and shame wording");

  const rewardReportHtml = renderPaidReport({
    "S1-V01": "Өдөржин бусдын хэрэгцээ түрүүлээд өөрийн хоол, амралт хойшлогддог. Орой амттай юм идмээр санагддаг.",
    "S1-R02": ["Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед"],
    "S1-F01": ["Өөрийгөө урамшуулмаар санагдсан"]
  });
  const rewardReport = normalize(rewardReportHtml);
  assert(rewardReport.includes("амттай зүйл"), "reward route should keep broad tasty-food wording");
  assert(!rewardReport.includes("зүгээр амттан хүссэн асуудал биш"), "reward route should not narrow the meaning to sweets only");
  assert(!rewardReport.includes("Гол гацалт Гол гацалт"), "report should not duplicate the main-stuck heading");
  assert(!cycleText(rewardReportHtml).includes(" 4."), "cycle map should not contain stray trailing numbers");
}

run();
console.log("wp75 safety copy polish tests passed");
