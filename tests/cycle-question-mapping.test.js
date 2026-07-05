const assert = require("assert");
const app = require("../app.js");

const { _internal, stageOneQuestions } = app;

function questionById(id) {
  return stageOneQuestions.find(question => question.id === id);
}

function visibleIds(stageAnswers) {
  _internal.setTestState({
    packageType: "one-time",
    stageAnswers,
    diaryEntries: [],
    diaryDraft: {}
  });
  return _internal.stageQuestions().map(question => question.id);
}

const mc02 = questionById("MC-02");
assert(mc02, "MC-02 must exist");
mc02.options.forEach(option => {
  assert(_internal.selectedAnswerBelongsToQuestion("MC-02", option), `MC-02 option must map to itself: ${option}`);
});

[
  "Идэх хүсэл нэмэгддэг",
  "Чихэр/амттай юм илүү хүсдэг",
  "Сэтгэл санаа өөрчлөгддөг",
  "Амттай юм, гурилан зүйл илүү хүсдэг",
  "Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг"
].forEach(symptomAnswer => {
  assert(!_internal.selectedAnswerBelongsToQuestion("MC-02", symptomAnswer), `symptom/craving answer must not be valid for MC-02: ${symptomAnswer}`);
});

assert.deepStrictEqual(
  _internal.questionMappingIssues({ "MC-02": "Амттай юм, гурилан зүйл илүү хүсдэг" }).map(issue => issue.questionId),
  ["MC-02"],
  "mapping audit must catch MC-02 answer borrowed from another MC question"
);

const femaleGate = visibleIds({ "S1-C02": "Эмэгтэй" });
assert(femaleGate.includes("MC-GATE"), "female path must show MC-GATE first");
assert(!femaleGate.includes("MC-01"), "female path must not show detailed MC questions before opt-in");

const femaleOptIn = visibleIds({ "S1-C02": "Эмэгтэй", "MC-GATE": "Тийм, хамаарна" });
["MC-INTRO", "MC-01", "MC-02", "MC-03", "MC-04", "MC-05", "MC-06", "MC-07"].forEach(id => {
  assert(femaleOptIn.includes(id), `female opt-in path must include ${id}`);
});

const femaleOptOut = visibleIds({ "S1-C02": "Эмэгтэй", "MC-GATE": "Үгүй, хамаарахгүй" });
assert(femaleOptOut.includes("MC-GATE"), "female opt-out keeps the gate");
["MC-INTRO", "MC-01", "MC-02", "MC-03", "MC-04", "MC-05", "MC-06", "MC-07"].forEach(id => {
  assert(!femaleOptOut.includes(id), `female opt-out path must skip ${id}`);
});

const maleIds = visibleIds({ "S1-C02": "Эрэгтэй", "MC-GATE": "Тийм, хамаарна" });
assert(!maleIds.some(id => id.startsWith("MC-")), "male path must have no MC questions");

const unknownIds = visibleIds({ "S1-C02": "Хариулахгүй", "MC-GATE": "Тийм, хамаарна" });
assert(!unknownIds.some(id => id.startsWith("MC-")), "unknown gender path must have no MC questions by default");

console.log("cycle-question-mapping tests passed");
