# Jingeehas psychometric data model V2

> **DESIGN PHASE ONLY**
> **NOT YET PSYCHOMETRICALLY VALIDATED**
> **NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS**
> **NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS**

## Status and design principles

Logical design only. **Do not migrate or connect this model to production.**

Principles:

- immutable, version-addressed measurement artifacts;
- research purpose and consent separated from commercial customer data;
- no direct customer identifier in research response/score tables;
- safety data minimized and access-separated;
- reproducibility from item through report;
- norms and interactions disabled by default;
- lineage and auditability without logging answer content.

Use UUIDs or equivalent opaque IDs. Timestamps are UTC. Published versions are immutable; corrections create successors.

## Identity and separation boundary

Use separate schemas/datastores and access roles:

- `commerce.*`: existing customer, payment, entitlement, and production assessment data; outside this design.
- `research_governance.*`: consent, recontact, study enrollment, and the restricted identity-to-research-ID link.
- `psychometrics.*`: de-identified instrument metadata, responses, scores, validation metrics, norms, models, and report definitions.

Only an approved export service may cross from governance to psychometrics. It emits a random `research_participant_id` and removes customer/session/email/phone/payment identifiers. The commercial report service cannot read `research_governance` or `anonymized_research_responses`.

## Core entities

### `instrument_versions`

| Field | Purpose |
|---|---|
| `instrument_version_id` PK | Opaque immutable ID |
| `instrument_key` | Stable family key, e.g. `jingeehas-core` |
| `semantic_version` | Human-readable version |
| `language_tag` | e.g. `mn-MN` |
| `recall_period` | Canonical wording/period |
| `status` | draft, pilot, frozen_validation, released, retired |
| `validation_status` | development, beta, validated_for_declared_scope |
| `applicable_population` | Structured declared scope |
| `parent_instrument_version_id` FK nullable | Lineage |
| `content_checksum` | Reproducibility |
| `effective_from`, `retired_at` | Lifecycle |
| `created_at`, `approved_at`, `approved_by_role` | Audit |

Constraint: one immutable content checksum per published version.

### `item_versions`

| Field | Purpose |
|---|---|
| `item_version_id` PK | Immutable wording/version |
| `item_key` | Stable item identity |
| `instrument_version_id` FK | Owning instrument version |
| `construct_key`, `facet_key` | Intended content mapping |
| `item_text` | Mongolian source text |
| `behavioral_context`, `recall_period` | Interpretation |
| `response_option_set_id` FK | Allowed options |
| `display_order_block` | Administration layout |
| `reverse_coded` | Explicit scoring metadata |
| `scored` | False for context/attention/safety |
| `sensitive`, `clinical_risk` | Handling |
| `copyright_source`, `original_or_adapted` | Rights |
| `status`, `content_checksum` | Lifecycle/reproducibility |

Unique: `(instrument_version_id, item_key)`.

### `subscale_definitions`

| Field | Purpose |
|---|---|
| `subscale_definition_id` PK | Immutable definition |
| `instrument_version_id` FK | Applicable instrument |
| `subscale_key`, `display_name` | Identity |
| `construct_definition` | Meaning |
| `direction` | barrier or strength |
| `expected_factor` | Model expectation |
| `minimum_valid_items`, `minimum_valid_fraction` | Missing rule |
| `included_item_version_ids` | Prefer normalized join table |
| `status`, `validation_status` | Gate |

Normalize membership in `subscale_items(subscale_definition_id, item_version_id, item_weight, scoring_order)`. Initial weights are 1.

### `response_options`

Model as:

- `response_option_sets(response_option_set_id, key, version, value_type, status, checksum)`;
- `response_options(response_option_id, response_option_set_id, option_key, label, numeric_value nullable, display_order, is_missing, is_exclusive, active)`.

Do not infer numeric values from display order.

### `scoring_versions`

| Field | Purpose |
|---|---|
| `scoring_version_id` PK | Immutable scoring algorithm |
| `instrument_version_id` FK | Exact source |
| `semantic_version`, `status` | Lifecycle |
| `algorithm_type` | equal_mean, factor_score_research, etc. |
| `reverse_code_map` | Redundant signed artifact or normalized rules |
| `missing_rule` | Machine-readable version |
| `transform_rule` | Raw-to-0–100 |
| `quality_rule_version` | Flag algorithm |
| `norm_table_set_id` nullable | Null before norms |
| `interaction_model_version_id` nullable | Null/default-off |
| `code_checksum`, `spec_checksum` | Reproducibility |
| `approved_at`, `approved_by_role` | Gate |

### `validation_samples`

| Field | Purpose |
|---|---|
| `validation_sample_id` PK | Study/sample identity |
| `study_id` | Protocol identity |
| `sample_role` | development, validation, normative |
| `instrument_version_id` FK | Administered version |
| `protocol_registration` | URI/reference |
| `recruitment_frame`, `inclusion_criteria` | Sampling |
| `target_n`, `analyzable_n` | Counts |
| `collection_start`, `collection_end` | Timing |
| `consent_version` | Governance link, no direct identity |
| `ethics_reference` | Approval |
| `sampling_weights_version` nullable | Norm samples |
| `freeze_timestamp`, `dataset_checksum` | Reproducibility |
| `access_classification` | Restricted level |

### `anonymized_research_responses`

Long format:

| Field | Purpose |
|---|---|
| `research_response_id` PK | Row ID |
| `validation_sample_id` FK | Sample |
| `research_participant_id` | Random study-specific pseudonym |
| `administration_id` | Supports retest without identity |
| `timepoint` | baseline/retest/follow-up |
| `item_version_id` FK | Exact item |
| `response_option_id` FK nullable | Categorical response |
| `numeric_value` nullable | Validated numeric input only |
| `is_missing`, `missing_reason` | Explicit missingness |
| `presented_at`, `answered_at` | Quality timing, coarsened as needed |
| `quality_metadata` | Nonidentifying administration facts |
| `ingested_at`, `source_checksum` | Lineage |

Constraints:

- exactly one value representation;
- unique `(administration_id, item_version_id)`;
- no free text unless a separate high-restriction table and consent explicitly permit it;
- urgent safety answers live in a separate safety system and are not copied here by default.

### `subscale_scores`

| Field | Purpose |
|---|---|
| `subscale_score_id` PK | Score row |
| `administration_id` | Research or released-production namespace |
| `subject_namespace` | Prevent cross-domain joins |
| `subscale_definition_id` FK | Construct version |
| `scoring_version_id` FK | Algorithm |
| `raw_mean`, `score_0_100` | Values |
| `valid_item_count`, `expected_item_count` | Completeness |
| `score_confidence` | not_scorable/limited/provisional/supported |
| `standard_error` nullable | Model-based only |
| `quality_flags` | Versioned codes |
| `computed_at`, `input_checksum` | Reproducibility |

Research and production rows should preferably use separate physical tables/views even with a namespace field.

### `reliability_metrics`

| Field | Purpose |
|---|---|
| `reliability_metric_id` PK | Metric |
| `validation_sample_id` FK | Evidence sample |
| `subscale_definition_id` FK | Score |
| `scoring_version_id` FK | Version |
| `metric_type` | omega_total, omega_h, alpha, ICC, etc. |
| `estimate`, `ci_low`, `ci_high` | Result |
| `method_specification` | Estimator/model |
| `n`, `subgroup_key` nullable | Scope |
| `analysis_version`, `code_checksum` | Reproducibility |
| `review_status` | draft/verified/published |

### `norm_tables`

Use:

- `norm_table_sets(norm_table_set_id, instrument_version_id, scoring_version_id, normative_sample_id, population_definition, weighting_method, status, effective dates, checksum)`;
- `norm_tables(norm_row_id, norm_table_set_id, subscale_definition_id, subgroup_definition, statistic_type, raw_score_lower, raw_score_upper, reference_value, standard_error, effective_n, suppression_flag)`.

No active norm set until representative sampling, fairness review, minimum cell size, and approval pass. Never backfill norms from production customers.

### `interaction_models`

| Field | Purpose |
|---|---|
| `interaction_model_id` PK | Stable hypothesis family |
| `interaction_model_version_id` | Immutable version |
| `construct_a_definition_id`, `construct_b_definition_id` FK | Exact inputs |
| `required_context_definition` nullable | Context moderator |
| `model_specification` | Centering, main effects, product term |
| `development_sample_id`, `validation_sample_id` FK | Evidence lineage |
| `coefficient`, `ci`, `performance_delta` | Results |
| `applicable_population` | Scope |
| `validation_status` | hypothesis_only/replicated/released |
| `production_enabled` | Default false |
| `copy_template_id` nullable | Approved interpretation |
| `approved_at`, `checksum` | Gate |

Database default and constraint: `production_enabled=false`; enabling requires `validation_status='released'`, independent validation reference, and approval.

### `report_model_versions`

| Field | Purpose |
|---|---|
| `report_model_version_id` PK | Immutable schema/copy model |
| `report_schema_version` | V4 family |
| `instrument_version_id`, `scoring_version_id` FK | Inputs |
| `interaction_model_version_id` nullable | Only released model |
| `norm_table_set_id` nullable | Only active norms |
| `recommendation_library_version` | Separate evidence-controlled copy |
| `template_checksum`, `renderer_checksum` | Reproducibility |
| `validation_status`, `status` | Gate |
| `effective_from`, `retired_at` | Lifecycle |

Report snapshots reference this ID and remain immutable.

## Governance entities required in addition

- `research_studies`
- `consent_versions`
- `research_consents`
- `participant_recontact_keys` (physically separate/encrypted)
- `data_access_grants`
- `data_exports`
- `analysis_runs`
- `model_approvals`
- `version_change_log`
- `retention_and_deletion_events`

These are necessary for ethical operation even though they were not in the minimum requested table list.

## Deletion and retention

Withdrawal deletes or renders inaccessible the identity link and removes research records when consent/ethics terms require it, while preserving only legally/ethically allowed aggregate results. Commercial deletion does not automatically delete separately consented research data; the consent must explain this clearly and provide a research withdrawal route.

## Prohibited joins and uses

- Do not join research responses to payments, marketing attribution, or personal contact details.
- Do not use research consent as marketing consent.
- Do not use production answers to train/recalibrate without separate research consent and sample assignment.
- Do not personalize current paid reports from validation-only models.
- Do not place medical/context values in psychological score rows.
- Do not use normative demographic cells small enough to re-identify participants.

## Implementation release checklist (future only)

Before any migration proposal: privacy impact assessment, threat model, consent design, ethics approval, role/access matrix, retention schedule, data-flow diagram, version invariants, deletion test, backup test, small-cell suppression, and independent security/psychometric review.
