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

```js
["node", ["tests/runtime-adapter-shadow-integration.test.js"]]
```
