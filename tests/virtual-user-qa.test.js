const assert = require("assert");
const app = require("../app.js");

const {
  calculateMechanismEvidence,
  createConfirmedSummaryObject,
  mechanismNamesByKey,
  _internal
} = app;

const M = mechanismNamesByKey;

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

function diary(day, overrides = {}, bullets = null) {
  const structured = {
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
    movement: "Хэвийн",
    pattern_probes: {},
    ...overrides
  };
  const confirmedSummaryObject = Object.prototype.hasOwnProperty.call(overrides, "confirmedSummaryObject")
    ? overrides.confirmedSummaryObject
    : (bullets ? confirmedDiary(day, structured, bullets) : undefined);
  return { ...structured, confirmedSummaryObject };
}

function repeatEntries(count, makeEntry) {
  return Array.from({ length: count }, (_, index) => makeEntry(index + 1));
}

function baseState(scenario) {
  const stageVoiceSummaries = {};
  (scenario.stageSummaries || []).forEach(summary => {
    stageVoiceSummaries[summary.id] = confirmedStage(summary.id, summary.bullets);
  });
  return {
    packageType: scenario.packageType || "seven-day",
    view: "report",
    stageAnswers: scenario.stageAnswers || {},
    stageVoiceSummaries,
    preliminary: scenario.preliminary || [],
    diaryEntries: scenario.diaryEntries || []
  };
}

