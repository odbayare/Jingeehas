# Work Pack 7 Owner Review Pack

## Recommendation Enum

READY FOR OWNER REVIEW OF STRUCTURE DECISIONS

## Repository State

### git status --short

```text
?? audits/mvp-diagnostic-migration/work-pack-7/
?? audits/sprint-36-paid-depth-prototype/
```

### git diff --stat

```text
```

### git diff -- app.js index.html styles.css mockBackend.js package.json _redirects

```text
```

## Validation Commands and Results

```text
git status --short: PASS (WP7 docs untracked; unrelated audits/sprint-36-paid-depth-prototype/ also untracked)
git diff --check: PASS
node --check app.js: PASS
node --check tests/driver-stack/driverStackReportObject.mjs: PASS
node tests/driver-stack/driverStackReportObject.test.js: PASS (driverStackReportObject tests passed)
node tests/driver-stack/driverStackContract.test.js: PASS (driverStackContract tests passed)
node tests/driver-stack/driverStackFixtures.test.js: PASS (driverStackFixtures tests passed)
node tests/driver-stack/driverStackSafetyInvariants.test.js: PASS (driverStackSafetyInvariants tests passed)
npm test: PASS (All tests passed)
git diff -- app.js index.html styles.css mockBackend.js package.json _redirects: PASS (empty diff)
```

## Changed Files List

```text
audits/mvp-diagnostic-migration/work-pack-7/OWNER_REVIEW_PACK_WP7.md
audits/mvp-diagnostic-migration/work-pack-7/all-or-nothing-structure-decision.md
audits/mvp-diagnostic-migration/work-pack-7/pcos-body-uncertainty-structure-decision.md
audits/mvp-diagnostic-migration/work-pack-7/structure-decision-matrix.md
audits/mvp-diagnostic-migration/work-pack-7/future-report-object-impact.md
audits/mvp-diagnostic-migration/work-pack-7/copy-rules-for-structure-decision-fixtures.md
audits/mvp-diagnostic-migration/work-pack-7/owner-decision-record.md
audits/mvp-diagnostic-migration/work-pack-7/work-pack-7-recommendation.md
```

## Explicit Confirmation

- No runtime changes
- No app.js changes
- No scoring/fixture changes
- No WP4 report object contract changes
- No production report rendering changes
- No PDF generated
- No deploy
- QPay/backend/payment/pricing/entitlement unchanged

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-7/all-or-nothing-structure-decision.md

# Work Pack 7 All-or-Nothing Structure Decision

Focus fixture: `all_or_nothing_restriction_rebound`

Scope: test-only owner decision document. This does not change WP3 scoring, WP3 fixtures, WP4 report object contract, tests, runtime behavior, production report rendering, PDF, deploy, payment, QPay, pricing, entitlement, or localStorage behavior.

## Current WP4/WP6 structure summary

Current WP4 compact fixture output:

- Fixture: `all_or_nothing_restriction_rebound`
- Safety mode: `mode1`
- Primary driver: `all_or_nothing`
- Secondary drivers: `meal_gap`, `evening_hunger`, `strict_diet`
- Interaction ID: `all_or_nothing_punishment_restriction`
- Vulnerable moment ID: `all_or_nothing_punishment_restriction`
- Hidden food function: `hunger_safety`
- First gentle change: `next_meal_reset_rule`
- 14-day experiment duration: 14 days
- Professional-first: false

Current WP6 copy architecture treats this fixture as not fully ready for runtime integration. WP6 says the fixture needs an owner structure decision because the hidden function may need more than `hunger_safety` to explain punishment/restart pressure.

## Current hidden food function

Current hidden food function: `hunger_safety`

User-facing copy direction from WP6: "дараа нь хэт өлсөхөөс хамгаалах мэдрэмж" or the body trying to prevent strong hunger after restriction, long gaps, or over-control.

## Why WP5 marked it `NEEDS STRUCTURE CHANGE`

WP5 marked this fixture `NEEDS STRUCTURE CHANGE` because the visible pattern is coherent, but the hidden food function may not fully explain the user experience.

The current stack does explain:

- all-or-nothing thinking
- strict diet pressure
- meal gaps
- evening hunger
- rebound after restriction

But WP5 noted that `hunger_safety` may under-explain the emotional side of the rebound after punishment restriction. The user may not only be protecting against hunger. They may also be trying to escape the painful feeling of failure, relieve the pressure of "I ruined it", or push away the restart burden of "tomorrow I must be stricter."

## What `hunger_safety` explains well

`hunger_safety` explains the body-state part of the fixture well:

- Long gaps and strict dieting can make later hunger feel urgent.
- Evening hunger can make flexible choices harder.
- The body may seek reliable, fast food after restriction.
- Rebound can be partly a protective response to scarcity or over-control.
- A first gentle change like `next_meal_reset_rule` can reduce the need for punishment-based restriction.

This is useful because it keeps the report body-neutral and non-shaming. It helps the user understand that rebound is not simply discipline failure.

## What `hunger_safety` under-explains

`hunger_safety` under-explains the emotional/restriction narrative:

- The "I already failed" moment.
- The shame or guilt after breaking a strict rule.
- The relief of temporarily escaping the pressure to be perfect.
- The punishment/restriction loop where tomorrow becomes stricter because today felt ruined.
- The restart pressure embedded in all-or-nothing thinking.

If future copy only says "your body is protecting against hunger", the user may feel partially understood but not fully seen. The report could miss the deeper rebound cycle: restriction creates pressure, a break in the rule feels like failure, food becomes relief from that failure, then the next restart creates more pressure.

## Does relief from failure / punishment / restart pressure need a supplementary narrative layer?

Yes. For future user-facing copy, this fixture needs a supplementary narrative layer for relief from failure, punishment, and restart pressure.

This does not necessarily require changing WP3 scoring or WP4 contract immediately. A copy-only layer can explain the missing narrative if the report object already exposes enough evidence through:

- `primaryDriverKey`: `all_or_nothing`
- `secondaryDriverKeys`: `meal_gap`, `evening_hunger`, `strict_diet`
- `interactionId`: `all_or_nothing_punishment_restriction`
- `vulnerableMomentId`: `all_or_nothing_punishment_restriction`
- `firstGentleChangeId`: `next_meal_reset_rule`

However, if the product later needs a stable explicit field for the emotional relief function, a future report-object change may be required.

## What can be solved in copy only

Copy can safely solve these parts without changing scoring or fixture behavior:

- Explain `hunger_safety` as the body side of the rebound.
- Add a non-diagnostic narrative that all-or-nothing pressure can create relief-seeking.
- Say that "сахилгагүй" is an incomplete explanation.
- Explain that punishment restriction can make tomorrow feel heavier.
- Frame `next_meal_reset_rule` as a non-punishment reset.
- Keep the 14-day experiment as a test of softer restart behavior.

Copy-only wording can say:

`Энд зөвхөн өлсөлт биш, "аль хэдийн алдсан" гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Тиймээс дараагийн алхам нь маргааш илүү чанга барих биш, дараагийн хоолоо шийтгэлгүй эхлүүлэхийг турших юм.`

## What would require future structure/report-object changes

Future structure/report-object changes would be needed if the owner wants the system to explicitly represent relief/rebound as a separate hidden function rather than copy-level interpretation.

Possible future changes:

- Add a separate hidden food function such as `escape_from_failure` or `rebound_relief`.
- Add an explicit `supplementaryNarratives` array to the report object.
- Add a `restrictionReboundNarrative` field derived from all-or-nothing, strict diet, punishment restriction, and restart pressure evidence.
- Add tests proving that this fixture surfaces both `hunger_safety` and a relief/restart-pressure narrative.

These are future architecture decisions and should remain HOLD for now.

## What should remain HOLD before runtime integration

Runtime integration should remain HOLD for this fixture until the owner chooses one of the decision options below.

Production report copy rewrite should remain HOLD until the selected decision is reflected in the copy architecture.

Scoring, fixture behavior, and WP4 report object contract should remain unchanged during this decision pass.

## Exact owner decisions needed

Owner needs to decide:

1. Should future copy keep `hunger_safety` as the official hidden food function for this fixture?
2. Should copy add a supplementary relief/rebound narrative without changing the report object?
3. Should future architecture introduce a new explicit hidden function or narrative field for relief from failure/restart pressure?
4. Should `all_or_nothing_restriction_rebound` remain blocked from runtime integration until that future structure exists, or can it proceed after copy-only owner approval?

## Decision options

### Option A — Keep `hunger_safety` as hidden function, solve rebound narrative in copy only
- Pros:
  - No scoring, fixture, or WP4 report-object contract changes needed.
  - Fastest path to future copy readiness.
  - Preserves the body-neutral explanation that rebound is not discipline failure.
  - Uses already available fields: `all_or_nothing`, `strict_diet`, `meal_gap`, `evening_hunger`, and `all_or_nothing_punishment_restriction`.
- Cons:
  - The official hidden function remains narrower than the full user story.
  - Future tests may not be able to assert the relief/restart-pressure narrative as a structured output.
  - Copy may carry too much responsibility for meaning that the data object does not explicitly encode.
- Runtime impact:
  - No runtime impact in WP7.
  - Future runtime integration would need only a copy translation layer, not a report-object change.
- Risk:
  - Medium. The report may still feel slightly incomplete for users whose rebound is more shame/relief-driven than hunger-driven.
- Recommendation:
  - Acceptable only if owner wants the smallest future implementation path and accepts copy carrying the supplementary narrative.

### Option B — Keep `hunger_safety`, add future supplementary narrative layer for restriction/rebound relief
- Pros:
  - Preserves `hunger_safety` for the body-state explanation.
  - Adds the missing emotional/restart-pressure narrative without replacing the current hidden function.
  - Best matches the product thesis that one user has a driver stack, not one cause.
  - Allows future reports to say both: the body is protecting against hunger, and the mind is seeking relief from failure pressure.
- Cons:
  - Requires a future copy/report architecture layer beyond simple key translation.
  - May eventually need tests to distinguish primary hidden function from supplementary narrative.
  - Needs careful wording to avoid sounding like the user failed.
- Runtime impact:
  - No runtime impact in WP7.
  - Future runtime integration may need a copy-layer field or derived narrative rule, but not necessarily scoring changes.
- Risk:
  - Low to medium. The main risk is added complexity, but it produces a more complete and humane explanation.
- Recommendation:
  - Recommended. Keep `hunger_safety` as the hidden function and add a future supplementary narrative layer for relief from failure, punishment, and restart pressure before runtime integration.

### Option C — Future structure change: introduce separate hidden function for relief from failure/restart pressure
- Pros:
  - Makes the emotional rebound function explicit and testable.
  - Reduces ambiguity in future report copy.
  - Could improve fixture precision for users whose restriction/rebound cycle is driven more by shame, guilt, or failure relief than hunger safety.
- Cons:
  - Requires future scoring, fixture, report-object, and test changes.
  - Larger blast radius than WP7 allows.
  - Could overfit one fixture if not designed across multiple restriction/rebound cases.
- Runtime impact:
  - Not allowed in WP7.
  - Future runtime work would need a new field or hidden-function key and corresponding tests.
- Risk:
  - Medium to high. The architecture may become more accurate, but premature structure changes could disturb the already accepted driver-stack calculator and report-object contract.
- Recommendation:
  - Hold for future architecture only. Do not block copy architecture if Option B is accepted, but keep this as a later improvement candidate.

## Recommended owner decision

Choose Option B.

Keep `hunger_safety` as the current hidden food function for the body-state part of the pattern. Add a future supplementary narrative layer for restriction/rebound relief so the copy can explain failure pressure, punishment restriction, and restart burden without changing WP3 scoring or the WP4 report object during this phase.

## Runtime integration gate

Before runtime integration, the selected decision must be reflected in future user-facing copy rules. If Option B is accepted, runtime copy for this fixture must include both:

- Hunger-safety explanation: the body may be protecting against strong hunger after restriction.
- Relief/restart-pressure explanation: the user may also be trying to escape the pressure of having "failed" and needing to restart stricter tomorrow.

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-7/pcos-body-uncertainty-structure-decision.md

