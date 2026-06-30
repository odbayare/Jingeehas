# Sprint 34B — Medical/Cycle Context Precision + Reframe Copy Polish

Date: 2026-06-30

## Owner review findings

Sprint 34A-ийн surface-hidden integration илүү сайн болсон. Гэхдээ medical/cycle context copy хэт өргөн хэвээр байсан:

- PCOS/irregular-cycle хэрэглэгч дээр `Эм, даралт, PCOS...` гэх нэгтгэсэн өгүүлбэр гарч байсан.
- Medication/BP хэрэглэгч дээр PCOS/cycle wording уусах эрсдэлтэй байсан.
- Irregular/perimenopause/low-confidence cycle report-д premenstrual-specific section heading тохиромжгүй байв.
- Surface-hidden block зарим report дээр нэг хэвийн template мэт давтагдаж байв.

## Context precision fixes

Medical/body context copy одоо evidence-specific болсон:

| Evidence | Copy now used |
| --- | --- |
| PCOS / irregular cycle | `PCOS сэжиг, мөчлөг тогтмол бус байдал нь шалгаж үзэх зүйл байж болно.` |
| Medication / BP | `Эмийн хэрэглээ, даралт, хоолны дуршлын өөрчлөлт нь шалгаж үзэх зүйл байж болно.` |
| Perimenopause | `Мөчлөг, нойр, биеийн өөрчлөлт нь шалгаж үзэх зүйл байж болно.` |
| Postpartum | `Төрсний дараах үе, тасалдсан нойр, хүүхэд асрах ачаалал нь бодитоор нөлөөлж болно.` |

Unrelated contexts are no longer mixed into each other’s report voice.

## Cycle precision

For low-confidence cycle contexts such as irregular cycle, PCOS, hormonal modifier, postpartum/breastfeeding, and perimenopause:

- removed premenstrual-specific experiment heading
- added `Мөчлөг тогтмол бус үед`
- kept copy non-diagnostic and observation-focused

Regular premenstrual reports may still use premenstrual framing when evidence supports it.

## Reframe copy polish

The surface-hidden block no longer relies on the repeated generic template:

- removed repeated `Та ... нөлөөлж байгаа гэж анзаарсан байна. Энэ нь бодит нөлөө байж болно.`
- removed repeated `Гэхдээ энэ тайлангийн гол нь зөвхөн ... биш.`
- added archetype-specific direct copy for shift work, remote/cue, social/weekend, postpartum, gym restriction, perimenopause, PCOS, and medication/BP.

## Before / after examples

### User 08 — PCOS / irregular cycle

Before:
`Эм, даралт, PCOS сэжиг, мөчлөг тогтмол бус байдал зэрэг нь бодит шалгах зүйл байж болно.`

After:
`PCOS сэжиг, мөчлөг тогтмол бус байдал нь шалгаж үзэх зүйл байж болно.`

Also now includes:
`Мөчлөг тогтмол бус үед`

### User 09 — Medication / BP

Before:
Medication/BP user could inherit broad PCOS/cycle wording.

After:
`Эмийн хэрэглээ, даралт, хоолны дуршлын өөрчлөлт нь шалгаж үзэх зүйл байж болно.`

PCOS wording is not shown unless PCOS evidence is selected.

## Tests

Updated `tests/surface-hidden-function-reframe.test.js` to assert:

- medication/BP report contains medication/BP-specific copy
- medication/BP report does not contain `PCOS сэжиг`
- PCOS report contains PCOS/irregular-cycle-specific copy
- PCOS report does not contain medication/BP copy
- perimenopause report contains perimenopause-specific copy
- perimenopause report does not contain PCOS or medication/BP copy
- low-confidence cycle reports contain `Мөчлөг тогтмол бус үед`
- low-confidence cycle reports do not show `Сарын тэмдэг ирэхийн өмнөх өдрүүдэд`
- remote/cue report no longer uses the generic surface-hidden template
- restriction-collapse without gym evidence does not mention `хүчтэй дасгал`

## Sprint 33 regeneration

- Output folder: `audits/sprint-33-second-virtual-cohort/`
- PDF: `audits/sprint-33-second-virtual-cohort/WEIGHT_TEST_SECOND_10_USER_FACING_REPORTS.pdf`
- Result: 10 PASS / 0 PARTIAL / 0 FAIL
- P0/P1/P2: 0/0/0
- Recommendation: READY FOR OWNER REVIEW - HUMAN TESTING STILL HOLD

## Validation

- `node --check app.js` — passed
- `node --check scripts/run-virtual-user-audit.mjs` — passed
- `node --check scripts/run-sprint-33-second-virtual-cohort.mjs` — passed
- `node scripts/run-virtual-user-audit.mjs --assert-clean` — passed, 10 PASS, readiness 96
- `npm test` — passed
- `node scripts/run-sprint-33-second-virtual-cohort.mjs` — passed, 10 PASS, P0/P1/P2 = 0/0/0
- `git diff --check` — passed

## Recommendation

READY FOR OWNER REVIEW — HUMAN TESTING STILL HOLD
