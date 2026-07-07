# WP72 Runtime Copy QA Report

## 1. Executive summary

WP72 runtime QA passed validation and confirmed the WP71 selected Mongolian copy revisions are present in production source and protected by targeted tests. The question-flow revisions render correctly in the app question bank. Report-flow QA found no broken JavaScript, no broken report flow, and no payment/QPay/coming-soon regression.

The main remaining issue is not a WP71 implementation failure: some runtime report scenarios still choose older, unselected report-voice copy from adjacent report paths. This means the selected WP71 strings are installed, but the broader report voice library still needs another copy-edit pass before public launch.

Recommendation: continue copy editing in the next work pack before launch. Do not deploy WP71/WP72 output as final public copy without another report-voice review.

## 2. Validation results

- `node --check app.js`: PASS
- `node tests/wp71-selected-copy-implementation.test.js`: PASS
- `npm test`: PASS
- `git diff --check`: PASS
- Generated audit output churn from `npm test` was restored after validation:
  - `audits/mvp-diagnostic-migration/work-pack-21/visible-surface-owner-qa-snapshots.md`
  - `audits/virtual-users-10/REPORT_AUDIT.md`
  - `audits/virtual-users-10/VIRTUAL_USER_RESULTS.md`
  - `audits/virtual-users-10/raw/user-01.json` through `user-10.json`

## 3. Implemented IDs verified

All 23 selected IDs were checked against the final WP70 review-pack values:

- А-001
- А-012
- А-013
- А-022
- А-038
- А-088
- Т-071
- Т-116
- Т-315
- Т-185
- Т-195
- Т-356
- Т-381
- Т-026
- Т-029
- Т-033
- Т-038
- Т-047
- Т-049
- Т-051
- Т-053
- Т-055
- Т-058

Confirmed source/test-level checks:

- Final А-038 wording is present: `Юу хийхээ мэдэж байсан ч, хийх эрч хүч хүрэлцэхгүй үе танд хэр олон тохиолддог вэ?`
- Final А-088 wording is present: `Юу хийхээ мэдэж байсан ч, хийх эрч хүч хүрэлцэхгүй үе танд тохиолдож байсан уу?`
- Rejected evening-only narrowing is absent from `app.js`.
- Final Т-185 broad wording is present and keeps `амттай зүйл`.
- Rejected Т-185 narrowing to only `амттан` is absent from the selected string.
- Final Т-315 softened wording is present.
- Rejected `гүнээ гэмшиж` wording is absent.
- `дохио` remains elsewhere in the app source, confirming there was no global replacement.

## 4. Scenario outputs reviewed

Runtime scenario generation used app internals only. No temporary files were kept.

### 4.1 Intro/question flow

Reviewed `app.allQuestionObjects()` output.

Confirmed present:

- А-001 intro copy begins with `Энэхүү сорил нь таныг шүүмжлэх зорилгогүй юм`.
- А-012 uses the selected `2 долоо хоногоос дээш хугацаанд тогтвортой` phrasing.
- А-013 uses `Хоолны төлөвлөгөө тань бага зэрэг зөрчихөд`.
- А-022 uses `Сүүлийн үед төлөвлөөгүй байхдаа хооллосон`.
- А-038 and А-088 use general fatigue wording, not evening-only wording.

### 4.2 Fatigue / easy ready choice

Reviewed a seven-day report scenario with high executive/default-choice signals.

Result:

- Report flow rendered without breakage.
- Final Т-356 first-step wording surfaced: `Авч хэрэгжүүлж болох хамгийн хялбар өөрчлөлт бол оройн хоолоо хасах биш...`
- The exact Т-116 selected sentence did not surface in this scenario because the report selected a compressed executive voice path. This is a runtime selection nuance, not a syntax or implementation break.

### 4.3 Stress eating

Reviewed a seven-day stress/regulation scenario.

Result:

- Report flow rendered without breakage.
- Final Т-381 wording surfaced, including the reflective question: `Би бодитоор өлсөж байна уу, эсвэл зүгээр л амрах газар хайж байна уу?`
- The sentence reads naturally in the stress scenario and does not sound like punishment or restriction.

