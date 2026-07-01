# Work Pack 7 Future Report Object Impact

## Summary

WP7 should not change the WP4 report object contract. It only records owner decisions that may guide future implementation.

The recommended decision for both unresolved fixtures is copy-first:

- `all_or_nothing_restriction_rebound`: keep `hunger_safety`, add a supplementary restriction/rebound relief narrative in future copy.
- `pcos_body_uncertainty_control`: keep ordinary `mode1`, add a mandatory soft medical-context bridge in future copy.

## No immediate contract or scoring changes

WP7 requires:

- No immediate WP4 contract change.
- No immediate scoring change.
- No immediate fixture behavior change.
- No immediate safety routing change.
- No immediate runtime rendering change.

These constraints matter because WP3/WP4 are already accepted test-only foundations. WP7 is an owner decision pass, not an implementation pass.

## Future possible additions, if owner approves later

### `supplementaryNarrative`

Possible use: represent secondary narrative layers that are not the main hidden food function.

Example:

- Main hidden function: `hunger_safety`
- Supplementary narrative: relief from failure / punishment / restart pressure

This could help `all_or_nothing_restriction_rebound` become more explicit without replacing `hunger_safety`.

### `softMedicalContextBridge`

Possible use: render non-blocking medical-context caution without switching to professional-first mode.

Example:

- Safety mode remains `mode1`
- Ordinary experiment remains available
- Copy includes "Энэ нь онош биш" and "тодруулах хэрэгтэй байж магадгүй"

This could help `pcos_body_uncertainty_control` stay ordinary while preventing medical overclaiming.

### `copyRiskFlags`

Possible use: tag copy risks that must be checked before rendering.

Example flags:

- `medical_cause_implication`
- `body_shame_sensitivity`
- `restriction_rebound_shame`
- `internal_key_leak_risk`

These flags would support future tests and owner QA.

### `structureDecisionNotes`

Possible use: preserve owner-approved decisions inside test-only or future runtime artifacts.

Example:

- `all_or_nothing_restriction_rebound`: use both hunger safety and relief/restart-pressure narrative.
- `pcos_body_uncertainty_control`: keep ordinary mode plus mandatory medical-context bridge.

## Why these should not be added in WP7

These fields should not be added in WP7 because:

- WP7 is docs-only.
- Runtime integration remains HOLD.
- WP4 report object contract changes are forbidden.
- Scoring and fixture behavior changes are forbidden.
- New fields would require tests, owner review, and possibly fixture artifact regeneration.
- The owner has not yet selected final options in `owner-decision-record.md`.

## Future work pack that might implement them

A future work pack could implement these additions after owner approval:

- Work Pack 8: Test-Only Copy Decision Implementation
- Work Pack 9: Report Object Narrative Extension Prototype
- Work Pack 10: Runtime Integration Planning Gate

The recommended next implementation, if owner approves WP7 Option B for both fixtures, is a test-only copy decision implementation that does not touch production rendering.

## Runtime planning implication

Future runtime planning must not start until:

1. Owner fills `owner-decision-record.md`.
2. Copy architecture is updated to reflect selected options.
3. Any new test-only fields or copy rendering rules are implemented and validated.
4. Safety/payment boundary is verified: safety and professional-context copy must never be blocked by payment.
