"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { startAssessment } = require("./_lib/assessment.js");
const { isFreeAssessmentPostpaid } = require("./_lib/commercial-flow.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, clientContext, flagsFromEvent, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase(); await authenticateOwnerPreview(database, event); const session = await authenticateSession(database, event);
  const before = await database.get("assessments", body.assessmentId);
  const assessment = await startAssessment(database, session.id, body.assessmentId);
  if (!before?.startedAt && assessment.startedAt) {
    if (isFreeAssessmentPostpaid(assessment)) {
      const key = funnelKeyHash(assessment.id);
      await recordEventSafe(database, "free_assessment_started", clientContext(body.analyticsContext || {}), { funnelKeyHash: key }, {
        idempotencyKey: `free_assessment_started:${key}`,
        ...flagsFromEvent(event)
      });
    } else {
      await recordEventSafe(database, "assessment_started", await assessmentContext(database, assessment.id), { assessmentId: assessment.id }, {
        idempotencyKey: `assessment_started:${assessment.id}`,
        ...flagsFromEvent(event)
      });
    }
  }
  return response(200, { assessmentId: assessment.id, status: assessment.status, startedAt: assessment.startedAt || null,
    questionnaireVersion: assessment.questionnaireVersion });
});
