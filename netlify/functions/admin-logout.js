"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response } = require("./_lib/http.js"); const { roleCookie, authenticateRole, ADMIN_SESSION } = require("./_lib/auth.js");
const { revokePreviewRows, previewCookie } = require("./_lib/preview.js");
exports.handler = handler("POST", async event => {
  const database = getDatabase(); const session = await authenticateRole(database, event, ADMIN_SESSION); const now = new Date();
  await revokePreviewRows(database, { adminId: session.adminId }, now);
  await database.update("admin_sessions", session.id, { revokedAt: now.toISOString() });
  return response(200, { loggedOut: true }, {}, { "set-cookie": [roleCookie(ADMIN_SESSION.cookieName, "", 0), previewCookie("", 0)] });
});
