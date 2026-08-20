"use strict";

const { handler, response } = require("./_lib/http.js");
const { metaBrowserConfig } = require("./_lib/meta-capi.js");
const { flagsFromEvent } = require("./_lib/analytics.js");
const { paymentClassification } = require("./_lib/payment-context.js");

exports.handler = handler("GET", async (event) => {
  const config = metaBrowserConfig();
  if (!paymentClassification(event, flagsFromEvent(event)).analyticsEligible) config.enabled = false;
  return response(200, config);
});
