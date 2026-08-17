"use strict";

const { authenticateOwnerAdmin } = require("./preview.js");
const { REPORT_VERSION } = require("./report.js");
const { REPORT_SCHEMA_VERSION } = require("./report-snapshots.js");

const GENERATION_REASON = "owner_approved_regeneration";
const MAX_TRANSACTION_OPERATIONS = 40;
const VERSION_LOOKUP_CONCURRENCY = 8;

async function transactionGets(database, table, ids) {
  const rows = [];
  for (let offset = 0; offset < ids.length; offset += MAX_TRANSACTION_OPERATIONS) {
    const batch = ids.slice(offset, offset + MAX_TRANSACTION_OPERATIONS);
    const result = await database.transaction(batch.map(id => ({ action: "get", table, id })));
    const batchRows = Array.isArray(result?.results) ? result.results : [];
    if (batchRows.length !== batch.length) {
      throw Object.assign(new Error("Incomplete batch response"), { code: "incomplete_batch_response" });
    }
    rows.push(...batchRows);
  }
  return rows;
}

async function mapWithConcurrency(items, limit, mapper) {
  if (!items.length) return [];
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function buildRegenerationCandidates(database) {
  const [assessments, activeEntitlements] = await Promise.all([
    database.find("assessments", { status: "complete" }),
    database.find("entitlements", { status: "active" })
  ]);

  const entitledAssessmentIds = new Set((activeEntitlements || []).map(row => row.assessmentId).filter(Boolean));
  const entitledAssessments = (assessments || []).filter(assessment => entitledAssessmentIds.has(assessment.id));
  const legacyRows = await transactionGets(database, "report_snapshots", entitledAssessments.map(assessment => assessment.id));
  const eligible = entitledAssessments.map((assessment, index) => ({ assessment, legacy: legacyRows[index] }))
    .filter(item => Boolean(item.legacy));

  const versionLists = await mapWithConcurrency(eligible, VERSION_LOOKUP_CONCURRENCY,
    item => database.listReportSnapshotVersions(item.assessment.id));

  return eligible.map((item, index) => {
    const versions = Array.isArray(versionLists[index]) ? versionLists[index] : [];
    const activeVersion = versions.find(row => row.isActive === true && row.snapshotStatus === "active") || null;
    const activeEngineVersion = activeVersion?.reportEngineVersion || item.legacy?.fullReport?.version || null;
    return {
      assessmentId: item.assessment.id,
      completedAt: item.assessment.completedAt,
      reportMode: item.assessment.reportMode,
      legacyPreserved: true,
      activeSnapshotId: activeVersion?.snapshotId || null,
      activeVersionNumber: activeVersion?.versionNumber || null,
      legacyFallback: !activeVersion,
      versionCount: versions.length,
      acceptedEngineActive: activeEngineVersion === REPORT_VERSION
    };
  });
}

async function listRegenerationCandidates(database, event) {
  await authenticateOwnerAdmin(database, event);
  return {
    reportEngineVersion: REPORT_VERSION,
    reportSchemaVersion: REPORT_SCHEMA_VERSION,
    generationReason: GENERATION_REASON,
    candidates: await buildRegenerationCandidates(database)
  };
}

module.exports = {
  GENERATION_REASON,
  MAX_TRANSACTION_OPERATIONS,
  VERSION_LOOKUP_CONCURRENCY,
  transactionGets,
  mapWithConcurrency,
  buildRegenerationCandidates,
  listRegenerationCandidates
};
