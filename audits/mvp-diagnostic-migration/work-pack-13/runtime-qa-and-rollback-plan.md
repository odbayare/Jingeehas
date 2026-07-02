# Runtime QA And Rollback Plan

## Purpose

This document answers what rollback, QA, and deploy-readiness plan is required before production release.

## Release principle

Runtime release is not a single work pack. It must pass through:

1. adapter contract approval
2. shadow runtime approval
3. gated rendering approval
4. release candidate QA
5. deploy approval

## Rollback plan

Before production release, prepare:

- exact pre-release commit hash
- exact release commit hash
- one-command rollback path
- backup of previous deployed artifact or hosting deploy ID
- owner-approved rollback trigger list
- post-rollback smoke checklist

## Rollback evidence table

| Evidence item | Required before production release |
| --- | --- |
| Pre-release commit | Exact commit hash recorded in owner pack. |
| Release commit | Exact commit hash recorded in owner pack. |
| Hosting deploy ID | Preview and production deploy identifiers recorded. |
| Rollback command | Exact command or hosting UI rollback path recorded. |
| Trigger list | Owner-approved rollback triggers recorded. |
| Smoke checklist | Post-rollback smoke commands and manual checks recorded. |

Rollback triggers:

- internal keys visible to users
- safety guidance hidden by payment
- professional-first route shows ordinary experiment
- paid report unlock fails
- free preview exposes paid report depth
- report fails to render
- mobile layout blocks report reading
- severe copy regression or medical-cause claim appears

## QA plan

QA must include:

- automated tests
- generated artifact review
- owner copy review
- desktop visual smoke
- mobile visual smoke
- unpaid user smoke
- paid user smoke
- safety/professional route smoke
- localStorage behavior smoke
- payment entitlement smoke
- no-PDF/no-deploy-until-approved check

## QA matrix

| QA area | Required proof | Release blocker if failing |
| --- | --- | --- |
| Automated tests | Full regression command list passes. | Yes |
| Owner copy review | Sensitive copy approved in preview, paid, and safety placements. | Yes |
| Desktop rendering | Report readable with no internal keys. | Yes |
| Mobile rendering | Report readable with no overlap or blocked scrolling. | Yes |
| Unpaid preview | Preview limited to allowed summary and safety guidance. | Yes |
| Paid report | Ordinary depth appears only after entitlement. | Yes |
| Safety/professional route | Guidance appears without payment and suppresses ordinary experiments when required. | Yes |
| localStorage behavior | No storage regression from adapter or report rendering. | Yes |
| Payment entitlement | No QPay/backend/pricing/entitlement regression. | Yes |
| Rollback rehearsal | Rollback path is known before production. | Yes |

## Deploy-readiness gate

Production deploy requires:

- clean git status except explicitly approved release files
- full tests green
- future adapter tests green
- owner review signed off
- rollback plan documented with exact commands
- preview deploy tested
- production deploy explicitly approved by owner

## Post-deploy checks

After production deploy, run:

- production URL HTTP check
- report page smoke
- free preview smoke
- paid report smoke
- safety/professional copy smoke
- mobile viewport smoke
- console error check if browser tooling is available
- rollback-ready confirmation

## Answer to planning question 7

Before production release, the team needs a documented rollback path, automated and manual QA, preview deploy proof, explicit production approval, and post-deploy smoke checks. WP13 does not approve any deploy.

Runtime implementation is NOT approved by WP13.
