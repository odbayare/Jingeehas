# Jingeehas scoring specification V2

> **DESIGN PHASE ONLY**
> **NOT YET PSYCHOMETRICALLY VALIDATED**
> **NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS**
> **NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS**

## Status

This is a development specification, not validated scoring. It must not replace current production scoring until the validation release gate is met.

## Item scoring

- Core frequency responses score `0–4`: `Огт байгаагүй=0`, `Ховор=1`, `Заримдаа=2`, `Олон удаа=3`, `Бараг үргэлж=4`.
- Self-efficacy responses score `0–4`: `Огт итгэлгүй=0` through `Маш их итгэлтэй=4`.
- Reverse-coded items use `reversed = 4 - observed`.
- Scoring metadata, not UI order or item text, is authoritative.
- All barrier-oriented published subscales use higher = more of the named barrier. The self-efficacy source score is preserved in its natural strength direction; its barrier-profile display uses `4 - mean_confidence`.
- Attention checks and context/safety items receive no subscale score.

## Missing-item rules

- “Хариулахгүй” and skipped optional responses are missing, never zero.
- A subscale is scorable when at least **80% of its retained items** and at least **4 items** are valid. For a 5-item scale, 4 are required; for a 6-item scale, 5 are required.
- During item reduction, no production subscale may contain fewer than 4 retained items. The design target is 5–6.
- If valid, compute the mean over available retained items; do not single-impute user-level answers.
- If invalid, publish `insufficient_response_data`, no numerical score, no rank, and no barrier/strength selection from that subscale.
- Research datasets may use preregistered multiple imputation for model estimation, but imputed values must never be returned as an individual’s observed score.

## Subscale computation

For subscale \(s\):

`raw_mean_s = sum(scored valid items) / count(valid items)`

`score_0_100_s = raw_mean_s / 4 * 100`

Retain at least:

- raw mean;
- 0–100 linear transformation;
- valid and expected item counts;
- scoring version;
- item-version set;
- response-quality flags;
- score confidence category.

The 0–100 transformation improves display readability only. It does not create ratio measurement, a percentile, a probability, or a clinical severity scale.

## Interpretation restrictions

- No public percentile until a representative normative sample and weighting plan are complete.
- No clinical cut-off before criterion validation with an appropriate reference standard.
- No “high / medium / low” label may be described as validated.
- If pilot usability requires labels, use only: **“туршилтын тайлбар — урьдчилсан, эмпирик босго биш”** and store the numeric provisional rule in the scoring version.
- Top barriers and strengths may be ranked within a person only when confidence is adequate. Within-person rank does not imply statistically meaningful difference; ties and near-ties must be shown.

## Response-quality flags

Flags do not prove deception and must not deny access or trigger stigmatizing copy.

### Completion and speed

- `excessive_missingness`: more than 20% missing across scored core items.
- `very_fast_completion`: preregistered lower time bound, derived during pilot from reading-time and observed distribution; no hard-coded value before pilot.
- `long_interruption`: completion spans a duration likely to make the 14-day frame inconsistent; record, do not automatically invalidate.

### Straight-line responding

Flag `straight_line` when all of the following hold:

- at least 90% of answered core items use one response category;
- at least 30 core items are answered;
- the pattern persists across at least 7 of 9 subscales.

Do not flag a genuinely uniform subscale alone. Randomize item order within safe blocks during research where usability permits.

### Long-string and low-variance diagnostics

Store longest identical-response run and within-person response variance. Pilot thresholds must be preregistered before validation analysis and reviewed for false positives among users with genuinely low symptom/barrier levels.

### Contradiction and attention checks

- Use no more than two original, non-scored instructional attention items.
- Use prespecified item pairs that are semantically opposed but not exact negations. Flag only strong, repeated inconsistency; one pair is insufficient.
- Reverse-coded items are not automatically “attention checks.”
- Sensitive safety responses are never treated as contradictions.

### Duplicate and integrity checks

Research-only checks may flag likely duplicate submissions using privacy-preserving study identifiers. Do not use direct customer identifiers in the research response table.

## Score confidence

Confidence is measurement-quality metadata, not personal certainty.

- **Not scorable:** missing rule fails.
- **Limited:** scorable, but any serious response-quality flag is present, or the subscale reliability/measurement model has not passed the validation gate.
- **Provisional:** development/beta only; adequate completeness and no serious flag, but validation is incomplete.
- **Supported:** allowed only after the subscale passes prespecified structural validity, reliability, test–retest, and relevant invariance criteria for the user’s interpretable group.

When standard errors from a fitted model are available, store them. Do not fabricate individual confidence intervals from coefficient alpha.

## Selecting barriers and strengths

Before norms:

- top barriers are the two highest valid barrier-direction subscale scores;
- top strengths are the two lowest barrier-direction scores (or highest natural-direction self-efficacy/awareness scores);
- require at least a 5-point 0–100 difference to force an order; otherwise label as tied;
- exclude `limited` and unscorable subscales;
- do not call a low score a strength when response quality is questionable;
- show that ranking is within the individual, not against the population.

The 5-point tie rule is a display convention and must be labeled preliminary until uncertainty estimates justify a different rule.

## Versioned scoring schema

Every score record must identify:

- `instrument_version_id`;
- `scoring_version_id`;
- included `item_version_id` values;
- item weights (initially equal);
- reverse-code map;
- missingness rule;
- transformation;
- response-quality algorithm version;
- norm-table version, if any;
- interaction-model version, if any;
- code checksum and effective dates.

Any change to item wording, response options, recall period, reverse coding, inclusion, weight, threshold, norm reference, or interaction model requires a new immutable version. Previously generated reports remain bound to the version used at generation.

## Validation gate for scoring

Equal-weight means are the default because differential weights are not justified before validation. Factor-score or IRT-based scoring may be evaluated in research, but cannot replace transparent equal-weight scoring unless it demonstrates stable incremental value, acceptable fairness, reproducibility, and interpretable versioning in an independent sample.
