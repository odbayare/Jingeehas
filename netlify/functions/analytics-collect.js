"use strict";

const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { BROWSER_EVENTS, UUID, clientContext, flagsFromEvent, isKnownBotRequest, browserOriginAllowed, hashAnonymous,
  browserEventIdempotencyKey, recordEvent } = require("./_lib/analytics.js");

exports.handler = handler("POST", async (event, body) => {
  if (!browserOriginAllowed(event)) throw Object.assign(new Error("Invalid origin"), { statusCode: 403, code: "invalid_origin" });
  if (!BROWSER_EVENTS.has(body.eventName) || !UUID.test(String(body.eventId || ""))) {
    throw Object.assign(new Error("Invalid analytics event"), { statusCode: 400, code: "invalid_event" });
  }
  if (isKnownBotRequest(event)) return response(202, { accepted: true, recorded: false });
  const encodedSize = Buffer.byteLength(JSON.stringify(body));
  if (encodedSize > 4096) throw Object.assign(new Error("Analytics payload too large"), { statusCode: 413, code: "payload_too_large" });
  const context = clientContext(body.context || {});
  if (!context.visitorIdHash || !context.sessionIdHash) throw Object.assign(new Error("Anonymous context required"), { statusCode: 400, code: "invalid_context" });
  const assessmentId = String(body.assessmentId || "") || null;
  if (["paywall_viewed", "report_opened"].includes(body.eventName) && !assessmentId) {
    throw Object.assign(new Error("Assessment required"), { statusCode: 400, code: "assessment_required" });
  }
  const ip = String(event.headers?.["x-nf-client-connection-ip"] || event.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  const rateKeyHash = hashAnonymous("rate", `${ip}:${body.context.visitorId}`);
  const database = getDatabase();
  const recent = (await database.find("analytics_events", { rateKeyHash })).filter(row => new Date(row.createdAt) > new Date(Date.now() - 60_000));
  if (recent.length >= 30) throw Object.assign(new Error("Too many events"), { statusCode: 429, code: "rate_limited" });
  const now = new Date();
  await recordEvent(database, body.eventName, context, { assessmentId }, { eventId: body.eventId, rateKeyHash,
    idempotencyKey: browserEventIdempotencyKey(body.eventName, context, assessmentId, now), now, ...flagsFromEvent(event) });
  return response(202, { accepted: true, recorded: true });
});
