# Coach Internal Demo Guide

## Purpose

This guide is for internal testing of the Weight Test coach partner workflow. It is a mock/internal prototype, not production security.

The demo proves the business and privacy rules:

- standard public Weight Test One-Time price: `29,000₮`
- coach invite discount: `9,900₮`
- coach commission after paid discounted assessment: `4,000₮`
- platform share before fees/tax: `5,900₮`
- report sharing requires explicit client consent
- Mode 3 and Mode 4 safety routes remain protected
- QPay идэвхжээгүй

## Roles

- Super admin: creates coach accounts and resets temporary passwords in the internal admin panel.
- Coach: logs in, adds client emails, sees own dashboard, sees only consenting paid completed client reports.
- Client: starts Weight Test, accepts or declines coach discount, controls whether the report is shared with the coach.

## Demo Credentials

Do not commit or share real passwords.

For demo, create a coach from the internal admin panel:

- email: `coach@example.com`
- password: generated temporary password shown once

The temporary password is intentionally a placeholder/demo credential in mock storage. Production must use real backend auth and hardened password reset.

## Demo Path

1. Open the internal admin route:
   - `/admin/coach?internalTest=1`
   - On the draft deploy: `https://<draft-host>/admin/coach?internalTest=1`
2. Create a coach:
   - name: `Demo Coach`
   - email: `coach@example.com`
   - commission: `4000`
3. Copy the generated temporary password.
4. Open:
   - `/coach/login`
   - On the draft deploy: `https://<draft-host>/coach/login`
5. Log in as the coach.
6. In the coach dashboard, add a client:
   - `client@example.com`
7. Use either the generated invite link or start Weight Test with the matching client email.
8. Confirm the client sees:
   - `Үндсэн үнэ: 29,000₮`
   - `Coach-ийн хөнгөлөлттэй үнэ: 9,900₮`
   - explicit report-sharing consent checkbox
9. Accept the discount and consent.
10. Complete the Weight Test.
11. Use the mock/internal payment path to mark the assessment paid.
12. Return to the coach dashboard.
13. Confirm:
   - paid total includes `9,900₮`
   - commission shows `4,000₮`
   - pending payout shows `4,000₮`
   - `Дүгнэлт` opens only for the coach's own consenting paid completed report
14. Run Mode 3 and Mode 4 demo cases:
   - Mode 3 shows only the allowed professional-first/limited summary.
   - Mode 4 shows the restricted dashboard state, not ordinary report content.

## Privacy Checks

During demo, verify:

- invite/email match alone does not share a report
- the client must check the explicit consent box
- declined consent keeps coach report access blocked
- unpaid or incomplete reports are blocked
- another coach cannot see the report
- report view is logged in mock access/audit logs

## What Is Mock

- local/mock storage
- mock payment state
- prototype coach auth/session records
- mock password hashing
- no production payout workflow
- no production database authorization
- QPay идэвхжээгүй

## Before Production

Required before a real coach partner launch:

- real backend authentication
- hardened password hashing and reset flow
- database row-level authorization
- server-side report access checks
- Supabase/service backend migrations
- QPay metadata and webhook integration
- commission payout approval workflow
- privacy policy and consent text review
- durable report access audit logs
- admin revoke/expire access controls
- data deletion/export policy
