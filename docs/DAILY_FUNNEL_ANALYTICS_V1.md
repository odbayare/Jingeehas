# Daily funnel analytics V1

## Scope

Jingeehas records a deterministic, privacy-safe funnel in the private `jingeehas.analytics_events` table. Calendar boundaries are calculated in `Asia/Ulaanbaatar`. The public assessment remains enabled (`WEIGHT_TEST_COMING_SOON_MODE=false`). Analytics is additive and does not change questions, reports, QPay, entitlement, recovery, or report snapshots.

## Canonical events

| Event | Authority | Unique aggregate key |
| --- | --- | --- |
| `landing_viewed` | Browser ingestion | visitor hash for visitors; raw rows for views |
| `assessment_started` | Assessment-create server | assessment ID |
| `assessment_completed` | Assessment-complete server | assessment ID |
| `paywall_viewed` | Browser ingestion | assessment ID |
| `invoice_created` | QPay create server, only with a provider invoice ID | provider invoice ID |
| `payment_confirmed` | QPay check server, only after paid status and local unlock commit | payment ID |

Supporting events do not contribute to the main funnel.

## Privacy and attribution

The browser keeps a cryptographically random visitor UUID and a session UUID in a first-party `SameSite=Lax; Secure` cookie. The session rotates after 30 minutes of inactivity. The backend HMAC-hashes both values using `ANALYTICS_HASH_PEPPER` before insertion. Raw UUIDs, IP addresses, full user agents, contacts, answers, and report payloads are not stored in analytics.

First-touch UTM values are retained in the cookie and current touch values are linked to `assessment_started`. Later server events inherit the assessment-start attribution. Referrers are reduced to hostname and device is normalized to `mobile`, `tablet`, `desktop`, or `unknown`.

## Access and failure behavior

- RLS is enabled and direct `anon` and `authenticated` privileges are revoked.
- Browser writes pass through `analytics-collect`, which validates origin, event allowlist, UUIDs, payload size, assessment requirements, rate limit, and event-ID deduplication.
- Browser clients cannot submit server-authoritative financial events.
- Owner reads pass through `admin-analytics-daily` after owner-admin authentication.
- Browser and diagnostic analytics are fail-open. A metrics outage cannot block assessment, QPay, entitlement, report, or recovery behavior.
- Financial events are emitted only from provider-confirmed server paths. Event idempotency prevents repeated payment checks from increasing revenue.

## Dashboard definitions

The owner dashboard defaults to the last seven Ulaanbaatar calendar days. It includes presets, custom dates, current totals, immediately preceding equivalent-period comparisons, the six-step funnel, a daily table, all required conversion rates, and MNT revenue. A zero denominator displays `—`; a prior-period zero never produces a misleading percentage comparison.

Admin, owner-preview, staging, development, and automated-test rows remain auditable but are excluded from default aggregates.