function normalize(text) {
  return String(text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function runAssessmentScenario(scenario) {
  const state = baseState(scenario);
  _internal.setTestState(state);
  if (!state.preliminary.length) {
    const preliminary = _internal.rankedPatterns(false).slice(0, 4);
    _internal.setTestState({ ...state, preliminary });
  }
  const report = _internal.renderReport();
  const evidence = calculateMechanismEvidence(_internal.getTestState());
  const mode = _internal.reportMode().mode;
  const ranked = _internal.rankedPatterns(true);
  return { state: _internal.getTestState(), report, text: normalize(report), evidence, mode, ranked };
}

function assertAnyIncludes(text, expected, label) {
  const values = [].concat(expected || []);
  if (!values.length) return;
  assert(values.some(value => text.includes(value)), `${label}: expected one of ${values.join(" | ")}`);
}

function assertAllIncludes(text, expected, label) {
  (expected || []).forEach(value => {
    assert(text.includes(value), `${label}: missing ${value}`);
  });
}

function assertAllExcludes(text, forbidden, label) {
  (forbidden || []).forEach(value => {
    assert(!text.includes(value), `${label}: forbidden phrase found ${value}`);
  });
}

function assertReportMode(actual, expected, name) {
  assert.strictEqual(actual, expected, `${name}: mode`);
}

function assertPrimaryMechanism(evidence, expected, name) {
  const acceptable = [].concat(expected || []);
  assert(acceptable.includes(evidence.primaryMechanism), `${name}: primary ${evidence.primaryMechanism} not in ${acceptable.join(" | ")}`);
}

function assertSecondaryMechanisms(evidence, expected, name) {
  (expected || []).forEach(item => {
    const acceptable = [].concat(item);
    const present = acceptable.some(name => evidence.secondaryMechanisms.includes(name) || evidence.supportingMechanisms.includes(name) || evidence.mechanisms[name]?.score > 0);
    assert(present, `${name}: missing secondary/supporting ${acceptable.join(" | ")}`);
  });
}

function assertNoNumericConfidence(text, name) {
  assert(!/\b\d{1,3}%\b/.test(text), `${name}: numeric confidence/percent found`);
  assert(!/confidence|итгэлцэл/i.test(text), `${name}: confidence wording found`);
}

function assertNoRawUnconfirmedReflection(text, name) {
  assert(!/RAW_UNCONFIRMED/.test(text), `${name}: raw unconfirmed reflection leaked`);
}

function assertReportIncludes(report, requiredSections, name) {
  (requiredSections || []).forEach(section => {
    if (section === "Эхний тестээр" || section === "7 хоногийн ажиглалтаар") {
      assert(report.includes("Яагаад ингэж хэлж байна вэ?"), `${name}: report includes: missing evidence note`);
      return;
    }
    assert(report.includes(section), `${name}: report includes: missing ${section}`);
  });
}

function assertReportExcludes(report, forbiddenPhrases, name) {
  assertAllExcludes(report, forbiddenPhrases, `${name}: report excludes`);
}

const forbiddenReportSmells = [
  "сахилга батгүй",
  "залхуу",
  "өөрийгөө хяна",
  "та өвчтэй",
  "онош тав",
  "оношоо харах",
  "100%",
  "Trigger ->",
  "эрүүл хооллож, хөдөлгөөнөө нэм"
];

const scenarios = [
  {
    name: "Hunger-Safety Evening Rebound",
    packageType: "seven-day",
    stageAnswers: {
      "S1-M02": "Бараг өдөр бүр",
      "S1-M03": "Хянахад хэцүү",
      "S1-W04": ["Мацаг", "Орой хоол идэхгүй"]
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
      hunger_level: "8",
      food_function: ["Биеэрээ өлссөн", "Дараа өлсөхөөс санаа зовсон"],
      energy_score: "3",
      stress_score: "3"
    }, ["Орой өлсөлт өндөр байсан", "Хоолны хооронд 5+ цагийн зай гарсан"])),
    expectedMode: "deep",
    expectedPrimary: [M.hungerSafety],
    expectedSecondary: [[M.reward, M.collapse, M.circadian]],
    hiddenIncludes: ["Дараа өлсөхөөс хамгаалах"],
    avoidIncludes: ["Урт мацаг", "Өдөр хоол алгасах"],
    leverageIncludes: ["тогтмол хоол", "оройн бэлэн сонголт"],
    experimentAllowed: true,
    requireInitialObserved: true
  },
  {
    name: "Reward-Seeking / Stimulation",
    packageType: "one-time",
    stageAnswers: {
      "S1-R01": "Өдөрт олон удаа",
      "S1-R02": ["Уйдал", "Амт-мэдрэмж", "Food зураг-delivery"],
      "S1-H02": "Ихэвчлэн үгүй"
    },
    stageSummaries: [{ id: "S1-V01", bullets: ["Өлсөөгүй үед нэг гоё юм хүсдэг", "Food зураг cue trigger болдог"] }],
    expectedMode: "deep",
    expectedPrimary: [M.reward],
    expectedSecondary: [[M.cue, M.decisionDefault, M.rewardDeficit]],
    hiddenIncludes: ["Таатай мэдрэмж авах"],
    leverageIncludes: ["таатай мэдрэмж авах жижиг сонголт"],
    experimentAllowed: true
  },
  {
    name: "Reward Deficit / My Time",
    packageType: "seven-day",
    stageAnswers: {
      "S1-L03": ["Бусдын хэрэгцээ", "Ажил"],
      "S1-R02": ["Өдрийн төгсгөлд шагнах", "Ажлын дараах амралт"],
      "S1-E02": ["Хоосон/flat мэдрэмж", "Ядаргаа"]
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      food_function: ["Өөрийгөө шагнамаар байсан"],
      emotion: "Ядаргаа",
      energy_score: "2",
      stress_score: "5",
      pattern_probes: { role_overload: "Өдөржин ажил/гэр бүлдээ зарцуулсан" }
    }, ["Оройн хоол миний цаг болсон", "Reward хүсэл өдөр дуусахад нэмэгдсэн"])),
    expectedMode: "deep",
    expectedPrimary: [M.reward, M.rewardDeficit, M.executive, M.roleOverload],
    expectedSecondary: [[M.rewardDeficit], [M.roleOverload, M.circadian, M.executive]],
    hiddenIncludes: ["Таатай мэдрэмж авах", "Тэнхээ нөхөх", "Өөрийгөө хамгийн сүүлд"],
    leverageIncludes: ["таатай мэдрэмж авах жижиг сонголт", "оройн хоолны бэлэн зам", "өөрийн хоол, амралтын хамгаалагдсан жижиг зай"],
    experimentAllowed: true,
    requireInitialObserved: true
  },
  {
    name: "Food-as-Regulation",
    packageType: "seven-day",
    stageAnswers: {
      "S1-E01": "Маш их нэмэгддэг",
      "S1-E02": ["Стресс", "Уур", "Ганцаардал"],
      "S1-F02": "Түр гайгүй болоод гэмшдэг"
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      food_function: ["Тайвширмаар байсан"],
      emotion: day % 2 ? "Стресс" : "Уур",
      stress_score: "8",
      energy_score: "4",
      pattern_probes: { after_guilt: "Идсэний дараа гэмшсэн" }
    }, ["Stress үед тайвшрах гэж идсэн", "Идсэний дараа гэмшсэн"])),
    expectedMode: "deep",
    expectedPrimary: [M.regulation],
    expectedSecondary: [[M.shameAvoidance, M.collapse]],
    hiddenIncludes: ["Сэтгэл санааг түр тогтворжуулах"],
    leverageIncludes: ["тайван шалгалт", "өөрийгөө буруутгахгүй тэмдэглэх"],
    experimentAllowed: true,
    requireInitialObserved: true
  },
  {
    name: "Executive Load",
    packageType: "seven-day",
    stageAnswers: {
      "S1-L01": "Тийм",
      "S1-L02": ["Delivery", "Хоол бэлдэх energy байхгүй"],
      "S1-E02": ["Ядаргаа"]
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      food_function: ["Хамгийн амар сонголт байсан"],
      emotion: "Ядаргаа",
      energy_score: "2",
      stress_score: "4",
      pattern_probes: { tired_default: "Delivery" }
    }, ["Delivery хамгийн амар сонголт болсон", "Оройн energy бага байсан"])),
    expectedMode: "deep",
    expectedPrimary: [M.executive, M.decisionDefault],
    expectedSecondary: [[M.decisionDefault, M.executive]],
    hiddenIncludes: ["Олон шийдвэрийн дараах ядаргаанаас гарах"],
    avoidIncludes: ["Олон дүрэмтэй хоолны төлөвлөгөө"],
    leverageIncludes: ["оройн хоолны бэлэн зам"],
    experimentAllowed: true,
    requireInitialObserved: true
  },
  {
    name: "Decision-Default Mismatch",
    packageType: "seven-day",
    stageAnswers: {
      "S1-L02": ["Delivery", "Snack"],
      "S1-L04": "Харагдвал бараг автоматаар иддэг"
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      food_function: ["Хамгийн амар сонголт байсан"],
      emotion: "Тайван",
      stress_score: "2",
      energy_score: "5",
      pattern_probes: { visible_snack: "Snack харагдсан", tired_default: "Delivery" }
    }, ["Snack харагдсан", "Delivery хамгийн амар default болсон"])),
    expectedMode: "deep",
    expectedPrimary: [M.decisionDefault, M.executive, M.cue],
    expectedSecondary: [[M.cue], [M.executive, M.decisionDefault]],
    hiddenIncludes: ["Олон шийдвэрийн дараах ядаргаанаас гарах"],
    leverageIncludes: ["оройн хоолны бэлэн зам"],
    experimentAllowed: true,
    requireInitialObserved: true
  },
  {
    name: "Circadian-Energy Mismatch",
    packageType: "seven-day",
    stageAnswers: {
      "S1-M01": "Өглөө алгасах",
      "S1-M03": "Их нэмэгддэг",
      "S1-E02": ["Ядаргаа", "Хоосон/flat мэдрэмж"]
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      meal_rhythm: "Өглөө алгасах, орой нөхөх",
      main_moment_time: "Орой",
      hunger_level: "6",
      food_function: ["Өөрийгөө шагнамаар байсан"],
      emotion: "Ядаргаа",
      energy_score: "2",
      stress_score: "3"
    }, ["Оройн energy crash болсон", "Өглөө хоол алгассан"])),
    expectedMode: "deep",
    expectedPrimary: [M.circadian, M.hungerSafety, M.executive],
    expectedSecondary: [[M.rewardDeficit, M.reward, M.executive]],
    hiddenIncludes: ["Тэнхээ нөхөх", "Таатай мэдрэмж авах", "Нойр/эрч хүчний хэмнэл нөхөх"],
    leverageIncludes: ["тогтмол хоол", "таатай мэдрэмж авах жижиг сонголт", "оройн хоолны бэлэн зам", "эхний тогтмол хоол"],
    experimentAllowed: true,
    requireInitialObserved: true
  },
  {
    name: "Control-Collapse",
    packageType: "seven-day",
    stageAnswers: {
      "S1-W04": ["Фитнес challenge", "Калори тоолох"],
      "S1-W06": "Одоо бүх юм дууссан",
      "S1-X03": "Маш хүчтэй"
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      food_function: ["Амттай юм хүссэн"],
      emotion: "Санаа зовнил",
      stress_score: "6",
      energy_score: "4",
      pattern_probes: { collapse_thought: "Одоо бүх юм дууссан", after_guilt: "Маргааш илүү чанга" }
    }, ["Одоо бүх юм дууссан гэж бодсон", "Идсэний дараа гэмшсэн"])),
    expectedMode: "deep",
    expectedPrimary: [M.collapse, M.perfectionism, M.shameAvoidance],
    expectedSecondary: [[M.perfectionism, M.shameAvoidance]],
    hiddenIncludes: ["Ичгүүрээс зайлсхийх"],
    avoidIncludes: ["Төгс төлөвлөгөө", "бүхнийг дахин эхлүүлэх сорил"],
    leverageIncludes: ["дараагийн хоолноос хэвийн үргэлжлүүлэх дүрэм"],
    experimentAllowed: true,
    requireInitialObserved: true
  },
  {
    name: "Stage 1 Reward vs Diary Hunger Contradiction",
    packageType: "seven-day",
    stageAnswers: {
      "S1-R01": "Өдөрт олон удаа",
      "S1-R02": ["Амт-мэдрэмж", "Food зураг-delivery"]
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
      hunger_level: "8",
      food_function: ["Биеэрээ өлссөн", "Дараа өлсөхөөс санаа зовсон"],
      energy_score: "3"
    }, ["Хоолны хооронд 5+ цагийн зай гарсан", "Орой өлсөлт өндөр байсан"])),
    expectedMode: "deep",
    expectedPrimary: [M.hungerSafety],
    expectedSecondary: [[M.reward, M.cue, M.circadian]],
    contradictionFor: M.reward,
    hiddenIncludes: ["Дараа өлсөхөөс хамгаалах"],
    reportIncludes: ["Эхний тестээр", "7 хоногийн ажиглалтаар"],
    experimentAllowed: true,
    requireInitialObserved: true
  },
  {
    name: "Stage 1 Stress vs Diary Executive Load Contradiction",
    packageType: "seven-day",
    stageAnswers: {
      "S1-E01": "Маш их нэмэгддэг",
      "S1-E02": ["Стресс", "Санаа зовнил"]
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      food_function: ["Хамгийн амар сонголт байсан"],
      emotion: "Ядаргаа",
      stress_score: "3",
      energy_score: "2",
      pattern_probes: { tired_default: "Delivery" }
    }, ["Delivery хамгийн амар сонголт болсон", "Оройн energy бага байсан"])),
    expectedMode: "deep",
    expectedPrimary: [M.executive, M.decisionDefault],
    expectedSecondary: [[M.regulation]],
    contradictionFor: M.regulation,
    hiddenIncludes: ["Олон шийдвэрийн дараах ядаргаанаас гарах"],
    reportIncludes: ["Эхний тестээр", "7 хоногийн ажиглалтаар"],
    experimentAllowed: true,
    requireInitialObserved: true
  },
  {
    name: "Hunger-Triggered Physiological Reactivity",
    packageType: "seven-day",
    stageAnswers: {
      "S1-B01": ["Зүрх дэлсэх", "Толгой өвдөх"],
      "S1-B03": "Үгүй",
      "S1-M02": "3-4"
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
      hunger_level: "8",
      food_function: ["Бие муудах-сахар унах вий", "Биеэрээ өлссөн"],
      body_signals: ["Зүрх дэлсэх", "Толгой өвдөх"],
      energy_score: "3"
    }, ["Хоол удахад зүрх дэлсэх толгой өвдөх шинж гарсан", "Measured low glucose байхгүй"])),
    expectedMode: "check",
    expectedPrimary: [M.physiological, M.hungerSafety, M.glucose],
    expectedSecondary: [[M.physiological, M.hungerSafety]],
    avoidIncludes: ["Мацаг", "Хоол алгасах"],
    reportIncludes: ["Мэргэжлийн хүнтэй ярилцахад илүүдэхгүй хэсэг"],
    experimentAllowed: true,
    professionalExpected: true,
    requireNotPrimary: [M.glucose],
    requireInitialObserved: true
  },
  {
    name: "Glucose-Safety / Professional Route",
    packageType: "seven-day",
    stageAnswers: {
      "S1-B01": ["Гар салгалах", "Хөлрөх", "Толгой эргэх"],
      "S1-B03": "Тийм",
      "S1-B05": "Тийм"
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
      hunger_level: "8",
      food_function: ["Бие муудах-сахар унах вий"],
      body_signals: ["Гар салгалах", "Хөлрөх", "Толгой эргэх"],
      energy_score: "2"
    }, ["Measured glucose санаа зовоосон", "Хоол удахад sugar-drop-like signal гарсан"])),
    expectedMode: "professional",
    expectedPrimary: [null],
    reportIncludes: ["Ярилцах товч нэгтгэл"],
    reportExcludes: ["14-day personalized experiment", "14-Day Experiment", "14-Day Starter Experiment", "14 хоногийн туршилт"],
    experimentAllowed: false,
    professionalExpected: true
  },
  {
    name: "Mode 4 Urgent Safety",
    packageType: "seven-day",
    stageAnswers: {
      "S1-S04": "Одоо идэвхтэй бодогдож байна",
      "S1-S02": "Маш хүчтэй"
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      body_signals: ["Ухаан балартах"],
      food_function: ["Тайвширмаар байсан"]
    }, ["Өөртөө хор хүргэх бодол идэвхтэй дурдагдсан"])),
    expectedMode: "urgent",
    expectedPrimary: [null],
    reportIncludes: ["Одоо жин хасах тухай биш", "яаралтай тусламж"],
    reportExcludes: ["14-day personalized experiment", "14-Day Experiment", "14 хоногийн туршилт", "7 хоногоор нарийвчлах"],
    experimentAllowed: false,
    urgentExpected: true
  },
  {
    name: "Social Belonging + Autonomy",
    packageType: "one-time",
    stageAnswers: {
      "S1-L03": ["Найз нөхөд", "Гэр бүл"],
      "S1-X01": "Уур/эсэргүүцэл"
    },
    stageSummaries: [{ id: "S1-V01", bullets: ["Social event дээр татгалзах эвгүй", "Бүрэн хориглох тусам rebellion нэмэгддэг"] }],
    expectedMode: "deep",
    expectedPrimary: [M.social, M.autonomy],
    expectedSecondary: [[M.autonomy, M.social]],
    hiddenIncludes: ["Хүмүүсийн дунд татгалзахгүй байх"],
    leverageIncludes: ["тайван шалгалт", "таатай мэдрэмж авах жижиг сонголт"],
    experimentAllowed: true
  },
  {
    name: "Body-Safety + Shame",
    packageType: "seven-day",
    stageAnswers: {
      "S1-W06": "Би угаасаа чаддаггүй",
      "S1-X03": "Бага зэрэг"
    },
    diaryEntries: repeatEntries(5, day => diary(day, {
      food_function: ["Амттай юм хүссэн"],
      emotion: "Санаа зовнил",
      stress_score: "6",
      energy_score: "4",
      pattern_probes: { after_guilt: "Идсэний дараа ичсэн", visibility: "Жин үзэхээс зайлсхийсэн public challenge эвгүй" }
    }, ["Идсэний дараа ичсэн", "Public before/after visibility эвгүй байсан"])),
    expectedMode: "deep",
    expectedPrimary: [M.shameAvoidance, M.bodySafety, M.identity, M.collapse],
    expectedSecondary: [[M.bodySafety, M.shameAvoidance, M.identity]],
    hiddenIncludes: ["Ичгүүрээс зайлсхийх"],
    avoidIncludes: ["Олон нийтэд өмнө/дараах зураг харуулах сорил"],
    leverageIncludes: ["тайван тэмдэглэл", "биеэ буруутгахгүй хэмжүүр"],
    experimentAllowed: true,
    requireInitialObserved: true
  }
];

