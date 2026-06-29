# Sprint 28 — Coach Partner Workflow QA

## Scope

Sprint 28 validates and packages the Sprint 27 coach partner prototype for internal demo/testing.

No production deploy was performed. QPay remains disabled. Scoring, report generation, and safety routing were not changed.

## Source State

- Sprint 27 commit: `be105f83c26d3febbcdbeee2daad38ab081adf70`
- Sprint 27 audit: `audits/sprint-27-coach-subadmin.md`
- This sprint adds QA documentation, a demo guide, and a scenario-level regression test.
- This sprint adds `_redirects` so Netlify draft deploys can open internal SPA routes such as `/coach/login` and `/admin/coach?internalTest=1` directly.

## Scenario Results

| # | Scenario | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | Admin creates coach | PASS | Coach account is active, commission defaults to `4,000₮`, raw password is not stored, temporary password is generated. |
| 2 | Coach login | PASS | Coach login creates a coach session and lands on own dashboard. |
| 3 | Disabled coach cannot login | PASS | Disabled coach login throws safe invalid-login behavior. |
| 4 | Coach adds client email | PASS | Email is normalized, client status starts as `invited`, duplicate active client for the same coach is blocked. Same email under another coach is isolated by coach scope. |
| 5 | Invited client sees discount | PASS | Invite flow shows base `29,000₮`, coach price `9,900₮`, coach name, consent checkbox, and report-sharing explanation. |
| 6 | Client declines coach sharing | PASS | Decline keeps standard `29,000₮` flow and coach report access is denied with Mongolian reason text. |
| 7 | Client accepts, pays mock, completes report | PASS | Paid mock coach assessment uses `9,900₮`, creates one `4,000₮` commission row, platform share is `5,900₮`, and report access is logged. |
| 8 | Duplicate paid check | PASS | Re-checking an already-paid payment does not duplicate commission. |
| 9 | Coach report access allowed | PASS | Coach can view own consenting paid completed report and no internal mechanism keys are exposed in the tested report text. |
| 10 | Coach report access denied | PASS | Other coach, non-consenting, unpaid, and incomplete cases are denied safely without report text exposure. |
| 11 | Mode 3 professional-first client | PASS | Coach sees only allowed limited/professional-first summary; ordinary 14-day experiment is not shown. |
| 12 | Mode 4 urgent safety client | PASS | Coach sees restricted state only: `Энэ үнэлгээ ердийн жин хасалтын тайлан гаргаагүй. Аюулгүй байдлын чиглэл илэрсэн тул дэлгэрэнгүй тайлан coach dashboard дээр харагдахгүй.` |
| 13 | Coach dashboard totals | PASS | Added client, paid count, completed count, total paid, commission, and pending payout totals are calculated from scoped coach data. |
| 14 | Internal copy/privacy review | PASS | Copy explains report sharing through consent, does not imply coach ownership, and the demo guide labels payment/auth/storage as mock. |

Summary:

- PASS: 14
- PARTIAL: 0
- FAIL: 0

## Automated Tests

Added `tests/coach-workflow-qa.test.js` to cover:

- admin coach creation
- temporary password hashing behavior
- coach login and disabled-login block
- coach client creation and duplicate prevention
- invite discount vs standard price
- explicit consent requirement
- declined-consent report block
- paid coach commission row and duplicate paid idempotency
- own-client report access
- cross-coach denial
- unpaid/incomplete denial
- Mode 3 limited report behavior
- Mode 4 restricted report behavior
- coach dashboard totals
- internal admin panel hidden from public default mode
- QA/demo docs include prototype and QPay-disabled boundaries
- Netlify draft route fallback for `/coach/*` and `/admin/*`

`tests/run-all.js` includes the new QA test.

## Privacy And Consent QA

The client discount banner includes:

- base price
- coach discount price
- coach name
- report-sharing explanation
- explicit consent checkbox

Report access remains blocked unless `share_with_coach = true`, payment is paid, assessment is completed, and the report belongs to the logged-in coach.

## Mock / Prototype Boundary

Still mock:

- local storage
- coach sessions
- password hashing
- mock payment state
- commission ledger
- report access logs

Not production-ready:

- real backend authentication
- database row-level authorization
- server-side report access enforcement
- QPay metadata/webhooks
- payout approval/export
- privacy/legal policy implementation

## Validation Results

Passed:

- `node --check app.js`
- `node --check mockBackend.js`
- `node --check scripts/run-virtual-user-audit.mjs`
- `node scripts/run-virtual-user-audit.mjs --assert-clean`
  - users: 10
  - pass: 10
  - partial: 0
  - fail: 0
  - P0/P1/P2: 0/0/0
  - readiness score: 96
  - recommendation: `READY FOR INTERNAL HUMAN TESTING`
- `npm test`
  - all tests passed, including `tests/coach-workflow-qa.test.js`
- `git diff --check`

## Recommendation

READY FOR INTERNAL COACH WORKFLOW DEMO.

Do not use this as production coach infrastructure until the production blockers above are resolved.
