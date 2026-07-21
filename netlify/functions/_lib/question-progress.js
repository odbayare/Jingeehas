"use strict";

const { ownedAssessment, assessmentQuestionnaireVersion } = require("./assessment.js");
const { flagsFromEvent } = require("./analytics.js");
const { visibleQuestions } = require("../../../questions.js");
const { questionAnalytics } = require("./question-analytics.js");
const { isPrepaid, requirePaidAccess } = require("./commercial-flow.js");

function safeLog(action, error) {
  console.warn(JSON.stringify({ event: "question_progress_write_failed", action, code: error?.code || "unknown" }));
}

async function canonicalQuestion(database, sessionId, input) {
  const assessment = await ownedAssessment(database, sessionId, input.assessmentId);
  if (isPrepaid(assessment)) {
    await requirePaidAccess(database, assessment);
    if (assessment.status !== "in_progress" || !assessment.startedAt) {
      throw Object.assign(new Error("Question access is not authorized"), { statusCode: 409, code: "question_access_required" });
    }
  } else if (assessment.status !== "draft") {
    throw Object.assign(new Error("Assessment is closed"), { statusCode: 409, code: "assessment_closed" });
  }
  const version = assessmentQuestionnaireVersion(assessment);
  const answers = Object.fromEntries((await database.find("assessment_answers", { assessmentId: assessment.id })).map(row => [row.questionId, row.value]));
  const question = visibleQuestions(answers, version).find(item => item.id === input.questionId);
  const metadata = question && questionAnalytics(question.id, version);
  if (!metadata) throw Object.assign(new Error("Invalid question"), { statusCode: 400, code: "invalid_question" });
  return { assessment, version, metadata };
}

async function recordQuestionView(database, sessionId, input, event, now = new Date()) {
  if (!input || Object.keys(input).some(key => !["assessmentId", "questionId"].includes(key))) {
    throw Object.assign(new Error("Invalid progress payload"), { statusCode: 400, code: "invalid_progress_payload" });
  }
  const canonical = await canonicalQuestion(database, sessionId, input);
  const flags = flagsFromEvent(event);
  if (flags.isAdmin || flags.isOwnerPreview || flags.isTest) return { recorded: false, excluded: true };
  await database.recordQuestionProgress({ assessmentId: canonical.assessment.id, questionnaireVersion: canonical.version,
    questionId: canonical.metadata.questionId, sectionKey: canonical.metadata.sectionKey,
    questionOrder: canonical.metadata.questionOrder, branchDepth: canonical.metadata.branchDepth,
    viewedAt: now.toISOString(), answered: false, source: "live" });
  return { recorded: true, excluded: false };
}

async function markAnswersRecordedSafe(database, assessment, questionIds, event, now = new Date()) {
  const flags = flagsFromEvent(event);
  if (flags.isAdmin || flags.isOwnerPreview || flags.isTest) return;
  const version = assessmentQuestionnaireVersion(assessment);
  for (const questionId of questionIds) {
    const metadata = questionAnalytics(questionId, version);
    if (!metadata) continue;
    try { await database.recordQuestionProgress({ assessmentId: assessment.id, questionnaireVersion: version, questionId,
      sectionKey: metadata.sectionKey, questionOrder: metadata.questionOrder, branchDepth: metadata.branchDepth,
      viewedAt: now.toISOString(), answered: true, source: "live" }); }
    catch (error) { safeLog("answer", error); }
  }
}

module.exports = { canonicalQuestion, recordQuestionView, markAnswersRecordedSafe, safeLog };
