const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");
const cssSource = fs.readFileSync("styles.css", "utf8");

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
      name: "Conversion QA",
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

function assertNoBadConversionCopy(text, label) {
  [
    "fake scarcity",
    "limited seats",
    "хязгаарлагдмал суудал",
    "сүүлийн боломж",
    "алдана",
    "хоцорно",
    "аймшиг",
    "өөрөөсөө ич",
    "ичгүүрээр шах",
    "залхуу",
    "заавал",
    "амжилтгүй",
    "сахилгагүй"
  ].forEach(phrase => {
    assert(!String(text).toLowerCase().includes(phrase), `${label}: bad conversion copy present: ${phrase}`);
  });
}

function assertSafeOutput(html, label, options = {}) {
  const text = normalize(html);
  assertNoInternalLeak(html, label);
  assertNoBadConversionCopy(text, label);
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
    "rendering conversion/paywall states must not mutate localStorage"
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
assert(appSource.includes("const WEIGHT_TEST_AMOUNT_MNT = 9900;"), "QPay amount constant must remain unchanged");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "QPay product code must remain unchanged");
assert(appSource.includes('create: "https://www.lifepattern.live/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "https://www.lifepattern.live/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");
assert(appSource.includes("return Boolean(isInternalTestMode() || state.sevenDayPaid || state.upgradePaid || access.hasSevenDayAccess);"), "seven-day entitlement helper must remain unchanged");
assert(appSource.includes("return Boolean(isQaPaymentBypassEnabled() || isInternalTestMode() || state.oneTimePaid || state.qpayPayment?.status === \"paid\" || access.hasOneTimeReportAccess);"), "one-time entitlement helper must keep paid-state and entitlement guards");
assert(appSource.includes("return Boolean(state.upgradePaid || access.hasUpgradeAccess);"), "upgrade entitlement helper must remain unchanged");

assert(cssSource.includes(".paywall-panel"), "CSS must retain paywall panel hook");
assert(cssSource.includes(".paywall-detail-grid"), "CSS must include WP33 paywall detail hook");
assert(/\.paywall-detail-grid[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/.test(cssSource), "paywall detail grid must define stable desktop columns");
assert(/@media \(max-width:\s*820px\)[\s\S]*\.paywall-detail-grid[\s\S]*grid-template-columns:\s*1fr/.test(cssSource), "paywall detail grid must collapse on smaller screens");

mockBackend.resetMockBackend();

withLocalStorageMutationSpy(() => {
  setOneTime();
  const unpaidHtml = _internal.renderReport();
  const unpaid = normalize(unpaidHtml);
  assertSafeOutput(unpaidHtml, "unpaid locked output");
  assert(unpaid.includes("Энэ хэсэг төлбөргүй хэвээр харагдана"), "unpaid output must explain the free preview");
  assert(unpaid.includes("Эхний товч зураглал"), "unpaid output must include the visible surface preview");
  assert(unpaid.includes("Бүрэн тайлангаа нээвэл юу нэмэгдэх вэ"), "unpaid output must clearly explain paid report value");
  assert(unpaid.includes("Бүрэн тайлан нээх"), "unpaid output must include a clear paid section heading");
  assert(unpaid.includes("9,900₮ төлөөд бүрэн тайлангаа нээх"), "unpaid output must include clear paid CTA");
  assert(!unpaid.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ"), "unpaid output must not include paid-only depth section");
  assert(!unpaid.includes("Давтагддаг тойрог"), "unpaid output must not include paid-only cycle depth");

  setOneTime({ oneTimePaid: true });
  const paidHtml = _internal.renderReport();
  const paid = normalize(paidHtml);
  assertSafeOutput(paidHtml, "paid output", { requireSafety: false });
  assert(paid.includes("2. Таны гол давтагдаж буй механизм"), "paid output must include paid report explanation");
  assert(paid.includes("8. 7–14 хоногийн туршилт"), "paid output must include paid experiment depth");
  assert(!paid.includes("Бүрэн тайлангаа нээвэл юу нэмэгдэх вэ"), "paid output must not show the locked paywall explanation");
  assert(!paid.includes("9,900₮ төлөөд бүрэн тайлангаа нээх"), "paid output must not show the locked paywall CTA");

  setOneTime({
    qpayPayment: {
      status: "error",
      message: "Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно.",
      invoice: null
    }
  });
  const failedHtml = _internal.renderReport();
  const failed = normalize(failedHtml);
  assertSafeOutput(failedHtml, "payment failed output");
  assert(failed.includes("Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно"), "payment failed output must use safe retry wording");
  assert(failed.includes("Таны эхний дохио хэвээр харагдана"), "payment failed output must not imply the free preview disappeared");

  setSevenDay({
    diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })]
  });
  const professionalHtml = _internal.renderReport();
  const professional = normalize(professionalHtml);
  assert.strictEqual(_internal.reportMode().mode, "professional", "professional setup must route to professional mode");
  assertSafeOutput(professionalHtml, "professional output");
  assert(professional.includes("Доорх богино нэгтгэлийг мэргэжлийн хүнтэй ярилцахдаа авч очиж болно."), "professional output must keep safety guidance visible");
  assert(!professional.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ"), "professional output must not show ordinary paid depth");
  assert(!professional.includes("14 хоногийн туршилт"), "professional output must not show ordinary paid experiment");
  assert(!professional.includes("төлөөд бүрэн тайлангаа нээх"), "professional output must not show paid CTA");

  setSevenDay({
    diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })]
  });
  const urgentHtml = _internal.renderReport();
  const urgent = normalize(urgentHtml);
  assert.strictEqual(_internal.reportMode().mode, "urgent", "urgent setup must route to urgent mode");
  assertSafeOutput(urgentHtml, "urgent output");
  assert(urgent.includes("Эхлээд таны аюулгүй байдал чухал"), "urgent output must keep immediate safety guidance visible");
  assert(!urgent.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ"), "urgent output must not show ordinary paid depth");
  assert(!urgent.includes("14 хоногийн туршилт"), "urgent output must not show ordinary paid experiment");
  assert(!urgent.includes("төлөөд бүрэн тайлангаа нээх"), "urgent output must not show paid CTA");
});

console.log("conversion-paywall-ux-polish tests passed");
