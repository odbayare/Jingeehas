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
    removedFeaturePaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" }
    ],
    removedEntries: [],
    ...overrides
  });
}

function setRemovedFeature(overrides = {}) {
  _internal.setTestState({
    packageType: "removed-feature",
    view: "removedFeatureStart",
    oneTimePaid: false,
    removedFeaturePaid: false,
    upgradePaid: false,
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" }
    ],
    stageAnswers: {},
    removedEntries: [],
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
  assert(normalize(_internal.renderReport()).includes("3. Таны хамгийн магадлалтай гол хэв маяг"), "one_time_report unlocks full one-time report");

  assert.throws(() => mockBackend.createAssessment("removed_feature"), /Unsupported assessment type/);
  assert.throws(() => mockBackend.createMockPayment("removed_feature", assessment.id), /Unsupported product type/);
  assert.throws(() => mockBackend.createMockPayment("upgrade", assessment.id), /Unsupported product type/);

  assert.strictEqual(mockBackend.canAccessProfessionalSummary("mode3"), true, "Mode 3 should be accessible without one_time_report");
  assert.strictEqual(mockBackend.canAccessUrgentSafety("mode4"), true, "Mode 4 should be accessible without payment");

  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    stageAnswers: { "S1-B03": "Тийм" },
  });
  assert(normalize(_internal.renderReport()).includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"), "Mode 3 renders professional-first without payment");

  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    removedFeaturePaid: false,
    upgradePaid: false,
    stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
    removedEntries: []
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
