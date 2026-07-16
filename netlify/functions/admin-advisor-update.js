"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response } = require("./_lib/http.js"); const { updateAdvisor } = require("./_lib/admin.js");
exports.handler = handler("POST", async (event, body) => response(200, await updateAdvisor(getDatabase(), event, body)));
