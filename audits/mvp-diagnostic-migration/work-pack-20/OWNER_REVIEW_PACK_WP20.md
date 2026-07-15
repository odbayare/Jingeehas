# OWNER REVIEW PACK WP20

## Recommendation Enum

READY FOR OWNER REVIEW OF LIMITED VISIBLE SURFACE PROTOTYPE

## Required Conclusion

Production release is NOT approved by WP20.

## Guard

`ENABLE_VISIBLE_SURFACE_PROTOTYPE = false`

```js
const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;
```

## Scope Boundary

WP20 is a limited, disabled-by-default visible surface prototype for adapter payload surfaces.

Allowed prototype surfaces:

- `previewSections`
- `paidSections`
- `safetyGuidanceSections`

Forbidden rendered surfaces:

- `internalDiagnostics`
- `ownerDebug`

WP20 does not approve deploy, PDF generation, payment, QPay, backend, pricing, entitlement, WP14 adapter contract changes, or production visible rendering.

## Exact Required Artifact Set

```text
audits/mvp-diagnostic-migration/work-pack-20/limited-visible-surface-prototype-summary.md
audits/mvp-diagnostic-migration/work-pack-20/appjs-visible-surface-implementation-notes.md
audits/mvp-diagnostic-migration/work-pack-20/surface-rendering-behavior-report.md
audits/mvp-diagnostic-migration/work-pack-20/visible-surface-test-coverage.md
audits/mvp-diagnostic-migration/work-pack-20/visible-surface-safety-copy-scan.md
audits/mvp-diagnostic-migration/work-pack-20/wp20-rollback-record.md
audits/mvp-diagnostic-migration/work-pack-20/wp20-risk-register.md
audits/mvp-diagnostic-migration/work-pack-20/work-pack-20-recommendation.md
audits/mvp-diagnostic-migration/work-pack-20/OWNER_REVIEW_PACK_WP20.md
```

## Repository State And Actual Outputs

### `git status --short`

```text
 M app.js
 M tests/run-all.js
?? audits/mvp-diagnostic-migration/work-pack-20/
?? audits/sprint-36-paid-depth-prototype/
?? tests/visible-surface-prototype.test.js
```

### `git diff --check`

```text
```

PASS. No output.

### `node --check app.js`

```text
```

PASS. No output.

### `node --check tests/visible-surface-prototype.test.js`

```text
```

PASS. No output.

### `node tests/visible-surface-prototype.test.js`

```text
visible-surface-prototype tests passed
```

### `node tests/runtime-adapter-shadow-integration.test.js`

```text
runtime-adapter-shadow-integration tests passed
```

### `node tests/driver-stack/runtimeAdapterPrototype.test.js`

```text
runtimeAdapterPrototype tests passed
```

### `node tests/driver-stack/exportRuntimeAdapterPrototype.mjs > /tmp/wp20_runtime_adapter_visible_prototype_check.json`

```text
```

PASS. JSON export written.

### Adapter Export Contract Check

```text
WP20 adapter contract still valid
```

### `npm test`

```text
All tests passed
```

### `git diff -- index.html styles.css mockBackend.js package.json _redirects`

```text
```

PASS. No output.

### `git diff -- tests/driver-stack/runtimeAdapterPrototype.mjs tests/driver-stack/runtimeAdapterPrototype.test.js tests/driver-stack/exportRuntimeAdapterPrototype.mjs`

```text
```

PASS. No output.

### `git diff --cached --name-only`

```text
```

PASS. Nothing staged.

## Self-Audit Outputs

### Guard And Boolean Safety Flags

```text
const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;
    options.professionalFirst === true;
    options.urgent === true ||
```

### Risk Register Header Checks

```text
| Risk | Severity | Trigger | Mitigation | Status |
```

Negative checks for the old risk-table header and old mitigation column label passed with no output.

### Required Risk Rows

```text
visible surfaces accidentally enabled
paid sections visible without entitlement
safety guidance hidden by payment
safety guidance hidden in professional/urgent mode
internalDiagnostics rendered
ownerDebug rendered
adapter field names visible
internal key leak
medical-cause implication
diagnosis/treatment claim
payment mechanics in sensitive guidance
report copy regression
localStorage mutation
payment/QPay/backend regression
deploy before approval
rollback not clean
```

### Required Summary And Recommendation Lines

