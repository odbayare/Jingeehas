"use strict";

const { randomId } = require("./crypto.js");
const { calculateAssessmentSafety, ROUTE_COPY } = require("./safety.js");
const { buildEvidence, buildFullReport, publicReport } = require("./report.js");
const { resolveReportSnapshot } = require("./report-snapshots.js");
const { LEGACY_FLOW, PREPAID_FLOW, isPrepaid, requirePaidAccess } = require("./commercial-flow.js");
const { QUESTIONNAIRE_VERSION, LEGACY_QUESTIONNAIRE_VERSION, questionById, visibleQuestions, autoLinkedLongestMethod, validateAnswer } = require("../../../questions.js");

function assessmentQuestionnaireVersion(assessment) {
  return assessment.questionnaireVersion || LEGACY_QUESTIONNAIRE_VERSION;
}

async function ownedAssessment(database, sessionId, assessmentId) {
  const assessment = await database.get("assessments", assessmentId);
  const recoveredAccess = assessment ? await database.get("assessment_sessions", `${assessmentId}:${sessionId}`) : null;
  if (!assessment || (assessment.sessionId !== sessionId && !recoveredAccess)) {
    throw Object.assign(new Error("Assessment not found"), { statusCode: 404, code: "assessment_not_found" });
  }
  return assessment;
}

async function createAssessment(database, sessionId, input = {}, now = new Date()) {
  let safetyCheck = input.safetyCheckId ? await database.get("safety_checks", input.safetyCheckId) : null;
  if (input.safetyCheckId && (!safetyCheck || safetyCheck.sessionId !== sessionId)) {
    throw Object.assign(new Error("Safety check not found"), { statusCode: 400, code: "safety_check_invalid" });
  }
  if (safetyCheck && safetyCheck.result?.route !== "eligible") throw Object.assign(new Error("Commercial assessment is not suitable"), { statusCode: 409, code: "safety_route_required" });
  const requestedFlow = input.prepaid === true ? PREPAID_FLOW : LEGACY_FLOW;
  if (requestedFlow === PREPAID_FLOW && !safetyCheck) {
    throw Object.assign(new Error("Safety check required"), { statusCode: 409, code: "safety_check_required" });
  }
  if (!safetyCheck) {
    safetyCheck = await database.insert("safety_checks", { id: randomId("sc_"), sessionId,
      result: { route: "pending_assessment", mode: "pending", category: "assessment_safety_questions" }, createdAt: now.toISOString() });
  }
  let client = null;
  let contacts = [];
  if (input.coachClientId) {
    client = await database.get("advisor_clients", input.coachClientId);
    if (!client || client.resolvedSessionId !== sessionId || client.consentStatus !== "consent_accepted") {
      throw Object.assign(new Error("Advisor invitation is not authorized"), { statusCode: 403, code: "advisor_invite_unauthorized" });
    }
  }
  if (input.recoveryContactGroupId) {
    contacts = await database.find("recovery_contacts", { sessionId, contactGroupId: input.recoveryContactGroupId });
    if (!contacts.length) throw Object.assign(new Error("Recovery contact not found"), { statusCode: 400, code: "recovery_contact_required" });
  }
  if (requestedFlow === PREPAID_FLOW) {
    const existing = (await database.find("assessments", { sessionId, commercialFlowVersion: PREPAID_FLOW }))
      .filter(row => ["payment_pending", "paid_ready", "in_progress"].includes(row.status))
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0];
    if (existing) {
      if (contacts.length) for (const contact of contacts) await database.update("recovery_contacts", contact.id, { assessmentId: existing.id });
      return existing;
    }
  }
  const id = randomId("wa_");
  const assessment = await database.insert("assessments", {
    id, sessionId, status: requestedFlow === PREPAID_FLOW ? "payment_pending" : "draft", commercialFlowVersion: requestedFlow,
    startedAt: null, reportMode: null, safetyRoute: null, questionnaireVersion: QUESTIONNAIRE_VERSION,
    safetyCheckId: safetyCheck.id,
    coachClientId: input.coachClientId || null, consentStatus: null,
    createdAt: now.toISOString(), updatedAt: now.toISOString(), completedAt: null
  });
  if (client) {
    await database.update("advisor_clients", client.id, { assessmentId: id, status: "assessment_created", updatedAt: now.toISOString() });
    await database.update("assessments", id, { consentStatus: client.consentStatus });
  }
  if (contacts.length) {
    for (const contact of contacts) await database.update("recovery_contacts", contact.id, { assessmentId: id });
  }
  return assessment;
}

