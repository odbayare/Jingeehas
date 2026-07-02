# WP16 app.js Shadow Touchpoint Audit

## Purpose

This document audits `app.js` read-only and identifies where a future shadow runtime adapter could be safely invoked.

WP16 does not modify `app.js`.

Runtime implementation is NOT approved by WP16.

## `app.js` areas inspected

Read-only inspection covered:

- state loading and persistence: `loadState()`, `saveState()`, `resetState()`, `setView()`;
- payment and entitlement paths: QPay helpers, `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, `hasUpgradeAccess()`;
- answer mutation paths: `setAnswer()`, `setAnswerDraft()`;
- report rendering helpers: `renderHumanReadableReport()`, `renderOneTimeReport()`, paywall renderers;
- main report branch: `renderReport()`;
- browser render router: `render()`;
- Node test exports under `module.exports._internal`.

## Required touchpoint table

| Candidate touchpoint | What happens there now | Shadow adapter suitability | Risk | WP17 recommendation |
| --- | --- | --- | --- | --- |
| Top-level module load near constants | Defines storage key, pricing constants, QPay endpoints, question banks, mechanisms, and initial state | Low | Runs before report context exists; easy to create global behavior or module-format problems | Do not invoke adapter here. Only `ENABLE_RUNTIME_ADAPTER_SHADOW = false` may be added here if WP17 is approved. |
| `loadState()` | Reads `localStorage`, URL params, path view, internal test flag, and coach invite token | Unsafe | Any shadow logic here could change persisted state semantics or public URL behavior | Do not touch for shadow adapter invocation. |
| `saveState()` | Writes full `state` to `localStorage` under `weightLossDeepPatternMvp` | Unsafe | Any shadow output stored here would change localStorage shape and create production behavior drift | Do not touch. Shadow path must not call this. |
| Answer update functions such as `setAnswer()` and `setAnswerDraft()` | Mutate stage answers, recalculate safety flags, save state, and sometimes render | Unsafe | Too early; adapter would run during input changes and could affect state, performance, or safety flags | Do not touch. |
| Payment/QPay functions and access helpers | Create/check QPay invoices, mark payment status, and evaluate access | Unsafe | Could alter payment, entitlement, QPay status, or paywall behavior | Do not touch. Shadow adapter must not depend on these to enable rendering. |
| `renderHumanReadableReport()` | Builds existing visible report HTML for one-time and seven-day full reports | Limited | Already inside visible rendering; adding adapter output here risks copy or markup drift | Do not invoke adapter here. Existing HTML must remain unchanged. |
| `renderOneTimeReport()` | Delegates one-time paid rendering to `renderHumanReadableReport()` | Limited | Too narrow for seven-day, safety, paywall, and readiness coverage | Do not use as primary touchpoint. |
| `renderReport()` after report inputs are computed and before existing return branches | Computes mode, ranked patterns, primary/secondary mechanisms, readiness, evidence, tags, and report helper data before safety/payment/readiness branches return HTML | Best candidate | Must prove no returned HTML, state, localStorage, payment, or entitlement changes | Recommended WP17 touchpoint, behind disabled shadow guard only. |
| `render()` route dispatcher | Chooses route renderer and writes returned HTML into `#app` | Unsafe | Any adapter call here is too close to DOM output and applies to every route | Do not touch for shadow adapter invocation. |
| `module.exports._internal` | Exposes functions for Node tests | Good for tests only | Could accidentally expose public browser globals if misused elsewhere | May expose a test-only shadow helper or test setter if WP17 is approved. |

## Exact recommended touchpoint for WP17

The exact recommended touchpoint is inside `renderReport()` in `app.js`, immediately after the existing report context variables are computed and before the first existing return branch.

The relevant computed data currently includes:

- `quality`
- `mode`
- `ranked`
- `primary`
- `secondary`
- `primaryMechanism`
- `isOneTime`
- `ctaPatterns`
- `readiness`
- `narrativeEvidence`
- `stageEvidence`
- `tags`
- `triggerRows`
- `hiddenItems`
- `surfaceItems`
- `beforeItems`
- `afterItems`
- `cycleSteps`
- `avoidItems`
- `leverage`
- `experiment`

The shadow call must be shaped so the existing branches remain the authority:

- urgent route still returns urgent safety copy;
- professional route still returns professional-first copy;
- unpaid one-time route still returns the one-time paywall;
- unpaid seven-day route still returns the seven-day paywall;
- insufficient seven-day route still returns readiness copy;
- paid one-time route still returns the existing one-time report;
- paid seven-day route still returns the existing seven-day report.

