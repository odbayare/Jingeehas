"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { reportForSession } = require("./_lib/assessment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");

exports.handler = handler("GET", async event => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessmentId = event.queryStringParameters?.assessmentId || "";
  return response(200, await reportForSession(database, session.id, assessmentId));
});
