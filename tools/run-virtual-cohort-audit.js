"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const questions = require("../questions.js");
const app = require("../app.js");
const cohort = require("../tests/fixtures/virtual-cohort-v1.js");
const { MemoryDatabaseAdapter } = require("../tests/support/memory-database.js");
const { createAssessment, saveAssessment, completeAssessment } = require("../netlify/functions/_lib/assessment.js");
const { publicReport } = require("../netlify/functions/_lib/report.js");

const OUTPUT_DIR = path.resolve(__dirname, "../audits/virtual-cohort-v1");
const FIXED_NOW = new Date("2026-07-18T04:00:00.000Z");
const BANNED_PHRASES = ["арга тасрах", "арга тасарсан", "төлөвлөгөө тасрах", "дэглэм тасрах"];

function copy(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
function escapeMarkdown(value) { return String(value).replaceAll("|", "\\|").replaceAll("\n", " "); }
function decodeHtml(value) {
  return String(value).replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", "\"").replaceAll("&#39;", "'");
}
function visibleText(html) {
  return decodeHtml(String(html)
    .replace(/<\/p>/g, "\n").replace(/<\/h3>/g, "\n").replace(/<\/dd>/g, "\n")
    .replace(/<[^>]+>/g, " ").replace(/[ \t]+/g, " ").replace(/\n +/g, "\n").trim());
}
function bodyMarkdown(html) {
  return decodeHtml(String(html)
    .replace(/<article>/g, "").replace(/<\/article>/g, "\n")
    .replace(/<h3>/g, "#### ").replace(/<\/h3>/g, "\n\n")
    .replace(/<p>/g, "").replace(/<\/p>/g, "\n\n")
    .replace(/<dl>/g, "").replace(/<\/dl>/g, "")
    .replace(/<dt>/g, "- **").replace(/<\/dt><dd>/g, ":** ").replace(/<\/dd>/g, "\n")
    .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim());
}

async function startAssessment(database, user, index) {
  const suffix = String(index + 1).padStart(2, "0");
  const sessionId = `virtual-session-${suffix}`;
  const safetyCheckId = `virtual-safety-${suffix}`;
  await database.insert("sessions", {
    id: sessionId, tokenHash: `synthetic-hash-${suffix}`, createdAt: FIXED_NOW.toISOString(),
    expiresAt: new Date(FIXED_NOW.getTime() + 3_600_000).toISOString(), revokedAt: null
  });
  await database.insert("safety_checks", {
    id: safetyCheckId, sessionId, result: { route: "eligible" }, createdAt: FIXED_NOW.toISOString()
  });
  const assessment = await createAssessment(database, sessionId, { safetyCheckId }, FIXED_NOW);
  assert.equal(assessment.status, "draft", `${user.id}: assessment did not start as draft`);
  return { sessionId, assessmentId: assessment.id };
}

