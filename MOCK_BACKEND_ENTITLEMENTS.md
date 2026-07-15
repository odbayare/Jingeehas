# Mock Backend + Entitlement Persistence

Sprint 17 adds a local mock backend layer so the static prototype can validate backend-style sessions, mock payments, and entitlements before real QPay integration.

This is not a real backend, database, or QPay integration. It uses browser `localStorage` in the prototype and an in-memory fallback in tests.

## Purpose

The mock backend proves the Sprint 16 architecture without changing payment providers yet:

* sessions are created before assessments and payments
* assessments can be persisted against a session
* paid actions create pending mock payments
* successful mock payments create entitlements
* UI access can be derived from entitlements instead of direct demo booleans
* Mode 3 and Mode 4 safety routes remain outside ordinary paywall logic

## State Model

The mock service stores:

* `sessions`
* `assessments`
* `payments`
* `entitlements`
* `currentSessionId`

Browser persistence key:

* `weightLossMockBackendState`

The app's existing UI state remains under:

* `weightLossDeepPatternMvp`

## Service API

The local service lives in `mockBackend.js` and exposes:

* `startSession()`
* `getCurrentSession()`
* `createAssessment(type)`
* `saveAssessmentAnswers(assessmentId, answers)`
* `completeAssessment(assessmentId, result)`
* `createMockPayment(productType, assessmentId)`
* `markMockPaymentPaid(paymentId)`
* `getPaymentStatus(paymentId)`
* `createEntitlementFromPayment(payment)`
* `getEntitlements(sessionId)`
* `hasEntitlement(type, assessmentId)`
* `getAccessState(assessmentId)`
* `resetMockBackend()`

## Mock Payment Flow

The prototype button text may still say `Төлбөр амжилттай гэж үзэх`, but the internal flow now mirrors the future backend:

1. Create a mock pending payment.
2. Mark that mock payment paid.
3. Create the matching entitlement idempotently.
4. Rerender the unlocked screen.

Amounts:

* `one_time`: 9,900 MNT
* `removed_feature`: 29,000 MNT
* `upgrade`: 19,900 MNT

## Entitlement Rules

`one_time` creates:

* `one_time_report`

`removed_feature` creates:

* `removed_feature_access`

`upgrade` creates:

* `upgrade_access`
* `removed_feature_access`

Compatibility note: the app still mirrors successful mock payments into the old `oneTimePaid`, `removedFeaturePaid`, and `upgradePaid` fields so existing tests and prototype state keep working. New access helpers also check the mock entitlement state.

## Safety Rules

Mode 3 professional-first output remains accessible without an ordinary payment. A `professional_summary` entitlement can be created locally if needed, but payment is not required.

Mode 4 urgent safety output remains free and immediate. It should not show an ordinary report, ordinary paywall, or upgrade CTA.

Payment or entitlement access does not bypass 7-Day report readiness. A paid 7-Day user can open diary onboarding, but 0-1 diary entries remain insufficient for the final observed-data report.

## Future QPay Mapping

This mock layer maps directly to the Sprint 16 backend plan:

* `createMockPayment()` becomes `POST /api/payments/create`
* `markMockPaymentPaid()` becomes QPay status confirmation or webhook handling
* local `entitlements` become backend entitlement records
* `getAccessState()` becomes `GET /api/entitlements`

Real QPay should replace the provider implementation, not the product rules.
