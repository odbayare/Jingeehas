# WP37 Launch Boundary Record

| Boundary | Result | Evidence |
| --- | --- | --- |
| prototype guard | PASS | `tests/final-public-launch-smoke.test.js` asserts `ENABLE_VISIBLE_SURFACE_PROTOTYPE = false`. |
| runtime visible integration guard | PASS | `tests/final-public-launch-smoke.test.js` asserts `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true`. |
| unpaid free preview | PASS | Smoke test asserts the unpaid report includes the free preview and visible surface. |
| unpaid paid depth gating | PASS | Smoke test asserts paid-only depth and cycle copy are absent from unpaid output. |
| paid depth access | PASS | Smoke test asserts paid report depth and experiment copy render only with paid access. |
| payment failed path | PASS | Smoke test asserts retry/help wording is visible and safety remains visible. |
| professional route | PASS | Smoke test asserts safety-only output and no ordinary paid depth or CTA. |
| urgent route | PASS | Smoke test asserts immediate safety output and no ordinary paid depth or CTA. |
| internal leak | PASS | Smoke test denies `internalDiagnostics`, `ownerDebug`, `fixtureName`, `runtimeGate`, `decisionStatus`, and `rendererMode`. |
| bad trust copy | PASS | Smoke test denies `хатуу дэглэм`, shame/failure terms, medical overclaim terms, and fake urgency/scarcity terms. |
| payment boundary | PASS | Smoke test asserts price labels/constants, product code, QPay endpoints, and entitlement helper source remain unchanged. |
| localStorage mutation | PASS | Smoke test wraps render paths with a mutation spy and denies `setItem` / `removeItem`. |
| protected folder | PASS | `audits/sprint-36-paid-depth-prototype/` remains untracked and untouched. |
