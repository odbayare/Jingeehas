"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const questions = require("../questions.js");
const { mappingCoverage } = require("../netlify/functions/_lib/report-signals.js");
const { calculateAssessmentSafety, ROUTE_COPY } = require("../netlify/functions/_lib/safety.js");

const V3 = "jingeehas-production-2026-08-v3-routing-safety";
assert.equal(questions.ROUTING_SAFETY_QUESTIONNAIRE_VERSION, V3);
assert.equal(questions.PREVIOUS_QUESTIONNAIRE_VERSION, "jingeehas-production-2026-07-v2-method-link");

const route = (answers, version = V3) => questions.visibleQuestions(answers, version);
const ids = (answers, version = V3) => route(answers, version).map(question => question.id);

assert(!ids({ "Q-METHOD-PAST": ["Ямар нэг арга хэрэглэж үзээгүй"] }).includes("OPEN-PAST"), "no-history route must hide OPEN-PAST");
assert(ids({ "Q-METHOD-PAST": ["Алхалт"] }).includes("OPEN-PAST"), "history route must show OPEN-PAST");

const femaleIds = ids({ "Q-SEX": "Эмэгтэй" });
assert(femaleIds.includes("PREG-GATE"));
assert(femaleIds.includes("PREG-BREASTFEEDING"), "breastfeeding status must be independently recordable");
assert(!ids({ "Q-SEX": "Эрэгтэй" }).includes("PREG-BREASTFEEDING"));
assert.equal(questions.questionById("PREG-BREASTFEEDING", V3).parent, "Q-SEX", "breastfeeding must remain a sibling of pregnancy/postpartum status");
assert.deepEqual(questions.questionById("PREG-GATE", V3).options, ["Үгүй", "Жирэмсэн", "Төрсний дараах 0–6 сар", "Төрсний дараах 6–24 сар", "Хариулахгүй"]);

assert(!ids({ "Q-METHOD-PAST": ["Алхалт"], "Q-METHOD-RESULT": "Жин тогтвортой байсан" }).includes("Q-METHOD-REGAIN"));
assert(ids({ "Q-METHOD-PAST": ["Алхалт"], "Q-METHOD-RESULT": "Жин буурсан" }).includes("Q-METHOD-REGAIN"));
assert.deepEqual(questions.questionById("Q-METHOD-REGAIN", V3).options, ["Цааш буурсан", "Тогтвортой байсан", "Бага зэрэг нэмэгдсэн", "Нэлээд нэмэгдсэн", "Өмнөхөөс илүү нэмэгдсэн", "Тодорхой санахгүй"]);

assert(ids({ "S1-S03": "Сүүлийн 28 хоногт байсан" }).includes("S1-S03-TYPE"));
assert(ids({ "S1-S03": "Сүүлийн 28 хоногт байсан" }).includes("S1-S03-FREQUENCY"));
assert(!ids({ "S1-S03": "Үгүй" }).includes("S1-S03-TYPE"));
assert(ids({ "S1-S04": "Хааяа" }).includes("S1-S04-NOW"));
assert(!ids({ "S1-S04": "Үгүй" }).includes("S1-S04-NOW"));

for (const newId of ["PREG-BREASTFEEDING", "S1-S03-TYPE", "S1-S03-FREQUENCY", "S1-S04-NOW"]) {
  assert(!ids({}, questions.PREVIOUS_QUESTIONNAIRE_VERSION).includes(newId), `${newId} must not enter V2 assessments`);
  assert(!ids({}, questions.LEGACY_QUESTIONNAIRE_VERSION).includes(newId), `${newId} must not enter legacy assessments`);
}
assert(ids({ "Q-METHOD-PAST": ["Алхалт", "Өөр арга"] }, V3).includes("Q-METHOD-LONGEST"), "V2 method-link question must remain available in V3");

const cue = questions.questionById("Q-CUE", V3);
assert.equal(questions.validateAnswer(cue, ["Аль нь ч үгүй", "Хоол харагдах"], { answers: {}, version: V3 }), "Зөв хариулт сонгоно уу.");
assert.equal(questions.validateAnswer(cue, ["Аль нь ч үгүй"], { answers: {}, version: V3 }), "");
const food = questions.questionById("Q-FOOD-FEELING", V3);
assert.equal(questions.validateAnswer(food, ["Тодорхой хоол анзаараагүй", "Гурилан хоол"], { answers: {}, version: V3 }), "Зөв хариулт сонгоно уу.");