function validateScenario(scenario) {
  const result = runAssessmentScenario(scenario);
  const { text, evidence, mode } = result;
  assertReportMode(mode, scenario.expectedMode, scenario.name);
  assertPrimaryMechanism(evidence, scenario.expectedPrimary, scenario.name);
  assertSecondaryMechanisms(evidence, scenario.expectedSecondary, scenario.name);

  (scenario.requireNotPrimary || []).forEach(name => {
    assert.notStrictEqual(evidence.primaryMechanism, name, `${scenario.name}: should not primary ${name}`);
  });

  if (scenario.contradictionFor) {
    assert(evidence.mechanisms[scenario.contradictionFor]?.contradictionSignals?.length > 0, `${scenario.name}: missing contradiction signal`);
  }

  if (scenario.hiddenIncludes) {
    assert(text.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?") || text.includes("2. Яагаад давтагдаад байна вэ?"), `${scenario.name}: missing food-need section`);
  }
  if (scenario.avoidIncludes) {
    assert(text.includes("Одоохондоо хэт яарахгүй зүйлс") || text.includes("6. Болгоомжлох зүйл"), `${scenario.name}: missing avoid section`);
  }
  if (scenario.leverageIncludes) {
    assert(text.includes("Эхний жижиг өөрчлөлт") || text.includes("4. Таны хувьд хамгийн түрүүнд өөрчлөх цэг"), `${scenario.name}: missing first-change section`);
  }
  assertReportIncludes(text, scenario.reportIncludes, scenario.name);
  assertReportExcludes(text, scenario.reportExcludes, scenario.name);
  assertReportExcludes(text, forbiddenReportSmells, scenario.name);
  assertNoNumericConfidence(text, scenario.name);
  assertNoRawUnconfirmedReflection(text, scenario.name);

  if (scenario.experimentAllowed) {
    assert(/14-Day|14-day personalized experiment|14 хоногийн (эхний |жижиг )?туршилт/.test(text), `${scenario.name}: expected experiment`);
  } else {
    assert(!/14-Day|14-day personalized experiment|14 хоногийн (эхний |жижиг )?туршилт/.test(text), `${scenario.name}: experiment should be suppressed`);
  }
  if (scenario.professionalExpected) assert(text.includes("Professional") || text.includes("professional") || text.includes("мэргэжлийн") || text.includes("шалгуулахад илүүдэхгүй"), `${scenario.name}: expected professional guidance`);
  if (!scenario.professionalExpected && scenario.expectedMode === "deep") assert(!text.includes("Мэргэжлийн хүнтэй ярилцахад илүүдэхгүй хэсэг"), `${scenario.name}: unexpected professional check`);
  if (scenario.urgentExpected) assert(text.includes("яаралтай"), `${scenario.name}: expected urgent guidance`);
  if (!scenario.urgentExpected) assert(!text.includes("Одоо жин хасах тухай биш"), `${scenario.name}: unexpected urgent guidance`);
  if (scenario.oneTimeCta) assert(text.includes("7 хоногоор нарийвчлах") || text.includes("7 хоногийн гүн үнэлгээ"), `${scenario.name}: expected one-time CTA`);
  if (scenario.packageType === "one-time" && scenario.expectedMode === "deep") assert(!text.includes("7 хоногоор нарийвчлах"), `${scenario.name}: WP62 one-time report should not mix in 7-day CTA`);
  if (scenario.requireInitialObserved) assert(text.includes("Яагаад ингэж хэлж байна вэ?"), `${scenario.name}: missing evidence note`);

  return result;
}

function run() {
  const failures = [];
  scenarios.forEach(scenario => {
    try {
      validateScenario(scenario);
      console.log(`PASS ${scenario.name}`);
    } catch (error) {
      failures.push({ scenario: scenario.name, error });
      console.error(`FAIL ${scenario.name}: ${error.message}`);
    }
  });

  assert.strictEqual(scenarios.length, 15, "expected 15 virtual user scenarios");
  if (failures.length) {
    const summary = failures.map(item => `${item.scenario}: ${item.error.message}`).join("\n");
    throw new Error(`Virtual user QA failures:\n${summary}`);
  }
}

run();
console.log("virtual-user-qa tests passed");