async function startAssessment(database, sessionId, assessmentId, now = new Date()) {
  const assessment = await ownedAssessment(database, sessionId, assessmentId);
  if (!isPrepaid(assessment)) return assessment;
  await requirePaidAccess(database, assessment);
  if (!["paid_ready", "in_progress"].includes(assessment.status)) throw Object.assign(new Error("Assessment is not ready"), { statusCode: 409, code: "assessment_not_ready" });
  if (assessment.startedAt) return assessment;
  return database.update("assessments", assessment.id, { status: "in_progress", startedAt: now.toISOString(), updatedAt: now.toISOString() });
}

async function saveAssessment(database, sessionId, input = {}, now = new Date()) {
  const assessment = await ownedAssessment(database, sessionId, input.assessmentId);
  const questionnaireVersion = assessmentQuestionnaireVersion(assessment);
  if (isPrepaid(assessment)) {
    await requirePaidAccess(database, assessment);
    if (!["paid_ready", "in_progress"].includes(assessment.status)) throw Object.assign(new Error("Assessment is closed"), { statusCode: 409, code: "assessment_closed" });
  } else if (assessment.status !== "draft") throw Object.assign(new Error("Assessment is closed"), { statusCode: 409, code: "assessment_closed" });
  const answers = input.answers && typeof input.answers === "object" ? input.answers : {};
  const existingRows = await database.find("assessment_answers", { assessmentId: assessment.id });
  const nextAnswerMap = { ...Object.fromEntries(existingRows.map(row => [row.questionId, row.value])), ...answers };
  const applicableIds = new Set(visibleQuestions(nextAnswerMap, questionnaireVersion).map(question => question.id));
  const operations = [];
  for (const [questionId, value] of Object.entries(answers)) {
    if (!/^[A-Z0-9-]{2,40}$/.test(questionId)) throw Object.assign(new Error("Invalid question"), { statusCode: 400, code: "invalid_question" });
    const question = questionById(questionId, questionnaireVersion);
    const isConfirmation = questionId.startsWith("SAFETY-CONFIRM-OPEN-");
    if (!question && !isConfirmation) throw Object.assign(new Error("Invalid question"), { statusCode: 400, code: "invalid_question" });
    if (question && !applicableIds.has(questionId)) {
      throw Object.assign(new Error("Question is not applicable"), { statusCode: 400, code: "inapplicable_question", questionId });
    }
    const validationError = question ? validateAnswer(question, value, { answers: nextAnswerMap, version: questionnaireVersion }) : "";
    if (validationError) throw Object.assign(new Error(validationError), { statusCode: 400, code: "invalid_answer" });
    operations.push({ action: "upsert", table: "assessment_answers", id: `${assessment.id}:${questionId}`, row: {
      assessmentId: assessment.id, questionId, value, updatedAt: now.toISOString()
    } });
  }
  for (const row of existingRows) {
    if (questionById(row.questionId, questionnaireVersion) && !applicableIds.has(row.questionId)) operations.push({ action: "delete", table: "assessment_answers", id: row.id });
  }
  const summaries = input.confirmedSummaries && typeof input.confirmedSummaries === "object" ? input.confirmedSummaries : {};
  for (const [checkpointId, summary] of Object.entries(summaries)) {
    const normalized = summary && typeof summary === "object" ? summary : { text: summary, sourceQuestionIds: [] };
    operations.push({ action: "upsert", table: "assessment_summaries", id: `${assessment.id}:${checkpointId}`, row: {
      assessmentId: assessment.id, checkpointId, text: String(normalized.text || "").slice(0, 2000),
      sourceQuestionIds: Array.isArray(normalized.sourceQuestionIds) ? normalized.sourceQuestionIds.slice(0, 10) : [], confirmedAt: now.toISOString()
    } });
  }
  const firstStart = isPrepaid(assessment) && !assessment.startedAt;
  operations.push({ action: "update", table: "assessments", id: assessment.id, patch: {
    ...(isPrepaid(assessment) ? { status: "in_progress" } : {}), ...(firstStart ? { startedAt: now.toISOString() } : {}), updatedAt: now.toISOString()
  } });
  const transaction = await database.transaction(operations);
  return transaction.results[transaction.results.length - 1];
}

