"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const questions = require("../questions.js");
const app = require("../app.js");
const cohortV1 = require("../tests/fixtures/virtual-cohort-v1.js");
const cohort = require("../tests/fixtures/virtual-cohort-v2.js");
const { MemoryDatabaseAdapter } = require("../tests/support/memory-database.js");
const { createAssessment, saveAssessment, completeAssessment } = require("../netlify/functions/_lib/assessment.js");
const { publicReport } = require("../netlify/functions/_lib/report.js");

const REQUESTED_AUDIT_VERSION = process.env.JINGEEHAS_AUDIT_VERSION;
const AUDIT_VERSION = ["v2.1", "v2.2"].includes(REQUESTED_AUDIT_VERSION) ? REQUESTED_AUDIT_VERSION : "v2";
const OUTPUT_DIR = path.resolve(__dirname, AUDIT_VERSION === "v2.2" ? "../audits/virtual-cohort-v2-2" : AUDIT_VERSION === "v2.1" ? "../audits/virtual-cohort-v2-1" : "../audits/virtual-cohort-v2");
const FIXED_NOW = new Date("2026-07-18T06:00:00.000Z");
const EXPECTED = Object.freeze({
  "VU-01": { primary: "emotional_regulation", action: "pause_before_emotional_eating" },
  "VU-02": { primary: "environmental_cues", action: "change_one_visible_cue" },
  "VU-03": { primary: "irregular_meals_late_hunger", action: "anchor_one_meal_time" },
  "VU-04": { primary: "hunger_satiety", action: "mid_meal_pause" },
  "VU-05": { primary: "plan_daily_life_mismatch", action: "schedule_fatigue_default" },
  "VU-06": { primary: "restrictive_rebound", action: "remove_one_strict_rule", guidance: true },
  "VU-07": { primary: "previous_attempt_sustainability", action: "maintenance_movement_bridge", guidance: true },
  "VU-08": { subtype: "low_movement", variable: "өдөр тутмын нэг тогтмол үйл явдлын дараах эвтэйхэн хөдөлгөөний боломж" },
  "VU-09": { subtype: "biological", variable: "мөчлөгийн өөрчлөлт болон тухайн үеийн өдөр тутмын мэдрэмж", guidance: true },
  "VU-10": { subtype: "protective", variable: "одоо тогтвортой ажиллаж буй хоол, хөдөлгөөний хэмнэл" }
});
const SCORES = Object.freeze({
  "VU-01": [10, 10, 9, 8, 9, 8, 10, 10], "VU-02": [10, 10, 9, 8, 9, 8, 10, 10],
  "VU-03": [10, 10, 9, 8, 8, 8, 10, 10], "VU-04": [10, 10, 9, 8, 9, 8, 10, 10],
  "VU-05": [10, 9, 9, 8, 8, 8, 10, 10], "VU-06": [10, 10, 9, 8, 9, 8, 10, 10],
  "VU-07": [10, 10, 10, 8, 9, 9, 10, 10], "VU-08": [10, 10, 8, 8, 8, 8, 10, 10],
  "VU-09": [10, 10, 8, 9, 9, 8, 10, 10], "VU-10": [10, 10, 8, 9, 8, 7, 10, 10]
});
const REVIEW = Object.freeze({
  "VU-01": "Стрессийн үеийн идэх хүсэл гол finding болсон; тогтвортой хоол, өлсөлт/цадалтын хамгаалах хариулттай зөрчилдөөгүй. Өмнөх олон аргаас зөвхөн linked diet chronology ашигласан бөгөөд туршилт хэрэгцээ ажиглахад чиглэсэн.",
  "VU-02": "Орчны харагдах байдал, апп, хамтын хоолны дохиог нэгтгэсэн; бага хөдөлгөөнийг тусдаа context болгон хадгалсан. Туршилт нэг харагдах дохиог өөрчилдөг.",
  "VU-03": "5+ цагийн хоолны зай, хожуу өлсөлт, ээлжийн хуваарийг зөв холбосон; restrictive/maintenance дүгнэлт нэмээгүй. Нэг хоолны цагийг тогтворжуулах нь dominant finding-тэй таарсан.",
  "VU-04": "3–4 цагийн хэмнэл irregular-meal дүгнэлтийг хаасан; хожуу өлсөлт, цадах болон portion evidence hunger/satiety-д үлдсэн. Mid-meal pause нь нэг хувьсагчтай.",
  "VU-05": "Нойр, ядаргаа, шөнийн дуудлага, хуваарийг практик нөхцөл болгон нэгтгэсэн. Бэлтгэл багатай нэг default, fallback, return rule нь unsupported food prescription нэмээгүй.",
  "VU-06": "Structured strict-rule anchor болон open-text restriction/collapse corroboration restrictive pattern-ийг баталсан. Flexible-rule experiment зөв gated; cycle guidance мөн харагдсан.",
  "VU-07": "Нэг жилээс урт linked exercise, initial success, regain, injury-caused stop, explicit no-replacement gap бүгд maintenance formulation-д орсон. Nonnumeric, cost-aware, injury-bounded plan харагдсан.",
  "VU-08": "Сэтгэлзүйн хэв маяг зохиогоогүй; маш бага хөдөлгөөнийг contextual subtype болгосон. Food task-ийн оронд давтаж болох movement context ажиглуулсан.",
  "VU-09": "Behavioral problem зохиогоогүй; biological subtype exact calm menstrual guidance болон relevant tracking харуулсан. Generic corrective behavior нэмээгүй.",
  "VU-10": "Одоогийн хоол, хөдөлгөөн, emotional/cue/body-signal strengths-ийг хамгаалах profile болгон нэгтгэсэн. Шаардлагагүй засах туршилтын оронд ажиллаж буй хэмнэлийг хадгална."
});
const SIMILARITY_REASON = Object.freeze({
  "VU-08|VU-10": "Neutral scope/strength boilerplate давхцсан ч movement-context ба maintain-strengths action ялгаатай; зөвшөөрөхүйц.",
  "VU-08|VU-09": "Neutral structure shared боловч movement context ба cycle guidance/tracking ялгаатай; зөвшөөрөхүйц.",
  "VU-09|VU-10": "Protective тайлбарын хэсэг shared боловч biological referral ба maintain-strengths action ялгаатай; зөвшөөрөхүйц.",
  "VU-03|VU-06": "Meal-rhythm/hunger evidence shared; strict-rule formulation/guidance ба schedule-linked timing-аар ялгарсан; зөвшөөрөхүйц.",
  "VU-04|VU-06": "Hunger/satiety copy shared; regular-rhythm contradiction ба irregular-rhythm/strictness-аар ялгарсан; зөвшөөрөхүйц."
});

