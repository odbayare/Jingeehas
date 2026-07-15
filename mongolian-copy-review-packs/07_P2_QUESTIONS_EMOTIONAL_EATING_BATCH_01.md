# P2 Questions — EMOTIONAL_EATING — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0466 — P2

**Exact current text**

> Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 329
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-H03", module: "Hunger & satiety", type: "single", text: "Өлссөн үү, ядарсан уу, сэтгэл тавгүй байна уу гэдгээ ялгахад амар байдаг уу?", options: ["Тийм, ихэнхдээ ялгадаг", "Заримдаа ялгадаг", "Сайн ялгадаггүй", "Бүгд л 'юм идмээр' гэж мэдрэгддэг", "Анзаарч байгаагүй"], scores: { "Сайн ялгадаггүй": ["satiety", "regulation"], "Бүгд л 'юм идмээр' гэж мэдрэгддэг": ["satiety", "regulation"], "Бүгд 'юм идмээр' гэж мэдрэгддэг": ["satiety", "regulation"] } },

**Source item**

> { id: "S1-F01", module: "Hidden function", type: "multi", text: "Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?", options: ["Үнэхээр өлссөн байсан", "Амттай зүйл идмээр санагдсан", "Тайвширмаар санагдсан", "Өөрийгөө урамшуулмаар санагдсан", "Уйдсан", "Ядарсан", "Дараа өлсөхөөс санаа зовсон", "Харагдаад эсвэл үнэртээд идмээр болсон", "Татгалзах эвгүй байсан", "Хамгийн амар сонголт нь тэр байсан", "Бие эвгүйрхэхээс санаа зовсон", "Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон", "Сарын тэмдгийн мөчлөгтэй холбоотой мэт санагдсан", "Сайн мэдэхгүй"], max: 3, scores: { "Үнэхээр өлссөн байсан": ["hungerSafety"], "Амттай зүйл идмээр санагдсан": ["reward"], "Тайвширмаар санагдсан": ["regulation"], "Өөрийгөө урамшуулмаар санагдсан": ["reward"], "Уйдсан": ["reward"], "Ядарсан": ["executive", "circadian"], "Дараа өлсөхөөс санаа зовсон": ["hungerSafety"], "Харагдаад эсвэл үнэртээд идмээр болсон": ["cue"], "Татгалзах эвгүй байсан": ["social"], "Хамгийн амар сонголт нь тэр байсан": ["executive"], "Хамгийн хялбар сонголт нь тэр байсан": ["executive"], "Бие эвгүйрхэхээс санаа зовсон": ["glucose"], "Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон": ["social", "circadian", "hungerSafety"], "Сарын тэмдгийн мөчлөгтэй холбоотой мэт санагдсан": ["circadian"] } },

**Source context after**

> { id: "S1-F02", module: "Hidden function", type: "single", text: "Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ?", options: ["Тайвширдаг", "Сэтгэл ханамж", "Түр гайгүй болоод гэмшдэг", "Шууд гэмшдэг", "Бие гайгүй", "Одоо бүх юм дууссан", "Маргааш чанга барина", "Өөрчлөлтгүй", "Мэдэхгүй"], scores: { "Тайвширдаг": ["regulation"], "Сэтгэл ханамж": ["reward"], "Түр гайгүй болоод гэмшдэг": ["regulation", "collapse"], "Шууд гэмшдэг": ["collapse"], "Одоо бүх юм дууссан": ["collapse"], "Маргааш чанга барина": ["collapse"], "Бие гайгүй": ["glucose"] } },

**Rendered context**

> Өлссөн үү, ядарсан уу, сэтгэл тавгүй байна уу гэдгээ ялгахад амар байдаг уу?
> Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?
> Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ?

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

**Answer options for S1-F01**

- Үнэхээр өлссөн байсан
- Амттай зүйл идмээр санагдсан
- Тайвширмаар санагдсан
- Өөрийгөө урамшуулмаар санагдсан
- Уйдсан
- Ядарсан
- Дараа өлсөхөөс санаа зовсон
- Харагдаад эсвэл үнэртээд идмээр болсон
- Татгалзах эвгүй байсан
- Хамгийн амар сонголт нь тэр байсан
- Бие эвгүйрхэхээс санаа зовсон
- Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон
- Сарын тэмдгийн мөчлөгтэй холбоотой мэт санагдсан
- Сайн мэдэхгүй

## COPY-0467 — P2

**Exact current text**

> Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 330
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-F01", module: "Hidden function", type: "multi", text: "Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?", options: ["Үнэхээр өлссөн байсан", "Амттай зүйл идмээр санагдсан", "Тайвширмаар санагдсан", "Өөрийгөө урамшуулмаар санагдсан", "Уйдсан", "Ядарсан", "Дараа өлсөхөөс санаа зовсон", "Харагдаад эсвэл үнэртээд идмээр болсон", "Татгалзах эвгүй байсан", "Хамгийн амар сонголт нь тэр байсан", "Бие эвгүйрхэхээс санаа зовсон", "Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон", "Сарын тэмдгийн мөчлөгтэй холбоотой мэт санагдсан", "Сайн мэдэхгүй"], max: 3, scores: { "Үнэхээр өлссөн байсан": ["hungerSafety"], "Амттай зүйл идмээр санагдсан": ["reward"], "Тайвширмаар санагдсан": ["regulation"], "Өөрийгөө урамшуулмаар санагдсан": ["reward"], "Уйдсан": ["reward"], "Ядарсан": ["executive", "circadian"], "Дараа өлсөхөөс санаа зовсон": ["hungerSafety"], "Харагдаад эсвэл үнэртээд идмээр болсон": ["cue"], "Татгалзах эвгүй байсан": ["social"], "Хамгийн амар сонголт нь тэр байсан": ["executive"], "Хамгийн хялбар сонголт нь тэр байсан": ["executive"], "Бие эвгүйрхэхээс санаа зовсон": ["glucose"], "Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон": ["social", "circadian", "hungerSafety"], "Сарын тэмдгийн мөчлөгтэй холбоотой мэт санагдсан": ["circadian"] } },

**Source item**

> { id: "S1-F02", module: "Hidden function", type: "single", text: "Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ?", options: ["Тайвширдаг", "Сэтгэл ханамж", "Түр гайгүй болоод гэмшдэг", "Шууд гэмшдэг", "Бие гайгүй", "Одоо бүх юм дууссан", "Маргааш чанга барина", "Өөрчлөлтгүй", "Мэдэхгүй"], scores: { "Тайвширдаг": ["regulation"], "Сэтгэл ханамж": ["reward"], "Түр гайгүй болоод гэмшдэг": ["regulation", "collapse"], "Шууд гэмшдэг": ["collapse"], "Одоо бүх юм дууссан": ["collapse"], "Маргааш чанга барина": ["collapse"], "Бие гайгүй": ["glucose"] } },

**Source context after**

> { id: "S1-V01", module: "Voice checkpoint", type: "text", text: "Сүүлийн үед төлөвлөөгүй байхдаа хооллосон нэг тод мөчөө товчхон хуваалцаарай. Юуны дараа тухайн нөхцөл бүрдсэн бэ? Тэр үед бодитоор өлсөж байсан уу? Сэтгэл санааны ямар мэдрэмж давамгайлж байв? Идсэний дараа танд ямар өөрчлөлт мэдрэгдсэн бэ?", voice: true },

**Rendered context**

> Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?
> Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ?
> Сүүлийн үед төлөвлөөгүй байхдаа хооллосон нэг тод мөчөө товчхон хуваалцаарай. Юуны дараа тухайн нөхцөл бүрдсэн бэ? Тэр үед бодитоор өлсөж байсан уу? Сэтгэл санааны ямар мэдрэмж давамгайлж байв? Идсэний дараа танд ямар өөрчлөлт мэдрэгдсэн бэ?

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

**Answer options for S1-F02**

- Тайвширдаг
- Сэтгэл ханамж
- Түр гайгүй болоод гэмшдэг
- Шууд гэмшдэг
- Бие гайгүй
- Одоо бүх юм дууссан
- Маргааш чанга барина
- Өөрчлөлтгүй
- Мэдэхгүй

## COPY-0469 — P2

**Exact current text**

> Өлсөөгүй байсан ч ‘нэг гоё юм идмээр байна’ гэж санагддаг үе байдаг уу?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 332
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-V01", module: "Voice checkpoint", type: "text", text: "Сүүлийн үед төлөвлөөгүй байхдаа хооллосон нэг тод мөчөө товчхон хуваалцаарай. Юуны дараа тухайн нөхцөл бүрдсэн бэ? Тэр үед бодитоор өлсөж байсан уу? Сэтгэл санааны ямар мэдрэмж давамгайлж байв? Идсэний дараа танд ямар өөрчлөлт мэдрэгдсэн бэ?", voice: true },

**Source item**

> { id: "S1-R01", module: "Reward / craving", type: "single", text: "Өлсөөгүй байсан ч ‘нэг гоё юм идмээр байна’ гэж санагддаг үе байдаг уу?", options: ["Үгүй", "Хааяа", "Нэлээд олон удаа", "Бараг өдөр бүр", "Өдөрт олон удаа"], scores: { "Нэлээд олон удаа": ["reward"], "7 хоногт хэд хэд": ["reward"], "Бараг өдөр бүр": ["reward"], "Өдөрт олон удаа": ["reward"] } },

**Source context after**

> { id: "S1-R02", module: "Reward / craving", type: "multi", text: "Энэ хүсэл ихэвчлэн ямар үед гардаг вэ?", options: ["Уйдсан үед", "Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед", "Ажлын дараа амармаар санагдах үед", "Амт, үнэр, мэдрэмж татах үед", "Хоолны зураг эсвэл захиалгын апп харахад", "Стресс ихтэй үед", "Ганцаардсан үед", "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд", "Мэдэхгүй"], scores: { "Уйдсан үед": ["reward"], "Уйдал": ["reward"], "Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед": ["reward"], "Өдрийн төгсгөлд өөрийгөө шагнах": ["reward"], "Өдрийн төгсгөлд шагнах": ["reward"], "Ажлын дараа амармаар санагдах үед": ["reward", "regulation"], "Ажлын дараах амралт": ["reward", "regulation"], "Амт, үнэр, мэдрэмж татах үед": ["reward"], "Амт, мэдрэмж": ["reward"], "Амт-мэдрэмж": ["reward"], "Хоолны зураг эсвэл захиалгын апп харахад": ["reward", "cue"], "Хоолны зураг эсвэл delivery": ["reward", "cue"], "Food зураг-delivery": ["reward", "cue"], "Стресс ихтэй үед": ["regulation"], "Стресс": ["regulation"], "Stress": ["regulation"], "Ганцаардсан үед": ["regulation", "social"], "Ганцаардал": ["regulation", "social"] } },

**Rendered context**

> Сүүлийн үед төлөвлөөгүй байхдаа хооллосон нэг тод мөчөө товчхон хуваалцаарай. Юуны дараа тухайн нөхцөл бүрдсэн бэ? Тэр үед бодитоор өлсөж байсан уу? Сэтгэл санааны ямар мэдрэмж давамгайлж байв? Идсэний дараа танд ямар өөрчлөлт мэдрэгдсэн бэ?
> Өлсөөгүй байсан ч ‘нэг гоё юм идмээр байна’ гэж санагддаг үе байдаг уу?
> Энэ хүсэл ихэвчлэн ямар үед гардаг вэ?

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

**Answer options for S1-R01**

- Үгүй
- Хааяа
- Нэлээд олон удаа
- Бараг өдөр бүр
- Өдөрт олон удаа

