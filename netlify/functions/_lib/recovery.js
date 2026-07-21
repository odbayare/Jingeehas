"use strict";

const nodeCrypto = require("node:crypto");
const { randomId, randomDigits, hashToken, safeEqual } = require("./crypto.js");
const { createSession } = require("./session.js");
const { nextRoute } = require("./commercial-flow.js");

const PHONE_ERROR = "Утасны дугаараа зөв оруулна уу.";
const EMAIL_ERROR = "Имэйл хаягаа зөв оруулна уу.";
const EMAIL_ONLY_ERROR = "Тайлан сэргээхэд имэйл хаяг ашиглана уу. Утсаар сэргээх үйлчилгээ одоогоор нээгдээгүй байна.";
const RECOVERY_SUBJECT = "Jingeehas тайлан сэргээх баталгаажуулах код";
const GENERIC_RECOVERY_MESSAGE = "Хэрэв тохирох бүрэн тайлан байгаа бол баталгаажуулах код илгээгдлээ.";
const WINDOW_MS = 60 * 60 * 1000;
const COOLDOWN_MS = 60 * 1000;

function normalizePhone(value) {
  const compact = String(value || "").replace(/[\s()-]/g, "");
  const local = compact.replace(/^\+976/, "").replace(/^976(?=\d{8}$)/, "");
  return /^[2-9]\d{7}$/.test(local) ? `+976${local}` : "";
}
function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254 ? email : "";
}
function validateContacts(input = {}) {
  const hasPhone = String(input.phone || "").trim() !== "";
  const hasEmail = String(input.email || "").trim() !== "";
  const phone = normalizePhone(input.phone);
  const email = normalizeEmail(input.email);
  if (hasPhone && !phone) throw Object.assign(new Error(PHONE_ERROR), { statusCode: 400, code: "invalid_phone", publicMessage: PHONE_ERROR });
  if (hasEmail && !email) throw Object.assign(new Error(EMAIL_ERROR), { statusCode: 400, code: "invalid_email", publicMessage: EMAIL_ERROR });
  if (!phone && !email) throw Object.assign(new Error("Contact required"), { statusCode: 400, code: "contact_required" });
  return { phone, email };
}
function encryptionKey(env = process.env) {
  const key = Buffer.from(String(env.RECOVERY_ENCRYPTION_KEY || ""), "base64");
  if (key.length !== 32) throw Object.assign(new Error("Recovery encryption is unavailable"), { statusCode: 503, code: "recovery_unavailable" });
  return key;
}
function encryptContact(value, key = encryptionKey()) {
  const iv = nodeCrypto.randomBytes(12);
  const cipher = nodeCrypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map(part => part.toString("base64url")).join(".");
}
function decryptContact(value, key = encryptionKey()) {
  const [iv, tag, ciphertext] = String(value || "").split(".").map(part => Buffer.from(part, "base64url"));
  if (!iv?.length || !tag?.length || !ciphertext?.length) throw Object.assign(new Error("Recovery contact is invalid"), { statusCode: 503, code: "recovery_unavailable" });
  const decipher = nodeCrypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}
function contactPepper(env = process.env) {
  const value = String(env.RECOVERY_HASH_PEPPER || "");
  if (value.length < 32) throw Object.assign(new Error("Recovery hashing is unavailable"), { statusCode: 503, code: "recovery_unavailable" });
  return value;
}
function contactHash(type, value) { return hashToken(`${contactPepper()}:${type}:${value}`); }

async function saveRecoveryContacts(database, sessionId, input, now = new Date()) {
  const contacts = validateContacts(input);
  const contactGroupId = randomId("rcg_");
  for (const [type, value] of Object.entries(contacts).filter(([, value]) => value)) {
    await database.insert("recovery_contacts", { id: randomId("rc_"), contactGroupId, sessionId, assessmentId: null,
      paymentId: null, entitlementId: null, type, contactHash: contactHash(type, value), encryptedContact: encryptContact(value),
      verifiedAt: null, createdAt: now.toISOString() });
  }
  return { contactGroupId };
}

