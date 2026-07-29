"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authorizePilot } = require("./_lib/pilot-v2-access.js");
exports.handler = handler("GET", async event => {
  const access = await authorizePilot(getDatabase(), event);
  return response(200, { authorized: true, accessKind: access.kind, owner: access.owner, expiresAt: access.expiresAt || null });
});
