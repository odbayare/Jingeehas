"use strict";

const nodeCrypto = require("node:crypto");
const { randomId } = require("./crypto.js");
const { authenticateOwnerAdmin } = require("./preview.js");
const { REPORT_VERSION, buildEvidence, buildFullReport, publicReport } = require("./report.js");
const { REPORT_SCHEMA_VERSION, reportPayload, resolveReportSnapshot, safeVersionMetadata } = require("./report-snapshots.js");
const { validateReportForActivation } = require("./report-validation.js");
const { assessmentQuestionnaireVersion } = require("./assessment.js");
const { autoLinkedLongestMethod } = require("../../../questions.js");

const GENERATION_REASON = "owner_approved_regeneration";

function checksum(payload) {
  return nodeCrypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function validateInput(input = {}) {
  if (!/^[a-zA-Z0-9_-]{8,160}$/.test(String(input.assessmentId || ""))) throw Object.assign(new Error("Invalid assessment"), { statusCode: 400, code: "invalid_assessment" });
  if (!/^[a-zA-Z0-9_-]{20,160}$/.test(String(input.operationKey || ""))) throw Object.assign(new Error("Invalid operation key"), { statusCode: 400, code: "invalid_operation_key" });
  if (input.generationReason !== GENERATION_REASON) throw Object.assign(new Error("Invalid generation reason"), { statusCode: 400, code: "invalid_generation_reason" });
  if (input.requestedReportEngineVersion !== REPORT_VERSION) throw Object.assign(new Error("Report engine mismatch"), { statusCode: 409, code: "report_engine_mismatch" });
}

async function listRegenerationCandidates(database, event) {
  await authenticateOwnerAdmin(database, event);
  const assessments = await database.find("assessments", { status: "complete" });
  const candidates = [];
  for (const assessment of assessments) {
    const legacy = await database.get("report_snapshots", assessment.id);
    const entitlement = (await database.find("entitlements", { assessmentId: assessment.id, status: "active" }))[0] || null;
    if (!legacy || !entitlement) continue;
    const active = await resolveReportSnapshot(database, assessment.id);
    const versions = await database.listReportSnapshotVersions(assessment.id);
    candidates.push({
      assessmentId: assessment.id,
      completedAt: assessment.completedAt,
      reportMode: assessment.reportMode,
      legacyPreserved: true,
      activeSnapshotId: active?.snapshotMetadata?.source === "versioned" ? active.snapshotMetadata.snapshotId : null,
      activeVersionNumber: active?.snapshotMetadata?.source === "versioned" ? active.snapshotMetadata.versionNumber : null,
      legacyFallback: active?.snapshotMetadata?.source !== "versioned",
      versionCount: versions.length,
      acceptedEngineActive: active?.snapshotMetadata?.reportEngineVersion === REPORT_VERSION
    });
  }
  return { reportEngineVersion: REPORT_VERSION, reportSchemaVersion: REPORT_SCHEMA_VERSION, generationReason: GENERATION_REASON, candidates };
}

async function regenerateReportVersion(database, event, input = {}, now = new Date()) {
  const adminSession = await authenticateOwnerAdmin(database, event);
  validateInput(input);
  const assessment = await database.get("assessments", input.assessmentId);
  if (!assessment || assessment.status !== "complete") throw Object.assign(new Error("Completed assessment required"), { statusCode: 404, code: "completed_assessment_not_found" });
  const legacy = await database.get("report_snapshots", assessment.id);
  if (!legacy) throw Object.assign(new Error("Legacy report required"), { statusCode: 409, code: "legacy_report_required" });
  const entitlement = (await database.find("entitlements", { assessmentId: assessment.id, status: "active" }))[0] || null;
  if (!entitlement) throw Object.assign(new Error("Existing entitlement required"), { statusCode: 409, code: "existing_entitlement_required" });

  const existing = (await database.listReportSnapshotVersions(assessment.id)).find(row => row.operationKey === input.operationKey);
  if (existing?.snapshotStatus === "active" && existing.isActive) return safeVersionMetadata(existing);

  const answerRows = await database.find("assessment_answers", { assessmentId: assessment.id });
  const summaries = await database.find("assessment_summaries", { assessmentId: assessment.id });
  const questionnaireVersion = assessmentQuestionnaireVersion(assessment);
  const answerMap = Object.fromEntries(answerRows.map(row => [row.questionId, row.value]));
  const linkedLongestMethod = autoLinkedLongestMethod(answerMap, questionnaireVersion);
  const evidenceRows = linkedLongestMethod && !answerMap["Q-METHOD-LONGEST"]
    ? [...answerRows, { questionId: "Q-METHOD-LONGEST", value: linkedLongestMethod, derived: true }]
    : answerRows;
  const evidence = buildEvidence(evidenceRows, summaries, { questionnaireVersion, linkedLongestMethod });
  const fullReport = buildFullReport(evidence, now, { questionnaireVersion });
  const validation = validateReportForActivation(fullReport);
  if (!validation.valid) throw Object.assign(new Error("Generated report failed validation"), { statusCode: 422, code: "report_validation_failed", validationErrors: validation.errors });
  const payload = reportPayload({
    reportMode: fullReport.mode,
    safetyRoute: null,
    safetyProvenance: null,
    initialView: { mode: fullReport.mode, evidenceCount: fullReport.internalEvidenceMap.informativeQuestionCount },
    fullReport
  });
  const current = await resolveReportSnapshot(database, assessment.id);
  const currentVersionedId = current?.snapshotMetadata?.source === "versioned" ? current.snapshotMetadata.snapshotId : null;
  const expected = input.expectedCurrentSnapshotId === "legacy" ? null : input.expectedCurrentSnapshotId || null;
  if (expected !== currentVersionedId) throw Object.assign(new Error("Active report changed"), { statusCode: 409, code: "active_snapshot_changed" });
  const created = existing || await database.createReportSnapshotVersion({
    snapshotId: nodeCrypto.randomUUID(), assessmentId: assessment.id, reportEngineVersion: REPORT_VERSION,
    reportSchemaVersion: REPORT_SCHEMA_VERSION, reportPayload: payload, generationReason: GENERATION_REASON,
    supersedesSnapshotId: currentVersionedId, sourceLegacyAssessmentId: assessment.id,
    createdAt: now.toISOString(), createdBy: `admin:${adminSession.adminId}`,
    payloadChecksum: checksum(payload), operationKey: input.operationKey
  });
  const activated = await database.activateReportSnapshotVersion(created.snapshotId, currentVersionedId, now);
  await database.insert("admin_audit_logs", {
    id: randomId("aal_"), adminId: adminSession.adminId, action: "report_version_regenerated",
    targetType: "report_snapshot_version", targetId: activated.snapshotId,
    details: { assessmentId: assessment.id, versionNumber: activated.versionNumber, reportEngineVersion: REPORT_VERSION,
      reportSchemaVersion: REPORT_SCHEMA_VERSION, generationReason: GENERATION_REASON }, createdAt: now.toISOString()
  });
  return safeVersionMetadata(activated);
}

async function ownerAdminReport(database, event, assessmentId) {
  await authenticateOwnerAdmin(database, event);
  const assessment = await database.get("assessments", assessmentId);
  if (!assessment || assessment.status !== "complete") throw Object.assign(new Error("Report not found"), { statusCode: 404, code: "report_not_found" });
  const snapshot = await resolveReportSnapshot(database, assessmentId);
  if (!snapshot) throw Object.assign(new Error("Report not found"), { statusCode: 404, code: "report_not_found" });
  return { assessmentId, reportMode: snapshot.reportMode, safetyRoute: snapshot.safetyRoute,
    initialView: snapshot.initialView, fullReport: publicReport(snapshot.fullReport), reportVersion: snapshot.snapshotMetadata };
}

module.exports = { GENERATION_REASON, checksum, validateInput, listRegenerationCandidates, regenerateReportVersion, ownerAdminReport };
