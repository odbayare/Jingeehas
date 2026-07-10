const assert = require("assert");
const app = require("../app.js");

const {
  calculateMechanismEvidence,
  createConfirmedSummaryObject,
  mechanismNamesByKey,
  _internal
} = app;

const M = mechanismNamesByKey;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function confirmedDiary(day, structured, bullets) {
  return createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: day,
    rawText: `RAW_UNCONFIRMED_DIARY_${day}_SHOULD_NOT_APPEAR`,
    structured,
    aiSummaryBullets: bullets,
    mode: "confirm"
  });
}

function confirmedStage(id, bullets) {
  return createConfirmedSummaryObject({
    kind: "stage",
    id,
    rawText: `RAW_UNCONFIRMED_STAGE_${id}_SHOULD_NOT_APPEAR`,
    structured: {},
    aiSummaryBullets: bullets,
    mode: "confirm"
  });
}

function diary(day, overrides = {}, bullets = []) {
  const structured = {
    day_number: day,
    date: `2026-06-${String(day).padStart(2, "0")}`,
    meal_rhythm: "2-3 тогтмол хоол",
    unplanned_eating_count: "Тийм, 1 удаа",
    main_moment_time: "Орой",
    hunger_level: "5",
    food_function: ["Хамгийн амар сонголт байсан"],
    emotion: "Тайван",
    energy_score: "5",
    stress_score: "4",
    sleep: ["6-8 цаг"],
    movement: "Бага зэрэг алхсан",
    body_signals: ["Аль нь ч үгүй"],
    pattern_probes: {},
    ...overrides
  };
  return {
    ...structured,
    confirmedSummaryObject: confirmedDiary(day, structured, bullets.length ? bullets : ["Өдрийн бүтэцтэй хариулт баталгаажсан"])
  };
}

function repeat(count, makeEntry) {
  return Array.from({ length: count }, (_, index) => makeEntry(index + 1));
}

function buildState(persona) {
  const stageVoiceSummaries = {};
  (persona.stageSummaries || []).forEach(summary => {
    stageVoiceSummaries[summary.id] = confirmedStage(summary.id, summary.bullets);
  });
  return {
    packageType: persona.packageType,
    view: "report",
    stageAnswers: persona.stageAnswers || {},
    stageVoiceSummaries,
    preliminary: persona.preliminary || [],
    diaryEntries: persona.diaryEntries || []
  };
}

function runPersona(persona) {
  const initial = buildState(persona);
  _internal.setTestState(initial);
  if (!initial.preliminary.length) {
    _internal.setTestState({ ...initial, preliminary: _internal.rankedPatterns(false).slice(0, 4) });
  }
  const report = _internal.renderReport();
  const text = normalize(report);
  const evidence = calculateMechanismEvidence(_internal.getTestState());
  const ranked = _internal.rankedPatterns(true);
  return { report, text, evidence, ranked, mode: _internal.reportMode().mode };
}

function assertNoAiSmell(text, name) {
  [
    "S1-V",
    "D-SUM",
    "reportUse",
    "safetyTrigger",
    "high_hunger",
    "reward_pull",
    "food_as_regulation",
    "Self-report based",
    "Data Quality",
    "Primary Pattern",
    "Hidden Function",
    "Trigger ->",
    "100%",
    "сахилга батгүй",
    "залхуу",
    "өөрийгөө хяна",
    "эрүүл хооллож, хөдөлгөөнөө нэм",
    "RAW_UNCONFIRMED"
  ].forEach(value => assert(!text.includes(value), `${name}: forbidden visible string ${value}`));
  assert(!/\b\d{1,3}%\b/.test(text), `${name}: numeric confidence leaked`);
  assert(!/confidence|итгэлцэл/i.test(text), `${name}: confidence wording leaked`);
}

function mechanismPresent(evidence, expected) {
  return [].concat(expected || []).some(name =>
    evidence.primaryMechanism === name ||
    evidence.secondaryMechanisms.includes(name) ||
    evidence.supportingMechanisms.includes(name) ||
    evidence.mechanisms[name]?.score > 0
  );
}

