const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");

const INTERNAL_LEAKS = [
  "internalDiagnostics",
  "ownerDebug",
  "fixtureName",
  "runtimeGate",
  "decisionStatus",
  "rendererMode"
];

const ADAPTER_FIELD_NAMES = [
  "previewSections",
  "paidSections",
  "safetyGuidanceSections",
  "runtimeSafetyGate",
  "paymentGate"
];

const RAW_FIXTURE_NAMES = [
  "all_or_nothing_restriction_rebound",
  "pcos_body_uncertainty_control",
  "runtime-adapter-prototype-export-v0-test-only",
  "test_only"
];

const PAYMENT_COPY_LEAKS = [
  "QPay",
  "payment",
  "unlock",
  "premium",
  "diagnosis",
  "treatment",
  "prescribe"
];

function setOneTime(overrides = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    qpayPayment: {
      status: "idle",
      message: "",
      invoice: null
    },
    stageAnswers: {
      "S1-W04": ["Мацаг"],
      "S1-M01": "Өдөр бага идээд орой нөхөх",
      "S1-F01": ["Дараа өлсөхөөс санаа зовсон", "Өөрийгөө шагнамаар"]
    },
    preliminary: [{ key: "hungerSafety", score: 5, label: "хүчтэй нийцэж байна" }],
    diaryEntries: [],
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

function setSevenDay(overrides = {}) {
  _internal.setTestState({
    packageType: "seven-day",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: true,
    upgradePaid: false,
    qpayPayment: {
      status: "idle",
      message: "",
      invoice: null
    },
    preliminary: [{ key: "hungerSafety", score: 4, label: "дунд зэрэг нийцэж байна" }],
    diaryEntries: [
      diaryEntry({ day_number: 1 }),
      diaryEntry({ day_number: 2 }),
      diaryEntry({ day_number: 3 }),
      diaryEntry({ day_number: 4 }),
      diaryEntry({ day_number: 5 })
    ],
    ...overrides
  });
}

function visibleSurfaceHtml(html) {
  return String(html)
    .split('<section class="visible-surface-prototype"')
    .slice(1)
    .map(part => `<section class="visible-surface-prototype"${part.split("</section>")[0]}</section>`)
    .join("\n");
}

function assertSurfaceState(html, expected, label) {
  assert(html.includes("visible-surface-prototype"), `${label}: report output must include live visible surface HTML`);
  assert.strictEqual(html.includes('data-surface="preview"'), expected.includes("preview"), `${label}: preview surface mismatch`);
  assert.strictEqual(html.includes('data-surface="paid"'), expected.includes("paid"), `${label}: paid surface mismatch`);
  assert.strictEqual(html.includes('data-surface="safety"'), expected.includes("safety"), `${label}: safety surface mismatch`);
  assert.strictEqual(html.includes("Эхний товч зураглал"), expected.includes("preview"), `${label}: preview heading mismatch`);
  assert.strictEqual(html.includes("Гүн тайлангийн хэсэг"), expected.includes("paid"), `${label}: paid heading mismatch`);
  assert(html.includes("Аюулгүй байдлын сануулга"), `${label}: safety heading must remain visible`);
}

function assertNoInternalLeaks(html, label) {
  [...INTERNAL_LEAKS, ...RAW_FIXTURE_NAMES].forEach(text => {
    assert(!html.includes(text), `${label}: report HTML leaked ${text}`);
  });
}

function assertNoVisibleSurfaceLeaks(html, label) {
  const visibleHtml = visibleSurfaceHtml(html);
  [...ADAPTER_FIELD_NAMES, ...INTERNAL_LEAKS, ...RAW_FIXTURE_NAMES, ...PAYMENT_COPY_LEAKS].forEach(text => {
    assert(!visibleHtml.includes(text), `${label}: visible surface HTML leaked ${text}`);
  });
}

function snapshotBackend() {
  const state = mockBackend.getMockBackendState();
  return {
    payments: state.payments,
    entitlements: state.entitlements
  };
}

function assertNoPaymentOrEntitlementMutation(before, label) {
  const after = snapshotBackend();
  assert.deepStrictEqual(after.payments, before.payments, `${label}: payments must not mutate`);
  assert.deepStrictEqual(after.entitlements, before.entitlements, `${label}: entitlements must not mutate`);
}

function assertAccessState(expected, label) {
  assert.strictEqual(_internal.hasOneTimeReportAccess(), expected.oneTime, `${label}: one-time access mismatch`);
  assert.strictEqual(_internal.hasSevenDayAccess(), expected.sevenDay, `${label}: seven-day access mismatch`);
  assert.strictEqual(_internal.hasUpgradeAccess(), expected.upgrade, `${label}: upgrade access mismatch`);
}

function assertReportCase(label, setup, expectedSurfaces, expectedAccess) {
  setup();
  const backendBefore = snapshotBackend();
  const html = _internal.renderReport();
  assertSurfaceState(html, expectedSurfaces, label);
  assertNoInternalLeaks(html, label);
  assertNoVisibleSurfaceLeaks(html, label);
  assertAccessState(expectedAccess, label);
  assertNoPaymentOrEntitlementMutation(backendBefore, label);
  return html;
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

  const mutationCalls = calls.filter(([method]) => method === "setItem" || method === "removeItem");
  assert.deepStrictEqual(mutationCalls, [], "visible surface rendering must not mutate localStorage");
}

assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "prototype guard must remain false");
assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, true, "runtime visible integration guard must remain true");

