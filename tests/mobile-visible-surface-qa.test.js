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
  "previewSections",
  "paidSections",
  "safetyGuidanceSections",
  "QPay",
  "payment",
  "unlock",
  "premium",
  "diagnosis",
  "treatment",
  "prescribe"
];

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

function assertNoForbiddenOutputText(html, label) {
  FORBIDDEN_OUTPUT_TEXT.forEach(text => {
    assert(!String(html).includes(text), `${label}: output leaked forbidden text: ${text}`);
  });
}

function assertSurfaceState(html, expectedSurfaces, label) {
  assert(html.includes("visible-surface-prototype runtime-visible-surface-integration"), `${label}: visible surface wrapper classes missing`);
  assert(html.includes("visible-surface-card"), `${label}: visible surface card class missing`);

  assert.strictEqual(html.includes('data-surface="preview"'), expectedSurfaces.includes("preview"), `${label}: preview surface mismatch`);
  assert.strictEqual(html.includes('data-surface="paid"'), expectedSurfaces.includes("paid"), `${label}: paid surface mismatch`);
  assert.strictEqual(html.includes('data-surface="safety"'), expectedSurfaces.includes("safety"), `${label}: safety surface mismatch`);

  assert.strictEqual(html.includes("Эхний товч зураглал"), expectedSurfaces.includes("preview"), `${label}: preview heading mismatch`);
  assert.strictEqual(html.includes("Гүн тайлангийн хэсэг"), expectedSurfaces.includes("paid"), `${label}: paid heading mismatch`);
  assert.strictEqual(html.includes("Аюулгүй байдлын сануулга"), expectedSurfaces.includes("safety"), `${label}: safety heading mismatch`);
  assertNoForbiddenOutputText(html, label);
}

function renderCase(label, setup, expectedSurfaces) {
  setup();
  const html = _internal.renderReport();
  assertSurfaceState(html, expectedSurfaces, label);
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
    "renderReport visible surface QA must not mutate localStorage"
  );
}

function assertCssRule(selector, checks) {
  const selectorIndex = cssSource.indexOf(selector);
  assert(selectorIndex >= 0, `CSS must include ${selector}`);
  const blockEnd = cssSource.indexOf("}", selectorIndex);
  assert(blockEnd > selectorIndex, `CSS rule for ${selector} must be closed`);
  const block = cssSource.slice(selectorIndex, blockEnd);
  checks.forEach(check => {
    assert(check.test(block), `CSS rule for ${selector} must include ${check}`);
  });
}

assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "prototype guard must remain false");
assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, true, "runtime visible integration guard must remain true");
assert(appSource.includes("const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;"), "source prototype guard must remain false");
assert(appSource.includes("const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;"), "source runtime visible integration guard must remain true");

assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint string must remain unchanged");
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'), "QPay check endpoint string must remain unchanged");
assert(appSource.includes('oneTime: "29,000₮"'), "one-time pricing label must remain unchanged");
assert(appSource.includes('oneTimeAnchor: "29,000₮"'), "one-time anchor pricing label must remain unchanged");
assert(appSource.includes('coachOneTime: "9,900₮"'), "coach one-time pricing label must remain unchanged");
assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day pricing label must remain unchanged");
assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor pricing label must remain unchanged");
assert(appSource.includes('upgrade: "19,900₮"'), "upgrade pricing label must remain unchanged");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 29000;"), "standard price constant must remain unchanged");
assert(appSource.includes("const COACH_WEIGHT_PRICE_MNT = 9900;"), "coach price constant must remain unchanged");
assert(appSource.includes("const WEIGHT_TEST_AMOUNT_MNT = 9900;"), "QPay amount constant must remain unchanged");

assertCssRule(".runtime-visible-surface-integration", [
  /max-width:\s*100%/,
  /overflow-wrap:\s*anywhere/,
  /border-top:/
]);
assertCssRule(".visible-surface-prototype", [
  /runtime-visible-surface-integration/
]);
assertCssRule(".visible-surface-card", [
  /max-width:\s*100%/,
  /box-sizing:\s*border-box/,
  /padding:/
]);
assert(cssSource.includes("@media (max-width: 520px)"), "CSS must include a small-screen media rule");
assert(/@media \(max-width:\s*520px\)[\s\S]*\.runtime-visible-surface-integration[\s\S]*overflow-x:\s*hidden/.test(cssSource), "small-screen CSS must prevent visible-surface horizontal overflow");
assert(/@media \(max-width:\s*520px\)[\s\S]*\.visible-surface-card[\s\S]*padding:\s*14px/.test(cssSource), "small-screen CSS must keep visible-surface card padding readable");

mockBackend.resetMockBackend();

withLocalStorageMutationSpy(() => {
  renderCase(
    "unpaid locked report",
    () => setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }),
    ["preview", "safety"]
  );

  renderCase(
    "paid report",
    () => setOneTime({ oneTimePaid: true, sevenDayPaid: false, upgradePaid: false }),
    ["preview", "paid", "safety"]
  );

  renderCase(
    "payment failed report",
    () => setOneTime({
      oneTimePaid: false,
      sevenDayPaid: false,
      upgradePaid: false,
      qpayPayment: {
        status: "error",
        message: "Баталгаажуулалт амжилтгүй.",
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

console.log("mobile-visible-surface-qa tests passed");
