"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { reportForSession } = require("./_lib/assessment.js");
const { publicPayment } = require("./_lib/payment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");

exports.handler = handler("GET", async event => {
  const database = getDatabase(); await authenticateOwnerPreview(database, event); const session = await authenticateSession(database, event);
  const direct = await database.find("assessments", { sessionId: session.id });
  const recovered = await database.find("assessment_sessions", { sessionId: session.id });
  for (const access of recovered) { const assessment = await database.get("assessments", access.assessmentId); if (assessment) direct.push(assessment); }
  const assessment = [...new Map(direct.map(row => [row.id, row])).values()].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0] || null;
  if (!assessment) return response(200, { assessment: null, payment: null, answers: {}, report: null });
  const payments = await database.find("payments", { assessmentId: assessment.id });
  const payment = payments.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))[0] || null;
  const answers = assessment.status === "draft" ? Object.fromEntries((await database.find("assessment_answers", { assessmentId: assessment.id })).map(row => [row.questionId, row.value])) : {};
  let report = null; if (assessment.status === "complete") report = await reportForSession(database, session.id, assessment.id);
  return response(200, { assessment: { assessmentId: assessment.id, status: assessment.status, safetyRoute: assessment.safetyRoute,
    questionnaireVersion: assessment.questionnaireVersion || require("../../questions.js").LEGACY_QUESTIONNAIRE_VERSION }, payment: payment ? publicPayment(payment) : null, answers, report });
});
