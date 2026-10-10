"use strict";
const { PRODUCT } = require("./config.js");
const { sealNote, openNote } = require("./gift-note.js");
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
  return { supportRequired: ["create_unknown", "canceled", "paid_review"].includes(order.status), orderId: order.id, amount: order.amount, status: order.status, qrImage: order.qrImage || "", urls: order.urls || [], expiresAt: order.expiresAt || null };
}
async function createGift(database, provider, sessionId, input = {}, now = new Date()) {
  if (typeof input.requestKey !== "string" || !/^[a-f0-9-]{36}$/.test(input.requestKey)) fail("invalid_request_key", 400);
  if (input.note != null && (typeof input.note !== "string" || input.note.length > 280)) fail("invalid_note", 400);
  const order = await request(database, "create", { id: randomId("go_"), sessionId, requestKey: input.requestKey,
    note: sealNote((input.note || "").trim()), amount: PRODUCT.amount, senderInvoiceNo: randomId("jg_"), now: now.toISOString() });
  if (!order.created) return buyerView(order); // Never repeat an ambiguous provider create.
  try {
    const invoice = await provider.createInvoice({ senderInvoiceNo: order.senderInvoiceNo, amount: order.amount });
    if (!invoice?.invoiceId) throw new Error("ambiguous");
    return buyerView(await request(database, "provider_invoice", { id: order.id, invoice, now: now.toISOString() }));
  } catch {
    return buyerView(await request(database, "callback_wait", { id: order.id }));
  }
}
async function confirmGift(database, provider, reference, now = new Date()) {
  const order = await request(database, "callback_lookup", { senderInvoiceNo: reference });
  if (!order?.id) return { state: "ignored" };
  if (order.status === "paid_review") return { state: "review" };
  if (!order.invoiceId) {
    await request(database, "callback_wait", { id: order.id });
    return { state: "retry" };
  }
  if (["paid", "claimed"].includes(order.status)) return { state: "paid" };
  let result;
  try { result = await provider.checkPayment(order.invoiceId); } catch { return { state: "retry" }; }
  const paid = confirmedProviderPayment(result, order.amount);
  if (!paid) return { state: "retry" };
  const confirmed = await request(database, "confirm", { id: order.id, providerPaymentId: String(paid.payment_id || paid.id), now: now.toISOString() });
  return { state: ["paid", "claimed"].includes(confirmed.status) ? "paid" : confirmed.status === "paid_review" ? "review" : "retry" };
}
async function giftAction(database, provider, sessionId, input, now = new Date()) {
  const timestamp = now.toISOString();
  if (input.action === "create") return createGift(database, provider, sessionId, input, now);
  if (input.action === "status") return buyerView(await request(database, "buyer", { id: input.orderId, requestKey: input.requestKey, sessionId }));
  if (input.action === "cancel") return buyerView(await request(database, "cancel", { id: input.orderId, sessionId }));
  if (input.action === "check") {
    const order = await request(database, "buyer", { id: input.orderId, sessionId });
    await confirmGift(database, provider, order.senderInvoiceNo, now);
    return buyerView(await request(database, "buyer", { id: order.id, sessionId }));
  }
  if (input.action === "link") {
    const token = randomToken();
    const days = Number(process.env.JINGEEHAS_GIFT_LINK_DAYS || 30);
    if (!Number.isInteger(days) || days < 1 || days > 365) fail("gift_policy_unavailable", 503);
    await request(database, "rotate", { id: input.orderId, sessionId, tokenHash: hashToken(token), linkLifetimeSeconds: days * 86400, now: timestamp });
    return { linkDays: days, claimPath: `/gift.html#${token}` }; // Fragment never enters HTTP/referrer logs.
  }
  if (input.action === "recovery_key") {
    const code = randomToken();
    await request(database, "recovery_key", { id: input.orderId, sessionId, recoveryHash: hashToken(code) });
    return { recoveryCode: code };
  }
  if (input.action === "recover") return buyerView(await request(database, "recover", { sessionId, recoveryHash: tokenHash(input.recoveryCode) }));
  if (input.action === "preview") {
    const result = await request(database, "preview", { tokenHash: tokenHash(input.token), sessionId, now: timestamp });
    return result.claimed ? { claimed: true, assessmentId: result.assessmentId, nextRoute: "/assessment/questions" } : { note: openNote(result.note), available: true };
  }
  if (input.action === "claim") {
    if (input.accept !== true) fail("gift_acceptance_required", 400);
    return request(database, "claim", { tokenHash: tokenHash(input.token), sessionId, assessmentId: randomId("wa_"),
      safetyCheckId: randomId("sc_"), questionnaireVersion: CURRENT_QUESTIONNAIRE_VERSION, productCode: PRODUCT.code, now: timestamp });
  }
  fail("invalid_gift_action", 400);
}
function supportView(order) {
  return { orderId: order.id, amount: order.amount, status: order.status, senderInvoiceNo: order.senderInvoiceNo,
    invoiceId: order.invoiceId || null, paidAt: order.paidAt || null, reviewReason: order.reviewReason || null };
}
async function supportGift(database, provider, adminSessionId, input = {}) {
  const allowed = new Set(["lookup", "attach_invoice", "check", "close_unpaid", "release_paid_value", "rebind_buyer"]);
  if (!allowed.has(input.action)) fail("invalid_gift_action", 400);
  const owner = { adminSessionId, id: input.orderId };
  if (input.action === "lookup") return supportView(await request(database, "support_lookup", owner));
  if (input.action === "check") {
    const order = await request(database, "support_lookup", owner);
    await confirmGift(database, provider, order.senderInvoiceNo);
    return supportView(await request(database, "support_lookup", owner));
  }
  if (typeof input.operationKey !== "string" || !/^[a-f0-9-]{36}$/.test(input.operationKey) ||
      typeof input.evidenceRef !== "string" || !/^[A-Za-z0-9_-]{8,80}$/.test(input.evidenceRef)) fail("support_evidence_required", 400);
  if (input.action === "attach_invoice" && (input.providerReferenceVerified !== true || typeof input.invoiceId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(input.invoiceId))) fail("provider_reference_verification_required", 400);
  if (input.action === "close_unpaid") {
    if (input.providerClosedVerified !== true) fail("provider_closure_verification_required", 400);
    const order = await request(database, "support_lookup", owner);
    if (order.invoiceId) await confirmGift(database, provider, order.senderInvoiceNo);
  }
  if (input.action === "release_paid_value" && input.buyerRequestedGift !== true) fail("buyer_resolution_required", 400);
  if (input.action === "rebind_buyer" && input.buyerVerified !== true) fail("buyer_verification_required", 400);
  const result = await request(database, `support_${input.action}`, { ...owner, operationKey: input.operationKey, evidenceRef: input.evidenceRef,
    invoiceId: input.invoiceId, providerReferenceVerified: input.providerReferenceVerified, providerClosedVerified: input.providerClosedVerified,
    buyerRequestedGift: input.buyerRequestedGift, buyerVerified: input.buyerVerified, buyerSessionId: input.buyerSessionId });
  if (input.action === "attach_invoice") {
    await confirmGift(database, provider, result.senderInvoiceNo);
    return supportView(await request(database, "support_lookup", owner));
  }
  return supportView(result);
}
module.exports = { enabled, sameOrigin, buyerView, createGift, confirmGift, giftAction, supportView, supportGift };
