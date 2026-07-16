"use strict";
process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 4).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "advisor-test-pepper-value-at-least-32-characters";
const assert = require("node:assert/strict");
const { MemoryDatabaseAdapter } = require("../support/memory-database.js");
const { hashPassword } = require("../../netlify/functions/_lib/auth.js");
const { adminLogin, advisorLogin, createInvitation, resolveInvitation, recordConsent, accessAdvisorReport } = require("../../netlify/functions/_lib/advisor.js");
const { createAdvisor, updateAdvisor } = require("../../netlify/functions/_lib/admin.js");
const { createSession } = require("../../netlify/functions/_lib/session.js");
const { saveRecoveryContacts } = require("../../netlify/functions/_lib/recovery.js");
const { saveSafetyCheck } = require("../../netlify/functions/_lib/safety.js");
const { createAssessment } = require("../../netlify/functions/_lib/assessment.js");
const { PRODUCT } = require("../../netlify/functions/_lib/config.js");

function cookieEvent(cookie) { return { headers: { cookie: cookie.split(";")[0] } }; }

(async () => {
  const database = new MemoryDatabaseAdapter();
  await database.insert("admin_accounts", { id: "admin-1", email: "admin@example.com", passwordHash: hashPassword("admin-password-strong"), status: "active", createdAt: new Date().toISOString() });
  const admin = await adminLogin(database, "admin@example.com", "admin-password-strong");
  const created = await createAdvisor(database, cookieEvent(admin.cookie), { email: "advisor@example.com", name: "Нараа", commissionAmount: 4000 });
  assert.match(created.temporaryPassword, /^.{20}$/);
  const firstLogin = await advisorLogin(database, "advisor@example.com", created.temporaryPassword);
  assert.equal(firstLogin.forcePasswordChange, true);
  await assert.rejects(() => createInvitation(database, cookieEvent(firstLogin.cookie), { email: "client@example.com" }), error => error.code === "password_change_required");
  await database.update("advisor_accounts", created.coachId, { passwordHash: hashPassword("new-advisor-password"), forcePasswordChange: false });
  const advisor = await advisorLogin(database, "advisor@example.com", "new-advisor-password");

  const user = await createSession(database);
  await saveRecoveryContacts(database, user.session.id, { email: "client@example.com" });
  const declinedInvite = await createInvitation(database, cookieEvent(advisor.cookie), { email: "client@example.com", name: "Үйлчлүүлэгч" });
  const declinedResolved = await resolveInvitation(database, user.session.id, declinedInvite.inviteToken);
  const declined = await recordConsent(database, user.session.id, { coachClientId: declinedResolved.coachClientId, consent: false });
  assert.equal(declined.consentStatus, "consent_declined");
  await assert.rejects(() => resolveInvitation(database, user.session.id, declinedInvite.inviteToken), error => error.code === "invite_not_found");

  const acceptedInvite = await createInvitation(database, cookieEvent(advisor.cookie), { email: "client@example.com", name: "Үйлчлүүлэгч" });
  const resolved = await resolveInvitation(database, user.session.id, acceptedInvite.inviteToken);
  await recordConsent(database, user.session.id, { coachClientId: resolved.coachClientId, consent: true });
  const safety = await saveSafetyCheck(database, user.session.id, { age: 30, selfHarm: "Үгүй", acuteMedical: ["Аль нь ч үгүй"], compensatoryBehavior: "Үгүй", medicalSuitability: "Үргэлжлүүлэхэд тохиромжтой" });
  const contacts = await database.find("recovery_contacts", { sessionId: user.session.id });
  const assessment = await createAssessment(database, user.session.id, { safetyCheckId: safety.safetyCheckId, recoveryContactGroupId: contacts[0].contactGroupId, coachClientId: resolved.coachClientId });
  await database.update("assessments", assessment.id, { status: "complete", reportMode: "sufficient" });
  await database.insert("payments", { id: "advisor-payment", sessionId: user.session.id, assessmentId: assessment.id, productCode: PRODUCT.code, amount: PRODUCT.amount, status: "paid" });
  await database.insert("entitlements", { id: `${assessment.id}:${PRODUCT.code}`, sessionId: user.session.id, assessmentId: assessment.id, paymentId: "advisor-payment", productCode: PRODUCT.code, status: "active", grantedAt: new Date().toISOString() });
  await database.insert("report_snapshots", { id: assessment.id, assessmentId: assessment.id, sessionId: user.session.id, reportMode: "sufficient", safetyRoute: null, fullReport: { sections: [], evidence: [{ questionId: "Q-HUNGER", text: "Түүхий хариулт" }] }, initialView: {}, createdAt: new Date().toISOString() });

  const report = await accessAdvisorReport(database, cookieEvent(advisor.cookie), assessment.id);
  assert.deepEqual(report.fullReport, { sections: [] });
  assert(!Object.hasOwn(report.fullReport, "evidence"));
  assert(!Object.hasOwn(report, "answers"));
  await assert.rejects(() => accessAdvisorReport(database, { headers: { authorization: created.coachId } }, assessment.id), error => error.code === "unauthorized");
  await recordConsent(database, user.session.id, { coachClientId: resolved.coachClientId, consent: false });
  await assert.rejects(() => accessAdvisorReport(database, cookieEvent(advisor.cookie), assessment.id), error => error.code === "report_forbidden");
  assert.equal((await database.find("advisor_report_access_logs", { assessmentId: assessment.id })).length, 2);

  await assert.rejects(() => updateAdvisor(database, cookieEvent(admin.cookie), { coachId: created.coachId, action: "commission", commissionAmount: 10000 }), error => error.code === "invalid_commission");
  const reset = await updateAdvisor(database, cookieEvent(admin.cookie), { coachId: created.coachId, action: "reset_password" });
  assert.match(reset.temporaryPassword, /^.{20}$/);
  assert((await database.find("admin_audit_logs", { adminId: "admin-1" })).length >= 2);
  console.log("advisor and admin authentication contract tests passed");
})().catch(error => { console.error(error); process.exit(1); });
