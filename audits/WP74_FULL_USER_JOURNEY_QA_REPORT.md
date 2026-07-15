# WP74 Full User Journey QA Report

## 1. Executive summary

WP74 completed a local-only full user journey QA pass after the WP71/WP73 Mongolian copy improvements. The core app flows, report generation, safety routes, payment gates, coming-soon guard, and QPay/payment guard tests pass locally.

Launch should not proceed yet. The main blocker is domain readiness: `jingeehas.fit` currently resolves to Namecheap parking IPs, `www.jingeehas.fit` resolves to Namecheap parking, and Netlify CLI still reports the linked project URL as `https://weight.[CROSS_PROJECT_NAME_REMOVED]`, not `jingeehas.fit`. A few user-facing copy issues also remain for WP75 before public launch.

## 2. Validation results

- `node --check app.js`: PASS
- `node tests/wp71-selected-copy-implementation.test.js`: PASS
- `node tests/wp73-report-voice-copy-cleanup.test.js`: PASS
- `npm test`: PASS
- `git diff --check`: PASS

Generated audit output churn from `npm test` was restored after validation:

- `audits/mvp-diagnostic-migration/work-pack-21/visible-surface-owner-qa-snapshots.md`
- `audits/virtual-users-10/REPORT_AUDIT.md`
- `audits/virtual-users-10/VIRTUAL_USER_RESULTS.md`
- `audits/virtual-users-10/raw/user-01.json` through `user-10.json`

## 3. Local QA method used

- Used `package.json` to identify available local commands. The project exposes only `npm test`; no local dev server script is defined.
- Used existing local test coverage for navigation, mobile layout guards, report routing, payment gates, QPay guards, coming-soon mode, paid/free report behavior, and virtual-user scenarios.
- Used Node-based local rendering through app internals to sample one-time report, unpaid paywall, body-signal route, urgent safety route, fatigue, stress, collapse, and reward/cue scenarios.
- Used read-only grep checks for launch/payment/domain guard strings.
- Used read-only `dig` checks for `jingeehas.fit` and `www.jingeehas.fit`.
- Used read-only `netlify status`.
- No deploy, DNS change, Netlify settings change, source edit, staging, commit, or push was performed.

## 4. First-time user flow findings

PASS with copy follow-up.

- App source parses successfully with `node --check app.js`.
- Navigation tests confirm question progression, back navigation, answer preservation, scroll-to-top behavior, feedback submission, and urgent route visibility.
- A-001 intro copy is present in source as `S1-C00`:
  - `Энэхүү сорил нь таныг шүүмжлэх зорилгогүй юм...`
- First-time paid/free gating remains guarded by coming-soon and payment tests.

Remaining issue:

- The improved A-001 copy is polished but fairly long for first-screen/mobile reading. It is not a launch blocker, but WP75 should consider one sentence split if visual QA shows density.

## 5. Question flow findings

PASS with minor copy follow-up.

Verified edited questions in `app.js`:

- A-001 maps to `S1-C00` and uses the improved non-judgmental intro.
- A-012 maps to `S1-W05` and uses the `2 долоо хоногоос дээш хугацаанд тогтвортой` phrasing.
- A-013 maps to `S1-W06` and uses `Хоолны төлөвлөгөө тань бага зэрэг зөрчихөд...`.
- A-022 maps to `S1-V01` and uses the expanded planned/unplanned eating prompt.
- A-038 maps to `S1-L01` and uses the general fatigue wording.
- A-088 maps to `D-P-EL01` and uses the general fatigue wording.

Checks:

- Existing navigation tests pass.
- Existing copy-polish tests pass.
- Existing selected-copy implementation tests pass.
- No scoring or branching files were changed in this pass.

Remaining issue:

- Daily journal question `D-P-CE01` still says `оройн тэнхээ`. This was outside the selected A-038/A-088 patch but is visible in removed-feature journaling and should be reviewed in WP75.

## 6. Report generation findings

PASS with copy follow-up.

Sampled local one-time report outputs:

- Fatigue/easy-ready-choice report rendered coherent one-time output with `боломжит хэв маяг` uncertainty language.
- Stress report rendered clear non-punitive language:
  - `Стресс ихтэй үед хоол танд түр амрах газар шиг болж байна.`
- Collapse/restriction-binge report rendered `өнөөдөр өнгөрлөө` flow and next-meal recovery guidance.
- Cue/reward sample rendered broad reward/cue language without the rejected `зүгээр амттан хүссэн асуудал биш` phrase.
- Body-signal route rendered professional-first safety output.
- Urgent route rendered high-risk safety output and suppressed ordinary report/commerce framing.

WP73 regression checks pass:

- no duplicate `Гол гацалт Гол гацалт`
- no stray trailing ` 4.` in generated cycle text
- no narrow reward-deficit `амттан` wording where broad `амттай зүйл` is intended
- one-time report uses uncertainty language
- compressed removed-feature report keeps menstrual-cycle meaning
- body-signal route keeps professional safety guidance

Remaining issues:

- Professional safety route contains duplicated wording: `Ярилцах товч нэгтгэл доор байна. ярилцахад авч очих богино нэгтгэл гаргана.`
- Some report/paywall preview copy still uses older terms such as `Эхний зөөлөн алхам` and `дохио`. This is not breaking, but it is a visible polish item before launch.

