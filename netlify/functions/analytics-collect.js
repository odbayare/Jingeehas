"use strict";

const { getDatabase } = require("./_lib/store.js");
const { handler, response } = require("./_lib/http.js");
const { BROWSER_EVENTS, UUID, clientContext, flagsFromEvent, isKnownBotRequest, browserOriginAllowed, hashAnonymous,
  browserEventIdempotencyKey, recordEvent } = require("./_lib/analytics.js");
const { authenticateSession } = require("./_lib/session.js");

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
  if (["paywall_viewed", "payment_page_rendered", "report_opened"].includes(body.eventName) && !assessmentId) {
    throw Object.assign(new Error("Assessment required"), { statusCode: 400, code: "assessment_required" });
  }
  const ip = String(event.headers?.["x-nf-client-connection-ip"] || event.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  const rateKeyHash = hashAnonymous("rate", `${ip}:${body.context.visitorId}`);
  const database = getDatabase();
  let paymentValues = {};
  if (body.eventName === "payment_page_rendered") {
    const session = await authenticateSession(database, event);
    const payment = await database.get("payments", String(body.paymentId || ""));
    const hasRenderablePayment = payment && payment.sessionId === session.id && payment.assessmentId === assessmentId &&
      payment.invoiceId && (payment.qrText || payment.qrImage || (Array.isArray(payment.urls) && payment.urls.length));
    if (!hasRenderablePayment) throw Object.assign(new Error("Persisted invoice required"), { statusCode: 409, code: "invoice_required" });
    paymentValues = { invoiceId: payment.invoiceId, paymentId: payment.id, amountMnt: payment.amount };
  }
  const recent = (await database.find("analytics_events", { rateKeyHash })).filter(row => new Date(row.createdAt) > new Date(Date.now() - 60_000));
  if (recent.length >= 30) throw Object.assign(new Error("Too many events"), { statusCode: 429, code: "rate_limited" });
  const now = new Date();
  await recordEvent(database, body.eventName, context, { assessmentId, ...paymentValues }, { eventId: body.eventId, rateKeyHash,
    idempotencyKey: browserEventIdempotencyKey(body.eventName, context, assessmentId, now), now, ...flagsFromEvent(event) });
  return response(202, { accepted: true, recorded: true });
});