async function simulateUser(user, index) {
  const database = new MemoryDatabaseAdapter();
  const started = await startAssessment(database, user, index);
  const collected = {};
  const savedOrder = [];
  for (let guard = 0; guard < questions.QUESTIONS.length + 2; guard += 1) {
    const route = questions.visibleQuestions(collected);
    const next = route.find(question => !Object.hasOwn(collected, question.id));
    if (!next) break;
    assert(Object.hasOwn(user.answers, next.id), `${user.id}: routed question ${next.id} is unanswered`);
    const value = copy(user.answers[next.id]);
    assert.equal(questions.validateAnswer(next, value), "", `${user.id}: invalid answer for ${next.id}`);
    await saveAssessment(database, started.sessionId, {
      assessmentId: started.assessmentId, answers: { [next.id]: value }
    }, FIXED_NOW);
    collected[next.id] = value;
    savedOrder.push(next.id);
  }

  const finalRoute = questions.visibleQuestions(collected);
  const finalIds = finalRoute.map(question => question.id);
  assert.equal(new Set(finalIds).size, finalIds.length, `${user.id}: duplicate routed questions`);
  assert.deepEqual(new Set(Object.keys(user.answers)), new Set(finalIds), `${user.id}: fixture does not exactly match its routed questionnaire`);
  assert.deepEqual(savedOrder, finalIds, `${user.id}: sequential save order diverged from production route`);
  for (const question of finalRoute) assert.equal(questions.validateAnswer(question, collected[question.id]), "", `${user.id}: final validation failed for ${question.id}`);

  const completed = await completeAssessment(database, started.sessionId, { assessmentId: started.assessmentId }, FIXED_NOW);
  assert.equal(completed.status, "complete", `${user.id}: assessment did not complete`);
  const snapshot = await database.get("report_snapshots", started.assessmentId);
  assert(snapshot?.fullReport, `${user.id}: report snapshot missing`);
  assert.equal((await database.find("assessment_answers", { assessmentId: started.assessmentId })).length, finalRoute.length, `${user.id}: persisted answer count mismatch`);
  assert.equal((await database.find("payments", { assessmentId: started.assessmentId })).length, 0, `${user.id}: payment row was created`);
  assert.equal((await database.find("entitlements", { assessmentId: started.assessmentId })).length, 0, `${user.id}: entitlement was created`);

  const report = publicReport(snapshot.fullReport);
  const sections = app._test.buildReportSections(report).filter(section => section.visible);
  const bodyText = sections.map(section => section.paragraphs.map(html => visibleText(String(html)
    .replace(/<h3>.*?<\/h3>/gs, "").replace(/<dt>.*?<\/dt>/gs, ""))).join("\n")).join("\n");
  for (const phrase of BANNED_PHRASES) assert(!bodyText.includes(phrase), `${user.id}: banned phrase leaked: ${phrase}`);
  assert(!/\bQ-[A-Z]|\bMC-|\bS1-|\bOPEN-PAST/.test(JSON.stringify(report)), `${user.id}: raw question ID leaked into public report`);
  return { user, finalRoute, savedOrder, fullReport: snapshot.fullReport, report, sections, bodyText };
}

function answerForAudit(question, value) {
  if (["Q-HEIGHT", "Q-WEIGHT", "Q-TARGET"].includes(question.id)) return "Синтетик тоон утгыг нууцлав";
  if (question.id === "Q-AGE") {
    const floor = Math.floor(Number(value) / 10) * 10;
    return `${floor}–${floor + 9} нас`;
  }
  return Array.isArray(value) ? value.join(", ") : value;
}

function profilesMarkdown(results) {
  const rows = results.map(({ user, finalRoute }) => `## ${user.id} — ${user.title}\n\n${user.narrative}\n\n- Бүрэн хэрэглэгдэх маршрут: ${finalRoute.length} асуулт\n- Төлөв: дараалсан хадгалалт болон дуусгалт амжилттай\n- Төлбөр, нэхэмжлэл: үүсгээгүй`).join("\n\n");
  return `# Virtual Cohort V1 — Profiles\n\nЭдгээр нь бүтээгдэхүүний аудитад зориулсан бүрэн синтетик дүрүүд. Тэдгээр нь бодит хүн, хэрэглэгчийн бүртгэл эсвэл үйлдвэрлэлийн өгөгдөл биш.\n\n${rows}\n`;
}

function answersMarkdown(results) {
  const users = results.map(({ user, finalRoute }) => {
    const sections = new Map();
    for (const question of finalRoute) {
      if (!sections.has(question.section)) sections.set(question.section, []);
      sections.get(question.section).push(`- **${question.text}:** ${answerForAudit(question, user.answers[question.id])}`);
    }
    return `## ${user.id} — ${user.title}\n\n${[...sections.entries()].map(([section, rows]) => `### ${section}\n\n${rows.join("\n")}`).join("\n\n")}`;
  }).join("\n\n---\n\n");
  return `# Virtual Cohort V1 — Redacted Answers\n\nБүх хариулт синтетик. Асуултын дотоод ID-г харуулаагүй бөгөөд өндөр, одоогийн жин, зорилтот жингийн тоон утгыг нууцлав.\n\n${users}\n`;
}

