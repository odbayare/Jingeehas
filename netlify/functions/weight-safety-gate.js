"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { saveSafetyCheck } = require("./_lib/safety.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  const session = await authenticateSession(database, event);
  return response(200, await saveSafetyCheck(database, session.id, body));
});
