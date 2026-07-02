# Work Pack 13 Owner Review Pack

## Recommendation Enum

```text
READY FOR OWNER REVIEW OF RUNTIME INTEGRATION READINESS PLAN
```

## Required Conclusion

Runtime implementation is NOT approved by WP13.

## Scope

WP13 is docs-only runtime integration readiness planning for the existing test-only diagnostic/copy pipeline.

WP13 does not modify runtime behavior, production rendering, PDF generation, deploy, payment, QPay, backend, pricing, entitlement, scoring, fixtures, WP4 report object contract, WP9 metadata contract, or WP10/WP12 renderer contract.

## Primary WP13 Artifacts

- `audits/mvp-diagnostic-migration/work-pack-13/runtime-integration-readiness-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/test-only-to-runtime-pipeline-map.md`
- `audits/mvp-diagnostic-migration/work-pack-13/report-surface-and-gating-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/safety-payment-boundary-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/future-runtime-file-scope.md`
- `audits/mvp-diagnostic-migration/work-pack-13/runtime-regression-test-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/runtime-qa-and-rollback-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/wp13-risk-register.md`
- `audits/mvp-diagnostic-migration/work-pack-13/runtime-integration-decision-gate.md`
- `audits/mvp-diagnostic-migration/work-pack-13/work-pack-13-recommendation.md`
- `audits/mvp-diagnostic-migration/work-pack-13/OWNER_REVIEW_PACK_WP13.md`

## Seven-Question Coverage

| Question | Answering artifact | Completion status |
| --- | --- | --- |
| 1. How should the test-only pipeline connect in future runtime? | `test-only-to-runtime-pipeline-map.md` | Complete |
| 2. Which sections should become user-facing report copy? | `report-surface-and-gating-plan.md` | Complete |
| 3. Which content belongs in free preview, paid report, safety/professional guidance, and internal-only diagnostics? | `report-surface-and-gating-plan.md` | Complete |
| 4. Which safety/professional/medical-context copy must never be blocked by payment? | `safety-payment-boundary-plan.md` | Complete |
| 5. What exact future runtime file scope is allowed before touching `app.js`? | `future-runtime-file-scope.md` | Complete |
| 6. What tests must pass before any runtime implementation or deploy? | `runtime-regression-test-plan.md` | Complete |
| 7. What rollback, QA, and deploy-readiness plan is required before production release? | `runtime-qa-and-rollback-plan.md` | Complete |

## Exact Required Pipeline

```text
WP3 driver stack
→ WP4 report object
→ WP9 copy decision metadata
→ WP12 polished copy renderer
→ future runtime adapter
→ future report surface
```

## Repository Boundaries

Forbidden runtime/product files remain unchanged by WP13:

- `app.js`
- `index.html`
- `styles.css`
- `mockBackend.js`
- `package.json`
- `_redirects`
- `tests/run-all.js`

The unrelated folder `audits/sprint-36-paid-depth-prototype/` remains untracked, untouched, unstaged, and uncommitted.

## Validation Evidence

| Command | Result | Evidence |
| --- | --- | --- |
| `git status --short` | PASS | Output lists WP13 docs as untracked and preserves the unrelated untracked folder: `?? audits/mvp-diagnostic-migration/work-pack-13/`; `?? audits/sprint-36-paid-depth-prototype/` |
| `git diff --check` | PASS | No output. |
| `node --check app.js` | PASS | No output. |
| `node --check tests/driver-stack/driverStackReportObject.mjs` | PASS | No output. |
| `node --check tests/driver-stack/copyDecisionMetadata.mjs` | PASS | No output. |
| `node --check tests/driver-stack/copyDecisionRenderer.mjs` | PASS | No output. |
| `node --check tests/driver-stack/exportCopyDecisionRenderings.mjs` | PASS | No output. |
| `node tests/driver-stack/driverStackContract.test.js` | PASS | `driverStackContract tests passed` |
| `node tests/driver-stack/driverStackFixtures.test.js` | PASS | `driverStackFixtures tests passed` |
| `node tests/driver-stack/driverStackSafetyInvariants.test.js` | PASS | `driverStackSafetyInvariants tests passed` |
| `node tests/driver-stack/driverStackReportObject.test.js` | PASS | `driverStackReportObject tests passed` |
| `node tests/driver-stack/copyDecisionMetadata.test.js` | PASS | `copyDecisionMetadata tests passed` |
| `node tests/driver-stack/copyDecisionRenderer.test.js` | PASS | `copyDecisionRenderer tests passed` |
| `node tests/driver-stack/exportCopyDecisionRenderings.mjs > /tmp/wp13_copy_rendering_check.json` | PASS | No output; JSON written to `/tmp/wp13_copy_rendering_check.json`. |
| `npm test` | PASS | `All tests passed` |
| `git diff -- app.js index.html styles.css mockBackend.js package.json _redirects` | PASS | No output; forbidden runtime/product files unchanged. |
| `git diff -- tests/run-all.js` | PASS | No output; `tests/run-all.js` unchanged. |

## Self-Audit Checklist

| Check | Result |
| --- | --- |
| Exact required WP13 filenames exist | PASS |
| Old semantic-name WP13 artifacts are not present | PASS |
| All seven planning questions are explicitly answered | PASS |
| Exact required pipeline with `→` arrows is present | PASS |
| Surface and gating plan includes free preview, paid report, safety/professional guidance, and internal-only diagnostics | PASS |
| Safety/professional/medical-context copy is never blocked by payment | PASS |
| Future pre-`app.js` scope is explicit | PASS |
| Runtime regression commands and required results are listed | PASS |
| QA, rollback, and deploy-readiness plan is complete | PASS |
| Runtime implementation non-approval sentence is present | PASS |
| Forbidden runtime/product file diffs are empty | PASS |
| `audits/sprint-36-paid-depth-prototype/` remains unrelated and untracked | PASS |

## Full Content: `runtime-integration-readiness-plan.md`

~~~markdown
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
~~~

## Full Content: `test-only-to-runtime-pipeline-map.md`

~~~markdown
# Test-Only To Runtime Pipeline Map

## Required future pipeline

```text
WP3 driver stack
→ WP4 report object
→ WP9 copy decision metadata
→ WP12 polished copy renderer
→ future runtime adapter
→ future report surface
```

## Stage-by-stage map

| Stage | Current status | Input | Output | Runtime readiness |
| --- | --- | --- | --- | --- |
| WP3 driver stack | Test-only | Fixture state and evidence | Driver stack with primary/secondary drivers, safety route, hidden food function, first change, experiment, diary targets | Not runtime-ready; must not be wired directly into production |
| WP4 report object | Test-only | WP3 driver stack | Compact report object | Structurally useful, but still marked test-only |
| WP9 copy decision metadata | Test-only | WP4 report object | Metadata for exactly two sensitive fixtures | Runtime gate false; not approved for runtime |
| WP12 polished copy renderer | Test-only | WP9 metadata | Five-section user-facing draft copy for two fixtures | Owner-review-ready draft only; runtime gate false |
| Future runtime adapter | Not built | Runtime assessment state plus approved report object/copy payload | Sanitized user-facing report payload | Requires WP14 or later |
| Future report surface | Not built | Sanitized adapter output | Preview, paid report, and safety guidance surfaces | Requires runtime QA and owner approval |

## Contract handoff map

| Handoff | Allowed payload | Required guardrail | Not allowed |
| --- | --- | --- | --- |
| WP3 driver stack → WP4 report object | Stable test-only driver stack data | WP4 must compact without changing WP3 scoring or fixtures. | Direct runtime rendering from WP3 driver keys |
| WP4 report object → WP9 copy decision metadata | Report object fields needed for copy-decision eligibility | WP9 must keep non-decision and professional-first cases omitted or null. | Expanding sensitive rendering to new fixtures without owner approval |
| WP9 copy decision metadata → WP12 polished copy renderer | Metadata for exactly the two approved sensitive fixtures | WP12 must preserve renderer shape and `runtimeGate.canRenderInRuntime === false`. | Runtime approval flags, new top-level keys, or production rendering |
| WP12 polished copy renderer → future runtime adapter | Human-readable section titles and bodies plus QA-only status | Adapter must strip internal keys before any user-facing surface. | Exposing `fixtureName`, `decisionStatus`, `rendererMode`, `runtimeGate`, raw scores, or owner-review flags |
| Future runtime adapter → future report surface | Preview, paid, safety, and internal buckets | Surface must render safety/professional guidance outside payment gates. | Payment hiding professional or medical-context guidance |

## Connection rule

The future adapter must not call a renderer directly from raw user answers. It must receive an approved intermediate payload that has already passed:

- driver-stack contract checks
- report-object contract checks
- copy metadata checks
- copy rendering checks
- no internal key checks
- safety/payment gate checks

## Data that may cross toward runtime

Future runtime may receive only sanitized, user-facing content:

- section titles
- section bodies
- human-readable report grouping
- preview/paid/safety placement metadata
- non-sensitive pass/fail gate summaries for QA

## Data that must not cross to users

Future runtime must not render:

- fixture names
- raw driver keys
- raw metadata keys
- raw safety modes
- raw scores
- owner review flags
- `runtimeGate`
- `decisionStatus`
- `rendererMode`
- internal test-only versions
- debug notes

## Required future adapter contract

A future adapter should produce:

```text
{
  version,
  source,
  reportSurface,
  previewSections,
  paidSections,
  safetyGuidanceSections,
  internalDiagnostics,
  runtimeSafetyGate,
  paymentGate,
  qaFlags
}
```

This is a future planning sketch only. WP13 does not approve adding this object to runtime.

## Required future adapter checks

Before any runtime implementation, a future adapter must prove:

| Check | Required result |
| --- | --- |
| Fixture scope | Exactly the owner-approved sensitive copy cases are mapped; non-decision fixtures stay omitted or null. |
| Internal-key scrub | No user-facing field contains fixture names, driver keys, metadata keys, `runtimeGate`, `decisionStatus`, or `rendererMode`. |
| Surface routing | Every user-facing section is assigned to free preview, paid report, safety/professional guidance, or internal-only diagnostics. |
| Payment boundary | Safety/professional guidance renders without payment. |
| Contract preservation | WP3, WP4, WP9, and WP10/WP12 contracts are consumed, not mutated. |
| Runtime decision | Runtime rendering remains HOLD until owner approves a later implementation work pack. |

## Answer to planning question 1

The pipeline should connect by adding an adapter after the WP12 polished renderer, not by importing test-only renderer output directly into `app.js`. The adapter must sanitize internal keys, assign each section to preview/paid/safety/internal surfaces, and preserve safety guidance outside payment gates.

Runtime implementation is NOT approved by WP13.
~~~

## Full Content: `report-surface-and-gating-plan.md`

~~~markdown
# Report Surface And Gating Plan

## Purpose

This document answers which sections should become user-facing report copy and which content belongs in free preview, paid report, safety/professional guidance, and internal-only diagnostics.

## User-facing report sections

The following WP12 sections are candidates for future user-facing report copy after a future runtime adapter and owner approval:

| Section title | Future surface | Rationale |
| --- | --- | --- |
| `Ил харагдаж байгаа зүйл` | Free preview or paid report summary | It names the visible pattern in non-shaming language. |
| `Цаана нь ажиллаж байгаа зүйл` | Paid report | It contains the deeper driver-stack explanation and should not be reduced to a teaser. |
| `Зөөлөн мэргэжлийн гүүр` | Safety/professional guidance | It must stay visible when relevant and must not be blocked by payment. |
| `Эхний зөөлөн өөрчлөлт` | Paid report, with safety exception | It is an ordinary next step; do not show if a professional-first route suppresses ordinary experiments. |
| `14 хоногийн туршилтын таамаг` | Paid report, with safety exception | It is an experiment hypothesis, not a command; suppress when professional-first rules apply. |
| `7 хоногийн баталгаажуулах тэмдэглэл` | Paid report | It supports pattern observation and should stay non-judgmental. |

## Surface and gate matrix

| Surface | Content allowed | Gate condition | Safety override | Content forbidden |
| --- | --- | --- | --- | --- |
| Free preview | Short visible-pattern summary, gentle recognition, non-diagnostic framing, safety/professional bridge when triggered | Available before payment | Safety/professional guidance must render even when ordinary depth is locked. | Full hidden-function explanation, raw keys, fixture names, full paid experiment |
| Paid report | Ordinary report depth, stacked-driver explanation, first gentle change, 14-day experiment hypothesis, 7-day diary confirmation | Requires approved entitlement in a future implementation | Paid status cannot suppress safety/professional guidance or professional-first routing. | Diagnostic claims, treatment advice, payment mechanics in sensitive copy |
| Safety/professional guidance | Professional-first language, medical-context bridges, non-diagnostic disclaimers, severe-distress guidance, ordinary-experiment suppression notice | Never paywalled when triggered | Always wins over preview/paid allocation. | Product upsell language, delayed medical-context clarification |
| Internal-only diagnostics | Fixture names, raw driver keys, raw metadata, raw scores, owner-review flags, QA-only gate status | QA and owner artifacts only | Not applicable; never user-facing. | Any user-facing rendering |

## Exact content allocation

| Content type | Free preview | Paid report | Safety/professional guidance | Internal-only diagnostics |
| --- | --- | --- | --- | --- |
| Human-readable section title | Allowed when assigned to preview or safety | Allowed | Allowed | Allowed in artifacts |
| Polished section body | Limited summary only | Allowed for ordinary depth | Allowed and never blocked by payment | Allowed for review |
| Hidden food function explanation | Summary only | Allowed | Only if safety framing requires it | Allowed |
| First gentle change | Teaser only | Allowed unless safety suppresses it | Suppressed when professional-first applies | Allowed |
| 14-day experiment hypothesis | Not allowed in full | Allowed unless safety suppresses it | Suppressed when professional-first applies | Allowed |
| 7-day diary confirmation | Not allowed in full | Allowed | Allowed only when phrased as observation, not diagnosis | Allowed |
| Medical-context bridge | Allowed when triggered | Allowed, but not paid-only | Required when triggered | Allowed |
| Non-diagnostic disclaimer | Allowed | Allowed | Required when triggered | Allowed |
| Runtime/test keys | Not allowed | Not allowed | Not allowed | Allowed |

## Free preview

Free preview may include:

- the visible pattern summary
- one gentle, non-diagnostic recognition paragraph
- a high-level note that the full report explains the stacked drivers
- safety/professional guidance when triggered

Free preview must not include:

- raw driver keys
- raw scores
- fixture names
- internal metadata
- full hidden-function explanation
- full 14-day experiment if payment gates are active

## Paid report

Paid report may include:

- the full visible pattern
- deeper stacked-driver explanation
- hidden food function explanation in user-facing language
- wrong self-explanation correction
- first gentle change
- 14-day experiment hypothesis
- 7-day diary confirmation targets

Paid report must not include:

- safety/professional guidance as a paid-only reveal
- diagnostic claims
- treatment advice
- raw keys or debug fields
- product/payment mechanics inside body copy

## Safety/professional guidance

Safety/professional guidance includes:

- professional-first routing language
- soft medical-context bridges
- non-diagnostic clarification
- guidance to clarify body changes, medication concerns, severe distress, or medical red flags with a professional
- suppression notice for ordinary experiments when required by safety rules

Safety/professional guidance must be available before payment when triggered.

## Internal-only diagnostics

Internal-only diagnostics include:

- raw driver keys
- fixture names
- safety mode codes
- internal metadata flags
- raw scores
- evidence weighting
- owner review flags
- debug reason codes
- `runtimeGate`, `decisionStatus`, `rendererMode`, and other test-only fields

Internal-only diagnostics may appear in QA logs and owner-review artifacts, but must never appear in future user-facing report copy.

## Answer to planning questions 2 and 3

The future user-facing report should use only human-readable section titles and polished section bodies. Preview should show the visible non-shaming summary and safety guidance when relevant. Paid should contain the full ordinary report. Safety/professional guidance must sit outside payment. Raw diagnostics and internal keys remain internal only.

Runtime implementation is NOT approved by WP13.
~~~

## Full Content: `safety-payment-boundary-plan.md`

~~~markdown
# Safety Payment Boundary Plan

## Purpose

This document answers which safety/professional/medical-context copy must never be blocked by payment.

## Never block by payment

The following copy types must never be behind a paywall:

- professional-first guidance
- medical-context clarification
- "this is not a diagnosis" language
- safety route explanations
- urgent or severe distress guidance
- medication/body-change concern guidance
- ordinary experiment suppression when safety requires it
- recommendation to clarify concerns with a professional

## Never-paywall matrix

| Copy category | Must render before payment | May also appear in paid report | Required future test |
| --- | --- | --- | --- |
| Professional-first guidance | Yes | Yes, if repeated for continuity | Unpaid state shows professional-first guidance and suppresses ordinary experiment. |
| Medical-context clarification | Yes | Yes | Unpaid state shows the clarification bridge before entitlement. |
| Non-diagnostic disclaimer | Yes | Yes | User-facing copy contains non-diagnostic language without paid unlock. |
| Severe distress or urgent concern guidance | Yes | Yes | Safety route bypasses paid gating. |
| Medication/body-change concern guidance | Yes | Yes | Medical-context bridge is visible without payment. |
| Ordinary-experiment suppression notice | Yes | Yes | Professional-first route does not show ordinary experiment as the primary action. |
| Recommendation to clarify with a professional | Yes | Yes | Payment lock cannot hide the professional bridge. |

## WP12-sensitive fixture rules

### Body uncertainty / professional bridge

When body uncertainty copy includes professional clarification, the future runtime must show that bridge without payment.

Required principle:

```text
If the copy says professional clarification may be needed, that sentence must be visible without payment.
```

The future paid report may add ordinary observation details, but it cannot hide the professional clarification bridge.

### All-or-nothing / restriction rebound

