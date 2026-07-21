"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { confirmRecovery } = require("./_lib/recovery.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { assessmentContext, flagsFromEvent, recordEventSafe } = require("./_lib/analytics.js");
exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase(); await authenticateOwnerPreview(database, event);
  const result = await confirmRecovery(database, body);
  await recordEventSafe(database, "recovery_succeeded", await assessmentContext(database, result.assessmentId), { assessmentId: result.assessmentId },
    { idempotencyKey: `recovery_succeeded:${body.recoveryId}`, ...flagsFromEvent(event) });
  return response(200, { assessmentId: result.assessmentId, nextRoute: result.nextRoute, recovered: true }, { "set-cookie": result.cookie });
});