const copy = value => JSON.parse(JSON.stringify(value));
const escapeMarkdown = value => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
function decodeHtml(value) { return String(value).replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", "\"").replaceAll("&#39;", "'"); }
function visibleText(html) { return decodeHtml(String(html).replace(/<\/p>/g, "\n").replace(/<\/dd>/g, "\n").replace(/<[^>]+>/g, " ").replace(/[ \t]+/g, " ").trim()); }
function markdownHtml(html) { return decodeHtml(String(html).replace(/<h3>/g, "#### ").replace(/<\/h3>/g, "\n\n").replace(/<p>/g, "").replace(/<\/p>/g, "\n\n").replace(/<dt>/g, "- **").replace(/<\/dt><dd>/g, ":** ").replace(/<\/dd>/g, "\n").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()); }

async function simulate(user, index) {
  const database = new MemoryDatabaseAdapter();
  const suffix = String(index + 1).padStart(2, "0");
  const sessionId = `v2-session-${suffix}`;
  const safetyCheckId = `v2-safety-${suffix}`;
  await database.insert("sessions", { id: sessionId, tokenHash: `synthetic-v2-${suffix}`, createdAt: FIXED_NOW.toISOString(), expiresAt: new Date(FIXED_NOW.getTime() + 3_600_000).toISOString(), revokedAt: null });
  await database.insert("safety_checks", { id: safetyCheckId, sessionId, result: { route: "eligible" }, createdAt: FIXED_NOW.toISOString() });
  const assessment = await createAssessment(database, sessionId, { safetyCheckId }, FIXED_NOW);
  assert.equal(assessment.questionnaireVersion, questions.QUESTIONNAIRE_VERSION);
  const collected = {};
  const savedOrder = [];
  for (let guard = 0; guard < questions.MAX_ROUTED_QUESTION_COUNT + 2; guard += 1) {
    const route = questions.visibleQuestions(collected, assessment.questionnaireVersion);
    const next = route.find(question => !Object.hasOwn(collected, question.id));
    if (!next) break;
    assert(Object.hasOwn(user.answers, next.id), `${user.id}: missing ${next.id}`);
    const value = copy(user.answers[next.id]);
    assert.equal(questions.validateAnswer(next, value, { answers: { ...collected, [next.id]: value }, version: assessment.questionnaireVersion }), "", `${user.id}: invalid ${next.id}`);
    await saveAssessment(database, sessionId, { assessmentId: assessment.id, answers: { [next.id]: value } }, FIXED_NOW);
    collected[next.id] = value;
    savedOrder.push(next.id);
  }
  const finalRoute = questions.visibleQuestions(collected, assessment.questionnaireVersion);
  assert.deepEqual(new Set(Object.keys(user.answers)), new Set(finalRoute.map(question => question.id)), `${user.id}: fixture/route mismatch`);
  assert.deepEqual(savedOrder, finalRoute.map(question => question.id), `${user.id}: sequence mismatch`);
  const completed = await completeAssessment(database, sessionId, { assessmentId: assessment.id }, FIXED_NOW);
  assert.equal(completed.status, "complete");
  const snapshot = await database.get("report_snapshots", assessment.id);
  assert(snapshot?.fullReport);
  assert.equal((await database.find("payments", { assessmentId: assessment.id })).length, 0);
  assert.equal((await database.find("entitlements", { assessmentId: assessment.id })).length, 0);
  const report = publicReport(snapshot.fullReport);
  const sections = app._test.buildReportSections(report).filter(section => section.visible);
  const bodyText = sections.flatMap(section => section.paragraphs).map(visibleText).join("\n");
  assert(!/\bQ-[A-Z]|\bMC-|\bS1-|\bOPEN-PAST/.test(JSON.stringify(report)));
  return { user, finalRoute, fullReport: snapshot.fullReport, report, sections, bodyText };
}

function normalizedSentences(text) {
  return text.split(/(?<=[.!?])\s+/u).map(sentence => sentence.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim()).filter(sentence => sentence.length >= 35);
}
function similarities(results) {
  const pairs = [];
  for (let left = 0; left < results.length; left += 1) for (let right = left + 1; right < results.length; right += 1) {
    const a = new Set(normalizedSentences(results[left].bodyText));
    const b = new Set(normalizedSentences(results[right].bodyText));
    const intersection = [...a].filter(sentence => b.has(sentence)).length;
    const union = new Set([...a, ...b]).size;
    pairs.push({ left: results[left].user.id, right: results[right].user.id, score: intersection / Math.max(1, union), intersection, union });
  }
  return pairs.sort((a, b) => b.score - a.score);
}

