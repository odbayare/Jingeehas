"use strict";
const { getDatabase } = require("./_lib/store.js");
const { getQPayProvider } = require("./_lib/qpay.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { createInvoice } = require("./_lib/payment.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  const session = await authenticateSession(database, event);
  return response(200, await createInvoice(database, getQPayProvider(), session.id, body));
});
