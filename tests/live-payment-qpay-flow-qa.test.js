const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");

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
    qpayPayment: {
      status: "idle",
      message: "",
      invoice: null
    },
    currentAssessmentId: null,
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "decisionDefault", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    contactCapture: {
      name: "Live QA",
      phone: "99119911",
      email: "",
      saved: true,
      message: "",
      copyStatus: ""
    },
    stageVoiceSummaries: {},
    diaryEntries: [],
    ...overrides
  });
}

function assertNoInternalLeak(html, label) {
  [
    "internalDiagnostics",
    "ownerDebug",
    "fixtureName",
    "runtimeGate",
    "decisionStatus",
    "rendererMode"
  ].forEach(token => {
    assert(!String(html).includes(token), `${label}: internal token leaked: ${token}`);
  });
}

function assertNoPressureCopy(html, label) {
  const text = normalize(html).toLowerCase();
  [
    "fake urgency",
    "fake scarcity",
    "limited seats",
    "хязгаарлагдмал суудал",
    "сүүлийн боломж",
    "яг одоо авахгүй бол",
    "алдана",
    "хоцорно",
    "аймшиг",
    "айдас",
    "ичгүүр",
    "өөрөөсөө ич",
    "ичгүүрээр шах",
    "залхуу",
    "сахилгагүй"
  ].forEach(phrase => {
    assert(!text.includes(phrase), `${label}: pressure copy present: ${phrase}`);
  });
}

function assertSafePaymentOutput(html, label, options = {}) {
  const text = normalize(html);
  assertNoInternalLeak(html, label);
  assertNoPressureCopy(html, label);
  if (options.requireSafety !== false) {
    assert(text.includes("Аюулгүй байдлын сануулга") || text.includes("6. Болгоомжлох зүйл"), `${label}: safety guidance must remain visible`);
  }
}

function withLocalStorageMutationSpy(fn) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(global, "localStorage");
  const calls = [];

  Object.defineProperty(global, "localStorage", {
    configurable: true,
    value: {
      getItem(key) {
        calls.push(["getItem", key]);
        return null;
      },
      setItem(key, value) {
        calls.push(["setItem", key, value]);
      },
      removeItem(key) {
        calls.push(["removeItem", key]);
      }
    }
  });

  try {
    fn();
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(global, "localStorage", originalDescriptor);
    } else {
      delete global.localStorage;
    }
  }

  assert.deepStrictEqual(
    calls.filter(([method]) => method === "setItem" || method === "removeItem"),
    [],
    "live payment/QPay QA render paths must not mutate localStorage"
  );
}

assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "prototype guard must remain false");
assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, true, "runtime visible integration guard must remain true");
assert(appSource.includes("const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;"), "source prototype guard must remain false");
assert(appSource.includes("const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;"), "source runtime visible integration guard must remain true");

assert(appSource.includes('oneTime: "9,900₮"'), "one-time price label must remain unchanged");
assert(appSource.includes('oneTimeAnchor: "9,900₮"'), "one-time anchor price label must remain unchanged");
assert(appSource.includes('coachOneTime: "9,900₮"'), "coach price label must remain unchanged");
assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged");
assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged");
assert(appSource.includes('upgrade: "19,900₮"'), "upgrade price label must remain unchanged");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price constant must remain unchanged");
assert(appSource.includes("const COACH_WEIGHT_PRICE_MNT = 9900;"), "coach price constant must remain unchanged");
assert(appSource.includes("const COACH_COMMISSION_MNT = 4000;"), "coach commission constant must remain unchanged");
assert(appSource.includes("const WEIGHT_TEST_AMOUNT_MNT = 9900;"), "QPay amount constant must remain unchanged");

assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "QPay product code must remain unchanged");
assert(appSource.includes('create: "https://www.lifepattern.live/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "https://www.lifepattern.live/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");
assert(appSource.includes("productCode: WEIGHT_TEST_PRODUCT_CODE"), "QPay create payload must keep product code");
assert(appSource.includes("amountMnt: currentOneTimePriceMnt()"), "QPay create payload must keep current one-time amount helper");
assert(appSource.includes("return state.coachDiscountConsent && state.coachInvite ? COACH_WEIGHT_PRICE_MNT : STANDARD_WEIGHT_PRICE_MNT;"), "current one-time amount helper must remain unchanged");
assert(appSource.includes("return Boolean(isInternalTestMode() || state.sevenDayPaid || state.upgradePaid || access.hasSevenDayAccess);"), "seven-day access helper source must remain unchanged");
assert(appSource.includes("return Boolean(isQaPaymentBypassEnabled() || isInternalTestMode() || state.oneTimePaid || state.qpayPayment?.status === \"paid\" || access.hasOneTimeReportAccess);"), "one-time access helper source must keep paid-state and entitlement guards");
assert(appSource.includes("return Boolean(state.upgradePaid || access.hasUpgradeAccess);"), "upgrade access helper source must remain unchanged");

mockBackend.resetMockBackend();
mockBackend.startSession();

_internal.setTestState({
  packageType: "one-time",
  oneTimePaid: false,
  sevenDayPaid: false,
  upgradePaid: false,
  qpayPayment: { status: "idle", message: "", invoice: null },
  currentAssessmentId: null
});
assert.strictEqual(_internal.hasOneTimeReportAccess(), false, "one-time access should be false without payment or entitlement");
assert.strictEqual(_internal.hasSevenDayAccess(), false, "seven-day access should be false without payment or entitlement");
assert.strictEqual(_internal.hasUpgradeAccess(), false, "upgrade access should be false without payment or entitlement");

_internal.setTestState({
  packageType: "one-time",
  oneTimePaid: false,
  qpayPayment: { status: "paid", message: "", invoice: null },
  currentAssessmentId: null
});
assert.strictEqual(_internal.hasOneTimeReportAccess(), true, "paid QPay state should grant one-time report access");

mockBackend.resetMockBackend();
const assessment = mockBackend.createAssessment("one_time");
const payment = mockBackend.createMockPayment("one_time", assessment.id);
mockBackend.markMockPaymentPaid(payment.id);
_internal.setTestState({
  packageType: "one-time",
  oneTimePaid: false,
  sevenDayPaid: false,
  upgradePaid: false,
  qpayPayment: { status: "idle", message: "", invoice: null },
  currentAssessmentId: assessment.id
});
assert.strictEqual(_internal.hasOneTimeReportAccess(), true, "backend entitlement should grant one-time report access");

mockBackend.resetMockBackend();

withLocalStorageMutationSpy(() => {
  setOneTime();
  const unpaidHtml = _internal.renderReport();
  const unpaid = normalize(unpaidHtml);
  assertSafePaymentOutput(unpaidHtml, "unpaid output");
  assert(unpaid.includes("Бүрэн тайлан нээх"), "unpaid output must show payment CTA");
  assert(unpaid.includes("Энэ хэсэг төлбөргүй хэвээр харагдана"), "unpaid output must show free preview explanation");
  assert(!unpaid.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ"), "unpaid output must keep paid depth locked");
  assert(!unpaid.includes("Давтагддаг тойрог"), "unpaid output must keep paid cycle depth locked");

  setOneTime({ oneTimePaid: true });
  const paidHtml = _internal.renderReport();
  const paid = normalize(paidHtml);
  assertSafePaymentOutput(paidHtml, "paid output", { requireSafety: false });
  assert(paid.includes("3. Таны хамгийн магадлалтай гол хэв маяг"), "paid output must show paid explanation");
  assert(paid.includes("7. 7–14 хоногийн нэг хувьсагчийн туршилт"), "paid output must show paid experiment");
  assert(!paid.includes("Бүрэн тайлан нээх 9,900₮"), "paid output must not show locked paywall state");
  assert(!paid.includes("Төлбөр төлсний дараа"), "paid output must not show locked payment explanation");

  setOneTime({
    qpayPayment: {
      status: "error",
      message: "Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно.",
      invoice: null
    }
  });
  const failedHtml = _internal.renderReport();
  const failed = normalize(failedHtml);
  assertSafePaymentOutput(failedHtml, "payment failed output");
  assert(failed.includes("Таны эхний дохио хэвээр харагдана"), "payment failed output must keep free preview visible");
  assert(failed.includes("Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно"), "payment failed output must show retry/help copy");
});

console.log("live-payment-qpay-flow-qa tests passed");