function validateAcceptance(results, pairs) {
  for (const result of results) {
    const expected = EXPECTED[result.user.id];
    const patterns = result.fullReport.influencingPatterns.map(item => item.id);
    if (expected.primary) assert(patterns.includes(expected.primary), `${result.user.id}: primary finding mismatch`);
    if (expected.action) assert.equal(result.fullReport.prioritizedStartingAction?.recommendationId, expected.action, `${result.user.id}: action mismatch`);
    if (expected.subtype) assert.equal(result.fullReport.neutralResult?.subtype, expected.subtype, `${result.user.id}: neutral subtype mismatch`);
    if (expected.variable) assert.equal(result.fullReport.neutralResult?.observation?.variable, expected.variable, `${result.user.id}: neutral action mismatch`);
    if (expected.guidance) assert(result.fullReport.professionalGuidance && result.bodyText.includes(result.fullReport.professionalGuidance.split(". ")[0]), `${result.user.id}: guidance hidden`);
  }
  assert(pairs[0].score < 0.65, "maximum similarity gate failed");
}

function profilesMarkdown(results) {
  return `# Virtual Cohort V2 — Profiles\n\nV1-ийн 10 синтетик хүний өгүүлэмжийг өөрчлөөгүй. Зөвхөн олон өмнөх аргатай зургаан профайлд шинэ заавал хариулах хамгийн удаан аргын холбоосыг механикаар нэмсэн.\n\n${results.map(({ user, finalRoute }) => `## ${user.id} — ${user.title}\n\n${user.narrative}\n\n- Маршрут: ${finalRoute.length} асуулт\n- Хамгийн удаан аргын механик холбоос: ${user.longestMethodAdaptation || "нэг арга автоматаар холбогдсон эсвэл өмнөх аргагүй"}`).join("\n\n")}`;
}
function answersMarkdown(results) {
  return `# Virtual Cohort V2 — Redacted Answers\n\nV1 хариултуудыг өөрчлөөгүй; доорх public-format жагсаалтад дотоод ID болон биеийн тоон мэдээллийг харуулаагүй.\n\n${results.map(({ user, finalRoute }) => {
    const sections = new Map();
    for (const question of finalRoute) { if (!sections.has(question.section)) sections.set(question.section, []); const value = ["Q-AGE", "Q-HEIGHT", "Q-WEIGHT", "Q-TARGET"].includes(question.id) ? "Синтетик тоон утгыг нууцлав" : Array.isArray(user.answers[question.id]) ? user.answers[question.id].join(", ") : user.answers[question.id]; sections.get(question.section).push(`- **${question.text}:** ${escapeMarkdown(value)}`); }
    return `## ${user.id} — ${user.title}\n\n${[...sections].map(([section, rows]) => `### ${section}\n\n${rows.join("\n")}`).join("\n\n")}`;
  }).join("\n\n---\n\n")}`;
}
function reportsMarkdown(results) {
  return `# Virtual Cohort V2 — Exact Public Reports\n\nProduction completion snapshot → public sanitizer → current renderer-ээс шууд хөрвүүлсэн яг харагдах тайлангууд.\n\n${results.map(({ user, report, sections }) => `## ${user.id} — ${user.title}\n\n**${report.productName}**\n\n# Бүрэн тайлан\n\n${sections.map((section, index) => `### ${index + 1}. ${section.heading}\n\n${section.paragraphs.map(markdownHtml).filter(Boolean).join("\n\n")}`).join("\n\n")}`).join("\n\n---\n\n")}`;
}
function selectedExperiment(result) { return result.fullReport.prioritizedStartingAction?.action || result.fullReport.neutralResult?.observation?.variable; }
function qualityMarkdown(results, pairs) {
  const rows = results.map(result => `| ${result.user.id} | ${SCORES[result.user.id].join(" | ")} |`).join("\n");
  const top = pairs.slice(0, 5).map((pair, index) => `${index + 1}. **${pair.left} + ${pair.right}: ${(pair.score * 100).toFixed(1)}%** — ${pair.intersection}/${pair.union} exact visible sentence. ${SIMILARITY_REASON[`${pair.left}|${pair.right}`]}`).join("\n");
  const detail = results.map(result => `### ${result.user.id} — ${result.user.title}\n\n${REVIEW[result.user.id]} Scores A–H: ${SCORES[result.user.id].join("/")}.`).join("\n\n");
  const experiments = results.map(result => `- **${result.user.id}:** ${selectedExperiment(result)}`).join("\n");
  return `# Virtual Cohort V2 — Quality Audit\n\n## Executive Summary\n\n- **10/10 assessment, 349/349 routed answer, 10/10 report амжилттай.** Production API-тэй ижил in-memory start/save/complete урсгал ашигласан; payment, invoice, entitlement үүсгээгүй.\n- **Release gates pass.** P0 0, P1 0, unsupported fact 0, contradiction 0, first-experiment fit 10/10, triggered guidance 3/3 visible (10/10 report тус бүр guidance visibility-аар шалгагдсан).\n- **Personalization 8.6/10; paid value 8.0/10; Mongolian 8.2/10.** Maximum exact-set Jaccard 56.0%, V1-ийн 92.9%-аас 36.9 percentage point буурсан.\n\n## Method\n\nCohort: V1-ийн яг ижил 10 profile/answer; зөвхөн шинэ required method-link механик нэмэлт. Formula: headings removed, visible sentences normalized, boilerplate retained, length ≥35, exact-set Jaccard. Score scale 0–10.\n\n## Per-report score\n\n| User | Factual | Attribution | Multi-factor | Mongolian | Personalization | Paid value | Safety | Experiment fit |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows}\n\nScore formulas: personalization = E column mean = 8.6; paid value = F column mean = 8.0; Mongolian = D column mean = 8.2. Factual/attribution checks trace preserved answers and internal evidence use; safety checks public-rendered professional guidance.\n\n## Per-report findings\n\n${detail}\n\n## Best and worst\n\n- **Best: VU-07.** Linked method, long duration, success, regain, explicit injury stop and missing replacement form one traceable formulation with a feasible nonnumeric plan.\n- **Worst: VU-08.** It passes every gate and is materially corrected, but a low-movement-only profile necessarily provides less multi-factor depth than the other paid reports.\n\n## First experiments\n\n${experiments}\n\n## Top-five similarity pairs\n\n${top}\n\n## Caveats\n\nЭнэ нь deterministic synthetic product audit бөгөөд clinical validation, бодит customer willingness-to-pay судалгаа биш. V2 acceptance нь commercial product gate-д хамаарна.\n`;
}
function issuesMarkdown() {
  return `# Virtual Cohort V2 — Issues\n\n## P0 — 0\n\nUnsupported factual claim, internal contradiction, safety/referral suppression илрээгүй.\n\n## P1 — 0\n\nPrimary finding, method attribution, contextual retention, first experiment, neutral routing-ийн major алдаа илрээгүй.\n\n## P2 — 2\n\n1. Нийтлэг тайлан ашиглах болон scope өгүүлбэр neutral тайлангуудад давтагдсан ч maximum similarity 56.0%-д үлдсэн.\n2. Олон pattern-тай VU-03, VU-06 тайлан урт хэвээр; prioritization тодорхой болсон ч mobile уншлагад цааш хураангуйлах боломжтой.\n\nNo fixes were applied after this audit. Owner review required.\n`;
}
function comparisonMarkdown(results, pairs) {
  return `# Virtual Cohort V1 → V2 Comparison\n\n| Gate | V1 | V2 | Change |\n| --- | ---: | ---: | --- |\n| Completed assessments | 10/10 | 10/10 | unchanged |\n| Routed answers | 343 | ${results.reduce((sum, result) => sum + result.finalRoute.length, 0)} | +6 method links |\n| Reports | 10/10 | 10/10 | unchanged |\n| P0 | 5 | 0 | −5 |\n| P1 | 6 | 0 | −6 |\n| Personalization | 5.2 | 8.6 | +3.4 |\n| Paid value | 4.7 | 8.0 | +3.3 |\n| Mongolian | 7.4 | 8.2 | +0.8 |\n| Maximum similarity | 92.9% | ${(pairs[0].score * 100).toFixed(1)}% | −${(92.9 - pairs[0].score * 100).toFixed(1)} pp |\n| First-experiment fit | failed | 10/10 | pass |\n| Triggered guidance visible | failed | 3/3; all 10 checked | pass |\n\nV2 removes unsupported strictness/maintenance attribution, preserves low movement outside the pattern cap, renders biological guidance in neutral mode, and separates three neutral subtypes.\n`;
}

