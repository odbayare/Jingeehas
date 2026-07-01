# Work Pack 11 Owner Review Pack

## Recommendation Enum

READY FOR OWNER REVIEW OF COPY QA

## Repository State

### git status --short

```text
?? audits/mvp-diagnostic-migration/work-pack-11/
?? audits/sprint-36-paid-depth-prototype/
```

### git diff --stat

```text
```

### Forbidden Runtime/Test Diff

Command: `git diff -- app.js index.html styles.css mockBackend.js package.json _redirects tests/run-all.js tests/driver-stack/copyDecisionRenderer.mjs tests/driver-stack/copyDecisionRenderer.test.js tests/driver-stack/exportCopyDecisionRenderings.mjs`

```text
```

## Validation Commands and Results

- `git diff --check`: passed
- Forbidden runtime/test diff check: no output; passed
- `rg "READY FOR COPY POLISH|NEEDS COPY POLISH|NEEDS STRUCTURE CHANGE|HOLD" audits/mvp-diagnostic-migration/work-pack-11/safety-and-claims-audit.md`: no matches; passed
- safety-and-claims-audit status enum check: PASS
- Confirmed no invalid safety status labels remain.
- No code/test/runtime commands were required because WP11C is docs-only and existing runtime/test files were not modified.

## Changed Files List

- `audits/mvp-diagnostic-migration/work-pack-11/owner-copy-qa-summary.md`
- `audits/mvp-diagnostic-migration/work-pack-11/all-or-nothing-copy-qa.md`
- `audits/mvp-diagnostic-migration/work-pack-11/pcos-body-uncertainty-copy-qa.md`
- `audits/mvp-diagnostic-migration/work-pack-11/ai-smell-and-language-audit.md`
- `audits/mvp-diagnostic-migration/work-pack-11/safety-and-claims-audit.md`
- `audits/mvp-diagnostic-migration/work-pack-11/copy-approval-gate.md`
- `audits/mvp-diagnostic-migration/work-pack-11/future-copy-polish-backlog.md`
- `audits/mvp-diagnostic-migration/work-pack-11/work-pack-11-recommendation.md`
- `audits/mvp-diagnostic-migration/work-pack-11/OWNER_REVIEW_PACK_WP11.md`

## Explicit Confirmations

- No runtime changes.
- No app.js changes.
- No scoring or fixture changes.
- No WP4 report object contract changes.
- No WP10 renderer code changes.
- No existing tests changed.
- No production report rendering changes.
- No PDF generated.
- No deploy.
- QPay/backend/payment/pricing/entitlement unchanged.
- Unrelated `audits/sprint-36-paid-depth-prototype/` remains untracked and untouched.

---

## Full Content: owner-copy-qa-summary.md

# Work Pack 11 Owner Copy QA Summary

## WP11 purpose

WP11 is a docs-only owner QA review of the WP10 test-only Mongolian copy rendering snapshots. It reviews whether the two sensitive fixture renderings are ready for future test-only copy refinement, what needs polish, what remains structurally risky, and what must remain blocked before any runtime integration planning.

WP11 does not modify renderer code, runtime behavior, scoring, fixtures, WP4 report object contract, production rendering, PDF, deploy, backend, payment, QPay, pricing, entitlement, or localStorage behavior.

## Source artifacts reviewed

- `audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-markdown-snapshots.md`
- `audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-results.json`
- `audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-notes.md`
- `audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-test-coverage.md`
- `audits/mvp-diagnostic-migration/work-pack-10/work-pack-10-recommendation.md`
- `audits/mvp-diagnostic-migration/work-pack-6/copy-architecture-principles.md`
- `audits/mvp-diagnostic-migration/work-pack-6/professional-first-copy-rules.md`
- `audits/mvp-diagnostic-migration/work-pack-7/all-or-nothing-structure-decision.md`
- `audits/mvp-diagnostic-migration/work-pack-7/pcos-body-uncertainty-structure-decision.md`
- `audits/mvp-diagnostic-migration/work-pack-8/runtime-gate-checklist.md`

## Overall recommendation

Overall status: `NEEDS COPY POLISH`

Both WP10 renderings are useful enough to continue into future test-only copy refinement. Neither is production-ready. Neither should be used for runtime integration yet.

