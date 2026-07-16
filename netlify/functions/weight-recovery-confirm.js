"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { confirmRecovery } = require("./_lib/recovery.js");
exports.handler = handler("POST", async (event, body) => {
  const result = await confirmRecovery(getDatabase(), body);
  return response(200, { assessmentId: result.assessmentId, recovered: true }, { "set-cookie": result.cookie });
});
