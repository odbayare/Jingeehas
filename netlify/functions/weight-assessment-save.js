"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { saveAssessment } = require("./_lib/assessment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");

exports.handler = handler("PATCH", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessment = await saveAssessment(database, session.id, body);
  return response(200, { assessmentId: assessment.id, status: assessment.status, savedAt: assessment.updatedAt,
    savedQuestionIds: Object.keys(body.answers && typeof body.answers === "object" ? body.answers : {}) });
});