## Why this touchpoint is safest

This point is safest because `renderReport()` has already gathered report inputs but has not yet returned user-facing HTML.

At this point WP17 can run a disabled shadow helper for tests without:

- changing the router;
- changing DOM writes;
- changing localStorage;
- changing answer mutation;
- changing payment access checks;
- changing QPay behavior;
- changing visible report copy;
- changing safety/professional branch priority.

## Data available there

The recommended touchpoint has enough read-only report context to build an internal shadow context:

- current report mode from `reportMode()`;
- ranked mechanism results from `rankedPatterns(true)`;
- primary and secondary mechanism candidates;
- current package type;
- report readiness;
- confirmed stage and narrative evidence;
- report tags;
- trigger, hidden-function, surface-behavior, before-eating, and after-eating helper outputs;
- cycle, avoid-list, leverage, and experiment helper outputs.

WP17 may pass this data into a pure shadow helper for validation only.

## Data that must not be accessed

The shadow adapter must not access:

- `localStorage`;
- QPay invoice data;
- QPay endpoint URLs;
- payment session IDs;
- payment status except through existing branches that already use it;
- backend or mockBackend mutation APIs;
- coach session tokens;
- coach client records;
- lead capture records;
- DOM nodes;
- browser URL query flags as an enablement path;
- PDF generation scripts;
- deploy metadata.

The shadow adapter must not read payment or entitlement state to decide whether to render. Rendering remains blocked.

## User-visible behavior that must remain unchanged

With the shadow flag disabled, all user-visible behavior must remain unchanged:

- same returned HTML from `_internal.renderReport()` for existing tested states;
- same urgent safety route;
- same professional-first route;
- same one-time unpaid paywall;
- same one-time paid report;
- same seven-day paywall;
- same seven-day readiness gate;
- same seven-day report;
- same internal tester feedback UI;
- same buttons and route changes;
- same report copy;
- no new loading state;
- no new console-required behavior.

The WP14 adapter payload must not appear in:

- DOM;
- returned HTML strings;
- visible report sections;
- paywall sections;
- feedback export;
- coach dashboard;
- admin coach view.

## localStorage behavior that must remain unchanged

Current state persistence uses:

```text
weightLossDeepPatternMvp
```

WP17 must preserve:

- same storage key;
- same load timing;
- same save timing;
- same state fields unless separately approved;
- no persisted shadow payload;
- no persisted adapter diagnostics;
- no persisted owner debug;
- no localStorage query or flag that enables shadow runtime behavior.

The shadow helper must not call `saveState()`.

If WP17 is approved, the only allowed flag name is:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

## Payment and entitlement behavior that must remain unchanged

WP17 must preserve:

- `hasOneTimeReportAccess()` behavior;
- `hasSevenDayAccess()` behavior;
- `hasUpgradeAccess()` behavior;
- QPay create/check endpoint values;
- QPay product code;
- QPay amount and price behavior;
- mockBackend access-state behavior;
- paywall branch order;
- safety/professional guidance outside payment;
- no paid-depth report exposure for unpaid users.

The WP14 adapter's `paymentGate.safetyGuidanceRequiresPayment === false` must remain an internal validation invariant only. It must not become a production entitlement implementation in WP17.

## Rollback implications

Because the recommended touchpoint is inside `renderReport()`, rollback must be simple and exact.

WP17 rollback plan must list:

- pre-WP17 commit hash;
- WP17 commit hash if committed;
- exact `app.js` hunk names or helper names;
- exact tests added;
- revert command;
- post-rollback test commands.

Rollback must remove:

- disabled shadow flag;
- shadow helper;
- `renderReport()` shadow call;
- test-only internal hook;
- WP17 tests.

Rollback must not touch:

- unrelated untracked folders;
- payment code;
- QPay code;
- backend code;
- PDF scripts;
- WP14 adapter module/test/exporter unless explicitly modified by a future approved scope.

## Required WP17 test evidence from this audit

WP17 tests must prove:

- disabled shadow path returns exactly the same report HTML as before;
- enabled test-only shadow path can validate WP14 payload without using returned HTML;
- no shadow payload appears in report HTML;
- no localStorage reads or writes are added by shadow invocation;
- payment and entitlement helpers return the same values before and after shadow invocation;
- safety/professional routes remain unchanged;
- full regression tests pass.

## Final audit recommendation

WP17 may touch `app.js` only at the `renderReport()` shadow touchpoint described above, and only if the owner accepts WP16.

The patch must be disabled by default, internal-only, test-covered, rollback-ready, and non-rendering.

Runtime implementation is NOT approved by WP16.