```text
Visible surfaces are prototype-only in WP20.
Production release is NOT approved by WP20.
READY FOR OWNER REVIEW OF LIMITED VISIBLE SURFACE PROTOTYPE
Production release is NOT approved by WP20.
```

Negative recommendation check for the old PASS wording passed with no output.

## Relevant `app.js` Hunk

```js
const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;
```

```js
function renderVisibleSurfacePrototype(adapterPayload = null, options = {}) {
  const visiblePrototypeEnabled = options.enabled === true;
  if (!visiblePrototypeEnabled) {
    return {
      prototypeAttempted: false,
      visiblePrototypeEnabled: false,
      suppressed: false,
      renderedSurfaces: [],
      html: "",
      pass: true,
      errors: []
    };
  }

  const mode = options.mode || options.routeMode || null;
  const suppressOrdinarySurfaces =
    mode === "urgent" ||
    mode === "professional" ||
    options.urgent === true ||
    options.professionalFirst === true;

  const errors = [];
  if (!adapterPayload) {
    errors.push("Visible surface prototype requires an adapter payload when enabled.");
  }
  if (adapterPayload?.adapterMode !== "test_only") {
    errors.push("Visible surface prototype only accepts test_only adapter payloads.");
  }
  if (adapterPayload?.reportSurface !== "prototype_only") {
    errors.push("Visible surface prototype only accepts prototype_only report surfaces.");
  }
  if (adapterPayload?.runtimeSafetyGate?.canRenderInRuntime !== false) {
    errors.push("Visible surface prototype must preserve runtimeSafetyGate.canRenderInRuntime === false.");
  }
  if (adapterPayload?.runtimeSafetyGate?.status !== "HOLD") {
    errors.push("Visible surface prototype must preserve runtimeSafetyGate.status === HOLD.");
  }
  if (adapterPayload?.paymentGate?.safetyGuidanceRequiresPayment !== false) {
    errors.push("Visible surface prototype must keep safety guidance outside payment.");
  }
  if (adapterPayload?.pass !== true) {
    errors.push("Visible surface prototype requires a passing adapter payload.");
  }

  const surfaceGroups = [];
  const previewSections = Array.isArray(adapterPayload?.previewSections) ? adapterPayload.previewSections : [];
  const paidSections = Array.isArray(adapterPayload?.paidSections) ? adapterPayload.paidSections : [];
  const safetyGuidanceSections = Array.isArray(adapterPayload?.safetyGuidanceSections)
    ? adapterPayload.safetyGuidanceSections
    : [];

  if (!suppressOrdinarySurfaces && previewSections.length) {
    surfaceGroups.push({
      id: "preview",
      title: "Эхний товч зураглал",
      sections: previewSections
    });
  }
  if (!suppressOrdinarySurfaces && options.hasPaidAccess === true && paidSections.length) {
    surfaceGroups.push({
      id: "paid",
      title: "Гүн тайлангийн хэсэг",
      sections: paidSections
    });
  }
  if (safetyGuidanceSections.length) {
    surfaceGroups.push({
      id: "safety",
      title: "Аюулгүй байдлын сануулга",
      sections: safetyGuidanceSections
    });
  }

  const html = errors.length
    ? ""
    : surfaceGroups.map(group => `
      <section class="visible-surface-prototype" data-surface="${escapeAttr(group.id)}">
        <h2>${escapeHtml(group.title)}</h2>
        ${group.sections.map(visibleSurfacePrototypeHtml).join("")}
      </section>
    `).join("");

  return {
    prototypeAttempted: true,
    visiblePrototypeEnabled: true,
    suppressed: suppressOrdinarySurfaces,
    renderedSurfaces: surfaceGroups.map(group => group.id),
    html,
    pass: errors.length === 0,
    errors
  };
}
```

## Full `tests/visible-surface-prototype.test.js`

