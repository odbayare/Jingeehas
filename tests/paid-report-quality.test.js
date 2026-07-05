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
assert(reportText.includes("Доорх тайлан таны хариултаас хамгийн хүчтэй давтагдаж буй нэг хэв маягийг тайван харуулах зорилготой."), "paid report must use the calmer WP66 intro");

[
  "1. Гол гацалт",
  "2. Яагаад давтагдаад байна вэ?",
  "3. Таны өдөр тутмын тойрог",
  "4. Таны хувьд хамгийн түрүүнд өөрчлөх цэг",
  "5. 14 хоногийн жижиг туршилт",
  "6. Болгоомжлох зүйл",
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

assert(!/5\. 14 хоногийн жижиг туршилт[\s\S]*7\. Тайлангаа хадгалах/.test(reportText), "save section must not jump from section 5 to section 7");

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
assert(!noCautionText.includes("6. Болгоомжлох зүйл"), "no-caution report must omit the caution section");
assert(noCautionText.includes("Тайлангаа хадгалах"), "no-caution report still has save section");
assert(!/6\. Тайлангаа хадгалах|7\. Тайлангаа хадгалах/.test(noCautionText), "save section must be unnumbered when caution is absent");

assert(reportText.indexOf("6. Болгоомжлох зүйл") < reportText.indexOf("Тайлангаа хадгалах"), "caution must appear before save section when present");

console.log("paid-report-quality tests passed");
