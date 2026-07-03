# WP30 Production State Record

| Area | Final state | Evidence |
| --- | --- | --- |
| public visible report surfaces | Live in production. | WP28 commit `fd56961`; production deploy `6a47773c43a1b7fed95d0b25`; WP29 smoke PASS. |
| prototype guard | Disabled. | `const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;` |
| runtime visible integration guard | Enabled. | `const ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true;` |
| paid sections | Gated behind paid access. | WP29 smoke: unpaid/payment failed paths exclude paid surface; paid path includes paid surface. |
| safety guidance | Outside payment gate. | WP29 smoke: unpaid, payment failed, professional, and urgent paths all render safety guidance. |
| internalDiagnostics | Never user-facing. | WP29 smoke rejects `internalDiagnostics` in rendered report output. |
| ownerDebug | Never user-facing. | WP29 smoke rejects `ownerDebug` in rendered report output. |
| QPay/backend/payment/pricing | Unchanged by visible surface rollout completion record. | WP29 smoke verifies QPay endpoint strings, pricing constants, and no payment/entitlement mutation. WP30 is docs-only. |
| PDF | Not generated. | WP29 and WP30 records confirm no PDF generation. |
| deploy | Latest deploy remains `6a47773c43a1b7fed95d0b25`. | Production URL and unique deploy URL returned `HTTP/2 200` in WP29. WP30 does not deploy. |
| rollback | Revert the public enable commit if rollback is required. | `git revert fd56961` followed by `npm test`. |
| protected untracked folder | Remains untracked, unstaged, untouched, and uncommitted. | `audits/sprint-36-paid-depth-prototype/` remains outside WP30 scope. |
