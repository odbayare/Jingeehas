const assert = require("assert");
const app = require("../app.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function renderPaidReport(stageAnswers, extras = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    internalTest: true,
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-C01": "35",
      "S1-C02": "Эрэгтэй",
      "S1-S04": "Үгүй",
      ...stageAnswers
    },
    preliminary: [],
    diaryEntries: [],
    stageVoiceSummaries: {},
    ...extras
  });
  return normalize(_internal.renderReport());
}

function run() {
  const alcoholLoop = renderPaidReport({
    "S1-W04": ["Завсарлагатай мацаг / мацаг барих", "Алхалт нэмэх"],
    "S1-W06": "Маргааш илүү чанга барина гэж боддог",
    "S1-F01": ["Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон", "Ядарсан"],
    "S1-A01": "7 хоногт 1–2 удаа хэрэглэдэг",
    "S1-A02": ["Зууш, шарсан эсвэл давслаг зүйл нэмэгддэг", "Нойр муудаж, маргааш хоолны хэмнэл алдагддаг"],
    "S1-A03": ["Давслаг, шөлтэй, тослог хоол хүсдэг", "Маргааш нь хоолоо илүү чанга барина гэж боддог"],
    "S1-MV01": ["Алхалт"],
    "S1-MV02": "Ядаргаа"
  });

  [
    "1. Гол зураглал",
    "2. Энэ дүгнэлт юунд тулгуурласан бэ?",
    "3. Таны хамгийн магадлалтай 2–3 механизм",
    "4. Гол биш боловч ажиглах хэрэгтэй зүйл",
    "5. Танд тохирох эхний стратеги",
    "6. Одоогоор юуг хийхгүй байх вэ?",
    "7. 7–14 хоногийн нэг хувьсагчийн туршилт",
    "8. Хэрэв дахин хазайвал яах вэ?",
    "9. Хэзээ мэргэжлийн хүнтэй ярилцах вэ?",
    "10. Товч дүгнэлт",
    "1–3 дахь өдөр",
    "4–10 дахь өдөр",
    "11–14 дахь өдөр"
  ].forEach(section => {
    assert(alcoholLoop.includes(section), `report should include ${section}`);
  });

  assert(alcoholLoop.includes("Согтууруулах ундаа after-effect loop"), "report should infer alcohol after-effect loop");
  assert(alcoholLoop.includes("Согтууруулах ундаа өөрөө илчлэгтэй."), "report should explain alcohol carefully");
  assert(alcoholLoop.includes("маргааш нь хэт чанга барих"), "report should warn against overcorrection");
  assert(alcoholLoop.includes("Алхалт"), "report should preserve movement feasibility context");
  assert(!alcoholLoop.includes(["Day", "1–3"].join(" ")), "report must not use English day labels");
  assert(!alcoholLoop.includes("Гол гацалт Гол гацалт"), "report must not duplicate old heading");
  assert(!/(→|↓)\s*4\./.test(alcoholLoop), "report must not contain stray trailing number in a cycle map");
  assert(!alcoholLoop.includes("WP64"), "report must not leak protected marker");

  const tobaccoContext = renderPaidReport({
    "S1-F01": ["Тайвширмаар санагдсан"],
    "S1-E01": "Нэлээд давтагддаг",
    "S1-T01": "Өдөр бүр татдаг",
    "S1-T02": ["Стресстэй үед тамхи, кофе, зууш хамт давхцдаг"]
  });
  assert(tobaccoContext.includes("Tobacco/coffee/snack context loop"), "report should infer tobacco context");
  assert(tobaccoContext.includes("Энэ нь тамхийг жин барих арга болго гэсэн зөвлөгөө огт биш."), "report must not encourage smoking");

  const safetyFirst = renderPaidReport({
    "S1-B01": ["Будилах/ухаан балартах"],
    "S1-S04": "Одоо идэвхтэй бодогдож байна"
  }, {
    safetyFlags: ["S1-S04:urgent"]
  });
  assert(safetyFirst.includes("Одоо жин хасах тухай биш"), "urgent safety route should suppress ordinary report");
  assert(!safetyFirst.includes("7. 7–14 хоногийн туршилт"), "urgent route must not show ordinary experiment");
}

run();
console.log("wp78 report inference quality tests passed");
