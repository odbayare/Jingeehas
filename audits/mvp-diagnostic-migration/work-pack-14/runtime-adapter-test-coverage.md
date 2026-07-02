# WP14 Runtime Adapter Test Coverage

## Required checks

| Command | Required result |
| --- | --- |
| `git diff --check` | PASS |
| `node --check app.js` | PASS |
| `node --check tests/driver-stack/runtimeAdapterPrototype.mjs` | PASS |
| `node --check tests/driver-stack/exportRuntimeAdapterPrototype.mjs` | PASS |
| `node tests/driver-stack/runtimeAdapterPrototype.test.js` | PASS |
| `node tests/driver-stack/exportRuntimeAdapterPrototype.mjs > /tmp/wp14_runtime_adapter_check.json` | PASS |
| exact contract `node -e` check | PASS |
| `npm test` | PASS |
| forbidden runtime/product diffs | Empty |
| WP9/WP12 source-contract diffs | Empty |

## Test assertions

- Required exports exist.
- Payload top-level key order is exact.
- Required scalar fields match the owner check.
- Required surface fields exist and are arrays where required.
- User-facing text does not leak internal keys.
- Runtime safety gate remains false.
- Safety guidance does not require payment.
- Source WP12 renderings are not mutated.

Runtime implementation is NOT approved by WP14.
