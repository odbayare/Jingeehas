import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { bootstrapAdmin } from "./bootstrap-admin.mjs";

const require = createRequire(import.meta.url);
const { RestDatabaseAdapter } = require("../netlify/functions/_lib/store.js");
const { normalizeEmail } = require("../netlify/functions/_lib/recovery.js");
const CONFIRMATION = "ROTATE EXISTING JINGEEHAS ADMIN";

function sessionId(cookie = "") {
  const value = String(cookie).split(";", 1)[0].split("=", 2)[1] || "";
  return decodeURIComponent(value).split(".", 1)[0];
}

async function request(route, options = {}) {
  const response = await fetch(`https://jingeehas.fit${route}`, { ...options, signal: AbortSignal.timeout(8000) });
  return { status: response.status, cookie: response.headers.get("set-cookie") || "" };
}

export async function rotateAndCertify(database, email, password, evidence = {}) {
  const before = await database.find("admin_accounts", { status: "active" });
  if (before.length !== 1 || before[0].email !== email) throw new Error("Exactly one matching active administrator is required");
  const admin = before[0];
  const priorSessions = await database.find("admin_sessions", { adminId: admin.id });
  const auditBefore = await database.find("admin_audit_logs", { adminId: admin.id });

  await bootstrapAdmin({ database, email, password, apply: true, rotate: true, confirmation: CONFIRMATION });

  const rotated = await database.get("admin_accounts", admin.id);
  if (!rotated || rotated.id !== admin.id || rotated.email !== admin.email || rotated.status !== admin.status || rotated.createdAt !== admin.createdAt) {
    throw new Error("Administrator identity metadata changed during rotation");
  }
  evidence.rotation = true;
  for (const session of priorSessions) {
    const revoked = await database.get("admin_sessions", session.id);
    if (!revoked?.revokedAt) throw new Error("Existing administrator session was not revoked");
  }
  const auditAfter = await database.find("admin_audit_logs", { adminId: admin.id });
  const rotationAudits = auditAfter.filter(row => row.action === "admin_password_rotated" && row.targetId === admin.id);
  if (auditAfter.length !== auditBefore.length + 1 || !rotationAudits.length) throw new Error("Rotation audit record is missing");
  evidence.audit = true;

  const unauthenticated = await request("/.netlify/functions/admin-advisor-create", {
    method: "POST", headers: { "content-type": "application/json" }, body: "{}"
  });
  if (unauthenticated.status !== 401) throw new Error("Unauthenticated admin route was not rejected");

  const loginBody = JSON.stringify({ email, password });
  const login = await request("/.netlify/functions/admin-login", {
    method: "POST", headers: { "content-type": "application/json" }, body: loginBody
  });
  const logoutId = sessionId(login.cookie);
  if (login.status !== 200 || !logoutId) throw new Error("Administrator login failed after rotation");
  evidence.login = true;

  let expiredId = "";
  let restored = false;
  try {
    const logout = await request("/.netlify/functions/admin-logout", {
      method: "POST", headers: { cookie: login.cookie.split(";", 1)[0] }, body: "{}"
    });
    if (logout.status !== 200) throw new Error("Administrator logout failed");
    const revoked = await request("/.netlify/functions/admin-advisor-create", {
      method: "POST", headers: { "content-type": "application/json", cookie: login.cookie.split(";", 1)[0] }, body: "{}"
    });
    if (revoked.status !== 401) throw new Error("Revoked administrator session was not rejected");

    const expiredLogin = await request("/.netlify/functions/admin-login", {
      method: "POST", headers: { "content-type": "application/json" }, body: loginBody
    });
    expiredId = sessionId(expiredLogin.cookie);
    if (expiredLogin.status !== 200 || !expiredId) throw new Error("Expired-session fixture could not be created");
    const expiredSession = await database.get("admin_sessions", expiredId);
    const expiredAt = new Date(new Date(expiredSession.createdAt).getTime() + 1).toISOString();
    await database.update("admin_sessions", expiredId, { expiresAt: expiredAt });
    const expired = await request("/.netlify/functions/admin-advisor-create", {
      method: "POST", headers: { "content-type": "application/json", cookie: expiredLogin.cookie.split(";", 1)[0] }, body: "{}"
    });
    if (expired.status !== 401) throw new Error("Expired administrator session was not rejected");
    evidence.sessions = true;

    await database.update("admin_accounts", admin.id, { status: "disabled", updatedAt: new Date().toISOString() });
    const disabled = await request("/.netlify/functions/admin-login", {
      method: "POST", headers: { "content-type": "application/json" }, body: loginBody
    });
    if (disabled.status !== 401) throw new Error("Disabled administrator login was not rejected");
    await database.update("admin_accounts", admin.id, { status: "active", updatedAt: new Date().toISOString() });
    restored = true;

    const active = await database.find("admin_accounts", { status: "active" });
    if (active.length !== 1 || active[0].id !== admin.id) throw new Error("Active administrator uniqueness check failed");
    evidence.activeAdminCount = active.length;
    return { activeAdminCount: active.length };
  } finally {
    if (!restored) await database.update("admin_accounts", admin.id, { status: "active", updatedAt: new Date().toISOString() }).catch(() => {});
    for (const id of [logoutId, expiredId].filter(Boolean)) await database.delete("admin_sessions", id).catch(() => {});
  }
}

async function main() {
  const database = new RestDatabaseAdapter();
  const evidence = { rotation: false, login: false, sessions: false, audit: false, activeAdminCount: 0 };
  try {
    if (process.argv.length !== 2) throw new Error("Command-line credentials are forbidden");
    const input = fs.readFileSync(0, "utf8").split(/\r?\n/);
    const email = normalizeEmail(input.shift() || "");
    const password = input.join("\n").replace(/[\r\n]+$/, "");
    if (!email || !password) throw new Error("Interactive credentials are required");
    await rotateAndCertify(database, email, password, evidence);
  } catch {
    const active = await database.find("admin_accounts", { status: "active" }).catch(() => []);
    evidence.activeAdminCount = active.length;
    process.exitCode = 1;
  }
  console.log(`ADMIN PASSWORD ROTATION: ${evidence.rotation ? "PASS" : "FAIL"}`);
  console.log(`ADMIN LOGIN: ${evidence.login ? "PASS" : "FAIL"}`);
  console.log(`SESSION REVOCATION: ${evidence.sessions ? "PASS" : "FAIL"}`);
  console.log(`AUDIT LOG: ${evidence.audit ? "PASS" : "FAIL"}`);
  console.log(`ACTIVE ADMIN COUNT: ${evidence.activeAdminCount}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
