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
