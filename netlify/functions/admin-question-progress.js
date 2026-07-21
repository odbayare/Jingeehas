"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateOwnerAdmin } = require("./_lib/preview.js");
const { questionAnalytics } = require("./_lib/question-analytics.js");

const DATE = /^\d{4}-\d{2}-\d{2}$/;
exports.handler = handler("GET", async event => {
  const database = getDatabase(); await authenticateOwnerAdmin(database, event);
  const query = event.queryStringParameters || {};
  if (!DATE.test(query.startDate || "") || !DATE.test(query.endDate || "") || query.startDate > query.endDate) {
    throw Object.assign(new Error("Invalid date range"), { statusCode: 400, code: "invalid_date_range" });
  }
  const result = await database.getQuestionProgressAnalytics(query.startDate, query.endDate);
  const questions = (result.questions || []).map(row => { const metadata = questionAnalytics(row.questionId, row.questionnaireVersion) || {};
    return { questionId: row.questionId, questionnaireVersion: row.questionnaireVersion, sectionKey: row.sectionKey || metadata.sectionKey || "other",
      sectionLabel: metadata.sectionLabel || row.sectionKey || "Бусад", analyticsLabel: metadata.analyticsLabel || row.questionId,
      questionOrder: Number(row.questionOrder || metadata.questionOrder || 9999), reachedCount: Number(row.reachedCount || 0), answeredCount: Number(row.answeredCount || 0),
      stoppedCount: Number(row.stoppedCount || 0), activeCount: Number(row.activeCount || 0), dropoffRate: row.reachedCount ? Number(row.stoppedCount || 0) / Number(row.reachedCount) : null }; });
  questions.sort((a, b) => b.stoppedCount - a.stoppedCount || (b.dropoffRate || 0) - (a.dropoffRate || 0) || b.reachedCount - a.reachedCount || a.questionOrder - b.questionOrder);
  const top = questions.find(row => row.stoppedCount > 0) || null; const summary = result.summary || {};
  return response(200, { timeZone: "Asia/Ulaanbaatar", summary: { cohortStarted: Number(summary.cohortStarted || 0), coveredAssessments: Number(summary.coveredAssessments || 0),
    coverageRate: Number(summary.coverageRate || 0), averageQuestionsReached: Number(summary.averageQuestionsReached || 0), completedCount: Number(summary.completedCount || 0),
    completionRate: Number(summary.completionRate || 0), activeInProgressCount: Number(summary.activeInProgressCount || 0),
    topStopQuestionId: top?.questionId || null, topStopLabel: top?.analyticsLabel || null, topStopCount: Number(top?.stoppedCount || 0),
    instrumentationStartedAt: summary.instrumentationStartedAt || null }, questions });
});