# Work Pack 7 PCOS / Body Uncertainty Structure Decision

Focus fixture: `pcos_body_uncertainty_control`

Scope: test-only owner decision document. This does not change WP3 scoring, WP3 fixtures, WP4 report object contract, WP4 tests, runtime behavior, production report rendering, PDF, deploy, backend, payment, QPay, pricing, entitlement, or localStorage behavior.

## Current WP4/WP6 structure summary

Current WP4 compact fixture output:

- Fixture: `pcos_body_uncertainty_control`
- Current safety mode: `mode1`
- Current primary driver: `body_change_uncertainty`
- Current secondary drivers: `control_regain`
- Current interaction ID: `pcos_body_uncertainty_control`
- Current vulnerable moment ID: `pcos_body_uncertainty_control`
- Current hidden food function: `control_regain`
- Current first gentle change: `body_neutral_private_tracking`
- Current 14-day experiment duration: 14 days
- Professional-first: false

Current WP6 copy architecture treats this fixture as structurally plausible but not runtime-ready. The core story is ordinary-mode body uncertainty: when body change feels hard to explain, the user may try to regain steadiness or control through food rules, tracking, or private observation.

## Why WP5 marked it `NEEDS STRUCTURE CHANGE`

WP5 marked this fixture `NEEDS STRUCTURE CHANGE` because the structure is delicate, not because the current fixture is broken.

The current object correctly avoids professional-first escalation. It does not claim a medical cause. However, the fixture name and product context can easily make future copy sound too medically casual if it discusses PCOS/body uncertainty without an explicit bridge that says:

- this is not a diagnosis
- the report is not saying PCOS, hormones, medication, glucose, or any medical cause explains the result
- body uncertainty may increase control-seeking even when the cause is not known
- professional clarification may matter if symptoms are strong, frequent, or worrying

## What ordinary mode explains well

Ordinary mode explains these parts well:

- The user is not automatically routed to professional-first just because body uncertainty is present.
- The fixture can still offer a gentle behavioral observation experiment.
- `body_change_uncertainty` explains the visible state: not knowing what is happening with the body.
- `control_regain` explains the hidden function: trying to regain steadiness when the body feels unpredictable.
- `body_neutral_private_tracking` is an appropriate first gentle change if it stays private, non-obsessive, and body-neutral.

Ordinary mode is useful because not every body-uncertainty case should suppress the report. Some users need a careful non-diagnostic explanation and a gentle observation path.

## What ordinary mode risks under-explaining

Ordinary mode risks under-explaining the medical-context boundary:

- The user may read the fixture as implying PCOS or hormones caused weight difficulty.
- The report may appear to treat body-state uncertainty as purely behavioral.
- The 14-day experiment could sound like a replacement for professional clarification if symptoms are concerning.
- Body-neutral tracking could become too close to obsessive measurement if copy is not careful.
- The report may miss the need to say "тодруулах хэрэгтэй байж магадгүй" without escalating the user into professional-first mode.

## Is a soft medical-context bridge needed?

Yes. A soft medical-context bridge is needed.

This bridge should not change safety routing in WP7. It should not turn ordinary mode into diagnosis. It should add a mandatory copy rule for future user-facing rendering:

`Энэ нь онош биш. Биеийн өөрчлөлт юунаас болж байгааг мэдэхгүй байх нь хяналтаа буцааж авах оролдлогыг нэмэгдүүлж байж магадгүй. Хэрэв шинж тэмдэг хүчтэй, давтамжтай, эсвэл санаа зовоож байвал мэргэжлийн хүнтэй ярилцах нь зөв.`

The bridge keeps ordinary mode intact while preventing medical overclaiming.

## What can be solved in copy only

Copy can safely solve these parts without changing scoring, fixture behavior, safety routing, or the WP4 report object:

- State that the fixture is not a diagnosis.
- Say the report does not claim PCOS, hormones, medication, glucose, or medical cause as fact.
- Explain body uncertainty as a source of control-seeking pressure.
- Keep the 14-day experiment as observation, not treatment.
- Make body-neutral private tracking gentle and non-obsessive.
- Add "talk to a professional if symptoms are strong, frequent, or worrying" without turning the whole route into professional-first.

## What would require future structure/report-object changes

Future structure/report-object changes would be needed only if the owner wants a stable, explicit non-blocking medical context layer in the report object.

Possible future changes:

- Add `softMedicalContextBridge`.
- Add `copyRiskFlags` for medical-cause implication risk.
- Add `structureDecisionNotes` to preserve owner-approved copy constraints.
- Add a non-blocking `medicalContextNote` that appears without suppressing ordinary experiment copy.

These should not be added in WP7 because WP7 is a decision pack only.

## What must remain HOLD

Runtime integration remains HOLD until owner selects an option.

Production report rendering remains HOLD until copy rules are updated to reflect the selected option.

Any new report-object field such as `softMedicalContextBridge`, `copyRiskFlags`, or `structureDecisionNotes` remains HOLD until a future implementation work pack.

## What must NOT be changed now

- Do not change safety mode from `mode1`.
- Do not suppress the ordinary 14-day experiment in WP7.
- Do not change WP3 scoring.
- Do not change WP3 fixtures.
- Do not change WP4 report object contract.
- Do not claim PCOS, hormones, medication, glucose, or any medical cause as fact.
- Do not make the copy diagnostic.
- Do not add runtime behavior.

## Decision options

### Option A — Keep ordinary mode, solve medical sensitivity in copy only
- Pros:
  - No scoring, fixture, safety routing, or WP4 report-object changes needed.
  - Keeps the fixture available for ordinary-mode user understanding.
  - Allows the 14-day observation experiment to remain intact.
- Cons:
  - Medical sensitivity relies entirely on copy quality.
  - Future runtime tests may not know whether the medical-context bridge is required.
  - Risk remains that copy could drift into overconfident causality.
- Runtime impact:
  - No immediate runtime impact.
  - Future runtime would need only approved copy translation.
- Risk:
  - Medium. It is feasible, but fragile unless copy review is strict.
- Recommendation:
  - Acceptable only if owner wants the smallest future path and agrees to strong copy QA.

### Option B — Keep ordinary mode, add mandatory soft medical-context bridge in copy
- Pros:
  - Keeps `mode1` ordinary behavior intact.
  - Adds explicit protection against diagnosis and medical overclaiming.
  - Makes the report feel safer and more respectful for PCOS/body uncertainty contexts.
  - Does not require scoring, fixture, or WP4 contract changes now.
- Cons:
  - Requires future copy rules to always include the bridge for this fixture.
  - Slightly increases report complexity.
  - Needs careful wording so it does not sound like professional-first escalation.
- Runtime impact:
  - No immediate runtime impact in WP7.
  - Future runtime copy layer must include a mandatory non-blocking bridge.
- Risk:
  - Low to medium. The main risk is overexplaining, but it materially reduces medical-cause implication risk.
- Recommendation:
  - Recommended. Keep ordinary mode and add a mandatory soft medical-context bridge in future copy.

### Option C — Future structure change: create a non-blocking medical-context note layer
- Pros:
  - Makes the bridge explicit and testable in a future report object.
  - Separates safety escalation from softer medical-context caution.
  - Could support other body uncertainty fixtures beyond PCOS.
- Cons:
  - Requires future report-object changes.
  - Could add complexity if introduced before runtime copy is proven.
  - Needs new tests and clear rendering rules.
- Runtime impact:
  - Not allowed in WP7.
  - Future implementation could add `softMedicalContextBridge` or similar field without changing safety mode.
- Risk:
  - Medium. Useful architecture, but premature for WP7.
- Recommendation:
  - Hold as a future implementation option if Option B proves insufficient.

### Option D — Future safety escalation change
- Pros:
  - Would ensure stronger professional-first protection for body uncertainty cases if the owner later decides ordinary mode is too risky.
  - Could simplify user-facing safety copy by routing more cases to professional-first.
