"use strict";

const nodeCrypto = require("node:crypto");
const { randomId, randomDigits, hashToken, safeEqual } = require("./crypto.js");
const { createSession } = require("./session.js");

const PHONE_ERROR = "Утасны дугаараа зөв оруулна уу.";
const EMAIL_ERROR = "Имэйл хаягаа зөв оруулна уу.";

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
    if (!this.url.startsWith("https://") || !this.key) throw Object.assign(new Error("Recovery delivery is unavailable"), { statusCode: 503, code: "recovery_unavailable" });
  }
  async send(payload) {
    const response = await fetch(this.url, { method: "POST", headers: { authorization: `Bearer ${this.key}`, "content-type": "application/json" },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw Object.assign(new Error("Recovery delivery failed"), { statusCode: 503, code: "recovery_unavailable" });
  }
}
let testDelivery = null;
function setRecoveryDeliveryForTests(delivery) {
  if (process.env.NODE_ENV !== "test") throw new Error("Test recovery injection is disabled");
  testDelivery = delivery;
}
function getRecoveryDelivery() { return process.env.NODE_ENV === "test" && testDelivery ? testDelivery : new RecoveryDeliveryClient(); }

async function requestRecovery(database, delivery, input, clientKey, now = new Date()) {
  const contacts = validateContacts(input);
  const [type, value] = contacts.phone ? ["phone", contacts.phone] : ["email", contacts.email];
  const hash = contactHash(type, value);
  const recent = (await database.find("recovery_challenges", { rateKey: hashToken(`${clientKey}:${hash}`) }))
    .filter(row => new Date(row.createdAt) > new Date(now.getTime() - 60 * 60 * 1000));
  if (recent.length >= 5) throw Object.assign(new Error("Too many requests"), { statusCode: 429, code: "rate_limited" });
  const matching = await database.find("recovery_contacts", { type, contactHash: hash });
  const eligible = matching.find(contact => contact.entitlementId);
  const recoveryId = randomId("rr_");
  const code = randomDigits(6);
  await database.insert("recovery_challenges", { id: recoveryId, rateKey: hashToken(`${clientKey}:${hash}`),
    contactId: eligible?.id || null, codeHash: hashToken(`${recoveryId}:${code}`), attempts: 0,
    expiresAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(), usedAt: null, createdAt: now.toISOString() });
  if (eligible) await delivery.send({ channel: type, encryptedContact: eligible.encryptedContact, code, expiresInMinutes: 10 });
  return { recoveryId, message: "Хэрэв тохирох бүрэн тайлан байгаа бол баталгаажуулах код илгээгдлээ." };
}

async function confirmRecovery(database, input, now = new Date()) {
  const challenge = await database.get("recovery_challenges", input.recoveryId);
  const valid = challenge && !challenge.usedAt && challenge.contactId && challenge.attempts < 5 && new Date(challenge.expiresAt) > now &&
    safeEqual(challenge.codeHash, hashToken(`${challenge.id}:${String(input.code || "")}`));
  if (!valid) {
    if (challenge) await database.update("recovery_challenges", challenge.id, { attempts: Number(challenge.attempts || 0) + 1 });
    throw Object.assign(new Error("Invalid recovery code"), { statusCode: 400, code: "invalid_recovery_code" });
  }
  const contact = await database.get("recovery_contacts", challenge.contactId);
  const entitlement = contact ? await database.get("entitlements", contact.entitlementId) : null;
  if (!contact || !entitlement || entitlement.status !== "active") throw Object.assign(new Error("Invalid recovery code"), { statusCode: 400, code: "invalid_recovery_code" });
  const created = await createSession(database, now);
  await database.upsert("assessment_sessions", `${entitlement.assessmentId}:${created.session.id}`, {
    assessmentId: entitlement.assessmentId, sessionId: created.session.id, source: "recovery", createdAt: now.toISOString()
  });
  await database.update("recovery_challenges", challenge.id, { usedAt: now.toISOString() });
  await database.update("recovery_contacts", contact.id, { verifiedAt: now.toISOString() });
  return { assessmentId: entitlement.assessmentId, session: created.session, cookie: created.cookie };
}

module.exports = { PHONE_ERROR, EMAIL_ERROR, normalizePhone, normalizeEmail, validateContacts, encryptContact, contactHash,
  saveRecoveryContacts, RecoveryDeliveryClient, setRecoveryDeliveryForTests, getRecoveryDelivery, requestRecovery, confirmRecovery };
