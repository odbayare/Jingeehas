"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { createAssessment } = require("./_lib/assessment.js");
const { CURRENT_QUESTIONNAIRE_VERSION } = require("../../questions.js");
const { FREE_POSTPAID_FLOW, isFreeAssessmentPostpaid, isPrepaidFlow } = require("./_lib/commercial-flow.js");
const { authenticateOwnerPreview, authenticateOwnerPreviewStrict, PREVIEW_COOKIE_NAME } = require("./_lib/preview.js");
const { cookies } = require("./_lib/http.js");
const { clientContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");

async function assignCurrentQuestionnaireToNewAssessment(database, assessment, resumableBefore = [], now = new Date()) {
  const resumed = resumableBefore.some(row => row.id === assessment.id);
  if (resumed || assessment.questionnaireVersion === CURRENT_QUESTIONNAIRE_VERSION) return assessment;
  await database.update("assessments", assessment.id, { questionnaireVersion: CURRENT_QUESTIONNAIRE_VERSION, updatedAt: now.toISOString() });
  assessment.questionnaireVersion = CURRENT_QUESTIONNAIRE_VERSION;
  return assessment;
}

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  let previewBypass = false;
  if (cookies(event)[PREVIEW_COOKIE_NAME]) { await authenticateOwnerPreviewStrict(database, event); previewBypass = true; }
  const session = await authenticateSession(database, event);

  // createAssessment intentionally resumes an existing assessment for the same flow. Capture that state first so a V4 resume
  // is never silently upgraded to V5; only an assessment created by this request receives the current questionnaire version.
  const resumableBefore = (await database.find("assessments", { sessionId: session.id, commercialFlowVersion: FREE_POSTPAID_FLOW }))
    .filter(row => new Set(["draft", "in_progress", "complete"]).has(row.status));
  const assessment = await createAssessment(database, session.id, { ...body, prepaid: false, flowVersion: FREE_POSTPAID_FLOW });
  await assignCurrentQuestionnaireToNewAssessment(database, assessment, resumableBefore);

  if (previewBypass) {
    await database.upsert("assessment_sessions", `${assessment.id}:${session.id}`, { assessmentId: assessment.id, sessionId: session.id,
      source: "owner", createdAt: new Date().toISOString() });
    if (isPrepaidFlow(assessment)) {
      await database.update("assessments", assessment.id, { status: "paid_ready", updatedAt: new Date().toISOString() });
      assessment.status = "paid_ready";
    }
  }
  if (!isFreeAssessmentPostpaid(assessment) && !isPrepaidFlow(assessment)) await recordEventSafe(database, "assessment_started", clientContext(body.analyticsContext || {}), { assessmentId: assessment.id }, {
    idempotencyKey: `assessment_started:${assessment.id}`, ...flagsFromEvent(event)
  });
  else if (isPrepaidFlow(assessment)) await recordEventSafe(database, "paywall_viewed", clientContext(body.analyticsContext || {}), { assessmentId: assessment.id }, {
    idempotencyKey: `paywall_viewed:${assessment.id}`, ...flagsFromEvent(event)
  });
  return response(201, { assessmentId: assessment.id, status: assessment.status, commercialFlowVersion: assessment.commercialFlowVersion,
    questionnaireVersion: assessment.questionnaireVersion, previewBypass });
});

module.exports.assignCurrentQuestionnaireToNewAssessment = assignCurrentQuestionnaireToNewAssessment;
