"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { reportForSession } = require("./_lib/assessment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("GET", async event => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessmentId = event.queryStringParameters?.assessmentId || "";
  const report = await reportForSession(database, session.id, assessmentId);
  if (report.fullReport) await recordEventSafe(database, "report_opened", await assessmentContext(database, assessmentId), { assessmentId }, {
    idempotencyKey: `report_opened:${assessmentId}`, ...flagsFromEvent(event)
  });
  return response(200, report);
});
