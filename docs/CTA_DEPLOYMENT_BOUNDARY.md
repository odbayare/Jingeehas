# Landing CTA event deployment boundary

The canonical landing CTA event is `landing_cta_clicked` from the first
production deploy containing commit `c25c37c410826d97516dacd46a395e577f6918d7`
(the full conversion landing/direct payment implementation). The first
verified production deploy after that change was deploy
`6a61d53f6c17a34b94bee8ee`, published at `2026-07-23T08:48:03.740Z`.

The forward-only migration records this boundary in
`jingeehas.cta_event_allowed`:

- `landing_cta_clicked` is counted at or after `2026-07-23T08:48:03.740Z`.
- `start_cta_clicked` is counted only before that timestamp.
- Sessions are deduplicated by the existing hashed session identity.
- Owner, admin, and test traffic remain excluded by the existing analytics
  source-of-truth predicates.

The boundary is evidence-derived from repository history and the Netlify
production deploy timeline; no totals are hardcoded.
