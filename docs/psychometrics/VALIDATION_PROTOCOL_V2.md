# Jingeehas validation protocol V2

> **DESIGN PHASE ONLY**
> **NOT YET PSYCHOMETRICALLY VALIDATED**
> **NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS**
> **NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS**

## Aim

Develop and validate an original Mongolian, non-diagnostic profile of weight-loss barriers and eating-related behavior. Validation is claim-specific and version-specific: evidence for one version, language, use, or population does not automatically transfer to another.

## Sample roles must remain distinct

| Group | Primary purpose | May set final parameters? | May define norms? |
|---|---|---|---|
| Development sample | Item distributions, EFA, reduction, early reliability | Yes, development parameters only | No |
| Validation sample | Independent CFA, reliability confirmation, validity and preregistered interactions | Yes, release decision against frozen specification | No, unless separately designed and powered |
| Normative sample | Weighted reference distributions for declared Mongolian population(s) | Norm tables only | Yes |
| Production users | Commercial use after release | No opportunistic refitting | No, unless separately invited, consented, and sampled into research |

No record silently changes role. Production users are not a convenient validation or normative sample.

## Stage 0: governance, rights, and preregistration

- Name a scientific lead, data steward, safety lead, Mongolian language lead, and independent statistical reviewer.
- Freeze construct definitions, initial items, primary outcomes, exclusion rules, missingness, sample-size rationale, model comparisons, reduction rules, and validation gates before viewing confirmatory outcomes.
- Register the protocol, hypotheses, and analysis plan in a time-stamped public or access-controlled registry, with sensitive operational details redacted only when necessary.
- Resolve comparator licenses and Mongolian translation permissions before administration.
- Approve consent, distress/safety routing, compensation, withdrawal, and data-retention procedures through appropriate ethics review.

## Stage 1: expert content review

### Panel composition

Target 8–12 reviewers with no single profession dominating:

- 2 psychometricians/quantitative psychologists;
- 1–2 behavioral scientists with eating/weight expertise;
- 1 clinical psychologist or psychiatrist with eating-disorder competence;
- 1 physician or dietitian with obesity/weight-management expertise;
- 2 Mongolian questionnaire/linguistics and plain-language specialists;
- 1 research ethics/privacy specialist;
- at least 2 people with relevant lived experience, compensated and supported.

Manage conflicts of interest and record independent ratings before discussion.

### Content-validity process

For every item, independently rate relevance, clarity, cultural fit, construct specificity, reading burden, sensitivity, and risk on a 4-point scale. Compute item- and scale-level content-validity indices with confidence intervals; use a modified kappa where appropriate. Do not use a numeric cut alone: retain a decision log for revise/retain/delete and construct coverage.

Check that:

- each facet has adequate representation;
- no item is diagnostic, moralizing, causal, double-barreled, or copied;
- context/medical content is separated;
- reverse items are linguistically natural, not merely negated;
- the full bank covers favorable and unfavorable variance.

## Stage 2: cognitive interviews and linguistic review

Recruit approximately 24–36 Mongolian-speaking adults in iterative waves, purposively varying age, sex/gender, education, urban/rural residence, reading confidence, weight-loss experience, and digital familiarity.

Use think-aloud plus scripted probes:

- What does the question mean in the participant’s own words?
- What period did they recall?
- How did they choose an answer?
- Did any word feel blaming, clinical, vague, or unnatural?
- Does the item refer to one behavior?
- Are response options distinct and exhaustive enough?
- Would context, season, household eating, or food availability change interpretation?

After each wave, revise and re-test changed items. Document comprehension failures and semantic drift. Use two independent Mongolian reviewers and adjudication; if English documentation is needed, use forward translation, blind back-translation for documentation, and committee review, while treating Mongolian—not English—as the source instrument.

## Stage 3: pilot development sample

### Sampling

Recruit beyond the existing customer funnel to avoid only highly motivated paid users. Use quotas or stratification for relevant demographic and contextual diversity. Exclude urgent-safety participants from burdening research continuation after providing appropriate routing; preserve only the minimum consented research data.

### Sample-size plan

For an initial 54 scored items, target **at least 600 analyzable development participants**, preferably 800 when subgroup and missingness goals permit. This is a planning target, not a universal ratio rule. Before recruitment, run Monte Carlo simulations for ordinal EFA/factor recovery under expected loadings, factor correlations, category distributions, and missingness. Increase the target if simulations show inadequate recovery or subgroup precision.

### Item analysis

- category use, floor/ceiling effects, missingness, completion time;
- polychoric correlation matrix;
- corrected item-total relationships within intended scales;
- redundancy/local dependence;
- differential item functioning signals;
- response-quality sensitivity analyses;
- qualitative review of flagged items;
- impact of reverse wording and method factors.

Do not delete solely to maximize alpha. Protect content breadth and cultural meaning.

### EFA and item reduction

- Use ordinal-appropriate estimation and oblique rotation.
- Determine factor count using parallel analysis, scree, theory, and interpretability.
- Compare the proposed nine-factor structure with plausible merged/split alternatives.
- Use preregistered loading/cross-loading guidance as decision aids, not automatic truth.
- Retain 48–55 core items only if each factor keeps adequate facet coverage and at least four items, preferably five or six.
- Freeze wording and scoring before independent CFA.