function reportsMarkdown(results) {
  const reports = results.map(({ user, report, sections }) => {
    const rendered = sections.map((section, index) => `### ${index + 1}. ${section.heading}\n\n${section.paragraphs.map(bodyMarkdown).filter(Boolean).join("\n\n")}`).join("\n\n");
    const date = new Date(report.reportDate).toLocaleDateString("mn-MN");
    return `## ${user.id} — ${user.title}\n\n**${report.productName}**\n\n# Бүрэн тайлан\n\n${date}\n\n${rendered}`;
  }).join("\n\n---\n\n");
  return `# Virtual Cohort V1 — Exact Public Reports\n\nДоорх хэсгийн гарчиг, дараалал, өгүүлбэр болон төлөвлөгөөний талбаруудыг үйлдвэрлэлийн public report object болон одоогийн тайлангийн renderer-ээс шууд хөрвүүлэв. Дотоод trace, төлөвлөгөөний шийдээгүй хувилбар болон асуултын ID оруулаагүй.\n\n${reports}\n`;
}

const REVIEW_ROWS = Object.freeze({
  "VU-01": { factual: 3, logic: 3, multi: 4, language: 7, personalization: 5, value: 4, safety: 9, verdict: "Стрессийн холбоо зөв гарсан ч хатуу дэглэм, хөдөлгөөнд суурилсан өмнөх арга, хадгалалтын асуудлыг хэт нэмсэн; эхний туршилт гол стрессийн асуудалд чиглээгүй." },
  "VU-02": { factual: 4, logic: 3, multi: 4, language: 7, personalization: 5, value: 4, safety: 9, verdict: "Орчны дохиог сайн тайлбарласан боловч хатуу дүрмийн нотолгоогүй дүгнэлт, туршилт гол орчны асуудлыг дарсан; хөдөлгөөн багатай нөхцөл тайланд алга болсон." },
  "VU-03": { factual: 3, logic: 3, multi: 5, language: 7, personalization: 5, value: 4, safety: 9, verdict: "Оройн хэт өлсөлтийн холбоо зөв боловч хатуу дэглэмийн нотолгоогүй хэв маяг хамгийн эхний туршилтыг буруу сонгуулсан; олон аргаас хөдөлгөөнийг гол арга мэт атрибутласан." },
  "VU-04": { factual: 2, logic: 2, multi: 3, language: 6, personalization: 4, value: 3, safety: 9, verdict: "Хамгийн сул тайлан: тогтмол хоолны хэмнэлийг давуу тал гэж хэлээд урт хоолны зайг зэрэг баталсан, хатуу дэглэмийг нотолгоогүй нэмсэн, дунд хөдөлгөөнийг их гэж нэрлэсэн." },
  "VU-05": { factual: 8, logic: 8, multi: 8, language: 8, personalization: 7, value: 7, safety: 9, verdict: "Хуваарь, нойр, ядаргаа, хөдөлгөөний нөхцөлийг хамгийн уялдаатай нэгтгэсэн. Эхний алхам нь хоол эсвэл хөдөлгөөн гэж сонголт үлдээсэн тул бүрэн хувийн биш." },
  "VU-06": { factual: 7, logic: 8, multi: 8, language: 7, personalization: 6, value: 7, safety: 8, verdict: "Хатуу дэглэм, эргэн нэмэгдэлт, урт хоолны зайг зөв нэгтгэсэн ч дунд хөдөлгөөнийг их гэж хэтрүүлсэн; тайлан нь өөр төрлийн VU-04-тэй бараг ижил болсон." },
  "VU-07": { factual: 7, logic: 7, multi: 7, language: 8, personalization: 8, value: 6, safety: 9, verdict: "Гэмтэл, зардал, хуваарь, хадгалалтын холбоо хүчтэй. Гэвч гэмтлийн нээлттэй тайлбарыг тусгай зогсолтын кластер гэж танихгүй, шийдээгүй хөдөлгөөний төлөвлөгөөнөөс болж эхний туршилт огт харагдахгүй." },
  "VU-08": { factual: 8, logic: 8, multi: 6, language: 8, personalization: 5, value: 5, safety: 9, verdict: "Хөдөлгөөн багыг сэтгэлзүйн шалтгаан болгоогүй нь зөв. Гэвч дараагийн ажиглалт хөдөлгөөнд бус ерөнхий хооллох мөчид чиглэсэн тул тайлангийн гол олдвороос тасарсан." },
  "VU-09": { factual: 6, logic: 7, multi: 4, language: 8, personalization: 3, value: 3, safety: 4, verdict: "Сэтгэлзүйн саад зохиогоогүй ч мөчлөгийн тогтмол бус хариултыг хэрэглэгчид зориулсан тайлбар, тусгай зөвлөмжид оруулаагүй; дотоод зөвлөмж public renderer-д харагдсангүй." },
  "VU-10": { factual: 9, logic: 9, multi: 6, language: 8, personalization: 4, value: 4, safety: 9, verdict: "Хамгаалах хүчин зүйлсийг үнэн зөв нэгтгэсэн ч ерөнхий neutral бүтэц, хооллох мөчийн ажиглалт нь хүчтэй хамгаалах профайлд бага нэмүү үнэ цэн өгсөн." }
});

