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
