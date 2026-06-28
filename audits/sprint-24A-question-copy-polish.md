# Sprint 24A - Question Copy Polish Audit

## Source

Internal human testing feedback and the 10-person report PDF audit showed that the assessment should feel warmer and easier to answer before the next report-voice rewrite pass.

## Scope

This patch only updates visible question, answer, start-flow, free-text helper, and navigation-adjacent copy. It does not change scoring, tags, mechanism keys, safety thresholds, QPay/payment behavior, or report voice.

## Question Wording Issues Fixed

- Replaced abstract weight-change wording with a clearer life-change question.
- Replaced "үргэлжлэхээ больсон" user-facing phrasing with the warmer "үргэлжлүүлэхэд хэцүү болсон".
- Replaced "Төлөвлөгөө бага зэрэг алдагдсаны дараа..." with a more natural "Төлөвлөгөө жаахан зөрөхөд..." phrasing.
- Rewrote satiety wording so users answer whether fullness is easy to notice, not whether they are "good" at it.
- Rewrote hidden-function and after-eating questions to make the timing clearer.
- Replaced "Хоол холдоход дараахаас..." with "Хоол холдоход дараах шинжээс...".
- Replaced the visible sleep-apnea option containing "тасалдах" with a clearer "амьсгал зогсох мэт" phrase while preserving the old scoring alias.
- Replaced free-text summary helper copy with a simple saved-and-continue message.

## Before / After Examples

| Before | After |
| --- | --- |
| Жин өөрчлөгдөх үе ямар амьдралын өөрчлөлттэй давхацсан бэ? | Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ? |
| Өмнө туршсан аргуудаас аль нь эхэндээ болж байгаад дараа нь үргэлжлэхээ больсон бэ? | Өмнө туршсан аргуудаас аль нь эхэндээ болж байгаад дараа нь үргэлжлүүлэхэд хэцүү болсон бэ? |
| Та хоолны дараа цадсан мэдрэмжээ хэр сайн мэдэрдэг вэ? | Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ? |
| Төлөвлөгөө бага зэрэг алдагдсаны дараа танд ихэвчлэн юу бодогддог вэ? | Төлөвлөгөө жаахан зөрөхөд таны толгойд ихэвчлэн юу орж ирдэг вэ? |
| Хоол холдоход дараахаас илэрдэг үү? | Хоол холдоход дараах шинжээс илэрдэг үү? |

## Tests Added / Updated

- Added `tests/question-copy-polish.test.js`.
- Added the new test to `tests/run-all.js`.
- Updated `tests/internal-human-feedback-copy-ux.test.js` for the new copy and free-text confirmation.
- The new test checks visible question text/options and rendered stage/diary screens for public-facing English/engine terms and ambiguous wording.

## Validation Results

- `node --check app.js` - PASS
- `node --check scripts/run-virtual-user-audit.mjs` - PASS
- `node scripts/run-virtual-user-audit.mjs --assert-clean` - PASS
  - 10 PASS
  - 0 PARTIAL
  - 0 FAIL
  - P0/P1/P2 = 0/0/0
  - readinessScore = 96
  - recommendation = READY FOR INTERNAL HUMAN TESTING
- `npm test` - PASS
- `git diff --check` - PASS

## Remaining Concerns

- Internal scoring aliases and mechanism keys still contain English terms for backward compatibility. They are not rendered as public question text.
- Report voice was intentionally not rewritten in this sprint.

## Recommendation

READY FOR REPORT VOICE REWRITE
