# Jingeehas report schema V4

> **DESIGN PHASE ONLY**
> **NOT YET PSYCHOMETRICALLY VALIDATED**
> **NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS**
> **NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS**

## Status and governing rule

Report V4 is a proposed schema for a validated or explicitly preliminary multi-item instrument. It is not authorized for current production.

Every substantive conclusion must derive from exactly one of:

1. a valid subscale score;
2. an empirically validated, versioned interaction;
3. an explicitly labeled contextual fact supplied by the user.

The report must store machine-readable provenance for every conclusion. Pure answer paraphrasing is prohibited: a report may show a contextual fact because the user explicitly reported it, but it must label it as context and must not dress the same answer up as an inferred psychological finding.

## Top-level schema

```json
{
  "report_schema_version": "jingeehas-report-v4",
  "instrument_version": "string",
  "scoring_version": "string",
  "report_model_version": "string",
  "norm_version": null,
  "interaction_model_version": null,
  "generated_at": "ISO-8601",
  "validation_status": "development|beta|validated_for_declared_scope",
  "profile": {},
  "ranked_findings": {},
  "interactions": [],
  "context_modules": [],
  "starting_direction": {},
  "safety_guidance": {},
  "limitations": {},
  "provenance": []
}
```

No customer answer text, direct identifier, safety detail, or research consent record belongs in validation metadata.

## Reading order

### 1. Scope banner

Show:

- instrument/report versions;
- validation status in plain Mongolian;
- “not a diagnosis” statement;
- norms availability;
- whether the report is preliminary/beta.

The banner cannot be hidden below the results.

### 2. Profile score chart

Use a horizontal dot or bar profile for all valid core subscales on the 0–100 display scale. Show:

- neutral construct names;
- exact scores;
- higher-direction legend;
- missing/insufficient markers;
- confidence icon or label;
- no percentile axis unless a released norm table applies.

Context modules and safety items never appear on the same axis.

### 3. Subscale score cards

Each card contains:

- `subscale_id` and version;
- display name;
- 0–100 score and valid/expected item count;
- score confidence;
- one construct-safe interpretation;
- what the score does **not** mean;
- evidence status;
- optional within-person rank.

Do not show item answers as if they were independent findings.

### 4. Top two barriers

Select under the scoring specification. Each card states:

- why the subscale qualifies;
- whether the ranking is tied/near-tied;
- a report-safe behavioral implication;
- uncertainty and validation status.

Do not use causal language such as “this is why you cannot lose weight.”

### 5. Top two strengths

Strengths come from favorable, valid subscale direction—not the mere absence of a high barrier and not context privilege. Show how a strength might support a starting direction without guaranteeing success.

### 6. Validated interactions only

An interaction may appear only when:

- `production_enabled=true` in an immutable interaction-model version;
- the user has valid scores for both constructs;
- any required context is present and consented for this use;
- the model is applicable to the declared population;
- public copy matches the validated direction and uncertainty.

If none qualify, omit the section or state that no validated interactions are being reported. Never fill the space with heuristic co-occurrence.

### 7. Context modules

Display sleep/fatigue, movement, injury, schedule, cost, social support, medication, reproductive context, and other declared facts separately. Every statement begins or ends with a provenance label equivalent to “Таны мэдээлсэн нөхцөл.”

Context can constrain a suggestion (for example, avoid movement advice that conflicts with injury context) but cannot change a psychological total.

### 8. Starting direction

Offer one low-risk direction derived from:

- the highest-confidence barrier;
- a relevant strength;
- applicable context boundaries;
- an approved recommendation library.

It is a starting hypothesis, not treatment. Include a small version, a review point, and a stop/escalation boundary where relevant. Recommendations require their own evidence and safety review; score validity alone does not validate an intervention.

### 9. Safety guidance

Safety routing bypasses ranking. Show the minimum necessary message, immediacy, and appropriate professional/emergency direction under a separately approved protocol. Do not reveal safety responses elsewhere or include them in profile charts.

### 10. Evidence limitations and norms disclaimer

Always disclose:

- self-report and recall limitations;
- validation scope and sample;
- whether norms exist for the applicable population;
- that a score is not diagnosis, causation, or predicted weight loss;
- that contextual/medical causes require appropriate professional assessment.

Before norms: “Энэ оноо нь бусад Монгол хэрэглэгчтэй харьцуулсан хувь хэмжээ биш.”

### 11. Validation/version metadata

Reader-facing metadata includes:

- instrument, scoring, report, interaction, and norm versions;
- validation status and release date;
- applicable population/language;
- material limitations;
- link to public methods and change log.

## Provenance object

Each conclusion has:

```json
{
  "conclusion_id": "string",
  "source_type": "subscale|validated_interaction|context_fact",
  "source_ids": ["string"],
  "source_versions": ["string"],
  "copy_template_id": "string",
  "confidence": "not_scorable|limited|provisional|supported",
  "limitations": ["string"]
}
```

Internal provenance may reference item-version IDs but the public report must not expose sensitive item answers.

## Banned report behaviors

- repeating a selected answer and calling it an insight;
- inferring an unmeasured construct;
- using one item as a subscale;
- presenting a context fact as personality or motivation;
- using a nonvalidated interaction;
- clinical labels or cut-offs without clinical validation;
- percentile or “compared with Mongolians” before norms;
- claiming treatment matching, causal explanation, or future kilograms lost;
- ranking an invalid/low-confidence score;
- implying that low barrier scores prove health or safety.

## Acceptance checks

- Every finding resolves to a valid provenance object.
- No context/safety item is present in a core-score calculation.
- Invalid subscales cannot enter rankings.
- Interactions default off and require a released model.
- Report copy includes the correct validation and norms disclaimers.
- Snapshot is immutable and reproducible from exact versions.
- Accessibility, Mongolian readability, and sensitive-language review pass.