When restriction/rebound copy explains hunger and restart pressure, ordinary report details may be paid. But if the same route ever detects safety risks such as compensatory behavior, severe body distress, or professional-first conditions, the safety copy overrides payment.

## Payment boundary rule

Payment may gate ordinary depth, not safety.

Allowed behind payment:

- deeper stacked-driver explanation
- full hidden food function discussion
- 14-day ordinary experiment
- 7-day diary confirmation targets

Never behind payment:

- safety/professional guidance
- non-diagnostic disclaimer
- medical-context clarification
- professional-first instruction
- "ordinary experiment is suppressed" explanation

## Forbidden future copy

Future runtime must not say or imply:

- "pay to see whether this needs medical clarification"
- "paid report will tell you if this is diagnosis"
- "professional guidance is unlocked after payment"
- "safety route is part of premium depth"
- "medical context is hidden in paid report"

## QA requirement

Before runtime release, tests must prove:

- safety/professional copy renders with unpaid state
- paid lock does not hide medical-context bridge
- paid lock does not hide professional-first instruction
- ordinary paid sections can remain locked while safety guidance is visible
- no product/payment mechanics appear inside user-facing sensitive copy

## Answer to planning question 4

Professional-first guidance, medical-context bridges, non-diagnostic disclaimers, safety route explanations, and ordinary-experiment suppression must never be blocked by payment.

Runtime implementation is NOT approved by WP13.
~~~

## Full Content: `future-runtime-file-scope.md`

~~~markdown
# Future Runtime File Scope Before `app.js`

## Purpose

This document answers what exact future runtime file scope is allowed before touching `app.js`.

## WP13 scope

WP13 allows docs only under:

```text
audits/mvp-diagnostic-migration/work-pack-13/
```

WP13 does not approve any source or runtime file edits.

## Future allowed pre-`app.js` scope

A future work pack may propose changes only after owner approval. Before touching `app.js`, the safer next scope is:

```text
tests/driver-stack/runtimeAdapterPrototype.mjs
tests/driver-stack/runtimeAdapterPrototype.test.js
tests/driver-stack/exportRuntimeAdapterPrototype.mjs
audits/mvp-diagnostic-migration/work-pack-14/
```

Those names are recommendations, not WP13-created files.

## File-scope decision table

| File or area | WP13 status | Earliest possible future status | Requirement before change |
| --- | --- | --- | --- |
| `audits/mvp-diagnostic-migration/work-pack-13/` | Allowed | Complete in WP13 | Docs-only artifacts and owner pack. |
| `tests/driver-stack/runtimeAdapterPrototype.mjs` | Not created by WP13 | Proposed for WP14 | Owner approval of a test-only adapter pack. |
| `tests/driver-stack/runtimeAdapterPrototype.test.js` | Not created by WP13 | Proposed for WP14 | Adapter shape, surface routing, no-key-leak, and payment/safety tests. |
| `tests/driver-stack/exportRuntimeAdapterPrototype.mjs` | Not created by WP13 | Optional future exporter | Only if needed for owner-review artifacts. |
| `audits/mvp-diagnostic-migration/work-pack-14/` | Not created by WP13 | Proposed for WP14 | Owner review artifacts for adapter contract. |
| `app.js` | Forbidden | Later shadow-only implementation candidate | Adapter contract approved, tests green, owner explicitly approves `app.js` scope. |
| `index.html`, `styles.css`, `mockBackend.js`, `package.json`, `_redirects`, `tests/run-all.js` | Forbidden | Only in separately approved future implementation | Explicit owner approval and regression plan. |
| Backend/payment/QPay/pricing/entitlement, PDF scripts | Forbidden | HOLD | Separate owner-approved work pack only. |

## Required pre-`app.js` constraints

Before `app.js` is touched, the future adapter must prove:

- it accepts a stable test-only report/copy payload
- it produces a sanitized user-facing payload
- it separates preview, paid, safety, and internal-only content
- it never exposes internal keys in user-facing fields
- it keeps safety guidance outside payment gates
- it preserves professional-first suppression of ordinary experiments
- it does not mutate WP3 scoring
- it does not mutate WP4 report object contract
- it does not mutate WP9 metadata contract
- it does not mutate WP10/WP12 renderer contract

## Files that remain forbidden until explicit owner approval

- `app.js`
- `index.html`
- `styles.css`
- `mockBackend.js`
- `package.json`
- `_redirects`
- `tests/run-all.js`
- backend/payment/QPay/pricing/entitlement files
- PDF scripts

## First possible `app.js` touch point

