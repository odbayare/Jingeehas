# JINGEEHAS V5 BODY + FUNCTIONAL CONTEXT SPEC

Date: 2026-09-07
Status: IMPLEMENTATION CONTRACT
Branch: `codex/v5-body-functional-context`
Baseline main: `b475cc6abd8db693960915d888a00c4190bed394`

## Objective

Improve information quality while reducing question burden. Preserve all historical questionnaire/report behavior. Add non-diagnostic body and functional context, repair the previous-attempt maintenance signal, reduce unused/sensitive question collection, and interrupt the commercial flow immediately when an existing safety rule is triggered.

## Version

New questionnaire version:

`jingeehas-production-2026-09-v5-body-functional-context`

Historical versions remain immutable.

Question versioning must support both:

- `introducedIn`
- `retiredIn`

A question is available only when the requested version is at or after `introducedIn` (if present) and before `retiredIn` (if present).

Never reuse an old question ID for a new meaning.

## V5 question bank

1. `Q-AGE` — KEEP
2. `Q-SEX` — KEEP
3. `Q-HEIGHT` — KEEP
4. `Q-WEIGHT` — KEEP
5. `Q-TARGET` — KEEP
6. `Q-WAIST` — ADD
7. `Q-MEAL-RHYTHM` — KEEP
8. `Q-HUNGER` — KEEP
9. `Q-SATIETY` — KEEP
10. `Q-FUNCTION` — ADD; replaces the user-facing role of retired `Q-FOOD-FEELING`
11. `Q-PORTION` — KEEP
12. `Q-EMOTION` — KEEP
13. `Q-CUE` — KEEP
14. `HFE-HOUSEHOLD` — KEEP exact household architecture
15. `HFE-CONTEXT` — KEEP exact household architecture
16. `Q-SLEEP-DURATION` — KEEP
17. `Q-SLEEP-QUALITY` — KEEP
18. `Q-TRAVEL` — KEEP for V5
19. `Q-MOVEMENT` — KEEP
20. `Q-MEDICAL-MONITORING` — ADD; replaces V5 use of `Q-GLUCOSE` + `Q-BLOOD-PRESSURE`
21. `REPRO-STATUS` — ADD; replaces V5 use of `MC-GATE`, `PREG-GATE`, `PREG-BREASTFEEDING`, `MENO-GATE`
22. `MC-01` — KEEP as routed follow-up when menstrual-cycle status applies
23. `Q-ALCOHOL-FOOD` — ADD; replaces V5 use of `ALC-GATE` + `ALC-01`
24. `S1-S03` — KEEP clinical semantics; immediate professional route when current rule triggers
25. `S1-S04` — KEEP
26. `S1-S04-NOW` — KEEP routed immediate-risk follow-up
27. `S1-B01` — KEEP current semantics pending separate clinical wording review
28. `Q-METHOD-CURRENT` — KEEP
29. `Q-METHOD-PAST` — KEEP
30. `Q-METHOD-LONGEST` — KEEP routed linkage
31. `Q-METHOD-DURATION` — KEEP
32. `Q-METHOD-STOP` — KEEP
33. `Q-METHOD-RESULT` — KEEP
34. `Q-METHOD-REGAIN` — KEEP
35. `Q-MAINTENANCE-PLAN` — ADD targeted structured evidence
36. `Q-METHOD-SUPPORT` — KEEP
37. `Q-METHOD-MEDICATION` — KEEP
38. `Q-METHOD-BARRIERS` — KEEP

Retire in V5:

- `Q-FOOD-FEELING`
- `Q-GLUCOSE`
- `Q-BLOOD-PRESSURE`
- `MC-GATE`
- `ALC-GATE`
- `ALC-01`
- `TOB-GATE`
- `TOB-01`
- `PREG-GATE`
- `PREG-BREASTFEEDING`
- `MENO-GATE`
- `S1-S03-TYPE`
- `S1-S03-FREQUENCY`
- `OPEN-PAST`

## New question wording

### Q-WAIST

Text:

`Бүсэлхийн тойргоо мэддэг бол оруулна уу`

Type: number, optional, unit `см`.

Helper text:

`Мэдэхгүй эсвэл одоо хэмжих боломжгүй бол алгасаж болно.`

The product may provide a measurement help note based on the WHO protocol: measure around the midpoint between the lower margin of the last palpable rib and the top of the iliac crest, relaxed, at the end of a normal expiration.

Derived context when inputs are available:

- BMI = weight_kg / height_m^2
- waist-to-height ratio = waist_cm / height_cm
- target gap = current_weight_kg - target_weight_kg

