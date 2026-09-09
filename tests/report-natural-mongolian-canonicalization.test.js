"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const fixtures = require("./fixtures/v5-virtual-users.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");

const root = path.join(__dirname, "..");
const generatedRoot = path.join(root, ".generated-copy-hotfix");
const questions = require(path.join(generatedRoot, "questions.js"));
const { saveAssessment, completeAssessment } = require(path.join(generatedRoot, "netlify", "functions", "_lib", "assessment.js"));
const { enrichV5BodyContext } = require(path.join(generatedRoot, "netlify", "functions", "weight-assessment-complete.js"));
const { publicReport } = require(path.join(generatedRoot, "netlify", "functions", "_lib", "report.js"));
const { ROUTE_COPY } = require(path.join(generatedRoot, "netlify", "functions", "_lib", "safety.js"));
const app = require(path.join(root, "dist", "app.js"));

const V8 = "jingeehas-case-formulation-v8-editorial-polish";
const FIXED_CREATED_AT = "2026-09-08T00:00:00.000Z";
const FIXED_REPORT_AT = new Date("2026-09-08T00:10:00.000Z");
const EXPECTED_SAFETY_ROUTES = Object.freeze({
  U13: "eating_behavior_professional",
  U14: "urgent_self_harm",
  U15: "urgent_medical_symptom"
});
const EXPECTED_SEMANTICS = Object.freeze({
  U01: ["limited", [], [], [], [], [], null],
  U02: ["limited", [], [], [], [], [], null],
  U03: ["sufficient", ["irregular_meals_late_hunger"], [], [], ["irregular_meals_late_hunger"], [], "anchor_one_meal_time"],
  U04: ["sufficient", [], ["sleep_fatigue"], [], [], [], null],
  U05: ["sufficient", ["environmental_cues", "hunger_satiety"], ["low_movement"], ["cue_satiety", "cue_movement"], ["environmental_cues", "low_movement", "hunger_satiety"], [["hunger_satiety", "environmental_cues"], ["environmental_cues", "low_movement"]], "mid_meal_pause"],
  U06: ["sufficient", ["environmental_cues", "irregular_meals_late_hunger", "hunger_satiety"], ["low_movement"], ["meal_hunger_satiety", "cue_meal_rhythm", "cue_satiety", "cue_movement"], ["environmental_cues", "irregular_meals_late_hunger", "hunger_satiety", "low_movement"], [["irregular_meals_late_hunger", "hunger_satiety"], ["irregular_meals_late_hunger", "environmental_cues"], ["environmental_cues", "hunger_satiety"], ["environmental_cues", "low_movement"]], "anchor_one_meal_time"],
  U07: ["sufficient", ["restrictive_rebound", "irregular_meals_late_hunger", "plan_daily_life_mismatch", "hunger_satiety"], ["sleep_fatigue"], ["meal_hunger_satiety", "sleep_plan"], ["restrictive_rebound", "irregular_meals_late_hunger", "plan_daily_life_mismatch", "hunger_satiety", "sleep_fatigue"], [["irregular_meals_late_hunger", "hunger_satiety"], ["sleep_fatigue", "plan_daily_life_mismatch"]], "schedule_fatigue_default"],
  U08: ["sufficient", ["previous_attempt_sustainability", "irregular_meals_late_hunger", "hunger_satiety"], ["sleep_fatigue", "low_movement"], ["meal_hunger_satiety"], ["previous_attempt_sustainability", "sleep_fatigue", "irregular_meals_late_hunger", "low_movement", "hunger_satiety"], [["irregular_meals_late_hunger", "hunger_satiety"]], "schedule_fatigue_default"],
  U09: ["sufficient", ["environmental_cues", "irregular_meals_late_hunger", "emotional_regulation", "hunger_satiety"], ["sleep_fatigue", "low_movement"], ["meal_hunger_satiety", "sleep_emotion", "cue_meal_rhythm", "cue_satiety", "cue_movement"], ["environmental_cues", "irregular_meals_late_hunger", "emotional_regulation", "hunger_satiety", "sleep_fatigue", "low_movement"], [["irregular_meals_late_hunger", "hunger_satiety"], ["sleep_fatigue", "emotional_regulation"], ["environmental_cues", "irregular_meals_late_hunger"], ["environmental_cues", "hunger_satiety"], ["environmental_cues", "low_movement"]], "schedule_fatigue_default"],
  U10: ["sufficient", ["environmental_cues", "irregular_meals_late_hunger", "emotional_regulation", "hunger_satiety"], ["sleep_fatigue", "low_movement"], ["meal_hunger_satiety", "sleep_emotion", "cue_meal_rhythm", "cue_satiety", "cue_movement"], ["environmental_cues", "irregular_meals_late_hunger", "emotional_regulation", "hunger_satiety", "sleep_fatigue", "low_movement"], [["irregular_meals_late_hunger", "hunger_satiety"], ["sleep_fatigue", "emotional_regulation"], ["environmental_cues", "irregular_meals_late_hunger"], ["environmental_cues", "hunger_satiety"], ["environmental_cues", "low_movement"]], "schedule_fatigue_default"],
  U11: ["sufficient", ["irregular_meals_late_hunger", "hunger_satiety"], ["sleep_fatigue", "low_movement"], ["meal_hunger_satiety"], ["sleep_fatigue", "irregular_meals_late_hunger", "low_movement", "hunger_satiety"], [["irregular_meals_late_hunger", "hunger_satiety"]], "schedule_fatigue_default"],
  U12: ["limited", [], [], [], [], [], null]
});

