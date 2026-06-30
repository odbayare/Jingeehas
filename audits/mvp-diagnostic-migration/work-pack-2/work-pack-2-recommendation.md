# Work Pack 2 Recommendation

Recommendation: proceed with a test-only driver-stack layer before changing runtime behavior.

## Summary

Work Pack 1 found that the current Weight Test system is not a simple route-based prototype. It already has:

- rich current mechanism keys;
- answer-option scoring;
- question metadata;
- evidence aggregation;
- confirmed narrative summaries;
- diary repetition evidence;
- report readiness;
- safety modes;
- report modules;
- professional-first and urgent safety suppression.

Therefore, the correct migration is not replacement. The correct migration is an explicit driver-stack layer built on top of the current mechanism engine.

## Recommended Order

### 1. Keep current runtime frozen

Do not change:

- `app.js`
- questions
- current reports
- current scoring
- PDF generation
- backend/mock backend behavior
- payment/QPay/pricing/entitlement
- prompts
- deploy configuration

### 2. Approve the Work Pack 2 contracts

Review and approve:

- `driver-taxonomy-crosswalk.md`
- `driver-scoring-spec.md`
- `driver-stack-contract.md`
- `vulnerable-moment-contract.md`
- `fixture-archetype-plan.md`
- `future-test-plan.md`

### 3. Next implementation should be tests-only

The next work pack should add a parallel test-only calculator and fixtures. It should not render new report copy yet.

Proposed next work pack:

```text
Work Pack 3 — Test-Only Driver Stack Calculator
```

Allowed scope for Work Pack 3:

- add a non-runtime helper under `tests/` or `tools/`;
- add fixture JSON/JS objects;
- add tests that call current exported internals from `app.js`;
- assert driver-stack contract output;
- keep all app behavior unchanged.

Disallowed scope for Work Pack 3:

- no report copy changes;
- no question changes;
- no scoring replacement;
- no PDF regeneration;
- no payment/backend/QPay changes;
- no deploy.

## Acceptance Criteria For Work Pack 3

- Existing `npm test` still passes.
- New driver-stack tests pass.
- Current mechanism evidence remains available.
- Driver-stack output includes:
  - primary driver;
  - secondary drivers;
  - normalized driver scores;
  - strength labels;
  - interaction pattern;
  - vulnerable moment;
  - hidden food function;
  - first gentle change;
  - 14-day experiment hypothesis;
  - 7-day diary confirmation targets;
  - safety route.
- Safety/professional-first modes suppress ordinary experiment in contract output.
- No user-facing runtime changes.

## Product Guardrails

- This is not a diet plan.
- This is not a calorie tracker.
- This is not a one-type personality report.
- A user has a driver stack, not a type.
- The first change should be gentle and low-friction.
- Safety/professional-first routes must outrank ordinary report logic.
- 7-day diary should confirm, weaken, or redirect the initial stack.

## Recommended Owner Decision

Approve the driver-stack direction if the owner agrees with these statements:

1. Old mechanisms remain the evidence backbone.
2. New drivers are a translation and stacking layer.
3. Driver scoring should be test-only before runtime.
4. Report copy should change only after driver-stack tests are stable.
5. Safety and payment boundaries remain unchanged.
