# P2 Questions — HUNGER_SATIETY — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0463 — P2

**Exact current text**

> Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?

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
- Source line: 326
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-M03", module: "Meal rhythm", type: "single", text: "Өдөр хоол алгассан эсвэл оройтсон үед орой идэхээ барихад хэцүү болдог уу?", options: ["Бараг нөлөөлдөггүй", "Заримдаа нөлөөлдөг", "Нэлээд нөлөөлдөг", "Бараг дандаа тэгдэг", "Анзаарч байгаагүй"], scores: { "Нэлээд нөлөөлдөг": ["hungerSafety", "circadian"], "Их нэмэгддэг": ["hungerSafety", "circadian"], "Бараг дандаа тэгдэг": ["hungerSafety", "collapse"], "Хянахад хэцүү": ["hungerSafety", "collapse"] } },

**Source item**

> { id: "S1-H01", module: "Hunger & satiety", type: "single", text: "Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?", options: ["Амархан мэдэрдэг", "Заримдаа мэдэрдэг", "Сайн ялгадаггүй", "Цадсан ч үргэлжлүүлдэг", "Хэт өлстлөө хүлээгээд хэтрүүлдэг"], scores: { "Сайн ялгадаггүй": ["satiety"], "Сайн мэддэггүй": ["satiety"], "Цадсан ч үргэлжлүүлдэг": ["satiety", "reward"], "Хэт өлстлөө хүлээгээд хэтрүүлдэг": ["hungerSafety", "glucose"] } },

**Source context after**

> { id: "S1-H02", module: "Hunger & satiety", type: "single", text: "Төлөвлөөгүй идэх үед та ихэвчлэн бодитоор өлссөн байдаг уу?", options: ["Ихэвчлэн тийм", "Заримдаа", "Ихэвчлэн үгүй", "Ялгаж мэддэггүй", "Нөхцлөөс шалтгаална"], scores: { "Ихэвчлэн тийм": ["hungerSafety"], "Ихэвчлэн үгүй": ["reward", "regulation", "cue"], "Ялгаж мэддэггүй": ["satiety"] } },

**Rendered context**

> Өдөр хоол алгассан эсвэл оройтсон үед орой идэхээ барихад хэцүү болдог уу?
> Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?
> Төлөвлөөгүй идэх үед та ихэвчлэн бодитоор өлссөн байдаг уу?

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

**Answer options for S1-H01**

- Амархан мэдэрдэг
- Заримдаа мэдэрдэг
- Сайн ялгадаггүй
- Цадсан ч үргэлжлүүлдэг
- Хэт өлстлөө хүлээгээд хэтрүүлдэг

## COPY-0464 — P2

**Exact current text**

> Төлөвлөөгүй идэх үед та ихэвчлэн бодитоор өлссөн байдаг уу?

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
- Source line: 327
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-H01", module: "Hunger & satiety", type: "single", text: "Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?", options: ["Амархан мэдэрдэг", "Заримдаа мэдэрдэг", "Сайн ялгадаггүй", "Цадсан ч үргэлжлүүлдэг", "Хэт өлстлөө хүлээгээд хэтрүүлдэг"], scores: { "Сайн ялгадаггүй": ["satiety"], "Сайн мэддэггүй": ["satiety"], "Цадсан ч үргэлжлүүлдэг": ["satiety", "reward"], "Хэт өлстлөө хүлээгээд хэтрүүлдэг": ["hungerSafety", "glucose"] } },

**Source item**

> { id: "S1-H02", module: "Hunger & satiety", type: "single", text: "Төлөвлөөгүй идэх үед та ихэвчлэн бодитоор өлссөн байдаг уу?", options: ["Ихэвчлэн тийм", "Заримдаа", "Ихэвчлэн үгүй", "Ялгаж мэддэггүй", "Нөхцлөөс шалтгаална"], scores: { "Ихэвчлэн тийм": ["hungerSafety"], "Ихэвчлэн үгүй": ["reward", "regulation", "cue"], "Ялгаж мэддэггүй": ["satiety"] } },