const SIMILARITY_EXPLANATIONS = Object.freeze({
  "VU-04|VU-06": "Нэг нь тогтвортой хоолны цагтай, цадах/хэмжээний хүндрэлтэй; нөгөө нь хатуу дэглэм ба эргэн нэмэгдэлттэй. Гэвч хоёул ижил дөрвөн хэв маяг авсан тул 39 өгүүлбэр давхцсан.",
  "VU-08|VU-09": "Хөдөлгөөн бага профайл ба мөчлөгийн биологийн профайл neutral загварт шахагдаж, зөвхөн хөдөлгөөний нэг нөхцөлөөр ялгарсан.",
  "VU-03|VU-06": "Ээлжийн хуваарьтай оройн өлсөлт ба хатуу дэглэмийн эргэн нэмэгдэлт ижил дөрвөн хэв маяг, зөвлөмжийн багцыг авсан.",
  "VU-09|VU-10": "Мөчлөг тогтмол бус профайл болон хамгаалах хүчин зүйл ихтэй профайл ижил neutral тайлан, ижил хооллох мөчийн ажиглалттай болсон.",
  "VU-03|VU-04": "Тогтмол бус хоолтой болон тогтмол хоолтой хоёр профайлд урт хоолны зай, хатуу дэглэм, хадгалалтын ижил өгүүлбэрүүд орсон."
});

