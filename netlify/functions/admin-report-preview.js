"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { ownerAdminReport } = require("./_lib/report-regeneration.js");
exports.handler = handler("GET", async event => response(200, await ownerAdminReport(getDatabase(), event, event.queryStringParameters?.assessmentId || "")));
