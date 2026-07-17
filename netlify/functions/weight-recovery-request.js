"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response, cookies } = require("./_lib/http.js");
const { COOKIE_NAME } = require("./_lib/session.js");
const { getRecoveryDelivery, requestRecovery } = require("./_lib/recovery.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase(); await authenticateOwnerPreview(database, event);
  const clientKey = event.headers?.["x-nf-client-connection-ip"] || event.headers?.["client-ip"] || "unknown";
  const sessionKey = cookies(event)[COOKIE_NAME] || `anonymous:${clientKey}`;
  return response(202, await requestRecovery(database, getRecoveryDelivery(), body, { ip: clientKey, session: sessionKey }));
});
