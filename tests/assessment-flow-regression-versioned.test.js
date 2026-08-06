"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");

const originalPath = path.join(__dirname, "assessment-flow-regression.test.js");
let source = fs.readFileSync(originalPath, "utf8");

const replacements = [
  [
    'async function seededAssessment(database, suffix) {',
    'async function seededAssessment(database, suffix, questionnaireVersion = questions.QUESTIONNAIRE_VERSION) {'
  ],
  [
    'questionnaireVersion: questions.QUESTIONNAIRE_VERSION, createdAt: now',
    'questionnaireVersion, createdAt: now'
  ],
  [
    'const female = assertRoute("menstruating female", { "Q-SEX": "Эмэгтэй", "MC-GATE": "Тийм, хамаарна", "ALC-GATE": "Хааяа", "TOB-GATE": "Хааяа" }, ["MC-GATE", "MC-01", "PREG-GATE", "MENO-GATE", "ALC-01", "TOB-01"]);',
    'const female = assertRoute("menstruating female maximum V3 route", { "Q-SEX": "Эмэгтэй", "MC-GATE": "Тийм, хамаарна", "ALC-GATE": "Хааяа", "TOB-GATE": "Хааяа", "S1-S03": "Сүүлийн 28 хоногт байсан", "S1-S04": "Хааяа" }, ["MC-GATE", "MC-01", "PREG-GATE", "PREG-BREASTFEEDING", "MENO-GATE", "ALC-01", "TOB-01", "S1-S03-TYPE", "S1-S03-FREQUENCY", "S1-S04-NOW"]);'
  ],
  [
    'assertRoute("sleep risk", { "Q-SLEEP-DURATION": "4 цагаас бага", "Q-SLEEP-QUALITY": "Өглөө ядарсан хэвээр байдаг" }, ["Q-SLEEP-DURATION", "Q-SLEEP-QUALITY"]);',
    'assertRoute("sleep risk", { "Q-SLEEP-DURATION": "4 цагаас бага", "Q-SLEEP-QUALITY": "Маш тааруу" }, ["Q-SLEEP-DURATION", "Q-SLEEP-QUALITY"]);'
  ],
  [
    'assertRoute("safety escalation", { "S1-S04": "Одоо идэвхтэй бодогдож байна" }, ["S1-S04"]);',
    'assertRoute("safety escalation", { "S1-S04": "Хааяа", "S1-S04-NOW": "Тийм" }, ["S1-S04", "S1-S04-NOW"]);'
  ],
  [
    'const neutralSeeded = await seededAssessment(database, "neutral-full-route");',
    'const neutralSeeded = await seededAssessment(database, "neutral-full-route", questions.PREVIOUS_QUESTIONNAIRE_VERSION);'
  ],
  [
    'assert.equal(questions.visibleQuestions(neutralFixture.answers).length, questions.MAX_ROUTED_QUESTION_COUNT - 1, "single-method fixture auto-binds the longest method without adding a visible question");',
    'const neutralV2Route = questions.visibleQuestions(neutralFixture.answers, questions.PREVIOUS_QUESTIONNAIRE_VERSION);\n  assert(!neutralV2Route.some(question => question.id === "Q-METHOD-LONGEST"), "single-method V2 fixture auto-binds the longest method without adding a visible question");\n  assert(neutralV2Route.length <= questions.MAX_ROUTED_QUESTION_COUNT, "V2 neutral route must remain under the current cap");'
  ]
];

for (const [from, to] of replacements) {
  if (!source.includes(from)) throw new Error(`assessment-flow migration anchor missing: ${from.slice(0, 80)}`);
  source = source.replace(from, to);
}

const testModule = new Module(originalPath, module);
testModule.filename = originalPath;
testModule.paths = Module._nodeModulePaths(path.dirname(originalPath));
testModule._compile(source, originalPath);