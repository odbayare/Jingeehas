"use strict";

const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { redeemAccessHandoff, INVALID_HANDOFF } = require("./_lib/handoff.js");
const { assessmentContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  const result = await redeemAccessHandoff(database, body.token, event, new Date());
  if (result.status !== "ok") return response(200, INVALID_HANDOFF);
  await recordEventSafe(database, "recovery_succeeded", await assessmentContext(database, result.assessmentId), { assessmentId: result.assessmentId }, {
    idempotencyKey: `handoff_redeemed:${result.assessmentId}:${event.requestContext?.requestId || "request"}`, ...flagsFromEvent(event)
  });
  return response(200, { status: "ok", nextRoute: result.nextRoute, recovered: true }, { "set-cookie": result.cookie });
});