const personas = [
  {
    id: "45m-office-executive-load",
    name: "45M Office Worker / Executive Load",
    packageType: "seven-day",
    stageAnswers: {
      "S1-C01": "45",
      "S1-C02": "Эрэгтэй",
      "S1-W01": "4-7 кг нэмсэн",
      "S1-W02": ["Ажил-стресс", "Хөдөлгөөн багассан", "Нойр муудсан"],
      "S1-W04": ["Орой хоол идэхгүй", "Ерөнхийдөө бага идэх"],
      "S1-M01": "Өглөө алгасах",
      "S1-M02": "3-4",
      "S1-F01": ["Ядарсан", "Хамгийн амар сонголт хэрэгтэй", "Өөрийгөө шагнамаар"],
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack", "Гэрт байсан амар сонголт"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"],
      "S1-N01": "4-6 цаг",
      "S1-B03": "Үгүй",
      "S1-S04": "Үгүй"
    },
    diaryEntries: repeat(5, day => diary(day, {
      meal_rhythm: day === 2 ? "2-3 тогтмол хоол" : "Хоолны хооронд 5+ цагийн зай гарсан",
      unplanned_eating_count: day === 2 ? "Үгүй" : "Тийм, 1 удаа",
      hunger_level: day === 2 ? "4" : "8",
      food_function: day === 4 ? ["Хүмүүсийн дунд татгалзах эвгүй байсан", "Амттай юм хүссэн"] : ["Хамгийн амар сонголт байсан", "Ядарсан", "Өөрийгөө шагнамаар байсан"],
      emotion: "Ядаргаа",
      energy_score: day === 2 ? "5" : "3",
      sleep: day === 4 ? ["Чанар муу"] : ["4-6 цаг"],
      drinks: day === 4 ? ["Согтууруулах ундаа"] : [],
      pattern_probes: { default_choice: day === 2 ? "Гэрт хоол байсан" : "Delivery" }
    }, ["Орой ядарсан үед delivery/default амар болсон", "Хоолны зай, оройн эрч хүч давхцсан"])),
    expectedMode: "deep",
    expectedPrimary: [M.executive, M.decisionDefault],
    expectedSecondary: [[M.circadian], [M.reward, M.rewardDeficit]],
    requiredText: ["Идэх хүсэл эхэлдэг нөхцөл", "Эхэлж өөрчлөх хамгийн амар цэг", "14 хоногийн туршилт"]
  },
  {
    id: "36f-mother-role-overload",
    name: "36F Mother / Role Overload + Reward Deficit",
    packageType: "seven-day",
    stageAnswers: {
      "S1-C01": "36",
      "S1-C02": "Эмэгтэй",
      "S1-W02": ["Ажил-стресс", "Нойр муудсан"],
      "S1-L03": ["Бусдын хэрэгцээ", "Цаг", "Ядаргаа"],
      "S1-R02": ["Өдрийн төгсгөлд өөрийгөө шагнах", "Ажлын дараах амралт"],
      "S1-E02": ["Ядаргаа", "Хоосон мэт мэдрэмж"],
      "S1-S04": "Үгүй"
    },
    stageSummaries: [{ id: "S1-V01", bullets: ["Хүүхдүүд унтсаны дараа өөрийн цаг эхэлдэг", "Орой reward хэрэгцээ нэмэгддэг", "Бусдын хэрэгцээ түрүүнд явдаг"] }],
    diaryEntries: repeat(5, day => diary(day, {
      food_function: ["Өөрийгөө шагнамаар байсан", "Ядарсан"],
      emotion: "Ядаргаа",
      energy_score: "2",
      stress_score: "6",
      pattern_probes: { role_overload: "Хүүхэд/гэр бүлийн хэрэгцээ түрүүлсэн" }
    }, ["Бусдын хэрэгцээ түрүүлсэн", "Орой өөрийн reward хэрэгцээ хоолтой холбогдсон"])),
    expectedMode: "deep",
    expectedPrimary: [M.rewardDeficit, M.reward, M.executive, M.roleOverload],
    expectedSecondary: [[M.roleOverload], [M.circadian, M.executive]],
    requiredText: ["Өөрийгөө хамгийн сүүлд", "өөрийн хоол, амралтын хамгаалагдсан жижиг зай", "Одоогоор зайлсхийх зүйлс", "14 хоногийн туршилт"]
  },
  {
    id: "28f-diet-cycler-collapse",
    name: "28F Diet Cycler / Control-Collapse",
    packageType: "one-time",
    stageAnswers: {
      "S1-C01": "28",
      "S1-C02": "Эмэгтэй",
      "S1-W03": "Бараг бүх оролдлогоос хойш",
      "S1-W04": ["Калори тоолох", "Мацаг", "Фитнес challenge"],
      "S1-W06": "Одоо бүх юм дууссан",
      "S1-X01": "Хэсэг сайн яваад дараа нь нурдаг",
      "S1-X03": "Маш хүчтэй",
      "S1-F02": "Одоо бүх юм дууссан",
      "S1-S04": "Үгүй"
    },
    stageSummaries: [{ id: "S1-V02", bullets: ["Нэг slip гарвал бүх plan дууссан мэт санагддаг", "Маргааш илүү чанга эхэлнэ гэж боддог", "Guilt/shame нэмэгддэг"] }],
    expectedMode: "deep",
    expectedPrimary: [M.collapse, M.identity],
    expectedSecondary: [[M.shameAvoidance, M.reward, M.hungerSafety]],
    requiredText: ["1. Гол зураглал", "7. 7–14 хоногийн нэг хувьсагчийн туршилт", "Тайлангаа хадгалах"]
  },
  {
    id: "40m-fasting-rebound",
    name: "40M Fasting Rebound / Hunger-Safety",
    packageType: "seven-day",
    stageAnswers: {
      "S1-C01": "40",
      "S1-C02": "Эрэгтэй",
      "S1-W04": ["Мацаг", "Орой хоол идэхгүй"],
      "S1-M01": "Өдөр бага идээд орой нөхөх",
      "S1-M02": "Бараг өдөр бүр",
      "S1-M03": "Хянахад хэцүү",
      "S1-G01": "Ихэвчлэн",
      "S1-G02": "Тийм",
      "S1-S04": "Үгүй"
    },
    diaryEntries: repeat(5, day => diary(day, {
      meal_rhythm: "Өдөр бага идээд орой нөхсөн",
      hunger_level: "9",
      food_function: ["Биеэрээ өлссөн", "Дараа өлсөхөөс санаа зовсон"],
      energy_score: "3"
    }, ["Өдөр хасах тусам орой rebound болсон", "Өндөр өлсөлт болон дараа өлсөхөөс хамгаалах мэдрэмж давхцсан"])),
    expectedMode: "deep",
    expectedPrimary: [M.hungerSafety],
    expectedSecondary: [[M.collapse, M.circadian]],
    requiredText: ["Урт мацаг", "тогтмол хоол", "14 хоногийн туршилт"]
  },
  {
    id: "33f-stress-eating",
    name: "33F Stress Eating / Food-as-Regulation",
    packageType: "seven-day",
    stageAnswers: {
      "S1-C01": "33",
      "S1-C02": "Эмэгтэй",
      "S1-E01": "Маш их нэмэгддэг",
      "S1-E02": ["Стресс", "Санаа зовнил", "Уур"],
      "S1-F01": ["Тайвширмаар", "Ядарсан"],
      "S1-F02": "Түр гайгүй болоод гэмшдэг",
      "S1-S04": "Үгүй"
    },
    diaryEntries: repeat(5, day => diary(day, {
      stress_score: "8",
      emotion: day % 2 ? "Стресс" : "Санаа зовнил",
      food_function: ["Тайвширмаар байсан"],
      hunger_level: "4"
    }, ["Стресс өндөр үед хоол түр тайвшруулсан", "Идсэний дараа түр хөнгөрсөн"])),
    expectedMode: "deep",
    expectedPrimary: [M.regulation],
    expectedSecondary: [[M.collapse, M.reward]],
    requiredText: ["Сэтгэл санааг түр тогтворжуулах", "14 хоногийн туршилт"]
  },
  {
    id: "31m-cue-delivery-default",
    name: "31M Cue/Delivery / Decision-Default",
    packageType: "one-time",
    stageAnswers: {
      "S1-C01": "31",
      "S1-C02": "Эрэгтэй",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L04": "Харагдвал бараг автоматаар иддэг",
      "S1-L05": "Маш хүчтэй",
      "S1-R02": ["Хоолны зураг эсвэл delivery", "Амт, мэдрэмж"],
      "S1-F01": ["Хоол хараад идмээр болсон", "Хамгийн амар сонголт хэрэгтэй"],
      "S1-S04": "Үгүй"
    },
    stageSummaries: [{ id: "S1-V01", bullets: ["Delivery app notification trigger болдог", "Гэрт snack харагдвал иддэг", "Хамгийн амар default ялдаг"] }],
    expectedMode: "deep",
    expectedPrimary: [M.cue, M.decisionDefault, M.executive, M.reward],
    expectedSecondary: [[M.decisionDefault, M.executive], [M.reward]],
    requiredText: ["1. Гол зураглал", "7. 7–14 хоногийн нэг хувьсагчийн туршилт", "Тайлангаа хадгалах"]
  },
  {
    id: "50f-medication-friction",
    name: "50F Medical/Medication Friction",
    packageType: "seven-day",
    stageAnswers: {
      "S1-C01": "50",
      "S1-C02": "Эмэгтэй",
      "S1-W02": ["Эм"],
      "S1-B02": "Тийм, санаа зовоосон",
      "S1-B03": "Тийм",
      "S1-B04": ["Маш их ядардаг"],
      "S1-S04": "Үгүй"
    },
    diaryEntries: repeat(5, day => diary(day, {
      meal_rhythm: "2-3 тогтмол хоол",
      hunger_level: "5",
      food_function: ["Мэдэхгүй"],
      body_signals: ["Аль нь ч үгүй"],
      pattern_probes: { measured_today: "Тийм, санаа зовоосон" }
    }, ["Эмийн хэрэглээ болон хэмжилтийн санаа зовнил байгаа", "биеийн талаа шалгах нь зөв"])),
    expectedMode: "professional",
    expectedPrimary: [M.medical, M.glucose],
    expectedSecondary: [[M.medical, M.glucose]],
    requiredText: ["Доорх богино нэгтгэлийг мэргэжлийн хүнтэй ярилцахдаа авч очиж болно."],
    suppressExperiment: true
  },
  {
    id: "24f-body-safety-shame",
    name: "24F Body-Safety / Shame",
    packageType: "one-time",
    stageAnswers: {
      "S1-C01": "24",
      "S1-C02": "Эмэгтэй",
      "S1-S02": "Ихэвчлэн",
      "S1-W06": "Би угаасаа чаддаггүй",
      "S1-F02": "Шууд гэмшдэг",
      "S1-X03": "Ихэвчлэн",
      "S1-S04": "Үгүй"
    },
    stageSummaries: [{ id: "S1-V03", bullets: ["Before/after зураг, body visibility тавгүй", "Идсэний дараа shame/guilt нэмэгддэг", "Public challenge-ээс зайлсхийдэг"] }],
    expectedMode: "professional",
    expectedPrimary: [M.bodySafety, M.shameAvoidance, M.collapse, M.identity],
    expectedSecondary: [[M.shameAvoidance, M.collapse]],
    requiredText: ["Доорх богино нэгтгэлийг мэргэжлийн хүнтэй ярилцахдаа авч очиж болно."],
    suppressExperiment: true
  },
  {
    id: "39m-social-alcohol",
    name: "39M Social/Alcohol Pattern",
    packageType: "seven-day",
    stageAnswers: {
      "S1-C01": "39",
      "S1-C02": "Эрэгтэй",
      "S1-F01": ["Хүмүүсийн дунд татгалзах эвгүй", "Амттай юм хүссэн"],
      "S1-R02": ["Ажлын дараах амралт", "Амт, мэдрэмж"],
      "S1-X01": "Уур/эсэргүүцэл",
      "S1-S04": "Үгүй"
    },
    diaryEntries: repeat(5, day => diary(day, {
      main_moment_time: day >= 4 ? "Хүмүүсийн дунд эсвэл арга хэмжээний үеэр" : "Орой",
      food_function: day >= 4 ? ["Хүмүүсийн дунд татгалзах эвгүй байсан", "Амттай юм хүссэн"] : ["Өөрийгөө шагнамаар байсан"],
      drinks: day >= 4 ? ["Согтууруулах ундаа"] : [],
      pattern_probes: { social_setting: day >= 4 ? "Тийм" : "Үгүй" }
    }, ["Найзуудтай үед татгалзах эвгүй", "Alcohol/snack availability нэмэгдсэн"])),
    expectedMode: "deep",
    expectedPrimary: [M.social, M.reward, M.autonomy],
    expectedSecondary: [[M.social], [M.autonomy, M.reward]],
    requiredText: ["Хүмүүсийн дунд", "14 хоногийн туршилт"]
  },
  {
    id: "42f-sleep-circadian",
    name: "42F Sleep/Circadian",
    packageType: "seven-day",
    stageAnswers: {
      "S1-C01": "42",
      "S1-C02": "Эмэгтэй",
      "S1-N01": "4-6 цаг",
      "S1-N02": "Маш тод",
      "S1-L01": "7 хоногт хэд хэд",
      "S1-F01": ["Ядарсан", "Амттай юм хүссэн"],
      "S1-S04": "Үгүй"
    },
    diaryEntries: repeat(5, day => diary(day, {
      sleep: ["4-6 цаг", "Чанар муу"],
      energy_score: "2",
      emotion: "Ядаргаа",
      food_function: ["Ядарсан", "Амттай юм хүссэн"],
      pattern_probes: { circadian_pull: "Маш тод" }
    }, ["Нойр муу үед оройн эрч хүч унасан", "Craving/default сонголт нэмэгдсэн"])),
    expectedMode: "deep",
    expectedPrimary: [M.circadian, M.executive, M.reward],
    expectedSecondary: [[M.circadian], [M.reward, M.executive]],
    requiredText: ["Оройн эрч хүч", "14 хоногийн туршилт"]
  }
];

