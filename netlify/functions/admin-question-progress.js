"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateOwnerAdmin } = require("./_lib/preview.js");
const { questionAnalytics } = require("./_lib/question-analytics.js");

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function mergeCanonicalQuestionRows(rows, resolver = questionAnalytics) {
  const mapped = (rows || []).map(row => ({ row, metadata: resolver(row.questionId, row.questionnaireVersion) || {} }));
  const versions = [...new Set(mapped.map(item => item.row.questionnaireVersion).filter(Boolean))].sort();
  const groups = new Map();
  for (const { row, metadata } of mapped) {
    const identity = metadata.meaningIdentity || [row.questionId, row.questionnaireVersion].join("\u001f");
    const current = groups.get(identity) || { questionId: row.questionId, sectionKey: row.sectionKey || metadata.sectionKey || "other",
      sectionLabel: metadata.sectionLabel || row.sectionKey || "Бусад", analyticsLabel: metadata.analyticsLabel || row.questionId,
      questionOrder: Number(row.questionOrder || metadata.questionOrder || 9999), versions: new Set(), reachedCount: 0, answeredCount: 0,
      stoppedCount: 0, activeCount: 0 };
    current.versions.add(row.questionnaireVersion); current.questionOrder = Math.min(current.questionOrder, Number(row.questionOrder || metadata.questionOrder || 9999));
    for (const field of ["reachedCount", "answeredCount", "stoppedCount", "activeCount"]) current[field] += Number(row[field] || 0);
    groups.set(identity, current);
  }
  const merged = [...groups.values()]; const identitiesByQuestion = new Map();
  for (const item of merged) identitiesByQuestion.set(item.questionId, (identitiesByQuestion.get(item.questionId) || 0) + 1);
  return merged.map(item => { const itemVersions = [...item.versions].sort(); const changedMeaning = identitiesByQuestion.get(item.questionId) > 1;
    const versionBadge = changedMeaning ? itemVersions.map(version => `v${Math.max(1, versions.indexOf(version) + 1)}`).join("/") : null;
    const reachedCount = item.reachedCount; return { ...item, versions: itemVersions, versionBadge, dropoffRate: reachedCount ? item.stoppedCount / reachedCount : null }; });
}

exports.handler = handler("GET", async event => {
  const database = getDatabase(); await authenticateOwnerAdmin(database, event);
  const query = event.queryStringParameters || {};
  if (!DATE.test(query.startDate || "") || !DATE.test(query.endDate || "") || query.startDate > query.endDate) {
    throw Object.assign(new Error("Invalid date range"), { statusCode: 400, code: "invalid_date_range" });
  }
  const result = await database.getQuestionProgressAnalytics(query.startDate, query.endDate);
  const questions = mergeCanonicalQuestionRows(result.questions || []);
  questions.sort((a, b) => b.stoppedCount - a.stoppedCount || (b.dropoffRate || 0) - (a.dropoffRate || 0) || b.reachedCount - a.reachedCount || a.questionOrder - b.questionOrder);
  const top = questions.find(row => row.stoppedCount > 0) || null; const summary = result.summary || {};
  return response(200, { timeZone: "Asia/Ulaanbaatar", summary: { cohortStarted: Number(summary.cohortStarted || 0), coveredAssessments: Number(summary.coveredAssessments || 0),
    coverageRate: Number(summary.coverageRate || 0), averageQuestionsReached: Number(summary.averageQuestionsReached || 0), completedCount: Number(summary.completedCount || 0),
    completionRate: Number(summary.completionRate || 0), activeInProgressCount: Number(summary.activeInProgressCount || 0),
    topStopQuestionId: top?.questionId || null, topStopLabel: top?.analyticsLabel || null, topStopCount: Number(top?.stoppedCount || 0),
    instrumentationStartedAt: summary.instrumentationStartedAt || null }, questions });
});

module.exports.mergeCanonicalQuestionRows = mergeCanonicalQuestionRows;
