"use strict";

const { randomId } = require("./crypto.js");

async function ownedAssessment(database, sessionId, assessmentId) {
  const assessment = await database.get("assessments", assessmentId);
  if (!assessment || assessment.sessionId !== sessionId) {
    throw Object.assign(new Error("Assessment not found"), { statusCode: 404, code: "assessment_not_found" });
  }
  return assessment;
}

async function createAssessment(database, sessionId, input = {}, now = new Date()) {
  const id = randomId("wa_");
  return database.insert("assessments", {
    id, sessionId, status: "draft", reportMode: null, safetyRoute: null,
    advisorClientId: input.advisorClientId || null, consentStatus: input.consentStatus || null,
    createdAt: now.toISOString(), updatedAt: now.toISOString(), completedAt: null
  });
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
    await database.upsert("assessment_summaries", `${assessment.id}:${checkpointId}`, {
      assessmentId: assessment.id, checkpointId, text: String(summary || "").slice(0, 2000), confirmedAt: now.toISOString()
    });
  }
  return database.update("assessments", assessment.id, { updatedAt: now.toISOString() });
}

async function completeAssessment(database, sessionId, input = {}, now = new Date()) {
  const assessment = await ownedAssessment(database, sessionId, input.assessmentId);
  if (assessment.status === "complete") return assessment;
  const answers = await database.find("assessment_answers", { assessmentId: assessment.id });
  const reportMode = answers.length >= 8 ? "sufficient" : answers.length >= 4 ? "limited" : "insufficient";
  const completed = await database.update("assessments", assessment.id, {
    status: "complete", reportMode, safetyRoute: null, completedAt: now.toISOString(), updatedAt: now.toISOString()
  });
  await database.upsert("report_snapshots", assessment.id, {
    assessmentId: assessment.id, sessionId, reportMode, safetyRoute: null,
    initialView: { mode: reportMode, evidenceCount: answers.length }, fullReport: null,
    createdAt: now.toISOString()
  });
  return completed;
}

async function reportForSession(database, sessionId, assessmentId) {
  await ownedAssessment(database, sessionId, assessmentId);
  const snapshot = await database.get("report_snapshots", assessmentId);
  if (!snapshot) throw Object.assign(new Error("Report not found"), { statusCode: 404, code: "report_not_found" });
  const entitlements = await database.find("entitlements", { sessionId, assessmentId, status: "active" });
  return { assessmentId, reportMode: snapshot.reportMode, safetyRoute: snapshot.safetyRoute,
    initialView: snapshot.initialView, fullReport: entitlements.length ? snapshot.fullReport : null,
    entitled: entitlements.length > 0 };
}

module.exports = { ownedAssessment, createAssessment, saveAssessment, completeAssessment, reportForSession };
