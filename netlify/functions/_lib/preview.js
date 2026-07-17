"use strict";

const { randomId, randomToken, hashToken, safeEqual } = require("./crypto.js");
const { cookies } = require("./http.js");
const { authenticateRole, ADMIN_SESSION } = require("./auth.js");

const PREVIEW_COOKIE_NAME = "jingeehas_owner_preview";
const PREVIEW_SECONDS = 2 * 60 * 60;

function previewCookie(value, maxAge = PREVIEW_SECONDS) {
  return `${PREVIEW_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

async function ownerAdmin(database, adminId) {
  const admin = await database.get("admin_accounts", adminId);
  if (!admin || admin.status !== "active" || admin.isOwner !== true) {
    throw Object.assign(new Error("Owner access required"), { statusCode: 403, code: "owner_required" });
  }
  return admin;
}

async function authenticateOwnerAdmin(database, event) {
  const session = await authenticateRole(database, event, ADMIN_SESSION);
  await ownerAdmin(database, session.adminId);
  return session;
}

async function revokePreviewRows(database, filters, now = new Date()) {
  const rows = await database.find("admin_sessions", { ...filters, purpose: "preview" });
  let revoked = 0;
  for (const row of rows) {
    if (!row.revokedAt) {
      await database.update("admin_sessions", row.id, { revokedAt: now.toISOString() });
      revoked += 1;
    }
  }
  return revoked;
}

async function createOwnerPreview(database, event, now = new Date()) {
  const adminSession = await authenticateOwnerAdmin(database, event);
  await revokePreviewRows(database, { adminId: adminSession.adminId }, now);
  const id = randomId("ops_");
  const secret = randomToken();
  const expiresAt = new Date(now.getTime() + PREVIEW_SECONDS * 1000).toISOString();
  await database.insert("admin_sessions", {
    id, adminId: adminSession.adminId, tokenHash: hashToken(secret), purpose: "preview",
    parentSessionId: adminSession.id, expiresAt, revokedAt: null, createdAt: now.toISOString()
  });
  await database.insert("admin_audit_logs", {
    id: randomId("aal_"), adminId: adminSession.adminId, action: "owner_preview_started",
    targetType: "preview_session", targetId: id, details: { expiresAt }, createdAt: now.toISOString()
  });
  return { preview: { active: true, expiresAt }, cookie: previewCookie(`${id}.${secret}`) };
}

async function authenticateOwnerPreview(database, event, now = new Date()) {
  const credential = cookies(event)[PREVIEW_COOKIE_NAME] || "";
  const separator = credential.indexOf(".");
  const id = separator > 0 ? credential.slice(0, separator) : "";
  const secret = separator > 0 ? credential.slice(separator + 1) : "";
  const preview = id ? await database.get("admin_sessions", id) : null;
  const validToken = preview && preview.purpose === "preview" && !preview.revokedAt &&
    new Date(preview.expiresAt) > now && safeEqual(preview.tokenHash, hashToken(secret));
  if (!validToken) throw Object.assign(new Error("Preview access required"), { statusCode: 401, code: "preview_required" });
  const authenticatedAdminSession = await authenticateRole(database, event, ADMIN_SESSION);
  const parent = preview.parentSessionId ? await database.get("admin_sessions", preview.parentSessionId) : null;
  const validParent = parent && parent.purpose === "admin" && parent.adminId === preview.adminId &&
    parent.id === authenticatedAdminSession.id && !parent.revokedAt && new Date(parent.expiresAt) > now;
  if (!validParent) throw Object.assign(new Error("Preview access revoked"), { statusCode: 401, code: "preview_revoked" });
  await ownerAdmin(database, preview.adminId);
  return preview;
}

async function revokeOwnerPreview(database, event, now = new Date()) {
  const adminSession = await authenticateOwnerAdmin(database, event);
  const revoked = await revokePreviewRows(database, { adminId: adminSession.adminId }, now);
  await database.insert("admin_audit_logs", {
    id: randomId("aal_"), adminId: adminSession.adminId, action: "owner_preview_revoked",
    targetType: "admin_account", targetId: adminSession.adminId, details: { revoked }, createdAt: now.toISOString()
  });
  return { revoked };
}

module.exports = {
  PREVIEW_COOKIE_NAME, PREVIEW_SECONDS, previewCookie, ownerAdmin, authenticateOwnerAdmin,
  revokePreviewRows, createOwnerPreview, authenticateOwnerPreview, revokeOwnerPreview
};