- Cons:
  - Changes safety behavior and fixture expectations.
  - Could over-escalate ordinary body uncertainty.
  - Would suppress ordinary experimentation more often.
  - Requires scoring, fixture, safety tests, and report-object review.
- Runtime impact:
  - Not allowed in WP7.
  - Future implementation would affect safety routing and test expectations.
- Risk:
  - High. It may make the product more cautious but less useful for non-red-flag body uncertainty.
- Recommendation:
  - Do not choose now. Keep safety escalation unchanged unless future evidence shows ordinary mode is unsafe.

## Recommended owner decision

Choose Option B.

Keep `pcos_body_uncertainty_control` in ordinary mode. Add a mandatory soft medical-context bridge in future copy so the user understands that the report is not diagnosing PCOS, hormones, medication, glucose, or any medical cause.

## Exact future copy rule

Future copy for this fixture must include all of the following:

- "Энэ нь онош биш."
- Do not claim PCOS, hormones, medication, glucose, or medical cause as fact.
- Use body-neutral language.
- Use "тодорхойгүй байдал" and "хяналтаа буцааж авах оролдлого".
- If medical context is mentioned, say "тодруулах хэрэгтэй байж магадгүй", not "шалтгаан нь...".
- Keep the 14-day experiment as observation unless professional-first is triggered.

Recommended copy pattern:

`Энэ нь онош биш. Биеийн өөрчлөлт юунаас болж байгааг мэдэхгүй байх тодорхойгүй байдал нь хяналтаа буцааж авах оролдлогыг нэмэгдүүлж байж магадгүй. Энэ нь PCOS, даавар, эм, глюкоз, эсвэл өөр нэг шалтгаанаас болсон гэж хэлж байгаа хэрэг биш. Хэрэв шинж тэмдэг хүчтэй, давтамжтай, эсвэл санаа зовоож байвал мэргэжлийн хүнтэй ярилцах нь зөв.`

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-7/structure-decision-matrix.md

# Work Pack 7 Structure Decision Matrix

| Fixture | Current issue | Copy-only fix possible? | Needs future structure change? | Recommended option | Runtime gate |
| --- | --- | --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | `hunger_safety` explains the body-state rebound but under-explains relief from failure, punishment, and restart pressure. | Yes, partly. Copy can add a supplementary relief/rebound narrative. | Not immediately. Future structure may add `supplementaryNarrative` if owner wants testable explicit output. | Option B — Keep `hunger_safety`, add future supplementary narrative layer for restriction/rebound relief. | Runtime copy must include both hunger-safety and relief/restart-pressure narrative before integration. |
| `pcos_body_uncertainty_control` | Ordinary mode is structurally plausible, but PCOS/body uncertainty copy can sound medically casual without a bridge. | Yes. Copy can add a mandatory soft medical-context bridge while keeping ordinary mode. | Not immediately. Future structure may add `softMedicalContextBridge` if owner wants explicit report-object support. | Option B — Keep ordinary mode, add mandatory soft medical-context bridge in copy. | Runtime copy must say this is not diagnosis and must not claim PCOS/hormones/medication/glucose as cause. |

## Owner approval checklist

- [ ] Owner confirms `all_or_nothing_restriction_rebound` should keep `hunger_safety` as current hidden food function.
- [ ] Owner confirms future copy should add restriction/rebound relief narrative for `all_or_nothing_restriction_rebound`.
- [ ] Owner confirms `pcos_body_uncertainty_control` should remain ordinary `mode1`.
- [ ] Owner confirms future copy should include a mandatory soft medical-context bridge for `pcos_body_uncertainty_control`.
- [ ] Owner confirms no WP3 scoring changes are approved in WP7.
- [ ] Owner confirms no WP4 report object contract changes are approved in WP7.
- [ ] Owner confirms runtime integration remains HOLD.

## What can be approved now

- Copy architecture direction for both unresolved fixtures.
- Owner recommendation to use Option B for both fixtures.
- Future copy guardrails for restriction/rebound relief and PCOS/body uncertainty.
- A future implementation idea to add explicit narrative fields later, if needed.

## What cannot be approved now

