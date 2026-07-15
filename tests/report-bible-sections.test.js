const assert = require("assert");
const app = require("../app.js");
const { _internal } = app;

function setOneTime(stageAnswers = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    stageAnswers,
    preliminary: [{ key: "hungerSafety", score: 5, label: "хүчтэй нийцэж байна" }],
    stageVoiceSummaries: {}
  });
}

setOneTime({
  "S1-W04": ["Мацаг"],
  "S1-M01": "Өдөр бага идээд орой нөхөх",
  "S1-F01": ["Дараа өлсөхөөс санаа зовсон", "Өөрийгөө шагнамаар"]
});
const report = _internal.renderReport();
[
  "1. Гол зураглал",
  "2. Энэ дүгнэлт юунд тулгуурласан бэ?",
  "3. Таны хамгийн магадлалтай гол хэв маяг",
  "4. Гол биш боловч ажиглах хэрэгтэй зүйл",
  "5. Танд тохирох эхний стратеги",
  "6. Одоогоор юуг хийхгүй байх вэ?",
  "7. 7–14 хоногийн нэг хувьсагчийн туршилт",
  "8. Хэрэв дахин хазайвал яах вэ?",
  "9. Хэзээ мэргэжлийн хүнтэй ярилцах вэ?",
  "10. Товч дүгнэлт",
  "Тайлангаа хадгалах"
].forEach(section => assert(report.includes(section), `missing ${section}`));
assert(report.indexOf("1. Гол зураглал") < report.indexOf("2. Энэ дүгнэлт юунд тулгуурласан бэ?"));
assert(!report.includes("[REMOVED_FEATURE_PRICE]"));
assert(!report.includes("[REMOVED_FEATURE_UPGRADE]"));

setOneTime({ "S1-S03": "Одоо давтагддаг" });
const professional = _internal.renderReport();
assert.strictEqual(_internal.reportMode().mode, "professional");
assert(professional.includes("мэргэжлийн хүнтэй"));
assert(!professional.includes("Бүрэн тайлан нээх"));

setOneTime({ "S1-S04": "Одоо идэвхтэй бодогдож байна" });
const urgent = _internal.renderReport();
assert.strictEqual(_internal.reportMode().mode, "urgent");
assert(urgent.includes("Одоо жин хасах тухай биш"));
assert(!urgent.includes("QPay"));
console.log("report-bible-sections tests passed");