const V8_HEADING_BY_SECTION = Object.freeze({
  overview: "Ерөнхий зураг",
  patterns: "Танд нөлөөлж буй хэв маягууд",
  interactions: "Хэв маягуудын уялдаа",
  context: "Нөлөө нь хүчтэй болдог нөхцөл",
  management: "Хэв маяг бүрийг удирдах арга",
  "combined-management": "Хаанаас эхэлж, ямар дарааллаар ажиллах вэ?",
  "initial-actions": "Эхний 3 алхам",
  recovery: "Төлөвлөгөө алдагдсан үед хэрхэн үргэлжлүүлэх вэ?",
  guidance: "Хэзээ мэргэжлийн хүнтэй зөвлөлдөх вэ?",
  "neutral-overview": "Ерөнхий зураг",
  "neutral-strengths": "Танд байгаа хамгаалах хүчин зүйлс",
  "neutral-limits": "Энэ тестээр юуг дүгнэж болохгүй вэ?",
  "neutral-observation": "Нэг зүйлийг өөрчлөхгүйгээр ажиглах арга"
});

function applicableAnswers(profile) {
  const ids = new Set(questions.visibleQuestions(profile.answers, questions.BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION).map(question => question.id));
  return Object.fromEntries(Object.entries(profile.answers).filter(([questionId]) => ids.has(questionId)));
}