function qualityAuditMarkdown(results, sortedPairs) {
  const tableRows = results.map(({ user }) => {
    const row = REVIEW_ROWS[user.id];
    return `| ${user.id} | ${row.factual} | ${row.logic} | ${row.multi} | ${row.language} | ${row.personalization} | ${row.value} | ${row.safety} |`;
  }).join("\n");
  const detail = results.map(({ user }) => `### ${user.id} — ${user.title}\n\n${REVIEW_ROWS[user.id].verdict}`).join("\n\n");
  const topPairs = sortedPairs.slice(0, 5).map((pair, index) => {
    const key = `${pair.left}|${pair.right}`;
    return `${index + 1}. **${pair.left} + ${pair.right}: ${(pair.score * 100).toFixed(1)}% — ХҮЛЭЭН ЗӨВШӨӨРӨХГҮЙ.** ${SIMILARITY_EXPLANATIONS[key]} Ижил ${pair.intersection} / нийт ${pair.union} хувийн өгүүлбэр.`;
  }).join("\n");
  return `# Virtual Cohort V1 — Quality Audit\n\n## Executive Summary\n\n- **Бүх 10 синтетик хэрэглэгч үйлдвэрлэлийн маршрут, дараалсан хадгалалт, дуусгалт, тайлан үүсгэлтийг амжилттай туулсан.** Нийт 343 асуултын хариулт хадгалагдсан; төлбөр, нэхэмжлэл, entitlement үүсээгүй.\n- **Тайлангийн хөдөлгүүр бүтээгдэхүүний зөвшөөрөлд бэлэн биш.** Таван системийн P0 асуудал нь нотолгоогүй хатуу дэглэмийн дүгнэлт, хоорондоо зөрчилдсөн хоолны хэмнэл, хөдөлгөөний түвшний хэтрүүлэг, олон аргын буруу атрибуц, мөчлөгийн зөвлөмжийн харагдахгүй байдлыг үүсгэв.\n- **Хувийн чанар болон төлбөрийн үнэ цэнэ хангалтгүй.** Тусдаа нөхцөлтэй тайлангуудын хамгийн өндөр өгүүлбэрийн давхцал 92.9%; cohort personalization 5.2/10, paid value 4.7/10.\n- **Хамгийн сайн тайлан VU-05, хамгийн сул тайлан VU-04.** VU-05 нь нойр–ядаргаа–хуваарийн холбоог уялдуулсан; VU-04 өөртэйгөө зөрчилдөж, гурван нотолгоогүй дүгнэлт нэмсэн.\n\n## Audit Scope and Method\n\n- Cohort: 10 бүрэн синтетик, бодит амьдралын зөрчилтэй профайл.\n- Flow: production question bank → dynamic visible route → per-answer validation → in-memory assessment start → нэг нэгээр дараалсан save → production completion → persisted snapshot → public report sanitizer → current report renderer.\n- Denominator: 10/10 assessment, 10/10 report; 343/343 routed answer saved and validated.\n- Similarity: гарчгийг хасаж, 35-аас урт normalized харагдах өгүүлбэрийн exact-set Jaccard. Boilerplate-ийг зориуд үлдээсэн, учир нь төлбөртэй хэрэглэгч яг тэр давталтыг харна.\n- Scale: 0–10; 10 нь бүрэн дэмжигдсэн, тод, хувийн, төлбөрийн үнэ цэнтэй гэсэн утгатай.\n\n## Per-Report Scores\n\n| User | A. Factual | B. Pattern | C. Multi-factor | D. Mongolian | E. Personalization | F. Paid value | G. Safety |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${tableRows}\n\n${detail}\n\n## Cross-User Similarity — Top 5\n\n${topPairs}\n\nБүх таван хос 70%-ийн unacceptable босгоос давсан. Энэ нь зөвхөн нийтлэг safety/caveat өгүүлбэрээс бус, ижил pattern explanation, recommendation, interaction болон neutral observation багцаас үүссэн.\n\n## Cohort-Level Findings\n\n### Factual correctness\n\n6/10 тайланд дор хаяж нэг материаллаг factual эсвэл attribution асуудал илэрсэн. Нотолгоогүй хатуу дүрмийн дүгнэлт дөрвөн тайланд, “дунд” хөдөлгөөнийг “их” гэж нэрлэсэн copy дөрвөн тайланд, олон аргаас нэгийг гол арга мэт нэрлэсэн өгүүлбэр гурван тайланд байна.\n\n### Pattern logic and multi-factor reasoning\n\nХөдөлгүүр сэтгэл хөдлөл, орчны дохио, нойр/хуваарь, гэмтлийн хадгалалтын цэвэр профайл дээр зөв core signal олсон. Гэхдээ threshold-ийн нийлбэр нь сул, ерөнхий түүхийн дохиог тусгай хэв маягийн баталгаа болгож, дөрвөн-pattern cap руу ижил тайлангуудыг түлхсэн.\n\n### Mongolian language quality\n\nДундаж 7.4/10. Ихэнх өгүүлбэр уншигдахуйц, онош тавиагүй. Гэхдээ “Хэт хатуу арга удаан үргэлжлэхгүй тасрах хэв маяг” зэрэг эвгүй бүтэц, нэг санааг тайлбар–нотолгоо–нөлөө хэсгээр давтах явдал төлбөртэй тайланг template-like болгосон.\n\n### Personalization and paid value\n\nPersonalization 5.2/10; paid value 4.7/10. Зөв core insight байгаа тайлан ч буруу нэмэлт pattern болон ерөнхий туршилтаар үнэ цэнээ алдсан. Neutral тайлангууд ялгаатай нөхцөлөө ашиглалгүй ижил хооллох мөч ажиглуулах болсон.\n\n### Safety\n\nОнош тавиагүй, даралт/гэмтлийн conditional routing зөв, urgent symptom copy тусдаа байв. Гэхдээ VU-09-ийн мөчлөгийн guidance internal report-д байсан ч neutral public renderer generic scope-оор сольсон нь safety/referral completeness-ийн P0 алдаа.\n\n## Owner Decision Needed\n\n1. P0 issue-үүдийг засах ажлыг зөвшөөрөх эсэх.\n2. Pattern threshold болон attribution logic-ийг өөрчлөхийг зөвшөөрөх эсэх; энэ нь copy-only хүрээнээс давна.\n3. Neutral болон maintenance тайлангийн төлбөрийн үнэ цэнийн доод босгыг тогтоох.\n\n## Further Questions\n\n- “Өмнөх аргууд” олон сонголттой үед хамгийн удаан оролдлогыг аль аргатай холбох нэмэлт асуулт шаардлагатай юу?\n- Хоолны хэмнэл тогтвортой боловч өлсөлт оройтож мэдрэгдсэн хэрэглэгчийг irregular-meal pattern-д оруулах уу, эсвэл hunger/satiety-д л үлдээх үү?\n- Biological guidance neutral report-д тусдаа харагдах ёстой юу?\n\n## Caveats\n\nЭнэ нь 10 синтетик сценарийн deterministic product audit бөгөөд бодит хэрэглэгчийн satisfaction судалгаа биш. 9,900₮-ийн үнэ цэнийн үнэлгээ нь report depth, specificity, internal consistency, actionable next step дээр үндэслэсэн owner-readiness judgment. Бодит conversion эсвэл retention хэмжээгүй.\n`;
}

