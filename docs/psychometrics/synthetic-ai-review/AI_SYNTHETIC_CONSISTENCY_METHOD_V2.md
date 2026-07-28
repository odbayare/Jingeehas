# Synthetic review consistency metrics V2

> **SYNTHETIC AI REVIEW ONLY**
>
> **NOT HUMAN EXPERT REVIEW**
>
> **NOT HUMAN COGNITIVE INTERVIEW DATA**
>
> **NOT PSYCHOMETRIC VALIDATION**
>
> **NOT SUITABLE FOR EFA, CFA, RELIABILITY, NORMS OR CUT-OFFS**
>
> **NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS**


## Scope

These are descriptive **SYNTHETIC REVIEW CONSISTENCY** measures among AI review runs. They are not human agreement, inter-rater reliability, content validity, or any psychometric property. Synthetic selected responses are not scored or analyzed as a sample.

## Operational definitions

- `exact_disposition_agreement_rate`: modal expert-role disposition count divided by 24. Ties use the more cautious disposition only for deterministic reporting.
- `construct_relevance_spread`: maximum minus minimum 1–4 construct-relevance rating.
- `maximum_rating_spread`: largest max-minus-min spread across the eight required 1–4 ratings.
- `role_disagreement_count`: expert-role runs outside the modal disposition.
- `persona_paraphrase_mismatch_count`: synthesis-adjudicator structured classification among six blinded persona exposures.
- mismatch/difficulty/flag rates: corresponding Boolean persona flags divided by six exposures.
- `reverse_item_confusion_proxy_rate`: response-option mismatch rate for source-marked reverse items; zero for non-reverse items. Because persona agents were blinded to reverse status, this is a conservative proxy, not proof of reverse-wording confusion.

The item-triage `expert_mean_relevance` is the arithmetic mean of 24 construct-relevance ratings. `overlap_flags` reports the count of expert-role runs with moderate/high adjacent-overlap risk plus the synthesis concern category.
