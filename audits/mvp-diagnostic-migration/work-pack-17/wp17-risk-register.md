# WP17 Risk Register

| Risk | Severity | Trigger | Mitigation | Status |
| --- | --- | --- | --- | --- |
| visible report output changed | BLOCKER | Any returned report HTML differs because of shadow integration. | Disabled helper output is ignored; tests compare returned report HTML across one-time, seven-day, professional, urgent, and readiness branches. | Controlled |
| shadow flag accidentally enabled | BLOCKER | `ENABLE_RUNTIME_ADAPTER_SHADOW` is changed away from `false`. | Tests assert `ENABLE_RUNTIME_ADAPTER_SHADOW = false` in source and `_internal.ENABLE_RUNTIME_ADAPTER_SHADOW === false`. | Controlled |
| adapter output rendered to users | BLOCKER | Adapter fields or sections appear in user-facing HTML. | Returned HTML leak scan checks adapter fields and raw fixture names are absent. | Controlled |
| localStorage mutation | HIGH | Shadow helper reads localStorage, writes localStorage, adds keys, or persists diagnostics. | Test installs a throwing localStorage descriptor and proves helper does not access it. | Controlled |
| payment/entitlement mutation | HIGH | Shadow path changes access helpers, prices, product codes, QPay endpoints, or entitlement logic. | Test checks access helpers and core price/product/QPay endpoint constants remain unchanged. | Controlled |
| safety/professional route regression | HIGH | Professional-first branch changes output, payment gating, or safety routing. | WP17 test covers professional branch output invariance and leak scan. | Controlled |
| urgent route regression | HIGH | Urgent branch changes output, payment gating, or safety routing. | WP17 test covers urgent branch output invariance and leak scan. | Controlled |
| internal key leak | HIGH | Adapter internals, fixture names, or runtime metadata appear in returned HTML. | Leak scan rejects adapter fields, raw fixture names, and internal adapter metadata. | Controlled |
| WP14 adapter contract drift | HIGH | Adapter mode, report surface, runtime safety gate, payment safety gate, or pass status changes. | WP14 adapter test and WP17 adapter JSON contract check validate the adapter contract. | Controlled |
| deploy before approval | BLOCKER | Any deploy command is run before owner approval. | WP17 owner pack records no deploy; deploy remains forbidden by scope. | Held |
| rollback not clean | MEDIUM | WP17 cannot be reverted with one commit revert after commit. | WP17 shadow integration is revertible with one commit revert; current uncommitted rollback is documented. | Controlled |

## Current conclusion

Shadow integration produced no user-visible report output.
