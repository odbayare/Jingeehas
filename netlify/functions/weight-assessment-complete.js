"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { completeAssessment } = require("./_lib/assessment.js");
const { BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION } = require("../../questions.js");
const { deriveBodyFunctionalContext, bodyContextFactors, bodyRecommendationFeasibilityModifiers } = require("./_lib/body-context.js");
const { isFreeAssessmentPostpaid, nextRoute } = require("./_lib/commercial-flow.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");

async function enrichV5BodyContext(database, assessment) {
  if (!assessment || assessment.questionnaireVersion !== BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION || assessment.reportMode === "safety") return;
  const snapshot = await database.get("report_snapshots", assessment.id);
  if (!snapshot?.fullReport) return;
  const answerRows = await database.find("assessment_answers", { assessmentId: assessment.id });
  const answerMap = Object.fromEntries(answerRows.map(row => [row.questionId, row.value]));
  const bodyContext = deriveBodyFunctionalContext(answerMap);
  const factors = bodyContextFactors(bodyContext);
  const modifiers = bodyRecommendationFeasibilityModifiers(bodyContext);
  if (!factors.length && !modifiers.length) return;
  const existingFactors = Array.isArray(snapshot.fullReport.contextualFactors) ? snapshot.fullReport.contextualFactors : [];
  const existingModifiers = Array.isArray(snapshot.fullReport.recommendationFeasibilityModifiers) ? snapshot.fullReport.recommendationFeasibilityModifiers : [];
  const fullReport = {
    ...snapshot.fullReport,
    contextualFactors: [...existingFactors, ...factors],
    recommendationFeasibilityModifiers: [...existingModifiers, ...modifiers]
  };
  await database.update("report_snapshots", assessment.id, { fullReport });
}

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessment = await completeAssessment(database, session.id, body);
  const storedAssessment = assessment.questionnaireVersion ? assessment : await database.get("assessments", assessment.id);
  await enrichV5BodyContext(database, storedAssessment);
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

module.exports.enrichV5BodyContext = enrichV5BodyContext;
