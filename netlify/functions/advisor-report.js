"use strict";
const { getDatabase } = require("./_lib/store.js"); const { handler, response } = require("./_lib/http.js"); const { accessAdvisorReport } = require("./_lib/advisor.js");
exports.handler = handler("GET", async event => response(200, await accessAdvisorReport(getDatabase(), event, event.queryStringParameters?.assessmentId || "")));