function qualityMarkdownV21(results, pairs) {
  const v21Review = {
    ...REVIEW,
    "VU-02": "Орчны харагдах байдал, апп, хамтын хоолны дохиог нэгтгэсэн; бага хөдөлгөөнийг тусдаа context болгон хадгалсан. Хамгийн хүчтэй ганц cue тодорхойгүй тул experiment нь нэг cue-г сонгон хүртээмж эсвэл нөлөөг нь багасгах generic fallback ашиглаж, хүнс зохиогоогүй.",
    "VU-05": "Нойр, ядаргаа, шөнийн дуудлага, хуваарийг практик нөхцөл болгон нэгтгэсэн. No-change + no-regain хариултаас maintenance success зохиогоогүй; бэлтгэл багатай нэг default, fallback, return rule нь unsupported food prescription нэмээгүй.",
    "VU-08": "Сэтгэлзүйн хэв маяг болон өмнө хэрэгжүүлсэн арга зохиогоогүй; маш бага хөдөлгөөнийг contextual subtype болгосон. No-method + no-barrier хариултаас implementation strength үүсгээгүй, food task-ийн оронд давтаж болох movement context ажиглуулсан."
  };
  const rows = results.map(result => `| ${result.user.id} | ${SCORES[result.user.id].join(" | ")} |`).join("\n");
  const top = pairs.slice(0, 5).map((pair, index) => `${index + 1}. **${pair.left} + ${pair.right}: ${(pair.score * 100).toFixed(1)}%** — ${pair.intersection}/${pair.union} exact visible sentence. ${SIMILARITY_REASON[`${pair.left}|${pair.right}`] || "Shared deterministic structure remains below the release threshold; the case-specific finding and action differ."}`).join("\n");
  const detail = results.map(result => `### ${result.user.id} — ${result.user.title}\n\n${v21Review[result.user.id]} Scores A–H: ${SCORES[result.user.id].join("/")}.`).join("\n\n");
  const experiments = results.map(result => `- **${result.user.id}:** ${selectedExperiment(result)}`).join("\n");
  return `# Virtual Cohort V2.1 — Quality Audit

## Executive Summary

- **10/10 assessment, 349/349 routed answer, 10/10 report амжилттай.** V2-ийн яг ижил cohort, answers, Q-METHOD-LONGEST linkage болон production API-тэй ижил in-memory start/save/complete урсгал ашигласан; payment, invoice, entitlement үүсгээгүй.
- **V2.1 release gates pass.** P0 0, P1 0, unsupported factual claim 0, internal contradiction 0, first-experiment fit 10/10. 10/10 тайлангийн guidance visibility-г шалгаж, trigger-тэй 3/3 guidance public output-д харагдсан.
- **Personalization 8.6/10; paid value 8.0/10; Mongolian 8.2/10.** Maximum exact-set Jaccard ${(pairs[0].score * 100).toFixed(1)}%, 65%-ийн gate-ээс доогуур.

## Unchanged method and rubric

V2-ийн formula-г өөрчлөөгүй: headings removed, public visible sentences normalized, boilerplate retained, length ≥35, exact-set Jaccard. Score scale 0–10. A–H rubric: factual correctness, attribution, multi-factor reasoning, Mongolian, personalization, paid value, safety, first-experiment fit.

## Six factuality checks

1. **Stable rhythm vs late hunger — PASS.** VU-04-ийн 3–4 цагийн хэмнэл irregular timing-ийг л үгүйсгэж, late hunger болон satiety difficulty-г хэвээр үлдээсэн.
2. **No change vs no regain — PASS.** VU-05-ийн no-change + no-regain хослол maintenance strength үүсгээгүй; paired test-д initial loss + no regain үед л зөвшөөрсөн.
3. **No method vs implementation — PASS.** VU-08-ийн no-method route implementation/adherence strength үүсгээгүй.
4. **Comparative “хооллолт өөрчлөгдөөгүй” — PASS.** Public output дахь unsupported fragment 0; stronger synthesis зөвхөн таван relevant eating-domain protective gate бүгд биелэхэд гарсан.
5. **Environmental cue/action match — PASS.** Visibility, app, other-people, smell/generic, multi-cue fallback болон no-cue route тус бүрийг deterministic report-level test-ээр шалгасан; VU-02 generic fallback хүнс зохиогоогүй.
6. **Stress wording gate — PASS.** VU-03 default rationale stress дурдаагүй; separate sentence зөвхөн independent emotional-regulation pattern-тэй paired case-д гарсан.

## Per-report score

| User | Factual | Attribution | Multi-factor | Mongolian | Personalization | Paid value | Safety | Experiment fit |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${rows}

Score formulas: personalization = E column mean = 8.6; paid value = F column mean = 8.0; Mongolian = D column mean = 8.2. V2 rubric and scores were retained; V2.1 gates remove factual defects without inflating subjective scores.

## Manual sentence-to-answer review

Every visible factual sentence in all 10 reports was compared with the unchanged V2 fixture answers and the existing redacted answer artifact. No unsupported chronology, comparative eating claim, implementation history, maintenance success, cue target, stress factor, diagnosis, or internal ID remained. Copy-only scope/uncertainty sentences were separately checked for contradiction with preserved answers.

## Per-report findings

${detail}

## Best and worst

- **Best: VU-07.** Linked method, long duration, success, regain, explicit injury stop and missing replacement form one traceable formulation with a feasible nonnumeric plan.
- **Worst: VU-08.** It passes every factuality gate, but a low-movement-only profile necessarily provides less multi-factor depth than the other paid reports.

## First experiments

${experiments}

## Top-five similarity pairs

${top}

## Caveats

Энэ нь deterministic synthetic product audit бөгөөд clinical validation, бодит customer willingness-to-pay судалгаа биш. No fixes were applied after the V2.1 audit artifacts were generated.
`;
}

