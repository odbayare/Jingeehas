# Safety Payment Boundary Plan

## Purpose

This document answers which safety/professional/medical-context copy must never be blocked by payment.

## Never block by payment

The following copy types must never be behind a paywall:

- professional-first guidance
- medical-context clarification
- "this is not a diagnosis" language
- safety route explanations
- urgent or severe distress guidance
- medication/body-change concern guidance
- ordinary experiment suppression when safety requires it
- recommendation to clarify concerns with a professional

## Never-paywall matrix

| Copy category | Must render before payment | May also appear in paid report | Required future test |
| --- | --- | --- | --- |
| Professional-first guidance | Yes | Yes, if repeated for continuity | Unpaid state shows professional-first guidance and suppresses ordinary experiment. |
| Medical-context clarification | Yes | Yes | Unpaid state shows the clarification bridge before entitlement. |
| Non-diagnostic disclaimer | Yes | Yes | User-facing copy contains non-diagnostic language without paid unlock. |
| Severe distress or urgent concern guidance | Yes | Yes | Safety route bypasses paid gating. |
| Medication/body-change concern guidance | Yes | Yes | Medical-context bridge is visible without payment. |
| Ordinary-experiment suppression notice | Yes | Yes | Professional-first route does not show ordinary experiment as the primary action. |
| Recommendation to clarify with a professional | Yes | Yes | Payment lock cannot hide the professional bridge. |

## WP12-sensitive fixture rules

### Body uncertainty / professional bridge

When body uncertainty copy includes professional clarification, the future runtime must show that bridge without payment.

Required principle:

```text
If the copy says professional clarification may be needed, that sentence must be visible without payment.
```

The future paid report may add ordinary observation details, but it cannot hide the professional clarification bridge.

### All-or-nothing / restriction rebound

When restriction/rebound copy explains hunger and restart pressure, ordinary report details may be paid. But if the same route ever detects safety risks such as compensatory behavior, severe body distress, or professional-first conditions, the safety copy overrides payment.

## Payment boundary rule

Payment may gate ordinary depth, not safety.

Allowed behind payment:

- deeper stacked-driver explanation
- full hidden food function discussion
- 14-day ordinary experiment
- 7-day diary confirmation targets

Never behind payment:

- safety/professional guidance
- non-diagnostic disclaimer
- medical-context clarification
- professional-first instruction
- "ordinary experiment is suppressed" explanation

## Forbidden future copy

Future runtime must not say or imply:

- "pay to see whether this needs medical clarification"
- "paid report will tell you if this is diagnosis"
- "professional guidance is unlocked after payment"
- "safety route is part of premium depth"
- "medical context is hidden in paid report"

## QA requirement

Before runtime release, tests must prove:

- safety/professional copy renders with unpaid state
- paid lock does not hide medical-context bridge
- paid lock does not hide professional-first instruction
- ordinary paid sections can remain locked while safety guidance is visible
- no product/payment mechanics appear inside user-facing sensitive copy

## Answer to planning question 4

Professional-first guidance, medical-context bridges, non-diagnostic disclaimers, safety route explanations, and ordinary-experiment suppression must never be blocked by payment.

Runtime implementation is NOT approved by WP13.
