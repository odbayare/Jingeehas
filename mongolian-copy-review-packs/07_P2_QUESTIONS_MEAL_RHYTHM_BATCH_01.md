# P2 Questions — MEAL_RHYTHM — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0723 — P2

**Exact current text**

> Энгийн өдөр хоолны хэмнэл тань ихэвчлэн ямар байдаг вэ?

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
- Source line: 338
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-W06", module: "Past attempts", type: "single", text: "Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?", options: ["Дараагийн хоолноосоо хэвийн үргэлжлүүлье гэж боддог", "Өнөөдөр нэгэнт өнгөрлөө, маргаашаас эхэлье гэж боддог", "Маргааш илүү чанга барина гэж боддог", "Би ер нь чаддаггүй юм байна гэж боддог", "Одоо бүх юм нурчихлаа гэж санагддаг", "Тодорхой бодол төрдөггүй", "Надад хоолны дэглэм гэж тодорхой зүйл байдаггүй"], scores: { "Өнөөдөр нэгэнт өнгөрлөө, маргаашаас эхэлье гэж боддог": ["collapse"], "Маргааш илүү чанга барина гэж боддог": ["collapse"], "Би ер нь чаддаггүй юм байна гэж боддог": ["collapse", "identity"], "Одоо бүх юм нурчихлаа гэж санагддаг": ["collapse"] } },

**Source item**

> { id: "S1-M01", module: "Meal rhythm", type: "single", text: "Энгийн өдөр хоолны хэмнэл тань ихэвчлэн ямар байдаг вэ?", options: ["2-3 удаа тогтмол хооллодог", "Өглөөний хоол алгасдаг", "Өдрийн хоол алгасдаг", "Өдөр бага идээд орой нөхдөг", "Хоолны цаг өдөр бүр өөр", "Тодорхой хэмнэл байхгүй"], scores: { "Өглөөний хоол алгасдаг": ["hungerSafety", "circadian"], "Өглөө алгасах": ["hungerSafety", "circadian"], "Өдрийн хоол алгасдаг": ["hungerSafety", "executive"], "Өдрийн хоол алгасах": ["hungerSafety", "executive"], "Өдөр бага идээд орой нөхдөг": ["hungerSafety", "circadian"], "Өдөр бага идээд орой нөхөх": ["hungerSafety", "circadian"], "Хоолны цаг өдөр бүр өөр": ["executive"], "Хоолны цаг өөр": ["executive"] } },

**Source context after**

> { id: "S1-M02", module: "Meal rhythm", type: "single", text: "Хоолны хооронд 5+ цагийн зай гарах нь хэр олон вэ?", options: ["Бараг үгүй", "7 хоногт 1-2", "3-4", "Бараг өдөр бүр", "Мэдэхгүй"], scores: { "3-4": ["hungerSafety"], "Бараг өдөр бүр": ["hungerSafety", "glucose"] } },

**Rendered context**

> Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?
> Энгийн өдөр хоолны хэмнэл тань ихэвчлэн ямар байдаг вэ?
> Хоолны хооронд 5+ цагийн зай гарах нь хэр олон вэ?

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

**Answer options for S1-M01**

- 2-3 удаа тогтмол хооллодог
- Өглөөний хоол алгасдаг
- Өдрийн хоол алгасдаг
- Өдөр бага идээд орой нөхдөг
- Хоолны цаг өдөр бүр өөр
- Тодорхой хэмнэл байхгүй

## COPY-0724 — P2

**Exact current text**

> Хоолны хооронд 5+ цагийн зай гарах нь хэр олон вэ?

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
- Source line: 339
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-M01", module: "Meal rhythm", type: "single", text: "Энгийн өдөр хоолны хэмнэл тань ихэвчлэн ямар байдаг вэ?", options: ["2-3 удаа тогтмол хооллодог", "Өглөөний хоол алгасдаг", "Өдрийн хоол алгасдаг", "Өдөр бага идээд орой нөхдөг", "Хоолны цаг өдөр бүр өөр", "Тодорхой хэмнэл байхгүй"], scores: { "Өглөөний хоол алгасдаг": ["hungerSafety", "circadian"], "Өглөө алгасах": ["hungerSafety", "circadian"], "Өдрийн хоол алгасдаг": ["hungerSafety", "executive"], "Өдрийн хоол алгасах": ["hungerSafety", "executive"], "Өдөр бага идээд орой нөхдөг": ["hungerSafety", "circadian"], "Өдөр бага идээд орой нөхөх": ["hungerSafety", "circadian"], "Хоолны цаг өдөр бүр өөр": ["executive"], "Хоолны цаг өөр": ["executive"] } },

