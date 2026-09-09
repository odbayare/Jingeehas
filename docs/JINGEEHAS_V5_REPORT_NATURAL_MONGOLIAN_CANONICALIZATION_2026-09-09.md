# Jingeehas V5 paid-report Natural Mongolian canonicalization

## Baseline

- Repository: `odbayare/Jingeehas`
- Baseline `origin/main`: `16a574556f137afc365bd6eff2a7500eeb112d65`
- Expected handoff SHA: `16a574556f137afc365bd6eff2a7500eeb112d65`
- Difference from expected baseline: none
- Current generated report version: `jingeehas-case-formulation-v8-editorial-polish`
- Corpus authority: `tests/fixtures/v5-virtual-users.js`
- Production-equivalent path: source `app.js` and `netlify/functions/_lib/` → `.generated-copy-hotfix` → `applyMongolianCopyHotfixRuntime()` and V8 transforms → `dist/app.js` plus generated Netlify functions.

This change remains inside the existing V8 transform architecture. A future consolidation of source and generated copy authorities would be a separate refactor.

## Corpus before and after

The corpus was generated with fixed assessment/report timestamps through the real assessment completion, V5 body-context enrichment, `publicReport()` projection, and production-built renderer. Counts cover the 12 commercial public paid reports. U13–U15 were separately checked through their actual safety snapshots and renderer.

| Audit item | Before | After | Classification |
|---|---:|---:|---|
| Commercial reports | 12 | 12 | unchanged |
| Safety reports | 3 | 3 | unchanged |
| ALL-CAPS section headings | 90 | 0 | fixed in current V8 only |
| `Бүлэг N` | 0 | 0 | `QA_ONLY`; absent from public output |
| `Хариулттай холбоо:` | 0 | 0 | `QA_ONLY`; absent from public output |
| Consumer-facing `Тайлбар:` | 0 | 0 | `QA_ONLY`; absent from public output |
| `Нэгтгэл:` | 0 | 0 | `QA_ONLY`; absent from public output |
| Two known generic long scaffolding sentences | 24 occurrences | 0 | replaced by deterministic evidence-pair wording |
| Repeated normalized sentences, unique | 171 | 168 | legitimate factual/structural repetition retained |
| Repeated normalized sentence occurrences | 976 | 939 | reduced without randomization |
| `байж болно` | 19 | 0 | all 19 were recurring-behavior boilerplate in this corpus |
| `болж болно` | 19 | 0 | all 19 were recurring-behavior boilerplate in this corpus |
| `энэ тайлан` | 9 | 0 | ordinary self-reference removed |
| `тайлангаар` | 4 | 0 | scope disclosure retained without report self-reference |
| `асуумж дангаараа` | 0 | 0 | absent from rendered public output |
| `persona`, `virtual user`, `fixture`, `QA`, standalone `U01`–`U15` | 0 | 0 | public invariant |

Repeated pattern titles and evidence-driven conclusions remain when inputs genuinely support the same conclusion. The regression allows a small explicit set of structural field labels and repeated canonical pattern titles; it rejects known generic scaffolding and unexplained long repetitions above the corpus threshold.

## Canonical V8 headings

Current/new V8 commercial reports now use these deterministic sentence-case headings when applicable:

- `Ерөнхий зураг`
- `Танд нөлөөлж буй хэв маягууд`
- `Хэв маягуудын уялдаа`
- `Нөлөө нь хүчтэй болдог нөхцөл`
- `Хэв маяг бүрийг удирдах арга`
- `Хаанаас эхэлж, ямар дарааллаар ажиллах вэ?`
- `Эхний 3 алхам`
- `Төлөвлөгөө алдагдсан үед хэрхэн үргэлжлүүлэх вэ?`
- `Хэзээ мэргэжлийн хүнтэй зөвлөлдөх вэ?`

Neutral V8 reports use `Ерөнхий зураг`, `Танд байгаа хамгаалах хүчин зүйлс`, `Энэ тестээр юуг дүгнэж болохгүй вэ?`, and `Нэг зүйлийг өөрчлөхгүйгээр ажиглах арга` for their neutral-only sections. Historical V7 continues to use its previous heading path.

## Manual review samples

### U01 — low/no problematic-pattern report

Before headings:

> ТАНЫ ХАРИУЛТААР ЮУ ХАРАГДАВ?<br>
> ОДОО ТАНД ТҮШИГ БОЛОХ ЗҮЙЛС<br>
> ЭНЭ ТЕСТЭЭР ЮУГ ДҮГНЭЖ БОЛОХГҮЙ ВЭ?<br>
> НЭГ ЗҮЙЛИЙГ ӨӨРЧЛӨХГҮЙГЭЭР АЖИГЛАХ АРГА<br>
> ТӨЛӨВЛӨГӨӨ АЛДАГДСАН ҮЕД ХЭРХЭН ҮРГЭЛЖЛҮҮЛЭХ ВЭ?<br>
> ХЭЗЭЭ МЭРГЭЖЛИЙН ХҮНТЭЙ ЗӨВЛӨЛДӨХ ВЭ?