The renderer proved that the sensitive metadata can be rendered without internal key leakage, but owner-level copy QA finds several user-facing language issues:

- some phrasing sounds translated or product-architectural
- some tracking copy risks becoming self-surveillance
- one food example risks sounding like diet instruction
- one medical-context bridge may be too broad and may increase health anxiety if left unpolished

Runtime integration remains HOLD.

Production rendering remains HOLD.

## Fixture-level status table

| Fixture | Overall status | Reason | Runtime integration |
| --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | `NEEDS COPY POLISH` | Strong narrative stack, but meal-composition wording and body-protection phrasing need polish. | HOLD |
| `pcos_body_uncertainty_control` | `NEEDS COPY POLISH` | Non-diagnostic bridge works, but medical example list and tracking language need careful softening. | HOLD |

## Section-level status table

| Fixture | Section | Status | Main reason |
| --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | Ил харагдаж байгаа зүйл | `NEEDS COPY POLISH` | `аюулгүй хооллох дохио` is conceptually correct but not fully natural Mongolian. |
| `all_or_nothing_restriction_rebound` | Цаана нь ажиллаж байгаа зүйл | `READY FOR COPY POLISH` | Strongest section; captures hunger plus failure/restart relief. |
| `all_or_nothing_restriction_rebound` | Эхний зөөлөн өөрчлөлт | `NEEDS COPY POLISH` | `Нэг уурагтай, нэг нүүрс устай...` risks sounding like diet-plan instruction. |
| `all_or_nothing_restriction_rebound` | 14 хоногийн туршилтын таамаг | `READY FOR COPY POLISH` | Observation framing works; "оройн дайралт" may need softening. |
| `all_or_nothing_restriction_rebound` | 7 хоногийн баталгаажуулах тэмдэглэл | `READY FOR COPY POLISH` | Diary is observation-not-judgment; minor rhythm polish needed. |
| `pcos_body_uncertainty_control` | Ил харагдаж байгаа зүйл | `READY FOR COPY POLISH` | Body-neutral uncertainty/control story works; some idiom polish needed. |
| `pcos_body_uncertainty_control` | Зөөлөн мэргэжлийн гүүр | `NEEDS COPY POLISH` | Non-diagnostic, but medical example list may be too broad or anxiety activating. |
| `pcos_body_uncertainty_control` | Эхний зөөлөн өөрчлөлт | `NEEDS COPY POLISH` | Too many tracking items may feel like self-surveillance. |
| `pcos_body_uncertainty_control` | 14 хоногийн туршилтын таамаг | `READY FOR COPY POLISH` | Observation framing works; product-policy wording should become user-safe copy. |
| `pcos_body_uncertainty_control` | 7 хоногийн баталгаажуулах тэмдэглэл | `READY FOR COPY POLISH` | Gentle observation works; simplify tracked signals. |

## Main issues found

1. `Нэг уурагтай, нэг нүүрс устай...` risks sounding like a diet plan.
2. `аюулгүй хооллох дохио` is not fully natural user-facing Mongolian.
3. PCOS/body uncertainty bridge mentions a broad medical list; this may increase health anxiety.
4. Several tracking sections list too many observation points, which could feel like self-surveillance.
5. Some phrases sound architected rather than spoken: "хэлбэр", "үүрэг авч байна", "төлбөртэй тайлангаар хаахгүй".
6. Safety and claims audit found no direct diagnosis/treatment claims, but medical-cause implication and diet-command risks still need copy polish.

## Main strengths found

1. Both renderings avoid internal keys in user-facing snapshot copy.
2. Both renderings keep runtime rendering disabled.
3. All-or-nothing copy clearly includes both body protection and restriction/rebound relief.
4. PCOS/body uncertainty copy clearly says `Энэ нь онош биш.`
5. Both 14-day experiment sections are framed as observation/test rather than command.
6. Both 7-day diary sections are framed as observation rather than judgment.
7. Neither fixture uses explicit shame, discipline-failure, diagnosis, treatment, or medical-cause claims.

## Runtime integration status

Runtime integration remains `HOLD`.

Reasons:

- WP11 is docs-only QA.
- Copy is not production-approved.
- Several sections need copy polish before future runtime planning.
- The runtime gate checklist still requires owner approval, no internal leakage, non-diagnostic bridge approval, non-shaming rebound narrative approval, and regression QA.

## Production rendering status

Production rendering remains `HOLD`.

The WP10 renderings are owner-review drafts. They should not be treated as final report copy, PDF copy, or production report rendering.


---

## Full Content: all-or-nothing-copy-qa.md

# Work Pack 11 All-or-Nothing Copy QA

Focus fixture: `all_or_nothing_restriction_rebound`

Scope: docs-only owner QA of WP10 rendered copy snapshots. This does not change renderer code, runtime behavior, scoring, fixtures, report-object contract, production rendering, PDF, deploy, backend, payment, QPay, pricing, entitlement, or localStorage behavior.

## Overall fixture status

Status: `NEEDS COPY POLISH`

The rendered copy is directionally strong and preserves the WP7 Option B decision: keep the hunger/body protection meaning while adding a restriction/rebound relief and restart-pressure narrative. It is not production-ready. The main issues are phrasing polish, a few slightly technical or translated-feeling expressions, and one concrete food example that may sound too diet-plan-like.

## Section QA

### Ил харагдаж байгаа зүйл

Current rendered copy:

> Хэт чанга барьсны дараа орой эсвэл дараагийн хоолон дээр бие илүү хурдан хамгаалалт хайж байна. Энэ нь зангийн алдаа биш, удаан хорьсон хэмнэл аюулгүй хооллох дохио нэхэж байгаа хэлбэр.

Status: `NEEDS COPY POLISH`

What works:

- Non-shaming language is mostly preserved. "зангийн алдаа биш" directly protects against discipline-failure framing.
- Hunger/body protection explanation is present: the body is seeking protection after being held too tightly.
- The visible moment is concrete enough: evening or the next meal after over-restriction.

What is risky / awkward:

- `аюулгүй хооллох дохио` is conceptually useful but not fully natural Mongolian. It sounds like translated product language rather than something a user would say.
- "удаан хорьсон хэмнэл" is understandable, but slightly abstract.
- "бие хамгаалалт хайж байна" is warm enough, though it may need a more everyday phrasing before user-facing runtime.

Suggested direction, not final production rewrite:

- Keep the non-shaming body-protection idea.
- Replace `аюулгүй хооллох дохио` with a more natural phrase around "бие дараагийн хоол найдвартай ирэхийг шаардаж байгаа" or "өлсөлтөө тайван нөхөх хэрэгцээ".
- Make the first sentence less abstract and more user-moment based.

Explicit evaluation:

- Non-shaming language: PASS with polish needed.
- Hunger/body protection explanation: PASS.
- `аюулгүй хооллох дохио` naturalness: NEEDS COPY POLISH.
- AI-generic phrasing: LOW, but "хэлбэр" ending has mild generated-copy feel.

### Цаана нь ажиллаж байгаа зүйл

Current rendered copy:

> Энд зөвхөн өлсөлт биш, “аль хэдийн алдсан” гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Дахин эхлэх дарамт ихсэхээр хоол түр тайвшруулах, өөрийгөө шийтгэсэн төлөвөөс гаргах үүрэг авч байна.

Status: `READY FOR COPY POLISH`

What works:

- Restriction/rebound relief explanation is clear.
- Restart-pressure explanation is present and emotionally accurate.
- The copy does not blame the user. It explains that food may be serving relief from failure pressure.
- This is the strongest "намайг ойлгож байна" section in the fixture.

What is risky / awkward:

- "өөрийгөө шийтгэсэн төлөвөөс гаргах үүрэг авч байна" is understandable, but a little heavy and conceptual.
- The sentence is long and could be softened for rhythm.

Suggested direction, not final production rewrite:

- Keep "Энд зөвхөн өлсөлт биш..." because it is the key WP8/WP9 decision.
- Make the second sentence more human and less abstract, while preserving relief/restart-pressure meaning.

Explicit evaluation:

- Restriction/rebound relief explanation: PASS.
- Restart-pressure explanation: PASS.
- Non-shaming language: PASS.
- AI-generic phrasing: LOW.

### Эхний зөөлөн өөрчлөлт

Current rendered copy:

> Маргаашийг хүлээж өөрийгөө дахин чангалах биш, дараагийн хоолыг энгийн сэргээх цэг болго. Нэг уурагтай, нэг нүүрс устай, нэг тайван сууж идэх завсартай хоол сонгоод тэр өдрийг дахин шийтгэхгүйгээр үргэлжлүүл.

Status: `NEEDS COPY POLISH`

What works:

- The next-meal reset is clear.
- It avoids "tomorrow stricter" logic and reduces punishment framing.
- "шийтгэхгүйгээр үргэлжлүүл" is strong and humane.

What is risky / awkward:

- `Нэг уурагтай, нэг нүүрс устай...` risks sounding too prescriptive or diet-plan-like. It may make the product feel like meal-planning advice, which the product explicitly is not.
- "хоол сонго" is okay, but paired with macro-like language it becomes too nutrition-instructional.
- The section should emphasize gentleness and continuity more than meal composition.

Suggested direction, not final production rewrite:

- Replace macro-like wording with a less diet-plan frame: "өлсөлтөө тайван дарах энгийн хоол", "сууж идэх завсар", or "дараагийн хоолыг алгасахгүй, шийтгэлгүй эхлүүлэх".
- Keep "маргаашийг хүлээх биш" and "шийтгэхгүйгээр үргэлжлүүл".

Explicit evaluation:

- Non-shaming language: PASS.
- Diet instruction risk: MEDIUM because of `Нэг уурагтай, нэг нүүрс устай...`.
- AI-generic phrasing: LOW.
- Needs structure change: NO, copy polish should be enough.

### 14 хоногийн туршилтын таамаг

Current rendered copy:

> Хэрэв дараагийн хоолыг шийтгэл биш сэргээх цэг болгож үзвэл оройн дайралт багасч, долоо хоногийн эхэнд бүхнийг дахин эхлүүлэх дарамт сулрах эсэхийг ажиглана. Энэ бол тушаал биш, таны биед аль нь зөөлөн ажиллаж байгааг шалгах жижиг туршилт.

Status: `READY FOR COPY POLISH`

What works:

- The 14-day experiment clearly sounds like observation, not command.
- "Энэ бол тушаал биш" directly enforces the WP6 copy rule.
- Restart-pressure reduction is connected to the experiment hypothesis.

What is risky / awkward:

- "оройн дайралт" may feel too strong or a little alarmist. It could be softened to "оройн хүчтэй таталт" or "оройн хэцүү мөч".
- "таны биед аль нь зөөлөн ажиллаж" is warm but slightly generic.

Suggested direction, not final production rewrite:

- Keep the experiment-as-test framing.
- Soften "дайралт" if owner wants a less intense tone.
- Keep the hypothesis tied to next-meal reset and restart pressure.

Explicit evaluation:

- Observation, not command: PASS.
- Non-shaming language: PASS.
- AI-generic phrasing: LOW to MEDIUM because of "аль нь зөөлөн ажиллаж" cadence.

### 7 хоногийн баталгаажуулах тэмдэглэл

Current rendered copy:

> Долоо хоногт оройн өлсөлт, хоолоо хорьсон цаг, дараагийн хоолыг хэр зөөлөн сэргээсэн эсэхээ л тэмдэглэ. Тэмдэглэл нь өөрийгөө шүүхэд биш, аль мөчид дахин эхлэх дарамт нэмэгдэж байгааг харахад зориулагдана.

Status: `READY FOR COPY POLISH`

What works:

- The diary sounds like observation, not judgment.
- "өөрийгөө шүүхэд биш" is exactly the right guardrail.
- It tracks restriction and restart-pressure signals, not weight or compliance.

What is risky / awkward:

- "хэр зөөлөн сэргээсэн эсэхээ" is a little clunky.
- "тэмдэглэ" is direct but not overly commanding.

Suggested direction, not final production rewrite:

- Keep the diary target set: evening hunger, restriction timing, next-meal reset, restart pressure.
- Smooth the phrase around "дараагийн хоолоо шийтгэлгүй үргэлжлүүлж чадсан эсэх".

Explicit evaluation:

- Observation, not judgment: PASS.
- Non-shaming language: PASS.
- AI-generic phrasing: LOW.

## Fixture-level decision

Recommended status: `NEEDS COPY POLISH`

Runtime integration remains HOLD. Production rendering remains HOLD. The structure is now usable for future test-only copy refinement, but not ready for runtime or production copy without polishing the meal-composition line and making body-protection phrasing more natural.


