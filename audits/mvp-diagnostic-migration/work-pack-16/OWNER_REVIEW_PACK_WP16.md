# OWNER REVIEW PACK WP16

## Recommendation enum

```text
READY FOR OWNER REVIEW OF SHADOW RUNTIME INTEGRATION PLAN
```

## Review purpose

WP16 is a docs-only shadow runtime integration implementation plan and exact patch scope.

This owner pack is self-contained. It embeds the full content of the WP16 source artifacts and records actual validation results from this working tree.

Runtime implementation is NOT approved by WP16.

WP17 may only implement shadow integration if the owner accepts WP16.

## Artifact checklist

| Artifact | Status | Embedded in this owner pack |
| --- | --- | --- |
| `shadow-runtime-integration-plan.md` | COMPLETE | Yes |
| `appjs-shadow-touchpoint-audit.md` | COMPLETE | Yes |
| `shadow-feature-flag-plan.md` | COMPLETE | Yes |
| `shadow-adapter-invocation-contract.md` | COMPLETE | Yes |
| `wp17-exact-patch-scope.md` | COMPLETE | Yes |
| `shadow-integration-test-plan.md` | COMPLETE | Yes |
| `shadow-rollback-plan.md` | COMPLETE | Yes |
| `wp16-risk-register.md` | COMPLETE | Yes |
| `work-pack-16-recommendation.md` | COMPLETE | Yes |
| `OWNER_REVIEW_PACK_WP16.md` | COMPLETE | This file |

## Current state

- WP14 adapter remains test-only.
- WP14 adapter preserves `runtimeSafetyGate.canRenderInRuntime === false`.
- WP14 adapter preserves `adapterMode === "test_only"`.
- WP14 adapter preserves `reportSurface === "prototype_only"`.
- WP14 adapter preserves `paymentGate.safetyGuidanceRequiresPayment === false`.
- WP15 GO allows only planning a future shadow `app.js` integration.
- WP16 creates docs only.
- Runtime implementation remains HOLD.
- Production rendering remains HOLD.
- Deploy, PDF, QPay, backend, payment, pricing, and entitlement remain HOLD.

## Owner decision options

| Decision | Meaning |
| --- | --- |
| ACCEPT WP16 | Allows planning to move to WP17 disabled shadow integration only. |
| HOLD WP16 | No `app.js` or test implementation may proceed. |
| REVISE WP16 | Update docs before any WP17 scope is accepted. |

## What acceptance does not approve

Acceptance of WP16 does not approve:

- runtime implementation beyond a future owner-approved WP17 shadow-only scope;
- production rendering;
- visible UI change;
- payment change;
- QPay/backend change;
- pricing/entitlement change;
- PDF generation;
- deploy;
- scoring changes;
- report copy changes;
- WP3 scoring/fixture changes;
- WP4 report object contract changes;
- WP9 metadata contract changes;
- WP10/WP12 renderer contract changes;
- WP14 adapter changes.

## Required WP17 proof if accepted

Future WP17 must prove:

- exact feature flag is `ENABLE_RUNTIME_ADAPTER_SHADOW = false`;
- disabled flag leaves existing report HTML unchanged;
- enabled test-only shadow path remains internal-only;
- no localStorage behavior changes;
- no payment/entitlement behavior changes;
- no adapter payload leaks into returned HTML;
- WP14 safety/payment invariants remain true;
- full `npm test` passes;
- forbidden-file diffs are empty;
- rollback plan is recorded before commit.

## WP16C validation results

Validation was run after repairing the exact WP16C tables and before regenerating this owner pack. The only intended WP16C edits are docs under `audits/mvp-diagnostic-migration/work-pack-16/`.

### `ls audits/mvp-diagnostic-migration/work-pack-16`

```text
OWNER_REVIEW_PACK_WP16.md
appjs-shadow-touchpoint-audit.md
shadow-adapter-invocation-contract.md
shadow-feature-flag-plan.md
shadow-integration-test-plan.md
shadow-rollback-plan.md
shadow-runtime-integration-plan.md
work-pack-16-recommendation.md
wp16-risk-register.md
wp17-exact-patch-scope.md
```

### `git status --short`

```text
?? audits/mvp-diagnostic-migration/work-pack-16/
?? audits/sprint-36-paid-depth-prototype/
```

Interpretation:

- `audits/mvp-diagnostic-migration/work-pack-16/` is the intended docs-only WP16 folder.
- `audits/sprint-36-paid-depth-prototype/` remains unrelated, untracked, unstaged, and untouched.

### `git diff --check`

```text
(no output)
```

Result: PASS.

### `node --check app.js`

```text
(no output)
```

Result: PASS.

### `node --check tests/driver-stack/runtimeAdapterPrototype.mjs`

```text
(no output)
```

Result: PASS.

### `node --check tests/driver-stack/exportRuntimeAdapterPrototype.mjs`

```text
(no output)
```

Result: PASS.

### `node tests/driver-stack/runtimeAdapterPrototype.test.js`

```text
runtimeAdapterPrototype tests passed
```

Result: PASS.

### `node tests/driver-stack/exportRuntimeAdapterPrototype.mjs > /tmp/wp16_runtime_adapter_shadow_plan_check.json`

```text
(no output)
```

Result: PASS. Export JSON was written to `/tmp/wp16_runtime_adapter_shadow_plan_check.json`.

### Adapter JSON contract assertion

Command:

```bash
node -e 'const fs=require("fs"); const a=JSON.parse(fs.readFileSync("/tmp/wp16_runtime_adapter_shadow_plan_check.json","utf8")); if(a.version!=="runtime-adapter-prototype-export-v0-test-only") throw new Error("bad export version"); const p=a.payload; const expected=["version","adapterMode","source","generatedFrom","reportSurface","previewSections","paidSections","safetyGuidanceSections","internalDiagnostics","ownerDebug","runtimeSafetyGate","paymentGate","qualityChecks","pass"]; if(JSON.stringify(Object.keys(p))!==JSON.stringify(expected)) throw new Error("bad adapter payload keys"); if(p.runtimeSafetyGate.canRenderInRuntime!==false) throw new Error("runtime gate not false"); if(p.paymentGate.safetyGuidanceRequiresPayment!==false) throw new Error("safety payment gate bad"); if(p.pass!==true) throw new Error("adapter payload not pass"); console.log("WP16 adapter contract still valid");'
```

Output:

```text
WP16 adapter contract still valid
```

Result: PASS.

### `npm test`

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

Result: PASS.

### `git diff -- app.js index.html styles.css mockBackend.js package.json _redirects`

```text
(no output)
```

Result: PASS. Forbidden runtime/product files have no tracked diff.

### `git diff -- tests/run-all.js`

```text
(no output)
```

Result: PASS. Test runner has no tracked diff.

### `git diff -- tests/driver-stack/runtimeAdapterPrototype.mjs tests/driver-stack/runtimeAdapterPrototype.test.js tests/driver-stack/exportRuntimeAdapterPrototype.mjs`

