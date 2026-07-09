const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;
const root = path.join(__dirname, "..");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function setOneTime(overrides = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" }
    ],
    diaryEntries: [],
    ...overrides
  });
}

function setSevenDay(overrides = {}) {
  _internal.setTestState({
    packageType: "seven-day",
    view: "sevenDayStart",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" }
    ],
    stageAnswers: {},
    diaryEntries: [],
    ...overrides
  });
}

function run() {
  mockBackend.resetMockBackend();

  const session = mockBackend.startSession();
  assert(session.id.startsWith("sess_"), "startSession should create a session id");
  assert(session.anonymous_session_id.startsWith("anon_"), "startSession should create anonymous_session_id");

  const assessment = mockBackend.createAssessment("one_time");
  assert.strictEqual(assessment.session_id, session.id);
  assert.strictEqual(assessment.assessment_type, "one_time");
  assert.strictEqual(mockBackend.getMockBackendState().assessments.length, 1);

  mockBackend.saveAssessmentAnswers(assessment.id, { "S1-L01": "Бараг өдөр бүр" });
  mockBackend.completeAssessment(assessment.id, { report_mode: "mode1", report_text: "preview" });

  const oneTimePayment = mockBackend.createMockPayment("one_time", assessment.id);
  assert.strictEqual(oneTimePayment.amount_mnt, 9900);
  assert.strictEqual(oneTimePayment.status, "pending");
  assert.strictEqual(oneTimePayment.provider, "mock");

  const paidOneTime = mockBackend.markMockPaymentPaid(oneTimePayment.id);
  assert.strictEqual(paidOneTime.payment.status, "paid");
  assert(mockBackend.hasEntitlement("one_time_report", assessment.id), "paid one_time should create one_time_report entitlement");
  assert.strictEqual(mockBackend.getAccessState(assessment.id).hasOneTimeReportAccess, true);

  mockBackend.resetMockBackend();
  const uiAssessment = mockBackend.createAssessment("one_time");
  setOneTime({ currentAssessmentId: uiAssessment.id });
  assert(normalize(_internal.renderReport()).includes("Таны эхний зураглал бэлэн боллоо"), "unpaid local UI starts with paywall copy");
  _internal.demoCompletePayment("one-time");
  assert.strictEqual(_internal.hasOneTimeReportAccess(), true);
  assert(normalize(_internal.renderReport()).includes("3. Таны хамгийн магадлалтай 2–3 механизм"), "one_time_report unlocks full one-time report");

  mockBackend.resetMockBackend();
  const sevenAssessment = mockBackend.createAssessment("seven_day");
  const sevenPayment = mockBackend.createMockPayment("seven_day", sevenAssessment.id);
  assert.strictEqual(sevenPayment.amount_mnt, 29000);
  mockBackend.markMockPaymentPaid(sevenPayment.id);
  assert(mockBackend.hasEntitlement("seven_day_access", sevenAssessment.id), "paid seven_day should create seven_day_access entitlement");
  assert.strictEqual(mockBackend.getAccessState(sevenAssessment.id).hasSevenDayAccess, true);

  setSevenDay({ currentAssessmentId: sevenAssessment.id });
  assert.strictEqual(_internal.hasSevenDayAccess(), true);
  assert(normalize(_internal.renderSevenDayStart()).includes("7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна"), "seven_day_access unlocks diary onboarding");
  assert.strictEqual(mockBackend.canGenerateSevenDayReport([]), false, "seven_day access should not bypass 0-1/7 readiness");
  assert(normalize(_internal.renderReport()).includes("Бүрэн тайлан гаргахад мэдээлэл хангалтгүй байна"), "paid seven_day still respects readiness gate");

  mockBackend.resetMockBackend();
  const upgradeAssessment = mockBackend.createAssessment("one_time");
  const upgradePayment = mockBackend.createMockPayment("upgrade", upgradeAssessment.id);
  assert.strictEqual(upgradePayment.amount_mnt, 19900);
  mockBackend.markMockPaymentPaid(upgradePayment.id);
  assert(mockBackend.hasEntitlement("upgrade_access", upgradeAssessment.id), "upgrade should create upgrade_access entitlement");
  assert(mockBackend.hasEntitlement("seven_day_access", upgradeAssessment.id), "upgrade should also create seven_day_access entitlement");

  assert.strictEqual(mockBackend.canAccessProfessionalSummary("mode3"), true, "Mode 3 should be accessible without one_time_report");
  assert.strictEqual(mockBackend.canAccessUrgentSafety("mode4"), true, "Mode 4 should be accessible without payment");
  assert.strictEqual(mockBackend.canShowUpgradeCta("mode4"), false, "Mode 4 should not show upgrade CTA");

  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: { "S1-B03": "Тийм" },
    diaryEntries: []
  });
  assert(normalize(_internal.renderReport()).includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"), "Mode 3 renders professional-first without payment");

  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
    diaryEntries: []
  });
  const urgent = normalize(_internal.renderReport());
  assert(urgent.includes("Одоо жин хасах тухай биш"), "Mode 4 renders urgent safety without payment");
  assert(!urgent.includes("Upgrade үнэ"), "Mode 4 has no upgrade CTA");

  mockBackend.resetMockBackend();
  const cleared = mockBackend.getMockBackendState();
  assert.strictEqual(cleared.sessions.length, 0);
  assert.strictEqual(cleared.payments.length, 0);
  assert.strictEqual(cleared.entitlements.length, 0);

  const doc = fs.readFileSync(path.join(root, "MOCK_BACKEND_ENTITLEMENTS.md"), "utf8");
  assert(doc.includes("# Mock Backend + Entitlement Persistence"));
  assert(doc.includes("weightLossMockBackendState"));
  assert(doc.includes("createMockPayment()"));

  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  assert(readme.includes("MOCK_BACKEND_ENTITLEMENTS.md"), "README should link to mock backend doc");
}

run();
console.log("mock-backend-entitlements tests passed");