## COPY-0470 — P2

**Exact current text**

> Энэ хүсэл ихэвчлэн ямар үед гардаг вэ?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 333
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-R01", module: "Reward / craving", type: "single", text: "Өлсөөгүй байсан ч ‘нэг гоё юм идмээр байна’ гэж санагддаг үе байдаг уу?", options: ["Үгүй", "Хааяа", "Нэлээд олон удаа", "Бараг өдөр бүр", "Өдөрт олон удаа"], scores: { "Нэлээд олон удаа": ["reward"], "7 хоногт хэд хэд": ["reward"], "Бараг өдөр бүр": ["reward"], "Өдөрт олон удаа": ["reward"] } },

**Source item**

> { id: "S1-R02", module: "Reward / craving", type: "multi", text: "Энэ хүсэл ихэвчлэн ямар үед гардаг вэ?", options: ["Уйдсан үед", "Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед", "Ажлын дараа амармаар санагдах үед", "Амт, үнэр, мэдрэмж татах үед", "Хоолны зураг эсвэл захиалгын апп харахад", "Стресс ихтэй үед", "Ганцаардсан үед", "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд", "Мэдэхгүй"], scores: { "Уйдсан үед": ["reward"], "Уйдал": ["reward"], "Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед": ["reward"], "Өдрийн төгсгөлд өөрийгөө шагнах": ["reward"], "Өдрийн төгсгөлд шагнах": ["reward"], "Ажлын дараа амармаар санагдах үед": ["reward", "regulation"], "Ажлын дараах амралт": ["reward", "regulation"], "Амт, үнэр, мэдрэмж татах үед": ["reward"], "Амт, мэдрэмж": ["reward"], "Амт-мэдрэмж": ["reward"], "Хоолны зураг эсвэл захиалгын апп харахад": ["reward", "cue"], "Хоолны зураг эсвэл delivery": ["reward", "cue"], "Food зураг-delivery": ["reward", "cue"], "Стресс ихтэй үед": ["regulation"], "Стресс": ["regulation"], "Stress": ["regulation"], "Ганцаардсан үед": ["regulation", "social"], "Ганцаардал": ["regulation", "social"] } },

**Source context after**

> { id: "S1-R03", module: "Reward / craving", type: "single", text: "Идэхээс өмнө бодогдох амттай зүйл идсэний дараа санаснаас бага таашаал өгдөг үү?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Бараг үргэлж"], scores: { "Заримдаа": ["reward"], "Ихэвчлэн": ["reward"], "Бараг үргэлж": ["reward"] } },

**Rendered context**

> Өлсөөгүй байсан ч ‘нэг гоё юм идмээр байна’ гэж санагддаг үе байдаг уу?
> Энэ хүсэл ихэвчлэн ямар үед гардаг вэ?
> Идэхээс өмнө бодогдох амттай зүйл идсэний дараа санаснаас бага таашаал өгдөг үү?

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

**Answer options for S1-R02**

- Уйдсан үед
- Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед
- Ажлын дараа амармаар санагдах үед
- Амт, үнэр, мэдрэмж татах үед
- Хоолны зураг эсвэл захиалгын апп харахад
- Стресс ихтэй үед
- Ганцаардсан үед
- Сарын тэмдэг ирэхийн өмнөх өдрүүдэд
- Мэдэхгүй

## COPY-0471 — P2

**Exact current text**

