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
      questionOrder: Number(row.questionOrder || metadata.questionOrder || 9999), versions: new Set(), totalReachedCount: 0,
      totalAnsweredCount: 0, liveReachedCount: 0, backfillReachedCount: 0, activeAtQuestionCount: 0,
      confirmedStoppedCount: 0, dropoffEligibleCount: 0 };
    current.versions.add(row.questionnaireVersion); current.questionOrder = Math.min(current.questionOrder, Number(row.questionOrder || metadata.questionOrder || 9999));
    current.totalReachedCount += Number(row.totalReachedCount ?? row.reachedCount ?? 0);
    current.totalAnsweredCount += Number(row.totalAnsweredCount ?? row.answeredCount ?? 0);
    current.liveReachedCount += Number(row.liveReachedCount ?? row.reachedCount ?? 0);
    current.backfillReachedCount += Number(row.backfillReachedCount || 0);
    current.activeAtQuestionCount += Number(row.activeAtQuestionCount ?? row.activeCount ?? 0);
    current.confirmedStoppedCount += Number(row.confirmedStoppedCount ?? row.stoppedCount ?? 0);
    current.dropoffEligibleCount += Number(row.dropoffEligibleCount ?? Math.max(0,
      Number(row.liveReachedCount ?? row.reachedCount ?? 0) - Number(row.activeAtQuestionCount ?? row.activeCount ?? 0)));
    groups.set(identity, current);
  }
  const merged = [...groups.values()]; const identitiesByQuestion = new Map();
  for (const item of merged) identitiesByQuestion.set(item.questionId, (identitiesByQuestion.get(item.questionId) || 0) + 1);
  return merged.map(item => { const itemVersions = [...item.versions].sort(); const changedMeaning = identitiesByQuestion.get(item.questionId) > 1;
    const versionBadge = changedMeaning ? itemVersions.map(version => `v${Math.max(1, versions.indexOf(version) + 1)}`).join("/") : null;
    const confirmedDropoffRate = item.dropoffEligibleCount > 0 ? item.confirmedStoppedCount / item.dropoffEligibleCount : null;
    return { ...item, versions: itemVersions, versionBadge, confirmedDropoffRate,
      reachedCount: item.totalReachedCount, answeredCount: item.totalAnsweredCount,
      stoppedCount: item.confirmedStoppedCount, activeCount: item.activeAtQuestionCount, dropoffRate: confirmedDropoffRate }; });
}

function normalizeQuestionProgressSummary(summary = {}, top = null) {
  const cohortStarted = Number(summary.cohortStarted || 0);
  const terminalCompletedCount = Number(summary.terminalCompletedCount ?? summary.completedCount ?? 0);
  const safetyExitCount = Number(summary.safetyExitCount || 0);
  const commercialCompletedCount = Number(summary.commercialCompletedCount ?? Math.max(0, terminalCompletedCount - safetyExitCount));
  const commercialEligibleStartedCount = Number(summary.commercialEligibleStartedCount ?? Math.max(0, cohortStarted - safetyExitCount));
  const terminalCompletionRate = summary.terminalCompletionRate == null
    ? (summary.completionRate == null ? (cohortStarted ? terminalCompletedCount / cohortStarted : 0) : Number(summary.completionRate))
    : Number(summary.terminalCompletionRate);
  const commercialCompletionRate = summary.commercialCompletionRate == null
    ? (commercialEligibleStartedCount ? commercialCompletedCount / commercialEligibleStartedCount : 0)
    : Number(summary.commercialCompletionRate);
  const safetyExitRate = summary.safetyExitRate == null
    ? (cohortStarted ? safetyExitCount / cohortStarted : 0)
    : Number(summary.safetyExitRate);

  return {
    cohortStarted,
    coveredAssessments: Number(summary.coveredAssessments || 0),
    liveProgressAssessments: Number(summary.liveProgressAssessments || 0),
    backfillOnlyAssessments: Number(summary.backfillOnlyAssessments || 0),
    coverageRate: Number(summary.coverageRate || 0),
    averageQuestionsReached: Number(summary.averageQuestionsReached || 0),
    // Legacy aliases remain terminal-completion metrics.
    completedCount: terminalCompletedCount,
    completionRate: terminalCompletionRate,
    terminalCompletedCount,
    terminalCompletionRate,
    commercialCompletedCount,
    commercialEligibleStartedCount,
    commercialCompletionRate,
    safetyExitCount,
    safetyExitRate,
    activeInProgressCount: Number(summary.activeInProgressCount || 0),
    topStopQuestionId: top?.questionId || null,
    topStopLabel: top?.analyticsLabel || null,
    topStopCount: Number(top?.confirmedStoppedCount || 0),
    instrumentationStartedAt: summary.instrumentationStartedAt || null
  };
}

exports.handler = handler("GET", async event => {
  const database = getDatabase(); await authenticateOwnerAdmin(database, event);
  const query = event.queryStringParameters || {};
  if (!DATE.test(query.startDate || "") || !DATE.test(query.endDate || "") || query.startDate > query.endDate) {
    throw Object.assign(new Error("Invalid date range"), { statusCode: 400, code: "invalid_date_range" });
  }
  const result = await database.getQuestionProgressAnalytics(query.startDate, query.endDate);
  const questions = mergeCanonicalQuestionRows(result.questions || []);
  questions.sort((a, b) => b.confirmedStoppedCount - a.confirmedStoppedCount
    || (b.confirmedDropoffRate || 0) - (a.confirmedDropoffRate || 0)
    || b.dropoffEligibleCount - a.dropoffEligibleCount || a.questionOrder - b.questionOrder);
  const top = questions.find(row => row.confirmedStoppedCount > 0 && row.dropoffEligibleCount > 0) || null;
  return response(200, { timeZone: "Asia/Ulaanbaatar", summary: normalizeQuestionProgressSummary(result.summary || {}, top), questions });
});

module.exports.mergeCanonicalQuestionRows = mergeCanonicalQuestionRows;
module.exports.normalizeQuestionProgressSummary = normalizeQuestionProgressSummary;