---

## Full Content: pcos-body-uncertainty-copy-qa.md

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


---

## Full Content: ai-smell-and-language-audit.md

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


---

## Full Content: safety-and-claims-audit.md

# Work Pack 11 Safety and Claims Audit

Scope: docs-only owner QA of the WP10 test-only rendered Mongolian copy snapshots.

This audit checks whether the two sensitive rendered copies preserve the WP6/WP8 safety rules before any future test-only copy refinement. It does not approve runtime integration, production rendering, PDF generation, scoring changes, fixture changes, payment changes, QPay changes, backend changes, or deploy work.

## Overall status

Safety audit status: `WATCH`

No rendered section currently makes a direct diagnosis, treatment claim, medical-cause claim, or explicit blame statement. The main remaining risks are softer copy risks:

- all-or-nothing copy includes one meal-composition line that can feel diet-instructional
- PCOS/body uncertainty copy includes broad medical examples that can feel health-anxiety activating
- both fixture diaries need to stay observation-based rather than becoming compliance tracking
- payment/safety boundary language should be translated into user-facing safety copy before runtime use

Runtime integration remains blocked.

Production rendering remains blocked.

## Safety and claims table

| Fixture | Risk | Status | Evidence | Required guardrail |
| --- | --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | Shame language | PASS | `Энэ нь зангийн алдаа биш` and `өөрийгөө шүүхэд биш` actively reduce shame. | Keep direct shame-interruption language; avoid "weak", "failed", "discipline", or "willpower" framing. |
| `all_or_nothing_restriction_rebound` | Blame language | PASS | Copy frames rebound as body protection and restart pressure, not personal failure. | Keep cause language layered and non-accusatory; never say the user caused the problem by being irresponsible. |
| `all_or_nothing_restriction_rebound` | Diet-command language | WATCH | `Нэг уурагтай, нэг нүүрс устай...` may sound like a meal rule. | Replace macro-like wording with a gentler next-meal reset; avoid meal formulas, strict portions, and nutrition prescriptions. |
| `all_or_nothing_restriction_rebound` | Calorie/prescription feel | WATCH | No calories appear, but the protein/carbohydrate line has prescription feel. | Do not introduce calories, portion targets, macro targets, fasting windows, or strict food categories. |
| `all_or_nothing_restriction_rebound` | Diagnosis claim | PASS | No diagnosis or disease explanation appears. | Keep ordinary behavior language; do not attach medical labels to restriction/rebound. |
| `all_or_nothing_restriction_rebound` | Treatment advice | PASS | The 14-day frame says `Энэ бол тушаал биш` and positions the change as a small experiment. | Keep experiments framed as optional observation, not treatment or therapy. |
| `all_or_nothing_restriction_rebound` | Medical-cause implication | PASS | No hormone, medication, glucose, or medical cause is implied. | Do not add medical explanations for this fixture unless a future safety route requires it. |
| `all_or_nothing_restriction_rebound` | Professional-first boundary | PASS | This fixture is ordinary mode and does not trigger professional-first copy. | Keep professional-first separate; do not overload ordinary rebound copy with medical routing. |
| `all_or_nothing_restriction_rebound` | Payment-blocking safety risk | PASS | No safety warning is hidden or monetized in the rendered copy. | If safety language is ever needed, it must stay unblocked and outside paid-report gating. |
| `all_or_nothing_restriction_rebound` | Diary-as-judgment risk | WATCH | `Тэмдэглэл нь өөрийгөө шүүхэд биш...` is clear, but `тэмдэглэ` is still direct. | Keep diary as pattern observation; avoid scoring, compliance, success/failure, or weight-loss judgment. |
| `all_or_nothing_restriction_rebound` | Experiment-as-command risk | PASS | `Энэ бол тушаал биш... жижиг туршилт` directly prevents command framing. | Preserve test language; avoid "must", "have to", or strict challenge framing. |
| `pcos_body_uncertainty_control` | Shame language | PASS | `биеэ буруутгах шалтгаан биш` and `биеийг шүүхгүйгээр` protect against shame. | Keep body-neutral reassurance; avoid body-blame, control-failure, or moral language. |
| `pcos_body_uncertainty_control` | Blame language | PASS | Copy frames control-seeking as a response to uncertainty, not user failure. | Preserve uncertainty framing; do not imply the user is overreacting or causing the issue. |
| `pcos_body_uncertainty_control` | Diet-command language | WATCH | The copy discourages tightening food rules, but repeated tracking items may feel behaviorally heavy. | Keep food-rule softening; avoid telling the user to restrict, cut, compensate, or prove control through eating. |
| `pcos_body_uncertainty_control` | Calorie/prescription feel | PASS | No calories, macros, portions, or food prescriptions appear. | Maintain non-diet framing; do not add calorie, macro, supplement, or meal-plan instructions. |
| `pcos_body_uncertainty_control` | Diagnosis claim | PASS | `Энэ нь онош биш.` is explicit. | Keep the exact non-diagnostic boundary or an equally clear equivalent in future copy. |
| `pcos_body_uncertainty_control` | Treatment advice | PASS | The copy recommends observation and professional clarification, not treatment. | Do not describe the 14-day experiment as medical treatment, therapy, medication guidance, or disease management. |
| `pcos_body_uncertainty_control` | Medical-cause implication | WATCH | `мөчлөг, эм, даавар, цусан дахь сахар` is not a cause claim, but the list could suggest causes by proximity. | Reframe as "if these are already concerns" and avoid implying PCOS, hormones, medication, or glucose caused weight difficulty. |
| `pcos_body_uncertainty_control` | Professional-first boundary | PASS | `мэргэжлийн хүнтэй тайван тодруулах хэрэгтэй байж магадгүй` keeps a calm bridge without forcing mode3. | Keep professional clarification calm, optional, and unblocked; do not make ordinary mode sound like emergency routing. |
| `pcos_body_uncertainty_control` | Payment-blocking safety risk | WATCH | `төлбөртэй тайлангаар хаахгүй` protects safety but exposes product/payment mechanics. | Preserve the principle but rewrite as user-facing safety: professional clarification should be available regardless of report/payment state. |
| `pcos_body_uncertainty_control` | Diary-as-judgment risk | WATCH | `дүгнэлтгүй тэмдэглэ` and `өөрөө оношлохын оронд` are strong, but the tracked list is long. | Reduce tracking burden; keep diary as gentle pattern observation, not self-surveillance or compliance. |
| `pcos_body_uncertainty_control` | Experiment-as-command risk | PASS | `шалгана` and `ажиглалт` frame the experiment as observation rather than a command. | Keep experiment language optional and observational; avoid treatment or medical-correction tone. |

