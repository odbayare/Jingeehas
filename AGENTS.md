# Jingeehas Agent Operating Guide

This file applies to AI coding agents working in this repository.

## Scope safety

- Keep changes narrowly scoped to the active task.
- Preserve payment, entitlement, analytics, and assessment behavior unless the task explicitly authorizes changing them.
- Run affected tests before proposing release.
- Do not introduce new paid infrastructure or recurring SaaS usage without explicit cost justification and approval.

## Infrastructure cost guard

Netlify production deployment is a release action, not a QA or debugging tool.

- Default to local tests first, then a Deploy Preview or branch deploy when remote verification is needed.
- Never publish to production merely to discover whether a change works.
- Batch related validated changes into one production release instead of iterative production publishes.
- A production deploy requires explicit release intent after affected tests and acceptance checks pass.
- Unless handling a genuine production outage, payment failure, or security incident, default to at most one production publish for one validated release.
- Prefer rollback to a known-good existing production deploy over creating a new deploy when rollback satisfies the incident response.
- Before any deployment, state whether it is local-only, Deploy Preview/branch, or production.
- Do not increase scheduled-function frequency, persistent compute, paid infrastructure, or recurring SaaS usage without explicit cost justification and approval.
- If a proposed change can increase recurring infrastructure cost, flag the expected cost before execution.

## Deployment

Do not deploy unless the user or the active task explicitly authorizes deployment. Deploy only validated code through the repository's existing release mechanism.
