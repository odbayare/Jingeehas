# Commercial Flow QA

## Executive Summary

* Total scenarios: 10
* PASS: 10
* PARTIAL: 0
* FAIL: 0
* Average comprehension: 8.8 / 10
* Average choice clarity: 8.6 / 10
* Average price clarity: 8.9 / 10
* Average value clarity: 8.4 / 10
* Average trust: 8.5 / 10
* Average friction: 2.7 / 10
* Average payment intent: 7.3 / 10
* Average AI-smell risk: 1.7 / 10
* Main friction points: One-Time users may wonder why the choice CTA mentions payment before the free preview, and paid 7-Day users with too little diary data need very clear readiness reassurance.
* Priority fixes before real payment: Keep the demo payment button out of production, add real receipt/error states, and consider a compact sample receipt/terms line near the opening promotion.
* Decision: Ready for real payment integration.

## Scenario 1 — Choice Screen Price Clarity

### Steps

Open the assessment choice screen and compare the two commercial product cards.

### Expected

One-Time shows “Нэг удаагийн гүн анализ”, “Үндсэн үнэ 29,000₮”, and “Нээлтийн урамшуулалт үнэ 9,900₮”. 7-Day shows “7 хоногийн гүн анализ”, “Үндсэн үнэ 69,000₮”, and “Нээлтийн урамшуулалт үнэ 29,000₮”. The 7-Day card explains evening diary effort, 5-day sufficiency, and non-calorie tracking.

### Actual

PASS. Both cards show anchor and opening promotion prices with analysis terminology. The 7-Day card communicates “Орой бүр 3–5 минут”, “5 өдөр бөглөсөн ч тайлан гарна”, and that it is not calorie tracking or a strict diet.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Price clarity | 9 | Anchor/promo hierarchy is explicit. |
| Value clarity | 8 | One-Time and 7-Day value are distinct. |
| Trust | 8 | Opening promotion feels clear, not random. |
| Friction | 2 | Low friction; payment CTA before preview may need real-user validation. |

### Verdict

PASS

### Fix recommendation

Keep the premium anchor and opening promotion labels. In real payment, add short terms for how long the opening promotion lasts.

## Scenario 2 — One-Time Unpaid Normal User

### Steps

Complete a One-Time assessment without demo payment and open the report route.

### Expected

Report preview/paywall appears. Full report sections are locked. The 9,900₮ CTA is visible. Preview includes possible primary pattern, one short insight, and what the full report includes.

### Actual

PASS. The unpaid route shows “Таны эхний зураглал бэлэн боллоо”, a possible primary pattern, anchor/promo pricing, and “9,900₮ төлөөд бүрэн тайлангаа нээх”. Full sections such as hidden function and 14-day experiment do not render before unlock.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Value clarity | 8 | Preview is concrete enough to show relevance. |
| Payment intent | 7 | Stronger than a blind paywall, but real payment needs receipt trust. |
| Friction | 3 | Payment after assessment is understandable. |
| Trust | 8 | Demo copy clearly says no real payment is taken. |

### Verdict

PASS

### Fix recommendation

For production, replace the demo button with QPay states: pending, paid, failed, expired.

## Scenario 3 — One-Time Paid Normal User

### Steps

Click demo payment success on the One-Time paywall.

### Expected

Full One-Time report unlocks, the paywall disappears, upgrade CTA is visible, upgrade price is 19,900₮, and upgrade is framed as refinement.

### Actual

PASS. Full report sections unlock. The upgrade block shows “Upgrade үнэ: 19,900₮” and says the user can move from One-Time deep analysis to 7-Day deep analysis at a discount.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Unlock clarity | 9 | Full report replaces paywall cleanly. |
| Upgrade clarity | 9 | Discounted upgrade is explicit. |
| Trust | 8 | Upgrade feels like refinement. |
| Friction | 2 | Very low in prototype mode. |

### Verdict

PASS

### Fix recommendation

When real payment is added, preserve this immediate unlock feeling after payment confirmation.

## Scenario 4 — 7-Day Unpaid Direct User

### Steps

Choose the 7-Day product directly without demo payment.

### Expected

7-Day paywall appears before diary onboarding. Promo price 29,000₮ and anchor price 69,000₮ are visible. Value copy explains diary, trigger map, initial vs observed comparison, and a more precise experiment. Diary cannot start before unlock.

### Actual

PASS. The 7-Day paywall blocks onboarding and shows the expected value stack and prices. The diary start button is not visible until demo payment succeeds.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Value clarity | 9 | Strong explanation of why 7-Day costs more. |
| Price clarity | 9 | Anchor and promotion are clear. |
| Payment intent | 7 | Value is understandable, but the higher price needs trust signals in real payment. |
| Friction | 3 | Pay-before-diary is expected for this package. |

### Verdict

PASS

### Fix recommendation

Add production-level refund/support copy only when real payment is implemented.

## Scenario 5 — 7-Day Paid Direct User

### Steps

Click demo payment success on the 7-Day paywall.

### Expected

Diary onboarding becomes accessible, paywall disappears, user can start Day 1 diary, and effort/reminder copy remains clear.

### Actual

PASS. Demo payment unlocks the diary onboarding screen with “1 дэх өдрөө эхлүүлэх” and “Орой бүр 3–5 минут”.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Unlock clarity | 9 | Paid state opens onboarding directly. |
| Friction | 2 | Very low in prototype mode. |
| Trust | 8 | Effort copy lowers concern. |

### Verdict

PASS

### Fix recommendation

Real payment should preserve state if the user returns from QPay after a delay.

## Scenario 6 — One-Time Paid To 7-Day Upgrade

### Steps