```text
(no output)
```

Result: PASS. WP14 adapter module/test/exporter have no tracked diff.

### `git diff --cached --name-only`

```text
(no output)
```

Result: PASS. Nothing is staged.

### Actions not performed

- No commit.
- No staging.
- No deploy.
- No PDF generation.
- No runtime implementation.
- No production rendering.
- No payment/QPay/backend/pricing/entitlement changes.
- No test modifications.

---

# Embedded Artifact 1: `shadow-runtime-integration-plan.md`

~~~markdown
# WP16 Shadow Runtime Integration Implementation Plan

## WP16 purpose

WP16 is a docs-only shadow runtime integration implementation plan and exact patch scope for a possible future WP17.

WP16 answers:

1. Whether WP17 may touch `app.js`.
2. If yes, exactly where and why.
3. What disabled feature flag or shadow-only guard must exist.
4. How the WP14 runtime adapter can be invoked without visible user-facing output.
5. What tests must be added before or with implementation.
6. What success criteria prove no production behavior changed.
7. What rollback plan is required before any runtime code is committed.

Runtime implementation is NOT approved by WP16.

## Current state

Current committed planning and prototype state:

- WP13 created docs-only runtime-readiness planning.
- WP14 created the test-only runtime adapter contract in `tests/driver-stack/runtimeAdapterPrototype.mjs`.
- WP14 preserved `runtimeSafetyGate.canRenderInRuntime === false`.
- WP14 preserved `adapterMode === "test_only"`.
- WP14 preserved `reportSurface === "prototype_only"`.
- WP14 preserved `paymentGate.safetyGuidanceRequiresPayment === false`.
- WP15 created the pre-`app.js` decision gate.
- WP15 decision is `GO - READY TO PLAN SHADOW APPJS INTEGRATION`.

The current pipeline remains:

```text
WP3 driver stack -> WP4 report object -> WP9 copy decision metadata -> WP12 polished copy renderer -> WP14 test-only runtime adapter prototype -> future shadow runtime integration -> future report surface
```

The WP14 adapter can produce a sanitized prototype payload with:

- `previewSections`
- `paidSections`
- `safetyGuidanceSections`
- `internalDiagnostics`
- `ownerDebug`
- `runtimeSafetyGate`
- `paymentGate`

That payload is still test-only and cannot be treated as production report rendering.

## What WP15 GO actually allows

WP15 allows only planning a future shadow `app.js` integration work pack.

WP15 does not approve:

- editing `app.js`;
- runtime implementation;
- production user-facing rendering;
- deploy;
- PDF generation;
- payment, QPay, backend, pricing, or entitlement work;
- adapter code changes;
- test changes.

WP15 GO means WP16 may define a future patch scope. It does not mean WP16 may implement that patch.

## What remains blocked

The following remain HOLD:

- runtime implementation;
- production report rendering;
- visible UI change;
- payment change;
- deploy;
- PDF generation;
- scoring change;
- report copy change;
- QPay/backend change;
- backend/payment/pricing/entitlement work;
- WP3 scoring or fixture changes;
- WP4 report object contract changes;
- WP9 metadata contract changes;
- WP10/WP12 renderer contract changes.

WP16 explicitly says:

- no production rendering;
- no visible UI change;
- no payment change;
- no deploy;
- no PDF;
- no scoring change;
- no report copy change;
- no QPay/backend change.

## Why shadow integration is needed before visible report rendering

Shadow integration is the lowest-risk bridge between the test-only adapter and runtime. It lets a future work pack prove that `app.js` can call or exercise the adapter path without changing what users see.

Shadow integration is needed before visible report rendering because the current runtime already controls safety routes, paid/unpaid access, localStorage state, report readiness, and report HTML. Any visible integration before a shadow pass could accidentally:

- expose internal keys or fixture names;
- bypass safety/professional-first routes;
- hide safety guidance behind payment;
- expose paid-depth content to unpaid users;
- change existing one-time or removed-feature report HTML;
- write new data into localStorage;
- alter QPay or mock entitlement behavior.

The shadow path must therefore prove adapter invocation, no visible output, no state mutation, and no production behavior change before any future user-facing surface is considered.

## Exact proposed WP17 goal

Proposed future work pack:

```text
WP17 - Disabled shadow app.js runtime adapter integration
```

Exact WP17 goal:

Add a disabled-by-default shadow adapter invocation path inside `app.js` so tests can prove the runtime can assemble and validate a WP14 adapter payload without changing returned report HTML, DOM output, localStorage shape, payment behavior, entitlement behavior, scoring behavior, or report copy.

WP17 may touch `app.js` only if the owner accepts WP16.

WP17 may add tests only if the owner accepts WP16.

WP17 must not expose the shadow payload in production UI.

## Exact WP17 non-goals

WP17 must not:

- implement production rendering;
- show WP14 adapter sections to users;
- change visible report HTML;
- change report copy;
- change scoring;
- change stage or diary question behavior;
- change localStorage keys or persisted state shape;
- change QPay, backend, payment, pricing, entitlement, or coach behavior;
- change PDF generation;
- deploy;
- modify WP3 scoring or fixtures;
- modify the WP4 report object contract;
- modify the WP9 metadata contract;
- modify the WP10/WP12 renderer contract;
- modify the WP14 adapter module, test, or exporter unless separately approved.

## Whether WP17 may touch `app.js`

Yes, but only after owner acceptance of WP16.

WP17 may touch `app.js` for a shadow-only integration if and only if:

- the shadow path is disabled by default;
- the shadow path has no user-facing output;
- the shadow path does not alter the return value of `renderReport()`;
- the shadow path does not call `saveState()`;
- the shadow path does not write to `localStorage`;
- the shadow path does not alter payment, QPay, backend, pricing, entitlement, or coach behavior;
- tests prove existing report HTML is byte-for-byte unchanged when the shadow flag is disabled;
- tests prove the shadow path can run only through an explicit test-only or internal shadow guard.

## Exact proposed `app.js` patch scope for WP17

WP17 may propose only the following `app.js` edits:

| Proposed edit | Allowed WP17 scope | Reason | Forbidden expansion |
| --- | --- | --- | --- |
| Add a disabled shadow flag constant near other top-level constants | Yes, if default is false | Makes runtime adapter invocation opt-in for tests only | No URL-enabled public flag, no production default true |
| Add a pure shadow helper that receives already-computed report context | Yes | Keeps adapter invocation separate from rendering branches | No DOM writes, no state writes, no localStorage writes |
| Call that helper inside `renderReport()` after report inputs are computed and before existing return branches | Yes | This is the narrowest point with report mode, ranking, tags, readiness, and state context already available | No changes to existing return branches or HTML strings |
| Expose a test-only internal hook under `module.exports._internal` | Yes, if tests need it | Lets tests inspect shadow behavior in Node without UI output | No browser global, no public UI control |
| Add tests for disabled and enabled shadow behavior | Yes, in a future approved WP17 | Proves no production behavior changed | No edits to unrelated tests unless explicitly approved |