After headings:

> Ерөнхий зураг<br>
> Танд байгаа хамгаалах хүчин зүйлс<br>
> Энэ тестээр юуг дүгнэж болохгүй вэ?<br>
> Нэг зүйлийг өөрчлөхгүйгээр ажиглах арга<br>
> Төлөвлөгөө алдагдсан үед хэрхэн үргэлжлүүлэх вэ?<br>
> Хэзээ мэргэжлийн хүнтэй зөвлөлдөх вэ?

Before:

> Ажиглалт өдөр бүр яг ижил хэрэгжихгүй байж болно. Нэг удаа тэмдэглэж чадаагүй нь бүх ажиглалт хэрэггүй болсон гэсэн үг биш.

After:

> Ажиглалт өдөр бүр яг ижил байх шаардлагагүй. Нэг удаа тэмдэглэж чадаагүй нь бүх ажиглалт хэрэггүй болсон гэсэн үг биш.

The protective statements remain evidence-controlled and unchanged:

> Өлсөх мэдрэмжээ анзаарах, цадсанаа мэдээд зогсох болон идэх хэмжээгээ тохируулах нь ашиглаж болох давуу тал байна.<br>
> Стрессийн үеийн идэх хүсэл, хоолтой холбоотой орчны нөлөө болон нойрны хугацаа, чанар нь гол саад болж харагдсангүй.<br>
> Өдрийн хөдөлгөөний түвшин болон тогтвортой хоолны хэмнэл нь өдөр тутмын төлөвлөгөөнд ашиглаж болох давуу тал байна.

### U06 — multi-factor report

Before headings:

> ТАНЫ ҮР ДҮНГИЙН ТОЙМ<br>
> ТАНД НӨЛӨӨЛЖ БУЙ ХЭВ МАЯГУУД<br>
> ХЭВ МАЯГУУДЫН УЯЛДАА<br>
> ЯМАР ҮЕД ИЛҮҮ ХҮЧТЭЙ БОЛДОГ ВЭ?<br>
> ХЭВ МАЯГ БҮРТ ЯАЖ ХАНДАХ ВЭ?<br>
> ХААНААС ЭХЭЛЖ, ЯМАР ДАРААЛЛААР АЖИЛЛАХ ВЭ?<br>
> ЭХЭЛЖ ХЭРЭГЖҮҮЛЭХ 3 АЛХАМ<br>
> ТӨЛӨВЛӨГӨӨ АЛДАГДСАН ҮЕД ХЭРХЭН ҮРГЭЛЖЛҮҮЛЭХ ВЭ?

After headings:

> Ерөнхий зураг<br>
> Танд нөлөөлж буй хэв маягууд<br>
> Хэв маягуудын уялдаа<br>
> Нөлөө нь хүчтэй болдог нөхцөл<br>
> Хэв маяг бүрийг удирдах арга<br>
> Хаанаас эхэлж, ямар дарааллаар ажиллах вэ?<br>
> Эхний 3 алхам<br>
> Төлөвлөгөө алдагдсан үед хэрхэн үргэлжлүүлэх вэ?

Before:

> Энэ байдал өдөр бүр ижил биш байж болно.<br>
> Ийм үед идэх хэмжээгээ тайван тохируулахад хэцүү болж болно.<br>
> Хоолны зай уртсахад өлсөлт хүчтэй болж, цадсанаа анзаарах эсвэл хэмжээгээ тохируулахад илүү хэцүү болж болно.<br>
> Жин хасах төлөвлөгөө өдөр бүр яг ижил хэрэгжихгүй байж болно.

After:

> Энэ байдал өдөр бүр ижил давтагддаггүй.<br>
> Ийм үед идэх хэмжээгээ тайван тохируулах хэцүүддэг.<br>
> Хоолны зай уртсахад өлсөлт хүчтэй болж, цадсанаа анзаарах эсвэл хэмжээгээ тохируулах илүү хэцүүддэг.<br>
> Жин хасах төлөвлөгөө өдөр бүр яг ижил хэрэгждэггүй.

Generic interaction scaffolding is now tied deterministically to the actual pair. Example:

> Хоолны зай уртсах нөхцөлд орчны дохионоос идэх хүсэл төрөх байдал давхцаж байгаа эсэхийг тэмдэглэж, нэг удаад нэг бэлтгэсэн үйлдэл хэрэглэн аль өөрчлөлт өдөр тутмын амьдралд илүү тохирч байгааг тусад нь ажиглана.

### U08 — maintenance-gap report

Before:

> Ядарсан үед хоол бэлтгэх, урьдчилан сонгох нь хэцүү болж, төлөвлөгөөгөө тогтвортой үргэлжлүүлэхэд саад болж болно.<br>
> Ядарсан өдрийн шийдвэрийн ачааллыг багасгах нь энэ тайланд харагдсан нойр, хуваарийн холбоотой хамгийн шууд нийцнэ.

After:

> Ядарсан үед хоол бэлтгэх, урьдчилан сонгох нь хэцүүдэж, төлөвлөгөөгөө тогтвортой үргэлжлүүлэхэд саад болдог.<br>
> Ядарсан өдрийн шийдвэрийн ачааллыг багасгах нь таны хариултад харагдсан нойр, хуваарийн холбоотой хамгийн шууд нийцнэ.

### U13 — eating-behavior safety

Before and after are byte-identical:

> Мэргэжлийн хүнтэй эхэлж зөвлөлдөөрэй<br>
> Идсэн хоолоо нөхөх эсвэл жин нэмэхээс сэргийлэх зорилготой үйлдэл сүүлийн 28 хоногт гарсан тул жин хасах төлөвлөгөө эхлэхээс өмнө эмч эсвэл хооллолтын эмгэгийн чиглэлээр ажилладаг мэргэжилтэнтэй зөвлөлдөөрэй.<br>
> Мэргэжлийн тусламж авах

### U14 — self-harm safety

Before and after are byte-identical:

> Яаралтай тусламж аваарай<br>
> Та яг одоо өөртөө хор хүргэж болзошгүй гэж мэдэрч байвал ганцаараа бүү үлдээрэй. Итгэдэг хүнтэйгээ хамт байж, 103 дугаарт залгах эсвэл хамгийн ойрын яаралтай тусламжийн тасагт нэн даруй очоорой.<br>
> Яаралтай тусламжтай холбогдох

### U15 — acute-medical safety

Before and after are byte-identical:

> Биеийн яаралтай шинжийг эхэлж шалгуулаарай<br>
> Ухаан санаа будилах, ухаан балартах эсвэл бие огцом муудах шинж илэрсэн бол 103 дугаарт залгах эсвэл хамгийн ойрын яаралтай тусламжийн тасагт нэн даруй очоорой.<br>
> Яаралтай тусламжтай холбогдох

## Semantic invariants

| Invariant | Result | Evidence |
|---|---|---|
| Same 15 routes and report modes | PASS | fixed corpus fingerprint and 15-user sequential browser test |
| Same core pattern IDs and counts | PASS | per-persona baseline fingerprints |
| Same interaction IDs | PASS | per-persona baseline fingerprints |
| Same recommendation IDs and pattern bindings | PASS | management, combined-pair, and priority fingerprints |
| Household context does not change core recommendation | PASS | U09/U10 core fingerprints remain equal |
| Body/function context remains non-diagnostic and non-counted | PASS | contextual-factor and modifier assertions; U02/U12 core fingerprints remain equal |
| Safety route/copy/urgency | PASS | exact route and `ROUTE_COPY` deep equality |
| Safety commerce bypass | PASS | no full report, payment, entitlement, price, or QPay surface for U13–U15 |
| Deterministic payload and rendering | PASS | two independent generations deep-equal and render byte-equal for all 15 |
| Price/payment/QPay/Meta behavior | PASS | no authority files changed; full unit, contract, package, and E2E gates pass |

## Historical snapshot compatibility

- `tests/report-snapshot-versioning.test.js`: PASS
- `tests/report-builder-v6-snapshot-compat.test.js`: PASS
- `tests/report-builder-v7-review-regressions.test.js`: PASS
- Historical V7 exact management heading remains `ХЭВ МАЯГ БҮРИЙН НӨЛӨӨГ ХЭРХЭН УДИРДАХ ВЭ?`.
- No migration or historical regeneration logic was added.

## Test results

- `node --check app.js`: PASS
- `node tests/report-editorial-v8.test.js`: PASS
- `node tests/report-natural-mongolian-canonicalization.test.js`: PASS
- `node tests/report-snapshot-versioning.test.js`: PASS
- `node tests/report-builder-v6-snapshot-compat.test.js`: PASS
- `node tests/report-builder-v7-review-regressions.test.js`: PASS
- `node tests/full-report-core-customer-value.test.js`: PASS
- `npm test`: PASS
- `npm run test:e2e`: PASS, 32/32 including exact 15-user sequential browser flow
- `npm run test:contracts`: PASS
- `npm run verify:production-package`: PASS
- `npm run build:staging`: PASS
- `npm run verify:staging-package`: PASS

## Release boundary

`NOT MERGED / NOT DEPLOYED / PRODUCTION UNCHANGED`

No production write, migration, historical report regeneration, merge, or deployment was performed.
