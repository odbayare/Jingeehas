# WP18 Visible Surface Safety And Payment Gate

## Purpose

This artifact records the safety and payment boundaries that must remain in place before any future visible report surface work is planned.

WP18 does not change safety routing, payment behavior, QPay behavior, backend behavior, pricing, entitlement, report copy, deploy configuration, or PDF generation.

## Gate table

| Gate | Required behavior | Blocks visible rendering if failing? | Evidence required |
| --- | --- | --- | --- |
| free preview gate | Free preview content may be planned only if it does not expose paid-only sections, internal diagnostics, owner debug, or new claims. | Yes | Future WP19 surface map and leak tests. |
| paid report gate | Paid report content may be gated only when safety guidance remains unblocked. | Yes | Future WP19 payment-boundary test plan. |
| safety guidance gate | Safety/professional guidance must remain visible without payment. | Yes | Tests proving urgent/professional/safety guidance is not hidden by paywall or payment failure. |
| internal diagnostics gate | Internal diagnostics must never be rendered to users. | Yes | Returned HTML leak scan for `internalDiagnostics` and related fields. |
| owner debug gate | Owner debug must never be rendered to users. | Yes | Returned HTML leak scan for `ownerDebug` and related fields. |
| payment failure behavior | Payment failure must not hide safety guidance. | Yes | Payment failure branch test proving safety guidance remains visible. |
| report locked behavior | Locked report behavior must not hide safety/professional guidance. | Yes | Locked report branch test proving guidance remains available. |
| safety guidance always-visible rule | Safety/professional guidance must remain outside payment and entitlement gates. | Yes | Safety route and payment route regression tests. |
| no diagnosis/treatment/cause claim rule | Visible surfaces must not introduce diagnosis, treatment, or medical-cause claims. | Yes | Copy/safety QA before any visible rendering. |
| no payment mechanics in sensitive copy rule | Sensitive safety/professional copy must not include payment mechanics or purchase pressure. | Yes | Copy/safety QA and payment copy review before any visible rendering. |

## Required rules

Payment failure must not hide safety guidance.

Safety/professional guidance must be visible without payment.

Internal diagnostics must never be rendered to users.

Owner debug must never be rendered to users.

Visible runtime report rendering is NOT approved by WP18.

## Gate conclusion

The safety and payment gates are acceptable for a future WP19 visible surface plan.

They are not approval for production rendering.
