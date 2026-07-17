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
| 1 | 1.000 | 0.057 | 0.043 | 0.039 | 0.016 | 0.043 | 0.043 | 0.083 | 0.034 | 0.016 |
| 2 | 0.057 | 1.000 | 0.250 | 0.188 | 0.050 | 0.250 | 0.250 | 0.200 | 0.225 | 0.050 |
| 3 | 0.043 | 0.250 | 1.000 | 0.200 | 0.056 | 0.273 | 0.273 | 0.214 | 0.146 | 0.056 |
| 4 | 0.039 | 0.188 | 0.200 | 1.000 | 0.038 | 0.333 | 0.200 | 0.167 | 0.571 | 0.038 |
| 5 | 0.016 | 0.050 | 0.056 | 0.038 | 1.000 | 0.056 | 0.056 | 0.042 | 0.056 | 0.111 |
| 6 | 0.043 | 0.250 | 0.273 | 0.333 | 0.056 | 1.000 | 0.273 | 0.214 | 0.237 | 0.056 |
| 7 | 0.043 | 0.250 | 0.273 | 0.200 | 0.056 | 0.273 | 1.000 | 0.214 | 0.146 | 0.056 |
| 8 | 0.083 | 0.200 | 0.214 | 0.167 | 0.042 | 0.214 | 0.214 | 1.000 | 0.128 | 0.042 |
| 9 | 0.034 | 0.225 | 0.146 | 0.571 | 0.056 | 0.237 | 0.146 | 0.128 | 1.000 | 0.027 |
| 10 | 0.016 | 0.050 | 0.056 | 0.038 | 0.111 | 0.056 | 0.056 | 0.042 | 0.027 | 1.000 |

## Result

- Highest cross-profile similarity: `0.571`, between the irregular-meals profile and the multi-pattern profile that intentionally contains that same pattern.
- Preserved owner profile similarity to every materially different profile: `0.083` or lower.
- Mostly-neutral profile similarity to every other profile: `0.111` or lower.
- Automated rejection threshold: `0.700`.
- All 45 pairwise comparisons: `PASS`.

High structural consistency remains, while personalized sentences differ according to the supported patterns and factual gates.
