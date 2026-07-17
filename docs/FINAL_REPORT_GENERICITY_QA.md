# Final Report Genericity QA

Generated from the ten required fixtures on 2026-07-18. Similarity is Jaccard overlap across substantive user-facing sentences longer than 45 characters. Shared structure is excluded unless it forms a substantive sentence.

## Profiles

1. Preserved owner profile
2. Emotional-eating dominant
3. Environmental-cue dominant
4. Irregular meals and late hunger
5. Sleep/fatigue context
6. Satiety and portion difficulty
7. Restrictive attempt and regain
8. Plan–daily-life mismatch
9. Multiple simultaneous patterns
10. Mostly neutral / protective answers

## Pairwise similarity matrix

| Profile | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 1.000 | 0.051 | 0.042 | 0.037 | 0.013 | 0.042 | 0.042 | 0.066 | 0.033 | 0.014 |
| 2 | 0.051 | 1.000 | 0.121 | 0.098 | 0.027 | 0.121 | 0.121 | 0.103 | 0.143 | 0.028 |
| 3 | 0.042 | 0.121 | 1.000 | 0.188 | 0.033 | 0.250 | 0.250 | 0.200 | 0.140 | 0.034 |
| 4 | 0.037 | 0.098 | 0.188 | 1.000 | 0.026 | 0.310 | 0.188 | 0.158 | 0.541 | 0.027 |
| 5 | 0.013 | 0.027 | 0.033 | 0.026 | 1.000 | 0.033 | 0.033 | 0.028 | 0.042 | 0.348 |
| 6 | 0.042 | 0.121 | 0.250 | 0.310 | 0.033 | 1.000 | 0.250 | 0.200 | 0.225 | 0.034 |
| 7 | 0.042 | 0.121 | 0.250 | 0.188 | 0.033 | 0.250 | 1.000 | 0.200 | 0.140 | 0.034 |
| 8 | 0.066 | 0.103 | 0.200 | 0.158 | 0.028 | 0.200 | 0.200 | 1.000 | 0.122 | 0.029 |
| 9 | 0.033 | 0.143 | 0.140 | 0.541 | 0.042 | 0.225 | 0.140 | 0.122 | 1.000 | 0.021 |
| 10 | 0.014 | 0.028 | 0.034 | 0.027 | 0.348 | 0.034 | 0.034 | 0.029 | 0.021 | 1.000 |

## Result

- Highest cross-profile similarity: `0.541`, between the irregular-meals profile and the multi-pattern profile that intentionally contains that same pattern.
- Preserved owner profile similarity to every materially different profile: `0.066` or lower.
- Mostly-neutral profile similarity to every other profile: `0.348` or lower; the highest overlap is with the contextual-only sleep profile because both correctly use the seven-section neutral structure.
- Automated rejection threshold: `0.700`.
- All 45 pairwise comparisons: `PASS`.

High structural consistency remains, while personalized sentences differ according to the supported patterns and factual gates.
