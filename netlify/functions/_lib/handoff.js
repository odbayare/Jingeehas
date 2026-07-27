"use strict";

const { randomId, randomToken, hashToken } = require("./crypto.js");
const { encryptContact, decryptContact } = require("./recovery.js");
const { prepareSession } = require("./session.js");
const { nextRoute } = require("./commercial-flow.js");
const { boundedHash, consumeRate, sourceIp } = require("./qpay-callback.js");

const HANDOFF_ORIGIN = "https://jingeehas.fit";
const HANDOFF_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const INVALID_HANDOFF = Object.freeze({ status: "invalid", message: "Сэргээх холбоос хүчингүй эсвэл хугацаа дууссан байна." });

function publicHandoff(row, token, code) {
  if (!row || !token || !code) return null;
  return { link: `${HANDOFF_ORIGIN}/assessment/recover#token=${encodeURIComponent(token)}`, code, expiresAt: row.expiresAt };
}

async function issueAccessHandoff(database, payment, now = new Date()) {
  const existing = typeof database.getAccessHandoffByPayment === "function"
    ? await database.getAccessHandoffByPayment(payment.id)
    : (await database.find("access_handoffs", { paymentId: payment.id }))[0] || null;
  if (existing) return publicHandoff(existing, decryptContact(existing.encryptedToken), decryptContact(existing.encryptedCode));
  const token = randomToken("jh_h_");
  const code = randomToken("jh_c_");
  const row = { id: randomId("ah_"), assessmentId: payment.assessmentId, paymentId: payment.id, originSessionId: payment.sessionId,
    productCode: payment.productCode, tokenHash: hashToken(token), encryptedToken: encryptContact(token), codeHash: hashToken(code), encryptedCode: encryptContact(code),
    expiresAt: new Date(now.getTime() + HANDOFF_TTL_MS).toISOString(), redeemedAt: null, createdAt: now.toISOString(), updatedAt: now.toISOString() };
  const created = typeof database.createAccessHandoff === "function" ? await database.createAccessHandoff(row) : await database.insert("access_handoffs", row);
  return publicHandoff(created, token, code);
}

async function handoffForPayment(database, payment) {
  const existing = typeof database.getAccessHandoffByPayment === "function"
    ? await database.getAccessHandoffByPayment(payment.paymentId || payment.id)
    : (await database.find("access_handoffs", { paymentId: payment.paymentId || payment.id }))[0] || null;
  return existing ? publicHandoff(existing, decryptContact(existing.encryptedToken), decryptContact(existing.encryptedCode)) : null;
}

async function redeemAccessHandoff(database, tokenOrCode, event, now = new Date(), kind = "token") {
  const normalized = String(tokenOrCode || "").trim();
  const tokenHash = kind === "token" && /^[A-Za-z0-9_-]{20,512}$/.test(normalized) ? hashToken(normalized) : "";
  const codeHash = kind === "code" && /^[A-Za-z0-9_-]{12,512}$/.test(normalized) ? hashToken(normalized) : "";
  if (!tokenHash && !codeHash) return INVALID_HANDOFF;
  let tokenRate;
  let ipRate;
  try {
    const ipHash = boundedHash(sourceIp(event));
    [tokenRate, ipRate] = await Promise.all([
      consumeRate(database, boundedHash(normalized), "handoff_token", 5, now),
      consumeRate(database, ipHash, "handoff_ip", 20, now)
    ]);
  } catch {
    return INVALID_HANDOFF;
  }
  if (tokenRate.allowed === false || ipRate.allowed === false) return INVALID_HANDOFF;
  const prepared = prepareSession(now);
  const result = typeof database.redeemAccessHandoff === "function"
    ? await database.redeemAccessHandoff({ tokenHash, codeHash, now: now.toISOString(), sessionRow: prepared.row })
    : null;
  if (!result) return INVALID_HANDOFF;
  const assessment = await database.get("assessments", result.assessmentId);
  return { status: "ok", assessmentId: result.assessmentId, nextRoute: await nextRoute(database, assessment), cookie: prepared.public.cookie };
}

module.exports = { HANDOFF_TTL_MS, INVALID_HANDOFF, publicHandoff, issueAccessHandoff, handoffForPayment, redeemAccessHandoff };
