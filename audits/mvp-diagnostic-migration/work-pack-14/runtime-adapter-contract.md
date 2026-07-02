# WP14 Test-Only Runtime Adapter Contract

## Purpose

WP14 creates a test-only runtime adapter contract prototype. It proves how existing WP12 copy rendering output can be transformed into a sanitized prototype payload.

Runtime implementation is NOT approved by WP14.

## Exact export artifact

- `audits/mvp-diagnostic-migration/work-pack-14/runtime-adapter-prototype-results.json`

## Exact adapter payload top-level key order

```js
[
  "version",
  "adapterMode",
  "source",
  "generatedFrom",
  "reportSurface",
  "previewSections",
  "paidSections",
  "safetyGuidanceSections",
  "internalDiagnostics",
  "ownerDebug",
  "runtimeSafetyGate",
  "paymentGate",
  "qualityChecks",
  "pass"
]
```

## Exact scalar contract

| Field | Required value | Current value |
| --- | --- | --- |
| `version` | `runtime-adapter-payload-v0-test-only` | `runtime-adapter-payload-v0-test-only` |
| `adapterMode` | `test_only` | `test_only` |
| `source` | `wp12-copy-rendering` | `wp12-copy-rendering` |
| `reportSurface` | `prototype_only` | `prototype_only` |
| `runtimeSafetyGate.canRenderInRuntime` | `false` | `false` |
| `paymentGate.safetyGuidanceRequiresPayment` | `false` | `false` |
| `pass` | `true` | `true` |

## Required exports

- `buildRuntimeAdapterPayload(renderings, options = {})`
- `buildRuntimeAdapterPayloadFromFixtures(fixtures, options = {})`
- `collectAdapterUserFacingText(payload)`
- `hasAdapterInternalKeyLeak(payload)`
- `validateRuntimeAdapterPayload(payload)`

## Non-goals

WP14 does not modify runtime, app.js, production rendering, deploy, PDF, payment, QPay, backend, pricing, entitlement, WP3 scoring, WP3 fixtures, WP4 report object contract, WP9 metadata contract, or WP10/WP12 renderer contract.
