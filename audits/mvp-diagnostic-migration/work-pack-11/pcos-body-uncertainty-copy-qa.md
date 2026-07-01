# Work Pack 11 PCOS / Body Uncertainty Copy QA

Focus fixture: `pcos_body_uncertainty_control`

Scope: docs-only owner QA of WP10 rendered copy snapshots. This does not change renderer code, runtime behavior, scoring, fixtures, report-object contract, production rendering, PDF, deploy, backend, payment, QPay, pricing, entitlement, or localStorage behavior.

## Overall fixture status

Status: `NEEDS COPY POLISH`

The rendered copy correctly preserves ordinary mode while adding a non-diagnostic bridge. It does not claim PCOS, hormones, medication, or glucose as a cause. The main risk is that some medical-context wording may be too broad or health-anxiety activating if rendered without polish.

## Section QA

### Ил харагдаж байгаа зүйл

Current rendered copy:

> Биеийн өөрчлөлт ойлгомжгүй санагдах үед хоол, жин, хэмжилт дээр хяналтаа буцааж авах оролдлого хүчтэй болж байна. Энэ нь биеэ буруутгах шалтгаан биш, тодорхойгүй байдалд барих нэг жижиг бариул хайж байгаа хэлбэр.

Status: `READY FOR COPY POLISH`

What works:

- Body-neutral language is mostly preserved.
- The copy explains control-seeking as a response to uncertainty, not as failure.
- It avoids saying the body is wrong or broken.

What is risky / awkward:

- "барих нэг жижиг бариул" is understandable but idiomatic quality is uneven.
- "жин, хэмжилт" could nudge self-monitoring if not later softened.
- "хүчтэй болж байна" is slightly absolute.

Suggested direction, not final production rewrite:

- Keep the uncertainty-to-control story.
- Smooth "барих нэг жижиг бариул" into more natural Mongolian such as "барьж авах нэг зүйл хайж байгаа".
- Keep body-neutral wording and avoid intensifying measurement.

Explicit evaluation:

- Body-neutral language: PASS with polish.
- AI-generic phrasing: LOW.
- Health anxiety risk: LOW in this section.

### Зөөлөн мэргэжлийн гүүр

Current rendered copy:

> Энэ нь онош биш. Хэрэв мөчлөг, эм, даавар, цусан дахь сахартай холбоотой асуулт таны толгойд давтагдаж байвал шалтгаан гэж дүгнэхээс өмнө мэргэжлийн хүнтэй тайван тодруулах хэрэгтэй байж магадгүй.

Status: `NEEDS COPY POLISH`

What works:

- `Энэ нь онош биш.` is explicit and should remain.
- `тодруулах хэрэгтэй байж магадгүй` is appropriately uncertain and non-diagnostic.
- No PCOS, hormone, medication, or glucose cause claim is made.
- The bridge does not suppress ordinary mode.

What is risky / awkward:

- The list "мөчлөг, эм, даавар, цусан дахь сахар" may be too broad and may increase health anxiety for some users.
- `цусан дахь сахар` is understandable and safer than "глюкозоос болсон", but it may still feel clinical.
- "таны толгойд давтагдаж байвал" is natural, but could be softened to avoid implying rumination.

Suggested direction, not final production rewrite:

- Keep "Энэ нь онош биш."
- Keep "тодруулах хэрэгтэй байж магадгүй."
- Consider narrowing or softening the medical examples: "биеийн дохио, мөчлөг, хэрэглэж буй эмтэй холбоотой санаа зовнил" instead of a long clinical list.
- Mention professional clarification only as a calm option, not an alarm.

Explicit evaluation:

- `Энэ нь онош биш.`: PASS.
- `тодруулах хэрэгтэй байж магадгүй`: PASS.
- No cause claim: PASS.
- Medical context too narrow/broad: MEDIUM risk, needs polish.
- `цусан дахь сахар` naturalness and safety: ACCEPTABLE but clinical; needs owner tone decision.
- Health anxiety risk: MEDIUM if the list is rendered broadly.

### Эхний зөөлөн өөрчлөлт

Current rendered copy:

