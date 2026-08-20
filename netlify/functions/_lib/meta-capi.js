"use strict";

const crypto = require("node:crypto");
const { cookies } = require("./http.js");
const { PRODUCT } = require("./config.js");
const { isCommercialAnalyticsEligible } = require("./payment-context.js");

const DEFAULT_GRAPH_API_VERSION = "v25.0";
const SAFE_GRAPH_VERSION = /^v\d+\.\d+$/;
const SAFE_META_ID = /^\d{5,32}$/;
const DEFAULT_EVENT_SOURCE_URL = "https://jingeehas.fit/assessment/payment";
const LEGACY_PAYMENT_AMOUNT = 9900;

function isSupportedPaymentAmount(amount) {
  return Number.isInteger(amount) && (amount === LEGACY_PAYMENT_AMOUNT || amount === PRODUCT.amount);
}

function exactEnabled(value) {
  return String(value || "").toLowerCase() === "true";
}

function metaCapiConfig(env = process.env) {
  const version = SAFE_GRAPH_VERSION.test(String(env.META_GRAPH_API_VERSION || ""))
    ? String(env.META_GRAPH_API_VERSION)
    : DEFAULT_GRAPH_API_VERSION;
  const datasetId = String(env.META_DATASET_ID || "").trim();
  const accessToken = String(env.META_CAPI_ACCESS_TOKEN || "").trim();
  const testEventCode = String(env.META_CAPI_TEST_EVENT_CODE || "").trim();
  return {
    enabled: exactEnabled(env.META_CAPI_ENABLED),
    version,
    datasetId: SAFE_META_ID.test(datasetId) ? datasetId : "",
    accessToken,
    testEventCode: testEventCode.slice(0, 100)
  };
}

function metaBrowserConfig(env = process.env) {
  const pixelId = String(env.META_PIXEL_ID || env.META_DATASET_ID || "").trim();
  return {
    enabled: exactEnabled(env.META_BROWSER_PIXEL_ENABLED) && SAFE_META_ID.test(pixelId),
    pixelId: SAFE_META_ID.test(pixelId) ? pixelId : "",
    productCode: PRODUCT.code,
    amount: PRODUCT.amount,
    currency: "MNT"
  };
}

function purchaseEventId(payment = {}) {
  const authority = String(payment.providerPaymentId || payment.id || payment.paymentId || "").trim();
  if (!authority) return "";
  const digest = crypto.createHash("sha256").update(`${PRODUCT.code}:${authority}`).digest("hex").slice(0, 32);
  return `jh_purchase_${digest}`;
}

function eligiblePurchaseEventId(payment = {}) {
  return isCommercialAnalyticsEligible(payment) ? purchaseEventId(payment) : "";
}

function clientIp(event = {}) {
  return String(event.headers?.["x-nf-client-connection-ip"] || event.headers?.["x-forwarded-for"] || "")
    .split(",")[0].trim().slice(0, 64);
}

function eventSourceUrl(event = {}) {
  const referer = String(event.headers?.referer || event.headers?.Referer || "");
  try {
    const url = new URL(referer);
    if (url.protocol === "https:" && url.hostname === "jingeehas.fit") {
      return `https://jingeehas.fit${url.pathname.startsWith("/") ? url.pathname : "/"}`;
    }
  } catch {}
  return DEFAULT_EVENT_SOURCE_URL;
}

function purchaseEventTime(payment = {}, now = new Date()) {
  const paidAt = Date.parse(String(payment.paidAt || ""));
  const lowerBound = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  if (Number.isFinite(paidAt) && paidAt >= lowerBound && paidAt <= now.getTime()) {
    return Math.floor(paidAt / 1000);
  }
  return Math.floor(now.getTime() / 1000);
}

