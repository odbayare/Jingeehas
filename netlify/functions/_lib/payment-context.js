"use strict";

const PRODUCTION_HOSTS = new Set(["jingeehas.fit", "www.jingeehas.fit"]);

function requestHost(event = {}) {
  return String(event.headers?.host || event.headers?.Host || "").split(":")[0].toLowerCase();
}

function paymentEnvironment(event = {}, env = process.env) {
  const host = requestHost(event);
  if (env.NODE_ENV === "test") return "test";
  if (host === "localhost" || host === "127.0.0.1") return "local";
  if (host.endsWith(".netlify.app")) return "deploy_preview";
  if (PRODUCTION_HOSTS.has(host)) return "production";
  return "unknown";
}

function paymentClassification(event = {}, flags = {}, env = process.env) {
  const environment = paymentEnvironment(event, env);
  if (flags.isAdmin || flags.isOwnerPreview || flags.isTest) {
    return { paymentContext: "qa", analyticsEligible: false, environment };
  }
  if (environment === "production") {
    return { paymentContext: "customer", analyticsEligible: true, environment };
  }
  return { paymentContext: "unknown", analyticsEligible: false, environment };
}

function isCommercialAnalyticsEligible(payment = {}) {
  return payment.paymentContext === "customer" && payment.analyticsEligible === true && payment.environment === "production";
}

function analyticsFlagsForPayment(payment = {}) {
  return isCommercialAnalyticsEligible(payment)
    ? { isAdmin: false, isOwnerPreview: false, isTest: false }
    : { isAdmin: false, isOwnerPreview: false, isTest: true };
}

module.exports = {
  PRODUCTION_HOSTS,
  requestHost,
  paymentEnvironment,
  paymentClassification,
  isCommercialAnalyticsEligible,
  analyticsFlagsForPayment
};
