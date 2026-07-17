"use strict";

const nodeCrypto = require("node:crypto");
const { randomId, randomToken, hashToken, safeEqual } = require("./crypto.js");
const { cookies } = require("./http.js");

function hashPassword(password, salt = nodeCrypto.randomBytes(16).toString("base64url")) {
  if (String(password).length < 12) throw Object.assign(new Error("Password too short"), { statusCode: 400, code: "weak_password" });
  const digest = nodeCrypto.scryptSync(String(password), salt, 64).toString("base64url");
  return `scrypt$${salt}$${digest}`;
}
function verifyPassword(password, stored) {
  const [algorithm, salt, digest] = String(stored || "").split("$");
  if (algorithm !== "scrypt" || !salt || !digest) return false;
  return safeEqual(nodeCrypto.scryptSync(String(password), salt, 64).toString("base64url"), digest);
}
function roleCookie(name, value, maxAge = 60 * 60 * 8) { return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`; }

async function createRoleSession(database, { table, ownerField, ownerId, prefix, cookieName }, now = new Date()) {
  const id = randomId(prefix); const secret = randomToken(); const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();
  const row = { id, [ownerField]: ownerId, tokenHash: hashToken(secret), expiresAt, revokedAt: null, createdAt: now.toISOString() };
  if (table === "admin_sessions") row.purpose = "admin";
  await database.insert(table, row);
  return { id, expiresAt, cookie: roleCookie(cookieName, `${id}.${secret}`) };
}
async function authenticateRole(database, event, config) {
  const credential = cookies(event)[config.cookieName] || ""; const separator = credential.indexOf(".");
  const id = credential.slice(0, separator); const secret = credential.slice(separator + 1);
  const session = separator > 0 ? await database.get(config.table, id) : null;
  const wrongPurpose = config.table === "admin_sessions" && session?.purpose && session.purpose !== "admin";
  if (!session || wrongPurpose || session.revokedAt || new Date(session.expiresAt) <= new Date() || !safeEqual(session.tokenHash, hashToken(secret))) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401, code: "unauthorized" });
  }
  return session;
}
const ADVISOR_SESSION = Object.freeze({ table: "advisor_sessions", ownerField: "coachId", prefix: "as_", cookieName: "jingeehas_advisor" });
const ADMIN_SESSION = Object.freeze({ table: "admin_sessions", ownerField: "adminId", prefix: "ads_", cookieName: "jingeehas_admin" });

module.exports = { hashPassword, verifyPassword, roleCookie, createRoleSession, authenticateRole, ADVISOR_SESSION, ADMIN_SESSION };
