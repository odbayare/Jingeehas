"use strict";

const REPORT_SCHEMA_VERSION = "jingeehas-report-snapshot-v1";

function reportPayload({ reportMode, safetyRoute = null, safetyProvenance = null, initialView = {}, fullReport = null }) {
  return { reportMode, safetyRoute, safetyProvenance, initialView, fullReport };
}

async function resolveReportSnapshot(database, assessmentId) {
  const snapshot = await database.getActiveReportSnapshot(assessmentId);
  if (!snapshot) return null;
  return {
    assessmentId,
    reportMode: snapshot.reportMode,
    safetyRoute: snapshot.safetyRoute || null,
    safetyProvenance: snapshot.safetyProvenance || null,
    initialView: snapshot.initialView || {},
    fullReport: snapshot.fullReport || null,
    snapshotMetadata: {
      source: snapshot.source,
      snapshotId: snapshot.snapshotId || null,
      versionNumber: snapshot.versionNumber || null,
      reportEngineVersion: snapshot.reportEngineVersion || snapshot.fullReport?.version || null,
      reportSchemaVersion: snapshot.reportSchemaVersion || null
    }
  };
}

function safeVersionMetadata(row) {
  if (!row) return null;
  return {
    snapshotId: row.snapshotId,
    assessmentId: row.assessmentId,
    versionNumber: row.versionNumber,
    reportEngineVersion: row.reportEngineVersion,
    reportSchemaVersion: row.reportSchemaVersion,
    snapshotStatus: row.snapshotStatus,
    isActive: row.isActive === true,
    generationReason: row.generationReason,
    supersedesSnapshotId: row.supersedesSnapshotId || null,
    sourceLegacyAssessmentId: row.sourceLegacyAssessmentId || null,
    createdAt: row.createdAt,
    activatedAt: row.activatedAt || null,
    supersededAt: row.supersededAt || null,
    createdBy: row.createdBy
  };
}

module.exports = { REPORT_SCHEMA_VERSION, reportPayload, resolveReportSnapshot, safeVersionMetadata };
