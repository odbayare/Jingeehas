"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { createAssessment } = require("./_lib/assessment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { clientContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessment = await createAssessment(database, session.id, body);
  await recordEventSafe(database, "assessment_started", clientContext(body.analyticsContext || {}), { assessmentId: assessment.id }, {
    idempotencyKey: `assessment_started:${assessment.id}`, ...flagsFromEvent(event)
  });
  return response(201, { assessmentId: assessment.id, status: assessment.status, questionnaireVersion: assessment.questionnaireVersion });
});
