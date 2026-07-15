# WP49 Paid-First Gate Emergency Summary

## Issue

Live Weight Loss app allowed an unpaid user to enter the assessment flow before QPay payment was confirmed.

Production URL:

`https://weight-loss-deep-pattern-9900.netlify.app`

## Root Cause

The one-time start screen rendered a direct `beginAssessment('one-time')` button. `beginAssessment()` created an assessment and moved `state.view` to `stage1` without verifying paid access.

Additional risk existed from restored local state: saved `stage1`, `preliminary`, `report`, `diary`, or `reportReady` views could be rendered before access was checked.

## Fix

- Added `canStartPaidAssessment()` as the paid-first source of truth.
- Added `enforcePaidFirstGate()` for restored or direct gated views.
- Guarded `beginAssessment()` before assessment creation or `stage1` entry.
- Guarded `completeStageOne()` before report/preliminary transition.
- Guarded `startDiary()` before diary entry.
- Changed one-time start screen so unpaid users see the QPay payment box first.
- Preserved the start button only after confirmed paid or entitled access.

## Payment Boundary

- QPay invoice creation does not unlock the test.
- QPay pending status does not unlock the test.
- Only confirmed paid QPay state, backend entitlement, or existing paid access unlocks the test.

## Preserved Invariants

- One-time price remains `9,900₮`.
- Amount remains `9900`.
- Product code remains `WEIGHT_TEST_ONE_TIME`.
- QPay create endpoint remains `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-create-invoice`.
- QPay check endpoint remains `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-check-payment`.
- No [CROSS_PROJECT_NAME_REMOVED]/TIAS repo changes.
- No QPay backend changes.
- No real payment completed.
- No PDF generated.
- Protected folder untouched.

## Production Result

- Deployed to `https://weight-loss-deep-pattern-9900.netlify.app`.
- Deploy ID: `6a488c5a75a3094cdf4ffa09`.
- Production smoke returned HTTP 200.
- Production `app.js` contains `canStartPaidAssessment()` and the unpaid gate copy `Төлбөр баталгаажсаны дараа тест эхэлнэ`.
