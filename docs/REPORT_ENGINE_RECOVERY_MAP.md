# Report Engine Recovery Map

This recovery map covers only the one-time Jingeehas report logic. It does not restore the deleted multi-day product, mock backend, local entitlement state, legacy payment paths, cross-project domains, or old pricing.

| Original component | Purpose | Decision | Current question support | Dependencies explicitly rejected | Associated recovery tests |
|---|---|---|---|---|---|
| `MONGOLIAN_REPORT_STYLE_BIBLE.md` at `c10e8a1^` | Concrete Mongolian situations, verb-led sentences, short paragraphs, non-clinical tone | Keep as style guidance | All user-facing report copy | Literary imitation, old product surface, word-count padding | `tests/report-evidence.test.js` copy and forbidden-output checks |
| `publicMechanismCopy` in `app.js` at WP87 | Human-readable names for reward, regulation, hunger, cues, sleep, collapse, planning load | Adapt concepts only | `Q-EMOTION`, `Q-CUE`, `Q-MEAL-RHYTHM`, `Q-HUNGER`, `Q-SATIETY`, sleep, movement, and method-history questions | English mechanism labels, legacy Stage 1 IDs, deleted diary scores | Gold profiles and public-copy assertions |
| `caseMechanismCandidates` from WP85/WP86/WP87 | Require linked evidence before showing a formulation | Adapt into explicit per-option signals and independent pattern thresholds | All active structured production questions through `report-signals.js` | Regex inference across concatenated answers, old scores, diary entries, stage summaries, three-mechanism cap | Mapping coverage, opposite-answer, two-independent-answer, multi-pattern tests |
| `caseEvidencePoints` from WP87 | Compress evidence into meaningful links | Adapt | Current meal, hunger/satiety, emotion, cue, sleep, movement, attempt-history answers | Raw answer cards, dimension-count ranking, anthropometric causal claims | Evidence-summary and no-raw-ID assertions |
| WP87 flexible-recovery handling | Treat contradicting answers as strengths rather than ignoring them | Keep concept; remap to current protective answers | Stable emotion, regular meals, hunger/satiety ease, sleep quality, movement, sustained attempt, professional support | Deleted `S1-W06` answer and old recovery-rule UI | Protective-factor fixtures |
| WP86 relevance gates | Keep food, alcohol, tobacco, medication, cycle, and safety text out unless selected | Keep and strengthen | Current gated questions only | Always-on medical, menstrual, food, alcohol, tobacco, or medication copy | Prohibited-guidance and owner-report manual review |
| WP87 one-variable experiment | Change one variable while observing the rest | Keep | Every supported pattern through one recommendation ID | Combined food-plus-movement experiment and deleted-product scheduling | Recommendation uniqueness and prioritized-action tests |
| Cross-question previous-attempt cluster | Connect method, duration, result, stopping reason, regain, and barriers into one formulation | Add | Structured previous-method, duration, result, regain, barrier answers; open stop reason only corroborates context | Treating schedule, cost, injury, and regain as unrelated bullets; inferring a pattern from open text alone | Owner maintenance-transition fixture and evidence-trace assertions |
| Movement classification boundary | Keep low movement as a daily-life/contextual factor, never a psychological cause | Add | `Q-TRAVEL`, `Q-MOVEMENT` | Labeling activity level as a psychological pattern | Context classification and owner-report assertions |
| WP85 integrated food context | Food response is context unless connected to broader evidence | Adapt | `Q-FOOD-FEELING`, `Q-PORTION` | Food intolerance diagnosis, blood-type claims, isolated food as psychological cause | Food relevance and single-answer exclusion checks |
| `tests/wp85-case-formulation-report.test.js` | Evidence clusters and anti-diagnosis checks | Adapt assertions | Current question bank | Old section names, confidence labels, deleted payment flags | `tests/report-evidence.test.js` |
| `tests/wp86-humanized-case-formulation.test.js` | Natural Mongolian, de-duplication, relevance gates | Keep intent | Current question bank | Old English labels and legacy report surface | Copy-bank audit and duplicate-sentence checks |
| `tests/wp87-report-reasoning-fix.test.js` | Contradictions, protective factors, grouped evidence, one variable | Keep intent | Current question bank | Old Stage 1 IDs and one-primary/one-secondary ranking | Multi-factor fixtures and interaction checks |
| Prior virtual-user fixtures | Compare materially different profiles and catch leakage | Adapt profile intent | Fifteen deterministic current-bank profiles | Old raw fixtures, mock backend, old entitlement/payment state | `tests/fixtures/report-gold-profiles.js` |
| Old report snapshot | Preserve failed output as audit evidence | Keep unchanged in production | Preserved owner assessment | Overwriting or activating a proposal before review | Remote read-only comparison and zero-write verification |

## Current replacement boundaries

- `report-signals.js` is the only answer-option-to-signal contract.
- `report-patterns.js` evaluates every pattern independently, separates psychological, behavioral, and contextual categories, and does not force a fixed number of causes.
- `report-copy.js` contains complete Mongolian sentences and never appends suffixes to labels.
- `report.js` builds the multi-factor formulation, interactions, context, strengths, contradictions, actions, and internal trace.
- `publicReport()` removes raw question IDs and the internal evidence map from user and advisor API responses.
- The production snapshot remains untouched until the owner approves the actual proposed report.
