# Work Pack 13 Runtime Integration Readiness Plan

## WP13 purpose

WP13 is a docs-only readiness plan for a future runtime integration of the test-only diagnostic/copy pipeline.

It answers seven owner planning questions in one work pack:

1. How the test-only pipeline should connect in future runtime.
2. Which sections should become user-facing report copy.
3. Which content belongs in free preview, paid report, safety/professional guidance, and internal-only diagnostics.
4. Which safety/professional/medical-context copy must never be blocked by payment.
5. What exact future runtime file scope is allowed before touching `app.js`.
6. What tests must pass before runtime implementation or deploy.
7. What rollback, QA, and deploy-readiness plan is required before production release.

## Current pipeline summary

The current committed pipeline is test-only:

```text
WP3 driver stack
→ WP4 report object
→ WP9 copy decision metadata
→ WP12 polished copy renderer
→ future runtime adapter
→ future report surface
```

WP3 computes the driver stack from fixture state and produces primary drivers, secondary drivers, interactions, vulnerable moments, hidden food functions, first gentle changes, 14-day experiment hypotheses, and 7-day confirmation targets.

WP4 compacts that stack into a stable report object. The report object is still test-only and explicitly records that runtime integration is disabled.

WP9 adds copy decision metadata for the two sensitive fixtures:

- `all_or_nothing_restriction_rebound`
- `pcos_body_uncertainty_control`

WP10 proved a test-only renderer shape. WP12 polished the two sensitive Mongolian renderings and preserved the renderer contract. Runtime rendering remains disabled.

## Seven-question answer matrix

| Planning question | WP13 answer | Primary artifact |
| --- | --- | --- |
| How should the test-only pipeline connect in future runtime? | By adding a future adapter after the WP12 polished copy renderer and before any future report surface. The adapter must sanitize output and must not import test-only internals directly into production rendering. | `test-only-to-runtime-pipeline-map.md` |
| Which sections should become user-facing report copy? | Human-readable WP12 section titles and polished bodies may become user-facing after adapter approval, with safety/professional sections treated separately from ordinary paid depth. | `report-surface-and-gating-plan.md` |
| Which content belongs in free preview, paid report, safety/professional guidance, and internal-only diagnostics? | Preview gets limited non-shaming summary; paid report gets ordinary depth; safety/professional guidance stays outside payment; raw keys and diagnostic metadata remain internal. | `report-surface-and-gating-plan.md` |
| Which safety/professional/medical-context copy must never be blocked by payment? | Professional-first guidance, medical-context bridges, non-diagnostic disclaimers, severe-distress guidance, and ordinary-experiment suppression notices must render without payment. | `safety-payment-boundary-plan.md` |
| What exact future runtime file scope is allowed before touching `app.js`? | Only a future test-only adapter prototype, tests, exporter, and owner-review artifacts may be proposed before `app.js`; WP13 creates docs only. | `future-runtime-file-scope.md` |
| What tests must pass before any runtime implementation or deploy? | Current driver-stack/copy regressions, full `npm test`, forbidden-file diffs, future adapter tests, safety/payment tests, internal-key scans, and manual QA must pass. | `runtime-regression-test-plan.md` |
| What rollback, QA, and deploy-readiness plan is required before production release? | Release requires staged adapter/shadow/gated-rendering approval, preview proof, explicit production approval, rollback command, smoke checklist, and post-deploy checks. | `runtime-qa-and-rollback-plan.md` |

## Exact non-goals

WP13 is not runtime implementation.

WP13 is not `app.js` work.

WP13 is not production report rendering.

WP13 is not PDF generation.

WP13 is not deploy.

WP13 is not payment, QPay, backend, pricing, entitlement, or localStorage work.

WP13 is not a scoring change.

WP13 is not a fixture behavior change.

WP13 is not a WP4 report object contract change.

WP13 is not a WP9 metadata contract change.

WP13 is not a WP10/WP12 renderer contract change.

## What is ready

- The WP3 test-only driver stack has contract tests, fixture tests, and safety invariant tests.
- The WP4 report object has a stable test-only report shape.
- The WP9 metadata layer identifies exactly two copy-decision fixtures.
- The WP12 polished renderer produces two owner-review-ready test-only renderings.
- The sensitive copy now avoids key risk phrases identified in WP11.
- The pipeline can be reviewed from artifacts without touching runtime code.

## What is not ready

- There is no runtime adapter.
- There is no runtime data-source bridge from live assessment state to the WP3/WP4/WP9/WP12 test-only pipeline.
- There is no production-safe user-facing renderer.
- There is no preview/paid/safety content gate implemented.
- There is no runtime no-internal-key integration test.
- There is no live QA pass across mobile, paid access, safety routes, and report rendering.
- There is no deploy or rollback rehearsal for this pipeline.

## What must remain HOLD

- Runtime integration remains HOLD.
- Production report rendering remains HOLD.
- PDF generation remains HOLD.
- Deploy remains HOLD.
- QPay/backend/payment/pricing/entitlement remains HOLD.
- WP3 scoring and fixtures remain HOLD.
- WP4 report object contract remains HOLD.
- WP9 metadata contract remains HOLD.
- WP10/WP12 renderer object contract remains HOLD.
- `app.js` changes remain HOLD until a future work pack explicitly approves a runtime adapter scope.

## Future runtime phases

### Phase 0: Runtime adapter design only

Create a docs-and-tests work pack that defines a future adapter boundary without editing `app.js`.

Allowed focus:

- adapter input contract
- adapter output contract
- no-internal-key rules
- payment/safety boundary tests
- owner review artifacts

### Phase 1: Test-only adapter prototype

Create a new isolated module under a future approved path, such as `tests/driver-stack/runtimeAdapterPrototype.mjs`, that maps a simulated runtime report object into a user-facing report payload.

This phase must still avoid production rendering and must not touch `app.js`.

### Phase 2: Runtime shadow path

Only after Phase 1 passes owner review, add a shadow-only runtime path that can be exercised in tests without changing visible user behavior.

This phase may propose `app.js` scope, but it must not ship user-facing copy yet.

### Phase 3: Preview/paid/safety gated rendering

Only after shadow QA, implement user-facing rendering behind explicit gates:

- safety/professional guidance visible without payment
- free preview limited to non-sensitive summary and next-step teaser
- paid report contains full ordinary report copy
- internal diagnostics never user-facing

### Phase 4: Production release candidate

Only after full QA, rollback plan, and owner approval should a deploy be considered.

## Why WP13 does not approve implementation

WP13 is a readiness plan, not an implementation approval. It does not prove runtime state mapping, payment-gate behavior, safety-gate behavior, mobile rendering, production report copy, or rollback mechanics.

The current test-only renderer is designed to keep `runtimeGate.canRenderInRuntime === false`. Treating WP13 as implementation approval would bypass the exact safety gates created by WP8, WP9, WP10, and WP12.

## Clear recommendation for next work pack

Recommended next work pack: `WP14 — Test-Only Runtime Adapter Contract`.

WP14 should create a test-only adapter contract and tests without touching `app.js`. It should prove how a future runtime report payload would be assembled, what content is preview/paid/safety/internal, and how internal keys are excluded.

## Required conclusion

Runtime implementation is NOT approved by WP13.