class RecoveryDeliveryClient {
  constructor(env = process.env) {
    this.url = String(env.RECOVERY_DELIVERY_API_URL || "");
    this.key = String(env.RECOVERY_DELIVERY_API_KEY || "");
    this.senderEmail = String(env.RECOVERY_SENDER_EMAIL || "").trim();
    this.senderName = String(env.RECOVERY_SENDER_NAME || "Jingeehas").trim();
    this.channel = String(env.RECOVERY_CHANNEL || "").trim().toLowerCase();
    let endpoint;
    try { endpoint = new URL(this.url); } catch { endpoint = null; }
    if (!endpoint || endpoint.protocol !== "https:" || endpoint.hostname !== "api.resend.com" || endpoint.pathname.replace(/\/+$/, "") !== "/emails" ||
      !this.key || this.channel !== "email" || !normalizeEmail(this.senderEmail)) {
      throw Object.assign(new Error("Recovery delivery is unavailable"), { statusCode: 503, code: "recovery_unavailable" });
    }
  }
  async send(payload) {
    const expires = Number(payload.expiresInMinutes) || 10;
    const text = `Таны баталгаажуулах код: ${payload.code}\n\nКод ${expires} минутын дараа хүчингүй болно. Та энэ хүсэлтийг гаргаагүй бол имэйлийг үл тоомсорлоно уу. Кодоо хэнд ч бүү хэлээрэй.\n\nJingeehas хэрэглэгчийн дэмжлэг`;
    const html = `<p>Таны баталгаажуулах код:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${payload.code}</p><p>Код ${expires} минутын дараа хүчингүй болно.</p><p>Та энэ хүсэлтийг гаргаагүй бол имэйлийг үл тоомсорлоно уу. Кодоо хэнд ч бүү хэлээрэй.</p><p>Jingeehas хэрэглэгчийн дэмжлэг</p>`;
    let response;
    try {
      response = await fetch(this.url, { method: "POST", headers: { authorization: `Bearer ${this.key}`, "content-type": "application/json" },
        body: JSON.stringify({ from: `${this.senderName} <${this.senderEmail}>`, to: [payload.destination], subject: RECOVERY_SUBJECT, text, html }),
        signal: AbortSignal.timeout(8000) });
    } catch { throw Object.assign(new Error("Recovery delivery failed"), { statusCode: 503, code: "recovery_unavailable" }); }
    if (!response.ok) throw Object.assign(new Error("Recovery delivery failed"), { statusCode: 503, code: "recovery_unavailable" });
    let data;
    try { data = await response.json(); }
    catch { throw Object.assign(new Error("Recovery delivery failed"), { statusCode: 503, code: "recovery_unavailable" }); }
    const providerId = String(data?.id || data?.messageId || data?.message_id || "").trim().slice(0, 200);
    if (!providerId) throw Object.assign(new Error("Recovery delivery failed"), { statusCode: 503, code: "recovery_unavailable" });
    return { providerId };
  }
}
function getRecoveryDelivery() { return new RecoveryDeliveryClient(); }

function recoveryEmail(input = {}) {
  const email = normalizeEmail(input.email);
  if (!email) throw Object.assign(new Error(input.phone ? EMAIL_ONLY_ERROR : EMAIL_ERROR), {
    statusCode: 400, code: input.phone ? "email_recovery_required" : "invalid_email", publicMessage: input.phone ? EMAIL_ONLY_ERROR : EMAIL_ERROR
  });
  return email;
}

async function recentFor(database, field, value, now) {
  return (await database.find("recovery_challenges", { [field]: value }))
    .filter(row => new Date(row.createdAt) > new Date(now.getTime() - WINDOW_MS));
}

async function requestRecovery(database, delivery, input, clientContext, now = new Date()) {
  const type = "email";
  const value = recoveryEmail(input);
  const hash = contactHash(type, value);
  const ip = String(clientContext?.ip || "unknown");
  const session = String(clientContext?.session || `anonymous:${ip}`);
  const contactRateKey = hashToken(`contact:${hash}`);
  const ipRateKey = hashToken(`ip:${ip}`);
  const sessionRateKey = hashToken(`session:${session}`);
  const [contactRecent, ipRecent, sessionRecent] = await Promise.all([
    recentFor(database, "contactRateKey", contactRateKey, now),
    recentFor(database, "ipRateKey", ipRateKey, now),
    recentFor(database, "sessionRateKey", sessionRateKey, now)
  ]);
  if (contactRecent.length >= 5 || ipRecent.length >= 20 || sessionRecent.length >= 5) {
    throw Object.assign(new Error("Too many requests"), { statusCode: 429, code: "rate_limited" });
  }
  const matching = await database.find("recovery_contacts", { type, contactHash: hash });
  const eligible = matching.find(contact => contact.assessmentId);
  const recoveryId = randomId("rr_");
  const code = randomDigits(6);
  const bucket = Math.floor(now.getTime() / COOLDOWN_MS);
  try {
    await database.insert("recovery_challenges", { id: recoveryId, rateKey: contactRateKey, contactRateKey, ipRateKey, sessionRateKey,
    contactCooldownKey: hashToken(`${contactRateKey}:${bucket}`), ipCooldownKey: hashToken(`${ipRateKey}:${bucket}`),
    sessionCooldownKey: hashToken(`${sessionRateKey}:${bucket}`),
    contactId: eligible?.id || null, codeHash: hashToken(`${recoveryId}:${code}`), attempts: 0,
    deliveryStatus: eligible ? "pending" : "suppressed", deliveryProviderId: null, deliveryAttemptedAt: null,
    expiresAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(), usedAt: null, createdAt: now.toISOString() });
  } catch (error) {
    if (error?.code === "conflict") throw Object.assign(new Error("Too many requests"), { statusCode: 429, code: "rate_limited" });
    throw error;
  }
  for (const challenge of contactRecent.filter(row => !row.usedAt && new Date(row.expiresAt) > now)) {
    await database.update("recovery_challenges", challenge.id, { usedAt: now.toISOString(), deliveryStatus: "superseded" });
  }
  if (eligible) {
    try {
      const sent = await delivery.send({ channel: "email", destination: decryptContact(eligible.encryptedContact), code, expiresInMinutes: 10 });
      await database.update("recovery_challenges", recoveryId, { deliveryStatus: "sent", deliveryProviderId: sent?.providerId || null, deliveryAttemptedAt: now.toISOString() });
    } catch (error) {
      await database.update("recovery_challenges", recoveryId, { deliveryStatus: "failed", deliveryAttemptedAt: now.toISOString() });
      throw error;
    }
  }
  return { recoveryId, message: GENERIC_RECOVERY_MESSAGE };
}

async function confirmRecovery(database, input, now = new Date()) {
  const recoveryId = String(input.recoveryId || "");
  const submittedHash = hashToken(`${recoveryId}:${String(input.code || "")}`);
  const challenge = typeof database.consumeRecoveryChallenge === "function"
    ? await database.consumeRecoveryChallenge(recoveryId, submittedHash, now.toISOString())
    : null;
  if (!challenge) throw Object.assign(new Error("Invalid recovery code"), { statusCode: 400, code: "invalid_recovery_code" });
  const contact = await database.get("recovery_contacts", challenge.contactId);
  const assessment = contact?.assessmentId ? await database.get("assessments", contact.assessmentId) : null;
  if (!contact || !assessment) throw Object.assign(new Error("Invalid recovery code"), { statusCode: 400, code: "invalid_recovery_code" });
  const created = await createSession(database, now);
  await database.upsert("assessment_sessions", `${assessment.id}:${created.session.id}`, {
    assessmentId: assessment.id, sessionId: created.session.id, source: "recovery", createdAt: now.toISOString()
  });
  await database.update("recovery_contacts", contact.id, { verifiedAt: now.toISOString() });
  return { assessmentId: assessment.id, nextRoute: await nextRoute(database, assessment), session: created.session, cookie: created.cookie };
}

module.exports = { PHONE_ERROR, EMAIL_ERROR, EMAIL_ONLY_ERROR, RECOVERY_SUBJECT, GENERIC_RECOVERY_MESSAGE, normalizePhone, normalizeEmail,
  validateContacts, encryptContact, decryptContact, contactHash, saveRecoveryContacts, RecoveryDeliveryClient, getRecoveryDelivery,
  recoveryEmail, requestRecovery, confirmRecovery };