**Source context after**

> { id: "S1-H03", module: "Hunger & satiety", type: "single", text: "Өлссөн үү, ядарсан уу, сэтгэл тавгүй байна уу гэдгээ ялгахад амар байдаг уу?", options: ["Тийм, ихэнхдээ ялгадаг", "Заримдаа ялгадаг", "Сайн ялгадаггүй", "Бүгд л 'юм идмээр' гэж мэдрэгддэг", "Анзаарч байгаагүй"], scores: { "Сайн ялгадаггүй": ["satiety", "regulation"], "Бүгд л 'юм идмээр' гэж мэдрэгддэг": ["satiety", "regulation"], "Бүгд 'юм идмээр' гэж мэдрэгддэг": ["satiety", "regulation"] } },

**Rendered context**

> Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?
> Төлөвлөөгүй идэх үед та ихэвчлэн бодитоор өлссөн байдаг уу?
> Өлссөн үү, ядарсан уу, сэтгэл тавгүй байна уу гэдгээ ялгахад амар байдаг уу?

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

**Answer options for S1-H02**

- Ихэвчлэн тийм
- Заримдаа
- Ихэвчлэн үгүй
- Ялгаж мэддэггүй
- Нөхцлөөс шалтгаална

## COPY-0465 — P2

**Exact current text**

> Өлссөн үү, ядарсан уу, сэтгэл тавгүй байна уу гэдгээ ялгахад амар байдаг уу?

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
- Source line: 328
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-H02", module: "Hunger & satiety", type: "single", text: "Төлөвлөөгүй идэх үед та ихэвчлэн бодитоор өлссөн байдаг уу?", options: ["Ихэвчлэн тийм", "Заримдаа", "Ихэвчлэн үгүй", "Ялгаж мэддэггүй", "Нөхцлөөс шалтгаална"], scores: { "Ихэвчлэн тийм": ["hungerSafety"], "Ихэвчлэн үгүй": ["reward", "regulation", "cue"], "Ялгаж мэддэггүй": ["satiety"] } },

**Source item**

> { id: "S1-H03", module: "Hunger & satiety", type: "single", text: "Өлссөн үү, ядарсан уу, сэтгэл тавгүй байна уу гэдгээ ялгахад амар байдаг уу?", options: ["Тийм, ихэнхдээ ялгадаг", "Заримдаа ялгадаг", "Сайн ялгадаггүй", "Бүгд л 'юм идмээр' гэж мэдрэгддэг", "Анзаарч байгаагүй"], scores: { "Сайн ялгадаггүй": ["satiety", "regulation"], "Бүгд л 'юм идмээр' гэж мэдрэгддэг": ["satiety", "regulation"], "Бүгд 'юм идмээр' гэж мэдрэгддэг": ["satiety", "regulation"] } },

**Source context after**

> { id: "S1-F01", module: "Hidden function", type: "multi", text: "Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?", options: ["Үнэхээр өлссөн байсан", "Амттай зүйл идмээр санагдсан", "Тайвширмаар санагдсан", "Өөрийгөө урамшуулмаар санагдсан", "Уйдсан", "Ядарсан", "Дараа өлсөхөөс санаа зовсон", "Харагдаад эсвэл үнэртээд идмээр болсон", "Татгалзах эвгүй байсан", "Хамгийн амар сонголт нь тэр байсан", "Бие эвгүйрхэхээс санаа зовсон", "Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон", "Сарын тэмдгийн мөчлөгтэй холбоотой мэт санагдсан", "Сайн мэдэхгүй"], max: 3, scores: { "Үнэхээр өлссөн байсан": ["hungerSafety"], "Амттай зүйл идмээр санагдсан": ["reward"], "Тайвширмаар санагдсан": ["regulation"], "Өөрийгөө урамшуулмаар санагдсан": ["reward"], "Уйдсан": ["reward"], "Ядарсан": ["executive", "circadian"], "Дараа өлсөхөөс санаа зовсон": ["hungerSafety"], "Харагдаад эсвэл үнэртээд идмээр болсон": ["cue"], "Татгалзах эвгүй байсан": ["social"], "Хамгийн амар сонголт нь тэр байсан": ["executive"], "Хамгийн хялбар сонголт нь тэр байсан": ["executive"], "Бие эвгүйрхэхээс санаа зовсон": ["glucose"], "Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон": ["social", "circadian", "hungerSafety"], "Сарын тэмдгийн мөчлөгтэй холбоотой мэт санагдсан": ["circadian"] } },

**Rendered context**

> Төлөвлөөгүй идэх үед та ихэвчлэн бодитоор өлссөн байдаг уу?
> Өлссөн үү, ядарсан уу, сэтгэл тавгүй байна уу гэдгээ ялгахад амар байдаг уу?
> Төлөвлөөгүйгээр юм идэхийн өмнөхөн танд ямар бодол, мэдрэмж төрдөг вэ?

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

**Answer options for S1-H03**

- Тийм, ихэнхдээ ялгадаг
- Заримдаа ялгадаг
- Сайн ялгадаггүй
- Бүгд л 'юм идмээр' гэж мэдрэгддэг
- Анзаарч байгаагүй

## COPY-0482 — P2

**Exact current text**

> Дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байдаг уу?

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
- Source line: 345
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-MV02", module: "Хөдөлгөөний боломж", type: "single", text: "Хөдөлгөөн тогтмол хийхэд танд хамгийн их саад болдог зүйл юу вэ?", options: ["Цаг гарахгүй байх", "Ядаргаа", "Хаанаас эхлэхээ мэдэхгүй байх", "Бие өвдөх / тавгүй байх", "Гэр бүл, ажил, хүүхдийн ачаалал", "Мөнгө / орчин / байрлал", "Ганцаараа эхлэхэд хэцүү", "Өмнө эхлээд тасалдсан болохоор итгэлгүй байгаа", "Одоогоор хөдөлгөөнөөс илүү хоол/нойроо эхэлж цэгцлэх хэрэгтэй санагдаж байна"], scores: { "Цаг гарахгүй байх": ["executive"], "Ядаргаа": ["executive", "circadian"], "Хаанаас эхлэхээ мэдэхгүй байх": ["executive"], "Бие өвдөх / тавгүй байх": ["medical"], "Гэр бүл, ажил, хүүхдийн ачаалал": ["roleOverload", "executive"], "Ганцаараа эхлэхэд хэцүү": ["social"], "Өмнө эхлээд тасалдсан болохоор итгэлгүй байгаа": ["collapse", "identity"], "Одоогоор хөдөлгөөнөөс илүү хоол/нойроо эхэлж цэгцлэх хэрэгтэй санагдаж байна": ["circadian", "hungerSafety"] } },

**Source item**

> { id: "S1-G01", module: "Hunger-safety", type: "single", text: "Дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байдаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["hungerSafety"], "Ихэвчлэн": ["hungerSafety"], "Маш хүчтэй": ["hungerSafety"] } },

**Source context after**

> { id: "S1-G02", module: "Hunger-safety", type: "single", text: "Дараагийн хоол тодорхойгүй үед та илүү идэх хандлагатай юу?", options: ["Үгүй", "Ховор", "Заримдаа", "Тийм", "Маш тод"], scores: { "Заримдаа": ["hungerSafety"], "Тийм": ["hungerSafety"], "Маш тод": ["hungerSafety"] } },

**Rendered context**

> Хөдөлгөөн тогтмол хийхэд танд хамгийн их саад болдог зүйл юу вэ?
> Дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байдаг уу?
> Дараагийн хоол тодорхойгүй үед та илүү идэх хандлагатай юу?

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

**Answer options for S1-G01**

- Үгүй
- Ховор
- Заримдаа
- Ихэвчлэн
- Маш хүчтэй

## COPY-0483 — P2

**Exact current text**

> Дараагийн хоол тодорхойгүй үед та илүү идэх хандлагатай юу?

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
- Source line: 346
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-G01", module: "Hunger-safety", type: "single", text: "Дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байдаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["hungerSafety"], "Ихэвчлэн": ["hungerSafety"], "Маш хүчтэй": ["hungerSafety"] } },

