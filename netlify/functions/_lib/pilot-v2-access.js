"use strict";

const crypto = require("node:crypto");
const { authenticateRole, ADMIN_SESSION } = require("./auth.js");
const { safeEqual } = require("./crypto.js");

const AUDIENCE = "jingeehas-ai-pilot-v2.1";
function signingSecret(env = process.env) {
  const value = String(env.PILOT_V2_INVITE_SECRET || "");
  if (value.length < 32) throw Object.assign(new Error("Pilot access is unavailable"), { statusCode: 503, code: "pilot_unavailable" });
  return value;
}
function subjectPepper(env = process.env) {
  const value = String(env.PILOT_V2_SUBJECT_HASH_PEPPER || "");
  if (value.length < 32) throw Object.assign(new Error("Pilot subject hashing is unavailable"), { statusCode: 503, code: "pilot_unavailable" });
  return value;
}
function encode(value) { return Buffer.from(JSON.stringify(value)).toString("base64url"); }
function signPayload(payload, env = process.env) {
  const body = encode(payload);
  return `${body}.${crypto.createHmac("sha256", signingSecret(env)).update(body).digest("base64url")}`;
}
function createInvite({ expiresAt, inviteId }, env = process.env) {
  const exp = Math.floor(new Date(expiresAt).getTime() / 1000);
  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000) || exp > Math.floor(Date.now() / 1000) + 7 * 86400) {
    throw Object.assign(new Error("Invalid pilot expiry"), { statusCode: 400, code: "invalid_expiry" });
  }
  return signPayload({ aud: AUDIENCE, exp, jti: String(inviteId) }, env);
}
function verifyInvite(token, env = process.env, now = new Date()) {
  const [body, signature, extra] = String(token || "").split(".");
  if (!body || !signature || extra) throw Object.assign(new Error("Unauthorized"), { statusCode: 401, code: "pilot_access_denied" });
  const expected = crypto.createHmac("sha256", signingSecret(env)).update(body).digest("base64url");
  if (!safeEqual(signature, expected)) throw Object.assign(new Error("Unauthorized"), { statusCode: 401, code: "pilot_access_denied" });
  let payload; try { payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); } catch { payload = null; }
  if (!payload || payload.aud !== AUDIENCE || !payload.jti || Number(payload.exp) <= Math.floor(now.getTime() / 1000)) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401, code: "pilot_access_denied" });
  }
  return payload;
}
function subjectHash(kind, id, env = process.env) {
  return crypto.createHmac("sha256", subjectPepper(env)).update(`${kind}:${id}`).digest("hex");
}
async function authorizePilot(database, event, env = process.env) {
  try {
    const session = await authenticateRole(database, event, ADMIN_SESSION);
    const admin = await database.get("admin_accounts", session.adminId);
    if (admin?.status === "active") return { kind: "admin", subjectHash: subjectHash("admin", session.adminId, env), owner: admin.isOwner === true };
  } catch (error) {
    if (!["unauthorized", "pilot_access_denied"].includes(error.code)) throw error;
  }
  const authorization = String(event.headers?.authorization || event.headers?.Authorization || "");
  const token = authorization.startsWith("Pilot ") ? authorization.slice(6) : "";
  const invite = verifyInvite(token, env);
  return { kind: "invite", subjectHash: subjectHash("invite", invite.jti, env), expiresAt: new Date(invite.exp * 1000).toISOString(), owner: false };
}
module.exports = { AUDIENCE, createInvite, verifyInvite, authorizePilot, subjectHash };
