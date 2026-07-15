# P2 Questions — BODY_MEDICAL — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0480 — P2

**Exact current text**

> Танд бодитоор тогтмол хийж болох хөдөлгөөн аль нь вэ?

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
- Source line: 343
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-T02", module: "Согтууруулах ундаа ба тамхи", type: "multi", text: "Тамхи таны хоолны дуршил, зууш идэх хүсэл, кофе эсвэл стрессийн хэмнэлтэй холбоотой санагддаг уу?", options: ["Холбоо анзаардаггүй", "Тамхи татах үед хоол багасдаг", "Тамхи татахгүй үед идэх хүсэл нэмэгддэг", "Тамхинаас гарах үед хоолны дуршил нэмэгдсэн", "Стресстэй үед тамхи, кофе, зууш хамт давхцдаг", "Сайн мэдэхгүй"], max: 2, scores: { "Тамхи татах үед хоол багасдаг": ["regulation"], "Тамхи татахгүй үед идэх хүсэл нэмэгддэг": ["reward", "regulation"], "Тамхинаас гарах үед хоолны дуршил нэмэгдсэн": ["reward", "regulation"], "Стресстэй үед тамхи, кофе, зууш хамт давхцдаг": ["regulation", "circadian", "cue"] } },

**Source item**

> { id: "S1-MV01", module: "Хөдөлгөөний боломж", type: "multi", text: "Танд бодитоор тогтмол хийж болох хөдөлгөөн аль нь вэ?", options: ["Алхалт", "Фитнес / хүчний дасгал", "Гэрийн дасгал", "Иог / сунгалт", "Усанд сэлэх", "Дугуй / спиннинг", "Бүжиг / хөдөлгөөнтэй хичээл", "Багийн спорт", "Одоогоор хөдөлгөөн эхлүүлэхэд хэцүү байна", "Сайн мэдэхгүй"], max: 3, scores: { "Одоогоор хөдөлгөөн эхлүүлэхэд хэцүү байна": ["executive", "medical"] } },

**Source context after**

> { id: "S1-MV02", module: "Хөдөлгөөний боломж", type: "single", text: "Хөдөлгөөн тогтмол хийхэд танд хамгийн их саад болдог зүйл юу вэ?", options: ["Цаг гарахгүй байх", "Ядаргаа", "Хаанаас эхлэхээ мэдэхгүй байх", "Бие өвдөх / тавгүй байх", "Гэр бүл, ажил, хүүхдийн ачаалал", "Мөнгө / орчин / байрлал", "Ганцаараа эхлэхэд хэцүү", "Өмнө эхлээд тасалдсан болохоор итгэлгүй байгаа", "Одоогоор хөдөлгөөнөөс илүү хоол/нойроо эхэлж цэгцлэх хэрэгтэй санагдаж байна"], scores: { "Цаг гарахгүй байх": ["executive"], "Ядаргаа": ["executive", "circadian"], "Хаанаас эхлэхээ мэдэхгүй байх": ["executive"], "Бие өвдөх / тавгүй байх": ["medical"], "Гэр бүл, ажил, хүүхдийн ачаалал": ["roleOverload", "executive"], "Ганцаараа эхлэхэд хэцүү": ["social"], "Өмнө эхлээд тасалдсан болохоор итгэлгүй байгаа": ["collapse", "identity"], "Одоогоор хөдөлгөөнөөс илүү хоол/нойроо эхэлж цэгцлэх хэрэгтэй санагдаж байна": ["circadian", "hungerSafety"] } },

**Rendered context**

> Тамхи таны хоолны дуршил, зууш идэх хүсэл, кофе эсвэл стрессийн хэмнэлтэй холбоотой санагддаг уу?
> Танд бодитоор тогтмол хийж болох хөдөлгөөн аль нь вэ?
> Хөдөлгөөн тогтмол хийхэд танд хамгийн их саад болдог зүйл юу вэ?

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

**Answer options for S1-MV01**

- Алхалт
- Фитнес / хүчний дасгал
- Гэрийн дасгал
- Иог / сунгалт
- Усанд сэлэх
- Дугуй / спиннинг
- Бүжиг / хөдөлгөөнтэй хичээл
- Багийн спорт
- Одоогоор хөдөлгөөн эхлүүлэхэд хэцүү байна
- Сайн мэдэхгүй

## COPY-0481 — P2

**Exact current text**