## Claims audit notes

### Diagnosis claims

No WP10 rendered section states or implies a diagnosis as fact. The PCOS/body uncertainty bridge explicitly says `Энэ нь онош биш.`

Future copy must keep this boundary visible and early in the section.

### Treatment advice

No WP10 rendered section tells the user to treat a condition, change medication, manage hormones, manage glucose, or follow a medical protocol.

Future copy must preserve the difference between:

- a gentle observation experiment
- a professional clarification prompt
- actual medical advice, which this product must not provide

### Medical-cause implications

The PCOS/body uncertainty bridge is directionally safe, but the phrase `мөчлөг, эм, даавар, цусан дахь сахар` is close enough to medical-cause territory that it needs polish before runtime planning.

The safest direction is to frame these as concerns the user may already have, not as causes the product detected.

### Diet-command risk

The strongest diet-command risk is in the all-or-nothing first gentle change:

> Нэг уурагтай, нэг нүүрс устай, нэг тайван сууж идэх завсартай хоол сонгоод...

This should not move toward production without rewrite. The future version should focus on a non-punitive next meal, not meal composition.

### Diary and experiment framing

Both fixture copies mostly preserve observation framing. The all-or-nothing fixture explicitly says the experiment is not a command. The PCOS/body uncertainty fixture says the diary should be written without conclusion or self-diagnosis.

Future polish should reduce item density so the diary does not become self-surveillance.

## Guardrails before runtime planning

- Keep runtime integration blocked.
- Keep production rendering blocked.
- Rewrite any macro-like or meal-plan-like language.
- Rewrite payment-boundary language into user-facing safety language.
- Keep `Энэ нь онош биш.` or an equally clear non-diagnostic statement.
- Keep medical examples as user concerns, not product-detected causes.
- Keep all experiments as tests/observations, not commands.
- Keep all diaries as pattern observation, not judgment.


