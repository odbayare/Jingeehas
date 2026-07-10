const assert = require("assert");
const app = require("../app.js");

const { createConfirmedSummaryObject, _internal } = app;

function summary(day, structured = {}) {
  const base = {
    meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
    unplanned_eating_count: "Тийм, 1 удаа",
    main_moment_time: "Орой",
    hunger_level: "8",
    food_function: ["Өөрийгөө шагнамаар байсан", "Хамгийн амар сонголт байсан"],
    emotion: "Ядаргаа",
    energy_score: "2",
    stress_score: "5",
    body_signals: ["Аль нь ч үгүй"],
    ...structured
  };
  return createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: day,
    rawText: `raw text ${day} should not appear`,
    structured: base,
    aiSummaryBullets: [
      "Хоолны хооронд 5+ цагийн зай гарсан",
      "Орой өлсөлт өндөр байсан",
      "Delivery хамгийн амар сонголт болсон",
      "Reward хүсэл давхцсан"
    ],
    mode: "confirm"
  });
}

function entry(day, overrides = {}) {
  const structured = {
    diary_id: `d-${day}`,
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
    raw_reflection: `UNCONFIRMED RAW ${day}`,
    pattern_probes: {},
    ...overrides
  };
  return { ...structured, confirmedSummaryObject: summary(day, structured) };
}

function entries(count, overrides = {}) {
  return Array.from({ length: count }, (_, index) => entry(index + 1, overrides));
}

function setSevenDay(nextState = {}) {
  _internal.setTestState({
    packageType: "seven-day",
    preliminary: [
      { key: "hungerSafety", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "executive", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    stageAnswers: {
      "S1-W04": ["Мацаг", "Орой хоол идэхгүй"]
    },
    diaryEntries: entries(5),
    ...nextState
  });
}

function run() {
  setSevenDay();
  const full = _internal.renderReport();
  [
    "Таны тайлан бэлэн боллоо",
    "Гол зураг",
    "Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?",
    "Давтагддаг тойрог",
    "Яагаад ингэж хэлж байна вэ?",
    "Гол буруу ойлголт",
    "Одоохондоо хэт яарахгүй зүйлс",
    "Хамгийн хялбар эхлэх цэг",
    "14 хоногийн туршилт"
  ].forEach(section => assert(full.includes(section), `missing ${section}`));

  assert(!full.includes("давтамжтай нийцэж байна"));
  assert(!full.includes("Таны идэлт дараах үүргүүдийг гүйцэтгэж байна"));
  assert(full.includes("Эхний 3 өдөр"));
  assert(full.includes("4-10 дахь өдөр"));
  assert(full.includes("11-14 дахь өдөр"));
  assert(full.includes("Хэрвээ нэг өдөр алгасвал"));
  assert(full.includes("Өдөр хоол холдоно") || full.includes("Өдөр олон зүйл шийдэж өнгөрнө"));
  assert(full.includes("Асуудал"));
  assert(full.includes("Урт мацаг"));
  assert(full.includes("тулгуур хоол") || full.includes("хоёр бэлэн зам"));
  assert(!full.includes("UNCONFIRMED RAW"));
  assert(!/confidence|итгэлцэл|82%/.test(full));
  assert(!full.includes("Trigger -> body"));

  setSevenDay({ diaryEntries: entries(3) });
  const limited = _internal.renderReport();
  assert(limited.includes("Хязгаартай эхний зураглал"));
  assert(!limited.includes("<h3>14 хоногийн туршилт</h3>"));

  setSevenDay({ diaryEntries: entries(4) });
  const usable = _internal.renderReport();
  assert(usable.includes("Ашиглаж болох ч хязгаартай зураглал"));
  assert(!usable.includes("<h3>14 хоногийн туршилт</h3>"));

  setSevenDay({ stageAnswers: { "S1-S03": "Одоо давтагддаг" }, diaryEntries: entries(5) });
  const professional = _internal.renderReport();
  assert(professional.includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"));
  assert(!professional.includes("Энэ зан үйл ямар үүрэгтэй байж болох вэ?"));
  assert(!professional.includes("14 хоногийн туршилт"));

  setSevenDay({ stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" }, diaryEntries: entries(5) });
  const urgent = _internal.renderReport();
  assert(urgent.includes("Яаралтай аюулгүй байдлын зөвлөмж"));
  assert(urgent.includes("Одоо жин хасах тухай биш"));
  assert(!urgent.includes("Энэ зан үйл ямар үүрэгтэй байж болох вэ?"));
  assert(!urgent.includes("14 хоногийн туршилт"));

  setSevenDay({
    stageAnswers: { "S1-W01": "4-7 кг нэмсэн", "S1-W02": ["Эм"] },
    diaryEntries: entries(5, { meal_rhythm: "Тогтвортой, хоол алгасаагүй" })
  });
  const mode2 = _internal.renderReport();
  assert(mode2.includes("Биеийн талаа давхар шалгах дохио байна"));
  assert(mode2.includes("Мэргэжлийн хүнтэй ярилцахад илүүдэхгүй"));
  assert(mode2.includes("Шалгуулахад илүүдэхгүй"));
  assert(mode2.includes("14 хоногийн туршилт"));

  _internal.setTestState({
    packageType: "one-time",
    stageAnswers: {
      "S1-W04": ["Мацаг"],
      "S1-M01": "Өдөр бага идээд орой нөхөх",
      "S1-F01": ["Дараа өлсөхөөс санаа зовсон", "Өөрийгөө шагнамаар"]
    },
    preliminary: [{ key: "hungerSafety", score: 5, label: "хүчтэй нийцэж байна" }],
    stageVoiceSummaries: {}
  });
  const oneTime = _internal.renderReport();
  assert(oneTime.includes("1. Гол зураглал"));
  assert(oneTime.indexOf("1. Гол зураглал") < oneTime.indexOf("2. Энэ дүгнэлт юунд тулгуурласан бэ?"));
  assert(oneTime.includes("2. Энэ дүгнэлт юунд тулгуурласан бэ?"));
  assert(oneTime.includes("3. Таны хамгийн магадлалтай гол хэв маяг"));
  assert(oneTime.includes("7. 7–14 хоногийн нэг хувьсагчийн туршилт"));
  assert(oneTime.includes("Тайлангаа хадгалах"));
  assert(!oneTime.includes("7 хоногоор нарийвчлах"));
  assert(!oneTime.includes("7 хоногийн тэмдэглэл юуг тодруулах вэ?"));
  assert(!oneTime.includes("Миний pattern-ийг 7 хоногоор шалгах"));
}

run();
console.log("report-bible-sections tests passed");