async function generate(profile, suffix) {
  const database = new MemoryDatabaseAdapter();
  const sessionId = `ws-canonical-${suffix}`;
  const assessmentId = `wa-canonical-${suffix}`;
  const safetyCheckId = `sc-canonical-${suffix}`;
  await database.insert("sessions", { id: sessionId, tokenHash: "synthetic", createdAt: FIXED_CREATED_AT, expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null });
  await database.insert("safety_checks", { id: safetyCheckId, sessionId, result: { route: "pending_assessment" }, createdAt: FIXED_CREATED_AT });
  await database.insert("assessments", {
    id: assessmentId,
    sessionId,
    status: "draft",
    commercialFlowVersion: "free_assessment_postpaid_v1",
    questionnaireVersion: questions.BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION,
    safetyCheckId,
    startedAt: null,
    reportMode: null,
    safetyRoute: null,
    createdAt: FIXED_CREATED_AT,
    updatedAt: FIXED_CREATED_AT,
    completedAt: null
  });
  await saveAssessment(database, sessionId, { assessmentId, answers: applicableAnswers(profile) }, new Date("2026-09-08T00:01:00.000Z"));
  const completed = await completeAssessment(database, sessionId, { assessmentId }, FIXED_REPORT_AT);
  await enrichV5BodyContext(database, completed);
  const assessment = await database.get("assessments", assessmentId);
  const snapshot = await database.get("report_snapshots", assessmentId);
  const fullReport = snapshot.fullReport;
  const publicPayload = fullReport ? publicReport(fullReport) : snapshot.initialView;
  app._test.setComingSoon(false);
  app._test.setState({ ownerPreview: true, report: {
    safetyRoute: assessment.safetyRoute,
    initialView: snapshot.initialView,
    fullReport: fullReport ? publicPayload : null
  } });
  return {
    assessment,
    database,
    fullReport,
    publicPayload,
    rendered: app.renderForPath("/report"),
    sections: fullReport ? app._test.buildReportSections(publicPayload).filter(section => section.visible) : []
  };
}

