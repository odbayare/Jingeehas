# WP19 Surface To UI Mapping Plan

## Purpose

This artifact defines where future visible adapter surfaces may appear if a later owner-approved prototype work pack is accepted.

It is a mapping plan only. It does not implement visible rendering.

## Future Surface Mapping

| Adapter surface | Future UI destination | Visibility rule | Payment rule | Safety rule | Owner decision |
| --- | --- | --- | --- | --- | --- |
| `previewSections` | Future preview report area before paid-depth content | May become user-facing only after copy QA and owner approval | Must remain free or preview-accessible; must not expose paid-only depth | Must not include diagnosis, treatment, or medical-cause claims | PLAN ONLY |
| `paidSections` | Future paid report depth area inside ordinary report branch | May become user-facing only after copy QA, payment-boundary QA, and owner approval | May be gated only if safety guidance remains unblocked | Must not hide urgent, professional, or safety guidance | PLAN ONLY |
| `safetyGuidanceSections` | Future safety/professional guidance area available from safety-sensitive branches | May become user-facing only after safety QA and owner approval | Must remain visible without payment if surfaced later | Must remain outside payment, entitlement, payment failure, and report locked gates | PLAN ONLY |
| `internalDiagnostics` | No user-facing UI destination | Must never be user-facing | Must not be exposed through payment or free flows | Must not appear in returned user HTML | BLOCKED |
| `ownerDebug` | No user-facing UI destination; possible future admin-only debugging only if separately approved | Must never be user-facing | Must not be exposed through payment or free flows | Must not appear in returned user HTML | BLOCKED |

## Mapping Rules

`previewSections` may be planned as a future free preview surface only.

`paidSections` may be planned as future paid-depth content only if safety guidance remains unblocked.

`safetyGuidanceSections` must remain visible without payment if surfaced later.

`internalDiagnostics` must never be user-facing.

`ownerDebug` must never be user-facing.

WP19 does not approve rendering any surface to users.

## Required WP20 Gate

WP20 may only prototype visible surfaces if the owner accepts WP19.

## Conclusion

Visible runtime report rendering is NOT approved by WP19.
