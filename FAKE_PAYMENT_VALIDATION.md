# Fake Payment Validation

Sprint 18 adds fake-door validation before real QPay work. The goal is to measure purchase intent without collecting real payment or adding a real backend.

## Why Before QPay

Real QPay integration should wait until there is evidence that users understand the offer and are willing to pay. A fake payment flow lets the prototype measure:

* paid CTA clicks
* lead submissions
* product interest by package
* willingness at the current opening price
* objections or trust questions in comments
* internal demo unlock usage separately from user-facing intent

## Lead Capture Flow

When a user clicks a paid CTA, the app opens `Нээлтийн туршилтын бүртгэл` instead of pretending a real payment happened.

Captured fields:

* product type: `one_time | removed_feature | upgrade`
* product label
* price in MNT
* name
* phone or email
* willingness answer
* optional comment
* source screen
* assessment id
* created timestamp

The lead form does not ask for sensitive health details and does not process payment.

## Local Storage

Lead and validation data live in the mock backend state:

* `weightLossMockBackendState`

Helpers in `mockBackend.js`:

* `createLeadIntent(data)`
* `getLeadIntents()`
* `clearLeadIntents()`
* `summarizeLeadIntents()`
* `trackEvent(eventType, attrs)`

## Validation Summary

The local summary reports:

* total leads
* leads by product
* willingness breakdown
* average intended price by product
* comments
* paid CTA clicks
* lead submits
* demo unlocks

The app also has an internal route/state named `validationSummary` for local demo review.

## Demo Unlock

Internal testing still uses `Demo unlock хийх`. That path creates a mock payment, marks it paid, creates the entitlement, and unlocks the product. It is visually secondary and separate from the paid CTA.

## Safety Rules

Mode 4 urgent safety:

* no paywall
* no lead capture
* no commercial CTA

Mode 3 professional-first:

* no ordinary weight-loss paid CTA
* professional-first summary remains accessible without payment

Mode 2 can use the normal fake-door flow while keeping professional-check reassurance visible.

## Proceed-To-QPay Threshold

Proceed to real QPay/backend only if validation is directionally strong:

* 50+ landing visitors
* 15+ paid CTA clicks
* 8+ lead submissions
* 3+ `Тийм, энэ үнээр авахад бэлэн`
* One-Time payment intent average 6/10+
* 7-Day payment intent average 5/10+
* no major trust or safety complaint

If comments show confusion, trust concerns, or weak value perception, improve the offer and sample report before real payment integration.
