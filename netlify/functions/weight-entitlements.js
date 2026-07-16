"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");

exports.handler = handler("GET", async event => {
  const database = getDatabase();
  const session = await authenticateSession(database, event);
  const rows = await database.find("entitlements", { sessionId: session.id, status: "active" });
  return response(200, { entitlements: rows.map(row => ({ assessmentId: row.assessmentId, productCode: row.productCode, grantedAt: row.grantedAt })) });
});
