# Private Pilot V2.1 Implementation Contract

## Status

This is an **AI-designed and AI-pretested software pilot**. It has not been human-reviewed or psychometrically validated, is not a clinical or psychological diagnosis, and is not ready for public psychometric claims. Pilot responses are not human-validation evidence and must not be repurposed as such without separate consent and governance.

## Isolation and access

The pilot uses `/pilot-v2`, `/pilot-v2/questions`, and `/pilot-v2/report`. No public navigation, signup, payment entitlement, QPay, Meta event, revenue attribution, or public sitemap route is permitted. The server releases the instrument and assessment state only to an active owner/admin session or an HMAC-signed invite with an expiry of at most seven days. The HTML gate is `noindex, nofollow, noarchive`; it contains no item bank.

## Immutable provenance

- Instrument: `jingeehas-ai-pilot-v2.1`
- Scoring: `jingeehas-ai-pilot-scoring-v2.1-equal-weight`
- Report: `jingeehas-ai-pilot-report-v2.1`
- Bank SHA-256: `ba45b2493e9a2a3404226916c1ef210ed4cea927f5bf15a29d3522e6464c03e4`

The runtime artifact is generated only from `PILOT_CANDIDATE_BANK_V2_1.csv`. The build rejects a count, role, construct, held-item, duplicate, production flag, scale, or scoring-direction violation. Candidate item text is not rewritten.

The central V2.1 registry is the runtime label/value authority required by this implementation brief. The CSV’s candidate `response_options` remain unchanged as audit input; the build verifies that their cardinality and within-scale consistency match the registry. This explicit presentation normalization changes no candidate item text and cannot change the registry’s `0`–`4`/missing score mapping.

## Data boundary

`jingeehas_pilot.assessments`, `jingeehas_pilot.answers`, and `jingeehas_pilot.lifecycle_events` are separate from V1, payments, validation research, and commercial analytics. The migration is forward-only source material and is not applied by this change. Lifecycle events accept only start, section, completion, report-open, and bounded error categories; they contain no answer, item text, score, safety answer, context, or report body.

## Release boundary

This contract authorizes local tests, CI, and access-protected previews only. It does not authorize production deployment, a public link, promotion, validation claims, or merging the draft PR.