assert(appSource.includes('const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;'), "source prototype guard must remain false");
assert(appSource.includes('const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;'), "source runtime visible guard must remain true");
assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint string must remain unchanged");
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'), "QPay check endpoint string must remain unchanged");
assert(appSource.includes('oneTime: "29,000₮"'), "one-time pricing label must remain unchanged");
assert(appSource.includes('oneTimeAnchor: "29,000₮"'), "one-time anchor pricing label must remain unchanged");
assert(appSource.includes('coachOneTime: "9,900₮"'), "coach one-time pricing label must remain unchanged");
assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day pricing label must remain unchanged");
assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor pricing label must remain unchanged");
assert(appSource.includes('upgrade: "19,900₮"'), "upgrade pricing label must remain unchanged");
assert(appSource.includes('const STANDARD_WEIGHT_PRICE_MNT = 29000;'), "standard price constant must remain unchanged");
assert(appSource.includes('const COACH_WEIGHT_PRICE_MNT = 9900;'), "coach price constant must remain unchanged");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code constant must remain unchanged");
assert(appSource.includes('const WEIGHT_TEST_AMOUNT_MNT = 9900;'), "QPay amount constant must remain unchanged");
assert.strictEqual(typeof _internal.hasOneTimeReportAccess, "function", "one-time entitlement helper must exist");
assert.strictEqual(typeof _internal.hasSevenDayAccess, "function", "seven-day entitlement helper must exist");
assert.strictEqual(typeof _internal.hasUpgradeAccess, "function", "upgrade entitlement helper must exist");

mockBackend.resetMockBackend();

withLocalStorageMutationSpy(() => {
  assertReportCase(
    "ordinary unpaid locked report",
    () => setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }),
    ["preview", "safety"],
    { oneTime: false, sevenDay: false, upgrade: false }
  );

  assertReportCase(
    "ordinary paid report",
    () => setOneTime({ oneTimePaid: true, sevenDayPaid: false, upgradePaid: false }),
    ["preview", "paid", "safety"],
    { oneTime: true, sevenDay: false, upgrade: false }
  );

  assertReportCase(
    "payment failed report",
    () => setOneTime({
      oneTimePaid: false,
      sevenDayPaid: false,
      upgradePaid: false,
      qpayPayment: {
        status: "error",
        message: "Төлбөр баталгаажаагүй байна.",
        invoice: null
      }
    }),
    ["preview", "safety"],
    { oneTime: false, sevenDay: false, upgrade: false }
  );

  const professional = assertReportCase(
    "professional route report",
    () => setSevenDay({
      diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })]
    }),
    ["safety"],
    { oneTime: false, sevenDay: true, upgrade: false }
  );
  assert.strictEqual(_internal.reportMode().mode, "professional", "professional setup must route to professional mode");
  assert(!professional.includes('data-surface="preview"'), "professional route must suppress preview");
  assert(!professional.includes('data-surface="paid"'), "professional route must suppress paid");

  const urgent = assertReportCase(
    "urgent route report",
    () => setSevenDay({
      diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })]
    }),
    ["safety"],
    { oneTime: false, sevenDay: true, upgrade: false }
  );
  assert.strictEqual(_internal.reportMode().mode, "urgent", "urgent setup must route to urgent mode");
  assert(!urgent.includes('data-surface="preview"'), "urgent route must suppress preview");
  assert(!urgent.includes('data-surface="paid"'), "urgent route must suppress paid");
});

console.log("production-visible-surface-smoke tests passed");
