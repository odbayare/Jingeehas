# P0 Safety Critical — Batch 03

Evidence only. Current copy is quoted verbatim; no replacement wording is proposed or approved.

## COPY-0552 — P0

**Exact current text**

> Аюулгүй ашиглах сануулга

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: PROFESSIONAL_SAFETY
- Role: PAID_USER
- Scenario: professional-safety
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderReport via professional-safety [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Аюулгүй байдлын сануулга
> Аюулгүй ашиглах сануулга
> Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна.

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0553 — P0

**Exact current text**

> Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна.

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: PROFESSIONAL_SAFETY
- Role: PAID_USER
- Scenario: professional-safety
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 7375
- Source function/object: buildRuntimeVisibleSurfacePayload
- Source mapping: RESOLVED
- Render proof: renderReport via professional-safety [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> ? "Энэ үед жин хасах туршилт хийхээс өмнө ганцаараа үлдэхгүй, ойрын итгэдэг хүнтэйгээ холбогдох нь чухал."

**Source item**

> : "Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна."

**Source context after**

> }

**Rendered context**

> Аюулгүй ашиглах сануулга
> Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна.

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0554 — P0

**Exact current text**

> Яаралтай аюулгүй байдлын зөвлөмж

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: URGENT_SAFETY
- Role: PUBLIC_USER
- Scenario: urgent-mode-4
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 3492
- Source function/object: reportMode
- Source mapping: RESOLVED
- Render proof: renderReport via urgent-mode-4 [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> const flags = calculateSafetyFlags().map(flag => flag.split(":")[1]);

**Source item**

> if (flags.includes("urgent")) return { mode: "urgent", title: "Яаралтай аюулгүй байдлын зөвлөмж" };

**Source context after**

> if (flags.includes("professional")) return { mode: "professional", title: "Эхлээд мэргэжлийн хүнтэй ярилцах" };

**Rendered context**

> Яаралтай аюулгүй байдлын зөвлөмж
> Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал.

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0555 — P0

**Exact current text**

> Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал.

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: URGENT_SAFETY
- Role: PUBLIC_USER
- Scenario: urgent-mode-4
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 7589
- Source function/object: renderReport
- Source mapping: RESOLVED
- Render proof: renderReport via urgent-mode-4 [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> <div class="panel stack">

**Source item**

> <h2>Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал.</h2>

**Source context after**

> <p class="danger-copy">Өөртөө хор хүргэх бодол, ухаан балартах, будилах, эсвэл огцом бие муудах шинж гарсан байж болзошгүй. Тийм үед энэ үнэлгээ энгийн жин хасалтын тайлан үзүүлэхгүй.</p>

**Rendered context**

> Яаралтай аюулгүй байдлын зөвлөмж
> Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал.
> Өөртөө хор хүргэх бодол, ухаан балартах, будилах, эсвэл огцом бие муудах шинж гарсан байж болзошгүй. Тийм үед энэ үнэлгээ энгийн жин хасалтын тайлан үзүүлэхгүй.

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0556 — P0

**Exact current text**

> Өөртөө хор хүргэх бодол, ухаан балартах, будилах, эсвэл огцом бие муудах шинж гарсан байж болзошгүй. Тийм үед энэ үнэлгээ энгийн жин хасалтын тайлан үзүүлэхгүй.

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: URGENT_SAFETY
- Role: PUBLIC_USER
- Scenario: urgent-mode-4
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 7590
- Source function/object: renderReport
- Source mapping: RESOLVED
- Render proof: renderReport via urgent-mode-4 [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> <h2>Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал.</h2>

**Source item**

> <p class="danger-copy">Өөртөө хор хүргэх бодол, ухаан балартах, будилах, эсвэл огцом бие муудах шинж гарсан байж болзошгүй. Тийм үед энэ үнэлгээ энгийн жин хасалтын тайлан үзүүлэхгүй.</p>

**Source context after**

> <p>Ганцаараа битгий үлдээрэй. Итгэдэг хүн рүүгээ яг одоо холбогдоорой. Эсвэл тухайн газрын яаралтай тусламжийн дугаар руу залгаж, эмнэлгийн байгууллагад хандана уу.</p>

**Rendered context**

> Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал.
> Өөртөө хор хүргэх бодол, ухаан балартах, будилах, эсвэл огцом бие муудах шинж гарсан байж болзошгүй. Тийм үед энэ үнэлгээ энгийн жин хасалтын тайлан үзүүлэхгүй.
> Ганцаараа битгий үлдээрэй. Итгэдэг хүн рүүгээ яг одоо холбогдоорой. Эсвэл тухайн газрын яаралтай тусламжийн дугаар руу залгаж, эмнэлгийн байгууллагад хандана уу.

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0557 — P0

**Exact current text**

> Ганцаараа битгий үлдээрэй. Итгэдэг хүн рүүгээ яг одоо холбогдоорой. Эсвэл тухайн газрын яаралтай тусламжийн дугаар руу залгаж, эмнэлгийн байгууллагад хандана уу.

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: URGENT_SAFETY
- Role: PUBLIC_USER
- Scenario: urgent-mode-4
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 7591
- Source function/object: renderReport
- Source mapping: RESOLVED
- Render proof: renderReport via urgent-mode-4 [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> <p class="danger-copy">Өөртөө хор хүргэх бодол, ухаан балартах, будилах, эсвэл огцом бие муудах шинж гарсан байж болзошгүй. Тийм үед энэ үнэлгээ энгийн жин хасалтын тайлан үзүүлэхгүй.</p>

**Source item**

> <p>Ганцаараа битгий үлдээрэй. Итгэдэг хүн рүүгээ яг одоо холбогдоорой. Эсвэл тухайн газрын яаралтай тусламжийн дугаар руу залгаж, эмнэлгийн байгууллагад хандана уу.</p>

**Source context after**

> <button class="button secondary" onclick="resetState()">Шинээр эхлэх</button>

**Rendered context**

> Өөртөө хор хүргэх бодол, ухаан балартах, будилах, эсвэл огцом бие муудах шинж гарсан байж болзошгүй. Тийм үед энэ үнэлгээ энгийн жин хасалтын тайлан үзүүлэхгүй.
> Ганцаараа битгий үлдээрэй. Итгэдэг хүн рүүгээ яг одоо холбогдоорой. Эсвэл тухайн газрын яаралтай тусламжийн дугаар руу залгаж, эмнэлгийн байгууллагад хандана уу.
> Шинээр эхлэх

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0558 — P0

**Exact current text**

> Шинээр эхлэх

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: URGENT_SAFETY
- Role: PUBLIC_USER
- Scenario: urgent-mode-4
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderReport via urgent-mode-4 [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Ганцаараа битгий үлдээрэй. Итгэдэг хүн рүүгээ яг одоо холбогдоорой. Эсвэл тухайн газрын яаралтай тусламжийн дугаар руу залгаж, эмнэлгийн байгууллагад хандана уу.
> Шинээр эхлэх
> Аюулгүй байдлын сануулга

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0559 — P0

**Exact current text**

> Аюулгүй байдлын сануулга

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: URGENT_SAFETY
- Role: PUBLIC_USER
- Scenario: urgent-mode-4
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderReport via urgent-mode-4 [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Шинээр эхлэх
> Аюулгүй байдлын сануулга
> Аюулгүй ашиглах сануулга

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0560 — P0

**Exact current text**

> Аюулгүй ашиглах сануулга

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: URGENT_SAFETY
- Role: PUBLIC_USER
- Scenario: urgent-mode-4
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderReport via urgent-mode-4 [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Аюулгүй байдлын сануулга
> Аюулгүй ашиглах сануулга
> Энэ үед жин хасах туршилт хийхээс өмнө ганцаараа үлдэхгүй, ойрын итгэдэг хүнтэйгээ холбогдох нь чухал.

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0561 — P0

**Exact current text**

> Энэ үед жин хасах туршилт хийхээс өмнө ганцаараа үлдэхгүй, ойрын итгэдэг хүнтэйгээ холбогдох нь чухал.

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: URGENT_SAFETY
- Role: PUBLIC_USER
- Scenario: urgent-mode-4
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 7374
- Source function/object: buildRuntimeVisibleSurfacePayload
- Source mapping: RESOLVED
- Render proof: renderReport via urgent-mode-4 [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> body: mode === "urgent"

**Source item**

> ? "Энэ үед жин хасах туршилт хийхээс өмнө ганцаараа үлдэхгүй, ойрын итгэдэг хүнтэйгээ холбогдох нь чухал."

**Source context after**

> : "Хоолоо хүчээр хасах, удаан өлсөх, өөрийгөө буруутгах хэлбэрээр энэ тайланг ашиглахгүй. Бие тавгүйрхвэл туршилтаа зогсоож тусламж авна."

**Rendered context**

> Аюулгүй ашиглах сануулга
> Энэ үед жин хасах туршилт хийхээс өмнө ганцаараа үлдэхгүй, ойрын итгэдэг хүнтэйгээ холбогдох нь чухал.

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0610 — P0

**Exact current text**

> Үгүй

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: OTHER_PROVEN_RENDERED
- Role: INTERNAL_TESTER
- Scenario: internal-feedback-survey
- Render source: renderInternalTesterFeedbackSurvey with internalTest state
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 5
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderInternalTesterFeedbackSurvey with internalTest state via internal-feedback-survey [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Тест бөглөх явцад эвгүй, ичмээр, шүүсэн мэдрэмж төрсөн үү?
> Үгүй
> Бага зэрэг

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0612 — P0

**Exact current text**

> Тийм

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: OTHER_PROVEN_RENDERED
- Role: INTERNAL_TESTER
- Scenario: internal-feedback-survey
- Render source: renderInternalTesterFeedbackSurvey with internalTest state
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 5
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderInternalTesterFeedbackSurvey with internalTest state via internal-feedback-survey [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Бага зэрэг
> Тийм
> Аль хэсэг дээр?

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0760 — P0

**Exact current text**

> Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 375
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

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0761 — P0

**Exact current text**

> Та сахар эсвэл даралтаа хэмжиж үзсэн үү?

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 376
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

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0762 — P0

**Exact current text**

> Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү?

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 377
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

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0763 — P0

**Exact current text**

> Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 378
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

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0764 — P0

**Exact current text**

> Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 379
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

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0777 — P0

**Exact current text**

> Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: QUESTION_BANK
- Role: PUBLIC_USER
- Scenario: question-bank
- Render source: stageOneQuestions consumed by renderStageOne
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 392
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-S03", module: "Safety", type: "single", text: "Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?", options: ["Үгүй", "Өмнө байсан", "Одоо хааяа", "Одоо давтагддаг", "Хариулахгүй"], safety: value => ["Одоо хааяа", "Одоо давтагддаг"].includes(value) ? ["professional"] : [] },

**Source item**

> { id: "S1-S04", module: "Safety", type: "single", text: "Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?", options: ["Үгүй", "Өнгөрсөнд байсан", "Одоо хааяа бодогддог", "Одоо идэвхтэй бодогдож байна", "Хариулахгүй"], safety: value => value === "Одоо идэвхтэй бодогдож байна" ? ["urgent"] : value === "Одоо хааяа бодогддог" ? ["professional"] : [] },

**Source context after**

> {

**Rendered context**

> Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?
> Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?
> Жингээ бууруулах эсвэл жингээ барихын тулд өмнө туршсан нэг арга тань яагаад удаан үргэлжлээгүй вэ?

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0783 — P0

**Exact current text**

> Хариулахгүй

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: ANSWER_OPTIONS
- Role: PUBLIC_USER
- Scenario: answer-options
- Render source: stageOneQuestions/dailyCore consumed by renderInput
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 25
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: stageOneQuestions/dailyCore consumed by renderInput via answer-options [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Өөрөөр тодорхойлно
> Хариулахгүй
> Ихэнхдээ суугаа ажил

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0891 — P0

**Exact current text**

> Үгүй

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: ANSWER_OPTIONS
- Role: PUBLIC_USER
- Scenario: answer-options
- Render source: stageOneQuestions/dailyCore consumed by renderInput
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 21
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: stageOneQuestions/dailyCore consumed by renderInput via answer-options [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Надад хэмжээг нь барихад онц хэцүү хүнс байдаггүй
> Үгүй
> Тийм, гурилан бүтээгдэхүүн

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0914 — P0

**Exact current text**

> Мэдэхгүй

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: ANSWER_OPTIONS
- Role: PUBLIC_USER
- Scenario: answer-options
- Render source: stageOneQuestions/dailyCore consumed by renderInput
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 12
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: stageOneQuestions/dailyCore consumed by renderInput via answer-options [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Буурсан
> Мэдэхгүй
> Ажил ихсэж, стресс нэмэгдсэн

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-1074 — P0

**Exact current text**

> Тийм

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: ANSWER_OPTIONS
- Role: PUBLIC_USER
- Scenario: answer-options
- Render source: stageOneQuestions/dailyCore consumed by renderInput
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 3
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: stageOneQuestions/dailyCore consumed by renderInput via answer-options [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Маш хүчтэй
> Тийм
> Маш тод

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-1114 — P0

**Exact current text**

> Аль нь ч үгүй

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: ANSWER_OPTIONS
- Role: PUBLIC_USER
- Scenario: answer-options
- Render source: stageOneQuestions/dailyCore consumed by renderInput
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 4
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: stageOneQuestions/dailyCore consumed by renderInput via answer-options [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан
> Аль нь ч үгүй
> Гар салгалах

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-1115 — P0

**Exact current text**

> Гар салгалах

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: ANSWER_OPTIONS
- Role: PUBLIC_USER
- Scenario: answer-options
- Render source: stageOneQuestions/dailyCore consumed by renderInput
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: stageOneQuestions/dailyCore consumed by renderInput via answer-options [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Аль нь ч үгүй
> Гар салгалах
> Зүрх дэлсэх

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-1116 — P0

**Exact current text**

> Зүрх дэлсэх

**Classification**

- Priority: P0
- Review group: safety
- Structural signal: Safety-critical routing or interpretation text.
- Surface: ANSWER_OPTIONS
- Role: PUBLIC_USER
- Scenario: answer-options
- Render source: stageOneQuestions/dailyCore consumed by renderInput
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: stageOneQuestions/dailyCore consumed by renderInput via answer-options [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Гар салгалах
> Зүрх дэлсэх
> Хөлрөх

**Dynamic values**

- None

**Reason included**

Safety-critical routing or interpretation text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:
