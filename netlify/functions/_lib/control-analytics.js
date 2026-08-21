"use strict";

const CLEAN_CONTROL_UTM_CONTENT = "price_aligned_39000_control_v1";
const LEGACY_9900_CONTENT_ID = "52508731514802";
const CHECKPOINT_COMPLETIONS = 20;

function number(value) { return Number(value || 0); }
function rate(numerator, denominator) {
  const entryCount = number(denominator); const convertedCount = number(numerator);
  return { numerator: convertedCount, denominator: entryCount, rate: entryCount ? convertedCount / entryCount : null };
}

function buildCleanControlAnalytics(base = {}, assessments = [], hashAssessment) {
  if (typeof hashAssessment !== "function") throw new TypeError("hashAssessment is required");
  const completedFunnels = Array.isArray(base.completedFunnels) ? base.completedFunnels : [];
  const assessmentByHash = new Map();
  for (const assessment of assessments || []) {
    if (!assessment?.id) continue;
    assessmentByHash.set(hashAssessment(assessment.id), assessment);
  }

  let safetyBypass = 0; let commercialEligible = 0; let unclassified = 0;
  let eligiblePaywallConfirmed = 0; let explainedDeliveryExceptions = 0;
  for (const funnel of completedFunnels) {
    const assessment = assessmentByHash.get(funnel.funnelKeyHash);
    if (!assessment) { unclassified += 1; continue; }
    const safety = assessment.reportMode === "safety" || Boolean(assessment.safetyRoute);
    if (safety) { safetyBypass += 1; continue; }
    commercialEligible += 1;
    if (funnel.paywallConfirmed) eligiblePaywallConfirmed += 1;
    else explainedDeliveryExceptions += 1;
  }

  const visitors = number(base.visitors); const starts = number(base.assessmentsStarted);
  const completions = number(base.assessmentsCompleted); const paywall = number(base.paywallConfirmed);
  const cta = number(base.paywallCta); const invoices = number(base.invoicesCreated);
  const paid = number(base.providerConfirmedPaid); const eligibilityRate = rate(commercialEligible, completions);
  const reachedCheckpoint = completions >= CHECKPOINT_COMPLETIONS;
  const experimentStatus = !reachedCheckpoint ? "COLLECTING"
    : number(eligibilityRate.rate) >= 0.4 ? "READY FOR CHECKPOINT" : "EARLY WARNING";
  const checkpointInterpretation = !reachedCheckpoint ? "20 clean completion хүртэл шийдвэр гаргахгүй."
    : eligibilityRate.rate >= 0.4 ? "20 clean paywall view хүртэл үргэлжлүүлэн цуглуулна."
      : eligibilityRate.rate >= 0.3 ? "Үргэлжлүүлнэ, traffic composition-ийг шалгана."
        : "Acquisition-fit concern: traffic composition-ийг шалгана; campaign-д автомат өөрчлөлт хийхгүй.";

  return {
    cohort: { utmContent: CLEAN_CONTROL_UTM_CONTENT, lockedAttribution: true },
    visitors, assessmentsStarted: starts, assessmentsCompleted: completions,
    safetyBypass, commercialEligible, paywallConfirmed: paywall, eligiblePaywallConfirmed,
    paywallCta: cta, invoicesCreated: invoices, providerConfirmedPaid: paid,
    merchantSettledPaid: base.merchantSettledPaid == null ? null : number(base.merchantSettledPaid),
    revenueMnt: number(base.revenueMnt), unclassifiedCompletions: unclassified,
    explainedDeliveryExceptions,
    invariants: {
      completionClassified: completions === safetyBypass + commercialEligible && unclassified === 0,
      eligibleDeliveryReconciled: commercialEligible === eligiblePaywallConfirmed + explainedDeliveryExceptions
    },
    rates: {
      lpvToStart: rate(number(base.linkedVisitorStarts), visitors),
      startToCompletion: rate(completions, starts),
      completionToSafetyBypass: rate(safetyBypass, completions),
      completionToCommercialEligible: eligibilityRate,
      eligibleToPaywall: rate(eligiblePaywallConfirmed, commercialEligible),
      paywallToCta: rate(cta, paywall),
      ctaToInvoice: rate(invoices, cta),
      invoiceToProviderConfirmedPaid: rate(paid, invoices),
      lpvToProviderConfirmedPaid: rate(paid, visitors)
    },
    experiment: { status: experimentStatus, checkpointCompletions: CHECKPOINT_COMPLETIONS,
      completions, remainingCompletions: Math.max(0, CHECKPOINT_COMPLETIONS - completions),
      commercialEligibilityRate: eligibilityRate.rate, interpretation: checkpointInterpretation }
  };
}

module.exports = { CLEAN_CONTROL_UTM_CONTENT, LEGACY_9900_CONTENT_ID, CHECKPOINT_COMPLETIONS, buildCleanControlAnalytics };
