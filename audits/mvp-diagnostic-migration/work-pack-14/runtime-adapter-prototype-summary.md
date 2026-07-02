# WP14 Runtime Adapter Prototype Summary

## Summary

WP14 provides a test-only runtime adapter contract prototype. The adapter consumes WP12 copy rendering output and returns a sanitized payload with exact contract names.

## Generated artifact summary

| Field | Value |
| --- | --- |
| Export version | `runtime-adapter-prototype-export-v0-test-only` |
| Recommendation | `READY FOR OWNER REVIEW OF TEST-ONLY RUNTIME ADAPTER CONTRACT` |
| Payload version | `runtime-adapter-payload-v0-test-only` |
| Adapter mode | `test_only` |
| Source | `wp12-copy-rendering` |
| Report surface | `prototype_only` |
| Runtime can render | `false` |
| Safety guidance requires payment | `false` |
| Payload pass | `true` |

## Fixture scope

WP14 adapts exactly the two WP12 copy-decision renderings already produced by the test-only renderer. It does not expand fixture eligibility.

Runtime implementation is NOT approved by WP14.
