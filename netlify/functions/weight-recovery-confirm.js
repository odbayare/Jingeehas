"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { confirmRecovery } = require("./_lib/recovery.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase(); await authenticateOwnerPreview(database, event);
  const result = await confirmRecovery(database, body);
  return response(200, { assessmentId: result.assessmentId, recovered: true }, { "set-cookie": result.cookie });
});
