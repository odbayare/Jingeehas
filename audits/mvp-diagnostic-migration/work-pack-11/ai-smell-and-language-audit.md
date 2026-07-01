# Work Pack 11 AI Smell and Language Audit

Scope: docs-only owner QA of WP10 rendered Mongolian copy snapshots.

This audit checks both rendered copies for AI-generic phrasing, over-explanation, unnatural Mongolian, translated-English structure, abstract psychological wording, clinical tone, repeated phrases, weak user-facing rhythm, hidden generated-site tone, and too much explanation before value.

## AI smell table

| Fixture | Section | Issue type | Severity | Evidence | Suggested direction |
| --- | --- | --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | Ил харагдаж байгаа зүйл | Unnatural Mongolian / translated phrase | Medium | `аюулгүй хооллох дохио нэхэж байгаа хэлбэр` | Replace with a more everyday body-signal phrase; avoid "дохио нэхэх" if it feels too abstract. |
| `all_or_nothing_restriction_rebound` | Ил харагдаж байгаа зүйл | Abstract phrasing | Low | `удаан хорьсон хэмнэл` | Ground in a concrete moment: after a strict day, after skipping, at the next meal. |
| `all_or_nothing_restriction_rebound` | Цаана нь ажиллаж байгаа зүйл | Slightly heavy psychological wording | Low | `өөрийгөө шийтгэсэн төлөвөөс гаргах үүрэг авч байна` | Keep the idea but make it sound more spoken and less analytical. |
| `all_or_nothing_restriction_rebound` | Эхний зөөлөн өөрчлөлт | Diet-plan risk | High | `Нэг уурагтай, нэг нүүрс устай...` | Remove macro-like meal construction; use non-prescriptive reset language. |
| `all_or_nothing_restriction_rebound` | 14 хоногийн туршилтын таамаг | Strong word / possible fear tone | Medium | `оройн дайралт` | Consider softer phrasing such as difficult evening pull or strong evening hunger. |
| `all_or_nothing_restriction_rebound` | 7 хоногийн баталгаажуулах тэмдэглэл | Awkward phrase | Low | `хэр зөөлөн сэргээсэн эсэхээ` | Smooth into a natural phrase about continuing the next meal without punishment. |
| `pcos_body_uncertainty_control` | Ил харагдаж байгаа зүйл | Idiom issue | Medium | `барих нэг жижиг бариул` | Use simpler Mongolian for seeking something steady to hold onto. |
| `pcos_body_uncertainty_control` | Зөөлөн мэргэжлийн гүүр | Too clinical / anxiety risk | Medium | `мөчлөг, эм, даавар, цусан дахь сахар` | Narrow the list or frame examples as "if this is already a concern", not as suggested causes. |
| `pcos_body_uncertainty_control` | Зөөлөн мэргэжлийн гүүр | Medical wording naturalness | Low to Medium | `цусан дахь сахар` | Acceptable but clinical; decide whether "цусны сахарын үзүүлэлт" or a broader "биеийн үзүүлэлт" is safer. |
| `pcos_body_uncertainty_control` | Эхний зөөлөн өөрчлөлт | Self-surveillance risk | Medium | `нойр, өлсөх цаг, энерги, гэдэс цадах мэдрэмж` | Reduce the list or group signals to avoid making the user track too much. |
| `pcos_body_uncertainty_control` | Эхний зөөлөн өөрчлөлт | Awkward phrase | Low | `гэдэс цадах мэдрэмж` | Prefer a more natural phrase like fullness or satisfaction without body-judgment wording. |
| `pcos_body_uncertainty_control` | 14 хоногийн туршилтын таамаг | Product-policy smell | Medium | `төлбөртэй тайлангаар хаахгүй` | Convert to user-facing safety principle; do not expose product/payment mechanics in final copy. |
| `pcos_body_uncertainty_control` | 7 хоногийн баталгаажуулах тэмдэглэл | Clinical / surveillance risk | Low to Medium | `биеийн тухгүй дохио` plus five tracked items | Keep the non-diagnostic principle but simplify the diary target. |

## Cross-fixture findings

### AI-generic phrasing

Severity: Low to Medium.

The copy is more specific than generic AI wellness copy, but some phrases still sound architected: "хэлбэр", "үүрэг авч байна", "зөөлөн ажиллаж", and "төлбөртэй тайлангаар хаахгүй". These should be made more human before runtime planning.

### Over-explained sentences

Severity: Medium.

Several sentences try to carry visible pattern, hidden driver, and safety guardrail in one line. Future copy polish should split heavy sentences or choose one main emotional job per sentence.

### Unnatural Mongolian

Severity: Medium.

The most important unnatural phrases are:

- `аюулгүй хооллох дохио`
- `барих нэг жижиг бариул`
- `гэдэс цадах мэдрэмж`
- `хэр зөөлөн сэргээсэн эсэхээ`

### Translated-English structure

Severity: Low to Medium.

The section structure is useful, but some sentence endings feel like translated documentation. Future polish should use simpler Mongolian rhythm and fewer conceptual nouns.

### Abstract psychological wording

Severity: Medium.

The all-or-nothing copy uses abstract but helpful concepts: failure pressure, punishment, restart burden. These should remain, but expressed through moments and actions rather than explanatory labels.

### Too clinical wording

Severity: Medium for PCOS/body uncertainty.

The bridge is safe but could feel too medical if the list is too broad. It must stay non-diagnostic and should not make users worry about causes they did not mention.

### Repeated phrases

Severity: Low.

"ажиглалт", "тэмдэглэ", "дүгнэх", and "тодруулах" repeat because they are central to safety. Repetition is acceptable in test-only copy but should be smoothed in final copy.

### Weak user-facing rhythm

Severity: Medium.

The copy is clear but not yet fully alive. It needs a stronger spoken rhythm and fewer product-architecture phrases.

### Hidden generated-site tone

Severity: Medium.

Some lines sound like a product compliance layer rather than a human report, especially payment-boundary language. Keep the principle but rewrite for user-facing safety.

### Too much explanation before value

Severity: Low.

Most sections start with value quickly. The PCOS bridge may need to lead with reassurance before listing possible medical contexts.

## Overall language recommendation

Status: `NEEDS COPY POLISH`

Both renderings are strong enough for future test-only copy refinement. Neither should move toward runtime or production rendering until wording is made more natural, less clinical, less list-heavy, and less diet-plan-like.
