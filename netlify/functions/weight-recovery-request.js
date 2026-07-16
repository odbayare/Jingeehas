"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { getRecoveryDelivery, requestRecovery } = require("./_lib/recovery.js");
exports.handler = handler("POST", async (event, body) => {
  const clientKey = event.headers?.["x-nf-client-connection-ip"] || event.headers?.["client-ip"] || "unknown";
  return response(202, await requestRecovery(getDatabase(), getRecoveryDelivery(), body, clientKey));
});
