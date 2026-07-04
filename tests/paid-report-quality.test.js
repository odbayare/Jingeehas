const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

_internal.setTestState({
  packageType: "one-time",
  view: "report",
  oneTimePaid: true,
  sevenDayPaid: false,
  upgradePaid: false,
  stageAnswers: {
    "S1-C02": "Эрэгтэй",
    "S1-B01": ["Гар салгалах"],
    "S1-F01": ["Тайвширмаар байсан"],
    "S1-F02": "Тайвширдаг",
    "S1-S04": "Үгүй"
  },
  preliminary: [],
  diaryEntries: [],
  stageVoiceSummaries: {}
});

const reportText = normalize(_internal.renderReport());
const paidText = reportText.replace(/^Тайлан\s+/, "");

assert(paidText.startsWith("Таны тайлан бэлэн боллоо"), "paid report must start with the WP62 paid report headline");

[
  "1. Гол гацалт",
  "2. Яагаад давтагдаад байна вэ?",
  "3. Таны өдөр тутмын тойрог",
  "4. Таны хувьд хамгийн түрүүнд өөрчлөх цэг",
  "5. 14 хоногийн жижиг туршилт",
  "6. Болгоомжлох зүйл",
  "7. Тайлангаа хадгалах"
].forEach(section => {
  assert(reportText.includes(section), `paid report must include section: ${section}`);
});

assert(reportText.includes("Тайлан хуулж авах"), "paid report must include copy button label");
assert(reportText.includes("Хэвлэх / PDF хадгалах"), "paid report must include print/PDF button label");

[
  ["Эхний товч", "зураглал"].join(" "),
  ["Таны эхний", "ажиглалт"].join(" "),
  ["Гүн тайлангийн", "хэсэг"].join(" "),
  ["Төлбөртэй", "тайланд"].join(" "),
  "7 хоногоор нарийвчлах",
  "19,900₮ төлөөд 7 хоногоор нарийвчлах"
].forEach(forbidden => {
  assert(!reportText.includes(forbidden), `paid report must not include teaser/upsell copy: ${forbidden}`);
});

console.log("paid-report-quality tests passed");