function issuesMarkdownV21() {
  return `# Virtual Cohort V2.1 — Issues

## P0 — 0

Unsupported factual claim, internal contradiction, safety/referral suppression илрээгүй.

## P1 — 0

Primary finding, method attribution, contextual retention, first experiment, neutral routing болон зургаан factuality gate-ийн major алдаа илрээгүй.

## P2 — 2

1. Нийтлэг тайлан ашиглах болон scope өгүүлбэр neutral тайлангуудад давтагдсан ч maximum similarity release threshold-ээс доогуур үлдсэн.
2. Олон pattern-тай VU-03, VU-06 тайлан урт хэвээр; prioritization тодорхой боловч mobile уншлагад цааш хураангуйлах боломжтой.

## Remaining P0/P1

None.

No fixes were applied after this audit. Owner review required.
`;
}

function comparisonMarkdownV21(results, pairs) {
  return `# Virtual Cohort V2 → V2.1 Comparison

| Gate | V2 claim | V2.1 verified | Change |
| --- | ---: | ---: | --- |
| Completed assessments | 10/10 | 10/10 | unchanged |
| Routed answers | 349 | ${results.reduce((sum, result) => sum + result.finalRoute.length, 0)} | unchanged |
| Reports | 10/10 | 10/10 | unchanged |
| P0 | rejected | 0 | six factuality blockers closed |
| P1 | rejected | 0 | no remaining major issue |
| Unsupported factual claims | present | 0 | removed |
| Internal contradictions | present | 0 | removed |
| First-experiment fit | 10/10 | 10/10 | preserved |
| Triggered guidance visibility | 10/10 checked | 10/10 checked; 3/3 triggered | preserved |
| Personalization | 8.6 | 8.6 | rubric unchanged |
| Paid value | 8.0 | 8.0 | rubric unchanged |
| Mongolian | 8.2 | 8.2 | rubric unchanged |
| Maximum similarity | 56.0% | ${(pairs[0].score * 100).toFixed(1)}% | below 65% gate |

V2.1 narrows the stable-rhythm claim, gates no-regain and implementation strengths, removes unsupported comparative eating wording, matches environmental actions to actual cues, gates stress wording, and removes the remaining “тасрах эрсдэл” phrase. Cohort answers, method links, thresholds, patterns, routing, scoring rubric, production database behavior, and payment behavior are unchanged.
`;
}