The first future `app.js` touch point should be a shadow-only adapter call guarded by tests and feature flags. It must not change visible production report behavior in the same work pack.

## Answer to planning question 5

Before touching `app.js`, the allowed future runtime scope should be limited to a test-only runtime adapter prototype, tests, exporter, and owner-review artifacts. `app.js` remains forbidden until that contract is approved.

Runtime implementation is NOT approved by WP13.
~~~

## Full Content: `runtime-regression-test-plan.md`

~~~markdown
# Runtime Regression Test Plan

## Purpose

This document answers what tests must pass before any runtime implementation or deploy.

## Required validation before runtime implementation

Run and pass:

```bash
git status --short
git diff --check
node --check app.js
node --check tests/driver-stack/driverStackReportObject.mjs
node --check tests/driver-stack/copyDecisionMetadata.mjs
node --check tests/driver-stack/copyDecisionRenderer.mjs
node --check tests/driver-stack/exportCopyDecisionRenderings.mjs
node tests/driver-stack/driverStackContract.test.js
node tests/driver-stack/driverStackFixtures.test.js
node tests/driver-stack/driverStackSafetyInvariants.test.js
node tests/driver-stack/driverStackReportObject.test.js
node tests/driver-stack/copyDecisionMetadata.test.js
node tests/driver-stack/copyDecisionRenderer.test.js
node tests/driver-stack/exportCopyDecisionRenderings.mjs > /tmp/wp13_copy_rendering_check.json
npm test
git diff -- app.js index.html styles.css mockBackend.js package.json _redirects
git diff -- tests/run-all.js
```

## Required future adapter tests

A future runtime adapter work pack must add tests proving:

- exact adapter top-level object shape
- exact user-facing section shape
- no internal key leakage in preview, paid, or safety fields
- free preview does not expose paid ordinary depth
- paid report includes ordinary depth only after entitlement
- safety/professional guidance appears without payment
- professional-first route suppresses ordinary experiments
- non-decision fixtures do not receive sensitive copy-decision rendering
- copy-sensitive fixtures render only approved polished sections
- no product/payment mechanics leak into sensitive copy

## Command/result evidence required in future owner packs

| Command | Required result before runtime implementation |
| --- | --- |
| `git status --short` | Only owner-approved files are changed or untracked; unrelated folders remain untracked and unstaged. |
| `git diff --check` | Passes with no whitespace errors. |
| `node --check app.js` | Passes. |
| `node --check tests/driver-stack/driverStackReportObject.mjs` | Passes. |
| `node --check tests/driver-stack/copyDecisionMetadata.mjs` | Passes. |
| `node --check tests/driver-stack/copyDecisionRenderer.mjs` | Passes. |
| `node --check tests/driver-stack/exportCopyDecisionRenderings.mjs` | Passes. |
| `node tests/driver-stack/driverStackContract.test.js` | Passes. |
| `node tests/driver-stack/driverStackFixtures.test.js` | Passes. |
| `node tests/driver-stack/driverStackSafetyInvariants.test.js` | Passes. |
| `node tests/driver-stack/driverStackReportObject.test.js` | Passes. |
| `node tests/driver-stack/copyDecisionMetadata.test.js` | Passes. |
| `node tests/driver-stack/copyDecisionRenderer.test.js` | Passes. |
| `node tests/driver-stack/exportCopyDecisionRenderings.mjs > /tmp/wp13_copy_rendering_check.json` | Passes and writes reviewable JSON. |
| `npm test` | Passes. |
| `git diff -- app.js index.html styles.css mockBackend.js package.json _redirects` | Empty. |
| `git diff -- tests/run-all.js` | Empty. |

## Required copy regression scans

Future tests must scan user-facing copy for forbidden language:

- internal keys
- raw fixture names
- raw scoring names
- diagnosis claims
- treatment claims
- medical-cause claims
- shame or discipline-failure claims
- diet-plan commands
- payment mechanics in safety copy

## Required manual QA before deploy

Manual QA must cover:

- desktop report rendering
- mobile report rendering
- unpaid preview
- paid report
- professional-first route
- medical-context bridge route
- no internal key visibility
- no stuck loading state
- no localStorage regression
- no payment entitlement regression

## Answer to planning question 6

No runtime implementation or deploy should proceed until current driver-stack/copy tests, full `npm test`, forbidden-file diffs, future adapter tests, safety/payment tests, internal-key scans, and manual QA all pass.

Runtime implementation is NOT approved by WP13.
~~~

## Full Content: `runtime-qa-and-rollback-plan.md`

~~~markdown
# Runtime QA And Rollback Plan

## Purpose

