"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");

exports.handler = handler("GET", async event => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const direct = await database.find("entitlements", { sessionId: session.id, status: "active" });
  const recovered = await database.find("assessment_sessions", { sessionId: session.id });
  const indirect = [];
  for (const access of recovered) indirect.push(...await database.find("entitlements", { assessmentId: access.assessmentId, status: "active" }));
  const rows = [...new Map([...direct, ...indirect].map(row => [row.id, row])).values()];
  return response(200, { entitlements: rows.map(row => ({ assessmentId: row.assessmentId, productCode: row.productCode, grantedAt: row.grantedAt })) });
});
