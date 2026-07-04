const assert = require("assert");
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
    assert(!String(html).includes(text), `${label}: integrated HTML leaked ${text}`);
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
  assert.deepStrictEqual(result.renderedSurfaces, expectedSurfaces, `${label}: unexpected surface placement`);
  assertNoForbiddenText(result.html, label);

  assert(result.html.includes("runtime-report-base"), `${label}: base report HTML should remain`);
  assert(result.html.includes("Аюулгүй байдлын сануулга"), `${label}: safety guidance should render`);
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
  assert(result.html.indexOf("visible-surface-prototype") > result.html.indexOf("runtime-report-base"), `${label}: visible surfaces should be placed after base report content`);
}

(async () => {
  assert.strictEqual(_internal.ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION, false, "runtime visible integration guard must default false");
  assert.strictEqual(typeof _internal.renderReportWithRuntimeVisibleSurface, "function");

  const { buildRuntimeAdapterPayloadFromFixtures } = await import("./driver-stack/runtimeAdapterPrototype.mjs");
  const payload = buildRuntimeAdapterPayloadFromFixtures(undefined, {
    generatedBy: "tests/runtime-visible-surface-integration.test.js"
  });
  const baseHtml = `
    <section class="screen">
      <div class="panel runtime-report-base">
        <h2>Runtime report base</h2>
      </div>
    </section>
  `;

  setOneTime();
  const reportBefore = _internal.renderReport();
  const reportAfter = _internal.renderReport();
  assert.strictEqual(reportAfter, reportBefore, "default renderReport output must remain unchanged");
  assert(!reportAfter.includes("visible-surface-prototype"), "default renderReport must not include visible prototype surfaces");
  assert(!reportAfter.includes("Эхний товч зураглал"), "default renderReport must not include preview surface label");
  assert(!reportAfter.includes("Дэлгэрэнгүй тайлангийн хэсэг"), "default renderReport must not include paid surface label");
  assert(!reportAfter.includes("Аюулгүй байдлын сануулга"), "default renderReport must not include runtime visible safety label");

  const disabled = _internal.renderReportWithRuntimeVisibleSurface(
    baseHtml,
    { mode: { mode: "ordinary" } },
    payload,
    { enabled: false, hasPaidAccess: true }
  );
  assert.deepStrictEqual(disabled, {
    integrationAttempted: false,
    integrationEnabled: false,
    placement: null,
    renderedSurfaces: [],
    html: baseHtml,
    pass: true,
    errors: []
  }, "disabled integration must be a no-op");

  const unpaid = _internal.renderReportWithRuntimeVisibleSurface(
    baseHtml,
    { mode: { mode: "ordinary" } },
    payload,
    { enabled: true, hasPaidAccess: false, placement: "before-section-end" }
  );
  assertIntegratedSurfaces(unpaid, ["preview", "safety"], "ordinary unpaid integration");
  assert(unpaid.html.lastIndexOf("visible-surface-prototype") < unpaid.html.lastIndexOf("</section>"), "surface HTML should be placed before section end");

  const paid = _internal.renderReportWithRuntimeVisibleSurface(
    baseHtml,
    { mode: { mode: "ordinary" } },
    payload,
    { enabled: true, hasPaidAccess: true, placement: "before-section-end" }
  );
  assertIntegratedSurfaces(paid, ["preview", "paid", "safety"], "ordinary paid integration");

  [
    ["professional mode integration", { mode: { mode: "professional" } }, { enabled: true, hasPaidAccess: true }],
    ["urgent mode integration", { mode: { mode: "urgent" } }, { enabled: true, hasPaidAccess: true }],
    ["professionalFirst integration", { mode: { mode: "ordinary" } }, { enabled: true, hasPaidAccess: true, professionalFirst: true }],
    ["urgent flag integration", { mode: { mode: "ordinary" } }, { enabled: true, hasPaidAccess: true, urgent: true }]
  ].forEach(([label, context, options]) => {
    const result = _internal.renderReportWithRuntimeVisibleSurface(baseHtml, context, payload, options);
    assertIntegratedSurfaces(result, ["safety"], label);
    assert.strictEqual(result.html.includes("Эхний товч зураглал"), false, `${label}: preview must be suppressed`);
    assert.strictEqual(result.html.includes("Дэлгэрэнгүй тайлангийн хэсэг"), false, `${label}: paid must be suppressed`);
  });

  console.log("runtime-visible-surface-integration tests passed");
})();
