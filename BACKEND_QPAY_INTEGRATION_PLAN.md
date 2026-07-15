# Backend + QPay Integration Plan

## 1. Current static state

The current MVP is a static browser prototype using `localStorage` for assessment progress, diary entries, and demo commercial state.

Current commercial products:

* One-Time: anchor 29,000 MNT, opening promo 9,900 MNT
* 7-Day: anchor 69,000 MNT, opening promo 29,000 MNT
* Upgrade from paid One-Time to 7-Day: 19,900 MNT

Current prototype payment state:

* `oneTimePaid`
* `removedFeaturePaid`
* `upgradePaid`

Current protected behaviors:

* One-Time unpaid users can complete assessment and see a preview/paywall.
* One-Time paid users unlock the full One-Time report and see upgrade.
* 7-Day unpaid users cannot start diary onboarding.
* 7-Day paid users can start diary onboarding, but final report still requires data readiness.
* Mode 3 professional-first and Mode 4 urgent safety routes bypass ordinary paywalls.

## 2. Target backend state

The backend MVP should persist anonymous sessions, assessments, diary entries, report snapshots, payments, and entitlements. The frontend should no longer trust local booleans for paid access. Instead, it should ask the backend for entitlement state and render the same paywall/report decisions from server-backed records.

Target capabilities:

* Anonymous session creation and recovery.
* Assessment answer persistence.
* Diary entry persistence.
* Report snapshot persistence at completion.
* QPay invoice creation and status checks.
* Entitlement creation after confirmed payment.
* Safety route access independent of payment.
* Audit-friendly payment and entitlement records.

## 3. Product/entitlement rules

### One-Time paid

* Product type: `one_time`
* Amount: 9,900 MNT during opening promotion
* Grants entitlement: `one_time_report`
* Unlocks full One-Time report for the linked assessment.
* Shows 7-Day upgrade CTA after full report unlock.

### 7-Day paid

* Product type: `removed_feature`
* Amount: 29,000 MNT during opening promotion
* Grants entitlement: `removed_feature_access`
* Allows diary onboarding and diary entry creation.
* Does not bypass report data readiness.
* A 0-1 day diary state remains insufficient even after payment.
* Full 7-Day report requires the existing readiness threshold.

### Upgrade paid

* Product type: `upgrade`
* Amount: 19,900 MNT
* Requires an active `one_time_report` entitlement or a paid One-Time payment.
* Grants entitlement: `removed_feature_access`
* User keeps the One-Time report.
* Allows diary onboarding and 7-Day refinement.

### Mode 3 professional-first

* Entitlement type: `professional_summary`
* Access: free and immediate when triggered.
* Do not sell ordinary weight-loss report from this route.
* Do not show ordinary 14-day weight-loss experiment.
* If a paid product was purchased before Mode 3 was triggered, show the professional-first output and do not hide safety content.

### Mode 4 urgent safety

* Access: free and immediate.
* No ordinary paywall.
* No ordinary report.
* No upgrade CTA.
* No pricing block.

## 4. Data model

### users / sessions

Purpose: identify anonymous browser sessions now, with optional account linking later.

Fields:

* `id`
* `anonymous_session_id`
* `phone` nullable
* `email` nullable
* `created_at`
* `updated_at`

Notes:

* `anonymous_session_id` should be generated server-side and stored in a secure, recoverable client token.
* Phone/email should not be required for the first backend MVP unless payment receipt recovery needs it.

### assessments

Purpose: persist Stage 1 answers, confirmed summaries, report mode, evidence, and report snapshot.

Fields:

* `id`
* `user_id` nullable
* `session_id`
* `assessment_type`: `one_time | removed_feature`
* `status`: `started | completed | report_ready | locked | unlocked`
* `report_mode`: `mode1 | mode2 | mode3 | mode4`
* `safety_route`
* `created_at`
* `completed_at` nullable
* `answers_json`
* `confirmed_summaries_json`
* `evidence_json`
* `report_json`
* `report_text`

Notes:

* Store confirmed summaries and structured answers, not raw voice audio.
* `report_mode` and `safety_route` must be persisted so paywall bypass decisions are auditable.

### diary_entries

Purpose: persist each 7-Day diary day and its confirmed summary/evidence.

Fields:

* `id`
* `assessment_id`
* `day_number`
* `date`
* `answers_json`
* `confirmed_summary_json`
* `extracted_tags_json`
* `safety_flags_json`
* `created_at`
* `updated_at`

Notes:

* Unique constraint: one diary entry per `assessment_id + day_number`.
* Safety flags from diary entries should be available before report generation.

### reports

Purpose: store immutable report snapshots for paid/unlocked display and later audit.

Fields:

* `id`
* `assessment_id`
* `report_mode`: `mode1 | mode2 | mode3 | mode4`
* `report_kind`: `preview | one_time_full | removed_feature_limited | removed_feature_full | professional_summary | urgent_safety`
* `readiness_key`: `insufficient | limited | usable | full`
* `content_json`
* `content_text`
* `created_at`
* `updated_at`

Notes:

* Preview reports can be free.
* Professional and urgent safety reports are free.
* Full ordinary reports require entitlement unless report mode bypasses payment.

### payments

Purpose: track QPay invoice lifecycle and unlock source.

Fields:

* `id`
* `user_id` nullable
* `session_id`
* `assessment_id` nullable
* `product_type`: `one_time | removed_feature | upgrade`
* `amount_mnt`
* `status`: `pending | paid | failed | expired | cancelled`
* `provider`: `qpay`
* `qpay_invoice_id`
* `qpay_payment_id` nullable
* `qr_text` nullable
* `qr_image_url` nullable
* `payment_links_json`
* `created_at`
* `paid_at` nullable
* `expires_at`

Notes:

* Do not put sensitive assessment answers into QPay invoice metadata.
* Amount must be validated server-side from `product_type` and eligibility.

### entitlements

Purpose: the source of truth for access.

Fields:

* `id`
* `user_id` nullable
* `session_id`
* `entitlement_type`: `one_time_report | removed_feature_access | upgrade_access | professional_summary`
* `assessment_id` nullable
* `payment_id` nullable
* `status`: `active | expired | revoked`
* `created_at`
* `expires_at` nullable

Notes:

* `professional_summary` may be created without payment.
* `upgrade_access` can be represented as both `upgrade_access` and `removed_feature_access`, but the effective frontend access flag should be `hasRemovedFeatureAccess`.

## 5. API endpoints

### POST `/api/session/start`

Creates or resumes an anonymous session.

Response:

```json
{
  "session_id": "sess_...",
  "anonymous_session_id": "anon_...",
  "entitlements": []
}
```

### POST `/api/assessments`

Creates an assessment.

Request:

```json
{
  "session_id": "sess_...",
  "assessment_type": "one_time"
}
```

### PATCH `/api/assessments/:id/answers`

Persists partial answers and confirmed summaries.

Request:

```json
{
  "answers_json": {},
  "confirmed_summaries_json": {}
}
```

### POST `/api/assessments/:id/complete`

Marks assessment complete, calculates/stores report mode and preview/full report snapshot as appropriate.

Response:

```json
{
  "assessment_id": "asmt_...",
  "report_mode": "mode1",
  "safety_route": "mode1",
  "requires_payment": true,
  "preview_report": {}
}
```

### GET `/api/assessments/:id/report`

Returns the appropriate report for entitlement and safety state.

Rules:

* Mode 4 returns urgent safety guidance.
* Mode 3 returns professional-first summary.
* One-Time mode1/mode2 without entitlement returns preview/paywall metadata.
* One-Time with entitlement returns full One-Time report.
* 7-Day without entitlement returns paywall metadata.
* 7-Day with entitlement still applies readiness gates.

### POST `/api/diary/:assessment_id/entries`

Creates or updates a diary entry. Requires `removed_feature_access` unless the route is a safety-only action.

### GET `/api/entitlements`

Returns entitlement state for the session/user.

Response:

```json
{
  "hasOneTimeReportAccess": true,
  "hasRemovedFeatureAccess": false,
  "hasUpgradeAccess": false,
  "hasProfessionalSummaryAccess": true
}
```

### POST `/api/payments/create`

Creates a pending payment and QPay invoice.

Request:

```json
{
  "product_type": "upgrade",
  "assessment_id": "asmt_...",
  "session_id": "sess_..."
}
```

Response:

```json
{
  "payment_id": "pay_...",
  "amount_mnt": 19900,
  "status": "pending",
  "qr_text": "...",
  "qr_image_url": null,
  "payment_links": [],
  "expires_at": "2026-06-24T12:30:00Z"
}
```

### GET `/api/payments/:id/status`

Returns cached payment state and checks QPay if needed.

Response when paid:

```json
{
  "payment_id": "pay_...",
  "status": "paid",
  "entitlements": ["removed_feature_access"],
  "unlock_state": {
    "hasRemovedFeatureAccess": true
  }
}
```

### POST `/api/payments/qpay/webhook`

Optional but recommended after polling works. Verifies provider callback, marks payment paid, and creates entitlements idempotently.

### POST `/api/reports/generate`

Optional if report generation moves server-side. Until then, server can store a frontend-generated report snapshot, but production should prefer server-side report generation for auditability.

## 6. QPay invoice flow

1. Frontend user clicks paid CTA.
2. Frontend calls `POST /api/payments/create` with `product_type`, `assessment_id`, and `session_id`.
3. Backend validates session, assessment, product eligibility, amount, and safety route.
4. Backend creates a `payments` record with `pending` status.
5. Backend calls QPay create invoice.
6. Backend stores `qpay_invoice_id`, QR text/image if available, payment links, and expiry.
7. Backend returns payment display data to frontend.
8. Frontend shows QR/payment links and starts status polling.
9. Frontend polls `GET /api/payments/:id/status`.
10. Backend returns cached status or checks QPay status.
11. If paid, backend must mark payment `paid`, stores `qpay_payment_id`, creates entitlement idempotently, and returns unlock state.
12. Frontend refreshes entitlements and unlocks report or diary.
13. If expired, backend marks payment `expired` and frontend shows retry CTA.
14. If failed/cancelled, frontend shows a non-scary retry path and keeps safety content accessible.