**Source item**

> { id: "S1-G02", module: "Hunger-safety", type: "single", text: "Дараагийн хоол тодорхойгүй үед та илүү идэх хандлагатай юу?", options: ["Үгүй", "Ховор", "Заримдаа", "Тийм", "Маш тод"], scores: { "Заримдаа": ["hungerSafety"], "Тийм": ["hungerSafety"], "Маш тод": ["hungerSafety"] } },

**Source context after**

> { id: "S1-G03", module: "Hunger-safety", type: "single", text: "Хоол үлдээхэд танд хэр хэцүү байдаг вэ?", options: ["Хэцүү биш", "Заримдаа", "Нэлээд хэцүү", "Маш хэцүү", "Анзаарч байгаагүй"], scores: { "Нэлээд хэцүү": ["hungerSafety"], "Маш хэцүү": ["hungerSafety"] } },

**Rendered context**

> Дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байдаг уу?
> Дараагийн хоол тодорхойгүй үед та илүү идэх хандлагатай юу?
> Хоол үлдээхэд танд хэр хэцүү байдаг вэ?

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

**Answer options for S1-G02**

- Үгүй
- Ховор
- Заримдаа
- Тийм
- Маш тод

## COPY-0484 — P2

**Exact current text**

> Хоол үлдээхэд танд хэр хэцүү байдаг вэ?

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
- Source line: 347
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-G02", module: "Hunger-safety", type: "single", text: "Дараагийн хоол тодорхойгүй үед та илүү идэх хандлагатай юу?", options: ["Үгүй", "Ховор", "Заримдаа", "Тийм", "Маш тод"], scores: { "Заримдаа": ["hungerSafety"], "Тийм": ["hungerSafety"], "Маш тод": ["hungerSafety"] } },

**Source item**

> { id: "S1-G03", module: "Hunger-safety", type: "single", text: "Хоол үлдээхэд танд хэр хэцүү байдаг вэ?", options: ["Хэцүү биш", "Заримдаа", "Нэлээд хэцүү", "Маш хэцүү", "Анзаарч байгаагүй"], scores: { "Нэлээд хэцүү": ["hungerSafety"], "Маш хэцүү": ["hungerSafety"] } },

**Source context after**

> { id: "S1-X01", module: "Restriction response", type: "single", text: "Хоолоо огцом багасгах үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?", options: ["Тайван", "Өлсөхөөс санаа зовдог", "Уур хүрдэг", "Идэх юм их бодогддог", "Бие сулрах вий гэж айдаг", "Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог"], scores: { "Өлсөхөөс санаа зовдог": ["hungerSafety"], "Уур хүрдэг": ["autonomy"], "Уур/эсэргүүцэл": ["autonomy"], "Идэх юм их бодогддог": ["reward"], "Идэх юм бодогдоно": ["reward"], "Бие сулрах вий гэж айдаг": ["physiological"], "Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог": ["collapse"], "Хэсэг сайн яваад дараа нь үргэлжлэхээ больдог": ["collapse"], "Хэсэг сайн яваад дараа нь нурдаг": ["collapse"] } },

**Rendered context**

> Дараагийн хоол тодорхойгүй үед та илүү идэх хандлагатай юу?
> Хоол үлдээхэд танд хэр хэцүү байдаг вэ?
> Хоолоо огцом багасгах үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?

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

**Answer options for S1-G03**

- Хэцүү биш
- Заримдаа
- Нэлээд хэцүү
- Маш хэцүү
- Анзаарч байгаагүй
