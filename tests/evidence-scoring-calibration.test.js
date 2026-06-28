const assert = require("assert");
const app = require("../app.js");

const { calculateMechanismEvidence, createConfirmedSummaryObject, mechanismNamesByKey, _internal } = app;

function summary(day, structured, bullets = []) {
  return createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: day,
    rawText: `raw ${day} should not appear`,
    structured,
    aiSummaryBullets: bullets.length ? bullets : ["Орой өлсөлт өндөр байсан", "Хоолны хооронд 5+ цагийн зай гарсан"],
    mode: "confirm"
  });
}

function diaryEntry(day, overrides = {}) {
  const structured = {
    day_number: day,
    meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
    unplanned_eating_count: "Тийм, 1 удаа",
    main_moment_time: "Орой",
    hunger_level: "8",
    food_function: ["Биеэрээ өлссөн", "Дараа өлсөхөөс санаа зовсон"],
    emotion: "Ядаргаа",
    energy_score: "4",
    stress_score: "4",
    body_signals: ["Аль нь ч үгүй"],
    pattern_probes: {},
    ...overrides
  };
  const confirmedSummaryObject = Object.prototype.hasOwnProperty.call(overrides, "confirmedSummaryObject")
    ? overrides.confirmedSummaryObject
    : summary(day, structured);
  return { ...structured, confirmedSummaryObject };
}

function baseState(overrides = {}) {
  return {
    packageType: "seven-day",
    stageAnswers: {},
    stageVoiceSummaries: {},
    preliminary: [],
    diaryEntries: [],
    ...overrides
  };
}

function run() {
  let evidence = calculateMechanismEvidence(baseState({
    packageType: "one-time",
    stageAnswers: {
      "S1-R01": "7 хоногт хэд хэд",
      "S1-R02": ["Амт-мэдрэмж", "Food зураг-delivery"]
    }
  }));
  assert([mechanismNamesByKey.reward, mechanismNamesByKey.decisionDefault].includes(evidence.primaryMechanism) || evidence.secondaryMechanisms.includes(mechanismNamesByKey.reward));
  assert(["possible", "moderate"].includes(evidence.mechanisms[mechanismNamesByKey.reward].evidenceLabel));
  assert.strictEqual(evidence.evidenceQuality, "one_time");

  evidence = calculateMechanismEvidence(baseState({
    stageAnswers: { "S1-R01": "Бараг өдөр бүр", "S1-R02": ["Амт-мэдрэмж"] },
    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1))
  }));
  assert.strictEqual(evidence.primaryMechanism, mechanismNamesByKey.hungerSafety);
  assert(evidence.mechanisms[mechanismNamesByKey.reward].contradictionSignals.length > 0);
  assert.notStrictEqual(evidence.primaryMechanism, mechanismNamesByKey.reward);

  evidence = calculateMechanismEvidence(baseState({
    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1, {
      meal_rhythm: "2-3 тогтмол хоол",
      hunger_level: "3",
      food_function: ["Хамгийн амар сонголт байсан"],
      energy_score: "2",
      confirmedSummaryObject: undefined,
      pattern_probes: { tired_default: "Delivery" }
    }))
  }));
  assert([mechanismNamesByKey.executive, mechanismNamesByKey.decisionDefault].includes(evidence.primaryMechanism));

  evidence = calculateMechanismEvidence(baseState({
    packageType: "one-time",
    stageAnswers: { "S1-R02": ["Өдрийн төгсгөлд шагнах"], "S1-L03": ["Бусдын хэрэгцээ"] }
  }));
  assert(evidence.mechanisms[mechanismNamesByKey.rewardDeficit]);

  evidence = calculateMechanismEvidence(baseState({
    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1, {
      body_signals: ["Зүрх дэлсэх", "Толгой эргэх"],
      food_function: ["Бие муудах/сахар унах вий гэж санаа зовсон"]
    }))
  }));
  assert(evidence.mechanisms[mechanismNamesByKey.physiological]);

  evidence = calculateMechanismEvidence(baseState({
    stageAnswers: { "S1-B03": "Тийм" },
    diaryEntries: [diaryEntry(1, { body_signals: ["Сахар унасан мэт"] })]
  }));
  assert(["mode2", "mode3"].includes(evidence.safetyRoute));

  evidence = calculateMechanismEvidence(baseState({
    stageAnswers: { "S1-W06": "Одоо бүх юм дууссан", "S1-S02": "Маш хүчтэй" },
    diaryEntries: Array.from({ length: 2 }, (_, i) => diaryEntry(i + 1, {
      food_function: ["Тайвширмаар байсан"],
      confirmedSummaryObject: summary(i + 1, {}, ["Идсэний дараа гэмшсэн", "Одоо бүх юм дууссан"])
    }))
  }));
  assert(evidence.combinations.some(combo => combo.comboId === "control_collapse_shame"));

  evidence = calculateMechanismEvidence(baseState({
    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1, {
      meal_rhythm: "2-3 тогтмол хоол",
      food_function: ["Хамгийн амар сонголт байсан"],
      energy_score: "2",
      pattern_probes: { tired_default: "Delivery" },
      confirmedSummaryObject: summary(i + 1, {}, ["Delivery хамгийн амар сонголт болсон", "Оройн energy бага байсан"])
    }))
  }));
  assert(evidence.combinations.some(combo => combo.comboId === "executive_default"));

  evidence = calculateMechanismEvidence(baseState({
    stageAnswers: { "S1-R01": "Өдөрт олон удаа" },
    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1))
  }));
  assert(evidence.mechanisms[mechanismNamesByKey.reward].contradictionSignals.length > 0);

  evidence = calculateMechanismEvidence(baseState({ diaryEntries: [diaryEntry(1)] }));
  assert.strictEqual(evidence.evidenceQuality, "insufficient");

  evidence = calculateMechanismEvidence(baseState({
    stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1))
  }));
  assert.strictEqual(evidence.safetyRoute, "mode4");
  assert.strictEqual(evidence.primaryMechanism, null);

  evidence = calculateMechanismEvidence(baseState({
    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1))
  }));
  assert(evidence.primaryMechanism);
  assert(evidence.secondaryMechanisms.length <= 2);
  assert(!String(evidence.mechanisms[evidence.primaryMechanism].evidenceLabel).includes("%"));

  _internal.setTestState({
    packageType: "seven-day",
    stageAnswers: {},
    preliminary: [],
    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1))
  });
  const report = _internal.renderReport();
  assert(report.includes("Дараа өлсөхөөс хамгаалах давтамж") || report.includes("Өлсөлтөөс хамгаалах"));
  assert(report.includes("Эхэлж өөрчлөх хамгийн амар цэг"));
  assert(!/confidence|итгэлцэл|82%/.test(report));
}

run();
console.log("evidence-scoring-calibration tests passed");
