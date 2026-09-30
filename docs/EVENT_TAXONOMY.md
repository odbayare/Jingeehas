# Jingeehas Event Taxonomy

Updated: 2026-09-30

## Meta events

| Event | Browser | Server | Authority |
|---|---:|---:|---|
| `PageView` | Yes | No | Page render after Pixel config is enabled |
| `ViewContent` | Yes | No | Landing/product content render |
| `InitiateCheckout` | Yes | No | QPay invoice exists in `pending` or `paid` state |
| `Purchase` | Yes | Yes | Provider-confirmed QPay payment, exact server-stored transaction amount (19,900 MNT current; 9,900/39,000 MNT historical), stable provider payment ID and active entitlement path |

## Purchase contract

- Event name: `Purchase`.
- Event ID: deterministic `jh_purchase_<sha256-prefix>` derived from generic product code plus provider payment authority.
- Browser `eventID` and server `event_id` must be identical.
- Value: actual server-created payment amount (`19900` current; `9900` or `39000` only for legitimate historical transactions).
- Currency: `MNT`.
- Content ID/product code: `WEIGHT_TEST_ONE_TIME`.
- Order ID: local payment ID; provider payment ID is not exposed to the browser.
- Admin, owner preview and automated test events are excluded from production CAPI delivery.

## Forbidden payload fields

Never transmit assessment ID, raw answers, question IDs, weight, BMI, body measurements, eating-behaviour answers, psychological pattern names, report content, scores, email, phone, recovery contacts, safety route, diagnosis or treatment data.

## Internal analytics

Existing privacy-preserving `payment_confirmed` remains the reconciliation event. Meta attribution does not replace confirmed QPay payment or the production order/payment record.

### QPay handoff observations

- `qpay_handoff_attempted`: the browser observed a user click on a bank-app or QPay payment link. This is an attempted handoff, not evidence that an app opened, a bank accepted the link, or a payment occurred.
- `qpay_page_returned`: after an attempt, the checkout document became visible again following `visibilitychange` to hidden or `pagehide`. The matching attempt must already be recorded. Returning does not prove that a banking app was opened or that payment succeeded.
- Each actual click gets a random UUID `attemptId`; one return can be recorded for that attempt. Repeated transport delivery is deduplicated by event name, server-derived funnel hash, and attempt UUID. A return without a matching attempt receives `409 handoff_attempt_required`; the browser may replay the original attempt before retrying the return. No attempt is fabricated on the server.
- The pending attempt marker is kept in memory only, with a 30-minute return window and no new browser storage. Return delivery waits for successful attempt delivery and may replay that same event once after a failed delivery. Normal anchor navigation never waits for analytics. Full document reload, tab closure, browser termination, failed delivery, or returning after the window may leave an attempt without a return; this missing observation is not evidence of abandonment or payment failure.
- Both events require the authenticated owner/recovered session of a completed, commercially eligible free-postpaid assessment. Assessment ID is used only to authorize collection and derive the existing pseudonymous funnel hash; it is not stored in these event rows. Analytics-session rotation does not prevent pairing an authorized return.
- Metadata has exactly `{attemptId}`. These events store no bank identity, payment/invoice ID, URL, raw assessment ID, amount, contacts, answers, health/report content, or client-supplied attribution/referrer strings. Existing hashed visitor/session context and normalized device class remain available. Owner/preview/test exclusions are preserved on both observations.
- These are internal, best-effort diagnostic events only. They are not sent to Meta, do not contribute to confirmed-payment/revenue totals, and never grant access or initiate a provider operation. Payment truth remains provider-confirmed server state.
- Deploy `20260930104000_add_qpay_handoff_observations.sql` before enabling the new event writers. It only expands the event-name allowlist; existing rows and payment/funnel definitions are unchanged. Do not backfill inferred clicks or returns.
