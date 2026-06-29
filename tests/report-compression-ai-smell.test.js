const assert = require("assert");
const app = require("../app.js");

const { createConfirmedSummaryObject, _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function sectionText(html, title) {
  const marker = `<h3>${title}</h3>`;
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const rest = html.slice(start + marker.length);
  const next = rest.search(/<div class="report-section">|<div class="actions">/);
  return normalize(next >= 0 ? rest.slice(0, next) : rest);
}

function countListItemsInSection(html, title) {
  const marker = `<h3>${title}</h3>`;
  const start = html.indexOf(marker);
  if (start < 0) return 0;
  const rest = html.slice(start + marker.length);
  const next = rest.search(/<div class="report-section">|<div class="actions">/);
  const section = next >= 0 ? rest.slice(0, next) : rest;
  return (section.match(/<li>/g) || []).length;
}

function stageSummary(id, structured, bullets) {
  return createConfirmedSummaryObject({
    kind: "stage",
    id,
    rawText: "RAW_DEBUG_TEXT_SHOULD_NOT_APPEAR",
    structured,
    aiSummaryBullets: bullets,
    mode: "confirm"
  });
}

function setOneTimeReward() {
  const stageAnswers = {
    "S1-R01": "Өдөрт олон удаа",
    "S1-R02": ["Уйдал", "Амт-мэдрэмж", "Food зураг-delivery"],
    "S1-H02": "Ихэвчлэн үгүй",
    "S1-V01": "Өлсөөгүй үед нэг гоё юм хүсдэг. Food зураг харахаар идмээр болдог."
  };
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    stageAnswers,
    stageVoiceSummaries: {
      "S1-V01": stageSummary("S1-V01", stageAnswers, [
        "Өлсөөгүй үед нэг гоё юм хүсдэг",
        "Food зураг cue trigger болдог",
        "Reward хүсэл давтагддаг"
      ])
    },
    preliminary: [{ key: "reward", score: 5, label: "хүчтэй нийцэж байна" }],
    diaryEntries: []
  });
}

function setOneTimeMode2() {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    stageAnswers: {
      "S1-R01": "7 хоногт хэд хэд",
      "S1-R02": ["Амт-мэдрэмж"],
      "S1-W01": "4-7 кг нэмсэн",
      "S1-W02": ["Эм"],
      "S1-B01": ["Сахар унасан мэт", "Толгой эргэх"]
    },
    preliminary: [{ key: "reward", score: 4, label: "дунд зэрэг нийцэж байна" }],
    diaryEntries: []
  });
}

function setMode3() {
  _internal.setTestState({
    packageType: "seven-day",
    view: "report",
    stageAnswers: { "S1-B03": "Тийм" },
    diaryEntries: Array.from({ length: 5 }, (_, index) => ({
      day_number: index + 1,
      meal_rhythm: "2-3 тогтмол хоол",
      unplanned_eating_count: "Тийм, 1 удаа",
      food_function: ["Амттай юм хүссэн"],
      hunger_level: "4",
      energy_score: "5",
      stress_score: "3",
      body_signals: ["Аль нь ч үгүй"],
      pattern_probes: {}
    }))
  });
}

function run() {
  setOneTimeReward();
  const oneTimeHtml = _internal.renderReport();
  const oneTime = normalize(oneTimeHtml);

  ["S1-V01", "S1-V02", "D-V01", "high_hunger", "reward_pull", "food_as_regulation", "low_hunger_craving", "D03", "reportUse", "RAW_DEBUG_TEXT"].forEach(value => {
    assert(!oneTime.includes(value), `one-time report leaked debug evidence: ${value}`);
  });

  assert(!oneTime.includes("давтамжтай нийцэж байна"));
  assert(countListItemsInSection(oneTimeHtml, "Тэр үед хоол танд юу өгч байсан байж болох вэ?") <= 3);
  assert(countListItemsInSection(oneTimeHtml, "Одоогоор болгоомжлох зүйлс") <= 5);
  assert(countListItemsInSection(oneTimeHtml, "7 хоногоор нарийвчлах") <= 3);
  assert(!oneTime.includes("Trigger зураглал"));
  assert(!oneTime.includes("Before-Eating 30 Minutes"));
  assert(!oneTime.includes("After-Eating 30 Minutes"));
  assert(!oneTime.includes("Мэдээлэл хангалтгүй"));
  assert(!oneTime.includes("Self-report based."));
  assert(!oneTime.includes("trigger timing"));
  assert(!oneTime.includes("before/after eating pattern"));
  assert(!/Reward-Seeking[^.]{0,80}шалгуулах дохио/.test(oneTime));
  assert(sectionText(oneTimeHtml, "Асуудал яг юу биш вэ?").length > 20);
  assert(!sectionText(oneTimeHtml, "Асуудал яг юу биш вэ?").includes("давтамжтай нийцэж байна"));
  assert(!oneTime.includes("Мэргэжлийн хүнтэй ярилцахад илүүдэхгүй хэсэг"));

  setOneTimeMode2();
  const mode2 = normalize(_internal.renderReport());
  assert(mode2.includes("Мэргэжлийн хүнтэй ярилцахад илүүдэхгүй хэсэг"));
  assert(mode2.includes("онош гэсэн үг биш"));
  assert(mode2.includes("энэ туршилтыг мацаг, хоол алгасах, огцом хязгаарлалтгүй зөөлөн эхлүүлнэ"));
  assert(!/Reward-Seeking[^.]{0,80}шалгуулах дохио/.test(mode2));

  setMode3();
  const mode3 = normalize(_internal.renderReport());
  assert(mode3.includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"));
  assert(mode3.includes("Ярилцах товч нэгтгэл"));
  assert(!mode3.includes("14 хоногийн туршилт"));
  assert(!mode3.includes("Your primary pattern"));
  assert(!mode3.includes("Trigger зураглал"));
}

run();
console.log("report-compression-ai-smell tests passed");
