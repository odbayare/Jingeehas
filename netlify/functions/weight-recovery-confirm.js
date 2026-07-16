"use strict";
const { handler, response } = require("./_lib/http.js");
exports.handler = handler("POST", async () => response(503, { error: "recovery_not_available" }));
