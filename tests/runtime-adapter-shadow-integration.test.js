const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;

const ADAPTER_FIELD_LEAKS = [
  "previewSections",
  "paidSections",
  "safetyGuidanceSections",
  "internalDiagnostics",
  "ownerDebug",
  "runtimeGate",
  "decisionStatus",
  "rendererMode",
  "fixtureName",
  "all_or_nothing_restriction_rebound",
  "pcos_body_uncertainty_control"
];

function entry(day, overrides = {}) {
  return {
    diary_id: `shadow-${day}`,
    day_number: day,
    date: "2026-07-03",
    meal_rhythm: "Хоолны хооронд 5+ цагийн зай гарсан",
    unplanned_eating_count: "Тийм, 1 удаа",
    main_moment_time: "Орой",
    hunger_level: "8",
    food_function: ["Өөрийгөө шагнамаар байсан", "Хамгийн амар сонголт байсан"],
    emotion: "Ядаргаа",
    energy_score: "2",
    stress_score: "5",
    sleep: ["6-8 цаг"],
    movement: "Бага зэрэг алхсан",
    body_signals: ["Аль нь ч үгүй"],
    pattern_probes: {},
    ...overrides
  };
}

function entries(count, overrides = {}) {
  return Array.from({ length: count }, (_, index) => entry(index + 1, overrides));
}

function setOneTime(overrides = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
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
    stageAnswers: {
      "S1-W04": ["Мацаг", "Орой хоол идэхгүй"]
    },
    preliminary: [
      { key: "hungerSafety", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "executive", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    diaryEntries: entries(5),
    ...overrides
  });
}

function assertNoAdapterFieldsInHtml(html, label) {
  ADAPTER_FIELD_LEAKS.forEach(field => {
    assert(!String(html).includes(field), `${label}: rendered HTML leaked adapter field ${field}`);
  });
}

function assertRenderUnchanged(setup, label) {
  setup();
  const before = _internal.renderReport();
  const stateBefore = JSON.stringify(_internal.getTestState());
  const disabledSignal = _internal.prepareRuntimeAdapterShadowSignal(
    { mode: { mode: "ordinary" }, packageType: _internal.getTestState().packageType },
    { adapterMode: "wrong" },
    { enabled: false }
  );
  const after = _internal.renderReport();
  const stateAfter = JSON.stringify(_internal.getTestState());

  assert.strictEqual(disabledSignal.shadowAttempted, false, `${label}: disabled shadow must not attempt adapter work`);
  assert.strictEqual(disabledSignal.pass, true, `${label}: disabled shadow must pass as a no-op`);
  assert.strictEqual(after, before, `${label}: disabled shadow path changed report HTML`);
  assert.strictEqual(stateAfter, stateBefore, `${label}: disabled shadow path changed state`);
  assertNoAdapterFieldsInHtml(after, label);
}

