# WP66 - WP64 Review Fix Plan

## Scope

WP66 hardens the internal report engine after the WP64 virtual-user PDF review. The public domain remains in Coming Soon mode and the paid/test flow stays closed.

## WP64 Failures

1. Paid report numbering could jump from `5. 14 хоногийн жижиг туршилт` to a numbered save section when caution content was absent.
2. One-time paid report intro sounded robotic and repeated paid-report framing.
3. Cycle branch QA exposed an answer mapping risk where MC-02 could be paired with craving/symptom answers.
4. Scenario matching was too weak for sleep/rhythm, night work, cue/snacking, family/caregiving, and strict-diet rebound.
5. Professional-first safety route felt like a dead end and did not include copy/print report delivery actions.
6. Virtual QA verdict rules were too lenient and could allow PASS despite focus mismatch or structural defects.

## Fixes Made

| Failure | Fix |
| --- | --- |
| Numbering jump | Save section is now unnumbered as `Тайлангаа хадгалах`; caution remains `6. Болгоомжлох зүйл` only when relevant. |
| Robotic intro | One-time report intro now uses the calmer sentence: `Доорх тайлан таны хариултаас хамгийн хүчтэй давтагдаж буй нэг хэв маягийг тайван харуулах зорилготой.` |
| MC answer mapping | Added same-question option validation helpers and MC-02 mapping regression coverage. |
| Weak scenario focus | Added scenario priority rules for sleep/rhythm, night work, cue/snacking, family/caregiving, strict rebound, and weekend social evidence. |
| Professional route value | Professional route now renders a structured paid safety report with four sections plus copy/print delivery actions. |
| QA false PASS | Added strict QA verdict regression tests for mismatch, numbering jump, MC mapping, and missing copy/print. |

## Test Coverage

| Test | Coverage |
| --- | --- |
| `tests/paid-report-quality.test.js` | Paid headline, calm intro, sequential sections, unnumbered save section, no old paid/free/upsell copy. |
| `tests/cycle-question-mapping.test.js` | MC-02 answer ownership, symptom/craving answer exclusion, female opt-in/out, male/unknown exclusion. |
| `tests/scenario-focus-matching.test.js` | Expected primary focus for sleep/rhythm, night work, cue/snacking, family leftovers, strict rebound, weekend social, stress eating. |
| `tests/report-safety-routing.test.js` | Mild body caution routing and professional paid safety report structure/actions. |
| `tests/virtual-qa-verdict-strictness.test.js` | False PASS prevention for focus mismatch, numbering jump, MC mapping, and missing professional actions. |

## Remaining Risks

- WP66 uses fixture-level scenario priority rules; the 10-person PDF pack still needs regeneration and visual review.
- Professional route copy is safer and more complete, but owner should verify it feels paid-value worthy in the regenerated PDFs.
- Scenario matching is improved for the WP64 failures, but broader edge cases may surface after another virtual-user run.

## Recommendation

READY TO REGENERATE WP64 PDF PACK