- Runtime integration.
- Production report rendering.
- WP3 scoring changes.
- WP3 fixture behavior changes.
- WP4 report object contract changes.
- WP4 tests changes.
- Safety-routing changes.
- PDF generation.
- Deploy.
- Backend/payment/QPay/pricing/entitlement changes.

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-7/future-report-object-impact.md

# Work Pack 7 Future Report Object Impact

## Summary

WP7 should not change the WP4 report object contract. It only records owner decisions that may guide future implementation.

The recommended decision for both unresolved fixtures is copy-first:

- `all_or_nothing_restriction_rebound`: keep `hunger_safety`, add a supplementary restriction/rebound relief narrative in future copy.
- `pcos_body_uncertainty_control`: keep ordinary `mode1`, add a mandatory soft medical-context bridge in future copy.

## No immediate contract or scoring changes

WP7 requires:

- No immediate WP4 contract change.
- No immediate scoring change.
- No immediate fixture behavior change.
- No immediate safety routing change.
- No immediate runtime rendering change.

These constraints matter because WP3/WP4 are already accepted test-only foundations. WP7 is an owner decision pass, not an implementation pass.

## Future possible additions, if owner approves later

### `supplementaryNarrative`

Possible use: represent secondary narrative layers that are not the main hidden food function.

Example:

- Main hidden function: `hunger_safety`
- Supplementary narrative: relief from failure / punishment / restart pressure

This could help `all_or_nothing_restriction_rebound` become more explicit without replacing `hunger_safety`.

### `softMedicalContextBridge`

Possible use: render non-blocking medical-context caution without switching to professional-first mode.

Example:

- Safety mode remains `mode1`
- Ordinary experiment remains available
- Copy includes "Энэ нь онош биш" and "тодруулах хэрэгтэй байж магадгүй"

This could help `pcos_body_uncertainty_control` stay ordinary while preventing medical overclaiming.

### `copyRiskFlags`

Possible use: tag copy risks that must be checked before rendering.

Example flags:

- `medical_cause_implication`
- `body_shame_sensitivity`
- `restriction_rebound_shame`
- `internal_key_leak_risk`

These flags would support future tests and owner QA.

### `structureDecisionNotes`

Possible use: preserve owner-approved decisions inside test-only or future runtime artifacts.

Example:

- `all_or_nothing_restriction_rebound`: use both hunger safety and relief/restart-pressure narrative.
- `pcos_body_uncertainty_control`: keep ordinary mode plus mandatory medical-context bridge.

## Why these should not be added in WP7

These fields should not be added in WP7 because:

- WP7 is docs-only.
- Runtime integration remains HOLD.
- WP4 report object contract changes are forbidden.
- Scoring and fixture behavior changes are forbidden.
- New fields would require tests, owner review, and possibly fixture artifact regeneration.
- The owner has not yet selected final options in `owner-decision-record.md`.

## Future work pack that might implement them

A future work pack could implement these additions after owner approval:

- Work Pack 8: Test-Only Copy Decision Implementation
- Work Pack 9: Report Object Narrative Extension Prototype
- Work Pack 10: Runtime Integration Planning Gate

The recommended next implementation, if owner approves WP7 Option B for both fixtures, is a test-only copy decision implementation that does not touch production rendering.

## Runtime planning implication

Future runtime planning must not start until:

1. Owner fills `owner-decision-record.md`.
2. Copy architecture is updated to reflect selected options.
3. Any new test-only fields or copy rendering rules are implemented and validated.
4. Safety/payment boundary is verified: safety and professional-context copy must never be blocked by payment.

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-7/copy-rules-for-structure-decision-fixtures.md

# Work Pack 7 Copy Rules for Structure Decision Fixtures

## `all_or_nothing_restriction_rebound`

### Required copy guardrails

- Do not say the user is weak or failed.
- Do not recommend stricter dieting.
- Do not make hunger the only explanation.
- Mention restriction/rebound pressure.
- Mention relief from punishment/restart pressure carefully.
- Frame next-meal reset as gentleness, not another rule.

### Required copy direction

