# Jingeehas Automation Rules

Updated: 2026-08-01
Status: DRAFT; NO AUTOMATED META MUTATIONS ENABLED

## Required data quality

Optimization rules may run only when:

- browser and server Purchase tracking are healthy;
- deduplication is verified;
- confirmed QPay payments reconcile with production payment records;
- admin, owner preview and test activity are excluded;
- attribution window and Asia/Ulaanbaatar reporting boundaries are documented;
- at least the configured observation window has elapsed.

## Stop-loss candidates

### Spend-authoritative stop-loss

Pause for investigation only when all are true:

- observed Meta spend is at least USD 3.00;
- authoritative confirmed purchases are zero;
- delivery is not restricted;
- tracking health is PASS;
- the observation window has completed.

### High-traffic loss alarm

When production analytics observes at least 100 paid landing sessions with zero provider-confirmed purchases:

- mark campaign health `FAIL`;
- set `pauseRecommended=true`;
- block scaling, replacement activation and winner classification;
- require a live Meta read of effective status and spend;
- do not set `stopLossTriggered=true` until spend is observed;
- do not set `pausePerformed=true` without a successful Meta mutation read-back.

This rule is intentionally conservative when tracking is not healthy. High traffic and zero confirmed purchase is an incident signal, not proof of exact Meta CPA.

Current incident `52503252094202` exceeds the high-traffic threshold with 1,365 paid landing sessions and zero confirmed purchases.

## CPA states

- CPA ≤ USD 1.00 with at least 5 purchases: scale candidate.
- CPA USD 1.01–1.15: hold and observe.
- CPA > USD 1.15 with at least 5 purchases: pause/investigate candidate.
- CPA is UNKNOWN when Meta spend is unavailable or confirmed purchase reconciliation is incomplete.

## Scaling

- Maximum increase per action: 10–15%.
- Minimum interval between increases: 72 hours.
- Never increase portfolio total budget automatically.
- Never activate a new campaign automatically.
- Never move budget between losing ads without confirmed-purchase evidence.
- Never act on one-day volatility alone.
- Never classify reach, visits, CTA clicks, assessment starts or completions as a sales winner.

All rules require backtesting before GUARDED_AUTOPILOT. Current mode remains manual APPROVED_EXECUTION. No Meta automation is enabled while the credential, asset and tracking gates are blocked.
