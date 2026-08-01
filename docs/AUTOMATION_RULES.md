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

## Stop-loss candidate

Pause for investigation only when all are true:

- spend is at least USD 3.00;
- authoritative confirmed purchases are zero;
- delivery is not restricted;
- tracking health is PASS;
- the observation window has completed.

## CPA states

- CPA ≤ USD 1.00 with at least 5 purchases: scale candidate.
- CPA USD 1.01–1.15: hold and observe.
- CPA > USD 1.15 with at least 5 purchases: pause/investigate candidate.

## Scaling

- Maximum increase per action: 10–15%.
- Minimum interval between increases: 72 hours.
- Never increase portfolio total budget automatically.
- Never activate a new campaign automatically.
- Never act on one-day volatility alone.

All rules require backtesting before GUARDED_AUTOPILOT. Current mode remains manual APPROVED_EXECUTION.
