"use strict";

const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { initialResultForSession } = require("./_lib/assessment.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, funnelKeyHash, recordEventSafe } = require("./_lib/analytics.js");

exports.handler = handler("GET", async event => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessmentId = event.queryStringParameters?.assessmentId || "";
  const result = await initialResultForSession(database, session.id, assessmentId);
  const key = funnelKeyHash(assessmentId);
  await recordEventSafe(database, "initial_result_viewed", await assessmentContext(database, assessmentId), { funnelKeyHash: key }, {
    idempotencyKey: `initial_result_viewed:${key}`,
    metadata: { resultVariant: "count_only_v2" },
    ...flagsFromEvent(event)
  });
  return response(200, result);
});
