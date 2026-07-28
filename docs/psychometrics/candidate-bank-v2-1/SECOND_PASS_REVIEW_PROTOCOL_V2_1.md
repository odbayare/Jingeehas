# V2.1 blinded second-pass AI review protocol

> **AI-REVISED CANDIDATE ITEM BANK ONLY**
>
> **NOT HUMAN-REVIEWED**
>
> **NOT PSYCHOMETRICALLY VALIDATED**
>
> **NOT A CLINICAL OR PSYCHOLOGICAL DIAGNOSIS**
>
> **NOT READY FOR PRODUCTION PSYCHOMETRIC CLAIMS**

## Design

The changed candidates are reviewed by eight synthetic expert-role lenses in two fresh contexts each (16 runs) and 16 fresh synthetic target-user persona contexts. All runs use one GPT-5.6 model family across two runtime variants; this is not model-family diversity or human independence.

Expert inputs contain blinded item identifiers, candidate wording, primary construct/facet, recall frame, response mode, options, and sensitivity only. They omit original wording, first-panel disposition, revision status/rationale, first-panel output, and other second-pass output.

Persona inputs contain only the prompt-defined non-identifying persona, blinded identifier, wording, recall frame, response mode, and options. They omit construct, scoring direction, revision status, original wording, and all review results.

Major-rewrite alternatives occur in separate randomized expert blocks. Persona assignment is disjoint within every A/B source pair, so no persona context sees both alternatives.

Only brief structured observable rationales are requested. No hidden reasoning, human evidence, validation statistic, or diagnostic inference is requested or stored.
