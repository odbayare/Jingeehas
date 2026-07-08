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
assert(reportText.includes("Доорх тайлан таны хариултыг давтаж жагсаах биш, хооронд нь холбож унших зорилготой."), "paid report must use the expanded WP81 intro");

[
  "1. Энэ тайлан юунд тулгуурласан бэ?",
  "2. Таны гол давтагдаж буй механизм",
  "3. Энэ нь яагаад жин дээр нөлөөлж байж болох вэ?",
  "4. Давхар нөлөөлж байгаа хүчин зүйлс",
  "6. Одоогоор юуг хийхгүй байх вэ?",
  "7. Эхний өөрчлөлт хаанаас эхлэх вэ?",
  "8. 7–14 хоногийн туршилт",
  "9. Хэрэв дахин хазайвал яах вэ?",
  "10. Танд тохирох ажиглалтын 5 асуулт",
  "11. Хэзээ мэргэжлийн хүнтэй ярилцах вэ?",
  "12. Товч дүгнэлт",
  "Тайлангаа хадгалах"
].forEach(section => {
  assert(reportText.includes(section), `paid report must include section: ${section}`);
});

assert(reportText.includes("Тайлан хуулж авах"), "paid report must include copy button label");
assert(reportText.includes("Хэвлэх / PDF хадгалах"), "paid report must include print/PDF button label");
assert.strictEqual((reportText.match(/Тайлангаа хадгалах/g) || []).length, 1, "save section must appear once");

[
  ["Тайлан", "Таны тайлан"].join(" "),
  ["Энэ бол таны", "төлбөртэй нэг удаагийн тайлан"].join(" "),
  ["Эхний товч", "зураглал"].join(" "),
  ["Таны эхний", "ажиглалт"].join(" "),
  ["Гүн тайлангийн", "хэсэг"].join(" "),
  ["Төлбөртэй", "тайланд"].join(" "),
  "7 хоногоор нарийвчлах",
  "19,900₮ төлөөд 7 хоногоор нарийвчлах"
].forEach(forbidden => {
  assert(!paidText.includes(forbidden), `paid report must not include teaser/upsell copy: ${forbidden}`);
});

assert(!/7\. 7–14 хоногийн туршилт[\s\S]*7\. Тайлангаа хадгалах/.test(reportText), "save section must not reuse section numbering");

_internal.setTestState({
  packageType: "one-time",
  view: "report",
  oneTimePaid: true,
  stageAnswers: {
    "S1-C02": "Эрэгтэй",
    "S1-F01": ["Татгалзах эвгүй байсан"],
    "S1-S04": "Үгүй"
  },
  preliminary: [],
  diaryEntries: [],
  stageVoiceSummaries: {}
});
const noCautionText = normalize(_internal.renderReport());
assert(noCautionText.includes("11. Хэзээ мэргэжлийн хүнтэй ярилцах вэ?"), "report should keep the WP81 safety/professional guidance");
assert(noCautionText.includes("Тайлангаа хадгалах"), "no-caution report still has save section");
assert(!/6\. Тайлангаа хадгалах|7\. Тайлангаа хадгалах/.test(noCautionText), "save section must be unnumbered when caution is absent");

assert(reportText.indexOf("11. Хэзээ мэргэжлийн хүнтэй ярилцах вэ?") < reportText.indexOf("Тайлангаа хадгалах"), "safety reminder must appear before save section");

console.log("paid-report-quality tests passed");
