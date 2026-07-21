"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { startAssessment } = require("./_lib/assessment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase(); await authenticateOwnerPreview(database, event); const session = await authenticateSession(database, event);
  const before = await database.get("assessments", body.assessmentId);
  const assessment = await startAssessment(database, session.id, body.assessmentId);
  if (!before?.startedAt && assessment.startedAt) await recordEventSafe(database, "assessment_started", await assessmentContext(database, assessment.id),
    { assessmentId: assessment.id }, { idempotencyKey: `assessment_started:${assessment.id}`, ...flagsFromEvent(event) });
  return response(200, { assessmentId: assessment.id, status: assessment.status, startedAt: assessment.startedAt || null,
    questionnaireVersion: assessment.questionnaireVersion });
});
