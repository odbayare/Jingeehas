"use strict";
const assert = require("node:assert/strict");
const { possibleOpenTextSafety, calculateAssessmentSafety } = require("../netlify/functions/_lib/safety.js");
const { cleanupBranchState, normalizeMultiSelection } = require("../netlify/functions/_lib/answer-rules.js");

assert.equal(possibleOpenTextSafety("Надад өөртөө хор хүргэх бодол төрөөгүй."), null);
assert.equal(possibleOpenTextSafety("Ухаан балартаж байгаагүй."), null);
assert.equal(possibleOpenTextSafety("Миний найз өөртөө хор хүргэх тухай ярьсан."), null);
assert.equal(possibleOpenTextSafety("Олон жилийн өмнө ухаан балартаж байсан."), null);
assert.equal(possibleOpenTextSafety("Яг одоо өөртөө хор хүргэх бодол орж ирж байна."), "self_harm");

const confirmation = calculateAssessmentSafety({ "OPEN-01": "Яг одоо өөртөө хор хүргэх бодол орж ирж байна." });
assert.equal(confirmation.route, "confirmation_required");
assert.deepEqual(confirmation.triggerQuestionIds, ["OPEN-01"]);
const confirmed = calculateAssessmentSafety({ "OPEN-01": "Яг одоо өөртөө хор хүргэх бодол орж ирж байна.", "SAFETY-CONFIRM-OPEN-01": "Одоо идэвхтэй бодогдож байна" });
assert.equal(confirmed.route, "urgent_self_harm");

const initial = {
  answers: { "MC-GATE": "Тийм", "MC-01": "Тогтмол", "MC-02": "Өнөөдөр", "ALC-01": "Ховор" },
  summaries: { "MC-01": "summary", "ALC-01": "keep" }, tags: { "MC-02": ["tag"] },
  safetyFlags: [{ triggerQuestionIds: ["MC-02"] }, { triggerQuestionIds: ["ALC-01"] }]
};
const cleaned = cleanupBranchState(initial, "MC-GATE", "Үгүй, хамаарахгүй");
assert.deepEqual(cleaned.answers, { "MC-GATE": "Үгүй, хамаарахгүй", "ALC-01": "Ховор" });
assert.deepEqual(cleaned.summaries, { "ALC-01": "keep" });
assert.equal(cleaned.safetyFlags.length, 1);

assert.deepEqual(normalizeMultiSelection(["Аль нь ч үгүй"], "Толгой эргэх", 3).values, ["Толгой эргэх"]);
assert.deepEqual(normalizeMultiSelection(["Толгой эргэх"], "Аль нь ч үгүй", 3).values, ["Аль нь ч үгүй"]);
const maximum = normalizeMultiSelection(["Нэг", "Хоёр", "Гурав"], "Дөрөв", 3);
assert.deepEqual(maximum.values, ["Нэг", "Хоёр", "Гурав"]);
assert.equal(maximum.error, "Та хамгийн ихдээ 3 хариулт сонгох боломжтой.");
console.log("safety provenance and branching tests passed");
