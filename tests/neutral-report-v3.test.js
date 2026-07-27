"use strict";
const assert = require("node:assert/strict");
const app = require("../app.js");
const { buildEvidence, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");

const answers = {
  "Q-AGE": 45, "Q-SEX": "Эрэгтэй", "Q-HEIGHT": 169, "Q-WEIGHT": 84, "Q-TARGET": 78,
  "Q-MEAL-RHYTHM": "5 цагаас урт", "Q-HUNGER": "Амар", "Q-SATIETY": "Амар", "Q-PORTION": ["Тодорхой хоол байхгүй"],
  "Q-EMOTION": "Тодорхой биш", "Q-CUE": ["Аль нь ч үгүй"], "Q-SLEEP-DURATION": "6–8 цаг", "Q-SLEEP-QUALITY": "Сайн амардаг",
  "Q-TRAVEL": "Машинаар", "Q-MOVEMENT": "Маш бага", "Q-BLOOD-PRESSURE": "Хэвийн хэмжээнээс бага эсвэл их гарч байсан",
  "Q-METHOD-PAST": ["Дасгал хөдөлгөөн"], "Q-METHOD-DURATION": "1 жилээс урт", "Q-METHOD-STOP": "Гэмтлийн улмаас өмнөх хөдөлгөөнөө зогсоосон",
  "Q-METHOD-RESULT": "Жин буурсан", "Q-METHOD-REGAIN": "Ихэнх нь эргэн нэмэгдсэн", "Q-METHOD-BARRIERS": ["Цагийн хуваарь", "Зардал"]
};
const rows = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
const report = buildFullReport(buildEvidence(rows), new Date("2026-07-17T00:00:00Z"));
assert.equal(report.influencingPatterns.length, 0);
assert(report.neutralResult, "neutral result remains honest");
assert(report.previousAttemptAnalysis.paragraphs.join(" ").includes("нэг жилээс урт"));
assert(report.previousAttemptAnalysis.paragraphs.join(" ").includes("гэмтлийн улмаас"));
assert(report.contextualFactors.some(item => item.id === "low_movement"));
assert(report.contextualFactors.some(item => item.id === "meal_gap_secondary"));
assert(report.neutralResult.bodyGoalContext.bmi === 29.4);
assert.equal(report.neutralResult.bodyGoalContext.differenceKg, 6);
assert(report.neutralResult.bodyGoalContext.disclaimer.includes("ерөнхий скрининг"));
const rendered = app._test.buildReportSections(publicReport(report)).filter(section => section.visible).map(section => `${section.heading} ${section.paragraphs.join(" ")}`).join(" ");
for (const heading of ["Таны гол дүгнэлт", "Таны биеийн болон зорилгын суурь зураг", "Гол саад болж харагдаагүй зүйлс", "Одоогоор илүү чухал харагдаж буй нөхцөл", "Өмнөх оролдлогоос харагдсан хэлхээ", "Танд байгаа бодит давуу тал", "Эхний ажиглалт, туршилт", "Хэзээ мэргэжлийн хүнтэй зөвлөлдөх вэ?", "Энэ тайлангийн хязгаар"]) assert(rendered.includes(heading), heading);
assert(rendered.includes("Хоолны зай таван цагаас уртсаж"));
assert(!rendered.includes("Q-METHOD") && !rendered.includes("internalEvidenceMap"));
assert.equal(app._test.reportDateUB("2026-07-16T16:00:00.000Z"), "2026.07.17");
console.log("neutral report v3 tests passed");
