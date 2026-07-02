# Runtime Integration Decision Gate

## Purpose

This document defines the decision gate that must be passed before WP13 planning can become any future runtime implementation.

## Current decision

```text
RUNTIME INTEGRATION HOLD
```

Runtime implementation is NOT approved by WP13.

## Gate requirements

Before runtime implementation can be approved, a future work pack must prove:

1. A test-only runtime adapter contract exists.
2. The adapter maps the pipeline in this order:
   ```text
   WP3 driver stack
   → WP4 report object
   → WP9 copy decision metadata
   → WP12 polished copy renderer
   → future runtime adapter
   → future report surface
   ```
3. The adapter output separates:
   - free preview
   - paid report
   - safety/professional guidance
   - internal-only diagnostics
4. Safety/professional guidance renders without payment.
5. Professional-first routes suppress ordinary experiments.
6. No internal keys appear in user-facing fields.
7. Runtime/product files remain unchanged until owner approves a scoped implementation pack.
8. Full tests pass.
9. Owner review pack includes exact validation evidence.
10. Rollback, QA, and deploy-readiness plans are complete.

## Go/no-go table

| Gate | WP13 result | Implementation result |
| --- | --- | --- |
| Required docs exist | GO for owner review | Not an implementation approval |
| Exact pipeline is documented | GO for owner review | Adapter still not built |
| Surface and gating plan exists | GO for owner review | Gating still not implemented |
| Safety/payment boundary exists | GO for owner review | Tests and runtime behavior still required |
| Pre-`app.js` file scope exists | GO for owner review | `app.js` remains forbidden |
| Regression test plan exists | GO for owner review | Future adapter tests still required |
| QA and rollback plan exists | GO for owner review | Release still HOLD |
| Owner approval of runtime implementation | Not granted by WP13 | Required in future work pack |

## Explicit non-approval

Passing WP13 owner review means the plan is ready for review. It does not mean implementation may begin.

## Next decision point

Recommended next decision point:

```text
WP14 — Test-Only Runtime Adapter Contract
```

WP14 should remain test-only unless the owner explicitly expands scope.

Runtime implementation is NOT approved by WP13.