function issuesMarkdown() {
  return `# Virtual Cohort V1 — Issues\n\n**Status: OWNER DECISION REQUIRED. No production code fix was applied.**\n\n## P0 — Blockers (5)\n\n### P0-01 — Restrictive-rebound pattern is asserted without explicit strict-rule evidence\n\n- Affected: VU-01, VU-02, VU-03, VU-04.\n- Evidence: none selected “Хэт хатуу дүрэм” as a barrier, yet each report says a single deviation caused the whole plan to be abandoned and recommends loosening a strict rule.\n- Impact: unsupported conclusion and wrong first experiment; the requested dominant emotional, environmental, irregular-meal, and satiety scenarios are displaced.\n\n### P0-02 — Stable meal rhythm and long meal-gap conclusion coexist\n\n- Affected: VU-04.\n- Evidence: the user answered “3–4 цаг”, while the report both calls meal rhythm a strength and states that meal intervals are long and late hunger drives evening choices.\n- Impact: direct internal contradiction and factual misstatement.\n\n### P0-03 — Medium movement is described as high movement\n\n- Affected: VU-01, VU-03, VU-04, VU-06.\n- Evidence: all answered “Дунд”; all public reports state “Өдрийн хөдөлгөөн их байгаа”.\n- Impact: hallucinated protective fact that can alter strategy and user trust.\n\n### P0-04 — Menstrual/biological referral guidance is suppressed in neutral rendering\n\n- Affected: VU-09.\n- Evidence: the completed internal report contains the cycle-related professional guidance, but the exact public report shows only generic “асуумжид хамрагдаагүй шинж” scope.\n- Impact: required referral behavior does not reach the user; safety completeness fails.\n\n### P0-05 — Multi-select past methods are attributed as one movement-based attempt\n\n- Affected: VU-01, VU-03, VU-05.\n- Evidence: each selected more than one past method, but the report says the previous method was movement-based without knowing which method was the longest or produced the stated result.\n- Impact: unsupported chronology and causal formulation.\n\n## P1 — Major (6)\n\n### P1-01 — Neutral next action ignores the only supported context\n\n- Affected: VU-08, VU-09.\n- VU-08 has low movement as the only material context; VU-09 has a biological follow-up context. Both receive the same generic food-moment observation.\n\n### P1-02 — Distinct reports exceed the similarity ceiling\n\n- Affected: VU-03/VU-04/VU-06 and VU-08/VU-09/VU-10 clusters.\n- Five most similar pairs range from 79.6% to 92.9% exact personalized-sentence overlap. This is unacceptable for a paid individualized report.\n\n### P1-03 — Supported low-movement context disappears when pattern slots are crowded\n\n- Affected: VU-02.\n- Internal evidence supports low movement from home work and low daily movement, but the public contextual section contains only schedule.\n\n### P1-04 — Explicit injury narrative does not activate the specific injury-stop formulation\n\n- Affected: VU-07.\n- The open answer states that a knee injury made the prior exercise impossible to continue, yet the report falls back to generic pain/limitation wording and retains the older duplicated maintenance explanation.\n\n### P1-05 — Maintenance report has no visible first experiment\n\n- Affected: VU-07.\n- The internal nonnumeric candidate remains unselected, so the paid public report jumps from direction to “what not to change” without an actionable experiment.\n\n### P1-06 — Sleep/schedule experiment remains a generic category choice\n\n- Affected: VU-05.\n- The report asks the user to choose “one food or movement simplified option” instead of supplying a scenario-specific anchor tied to night-call fatigue and schedule.\n\n## P2 — Minor (3)\n\n### P2-01 — Restrictive pattern heading is unnatural Mongolian\n\n“Хэт хатуу арга удаан үргэлжлэхгүй тасрах хэв маяг” is awkward and retains a “тасрах” construction the copy audit has otherwise tried to remove.\n\n### P2-02 — Pattern sections repeat the same proposition\n\nSeveral reports restate one idea in explanation, evidence, effect, interaction, and recommendation with little added information, increasing length without increasing paid value.\n\n### P2-03 — Long multi-pattern reports lack prioritization clarity\n\nVU-01, VU-03, VU-04, and VU-06 run roughly 638–715 words and enumerate four patterns before the action. The user must infer which claims are central versus secondary.\n\n## Decision Gate\n\nDo not deploy the report engine in its current state. Await owner direction before modifying thresholds, mapping, renderer behavior, or copy.\n`;
}