> Идэхээс өмнө бодогдох амттай зүйл идсэний дараа санаснаас бага таашаал өгдөг үү?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 334
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-R02", module: "Reward / craving", type: "multi", text: "Энэ хүсэл ихэвчлэн ямар үед гардаг вэ?", options: ["Уйдсан үед", "Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед", "Ажлын дараа амармаар санагдах үед", "Амт, үнэр, мэдрэмж татах үед", "Хоолны зураг эсвэл захиалгын апп харахад", "Стресс ихтэй үед", "Ганцаардсан үед", "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд", "Мэдэхгүй"], scores: { "Уйдсан үед": ["reward"], "Уйдал": ["reward"], "Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед": ["reward"], "Өдрийн төгсгөлд өөрийгөө шагнах": ["reward"], "Өдрийн төгсгөлд шагнах": ["reward"], "Ажлын дараа амармаар санагдах үед": ["reward", "regulation"], "Ажлын дараах амралт": ["reward", "regulation"], "Амт, үнэр, мэдрэмж татах үед": ["reward"], "Амт, мэдрэмж": ["reward"], "Амт-мэдрэмж": ["reward"], "Хоолны зураг эсвэл захиалгын апп харахад": ["reward", "cue"], "Хоолны зураг эсвэл delivery": ["reward", "cue"], "Food зураг-delivery": ["reward", "cue"], "Стресс ихтэй үед": ["regulation"], "Стресс": ["regulation"], "Stress": ["regulation"], "Ганцаардсан үед": ["regulation", "social"], "Ганцаардал": ["regulation", "social"] } },

**Source item**

> { id: "S1-R03", module: "Reward / craving", type: "single", text: "Идэхээс өмнө бодогдох амттай зүйл идсэний дараа санаснаас бага таашаал өгдөг үү?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Бараг үргэлж"], scores: { "Заримдаа": ["reward"], "Ихэвчлэн": ["reward"], "Бараг үргэлж": ["reward"] } },

**Source context after**

> { id: "S1-E01", module: "Emotion / regulation", type: "single", text: "Стресс ихтэй өдөр орой ‘ямар нэг юм идээд жаахан амсхийе’ гэж бодогдох үе байдаг уу?", options: ["Бараг үгүй", "Хааяа", "Нэлээд давтагддаг", "Ихэвчлэн тэгдэг", "Заримдаа идэж чаддаггүй"], scores: { "Хааяа": ["regulation"], "Нэлээд давтагддаг": ["regulation"], "Ихэвчлэн тэгдэг": ["regulation"], "Заримдаа нэмэгддэг": ["regulation"], "Ихэвчлэн нэмэгддэг": ["regulation"], "Маш их нэмэгддэг": ["regulation"] } },

**Rendered context**

> Энэ хүсэл ихэвчлэн ямар үед гардаг вэ?
> Идэхээс өмнө бодогдох амттай зүйл идсэний дараа санаснаас бага таашаал өгдөг үү?
> Стресс ихтэй өдөр орой ‘ямар нэг юм идээд жаахан амсхийе’ гэж бодогдох үе байдаг уу?

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

**Answer options for S1-R03**

- Үгүй
- Ховор
- Заримдаа
- Ихэвчлэн
- Бараг үргэлж

## COPY-0472 — P2

**Exact current text**

> Стресс ихтэй өдөр орой ‘ямар нэг юм идээд жаахан амсхийе’ гэж бодогдох үе байдаг уу?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 335
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-R03", module: "Reward / craving", type: "single", text: "Идэхээс өмнө бодогдох амттай зүйл идсэний дараа санаснаас бага таашаал өгдөг үү?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Бараг үргэлж"], scores: { "Заримдаа": ["reward"], "Ихэвчлэн": ["reward"], "Бараг үргэлж": ["reward"] } },

**Source item**

> { id: "S1-E01", module: "Emotion / regulation", type: "single", text: "Стресс ихтэй өдөр орой ‘ямар нэг юм идээд жаахан амсхийе’ гэж бодогдох үе байдаг уу?", options: ["Бараг үгүй", "Хааяа", "Нэлээд давтагддаг", "Ихэвчлэн тэгдэг", "Заримдаа идэж чаддаггүй"], scores: { "Хааяа": ["regulation"], "Нэлээд давтагддаг": ["regulation"], "Ихэвчлэн тэгдэг": ["regulation"], "Заримдаа нэмэгддэг": ["regulation"], "Ихэвчлэн нэмэгддэг": ["regulation"], "Маш их нэмэгддэг": ["regulation"] } },

