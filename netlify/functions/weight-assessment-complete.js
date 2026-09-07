"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { completeAssessment } = require("./_lib/assessment.js");
const { BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION } = require("../../questions.js");
const { deriveBodyFunctionalContext, bodyContextFactors, bodyRecommendationFeasibilityModifiers } = require("./_lib/body-context.js");
const { v5ProfessionalGuidance, v5AdditionalContextFactors, appendGuidance } = require("./_lib/v5-context.js");
const { isFreeAssessmentPostpaid, nextRoute } = require("./_lib/commercial-flow.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");

function mergeById(existing = [], additions = []) {
  const result = [...existing];
  const seen = new Set(result.map(item => item?.id).filter(Boolean));
  for (const item of additions) {
    if (item?.id && seen.has(item.id)) continue;
    result.push(item);
    if (item?.id) seen.add(item.id);
  }
  return result;
}

async function enrichV5BodyContext(database, assessment) {
  if (!assessment || assessment.questionnaireVersion !== BODY_FUNCTIONAL_QUESTIONNAIRE_VERSION || assessment.reportMode === "safety") return;
  const snapshot = await database.get("report_snapshots", assessment.id);
  if (!snapshot?.fullReport) return;
  const answerRows = await database.find("assessment_answers", { assessmentId: assessment.id });
  const answerMap = Object.fromEntries(answerRows.map(row => [row.questionId, row.value]));
  const bodyContext = deriveBodyFunctionalContext(answerMap);
  const factors = [...bodyContextFactors(bodyContext), ...v5AdditionalContextFactors(answerMap)];
  const modifiers = bodyRecommendationFeasibilityModifiers(bodyContext);
  const guidance = v5ProfessionalGuidance(answerMap);
  if (!factors.length && !modifiers.length && !guidance.length) return;

  const fullReport = {
    ...snapshot.fullReport,
    contextualFactors: mergeById(Array.isArray(snapshot.fullReport.contextualFactors) ? snapshot.fullReport.contextualFactors : [], factors),
    recommendationFeasibilityModifiers: mergeById(Array.isArray(snapshot.fullReport.recommendationFeasibilityModifiers) ? snapshot.fullReport.recommendationFeasibilityModifiers : [], modifiers),
    professionalGuidance: appendGuidance(snapshot.fullReport.professionalGuidance, guidance),
    neutralResult: snapshot.fullReport.neutralResult
      ? { ...snapshot.fullReport.neutralResult, professionalScope: appendGuidance(snapshot.fullReport.neutralResult.professionalScope, guidance) }
      : snapshot.fullReport.neutralResult
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
module.exports.mergeById = mergeById;
