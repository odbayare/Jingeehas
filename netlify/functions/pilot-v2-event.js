"use strict";
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authorizePilot } = require("./_lib/pilot-v2-access.js");
const { SECTION_KEYS } = require("./_lib/pilot-v2-engine.js");
const ALLOWED = new Set(["pilot_started", "section_reached", "pilot_completed", "report_opened", "error_category"]);
const ERROR_CATEGORIES = new Set(["network_failure", "expired_invite", "version_mismatch", "invalid_response", "save_failure", "completion_failure"]);
exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase(); const access = await authorizePilot(database, event);
  if (!ALLOWED.has(body.eventName)) throw Object.assign(new Error("Invalid event"), { statusCode: 400, code: "invalid_pilot_event" });
  if (body.eventName === "section_reached" && !SECTION_KEYS.includes(body.section)) throw Object.assign(new Error("Invalid section"), { statusCode: 400, code: "invalid_pilot_event" });
  if (body.eventName === "error_category" && !ERROR_CATEGORIES.has(body.category)) throw Object.assign(new Error("Invalid error category"), { statusCode: 400, code: "invalid_pilot_event" });
  const assessmentId = String(body.assessmentId || "");
  const ownedAssessment = assessmentId ? await database.getPilotV2Assessment(assessmentId, access.subjectHash) : null;
  if (!ownedAssessment) throw Object.assign(new Error("Pilot event not accepted"), { statusCode: 404, code: "pilot_event_not_allowed" });
  const eventRow = { eventName: body.eventName, assessmentId: body.assessmentId || null, accessSubjectHash: access.subjectHash,
    category: body.eventName === "error_category" ? String(body.category || "unspecified").slice(0, 40) : null,
    section: body.eventName === "section_reached" ? String(body.section || "unspecified").slice(0, 40) : null, occurredAt: new Date().toISOString() };
  await database.recordPilotV2Event(eventRow);
  return response(202, { accepted: true });
});
