# Internal Human Feedback 01

## Summary

One internal tester completed the Weight Test assessment and submitted feedback after reading the report.

Result quality was usable, but the tester flagged copy and UX friction:

- Intro and early explanation required too much rereading.
- Tone needed to feel warmer, clearer, and more personal.
- Free-text questions showed vague machine-like summaries.
- Remaining English/engine wording appeared in the question/report flow.
- `тасарсан` was ambiguous.
- `Хоол удахад` sounded awkward.
- Safety compensation wording needed softer but still clear Mongolian.
- Back navigation needed to be consistently available after the first question.

## Changes Made

- Rewrote landing and one-time start copy with a clearer reassurance block:
  - no right/wrong answers
  - no need to over-explain
  - questions are for seeing repeated conditions, not blame
- Updated first profile questions to be warmer and easier to answer.
- Replaced `Богино reflection` with `Богино тайлбар`.
- Replaced vague free-text summary behavior with:
  - empty/short text: no engine summary box
  - saved text: `Тайлбар хадгалагдлаа`
  - human confirmation copy instead of `Бид таны хариултыг ингэж ойлголоо`
- Replaced `тасарсан` question wording with `үргэлжлэхээ больсон`.
- Replaced `Хоол удахад` / `Хоол удах үед` visible wording with `Хоол холдоход` / `Хоол холдох үед`.
- Rewrote the compensation safety question:
  - `Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?`
- Removed visible `Feedback export` copy from internal UI and replaced it with `Саналын экспорт`.
- Back button is hidden on the first question and consistently visible from question 2 onward for stage and diary flows.
- Added regression coverage in `tests/internal-human-feedback-copy-ux.test.js`.

## Tests Run

- `node --check app.js` - pass
- `node --check scripts/run-virtual-user-audit.mjs` - pass
- `node scripts/run-virtual-user-audit.mjs --assert-clean` - pass
  - 10 PASS
  - 0 PARTIAL
  - 0 FAIL
  - P0/P1/P2 = 0
  - readiness score = 96
- `npm test` - pass

## Remaining Concerns

- The internal tester still reported that the report felt too AI-like. This sprint removes the most obvious engine wording and confusing confirmation UX, but a deeper report voice rewrite may still be needed after the next human test.
- Some internal mechanism names and test fixtures still use English terms by design. The added test focuses on rendered question/free-text/internal tester UI.

## Recommendation

Ready for another internal human test on a fresh preview deploy. Do not production deploy yet.
