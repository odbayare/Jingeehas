# WP38 Launch Issue Watchlist

| Watch item | Current state | Trigger for action | Owner action |
| --- | --- | --- | --- |
| page load failure | Production URL is the active public surface. | Production URL returns non-200, blank page, or repeated load failure. | Check Netlify deploy status, recent deploy ID, and rollback if the active deploy is broken. |
| report surface missing | Public visible report preview is covered by monitoring test. | Free preview or visible surface heading disappears from unpaid output. | Pause launch traffic review and inspect report rendering changes before redeploy. |
| paid content visible without access | Paid depth remains gated in monitoring test. | Paid-only depth appears for unpaid / locked users. | Treat as launch blocker; revert or hotfix gating before further promotion. |
| safety guidance hidden | Safety guidance is asserted across monitored paths. | Safety guidance is missing in unpaid, paid, failed payment, professional, or urgent output. | Treat as safety blocker; restore ungated safety copy before further promotion. |
| QPay/payment failure confusion | Failed payment path keeps safety visible. | Users cannot understand retry/recheck state or think safety/preview disappeared after payment failure. | Review failed payment copy and support path without changing payment logic unless separately approved. |
| internal leak | Internal tokens are denied by monitoring test. | `internalDiagnostics`, `ownerDebug`, `fixtureName`, `runtimeGate`, `decisionStatus`, or `rendererMode` appears publicly. | Treat as release blocker; remove leak and validate public surfaces. |
| mobile layout issue | Mobile hardening is already live; WP38 keeps monitored report states intact. | Public report, paywall, or safety copy is clipped, overlapped, or unreadable on mobile. | Reproduce on mobile viewport and patch layout only if confirmed. |
| copy/trust complaint | High-risk trust terms are denied by monitoring test. | User feedback flags shame, diagnosis/treatment overclaim, fake urgency, or confusing paid/free boundary. | Triage copy issue and make minimal trust-safe copy polish. |
| rollback needed | Latest deployed app remains WP36 deploy `6a47c2273a04e577127f4364`. | A production blocker is confirmed and cannot be safely patched immediately. | Roll back to the last known good Netlify deploy and record the blocker. |