> Биеэ батлахын тулд хоолоо чангалж хэмжихийн оронд 7 хоногийн турш нойр, өлсөх цаг, энерги, гэдэс цадах мэдрэмжээ биеийг шүүхгүйгээр тэмдэглэ. Зорилго нь буруутан олох биш, ямар нөхцөлд таны бие илүү тогтвортой санагдаж байгааг харах.

Status: `NEEDS COPY POLISH`

What works:

- The copy discourages tightening food rules and measuring for control.
- "биеийг шүүхгүйгээр" is an important body-neutral guardrail.
- It frames the change as observation rather than control.

What is risky / awkward:

- "нойр, өлсөх цаг, энерги, гэдэс цадах мэдрэмж" is a lot to track; it may feel like self-surveillance if not simplified.
- "гэдэс цадах мэдрэмж" is a little awkward; "цадсан мэдрэмж" may be more natural.
- "биеэ батлахын тулд" is conceptually apt but may sound abstract.

Suggested direction, not final production rewrite:

- Reduce the number of signals to observe or group them as "нойр, өлсөх, энергийн хэмнэл".
- Keep "биеийг шүүхгүйгээр".
- Avoid measurement-heavy phrasing.

Explicit evaluation:

- Body-neutral language: PASS with polish.
- Self-surveillance risk: MEDIUM.
- Treatment/advice risk: LOW; it reads as observation, not treatment.
- AI-generic phrasing: LOW to MEDIUM due to list density.

### 14 хоногийн туршилтын таамаг

Current rendered copy:

> Хэрэв хяналтаа буцааж авах оролдлогыг илүү зөөлөн ажиглалт руу шилжүүлбэл хоолны хатуу шийдвэр багасч, биеийн дохиог илүү тайван ялгах боломж нэмэгдэх эсэхийг шалгана. Мэргэжлийн тодруулга хэрэгтэй байж болох хэсгийг төлбөртэй тайлангаар хаахгүй.

Status: `READY FOR COPY POLISH`

What works:

- The 14-day observation does not sound like treatment.
- "зөөлөн ажиглалт" is directionally right.
- Safety/payment boundary is protected: medical clarification should not be hidden behind payment.

What is risky / awkward:

- "төлбөртэй тайлангаар хаахгүй" is important internally but may sound product-policy-like if user-facing.
- "биеийн дохиог илүү тайван ялгах" is good but a little abstract.

Suggested direction, not final production rewrite:

- Keep the non-treatment observation framing.
- For user-facing runtime, translate the payment-boundary idea into safety-first copy rather than product mechanics.
- Preserve the principle that professional clarification is unblocked.

Explicit evaluation:

- Observation, not treatment: PASS.
- No medical cause claim: PASS.
- Health anxiety risk: LOW.
- AI-generic phrasing: MEDIUM because of product-policy phrase.

### 7 хоногийн баталгаажуулах тэмдэглэл

Current rendered copy:

> Долоо хоногт нойр, энерги, өлсөх цаг, цадах мэдрэмж, биеийн тухгүй дохиог дүгнэлтгүй тэмдэглэ. Хэрэв нэг хэв шинж давтагдвал өөрөө оношлохын оронд тайван тодруулах асуулт болгон авч явна.

Status: `READY FOR COPY POLISH`

What works:

- The diary sounds more like gentle observation than judgment.
- "дүгнэлтгүй тэмдэглэ" is strong.
- "өөрөө оношлохын оронд" preserves the non-diagnostic boundary.

What is risky / awkward:

- The number of tracked items may still feel like self-surveillance.
- "биеийн тухгүй дохио" is slightly clinical and may need softer phrasing.

Suggested direction, not final production rewrite:

- Keep "дүгнэлтгүй" and "өөрөө оношлохын оронд".
- Consider fewer signals or a phrase like "давтагдаж байгаа биеийн дохио".
- Keep diary as pattern observation, not compliance.

Explicit evaluation:

- Gentle observation: PASS with polish.
- Self-surveillance risk: LOW to MEDIUM.
- Diagnosis anxiety risk: LOW because "өөрөө оношлохын оронд" is clear.
- AI-generic phrasing: LOW.

## Fixture-level decision

Recommended status: `NEEDS COPY POLISH`

Runtime integration remains HOLD. Production rendering remains HOLD. This fixture is structurally suitable for future test-only copy refinement, but the medical bridge and tracking language need careful owner copy review before any runtime planning.
