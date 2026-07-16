"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response } = require("./_lib/http.js"); const { createInvitation } = require("./_lib/advisor.js");
exports.handler = handler("POST", async (event, body) => response(201, await createInvitation(getDatabase(), event, body)));
