"use strict";
const { TABLES } = require("../../netlify/functions/_lib/config.js");
function copy(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }

class MemoryDatabaseAdapter {
  constructor() { this.tables = Object.fromEntries(TABLES.map(table => [table, new Map()])); this.activationLocks = new Map(); }
  table(name) { if (!this.tables[name]) throw new Error(`Unknown table: ${name}`); return this.tables[name]; }
  async get(table, id) { return copy(this.table(table).get(id) || null); }
  async find(table, filters = {}) { return copy([...this.table(table).values()].filter(row => Object.entries(filters).every(([key, value]) => row[key] === value))); }
  async insert(table, row) {
    const rows = this.table(table);
    const cooldownFields = ["contactCooldownKey", "ipCooldownKey", "sessionCooldownKey"];
    const cooldownConflict = table === "recovery_challenges" && [...rows.values()].some(existing =>
      cooldownFields.some(field => row[field] && existing[field] === row[field]));
    const activePaymentStatuses = new Set(["creating", "create_unknown", "reconciling", "pending", "checking", "check_error"]);
    const activePaymentConflict = table === "payments" && activePaymentStatuses.has(row.status) && [...rows.values()].some(existing =>
      activePaymentStatuses.has(existing.status) && existing.sessionId === row.sessionId &&
      existing.assessmentId === row.assessmentId && existing.productCode === row.productCode);
    const analyticsConflict = table === "analytics_events" && [...rows.values()].some(existing =>
      existing.eventId === row.eventId || (row.idempotencyKey && existing.idempotencyKey === row.idempotencyKey));
    if (!row.id || rows.has(row.id) || cooldownConflict || activePaymentConflict || analyticsConflict) throw Object.assign(new Error("Record conflict"), { statusCode: 409, code: "conflict" });
    rows.set(row.id, copy(row)); return copy(row);
  }
  async update(table, id, patch) { const current = await this.get(table, id); if (!current) throw Object.assign(new Error("Record not found"), { statusCode: 404, code: "not_found" }); const next = { ...current, ...copy(patch), id }; this.table(table).set(id, next); return copy(next); }
  async upsert(table, id, row) { const next = { ...(await this.get(table, id) || {}), ...copy(row), id }; this.table(table).set(id, next); return copy(next); }
  async delete(table, id) { return { deleted: this.table(table).delete(id) }; }
  async consumeRecoveryChallenge(id, codeHash, now) {
    const rows = this.table("recovery_challenges");
    const challenge = copy(rows.get(id) || null);
    const current = new Date(now);
    if (!challenge || challenge.usedAt || !challenge.contactId || challenge.attempts >= 5 || new Date(challenge.expiresAt) <= current) return null;
    if (challenge.codeHash !== codeHash) {
      rows.set(id, { ...challenge, attempts: Math.min(5, Number(challenge.attempts || 0) + 1) });
      return null;
    }
    const consumed = { ...challenge, usedAt: current.toISOString() };
    rows.set(id, consumed);
    return copy(consumed);
  }
  async transaction(operations, options = {}) {
    const snapshot = Object.fromEntries(Object.entries(this.tables).map(([name, rows]) => [name, new Map([...rows.entries()].map(([id, row]) => [id, copy(row)]))]));
    try {
      const results = [];
      for (const operation of operations) {
        if (operation.action === "get") results.push(await this.get(operation.table, operation.id));
        else if (operation.action === "find") results.push(await this.find(operation.table, operation.filters));
        else if (operation.action === "insert") results.push(await this.insert(operation.table, operation.row));
        else if (operation.action === "update") results.push(await this.update(operation.table, operation.id, operation.patch));
        else if (operation.action === "upsert") results.push(await this.upsert(operation.table, operation.id, operation.row));
        else if (operation.action === "delete") results.push(await this.delete(operation.table, operation.id));
        else throw new Error(`Unknown transaction action: ${operation.action}`);
      }
      if (options.rollback) { this.tables = snapshot; return { rolledBack: true, results }; }
      return { rolledBack: false, results };
    } catch (error) { this.tables = snapshot; throw error; }
  }
  async getActiveReportSnapshot(assessmentId) {
    const active = (await this.listReportSnapshotVersions(assessmentId)).find(row => row.isActive && row.snapshotStatus === "active");
    if (active) return { ...copy(active.reportPayload), snapshotId: active.snapshotId, versionNumber: active.versionNumber,
      reportEngineVersion: active.reportEngineVersion, reportSchemaVersion: active.reportSchemaVersion, source: "versioned" };
    const legacy = await this.get("report_snapshots", assessmentId);
    return legacy ? { ...legacy, snapshotId: null, versionNumber: null, reportEngineVersion: legacy.fullReport?.version || null,
      reportSchemaVersion: null, source: "legacy" } : null;
  }
  async listReportSnapshotVersions(assessmentId) {
    return copy([...this.table("report_snapshot_versions").values()].filter(row => row.assessmentId === assessmentId)
      .sort((left, right) => right.versionNumber - left.versionNumber));
  }
  async getReportSnapshotVersion(snapshotId) { return this.get("report_snapshot_versions", snapshotId); }
  async createReportSnapshotVersion(input) {
    const rows = this.table("report_snapshot_versions");
    const existing = [...rows.values()].find(row => row.assessmentId === input.assessmentId && row.operationKey === input.operationKey);
    if (existing) return copy(existing);
    const versions = await this.listReportSnapshotVersions(input.assessmentId);
    const row = { snapshotId: input.snapshotId, assessmentId: input.assessmentId, versionNumber: (versions[0]?.versionNumber || 0) + 1,
      reportEngineVersion: input.reportEngineVersion, reportSchemaVersion: input.reportSchemaVersion, reportPayload: copy(input.reportPayload),
      snapshotStatus: "generated", isActive: false, generationReason: input.generationReason,
      supersedesSnapshotId: input.supersedesSnapshotId || null, sourceLegacyAssessmentId: input.sourceLegacyAssessmentId || null,
      createdAt: input.createdAt, activatedAt: null, supersededAt: null, createdBy: input.createdBy,
      payloadChecksum: input.payloadChecksum, operationKey: input.operationKey };
    rows.set(row.snapshotId, copy(row));
    return copy(row);
  }
  async activateReportSnapshotVersion(snapshotId, expectedCurrentSnapshotId = null, now = new Date()) {
    const target = await this.getReportSnapshotVersion(snapshotId);
    if (!target) throw Object.assign(new Error("Snapshot not found"), { statusCode: 404, code: "snapshot_not_found" });
    const previous = this.activationLocks.get(target.assessmentId) || Promise.resolve();
    let release;
    const currentLock = new Promise(resolve => { release = resolve; });
    this.activationLocks.set(target.assessmentId, previous.then(() => currentLock));
    await previous;
    try {
      const fresh = await this.getReportSnapshotVersion(snapshotId);
      if (fresh.snapshotStatus === "active" && fresh.isActive) return fresh;
      if (fresh.snapshotStatus !== "generated" || fresh.isActive) throw Object.assign(new Error("Snapshot is not activatable"), { statusCode: 409, code: "snapshot_not_generated" });
      const versions = await this.listReportSnapshotVersions(fresh.assessmentId);
      const active = versions.find(row => row.isActive && row.snapshotStatus === "active") || null;
      if ((active?.snapshotId || null) !== (expectedCurrentSnapshotId || null)) throw Object.assign(new Error("Active snapshot changed"), { statusCode: 409, code: "active_snapshot_changed" });
      const activatedAt = new Date(now).toISOString();
      if (active) this.table("report_snapshot_versions").set(active.snapshotId, { ...active, isActive: false, snapshotStatus: "superseded", supersededAt: activatedAt });
      const activated = { ...fresh, isActive: true, snapshotStatus: "active", activatedAt };
      this.table("report_snapshot_versions").set(fresh.snapshotId, activated);
      const activeCount = (await this.listReportSnapshotVersions(fresh.assessmentId)).filter(row => row.isActive && row.snapshotStatus === "active").length;
      if (activeCount !== 1) throw new Error("Activation invariant failed");
      return copy(activated);
    } finally { release(); if (this.activationLocks.get(target.assessmentId) === currentLock) this.activationLocks.delete(target.assessmentId); }
  }
  async getDailyFunnelAnalytics(startDate, endDate) {
    const rows = [...this.table("analytics_events").values()].filter(row => !row.isAdmin && !row.isOwnerPreview && !row.isTest);
    const day = value => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
    const output = [];
    for (let cursor = new Date(`${startDate}T00:00:00+08:00`); cursor <= new Date(`${endDate}T00:00:00+08:00`); cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      const date = day(cursor); const events = rows.filter(row => day(row.occurredAt) === date);
      const distinct = (name, key) => new Set(events.filter(row => row.eventName === name && row[key]).map(row => row[key])).size;
      const payments = events.filter(row => row.eventName === "payment_confirmed" && row.paymentId);
      output.push({ date, uniqueVisitors: distinct("landing_viewed", "visitorIdHash"), landingViews: events.filter(row => row.eventName === "landing_viewed").length,
        assessmentsStarted: distinct("assessment_started", "assessmentId"), assessmentsCompleted: distinct("assessment_completed", "assessmentId"),
        paywallViews: distinct("paywall_viewed", "assessmentId"), invoicesCreated: distinct("invoice_created", "invoiceId"),
        paymentsConfirmed: new Set(payments.map(row => row.paymentId)).size,
        revenueMnt: [...new Map(payments.map(row => [row.paymentId, Number(row.amountMnt || 0)])).values()].reduce((sum, value) => sum + value, 0) });
    }
    const selected = rows.filter(row => { const value = day(row.occurredAt); return value >= startDate && value <= endDate; });
    const distinct = (name, key) => new Set(selected.filter(row => row.eventName === name && row[key]).map(row => row[key])).size;
    const paid = selected.filter(row => row.eventName === "payment_confirmed" && row.paymentId);
    return { days: output, summary: { uniqueVisitors: distinct("landing_viewed", "visitorIdHash"), landingViews: selected.filter(row => row.eventName === "landing_viewed").length,
      assessmentsStarted: distinct("assessment_started", "assessmentId"), assessmentsCompleted: distinct("assessment_completed", "assessmentId"),
      paywallViews: distinct("paywall_viewed", "assessmentId"), invoicesCreated: distinct("invoice_created", "invoiceId"),
      paymentsConfirmed: distinct("payment_confirmed", "paymentId"), revenueMnt: [...new Map(paid.map(row => [row.paymentId, Number(row.amountMnt || 0)])).values()].reduce((sum, value) => sum + value, 0) } };
  }
}
module.exports = { MemoryDatabaseAdapter };
