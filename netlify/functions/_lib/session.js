"use strict";

const { randomId, randomToken, hashToken, safeEqual } = require("./crypto.js");
const { cookies } = require("./http.js");

const COOKIE_NAME = "jingeehas_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;

function sessionCookie(value, maxAge = SESSION_SECONDS) {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

async function createSession(database, now = new Date()) {
  const id = randomId("ws_");
  const secret = randomToken();
  const expiresAt = new Date(now.getTime() + SESSION_SECONDS * 1000).toISOString();
  await database.insert("sessions", {
    id, tokenHash: hashToken(secret), createdAt: now.toISOString(), expiresAt, revokedAt: null
  });
  return { session: { id, expiresAt }, cookie: sessionCookie(`${id}.${secret}`) };
}

async function authenticateSession(database, event, required = true, now = new Date()) {
  const credential = cookies(event)[COOKIE_NAME] || "";
  const separator = credential.indexOf(".");
  const id = separator > 0 ? credential.slice(0, separator) : "";
  const secret = separator > 0 ? credential.slice(separator + 1) : "";
  const session = id ? await database.get("sessions", id) : null;
  const valid = session && !session.revokedAt && new Date(session.expiresAt) > now && safeEqual(session.tokenHash, hashToken(secret));
  if (!valid && required) throw Object.assign(new Error("Unauthorized"), { statusCode: 401, code: "unauthorized" });
  return valid ? session : null;
}

module.exports = { COOKIE_NAME, createSession, authenticateSession, sessionCookie };
