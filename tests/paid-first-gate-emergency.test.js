const assert = require("assert");
const { readFileSync } = require("fs");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const appSource = readFileSync("app.js", "utf8");
const runAllSource = readFileSync("tests/run-all.js", "utf8");
const { _internal } = app;

_internal.setComingSoonModeForTest(false);

function resetUnpaid(overrides = {}) {
  mockBackend.resetMockBackend();
  _internal.setTestState({
    packageType: "one-time",
    view: "oneTimeStart",
    currentAssessmentId: null,
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    qpayPayment: { status: "idle", message: "", invoice: null },
    ...overrides
  });
}

assert(appSource.includes('oneTime: "9,900₮"'), "one-time price label must remain 9,900₮");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price amount must remain 9900");
assert(appSource.includes("const WEIGHT_TEST_AMOUNT_MNT = 9900;"), "QPay amount must remain 9900");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");

assert(appSource.includes("function canStartPaidAssessment("), "single paid-first gate helper must exist");
assert(appSource.includes("function enforcePaidFirstGate("), "view restore paid-first guard must exist");
assert(appSource.includes("if (!canStartPaidAssessment(packageType))"), "beginAssessment must be guarded before state enters questions");
assert(appSource.includes("enforcePaidFirstGate();"), "render/setView must enforce paid-first gate");
assert(runAllSource.includes('["node", ["tests/paid-first-gate-emergency.test.js"]]'), "paid-first emergency test must be registered");

resetUnpaid();
assert.strictEqual(_internal.canStartPaidAssessment("one-time"), false, "unpaid one-time user must not be start-eligible");
assert.strictEqual(_internal.beginAssessment("one-time"), false, "unpaid one-time beginAssessment must be blocked");
assert.notStrictEqual(_internal.getTestState().view, "stage1", "unpaid beginAssessment must not enter stage1");
assert.strictEqual(_internal.getTestState().view, "oneTimeStart", "unpaid beginAssessment must stay on payment/start gate");

resetUnpaid({
  qpayPayment: {
    status: "pending",
    message: "Төлбөр хүлээгдэж байна.",
    invoice: { invoiceId: "inv_pending", senderInvoiceNo: "WT_PENDING" }
  }
});
assert.strictEqual(_internal.hasOneTimeReportAccess(), false, "QPay pending must not grant report access");
assert.strictEqual(_internal.canStartPaidAssessment("one-time"), false, "QPay pending must not allow test start");
assert.strictEqual(_internal.beginAssessment("one-time"), false, "QPay pending must not enter questions");

resetUnpaid({
  qpayPayment: {
    status: "creating",
    message: "QPay QR үүсгэж байна.",
    invoice: null
  }
});
assert.strictEqual(_internal.canStartPaidAssessment("one-time"), false, "QPay invoice creation state must not allow test start");

["stage1", "preliminary", "report"].forEach(view => {
  resetUnpaid({ view });
  assert.strictEqual(_internal.enforcePaidFirstGate(), true, `${view} restore must be redirected for unpaid one-time user`);
  assert.strictEqual(_internal.getTestState().view, "oneTimeStart", `${view} restore must return to one-time payment gate`);
});

["stage1", "preliminary", "unlock", "diaryHome", "diary", "reportReady", "report"].forEach(view => {
  resetUnpaid({ packageType: "seven-day", view });
  assert.strictEqual(_internal.enforcePaidFirstGate(), true, `${view} restore must be redirected for unpaid seven-day user`);
  assert.strictEqual(_internal.getTestState().view, "sevenDayStart", `${view} restore must return to seven-day payment gate`);
});

resetUnpaid({ packageType: "seven-day", view: "sevenDayStart" });
assert.strictEqual(_internal.canStartPaidAssessment("seven-day"), false, "unpaid seven-day user must not be start-eligible");
assert.strictEqual(_internal.beginAssessment("seven-day"), false, "unpaid seven-day beginAssessment must be blocked");
assert.strictEqual(_internal.startDiary(), false, "unpaid seven-day user must not enter diary");
assert.notStrictEqual(_internal.getTestState().view, "diary", "unpaid seven-day user must not see diary questions");

resetUnpaid({
  qpayPayment: { status: "paid", message: "Төлбөр баталгаажлаа.", invoice: null }
});
assert.strictEqual(_internal.hasOneTimeReportAccess(), true, "confirmed paid QPay state must still grant access");
assert.strictEqual(_internal.canStartPaidAssessment("one-time"), true, "confirmed paid QPay state must allow start");
assert.strictEqual(_internal.beginAssessment("one-time"), true, "confirmed paid user must be able to enter questions");
assert.strictEqual(_internal.getTestState().view, "stage1", "confirmed paid user should enter stage1");

mockBackend.resetMockBackend();
const assessment = mockBackend.createAssessment("one_time");
const payment = mockBackend.createMockPayment("one_time", assessment.id);
mockBackend.markMockPaymentPaid(payment.id);
_internal.setTestState({
  packageType: "one-time",
  view: "oneTimeStart",
  currentAssessmentId: assessment.id,
  oneTimePaid: false,
  sevenDayPaid: false,
  upgradePaid: false,
  qpayPayment: { status: "idle", message: "", invoice: null }
});
assert.strictEqual(_internal.canStartPaidAssessment("one-time"), true, "backend entitlement must still allow paid start");

console.log("paid-first-gate-emergency tests passed");