```js
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
  assert(!unpaid.html.includes("Гүн тайлангийн хэсэг"), "paid surface must not render without paid access");
  assertNoForbiddenText(unpaid.html, "unpaid/payment-failed prototype");

  const paid = _internal.renderVisibleSurfacePrototype(payload, {
    enabled: true,
    hasPaidAccess: true,
    mode: "ordinary"
  });
  assert.strictEqual(paid.pass, true, "paid prototype should pass");
  assert.deepStrictEqual(paid.renderedSurfaces, ["preview", "paid", "safety"]);
  assert(paid.html.includes("Гүн тайлангийн хэсэг"), "paid surface should render with paid access");
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
    assert(!suppressed.html.includes("Гүн тайлангийн хэсэг"), `${mode}: paid surface must be suppressed`);
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
    assert(!suppressed.html.includes("Гүн тайлангийн хэсэг"), `${label}: paid surface must be suppressed`);
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

  setOneTime({ oneTimePaid: false, removedFeaturePaid: false, upgradePaid: false });
  const entitlementBefore = {
    oneTime: _internal.hasOneTimeReportAccess(),
    removedFeature: _internal.hasRemovedFeatureAccess(),
    upgrade: _internal.hasUpgradeAccess()
  };
  _internal.renderVisibleSurfacePrototype(payload, {
    enabled: true,
    hasPaidAccess: false,
    paymentState: "failed",
    mode: "ordinary"
  });
  assert.deepStrictEqual({
    oneTime: _internal.hasOneTimeReportAccess(),
    removedFeature: _internal.hasRemovedFeatureAccess(),
    upgrade: _internal.hasUpgradeAccess()
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
    "oneTime: \"[REMOVED_FEATURE_PRICE]\"",
    "removedFeatureAnchor: \"[REMOVED_FEATURE_ANCHOR]\"",
    "const WEIGHT_TEST_PRODUCT_CODE = \"WEIGHT_TEST_ONE_TIME\";",
    "const WEIGHT_TEST_AMOUNT_MNT = 9900;",
    "create: \"/.netlify/functions/qpay-create-invoice\"",
    "check: \"/.netlify/functions/qpay-check-payment\""
  ].forEach(expected => assert(source.includes(expected), `missing unchanged contract: ${expected}`));

  console.log("visible-surface-prototype tests passed");
})();
```

## Relevant `tests/run-all.js` Hunk

```js
  ["node", ["tests/driver-stack/runtimeAdapterPrototype.test.js"]],
  ["node", ["tests/runtime-adapter-shadow-integration.test.js"]],
  ["node", ["tests/visible-surface-prototype.test.js"]],
  ["node", ["tests/virtual-user-qa.test.js"]],
```

## Embedded WP20 Artifacts

### `limited-visible-surface-prototype-summary.md`

```md
# Limited Visible Surface Prototype Summary

## WP20 Scope

WP20 implements a limited, disabled-by-default visible surface prototype for adapter payload surfaces.

Allowed prototype surfaces:

- `previewSections`
- `paidSections`
- `safetyGuidanceSections`

Forbidden rendered surfaces:

- `internalDiagnostics`
- `ownerDebug`

## Runtime Guard

`app.js` includes:

```js
const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;
```

Default runtime behavior remains unchanged.

Visible surfaces are prototype-only in WP20.

Production release is NOT approved by WP20.

## Prototype Status

The prototype exists as an internal/test helper only.

It is not wired into production report rendering.

Production release remains HOLD.

Deploy remains HOLD.

PDF generation remains HOLD.

Payment/QPay/backend/pricing/entitlement behavior remains HOLD.
```

### `appjs-visible-surface-implementation-notes.md`

```md
# Appjs Visible Surface Implementation Notes

## Changed Area

`app.js` adds a disabled visible surface prototype guard and helper functions near the existing runtime adapter shadow helper.

## Added Guard

```js
const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;
```

The flag is exported through `_internal` for tests.

## Added Helper

`renderVisibleSurfacePrototype(adapterPayload, options)` is a pure helper.

It returns empty HTML when `options.enabled !== true`.

Professional or urgent safety mode can be selected by `mode: "professional"`, `mode: "urgent"`, `professionalFirst: true`, or `urgent: true`.

In those safety modes, preview and paid-depth surfaces are suppressed while safety guidance remains renderable when present.

When enabled by tests, it accepts only a passing WP14 adapter payload that remains:

- `adapterMode: "test_only"`
- `reportSurface: "prototype_only"`
- `runtimeSafetyGate.canRenderInRuntime: false`
- `runtimeSafetyGate.status: "HOLD"`
- `paymentGate.safetyGuidanceRequiresPayment: false`

## Non-Wiring

No production route calls the helper with the visible prototype enabled.

No report branch is changed to render adapter surfaces by default.

No localStorage, payment, QPay, backend, pricing, entitlement, deploy, or PDF behavior is changed.
```

### `surface-rendering-behavior-report.md`

