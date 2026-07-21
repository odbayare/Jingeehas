"use strict";

const LEGACY_FLOW = "legacy_postpaid_v1";
const PREPAID_FLOW = "prepaid_v2";
const PREPAID_STATES = new Set(["payment_pending", "paid_ready", "in_progress", "complete"]);

function flowVersion(assessment) { return assessment?.commercialFlowVersion || LEGACY_FLOW; }
function isPrepaid(assessment) { return flowVersion(assessment) === PREPAID_FLOW; }

async function hasPaidAccess(database, assessment) {
  if (!assessment) return false;
  const entitlements = await database.find("entitlements", { assessmentId: assessment.id, status: "active" });
  if (entitlements.length) return true;
  const preview = await database.find("assessment_sessions", { assessmentId: assessment.id, source: "owner" });
  return preview.length > 0;
}

async function requirePaidAccess(database, assessment) {
  if (!isPrepaid(assessment) || await hasPaidAccess(database, assessment)) return true;
  throw Object.assign(new Error("Payment confirmation required"), { statusCode: 402, code: "payment_required", nextRoute: "/assessment/payment" });
}

async function nextRoute(database, assessment) {
  if (!assessment) return "/assessment/start";
  if (assessment.safetyRoute) return "/report";
  if (isPrepaid(assessment)) {
    if (assessment.status === "payment_pending" || !(await hasPaidAccess(database, assessment))) return "/assessment/payment";
    if (["paid_ready", "in_progress"].includes(assessment.status)) return "/assessment/questions";
    if (assessment.status === "complete") return "/report";
  }
  if (assessment.status === "complete") return await hasPaidAccess(database, assessment) ? "/report" : "/assessment/payment";
  return "/assessment/questions";
}

module.exports = { LEGACY_FLOW, PREPAID_FLOW, PREPAID_STATES, flowVersion, isPrepaid, hasPaidAccess, requirePaidAccess, nextRoute };