Future copy should say that `hunger_safety` explains part of the pattern, especially the body side of restriction and evening hunger. It should also explain that the rebound may include relief from the feeling of having failed, the pressure to restart, or the burden of punishing oneself with stricter rules.

### Safe phrasing

`Энд зөвхөн өлсөлт биш, "аль хэдийн алдсан" гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Дараагийн алхам нь маргааш илүү чанга барих биш, дараагийн хоолоо шийтгэлгүй эхлүүлэхийг турших юм.`

### What not to say

- "Та сахилгагүй байна."
- "Та дахиж алдахгүйн тулд илүү чанга барих хэрэгтэй."
- "Орой идсэнээ маргааш нөхөх хэрэгтэй."
- "Хэрэв нэг алдсан бол дахин эхлэхээс өөр аргагүй."
- "Энэ зөвхөн өлсөлтөөс болж байна."

### Runtime copy gate

Before runtime integration, copy must include both:

- body-state hunger safety
- relief/restart-pressure narrative

## `pcos_body_uncertainty_control`

### Required copy guardrails

- "Энэ нь онош биш."
- Do not claim PCOS/hormones/medication/glucose as cause.
- Use body-neutral language.
- Use "тодорхойгүй байдал" and "хяналтаа буцааж авах оролдлого".
- If medical context is mentioned, say "тодруулах хэрэгтэй байж магадгүй", not "шалтгаан нь...".
- Keep 14-day experiment as observation unless professional-first is triggered.

### Required copy direction

Future copy should keep ordinary mode but include a soft medical-context bridge. The report should explain that body uncertainty can make control-seeking stronger without claiming the reason for body change.

### Safe phrasing

`Энэ нь онош биш. Биеийн өөрчлөлт юунаас болж байгааг мэдэхгүй байх тодорхойгүй байдал нь хяналтаа буцааж авах оролдлогыг нэмэгдүүлж байж магадгүй. Энэ нь PCOS, даавар, эм, глюкоз, эсвэл өөр нэг шалтгаанаас болсон гэж хэлж байгаа хэрэг биш.`

### What not to say

- "PCOS-оос болсон."
- "Даавраас болсон."
- "Эмнээс болсон."
- "Глюкозоос болсон."
- "Энэ бол онош."
- "Энэ бол эмчилгээний зөвлөгөө."
- "Биеэ илүү сайн хянах хэрэгтэй."

### Runtime copy gate

Before runtime integration, copy must prove that ordinary mode remains ordinary while the medical-context bridge is visible, non-diagnostic, and non-alarming.

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-7/owner-decision-record.md

# Owner Decision Record — WP7

## Decision 1: `all_or_nothing_restriction_rebound`

Selected option:
- [ ] Option A
- [ ] Option B
- [ ] Option C

Owner notes:

Final decision:

Runtime implication:

## Decision 2: `pcos_body_uncertainty_control`

Selected option:
- [ ] Option A
- [ ] Option B
- [ ] Option C
- [ ] Option D

Owner notes:

Final decision:

Runtime implication:

## Approval status

- [ ] Approved for copy architecture only
- [ ] Approved for future test-only implementation
- [ ] Approved for runtime planning
- [ ] Not approved yet

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-7/work-pack-7-recommendation.md

# Work Pack 7 Recommendation

## Recommendation Enum

READY FOR OWNER REVIEW OF STRUCTURE DECISIONS

## Basis

All required WP7 docs exist and both unresolved fixtures are covered:

- `all_or_nothing_restriction_rebound`
- `pcos_body_uncertainty_control`

## Recommended owner choices

- `all_or_nothing_restriction_rebound`: choose Option B — keep `hunger_safety`, add future supplementary narrative layer for restriction/rebound relief.
- `pcos_body_uncertainty_control`: choose Option B — keep ordinary mode, add mandatory soft medical-context bridge in copy.

## Hold conditions

Runtime integration remains HOLD. Production report rendering remains HOLD. WP3 scoring, WP3 fixtures, WP4 report object contract, WP4 tests, PDF generation, deploy, backend, payment, QPay, pricing, entitlement, and localStorage remain out of scope.
