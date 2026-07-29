"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authorizePilot } = require("./_lib/pilot-v2-access.js");
const { instrument, registry, contextRegistry, safetyRegistry, displayLabels } = require("./_lib/pilot-v2-engine.js");
const acknowledgment = require("../../pilot-v2/acknowledgment.js");
exports.handler = handler("GET", async event => {
  await authorizePilot(getDatabase(), event);
  return response(200, { instrument, scales: registry, contextRegistry, safetyRegistry, displayLabels, acknowledgment });
});
