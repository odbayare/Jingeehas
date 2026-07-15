const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");
const mockBackendSource = fs.readFileSync("mockBackend.js", "utf8");

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
      name: "QPay QA",
      phone: "99119911",
      email: "",
      saved: true,
      message: "",
      copyStatus: ""
    },
    stageVoiceSummaries: {},
    removedEntries: [],
    ...overrides
  });
}

function diaryEntry(overrides = {}) {
  return {
    day_number: 1,
    meal_rhythm: "Тогтвортой, хоол алгасаагүй",
    unplanned_eating_count: "Үгүй",
    stress_score: 3,
    energy_score: 6,
    sleep: ["6-8 цаг"],
    movement: "Бага зэрэг алхсан",
    body_signals: ["Аль нь ч үгүй"],
    pattern_probes: {},
    ...overrides
  };
}

function setRemovedFeature(overrides = {}) {
  _internal.setTestState({
    packageType: "removed-feature",
    view: "report",
    oneTimePaid: false,
    removedFeaturePaid: true,
    upgradePaid: false,
    qpayPayment: {
      status: "idle",
      message: "",
      invoice: null
    },
    currentAssessmentId: null,
    preliminary: [{ key: "hungerSafety", score: 4, label: "дунд зэрэг нийцэж байна" }],
    removedEntries: [
      diaryEntry({ day_number: 1 }),
      diaryEntry({ day_number: 2 }),
      diaryEntry({ day_number: 3 }),
      diaryEntry({ day_number: 4 }),
      diaryEntry({ day_number: 5 })
    ],
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

function assertNoBadPaymentCopy(html, label) {
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
    "өөрөөсөө ич",
    "ичгүүрээр шах",
    "залхуу",
    "сахилгагүй",
    "заавал"
  ].forEach(phrase => {
    assert(!text.includes(phrase), `${label}: bad payment copy present: ${phrase}`);
  });
}

function assertSafeRenderedOutput(html, label, options = {}) {
  const text = normalize(html);
  assertNoInternalLeak(html, label);
  assertNoBadPaymentCopy(html, label);
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
    "payment/QPay audit render paths must not mutate localStorage"
  );
}

function assertRenderDoesNotMutateMockBackend(renderFn, label) {
  const before = JSON.stringify(mockBackend.getMockBackendState());
  renderFn();
  const after = JSON.stringify(mockBackend.getMockBackendState());
  assert.strictEqual(after, before, `${label}: render must not mutate mockBackend state`);
}

assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "prototype guard must remain false");
assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, true, "runtime visible integration guard must remain true");
assert(appSource.includes("const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;"), "source prototype guard must remain false");
assert(appSource.includes("const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;"), "source runtime visible integration guard must remain true");

assert(appSource.includes('oneTime: "9,900₮"'), "one-time price label must remain unchanged");
assert(appSource.includes('oneTimeAnchor: "9,900₮"'), "one-time anchor price label must remain unchanged");
assert(appSource.includes('coachOneTime: "9,900₮"'), "coach one-time price label must remain unchanged");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price constant must remain unchanged");
assert(appSource.includes("const COACH_WEIGHT_PRICE_MNT = 9900;"), "coach price constant must remain unchanged");
assert(appSource.includes("const COACH_COMMISSION_MNT = 4000;"), "coach commission constant must remain unchanged");
assert(appSource.includes("const WEIGHT_TEST_AMOUNT_MNT = 9900;"), "QPay amount constant must remain unchanged");

assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "QPay product code must remain unchanged");
assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");
assert(appSource.includes("return state.coachDiscountConsent && state.coachInvite ? COACH_WEIGHT_PRICE_MNT : STANDARD_WEIGHT_PRICE_MNT;"), "current one-time amount helper must remain unchanged");
assert(appSource.includes("return Boolean(isQaPaymentBypassEnabled() || isInternalTestMode() || state.oneTimePaid || state.qpayPayment?.status === \"paid\" || access.hasOneTimeReportAccess);"), "one-time access helper source must keep paid-state and entitlement guards");

