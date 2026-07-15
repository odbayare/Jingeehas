# P2 Questions — DIARY — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0307 — P2

**Exact current text**

> Өнөөдөр хоолны хэмнэл ямархуу өнгөрөв?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: DIARY_QUESTION
- Role: SEVEN_DAY_USER
- Scenario: diary-single
- Render source: renderDiary using diaryQuestionIndex
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 407
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: renderDiary using diaryQuestionIndex via diary-single [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> const dailyCore = [

**Source item**

> { id: "D-C01", type: "single", text: "Өнөөдөр хоолны хэмнэл ямархуу өнгөрөв?", field: "meal_rhythm", options: ["Тогтуун, хоол алгасаагүй", "Нэг хоол алгассан", "Хоол хоорондын зай хэтэрсэн", "Өдөр бага идээд орой нөхсөн", "Юу идснээ сайн санахгүй байна"] },

**Source context after**

> { id: "D-C02", type: "single", text: "Өнөөдөр ‘ингэе гэж бодоогүй байсан ч’ идэж, уусан зүйл гарсан уу?", field: "unplanned_eating_count", options: ["Үгүй", "Тийм, нэг удаа", "Тийм, хоёр удаа", "Тийм, гурваас олон удаа"] },

**Rendered context**

> Асуулт 1/14
> Өнөөдөр хоолны хэмнэл ямархуу өнгөрөв?
> Тогтуун, хоол алгасаагүй

**Dynamic values**

- None

**Reason included**

Question wording requiring owner review.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C01**

- Тогтуун, хоол алгасаагүй
- Нэг хоол алгассан
- Хоол хоорондын зай хэтэрсэн
- Өдөр бага идээд орой нөхсөн
- Юу идснээ сайн санахгүй байна

## D-C02 — P2

**Exact current text**

> Өнөөдөр ‘ингэе гэж бодоогүй байсан ч’ идэж, уусан зүйл гарсан уу?

**Answer options**

- Үгүй
- Тийм, нэг удаа
- Тийм, хоёр удаа
- Тийм, гурваас олон удаа

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C02**

- Үгүй
- Тийм, нэг удаа
- Тийм, хоёр удаа
- Тийм, гурваас олон удаа

## D-C03 — P2

**Exact current text**

> Тэр үе ихэвчлэн хэзээ байсан бэ?

**Answer options**

- Өглөө
- Өдөр
- Орой
- Шөнө
- Хүмүүстэй хамт байх үед
- Өнөөдөр тийм зүйл гараагүй

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C03**

- Өглөө
- Өдөр
- Орой
- Шөнө
- Хүмүүстэй хамт байх үед
- Өнөөдөр тийм зүйл гараагүй

## COPY-0331 — P2

**Exact current text**

> Тэр үед та үнэхээр өлссөн байсан уу? 0 = огт өлсөөгүй, 10 = маш их өлссөн

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: DIARY_QUESTION
- Role: SEVEN_DAY_USER
- Scenario: diary-scale
- Render source: renderDiary using diaryQuestionIndex
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 410
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: renderDiary using diaryQuestionIndex via diary-scale [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> { id: "D-C03", type: "single", text: "Тэр үе ихэвчлэн хэзээ байсан бэ?", field: "main_moment_time", options: ["Өглөө", "Өдөр", "Орой", "Шөнө", "Хүмүүстэй хамт байх үед", "Өнөөдөр тийм зүйл гараагүй"] },

**Source item**

> { id: "D-C04", type: "scale", text: "Тэр үед та үнэхээр өлссөн байсан уу? 0 = огт өлсөөгүй, 10 = маш их өлссөн", field: "hunger_level" },

**Source context after**

> { id: "D-C05", type: "multi", text: "Тэр хүслийг юутай хамгийн ойр тайлбарлах вэ?", field: "food_function", options: ["Өлссөндөө", "Амттай юм идмээр байсан", "Тайвширмаар байсан", "Өөрийгөө жаахан шагнамаар байсан", "Уйдсан", "Ядарсан", "Дараа өлсөхөөс санаа зовсон", "Харагдаад эсвэл үнэртээд идмээр болсон", "Татгалзах эвгүй байсан", "Хамгийн амар нь тэр байсан", "Бие эвгүйрхэх вий гэж санаа зовсон", "Сарын тэмдэгтэй холбоотой мэт санагдсан"] },

**Rendered context**

> Асуулт 4/14
> Тэр үед та үнэхээр өлссөн байсан уу? 0 = огт өлсөөгүй, 10 = маш их өлссөн
> 0

**Dynamic values**

- None

**Reason included**

Question wording requiring owner review.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C04**

- None

## COPY-0318 — P2

**Exact current text**

> Тэр хүслийг юутай хамгийн ойр тайлбарлах вэ?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: DIARY_QUESTION
- Role: SEVEN_DAY_USER
- Scenario: diary-multi
- Render source: renderDiary using diaryQuestionIndex
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 411
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: renderDiary using diaryQuestionIndex via diary-multi [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> { id: "D-C04", type: "scale", text: "Тэр үед та үнэхээр өлссөн байсан уу? 0 = огт өлсөөгүй, 10 = маш их өлссөн", field: "hunger_level" },

**Source item**

> { id: "D-C05", type: "multi", text: "Тэр хүслийг юутай хамгийн ойр тайлбарлах вэ?", field: "food_function", options: ["Өлссөндөө", "Амттай юм идмээр байсан", "Тайвширмаар байсан", "Өөрийгөө жаахан шагнамаар байсан", "Уйдсан", "Ядарсан", "Дараа өлсөхөөс санаа зовсон", "Харагдаад эсвэл үнэртээд идмээр болсон", "Татгалзах эвгүй байсан", "Хамгийн амар нь тэр байсан", "Бие эвгүйрхэх вий гэж санаа зовсон", "Сарын тэмдэгтэй холбоотой мэт санагдсан"] },

**Source context after**

> { id: "D-C06", type: "single", text: "Өнөөдөр сэтгэлд хамгийн их үлдсэн мэдрэмж аль нь байсан бэ?", field: "emotion", options: ["Тайван", "Стресс", "Ууртай", "Гунигтай", "Ганцаардсан", "Санаа зовсон", "Ядарсан", "Хоосон юм шиг", "Өөрийгөө баярлуулмаар санагдсан", "Сайн ялгахгүй байна"] },

**Rendered context**

> Асуулт 5/14
> Тэр хүслийг юутай хамгийн ойр тайлбарлах вэ?
> Өлссөндөө

**Dynamic values**

- None

**Reason included**

Question wording requiring owner review.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C05**

- Өлссөндөө
- Амттай юм идмээр байсан
- Тайвширмаар байсан
- Өөрийгөө жаахан шагнамаар байсан
- Уйдсан
- Ядарсан
- Дараа өлсөхөөс санаа зовсон
- Харагдаад эсвэл үнэртээд идмээр болсон
- Татгалзах эвгүй байсан
- Хамгийн амар нь тэр байсан
- Бие эвгүйрхэх вий гэж санаа зовсон
- Сарын тэмдэгтэй холбоотой мэт санагдсан

## D-C06 — P2

**Exact current text**

> Өнөөдөр сэтгэлд хамгийн их үлдсэн мэдрэмж аль нь байсан бэ?

**Answer options**

- Тайван
- Стресс
- Ууртай
- Гунигтай
- Ганцаардсан
- Санаа зовсон
- Ядарсан
- Хоосон юм шиг
- Өөрийгөө баярлуулмаар санагдсан
- Сайн ялгахгүй байна

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C06**

- Тайван
- Стресс
- Ууртай
- Гунигтай
- Ганцаардсан
- Санаа зовсон
- Ядарсан
- Хоосон юм шиг
- Өөрийгөө баярлуулмаар санагдсан
- Сайн ялгахгүй байна

## D-C07 — P2

**Exact current text**

> Өнөөдрийн стрессийг 0–10 дээр тавивал хэд орчим байсан бэ?

**Answer options**

- None

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C07**

- None

## D-C08 — P2

**Exact current text**

> Орой болоход тэнхээ хэр үлдсэн байсан бэ? 0 = огт үлдээгүй, 10 = хангалттай байсан

**Answer options**

- None

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C08**

- None

## D-C09 — P2

**Exact current text**

> Өчигдөр шөнө хэр унтсан бэ?

**Answer options**

- 4 цагаас бага
- 4–6 цаг
- 6–8 цаг
- 8 цагаас дээш
- Олон сэрсэн, чанар муу
- Сайн амарсан

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C09**

- 4 цагаас бага
- 4–6 цаг
- 6–8 цаг
- 8 цагаас дээш
- Олон сэрсэн, чанар муу
- Сайн амарсан

## D-C10 — P2

**Exact current text**

> Өнөөдөр та юу юу уув?

**Answer options**

- Хар кофе
- Сүүтэй кофе
- Сүүтэй цай
- Жүүс / хийжүүлсэн ундаа
- Сэргээх ундаа
- Согтууруулах ундаа
- Ус голдуу
- Онцгой зүйл байгаагүй

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C10**

- Хар кофе
- Сүүтэй кофе
- Сүүтэй цай
- Жүүс / хийжүүлсэн ундаа
- Сэргээх ундаа
- Согтууруулах ундаа
- Ус голдуу
- Онцгой зүйл байгаагүй

## D-C11 — P2

**Exact current text**

> Хоол холдох үед эсвэл орой биеэр ямар нэг шинж мэдрэгдсэн үү?

**Answer options**

- Гар салгалах
- Зүрх дэлсэх
- Хөлрөх
- Толгой эргэх
- Толгой өвдөх
- Сахар унасан мэт санагдах
- Хавагнах
- Аль нь ч үгүй

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C11**

- Гар салгалах
- Зүрх дэлсэх
- Хөлрөх
- Толгой эргэх
- Толгой өвдөх
- Сахар унасан мэт санагдах
- Хавагнах
- Аль нь ч үгүй

## D-C12 — P2

**Exact current text**

> Өнөөдрийн хөдөлгөөн хэр байсан бэ?

**Answer options**

- Маш бага
- Бага зэрэг алхсан
- 20+ минут хөдөлсөн
- Дасгал хийсэн
- Өвдөлт/ядаргаанаас болоод бараг хөдөлсөнгүй

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C12**

- Маш бага
- Бага зэрэг алхсан
- 20+ минут хөдөлсөн
- Дасгал хийсэн
- Өвдөлт/ядаргаанаас болоод бараг хөдөлсөнгүй

## D-C13 — P2

**Exact current text**

> Өнөөдөр төлөвлөөгүй идэлт гараагүй бол ямар нөхцөл тусалсан бэ?

**Answer options**

- None

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-C13**

- None

## COPY-0344 — P2

**Exact current text**

> Өнөөдрийн идэлтэд хамгийн их нөлөөлсөн нэг мөчийг богино бичнэ үү. Юуны дараа болсон бэ?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: DIARY_QUESTION
- Role: SEVEN_DAY_USER
- Scenario: diary-text
- Render source: renderDiary using diaryQuestionIndex
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 420
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: renderDiary using diaryQuestionIndex via diary-text [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> { id: "D-C13", type: "text", text: "Өнөөдөр төлөвлөөгүй идэлт гараагүй бол ямар нөхцөл тусалсан бэ?", field: "what_helped" },

**Source item**

> { id: "D-V01", type: "text", text: "Өнөөдрийн идэлтэд хамгийн их нөлөөлсөн нэг мөчийг богино бичнэ үү. Юуны дараа болсон бэ?", field: "raw_reflection" },

**Source context after**

> { id: "D-SUM01", type: "single", text: "Тайлбар хадгалагдлаа", field: "summary_confirmation", options: ["Үргэлжлүүлэх", "Засах", "Нэмэх зүйл байна"] }

**Rendered context**

> Асуулт 13/14
> Өнөөдрийн идэлтэд хамгийн их нөлөөлсөн нэг мөчийг богино бичнэ үү. Юуны дараа болсон бэ?
> 1-2 өгүүлбэр хангалттай

**Dynamic values**

- None

**Reason included**

Question wording requiring owner review.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-V01**

- None

## COPY-0347 — P2

**Exact current text**

> Тайлбар хадгалагдлаа

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: DIARY_CONFIRMATION
- Role: SEVEN_DAY_USER
- Scenario: diary-confirmation-empty, diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add
- Render source: renderDailySummaryConfirmation(D-SUM01)
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 5
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderDailySummaryConfirmation(D-SUM01) via diary-confirmation-empty, diary-confirmation-awaiting, diary-confirmation-confirmed, diary-confirmation-edit, diary-confirmation-add [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Тайлбар хадгалагдлаа
> Өнөөдрийн сонгосон хариултууд хадгалагдсан. Бичмээр зүйл байхгүй бол үргэлжлүүлж болно.

**Dynamic values**

- None

**Reason included**

Question wording requiring owner review.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-SUM01**

- Үргэлжлүүлэх
- Засах
- Нэмэх зүйл байна
