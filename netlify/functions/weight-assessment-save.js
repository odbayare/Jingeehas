"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { ownedAssessment, saveAssessment } = require("./_lib/assessment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { markAnswersRecordedSafe } = require("./_lib/question-progress.js");

exports.handler = handler("PATCH", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const owned = await ownedAssessment(database, session.id, body.assessmentId);
  const assessment = await saveAssessment(database, session.id, body);
  await markAnswersRecordedSafe(database, owned, Object.keys(body.answers && typeof body.answers === "object" ? body.answers : {}), event, new Date(assessment.updatedAt));
  return response(200, { assessmentId: assessment.id, status: assessment.status, savedAt: assessment.updatedAt,
    savedQuestionIds: Object.keys(body.answers && typeof body.answers === "object" ? body.answers : {}) });
});