---

## Full Content: copy-approval-gate.md

# Work Pack 11 Copy Approval Gate

Scope: docs-only gate definition for future copy polish and runtime planning.

WP11 does not approve runtime integration, production report rendering, PDF generation, deploy work, scoring changes, fixture changes, renderer changes, backend work, payment work, QPay work, pricing changes, entitlement changes, or localStorage changes.

## Current gate status

Status: `HOLD`

Reason: WP11 found that the WP10 rendered snapshots are directionally useful but still need copy polish before any future runtime integration planning.

## Required gates before future runtime integration planning

| Gate | Current status | Required evidence before passing |
| --- | --- | --- |
| Owner approves copy direction | HOLD | Owner explicitly approves the copy direction for both sensitive fixtures after WP11 review. |
| All `NEEDS STRUCTURE CHANGE` sections resolved | READY FOR COPY POLISH | WP11 did not identify a current structure-change blocker, but this gate must remain checked in future reviews. |
| All `HOLD` sections resolved | HOLD | Runtime integration itself remains HOLD; no section or fixture can move to runtime while the overall gate is HOLD. |
| Internal key leak remains blocked | READY FOR COPY POLISH | Future copy snapshots and tests must continue to show no internal keys in user-facing text. |
| Shame/blame language blocked | READY FOR COPY POLISH | Future copy must preserve non-shaming language and avoid discipline-failure framing. |
| Medical-cause claims blocked | NEEDS COPY POLISH | PCOS/body uncertainty copy must soften the medical-context list so it cannot imply hormones, medication, glucose, or PCOS caused the result. |
| Diagnosis/treatment advice blocked | READY FOR COPY POLISH | Future copy must keep `Энэ нь онош биш.` or an equally clear non-diagnostic boundary and avoid treatment advice. |
| 14-day experiment remains observation | READY FOR COPY POLISH | Future copy must keep experiment language as a test/observation, not a command or treatment. |
| 7-day diary remains observation | READY FOR COPY POLISH | Future copy must keep diary language as pattern observation, not compliance tracking or self-judgment. |
| Professional-first copy remains separate | READY FOR COPY POLISH | Soft medical-context bridge must not hijack professional-first routing or ordinary mode. |
| Safety guidance not blocked by payment | NEEDS COPY POLISH | The principle is preserved, but `төлбөртэй тайлангаар хаахгүй` must become user-facing safety language before runtime. |
| Production report rendering still requires separate approval | HOLD | Owner must separately approve production report copy and rendering. |
| PDF still requires separate approval | HOLD | PDF copy/layout generation remains out of scope and must be separately approved. |
| Deploy still requires separate approval | HOLD | No deploy is allowed from WP11; future deploy requires explicit approval and regression QA. |

## Non-negotiable copy blockers

Future runtime planning must stop if any of these appear:

- internal driver keys in user-facing copy
- shame, blame, or discipline-failure language
- diet-command language or macro/portion prescriptions
- medical-cause claims about PCOS, hormones, medication, glucose, or body conditions
- diagnosis or treatment advice
- professional-first guidance hidden behind payment
- 14-day experiment framed as a command
- 7-day diary framed as judgment or compliance

## Gate recommendation

Recommended next status: `NEEDS COPY POLISH`

The next work pack should polish the two sensitive fixture renderings as test-only copy drafts, then regenerate review snapshots before any runtime integration discussion.


---

## Full Content: future-copy-polish-backlog.md

# Work Pack 11 Future Copy Polish Backlog

Scope: docs-only backlog for future test-only copy polish.

This backlog does not approve runtime integration, production rendering, PDF generation, deploy, scoring changes, fixture changes, renderer changes, backend work, payment work, QPay work, pricing changes, entitlement changes, or localStorage changes.

## Backlog table