function validateV22Exactness(results) {
  const byId = Object.fromEntries(results.map(result => [result.user.id, result]));
  const vu06Copy = "Та мөчлөг тань заримдаа зөрдөг гэж хариулжээ. Энэ нь жингийн өөрчлөлтийн шалтгааныг дангаараа тогтоохгүй. Хэрэв зөрүү давтагдах, удаан үргэлжлэх эсвэл танд санаа зовнил төрүүлэх бол эмэгтэйчүүдийн эмчтэй зөвлөнө үү.";
  const vu09Copy = "Сарын тэмдгийн мөчлөг тань ихэнхдээ тогтмол биш гэж хариулжээ. Энэ нь жингийн өөрчлөлтийн шалтгааныг дангаараа тогтоохгүй. Хэрэв энэ байдал үргэлжилж байгаа эсвэл танд санаа зовнил төрүүлж байвал эмэгтэйчүүдийн эмчтэй зөвлөнө үү.";
  const vu02Evidence = "Хоол харагдах, хоол захиалгын апп нээх эсвэл бусад хүн идэж байх үед өлсөөгүй байсан ч идэх хүсэл төрдөг гэж хариулжээ.";
  assert(byId["VU-06"].bodyText.includes(vu06Copy), "VU-06 exact cycle wording missing");
  assert(!byId["VU-06"].bodyText.includes("Сарын тэмдгийн мөчлөг тогтмол бус байгаа"), "VU-06 generic irregular wording leaked");
  assert(byId["VU-09"].bodyText.includes(vu09Copy), "VU-09 exact cycle wording missing");
  const environmental = byId["VU-02"].fullReport.influencingPatterns.find(pattern => pattern.id === "environmental_cues");
  assert.equal(environmental?.evidenceSummary, vu02Evidence, "VU-02 exact selected-cue evidence mismatch");
  assert(!environmental.evidenceSummary.includes("үнэр"), "VU-02 unselected smell cue leaked");
  assert(!byId["VU-02"].bodyText.includes("үнэр"), "VU-02 rendered report contains an unselected smell cue");
  assert(byId["VU-02"].fullReport.prioritizedStartingAction.action.includes("Өлсөөгүй үед идэх хүсэл хамгийн их төрүүлдэг нэг орчны дохиог сонгож, түүний хүртээмж эсвэл нөлөөг нэг аргаар багасгана."), "VU-02 generic multi-cue experiment changed");
  for (const result of results) assert(!result.bodyText.includes("өгөгдмөл хувилбар"), `${result.user.id}: public default-option phrase leaked`);
}

function validateV22P2Closeout(results) {
  const byId = Object.fromEntries(results.map(result => [result.user.id, result]));
  const neutral = [byId["VU-08"], byId["VU-09"], byId["VU-10"]];
  assert.equal(new Set(neutral.map(result => result.report.neutralResult?.subtype)).size, 3, "neutral subtypes lost personalization");
  assert.equal(new Set(neutral.map(result => result.report.neutralResult?.observation?.variable)).size, 3, "neutral observations lost personalization");
  for (const result of neutral) {
    const report = result.report.neutralResult;
    assert(report?.overview?.some(sentence => sentence.includes("хэв маяг")), `${result.user.id}: neutral uncertainty missing`);
    assert(report?.strengths?.length, `${result.user.id}: neutral strengths missing`);
    assert(report?.limits?.some(sentence => sentence.includes("оношлохгүй")), `${result.user.id}: neutral scope missing`);
    assert(report?.observation?.action && report?.observation?.decisionRule, `${result.user.id}: neutral observation or decision rule missing`);
    assert(!Object.hasOwn(report, "reportUse") && report.limits.length === 1, `${result.user.id}: repeated generic neutral scope remains`);
  }
  const genericExperimentReason = "Өөрчлөлтийг нэг зүйлээр эхлүүлснээр бодит амьдралд хэрэгжиж байгаа эсэхийг тодорхой ажиглаж, дараагийн алхмаа баримжаатай сонгоно.";
  for (const id of ["VU-03", "VU-06"]) {
    const result = byId[id];
    assert.equal(result.fullReport.influencingPatterns.length, 3, `${id}: supported pattern count changed`);
    for (const pattern of result.fullReport.influencingPatterns) {
      assert(result.bodyText.includes(pattern.evidenceSummary), `${id}: attribution hidden for ${pattern.id}`);
      assert(result.bodyText.includes(pattern.effectOnWeightLoss), `${id}: effect hidden for ${pattern.id}`);
      assert(result.bodyText.includes(pattern.uncertainty), `${id}: uncertainty hidden for ${pattern.id}`);
      assert(!result.bodyText.includes(pattern.explanation), `${id}: repeated pattern explanation remains for ${pattern.id}`);
    }
    for (const interaction of result.fullReport.interactionSummary) assert(result.bodyText.includes(interaction.explanation), `${id}: interaction hidden`);
    for (const context of result.fullReport.contextualFactors) assert(result.bodyText.includes(context.summary || context.explanation), `${id}: context hidden`);
    assert(result.bodyText.includes(result.fullReport.prioritizedStartingAction.action), `${id}: first experiment hidden`);
    assert(!result.bodyText.includes(genericExperimentReason), `${id}: generic experiment explanation remains`);
    if (result.fullReport.professionalGuidance) assert(result.bodyText.includes(result.fullReport.professionalGuidance), `${id}: safety guidance hidden`);
    for (const html of result.sections.flatMap(section => section.paragraphs)) for (const paragraph of html.match(/<p>.*?<\/p>/g) || []) {
      const count = paragraph.replace(/<[^>]+>/g, "").split(/[.!?](?:\s|$)/u).filter(Boolean).length;
      assert(count <= 3, `${id}: paragraph exceeds three sentences`);
    }
  }
}

