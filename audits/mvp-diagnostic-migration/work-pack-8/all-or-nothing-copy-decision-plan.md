# Work Pack 8 All-or-Nothing Copy Decision Plan

Focus fixture: `all_or_nothing_restriction_rebound`

## Current WP4 object facts

- Fixture name: `all_or_nothing_restriction_rebound`
- Safety mode: `mode1`
- Primary driver: `all_or_nothing`
- Secondary drivers: `meal_gap`, `evening_hunger`, `strict_diet`
- Interaction ID: `all_or_nothing_punishment_restriction`
- Vulnerable moment ID: `all_or_nothing_punishment_restriction`
- Hidden food function: `hunger_safety`
- First gentle change: `next_meal_reset_rule`
- 14-day experiment duration: 14
- Professional-first: false

## WP7 recommended decision

WP7 recommended Option B:

- Keep `hunger_safety` as the current hidden food function.
- Add a future supplementary narrative layer for restriction/rebound relief.
- Do not change WP3 scoring, WP3 fixtures, WP4 report object contract, or runtime behavior now.

## Proposed `supplementaryNarrative`

- Field: `supplementaryNarrative`
- Exact narrative ID: `restriction_rebound_relief`
- Applies to: `all_or_nothing`, `strict_diet`, `meal_gap`, `evening_hunger`, `all_or_nothing_punishment_restriction`
- Required in future user copy: true
- Purpose: explain relief from failure / punishment / restart pressure while preserving `hunger_safety` as the body-state explanation.

## Copy components

### Hunger-safety explanation

Future copy must explain that the body may be protecting against strong hunger after restriction, long gaps, or evening hunger. This should remain body-neutral and non-shaming.

### Relief from failure pressure

Future copy must explain that the user may also be trying to get temporary relief from the feeling that they have already failed.

### Punishment/restart pressure

Future copy must name the pressure of "tomorrow I must be stricter" without encouraging stricter dieting.

### Next-meal reset as gentleness

Future copy must frame `next_meal_reset_rule` as a gentle next-meal reset, not another rule, punishment, or compensation plan.

## Forbidden copy

Do not use or imply:

- weak / failed
- stricter dieting
- discipline failure
- compensate tomorrow
- hunger as the only explanation

## Proposed user-facing paragraph draft in Mongolian

`Энд зөвхөн өлсөлт биш, “аль хэдийн алдсан” гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Хэт чанга барих, удаан өлсөх, дараа нь маргааш илүү чангална гэж бодох нь rebound-ийн дарамтыг нэмэгдүүлж болно. Тиймээс эхний алхам нь өөрийгөө шийтгэх биш, дараагийн хоолоо зөөлөн эхлүүлж биеийн өлсөлт болон restart дарамт хоёр хэр өөрчлөгдөхийг ажиглах юм.`

## Test-only acceptance criteria

A future test-only prototype should pass only if:

- `hiddenFoodFunctionKey` remains `hunger_safety`.
- `supplementaryNarrative.id` is `restriction_rebound_relief`.
- `supplementaryNarrative.requiredInUserCopy` is true.
- `softMedicalContextBridge` is null.
- `copyRiskFlags` include `restriction_rebound_shame_risk`, `hunger_safety_underexplains_rebound`, and `punishment_restart_pressure`.
- User-facing draft includes both hunger-safety and relief/restart-pressure concepts.
- User-facing draft does not say the user is weak, failed, undisciplined, or should compensate tomorrow.
- `runtimeGate.canRenderInRuntime` remains false.

## Runtime gate

Runtime integration remains HOLD. Future runtime copy may not render this fixture until:

- owner approves the copy decision metadata
- future tests prove `restriction_rebound_relief` is attached
- the copy includes both hunger-safety and relief/restart-pressure narrative
- strict dieting and shame-language regressions are blocked
- internal keys are not rendered to the user
