"use strict";
const assert = require("node:assert/strict");
const { buildEvidence, evidenceQuality, buildFullReport, singleVariableExperiment } = require("../netlify/functions/_lib/report.js");

const evidence = buildEvidence([
  { questionId: "Q-HUNGER", value: "Орой өлсдөг" },
  { questionId: "Q-HUNGER", value: "Давхардсан" },
  { questionId: "Q-SATIETY", value: "Цадах дохио оройтож мэдрэгддэг" },
  { questionId: "Q-EMOTION", value: "Стресстэй үедээ хоол иддэг" },
  { questionId: "Q-CUE", value: "Хоол харагдахад хүсэл нэмэгддэг" },
  { questionId: "Q-SLEEP-DURATION", value: "6 цаг" },
  { questionId: "Q-SLEEP-QUALITY", value: "Тасалддаг" },
  { questionId: "Q-MEAL-RHYTHM", value: "Хоол хоорондын зай уртсах" },
  { questionId: "Q-MOVEMENT", value: "Суугаа" }
], [{ checkpointId: "C-1", text: "Ерөнхий тайлбар" }]);
assert.equal(evidence.filter(item => item.questionId === "Q-HUNGER").length, 1);
assert(evidence.every(item => ["questionId", "dimension", "sourceType", "text", "direct"].every(key => Object.hasOwn(item, key))));
assert.equal(evidence.find(item => item.questionId === "C-1").direct, false);
assert.equal(evidenceQuality(evidence).mode, "sufficient");

const report = buildFullReport(evidence, new Date("2026-01-01T00:00:00Z"));
assert.equal(report.mode, "sufficient");
assert(report.primaryPattern);
assert(report.experiment);
assert.deepEqual(Object.keys(report.experiment), ["variable", "action", "observe", "keepConstant"]);
assert(!JSON.stringify(report.experiment).includes("Үүнтэй зэрэгцүүлж"));
assert(!JSON.stringify(report).includes("Итгэлцлийн түвшин"));
assert(!JSON.stringify(report).includes("хамгийн магадлалтай гол хэв маяг"));
assert(!JSON.stringify(report).includes("7 хоногт 0.45–0.9 кг"));

const limited = buildFullReport(buildEvidence([
  { questionId: "Q-HUNGER", value: "Орой" }, { questionId: "Q-EMOTION", value: "Стресс" },
  { questionId: "Q-CUE", value: "Харагдах" }, { questionId: "Q-MOVEMENT", value: "Суугаа" }
]));
assert.equal(limited.mode, "limited");
assert.equal(limited.primaryPattern, null);
assert.equal(limited.experiment, null);
assert.match(limited.sections[0].body, /хүрэлцэхгүй/);

const insufficient = buildFullReport(buildEvidence([{ questionId: "Q-HUNGER", value: "Орой" }]));
assert.equal(insufficient.mode, "insufficient");
assert.equal(insufficient.primaryPattern, null);
assert.equal(insufficient.experiment, null);
assert.match(insufficient.sections[0].body, /мэдээлэл хүрэлцэхгүй/);

const oneVariable = singleVariableExperiment({ dimension: "хооллох хэмнэл" });
assert.equal(oneVariable.variable, "хооллох хэмнэл");
console.log("report evidence and mode tests passed");
