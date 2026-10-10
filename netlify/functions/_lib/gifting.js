"use strict";
const { PRODUCT } = require("./config.js");
const { randomId, randomToken, hashToken } = require("./crypto.js");
const { confirmedProviderPayment } = require("./payment.js");
const { CURRENT_QUESTIONNAIRE_VERSION } = require("../../../questions.js");
function fail(code, statusCode = 409) { throw Object.assign(new Error(code), { code, statusCode }); }
function enabled() { if (process.env.JINGEEHAS_GIFTING_ENABLED !== "true") fail("gifting_unavailable", 503); }
function sameOrigin(event) {
  const origin = event.headers?.origin || event.headers?.Origin;
  const host = event.headers?.host || event.headers?.Host;
  try { if (!origin || new URL(origin).host !== host || new URL(origin).protocol !== "https:") fail("origin_required", 403); }
  catch { fail("origin_required", 403); }
}
function tokenHash(token) {
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) fail("gift_unavailable", 404);
  return hashToken(token);
}
async function request(database, action, input = {}) {
  const result = await database.giftRequest({ action, ...input });
  if (result?.error) fail(result.error, result.error === "gift_unavailable" ? 404 : 409);
  return result;
}
function buyerView(order) {
  return { orderId: order.id, amount: order.amount, status: order.status, qrImage: order.qrImage || "", urls: order.urls || [], expiresAt: order.expiresAt || null };
}
async function createGift(database, provider, sessionId, input = {}, now = new Date()) {
  if (typeof input.requestKey !== "string" || !/^[a-f0-9-]{36}$/.test(input.requestKey)) fail("invalid_request_key", 400);
  if (input.note != null && (typeof input.note !== "string" || input.note.length > 280)) fail("invalid_note", 400);
  const order = await request(database, "create", { id: randomId("go_"), sessionId, requestKey: input.requestKey,
    note: (input.note || "").trim(), amount: PRODUCT.amount, senderInvoiceNo: randomId("jg_"), now: now.toISOString() });
  if (!order.created) return buyerView(order); // Never repeat an ambiguous provider create.
  try {
    const invoice = await provider.createInvoice({ senderInvoiceNo: order.senderInvoiceNo, amount: order.amount });
    if (!invoice?.invoiceId) throw new Error("ambiguous");
    return buyerView(await request(database, "invoice", { id: order.id, sessionId, invoice, now: now.toISOString() }));
  } catch {
    await request(database, "unknown", { id: order.id, sessionId });
    fail("gift_invoice_reconciliation_required", 502);
  }
}
async function confirmGift(database, provider, reference, now = new Date()) {
  const order = await request(database, "callback_lookup", { senderInvoiceNo: reference });
  if (!order?.invoiceId || order.status === "canceled") return { state: "ignored" };
  if (["paid", "claimed"].includes(order.status)) return { state: "paid" };
  let result;
  try { result = await provider.checkPayment(order.invoiceId); } catch { return { state: "retry" }; }
  const paid = confirmedProviderPayment(result, order.amount);
  if (!paid) return { state: "retry" };
  const confirmed = await request(database, "confirm", { id: order.id, providerPaymentId: String(paid.payment_id || paid.id), now: now.toISOString() });
  return { state: ["paid", "claimed"].includes(confirmed.status) ? "paid" : "ignored" };
}
async function giftAction(database, provider, sessionId, input, now = new Date()) {
  const timestamp = now.toISOString();
  if (input.action === "create") return createGift(database, provider, sessionId, input, now);
  if (input.action === "status") return buyerView(await request(database, "buyer", { id: input.orderId, sessionId }));
  if (input.action === "check") {
    const order = await request(database, "buyer", { id: input.orderId, sessionId });
    await confirmGift(database, provider, order.senderInvoiceNo, now);
    return buyerView(await request(database, "buyer", { id: order.id, sessionId }));
  }
  if (input.action === "link") {
    const token = randomToken();
    await request(database, "rotate", { id: input.orderId, sessionId, tokenHash: hashToken(token), now: timestamp });
    return { claimPath: `/gift.html#${token}` }; // Fragment never enters HTTP/referrer logs.
  }
  if (input.action === "recovery_key") {
    const code = randomToken();
    await request(database, "recovery_key", { id: input.orderId, sessionId, recoveryHash: hashToken(code) });
    return { recoveryCode: code };
  }
  if (input.action === "recover") return buyerView(await request(database, "recover", { sessionId, recoveryHash: tokenHash(input.recoveryCode) }));
  if (input.action === "preview") {
    const result = await request(database, "preview", { tokenHash: tokenHash(input.token), sessionId, now: timestamp });
    return result.claimed ? { claimed: true, nextRoute: "/assessment/questions" } : { note: result.note || "", available: true };
  }
  if (input.action === "claim") {
    if (input.accept !== true) fail("gift_acceptance_required", 400);
    return request(database, "claim", { tokenHash: tokenHash(input.token), sessionId, assessmentId: randomId("wa_"),
      safetyCheckId: randomId("sc_"), questionnaireVersion: CURRENT_QUESTIONNAIRE_VERSION, productCode: PRODUCT.code, now: timestamp });
  }
  fail("invalid_gift_action", 400);
}
module.exports = { enabled, sameOrigin, buyerView, createGift, confirmGift, giftAction };