QPay implementation notes:

* Keep QPay credentials only in backend environment variables.
* Validate amount server-side; never trust client-submitted amount.
* Use idempotency around `qpay_invoice_id` and `payment_id`.
* Store provider raw response only in server logs or a restricted audit column if needed.

## 7. Frontend state migration

Replace demo booleans:

* `oneTimePaid`
* `removedFeaturePaid`
* `upgradePaid`

with backend entitlement flags:

* `hasOneTimeReportAccess`
* `hasRemovedFeatureAccess`
* `hasUpgradeAccess`
* `hasProfessionalSummaryAccess`

Frontend flow changes:

* On app load, call `POST /api/session/start` or resume an existing session.
* Persist answers with `PATCH /api/assessments/:id/answers`.
* On assessment completion, call `POST /api/assessments/:id/complete`.
* Render report based on `GET /api/assessments/:id/report`.
* Paid CTAs call `POST /api/payments/create`.
* Payment screen polls `GET /api/payments/:id/status`.
* On paid response, refresh entitlements and rerender.

Local demo fallback:

* Keep demo unlock only under `DEMO_MODE = true`.
* Demo mode must be visibly marked as prototype/local.
* Production builds should disable demo unlock buttons.

## 8. Safety/paywall bypass rules

Backend rules must be authoritative:

* Mode 4 urgent safety guidance is always free and immediate.
* Mode 4 never returns ordinary paywall metadata.
* Mode 4 never returns upgrade CTA.
* Mode 3 professional-first summary is accessible without ordinary payment.
* Mode 3 does not sell a normal weight-loss report.
* Mode 3 does not show ordinary 14-day weight-loss experiment.
* Mode 2 may use normal paid report flow, but professional-check reassurance remains visible in preview/full report as appropriate.
* If a user already paid and then triggers Mode 3 or Mode 4, safety content still wins over commercial unlocking.
* Payment failure must never block safety or professional-first guidance.

## 9. Error/expiry handling

Payment states:

* `pending`: show QR/link screen and poll.
* `paid`: create entitlement and unlock.
* `failed`: show retry CTA and support note.
* `expired`: show retry CTA with a new invoice option.
* `cancelled`: return to paywall without losing assessment.

Frontend handling:

* Show a clear “waiting for payment” state.
* Include invoice expiry time.
* Allow manual “check again”.
* Preserve assessment/report preview when payment fails.
* Do not erase diary or assessment state on payment failure.

Backend handling:

* Expire old pending invoices by `expires_at`.
* Prevent duplicate active invoices when a valid pending invoice exists.
* Entitlement creation must be idempotent.
* Payment status endpoint must not expose sensitive answers.

## 10. Privacy/security notes

* Do not expose raw health/safety data unnecessarily.
* Do not include sensitive answers in payment metadata.
* Store only payment reference IDs with provider.
* Keep safety report accessible even if payment fails.
* Avoid raw voice audio storage by default.
* Store confirmed summaries, not raw audio.
* Encrypt or restrict access to answer/report payloads at rest where hosting supports it.
* Keep admin/payment audit access separate from general user sessions.
* Avoid logging full answers in request logs.
* Use HTTPS-only cookies or secure bearer session tokens.

## 11. Implementation phases

### Phase 1 — Persistence and mock payments

* Add backend runtime and database.
* Add session creation.
* Add assessment persistence.
* Add diary entry persistence.
* Add report snapshot persistence.
* Add entitlement model.
* Add mock payment provider that mimics pending/paid/expired.
* Keep existing static report logic unchanged except for API-backed storage calls.

### Phase 2 — Real QPay invoice create/check

* Add QPay credentials to backend environment.
* Implement `POST /api/payments/create`.
* Implement QPay invoice creation.
* Implement payment display response.
* Implement `GET /api/payments/:id/status`.
* Replace demo unlock with real entitlement refresh.

### Phase 3 — Confirmation hardening

* Add QPay webhook or callback endpoint.
* Make payment confirmation idempotent.
* Add admin/payment audit view or export.
* Add manual entitlement override if support needs it.
* Add refund/revocation procedure if required.

### Phase 4 — Deployment and production QA

* Configure production database.
* Configure QPay environment variables.
* Deploy backend.
* Run commercial flow QA against production.
* Verify mobile payment UI.
* Verify Mode 3/4 bypasses with real payment disabled/enabled.
* Verify expired invoice and retry behavior.

## 12. Open questions

* Which backend target should be used first: Netlify Functions, Railway, Supabase Edge Functions, or another service?
* Should anonymous sessions be recoverable by phone number before payment, after payment, or only later?
* Should report generation move server-side in Phase 1 or remain frontend-generated with server-stored snapshots initially?
* What is the QPay invoice expiry duration?
* What support channel should be shown for failed or paid-but-not-unlocked cases?
* Do refunds/manual overrides need to exist before first live payment test?
* Should opening promotion duration be fixed in copy before QPay launch?
