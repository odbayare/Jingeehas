# OWNER REVIEW PACK WP17

## Recommendation enum

```text
READY FOR OWNER REVIEW OF DISABLED SHADOW RUNTIME INTEGRATION
```

## Required conclusion

Production runtime rendering is NOT approved by WP17.

Shadow integration produced no user-visible report output.

WP17 shadow integration is revertible with one commit revert.

Required flag:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

## Exact WP17 Artifact Set

- `disabled-shadow-integration-summary.md`
- `appjs-shadow-implementation-notes.md`
- `shadow-output-invariance-report.md`
- `shadow-integration-test-coverage.md`
- `wp17-rollback-record.md`
- `wp17-risk-register.md`
- `work-pack-17-recommendation.md`

These are the primary WP17 review artifacts.
## Repository State With Actual Outputs

### `git status --short`
```text
 M app.js
 M tests/run-all.js
?? audits/mvp-diagnostic-migration/work-pack-17/
?? audits/sprint-36-paid-depth-prototype/
?? tests/runtime-adapter-shadow-integration.test.js
```

### `git diff --stat`
```text
 app.js           | 82 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 tests/run-all.js |  1 +
 2 files changed, 83 insertions(+)
```

### `git diff -- app.js`
```text
diff --git a/app.js b/app.js
index 35ad9d4..915acf9 100644
--- a/app.js
+++ b/app.js
@@ -1,4 +1,5 @@
 const STORAGE_KEY = "weightLossDeepPatternMvp";
+const ENABLE_RUNTIME_ADAPTER_SHADOW = false;
 const mockBackend = typeof require === "function"
   ? require("./mockBackend.js")
   : window.MockBackend;
@@ -5011,6 +5012,74 @@ function renderFeedbackExport() {
   `;
 }