These are context only and MUST NOT change psychological/behavioral pattern score or count.

### Q-FUNCTION

Text:

`Сүүлийн 3 сарын хугацаанд дараах өдөр тутмын үйлдлүүдээс аль нь танд мэдэгдэхүйц хэцүү байсан бэ?`

Options:

- `Алхах эсвэл шатаар өгсөх`
- `Хэсэг хугацаанд зогсох эсвэл алхах`
- `Бөхийх, гутлаа өмсөх зэрэг хөдөлгөөн`
- `Хувцаслах эсвэл хувийн арчилгаагаа хийх`
- `Гэрийн ажил эсвэл өдөр тутмын ажлаа хийх`
- `Дээрхээс аль нь ч мэдэгдэхүйц хэцүү биш`
- `Хариулахгүй`

Do not ask the user to attribute the difficulty to body weight. The test cannot establish causality.

Possible context flags:

- `functional_walking_constraint`
- `functional_standing_constraint`
- `functional_bending_constraint`
- `functional_self_care_constraint`
- `functional_daily_activity_constraint`

All are non-counted context.

### Q-MEDICAL-MONITORING

Text:

`Эмч эсвэл эрүүл мэндийн мэргэжилтэн танд дараах үзүүлэлтээс аль нэгийг тогтмол хянах шаардлагатай гэж хэлж байсан уу?`

Options:

- `Цусан дахь сахар`
- `Цусны даралт`
- `Хоёуланг нь`
- `Үгүй`
- `Мэдэхгүй`
- `Хариулахгүй`

Guidance-only context. No diagnosis and no core scoring.

### REPRO-STATUS

Show only on the existing sex-specific route.

Text:

`Танд одоогоор дараах нөхцөлөөс аль нь хамаарах вэ?`

Multi-select options:

- `Сарын тэмдгийн мөчлөгтэй`
- `Жирэмсэн`
- `Төрсний дараах 0–6 сар`
- `Төрсний дараах 6–24 сар`
- `Хөхүүл`
- `Цэвэршилтийн шилжилтийн үе эсвэл цэвэршсэн`
- `Дээрхээс аль нь ч хамаарахгүй`
- `Хариулахгүй`

If `Сарын тэмдгийн мөчлөгтэй` is selected, show existing `MC-01`.

Pregnancy/postpartum/breastfeeding states produce professional-guidance context only. Menopause is context only unless future evidence-backed guidance is explicitly added.

### Q-ALCOHOL-FOOD

Text:

`Та согтууруулах ундаа хэрэглэдэг бол хэрэглэсний дараа хооллолт тань ихэвчлэн хэр өөрчлөгддөг вэ?`

Options:

- `Согтууруулах ундаа хэрэглэдэггүй`
- `Өөрчлөгддөггүй`
- `Идэх хэмжээ нэмэгддэг`
- `Давслаг эсвэл тослог хоол илүү хүсдэг`
- `Тодорхой биш`
- `Хариулахгүй`

Preserve the existing alcohol-food-change context semantics. No core pattern anchor is added.

### Q-MAINTENANCE-PLAN

Show only when all are true:

- `Q-METHOD-DURATION` is `6–12 сар` or `1 жилээс урт`
- `Q-METHOD-RESULT` is `Жин буурсан`
- `Q-METHOD-REGAIN` is one of `Бага зэрэг нэмэгдсэн`, `Нэлээд нэмэгдсэн`, `Өмнөхөөс илүү нэмэгдсэн`

Text:

`Өмнөх арга тань зогсох эсвэл өдөр тутмын нөхцөл өөрчлөгдөх үед үр дүнгээ хадгалахад ашиглах өөр, хялбар хувилбар танд байсан уу?`

Options and signal contract:

- `Тийм, тодорхой хувилбар байсан` → protective/no maintenance gap
- `Зарим хувилбар байсан ч тогтсон төлөвлөгөө байгаагүй` → `maintenance_gap` effect +2
- `Үгүй, өөр хувилбар бэлдээгүй` → `maintenance_gap_explicit` effect +4
- `Тодорхой санахгүй` → neutral

`previous_attempt_sustainability` should no longer depend on extracting `maintenance_gap_explicit` from `OPEN-PAST` free text for V5.

## Core scoring invariants

The following MUST NOT create or increase a core psychological/behavioral pattern score:

- age
- sex
- height
- weight
- target weight
- BMI
- waist circumference
- waist-to-height ratio
- functional limitations
- household composition/context
- reproductive status
- medical-monitoring context