### 4.4 Restriction-binge / `өнөөдөр өнгөрлөө`

Reviewed one-time and seven-day collapse scenarios with `Өнөөдөр өнгөрлөө, маргаашаас`.

Result:

- Report flow rendered without breakage.
- The selected Т-315 sentence is present in source and covered by the WP71 regression test.
- The synthetic reports often chose older collapse voice copy instead of the exact selected Т-315 sentence. This should be reviewed in a broader report-voice cleanup pass.

### 4.5 Pleasure/reward eating

Reviewed reward/reward-deficit scenarios.

Result:

- Report flow rendered without breakage.
- Short label Т-026 surfaced: `Сэтгэл санаагаа баярлуулахыг хүсэх үе`.
- The selected Т-185 broad `амттай зүйл` sentence is present in source and covered by tests.
- Remaining issue: one visible reward-deficit report path still says `зүгээр амттан хүссэн асуудал биш`. This is not the selected Т-185 string, but it repeats the narrowing issue the editor warned about. It should be included in the next copy-edit batch.

### 4.6 Body signal / safety route

Reviewed body-signal and professional-check scenarios.

Result:

- Safety route rendered without breakage.
- Professional-check copy surfaced, including `Мэргэжлийн хүнтэй ярилцахад`.
- Short labels Т-033 and Т-049 are present in source and covered by the selected-copy regression test, but the safety route does not always render those labels directly. This is acceptable for safety routing, but body-signal copy should still be reviewed in the next broader pass.

## 5. Awkward Mongolian remaining

These are remaining runtime copy issues outside the exact WP71 selected-string replacements:

- Reward-deficit report voice still uses `амттан` in at least one visible path. This narrows broader `амттай зүйл`.
- Some executive/collapse runtime report paths still use older voice-library wording even after selected source strings were updated.
- One-time report voice and compressed seven-day report voice are not fully aligned with the selected editor revisions.

## 6. Semantic drift found

No semantic drift was found in the 23 selected WP71 replacements themselves.

Residual semantic risk remains in adjacent unselected copy:

- `амттан` still appears in broader reward report output.
- Some report paths still describe fatigue/default-choice and collapse patterns with older phrasing. They are understandable, but not fully aligned with the latest editor-approved tone.

## 7. Safety wording issue

No new safety wording issue was introduced by WP71. Safety/professional-check scenarios still route to cautious language and do not block safety behind payment.

Existing safety route copy remains functional. No QPay, payment, or coming-soon behavior was touched.

## 8. More editor revisions needed before public launch

Yes. More editor revisions are recommended before public launch.

The selected WP71 patch was intentionally limited to 23 IDs. Runtime QA shows that the surrounding report voice library still contains older wording. A broader copy pass should review the report voices and compressed report paths before treating the Mongolian copy as launch-ready.

## 9. Recommendation

Recommended next WP:

- WP73: report-voice runtime copy cleanup.
- Scope should include one-time report voice, seven-day compressed report paths, hidden function evidence lines, reward-deficit wording, executive/default-choice wording, and collapse/shame wording.
- Keep it source-copy-only unless tests reveal functional defects.
- Do not deploy until WP73 passes `npm test` and a runtime report-output review.

## 10. Do-not-change guard confirmation

Confirmed during WP72:

- No deploy command was run.
- No DNS settings were changed.
- No Netlify settings were changed.
- `.netlify/state.json` was not modified.
- Payment flow was not modified.
- QPay was not modified.
- Coming-soon mode was not changed.
- Price/product guards remained unchanged:
  - `WEIGHT_TEST_COMING_SOON_MODE = true`
  - `9,900₮`
  - `WEIGHT_TEST_ONE_TIME`
  - QPay create/check endpoint strings
- No push, force push, merge, rebase, or reset was run.
- WP64/WP67 PDF packs were not touched.
- `audits/sprint-36-paid-depth-prototype/` was not touched.
- Editor handoff artifacts were not touched.