This document answers what rollback, QA, and deploy-readiness plan is required before production release.

## Release principle

Runtime release is not a single work pack. It must pass through:

1. adapter contract approval
2. shadow runtime approval
3. gated rendering approval
4. release candidate QA
5. deploy approval

## Rollback plan

Before production release, prepare:

- exact pre-release commit hash
- exact release commit hash
- one-command rollback path
- backup of previous deployed artifact or hosting deploy ID
- owner-approved rollback trigger list
- post-rollback smoke checklist

## Rollback evidence table

| Evidence item | Required before production release |
| --- | --- |
| Pre-release commit | Exact commit hash recorded in owner pack. |
| Release commit | Exact commit hash recorded in owner pack. |
| Hosting deploy ID | Preview and production deploy identifiers recorded. |
| Rollback command | Exact command or hosting UI rollback path recorded. |
| Trigger list | Owner-approved rollback triggers recorded. |
| Smoke checklist | Post-rollback smoke commands and manual checks recorded. |

Rollback triggers:

- internal keys visible to users
- safety guidance hidden by payment
- professional-first route shows ordinary experiment
- paid report unlock fails
- free preview exposes paid report depth
- report fails to render
- mobile layout blocks report reading
- severe copy regression or medical-cause claim appears

## QA plan

QA must include:

- automated tests
- generated artifact review
- owner copy review
- desktop visual smoke
- mobile visual smoke
- unpaid user smoke
- paid user smoke
- safety/professional route smoke
- localStorage behavior smoke
- payment entitlement smoke
- no-PDF/no-deploy-until-approved check

## QA matrix

| QA area | Required proof | Release blocker if failing |
| --- | --- | --- |
| Automated tests | Full regression command list passes. | Yes |
| Owner copy review | Sensitive copy approved in preview, paid, and safety placements. | Yes |
| Desktop rendering | Report readable with no internal keys. | Yes |
| Mobile rendering | Report readable with no overlap or blocked scrolling. | Yes |
| Unpaid preview | Preview limited to allowed summary and safety guidance. | Yes |
| Paid report | Ordinary depth appears only after entitlement. | Yes |
| Safety/professional route | Guidance appears without payment and suppresses ordinary experiments when required. | Yes |
| localStorage behavior | No storage regression from adapter or report rendering. | Yes |
| Payment entitlement | No QPay/backend/pricing/entitlement regression. | Yes |
| Rollback rehearsal | Rollback path is known before production. | Yes |

## Deploy-readiness gate

Production deploy requires:

- clean git status except explicitly approved release files
- full tests green
- future adapter tests green
- owner review signed off
- rollback plan documented with exact commands
- preview deploy tested
- production deploy explicitly approved by owner

## Post-deploy checks

After production deploy, run:

- production URL HTTP check
- report page smoke
- free preview smoke
- paid report smoke
- safety/professional copy smoke
- mobile viewport smoke
- console error check if browser tooling is available
- rollback-ready confirmation

## Answer to planning question 7

Before production release, the team needs a documented rollback path, automated and manual QA, preview deploy proof, explicit production approval, and post-deploy smoke checks. WP13 does not approve any deploy.

Runtime implementation is NOT approved by WP13.
~~~

## Full Content: `wp13-risk-register.md`

~~~markdown
# WP13 Risk Register

## Purpose

This risk register captures runtime-integration risks that must be resolved before any future implementation work begins.

WP13 is docs-only. The risks below do not approve implementation, runtime rendering, deploy, PDF generation, or payment/backend changes.

## Risk table

| Risk | Severity | Why it matters | Required mitigation before runtime |
| --- | --- | --- | --- |
| Internal key leakage | High | Test-only fields such as fixture names, driver keys, metadata flags, and runtime gates would confuse users and expose implementation details. | Add runtime adapter tests that scan every user-facing field for internal keys. |
| Safety guidance hidden by payment | High | Professional/medical-context guidance must not be treated as premium content. | Add unpaid-state tests proving safety/professional guidance renders before entitlement. |
| Professional-first route shows ordinary experiment | High | Safety routing can be weakened if ordinary experiments appear when professional-first guidance should lead. | Add tests proving ordinary experiment sections are suppressed when safety requires it. |
| Medical-cause implication | High | Sensitive body-change copy could imply PCOS, hormones, medication, glucose, or diagnosis. | Preserve non-diagnostic language and scan for forbidden medical-cause phrases. |
| Diet-plan regression | Medium | All-or-nothing copy could regress into macro or strict diet instruction. | Scan for macro-prescriptive and punishment/restriction wording before release. |
| Payment mechanics in user-facing copy | Medium | Product mechanics can make sensitive guidance feel withheld or transactional. | Keep payment policy outside report-body copy and review rendered strings. |
| Preview exposes paid depth | Medium | Preview may accidentally reveal full ordinary report depth. | Add preview/paid allocation tests in a future adapter work pack. |
| Paid report hides safety bridge | High | Paid gating must not hide safety/professional copy. | Add explicit safety-over-payment tests. |
| Runtime adapter mutates contracts | High | WP3/WP4/WP9/WP10/WP12 contracts are the audit trail. | Adapter must consume existing outputs without mutating their contracts. |
| Deploy without rollback | High | Report rendering bugs could affect paid users and safety flows. | Require preview deploy proof, rollback path, and post-deploy smoke checks. |

