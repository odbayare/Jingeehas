"use strict";

process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { hashToken } = require("../netlify/functions/_lib/crypto.js");
const { REPORT_VERSION } = require("../netlify/functions/_lib/report.js");
const { REPORT_SCHEMA_VERSION, reportPayload, resolveReportSnapshot } = require("../netlify/functions/_lib/report-snapshots.js");
const { validateReportForActivation } = require("../netlify/functions/_lib/report-validation.js");
const { GENERATION_REASON, checksum, regenerateReportVersion, ownerAdminReport } = require("../netlify/functions/_lib/report-regeneration.js");
const { reportForSession } = require("../netlify/functions/_lib/assessment.js");
const fixtures = require("./fixtures/report-gold-profiles.js");
const app = require("../app.js");

const now = new Date("2026-07-19T00:00:00.000Z");
const assessmentId = "wa-version-test";
const originalSessionId = "ws-version-owner";
const recoveredSessionId = "ws-version-recovered";
const adminId = "adm-version-owner";
const adminSessionId = "ads-version-owner";
const adminSecret = "version-test-admin-secret";
const event = { headers: { cookie: `jingeehas_admin=${adminSessionId}.${adminSecret}`, origin: "https://test.jingeehas.fit" } };

function versionRow(overrides = {}) {
  return {
    snapshotId: overrides.snapshotId || "00000000-0000-4000-8000-000000000001",
    assessmentId, versionNumber: overrides.versionNumber || 1,
    reportEngineVersion: overrides.reportEngineVersion || "legacy-unversioned",
    reportSchemaVersion: overrides.reportSchemaVersion || "legacy-report-snapshot-v1",
    reportPayload: overrides.reportPayload || reportPayload({ reportMode: "sufficient", initialView: { legacy: true }, fullReport: { legacy: true } }),
    snapshotStatus: overrides.snapshotStatus || "failed", isActive: overrides.isActive === true,
    generationReason: overrides.generationReason || "legacy_backfill_failed_quality",
    supersedesSnapshotId: overrides.supersedesSnapshotId || null, sourceLegacyAssessmentId: assessmentId,
    createdAt: overrides.createdAt || "2026-07-17T00:00:00.000Z", activatedAt: overrides.activatedAt || null,
    supersededAt: overrides.supersededAt || null, createdBy: overrides.createdBy || "migration:test",
    payloadChecksum: overrides.payloadChecksum || checksum(overrides.reportPayload || { legacy: true }),
    operationKey: overrides.operationKey || `legacy-backfill:${assessmentId}`
  };
}

async function seededDatabase({ includeVersion = true } = {}) {
  const database = new MemoryDatabaseAdapter();
  await database.insert("sessions", { id: originalSessionId, tokenHash: "owner", createdAt: now.toISOString(), expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null });
  await database.insert("sessions", { id: recoveredSessionId, tokenHash: "recovered", createdAt: now.toISOString(), expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null });
  await database.insert("admin_accounts", { id: adminId, email: "owner@example.invalid", passwordHash: "unused", status: "active", isOwner: true, createdAt: now.toISOString() });
  await database.insert("admin_sessions", { id: adminSessionId, adminId, tokenHash: hashToken(adminSecret), purpose: "admin", parentSessionId: null, expiresAt: "2027-01-01T00:00:00.000Z", revokedAt: null, createdAt: now.toISOString() });
  await database.insert("assessments", { id: assessmentId, sessionId: originalSessionId, safetyCheckId: "sc-version", status: "complete", reportMode: "sufficient", safetyRoute: null,
    questionnaireVersion: "jingeehas-weight-v2", createdAt: "2026-07-17T00:00:00.000Z", updatedAt: "2026-07-17T01:00:00.000Z", completedAt: "2026-07-17T01:00:00.000Z" });
  const answers = fixtures.find(item => item.name === "sustained movement attempt with explicit constraints").answers;
  for (const [questionId, value] of Object.entries(answers)) await database.insert("assessment_answers", { id: `${assessmentId}:${questionId}`, assessmentId, questionId, value, updatedAt: now.toISOString() });
  await database.insert("report_snapshots", { id: assessmentId, assessmentId, sessionId: originalSessionId, reportMode: "sufficient", safetyRoute: null,
    safetyProvenance: null, initialView: { legacy: true }, fullReport: { legacyBroken: true }, createdAt: "2026-07-17T01:00:00.000Z" });
  await database.insert("payments", { id: "wp-version", sessionId: originalSessionId, assessmentId, productCode: "WEIGHT_TEST_ONE_TIME", amount: 9900, status: "paid", createdAt: now.toISOString(), updatedAt: now.toISOString() });
  await database.insert("entitlements", { id: "we-version", sessionId: originalSessionId, assessmentId, paymentId: "wp-version", productCode: "WEIGHT_TEST_ONE_TIME", status: "active", grantedAt: now.toISOString() });
  await database.insert("assessment_sessions", { id: `${assessmentId}:${recoveredSessionId}`, assessmentId, sessionId: recoveredSessionId, source: "recovery", createdAt: now.toISOString() });
  if (includeVersion) database.table("report_snapshot_versions").set(versionRow().snapshotId, versionRow());
  return database;
}

