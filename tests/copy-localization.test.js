const assert = require("assert");
const app = require("../app.js");

const { createConfirmedSummaryObject, _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function entry(day, overrides = {}) {
  const structured = {
    diary_id: `copy-${day}`,
    day_number: day,
    date: "2026-06-23",
    meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
    unplanned_eating_count: "Тийм, 1 удаа",
    main_moment_time: "Орой",
    hunger_level: "8",
    food_function: ["Өөрийгөө шагнамаар байсан", "Хамгийн амар сонголт байсан"],
    emotion: "Ядаргаа",
    energy_score: "2",
    stress_score: "5",
    sleep: ["6-8 цаг"],
    movement: "Бага зэрэг алхсан",
    body_signals: ["Аль нь ч үгүй"],
    pattern_probes: {},
    ...overrides
  };
  return {
    ...structured,
    confirmedSummaryObject: createConfirmedSummaryObject({
      kind: "diary",
      id: "D-V01",
      dayNumber: day,
      rawText: "RAW DEBUG SHOULD NOT RENDER",
      structured,
      aiSummaryBullets: ["Орой өлсөлт өндөр байсан", "Default сонголт нөлөөлсөн"],
      mode: "confirm"
    })
  };
}

function setOneTimeReward() {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    stageAnswers: {
      "S1-R01": "Өдөрт олон удаа",
      "S1-R02": ["Уйдал", "Өдрийн төгсгөлд өөрийгөө шагнах", "Хоолны зураг эсвэл delivery"],
      "S1-H02": "Ихэвчлэн үгүй"
    },
    preliminary: [{ key: "reward", score: 5, label: "хүчтэй нийцэж байна" }],
    stageVoiceSummaries: {},
    diaryEntries: []
  });
}

function setSevenDayFull() {
  _internal.setTestState({
    packageType: "seven-day",
    view: "report",
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "decisionDefault", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack"]
    },
    diaryEntries: Array.from({ length: 5 }, (_, index) => entry(index + 1))
  });
}

function renderedSurfaces() {
  const surfaces = [];
  setOneTimeReward();
  surfaces.push(_internal.renderReport());
  setSevenDayFull();
  surfaces.push(_internal.renderReport());
  _internal.setTestState({
    packageType: "seven-day",
    view: "report",
    stageAnswers: {
      "S1-W01": "4-7 кг нэмсэн",
      "S1-W02": ["Эм"],
      "S1-B01": ["Сахар унасан мэт", "Толгой эргэх"]
    },
    diaryEntries: Array.from({ length: 5 }, (_, index) => entry(index + 1, {
      body_signals: ["Аль нь ч үгүй"],
      meal_rhythm: "Тогтвортой, хоол алгасаагүй"
    }))
  });
  surfaces.push(_internal.renderReport());
  _internal.setTestState({
    packageType: "seven-day",
    view: "report",
    stageAnswers: { "S1-B03": "Тийм" },
    diaryEntries: Array.from({ length: 5 }, (_, index) => entry(index + 1))
  });
  surfaces.push(_internal.renderReport());
  _internal.setTestState({
    packageType: "seven-day",
    view: "report",
    stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
    diaryEntries: Array.from({ length: 5 }, (_, index) => entry(index + 1))
  });
  surfaces.push(_internal.renderReport());
  return normalize(surfaces.join("\n"));
}

function run() {
  const text = renderedSurfaces();

  [
    "Data Quality",
    "Initial vs Observed",
    "Primary Pattern",
    "Secondary Patterns",
    "Surface Behaviors",
    "Hidden Function",
    "Cycle Map",
    "Before-Eating",
    "After-Eating",
    "Professional Check"
  ].forEach(value => assert(!text.includes(value), `raw English heading rendered: ${value}`));

  [
    "TODO",
    "placeholder",
    "dummy",
    "checkpoint",
    "D-SUM",
    "S1-V",
    "reportUse",
    "safetyTrigger",
    "RAW DEBUG"
  ].forEach(value => assert(!text.includes(value), `debug/developer copy rendered: ${value}`));

  [
    "Self-report based",
    "daily давтамж",
    "trigger timing",
    "before/after eating pattern",
    "full-report eligible"
  ].forEach(value => assert(!text.includes(value), `mixed copy rendered: ${value}`));

  [
    "Таны гүн зураглал бэлэн боллоо",
    "Гол зураг",
    "Тэр үед хоол танд юу өгч байсан байж болох вэ?",
    "Давтагддаг тойрог",
    "Үүнийг юунаас харсан бэ?",
    "Асуудал яг юу биш вэ?",
    "Одоогоор болгоомжлох зүйлс",
    "Эхний жижиг өөрчлөлт",
    "14 хоногийн туршилт",
    "Мэргэжлийн хүнтэй ярилцахад илүүдэхгүй дохио"
  ].forEach(value => assert(text.includes(value), `localized heading missing: ${value}`));

  const source = require("fs").readFileSync(require("path").join(__dirname, "..", "app.js"), "utf8");
  assert(source.includes("Тайлбар хадгалагдлаа"));
  assert(!source.includes("Reflection-д бүтэцтэй context хараахан бага байна"));
}

run();
console.log("copy-localization tests passed");
