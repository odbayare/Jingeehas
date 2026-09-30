"use strict";

const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { BROWSER_EVENTS, QPAY_HANDOFF_EVENTS, UUID, clientContext, flagsFromEvent, isKnownBotRequest, browserOriginAllowed, hashAnonymous,
  browserEventIdempotencyKey, funnelKeyHash, recordEvent } = require("./_lib/analytics.js");
const { authenticateSession } = require("./_lib/session.js");
const { ownedAssessment } = require("./_lib/assessment.js");
const { isFreeAssessmentPostpaid } = require("./_lib/commercial-flow.js");
const { PRODUCT } = require("./_lib/config.js");

exports.handler = handler("POST", async (event, body) => {
  if (!browserOriginAllowed(event)) throw Object.assign(new Error("Invalid origin"), { statusCode: 403, code: "invalid_origin" });
  if (!BROWSER_EVENTS.has(body.eventName) || !UUID.test(String(body.eventId || ""))) {
    throw Object.assign(new Error("Invalid analytics event"), { statusCode: 400, code: "invalid_event" });
  }
  if (isKnownBotRequest(event)) return response(202, { accepted: true, recorded: false });
  const encodedSize = Buffer.byteLength(JSON.stringify(body));
  if (encodedSize > 4096) throw Object.assign(new Error("Analytics payload too large"), { statusCode: 413, code: "payload_too_large" });
  let context = clientContext(body.context || {});
  if (!context.visitorIdHash || !context.sessionIdHash) throw Object.assign(new Error("Anonymous context required"), { statusCode: 400, code: "invalid_context" });
  const assessmentId = String(body.assessmentId || "") || null;
  const handoffEvent = QPAY_HANDOFF_EVENTS.has(body.eventName);
  if ((handoffEvent || ["post_assessment_paywall_viewed", "paywall_viewed", "report_opened"].includes(body.eventName)) && !assessmentId) {
    throw Object.assign(new Error("Assessment required"), { statusCode: 400, code: "assessment_required" });
  }
  const attemptId = handoffEvent ? String(body.attemptId || "").toLowerCase() : null;
  if (handoffEvent && !UUID.test(attemptId)) {
    throw Object.assign(new Error("Handoff attempt required"), { statusCode: 400, code: "invalid_attempt" });
  }
  const ip = String(event.headers?.["x-nf-client-connection-ip"] || event.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  const rateKeyHash = hashAnonymous("rate", `${ip}:${body.context.visitorId}`);
  const database = getDatabase();
  const now = new Date();
  let values = { assessmentId };
  let idempotencyKey = browserEventIdempotencyKey(body.eventName, context, assessmentId, now);
  let metadata = {};
  let flags = flagsFromEvent(event);
  if (body.eventName === "post_assessment_paywall_viewed") {
    const session = await authenticateSession(database, event);
    const assessment = await ownedAssessment(database, session.id, assessmentId);
    if (!isFreeAssessmentPostpaid(assessment) || assessment.status !== "complete" || assessment.safetyRoute) {
      throw Object.assign(new Error("Paywall unavailable"), { statusCode: 404, code: "paywall_unavailable" });
    }
    const key = funnelKeyHash(assessmentId);
    values = { funnelKeyHash: key, amountMnt: PRODUCT.amount };
    idempotencyKey = `post_assessment_paywall_viewed:${key}`;
    metadata = { flowVersion: assessment.commercialFlowVersion, offerPriceMnt: PRODUCT.amount, priceVersion: PRODUCT.priceVersion };
  }
  if (handoffEvent) {
    const session = await authenticateSession(database, event);
    const assessment = await ownedAssessment(database, session.id, assessmentId);
    if (!isFreeAssessmentPostpaid(assessment) || assessment.status !== "complete" || assessment.safetyRoute) {
      throw Object.assign(new Error("Checkout unavailable"), { statusCode: 404, code: "checkout_unavailable" });
    }
    const key = funnelKeyHash(assessmentId);
    // These browser observations never carry payment identifiers, bank details, links,
    // arbitrary metadata, or attribution strings. The assessment ID is authorization input only.
    values = { funnelKeyHash: key };
    context = { visitorIdHash: context.visitorIdHash, sessionIdHash: context.sessionIdHash, deviceClass: context.deviceClass };
    metadata = { attemptId };
    idempotencyKey = `${body.eventName}:${key}:${attemptId}`;
    if (body.eventName === "qpay_page_returned") {
      const attempts = await database.find("analytics_events", { funnelKeyHash: key, eventName: "qpay_handoff_attempted" });
      const attempt = attempts.find(row => row.metadata?.attemptId === attemptId);
      if (!attempt) {
        // The client can replay the same attempt UUID/event ID, then retry this return.
        // Do not invent a click when requests are missing or arrive out of order.
        throw Object.assign(new Error("Handoff attempt not recorded"), { statusCode: 409, code: "handoff_attempt_required" });
      }
      flags = { isAdmin: flags.isAdmin || Boolean(attempt.isAdmin), isOwnerPreview: flags.isOwnerPreview || Boolean(attempt.isOwnerPreview),
        isTest: flags.isTest || Boolean(attempt.isTest) };
    }
  }
  const recent = (await database.find("analytics_events", { rateKeyHash })).filter(row => new Date(row.createdAt) > new Date(Date.now() - 60_000));
  if (recent.length >= 30) throw Object.assign(new Error("Too many events"), { statusCode: 429, code: "rate_limited" });
  await recordEvent(database, body.eventName, context, values, { eventId: body.eventId, rateKeyHash,
    idempotencyKey, metadata, now, ...flags });
  return response(202, { accepted: true, recorded: true });
});
