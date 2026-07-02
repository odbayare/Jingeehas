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
