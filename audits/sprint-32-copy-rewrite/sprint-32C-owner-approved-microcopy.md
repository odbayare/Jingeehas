# Sprint 32C — Owner-approved Microcopy Fixes

Date: 2026-06-30

## Status

Recommendation: READY FOR OWNER FINAL COPY REVIEW

Human testing: HOLD
Coach testing: HOLD
Public/paid traffic: HOLD
Deploy: not run
QPay: disabled

## Owner Rejected Prior Phrasing

The owner rejected several lines as artificial or unnatural:

- `миний юм`
- `ганц жижиг баяр`
- `өөртөө өгөх нэг жижиг зүйл болдог`
- `биеэ зөөлөн сонсох`
- `бие, сэтгэлээ зөөлөн анзаарах`
- `кофеины хил`
- `кофеин уух цагийн хязгаар`
- `орой унтраах`

No new alternatives were invented for the requested replacements.

## Exact Replacements Applied

### Self-neglect / Reward

Canonical copy:

`Өдөржин өөрийгөө хойш тавьсан өдөр орой амттай зүйл өөртөө өгч байгаа жижигхээн шагнал шиг л санагддаг.`

Applied to:

- simple result
- report voice opening
- food-function intro
- user-facing Markdown/PDF export

### Menstrual-cycle Wording

Canonical copy:

`Тухайн өдөр бие, сэтгэлээ анзаарах`

Applied to:

- menstrual-cycle report voice needs list
- user-facing Markdown/PDF export

### Sleep / Coffee Wording

Canonical split copy:

`Өдрийн эхний хоолоо тогтмол болго. Өдрийн сүүлийн кофегоо хэзээ уухаа тогтоо. Орой 10 минут тайвшрах хугацаа гарга.`

Applied to:

- simple result first step
- circadian report first step
- 14-day experiment step
- user-facing Markdown/PDF export

Also replaced abstract public wording with coffee wording where it appeared in report copy.

## Sprint 32B Cleanup Preserved

User-facing PDF/Markdown was checked for absence of:

- `Weight Test - хэрэглэгчид харагдах`
- `бие яараад`
- `Дэлгэрэнгүй тайлан харах`
- `Санал илгээх`
- `Саналын экспорт`
- `Сонголт руу буцах`
- `Шинээр эхлэх`
- standalone `7 хоногоор нарийвчлах`
- `Route`
- `Verdict`
- `Checklist`
- `Selected answer summary`

## Validation Results

Commands run:

- `node --check app.js`
- `node --check scripts/run-virtual-user-audit.mjs`
- `node --check scripts/export-virtual-human-retest.mjs`
- `node scripts/run-virtual-user-audit.mjs --assert-clean`
- `npm test`
- `node scripts/export-virtual-human-retest.mjs`
- user-facing PDF/Markdown rejected phrase scan
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

Test suite:

- `npm test`: all tests passed

## Remaining Concerns

P2 remains for detailed-report length polish. It is not related to these microcopy fixes.

## Recommendation

READY FOR OWNER FINAL COPY REVIEW
