# WP36 Public Copy Boundary Record

| Boundary | Result | Evidence |
| --- | --- | --- |
| guards unchanged | PASS | `ENABLE_VISIBLE_SURFACE_PROTOTYPE = false` and `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = true` remain asserted by WP36 test. |
| prices unchanged | PASS | WP36 test asserts price labels and numeric constants in `app.js`. |
| QPay unchanged | PASS | WP36 test asserts QPay create/check endpoint strings and product code. |
| paid depth gated | PASS | WP36 test asserts unpaid output does not show paid depth and paid output does show paid depth. |
| safety guidance outside payment | PASS | WP36 test requires safety guidance in unpaid, paid, failed payment, professional, urgent, gym, and body-trust states. |
| professional/urgent safety only | PASS | WP36 test rejects paid depth and paid experiment sections in professional and urgent outputs. |
| no internal leak | PASS | WP36 test rejects `internalDiagnostics`, `ownerDebug`, `fixtureName`, `runtimeGate`, `decisionStatus`, and `rendererMode`. |
| no fake urgency/scarcity | PASS | WP36 test rejects fake urgency, fake scarcity, limited-seat, and last-chance style phrases. |
| no shame/failure framing | PASS | WP36 test rejects `сахилгагүй`, `амжилтгүй`, `хатуу дэглэм`, and `заавал`. |
| no medical overclaim | PASS | WP36 test rejects `оношилгоо`, `эмчилгээ`, `даавраас болсон`, `эмнээс болсон`, and `глюкозоос болсон`. |
| no render storage mutation | PASS | WP36 test spies on global `localStorage` and rejects set/remove calls during render. |
| protected folder | PASS | `audits/sprint-36-paid-depth-prototype/` was not touched, staged, moved, deleted, or committed. |
