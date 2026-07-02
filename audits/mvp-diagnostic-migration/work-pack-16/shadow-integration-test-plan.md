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
| no report mutation when flag false | Snapshot/regression | One-time, seven-day, readiness, professional, and urgent report branches return the same HTML as before. | Yes |
| no payment mutation | Unit/regression | `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, `hasUpgradeAccess()`, QPay constants, prices, and product codes are unchanged. | Yes |
| no localStorage mutation unless explicitly approved | Unit/regression | Shadow helper does not read localStorage, write localStorage, call `saveState()`, add storage keys, or persist adapter diagnostics. | Yes |
| adapter invocation isolated | Unit/integration | Enabled test-only shadow path returns internal validation only and does not feed payload into returned HTML or runtime state. | Yes |
| adapter failure contained | Unit/integration | Adapter failure in enabled test-only mode fails tests only; disabled shadow mode cannot break user report rendering. | Yes |
| internal keys not rendered | HTML scan | Returned HTML does not include raw fixture names, mechanism keys, `ownerDebug`, `internalDiagnostics`, or adapter field names. | Yes |
| safety guidance not payment-gated | Unit/regression | `paymentGate.safetyGuidanceRequiresPayment === false` remains true and safety/professional guidance stays outside payment gates. | Yes |
| existing report flow unchanged | End-to-end regression | Stage, diary, one-time report, seven-day report, paywall, professional, urgent, and readiness flows remain unchanged. | Yes |
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
