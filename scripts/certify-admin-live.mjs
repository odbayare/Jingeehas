import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { RestDatabaseAdapter } = require("../netlify/functions/_lib/store.js");
const { normalizeEmail } = require("../netlify/functions/_lib/recovery.js");

function argumentsFor(argv) {
  if (argv.some(value => value === "--password" || value.startsWith("--password="))) {
    throw new Error("Password command-line arguments are forbidden; use --password-stdin");
  }
  const options = { email: "", passwordStdin: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--email") options.email = String(argv[++index] || "");
    else if (value === "--password-stdin") options.passwordStdin = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (!options.passwordStdin) throw new Error("--password-stdin is required");
  options.email = normalizeEmail(options.email);
  if (!options.email) throw new Error("A valid explicit admin email is required");
  return options;
}

function sessionId(cookie = "") {
  const value = String(cookie).split(";", 1)[0].split("=", 2)[1] || "";
  return decodeURIComponent(value).split(".", 1)[0];
}

async function request(origin, route, options = {}) {
  const response = await fetch(`${origin}${route}`, { ...options, signal: AbortSignal.timeout(8000) });
  return { status: response.status, cookie: response.headers.get("set-cookie") || "" };
}

export async function certifyAdminLive({ database, email, password, origin = "https://jingeehas.fit" }) {
  const active = await database.find("admin_accounts", { status: "active" });
  if (active.length !== 1 || active[0].email !== email) throw new Error("Exactly one matching active administrator is required");
  const admin = active[0];
  const audits = await database.find("admin_audit_logs", { adminId: admin.id });
  if (!audits.some(row => row.action === "initial_admin_created")) throw new Error("Initial administrator audit record is missing");

  const unauthenticated = await request(origin, "/.netlify/functions/admin-advisor-create", {
    method: "POST", headers: { "content-type": "application/json" }, body: "{}"
  });
  if (unauthenticated.status !== 401) throw new Error("Unauthenticated admin route was not rejected");

  const loginBody = JSON.stringify({ email, password });
  const login = await request(origin, "/.netlify/functions/admin-login", {
    method: "POST", headers: { "content-type": "application/json" }, body: loginBody
  });
  if (login.status !== 200 || !login.cookie) throw new Error("Administrator login failed");

  const expiredLogin = await request(origin, "/.netlify/functions/admin-login", {
    method: "POST", headers: { "content-type": "application/json" }, body: loginBody
  });
  const expiredId = sessionId(expiredLogin.cookie);
  if (expiredLogin.status !== 200 || !expiredId) throw new Error("Expired-session fixture could not be created");

  let restored = false;
  try {
    await database.update("admin_sessions", expiredId, { expiresAt: new Date(0).toISOString() });
    const expired = await request(origin, "/.netlify/functions/admin-advisor-create", {
      method: "POST", headers: { "content-type": "application/json", cookie: expiredLogin.cookie.split(";", 1)[0] }, body: "{}"
    });
    if (expired.status !== 401) throw new Error("Expired administrator session was not rejected");

    const logout = await request(origin, "/.netlify/functions/admin-logout", {
      method: "POST", headers: { cookie: login.cookie.split(";", 1)[0] }, body: "{}"
    });
    if (logout.status !== 200) throw new Error("Administrator logout failed");
    const afterLogout = await request(origin, "/.netlify/functions/admin-advisor-create", {
      method: "POST", headers: { "content-type": "application/json", cookie: login.cookie.split(";", 1)[0] }, body: "{}"
    });
    if (afterLogout.status !== 401) throw new Error("Logged-out administrator session remained usable");

    await database.update("admin_accounts", admin.id, { status: "disabled", updatedAt: new Date().toISOString() });
    const disabled = await request(origin, "/.netlify/functions/admin-login", {
      method: "POST", headers: { "content-type": "application/json" }, body: loginBody
    });
    if (disabled.status !== 401) throw new Error("Disabled administrator login was not rejected");
    await database.update("admin_accounts", admin.id, { status: "active", updatedAt: new Date().toISOString() });
    restored = true;

    for (const id of [expiredId, sessionId(login.cookie)].filter(Boolean)) await database.delete("admin_sessions", id);
    const duplicateCheck = await database.find("admin_accounts", { status: "active" });
    if (duplicateCheck.length !== 1 || duplicateCheck[0].id !== admin.id) throw new Error("Administrator uniqueness check failed");
    return { status: "PASS", realAdmin: true, login: true, logout: true, expiredSessionRejected: true,
      disabledAccountRejected: true, unauthenticatedRouteRejected: true, auditLog: true,
      forcePasswordChange: "not_applicable", duplicateActiveAdmin: false, plaintextPasswordRecorded: false };
  } finally {
    if (!restored) await database.update("admin_accounts", admin.id, { status: "active", updatedAt: new Date().toISOString() }).catch(() => {});
    await database.delete("admin_sessions", expiredId).catch(() => {});
  }
}

async function main() {
  try {
    const options = argumentsFor(process.argv.slice(2));
    const password = fs.readFileSync(0, "utf8").replace(/[\r\n]+$/, "");
    const result = await certifyAdminLive({ database: new RestDatabaseAdapter(), email: options.email, password });
    console.log("ADMIN_LIVE_CERTIFICATION_STATUS=PASS");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("ADMIN_LIVE_CERTIFICATION_STATUS=FAIL");
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
