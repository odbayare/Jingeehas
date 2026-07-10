const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

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
    contactCapture: {
      name: "Launch Smoke",
      phone: "99119911",
      email: "",
      saved: true,
      message: "",
      copyStatus: ""
    },
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "decisionDefault", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    stageVoiceSummaries: {},
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
    currentAssessmentId: null,
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

function assertNoBadTrustCopy(html, label) {
  const text = normalize(html).toLowerCase();
  [
    "хатуу дэглэм",
    "сахилгагүй",
    "амжилтгүй",
    "оношилгоо",
    "эмчилгээ",
    "даавраас болсон",
    "эмнээс болсон",
    "глюкозоос болсон",
    "fake scarcity",
    "fake urgency",
    "limited seats",
    "хязгаарлагдмал суудал",
    "сүүлийн боломж",
    "яг одоо авахгүй бол"
  ].forEach(phrase => {
    assert(!text.includes(phrase), `${label}: bad launch/trust copy present: ${phrase}`);
  });
}

function assertLaunchSafeOutput(html, label, options = {}) {
  const text = normalize(html);
  assertNoInternalLeak(html, label);
  assertNoBadTrustCopy(html, label);
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
    "final public launch smoke render paths must not mutate localStorage"
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
assert(appSource.includes("return state.coachDiscountConsent && state.coachInvite ? COACH_WEIGHT_PRICE_MNT : STANDARD_WEIGHT_PRICE_MNT;"), "current one-time amount helper must remain unchanged");
assert(appSource.includes("return Boolean(isInternalTestMode() || state.sevenDayPaid || state.upgradePaid || access.hasSevenDayAccess);"), "seven-day access helper source must remain unchanged");
assert(appSource.includes("return Boolean(isQaPaymentBypassEnabled() || isInternalTestMode() || state.oneTimePaid || state.qpayPayment?.status === \"paid\" || access.hasOneTimeReportAccess);"), "one-time access helper source must keep paid-state and entitlement guards");
assert(appSource.includes("return Boolean(state.upgradePaid || access.hasUpgradeAccess);"), "upgrade access helper source must remain unchanged");

withLocalStorageMutationSpy(() => {
  setOneTime();
  const unpaidHtml = _internal.renderReport();
  const unpaid = normalize(unpaidHtml);
  assertLaunchSafeOutput(unpaidHtml, "unpaid output");
  assert(unpaid.includes("Энэ хэсэг төлбөргүй хэвээр харагдана"), "unpaid output must explain free preview");
  assert(unpaid.includes("Эхний товч зураглал"), "unpaid output must include visible preview surface");
  assert(unpaid.includes("Бүрэн тайлан нээх"), "unpaid output must include clear paywall CTA");
  assert(!unpaid.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ"), "unpaid output must not show paid depth");
  assert(!unpaid.includes("Давтагддаг тойрог"), "unpaid output must not show paid cycle depth");

  setOneTime({ oneTimePaid: true });
  const paidHtml = _internal.renderReport();
  const paid = normalize(paidHtml);
  assertLaunchSafeOutput(paidHtml, "paid output", { requireSafety: false });
  assert(paid.includes("3. Таны хамгийн магадлалтай гол хэв маяг"), "paid output must include paid report explanation");
  assert(paid.includes("7. 7–14 хоногийн нэг хувьсагчийн туршилт"), "paid output must include paid experiment depth");
  assert(!paid.includes("Бүрэн тайлан нээх 9,900₮"), "paid output must not show locked payment state");
  assert(!paid.includes("Төлбөр төлсний дараа"), "paid output must not show locked-state explanation");

  setOneTime({
    qpayPayment: {
      status: "error",
      message: "Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно.",
      invoice: null
    }
  });
  const failedHtml = _internal.renderReport();
  const failed = normalize(failedHtml);
  assertLaunchSafeOutput(failedHtml, "payment failed output");
  assert(failed.includes("Таны эхний дохио хэвээр харагдана"), "payment failed output must keep safety/free preview visible");
  assert(failed.includes("Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно"), "payment failed output must include retry/help copy");

  setSevenDay({
    diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })]
  });
  const professionalHtml = _internal.renderReport();
  const professional = normalize(professionalHtml);
  assert.strictEqual(_internal.reportMode().mode, "professional", "professional setup must route to professional mode");
  assertLaunchSafeOutput(professionalHtml, "professional output");
  assert(professional.includes("Доорх богино нэгтгэлийг мэргэжлийн хүнтэй ярилцахдаа авч очиж болно."), "professional output must include safety summary");
  assert(!professional.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ"), "professional output must not show ordinary paid depth");
  assert(!professional.includes("14 хоногийн туршилт"), "professional output must not show ordinary paid experiment");
  assert(!professional.includes("төлөөд бүрэн тайлангаа нээх"), "professional output must not show paid CTA");

  setSevenDay({
    diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })]
  });
  const urgentHtml = _internal.renderReport();
  const urgent = normalize(urgentHtml);
  assert.strictEqual(_internal.reportMode().mode, "urgent", "urgent setup must route to urgent mode");
  assertLaunchSafeOutput(urgentHtml, "urgent output");
  assert(urgent.includes("Эхлээд таны аюулгүй байдал чухал"), "urgent output must include immediate safety guidance");
  assert(!urgent.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ"), "urgent output must not show ordinary paid depth");
  assert(!urgent.includes("14 хоногийн туршилт"), "urgent output must not show ordinary paid experiment");
  assert(!urgent.includes("төлөөд бүрэн тайлангаа нээх"), "urgent output must not show paid CTA");
});

console.log("final-public-launch-smoke tests passed");
