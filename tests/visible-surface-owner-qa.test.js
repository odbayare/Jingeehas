const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");

const { _internal } = app;

const SNAPSHOT_PATH = path.join(
  "audits",
  "mvp-diagnostic-migration",
  "work-pack-21",
  "visible-surface-owner-qa-snapshots.md"
);

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
  "cause",
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

function assertSurfaceResult(result, expectedSurfaces, label) {
  assert.strictEqual(result.pass, true, `${label}: prototype result should pass`);
  assert.deepStrictEqual(result.renderedSurfaces, expectedSurfaces, `${label}: unexpected rendered surfaces`);
  assertNoForbiddenText(result.html, label);

  assert(!result.html.includes("internalDiagnostics"), `${label}: internalDiagnostics must not render`);
  assert(!result.html.includes("ownerDebug"), `${label}: ownerDebug must not render`);
  assert(result.html.includes("Аюулгүй байдлын сануулга"), `${label}: safety guidance must be visible`);

  const shouldShowPreview = expectedSurfaces.includes("preview");
  const shouldShowPaid = expectedSurfaces.includes("paid");
  assert.strictEqual(
    result.html.includes("Эхний товч зураглал"),
    shouldShowPreview,
    `${label}: preview surface visibility mismatch`
  );
  assert.strictEqual(
    result.html.includes("Гүн тайлангийн хэсэг"),
    shouldShowPaid,
    `${label}: paid surface visibility mismatch`
  );
}

function snapshotBlock(testCase, result) {
  return [
    `## ${testCase.name}`,
    "",
    `- Options: \`${JSON.stringify(testCase.options)}\``,
    `- Expected surfaces: \`${JSON.stringify(testCase.expectedSurfaces)}\``,
    `- Actual surfaces: \`${JSON.stringify(result.renderedSurfaces)}\``,
    `- Suppressed ordinary surfaces: \`${result.suppressed === true}\``,
    `- Pass: \`${result.pass === true}\``,
    "",
    "```html",
    result.html.trim(),
    "```",
    ""
  ].join("\n").replace(/[ \t]+$/gm, "");
}

(async () => {
  const { buildRuntimeAdapterPayloadFromFixtures } = await import("./driver-stack/runtimeAdapterPrototype.mjs");
  const payload = buildRuntimeAdapterPayloadFromFixtures(undefined, {
    generatedBy: "tests/visible-surface-owner-qa.test.js"
  });

  setOneTime();
  const reportBefore = _internal.renderReport();

  const cases = [
    {
      name: "ordinary unpaid",
      options: { enabled: true, hasPaidAccess: false, mode: "ordinary" },
      expectedSurfaces: ["preview", "safety"]
    },
    {
      name: "ordinary paid",
      options: { enabled: true, hasPaidAccess: true, mode: "ordinary" },
      expectedSurfaces: ["preview", "paid", "safety"]
    },
    {
      name: "payment failed",
      options: { enabled: true, hasPaidAccess: false, paymentState: "failed", mode: "ordinary" },
      expectedSurfaces: ["preview", "safety"]
    },
    {
      name: "report locked",
      options: { enabled: true, hasPaidAccess: false, reportLocked: true, mode: "ordinary" },
      expectedSurfaces: ["preview", "safety"]
    },
    {
      name: "professional mode",
      options: { enabled: true, hasPaidAccess: true, mode: "professional" },
      expectedSurfaces: ["safety"]
    },
    {
      name: "urgent mode",
      options: { enabled: true, hasPaidAccess: true, mode: "urgent" },
      expectedSurfaces: ["safety"]
    },
    {
      name: "professionalFirst true",
      options: { enabled: true, hasPaidAccess: true, professionalFirst: true },
      expectedSurfaces: ["safety"]
    },
    {
      name: "urgent true",
      options: { enabled: true, hasPaidAccess: true, urgent: true },
      expectedSurfaces: ["safety"]
    }
  ];

  const snapshotSections = [];
  cases.forEach(testCase => {
    const result = _internal.renderVisibleSurfacePrototype(payload, testCase.options);
    assertSurfaceResult(result, testCase.expectedSurfaces, testCase.name);

    if (testCase.expectedSurfaces.includes("paid")) {
      assert.strictEqual(testCase.options.hasPaidAccess, true, `${testCase.name}: paid sections require paid access`);
    } else {
      assert(!result.html.includes("Гүн тайлангийн хэсэг"), `${testCase.name}: paid surface must stay hidden`);
    }

    if (testCase.options.mode === "professional" || testCase.options.mode === "urgent" || testCase.options.professionalFirst === true || testCase.options.urgent === true) {
      assert.strictEqual(result.suppressed, true, `${testCase.name}: ordinary surfaces should be suppressed`);
      assert.deepStrictEqual(result.renderedSurfaces, ["safety"], `${testCase.name}: safety-only output expected`);
    }

    snapshotSections.push(snapshotBlock(testCase, result));
  });

  const disabled = _internal.renderVisibleSurfacePrototype(payload, {
    enabled: false,
    hasPaidAccess: true,
    mode: "ordinary"
  });
  assert.strictEqual(disabled.html, "", "disabled visible prototype must return empty HTML");
  assert.strictEqual(disabled.prototypeAttempted, false, "disabled visible prototype must not attempt render");

  const reportAfter = _internal.renderReport();
  assert.strictEqual(reportAfter, reportBefore, "default renderReport output must remain unchanged");

  fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
  fs.writeFileSync(
    SNAPSHOT_PATH,
    [
      "# WP21 Visible Surface Owner QA Snapshots",
      "",
      "Generated by `tests/visible-surface-owner-qa.test.js`.",
      "",
      "Production release is NOT approved by WP21.",
      "",
      ...snapshotSections
    ].join("\n"),
    "utf8"
  );

  console.log("visible-surface-owner-qa tests passed");
})();