async function completeAssessment(database, sessionId, input = {}, now = new Date()) {
  const assessment = await ownedAssessment(database, sessionId, input.assessmentId);
  const questionnaireVersion = assessmentQuestionnaireVersion(assessment);
  if (assessment.status === "complete") return assessment;
  if (isPrepaid(assessment)) await requirePaidAccess(database, assessment);
  const answers = await database.find("assessment_answers", { assessmentId: assessment.id });
  const answerMap = Object.fromEntries(answers.map(row => [row.questionId, row.value]));
  const safety = calculateAssessmentSafety(answerMap);
  if (safety.route === "confirmation_required") throw Object.assign(new Error("Safety confirmation required"), {
    statusCode: 409, code: "safety_confirmation_required", safety
  });
  const safetyCheck = assessment.safetyCheckId ? await database.get("safety_checks", assessment.safetyCheckId) : null;
  if (safety.route !== "eligible") {
    const operations = [
      { action: "update", table: "assessments", id: assessment.id, patch: {
        status: "complete", reportMode: "safety", safetyRoute: safety.route, safetyProvenance: safety,
        completedAt: now.toISOString(), updatedAt: now.toISOString()
      } },
      { action: "upsert", table: "report_snapshots", id: assessment.id, row: { assessmentId: assessment.id, sessionId,
        reportMode: "safety", safetyRoute: safety.route, safetyProvenance: safety,
        initialView: { guidance: ROUTE_COPY[safety.route] }, fullReport: null, createdAt: now.toISOString() } }
    ];
    if (safetyCheck) operations.unshift({ action: "update", table: "safety_checks", id: assessment.safetyCheckId, patch: { result: safety } });
    const transaction = await database.transaction(operations);
    return transaction.results[safetyCheck ? 1 : 0];
  }
  for (const question of visibleQuestions(answerMap, questionnaireVersion)) {
    const validationError = validateAnswer(question, answerMap[question.id], { answers: answerMap, version: questionnaireVersion });
    if (validationError) throw Object.assign(new Error(validationError), { statusCode: 400, code: "assessment_incomplete", questionId: question.id });
  }
  const summaries = await database.find("assessment_summaries", { assessmentId: assessment.id });
  const linkedLongestMethod = autoLinkedLongestMethod(answerMap, questionnaireVersion);
  const evidenceRows = linkedLongestMethod && !answerMap["Q-METHOD-LONGEST"]
    ? [...answers, { questionId: "Q-METHOD-LONGEST", value: linkedLongestMethod, derived: true }]
    : answers;
  const evidence = buildEvidence(evidenceRows, summaries, { questionnaireVersion, linkedLongestMethod });
  const fullReport = buildFullReport(evidence, now, { questionnaireVersion });
  const reportMode = fullReport.mode;
  const operations = [
    { action: "update", table: "assessments", id: assessment.id, patch: {
      status: "complete", reportMode, safetyRoute: null, completedAt: now.toISOString(), updatedAt: now.toISOString()
    } },
    { action: "upsert", table: "report_snapshots", id: assessment.id, row: {
      assessmentId: assessment.id, sessionId, reportMode, safetyRoute: null,
      initialView: { mode: reportMode, evidenceCount: fullReport.internalEvidenceMap.informativeQuestionCount }, fullReport,
      createdAt: now.toISOString()
    } }
  ];
  if (safetyCheck) operations.unshift({ action: "update", table: "safety_checks", id: assessment.safetyCheckId, patch: { result: safety } });
  const transaction = await database.transaction(operations);
  return transaction.results[safetyCheck ? 1 : 0];
}

async function reportForSession(database, sessionId, assessmentId) {
  const assessment = await ownedAssessment(database, sessionId, assessmentId);
  if (isPrepaid(assessment)) await requirePaidAccess(database, assessment);
  const snapshot = await resolveReportSnapshot(database, assessmentId);
  if (!snapshot) throw Object.assign(new Error("Report not found"), { statusCode: 404, code: "report_not_found" });
  const entitlements = await database.find("entitlements", { assessmentId, status: "active" });
  return { assessmentId, reportMode: snapshot.reportMode, safetyRoute: snapshot.safetyRoute,
    initialView: snapshot.initialView, fullReport: (entitlements.length || isPrepaid(assessment)) ? publicReport(snapshot.fullReport) : null,
    entitled: entitlements.length > 0 || isPrepaid(assessment), commercialFlowVersion: assessment.commercialFlowVersion || LEGACY_FLOW,
    reportVersion: snapshot.snapshotMetadata };
}

module.exports = { assessmentQuestionnaireVersion, ownedAssessment, createAssessment, startAssessment, saveAssessment, completeAssessment, reportForSession };