## 7. Safety route findings

PASS with one copy blocker.

- `tests/report-safety-routing.test.js`: PASS
- `tests/safety-readiness.test.js`: PASS
- `tests/paid-first-gate-emergency.test.js`: PASS
- Local urgent sample shows:
  - `Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал.`
- Local professional/body sample correctly avoids ordinary diet experiment framing and recommends professional discussion before fasting/restriction.

Blocker before public launch:

- Fix the duplicated professional-route sentence noted above. It is visible in a high-trust safety path and should be cleaned before domain launch.

## 8. Payment/gating findings

PASS.

- `WEIGHT_TEST_COMING_SOON_MODE = true` remains present.
- `9,900₮` remains present for one-time/anchor/coach pricing.
- `WEIGHT_TEST_ONE_TIME` remains present.
- QPay create/check endpoint strings remain:
  - `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-create-invoice`
  - `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-check-payment`
- Coming-soon, paid-first gate, QPay device UX, live payment QA, commercial flow, mock backend entitlement, and no-account contact delivery tests pass.
- Local unpaid report sample shows gated preview, 9,900₮ copy, and no raw QPay endpoint exposure in the UI snippet.

## 9. Save/print/PDF findings

PASS.

Local paid report save area renders:

- `Тайлангаа хадгалах`
- `Таны тайлан энэ дэлгэц дээр гарлаа. Одоогоор байнгын тайлангийн холбоос эсвэл имэйл илгээсэн гэж харуулахгүй.`
- `Тайлан хуулж авах`
- `Хэвлэх / PDF хадгалах`

This avoids misleading claims about email delivery or permanent report links.

## 10. Mobile layout/copy overflow findings

PASS by existing local CSS/test coverage; needs final browser visual pass before launch.

- `tests/mobile-visible-surface-qa.test.js`: PASS
- CSS includes mobile rules at `max-width: 820px`, `max-width: 640px`, and `max-width: 520px`.
- CSS includes overflow protections including `overflow-x: hidden`, `overflow-wrap: anywhere`, table scrolling, button width rules, and mobile action stacking.

Limit of this pass:

- No browser/dev-server visual screenshot pass was run because `package.json` has no local server script and this WP requested no source changes. WP75 or launch QA should include actual browser viewport checks at 375px, 390px, and 430px before public launch.

## 11. Remaining copy issues

Recommended WP75 copy fixes:

- Remove duplicated professional safety route sentence:
  - `Ярилцах товч нэгтгэл доор байна. ярилцахад авч очих богино нэгтгэл гаргана.`
- Review removed-feature daily prompt `D-P-CE01` for `оройн тэнхээ`.
- Review preview/paywall wording that still uses `Эхний зөөлөн алхам` and repeated `дохио`.
- Consider splitting the long A-001 intro into shorter visual chunks if browser mobile QA shows density.
- Review remaining old-domain references in historical audit files only if an owner-facing launch pack will include those files.

## 12. Remaining functional issues

- No local functional regression found in tests.
- No scoring/branching regression found by existing tests.
- No payment/QPay regression found by existing tests.
- Domain readiness is not launch-ready:
  - `dig +short jingeehas.fit` returned `162.255.119.211`.
  - `dig +short www.jingeehas.fit` returned `parkingpage.namecheap.com.` plus Namecheap parking IPs.
  - `netlify status` reports current project `weight-loss-deep-pattern-9900`, project URL `https://weight.[CROSS_PROJECT_NAME_REMOVED]`, project id `fb4def02-8e5d-4f00-8996-8cae09ed836f`.

## 13. Launch readiness assessment

Ready for domain/DNS?

- No. `jingeehas.fit` and `www.jingeehas.fit` are not pointed to the Netlify project in the read-only checks. Netlify status also does not show `jingeehas.fit` as the project URL.

Needs WP75 fixes first?

- Yes. Fix the professional safety duplicate sentence, review the remaining visible old copy terms, and run actual browser/mobile viewport QA before public DNS/domain launch.

## 14. Recommended next WP

WP75 should be a no-deploy polish/fix pass:

1. Fix the duplicated professional safety route sentence.
2. Review removed-feature daily prompt `D-P-CE01` and preview/paywall `дохио` / `Эхний зөөлөн алхам` wording.
3. Run browser viewport QA at 375px, 390px, and 430px.
4. Re-run `npm test`.
5. Prepare a separate read-only Netlify/DNS connection plan for `jingeehas.fit`.

Do not connect DNS or deploy until WP75 passes and the owner explicitly approves domain work.

## 15. Guard confirmations

- No deploy command was run.
- No DNS settings were changed.
- No Netlify settings were changed.
- `.netlify/state.json` was not modified.
- Payment flow was not modified.
- QPay was not modified.
- Coming-soon mode was not changed.
- Price/product guards were not changed.
- No push, force push, merge, rebase, or reset was run.
- No files were staged or committed.
- WP64/WP67 PDF packs were not touched.
- `audits/sprint-36-paid-depth-prototype/` was not touched.
- Editor handoff artifacts were not touched.
