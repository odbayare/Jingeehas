# P2 Questions — WEIGHT_HISTORY — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0458 — P2

**Exact current text**

> Сүүлийн 12 сарын хугацаанд таны жин хэр өөрчлөгдсөн бэ?

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
- Source line: 317
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-C06", module: "Basic context", type: "multi", text: "Жин бууруулах хүсэл тань өдөр тутмын амьдралын юутай хамгийн их холбоотой вэ?", options: ["Эрүүл мэнддээ анхаарах", "Өдрийн тэнхээ нэмэх", "Хувцсандаа тухтай байх", "Өөртөө итгэлтэй болох", "Гадаад төрхөө өөрчлөх", "Даралт, сахар, шинжилгээнд санаа зовсон", "Хөдлөхөд амар болох", "Төрсний дараа биеэ сэргээх", "Өөр зүйл"] },

**Source item**

> { id: "S1-W01", module: "Weight trajectory", type: "single", text: "Сүүлийн 12 сарын хугацаанд таны жин хэр өөрчлөгдсөн бэ?", options: ["Их өөрчлөгдөөгүй", "1-3 кг нэмсэн", "4-7 кг нэмсэн", "8+ кг нэмсэн", "Буурсан", "Мэдэхгүй"], scores: { "8+ кг нэмсэн": ["medical"], "4-7 кг нэмсэн": ["medical"] } },

**Source context after**

> { id: "S1-W02", module: "Weight trajectory", type: "multi", text: "Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ?", options: ["Ажил ихсэж, стресс нэмэгдсэн", "Хөдөлгөөн багассан", "Нойр муудсан", "Эм хэрэглэж эхэлсэн", "Жирэмсэн эсвэл төрсний дараах үе", "Өвчин, мэс засалтай давхацсан", "Сэтгэл санааны хүнд үе байсан", "Тодорхой зүйл байхгүй", "Мэдэхгүй"], scores: { "Ажил ихсэж, стресс нэмэгдсэн": ["regulation", "executive"], "Ажил-стресс": ["regulation", "executive"], "Хөдөлгөөн багассан": ["executive"], "Нойр муудсан": ["circadian"], "Эм хэрэглэж эхэлсэн": ["medical"], "Эм": ["medical"], "Жирэмсэн эсвэл төрсний дараах үе": ["medical"], "Жирэмсэн-төрсний дараа": ["medical"], "Өвчин, мэс засалтай давхацсан": ["medical"], "Өвчин-мэс засал": ["medical"] } },

**Rendered context**

> Жин бууруулах хүсэл тань өдөр тутмын амьдралын юутай хамгийн их холбоотой вэ?
> Сүүлийн 12 сарын хугацаанд таны жин хэр өөрчлөгдсөн бэ?
> Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ?

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

**Answer options for S1-W01**

- Их өөрчлөгдөөгүй
- 1-3 кг нэмсэн
- 4-7 кг нэмсэн
- 8+ кг нэмсэн
- Буурсан
- Мэдэхгүй

## COPY-0459 — P2

**Exact current text**

> Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ?

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
- Source line: 318
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-W01", module: "Weight trajectory", type: "single", text: "Сүүлийн 12 сарын хугацаанд таны жин хэр өөрчлөгдсөн бэ?", options: ["Их өөрчлөгдөөгүй", "1-3 кг нэмсэн", "4-7 кг нэмсэн", "8+ кг нэмсэн", "Буурсан", "Мэдэхгүй"], scores: { "8+ кг нэмсэн": ["medical"], "4-7 кг нэмсэн": ["medical"] } },

**Source item**

> { id: "S1-W02", module: "Weight trajectory", type: "multi", text: "Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ?", options: ["Ажил ихсэж, стресс нэмэгдсэн", "Хөдөлгөөн багассан", "Нойр муудсан", "Эм хэрэглэж эхэлсэн", "Жирэмсэн эсвэл төрсний дараах үе", "Өвчин, мэс засалтай давхацсан", "Сэтгэл санааны хүнд үе байсан", "Тодорхой зүйл байхгүй", "Мэдэхгүй"], scores: { "Ажил ихсэж, стресс нэмэгдсэн": ["regulation", "executive"], "Ажил-стресс": ["regulation", "executive"], "Хөдөлгөөн багассан": ["executive"], "Нойр муудсан": ["circadian"], "Эм хэрэглэж эхэлсэн": ["medical"], "Эм": ["medical"], "Жирэмсэн эсвэл төрсний дараах үе": ["medical"], "Жирэмсэн-төрсний дараа": ["medical"], "Өвчин, мэс засалтай давхацсан": ["medical"], "Өвчин-мэс засал": ["medical"] } },

**Source context after**

> { id: "S1-W03", module: "Past attempts", type: "single", text: "Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу?", options: ["Үгүй", "Нэг удаа", "Хэд хэдэн удаа", "Бараг бүх оролдлогоос хойш", "Санахгүй"], scores: { "Хэд хэдэн удаа": ["collapse"], "Бараг бүх оролдлогоос хойш": ["collapse", "hungerSafety"] } },

**Rendered context**

> Сүүлийн 12 сарын хугацаанд таны жин хэр өөрчлөгдсөн бэ?
> Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ?
> Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу?

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

**Answer options for S1-W02**

- Ажил ихсэж, стресс нэмэгдсэн
- Хөдөлгөөн багассан
- Нойр муудсан
- Эм хэрэглэж эхэлсэн
- Жирэмсэн эсвэл төрсний дараах үе
- Өвчин, мэс засалтай давхацсан
- Сэтгэл санааны хүнд үе байсан
- Тодорхой зүйл байхгүй
- Мэдэхгүй
