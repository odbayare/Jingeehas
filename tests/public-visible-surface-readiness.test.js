const assert = require("assert");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

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
  "QPay",
  "payment",
  "unlock",
  "premium",
  "diagnosis",
  "diagnose",
  "treatment",
  "treat",
  "medical cause",
  "medical-cause",
  "prescribe",
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

function assertIntegratedSurfaces(result, expectedSurfaces, label) {
  assert.strictEqual(result.pass, true, `${label}: integration should pass`);
  assert.strictEqual(result.integrationAttempted, true, `${label}: integration should be attempted`);
  assert.strictEqual(result.integrationEnabled, true, `${label}: integration should be enabled`);
  assert.deepStrictEqual(result.renderedSurfaces, expectedSurfaces, `${label}: unexpected surfaces`);
  assertNoForbiddenText(result.html, label);

  assert(result.html.includes("Аюулгүй байдлын сануулга"), `${label}: safety guidance must render`);
  assert.strictEqual(
    result.html.includes("Эхний товч зураглал"),
    expectedSurfaces.includes("preview"),
    `${label}: preview visibility mismatch`
  );
  assert.strictEqual(
    result.html.includes("Гүн тайлангийн хэсэг"),
    expectedSurfaces.includes("paid"),
    `${label}: paid visibility mismatch`
  );
}

function assertNoPaymentMutation(beforeState, beforeAccess, label) {
  const afterState = mockBackend.getMockBackendState();
  const afterAccess = {
    oneTime: _internal.hasOneTimeReportAccess(),
    sevenDay: _internal.hasSevenDayAccess(),
    upgrade: _internal.hasUpgradeAccess()
  };

  assert.deepStrictEqual(afterState.payments, beforeState.payments, `${label}: payments must not mutate`);
  assert.deepStrictEqual(afterState.entitlements, beforeState.entitlements, `${label}: entitlements must not mutate`);
  assert.deepStrictEqual(afterAccess, beforeAccess, `${label}: payment access booleans must not mutate`);
}

(async () => {
  assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "visible prototype guard must default false");
  assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, false, "runtime visible guard must default false");
  assert.strictEqual(typeof _internal.renderReportWithRuntimeVisibleSurface, "function", "runtime integration helper must exist");

  const { buildRuntimeAdapterPayloadFromFixtures } = await import("./driver-stack/runtimeAdapterPrototype.mjs");
  const payload = buildRuntimeAdapterPayloadFromFixtures(undefined, {
    generatedBy: "tests/public-visible-surface-readiness.test.js"
  });
  const baseHtml = `
    <section class="screen">
      <div class="panel runtime-report-base">
        <h2>Runtime report base</h2>
      </div>
    </section>
  `;

  setOneTime();
  const defaultBefore = _internal.renderReport();
  const defaultAfter = _internal.renderReport();
  assert.strictEqual(defaultAfter, defaultBefore, "default production renderReport output must remain unchanged");
  assert(!defaultAfter.includes("visible-surface-prototype"), "default production output must not include visible surfaces");
  assert(!defaultAfter.includes("Эхний товч зураглал"), "default production output must not include preview surface");
  assert(!defaultAfter.includes("Гүн тайлангийн хэсэг"), "default production output must not include paid surface");
  assert(!defaultAfter.includes("Аюулгүй байдлын сануулга"), "default production output must not include runtime visible safety surface");

  mockBackend.resetMockBackend();
  const backendBefore = mockBackend.getMockBackendState();
  const accessBefore = {
    oneTime: _internal.hasOneTimeReportAccess(),
    sevenDay: _internal.hasSevenDayAccess(),
    upgrade: _internal.hasUpgradeAccess()
  };

  const storageDescriptorBefore = Object.getOwnPropertyDescriptor(global, "localStorage");
  const localStorageCalls = [];
  Object.defineProperty(global, "localStorage", {
    configurable: true,
    value: {
      getItem(key) {
        localStorageCalls.push(["getItem", key]);
        return null;
      },
      setItem(key, value) {
        localStorageCalls.push(["setItem", key, value]);
      },
      removeItem(key) {
        localStorageCalls.push(["removeItem", key]);
      }
    }
  });

  const cases = [
    {
      label: "ordinary unpaid readiness",
      context: { mode: { mode: "ordinary" } },
      options: { enabled: true, hasPaidAccess: false, placement: "before-section-end" },
      expectedSurfaces: ["preview", "safety"]
    },
    {
      label: "ordinary paid readiness",
      context: { mode: { mode: "ordinary" } },
      options: { enabled: true, hasPaidAccess: true, placement: "before-section-end" },
      expectedSurfaces: ["preview", "paid", "safety"]
    },
    {
      label: "payment failed readiness",
      context: { mode: { mode: "ordinary" } },
      options: { enabled: true, hasPaidAccess: false, paymentState: "failed", placement: "before-section-end" },
      expectedSurfaces: ["preview", "safety"]
    },
    {
      label: "professional readiness",
      context: { mode: { mode: "professional" } },
      options: { enabled: true, hasPaidAccess: true, placement: "before-section-end" },
      expectedSurfaces: ["safety"]
    },
    {
      label: "urgent readiness",
      context: { mode: { mode: "urgent" } },
      options: { enabled: true, hasPaidAccess: true, placement: "before-section-end" },
      expectedSurfaces: ["safety"]
    }
  ];

  try {
    cases.forEach(testCase => {
      const result = _internal.renderReportWithRuntimeVisibleSurface(
        baseHtml,
        testCase.context,
        payload,
        testCase.options
      );
      assertIntegratedSurfaces(result, testCase.expectedSurfaces, testCase.label);

      if (!testCase.expectedSurfaces.includes("paid")) {
        assert(!result.html.includes("Гүн тайлангийн хэсэг"), `${testCase.label}: paid surface must not render`);
      }
      if (testCase.context.mode.mode === "professional" || testCase.context.mode.mode === "urgent") {
        assert(!result.html.includes("Эхний товч зураглал"), `${testCase.label}: preview must be suppressed`);
        assert(!result.html.includes("Гүн тайлангийн хэсэг"), `${testCase.label}: paid must be suppressed`);
      }
      assertNoPaymentMutation(backendBefore, accessBefore, testCase.label);
    });

    assert.deepStrictEqual(localStorageCalls, [], "readiness helper path must not read or mutate localStorage");
  } finally {
    delete global.localStorage;
    if (storageDescriptorBefore) Object.defineProperty(global, "localStorage", storageDescriptorBefore);
  }

  const finalReport = _internal.renderReport();
  assert.strictEqual(finalReport, defaultBefore, "readiness test path must not alter default report output");

  console.log("public-visible-surface-readiness tests passed");
})();
