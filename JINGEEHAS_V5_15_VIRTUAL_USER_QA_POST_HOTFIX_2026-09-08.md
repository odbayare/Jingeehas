# Jingeehas V5 — 15 Virtual User QA, Post-Hotfix

**Date:** 2026-09-08  
**Status:** `PR_READY_AND_QA_VERIFIED`  
**Scope:** Synthetic-only local QA. No production database, QPay, Meta, deployment, merge, or production analytics mutation.

## 1. Baseline and isolation

| Item | Value |
|---|---|
| Baseline | `origin/main` |
| Baseline SHA | `b9745a0c40ab5ed25b882aecd1fed94f0e4545ce` |
| Branch | `codex/v5-sequential-navigation-hotfix` |
| Implementation commit | `c37c3ca` |
| Questionnaire | `jingeehas-production-2026-09-v5-body-functional-context` |
| Isolated worktree | `/Users/odbayare/Documents/Weight Loss Test-v5-sequential-hotfix` |
| Production | **NOT MERGED / NOT DEPLOYED / PRODUCTION UNCHANGED** |

The dirty canonical checkout was not reset, cleaned, stashed, or modified except for adding this new, non-overwriting QA report at the explicitly requested path.

## 2. Defect disposition

| ID | Severity | Confirmed cause | Fix | Post-fix evidence |
|---|---:|---|---|---|
| D1 | P1 | An untouched optional answer was `undefined`; JSON serialization dropped its key. The client then required `savedQuestionIds`, while the server did not distinguish substantive saves from blank clears. | Shared `isBlankAnswerValue(question, value)`; client sends explicit `null`; server validates blank optional answers, deletes any prior row, and returns distinct `savedQuestionIds`, `clearedQuestionIds`, and `processedQuestionIds`. Client advances on processed acknowledgment with backward-compatible fallback. | Q-TARGET, Q-WAIST, Q-FUNCTION, and Q-MEDICAL-MONITORING blank-save contracts pass. Required blank still blocks. Explicit `Хариулахгүй` persists. Answer-back-clear deletes. Blank skips do not set `answeredAt`. No `answer_not_confirmed` in 15-user browser run. |
| D2 | P2 | V5 correctly changed MC-01's parent to REPRO-STATUS, but static canonical order still placed MC-01 before the parent. | Generic stable topological `orderedQuestions(version)`; `visibleQuestions` and question analytics share this order. Static `QUESTIONS` was not blindly reordered. Generic descendant pruning removes stale answers. | V5 female menstrual route is REPRO-STATUS → MC-01; other female routes omit MC-01; male routes omit both. V4 remains MC-GATE → MC-01 with no REPRO-STATUS. V1–V5 order/analytics snapshots pass. REPRO change and female→male stale pruning pass. |
| D3 | P1, found during post-hotfix browser completion | U06's four interactions generated repeated substantive management-plan sentences, causing the real report activation contract to reject completion with `duplicate_substantive_paragraph`. The earlier logic-only harness had not exercised this activation gate. | Stable interaction-pair deduplication plus pair-specific, non-duplicated management wording. Scoring, supported interaction IDs, and safety logic are unchanged. | U06 real browser completion now reaches `/assessment/result`; focused activation regression and full suite pass. |
| Build-path unblock | Tooling | Several ESM scripts used URL-encoded `import.meta.url.pathname`, so a repository path containing spaces resolved as `%20`. | Standard Node `fileURLToPath(import.meta.url)` in the affected build/verification scripts. | Production/staging package commands pass locally; no deployment occurred. |

## 3. Test gates

| Command | Result |
|---|---|
| `node --check app.js` | PASS |
| Focused D1/D2/D3 tests | PASS |
| `npm test` | PASS |
| `npm run test:e2e` | PASS — 31/31, including real sequential 15-user test |
| `npm run test:contracts` | PASS |
| `npm run verify:production-package` | PASS — 13 static files, 76 function files, 18 required endpoints |
| `npm run verify:database-config` | **BLOCKED (configuration-only)** — missing `JINGEEHAS_DATABASE_API_URL`, `JINGEEHAS_DATABASE_API_KEY`; no network request |
| `npm run verify:database-gateway-auth` | PASS — missing/invalid bearer 401, GET 405, no database record created |
| `npm run verify:recovery-config` | **BLOCKED (configuration-only)** — required recovery secrets/config absent |
| `npm run verify:qpay-config` | **BLOCKED (configuration-only)** — QPay sandbox config absent; no external request |
| `npm run verify:domain-config` | PASS for repository consistency; QPay callback blocked by missing config; owner verification pending; DNS unchanged |
| `npm run build:staging` | PASS — 92 files, 42 functions; no deployment |
| `npm run verify:staging-package` | PASS — 18 required endpoints; no deployment |
| `git diff --check` | PASS |

