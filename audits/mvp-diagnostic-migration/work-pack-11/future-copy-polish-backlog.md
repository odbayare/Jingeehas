# Work Pack 11 Future Copy Polish Backlog

Scope: docs-only backlog for future test-only copy polish.

This backlog does not approve runtime integration, production rendering, PDF generation, deploy, scoring changes, fixture changes, renderer changes, backend work, payment work, QPay work, pricing changes, entitlement changes, or localStorage changes.

## Backlog table

| Priority | Fixture | Section | Problem | Proposed direction | Owner decision needed? |
| --- | --- | --- | --- | --- | --- |
| P0 | `all_or_nothing_restriction_rebound` | Эхний зөөлөн өөрчлөлт | `Нэг уурагтай, нэг нүүрс устай...` risks sounding like diet instruction or macro prescription. | Replace with next-meal reset language that avoids meal formulas and emphasizes not punishing the next meal. | Yes |
| P0 | `pcos_body_uncertainty_control` | Зөөлөн мэргэжлийн гүүр | `мөчлөг, эм, даавар, цусан дахь сахар` may imply medical causes by proximity. | Reframe as concerns the user may already have, not causes detected by the product. | Yes |
| P0 | `pcos_body_uncertainty_control` | 14 хоногийн туршилтын таамаг | `төлбөртэй тайлангаар хаахгүй` exposes product/payment mechanics. | Convert to user-facing safety language that professional clarification is not delayed or gated. | Yes |
| P1 | `all_or_nothing_restriction_rebound` | Ил харагдаж байгаа зүйл | `аюулгүй хооллох дохио` sounds translated and not fully natural. | Use more everyday body-signal language about the body needing reliable nourishment after restriction. | Yes |
| P1 | `all_or_nothing_restriction_rebound` | 14 хоногийн туршилтын таамаг | `оройн дайралт` may sound too intense. | Soften to a phrase like strong evening pull, difficult evening moment, or evening hunger pressure. | Yes |
| P1 | `pcos_body_uncertainty_control` | Эхний зөөлөн өөрчлөлт | The tracking list is long and may feel like self-surveillance. | Group signals into fewer categories such as sleep, hunger, energy, and repeated body cues. | Yes |
| P1 | `pcos_body_uncertainty_control` | 7 хоногийн баталгаажуулах тэмдэглэл | Diary asks for many signals and could become too monitoring-heavy. | Keep `дүгнэлтгүй` but reduce list density and emphasize calm pattern noticing. | Yes |
| P2 | `all_or_nothing_restriction_rebound` | Цаана нь ажиллаж байгаа зүйл | `үүрэг авч байна` is conceptually clear but slightly architectural. | Make the line more spoken while preserving relief from failure/restart pressure. | No |
| P2 | `all_or_nothing_restriction_rebound` | 7 хоногийн баталгаажуулах тэмдэглэл | `хэр зөөлөн сэргээсэн эсэхээ` is clunky. | Smooth into natural language about continuing the next meal without punishment. | No |
| P2 | `pcos_body_uncertainty_control` | Ил харагдаж байгаа зүйл | `барих нэг жижиг бариул` has uneven idiom quality. | Replace with a simpler phrase about looking for one steady thing to hold onto. | No |
| P2 | `pcos_body_uncertainty_control` | Эхний зөөлөн өөрчлөлт | `гэдэс цадах мэдрэмж` is awkward. | Use a more natural phrase for fullness/satisfaction without body judgment. | No |

## Suggested next work pack

Recommended next work pack: test-only copy polish pass for the two WP10 sensitive fixtures.

The next pass should:

- rewrite only user-facing draft copy
- preserve WP9 metadata decisions
- preserve WP10 renderer contract unless explicitly approved later
- keep runtime integration on HOLD
- regenerate markdown snapshots for owner review
- re-run internal-key, safety, non-diagnostic, and non-shaming checks