assert.equal(calculateAssessmentSafety({ "S1-S04": "Хааяа" }).route, "confirmation_required", "V3 recent self-harm answer must not complete without immediate-risk confirmation");
assert.equal(calculateAssessmentSafety({ "S1-S04": "Хааяа", "S1-S04-NOW": "Тийм" }).route, "urgent_self_harm");
assert.equal(calculateAssessmentSafety({ "S1-S04": "Олон өдөр", "S1-S04-NOW": "Эргэлзэж байна" }).route, "urgent_self_harm");
assert.equal(calculateAssessmentSafety({ "S1-S04": "Хааяа", "S1-S04-NOW": "Үгүй" }).route, "mental_health_support");
assert.equal(calculateAssessmentSafety({ "S1-S03": "Сүүлийн 28 хоногт байсан" }).route, "eating_behavior_professional");
assert.equal(calculateAssessmentSafety({ "S1-S03": "Өмнө байсан, сүүлийн 28 хоногт байгаагүй", "S1-S04": "Үгүй", "S1-B01": ["Аль нь ч үгүй"] }).route, "eligible");
assert(ROUTE_COPY.urgent_self_harm.body.includes("103 дугаарт залгах"));
assert(!ROUTE_COPY.mental_health_support.body.includes("төлбөр"));

const coverage = mappingCoverage(questions.QUESTIONS);
assert.equal(coverage.percent, 100);
assert.deepEqual(coverage.unmappedQuestions, []);
assert.deepEqual(coverage.unmappedOptions, []);

const distQuestionsPath = path.join(__dirname, "..", "dist", "questions.js");
const generatedReportPath = path.join(__dirname, "..", ".generated-copy-hotfix", "netlify", "functions", "_lib", "report.js");
const distAppPath = path.join(__dirname, "..", "dist", "app.js");
assert(fs.existsSync(distQuestionsPath), "production build must exist before V3 regression test");
const deployedQuestions = require(distQuestionsPath);
assert.equal(deployedQuestions.ROUTING_SAFETY_QUESTIONNAIRE_VERSION, V3);
assert(deployedQuestions.visibleQuestions({ "S1-S04": "Хааяа" }, V3).some(question => question.id === "S1-S04-NOW"));

const appSource = fs.readFileSync(distAppPath, "utf8");
assert(appSource.includes("Таны тайланд ${escapeHtml(patternCount)} хэв маяг илэрлээ"), "personalized pattern-count heading is missing");
assert(appSource.includes("чухал уялдаа холбоо"), "supported interaction-count copy is missing");
assert(appSource.includes("бие биеийнхээ нөлөөг нэмэгдүүлж"), "approved interaction effect copy is missing");
assert(appSource.includes("батлагдсан хүчтэй давхцал илрээгүй"), "zero-interaction safety branch is missing");
assert(appSource.includes("Таны тайланд хүчтэй давамгай нэг хэв маяг илрээгүй"), "neutral result branch is missing");
assert(!appSource.includes("бие биеэ хүчтэй болгон"));
assert(appSource.includes('"S1-S04": ["S1-S04-NOW"]'));
assert(!appSource.includes('"PREG-GATE": ["PREG-"]'), "changing pregnancy/postpartum status must not clear independent breastfeeding state");
assert(appSource.includes('questionApi.questionById(input.dataset.question, state.questionnaireVersion)'));

const { buildEvidence, buildFullReport, publicReport } = require(generatedReportPath);
const sleepReport = publicReport(buildFullReport(buildEvidence([
  { questionId: "Q-SLEEP-DURATION", value: "4 цагаас 6 цаг хүрэхгүй" },
  { questionId: "Q-SLEEP-QUALITY", value: "Тааруу" },
  { questionId: "Q-METHOD-BARRIERS", value: ["Ядаргаа эсвэл нойр"] }
], [], { questionnaireVersion: V3 }), new Date("2026-08-06T00:00:00Z"), { questionnaireVersion: V3 }));
const sleepText = JSON.stringify(sleepReport);
for (const unsupported of ["тасалдсан", "оройдоо", "оройн хоол", "оройн ядаргаа", "маргааш ядарсан үед хамгийн ойр байгаа хоол"]) {
  assert(!sleepText.includes(unsupported), `V3 report must not infer unsupported detail: ${unsupported}`);
}

console.log("questionnaire V3 safety, routing, and evidence tests passed");