| Priority | Fixture | Section | Problem | Proposed direction | Owner decision needed? |
| --- | --- | --- | --- | --- | --- |
| P0 | `all_or_nothing_restriction_rebound` | Эхний зөөлөн өөрчлөлт | `Нэг уурагтай, нэг нүүрс устай...` risks sounding like diet instruction or macro prescription. | Replace with next-meal reset language that avoids meal formulas and emphasizes not punishing the next meal. | Yes |
| P0 | `pcos_body_uncertainty_control` | Зөөлөн мэргэжлийн гүүр | `мөчлөг, эм, даавар, цусан дахь сахар` may imply medical causes by proximity. | Reframe as concerns the user may already have, not causes detected by the product. | Yes |
| P0 | `pcos_body_uncertainty_control` | 14 хоногийн туршилтын таамаг | `төлбөртэй тайлангаар хаахгүй` exposes product/payment mechanics. | Convert to user-facing safety language that professional clarification is not delayed or gated. | Yes |
| P1 | `all_or_nothing_restriction_rebound` | Ил харагдаж байгаа зүйл | `аюулгүй хооллох дохио` sounds translated and not fully natural. | Use more everyday body-signal language about the body needing reliable nourishment after restriction. | Yes |
| P1 | `all_or_nothing_restriction_rebound` | 14 хоногийн туршилтын таамаг | `оройн дайралт` may sound too intense. | Soften to a phrase like strong evening pull, difficult evening moment, or evening hunger pressure. | Yes |
| P1 | `pcos_body_uncertainty_control` | Эхний зөөлөн өөрчлөлт | The tracking list is long and may feel like self-surveillance. | Group signals into fewer categories such as sleep, hunger, energy, and repeated body cues. | Yes |
| P1 | `pcos_body_uncertainty_control` | 7 хоногийн баталгаажуулах тэмдэглэл | Diary asks for many signals and could become too monitoring-heavy. | Keep `дүгнэлтгүй` but reduce list density and emphasize calm pattern noticing. | Yes |
| P2 | `all_or_nothing_restriction_rebound` | Цаана нь ажиллаж байгаа зүйл | `үүрэг авч байна` is conceptually clear but slightly architectural. | Make the line more spoken while preserving relief from failure/restart pressure. | No |
| P2 | `all_or_nothing_restriction_rebound` | 7 хоногийн баталгаажуулах тэмдэглэл | `хэр зөөлөн сэргээсэн эсэхээ` is clunky. | Smooth into natural language about continuing the next meal without punishment. | No |
| P2 | `pcos_body_uncertainty_control` | Ил харагдаж байгаа зүйл | `барих нэг жижиг бариул` has uneven idiom quality. | Replace with a simpler phrase about looking for one steady thing to hold onto. | No |
| P2 | `pcos_body_uncertainty_control` | Эхний зөөлөн өөрчлөлт | `гэдэс цадах мэдрэмж` is awkward. | Use a more natural phrase for fullness/satisfaction without body judgment. | No |

## Suggested next work pack

Recommended next work pack: test-only copy polish pass for the two WP10 sensitive fixtures.

The next pass should:

- rewrite only user-facing draft copy
- preserve WP9 metadata decisions
- preserve WP10 renderer contract unless explicitly approved later
- keep runtime integration on HOLD
- regenerate markdown snapshots for owner review
- re-run internal-key, safety, non-diagnostic, and non-shaming checks


---

## Full Content: work-pack-11-recommendation.md

# Work Pack 11 Recommendation

Recommendation enum:

`READY FOR OWNER REVIEW OF COPY QA`

## Recommendation

WP11 is ready for owner review as a docs-only QA pack.

The WP10 rendered copy snapshots are not production-ready and should not move to runtime integration. Both sensitive fixtures are directionally useful, but both require copy polish before any future runtime planning.

## Fixture outcomes

| Fixture | WP11 outcome | Runtime integration |
| --- | --- | --- |
| `all_or_nothing_restriction_rebound` | `NEEDS COPY POLISH` | HOLD |
| `pcos_body_uncertainty_control` | `NEEDS COPY POLISH` | HOLD |

## Required next step

Create a future test-only copy polish work pack that rewrites the flagged sections without changing runtime behavior, scoring, fixtures, renderer contract, production rendering, PDF, deploy, backend, payment, QPay, pricing, entitlement, or localStorage behavior.

## Explicit holds

- Runtime integration remains HOLD.
- Production report rendering remains HOLD.
- PDF generation remains HOLD.
- Deploy remains HOLD.
- QPay/backend/payment/pricing/entitlement remain unchanged.
- WP10 renderer code remains unchanged.
- Existing tests remain unchanged.
