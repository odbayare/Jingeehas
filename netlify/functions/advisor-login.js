"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response } = require("./_lib/http.js"); const { advisorLogin } = require("./_lib/advisor.js");
exports.handler = handler("POST", async (_event, body) => { const result = await advisorLogin(getDatabase(), body.email, body.password); return response(200, { coachId: result.coachId, name: result.name, forcePasswordChange: result.forcePasswordChange }, { "set-cookie": result.cookie }); });
