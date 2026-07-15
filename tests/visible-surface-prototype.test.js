const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;

const FORBIDDEN_HTML_TEXT = [
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
  "pcos_body_uncertainty_control",
  "owner_recommended",
  "test_only",
  "mode1",
  "diagnosis",
  "diagnose",
  "treatment",
  "treat",
  "prescribe",
  "QPay",
  "checkout",
  "unlock",
  "payment",
  "₮"
];

function assertNoForbiddenText(html, label) {
  FORBIDDEN_HTML_TEXT.forEach(text => {
    assert(!String(html).includes(text), `${label}: rendered HTML leaked ${text}`);
  });
}

function setOneTime(overrides = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    removedFeaturePaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-W04": ["Мацаг"],
      "S1-M01": "Өдөр бага идээд орой нөхөх",
      "S1-F01": ["Дараа өлсөхөөс санаа зовсон", "Өөрийгөө шагнамаар"]
    },
    preliminary: [{ key: "hungerSafety", score: 5, label: "хүчтэй нийцэж байна" }],
    removedEntries: [],
    ...overrides
  });
}

(async () => {
  const source = fs.readFileSync("app.js", "utf8");
  assert(source.includes("const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;"), "visible prototype flag must default false");
  assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "exported visible prototype flag must remain false");
  assert.strictEqual(typeof _internal.renderVisibleSurfacePrototype, "function");

  const expectedArtifacts = [
    "OWNER_REVIEW_PACK_WP20.md",
    "appjs-visible-surface-implementation-notes.md",
    "limited-visible-surface-prototype-summary.md",
    "surface-rendering-behavior-report.md",
    "visible-surface-safety-copy-scan.md",
    "visible-surface-test-coverage.md",
    "work-pack-20-recommendation.md",
    "wp20-risk-register.md",
    "wp20-rollback-record.md"
  ].sort();
  const actualArtifacts = fs.readdirSync("audits/mvp-diagnostic-migration/work-pack-20").sort();
  assert.deepStrictEqual(actualArtifacts, expectedArtifacts, "WP20 owner-review artifact set must match exact required contract");

  const { buildRuntimeAdapterPayloadFromFixtures } = await import("./driver-stack/runtimeAdapterPrototype.mjs");
  const payload = buildRuntimeAdapterPayloadFromFixtures(undefined, {
    generatedBy: "tests/visible-surface-prototype.test.js"
  });

  setOneTime();
  const reportBefore = _internal.renderReport();
  const stateBefore = JSON.stringify(_internal.getTestState());
  const disabled = _internal.renderVisibleSurfacePrototype(payload, {
    enabled: false,
    hasPaidAccess: true,
    mode: "ordinary"
  });
  const reportAfter = _internal.renderReport();
  const stateAfter = JSON.stringify(_internal.getTestState());

  assert.strictEqual(disabled.prototypeAttempted, false, "disabled prototype must not attempt rendering");
  assert.strictEqual(disabled.visiblePrototypeEnabled, false, "disabled prototype must report disabled");
  assert.strictEqual(disabled.html, "", "disabled prototype must not return visible HTML");
  assert.strictEqual(disabled.pass, true, "disabled prototype no-op must pass");
  assert.strictEqual(reportAfter, reportBefore, "disabled visible prototype changed report HTML");
  assert.strictEqual(stateAfter, stateBefore, "disabled visible prototype changed state");

  const unpaid = _internal.renderVisibleSurfacePrototype(payload, {
    enabled: true,
    hasPaidAccess: false,
    paymentState: "failed",
    mode: "ordinary"
  });
  assert.strictEqual(unpaid.pass, true, "unpaid prototype should pass for preview plus safety");
  assert.deepStrictEqual(unpaid.renderedSurfaces, ["preview", "safety"]);
  assert(unpaid.html.includes("Эхний товч зураглал"), "preview surface should render behind explicit test guard");
  assert(unpaid.html.includes("Аюулгүй байдлын сануулга"), "safety surface should render without payment");
  assert(!unpaid.html.includes("Дэлгэрэнгүй тайлангийн хэсэг"), "paid surface must not render without paid access");
  assertNoForbiddenText(unpaid.html, "unpaid/payment-failed prototype");

  const paid = _internal.renderVisibleSurfacePrototype(payload, {
    enabled: true,
    hasPaidAccess: true,
    mode: "ordinary"
  });
  assert.strictEqual(paid.pass, true, "paid prototype should pass");
  assert.deepStrictEqual(paid.renderedSurfaces, ["preview", "paid", "safety"]);
  assert(paid.html.includes("Дэлгэрэнгүй тайлангийн хэсэг"), "paid surface should render with paid access");
  assertNoForbiddenText(paid.html, "paid prototype");

  ["professional", "urgent"].forEach(mode => {
    const suppressed = _internal.renderVisibleSurfacePrototype(payload, {
      enabled: true,
      hasPaidAccess: true,
      mode
    });
    assert.strictEqual(suppressed.pass, true, `${mode}: suppression should pass`);
    assert.strictEqual(suppressed.suppressed, true, `${mode}: ordinary surfaces must be suppressed`);
    assert.deepStrictEqual(suppressed.renderedSurfaces, ["safety"], `${mode}: safety guidance must remain renderable`);
    assert(suppressed.html.includes("Аюулгүй байдлын сануулга"), `${mode}: safety guidance should render`);
    assert(!suppressed.html.includes("Эхний товч зураглал"), `${mode}: preview surface must be suppressed`);
    assert(!suppressed.html.includes("Дэлгэрэнгүй тайлангийн хэсэг"), `${mode}: paid surface must be suppressed`);
    assertNoForbiddenText(suppressed.html, `${mode} safety-only prototype`);
  });

  [
    ["professionalFirst", { professionalFirst: true }],
    ["urgent flag", { urgent: true }]
  ].forEach(([label, flagOptions]) => {
    const suppressed = _internal.renderVisibleSurfacePrototype(payload, {
      enabled: true,
      hasPaidAccess: true,
      ...flagOptions
    });
    assert.strictEqual(suppressed.pass, true, `${label}: suppression should pass`);
    assert.strictEqual(suppressed.suppressed, true, `${label}: ordinary surfaces must be suppressed`);
    assert.deepStrictEqual(suppressed.renderedSurfaces, ["safety"], `${label}: safety guidance must remain renderable`);
    assert(suppressed.html.includes("Аюулгүй байдлын сануулга"), `${label}: safety guidance should render`);
    assert(!suppressed.html.includes("Эхний товч зураглал"), `${label}: preview surface must be suppressed`);
    assert(!suppressed.html.includes("Дэлгэрэнгүй тайлангийн хэсэг"), `${label}: paid surface must be suppressed`);
    assertNoForbiddenText(suppressed.html, `${label} safety-only prototype`);
  });

  const maliciousPayload = {
    ...payload,
    previewSections: [
      {
        title: "previewSections diagnosis QPay",
        body: "fixtureName all_or_nothing_restriction_rebound treatment payment 99,000₮"
      }
    ],
    paidSections: [
      {
        title: "ownerDebug prescribe checkout",
        body: "runtimeGate decisionStatus rendererMode test_only mode1"
      }
    ],
    safetyGuidanceSections: [
      {
        title: "safetyGuidanceSections unlock",
        body: "internalDiagnostics owner_recommended pcos_body_uncertainty_control diagnose"
      }
    ]
  };
  const sanitized = _internal.renderVisibleSurfacePrototype(maliciousPayload, {
    enabled: true,
    hasPaidAccess: true,
    mode: "ordinary"
  });
  assert.strictEqual(sanitized.pass, true, "sanitized malicious payload should still render safe allowed surfaces");
  assertNoForbiddenText(sanitized.html, "sanitized malicious prototype");

  setOneTime({ oneTimePaid: false });
  const entitlementBefore = {
    oneTime: _internal.hasOneTimeReportAccess()
  };
  _internal.renderVisibleSurfacePrototype(payload, {
    enabled: true,
    hasPaidAccess: false,
    paymentState: "failed",
    mode: "ordinary"
  });
  assert.deepStrictEqual({
    oneTime: _internal.hasOneTimeReportAccess()
  }, entitlementBefore, "visible prototype must not change entitlement restore/reload behavior");

  const storageDescriptorBefore = Object.getOwnPropertyDescriptor(global, "localStorage");
  const consoleLogBefore = console.log;
  let storageAccessed = false;
  let logged = false;
  Object.defineProperty(global, "localStorage", {
    configurable: true,
    get() {
      storageAccessed = true;
      throw new Error("visible prototype must not read localStorage");
    }
  });
  console.log = () => {
    logged = true;
    throw new Error("visible prototype must not log");
  };

  _internal.renderVisibleSurfacePrototype(payload, {
    enabled: true,
    hasPaidAccess: true,
    mode: "ordinary"
  });

  console.log = consoleLogBefore;
  delete global.localStorage;
  if (storageDescriptorBefore) Object.defineProperty(global, "localStorage", storageDescriptorBefore);

  assert.strictEqual(storageAccessed, false, "visible prototype must not read localStorage");
  assert.strictEqual(logged, false, "visible prototype must not log");

  [
    "const STORAGE_KEY = \"weightLossDeepPatternMvp\";",
    "oneTime: \"9,900₮\"",
    "const WEIGHT_TEST_PRODUCT_CODE = \"WEIGHT_TEST_ONE_TIME\";",
    "const WEIGHT_TEST_AMOUNT_MNT = 9900;",
    "create: \"/.netlify/functions/qpay-create-invoice\"",
    "check: \"/.netlify/functions/qpay-check-payment\""
  ].forEach(expected => assert(source.includes(expected), `missing unchanged contract: ${expected}`));

  console.log("visible-surface-prototype tests passed");
})();
