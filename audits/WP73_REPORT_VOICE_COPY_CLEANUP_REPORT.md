# WP73 Report Voice Copy Cleanup Report

## 1. Executive summary

WP73 cleaned the remaining runtime report-voice copy flagged by WP72 before public launch. The changes are copy-only and stay inside report/readiness output, report voice summaries, and focused copy regression coverage.

No scoring, branching, safety routing, payment gate, QPay, coming-soon, DNS, or Netlify behavior was intentionally changed.

## 2. Report voice paths inspected

- `REPORT_VOICE_LIBRARY`
- `getSimpleResultSummary`
- `renderSimpleResultSection`
- `renderHumanReadableReport`
- `renderClearOneTimePaidReport`
- `reportReadiness`
- `dailyMicroInsight`
- `hiddenFunctionItems`
- `cycleMapSteps`
- `notRealProblemCopy`
- `previousAttemptsCopy`
- `leveragePoint`
- `experimentFor`
- `surfaceContextInsight`
- one-time paid report output
- compressed removed-feature menstrual-cycle report output
- reward/reward-deficit output
- fatigue/circadian output
- collapse/restriction-binge output
- body-signal/professional safety output

## 3. Copy issues fixed

- Broadened reward-deficit wording so the visible report does not narrow broad cravings to only `амттан`.
- Replaced targeted report-voice instances of `Эхний жижиг өөрчлөлт` with more natural first-step wording.
- Replaced targeted report/readiness instances of `давтамж харахад` with fuller Mongolian phrasing.
- Softened repeated `өөрийгөө буруутгах` report phrasing where it sounded judgmental.
- Replaced targeted awkward `дохио` uses in report copy with context-specific words such as `шинж` and `орчны нөлөө`.
- Reduced targeted report uses of `оройн тэнхээ` where `оройн эрч хүч` reads more naturally.
- Replaced some repeated `зөөлөн` wording with `уян хатан` or `ачаалал багатай` where the old phrasing sounded translated.

## 4. Exact phrases replaced

- `зүгээр амттан хүссэн асуудал биш` -> `зүгээр нэг амттай зүйл хүссэн асуудал биш`
- `Орой болоход амттай зүйл зүгээр нэг амттан биш` -> `Орой болоход амттай зүйл зүгээр нэг амтлах зүйл биш`
- `Эхний жижиг өөрчлөлт` -> `Хамгийн хялбар эхлэх цэг`, `Авч хэрэгжүүлж болох эхний алхам`, or `Эхлэхэд хамгийн амар алхам`
- `давтамж харахад` -> `зан үйлийн давтамжийг тодорхойлоход`, `давтагдаж байгаа эсэхийг харахад`, or `өдөр тутамд яаж давтагдаж байгааг ойлгоход`
- `өөрийгөө буруутгах` -> `өөртөө хатуу хандах`, `гэмших`, or `биедээ улам хатуу хандах` in targeted report paths
- `орчны дохио` -> `орчны нөлөө` in targeted reward report paths
- `оройн тэнхээний уналт` -> `оройн эрч хүчний уналт` in targeted report paths

## 5. Phrases intentionally not replaced

- Some `дохио` instances remain where the context is safety screening, internal signal naming, or existing public-product/paywall copy outside WP73's report-voice scope.
- `амттаны шургуулга` remains as a concrete cue example, because that specific context means sweets.
- Some `өөрийгөө буруутгах` instances remain in non-report metadata, payment/safety guard strings, or generic translation helpers that were not part of this report-voice cleanup.
- `зөөлөн` remains where it is part of existing safety/professional caution text and changing it could unintentionally weaken the safety tone.

## 6. Tests added/updated

- Added `tests/wp73-report-voice-copy-cleanup.test.js`.
- Registered the new test in `tests/run-all.js`.

The new test covers:

- reward-deficit report output keeps broad `амттай зүйл` meaning
- generated reports do not contain duplicate `Гол гацалт Гол гацалт`
- generated cycle text does not contain stray trailing ` 4.`
- one-time report voice keeps natural uncertainty language
- compressed removed-feature report voice keeps menstrual-cycle meaning while avoiding mechanical copy
- body-signal route keeps professional safety guidance intact

## 7. Validation results

- `node --check app.js`: PASS
- `node tests/wp73-report-voice-copy-cleanup.test.js`: PASS
- `npm test`: PASS
- `git diff --check`: PASS

Generated audit output churn from `npm test` was restored after validation:

- `audits/mvp-diagnostic-migration/work-pack-21/visible-surface-owner-qa-snapshots.md`
- `audits/virtual-users-10/REPORT_AUDIT.md`
- `audits/virtual-users-10/VIRTUAL_USER_RESULTS.md`
- `audits/virtual-users-10/raw/user-01.json` through `user-10.json`

## 8. Guard confirmations

- Do not deploy.
- Do not run Netlify deploy.
- Do not change DNS.
- Do not change Netlify settings.
- Do not modify `.netlify/state.json`.
- Do not touch payment flow.
- Do not touch QPay.
- Do not change coming-soon mode.
- Do not change price/product guards.
- Keep `WEIGHT_TEST_COMING_SOON_MODE = true`.
- Keep `9,900₮`.
- Keep `WEIGHT_TEST_ONE_TIME`.
- Keep QPay create/check endpoint strings unchanged.
- Do not touch TIAS/[CROSS_PROJECT_NAME_REMOVED]-tias.
- Do not touch WP64/WP67 PDF packs.
- Do not touch `audits/sprint-36-paid-depth-prototype/`.

## 9. Remaining copy issues for WP74

- A broader non-report/public-paywall copy sweep can still review the remaining `дохио`, `зөөлөн`, and `өөрийгөө буруутгах` appearances outside the WP73 runtime report scope.
- Some legacy internal metadata still mixes English mechanism terms with Mongolian copy. This was intentionally not changed because WP73 is report-voice-only.
