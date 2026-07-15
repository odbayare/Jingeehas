# P2 Questions — MENSTRUAL_CYCLE — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0502 — P2

**Exact current text**

> Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?

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
- Source line: 365
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-B05", module: "Body / medical", type: "single", text: "Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?", options: ["Үгүй", "Жирэмсэн", "Төрсний дараах 0-6 сар", "Төрсний дараах 6-24 сар", "Хөхүүл", "Хариулахгүй"], scores: { "Жирэмсэн": ["medical"], "Төрсний дараах 0-6 сар": ["medical"], "Төрсний дараах 6-24 сар": ["medical"], "Хөхүүл": ["medical"] }, safety: value => ["Жирэмсэн", "Төрсний дараах 0-6 сар", "Хөхүүл"].includes(value) ? ["professional"] : [] },

**Source item**

> { id: "MC-GATE", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?", intro: "Зарим хүний өлсөх мэдрэмж, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа сарын тэмдгийн мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Энэ нь оношлох гэсэн асуулт биш. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно.", options: [MENSTRUAL_GATE_YES, "Үгүй, хамаарахгүй", "Хариулахгүй"] },

**Source context after**

> { id: "MC-INTRO", module: MENSTRUAL_CONTEXT_MODULE, type: "info", text: "Дараагийн хэдэн асуулт сарын тэмдгийн мөчлөгтэй холбоотой. Зарим хүний хоолны дуршил, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно." },

**Rendered context**

> Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу?
> Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?
> Дараагийн хэдэн асуулт сарын тэмдгийн мөчлөгтэй холбоотой. Зарим хүний хоолны дуршил, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно.

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

**Answer options for MC-GATE**

- Тийм, хамаарна
- Үгүй, хамаарахгүй
- Хариулахгүй

## COPY-0503 — P2

**Exact current text**

> Дараагийн хэдэн асуулт сарын тэмдгийн мөчлөгтэй холбоотой. Зарим хүний хоолны дуршил, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно.

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
- Source line: 366
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "MC-GATE", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?", intro: "Зарим хүний өлсөх мэдрэмж, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа сарын тэмдгийн мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Энэ нь оношлох гэсэн асуулт биш. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно.", options: [MENSTRUAL_GATE_YES, "Үгүй, хамаарахгүй", "Хариулахгүй"] },

**Source item**

> { id: "MC-INTRO", module: MENSTRUAL_CONTEXT_MODULE, type: "info", text: "Дараагийн хэдэн асуулт сарын тэмдгийн мөчлөгтэй холбоотой. Зарим хүний хоолны дуршил, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно." },

**Source context after**

> { id: "MC-01", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?", options: ["Тогтмол, ойролцоогоор 21–35 хоног", "Заримдаа зөрдөг", "Ихэнхдээ тогтмол биш", "Сүүлийн 3 сард ирээгүй", "Мэдэхгүй", "Хариулахгүй"] },

**Rendered context**

> Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу?
> Дараагийн хэдэн асуулт сарын тэмдгийн мөчлөгтэй холбоотой. Зарим хүний хоолны дуршил, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно.
> Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?

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

**Answer options for MC-INTRO**

- None

## COPY-0504 — P2

**Exact current text**

> Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?

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
- Source line: 367
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "MC-INTRO", module: MENSTRUAL_CONTEXT_MODULE, type: "info", text: "Дараагийн хэдэн асуулт сарын тэмдгийн мөчлөгтэй холбоотой. Зарим хүний хоолны дуршил, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно." },

**Source item**

> { id: "MC-01", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?", options: ["Тогтмол, ойролцоогоор 21–35 хоног", "Заримдаа зөрдөг", "Ихэнхдээ тогтмол биш", "Сүүлийн 3 сард ирээгүй", "Мэдэхгүй", "Хариулахгүй"] },

**Source context after**

> { id: "MC-02", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ?", options: ["Өнөөдөр–5 хоногийн дотор", "6–13 хоногийн өмнө", "14–17 хоногийн өмнө", "18–28 хоногийн өмнө", "28 хоногоос дээш", "Сайн мэдэхгүй", "Хариулахгүй"] },

**Rendered context**

> Дараагийн хэдэн асуулт сарын тэмдгийн мөчлөгтэй холбоотой. Зарим хүний хоолны дуршил, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно.
> Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?
> Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ?

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

**Answer options for MC-01**

- Тогтмол, ойролцоогоор 21–35 хоног
- Заримдаа зөрдөг
- Ихэнхдээ тогтмол биш
- Сүүлийн 3 сард ирээгүй
- Мэдэхгүй
- Хариулахгүй

## COPY-0505 — P2

**Exact current text**

> Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ?

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
- Source line: 368
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "MC-01", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?", options: ["Тогтмол, ойролцоогоор 21–35 хоног", "Заримдаа зөрдөг", "Ихэнхдээ тогтмол биш", "Сүүлийн 3 сард ирээгүй", "Мэдэхгүй", "Хариулахгүй"] },

**Source item**

> { id: "MC-02", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ?", options: ["Өнөөдөр–5 хоногийн дотор", "6–13 хоногийн өмнө", "14–17 хоногийн өмнө", "18–28 хоногийн өмнө", "28 хоногоос дээш", "Сайн мэдэхгүй", "Хариулахгүй"] },

**Source context after**

> { id: "MC-03", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ?", options: ["Мөчлөгтэй холбоо анзаардаггүй", "Сарын тэмдэг ирэхээс хэд хоногийн өмнө", "Сарын тэмдэг ирж байх үед", "Сарын тэмдэг дууссаны дараах өдрүүдэд", "Овуляцийн орчим гэж боддог", "Тодорхой биш", "Хариулахгүй"] },

**Rendered context**

> Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ?
> Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ?
> Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ?

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

**Answer options for MC-02**

- Өнөөдөр–5 хоногийн дотор
- 6–13 хоногийн өмнө
- 14–17 хоногийн өмнө
- 18–28 хоногийн өмнө
- 28 хоногоос дээш
- Сайн мэдэхгүй
- Хариулахгүй

## COPY-0506 — P2

**Exact current text**

> Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ?

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
- Source line: 369
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "MC-02", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ?", options: ["Өнөөдөр–5 хоногийн дотор", "6–13 хоногийн өмнө", "14–17 хоногийн өмнө", "18–28 хоногийн өмнө", "28 хоногоос дээш", "Сайн мэдэхгүй", "Хариулахгүй"] },

**Source item**

> { id: "MC-03", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ?", options: ["Мөчлөгтэй холбоо анзаардаггүй", "Сарын тэмдэг ирэхээс хэд хоногийн өмнө", "Сарын тэмдэг ирж байх үед", "Сарын тэмдэг дууссаны дараах өдрүүдэд", "Овуляцийн орчим гэж боддог", "Тодорхой биш", "Хариулахгүй"] },

**Source context after**

> { id: "MC-04", module: MENSTRUAL_CONTEXT_MODULE, type: "multi", text: "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ?", options: ["Илүү өлсдөг", "Амттай юм, гурилан зүйл илүү хүсдэг", "Давслаг, шарсан зүйл илүү хүсдэг", "Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг", "Ядаргаа, нойр муудахтай давхцдаг", "Хавагнах эсвэл бие хүнд оргих мэдрэмж нэмэгддэг", "Онц ялгаа анзаардаггүй", "Хариулахгүй"], max: 3 },

**Rendered context**

> Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ?
> Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ?
> Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ?

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

**Answer options for MC-03**

- Мөчлөгтэй холбоо анзаардаггүй
- Сарын тэмдэг ирэхээс хэд хоногийн өмнө
- Сарын тэмдэг ирж байх үед
- Сарын тэмдэг дууссаны дараах өдрүүдэд
- Овуляцийн орчим гэж боддог
- Тодорхой биш
- Хариулахгүй

## COPY-0507 — P2

**Exact current text**

> Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ?

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
- Source line: 370
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "MC-03", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ?", options: ["Мөчлөгтэй холбоо анзаардаггүй", "Сарын тэмдэг ирэхээс хэд хоногийн өмнө", "Сарын тэмдэг ирж байх үед", "Сарын тэмдэг дууссаны дараах өдрүүдэд", "Овуляцийн орчим гэж боддог", "Тодорхой биш", "Хариулахгүй"] },

**Source item**

> { id: "MC-04", module: MENSTRUAL_CONTEXT_MODULE, type: "multi", text: "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ?", options: ["Илүү өлсдөг", "Амттай юм, гурилан зүйл илүү хүсдэг", "Давслаг, шарсан зүйл илүү хүсдэг", "Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг", "Ядаргаа, нойр муудахтай давхцдаг", "Хавагнах эсвэл бие хүнд оргих мэдрэмж нэмэгддэг", "Онц ялгаа анзаардаггүй", "Хариулахгүй"], max: 3 },

**Source context after**

> { id: "MC-05", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ?", options: ["Өөрчлөгддөггүй", "Жаахан нэмэгддэг", "Нэлээд нэмэгддэг", "Ойр ойрхон идмээр болдог", "Өвдөлт, дотор муухайралтаас болоод багасдаг", "Тодорхой хэлж мэдэхгүй", "Хариулахгүй"] },

**Rendered context**

> Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ?
> Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ?
> Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ?

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

**Answer options for MC-04**

- Илүү өлсдөг
- Амттай юм, гурилан зүйл илүү хүсдэг
- Давслаг, шарсан зүйл илүү хүсдэг
- Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг
- Ядаргаа, нойр муудахтай давхцдаг
- Хавагнах эсвэл бие хүнд оргих мэдрэмж нэмэгддэг
- Онц ялгаа анзаардаггүй
- Хариулахгүй

## COPY-0508 — P2

**Exact current text**

> Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ?

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
- Source line: 371
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "MC-04", module: MENSTRUAL_CONTEXT_MODULE, type: "multi", text: "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ?", options: ["Илүү өлсдөг", "Амттай юм, гурилан зүйл илүү хүсдэг", "Давслаг, шарсан зүйл илүү хүсдэг", "Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг", "Ядаргаа, нойр муудахтай давхцдаг", "Хавагнах эсвэл бие хүнд оргих мэдрэмж нэмэгддэг", "Онц ялгаа анзаардаггүй", "Хариулахгүй"], max: 3 },

**Source item**

> { id: "MC-05", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ?", options: ["Өөрчлөгддөггүй", "Жаахан нэмэгддэг", "Нэлээд нэмэгддэг", "Ойр ойрхон идмээр болдог", "Өвдөлт, дотор муухайралтаас болоод багасдаг", "Тодорхой хэлж мэдэхгүй", "Хариулахгүй"] },

**Source context after**

> { id: "MC-06", module: MENSTRUAL_CONTEXT_MODULE, type: "multi", text: "Та одоогоор дараахаас аль нэгэнд хамаарах уу?", options: ["Дааврын жирэмслэлтээс хамгаалах хэрэгсэл хэрэглэдэг", "PCOS оноштой эсвэл сэжигтэй", "Төрсний дараах эсвэл хөхүүл үе", "Перименопауз байж магадгүй", "Аль нь ч биш", "Хариулахгүй"], max: 2 },

**Rendered context**

> Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ?
> Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ?
> Та одоогоор дараахаас аль нэгэнд хамаарах уу?

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

**Answer options for MC-05**

- Өөрчлөгддөггүй
- Жаахан нэмэгддэг
- Нэлээд нэмэгддэг
- Ойр ойрхон идмээр болдог
- Өвдөлт, дотор муухайралтаас болоод багасдаг
- Тодорхой хэлж мэдэхгүй
- Хариулахгүй

## COPY-0509 — P2

**Exact current text**

> Та одоогоор дараахаас аль нэгэнд хамаарах уу?

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
- Source line: 372
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "MC-05", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ?", options: ["Өөрчлөгддөггүй", "Жаахан нэмэгддэг", "Нэлээд нэмэгддэг", "Ойр ойрхон идмээр болдог", "Өвдөлт, дотор муухайралтаас болоод багасдаг", "Тодорхой хэлж мэдэхгүй", "Хариулахгүй"] },

**Source item**

> { id: "MC-06", module: MENSTRUAL_CONTEXT_MODULE, type: "multi", text: "Та одоогоор дараахаас аль нэгэнд хамаарах уу?", options: ["Дааврын жирэмслэлтээс хамгаалах хэрэгсэл хэрэглэдэг", "PCOS оноштой эсвэл сэжигтэй", "Төрсний дараах эсвэл хөхүүл үе", "Перименопауз байж магадгүй", "Аль нь ч биш", "Хариулахгүй"], max: 2 },

**Source context after**

> { id: "MC-07", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Мөчлөг тогтмол бус болох, ирэхээ болих, эсвэл их өөрчлөгдөх нь хоол хасалт, жин огцом буурах, эсвэл хэт их дасгалтай давхцаж байсан уу?", options: ["Тийм", "Үгүй", "Сайн мэдэхгүй", "Хариулахгүй"] },

**Rendered context**

> Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ?
> Та одоогоор дараахаас аль нэгэнд хамаарах уу?
> Мөчлөг тогтмол бус болох, ирэхээ болих, эсвэл их өөрчлөгдөх нь хоол хасалт, жин огцом буурах, эсвэл хэт их дасгалтай давхцаж байсан уу?

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

**Answer options for MC-06**

- Дааврын жирэмслэлтээс хамгаалах хэрэгсэл хэрэглэдэг
- PCOS оноштой эсвэл сэжигтэй
- Төрсний дараах эсвэл хөхүүл үе
- Перименопауз байж магадгүй
- Аль нь ч биш
- Хариулахгүй

## COPY-0510 — P2

**Exact current text**

> Мөчлөг тогтмол бус болох, ирэхээ болих, эсвэл их өөрчлөгдөх нь хоол хасалт, жин огцом буурах, эсвэл хэт их дасгалтай давхцаж байсан уу?

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
- Source line: 373
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "MC-06", module: MENSTRUAL_CONTEXT_MODULE, type: "multi", text: "Та одоогоор дараахаас аль нэгэнд хамаарах уу?", options: ["Дааврын жирэмслэлтээс хамгаалах хэрэгсэл хэрэглэдэг", "PCOS оноштой эсвэл сэжигтэй", "Төрсний дараах эсвэл хөхүүл үе", "Перименопауз байж магадгүй", "Аль нь ч биш", "Хариулахгүй"], max: 2 },

**Source item**

> { id: "MC-07", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Мөчлөг тогтмол бус болох, ирэхээ болих, эсвэл их өөрчлөгдөх нь хоол хасалт, жин огцом буурах, эсвэл хэт их дасгалтай давхцаж байсан уу?", options: ["Тийм", "Үгүй", "Сайн мэдэхгүй", "Хариулахгүй"] },

**Source context after**

> { id: "S1-S01", module: "Safety", type: "single", text: "Идэх үедээ хяналтаа алдсан мэт мэдрэмж хүчтэй гардаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] }, safety: value => ["Ихэвчлэн", "Маш хүчтэй"].includes(value) ? ["professional"] : [] },

**Rendered context**

> Та одоогоор дараахаас аль нэгэнд хамаарах уу?
> Мөчлөг тогтмол бус болох, ирэхээ болих, эсвэл их өөрчлөгдөх нь хоол хасалт, жин огцом буурах, эсвэл хэт их дасгалтай давхцаж байсан уу?
> Идэх үедээ хяналтаа алдсан мэт мэдрэмж хүчтэй гардаг уу?

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

**Answer options for MC-07**

- Тийм
- Үгүй
- Сайн мэдэхгүй
- Хариулахгүй