**Source item**

> { id: "S1-M02", module: "Meal rhythm", type: "single", text: "Хоолны хооронд 5+ цагийн зай гарах нь хэр олон вэ?", options: ["Бараг үгүй", "7 хоногт 1-2", "3-4", "Бараг өдөр бүр", "Мэдэхгүй"], scores: { "3-4": ["hungerSafety"], "Бараг өдөр бүр": ["hungerSafety", "glucose"] } },

**Source context after**

> { id: "S1-M03", module: "Meal rhythm", type: "single", text: "Өдөр хоол алгассан эсвэл оройтсон үед орой идэхээ барихад хэцүү болдог уу?", options: ["Бараг нөлөөлдөггүй", "Заримдаа нөлөөлдөг", "Нэлээд нөлөөлдөг", "Бараг дандаа тэгдэг", "Анзаарч байгаагүй"], scores: { "Нэлээд нөлөөлдөг": ["hungerSafety", "circadian"], "Их нэмэгддэг": ["hungerSafety", "circadian"], "Бараг дандаа тэгдэг": ["hungerSafety", "collapse"], "Хянахад хэцүү": ["hungerSafety", "collapse"] } },

**Rendered context**

> Энгийн өдөр хоолны хэмнэл тань ихэвчлэн ямар байдаг вэ?
> Хоолны хооронд 5+ цагийн зай гарах нь хэр олон вэ?
> Өдөр хоол алгассан эсвэл оройтсон үед орой идэхээ барихад хэцүү болдог уу?

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

**Answer options for S1-M02**

- Бараг үгүй
- 7 хоногт 1-2
- 3-4
- Бараг өдөр бүр
- Мэдэхгүй

## COPY-0725 — P2

**Exact current text**

> Өдөр хоол алгассан эсвэл оройтсон үед орой идэхээ барихад хэцүү болдог уу?

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
- Source line: 340
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-M02", module: "Meal rhythm", type: "single", text: "Хоолны хооронд 5+ цагийн зай гарах нь хэр олон вэ?", options: ["Бараг үгүй", "7 хоногт 1-2", "3-4", "Бараг өдөр бүр", "Мэдэхгүй"], scores: { "3-4": ["hungerSafety"], "Бараг өдөр бүр": ["hungerSafety", "glucose"] } },

**Source item**

> { id: "S1-M03", module: "Meal rhythm", type: "single", text: "Өдөр хоол алгассан эсвэл оройтсон үед орой идэхээ барихад хэцүү болдог уу?", options: ["Бараг нөлөөлдөггүй", "Заримдаа нөлөөлдөг", "Нэлээд нөлөөлдөг", "Бараг дандаа тэгдэг", "Анзаарч байгаагүй"], scores: { "Нэлээд нөлөөлдөг": ["hungerSafety", "circadian"], "Их нэмэгддэг": ["hungerSafety", "circadian"], "Бараг дандаа тэгдэг": ["hungerSafety", "collapse"], "Хянахад хэцүү": ["hungerSafety", "collapse"] } },

**Source context after**

> { id: "S1-H01", module: "Hunger & satiety", type: "single", text: "Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?", options: ["Амархан мэдэрдэг", "Заримдаа мэдэрдэг", "Сайн ялгадаггүй", "Цадсан ч үргэлжлүүлдэг", "Хэт өлстлөө хүлээгээд хэтрүүлдэг"], scores: { "Сайн ялгадаггүй": ["satiety"], "Сайн мэддэггүй": ["satiety"], "Цадсан ч үргэлжлүүлдэг": ["satiety", "reward"], "Хэт өлстлөө хүлээгээд хэтрүүлдэг": ["hungerSafety", "glucose"] } },

**Rendered context**

> Хоолны хооронд 5+ цагийн зай гарах нь хэр олон вэ?
> Өдөр хоол алгассан эсвэл оройтсон үед орой идэхээ барихад хэцүү болдог уу?
> Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ?

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

**Answer options for S1-M03**

- Бараг нөлөөлдөггүй
- Заримдаа нөлөөлдөг
- Нэлээд нөлөөлдөг
- Бараг дандаа тэгдэг
- Анзаарч байгаагүй
