const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;

const FORBIDDEN_HTML_TEXT = [
  "previewSections",
  "paidSections",
  "safetyGuidanceSections",
  "internalDiagnostics",
  "ownerDebug",
  "fixtureName",
  "all_or_nothing_restriction_rebound",
  "pcos_body_uncertainty_control",
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

function reportContext(overrides = {}) {
  return {
    mode: { mode: "ordinary" },
    primary: { key: "hungerSafety" },
    secondary: [{ key: "rewardDeficit" }, { key: "executiveLoad" }],
    packageType: "one-time",
    readiness: { count: 0 },
    quality: { label: "эхний зураглал" },
    tags: ["hungerSafety"],
    ...overrides
  };
}

function assertSurfaceResult(result, expectedSurfaces, label) {
  assert.strictEqual(result.pass, true, `${label}: integration should pass`);
  assert.strictEqual(result.integrationAttempted, true, `${label}: integration should be attempted`);
  assert.deepStrictEqual(result.renderedSurfaces, expectedSurfaces, `${label}: unexpected rendered surfaces`);
  assertNoForbiddenText(result.html, label);
  assert(result.html.includes("Аюулгүй байдлын сануулга"), `${label}: safety surface must render`);
  assert.strictEqual(
    result.html.includes("Эхний товч зураглал"),
    expectedSurfaces.includes("preview"),
    `${label}: preview visibility mismatch`
  );
  assert.strictEqual(
    result.html.includes("Дэлгэрэнгүй тайлангийн хэсэг"),
    expectedSurfaces.includes("paid"),
    `${label}: paid visibility mismatch`
  );
}

(async () => {
  const source = fs.readFileSync("app.js", "utf8");
  assert(source.includes("const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;"), "prototype guard must remain false");
  assert(source.includes("const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = false;"), "runtime visible guard must remain false");
  assert.strictEqual(_internal.ENABLE_VISIBLE_SURFACE_PROTOTYPE, false, "exported prototype guard must remain false");
  assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, false, "exported runtime visible guard must remain false");
  assert.strictEqual(typeof _internal.buildRuntimeVisibleSurfacePayload, "function", "runtime payload builder must exist");
  assert(source.includes("buildRuntimeVisibleSurfacePayload(reportContext)"), "renderReport call sites must pass runtime payload builder output");

  const payload = _internal.buildRuntimeVisibleSurfacePayload(reportContext());
  assert.strictEqual(payload.version, "runtime-visible-surface-payload-v0");
  assert.strictEqual(payload.adapterMode, "runtime_visible_surface_v0");
  assert.strictEqual(payload.source, "runtime_report_context");
  assert.strictEqual(payload.generatedFrom, "app.renderReport");
  assert.strictEqual(payload.reportSurface, "runtime_visible_surface");
  assert.strictEqual(payload.runtimeSafetyGate.canRenderInRuntime, false);
  assert.strictEqual(payload.runtimeSafetyGate.status, "HOLD");
  assert.strictEqual(payload.paymentGate.safetyGuidanceRequiresPayment, false);
  assert.strictEqual(payload.paymentGate.paidSectionsRequirePaidAccess, true);
  assert.strictEqual(payload.pass, true);
  assert(!Object.prototype.hasOwnProperty.call(payload, "internalDiagnostics"), "runtime payload must not expose internalDiagnostics");
  assert(!Object.prototype.hasOwnProperty.call(payload, "ownerDebug"), "runtime payload must not expose ownerDebug");
  assert.notStrictEqual(payload.adapterMode, "test_only", "runtime payload must not use WP14 test fixture adapter mode");

  mockBackend.resetMockBackend();
  setOneTime();
  const reportBefore = _internal.renderReport();
  const stateBefore = JSON.stringify(_internal.getTestState());
  const backendBefore = mockBackend.getMockBackendState();
  const reportAfter = _internal.renderReport();
  assert.strictEqual(reportAfter, reportBefore, "default renderReport output must remain unchanged while guard is false");
  assert.strictEqual(JSON.stringify(_internal.getTestState()), stateBefore, "default renderReport must not mutate state");
  assert.deepStrictEqual(mockBackend.getMockBackendState().payments, backendBefore.payments, "default renderReport must not mutate payments");
  assert.deepStrictEqual(mockBackend.getMockBackendState().entitlements, backendBefore.entitlements, "default renderReport must not mutate entitlements");
  assert(!reportAfter.includes("visible-surface-prototype"), "default renderReport must not include visible surfaces while guard is false");

  const baseHtml = `
    <section class="screen">
      <div class="panel runtime-report-base">
        <h2>Runtime report base</h2>
      </div>
    </section>
  `;

  const unpaid = _internal.renderReportWithRuntimeVisibleSurface(
    baseHtml,
    reportContext(),
    payload,
    { enabled: true, hasPaidAccess: false, placement: "before-section-end" }
  );
  assertSurfaceResult(unpaid, ["preview", "safety"], "runtime unpaid payload connection");

  const paid = _internal.renderReportWithRuntimeVisibleSurface(
    baseHtml,
    reportContext(),
    payload,
    { enabled: true, hasPaidAccess: true, placement: "before-section-end" }
  );
  assertSurfaceResult(paid, ["preview", "paid", "safety"], "runtime paid payload connection");

  [
    ["professional runtime payload connection", reportContext({ mode: { mode: "professional" } })],
    ["urgent runtime payload connection", reportContext({ mode: { mode: "urgent" } })]
  ].forEach(([label, context]) => {
    const safetyOnly = _internal.renderReportWithRuntimeVisibleSurface(
      baseHtml,
      context,
      _internal.buildRuntimeVisibleSurfacePayload(context),
      { enabled: true, hasPaidAccess: true, placement: "before-section-end" }
    );
    assertSurfaceResult(safetyOnly, ["safety"], label);
  });

  console.log("runtime-visible-surface-payload-connection tests passed");
})();
