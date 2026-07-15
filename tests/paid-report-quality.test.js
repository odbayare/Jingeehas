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
  removedFeaturePaid: false,
  upgradePaid: false,
  stageAnswers: {
    "S1-C02": "Эрэгтэй",
    "S1-B01": ["Гар салгалах"],
    "S1-F01": ["Тайвширмаар байсан"],
    "S1-F02": "Тайвширдаг",
    "S1-S04": "Үгүй"
  },
  preliminary: [],
  removedEntries: [],
  stageVoiceSummaries: {}
});

const reportText = normalize(_internal.renderReport());
const paidText = reportText.replace(/^Тайлан\s+/, "");

assert(paidText.startsWith("1. Гол зураглал"), "paid report must start with the main case formulation");
assert(reportText.includes("Энэ тайлан онош, баталгаа, эсвэл жин бууруулах амлалт биш."), "paid report must keep one short disclaimer");
assert(
  reportText.includes("Оройн хоол ба биеийн мэдрэмж") || reportText.includes("Өдөр тутмын хөдөлгөөн ба ажлын хэмнэл") || reportText.includes("Зорилтот жингийн хүрээ") || reportText.includes("Хариултын гол холбоос"),
  "paid report must use grouped human-readable evidence"
);

[
  "1. Гол зураглал",
  "2. Энэ дүгнэлт юунд тулгуурласан бэ?",
  "3. Таны хамгийн магадлалтай гол хэв маяг",
  "4. Гол биш боловч ажиглах хэрэгтэй зүйл",
  "5. Танд тохирох эхний стратеги",
  "6. Одоогоор юуг хийхгүй байх вэ?",
  "7. 7–14 хоногийн нэг хувьсагчийн туршилт",
  "8. Хэрэв дахин хазайвал яах вэ?",
  "9. Хэзээ мэргэжлийн хүнтэй ярилцах вэ? · Аюулгүй байдлын сануулга",
  "10. Товч дүгнэлт",
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
  "[REMOVED_FEATURE_REFINEMENT]",
  "[REMOVED_FEATURE_UPGRADE] төлөөд [REMOVED_FEATURE_REFINEMENT]"
].forEach(forbidden => {
  assert(!paidText.includes(forbidden), `paid report must not include teaser/upsell copy: ${forbidden}`);
});

assert(!/7\. 7–14 хоногийн нэг хувьсагчийн туршилт[\s\S]*7\. Тайлангаа хадгалах/.test(reportText), "save section must not reuse section numbering");

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
  removedEntries: [],
  stageVoiceSummaries: {}
});
const noCautionText = normalize(_internal.renderReport());
assert(noCautionText.includes("9. Хэзээ мэргэжлийн хүнтэй ярилцах вэ? · Аюулгүй байдлын сануулга"), "report should keep the WP85 safety/professional guidance");
assert(noCautionText.includes("Тайлангаа хадгалах"), "no-caution report still has save section");
assert(!/6\. Тайлангаа хадгалах|7\. Тайлангаа хадгалах/.test(noCautionText), "save section must be unnumbered when caution is absent");

assert(reportText.indexOf("9. Хэзээ мэргэжлийн хүнтэй ярилцах вэ? · Аюулгүй байдлын сануулга") < reportText.indexOf("Тайлангаа хадгалах"), "safety reminder must appear before save section");

console.log("paid-report-quality tests passed");
