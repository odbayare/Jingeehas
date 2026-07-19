"use strict";
const { publicReport } = require("./report.js");
const { resolveReportSnapshot } = require("./report-snapshots.js");

const { randomId, randomToken, hashToken } = require("./crypto.js");
const { hashPassword, verifyPassword, createRoleSession, authenticateRole, ADVISOR_SESSION, ADMIN_SESSION } = require("./auth.js");
const { contactHash, normalizeEmail } = require("./recovery.js");
function advisorStatusLabel(status) { return ({ invited: "Урилга илгээсэн", consent_accepted: "Зөвшөөрсөн", consent_declined: "Зөвшөөрөөгүй", assessment_created: "Тест эхэлсэн" })[status] || "Хүлээгдэж байна"; }

async function advisorLogin(database, email, password) {
  const normalized = normalizeEmail(email); const rows = normalized ? await database.find("advisor_accounts", { email: normalized }) : [];
  const advisor = rows[0];
  if (!advisor || advisor.status !== "active" || !verifyPassword(password, advisor.passwordHash)) throw Object.assign(new Error("Invalid login"), { statusCode: 401, code: "invalid_login" });
  const session = await createRoleSession(database, { ...ADVISOR_SESSION, ownerId: advisor.id });
  return { coachId: advisor.id, name: advisor.name, forcePasswordChange: advisor.forcePasswordChange, ...session };
}
async function adminLogin(database, email, password) {
  const rows = await database.find("admin_accounts", { email: normalizeEmail(email) }); const admin = rows[0];
  if (!admin || admin.status !== "active" || !verifyPassword(password, admin.passwordHash)) throw Object.assign(new Error("Invalid login"), { statusCode: 401, code: "invalid_login" });
  const session = await createRoleSession(database, { ...ADMIN_SESSION, ownerId: admin.id });
  return { adminId: admin.id, owner: admin.isOwner === true, ...session };
}
async function createInvitation(database, event, input, now = new Date()) {
  const session = await authenticateRole(database, event, ADVISOR_SESSION); const advisor = await database.get("advisor_accounts", session.coachId);
  if (advisor.forcePasswordChange) throw Object.assign(new Error("Password change required"), { statusCode: 403, code: "password_change_required" });
  const email = normalizeEmail(input.email); if (!email) throw Object.assign(new Error("Invalid email"), { statusCode: 400, code: "invalid_email" });
  const token = randomToken("invite_"); const id = randomId("ac_");
  await database.insert("advisor_clients", { id, coachId: advisor.id, name: String(input.name || "").slice(0, 120),
    expectedContactHash: contactHash("email", email), inviteHash: hashToken(token), inviteExpiresAt: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(),
    inviteUsedAt: null, resolvedSessionId: null, consentStatus: "pending", consentVersion: null, consentAt: null,
    assessmentId: null, commissionAmount: Number(advisor.commissionAmount || 4000), status: "invited", createdAt: now.toISOString() });
  return { coachClientId: id, inviteToken: token, advisorName: advisor.name || "Зөвлөх", expiresAt: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString() };
}
async function resolveInvitation(database, sessionId, token, now = new Date()) {
  const rows = await database.find("advisor_clients", { inviteHash: hashToken(token) }); const client = rows[0];
  if (!client || client.inviteUsedAt || new Date(client.inviteExpiresAt) <= now) throw Object.assign(new Error("Invalid invitation"), { statusCode: 404, code: "invite_not_found" });
  const contacts = await database.find("recovery_contacts", { sessionId, type: "email", contactHash: client.expectedContactHash });
  if (!contacts.length) throw Object.assign(new Error("Verified contact required"), { statusCode: 403, code: "invite_identity_unverified" });
  const advisor = await database.get("advisor_accounts", client.coachId);
  await database.update("advisor_clients", client.id, { inviteUsedAt: now.toISOString(), resolvedSessionId: sessionId, status: "resolved", updatedAt: now.toISOString() });
  return { coachClientId: client.id, coachId: client.coachId, advisorName: advisor?.name || "Зөвлөх", consentStatus: client.consentStatus };
}
async function recordConsent(database, sessionId, input, now = new Date()) {
  const client = await database.get("advisor_clients", input.coachClientId);
  if (!client || client.resolvedSessionId !== sessionId) throw Object.assign(new Error("Invitation not found"), { statusCode: 404, code: "invite_not_found" });
  const accepted = input.consent === true;
  const consentStatus = accepted ? "consent_accepted" : "consent_declined";
  await database.update("advisor_clients", client.id, { consentStatus, consentVersion: "2026-07-16", consentAt: now.toISOString(), status: consentStatus, updatedAt: now.toISOString() });
  return { coachClientId: client.id, consentStatus };
}
async function accessAdvisorReport(database, event, assessmentId, now = new Date()) {
  const session = await authenticateRole(database, event, ADVISOR_SESSION); const assessment = await database.get("assessments", assessmentId);
  const client = assessment?.coachClientId ? await database.get("advisor_clients", assessment.coachClientId) : null;
  const entitlement = assessment ? (await database.find("entitlements", { assessmentId, status: "active" }))[0] : null;
  const snapshot = assessment ? await resolveReportSnapshot(database, assessmentId) : null;
  let reason = "allowed";
  if (!client || client.coachId !== session.coachId) reason = "wrong_advisor";
  else if (client.consentStatus !== "consent_accepted") reason = "consent_missing";
  else if (!entitlement) reason = "payment_unconfirmed";
  else if (!snapshot || assessment.status !== "complete") reason = "report_incomplete";
  else if (assessment.safetyRoute) reason = "safety_restricted";
  await database.insert("advisor_report_access_logs", { id: randomId("arl_"), coachId: session.coachId, assessmentId, allowed: reason === "allowed", reason, createdAt: now.toISOString() });
  if (reason !== "allowed") throw Object.assign(new Error("Report forbidden"), { statusCode: 403, code: "report_forbidden" });
  return { assessmentId, fullReport: publicReport(snapshot.fullReport), reportVersion: snapshot.snapshotMetadata };
}
async function advisorDashboard(database, event) {
  const session = await authenticateRole(database, event, ADVISOR_SESSION); const clients = await database.find("advisor_clients", { coachId: session.coachId });
  const commissions = await database.find("advisor_commissions", { coachId: session.coachId });
  const paid = commissions.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  return { coachId: session.coachId, clients: clients.map(client => ({ coachClientId: client.id, name: client.name,
    status: advisorStatusLabel(client.status),
    assessmentId: client.assessmentId })), totals: { clientPayments: clients.filter(client => client.assessmentId).length * 9900,
    commissionTotal: paid, commissionPending: commissions.filter(row => row.status === "pending").reduce((sum, row) => sum + Number(row.amount), 0),
    commissionPaid: commissions.filter(row => row.status === "paid").reduce((sum, row) => sum + Number(row.amount), 0) } };
}

module.exports = { advisorStatusLabel, advisorLogin, adminLogin, createInvitation, resolveInvitation, recordConsent, accessAdvisorReport, advisorDashboard };
