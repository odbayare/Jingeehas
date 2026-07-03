# WP19 Copy And Safety QA Gate

## Purpose

This artifact defines the copy and safety QA gates required before any future WP20 visible surface prototype can be committed.

WP19 does not change report copy and does not approve visible runtime rendering.

## QA Gate Table

| QA area | Required review | Blocks visible prototype if failing? | Evidence required |
| --- | --- | --- | --- |
| non-shaming language | Confirm visible copy does not shame body, appetite, weight, discipline, or relapse. | Yes | Copy QA notes and reviewed sample output. |
| body-neutral language | Confirm visible copy stays body-neutral and avoids appearance judgment. | Yes | Copy QA notes and reviewed sample output. |
| no diagnosis/treatment claim | Confirm visible copy does not diagnose, treat, prescribe, or replace professional care. | Yes | Safety QA notes and claim scan. |
| no medical-cause implication | Confirm visible copy does not imply PCOS, hormone, medication, glucose, or other medical causality. | Yes | Safety QA notes and claim scan. |
| no diet-command language | Confirm visible copy does not command restrictive dieting or rigid food rules. | Yes | Copy QA notes and diet-command phrase scan. |
| no payment mechanics in sensitive copy | Confirm sensitive guidance does not include purchase pressure, pricing, QPay, unlock, or payment mechanics. | Yes | Safety/payment copy scan. |
| no internal key leak | Confirm adapter fields, fixture names, internal diagnostics, and owner debug keys are absent from user-facing copy. | Yes | Returned HTML leak scan. |
| safety guidance clarity | Confirm safety/professional guidance is clear, direct, and not buried behind ordinary report framing. | Yes | Safety QA notes and branch review. |
| mobile readability | Confirm visible copy remains readable on small screens without overlap or truncation. | Yes | Mobile/readability smoke evidence. |
| Mongolian naturalness | Confirm Mongolian reads naturally and does not feel machine-translated or awkward. | Yes | Native-language copy QA notes. |
| AI smell / generic copy risk | Confirm visible copy avoids generic motivational filler and vague AI-sounding phrasing. | Yes | Copy QA notes and reviewed sample output. |

## Exact Rules

Visible copy must not diagnose or treat.

Visible copy must not imply PCOS, hormone, medication, or glucose causality.

Visible copy must not contain payment mechanics inside sensitive guidance.

Visible copy must remain non-shaming and body-neutral.

Visible runtime report rendering is NOT approved by WP19.

## WP20 Requirement

WP20 may only prototype visible surfaces if the owner accepts WP19.

Any WP20 prototype must include copy and safety QA evidence before commit.