```md
# Surface Rendering Behavior Report

## Surface Behavior Table

| Surface | Enabled prototype behavior | Disabled/default behavior | Payment behavior | Safety behavior |
| --- | --- | --- | --- | --- |
| `previewSections` | Renders sanitized preview HTML only under explicit enabled test/internal options. | Does not render by default. | Does not require paid access. | Must not expose paid-depth or safety-sensitive internal fields. |
| `paidSections` | Renders sanitized paid-depth HTML only under explicit enabled test/internal options. | Does not render by default. | paidSections render only with paid access in prototype mode. | Must not contain or hide safety guidance. |
| `safetyGuidanceSections` | Renders sanitized safety guidance HTML only under explicit enabled test/internal options. | Does not render by default. | safetyGuidanceSections render without payment in prototype mode. | Remains visible without payment in prototype mode. |
| `internalDiagnostics` | internalDiagnostics are never rendered. | internalDiagnostics are never rendered. | Not applicable. | Internal diagnostics remain non-user-facing. |
| `ownerDebug` | ownerDebug is never rendered. | ownerDebug is never rendered. | Not applicable. | Owner debug remains non-user-facing. |

## Disabled Behavior

When disabled, the helper returns:

- `prototypeAttempted: false`
- `visiblePrototypeEnabled: false`
- empty `html`
- `pass: true`

The disabled path leaves report HTML and in-memory state unchanged.

## Preview Surface

`previewSections` can render only through explicit enabled test/internal options.

The prototype maps these sections to the preview surface label:

`Эхний товч зураглал`

## Paid Surface

`paidSections` render only when:

```js
hasPaidAccess === true
```

Without paid access, paid-depth HTML is omitted.

paidSections render only with paid access in prototype mode.

## Safety Guidance Surface

`safetyGuidanceSections` render without payment when the prototype is explicitly enabled.

Payment failure does not hide safety guidance.

safetyGuidanceSections render without payment in prototype mode.

## Professional And Urgent Suppression

For `professional` and `urgent` modes, ordinary preview and paid-depth surfaces are suppressed, while safety guidance remains renderable when present.

For `professionalFirst: true` and `urgent: true`, ordinary preview and paid-depth surfaces are suppressed, while safety guidance remains renderable when present.

## Forbidden Surfaces

The prototype does not read or render:

- `internalDiagnostics`
- `ownerDebug`

internalDiagnostics are never rendered.

ownerDebug is never rendered.

## Release Boundary

Production release is NOT approved by WP20.
```

### `visible-surface-test-coverage.md`

```md
# Visible Surface Test Coverage

## Test File

`tests/visible-surface-prototype.test.js`

## Registered Test

`tests/run-all.js` includes:

```js
["node", ["tests/visible-surface-prototype.test.js"]]
```

## Assertions Covered

- visible prototype guard defaults false;
- disabled prototype path returns empty HTML;
- disabled prototype path leaves report HTML unchanged;
- disabled prototype path leaves state unchanged;
- preview surface renders only under explicit enabled helper options;
- paid surface renders only with paid access;
- safety guidance renders without payment;
- payment failure keeps safety guidance visible;
- professional and urgent modes suppress ordinary surfaces while preserving safety guidance;
- `professionalFirst: true` and `urgent: true` suppress ordinary surfaces while preserving safety guidance;
- `internalDiagnostics` does not render;
- `ownerDebug` does not render;
- adapter field names do not render;
- internal fixture/debug names do not render;
- payment mechanics text does not render;
- diagnosis/treatment/prescribing claim words do not render;
- entitlement checks remain unchanged;
- localStorage is not read;
- console logging is not added;
- QPay/pricing/payment constants remain present in `app.js`;
- exact WP20 artifact filenames are enforced.

## Regression Coverage

Full regression command:

```bash
npm test
```
```

### `visible-surface-safety-copy-scan.md`