(async () => {
  const legacyOnly = await seededDatabase({ includeVersion: false });
  const legacyResolved = await resolveReportSnapshot(legacyOnly, assessmentId);
  assert.equal(legacyResolved.snapshotMetadata.source, "legacy", "legacy-only assessment must remain readable");
  assert.equal(legacyResolved.fullReport.legacyBroken, true);

  const database = await seededDatabase();
  const protectedBefore = {
    assessment: await database.get("assessments", assessmentId),
    legacy: await database.get("report_snapshots", assessmentId),
    payments: await database.find("payments", { assessmentId }),
    entitlements: await database.find("entitlements", { assessmentId })
  };
  const input = { assessmentId, generationReason: GENERATION_REASON, expectedCurrentSnapshotId: "legacy",
    requestedReportEngineVersion: REPORT_VERSION, operationKey: "report-version-operation-0001" };
  const activated = await regenerateReportVersion(database, event, input, now);
  assert.equal(activated.versionNumber, 2);
  assert.equal(activated.snapshotStatus, "active");
  assert.equal((await database.listReportSnapshotVersions(assessmentId)).filter(row => row.isActive).length, 1);
  const activeResolved = await resolveReportSnapshot(database, assessmentId);
  assert.equal(activeResolved.snapshotMetadata.source, "versioned", "versioned active report must override legacy");
  assert.equal(activeResolved.snapshotMetadata.reportEngineVersion, REPORT_VERSION);
  assert.equal(validateReportForActivation(activeResolved.fullReport).valid, true);
  assert.equal(activeResolved.fullReport.planDecisionPending, false);
  assert(!/\d/.test(JSON.stringify(activeResolved.fullReport.prioritizedStartingAction.plan)), "owner launch plan must remain nonnumeric");

  const repeated = await regenerateReportVersion(database, event, input, new Date("2026-07-19T00:01:00.000Z"));
  assert.equal(repeated.snapshotId, activated.snapshotId, "operation key must be idempotent");
  assert.equal((await database.listReportSnapshotVersions(assessmentId)).length, 2, "idempotent retry must not create a version");
  assert.deepEqual(await database.get("assessments", assessmentId), protectedBefore.assessment, "regeneration must not mutate completion state");
  assert.deepEqual(await database.get("report_snapshots", assessmentId), protectedBefore.legacy, "legacy report must remain byte-for-byte unchanged in the adapter");
  assert.deepEqual(await database.find("payments", { assessmentId }), protectedBefore.payments, "regeneration must create no payment");
  assert.deepEqual(await database.find("entitlements", { assessmentId }), protectedBefore.entitlements, "regeneration must create no entitlement");

  const recovered = await reportForSession(database, recoveredSessionId, assessmentId);
  assert.equal(recovered.reportVersion.snapshotId, activated.snapshotId, "recovery must resolve the active version");
  const ownerPreview = await ownerAdminReport(database, event, assessmentId);
  assert.equal(ownerPreview.reportVersion.snapshotId, activated.snapshotId, "owner preview must resolve the active version");
  assert(!Object.hasOwn(ownerPreview.fullReport, "internalEvidenceMap"), "public/admin preview must not expose internal evidence");
  app._test.setState({ ownerPreview: true, report: ownerPreview });
  const reportHtml = app.renderForPath("/report");
  assert(reportHtml.includes("Хэвлэх эсвэл PDF-ээр хадгалах"), "print/PDF must render the active report");
  assert(reportHtml.includes("Бүрэн тайлан"));

  const inactivePayload = reportPayload({ reportMode: "sufficient", initialView: {}, fullReport: { marker: "inactive-must-not-render" } });
  const inactive = await database.createReportSnapshotVersion({ snapshotId: "00000000-0000-4000-8000-000000000003", assessmentId,
    reportEngineVersion: REPORT_VERSION, reportSchemaVersion: REPORT_SCHEMA_VERSION, reportPayload: inactivePayload,
    generationReason: "certification", supersedesSnapshotId: activated.snapshotId, sourceLegacyAssessmentId: assessmentId,
    createdAt: now.toISOString(), createdBy: `admin:${adminId}`, payloadChecksum: checksum(inactivePayload), operationKey: "report-version-operation-0003" });
  assert.equal((await resolveReportSnapshot(database, assessmentId)).fullReport.marker, undefined, "inactive version must never be public");
  database.table("report_snapshot_versions").set(inactive.snapshotId, { ...inactive, snapshotStatus: "failed" });
  assert.equal((await resolveReportSnapshot(database, assessmentId)).fullReport.marker, undefined, "failed version must never be public");
  database.table("report_snapshot_versions").set(inactive.snapshotId, inactive);

  await assert.rejects(() => database.activateReportSnapshotVersion(inactive.snapshotId, null, now), error => error.code === "active_snapshot_changed");
  assert.equal((await resolveReportSnapshot(database, assessmentId)).snapshotMetadata.snapshotId, activated.snapshotId, "failed activation must preserve prior active report");

  const fourthPayload = reportPayload({ reportMode: "sufficient", initialView: {}, fullReport: activeResolved.fullReport });
  const fourth = await database.createReportSnapshotVersion({ snapshotId: "00000000-0000-4000-8000-000000000004", assessmentId,
    reportEngineVersion: REPORT_VERSION, reportSchemaVersion: REPORT_SCHEMA_VERSION, reportPayload: fourthPayload,
    generationReason: "certification", supersedesSnapshotId: activated.snapshotId, sourceLegacyAssessmentId: assessmentId,
    createdAt: now.toISOString(), createdBy: `admin:${adminId}`, payloadChecksum: checksum(fourthPayload), operationKey: "report-version-operation-0004" });
  const concurrent = await Promise.allSettled([
    database.activateReportSnapshotVersion(inactive.snapshotId, activated.snapshotId, new Date("2026-07-19T00:02:00.000Z")),
    database.activateReportSnapshotVersion(fourth.snapshotId, activated.snapshotId, new Date("2026-07-19T00:02:00.000Z"))
  ]);
  assert.equal(concurrent.filter(result => result.status === "fulfilled").length, 1, "only one concurrent activation may succeed");
  assert.equal((await database.listReportSnapshotVersions(assessmentId)).filter(row => row.isActive).length, 1, "concurrent activation must leave exactly one active version");

  const migration = fs.readFileSync(path.join(__dirname, "..", "supabase", "migrations", "20260718224449_version_report_snapshots.sql"), "utf8");
  for (const contract of ["enable row level security", "revoke all on table jingeehas.report_snapshot_versions from public, anon, authenticated",
    "report_snapshot_versions_one_active_uidx", "pg_advisory_xact_lock", "for update", "JH_ACTIVE_REPORT_INVARIANT",
    "get_active_report_snapshot", "legacy_backfill", "payload_checksum"]) assert(migration.includes(contract), `migration contract missing: ${contract}`);
  assert(!migration.includes("drop table jingeehas.report_snapshots"));
  assert(!migration.includes("alter table jingeehas.report_snapshots"));
  const regenerationSource = fs.readFileSync(path.join(__dirname, "..", "netlify", "functions", "_lib", "report-regeneration.js"), "utf8");
  assert(!/console\.(?:log|info|warn|error)/.test(regenerationSource), "report payload must not enter application logs");
  assert(!/ownerLike|ownerProfile|ownerSpecialCase/.test(regenerationSource), "owner-specific inference path is prohibited");
  assert.equal(app.WEIGHT_TEST_COMING_SOON_MODE, false);
  console.log("versioned report snapshot and regeneration tests passed");
})().catch(error => { console.error(error); process.exitCode = 1; });
