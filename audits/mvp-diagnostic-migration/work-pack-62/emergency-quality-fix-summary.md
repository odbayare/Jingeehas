# WP62 Emergency Quality Fix Summary

## Original owner complaint

The owner completed a real manual test for the paid 9,900₮ one-time weight report and found the result unacceptable for a paid product. The highest-priority complaint was that a male user received menstrual/cycle questions. The paid report also felt unclear, repetitive, mixed with teaser/upsell layers, and weak for the price.

## Failures found

- Male users could receive female-specific menstrual/cycle context through generic gating.
- Unknown-gender users could be exposed to highly gender-specific questions before relevance was established.
- Some question copy was too abstract or vague for a fast paid diagnostic flow.
- The one-time paid report mixed paid report content, first-preview language, deep-report labels, 7-day upsell copy, and report delivery copy.
- Safety/body-check language could overpower the actual report and make ordinary social/emotional eating scenarios feel like body-risk reports.
- Copy/print actions existed but needed to be anchored inside one clear paid report structure.

## Fixes made

- Added gender-safe question and option filtering for male, female, and unknown-gender paths.
- Kept female-specific menstrual/cycle, pregnancy, postpartum, breastfeeding, menopause, and PMS questions female-only and relevance-gated.
- Cleaned the one-time paid report into one coherent paid report headed `Таны тайлан бэлэн боллоо`.
- Removed 7-day refinement CTA and free teaser/runtime visible-surface injection from the one-time paid report.
- Added short report delivery actions under `7. Тайлангаа хадгалах`.
- Restored clear action labels: `Тайлан хуулж авах` and `Хэвлэх / PDF хадгалах`.
- Tightened one-time report safety routing so body caution appears only when body-risk evidence exists.
- Narrowed medication/body-risk text detection so unrelated words like `эвгүй` do not trigger medical caution.

## Tests added

- `tests/gender-gating.test.js`
- `tests/report-safety-routing.test.js`
- `tests/paid-report-quality.test.js`
- `tests/owner-weekend-social-scenario.test.js`

## What was intentionally not changed

- Price remains `9,900₮`.
- Product code remains `WEIGHT_TEST_ONE_TIME`.
- QPay create endpoint remains unchanged.
- QPay check endpoint remains unchanged.
- Paid-first gate remains in place.
- Payment confirmation logic was not changed.
- Backend/QPay files were not changed.
- The protected folder `audits/sprint-36-paid-depth-prototype/` was not touched.

## Remaining risks

- Owner should still manually retest the full production payment path before ads begin.
- The report is improved for the weekend-social scenario, but more real user scenarios should be reviewed before scaling traffic.
- Copy clarity is materially better, but additional owner review may still find wording that should be simplified.
- Safety content is now shorter in normal reports, but any explicit body-risk answer should still be reviewed carefully in manual QA.

## Recommendation

READY FOR OWNER RETEST
