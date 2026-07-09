const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function renderedChoiceSurfaces() {
  return normalize([
    _internal.renderLanding(),
    _internal.renderAbout(),
    _internal.renderChoice(),
    _internal.renderSevenDayStart()
  ].join("\n"));
}

function setOneTimeReport() {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "decisionDefault", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    stageVoiceSummaries: {},
    diaryEntries: []
  });
}

function setMode2Report() {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    stageAnswers: {
      "S1-W01": "4-7 кг нэмсэн",
      "S1-W02": ["Эм"],
      "S1-B01": ["Сахар унасан мэт", "Толгой эргэх"]
    },
    preliminary: [{ key: "executive", score: 4, label: "дунд зэрэг нийцэж байна" }],
    stageVoiceSummaries: {},
    diaryEntries: []
  });
}

function setMode3Report() {
  _internal.setTestState({
    packageType: "seven-day",
    view: "report",
    stageAnswers: { "S1-B03": "Тийм" },
    diaryEntries: Array.from({ length: 5 }, (_, index) => ({
      day_number: index + 1,
      meal_rhythm: "2-3 тогтмол хоол",
      unplanned_eating_count: "Үгүй",
      food_function: ["Хамгийн амар сонголт байсан"],
      hunger_level: "4",
      energy_score: "5",
      stress_score: "3",
      body_signals: ["Аль нь ч үгүй"],
      pattern_probes: {}
    }))
  });
}

function assertNoPressureCopy(text) {
  [
    "жинхэнэ шалтгаанаа нээ",
    "100%",
    "заавал",
    "оношоо харах",
    "Бүрэн үнэн тайлан"
  ].forEach(phrase => {
    assert(!text.includes(phrase), `pressure phrase should be absent: ${phrase}`);
  });
}

function run() {
  const choiceText = renderedChoiceSurfaces();

  [
    "Нэг удаагийн зураглал нь эхний тайлан өгнө",
    "Хамгийн тод давтагддаг нөхцөл",
    "Давхар нөлөөлж буй 1–2 зүйл",
    "Тэр идэлт тухайн үед юуг намдааж эсвэл нөхөж байж болох",
    "Одоогоор зайлсхийх зүйлс",
    "Эхний зөөлөн алхам",
    "14 хоногийн эхний туршилт"
  ].forEach(copy => assert(choiceText.includes(copy), `choice copy missing: ${copy}`));

  [
    "Орой бүр 3–5 минут",
    "5 өдөр бөглөсөн ч тайлан гарна",
    "Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш",
    "калори тоолохгүй",
    "давтагддаг мөчүүдийг ажиглана",
    "Энэ нь илүү их тураах төлөвлөгөө биш"
  ].forEach(copy => assert(choiceText.includes(copy), `7-day effort copy missing: ${copy}`));

  [
    "Тайлан ямар харагдах вэ?",
    "Жишээ үр дүн",
    "Хамгийн тод харагдаж буй зүйл",
    "Энэ юу гэсэн үг вэ?",
    "Эхний зөөлөн алхам",
    "7 хоногоор нарийвчилбал",
    "Орой ядарсан үед хоол бодож, сонгож, бэлдэх тэнхээ үлдэхгүй байна."
  ].forEach(copy => assert(choiceText.includes(copy), `sample preview missing: ${copy}`));

  assertNoPressureCopy(choiceText);

  setOneTimeReport();
  const oneTimeText = normalize(_internal.renderReport());
  assert(oneTimeText.includes("1. Гол зураглал"));
  assert(oneTimeText.includes("3. Таны хамгийн магадлалтай 2–3 механизм"));
  assert(oneTimeText.includes("7. 7–14 хоногийн нэг хувьсагчийн туршилт"));
  assert(!oneTimeText.includes("7 хоногийн тэмдэглэл юуг тодруулах вэ?"));
  assert(!oneTimeText.includes("7 хоногоор нарийвчлах"));
  assert(!oneTimeText.includes("Миний pattern-ийг 7 хоногоор шалгах"));
  assertNoPressureCopy(oneTimeText);

  setMode2Report();
  const mode2Text = normalize(_internal.renderReport());
  assert(mode2Text.includes("онош биш"));
  assert(mode2Text.includes("9. Хэзээ мэргэжлийн хүнтэй ярилцах вэ?"));
  assert(mode2Text.includes("хоолоо огцом хасахгүй"));

  setMode3Report();
  const mode3Text = normalize(_internal.renderReport());
  assert(mode3Text.includes("ердийн жин хасалтын туршилт өгөхгүй"));
  assert(mode3Text.includes("Доорх богино нэгтгэлийг мэргэжлийн хүнтэй ярилцахдаа авч очиж болно."));
  assert(mode3Text.includes("онош гэсэн үг биш"));
}

run();
console.log("sample-preview-choice-clarity tests passed");
