"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { completeAssessment } = require("./_lib/assessment.js");
const { isFreeAssessmentPostpaid, nextRoute } = require("./_lib/commercial-flow.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessment = await completeAssessment(database, session.id, body);
  if (assessment.status === "complete") {
    if (isFreeAssessmentPostpaid(assessment)) {
      const key = funnelKeyHash(assessment.id);
      await recordEventSafe(database, "free_assessment_completed", await assessmentContext(database, assessment.id), { funnelKeyHash: key }, {
        idempotencyKey: `free_assessment_completed:${key}`,
        ...flagsFromEvent(event)
      });
    } else {
      await recordEventSafe(database, "assessment_completed", await assessmentContext(database, assessment.id), { assessmentId: assessment.id }, {
        idempotencyKey: `assessment_completed:${assessment.id}`,
        ...flagsFromEvent(event)
      });
    }
  }
  return response(200, {
    assessmentId: assessment.id,
    status: assessment.status,
    reportMode: assessment.reportMode,
    safetyRoute: assessment.safetyRoute,
    nextRoute: await nextRoute(database, assessment)
  });
});