Configuration-only BLOCKED results are not represented as PASS and do not certify external database, recovery delivery, or QPay connectivity.

## 4. 15-user logic and real-browser matrix

The Playwright test used the real shipped `app.js` question form, one question at a time, with a server backed by the production `saveAssessment`, `completeAssessment`, V5 enrichment, and report activation contracts. Answers were selected through visible DOM controls only; no answer-state injection was used.

| User | Scenario | Logical questions | Actual browser visits | Terminal route | Optional blank acknowledgment | Result |
|---|---|---:|---:|---|---|---|
| U01 | Neutral female; blank waist/function; menstrual | 28 | 28 | commercial eligible → `/assessment/result` | Q-WAIST + Q-FUNCTION processed/cleared | PASS |
| U02 | Neutral male; blank waist/function | 26 | 26 | commercial eligible → `/assessment/result` | Q-WAIST + Q-FUNCTION processed/cleared | PASS |
| U03 | Irregular meals / late hunger | 26 | 26 | commercial eligible → `/assessment/result` | n/a | PASS |
| U04 | Female; very short, poor sleep; menstrual | 28 | 28 | commercial eligible → `/assessment/result` | n/a | PASS |
| U05 | Postpartum / household pressure | 28 | 28 | commercial eligible → `/assessment/result` | n/a | PASS |
| U06 | Multi-pattern / menopause context | 27 | 27 | commercial eligible → `/assessment/result` | n/a | PASS |
| U07 | Pregnant / strict prior attempt | 33 | 33 | commercial eligible → `/assessment/result` | n/a | PASS |
| U08 | Explicit maintenance gap | 33 | 33 | commercial eligible → `/assessment/result` | n/a | PASS |
| U09 | High-pattern, lives alone | 31 | 31 | commercial eligible → `/assessment/result` | n/a | PASS |
| U10 | U09 core twin + household context | 32 | 32 | commercial eligible → `/assessment/result` | n/a | PASS |
| U11 | U08 twin + clear maintenance plan | 33 | 33 | commercial eligible → `/assessment/result` | n/a | PASS |
| U12 | U02 core twin + waist/function context | 26 | 26 | commercial eligible → `/assessment/result` | n/a | PASS |
| U13 | Recent compensatory behavior | 24 | 24 | `eating_behavior_professional` → `/report` | n/a | PASS |
| U14 | Immediate self-harm risk | 24 | 24 | `urgent_self_harm` → `/report` | n/a | PASS |
| U15 | Acute medical symptom | 24 | 24 | `urgent_medical_symptom` → `/report` | n/a | PASS |

**Totals:** logic 15/15; real browser 15/15; eligible 12; safety-routed 3; P0 = 0; P1 = 0; P2 = 0 after fixes.

U13–U15 did not visit method-history questions. They did not open a commercial paywall, create an invoice, check payment, or open a paid report.

## 5. Detailed sequential evidence

### U01

- Actual order around the two repaired gates: `Q-TARGET → Q-WAIST(blank) → Q-MEAL-RHYTHM` and `Q-SATIETY → Q-FUNCTION(blank) → Q-PORTION`.
- Both blank submissions were serialized as explicit `null`.
- Each response included the current ID in `processedQuestionIds` and `clearedQuestionIds`, with no answer row persisted.
- Menstrual path visibly visited `REPRO-STATUS` and then `MC-01`; MC-01 was answered via its radio control.
- Actual visits: 28; logical route: 28; terminal: eligible result.

### U02

- Actual order around repaired blank gates matched U01, with Q-WAIST and Q-FUNCTION processed as clears.
- Male path visibly omitted REPRO-STATUS and MC-01.
- Actual visits: 26; logical route: 26; terminal: eligible result.
- Core scores and counted interactions exactly match U12 despite U12's waist/function values.

### U04

- Q-FUNCTION was explicitly answered `Аль нь ч биш` and persisted as substantive evidence, not treated as a blank skip.
- Female menstrual path visibly visited `REPRO-STATUS` before `MC-01`; there was no harness insertion.
- Actual visits: 28; logical route: 28; terminal: eligible result.
- Supported logic: `sleep_fatigue`; it is rendered as a contextual factor, not mislabeled as a core influencing-pattern title.

## 6. Scoring and contextual firewalls

### U02 ↔ U12 body/function firewall

| Check | U02 | U12 | Verdict |
|---|---|---|---|
| Core scores | all nine pattern scores 0 | all nine pattern scores 0 | EXACT MATCH |
| Counted interactions | none | none | EXACT MATCH |
| Body inputs | waist/function blank | waist 105; walking/stairs + bending difficulty | Context differs only |
| Core pattern titles | none | none | EXACT MATCH |

