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
