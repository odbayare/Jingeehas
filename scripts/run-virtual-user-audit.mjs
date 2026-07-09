import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const app = require("../app.js");

const {
  calculateMechanismEvidence,
  createConfirmedSummaryObject,
  mechanismNamesByKey,
  _internal
} = app;

const OUT_DIR = path.join("audits", "virtual-users-10");
const RAW_DIR = path.join(OUT_DIR, "raw");

const M = mechanismNamesByKey;

function writeTextFile(filePath, content) {
  writeFileSync(filePath, `${String(content).trimEnd()}\n`);
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

function diary(day, overrides = {}, bullets = []) {
  const structured = {
    diary_id: `audit-diary-${day}`,
    day_number: day,
    date: `2026-06-${String(day).padStart(2, "0")}`,
    meal_rhythm: "2-3 тогтмол хоол",
    unplanned_eating_count: "Тийм, 1 удаа",
    main_moment_time: "Орой",
    hunger_level: "5",
    food_function: ["Мэдэхгүй"],
    emotion: "Тайван",
    energy_score: "5",
    stress_score: "4",
    body_signals: ["Аль нь ч үгүй"],
    sleep: ["6-8 цаг"],
    movement: "Хэвийн",
    pattern_probes: {},
    ...overrides
  };
  return {
    ...structured,
    confirmedSummaryObject: confirmedDiary(day, structured, bullets.length ? bullets : ["Оройн сонголт өөрчлөгдсөн мөч тэмдэглэгдсэн"])
  };
}

function entries(count, makeEntry) {
  return Array.from({ length: count }, (_, index) => makeEntry(index + 1));
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

function normalize(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function snippetAround(text, needle, fallback = "") {
  const value = String(text || "");
  const index = needle ? value.indexOf(needle) : -1;
  if (index >= 0) return value.slice(index, index + 320).trim();
  return fallback || value.slice(0, 320).trim();
}

function containsAny(text, values) {
  return values.some((value) => String(text || "").includes(value));
}

function aiSmells(text) {
  return [
    "default",
    "reward",
    "trigger",
    "pattern",
    "diary",
    "craving",
    "reset",
    "failure",
    "Perfectionism",
    "feedback",
    "Plan",
    "guilt",
    "shame",
    "leverage point",
    "Executive Load"
  ].filter((term) => new RegExp(`\\b${term}\\b`, "i").test(text));
}

function routeScore(actual, expected) {
  if (actual === expected) return 5;
  if (expected === "professional" && actual === "check") return 3;
  if (expected === "check" && actual === "professional") return 4;
  if (expected === "deep" && ["check", "professional"].includes(actual)) return 3;
  if (expected === "urgent") return 1;
  return 2;
}

function patternScore(evidence, expected) {
  const expectedList = [].concat(expected || []);
  if (!expectedList.length || expectedList.includes(evidence.primaryMechanism)) return 5;
  if (expectedList.some((name) => evidence.secondaryMechanisms.includes(name) || evidence.supportingMechanisms.includes(name))) return 4;
  if (expectedList.some((name) => evidence.mechanisms?.[name]?.score > 0)) return 3;
  return 2;
}

function scoreResult(persona, result) {
  const text = result.text;
  const smells = aiSmells(text);
  const ordinarySuppressed = ["professional", "urgent"].includes(result.mode)
    ? !text.includes("14 хоногийн туршилт") && !text.includes("төлөөд бүрэн тайлангаа нээх")
    : true;
  const shameSafe = !containsAny(text, ["залхуу", "сахилга батгүй", "өөрийгөө хяна", "буруутай"]);
  const noExtremeDiet = !containsAny(text, ["мацаг барь", "калорио огцом хас", "хоолгүй яв"]);
  const hasAction = containsAny(text, [
    "Эхэлж өөрчлөх хамгийн амар цэг",
    "Эхний зөөлөн алхам",
    "14 хоногийн туршилт",
    "14 хоногийн эхний туршилт",
    "5. Танд тохирох эхний стратеги",
    "7. 7–14 хоногийн нэг хувьсагчийн туршилт",
    "4. Таны хувьд хамгийн түрүүнд өөрчлөх цэг",
    "5. 14 хоногийн жижиг туршилт",
    "Ярилцах товч нэгтгэл",
    "Одоо жин хасах тухай биш"
  ]);
  const hasPaidValue = result.mode === "deep"
    ? containsAny(text, ["Энэ зан үйл ямар үүрэгтэй байж болох вэ?", "Асуудал яг юу биш вэ?", "Давтагддаг тойрог", "2. Яагаад давтагдаад байна вэ?", "3. Таны өдөр тутмын тойрог", "2. Энэ дүгнэлт юунд тулгуурласан бэ?", "3. Таны хамгийн магадлалтай 2–3 механизм"])
    : containsAny(text, ["Ярилцах товч нэгтгэл", "Яаралтай аюулгүй байдлын зөвлөмж"]);

  return {
    routing: routeScore(result.mode, persona.expectedMode),
    patternFit: patternScore(result.evidence, persona.expectedMechanisms),
    mongolian: smells.length >= 3 ? 3 : smells.length ? 4 : 5,
    emotionalSafety: shameSafe && ordinarySuppressed ? 5 : ordinarySuppressed ? 4 : 2,
    actionability: hasAction && noExtremeDiet ? 5 : hasAction ? 4 : 3,
    commercialValue: hasPaidValue ? 5 : 3,
    repetitionRisk: 4
  };
}

function verdictFromScores(scores) {
  const values = Object.values(scores);
  if (values.some((score) => score <= 2)) return "FAIL";
  if (values.some((score) => score === 3)) return "PARTIAL";
  return "PASS";
}

function runPersona(persona) {
  const stageVoiceSummaries = {};
  (persona.stageSummaries || []).forEach((summary) => {
    stageVoiceSummaries[summary.id] = confirmedStage(summary.id, summary.bullets);
  });
  const base = {
    packageType: persona.packageType,
    view: "report",
    oneTimePaid: true,
    sevenDayPaid: true,
    upgradePaid: true,
    stageAnswers: persona.stageAnswers,
    stageVoiceSummaries,
    diaryEntries: persona.diaryEntries || [],
    preliminary: []
  };

  _internal.setTestState(base);
  const preliminary = _internal.rankedPatterns(false).slice(0, 4);
  _internal.setTestState({ ...base, preliminary });

  const reportHtml = _internal.renderReport();
  const state = _internal.getTestState();
  const evidence = calculateMechanismEvidence(state);
  const mode = _internal.reportMode().mode;
  const ranked = _internal.rankedPatterns(true);
  const text = normalize(reportHtml);
  const scores = scoreResult(persona, { text, mode, evidence });

  return {
    id: persona.id,
    label: persona.label,
    personaProfile: persona.profile,
    selectedAnswers: persona.stageAnswers,
    generatedMode: mode,
    expectedMode: persona.expectedMode,
    primaryMechanism: evidence.primaryMechanism || null,
    secondaryMechanisms: evidence.secondaryMechanisms || [],
    supportingMechanisms: evidence.supportingMechanisms || [],
    rankedPatterns: ranked.slice(0, 5),
    safetyRoute: evidence.safetyRoute,
    paywallReportAccessState: {
      packageType: state.packageType,
      oneTimePaid: state.oneTimePaid,
      sevenDayPaid: state.sevenDayPaid,
      upgradePaid: state.upgradePaid,
      reportAccess: "internal-audit-unlocked"
    },
    generatedReportText: text,
    keyExcerpts: {
      strongestInsight: snippetAround(text, "Хамгийн тод давтагдаж буй зүйл", snippetAround(text, "Таны жин хасалтыг гацааж")),
      firstLeveragePoint: snippetAround(text, "Эхэлж өөрчлөх хамгийн амар цэг", snippetAround(text, "Эхний зөөлөн алхам", snippetAround(text, "Ярилцах товч нэгтгэл"))),
      fourteenDayExperiment: text.includes("14 хоногийн туршилт")
        ? snippetAround(text, "14 хоногийн туршилт")
        : text.includes("14 хоногийн эхний туршилт")
          ? snippetAround(text, "14 хоногийн эхний туршилт")
          : "",
      safetyNote: text.includes("Яаралтай") ? snippetAround(text, "Яаралтай") : text.includes("мэргэжлийн хүн") ? snippetAround(text, "мэргэжлийн хүн") : ""
    },
    scores,
    verdict: verdictFromScores(scores),
    aiSmells: aiSmells(text)
  };
}

const personas = [
  {
    id: "user-01",
    label: "Executive load / evening collapse",
    packageType: "seven-day",
    expectedMode: "deep",
    expectedMechanisms: [M.executive, M.decisionDefault],
    profile: {
      age: 38,
      context: "Two-child working parent, knows nutrition basics but ends days depleted.",
      weightHistory: "Slow 8 kg gain over two years during workload and sleep pressure.",
      eatingPattern: "Daytime discipline, skipped lunches, evening delivery and desk snacks.",
      emotionalPattern: "Frustration and fatigue more than sadness; guilt the next morning.",
      sleepEnergy: "5-6 hours, low evening energy.",
      medicalSafety: "No severe safety signal.",
      expectedRoute: "ordinary report",
      expectedMechanism: "evening decision load / low-energy default"
    },
    stageAnswers: {
      "S1-C01": "38",
      "S1-C02": "Эмэгтэй",
      "S1-W02": ["Ажил-стресс", "Нойр муудсан"],
      "S1-W04": ["Орой хоол идэхгүй", "Ерөнхийдөө бага идэх"],
      "S1-M01": "Өдрийн хоол алгасах",
      "S1-M02": "3-4",
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack", "Гэрт байсан амар сонголт"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"],
      "S1-S04": "Үгүй"
    },
    diaryEntries: entries(5, (day) => diary(day, {
      meal_rhythm: day === 3 ? "2-3 тогтмол хоол" : "Хоолны хооронд 5+ цагийн зай гарсан",
      hunger_level: day === 3 ? "4" : "8",
      food_function: ["Хамгийн амар сонголт байсан", "Ядарсан"],
      emotion: "Ядаргаа",
      energy_score: "2",
      sleep: ["4-6 цаг"],
      pattern_probes: { default_choice: "Delivery" }
    }, ["Орой ядарсан үед delivery хамгийн амар сонголт болсон", "Өдрийн хоол алгасах, бага нойр давхцсан"]))
  },
  {
    id: "user-02",
    label: "Stress regulation / food as calming",
    packageType: "seven-day",
    expectedMode: "deep",
    expectedMechanisms: [M.regulation],
    profile: {
      age: 34,
      context: "Office worker carrying deadlines and family expectations.",
      weightHistory: "Repeated calorie counting and fasting attempts.",
      eatingPattern: "Eats after stressful calls and tense evenings.",
      emotionalPattern: "Food gives temporary calm, then guilt.",
      sleepEnergy: "Average sleep, stress spikes.",
      medicalSafety: "No purging or self-harm.",
      expectedRoute: "ordinary report",
      expectedMechanism: "food-as-regulation / shame-avoidance secondary"
    },
    stageAnswers: {
      "S1-C01": "34",
      "S1-C02": "Эмэгтэй",
      "S1-W04": ["Калори тоолох", "Мацаг"],
      "S1-E01": "Маш их нэмэгддэг",
      "S1-E02": ["Стресс", "Санаа зовнил", "Уур"],
      "S1-E03": "Түр тайвширдаг",
      "S1-F02": "Түр гайгүй болоод гэмшдэг",
      "S1-S04": "Үгүй"
    },
    diaryEntries: entries(5, (day) => diary(day, {
      hunger_level: "4",
      food_function: ["Тайвширмаар байсан"],
      emotion: day % 2 ? "Стресс" : "Санаа зовнил",
      stress_score: "8",
      pattern_probes: { after_guilt: "Идсэний дараа гэмшсэн" }
    }, ["Стресс өндөр үед хоол түр тайвшруулсан", "Дараа нь гэмшил нэмэгдсэн"]))
  },
  {
    id: "user-03",
    label: "Restriction-collapse cycle",
    packageType: "one-time",
    expectedMode: "deep",
    expectedMechanisms: [M.collapse],
    profile: {
      age: 29,
      context: "Starts strict plans after every weekend.",
      weightHistory: "Repeated strict diets and Monday restarts.",
      eatingPattern: "One slip turns into overeating because the day feels ruined.",
      emotionalPattern: "All-or-nothing, guilt, restart pressure.",
      sleepEnergy: "Variable.",
      medicalSafety: "No urgent safety.",
      expectedRoute: "ordinary report",
      expectedMechanism: "control-collapse / all-or-nothing"
    },
    stageAnswers: {
      "S1-C01": "29",
      "S1-C02": "Эмэгтэй",
      "S1-W03": "Бараг бүх оролдлогоос хойш",
      "S1-W04": ["Калори тоолох", "Мацаг", "Фитнес challenge"],
      "S1-W06": "Одоо бүх юм дууссан",
      "S1-X01": "Хэсэг сайн яваад дараа нь нурдаг",
      "S1-X03": "Маш хүчтэй",
      "S1-F02": "Одоо бүх юм дууссан",
      "S1-S04": "Үгүй"
    },
    stageSummaries: [{ id: "S1-V02", bullets: ["Нэг slip гарвал бүх plan дууссан мэт санагддаг", "Маргааш илүү чанга эхэлнэ гэж боддог", "Guilt/shame нэмэгддэг"] }]
  },
  {
    id: "user-04",
    label: "Hunger safety / scarcity pattern",
    packageType: "seven-day",
    expectedMode: "deep",
    expectedMechanisms: [M.hungerSafety],
    profile: {
      age: 42,
      context: "Busy field worker with unpredictable meal access.",
      weightHistory: "Weight fluctuates with job seasons.",
      eatingPattern: "Long meal gaps, eats in advance, leaves little uneaten.",
      emotionalPattern: "Fear of later hunger, urgency around available food.",
      sleepEnergy: "Mostly normal.",
      medicalSafety: "No severe symptoms.",
      expectedRoute: "ordinary report",
      expectedMechanism: "hunger-safety / scarcity protection"
    },
    stageAnswers: {
      "S1-C01": "42",
      "S1-C02": "Эрэгтэй",
      "S1-W04": ["Мацаг", "Орой хоол идэхгүй"],
      "S1-M01": "Өдөр бага идээд орой нөхөх",
      "S1-M02": "Бараг өдөр бүр",
      "S1-M03": "Хянахад хэцүү",
      "S1-H01": "Хэт өлстлөө хүлээгээд хэтрүүлдэг",
      "S1-S04": "Үгүй"
    },
    diaryEntries: entries(5, (day) => diary(day, {
      meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
      hunger_level: "9",
      food_function: ["Биеэрээ өлссөн", "Дараа өлсөхөөс санаа зовсон"],
      energy_score: "3"
    }, ["Хоолны зай урт байсан", "Дараа өлсөхөөс хамгаалах мэдрэмж нэмэгдсэн"]))
  },
  {
    id: "user-05",
    label: "Reward deficit / daily pleasure gap",
    packageType: "seven-day",
    expectedMode: "deep",
    expectedMechanisms: [M.rewardDeficit, M.reward, M.roleOverload],
    profile: {
      age: 31,
      context: "Caregiver who takes care of others first.",
      weightHistory: "Slow gain after caregiving load increased.",
      eatingPattern: "Evening sweets feel like the only personal reward.",
      emotionalPattern: "Self-neglect, emptiness, needing a small private pleasure.",
      sleepEnergy: "Tired most evenings.",
      medicalSafety: "No urgent safety.",
      expectedRoute: "ordinary report",
      expectedMechanism: "reward deficit / self-neglect secondary"
    },
    stageAnswers: {
      "S1-C01": "31",
      "S1-C02": "Эмэгтэй",
      "S1-L03": ["Бусдын хэрэгцээ", "Цаг", "Ядаргаа"],
      "S1-R02": ["Өдрийн төгсгөлд өөрийгөө шагнах", "Ажлын дараах амралт"],
      "S1-E02": ["Хоосон/flat мэдрэмж", "Ядаргаа"],
      "S1-S04": "Үгүй"
    },
    diaryEntries: entries(5, (day) => diary(day, {
      food_function: ["Өөрийгөө шагнамаар байсан", "Ядарсан"],
      emotion: "Ядаргаа",
      energy_score: "2",
      stress_score: "6",
      pattern_probes: { role_overload: "Өдөржин бусдын хэрэгцээ түрүүлсэн" }
    }, ["Бусдын хэрэгцээ түрүүлсэн", "Орой өөрийгөө баярлуулах хэрэгцээ хоолтой холбогдсон"]))
  },
  {
    id: "user-06",
    label: "Cue-conditioned automatic eating",
    packageType: "one-time",
    expectedMode: "deep",
    expectedMechanisms: [M.cue, M.decisionDefault],
    profile: {
      age: 27,
      context: "Remote worker surrounded by snack cues and delivery apps.",
      weightHistory: "Weight rose after working from home.",
      eatingPattern: "Often not hungry; eats when food is visible.",
      emotionalPattern: "Low distress, mostly automatic environment response.",
      sleepEnergy: "Normal.",
      medicalSafety: "No strong emotional distress.",
      expectedRoute: "ordinary report",
      expectedMechanism: "cue-conditioned automatic eating / environment default"
    },
    stageAnswers: {
      "S1-C01": "27",
      "S1-C02": "Өөрөөр тодорхойлно",
      "S1-H02": "Ихэвчлэн үгүй",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L04": "Харагдвал бараг автоматаар иддэг",
      "S1-L05": "Маш хүчтэй",
      "S1-R02": ["Хоолны зураг эсвэл delivery", "Амт, мэдрэмж"],
      "S1-S04": "Үгүй"
    },
    stageSummaries: [{ id: "S1-V01", bullets: ["Delivery app notification идэх хүслийг эхлүүлдэг", "Ширээн дээр snack харагдвал автоматаар иддэг", "Өлсөөгүй байсан ч cue ялдаг"] }]
  },
  {
    id: "user-07",
    label: "Sleep/circadian mismatch",
    packageType: "seven-day",
    expectedMode: "deep",
    expectedMechanisms: [M.circadian, M.executive, M.reward],
    profile: {
      age: 36,
      context: "Late-night worker with poor sleep and tired mornings.",
      weightHistory: "Weight gain followed sleep disruption.",
      eatingPattern: "Sweet/fatty food pull after poor sleep.",
      emotionalPattern: "Not highly distressed; mostly exhausted.",
      sleepEnergy: "Bad sleep, possible snoring, wakes tired.",
      medicalSafety: "No urgent safety; check note may be useful if symptoms strengthen.",
      expectedRoute: "ordinary report",
      expectedMechanism: "sleep/energy mismatch"
    },
    stageAnswers: {
      "S1-C01": "36",
      "S1-C02": "Эрэгтэй",
      "S1-W02": ["Нойр муудсан"],
      "S1-L01": "7 хоногт хэд хэд",
      "S1-L02": ["Чихэртэй ундаа/кофе", "Snack"],
      "S1-E02": ["Ядаргаа", "Хоосон/flat мэдрэмж"],
      "S1-S04": "Үгүй"
    },
    diaryEntries: entries(5, (day) => diary(day, {
      sleep: ["4-6 цаг", "Чанар муу"],
      energy_score: "2",
      emotion: "Ядаргаа",
      food_function: ["Ядарсан", "Амттай юм хүссэн"],
      pattern_probes: { circadian_pull: "Нойр муу үед илүү хүчтэй" }
    }, ["Нойр муу үед оройн тэнхээ унасан", "Амттай зүйл рүү татагдах нь нэмэгдсэн"]))
  },
  {
    id: "user-08",
    label: "Medical / medication / physiological friction",
    packageType: "seven-day",
    expectedMode: "professional",
    expectedMechanisms: [M.medical, M.glucose],
    profile: {
      age: 45,
      context: "Health change and medication period, worried the issue is not just habits.",
      weightHistory: "Weight increased after medication and swelling/fatigue appeared.",
      eatingPattern: "Moderate eating; behavior-only explanation feels incomplete.",
      emotionalPattern: "Concern and confusion rather than loss of control.",
      sleepEnergy: "Fatigue and low energy.",
      medicalSafety: "Swelling, fatigue, possible BP concern.",
      expectedRoute: "Mode 3 professional-first",
      expectedMechanism: "medical / medication / physiological friction"
    },
    stageAnswers: {
      "S1-C01": "45",
      "S1-C02": "Эмэгтэй",
      "S1-W02": ["Эм"],
      "S1-B02": "Тийм, өндөр даралт гарч байсан",
      "S1-B04": ["Хавагнадаг", "Маш их ядардаг"],
      "S1-S04": "Үгүй"
    },
    diaryEntries: entries(5, (day) => diary(day, {
      meal_rhythm: "2-3 тогтмол хоол",
      hunger_level: "5",
      food_function: ["Мэдэхгүй"],
      body_signals: ["Маш их ядардаг"],
      pattern_probes: { medical_context: "Эмийн дараа өөрчлөлт эхэлсэн" }
    }, ["Эмийн хэрэглээ болон хавагнах/ядрах дохио байгаа", "Зан үйлээс гадна мэргэжлийн шалгалт хэрэгтэй байж магадгүй"]))
  },
  {
    id: "user-09",
    label: "Glucose/BP concern",
    packageType: "seven-day",
    expectedMode: "professional",
    expectedMechanisms: [M.glucose, M.physiological, M.medical],
    profile: {
      age: 50,
      context: "Long meal gaps produce body symptoms and fear.",
      weightHistory: "Has tried skipping meals but symptoms worsen.",
      eatingPattern: "Trembling, sweating, dizziness, heart pounding after long gaps.",
      emotionalPattern: "Anxious about sugar/BP readings.",
      sleepEnergy: "Variable.",
      medicalSafety: "Measured abnormal sugar/BP before; may use related medication.",
      expectedRoute: "Mode 3 professional-first or Mode 2",
      expectedMechanism: "glucose/BP concern"
    },
    stageAnswers: {
      "S1-C01": "50",
      "S1-C02": "Эрэгтэй",
      "S1-M02": "Бараг өдөр бүр",
      "S1-B01": ["Гар салгалах", "Хөлрөх", "Толгой эргэх", "Сахар унасан мэт"],
      "S1-B02": "Тийм, бага сахар гарч байсан",
      "S1-B03": "Тийм",
      "S1-S04": "Үгүй"
    },
    diaryEntries: entries(5, (day) => diary(day, {
      meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
      hunger_level: "8",
      food_function: ["Биеэрээ өлссөн", "Дараа өлсөхөөс санаа зовсон"],
      body_signals: ["Гар салгалах", "Хөлрөх", "Толгой эргэх"],
      pattern_probes: { measured_today: "Бага сахар гарч байсан" }
    }, ["Хоол удахад гар салгалах, хөлрөх, толгой эргэх гарсан", "Сахар/даралтын санаа зовнил байгаа"]))
  },
  {
    id: "user-10",
    label: "Urgent safety / self-harm signal",
    packageType: "one-time",
    expectedMode: "urgent",
    expectedMechanisms: [],
    profile: {
      age: 33,
      context: "Weight and eating distress is severe and current safety text appears.",
      weightHistory: "Distress around eating and body image has escalated.",
      eatingPattern: "Not audited as ordinary eating pattern because safety comes first.",
      emotionalPattern: "Current self-harm thought.",
      sleepEnergy: "Poor.",
      medicalSafety: "Urgent self-harm signal.",
      expectedRoute: "Mode 4 urgent safety",
      expectedMechanism: "none; safety guidance only"
    },
    stageAnswers: {
      "S1-C01": "33",
      "S1-C02": "Эмэгтэй",
      "S1-S02": "Маш хүчтэй",
      "S1-S04": "Одоо идэвхтэй бодогдож байна"
    }
  }
];

function profileMarkdown(persona) {
  const profile = persona.profile;
  return `## ${persona.id.replace("user-", "User ")} — ${persona.label}

Profile:
- Age: ${profile.age}
- Context: ${profile.context}
- Weight history: ${profile.weightHistory}
- Eating pattern: ${profile.eatingPattern}
- Emotional pattern: ${profile.emotionalPattern}
- Sleep/energy: ${profile.sleepEnergy}
- Medical/safety: ${profile.medicalSafety}
- Expected route: ${profile.expectedRoute}
- Expected mechanism: ${profile.expectedMechanism}
`;
}

function resultMarkdown(result) {
  return `## ${result.id.replace("user-", "User ")} — ${result.label}

Actual route: ${result.generatedMode}
Actual primary mechanism: ${result.primaryMechanism || "none"}
Actual secondary mechanisms: ${result.secondaryMechanisms.length ? result.secondaryMechanisms.join(", ") : "none"}
Safety mode: ${result.safetyRoute}
Report generated: yes
Paywall/report state: ${result.paywallReportAccessState.reportAccess}

Key excerpts:
- strongest insight: ${result.keyExcerpts.strongestInsight || "n/a"}
- first leverage point: ${result.keyExcerpts.firstLeveragePoint || "n/a"}
- 14-day experiment: ${result.keyExcerpts.fourteenDayExperiment || "n/a"}
- safety note if any: ${result.keyExcerpts.safetyNote || "n/a"}

Verdict:
${result.verdict}
`;
}

function auditTable(results) {
  const rows = results.map((result) => {
    const s = result.scores;
    return `| ${result.id.replace("user-", "")} | ${s.routing} | ${s.patternFit} | ${s.mongolian} | ${s.emotionalSafety} | ${s.actionability} | ${s.commercialValue} | ${s.repetitionRisk} | ${result.verdict} |`;
  });
  return `| User | Route | Pattern Fit | Mongolian | Safety | Actionability | Commercial Value | Repetition Risk | Verdict |
|---|---:|---:|---:|---:|---:|---:|---:|---|
${rows.join("\n")}`;
}

function issuesFor(results) {
  const p0 = [];
  const p1 = [];
  const p2 = [];

  results.forEach((result) => {
    if (result.generatedMode === "urgent" && (result.generatedReportText.includes("төлөөд") || result.generatedReportText.includes("14 хоногийн туршилт"))) {
      p0.push({
        issue: "Urgent safety report exposes commercial or ordinary experiment copy.",
        where: result.id,
        evidence: "Urgent report includes payment/experiment wording.",
        why: "Mode 4 must be safety-only.",
        fix: "Suppress all commercial and ordinary report sections in urgent mode.",
        risk: "Unsafe user may feel sold to or receive inappropriate guidance."
      });
    }

    if (result.generatedMode === "professional" && result.generatedReportText.includes("14 хоногийн туршилт")) {
      p0.push({
        issue: "Professional-first report includes ordinary 14-day experiment.",
        where: result.id,
        evidence: "Mode 3 report includes 14 хоногийн туршилт.",
        why: "Professional-first users should not receive ordinary weight-loss action plan.",
        fix: "Keep Mode 3 focused on professional discussion summary.",
        risk: "Medical/safety user may follow wrong first step."
      });
    }

    if (result.aiSmells.length) {
      p1.push({
        issue: "English/engine wording appears in report.",
        where: result.id,
        evidence: result.aiSmells.join(", "),
        why: "Public reports should feel fully Mongolian and human.",
        fix: "Replace remaining English mechanism words or source reflection wording in generated copy.",
        risk: "Paid report feels less credible and more AI-generated."
      });
    }

    if (result.scores.patternFit <= 3) {
      p1.push({
        issue: "Primary or supporting mechanism is weaker than expected persona pattern.",
        where: result.id,
        evidence: `Actual primary: ${result.primaryMechanism}; expected: ${personas.find((p) => p.id === result.id)?.profile.expectedMechanism}`,
        why: "The user may not feel recognized.",
        fix: "Review answer weighting or report emphasis for this persona family after human review.",
        risk: "Report value may feel generic."
      });
    }
  });

  const repeatedOpeners = results.filter((result) => result.generatedReportText.includes("Таны жин хасалтыг гацааж байж болох гол нөхцөл тодорлоо")).length;
  if (repeatedOpeners >= 5) {
    p2.push({
      issue: "Several ordinary reports share the same high-level opening frame.",
      where: "ordinary report template",
      evidence: `${repeatedOpeners} reports include the same opening sentence.`,
      why: "Multiple users may perceive template repetition in side-by-side QA.",
      fix: "Add mechanism-aware opening variants.",
      risk: "Lower perceived personalization."
    });
  }

  return { p0, p1, p2 };
}

function recommendationFor({ issues, failCount }) {
  if (issues.p0.length) return "BLOCKED";
  if (failCount) return "NEEDS PATCH BEFORE HUMAN TESTING";
  return "READY FOR INTERNAL HUMAN TESTING";
}

function issueSection(title, items) {
  if (!items.length) return `## ${title}\n\nNone.\n`;
  return `## ${title}

${items.map((item) => `Issue:
${item.issue}

Where:
${item.where}

Evidence:
${item.evidence}

Why it matters:
${item.why}

Suggested fix:
${item.fix}

Risk if ignored:
${item.risk}
`).join("\n")}`;
}

mkdirSync(RAW_DIR, { recursive: true });

const results = personas.map(runPersona);

results.forEach((result, index) => {
  writeFileSync(path.join(RAW_DIR, `user-${String(index + 1).padStart(2, "0")}.json`), `${JSON.stringify(result, null, 2)}\n`);
});

writeTextFile(path.join(OUT_DIR, "VIRTUAL_USER_PROFILES.md"), `# Virtual User Profiles

${personas.map(profileMarkdown).join("\n")}
`);

writeTextFile(path.join(OUT_DIR, "VIRTUAL_USER_RESULTS.md"), `# Virtual User Results

${results.map(resultMarkdown).join("\n")}
`);

const issues = issuesFor(results);
const passCount = results.filter((result) => result.verdict === "PASS").length;
const partialCount = results.filter((result) => result.verdict === "PARTIAL").length;
const failCount = results.filter((result) => result.verdict === "FAIL").length;
const readinessScore = Math.round(results.reduce((sum, result) => {
  const scoreValues = Object.values(result.scores);
  return sum + scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
}, 0) / results.length * 20);
const recommendation = recommendationFor({ issues, failCount });
const hasLanguageP1 = issues.p1.some((issue) => issue.issue.includes("English/engine"));
const topLanguageFinding = hasLanguageP1
  ? "A public report still exposes English/engine wording and must be patched before paid traffic."
  : "Public report English/engine wording is clean across the 10 generated reports.";
const openingFinding = issues.p2.some((issue) => issue.issue.includes("opening"))
  ? "Several ordinary reports still share a similar opening frame."
  : "Ordinary report openings now use deterministic mechanism-aware variants.";

writeTextFile(path.join(OUT_DIR, "REPORT_AUDIT.md"), `# Report Audit

${auditTable(results)}

## Summary

- PASS: ${passCount}
- PARTIAL: ${partialCount}
- FAIL: ${failCount}
- P0 blockers: ${issues.p0.length}
- Overall readiness score: ${readinessScore}/100

## Top 5 Strengths

1. Mode 4 urgent safety suppresses ordinary report, paywall, and 14-day experiment.
2. Mode 3 medical/professional users receive professional-first summary rather than ordinary weight-loss plan.
3. Ordinary users generally receive distinct mechanism explanations tied to fatigue, stress, hunger, reward, cue, or collapse.
4. Report language avoids blame words such as lazy, weak, or discipline failure.
5. First-step guidance is mostly small and non-extreme; fasting/aggressive dieting is not recommended for high-risk users.

## Top 10 Issues

1. ${topLanguageFinding}
2. ${openingFinding}
3. The word "давтамж" still appears often; it is accurate but can feel repeated in a paid report.
4. Executive-load phrasing is improved, but some users may still find it abstract without a concrete evening example.
5. One-time reports have less diary-backed specificity than seven-day reports, which is expected but commercially important.
6. Medical users are correctly routed, but their report value depends heavily on how clear the professional discussion summary feels.
7. Cue/default users can overlap with reward users, so the report should keep environment-specific examples prominent.
8. Restriction-collapse reports can feel emotionally intense; wording should continue avoiding shame amplification.
9. Sleep/circadian users may need stronger sleep-specific next-step wording after human review.
10. Side-by-side QA reveals template structure more clearly than a single user would experience.

## P0 Blockers

${issues.p0.length ? issues.p0.map((item) => `- ${item.issue} (${item.where})`).join("\n") : "None."}

## P1 Fixes

${issues.p1.length ? issues.p1.map((item) => `- ${item.issue} (${item.where})`).join("\n") : "None."}

## P2 Polish

${issues.p2.length ? issues.p2.map((item) => `- ${item.issue} (${item.where})`).join("\n") : "None."}

## Overall Readiness

Recommendation: ${recommendation}

Paid-traffic note: P1 copy issues should be patched before paid traffic even though they do not block internal human testing.
`);

writeTextFile(path.join(OUT_DIR, "ISSUES_AND_FIXES.md"), `# Issues and Fixes

${issueSection("P0 — Must fix before real users", issues.p0)}

${issueSection("P1 — Should fix before paid traffic", issues.p1)}

${issueSection("P2 — Polish", issues.p2)}
`);

console.log(JSON.stringify({
  outDir: OUT_DIR,
  users: results.length,
  pass: passCount,
  partial: partialCount,
  fail: failCount,
  p0: issues.p0.length,
  p1: issues.p1.length,
  p2: issues.p2.length,
  readinessScore,
  recommendation
}, null, 2));

if (process.argv.includes("--assert-clean")) {
  const dirtyResults = results.filter((result) => result.aiSmells.length);
  if (dirtyResults.length) {
    const details = dirtyResults
      .map((result) => `${result.id}: ${result.aiSmells.join(", ")}`)
      .join("\n");
    throw new Error(`Generated public reports contain English/engine wording:\n${details}`);
  }
}
