const assert = require("assert");
const app = require("../app.js");
const { calculateMechanismEvidence, mechanismNamesByKey, _internal } = app;

function evidence(stageAnswers) {
  return calculateMechanismEvidence({ packageType: "one-time", stageAnswers, stageVoiceSummaries: {}, preliminary: [] });
}

let result = evidence({ "S1-R01": "7 хоногт хэд хэд", "S1-R02": ["Амт-мэдрэмж", "Food зураг-delivery"] });
assert([mechanismNamesByKey.reward, mechanismNamesByKey.decisionDefault].includes(result.primaryMechanism) || result.secondaryMechanisms.includes(mechanismNamesByKey.reward));
assert.strictEqual(result.evidenceQuality, "one_time");

result = evidence({ "S1-R02": ["Өдрийн төгсгөлд шагнах"], "S1-L03": ["Бусдын хэрэгцээ"] });
assert(result.mechanisms[mechanismNamesByKey.rewardDeficit]);

result = evidence({ "S1-B03": "Тийм" });
assert(["mode2", "mode3"].includes(result.safetyRoute));

result = evidence({ "S1-W06": "Одоо бүх юм дууссан", "S1-S02": "Маш хүчтэй" });
assert.strictEqual(result.safetyRoute, "mode3");
assert(result.mechanisms[mechanismNamesByKey.collapse]);

result = evidence({ "S1-S04": "Одоо идэвхтэй бодогдож байна" });
assert.strictEqual(result.safetyRoute, "mode4");
assert.strictEqual(result.primaryMechanism, null);

_internal.setTestState({ packageType: "one-time", oneTimePaid: true, stageAnswers: { "S1-M01": "Өдөр бага идээд орой нөхөх" } });
const report = _internal.renderReport();
assert(report.includes("1. Гол зураглал"));
assert(!/confidence|итгэлцэл|82%/.test(report));
console.log("evidence-scoring-calibration tests passed");
