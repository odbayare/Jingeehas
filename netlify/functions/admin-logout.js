"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response } = require("./_lib/http.js"); const { roleCookie, authenticateRole, ADMIN_SESSION } = require("./_lib/auth.js");
exports.handler = handler("POST", async event => { const database = getDatabase(); const session = await authenticateRole(database, event, ADMIN_SESSION); await database.update("admin_sessions", session.id, { revokedAt: new Date().toISOString() }); return response(200, { loggedOut: true }, { "set-cookie": roleCookie(ADMIN_SESSION.cookieName, "", 0) }); });