```md
# Visible Surface Safety Copy Scan

## Purpose

This scan records WP20 safety and copy boundaries for visible prototype HTML.

## Forbidden User-Facing Text

The test scans rendered prototype HTML for:

- adapter field names;
- internal diagnostics labels;
- owner debug labels;
- fixture names;
- runtime/debug key names;
- payment mechanics terms;
- currency symbols;
- English diagnosis, treatment, and prescribing claim words.

## Evidence Areas

internal key scan: rendered prototype HTML is scanned for adapter field names, internal diagnostics labels, owner debug labels, fixture names, runtime/debug key names, and internal mode strings.

medical/cause phrase scan: rendered prototype HTML is scanned for English diagnosis, treatment, and prescribing claim words.

payment mechanics scan: rendered prototype HTML is scanned for QPay, checkout, unlock, payment terms, and currency symbols.

diet-command phrase scan: WP20 does not introduce diet-command copy, and the prototype only converts sanitized WP14 adapter payload `title` and `body` fields under explicit test/internal control.

safety guidance visible without payment: `safetyGuidanceSections` render in the unpaid/payment-failed prototype case while `paidSections` remain hidden without paid access.

## Safety Guidance Boundary

Safety guidance is not payment-gated in the prototype.

Safety guidance remains visible in the payment-failure test case.

## Professional/Urgent Boundary

Professional and urgent route modes suppress ordinary preview and paid-depth surfaces while preserving safety guidance.

Boolean safety flags `professionalFirst: true` and `urgent: true` also suppress ordinary preview and paid-depth surfaces while preserving safety guidance.

The prototype does not render ordinary paid experiments into those routes.

## Copy Source Boundary

WP20 does not rewrite report copy.

The prototype only converts WP14 adapter payload `title` and `body` fields into sanitized HTML under explicit test/internal control.

## Conclusion

Visible prototype copy passed WP20 safety scans.
```

### `wp20-rollback-record.md`

