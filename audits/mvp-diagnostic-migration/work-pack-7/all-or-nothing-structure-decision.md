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
