"use strict";

const { hashToken } = require("./crypto.js");

const WINDOW_MS = 5 * 60 * 1000;
const PAYMENT_LIMIT = 3;
const IP_LIMIT = 20;

function ratePepper(env = process.env) {
  const value = String(env.QPAY_CALLBACK_RATE_LIMIT_PEPPER || env.RECOVERY_HASH_PEPPER || "");
  return value.length >= 32 ? value : "jingeehas-qpay-callback-test-pepper";
}

function boundedHash(value, env = process.env) {
  return hashToken(`${ratePepper(env)}:${String(value || "").slice(0, 256)}`);
}

function sourceIp(event = {}) {
  const forwarded = event.headers?.["x-forwarded-for"] || event.headers?.["X-Forwarded-For"] || "";
  return String(forwarded).split(",")[0].trim().slice(0, 128) || String(event.headers?.["client-ip"] || "unknown").slice(0, 128);
}

async function consumeRate(database, keyHash, keyKind, limit, now = new Date()) {
  if (typeof database.consumeQpayCallbackRateLimit === "function") {
    return database.consumeQpayCallbackRateLimit(keyHash, keyKind, limit, now);
  }
  const bucket = Math.floor(now.getTime() / WINDOW_MS);
  const id = `${keyKind}:${keyHash}:${bucket}`;
  const existing = await database.get("qpay_callback_rate_limits", id);
  if (existing) { const count = Number(existing.lookupCount || 0) + 1; await database.update("qpay_callback_rate_limits", id, { lookupCount: count }); return { allowed: count <= limit, count }; }
  try { await database.insert("qpay_callback_rate_limits", { id, keyHash, keyKind, windowStart: new Date(bucket * WINDOW_MS).toISOString(), lookupCount: 1, expiresAt: new Date((bucket + 1) * WINDOW_MS).toISOString(), createdAt: now.toISOString() }); return { allowed: true, count: 1 }; }
  catch { return { allowed: false, count: limit + 1 }; }
}

async function alreadyConfirmed(database, providerPaymentId) {
  const rows = await database.find("payments", { providerPaymentId });
  if (!rows.length) return false;
  const payment = rows.find(row => row.status === "paid");
  if (!payment) return false;
  const entitlements = await database.find("entitlements", { paymentId: payment.id, status: "active" });
  return entitlements.length > 0;
}

async function allowProviderLookup(database, providerPaymentId, event, now = new Date()) {
  if (await alreadyConfirmed(database, providerPaymentId)) return { allowed: false, fastPath: true };
  const payment = await consumeRate(database, boundedHash(providerPaymentId), "payment_id", PAYMENT_LIMIT, now);
  const ip = await consumeRate(database, boundedHash(sourceIp(event)), "source_ip", IP_LIMIT, now);
  return { allowed: Boolean(payment.allowed !== false && ip.allowed !== false), fastPath: false };
}

module.exports = { WINDOW_MS, PAYMENT_LIMIT, IP_LIMIT, boundedHash, sourceIp, consumeRate, alreadyConfirmed, allowProviderLookup };
