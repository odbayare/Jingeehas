# Pilot V2.1 Equal-Weight Scoring Runtime

## Non-validation status

These calculations produce descriptive pilot-profile scores only. They are AI-designed, not human-reviewed, not psychometrically validated, not normed, and not diagnostic.

## Deterministic contract

Responses are registry codes `0`–`4`; `NA` is stored as not applicable and omitted from numerator and denominator. The engine reads the candidate bank’s explicit direction and a separate construct-orientation registry.

- Barrier constructs expose a `nativeScore` where more means more of the named barrier.
- Capability constructs expose a `nativeScore` where more means more of the named capability.
- `barrierBurdenScore` equals `nativeScore` for barriers and `100 - nativeScore` for capabilities.

Customer bars always use `nativeScore`. A high self-efficacy or hunger/satiety-awareness response therefore renders as high capability, never as a high burden under a positive label. No wording inference, imputation, V1 weight, mandatory anchor, threshold, regex signal, or 50-point classification is used.

For a scorable construct:

`raw_mean = sum(valid direction-adjusted scores) / valid item count`

`nativeScore = raw_mean / 4 × 100`

Six-item constructs need five valid items; five-item constructs need four. Restrictive rebound contains four items and needs all four. Status is `complete`, `partial_scorable`, or `insufficient_data`.

The research-quality item is never scored. Six bounded context items and three minimum safety-domain items live in separate versioned registries and tables. The server validates their response codes. Only stored safety codes can derive `safetyRoute`; client semantic flags have no authority. Context and safety cannot change a subscale. Safety stops ranking, strengths, and starting-direction interpretation. Interactions are disabled.

## Scale registry

One shared immutable registry supplies both UI labels and numeric mappings for recent frequency, 30-day frequency, confidence, typicality, candidate-specified difficulty/control, and non-scored research agreement. Unknown codes fail rather than default to zero.
