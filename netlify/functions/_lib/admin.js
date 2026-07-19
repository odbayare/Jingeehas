"use strict";
const { randomId, randomToken } = require("./crypto.js");
const { hashPassword, authenticateRole, ADMIN_SESSION } = require("./auth.js");
const { normalizeEmail } = require("./recovery.js");

async function audit(database, adminId, action, targetId, details = {}, now = new Date()) {
  return database.insert("admin_audit_logs", { id: randomId("aal_"), adminId, action, targetType: "advisor_account", targetId, details, createdAt: now.toISOString() });
}
async function createAdvisor(database, event, input, now = new Date()) {
  const session = await authenticateRole(database, event, ADMIN_SESSION); const email = normalizeEmail(input.email);
  if (!email || !String(input.name || "").trim()) throw Object.assign(new Error("Invalid advisor"), { statusCode: 400, code: "invalid_advisor" });
  const existing = await database.find("advisor_accounts", { email }); if (existing.length) throw Object.assign(new Error("Advisor exists"), { statusCode: 409, code: "advisor_exists" });
  const commissionAmount = Number(input.commissionAmount); if (!Number.isInteger(commissionAmount) || commissionAmount < 0 || commissionAmount > 9900) throw Object.assign(new Error("Invalid commission"), { statusCode: 400, code: "invalid_commission" });
  const temporaryPassword = randomToken().slice(0, 20); const id = randomId("adv_");
  await database.insert("advisor_accounts", { id, email, name: String(input.name).trim().slice(0, 120), passwordHash: hashPassword(temporaryPassword),
    status: "active", forcePasswordChange: true, commissionAmount, createdAt: now.toISOString(), updatedAt: now.toISOString() });
  await audit(database, session.adminId, "advisor_created", id, { commissionAmount }, now);
  return { coachId: id, temporaryPassword };
}
async function updateAdvisor(database, event, input, now = new Date()) {
  const session = await authenticateRole(database, event, ADMIN_SESSION); const advisor = await database.get("advisor_accounts", input.coachId);
  if (!advisor) throw Object.assign(new Error("Advisor not found"), { statusCode: 404, code: "advisor_not_found" });
  const patch = { updatedAt: now.toISOString() }; let action = "advisor_updated";
  if (input.action === "status") { if (!new Set(["active", "suspended", "disabled"]).has(input.status)) throw Object.assign(new Error("Invalid status"), { statusCode: 400, code: "invalid_status" }); patch.status = input.status; action = "advisor_status_updated"; }
  else if (input.action === "commission") { const amount = Number(input.commissionAmount); if (!Number.isInteger(amount) || amount < 0 || amount > 9900) throw Object.assign(new Error("Invalid commission"), { statusCode: 400, code: "invalid_commission" }); patch.commissionAmount = amount; action = "advisor_commission_updated"; }
  else if (input.action === "reset_password") { const temporaryPassword = randomToken().slice(0, 20); patch.passwordHash = hashPassword(temporaryPassword); patch.forcePasswordChange = true; action = "advisor_password_reset"; await database.update("advisor_accounts", advisor.id, patch); await audit(database, session.adminId, action, advisor.id, {}, now); return { coachId: advisor.id, temporaryPassword }; }
  else throw Object.assign(new Error("Invalid action"), { statusCode: 400, code: "invalid_action" });
  await database.update("advisor_accounts", advisor.id, patch); await audit(database, session.adminId, action, advisor.id, patch, now);
  return { coachId: advisor.id, updated: true };
}
module.exports = { audit, createAdvisor, updateAdvisor };
