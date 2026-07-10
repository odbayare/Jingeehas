const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

const genderSpecificPattern = /сарын тэмдэг|мөчлөг|жирэмсэн|жирэмслэлт|төрсний дараа|төрсний дараах|хөхүүл|цэвэршилт|PMS/i;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function questionText(stageAnswers) {
  _internal.setTestState({
    packageType: "one-time",
    stageAnswers,
    diaryDraft: {},
    diaryEntries: []
  });
  return _internal.stageQuestions()
    .flatMap(question => [question.id, question.text, question.intro, ...(question.options || [])])
    .filter(Boolean)
    .join(" | ");
}

const maleQuestions = questionText({ "S1-C02": "Эрэгтэй" });
assert(!genderSpecificPattern.test(maleQuestions), "male owner scenario must not show menstrual/cycle questions");

_internal.setTestState({
  packageType: "one-time",
  view: "report",
  oneTimePaid: true,
  sevenDayPaid: false,
  upgradePaid: false,
  stageAnswers: {
    "S1-C02": "Эрэгтэй",
    "S1-L03": ["Бусдын хэрэгцээ"],
    "S1-F01": ["Татгалзах эвгүй байсан", "Тайвширмаар байсан"],
    "S1-F02": "Түр гайгүй болоод гэмшдэг",
    "S1-V01": "Амралтын өдөр найзуудтай уулзахад татгалзах эвгүй. Даваа гарагт гэмшээд маргаашаас чанга барина гэж боддог.",
    "S1-S04": "Үгүй"
  },
  preliminary: [],
  diaryEntries: [],
  stageVoiceSummaries: {}
});

const reportText = normalize(_internal.renderReport());
const forbiddenBodyHeadline = ["Нэг зүйл тодорлоо", "биеийн талаа шалгахад илүүдэхгүй"].join(" — ");

[
  "Таны тайлан бэлэн боллоо",
  "1. Гол зураглал",
  "2. Энэ дүгнэлт юунд тулгуурласан бэ?",
  "3. Таны хамгийн магадлалтай гол хэв маяг",
  "5. Танд тохирох эхний стратеги",
  "7. 7–14 хоногийн нэг хувьсагчийн туршилт",
  "Тайлангаа хадгалах"
].forEach(section => {
  assert(reportText.includes(section), `owner report must read as one coherent paid report with section: ${section}`);
});

assert(/хүмүүсийн дунд|найз нөхөд|татгалзах эвгүй/.test(reportText), "owner report must focus on social pressure and refusal difficulty");
assert(reportText.includes("Гарахаасаа өмнө хэлэх нэг богино татгалзах өгүүлбэрээ бэлд"), "leverage point must be a pre-decided refusal phrase");
assert(!reportText.includes(forbiddenBodyHeadline), "owner report must not show the old body-check top headline without body risk");
assert(!reportText.includes("6. Болгоомжлох зүйл"), "owner report must not show body caution when no body-risk answer was selected");

[
  ["Эхний товч", "зураглал"].join(" "),
  ["Таны эхний", "ажиглалт"].join(" "),
  ["Гүн тайлангийн", "хэсэг"].join(" "),
  ["Төлбөртэй", "тайланд"].join(" "),
  "7 хоногоор нарийвчлах"
].forEach(forbidden => {
  assert(!reportText.includes(forbidden), `owner paid report must not mix teaser or upsell copy: ${forbidden}`);
});

console.log("owner-weekend-social-scenario tests passed");
