"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response, cookies } = require("./_lib/http.js"); const { roleCookie, authenticateRole, ADVISOR_SESSION } = require("./_lib/auth.js");
exports.handler = handler("POST", async event => { const database = getDatabase(); const session = await authenticateRole(database, event, ADVISOR_SESSION); await database.update("advisor_sessions", session.id, { revokedAt: new Date().toISOString() }); return response(200, { loggedOut: true }, { "set-cookie": roleCookie(ADVISOR_SESSION.cookieName, "", 0) }); });
