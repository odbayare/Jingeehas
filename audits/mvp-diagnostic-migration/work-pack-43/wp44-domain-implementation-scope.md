# WP44 Domain Implementation Scope

## Work Pack

WP44 — Custom Domain / Metadata Implementation

## Preconditions

- Owner approves exact custom domain.
- Owner approves final public product name and metadata copy.
- Owner approves whether domain mapping or deploy actions are in scope.
- Owner confirms favicon/social preview assets are available, or explicitly defers them.

## WP44 May

- Update title/meta/social preview metadata.
- Add or update favicon references if assets exist.
- Prepare Netlify domain mapping notes.
- Verify SSL after owner DNS action.
- Record custom-domain validation results in an owner-review pack.

## WP44 Must Not

- Change QPay/backend/payment/pricing.
- Change report logic.
- Deploy unless owner approves.
- Modify DNS without owner approval.
- Touch protected folder `audits/sprint-36-paid-depth-prototype/`.

## Candidate Validation

- Confirm approved metadata appears in `index.html`.
- Confirm public app/report copy still does not hardcode the old Netlify URL.
- Confirm relative asset/script references still work under the target domain.
- Confirm favicon/social preview references resolve if assets are provided.
- Confirm SSL is valid only after owner DNS action.
- Confirm QPay/backend/payment/pricing/entitlement diffs are empty.

## Handoff Decision

WP44 should remain metadata/domain-configuration focused. Any payment-provider domain registration, QPay callback/domain review, pricing update, report logic change, or production deploy should require separate owner approval.