WP17 must not touch:

- `index.html`
- `styles.css`
- `mockBackend.js`
- `package.json`
- `_redirects`
- `tests/run-all.js`
- WP14 adapter module, test, or exporter
- backend/payment/QPay/pricing/entitlement code
- PDF scripts

## Exact recommended touchpoint

The recommended WP17 touchpoint is inside `renderReport()` in `app.js`, immediately after these report inputs are computed:

- `quality`
- `mode`
- `ranked`
- `primary`
- `secondary`
- `primaryMechanism`
- `isOneTime`
- `ctaPatterns`
- `readiness`
- `narrativeEvidence`
- `stageEvidence`
- `tags`
- `triggerRows`
- `hiddenItems`
- `surfaceItems`
- `beforeItems`
- `afterItems`
- `cycleSteps`
- `avoidItems`
- `leverage`
- `experiment`

The shadow helper should run before the existing safety, payment, readiness, one-time, and removed-feature return branches. It must not change those branches.

Why this touchpoint:

- report context already exists;
- the existing user-facing branch structure stays intact;
- safety/professional routes can remain first-class existing returns;
- payment and entitlement gates can remain unchanged;
- no new localStorage read or write is needed;
- tests can compare returned HTML with the flag disabled.

## Disabled feature flag or shadow-only guard

WP17 must include a disabled default guard equivalent to:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

Required guard rules:

- exact flag name must be `ENABLE_RUNTIME_ADAPTER_SHADOW`;
- default value must be `false`;
- no query parameter may enable it for public users;
- no localStorage value may enable it;
- no payment, QPay, backend, pricing, or entitlement state may enable it;
- tests may enable it only through a test-only internal hook or explicit injected option;
- when disabled, the helper must return `null` or an equivalent non-rendered value;
- when enabled in tests, the helper output must remain internal-only.

The guard must preserve the WP14 safety gate:

```text
runtimeSafetyGate.canRenderInRuntime === false
```

## Invoking the WP14 adapter without visible user-facing output

WP17 should invoke the WP14 adapter only through a shadow path that does not feed the payload into returned HTML.

Allowed shadow invocation pattern:

1. Build or import the adapter payload in a test-only path.
2. Validate that the payload still has `adapterMode === "test_only"`.
3. Validate that the payload still has `reportSurface === "prototype_only"`.
4. Validate that `runtimeSafetyGate.canRenderInRuntime === false`.
5. Validate that `paymentGate.safetyGuidanceRequiresPayment === false`.
6. Store the shadow result only in a local variable or test-only internal return value.
7. Do not append the payload to DOM.
8. Do not include the payload in report HTML.
9. Do not write the payload to localStorage.
10. Do not send the payload to mockBackend, QPay, backend, analytics, PDF, or deploy code.

If browser/runtime module format prevents direct ESM import from `tests/driver-stack/runtimeAdapterPrototype.mjs`, WP17 should keep adapter invocation in Node tests and add only the smallest `app.js` shadow hook needed to prove `renderReport()` can call a shadow helper without changing output. WP17 must not restructure the app to solve module-format issues.

## Tests required before or with WP17 implementation

WP17 must add focused tests before or with implementation. Required test coverage:

- disabled shadow flag leaves `_internal.renderReport()` output unchanged for one-time paid report;
- disabled shadow flag leaves `_internal.renderReport()` output unchanged for unpaid one-time paywall;
- disabled shadow flag leaves `_internal.renderReport()` output unchanged for removed-feature readiness/paywall paths;
- disabled shadow flag leaves professional-first and urgent safety routes unchanged;
- shadow helper does not call `saveState()`;
- shadow helper does not read or write `localStorage`;
- shadow helper does not alter `state`;
- shadow helper does not alter `hasOneTimeReportAccess()`, `hasRemovedFeatureAccess()`, or `hasUpgradeAccess()`;
- enabled test-only shadow path returns an internal-only payload or validation result;
- enabled test-only shadow path preserves `runtimeSafetyGate.canRenderInRuntime === false`;
- enabled test-only shadow path preserves `paymentGate.safetyGuidanceRequiresPayment === false`;
- enabled test-only shadow path does not leak `previewSections`, `paidSections`, `safetyGuidanceSections`, `internalDiagnostics`, or `ownerDebug` into returned HTML;
- full `npm test` remains green.

Required commands for WP17 evidence:

```bash
git status --short
git diff --check
node --check app.js
node tests/driver-stack/runtimeAdapterPrototype.test.js
node tests/driver-stack/exportRuntimeAdapterPrototype.mjs > /tmp/wp17_runtime_adapter_shadow_check.json
npm test
git diff -- index.html styles.css mockBackend.js package.json _redirects tests/run-all.js
git diff -- tests/driver-stack/runtimeAdapterPrototype.mjs tests/driver-stack/runtimeAdapterPrototype.test.js tests/driver-stack/exportRuntimeAdapterPrototype.mjs
```

The final two diff checks must prove forbidden files and WP14 adapter files were not modified unless a future owner-approved WP17 scope explicitly changes that list.

## Success criteria proving no production behavior changed

WP17 cannot be considered successful unless all of the following are true:

- existing report HTML is unchanged with the shadow flag disabled;
- existing paywall HTML is unchanged with the shadow flag disabled;
- existing professional-first and urgent safety HTML is unchanged with the shadow flag disabled;
- existing localStorage key remains `weightLossDeepPatternMvp`;
- no new localStorage field is persisted by shadow integration;
- no QPay endpoint, payload, status, price, product code, or payment message changes;
- no mockBackend access or entitlement result changes;
- no stage or diary answer flow changes;
- no production-visible copy changes;
- no PDF output is generated;
- no deploy is performed;
- `npm test` passes;
- `git diff --check` passes;
- forbidden-file diffs are empty.

## Required rollback plan before runtime code is committed

Before any WP17 runtime code is committed, the owner pack must record:

- current pre-WP17 commit hash;
- exact WP17 changed files;
- exact shadow flag name and default value;
- exact rollback command or revert plan;
- expected post-rollback `git status --short`;
- post-rollback test commands;
- rollback triggers.

Required rollback triggers:

- any user-visible HTML change when the shadow flag is disabled;
- any localStorage shape change;
- any payment, QPay, backend, pricing, entitlement, or coach behavior change;
- any safety/professional guidance hidden behind payment;
- any internal key or adapter diagnostic visible to users;
- any PDF generation;
- any deploy;
- any failing `npm test`.

Minimum rollback command shape for WP17 owner review:

```bash
git revert <wp17_commit_hash>
npm test
```

If WP17 is not committed yet, rollback must be:

```bash
git restore app.js <approved_wp17_test_files>
npm test
```

The exact files must be listed in the WP17 owner pack before commit.

## Exact conclusion

Runtime implementation is NOT approved by WP16.

WP17 may only implement shadow integration if the owner accepts WP16.
~~~

---

