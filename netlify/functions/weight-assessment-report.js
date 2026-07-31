"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { reportForSession } = require("./_lib/assessment.js");
const { isFreeAssessmentPostpaid } = require("./_lib/commercial-flow.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("GET", async event => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessmentId = event.queryStringParameters?.assessmentId || "";
  const report = await reportForSession(database, session.id, assessmentId);
  if (report.fullReport) {
    const assessment = await database.get("assessments", assessmentId);
    if (isFreeAssessmentPostpaid(assessment)) {
      const key = funnelKeyHash(assessmentId);
      await recordEventSafe(database, "full_report_opened", await assessmentContext(database, assessmentId), { funnelKeyHash: key }, {
        idempotencyKey: `full_report_opened:${key}`,
        ...flagsFromEvent(event)
      });
    } else {
      await recordEventSafe(database, "report_opened", await assessmentContext(database, assessmentId), { assessmentId }, {
        idempotencyKey: `report_opened:${assessmentId}`,
        ...flagsFromEvent(event)
      });
    }
  }
  return response(200, report);
});
