"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { completeAssessment } = require("./_lib/assessment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessment = await completeAssessment(database, session.id, body);
  if (assessment.status === "complete") await recordEventSafe(database, "assessment_completed", await assessmentContext(database, assessment.id),
    { assessmentId: assessment.id }, { idempotencyKey: `assessment_completed:${assessment.id}`, ...flagsFromEvent(event) });
  return response(200, { assessmentId: assessment.id, status: assessment.status, reportMode: assessment.reportMode, safetyRoute: assessment.safetyRoute });
});
