"use strict";
const crypto = require("node:crypto");
const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { authorizePilot } = require("./_lib/pilot-v2-access.js");
const { instrument, contextRegistry, safetyRegistry, SECTION_KEYS, VERSION_FIELDS, assertVersionLock,
  validateProfileResponses, validateContextResponses, validateSafetyResponses, buildPilotReport } = require("./_lib/pilot-v2-engine.js");

function publicState(row) {
  return {
    assessmentId: row.id, status: row.status, answers: row.answers || {},
    contextResponses: row.contextResponses || {}, safetyResponses: row.safetyResponses || {},
    lastCompletedSection: row.lastCompletedSection || null, report: row.report || null,
    provenance: { instrumentVersion: row.instrumentVersion, itemBankHash: row.itemBankHash,
      scoringVersion: row.scoringVersion, reportVersion: row.reportVersion, generatedAt: row.generatedAt }
  };
}

exports.handler = handler("POST", async (event, body) => {
  const database = getDatabase();
  const access = await authorizePilot(database, event);
  const now = new Date().toISOString();
  const action = String(body.action || "");
  if (action === "start") {
    const assessment = {
      id: `pv2_${crypto.randomUUID()}`, accessSubjectHash: access.subjectHash, status: "in_progress",
      ...VERSION_FIELDS, pilotStatusLabel: instrument.pilotStatusLabel, generatedAt: now,
      answers: {}, contextResponses: {}, safetyResponses: {}, lastCompletedSection: null, report: null
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
  assertVersionLock(current);
  if (action === "load") return response(200, publicState(current));
  if (action === "save") {
    if ("context" in body || "safety" in body) throw Object.assign(new Error("Semantic module objects are not accepted"), { statusCode: 400, code: "invalid_pilot_response" });
    const answers = validateProfileResponses(body.answers || {});
    const contextResponses = validateContextResponses(body.contextResponses || {});
    const safetyResponses = validateSafetyResponses(body.safetyResponses || {});
    const lastCompletedSection = String(body.lastCompletedSection || "");
    if (!SECTION_KEYS.includes(lastCompletedSection)) throw Object.assign(new Error("Invalid pilot section"), { statusCode: 400, code: "invalid_pilot_section" });
    const updated = { ...current, answers: { ...(current.answers || {}), ...answers },
      contextResponses: { ...(current.contextResponses || {}), ...contextResponses },
      safetyResponses: { ...(current.safetyResponses || {}), ...safetyResponses },
      lastCompletedSection, updatedAt: now };
    await database.savePilotV2Assessment(updated);
    return response(200, { assessmentId, status: updated.status, lastCompletedSection,
      savedItemKeys: Object.keys(answers), savedContextKeys: Object.keys(contextResponses), savedSafetyKeys: Object.keys(safetyResponses) });
  }
  if (action === "complete") {
    if ("context" in body || "safety" in body || "answers" in body || "contextResponses" in body || "safetyResponses" in body) {
      throw Object.assign(new Error("Completion uses only stored validated responses"), { statusCode: 400, code: "invalid_pilot_response" });
    }
    const missingSafety = safetyRegistry.items.some(item => !item.options.some(option => option.code === current.safetyResponses?.[item.itemKey]));
    if (missingSafety) throw Object.assign(new Error("Safety module is incomplete"), { statusCode: 400, code: "pilot_safety_incomplete" });
    const report = buildPilotReport({ answers: current.answers || {}, contextResponses: current.contextResponses || {},
      safetyResponses: current.safetyResponses || {}, generatedAt: now });
    const updated = { ...current, report, status: "complete", completedAt: now, updatedAt: now };
    await database.savePilotV2Assessment(updated);
    return response(200, { assessmentId, status: "complete", report, safetyRoute: report.safetyRoute });
  }
  throw Object.assign(new Error("Invalid action"), { statusCode: 400, code: "invalid_pilot_action" });
});
