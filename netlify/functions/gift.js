"use strict";
const { handler, response } = require("./_lib/http.js");
const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { authenticateSession } = require("./_lib/session.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { enabled, sameOrigin, giftAction } = require("./_lib/gifting.js");
exports.handler = handler("POST", async (event, input) => {
  enabled(); sameOrigin(event);
  if (!input || typeof input !== "object" || Array.isArray(input)) return response(400, { error: "invalid_gift_action" });
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  return response(200, await giftAction(database, getQPayProvider(), session.id, input));
});
