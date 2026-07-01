# Work Pack 11 Copy Approval Gate

Scope: docs-only gate definition for future copy polish and runtime planning.

WP11 does not approve runtime integration, production report rendering, PDF generation, deploy work, scoring changes, fixture changes, renderer changes, backend work, payment work, QPay work, pricing changes, entitlement changes, or localStorage changes.

## Current gate status

Status: `HOLD`

Reason: WP11 found that the WP10 rendered snapshots are directionally useful but still need copy polish before any future runtime integration planning.

## Required gates before future runtime integration planning

| Gate | Current status | Required evidence before passing |
| --- | --- | --- |
| Owner approves copy direction | HOLD | Owner explicitly approves the copy direction for both sensitive fixtures after WP11 review. |
| All `NEEDS STRUCTURE CHANGE` sections resolved | READY FOR COPY POLISH | WP11 did not identify a current structure-change blocker, but this gate must remain checked in future reviews. |
| All `HOLD` sections resolved | HOLD | Runtime integration itself remains HOLD; no section or fixture can move to runtime while the overall gate is HOLD. |
| Internal key leak remains blocked | READY FOR COPY POLISH | Future copy snapshots and tests must continue to show no internal keys in user-facing text. |
| Shame/blame language blocked | READY FOR COPY POLISH | Future copy must preserve non-shaming language and avoid discipline-failure framing. |
| Medical-cause claims blocked | NEEDS COPY POLISH | PCOS/body uncertainty copy must soften the medical-context list so it cannot imply hormones, medication, glucose, or PCOS caused the result. |
| Diagnosis/treatment advice blocked | READY FOR COPY POLISH | Future copy must keep `Энэ нь онош биш.` or an equally clear non-diagnostic boundary and avoid treatment advice. |
| 14-day experiment remains observation | READY FOR COPY POLISH | Future copy must keep experiment language as a test/observation, not a command or treatment. |
| 7-day diary remains observation | READY FOR COPY POLISH | Future copy must keep diary language as pattern observation, not compliance tracking or self-judgment. |
| Professional-first copy remains separate | READY FOR COPY POLISH | Soft medical-context bridge must not hijack professional-first routing or ordinary mode. |
| Safety guidance not blocked by payment | NEEDS COPY POLISH | The principle is preserved, but `төлбөртэй тайлангаар хаахгүй` must become user-facing safety language before runtime. |
| Production report rendering still requires separate approval | HOLD | Owner must separately approve production report copy and rendering. |
| PDF still requires separate approval | HOLD | PDF copy/layout generation remains out of scope and must be separately approved. |
| Deploy still requires separate approval | HOLD | No deploy is allowed from WP11; future deploy requires explicit approval and regression QA. |

## Non-negotiable copy blockers

Future runtime planning must stop if any of these appear:

- internal driver keys in user-facing copy
- shame, blame, or discipline-failure language
- diet-command language or macro/portion prescriptions
- medical-cause claims about PCOS, hormones, medication, glucose, or body conditions
- diagnosis or treatment advice
- professional-first guidance hidden behind payment
- 14-day experiment framed as a command
- 7-day diary framed as judgment or compliance

## Gate recommendation

Recommended next status: `NEEDS COPY POLISH`

The next work pack should polish the two sensitive fixture renderings as test-only copy drafts, then regenerate review snapshots before any runtime integration discussion.
