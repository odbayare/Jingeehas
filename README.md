# Жин хасалтын гүн зураглал — mobile-first MVP demo

This workspace contains a runnable static MVP demo for the “Жин хасалтын гүн зураглал” product spec and User Journey v0.2.

## Run

Open `index.html` in a browser, or run a small local server:

```bash
python3 -m http.server 4177
```

Then open `http://127.0.0.1:4177/`.

## Test

Run everything:

```bash
npm test
```

Equivalent explicit commands:

```bash
node --check app.js
node tests/safety-readiness.test.js
node tests/voice-summary-confirmation.test.js
node tests/report-bible-sections.test.js
node tests/question-metadata-mechanisms.test.js
node tests/evidence-scoring-calibration.test.js
node tests/virtual-user-qa.test.js
node tests/ten-person-simulation-audit.test.js
node tests/partial-persona-fix.test.js
node tests/input-focus.test.js
node tests/report-compression-ai-smell.test.js
node tests/copy-localization.test.js
node tests/ai-blind-demo-panel.test.js
node tests/sample-preview-choice-clarity.test.js
node tests/pricing-paywall.test.js
node tests/commercial-flow-qa.test.js
node tests/backend-qpay-plan.test.js
node tests/mock-backend-entitlements.test.js
node tests/fake-payment-lead-capture.test.js
node tests/deep-mongolian-copy-rewrite.test.js
node tests/public-language-purge.test.js
```

## Demo Readiness checklist

For human demo validation, use [HUMAN_DEMO_QA.md](/Users/odbayare/Documents/Weight%20Loss%20Test/HUMAN_DEMO_QA.md).
For the synthetic 45-year-old male office-worker virtual QA pass, use [HUMAN_LIKE_VIRTUAL_USER_QA_45M_OFFICE.md](/Users/odbayare/Documents/Weight%20Loss%20Test/HUMAN_LIKE_VIRTUAL_USER_QA_45M_OFFICE.md).
For the Sprint 10 ten-person simulation audit, use [TEN_PERSON_SIMULATION_AUDIT.md](/Users/odbayare/Documents/Weight%20Loss%20Test/TEN_PERSON_SIMULATION_AUDIT.md).
For the Sprint 12 AI blind demo panel, use [AI_BLIND_DEMO_PANEL.md](/Users/odbayare/Documents/Weight%20Loss%20Test/AI_BLIND_DEMO_PANEL.md).
For the Sprint 15 commercial flow QA audit, use [COMMERCIAL_FLOW_QA.md](/Users/odbayare/Documents/Weight%20Loss%20Test/COMMERCIAL_FLOW_QA.md).
For the Sprint 16 backend and QPay integration plan, use [BACKEND_QPAY_INTEGRATION_PLAN.md](/Users/odbayare/Documents/Weight%20Loss%20Test/BACKEND_QPAY_INTEGRATION_PLAN.md).
For the Sprint 17 mock backend and entitlement persistence layer, use [MOCK_BACKEND_ENTITLEMENTS.md](/Users/odbayare/Documents/Weight%20Loss%20Test/MOCK_BACKEND_ENTITLEMENTS.md).
For the Sprint 18 fake payment and lead capture validation flow, use [FAKE_PAYMENT_VALIDATION.md](/Users/odbayare/Documents/Weight%20Loss%20Test/FAKE_PAYMENT_VALIDATION.md).
For the Sprint 19A/19B Mongolian copy rewrite inventory, Sprint 20A public language purge note, and manual QA rubric, use [COPY_REWRITE_INVENTORY.md](/Users/odbayare/Documents/Weight%20Loss%20Test/COPY_REWRITE_INVENTORY.md).

- Open the local server and check the landing screen.
- Open the assessment choice screen and compare one-time vs 7-day cards.
- Run the one-time assessment path and confirm the 7-day refinement CTA appears.
- Confirm One-Time shows a preview before demo payment, then unlocks the full report with the prototype payment button.
- Confirm 7-Day shows pricing before diary onboarding, then unlocks with the prototype payment button.
- Run or seed a 7-day full-report-eligible scenario and check report readability.
- Check limited diary state at 2-4 entries.
- Check Mode 3 Professional-first and Mode 4 urgent safety routes.
- Check at mobile widths around 390px and 430px, plus desktop.
- Confirm there is no horizontal overflow and no console error.
- Run `npm test`.

## Manual demo paths

- One-Time assessment: landing -> choice -> one-time -> answer Stage 1 -> report.
- 7-Day full report: choose 7-day, complete setup, enter at least 5 diary days.
- Limited diary report: create 2-4 diary entries and open the current report state.
- Professional-first: answer insulin/sugar-lowering medication or concerning measured body signal.
- Urgent safety: answer active self-harm text or severe confusion/fainting signal.

## What is included

- Stage 1 initial deep pattern test
- Assessment choice screen
- One-time deep assessment journey
- One-time self-report based deep report
- 7-day deep assessment journey
- Preliminary pattern map
- Diary onboarding with reminder choices
- 7-day guided diary
- No-unplanned day short flow
- Daily micro-insight
- Pattern-specific daily probes
- Deterministic voice/text summary confirmation engine
- Confirmed reflection evidence extraction
- Evidence-rule scoring calibration
- Virtual user QA scenario suite
- Safety-aware report modes
- One-time report refinement CTAs
- Full observed deep report generator
- Local browser persistence with `localStorage`

## Product boundaries

The prototype is a self-reflection and pattern-mapping tool. It does not diagnose medical, psychological, eating disorder, glucose, sleep, or reproductive conditions. When high-risk signals appear, the report switches away from weight-loss guidance.
