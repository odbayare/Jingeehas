"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authenticateSession } = require("./_lib/session.js");
const { ownedAssessment } = require("./_lib/assessment.js");
const { isPrepaid, requirePaidAccess } = require("./_lib/commercial-flow.js");
const { authenticateOwnerPreview } = require("./_lib/preview.js");
const { saveEntitledReportEmail, getRecoveryDelivery, requestRecovery } = require("./_lib/recovery.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  await authenticateOwnerPreview(database, event);
  const session = await authenticateSession(database, event);
  const assessment = await ownedAssessment(database, session.id, body.assessmentId || "");
  if (assessment.status !== "complete") throw Object.assign(new Error("Assessment is not complete"), { statusCode: 409, code: "assessment_incomplete" });
  if (isPrepaid(assessment)) await requirePaidAccess(database, assessment);
  const saved = await saveEntitledReportEmail(database, session.id, assessment, body);
  if (!saved.alreadySaved) {
    const clientKey = event.headers?.["x-nf-client-connection-ip"] || event.headers?.["client-ip"] || "unknown";
    const sessionKey = `${session.id}:${assessment.id}`;
    await requestRecovery(database, getRecoveryDelivery(), { email: saved.email }, { ip: clientKey, session: sessionKey });
  }
  return response(200, { saved: true, alreadySaved: Boolean(saved.alreadySaved), message: "Имэйл хадгалагдлаа. Та тайлангаа энэ имэйлээр дараа нь сэргээж нээх боломжтой." });
});