# Embedded Artifact 2: `appjs-shadow-touchpoint-audit.md`

~~~markdown
# WP16 app.js Shadow Touchpoint Audit

## Purpose

This document audits `app.js` read-only and identifies where a future shadow runtime adapter could be safely invoked.

WP16 does not modify `app.js`.

Runtime implementation is NOT approved by WP16.

## `app.js` areas inspected

Read-only inspection covered:

- state loading and persistence: `loadState()`, `saveState()`, `resetState()`, `setView()`;
- payment and entitlement paths: QPay helpers, `hasOneTimeReportAccess()`, `hasRemovedFeatureAccess()`, `hasUpgradeAccess()`;
- answer mutation paths: `setAnswer()`, `setAnswerDraft()`;
- report rendering helpers: `renderHumanReadableReport()`, `renderOneTimeReport()`, paywall renderers;
- main report branch: `renderReport()`;
- browser render router: `render()`;
- Node test exports under `module.exports._internal`.

## Required touchpoint table

| Candidate touchpoint | What happens there now | Shadow adapter suitability | Risk | WP17 recommendation |
| --- | --- | --- | --- | --- |
| Top-level module load near constants | Defines storage key, pricing constants, QPay endpoints, question banks, mechanisms, and initial state | Low | Runs before report context exists; easy to create global behavior or module-format problems | Do not invoke adapter here. Only `ENABLE_RUNTIME_ADAPTER_SHADOW = false` may be added here if WP17 is approved. |
| `loadState()` | Reads `localStorage`, URL params, path view, internal test flag, and coach invite token | Unsafe | Any shadow logic here could change persisted state semantics or public URL behavior | Do not touch for shadow adapter invocation. |
| `saveState()` | Writes full `state` to `localStorage` under `weightLossDeepPatternMvp` | Unsafe | Any shadow output stored here would change localStorage shape and create production behavior drift | Do not touch. Shadow path must not call this. |
| Answer update functions such as `setAnswer()` and `setAnswerDraft()` | Mutate stage answers, recalculate safety flags, save state, and sometimes render | Unsafe | Too early; adapter would run during input changes and could affect state, performance, or safety flags | Do not touch. |
| Payment/QPay functions and access helpers | Create/check QPay invoices, mark payment status, and evaluate access | Unsafe | Could alter payment, entitlement, QPay status, or paywall behavior | Do not touch. Shadow adapter must not depend on these to enable rendering. |
| `renderHumanReadableReport()` | Builds existing visible report HTML for one-time and removed-feature full reports | Limited | Already inside visible rendering; adding adapter output here risks copy or markup drift | Do not invoke adapter here. Existing HTML must remain unchanged. |
| `renderOneTimeReport()` | Delegates one-time paid rendering to `renderHumanReadableReport()` | Limited | Too narrow for removed-feature, safety, paywall, and readiness coverage | Do not use as primary touchpoint. |
| `renderReport()` after report inputs are computed and before existing return branches | Computes mode, ranked patterns, primary/secondary mechanisms, readiness, evidence, tags, and report helper data before safety/payment/readiness branches return HTML | Best candidate | Must prove no returned HTML, state, localStorage, payment, or entitlement changes | Recommended WP17 touchpoint, behind disabled shadow guard only. |
| `render()` route dispatcher | Chooses route renderer and writes returned HTML into `#app` | Unsafe | Any adapter call here is too close to DOM output and applies to every route | Do not touch for shadow adapter invocation. |
| `module.exports._internal` | Exposes functions for Node tests | Good for tests only | Could accidentally expose public browser globals if misused elsewhere | May expose a test-only shadow helper or test setter if WP17 is approved. |

## Exact recommended touchpoint for WP17

The exact recommended touchpoint is inside `renderReport()` in `app.js`, immediately after the existing report context variables are computed and before the first existing return branch.

The relevant computed data currently includes:

- `quality`
- `mode`
- `ranked`
- `primary`
- `secondary`
- `primaryMechanism`
- `isOneTime`
- `ctaPatterns`
- `readiness`
- `narrativeEvidence`
- `stageEvidence`
- `tags`
- `triggerRows`
- `hiddenItems`
- `surfaceItems`
- `beforeItems`
- `afterItems`
- `cycleSteps`
- `avoidItems`
- `leverage`
- `experiment`

The shadow call must be shaped so the existing branches remain the authority:

- urgent route still returns urgent safety copy;
- professional route still returns professional-first copy;
- unpaid one-time route still returns the one-time paywall;
- unpaid removed-feature route still returns the removed-feature paywall;
- insufficient removed-feature route still returns readiness copy;
- paid one-time route still returns the existing one-time report;
- paid removed-feature route still returns the existing removed-feature report.

## Why this touchpoint is safest

This point is safest because `renderReport()` has already gathered report inputs but has not yet returned user-facing HTML.

At this point WP17 can run a disabled shadow helper for tests without:

- changing the router;
- changing DOM writes;
- changing localStorage;
- changing answer mutation;
- changing payment access checks;
- changing QPay behavior;
- changing visible report copy;
- changing safety/professional branch priority.

## Data available there

The recommended touchpoint has enough read-only report context to build an internal shadow context:

- current report mode from `reportMode()`;
- ranked mechanism results from `rankedPatterns(true)`;
- primary and secondary mechanism candidates;
- current package type;
- report readiness;
- confirmed stage and narrative evidence;
- report tags;
- trigger, hidden-function, surface-behavior, before-eating, and after-eating helper outputs;
- cycle, avoid-list, leverage, and experiment helper outputs.

WP17 may pass this data into a pure shadow helper for validation only.

## Data that must not be accessed

The shadow adapter must not access:

- `localStorage`;
- QPay invoice data;
- QPay endpoint URLs;
- payment session IDs;
- payment status except through existing branches that already use it;
- backend or mockBackend mutation APIs;
- coach session tokens;
- coach client records;
- lead capture records;
- DOM nodes;
- browser URL query flags as an enablement path;
- PDF generation scripts;
- deploy metadata.

The shadow adapter must not read payment or entitlement state to decide whether to render. Rendering remains blocked.

## User-visible behavior that must remain unchanged

With the shadow flag disabled, all user-visible behavior must remain unchanged:

- same returned HTML from `_internal.renderReport()` for existing tested states;
- same urgent safety route;
- same professional-first route;
- same one-time unpaid paywall;
- same one-time paid report;
- same removed-feature paywall;
- same removed-feature readiness gate;
- same removed-feature report;
- same internal tester feedback UI;
- same buttons and route changes;
- same report copy;
- no new loading state;
- no new console-required behavior.

The WP14 adapter payload must not appear in:

- DOM;
- returned HTML strings;
- visible report sections;
- paywall sections;
- feedback export;
- coach dashboard;
- admin coach view.

## localStorage behavior that must remain unchanged

Current state persistence uses:

```text
weightLossDeepPatternMvp
```

WP17 must preserve:

- same storage key;
- same load timing;
- same save timing;
- same state fields unless separately approved;
- no persisted shadow payload;
- no persisted adapter diagnostics;
- no persisted owner debug;
- no localStorage query or flag that enables shadow runtime behavior.

The shadow helper must not call `saveState()`.

If WP17 is approved, the only allowed flag name is:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

## Payment and entitlement behavior that must remain unchanged

WP17 must preserve:

- `hasOneTimeReportAccess()` behavior;
- `hasRemovedFeatureAccess()` behavior;
- `hasUpgradeAccess()` behavior;
- QPay create/check endpoint values;
- QPay product code;
- QPay amount and price behavior;
- mockBackend access-state behavior;
- paywall branch order;
- safety/professional guidance outside payment;
- no paid-depth report exposure for unpaid users.

The WP14 adapter's `paymentGate.safetyGuidanceRequiresPayment === false` must remain an internal validation invariant only. It must not become a production entitlement implementation in WP17.

## Rollback implications

Because the recommended touchpoint is inside `renderReport()`, rollback must be simple and exact.

WP17 rollback plan must list:

- pre-WP17 commit hash;
- WP17 commit hash if committed;
- exact `app.js` hunk names or helper names;
- exact tests added;
- revert command;
- post-rollback test commands.

Rollback must remove:

- disabled shadow flag;
- shadow helper;
- `renderReport()` shadow call;
- test-only internal hook;
- WP17 tests.

Rollback must not touch:

- unrelated untracked folders;
- payment code;
- QPay code;
- backend code;
- PDF scripts;
- WP14 adapter module/test/exporter unless explicitly modified by a future approved scope.

## Required WP17 test evidence from this audit

WP17 tests must prove:

- disabled shadow path returns exactly the same report HTML as before;
- enabled test-only shadow path can validate WP14 payload without using returned HTML;
- no shadow payload appears in report HTML;
- no localStorage reads or writes are added by shadow invocation;
- payment and entitlement helpers return the same values before and after shadow invocation;
- safety/professional routes remain unchanged;
- full regression tests pass.

## Final audit recommendation

WP17 may touch `app.js` only at the `renderReport()` shadow touchpoint described above, and only if the owner accepts WP16.

The patch must be disabled by default, internal-only, test-covered, rollback-ready, and non-rendering.

Runtime implementation is NOT approved by WP16.
~~~

---

# Embedded Artifact 3: `shadow-feature-flag-plan.md`

~~~markdown
# WP16 Shadow Feature Flag Plan

## Purpose

This document defines the disabled feature flag required before any future shadow runtime adapter integration.

WP16 is docs-only.

Runtime implementation is NOT approved by WP16.

## Required flag

WP17 must use this exact flag name and default value:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

The flag must be disabled by default in production and test runtime.

## Required rules

| Rule | Required WP17 behavior | Reason |
| --- | --- | --- |
| Exact name | `ENABLE_RUNTIME_ADAPTER_SHADOW` | Keeps owner review and tests unambiguous. |
| Exact default | `false` | Prevents accidental runtime behavior. |
| Public URL enablement | Forbidden | Query params must not expose shadow behavior. |
| localStorage enablement | Forbidden | Storage must not become a hidden runtime switch. |
| Payment enablement | Forbidden | Payment state must not activate shadow rendering. |
| Entitlement enablement | Forbidden | Entitlements must not activate shadow rendering. |
| Deploy enablement | Forbidden | Deploy config must not turn shadow on. |
| Test enablement | Allowed only through explicit test-only internals | Keeps browser users unaffected. |

## Allowed future placement

If WP17 is accepted, the constant may be added near the top-level app constants in `app.js`.

Allowed shape:

```text
const ENABLE_RUNTIME_ADAPTER_SHADOW = false;
```

WP17 must not add:

- a public UI toggle;
- a query-param toggle;
- a localStorage toggle;
- a backend toggle;
- a QPay/payment toggle;
- a pricing/entitlement toggle;
- a deploy environment toggle.

## Disabled behavior

When `ENABLE_RUNTIME_ADAPTER_SHADOW` is `false`:

- no adapter payload is generated in browser runtime;
- no returned HTML changes;
- no DOM output changes;
- no localStorage read is added;
- no localStorage write is added;
- no payment or entitlement call changes;
- no scoring or report-copy path changes;
- no PDF or deploy path is touched.

## Test-only enabled behavior

If WP17 needs to exercise the shadow path in tests, it may do so only through a test-only internal hook under `module.exports._internal`.

The enabled test-only path may return an internal validation object to the test process, but it must not:

- append data to returned report HTML;
- write to `state`;
- call `saveState()`;
- call `localStorage`;
- call QPay endpoints;
- call backend or mockBackend mutation APIs;
- expose `previewSections`, `paidSections`, `safetyGuidanceSections`, `internalDiagnostics`, or `ownerDebug` in user-facing markup.

## Required invariant checks

When the shadow path is enabled in tests, WP17 must assert:

- `adapterMode === "test_only"`;
- `reportSurface === "prototype_only"`;
- `runtimeSafetyGate.canRenderInRuntime === false`;
- `paymentGate.safetyGuidanceRequiresPayment === false`;
- no adapter user-facing field leaks internal keys;
- no adapter field appears in returned `renderReport()` HTML.

## Owner acceptance requirement

WP17 may add `ENABLE_RUNTIME_ADAPTER_SHADOW = false` to `app.js` only after the owner accepts WP16.

Runtime implementation is NOT approved by WP16.
~~~

---

# Embedded Artifact 4: `shadow-adapter-invocation-contract.md`

~~~markdown
# WP16 Shadow Adapter Invocation Contract

## Purpose

This document defines how a future WP17 may invoke the WP14 runtime adapter in shadow mode without visible user-facing output.

WP16 is docs-only.

Runtime implementation is NOT approved by WP16.

## Source adapter

The current adapter source is:

```text
tests/driver-stack/runtimeAdapterPrototype.mjs
```

The adapter remains test-only. WP17 must not modify the WP14 adapter module, test, or exporter unless a future owner-approved scope explicitly allows it.

## Invocation principle

Shadow invocation means:

- adapter validation may happen internally;
- returned report HTML must remain unchanged;
- no adapter payload may be rendered;
- no adapter payload may be persisted;
- no adapter payload may be sent to payment, backend, deploy, PDF, or analytics paths.

## Exact invocation contract table

