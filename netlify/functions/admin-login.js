"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response } = require("./_lib/http.js"); const { adminLogin } = require("./_lib/advisor.js");
exports.handler = handler("POST", async (_event, body) => { const result = await adminLogin(getDatabase(), body.email, body.password); return response(200, { adminId: result.adminId }, { "set-cookie": result.cookie }); });
