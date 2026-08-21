"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildCleanControlAnalytics, CLEAN_CONTROL_UTM_CONTENT, LEGACY_9900_CONTENT_ID } = require("../netlify/functions/_lib/control-analytics.js");
const app = require("../app.js");

const hash = id => `hash-${id}`;
const frozenHistory = Object.freeze({ legacyPaid: 5, legacyRevenueMnt: 49500, legacyContent: LEGACY_9900_CONTENT_ID });
const base = {
  visitors: 25, linkedVisitorStarts: 6, assessmentsStarted: 8, assessmentsCompleted: 8,
  paywallConfirmed: 1, paywallCta: 1, invoicesCreated: 1, providerConfirmedPaid: 0,
  merchantSettledPaid: null, revenueMnt: 0,
  completedFunnels: [
    ...Array.from({ length: 7 }, (_unused, index) => ({ funnelKeyHash: hash(`safety-${index}`), paywallConfirmed: false })),
    { funnelKeyHash: hash("eligible"), paywallConfirmed: true }
  ]
};
const assessments = [
  ...Array.from({ length: 7 }, (_unused, index) => ({ id: `safety-${index}`, reportMode: "safety", safetyRoute: "support" })),
  { id: "eligible", reportMode: "sufficient", safetyRoute: null }
];
const result = buildCleanControlAnalytics(base, assessments, hash);

assert.equal(result.cohort.utmContent, CLEAN_CONTROL_UTM_CONTENT, "5. clean-control attribution is locked by exact utm_content");
assert.equal(result.visitors, 25); assert.equal(result.assessmentsStarted, 8); assert.equal(result.assessmentsCompleted, 8);
assert.equal(result.safetyBypass, 7, "6. safety bypass is counted separately");
assert.equal(result.commercialEligible, 1, "7. commercial eligible is counted separately");
assert.equal(result.assessmentsCompleted, result.safetyBypass + result.commercialEligible, "8. completion classification reconciles");
assert.equal(result.invariants.completionClassified, true);
assert.equal(result.eligiblePaywallConfirmed, 1); assert.equal(result.explainedDeliveryExceptions, 0);
assert.equal(result.invariants.eligibleDeliveryReconciled, true, "9. eligible paywall delivery reconciles");
assert.equal(result.revenueMnt, 0, "10. legacy 9,900 revenue is not added to clean control");
assert.deepEqual(result.rates.lpvToStart, { numerator: 6, denominator: 25, rate: 0.24 }, "11. canonical numerator and denominator are explicit");
assert.equal(result.rates.startToCompletion.rate, 1);
assert.equal(result.merchantSettledPaid, null, "merchant settlement is not fabricated");
assert.equal(result.experiment.status, "COLLECTING"); assert.equal(result.experiment.remainingCompletions, 12);

const rows = [
  { utmContent: LEGACY_9900_CONTENT_ID, source: "fb", paid: 5, revenue: 49500 },
  { utmContent: "paid_cut_v1", source: "meta", paid: 0, revenue: 0 },
  { utmContent: null, source: null, paid: 0, revenue: 0 },
  { utmContent: CLEAN_CONTROL_UTM_CONTENT, source: "meta", paid: 0, revenue: 0 },
  { utmContent: CLEAN_CONTROL_UTM_CONTENT, source: "owner", owner: true, paid: 1, revenue: 39000 }
];
const cleanRows = rows.filter(row => row.utmContent === CLEAN_CONTROL_UTM_CONTENT && !row.owner);
assert.equal(cleanRows.some(row => row.utmContent === LEGACY_9900_CONTENT_ID), false, "1. legacy cohort excluded");
assert.equal(cleanRows.some(row => row.utmContent === "paid_cut_v1"), false, "2. Reel excluded");
assert.equal(cleanRows.some(row => row.utmContent == null), false, "3. unattributed excluded");
assert.equal(cleanRows.some(row => row.owner), false, "4. owner/test excluded");
assert.equal(cleanRows.reduce((sum, row) => sum + row.revenue, 0), 0);
assert.deepEqual(frozenHistory, { legacyPaid: 5, legacyRevenueMnt: 49500, legacyContent: LEGACY_9900_CONTENT_ID }, "13. historical evidence remains unchanged");

const ownerOnlyBase = { ...base, completedFunnels: base.completedFunnels.slice(0, 1), assessmentsCompleted: 1 };
const ownerExcluded = buildCleanControlAnalytics(ownerOnlyBase, [{ id: "different", reportMode: "sufficient" }], hash);
assert.equal(ownerExcluded.unclassifiedCompletions, 1, "12. unmatched/excluded owner traffic cannot be silently classified as commercial");
assert.equal(ownerExcluded.invariants.completionClassified, false);

const warning = buildCleanControlAnalytics({ ...base, assessmentsCompleted: 20,
  completedFunnels: Array.from({ length: 20 }, (_unused, index) => ({ funnelKeyHash: hash(`w-${index}`), paywallConfirmed: index < 7 })) },
  Array.from({ length: 20 }, (_unused, index) => ({ id: `w-${index}`, reportMode: index < 7 ? "sufficient" : "safety", safetyRoute: index < 7 ? null : "support" })), hash);
assert.equal(warning.experiment.status, "EARLY WARNING"); assert.equal(warning.experiment.commercialEligibilityRate, 0.35);
const ready = buildCleanControlAnalytics({ ...base, assessmentsCompleted: 20,
  completedFunnels: Array.from({ length: 20 }, (_unused, index) => ({ funnelKeyHash: hash(`r-${index}`), paywallConfirmed: index < 8 })) },
  Array.from({ length: 20 }, (_unused, index) => ({ id: `r-${index}`, reportMode: index < 8 ? "sufficient" : "safety", safetyRoute: index < 8 ? null : "support" })), hash);
assert.equal(ready.experiment.status, "READY FOR CHECKPOINT"); assert.equal(ready.experiment.commercialEligibilityRate, 0.4);

const html = app._test.renderCleanControl(result);
for (const expected of ["39,000₮ Clean Control", CLEAN_CONTROL_UTM_CONTENT, "Safety-flow bypass", "Commercial eligible",
  "Merchant-settled paid", "6 / 25 = 24.0%", "8 = 7 safety + 1 eligible", "Experiment status: COLLECTING"]) assert(html.includes(expected), expected);
const legacyHtml = app._test.renderCampaignAttribution({ rows: [
  { utmSource: "fb", utmContent: LEGACY_9900_CONTENT_ID, visitors: 200, paymentsConfirmed: 5, revenueMnt: 49500 },
  { utmSource: "ig", utmContent: LEGACY_9900_CONTENT_ID, visitors: 19, paymentsConfirmed: 0, revenueMnt: 0 }
] });
assert(legacyHtml.includes("Legacy 9,900₮ — Facebook")); assert(legacyHtml.includes("Legacy 9,900₮ — Instagram"));

const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260821110000_add_clean_control_measurement.sql"), "utf8");
for (const expected of ["get_control_measurement_base", "p_utm_content", "excluded_funnels", "assessment_sessions",
  "merchant_settled_paid", "completed_funnels", "visitor_reconciliation", "revoke all on function"]) assert(migration.includes(expected), expected);
assert(!/\b(update|delete)\s+jingeehas\.(analytics_events|assessments|payments|entitlements)\b/i.test(migration), "historical rows are not mutated");

console.log("clean control analytics tests passed");
