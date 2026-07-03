# WP19 Payment Safety Surface Gate

## Purpose

This artifact defines the payment and safety surface boundaries required before any future WP20 visible surface prototype can be committed.

WP19 does not change payment, QPay, backend, pricing, entitlement, report locking, safety routing, report copy, deploy configuration, or PDF generation.

## Boundary Table

| Boundary | Required behavior | Blocks visible prototype if failing? | Required test |
| --- | --- | --- | --- |
| unpaid preview | Preview surface may be visible without paid access, but must not expose paid-only depth, internal diagnostics, owner debug, or new claims. | Yes | Preview branch test and leak scan. |
| paid report | Paid surface may be visible only behind paid access and only if safety guidance remains unblocked. | Yes | Paid-access branch test and safety guidance assertion. |
| safety guidance | Safety/professional guidance must be visible without payment. | Yes | Safety guidance branch test without paid access. |
| payment failure | Payment failure must not hide safety guidance. | Yes | Payment failure branch test. |
| locked report | Locked report state must not hide safety/professional guidance. | Yes | Locked report branch test. |
| professional-first route | Professional-first route must suppress ordinary paid experiments and preserve professional guidance. | Yes | Professional route regression test. |
| urgent route | Urgent route must suppress ordinary paid experiments and preserve urgent guidance. | Yes | Urgent route regression test. |
| entitlement restore/reload | Restore/reload behavior must not change payment access or safety guidance visibility. | Yes | Entitlement restore/reload regression test. |
| QPay unchanged | QPay endpoints, amount constants, invoice behavior, and payment checks must remain unchanged. | Yes | Static constant check and payment regression guard. |
| backend unchanged | Backend, entitlement, pricing, and persistence behavior must remain unchanged unless separately approved. | Yes | Forbidden diff check and entitlement regression guard. |

## Exact Rules

Payment failure must not hide safety guidance.

Safety/professional guidance must be visible without payment.

Professional-first routes must not show ordinary paid experiments.

Urgent routes must not show ordinary paid experiments.

QPay/backend/payment/pricing/entitlement changes are not approved by WP19.

Visible runtime report rendering is NOT approved by WP19.

## WP20 Requirement

WP20 may only prototype visible surfaces if the owner accepts WP19.

Any WP20 prototype must include tests proving safety guidance remains outside payment gates.
