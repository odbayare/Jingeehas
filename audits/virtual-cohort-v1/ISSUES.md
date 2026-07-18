# Virtual Cohort V1 — Issues

**Status: OWNER DECISION REQUIRED. No production code fix was applied.**

## P0 — Blockers (5)

### P0-01 — Restrictive-rebound pattern is asserted without explicit strict-rule evidence

- Affected: VU-01, VU-02, VU-03, VU-04.
- Evidence: none selected “Хэт хатуу дүрэм” as a barrier, yet each report says a single deviation caused the whole plan to be abandoned and recommends loosening a strict rule.
- Impact: unsupported conclusion and wrong first experiment; the requested dominant emotional, environmental, irregular-meal, and satiety scenarios are displaced.

### P0-02 — Stable meal rhythm and long meal-gap conclusion coexist

- Affected: VU-04.
- Evidence: the user answered “3–4 цаг”, while the report both calls meal rhythm a strength and states that meal intervals are long and late hunger drives evening choices.
- Impact: direct internal contradiction and factual misstatement.

### P0-03 — Medium movement is described as high movement

- Affected: VU-01, VU-03, VU-04, VU-06.
- Evidence: all answered “Дунд”; all public reports state “Өдрийн хөдөлгөөн их байгаа”.
- Impact: hallucinated protective fact that can alter strategy and user trust.

### P0-04 — Menstrual/biological referral guidance is suppressed in neutral rendering

- Affected: VU-09.
- Evidence: the completed internal report contains the cycle-related professional guidance, but the exact public report shows only generic “асуумжид хамрагдаагүй шинж” scope.
- Impact: required referral behavior does not reach the user; safety completeness fails.

### P0-05 — Multi-select past methods are attributed as one movement-based attempt

- Affected: VU-01, VU-03, VU-05.
- Evidence: each selected more than one past method, but the report says the previous method was movement-based without knowing which method was the longest or produced the stated result.
- Impact: unsupported chronology and causal formulation.

## P1 — Major (6)

### P1-01 — Neutral next action ignores the only supported context

- Affected: VU-08, VU-09.
- VU-08 has low movement as the only material context; VU-09 has a biological follow-up context. Both receive the same generic food-moment observation.

### P1-02 — Distinct reports exceed the similarity ceiling

- Affected: VU-03/VU-04/VU-06 and VU-08/VU-09/VU-10 clusters.
- Five most similar pairs range from 79.6% to 92.9% exact personalized-sentence overlap. This is unacceptable for a paid individualized report.

### P1-03 — Supported low-movement context disappears when pattern slots are crowded

- Affected: VU-02.
- Internal evidence supports low movement from home work and low daily movement, but the public contextual section contains only schedule.

### P1-04 — Explicit injury narrative does not activate the specific injury-stop formulation

- Affected: VU-07.
- The open answer states that a knee injury made the prior exercise impossible to continue, yet the report falls back to generic pain/limitation wording and retains the older duplicated maintenance explanation.

### P1-05 — Maintenance report has no visible first experiment

- Affected: VU-07.
- The internal nonnumeric candidate remains unselected, so the paid public report jumps from direction to “what not to change” without an actionable experiment.

### P1-06 — Sleep/schedule experiment remains a generic category choice

- Affected: VU-05.
- The report asks the user to choose “one food or movement simplified option” instead of supplying a scenario-specific anchor tied to night-call fatigue and schedule.

## P2 — Minor (3)

### P2-01 — Restrictive pattern heading is unnatural Mongolian

“Хэт хатуу арга удаан үргэлжлэхгүй тасрах хэв маяг” is awkward and retains a “тасрах” construction the copy audit has otherwise tried to remove.

### P2-02 — Pattern sections repeat the same proposition

Several reports restate one idea in explanation, evidence, effect, interaction, and recommendation with little added information, increasing length without increasing paid value.

### P2-03 — Long multi-pattern reports lack prioritization clarity

VU-01, VU-03, VU-04, and VU-06 run roughly 638–715 words and enumerate four patterns before the action. The user must infer which claims are central versus secondary.

## Decision Gate

Do not deploy the report engine in its current state. Await owner direction before modifying thresholds, mapping, renderer behavior, or copy.
