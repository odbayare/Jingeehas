# Jingeehas Meta Production Certification

Updated: 2026-08-01
Current verdict: NOT CERTIFIED / NO DEPLOYMENT / NO AD SPEND

## Repository gate

- [ ] Full `npm test` PASS at exact branch head.
- [ ] Contract tests PASS.
- [ ] E2E tests PASS.
- [ ] Production package verification PASS.
- [ ] Staging package verification PASS.
- [ ] Migration dry-run and rollback verification PASS.
- [ ] CI working tree remains clean after deterministic builds.

## Tracking gate

- [ ] Dedicated Jingeehas dataset/pixel verified.
- [ ] Domain verified.
- [ ] Browser PageView and ViewContent received.
- [ ] InitiateCheckout received only after an invoice exists.
- [ ] Controlled provider-confirmed Purchase received through CAPI.
- [ ] Matching browser Purchase received with identical event ID.
- [ ] Purchase deduplicated.
- [ ] Value `9900`, currency `MNT` and product code exact.
- [ ] Admin, owner preview and test activity excluded.
- [ ] No sensitive data in event payload, diagnostics, URL or logs.
- [ ] Test Events code removed before production.

## Asset and campaign gate

- [ ] Business Portfolio verified.
- [ ] Dedicated ad account verified.
- [ ] Page access verified.
- [ ] Instagram identity verified or intentionally omitted with owner approval.
- [ ] Billing, account limits and restrictions PASS.
- [ ] Audio commercial-use rights verified.
- [ ] Monthly product/portfolio cap approved.
- [ ] Campaign, ad set and ad created PAUSED with exact approved payload.
- [ ] Post-create read-back matches approval.

## Activation decision

ACTIVE delivery is prohibited while any required item is FAIL or UNKNOWN. Tracking code is disabled by default and must not be enabled merely because this branch merges.
