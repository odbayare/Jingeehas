"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { createSession, authenticateSession } = require("./_lib/session.js");

exports.handler = handler("POST", async event => {
  const database = getDatabase();
  const existing = await authenticateSession(database, event, false);
  if (existing) return response(200, { sessionId: existing.id, expiresAt: existing.expiresAt, resumed: true });
  const created = await createSession(database);
  return response(201, { sessionId: created.session.id, expiresAt: created.session.expiresAt, resumed: false }, { "set-cookie": created.cookie });
});