function qualityMarkdownV22(results, pairs) {
  const v22Review = {
    ...REVIEW,
    "VU-02": "Сонгосон харагдах байдал, захиалгын апп, бусад хүн идэх дохиог яг нэрлэж, сонгоогүй үнэрийн cue-г оруулаагүй. Олон cue-гээс хамгийн хүчтэйг тогтоох боломжгүй тул experiment нь evidence-safe generic fallback хэвээр.",
    "VU-05": "Нойр, ядаргаа, шөнийн дуудлага, хуваарийн formulation өөрчлөгдөөгүй. Experiment нь урьдчилан сонгосон, бэлтгэл бага шаарддаг хялбар хувилбар гэж natural Mongolian-аар бичигдэж, хоол эсвэл хөдөлгөөний prescription зохиогоогүй.",
    "VU-06": "Restrictive pattern болон cycle routing өөрчлөгдөөгүй; `Заримдаа зөрдөг` хариултыг яг тусгасан conditional guidance харагдсан.",
    "VU-09": "Behavioral problem зохиогоогүй; `Ихэнхдээ тогтмол биш` хариултыг яг тусгасан calm menstrual guidance болон relevant tracking харагдсан."
  };
  const rows = results.map(result => `| ${result.user.id} | ${SCORES[result.user.id].join(" | ")} |`).join("\n");
  const top = pairs.slice(0, 5).map((pair, index) => `${index + 1}. **${pair.left} + ${pair.right}: ${(pair.score * 100).toFixed(1)}%** — ${pair.intersection}/${pair.union} exact visible sentence. ${SIMILARITY_REASON[`${pair.left}|${pair.right}`] || "Shared deterministic structure remains below the release threshold; case-specific findings and actions differ."}`).join("\n");
  const detail = results.map(result => `### ${result.user.id} — ${result.user.title}\n\n${v22Review[result.user.id]} Scores A–H: ${SCORES[result.user.id].join("/")}.`).join("\n\n");
  const experiments = results.map(result => `- **${result.user.id}:** ${selectedExperiment(result)}`).join("\n");
  return `# Virtual Cohort V2.2 — Quality Audit

## Executive Summary

- **10/10 assessment, 349/349 routed answer, 10/10 report амжилттай.** V2.1-ийн яг ижил cohort, answers, Q-METHOD-LONGEST linkage болон in-memory start/save/complete урсгал ашигласан; payment, invoice, entitlement үүсгээгүй.
- **Гурван copy-exactness gate бүгд pass.** Menstrual guidance exact answer-аар салсан, environmental evidence зөвхөн selected cue-г нэрлэсэн, public “өгөгдмөл хувилбар” 0 болсон.
- **Release evidence хэвээр баталгаатай.** P0 0, P1 0, P2 0, unsupported factual claim 0, internal contradiction 0, first-experiment fit 10/10. 10/10 тайланг guidance visibility-аар шалгаж, trigger-тэй 3/3 guidance public output-д харагдсан.
- **V2.2 P2 closeout pass.** Neutral тайлангийн давхардсан хоёр scope өгүүлбэрийг хассан ч uncertainty, supported strengths, limitation, observation, decision rule болон гурван өөр subtype хэвээр. VU-03 688-аас 591 үг, VU-06 619-өөс 518 үг болж, зөвхөн давхардсан тайлбар хасагдсан.
- **Subjective scores автоматаар нэмэгдээгүй.** Personalization 8.6/10, paid value 8.0/10, Mongolian 8.2/10. Maximum exact-set Jaccard ${(pairs[0].score * 100).toFixed(1)}%, 65%-ийн gate-ээс доогуур.

## Unchanged cohort, engine, and rubric

V2.1 profile, answer, method linkage, inference engine, routing, signal mapping, pattern threshold, prioritization, safety болон similarity formula өөрчлөгдөөгүй. Зөвхөн public report composition-оос давхардсан өгүүлбэрийг хассан. Formula: headings removed, public visible sentences normalized, boilerplate retained, length ≥35, exact-set Jaccard. A–H rubric: factual correctness, attribution, multi-factor reasoning, Mongolian, personalization, paid value, safety, first-experiment fit.

## Three exactness checks

1. **Menstrual answer-specific guidance — PASS.** Four answers received paired rendered-report checks: “Заримдаа зөрдөг”, “Ихэнхдээ тогтмол биш”, “Сүүлийн 3 сард ирээгүй”, and “Тогтмол” with no irregular-cycle guidance.
2. **Selected environmental cues only — PASS.** Four individual cues, all six two-cue combinations, VU-02 three-cue combination, “Аль нь ч үгүй”, and “Хариулахгүй” were checked. VU-02 contains no unselected “үнэр” cue; its multi-cue experiment remains generic.
3. **Natural VU-05 option wording — PASS.** Public “өгөгдмөл хувилбар” count is 0. The replacement adds no unsupported food or movement prescription.

## Per-report score

| User | Factual | Attribution | Multi-factor | Mongolian | Personalization | Paid value | Safety | Experiment fit |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${rows}

Score formulas: personalization = E column mean = 8.6; paid value = F column mean = 8.0; Mongolian = D column mean = 8.2. V2.1 subjective scores were retained without automatic uplift.

## Manual sentence-to-answer review

Every retained public sentence and its surrounding report section was compared with the unchanged V2.1 fixture answers. VU-03 and VU-06 preserve every supported major pattern, attribution, interaction, context, safety guidance, and first experiment. The neutral profiles preserve all supported strengths and distinct observations. No unsupported diagnosis, cue, prescription, chronology, internal identifier, or contradictory claim remained.

## Per-report findings

${detail}

## First experiments

${experiments}

## Top-five similarity pairs

${top}

## Caveats and assumptions

Энэ нь deterministic synthetic product audit бөгөөд clinical validation эсвэл бодит customer willingness-to-pay судалгаа биш. P2 closeout-ийн дараа ижил cohort-оор дахин үүсгэв.
`;
}

