# WP84 Food Response Context Report

## Scope

WP84 adds an evidence-based food response context layer to the one-time report. It observes the user's own post-meal body response, digestion, hunger rebound, satiety, portion context, and easy-overeat foods.

This work intentionally does not add blood-type diet logic.

## Implementation Summary

- Added a Stage 1 section: `Үе 1 · Хүнсний зохицол ба биед өгөх мэдрэмж`.
- Added questions `S1-FR01` through `S1-FR07` for heavy foods, body response, timing/portion context, sustaining foods, easy-overeat foods, prior elimination attempts, and optional context text.
- Added food-response inference helpers for digestive heaviness, fast hunger rebound, easy-overeat foods, dairy context, flour/wheat context, red-meat context, salty/sugary swelling context, alcohol-food context, and restrictive elimination risk.
- Added the report section `Хүнсний зохицол, шингэц ба цатгалан мэдрэмж`.
- Adapted the 7-14 day experiment table to include one-variable food response experiments.
- Added safety language for persistent or severe digestive/body symptoms and restrictive elimination risk.
- Added regression coverage in `tests/wp84-food-response-context.test.js` and registered it in `tests/run-all.js`.

## Blood-Type Guard

The implementation does not:

- ask for blood type;
- recommend food based on blood type;
- restrict food based on blood type;
- use `O бүлэг`, `A бүлэг`, `B бүлэг`, or `AB бүлэг` as food categories;
- use strings such as `цусны бүлэгт тохирох` or `цусны бүлгээр`.

The optional helper explicitly frames the section as personal observed body response, not blood group guidance.

## Report Behavior

The paid report now explains:

- foods that feel heavy or hard to digest;
- body responses such as bloating, heaviness, reflux-like discomfort, sleepiness, hunger rebound, or next-day swelling feeling;
- timing and context such as large portions, late meals, skipped meals before dinner, rushing, stress, fatigue, alcohol-use context, and low movement;
- foods that feel sustaining or easier to keep stable;
- foods that are easy to overeat;
- interpretation based on user response rather than rigid avoid-forever lists;
- one first experiment for 7-14 days.

The language avoids diagnosis and avoids permanent elimination rules.

## Safety Behavior

The report directs the user toward professional guidance for repeated or severe symptoms such as persistent diarrhea/constipation, severe bloating, vomiting, blood in stool, unexplained weight loss, severe pain, frequent heartburn, fainting, severe dizziness, glucose/pressure concerns, or eating-disorder red flags.

It does not diagnose lactose intolerance, celiac disease, IBS, GERD, fatty liver disease, diabetes, or eating disorders.

## WP83 Preservation

WP83 anthropometric, activity, commute, work type, work schedule, eating opportunity, after-work fatigue, difficult-work-condition, BMI, target BMI, weight-to-lose, percent, and realistic time-range report logic remains present and covered by the WP83 regression test.

## Validation

Initial targeted validation passed:

- `node --check app.js`
- `node tests/wp78-question-bank-coverage.test.js`
- `node tests/wp78-report-inference-quality.test.js`
- `node tests/wp79-conditional-branching.test.js`
- `node tests/wp80-context-safe-open-text.test.js`
- `node tests/wp81-report-depth-expansion.test.js`
- `node tests/wp82-qa-skip-paywall.test.js`
- `node tests/wp83-anthropometric-activity-work-context.test.js`
- `node tests/wp84-food-response-context.test.js`

Full runner, guard scans, commit, push, and QA-only draft deploy will be recorded after final validation.

Full validation passed after `npm test` was attempted and failed because npm is unavailable in this shell:

- `npm test` -> `zsh:1: command not found: npm`
- `node tests/run-all.js` -> `All tests passed`

The full runner generated known tracked audit snapshot noise, which was restored before staging.