| Contract area | Required behavior | Forbidden behavior | Test required |
| --- | --- | --- | --- |
| input source | Use read-only report context already computed inside `renderReport()` or the existing WP14 test-only adapter export path. | Reading raw localStorage, QPay invoice payloads, payment sessions, coach tokens, DOM nodes, PDF output, or deploy metadata. | Assert the shadow helper receives only approved context fields or the existing WP14 test-only adapter payload. |
| output destination | Return only an internal test/QA validation object when explicitly enabled in tests. | Rendering adapter payload fields to DOM, report HTML, paywalls, coach/admin surfaces, PDF, backend, analytics, or deploy paths. | Assert returned report HTML does not contain adapter field names or adapter content. |
| no-visible-output rule | Keep user-facing report HTML byte-for-byte unchanged when `ENABLE_RUNTIME_ADAPTER_SHADOW = false`. | Any visible UI, copy, button, route, paywall, safety, or report-section change. | Snapshot/compare existing report outputs with the flag false. |
| no payment mutation | Preserve payment, QPay, pricing, entitlement, mockBackend access, and coach payment behavior. | Calling QPay endpoints, changing product codes, changing prices, changing access helpers, or treating adapter payment fields as entitlements. | Assert access helpers and QPay/payment diffs remain unchanged. |
| no report mutation | Preserve existing report branch order, returned HTML, report copy, scoring, evidence, and readiness behavior. | Replacing report renderers, changing report copy, changing scoring, or wiring adapter sections into visible reports. | Assert one-time, removed-feature, safety, professional, and readiness flows remain unchanged. |
| no localStorage mutation unless explicitly approved | Do not read localStorage, write localStorage, call `saveState()`, or persist shadow diagnostics. | Adding storage keys, persisted flags, adapter payloads, owner debug, diagnostics, or shadow state. | Assert storage key and state shape remain unchanged; spy or inspect that shadow path does not call storage APIs. |
| console logging policy | No production console logging from the shadow path; test logs may come only from explicit test commands. | Logging adapter payloads, internal diagnostics, fixture names, owner debug, or user-sensitive report context in browser runtime. | Assert no shadow helper console output is required for pass/fail behavior. |
| internal QA capture policy | Keep internal QA capture limited to test process output or owner-review artifacts. | Persisting QA payloads in browser state, localStorage, backend, PDF, deploy artifacts, or visible UI. | Assert generated QA artifacts are explicit test outputs only and not runtime state. |
| adapter failure behavior | Contain adapter failures so existing user flow and report rendering continue unchanged when shadow mode is disabled. | Throwing adapter errors into user flow, blocking report rendering, changing route, or showing fallback UI. | Assert disabled shadow path cannot fail user rendering; enabled test-only failures fail tests only. |

## Required input boundary

The future shadow helper may receive read-only report context already computed by `renderReport()`.

Allowed read-only context:

- report mode;
- ranked mechanism list;
- primary mechanism;
- secondary mechanisms;
- package type;
- report readiness;
- stage evidence;
- narrative evidence;
- report tags;
- helper output already computed inside `renderReport()`.

Forbidden input:

- raw localStorage object;
- QPay invoice payload;
- payment session ID;
- coach session token;
- backend mutation output;
- DOM nodes;
- generated HTML string as an adapter input;
- PDF output;
- deploy metadata.

## Required output boundary

The future shadow helper may return only an internal validation object to tests.

Allowed internal fields:

- `shadowAttempted`;
- `shadowEnabled`;
- `adapterMode`;
- `reportSurface`;
- `runtimeCanRender`;
- `safetyGuidanceRequiresPayment`;
- `pass`;
- `errors`.

Forbidden user-facing output:

- `previewSections`;
- `paidSections`;
- `safetyGuidanceSections`;
- `internalDiagnostics`;
- `ownerDebug`;
- raw fixture names;
- raw mechanism keys;
- raw test-only status strings;
- runtime gate metadata.

## Required guard

The invocation must be guarded by:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

When the flag is false, the shadow helper must return without building or rendering an adapter payload.

## Required non-rendering contract

WP17 tests must prove:

- shadow invocation does not change `renderReport()` return values when disabled;
- shadow invocation does not append adapter text to HTML when enabled in tests;
- shadow invocation does not mutate state;
- shadow invocation does not call `saveState()`;
- shadow invocation does not read or write localStorage;
- shadow invocation does not alter access helpers;
- shadow invocation preserves WP14 safety/payment invariants.

## Module-format constraint

`app.js` is currently CommonJS-testable and browser-script-oriented. The WP14 adapter is an ESM module.

WP17 must not restructure `app.js` or the production build to solve module-format friction.

If direct browser invocation is not feasible without widening scope, WP17 must keep adapter invocation in Node tests and limit `app.js` to a pure shadow hook proving no visible behavior changes.

## Final contract

The adapter may be invoked only as an internal shadow validation path.

It may not become production rendering.

Runtime implementation is NOT approved by WP16.
~~~

---

# Embedded Artifact 5: `wp17-exact-patch-scope.md`

~~~markdown
# WP16 Proposed WP17 Exact Patch Scope

## Purpose

This document defines the exact future WP17 patch scope that may be considered if the owner accepts WP16.

WP16 is docs-only and does not approve implementation.

Runtime implementation is NOT approved by WP16.

## Proposed WP17 title

```text
WP17 - Disabled Shadow Runtime Adapter Integration
```

## Files WP17 may touch only after owner acceptance

| File | Proposed WP17 permission | Exact reason |
| --- | --- | --- |
| `app.js` | Allowed only after owner accepts WP16 | Add disabled shadow flag, pure shadow helper, `renderReport()` shadow call, and test-only internal hook. |
| Future WP17 test file under `tests/` | Allowed only after owner accepts WP16 | Prove disabled behavior is unchanged and enabled shadow path is internal-only. |
| Future WP17 owner-review docs | Allowed | Record evidence, risks, and rollback. |

## Files WP17 must not touch

- `index.html`
- `styles.css`
- `mockBackend.js`
- `package.json`
- `_redirects`
- `tests/run-all.js`
- `tests/driver-stack/runtimeAdapterPrototype.mjs`
- `tests/driver-stack/runtimeAdapterPrototype.test.js`
- `tests/driver-stack/exportRuntimeAdapterPrototype.mjs`
- PDF scripts
- deploy config
- QPay/backend/payment/pricing/entitlement files
- WP3 scoring/fixtures
- WP4 report object contract
- WP9 metadata contract
- WP10/WP12 renderer contract

## Exact allowed `app.js` hunk plan

| Hunk | Allowed change | Required guard |
| --- | --- | --- |
| Top-level constants | Add `const ENABLE_RUNTIME_ADAPTER_SHADOW = false;` | Must default false. |
| Pure helper | Add an internal shadow helper that receives read-only report context | Must not mutate state or render output. |
| `renderReport()` | Call the helper after report context variables are computed and before existing return branches | Must not change existing return branches. |
| `_internal` exports | Add test-only access to the helper or shadow test control | Must not create browser globals or public UI controls. |

## Exact forbidden `app.js` changes

WP17 must not:

- change existing HTML strings;
- change report copy;
- change paywall copy;
- change safety copy;
- change professional-first branch order;
- change `hasOneTimeReportAccess()`;
- change `hasRemovedFeatureAccess()`;
- change `hasUpgradeAccess()`;
- change `saveState()`;
- change `loadState()`;
- change `STORAGE_KEY`;
- change QPay constants or functions;
- change coach/admin behavior;
- change `render()` route dispatch;
- import adapter output into DOM rendering.

