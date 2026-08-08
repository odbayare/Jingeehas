"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");

const originalPath = path.join(__dirname, "free-initial-result-funnel.contract.test.js");
let source = fs.readFileSync(originalPath, "utf8");

const replacements = [
  [
    '"Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн амардаг", "Q-MOVEMENT": "Дунд",',
    '"Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн", "Q-MOVEMENT": "Дунд",'
  ],
  [
    '"Q-METHOD-BARRIERS": ["Тодорхой саад байгаагүй"]',
    '"Q-METHOD-BARRIERS": ["Тодорхой саад байгаагүй"], "HFE-HOUSEHOLD": ["Ганцаараа"]'
  ],
  [
    'await saveAssessment(database, newSession.sessionId, { assessmentId: safety.id, answers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" } });',
    'await saveAssessment(database, newSession.sessionId, { assessmentId: safety.id, answers: { "S1-S04": "Хааяа", "S1-S04-NOW": "Тийм" } });'
  ]
];

for (const [from, to] of replacements) {
  if (!source.includes(from)) throw new Error(`free-funnel migration anchor missing: ${from.slice(0, 80)}`);
  source = source.replace(from, to);
}

const testModule = new Module(originalPath, module);
testModule.filename = originalPath;
testModule.paths = Module._nodeModulePaths(path.dirname(originalPath));
testModule._compile(source, originalPath);
