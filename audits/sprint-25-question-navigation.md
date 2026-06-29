# Sprint 25 - Question Navigation Audit

## Human Feedback Source

Internal testing showed that assessment navigation felt too fast and not controlled enough on mobile. Testers wanted to choose an answer, review the selected state, then explicitly press `Үргэлжлүүлэх`. They also wanted the back button to be easy to find and each new question to start at the top of the page.

## Navigation Issues Fixed

- Added a central `scrollToTopAfterRender()` helper.
- Added explicit scroll-to-top behavior for question transitions, view changes, report openings, feedback thank-you, and related navigation.
- Kept answer selection on the same question. Selection updates answer state and selected styling only.
- Moved question Back controls to the top-left of the question panel for Stage 1 and daily diary screens.
- Preserved answer state when moving back and editing previous answers.
- Kept free-text confirmation copy human-readable and did not restore engine wording.

## Before / After

| Area | Before | After |
| --- | --- | --- |
| Answer selection | Selection updated the answer and re-rendered the current screen, but navigation affordance was less explicit. | Selection still updates only the current answer; user advances with `Үргэлжлүүлэх`. |
| Back button | Back appeared in the lower action row on question screens. | Back appears top-left above the question title from the second question onward. |
| Scroll | New questions could keep the previous scroll position. | Next/back/view transitions scroll to top immediately. |
| Free-text | Sprint 23/24A human-readable saved message existed. | Human-readable saved message remains unchanged. |

## Tests Added

- Added `tests/question-navigation.test.js`.
- Added it to `tests/run-all.js`.

Coverage includes:

- single choice does not auto-advance
- multiple choice does not auto-advance
- scale answer does not auto-advance
- text input does not auto-advance
- `Үргэлжлүүлэх` advances
- top-left `Буцах` appears after the first question
- back preserves and allows editing answers
- next/back/feedback thank-you transitions call `window.scrollTo({ top: 0, left: 0, behavior: "auto" })`
- free-text saved message remains human-readable and does not include `Reflection` or `context`
- Mode 4 still suppresses commercial CTA and ordinary experiment

## Validation Results

- `node --check app.js` - PASS
- `node --check scripts/run-virtual-user-audit.mjs` - PASS
- `node scripts/run-virtual-user-audit.mjs --assert-clean` - PASS
  - 10 PASS
  - 0 PARTIAL
  - 0 FAIL
  - P0/P1/P2 = 0/0/0
  - readinessScore = 96
- `npm test` - PASS
- `git diff --check` - PASS

## Manual Local Smoke

Local URL: `http://127.0.0.1:4177/?internalTest=1`

- Stage question loaded at top of page.
- `Үргэлжлүүлэх` moved from intro to the age question and scroll position was `0`.
- Gender answer selection stayed on the same question and showed selected state.
- `Үргэлжлүүлэх` moved to the next question and scroll position was `0`.
- Top-left `Буцах` returned to the previous question and preserved the selected answer.
- Free-text question accepted typed text without auto-advancing.
- Free-text `Үргэлжлүүлэх` moved to the next question and scroll position was `0`.
- Daily diary next/back behavior is covered by `tests/question-navigation.test.js`.

## Remaining Concerns

- None currently identified.

## Recommendation

READY FOR NEW INTERNAL TESTER LINK
