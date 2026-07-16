"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { completeAssessment } = require("./_lib/assessment.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  const session = await authenticateSession(database, event);
  const assessment = await completeAssessment(database, session.id, body);
  return response(200, { assessmentId: assessment.id, status: assessment.status, reportMode: assessment.reportMode, safetyRoute: assessment.safetyRoute });
});
