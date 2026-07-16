"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { createAssessment } = require("./_lib/assessment.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  const session = await authenticateSession(database, event);
  const assessment = await createAssessment(database, session.id, body);
  return response(201, { assessmentId: assessment.id, status: assessment.status });
});
