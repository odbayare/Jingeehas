"use strict";

const assert = require("node:assert/strict");
const { REPORT_VERSION } = require("../netlify/functions/_lib/report.js");
const { buildRegenerationCandidates } = require("../netlify/functions/_lib/report-regeneration-candidates.js");

(async () => {
  const calls = { find: [], transaction: [], versions: [] };
  const database = {
    async find(table, filters) {
      calls.find.push({ table, filters });
      if (table === "assessments") return [
        { id: "assessment-paid-versioned", status: "complete", completedAt: "2026-08-17T01:00:00.000Z", reportMode: "standard" },
        { id: "assessment-paid-legacy", status: "complete", completedAt: "2026-08-17T02:00:00.000Z", reportMode: "standard" },
        { id: "assessment-unpaid", status: "complete", completedAt: "2026-08-17T03:00:00.000Z", reportMode: "standard" }
      ];
      if (table === "entitlements") return [
        { id: "entitlement-1", assessmentId: "assessment-paid-versioned", status: "active" },
        { id: "entitlement-2", assessmentId: "assessment-paid-legacy", status: "active" }
      ];
      throw new Error(`Unexpected find table: ${table}`);
    },
    async transaction(operations) {
      calls.transaction.push(operations);
      assert.deepEqual(operations, [
        { action: "get", table: "report_snapshots", id: "assessment-paid-versioned" },
        { action: "get", table: "report_snapshots", id: "assessment-paid-legacy" }
      ]);
      return { results: [
        { assessmentId: "assessment-paid-versioned", fullReport: { version: "older-engine" } },
        { assessmentId: "assessment-paid-legacy", fullReport: { version: REPORT_VERSION } }
      ] };
    },
    async listReportSnapshotVersions(assessmentId) {
      calls.versions.push(assessmentId);
      if (assessmentId === "assessment-paid-versioned") return [
        { snapshotId: "11111111-1111-4111-8111-111111111111", versionNumber: 2, reportEngineVersion: REPORT_VERSION, snapshotStatus: "active", isActive: true }
      ];
      if (assessmentId === "assessment-paid-legacy") return [];
      throw new Error(`Unpaid assessment must not trigger version lookup: ${assessmentId}`);
    }
  };

  const candidates = await buildRegenerationCandidates(database);
  assert.equal(candidates.length, 2);
  assert.deepEqual(calls.find, [
    { table: "assessments", filters: { status: "complete" } },
    { table: "entitlements", filters: { status: "active" } }
  ]);
  assert.equal(calls.transaction.length, 1);
  assert.deepEqual(new Set(calls.versions), new Set(["assessment-paid-versioned", "assessment-paid-legacy"]));

  const versioned = candidates.find(row => row.assessmentId === "assessment-paid-versioned");
  assert.equal(versioned.activeSnapshotId, "11111111-1111-4111-8111-111111111111");
  assert.equal(versioned.activeVersionNumber, 2);
  assert.equal(versioned.legacyFallback, false);
  assert.equal(versioned.versionCount, 1);
  assert.equal(versioned.acceptedEngineActive, true);

  const legacy = candidates.find(row => row.assessmentId === "assessment-paid-legacy");
  assert.equal(legacy.activeSnapshotId, null);
  assert.equal(legacy.activeVersionNumber, null);
  assert.equal(legacy.legacyFallback, true);
  assert.equal(legacy.versionCount, 0);
  assert.equal(legacy.acceptedEngineActive, true);

  console.log("admin report candidate performance tests passed");
})().catch(error => { console.error(error); process.exit(1); });
