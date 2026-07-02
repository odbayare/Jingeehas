# WP15 Future WP16 Scope Proposal

## Recommendation

```text
READY FOR OWNER REVIEW OF PRE-APPJS DECISION GATE
```

Recommended future work pack:

```text
WP16 — Scoped Runtime Shadow Integration Plan
```

WP16 may not expose new report rendering to production users.

app.js remains blocked unless WP16 owner-approved scope explicitly allows it.

Deploy remains blocked.

## Recommended WP16 Scope

WP16 may propose a plan for a shadow-only runtime integration path. It should remain a planning and gate-definition pack unless the owner explicitly authorizes code changes.

Allowed WP16 proposal topics:

- exact `app.js` touch points to review before implementation;
- feature-flag or shadow-only guard design;
- adapter invocation boundary;
- no-visible-output QA plan;
- rollback plan;
- manual browser QA checklist;
- owner approval requirements before any production rendering.

## WP16 Must Not Assume

WP16 must not assume:

- production rendering approval;
- payment or entitlement integration;
- deploy approval;
- PDF generation approval;
- permission to change scoring, fixtures, or existing report-object contracts.

## Minimum Approval Bar Before Any Future `app.js` Edit

Before any `app.js` edit is made in a later work pack, owner review must approve:

- exact file scope;
- exact runtime shadow behavior;
- tests to be added or changed;
- no visible production behavior change;
- rollback plan;
- runtime safety gate preservation;
- payment/safety boundary preservation.

## Exact Conclusion

Runtime implementation is NOT approved by WP15.