**Source context after**

> { id: "S1-E02", module: "Emotion / regulation", type: "multi", text: "Идэх хүсэлтэй хамгийн их холбогддог мэдрэмж аль нь вэ?", options: ["Стресс", "Уур", "Гуниг", "Ганцаардал", "Санаа зовнил", "Ядаргаа", "Хоосон мэт мэдрэмж", "Баяртай эсвэл өөрийгөө шагнамаар үе", "Мэдэхгүй"], scores: { "Стресс": ["regulation"], "Уур": ["regulation"], "Гуниг": ["regulation"], "Ганцаардал": ["regulation", "social"], "Санаа зовнил": ["regulation"], "Ядаргаа": ["executive", "circadian"], "Хоосон мэт мэдрэмж": ["reward"], "Хоосон/flat мэдрэмж": ["reward"], "Баяртай эсвэл өөрийгөө шагнамаар үе": ["reward"], "Баяртай/reward mode": ["reward"] } },

**Rendered context**

> Идэхээс өмнө бодогдох амттай зүйл идсэний дараа санаснаас бага таашаал өгдөг үү?
> Стресс ихтэй өдөр орой ‘ямар нэг юм идээд жаахан амсхийе’ гэж бодогдох үе байдаг уу?
> Идэх хүсэлтэй хамгийн их холбогддог мэдрэмж аль нь вэ?

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

**Answer options for S1-E01**

- Бараг үгүй
- Хааяа
- Нэлээд давтагддаг
- Ихэвчлэн тэгдэг
- Заримдаа идэж чаддаггүй

## COPY-0473 — P2

**Exact current text**

> Идэх хүсэлтэй хамгийн их холбогддог мэдрэмж аль нь вэ?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 336
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-E01", module: "Emotion / regulation", type: "single", text: "Стресс ихтэй өдөр орой ‘ямар нэг юм идээд жаахан амсхийе’ гэж бодогдох үе байдаг уу?", options: ["Бараг үгүй", "Хааяа", "Нэлээд давтагддаг", "Ихэвчлэн тэгдэг", "Заримдаа идэж чаддаггүй"], scores: { "Хааяа": ["regulation"], "Нэлээд давтагддаг": ["regulation"], "Ихэвчлэн тэгдэг": ["regulation"], "Заримдаа нэмэгддэг": ["regulation"], "Ихэвчлэн нэмэгддэг": ["regulation"], "Маш их нэмэгддэг": ["regulation"] } },

**Source item**

> { id: "S1-E02", module: "Emotion / regulation", type: "multi", text: "Идэх хүсэлтэй хамгийн их холбогддог мэдрэмж аль нь вэ?", options: ["Стресс", "Уур", "Гуниг", "Ганцаардал", "Санаа зовнил", "Ядаргаа", "Хоосон мэт мэдрэмж", "Баяртай эсвэл өөрийгөө шагнамаар үе", "Мэдэхгүй"], scores: { "Стресс": ["regulation"], "Уур": ["regulation"], "Гуниг": ["regulation"], "Ганцаардал": ["regulation", "social"], "Санаа зовнил": ["regulation"], "Ядаргаа": ["executive", "circadian"], "Хоосон мэт мэдрэмж": ["reward"], "Хоосон/flat мэдрэмж": ["reward"], "Баяртай эсвэл өөрийгөө шагнамаар үе": ["reward"], "Баяртай/reward mode": ["reward"] } },

**Source context after**

> { id: "S1-E03", module: "Emotion / regulation", type: "single", text: "Идсэний дараа таны мэдрэмж ихэвчлэн яаж өөрчлөгддөг вэ?", options: ["Тайвширдаг", "Түр тайвширдаг", "Өөрчлөгдөхгүй", "Гэмшдэг", "Илүү их санаа зовдог"], scores: { "Тайвширдаг": ["regulation"], "Түр тайвширдаг": ["regulation"], "Гэмшдэг": ["collapse"], "Илүү их санаа зовдог": ["collapse"] } },

