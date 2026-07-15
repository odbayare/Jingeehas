# P2 Questions — SLEEP_ENERGY — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0498 — P2

**Exact current text**

> Сүүлийн үед дундаж нойр тань ямар байна вэ?

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
- Source line: 357
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-L05", module: "Environment", type: "single", text: "Хоолны зураг, үнэр, эсвэл захиалгын апп харахад идэх хүсэл гэнэт нэмэгддэг үү?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["cue", "reward"], "Ихэвчлэн": ["cue", "reward"], "Маш хүчтэй": ["cue", "reward"] } },

**Source item**

> { id: "S1-N01", module: "Sleep / energy", type: "single", text: "Сүүлийн үед дундаж нойр тань ямар байна вэ?", options: ["4 цагаас бага", "4-6 цаг", "6-8 цаг", "8+ цаг", "Чанар муу", "Тогтворгүй"], scores: { "4 цагаас бага": ["circadian", "medical"], "4-6 цаг": ["circadian"], "Чанар муу": ["circadian"], "Тогтворгүй": ["circadian"] } },

**Source context after**

> { id: "S1-N02", module: "Sleep / energy", type: "single", text: "Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш тод"], scores: { "Заримдаа": ["circadian", "reward"], "Ихэвчлэн": ["circadian", "reward"], "Маш тод": ["circadian", "reward"] } },

**Rendered context**

> Хоолны зураг, үнэр, эсвэл захиалгын апп харахад идэх хүсэл гэнэт нэмэгддэг үү?
> Сүүлийн үед дундаж нойр тань ямар байна вэ?
> Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?

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

**Answer options for S1-N01**

- 4 цагаас бага
- 4-6 цаг
- 6-8 цаг
- 8+ цаг
- Чанар муу
- Тогтворгүй

## COPY-0499 — P2

**Exact current text**

> Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?

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
- Source line: 358
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-N01", module: "Sleep / energy", type: "single", text: "Сүүлийн үед дундаж нойр тань ямар байна вэ?", options: ["4 цагаас бага", "4-6 цаг", "6-8 цаг", "8+ цаг", "Чанар муу", "Тогтворгүй"], scores: { "4 цагаас бага": ["circadian", "medical"], "4-6 цаг": ["circadian"], "Чанар муу": ["circadian"], "Тогтворгүй": ["circadian"] } },

**Source item**

> { id: "S1-N02", module: "Sleep / energy", type: "single", text: "Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш тод"], scores: { "Заримдаа": ["circadian", "reward"], "Ихэвчлэн": ["circadian", "reward"], "Маш тод": ["circadian", "reward"] } },

**Source context after**

> { id: "S1-N03", module: "Sleep / energy", type: "multi", text: "Хурхиралт, өдөр нойрмоглох, өглөө ядрах шинж байна уу?", options: ["Хурхирдаг", "Өдөр нойрмоглодог", "Өглөө ядруу сэрдэг", "Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан", "Аль нь ч үгүй", "Мэдэхгүй"], scores: { "Хурхирдаг": ["medical", "circadian"], "Өдөр нойрмоглодог": ["medical", "circadian"], "Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан": ["medical"], "Амьсгал тасалдах мэт хэлж байсан": ["medical"] } },

**Rendered context**

> Сүүлийн үед дундаж нойр тань ямар байна вэ?
> Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?
> Хурхиралт, өдөр нойрмоглох, өглөө ядрах шинж байна уу?

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

**Answer options for S1-N02**

- Үгүй
- Ховор
- Заримдаа
- Ихэвчлэн
- Маш тод

## COPY-0500 — P2

**Exact current text**

> Хурхиралт, өдөр нойрмоглох, өглөө ядрах шинж байна уу?

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
- Source line: 359
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-N02", module: "Sleep / energy", type: "single", text: "Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш тод"], scores: { "Заримдаа": ["circadian", "reward"], "Ихэвчлэн": ["circadian", "reward"], "Маш тод": ["circadian", "reward"] } },

**Source item**

> { id: "S1-N03", module: "Sleep / energy", type: "multi", text: "Хурхиралт, өдөр нойрмоглох, өглөө ядрах шинж байна уу?", options: ["Хурхирдаг", "Өдөр нойрмоглодог", "Өглөө ядруу сэрдэг", "Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан", "Аль нь ч үгүй", "Мэдэхгүй"], scores: { "Хурхирдаг": ["medical", "circadian"], "Өдөр нойрмоглодог": ["medical", "circadian"], "Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан": ["medical"], "Амьсгал тасалдах мэт хэлж байсан": ["medical"] } },

**Source context after**

> { id: "S1-B01", module: "Body / medical", type: "multi", text: "Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?", options: ["Гар салгалах", "Зүрх дэлсэх", "Хөлрөх", "Толгой эргэх", "Толгой өвдөх", "Сахар унасан мэт", "Будилах/ухаан балартах", "Аль нь ч үгүй"], scores: { "Гар салгалах": ["physiological"], "Зүрх дэлсэх": ["physiological"], "Хөлрөх": ["physiological"], "Толгой эргэх": ["physiological"], "Толгой өвдөх": ["physiological"], "Сахар унасан мэт": ["glucose", "physiological"], "Будилах/ухаан балартах": ["glucose", "medical"] }, safety: values => values.includes("Будилах/ухаан балартах") ? ["urgent"] : [] },

**Rendered context**

> Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу?
> Хурхиралт, өдөр нойрмоглох, өглөө ядрах шинж байна уу?
> Хоол хоорондын зай уртсах үед дараах шинжүүдээс аль нь илэрдэг вэ?

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

**Answer options for S1-N03**

- Хурхирдаг
- Өдөр нойрмоглодог
- Өглөө ядруу сэрдэг
- Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан
- Аль нь ч үгүй
- Мэдэхгүй
