# WP45 Custom Domain Owner Action Scope

## Work Pack

WP45 — Custom Domain Owner Action / DNS Verification

## WP45 May

- Record owner-selected domain.
- Document DNS steps.
- Verify Netlify domain mapping after owner DNS action.
- Verify SSL.
- Deploy only if metadata changes need production release and owner approves deploy.

## WP45 Must Not

- Change QPay/backend/payment/pricing.
- Change report logic.
- Modify DNS without owner action.
- Touch protected folder `audits/sprint-36-paid-depth-prototype/`.

## Owner Inputs Needed

- Final custom domain.
- DNS provider/action confirmation.
- Whether Netlify domain mapping should be verified only or changed by owner-approved action.
- Whether production deploy is approved if metadata release is required.

## Validation Expectations

- Confirm selected domain is documented exactly.
- Confirm DNS instructions or owner action are recorded without unapproved DNS mutation.
- Confirm Netlify domain mapping status after owner action.
- Confirm SSL status after owner action.
- Confirm no payment/backend/QPay/pricing/entitlement diffs.
- Confirm no report logic diffs.
- Confirm protected folder remains untouched.
