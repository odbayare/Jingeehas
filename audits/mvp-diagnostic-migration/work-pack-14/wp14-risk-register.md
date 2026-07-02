# WP14 Risk Register

## Purpose

This risk register captures remaining risks before any future runtime implementation.

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Runtime code consumes prototype directly | High | Keep runtime safety gate false and require a later approved implementation pack. |
| Surface key drift | High | Exact key order is locked in `runtimeAdapterPrototype.test.js` and owner artifacts. |
| Safety guidance treated as paid content | High | `paymentGate.safetyGuidanceRequiresPayment` is locked to `false`. |
| Internal key leak | High | User-facing text collection excludes diagnostics/debug and is scanned. |
| Source contract mutation | High | Test asserts WP12 renderings are not mutated. |
| Production behavior regression | High | Runtime/product diffs must stay empty. |

Runtime implementation is NOT approved by WP14.
