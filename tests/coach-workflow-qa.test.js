const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;

function visibleText(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function createCoachWithClient({ coachEmail = "qa-coach@example.com", clientEmail = "qa-client@example.com" } = {}) {
  const created = mockBackend.createCoachAccount({
    email: coachEmail,
    displayName: "QA Coach"
  });
  const login = mockBackend.loginCoach(coachEmail, created.temporaryPassword);
  const client = mockBackend.createCoachClient(login.session.token, {
    clientEmail,
    clientName: "QA Client",
    note: "internal demo"
  });
  return { created, login, client };
}

function paidAssessment({ coachId, coachClientId, clientEmail, shareWithCoach = true, reportMode = "mode1", reportText = "Хэрэглэгчийн бүрэн тайлан" }) {
  const assessment = mockBackend.createAssessment("one_time", {
    coachId,
    coachClientId,
    userEmail: clientEmail,
    shareWithCoach
  });
  mockBackend.linkAssessmentToCoach(assessment.id, {
    coachClientId,
    userEmail: clientEmail,
    shareWithCoach
  });
  mockBackend.completeAssessment(assessment.id, {
    report_mode: reportMode,
    safety_mode: reportMode,
    report_text: reportText
  });
  const payment = mockBackend.createMockPayment("one_time", assessment.id, {
    coachId,
    coachClientId,
    userEmail: clientEmail
  });
  mockBackend.markMockPaymentPaid(payment.id);
  return { assessment, payment };
}

function run() {
  mockBackend.resetMockBackend();

  const { created, login, client } = createCoachWithClient();
  assert(created.temporaryPassword, "admin should receive one-time temporary password");
  assert.notStrictEqual(created.coach.password_hash, created.temporaryPassword, "temporary password must not be stored raw");
  assert.strictEqual(created.coach.status, "active");
  assert.strictEqual(created.coach.commission_mnt, 4000);
  assert.strictEqual(login.coach.role, "coach");

  mockBackend.setCoachStatus(created.coach.id, "disabled");
  assert.throws(() => mockBackend.loginCoach("qa-coach@example.com", created.temporaryPassword), /Invalid coach login/);
  mockBackend.setCoachStatus(created.coach.id, "active");

  assert.strictEqual(client.client.client_email_normalized, "qa-client@example.com");
  assert.strictEqual(client.client.status, "invited");
  assert.throws(() => mockBackend.createCoachClient(login.session.token, { clientEmail: " QA-CLIENT@EXAMPLE.COM " }), /already exists/);

  const secondCoach = mockBackend.createCoachAccount({ email: "other-coach@example.com", displayName: "Other Coach" });
  const secondLogin = mockBackend.loginCoach("other-coach@example.com", secondCoach.temporaryPassword);
  assert.strictEqual(mockBackend.listCoachClients(secondLogin.session.token).length, 0, "coach dashboard must be scoped to own clients");

  const invite = mockBackend.resolveCoachInvitation({ inviteToken: client.inviteToken });
  assert.strictEqual(invite.matched, true);
  assert.strictEqual(invite.price_mnt, 9900);
  assert.strictEqual(mockBackend.resolveCoachInvitation({ email: "standard@example.com" }).price_mnt, 29000);

  _internal.setTestState({
    packageType: "one-time",
    view: "oneTimeStart",
    oneTimePaid: false,
    coachInviteToken: client.inviteToken,
    coachDiscountConsent: false,
    stageAnswers: {},
    diaryEntries: []
  });
  const inviteCopy = visibleText(_internal.renderOneTimeStart());
  assert(inviteCopy.includes("Үндсэн үнэ 29,000₮"));
  assert(inviteCopy.includes("Coach-ийн хөнгөлөлттэй үнэ 9,900₮"));
  assert(inviteCopy.includes("тайланг QA Coach өөрийн dashboard-оос харах боломжтой"));
  assert(inviteCopy.includes("зөвшөөрч байна"));

  const declined = mockBackend.acceptCoachInvitation({ coachClientId: client.client.id, consent: false });
  assert.strictEqual(declined.price_mnt, 29000);
  const declinedPaid = paidAssessment({
    coachId: created.coach.id,
    coachClientId: client.client.id,
    clientEmail: "qa-client@example.com",
    shareWithCoach: false,
    reportText: "Нууц тайлан"
  });
  const declinedView = mockBackend.viewCoachReport(login.session.token, declinedPaid.assessment.id);
  assert.strictEqual(declinedView.allowed, false);
  assert(declinedView.reason.includes("зөвшөөрөөгүй"));

  const consentClient = mockBackend.createCoachClient(login.session.token, { clientEmail: "consent@example.com" });
  const accepted = mockBackend.acceptCoachInvitation({ coachClientId: consentClient.client.id, consent: true });
  assert.strictEqual(accepted.price_mnt, 9900);
  const paid = paidAssessment({
    coachId: created.coach.id,
    coachClientId: consentClient.client.id,
    clientEmail: "consent@example.com",
    reportText: "Дотоод түлхүүргүй хэрэглэгчид харагдах тайлан"
  });
  const stateAfterPaid = mockBackend.getMockBackendState();
  const commissionRows = stateAfterPaid.coachCommissionLedger.filter(row => row.payment_id === paid.payment.id);
  assert.strictEqual(commissionRows.length, 1);
  assert.strictEqual(commissionRows[0].commission_mnt, 4000);
  assert.strictEqual(commissionRows[0].platform_share_mnt, 5900);
  mockBackend.markMockPaymentPaid(paid.payment.id);
  assert.strictEqual(mockBackend.getMockBackendState().coachCommissionLedger.filter(row => row.payment_id === paid.payment.id).length, 1);

  const allowedView = mockBackend.viewCoachReport(login.session.token, paid.assessment.id);
  assert.strictEqual(allowedView.allowed, true);
  assert(!/primary_mechanism|secondary_mechanisms_json|reward|trigger|pattern/.test(allowedView.report_text));
  assert.strictEqual(mockBackend.viewCoachReport(secondLogin.session.token, paid.assessment.id).allowed, false);

  const unpaidAssessment = mockBackend.createAssessment("one_time", {
    coachId: created.coach.id,
    coachClientId: consentClient.client.id,
    userEmail: "unpaid@example.com",
    shareWithCoach: true
  });
  mockBackend.completeAssessment(unpaidAssessment.id, { report_text: "Unpaid report" });
  assert(mockBackend.viewCoachReport(login.session.token, unpaidAssessment.id).reason.includes("Төлбөр баталгаажаагүй"));

  const incompleteAssessment = mockBackend.createAssessment("one_time", {
    coachId: created.coach.id,
    coachClientId: consentClient.client.id,
    userEmail: "incomplete@example.com",
    shareWithCoach: true
  });
  const incompletePayment = mockBackend.createMockPayment("one_time", incompleteAssessment.id, {
    coachId: created.coach.id,
    coachClientId: consentClient.client.id,
    userEmail: "incomplete@example.com"
  });
  mockBackend.markMockPaymentPaid(incompletePayment.id);
  assert(mockBackend.viewCoachReport(login.session.token, incompleteAssessment.id).reason.includes("Тайлан хараахан гараагүй"));

  const mode3 = paidAssessment({
    coachId: created.coach.id,
    coachClientId: consentClient.client.id,
    clientEmail: "mode3qa@example.com",
    reportMode: "mode3",
    reportText: "Мэргэжлийн хүнтэй ярилцах товч нэгтгэл"
  });
  const mode3View = mockBackend.viewCoachReport(login.session.token, mode3.assessment.id);
  assert.strictEqual(mode3View.allowed, true);
  assert(!mode3View.report_text.includes("14 хоногийн туршилт"));

  const mode4 = paidAssessment({
    coachId: created.coach.id,
    coachClientId: consentClient.client.id,
    clientEmail: "mode4qa@example.com",
    reportMode: "mode4",
    reportText: "private urgent details"
  });
  const mode4View = mockBackend.viewCoachReport(login.session.token, mode4.assessment.id);
  assert.strictEqual(mode4View.allowed, false);
  assert(mode4View.reason.includes("дэлгэрэнгүй тайлан coach dashboard дээр харагдахгүй"));
  assert(!mode4View.reason.includes("private urgent details"));

  const dashboard = mockBackend.getCoachDashboard(login.session.token);
  assert.strictEqual(dashboard.summary.addedClientsCount, 2);
  assert(dashboard.summary.paidClientsCount >= 1);
  assert(dashboard.summary.completedReportsCount >= 3);
  assert(dashboard.summary.totalPaidAmountMnt >= 9900);
  assert(dashboard.summary.coachCommissionTotalMnt >= 4000);
  assert(dashboard.summary.pendingPayoutMnt >= 4000);

  _internal.setTestState({ internalTest: true, adminCoachForm: { email: "", name: "", phone: "", commissionMnt: "4000" } });
  assert(visibleText(_internal.renderAdminCoach()).includes("Coach / Дэд админ"));
  _internal.setTestState({ internalTest: false });
  assert(!visibleText(_internal.renderAdminCoach()).includes("Coach / Дэд админ"));

  const root = path.join(__dirname, "..");
  const redirects = fs.readFileSync(path.join(root, "_redirects"), "utf8");
  const qaDoc = fs.readFileSync(path.join(root, "audits/sprint-28-coach-workflow-qa.md"), "utf8");
  const demoGuide = fs.readFileSync(path.join(root, "COACH_INTERNAL_DEMO_GUIDE.md"), "utf8");
  assert(redirects.includes("/coach/* /index.html 200"));
  assert(redirects.includes("/admin/* /index.html 200"));
  assert(qaDoc.includes("PASS: 14"));
  assert(demoGuide.includes("QPay идэвхжээгүй"));
  assert(demoGuide.includes("mock/internal prototype"));
}

run();
console.log("coach-workflow-qa tests passed");