## Decision status by risk

| Risk area | WP13 decision | Future gate |
| --- | --- | --- |
| Runtime rendering | HOLD | Requires approved adapter, shadow runtime, and owner review. |
| Safety/payment boundary | HOLD for implementation; planned only | Requires unpaid-state tests and manual QA. |
| Production report copy | HOLD | Requires owner copy review on future surfaced copy. |
| Payment/QPay/backend/pricing/entitlement | HOLD | Separate approved work pack only. |
| PDF generation | HOLD | Separate approved work pack only. |
| Deploy | HOLD | Requires release candidate QA, rollback plan, and explicit owner approval. |

## Owner decision required before implementation

Owner must approve a future runtime adapter contract before any `app.js` work starts.

## Required conclusion

Runtime implementation is NOT approved by WP13.
~~~

## Full Content: `runtime-integration-decision-gate.md`

~~~markdown
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
~~~

## Full Content: `work-pack-13-recommendation.md`

~~~markdown
# Work Pack 13 Recommendation

Recommendation: `READY FOR OWNER REVIEW OF RUNTIME INTEGRATION READINESS PLAN`

## Why

WP13 answers the seven runtime-readiness planning questions without changing runtime code.

It defines:

- the future pipeline connection
- report surface allocation
- safety/payment boundaries
- future file scope before `app.js`
- validation requirements
- rollback, QA, and deploy-readiness requirements
- the next recommended work pack

## Seven-question completion checklist

| Question | Status | Artifact |
| --- | --- | --- |
| Future pipeline connection | Complete | `test-only-to-runtime-pipeline-map.md` |
| User-facing sections | Complete | `report-surface-and-gating-plan.md` |
| Preview/paid/safety/internal allocation | Complete | `report-surface-and-gating-plan.md` |
| Never-paywalled safety/professional/medical-context copy | Complete | `safety-payment-boundary-plan.md` |
| Future file scope before `app.js` | Complete | `future-runtime-file-scope.md` |
| Tests before runtime or deploy | Complete | `runtime-regression-test-plan.md` |
| Rollback, QA, deploy-readiness | Complete | `runtime-qa-and-rollback-plan.md` |

## Not approved

WP13 does not approve:

- runtime implementation
- `app.js` changes
- production report rendering
- PDF generation
- deploy
- backend/payment/QPay/pricing/entitlement changes
- scoring changes
- fixture behavior changes
- WP4 report object contract changes
- WP9 metadata contract changes
- WP10/WP12 renderer contract changes

## Next work pack

Recommended next work pack:

```text
WP14 — Test-Only Runtime Adapter Contract
```

WP14 should create a test-only adapter contract and tests without touching `app.js`.

## Final required WP13 artifacts

- `audits/mvp-diagnostic-migration/work-pack-13/runtime-integration-readiness-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/test-only-to-runtime-pipeline-map.md`
- `audits/mvp-diagnostic-migration/work-pack-13/report-surface-and-gating-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/safety-payment-boundary-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/future-runtime-file-scope.md`
- `audits/mvp-diagnostic-migration/work-pack-13/runtime-regression-test-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/runtime-qa-and-rollback-plan.md`
- `audits/mvp-diagnostic-migration/work-pack-13/wp13-risk-register.md`
- `audits/mvp-diagnostic-migration/work-pack-13/runtime-integration-decision-gate.md`
- `audits/mvp-diagnostic-migration/work-pack-13/work-pack-13-recommendation.md`
- `audits/mvp-diagnostic-migration/work-pack-13/OWNER_REVIEW_PACK_WP13.md`

## Required conclusion

Runtime implementation is NOT approved by WP13.
~~~

## Owner Pack Final Decision

READY FOR OWNER REVIEW OF RUNTIME INTEGRATION READINESS PLAN

Runtime implementation is NOT approved by WP13.
