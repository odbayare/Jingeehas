# WP14 Safety Payment Adapter Rules

## Purpose

This document records the safety/payment boundary represented by the test-only adapter contract.

## Contract rule

Safety/professional guidance must not require payment.

## Current gate values

| Field | Value |
| --- | --- |
| `paymentGate.implemented` | `false` |
| `paymentGate.status` | `NOT_IMPLEMENTED` |
| `paymentGate.paidContentField` | `paidSections` |
| `paymentGate.safetyGuidanceBypassesPayment` | `true` |
| `paymentGate.safetyGuidanceRequiresPayment` | `false` |

## Required invariant

`safetyGuidanceSections` must remain separate from `paidSections`, and `paymentGate.safetyGuidanceRequiresPayment` must remain `false`.

Runtime implementation is NOT approved by WP14.
