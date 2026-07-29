"use strict";
const crypto = require("node:crypto");
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authorizePilot } = require("./_lib/pilot-v2-access.js");
const { instrument, buildPilotReport } = require("./_lib/pilot-v2-engine.js");

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  const access = await authorizePilot(database, event);
  const now = new Date().toISOString();
  const action = String(body.action || "");
  if (action === "start") {
    const assessment = {
      id: `pv2_${crypto.randomUUID()}`, accessSubjectHash: access.subjectHash, status: "in_progress",
      instrumentVersion: instrument.instrumentVersion, itemBankHash: instrument.itemBankSha256,
      scoringVersion: instrument.scoringVersion, reportVersion: instrument.reportVersion,
      pilotStatusLabel: instrument.pilotStatusLabel, generatedAt: now, answers: {}, context: {}, report: null
    };
    await database.savePilotV2Assessment(assessment);
    return response(201, { assessmentId: assessment.id, status: assessment.status, provenance: {
      instrumentVersion: assessment.instrumentVersion, itemBankHash: assessment.itemBankHash,
      scoringVersion: assessment.scoringVersion, reportVersion: assessment.reportVersion, generatedAt: assessment.generatedAt
    } });
  }
  const assessmentId = String(body.assessmentId || "");
  const current = await database.getPilotV2Assessment(assessmentId, access.subjectHash);
  if (!current) throw Object.assign(new Error("Not found"), { statusCode: 404, code: "pilot_assessment_not_found" });
  if (action === "load") return response(200, current);
  if (action === "save") {
    const allowedKeys = new Set(instrument.items.map(item => item.itemKey));
    const answers = Object.fromEntries(Object.entries(body.answers || {}).filter(([key]) => allowedKeys.has(key)));
    const updated = { ...current, answers: { ...(current.answers || {}), ...answers }, updatedAt: now };
    await database.savePilotV2Assessment(updated);
    return response(200, { assessmentId, status: updated.status, savedItemKeys: Object.keys(answers) });
  }
  if (action === "complete") {
    const allowedContext = new Set(["sleep", "movement", "injury", "schedule", "cost", "socialSupport", "medication", "reproductiveContext", "urgentSafety"]);
    const context = body.context && typeof body.context === "object"
      ? Object.fromEntries(Object.entries(body.context).filter(([key]) => allowedContext.has(key))) : {};
    const report = buildPilotReport({ answers: current.answers || {}, context, safety: body.safety || null, generatedAt: now });
    const updated = { ...current, context, report, status: "complete", completedAt: now, updatedAt: now };
    await database.savePilotV2Assessment(updated);
    return response(200, { assessmentId, status: "complete", report, safetyRoute: report.safetyRoute });
  }
  throw Object.assign(new Error("Invalid action"), { statusCode: 400, code: "invalid_pilot_action" });
});