function userData(event = {}) {
  const jar = cookies(event);
  const data = {
    client_ip_address: clientIp(event) || undefined,
    client_user_agent: String(event.headers?.["user-agent"] || event.headers?.["User-Agent"] || "").slice(0, 500) || undefined,
    fbp: String(jar._fbp || "").slice(0, 255) || undefined,
    fbc: String(jar._fbc || "").slice(0, 255) || undefined
  };
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value));
}

function purchasePayload(payment, event, now = new Date()) {
  const eventId = eligiblePurchaseEventId(payment);
  if (!eventId) {
    throw Object.assign(new Error("Purchase event authority is missing"), { code: "meta_purchase_authority_missing" });
  }
  return {
    event_name: "Purchase",
    event_time: purchaseEventTime(payment, now),
    event_id: eventId,
    action_source: "website",
    event_source_url: eventSourceUrl(event),
    user_data: userData(event),
    custom_data: {
      value: payment.amount,
      currency: "MNT",
      order_id: String(payment.id),
      content_ids: [PRODUCT.code],
      content_type: "product",
      product_code: PRODUCT.code
    }
  };
}

async function deliverConfirmedPurchase(database, paymentId, event, options = {}) {
  const env = options.env || process.env;
  const config = metaCapiConfig(env);
  if (!config.enabled) return { delivered: false, reason: "disabled" };
  if (!config.datasetId || !config.accessToken) return { delivered: false, reason: "unconfigured" };
  const payment = await database.get("payments", paymentId);
  if (!isCommercialAnalyticsEligible(payment)) return { delivered: false, reason: "non_customer" };
  if (!payment || payment.status !== "paid" || !payment.providerPaymentId ||
      !isSupportedPaymentAmount(payment.amount) || payment.productCode !== PRODUCT.code) {
    return { delivered: false, reason: "not_authoritative" };
  }

  const eventId = purchaseEventId(payment);
  if (payment.metaPurchaseSentAt && payment.metaPurchaseEventId === eventId) {
    return { delivered: false, reason: "already_delivered", eventId };
  }

  const now = options.now || new Date();
  const body = { data: [purchasePayload(payment, event, now)] };
  if (config.testEventCode) body.test_event_code = config.testEventCode;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw Object.assign(new Error("Fetch unavailable"), { code: "meta_fetch_unavailable" });
  }

  const endpoint = `https://graph.facebook.com/${config.version}/${config.datasetId}/events`;
  const response = await fetchImpl(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.accessToken}`
    },
    body: JSON.stringify(body)
  });
  const responseBody = await response.json().catch(() => ({}));
  if (!response.ok || responseBody.error) {
    throw Object.assign(new Error("Meta CAPI delivery failed"), {
      code: "meta_capi_delivery_failed",
      statusCode: response.status,
      metaErrorCode: responseBody?.error?.code || null
    });
  }

  const deliveredAt = now.toISOString();
  await database.update("payments", payment.id, {
    metaPurchaseEventId: eventId,
    metaPurchaseSentAt: deliveredAt,
    metaPurchaseApiVersion: config.version,
    updatedAt: deliveredAt
  });
  return { delivered: true, eventId };
}

async function deliverConfirmedPurchaseSafe(database, paymentId, event, options = {}) {
  try {
    return await deliverConfirmedPurchase(database, paymentId, event, options);
  } catch (error) {
    console.warn(JSON.stringify({
      event: "meta_capi_purchase_failed",
      code: error?.code || "unknown",
      metaErrorCode: error?.metaErrorCode || null
    }));
    return { delivered: false, reason: "delivery_failed", errorCode: error?.code || "unknown" };
  }
}

module.exports = {
  DEFAULT_GRAPH_API_VERSION,
  DEFAULT_EVENT_SOURCE_URL,
  metaCapiConfig,
  metaBrowserConfig,
  purchaseEventId,
  eligiblePurchaseEventId,
  eventSourceUrl,
  purchaseEventTime,
  userData,
  purchasePayload,
  deliverConfirmedPurchase,
  deliverConfirmedPurchaseSafe
};
