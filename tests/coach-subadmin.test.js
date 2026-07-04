const assert = require("assert");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function paidCoachAssessment({ coachId, coachClientId, shareWithCoach = true, reportMode = "mode1", reportText = "Coach-visible report" }) {
  const assessment = mockBackend.createAssessment("one_time", {
    coachId,
    coachClientId,
    userEmail: "client@example.com",
    shareWithCoach
  });
  mockBackend.linkAssessmentToCoach(assessment.id, {
    coachClientId,
    userEmail: "client@example.com",
    shareWithCoach
  });
  mockBackend.completeAssessment(assessment.id, {
    status: "completed",
    report_mode: reportMode,
    safety_mode: reportMode,
    report_text: reportText
  });
  const payment = mockBackend.createMockPayment("one_time", assessment.id, {
    coachId,
    coachClientId,
    userEmail: "client@example.com"
  });
  mockBackend.markMockPaymentPaid(payment.id);
  return { assessment, payment };
}

function run() {
  mockBackend.resetMockBackend();

  const created = mockBackend.createCoachAccount({
    email: "Coach@Example.COM ",
    displayName: "Coach A",
    phone: "99110022"
  });
  assert(created.temporaryPassword, "temporary password should be returned once");
  assert.strictEqual(created.coach.email_normalized, "coach@example.com");
  assert.notStrictEqual(created.coach.password_hash, created.temporaryPassword, "raw password should not be stored");
  assert(created.coach.password_hash.startsWith("mock_hash_"), "password should be hashed");
  assert.strictEqual(created.coach.commission_mnt, 4000);

  const login = mockBackend.loginCoach("coach@example.com", created.temporaryPassword);
  assert(login.session.token, "coach login should return a session token");
  assert.strictEqual(login.coach.role, "coach");

  mockBackend.setCoachStatus(created.coach.id, "disabled");
  assert.throws(() => mockBackend.loginCoach("coach@example.com", created.temporaryPassword), /Invalid coach login/);
  mockBackend.setCoachStatus(created.coach.id, "active");

  const reset = mockBackend.resetCoachPassword(created.coach.id);
  const relogin = mockBackend.loginCoach("coach@example.com", reset.temporaryPassword);
  assert(relogin.session.token, "coach should log in after admin password reset");

  const clientResult = mockBackend.createCoachClient(relogin.session.token, {
    clientEmail: " Client@Example.COM ",
    clientName: "Client One",
    note: "spin class"
  });
  assert.strictEqual(clientResult.client.client_email_normalized, "client@example.com");
  assert(clientResult.inviteToken, "invite token should be generated");
  assert(clientResult.inviteLink.includes("coachInvite="));
  assert.throws(() => mockBackend.createCoachClient(relogin.session.token, { clientEmail: "client@example.com" }), /already exists/);

  const createdB = mockBackend.createCoachAccount({ email: "coach-b@example.com", displayName: "Coach B" });
  const loginB = mockBackend.loginCoach("coach-b@example.com", createdB.temporaryPassword);
  assert.strictEqual(mockBackend.listCoachClients(loginB.session.token).length, 0, "coach should not see another coach's clients");

  const noInvite = mockBackend.resolveCoachInvitation({ email: "other@example.com" });
  assert.strictEqual(noInvite.matched, false);
  assert.strictEqual(noInvite.price_mnt, 9900);

  const invite = mockBackend.resolveCoachInvitation({ inviteToken: clientResult.inviteToken });
  assert.strictEqual(invite.matched, true);
  assert.strictEqual(invite.price_mnt, 9900);
  assert.strictEqual(invite.coach.display_name, "Coach A");

  const declined = mockBackend.acceptCoachInvitation({ coachClientId: clientResult.client.id, consent: false });
  assert.strictEqual(declined.price_mnt, 9900);
  assert.strictEqual(declined.share_with_coach, false);
  let deniedSetup = paidCoachAssessment({
    coachId: created.coach.id,
    coachClientId: clientResult.client.id,
    shareWithCoach: false,
    reportText: "No consent report"
  });
  let denied = mockBackend.viewCoachReport(relogin.session.token, deniedSetup.assessment.id);
  assert.strictEqual(denied.allowed, false);
  assert(denied.reason.includes("зөвшөөрөөгүй"));

  const consentedClient = mockBackend.createCoachClient(relogin.session.token, { clientEmail: "second@example.com" });
  const accepted = mockBackend.acceptCoachInvitation({ coachClientId: consentedClient.client.id, consent: true });
  assert.strictEqual(accepted.price_mnt, 9900);
  assert.strictEqual(accepted.share_with_coach, true);

  const paid = paidCoachAssessment({
    coachId: created.coach.id,
    coachClientId: consentedClient.client.id,
    shareWithCoach: true,
    reportText: "Full consenting client report"
  });
  const paidStatus = mockBackend.getPaymentStatus(paid.payment.id);
  assert.strictEqual(paidStatus.payment.amount_mnt, 9900);
  assert.strictEqual(paidStatus.payment.base_price_mnt, 9900);
  assert.strictEqual(paidStatus.payment.discount_amount_mnt, 0);
  assert.strictEqual(paidStatus.payment.commission_mnt, 4000);

  mockBackend.markMockPaymentPaid(paid.payment.id);
  let backendState = mockBackend.getMockBackendState();
  assert.strictEqual(backendState.coachCommissionLedger.filter(row => row.payment_id === paid.payment.id).length, 1, "duplicate paid check should not duplicate commission");
  const commission = backendState.coachCommissionLedger.find(row => row.payment_id === paid.payment.id);
  assert.strictEqual(commission.commission_mnt, 4000);
  assert.strictEqual(commission.platform_share_mnt, 5900);
  assert.strictEqual(commission.status, "pending");

  const dashboard = mockBackend.getCoachDashboard(relogin.session.token);
  assert.strictEqual(dashboard.summary.totalPaidAmountMnt >= 9900, true);
  assert.strictEqual(dashboard.summary.coachCommissionTotalMnt >= 4000, true);
  assert.strictEqual(dashboard.summary.pendingPayoutMnt >= 4000, true);

  const allowed = mockBackend.viewCoachReport(relogin.session.token, paid.assessment.id);
  assert.strictEqual(allowed.allowed, true);
  assert.strictEqual(allowed.report_text, "Full consenting client report");
  const otherCoachDenied = mockBackend.viewCoachReport(loginB.session.token, paid.assessment.id);
  assert.strictEqual(otherCoachDenied.allowed, false);
  assert(otherCoachDenied.reason.includes("хамаарахгүй"));

  const mode3Client = mockBackend.createCoachClient(relogin.session.token, { clientEmail: "mode3@example.com" });
  mockBackend.acceptCoachInvitation({ coachClientId: mode3Client.client.id, consent: true });
  const mode3 = paidCoachAssessment({
    coachId: created.coach.id,
    coachClientId: mode3Client.client.id,
    shareWithCoach: true,
    reportMode: "mode3",
    reportText: "Эхлээд мэргэжлийн хүнтэй ярилцах товч нэгтгэл"
  });
  const mode3View = mockBackend.viewCoachReport(relogin.session.token, mode3.assessment.id);
  assert.strictEqual(mode3View.allowed, true);
  assert(mode3View.report_text.includes("мэргэжлийн хүнтэй"));
  assert(!mode3View.report_text.includes("14 хоногийн туршилт"));

  const mode4Client = mockBackend.createCoachClient(relogin.session.token, { clientEmail: "mode4@example.com" });
  mockBackend.acceptCoachInvitation({ coachClientId: mode4Client.client.id, consent: true });
  const mode4 = paidCoachAssessment({
    coachId: created.coach.id,
    coachClientId: mode4Client.client.id,
    shareWithCoach: true,
    reportMode: "mode4",
    reportText: "Urgent safety content"
  });
  const mode4View = mockBackend.viewCoachReport(relogin.session.token, mode4.assessment.id);
  assert.strictEqual(mode4View.allowed, false);
  assert(mode4View.reason.includes("coach цэсэнд харагдахгүй"));
  backendState = mockBackend.getMockBackendState();
  assert(backendState.coachReportAccessLogs.length >= 4, "report access should be logged");
  assert(backendState.auditLogs.some(row => row.action === "coach_report_view"), "report access should create audit log");

  mockBackend.refundMockPayment(paid.payment.id);
  backendState = mockBackend.getMockBackendState();
  assert.strictEqual(backendState.coachCommissionLedger.find(row => row.payment_id === paid.payment.id).status, "void");

  mockBackend.resetMockBackend();
  const uiCoach = mockBackend.createCoachAccount({ email: "ui-coach@example.com", displayName: "UI Coach" });
  const uiLogin = mockBackend.loginCoach("ui-coach@example.com", uiCoach.temporaryPassword);
  const uiClient = mockBackend.createCoachClient(uiLogin.session.token, { clientEmail: "ui-client@example.com" });

  _internal.setTestState({
    packageType: "one-time",
    view: "oneTimeStart",
    oneTimePaid: false,
    coachInviteToken: uiClient.inviteToken,
    coachDiscountConsent: false,
    contactCapture: {
      name: "Coach QA",
      phone: "99119911",
      email: "",
      saved: true,
      message: "",
      copyStatus: ""
    },
    stageAnswers: {},
    diaryEntries: []
  });
  let start = normalize(_internal.renderOneTimeStart());
  assert(start.includes("Coach-ийн урилга илэрлээ"));
  assert(start.includes("Coach-ийн хөнгөлөлттэй үнэ: 9,900₮"));
  assert(start.includes("зөвшөөрч байна"));

  _internal.acceptCoachDiscount();
  assert.strictEqual(_internal.getTestState().coachDiscountConsent, true);
  let paywall = normalize(_internal.renderReport());
  assert(paywall.includes("Coach-ийн хөнгөлөлттэй үнэ 9,900₮"));
  assert(paywall.includes("9,900₮ төлөөд бүрэн тайлангаа нээх"));

  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    coachInvite: null,
    coachDiscountConsent: false,
    contactCapture: {
      name: "Coach QA",
      phone: "99119911",
      email: "",
      saved: true,
      message: "",
      copyStatus: ""
    },
    stageAnswers: { "S1-C01": "33", "S1-S04": "Үгүй" },
    diaryEntries: []
  });
  paywall = normalize(_internal.renderReport());
  assert(paywall.includes("Төлөх үнэ 9,900₮"));
  assert(paywall.includes("9,900₮ төлөөд бүрэн тайлангаа нээх"));
  assert(!paywall.includes("Coach-ийн хөнгөлөлттэй үнэ 9,900₮"));

  _internal.setTestState({ internalTest: true, adminCoachForm: { email: "", name: "", phone: "", commissionMnt: "4000" } });
  assert(normalize(_internal.renderAdminCoach()).includes("Coach / Дэд админ"));
  _internal.setTestState({ internalTest: false });
  assert(!normalize(_internal.renderAdminCoach()).includes("Coach / Дэд админ"), "admin coach panel should not be public by default");

  _internal.setTestState({ coachSessionToken: uiLogin.session.token, coachClientForm: { email: "", name: "", note: "" } });
  assert(normalize(_internal.renderCoachDashboard()).includes("Үйлчлүүлэгч нэмэх"));
}

run();
console.log("coach-subadmin tests passed");