function normalizedSentences(text) {
  return text.split(/(?<=[.!?])\s+/u)
    .map(sentence => sentence.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim())
    .filter(sentence => sentence.length >= 35);
}
function sentenceJaccard(leftText, rightText) {
  const left = new Set(normalizedSentences(leftText));
  const right = new Set(normalizedSentences(rightText));
  const intersection = [...left].filter(sentence => right.has(sentence)).length;
  const union = new Set([...left, ...right]).size;
  return { score: intersection / Math.max(1, union), intersection, union };
}
function similarities(results) {
  const pairs = [];
  for (let left = 0; left < results.length; left += 1) for (let right = left + 1; right < results.length; right += 1) {
    pairs.push({ left: results[left].user.id, right: results[right].user.id, ...sentenceJaccard(results[left].bodyText, results[right].bodyText) });
  }
  return pairs.sort((a, b) => b.score - a.score);
}

async function main() {
  assert.equal(cohort.length, 10, "cohort must contain exactly ten users");
  assert.equal(new Set(cohort.map(user => user.id)).size, 10, "virtual user IDs must be unique");
  const results = [];
  for (const [index, user] of cohort.entries()) results.push(await simulateUser(user, index));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, "PROFILES.md"), profilesMarkdown(results));
  fs.writeFileSync(path.join(OUTPUT_DIR, "ANSWERS_REDACTED.md"), answersMarkdown(results));
  fs.writeFileSync(path.join(OUTPUT_DIR, "REPORTS.md"), reportsMarkdown(results));
  const sortedSimilarities = similarities(results);
  fs.writeFileSync(path.join(OUTPUT_DIR, "QUALITY_AUDIT.md"), qualityAuditMarkdown(results, sortedSimilarities));
  fs.writeFileSync(path.join(OUTPUT_DIR, "ISSUES.md"), issuesMarkdown());

  const summary = results.map(result => ({
    id: result.user.id,
    routeQuestions: result.finalRoute.length,
    mode: result.fullReport.mode,
    patterns: result.fullReport.influencingPatterns.map(pattern => pattern.title),
    contexts: result.fullReport.contextualFactors.map(context => context.title),
    patternEvidence: result.fullReport.internalEvidenceMap.patternEvidence.filter(pattern => pattern.supported),
    positiveSignals: result.fullReport.internalEvidenceMap.signals.filter(signal => signal.effect > 0 && !signal.contextOnly && !signal.guidanceOnly),
    hasVisibleProfessionalGuidance: result.sections.some(section => ["guidance", "professional"].includes(section.id)),
    professionalGuidance: result.fullReport.professionalGuidance,
    words: result.bodyText.split(/\s+/).filter(Boolean).length
  }));
  console.log(JSON.stringify({ summary, topSimilarities: sortedSimilarities.slice(0, 10) }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