### U09 ↔ U10 household firewall

| Pattern | U09 | U10 |
|---|---:|---:|
| previous_attempt_sustainability | 8, unsupported | 8, unsupported |
| environmental_cues | 7, supported | 7, supported |
| irregular_meals_late_hunger | 6, supported | 6, supported |
| emotional_regulation | 6, supported | 6, supported |
| hunger_satiety | 4, supported | 4, supported |
| sleep_fatigue | 4, supported | 4, supported |
| low_movement | 4, supported | 4, supported |
| restrictive_rebound | 3, unsupported | 3, unsupported |
| plan_daily_life_mismatch | 3, unsupported | 3, unsupported |

Counted interactions are the same for both: `meal_hunger_satiety`, `sleep_emotion`, `cue_meal_rhythm`, `cue_satiety`, `cue_movement`. U10 alone receives household contextual links/factors.

### U08 ↔ U11 maintenance anchor

- U08: `maintenance_gap_explicit` present; `previous_attempt_sustainability=15`, supported.
- U11: no maintenance-gap anchor; `previous_attempt_sustainability=11`, unsupported.
- Both retain the same unrelated meal/hunger interaction behavior.

## 7. Core titles versus contextual-factor titles

| User | Core influencing-pattern titles | Contextual-factor titles |
|---|---|---|
| U01/U02/U12 | none | body/function factors are enrichment-only where applicable; no core score change |
| U04 | none | Нойр, ядаргаа өдөр тутмын сонголтыг хүндрүүлэх нөхцөл |
| U05 | Орчны дохио идэх хүсэлд нөлөөлөх хэв маяг; Өлсөх, цадах мэдрэмжийг цагт нь анзаарахад хүндрэлтэй хэв маяг | Өдрийн хөдөлгөөний суурь түвшин бага байх нөхцөл; Согтууруулах ундааны дараах хоолны сонголт; Гэрийн хоолны орчин |
| U06 | Орчны дохио идэх хүсэлд нөлөөлөх хэв маяг; Хоолны зай уртсаж, өлсөлт оройтож мэдрэгдэх хэв маяг; Өлсөх, цадах мэдрэмжийг цагт нь анзаарахад хүндрэлтэй хэв маяг | Өдрийн хөдөлгөөний суурь түвшин бага байх нөхцөл; Согтууруулах ундааны дараах хоолны сонголт |
| U08 | Өмнөх аргын үр дүнг хадгалах төлөвлөгөө дутсан нь; Хоолны зай уртсаж, өлсөлт оройтож мэдрэгдэх хэв маяг; Өлсөх, цадах мэдрэмжийг цагт нь анзаарахад хүндрэлтэй хэв маяг | Нойр, ядаргаа өдөр тутмын сонголтыг хүндрүүлэх нөхцөл; Өдрийн хөдөлгөөний суурь түвшин бага байх нөхцөл; Согтууруулах ундааны дараах хоолны сонголт; Цагийн хуваарьт багтах шаардлага |
| U09/U10 | Орчны дохио идэх хүсэлд нөлөөлөх хэв маяг; Хоолны зай уртсаж, өлсөлт оройтож мэдрэгдэх хэв маяг; Сэтгэл хөдлөл ихсэх үед хоол руу татагдах хэв маяг; Өлсөх, цадах мэдрэмжийг цагт нь анзаарахад хүндрэлтэй хэв маяг | Нойр, хөдөлгөөн, alcohol-food, schedule; U10 additionally household context |
| U11 | Хоолны зай уртсаж, өлсөлт оройтож мэдрэгдэх хэв маяг; Өлсөх, цадах мэдрэмжийг цагт нь анзаарахад хүндрэлтэй хэв маяг | Нойр, хөдөлгөөн, alcohol-food, schedule |

The test asserts that no rendered core title is duplicated as a contextual-factor title.

## 8. Burden and limitations

- Primary burden measure is **actual browser visits**, not theoretical maximum: 24–33 per persona in this cohort.
- Logical counts are reported separately and matched actual visits for all 15.
- This is synthetic local QA. It does not certify live secrets, production provider connectivity, merchant settlement, DNS ownership, recovery delivery, or a production deployment.
- No real customer data, payment, entitlement, Meta event, or production analytics record was created or changed.

## 9. Final release boundary

**PR_READY_AND_QA_VERIFIED**

The branch is suitable for review as a hotfix candidate. It is not production authority until reviewed, merged, deployed, and separately smoke-verified under an explicitly authorized production workflow.

**NOT MERGED / NOT DEPLOYED / PRODUCTION UNCHANGED**