## Required patch proof

WP17 owner pack must include:

- exact changed file list;
- exact diff summary;
- disabled flag proof;
- no-visible-output test proof;
- localStorage no-change proof;
- payment/entitlement no-change proof;
- rollback command.

## Exact WP17 gate

WP17 may only implement this exact patch scope if the owner accepts WP16.

Runtime implementation is NOT approved by WP16.
~~~

---

# Embedded Artifact 6: `shadow-integration-test-plan.md`

~~~markdown
# WP16 Shadow Integration Test Plan

## Purpose

This document defines the tests required before or with a future WP17 shadow runtime adapter integration.

WP16 is docs-only.

Runtime implementation is NOT approved by WP16.

## Required automated tests

Future WP17 tests must prove the disabled shadow path changes nothing visible.

| Test area | Test type | Required assertion | Blocks WP17 commit if failing? |
| --- | --- | --- | --- |
| feature flag default false | Unit/static contract | `ENABLE_RUNTIME_ADAPTER_SHADOW` exists only in the approved WP17 scope and defaults to `false`. | Yes |
| no visible output when flag false | Snapshot/regression | `_internal.renderReport()` output is unchanged when `ENABLE_RUNTIME_ADAPTER_SHADOW = false`. | Yes |
| no report mutation when flag false | Snapshot/regression | One-time, removed-feature, readiness, professional, and urgent report branches return the same HTML as before. | Yes |
| no payment mutation | Unit/regression | `hasOneTimeReportAccess()`, `hasRemovedFeatureAccess()`, `hasUpgradeAccess()`, QPay constants, prices, and product codes are unchanged. | Yes |
| no localStorage mutation unless explicitly approved | Unit/regression | Shadow helper does not read localStorage, write localStorage, call `saveState()`, add storage keys, or persist adapter diagnostics. | Yes |
| adapter invocation isolated | Unit/integration | Enabled test-only shadow path returns internal validation only and does not feed payload into returned HTML or runtime state. | Yes |
| adapter failure contained | Unit/integration | Adapter failure in enabled test-only mode fails tests only; disabled shadow mode cannot break user report rendering. | Yes |
| internal keys not rendered | HTML scan | Returned HTML does not include raw fixture names, mechanism keys, `ownerDebug`, `internalDiagnostics`, or adapter field names. | Yes |
| safety guidance not payment-gated | Unit/regression | `paymentGate.safetyGuidanceRequiresPayment === false` remains true and safety/professional guidance stays outside payment gates. | Yes |
| existing report flow unchanged | End-to-end regression | Stage, diary, one-time report, removed-feature report, paywall, professional, urgent, and readiness flows remain unchanged. | Yes |
| current tests still pass | Full regression | `npm test` passes. | Yes |
| runtime adapter contract still pass | Adapter contract test | `runtimeAdapterPrototype.test.js` passes and exported payload shape/gates remain exact. | Yes |
| no deploy/PDF/payment/backend touched | Scope diff check | Deploy files, PDF scripts, payment/QPay/backend/pricing/entitlement files, and forbidden product files have empty diffs. | Yes |

## Required adapter invariant tests

When the shadow path is enabled in tests only, assert:

```text
adapterMode === "test_only"
reportSurface === "prototype_only"
runtimeSafetyGate.canRenderInRuntime === false
paymentGate.safetyGuidanceRequiresPayment === false
```

Also assert:

- no raw fixture names in returned HTML;
- no raw mechanism keys in returned HTML;
- no `ownerDebug` in returned HTML;
- no `internalDiagnostics` in returned HTML;
- no `previewSections` field name in returned HTML;
- no `paidSections` field name in returned HTML;
- no `safetyGuidanceSections` field name in returned HTML.

## Required command evidence

Future WP17 must run and record:

```bash
git status --short
git diff --check
node --check app.js
node tests/driver-stack/runtimeAdapterPrototype.test.js
node tests/driver-stack/exportRuntimeAdapterPrototype.mjs > /tmp/wp17_runtime_adapter_shadow_check.json
npm test
git diff -- index.html styles.css mockBackend.js package.json _redirects tests/run-all.js
git diff -- tests/driver-stack/runtimeAdapterPrototype.mjs tests/driver-stack/runtimeAdapterPrototype.test.js tests/driver-stack/exportRuntimeAdapterPrototype.mjs
```

## Forbidden test changes

WP17 must not modify `tests/run-all.js` unless the owner explicitly widens the scope.

WP17 must not modify the WP14 adapter module, test, or exporter unless the owner explicitly widens the scope.

## Success criteria

WP17 passes only if:

- all required tests pass;
- full `npm test` passes;
- disabled output remains unchanged;
- enabled shadow output remains internal-only;
- no forbidden files are modified;
- no deploy or PDF is generated.

Runtime implementation is NOT approved by WP16.
~~~

---

# Embedded Artifact 7: `shadow-rollback-plan.md`

~~~markdown
# WP16 Shadow Rollback Plan

## Purpose

This document defines the rollback plan required before any future WP17 runtime code is committed.

WP16 is docs-only.

Runtime implementation is NOT approved by WP16.

## Rollback principle

Shadow integration must be reversible with a narrow revert. WP17 must not require rollback across payment, backend, PDF, deploy, pricing, entitlement, WP3, WP4, WP9, WP10, or WP12 files.

## Required pre-commit rollback record

Before any WP17 code is committed, the WP17 owner pack must record:

- pre-WP17 commit hash;
- WP17 commit hash if already committed;
- exact changed files;
- exact shadow flag name;
- exact shadow helper name;
- exact test files added;
- exact rollback command;
- post-rollback validation commands.

## Required flag rollback

Rollback must remove:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

Rollback must also remove:

- shadow helper;
- shadow call inside `renderReport()`;
- test-only internal hook;
- WP17 shadow tests;
- WP17 owner-review artifacts if rolling back the whole work pack.

## Rollback command patterns

If WP17 has been committed:

```bash
git revert <wp17_commit_hash>
npm test
```

If WP17 is uncommitted:

```bash
git restore app.js <approved_wp17_test_files>
npm test
```

The exact `<approved_wp17_test_files>` list must be written in the WP17 owner pack before commit.

## Rollback triggers

Rollback is required if any of these occur:

- visible report HTML changes when the shadow flag is disabled;
- paywall HTML changes when the shadow flag is disabled;
- professional-first route changes when the shadow flag is disabled;
- urgent safety route changes when the shadow flag is disabled;
- localStorage key or state shape changes;
- adapter payload is visible in returned HTML;
- internal keys become user-facing;
- payment, QPay, pricing, backend, entitlement, or coach behavior changes;
- safety guidance becomes payment-gated;
- tests fail;
- PDF is generated;
- deploy is attempted.

## Post-rollback validation

Required post-rollback commands:

