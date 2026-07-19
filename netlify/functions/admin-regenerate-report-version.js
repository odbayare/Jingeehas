"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { regenerateReportVersion } = require("./_lib/report-regeneration.js");

function requireSameOrigin(event) {
  const origin = String(event.headers?.origin || event.headers?.Origin || "");
  const allowed = new Set(["https://jingeehas.fit", "https://www.jingeehas.fit"]);
  if (process.env.NODE_ENV === "test") allowed.add("https://test.jingeehas.fit");
  if (!allowed.has(origin)) throw Object.assign(new Error("Same-origin request required"), { statusCode: 403, code: "same_origin_required" });
}

exports.handler = handler("POST", async (event, body) => {
  requireSameOrigin(event);
  return response(201, await regenerateReportVersion(getDatabase(), event, body));
});
exports.requireSameOrigin = requireSameOrigin;
