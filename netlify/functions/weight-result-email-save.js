"use strict";

const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { initialResultForSession, ownedAssessment } = require("./_lib/assessment.js");
const { saveAssessmentRecoveryEmail } = require("./_lib/recovery.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  await initialResultForSession(database, session.id, body.assessmentId);
  const assessment = await ownedAssessment(database, session.id, body.assessmentId);
  const saved = await saveAssessmentRecoveryEmail(database, session.id, assessment, { email: body.email });
  const key = funnelKeyHash(assessment.id);
  await recordEventSafe(database, "result_email_saved", await assessmentContext(database, assessment.id), { funnelKeyHash: key }, {
    idempotencyKey: `result_email_saved:${key}`,
    ...flagsFromEvent(event)
  });
  return response(200, saved);
});
