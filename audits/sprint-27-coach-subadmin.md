# Sprint 27 — Coach Partner Sub-admin System

## Business Rules

- Standard public Weight Test One-Time price: `29,000₮`.
- Coach invite discounted One-Time price: `9,900₮`.
- Coach commission per paid discounted assessment: `4,000₮`.
- Platform share before fees/tax: `5,900₮`.
- One discounted payment grants one Weight Test full-report entitlement only.

## Privacy And Consent

Coach report sharing requires explicit client consent. Email match or invite token alone does not grant report access.

Consent copy:

`Би хөнгөлөлттэй үнээр үнэлгээ хийлгэж, гарсан тайлангаа [Coach name]-д харагдахыг зөвшөөрч байна.`

If consent is declined, the client continues at the standard price and coach report access is denied.

## Role Matrix

| Role | Allowed | Blocked |
| --- | --- | --- |
| Super Admin | create coach, reset password, view coach list | public access without internal/admin context |
| Coach | login, add own clients, see own dashboard, view consenting paid completed reports | admin panel, other coach clients, non-consenting reports |
| Client | accept/decline coach discount, complete assessment | silent report sharing |

## Data Model

Implemented in `mockBackend.js` for internal prototype:

- `coachAccounts`
- `coachClients`
- `coachSessions`
- `coachCommissionLedger`
- `coachReportAccessLogs`
- `auditLogs`

Payment rows now support:

- `product_code`
- `user_email_normalized`
- `coach_id`
- `coach_client_id`
- `amount_mnt`
- `base_price_mnt`
- `discount_amount_mnt`
- `commission_mnt`

Assessments now support:

- `user_email_normalized`
- `coach_client_id`
- `coach_id`
- `share_with_coach`
- `safety_mode`
- `primary_mechanism`
- `secondary_mechanisms_json`

## Coach Flow

Implemented prototype routes:

- `/coach/login`
- `/coach/dashboard`
- `/admin/coach` for internal admin use

Coach dashboard includes:

- added clients
- paid clients
- completed reports
- total paid amount
- coach commission
- pending payout
- add client panel
- client list
- report view guard

## Client Flow

If a user opens a coach invite link or matching invite exists, the One-Time start screen shows:

- coach name
- standard price `29,000₮`
- coach discounted price `9,900₮`
- explicit consent checkbox
- accept and decline actions

Accepted discount links assessment/payment to `coach_id` and `coach_client_id`.

## Commission Logic

Commission ledger is created only when a coach-discounted payment becomes `paid`.

Rules:

- commission = `4,000₮`
- platform share = paid amount minus commission = `5,900₮`
- duplicate paid checks are idempotent
- refund/cancel simulation voids the commission row

## Report Access

Allowed only if:

- assessment belongs to the coach
- payment is paid
- assessment is completed
- `share_with_coach = true`
- safety mode is not Mode 4

Mode 3:

- limited/professional-first report text may be shown
- ordinary 14-day experiment must not be shown

Mode 4:

- full urgent safety content is not shown in coach dashboard
- coach sees restricted state only

Every coach report view writes `coachReportAccessLogs` and `auditLogs`.

## Tests

Added `tests/coach-subadmin.test.js` covering:

- admin creates coach account
- temporary password generated and stored hashed
- coach login
- disabled coach cannot log in
- password reset
- coach client creation
- email normalization
- duplicate active client prevention
- coach isolation
- invite match and standard/no-invite pricing
- consent required for coach report access
- discounted paid payment creates one commission row
- duplicate paid check does not duplicate commission
- dashboard totals
- another coach cannot view report
- Mode 3 limited summary allowed
- Mode 4 restricted in coach dashboard
- access/audit logs
- refund voids commission
- UI discount banner and standard public price
- admin coach panel hidden from public default mode

Updated existing pricing/payment tests to reflect Sprint 27 price split:

- public standard One-Time = `29,000₮`
- coach invite discount = `9,900₮`

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
  - all tests passed
- `git diff --check`

## Prototype Vs Production-Ready

Prototype/mock:

- password hashing is mock-local, suitable for tests only
- sessions are local mock records
- storage is local/mockBackend, not a real protected database
- QPay is not enabled
- payout approval/export is not implemented

Production-required later:

- real backend auth
- real password hashing such as bcrypt/argon2
- protected database tables/migrations
- server-side report access authorization
- QPay metadata integration
- payout approval workflow
- admin CSV export

## Remaining Risks

This is not production security. It is an internal prototype that locks the product rules, copy, consent, commission math, and safety behavior before backend implementation.

## Recommendation

READY FOR INTERNAL TESTING OF COACH PARTNER PROTOTYPE.

Do not treat this as production-ready coach infrastructure until real backend authentication, database authorization, QPay metadata handling, and payout controls are implemented.
