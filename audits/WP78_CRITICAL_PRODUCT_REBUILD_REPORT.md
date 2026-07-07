# WP78 Critical Product Rebuild Report

## 1. Executive summary

WP78 rebuilt the one-time Weight Loss Test question bank and paid report inference so the product asks more concrete questions, covers alcohol/tobacco/movement context, and renders a more useful paid report instead of repeating answers or generic mechanism labels.

No production deploy was performed as part of this source change.

## 2. Owner QA failure summary

Owner QA identified that the previous question bank and report could feel too abstract, miss common real-life factors, and return thin inference. WP78 addresses those issues by adding concrete prior-attempt, alcohol, tobacco, movement, social, sleep, cycle, medication/body-change, cue, and restriction handling.

## 3. Approved question wording implemented

Implemented approved wording for prior attempts, hardest follow-up, deviation response, pre-unplanned-eating signals, and hunger/body-signal phrasing. The question flow now uses plain wording such as:

- "Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?"
- "Туршиж үзсэн аргуудаас аль нь хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан бэ?"
- "Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?"
- "Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?"

## 4. New согтууруулах ундаа questions

Added stage-one alcohol context questions for frequency, eating changes during use, and next-day effects. The report can now explain the alcohol evening/next-day loop without using the older "архи" wording in product-authored copy.

## 5. New tobacco questions

Added tobacco context questions for current/previous smoking and appetite/coffee/stress relationships. Report copy explicitly says tobacco is not a weight-control recommendation.

## 6. New movement questions

Added movement feasibility and movement barrier questions. Movement answers are treated as context, not as a shame or discipline signal.

## 7. Report inference changes

The one-time paid report now builds WP78 clusters from answers, including alcohol, restriction/collapse, social pressure, medication/body change, stress, reward, cycle, cue, circadian/sleep, shift work, fatigue/executive load, tobacco, and movement context.

Inference now uses answer receipts and supporting factors rather than only a single mechanism label.

## 8. Report structure changes

The one-time paid report now uses eight sections:

1. Энэ тайлан юунд тулгуурласан бэ?
2. Таны гол давтагдаж буй механизм
3. Давхар нөлөөлж байгаа хүчин зүйлс
4. Яагаад энэ давтагдаж байж болох вэ?
5. Одоогоор юуг хийхгүй байх вэ?
6. Авч хэрэгжүүлж болох эхний алхам
7. 7-14 хоногийн туршилт
8. Аюулгүй байдлын сануулга

The delivery area remains "Тайлангаа хадгалах" and is not numbered as a report section.

## 9. Tests added/updated

Added:

- `tests/wp78-question-bank-coverage.test.js`
- `tests/wp78-report-inference-quality.test.js`

Updated existing tests for the new WP78 section structure, question wording, safety copy, report voice, scenario focus, and public-language expectations.

## 10. Validation results

Passed:

- `node --check app.js`
- `node tests/wp78-question-bank-coverage.test.js`
- `node tests/wp78-report-inference-quality.test.js`
- `node tests/wp75-safety-copy-polish.test.js`
- `node tests/wp73-report-voice-copy-cleanup.test.js`
- `npm test`

`npm test` passed all registered tests through `tests/run-all.js`.

## 11. Remaining issues

No blocking source/test issue remains after validation.

Generated audit outputs changed during test execution and were restored before staging.

## 12. Recommendation for next owner QA draft

Use a QA-only draft deploy with coming-soon disabled only in the publish copy and a QA payment bypass only in the publish copy. Owner QA should test the one-time paid report for alcohol, tobacco, movement, sleep/circadian, social pressure, body-signal, medication/body-change, cue, cycle, and collapse scenarios.

## 13. Guard confirmations

- Repo source keeps `WEIGHT_TEST_COMING_SOON_MODE = true`.
- Repo source keeps `9,900₮`.
- Repo source keeps `WEIGHT_TEST_ONE_TIME`.
- QPay/payment production source was not converted to a bypass.
- No production deploy, DNS, Namecheap, Netlify setting, or QPay setting change was performed.
- Protected untracked audit/editor folders remained untracked and were not staged.
