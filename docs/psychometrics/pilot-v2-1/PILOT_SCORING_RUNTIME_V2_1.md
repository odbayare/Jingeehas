# Pilot V2.1 Equal-Weight Scoring Runtime

## Non-validation status

These calculations produce descriptive pilot-profile scores only. They are AI-designed, not human-reviewed, not psychometrically validated, not normed, and not diagnostic.

## Deterministic contract

Responses are registry codes `0`–`4`; `NA` is stored as not applicable and omitted from numerator and denominator. The engine reads the candidate bank’s explicit direction. `higher_barrier` retains the numeric value; `higher_capability` becomes `4 - value` so every displayed profile bar is oriented toward more endorsement of the named difficulty or less support from the named capability. No wording inference, imputation, V1 weight, mandatory anchor, threshold, or regex signal is used.

For a scorable construct:

`raw_mean = sum(valid direction-adjusted scores) / valid item count`

`transformed_score = raw_mean / 4 × 100`

Six-item constructs need five valid items; five-item constructs need four. Restrictive rebound contains four items and needs all four. Status is `complete`, `partial_scorable`, or `insufficient_data`.

The research-quality item is never scored. Context and safety inputs are separate and cannot change a subscale. Safety can stop ordinary interpretation. Interactions are disabled.

## Scale registry

One shared immutable registry supplies both UI labels and numeric mappings for recent frequency, 30-day frequency, confidence, typicality, candidate-specified difficulty/control, and non-scored research agreement. Unknown codes fail rather than default to zero.
