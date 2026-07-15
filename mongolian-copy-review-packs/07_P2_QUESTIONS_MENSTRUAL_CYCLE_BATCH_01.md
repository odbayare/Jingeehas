# P2 Questions — MENSTRUAL_CYCLE — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0765 — P2

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
- Source line: 380
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

## COPY-0766 — P2

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
- Source line: 381
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

## COPY-0767 — P2

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
- Source line: 382
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

## COPY-0768 — P2

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
- Source line: 383
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

## COPY-0769 — P2

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
- Source line: 384
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

## COPY-0770 — P2

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
- Source line: 385
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

## COPY-0771 — P2

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
- Source line: 386
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

## COPY-0772 — P2

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
- Source line: 387
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

## COPY-0773 — P2

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
- Source line: 388
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

## D-MC-01 — P2

**Exact current text**

> Өнөөдөр мөчлөгийнхөө аль үедээ байгаа гэж бодож байна?

**Answer options**

- Сарын тэмдэг ирж байна
- Дууссанаас хойш эхний өдрүүд
- Овуляцийн орчим гэж бодож байна
- Ирэхээс өмнөх өдрүүд
- Мэдэхгүй
- Хамаарахгүй

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-MC-01**

- Сарын тэмдэг ирж байна
- Дууссанаас хойш эхний өдрүүд
- Овуляцийн орчим гэж бодож байна
- Ирэхээс өмнөх өдрүүд
- Мэдэхгүй
- Хамаарахгүй

## D-MC-02 — P2

**Exact current text**

> Өнөөдрийн идэх хүсэл мөчлөгтэй холбоотой юм шиг санагдсан уу?

**Answer options**

- Үгүй
- Бага зэрэг
- Тийм, илүү өлссөн
- Тийм, амттай юм илүү хүссэн
- Тийм, сэтгэл санаатай хамт хүчтэй болсон
- Тийм, ядаргаа/нойртой давхцсан

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-MC-02**

- Үгүй
- Бага зэрэг
- Тийм, илүү өлссөн
- Тийм, амттай юм илүү хүссэн
- Тийм, сэтгэл санаатай хамт хүчтэй болсон
- Тийм, ядаргаа/нойртой давхцсан

## D-MC-03 — P2

**Exact current text**

> Өнөөдөр өвдөлт, хавагналт, ядаргаа, нойр муудах зэрэг нь хоолны сонголтод нөлөөлсөн үү?

**Answer options**

- Үгүй
- Бага зэрэг
- Дунд зэрэг
- Их

**Source mapping**

UNRESOLVED

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

**Answer options for D-MC-03**

- Үгүй
- Бага зэрэг
- Дунд зэрэг
- Их