+function prepareRuntimeAdapterShadowSignal(reportContext = {}, adapterPayload = null, options = {}) {
+  const shadowEnabled = options.enabled === true;
+  if (!shadowEnabled) {
+    return {
+      shadowAttempted: false,
+      shadowEnabled: false,
+      adapterMode: null,
+      reportSurface: null,
+      runtimeCanRender: false,
+      safetyGuidanceRequiresPayment: false,
+      pass: true,
+      errors: []
+    };
+  }
+
+  const errors = [];
+  const allowedContextKeys = [
+    "mode",
+    "ranked",
+    "primary",
+    "secondary",
+    "packageType",
+    "readiness",
+    "stageEvidence",
+    "narrativeEvidence",
+    "tags"
+  ];
+
+  Object.keys(reportContext || {}).forEach(key => {
+    if (!allowedContextKeys.includes(key)) {
+      errors.push(`Shadow report context contains forbidden field: ${key}`);
+    }
+  });
+
+  if (!adapterPayload) {
+    errors.push("Shadow adapter payload is required when shadow mode is enabled.");
+  }
+  if (adapterPayload?.adapterMode !== "test_only") {
+    errors.push("Shadow adapter mode must remain test_only.");
+  }
+  if (adapterPayload?.reportSurface !== "prototype_only") {
+    errors.push("Shadow report surface must remain prototype_only.");
+  }
+  if (adapterPayload?.runtimeSafetyGate?.canRenderInRuntime !== false) {
+    errors.push("Shadow runtime gate must remain false.");
+  }
+  if (adapterPayload?.runtimeSafetyGate?.status !== "HOLD") {
+    errors.push("Shadow runtime gate status must remain HOLD.");
+  }
+  if (adapterPayload?.paymentGate?.safetyGuidanceRequiresPayment !== false) {
+    errors.push("Shadow safety guidance must not require payment.");
+  }
+  if (adapterPayload?.pass !== true) {
+    errors.push("Shadow adapter payload must pass its own WP14 validation.");
+  }
+
+  return {
+    shadowAttempted: true,
+    shadowEnabled: true,
+    adapterMode: adapterPayload?.adapterMode || null,
+    reportSurface: adapterPayload?.reportSurface || null,
+    runtimeCanRender: adapterPayload?.runtimeSafetyGate?.canRenderInRuntime === true,
+    safetyGuidanceRequiresPayment: adapterPayload?.paymentGate?.safetyGuidanceRequiresPayment === true,
+    pass: errors.length === 0,
+    errors
+  };
+}
+
 function renderReport() {
   const quality = dataQuality();
   const mode = reportMode();
@@ -5033,6 +5102,17 @@ function renderReport() {
   const avoidItems = avoidListFor(primary?.key, tags).slice(0, 6);
   const leverage = leveragePoint(primary?.key, tags);
   const experiment = experimentFor(primary?.key, tags);
+  prepareRuntimeAdapterShadowSignal({
+    mode,
+    ranked,
+    primary,
+    secondary,
+    packageType: state.packageType,
+    readiness,
+    stageEvidence,
+    narrativeEvidence,
+    tags
+  });

   if (mode.mode === "urgent") {
     return `
@@ -5415,6 +5495,8 @@ if (typeof module !== "undefined") {
       menstrualCycleEvidence,
       menstrualCycleContextHtml,
       menstrualCycleExperimentModifierHtml,
+      ENABLE_RUNTIME_ADAPTER_SHADOW,
+      prepareRuntimeAdapterShadowSignal,
       setTestState(nextState) {
         state = {
           ...initialState,
```

### `git diff -- tests/runtime-adapter-shadow-integration.test.js`
```text
(no output)
```

### `git diff -- tests/run-all.js`
```text
diff --git a/tests/run-all.js b/tests/run-all.js
index 3190d50..a2f5d36 100644
--- a/tests/run-all.js
+++ b/tests/run-all.js
@@ -14,6 +14,7 @@ const commands = [
   ["node", ["tests/driver-stack/copyDecisionMetadata.test.js"]],
   ["node", ["tests/driver-stack/copyDecisionRenderer.test.js"]],
   ["node", ["tests/driver-stack/runtimeAdapterPrototype.test.js"]],
+  ["node", ["tests/runtime-adapter-shadow-integration.test.js"]],
   ["node", ["tests/virtual-user-qa.test.js"]],
   ["node", ["tests/ten-person-simulation-audit.test.js"]],
   ["node", ["tests/partial-persona-fix.test.js"]],
```

### `git diff -- index.html styles.css mockBackend.js package.json _redirects`
```text
(no output)
```

### `git diff -- tests/driver-stack/runtimeAdapterPrototype.mjs tests/driver-stack/runtimeAdapterPrototype.test.js tests/driver-stack/exportRuntimeAdapterPrototype.mjs`
```text
(no output)
```

### `git diff --cached --name-only`
```text
(no output)
```

## Validation Commands And Actual PASS Results

### `git diff --check`

Result: PASS.
```text
(no output)
```

### `node --check app.js`

Result: PASS.
```text
(no output)
```

### `node --check tests/runtime-adapter-shadow-integration.test.js`

Result: PASS.
```text
(no output)
```

### `node tests/runtime-adapter-shadow-integration.test.js`

Result: PASS.
```text
runtime-adapter-shadow-integration tests passed
```

### `node tests/driver-stack/runtimeAdapterPrototype.test.js`

Result: PASS.
```text
runtimeAdapterPrototype tests passed
```

### `node tests/driver-stack/exportRuntimeAdapterPrototype.mjs > /tmp/wp17_runtime_adapter_shadow_check.json`

Result: PASS.
```text
(no output)
```

### `adapter JSON contract node -e check`

Result: PASS.
```text
WP17 adapter contract still valid
```

### `npm test`

Result: PASS.
```text

> weight-loss-deep-pattern-prototype@0.1.0 test
> node tests/run-all.js


> node --check app.js

> node tests/safety-readiness.test.js
safety-readiness tests passed

> node tests/voice-summary-confirmation.test.js
voice-summary-confirmation tests passed

> node tests/report-bible-sections.test.js
report-bible-sections tests passed

> node tests/question-metadata-mechanisms.test.js
question-metadata-mechanisms tests passed

> node tests/evidence-scoring-calibration.test.js
evidence-scoring-calibration tests passed

> node tests/driver-stack/driverStackContract.test.js
driverStackContract tests passed

> node tests/driver-stack/driverStackFixtures.test.js
driverStackFixtures tests passed

> node tests/driver-stack/driverStackSafetyInvariants.test.js
driverStackSafetyInvariants tests passed

> node tests/driver-stack/driverStackReportObject.test.js
driverStackReportObject tests passed

> node tests/driver-stack/copyDecisionMetadata.test.js
copyDecisionMetadata tests passed

> node tests/driver-stack/copyDecisionRenderer.test.js
copyDecisionRenderer tests passed

> node tests/driver-stack/runtimeAdapterPrototype.test.js
runtimeAdapterPrototype tests passed

> node tests/runtime-adapter-shadow-integration.test.js
runtime-adapter-shadow-integration tests passed

> node tests/virtual-user-qa.test.js
PASS Hunger-Safety Evening Rebound
PASS Reward-Seeking / Stimulation
PASS Reward Deficit / My Time
PASS Food-as-Regulation
PASS Executive Load
PASS Decision-Default Mismatch
PASS Circadian-Energy Mismatch
PASS Control-Collapse
PASS Stage 1 Reward vs Diary Hunger Contradiction
PASS Stage 1 Stress vs Diary Executive Load Contradiction
PASS Hunger-Triggered Physiological Reactivity
PASS Glucose-Safety / Professional Route
PASS Mode 4 Urgent Safety
PASS Social Belonging + Autonomy
PASS Body-Safety + Shame
virtual-user-qa tests passed

> node tests/ten-person-simulation-audit.test.js
PASS 45M Office Worker / Executive Load
PASS 36F Mother / Role Overload + Reward Deficit
PASS 28F Diet Cycler / Control-Collapse
PASS 40M Fasting Rebound / Hunger-Safety
PASS 33F Stress Eating / Food-as-Regulation
PASS 31M Cue/Delivery / Decision-Default
PASS 50F Medical/Medication Friction
PASS 24F Body-Safety / Shame
PASS 39M Social/Alcohol Pattern
PASS 42F Sleep/Circadian
ten-person-simulation-audit tests passed

> node tests/partial-persona-fix.test.js
partial-persona-fix tests passed

> node tests/input-focus.test.js
input-focus tests passed

> node tests/report-compression-ai-smell.test.js
report-compression-ai-smell tests passed

> node tests/copy-localization.test.js
copy-localization tests passed

> node tests/ai-blind-demo-panel.test.js
AI blind demo panel checks passed

> node tests/sample-preview-choice-clarity.test.js
sample-preview-choice-clarity tests passed

> node tests/pricing-paywall.test.js
pricing-paywall tests passed

> node tests/commercial-flow-qa.test.js
commercial-flow-qa tests passed

> node tests/backend-qpay-plan.test.js
backend-qpay-plan tests passed

> node tests/mock-backend-entitlements.test.js
mock-backend-entitlements tests passed

> node tests/fake-payment-lead-capture.test.js
fake-payment-lead-capture tests passed

> node tests/internal-tester-feedback.test.js
internal-tester-feedback tests passed

> node tests/internal-human-feedback-copy-ux.test.js
internal-human-feedback-copy-ux tests passed

> node tests/question-copy-polish.test.js
question-copy-polish tests passed

> node tests/question-navigation.test.js
question-navigation tests passed

> node tests/menstrual-cycle-context.test.js
menstrual-cycle-context tests passed

> node tests/surface-hidden-function-reframe.test.js
surface-hidden-function-reframe tests passed

> node tests/coach-subadmin.test.js
coach-subadmin tests passed

> node tests/coach-workflow-qa.test.js
coach-workflow-qa tests passed

> node tests/coach-language-polish.test.js
coach-language-polish tests passed

> node tests/result-comprehension.test.js
result-comprehension tests passed

> node tests/deep-mongolian-copy-rewrite.test.js
deep-mongolian-copy-rewrite tests passed

> node tests/public-language-purge.test.js
public-language-purge tests passed

> node tests/report-voice-rewrite.test.js
report-voice-rewrite tests passed

> node tests/virtual-audit-public-copy.test.js
virtual-audit-public-copy.test.js passed

> node tests/sprint32-export-separation.test.js
sprint32-export-separation tests passed

All tests passed
```

### Returned HTML adapter leak scan

Command:

```text
node -e 'const app=require("./app.js"); const {_internal}=app; const leaks=["previewSections","paidSections","safetyGuidanceSections","internalDiagnostics","ownerDebug","runtimeGate","decisionStatus","rendererMode","fixtureName","all_or_nothing_restriction_rebound","pcos_body_uncertainty_control"]; function check(label,setup){setup(); const html=_internal.renderReport(); const found=leaks.filter(x=>String(html).includes(x)); if(found.length) throw new Error(label+" leaked "+found.join(","));} function one(over={}){_internal.setTestState({packageType:"one-time",view:"report",oneTimePaid:true,sevenDayPaid:false,upgradePaid:false,stageAnswers:{"S1-W04":["Мацаг"],"S1-M01":"Өдөр бага идээд орой нөхөх","S1-F01":["Дараа өлсөхөөс санаа зовсон","Өөрийгөө шагнамаар"]},preliminary:[{key:"hungerSafety",score:5,label:"хүчтэй нийцэж байна"}],diaryEntries:[],...over});} function seven(over={}){_internal.setTestState({packageType:"seven-day",view:"report",oneTimePaid:false,sevenDayPaid:true,upgradePaid:false,stageAnswers:{"S1-W04":["Мацаг","Орой хоол идэхгүй"]},preliminary:[{key:"hungerSafety",score:5,label:"хүчтэй нийцэж байна"},{key:"executive",score:4,label:"дунд зэрэг нийцэж байна"}],diaryEntries:Array.from({length:5},(_,i)=>({day_number:i+1,meal_rhythm:"Хоолны хооронд 5+ цагийн зай гарсан",unplanned_eating_count:"Тийм, 1 удаа",main_moment_time:"Орой",hunger_level:"8",food_function:["Өөрийгөө шагнамаар байсан"],emotion:"Ядаргаа",energy_score:"2",stress_score:"5",body_signals:["Аль нь ч үгүй"],pattern_probes:{}})),...over});} check("one-time paid",()=>one()); check("one-time unpaid",()=>one({oneTimePaid:false})); check("seven-day",()=>seven()); check("professional",()=>seven({stageAnswers:{"S1-S03":"Одоо давтагддаг"}})); check("urgent",()=>seven({stageAnswers:{"S1-S04":"Одоо идэвхтэй бодогдож байна"}})); console.log("WP17 returned HTML adapter leak scan passed");'
```

Result: PASS.
```text
WP17 returned HTML adapter leak scan passed
```

## Source Evidence: app.js Relevant Hunks

Full relevant hunk evidence is the current `git diff -- app.js` output.
```diff
diff --git a/app.js b/app.js
index 35ad9d4..915acf9 100644
--- a/app.js
+++ b/app.js
@@ -1,4 +1,5 @@
 const STORAGE_KEY = "weightLossDeepPatternMvp";
+const ENABLE_RUNTIME_ADAPTER_SHADOW = false;
 const mockBackend = typeof require === "function"
   ? require("./mockBackend.js")
   : window.MockBackend;
@@ -5011,6 +5012,74 @@ function renderFeedbackExport() {
   `;
 }

+function prepareRuntimeAdapterShadowSignal(reportContext = {}, adapterPayload = null, options = {}) {
+  const shadowEnabled = options.enabled === true;
+  if (!shadowEnabled) {
+    return {
+      shadowAttempted: false,
+      shadowEnabled: false,
+      adapterMode: null,
+      reportSurface: null,
+      runtimeCanRender: false,
+      safetyGuidanceRequiresPayment: false,
+      pass: true,
+      errors: []
+    };
+  }
+
+  const errors = [];
+  const allowedContextKeys = [
+    "mode",
+    "ranked",
+    "primary",
+    "secondary",
+    "packageType",
+    "readiness",
+    "stageEvidence",
+    "narrativeEvidence",
+    "tags"
+  ];
+
+  Object.keys(reportContext || {}).forEach(key => {
+    if (!allowedContextKeys.includes(key)) {
+      errors.push(`Shadow report context contains forbidden field: ${key}`);
+    }
+  });
+
+  if (!adapterPayload) {
+    errors.push("Shadow adapter payload is required when shadow mode is enabled.");
+  }
+  if (adapterPayload?.adapterMode !== "test_only") {
+    errors.push("Shadow adapter mode must remain test_only.");
+  }
+  if (adapterPayload?.reportSurface !== "prototype_only") {
+    errors.push("Shadow report surface must remain prototype_only.");
+  }
+  if (adapterPayload?.runtimeSafetyGate?.canRenderInRuntime !== false) {
+    errors.push("Shadow runtime gate must remain false.");
+  }
+  if (adapterPayload?.runtimeSafetyGate?.status !== "HOLD") {
+    errors.push("Shadow runtime gate status must remain HOLD.");
+  }
+  if (adapterPayload?.paymentGate?.safetyGuidanceRequiresPayment !== false) {
+    errors.push("Shadow safety guidance must not require payment.");
+  }
+  if (adapterPayload?.pass !== true) {
+    errors.push("Shadow adapter payload must pass its own WP14 validation.");
+  }
+
+  return {
+    shadowAttempted: true,
+    shadowEnabled: true,
+    adapterMode: adapterPayload?.adapterMode || null,
+    reportSurface: adapterPayload?.reportSurface || null,
+    runtimeCanRender: adapterPayload?.runtimeSafetyGate?.canRenderInRuntime === true,
+    safetyGuidanceRequiresPayment: adapterPayload?.paymentGate?.safetyGuidanceRequiresPayment === true,
+    pass: errors.length === 0,
+    errors
+  };
+}
+
 function renderReport() {
   const quality = dataQuality();
   const mode = reportMode();
@@ -5033,6 +5102,17 @@ function renderReport() {
   const avoidItems = avoidListFor(primary?.key, tags).slice(0, 6);
   const leverage = leveragePoint(primary?.key, tags);
   const experiment = experimentFor(primary?.key, tags);
+  prepareRuntimeAdapterShadowSignal({
+    mode,
+    ranked,
+    primary,
+    secondary,
+    packageType: state.packageType,
+    readiness,
+    stageEvidence,
+    narrativeEvidence,
+    tags
+  });

   if (mode.mode === "urgent") {
     return `
@@ -5415,6 +5495,8 @@ if (typeof module !== "undefined") {
       menstrualCycleEvidence,
       menstrualCycleContextHtml,
       menstrualCycleExperimentModifierHtml,
+      ENABLE_RUNTIME_ADAPTER_SHADOW,
+      prepareRuntimeAdapterShadowSignal,
       setTestState(nextState) {
         state = {
           ...initialState,
```

## Source Evidence: tests/runtime-adapter-shadow-integration.test.js Full Content


```js
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
```

## Source Evidence: tests/run-all.js Relevant Hunk

The only `tests/run-all.js` change is WP17 test registration.
```diff
diff --git a/tests/run-all.js b/tests/run-all.js
index 3190d50..a2f5d36 100644
--- a/tests/run-all.js
+++ b/tests/run-all.js
@@ -14,6 +14,7 @@ const commands = [
   ["node", ["tests/driver-stack/copyDecisionMetadata.test.js"]],
   ["node", ["tests/driver-stack/copyDecisionRenderer.test.js"]],
   ["node", ["tests/driver-stack/runtimeAdapterPrototype.test.js"]],
+  ["node", ["tests/runtime-adapter-shadow-integration.test.js"]],
   ["node", ["tests/virtual-user-qa.test.js"]],
   ["node", ["tests/ten-person-simulation-audit.test.js"]],
   ["node", ["tests/partial-persona-fix.test.js"]],
```

## Full Content Of Every Exact WP17 Artifact

### disabled-shadow-integration-summary.md

```markdown
# WP17 Disabled Shadow Integration Summary

## Purpose

WP17 adds a disabled-by-default shadow runtime adapter integration path in `app.js`.

Production runtime rendering is NOT approved by WP17.

## Implementation summary

- `ENABLE_RUNTIME_ADAPTER_SHADOW = false` is defined at the top of `app.js`.
- `prepareRuntimeAdapterShadowSignal()` prepares an internal validation signal only.
- `renderReport()` calls the helper after existing report context is computed.
- The helper output is not rendered, persisted, sent to payment, sent to backend, sent to PDF generation, or exposed in UI.

## Visible-output summary

Shadow integration produced no user-visible report output.

Existing report branches, report copy, paywall copy, safety routing, payment behavior, localStorage behavior, scoring, and entitlement logic remain unchanged by the disabled shadow path.
```

### appjs-shadow-implementation-notes.md

```markdown
# WP17 app.js Shadow Implementation Notes

## Changed `app.js` areas

| Area | Change | Runtime impact |
| --- | --- | --- |
| Top-level constants | Added `ENABLE_RUNTIME_ADAPTER_SHADOW = false`. | Disabled by default. |
| Internal helper | Added `prepareRuntimeAdapterShadowSignal()`. | Returns internal validation only. |
| `renderReport()` | Added one ignored helper call after existing context variables are computed. | No branch or returned HTML changes. |
| `_internal` export | Exposes the flag and helper for tests. | No browser global or UI control added. |

## Guardrails

- No adapter sections are rendered.
- No adapter diagnostics are persisted.
- No localStorage key is added.
- No `saveState()` call is added.
- No payment, QPay, backend, pricing, entitlement, deploy, or PDF path is called.
- The WP14 adapter module, test, and exporter are not modified.
```

### shadow-output-invariance-report.md

```markdown
# WP17 Shadow Output Invariance Report

## Invariance claim

Shadow integration produced no user-visible report output.

The disabled shadow path returns an ignored internal no-op signal and does not alter rendered report HTML.

## Automated coverage

`tests/runtime-adapter-shadow-integration.test.js` compares report output before and after disabled shadow helper calls for:

- one-time paid report
- one-time unpaid/paywall branch
- seven-day full report
- seven-day readiness hold
- professional-first branch
- urgent safety branch

The test also scans returned HTML for adapter field names and raw fixture names.

## Required hold

Production runtime rendering is NOT approved by WP17.
```

### shadow-integration-test-coverage.md

```markdown
# WP17 Shadow Integration Test Coverage

## Test file

`tests/runtime-adapter-shadow-integration.test.js`

## Coverage

| Requirement | Coverage |
| --- | --- |
| Feature flag defaults false | Asserts `ENABLE_RUNTIME_ADAPTER_SHADOW = false` exists and `_internal.ENABLE_RUNTIME_ADAPTER_SHADOW === false`. |
| Disabled output unchanged | Compares `renderReport()` output before and after disabled helper calls across key branches. |
| Enabled path internal-only | Imports WP14 adapter payload in Node and asserts helper returns only approved validation fields. |
| Adapter payload not rendered | Scans returned HTML for adapter field names and raw fixture names. |
| localStorage untouched | Installs a throwing `global.localStorage` descriptor and proves the helper does not read it. |
| payment/access untouched | Checks access helpers and core price/product/QPay endpoint constants remain unchanged. |
| forbidden context rejected | Verifies enabled helper rejects forbidden context fields such as `localStorage`. |

## Regression registration

`tests/run-all.js` registers:

``\`js
["node", ["tests/runtime-adapter-shadow-integration.test.js"]]
``\`
```

### wp17-rollback-record.md

```markdown
# WP17 Rollback Record

## Rollback status

WP17 shadow integration is revertible with one commit revert.

Because WP17 is not staged or committed yet, the current working-tree rollback would be:

``\`bash
git restore app.js tests/run-all.js
rm tests/runtime-adapter-shadow-integration.test.js
rm -rf audits/mvp-diagnostic-migration/work-pack-17
``\`

Do not run rollback unless the owner explicitly asks for it.

## Approval boundary

Production runtime rendering is NOT approved by WP17.
```

### wp17-risk-register.md

```markdown
# WP17 Risk Register

| Risk | Severity | Trigger | Mitigation | Status |
| --- | --- | --- | --- | --- |
| visible report output changed | BLOCKER | Any returned report HTML differs because of shadow integration. | Disabled helper output is ignored; tests compare returned report HTML across one-time, seven-day, professional, urgent, and readiness branches. | Controlled |
| shadow flag accidentally enabled | BLOCKER | `ENABLE_RUNTIME_ADAPTER_SHADOW` is changed away from `false`. | Tests assert `ENABLE_RUNTIME_ADAPTER_SHADOW = false` in source and `_internal.ENABLE_RUNTIME_ADAPTER_SHADOW === false`. | Controlled |
| adapter output rendered to users | BLOCKER | Adapter fields or sections appear in user-facing HTML. | Returned HTML leak scan checks adapter fields and raw fixture names are absent. | Controlled |
| localStorage mutation | HIGH | Shadow helper reads localStorage, writes localStorage, adds keys, or persists diagnostics. | Test installs a throwing localStorage descriptor and proves helper does not access it. | Controlled |
| payment/entitlement mutation | HIGH | Shadow path changes access helpers, prices, product codes, QPay endpoints, or entitlement logic. | Test checks access helpers and core price/product/QPay endpoint constants remain unchanged. | Controlled |
| safety/professional route regression | HIGH | Professional-first branch changes output, payment gating, or safety routing. | WP17 test covers professional branch output invariance and leak scan. | Controlled |
| urgent route regression | HIGH | Urgent branch changes output, payment gating, or safety routing. | WP17 test covers urgent branch output invariance and leak scan. | Controlled |
| internal key leak | HIGH | Adapter internals, fixture names, or runtime metadata appear in returned HTML. | Leak scan rejects adapter fields, raw fixture names, and internal adapter metadata. | Controlled |
| WP14 adapter contract drift | HIGH | Adapter mode, report surface, runtime safety gate, payment safety gate, or pass status changes. | WP14 adapter test and WP17 adapter JSON contract check validate the adapter contract. | Controlled |
| deploy before approval | BLOCKER | Any deploy command is run before owner approval. | WP17 owner pack records no deploy; deploy remains forbidden by scope. | Held |
| rollback not clean | MEDIUM | WP17 cannot be reverted with one commit revert after commit. | WP17 shadow integration is revertible with one commit revert; current uncommitted rollback is documented. | Controlled |

## Current conclusion

Shadow integration produced no user-visible report output.
```

### work-pack-17-recommendation.md

```markdown
# WP17 Recommendation

## Recommendation enum

``\`text
READY FOR OWNER REVIEW OF DISABLED SHADOW RUNTIME INTEGRATION
``\`

## Recommendation

WP17 is ready for owner review as a disabled shadow runtime adapter integration.

Production runtime rendering is NOT approved by WP17.

Shadow integration produced no user-visible report output.

WP17 shadow integration is revertible with one commit revert.

## Required flag

``\`text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
``\`
```

## Explicit Confirmation

- no production runtime rendering: CONFIRMED
- no visible UI change: CONFIRMED
- no report copy change: CONFIRMED
- no payment/QPay/backend/pricing/entitlement change: CONFIRMED
- no localStorage persistence change: CONFIRMED
- no scoring/fixture change: CONFIRMED
- no WP4 report object contract change: CONFIRMED
- no WP9 metadata contract change: CONFIRMED
- WP10/WP12 renderer contract unchanged: CONFIRMED
- WP14 adapter contract unchanged: CONFIRMED
- no PDF generated: CONFIRMED
- no deploy: CONFIRMED
- unrelated `audits/sprint-36-paid-depth-prototype/` remains untouched and untracked: CONFIRMED
## Self-Audit Before Reporting

- OWNER_REVIEW_PACK_WP17.md contains all full artifact content sections: PASS
- Old wrong artifact names are not used as primary artifacts: PASS
- Risk register severity values only LOW / MEDIUM / HIGH / BLOCKER: PASS
- returned HTML leak scan passed: PASS
- tests/run-all.js change is test registration only: PASS
- no forbidden files changed: PASS
- no staged files: PASS
- no commit, deploy, or PDF generation performed: PASS
