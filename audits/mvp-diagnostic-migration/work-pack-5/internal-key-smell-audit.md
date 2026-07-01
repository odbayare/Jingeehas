# Work Pack 5 Internal-Key Smell Audit

## Conclusion

Internal-key smell is acceptable in WP4 as a test-only artifact, but it is too high for any user-facing report. The keys are useful for fixture validation and owner review, but they must be translated, softened, or hidden before runtime integration.

## Key handling categories

| Key | Test-only acceptability | Future user-facing handling | Reason |
| --- | --- | --- | --- |
| `shift_work` | Acceptable as test-only | Must be translated before user-facing report | Users need plain language about irregular work rhythm, sleep, and recovery, not an internal driver key. |
| `quick_recovery` | Acceptable as test-only | Must be translated before user-facing report | The idea is useful, but the phrase should become a warm explanation of needing quick restoration. |
| `hunger_safety` | Acceptable as test-only | Must be translated before user-facing report | This is clinically delicate and could sound abstract or alarming without context. |
| `body_change_uncertainty` | Acceptable as test-only | Must be translated before user-facing report | Body uncertainty needs body-neutral wording and must avoid implying diagnosis. |
| `professional_first` | Acceptable as test-only | Must be hidden from user-facing report | Users should see a professional-first safety message, not a routing label. |
| `medical_red_flag` | Acceptable as test-only | Must be hidden from user-facing report | This is a safety classification and should not appear as a blunt label. |
| `low_friction_default` | Acceptable as test-only | Must be translated before user-facing report | The meaning should become "the easiest available option" or similar user-facing language. |
| `all_or_nothing` | Acceptable as test-only | Must be translated before user-facing report | The report should describe the pattern without labeling the user. |
| `punishment_restriction` | Acceptable as test-only | Must be translated before user-facing report | The phrase can feel shaming if exposed directly; it needs careful wording. |
| `control_regain` | Acceptable as test-only | Must be translated before user-facing report | The copy should explain seeking steadiness or control without pathologizing the user. |
| `visible_snacks` | Acceptable as test-only | Must be translated before user-facing report | This can become concrete environmental language, such as food being constantly in sight. |
| `delivery_app` | Acceptable as test-only | Must be translated before user-facing report | The copy should describe app convenience and timing, not expose a driver key. |

## Must be translated before user-facing report

These keys can inform copy but should not appear literally: `shift_work`, `quick_recovery`, `hunger_safety`, `body_change_uncertainty`, `low_friction_default`, `all_or_nothing`, `punishment_restriction`, `control_regain`, `visible_snacks`, `delivery_app`.

## Must be hidden from user-facing report

These keys are routing or safety classifications and should be hidden behind carefully written safety copy: `professional_first`, `medical_red_flag`.

## Acceptable as test-only

All audited keys are acceptable inside test-only artifacts, owner review packs, fixture JSON, and non-runtime QA docs, provided future work does not confuse them with production copy.
