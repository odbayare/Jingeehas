# Work Pack 5 Report Copy Readiness Map

| WP4 field | Future user-facing section | Current readiness | Required transformation | Risk |
| --- | --- | --- | --- | --- |
| `visibleCondition` | Ил харагдаж байгаа зүйл | Partial | Translate driver keys into concrete observed conditions in plain Mongolian. | If left as keys, the report feels technical and impersonal. |
| `secondaryDrivers` | Цаана нь ажиллаж байгаа зүйл | Partial | Explain secondary drivers as overlapping influences, not a label list. | A list of keys can make the user feel categorized rather than understood. |
| `vulnerableMoment` | Эмзэг мөч | Partial | Convert IDs into a short moment description with timing, context, and emotional/body state. | The most important report insight becomes opaque if it remains an ID. |
| `hiddenFoodFunction` | Хоолны далд үүрэг | Partial | Explain what food is doing for the user in humane language. | Sensitive functions such as shame escape or hunger safety can sound blaming if translated poorly. |
| `wrongSelfExplanation` | Буруу өөр тайлбар | Partial | Turn key values into a gentle correction of self-blame. | Harsh wording could reinforce shame instead of reducing it. |
| `firstGentleChange` | Эхний зөөлөн өөрчлөлт | Partial | Convert action IDs into specific, small, doable steps. | If too vague or too advice-like, it may feel like another diet instruction. |
| `fourteenDayExperiment` | 14 хоногийн туршилтын таамаг | Partial | Write a clear hypothesis, daily action, tracking signal, and recovery rule. | The experiment could sound prescriptive if the copy is not framed as a test. |
| `sevenDayDiaryConfirmation` | 7 хоногийн баталгаажуулах тэмдэглэл | Partial | Translate target driver keys into diary prompts or observation targets. | Raw keys would make diary confirmation unusable for real users. |
| `safetyBlock` | Аюулгүй байдлын чиглэл | Partial | Keep professional-first copy plain, non-alarming, and not blocked by payment. | Poor wording can sound diagnostic, fear-based, or like withheld support. |
| `evidenceExplanation` | Дотоод evidence layer, not primary user copy | Not ready for user-facing copy | Summarize only selected evidence in human terms; keep raw score/debug details internal. | Exposing score internals can reduce trust and create false precision. |
| `ownerReviewFlags` | Owner QA only | Not user-facing | Hide entirely from production report rendering. | If exposed, it would break the user experience and reveal implementation details. |

## Readiness summary

The report object is ready for owner QA, not for runtime copy. Every user-facing section needs a translation layer from stable keys to Mongolian explanatory copy before integration.
