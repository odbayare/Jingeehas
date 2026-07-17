"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateRole, ADMIN_SESSION } = require("./_lib/auth.js");
exports.handler = handler("GET", async event => {
  const database = getDatabase();
  const session = await authenticateRole(database, event, ADMIN_SESSION);
  const admin = await database.get("admin_accounts", session.adminId);
  if (!admin || admin.status !== "active") throw Object.assign(new Error("Unauthorized"), { statusCode: 401, code: "unauthorized" });
  return response(200, { authenticated: true, owner: admin.isOwner === true });
});