function semanticFingerprint(full) {
  return [
    full.mode,
    (full.influencingPatterns || []).map(item => item.id),
    (full.contextualFactors || []).filter(item => item.isPattern).map(item => item.id),
    (full.interactionSummary || []).map(item => item.id),
    (full.managementModules || []).map(item => item.patternId),
    [full.combinedManagementPlan, ...(full.additionalInteractionManagementPlans || [])].filter(Boolean).map(item => item.patternIds),
    full.prioritizedStartingAction?.recommendationId || null
  ];
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function renderedText(html) {
  return decodeHtml(String(html || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function normalizedLongTextNodes(html) {
  const blockSeparated = String(html || "").replace(/<\/(?:p|li|dt|dd|h[1-6]|section|article|main|header|footer|nav)>/gi, "\n");
  return decodeHtml(blockSeparated.replace(/<[^>]+>/g, " "))
    .split(/\n+/)
    .flatMap(line => line.split(/(?<=[.!?])\s+/u))
    .map(value => value.replace(/\s+/g, " ").trim())
    .filter(value => value.length >= 25);
}

function isAllCapsHeading(heading) {
  return /[А-ЯӨҮЁ]/iu.test(heading) && heading === heading.toLocaleUpperCase("mn-MN");
}

(async () => {
  const firstPass = [];
  for (const profile of fixtures) firstPass.push({ profile, result: await generate(profile, `${profile.id}-a`) });
  const secondPass = [];
  for (const profile of fixtures) secondPass.push({ profile, result: await generate(profile, `${profile.id}-b`) });

  assert.equal(firstPass.length, 15);
  const commercial = firstPass.filter(item => !item.result.assessment.safetyRoute);
  const safety = firstPass.filter(item => item.result.assessment.safetyRoute);
  assert.equal(commercial.length, 12);
  assert.equal(safety.length, 3);

  for (let index = 0; index < firstPass.length; index += 1) {
    const first = firstPass[index];
    const second = secondPass[index];
    assert.deepEqual(first.result.publicPayload, second.result.publicPayload, `${first.profile.id}: public payload is not deterministic`);
    assert.equal(first.result.rendered, second.result.rendered, `${first.profile.id}: rendered report is not deterministic`);
  }

  for (const { profile, result } of commercial) {
    assert.equal(result.fullReport.version, V8, `${profile.id}: current report version`);
    assert.deepEqual(semanticFingerprint(result.fullReport), EXPECTED_SEMANTICS[profile.id], `${profile.id}: semantic fingerprint changed`);
    for (const section of result.sections) {
      assert.equal(section.heading, V8_HEADING_BY_SECTION[section.id], `${profile.id}: non-canonical heading for ${section.id}`);
      assert.equal(isAllCapsHeading(section.heading), false, `${profile.id}: ALL-CAPS heading remains`);
    }
    for (const context of result.fullReport.contextualFactors || []) {
      if (context.counted !== undefined) assert.equal(context.counted, false, `${profile.id}: contextual factor became counted`);
      assert.notEqual(context.diagnostic, true, `${profile.id}: contextual factor became diagnostic`);
    }
    for (const modifier of result.fullReport.recommendationFeasibilityModifiers || []) {
      assert.notEqual(modifier.counted, true, `${profile.id}: context modifier became counted`);
      assert.equal(modifier.changesCoreRecommendation, false, `${profile.id}: body modifier changed core recommendation`);
    }
  }
  assert.deepEqual(semanticFingerprint(commercial.find(item => item.profile.id === "U09").result.fullReport), semanticFingerprint(commercial.find(item => item.profile.id === "U10").result.fullReport), "household context changed the core recommendation");
  assert.deepEqual(semanticFingerprint(commercial.find(item => item.profile.id === "U02").result.fullReport), semanticFingerprint(commercial.find(item => item.profile.id === "U12").result.fullReport), "body/function context changed the core recommendation");

  for (const { profile, result } of safety) {
    const route = EXPECTED_SAFETY_ROUTES[profile.id];
    assert.equal(result.assessment.safetyRoute, route, `${profile.id}: safety route changed`);
    assert.equal(result.assessment.reportMode, "safety", `${profile.id}: safety report mode changed`);
    assert.equal(result.fullReport, null, `${profile.id}: commercial report was generated for a safety route`);
    assert.deepEqual(result.publicPayload.guidance, ROUTE_COPY[route], `${profile.id}: safety guidance changed`);
    assert.equal((await result.database.find("payments", { assessmentId: result.assessment.id })).length, 0, `${profile.id}: payment created on safety route`);
    assert.equal((await result.database.find("entitlements", { assessmentId: result.assessment.id })).length, 0, `${profile.id}: entitlement created on safety route`);
    assert(!result.rendered.includes("19,900₮"), `${profile.id}: price leaked into safety route`);
    assert(!result.rendered.includes("QPay"), `${profile.id}: QPay leaked into safety route`);
  }
  assert(resultFor("U14").rendered.includes("103 дугаарт"), "U14: 103 guidance changed");
  assert(resultFor("U14").rendered.includes("ганцаараа бүү үлдээрэй"), "U14: trusted-person guidance changed");
  assert(resultFor("U14").rendered.includes("яаралтай тусламжийн тасагт"), "U14: emergency-department guidance changed");
  assert(resultFor("U15").rendered.includes("103 дугаарт"), "U15: 103 guidance changed");
  assert(resultFor("U13").rendered.includes("эмч эсвэл хооллолтын эмгэгийн чиглэлээр ажилладаг мэргэжилтэн"), "U13: professional-support guidance changed");

  const publicSurface = firstPass.map(item => `${JSON.stringify(item.result.publicPayload)}\n${item.result.rendered}`).join("\n");
  const commercialText = commercial.map(item => renderedText(item.result.rendered)).join("\n");
  assert(!/Бүлэг\s+\d+/u.test(commercialText), "numbered group scaffolding leaked into V8 public output");
  assert(!commercialText.includes("Хариулттай холбоо:"), "answer-link scaffolding leaked into V8 public output");
  assert(!commercialText.includes("Тайлбар:"), "consumer explanation scaffolding leaked into V8 public output");
  assert(!commercialText.includes("Нэгтгэл:"), "summary scaffolding leaked into V8 public output");
  assert(!/(?:\bpersona\b|\bvirtual(?:-|\s)user\b|\bfixture\b|\bQA\b)/iu.test(publicSurface), "internal QA token leaked into public output");
  assert(!/(?:^|[^A-Z0-9])U(?:0[1-9]|1[0-5])(?:[^A-Z0-9]|$)/u.test(publicSurface), "virtual-user identifier leaked into public output");

  const modalCounts = {
    baijBolno: (commercialText.match(/байж болно/gu) || []).length,
    boljBolno: (commercialText.match(/болж болно/gu) || []).length
  };
  assert(modalCounts.baijBolno <= 0, `V8 байж болно ceiling exceeded: ${modalCounts.baijBolno}`);
  assert(modalCounts.boljBolno <= 0, `V8 болж болно ceiling exceeded: ${modalCounts.boljBolno}`);
  assert.equal((commercialText.match(/энэ тайлан/gu) || []).length, 0, "unnecessary report self-reference remains");
  assert.equal((commercialText.match(/тайлангаар/gu) || []).length, 0, "unnecessary report-by-reference remains");
  assert.equal((commercialText.match(/асуумж дангаараа/gu) || []).length, 0, "legacy questionnaire self-reference remains");
  assert(commercialText.includes("онош"), "non-diagnostic scope disclosure was removed");

  const knownScaffolding = [
    "Эхний хэв маягийн өдөөгч нөхцөлийг ажиглахдаа дараагийн хэв маягтай холбоотой хүндрэл мөн давхцаж байгаа эсэхийг тэмдэглэнэ.",
    "Нэг удаад нэг бэлтгэсэн үйлдэл хэрэглэж, аль өөрчлөлт бодит амьдралд илүү тохирч байгааг тусад нь ажиглана."
  ];
  for (const sentence of knownScaffolding) assert(!commercialText.includes(sentence), `known repeated scaffolding remains: ${sentence}`);
  const repeated = new Map();
  for (const { result } of commercial) {
    for (const sentence of normalizedLongTextNodes(result.rendered)) repeated.set(sentence, (repeated.get(sentence) || 0) + 1);
  }
  const structuralAllowlist = new Set([
    "Ямар нөхцөл давтагдаж байна вэ?",
    "Тухайн үед юу хийж болох вэ?",
    "Юуг хэт хатуу шаардахгүй байх вэ?",
    "Хэзээ мэргэжлийн хүнтэй зөвлөлдөх вэ?",
    "Эхэлж аль хэв маягийн нөлөөг багасгах вэ?",
    "Хоёр хэв маягийг зэрэг удирдахад ямар арга тохирох вэ?",
    "Хоолны зай уртсаж, өлсөлт оройтож мэдрэгдэх хэв маяг",
    "Өлсөх, цадах мэдрэмжийг цагт нь анзаарахад хүндрэлтэй хэв маяг"
  ]);
  const unexplained = [...repeated].filter(([sentence, occurrences]) => occurrences > 12 && !structuralAllowlist.has(sentence));
  assert.deepEqual(unexplained, [], `unexplained long repetition exceeded threshold: ${JSON.stringify(unexplained)}`);

  function resultFor(id) {
    return firstPass.find(item => item.profile.id === id).result;
  }

  console.log(JSON.stringify({
    commercialReports: commercial.length,
    safetyReports: safety.length,
    allCapsSectionHeadings: commercial.flatMap(item => item.result.sections).filter(section => isAllCapsHeading(section.heading)).length,
    groupNumberScaffolding: (commercialText.match(/Бүлэг\s+\d+/gu) || []).length,
    answerLinkScaffolding: (commercialText.match(/Хариулттай холбоо:/gu) || []).length,
    explanationScaffolding: (commercialText.match(/Тайлбар:/gu) || []).length,
    modalCounts,
    reportSelfReference: (commercialText.match(/энэ тайлан|тайлангаар|асуумж дангаараа/gu) || []).length,
    repeatedLongSentences: [...repeated].filter(([, occurrences]) => occurrences > 1).length
  }));
  console.log("V5 natural Mongolian canonicalization corpus tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