> Хөдөлгөөн тогтмол хийхэд танд хамгийн их саад болдог зүйл юу вэ?

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
- Source line: 344
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-MV01", module: "Хөдөлгөөний боломж", type: "multi", text: "Танд бодитоор тогтмол хийж болох хөдөлгөөн аль нь вэ?", options: ["Алхалт", "Фитнес / хүчний дасгал", "Гэрийн дасгал", "Иог / сунгалт", "Усанд сэлэх", "Дугуй / спиннинг", "Бүжиг / хөдөлгөөнтэй хичээл", "Багийн спорт", "Одоогоор хөдөлгөөн эхлүүлэхэд хэцүү байна", "Сайн мэдэхгүй"], max: 3, scores: { "Одоогоор хөдөлгөөн эхлүүлэхэд хэцүү байна": ["executive", "medical"] } },

**Source item**

> { id: "S1-MV02", module: "Хөдөлгөөний боломж", type: "single", text: "Хөдөлгөөн тогтмол хийхэд танд хамгийн их саад болдог зүйл юу вэ?", options: ["Цаг гарахгүй байх", "Ядаргаа", "Хаанаас эхлэхээ мэдэхгүй байх", "Бие өвдөх / тавгүй байх", "Гэр бүл, ажил, хүүхдийн ачаалал", "Мөнгө / орчин / байрлал", "Ганцаараа эхлэхэд хэцүү", "Өмнө эхлээд тасалдсан болохоор итгэлгүй байгаа", "Одоогоор хөдөлгөөнөөс илүү хоол/нойроо эхэлж цэгцлэх хэрэгтэй санагдаж байна"], scores: { "Цаг гарахгүй байх": ["executive"], "Ядаргаа": ["executive", "circadian"], "Хаанаас эхлэхээ мэдэхгүй байх": ["executive"], "Бие өвдөх / тавгүй байх": ["medical"], "Гэр бүл, ажил, хүүхдийн ачаалал": ["roleOverload", "executive"], "Ганцаараа эхлэхэд хэцүү": ["social"], "Өмнө эхлээд тасалдсан болохоор итгэлгүй байгаа": ["collapse", "identity"], "Одоогоор хөдөлгөөнөөс илүү хоол/нойроо эхэлж цэгцлэх хэрэгтэй санагдаж байна": ["circadian", "hungerSafety"] } },

**Source context after**

