"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response } = require("./_lib/http.js"); const { authenticateSession } = require("./_lib/session.js"); const { recordConsent } = require("./_lib/advisor.js");
exports.handler = handler("POST", async (event, body) => { const database = getDatabase(); const session = await authenticateSession(database, event); return response(200, await recordConsent(database, session.id, body)); });
