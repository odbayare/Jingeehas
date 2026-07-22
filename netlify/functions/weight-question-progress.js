"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { recordQuestionView, safeLog } = require("./_lib/question-progress.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  try { return response(200, await recordQuestionView(database, session.id, body, event)); }
  catch (error) {
    if ([400, 401, 403, 404, 409].includes(Number(error.statusCode))) throw error;
    safeLog("view", error); return response(202, { recorded: false, excluded: false });
  }
});
