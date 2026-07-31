"use strict";

const LEGACY_FLOW = "legacy_postpaid_v1";
const PREPAID_FLOW = "prepaid_v2";
const FREE_POSTPAID_FLOW = "free_assessment_postpaid_v1";
const PREPAID_STATES = new Set(["payment_pending", "paid_ready", "in_progress", "complete"]);
const PENDING_PAYMENT_STATES = new Set(["creating", "create_unknown", "reconciling", "pending", "checking", "check_error", "paid_but_not_unlocked"]);

function flowVersion(assessment) { return assessment?.commercialFlowVersion || LEGACY_FLOW; }
function isFreeAssessmentPostpaid(assessment) { return flowVersion(assessment) === FREE_POSTPAID_FLOW; }
function isPrepaidFlow(assessment) { return flowVersion(assessment) === PREPAID_FLOW; }
function isLegacyPostpaidFlow(assessment) { return flowVersion(assessment) === LEGACY_FLOW; }
const isPrepaid = isPrepaidFlow;

async function hasPaidAccess(database, assessment) {
  if (!assessment) return false;
  const entitlements = await database.find("entitlements", { assessmentId: assessment.id, status: "active" });
  if (entitlements.length) return true;
  const preview = await database.find("assessment_sessions", { assessmentId: assessment.id, source: "owner" });
  return preview.length > 0;
}

async function requirePaidAccess(database, assessment) {
  if (!isPrepaidFlow(assessment) || await hasPaidAccess(database, assessment)) return true;
  throw Object.assign(new Error("Payment confirmation required"), { statusCode: 402, code: "payment_required", nextRoute: "/assessment/payment" });
}

async function hasPendingPayment(database, assessment) {
  if (!assessment) return false;
  const payments = await database.find("payments", { assessmentId: assessment.id });
  return payments.some(payment => PENDING_PAYMENT_STATES.has(payment.status));
}

async function nextRoute(database, assessment) {
  if (!assessment) return "/assessment/start";
  if (assessment.safetyRoute) return "/report";
  if (isPrepaidFlow(assessment)) {
    if (assessment.status === "payment_pending" || !(await hasPaidAccess(database, assessment))) return "/assessment/payment";
    if (["paid_ready", "in_progress"].includes(assessment.status)) return "/assessment/questions";
    if (assessment.status === "complete") return "/report";
  }
  if (isFreeAssessmentPostpaid(assessment) && assessment.status === "complete") {
    if (await hasPaidAccess(database, assessment)) return "/report";
    if (await hasPendingPayment(database, assessment)) return "/assessment/payment";
    return "/assessment/result";
  }
  if (assessment.status === "complete") return await hasPaidAccess(database, assessment) ? "/report" : "/assessment/payment";
  return "/assessment/questions";
}

module.exports = {
  LEGACY_FLOW,
  PREPAID_FLOW,
  FREE_POSTPAID_FLOW,
  PREPAID_STATES,
  PENDING_PAYMENT_STATES,
  flowVersion,
  isFreeAssessmentPostpaid,
  isPrepaidFlow,
  isLegacyPostpaidFlow,
  isPrepaid,
  hasPaidAccess,
  hasPendingPayment,
  requirePaidAccess,
  nextRoute
};
