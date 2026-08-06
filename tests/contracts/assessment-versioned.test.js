"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");

const originalPath = path.join(__dirname, "assessment.contract.test.js");
let source = fs.readFileSync(originalPath, "utf8");

const replacements = [
  [
    '"Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн амардаг", "Q-MOVEMENT": "Дунд",',
    '"Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн", "Q-MOVEMENT": "Дунд",'
  ],
  [
    'await save(event("PATCH", { assessmentId: safetyAssessmentId, answers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" } }, otherCookie));',
    'await save(event("PATCH", { assessmentId: safetyAssessmentId, answers: { "S1-S04": "Хааяа", "S1-S04-NOW": "Тийм" } }, otherCookie));'
  ]
];

for (const [from, to] of replacements) {
  if (!source.includes(from)) throw new Error(`assessment contract migration anchor missing: ${from.slice(0, 80)}`);
  source = source.replace(from, to);
}

const testModule = new Module(originalPath, module);
testModule.filename = originalPath;
testModule.paths = Module._nodeModulePaths(path.dirname(originalPath));
testModule._compile(source, originalPath);