function validatePersona(persona) {
  const result = runPersona(persona);
  assert.strictEqual(result.mode, persona.expectedMode, `${persona.name}: report mode`);
  assert(mechanismPresent(result.evidence, persona.expectedPrimary), `${persona.name}: expected primary/supporting mechanism missing`);
  (persona.expectedSecondary || []).forEach(expected => {
    assert(mechanismPresent(result.evidence, expected), `${persona.name}: expected secondary/supporting mechanism missing ${expected.join(" | ")}`);
  });
  (persona.requiredText || []).forEach(value => {
    if (result.text.includes(value)) return;
    assert(
      (result.text.includes("Гол зураг") && result.text.includes("Давтагддаг тойрог"))
        || (result.text.includes("Гол зураглал") && result.text.includes("Таны хамгийн магадлалтай гол хэв маяг")),
      `${persona.name}: missing new report voice structure for legacy text ${value}`
    );
  });
  assertNoAiSmell(result.text, persona.name);
  if (persona.packageType === "one-time" && !persona.suppressExperiment) {
    assert(!result.text.includes("7 хоногоор нарийвчлах"), `${persona.name}: WP62 one-time report should not mix in 7-day CTA`);
  }
  if (persona.packageType === "seven-day" && result.mode === "deep") {
    assert(result.text.includes("Яагаад ингэж хэлж байна вэ?"), `${persona.name}: evidence note missing`);
    assert(result.text.includes("14 хоногийн туршилт"), `${persona.name}: staged experiment missing`);
  }
  if (persona.suppressExperiment || ["professional", "urgent"].includes(result.mode)) {
    assert(!result.text.includes("<h3>14 хоногийн туршилт</h3>"), `${persona.name}: experiment should be suppressed`);
    assert(!result.text.includes("Миний pattern-ийг 7 хоногоор шалгах"), `${persona.name}: weight-loss CTA should be suppressed`);
  }
  if (result.mode !== "urgent") {
    assert(!result.text.includes("Одоо жин хасах тухай биш"), `${persona.name}: unexpected urgent route`);
  }
  return result;
}

function run() {
  assert.strictEqual(personas.length, 10, "expected exactly 10 personas");
  const failures = [];
  personas.forEach(persona => {
    try {
      validatePersona(persona);
      console.log(`PASS ${persona.name}`);
    } catch (error) {
      failures.push(`${persona.name}: ${error.message}`);
      console.error(`FAIL ${persona.name}: ${error.message}`);
    }
  });
  if (failures.length) {
    throw new Error(`Ten-person simulation audit failures:\n${failures.join("\n")}`);
  }
}

if (require.main === module) {
  run();
  console.log("ten-person-simulation-audit tests passed");
}

module.exports = { personas, runPersona, validatePersona, normalize };
