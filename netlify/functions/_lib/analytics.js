"use strict";

const crypto = require("node:crypto");
const { cookies } = require("./http.js");
const { PREVIEW_COOKIE_NAME } = require("./preview.js");

const BROWSER_EVENTS = new Set(["landing_viewed", "landing_cta_clicked", "start_cta_clicked", "payment_preparation_viewed", "paywall_viewed", "recovery_requested"]);
const SERVER_EVENTS = new Set(["assessment_started", "assessment_completed", "invoice_created", "payment_confirmed", "invoice_create_failed", "payment_check_started", "payment_check_failed", "recovery_succeeded", "report_opened"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_ID = /^[A-Za-z0-9_-]{3,100}$/;
const BOT_USER_AGENT = /(?:facebookexternalhit|facebot|googlebot|bingbot|duckduckbot|yandexbot|baiduspider|slurp|crawler|spider|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|uptimerobot|pingdom|headlesschrome|playwright|puppeteer|lighthouse|\bbot\b|curl\/|wget\/)/i;

function analyticsPepper(env = process.env) {
  const value = String(env.ANALYTICS_HASH_PEPPER || "");
  if (env.NODE_ENV === "test" && !value) return "test-only-analytics-pepper-32-bytes-minimum";
  if (value.length < 32) throw Object.assign(new Error("Analytics unavailable"), { code: "analytics_unavailable", statusCode: 503 });
  return value;
}
function hashAnonymous(kind, value, env = process.env) {
  if (!value) return null;
  return crypto.createHmac("sha256", analyticsPepper(env)).update(`${kind}:${value}`).digest("hex");
}
function cleanText(value, max = 100) {
  const text = String(value || "").trim();
  return text && !/[\u0000-\u001f]/.test(text) ? text.slice(0, max) : null;
}
function cleanHost(value) {
  const text = String(value || "").trim();
  try { return new URL(text).hostname.toLowerCase().slice(0, 253) || null; }
  catch { return /^(?:[a-z0-9](?:[a-z0-9-]{0,62})\.)*[a-z0-9](?:[a-z0-9-]{0,62})$/i.test(text) ? text.toLowerCase().slice(0, 253) : null; }
}
function attribution(input = {}) {
  return { utmSource: cleanText(input.utmSource), utmMedium: cleanText(input.utmMedium), utmCampaign: cleanText(input.utmCampaign),
    utmContent: cleanText(input.utmContent), utmTerm: cleanText(input.utmTerm), referrerHost: cleanHost(input.referrer || input.referrerHost) };
}
function clientContext(input = {}, env = process.env) {
  const visitorId = UUID.test(String(input.visitorId || "")) ? input.visitorId : null;
  const sessionId = UUID.test(String(input.sessionId || "")) ? input.sessionId : null;
  return { visitorIdHash: hashAnonymous("visitor", visitorId, env), sessionIdHash: hashAnonymous("session", sessionId, env),
    ...attribution(input), deviceClass: ["mobile", "tablet", "desktop"].includes(input.deviceClass) ? input.deviceClass : "unknown" };
}
function flagsFromEvent(event = {}) {
  const jar = cookies(event); const host = String(event.headers?.host || event.headers?.Host || "").split(":")[0].toLowerCase();
  return { isAdmin: Boolean(jar.jingeehas_admin || jar.jingeehas_advisor), isOwnerPreview: Boolean(jar[PREVIEW_COOKIE_NAME]),
    isTest: process.env.NODE_ENV === "test" || host === "localhost" || host === "127.0.0.1" || host.endsWith(".netlify.app") || isKnownBotRequest(event) };
}
function isKnownBotRequest(event = {}) {
  const method = String(event.httpMethod || "GET").toUpperCase();
  if (["HEAD", "OPTIONS"].includes(method)) return true;
  return BOT_USER_AGENT.test(String(event.headers?.["user-agent"] || event.headers?.["User-Agent"] || ""));
}
function browserOriginAllowed(event = {}) {
  const origin = String(event.headers?.origin || event.headers?.Origin || "");
  const host = String(event.headers?.host || event.headers?.Host || "").toLowerCase();
  if (!origin) return false;
  try {
    const url = new URL(origin);
    if (url.host.toLowerCase() === host && url.protocol === "https:") return true;
    return process.env.NODE_ENV === "test" && ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch { return false; }
}
function idValue(value) { const text = String(value || ""); return SAFE_ID.test(text) ? text : null; }
function localAnalyticsDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
function browserEventIdempotencyKey(name, context = {}, assessmentId = null, now = new Date()) {
  if (name === "landing_viewed" && context.visitorIdHash) return `landing_viewed:${context.visitorIdHash}:${localAnalyticsDay(now)}`;
  if (name === "payment_preparation_viewed" && context.sessionIdHash) return `payment_preparation_viewed:${context.sessionIdHash}`;
  if (["paywall_viewed", "report_opened"].includes(name) && assessmentId) return `${name}:${assessmentId}`;
  if (["landing_cta_clicked", "start_cta_clicked"].includes(name) && context.sessionIdHash) return `landing_cta_clicked:${context.sessionIdHash}`;
  return null;
}
function eventRow(name, context = {}, values = {}, options = {}) {
  const eventId = UUID.test(String(options.eventId || "")) ? options.eventId : crypto.randomUUID();
  return { id: crypto.randomUUID(), eventId, eventName: name, occurredAt: (options.now || new Date()).toISOString(),
    visitorIdHash: context.visitorIdHash || null, sessionIdHash: context.sessionIdHash || null,
    assessmentId: idValue(values.assessmentId), invoiceId: idValue(values.invoiceId), paymentId: idValue(values.paymentId),
    amountMnt: Number.isInteger(values.amountMnt) && values.amountMnt >= 0 ? values.amountMnt : null,
    utmSource: context.utmSource || null, utmMedium: context.utmMedium || null, utmCampaign: context.utmCampaign || null,
    utmContent: context.utmContent || null, utmTerm: context.utmTerm || null, referrerHost: context.referrerHost || null,
    deviceClass: context.deviceClass || "unknown", rateKeyHash: options.rateKeyHash || null,
    isAdmin: Boolean(options.isAdmin), isOwnerPreview: Boolean(options.isOwnerPreview), isTest: Boolean(options.isTest),
    idempotencyKey: options.idempotencyKey || null, metadata: options.metadata || {}, createdAt: (options.now || new Date()).toISOString() };
}
async function recordEvent(database, name, context, values, options = {}) {
  if (!BROWSER_EVENTS.has(name) && !SERVER_EVENTS.has(name)) throw new Error("Unknown analytics event");
  try { return await database.insert("analytics_events", eventRow(name, context, values, options)); }
  catch (error) { if (error?.code === "conflict") return null; throw error; }
}
async function recordEventSafe(database, name, context, values, options = {}) {
  try { return await recordEvent(database, name, context, values, options); }
  catch (error) { console.warn(JSON.stringify({ event: "analytics_write_failed", eventName: name, code: error?.code || "unknown" })); return null; }
}
async function assessmentContext(database, assessmentId) {
  const rows = await database.find("analytics_events", { assessmentId, eventName: "assessment_started" });
  const row = rows.sort((a, b) => String(a.occurredAt).localeCompare(String(b.occurredAt)))[0];
  return row ? { visitorIdHash: row.visitorIdHash, sessionIdHash: row.sessionIdHash, utmSource: row.utmSource, utmMedium: row.utmMedium,
    utmCampaign: row.utmCampaign, utmContent: row.utmContent, utmTerm: row.utmTerm, referrerHost: row.referrerHost, deviceClass: row.deviceClass } : {};
}

module.exports = { BROWSER_EVENTS, SERVER_EVENTS, UUID, analyticsPepper, hashAnonymous, cleanText, cleanHost, attribution, clientContext,
  flagsFromEvent, isKnownBotRequest, browserOriginAllowed, localAnalyticsDay, browserEventIdempotencyKey,
  eventRow, recordEvent, recordEventSafe, assessmentContext };
