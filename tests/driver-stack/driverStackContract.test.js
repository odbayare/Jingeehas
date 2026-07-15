const assert = require("assert");

(async () => {
  const calculator = await import("./driverStackTestCalculator.mjs");
  const { driverStackFixtures } = await import("./driverStackFixtures.mjs");
  const {
    buildDriverStack,
    calculateTestDriverStack,
    normalizeDriverScore,
    strengthFromNormalizedScore,
    selectPrimaryDriver,
    selectSecondaryDrivers,
    buildInteractionPattern,
    buildVulnerableMoment,
    buildFirstGentleChange,
    buildFourteenDayExperimentHypothesis,
    buildRemovedFeatureConfirmationTargets
  } = calculator;

  [
    calculateTestDriverStack,
    normalizeDriverScore,
    strengthFromNormalizedScore,
    selectPrimaryDriver,
    selectSecondaryDrivers,
    buildInteractionPattern,
    buildVulnerableMoment,
    buildFirstGentleChange,
    buildFourteenDayExperimentHypothesis,
    buildRemovedFeatureConfirmationTargets
  ].forEach(fn => assert.strictEqual(typeof fn, "function"));

  assert.strictEqual(normalizeDriverScore(5, 10), 5);
  assert.strictEqual(normalizeDriverScore(100, 10), 10);
  assert.strictEqual(strengthFromNormalizedScore(0, false), "inactive");
  assert.strictEqual(strengthFromNormalizedScore(5, false), "moderate");
  assert.strictEqual(strengthFromNormalizedScore(8, false), "strong");
  assert.strictEqual(strengthFromNormalizedScore(9, false), "very_strong");
  assert.strictEqual(strengthFromNormalizedScore(2, true), "safety");

  const stack = buildDriverStack(driverStackFixtures[0].state);

  assert.strictEqual(stack.version, "driver-stack-v0-test-only");
  assert(stack.source);
  assert.strictEqual(typeof stack.source.stage_answer_count, "number");
  assert.strictEqual(typeof stack.source.diary_entry_count, "number");
  assert(stack.safety_route);
  assert(Object.prototype.hasOwnProperty.call(stack.safety_route, "ordinary_report_allowed"));
  assert(stack.driver_scores);
  assert(stack.primary_driver);
  assert.strictEqual(stack.primary_driver.not_a_type, true);
  assert(Array.isArray(stack.secondary_drivers));
  assert(stack.interaction_pattern.id);
  assert(stack.vulnerable_moment.id);
  assert(stack.visible_condition.plain_language);
  assert(stack.hidden_food_function.key);
  assert(stack.wrong_self_explanation.key);
  assert(stack.first_gentle_change.id);
  assert(stack.fourteen_day_experiment_hypothesis.hypothesis);
  assert(Array.isArray(stack.removed_feature_diary_confirmation_targets));
  assert(stack.removed_feature_diary_confirmation_targets.length >= 2);
  assert(Array.isArray(stack.evidence_sources));
  assert(stack.copy_constraints.includes("no_one_type_label"));
  assert(stack.copy_constraints.includes("no_ordinary_experiment_when_professional_first"));

  Object.values(stack.driver_scores).forEach(score => {
    assert.deepStrictEqual(Object.keys(score).sort(), [
      "confidence",
      "diaryEvidenceCount",
      "directEvidenceCount",
      "evidenceItems",
      "expectedMaxScore",
      "inferredOnly",
      "key",
      "layer",
      "normalizedScore",
      "rawScore",
      "relatedOldMechanisms",
      "strength"
    ].sort(), `${score.key}: official driver score keys`);
    assert(Number.isFinite(score.rawScore), `${score.key}: rawScore`);
    assert(Number.isFinite(score.expectedMaxScore), `${score.key}: expectedMaxScore`);
    assert(Number.isInteger(score.normalizedScore), `${score.key}: normalizedScore integer`);
    assert(score.normalizedScore >= 0 && score.normalizedScore <= 10, `${score.key}: normalizedScore range`);
    assert(["inactive", "weak", "moderate", "strong", "very_strong", "safety"].includes(score.strength), `${score.key}: strength`);
    assert(score.layer, `${score.key}: layer`);
    assert(Object.prototype.hasOwnProperty.call(score, "confidence"), `${score.key}: confidence`);
    assert(["possible", "moderate", "strong", "safety"].includes(score.confidence), `${score.key}: approved confidence enum`);
    assert(Array.isArray(score.evidenceItems), `${score.key}: evidenceItems`);
    assert(Array.isArray(score.relatedOldMechanisms), `${score.key}: relatedOldMechanisms`);
    assert(Number.isInteger(score.directEvidenceCount), `${score.key}: directEvidenceCount`);
    assert(Number.isInteger(score.diaryEvidenceCount), `${score.key}: diaryEvidenceCount`);
    assert.strictEqual(typeof score.inferredOnly, "boolean", `${score.key}: inferredOnly`);
    assert(!Object.prototype.hasOwnProperty.call(score, "evidence_items"), `${score.key}: no snake evidence_items`);
    assert(!Object.prototype.hasOwnProperty.call(score, "related_old_mechanisms"), `${score.key}: no snake related_old_mechanisms`);
  });

  console.log("driverStackContract tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
