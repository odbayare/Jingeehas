# Migration Recommendation

Recommendation: migrate in layers. Do not rewrite the questionnaire, scoring, report renderer, PDF, backend, QPay, pricing, entitlement, or app UI until the driver taxonomy is mapped and test-locked.

## Best Path

### Phase 1: Documentation and Mapping Only

Status: this work pack.

- Preserve current runtime files.
- Document current question, report, diary, safety, and experiment coverage.
- Define mapping from old mechanism keys to new driver keys.
- Identify missing questions and missing report contracts.

### Phase 2: Add a Non-Runtime Taxonomy Spec

Create a future planning doc or data spec that maps:

| Current mechanism | New driver candidates |
|---|---|
| `reward` | `self_reward`, `comfort`, `quick_recovery` |
| `regulation` | `stress`, `anxiety`, `decompression`, `comfort` |
| `hungerSafety` | `meal_gap`, `evening_hunger`, `hunger_safety`, `fasting_rebound` |
| `glucose` | `medical_concern`, `medical_red_flag`, `professional_first` |
| `satiety` | `loss_of_control_feeling`, `binge_risk` when severe |
| `cue` | `visible_snacks`, `delivery_app`, `food_photo_cue`, `low_friction_default` |
| `collapse` | `all_or_nothing`, `monday_restart`, `escape_from_failure`, `punishment_restriction` |
| `executive` | `fatigue`, `low_friction_default`, `quick_recovery` |
| `circadian` | `sleep_disruption`, `fatigue`, `evening_hunger` |
| `social` | `social_table`, `belonging`, `alcohol_context` if added |
| `medical` | `medical_concern`, `medical_red_flag`, `professional_first`, `body_change_uncertainty` |
| `autonomy` | `anger_resentment`, `strict_diet`, `punishment_restriction` |
| `physiological` | `medical_concern`, `meal_gap`, `quick_recovery` |
| `decisionDefault` | `low_friction_default`, `delivery_app`, `nearby_store`, `cafeteria` |
| `rewardDeficit` | `emptiness`, `self_reward`, `comfort` |
| `roleOverload` | `fatigue`, `self_reward`, `comfort`, `low_friction_default` |
| `shameAvoidance` | `shame`, `guilt`, `escape_from_shame`, `severe_body_distress` |
| `bodySafety` | `severe_body_distress`, `shame`, `escape_from_shame`, `professional_first` |
| `identity` | `shame`, `escape_from_failure`, wrong self-explanation |
| `perfectionism` | `all_or_nothing`, `strict_diet`, `monday_restart` |

### Phase 3: Add Test-Only Driver Stack Calculator

Before changing user-facing behavior, add a test-only or parallel calculator:

```text
current answers + diary
-> old mechanism evidence
-> new driver scores
-> primary driver
-> secondary drivers
-> interaction
-> vulnerable moment
-> first gentle change candidate
-> diary confirmation targets
```

This should not replace current report output until regression tests show parity and safety invariants.

### Phase 4: Add Missing Questions Carefully

Add only after mapping is stable:

- Shift work.
- Nearby store/cafeteria/default context.
- Alcohol/social table.
- Loneliness vs emptiness vs belonging.
- Shame/body-image/stigma severity.
- Compensatory behavior/binge-risk thresholds.

Do not rewrite existing questions wholesale. Most are useful and should be remapped first.

### Phase 5: Report Contract Migration

Introduce a report object before changing copy:

```text
{
  driver_scores,
  primary_driver,
  secondary_drivers,
  interaction_pattern,
  vulnerable_moment,
  visible_condition,
  hidden_food_function,
  wrong_self_explanation,
  first_gentle_change,
  fourteen_day_experiment,
  removed_feature_confirmation_plan,
  safety_route,
  evidence_sources
}
```

Then render the current report from that object. This reduces risk compared with editing report copy and scoring at the same time.

### Phase 6: PDF and Backend Later

Only after runtime report contract is stable:

- update PDF export scripts;
- update mock backend report snapshots;
- update future backend persistence plan if needed;
- keep QPay/pricing/entitlement unchanged unless explicitly scoped.

## Guardrails

- Safety routes must always beat payment and ordinary reports.
- Mode3 professional-first must not show ordinary 14-day weight-loss experiments.
- Mode4 urgent safety must not show ordinary report or paywall.
- Payment/QPay/pricing/entitlement must remain out of this migration unless separately approved.
- Do not deploy from taxonomy or report planning work.

## Recommended Next Work Pack

Work Pack 2 should be docs/test-only:

1. Create `audits/mvp-diagnostic-migration/driver-taxonomy-crosswalk.md`.
2. Define exact scoring weights for new driver keys without changing runtime.
3. Add a test fixture plan for 8-10 driver-stack archetypes.
4. Identify which current tests would need updates when runtime migration begins.