```md
# WP20 Rollback Record

## Rollback Scope

WP20 is revertible as one ordinary source change set before commit.

After commit, rollback is one commit revert.

WP20 visible surface prototype is revertible with one commit revert.

## Files In Rollback Scope

- `app.js`
- `tests/visible-surface-prototype.test.js`
- `tests/run-all.js`
- `audits/mvp-diagnostic-migration/work-pack-20/*`

## Rollback Command After Commit

```bash
git revert <wp20_commit_sha>
```

Exact rollback command template:

```bash
git revert <WP20_COMMIT_HASH>
npm test
```

## Rollback Verification

Run:

```bash
node --check app.js
node tests/runtime-adapter-shadow-integration.test.js
npm test
```

Confirm:

- `ENABLE_VISIBLE_SURFACE_PROTOTYPE` is removed or remains disabled by the revert target;
- `tests/visible-surface-prototype.test.js` is removed by the revert target;
- production report output remains unchanged;
- QPay, payment, backend, pricing, entitlement, deploy, and PDF files remain untouched.

## Deploy Status

No deploy reversal is required because WP20 does not deploy.
```

### `wp20-risk-register.md`

```md
# WP20 Risk Register

| Risk | Severity | Trigger | Mitigation | Status |
| --- | --- | --- | --- | --- |
| visible surfaces accidentally enabled | BLOCKER | Guard defaults true or production route wires prototype output. | `ENABLE_VISIBLE_SURFACE_PROTOTYPE` defaults false and disabled helper path returns empty HTML. | MITIGATED |
| paid sections visible without entitlement | HIGH | `paidSections` render when `hasPaidAccess !== true`. | `paidSections` render only when `hasPaidAccess === true`. | MITIGATED |
| safety guidance hidden by payment | BLOCKER | `safetyGuidanceSections` disappear in unpaid or failed-payment prototype paths. | Safety guidance renders without paid access and during payment-failed test case. | MITIGATED |
| safety guidance hidden in professional/urgent mode | BLOCKER | Safety guidance disappears for `mode: "professional"`, `mode: "urgent"`, `professionalFirst: true`, or `urgent: true`. | Safety guidance renders in all safety-mode paths while preview and paid surfaces are suppressed. | MITIGATED |
| internalDiagnostics rendered | BLOCKER | Helper reads or renders `internalDiagnostics`. | Helper reads only allowed surface arrays and tests scan rendered HTML. | MITIGATED |
| ownerDebug rendered | BLOCKER | Helper reads or renders `ownerDebug`. | Helper reads only allowed surface arrays and tests scan rendered HTML. | MITIGATED |
| adapter field names visible | HIGH | Rendered prototype HTML includes adapter field names. | Tests scan output for adapter field names. | MITIGATED |
| internal key leak | HIGH | Rendered prototype HTML includes fixture names, runtime keys, or internal mode strings. | Sanitizer and tests remove and scan internal key text. | MITIGATED |
| medical-cause implication | HIGH | Visible prototype copy implies medical cause claims. | Safety copy scan checks medical/cause phrase risk and WP20 does not rewrite report copy. | MITIGATED |
| diagnosis/treatment claim | HIGH | Rendered prototype HTML includes diagnosis, treatment, or prescribing claim words. | Sanitizer and tests remove and scan English diagnosis, treatment, and prescribing claim words. | MITIGATED |
| payment mechanics in sensitive guidance | BLOCKER | Safety guidance includes QPay, checkout, unlock, payment terms, or currency symbols. | Sanitizer and tests scan payment mechanics terms and currency symbols. | MITIGATED |
| report copy regression | HIGH | WP20 changes production report copy instead of prototype-only adapter payload rendering. | Prototype only converts WP14 adapter payload `title` and `body` fields under explicit test/internal control. | MITIGATED |
| localStorage mutation | HIGH | Visible prototype reads or writes localStorage. | Tests install a throwing localStorage getter and confirm no access. | MITIGATED |
| payment/QPay/backend regression | BLOCKER | WP20 modifies payment, QPay, backend, pricing, or entitlement behavior. | Forbidden-file diffs stay empty and tests verify payment constants and entitlement checks remain unchanged. | MITIGATED |
| deploy before approval | BLOCKER | WP20 deploys or changes deploy/PDF files before owner approval. | No deploy/PDF commands are run and forbidden deploy/PDF diffs stay empty. | MITIGATED |
| rollback not clean | HIGH | WP20 cannot be reverted with one commit revert. | Rollback record defines one-commit revert and `npm test` verification. | MITIGATED |

## Open Release Risk

Production visible runtime rendering remains HOLD and requires a later owner-approved work pack.
```

### `work-pack-20-recommendation.md`

```md
# Work Pack 20 Recommendation

## Recommendation

READY FOR OWNER REVIEW OF LIMITED VISIBLE SURFACE PROTOTYPE

Production release is NOT approved by WP20.

This is not a production release recommendation.

## Evidence Summary

WP20 proves the WP14 adapter payload surfaces can be converted into sanitized user-facing HTML under explicit test-only/internal control.

The prototype separates:

- preview content;
- paid-depth content;
- safety/professional guidance.

The prototype also proves:

- paid-depth content can remain behind paid access;
- safety guidance can remain visible without payment;
- professional and urgent routes can suppress ordinary surfaces while preserving safety guidance;
- `internalDiagnostics` and `ownerDebug` can remain non-rendered.

## Exact Artifact Set

The final WP20 owner-review artifact set is:

- `limited-visible-surface-prototype-summary.md`
- `appjs-visible-surface-implementation-notes.md`
- `surface-rendering-behavior-report.md`
- `visible-surface-test-coverage.md`
- `visible-surface-safety-copy-scan.md`
- `wp20-rollback-record.md`
- `wp20-risk-register.md`
- `work-pack-20-recommendation.md`
- `OWNER_REVIEW_PACK_WP20.md`

## What WP20 Does Not Approve

WP20 does not approve production rendering.

WP20 does not approve deploy.

WP20 does not approve PDF generation.

WP20 does not approve QPay, backend, payment, pricing, or entitlement changes.

WP20 does not approve report copy rewrite.

WP20 does not approve rendering `internalDiagnostics` or `ownerDebug`.

## Required Next Gate

Any production visible runtime surface requires a later owner-approved work pack.
```

## Owner Checklist

- [ ] Recommendation enum is exactly `READY FOR OWNER REVIEW OF LIMITED VISIBLE SURFACE PROTOTYPE`.
- [ ] Conclusion says exactly: `Production release is NOT approved by WP20.`
- [ ] `ENABLE_VISIBLE_SURFACE_PROTOTYPE = false` is present.
- [ ] `options.professionalFirst === true` is included in the safety suppression logic.
- [ ] `options.urgent === true` is included in the safety suppression logic.
- [ ] Exact WP20 artifact set is present and embedded.
- [ ] Risk register header is exactly `| Risk | Severity | Trigger | Mitigation | Status |`.
- [ ] Risk register does not use the old mitigation column label.
- [ ] Boolean flag tests cover `professionalFirst: true` and `urgent: true`.
- [ ] No forbidden deploy/PDF/payment/QPay/backend/pricing/entitlement/WP14 files changed.
- [ ] Nothing is staged.
- [ ] `audits/sprint-36-paid-depth-prototype/` remains untouched and untracked.

## Final WP20E Conclusion

READY FOR OWNER REVIEW OF LIMITED VISIBLE SURFACE PROTOTYPE

Production release is NOT approved by WP20.
