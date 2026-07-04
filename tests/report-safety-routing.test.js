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
const mildBodyCaution = "6. Болгоомжлох зүйл";

const normalSocial = paidReport({
  "S1-C02": "Эрэгтэй",
  "S1-L03": ["Бусдын хэрэгцээ"],
  "S1-F01": ["Татгалзах эвгүй байсан", "Тайвширмаар байсан"],
  "S1-F02": "Түр гайгүй болоод гэмшдэг",
  "S1-S04": "Үгүй"
});

assert(normalSocial.replace(/^Тайлан\s+/, "").startsWith("Таны тайлан бэлэн боллоо"), "normal paid report must start with the main paid headline");
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

assert(bodyRisk.replace(/^Тайлан\s+/, "").startsWith("Таны тайлан бэлэн боллоо"), "safety copy must not replace the main paid headline");
assert(!bodyRisk.includes(forbiddenBodyHeadline), "body-risk report must not use the old body-check top headline");
assert(bodyRisk.includes(mildBodyCaution), "mild caution must appear when body-risk flags exist");
assert(
  bodyRisk.indexOf(mildBodyCaution) > bodyRisk.indexOf("5. 14 хоногийн жижиг туршилт"),
  "mild caution must stay as a short separate section after the main report"
);
assert(!/мацаг барь|удаан өлс|огцом хязгаарлалт хий|огцом хас гэж/i.test(bodyRisk), "body-risk report must not recommend fasting or extreme restriction");

console.log("report-safety-routing tests passed");
