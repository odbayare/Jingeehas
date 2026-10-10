"use strict";
const { handler, response } = require("./_lib/http.js");
const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { authenticateOwnerAdmin } = require("./_lib/preview.js");
const { sameOrigin, supportGift } = require("./_lib/gifting.js");
exports.handler = handler("POST", async (event, input) => {
  sameOrigin(event);
  if (!input || typeof input !== "object" || Array.isArray(input)) return response(400, { error: "invalid_gift_action" });
  const database = getDatabase();
  const admin = await authenticateOwnerAdmin(database, event);
  const provider = { createInvoice: input => getQPayProvider().createInvoice(input), checkPayment: id => getQPayProvider().checkPayment(id) };
  return response(200, await supportGift(database, provider, admin.id, input));
});
