# Seven-Day Feature Removal Audit

## 2026-07-16 regression repair

An active landing mini-stat still promoted `Орой бүр 3–5 минут` and `7 хоногийн богино тэмдэглэл` after the earlier PASS. That residual promotion was removed. The earlier guard did not cover this phrase; it now explicitly catches `7 хоногийн` and `7 өдрийн` short-diary variants and an evening-effort label paired with a diary or removed seven-day product concept.

## Decision

The seven-day assessment product, its upgrade path, tracking flow, reports, entitlements, analytics scenarios, and rendered-copy coverage were removed. The one-time assessment and its 9,900₮ QPay flow remain. A narrow legacy-state migration discards obsolete local fields and redirects obsolete views safely.

## Start-state inventory

- Source snapshot: `/tmp/seven-day-removal-start.txt`
- Matching occurrences reviewed: 3056
- REGENERATED_ARTIFACT: 1867
- HISTORICAL_OR_DOCUMENTATION_REVIEWED: 347
- REMOVED_EXTRACTION_OR_GENERATION: 44
- REMOVED_PRODUCTION: 194
- REMOVED_OR_REWRITTEN_TEST: 604

Each pre-removal match is classified below. This file is the sole detailed historical evidence register for removed feature identifiers and wording.

| # | Classification | Pre-removal occurrence |
| -: | --- | --- |
| 1 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:14:\| SEVEN_DAY_PAYWALL \| renderSevenDayPaywall \| seven-day-paywall \| FULL_SURFACE \| 16 \| YES \|  \| |
| 2 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:15:\| SEVEN_DAY_START \| renderSevenDayStart \| seven-day-start \| FULL_SURFACE \| 11 \| YES \|  \| |
| 3 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:16:\| DIARY_HOME \| renderDiaryHome \| diary-home-zero \| FULL_SURFACE \| 9 \| YES \|  \| |
| 4 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:17:\| DIARY_HOME \| renderDiaryHome \| diary-home-partial \| FULL_SURFACE \| 9 \| YES \|  \| |
| 5 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:18:\| DIARY_HOME \| renderDiaryHome \| diary-home-complete \| FULL_SURFACE \| 9 \| YES \|  \| |
| 6 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:19:\| DIARY_QUESTION \| renderDiary using diaryQuestionIndex \| diary-single \| FULL_SURFACE \| 11 \| YES \|  \| |
| 7 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:20:\| DIARY_QUESTION \| renderDiary using diaryQuestionIndex \| diary-multi \| FULL_SURFACE \| 18 \| YES \|  \| |
| 8 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:21:\| DIARY_QUESTION \| renderDiary using diaryQuestionIndex \| diary-scale \| FULL_SURFACE \| 18 \| YES \|  \| |
| 9 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:22:\| DIARY_QUESTION \| renderDiary using diaryQuestionIndex \| diary-text \| FULL_SURFACE \| 9 \| YES \|  \| |
| 10 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:23:\| DIARY_CONFIRMATION \| renderDailySummaryConfirmation(D-SUM01) \| diary-confirmation-empty \| ISOLATED_COMPONENT \| 4 \| YES \|  \| |
| 11 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:24:\| DIARY_CONFIRMATION \| renderDailySummaryConfirmation(D-SUM01) \| diary-confirmation-awaiting \| ISOLATED_COMPONENT \| 7 \| YES \|  \| |
| 12 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:25:\| DIARY_CONFIRMATION \| renderDailySummaryConfirmation(D-SUM01) \| diary-confirmation-confirmed \| ISOLATED_COMPONENT \| 7 \| YES \|  \| |
| 13 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:26:\| DIARY_CONFIRMATION \| renderDailySummaryConfirmation(D-SUM01) \| diary-confirmation-edit \| ISOLATED_COMPONENT \| 8 \| YES \|  \| |
| 14 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:27:\| DIARY_CONFIRMATION \| renderDailySummaryConfirmation(D-SUM01) \| diary-confirmation-add \| ISOLATED_COMPONENT \| 8 \| YES \|  \| |
| 15 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:29:\| LIMITED_REPORT \| renderReport \| limited-report \| FULL_SURFACE \| 13 \| YES \|  \| |
| 16 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:30:\| LIMITED_REPORT \| renderReport \| usable-limited-report \| FULL_SURFACE \| 13 \| YES \|  \| |
| 17 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:31:\| FULL_SEVEN_DAY_REPORT \| renderReport \| full-seven-day-report \| FULL_SURFACE \| 77 \| YES \|  \| |
| 18 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:32:\| UPGRADE_OFFER \| renderUpgradeOffer \| upgrade-offer-present \| ISOLATED_COMPONENT \| 7 \| YES \|  \| |
| 19 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:33:\| UPGRADE_OFFER \| renderUpgradeOffer \| upgrade-offer-absent \| ISOLATED_COMPONENT \| 0 \| YES \| Entitled state correctly suppresses offer. \| |
| 20 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_SURFACE_COVERAGE.md:34:\| UPGRADE_PAYWALL \| renderUpgradePaywall \| upgrade-paywall \| FULL_SURFACE \| 15 \| YES \|  \| |
| 21 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./PRICING_CONSISTENCY_REPORT.md:9:\| Seven-day assessment \| `app.js` `PRICING.sevenDay` \| 29,000₮ \| product and backend `seven_day = 29000` \| CONSISTENT \| |
| 22 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./PRICING_CONSISTENCY_REPORT.md:10:\| Seven-day anchor/reference price \| `app.js` `PRICING.sevenDayAnchor` \| 69,000₮ \| No payment charge uses the anchor value \| NOT_APPLICABLE \| |
| 23 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./PRICING_CONSISTENCY_REPORT.md:11:\| One-time to seven-day upgrade \| `app.js` `PRICING.upgrade` \| 19,900₮ \| product and backend `upgrade = 19900` \| CONSISTENT \| |
| 24 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_ENGINEERING_VALIDATION.md:33:Every scenario declares `FULL_SURFACE`, `ISOLATED_COMPONENT`, or `ATTRIBUTE_ONLY`. Sample report, upgrade offer, QPay, payment error, and diary confirmation use direct existing component renderers. Accessibility extraction reads attributes only. Diary home uses `renderDiaryHome`. Advisor fixtures use the local mock backend. Internal tester fixtures use the existing `internalTest` state gate. |
| 25 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_ENGINEERING_VALIDATION.md:39:- `renderDiaryHome` |
| 26 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_ENGINEERING_VALIDATION.md:40:- `renderDiaryInput` |
| 27 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_ENGINEERING_VALIDATION.md:41:- `renderDailySummaryConfirmation` |
| 28 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_ENGINEERING_VALIDATION.md:43:- `renderUpgradeOffer` |
| 29 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./MOCK_BACKEND_ENTITLEMENTS.md:66:* `seven_day`: 29,000 MNT |
| 30 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./MOCK_BACKEND_ENTITLEMENTS.md:75:`seven_day` creates: |
| 31 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./MOCK_BACKEND_ENTITLEMENTS.md:77:* `seven_day_access` |
| 32 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./MOCK_BACKEND_ENTITLEMENTS.md:82:* `seven_day_access` |
| 33 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./MOCK_BACKEND_ENTITLEMENTS.md:84:Compatibility note: the app still mirrors successful mock payments into the old `oneTimePaid`, `sevenDayPaid`, and `upgradePaid` fields so existing tests and prototype state keep working. New access helpers also check the mock entitlement state. |
| 34 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./HUMAN_DEMO_QA.md:47:2. Choose `7 хоногийн гүн зураглал`. |
| 35 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./FAKE_PAYMENT_VALIDATION.md:22:* product type: `one_time \| seven_day \| upgrade` |
| 36 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:67:\| COPY-0061 \| 7 хоногийн гүн зураглал \| app.js \|  \| renderAbout \| ABOUT \| PUBLIC_USER \| renderAbout via about [FULL_SURFACE] \| None observed \| DUP-0015 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 37 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:104:\| COPY-0098 \| 7 хоногоор нарийвчлах боломж \| app.js \|  \| renderChoice \| CHOICE \| PUBLIC_USER \| renderChoice via choice [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 38 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:108:\| COPY-0102 \| 7 хоногийн гүн анализ \| app.js \|  \| renderChoice \| CHOICE \| PUBLIC_USER \| renderChoice via choice [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 39 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:179:\| COPY-0173 \| 7 хоногийн гүн анализ руу шилжих боломж \| app.js \|  \| renderReport \| ONE_TIME_PAYWALL \| PUBLIC_USER \| renderReport via one-time-unpaid [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 40 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:268:\| COPY-0262 \| 7 хоногийн гүн зураглал \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0015 \| PAYMENT_CRITICAL \| |
| 41 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:269:\| COPY-0263 \| Нээлтийн эрх \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 42 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:270:\| COPY-0264 \| 7 хоногийн гүн анализаа нээх \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 43 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:271:\| COPY-0265 \| Үндсэн үнэ \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0151 \| PAYMENT_CRITICAL \| |
| 44 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:272:\| COPY-0266 \| 69,000₮ \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0013 \| PAYMENT_CRITICAL \| |
| 45 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:273:\| COPY-0267 \| Нээлтийн урамшуулалт үнэ \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0096 \| PAYMENT_CRITICAL \| |
| 46 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:274:\| COPY-0268 \| 29,000₮ \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0009 \| PAYMENT_CRITICAL \| |
| 47 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:275:\| COPY-0269 \| 7 хоногийн тэмдэглэлээр таны өдөр тутмын бодит давтамж илүү тод харагдана. Анхны сэтгэгдэл ба өдөр тутмын ажиглалт хоёр хаана давхцаж, хаана зөрж байгааг эндээс харна. \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 48 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:276:\| COPY-0270 \| Эхлэх богино асуулт \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0179 \| PAYMENT_CRITICAL \| |
| 49 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:277:\| COPY-0271 \| 7 өдөр богино тэмдэглэл \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0014 \| PAYMENT_CRITICAL \| |
| 50 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:278:\| COPY-0272 \| Орой бүр 3–5 минут \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0100 \| PAYMENT_CRITICAL \| |
| 51 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:279:\| COPY-0273 \| 5 өдөр бөглөсөн ч тайлан гарна \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0012 \| PAYMENT_CRITICAL \| |
| 52 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:280:\| COPY-0274 \| Калори тоолохгүй, давтагддаг мөчүүдийг ажиглана \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 53 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:281:\| COPY-0275 \| 29,000₮ төлөөд эхлүүлэх \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 54 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:282:\| COPY-0276 \| Буцах \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0044 \| PAYMENT_CRITICAL \| |
| 55 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:283:\| COPY-0277 \| Энэ бүртгэл бодит төлбөр авахгүй. Та авах сонирхолтой эсэхээ л үлдээж байна. \| app.js \|  \| renderSevenDayPaywall \| SEVEN_DAY_PAYWALL \| PUBLIC_USER \| renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] \| None observed \| DUP-0171 \| PAYMENT_CRITICAL \| |
| 56 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:284:\| COPY-0278 \| 7 хоногийн гүн зураглал \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \| DUP-0015 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 57 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:285:\| COPY-0279 \| 7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 58 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:286:\| COPY-0280 \| Эхний богино асуултаар эхэлнэ. Дараа нь орой бүр 3–5 минутын тэмдэглэл бөглөж, 7 хоногийн дараа илүү нарийвчилсан тайлан гарна. \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 59 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:287:\| COPY-0281 \| Эхлэл: 8-10 минут \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 60 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:288:\| COPY-0282 \| Орой бүр: 3–5 минут \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 61 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:289:\| COPY-0283 \| 5/7 өдөр бөглөсөн ч тайлан гарна \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 62 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:290:\| COPY-0284 \| Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 63 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:291:\| COPY-0285 \| Калори тоолохгүй \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 64 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:292:\| COPY-0286 \| Зөвхөн давтагддаг мөчүүдийг ажиглана \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 65 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:293:\| COPY-0287 \| 7 хоногийн үнэлгээ эхлүүлэх \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 66 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:294:\| COPY-0288 \| Буцах \| app.js \|  \| renderSevenDayStart \| SEVEN_DAY_START \| SEVEN_DAY_USER \| renderSevenDayStart via seven-day-start [FULL_SURFACE] \| None observed \| DUP-0044 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 67 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:295:\| COPY-0289 \| 7 хоногийн тэмдэглэл \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] \| None observed \| DUP-0016 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 68 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:296:\| COPY-0290 \| Тэмдэглэлийн явц \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] \| None observed \| DUP-0140 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 69 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:297:\| COPY-0291 \| Өчигдөр бөглөж амжаагүй байсан ч зүгээр. Өнөөдрөөс үргэлжлүүлье. \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-zero [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 70 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:298:\| COPY-0292 \| 0/7 \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-zero [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 71 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:299:\| COPY-0293 \| Өдөр бөглөсөн \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] \| None observed \| DUP-0103 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 72 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:300:\| COPY-0294 \| Дутуу \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-zero [FULL_SURFACE] \| None observed \| DUP-0057 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 73 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:301:\| COPY-0295 \| Мэдээллийн чанар \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] \| None observed \| DUP-0077 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 74 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:302:\| COPY-0296 \| Дараагийн өдөр бөглөх \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] \| None observed \| DUP-0052 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 75 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:303:\| COPY-0297 \| Одоогийн зураглал харах \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-zero, diary-home-partial [FULL_SURFACE] \| None observed \| DUP-0098 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 76 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:304:\| COPY-0298 \| Эхний давтамжууд харагдаж эхэлж байна. 5 өдөр хүрвэл тайлан гаргахад хангалттай мэдээлэлтэй болно. \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-partial [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 77 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:305:\| COPY-0299 \| 2/7 \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-partial [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 78 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:306:\| COPY-0300 \| Эхний \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-partial [FULL_SURFACE] \| None observed \| DUP-0180 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 79 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:307:\| COPY-0301 \| 7 хоногийн ажиглалт дууслаа. Таны бүрэн зураглал бэлэн болж байна. \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-complete [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 80 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:308:\| COPY-0302 \| 7/7 \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-complete [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 81 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:309:\| COPY-0303 \| Бүрэн \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-complete [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 82 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:310:\| COPY-0304 \| Тайлан харах \| app.js \|  \| renderDiaryHome \| DIARY_HOME \| SEVEN_DAY_USER \| renderDiaryHome via diary-home-complete [FULL_SURFACE] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 83 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:311:\| COPY-0305 \| Тэмдэглэлийн 1 дэх өдөр \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single, diary-multi, diary-scale, diary-text [FULL_SURFACE] \| None observed \| DUP-0139 \| QUESTION_WORDING \| |
| 84 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:312:\| COPY-0306 \| Асуулт 1/14 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 85 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:313:\| COPY-0307 \| Өнөөдөр хоолны хэмнэл ямархуу өнгөрөв? \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 86 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:314:\| COPY-0308 \| Тогтуун, хоол алгасаагүй \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE] \| None observed \| DUP-0131 \| QUESTION_WORDING \| |
| 87 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:315:\| COPY-0309 \| Нэг хоол алгассан \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE] \| None observed \| DUP-0087 \| QUESTION_WORDING \| |
| 88 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:316:\| COPY-0310 \| Хоол хоорондын зай хэтэрсэн \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE] \| None observed \| DUP-0165 \| QUESTION_WORDING \| |
| 89 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:317:\| COPY-0311 \| Өдөр бага идээд орой нөхсөн \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE] \| None observed \| DUP-0102 \| QUESTION_WORDING \| |
| 90 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:318:\| COPY-0312 \| Юу идснээ сайн санахгүй байна \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE] \| None observed \| DUP-0186 \| QUESTION_WORDING \| |
| 91 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:319:\| COPY-0313 \| Үргэлжлүүлэх \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single, diary-multi, diary-scale, diary-text [FULL_SURFACE] \| None observed \| DUP-0152 \| QUESTION_WORDING \| |
| 92 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:320:\| COPY-0314 \| Өнөөдрийн чиглэл \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single, diary-multi, diary-scale, diary-text [FULL_SURFACE] \| None observed \| DUP-0105 \| QUESTION_WORDING \| |
| 93 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:321:\| COPY-0315 \| Нэмэлт тайлбарыг одоогоор бичгээр хадгална. \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-single, diary-multi, diary-scale, diary-text [FULL_SURFACE] \| None observed \| DUP-0089 \| QUESTION_WORDING \| |
| 94 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:322:\| COPY-0316 \| Буцах \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi, diary-scale, diary-text [FULL_SURFACE] \| None observed \| DUP-0044 \| QUESTION_WORDING \| |
| 95 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:323:\| COPY-0317 \| Асуулт 5/14 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 96 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:324:\| COPY-0318 \| Тэр хүслийг юутай хамгийн ойр тайлбарлах вэ? \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 97 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:325:\| COPY-0319 \| Өлссөндөө \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0104 \| QUESTION_WORDING \| |
| 98 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:326:\| COPY-0320 \| Амттай юм идмээр байсан \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0031 \| QUESTION_WORDING \| |
| 99 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:327:\| COPY-0321 \| Тайвширмаар байсан \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0117 \| QUESTION_WORDING \| |
| 100 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:328:\| COPY-0322 \| Өөрийгөө жаахан шагнамаар байсан \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0106 \| QUESTION_WORDING \| |
| 101 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:329:\| COPY-0323 \| Уйдсан \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0142 \| QUESTION_WORDING \| |
| 102 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:330:\| COPY-0324 \| Ядарсан \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0193 \| QUESTION_WORDING \| |
| 103 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:331:\| COPY-0325 \| Дараа өлсөхөөс санаа зовсон \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0051 \| QUESTION_WORDING \| |
| 104 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:332:\| COPY-0326 \| Харагдаад эсвэл үнэртээд идмээр болсон \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0158 \| QUESTION_WORDING \| |
| 105 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:333:\| COPY-0327 \| Татгалзах эвгүй байсан \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0129 \| QUESTION_WORDING \| |
| 106 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:334:\| COPY-0328 \| Хамгийн амар нь тэр байсан \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0155 \| QUESTION_WORDING \| |
| 107 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:335:\| COPY-0329 \| Бие эвгүйрхэх вий гэж санаа зовсон \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] \| None observed \| DUP-0042 \| QUESTION_WORDING \| |
| 108 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:336:\| COPY-0330 \| Асуулт 4/14 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 109 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:337:\| COPY-0331 \| Тэр үед та үнэхээр өлссөн байсан уу? 0 = огт өлсөөгүй, 10 = маш их өлссөн \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 110 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:338:\| COPY-0332 \| 0 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \| DUP-0002 \| QUESTION_WORDING \| |
| 111 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:339:\| COPY-0333 \| 1 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \| DUP-0004 \| QUESTION_WORDING \| |
| 112 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:340:\| COPY-0334 \| 2 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 113 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:341:\| COPY-0335 \| 3 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 114 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:342:\| COPY-0336 \| 4 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 115 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:343:\| COPY-0337 \| 5 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 116 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:344:\| COPY-0338 \| 6 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 117 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:345:\| COPY-0339 \| 7 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 118 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:346:\| COPY-0340 \| 8 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 119 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:347:\| COPY-0341 \| 9 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 120 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:348:\| COPY-0342 \| 10 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 121 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:349:\| COPY-0343 \| Асуулт 13/14 \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-text [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 122 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:350:\| COPY-0344 \| Өнөөдрийн идэлтэд хамгийн их нөлөөлсөн нэг мөчийг богино бичнэ үү. Юуны дараа болсон бэ? \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-text [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 123 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:351:\| COPY-0345 \| 1-2 өгүүлбэр хангалттай \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-text [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 124 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:352:\| COPY-0346 \| Хэрвээ санахгүй эсвэл бичмээргүй байвал хоосон орхиод үргэлжлүүлж болно. \| app.js \|  \| renderDiary using diaryQuestionIndex \| DIARY_QUESTION \| SEVEN_DAY_USER \| renderDiary using diaryQuestionIndex via diary-text [FULL_SURFACE] \| None observed \|  \| QUESTION_WORDING \| |
| 125 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:353:\| COPY-0347 \| Тайлбар хадгалагдлаа \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty, diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] \| None observed \| DUP-0124 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 126 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:354:\| COPY-0348 \| Өнөөдрийн сонгосон хариултууд хадгалагдсан. Бичмээр зүйл байхгүй бол үргэлжлүүлж болно. \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty [ISOLATED_COMPONENT] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 127 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:355:\| COPY-0349 \| Үргэлжлүүлэх \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty, diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] \| None observed \| DUP-0152 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 128 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:356:\| COPY-0350 \| Буцах \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty, diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] \| None observed \| DUP-0044 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 129 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:357:\| COPY-0351 \| Таны бичсэн тайлбар хадгалагдлаа. Дараагийн асуултад үргэлжлүүлж болно. \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] \| None observed \| DUP-0127 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 130 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:358:\| COPY-0352 \| Таны бичсэн тайлбар нэмэлт мэдээлэл болж хадгалагдсан \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-awaiting [ISOLATED_COMPONENT] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 131 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:359:\| COPY-0353 \| Засах \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] \| None observed \| DUP-0064 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 132 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:360:\| COPY-0354 \| Нэмэх зүйл байна \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] \| None observed \| DUP-0092 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 133 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:361:\| COPY-0355 \| Баталгаажсан \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-confirmed [ISOLATED_COMPONENT] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 134 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:362:\| COPY-0356 \| Зассан ойлголтоо мөр мөрөөр бичнэ үү \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-edit [ISOLATED_COMPONENT] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 135 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:363:\| COPY-0357 \| Баталгаажуулах \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] \| None observed \| DUP-0041 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 136 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:364:\| COPY-0358 \| Нэмэх нэг зүйлээ бичнэ үү \| app.js \|  \| renderDailySummaryConfirmation(D-SUM01) \| DIARY_CONFIRMATION \| SEVEN_DAY_USER \| renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-add [ISOLATED_COMPONENT] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 137 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:365:\| COPY-0359 \| Тайлангийн бэлэн байдал \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \| DUP-0123 \| REPORT_WORDING \| |
| 138 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:366:\| COPY-0360 \| Бүрэн тайлан гаргахад мэдээлэл хангалтгүй байна \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 139 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:367:\| COPY-0361 \| 0-1 өдөр нь таны давтамжийг дүгнэхэд хангалтгүй. Тэмдэглэлээ үргэлжлүүлээд дор хаяж 2-3 өдөр хүрвэл эхний зураглал харагдаж эхэлнэ. 5 өдөр бөглөсөн ч бүрэн тайлан гарна. \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 140 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:368:\| COPY-0362 \| 1/7 \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 141 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:369:\| COPY-0363 \| Өдөр бөглөсөн \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \| DUP-0103 \| REPORT_WORDING \| |
| 142 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:370:\| COPY-0364 \| Дутуу \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \| DUP-0057 \| REPORT_WORDING \| |
| 143 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:371:\| COPY-0365 \| Хариултын хүрэлцээ \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \| DUP-0160 \| REPORT_WORDING \| |
| 144 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:372:\| COPY-0366 \| Энэ нь бүрэн тайлан биш тул 14 хоногийн туршилт өгөхгүй. Тэмдэглэлээ үргэлжлүүлж 5/7 өдөр хүрвэл бүрэн тайлан гарна. \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \| DUP-0175 \| REPORT_WORDING \| |
| 145 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:373:\| COPY-0367 \| Тэмдэглэлээ үргэлжлүүлэх \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \| DUP-0141 \| REPORT_WORDING \| |
| 146 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:374:\| COPY-0368 \| Явц руу буцах \| app.js \|  \| renderReport \| INSUFFICIENT_REPORT \| SEVEN_DAY_USER \| renderReport via insufficient-report [FULL_SURFACE] \| None observed \| DUP-0191 \| REPORT_WORDING \| |
| 147 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:375:\| COPY-0369 \| Тайлангийн бэлэн байдал \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report, usable-limited-report [FULL_SURFACE] \| None observed \| DUP-0123 \| REPORT_WORDING \| |
| 148 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:376:\| COPY-0370 \| Хязгаартай эхний зураглал \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 149 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:377:\| COPY-0371 \| 2-3 өдрийн мэдээлэл дээр зарим дохио харагдаж болно. Гэхдээ энэ нь бүрэн тайлан биш, эхний reflection хэвээр байна. \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report [FULL_SURFACE] \| None observed \|  \| MIXED_LANGUAGE \| |
| 150 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:378:\| COPY-0372 \| 3/7 \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 151 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:379:\| COPY-0373 \| Өдөр бөглөсөн \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report, usable-limited-report [FULL_SURFACE] \| None observed \| DUP-0103 \| REPORT_WORDING \| |
| 152 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:380:\| COPY-0374 \| Эхний \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report [FULL_SURFACE] \| None observed \| DUP-0180 \| REPORT_WORDING \| |
| 153 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:381:\| COPY-0375 \| Хариултын хүрэлцээ \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report, usable-limited-report [FULL_SURFACE] \| None observed \| DUP-0160 \| REPORT_WORDING \| |
| 154 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:382:\| COPY-0376 \| Эхний дохионууд \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report, usable-limited-report [FULL_SURFACE] \| None observed \| DUP-0181 \| REPORT_WORDING \| |
| 155 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:383:\| COPY-0377 \| Хоол хоорондын зай уртсах \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report, usable-limited-report [FULL_SURFACE] \| None observed \| DUP-0164 \| REPORT_WORDING \| |
| 156 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:384:\| COPY-0378 \| Нойр ба өдрийн эрч хүч \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report, usable-limited-report [FULL_SURFACE] \| None observed \| DUP-0081 \| REPORT_WORDING \| |
| 157 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:385:\| COPY-0379 \| Энэ нь бүрэн тайлан биш тул 14 хоногийн туршилт өгөхгүй. Тэмдэглэлээ үргэлжлүүлж 5/7 өдөр хүрвэл бүрэн тайлан гарна. \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report, usable-limited-report [FULL_SURFACE] \| None observed \| DUP-0175 \| REPORT_WORDING \| |
| 158 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:386:\| COPY-0380 \| Тэмдэглэлээ үргэлжлүүлэх \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report, usable-limited-report [FULL_SURFACE] \| None observed \| DUP-0141 \| REPORT_WORDING \| |
| 159 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:387:\| COPY-0381 \| Явц руу буцах \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via limited-report, usable-limited-report [FULL_SURFACE] \| None observed \| DUP-0191 \| REPORT_WORDING \| |
| 160 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:388:\| COPY-0382 \| Ашиглаж болох ч хязгаартай зураглал \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via usable-limited-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 161 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:389:\| COPY-0383 \| 4 өдрийн мэдээлэл зан үйлийн давтамжийг тодорхойлоход ашиглаж болох түвшинд хүрсэн. Дахиад 1 өдөр бөглөвөл бүрэн тайлан гаргах босгонд хүрнэ. \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via usable-limited-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 162 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:390:\| COPY-0384 \| 4/7 \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via usable-limited-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 163 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:391:\| COPY-0385 \| Хязгаартай \| app.js \|  \| renderReport \| LIMITED_REPORT \| SEVEN_DAY_USER \| renderReport via usable-limited-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 164 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:392:\| COPY-0386 \| Тайлан \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0118 \| REPORT_WORDING \| |
| 165 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:393:\| COPY-0387 \| Таны тайлан бэлэн боллоо \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 166 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:394:\| COPY-0388 \| Доорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 167 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:395:\| COPY-0389 \| Товч хариу \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 168 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:396:\| COPY-0390 \| 1. Таны гол гацдаг мөч \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 169 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:397:\| COPY-0391 \| Удаан юм идээгүй өдөр орой гэнэт өлсөж байгаагаа анзаардаг. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 170 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:398:\| COPY-0392 \| 2. Энэ юу гэсэн үг вэ? \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 171 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:399:\| COPY-0393 \| Өдрийн хоолны зай уртсах тусам оройн өлсөлт илүү хүчтэй мэдрэгддэг. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 172 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:400:\| COPY-0394 \| Дараа хэзээ идэх нь тодорхойгүй санагдах үед илүү идэх нь хамгаалах оролдлого байж болно. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 173 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:401:\| COPY-0395 \| Энэ нь сул тал биш. Өдөр хоолны зай хэт урт байсны дараах хариу байж болно. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 174 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:402:\| COPY-0396 \| 3. Эхлээд хийх нэг жижиг зүйл \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 175 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:403:\| COPY-0397 \| 5 цагаас дээш зай гарахаас өмнө жижиг гүүр хоол эсвэл зууш төлөвлө. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 176 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:404:\| COPY-0398 \| 4. Одоогоор түр болгоомжлох зүйл \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 177 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:405:\| COPY-0399 \| Өдөр хоол алгасаад орой өөрийгөө тэс гэж шахахаас түр зайлсхий. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 178 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:406:\| COPY-0400 \| Дэлгэрэнгүй тайлан \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 179 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:407:\| COPY-0401 \| Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 180 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:408:\| COPY-0402 \| Гол зураг \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 181 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:409:\| COPY-0403 \| Өдөр удаан хоосон явсны дараа оройн өлсөлт огцом нэмэгддэг. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 182 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:410:\| COPY-0404 \| Тэр үед “дараа дахиад өлсөх вий” гэсэн бодол амархан орж ирдэг. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 183 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:411:\| COPY-0405 \| Ийм үед илүү идэх нь сул тал биш, биеийн хамгаалах оролдлого байж болно. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 184 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:412:\| COPY-0406 \| Тэр мөчид хоол ямар мэдрэмж өгч байна вэ? \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 185 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:413:\| COPY-0407 \| Тэр үед хоол биеийг тайвшруулж, дараа дахиад өлсөх вий гэсэн айдсыг намдаадаг. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 186 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:414:\| COPY-0408 \| Дараа дахиад өлсөхөөс айхгүй болох \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 187 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:415:\| COPY-0409 \| Биеэ тайван болгох \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 188 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:416:\| COPY-0410 \| Оройн хүчтэй өлсөлтийг намдаах \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 189 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:417:\| COPY-0411 \| Давтагддаг тойрог \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 190 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:418:\| COPY-0412 \| Өдөр хоол холдоно \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 191 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:419:\| COPY-0413 \| ↓ \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0001 \| REPORT_WORDING \| |
| 192 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:420:\| COPY-0414 \| Орой өлсөлт, яаралтай мэдрэмж нэмэгдэнэ \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 193 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:421:\| COPY-0415 \| “Дараа дахиад өлсөх вий” гэж бодогдоно \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 194 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:422:\| COPY-0416 \| Бэлэн байгаа хоол илүү татна \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 195 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:423:\| COPY-0417 \| Илүү их идсэний дараа бие түр тайвширна \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 196 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:424:\| COPY-0418 \| Маргааш дахин хасвал орой энэ тойрог буцаж ирнэ \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 197 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:425:\| COPY-0419 \| Яагаад ингэж хэлж байна вэ? \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 198 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:426:\| COPY-0420 \| Та хоолны зай уртсах үед орой хүчтэй өлсөж, дараа дахин өлсөхөөс санаа зовдог гэж тэмдэглэсэн. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 199 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:427:\| COPY-0421 \| Гол буруу ойлголт \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 200 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:428:\| COPY-0422 \| Асуудал орой идсэндээ биш. Өдөр хоолны зай хэт уртсах үед оройн өлсөлт илүү хүчтэй болдог. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 201 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:429:\| COPY-0423 \| Одоохондоо хэт яарахгүй зүйлс \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 202 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:430:\| COPY-0424 \| Урт мацаг \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 203 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:431:\| COPY-0425 \| Өдөр хоол алгасах \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 204 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:432:\| COPY-0426 \| “Өлсвөл тэс” гэж өөрийгөө хүчлэх \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 205 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:433:\| COPY-0427 \| Оройн зуушийг шууд бүрэн хорих \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 206 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:434:\| COPY-0428 \| Хамгийн хялбар эхлэх цэг \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 207 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:435:\| COPY-0429 \| Хамгийн хялбар эхлэх цэг бол оройг хорих биш. Өдрийн хоолны зайг хэт холдуулахгүй нэг тулгуур хоол, нэг жижиг гүүр сонголт бэлдэх. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 208 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:436:\| COPY-0430 \| 14 хоногийн туршилт \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 209 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:437:\| COPY-0431 \| Эхний 3 өдөр: \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 210 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:438:\| COPY-0432 \| хоол хооронд хэдэн цагийн зай гарч байгааг л тэмдэглэ. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 211 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:439:\| COPY-0433 \| 4-10 дахь өдөр: \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 212 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:440:\| COPY-0434 \| 5 цагаас дээш зай гарахаас өмнө жижиг гүүр хоол ашигла. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 213 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:441:\| COPY-0435 \| 11-14 дахь өдөр: \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 214 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:442:\| COPY-0436 \| оройн өлсөлт яаралтай санагдах нь багассан эсэхийг тэмдэглэ. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 215 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:443:\| COPY-0437 \| Хэрвээ нэг өдөр алгасвал: \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 216 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:444:\| COPY-0438 \| оройг шийтгэл болгохгүй. Дараагийн өдөр нэг тулгуур хоолноос эхэл. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 217 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:445:\| COPY-0439 \| Тайлангаа хадгалах \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0122 \| REPORT_WORDING \| |
| 218 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:446:\| COPY-0440 \| Таны тайлан энэ дэлгэц дээр гарлаа. Одоогоор байнгын тайлангийн холбоос эсвэл имэйл илгээсэн гэж харуулахгүй. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0128 \| REPORT_WORDING \| |
| 219 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:447:\| COPY-0441 \| Холбоо барих мэдээлэл хадгалагдаагүй байна. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0163 \| REPORT_WORDING \| |
| 220 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:448:\| COPY-0442 \| Тайлан хуулж авах \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0120 \| REPORT_WORDING \| |
| 221 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:449:\| COPY-0443 \| Хэвлэх / PDF хадгалах \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0169 \| MIXED_LANGUAGE \| |
| 222 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:450:\| COPY-0444 \| Тэмдэглэл рүү буцах \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 223 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:451:\| COPY-0445 \| Шинээр эхлэх \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0170 \| REPORT_WORDING \| |
| 224 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:452:\| COPY-0446 \| Эхний товч зураглал \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0184 \| REPORT_WORDING \| |
| 225 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:453:\| COPY-0447 \| Эхний мэдээлэл \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0183 \| REPORT_WORDING \| |
| 226 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:454:\| COPY-0448 \| Гол дохио: Хоол хоорондын зай уртсах. Давхар дохио: Нойр ба өдрийн эрч хүч. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 227 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:455:\| COPY-0449 \| Хариултын хүрэлцээ \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0160 \| REPORT_WORDING \| |
| 228 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:456:\| COPY-0450 \| Энэ хэсэг 7 хоногийн тэмдэглэлд тулгуурлана. 5/7 өдрийн ажиглалттай байна. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 229 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:457:\| COPY-0451 \| Дэлгэрэнгүй тайлангийн хэсэг \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 230 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:458:\| COPY-0452 \| Гүн зураглалд харах хэсэг \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 231 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:459:\| COPY-0453 \| Дэлгэрэнгүй хэсэгт идэхийн өмнөх нөхцөл, цаг, дараах мэдрэмжийн холбоосыг илүү нарийвчилна. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 232 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:460:\| COPY-0454 \| Дараагийн жижиг алхам \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 233 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:461:\| COPY-0455 \| Хэт чангалсан дүрэм нэмэхээс илүү нэг давтамжийг бодит өдөр тутамд ажиглах жижиг туршилт сонгоно. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \|  \| REPORT_WORDING \| |
| 234 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:462:\| COPY-0456 \| Аюулгүй байдлын сануулга \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0034 \| REPORT_WORDING \| |
| 235 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:463:\| COPY-0457 \| Аюулгүй ашиглах сануулга \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0033 \| REPORT_WORDING \| |
| 236 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:464:\| COPY-0458 \| Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна. \| app.js \|  \| renderReport \| FULL_SEVEN_DAY_REPORT \| SEVEN_DAY_USER \| renderReport via full-seven-day-report [FULL_SURFACE] \| None observed \| DUP-0166 \| REPORT_WORDING \| |
| 237 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:465:\| COPY-0459 \| 7 хоногоор нарийвчлах \| app.js \|  \| renderUpgradeOffer \| UPGRADE_OFFER \| PAID_USER \| renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] \| None observed \| DUP-0018 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 238 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:466:\| COPY-0460 \| Энэ зураглалыг 7 хоногоор илүү тодруулж болно \| app.js \|  \| renderUpgradeOffer \| UPGRADE_OFFER \| PAID_USER \| renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] \| None observed \| DUP-0172 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 239 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:467:\| COPY-0461 \| Нарийвчлах үнэ: \| app.js \|  \| renderUpgradeOffer \| UPGRADE_OFFER \| PAID_USER \| renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] \| None observed \| DUP-0079 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 240 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:468:\| COPY-0462 \| 19,900₮ \| app.js \|  \| renderUpgradeOffer \| UPGRADE_OFFER \| PAID_USER \| renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] \| None observed \| DUP-0007 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 241 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:469:\| COPY-0463 \| Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. \| app.js \|  \| renderUpgradeOffer \| UPGRADE_OFFER \| PAID_USER \| renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] \| None observed \| DUP-0112 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 242 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:470:\| COPY-0464 \| 7 хоногийн богино тэмдэглэл нь аль өдөр, ямар үед илүү хүчтэй болдгийг нарийвчилна. \| app.js \|  \| renderUpgradeOffer \| UPGRADE_OFFER \| PAID_USER \| renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] \| None observed \|  \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 243 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:471:\| COPY-0465 \| 19,900₮ төлөөд 7 хоногоор нарийвчлах \| app.js \|  \| renderUpgradeOffer \| UPGRADE_OFFER \| PAID_USER \| renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] \| None observed \| DUP-0008 \| NO_LANGUAGE_ISSUE_OBSERVED \| |
| 244 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:472:\| COPY-0466 \| 7 хоногоор нарийвчлах \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \| DUP-0018 \| PAYMENT_CRITICAL \| |
| 245 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:473:\| COPY-0467 \| Энэ зураглалыг 7 хоногоор илүү тодруулж болно \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \| DUP-0172 \| PAYMENT_CRITICAL \| |
| 246 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:474:\| COPY-0468 \| Нарийвчлах үнэ: \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \| DUP-0079 \| PAYMENT_CRITICAL \| |
| 247 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:475:\| COPY-0469 \| 19,900₮ \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \| DUP-0007 \| PAYMENT_CRITICAL \| |
| 248 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:476:\| COPY-0470 \| 7 хоногийн нээлтийн үнэ 29,000₮ \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 249 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:477:\| COPY-0471 \| Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \| DUP-0112 \| PAYMENT_CRITICAL \| |
| 250 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:478:\| COPY-0472 \| Орой бүр 3–5 минутын богино тэмдэглэл \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 251 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:479:\| COPY-0473 \| Идэх хүсэл эхэлдэг нөхцлийн зураглал \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 252 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:480:\| COPY-0474 \| Эхний зураглал ба бодит ажиглалтын харьцуулалт \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 253 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:481:\| COPY-0475 \| Идэх хүсэл яг ямар хэрэгцээтэй давхцаж байгааг нарийвчлах \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 254 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:482:\| COPY-0476 \| Илүү тод 14 хоногийн туршилт \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \| DUP-0068 \| PAYMENT_CRITICAL \| |
| 255 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:483:\| COPY-0477 \| 19,900₮ төлөөд 7 хоногоор нарийвчлах \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \| DUP-0008 \| PAYMENT_CRITICAL \| |
| 256 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:484:\| COPY-0478 \| Тайлан руу буцах \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \|  \| PAYMENT_CRITICAL \| |
| 257 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_REVIEW_CATALOG.md:485:\| COPY-0479 \| Энэ бүртгэл бодит төлбөр авахгүй. Та авах сонирхолтой эсэхээ л үлдээж байна. \| app.js \|  \| renderUpgradePaywall \| UPGRADE_PAYWALL \| PAID_USER \| renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] \| None observed \| DUP-0171 \| PAYMENT_CRITICAL \| |
| 258 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/export-virtual-human-retest.mjs:306:    "7 хоногоор нарийвчлах", |
| 259 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/export-virtual-human-retest.mjs:413:    sevenDayPaid: true, |
| 260 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/export-virtual-human-retest.mjs:419:    diaryEntries: [], |
| 261 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/export-virtual-human-retest.mjs:465:    sevenDayPaid: true, |
| 262 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/export-virtual-human-retest.mjs:471:    diaryEntries: [], |
| 263 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:16:* `sevenDayPaid` |
| 264 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:54:* Product type: `seven_day` |
| 265 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:56:* Grants entitlement: `seven_day_access` |
| 266 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:67:* Grants entitlement: `seven_day_access` |
| 267 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:116:* `assessment_type`: `one_time \| seven_day` |
| 268 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:164:* `report_kind`: `preview \| one_time_full \| seven_day_limited \| seven_day_full \| professional_summary \| urgent_safety` |
| 269 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:187:* `product_type`: `one_time \| seven_day \| upgrade` |
| 270 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:214:* `entitlement_type`: `one_time_report \| seven_day_access \| upgrade_access \| professional_summary` |
| 271 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:224:* `upgrade_access` can be represented as both `upgrade_access` and `seven_day_access`, but the effective frontend access flag should be `hasSevenDayAccess`. |
| 272 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:299:Creates or updates a diary entry. Requires `seven_day_access` unless the route is a safety-only action. |
| 273 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:310:  "hasSevenDayAccess": false, |
| 274 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:354:  "entitlements": ["seven_day_access"], |
| 275 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:356:    "hasSevenDayAccess": true |
| 276 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:398:* `sevenDayPaid` |
| 277 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./BACKEND_QPAY_INTEGRATION_PLAN.md:404:* `hasSevenDayAccess` |
| 278 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:55:  packageType: "seven-day", |
| 279 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:56:  view: "sevenDayStart", |
| 280 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:57:  sevenDayPaid: false, |
| 281 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:61:  diaryEntries: [] |
| 282 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:63:addRendered("7-Day Paywall", _internal.renderSevenDayStart); |
| 283 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:66:  packageType: "seven-day", |
| 284 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:67:  view: "sevenDayStart", |
| 285 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:68:  sevenDayPaid: true, |
| 286 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:72:  diaryEntries: [] |
| 287 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:74:addRendered("7-Day Start Unlocked", _internal.renderSevenDayStart); |
| 288 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:86:  diaryEntries: [] |
| 289 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:107:  diaryEntries: [] |
| 290 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:112:  packageType: "seven-day", |
| 291 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:114:  sevenDayPaid: true, |
| 292 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:115:  diaryEntries: [], |
| 293 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:126:  diaryEntries: [] |
| 294 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-ui-mongolian-texts.js:135:  diaryEntries: [] |
| 295 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./PR1_UNAPPROVED_COPY_CHANGES.md:8:\| provisional normalizer \| arbitrary rendered UI text and attributes \| 7 хоногийн гүн анализ \| 7 хоногийн гүн зураглал \| UNAPPROVED_GENERATED_COPY \| REMOVE_RUNTIME_REWRITER \| |
| 296 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./PR1_UNAPPROVED_COPY_CHANGES.md:10:\| provisional normalizer \| arbitrary rendered UI text and attributes \| 7 хоногийн гүн анализаа нээх \| 7 хоногийн гүн зураглалаа нээх \| UNAPPROVED_GENERATED_COPY \| REMOVE_RUNTIME_REWRITER \| |
| 297 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./PR1_UNAPPROVED_COPY_CHANGES.md:75:\| provisional normalizer \| arbitrary rendered UI text and attributes \| seven_day \| 7 хоногийн үнэлгээ \| UNAPPROVED_GENERATED_COPY \| REMOVE_RUNTIME_REWRITER \| |
| 298 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_EXCLUDED_INTERNAL_STRINGS.md:21:- Representative examples: `function`, `one_time`, `seven_day`, `upgrade`, `reward`, `planned_evening_reward`, `regulation`, `pre_eating_regulation_pause` |
| 299 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_EXCLUDED_INTERNAL_STRINGS.md:51:- Representative examples: `weightLossDeepPatternMvp`, `/.netlify/functions/qpay-create-invoice`, `/.netlify/functions/qpay-check-payment`, `one-time`, `seven-day`, `7 хоногоор нарийвчлах эрх`, `Өөртөө нэг таатай зүйл өгөх үе`, `Сэтгэл санаагаа баярлуулахыг хүсэх үе` |
| 300 | REMOVED_PRODUCTION | ./mockBackend.js:5:  seven_day: 29000, |
| 301 | REMOVED_PRODUCTION | ./mockBackend.js:320:  if (payment.product_type === "seven_day") { |
| 302 | REMOVED_PRODUCTION | ./mockBackend.js:323:      entitlement_type: "seven_day_access", |
| 303 | REMOVED_PRODUCTION | ./mockBackend.js:337:      entitlement_type: "seven_day_access", |
| 304 | REMOVED_PRODUCTION | ./mockBackend.js:789:    hasSevenDayAccess: hasEntitlement("seven_day_access", assessmentId), |
| 305 | REMOVED_PRODUCTION | ./mockBackend.js:807:function canGenerateSevenDayReport(diaryEntries = []) { |
| 306 | REMOVED_PRODUCTION | ./mockBackend.js:808:  return Array.isArray(diaryEntries) && diaryEntries.length >= 5; |
| 307 | REMOVED_PRODUCTION | ./mockBackend.js:955:  canGenerateSevenDayReport, |
| 308 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/generate-mongolian-copy-review-packs.mjs:95:const payment = entries.filter(e => /^(PAYMENT\|QPAY\|ONE_TIME_PAYWALL\|SEVEN_DAY_PAYWALL\|UPGRADE_PAYWALL)$/.test(e.surface) \|\| (e.surface === "VISIBLE_ERROR" && /qpay\|payment/i.test(e.scenarios.join(" ")))); |
| 309 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/generate-mongolian-copy-review-packs.mjs:160:  ["TERM-04", "initial_result_name_01", /эхний зураглал\|эхний үр дүн/i], ["TERM-05", "seven_day_product_name_01", /7 хоног/i], |
| 310 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:40:    sevenDayPaid: false, |
| 311 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:53:    diaryEntries: [], |
| 312 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:73:function setSevenDay(overrides = {}) { |
| 313 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:75:    packageType: "seven-day", |
| 314 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:78:    sevenDayPaid: true, |
| 315 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:86:    diaryEntries: [ |
| 316 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:175:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day pricing label must remain unchanged"); |
| 317 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:176:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor pricing label must remain unchanged"); |
| 318 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:191:    () => setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }), |
| 319 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:197:    () => setOneTime({ oneTimePaid: true, sevenDayPaid: false, upgradePaid: false }), |
| 320 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:205:      sevenDayPaid: false, |
| 321 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:218:    () => setSevenDay({ |
| 322 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:219:      diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] |
| 323 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:227:    () => setSevenDay({ |
| 324 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-ux-polish.test.js:228:      diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] |
| 325 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:7:\| DUP-0001 \| ↓ \| 5 \| FULL_SEVEN_DAY_REPORT \| source mapping unavailable \| |
| 326 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:14:\| DUP-0008 \| 19,900₮ төлөөд 7 хоногоор нарийвчлах \| 2 \| UPGRADE_OFFER, UPGRADE_PAYWALL \| source mapping unavailable \| |
| 327 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:15:\| DUP-0009 \| 29,000₮ \| 2 \| CHOICE, SEVEN_DAY_PAYWALL \| source mapping unavailable \| |
| 328 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:18:\| DUP-0012 \| 5 өдөр бөглөсөн ч тайлан гарна \| 2 \| CHOICE, SEVEN_DAY_PAYWALL \| source mapping unavailable \| |
| 329 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:19:\| DUP-0013 \| 69,000₮ \| 2 \| CHOICE, SEVEN_DAY_PAYWALL \| source mapping unavailable \| |
| 330 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:20:\| DUP-0014 \| 7 өдөр богино тэмдэглэл \| 2 \| CHOICE, SEVEN_DAY_PAYWALL \| source mapping unavailable \| |
| 331 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:21:\| DUP-0015 \| 7 хоногийн гүн зураглал \| 3 \| ABOUT, SEVEN_DAY_PAYWALL, SEVEN_DAY_START \| source mapping unavailable \| |
| 332 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:24:\| DUP-0018 \| 7 хоногоор нарийвчлах \| 3 \| UPGRADE_OFFER, UPGRADE_PAYWALL \| source mapping unavailable \| |
| 333 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:39:\| DUP-0033 \| Аюулгүй ашиглах сануулга \| 5 \| ONE_TIME_PAYWALL, FULL_SEVEN_DAY_REPORT, PROFESSIONAL_SAFETY, URGENT_SAFETY \| source mapping unavailable \| |
| 334 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:40:\| DUP-0034 \| Аюулгүй байдлын сануулга \| 4 \| ONE_TIME_PAYWALL, FULL_SEVEN_DAY_REPORT, PROFESSIONAL_SAFETY, URGENT_SAFETY \| source mapping unavailable \| |
| 335 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:50:\| DUP-0044 \| Буцах \| 16 \| ABOUT, ONE_TIME_START, ONE_TIME_PAYWALL, SEVEN_DAY_PAYWALL, SEVEN_DAY_START, DIARY_QUESTION, DIARY_CONFIRMATION, LEAD_CAPTURE, GENERAL_SAFETY, PAYMENT \| source mapping unavailable \| |
| 336 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:102:\| DUP-0096 \| Нээлтийн урамшуулалт үнэ \| 2 \| CHOICE, SEVEN_DAY_PAYWALL \| source mapping unavailable \| |
| 337 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:106:\| DUP-0100 \| Орой бүр 3–5 минут \| 3 \| LANDING, CHOICE, SEVEN_DAY_PAYWALL \| source mapping unavailable \| |
| 338 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:118:\| DUP-0112 \| Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. \| 2 \| UPGRADE_OFFER, UPGRADE_PAYWALL \| source mapping unavailable \| |
| 339 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:124:\| DUP-0118 \| Тайлан \| 2 \| ONE_TIME_REPORT, FULL_SEVEN_DAY_REPORT \| source mapping unavailable \| |
| 340 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:126:\| DUP-0120 \| Тайлан хуулж авах \| 3 \| ONE_TIME_REPORT, FULL_SEVEN_DAY_REPORT, PROFESSIONAL_SAFETY \| source mapping unavailable \| |
| 341 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:128:\| DUP-0122 \| Тайлангаа хадгалах \| 3 \| ONE_TIME_REPORT, FULL_SEVEN_DAY_REPORT, PROFESSIONAL_SAFETY \| source mapping unavailable \| |
| 342 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:134:\| DUP-0128 \| Таны тайлан энэ дэлгэц дээр гарлаа. Одоогоор байнгын тайлангийн холбоос эсвэл имэйл илгээсэн гэж харуулахгүй. \| 3 \| ONE_TIME_REPORT, FULL_SEVEN_DAY_REPORT, PROFESSIONAL_SAFETY \| source mapping unavailable \| |
| 343 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:157:\| DUP-0151 \| Үндсэн үнэ \| 6 \| CHOICE, ONE_TIME_START, ONE_TIME_PAYWALL, SEVEN_DAY_PAYWALL, GENERAL_SAFETY \| source mapping unavailable \| |
| 344 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:166:\| DUP-0160 \| Хариултын хүрэлцээ \| 5 \| ONE_TIME_PAYWALL, INSUFFICIENT_REPORT, LIMITED_REPORT, FULL_SEVEN_DAY_REPORT \| source mapping unavailable \| |
| 345 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:169:\| DUP-0163 \| Холбоо барих мэдээлэл хадгалагдаагүй байна. \| 3 \| ONE_TIME_REPORT, FULL_SEVEN_DAY_REPORT, PROFESSIONAL_SAFETY \| source mapping unavailable \| |
| 346 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:172:\| DUP-0166 \| Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна. \| 3 \| ONE_TIME_PAYWALL, FULL_SEVEN_DAY_REPORT, PROFESSIONAL_SAFETY \| source mapping unavailable \| |
| 347 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:175:\| DUP-0169 \| Хэвлэх / PDF хадгалах \| 3 \| ONE_TIME_REPORT, FULL_SEVEN_DAY_REPORT, PROFESSIONAL_SAFETY \| source mapping unavailable \| |
| 348 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:176:\| DUP-0170 \| Шинээр эхлэх \| 4 \| ONE_TIME_REPORT, FULL_SEVEN_DAY_REPORT, PROFESSIONAL_SAFETY, URGENT_SAFETY \| source mapping unavailable \| |
| 349 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:177:\| DUP-0171 \| Энэ бүртгэл бодит төлбөр авахгүй. Та авах сонирхолтой эсэхээ л үлдээж байна. \| 3 \| SEVEN_DAY_PAYWALL, UPGRADE_PAYWALL, LEAD_CAPTURE \| source mapping unavailable \| |
| 350 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:185:\| DUP-0179 \| Эхлэх богино асуулт \| 2 \| CHOICE, SEVEN_DAY_PAYWALL \| source mapping unavailable \| |
| 351 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:189:\| DUP-0183 \| Эхний мэдээлэл \| 2 \| ONE_TIME_PAYWALL, FULL_SEVEN_DAY_REPORT \| source mapping unavailable \| |
| 352 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_DUPLICATE_INDEX.md:190:\| DUP-0184 \| Эхний товч зураглал \| 2 \| ONE_TIME_PAYWALL, FULL_SEVEN_DAY_REPORT \| source mapping unavailable \| |
| 353 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:14:const VALID_ROLES = new Set(["PUBLIC_USER", "PAID_USER", "SEVEN_DAY_USER", "ADVISOR", "ADMIN", "INTERNAL_TESTER"]); |
| 354 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:21:  packageType: "one-time", view: "landing", oneTimePaid: false, sevenDayPaid: false, upgradePaid: false, |
| 355 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:22:  stageAnswers: {}, preliminary: [], diaryEntries: [], diaryDay: 1, diaryQuestionIndex: 0, diaryDraft: {}, |
| 356 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:50:add("seven-day-paywall", "SEVEN_DAY_PAYWALL", "PUBLIC_USER", "FULL_SURFACE", "renderSevenDayPaywall", { ...base(), packageType: "seven-day" }, () => I.renderSevenDayPaywall()); |
| 357 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:51:add("seven-day-start", "SEVEN_DAY_START", "SEVEN_DAY_USER", "FULL_SURFACE", "renderSevenDayStart", { ...base(), packageType: "seven-day", sevenDayPaid: true }, () => I.renderSevenDayStart()); |
| 358 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:52:add("diary-home-zero", "DIARY_HOME", "SEVEN_DAY_USER", "FULL_SURFACE", "renderDiaryHome", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryEntries: [] }, () => I.renderDiaryHome()); |
| 359 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:53:add("diary-home-partial", "DIARY_HOME", "SEVEN_DAY_USER", "FULL_SURFACE", "renderDiaryHome", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryEntries: [entry(1), entry(2)] }, () => I.renderDiaryHome()); |
| 360 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:54:add("diary-home-complete", "DIARY_HOME", "SEVEN_DAY_USER", "FULL_SURFACE", "renderDiaryHome", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryEntries: [1,2,3,4,5,6,7].map(entry) }, () => I.renderDiaryHome()); |
| 361 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:55:add("diary-single", "DIARY_QUESTION", "SEVEN_DAY_USER", "FULL_SURFACE", "renderDiary using diaryQuestionIndex", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryQuestionIndex: app.dailyCore.findIndex(q=>q.type==="single") }, () => I.renderDiary()); |
| 362 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:56:add("diary-multi", "DIARY_QUESTION", "SEVEN_DAY_USER", "FULL_SURFACE", "renderDiary using diaryQuestionIndex", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryQuestionIndex: app.dailyCore.findIndex(q=>q.type==="multi") }, () => I.renderDiary()); |
| 363 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:57:add("diary-scale", "DIARY_QUESTION", "SEVEN_DAY_USER", "FULL_SURFACE", "renderDiary using diaryQuestionIndex", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryQuestionIndex: app.dailyCore.findIndex(q=>q.type==="scale") }, () => I.renderDiary()); |
| 364 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:58:add("diary-text", "DIARY_QUESTION", "SEVEN_DAY_USER", "FULL_SURFACE", "renderDiary using diaryQuestionIndex", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryQuestionIndex: app.dailyCore.findIndex(q=>q.type==="text") }, () => I.renderDiary()); |
| 365 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:59:add("diary-confirmation-empty", "DIARY_CONFIRMATION", "SEVEN_DAY_USER", "ISOLATED_COMPONENT", "renderDailySummaryConfirmation(D-SUM01)", { ...base(), diaryDraft: { raw_reflection: "" }, diarySummaryUi: {} }, () => I.renderDailySummaryConfirmation(summaryQuestion)); |
| 366 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:60:add("diary-confirmation-awaiting", "DIARY_CONFIRMATION", "SEVEN_DAY_USER", "ISOLATED_COMPONENT", "renderDailySummaryConfirmation(D-SUM01)", { ...base(), diaryDraft: { raw_reflection: "abcdefghijkl" }, diarySummaryUi: {} }, () => I.renderDailySummaryConfirmation(summaryQuestion)); |
| 367 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:61:add("diary-confirmation-confirmed", "DIARY_CONFIRMATION", "SEVEN_DAY_USER", "ISOLATED_COMPONENT", "renderDailySummaryConfirmation(D-SUM01)", { ...base(), diaryDraft: { raw_reflection: "abcdefghijkl", confirmedSummaryObject: summaryObject(true) }, diarySummaryUi: {} }, () => I.renderDailySummaryConfirmation(summaryQuestion)); |
| 368 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:62:add("diary-confirmation-edit", "DIARY_CONFIRMATION", "SEVEN_DAY_USER", "ISOLATED_COMPONENT", "renderDailySummaryConfirmation(D-SUM01)", { ...base(), diaryDraft: { raw_reflection: "abcdefghijkl", confirmedSummaryObject: summaryObject(false) }, diarySummaryUi: { mode: "edit", text: "" } }, () => I.renderDailySummaryConfirmation(summaryQuestion)); |
| 369 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:63:add("diary-confirmation-add", "DIARY_CONFIRMATION", "SEVEN_DAY_USER", "ISOLATED_COMPONENT", "renderDailySummaryConfirmation(D-SUM01)", { ...base(), diaryDraft: { raw_reflection: "abcdefghijkl", confirmedSummaryObject: summaryObject(false) }, diarySummaryUi: { mode: "add", text: "" } }, () => I.renderDailySummaryConfirmation(summaryQuestion)); |
| 370 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:64:add("insufficient-report", "INSUFFICIENT_REPORT", "SEVEN_DAY_USER", "FULL_SURFACE", "renderReport", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryEntries: [entry(1)] }, () => I.renderReport()); |
| 371 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:65:add("limited-report", "LIMITED_REPORT", "SEVEN_DAY_USER", "FULL_SURFACE", "renderReport", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryEntries: [1,2,3].map(entry) }, () => I.renderReport()); |
| 372 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:66:add("usable-limited-report", "LIMITED_REPORT", "SEVEN_DAY_USER", "FULL_SURFACE", "renderReport", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryEntries: [1,2,3,4].map(entry) }, () => I.renderReport()); |
| 373 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:67:add("full-seven-day-report", "FULL_SEVEN_DAY_REPORT", "SEVEN_DAY_USER", "FULL_SURFACE", "renderReport", { ...base(), packageType: "seven-day", sevenDayPaid: true, diaryEntries: [1,2,3,4,5].map(entry) }, () => I.renderReport()); |
| 374 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:68:add("upgrade-offer-present", "UPGRADE_OFFER", "PAID_USER", "ISOLATED_COMPONENT", "renderUpgradeOffer", { ...base(), oneTimePaid: true, sevenDayPaid: false, upgradePaid: false }, () => I.renderUpgradeOffer()); |
| 375 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:69:add("upgrade-offer-absent", "UPGRADE_OFFER", "PAID_USER", "ISOLATED_COMPONENT", "renderUpgradeOffer", { ...base(), oneTimePaid: true, sevenDayPaid: true, upgradePaid: true }, () => I.renderUpgradeOffer(), { expectedVisible: false, notes: "Entitled state correctly suppresses offer." }); |
| 376 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:70:add("upgrade-paywall", "UPGRADE_PAYWALL", "PAID_USER", "FULL_SURFACE", "renderUpgradePaywall", { ...base(), oneTimePaid: true }, () => I.renderUpgradePaywall()); |
| 377 | REMOVED_EXTRACTION_OR_GENERATION | ./tools/extract-rendered-copy.mjs:146:const validation=`# Mongolian Copy Engineering Validation\n\n## Generated provenance\n\n- Generator version: \`${GENERATOR_VERSION}\`\n- Extraction source commit: \`${commit}\`\n- Final PR head and final-head workflow IDs: maintained in PR #1 metadata after the implementation push to avoid a self-referential validation-only commit cycle\n- Pending approved replacement count: 0\n- Applied owner correction count: 1\n- Production copy changed: YES — exact owner-authorized navigation and same-origin endpoint corrections only\n- External network attempts during extraction: ${networkAttempts}\n\n## Generated metrics\n\n- Raw literal count: ${stats.raw_literal_count.toLocaleString("en-US")}\n- Review-ready unique entry count: ${stats.review_entry_count.toLocaleString("en-US")}\n- Excluded internal/unproven count: ${stats.excluded_internal_count.toLocaleString("en-US")}\n- Duplicate occurrence count: ${stats.duplicate_occurrence_count.toLocaleString("en-US")}\n- Duplicate canonical-group count: ${stats.duplicate_group_count.toLocaleString("en-US")}\n- YES scenarios: ${stats.yes_scenarios}\n- Partial or missing scenarios: ${stats.partial_or_missing.length}\n- Question count: ${stats.question_count}\n- Answer-option count: ${stats.answer_option_count}\n- Safety entries: ${countSurface(/SAFETY/)}\n- Payment/QPay/paywall entries: ${countSurface(/PAYMENT\|QPAY\|PAYWALL/)}\n- Admin entries: ${countRole("ADMIN")}\n- Advisor entries: ${countRole("ADVISOR")}\n- Internal tester entries: ${countRole("INTERNAL_TESTER")}\n- Structural mixed-language signals: ${mixedCount}\n\n## Extraction architecture\n\nEvery scenario declares \`FULL_SURFACE\`, \`ISOLATED_COMPONENT\`, or \`ATTRIBUTE_ONLY\`. Sample report, upgrade offer, QPay, payment error, and diary confirmation use direct existing component renderers. Accessibility extraction reads attributes only. Diary home uses \`renderDiaryHome\`. Advisor fixtures use the local mock backend. Internal tester fixtures use the existing \`internalTest\` state gate.\n\n## Permitted app.js test exports\n\nOnly existing functions were added to CommonJS \`_internal\`; no function body or string changed:\n\n- \`renderDiaryHome\`\n- \`renderDiaryInput\`\n- \`renderDailySummaryConfirmation\`\n- \`renderSampleResultPreview\`\n- \`renderUpgradeOffer\`\n- \`renderWeightQpayPaymentBox\`\n- \`qpayStatusMessage\`\n\n## Required validation\n\n- \`git diff --check\`: PASS\n- \`node --check app.js\`: PASS\n- \`node --check tools/extract-rendered-copy.mjs\`: PASS\n- \`node tools/extract-rendered-copy.mjs\`: PASS\n- Focused catalog, safety, routing, pricing, and public-language tests: PASS\n- \`npm test\`: PASS\n- Final-head GitHub Actions: recorded in PR metadata and final handoff after push\n- Pricing and safety behavior: unchanged; focused tests PASS\n- Deploy: NOT PERFORMED\n- Merge: NOT PERFORMED\n`; |
| 378 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:45:- 7 хоногийн гүн зураглал |
| 379 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:87:- 7 хоногоор нарийвчлах боломж |
| 380 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:91:- 7 хоногийн гүн анализ |
| 381 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:122:- 7 хоногийн гүн зураглал |
| 382 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:124:- 7 хоногийн гүн анализаа нээх |
| 383 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:141:- 7 хоногийн гүн зураглал |
| 384 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:142:- 7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна |
| 385 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:169:- 7 хоногийн гүн анализ руу шилжих боломж |
| 386 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:237:- 7 хоногоор нарийвчлах |
| 387 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:284:- 7 хоногоор нарийвчлах |
| 388 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:427:- )">${...} төлөөд 7 хоногоор нарийвчлах</button> ${demoOnlyHtml(`<button class="button ghost" onclick="demoCompletePayment( |
| 389 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:433:- )">Засах</button> <button class="button ghost" onclick="setDailySummaryMode( |
| 390 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:435:- )">Нэмэх зүйл байна</button> ${ui.mode === "edit" ui.mode === "add" ? `<button class="button" onclick="confirmDailySummary( |
| 391 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:437:- )">Тийм, зөв</button> <button class="button ghost" onclick="setDailySummaryMode( |
| 392 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:438:- )">Эхний зураглал руу буцах</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div> </div> </section> `; } if (isOneTime && !hasOneTimeReportAccess()) { return renderOneTimePaywall({ mode, primary, primaryMechanism, tags }); } if (!isOneTime && !hasSevenDayAccess()) { return renderSevenDayPaywall(); } if (!isOneTime && !readiness.canGenerateFullReport) { return ` ${...} <section class="screen"> <div class="panel stack"> <h2>${...}</h2> <p class="muted">${...}</p> <div class="two-col"> <div class="mini-stat"><strong>${...}/7</strong><span>Өдөр бөглөсөн</span></div> <div class="mini-stat"><strong>${...}</strong><span>Хариултын хүрэлцээ</span></div> </div> ${...}</span>`).join("") `<span class="muted">Дохио харахад мэдээлэл бага байна.</span>`}</div></div>` : ""} <p>Энэ нь бүрэн тайлан биш тул 14 хоногийн туршилт өгөхгүй. Тэмдэглэлээ үргэлжлүүлж 5/7 өдөр хүрвэл бүрэн тайлан гарна.</p> <div class="actions"> <button class="button" onclick="startDiary()">Тэмдэглэлээ үргэлжлүүлэх</button> <button class="button ghost" onclick="setView( |
| 393 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:440:- )">Явц руу буцах</button> </div> </div> </section> `; } if (isOneTime) { return renderOneTimeReport({ mode, ranked, primary, secondary, primaryMechanism, tags }); } return ` ${...} <section class="screen"> <div class="panel"> <div class="report-section"> <h2>${...}</h2> <p class="muted">${...}</p> ${...} </div> <div class="report-section"> <h3>Хариултын хүрэлцээ</h3> <p>${...}</p> </div> <div class="report-section"> <h3>Эхний зураглал ба бодит ажиглалт</h3> <p>Эхний тестээр: ${...}.</p> <p>${...}`}</p> </div> ${...}</h3><ul>${...}</li>`).join("")}</ul></div>`).join("") : `<p class="muted">Баталгаажуулсан нэмэлт тайлбар байхгүй. Энэ тайлан бүтэцтэй хариултад суурилж байна.</p>`} </div>` : ""} <div class="report-section"> <h3>${...}</h3> ${...}</p><p>${...}</p><p>Энэ таны сул тал гэсэн үг биш. Тухайн зан үйл танд ${...} үүрэг гүйцэтгэж байж магадгүй.</p>` : `<p>Гол зураглал гаргахад мэдээлэл хангалтгүй байна.</p>`} </div> <div class="report-section"> <h3>Давхар нөлөөлж буй давтамжууд</h3> <div class="pill-row">${...}</span>`).join("") `<span class="muted">Одоогоор давхар давтамж харахад мэдээлэл хангалтгүй.</span>`}</div> </div> <div class="report-section"> <h3>Илэрч буй зан үйлүүд</h3> <ul>${...}</li>`).join("")}</ul> </div> <div class="report-section"> <h3>Энэ зан үйл ямар үүрэгтэй байж болох вэ?</h3> <p>Таны идэлт дараах үүргүүдийг гүйцэтгэж байна:</p> <ul>${...}</strong> — ${...}</li>`).join("")}</ul> </div> <div class="report-section"> <h3>Давтагддаг тойрог</h3> <div class="cycle-map">${...}</p>`).join("<span>↓</span>")}</div> </div> <div class="report-section"> <h3>Идэх хүсэл эхэлдэг нөхцөл</h3> <p class="muted">Нөхцлийн зураглал нь таны идэлтийг “ямар хоол идсэн бэ?” гэж биш, “ямар нөхцөл давтагдахад идэх сонголт өөрчлөгдөж байна вэ?” гэж харуулдаг.</p> ${...} </div> ${...} дэх өдөр</h3><ul>${...}</li>`).join("")}</ul></div>`).join("") : `<p class="muted">Баталгаажуулсан нэмэлт тайлбар байхгүй. Энэ тайлан тэмдэглэлийн бүтэцтэй хариултад суурилж байна.</p>`} </div>` : ""} <div class="report-section"> <h3>Идэхийн өмнөх 30 минут</h3> <p>Төлөвлөөгүй идэлтийн өмнөх 30 минутанд хамгийн их давтагдсан зүйлс:</p> <ul>${...}</li>`).join("")}</ul> </div> <div class="report-section"> <h3>Идсэний дараах 30 минут</h3> <ul>${...}</li>`).join("")}</ul> </div> ${...}</strong> — энэ нь яг ямар өдөр, ямар нөхцөлд давтагдаж байгааг харна. ${...}</li>`).join("") "<li>Өдөр тутмын нөхцлийн зураглал болон идэхийн өмнөх/дараах давтамжийг тодруулна.</li>"}</ul> <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div> </div>` : ""} <div class="report-section"> <h3>Асуудал яг юу биш вэ?</h3> <p>${...}</p> </div> <div class="report-section"> <h3>Өмнөх аргууд яагаад удаан ажиллаагүй байж болох вэ?</h3> <p>${...}</p> </div> <div class="report-section"> <h3>Одоогоор зайлсхийх зүйлс</h3> <ul>${...}</li>`).join("")}</ul> </div> <div class="report-section"> <h3>Эхэлж өөрчлөх хамгийн амар цэг</h3> <p>${...}</p> </div> <div class="report-section"> <h3>14 хоногийн туршилт</h3> <p><strong>Зорилго:</strong> ${...}</p> <p><strong>Өдөр бүр хийх:</strong></p> <ul>${...}</li>`).join("")}</ul> <p><strong>Ажиглах зүйл:</strong> ${...}</p> <p><strong>Амжилттай явж байгаагийн шинж:</strong> ${...}</p> <p><strong>Хэрвээ тасалдвал:</strong> ${...}</p> ${...} ${...} </div> ${...} <div class="actions"><button class="button secondary" onclick="setView( |
| 394 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:462:- ${...} <section class="screen"> <div class="panel stack choice-panel"> <h2>Та ямар түвшний зураглал авах вэ?</h2> <p class="muted">Нэг удаагийн зураглал нь эхний тайлан өгнө. 7 хоногийн зураглал бол илүү их тураах төлөвлөгөө биш, харин тэр эхний зураглалыг бодит өдрүүд дээр нарийвчлах богино ажиглалт.</p> <div class="choice-grid"> <div class="card stack choice-card"> <p class="choice-kicker">Хурдан эхлэх</p> <h3>Нэг удаагийн гүн анализ</h3> <div class="price-stack"> <p class="price-line"><span>Үндсэн үнэ</span> ${...}</p> <p class="price promo"><span>Нээлтийн урамшуулалт үнэ</span> ${...}</p> </div> <p class="muted">10–15 минутанд жин бууруулах оролдлого яг ямар үед гацаад байгааг эхлээд харна.</p> <div class="pill-row"><span class="pill">10–15 минут</span><span class="pill">Эхний хэсгийг үнэгүй харах</span><span class="pill">Бүрэн эхний тайлан</span></div> <ul> <li>Хамгийн тод давтагддаг нөхцөл</li> <li>Давхар нөлөөлж буй 1–2 зүйл</li> <li>Тэр идэлт тухайн үед юуг намдааж эсвэл нөхөж байж болох</li> <li>Одоогоор зайлсхийх зүйлс</li> <li>Эхний зөөлөн алхам</li> <li>14 хоногийн эхний туршилт</li> <li>7 хоногоор нарийвчлах боломж</li> </ul> <p class="muted">Энэ нь тухайн мөчийн хариултад суурилсан эхний зураглал. Бодит өдөр тутмын давтамжийг 7 хоногийн үнэлгээ илүү нарийвчилна.</p> <button class="button choice-button" onclick="choosePackage('one-time')">${...} төлөөд тайлангаа нээх</button> </div> <div class="card stack choice-card choice-card-featured"> <p class="choice-kicker">Илүү нарийвчилсан</p> <h3>7 хоногийн гүн анализ</h3> <div class="price-stack"> <p class="price-line"><span>Үндсэн үнэ</span> ${...}</p> <p class="price promo"><span>Нээлтийн урамшуулалт үнэ</span> ${...}</p> </div> <p class="muted">Орой бүр 3–5 минутын богино тэмдэглэлээр таны идэх хүсэл бодит амьдрал дээр ямар үед давтагдаж байгааг харна.</p> <div class="pill-row"><span class="pill">Эхлэх асуулт</span><span class="pill">Орой бүр 3–5 минут</span><span class="pill">5 өдөр бөглөсөн ч тайлан гарна</span></div> <ul> <li>Эхлэх богино асуулт</li> <li>7 өдөр богино тэмдэглэл</li> <li>Идэх хүсэл эхэлдэг нөхцөл</li> <li>Эхний зураглал ба ажиглалтын харьцуулалт</li> <li>Идэх хүсэл яг ямар үүрэгтэй давтагдаж байгааг тодруулах</li> <li>Илүү тод 14 хоногийн туршилт</li> </ul> <p class="muted">Энэ нь илүү их тураах төлөвлөгөө биш. Зүгээр л 7 хоногийн богино ажиглалт. Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана.</p> <button class="button choice-button" onclick="choosePackage('seven-day')">${...} төлөөд 7 хоногийн үнэлгээ эхлүүлэх</button> </div> </div> ${...} </div> </section> |
| 395 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:463:- ${...} <section class="screen"> <div class="panel stack"> <h2>Үнэлгээний хоёр зам</h2> <p class="muted">Эхлээд өөрт тохирох түвшнээ сонгоно. Нэг удаагийн зураглал нь одоогийн хариултаар эхний тайлан гаргана. 7 хоногийн үнэлгээ тэр зураглалыг бодит өдрүүдийн богино ажиглалтаар нарийвчилна.</p> <div class="two-col"> <div class="card"><h3>Нэг удаагийн гүн зураглал</h3><p>10–15 минутанд хамгийн тод давтагддаг нөхцөл, нөлөөлж буй 1–2 шалтгаан, одоогоор болгоомжлох зүйл, эхний зөөлөн алхам гарна.</p></div> <div class="card"><h3>7 хоногийн гүн зураглал</h3><p>Эхний богино асуулт + орой бүр 3–5 минутын тэмдэглэл. 5 өдөр бөглөсөн ч тайлан гарна, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана.</p></div> </div> <div class="card"> <h3>Харьцуулалт</h3> <div class="two-col"> <p><strong>Нэг удаагийн:</strong> тухайн мөчийн хариултад суурилсан эхний зураглал.</p> <p><strong>7 хоногийн:</strong> илүү их тураах төлөвлөгөө биш, бодит өдөр тутмын давтамжийг нарийвчлах богино ажиглалт.</p> </div> </div> ${...} <div class="actions"> <button class="button" onclick="setView('choice')">Сонголтоо хийх</button> <button class="button ghost" onclick="setView('landing')">Буцах</button> </div> </div> </section> |
| 396 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:477:- 7 хоногийн гүн анализ |
| 397 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./UI_MONGOLIAN_TEXTS.md:478:- 7 хоногоор нарийвчлах эрх |
| 398 | REMOVED_OR_REWRITTEN_TEST | ./tests/sleep-rhythm-scenario-focus.test.js:15:    sevenDayPaid: false, |
| 399 | REMOVED_OR_REWRITTEN_TEST | ./tests/sleep-rhythm-scenario-focus.test.js:19:    diaryEntries: [], |
| 400 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-sprint-33-second-virtual-cohort.mjs:281:    "7 хоногоор нарийвчлах", |
| 401 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-sprint-33-second-virtual-cohort.mjs:334:    sevenDayPaid: true, |
| 402 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-sprint-33-second-virtual-cohort.mjs:340:    diaryEntries: [], |
| 403 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:16:- Surface: SEVEN_DAY_PAYWALL |
| 404 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:18:- Scenario: seven-day-paywall |
| 405 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:19:- Render source: renderSevenDayPaywall |
| 406 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:25:- Source function/object: renderSevenDayPaywall |
| 407 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:27:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 408 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:75:- Surface: SEVEN_DAY_PAYWALL |
| 409 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:77:- Scenario: seven-day-paywall |
| 410 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:78:- Render source: renderSevenDayPaywall |
| 411 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:86:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 412 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:134:- Surface: SEVEN_DAY_PAYWALL |
| 413 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:136:- Scenario: seven-day-paywall |
| 414 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:137:- Render source: renderSevenDayPaywall |
| 415 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:145:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 416 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:193:- Surface: SEVEN_DAY_PAYWALL |
| 417 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:195:- Scenario: seven-day-paywall |
| 418 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:196:- Render source: renderSevenDayPaywall |
| 419 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:204:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 420 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:252:- Surface: SEVEN_DAY_PAYWALL |
| 421 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:254:- Scenario: seven-day-paywall |
| 422 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:255:- Render source: renderSevenDayPaywall |
| 423 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:263:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 424 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:311:- Surface: SEVEN_DAY_PAYWALL |
| 425 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:313:- Scenario: seven-day-paywall |
| 426 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:314:- Render source: renderSevenDayPaywall |
| 427 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:320:- Source function/object: renderSevenDayPaywall |
| 428 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:322:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 429 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:370:- Surface: SEVEN_DAY_PAYWALL |
| 430 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:372:- Scenario: seven-day-paywall |
| 431 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:373:- Render source: renderSevenDayPaywall |
| 432 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:381:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 433 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:429:- Surface: SEVEN_DAY_PAYWALL |
| 434 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:431:- Scenario: seven-day-paywall |
| 435 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:432:- Render source: renderSevenDayPaywall |
| 436 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:440:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 437 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:488:- Surface: SEVEN_DAY_PAYWALL |
| 438 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:490:- Scenario: seven-day-paywall |
| 439 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:491:- Render source: renderSevenDayPaywall |
| 440 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:499:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 441 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:539:> 7 хоногоор нарийвчлах |
| 442 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:548:- Scenario: upgrade-paywall |
| 443 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:549:- Render source: renderUpgradePaywall |
| 444 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:557:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 445 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:574:> 7 хоногоор нарийвчлах |
| 446 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:606:- Scenario: upgrade-paywall |
| 447 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:607:- Render source: renderUpgradePaywall |
| 448 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:615:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 449 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:632:> 7 хоногоор нарийвчлах |
| 450 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:665:- Scenario: upgrade-paywall |
| 451 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:666:- Render source: renderUpgradePaywall |
| 452 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:674:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 453 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:724:- Scenario: upgrade-paywall |
| 454 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:725:- Render source: renderUpgradePaywall |
| 455 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:733:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 456 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:738:> sevenDayAnchor: "69,000₮", |
| 457 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:783:- Scenario: upgrade-paywall |
| 458 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:784:- Render source: renderUpgradePaywall |
| 459 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:792:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 460 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:811:> Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. |
| 461 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:833:> Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. |
| 462 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:842:- Scenario: upgrade-paywall |
| 463 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:843:- Render source: renderUpgradePaywall |
| 464 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:851:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 465 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:869:> Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. |
| 466 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:901:- Scenario: upgrade-paywall |
| 467 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:902:- Render source: renderUpgradePaywall |
| 468 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:910:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 469 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:927:> Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. |
| 470 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:960:- Scenario: upgrade-paywall |
| 471 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:961:- Render source: renderUpgradePaywall |
| 472 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:967:- Source function/object: renderUpgradePaywall |
| 473 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:969:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 474 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1019:- Scenario: upgrade-paywall |
| 475 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1020:- Render source: renderUpgradePaywall |
| 476 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1026:- Source function/object: renderUpgradePaywall |
| 477 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1028:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 478 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1078:- Scenario: upgrade-paywall |
| 479 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1079:- Render source: renderUpgradePaywall |
| 480 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1085:- Source function/object: renderUpgradePaywall |
| 481 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1087:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 482 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1137:- Scenario: upgrade-paywall |
| 483 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1138:- Render source: renderUpgradePaywall |
| 484 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1146:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 485 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1165:> 19,900₮ төлөөд 7 хоногоор нарийвчлах |
| 486 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1187:> 19,900₮ төлөөд 7 хоногоор нарийвчлах |
| 487 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1196:- Scenario: upgrade-paywall |
| 488 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1197:- Render source: renderUpgradePaywall |
| 489 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1205:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 490 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1223:> 19,900₮ төлөөд 7 хоногоор нарийвчлах |
| 491 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1255:- Scenario: upgrade-paywall |
| 492 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1256:- Render source: renderUpgradePaywall |
| 493 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1262:- Source function/object: renderUpgradePaywall |
| 494 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1264:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 495 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1281:> 19,900₮ төлөөд 7 хоногоор нарийвчлах |
| 496 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1314:- Scenario: upgrade-paywall |
| 497 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1315:- Render source: renderUpgradePaywall |
| 498 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_03.md:1323:- Render proof: renderUpgradePaywall via upgrade-paywall [FULL_SURFACE] |
| 499 | REMOVED_OR_REWRITTEN_TEST | ./tests/sample-preview-choice-clarity.test.js:15:    _internal.renderSevenDayStart() |
| 500 | REMOVED_OR_REWRITTEN_TEST | ./tests/sample-preview-choice-clarity.test.js:33:    diaryEntries: [] |
| 501 | REMOVED_OR_REWRITTEN_TEST | ./tests/sample-preview-choice-clarity.test.js:48:    diaryEntries: [] |
| 502 | REMOVED_OR_REWRITTEN_TEST | ./tests/sample-preview-choice-clarity.test.js:54:    packageType: "seven-day", |
| 503 | REMOVED_OR_REWRITTEN_TEST | ./tests/sample-preview-choice-clarity.test.js:57:    diaryEntries: Array.from({ length: 5 }, (_, index) => ({ |
| 504 | REMOVED_OR_REWRITTEN_TEST | ./tests/sample-preview-choice-clarity.test.js:123:  assert(!oneTimeText.includes("7 хоногоор нарийвчлах")); |
| 505 | REMOVED_OR_REWRITTEN_TEST | ./tests/result-comprehension.test.js:15:    sevenDayPaid: false, |
| 506 | REMOVED_OR_REWRITTEN_TEST | ./tests/result-comprehension.test.js:21:    diaryEntries: [], |
| 507 | REMOVED_OR_REWRITTEN_TEST | ./tests/result-comprehension.test.js:66:    "7 хоногоор нарийвчлах", |
| 508 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./COMMERCIAL_FLOW_QA.md:29:One-Time shows “Нэг удаагийн гүн анализ”, “Үндсэн үнэ 29,000₮”, and “Нээлтийн урамшуулалт үнэ 9,900₮”. 7-Day shows “7 хоногийн гүн анализ”, “Үндсэн үнэ 69,000₮”, and “Нээлтийн урамшуулалт үнэ 29,000₮”. The 7-Day card explains evening diary effort, 5-day sufficiency, and non-calorie tracking. |
| 509 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./COMMERCIAL_FLOW_QA.md:183:Upgrade CTA is visible after the report. Upgrade price is 19,900₮. Copy says “Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.” Demo upgrade unlocks diary onboarding. Total paid logic feels fair because 9,900₮ + 19,900₮ is close to 29,000₮. |
| 510 | REMOVED_OR_REWRITTEN_TEST | ./tests/domain-branding-readiness.test.js:49:    sevenDayPaid: false, |
| 511 | REMOVED_OR_REWRITTEN_TEST | ./tests/domain-branding-readiness.test.js:67:    diaryEntries: [], |
| 512 | REMOVED_OR_REWRITTEN_TEST | ./tests/domain-branding-readiness.test.js:155:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged"); |
| 513 | REMOVED_OR_REWRITTEN_TEST | ./tests/domain-branding-readiness.test.js:156:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged"); |
| 514 | REMOVED_OR_REWRITTEN_TEST | ./tests/domain-branding-readiness.test.js:166:assert(appSource.includes("return Boolean(isInternalTestMode() \|\| state.sevenDayPaid \|\| state.upgradePaid \|\| access.hasSevenDayAccess);"), "seven-day access helper source must remain unchanged"); |
| 515 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp78-report-inference-quality.test.js:16:    sevenDayPaid: false, |
| 516 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp78-report-inference-quality.test.js:25:    diaryEntries: [], |
| 517 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-audit-fixes.test.js:35:  packageType: "one-time", view: "report", oneTimePaid: false, sevenDayPaid: false, |
| 518 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-audit-fixes.test.js:37:  preliminary: [], diaryEntries: [], stageVoiceSummaries: {} |
| 519 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-audit-fixes.test.js:66:const validRoles = new Set(["PUBLIC_USER", "PAID_USER", "SEVEN_DAY_USER", "ADVISOR", "ADMIN", "INTERNAL_TESTER"]); |
| 520 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-audit-fixes.test.js:79:  "seven-day-paywall", "seven-day-start", "diary-home-zero", "diary-home-partial", "diary-home-complete", "diary-single", "diary-multi", |
| 521 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-audit-fixes.test.js:81:  "diary-confirmation-edit", "diary-confirmation-add", "insufficient-report", "limited-report", |
| 522 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-audit-fixes.test.js:82:  "usable-limited-report", "full-seven-day-report", "upgrade-offer-present", "upgrade-offer-absent", "upgrade-paywall", "lead-capture", |
| 523 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-audit-fixes.test.js:98:  assert.strictEqual(byId(id).render_source, "renderDiaryHome"); |
| 524 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-audit-fixes.test.js:103:assert(read("tools/extract-rendered-copy.mjs").includes("diaryQuestionIndex"), "actual diaryQuestionIndex field must be used"); |
| 525 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-audit-fixes.test.js:112:assert(upgradeEntries.every(e => e.render_source === "renderUpgradeOffer")); |
| 526 | REMOVED_OR_REWRITTEN_TEST | ./tests/deep-mongolian-copy-rewrite.test.js:72:    sevenDayPaid: false, |
| 527 | REMOVED_OR_REWRITTEN_TEST | ./tests/deep-mongolian-copy-rewrite.test.js:75:    diaryEntries: [] |
| 528 | REMOVED_OR_REWRITTEN_TEST | ./tests/deep-mongolian-copy-rewrite.test.js:85:    sevenDayPaid: false, |
| 529 | REMOVED_OR_REWRITTEN_TEST | ./tests/deep-mongolian-copy-rewrite.test.js:95:    diaryEntries: [] |
| 530 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:79:    diaryEntries: persona.diaryEntries \|\| [] |
| 531 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:134:    packageType: "seven-day", |
| 532 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:151:    diaryEntries: repeat(5, day => diary(day, { |
| 533 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:170:    packageType: "seven-day", |
| 534 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:181:    diaryEntries: repeat(5, day => diary(day, { |
| 535 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:217:    packageType: "seven-day", |
| 536 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:229:    diaryEntries: repeat(5, day => diary(day, { |
| 537 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:243:    packageType: "seven-day", |
| 538 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:253:    diaryEntries: repeat(5, day => diary(day, { |
| 539 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:287:    packageType: "seven-day", |
| 540 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:297:    diaryEntries: repeat(5, day => diary(day, { |
| 541 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:333:    packageType: "seven-day", |
| 542 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:342:    diaryEntries: repeat(5, day => diary(day, { |
| 543 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:356:    packageType: "seven-day", |
| 544 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:366:    diaryEntries: repeat(5, day => diary(day, { |
| 545 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:397:    assert(!result.text.includes("7 хоногоор нарийвчлах"), `${persona.name}: WP62 one-time report should not mix in 7-day CTA`); |
| 546 | REMOVED_OR_REWRITTEN_TEST | ./tests/ten-person-simulation-audit.test.js:399:  if (persona.packageType === "seven-day" && result.mode === "deep") { |
| 547 | REMOVED_OR_REWRITTEN_TEST | ./tests/cycle-question-mapping.test.js:14:    diaryEntries: [], |
| 548 | REMOVED_OR_REWRITTEN_TEST | ./tests/cycle-question-mapping.test.js:15:    diaryDraft: {} |
| 549 | REMOVED_PRODUCTION | ./app.js:16:  sevenDay: "29,000₮", |
| 550 | REMOVED_PRODUCTION | ./app.js:17:  sevenDayAnchor: "69,000₮", |
| 551 | REMOVED_PRODUCTION | ./app.js:79:  "seven-day": { |
| 552 | REMOVED_PRODUCTION | ./app.js:80:    productType: "seven_day", |
| 553 | REMOVED_PRODUCTION | ./app.js:81:    label: "7 хоногийн гүн анализ", |
| 554 | REMOVED_PRODUCTION | ./app.js:82:    priceLabel: PRICING.sevenDay, |
| 555 | REMOVED_PRODUCTION | ./app.js:87:    label: "7 хоногоор нарийвчлах эрх", |
| 556 | REMOVED_PRODUCTION | ./app.js:945:  const readiness = reportReadiness(currentState.diaryEntries \|\| []); |
| 557 | REMOVED_PRODUCTION | ./app.js:993:  (scopedState.diaryEntries \|\| []).forEach(entry => { |
| 558 | REMOVED_PRODUCTION | ./app.js:1075:  diaryDay: 1, |
| 559 | REMOVED_PRODUCTION | ./app.js:1076:  diaryQuestionIndex: 0, |
| 560 | REMOVED_PRODUCTION | ./app.js:1077:  diaryDraft: {}, |
| 561 | REMOVED_PRODUCTION | ./app.js:1082:  diaryEntries: [], |
| 562 | REMOVED_PRODUCTION | ./app.js:1084:  sevenDayPaid: false, |
| 563 | REMOVED_PRODUCTION | ./app.js:1284:  state.view = packageType === "one-time" ? "oneTimeStart" : "sevenDayStart"; |
| 564 | REMOVED_PRODUCTION | ./app.js:1416:    state.view = packageType === "seven-day" ? "sevenDayStart" : "oneTimeStart"; |
| 565 | REMOVED_PRODUCTION | ./app.js:1422:  const assessment = mockBackend.createAssessment(packageType === "seven-day" ? "seven_day" : "one_time", { |
| 566 | REMOVED_PRODUCTION | ./app.js:1452:  const productType = kind === "one-time" ? "one_time" : kind === "seven-day" ? "seven_day" : "upgrade"; |
| 567 | REMOVED_PRODUCTION | ./app.js:1467:  } else if (kind === "seven-day") { |
| 568 | REMOVED_PRODUCTION | ./app.js:1468:    state.sevenDayPaid = true; |
| 569 | REMOVED_PRODUCTION | ./app.js:1469:    state.packageType = "seven-day"; |
| 570 | REMOVED_PRODUCTION | ./app.js:1470:    state.view = state.preliminary.length ? "unlock" : "sevenDayStart"; |
| 571 | REMOVED_PRODUCTION | ./app.js:1473:    state.sevenDayPaid = true; |
| 572 | REMOVED_PRODUCTION | ./app.js:1474:    state.packageType = "seven-day"; |
| 573 | REMOVED_PRODUCTION | ./app.js:1684:function hasSevenDayAccess() { |
| 574 | REMOVED_PRODUCTION | ./app.js:1686:  return Boolean(isInternalTestMode() \|\| state.sevenDayPaid \|\| state.upgradePaid \|\| access.hasSevenDayAccess); |
| 575 | REMOVED_PRODUCTION | ./app.js:1712:  if (packageType === "seven-day") return hasSevenDayAccess(); |
| 576 | REMOVED_PRODUCTION | ./app.js:1713:  return hasOneTimeReportAccess() \|\| hasSevenDayAccess() \|\| hasUpgradeAccess(); |
| 577 | REMOVED_PRODUCTION | ./app.js:1717:  return packageType === "seven-day" ? "sevenDayStart" : "oneTimeStart"; |
| 578 | REMOVED_PRODUCTION | ./app.js:1725:    "diaryHome", |
| 579 | REMOVED_PRODUCTION | ./app.js:1727:    "reportReady", |
| 580 | REMOVED_PRODUCTION | ./app.js:1875:  if (state.packageType !== "seven-day") return stageOneQuestions.filter(visible).map(prepare); |
| 581 | REMOVED_PRODUCTION | ./app.js:1923:    ...calculateDiarySafetyFlags(state.diaryEntries) |
| 582 | REMOVED_PRODUCTION | ./app.js:2015:function generateDailySummaryBullets(draft = {}) { |
| 583 | REMOVED_PRODUCTION | ./app.js:2106:    ...(kind === "stage" ? { checkpointId: id } : { diaryDay: dayNumber, promptId: id }), |
| 584 | REMOVED_PRODUCTION | ./app.js:2175:function menstrualCycleEvidence(answers = state.stageAnswers, diaryEntries = state.diaryEntries, diaryDraft = state.diaryDraft) { |
| 585 | REMOVED_PRODUCTION | ./app.js:2180:    ...asArray(diaryDraft.food_function), |
| 586 | REMOVED_PRODUCTION | ./app.js:2181:    ...diaryEntries.flatMap(entry => asArray(entry.food_function)) |
| 587 | REMOVED_PRODUCTION | ./app.js:2202:  const diaryCycleValues = diaryEntries.flatMap(entry => [ |
| 588 | REMOVED_PRODUCTION | ./app.js:2277:    state.diaryEntries.forEach(entry => { |
| 589 | REMOVED_PRODUCTION | ./app.js:2326:    diaryEntries: includeDiary ? state.diaryEntries : [] |
| 590 | REMOVED_PRODUCTION | ./app.js:2549:          <div class="card"><h3>7 хоногийн гүн зураглал</h3><p>Эхний богино асуулт + орой бүр 3–5 минутын тэмдэглэл. 5 өдөр бөглөсөн ч тайлан гарна, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана.</p></div> |
| 591 | REMOVED_PRODUCTION | ./app.js:2619:              <li>7 хоногоор нарийвчлах боломж</li> |
| 592 | REMOVED_PRODUCTION | ./app.js:2626:            <h3>7 хоногийн гүн анализ</h3> |
| 593 | REMOVED_PRODUCTION | ./app.js:2628:              <p class="price-line"><span>Үндсэн үнэ</span> ${PRICING.sevenDayAnchor}</p> |
| 594 | REMOVED_PRODUCTION | ./app.js:2629:              <p class="price promo"><span>Нээлтийн урамшуулалт үнэ</span> ${PRICING.sevenDay}</p> |
| 595 | REMOVED_PRODUCTION | ./app.js:2642:            <button class="button choice-button" onclick="choosePackage('seven-day')">${PRICING.sevenDay} төлөөд 7 хоногийн үнэлгээ эхлүүлэх</button> |
| 596 | REMOVED_PRODUCTION | ./app.js:2870:function renderSevenDayPaywall() { |
| 597 | REMOVED_PRODUCTION | ./app.js:2872:    ${topbar(0, "7 хоногийн гүн зураглал")} |
| 598 | REMOVED_PRODUCTION | ./app.js:2876:        <h2>7 хоногийн гүн анализаа нээх</h2> |
| 599 | REMOVED_PRODUCTION | ./app.js:2878:          <p class="price-line"><span>Үндсэн үнэ</span> ${PRICING.sevenDayAnchor}</p> |
| 600 | REMOVED_PRODUCTION | ./app.js:2879:          <p class="price promo"><span>Нээлтийн урамшуулалт үнэ</span> ${PRICING.sevenDay}</p> |
| 601 | REMOVED_PRODUCTION | ./app.js:2890:          <button class="button secondary" onclick="startLeadCapture('seven-day')">${PRICING.sevenDay} төлөөд эхлүүлэх</button> |
| 602 | REMOVED_PRODUCTION | ./app.js:2891:          ${demoOnlyHtml(`<button class="button ghost" onclick="demoCompletePayment('seven-day')">Дотоод туршилтаар нээх</button>`)} |
| 603 | REMOVED_PRODUCTION | ./app.js:2900:function renderSevenDayStart() { |
| 604 | REMOVED_PRODUCTION | ./app.js:2901:  if (!hasSevenDayAccess()) return renderSevenDayPaywall(); |
| 605 | REMOVED_PRODUCTION | ./app.js:2903:    ${topbar(0, "7 хоногийн гүн зураглал")} |
| 606 | REMOVED_PRODUCTION | ./app.js:2906:        <h2>7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна</h2> |
| 607 | REMOVED_PRODUCTION | ./app.js:2917:          <button class="button" onclick="beginAssessment('seven-day')">7 хоногийн үнэлгээ эхлүүлэх</button> |
| 608 | REMOVED_PRODUCTION | ./app.js:3041:  const current = state.diaryDraft[question.field] \|\| []; |
| 609 | REMOVED_PRODUCTION | ./app.js:3044:  state.diaryDraft[question.field] = next; |
| 610 | REMOVED_PRODUCTION | ./app.js:3107:        ${safety.mode === "urgent" ? `<button class="button danger" onclick="setView('report')">Яаралтай зөвлөмж харах</button>` : `<button class="button" onclick="setView('${hasSevenDayAccess() ? "unlock" : "sevenDayStart"}')">7 хоногийн тэмдэглэл нээх</button>`} |
| 611 | REMOVED_PRODUCTION | ./app.js:3116:  if (!hasSevenDayAccess()) return renderSevenDayPaywall(); |
| 612 | REMOVED_PRODUCTION | ./app.js:3150:  if (!hasSevenDayAccess()) { |
| 613 | REMOVED_PRODUCTION | ./app.js:3151:    state.view = "sevenDayStart"; |
| 614 | REMOVED_PRODUCTION | ./app.js:3157:  state.diaryDay = Math.min(7, Math.max(1, state.diaryEntries.length + 1)); |
| 615 | REMOVED_PRODUCTION | ./app.js:3158:  state.diaryQuestionIndex = 0; |
| 616 | REMOVED_PRODUCTION | ./app.js:3159:  state.diaryDraft = {}; |
| 617 | REMOVED_PRODUCTION | ./app.js:3168:  if (state.diaryDraft.unplanned_eating_count === "Үгүй") { |
| 618 | REMOVED_PRODUCTION | ./app.js:3189:  if (state.diaryDraft.cycle_today_link && state.diaryDraft.cycle_today_link !== "Үгүй") { |
| 619 | REMOVED_PRODUCTION | ./app.js:3197:  state.diaryDraft[question.field] = value; |
| 620 | REMOVED_PRODUCTION | ./app.js:3202:function setDiaryDraftValue(id, value) { |
| 621 | REMOVED_PRODUCTION | ./app.js:3204:  state.diaryDraft[question.field] = value; |
| 622 | REMOVED_PRODUCTION | ./app.js:3210:  if (state.diaryQuestionIndex >= questions.length - 1) { |
| 623 | REMOVED_PRODUCTION | ./app.js:3214:  state.diaryQuestionIndex += 1; |
| 624 | REMOVED_PRODUCTION | ./app.js:3220:  state.diaryQuestionIndex = Math.max(0, state.diaryQuestionIndex - 1); |
| 625 | REMOVED_PRODUCTION | ./app.js:3228:    day_number: state.diaryDay, |
| 626 | REMOVED_PRODUCTION | ./app.js:3230:    ...state.diaryDraft, |
| 627 | REMOVED_PRODUCTION | ./app.js:3235:      entry.pattern_probes[question.field] = state.diaryDraft[question.field]; |
| 628 | REMOVED_PRODUCTION | ./app.js:3240:  state.diaryEntries = state.diaryEntries.filter(item => item.day_number !== state.diaryDay).concat(entry).sort((a, b) => a.day_number - b.day_number); |
| 629 | REMOVED_PRODUCTION | ./app.js:3242:  state.diaryDraft = {}; |
| 630 | REMOVED_PRODUCTION | ./app.js:3243:  state.diaryQuestionIndex = 0; |
| 631 | REMOVED_PRODUCTION | ./app.js:3244:  state.diaryDay = Math.min(7, state.diaryEntries.length + 1); |
| 632 | REMOVED_PRODUCTION | ./app.js:3245:  state.view = state.diaryEntries.length >= 5 ? "reportReady" : "diaryHome"; |
| 633 | REMOVED_PRODUCTION | ./app.js:3250:function reportReadiness(entries = state.diaryEntries) { |
| 634 | REMOVED_PRODUCTION | ./app.js:3293:  const count = state.diaryEntries.length; |
| 635 | REMOVED_PRODUCTION | ./app.js:3317:function renderDiaryHome() { |
| 636 | REMOVED_PRODUCTION | ./app.js:3320:    ${topbar(Math.round((state.diaryEntries.length / 7) * 100), "7 хоногийн тэмдэглэл")} |
| 637 | REMOVED_PRODUCTION | ./app.js:3327:          <div class="mini-stat"><strong>${state.diaryEntries.length}/7</strong><span>Өдөр бөглөсөн</span></div> |
| 638 | REMOVED_PRODUCTION | ./app.js:3331:          <button class="button" onclick="startDiary()" ${state.diaryEntries.length >= 7 ? "disabled" : ""}>Дараагийн өдөр бөглөх</button> |
| 639 | REMOVED_PRODUCTION | ./app.js:3332:          <button class="button secondary" onclick="setView('${readiness.canGenerateFullReport ? "reportReady" : "report"}')">${readiness.canGenerateFullReport ? "Тайлан харах" : "Одоогийн зураглал харах"}</button> |
| 640 | REMOVED_PRODUCTION | ./app.js:3339:function renderReportReady() { |
| 641 | REMOVED_PRODUCTION | ./app.js:3348:          <button class="button ghost" onclick="setView('diaryHome')">Тэмдэглэлийн явц руу буцах</button> |
| 642 | REMOVED_PRODUCTION | ./app.js:3357:  const question = questions[state.diaryQuestionIndex]; |
| 643 | REMOVED_PRODUCTION | ./app.js:3358:  const progress = Math.round(((state.diaryEntries.length + state.diaryQuestionIndex / questions.length) / 7) * 100); |
| 644 | REMOVED_PRODUCTION | ./app.js:3359:  const backButton = state.diaryQuestionIndex > 0 |
| 645 | REMOVED_PRODUCTION | ./app.js:3363:    ${topbar(progress, `Тэмдэглэлийн ${state.diaryDay} дэх өдөр`)} |
| 646 | REMOVED_PRODUCTION | ./app.js:3368:          <p class="muted">Асуулт ${state.diaryQuestionIndex + 1}/${questions.length}</p> |
| 647 | REMOVED_PRODUCTION | ./app.js:3370:          ${renderDiaryInput(question)} |
| 648 | REMOVED_PRODUCTION | ./app.js:3372:            <button class="button" onclick="nextDiaryQuestion()">${state.diaryQuestionIndex === questions.length - 1 ? "Өдрийг хадгалах" : "Үргэлжлүүлэх"}</button> |
| 649 | REMOVED_PRODUCTION | ./app.js:3387:function renderDiaryInput(question) { |
| 650 | REMOVED_PRODUCTION | ./app.js:3388:  const value = state.diaryDraft[question.field] ?? (question.type === "multi" ? [] : ""); |
| 651 | REMOVED_PRODUCTION | ./app.js:3390:    return renderDailySummaryConfirmation(question); |
| 652 | REMOVED_PRODUCTION | ./app.js:3393:    return `<label class="field"><span class="muted">1-2 өгүүлбэр хангалттай</span><textarea id="input-${question.id}" oninput="setDiaryDraftValue('${question.id}', this.value)">${escapeHtml(value)}</textarea></label><p class="muted">Хэрвээ санахгүй эсвэл бичмээргүй байвал хоосон орхиод үргэлжлүүлж болно.</p>`; |
| 653 | REMOVED_PRODUCTION | ./app.js:3416:function renderDailySummaryConfirmation(question) { |
| 654 | REMOVED_PRODUCTION | ./app.js:3417:  const existing = state.diaryDraft.confirmedSummaryObject; |
| 655 | REMOVED_PRODUCTION | ./app.js:3419:  const reflection = String(state.diaryDraft.raw_reflection \|\| "").trim(); |
| 656 | REMOVED_PRODUCTION | ./app.js:3426:          <button class="button secondary" onclick="confirmDailySummary('confirm')">Үргэлжлүүлэх</button> |
| 657 | REMOVED_PRODUCTION | ./app.js:3432:  const bullets = existing?.aiSummaryBullets \|\| generateDailySummaryBullets(state.diaryDraft); |
| 658 | REMOVED_PRODUCTION | ./app.js:3439:      ${ui.mode === "edit" \|\| ui.mode === "add" ? `<label class="field"><span class="muted">${ui.mode === "edit" ? "Зассан ойлголтоо мөр мөрөөр бичнэ үү" : "Нэмэх нэг зүйлээ бичнэ үү"}</span><textarea id="input-D-SUM01-${ui.mode}" oninput="setDailySummaryText(this.value)">${escapeHtml(ui.text \|\| "")}</textarea></label>` : ""} |
| 659 | REMOVED_PRODUCTION | ./app.js:3441:        <button class="button secondary" onclick="confirmDailySummary('confirm')">Үргэлжлүүлэх</button> |
| 660 | REMOVED_PRODUCTION | ./app.js:3442:        <button class="button ghost" onclick="setDailySummaryMode('edit')">Засах</button> |
| 661 | REMOVED_PRODUCTION | ./app.js:3444:        <button class="button ghost" onclick="setDailySummaryMode('add')">Нэмэх зүйл байна</button> |
| 662 | REMOVED_PRODUCTION | ./app.js:3445:        ${ui.mode === "edit" \|\| ui.mode === "add" ? `<button class="button" onclick="confirmDailySummary('${ui.mode}')">Баталгаажуулах</button>` : ""} |
| 663 | REMOVED_PRODUCTION | ./app.js:3451:function setDailySummaryMode(mode) { |
| 664 | REMOVED_PRODUCTION | ./app.js:3457:function setDailySummaryText(text) { |
| 665 | REMOVED_PRODUCTION | ./app.js:3462:function confirmDailySummary(mode) { |
| 666 | REMOVED_PRODUCTION | ./app.js:3464:  const aiSummaryBullets = generateDailySummaryBullets(state.diaryDraft); |
| 667 | REMOVED_PRODUCTION | ./app.js:3465:  state.diaryDraft.confirmedSummaryObject = createConfirmedSummaryObject({ |
| 668 | REMOVED_PRODUCTION | ./app.js:3468:    dayNumber: state.diaryDay, |
| 669 | REMOVED_PRODUCTION | ./app.js:3469:    rawText: state.diaryDraft.raw_reflection \|\| "", |
| 670 | REMOVED_PRODUCTION | ./app.js:3470:    structured: state.diaryDraft, |
| 671 | REMOVED_PRODUCTION | ./app.js:3476:  state.diaryDraft.summary_confirmation = mode === "edit" ? "Засах" : mode === "add" ? "Нэмэх зүйл байна" : "Тийм, зөв"; |
| 672 | REMOVED_PRODUCTION | ./app.js:3502:  const entries = state.diaryEntries; |
| 673 | REMOVED_PRODUCTION | ./app.js:3519:function confirmedNarrativeEvidence(entries = state.diaryEntries) { |
| 674 | REMOVED_PRODUCTION | ./app.js:3524:      day: summary.diaryDay, |
| 675 | REMOVED_PRODUCTION | ./app.js:3561:function allReportTags(entries = state.diaryEntries) { |
| 676 | REMOVED_PRODUCTION | ./app.js:3588:function triggerMapRows(entries = state.diaryEntries) { |
| 677 | REMOVED_PRODUCTION | ./app.js:3636:function surfaceBehaviors(entries = state.diaryEntries, tags = allReportTags(entries)) { |
| 678 | REMOVED_PRODUCTION | ./app.js:3647:function hiddenFunctionItems(entries = state.diaryEntries, tags = allReportTags(entries)) { |
| 679 | REMOVED_PRODUCTION | ./app.js:3676:function beforeEatingItems(entries = state.diaryEntries, tags = allReportTags(entries)) { |
| 680 | REMOVED_PRODUCTION | ./app.js:3691:function afterEatingItems(entries = state.diaryEntries, tags = allReportTags(entries)) { |
| 681 | REMOVED_PRODUCTION | ./app.js:4058:  return surfaceBehaviors(state.diaryEntries, tags) |
| 682 | REMOVED_PRODUCTION | ./app.js:4307:                <li>7 хоногийн гүн анализ руу шилжих боломж</li> |
| 683 | REMOVED_PRODUCTION | ./app.js:4412:function renderUpgradeOffer() { |
| 684 | REMOVED_PRODUCTION | ./app.js:4413:  if (!hasOneTimeReportAccess() \|\| hasSevenDayAccess()) return ""; |
| 685 | REMOVED_PRODUCTION | ./app.js:4416:      <p class="choice-kicker">7 хоногоор нарийвчлах</p> |
| 686 | REMOVED_PRODUCTION | ./app.js:4419:      <p>Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.</p> |
| 687 | REMOVED_PRODUCTION | ./app.js:4422:        <button class="button secondary" onclick="startSevenDayRefinement()">${PRICING.upgrade} төлөөд 7 хоногоор нарийвчлах</button> |
| 688 | REMOVED_PRODUCTION | ./app.js:4428:function renderUpgradePaywall() { |
| 689 | REMOVED_PRODUCTION | ./app.js:4430:    ${topbar(100, "7 хоногоор нарийвчлах")} |
| 690 | REMOVED_PRODUCTION | ./app.js:4433:        <p class="choice-kicker">7 хоногоор нарийвчлах</p> |
| 691 | REMOVED_PRODUCTION | ./app.js:4435:        <p class="price"><span class="price-label">Нарийвчлах үнэ:</span> ${PRICING.upgrade} <span>7 хоногийн нээлтийн үнэ ${PRICING.sevenDay}</span></p> |
| 692 | REMOVED_PRODUCTION | ./app.js:4436:        <p>Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.</p> |
| 693 | REMOVED_PRODUCTION | ./app.js:4445:          <button class="button secondary" onclick="startLeadCapture('upgrade')">${PRICING.upgrade} төлөөд 7 хоногоор нарийвчлах</button> |
| 694 | REMOVED_PRODUCTION | ./app.js:6513:          <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div> |
| 695 | REMOVED_PRODUCTION | ./app.js:6516:        ${isOneTime ? renderUpgradeOffer() : ""} |
| 696 | REMOVED_PRODUCTION | ./app.js:6519:        <div class="actions"><button class="button secondary" onclick="setView('${isOneTime ? "choice" : "diaryHome"}')">${isOneTime ? "Сонголт руу буцах" : "Тэмдэглэл рүү буцах"}</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div> |
| 697 | REMOVED_PRODUCTION | ./app.js:6854:          <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div> |
| 698 | REMOVED_PRODUCTION | ./app.js:6902:          <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div> |
| 699 | REMOVED_PRODUCTION | ./app.js:6905:        ${renderUpgradeOffer()} |
| 700 | REMOVED_PRODUCTION | ./app.js:7563:  const hiddenItems = hiddenFunctionItems(state.diaryEntries, tags).slice(0, 3); |
| 701 | REMOVED_PRODUCTION | ./app.js:7564:  const surfaceItems = surfaceBehaviors(state.diaryEntries, tags).slice(0, 3); |
| 702 | REMOVED_PRODUCTION | ./app.js:7565:  const beforeItems = beforeEatingItems(state.diaryEntries, tags).slice(0, 5); |
| 703 | REMOVED_PRODUCTION | ./app.js:7566:  const afterItems = afterEatingItems(state.diaryEntries, tags).slice(0, 4); |
| 704 | REMOVED_PRODUCTION | ./app.js:7652:  if (!isOneTime && !hasSevenDayAccess()) { |
| 705 | REMOVED_PRODUCTION | ./app.js:7655:      renderSevenDayPaywall(), |
| 706 | REMOVED_PRODUCTION | ./app.js:7663:      ${topbar(Math.round((state.diaryEntries.length / 7) * 100), "Тайлангийн бэлэн байдал")} |
| 707 | REMOVED_PRODUCTION | ./app.js:7676:            <button class="button ghost" onclick="setView('diaryHome')">Явц руу буцах</button> |
| 708 | REMOVED_PRODUCTION | ./app.js:7695:    package_type: state.packageType \|\| "seven-day", |
| 709 | REMOVED_PRODUCTION | ./app.js:7697:  }, state.currentAssessmentId \|\| state.paymentSessionId \|\| "seven-day-report"); |
| 710 | REMOVED_PRODUCTION | ./app.js:7708:      hasPaidAccess: hasSevenDayAccess(), |
| 711 | REMOVED_PRODUCTION | ./app.js:7720:          ${isOneTime ? `<div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div>` : ""} |
| 712 | REMOVED_PRODUCTION | ./app.js:7778:          <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div> |
| 713 | REMOVED_PRODUCTION | ./app.js:7805:          ${isOneTime ? `<p class="muted">Энэ туршилтыг 7 хоногийн тэмдэглэл дээр илүү нарийвчилж, нөхцлийн зураглал, давтагддаг цикл, эхэлж өөрчлөх хамгийн амар цэгийг тодруулж болно.</p><div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div>` : ""} |
| 714 | REMOVED_PRODUCTION | ./app.js:7809:        <div class="actions"><button class="button secondary" onclick="setView('${isOneTime ? "choice" : "diaryHome"}')">${isOneTime ? "Сонголт руу буцах" : "Тэмдэглэл рүү буцах"}</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div> |
| 715 | REMOVED_PRODUCTION | ./app.js:7815:function startSevenDayRefinement() { |
| 716 | REMOVED_PRODUCTION | ./app.js:7816:  state.packageType = "seven-day"; |
| 717 | REMOVED_PRODUCTION | ./app.js:7818:  state.view = hasSevenDayAccess() ? "unlock" : "upgradePaywall"; |
| 718 | REMOVED_PRODUCTION | ./app.js:7917:    seven_day: "7 хоногийн гүн анализ", |
| 719 | REMOVED_PRODUCTION | ./app.js:7918:    upgrade: "7 хоногоор нарийвчлах эрх" |
| 720 | REMOVED_PRODUCTION | ./app.js:7941:    sevenDayStart: renderSevenDayStart, |
| 721 | REMOVED_PRODUCTION | ./app.js:7948:    diaryHome: renderDiaryHome, |
| 722 | REMOVED_PRODUCTION | ./app.js:7950:    reportReady: renderReportReady, |
| 723 | REMOVED_PRODUCTION | ./app.js:7951:    upgradePaywall: renderUpgradePaywall, |
| 724 | REMOVED_PRODUCTION | ./app.js:7984:    generateDailySummaryBullets, |
| 725 | REMOVED_PRODUCTION | ./app.js:8044:          sevenDayPaid: true, |
| 726 | REMOVED_PRODUCTION | ./app.js:8060:      setDiaryDraftValue, |
| 727 | REMOVED_PRODUCTION | ./app.js:8113:      renderSevenDayStart, |
| 728 | REMOVED_PRODUCTION | ./app.js:8114:      renderSevenDayPaywall, |
| 729 | REMOVED_PRODUCTION | ./app.js:8115:      renderDiaryHome, |
| 730 | REMOVED_PRODUCTION | ./app.js:8117:      renderDiaryInput, |
| 731 | REMOVED_PRODUCTION | ./app.js:8118:      renderDailySummaryConfirmation, |
| 732 | REMOVED_PRODUCTION | ./app.js:8120:      renderUpgradeOffer, |
| 733 | REMOVED_PRODUCTION | ./app.js:8124:      hasSevenDayAccess, |
| 734 | REMOVED_PRODUCTION | ./app.js:8133:      renderUpgradePaywall, |
| 735 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:17:- Role: SEVEN_DAY_USER |
| 736 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:18:- Scenario: usable-limited-report |
| 737 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:27:- Render proof: renderReport via usable-limited-report [FULL_SURFACE] |
| 738 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:76:- Role: SEVEN_DAY_USER |
| 739 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:77:- Scenario: usable-limited-report |
| 740 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:86:- Render proof: renderReport via usable-limited-report [FULL_SURFACE] |
| 741 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:133:- Surface: FULL_SEVEN_DAY_REPORT |
| 742 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:134:- Role: SEVEN_DAY_USER |
| 743 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:135:- Scenario: full-seven-day-report |
| 744 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:144:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 745 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:191:- Surface: FULL_SEVEN_DAY_REPORT |
| 746 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:192:- Role: SEVEN_DAY_USER |
| 747 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:193:- Scenario: full-seven-day-report |
| 748 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:202:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 749 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:250:- Surface: FULL_SEVEN_DAY_REPORT |
| 750 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:251:- Role: SEVEN_DAY_USER |
| 751 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:252:- Scenario: full-seven-day-report |
| 752 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:261:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 753 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:309:- Surface: FULL_SEVEN_DAY_REPORT |
| 754 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:310:- Role: SEVEN_DAY_USER |
| 755 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:311:- Scenario: full-seven-day-report |
| 756 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:320:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 757 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:368:- Surface: FULL_SEVEN_DAY_REPORT |
| 758 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:369:- Role: SEVEN_DAY_USER |
| 759 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:370:- Scenario: full-seven-day-report |
| 760 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:379:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 761 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:427:- Surface: FULL_SEVEN_DAY_REPORT |
| 762 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:428:- Role: SEVEN_DAY_USER |
| 763 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:429:- Scenario: full-seven-day-report |
| 764 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:438:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 765 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:486:- Surface: FULL_SEVEN_DAY_REPORT |
| 766 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:487:- Role: SEVEN_DAY_USER |
| 767 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:488:- Scenario: full-seven-day-report |
| 768 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:497:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 769 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:545:- Surface: FULL_SEVEN_DAY_REPORT |
| 770 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:546:- Role: SEVEN_DAY_USER |
| 771 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:547:- Scenario: full-seven-day-report |
| 772 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:556:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 773 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:604:- Surface: FULL_SEVEN_DAY_REPORT |
| 774 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:605:- Role: SEVEN_DAY_USER |
| 775 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:606:- Scenario: full-seven-day-report |
| 776 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:615:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 777 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:663:- Surface: FULL_SEVEN_DAY_REPORT |
| 778 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:664:- Role: SEVEN_DAY_USER |
| 779 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:665:- Scenario: full-seven-day-report |
| 780 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:674:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 781 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:722:- Surface: FULL_SEVEN_DAY_REPORT |
| 782 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:723:- Role: SEVEN_DAY_USER |
| 783 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:724:- Scenario: full-seven-day-report |
| 784 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:733:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 785 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:781:- Surface: FULL_SEVEN_DAY_REPORT |
| 786 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:782:- Role: SEVEN_DAY_USER |
| 787 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:783:- Scenario: full-seven-day-report |
| 788 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:792:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 789 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:840:- Surface: FULL_SEVEN_DAY_REPORT |
| 790 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:841:- Role: SEVEN_DAY_USER |
| 791 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:842:- Scenario: full-seven-day-report |
| 792 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:851:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 793 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:899:- Surface: FULL_SEVEN_DAY_REPORT |
| 794 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:900:- Role: SEVEN_DAY_USER |
| 795 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:901:- Scenario: full-seven-day-report |
| 796 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:910:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 797 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:958:- Surface: FULL_SEVEN_DAY_REPORT |
| 798 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:959:- Role: SEVEN_DAY_USER |
| 799 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:960:- Scenario: full-seven-day-report |
| 800 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:969:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 801 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1017:- Surface: FULL_SEVEN_DAY_REPORT |
| 802 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1018:- Role: SEVEN_DAY_USER |
| 803 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1019:- Scenario: full-seven-day-report |
| 804 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1028:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 805 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1076:- Surface: FULL_SEVEN_DAY_REPORT |
| 806 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1077:- Role: SEVEN_DAY_USER |
| 807 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1078:- Scenario: full-seven-day-report |
| 808 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1087:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 809 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1135:- Surface: FULL_SEVEN_DAY_REPORT |
| 810 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1136:- Role: SEVEN_DAY_USER |
| 811 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1137:- Scenario: full-seven-day-report |
| 812 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1146:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 813 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1194:- Surface: FULL_SEVEN_DAY_REPORT |
| 814 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1195:- Role: SEVEN_DAY_USER |
| 815 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1196:- Scenario: full-seven-day-report |
| 816 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1205:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 817 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1253:- Surface: FULL_SEVEN_DAY_REPORT |
| 818 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1254:- Role: SEVEN_DAY_USER |
| 819 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1255:- Scenario: full-seven-day-report |
| 820 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1264:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 821 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1312:- Surface: FULL_SEVEN_DAY_REPORT |
| 822 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1313:- Role: SEVEN_DAY_USER |
| 823 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1314:- Scenario: full-seven-day-report |
| 824 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1323:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 825 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1371:- Surface: FULL_SEVEN_DAY_REPORT |
| 826 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1372:- Role: SEVEN_DAY_USER |
| 827 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1373:- Scenario: full-seven-day-report |
| 828 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1382:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 829 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1430:- Surface: FULL_SEVEN_DAY_REPORT |
| 830 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1431:- Role: SEVEN_DAY_USER |
| 831 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1432:- Scenario: full-seven-day-report |
| 832 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1441:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 833 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1489:- Surface: FULL_SEVEN_DAY_REPORT |
| 834 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1490:- Role: SEVEN_DAY_USER |
| 835 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1491:- Scenario: full-seven-day-report |
| 836 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1500:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 837 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1548:- Surface: FULL_SEVEN_DAY_REPORT |
| 838 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1549:- Role: SEVEN_DAY_USER |
| 839 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1550:- Scenario: full-seven-day-report |
| 840 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1559:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 841 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1607:- Surface: FULL_SEVEN_DAY_REPORT |
| 842 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1608:- Role: SEVEN_DAY_USER |
| 843 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1609:- Scenario: full-seven-day-report |
| 844 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1618:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 845 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1666:- Surface: FULL_SEVEN_DAY_REPORT |
| 846 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1667:- Role: SEVEN_DAY_USER |
| 847 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1668:- Scenario: full-seven-day-report |
| 848 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1677:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 849 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1725:- Surface: FULL_SEVEN_DAY_REPORT |
| 850 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1726:- Role: SEVEN_DAY_USER |
| 851 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1727:- Scenario: full-seven-day-report |
| 852 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_04.md:1736:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 853 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:187:    sevenDayPaid: true, |
| 854 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:191:    diaryEntries: persona.diaryEntries \|\| [], |
| 855 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:222:      sevenDayPaid: state.sevenDayPaid, |
| 856 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:247:    packageType: "seven-day", |
| 857 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:273:    diaryEntries: entries(5, (day) => diary(day, { |
| 858 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:286:    packageType: "seven-day", |
| 859 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:310:    diaryEntries: entries(5, (day) => diary(day, { |
| 860 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:351:    packageType: "seven-day", |
| 861 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:375:    diaryEntries: entries(5, (day) => diary(day, { |
| 862 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:385:    packageType: "seven-day", |
| 863 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:407:    diaryEntries: entries(5, (day) => diary(day, { |
| 864 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:447:    packageType: "seven-day", |
| 865 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:470:    diaryEntries: entries(5, (day) => diary(day, { |
| 866 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:481:    packageType: "seven-day", |
| 867 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:503:    diaryEntries: entries(5, (day) => diary(day, { |
| 868 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:514:    packageType: "seven-day", |
| 869 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:537:    diaryEntries: entries(5, (day) => diary(day, { |
| 870 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./scripts/run-virtual-user-audit.mjs:776:5. One-time reports have less diary-backed specificity than seven-day reports, which is expected but commercially important. |
| 871 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-language-purge.test.js:23:    sevenDayPaid: false, |
| 872 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-language-purge.test.js:31:    diaryEntries: [], |
| 873 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-language-purge.test.js:44:  setBase({ packageType: "seven-day", view: "sevenDayStart", sevenDayPaid: false }); |
| 874 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-language-purge.test.js:45:  const sevenDayPaywall = _internal.renderSevenDayPaywall(); |
| 875 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-language-purge.test.js:47:  setBase({ packageType: "seven-day", view: "sevenDayStart", sevenDayPaid: true }); |
| 876 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-language-purge.test.js:48:  const sevenDayStart = _internal.renderSevenDayStart(); |
| 877 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-language-purge.test.js:55:  setBase({ packageType: "seven-day", sevenDayPaid: true, diaryEntries: [{ day_number: 1, meal_rhythm: "Тогтуун, хоол алгасаагүй" }] }); |
| 878 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-language-purge.test.js:59:  return normalize([landing, about, choice, oneTimeStart, oneTimePaywall, sevenDayPaywall, sevenDayStart, leadCapture, leadThankYou, insufficientReport, questionText].join("\n")); |
| 879 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-language-purge.test.js:101:  assert(publicText.includes("7 хоногийн гүн анализ руу шилжих боломж")); |
| 880 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:15:    sevenDayPaid: false, |
| 881 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:35:    diaryEntries: [], |
| 882 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:40:function setSevenDay(overrides = {}) { |
| 883 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:42:    packageType: "seven-day", |
| 884 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:43:    view: "sevenDayStart", |
| 885 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:45:    sevenDayPaid: false, |
| 886 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:52:    diaryEntries: [], |
| 887 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:62:    sevenDayPaid: false, |
| 888 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:65:    diaryEntries: [] |
| 889 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:74:    sevenDayPaid: false, |
| 890 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:77:    diaryEntries: [] |
| 891 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:98:  assert(choice.includes("7 хоногийн гүн анализ"), "7-Day commercial title should use analysis wording"); |
| 892 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:126:  assert(!paidOneTime.includes("19,900₮ төлөөд 7 хоногоор нарийвчлах")); |
| 893 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:129:  setSevenDay(); |
| 894 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:130:  const unpaidSevenDayStart = normalize(_internal.renderSevenDayStart()); |
| 895 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:131:  assert(unpaidSevenDayStart.includes("Үндсэн үнэ 69,000₮")); |
| 896 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:132:  assert(unpaidSevenDayStart.includes("Нээлтийн урамшуулалт үнэ 29,000₮")); |
| 897 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:133:  assert(unpaidSevenDayStart.includes("29,000₮ төлөөд эхлүүлэх")); |
| 898 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:134:  assert(!unpaidSevenDayStart.includes("6,900₮")); |
| 899 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:135:  assert(!unpaidSevenDayStart.includes("12,900₮")); |
| 900 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:136:  assert(!unpaidSevenDayStart.includes("19,900₮")); |
| 901 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:137:  assert(!unpaidSevenDayStart.includes("Demo unlock хийх")); |
| 902 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:139:  assert(blockedUnlock.includes("7 хоногийн гүн анализаа нээх")); |
| 903 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:141:  assertNoPressureCopy(unpaidSevenDayStart); |
| 904 | REMOVED_OR_REWRITTEN_TEST | ./tests/pricing-paywall.test.js:143:  _internal.demoCompletePayment("seven-day"); |
| 905 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:47:\| RAW-0041 \| seven-day \| app.js:79 \| UNKNOWN_REQUIRES_TRACE \| |
| 906 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:48:\| RAW-0042 \| seven_day \| app.js:80 \| INTERNAL_IDENTIFIER \| |
| 907 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:49:\| RAW-0043 \| 7 хоногийн гүн анализ \| app.js:81 \| RENDERED_USER_VISIBLE \| |
| 908 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:51:\| RAW-0045 \| 7 хоногоор нарийвчлах эрх \| app.js:87 \| UNKNOWN_REQUIRES_TRACE \| |
| 909 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2531:\| RAW-2525 \| sevenDayStart \| app.js:1284 \| UNKNOWN_REQUIRES_TRACE \| |
| 910 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2543:\| RAW-2537 \| seven-day \| app.js:1416 \| UNKNOWN_REQUIRES_TRACE \| |
| 911 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2544:\| RAW-2538 \| sevenDayStart \| app.js:1416 \| UNKNOWN_REQUIRES_TRACE \| |
| 912 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2547:\| RAW-2541 \| seven-day \| app.js:1422 \| UNKNOWN_REQUIRES_TRACE \| |
| 913 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2548:\| RAW-2542 \| seven_day \| app.js:1422 \| INTERNAL_IDENTIFIER \| |
| 914 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2554:\| RAW-2548 \| seven-day \| app.js:1452 \| UNKNOWN_REQUIRES_TRACE \| |
| 915 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2555:\| RAW-2549 \| seven_day \| app.js:1452 \| INTERNAL_IDENTIFIER \| |
| 916 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2563:\| RAW-2557 \| seven-day \| app.js:1467 \| UNKNOWN_REQUIRES_TRACE \| |
| 917 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2564:\| RAW-2558 \| seven-day \| app.js:1469 \| UNKNOWN_REQUIRES_TRACE \| |
| 918 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2566:\| RAW-2560 \| sevenDayStart \| app.js:1470 \| UNKNOWN_REQUIRES_TRACE \| |
| 919 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2568:\| RAW-2562 \| seven-day \| app.js:1474 \| UNKNOWN_REQUIRES_TRACE \| |
| 920 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2615:\| RAW-2609 \| seven-day \| app.js:1712 \| UNKNOWN_REQUIRES_TRACE \| |
| 921 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2617:\| RAW-2611 \| seven-day \| app.js:1717 \| UNKNOWN_REQUIRES_TRACE \| |
| 922 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2618:\| RAW-2612 \| sevenDayStart \| app.js:1717 \| UNKNOWN_REQUIRES_TRACE \| |
| 923 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2623:\| RAW-2617 \| diaryHome \| app.js:1725 \| UNKNOWN_REQUIRES_TRACE \| |
| 924 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2625:\| RAW-2619 \| reportReady \| app.js:1727 \| UNKNOWN_REQUIRES_TRACE \| |
| 925 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2680:\| RAW-2674 \| seven-day \| app.js:1875 \| UNKNOWN_REQUIRES_TRACE \| |
| 926 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3192:\| RAW-3186 \| ${topbar(0)} <section class="screen"> <div class="panel stack"> <h2>Үнэлгээний хоёр зам</h2> <p class="muted">Эхлээд өөрт тохирох түвшнээ сонгоно. Нэг удаагийн зураглал нь одоогийн хариултаар эхний тайлан гаргана. 7 хоногийн үнэлгээ тэр зураглалыг бодит өдрүүдийн богино ажиглалтаар нарийвчилна.</p> <div class="two-col"> <div class="card"><h3>Нэг удаагийн гүн зураглал</h3><p>10–15 минутанд хамгийн тод давтагддаг нөхцөл, нөлөөлж буй 1–2 шалтгаан, одоогоор болгоомжлох зүйл, эхний зөөлөн алхам гарна.</p></div> <div class="card"><h3>7 хоногийн гүн зураглал</h3><p>Эхний богино асуулт + орой бүр 3–5 минутын тэмдэглэл. 5 өдөр бөглөсөн ч тайлан гарна, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана.</p></div> </div> <div class="card"> <h3>Харьцуулалт</h3> <div class="two-col"> <p><strong>Нэг удаагийн:</strong> тухайн мөчийн хариултад суурилсан эхний зураглал.</p> <p><strong>7 хоногийн:</strong> илүү их тураах төлөвлөгөө биш, бодит өдөр тутмын давтамжийг нарийвчлах богино ажиглалт.</p> </div> </div> ${renderSampleResultPreview()} <div class="actions"> <button class="button" onclick="setView('choice')">Сонголтоо хийх</button> <button class="button ghost" onclick="setView('landing')">Буцах</button> </div> </div> </section> \| app.js:2541 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 927 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3228:\| RAW-3222 \| ${topbar(0, "Үнэлгээний сонголт")} <section class="screen"> <div class="panel stack choice-panel"> <h2>Та ямар түвшний зураглал авах вэ?</h2> <p class="muted">Нэг удаагийн зураглал нь эхний тайлан өгнө. 7 хоногийн зураглал бол илүү их тураах төлөвлөгөө биш, харин тэр эхний зураглалыг бодит өдрүүд дээр нарийвчлах богино ажиглалт.</p> <div class="choice-grid"> <div class="card stack choice-card"> <p class="choice-kicker">Хурдан эхлэх</p> <h3>Нэг удаагийн гүн анализ</h3> <div class="price-stack"> <p class="price promo"><span>Үндсэн үнэ</span> ${PRICING.oneTime}</p> </div> <p class="muted">10–15 минутанд жин бууруулах оролдлого яг ямар үед гацаад байгааг эхлээд харна.</p> <div class="pill-row"><span class="pill">10–15 минут</span><span class="pill">Эхний хэсгийг үнэгүй харах</span><span class="pill">Бүрэн эхний тайлан</span></div> <ul> <li>Хамгийн тод давтагддаг нөхцөл</li> <li>Давхар нөлөөлж буй 1–2 зүйл</li> <li>Тэр идэлт тухайн үед юуг намдааж эсвэл нөхөж байж болох</li> <li>Одоогоор зайлсхийх зүйлс</li> <li>Эхний зөөлөн алхам</li> <li>14 хоногийн эхний туршилт</li> <li>7 хоногоор нарийвчлах боломж</li> </ul> <p class="muted">Энэ нь тухайн мөчийн хариултад суурилсан эхний зураглал. Бодит өдөр тутмын давтамжийг 7 хоногийн үнэлгээ илүү нарийвчилна.</p> <button class="button choice-button" onclick="choosePackage('one-time')">${PRICING.oneTime} төлөөд тайлангаа нээх</button> </div> <div class="card stack choice-card choice-card-featured"> <p class="choice-kicker">Илүү нарийвчилсан</p> <h3>7 хоногийн гүн анализ</h3> <div class="price-stack"> <p class="price-line"><span>Үндсэн үнэ</span> ${PRICING.sevenDayAnchor}</p> <p class="price promo"><span>Нээлтийн урамшуулалт үнэ</span> ${PRICING.sevenDay}</p> </div> <p class="muted">Орой бүр 3–5 минутын богино тэмдэглэлээр таны идэх хүсэл бодит амьдрал дээр ямар үед давтагдаж байгааг харна.</p> <div class="pill-row"><span class="pill">Эхлэх асуулт</span><span class="pill">Орой бүр 3–5 минут</span><span class="pill">5 өдөр бөглөсөн ч тайлан гарна</span></div> <ul> <li>Эхлэх богино асуулт</li> <li>7 өдөр богино тэмдэглэл</li> <li>Идэх хүсэл эхэлдэг нөхцөл</li> <li>Эхний зураглал ба ажиглалтын харьцуулалт</li> <li>Идэх хүсэл яг ямар үүрэгтэй давтагдаж байгааг тодруулах</li> <li>Илүү тод 14 хоногийн туршилт</li> </ul> <p class="muted">Энэ нь илүү их тураах төлөвлөгөө биш. Зүгээр л 7 хоногийн богино ажиглалт. Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана.</p> <button class="button choice-button" onclick="choosePackage('seven-day')">${PRICING.sevenDay} төлөөд 7 хоногийн үнэлгээ эхлүүлэх</button> </div> </div> ${renderSampleResultPreview()} </div> </section> \| app.js:2597 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 928 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3302:\| RAW-3296 \| ${topbar(0, "7 хоногийн гүн зураглал")} <section class="screen"> <div class="panel stack paywall-panel"> <p class="choice-kicker">Нээлтийн эрх</p> <h2>7 хоногийн гүн анализаа нээх</h2> <div class="price-stack"> <p class="price-line"><span>Үндсэн үнэ</span> ${PRICING.sevenDayAnchor}</p> <p class="price promo"><span>Нээлтийн урамшуулалт үнэ</span> ${PRICING.sevenDay}</p> </div> <p>7 хоногийн тэмдэглэлээр таны өдөр тутмын бодит давтамж илүү тод харагдана. Анхны сэтгэгдэл ба өдөр тутмын ажиглалт хоёр хаана давхцаж, хаана зөрж байгааг эндээс харна.</p> <ul> <li>Эхлэх богино асуулт</li> <li>7 өдөр богино тэмдэглэл</li> <li>Орой бүр 3–5 минут</li> <li>5 өдөр бөглөсөн ч тайлан гарна</li> <li>Калори тоолохгүй, давтагддаг мөчүүдийг ажиглана</li> </ul> <div class="actions"> <button class="button secondary" onclick="startLeadCapture('seven-day')">${PRICING.sevenDay} төлөөд эхлүүлэх</button> ${demoOnlyHtml( \| app.js:2871 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 929 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3304:\| RAW-3298 \| demoCompletePayment('seven-day') \| app.js:2891 \| UNKNOWN_REQUIRES_TRACE \| |
| 930 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3306:\| RAW-3300 \| ${topbar(0, "7 хоногийн гүн зураглал")} <section class="screen"> <div class="panel stack"> <h2>7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна</h2> <p>Эхний богино асуултаар эхэлнэ. Дараа нь орой бүр 3–5 минутын тэмдэглэл бөглөж, 7 хоногийн дараа илүү нарийвчилсан тайлан гарна.</p> <div class="pill-row"> <span class="pill">Эхлэл: 8-10 минут</span> <span class="pill">Орой бүр: 3–5 минут</span> <span class="pill">5/7 өдөр бөглөсөн ч тайлан гарна</span> <span class="pill">Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш</span> <span class="pill">Калори тоолохгүй</span> <span class="pill">Зөвхөн давтагддаг мөчүүдийг ажиглана</span> </div> <div class="actions"> <button class="button" onclick="beginAssessment('seven-day')">7 хоногийн үнэлгээ эхлүүлэх</button> <button class="button ghost" onclick="setView('choice')">Буцах</button> </div> </div> </section> \| app.js:2902 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 931 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3383:\| RAW-3377 \| setView('${hasSevenDayAccess() ? \| app.js:3107 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 932 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3388:\| RAW-3382 \| sevenDayStart \| app.js:3151 \| UNKNOWN_REQUIRES_TRACE \| |
| 933 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3394:\| RAW-3388 \| reportReady \| app.js:3245 \| UNKNOWN_REQUIRES_TRACE \| |
| 934 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3395:\| RAW-3389 \| diaryHome \| app.js:3245 \| UNKNOWN_REQUIRES_TRACE \| |
| 935 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3424:\| RAW-3418 \| ${topbar(Math.round((state.diaryEntries.length / 7) * 100), "7 хоногийн тэмдэглэл")} <section class="screen"> <div class="panel stack"> <h2>Тэмдэглэлийн явц</h2> <p class="muted">${progressCopy()}</p> ${state.lastInsight ? \| app.js:3319 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 936 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3426:\| RAW-3420 \| : ""} <div class="two-col"> <div class="mini-stat"><strong>${state.diaryEntries.length}/7</strong><span>Өдөр бөглөсөн</span></div> <div class="mini-stat"><strong>${dataQuality().label}</strong><span>Мэдээллийн чанар</span></div> </div> <div class="actions"> <button class="button" onclick="startDiary()" ${state.diaryEntries.length >= 7 ? "disabled" : ""}>Дараагийн өдөр бөглөх</button> <button class="button secondary" onclick="setView('${readiness.canGenerateFullReport ? "reportReady" : "report"}')">${readiness.canGenerateFullReport ? "Тайлан харах" : "Одоогийн зураглал харах"}</button> </div> </div> </section> \| app.js:3325 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 937 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3427:\| RAW-3421 \| ${topbar(100, "Бүрэн тайлан")} <section class="screen"> <div class="panel stack"> <h2>Таны 7 хоногийн зураглал бэлэн боллоо</h2> <p>Бид эхний асуултаар гарсан давтамжуудыг 7 хоногийн тэмдэглэлтэй харьцуулж, аль нь бодит амьдрал дээр давтагдсан, аль нь сул байсан, аль нь таны тойргийг үргэлжлүүлж байгааг нэгтгэлээ.</p> <div class="actions"> <button class="button" onclick="setView('report')">Миний бүрэн тайланг харах</button> <button class="button ghost" onclick="setView('diaryHome')">Тэмдэглэлийн явц руу буцах</button> </div> </div> </section> \| app.js:3340 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 938 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3430:\| RAW-3424 \| )} <section class="screen"> <div class="grid"> <div class="panel"> ${backButton} <p class="muted">Асуулт ${state.diaryQuestionIndex + 1}/${questions.length}</p> <h2 class="question-text">${question.text}</h2> ${renderDiaryInput(question)} <div class="actions"> <button class="button" onclick="nextDiaryQuestion()">${state.diaryQuestionIndex === questions.length - 1 ? "Өдрийг хадгалах" : "Үргэлжлүүлэх"}</button> </div> </div> <aside class="aside"> <div class="card"> <h3>Өнөөдрийн чиглэл</h3> <div class="pill-row">${(state.preliminary \\|\\| []).slice(0, 3).map(item => \| app.js:3363 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 939 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3436:\| RAW-3430 \| <label class="field"><span class="muted">1-2 өгүүлбэр хангалттай</span><textarea id="input-${question.id}" oninput="setDiaryDraftValue('${question.id}', this.value)">${escapeHtml(value)}</textarea></label><p class="muted">Хэрвээ санахгүй эсвэл бичмээргүй байвал хоосон орхиод үргэлжлүүлж болно.</p> \| app.js:3393 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 940 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3464:\| RAW-3458 \| <div class="card stack"> <h3>Тайлбар хадгалагдлаа</h3> <p class="muted">Өнөөдрийн сонгосон хариултууд хадгалагдсан. Бичмээр зүйл байхгүй бол үргэлжлүүлж болно.</p> <div class="actions"> <button class="button secondary" onclick="confirmDailySummary('confirm')">Үргэлжлүүлэх</button> <button class="button ghost" onclick="previousDiaryQuestion()">Буцах</button> </div> </div> \| app.js:3421 \| UNKNOWN_REQUIRES_TRACE \| |
| 941 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3476:\| RAW-3470 \| setDailySummaryText(this.value) \| app.js:3439 \| UNKNOWN_REQUIRES_TRACE \| |
| 942 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3477:\| RAW-3471 \| : ""} <div class="actions"> <button class="button secondary" onclick="confirmDailySummary('confirm')">Үргэлжлүүлэх</button> <button class="button ghost" onclick="setDailySummaryMode('edit')">Засах</button> <button class="button ghost" onclick="previousDiaryQuestion()">Буцах</button> <button class="button ghost" onclick="setDailySummaryMode('add')">Нэмэх зүйл байна</button> ${ui.mode === "edit" \\|\\| ui.mode === "add" ? \| app.js:3439 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 943 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:3479:\| RAW-3473 \| confirmDailySummary('${ui.mode}') \| app.js:3445 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 944 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:4101:\| RAW-4095 \| : ""} </div> <div class="report-section"> <h3>Бүрэн тайлангаа нээвэл юу нэмэгдэх вэ?</h3> <p>Төлбөргүй хэсэг эхний дохиог үлдээнэ. Бүрэн тайлан нь тэр дохиог өдөр тутмын нөхцөл, давхар нөлөө, эхний зөөлөн алхамтай холбож илүү ойлгомжтой болгоно.</p> <div class="paywall-detail-grid"> <div> <p class="choice-kicker">Одоо харагдаж байна</p> <ul> <li>Хамгийн түрүүнд тодорсон нэг дохио</li> <li>Тухайн дохионы богино тайлбар</li> <li>Аюулгүй ашиглах сануулга</li> </ul> </div> <div> <p class="choice-kicker">Бүрэн тайланд нэмэгдэнэ</p> <ul> <li>Хамгийн тод давтагддаг нөхцөл</li> <li>Давхар нөлөөлж буй 1-2 зүйл</li> <li>Одоогоор хэт яарахгүй зүйлс</li> <li>Эхний зөөлөн алхам</li> <li>14 хоногийн эхний туршилт</li> <li>7 хоногийн гүн анализ руу шилжих боломж</li> </ul> </div> </div> </div> <div class="report-section"> <h3>Бүрэн тайлан нээх</h3> <p class="muted">Төлбөр баталгаажсаны дараа тайлан энэ дэлгэц дээр шууд нээгдэнэ. Эхний дохио болон аюулгүй байдлын сануулга төлбөргүй хэсэгт үлдэнэ.</p> <div class="price-stack"> <p class="price-line"><span>Үндсэн үнэ</span> ${PRICING.oneTimeAnchor}</p> <p class="price promo"><span>${priceCaption}</span> ${priceLabel}</p> </div> ${renderNoAccountPaymentIntro()} ${hasSavedContactInfo() ? \| app.js:4285 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 945 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:4130:\| RAW-4124 \| <div class="report-section paywall-panel"> <p class="choice-kicker">7 хоногоор нарийвчлах</p> <h3>Энэ зураглалыг 7 хоногоор илүү тодруулж болно</h3> <p class="price"><span class="price-label">Нарийвчлах үнэ:</span> ${PRICING.upgrade}</p> <p>Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.</p> <p class="muted">7 хоногийн богино тэмдэглэл нь аль өдөр, ямар үед илүү хүчтэй болдгийг нарийвчилна.</p> <div class="actions"> <button class="button secondary" onclick="startSevenDayRefinement()">${PRICING.upgrade} төлөөд 7 хоногоор нарийвчлах</button> </div> </div> \| app.js:4414 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 946 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:4131:\| RAW-4125 \| ${topbar(100, "7 хоногоор нарийвчлах")} <section class="screen"> <div class="panel stack paywall-panel"> <p class="choice-kicker">7 хоногоор нарийвчлах</p> <h2>Энэ зураглалыг 7 хоногоор илүү тодруулж болно</h2> <p class="price"><span class="price-label">Нарийвчлах үнэ:</span> ${PRICING.upgrade} <span>7 хоногийн нээлтийн үнэ ${PRICING.sevenDay}</span></p> <p>Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.</p> <ul> <li>Орой бүр 3–5 минутын богино тэмдэглэл</li> <li>Идэх хүсэл эхэлдэг нөхцлийн зураглал</li> <li>Эхний зураглал ба бодит ажиглалтын харьцуулалт</li> <li>Идэх хүсэл яг ямар хэрэгцээтэй давхцаж байгааг нарийвчлах</li> <li>Илүү тод 14 хоногийн туршилт</li> </ul> <div class="actions"> <button class="button secondary" onclick="startLeadCapture('upgrade')">${PRICING.upgrade} төлөөд 7 хоногоор нарийвчлах</button> ${demoOnlyHtml( \| app.js:4429 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 947 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:5951:\| RAW-5945 \| startSevenDayRefinement() \| app.js:6513 \| UNKNOWN_REQUIRES_TRACE \| |
| 948 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:5952:\| RAW-5946 \| : ""} ${mode.mode === "check" ? professionalCheckHtml(tags, true) : ""} ${isOneTime ? renderUpgradeOffer() : ""} ${renderReportDeliveryActions()} ${renderInternalTesterFeedbackSurvey()} <div class="actions"><button class="button secondary" onclick="setView('${isOneTime ? "choice" : "diaryHome"}')">${isOneTime ? "Сонголт руу буцах" : "Тэмдэглэл рүү буцах"}</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div> </div> </section> \| app.js:6514 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 949 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6105:\| RAW-6099 \| ${topbar(100, mode.title)} <section class="screen"> <div class="panel"> <div class="report-section"> <h2>Таны нэг удаагийн гүн анализ бэлэн боллоо</h2> <p class="muted">Энэ бол таны одоогийн хариултад суурилсан эхний зураглал. Бодит өдөр тутмын давтамжийг 7 хоногийн тэмдэглэл илүү тодруулна.</p> <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div> </div> <div class="report-section"> <h3>Таны хариултаас хамгийн тод харагдаж буй зүйл</h3> ${primary ? \| app.js:6847 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 950 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6121:\| RAW-6115 \| ).join("")}</ul> <div class="actions"><button class="button secondary" onclick="startSevenDayRefinement()">7 хоногоор нарийвчлах</button></div> </div> ${mode.mode === "check" ? professionalCheckHtml(tags, true) : ""} ${renderUpgradeOffer()} ${renderInternalTesterFeedbackSurvey()} <div class="actions"><button class="button secondary" onclick="setView('choice')">Сонголт руу буцах</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div> </div> </section> \| app.js:6901 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 951 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6260:\| RAW-6254 \| ${topbar(Math.round((state.diaryEntries.length / 7) * 100), "Тайлангийн бэлэн байдал")} <section class="screen"> <div class="panel stack"> <h2>${readiness.title}</h2> <p class="muted">${readiness.copy}</p> <div class="two-col"> <div class="mini-stat"><strong>${readiness.count}/7</strong><span>Өдөр бөглөсөн</span></div> <div class="mini-stat"><strong>${quality.label}</strong><span>Хариултын хүрэлцээ</span></div> </div> ${readiness.key !== "insufficient" ? \| app.js:7662 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 952 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6265:\| RAW-6259 \| : ""} <p>Энэ нь бүрэн тайлан биш тул 14 хоногийн туршилт өгөхгүй. Тэмдэглэлээ үргэлжлүүлж 5/7 өдөр хүрвэл бүрэн тайлан гарна.</p> <div class="actions"> <button class="button" onclick="startDiary()">Тэмдэглэлээ үргэлжлүүлэх</button> <button class="button ghost" onclick="setView('diaryHome')">Явц руу буцах</button> </div> </div> </section> \| app.js:7672 \| UNKNOWN_REQUIRES_TRACE \| |
| 953 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6270:\| RAW-6264 \| seven-day \| app.js:7695 \| UNKNOWN_REQUIRES_TRACE \| |
| 954 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6271:\| RAW-6265 \| seven-day-report \| app.js:7697 \| UNKNOWN_REQUIRES_TRACE \| |
| 955 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6276:\| RAW-6270 \| startSevenDayRefinement() \| app.js:7720 \| UNKNOWN_REQUIRES_TRACE \| |
| 956 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6306:\| RAW-6300 \| startSevenDayRefinement() \| app.js:7778 \| UNKNOWN_REQUIRES_TRACE \| |
| 957 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6315:\| RAW-6309 \| startSevenDayRefinement() \| app.js:7805 \| UNKNOWN_REQUIRES_TRACE \| |
| 958 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6316:\| RAW-6310 \| : ""} </div> ${mode.mode === "check" ? professionalCheckHtml(tags, true) : ""} ${renderInternalTesterFeedbackSurvey()} <div class="actions"><button class="button secondary" onclick="setView('${isOneTime ? "choice" : "diaryHome"}')">${isOneTime ? "Сонголт руу буцах" : "Тэмдэглэл рүү буцах"}</button><button class="button ghost" onclick="resetState()">Шинээр эхлэх</button></div> </div> </section> \| app.js:7805 \| DYNAMIC_TEMPLATE_FRAGMENT \| |
| 959 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6317:\| RAW-6311 \| seven-day \| app.js:7816 \| UNKNOWN_REQUIRES_TRACE \| |
| 960 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6383:\| RAW-6377 \| , seven_day: \| app.js:7916 \| UNKNOWN_REQUIRES_TRACE \| |
| 961 | REGENERATED_ARTIFACT | ./MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:6388:\| RAW-6382 \| ).innerHTML = renderFeedbackExport(); if (options.scrollToTop) scrollToTopAfterRender(); return; } const routes = { landing: renderLanding, about: renderAbout, choice: renderChoice, oneTimeStart: renderOneTimeStart, sevenDayStart: renderSevenDayStart, leadCapture: renderLeadCapture, leadThankYou: renderLeadThankYou, validationSummary: renderValidationSummary, stage1: renderStageOne, preliminary: renderPreliminary, unlock: renderUnlock, diaryHome: renderDiaryHome, diary: renderDiary, reportReady: renderReportReady, upgradePaywall: renderUpgradePaywall, report: renderReport, coachLogin: renderCoachLogin, coachDashboard: renderCoachDashboard, adminCoach: renderAdminCoach, feedbackThanks: renderFeedbackThanks, feedbackExport: renderFeedbackExport }; document.getElementById( \| app.js:7932 \| UNKNOWN_REQUIRES_TRACE \| |
| 962 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-metadata-mechanisms.test.js:110:    packageType: "seven-day", |
| 963 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-metadata-mechanisms.test.js:113:    diaryEntries: Array.from({ length: 5 }, (_, index) => ({ |
| 964 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-safety-routing.test.js:15:    sevenDayPaid: false, |
| 965 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-safety-routing.test.js:19:    diaryEntries: [], |
| 966 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:17:- Role: SEVEN_DAY_USER |
| 967 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:19:- Render source: renderDiary using diaryQuestionIndex |
| 968 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:27:- Render proof: renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE] |
| 969 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:152:- Role: SEVEN_DAY_USER |
| 970 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:154:- Render source: renderDiary using diaryQuestionIndex |
| 971 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:162:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 972 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:215:- Role: SEVEN_DAY_USER |
| 973 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:217:- Render source: renderDiary using diaryQuestionIndex |
| 974 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:225:- Render proof: renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] |
| 975 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:561:- Role: SEVEN_DAY_USER |
| 976 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:563:- Render source: renderDiary using diaryQuestionIndex |
| 977 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:571:- Render proof: renderDiary using diaryQuestionIndex via diary-text [FULL_SURFACE] |
| 978 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:624:- Role: SEVEN_DAY_USER |
| 979 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:626:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 980 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/07_P2_QUESTIONS_DIARY_BATCH_01.md:634:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty, diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] |
| 981 | REMOVED_OR_REWRITTEN_TEST | ./tests/live-payment-qpay-flow-qa.test.js:18:    sevenDayPaid: false, |
| 982 | REMOVED_OR_REWRITTEN_TEST | ./tests/live-payment-qpay-flow-qa.test.js:44:    diaryEntries: [], |
| 983 | REMOVED_OR_REWRITTEN_TEST | ./tests/live-payment-qpay-flow-qa.test.js:139:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged"); |
| 984 | REMOVED_OR_REWRITTEN_TEST | ./tests/live-payment-qpay-flow-qa.test.js:140:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged"); |
| 985 | REMOVED_OR_REWRITTEN_TEST | ./tests/live-payment-qpay-flow-qa.test.js:153:assert(appSource.includes("return Boolean(isInternalTestMode() \|\| state.sevenDayPaid \|\| state.upgradePaid \|\| access.hasSevenDayAccess);"), "seven-day access helper source must remain unchanged"); |
| 986 | REMOVED_OR_REWRITTEN_TEST | ./tests/live-payment-qpay-flow-qa.test.js:163:  sevenDayPaid: false, |
| 987 | REMOVED_OR_REWRITTEN_TEST | ./tests/live-payment-qpay-flow-qa.test.js:169:assert.strictEqual(_internal.hasSevenDayAccess(), false, "seven-day access should be false without payment or entitlement"); |
| 988 | REMOVED_OR_REWRITTEN_TEST | ./tests/live-payment-qpay-flow-qa.test.js:187:  sevenDayPaid: false, |
| 989 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1365:> 7 хоногийн гүн зураглал |
| 990 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1372:- Surface: SEVEN_DAY_START |
| 991 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1373:- Role: SEVEN_DAY_USER |
| 992 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1374:- Scenario: seven-day-start |
| 993 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1375:- Render source: renderSevenDayStart |
| 994 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1383:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 995 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1400:> 7 хоногийн гүн зураглал |
| 996 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1401:> 7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна |
| 997 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1423:> 7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна |
| 998 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1430:- Surface: SEVEN_DAY_START |
| 999 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1431:- Role: SEVEN_DAY_USER |
| 1000 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1432:- Scenario: seven-day-start |
| 1001 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1433:- Render source: renderSevenDayStart |
| 1002 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1439:- Source function/object: renderSevenDayStart |
| 1003 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1441:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 1004 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1450:> <h2>7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна</h2> |
| 1005 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1458:> 7 хоногийн гүн зураглал |
| 1006 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1459:> 7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна |
| 1007 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1489:- Surface: SEVEN_DAY_START |
| 1008 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1490:- Role: SEVEN_DAY_USER |
| 1009 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1491:- Scenario: seven-day-start |
| 1010 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1492:- Render source: renderSevenDayStart |
| 1011 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1498:- Source function/object: renderSevenDayStart |
| 1012 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1500:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 1013 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1505:> <h2>7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна</h2> |
| 1014 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1517:> 7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна |
| 1015 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1548:- Surface: SEVEN_DAY_START |
| 1016 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1549:- Role: SEVEN_DAY_USER |
| 1017 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1550:- Scenario: seven-day-start |
| 1018 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1551:- Render source: renderSevenDayStart |
| 1019 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1557:- Source function/object: renderSevenDayStart |
| 1020 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1559:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 1021 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1607:- Surface: SEVEN_DAY_START |
| 1022 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1608:- Role: SEVEN_DAY_USER |
| 1023 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1609:- Scenario: seven-day-start |
| 1024 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1610:- Render source: renderSevenDayStart |
| 1025 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1616:- Source function/object: renderSevenDayStart |
| 1026 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1618:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 1027 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1666:- Surface: SEVEN_DAY_START |
| 1028 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1667:- Role: SEVEN_DAY_USER |
| 1029 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1668:- Scenario: seven-day-start |
| 1030 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1669:- Render source: renderSevenDayStart |
| 1031 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1675:- Source function/object: renderSevenDayStart |
| 1032 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1677:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 1033 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1725:- Surface: SEVEN_DAY_START |
| 1034 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1726:- Role: SEVEN_DAY_USER |
| 1035 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1727:- Scenario: seven-day-start |
| 1036 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1728:- Render source: renderSevenDayStart |
| 1037 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_05.md:1736:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 1038 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:25:    sevenDayPaid: false, |
| 1039 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:31:    diaryEntries: [], |
| 1040 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:37:function setSevenDay(stageAnswers = {}, diaryEntries = [], extras = {}) { |
| 1041 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:39:    packageType: "seven-day", |
| 1042 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:43:    sevenDayPaid: true, |
| 1043 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:49:    diaryEntries, |
| 1044 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:55:function rewardDiaryEntries() { |
| 1045 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:71:function collapseDiaryEntries() { |
| 1046 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:110:  const rewardSevenDay = normalize(setSevenDay({ |
| 1047 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:112:  }, rewardDiaryEntries())); |
| 1048 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:113:  assert(rewardSevenDay.includes("Хамгийн хялбар эхлэх цэг") \|\| rewardSevenDay.includes("Авч хэрэгжүүлж болох эхний алхам"), "seven-day report should use natural first-step wording"); |
| 1049 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:114:  assert(!rewardSevenDay.includes("Эхний жижиг өөрчлөлт"), "seven-day report should avoid mechanical first-change wording"); |
| 1050 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:116:  const compressedCycle = normalize(setSevenDay({ |
| 1051 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:122:  }, rewardDiaryEntries())); |
| 1052 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:123:  assert(compressedCycle.includes("Сарын тэмдэг ирэхээс өмнөх"), "compressed seven-day report should keep menstrual-cycle meaning"); |
| 1053 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:124:  assert(!compressedCycle.includes("Эхний жижиг өөрчлөлт"), "compressed seven-day report should avoid mechanical first-change wording"); |
| 1054 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:133:  const collapseSevenDay = normalize(setSevenDay({ |
| 1055 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:136:  }, collapseDiaryEntries())); |
| 1056 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:137:  assert(!collapseSevenDay.includes("Гол гацалт Гол гацалт"), "seven-day report should not duplicate the main-stuck heading"); |
| 1057 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp73-report-voice-copy-cleanup.test.js:138:  assert(!collapseSevenDay.includes("Эхний жижиг өөрчлөлт"), "seven-day collapse report should avoid mechanical first-change wording"); |
| 1058 | REMOVED_OR_REWRITTEN_TEST | ./tests/input-focus.test.js:14:  const renderDiaryInput = functionBody("renderDiaryInput"); |
| 1059 | REMOVED_OR_REWRITTEN_TEST | ./tests/input-focus.test.js:16:  const setDiaryDraftValue = functionBody("setDiaryDraftValue"); |
| 1060 | REMOVED_OR_REWRITTEN_TEST | ./tests/input-focus.test.js:18:  const setDailySummaryText = functionBody("setDailySummaryText"); |
| 1061 | REMOVED_OR_REWRITTEN_TEST | ./tests/input-focus.test.js:24:  assert(renderDiaryInput.includes("oninput=\"setDiaryDraftValue"), "diary text inputs should use draft-only input handler"); |
| 1062 | REMOVED_OR_REWRITTEN_TEST | ./tests/input-focus.test.js:25:  assert(!renderDiaryInput.includes("textarea oninput=\"setDiaryValue"), "diary textarea should not call render-triggering setter on each keystroke"); |
| 1063 | REMOVED_OR_REWRITTEN_TEST | ./tests/input-focus.test.js:28:  assert(!setDiaryDraftValue.includes("render();"), "diary draft input handler must not render"); |
| 1064 | REMOVED_OR_REWRITTEN_TEST | ./tests/input-focus.test.js:30:  assert(!setDailySummaryText.includes("render();"), "daily summary typing must not render"); |
| 1065 | REMOVED_OR_REWRITTEN_TEST | ./tests/input-focus.test.js:33:  assert(renderDiaryInput.includes("id=\"input-${question.id}\""), "diary text inputs should have stable ids"); |
| 1066 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/01_P0_MIXED_LANGUAGE_BATCH_01.md:666:- Role: SEVEN_DAY_USER |
| 1067 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/01_P0_MIXED_LANGUAGE_BATCH_01.md:667:- Scenario: limited-report |
| 1068 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/01_P0_MIXED_LANGUAGE_BATCH_01.md:676:- Render proof: renderReport via limited-report [FULL_SURFACE] |
| 1069 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/01_P0_MIXED_LANGUAGE_BATCH_01.md:724:- Surface: FULL_SEVEN_DAY_REPORT |
| 1070 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/01_P0_MIXED_LANGUAGE_BATCH_01.md:725:- Role: SEVEN_DAY_USER |
| 1071 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/01_P0_MIXED_LANGUAGE_BATCH_01.md:726:- Scenario: full-seven-day-report |
| 1072 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/01_P0_MIXED_LANGUAGE_BATCH_01.md:735:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1073 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/04_P1_TERMINOLOGY_FAMILIES.md:7:\| TERM-01 \| assessment_name_01 \| Сэтгэлзүйн хэв маяг, далд зуршлын үнэлгээ ; Илүүдэл жингээс салах тест үнэлгээ ; Үнэлгээний ялгааг харах ; Үнэлгээний хоёр зам ; Эхлээд өөрт тохирох түвшнээ сонгоно. Нэг удаагийн зураглал нь одоогийн хариултаар эхний тайлан гаргана. 7 хоногийн үнэлгээ тэр зураглалыг бодит өдрүүдийн богино ажиглалтаар нарийвчилна. ; Үнэлгээний сонголт ; Энэ нь тухайн мөчийн хариултад суурилсан эхний зураглал. Бодит өдөр тутмын давтамжийг 7 хоногийн үнэлгээ илүү нарийвчилна. ; 29,000₮ төлөөд 7 хоногийн үнэлгээ эхлүүлэх ; 7 хоногийн үнэлгээ эхлүүлэх ; Өөртөө хор хүргэх бодол, ухаан балартах, будилах, эсвэл огцом бие муудах шинж гарсан байж болзошгүй. Тийм үед энэ үнэлгээ энгийн жин хасалтын тайлан үзүүлэхгүй. \| LANDING, ABOUT, CHOICE, SEVEN_DAY_START, URGENT_SAFETY \| PUBLIC_USER, SEVEN_DAY_USER \| 11 \| app.js:2458, app.js:33, app.js:2465, app.js:2545, app.js:2546, app.js:2598, app.js:2621, UNRESOLVED, app.js:7590 \|  \| |
| 1074 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/04_P1_TERMINOLOGY_FAMILIES.md:9:\| TERM-03 \| report_name_01 \| Бид энэ тестийн асуулт, тайлангийн чанар, аюулгүй байдлын чиглүүлгийг сайжруулж байна. ; Дотоод чанарын шалгалтаар тайлангийн чанар, асуултын ойлгомж, зарим нөхцөлд таарах байдал дээр засах зүйлс илэрсэн тул олон нийтэд төлбөртэй хувилбарыг түр хаалаа. ; Тайлан ямар харагдах вэ? ; Доорх нь бүрэн тайлан биш. Зөвхөн тайлан ямар өнгө аястай гардагийг харуулах богино жишээ. ; Эхлээд өөрт тохирох түвшнээ сонгоно. Нэг удаагийн зураглал нь одоогийн хариултаар эхний тайлан гаргана. 7 хоногийн үнэлгээ тэр зураглалыг бодит өдрүүдийн богино ажиглалтаар нарийвчилна. ; Эхний богино асуулт + орой бүр 3–5 минутын тэмдэглэл. 5 өдөр бөглөсөн ч тайлан гарна, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана. ; Нэг удаагийн зураглал нь эхний тайлан өгнө. 7 хоногийн зураглал бол илүү их тураах төлөвлөгөө биш, харин тэр эхний зураглалыг бодит өдрүүд дээр нарийвчлах богино ажиглалт. ; Бүрэн эхний тайлан ; 9,900₮ төлөөд тайлангаа нээх ; 5 өдөр бөглөсөн ч тайлан гарна ; Төлбөр баталгаажсаны дараа тест нээгдэнэ. Тест бөглөсний дараа таны тайлан шууд дэлгэц дээр гарна. ; Тайлан сэргээх холбоо барих мэдээлэл ; Энэ нь бүртгэл биш. Тайлангаа дэлгэц дээр үзсэний дараа дэмжлэг авах, төлбөрийн лавлагаа шалгуулахад ашиглана. ; Тайлангийн эхний хэсэг ; Энэ хэсэг төлбөргүй хэвээр харагдана. Бүрэн тайлан нээхээс өмнө таны хариултаас хамгийн түрүүнд тодорч буй дохиог харуулж байна. ; Бүрэн тайлангаа нээвэл юу нэмэгдэх вэ? ; Төлбөргүй хэсэг эхний дохиог үлдээнэ. Бүрэн тайлан нь тэр дохиог өдөр тутмын нөхцөл, давхар нөлөө, эхний зөөлөн алхамтай холбож илүү ойлгомжтой болгоно. ; Бүрэн тайланд нэмэгдэнэ ; Бүрэн тайлан нээх ; Төлбөр баталгаажсаны дараа тайлан энэ дэлгэц дээр шууд нээгдэнэ. Эхний дохио болон аюулгүй байдлын сануулга төлбөргүй хэсэгт үлдэнэ. ; Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна. ; Тайлан ; Энэ тайлан онош, баталгаа, эсвэл жин бууруулах амлалт биш. ; Та орой ядарсан үед хоол захиалах эсвэл гэрт байсан амар сонголт руу ордог гэж тэмдэглэсэн. Хариулт цөөн тул энэ тайланг эхний зураглал гэж уншина. ; Өөртөө хор хүргэх бодол, идсэний дараа нөхөх зан үйл, бөөлжүүлэх/туулгах/хэт их дасгал хийх, олон цаг хоолгүй байх давтагдвал энэ тайлангийн энгийн туршилт биш, аюулгүй тусламж түрүүлнэ. ; Таны тайланд хамгийн түрүүнд шалгах зүйл бол Ядаргаа ба хамгийн хялбар сонголт ялах. Энэ нь нэг хариултын тайлбар биш, өдөр тутмын нөхцөл, биеийн мэдрэмж, стресс/ядаргаа, орчны бэлэн сонголт, дараах өөртөө хандах хандлага хоорондоо холбогдож байгааг харуулж байна. ; Хэрвээ хазайлт гарвал түүнийг тайлангийн эсрэг нотолгоо гэж үзэхгүй. Харин яг аль холбоос дээр тойрог буцаж ажиллаж байгааг харуулах мэдээлэл гэж ашигла. ; Тайлангаа хадгалах ; Таны тайлан энэ дэлгэц дээр гарлаа. Одоогоор байнгын тайлангийн холбоос эсвэл имэйл илгээсэн гэж харуулахгүй. ; Тайлан хуулж авах ; Эхний богино асуултаар эхэлнэ. Дараа нь орой бүр 3–5 минутын тэмдэглэл бөглөж, 7 хоногийн дараа илүү нарийвчилсан тайлан гарна. ; 5/7 өдөр бөглөсөн ч тайлан гарна ; Эхний давтамжууд харагдаж эхэлж байна. 5 өдөр хүрвэл тайлан гаргахад хангалттай мэдээлэлтэй болно. ; Тайлан харах ; Тайлангийн бэлэн байдал ; Бүрэн тайлан гаргахад мэдээлэл хангалтгүй байна ; 0-1 өдөр нь таны давтамжийг дүгнэхэд хангалтгүй. Тэмдэглэлээ үргэлжлүүлээд дор хаяж 2-3 өдөр хүрвэл эхний зураглал харагдаж эхэлнэ. 5 өдөр бөглөсөн ч бүрэн тайлан гарна. ; Энэ нь бүрэн тайлан биш тул 14 хоногийн туршилт өгөхгүй. Тэмдэглэлээ үргэлжлүүлж 5/7 өдөр хүрвэл бүрэн тайлан гарна. ; 2-3 өдрийн мэдээлэл дээр зарим дохио харагдаж болно. Гэхдээ энэ нь бүрэн тайлан биш, эхний reflection хэвээр байна. ; 4 өдрийн мэдээлэл зан үйлийн давтамжийг тодорхойлоход ашиглаж болох түвшинд хүрсэн. Дахиад 1 өдөр бөглөвөл бүрэн тайлан гаргах босгонд хүрнэ. ; Таны тайлан бэлэн боллоо ; Доорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай. ; Дэлгэрэнгүй тайлан ; Дэлгэрэнгүй тайлангийн хэсэг ; Тайлан руу буцах ; Сонирхож байна, гэхдээ эхлээд тайлангийн жишээ хармаар байна ; Өөртөө хор хүргэх бодол, ухаан балартах, будилах, эсвэл огцом бие муудах шинж гарсан байж болзошгүй. Тийм үед энэ үнэлгээ энгийн жин хасалтын тайлан үзүүлэхгүй. ; Та тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана. ; Тайлан таны нөхцөлтэй хэр нийцсэн бэ? ; Тайлангийн эхний “Гол гацалт” хэсэг ойлгомжтой байсан уу? ; Тайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү? ; Тайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу? ; Тайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу? ; Тайлангийн хэл найруулга ямар санагдсан бэ? ; Энэ тайланг 9,900 төгрөгөөр авахад үнэ цэнтэй санагдах уу? ; Таны хариулт тестийн асуулт, тайлангийн найруулга, хэрэгтэй эсэхийг сайжруулахад шууд ашиглагдана. ; 9,900₮ төлөөд бүрэн тайлангаа нээх ; Төлбөр баталгаажлаа. Таны бүрэн тайлан нээгдлээ. \| COMING_SOON, LANDING, ABOUT, CHOICE, ONE_TIME_START, ONE_TIME_PAYWALL, ONE_TIME_REPORT, SEVEN_DAY_PAYWALL, SEVEN_DAY_START, DIARY_HOME, INSUFFICIENT_REPORT, LIMITED_REPORT, FULL_SEVEN_DAY_REPORT, UPGRADE_PAYWALL, LEAD_CAPTURE, GENERAL_SAFETY, PROFESSIONAL_SAFETY, URGENT_SAFETY, OTHER_PROVEN_RENDERED, PAYMENT, QPAY, VISIBLE_ERROR, SAMPLE_REPORT \| PUBLIC_USER, PAID_USER, SEVEN_DAY_USER, INTERNAL_TESTER \| 87 \| app.js:2424, app.js:2437, app.js:2515, app.js:2516, app.js:2546, app.js:2549, app.js:2602, app.js:2611, UNRESOLVED, app.js:2719, app.js:2729, app.js:2731, app.js:4273, app.js:4279, app.js:4288, app.js:4289, app.js:4300, app.js:4314, app.js:7375, app.js:6397, app.js:5848, app.js:6441, app.js:4344, app.js:4355, app.js:2907, app.js:2911, app.js:3297, app.js:7663, app.js:3258, app.js:3259, app.js:7673, app.js:3269, app.js:3279, app.js:6470, app.js:6471, app.js:7455, app.js:4447, app.js:95, app.js:7590, app.js:7121, app.js:7125, app.js:7128, app.js:7129, app.js:7130, app.js:7131, app.js:7132, app.js:7133, app.js:7188, app.js:1550 \|  \| |
| 1075 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/04_P1_TERMINOLOGY_FAMILIES.md:10:\| TERM-04 \| initial_result_name_01 \| тухайн мөчийн хариултад суурилсан эхний зураглал. ; Нэг удаагийн зураглал нь эхний тайлан өгнө. 7 хоногийн зураглал бол илүү их тураах төлөвлөгөө биш, харин тэр эхний зураглалыг бодит өдрүүд дээр нарийвчлах богино ажиглалт. ; Энэ нь тухайн мөчийн хариултад суурилсан эхний зураглал. Бодит өдөр тутмын давтамжийг 7 хоногийн үнэлгээ илүү нарийвчилна. ; Эхний зураглал ба ажиглалтын харьцуулалт ; Таны эхний зураглал бэлэн боллоо ; Энэ хэсэг нэг удаагийн хариултад тулгуурлана. Эхний зураглалд одоогийн хариултыг ашиглав. ; Та орой ядарсан үед хоол захиалах эсвэл гэрт байсан амар сонголт руу ордог гэж тэмдэглэсэн. Хариулт цөөн тул энэ тайланг эхний зураглал гэж уншина. ; 0-1 өдөр нь таны давтамжийг дүгнэхэд хангалтгүй. Тэмдэглэлээ үргэлжлүүлээд дор хаяж 2-3 өдөр хүрвэл эхний зураглал харагдаж эхэлнэ. 5 өдөр бөглөсөн ч бүрэн тайлан гарна. ; Хязгаартай эхний зураглал ; Эхний зураглал ба бодит ажиглалтын харьцуулалт \| ABOUT, CHOICE, ONE_TIME_PAYWALL, ONE_TIME_REPORT, INSUFFICIENT_REPORT, LIMITED_REPORT, UPGRADE_PAYWALL \| PUBLIC_USER, PAID_USER, SEVEN_DAY_USER \| 10 \| UNRESOLVED, app.js:2602, app.js:2621, app.js:2637, app.js:3259, app.js:3268, app.js:4440 \|  \| |
| 1076 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/04_P1_TERMINOLOGY_FAMILIES.md:11:\| TERM-05 \| seven_day_product_name_01 \| 7 хоногийн богино тэмдэглэл ; 7 хоногоор нарийвчилбал ; Эхлээд өөрт тохирох түвшнээ сонгоно. Нэг удаагийн зураглал нь одоогийн хариултаар эхний тайлан гаргана. 7 хоногийн үнэлгээ тэр зураглалыг бодит өдрүүдийн богино ажиглалтаар нарийвчилна. ; 7 хоногийн гүн зураглал ; 7 хоногийн: ; Нэг удаагийн зураглал нь эхний тайлан өгнө. 7 хоногийн зураглал бол илүү их тураах төлөвлөгөө биш, харин тэр эхний зураглалыг бодит өдрүүд дээр нарийвчлах богино ажиглалт. ; 7 хоногоор нарийвчлах боломж ; Энэ нь тухайн мөчийн хариултад суурилсан эхний зураглал. Бодит өдөр тутмын давтамжийг 7 хоногийн үнэлгээ илүү нарийвчилна. ; 7 хоногийн гүн анализ ; Энэ нь илүү их тураах төлөвлөгөө биш. Зүгээр л 7 хоногийн богино ажиглалт. Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана. ; 29,000₮ төлөөд 7 хоногийн үнэлгээ эхлүүлэх ; 7 хоногийн гүн анализ руу шилжих боломж ; 7 хоногийн гүн анализаа нээх ; 7 хоногийн тэмдэглэлээр таны өдөр тутмын бодит давтамж илүү тод харагдана. Анхны сэтгэгдэл ба өдөр тутмын ажиглалт хоёр хаана давхцаж, хаана зөрж байгааг эндээс харна. ; 7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна ; Эхний богино асуултаар эхэлнэ. Дараа нь орой бүр 3–5 минутын тэмдэглэл бөглөж, 7 хоногийн дараа илүү нарийвчилсан тайлан гарна. ; 7 хоногийн үнэлгээ эхлүүлэх ; 7 хоногийн тэмдэглэл ; 7 хоногийн ажиглалт дууслаа. Таны бүрэн зураглал бэлэн болж байна. ; Энэ хэсэг 7 хоногийн тэмдэглэлд тулгуурлана. 5/7 өдрийн ажиглалттай байна. ; 7 хоногоор нарийвчлах ; Энэ зураглалыг 7 хоногоор илүү тодруулж болно ; Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. ; 7 хоногийн богино тэмдэглэл нь аль өдөр, ямар үед илүү хүчтэй болдгийг нарийвчилна. ; 19,900₮ төлөөд 7 хоногоор нарийвчлах ; 7 хоногийн нээлтийн үнэ 29,000₮ ; 3. Ойрын 7 хоногт юуг ажиглах вэ? ; 7 хоногт 1-2 ; 7 хоногт 1–2 удаа хэрэглэдэг ; 7 хоногт 3 ба түүнээс олон удаа хэрэглэдэг ; 7 хоногт хэд хэд ; 14–17 хоногийн өмнө \| LANDING, ABOUT, CHOICE, ONE_TIME_PAYWALL, SEVEN_DAY_PAYWALL, SEVEN_DAY_START, DIARY_HOME, FULL_SEVEN_DAY_REPORT, UPGRADE_OFFER, UPGRADE_PAYWALL, PROFESSIONAL_SAFETY, SAMPLE_REPORT, ANSWER_OPTIONS \| PUBLIC_USER, SEVEN_DAY_USER, PAID_USER \| 44 \| UNRESOLVED, app.js:2532, app.js:2546, app.js:2555, app.js:2602, app.js:2619, app.js:2621, app.js:2641, app.js:4307, app.js:2876, app.js:2881, app.js:2906, app.js:2907, app.js:3294, app.js:4420, app.js:7622, app.js:339, app.js:383 \|  \| |
| 1077 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/04_P1_TERMINOLOGY_FAMILIES.md:13:\| TERM-07 \| diary_tracking_name_01 \| 7 хоногийн богино тэмдэглэл ; Энэ нь аль өдөр, ямар үед илүү хүчтэй болдгийг богино тэмдэглэлээр тодруулна. ; Эхний богино асуулт + орой бүр 3–5 минутын тэмдэглэл. 5 өдөр бөглөсөн ч тайлан гарна, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана. ; Орой бүр 3–5 минутын богино тэмдэглэлээр таны идэх хүсэл бодит амьдрал дээр ямар үед давтагдаж байгааг харна. ; 7 өдөр богино тэмдэглэл ; 7 хоногийн тэмдэглэлээр таны өдөр тутмын бодит давтамж илүү тод харагдана. Анхны сэтгэгдэл ба өдөр тутмын ажиглалт хоёр хаана давхцаж, хаана зөрж байгааг эндээс харна. ; Эхний богино асуултаар эхэлнэ. Дараа нь орой бүр 3–5 минутын тэмдэглэл бөглөж, 7 хоногийн дараа илүү нарийвчилсан тайлан гарна. ; 7 хоногийн тэмдэглэл ; Тэмдэглэлийн явц ; Тэмдэглэлийн 1 дэх өдөр ; 0-1 өдөр нь таны давтамжийг дүгнэхэд хангалтгүй. Тэмдэглэлээ үргэлжлүүлээд дор хаяж 2-3 өдөр хүрвэл эхний зураглал харагдаж эхэлнэ. 5 өдөр бөглөсөн ч бүрэн тайлан гарна. ; Энэ нь бүрэн тайлан биш тул 14 хоногийн туршилт өгөхгүй. Тэмдэглэлээ үргэлжлүүлж 5/7 өдөр хүрвэл бүрэн тайлан гарна. ; Тэмдэглэлээ үргэлжлүүлэх ; Тэмдэглэл рүү буцах ; Энэ хэсэг 7 хоногийн тэмдэглэлд тулгуурлана. 5/7 өдрийн ажиглалттай байна. ; 7 хоногийн богино тэмдэглэл нь аль өдөр, ямар үед илүү хүчтэй болдгийг нарийвчилна. ; Орой бүр 3–5 минутын богино тэмдэглэл ; Нэр / тэмдэглэл ; Нэмэлт тэмдэглэл \| LANDING, ABOUT, CHOICE, SEVEN_DAY_PAYWALL, SEVEN_DAY_START, DIARY_HOME, DIARY_QUESTION, INSUFFICIENT_REPORT, LIMITED_REPORT, FULL_SEVEN_DAY_REPORT, UPGRADE_OFFER, UPGRADE_PAYWALL, ADVISOR_PORTAL, SAMPLE_REPORT \| PUBLIC_USER, SEVEN_DAY_USER, PAID_USER, ADVISOR \| 36 \| UNRESOLVED, app.js:2533, app.js:2549, app.js:2631, app.js:2881, app.js:2907, app.js:3259, app.js:7673, app.js:7675, app.js:4420, app.js:7041, app.js:7042 \|  \| |
| 1078 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/04_P1_TERMINOLOGY_FAMILIES.md:14:\| TERM-08 \| evidence_observation_name_01 \| Sleep / Rhythm / Recovery — унтах хэмнэл, энерги, сэргэлтийн ажиглалт ; Эхлээд өөрт тохирох түвшнээ сонгоно. Нэг удаагийн зураглал нь одоогийн хариултаар эхний тайлан гаргана. 7 хоногийн үнэлгээ тэр зураглалыг бодит өдрүүдийн богино ажиглалтаар нарийвчилна. ; илүү их тураах төлөвлөгөө биш, бодит өдөр тутмын давтамжийг нарийвчлах богино ажиглалт. ; Нэг удаагийн зураглал нь эхний тайлан өгнө. 7 хоногийн зураглал бол илүү их тураах төлөвлөгөө биш, харин тэр эхний зураглалыг бодит өдрүүд дээр нарийвчлах богино ажиглалт. ; Эхний зураглал ба ажиглалтын харьцуулалт ; Энэ нь илүү их тураах төлөвлөгөө биш. Зүгээр л 7 хоногийн богино ажиглалт. Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана. ; Гол дохио: Орой хоол шийдэхэд хүнд санагдах үе. Давхар дохиог тодруулахад нэмэлт ажиглалт хэрэгтэй. ; Тусгаар ганц хариултаас тусдаа урт дүгнэлт хийхгүй. Одоогоор ажиглах зүйлс гол хэв маягийн нотолгоонд шингэсэн байна. ; Хэрвээ хазайлт гарвал түүнийг тайлангийн эсрэг нотолгоо гэж үзэхгүй. Харин яг аль холбоос дээр тойрог буцаж ажиллаж байгааг харуулах мэдээлэл гэж ашигла. ; 7 хоногийн тэмдэглэлээр таны өдөр тутмын бодит давтамж илүү тод харагдана. Анхны сэтгэгдэл ба өдөр тутмын ажиглалт хоёр хаана давхцаж, хаана зөрж байгааг эндээс харна. ; 7 хоногийн ажиглалт дууслаа. Таны бүрэн зураглал бэлэн болж байна. ; Энэ хэсэг 7 хоногийн тэмдэглэлд тулгуурлана. 5/7 өдрийн ажиглалттай байна. ; Эхний зураглал ба бодит ажиглалтын харьцуулалт \| LANDING, ABOUT, CHOICE, ONE_TIME_PAYWALL, ONE_TIME_REPORT, SEVEN_DAY_PAYWALL, DIARY_HOME, FULL_SEVEN_DAY_REPORT, UPGRADE_PAYWALL \| PUBLIC_USER, PAID_USER, SEVEN_DAY_USER \| 13 \| app.js:46, app.js:2546, app.js:2555, app.js:2602, app.js:2637, app.js:2641, UNRESOLVED, app.js:6412, app.js:6441, app.js:2881, app.js:3294, app.js:4440 \|  \| |
| 1079 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/04_P1_TERMINOLOGY_FAMILIES.md:16:\| TERM-10 \| experiment_program_plan_name_01 \| илүү их тураах төлөвлөгөө биш, бодит өдөр тутмын давтамжийг нарийвчлах богино ажиглалт. ; Нэг удаагийн зураглал нь эхний тайлан өгнө. 7 хоногийн зураглал бол илүү их тураах төлөвлөгөө биш, харин тэр эхний зураглалыг бодит өдрүүд дээр нарийвчлах богино ажиглалт. ; 14 хоногийн эхний туршилт ; Илүү тод 14 хоногийн туршилт ; Энэ нь илүү их тураах төлөвлөгөө биш. Зүгээр л 7 хоногийн богино ажиглалт. Нэг өдөр алгаслаа гээд бүтэлгүйтсэн гэсэн үг биш, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана. ; Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна. ; Орой хоол бодож, сонгож, бэлдэх хүртэл хүнд болдог. Энэ нь мэдлэг дутагдсан гэсэн үг биш. Төлөвлөгөө их шийдвэр шаардаж, харин бодит өдөр тэнхээ багатай байвал хамгийн бага хүч шаардсан сонголт ажилладаг. ; нэг жижиг туршилт хийсэн өдөр тойрог суларвал ; өдөр бүр шинэ шийдвэр шаардах төлөвлөгөө ; 7. 7–14 хоногийн нэг хувьсагчийн туршилт ; Өөртөө оноо тавихгүй; энэ бол дараагийн хувилбараа олох туршилт. ; Өөртөө хор хүргэх бодол, идсэний дараа нөхөх зан үйл, бөөлжүүлэх/туулгах/хэт их дасгал хийх, олон цаг хоолгүй байх давтагдвал энэ тайлангийн энгийн туршилт биш, аюулгүй тусламж түрүүлнэ. ; Одоо зорилго нь бүхнийг нэг өдөрт өөрчлөх биш. Эхний туршилт бол “Ядарсан өдөр хэрэглэх бага хүчтэй бэлэн хоолны хоёр хувилбар сонго. Тэдгээр нь төгс байх шаардлагагүй, харин бодит өдөр ажиллах ёстой.” гэсэн нэг л алхмыг 7–14 хоног шалгах явдал. ; Энэ нь бүрэн тайлан биш тул 14 хоногийн туршилт өгөхгүй. Тэмдэглэлээ үргэлжлүүлж 5/7 өдөр хүрвэл бүрэн тайлан гарна. ; 14 хоногийн туршилт ; Хэт чангалсан дүрэм нэмэхээс илүү нэг давтамжийг бодит өдөр тутамд ажиглах жижиг туршилт сонгоно. ; Нээлтийн туршилтын бүртгэл ; 1. Яагаад ердийн жин хасалтын туршилт өгөхгүй байна вэ? ; Энэ үед жин хасах туршилт хийхээс өмнө ганцаараа үлдэхгүй, ойрын итгэдэг хүнтэйгээ холбогдох нь чухал. ; Нээлтээс өмнөх туршилтын хувилбар ; Дотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй. ; Туршилтын санал асуулга ; Дотоод туршилтын санал асуулгын JSON таталт. ; Дасгалжуулагчтай хөтөлбөр \| ABOUT, CHOICE, ONE_TIME_PAYWALL, ONE_TIME_REPORT, INSUFFICIENT_REPORT, LIMITED_REPORT, FULL_SEVEN_DAY_REPORT, UPGRADE_PAYWALL, LEAD_CAPTURE, PROFESSIONAL_SAFETY, URGENT_SAFETY, ADVISOR_PORTAL, OTHER_PROVEN_RENDERED, ANSWER_OPTIONS \| PUBLIC_USER, PAID_USER, SEVEN_DAY_USER, ADVISOR, INTERNAL_TESTER \| 32 \| app.js:2555, app.js:2602, UNRESOLVED, app.js:2641, app.js:7375, app.js:5642, app.js:6166, app.js:6425, app.js:6374, app.js:5848, app.js:7673, app.js:7367, app.js:7610, app.js:7374, app.js:7027, app.js:7119, app.js:7120, app.js:7204, app.js:335 \|  \| |
| 1080 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:62:function setSevenDay(nextState = {}) { |
| 1081 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:64:    packageType: "seven-day", |
| 1082 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:72:    diaryEntries: entries(5), |
| 1083 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:78:  setSevenDay(); |
| 1084 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:106:  setSevenDay({ diaryEntries: entries(3) }); |
| 1085 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:111:  setSevenDay({ diaryEntries: entries(4) }); |
| 1086 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:116:  setSevenDay({ stageAnswers: { "S1-S03": "Одоо давтагддаг" }, diaryEntries: entries(5) }); |
| 1087 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:122:  setSevenDay({ stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" }, diaryEntries: entries(5) }); |
| 1088 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:129:  setSevenDay({ |
| 1089 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:131:    diaryEntries: entries(5, { meal_rhythm: "Тогтвортой, хоол алгасаагүй" }) |
| 1090 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-bible-sections.test.js:156:  assert(!oneTime.includes("7 хоногоор нарийвчлах")); |
| 1091 | REMOVED_OR_REWRITTEN_TEST | ./tests/domain-metadata-implementation.test.js:122:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged"); |
| 1092 | REMOVED_OR_REWRITTEN_TEST | ./tests/domain-metadata-implementation.test.js:123:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged"); |
| 1093 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./HUMAN_LIKE_VIRTUAL_USER_QA_45M_OFFICE.md:54:Choose `7 хоногийн гүн зураглал`. |
| 1094 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:54:    diaryEntries: [] |
| 1095 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:58:function setSevenDayFull() { |
| 1096 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:60:    packageType: "seven-day", |
| 1097 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:70:    diaryEntries: Array.from({ length: 5 }, (_, index) => entry(index + 1)) |
| 1098 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:78:  setSevenDayFull(); |
| 1099 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:81:    packageType: "seven-day", |
| 1100 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:88:    diaryEntries: Array.from({ length: 5 }, (_, index) => entry(index + 1, { |
| 1101 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:95:    packageType: "seven-day", |
| 1102 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:98:    diaryEntries: Array.from({ length: 5 }, (_, index) => entry(index + 1)) |
| 1103 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:102:    packageType: "seven-day", |
| 1104 | REMOVED_OR_REWRITTEN_TEST | ./tests/copy-localization.test.js:105:    diaryEntries: Array.from({ length: 5 }, (_, index) => entry(index + 1)) |
| 1105 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-report-quality.test.js:14:  sevenDayPaid: false, |
| 1106 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-report-quality.test.js:24:  diaryEntries: [], |
| 1107 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-report-quality.test.js:65:  "7 хоногоор нарийвчлах", |
| 1108 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-report-quality.test.js:66:  "19,900₮ төлөөд 7 хоногоор нарийвчлах" |
| 1109 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-report-quality.test.js:83:  diaryEntries: [], |
| 1110 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1070:> 7 хоногийн гүн зураглал |
| 1111 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1077:- Surface: SEVEN_DAY_PAYWALL |
| 1112 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1079:- Scenario: seven-day-paywall |
| 1113 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1080:- Render source: renderSevenDayPaywall |
| 1114 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1088:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 1115 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1105:> 7 хоногийн гүн зураглал |
| 1116 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1135:- Surface: SEVEN_DAY_PAYWALL |
| 1117 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1137:- Scenario: seven-day-paywall |
| 1118 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1138:- Render source: renderSevenDayPaywall |
| 1119 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1144:- Source function/object: renderSevenDayPaywall |
| 1120 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1146:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 1121 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1159:> <h2>7 хоногийн гүн анализаа нээх</h2> |
| 1122 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1163:> 7 хоногийн гүн зураглал |
| 1123 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1165:> 7 хоногийн гүн анализаа нээх |
| 1124 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1187:> 7 хоногийн гүн анализаа нээх |
| 1125 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1194:- Surface: SEVEN_DAY_PAYWALL |
| 1126 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1196:- Scenario: seven-day-paywall |
| 1127 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1197:- Render source: renderSevenDayPaywall |
| 1128 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1203:- Source function/object: renderSevenDayPaywall |
| 1129 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1205:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 1130 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1214:> <h2>7 хоногийн гүн анализаа нээх</h2> |
| 1131 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1223:> 7 хоногийн гүн анализаа нээх |
| 1132 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1253:- Surface: SEVEN_DAY_PAYWALL |
| 1133 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1255:- Scenario: seven-day-paywall |
| 1134 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1256:- Render source: renderSevenDayPaywall |
| 1135 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1264:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 1136 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1281:> 7 хоногийн гүн анализаа нээх |
| 1137 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1312:- Surface: SEVEN_DAY_PAYWALL |
| 1138 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1314:- Scenario: seven-day-paywall |
| 1139 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1315:- Render source: renderSevenDayPaywall |
| 1140 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1323:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 1141 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1328:> sevenDay: "29,000₮", |
| 1142 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1332:> sevenDayAnchor: "69,000₮", |
| 1143 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1371:- Surface: SEVEN_DAY_PAYWALL |
| 1144 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1373:- Scenario: seven-day-paywall |
| 1145 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1374:- Render source: renderSevenDayPaywall |
| 1146 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1382:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 1147 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1430:- Surface: SEVEN_DAY_PAYWALL |
| 1148 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1432:- Scenario: seven-day-paywall |
| 1149 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1433:- Render source: renderSevenDayPaywall |
| 1150 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1441:- Render proof: renderSevenDayPaywall via seven-day-paywall [FULL_SURFACE] |
| 1151 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1450:> sevenDay: "29,000₮", |
| 1152 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_02.md:1454:> sevenDayAnchor: "69,000₮", |
| 1153 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:91:      "id": "seven-day-paywall", |
| 1154 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:92:      "surface": "SEVEN_DAY_PAYWALL", |
| 1155 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:95:      "render_source": "renderSevenDayPaywall", |
| 1156 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:103:      "id": "seven-day-start", |
| 1157 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:104:      "surface": "SEVEN_DAY_START", |
| 1158 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:105:      "role": "SEVEN_DAY_USER", |
| 1159 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:107:      "render_source": "renderSevenDayStart", |
| 1160 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:117:      "role": "SEVEN_DAY_USER", |
| 1161 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:119:      "render_source": "renderDiaryHome", |
| 1162 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:129:      "role": "SEVEN_DAY_USER", |
| 1163 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:131:      "render_source": "renderDiaryHome", |
| 1164 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:141:      "role": "SEVEN_DAY_USER", |
| 1165 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:143:      "render_source": "renderDiaryHome", |
| 1166 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:153:      "role": "SEVEN_DAY_USER", |
| 1167 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:155:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1168 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:165:      "role": "SEVEN_DAY_USER", |
| 1169 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:167:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1170 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:177:      "role": "SEVEN_DAY_USER", |
| 1171 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:179:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1172 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:189:      "role": "SEVEN_DAY_USER", |
| 1173 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:191:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1174 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:201:      "role": "SEVEN_DAY_USER", |
| 1175 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:203:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1176 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:213:      "role": "SEVEN_DAY_USER", |
| 1177 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:215:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1178 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:225:      "role": "SEVEN_DAY_USER", |
| 1179 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:227:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1180 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:237:      "role": "SEVEN_DAY_USER", |
| 1181 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:239:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1182 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:249:      "role": "SEVEN_DAY_USER", |
| 1183 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:251:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1184 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:261:      "role": "SEVEN_DAY_USER", |
| 1185 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:271:      "id": "limited-report", |
| 1186 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:273:      "role": "SEVEN_DAY_USER", |
| 1187 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:283:      "id": "usable-limited-report", |
| 1188 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:285:      "role": "SEVEN_DAY_USER", |
| 1189 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:295:      "id": "full-seven-day-report", |
| 1190 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:296:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1191 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:297:      "role": "SEVEN_DAY_USER", |
| 1192 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:311:      "render_source": "renderUpgradeOffer", |
| 1193 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:323:      "render_source": "renderUpgradeOffer", |
| 1194 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:331:      "id": "upgrade-paywall", |
| 1195 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:335:      "render_source": "renderUpgradePaywall", |
| 1196 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:1641:      "text": "7 хоногийн гүн зураглал", |
| 1197 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:2270:      "text": "7 хоногоор нарийвчлах боломж", |
| 1198 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:2338:      "text": "7 хоногийн гүн анализ", |
| 1199 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:3545:      "text": "7 хоногийн гүн анализ руу шилжих боломж", |
| 1200 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5058:      "text": "7 хоногийн гүн зураглал", |
| 1201 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5059:      "surface": "SEVEN_DAY_PAYWALL", |
| 1202 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5061:      "scenario": "seven-day-paywall", |
| 1203 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5062:      "render_source": "renderSevenDayPaywall", |
| 1204 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5070:        "seven-day-paywall" |
| 1205 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5076:      "surface": "SEVEN_DAY_PAYWALL", |
| 1206 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5078:      "scenario": "seven-day-paywall", |
| 1207 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5079:      "render_source": "renderSevenDayPaywall", |
| 1208 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5087:        "seven-day-paywall" |
| 1209 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5092:      "text": "7 хоногийн гүн анализаа нээх", |
| 1210 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5093:      "surface": "SEVEN_DAY_PAYWALL", |
| 1211 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5095:      "scenario": "seven-day-paywall", |
| 1212 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5096:      "render_source": "renderSevenDayPaywall", |
| 1213 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5104:        "seven-day-paywall" |
| 1214 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5110:      "surface": "SEVEN_DAY_PAYWALL", |
| 1215 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5112:      "scenario": "seven-day-paywall", |
| 1216 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5113:      "render_source": "renderSevenDayPaywall", |
| 1217 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5121:        "seven-day-paywall" |
| 1218 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5127:      "surface": "SEVEN_DAY_PAYWALL", |
| 1219 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5129:      "scenario": "seven-day-paywall", |
| 1220 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5130:      "render_source": "renderSevenDayPaywall", |
| 1221 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5138:        "seven-day-paywall" |
| 1222 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5144:      "surface": "SEVEN_DAY_PAYWALL", |
| 1223 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5146:      "scenario": "seven-day-paywall", |
| 1224 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5147:      "render_source": "renderSevenDayPaywall", |
| 1225 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5155:        "seven-day-paywall" |
| 1226 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5161:      "surface": "SEVEN_DAY_PAYWALL", |
| 1227 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5163:      "scenario": "seven-day-paywall", |
| 1228 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5164:      "render_source": "renderSevenDayPaywall", |
| 1229 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5172:        "seven-day-paywall" |
| 1230 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5178:      "surface": "SEVEN_DAY_PAYWALL", |
| 1231 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5180:      "scenario": "seven-day-paywall", |
| 1232 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5181:      "render_source": "renderSevenDayPaywall", |
| 1233 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5189:        "seven-day-paywall" |
| 1234 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5195:      "surface": "SEVEN_DAY_PAYWALL", |
| 1235 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5197:      "scenario": "seven-day-paywall", |
| 1236 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5198:      "render_source": "renderSevenDayPaywall", |
| 1237 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5206:        "seven-day-paywall" |
| 1238 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5212:      "surface": "SEVEN_DAY_PAYWALL", |
| 1239 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5214:      "scenario": "seven-day-paywall", |
| 1240 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5215:      "render_source": "renderSevenDayPaywall", |
| 1241 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5223:        "seven-day-paywall" |
| 1242 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5229:      "surface": "SEVEN_DAY_PAYWALL", |
| 1243 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5231:      "scenario": "seven-day-paywall", |
| 1244 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5232:      "render_source": "renderSevenDayPaywall", |
| 1245 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5240:        "seven-day-paywall" |
| 1246 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5246:      "surface": "SEVEN_DAY_PAYWALL", |
| 1247 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5248:      "scenario": "seven-day-paywall", |
| 1248 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5249:      "render_source": "renderSevenDayPaywall", |
| 1249 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5257:        "seven-day-paywall" |
| 1250 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5263:      "surface": "SEVEN_DAY_PAYWALL", |
| 1251 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5265:      "scenario": "seven-day-paywall", |
| 1252 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5266:      "render_source": "renderSevenDayPaywall", |
| 1253 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5274:        "seven-day-paywall" |
| 1254 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5280:      "surface": "SEVEN_DAY_PAYWALL", |
| 1255 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5282:      "scenario": "seven-day-paywall", |
| 1256 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5283:      "render_source": "renderSevenDayPaywall", |
| 1257 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5291:        "seven-day-paywall" |
| 1258 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5297:      "surface": "SEVEN_DAY_PAYWALL", |
| 1259 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5299:      "scenario": "seven-day-paywall", |
| 1260 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5300:      "render_source": "renderSevenDayPaywall", |
| 1261 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5308:        "seven-day-paywall" |
| 1262 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5314:      "surface": "SEVEN_DAY_PAYWALL", |
| 1263 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5316:      "scenario": "seven-day-paywall", |
| 1264 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5317:      "render_source": "renderSevenDayPaywall", |
| 1265 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5325:        "seven-day-paywall" |
| 1266 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5330:      "text": "7 хоногийн гүн зураглал", |
| 1267 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5331:      "surface": "SEVEN_DAY_START", |
| 1268 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5332:      "role": "SEVEN_DAY_USER", |
| 1269 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5333:      "scenario": "seven-day-start", |
| 1270 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5334:      "render_source": "renderSevenDayStart", |
| 1271 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5342:        "seven-day-start" |
| 1272 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5347:      "text": "7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна", |
| 1273 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5348:      "surface": "SEVEN_DAY_START", |
| 1274 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5349:      "role": "SEVEN_DAY_USER", |
| 1275 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5350:      "scenario": "seven-day-start", |
| 1276 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5351:      "render_source": "renderSevenDayStart", |
| 1277 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5359:        "seven-day-start" |
| 1278 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5365:      "surface": "SEVEN_DAY_START", |
| 1279 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5366:      "role": "SEVEN_DAY_USER", |
| 1280 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5367:      "scenario": "seven-day-start", |
| 1281 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5368:      "render_source": "renderSevenDayStart", |
| 1282 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5376:        "seven-day-start" |
| 1283 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5382:      "surface": "SEVEN_DAY_START", |
| 1284 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5383:      "role": "SEVEN_DAY_USER", |
| 1285 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5384:      "scenario": "seven-day-start", |
| 1286 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5385:      "render_source": "renderSevenDayStart", |
| 1287 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5393:        "seven-day-start" |
| 1288 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5399:      "surface": "SEVEN_DAY_START", |
| 1289 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5400:      "role": "SEVEN_DAY_USER", |
| 1290 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5401:      "scenario": "seven-day-start", |
| 1291 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5402:      "render_source": "renderSevenDayStart", |
| 1292 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5410:        "seven-day-start" |
| 1293 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5416:      "surface": "SEVEN_DAY_START", |
| 1294 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5417:      "role": "SEVEN_DAY_USER", |
| 1295 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5418:      "scenario": "seven-day-start", |
| 1296 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5419:      "render_source": "renderSevenDayStart", |
| 1297 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5427:        "seven-day-start" |
| 1298 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5433:      "surface": "SEVEN_DAY_START", |
| 1299 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5434:      "role": "SEVEN_DAY_USER", |
| 1300 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5435:      "scenario": "seven-day-start", |
| 1301 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5436:      "render_source": "renderSevenDayStart", |
| 1302 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5444:        "seven-day-start" |
| 1303 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5450:      "surface": "SEVEN_DAY_START", |
| 1304 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5451:      "role": "SEVEN_DAY_USER", |
| 1305 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5452:      "scenario": "seven-day-start", |
| 1306 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5453:      "render_source": "renderSevenDayStart", |
| 1307 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5461:        "seven-day-start" |
| 1308 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5467:      "surface": "SEVEN_DAY_START", |
| 1309 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5468:      "role": "SEVEN_DAY_USER", |
| 1310 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5469:      "scenario": "seven-day-start", |
| 1311 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5470:      "render_source": "renderSevenDayStart", |
| 1312 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5478:        "seven-day-start" |
| 1313 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5484:      "surface": "SEVEN_DAY_START", |
| 1314 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5485:      "role": "SEVEN_DAY_USER", |
| 1315 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5486:      "scenario": "seven-day-start", |
| 1316 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5487:      "render_source": "renderSevenDayStart", |
| 1317 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5495:        "seven-day-start" |
| 1318 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5501:      "surface": "SEVEN_DAY_START", |
| 1319 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5502:      "role": "SEVEN_DAY_USER", |
| 1320 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5503:      "scenario": "seven-day-start", |
| 1321 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5504:      "render_source": "renderSevenDayStart", |
| 1322 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5512:        "seven-day-start" |
| 1323 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5519:      "role": "SEVEN_DAY_USER", |
| 1324 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5521:      "render_source": "renderDiaryHome", |
| 1325 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5538:      "role": "SEVEN_DAY_USER", |
| 1326 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5540:      "render_source": "renderDiaryHome", |
| 1327 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5557:      "role": "SEVEN_DAY_USER", |
| 1328 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5559:      "render_source": "renderDiaryHome", |
| 1329 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5574:      "role": "SEVEN_DAY_USER", |
| 1330 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5576:      "render_source": "renderDiaryHome", |
| 1331 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5591:      "role": "SEVEN_DAY_USER", |
| 1332 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5593:      "render_source": "renderDiaryHome", |
| 1333 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5610:      "role": "SEVEN_DAY_USER", |
| 1334 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5612:      "render_source": "renderDiaryHome", |
| 1335 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5627:      "role": "SEVEN_DAY_USER", |
| 1336 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5629:      "render_source": "renderDiaryHome", |
| 1337 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5646:      "role": "SEVEN_DAY_USER", |
| 1338 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5648:      "render_source": "renderDiaryHome", |
| 1339 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5665:      "role": "SEVEN_DAY_USER", |
| 1340 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5667:      "render_source": "renderDiaryHome", |
| 1341 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5683:      "role": "SEVEN_DAY_USER", |
| 1342 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5685:      "render_source": "renderDiaryHome", |
| 1343 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5700:      "role": "SEVEN_DAY_USER", |
| 1344 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5702:      "render_source": "renderDiaryHome", |
| 1345 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5717:      "role": "SEVEN_DAY_USER", |
| 1346 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5719:      "render_source": "renderDiaryHome", |
| 1347 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5734:      "role": "SEVEN_DAY_USER", |
| 1348 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5736:      "render_source": "renderDiaryHome", |
| 1349 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5751:      "role": "SEVEN_DAY_USER", |
| 1350 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5753:      "render_source": "renderDiaryHome", |
| 1351 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5768:      "role": "SEVEN_DAY_USER", |
| 1352 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5770:      "render_source": "renderDiaryHome", |
| 1353 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5785:      "role": "SEVEN_DAY_USER", |
| 1354 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5787:      "render_source": "renderDiaryHome", |
| 1355 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5802:      "role": "SEVEN_DAY_USER", |
| 1356 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5804:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1357 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5822:      "role": "SEVEN_DAY_USER", |
| 1358 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5824:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1359 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5839:      "role": "SEVEN_DAY_USER", |
| 1360 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5841:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1361 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5856:      "role": "SEVEN_DAY_USER", |
| 1362 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5858:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1363 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5873:      "role": "SEVEN_DAY_USER", |
| 1364 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5875:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1365 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5890:      "role": "SEVEN_DAY_USER", |
| 1366 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5892:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1367 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5907:      "role": "SEVEN_DAY_USER", |
| 1368 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5909:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1369 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5924:      "role": "SEVEN_DAY_USER", |
| 1370 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5926:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1371 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5941:      "role": "SEVEN_DAY_USER", |
| 1372 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5943:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1373 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5961:      "role": "SEVEN_DAY_USER", |
| 1374 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5963:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1375 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5981:      "role": "SEVEN_DAY_USER", |
| 1376 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:5983:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1377 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6001:      "role": "SEVEN_DAY_USER", |
| 1378 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6003:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1379 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6020:      "role": "SEVEN_DAY_USER", |
| 1380 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6022:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1381 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6037:      "role": "SEVEN_DAY_USER", |
| 1382 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6039:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1383 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6054:      "role": "SEVEN_DAY_USER", |
| 1384 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6056:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1385 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6071:      "role": "SEVEN_DAY_USER", |
| 1386 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6073:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1387 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6088:      "role": "SEVEN_DAY_USER", |
| 1388 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6090:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1389 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6105:      "role": "SEVEN_DAY_USER", |
| 1390 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6107:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1391 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6122:      "role": "SEVEN_DAY_USER", |
| 1392 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6124:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1393 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6139:      "role": "SEVEN_DAY_USER", |
| 1394 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6141:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1395 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6156:      "role": "SEVEN_DAY_USER", |
| 1396 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6158:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1397 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6173:      "role": "SEVEN_DAY_USER", |
| 1398 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6175:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1399 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6190:      "role": "SEVEN_DAY_USER", |
| 1400 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6192:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1401 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6207:      "role": "SEVEN_DAY_USER", |
| 1402 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6209:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1403 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6224:      "role": "SEVEN_DAY_USER", |
| 1404 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6226:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1405 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6241:      "role": "SEVEN_DAY_USER", |
| 1406 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6243:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1407 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6258:      "role": "SEVEN_DAY_USER", |
| 1408 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6260:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1409 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6275:      "role": "SEVEN_DAY_USER", |
| 1410 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6277:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1411 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6292:      "role": "SEVEN_DAY_USER", |
| 1412 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6294:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1413 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6309:      "role": "SEVEN_DAY_USER", |
| 1414 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6311:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1415 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6326:      "role": "SEVEN_DAY_USER", |
| 1416 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6328:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1417 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6343:      "role": "SEVEN_DAY_USER", |
| 1418 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6345:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1419 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6360:      "role": "SEVEN_DAY_USER", |
| 1420 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6362:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1421 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6377:      "role": "SEVEN_DAY_USER", |
| 1422 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6379:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1423 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6394:      "role": "SEVEN_DAY_USER", |
| 1424 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6396:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1425 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6411:      "role": "SEVEN_DAY_USER", |
| 1426 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6413:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1427 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6428:      "role": "SEVEN_DAY_USER", |
| 1428 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6430:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1429 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6445:      "role": "SEVEN_DAY_USER", |
| 1430 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6447:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1431 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6462:      "role": "SEVEN_DAY_USER", |
| 1432 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6464:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1433 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6479:      "role": "SEVEN_DAY_USER", |
| 1434 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6481:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1435 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6496:      "role": "SEVEN_DAY_USER", |
| 1436 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6498:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1437 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6513:      "role": "SEVEN_DAY_USER", |
| 1438 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6515:      "render_source": "renderDiary using diaryQuestionIndex", |
| 1439 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6530:      "role": "SEVEN_DAY_USER", |
| 1440 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6532:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1441 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6551:      "role": "SEVEN_DAY_USER", |
| 1442 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6553:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1443 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6568:      "role": "SEVEN_DAY_USER", |
| 1444 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6570:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1445 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6589:      "role": "SEVEN_DAY_USER", |
| 1446 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6591:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1447 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6610:      "role": "SEVEN_DAY_USER", |
| 1448 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6612:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1449 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6630:      "role": "SEVEN_DAY_USER", |
| 1450 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6632:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1451 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6647:      "role": "SEVEN_DAY_USER", |
| 1452 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6649:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1453 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6667:      "role": "SEVEN_DAY_USER", |
| 1454 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6669:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1455 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6687:      "role": "SEVEN_DAY_USER", |
| 1456 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6689:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1457 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6704:      "role": "SEVEN_DAY_USER", |
| 1458 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6706:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1459 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6721:      "role": "SEVEN_DAY_USER", |
| 1460 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6723:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1461 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6739:      "role": "SEVEN_DAY_USER", |
| 1462 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6741:      "render_source": "renderDailySummaryConfirmation(D-SUM01)", |
| 1463 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6756:      "role": "SEVEN_DAY_USER", |
| 1464 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6773:      "role": "SEVEN_DAY_USER", |
| 1465 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6790:      "role": "SEVEN_DAY_USER", |
| 1466 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6807:      "role": "SEVEN_DAY_USER", |
| 1467 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6824:      "role": "SEVEN_DAY_USER", |
| 1468 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6841:      "role": "SEVEN_DAY_USER", |
| 1469 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6858:      "role": "SEVEN_DAY_USER", |
| 1470 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6875:      "role": "SEVEN_DAY_USER", |
| 1471 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6892:      "role": "SEVEN_DAY_USER", |
| 1472 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6909:      "role": "SEVEN_DAY_USER", |
| 1473 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6926:      "role": "SEVEN_DAY_USER", |
| 1474 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6927:      "scenario": "limited-report", |
| 1475 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6936:        "limited-report", |
| 1476 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6937:        "usable-limited-report" |
| 1477 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6944:      "role": "SEVEN_DAY_USER", |
| 1478 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6945:      "scenario": "limited-report", |
| 1479 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6954:        "limited-report" |
| 1480 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6961:      "role": "SEVEN_DAY_USER", |
| 1481 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6962:      "scenario": "limited-report", |
| 1482 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6971:        "limited-report" |
| 1483 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6978:      "role": "SEVEN_DAY_USER", |
| 1484 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6979:      "scenario": "limited-report", |
| 1485 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6988:        "limited-report" |
| 1486 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6995:      "role": "SEVEN_DAY_USER", |
| 1487 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:6996:      "scenario": "limited-report", |
| 1488 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7005:        "limited-report", |
| 1489 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7006:        "usable-limited-report" |
| 1490 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7013:      "role": "SEVEN_DAY_USER", |
| 1491 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7014:      "scenario": "limited-report", |
| 1492 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7023:        "limited-report" |
| 1493 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7030:      "role": "SEVEN_DAY_USER", |
| 1494 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7031:      "scenario": "limited-report", |
| 1495 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7040:        "limited-report", |
| 1496 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7041:        "usable-limited-report" |
| 1497 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7048:      "role": "SEVEN_DAY_USER", |
| 1498 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7049:      "scenario": "limited-report", |
| 1499 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7058:        "limited-report", |
| 1500 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7059:        "usable-limited-report" |
| 1501 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7066:      "role": "SEVEN_DAY_USER", |
| 1502 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7067:      "scenario": "limited-report", |
| 1503 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7076:        "limited-report", |
| 1504 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7077:        "usable-limited-report" |
| 1505 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7084:      "role": "SEVEN_DAY_USER", |
| 1506 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7085:      "scenario": "limited-report", |
| 1507 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7094:        "limited-report", |
| 1508 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7095:        "usable-limited-report" |
| 1509 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7102:      "role": "SEVEN_DAY_USER", |
| 1510 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7103:      "scenario": "limited-report", |
| 1511 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7112:        "limited-report", |
| 1512 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7113:        "usable-limited-report" |
| 1513 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7120:      "role": "SEVEN_DAY_USER", |
| 1514 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7121:      "scenario": "limited-report", |
| 1515 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7130:        "limited-report", |
| 1516 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7131:        "usable-limited-report" |
| 1517 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7138:      "role": "SEVEN_DAY_USER", |
| 1518 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7139:      "scenario": "limited-report", |
| 1519 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7148:        "limited-report", |
| 1520 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7149:        "usable-limited-report" |
| 1521 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7156:      "role": "SEVEN_DAY_USER", |
| 1522 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7157:      "scenario": "usable-limited-report", |
| 1523 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7166:        "usable-limited-report" |
| 1524 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7173:      "role": "SEVEN_DAY_USER", |
| 1525 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7174:      "scenario": "usable-limited-report", |
| 1526 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7183:        "usable-limited-report" |
| 1527 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7190:      "role": "SEVEN_DAY_USER", |
| 1528 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7191:      "scenario": "usable-limited-report", |
| 1529 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7200:        "usable-limited-report" |
| 1530 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7207:      "role": "SEVEN_DAY_USER", |
| 1531 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7208:      "scenario": "usable-limited-report", |
| 1532 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7217:        "usable-limited-report" |
| 1533 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7223:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1534 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7224:      "role": "SEVEN_DAY_USER", |
| 1535 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7225:      "scenario": "full-seven-day-report", |
| 1536 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7234:        "full-seven-day-report" |
| 1537 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7240:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1538 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7241:      "role": "SEVEN_DAY_USER", |
| 1539 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7242:      "scenario": "full-seven-day-report", |
| 1540 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7251:        "full-seven-day-report" |
| 1541 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7257:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1542 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7258:      "role": "SEVEN_DAY_USER", |
| 1543 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7259:      "scenario": "full-seven-day-report", |
| 1544 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7268:        "full-seven-day-report" |
| 1545 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7274:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1546 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7275:      "role": "SEVEN_DAY_USER", |
| 1547 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7276:      "scenario": "full-seven-day-report", |
| 1548 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7285:        "full-seven-day-report" |
| 1549 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7291:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1550 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7292:      "role": "SEVEN_DAY_USER", |
| 1551 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7293:      "scenario": "full-seven-day-report", |
| 1552 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7302:        "full-seven-day-report" |
| 1553 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7308:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1554 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7309:      "role": "SEVEN_DAY_USER", |
| 1555 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7310:      "scenario": "full-seven-day-report", |
| 1556 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7319:        "full-seven-day-report" |
| 1557 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7325:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1558 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7326:      "role": "SEVEN_DAY_USER", |
| 1559 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7327:      "scenario": "full-seven-day-report", |
| 1560 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7336:        "full-seven-day-report" |
| 1561 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7342:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1562 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7343:      "role": "SEVEN_DAY_USER", |
| 1563 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7344:      "scenario": "full-seven-day-report", |
| 1564 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7353:        "full-seven-day-report" |
| 1565 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7359:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1566 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7360:      "role": "SEVEN_DAY_USER", |
| 1567 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7361:      "scenario": "full-seven-day-report", |
| 1568 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7370:        "full-seven-day-report" |
| 1569 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7376:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1570 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7377:      "role": "SEVEN_DAY_USER", |
| 1571 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7378:      "scenario": "full-seven-day-report", |
| 1572 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7387:        "full-seven-day-report" |
| 1573 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7393:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1574 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7394:      "role": "SEVEN_DAY_USER", |
| 1575 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7395:      "scenario": "full-seven-day-report", |
| 1576 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7404:        "full-seven-day-report" |
| 1577 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7410:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1578 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7411:      "role": "SEVEN_DAY_USER", |
| 1579 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7412:      "scenario": "full-seven-day-report", |
| 1580 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7421:        "full-seven-day-report" |
| 1581 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7427:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1582 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7428:      "role": "SEVEN_DAY_USER", |
| 1583 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7429:      "scenario": "full-seven-day-report", |
| 1584 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7438:        "full-seven-day-report" |
| 1585 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7444:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1586 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7445:      "role": "SEVEN_DAY_USER", |
| 1587 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7446:      "scenario": "full-seven-day-report", |
| 1588 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7455:        "full-seven-day-report" |
| 1589 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7461:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1590 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7462:      "role": "SEVEN_DAY_USER", |
| 1591 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7463:      "scenario": "full-seven-day-report", |
| 1592 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7472:        "full-seven-day-report" |
| 1593 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7478:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1594 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7479:      "role": "SEVEN_DAY_USER", |
| 1595 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7480:      "scenario": "full-seven-day-report", |
| 1596 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7489:        "full-seven-day-report" |
| 1597 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7495:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1598 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7496:      "role": "SEVEN_DAY_USER", |
| 1599 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7497:      "scenario": "full-seven-day-report", |
| 1600 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7506:        "full-seven-day-report" |
| 1601 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7512:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1602 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7513:      "role": "SEVEN_DAY_USER", |
| 1603 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7514:      "scenario": "full-seven-day-report", |
| 1604 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7523:        "full-seven-day-report" |
| 1605 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7529:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1606 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7530:      "role": "SEVEN_DAY_USER", |
| 1607 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7531:      "scenario": "full-seven-day-report", |
| 1608 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7540:        "full-seven-day-report" |
| 1609 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7546:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1610 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7547:      "role": "SEVEN_DAY_USER", |
| 1611 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7548:      "scenario": "full-seven-day-report", |
| 1612 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7557:        "full-seven-day-report" |
| 1613 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7563:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1614 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7564:      "role": "SEVEN_DAY_USER", |
| 1615 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7565:      "scenario": "full-seven-day-report", |
| 1616 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7574:        "full-seven-day-report" |
| 1617 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7580:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1618 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7581:      "role": "SEVEN_DAY_USER", |
| 1619 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7582:      "scenario": "full-seven-day-report", |
| 1620 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7591:        "full-seven-day-report" |
| 1621 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7597:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1622 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7598:      "role": "SEVEN_DAY_USER", |
| 1623 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7599:      "scenario": "full-seven-day-report", |
| 1624 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7608:        "full-seven-day-report" |
| 1625 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7614:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1626 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7615:      "role": "SEVEN_DAY_USER", |
| 1627 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7616:      "scenario": "full-seven-day-report", |
| 1628 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7625:        "full-seven-day-report" |
| 1629 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7631:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1630 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7632:      "role": "SEVEN_DAY_USER", |
| 1631 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7633:      "scenario": "full-seven-day-report", |
| 1632 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7642:        "full-seven-day-report" |
| 1633 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7648:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1634 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7649:      "role": "SEVEN_DAY_USER", |
| 1635 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7650:      "scenario": "full-seven-day-report", |
| 1636 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7659:        "full-seven-day-report" |
| 1637 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7665:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1638 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7666:      "role": "SEVEN_DAY_USER", |
| 1639 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7667:      "scenario": "full-seven-day-report", |
| 1640 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7676:        "full-seven-day-report" |
| 1641 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7682:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1642 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7683:      "role": "SEVEN_DAY_USER", |
| 1643 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7684:      "scenario": "full-seven-day-report", |
| 1644 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7693:        "full-seven-day-report" |
| 1645 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7699:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1646 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7700:      "role": "SEVEN_DAY_USER", |
| 1647 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7701:      "scenario": "full-seven-day-report", |
| 1648 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7710:        "full-seven-day-report" |
| 1649 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7716:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1650 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7717:      "role": "SEVEN_DAY_USER", |
| 1651 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7718:      "scenario": "full-seven-day-report", |
| 1652 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7727:        "full-seven-day-report" |
| 1653 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7733:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1654 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7734:      "role": "SEVEN_DAY_USER", |
| 1655 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7735:      "scenario": "full-seven-day-report", |
| 1656 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7744:        "full-seven-day-report" |
| 1657 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7750:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1658 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7751:      "role": "SEVEN_DAY_USER", |
| 1659 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7752:      "scenario": "full-seven-day-report", |
| 1660 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7761:        "full-seven-day-report" |
| 1661 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7767:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1662 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7768:      "role": "SEVEN_DAY_USER", |
| 1663 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7769:      "scenario": "full-seven-day-report", |
| 1664 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7778:        "full-seven-day-report" |
| 1665 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7784:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1666 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7785:      "role": "SEVEN_DAY_USER", |
| 1667 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7786:      "scenario": "full-seven-day-report", |
| 1668 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7795:        "full-seven-day-report" |
| 1669 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7801:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1670 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7802:      "role": "SEVEN_DAY_USER", |
| 1671 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7803:      "scenario": "full-seven-day-report", |
| 1672 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7812:        "full-seven-day-report" |
| 1673 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7818:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1674 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7819:      "role": "SEVEN_DAY_USER", |
| 1675 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7820:      "scenario": "full-seven-day-report", |
| 1676 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7829:        "full-seven-day-report" |
| 1677 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7835:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1678 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7836:      "role": "SEVEN_DAY_USER", |
| 1679 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7837:      "scenario": "full-seven-day-report", |
| 1680 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7846:        "full-seven-day-report" |
| 1681 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7852:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1682 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7853:      "role": "SEVEN_DAY_USER", |
| 1683 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7854:      "scenario": "full-seven-day-report", |
| 1684 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7863:        "full-seven-day-report" |
| 1685 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7869:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1686 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7870:      "role": "SEVEN_DAY_USER", |
| 1687 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7871:      "scenario": "full-seven-day-report", |
| 1688 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7880:        "full-seven-day-report" |
| 1689 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7886:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1690 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7887:      "role": "SEVEN_DAY_USER", |
| 1691 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7888:      "scenario": "full-seven-day-report", |
| 1692 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7897:        "full-seven-day-report" |
| 1693 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7903:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1694 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7904:      "role": "SEVEN_DAY_USER", |
| 1695 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7905:      "scenario": "full-seven-day-report", |
| 1696 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7914:        "full-seven-day-report" |
| 1697 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7920:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1698 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7921:      "role": "SEVEN_DAY_USER", |
| 1699 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7922:      "scenario": "full-seven-day-report", |
| 1700 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7931:        "full-seven-day-report" |
| 1701 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7937:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1702 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7938:      "role": "SEVEN_DAY_USER", |
| 1703 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7939:      "scenario": "full-seven-day-report", |
| 1704 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7948:        "full-seven-day-report" |
| 1705 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7954:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1706 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7955:      "role": "SEVEN_DAY_USER", |
| 1707 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7956:      "scenario": "full-seven-day-report", |
| 1708 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7965:        "full-seven-day-report" |
| 1709 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7971:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1710 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7972:      "role": "SEVEN_DAY_USER", |
| 1711 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7973:      "scenario": "full-seven-day-report", |
| 1712 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7982:        "full-seven-day-report" |
| 1713 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7988:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1714 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7989:      "role": "SEVEN_DAY_USER", |
| 1715 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7990:      "scenario": "full-seven-day-report", |
| 1716 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:7999:        "full-seven-day-report" |
| 1717 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8005:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1718 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8006:      "role": "SEVEN_DAY_USER", |
| 1719 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8007:      "scenario": "full-seven-day-report", |
| 1720 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8016:        "full-seven-day-report" |
| 1721 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8022:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1722 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8023:      "role": "SEVEN_DAY_USER", |
| 1723 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8024:      "scenario": "full-seven-day-report", |
| 1724 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8033:        "full-seven-day-report" |
| 1725 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8039:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1726 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8040:      "role": "SEVEN_DAY_USER", |
| 1727 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8041:      "scenario": "full-seven-day-report", |
| 1728 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8050:        "full-seven-day-report" |
| 1729 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8056:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1730 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8057:      "role": "SEVEN_DAY_USER", |
| 1731 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8058:      "scenario": "full-seven-day-report", |
| 1732 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8067:        "full-seven-day-report" |
| 1733 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8073:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1734 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8074:      "role": "SEVEN_DAY_USER", |
| 1735 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8075:      "scenario": "full-seven-day-report", |
| 1736 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8084:        "full-seven-day-report" |
| 1737 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8090:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1738 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8091:      "role": "SEVEN_DAY_USER", |
| 1739 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8092:      "scenario": "full-seven-day-report", |
| 1740 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8101:        "full-seven-day-report" |
| 1741 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8107:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1742 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8108:      "role": "SEVEN_DAY_USER", |
| 1743 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8109:      "scenario": "full-seven-day-report", |
| 1744 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8118:        "full-seven-day-report" |
| 1745 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8124:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1746 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8125:      "role": "SEVEN_DAY_USER", |
| 1747 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8126:      "scenario": "full-seven-day-report", |
| 1748 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8135:        "full-seven-day-report" |
| 1749 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8141:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1750 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8142:      "role": "SEVEN_DAY_USER", |
| 1751 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8143:      "scenario": "full-seven-day-report", |
| 1752 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8152:        "full-seven-day-report" |
| 1753 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8158:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1754 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8159:      "role": "SEVEN_DAY_USER", |
| 1755 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8160:      "scenario": "full-seven-day-report", |
| 1756 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8169:        "full-seven-day-report" |
| 1757 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8175:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1758 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8176:      "role": "SEVEN_DAY_USER", |
| 1759 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8177:      "scenario": "full-seven-day-report", |
| 1760 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8186:        "full-seven-day-report" |
| 1761 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8192:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1762 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8193:      "role": "SEVEN_DAY_USER", |
| 1763 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8194:      "scenario": "full-seven-day-report", |
| 1764 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8203:        "full-seven-day-report" |
| 1765 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8209:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1766 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8210:      "role": "SEVEN_DAY_USER", |
| 1767 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8211:      "scenario": "full-seven-day-report", |
| 1768 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8220:        "full-seven-day-report" |
| 1769 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8226:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1770 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8227:      "role": "SEVEN_DAY_USER", |
| 1771 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8228:      "scenario": "full-seven-day-report", |
| 1772 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8237:        "full-seven-day-report" |
| 1773 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8243:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1774 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8244:      "role": "SEVEN_DAY_USER", |
| 1775 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8245:      "scenario": "full-seven-day-report", |
| 1776 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8254:        "full-seven-day-report" |
| 1777 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8260:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1778 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8261:      "role": "SEVEN_DAY_USER", |
| 1779 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8262:      "scenario": "full-seven-day-report", |
| 1780 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8271:        "full-seven-day-report" |
| 1781 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8277:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1782 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8278:      "role": "SEVEN_DAY_USER", |
| 1783 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8279:      "scenario": "full-seven-day-report", |
| 1784 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8288:        "full-seven-day-report" |
| 1785 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8294:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1786 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8295:      "role": "SEVEN_DAY_USER", |
| 1787 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8296:      "scenario": "full-seven-day-report", |
| 1788 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8305:        "full-seven-day-report" |
| 1789 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8311:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1790 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8312:      "role": "SEVEN_DAY_USER", |
| 1791 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8313:      "scenario": "full-seven-day-report", |
| 1792 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8322:        "full-seven-day-report" |
| 1793 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8328:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1794 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8329:      "role": "SEVEN_DAY_USER", |
| 1795 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8330:      "scenario": "full-seven-day-report", |
| 1796 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8339:        "full-seven-day-report" |
| 1797 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8345:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1798 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8346:      "role": "SEVEN_DAY_USER", |
| 1799 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8347:      "scenario": "full-seven-day-report", |
| 1800 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8356:        "full-seven-day-report" |
| 1801 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8362:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1802 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8363:      "role": "SEVEN_DAY_USER", |
| 1803 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8364:      "scenario": "full-seven-day-report", |
| 1804 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8373:        "full-seven-day-report" |
| 1805 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8379:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1806 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8380:      "role": "SEVEN_DAY_USER", |
| 1807 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8381:      "scenario": "full-seven-day-report", |
| 1808 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8390:        "full-seven-day-report" |
| 1809 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8396:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1810 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8397:      "role": "SEVEN_DAY_USER", |
| 1811 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8398:      "scenario": "full-seven-day-report", |
| 1812 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8407:        "full-seven-day-report" |
| 1813 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8413:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1814 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8414:      "role": "SEVEN_DAY_USER", |
| 1815 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8415:      "scenario": "full-seven-day-report", |
| 1816 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8424:        "full-seven-day-report" |
| 1817 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8430:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1818 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8431:      "role": "SEVEN_DAY_USER", |
| 1819 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8432:      "scenario": "full-seven-day-report", |
| 1820 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8441:        "full-seven-day-report" |
| 1821 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8447:      "surface": "FULL_SEVEN_DAY_REPORT", |
| 1822 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8448:      "role": "SEVEN_DAY_USER", |
| 1823 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8449:      "scenario": "full-seven-day-report", |
| 1824 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8458:        "full-seven-day-report" |
| 1825 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8463:      "text": "7 хоногоор нарийвчлах", |
| 1826 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8467:      "render_source": "renderUpgradeOffer", |
| 1827 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8484:      "render_source": "renderUpgradeOffer", |
| 1828 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8501:      "render_source": "renderUpgradeOffer", |
| 1829 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8518:      "render_source": "renderUpgradeOffer", |
| 1830 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8531:      "text": "Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.", |
| 1831 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8535:      "render_source": "renderUpgradeOffer", |
| 1832 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8552:      "render_source": "renderUpgradeOffer", |
| 1833 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8565:      "text": "19,900₮ төлөөд 7 хоногоор нарийвчлах", |
| 1834 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8569:      "render_source": "renderUpgradeOffer", |
| 1835 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8582:      "text": "7 хоногоор нарийвчлах", |
| 1836 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8585:      "scenario": "upgrade-paywall", |
| 1837 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8586:      "render_source": "renderUpgradePaywall", |
| 1838 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8594:        "upgrade-paywall" |
| 1839 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8602:      "scenario": "upgrade-paywall", |
| 1840 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8603:      "render_source": "renderUpgradePaywall", |
| 1841 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8611:        "upgrade-paywall" |
| 1842 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8619:      "scenario": "upgrade-paywall", |
| 1843 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8620:      "render_source": "renderUpgradePaywall", |
| 1844 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8628:        "upgrade-paywall" |
| 1845 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8636:      "scenario": "upgrade-paywall", |
| 1846 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8637:      "render_source": "renderUpgradePaywall", |
| 1847 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8645:        "upgrade-paywall" |
| 1848 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8653:      "scenario": "upgrade-paywall", |
| 1849 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8654:      "render_source": "renderUpgradePaywall", |
| 1850 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8662:        "upgrade-paywall" |
| 1851 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8667:      "text": "Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.", |
| 1852 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8670:      "scenario": "upgrade-paywall", |
| 1853 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8671:      "render_source": "renderUpgradePaywall", |
| 1854 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8679:        "upgrade-paywall" |
| 1855 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8687:      "scenario": "upgrade-paywall", |
| 1856 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8688:      "render_source": "renderUpgradePaywall", |
| 1857 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8696:        "upgrade-paywall" |
| 1858 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8704:      "scenario": "upgrade-paywall", |
| 1859 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8705:      "render_source": "renderUpgradePaywall", |
| 1860 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8713:        "upgrade-paywall" |
| 1861 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8721:      "scenario": "upgrade-paywall", |
| 1862 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8722:      "render_source": "renderUpgradePaywall", |
| 1863 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8730:        "upgrade-paywall" |
| 1864 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8738:      "scenario": "upgrade-paywall", |
| 1865 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8739:      "render_source": "renderUpgradePaywall", |
| 1866 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8747:        "upgrade-paywall" |
| 1867 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8755:      "scenario": "upgrade-paywall", |
| 1868 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8756:      "render_source": "renderUpgradePaywall", |
| 1869 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8764:        "upgrade-paywall" |
| 1870 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8769:      "text": "19,900₮ төлөөд 7 хоногоор нарийвчлах", |
| 1871 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8772:      "scenario": "upgrade-paywall", |
| 1872 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8773:      "render_source": "renderUpgradePaywall", |
| 1873 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8781:        "upgrade-paywall" |
| 1874 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8789:      "scenario": "upgrade-paywall", |
| 1875 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8790:      "render_source": "renderUpgradePaywall", |
| 1876 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8798:        "upgrade-paywall" |
| 1877 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8806:      "scenario": "upgrade-paywall", |
| 1878 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8807:      "render_source": "renderUpgradePaywall", |
| 1879 | REGENERATED_ARTIFACT | ./artifacts/mongolian-rendered-copy.json:8815:        "upgrade-paywall" |
| 1880 | REMOVED_OR_REWRITTEN_TEST | ./tests/qpay-device-payment-ux.test.js:92:    sevenDayPaid: false, |
| 1881 | REMOVED_OR_REWRITTEN_TEST | ./tests/coach-workflow-qa.test.js:87:    diaryEntries: [] |
| 1882 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp75-safety-copy-polish.test.js:16:    sevenDayPaid: false, |
| 1883 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp75-safety-copy-polish.test.js:22:    diaryEntries: [], |
| 1884 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:16:- Surface: FULL_SEVEN_DAY_REPORT |
| 1885 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:17:- Role: SEVEN_DAY_USER |
| 1886 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:18:- Scenario: full-seven-day-report |
| 1887 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:27:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1888 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:75:- Surface: FULL_SEVEN_DAY_REPORT |
| 1889 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:76:- Role: SEVEN_DAY_USER |
| 1890 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:77:- Scenario: full-seven-day-report |
| 1891 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:86:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1892 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:134:- Surface: FULL_SEVEN_DAY_REPORT |
| 1893 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:135:- Role: SEVEN_DAY_USER |
| 1894 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:136:- Scenario: full-seven-day-report |
| 1895 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:145:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1896 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:193:- Surface: FULL_SEVEN_DAY_REPORT |
| 1897 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:194:- Role: SEVEN_DAY_USER |
| 1898 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:195:- Scenario: full-seven-day-report |
| 1899 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:204:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1900 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:252:- Surface: FULL_SEVEN_DAY_REPORT |
| 1901 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:253:- Role: SEVEN_DAY_USER |
| 1902 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:254:- Scenario: full-seven-day-report |
| 1903 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:263:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1904 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:311:- Surface: FULL_SEVEN_DAY_REPORT |
| 1905 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:312:- Role: SEVEN_DAY_USER |
| 1906 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:313:- Scenario: full-seven-day-report |
| 1907 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:322:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1908 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:370:- Surface: FULL_SEVEN_DAY_REPORT |
| 1909 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:371:- Role: SEVEN_DAY_USER |
| 1910 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:372:- Scenario: full-seven-day-report |
| 1911 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:381:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1912 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:429:- Surface: FULL_SEVEN_DAY_REPORT |
| 1913 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:430:- Role: SEVEN_DAY_USER |
| 1914 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:431:- Scenario: full-seven-day-report |
| 1915 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:440:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1916 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:488:- Surface: FULL_SEVEN_DAY_REPORT |
| 1917 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:489:- Role: SEVEN_DAY_USER |
| 1918 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:490:- Scenario: full-seven-day-report |
| 1919 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:499:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1920 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:547:- Surface: FULL_SEVEN_DAY_REPORT |
| 1921 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:548:- Role: SEVEN_DAY_USER |
| 1922 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:549:- Scenario: full-seven-day-report |
| 1923 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:558:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1924 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:606:- Surface: FULL_SEVEN_DAY_REPORT |
| 1925 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:607:- Role: SEVEN_DAY_USER |
| 1926 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:608:- Scenario: full-seven-day-report |
| 1927 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:617:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1928 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:665:- Surface: FULL_SEVEN_DAY_REPORT |
| 1929 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:666:- Role: SEVEN_DAY_USER |
| 1930 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:667:- Scenario: full-seven-day-report |
| 1931 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:676:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1932 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:724:- Surface: FULL_SEVEN_DAY_REPORT |
| 1933 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:725:- Role: SEVEN_DAY_USER |
| 1934 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:726:- Scenario: full-seven-day-report |
| 1935 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:735:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1936 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:783:- Surface: FULL_SEVEN_DAY_REPORT |
| 1937 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:784:- Role: SEVEN_DAY_USER |
| 1938 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:785:- Scenario: full-seven-day-report |
| 1939 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:794:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1940 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:842:- Surface: FULL_SEVEN_DAY_REPORT |
| 1941 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:843:- Role: SEVEN_DAY_USER |
| 1942 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:844:- Scenario: full-seven-day-report |
| 1943 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:853:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1944 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:901:- Surface: FULL_SEVEN_DAY_REPORT |
| 1945 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:902:- Role: SEVEN_DAY_USER |
| 1946 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:903:- Scenario: full-seven-day-report |
| 1947 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:912:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1948 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:960:- Surface: FULL_SEVEN_DAY_REPORT |
| 1949 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:961:- Role: SEVEN_DAY_USER |
| 1950 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:962:- Scenario: full-seven-day-report |
| 1951 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:971:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1952 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1019:- Surface: FULL_SEVEN_DAY_REPORT |
| 1953 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1020:- Role: SEVEN_DAY_USER |
| 1954 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1021:- Scenario: full-seven-day-report |
| 1955 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1030:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1956 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1078:- Surface: FULL_SEVEN_DAY_REPORT |
| 1957 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1079:- Role: SEVEN_DAY_USER |
| 1958 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1080:- Scenario: full-seven-day-report |
| 1959 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1089:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1960 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1137:- Surface: FULL_SEVEN_DAY_REPORT |
| 1961 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1138:- Role: SEVEN_DAY_USER |
| 1962 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1139:- Scenario: full-seven-day-report |
| 1963 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1148:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1964 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1196:- Surface: FULL_SEVEN_DAY_REPORT |
| 1965 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1197:- Role: SEVEN_DAY_USER |
| 1966 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1198:- Scenario: full-seven-day-report |
| 1967 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1207:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1968 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1255:- Surface: FULL_SEVEN_DAY_REPORT |
| 1969 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1256:- Role: SEVEN_DAY_USER |
| 1970 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1257:- Scenario: full-seven-day-report |
| 1971 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1266:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1972 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1314:- Surface: FULL_SEVEN_DAY_REPORT |
| 1973 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1315:- Role: SEVEN_DAY_USER |
| 1974 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1316:- Scenario: full-seven-day-report |
| 1975 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1325:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1976 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1373:- Surface: FULL_SEVEN_DAY_REPORT |
| 1977 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1374:- Role: SEVEN_DAY_USER |
| 1978 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1375:- Scenario: full-seven-day-report |
| 1979 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1384:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1980 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1432:- Surface: FULL_SEVEN_DAY_REPORT |
| 1981 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1433:- Role: SEVEN_DAY_USER |
| 1982 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1434:- Scenario: full-seven-day-report |
| 1983 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1443:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1984 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1491:- Surface: FULL_SEVEN_DAY_REPORT |
| 1985 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1492:- Role: SEVEN_DAY_USER |
| 1986 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1493:- Scenario: full-seven-day-report |
| 1987 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1502:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1988 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1550:- Surface: FULL_SEVEN_DAY_REPORT |
| 1989 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1551:- Role: SEVEN_DAY_USER |
| 1990 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1552:- Scenario: full-seven-day-report |
| 1991 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1561:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1992 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1609:- Surface: FULL_SEVEN_DAY_REPORT |
| 1993 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1610:- Role: SEVEN_DAY_USER |
| 1994 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1611:- Scenario: full-seven-day-report |
| 1995 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1620:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 1996 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1668:- Surface: FULL_SEVEN_DAY_REPORT |
| 1997 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1669:- Role: SEVEN_DAY_USER |
| 1998 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1670:- Scenario: full-seven-day-report |
| 1999 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1679:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2000 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1727:- Surface: FULL_SEVEN_DAY_REPORT |
| 2001 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1728:- Role: SEVEN_DAY_USER |
| 2002 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1729:- Scenario: full-seven-day-report |
| 2003 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_05.md:1738:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2004 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:18:    sevenDayPaid: false, |
| 2005 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:44:    diaryEntries: [], |
| 2006 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:64:function setSevenDay(overrides = {}) { |
| 2007 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:66:    packageType: "seven-day", |
| 2008 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:69:    sevenDayPaid: true, |
| 2009 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:78:    diaryEntries: [ |
| 2010 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:178:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged"); |
| 2011 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:179:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged"); |
| 2012 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:244:  setSevenDay({ |
| 2013 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:245:    diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] |
| 2014 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:255:  setSevenDay({ |
| 2015 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-copy-trust-qa.test.js:256:    diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] |
| 2016 | REMOVED_OR_REWRITTEN_TEST | ./tests/gender-gating.test.js:14:    diaryDraft: {}, |
| 2017 | REMOVED_OR_REWRITTEN_TEST | ./tests/gender-gating.test.js:15:    diaryEntries: [], |
| 2018 | REMOVED_OR_REWRITTEN_TEST | ./tests/gender-gating.test.js:24:function visibleDiaryText(stageAnswers = {}, diaryDraft = {}) { |
| 2019 | REMOVED_OR_REWRITTEN_TEST | ./tests/gender-gating.test.js:26:    packageType: "seven-day", |
| 2020 | REMOVED_OR_REWRITTEN_TEST | ./tests/gender-gating.test.js:28:    diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа", ...diaryDraft }, |
| 2021 | REMOVED_OR_REWRITTEN_TEST | ./tests/gender-gating.test.js:30:    diaryEntries: [] |
| 2022 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:19:    sevenDayPaid: false, |
| 2023 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:71:["stage1", "preliminary", "unlock", "diaryHome", "diary", "reportReady", "report"].forEach(view => { |
| 2024 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:72:  resetUnpaid({ packageType: "seven-day", view }); |
| 2025 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:73:  assert.strictEqual(_internal.enforcePaidFirstGate(), true, `${view} restore must be redirected for unpaid seven-day user`); |
| 2026 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:74:  assert.strictEqual(_internal.getTestState().view, "sevenDayStart", `${view} restore must return to seven-day payment gate`); |
| 2027 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:77:resetUnpaid({ packageType: "seven-day", view: "sevenDayStart" }); |
| 2028 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:78:assert.strictEqual(_internal.canStartPaidAssessment("seven-day"), false, "unpaid seven-day user must not be start-eligible"); |
| 2029 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:79:assert.strictEqual(_internal.beginAssessment("seven-day"), false, "unpaid seven-day beginAssessment must be blocked"); |
| 2030 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:80:assert.strictEqual(_internal.startDiary(), false, "unpaid seven-day user must not enter diary"); |
| 2031 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:81:assert.notStrictEqual(_internal.getTestState().view, "diary", "unpaid seven-day user must not see diary questions"); |
| 2032 | REMOVED_OR_REWRITTEN_TEST | ./tests/paid-first-gate-emergency.test.js:100:  sevenDayPaid: false, |
| 2033 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp84-food-response-context.test.js:18:    sevenDayPaid: false, |
| 2034 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp84-food-response-context.test.js:21:    diaryEntries: [], |
| 2035 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp84-food-response-context.test.js:199:  assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price must stay 29,000₮"); |
| 2036 | REMOVED_OR_REWRITTEN_TEST | ./tests/owner-weekend-social-scenario.test.js:16:    diaryDraft: {}, |
| 2037 | REMOVED_OR_REWRITTEN_TEST | ./tests/owner-weekend-social-scenario.test.js:17:    diaryEntries: [] |
| 2038 | REMOVED_OR_REWRITTEN_TEST | ./tests/owner-weekend-social-scenario.test.js:32:  sevenDayPaid: false, |
| 2039 | REMOVED_OR_REWRITTEN_TEST | ./tests/owner-weekend-social-scenario.test.js:43:  diaryEntries: [], |
| 2040 | REMOVED_OR_REWRITTEN_TEST | ./tests/owner-weekend-social-scenario.test.js:72:  "7 хоногоор нарийвчлах" |
| 2041 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:17:- Role: SEVEN_DAY_USER |
| 2042 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:19:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2043 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:27:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] |
| 2044 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:75:- Role: SEVEN_DAY_USER |
| 2045 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:77:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2046 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:85:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-add [ISOLATED_COMPONENT] |
| 2047 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:125:> 7 хоногоор нарийвчлах |
| 2048 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:135:- Render source: renderUpgradeOffer |
| 2049 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:143:- Render proof: renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] |
| 2050 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:160:> 7 хоногоор нарийвчлах |
| 2051 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:193:- Render source: renderUpgradeOffer |
| 2052 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:201:- Render proof: renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] |
| 2053 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:218:> 7 хоногоор нарийвчлах |
| 2054 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:252:- Render source: renderUpgradeOffer |
| 2055 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:260:- Render proof: renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] |
| 2056 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:311:- Render source: renderUpgradeOffer |
| 2057 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:319:- Render proof: renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] |
| 2058 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:324:> sevenDayAnchor: "69,000₮", |
| 2059 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:338:> Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. |
| 2060 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:360:> Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. |
| 2061 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:370:- Render source: renderUpgradeOffer |
| 2062 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:378:- Render proof: renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] |
| 2063 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:396:> Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. |
| 2064 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:429:- Render source: renderUpgradeOffer |
| 2065 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:435:- Source function/object: renderUpgradeOffer |
| 2066 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:437:- Render proof: renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] |
| 2067 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:442:> <p>Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.</p> |
| 2068 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:454:> Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой. |
| 2069 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:456:> 19,900₮ төлөөд 7 хоногоор нарийвчлах |
| 2070 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:478:> 19,900₮ төлөөд 7 хоногоор нарийвчлах |
| 2071 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:488:- Render source: renderUpgradeOffer |
| 2072 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:496:- Render proof: renderUpgradeOffer via upgrade-offer-present [ISOLATED_COMPONENT] |
| 2073 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_07.md:514:> 19,900₮ төлөөд 7 хоногоор нарийвчлах |
| 2074 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-tester-feedback.test.js:18:    sevenDayPaid: false, |
| 2075 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-tester-feedback.test.js:40:    diaryEntries: [], |
| 2076 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-tester-feedback.test.js:114:    packageType: "seven-day", |
| 2077 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-tester-feedback.test.js:116:    diaryEntries: [{ |
| 2078 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp86-humanized-case-formulation.test.js:18:    sevenDayPaid: false, |
| 2079 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp86-humanized-case-formulation.test.js:21:    diaryEntries: [], |
| 2080 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:17:    sevenDayPaid: false, |
| 2081 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:35:    diaryEntries: [], |
| 2082 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:55:function setSevenDay(overrides = {}) { |
| 2083 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:57:    packageType: "seven-day", |
| 2084 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:60:    sevenDayPaid: true, |
| 2085 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:69:    diaryEntries: [ |
| 2086 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:122:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged"); |
| 2087 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:123:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged"); |
| 2088 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:134:assert(appSource.includes("return Boolean(isInternalTestMode() \|\| state.sevenDayPaid \|\| state.upgradePaid \|\| access.hasSevenDayAccess);"), "seven-day access helper source must remain unchanged"); |
| 2089 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:164:setSevenDay({ |
| 2090 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:165:  diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] |
| 2091 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:175:setSevenDay({ |
| 2092 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-launch-monitoring.test.js:176:  diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] |
| 2093 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:99:> <h3>7 хоногийн гүн анализ</h3> |
| 2094 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:105:> 7 хоногийн гүн анализ |
| 2095 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:127:> 7 хоногийн гүн анализ |
| 2096 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:163:> 7 хоногийн гүн анализ |
| 2097 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:209:> sevenDay: "29,000₮", |
| 2098 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:213:> sevenDayAnchor: "69,000₮", |
| 2099 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:221:> 7 хоногийн гүн анализ |
| 2100 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:331:> sevenDay: "29,000₮", |
| 2101 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:335:> sevenDayAnchor: "69,000₮", |
| 2102 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_04.md:984:> <button class="button choice-button" onclick="choosePackage('seven-day')">${PRICING.sevenDay} төлөөд 7 хоногийн үнэлгээ эхлүүлэх</button> |
| 2103 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:16:- Surface: SEVEN_DAY_START |
| 2104 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:17:- Role: SEVEN_DAY_USER |
| 2105 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:18:- Scenario: seven-day-start |
| 2106 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:19:- Render source: renderSevenDayStart |
| 2107 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:27:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 2108 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:75:- Surface: SEVEN_DAY_START |
| 2109 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:76:- Role: SEVEN_DAY_USER |
| 2110 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:77:- Scenario: seven-day-start |
| 2111 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:78:- Render source: renderSevenDayStart |
| 2112 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:84:- Source function/object: renderSevenDayStart |
| 2113 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:86:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 2114 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:134:- Surface: SEVEN_DAY_START |
| 2115 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:135:- Role: SEVEN_DAY_USER |
| 2116 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:136:- Scenario: seven-day-start |
| 2117 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:137:- Render source: renderSevenDayStart |
| 2118 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:145:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 2119 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:193:- Surface: SEVEN_DAY_START |
| 2120 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:194:- Role: SEVEN_DAY_USER |
| 2121 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:195:- Scenario: seven-day-start |
| 2122 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:196:- Render source: renderSevenDayStart |
| 2123 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:204:- Render proof: renderSevenDayStart via seven-day-start [FULL_SURFACE] |
| 2124 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:252:- Role: SEVEN_DAY_USER |
| 2125 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:254:- Render source: renderDiaryHome |
| 2126 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:262:- Render proof: renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] |
| 2127 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:310:- Role: SEVEN_DAY_USER |
| 2128 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:312:- Render source: renderDiaryHome |
| 2129 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:320:- Render proof: renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] |
| 2130 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:369:- Role: SEVEN_DAY_USER |
| 2131 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:371:- Render source: renderDiaryHome |
| 2132 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:379:- Render proof: renderDiaryHome via diary-home-zero [FULL_SURFACE] |
| 2133 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:428:- Role: SEVEN_DAY_USER |
| 2134 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:430:- Render source: renderDiaryHome |
| 2135 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:438:- Render proof: renderDiaryHome via diary-home-zero [FULL_SURFACE] |
| 2136 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:487:- Role: SEVEN_DAY_USER |
| 2137 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:489:- Render source: renderDiaryHome |
| 2138 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:497:- Render proof: renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] |
| 2139 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:546:- Role: SEVEN_DAY_USER |
| 2140 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:548:- Render source: renderDiaryHome |
| 2141 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:556:- Render proof: renderDiaryHome via diary-home-zero [FULL_SURFACE] |
| 2142 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:605:- Role: SEVEN_DAY_USER |
| 2143 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:607:- Render source: renderDiaryHome |
| 2144 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:613:- Source function/object: renderDiaryHome |
| 2145 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:615:- Render proof: renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] |
| 2146 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:620:> <div class="mini-stat"><strong>${state.diaryEntries.length}/7</strong><span>Өдөр бөглөсөн</span></div> |
| 2147 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:664:- Role: SEVEN_DAY_USER |
| 2148 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:666:- Render source: renderDiaryHome |
| 2149 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:672:- Source function/object: renderDiaryHome |
| 2150 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:674:- Render proof: renderDiaryHome via diary-home-zero, diary-home-partial, diary-home-complete [FULL_SURFACE] |
| 2151 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:683:> <button class="button" onclick="startDiary()" ${state.diaryEntries.length >= 7 ? "disabled" : ""}>Дараагийн өдөр бөглөх</button> |
| 2152 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:687:> <button class="button secondary" onclick="setView('${readiness.canGenerateFullReport ? "reportReady" : "report"}')">${readiness.canGenerateFullReport ? "Тайлан харах" : "Одоогийн зураглал харах"}</button> |
| 2153 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:723:- Role: SEVEN_DAY_USER |
| 2154 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:725:- Render source: renderDiaryHome |
| 2155 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:731:- Source function/object: renderDiaryHome |
| 2156 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:733:- Render proof: renderDiaryHome via diary-home-zero, diary-home-partial [FULL_SURFACE] |
| 2157 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:738:> <button class="button" onclick="startDiary()" ${state.diaryEntries.length >= 7 ? "disabled" : ""}>Дараагийн өдөр бөглөх</button> |
| 2158 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:742:> <button class="button secondary" onclick="setView('${readiness.canGenerateFullReport ? "reportReady" : "report"}')">${readiness.canGenerateFullReport ? "Тайлан харах" : "Одоогийн зураглал харах"}</button> |
| 2159 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:781:- Role: SEVEN_DAY_USER |
| 2160 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:783:- Render source: renderDiaryHome |
| 2161 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:791:- Render proof: renderDiaryHome via diary-home-partial [FULL_SURFACE] |
| 2162 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:840:- Role: SEVEN_DAY_USER |
| 2163 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:842:- Render source: renderDiaryHome |
| 2164 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:850:- Render proof: renderDiaryHome via diary-home-partial [FULL_SURFACE] |
| 2165 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:899:- Role: SEVEN_DAY_USER |
| 2166 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:901:- Render source: renderDiaryHome |
| 2167 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:909:- Render proof: renderDiaryHome via diary-home-partial [FULL_SURFACE] |
| 2168 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:957:- Role: SEVEN_DAY_USER |
| 2169 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:959:- Render source: renderDiaryHome |
| 2170 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:967:- Render proof: renderDiaryHome via diary-home-complete [FULL_SURFACE] |
| 2171 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:972:> const count = state.diaryEntries.length; |
| 2172 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1016:- Role: SEVEN_DAY_USER |
| 2173 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1018:- Render source: renderDiaryHome |
| 2174 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1026:- Render proof: renderDiaryHome via diary-home-complete [FULL_SURFACE] |
| 2175 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1075:- Role: SEVEN_DAY_USER |
| 2176 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1077:- Render source: renderDiaryHome |
| 2177 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1085:- Render proof: renderDiaryHome via diary-home-complete [FULL_SURFACE] |
| 2178 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1134:- Role: SEVEN_DAY_USER |
| 2179 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1136:- Render source: renderDiaryHome |
| 2180 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1144:- Render proof: renderDiaryHome via diary-home-complete [FULL_SURFACE] |
| 2181 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1192:- Role: SEVEN_DAY_USER |
| 2182 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1194:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2183 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1202:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty, diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] |
| 2184 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1250:- Role: SEVEN_DAY_USER |
| 2185 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1252:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2186 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1258:- Source function/object: renderDailySummaryConfirmation |
| 2187 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1260:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty [ISOLATED_COMPONENT] |
| 2188 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1309:- Role: SEVEN_DAY_USER |
| 2189 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1311:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2190 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1319:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty, diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] |
| 2191 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1368:- Role: SEVEN_DAY_USER |
| 2192 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1370:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2193 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1378:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty, diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] |
| 2194 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1426:- Role: SEVEN_DAY_USER |
| 2195 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1428:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2196 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1436:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] |
| 2197 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1485:- Role: SEVEN_DAY_USER |
| 2198 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1487:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2199 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1495:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-awaiting [ISOLATED_COMPONENT] |
| 2200 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1544:- Role: SEVEN_DAY_USER |
| 2201 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1546:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2202 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1554:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] |
| 2203 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1603:- Role: SEVEN_DAY_USER |
| 2204 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1605:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2205 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1613:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT] |
| 2206 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1661:- Role: SEVEN_DAY_USER |
| 2207 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1663:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2208 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1671:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-confirmed [ISOLATED_COMPONENT] |
| 2209 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1719:- Role: SEVEN_DAY_USER |
| 2210 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1721:- Render source: renderDailySummaryConfirmation(D-SUM01) |
| 2211 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_06.md:1729:- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-edit [ISOLATED_COMPONENT] |
| 2212 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:20:    sevenDayPaid: false, |
| 2213 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:30:    diaryEntries: [], |
| 2214 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:35:function setSevenDay(overrides = {}) { |
| 2215 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:38:    packageType: "seven-day", |
| 2216 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:39:    view: "sevenDayStart", |
| 2217 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:41:    sevenDayPaid: false, |
| 2218 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:46:    diaryEntries: [], |
| 2219 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:77:  setSevenDay(); |
| 2220 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:78:  _internal.startLeadCapture("seven-day"); |
| 2221 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:80:  assert(capture.includes("7 хоногийн гүн анализ")); |
| 2222 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:86:  assert(capture.includes("7 хоногоор нарийвчлах эрх")); |
| 2223 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:100:  setSevenDay(); |
| 2224 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:101:  _internal.demoCompletePayment("seven-day"); |
| 2225 | REMOVED_OR_REWRITTEN_TEST | ./tests/fake-payment-lead-capture.test.js:102:  assert.strictEqual(_internal.hasSevenDayAccess(), true, "Demo unlock should still work for internal testing"); |
| 2226 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp87-report-reasoning-fix.test.js:18:    sevenDayPaid: false, |
| 2227 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp87-report-reasoning-fix.test.js:21:    diaryEntries: [], |
| 2228 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:17:    sevenDayPaid: false, |
| 2229 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:43:    diaryEntries: [], |
| 2230 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:63:function setSevenDay(overrides = {}) { |
| 2231 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:65:    packageType: "seven-day", |
| 2232 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:68:    sevenDayPaid: true, |
| 2233 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:77:    diaryEntries: [ |
| 2234 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:177:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged"); |
| 2235 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:178:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged"); |
| 2236 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:189:assert(appSource.includes("return Boolean(isInternalTestMode() \|\| state.sevenDayPaid \|\| state.upgradePaid \|\| access.hasSevenDayAccess);"), "seven-day access helper source must remain unchanged"); |
| 2237 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:226:  setSevenDay({ |
| 2238 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:227:    diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] |
| 2239 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:238:  setSevenDay({ |
| 2240 | REMOVED_OR_REWRITTEN_TEST | ./tests/final-public-launch-smoke.test.js:239:    diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] |
| 2241 | REMOVED_OR_REWRITTEN_TEST | ./tests/visible-surface-prototype.test.js:45:    sevenDayPaid: false, |
| 2242 | REMOVED_OR_REWRITTEN_TEST | ./tests/visible-surface-prototype.test.js:53:    diaryEntries: [], |
| 2243 | REMOVED_OR_REWRITTEN_TEST | ./tests/visible-surface-prototype.test.js:186:  setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }); |
| 2244 | REMOVED_OR_REWRITTEN_TEST | ./tests/visible-surface-prototype.test.js:189:    sevenDay: _internal.hasSevenDayAccess(), |
| 2245 | REMOVED_OR_REWRITTEN_TEST | ./tests/visible-surface-prototype.test.js:200:    sevenDay: _internal.hasSevenDayAccess(), |
| 2246 | REMOVED_OR_REWRITTEN_TEST | ./tests/visible-surface-prototype.test.js:236:    "sevenDayAnchor: \"69,000₮\"", |
| 2247 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-review-packs.test.js:66:  "renderDiaryHome", "renderDiaryInput", "renderDailySummaryConfirmation", "renderSampleResultPreview", |
| 2248 | REMOVED_OR_REWRITTEN_TEST | ./tests/mongolian-copy-review-packs.test.js:67:  "renderUpgradeOffer", "renderWeightQpayPaymentBox", "qpayStatusMessage" |
| 2249 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:16:- Surface: FULL_SEVEN_DAY_REPORT |
| 2250 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:17:- Role: SEVEN_DAY_USER |
| 2251 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:18:- Scenario: full-seven-day-report |
| 2252 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:27:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2253 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:75:- Surface: FULL_SEVEN_DAY_REPORT |
| 2254 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:76:- Role: SEVEN_DAY_USER |
| 2255 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:77:- Scenario: full-seven-day-report |
| 2256 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:86:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2257 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:134:- Surface: FULL_SEVEN_DAY_REPORT |
| 2258 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:135:- Role: SEVEN_DAY_USER |
| 2259 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:136:- Scenario: full-seven-day-report |
| 2260 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:145:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2261 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:193:- Surface: FULL_SEVEN_DAY_REPORT |
| 2262 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:194:- Role: SEVEN_DAY_USER |
| 2263 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:195:- Scenario: full-seven-day-report |
| 2264 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:204:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2265 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:252:- Surface: FULL_SEVEN_DAY_REPORT |
| 2266 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:253:- Role: SEVEN_DAY_USER |
| 2267 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:254:- Scenario: full-seven-day-report |
| 2268 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:263:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2269 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:311:- Surface: FULL_SEVEN_DAY_REPORT |
| 2270 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:312:- Role: SEVEN_DAY_USER |
| 2271 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:313:- Scenario: full-seven-day-report |
| 2272 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:322:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2273 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:370:- Surface: FULL_SEVEN_DAY_REPORT |
| 2274 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:371:- Role: SEVEN_DAY_USER |
| 2275 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:372:- Scenario: full-seven-day-report |
| 2276 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:381:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2277 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:429:- Surface: FULL_SEVEN_DAY_REPORT |
| 2278 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:430:- Role: SEVEN_DAY_USER |
| 2279 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:431:- Scenario: full-seven-day-report |
| 2280 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:440:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2281 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:488:- Surface: FULL_SEVEN_DAY_REPORT |
| 2282 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:489:- Role: SEVEN_DAY_USER |
| 2283 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:490:- Scenario: full-seven-day-report |
| 2284 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:499:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2285 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:547:- Surface: FULL_SEVEN_DAY_REPORT |
| 2286 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:548:- Role: SEVEN_DAY_USER |
| 2287 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:549:- Scenario: full-seven-day-report |
| 2288 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:558:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2289 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:606:- Surface: FULL_SEVEN_DAY_REPORT |
| 2290 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:607:- Role: SEVEN_DAY_USER |
| 2291 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:608:- Scenario: full-seven-day-report |
| 2292 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:617:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2293 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:665:- Surface: FULL_SEVEN_DAY_REPORT |
| 2294 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:666:- Role: SEVEN_DAY_USER |
| 2295 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:667:- Scenario: full-seven-day-report |
| 2296 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:676:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2297 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:724:- Surface: FULL_SEVEN_DAY_REPORT |
| 2298 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:725:- Role: SEVEN_DAY_USER |
| 2299 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:726:- Scenario: full-seven-day-report |
| 2300 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:735:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2301 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:783:- Surface: FULL_SEVEN_DAY_REPORT |
| 2302 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:784:- Role: SEVEN_DAY_USER |
| 2303 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:785:- Scenario: full-seven-day-report |
| 2304 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:794:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2305 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:842:- Surface: FULL_SEVEN_DAY_REPORT |
| 2306 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:843:- Role: SEVEN_DAY_USER |
| 2307 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:844:- Scenario: full-seven-day-report |
| 2308 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_06.md:853:- Render proof: renderReport via full-seven-day-report [FULL_SURFACE] |
| 2309 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_03.md:1637:> 7 хоногоор нарийвчлах боломж |
| 2310 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_03.md:1659:> 7 хоногоор нарийвчлах боломж |
| 2311 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_03.md:1686:> <li>7 хоногоор нарийвчлах боломж</li> |
| 2312 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_03.md:1695:> 7 хоногоор нарийвчлах боломж |
| 2313 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_03.md:1753:> 7 хоногоор нарийвчлах боломж |
| 2314 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-copy-polish.test.js:85:      diaryEntries: [] |
| 2315 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-copy-polish.test.js:91:  Array.from({ length: renderedDiaryQuestionCount }).forEach((_, diaryQuestionIndex) => { |
| 2316 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-copy-polish.test.js:94:      packageType: "seven-day", |
| 2317 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-copy-polish.test.js:97:      sevenDayPaid: true, |
| 2318 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-copy-polish.test.js:98:      diaryDay: 1, |
| 2319 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-copy-polish.test.js:99:      diaryQuestionIndex, |
| 2320 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-copy-polish.test.js:100:      diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа" }, |
| 2321 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-copy-polish.test.js:102:      diaryEntries: [] |
| 2322 | REMOVED_OR_REWRITTEN_TEST | ./tests/backend-qpay-plan.test.js:45:  "seven_day_access", |
| 2323 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:19:    sevenDayPaid: false, |
| 2324 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:29:    diaryEntries: [], |
| 2325 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:34:function setSevenDay(overrides = {}) { |
| 2326 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:36:    packageType: "seven-day", |
| 2327 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:37:    view: "sevenDayStart", |
| 2328 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:39:    sevenDayPaid: false, |
| 2329 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:45:    diaryEntries: [], |
| 2330 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:84:  const sevenAssessment = mockBackend.createAssessment("seven_day"); |
| 2331 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:85:  const sevenPayment = mockBackend.createMockPayment("seven_day", sevenAssessment.id); |
| 2332 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:88:  assert(mockBackend.hasEntitlement("seven_day_access", sevenAssessment.id), "paid seven_day should create seven_day_access entitlement"); |
| 2333 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:89:  assert.strictEqual(mockBackend.getAccessState(sevenAssessment.id).hasSevenDayAccess, true); |
| 2334 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:91:  setSevenDay({ currentAssessmentId: sevenAssessment.id }); |
| 2335 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:92:  assert.strictEqual(_internal.hasSevenDayAccess(), true); |
| 2336 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:93:  assert(normalize(_internal.renderSevenDayStart()).includes("7 хоногийн гүн зураглал таны өдөр тутмын давтамжийг харна"), "seven_day_access unlocks diary onboarding"); |
| 2337 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:94:  assert.strictEqual(mockBackend.canGenerateSevenDayReport([]), false, "seven_day access should not bypass 0-1/7 readiness"); |
| 2338 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:95:  assert(normalize(_internal.renderReport()).includes("Бүрэн тайлан гаргахад мэдээлэл хангалтгүй байна"), "paid seven_day still respects readiness gate"); |
| 2339 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:103:  assert(mockBackend.hasEntitlement("seven_day_access", upgradeAssessment.id), "upgrade should also create seven_day_access entitlement"); |
| 2340 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:113:    sevenDayPaid: false, |
| 2341 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:116:    diaryEntries: [] |
| 2342 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:124:    sevenDayPaid: false, |
| 2343 | REMOVED_OR_REWRITTEN_TEST | ./tests/mock-backend-entitlements.test.js:127:    diaryEntries: [] |
| 2344 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackSafetyInvariants.test.js:22:    packageType: "seven-day", |
| 2345 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackSafetyInvariants.test.js:26:    diaryEntries: [] |
| 2346 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackSafetyInvariants.test.js:41:    diaryEntries: [] |
| 2347 | REMOVED_OR_REWRITTEN_TEST | ./tests/visible-surface-owner-qa.test.js:56:    sevenDayPaid: false, |
| 2348 | REMOVED_OR_REWRITTEN_TEST | ./tests/visible-surface-owner-qa.test.js:64:    diaryEntries: [], |
| 2349 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp85-case-formulation-report.test.js:18:    sevenDayPaid: false, |
| 2350 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp85-case-formulation-report.test.js:21:    diaryEntries: [], |
| 2351 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp85-case-formulation-report.test.js:169:  assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price must stay 29,000₮"); |
| 2352 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable.test.js:11:    sevenDayPaid: false, |
| 2353 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable.test.js:19:    diaryEntries: [], |
| 2354 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-readiness.test.js:46:    sevenDayPaid: false, |
| 2355 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-readiness.test.js:54:    diaryEntries: [], |
| 2356 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-readiness.test.js:83:    sevenDay: _internal.hasSevenDayAccess(), |
| 2357 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-readiness.test.js:122:    sevenDay: _internal.hasSevenDayAccess(), |
| 2358 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-human-feedback-copy-ux.test.js:31:    diaryEntries: [] |
| 2359 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-human-feedback-copy-ux.test.js:109:    packageType: "seven-day", |
| 2360 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-human-feedback-copy-ux.test.js:112:    sevenDayPaid: true, |
| 2361 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-human-feedback-copy-ux.test.js:113:    diaryQuestionIndex: 1, |
| 2362 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-human-feedback-copy-ux.test.js:114:    diaryDraft: { meal_rhythm: "Тогтуун, хоол алгасаагүй" }, |
| 2363 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-human-feedback-copy-ux.test.js:115:    diaryEntries: [] |
| 2364 | REMOVED_OR_REWRITTEN_TEST | ./tests/internal-human-feedback-copy-ux.test.js:120:  assert.strictEqual(_internal.getTestState().diaryDraft.meal_rhythm, "Тогтуун, хоол алгасаагүй", "diary Back should preserve prior answer"); |
| 2365 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:69:    packageType: scenario.packageType \|\| "seven-day", |
| 2366 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:74:    diaryEntries: scenario.diaryEntries \|\| [] |
| 2367 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:169:    packageType: "seven-day", |
| 2368 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:175:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2369 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:209:    packageType: "seven-day", |
| 2370 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:215:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2371 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:232:    packageType: "seven-day", |
| 2372 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:238:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2373 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:255:    packageType: "seven-day", |
| 2374 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:261:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2375 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:279:    packageType: "seven-day", |
| 2376 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:284:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2377 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:301:    packageType: "seven-day", |
| 2378 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:307:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2379 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:326:    packageType: "seven-day", |
| 2380 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:332:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2381 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:350:    packageType: "seven-day", |
| 2382 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:355:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2383 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:372:    packageType: "seven-day", |
| 2384 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:377:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2385 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:395:    packageType: "seven-day", |
| 2386 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:401:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2387 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:420:    packageType: "seven-day", |
| 2388 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:426:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2389 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:442:    packageType: "seven-day", |
| 2390 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:447:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2391 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:454:    reportExcludes: ["14-day personalized experiment", "14-Day Experiment", "14 хоногийн туршилт", "7 хоногоор нарийвчлах"], |
| 2392 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:475:    packageType: "seven-day", |
| 2393 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:480:    diaryEntries: repeatEntries(5, day => diary(day, { |
| 2394 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:537:  if (scenario.oneTimeCta) assert(text.includes("7 хоногоор нарийвчлах") \|\| text.includes("7 хоногийн гүн үнэлгээ"), `${scenario.name}: expected one-time CTA`); |
| 2395 | REMOVED_OR_REWRITTEN_TEST | ./tests/virtual-user-qa.test.js:538:  if (scenario.packageType === "one-time" && scenario.expectedMode === "deep") assert(!text.includes("7 хоногоор нарийвчлах"), `${scenario.name}: WP62 one-time report should not mix in 7-day CTA`); |
| 2396 | REMOVED_OR_REWRITTEN_TEST | ./tests/menstrual-cycle-context.test.js:14:    sevenDayPaid: true, |
| 2397 | REMOVED_OR_REWRITTEN_TEST | ./tests/menstrual-cycle-context.test.js:18:    diaryEntries: [], |
| 2398 | REMOVED_OR_REWRITTEN_TEST | ./tests/menstrual-cycle-context.test.js:19:    diaryDraft: {}, |
| 2399 | REMOVED_OR_REWRITTEN_TEST | ./tests/menstrual-cycle-context.test.js:50:    packageType: "seven-day", |
| 2400 | REMOVED_OR_REWRITTEN_TEST | ./tests/menstrual-cycle-context.test.js:52:    diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа" }, |
| 2401 | REMOVED_OR_REWRITTEN_TEST | ./tests/menstrual-cycle-context.test.js:59:    packageType: "seven-day", |
| 2402 | REMOVED_OR_REWRITTEN_TEST | ./tests/menstrual-cycle-context.test.js:62:    diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа" }, |
| 2403 | REMOVED_OR_REWRITTEN_TEST | ./tests/menstrual-cycle-context.test.js:71:    packageType: "seven-day", |
| 2404 | REMOVED_OR_REWRITTEN_TEST | ./tests/menstrual-cycle-context.test.js:74:    diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа", cycle_today_link: "Тийм, амттай юм илүү хүссэн" }, |
| 2405 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp79-conditional-branching.test.js:42:    sevenDayPaid: false, |
| 2406 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp79-conditional-branching.test.js:45:    diaryEntries: [], |
| 2407 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-visible-surface-integration.test.js:45:    sevenDayPaid: false, |
| 2408 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-visible-surface-integration.test.js:53:    diaryEntries: [], |
| 2409 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:17:- Role: SEVEN_DAY_USER |
| 2410 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:19:- Render source: renderDiary using diaryQuestionIndex |
| 2411 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:27:- Render proof: renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE] |
| 2412 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:76:- Role: SEVEN_DAY_USER |
| 2413 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:78:- Render source: renderDiary using diaryQuestionIndex |
| 2414 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:86:- Render proof: renderDiary using diaryQuestionIndex via diary-single, diary-multi, diary-scale, diary-text [FULL_SURFACE] |
| 2415 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:135:- Role: SEVEN_DAY_USER |
| 2416 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:137:- Render source: renderDiary using diaryQuestionIndex |
| 2417 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:145:- Render proof: renderDiary using diaryQuestionIndex via diary-single, diary-multi, diary-scale, diary-text [FULL_SURFACE] |
| 2418 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:193:- Role: SEVEN_DAY_USER |
| 2419 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:195:- Render source: renderDiary using diaryQuestionIndex |
| 2420 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:203:- Render proof: renderDiary using diaryQuestionIndex via diary-multi, diary-scale, diary-text [FULL_SURFACE] |
| 2421 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:252:- Role: SEVEN_DAY_USER |
| 2422 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:254:- Render source: renderDiary using diaryQuestionIndex |
| 2423 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:262:- Render proof: renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE] |
| 2424 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:311:- Role: SEVEN_DAY_USER |
| 2425 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:313:- Render source: renderDiary using diaryQuestionIndex |
| 2426 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:321:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2427 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:370:- Role: SEVEN_DAY_USER |
| 2428 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:372:- Render source: renderDiary using diaryQuestionIndex |
| 2429 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:380:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2430 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:429:- Role: SEVEN_DAY_USER |
| 2431 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:431:- Render source: renderDiary using diaryQuestionIndex |
| 2432 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:439:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2433 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:488:- Role: SEVEN_DAY_USER |
| 2434 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:490:- Render source: renderDiary using diaryQuestionIndex |
| 2435 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:498:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2436 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:547:- Role: SEVEN_DAY_USER |
| 2437 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:549:- Render source: renderDiary using diaryQuestionIndex |
| 2438 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:557:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2439 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:606:- Role: SEVEN_DAY_USER |
| 2440 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:608:- Render source: renderDiary using diaryQuestionIndex |
| 2441 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:616:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2442 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:665:- Role: SEVEN_DAY_USER |
| 2443 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:667:- Render source: renderDiary using diaryQuestionIndex |
| 2444 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:675:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2445 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:724:- Role: SEVEN_DAY_USER |
| 2446 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:726:- Render source: renderDiary using diaryQuestionIndex |
| 2447 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:734:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2448 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:783:- Role: SEVEN_DAY_USER |
| 2449 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:785:- Render source: renderDiary using diaryQuestionIndex |
| 2450 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:793:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2451 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:842:- Role: SEVEN_DAY_USER |
| 2452 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:844:- Render source: renderDiary using diaryQuestionIndex |
| 2453 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:852:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2454 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:901:- Role: SEVEN_DAY_USER |
| 2455 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:903:- Render source: renderDiary using diaryQuestionIndex |
| 2456 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:911:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2457 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:960:- Role: SEVEN_DAY_USER |
| 2458 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:962:- Render source: renderDiary using diaryQuestionIndex |
| 2459 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:970:- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE] |
| 2460 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1018:- Role: SEVEN_DAY_USER |
| 2461 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1020:- Render source: renderDiary using diaryQuestionIndex |
| 2462 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1028:- Render proof: renderDiary using diaryQuestionIndex via diary-text [FULL_SURFACE] |
| 2463 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1077:- Role: SEVEN_DAY_USER |
| 2464 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1079:- Render source: renderDiary using diaryQuestionIndex |
| 2465 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1085:- Source function/object: renderDiaryInput |
| 2466 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1087:- Render proof: renderDiary using diaryQuestionIndex via diary-text [FULL_SURFACE] |
| 2467 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1096:> return `<label class="field"><span class="muted">1-2 өгүүлбэр хангалттай</span><textarea id="input-${question.id}" oninput="setDiaryDraftValue('${question.id}', this.value)">${escapeHtml(value)}</textarea></label><p class="muted">Хэрвээ санахгүй эсвэл бичмээргүй байвал хоосон орхиод үргэлжлүүлж болно.</p>`; |
| 2468 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1136:- Role: SEVEN_DAY_USER |
| 2469 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1138:- Render source: renderDiary using diaryQuestionIndex |
| 2470 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/99_NO_REVIEW_SIGNAL.md:1146:- Render proof: renderDiary using diaryQuestionIndex via diary-text [FULL_SURFACE] |
| 2471 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:18:    sevenDayPaid: false, |
| 2472 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:38:    diaryEntries: [], |
| 2473 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:43:function setSevenDay(overrides = {}) { |
| 2474 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:45:    packageType: "seven-day", |
| 2475 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:48:    sevenDayPaid: false, |
| 2476 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:55:    diaryEntries: [], |
| 2477 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:65:    sevenDayPaid: false, |
| 2478 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:68:    diaryEntries: [] |
| 2479 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:77:    sevenDayPaid: false, |
| 2480 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:80:    diaryEntries: [] |
| 2481 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:125:  assert(!paidOneTime.includes("19,900₮ төлөөд 7 хоногоор нарийвчлах")); |
| 2482 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:126:  assert(!paidOneTime.includes("Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой")); |
| 2483 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:128:  setSevenDay(); |
| 2484 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:129:  const unpaidSevenDay = normalize(_internal.renderSevenDayStart()); |
| 2485 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:130:  assert(unpaidSevenDay.includes("Үндсэн үнэ 69,000₮")); |
| 2486 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:131:  assert(unpaidSevenDay.includes("Нээлтийн урамшуулалт үнэ 29,000₮")); |
| 2487 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:132:  assert(unpaidSevenDay.includes("29,000₮ төлөөд эхлүүлэх")); |
| 2488 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:133:  assert(unpaidSevenDay.includes("өдөр тутмын бодит давтамж")); |
| 2489 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:134:  assert(unpaidSevenDay.includes("Анхны сэтгэгдэл ба өдөр тутмын ажиглалт")); |
| 2490 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:136:  assertNoCommercialSmell(unpaidSevenDay, "seven-day unpaid"); |
| 2491 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:138:  _internal.demoCompletePayment("seven-day"); |
| 2492 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:139:  const unlockedSevenDay = normalize(_internal.renderUnlock()); |
| 2493 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:140:  assert(unlockedSevenDay.includes("1 дэх өдрөө эхлүүлэх")); |
| 2494 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:141:  assert(unlockedSevenDay.includes("Орой бүр 3–5 минут")); |
| 2495 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:146:  assert.strictEqual(upgradedState.sevenDayPaid, true); |
| 2496 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:165:  setSevenDay({ sevenDayPaid: true, diaryEntries: [] }); |
| 2497 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:177:    unpaidSevenDay, |
| 2498 | REMOVED_OR_REWRITTEN_TEST | ./tests/commercial-flow-qa.test.js:178:    unlockedSevenDay, |
| 2499 | REMOVED_OR_REWRITTEN_TEST | ./tests/coach-subadmin.test.js:191:    diaryEntries: [] |
| 2500 | REMOVED_OR_REWRITTEN_TEST | ./tests/coach-subadmin.test.js:208:    sevenDayPaid: false, |
| 2501 | REMOVED_OR_REWRITTEN_TEST | ./tests/coach-subadmin.test.js:221:    diaryEntries: [] |
| 2502 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp83-anthropometric-activity-work-context.test.js:18:    sevenDayPaid: false, |
| 2503 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp83-anthropometric-activity-work-context.test.js:21:    diaryEntries: [], |
| 2504 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp83-anthropometric-activity-work-context.test.js:196:  assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price must stay 29,000₮"); |
| 2505 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:51:    sevenDayPaid: false, |
| 2506 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:59:    diaryEntries: [], |
| 2507 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:64:function setSevenDay(overrides = {}) { |
| 2508 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:66:    packageType: "seven-day", |
| 2509 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:69:    sevenDayPaid: true, |
| 2510 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:78:    diaryEntries: entries(5), |
| 2511 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:117:    ["seven-day full", () => setSevenDay()], |
| 2512 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:118:    ["seven-day readiness hold", () => setSevenDay({ diaryEntries: entries(3) })], |
| 2513 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:119:    ["professional", () => setSevenDay({ stageAnswers: { "S1-S03": "Одоо давтагддаг" } })], |
| 2514 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:120:    ["urgent", () => setSevenDay({ stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" } })] |
| 2515 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:123:  setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }); |
| 2516 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:125:  assert.strictEqual(_internal.hasSevenDayAccess(), false); |
| 2517 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:129:  assert.strictEqual(_internal.hasSevenDayAccess(), false); |
| 2518 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-adapter-shadow-integration.test.js:135:    "sevenDayAnchor: \"69,000₮\"", |
| 2519 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp81-report-depth-expansion.test.js:18:    sevenDayPaid: false, |
| 2520 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp81-report-depth-expansion.test.js:21:    diaryEntries: [], |
| 2521 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackReportObject.mjs:108:    sevenDayDiaryConfirmation: stack.seven_day_diary_confirmation_targets, |
| 2522 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackReportObject.mjs:195:    `- ${reportObject.sevenDayDiaryConfirmation.map(target => target.driver_key).join(", ")}`, |
| 2523 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackReportObject.mjs:212:    `- Seven day confirmation: ${reportObject.sevenDayDiaryConfirmation.map(target => target.driver_key).join(", ")}`, |
| 2524 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:41:    packageType: "seven-day", |
| 2525 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:45:    diaryEntries: [], |
| 2526 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:64:    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1)) |
| 2527 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:71:    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1, { |
| 2528 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:89:    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1, { |
| 2529 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:98:    diaryEntries: [diaryEntry(1, { body_signals: ["Сахар унасан мэт"] })] |
| 2530 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:104:    diaryEntries: Array.from({ length: 2 }, (_, i) => diaryEntry(i + 1, { |
| 2531 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:112:    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1, { |
| 2532 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:124:    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1)) |
| 2533 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:128:  evidence = calculateMechanismEvidence(baseState({ diaryEntries: [diaryEntry(1)] })); |
| 2534 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:133:    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1)) |
| 2535 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:139:    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1)) |
| 2536 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:146:    packageType: "seven-day", |
| 2537 | REMOVED_OR_REWRITTEN_TEST | ./tests/evidence-scoring-calibration.test.js:149:    diaryEntries: Array.from({ length: 5 }, (_, i) => diaryEntry(i + 1)) |
| 2538 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:36:    sevenDayPaid: false, |
| 2539 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:44:    diaryEntries: [], |
| 2540 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:64:function setSevenDay(overrides = {}) { |
| 2541 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:66:    packageType: "seven-day", |
| 2542 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:69:    sevenDayPaid: true, |
| 2543 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:72:    diaryEntries: [ |
| 2544 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:161:setSevenDay({ |
| 2545 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:162:  diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] |
| 2546 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:170:setSevenDay({ |
| 2547 | REMOVED_OR_REWRITTEN_TEST | ./tests/public-visible-surface-enable-live.test.js:171:  diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] |
| 2548 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_01.md:1107:> 7 хоногийн гүн анализ руу шилжих боломж |
| 2549 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_01.md:1129:> 7 хоногийн гүн анализ руу шилжих боломж |
| 2550 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_01.md:1156:> <li>7 хоногийн гүн анализ руу шилжих боломж</li> |
| 2551 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_01.md:1165:> 7 хоногийн гүн анализ руу шилжих боломж |
| 2552 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/03_P0_PAYMENT_CRITICAL_BATCH_01.md:1223:> 7 хоногийн гүн анализ руу шилжих боломж |
| 2553 | REMOVED_OR_REWRITTEN_TEST | ./tests/sprint32-export-separation.test.js:175:assert(!userText.includes("### 7 хоногоор нарийвчлах"), "user-facing export should not use CTA copy as the 7-day heading"); |
| 2554 | REMOVED_OR_REWRITTEN_TEST | ./tests/sprint32-export-separation.test.js:176:assert(!userText.split(/\n/).some((line) => line.trim() === "7 хоногоор нарийвчлах"), "user-facing export should not include standalone 7-day CTA text"); |
| 2555 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:19:    sevenDayPaid: false, |
| 2556 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:45:    diaryEntries: [], |
| 2557 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:65:function setSevenDay(overrides = {}) { |
| 2558 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:67:    packageType: "seven-day", |
| 2559 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:70:    sevenDayPaid: true, |
| 2560 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:79:    diaryEntries: [ |
| 2561 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:186:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged"); |
| 2562 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:187:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged"); |
| 2563 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:198:assert(appSource.includes("return Boolean(isInternalTestMode() \|\| state.sevenDayPaid \|\| state.upgradePaid \|\| access.hasSevenDayAccess);"), "seven-day access helper source must remain unchanged"); |
| 2564 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:202:assert(mockBackendSource.includes("const PRODUCT_AMOUNTS = {\n  one_time: 9900,\n  seven_day: 29000,\n  upgrade: 19900\n};"), "mock backend product amounts must remain unchanged"); |
| 2565 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:205:assert(mockBackendSource.includes('entitlement_type: "seven_day_access"'), "mock backend seven-day entitlement type must remain unchanged"); |
| 2566 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:214:  sevenDayPaid: false, |
| 2567 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:220:assert.strictEqual(_internal.hasSevenDayAccess(), false, "seven-day access should be false without local flag, upgrade flag, or entitlement"); |
| 2568 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:223:_internal.setTestState({ oneTimePaid: true, sevenDayPaid: true, upgradePaid: true }); |
| 2569 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:225:assert.strictEqual(_internal.hasSevenDayAccess(), true, "seven-day local paid flag should grant seven-day access"); |
| 2570 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:231:  sevenDayPaid: false, |
| 2571 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:245:  sevenDayPaid: false, |
| 2572 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:291:  setSevenDay({ |
| 2573 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:292:    diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] |
| 2574 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:305:  setSevenDay({ |
| 2575 | REMOVED_OR_REWRITTEN_TEST | ./tests/payment-qpay-production-hardening-audit.test.js:306:    diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] |
| 2576 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-compression-ai-smell.test.js:59:    diaryEntries: [] |
| 2577 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-compression-ai-smell.test.js:75:    diaryEntries: [] |
| 2578 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-compression-ai-smell.test.js:81:    packageType: "seven-day", |
| 2579 | REMOVED_OR_REWRITTEN_TEST | ./tests/report-compression-ai-smell.test.js:84:    diaryEntries: Array.from({ length: 5 }, (_, index) => ({ |
| 2580 | REMOVED_OR_REWRITTEN_TEST | ./tests/scenario-focus-matching.test.js:34:    diaryEntries: [] |
| 2581 | REMOVED_OR_REWRITTEN_TEST | ./tests/voice-summary-confirmation.test.js:5:  generateDailySummaryBullets, |
| 2582 | REMOVED_OR_REWRITTEN_TEST | ./tests/voice-summary-confirmation.test.js:43:  const bullets = generateDailySummaryBullets(dailyDraft); |
| 2583 | REMOVED_OR_REWRITTEN_TEST | ./tests/voice-summary-confirmation.test.js:111:    packageType: "seven-day", |
| 2584 | REMOVED_OR_REWRITTEN_TEST | ./tests/voice-summary-confirmation.test.js:113:    diaryEntries: [entry(1, urgent)] |
| 2585 | REMOVED_OR_REWRITTEN_TEST | ./tests/voice-summary-confirmation.test.js:119:    packageType: "seven-day", |
| 2586 | REMOVED_OR_REWRITTEN_TEST | ./tests/voice-summary-confirmation.test.js:121:    diaryEntries: [unconfirmedRaw, entry(2), entry(3), entry(4), entry(5)] |
| 2587 | REMOVED_OR_REWRITTEN_TEST | ./tests/voice-summary-confirmation.test.js:138:    packageType: "seven-day", |
| 2588 | REMOVED_OR_REWRITTEN_TEST | ./tests/voice-summary-confirmation.test.js:140:    diaryEntries: confirmedEntries |
| 2589 | REMOVED_OR_REWRITTEN_TEST | ./tests/coming-soon-mode.test.js:25:  sevenDayPaid: false, |
| 2590 | REMOVED_OR_REWRITTEN_TEST | ./tests/coach-language-polish.test.js:45:    diaryEntries: [] |
| 2591 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:64:    diaryEntries: [] |
| 2592 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:98:    diaryEntries: [] |
| 2593 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:113:    diaryEntries: [] |
| 2594 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:124:    packageType: "seven-day", |
| 2595 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:127:    sevenDayPaid: true, |
| 2596 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:128:    diaryDay: 1, |
| 2597 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:129:    diaryQuestionIndex: 3, |
| 2598 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:130:    diaryDraft: { unplanned_eating_count: "Тийм, нэг удаа" }, |
| 2599 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:132:    diaryEntries: [] |
| 2600 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:136:  assert.strictEqual(_internal.getTestState().diaryQuestionIndex, 3, "scale answer should not auto-advance"); |
| 2601 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:139:  assert.strictEqual(_internal.getTestState().diaryQuestionIndex, 4, "diary Continue should advance"); |
| 2602 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:144:  assert.strictEqual(_internal.getTestState().diaryDraft.hunger_level, "7", "diary Back should preserve scale answer"); |
| 2603 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:158:    diaryEntries: [] |
| 2604 | REMOVED_OR_REWRITTEN_TEST | ./tests/question-navigation.test.js:175:    diaryEntries: [] |
| 2605 | REMOVED_OR_REWRITTEN_TEST | ./tests/safety-readiness.test.js:25:function setSevenDayState(nextState) { |
| 2606 | REMOVED_OR_REWRITTEN_TEST | ./tests/safety-readiness.test.js:27:    packageType: "seven-day", |
| 2607 | REMOVED_OR_REWRITTEN_TEST | ./tests/safety-readiness.test.js:50:  setSevenDayState({ diaryEntries: entries(1) }); |
| 2608 | REMOVED_OR_REWRITTEN_TEST | ./tests/safety-readiness.test.js:55:  setSevenDayState({ diaryEntries: entries(3) }); |
| 2609 | REMOVED_OR_REWRITTEN_TEST | ./tests/safety-readiness.test.js:59:  setSevenDayState({ diaryEntries: entries(4) }); |
| 2610 | REMOVED_OR_REWRITTEN_TEST | ./tests/safety-readiness.test.js:63:  setSevenDayState({ diaryEntries: entries(5) }); |
| 2611 | REMOVED_OR_REWRITTEN_TEST | ./tests/safety-readiness.test.js:66:  setSevenDayState({ diaryEntries: [entry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] }); |
| 2612 | REMOVED_OR_REWRITTEN_TEST | ./tests/safety-readiness.test.js:73:  setSevenDayState({ diaryEntries: [entry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] }); |
| 2613 | REMOVED_OR_REWRITTEN_TEST | ./tests/surface-hidden-function-reframe.test.js:15:    sevenDayPaid: true, |
| 2614 | REMOVED_OR_REWRITTEN_TEST | ./tests/surface-hidden-function-reframe.test.js:21:    diaryEntries: [], |
| 2615 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-visible-surface-payload-connection.test.js:43:    sevenDayPaid: false, |
| 2616 | REMOVED_OR_REWRITTEN_TEST | ./tests/runtime-visible-surface-payload-connection.test.js:51:    diaryEntries: [], |
| 2617 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:37:      packageType: "seven-day", |
| 2618 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:42:      diaryEntries: repeat(5, day => entry(day, { |
| 2619 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:69:      packageType: "seven-day", |
| 2620 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:74:      diaryEntries: repeat(5, day => entry(day, { |
| 2621 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:101:      packageType: "seven-day", |
| 2622 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:107:      diaryEntries: repeat(5, day => entry(day, { |
| 2623 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:131:      packageType: "seven-day", |
| 2624 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:137:      diaryEntries: repeat(5, day => entry(day, { |
| 2625 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:163:      packageType: "seven-day", |
| 2626 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:168:      diaryEntries: repeat(5, day => entry(day, { |
| 2627 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:193:      packageType: "seven-day", |
| 2628 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:199:      diaryEntries: repeat(5, day => entry(day, { |
| 2629 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:224:      packageType: "seven-day", |
| 2630 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:229:      diaryEntries: repeat(5, day => entry(day, { |
| 2631 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:268:      diaryEntries: [] |
| 2632 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:298:      diaryEntries: [] |
| 2633 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:315:      packageType: "seven-day", |
| 2634 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:320:      diaryEntries: repeat(2, day => entry(day, { |
| 2635 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:349:      packageType: "seven-day", |
| 2636 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:355:      diaryEntries: repeat(5, day => entry(day, { |
| 2637 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:371:      packageType: "seven-day", |
| 2638 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackFixtures.mjs:376:      diaryEntries: repeat(5, day => entry(day, { |
| 2639 | REMOVED_OR_REWRITTEN_TEST | ./tests/no-account-contact-delivery.test.js:21:    sevenDayPaid: false, |
| 2640 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackReportObject.test.js:36:    "sevenDayDiaryConfirmation", |
| 2641 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackReportObject.test.js:77:    assert(Array.isArray(report.sevenDayDiaryConfirmation)); |
| 2642 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackReportObject.test.js:193:      "sevenDayDiaryConfirmation", |
| 2643 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackReportObject.test.js:207:      "sevenDayConfirmationTargets", |
| 2644 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackContract.test.js:17:    buildSevenDayConfirmationTargets |
| 2645 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackContract.test.js:30:    buildSevenDayConfirmationTargets |
| 2646 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackContract.test.js:60:  assert(Array.isArray(stack.seven_day_diary_confirmation_targets)); |
| 2647 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackContract.test.js:61:  assert(stack.seven_day_diary_confirmation_targets.length >= 2); |
| 2648 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:49:    sevenDayPaid: false, |
| 2649 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:62:    diaryEntries: [], |
| 2650 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:67:function setSevenDay(overrides = {}) { |
| 2651 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:69:    packageType: "seven-day", |
| 2652 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:72:    sevenDayPaid: true, |
| 2653 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:80:    diaryEntries: [ |
| 2654 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:185:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day pricing label must remain unchanged"); |
| 2655 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:186:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor pricing label must remain unchanged"); |
| 2656 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:214:    () => setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }), |
| 2657 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:220:    () => setOneTime({ oneTimePaid: true, sevenDayPaid: false, upgradePaid: false }), |
| 2658 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:228:      sevenDayPaid: false, |
| 2659 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:241:    () => setSevenDay({ |
| 2660 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:242:      diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] |
| 2661 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:250:    () => setSevenDay({ |
| 2662 | REMOVED_OR_REWRITTEN_TEST | ./tests/mobile-visible-surface-qa.test.js:251:      diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] |
| 2663 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:33:    sevenDayPaid: false, |
| 2664 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:37:    diaryEntries: [], |
| 2665 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:56:  assert(source.includes('sevenDay: "29,000₮"'), "seven-day price must remain 29,000₮"); |
| 2666 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:68:["Үнэлгээний сонголт", "Нэг удаагийн гүн анализ", "7 хоногийн гүн анализ", "9,900₮", "29,000₮"].forEach(copy => { |
| 2667 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:82:  sevenDayPaid: false, |
| 2668 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:89:assert(productionChoice.includes("7 хоногийн гүн анализ"), "production seven-day card must still render"); |
| 2669 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:99:assert.strictEqual(qa.hasSevenDayAccess(), false, "QA payment bypass must not unlock seven-day flow"); |
| 2670 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:101:assert.strictEqual(qa.shouldQaSkipOneTimePaywall("seven-day"), false, "QA skip-paywall must not apply to seven-day flow"); |
| 2671 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:109:  sevenDayPaid: false, |
| 2672 | REMOVED_OR_REWRITTEN_TEST | ./tests/wp82-qa-skip-paywall.test.js:115:assert(!qaChoice.includes("29,000₮ төлөөд 7 хоногийн үнэлгээ эхлүүлэх"), "QA skip mode must not show seven-day payment card CTA"); |
| 2673 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:48:    sevenDayPaid: false, |
| 2674 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:61:    diaryEntries: [], |
| 2675 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:81:function setSevenDay(overrides = {}) { |
| 2676 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:83:    packageType: "seven-day", |
| 2677 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:86:    sevenDayPaid: true, |
| 2678 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:94:    diaryEntries: [ |
| 2679 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:160:  assert.strictEqual(_internal.hasSevenDayAccess(), expected.sevenDay, `${label}: seven-day access mismatch`); |
| 2680 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:220:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day pricing label must remain unchanged"); |
| 2681 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:221:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor pricing label must remain unchanged"); |
| 2682 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:228:assert.strictEqual(typeof _internal.hasSevenDayAccess, "function", "seven-day entitlement helper must exist"); |
| 2683 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:236:    () => setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }), |
| 2684 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:238:    { oneTime: false, sevenDay: false, upgrade: false } |
| 2685 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:243:    () => setOneTime({ oneTimePaid: true, sevenDayPaid: false, upgradePaid: false }), |
| 2686 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:245:    { oneTime: true, sevenDay: false, upgrade: false } |
| 2687 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:252:      sevenDayPaid: false, |
| 2688 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:261:    { oneTime: false, sevenDay: false, upgrade: false } |
| 2689 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:266:    () => setSevenDay({ |
| 2690 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:267:      diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] |
| 2691 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:270:    { oneTime: false, sevenDay: true, upgrade: false } |
| 2692 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:278:    () => setSevenDay({ |
| 2693 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:279:      diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] |
| 2694 | REMOVED_OR_REWRITTEN_TEST | ./tests/production-visible-surface-smoke.test.js:282:    { oneTime: false, sevenDay: true, upgrade: false } |
| 2695 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:87:    packageType: "seven-day", |
| 2696 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:91:    diaryEntries: [], |
| 2697 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:163:  const diaryDays = new Set(score.evidence_items.map(item => item.day_number).filter(Boolean)).size; |
| 2698 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:164:  if (score.normalizedScore >= 7 \|\| diaryDays >= 3) return "strong"; |
| 2699 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:165:  if (score.normalizedScore >= 4 \|\| diaryDays >= 2) return "moderate"; |
| 2700 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:406:  (state.diaryEntries \|\| []).forEach(entry => { |
| 2701 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:605:  return match("general_driver_stack", fallback, "Several drivers overlap; diary evidence should clarify which one is easiest to change first.", "seven_day_confirmation"); |
| 2702 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:721:  const [id, targets, action] = map[interactionPattern.id] \|\| ["seven_day_confirmation", [], "Use 7-day diary confirmation before choosing the first change."]; |
| 2703 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:773:export function buildSevenDayConfirmationTargets(driverScores, vulnerableMoment) { |
| 2704 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:872:  const confirmationTargets = buildSevenDayConfirmationTargets(scores, vulnerableMoment); |
| 2705 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:878:      diary_entry_count: (state.diaryEntries \|\| []).length, |
| 2706 | REMOVED_OR_REWRITTEN_TEST | ./tests/driver-stack/driverStackTestCalculator.mjs:910:    seven_day_diary_confirmation_targets: confirmationTargets, |
| 2707 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_02.md:1218:> <div class="card"><h3>7 хоногийн гүн зураглал</h3><p>Эхний богино асуулт + орой бүр 3–5 минутын тэмдэглэл. 5 өдөр бөглөсөн ч тайлан гарна, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана.</p></div> |
| 2708 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_02.md:1224:> 7 хоногийн гүн зураглал |
| 2709 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_02.md:1246:> 7 хоногийн гүн зураглал |
| 2710 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_02.md:1282:> 7 хоногийн гүн зураглал |
| 2711 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_02.md:1332:> <div class="card"><h3>7 хоногийн гүн зураглал</h3><p>Эхний богино асуулт + орой бүр 3–5 минутын тэмдэглэл. 5 өдөр бөглөсөн ч тайлан гарна, калори тоолохгүй, зөвхөн давтагддаг мөчүүдийг ажиглана.</p></div> |
| 2712 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/08_P2_ORDINARY_UI_BATCH_02.md:1340:> 7 хоногийн гүн зураглал |
| 2713 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:19:    sevenDayPaid: false, |
| 2714 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:44:    diaryEntries: [], |
| 2715 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:64:function setSevenDay(overrides = {}) { |
| 2716 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:66:    packageType: "seven-day", |
| 2717 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:69:    sevenDayPaid: true, |
| 2718 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:77:    diaryEntries: [ |
| 2719 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:175:assert(appSource.includes('sevenDay: "29,000₮"'), "seven-day price label must remain unchanged"); |
| 2720 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:176:assert(appSource.includes('sevenDayAnchor: "69,000₮"'), "seven-day anchor price label must remain unchanged"); |
| 2721 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:184:assert(appSource.includes("return Boolean(isInternalTestMode() \|\| state.sevenDayPaid \|\| state.upgradePaid \|\| access.hasSevenDayAccess);"), "seven-day entitlement helper must remain unchanged"); |
| 2722 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:230:  setSevenDay({ |
| 2723 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:231:    diaryEntries: [diaryEntry({ pattern_probes: { measured_today: "Тийм, санаа зовоосон" } })] |
| 2724 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:242:  setSevenDay({ |
| 2725 | REMOVED_OR_REWRITTEN_TEST | ./tests/conversion-paywall-ux-polish.test.js:243:    diaryEntries: [diaryEntry({ pattern_probes: { glucose_signals: ["Будилах / ухаан балартах"] } })] |
| 2726 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:311:- Role: SEVEN_DAY_USER |
| 2727 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:330:> ${topbar(Math.round((state.diaryEntries.length / 7) * 100), "Тайлангийн бэлэн байдал")} |
| 2728 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:369:- Role: SEVEN_DAY_USER |
| 2729 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:428:- Role: SEVEN_DAY_USER |
| 2730 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:487:- Role: SEVEN_DAY_USER |
| 2731 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:546:- Role: SEVEN_DAY_USER |
| 2732 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:605:- Role: SEVEN_DAY_USER |
| 2733 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:664:- Role: SEVEN_DAY_USER |
| 2734 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:723:- Role: SEVEN_DAY_USER |
| 2735 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:782:- Role: SEVEN_DAY_USER |
| 2736 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:805:> <button class="button ghost" onclick="setView('diaryHome')">Явц руу буцах</button> |
| 2737 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:841:- Role: SEVEN_DAY_USER |
| 2738 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:860:> <button class="button ghost" onclick="setView('diaryHome')">Явц руу буцах</button> |
| 2739 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:899:- Role: SEVEN_DAY_USER |
| 2740 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:900:- Scenario: limited-report, usable-limited-report |
| 2741 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:909:- Render proof: renderReport via limited-report, usable-limited-report [FULL_SURFACE] |
| 2742 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:918:> ${topbar(Math.round((state.diaryEntries.length / 7) * 100), "Тайлангийн бэлэн байдал")} |
| 2743 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:957:- Role: SEVEN_DAY_USER |
| 2744 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:958:- Scenario: limited-report |
| 2745 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:967:- Render proof: renderReport via limited-report [FULL_SURFACE] |
| 2746 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1016:- Role: SEVEN_DAY_USER |
| 2747 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1017:- Scenario: limited-report |
| 2748 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1026:- Render proof: renderReport via limited-report [FULL_SURFACE] |
| 2749 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1075:- Role: SEVEN_DAY_USER |
| 2750 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1076:- Scenario: limited-report |
| 2751 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1085:- Render proof: renderReport via limited-report [FULL_SURFACE] |
| 2752 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1134:- Role: SEVEN_DAY_USER |
| 2753 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1135:- Scenario: limited-report, usable-limited-report |
| 2754 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1144:- Render proof: renderReport via limited-report, usable-limited-report [FULL_SURFACE] |
| 2755 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1193:- Role: SEVEN_DAY_USER |
| 2756 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1194:- Scenario: limited-report |
| 2757 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1203:- Render proof: renderReport via limited-report [FULL_SURFACE] |
| 2758 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1252:- Role: SEVEN_DAY_USER |
| 2759 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1253:- Scenario: limited-report, usable-limited-report |
| 2760 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1262:- Render proof: renderReport via limited-report, usable-limited-report [FULL_SURFACE] |
| 2761 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1311:- Role: SEVEN_DAY_USER |
| 2762 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1312:- Scenario: limited-report, usable-limited-report |
| 2763 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1321:- Render proof: renderReport via limited-report, usable-limited-report [FULL_SURFACE] |
| 2764 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1370:- Role: SEVEN_DAY_USER |
| 2765 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1371:- Scenario: limited-report, usable-limited-report |
| 2766 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1380:- Render proof: renderReport via limited-report, usable-limited-report [FULL_SURFACE] |
| 2767 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1429:- Role: SEVEN_DAY_USER |
| 2768 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1430:- Scenario: limited-report, usable-limited-report |
| 2769 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1439:- Render proof: renderReport via limited-report, usable-limited-report [FULL_SURFACE] |
| 2770 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1488:- Role: SEVEN_DAY_USER |
| 2771 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1489:- Scenario: limited-report, usable-limited-report |
| 2772 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1498:- Render proof: renderReport via limited-report, usable-limited-report [FULL_SURFACE] |
| 2773 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1547:- Role: SEVEN_DAY_USER |
| 2774 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1548:- Scenario: limited-report, usable-limited-report |
| 2775 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1557:- Render proof: renderReport via limited-report, usable-limited-report [FULL_SURFACE] |
| 2776 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1570:> <button class="button ghost" onclick="setView('diaryHome')">Явц руу буцах</button> |
| 2777 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1606:- Role: SEVEN_DAY_USER |
| 2778 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1607:- Scenario: limited-report, usable-limited-report |
| 2779 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1616:- Render proof: renderReport via limited-report, usable-limited-report [FULL_SURFACE] |
| 2780 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1625:> <button class="button ghost" onclick="setView('diaryHome')">Явц руу буцах</button> |
| 2781 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1664:- Role: SEVEN_DAY_USER |
| 2782 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1665:- Scenario: usable-limited-report |
| 2783 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1674:- Render proof: renderReport via usable-limited-report [FULL_SURFACE] |
| 2784 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1723:- Role: SEVEN_DAY_USER |
| 2785 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1724:- Scenario: usable-limited-report |
| 2786 | REGENERATED_ARTIFACT | ./mongolian-copy-review-packs/05_P1_REPORT_REGISTER_BATCH_03.md:1733:- Render proof: renderReport via usable-limited-report [FULL_SURFACE] |
| 2787 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-31-human-mongolian-report-rewrite.md:19:- `7 хоногоор нарийвчлах` |
| 2788 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP72_RUNTIME_COPY_QA_REPORT.md:80:Reviewed a seven-day report scenario with high executive/default-choice signals. |
| 2789 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP72_RUNTIME_COPY_QA_REPORT.md:90:Reviewed a seven-day stress/regulation scenario. |
| 2790 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP72_RUNTIME_COPY_QA_REPORT.md:100:Reviewed one-time and seven-day collapse scenarios with `Өнөөдөр өнгөрлөө, маргаашаас`. |
| 2791 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP72_RUNTIME_COPY_QA_REPORT.md:135:- One-time report voice and compressed seven-day report voice are not fully aligned with the selected editor revisions. |
| 2792 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP72_RUNTIME_COPY_QA_REPORT.md:163:- Scope should include one-time report voice, seven-day compressed report paths, hidden function evidence lines, reward-deficit wording, executive/default-choice wording, and collapse/shame wording. |
| 2793 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP74_FULL_USER_JOURNEY_QA_REPORT.md:70:- Daily journal question `D-P-CE01` still says `оройн тэнхээ`. This was outside the selected A-038/A-088 patch but is visible in seven-day journaling and should be reviewed in WP75. |
| 2794 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP74_FULL_USER_JOURNEY_QA_REPORT.md:92:- compressed seven-day report keeps menstrual-cycle meaning |
| 2795 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP74_FULL_USER_JOURNEY_QA_REPORT.md:159:- Review seven-day daily prompt `D-P-CE01` for `оройн тэнхээ`. |
| 2796 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP74_FULL_USER_JOURNEY_QA_REPORT.md:189:2. Review seven-day daily prompt `D-P-CE01` and preview/paywall `дохио` / `Эхний зөөлөн алхам` wording. |
| 2797 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP82_QA_SKIP_PAYWALL_REPORT.md:5:WP82 adds a source-safe QA-only skip-paywall control for the one-time report flow. The repository source keeps production behavior unchanged: coming-soon mode remains enabled, QPay/payment access remains required for public one-time reports, and the one-time/seven-day payment cards remain in source. |
| 2798 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP82_QA_SKIP_PAYWALL_REPORT.md:16:The prior QA draft removed QPay verification friction, but still let the owner land on the assessment/payment selection screen after testing. That screen included the one-time and seven-day paid cards, which was distracting and fake during report-quality QA. |
| 2799 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP82_QA_SKIP_PAYWALL_REPORT.md:26:- `7 хоногийн гүн анализ` |
| 2800 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP82_QA_SKIP_PAYWALL_REPORT.md:27:- one-time and seven-day payment card CTAs |
| 2801 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP82_QA_SKIP_PAYWALL_REPORT.md:49:- does not automatically unlock the seven-day flow. |
| 2802 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP82_QA_SKIP_PAYWALL_REPORT.md:59:- seven-day payment card copy remains in source |
| 2803 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP82_QA_SKIP_PAYWALL_REPORT.md:86:- QA bypass does not unlock the seven-day flow; |
| 2804 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP83_ANTHROPOMETRIC_ACTIVITY_WORK_CONTEXT_REPORT.md:123:One follow-up candidate: the seven-day diary could later ask recurring work-shift context day by day, but WP83 only required stage-one questionnaire/report integration. |
| 2805 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-03.json:88:    "sevenDayPaid": true, |
| 2806 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-03.json:92:  "generatedReportText": "Гүн зураглалын тайлан Таны гүн зураглал бэлэн боллоо Энэ бол таны хариулт, тэмдэглэл дээр суурилсан эхний зураглал. Өөрийгөө буруутгах гэж биш, давтагддаг мөчөө илүү тод харах гэж уншаарай. Товч хариу 1. Таны гол гацдаг мөч Нэг удаа төлөвлөгөө зөрөхөд “өнөөдөр өнгөрлөө” гэж мэдрэгддэг. 2. Энэ юу гэсэн үг вэ? Асуудал ганц удаа хазайсандаа биш. Тэр мөчөөс хойш дараагийн хоолноос хэвийн үргэлжлэх зам бүдгэрч байна. Маргаашаас илүү чанга барина гэсэн бодол тойргийг дахин эхлүүлж магадгүй. 3. Эхлээд хийх нэг жижиг зүйл Нэг хазайлтын дараа хэрэглэх “дараагийн хоолноос хэвийн үргэлжлүүлэх” дүрэмтэй бол. 4. Одоогоор түр болгоомжлох зүйл Нэг алдааны дараа бүхнийг дахин эхлүүлэх хатуу дэглэмээс түр зайлсхий. Дэлгэрэнгүй тайлан харах Доорх нь дэлгэрэнгүй тайлбар. Эхний хэсгийг ойлгосон бол бүгдийг нь унших албагүй. Гол зураг Таны хариултаас нэг зүйл тод байна: асуудал ганц удаа төлөвлөгөөнөөс хазайсандаа биш. Харин тэр мөчөөс хойш “өнөөдөр өнгөрлөө” гэж мэдрэгдэхэд дараагийн хоолноос хэвийн үргэлжлэх зам харагдахгүй болж байна. Хэт чанга эхлэх тусам жижиг хазайлт том алдаа шиг санагдаж, маргаашаас бүр чанга барих бодол эргээд тойргийг дахин эхлүүлж байна. Тэр үед хоол танд юу өгч байсан байж болох вэ? Энэ нь зөв, буруу гэсэн дүгнэлт биш. Тухайн мөчид хоол дараах хэрэгцээний нэгийг түр нөхөж байсан байж магадгүй. “Нэгэнт алдсан” гэсэн дарамтаас түр холдох Хэт чанга дүрмийн эсрэг түр сулрах Өөрийгөө буруутгах мэдрэмжээс хэсэг зай авах Давтагддаг тойрог Шинэ төлөвлөгөө хэт чанга эхэлнэ ↓ Бага зэрэг хазайх мөч гарна ↓ “Өнөөдөр өнгөрлөө” гэж бодогдоно ↓ Дараагийн хоолноос хэвийн үргэлжлэх зам бүдгэрнэ ↓ Илүү их идэх эсвэл бүхлээр нь орхих хандлага гарна ↓ Дараа нь гэмшил нэмэгдэнэ ↓ Маргаашаас илүү чанга барина гэж бодно Үүнийг юунаас харсан бэ? Энэ эхний зураглал таны хариулт болон баталгаажуулсан тайлбар дээр суурилсан. 7 хоногийн тэмдэглэл хийвэл яг ямар өдөр, ямар нөхцөлд давтагдаж байгааг илүү тодруулна. Асуудал яг юу биш вэ? Асуудал нэг удаа төлөвлөгөө алдсандаа биш. Гол нь нэг хазайлт бүхэл өдөр дууссан мэт санагдаж, буцах жижиг зам харагдахгүй болох мөч байна. Одоогоор болгоомжлох зүйлс Төгс төлөвлөгөө Нэг алдаа гарвал бүхнийг дахин эхлүүлэх сорил Ичгүүрээр шахдаг хяналт Алдаагаа нөхөх гэж маргааш нь илүү чангаруулах Эхний жижиг өөрчлөлт Эхний жижиг өөрчлөлт бол төгс төлөвлөгөө биш. Нэг хазайлтын дараа хэрэглэх “дараагийн хоолноос хэвийн үргэлжлүүлэх” дүрэмтэй болох. 14 хоногийн туршилт Эхний 3 өдөр: “70% хангалттай” гэсэн нэг өгүүлбэр бичээд өдөр бүр харагдах газар тавь. 4–10 дахь өдөр: төлөвлөгөө зөрсөн мөч гарвал дараагийн хоолыг шийтгэлгүй хэвийн хоол болго. Нөхөх гэж мацаг барихгүй. 11–14 дахь өдөр: “өнөөдөр өнгөрлөө” бодол хэдэн удаа гарсан, хэдэн удаа дараагийн хоолноос үргэлжлүүлж чадсанаа тэмдэглэ. Хэрвээ нэг өдөр алгасвал: маргааш илүү чанга барихгүй. Зүгээр дараагийн хоолноос эхэл. 7 хоногоор нарийвчлах Хэрвээ энэ зураглалыг илүү бодит өдөр тутмын түвшинд харахыг хүсвэл 7 хоногийн богино тэмдэглэлээр дараах хэсгүүдийг тодруулж болно. Нурах давтамж яг ямар өдөр, ямар нөхцөлд давтагддагийг харна. Хэт чанга эхлэх яг ямар өдөр, ямар нөхцөлд давтагддагийг харна. Өмнөх 30 минут, оройн тэнхээ, орчны дохио, бэлэн сонголтын нөхцөлийг тэмдэглэл дээр тодруулна. 7 хоногоор нарийвчлах Сонголт руу буцах Шинээр эхлэх", |
| 2807 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-01.json:121:    "packageType": "seven-day", |
| 2808 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-01.json:123:    "sevenDayPaid": true, |
| 2809 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-02.json:112:    "packageType": "seven-day", |
| 2810 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-02.json:114:    "sevenDayPaid": true, |
| 2811 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-05.json:119:    "packageType": "seven-day", |
| 2812 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-05.json:121:    "sevenDayPaid": true, |
| 2813 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-09.json:115:    "packageType": "seven-day", |
| 2814 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-09.json:117:    "sevenDayPaid": true, |
| 2815 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.md:199:Эхний 3 өдөр: “70% хангалттай” гэсэн нэг өгүүлбэр бичээд өдөр бүр харагдах газар тавь. 4–10 дахь өдөр: төлөвлөгөө зөрсөн мөч гарвал дараагийн хоолыг шийтгэлгүй хэвийн хоол болго. Нөхөх гэж мацаг барихгүй. 11–14 дахь өдөр: “өнөөдөр өнгөрлөө” бодол хэдэн удаа гарсан, хэдэн удаа дараагийн хоолноос үргэлжлүүлж чадсанаа тэмдэглэ. Хэрвээ нэг өдөр алгасвал: маргааш илүү чанга барихгүй. Зүгээр дараагийн хоолноос эхэл. 7 хоногоор нарийвчлах Хэрвээ энэ зураглалыг илүү бодит өдөр тутмын түвшинд харахыг хүсвэл 7 хоногийн богино тэмдэглэлээр дараах хэсгүүдийг тодруулж болно. Нурах давтамж яг ямар өдөр, ямар нөхцөлд давтагддагийг харна. Хэт чанга эхлэх яг ямар өдөр, ямар нөхцөлд давтагддагийг харна. Өмнөх 30 минут, оройн тэнхээ, орчны дохио, бэлэн сонголтын нөхцөлийг тэмдэглэл дээр тодруулна. 7 хоногоор нарийвчлах Сонголт руу буцах Шинээр эхлэх |
| 2816 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.md:380:Эхний 3 өдөр: хамгийн их нөлөөлдөг нэг дохиог сонго. Жишээ нь ширээн дээрх зууш, захиалгын апп, амттаны шургуулга. 4–10 дахь өдөр: тэр дохиог нэг алхам холдуул. Оронд нь өөрт тохирох нэг амар сонголтыг ойр тавь. 11–14 дахь өдөр: “хараад идмээр болсон уу?” гэдгээ өдөрт нэг удаа тэмдэглэ. Хэрвээ нэг өдөр алгасвал: бүх орчноо өөрчлөх гэж зүтгэхгүй. Зөвхөн нэг дохио руугаа буц. 7 хоногоор нарийвчлах Хэрвээ энэ зураглалыг илүү бодит өдөр тутмын түвшинд харахыг хүсвэл 7 хоногийн богино тэмдэглэлээр дараах хэсгүүдийг тодруулж болно. Орчны дохио яг ямар өдөр, ямар нөхцөлд давтагддагийг харна. Таатай мэдрэмж яг ямар өдөр, ямар нөхцөлд давтагддагийг харна. Өмнөх 30 минут, оройн тэнхээ, орчны дохио, бэлэн сонголтын нөхцөлийг тэмдэглэл дээр тодруулна. 7 хоногоор нарийвчлах Сонголт руу буцах Шинээр эхлэх |
| 2817 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-03.json:88:    "sevenDayPaid": true, |
| 2818 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-03.json:92:  "generatedReportText": "Тайлан Таны тайлан бэлэн боллоо Доорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай. Товч хариу 1. Таны гол гацдаг мөч Нэг удаа төлөвлөгөө зөрөхөд “өнөөдөр өнгөрлөө” гэж мэдрэгддэг. 2. Энэ юу гэсэн үг вэ? Асуудал ганц удаа хазайсандаа биш. Тэр мөчөөс хойш дараагийн хоолноос хэвийн үргэлжлэх зам бүдгэрч байна. Маргаашаас илүү чанга барина гэсэн бодол тойргийг дахин эхлүүлж магадгүй. 3. Эхлээд хийх нэг жижиг зүйл Нэг хазайлтын дараа хэрэглэх “дараагийн хоолноос хэвийн үргэлжлүүлэх” дүрэмтэй бол. 4. Одоогоор түр болгоомжлох зүйл Нэг алдааны дараа бүхнийг дахин эхлүүлэх хатуу дэглэмээс түр зайлсхий. Дэлгэрэнгүй тайлан Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй. Гол зураг Нэг удаа хазайхаар бүх өдөр дуусчихсан юм шиг санагддаг. Тэр мөчөөс хойш “өнөөдөр өнгөрлөө” гэсэн бодол орж ирнэ. Дараагийн хоолноос хэвийн үргэлжлэх зам бүдгэрдэг. Тэр мөчид хоол ямар мэдрэмж өгч байна вэ? Тэр үед хоол “нэгэнт алдсан” гэсэн дарамтаас түр холдуулах шиг болдог. “Нэгэнт алдсан” гэсэн дарамтаас түр холдох Хэт чанга дүрмийн эсрэг түр сулрах Өөрийгөө буруутгах мэдрэмжээс хэсэг зай авах Давтагддаг тойрог Шинэ төлөвлөгөө хэт чанга эхэлнэ ↓ Бага зэрэг хазайх мөч гарна ↓ “Өнөөдөр өнгөрлөө” гэж бодогдоно ↓ Дараагийн хоолноос хэвийн үргэлжлэх зам харагдахгүй болно ↓ Илүү их идэх эсвэл бүхлээр нь орхих хандлага гарна ↓ Дараа нь гэмшил нэмэгдэнэ ↓ Маргаашаас илүү чанга барина гэж бодно Яагаад ингэж хэлж байна вэ? Та нэг удаа төлөвлөгөө зөрөхөд “өнөөдөр өнгөрлөө” гэж бодогддог гэж хариулсан. Гол буруу ойлголт Асуудал нэг удаа төлөвлөгөө алдсандаа биш. Гол нь буцаад хэвийн хоол руу орох жижиг зам харагдахгүй болдог. Одоохондоо хэт яарахгүй зүйлс Төгс төлөвлөгөө Нэг алдаа гарвал бүхнийг дахин эхлүүлэх сорил Ичгүүрээр шахдаг хяналт Алдаагаа нөхөх гэж маргааш нь илүү чангаруулах Эхний жижиг өөрчлөлт Эхний жижиг өөрчлөлт бол төгс төлөвлөгөө биш. Нэг хазайлтын дараа хэрэглэх “дараагийн хоолноос хэвийн үргэлжлүүлэх” дүрэмтэй болох. 14 хоногийн туршилт Эхний 3 өдөр: “70% хангалттай” гэсэн нэг өгүүлбэр бичээд өдөр бүр харагдах газар тавь. 4-10 дахь өдөр: төлөвлөгөө зөрсөн мөч гарвал дараагийн хоолыг шийтгэлгүй хэвийн хоол болго. Мацгаар засах гэж оролдохгүй. 11-14 дахь өдөр: “өнөөдөр өнгөрлөө” бодол гарсан эсэх, дараагийн хоолноос буцаж чадсан эсэхээ тэмдэглэ. Хэрвээ нэг өдөр алгасвал: маргааш илүү чанга барихгүй. Зүгээр дараагийн хоолноос эхэл. 7 хоногийн тэмдэглэл юуг тодруулах вэ? “Өнөөдөр өнгөрлөө” гэсэн бодол ямар үед гарч байна вэ? Дараагийн хоолноос хэвийн үргэлжлэхэд юу саад болж байна вэ? 7 хоногоор нарийвчлах Сонголт руу буцах Шинээр эхлэх", |
| 2819 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-08.json:108:    "packageType": "seven-day", |
| 2820 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-08.json:110:    "sevenDayPaid": true, |
| 2821 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-06.json:89:    "sevenDayPaid": true, |
| 2822 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-06.json:93:  "generatedReportText": "Гүн зураглалын тайлан Таны гүн зураглал бэлэн боллоо Энэ бол таны хариулт, тэмдэглэл дээр суурилсан эхний зураглал. Өөрийгөө буруутгах гэж биш, давтагддаг мөчөө илүү тод харах гэж уншаарай. Товч хариу 1. Таны гол гацдаг мөч Хоол харагдах, үнэртэх, захиалгын апп нээгдэхэд өлсөөгүй байсан ч идэх бодол орж ирдэг. 2. Энэ юу гэсэн үг вэ? Энд гол нь хүсэл зориг сулдаа биш. Орчин өөрөө идэх шийдвэрийг эхлүүлж байна. Харагдах зүйл ойр байх тусам идэх бодол хурдан орж ирдэг. 3. Эхлээд хийх нэг жижиг зүйл Хамгийн хүчтэй нөлөөлдөг нэг дохиог нэг алхам холдуул. 4. Одоогоор түр болгоомжлох зүйл Бүх хоолоо хорих гэж оролдохоос илүү орчны нэг дохиог өөрчил. Дэлгэрэнгүй тайлан харах Доорх нь дэлгэрэнгүй тайлбар. Эхний хэсгийг ойлгосон бол бүгдийг нь унших албагүй. Гол зураг Таны хариултаас өлсөөгүй байсан ч хоол харагдах, үнэртэх, захиалгын апп нээгдэх, зууш гарын дор байх үед идэх бодол өөрөө орж ирдэг нь мэдрэгдэж байна. Энд гол нь хүсэл зориг сулдаа биш. Орчин өөрөө идэх шийдвэрийг таны өмнөөс эхлүүлээд байна. Тэр үед хоол танд юу өгч байсан байж болох вэ? Энэ нь зөв, буруу гэсэн дүгнэлт биш. Тухайн мөчид хоол дараах хэрэгцээний нэгийг түр нөхөж байсан байж магадгүй. Харагдсан зүйлд шууд хариу өгөх Бодолгүйгээр хурдан таатай мэдрэмж авах Гарын дор байгаа амар сонголтыг ашиглах Давтагддаг тойрог Хоол, зууш, үнэр, зураг эсвэл захиалгын апп ойр байна ↓ Өлсөөгүй байсан ч идэх бодол орж ирнэ ↓ “Нэгийг авчихъя” гэсэн жижиг шийдвэр хурдан гарна ↓ Идсэний дараа түр таатай мэдрэмж өгнө ↓ Орчны дохио хэвээр үлдвэл дараагийн удаа дахин амархан давтагдана Үүнийг юунаас харсан бэ? Энэ эхний зураглал таны хариулт болон баталгаажуулсан тайлбар дээр суурилсан. 7 хоногийн тэмдэглэл хийвэл яг ямар өдөр, ямар нөхцөлд давтагдаж байгааг илүү тодруулна. Асуудал яг юу биш вэ? Асуудал хүсэл зориг сулдаа биш. Орчны дохио идэх шийдвэрийг түрүүлж асааж байгаа учраас хамгийн ойрын нэг дохиог өөрчлөх нь эхний бодит алхам байна. Одоогоор болгоомжлох зүйлс Бүх амттай зүйлийг нэг дор хорих Гарын дорх дохиог хэвээр үлдээгээд зөвхөн тэвчих Өдөр бүр бүх орчноо төгс өөрчлөх гэж зүтгэх Өлсөөгүй идсэнээ зан чанарын алдаа гэж үзэх Эхний жижиг өөрчлөлт Эхний жижиг өөрчлөлт бол бүх амттай зүйлийг хорих биш. Хамгийн хүчтэй нөлөөлдөг нэг дохиог нэг алхам холдуулж, илүү тохирох нэг сонголтыг нэг алхам ойртуулах. 14 хоногийн туршилт Эхний 3 өдөр: хамгийн их нөлөөлдөг нэг дохиог сонго. Жишээ нь ширээн дээрх зууш, захиалгын апп, амттаны шургуулга. 4–10 дахь өдөр: тэр дохиог нэг алхам холдуул. Оронд нь өөрт тохирох нэг амар сонголтыг ойр тавь. 11–14 дахь өдөр: “хараад идмээр болсон уу?” гэдгээ өдөрт нэг удаа тэмдэглэ. Хэрвээ нэг өдөр алгасвал: бүх орчноо өөрчлөх гэж зүтгэхгүй. Зөвхөн нэг дохио руугаа буц. 7 хоногоор нарийвчлах Хэрвээ энэ зураглалыг илүү бодит өдөр тутмын түвшинд харахыг хүсвэл 7 хоногийн богино тэмдэглэлээр дараах хэсгүүдийг тодруулж болно. Орчны дохио яг ямар өдөр, ямар нөхцөлд давтагддагийг харна. Таатай мэдрэмж яг ямар өдөр, ямар нөхцөлд давтагддагийг харна. Өмнөх 30 минут, оройн тэнхээ, орчны дохио, бэлэн сонголтын нөхцөлийг тэмдэглэл дээр тодруулна. 7 хоногоор нарийвчлах Сонголт руу буцах Шинээр эхлэх", |
| 2823 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-02.json:112:    "packageType": "seven-day", |
| 2824 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-02.json:114:    "sevenDayPaid": true, |
| 2825 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/driver-scoring-spec.md:12:diaryEntries |
| 2826 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-04.json:80:    "packageType": "seven-day", |
| 2827 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-04.json:82:    "sevenDayPaid": true, |
| 2828 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-10.json:51:    "sevenDayPaid": true, |
| 2829 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-05.json:119:    "packageType": "seven-day", |
| 2830 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-05.json:121:    "sevenDayPaid": true, |
| 2831 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-07.json:121:    "packageType": "seven-day", |
| 2832 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10-pdf/raw/user-07.json:123:    "sevenDayPaid": true, |
| 2833 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/migration-recommendation.md:90:  seven_day_confirmation_plan, |
| 2834 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/fixture-archetype-plan.md:7:- Each fixture should include current `stageAnswers` and optional `diaryEntries`. |
| 2835 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/fixture-archetype-plan.md:228:diaryEntries if needed |
| 2836 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-09.json:115:    "packageType": "seven-day", |
| 2837 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-09.json:117:    "sevenDayPaid": true, |
| 2838 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/sprint-32C-owner-approved-microcopy.md:82:- standalone `7 хоногоор нарийвчлах` |
| 2839 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-08.json:108:    "packageType": "seven-day", |
| 2840 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-08.json:110:    "sevenDayPaid": true, |
| 2841 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/future-test-plan.md:71:- `seven_day_diary_confirmation_targets` are present. |
| 2842 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-04.json:80:    "packageType": "seven-day", |
| 2843 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-04.json:82:    "sevenDayPaid": true, |
| 2844 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/driver-stack-contract.md:44:  "seven_day_diary_confirmation_targets": [], |
| 2845 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/driver-stack-contract.md:246:## `seven_day_diary_confirmation_targets` |
| 2846 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-07.json:121:    "packageType": "seven-day", |
| 2847 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-07.json:123:    "sevenDayPaid": true, |
| 2848 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/experiment-diary-map.md:15:\| Daily summary \| `generateDailySummaryBullets()` and `createConfirmedSummaryObject()` convert structured answers and text into confirmed evidence tags. \| Strong evidence-quality pattern. \| |
| 2849 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-06.json:89:    "sevenDayPaid": true, |
| 2850 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-06.json:93:  "generatedReportText": "Тайлан Таны тайлан бэлэн боллоо Доорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай. Товч хариу 1. Таны гол гацдаг мөч Зууш нүдэнд ойр байхаар гар өөрөө хүрчихдэг үе байна. 2. Энэ юу гэсэн үг вэ? Энд гол нь хүсэл зориг сулдаа биш. Ойр байгаа хоол, үнэр, зураг, захиалгын апп идэх бодлыг түрүүлж оруулдаг. Харагдах зүйл ойр байх тусам идэх бодол хурдан орж ирдэг. 3. Эхлээд хийх нэг жижиг зүйл Хамгийн хүчтэй татдаг нэг зүйлийг нэг алхам холдуул. 4. Одоогоор түр болгоомжлох зүйл Бүх хоолоо хорих гэж оролдохоос илүү нүдэнд ойр байгаа нэг зүйлээ өөрчил. Ил харагдаж байгаа зүйл Гэрээс ажиллах үед зууш, апп, зураг нүдэнд ойр байна. Цаана нь ажиллаж байгаа зүйл Гарын дор байгаа зүйлд бараг бодолгүй хүрдэг үе хүчтэй байна. Дэлгэрэнгүй тайлан Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй. Гол зураг Зууш нүдэнд ойр байхаар гар өөрөө хүрчихдэг үе байна. Апп нээгдэх, хоолны зураг харагдах, үнэр ойртох үед өлсөөгүй байсан ч идмээр болдог. Тэр мөчид хоол ямар мэдрэмж өгч байна вэ? Тэр үед өлссөндөө биш, нүдэнд өртсөн зүйлд гар амархан хүрч байна. Харагдсан зүйлд шууд хариу өгөх Бодолгүйгээр хурдан таатай мэдрэмж авах Гарын дор байгаа амар сонголтыг ашиглах Давтагддаг тойрог Зууш, үнэр, зураг эсвэл захиалгын апп ойр байна ↓ Өлсөөгүй байсан ч идэх бодол орж ирнэ ↓ “Нэгийг авчихъя” гэсэн жижиг шийдвэр хурдан гарна ↓ Идсэний дараа түр таатай мэдрэмж өгнө ↓ Тэр зүйл нүдэнд ойр хэвээр байвал дараа нь дахиад амархан хүрнэ Яагаад ингэж хэлж байна вэ? Та хоол харагдах, үнэртэх, захиалгын апп харахад идэх хүсэл нэмэгддэг гэж тэмдэглэсэн. Гол буруу ойлголт Асуудал хүсэл зориг сулдаа биш. Нүдэнд ойр, гарын дор байгаа зүйлд хүн амархан хүрдэг. Одоохондоо хэт яарахгүй зүйлс Бүх амттай зүйлийг нэг дор хорих Гарын дорх зүйлийг хэвээр үлдээгээд зөвхөн тэвчих Өдөр бүр бүх орчноо төгс өөрчлөх гэж зүтгэх Өлсөөгүй идсэнээ зан чанарын алдаа гэж үзэх Эхний жижиг өөрчлөлт Эхний жижиг өөрчлөлт бол бүх амттай зүйлийг хорих биш. Хамгийн хүчтэй татдаг нэг зүйлийг нэг алхам холдуул. Оронд нь илүү тохирох нэг сонголтыг ойр тавь. 14 хоногийн туршилт Эхний 3 өдөр: хамгийн их татдаг нэг зүйлийг сонго. Жишээ нь ширээн дээрх зууш, захиалгын апп, амттаны шургуулга. 4-10 дахь өдөр: тэр зүйлийг нэг алхам холдуул. Оронд нь өөрт тохирох нэг амар сонголтыг ойр тавь. 11-14 дахь өдөр: “хараад идмээр болсон уу?” гэдгээ өдөрт нэг удаа тэмдэглэ. Хэрвээ нэг өдөр алгасвал: бүх орчноо өөрчлөх гэж зүтгэхгүй. Зөвхөн нэг зүйл рүүгээ буц. 7 хоногийн тэмдэглэл юуг тодруулах вэ? Нүдэнд ойр байгаа нэг зүйл идэх хүслийг хэдэн удаа эхлүүлж байна вэ? Тэр зүйлийг холдуулсан өдөр ялгаа гарч байна уу? 7 хоногоор нарийвчлах Сонголт руу буцах Шинээр эхлэх", |
| 2851 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/OWNER_REVIEW_PACK.md:31:9. `saveDiaryEntry()` persists a local diary entry, updates safety flags, and routes to `reportReady` after 5+ entries. |
| 2852 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/OWNER_REVIEW_PACK.md:299:seven_day_confirmation_plan |
| 2853 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/OWNER_REVIEW_PACK.md:320:\| Daily summary \| `generateDailySummaryBullets()` and `createConfirmedSummaryObject()` convert structured answers and text into confirmed evidence tags. \| Strong evidence-quality pattern. \| |
| 2854 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/OWNER_REVIEW_PACK.md:512:  seven_day_confirmation_plan, |
| 2855 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-10.json:51:    "sevenDayPaid": true, |
| 2856 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md:85:7 хоногоор нарийвчлах |
| 2857 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md:221:7 хоногоор нарийвчлах |
| 2858 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md:358:7 хоногоор нарийвчлах |
| 2859 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md:495:7 хоногоор нарийвчлах |
| 2860 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md:629:7 хоногоор нарийвчлах |
| 2861 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md:761:7 хоногоор нарийвчлах |
| 2862 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md:896:7 хоногоор нарийвчлах |
| 2863 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md:1036:7 хоногоор нарийвчлах |
| 2864 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-01.json:121:    "packageType": "seven-day", |
| 2865 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/raw/user-01.json:123:    "sevenDayPaid": true, |
| 2866 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/OWNER_REVIEW_PACK_WP2.md:431:diaryEntries |
| 2867 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/OWNER_REVIEW_PACK_WP2.md:694:  "seven_day_diary_confirmation_targets": [], |
| 2868 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/OWNER_REVIEW_PACK_WP2.md:896:## `seven_day_diary_confirmation_targets` |
| 2869 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/OWNER_REVIEW_PACK_WP2.md:1084:- Each fixture should include current `stageAnswers` and optional `diaryEntries`. |
| 2870 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/OWNER_REVIEW_PACK_WP2.md:1305:diaryEntries if needed |
| 2871 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-2/OWNER_REVIEW_PACK_WP2.md:1398:- `seven_day_diary_confirmation_targets` are present. |
| 2872 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP70_MONGOLIAN_COPY_REVIEW_PACK/02_ТАЙЛАНГИЙН_ТЕКСТҮҮД.md:137:7 хоногийн гүн анализ |
| 2873 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP70_MONGOLIAN_COPY_REVIEW_PACK/02_ТАЙЛАНГИЙН_ТЕКСТҮҮД.md:145:7 хоногоор нарийвчлах эрх |
| 2874 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-22/runtime-visible-surface-integration-summary.md:25:`renderReport()` routes ordinary one-time and seven-day report HTML through `renderReportWithRuntimeVisibleSurface(...)` with: |
| 2875 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/virtual-users-10/REPORT_AUDIT.md:38:5. One-time reports have less diary-backed specificity than seven-day reports, which is expected but commercially important. |
| 2876 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-24-report-voice-rewrite.md:23:  - 7 хоногоор нарийвчлах, only where applicable |
| 2877 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP73_REPORT_VOICE_COPY_CLEANUP_REPORT.md:26:- compressed seven-day menstrual-cycle report output |
| 2878 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/WP73_REPORT_VOICE_COPY_CLEANUP_REPORT.md:70:- compressed seven-day report voice keeps menstrual-cycle meaning while avoiding mechanical copy |
| 2879 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-03.json:41:  "detailedReportText": "Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nНэг удаа хазайхаар бүх өдөр дуусчихсан юм шиг санагддаг.\nТэр мөчөөс хойш “өнөөдөр өнгөрлөө” гэсэн бодол орж ирнэ.\nДараагийн хоолноос хэвийн үргэлжлэх зам бүдгэрдэг.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед хоол “нэгэнт алдсан” гэсэн дарамтаас түр холдуулах шиг болдог.\n- “Нэгэнт алдсан” гэсэн дарамтаас түр холдох\n- Хэт чанга дүрмийн эсрэг түр сулрах\n- Өөрийгөө буруутгах мэдрэмжээс хэсэг зай авах\nДавтагддаг тойрог\nШинэ төлөвлөгөө хэт чанга эхэлнэ ↓\nБага зэрэг хазайх мөч гарна ↓\n“Өнөөдөр өнгөрлөө” гэж бодогдоно ↓\nДараагийн хоолноос хэвийн үргэлжлэх зам харагдахгүй болно ↓\nИлүү их идэх эсвэл бүхлээр нь орхих хандлага гарна ↓\nДараа нь гэмшил нэмэгдэнэ ↓\nМаргаашаас илүү чанга барина гэж бодно\nЯагаад ингэж хэлж байна вэ?\nТа нэг удаа төлөвлөгөө зөрөхөд “өнөөдөр өнгөрлөө” гэж бодогддог гэж хариулсан.\nГол буруу ойлголт\nАсуудал нэг удаа төлөвлөгөө алдсандаа биш. Гол нь буцаад хэвийн хоол руу орох жижиг зам харагдахгүй болдог.\nОдоохондоо хэт яарахгүй зүйлс\n- Төгс төлөвлөгөө\n- Нэг алдаа гарвал бүхнийг дахин эхлүүлэх сорил\n- Ичгүүрээр шахдаг хяналт\n- Алдаагаа нөхөх гэж маргааш нь илүү чангаруулах\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол төгс төлөвлөгөө биш. Нэг хазайлтын дараа хэрэглэх “дараагийн хоолноос хэвийн үргэлжлүүлэх” дүрэмтэй болох.\n14 хоногийн туршилт\nЭхний 3 өдөр: “70% хангалттай” гэсэн нэг өгүүлбэр бичээд өдөр бүр харагдах газар тавь.\n4-10 дахь өдөр: төлөвлөгөө зөрсөн мөч гарвал дараагийн хоолыг шийтгэлгүй хэвийн хоол болго. Мацгаар засах гэж оролдохгүй.\n11-14 дахь өдөр: “өнөөдөр өнгөрлөө” бодол гарсан эсэх, дараагийн хоолноос буцаж чадсан эсэхээ тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: маргааш илүү чанга барихгүй. Зүгээр дараагийн хоолноос эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- “Өнөөдөр өнгөрлөө” гэсэн бодол ямар үед гарч байна вэ?\n- Дараагийн хоолноос хэвийн үргэлжлэхэд юу саад болж байна вэ?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2880 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-03.json:42:  "fullReportText": "Тайлан\nТаны тайлан бэлэн боллоо\nДоорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.\nТовч хариу\n1. Таны гол гацдаг мөч\nНэг удаа төлөвлөгөө зөрөхөд “өнөөдөр өнгөрлөө” гэж мэдрэгддэг.\n2. Энэ юу гэсэн үг вэ?\n- Асуудал ганц удаа хазайсандаа биш.\n- Тэр мөчөөс хойш дараагийн хоолноос хэвийн үргэлжлэх зам бүдгэрч байна.\n- Маргаашаас илүү чанга барина гэсэн бодол тойргийг дахин эхлүүлж магадгүй.\n3. Эхлээд хийх нэг жижиг зүйл\nНэг хазайлтын дараа хэрэглэх “дараагийн хоолноос хэвийн үргэлжлүүлэх” дүрэмтэй бол.\n4. Одоогоор түр болгоомжлох зүйл\nНэг алдааны дараа бүхнийг дахин эхлүүлэх хатуу дэглэмээс түр зайлсхий.\nДэлгэрэнгүй тайлан\nДоорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nНэг удаа хазайхаар бүх өдөр дуусчихсан юм шиг санагддаг.\nТэр мөчөөс хойш “өнөөдөр өнгөрлөө” гэсэн бодол орж ирнэ.\nДараагийн хоолноос хэвийн үргэлжлэх зам бүдгэрдэг.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед хоол “нэгэнт алдсан” гэсэн дарамтаас түр холдуулах шиг болдог.\n- “Нэгэнт алдсан” гэсэн дарамтаас түр холдох\n- Хэт чанга дүрмийн эсрэг түр сулрах\n- Өөрийгөө буруутгах мэдрэмжээс хэсэг зай авах\nДавтагддаг тойрог\nШинэ төлөвлөгөө хэт чанга эхэлнэ ↓\nБага зэрэг хазайх мөч гарна ↓\n“Өнөөдөр өнгөрлөө” гэж бодогдоно ↓\nДараагийн хоолноос хэвийн үргэлжлэх зам харагдахгүй болно ↓\nИлүү их идэх эсвэл бүхлээр нь орхих хандлага гарна ↓\nДараа нь гэмшил нэмэгдэнэ ↓\nМаргаашаас илүү чанга барина гэж бодно\nЯагаад ингэж хэлж байна вэ?\nТа нэг удаа төлөвлөгөө зөрөхөд “өнөөдөр өнгөрлөө” гэж бодогддог гэж хариулсан.\nГол буруу ойлголт\nАсуудал нэг удаа төлөвлөгөө алдсандаа биш. Гол нь буцаад хэвийн хоол руу орох жижиг зам харагдахгүй болдог.\nОдоохондоо хэт яарахгүй зүйлс\n- Төгс төлөвлөгөө\n- Нэг алдаа гарвал бүхнийг дахин эхлүүлэх сорил\n- Ичгүүрээр шахдаг хяналт\n- Алдаагаа нөхөх гэж маргааш нь илүү чангаруулах\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол төгс төлөвлөгөө биш. Нэг хазайлтын дараа хэрэглэх “дараагийн хоолноос хэвийн үргэлжлүүлэх” дүрэмтэй болох.\n14 хоногийн туршилт\nЭхний 3 өдөр: “70% хангалттай” гэсэн нэг өгүүлбэр бичээд өдөр бүр харагдах газар тавь.\n4-10 дахь өдөр: төлөвлөгөө зөрсөн мөч гарвал дараагийн хоолыг шийтгэлгүй хэвийн хоол болго. Мацгаар засах гэж оролдохгүй.\n11-14 дахь өдөр: “өнөөдөр өнгөрлөө” бодол гарсан эсэх, дараагийн хоолноос буцаж чадсан эсэхээ тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: маргааш илүү чанга барихгүй. Зүгээр дараагийн хоолноос эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- “Өнөөдөр өнгөрлөө” гэсэн бодол ямар үед гарч байна вэ?\n- Дараагийн хоолноос хэвийн үргэлжлэхэд юу саад болж байна вэ?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2881 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/sprint-32B-final-user-facing-polish.md:62:- `7 хоногоор нарийвчлах` |
| 2882 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/sprint-32B-final-user-facing-polish.md:98:- standalone `7 хоногоор нарийвчлах` CTA is absent from clean export |
| 2883 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/sprint-32B-final-user-facing-polish.md:144:- no standalone `7 хоногоор нарийвчлах` CTA found |
| 2884 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/sprint-32A-final-polish.md:20:4. `7 хоногоор нарийвчлах` appeared as both a heading and CTA. |
| 2885 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/sprint-32A-final-polish.md:79:- `7 хоногоор нарийвчлах` heading -> `7 хоногийн тэмдэглэл юуг тодруулах вэ?` |
| 2886 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-32-copy-rewrite/sprint-32A-final-polish.md:83:`7 хоногоор нарийвчлах` |
| 2887 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-02.json:43:  "detailedReportText": "Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nСтресс ихтэй үед хоол түр амрах газар шиг санагдаж байна.\nДотор давчдах, санаа зовох, уур хүрэх үед идэхэд хэсэг намддаг.\nДараа нь гэмших мэдрэмж ирвэл тэр амралт удаан тогтохгүй.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед хоол хэсэг амсхийх газар болж байна.\n- Сэтгэл тавгүй үед хэсэг намдах\n- Дотор давчдах мэдрэмжийг зөөллөх\n- Яг тэр үед амсхийх зай гаргах\nДавтагддаг тойрог\nСтресс нэмэгдэнэ ↓\nДотор давчдаж, тавгүй болно ↓\nХоол хамгийн ойрын амралт шиг санагдана ↓\nИдсэний дараа хэсэг намдана ↓\nДараа нь гэмших эсвэл санаа зовох мэдрэмж орж ирнэ ↓\nСтресс хэвээр байвал хоол дараагийн удаа дахиад ойрхон санагдана\nЯагаад ингэж хэлж байна вэ?\nТа стресс, санаа зовнил, уурын дараа идэх хүсэл нэмэгдэж, идсэний дараа хэсэг тайвширдаг гэж хариулсан.\nГол буруу ойлголт\nАсуудал хоолондоо биш. Стресс өндөр үед хоол хамгийн ойр амсхийх газар шиг санагдаж байна.\nОдоохондоо хэт яарахгүй зүйлс\n- Илүү хатуу хоолны дэглэмийг бэлэн шийдэл болгох\n- Стрессийн мөчид зөвхөн тэвчих гэж шахах\n- Гэмшлээр өөрийгөө хөдөлгөх\n- Мэдрэмжээ огт нэрлэхгүй орхих\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол хоолноос өмнө өөрийгөө хорих биш. 60 секунд зогсоод “өлсөж байна уу, амрах газар хайж байна уу?” гэж ялга.\n14 хоногийн туршилт\nЭхний 3 өдөр: идэх хүсэл стрессийн дараа гарсан эсэхийг л тэмдэглэ. Засах гэж бүү оролд.\n4-10 дахь өдөр: хоолноос өмнө 60 секунд амьсгаа авах, ус уух, алхах, хүн рүү бичихээс нэгийг турш.\n11-14 дахь өдөр: аль богино амралт хамгийн бодитой байсныг сонго.\nХэрвээ нэг өдөр алгасвал: тэр өдрийг бүтэлгүйтэл гэж үзэхгүй. Дараагийн стрессийн мөч дээр дахин 60 секундээс эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Стрессийн дараа идэх хүсэл хэдэн удаа гарч байна вэ?\n- Идсэний дараа үнэхээр тайвширч байна уу, эсвэл гэмшил нэмэгдэж байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2888 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-02.json:44:  "fullReportText": "Тайлан\nТаны тайлан бэлэн боллоо\nДоорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.\nТовч хариу\n1. Таны гол гацдаг мөч\nСтресс ихтэй үед хоол танд түр амрах газар шиг болж байна.\n2. Энэ юу гэсэн үг вэ?\n- Тэр үед хоол зөвхөн өлсөлт дарах зүйл биш байна.\n- Дотор давчдах, санаа зовох үед хоол хэсэг тайвшруулах шиг болдог.\n- Дараа нь гэмших мэдрэмж нэмэгдвэл энэ тойрог улам хүндэрдэг.\n3. Эхлээд хийх нэг жижиг зүйл\nИдэхээс өмнө 60 секунд “би өлсөж байна уу, амсхийх газар хайж байна уу?” гэж ялга.\n4. Одоогоор түр болгоомжлох зүйл\nСтресс ихтэй өдөр өөрийгөө зөвхөн тэвч гэж шахахаас түр зайлсхий.\nДэлгэрэнгүй тайлан\nДоорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nСтресс ихтэй үед хоол түр амрах газар шиг санагдаж байна.\nДотор давчдах, санаа зовох, уур хүрэх үед идэхэд хэсэг намддаг.\nДараа нь гэмших мэдрэмж ирвэл тэр амралт удаан тогтохгүй.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед хоол хэсэг амсхийх газар болж байна.\n- Сэтгэл тавгүй үед хэсэг намдах\n- Дотор давчдах мэдрэмжийг зөөллөх\n- Яг тэр үед амсхийх зай гаргах\nДавтагддаг тойрог\nСтресс нэмэгдэнэ ↓\nДотор давчдаж, тавгүй болно ↓\nХоол хамгийн ойрын амралт шиг санагдана ↓\nИдсэний дараа хэсэг намдана ↓\nДараа нь гэмших эсвэл санаа зовох мэдрэмж орж ирнэ ↓\nСтресс хэвээр байвал хоол дараагийн удаа дахиад ойрхон санагдана\nЯагаад ингэж хэлж байна вэ?\nТа стресс, санаа зовнил, уурын дараа идэх хүсэл нэмэгдэж, идсэний дараа хэсэг тайвширдаг гэж хариулсан.\nГол буруу ойлголт\nАсуудал хоолондоо биш. Стресс өндөр үед хоол хамгийн ойр амсхийх газар шиг санагдаж байна.\nОдоохондоо хэт яарахгүй зүйлс\n- Илүү хатуу хоолны дэглэмийг бэлэн шийдэл болгох\n- Стрессийн мөчид зөвхөн тэвчих гэж шахах\n- Гэмшлээр өөрийгөө хөдөлгөх\n- Мэдрэмжээ огт нэрлэхгүй орхих\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол хоолноос өмнө өөрийгөө хорих биш. 60 секунд зогсоод “өлсөж байна уу, амрах газар хайж байна уу?” гэж ялга.\n14 хоногийн туршилт\nЭхний 3 өдөр: идэх хүсэл стрессийн дараа гарсан эсэхийг л тэмдэглэ. Засах гэж бүү оролд.\n4-10 дахь өдөр: хоолноос өмнө 60 секунд амьсгаа авах, ус уух, алхах, хүн рүү бичихээс нэгийг турш.\n11-14 дахь өдөр: аль богино амралт хамгийн бодитой байсныг сонго.\nХэрвээ нэг өдөр алгасвал: тэр өдрийг бүтэлгүйтэл гэж үзэхгүй. Дараагийн стрессийн мөч дээр дахин 60 секундээс эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Стрессийн дараа идэх хүсэл хэдэн удаа гарч байна вэ?\n- Идсэний дараа үнэхээр тайвширч байна уу, эсвэл гэмшил нэмэгдэж байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2889 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-49/OWNER_REVIEW_PACK_WP49.md:25:- one-time, seven-day, and upgrade access helpers |
| 2890 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-05.json:43:  "detailedReportText": "Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nӨдөржин бусдын хэрэгцээ түрүүлсэн өдөр өөрийн хоол, амралт хамгийн сүүлд үлддэг.\nОрой болоход амттай зүйл зүгээр нэг амттан биш, өөртөө өгч байгаа жижигхэн анхаарал шиг санагдаж болно.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед амттай зүйл өөртөө жаахан анхаарсан мэт мэдрэмж өгч болно.\n- Өөртөө өгөх жижиг таатай мөч\n- Өдөржин хойш тавьсан өөрийгөө санах\n- Оройн ядаргаанд хэсэг амсхийх\nДавтагддаг тойрог\nӨдөр бусдын хэрэгцээ түрүүлнэ ↓\nӨөрийн хоол, амралт хойш тавигдана ↓\nОрой болоход хоосон, ядарсан, гомдолтой мэдрэмж хуримтлагдана ↓\nАмттай зүйл хэсэг таатай мэдрэмж өгнө ↓\nИдсэний дараа хэсэг таатай болно ↓\nДараа нь өөрийгөө буруутгах бодол орж ирж магадгүй ↓\nМаргааш өөрийн хоол дахин хойшлогдвол энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагддаг гэж хариулсан.\nГол буруу ойлголт\nАсуудал амттай юманд дуртайдаа биш. Өөрийн хоол, амралт өдөржин хойшлогдохоор орой амттай зүйл илүү үнэ цэнтэй санагддаг.\nОдоохондоо хэт яарахгүй зүйлс\n- “Зүгээр өөртөө цаг гарга” гэсэн ерөнхий зөвлөгөө\n- Өөрийн хоолыг үлдэгдэл цагт найдах\n- Оройн өөрийгөө баярлуулах хэрэгцээг шууд бүрэн хорих\n- Хэт хатуу хоолны дэглэм\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол “өөртөө цаг гарга” гэсэн том зөвлөгөө биш. Өдөр бүр өөрийн хоол эсвэл амралтын 10 минутыг үлдэгдэл цагт найдахгүй хамгаалах.\n14 хоногийн туршилт\nЭхний 3 өдөр: өдөрт өөрийн төлөө хамгаалж болох хамгийн жижиг 10 минутыг сонго.\n4-10 дахь өдөр: тэр 10 минутыг хоол, цай, алхалт, тайван суухын аль нэгээр ашигла.\n11-14 дахь өдөр: өөрийн 10 минуттай өдөр оройн идэх хүсэл яаж өөрчлөгдсөнийг тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: өөрийгөө буруутгахгүй. Дараагийн өдөр дахин 10 минутаас эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Өөрийн хоол, амралт хойшлогдсон өдөр оройн идэх хүсэл ямар байна вэ?\n- 10 минут хамгаалсан өдөр өөр санагдаж байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2891 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-05.json:44:  "fullReportText": "Тайлан\nТаны тайлан бэлэн боллоо\nДоорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.\nТовч хариу\n1. Таны гол гацдаг мөч\nӨдөржин өөрийгөө хойш тавьсан өдөр орой амттай зүйл өөртөө өгч байгаа жижигхээн шагнал шиг л санагддаг.\n2. Энэ юу гэсэн үг вэ?\n- Энэ нь зүгээр амттан хүссэн асуудал биш.\n- Өөрийн хоол, амралт, таатай зүйл өдөржин хойшлогдож байна.\n- Орой хоол “надад ч гэсэн нэг юм хэрэгтэй” гэсэн мэдрэмжтэй холбогдож байна.\n3. Эхлээд хийх нэг жижиг зүйл\nӨдөр бүр өөрийн хоол эсвэл амралтын 10 минутыг үлдэгдэл цагт найдахгүй хамгаал.\n4. Одоогоор түр болгоомжлох зүйл\nОройн амттай зүйл хүсэхийг шууд бүрэн хорихоос түр зайлсхий.\nДэлгэрэнгүй тайлан\nДоорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nӨдөржин бусдын хэрэгцээ түрүүлсэн өдөр өөрийн хоол, амралт хамгийн сүүлд үлддэг.\nОрой болоход амттай зүйл зүгээр нэг амттан биш, өөртөө өгч байгаа жижигхэн анхаарал шиг санагдаж болно.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед амттай зүйл өөртөө жаахан анхаарсан мэт мэдрэмж өгч болно.\n- Өөртөө өгөх жижиг таатай мөч\n- Өдөржин хойш тавьсан өөрийгөө санах\n- Оройн ядаргаанд хэсэг амсхийх\nДавтагддаг тойрог\nӨдөр бусдын хэрэгцээ түрүүлнэ ↓\nӨөрийн хоол, амралт хойш тавигдана ↓\nОрой болоход хоосон, ядарсан, гомдолтой мэдрэмж хуримтлагдана ↓\nАмттай зүйл хэсэг таатай мэдрэмж өгнө ↓\nИдсэний дараа хэсэг таатай болно ↓\nДараа нь өөрийгөө буруутгах бодол орж ирж магадгүй ↓\nМаргааш өөрийн хоол дахин хойшлогдвол энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагддаг гэж хариулсан.\nГол буруу ойлголт\nАсуудал амттай юманд дуртайдаа биш. Өөрийн хоол, амралт өдөржин хойшлогдохоор орой амттай зүйл илүү үнэ цэнтэй санагддаг.\nОдоохондоо хэт яарахгүй зүйлс\n- “Зүгээр өөртөө цаг гарга” гэсэн ерөнхий зөвлөгөө\n- Өөрийн хоолыг үлдэгдэл цагт найдах\n- Оройн өөрийгөө баярлуулах хэрэгцээг шууд бүрэн хорих\n- Хэт хатуу хоолны дэглэм\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол “өөртөө цаг гарга” гэсэн том зөвлөгөө биш. Өдөр бүр өөрийн хоол эсвэл амралтын 10 минутыг үлдэгдэл цагт найдахгүй хамгаалах.\n14 хоногийн туршилт\nЭхний 3 өдөр: өдөрт өөрийн төлөө хамгаалж болох хамгийн жижиг 10 минутыг сонго.\n4-10 дахь өдөр: тэр 10 минутыг хоол, цай, алхалт, тайван суухын аль нэгээр ашигла.\n11-14 дахь өдөр: өөрийн 10 минуттай өдөр оройн идэх хүсэл яаж өөрчлөгдсөнийг тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: өөрийгөө буруутгахгүй. Дараагийн өдөр дахин 10 минутаас эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Өөрийн хоол, амралт хойшлогдсон өдөр оройн идэх хүсэл ямар байна вэ?\n- 10 минут хамгаалсан өдөр өөр санагдаж байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2892 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-49/paid-first-gate-emergency-summary.md:15:Additional risk existed from restored local state: saved `stage1`, `preliminary`, `report`, `diary`, or `reportReady` views could be rendered before access was checked. |
| 2893 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-08.json:54:  "detailedReportText": "Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nСарын тэмдэг ирэхээс өмнөх хэдэн өдөрт амттай зүйл хүсэх, ядрах, нойр муудах, сэтгэл савлах зэрэг хамт ирж байна.\nЭнэ нь “би сул байна” гэсэн дүгнэлт биш. Зарим хүнд тэр үед өлсөх, амттай юм хүсэх, ядрах, сэтгэл савлах нь илүү мэдрэгддэг.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед амттай зүйл ядаргаа, сэтгэл савлах мэдрэмжийг хэсэг зөөллөх шиг санагдаж болно.\n- Амттай зүйлээр түр таатай мэдрэмж авах\n- Ядаргаа, сэтгэл савлах мэдрэмжийг зөөллөх\n- Тухайн өдөр бие, сэтгэлээ анзаарах\nДавтагддаг тойрог\nСарын тэмдэг ирэхийн өмнөх хэдэн өдөр ойртно ↓\nЯдаргаа, сэтгэл савлах, амттай зүйл хүсэх мэдрэмж нэмэгдэнэ ↓\nХэт хатуу барих гэж оролдвол хүсэл улам хүчтэй санагдана ↓\nАмттай зүйл түр таатай мэдрэмж өгнө ↓\nДараа нь өөрийгөө буруутгах бодол орж ирж магадгүй ↓\nДараагийн удаа зөөлөн төлөвлөгөө байхгүй бол энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа сарын тэмдэг ирэхээс өмнөх өдрүүдэд амттай зүйл хүсэх, ядаргаа, сэтгэл савлах нэмэгддэг гэж тэмдэглэсэн.\nГол буруу ойлголт\nАсуудал амттай юм хүссэндээ биш. Сарын тэмдэг ирэхийн өмнөх өдрүүдэд бие, сэтгэл, тэнхээ, идэх хүсэл хамт өөрчлөгдөж болох тул тэр өдрүүдийг жирийн өдрүүдтэй адил хатуу дүрмээр барих нь хүндрэл үүсгэж магадгүй.\nОдоохондоо хэт яарахгүй зүйлс\n- Сарын тэмдэг ирэхийн өмнөх өдрүүдэд хэт хатуу хоолны дүрэм эхлүүлэх\n- Тэр өдрүүдийн өлсөлт, амттай зүйл хүсэх мэдрэмжийг зөвхөн сахилга бат гэж тайлбарлах\n- Хавагналт, жингийн түр өөрчлөлтийг өөх нэмэгдсэн гэж шууд дүгнэх\n- Амттай бүхнийг бүрэн хорих\n- Өөрийгөө баярлуулах хэрэгцээг огт төлөвлөхгүй байх\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол тэр өдрүүдэд өөрийгөө илүү чанга барих биш. Харин тогтмол хоол, урьдчилж сонгосон жижиг амттай сонголт, өөрийгөө буруутгахгүй тэмдэглэл бэлдэх.\n14 хоногийн туршилт\nЭхний 3 өдөр: мөчлөгтэй холбоотой байж болох өдрүүдэд өлсөлт, амттай зүйл хүсэх, ядаргаа, сэтгэл санаагаа л тэмдэглэ.\n4-10 дахь өдөр: тэр өдрүүдэд хэт хатуу дүрэм эхлүүлэхгүй. Тогтмол хоол, нэг жижиг амттай сонголт, амрах 10 минут бэлд.\n11-14 дахь өдөр: зөөлөн төлөвлөгөөтэй өдөр, огцом хориг тавьсан өдөр хоёрын ялгааг анзаар.\nХэрвээ нэг өдөр алгасвал: “би сул байна” гэж дүгнэхгүй. Дараагийн өдөр тогтмол хоол болон зөөлөн сонголт руугаа буц.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Сарын тэмдэг ирэхийн өмнөх өдрүүдэд идэх хүсэл хэр өөр байна вэ?\n- Ядаргаа, нойр, сэтгэл санаа хамт өөрчлөгдөж байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2894 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-08.json:55:  "fullReportText": "Тайлан\nТаны тайлан бэлэн боллоо\nДоорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.\nТовч хариу\n1. Таны гол гацдаг мөч\nСарын тэмдэг ирэхээс өмнөх хэдэн өдөрт амттай юм илүү хүчтэй татдаг байж магадгүй.\n2. Энэ юу гэсэн үг вэ?\n- Энэ нь онош биш, таны сул тал гэсэн үг биш.\n- Зарим хүнд тэр өдрүүдэд өлсөх, амттай юм хүсэх, тэнхээ унах, сэтгэл савлах нь илүү мэдрэгддэг.\n- Ийм үед хэт хатуу дүрэм тавих нь дараа нь илүү хэцүү болгож магадгүй.\n3. Эхлээд хийх нэг жижиг зүйл\nСарын тэмдэг ирэхийн өмнөх өдрүүдэд хэт хатуу эхлэхийн оронд тогтмол хоол, урьдчилсан жижиг амттай сонголт, өөрийгөө буруутгахгүй тэмдэглэл бэлд.\n4. Одоогоор түр болгоомжлох зүйл\nТэр өдрүүдийн өлсөлт, амттай зүйл хүсэх мэдрэмжийг зөвхөн сахилга бат гэж тайлбарлахаас түр зайлсхий.\nДэлгэрэнгүй тайлан\nДоорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nСарын тэмдэг ирэхээс өмнөх хэдэн өдөрт амттай зүйл хүсэх, ядрах, нойр муудах, сэтгэл савлах зэрэг хамт ирж байна.\nЭнэ нь “би сул байна” гэсэн дүгнэлт биш. Зарим хүнд тэр үед өлсөх, амттай юм хүсэх, ядрах, сэтгэл савлах нь илүү мэдрэгддэг.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед амттай зүйл ядаргаа, сэтгэл савлах мэдрэмжийг хэсэг зөөллөх шиг санагдаж болно.\n- Амттай зүйлээр түр таатай мэдрэмж авах\n- Ядаргаа, сэтгэл савлах мэдрэмжийг зөөллөх\n- Тухайн өдөр бие, сэтгэлээ анзаарах\nДавтагддаг тойрог\nСарын тэмдэг ирэхийн өмнөх хэдэн өдөр ойртно ↓\nЯдаргаа, сэтгэл савлах, амттай зүйл хүсэх мэдрэмж нэмэгдэнэ ↓\nХэт хатуу барих гэж оролдвол хүсэл улам хүчтэй санагдана ↓\nАмттай зүйл түр таатай мэдрэмж өгнө ↓\nДараа нь өөрийгөө буруутгах бодол орж ирж магадгүй ↓\nДараагийн удаа зөөлөн төлөвлөгөө байхгүй бол энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа сарын тэмдэг ирэхээс өмнөх өдрүүдэд амттай зүйл хүсэх, ядаргаа, сэтгэл савлах нэмэгддэг гэж тэмдэглэсэн.\nГол буруу ойлголт\nАсуудал амттай юм хүссэндээ биш. Сарын тэмдэг ирэхийн өмнөх өдрүүдэд бие, сэтгэл, тэнхээ, идэх хүсэл хамт өөрчлөгдөж болох тул тэр өдрүүдийг жирийн өдрүүдтэй адил хатуу дүрмээр барих нь хүндрэл үүсгэж магадгүй.\nОдоохондоо хэт яарахгүй зүйлс\n- Сарын тэмдэг ирэхийн өмнөх өдрүүдэд хэт хатуу хоолны дүрэм эхлүүлэх\n- Тэр өдрүүдийн өлсөлт, амттай зүйл хүсэх мэдрэмжийг зөвхөн сахилга бат гэж тайлбарлах\n- Хавагналт, жингийн түр өөрчлөлтийг өөх нэмэгдсэн гэж шууд дүгнэх\n- Амттай бүхнийг бүрэн хорих\n- Өөрийгөө баярлуулах хэрэгцээг огт төлөвлөхгүй байх\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол тэр өдрүүдэд өөрийгөө илүү чанга барих биш. Харин тогтмол хоол, урьдчилж сонгосон жижиг амттай сонголт, өөрийгөө буруутгахгүй тэмдэглэл бэлдэх.\n14 хоногийн туршилт\nЭхний 3 өдөр: мөчлөгтэй холбоотой байж болох өдрүүдэд өлсөлт, амттай зүйл хүсэх, ядаргаа, сэтгэл санаагаа л тэмдэглэ.\n4-10 дахь өдөр: тэр өдрүүдэд хэт хатуу дүрэм эхлүүлэхгүй. Тогтмол хоол, нэг жижиг амттай сонголт, амрах 10 минут бэлд.\n11-14 дахь өдөр: зөөлөн төлөвлөгөөтэй өдөр, огцом хориг тавьсан өдөр хоёрын ялгааг анзаар.\nХэрвээ нэг өдөр алгасвал: “би сул байна” гэж дүгнэхгүй. Дараагийн өдөр тогтмол хоол болон зөөлөн сонголт руугаа буц.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Сарын тэмдэг ирэхийн өмнөх өдрүүдэд идэх хүсэл хэр өөр байна вэ?\n- Ядаргаа, нойр, сэтгэл санаа хамт өөрчлөгдөж байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2895 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/work-pack-3-recommendation.md:153:- add fixture snapshots for one-time versus seven-day evidence quality |
| 2896 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-04.json:41:  "detailedReportText": "Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nӨдөр удаан хоосон явсны дараа оройн өлсөлт огцом нэмэгддэг.\nТэр үед “дараа дахиад өлсөх вий” гэсэн бодол амархан орж ирдэг.\nИйм үед илүү идэх нь сул тал биш, биеийн хамгаалах оролдлого байж болно.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед хоол биеийг тайвшруулж, дараа дахиад өлсөх вий гэсэн айдсыг намдаадаг.\n- Дараа дахиад өлсөхөөс айхгүй болох\n- Биеэ тайван болгох\n- Оройн хүчтэй өлсөлтийг намдаах\nДавтагддаг тойрог\nӨдөр хоол холдоно ↓\nОрой өлсөлт, яаралтай мэдрэмж нэмэгдэнэ ↓\n“Дараа дахиад өлсөх вий” гэж бодогдоно ↓\nБэлэн байгаа хоол илүү татна ↓\nИлүү их идсэний дараа бие түр тайвширна ↓\nМаргааш дахин хасвал орой энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа хоолны зай уртсах үед орой хүчтэй өлсөж, дараа дахин өлсөхөөс санаа зовдог гэж тэмдэглэсэн.\nГол буруу ойлголт\nАсуудал орой идсэндээ биш. Өдөр хоолны зай хэт уртсах үед оройн өлсөлт илүү хүчтэй болдог.\nОдоохондоо хэт яарахгүй зүйлс\n- Урт мацаг\n- Өдөр хоол алгасах\n- “Өлсвөл тэс” гэж өөрийгөө хүчлэх\n- Оройн зуушийг шууд бүрэн хорих\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол оройг хорих биш. Өдрийн хоолны зайг хэт холдуулахгүй нэг тулгуур хоол, нэг жижиг гүүр сонголт бэлдэх.\n14 хоногийн туршилт\nЭхний 3 өдөр: хоол хооронд хэдэн цагийн зай гарч байгааг л тэмдэглэ.\n4-10 дахь өдөр: 5 цагаас дээш зай гарахаас өмнө жижиг гүүр хоол ашигла.\n11-14 дахь өдөр: оройн өлсөлт яаралтай санагдах нь багассан эсэхийг тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: оройг шийтгэл болгохгүй. Дараагийн өдөр нэг тулгуур хоолноос эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Хоолны зай хэдэн цаг болоход орой яаралтай өлсөж байна вэ?\n- Жижиг гүүр хоол хэрэглэсэн өдөр орой ямар өөр байна вэ?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2897 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-04.json:42:  "fullReportText": "Тайлан\nТаны тайлан бэлэн боллоо\nДоорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.\nТовч хариу\n1. Таны гол гацдаг мөч\nУдаан юм идээгүй өдөр орой гэнэт өлсөж байгаагаа анзаардаг.\n2. Энэ юу гэсэн үг вэ?\n- Өдрийн хоолны зай уртсах тусам оройн өлсөлт илүү хүчтэй мэдрэгддэг.\n- Дараа хэзээ идэх нь тодорхойгүй санагдах үед илүү идэх нь хамгаалах оролдлого байж болно.\n- Энэ нь сул тал биш. Өдөр хоолны зай хэт урт байсны дараах хариу байж болно.\n3. Эхлээд хийх нэг жижиг зүйл\n5 цагаас дээш зай гарахаас өмнө жижиг гүүр хоол эсвэл зууш төлөвлө.\n4. Одоогоор түр болгоомжлох зүйл\nӨдөр хоол алгасаад орой өөрийгөө тэс гэж шахахаас түр зайлсхий.\nДэлгэрэнгүй тайлан\nДоорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nӨдөр удаан хоосон явсны дараа оройн өлсөлт огцом нэмэгддэг.\nТэр үед “дараа дахиад өлсөх вий” гэсэн бодол амархан орж ирдэг.\nИйм үед илүү идэх нь сул тал биш, биеийн хамгаалах оролдлого байж болно.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед хоол биеийг тайвшруулж, дараа дахиад өлсөх вий гэсэн айдсыг намдаадаг.\n- Дараа дахиад өлсөхөөс айхгүй болох\n- Биеэ тайван болгох\n- Оройн хүчтэй өлсөлтийг намдаах\nДавтагддаг тойрог\nӨдөр хоол холдоно ↓\nОрой өлсөлт, яаралтай мэдрэмж нэмэгдэнэ ↓\n“Дараа дахиад өлсөх вий” гэж бодогдоно ↓\nБэлэн байгаа хоол илүү татна ↓\nИлүү их идсэний дараа бие түр тайвширна ↓\nМаргааш дахин хасвал орой энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа хоолны зай уртсах үед орой хүчтэй өлсөж, дараа дахин өлсөхөөс санаа зовдог гэж тэмдэглэсэн.\nГол буруу ойлголт\nАсуудал орой идсэндээ биш. Өдөр хоолны зай хэт уртсах үед оройн өлсөлт илүү хүчтэй болдог.\nОдоохондоо хэт яарахгүй зүйлс\n- Урт мацаг\n- Өдөр хоол алгасах\n- “Өлсвөл тэс” гэж өөрийгөө хүчлэх\n- Оройн зуушийг шууд бүрэн хорих\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол оройг хорих биш. Өдрийн хоолны зайг хэт холдуулахгүй нэг тулгуур хоол, нэг жижиг гүүр сонголт бэлдэх.\n14 хоногийн туршилт\nЭхний 3 өдөр: хоол хооронд хэдэн цагийн зай гарч байгааг л тэмдэглэ.\n4-10 дахь өдөр: 5 цагаас дээш зай гарахаас өмнө жижиг гүүр хоол ашигла.\n11-14 дахь өдөр: оройн өлсөлт яаралтай санагдах нь багассан эсэхийг тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: оройг шийтгэл болгохгүй. Дараагийн өдөр нэг тулгуур хоолноос эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Хоолны зай хэдэн цаг болоход орой яаралтай өлсөж байна вэ?\n- Жижиг гүүр хоол хэрэглэсэн өдөр орой ямар өөр байна вэ?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2898 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/driver-stack-calculator-notes.md:35:- `buildSevenDayConfirmationTargets(driverScores, vulnerableMoment)` |
| 2899 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/driver-stack-calculator-notes.md:127:- `diaryEntries` |
| 2900 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/driver-stack-calculator-notes.md:155:- `seven_day_diary_confirmation_targets` |
| 2901 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-07.json:41:  "detailedReportText": "Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nНойр муу өдөр орой амттай юм илүү хүчтэй татдаг.\nӨдөржин бие сул явахад орой хурдан, амттай зүйл илүү ойр санагдана.\nТиймээс эхлэл нь зөвхөн хоол хорих биш. Өдрийн сүүлийн кофегоо хэзээ уух, орой 10 минут тайвшрах хугацаатай хамт явна.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед амттай зүйл ядарсан биед хурдан тэнхээ өгөх шиг санагдаж болно.\n- Оройн сулралыг хэсэг намдаах\n- Нойр дутуу өдрийн ядралтад хурдан хариу өгөх\n- Хоосон, сул мэдрэмжийг зөөллөх\nДавтагддаг тойрог\nНойр дутуу эсвэл чанар муутай хононо ↓\nӨдөр тэнхээ бага, кофе эсвэл амттай зүйл илүү татна ↓\nОрой болоход бие амархан сулрана ↓\nАмттай, тослог, хурдан зүйл илүү хүчтэй санагдана ↓\nИдсэний дараа түр тэнхээ орсон мэт болно ↓\nХэмнэл өөрчлөгдөхгүй бол маргааш энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа нойр муу үед амттай зүйл илүү татдаг, орой тэнхээ багасдаг гэж хариулсан.\nГол буруу ойлголт\nАсуудал амттай юм хүссэндээ биш байж магадгүй. Нойр, өдрийн сүүлийн кофе, өдрийн эхний хоол, оройн сулрал хамт нөлөөлж байна.\nОдоохондоо хэт яарахгүй зүйлс\n- Оройн хоолыг шууд бүрэн хорих\n- Орой кофе уух\n- Өглөө/өдөр хоол алгасаад орой тэсэх\n- Нойр муу үед хатуу хоолны дэглэм эхлүүлэх\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол амттай зүйлээ шууд хорих биш. Өдрийн эхний хоолоо тогтмол болго. Өдрийн сүүлийн кофегоо хэзээ уухаа тогтоо. Орой 10 минут тайвшрах хугацаа гарга.\n14 хоногийн туршилт\nЭхний 3 өдөр: нойр, сүүлийн кофе уусан цаг, оройн тэнхээг л тэмдэглэ.\n4-10 дахь өдөр: Өдрийн эхний хоолоо тогтмол болго. Өдрийн сүүлийн кофегоо хэзээ уухаа тогтоо. Орой 10 минут тайвшрах хугацаа гарга.\n11-14 дахь өдөр: нойр муу өдөр амттай юм руу татагдах хүч өөрчлөгдсөн эсэхийг тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: нойр муу өдөр өөрийгөө шийтгэхгүй. Дараагийн орой 10 минутын зан үйлээс эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Нойр муу өдөр амттай юм руу татах хүч ямар байна вэ?\n- Өдрийн сүүлийн кофегоо уух цаг, оройн 10 минут тус болж байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2902 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-07.json:42:  "fullReportText": "Тайлан\nТаны тайлан бэлэн боллоо\nДоорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.\nТовч хариу\n1. Таны гол гацдаг мөч\nНойр муу өдөр орой амттай юм илүү хүчтэй татдаг.\n2. Энэ юу гэсэн үг вэ?\n- Энэ нь зөвхөн дуршил биш байж болно.\n- Өдөржин бие сул явахад хурдан, амттай зүйл илүү ойр санагддаг.\n- Нойр, өдрийн сүүлийн кофе, өглөөний хоолгүй эхлэх зэрэг нь оройн хүсэлтэй хамт явж байна.\n3. Эхлээд хийх нэг жижиг зүйл\nӨдрийн эхний хоолоо тогтмол болго. Өдрийн сүүлийн кофегоо хэзээ уухаа тогтоо. Орой 10 минут тайвшрах хугацаа гарга.\n4. Одоогоор түр болгоомжлох зүйл\nНойр муу өдөр хатуу хоолны дэглэм эхлүүлэхээс түр зайлсхий.\nДэлгэрэнгүй тайлан\nДоорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nНойр муу өдөр орой амттай юм илүү хүчтэй татдаг.\nӨдөржин бие сул явахад орой хурдан, амттай зүйл илүү ойр санагдана.\nТиймээс эхлэл нь зөвхөн хоол хорих биш. Өдрийн сүүлийн кофегоо хэзээ уух, орой 10 минут тайвшрах хугацаатай хамт явна.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед амттай зүйл ядарсан биед хурдан тэнхээ өгөх шиг санагдаж болно.\n- Оройн сулралыг хэсэг намдаах\n- Нойр дутуу өдрийн ядралтад хурдан хариу өгөх\n- Хоосон, сул мэдрэмжийг зөөллөх\nДавтагддаг тойрог\nНойр дутуу эсвэл чанар муутай хононо ↓\nӨдөр тэнхээ бага, кофе эсвэл амттай зүйл илүү татна ↓\nОрой болоход бие амархан сулрана ↓\nАмттай, тослог, хурдан зүйл илүү хүчтэй санагдана ↓\nИдсэний дараа түр тэнхээ орсон мэт болно ↓\nХэмнэл өөрчлөгдөхгүй бол маргааш энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа нойр муу үед амттай зүйл илүү татдаг, орой тэнхээ багасдаг гэж хариулсан.\nГол буруу ойлголт\nАсуудал амттай юм хүссэндээ биш байж магадгүй. Нойр, өдрийн сүүлийн кофе, өдрийн эхний хоол, оройн сулрал хамт нөлөөлж байна.\nОдоохондоо хэт яарахгүй зүйлс\n- Оройн хоолыг шууд бүрэн хорих\n- Орой кофе уух\n- Өглөө/өдөр хоол алгасаад орой тэсэх\n- Нойр муу үед хатуу хоолны дэглэм эхлүүлэх\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол амттай зүйлээ шууд хорих биш. Өдрийн эхний хоолоо тогтмол болго. Өдрийн сүүлийн кофегоо хэзээ уухаа тогтоо. Орой 10 минут тайвшрах хугацаа гарга.\n14 хоногийн туршилт\nЭхний 3 өдөр: нойр, сүүлийн кофе уусан цаг, оройн тэнхээг л тэмдэглэ.\n4-10 дахь өдөр: Өдрийн эхний хоолоо тогтмол болго. Өдрийн сүүлийн кофегоо хэзээ уухаа тогтоо. Орой 10 минут тайвшрах хугацаа гарга.\n11-14 дахь өдөр: нойр муу өдөр амттай юм руу татагдах хүч өөрчлөгдсөн эсэхийг тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: нойр муу өдөр өөрийгөө шийтгэхгүй. Дараагийн орой 10 минутын зан үйлээс эхэл.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Нойр муу өдөр амттай юм руу татах хүч ямар байна вэ?\n- Өдрийн сүүлийн кофегоо уух цаг, оройн 10 минут тус болж байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2903 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-4/report-object-notes.md:51:- `sevenDayDiaryConfirmation` |
| 2904 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-06.json:40:  "detailedReportText": "Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nЗууш нүдэнд ойр байхаар гар өөрөө хүрчихдэг үе байна.\nАпп нээгдэх, хоолны зураг харагдах, үнэр ойртох үед өлсөөгүй байсан ч идмээр болдог.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед өлссөндөө биш, нүдэнд өртсөн зүйлд гар амархан хүрч байна.\n- Харагдсан зүйлд шууд хариу өгөх\n- Бодолгүйгээр хурдан таатай мэдрэмж авах\n- Гарын дор байгаа амар сонголтыг ашиглах\nДавтагддаг тойрог\nЗууш, үнэр, зураг эсвэл захиалгын апп ойр байна ↓\nӨлсөөгүй байсан ч идэх бодол орж ирнэ ↓\n“Нэгийг авчихъя” гэсэн жижиг шийдвэр хурдан гарна ↓\nИдсэний дараа түр таатай мэдрэмж өгнө ↓\nТэр зүйл нүдэнд ойр хэвээр байвал дараа нь дахиад амархан хүрнэ\nЯагаад ингэж хэлж байна вэ?\nТа хоол харагдах, үнэртэх, захиалгын апп харахад идэх хүсэл нэмэгддэг гэж тэмдэглэсэн.\nГол буруу ойлголт\nАсуудал хүсэл зориг сулдаа биш. Нүдэнд ойр, гарын дор байгаа зүйлд хүн амархан хүрдэг.\nОдоохондоо хэт яарахгүй зүйлс\n- Бүх амттай зүйлийг нэг дор хорих\n- Гарын дорх зүйлийг хэвээр үлдээгээд зөвхөн тэвчих\n- Өдөр бүр бүх орчноо төгс өөрчлөх гэж зүтгэх\n- Өлсөөгүй идсэнээ зан чанарын алдаа гэж үзэх\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол бүх амттай зүйлийг хорих биш. Хамгийн хүчтэй татдаг нэг зүйлийг нэг алхам холдуул. Оронд нь илүү тохирох нэг сонголтыг ойр тавь.\n14 хоногийн туршилт\nЭхний 3 өдөр: хамгийн их татдаг нэг зүйлийг сонго. Жишээ нь ширээн дээрх зууш, захиалгын апп, амттаны шургуулга.\n4-10 дахь өдөр: тэр зүйлийг нэг алхам холдуул. Оронд нь өөрт тохирох нэг амар сонголтыг ойр тавь.\n11-14 дахь өдөр: “хараад идмээр болсон уу?” гэдгээ өдөрт нэг удаа тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: бүх орчноо өөрчлөх гэж зүтгэхгүй. Зөвхөн нэг зүйл рүүгээ буц.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Нүдэнд ойр байгаа нэг зүйл идэх хүслийг хэдэн удаа эхлүүлж байна вэ?\n- Тэр зүйлийг холдуулсан өдөр ялгаа гарч байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2905 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-06.json:41:  "fullReportText": "Тайлан\nТаны тайлан бэлэн боллоо\nДоорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.\nТовч хариу\n1. Таны гол гацдаг мөч\nЗууш нүдэнд ойр байхаар гар өөрөө хүрчихдэг үе байна.\n2. Энэ юу гэсэн үг вэ?\n- Энд гол нь хүсэл зориг сулдаа биш.\n- Ойр байгаа хоол, үнэр, зураг, захиалгын апп идэх бодлыг түрүүлж оруулдаг.\n- Харагдах зүйл ойр байх тусам идэх бодол хурдан орж ирдэг.\n3. Эхлээд хийх нэг жижиг зүйл\nХамгийн хүчтэй татдаг нэг зүйлийг нэг алхам холдуул.\n4. Одоогоор түр болгоомжлох зүйл\nБүх хоолоо хорих гэж оролдохоос илүү нүдэнд ойр байгаа нэг зүйлээ өөрчил.\nДэлгэрэнгүй тайлан\nДоорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nЗууш нүдэнд ойр байхаар гар өөрөө хүрчихдэг үе байна.\nАпп нээгдэх, хоолны зураг харагдах, үнэр ойртох үед өлсөөгүй байсан ч идмээр болдог.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед өлссөндөө биш, нүдэнд өртсөн зүйлд гар амархан хүрч байна.\n- Харагдсан зүйлд шууд хариу өгөх\n- Бодолгүйгээр хурдан таатай мэдрэмж авах\n- Гарын дор байгаа амар сонголтыг ашиглах\nДавтагддаг тойрог\nЗууш, үнэр, зураг эсвэл захиалгын апп ойр байна ↓\nӨлсөөгүй байсан ч идэх бодол орж ирнэ ↓\n“Нэгийг авчихъя” гэсэн жижиг шийдвэр хурдан гарна ↓\nИдсэний дараа түр таатай мэдрэмж өгнө ↓\nТэр зүйл нүдэнд ойр хэвээр байвал дараа нь дахиад амархан хүрнэ\nЯагаад ингэж хэлж байна вэ?\nТа хоол харагдах, үнэртэх, захиалгын апп харахад идэх хүсэл нэмэгддэг гэж тэмдэглэсэн.\nГол буруу ойлголт\nАсуудал хүсэл зориг сулдаа биш. Нүдэнд ойр, гарын дор байгаа зүйлд хүн амархан хүрдэг.\nОдоохондоо хэт яарахгүй зүйлс\n- Бүх амттай зүйлийг нэг дор хорих\n- Гарын дорх зүйлийг хэвээр үлдээгээд зөвхөн тэвчих\n- Өдөр бүр бүх орчноо төгс өөрчлөх гэж зүтгэх\n- Өлсөөгүй идсэнээ зан чанарын алдаа гэж үзэх\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол бүх амттай зүйлийг хорих биш. Хамгийн хүчтэй татдаг нэг зүйлийг нэг алхам холдуул. Оронд нь илүү тохирох нэг сонголтыг ойр тавь.\n14 хоногийн туршилт\nЭхний 3 өдөр: хамгийн их татдаг нэг зүйлийг сонго. Жишээ нь ширээн дээрх зууш, захиалгын апп, амттаны шургуулга.\n4-10 дахь өдөр: тэр зүйлийг нэг алхам холдуул. Оронд нь өөрт тохирох нэг амар сонголтыг ойр тавь.\n11-14 дахь өдөр: “хараад идмээр болсон уу?” гэдгээ өдөрт нэг удаа тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: бүх орчноо өөрчлөх гэж зүтгэхгүй. Зөвхөн нэг зүйл рүүгээ буц.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Нүдэнд ойр байгаа нэг зүйл идэх хүслийг хэдэн удаа эхлүүлж байна вэ?\n- Тэр зүйлийг холдуулсан өдөр ялгаа гарч байна уу?\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2906 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-6/copy-architecture-principles.md:72:\| `sevenDayDiaryConfirmation` \| 7 хоногийн баталгаажуулах тэмдэглэл \| Tell the user what to observe, not what to judge. \| |
| 2907 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-6/copy-architecture-principles.md:191:4. Always translate `visibleCondition`, `secondaryDrivers`, `vulnerableMoment`, `hiddenFoodFunction`, `wrongSelfExplanation`, `firstGentleChange`, `fourteenDayExperiment`, and `sevenDayDiaryConfirmation` through an approved copy layer. |
| 2908 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:259:    packageType: "seven-day", |
| 2909 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:263:    diaryEntries: [], |
| 2910 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:335:  const diaryDays = new Set(score.evidence_items.map(item => item.day_number).filter(Boolean)).size; |
| 2911 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:336:  if (score.normalizedScore >= 7 \|\| diaryDays >= 3) return "strong"; |
| 2912 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:337:  if (score.normalizedScore >= 4 \|\| diaryDays >= 2) return "moderate"; |
| 2913 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:578:  (state.diaryEntries \|\| []).forEach(entry => { |
| 2914 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:777:  return match("general_driver_stack", fallback, "Several drivers overlap; diary evidence should clarify which one is easiest to change first.", "seven_day_confirmation"); |
| 2915 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:893:  const [id, targets, action] = map[interactionPattern.id] \|\| ["seven_day_confirmation", [], "Use 7-day diary confirmation before choosing the first change."]; |
| 2916 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:945:export function buildSevenDayConfirmationTargets(driverScores, vulnerableMoment) { |
| 2917 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1044:  const confirmationTargets = buildSevenDayConfirmationTargets(scores, vulnerableMoment); |
| 2918 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1050:      diary_entry_count: (state.diaryEntries \|\| []).length, |
| 2919 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1082:    seven_day_diary_confirmation_targets: confirmationTargets, |
| 2920 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1154:      packageType: "seven-day", |
| 2921 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1159:      diaryEntries: repeat(5, day => entry(day, { |
| 2922 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1186:      packageType: "seven-day", |
| 2923 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1191:      diaryEntries: repeat(5, day => entry(day, { |
| 2924 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1218:      packageType: "seven-day", |
| 2925 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1224:      diaryEntries: repeat(5, day => entry(day, { |
| 2926 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1248:      packageType: "seven-day", |
| 2927 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1254:      diaryEntries: repeat(5, day => entry(day, { |
| 2928 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1280:      packageType: "seven-day", |
| 2929 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1285:      diaryEntries: repeat(5, day => entry(day, { |
| 2930 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1310:      packageType: "seven-day", |
| 2931 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1316:      diaryEntries: repeat(5, day => entry(day, { |
| 2932 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1341:      packageType: "seven-day", |
| 2933 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1346:      diaryEntries: repeat(5, day => entry(day, { |
| 2934 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1385:      diaryEntries: [] |
| 2935 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1415:      diaryEntries: [] |
| 2936 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1432:      packageType: "seven-day", |
| 2937 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1437:      diaryEntries: repeat(2, day => entry(day, { |
| 2938 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1466:      packageType: "seven-day", |
| 2939 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1472:      diaryEntries: repeat(5, day => entry(day, { |
| 2940 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1488:      packageType: "seven-day", |
| 2941 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1493:      diaryEntries: repeat(5, day => entry(day, { |
| 2942 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1527:    buildSevenDayConfirmationTargets |
| 2943 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1540:    buildSevenDayConfirmationTargets |
| 2944 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1570:  assert(Array.isArray(stack.seven_day_diary_confirmation_targets)); |
| 2945 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1571:  assert(stack.seven_day_diary_confirmation_targets.length >= 2); |
| 2946 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1784:    packageType: "seven-day", |
| 2947 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1788:    diaryEntries: [] |
| 2948 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1803:    diaryEntries: [] |
| 2949 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1889:- `buildSevenDayConfirmationTargets(driverScores, vulnerableMoment)` |
| 2950 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:1981:- `diaryEntries` |
| 2951 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:2009:- `seven_day_diary_confirmation_targets` |
| 2952 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-3/OWNER_REVIEW_PACK_WP3.md:2555:- add fixture snapshots for one-time versus seven-day evidence quality |
| 2953 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-01.json:53:  "detailedReportText": "Доорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nОрой болоход “юу идэх вэ?” гэж бодох хүртэл хүнд болдог.\nӨдөржин ажил, гэр, хүмүүс, шийдэх зүйлс ар араасаа өнгөрсөн байна.\nТийм үед бэлэн хоол, захиалга, гарын дорх зууш түрүүлж харагддаг.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед хоол сонгох биш, зүгээр амархан дуусгах зүйл хэрэгтэй болдог.\n- Дахин юм бодохгүй хэсэг амрах\n- Оройн ядаргааг хурдан намдаах\n- Гарын дор байгаа зүйлээр түр амсхийх\nДавтагддаг тойрог\nӨдөржин олон зүйл шийдэж өнгөрнө ↓\nОрой “юу идэх вэ?” гэх асуулт хүртэл хүнд санагдана ↓\nБэлэн хоол түрүүлж нүдэнд тусна ↓\nЗахиалга эсвэл зууш руу амархан орно ↓\nХэсэг амарсан мэт болно ↓\nДараа нь “маргааш өөрөөр хийнэ” гэж бодогдоно ↓\nМаргааш орой бэлэн зам байхгүй бол энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа орой ядарсан үед хоол захиалах эсвэл гэрт байсан амар сонголт руу ордог гэж тэмдэглэсэн.\nГол буруу ойлголт\nГол нь мэдэхгүйдээ биш. Орой тэнхээ дууссан үед энгийн зүйл ч хүнд болдог. Тийм үед хамгийн амар хоол түрүүлж харагддаг.\nОдоохондоо хэт яарахгүй зүйлс\n- Орой олон сонголттой үлдэх\n- Хэт төвөгтэй хоол бэлдэх\n- Өдөр бүр төгс хийх гэж шахах\n- Оройн хоолыг шууд бүрэн хорих\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол орой биш, эртхэн хоёр бэлэн хоол сонгох. Орой ирэхэд шууд ашиглахад амар байх ёстой.\n14 хоногийн туршилт\nЭхний 3 өдөр: орой идэж болох 2 бодит хоолоо сонго. Төгс байх албагүй. Амьдралд таардаг байх нь чухал.\n4-10 дахь өдөр: ядарсан орой тэр хоёрын аль нэгийг хэрэглэ. Захиалга авсан өдөр ч өөрийгөө шийтгэхгүй.\n11-14 дахь өдөр: аль хоол хамгийн бага бодол шаардсаныг тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: маргааш илүү чанга барих биш, бэлэн хоёр сонголт руугаа буц.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Орой хоол бодох хамгийн хүнд өдөр аль нь вэ?\n- Нойр, ажил, гэрийн ачаалалтай давхцах эсэхийг ялгана.\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2954 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/raw/user-01.json:54:  "fullReportText": "Тайлан\nТаны тайлан бэлэн боллоо\nДоорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.\nТовч хариу\n1. Таны гол гацдаг мөч\nОрой болоход “юу идэх вэ?” гэж бодох хүртэл хүнд болдог.\n2. Энэ юу гэсэн үг вэ?\n- Та юу хийхээ мэдэхгүйдээ биш.\n- Өдөржин олон зүйл хийсний дараа хоол сонгох хүртэл хүнд болдог.\n- Тэр үед хамгийн амар зүйл түрүүлдэг.\n3. Эхлээд хийх нэг жижиг зүйл\nОрой биш, эртхэн 2 бэлэн хоолны сонголт тогтоо.\n4. Одоогоор түр болгоомжлох зүйл\nЯдарсан орой өөрөөсөө дахин олон шийдвэр шаардах төлөвлөгөөнөөс түр зайлсхий.\nДэлгэрэнгүй тайлан\nДоорх хэсэг илүү дэлгэрэнгүй. Эхний хариу хангалттай санагдвал бүгдийг нь унших албагүй.\nГол зураг\nОрой болоход “юу идэх вэ?” гэж бодох хүртэл хүнд болдог.\nӨдөржин ажил, гэр, хүмүүс, шийдэх зүйлс ар араасаа өнгөрсөн байна.\nТийм үед бэлэн хоол, захиалга, гарын дорх зууш түрүүлж харагддаг.\nТэр мөчид хоол ямар мэдрэмж өгч байна вэ?\nТэр үед хоол сонгох биш, зүгээр амархан дуусгах зүйл хэрэгтэй болдог.\n- Дахин юм бодохгүй хэсэг амрах\n- Оройн ядаргааг хурдан намдаах\n- Гарын дор байгаа зүйлээр түр амсхийх\nДавтагддаг тойрог\nӨдөржин олон зүйл шийдэж өнгөрнө ↓\nОрой “юу идэх вэ?” гэх асуулт хүртэл хүнд санагдана ↓\nБэлэн хоол түрүүлж нүдэнд тусна ↓\nЗахиалга эсвэл зууш руу амархан орно ↓\nХэсэг амарсан мэт болно ↓\nДараа нь “маргааш өөрөөр хийнэ” гэж бодогдоно ↓\nМаргааш орой бэлэн зам байхгүй бол энэ тойрог буцаж ирнэ\nЯагаад ингэж хэлж байна вэ?\nТа орой ядарсан үед хоол захиалах эсвэл гэрт байсан амар сонголт руу ордог гэж тэмдэглэсэн.\nГол буруу ойлголт\nГол нь мэдэхгүйдээ биш. Орой тэнхээ дууссан үед энгийн зүйл ч хүнд болдог. Тийм үед хамгийн амар хоол түрүүлж харагддаг.\nОдоохондоо хэт яарахгүй зүйлс\n- Орой олон сонголттой үлдэх\n- Хэт төвөгтэй хоол бэлдэх\n- Өдөр бүр төгс хийх гэж шахах\n- Оройн хоолыг шууд бүрэн хорих\nЭхний жижиг өөрчлөлт\nЭхний жижиг өөрчлөлт бол орой биш, эртхэн хоёр бэлэн хоол сонгох. Орой ирэхэд шууд ашиглахад амар байх ёстой.\n14 хоногийн туршилт\nЭхний 3 өдөр: орой идэж болох 2 бодит хоолоо сонго. Төгс байх албагүй. Амьдралд таардаг байх нь чухал.\n4-10 дахь өдөр: ядарсан орой тэр хоёрын аль нэгийг хэрэглэ. Захиалга авсан өдөр ч өөрийгөө шийтгэхгүй.\n11-14 дахь өдөр: аль хоол хамгийн бага бодол шаардсаныг тэмдэглэ.\nХэрвээ нэг өдөр алгасвал: маргааш илүү чанга барих биш, бэлэн хоёр сонголт руугаа буц.\n7 хоногийн тэмдэглэл юуг тодруулах вэ?\n- Орой хоол бодох хамгийн хүнд өдөр аль нь вэ?\n- Нойр, ажил, гэрийн ачаалалтай давхцах эсэхийг ялгана.\n7 хоногоор нарийвчлах\nДотоод туршилтын хувилбар — энэ шатанд бодит төлбөр авахгүй.\nТуршилтын санал асуулга\nТа тайлангаа уншаад доорх асуултад үнэнээр нь хариулаарай. Бид энэ мэдээллийг тестийн ойлгомж, найруулга, хэрэгцээг сайжруулахад ашиглана.\nТест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?\nҮгүй\nБага зэрэг\nТийм\nАль хэсэг дээр?\nАсуултууд ойлгомжтой байсан уу?\nМаш ойлгомжтой\nЕрөнхийдөө ойлгомжтой\nЗарим нь ойлгомжгүй\nИхэнх нь ойлгомжгүй\nОйлгомжгүй санагдсан асуулт байвал бичнэ үү.\nТайлан таны нөхцөлтэй хэр нийцсэн бэ?\n1 = огт нийцээгүй, 10 = маш сайн нийцсэн\nТайлангийн эхний “Товч хариу” хэсэг ойлгомжтой байсан уу?\nТийм, шууд ойлгосон\nЕрөнхийдөө ойлгосон\nДахин уншиж байж ойлгосон\nОйлгоогүй\nОйлгомжгүй байсан хэсгийг бичнэ үү.\nТайлан уншихад “намайг ойлгож байна” гэсэн мэдрэмж төрсөн үү?\nТийм\nЗарим хэсэг дээр\nҮгүй\nЯагаад?\nТайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?\nТийм\nБага зэрэг\nҮгүй\nЯмар хэсэг?\nТайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?\nҮгүй\nТийм\nАль хэсэг?\nТайлангийн хэл найруулга ямар санагдсан бэ?\nБайгалийн монгол хэлтэй\nЗарим хэсэг хиймэл\nХэт албархуу\nХэт зөөлөн/бөөрөнхий\nЗасах санал:\nЭнэ тайланг 29,000 төгрөгөөр авахад үнэ цэнтэй санагдах уу?\nТийм\nМагадгүй\nҮгүй\nЯагаад?\nХамгийн хэрэгтэй санагдсан хэсэг юу байсан бэ?\nХамгийн засмаар санагдсан хэсэг юу байсан бэ?\nСанал илгээх\nСаналын экспорт\nСонголт руу буцах Шинээр эхлэх", |
| 2955 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-4/OWNER_REVIEW_PACK_WP4.md:217:    sevenDayDiaryConfirmation: stack.seven_day_diary_confirmation_targets, |
| 2956 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-4/OWNER_REVIEW_PACK_WP4.md:304:    `- ${reportObject.sevenDayDiaryConfirmation.map(target => target.driver_key).join(", ")}`, |
| 2957 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-4/OWNER_REVIEW_PACK_WP4.md:321:    `- Seven day confirmation: ${reportObject.sevenDayDiaryConfirmation.map(target => target.driver_key).join(", ")}`, |
| 2958 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-4/OWNER_REVIEW_PACK_WP4.md:370:    "sevenDayDiaryConfirmation", |
| 2959 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-4/OWNER_REVIEW_PACK_WP4.md:411:    assert(Array.isArray(report.sevenDayDiaryConfirmation)); |
| 2960 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-4/OWNER_REVIEW_PACK_WP4.md:527:      "sevenDayDiaryConfirmation", |
| 2961 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-4/OWNER_REVIEW_PACK_WP4.md:541:      "sevenDayConfirmationTargets", |
| 2962 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-4/OWNER_REVIEW_PACK_WP4.md:645:- `sevenDayDiaryConfirmation` |
| 2963 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-33/OWNER_REVIEW_PACK_WP33.md:22:- Full report value is described as deeper context, secondary influences, safer pacing, first gentle step, 14-day experiment, and seven-day refinement path. |
| 2964 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/current-system-audit.md:31:9. `saveDiaryEntry()` persists a local diary entry, updates safety flags, and routes to `reportReady` after 5+ entries. |
| 2965 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-33/payment-boundary-confirmation.md:8:\| entitlement logic unchanged \| PASS \| `tests/conversion-paywall-ux-polish.test.js` asserts the exact `hasSevenDayAccess()`, `hasOneTimeReportAccess()`, and `hasUpgradeAccess()` return expressions. \| |
| 2966 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/report-module-map.md:65:seven_day_confirmation_plan |
| 2967 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/shadow-integration-test-plan.md:19:\| no report mutation when flag false \| Snapshot/regression \| One-time, seven-day, readiness, professional, and urgent report branches return the same HTML as before. \| Yes \| |
| 2968 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/shadow-integration-test-plan.md:20:\| no payment mutation \| Unit/regression \| `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, `hasUpgradeAccess()`, QPay constants, prices, and product codes are unchanged. \| Yes \| |
| 2969 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/shadow-integration-test-plan.md:26:\| existing report flow unchanged \| End-to-end regression \| Stage, diary, one-time report, seven-day report, paywall, professional, urgent, and readiness flows remain unchanged. \| Yes \| |
| 2970 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/VIRTUAL_HUMAN_REPORTS.md:59:7 хоногоор нарийвчлах |
| 2971 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/VIRTUAL_HUMAN_REPORTS.md:178:7 хоногоор нарийвчлах |
| 2972 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/VIRTUAL_HUMAN_REPORTS.md:298:7 хоногоор нарийвчлах |
| 2973 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/VIRTUAL_HUMAN_REPORTS.md:417:7 хоногоор нарийвчлах |
| 2974 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/VIRTUAL_HUMAN_REPORTS.md:536:7 хоногоор нарийвчлах |
| 2975 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/VIRTUAL_HUMAN_REPORTS.md:653:7 хоногоор нарийвчлах |
| 2976 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/VIRTUAL_HUMAN_REPORTS.md:772:7 хоногоор нарийвчлах |
| 2977 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/sprint-30-virtual-human-retest/VIRTUAL_HUMAN_REPORTS.md:891:7 хоногоор нарийвчлах |
| 2978 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-33/conversion-paywall-ux-summary.md:17:- Clarified what the paid report adds: repeated conditions, secondary influences, non-rushed avoidance guidance, first gentle step, 14-day experiment, and seven-day refinement path. |
| 2979 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/wp17-exact-patch-scope.md:63:- change `hasSevenDayAccess()`; |
| 2980 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-34/payment-qpay-production-hardening-audit.md:13:- `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, and `hasUpgradeAccess()`. |
| 2981 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-20/OWNER_REVIEW_PACK_WP20.md:339:    sevenDayPaid: false, |
| 2982 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-20/OWNER_REVIEW_PACK_WP20.md:347:    diaryEntries: [], |
| 2983 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-20/OWNER_REVIEW_PACK_WP20.md:480:  setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }); |
| 2984 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-20/OWNER_REVIEW_PACK_WP20.md:483:    sevenDay: _internal.hasSevenDayAccess(), |
| 2985 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-20/OWNER_REVIEW_PACK_WP20.md:494:    sevenDay: _internal.hasSevenDayAccess(), |
| 2986 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-20/OWNER_REVIEW_PACK_WP20.md:530:    "sevenDayAnchor: \"69,000₮\"", |
| 2987 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-5/OWNER_REVIEW_PACK_WP5.md:438:\| `sevenDayDiaryConfirmation` \| 7 хоногийн баталгаажуулах тэмдэглэл \| Partial \| Translate target driver keys into diary prompts or observation targets. \| Raw keys would make diary confirmation unusable for real users. \| |
| 2988 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-6/report-section-template-architecture.md:70:- Source WP4 field: `sevenDayDiaryConfirmation` |
| 2989 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-26/runtime-wiring-inspection.md:21:- seven-day report output |
| 2990 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:498:- change existing one-time or seven-day report HTML; |
| 2991 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:607:The shadow helper should run before the existing safety, payment, readiness, one-time, and seven-day return branches. It must not change those branches. |
| 2992 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:668:- disabled shadow flag leaves `_internal.renderReport()` output unchanged for seven-day readiness/paywall paths; |
| 2993 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:673:- shadow helper does not alter `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, or `hasUpgradeAccess()`; |
| 2994 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:780:- payment and entitlement paths: QPay helpers, `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, `hasUpgradeAccess()`; |
| 2995 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:796:\| `renderHumanReadableReport()` \| Builds existing visible report HTML for one-time and seven-day full reports \| Limited \| Already inside visible rendering; adding adapter output here risks copy or markup drift \| Do not invoke adapter here. Existing HTML must remain unchanged. \| |
| 2996 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:797:\| `renderOneTimeReport()` \| Delegates one-time paid rendering to `renderHumanReadableReport()` \| Limited \| Too narrow for seven-day, safety, paywall, and readiness coverage \| Do not use as primary touchpoint. \| |
| 2997 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:835:- unpaid seven-day route still returns the seven-day paywall; |
| 2998 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:836:- insufficient seven-day route still returns readiness copy; |
| 2999 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:838:- paid seven-day route still returns the existing seven-day report. |
| 3000 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:900:- same seven-day paywall; |
| 3001 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:901:- same seven-day readiness gate; |
| 3002 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:902:- same seven-day report; |
| 3003 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:951:- `hasSevenDayAccess()` behavior; |
| 3004 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:1160:\| no report mutation \| Preserve existing report branch order, returned HTML, report copy, scoring, evidence, and readiness behavior. \| Replacing report renderers, changing report copy, changing scoring, or wiring adapter sections into visible reports. \| Assert one-time, seven-day, safety, professional, and readiness flows remain unchanged. \| |
| 3005 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:1328:- change `hasSevenDayAccess()`; |
| 3006 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:1380:\| no report mutation when flag false \| Snapshot/regression \| One-time, seven-day, readiness, professional, and urgent report branches return the same HTML as before. \| Yes \| |
| 3007 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:1381:\| no payment mutation \| Unit/regression \| `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, `hasUpgradeAccess()`, QPay constants, prices, and product codes are unchanged. \| Yes \| |
| 3008 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:1387:\| existing report flow unchanged \| End-to-end regression \| Stage, diary, one-time report, seven-day report, paywall, professional, urgent, and readiness flows remain unchanged. \| Yes \| |
| 3009 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/OWNER_REVIEW_PACK_WP16.md:1585:\| existing report flow broken \| HIGH \| One-time, seven-day, readiness, professional, urgent, stage, or diary flow changes. \| Add branch coverage for existing report flow with flag false. \| Block WP17 commit until full report-flow regression passes. \| |
| 3010 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-27/runtime-payload-connection-summary.md:11:- Passed `buildRuntimeVisibleSurfacePayload(reportContext)` into the seven-day report integration call site. |
| 3011 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-5/report-copy-readiness-map.md:12:\| `sevenDayDiaryConfirmation` \| 7 хоногийн баталгаажуулах тэмдэглэл \| Partial \| Translate target driver keys into diary prompts or observation targets. \| Raw keys would make diary confirmation unusable for real users. \| |
| 3012 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-6/OWNER_REVIEW_PACK_WP6.md:140:\| `sevenDayDiaryConfirmation` \| 7 хоногийн баталгаажуулах тэмдэглэл \| Tell the user what to observe, not what to judge. \| |
| 3013 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-6/OWNER_REVIEW_PACK_WP6.md:259:4. Always translate `visibleCondition`, `secondaryDrivers`, `vulnerableMoment`, `hiddenFoodFunction`, `wrongSelfExplanation`, `firstGentleChange`, `fourteenDayExperiment`, and `sevenDayDiaryConfirmation` through an approved copy layer. |
| 3014 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-6/OWNER_REVIEW_PACK_WP6.md:447:- Source WP4 field: `sevenDayDiaryConfirmation` |
| 3015 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/shadow-runtime-integration-plan.md:107:- change existing one-time or seven-day report HTML; |
| 3016 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/shadow-runtime-integration-plan.md:216:The shadow helper should run before the existing safety, payment, readiness, one-time, and seven-day return branches. It must not change those branches. |
| 3017 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/shadow-runtime-integration-plan.md:277:- disabled shadow flag leaves `_internal.renderReport()` output unchanged for seven-day readiness/paywall paths; |
| 3018 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/shadow-runtime-integration-plan.md:282:- shadow helper does not alter `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, or `hasUpgradeAccess()`; |
| 3019 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/shadow-adapter-invocation-contract.md:39:\| no report mutation \| Preserve existing report branch order, returned HTML, report copy, scoring, evidence, and readiness behavior. \| Replacing report renderers, changing report copy, changing scoring, or wiring adapter sections into visible reports. \| Assert one-time, seven-day, safety, professional, and readiness flows remain unchanged. \| |
| 3020 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-27/runtime-wiring-inspection.md:24:\| seven-day `renderReport()` branch \| runtime payload connected \| `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = false` \| unchanged \| |
| 3021 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:16:- payment and entitlement paths: QPay helpers, `hasOneTimeReportAccess()`, `hasSevenDayAccess()`, `hasUpgradeAccess()`; |
| 3022 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:32:\| `renderHumanReadableReport()` \| Builds existing visible report HTML for one-time and seven-day full reports \| Limited \| Already inside visible rendering; adding adapter output here risks copy or markup drift \| Do not invoke adapter here. Existing HTML must remain unchanged. \| |
| 3023 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:33:\| `renderOneTimeReport()` \| Delegates one-time paid rendering to `renderHumanReadableReport()` \| Limited \| Too narrow for seven-day, safety, paywall, and readiness coverage \| Do not use as primary touchpoint. \| |
| 3024 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:71:- unpaid seven-day route still returns the seven-day paywall; |
| 3025 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:72:- insufficient seven-day route still returns readiness copy; |
| 3026 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:74:- paid seven-day route still returns the existing seven-day report. |
| 3027 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:136:- same seven-day paywall; |
| 3028 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:137:- same seven-day readiness gate; |
| 3029 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:138:- same seven-day report; |
| 3030 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/appjs-shadow-touchpoint-audit.md:187:- `hasSevenDayAccess()` behavior; |
| 3031 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-16/wp16-risk-register.md:20:\| existing report flow broken \| HIGH \| One-time, seven-day, readiness, professional, urgent, stage, or diary flow changes. \| Add branch coverage for existing report flow with flag false. \| Block WP17 commit until full report-flow regression passes. \| |
| 3032 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-18/shadow-integration-owner-qa-summary.md:36:- `tests/runtime-adapter-shadow-integration.test.js` asserts disabled shadow output invariance across one-time, paywall, seven-day, readiness hold, professional, and urgent report paths. |
| 3033 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-18/OWNER_REVIEW_PACK_WP18.md:184:- `tests/runtime-adapter-shadow-integration.test.js` asserts disabled shadow output invariance across one-time, paywall, seven-day, readiness hold, professional, and urgent report paths. |
| 3034 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-18/OWNER_REVIEW_PACK_WP18.md:256:\| Existing report output \| Disabled shadow path must not change visible report HTML. \| WP17 test compares `renderReport()` before and after disabled helper calls for one-time paid, one-time unpaid, seven-day full, seven-day readiness hold, professional, and urgent paths. \| PASS \| WP17 owner pack records the test as PASS. \| |
| 3035 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-18/wp17-shadow-integration-qa.md:16:\| Existing report output \| Disabled shadow path must not change visible report HTML. \| WP17 test compares `renderReport()` before and after disabled helper calls for one-time paid, one-time unpaid, seven-day full, seven-day readiness hold, professional, and urgent paths. \| PASS \| WP17 owner pack records the test as PASS. \| |
| 3036 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/wp17-risk-register.md:5:\| visible report output changed \| BLOCKER \| Any returned report HTML differs because of shadow integration. \| Disabled helper output is ignored; tests compare returned report HTML across one-time, seven-day, professional, urgent, and readiness branches. \| Controlled \| |
| 3037 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/shadow-output-invariance-report.md:15:- seven-day full report |
| 3038 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/shadow-output-invariance-report.md:16:- seven-day readiness hold |
| 3039 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:422:node -e 'const app=require("./app.js"); const {_internal}=app; const leaks=["previewSections","paidSections","safetyGuidanceSections","internalDiagnostics","ownerDebug","runtimeGate","decisionStatus","rendererMode","fixtureName","all_or_nothing_restriction_rebound","pcos_body_uncertainty_control"]; function check(label,setup){setup(); const html=_internal.renderReport(); const found=leaks.filter(x=>String(html).includes(x)); if(found.length) throw new Error(label+" leaked "+found.join(","));} function one(over={}){_internal.setTestState({packageType:"one-time",view:"report",oneTimePaid:true,sevenDayPaid:false,upgradePaid:false,stageAnswers:{"S1-W04":["Мацаг"],"S1-M01":"Өдөр бага идээд орой нөхөх","S1-F01":["Дараа өлсөхөөс санаа зовсон","Өөрийгөө шагнамаар"]},preliminary:[{key:"hungerSafety",score:5,label:"хүчтэй нийцэж байна"}],diaryEntries:[],...over});} function seven(over={}){_internal.setTestState({packageType:"seven-day",view:"report",oneTimePaid:false,sevenDayPaid:true,upgradePaid:false,stageAnswers:{"S1-W04":["Мацаг","Орой хоол идэхгүй"]},preliminary:[{key:"hungerSafety",score:5,label:"хүчтэй нийцэж байна"},{key:"executive",score:4,label:"дунд зэрэг нийцэж байна"}],diaryEntries:Array.from({length:5},(_,i)=>({day_number:i+1,meal_rhythm:"Хоолны хооронд 5+ цагийн зай гарсан",unplanned_eating_count:"Тийм, 1 удаа",main_moment_time:"Орой",hunger_level:"8",food_function:["Өөрийгөө шагнамаар байсан"],emotion:"Ядаргаа",energy_score:"2",stress_score:"5",body_signals:["Аль нь ч үгүй"],pattern_probes:{}})),...over});} check("one-time paid",()=>one()); check("one-time unpaid",()=>one({oneTimePaid:false})); check("seven-day",()=>seven()); check("professional",()=>seven({stageAnswers:{"S1-S03":"Одоо давтагддаг"}})); check("urgent",()=>seven({stageAnswers:{"S1-S04":"Одоо идэвхтэй бодогдож байна"}})); console.log("WP17 returned HTML adapter leak scan passed");' |
| 3040 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:602:    sevenDayPaid: false, |
| 3041 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:610:    diaryEntries: [], |
| 3042 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:615:function setSevenDay(overrides = {}) { |
| 3043 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:617:    packageType: "seven-day", |
| 3044 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:620:    sevenDayPaid: true, |
| 3045 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:629:    diaryEntries: entries(5), |
| 3046 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:668:    ["seven-day full", () => setSevenDay()], |
| 3047 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:669:    ["seven-day readiness hold", () => setSevenDay({ diaryEntries: entries(3) })], |
| 3048 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:670:    ["professional", () => setSevenDay({ stageAnswers: { "S1-S03": "Одоо давтагддаг" } })], |
| 3049 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:671:    ["urgent", () => setSevenDay({ stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" } })] |
| 3050 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:674:  setOneTime({ oneTimePaid: false, sevenDayPaid: false, upgradePaid: false }); |
| 3051 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:676:  assert.strictEqual(_internal.hasSevenDayAccess(), false); |
| 3052 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:680:  assert.strictEqual(_internal.hasSevenDayAccess(), false); |
| 3053 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:686:    "sevenDayAnchor: \"69,000₮\"", |
| 3054 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:854:- seven-day full report |
| 3055 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:855:- seven-day readiness hold |
| 3056 | HISTORICAL_OR_DOCUMENTATION_REVIEWED | ./audits/mvp-diagnostic-migration/work-pack-17/OWNER_REVIEW_PACK_WP17.md:927:\| visible report output changed \| BLOCKER \| Any returned report HTML differs because of shadow integration. \| Disabled helper output is ignored; tests compare returned report HTML across one-time, seven-day, professional, urgent, and readiness branches. \| Controlled \| |

## Current repository match classification

- Current matches classified: 75
- permitted generated migration inventory: 7
- permitted scope-decision/audit reference: 2
- permitted legacy migration invocation: 2
- permitted legacy migration reference: 8
- permitted removal-test reference: 9
- permitted removal-audit tooling reference: 47

| # | Classification | Location | Match | Context |
| -: | --- | --- | --- | --- |
| 1 | permitted generated migration inventory | MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2338 | sevenDay | \| RAW-2332 \| sevenDayStart \| app.js:1148 \| UNKNOWN_REQUIRES_TRACE \| |
| 2 | permitted generated migration inventory | MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2342 | reportReady | \| RAW-2336 \| reportReady \| app.js:1148 \| UNKNOWN_REQUIRES_TRACE \| |
| 3 | permitted generated migration inventory | MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2344 | sevenDay | \| RAW-2338 \| sevenDayPaid \| app.js:1149 \| UNKNOWN_REQUIRES_TRACE \| |
| 4 | permitted generated migration inventory | MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2346 | diaryEntries | \| RAW-2340 \| diaryEntries \| app.js:1149 \| UNKNOWN_REQUIRES_TRACE \| |
| 5 | permitted generated migration inventory | MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2347 | diaryDraft | \| RAW-2341 \| diaryDraft \| app.js:1149 \| UNKNOWN_REQUIRES_TRACE \| |
| 6 | permitted generated migration inventory | MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2348 | diaryDay | \| RAW-2342 \| diaryDay \| app.js:1149 \| UNKNOWN_REQUIRES_TRACE \| |
| 7 | permitted generated migration inventory | MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md:2349 | diaryQuestionIndex | \| RAW-2343 \| diaryQuestionIndex \| app.js:1149 \| UNKNOWN_REQUIRES_TRACE \| |
| 8 | permitted scope-decision/audit reference | PRODUCT_SCOPE_DECISIONS.json:9 | seven_day | "feature": "seven_day_assessment", |
| 9 | permitted scope-decision/audit reference | PRODUCT_SCOPE_DECISIONS.schema.json:21 | seven_day | "feature": { "const": "seven_day_assessment" }, |
| 10 | permitted legacy migration invocation | app.js:1132 | SevenDay | const stored = migrateLegacySevenDayState(JSON.parse(localStorage.getItem(STORAGE_KEY) \|\| "{}")); |
| 11 | permitted legacy migration reference | app.js:1146 | SevenDay | function migrateLegacySevenDayState(input = {}) { |
| 12 | permitted legacy migration reference | app.js:1148 | sevenDay | const obsoleteViews = new Set(["sevenDayStart", "unlock", "diaryHome", "diary", "reportReady", "upgradePaywall"]); |
| 13 | permitted legacy migration reference | app.js:1148 | reportReady | const obsoleteViews = new Set(["sevenDayStart", "unlock", "diaryHome", "diary", "reportReady", "upgradePaywall"]); |
| 14 | permitted legacy migration reference | app.js:1149 | sevenDay | const obsoleteFields = ["sevenDayPaid", "upgradePaid", "diaryEntries", "diaryDraft", "diaryDay", "diaryQuestionIndex", "diarySummaryUi"]; |
| 15 | permitted legacy migration reference | app.js:1149 | diaryEntries | const obsoleteFields = ["sevenDayPaid", "upgradePaid", "diaryEntries", "diaryDraft", "diaryDay", "diaryQuestionIndex", "diarySummaryUi"]; |
| 16 | permitted legacy migration reference | app.js:1149 | diaryDraft | const obsoleteFields = ["sevenDayPaid", "upgradePaid", "diaryEntries", "diaryDraft", "diaryDay", "diaryQuestionIndex", "diarySummaryUi"]; |
| 17 | permitted legacy migration reference | app.js:1149 | diaryDay | const obsoleteFields = ["sevenDayPaid", "upgradePaid", "diaryEntries", "diaryDraft", "diaryDay", "diaryQuestionIndex", "diarySummaryUi"]; |
| 18 | permitted legacy migration reference | app.js:1149 | diaryQuestionIndex | const obsoleteFields = ["sevenDayPaid", "upgradePaid", "diaryEntries", "diaryDraft", "diaryDay", "diaryQuestionIndex", "diarySummaryUi"]; |
| 19 | permitted legacy migration invocation | app.js:6828 | SevenDay | state = { ...initialState, oneTimePaid: true, ...migrateLegacySevenDayState(nextState) }; |
| 20 | permitted removal-test reference | tests/mongolian-copy-audit-fixes.test.js:99 | SEVEN_DAY | assert(!artifact.entries.some(e => /SEVEN_DAY\|DIARY\|UPGRADE/.test(e.surface)), "removed product surfaces must not enter the catalog"); |
| 21 | permitted removal-test reference | tests/seven-day-feature-removal.test.js:7 | seven-day | packageType: "seven-day", |
| 22 | permitted removal-test reference | tests/seven-day-feature-removal.test.js:10 | sevenDay | sevenDayPaid: true, |
| 23 | permitted removal-test reference | tests/seven-day-feature-removal.test.js:11 | diaryEntries | diaryEntries: [{ day: 1 }] |
| 24 | permitted removal-test reference | tests/seven-day-feature-removal.test.js:16 | sevenDay | assert(!Object.prototype.hasOwnProperty.call(migrated, "sevenDayPaid")); |
| 25 | permitted removal-test reference | tests/seven-day-feature-removal.test.js:17 | diaryEntries | assert(!Object.prototype.hasOwnProperty.call(migrated, "diaryEntries")); |
| 26 | permitted removal-test reference | tests/seven-day-feature-removal.test.js:19 | seven_day | assert.throws(() => backend.createAssessment("seven_day"), /Unsupported assessment type/); |
| 27 | permitted removal-test reference | tests/seven-day-feature-removal.test.js:24 | SevenDay | assert(source.includes("function migrateLegacySevenDayState")); |
| 28 | permitted removal-test reference | tests/seven-day-feature-removal.test.js:25 | seven-day | console.log("seven-day feature removal tests passed"); |
| 29 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | sevenDay | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 30 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | seven-day | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 31 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | seven_day | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 32 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | diaryEntries | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 33 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | diaryDraft | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 34 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | diaryDay | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 35 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | diaryQuestionIndex | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 36 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | renderSevenDay | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 37 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | 29,000₮ | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 38 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | 69,000₮ | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 39 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | 19,900₮ | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 40 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:11 | 7 хоногийн гүн | const banned = /sevenDay\|seven-day\|seven_day\|dailyCore\|dailyMenstrual\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|renderDiary\|renderSevenDay\|renderUpgrade\|upgradePaid\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн зураглал\|7 хоногийн үнэлгээ/gi; |
| 41 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:17 | SevenDay | source = source.replace(/function migrateLegacySevenDayState[\s\S]*?\n}\n\nfunction initialViewFromPath/, "function initialViewFromPath"); |
| 42 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:18 | SevenDay | source = source.replaceAll("migrateLegacySevenDayState", "legacyStateMigration"); |
| 43 | permitted removal-audit tooling reference | tools/assert-seven-day-feature-removed.mjs:28 | seven-day | console.log("seven-day feature removal guard passed"); |
| 44 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:5 | seven-day | const sourcePath = "/tmp/seven-day-removal-start.txt"; |
| 45 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:17 | Seven-Day | let body = `# Seven-Day Feature Removal Audit\n\n## Decision\n\nThe seven-day assessment product, its upgrade path, tracking flow, reports, entitlements, analytics scenarios, and rendered-copy coverage were removed. The one-time assessment and its 9,900₮ QPay flow remain. A narrow legacy-state migration discards obsolete local fields and redirects obsolete views safely.\n\n## Start-state inventory\n\n- Source snapshot: \`${sourcePath}\`\n- Matching occurrences reviewed: ${lines.length}\n${Object.entries(counts).map(([key,value]) => `- ${key}: ${value}`).join("\n")}\n\nEach pre-removal match is classified below. This file is the sole detailed historical evidence register for removed feature identifiers and wording.\n\n\| # \| Classification \| Pre-removal occurrence \|\n\| -: \| --- \| --- \|\n`; |
| 46 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:17 | seven-day | let body = `# Seven-Day Feature Removal Audit\n\n## Decision\n\nThe seven-day assessment product, its upgrade path, tracking flow, reports, entitlements, analytics scenarios, and rendered-copy coverage were removed. The one-time assessment and its 9,900₮ QPay flow remain. A narrow legacy-state migration discards obsolete local fields and redirects obsolete views safely.\n\n## Start-state inventory\n\n- Source snapshot: \`${sourcePath}\`\n- Matching occurrences reviewed: ${lines.length}\n${Object.entries(counts).map(([key,value]) => `- ${key}: ${value}`).join("\n")}\n\nEach pre-removal match is classified below. This file is the sole detailed historical evidence register for removed feature identifiers and wording.\n\n\| # \| Classification \| Pre-removal occurrence \|\n\| -: \| --- \| --- \|\n`; |
| 47 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | sevenDay | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 48 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | seven-day | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 49 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | seven_day | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 50 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | renderSevenDay | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 51 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | startSevenDay | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 52 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | hasSevenDayAccess | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 53 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | diaryEntries | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 54 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | diaryDraft | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 55 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | diaryDay | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 56 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | diaryQuestionIndex | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 57 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | reportReady | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 58 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | renderUpgradeOffer | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 59 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | renderUpgradePaywall | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 60 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | startSevenDay | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 61 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | 29,000₮ | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 62 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | 69,000₮ | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 63 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | 19,900₮ | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 64 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | 7 хоногийн гүн | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 65 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:19 | 7 хоногоор нарийвчлах | const matchPattern = /sevenDay\|seven-day\|seven_day\|renderSevenDay\|startSevenDay\|hasSevenDayAccess\|diaryEntries\|diaryDraft\|diaryDay\|diaryQuestionIndex\|reportReady\|renderUpgradeOffer\|renderUpgradePaywall\|startSevenDayRefinement\|29,000₮\|69,000₮\|19,900₮\|7 хоногийн гүн\|7 хоногоор нарийвчлах/gi; |
| 66 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:22 | SevenDay | const migrationStart = appLines.findIndex(line => line.includes("function migrateLegacySevenDayState")) + 1; |
| 67 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:31 | SEVEN_DAY | if (["SEVEN_DAY_FEATURE_REMOVAL_AUDIT.md"].includes(relative)) continue; |
| 68 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:44 | SevenDay | if (item.file === "app.js" && item.text.includes("migrateLegacySevenDayState")) return "permitted legacy migration invocation"; |
| 69 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:46 | seven-day | if (item.file === "tests/seven-day-feature-removal.test.js" \|\| item.file === "tests/mongolian-copy-audit-fixes.test.js") return "permitted removal-test reference"; |
| 70 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:47 | seven-day | if (item.file === "tools/assert-seven-day-feature-removed.mjs" \|\| item.file === "tools/generate-seven-day-feature-removal-audit.mjs") return "permitted removal-audit tooling reference"; |
| 71 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:47 | seven-day | if (item.file === "tools/assert-seven-day-feature-removed.mjs" \|\| item.file === "tools/generate-seven-day-feature-removal-audit.mjs") return "permitted removal-audit tooling reference"; |
| 72 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:48 | seven-day | if (/7 хоног/i.test(item.match) && !/гүн\|нарийвчлах/i.test(item.match)) return "unrelated ordinary seven-day time reference"; |
| 73 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:58 | seven-day | body += `\n## Retained ordinary time references\n\nOrdinary advice or experiment durations that happen to mention seven days are not product identifiers and remain valid. The removal guard deliberately targets product names, state identifiers, removed prices, routes, rendered surfaces, and entitlement concepts instead of banning the generic phrase “7 хоног”.\n\n## Validation contract\n\n- Run \`node tools/assert-seven-day-feature-removed.mjs\`.\n- Run \`node tests/seven-day-feature-removal.test.js\`.\n- Regenerate the rendered-copy catalog and owner-review packs.\n- Run focused QPay, analytics, pricing, safety, and routing tests, then \`npm test\`.\n`; |
| 74 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:58 | seven-day | body += `\n## Retained ordinary time references\n\nOrdinary advice or experiment durations that happen to mention seven days are not product identifiers and remain valid. The removal guard deliberately targets product names, state identifiers, removed prices, routes, rendered surfaces, and entitlement concepts instead of banning the generic phrase “7 хоног”.\n\n## Validation contract\n\n- Run \`node tools/assert-seven-day-feature-removed.mjs\`.\n- Run \`node tests/seven-day-feature-removal.test.js\`.\n- Regenerate the rendered-copy catalog and owner-review packs.\n- Run focused QPay, analytics, pricing, safety, and routing tests, then \`npm test\`.\n`; |
| 75 | permitted removal-audit tooling reference | tools/generate-seven-day-feature-removal-audit.mjs:59 | SEVEN_DAY | fs.writeFileSync(path.join(root, "SEVEN_DAY_FEATURE_REMOVAL_AUDIT.md"), body); |

## Virtual-user scenario disposition

All 15 retained scenarios are one-time equivalents under the approved test-policy decision. None exercises a removed product route, entitlement, renderer, payment, or report.

| Scenario | Disposition |
| --- | --- |
| Hunger-Safety Evening Rebound | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Reward-Seeking / Stimulation | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Reward Deficit / My Time | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Food-as-Regulation | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Executive Load | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Decision-Default Mismatch | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Circadian-Energy Mismatch | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Control-Collapse | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Stage 1 Reward vs Hunger Contradiction | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Stage 1 Stress vs Executive Load Contradiction | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Hunger-Triggered Physiological Reactivity | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Glucose-Safety / Professional Route | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Mode 4 Urgent Safety | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Social Belonging + Autonomy | REPLACE_WITH_ONE_TIME_EQUIVALENT |
| Body-Safety + Shame | REPLACE_WITH_ONE_TIME_EQUIVALENT |

## Retained ordinary time references

Ordinary advice or experiment durations that happen to mention seven days are not product identifiers and remain valid. The removal guard deliberately targets product names, state identifiers, removed prices, routes, rendered surfaces, and entitlement concepts instead of banning the generic phrase “7 хоног”.

## Validation contract

- Run `node tools/assert-seven-day-feature-removed.mjs`.
- Run `node tests/seven-day-feature-removal.test.js`.
- Regenerate the rendered-copy catalog and owner-review packs.
- Run focused QPay, analytics, pricing, safety, and routing tests, then `npm test`.
