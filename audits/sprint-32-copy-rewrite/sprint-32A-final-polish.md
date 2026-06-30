# Sprint 32A — Final User-facing Report Polish

Date: 2026-06-30

## Status

Recommendation: READY FOR OWNER COPY REVIEW

Human testing: HOLD
Coach testing: HOLD
Public/paid traffic: HOLD
Deploy: not run
QPay: disabled

## Owner Review Issues

1. `MONGOLIAN_REPORT_STYLE_BIBLE.md` was mostly English.
2. The section `Тэр үед хоол танд юу өгч байсан байж болох вэ?` used the same generic intro across ordinary reports.
3. Evidence notes felt too generic.
4. `7 хоногоор нарийвчлах` appeared as both a heading and CTA.
5. Menstrual-cycle report repeated similar context notes.
6. Several headings could be more natural.

## Fixes Applied

### Style Bible

Rewrote the style bible in Mongolian.

Before:
`Strong Mongolian prose often starts from something concrete...`

After:
`Сайн монгол тайлан эхлээд хийсвэр дүгнэлтээс биш, амьд мөчөөс эхэлнэ.`

The new file keeps the same intent:

- concrete moment first
- verb-led sentences
- fewer abstract noun chains
- no diagnosis tone
- one sentence, one idea
- report should not become a novel, but should not sound translated

### Food-function Intros

Replaced the generic intro:

`Тэр үед хоол зүгээр нэг хоол биш байсан байж болно...`

with archetype-specific intros.

Examples:

- Executive: `Тэр үед хоол сонгох биш, зүгээр амархан дуусгах зүйл хэрэгтэй болдог.`
- Stress: `Тэр үед хоол хэсэг амсхийх газар болж байна.`
- Restriction: `Тэр үед хоол “нэгэнт алдсан” гэсэн дарамтаас түр холдуулах шиг болдог.`
- Cue/environment: `Тэр үед өлссөндөө биш, нүдэнд өртсөн зүйлд гар амархан хүрч байна.`
- Menstrual: `Тэр үед амттай зүйл ядаргаа, сэтгэл савлах мэдрэмжийг хэсэг зөөллөх шиг санагдаж болно.`

### Evidence Notes

Replaced generic source note with personal, archetype-specific evidence.

Examples:

- Executive: `Та орой ядарсан үед хоол захиалах эсвэл гэрт байсан амар сонголт руу ордог гэж тэмдэглэсэн.`
- Stress: `Та стресс, санаа зовнил, уурын дараа идэх хүсэл нэмэгдэж...`
- Restriction: `Та нэг удаа төлөвлөгөө зөрөхөд “өнөөдөр өнгөрлөө” гэж бодогддог гэж хариулсан.`
- Menstrual: `Та сарын тэмдэг ирэхээс өмнөх өдрүүдэд амттай зүйл хүсэх, ядаргаа, сэтгэл савлах нэмэгддэг гэж тэмдэглэсэн.`

### Headings

Updated user-facing headings:

- `Үүнийг юунаас харсан бэ?` -> `Яагаад ингэж хэлж байна вэ?`
- `Асуудал яг юу биш вэ?` -> `Гол буруу ойлголт`
- `Одоогоор болгоомжлох зүйлс` -> `Одоохондоо хэт яарахгүй зүйлс`
- `7 хоногоор нарийвчлах` heading -> `7 хоногийн тэмдэглэл юуг тодруулах вэ?`

The CTA remains:

`7 хоногоор нарийвчлах`

### Menstrual-cycle Compression

The menstrual-cycle report no longer shows both:

- `Нэмэлтээр анхаарах зүйл`
- `Мөчлөгтэй холбоотой анхаарах зүйл`

for the same idea. The detailed report keeps one concise cycle note and states that it is not a diagnosis.

## Tests Added / Updated

Updated `tests/sprint32-export-separation.test.js` to assert:

- style bible is overwhelmingly Mongolian
- style bible does not keep long English explanatory headings
- user-facing export no longer contains the generic food-function intro
- user-facing export includes archetype-specific food-function intros
- user-facing export includes personal evidence phrases for Users 01, 02, 03, and 08
- 7-day refinement heading is distinct from CTA
- menstrual-cycle report does not duplicate cycle context headings

Updated existing heading-dependent tests to use the new user-facing headings.

## Validation Results

Commands run:

- `node --check app.js`
- `node --check scripts/run-virtual-user-audit.mjs`
- `node --check scripts/export-virtual-human-retest.mjs`
- `node scripts/run-virtual-user-audit.mjs --assert-clean`
- `npm test`
- `node scripts/export-virtual-human-retest.mjs`
- user-facing PDF/Markdown banned phrase scan
- `git diff --check`

Virtual user audit:

- 10 PASS
- 0 PARTIAL
- 0 FAIL
- P0 = 0
- P1 = 0
- P2 = 0
- readinessScore = 96

Virtual human retest export:

- 10 PASS
- 0 PARTIAL
- 0 FAIL
- P0 = 0
- P1 = 0
- P2 = 1
- recommendation = READY FOR CONTROLLED HUMAN RETEST

User-facing export scan:

- no internal route/verdict/checklist labels
- no old generic food-function intro
- no old banned payment/report phrases
- no duplicated menstrual-cycle simple/detail heading pair

## Remaining Concerns

P2 remains in the export audit for detailed-report length polish. It is not a blocker for owner copy review.

## Recommendation

READY FOR OWNER COPY REVIEW
