"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response } = require("./_lib/http.js"); const { createAdvisor } = require("./_lib/admin.js");
exports.handler = handler("POST", async (event, body) => response(201, await createAdvisor(getDatabase(), event, body)));