Household V4 invariants remain exact: household context is direct, non-causal and non-counted and may only adapt interpretation/recommendation feasibility.

## Body/function module

Add a dedicated body/function context layer rather than adding signals directly to core pattern scoring.

Suggested output:

```js
{
  status: "assessed" | "partial" | "not_assessed",
  bmi: number | null,
  waistCm: number | null,
  waistToHeightRatio: number | null,
  targetWeightKg: number | null,
  targetGapKg: number | null,
  functionalFlags: [],
  certainty: "self_report_context"
}
```

The report can use this layer for factual body-context explanation and recommendation feasibility. It must not label clinical obesity or diagnose disease.

## Safety interrupt contract

Do not change clinical thresholds in this technical release.

Existing safety rules must be evaluated immediately after saving a relevant safety answer, not only at assessment completion.

Flow:

- `S1-S04` positive → show `S1-S04-NOW`
- `S1-S04-NOW` current-risk trigger → terminal urgent-self-harm route
- `S1-S04-NOW` no immediate risk while recent screen is positive → terminal mental-health-support route
- `S1-B01` existing urgent trigger → terminal urgent-medical route
- `S1-S03` existing recent-compensatory trigger → terminal eating-behavior-professional route

Once terminal safety routing occurs:

- do not continue commercial questions
- do not show paywall
- do not create an invoice
- do not require S1-S03 TYPE/FREQUENCY

Safety semantics/thresholds are explicitly out of scope for V5 technical optimization.

Separate clinical-content review remains required for:

- interpretation/wording of `олон цаг хоолгүй явах` in `S1-S03`
- precision of `Будилах` in `S1-B01`

## Analytics contract

Question analytics must keep historical meanings separate. Add labels/section mapping for new IDs.

Do not compare V4 and V5 using one undifferentiated completion metric.

Expose at least:

- terminal completion
- commercial completion
- safety exit
- commercial completion rate
- safety exit rate

Existing clean-control analytics already distinguishes safety bypass from commercial eligibility; preserve that principle.

## Production-data rationale

For V4 live-progress cohort 2026-08-08 through 2026-09-07:

- cohort starts: 524
- live progress coverage: 503
- completed: 394
- overall completion: 75.2%
- average questions reached: 37.3
- median: 41
- p75: 43
- max: 46

Largest confirmed question drop-off:

- `OPEN-PAST`: 388 reached, 358 answered, 32 confirmed stopped, 8.3% confirmed drop-off

Current free-text extraction produced zero `strict_open_text_anchor` and zero `maintenance_gap_explicit` matches in the audited cohort, while 48 users met the structured duration/result/regain prerequisites for a maintenance follow-up.

V5 routing backtest on current cohort (before adding the optional waist item):

- old average: 37.3
- simulated V5 average: 31.0
- old median: 41
- simulated V5 median: 34
- old p75: 43
- simulated V5 p75: 35
- average reduction: 6.4 questions

With optional `Q-WAIST`, practical target remains average <=33 and median <=35.

## Clinical evidence boundaries

Waist/waist-to-height information is supporting anthropometric context, not a psychological score and not a clinical diagnosis.

Functional difficulty is self-reported context. The online test does not establish that weight caused the limitation.

Compensatory behaviors remain safety/professional-assessment signals; do not weaken existing routing merely because safety prevalence is commercially inconvenient.

## Acceptance gates

1. V1–V4 visible questions and validation remain unchanged.
2. Historical reports/snapshots are not migrated or regenerated automatically.
3. Household V4 core-score invariance tests remain PASS.
4. New body/function context does not change core score, active pattern count or counted interactions.
5. `previous_attempt_sustainability` works from V5 structured maintenance evidence and does not require vague free-text extraction.
6. `OPEN-PAST` is not visible in V5.
7. Existing safety trigger semantics are unchanged, but terminal safety routing happens immediately.
8. Terminal safety routing bypasses commercial continuation/paywall/invoice creation.
9. Unnecessary `S1-S03-TYPE` and `S1-S03-FREQUENCY` are not collected in V5.
10. Current-cohort routing backtest target: average <=33, median <=35, p75 <=36.
11. Question-progress analytics separate safety exits from commercial completions.
12. `npm test` PASS.
13. `npm run test:contracts` PASS.
14. `npm run build:production` PASS.
15. `npm run verify:production-package` PASS.
16. Relevant E2E routing/safety tests PASS before release.

## Release boundary

This branch is implementation-only. Do not merge to `main`, deploy production, alter price/payment behavior, regenerate historical paid reports, or change safety clinical thresholds without separate release approval.
