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
    const cutover = new Date("2026-07-21T16:17:45.493Z");
    const allEvents = [...this.table("analytics_events").values()];
    const excludedAssessments = new Set(allEvents.filter(row => row.assessmentId && (row.isAdmin || row.isOwnerPreview || row.isTest)).map(row => row.assessmentId));
    for (const row of this.table("assessment_sessions").values()) if (row.source === "owner") excludedAssessments.add(row.assessmentId);
    const rows = allEvents.filter(row => !row.isAdmin && !row.isOwnerPreview && !row.isTest);
    const assessments = [...this.table("assessments").values()].filter(row => !excludedAssessments.has(row.id));
    const payments = [...this.table("payments").values()].filter(row => !excludedAssessments.has(row.assessmentId));
    const entitlements = [...this.table("entitlements").values()].filter(row => row.status === "active" && payments.some(payment => payment.id === row.paymentId && payment.status === "paid"));
    const day = value => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
    const inRange = value => value && day(value) >= startDate && day(value) <= endDate;
    const assessmentById = new Map(assessments.map(row => [row.id, row]));
    const paymentById = new Map(payments.map(row => [row.id, row]));
    const firstLanding = new Map(); const firstSection = new Map(); const firstReport = new Map();
    for (const event of rows.sort((a, b) => String(a.occurredAt).localeCompare(String(b.occurredAt)))) {
      if (event.eventName === "landing_viewed" && event.visitorIdHash && !firstLanding.has(event.visitorIdHash)) firstLanding.set(event.visitorIdHash, event);
      if (event.eventName === "paywall_viewed" && event.assessmentId && assessmentById.has(event.assessmentId) && !firstSection.has(event.assessmentId)) firstSection.set(event.assessmentId, event);
      if (event.eventName === "report_opened" && event.assessmentId && assessmentById.has(event.assessmentId) && !firstReport.has(event.assessmentId)) firstReport.set(event.assessmentId, event);
    }
    const paid = entitlements.map(entitlement => ({ entitlement, payment: paymentById.get(entitlement.paymentId) })).filter(item => item.payment);
    const firstLandingEntries = [...firstLanding.values()].filter(row => inRange(row.occurredAt) && new Date(row.occurredAt) >= cutover);
    const flow = assessment => assessment?.commercialFlowVersion === "prepaid_v2" ? "prepaid_v2" : "legacy_postpaid_v1";
    const totalsForFlow = wanted => {
      const scopedAssessments = assessments.filter(row => flow(row) === wanted); const ids = new Set(scopedAssessments.map(row => row.id));
      const scopedPayments = payments.filter(row => ids.has(row.assessmentId)); const scopedPaymentIds = new Set(scopedPayments.map(row => row.id));
      const scopedPaid = paid.filter(item => scopedPaymentIds.has(item.payment.id) && inRange(item.entitlement.grantedAt));
      return { paymentSectionViews: [...firstSection.values()].filter(row => ids.has(row.assessmentId) && inRange(row.occurredAt)).length,
        invoicesCreated: new Set(scopedPayments.filter(row => row.invoiceId && inRange(row.createdAt)).map(row => row.invoiceId)).size,
        paymentsConfirmed: new Set(scopedPaid.map(item => item.payment.id)).size,
        assessmentsStarted: scopedAssessments.filter(row => inRange(wanted === "prepaid_v2" ? row.startedAt : row.createdAt)).length,
        assessmentsCompleted: scopedAssessments.filter(row => row.status === "complete" && inRange(row.completedAt)).length,
        reportsOpened: [...firstReport.values()].filter(row => ids.has(row.assessmentId) && inRange(row.occurredAt)).length,
        revenueMnt: [...new Map(scopedPaid.map(item => [item.payment.id, Number(item.payment.amount || 0)])).values()].reduce((sum, value) => sum + value, 0) };
    };
    const prepaid = totalsForFlow("prepaid_v2"); const legacy = totalsForFlow("legacy_postpaid_v1");
    const conversion = (entryCount, convertedCount, unavailable = false, reason = "") => ({ entryCount, convertedCount,
      rate: unavailable || !entryCount ? null : convertedCount / entryCount,
      status: unavailable ? "tracking_unavailable" : entryCount ? "available" : "no_denominator",
      reason: unavailable ? reason : entryCount ? null : "no_denominator" });
    const rangeEnd = new Date(`${endDate}T16:00:00.000Z`);
    const sectionEntries = [...firstSection.values()].filter(row => flow(assessmentById.get(row.assessmentId)) === "prepaid_v2" && inRange(row.occurredAt));
    const invoiceEntries = [...new Map(payments.filter(row => flow(assessmentById.get(row.assessmentId)) === "prepaid_v2" && row.invoiceId && inRange(row.createdAt)).map(row => [row.invoiceId, row])).values()];
    const paymentEntries = [...new Map(paid.filter(item => flow(assessmentById.get(item.payment.assessmentId)) === "prepaid_v2" && inRange(item.entitlement.grantedAt))
      .sort((a, b) => String(a.entitlement.grantedAt).localeCompare(String(b.entitlement.grantedAt))).map(item => [item.payment.assessmentId, item])).values()];
    const startEntries = assessments.filter(row => flow(row) === "prepaid_v2" && inRange(row.startedAt));
    const completeEntries = assessments.filter(row => flow(row) === "prepaid_v2" && row.status === "complete" && inRange(row.completedAt));
    const visitorTracking = [...firstLanding.values()].map(row => row.occurredAt).sort()[0] || null;
    const sectionTracking = [...firstSection.values()].map(row => row.occurredAt).sort()[0] || null;
    const linkageTracking = [...firstSection.values()].filter(row => row.visitorIdHash && flow(assessmentById.get(row.assessmentId)) === "prepaid_v2").map(row => row.occurredAt).sort()[0] || null;
    const conversions = {
      visitorToPaymentSection: conversion(firstLandingEntries.length, firstLandingEntries.filter(landing => sectionEntries.some(section => section.visitorIdHash === landing.visitorIdHash && new Date(section.occurredAt) >= new Date(landing.occurredAt) && new Date(section.occurredAt) < rangeEnd)).length,
        !visitorTracking || !linkageTracking, "visitor_assessment_linkage_unavailable"),
      paymentSectionToInvoice: conversion(sectionEntries.length, sectionEntries.filter(section => payments.some(payment => payment.assessmentId === section.assessmentId && payment.invoiceId && new Date(payment.createdAt) >= new Date(section.occurredAt) && new Date(payment.createdAt) < rangeEnd)).length),
      invoiceToPayment: conversion(invoiceEntries.length, invoiceEntries.filter(payment => paid.some(item => item.payment.id === payment.id && new Date(item.entitlement.grantedAt) >= new Date(payment.createdAt) && new Date(item.entitlement.grantedAt) < rangeEnd)).length),
      paymentToStart: conversion(paymentEntries.length, paymentEntries.filter(item => { const assessment = assessmentById.get(item.payment.assessmentId); return assessment?.startedAt && new Date(assessment.startedAt) >= new Date(item.entitlement.grantedAt) && new Date(assessment.startedAt) < rangeEnd; }).length),
      startToComplete: conversion(startEntries.length, startEntries.filter(assessment => assessment.completedAt && new Date(assessment.completedAt) >= new Date(assessment.startedAt) && new Date(assessment.completedAt) < rangeEnd).length),
      completeToReportOpen: conversion(completeEntries.length, completeEntries.filter(assessment => { const report = firstReport.get(assessment.id); return report && new Date(report.occurredAt) >= new Date(assessment.completedAt) && new Date(report.occurredAt) < rangeEnd; }).length)
    };
    const output = [];
    for (let cursor = new Date(`${startDate}T00:00:00+08:00`); cursor <= new Date(`${endDate}T00:00:00+08:00`); cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      const date = day(cursor); const dayPaid = paymentEntries.filter(item => day(item.entitlement.grantedAt) === date);
      output.push({ date, uniqueVisitors: firstLandingEntries.filter(row => day(row.occurredAt) === date).length,
        paymentSectionViews: sectionEntries.filter(row => day(row.occurredAt) === date).length,
        invoicesCreated: invoiceEntries.filter(row => day(row.createdAt) === date).length,
        paymentsConfirmed: dayPaid.length, assessmentsStarted: startEntries.filter(row => day(row.startedAt) === date).length,
        assessmentsCompleted: completeEntries.filter(row => day(row.completedAt) === date).length,
        reportsOpened: [...firstReport.values()].filter(row => flow(assessmentById.get(row.assessmentId)) === "prepaid_v2" && day(row.occurredAt) === date).length,
        revenueMnt: [...new Map(dayPaid.map(item => [item.payment.id, Number(item.payment.amount || 0)])).values()].reduce((sum, value) => sum + value, 0) });
    }
    const selected = rows.filter(row => { const value = day(row.occurredAt); return value >= startDate && value <= endDate; });
    const allFlows = { uniqueVisitors: new Set(selected.filter(row => row.eventName === "landing_viewed" && row.visitorIdHash).map(row => row.visitorIdHash)).size,
      paymentSectionViews: prepaid.paymentSectionViews + legacy.paymentSectionViews, invoicesCreated: prepaid.invoicesCreated + legacy.invoicesCreated,
      paymentsConfirmed: prepaid.paymentsConfirmed + legacy.paymentsConfirmed, assessmentsStarted: prepaid.assessmentsStarted + legacy.assessmentsStarted,
      assessmentsCompleted: prepaid.assessmentsCompleted + legacy.assessmentsCompleted, reportsOpened: prepaid.reportsOpened + legacy.reportsOpened,
      revenueMnt: prepaid.revenueMnt + legacy.revenueMnt };
    const activity = wanted => assessments.some(row => flow(row) === wanted && (inRange(wanted === "prepaid_v2" ? row.startedAt : row.createdAt) || inRange(row.completedAt)))
      || [...firstSection.values()].some(row => flow(assessmentById.get(row.assessmentId)) === wanted && inRange(row.occurredAt))
      || payments.some(row => flow(assessmentById.get(row.assessmentId)) === wanted && inRange(row.createdAt))
      || paid.some(item => flow(assessmentById.get(item.payment.assessmentId)) === wanted && inRange(item.entitlement.grantedAt))
      || [...firstReport.values()].some(row => flow(assessmentById.get(row.assessmentId)) === wanted && inRange(row.occurredAt));
    const legacyPresent = activity("legacy_postpaid_v1"); const prepaidAssessmentPresent = activity("prepaid_v2");
    const prepaidVisitorPresent = firstLandingEntries.length > 0;
    const flowState = legacyPresent && prepaidAssessmentPresent ? "mixed"
      : legacyPresent && prepaidVisitorPresent ? "legacy_with_prepaid_visitors"
        : legacyPresent ? "legacy_only" : prepaidAssessmentPresent ? "prepaid_only" : prepaidVisitorPresent ? "prepaid_visitors_only" : "empty";
    return { days: output, summary: allFlows, allFlows,
      currentFlow: { eligibleVisitors: firstLandingEntries.length, ...prepaid }, legacyFlow: legacy, conversions,
      coverage: { paidFirstCutoverAt: cutover.toISOString(), rangeStartsBeforeCutover: new Date(`${startDate}T00:00:00+08:00`) < cutover,
        rangeEndsAfterCutover: rangeEnd > cutover, allMeasuredVisitors: allFlows.uniqueVisitors, paidFirstEligibleVisitors: firstLandingEntries.length,
        legacyActivityPresent: legacyPresent, prepaidActivityPresent: prepaidAssessmentPresent,
        prepaidAssessmentActivityPresent: prepaidAssessmentPresent, prepaidVisitorActivityPresent: prepaidVisitorPresent, flowState,
        visitorTrackingStartedAt: visitorTracking, paymentSectionTrackingStartedAt: sectionTracking } };
  }
  async recordQuestionProgress(input) {
    const assessment = await this.get("assessments", input.assessmentId);
    if (!assessment || assessment.questionnaireVersion !== input.questionnaireVersion) {
      throw Object.assign(new Error("Question progress version mismatch"), { code: "invalid_questionnaire_version" });
    }
    const id = `${input.assessmentId}:${input.questionnaireVersion}:${input.questionId}`;
    const existing = await this.get("assessment_question_progress", id);
    const viewedAt = input.viewedAt;
    return this.upsert("assessment_question_progress", id, { assessmentId: input.assessmentId, questionnaireVersion: input.questionnaireVersion,
      questionId: input.questionId, sectionKey: input.sectionKey || null, questionOrder: input.questionOrder || null, branchDepth: input.branchDepth || 0,
      firstViewedAt: existing?.firstViewedAt || viewedAt, lastViewedAt: viewedAt,
      answeredAt: existing?.answeredAt || (input.answered ? viewedAt : null),
      source: input.source === "live" ? "live" : (existing?.source || input.source || "live"),
      createdAt: existing?.createdAt || viewedAt, updatedAt: viewedAt });
  }
  async getQuestionProgressAnalytics(startDate, endDate, now = new Date()) {
    const day = value => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
    const events = [...this.table("analytics_events").values()];
    const excluded = new Set(events.filter(row => row.assessmentId && (row.isAdmin || row.isOwnerPreview || row.isTest)).map(row => row.assessmentId));
    for (const row of this.table("assessment_sessions").values()) if (row.source === "owner") excluded.add(row.assessmentId);
    const cohort = [...this.table("assessments").values()].filter(row => { if (excluded.has(row.id)) return false;
      const started = row.commercialFlowVersion === "prepaid_v2" ? row.startedAt : (row.startedAt || row.createdAt);
      return started && day(started) >= startDate && day(started) <= endDate; });
    const cohortIds = new Set(cohort.map(row => row.id));
    const progress = [...this.table("assessment_question_progress").values()].filter(row => cohortIds.has(row.assessmentId));
    const byAssessment = new Map();
    for (const row of progress) { const rows = byAssessment.get(row.assessmentId) || []; rows.push(row); byAssessment.set(row.assessmentId, rows); }
    const cutoff = new Date(new Date(now).getTime() - 86400000);
    const states = new Map(cohort.map(assessment => { const rows = (byAssessment.get(assessment.id) || []).filter(row => row.source === "live");
      const last = [...rows].sort((a, b) => String(b.lastViewedAt).localeCompare(String(a.lastViewedAt)) || Number(b.questionOrder || 0) - Number(a.questionOrder || 0))[0] || null;
      const activity = new Date(rows.flatMap(row => [row.lastViewedAt, row.answeredAt]).filter(Boolean).sort().at(-1) || 0);
      return [assessment.id, { last, stopped: assessment.status !== "complete" && last && activity < cutoff, active: assessment.status !== "complete" && last && activity >= cutoff }]; }));
    const keys = new Map();
    for (const row of progress) { const key = `${row.questionnaireVersion}:${row.questionId}`; const item = keys.get(key) || { questionId: row.questionId, questionnaireVersion: row.questionnaireVersion,
      sectionKey: row.sectionKey, questionOrder: row.questionOrder, totalReached: new Set(), totalAnswered: new Set(), liveReached: new Set(),
      backfillReached: new Set(), stopped: new Set(), active: new Set() };
      item.totalReached.add(row.assessmentId); if (row.answeredAt) item.totalAnswered.add(row.assessmentId);
      if (row.source === "live") item.liveReached.add(row.assessmentId); else item.backfillReached.add(row.assessmentId);
      const state = states.get(row.assessmentId); if (state?.last?.id === row.id && state.stopped) item.stopped.add(row.assessmentId); if (state?.last?.id === row.id && state.active) item.active.add(row.assessmentId); keys.set(key, item); }
    const questions = [...keys.values()].map(item => ({ questionId: item.questionId, questionnaireVersion: item.questionnaireVersion, sectionKey: item.sectionKey,
      questionOrder: item.questionOrder, totalReachedCount: item.totalReached.size, totalAnsweredCount: item.totalAnswered.size,
      liveReachedCount: item.liveReached.size, backfillReachedCount: item.backfillReached.size,
      activeAtQuestionCount: item.active.size, confirmedStoppedCount: item.stopped.size,
      dropoffEligibleCount: Math.max(0, item.liveReached.size - item.active.size),
      confirmedDropoffRate: item.liveReached.size - item.active.size > 0 ? item.stopped.size / (item.liveReached.size - item.active.size) : null,
      reachedCount: item.totalReached.size, answeredCount: item.totalAnswered.size, stoppedCount: item.stopped.size, activeCount: item.active.size }));
    const covered = byAssessment.size; const completed = cohort.filter(row => row.status === "complete").length;
    return { summary: { cohortStarted: cohort.length, coveredAssessments: covered, coverageRate: cohort.length ? covered / cohort.length : 0,
      averageQuestionsReached: covered ? progress.length / covered : 0, completedCount: completed, completionRate: cohort.length ? completed / cohort.length : 0,
      liveProgressAssessments: [...byAssessment.keys()].filter(id => (byAssessment.get(id) || []).some(row => row.source === "live")).length,
      backfillOnlyAssessments: [...byAssessment.keys()].filter(id => (byAssessment.get(id) || []).every(row => row.source !== "live")).length,
      activeInProgressCount: [...states.values()].filter(item => item.active).length,
      instrumentationStartedAt: progress.map(row => row.createdAt).sort()[0] || null }, questions };
  }
}
module.exports = { MemoryDatabaseAdapter };