## Stage 4: independent validation sample

Recruit a genuinely independent sample after the model and retained items are frozen. No participant overlaps with development.

Target **at least 800 analyzable participants**, subject to ordinal-CFA Monte Carlo power and subgroup/invariance requirements. Oversample only under a declared weighting and fairness plan; do not claim representativeness.

### CFA

- Fit the preregistered correlated-factor model with ordinal estimation.
- Report chi-square, CFI/TLI, RMSEA with interval, SRMR, loadings, residuals, factor correlations, and admissibility.
- Test only preregistered plausible alternatives/bifactor models and disclose all.
- Avoid claiming a general total score unless a general factor and reliability/interpretability evidence justify it.
- Cross-validate any post-hoc modification in another sample.

### Internal consistency

Report ordinal omega (primary), omega hierarchical when relevant, and alpha for comparability, all with intervals. Reliability is score- and sample-specific. Target omega ≥ .70 for group/profile use, with tighter requirements if individual decisions become higher stakes; do not treat .70 as sufficient evidence by itself.

### Test–retest

Recontact at least 200 validation participants after approximately 2–3 weeks, with no expected intervention. Record major contextual changes. Report ICC with interval, mean change, and agreement. The interval must balance recall with likely construct stability.

### Convergent validity

With permission, compare preregistered corresponding constructs against suitable validated instruments (for example DEBQ/TFEQ variants, eating self-efficacy, automaticity, and body-image measures). State expected direction and magnitude ranges before analysis.

### Discriminant validity

Test against neighboring but distinct constructs and context:

- stress/distress versus emotional eating;
- appetite/hunger versus external cues;
- uncontrolled eating versus rigid restraint;
- body-image avoidance versus general social anxiety;
- implementation friction versus schedule/cost/injury facts.

Use latent correlations, model comparisons, and external measures; do not rely only on one threshold statistic.

### Criterion and predictive validity

Use appropriate non-diagnostic criteria:

- prospective eating-behavior diaries or ecological momentary assessment;
- adherence/resumption behavior under a defined, safe, optional plan;
- retention/implementation outcomes;
- change sensitivity only after a relevant intervention study.

Self-reported weight change may be secondary and cannot validate causal “barrier to weight loss” claims alone. Preregister follow-up length, outcome definitions, covariates, missing-data handling, and clinically/behaviorally meaningful effect interpretation.

### Interactions

Test main effects first. Interaction hypotheses require adequate powered product terms, incremental performance, calibration, robustness to scaling, multiplicity control, and independent replication. Keep `production_enabled=false` unless an interaction passes its own release review.

## Measurement invariance and fairness

Test configural, threshold, loading, and intercept/scalar invariance as appropriate for ordinal data across adequately represented, ethically justified groups such as age bands, sex/gender response groups, urban/rural residence, education/reading level, and relevant weight-history groups. Do not force analysis of small or unsafe-to-disclose groups.

Where full invariance fails, assess partial invariance, DIF, score comparability, and whether group-specific interpretation or non-reporting is safer. Review algorithmic and language fairness with lived-experience members.

## Norm development

Conduct a separate sampling study designed to represent the declared target population. Define coverage, sampling frame, inclusion, weighting, nonresponse adjustment, minimum cell sizes, uncertainty, and refresh schedule before collection.

Report weighted distributions and uncertainty. Prefer continuous reference information over arbitrary labels. Norm tables are version-bound and cannot be transferred across changed item/scoring versions without linking evidence.

## Ethics, consent, and safety

- Plain-language consent distinguishes research from paid service and says participation/nonparticipation will not affect access.
- Separate consent for baseline research, recontact, linkage, and future secondary use.
- Minimize collection of direct identifiers; store recontact keys separately.
- Provide withdrawal mechanics and data-retention dates.
- Use a clinician-approved urgent-safety protocol; never advertise the research survey as continuous monitoring.
- Avoid coercive payment/discount structures for vulnerable users.
- Publish adverse-event and distress escalation procedures.

## Research data separation

Commercial analytics may record operational events, not research consent. Research responses require a separate consent record, pseudonymous research ID, purpose limitation, restricted access, and retention policy. A one-way export should strip customer identifiers; the production application must not query research responses to personalize paid reports.

## Release gates

### Beta research report

May be used only with explicit research consent after content review, cognitive interviews, safety review, and initial EFA support. Every score and label is marked preliminary; no paid psychometric claim.

### Validated instrument release

Requires:

- independent CFA supports the declared structure;
- subscale reliability and test–retest meet preregistered criteria;
- convergent/discriminant evidence supports intended interpretations;
- no material unresolved fairness or rights issue;
- report copy and recommendations pass safety/claims review;
- scoring and report versions are reproducible;
- limitations and applicable population are public.

Criterion/predictive and norms claims require their own evidence even if structural validation passes.

## Version control and change policy

Maintain immutable instrument, item, scoring, report, norm, and interaction versions. Classify changes:

- editorial with demonstrated semantic equivalence;
- minor measurement change requiring bridging;
- major change requiring renewed validation.

Publish a change log, analysis code, preregistration references, deviations, and a model card/methods summary. Never pool materially changed versions without formal linking.
