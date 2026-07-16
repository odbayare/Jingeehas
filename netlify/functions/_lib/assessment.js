"use strict";

const { randomId } = require("./crypto.js");
const { calculateAssessmentSafety, ROUTE_COPY } = require("./safety.js");
const { buildEvidence, buildFullReport } = require("./report.js");

async function ownedAssessment(database, sessionId, assessmentId) {
  const assessment = await database.get("assessments", assessmentId);
  const recoveredAccess = assessment ? await database.get("assessment_sessions", `${assessmentId}:${sessionId}`) : null;
  if (!assessment || (assessment.sessionId !== sessionId && !recoveredAccess)) {
    throw Object.assign(new Error("Assessment not found"), { statusCode: 404, code: "assessment_not_found" });
  }
  return assessment;
}

async function createAssessment(database, sessionId, input = {}, now = new Date()) {
  const safetyCheck = await database.get("safety_checks", input.safetyCheckId);
  if (!safetyCheck || safetyCheck.sessionId !== sessionId) throw Object.assign(new Error("Safety check required"), { statusCode: 400, code: "safety_check_required" });
  if (safetyCheck.result?.route !== "eligible") throw Object.assign(new Error("Commercial assessment is not suitable"), { statusCode: 409, code: "safety_route_required" });
  const id = randomId("wa_");
  const assessment = await database.insert("assessments", {
    id, sessionId, status: "draft", reportMode: null, safetyRoute: null,
    safetyCheckId: safetyCheck.id,
    advisorClientId: input.advisorClientId || null, consentStatus: input.consentStatus || null,
    createdAt: now.toISOString(), updatedAt: now.toISOString(), completedAt: null
  });
  if (input.recoveryContactGroupId) {
    const contacts = await database.find("recovery_contacts", { sessionId, contactGroupId: input.recoveryContactGroupId });
    if (!contacts.length) throw Object.assign(new Error("Recovery contact not found"), { statusCode: 400, code: "recovery_contact_required" });
    for (const contact of contacts) await database.update("recovery_contacts", contact.id, { assessmentId: id });
  }
  return assessment;
}

async function saveAssessment(database, sessionId, input = {}, now = new Date()) {
  const assessment = await ownedAssessment(database, sessionId, input.assessmentId);
  if (assessment.status !== "draft") throw Object.assign(new Error("Assessment is closed"), { statusCode: 409, code: "assessment_closed" });
  const answers = input.answers && typeof input.answers === "object" ? input.answers : {};
  for (const [questionId, value] of Object.entries(answers)) {
    if (!/^[A-Z0-9-]{2,40}$/.test(questionId)) throw Object.assign(new Error("Invalid question"), { statusCode: 400, code: "invalid_question" });
    await database.upsert("assessment_answers", `${assessment.id}:${questionId}`, {
      assessmentId: assessment.id, questionId, value, updatedAt: now.toISOString()
    });
  }
  const summaries = input.confirmedSummaries && typeof input.confirmedSummaries === "object" ? input.confirmedSummaries : {};
  for (const [checkpointId, summary] of Object.entries(summaries)) {
    const normalized = summary && typeof summary === "object" ? summary : { text: summary, sourceQuestionIds: [] };
    await database.upsert("assessment_summaries", `${assessment.id}:${checkpointId}`, {
      assessmentId: assessment.id, checkpointId, text: String(normalized.text || "").slice(0, 2000),
      sourceQuestionIds: Array.isArray(normalized.sourceQuestionIds) ? normalized.sourceQuestionIds.slice(0, 10) : [], confirmedAt: now.toISOString()
    });
  }
  return database.update("assessments", assessment.id, { updatedAt: now.toISOString() });
}

async function completeAssessment(database, sessionId, input = {}, now = new Date()) {
  const assessment = await ownedAssessment(database, sessionId, input.assessmentId);
  if (assessment.status === "complete") return assessment;
  const answers = await database.find("assessment_answers", { assessmentId: assessment.id });
  const answerMap = Object.fromEntries(answers.map(row => [row.questionId, row.value]));
  const safety = calculateAssessmentSafety(answerMap);
  if (safety.route === "confirmation_required") throw Object.assign(new Error("Safety confirmation required"), {
    statusCode: 409, code: "safety_confirmation_required", safety
  });
  if (safety.route !== "eligible") {
    const completedSafety = await database.update("assessments", assessment.id, {
      status: "complete", reportMode: "safety", safetyRoute: safety.route, safetyProvenance: safety,
      completedAt: now.toISOString(), updatedAt: now.toISOString()
    });
    await database.upsert("report_snapshots", assessment.id, { assessmentId: assessment.id, sessionId,
      reportMode: "safety", safetyRoute: safety.route, safetyProvenance: safety,
      initialView: { guidance: ROUTE_COPY[safety.route] }, fullReport: null, createdAt: now.toISOString() });
    return completedSafety;
  }
  const summaries = await database.find("assessment_summaries", { assessmentId: assessment.id });
  const evidence = buildEvidence(answers, summaries);
  const fullReport = buildFullReport(evidence, now);
  const reportMode = fullReport.mode;
  const completed = await database.update("assessments", assessment.id, {
    status: "complete", reportMode, safetyRoute: null, completedAt: now.toISOString(), updatedAt: now.toISOString()
  });
  await database.upsert("report_snapshots", assessment.id, {
    assessmentId: assessment.id, sessionId, reportMode, safetyRoute: null,
    initialView: { mode: reportMode, evidenceCount: fullReport.evidence.length, coverage: fullReport.coverage }, fullReport,
    createdAt: now.toISOString()
  });
  return completed;
}

async function reportForSession(database, sessionId, assessmentId) {
  await ownedAssessment(database, sessionId, assessmentId);
  const snapshot = await database.get("report_snapshots", assessmentId);
  if (!snapshot) throw Object.assign(new Error("Report not found"), { statusCode: 404, code: "report_not_found" });
  const entitlements = await database.find("entitlements", { assessmentId, status: "active" });
  return { assessmentId, reportMode: snapshot.reportMode, safetyRoute: snapshot.safetyRoute,
    initialView: snapshot.initialView, fullReport: entitlements.length ? snapshot.fullReport : null,
    entitled: entitlements.length > 0 };
}

module.exports = { ownedAssessment, createAssessment, saveAssessment, completeAssessment, reportForSession };
