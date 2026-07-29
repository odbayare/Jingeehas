# Jingeehas scientific decision register V2

> **DESIGN PHASE ONLY**
> **NOT YET PSYCHOMETRICALLY VALIDATED**
> **NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS**
> **NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS**

## Governance

Statuses: `open`, `evidence_collection`, `decision_ready`, `decided`, `reopened`. A decision owner coordinates evidence and documentation but cannot approve their own decision alone. Gates are cumulative; a desk-review recommendation is not a measurement decision.

| ID | Decision | Current hypothesis | Alternative | Evidence required | Decision owner | Decision gate | Current status |
|---|---|---|---|---|---|---|---|
| SD-001 | Is uncontrolled eating separate from emotional and external eating? | A distinct continuation/control factor exists, correlated with affect- and cue-trigger factors | One broader disinhibited-eating factor or hierarchical factor | Cognitive trigger-versus-control comprehension; EFA/ESEM; independent CFA alternatives; latent discriminant validity; event-level temporal data | Psychometric lead | Frozen CFA model before independent validation | open |
| SD-002 | Is implementation and maintenance friction one or two factors? | One factor is adequate for profile use | Separate initiation/setup and maintenance/resumption factors | Expert facet coverage; EFA/parallel analysis; factor correlations; independent CFA; prospective initiation and resumption criteria | Psychometric lead + behavioral science lead | Item reduction freeze | open |
| SD-003 | Does body-image avoidance belong in the core profile? | It is a distinct relevant core barrier with non-stigmatizing report value | Separate optional module, context module, or removal | Lived-experience/ethics review; distress/nonresponse; factor evidence; incremental validity; fairness; report comprehension and harm review | Ethics/safety lead + lived-experience panel | Before frozen pilot, reconfirmed at release gate | open |
| SD-004 | Should all constructs use a common 14-day period? | Use 14 days for all recent profile constructs with conditional stems | Trait-like automaticity or confidence uses general/no-period wording; body-image/plan items use longer period | Cognitive comparison; opportunity/missingness; category use; test–retest; factor method effects; prospective validity | Questionnaire-methods lead | Pilot form freeze | open |
| SD-005 | Should reverse-coded items remain? | Retain only clean favorable behaviors that add facet coverage | Remove mixed keying or model separate strengths | Cognitive reversal errors; response time; method-factor models; reliability/content coverage; social desirability | Psychometric lead + Mongolian language lead | Item reduction freeze | open |
| SD-006 | Does self-efficacy require a different scale? | Yes, use a 0–4 confidence scale | Rewrite as occurrence frequency or use agreement | Cognitive response process; category thresholds; factor/method effects; predictive validity | Questionnaire-methods lead | Pilot form freeze | evidence_collection |
| SD-007 | How many factors are preregistered? | Nine correlated primary factors | Fewer merged factors, split HS/RR/IM factors, higher-order model | Expert/cognitive evidence; development EFA/ESEM; Monte Carlo recoverability; interpretability | Independent statistical reviewer + psychometric lead | CFA preregistration before validation sample access | open |
| SD-008 | What outcomes support predictive validity? | Prospective event diaries plus predefined implementation/resumption behavior; weight change secondary | Retention/adherence only, or no predictive claim | Stakeholder/ethics review; feasible objective/EMA measures; missingness plan; temporal horizon; clinically safe interpretation | Research methods lead | Predictive-study preregistration | open |
| SD-009 | Which licensed comparators will be pursued? | A minimal set covering eating styles, self-efficacy, automaticity, and body-image | Use only public-domain/cleared measures or develop validity evidence without a given comparator | Written rights/translation terms; construct match; Mongolian availability; burden; conflicts; budget | Licensing owner + psychometric lead | Before ethics submission for comparator administration | open |
| SD-010 | Are cue reactivity and cognitive preoccupation one factor? | One correlated factor is practical but two facets may emerge | Separate external cue reactivity and food-thought interference | Item content review; EFA/ESEM; independent CFA; differential external criteria; food-noise rights review | Psychometric lead | CFA preregistration | open |
| SD-011 | Are hunger and satiety awareness one factor? | One barrier factor with hunger and satiety facets | Two correlated subscales; remove use/decision items | Cognitive distinction; EFA/ESEM; local-dependence analysis; external criteria | Psychometric lead + nutrition/medical reviewer | Item reduction freeze | open |
| SD-012 | Are rigidity and rebound one factor? | One restrictive-rebound factor reflects a linked cycle | Separate rule rigidity and post-deviation rebound; retain only one | Event-sequence interviews; EFA/ESEM; independent CFA; prospective deviation data | Behavioral science lead | CFA preregistration | open |
| SD-013 | How will opportunity/non-applicability be scored? | Treat no opportunity as missing, not zero; score under minimum-valid rules | Route items, model exposure, or use conditional stems that eliminate most NA | Cognitive interviews; NA distribution; simulation; bias/sensitivity analyses | Psychometric/statistical leads | Scoring-version freeze | open |
| SD-014 | Can top-two barriers/strengths be ranked without norms? | Within-person ranking is permissible with clear provisional confidence and tie rules | Show an unranked profile until measurement-error estimates exist | Score precision; rank stability bootstrap; user comprehension; harm review | Report model owner + psychometric lead | Beta report gate | open |
| SD-015 | What qualifies an interaction for production? | Independent replication plus incremental calibrated prediction is required | Never report interactions; report only main effects | Preregistered powered model; multiplicity control; independent sample; calibration; fairness; public-copy comprehension | Independent statistical reviewer | Separate interaction release gate after core validation | open |
| SD-016 | Does the instrument support one total score? | No total score is planned | Higher-order/general barrier score if strongly supported | Bifactor/higher-order models; omega hierarchical; incremental interpretability; fairness; stakeholder need | Psychometric lead + independent reviewer | Validation release gate | open |

## Decision record requirements

When a row becomes `decided`, append:

- decision date and approvers;
- exact dataset/sample role and version;
- preregistration reference;
- analysis/code checksum;
- qualitative evidence reference;
- alternatives rejected and why;
- affected item, scoring, report, and claim versions;
- conditions that would reopen the decision.

No decision may be changed directly in a published version; create an immutable successor and change-log entry.
