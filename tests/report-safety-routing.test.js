const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function paidReport(stageAnswers) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers,
    preliminary: [],
    diaryEntries: [],
    stageVoiceSummaries: {}
  });
  return normalize(_internal.renderReport());
}

const forbiddenBodyHeadline = ["Нэг зүйл тодорлоо", "биеийн талаа шалгахад илүүдэхгүй"].join(" — ");
const mildBodyCaution = "хоолоо огцом хасахгүй";

const normalSocial = paidReport({
  "S1-C02": "Эрэгтэй",
  "S1-L03": ["Бусдын хэрэгцээ"],
  "S1-F01": ["Татгалзах эвгүй байсан", "Тайвширмаар байсан"],
  "S1-F02": "Түр гайгүй болоод гэмшдэг",
  "S1-S04": "Үгүй"
});

assert(normalSocial.replace(/^Тайлан\s+/, "").startsWith("1. Гол зураглал"), "normal paid report must start with the main case formulation");
assert(!normalSocial.includes(forbiddenBodyHeadline), "normal report must not start with the old body-check headline");
assert(!normalSocial.includes(mildBodyCaution), "body-check section must not appear without body-risk flags");
assert(!/мацаг барь|удаан өлс|огцом хязгаарлалт хий|огцом хас гэж/i.test(normalSocial), "report must not recommend fasting or extreme restriction");

const bodyRisk = paidReport({
  "S1-C02": "Эрэгтэй",
  "S1-B01": ["Гар салгалах"],
  "S1-F01": ["Тайвширмаар байсан"],
  "S1-F02": "Тайвширдаг",
  "S1-S04": "Үгүй"
});

assert(bodyRisk.replace(/^Тайлан\s+/, "").startsWith("1. Гол зураглал"), "safety copy must not replace the main paid case formulation");
assert(!bodyRisk.includes(forbiddenBodyHeadline), "body-risk report must not use the old body-check top headline");
assert(bodyRisk.includes(mildBodyCaution), "mild caution must appear when body-risk flags exist");
assert(
    bodyRisk.indexOf(mildBodyCaution) > bodyRisk.indexOf("8. 7–14 хоногийн туршилт"),
  "mild caution must stay as a short separate section after the main report"
);
assert(!/мацаг барь|удаан өлс|огцом хязгаарлалт хий|огцом хас гэж/i.test(bodyRisk), "body-risk report must not recommend fasting or extreme restriction");

const professionalSafety = paidReport({
  "S1-C02": "Эмэгтэй",
  "S1-B05": "Хөхүүл",
  "S1-B02": "Тийм, санаа зовоосон",
  "MC-GATE": "Тийм, хамаарна",
  "MC-06": ["Төрсний дараах эсвэл хөхүүл үе"],
  "S1-S04": "Үгүй"
});

[
  "Эхлээд мэргэжлийн хүнтэй ярилцах нь зөв байна",
  "1. Яагаад ердийн жин хасалтын туршилт өгөхгүй байна вэ?",
  "2. Ярилцах товч нэгтгэл",
  "3. Ойрын 7 хоногт юуг ажиглах вэ?",
  "4. Одоогоор юунаас зайлсхийх вэ?",
  "Тайлангаа хадгалах",
  "Тайлан хуулж авах",
  "Хэвлэх / PDF хадгалах"
].forEach(section => {
  assert(professionalSafety.includes(section), `professional safety route must include ${section}`);
});
assert(!professionalSafety.includes("7. 7–14 хоногийн туршилт"), "professional route must not produce ordinary 14-day experiment");
assert(!/онош тав|эмчилгээ|өвчтэй|сахилга батгүй|мацаг барь|огцом хас гэж/i.test(professionalSafety), "professional safety route must avoid diagnosis/treatment/shame/extreme diet claims");
assert(!professionalSafety.includes("qpay-create-invoice"), "professional route must not expose QPay create endpoint");
assert(!professionalSafety.includes("qpay-check-payment"), "professional route must not expose QPay check endpoint");
assert(professionalSafety.length > 900, "professional route must provide paid report value, not a dead-end sentence");

console.log("report-safety-routing tests passed");
