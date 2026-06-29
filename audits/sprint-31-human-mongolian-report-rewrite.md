# Sprint 31 - Full Human Mongolian Report Rewrite

Date: 2026-06-30

## Scope

Sprint 31 rewrote the public report voice only. The work focused on:

- `Товч хариу`
- `Дэлгэрэнгүй тайлан`
- `Гол зураг`
- `Тэр үед хоол танд юу өгч байсан байж болох вэ?`
- `Давтагддаг тойрог`
- `Үүнийг юунаас харсан бэ?`
- `Асуудал яг юу биш вэ?`
- `Одоогоор болгоомжлох зүйлс`
- `Эхний жижиг өөрчлөлт`
- `14 хоногийн туршилт`
- `7 хоногоор нарийвчлах`
- menstrual-cycle report notes
- PDF/Markdown export wording

No scoring, safety routing, payment, coach workflow, QPay, or mechanism detection logic was changed.

## Rewrite Direction

The report now uses shorter, warmer, more direct Mongolian. It avoids engine-like statements and explains the user's situation in lived language:

- "Орой болоход хоол бодох тэнхээ үлдэхгүй байна."
- "Тэр үед хоол зүгээр нэг хоол биш байсан байж болно."
- "Энэ тайлбар таны өгсөн мэдээлэл, бичсэн богино тайлбар дээр тулгуурласан."
- "Хэрвээ үүнийг илүү бодит өдөр тутмын түвшинд ялгахыг хүсвэл..."

## Report Areas Changed

- Replaced abstract mechanism labels with plain user-facing descriptions.
- Rewrote report voice library openings for executive load, stress regulation, control-collapse, hunger-safety, reward-deficit, cue/environment, circadian, and menstrual-cycle context.
- Reworked evidence-note copy to avoid overconfident or source-mechanical phrasing.
- Reworked 7-day refinement bullets so they describe what the diary clarifies in natural language.
- Rewrote menstrual-cycle note to stay contextual, non-diagnostic, and non-deterministic.
- Updated export fallback for safety-suppressed reports so Mode 4 no longer uses technical "card suppressed" language.
- Removed markdown-heading markers from extracted report body text in the virtual human retest export.

## Tests Updated

- `tests/result-comprehension.test.js`
- `tests/report-voice-rewrite.test.js`
- `tests/report-bible-sections.test.js`
- `tests/sample-preview-choice-clarity.test.js`
- `tests/menstrual-cycle-context.test.js`
- `tests/deep-mongolian-copy-rewrite.test.js`
- `tests/public-language-purge.test.js`

The tests now assert the new human Mongolian report copy and guard against the old public report wording.

## Regenerated Outputs

- `audits/virtual-users-10/`
- `audits/sprint-30-virtual-human-retest/VIRTUAL_HUMAN_REPORTS.md`
- `audits/sprint-30-virtual-human-retest/WEIGHT_TEST_10_VIRTUAL_HUMAN_RETEST.pdf`
- `audits/sprint-30-virtual-human-retest/raw/*.json`

## Validation Results

- `node --check app.js`: pass
- `node --check scripts/run-virtual-user-audit.mjs`: pass
- `node scripts/run-virtual-user-audit.mjs --assert-clean`: pass, 10 PASS, 0 PARTIAL, 0 FAIL, P0/P1/P2 = 0, readiness 96
- `npm test`: pass
- `node --check scripts/export-virtual-human-retest.mjs`: pass
- `node scripts/export-virtual-human-retest.mjs`: pass, 10 PASS, 0 PARTIAL, 0 FAIL, P0/P1 = 0, P2 = 1
- Sprint 31 banned phrase scan over regenerated virtual human retest public text: clean

## Remaining Concerns

- The virtual retest still marks P2 = 1 because detailed report sections can feel long. This is a polish concern, not a safety or comprehension blocker.
- Per Sprint 31 instruction, human testing, coach testing, public traffic, and paid traffic remain on hold until owner review and explicit approval.

## Recommendation

READY FOR OWNER COPY REVIEW.

Do not deploy. Do not enable QPay. Do not resume human/coach/public testing until owner approval.