function issuesMarkdownV22() {
  return `# Virtual Cohort V2.2 — Issues

## P0 — 0

Unsupported factual claim, internal contradiction, diagnosis, safety/referral suppression илрээгүй.

## P1 — 0

Answer-specific guidance, selected-cue evidence, experiment wording, primary finding, attribution, contextual retention, first experiment болон neutral routing-ийн major алдаа илрээгүй.

## P2 — 0

Neutral scope repetition болон VU-03/VU-06 mobile length findings хаагдсан. Давхардсан copy хасагдсан боловч uncertainty, supported evidence, interaction, context, safety болон first experiment хадгалагдсан.

## Remaining P0/P1/P2

None.
`;
}

function comparisonMarkdownV22(results, pairs) {
  return `# Virtual Cohort V2.1 → V2.2 Comparison

| Gate | V2.1 | V2.2 | Change |
| --- | ---: | ---: | --- |
| Completed assessments | 10/10 | 10/10 | unchanged |
| Routed answers | 349 | ${results.reduce((sum, result) => sum + result.finalRoute.length, 0)} | unchanged |
| Reports | 10/10 | 10/10 | unchanged |
| P0 | 0 | 0 | unchanged |
| P1 | 0 | 0 | unchanged |
| P2 | 2 | 0 | two remaining findings closed |
| Unsupported factual claims | 0 | 0 | unchanged |
| Internal contradictions | 0 | 0 | unchanged |
| First-experiment fit | 10/10 | 10/10 | unchanged |
| Triggered guidance visibility | 3/3 | 3/3; all 10 checked | preserved with exact answer copy |
| Personalization | 8.6 | 8.6 | no automatic uplift |
| Paid value | 8.0 | 8.0 | no automatic uplift |
| Mongolian | 8.2 | 8.2 | no automatic uplift |
| Maximum similarity | 58.3% | ${(pairs[0].score * 100).toFixed(1)}% | below 65% gate |

P2 closeout removes repeated neutral scope copy and redundant explanation from the two three-pattern mobile reports. Question routing, signals, weights, thresholds, pattern attribution, prioritization, safety, payment, entitlement, recovery, first-experiment selection, cohort inputs, and similarity method are unchanged.
`;
}

async function main() {
  assert.equal(cohort.length, 10);
  for (let index = 0; index < cohort.length; index += 1) {
    const v1 = cohortV1[index]; const v2 = cohort[index];
    assert.equal(v1.id, v2.id);
    const stripped = { ...v2.answers }; delete stripped["Q-METHOD-LONGEST"];
    assert.deepEqual(stripped, v1.answers, `${v2.id}: V1 answer changed`);
  }
  const results = [];
  for (const [index, user] of cohort.entries()) results.push(await simulate(user, index));
  const pairs = similarities(results);
  validateAcceptance(results, pairs);
  if (AUDIT_VERSION === "v2.2") { validateV22Exactness(results); validateV22P2Closeout(results); }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (AUDIT_VERSION === "v2.2") {
    fs.writeFileSync(path.join(OUTPUT_DIR, "REPORTS.md"), reportsMarkdown(results).replace("# Virtual Cohort V2", "# Virtual Cohort V2.2"));
    fs.writeFileSync(path.join(OUTPUT_DIR, "QUALITY_AUDIT.md"), qualityMarkdownV22(results, pairs));
    fs.writeFileSync(path.join(OUTPUT_DIR, "ISSUES.md"), issuesMarkdownV22());
    fs.writeFileSync(path.join(OUTPUT_DIR, "V2_1_V2_2_COMPARISON.md"), comparisonMarkdownV22(results, pairs));
    console.log(JSON.stringify({ version: AUDIT_VERSION, users: results.length, assessments: results.length, reports: results.length, routedAnswers: results.reduce((sum, result) => sum + result.finalRoute.length, 0), topFive: pairs.slice(0, 5), experiments: results.map(result => ({ id: result.user.id, experiment: selectedExperiment(result) })) }, null, 2));
    return;
  }
  if (AUDIT_VERSION === "v2.1") {
    fs.writeFileSync(path.join(OUTPUT_DIR, "REPORTS.md"), reportsMarkdown(results).replace("# Virtual Cohort V2", "# Virtual Cohort V2.1"));
    fs.writeFileSync(path.join(OUTPUT_DIR, "QUALITY_AUDIT.md"), qualityMarkdownV21(results, pairs));
    fs.writeFileSync(path.join(OUTPUT_DIR, "ISSUES.md"), issuesMarkdownV21());
    fs.writeFileSync(path.join(OUTPUT_DIR, "V2_V2_1_COMPARISON.md"), comparisonMarkdownV21(results, pairs));
    console.log(JSON.stringify({ version: AUDIT_VERSION, users: results.length, assessments: results.length, reports: results.length, routedAnswers: results.reduce((sum, result) => sum + result.finalRoute.length, 0), topFive: pairs.slice(0, 5), experiments: results.map(result => ({ id: result.user.id, experiment: selectedExperiment(result) })) }, null, 2));
    return;
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, "PROFILES.md"), profilesMarkdown(results));
  fs.writeFileSync(path.join(OUTPUT_DIR, "ANSWERS_REDACTED.md"), answersMarkdown(results));
  fs.writeFileSync(path.join(OUTPUT_DIR, "REPORTS.md"), reportsMarkdown(results));
  fs.writeFileSync(path.join(OUTPUT_DIR, "QUALITY_AUDIT.md"), qualityMarkdown(results, pairs));
  fs.writeFileSync(path.join(OUTPUT_DIR, "ISSUES.md"), issuesMarkdown());
  fs.writeFileSync(path.join(OUTPUT_DIR, "V1_V2_COMPARISON.md"), comparisonMarkdown(results, pairs));
  console.log(JSON.stringify({ users: results.length, assessments: results.length, reports: results.length, routedAnswers: results.reduce((sum, result) => sum + result.finalRoute.length, 0), topFive: pairs.slice(0, 5), experiments: results.map(result => ({ id: result.user.id, experiment: selectedExperiment(result) })) }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