**Rendered context**

> Стресс ихтэй өдөр орой ‘ямар нэг юм идээд жаахан амсхийе’ гэж бодогдох үе байдаг уу?
> Идэх хүсэлтэй хамгийн их холбогддог мэдрэмж аль нь вэ?
> Идсэний дараа таны мэдрэмж ихэвчлэн яаж өөрчлөгддөг вэ?

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

**Answer options for S1-E02**

- Стресс
- Уур
- Гуниг
- Ганцаардал
- Санаа зовнил
- Ядаргаа
- Хоосон мэт мэдрэмж
- Баяртай эсвэл өөрийгөө шагнамаар үе
- Мэдэхгүй

## COPY-0474 — P2

**Exact current text**

> Идсэний дараа таны мэдрэмж ихэвчлэн яаж өөрчлөгддөг вэ?

**Classification**

- Priority: P2
- Review group: question
- Structural signal: Question wording requiring owner review.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 337
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-E02", module: "Emotion / regulation", type: "multi", text: "Идэх хүсэлтэй хамгийн их холбогддог мэдрэмж аль нь вэ?", options: ["Стресс", "Уур", "Гуниг", "Ганцаардал", "Санаа зовнил", "Ядаргаа", "Хоосон мэт мэдрэмж", "Баяртай эсвэл өөрийгөө шагнамаар үе", "Мэдэхгүй"], scores: { "Стресс": ["regulation"], "Уур": ["regulation"], "Гуниг": ["regulation"], "Ганцаардал": ["regulation", "social"], "Санаа зовнил": ["regulation"], "Ядаргаа": ["executive", "circadian"], "Хоосон мэт мэдрэмж": ["reward"], "Хоосон/flat мэдрэмж": ["reward"], "Баяртай эсвэл өөрийгөө шагнамаар үе": ["reward"], "Баяртай/reward mode": ["reward"] } },

**Source item**

> { id: "S1-E03", module: "Emotion / regulation", type: "single", text: "Идсэний дараа таны мэдрэмж ихэвчлэн яаж өөрчлөгддөг вэ?", options: ["Тайвширдаг", "Түр тайвширдаг", "Өөрчлөгдөхгүй", "Гэмшдэг", "Илүү их санаа зовдог"], scores: { "Тайвширдаг": ["regulation"], "Түр тайвширдаг": ["regulation"], "Гэмшдэг": ["collapse"], "Илүү их санаа зовдог": ["collapse"] } },

**Source context after**

> { id: "S1-A01", module: "Согтууруулах ундаа ба тамхи", type: "single", text: "Та согтууруулах ундааг хэр ойр хэрэглэдэг вэ?", options: ["Огт хэрэглэдэггүй", "Ховор хэрэглэдэг", "Сард хэд хэдэн удаа хэрэглэдэг", "7 хоногт 1–2 удаа хэрэглэдэг", "7 хоногт 3 ба түүнээс олон удаа хэрэглэдэг", "Хариулахгүй"], scores: { "Сард хэд хэдэн удаа хэрэглэдэг": ["social"], "7 хоногт 1–2 удаа хэрэглэдэг": ["social", "circadian"], "7 хоногт 3 ба түүнээс олон удаа хэрэглэдэг": ["social", "circadian"] } },

**Rendered context**

> Идэх хүсэлтэй хамгийн их холбогддог мэдрэмж аль нь вэ?
> Идсэний дараа таны мэдрэмж ихэвчлэн яаж өөрчлөгддөг вэ?
> Та согтууруулах ундааг хэр ойр хэрэглэдэг вэ?

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

**Answer options for S1-E03**

- Тайвширдаг
- Түр тайвширдаг
- Өөрчлөгдөхгүй
- Гэмшдэг
- Илүү их санаа зовдог
