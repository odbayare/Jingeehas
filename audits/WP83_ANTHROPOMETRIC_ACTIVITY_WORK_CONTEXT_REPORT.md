# WP83 Anthropometric, Activity, and Work Context Report

## 1. Executive summary

WP83 integrates existing age, height, current weight, and target weight answers into the paid report, adds daily activity and work-context questions to the questionnaire, and expands the report so weight-goal context is interpreted alongside work movement, commute, schedule, eating opportunity, fatigue, and difficult or hazardous work conditions.

The implementation stays behavioral and context-based. It does not diagnose, promise weight loss, prescribe calories, recommend extreme restriction, or change payment/QPay/production guard logic.

## 2. Owner request summary

The owner requested that the report stop ignoring age, height, current weight, and target weight, and that the questionnaire ask more directly about daily movement, commute, job type, sitting/standing/manual work, shift work, hazardous/exhausting work, eating opportunity at work, and after-work fatigue.

The report now connects those inputs to eating patterns, stress, sleep, tobacco, согтууруулах ундаа, movement barriers, realistic first strategy, and unsafe or likely-to-fail strategies.

## 3. Anthropometric calculations added

Added helper logic in `app.js` for:

- Current BMI: `weightKg / heightMeters^2`, rounded to 1 decimal.
- Target BMI: `targetWeightKg / heightMeters^2`, rounded to 1 decimal.
- Weight to lose: current weight minus target weight.
- Percent of current weight: weight to lose divided by current weight.
- Conservative time range using 0.45-0.9 kg/week.
- Target BMI caution when target BMI is under 18.5.
- Invalid/missing-data handling without inventing values.

User-facing BMI language states that BMI is a rough height/weight reference and does not capture muscle, bone structure, fat distribution, or all health context.

## 4. New daily activity/work context questions

Added a new questionnaire section:

`Үе 1 · Өдөр тутмын хөдөлгөөн ба ажлын нөхцөл`

New questions cover:

- Work movement level.
- Commute/daily destination movement.
- Daily non-exercise movement.
- Work schedule rhythm.
- Eating opportunity at work.
- After-work fatigue.
- Difficult or risky work conditions.

These answers are tagged as context and are used for inference, not blame.

## 5. New report sections

The paid one-time expanded report now includes:

- `Биеийн суурь зураглал`
- `Өдөр тутмын хөдөлгөөн ба ажлын нөхцөл таны зорилтод яаж нөлөөлж байна вэ?`
- `Танд илүү тохирох эхний стратеги`

The anthropometric section shows age, height, current weight, target weight, current BMI, target BMI, kg to lose, percent of current weight, and realistic time range when valid.

## 6. Inference mechanisms added

Added work/activity inference patterns for:

- Sedentary-low-NEAT pattern.
- Work-from-home cue pattern.
- Heavy/manual-work recovery pattern.
- Shift/night-work rhythm pattern.
- Work-stress eating pattern.
- Eating-opportunity instability pattern.
- Hazardous/difficult condition caution.

These patterns feed question metadata, report evidence, secondary factors, weight-impact paragraphs, avoid-list cautions, first-step selection, and the 7-14 day experiment.

## 7. Strategy personalization logic

The first strategy now adapts to combined context:

- Sedentary/car/low movement: small walking or standing breaks and low-friction movement.
- Heavy/manual work: meal timing, backup food/snack, hydration, recovery meal, and no extra punishing workouts first.
- Shift/night work: shift-based meal anchors and no generic evening-food ban.
- Work from home or food nearby: food visibility boundary and work/food zone separation.
- High-stress work: decompression pause and default dinner to reduce decision load.
- Согтууруулах ундаа after-effect plus fatigue: plan food/water before use and avoid next-day harsh restriction.

## 8. Safety handling

Safety-first report routes still suppress ordinary weight-loss planning. Professional/urgent routes do not show ordinary BMI timelines or activity plans as if they were normal recommendations.

Target BMI under 18.5 suppresses ordinary timeline language and warns that the target may be too low, recommending professional guidance.

Hazardous/heavy work context adds caution against fasting, dehydration, aggressive restriction, and punishing intense exercise when work load or body symptoms are significant.

## 9. Tests added/updated

Added:

- `tests/wp83-anthropometric-activity-work-context.test.js`

Updated:

- `tests/run-all.js`

The new test covers BMI helpers, target BMI, kg/percent to lose, week range, invalid data handling, low-target BMI caution, all new questions/options, anthropometric report section, work/activity report section, sedentary scenario, heavy-work scenario, work-from-home cue scenario, shift/night-work scenario, safety-route suppression, and guard strings.

## 10. Validation results

Passed:

- `/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js`
- `/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/wp83-anthropometric-activity-work-context.test.js`
- `/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/wp82-qa-skip-paywall.test.js`
- `/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/wp81-report-depth-expansion.test.js`
- `/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/wp80-context-safe-open-text.test.js`
- `/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/wp79-conditional-branching.test.js`
- `/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/wp78-question-bank-coverage.test.js`
- `/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/wp78-report-inference-quality.test.js`
- `PATH=/Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH /Users/odbayare/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/run-all.js`
- `git diff --check`

Note: local `npm` was not available in this shell, so the project test script was run directly through `tests/run-all.js` with the bundled Node runtime on PATH.

## 11. Remaining issues

No blocking implementation issues remain for WP83 source/test scope.

One follow-up candidate: the seven-day diary could later ask recurring work-shift context day by day, but WP83 only required stage-one questionnaire/report integration.

## 12. Guard confirmations

Confirmed:

- `WEIGHT_TEST_COMING_SOON_MODE = true` remains in repo source.
- `WEIGHT_TEST_QA_PAYMENT_BYPASS = false` remains in repo source.
- `WEIGHT_TEST_QA_SKIP_PAYWALL = false` remains in repo source.
- `9,900₮` remains in repo source.
- `29,000₮` remains in repo source.
- `WEIGHT_TEST_ONE_TIME` remains in repo source.
- QPay endpoint strings remain present and unchanged.
- No production deploy was run.
- No DNS, Namecheap, Netlify settings, domains, or `.netlify/state.json` were changed.
- `audits/sprint-36-paid-depth-prototype/` was not modified.
- WP64/WP67 PDF packs were not modified.
- TIAS/lifepattern-tias was not touched.

## 13. QA draft recommendation

Recommended next transport step is the requested QA-only Netlify draft deploy from the WP83 commit, using a clean worktree and a sanitized publish directory with QA-only temporary flag changes:

- `WEIGHT_TEST_COMING_SOON_MODE = false`
- `WEIGHT_TEST_QA_PAYMENT_BYPASS = true`
- `WEIGHT_TEST_QA_SKIP_PAYWALL = true`

Do not production deploy. Do not modify repo source for QA flag values.
