const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");
const cssSource = fs.readFileSync("styles.css", "utf8");

const FORBIDDEN_OUTPUT_TEXT = [
  "internalDiagnostics",
  "ownerDebug",
  "fixtureName",
  "runtimeGate",
  "decisionStatus",
  "rendererMode",
  "all_or_nothing_restriction_rebound",
  "pcos_body_uncertainty_control",
  "owner_recommended",
  "test_only",
  "QPay",
  "payment",
  "unlock",
  "premium",
  "diagnosis",
  "treatment",
  "prescribe",
  "хатуу дэглэм",
  "маргааш нөх",
  "Нэг уурагтай",
  "нэг нүүрс устай",
  "төлбөртэй тайлангаар хаахгүй"
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

function assertSurfaces(html, expected, label) {
  if (!expected.length) {
    assert(!html.includes("visible-surface-prototype runtime-visible-surface-integration"), `${label}: WP62 paid report must not inject production visible surface wrapper`);
    assert(!html.includes('data-surface="preview"'), `${label}: preview surface must not render`);
    assert(!html.includes('data-surface="paid"'), `${label}: paid surface must not render`);
    assert(!html.includes('data-surface="safety"'), `${label}: safety surface must not render as a separate wrapper`);
    return;
  }
  assert(html.includes("visible-surface-prototype runtime-visible-surface-integration"), `${label}: production visible surface wrapper class missing`);
  assert.strictEqual(html.includes('data-surface="preview"'), expected.includes("preview"), `${label}: preview surface mismatch`);
  assert.strictEqual(html.includes('data-surface="paid"'), expected.includes("paid"), `${label}: paid surface mismatch`);
  assert.strictEqual(html.includes('data-surface="safety"'), expected.includes("safety"), `${label}: safety surface mismatch`);
  assert.strictEqual(html.includes("Эхний товч зураглал"), expected.includes("preview"), `${label}: preview heading mismatch`);
  assert.strictEqual(html.includes("Дэлгэрэнгүй тайлангийн хэсэг"), expected.includes("paid"), `${label}: paid heading mismatch`);
  assert(html.includes("Аюулгүй байдлын сануулга"), `${label}: safety guidance must remain visible`);
}

function assertNoForbiddenOutputText(html, label) {
  FORBIDDEN_OUTPUT_TEXT.forEach(text => {
    assert(!String(html).includes(text), `${label}: output leaked or used forbidden copy: ${text}`);
  });
}

function renderCase(label, setup, expectedSurfaces) {
  setup();
  const html = _internal.renderReport();
  assertSurfaces(html, expectedSurfaces, label);
  assertNoForbiddenOutputText(html, label);
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

  assert.deepStrictEqual(
    calls.filter(([method]) => method === "setItem" || method === "removeItem"),
    [],
    "visible surface rendering must not mutate localStorage"
  );
}

assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "prototype guard must remain false");
assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, true, "runtime visible integration guard must remain true");
assert(appSource.includes('const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;'), "source prototype guard must remain false");
assert(appSource.includes('const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;'), "source runtime visible integration guard must remain true");

assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint string must remain unchanged");
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'), "QPay check endpoint string must remain unchanged");
assert(appSource.includes('oneTime: "9,900₮"'), "one-time pricing label must remain unchanged");
assert(appSource.includes('oneTimeAnchor: "9,900₮"'), "one-time anchor pricing label must remain unchanged");
assert(appSource.includes('coachOneTime: "9,900₮"'), "coach one-time pricing label must remain unchanged");
assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day pricing label must remain unchanged");
assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor pricing label must remain unchanged");
assert(appSource.includes('upgrade: "19,900₮"'), "upgrade pricing label must remain unchanged");
assert(appSource.includes('const STANDARD_WEIGHT_PRICE_MNT = 9900;'), "standard price constant must remain unchanged");
assert(appSource.includes('const COACH_WEIGHT_PRICE_MNT = 9900;'), "coach price constant must remain unchanged");
assert(appSource.includes('const WEIGHT_TEST_AMOUNT_MNT = 9900;'), "QPay amount constant must remain unchanged");

assert(cssSource.includes(".runtime-visible-surface-integration"), "CSS must target the runtime visible surface wrapper");
assert(cssSource.includes(".visible-surface-card"), "CSS must target visible surface cards");
assert(cssSource.includes("@media (max-width: 520px)"), "CSS must retain mobile readability rules");

mockBackend.resetMockBackend();

withLocalStorageMutationSpy(() => {
  renderCase(
    "ordinary unpaid locked report",
    () => setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }),
    ["preview", "safety"]
  );

  renderCase(
    "ordinary paid report",
    () => setOneTime({ oneTimePaid: true, sevenDayPaid: false, upgradePaid: false }),
    []
  );

  renderCase(
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
    ["preview", "safety"]
  );

  renderCase(
    "professional route report",
    () => setSevenDay({
      diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })]
    }),
    ["safety"]
  );
  assert.strictEqual(_internal.reportMode().mode, "professional", "professional setup must route to professional mode");

  renderCase(
    "urgent route report",
    () => setSevenDay({
      diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })]
    }),
    ["safety"]
  );
  assert.strictEqual(_internal.reportMode().mode, "urgent", "urgent setup must route to urgent mode");
});

console.log("public-visible-surface-ux-polish tests passed");