(async () => {
  const source = fs.readFileSync("app.js", "utf8");
  assert(source.includes("const ENABLE_RUNTIME_ADAPTER_SHADOW = false;"), "shadow flag must default false");
  assert.strictEqual(_internal.ENABLE_RUNTIME_ADAPTER_SHADOW, false, "exported shadow flag must remain false");
  assert.strictEqual(typeof _internal.prepareRuntimeAdapterShadowSignal, "function");

  [
    ["one-time paid", () => setOneTime()],
    ["one-time unpaid", () => setOneTime({ oneTimePaid: false })],
    ["seven-day full", () => setSevenDay()],
    ["seven-day readiness hold", () => setSevenDay({ diaryEntries: entries(3) })],
    ["professional", () => setSevenDay({ stageAnswers: { "S1-S03": "Одоо давтагддаг" } })],
    ["urgent", () => setSevenDay({ stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" } })]
  ].forEach(([label, setup]) => assertRenderUnchanged(setup, label));

  setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false });
  assert.strictEqual(_internal.hasOneTimeReportAccess(), false);
  assert.strictEqual(_internal.hasSevenDayAccess(), false);
  assert.strictEqual(_internal.hasUpgradeAccess(), false);
  _internal.prepareRuntimeAdapterShadowSignal({}, null, { enabled: false });
  assert.strictEqual(_internal.hasOneTimeReportAccess(), false);
  assert.strictEqual(_internal.hasSevenDayAccess(), false);
  assert.strictEqual(_internal.hasUpgradeAccess(), false);

  [
    "const STORAGE_KEY = \"weightLossDeepPatternMvp\";",
    "oneTime: \"29,000₮\"",
    "sevenDayAnchor: \"69,000₮\"",
    "const WEIGHT_TEST_PRODUCT_CODE = \"WEIGHT_TEST_ONE_TIME\";",
    "const WEIGHT_TEST_AMOUNT_MNT = 9900;",
    "create: \"/.netlify/functions/qpay-create-invoice\"",
    "check: \"/.netlify/functions/qpay-check-payment\""
  ].forEach(expected => assert(source.includes(expected), `missing unchanged contract: ${expected}`));

  const storageDescriptorBefore = Object.getOwnPropertyDescriptor(global, "localStorage");
  const consoleLogBefore = console.log;
  let storageAccessed = false;
  let logged = false;
  Object.defineProperty(global, "localStorage", {
    configurable: true,
    get() {
      storageAccessed = true;
      throw new Error("shadow helper must not read localStorage");
    }
  });
  console.log = () => {
    logged = true;
    throw new Error("shadow helper must not log");
  };

  const { buildRuntimeAdapterPayloadFromFixtures } = await import("./driver-stack/runtimeAdapterPrototype.mjs");
  const payload = buildRuntimeAdapterPayloadFromFixtures(undefined, {
    generatedBy: "tests/runtime-adapter-shadow-integration.test.js"
  });
  const enabledSignal = _internal.prepareRuntimeAdapterShadowSignal(
    {
      mode: { mode: "ordinary" },
      ranked: [],
      primary: null,
      secondary: [],
      packageType: "one-time",
      readiness: { canGenerateFullReport: true },
      stageEvidence: [],
      narrativeEvidence: [],
      tags: []
    },
    payload,
    { enabled: true }
  );

  console.log = consoleLogBefore;
  delete global.localStorage;
  if (storageDescriptorBefore) Object.defineProperty(global, "localStorage", storageDescriptorBefore);

  assert.strictEqual(storageAccessed, false, "shadow helper must not read localStorage");
  assert.strictEqual(logged, false, "shadow helper must not log");
  assert.deepStrictEqual(Object.keys(enabledSignal), [
    "shadowAttempted",
    "shadowEnabled",
    "adapterMode",
    "reportSurface",
    "runtimeCanRender",
    "safetyGuidanceRequiresPayment",
    "pass",
    "errors"
  ]);
  assert.deepStrictEqual(enabledSignal, {
    shadowAttempted: true,
    shadowEnabled: true,
    adapterMode: "test_only",
    reportSurface: "prototype_only",
    runtimeCanRender: false,
    safetyGuidanceRequiresPayment: false,
    pass: true,
    errors: []
  });

  const badEnabledSignal = _internal.prepareRuntimeAdapterShadowSignal(
    { localStorage: {} },
    { adapterMode: "test_only", reportSurface: "prototype_only", runtimeSafetyGate: { canRenderInRuntime: false, status: "HOLD" }, paymentGate: { safetyGuidanceRequiresPayment: false }, pass: true },
    { enabled: true }
  );
  assert.strictEqual(badEnabledSignal.pass, false, "enabled shadow must reject forbidden context fields");
  assert(badEnabledSignal.errors.some(error => error.includes("forbidden field: localStorage")));

  console.log("runtime-adapter-shadow-integration tests passed");
})();
