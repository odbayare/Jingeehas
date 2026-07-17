# Report Mongolian Semantic Audit

Audit baseline: `794b08652776095e81a49f731b9a2cd262f24d63`
Scope: active questions and options, public report copy, recommendations, rendering, ten deterministic fixtures, tests, and generated production/staging packages.

## Rule

`Арга тасрах` means that no option or way forward remains. It is not a natural synonym for a diet, exercise program, routine, or weight-loss method stopping. Public copy now distinguishes an externally prevented continuation, an explicitly stopped method, an attempt that did not continue, a disrupted routine, a rigid plan that became difficult to sustain, and a busy day when the planned action does not fit.

## Active production questions

Occurrences before: **0**. Occurrences after: **0**. No question or option changed.

The following neutral questions remain exact:

- `Тэр оролдлого яагаад зогссон бэ?`
- `Аргаа зогсоосны дараа жин эргэн нэмэгдсэн үү?`
- `Аргаа тогтвортой үргэлжлүүлэхэд юу хамгийн их саад болдог вэ?`
- `Жингээ бууруулахын тулд өмнө туршсан нэг арга яагаад удаан үргэлжлээгүй вэ?`

## Context-sensitive public replacements

| Baseline occurrence | Baseline context | Replacement | Evidence rule |
| --- | --- | --- | --- |
| `Арга тасарсны дараа үр дүнгээ хадгалах төлөвлөгөө дутсан нь` | Public sustainability title | `Өмнөх аргын үр дүнг хадгалж үлдэх төлөвлөгөө дутсан нь` | Supported sustainability pattern; neutral about why continuation ended. |
| `арга тасарсны дараах төлөвлөгөө` | Pattern uncertainty | `өмнөх оролдлогын үр дүнг хадгалах төлөвлөгөө` | Supported sustainability pattern. |
| `Хэт хатуу арга тасрахад...` | Restrictive overview | `Хэт хатуу дэглэмийг үргэлжлүүлэхэд хэцүү болоход...` | Supported restrictive pattern. |
| `арга тасарсны дараа үр дүнгээ хадгалах...` | Overall picture | `гарсан үр дүнг өдөр тутам хадгалах...` | Supported sustainability pattern. |
| `Хатуу хязгаарлалттай арга тасарсны дараа...` | Restrictive evidence | `Хэт хатуу дүрмийг удаан барихад хэцүү болж...` | Supported restrictive pattern; no forced-stop claim. |
| `Завгүй өдөр үндсэн төлөвлөгөө тасрах...` | Schedule context | `Завгүй өдөр үндсэн төлөвлөгөөг хэрэгжүүлэх боломжгүй байж болох...` | Exact schedule-barrier signal. |
| `арга тасрах үед үр дүнгээ хадгалах...` | Previous-attempt interpretation | `өмнөх оролдлого үргэлжлэхээ болих үед үр дүнгээ хадгалах...` | Supported sustainability pattern. |
| `арга тасарсны дараах төлөвлөгөө` | Strength/strategy synthesis | `өмнөх оролдлого үргэлжлэхээ болих үед хэрэгжүүлэх хувилбар` | Sustainability pattern plus exact protective gates. |
| `Хөдөлгөөний хэмнэл тасарсан` | Interaction | `Хөдөлгөөний хэмнэл алдагдсан` | Movement-maintenance interaction gates. |
| `Өмнөх оролдлого яагаад тасарсан байж болох вэ?` | Section heading | `Өмнөх оролдлого яагаад үргэлжлээгүй байж болох вэ?` | Heading is neutral when the exact stop reason varies. |
| Baseline phrases retained in `REPORT_COPY_OWNER_REVIEW.md` | Superseded audit artifact | Not used in active copy; replacements are enumerated in this audit and the defect matrix. | The broken report remains preserved as required audit evidence. |

## Injury-specific wording

When the answer to the neutral stopping question explicitly attributes stopping to injury, template `previous_method_stopped_due_to_injury` requires `explicit_injury_stop_context` and says:

`Таны дурдсан гэмтлийн улмаас өмнөх хөдөлгөөнөө үргэлжлүүлэх боломжгүй болсон байна.`

The same forced-continuation wording is suppressed for a generic physical barrier, pain mention, practical barrier, voluntary stop, or unknown reason. The internal trace records the template, required context, and the supporting question ID. Public output does not expose that ID.

## Frozen internal occurrence

`netlify/functions/_lib/report-patterns.js` retains its baseline internal title because inference semantics are hard-frozen. It is never selected as the public title: `PATTERN_PUBLIC_TITLES` supplies the canonical wording. Generated public reports and packages contain zero prohibited public occurrences.

## Result

- Public prohibited occurrences: **0**.
- Active-question occurrences: **0** before and after.
- Blind replacement used: **No**.
- Inference mapping, weights, thresholds, categories, contradictions, interactions, priority, and safety routing changed: **No**.