> { id: "S1-G01", module: "Hunger-safety", type: "single", text: "Дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байдаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["hungerSafety"], "Ихэвчлэн": ["hungerSafety"], "Маш хүчтэй": ["hungerSafety"] } },

**Rendered context**

> Танд бодитоор тогтмол хийж болох хөдөлгөөн аль нь вэ?
> Хөдөлгөөн тогтмол хийхэд танд хамгийн их саад болдог зүйл юу вэ?
> Дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байдаг уу?

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

**Answer options for S1-MV02**

- Цаг гарахгүй байх
- Ядаргаа
- Хаанаас эхлэхээ мэдэхгүй байх
- Бие өвдөх / тавгүй байх
- Гэр бүл, ажил, хүүхдийн ачаалал
- Мөнгө / орчин / байрлал
- Ганцаараа эхлэхэд хэцүү
- Өмнө эхлээд тасалдсан болохоор итгэлгүй байгаа
- Одоогоор хөдөлгөөнөөс илүү хоол/нойроо эхэлж цэгцлэх хэрэгтэй санагдаж байна

## COPY-0497 — P2

**Exact current text**

> Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?

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
- Source line: 360
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-N03", module: "Sleep / energy", type: "multi", text: "Хурхиралт, өдөр нойрмоглох, өглөө ядрах шинж байна уу?", options: ["Хурхирдаг", "Өдөр нойрмоглодог", "Өглөө ядруу сэрдэг", "Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан", "Аль нь ч үгүй", "Мэдэхгүй"], scores: { "Хурхирдаг": ["medical", "circadian"], "Өдөр нойрмоглодог": ["medical", "circadian"], "Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан": ["medical"], "Амьсгал тасалдах мэт хэлж байсан": ["medical"] } },

**Source item**

> { id: "S1-B01", module: "Body / medical", type: "multi", text: "Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?", options: ["Гар салгалах", "Зүрх дэлсэх", "Хөлрөх", "Толгой эргэх", "Толгой өвдөх", "Сахар унасан мэт", "Будилах/ухаан балартах", "Аль нь ч үгүй"], scores: { "Гар салгалах": ["physiological"], "Зүрх дэлсэх": ["physiological"], "Хөлрөх": ["physiological"], "Толгой эргэх": ["physiological"], "Толгой өвдөх": ["physiological"], "Сахар унасан мэт": ["glucose", "physiological"], "Будилах/ухаан балартах": ["glucose", "medical"] }, safety: values => values.includes("Будилах/ухаан балартах") ? ["urgent"] : [] },

**Source context after**

> { id: "S1-B02", module: "Body / medical", type: "single", text: "Та сахар эсвэл даралтаа хэмжиж үзсэн үү?", options: ["Үгүй", "Тийм, хэвийн", "Тийм, бага сахар гарч байсан", "Тийм, өндөр даралт гарч байсан", "Тийм, санаа зовоосон"], scores: { "Тийм, бага сахар гарч байсан": ["glucose", "medical"], "Тийм, өндөр даралт гарч байсан": ["medical"], "Тийм, санаа зовоосон": ["medical"] }, safety: value => ["Тийм, бага сахар гарч байсан", "Тийм, санаа зовоосон"].includes(value) ? ["professional"] : [] },

**Rendered context**

> Хурхиралт, өдөр нойрмоглох, өглөө ядрах шинж байна уу?
> Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?
> Та сахар эсвэл даралтаа хэмжиж үзсэн үү?

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

**Answer options for S1-B01**

- Гар салгалах
- Зүрх дэлсэх
- Хөлрөх
- Толгой эргэх
- Толгой өвдөх
- Сахар унасан мэт
- Будилах/ухаан балартах
- Аль нь ч үгүй

## COPY-0498 — P2

**Exact current text**

> Та сахар эсвэл даралтаа хэмжиж үзсэн үү?

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
- Source line: 361
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-B01", module: "Body / medical", type: "multi", text: "Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?", options: ["Гар салгалах", "Зүрх дэлсэх", "Хөлрөх", "Толгой эргэх", "Толгой өвдөх", "Сахар унасан мэт", "Будилах/ухаан балартах", "Аль нь ч үгүй"], scores: { "Гар салгалах": ["physiological"], "Зүрх дэлсэх": ["physiological"], "Хөлрөх": ["physiological"], "Толгой эргэх": ["physiological"], "Толгой өвдөх": ["physiological"], "Сахар унасан мэт": ["glucose", "physiological"], "Будилах/ухаан балартах": ["glucose", "medical"] }, safety: values => values.includes("Будилах/ухаан балартах") ? ["urgent"] : [] },

**Source item**

> { id: "S1-B02", module: "Body / medical", type: "single", text: "Та сахар эсвэл даралтаа хэмжиж үзсэн үү?", options: ["Үгүй", "Тийм, хэвийн", "Тийм, бага сахар гарч байсан", "Тийм, өндөр даралт гарч байсан", "Тийм, санаа зовоосон"], scores: { "Тийм, бага сахар гарч байсан": ["glucose", "medical"], "Тийм, өндөр даралт гарч байсан": ["medical"], "Тийм, санаа зовоосон": ["medical"] }, safety: value => ["Тийм, бага сахар гарч байсан", "Тийм, санаа зовоосон"].includes(value) ? ["professional"] : [] },

**Source context after**

> { id: "S1-B03", module: "Body / medical", type: "single", text: "Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү?", options: ["Үгүй", "Тийм", "Мэдэхгүй"], scores: { "Тийм": ["glucose", "medical"] }, safety: value => value === "Тийм" ? ["professional"] : [] },

**Rendered context**

> Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?
> Та сахар эсвэл даралтаа хэмжиж үзсэн үү?
> Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү?

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

**Answer options for S1-B02**

- Үгүй
- Тийм, хэвийн
- Тийм, бага сахар гарч байсан
- Тийм, өндөр даралт гарч байсан
- Тийм, санаа зовоосон

## COPY-0499 — P2

**Exact current text**

> Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү?

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
- Source line: 362
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-B02", module: "Body / medical", type: "single", text: "Та сахар эсвэл даралтаа хэмжиж үзсэн үү?", options: ["Үгүй", "Тийм, хэвийн", "Тийм, бага сахар гарч байсан", "Тийм, өндөр даралт гарч байсан", "Тийм, санаа зовоосон"], scores: { "Тийм, бага сахар гарч байсан": ["glucose", "medical"], "Тийм, өндөр даралт гарч байсан": ["medical"], "Тийм, санаа зовоосон": ["medical"] }, safety: value => ["Тийм, бага сахар гарч байсан", "Тийм, санаа зовоосон"].includes(value) ? ["professional"] : [] },

**Source item**

> { id: "S1-B03", module: "Body / medical", type: "single", text: "Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү?", options: ["Үгүй", "Тийм", "Мэдэхгүй"], scores: { "Тийм": ["glucose", "medical"] }, safety: value => value === "Тийм" ? ["professional"] : [] },

**Source context after**

> { id: "S1-B04", module: "Body / medical", type: "multi", text: "Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?", options: ["Огцом жин нэмсэн", "Хавагнадаг", "Амьсгааддаг", "Маш их ядардаг", "Аль нь ч үгүй"], scores: { "Огцом жин нэмсэн": ["medical"], "Хавагнадаг": ["medical"], "Амьсгааддаг": ["medical"], "Маш их ядардаг": ["medical"] }, safety: values => values.some(v => ["Огцом жин нэмсэн", "Хавагнадаг", "Амьсгааддаг"].includes(v)) ? ["professional"] : [] },

**Rendered context**

> Та сахар эсвэл даралтаа хэмжиж үзсэн үү?
> Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү?
> Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?

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

**Answer options for S1-B03**

- Үгүй
- Тийм
- Мэдэхгүй

## COPY-0500 — P2

**Exact current text**

> Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?

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
- Source line: 363
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-B03", module: "Body / medical", type: "single", text: "Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү?", options: ["Үгүй", "Тийм", "Мэдэхгүй"], scores: { "Тийм": ["glucose", "medical"] }, safety: value => value === "Тийм" ? ["professional"] : [] },

**Source item**

> { id: "S1-B04", module: "Body / medical", type: "multi", text: "Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?", options: ["Огцом жин нэмсэн", "Хавагнадаг", "Амьсгааддаг", "Маш их ядардаг", "Аль нь ч үгүй"], scores: { "Огцом жин нэмсэн": ["medical"], "Хавагнадаг": ["medical"], "Амьсгааддаг": ["medical"], "Маш их ядардаг": ["medical"] }, safety: values => values.some(v => ["Огцом жин нэмсэн", "Хавагнадаг", "Амьсгааддаг"].includes(v)) ? ["professional"] : [] },

**Source context after**

> { id: "S1-B05", module: "Body / medical", type: "single", text: "Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?", options: ["Үгүй", "Жирэмсэн", "Төрсний дараах 0-6 сар", "Төрсний дараах 6-24 сар", "Хөхүүл", "Хариулахгүй"], scores: { "Жирэмсэн": ["medical"], "Төрсний дараах 0-6 сар": ["medical"], "Төрсний дараах 6-24 сар": ["medical"], "Хөхүүл": ["medical"] }, safety: value => ["Жирэмсэн", "Төрсний дараах 0-6 сар", "Хөхүүл"].includes(value) ? ["professional"] : [] },

**Rendered context**

> Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү?
> Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?
> Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?

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

**Answer options for S1-B04**

- Огцом жин нэмсэн
- Хавагнадаг
- Амьсгааддаг
- Маш их ядардаг
- Аль нь ч үгүй

## COPY-0501 — P2

**Exact current text**

> Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?

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
- Source line: 364
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-B04", module: "Body / medical", type: "multi", text: "Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?", options: ["Огцом жин нэмсэн", "Хавагнадаг", "Амьсгааддаг", "Маш их ядардаг", "Аль нь ч үгүй"], scores: { "Огцом жин нэмсэн": ["medical"], "Хавагнадаг": ["medical"], "Амьсгааддаг": ["medical"], "Маш их ядардаг": ["medical"] }, safety: values => values.some(v => ["Огцом жин нэмсэн", "Хавагнадаг", "Амьсгааддаг"].includes(v)) ? ["professional"] : [] },

**Source item**

> { id: "S1-B05", module: "Body / medical", type: "single", text: "Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?", options: ["Үгүй", "Жирэмсэн", "Төрсний дараах 0-6 сар", "Төрсний дараах 6-24 сар", "Хөхүүл", "Хариулахгүй"], scores: { "Жирэмсэн": ["medical"], "Төрсний дараах 0-6 сар": ["medical"], "Төрсний дараах 6-24 сар": ["medical"], "Хөхүүл": ["medical"] }, safety: value => ["Жирэмсэн", "Төрсний дараах 0-6 сар", "Хөхүүл"].includes(value) ? ["professional"] : [] },

**Source context after**

> { id: "MC-GATE", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?", intro: "Зарим хүний өлсөх мэдрэмж, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа сарын тэмдгийн мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Энэ нь оношлох гэсэн асуулт биш. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно.", options: [MENSTRUAL_GATE_YES, "Үгүй, хамаарахгүй", "Хариулахгүй"] },

**Rendered context**

> Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?
> Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?
> Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?

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

**Answer options for S1-B05**

- Үгүй
- Жирэмсэн
- Төрсний дараах 0-6 сар
- Төрсний дараах 6-24 сар
- Хөхүүл
- Хариулахгүй
