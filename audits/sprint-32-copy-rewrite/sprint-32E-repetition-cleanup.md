# Sprint 32E — Repetition Cleanup and Final User-facing PDF Polish

Date: 2026-06-30 12:07:13 +08

## Owner Review Issues

- User-facing PDF title appeared duplicated.
- User-facing export kept a redundant standalone `Тайлан` heading after `Тайлан N`.
- User 04 repeated the same hunger-safety sentence across multiple sections.
- User 05 repeated the same self-neglect/reward sentence across multiple sections.
- Owner-approved sleep/coffee wording needed to remain unchanged.

## Repetition Cleanup Applied

- User-facing export title is now:
  `Жин хасалтын гүн зураглал — хэрэглэгчийн унших 10 тайлан`
- PDF render skips the Markdown title block when it matches the PDF title, so the title appears once.
- User-facing export removes redundant standalone `Тайлан` lines while keeping `Тайлан 1`, `Тайлан 2`, etc.
- User 04 keeps the canonical hunger-safety sentence only as `Таны гол гацдаг мөч`:
  `Удаан юм идээгүй өдөр орой гэнэт өлсөж байгаагаа анзаардаг.`
- User 04 supporting sections now use separate owner-approved support lines about meal spacing, evening hunger, and fear of later hunger.
- User 05 keeps the canonical self-neglect/reward sentence only as `Таны гол гацдаг мөч`:
  `Өдөржин өөрийгөө хойш тавьсан өдөр орой амттай зүйл өөртөө өгч байгаа жижигхээн шагнал шиг л санагддаг.`
- User 05 supporting sections now use separate owner-approved support lines about own meals/rest being last, small attention, and brief pleasant relief.
- User 07 sleep/coffee wording remains:
  `Өдрийн эхний хоолоо тогтмол болго.`
  `Өдрийн сүүлийн кофегоо хэзээ уухаа тогтоо.`
  `Орой 10 минут тайвшрах хугацаа гарга.`

## Validation Results

- `node --check app.js` passed.
- `node --check scripts/run-virtual-user-audit.mjs` passed.
- `node --check scripts/export-virtual-human-retest.mjs` passed.
- `node scripts/run-virtual-user-audit.mjs --assert-clean` passed: 10 PASS, 0 PARTIAL, 0 FAIL, readiness 96.
- `npm test` passed.
- `node scripts/export-virtual-human-retest.mjs` regenerated user-facing and internal audit outputs.
- User-facing PDF text extraction showed:
  - final title count: 1
  - old title count: 0
  - User 04 canonical hunger sentence count: 1
  - User 05 canonical reward sentence count: 1
- User-facing PDF PNG render checked pages 1, 4, and 5 with no visible duplicate title, redundant `Тайлан` header, or layout break.
- User-facing Markdown/PDF banned phrase scan passed.

## Remaining Concerns

- Human testing remains on hold until owner final review approves the final user-facing PDF voice.
- No scoring, mechanism detection, safety routing, QPay, coach, or payment logic was changed.

## Recommendation

READY FOR OWNER FINAL REVIEW