```bash
git status --short
git diff --check
node --check app.js
npm test
git diff -- index.html styles.css mockBackend.js package.json _redirects tests/run-all.js
git diff -- tests/driver-stack/runtimeAdapterPrototype.mjs tests/driver-stack/runtimeAdapterPrototype.test.js tests/driver-stack/exportRuntimeAdapterPrototype.mjs
```

## Scope preservation

Rollback must not touch:

- `audits/sprint-36-paid-depth-prototype/`;
- payment/QPay/backend/pricing/entitlement files;
- PDF scripts;
- deploy configuration;
- WP3 scoring/fixtures;
- WP4 report object contract;
- WP9 metadata contract;
- WP10/WP12 renderer contract;
- WP14 adapter files unless a future owner-approved WP17 scope modified them.

Runtime implementation is NOT approved by WP16.
~~~

---

# Embedded Artifact 8: `wp16-risk-register.md`

~~~markdown
# WP16 Risk Register

## Purpose

This document records risks for a future WP17 shadow runtime adapter integration.

WP16 is docs-only.

Runtime implementation is NOT approved by WP16.

## Risk table

| Risk | Severity | Trigger | Mitigation | WP17 gate |
| --- | --- | --- | --- | --- |
| app.js visible behavior change | HIGH | Returned report HTML, route output, paywall copy, button behavior, or safety/professional output changes with flag false. | Snapshot existing report outputs and compare with `ENABLE_RUNTIME_ADAPTER_SHADOW = false`. | Block WP17 commit until unchanged-output tests pass. |
| feature flag accidentally enabled | BLOCKER | Flag defaults true, can be enabled by URL/localStorage/payment/deploy/backend state, or lacks owner-approved test-only control. | Use exact `ENABLE_RUNTIME_ADAPTER_SHADOW = false`; forbid URL, storage, payment, deploy, and backend enablement. | Block WP17 commit until flag contract is exact. |
| adapter output rendered to users | BLOCKER | Adapter payload, preview sections, paid sections, safety sections, diagnostics, or owner debug appear in DOM or returned HTML. | Keep adapter output internal-only and scan returned HTML for adapter field names/content. | Block WP17 commit until no-render tests pass. |
| payment/entitlement mutation | BLOCKER | QPay constants, prices, product codes, access helpers, mockBackend payment state, or entitlement behavior changes. | Do not touch payment/QPay/backend/pricing/entitlement files or helper behavior. | Block WP17 commit until forbidden diffs and access tests pass. |
| localStorage regression | HIGH | Shadow path reads/writes storage, calls `saveState()`, adds keys, or persists adapter diagnostics. | Forbid localStorage access unless separately approved; test state and storage shape. | Block WP17 commit until storage no-mutation tests pass. |
| existing report flow broken | HIGH | One-time, removed-feature, readiness, professional, urgent, stage, or diary flow changes. | Add branch coverage for existing report flow with flag false. | Block WP17 commit until full report-flow regression passes. |
| adapter failure breaks user flow | HIGH | Adapter error throws into runtime report rendering or blocks user navigation/report output. | Contain adapter failures to test-only enabled path; disabled path must not invoke risky code. | Block WP17 commit until failure-containment tests pass. |
| internal keys visible | BLOCKER | Fixture names, mechanism keys, `ownerDebug`, `internalDiagnostics`, test-only status, or runtime gate metadata appear to users. | Scan returned HTML and user-facing fields for internal keys. | Block WP17 commit until leakage scans pass. |
| safety guidance hidden | BLOCKER | Safety/professional guidance becomes payment-gated or ordinary experiments appear on professional-first route. | Preserve `paymentGate.safetyGuidanceRequiresPayment === false` and safety/professional branch priority. | Block WP17 commit until safety/payment tests pass. |
| deploy before approval | BLOCKER | Preview or production deploy is attempted before explicit owner approval. | Keep WP17 local/test-only; record no deploy in owner pack. | Block WP17 completion if any deploy occurs. |
| rollback not clean | HIGH | WP17 cannot be reverted without touching unrelated payment/backend/PDF/deploy/scoring files. | Record exact changed files and rollback command before commit. | Block WP17 commit until rollback plan is complete. |
| scope creep into production rendering | BLOCKER | WP17 renders adapter sections, changes production report surface, or expands into visible UI. | Keep WP17 shadow-only and disabled by default. | Block WP17 commit until scope diff and no-render evidence pass. |
| module-format widening | MEDIUM | ESM/CommonJS/browser-script mismatch causes app build restructure or broad import changes. | Keep invocation test-only if direct import widens scope; avoid build refactor. | Block WP17 commit if implementation requires unapproved build changes. |
| unrelated untracked folder touched | MEDIUM | `audits/sprint-36-paid-depth-prototype/` is modified, staged, deleted, or committed. | Leave unrelated folder untouched and verify `git status --short`. | Block WP17 completion if folder is touched. |
| WP14 adapter modified by accident | MEDIUM | WP14 adapter module/test/exporter diff appears without approval. | Add explicit diff check for WP14 adapter files. | Block WP17 commit until WP14 adapter diffs are empty. |

## Open risks after WP16

WP16 does not prove:

- runtime code can safely import the ESM adapter;
- browser runtime can execute the adapter without build changes;
- a visible report surface is ready;
- payment-gated report rendering is ready;
- mobile UI is ready for new adapter-rendered content;
- deploy rollback is rehearsed.

Those risks must remain HOLD until later owner-approved work packs.

## Required decision

WP17 may proceed only if the owner accepts the risks and exact patch scope in WP16.

Runtime implementation is NOT approved by WP16.
~~~

---

# Embedded Artifact 9: `work-pack-16-recommendation.md`

~~~markdown
# WP16 Recommendation

## Recommendation

```text
READY FOR OWNER REVIEW OF SHADOW RUNTIME INTEGRATION PLAN
```

## What WP16 completed

WP16 defines:

- the exact future `app.js` shadow touchpoint;
- the required disabled feature flag;
- the shadow-only adapter invocation contract;
- the exact future WP17 patch scope;
- the required test plan;
- the required rollback plan;
- the risk register;
- owner-review requirements before any runtime code.

## Recommended owner decision

Owner may accept WP16 as a plan for WP17.

Acceptance of WP16 would allow only this future scope:

```text
WP17 - Disabled Shadow Runtime Adapter Integration
```

Acceptance of WP16 would not approve production rendering.

## Required WP17 condition

WP17 may only implement shadow integration if the owner accepts WP16.

## What remains blocked

- runtime implementation until WP16 is owner-accepted;
- production rendering;
- visible UI change;
- payment change;
- QPay/backend change;
- pricing/entitlement change;
- PDF generation;
- deploy;
- scoring changes;
- report copy changes;
- WP3/WP4/WP9/WP10/WP12 contract changes.

## Exact conclusion

Runtime implementation is NOT approved by WP16.
~~~

---

## Final owner-pack conclusion

```text
READY FOR OWNER REVIEW OF SHADOW RUNTIME INTEGRATION PLAN
```

Runtime implementation is NOT approved by WP16.

WP17 may only implement shadow integration if the owner accepts WP16.
