const assert = require("assert");
const app = require("../app.js");

const { reportReadiness, diaryEntrySafetyFlags, calculateDiarySafetyFlags, _internal } = app;

function entry(overrides = {}) {
  return {
    day_number: 1,
    meal_rhythm: "Тогтвортой, хоол алгасаагүй",
    unplanned_eating_count: "Үгүй",
    stress_score: 3,
    energy_score: 6,
    sleep: ["6-8 цаг"],
    movement: "Бага зэрэг алхсан",
    body_signals: ["Аль нь ч үгүй"],
    pattern_probes: {},
    ...overrides
  };
}

function entries(count, overrides = {}) {
  return Array.from({ length: count }, (_, index) => entry({ day_number: index + 1, ...overrides }));
}

function setSevenDayState(nextState) {
  _internal.setTestState({
    packageType: "seven-day",
    preliminary: [{ key: "hungerSafety", score: 4, label: "дунд зэрэг нийцэж байна" }],
    ...nextState
  });
}

function run() {
  assert.deepStrictEqual(reportReadiness(entries(0)).canGenerateFullReport, false);
  assert.deepStrictEqual(reportReadiness(entries(1)).key, "insufficient");
  assert.deepStrictEqual(reportReadiness(entries(2)).key, "limited");
  assert.deepStrictEqual(reportReadiness(entries(3)).canShowExperiment, false);
  assert.deepStrictEqual(reportReadiness(entries(4)).key, "usable");
  assert.deepStrictEqual(reportReadiness(entries(4)).canGenerateFullReport, false);
  assert.deepStrictEqual(reportReadiness(entries(5)).canGenerateFullReport, true);
  assert.deepStrictEqual(reportReadiness(entries(5)).canShowExperiment, true);

  assert(diaryEntrySafetyFlags(entry({ body_signals: ["Будилах / ухаан балартах"] })).some(flag => flag.endsWith(":urgent")));
  assert(diaryEntrySafetyFlags(entry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })).some(flag => flag.endsWith(":professional")));
  assert(diaryEntrySafetyFlags(entry({ body_signals: ["Хавагнах"] })).some(flag => flag.endsWith(":professional")));
  assert(diaryEntrySafetyFlags(entry({ voice_confirmed_summary: "Өнөөдөр faint болсон юм шиг санагдсан" })).some(flag => flag.endsWith(":urgent")));
  assert(diaryEntrySafetyFlags(entry({ voice_confirmed_summary: "өөртөө хор хүргэх бодол идэвхтэй төрсөн" })).some(flag => flag.endsWith(":urgent")));
  assert(calculateDiarySafetyFlags(entries(2, { pattern_probes: { measured_today: "Тийм, бага/өндөр гарсан" } })).some(flag => flag.endsWith(":professional")));

  setSevenDayState({ diaryEntries: entries(1) });
  assert.strictEqual(_internal.reportMode().mode, "deep");
  assert(!_internal.renderReport().includes("<h3>14 хоногийн туршилт</h3>"));
  assert(_internal.renderReport().includes("Бүрэн тайлан гаргахад мэдээлэл хангалтгүй байна"));

  setSevenDayState({ diaryEntries: entries(3) });
  assert(!_internal.renderReport().includes("<h3>14 хоногийн туршилт</h3>"));
  assert(_internal.renderReport().includes("Хязгаартай эхний зураглал"));

  setSevenDayState({ diaryEntries: entries(4) });
  assert(!_internal.renderReport().includes("<h3>14 хоногийн туршилт</h3>"));
  assert(_internal.renderReport().includes("Ашиглаж болох ч хязгаартай зураглал"));

  setSevenDayState({ diaryEntries: entries(5) });
  assert(_internal.renderReport().includes("<h3>14 хоногийн туршилт</h3>"));

  setSevenDayState({ diaryEntries: [entry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] });
  assert.strictEqual(_internal.reportMode().mode, "professional");
  const professionalReport = _internal.renderReport();
  assert(professionalReport.includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"));
  assert(!professionalReport.includes("14 хоногийн туршилт"));
  assert(!professionalReport.includes("14 хоногийн эхний туршилт"));

  setSevenDayState({ diaryEntries: [entry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] });
  assert.strictEqual(_internal.reportMode().mode, "urgent");
  const urgentReport = _internal.renderReport();
  assert(urgentReport.includes("Яаралтай аюулгүй байдлын зөвлөмж"));
  assert(urgentReport.includes("Одоо жин хасах тухай биш"));
  assert(!urgentReport.includes("14 хоногийн туршилт"));
  assert(!urgentReport.includes("Эхний leverage point"));
}

run();
console.log("safety-readiness tests passed");