assert(mockBackendSource.includes("const PRODUCT_AMOUNTS = {\n  one_time: 9900\n};"), "mock backend must retain only the one-time amount");
assert(mockBackendSource.includes('product_code: productType === "one_time" ? "WEIGHT_TEST_ONE_TIME" : productType'), "mock backend product code mapping must remain unchanged");
assert(mockBackendSource.includes('entitlement_type: "one_time_report"'), "mock backend one-time entitlement type must remain unchanged");

mockBackend.resetMockBackend();
mockBackend.startSession();

_internal.setTestState({
  packageType: "one-time",
  oneTimePaid: false,
  qpayPayment: { status: "idle", message: "", invoice: null },
  currentAssessmentId: null
});
assert.strictEqual(_internal.hasOneTimeReportAccess(), false, "one-time access should be false without local flag, paid QPay state, or entitlement");

_internal.setTestState({ oneTimePaid: true });
assert.strictEqual(_internal.hasOneTimeReportAccess(), true, "one-time local paid flag should grant one-time report access");

_internal.setTestState({
  packageType: "one-time",
  oneTimePaid: false,
  qpayPayment: { status: "paid", message: "", invoice: null },
  currentAssessmentId: null
});
assert.strictEqual(_internal.hasOneTimeReportAccess(), true, "paid QPay state should grant one-time report access");

mockBackend.resetMockBackend();
const assessment = mockBackend.createAssessment("one_time");
const oneTimePayment = mockBackend.createMockPayment("one_time", assessment.id);
mockBackend.markMockPaymentPaid(oneTimePayment.id);
_internal.setTestState({
  packageType: "one-time",
  oneTimePaid: false,
  qpayPayment: { status: "idle", message: "", invoice: null },
  currentAssessmentId: assessment.id
});
assert.strictEqual(_internal.hasOneTimeReportAccess(), true, "backend one-time entitlement should grant one-time report access");

mockBackend.resetMockBackend();
mockBackend.startSession();

withLocalStorageMutationSpy(() => {
  setOneTime();
  assertRenderDoesNotMutateMockBackend(() => {
    const html = _internal.renderReport();
    const text = normalize(html);
    assertSafeRenderedOutput(html, "unpaid output");
    assert(text.includes("Бүрэн тайлангаа нээх"), "unpaid output should include clear locked payment section");
    assert(!text.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ"), "unpaid output must not show paid depth");
    assert(!text.includes("Давтагддаг тойрог"), "unpaid output must not show paid cycle depth");
  }, "unpaid output");

  setOneTime({ oneTimePaid: true });
  assertRenderDoesNotMutateMockBackend(() => {
    const html = _internal.renderReport();
    const text = normalize(html);
    assertSafeRenderedOutput(html, "paid output", { requireSafety: false });
    assert(text.includes("3. Таны хамгийн магадлалтай гол хэв маяг"), "paid output should show paid report explanation");
    assert(text.includes("7. 7–14 хоногийн нэг хувьсагчийн туршилт"), "paid output should show paid experiment depth");
    assert(!text.includes("Бүрэн тайлан нээх 9,900₮"), "paid output should not show locked payment state");
  }, "paid output");

  setOneTime({
    qpayPayment: {
      status: "error",
      message: "Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно.",
      invoice: null
    }
  });
  assertRenderDoesNotMutateMockBackend(() => {
    const html = _internal.renderReport();
    const text = normalize(html);
    assertSafeRenderedOutput(html, "payment failed output");
    assert(text.includes("Таны эхний дохио хэвээр харагдана"), "payment failed output should preserve free preview wording");
    assert(text.includes("Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно"), "payment failed output should include retry/recreate-QR wording");
  }, "payment failed output");

});

console.log("payment-qpay-production-hardening-audit tests passed");
