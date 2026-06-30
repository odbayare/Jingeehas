const assert = require("assert");
const app = require("../app.js");

const {
  mechanisms,
  allQuestionObjects,
  getQuestionMetadata,
  getOptionMetadata,
  extractTagsFromAnswer,
  extractDimensionsFromAnswer,
  extractMechanismsFromAnswer,
  aggregateDimensionEvidence,
  aggregateMechanismSignals,
  aggregateReportUseEvidence,
  mechanismNamesByKey,
  createConfirmedSummaryObject,
  _internal
} = app;

function run() {
  const questions = allQuestionObjects();
  assert(questions.length > 50);

  questions.forEach(question => {
    assert(question.id, "question missing id");
    assert(question.metadata?.stage, `${question.id} missing stage`);
    assert(question.metadata?.module, `${question.id} missing module`);
    assert(question.metadata?.answerType, `${question.id} missing answerType`);
    if (question.metadata.answerType !== "copy") {
      assert(Array.isArray(question.metadata.dimensions), `${question.id} dimensions not array`);
      assert(question.metadata.dimensions.length > 0, `${question.id} missing dimensions`);
    }
    Object.values(question.optionMetadata || {}).forEach(option => {
      assert(Array.isArray(option.tags), `${question.id} option tags not array`);
      assert(Array.isArray(option.dimensions), `${question.id} option dimensions not array`);
      assert(Array.isArray(option.mechanisms), `${question.id} option mechanisms not array`);
      assert(Array.isArray(option.reportUse), `${question.id} option reportUse not array`);
    });
  });

  ["S1-B01", "S1-B02", "S1-B03", "S1-B04", "S1-B05", "S1-S01", "S1-S02", "S1-S03", "S1-S04"].forEach(id => {
    assert(getQuestionMetadata(id)?.safetyTrigger, `${id} missing safetyTrigger metadata`);
  });
  assert.strictEqual(getOptionMetadata("S1-S04", "Одоо идэвхтэй бодогдож байна").safetyTrigger, "urgent");

  const tags = extractTagsFromAnswer("S1-M01", "Өдөр бага идээд орой нөхөх");
  assert(tags.includes("skipped_meal") || tags.includes("meal_gap_5h_plus"));
  const dims = extractDimensionsFromAnswer("S1-M01", "Өдөр бага идээд орой нөхөх");
  assert(dims.includes("D03"));
  const mech = extractMechanismsFromAnswer("S1-L02", ["Delivery", "Snack"]);
  assert(mech.includes("Executive Load Failure"));
  assert(mech.includes("Decision-Default Mismatch"));

  const requiredPrimary = [
    "Reward-Seeking / Stimulation Compensation",
    "Food-as-Regulation System",
    "Reward Deficit Compensation",
    "Hunger-Safety / Scarcity Protection",
    "Glucose-Safety / Hypoglycemia Risk Pattern",
    "Hunger-Triggered Physiological Reactivity",
    "Satiety Signal Disconnect",
    "Cue-Conditioned Automatic Eating",
    "Control-Collapse Cycle",
    "Executive Load Failure",
    "Decision-Default Mismatch",
    "Circadian-Energy Mismatch"
  ];
  requiredPrimary.forEach(name => {
    assert(Object.values(mechanisms).some(mechanism => mechanism.name === name), `missing mechanism ${name}`);
  });

  assert.notStrictEqual(mechanisms.rewardDeficit.name, mechanisms.reward.name);
  assert.notStrictEqual(mechanisms.physiological.name, mechanisms.glucose.name);
  assert.notStrictEqual(mechanisms.decisionDefault.name, mechanisms.executive.name);
  assert.notStrictEqual(mechanisms.perfectionism.name, mechanisms.collapse.name);

  assert(extractMechanismsFromAnswer("S1-R02", ["Өдрийн төгсгөлд шагнах"]).includes("Reward Deficit Compensation"));
  assert(extractMechanismsFromAnswer("S1-B01", ["Зүрх дэлсэх"]).includes("Hunger-Triggered Physiological Reactivity"));
  assert(extractMechanismsFromAnswer("S1-L04", "Харагдвал бараг автоматаар иддэг").includes("Decision-Default Mismatch"));
  assert(extractMechanismsFromAnswer("S1-X03", "Маш хүчтэй").includes("Perfectionism / All-or-Nothing Pattern"));
  assert(extractMechanismsFromAnswer("S1-L03", ["Бусдын хэрэгцээ"]).includes("Role Overload / Self-Neglect Pattern"));
  assert(extractMechanismsFromAnswer("S1-W06", "Би угаасаа чаддаггүй").includes("Identity Conflict / Learned Failure Expectancy"));

  const responses = {
    "S1-M01": "Өдөр бага идээд орой нөхөх",
    "S1-L02": ["Delivery"],
    "S1-R02": ["Өдрийн төгсгөлд шагнах"]
  };
  const dimensionEvidence = aggregateDimensionEvidence(responses);
  assert(dimensionEvidence.D03 >= 1);
  assert(dimensionEvidence.D13 >= 1 || dimensionEvidence.D14 >= 1);

  const confirmed = createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: 1,
    rawText: "raw should not matter",
    structured: { food_function: ["Өөрийгөө шагнамаар байсан"], energy_score: "2" },
    aiSummaryBullets: ["Reward хүсэл давхцсан", "Оройн energy бага байсан"],
    mode: "confirm"
  });
  const mechanismSignals = aggregateMechanismSignals(responses, [confirmed]);
  assert(mechanismSignals.includes("Reward-Seeking / Stimulation Compensation"));
  assert(mechanismSignals.includes("Reward Deficit Compensation"));
  const reportUse = aggregateReportUseEvidence(responses, [confirmed]);
  assert(reportUse.trigger_map);
  assert(reportUse.confirmed_summary);

  _internal.setTestState({
    packageType: "seven-day",
    preliminary: [{ key: "executive", score: 5, label: "хүчтэй нийцэж байна" }],
    stageAnswers: responses,
    diaryEntries: Array.from({ length: 5 }, (_, index) => ({
      day_number: index + 1,
      meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
      unplanned_eating_count: "Тийм, 1 удаа",
      main_moment_time: "Орой",
      hunger_level: "8",
      food_function: ["Хамгийн амар сонголт байсан"],
      emotion: "Ядаргаа",
      energy_score: "2",
      stress_score: "4",
      body_signals: ["Аль нь ч үгүй"],
      pattern_probes: {},
      confirmedSummaryObject: confirmed
    }))
  });
  assert(_internal.renderReport().includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?"));
  assert(mechanismNamesByKey.decisionDefault === "Decision-Default Mismatch");
}

run();
console.log("question-metadata-mechanisms tests passed");