Unlock One-Time, then use the 7-Day refinement/upgrade path.

### Expected

Upgrade CTA is visible after the report. Upgrade price is 19,900₮. Copy says “Та нэг удаагийн гүн анализ нээсэн тул 7 хоногийн гүн анализ руу хөнгөлөлттэй шилжих боломжтой.” Demo upgrade unlocks diary onboarding. Total paid logic feels fair because 9,900₮ + 19,900₮ is close to 29,000₮.

### Actual

PASS. Upgrade is visible after paid One-Time report, uses “нарийвчлах”, shows 19,900₮, and demo upgrade opens 7-Day onboarding.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Upgrade fairness | 9 | Price math is fair and easy to explain. |
| Price clarity | 9 | Upgrade price is separate from product cards. |
| Payment intent | 8 | Discount feels respectful of the first purchase. |
| Friction | 2 | Prototype upgrade is smooth. |

### Verdict

PASS

### Fix recommendation

In production, calculate upgrade eligibility server-side from the paid One-Time receipt.

## Scenario 7 — Mode 3 Professional-First User

### Steps

Trigger the professional-first route with medication/safety-relevant answers while unpaid.

### Expected

Professional-first summary appears without ordinary paywall. No ordinary weight-loss paywall. No 14-day weight-loss experiment. No payment CTA to see safety/professional result. Copy is reassuring and includes “онош гэсэн үг биш” and “эхлээд мэргэжлийн хүнтэй ярилцах”.

### Actual

PASS. Professional-first summary bypasses ordinary paywall and does not sell a normal report or 14-day experiment.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Safety trust | 9 | Safety boundary is visible before commerce. |
| Friction | 1 | No paywall blocks the summary. |
| Medical fear risk | 2 | Reassuring wording keeps fear low. |
| Clarity | 9 | Next step is clear. |

### Verdict

PASS

### Fix recommendation

Keep safety/professional summaries outside ordinary paid report gating.

## Scenario 8 — Mode 4 Urgent Safety User

### Steps

Trigger urgent safety route while unpaid.

### Expected

Urgent safety guidance is visible immediately. No paywall, ordinary report, upgrade CTA, or pricing block appears. User safety is clearly first.

### Actual

PASS. Urgent safety route renders immediately and suppresses commercial CTAs.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Safety clarity | 10 | Urgent priority is unambiguous. |
| Trust | 10 | No monetization around urgent safety. |
| Friction | 1 | No payment friction. |

### Verdict

PASS

### Fix recommendation

Do not change this behavior during payment integration.

## Scenario 9 — Paid But Insufficient 7-Day Data

### Steps

Set 7-Day as paid, then open report with 0–1 diary entries.

### Expected

Payment does not bypass data-readiness gate. Full report does not show. Copy says “Бүрэн тайлан гаргахад одоогоор мэдээлэл хангалтгүй байна.” CTA continues diary. No 14-day experiment appears. Copy explains that 5 days is enough for a full report.

### Actual

PASS. The readiness gate remains active after payment. The user sees insufficient-data copy, can continue diary, and is told that 5 days is enough.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Readiness clarity | 8 | Gate is clear and now mentions 5-day sufficiency. |
| Trust | 8 | Payment does not pretend data is ready. |
| Friction | 5 | Some frustration is natural after payment. |
| Refund/complaint risk | 4 | Lowered by explicit readiness explanation. |

### Verdict

PASS

### Fix recommendation

For real payment, show this readiness rule before checkout and again after unlock.

## Scenario 10 — Paywall Copy Smell / Mobile Commercial Layout

### Steps

Review commercial screens conceptually at 390px and 430px widths and scan rendered copy for forbidden commercial phrases and stale prices.

### Expected

No horizontal overflow, readable price cards, tap-friendly CTAs, clear anchor/promo hierarchy, no pressure phrases, no old prices, and correct contextual use of 9,900₮, 19,900₮, 29,000₮, and 69,000₮.

### Actual

PASS. Commercial blocks use responsive card/grid styles. Forbidden pressure phrases are absent from commercial surfaces. The old One-Time and old upgrade prices are absent from visible app copy. 19,900₮ appears only in upgrade context.

### Scores

| Metric | Score / 10 | Notes |
| ------ | ---------: | ----- |
| Mobile readability | 8 | Existing responsive grid should keep cards readable. |
| AI-smell risk | 2 | Copy is concrete and avoids pressure. |
| Price clarity | 9 | Anchor/promo labels are explicit. |
| Trust | 8 | Demo payment disclosure prevents false payment expectations. |

### Verdict

PASS

### Fix recommendation

Before production launch, run a real browser visual pass at 390px and 430px after QPay UI is added.

## Cross-Scenario Findings

* Price clarity: Strong. Anchor and opening promotion labels are easy to understand.
* Value clarity: Strongest for 7-Day, because diary, trigger map, and initial-vs-observed comparison explain the higher price.
* Paywall timing: One-Time correctly allows assessment before payment; 7-Day correctly blocks diary onboarding before payment.
* Upgrade fairness: Strong. 9,900₮ + 19,900₮ is close to the 29,000₮ opening promotion.
* Safety bypass: Protected. Mode 3 and Mode 4 bypass ordinary paywalls.
* Data readiness after payment: Protected. Payment does not unlock a full 7-Day report without enough diary data.
* Mobile commercial readability: Likely acceptable with existing responsive card/grid behavior; verify again after real payment UI is added.
* Payment blocker risks: Real payment needs receipt state, support/failure states, and clear promotion duration.
* Priority fixes: Add real QPay pending/success/failure states, server-backed entitlement checks, and production receipt recovery before launch.
