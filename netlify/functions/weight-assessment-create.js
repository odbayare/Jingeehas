"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { createAssessment } = require("./_lib/assessment.js");
const { authenticateOwnerPreview, authenticateOwnerPreviewStrict, PREVIEW_COOKIE_NAME } = require("./_lib/preview.js");
const { cookies } = require("./_lib/http.js");
const { clientContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  let previewBypass = false;
  if (cookies(event)[PREVIEW_COOKIE_NAME]) { await authenticateOwnerPreviewStrict(database, event); previewBypass = true; }
  const session = await authenticateSession(database, event);
  const assessment = await createAssessment(database, session.id, body);
  if (previewBypass && assessment.commercialFlowVersion === "prepaid_v2") {
    await database.upsert("assessment_sessions", `${assessment.id}:${session.id}`, { assessmentId: assessment.id, sessionId: session.id,
      source: "owner", createdAt: new Date().toISOString() });
    await database.update("assessments", assessment.id, { status: "paid_ready", updatedAt: new Date().toISOString() });
    assessment.status = "paid_ready";
  }
  if (assessment.commercialFlowVersion !== "prepaid_v2") await recordEventSafe(database, "assessment_started", clientContext(body.analyticsContext || {}), { assessmentId: assessment.id }, {
    idempotencyKey: `assessment_started:${assessment.id}`, ...flagsFromEvent(event)
  });
  else await recordEventSafe(database, "paywall_viewed", clientContext(body.analyticsContext || {}), { assessmentId: assessment.id }, {
    idempotencyKey: `paywall_viewed:${assessment.id}`, ...flagsFromEvent(event)
  });
  return response(201, { assessmentId: assessment.id, status: assessment.status, commercialFlowVersion: assessment.commercialFlowVersion,
    questionnaireVersion: assessment.questionnaireVersion, previewBypass });
});
