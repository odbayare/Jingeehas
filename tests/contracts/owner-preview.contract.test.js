"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter } = require("../support/memory-database.js");
const { setDatabaseForTests } = require("../../netlify/functions/_lib/store.js");
const { hashPassword, authenticateRole, ADMIN_SESSION } = require("../../netlify/functions/_lib/auth.js");
const { adminLogin } = require("../../netlify/functions/_lib/advisor.js");
const { createOwnerPreview, authenticateOwnerPreview } = require("../../netlify/functions/_lib/preview.js");
const { createSession } = require("../../netlify/functions/_lib/session.js");

const database = new MemoryDatabaseAdapter();
setDatabaseForTests(database);
const sessionStart = require("../../netlify/functions/weight-session-start.js").handler;
const previewStart = require("../../netlify/functions/admin-preview-start.js").handler;
const previewStatus = require("../../netlify/functions/admin-preview-status.js").handler;
const previewRevoke = require("../../netlify/functions/admin-preview-revoke.js").handler;
const adminLogout = require("../../netlify/functions/admin-logout.js").handler;
const qpayCreate = require("../../netlify/functions/qpay-create-invoice.js").handler;
const assessmentReport = require("../../netlify/functions/weight-assessment-report.js").handler;

function credential(setCookie) { return String(setCookie).split(";")[0]; }
function event(method, cookie = "", body = null) { return { httpMethod: method, headers: { cookie }, body: body == null ? null : JSON.stringify(body) }; }

(async () => {
  const now = new Date("2026-07-17T00:00:00.000Z");
  await database.insert("admin_accounts", { id: "owner-admin", email: "owner@example.com", passwordHash: hashPassword("owner-password-strong"), status: "active", isOwner: true, createdAt: now.toISOString() });
  await database.insert("admin_accounts", { id: "other-admin", email: "other@example.com", passwordHash: hashPassword("other-password-strong"), status: "active", isOwner: false, createdAt: now.toISOString() });
  const owner = await adminLogin(database, "owner@example.com", "owner-password-strong");
  const nonOwner = await adminLogin(database, "other@example.com", "other-password-strong");
  const ownerCookie = credential(owner.cookie);
  const nonOwnerCookie = credential(nonOwner.cookie);
  const existingUser = await createSession(database, now);
  const existingUserCookie = credential(existingUser.cookie);
  await database.insert("assessments", { id: "wa-resumable", sessionId: existingUser.session.id, safetyCheckId: "sc-resumable", status: "draft", reportMode: null, safetyRoute: null, createdAt: now.toISOString(), updatedAt: now.toISOString(), completedAt: null });

  // Public/incognito and non-owner sessions cannot establish preview access.
  assert.equal((await sessionStart(event("POST"))).statusCode, 401);
  assert.equal((await qpayCreate(event("POST", "", { assessmentId: "public-attempt" }))).statusCode, 401);
  assert.equal((await assessmentReport({ httpMethod: "GET", headers: {}, queryStringParameters: { assessmentId: "public-attempt" } })).statusCode, 401);
  assert.equal((await previewStart(event("POST", nonOwnerCookie, {}))).statusCode, 403);

  // The owner creates a server-stored, HttpOnly two-hour preview session.
  const started = await previewStart(event("POST", `${ownerCookie}; ${existingUserCookie}`, {}));
  assert.equal(started.statusCode, 201);
  assert.equal(JSON.parse(started.body).resumeDraft, true);
  assert.equal(started.headers["set-cookie"].includes("jingeehas_session="), false, "starting a preview must not clear the resumable assessment session");
  const previewSetCookie = started.headers["set-cookie"];
  assert.match(previewSetCookie, /HttpOnly/);
  assert.match(previewSetCookie, /Secure/);
  assert.match(previewSetCookie, /SameSite=Strict/);
  const previewCookie = credential(previewSetCookie);
  const previewAccess = `${ownerCookie}; ${previewCookie}`;
  assert.equal((await previewStatus(event("GET", previewAccess))).statusCode, 200);
  assert.equal((await previewStatus(event("GET", `${nonOwnerCookie}; ${previewCookie}`))).statusCode, 401);

  // Tampering and attempting to reuse a preview token as an admin token both fail.
  const [previewName, previewValue] = previewCookie.split("=");
  assert.equal((await previewStatus(event("GET", `${ownerCookie}; ${previewName}=${previewValue}x`))).statusCode, 401);
  assert.equal((await previewStatus(event("GET", previewCookie))).statusCode, 401, "preview token alone is insufficient without its bound admin session cookie");
  await assert.rejects(() => authenticateRole(database, event("GET", `jingeehas_admin=${previewValue}`), ADMIN_SESSION), error => error.code === "unauthorized");

  // A second preview revokes the first; only one remains active.
  const second = await previewStart(event("POST", ownerCookie, {}));
  const secondPreviewCookie = credential(second.headers["set-cookie"]);
  const secondAccess = `${ownerCookie}; ${secondPreviewCookie}`;
  assert.equal((await previewStatus(event("GET", previewAccess))).statusCode, 401);
  assert.equal((await previewStatus(event("GET", secondAccess))).statusCode, 200);
  const previewRows = await database.find("admin_sessions", { adminId: "owner-admin", purpose: "preview" });
  assert.equal(previewRows.filter(row => !row.revokedAt).length, 1);

  // Preview is required before an ordinary assessment session can start.
  const userStarted = await sessionStart(event("POST", `${secondAccess}; ${existingUserCookie}`));
  assert.equal(userStarted.statusCode, 200);
  assert.equal(JSON.parse(userStarted.body).resumed, true);

  // Expiry is checked server-side.
  const activePreview = previewRows.find(row => !row.revokedAt);
  await database.update("admin_sessions", activePreview.id, { expiresAt: new Date(0).toISOString() });
  assert.equal((await previewStatus(event("GET", secondAccess))).statusCode, 401);

  // Explicit revocation blocks access.
  const third = await previewStart(event("POST", ownerCookie, {}));
  const thirdPreviewCookie = credential(third.headers["set-cookie"]);
  assert.equal((await previewRevoke(event("POST", ownerCookie, {}))).statusCode, 200);
  assert.equal((await previewStatus(event("GET", `${ownerCookie}; ${thirdPreviewCookie}`))).statusCode, 401);

  // Logout revokes the preview and its parent admin session.
  const fourth = await previewStart(event("POST", ownerCookie, {}));
  const fourthPreviewCookie = credential(fourth.headers["set-cookie"]);
  const logout = await adminLogout(event("POST", ownerCookie, {}));
  assert.equal(logout.statusCode, 200);
  assert.equal(logout.multiValueHeaders["set-cookie"].length, 2);
  assert.equal((await previewStatus(event("GET", `${ownerCookie}; ${fourthPreviewCookie}`))).statusCode, 401);

  // Direct library validation also rejects an expired parent session.
  const freshOwner = await adminLogin(database, "owner@example.com", "owner-password-strong");
  const direct = await createOwnerPreview(database, event("POST", credential(freshOwner.cookie)), now);
  const directCookie = `${credential(freshOwner.cookie)}; ${credential(direct.cookie)}`;
  await database.update("admin_sessions", freshOwner.id, { expiresAt: new Date(0).toISOString() });
  await assert.rejects(() => authenticateOwnerPreview(database, event("GET", directCookie), now), error => ["unauthorized", "preview_revoked"].includes(error.code));

  assert((await database.find("admin_audit_logs", { adminId: "owner-admin" })).some(row => row.action === "owner_preview_started"));
  console.log("owner preview access contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
