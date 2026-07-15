# P2 Questions — PRIOR_ATTEMPTS — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0460 — P2

**Exact current text**

> Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу?

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
- Source line: 319
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-W02", module: "Weight trajectory", type: "multi", text: "Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ?", options: ["Ажил ихсэж, стресс нэмэгдсэн", "Хөдөлгөөн багассан", "Нойр муудсан", "Эм хэрэглэж эхэлсэн", "Жирэмсэн эсвэл төрсний дараах үе", "Өвчин, мэс засалтай давхацсан", "Сэтгэл санааны хүнд үе байсан", "Тодорхой зүйл байхгүй", "Мэдэхгүй"], scores: { "Ажил ихсэж, стресс нэмэгдсэн": ["regulation", "executive"], "Ажил-стресс": ["regulation", "executive"], "Хөдөлгөөн багассан": ["executive"], "Нойр муудсан": ["circadian"], "Эм хэрэглэж эхэлсэн": ["medical"], "Эм": ["medical"], "Жирэмсэн эсвэл төрсний дараах үе": ["medical"], "Жирэмсэн-төрсний дараа": ["medical"], "Өвчин, мэс засалтай давхацсан": ["medical"], "Өвчин-мэс засал": ["medical"] } },

**Source item**

> { id: "S1-W03", module: "Past attempts", type: "single", text: "Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу?", options: ["Үгүй", "Нэг удаа", "Хэд хэдэн удаа", "Бараг бүх оролдлогоос хойш", "Санахгүй"], scores: { "Хэд хэдэн удаа": ["collapse"], "Бараг бүх оролдлогоос хойш": ["collapse", "hungerSafety"] } },

**Source context after**

> { id: "S1-W04", module: "Past attempts", type: "multi", text: "Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?", options: ["Хоолны хэмжээг багасгах", "Калори тоолох", "Нүүрс ус багасгах", "Орой хоол идэхгүй байх", "Завсарлагатай мацаг / мацаг барих", "Алхалт нэмэх", "Фитнес / хүчний дасгал", "Кардио дасгал", "Иог / сунгалтын дасгал", "Усанд сэлэх", "Дугуй / спиннинг", "Бүжиг / хөдөлгөөнтэй хичээл", "Гэрийн дасгал", "Багийн спорт", "Дасгалжуулагчтай хөтөлбөр", "Бүлгийн challenge / сургалт", "Хоол орлуулах бүтээгдэхүүн", "Эм, тариа, нэмэлт бүтээгдэхүүн", "Детокс / “цэвэрлэгээ” гэж нэрлэдэг арга", "Нойр, стрессээ засах гэж оролдсон", "Оролдож байгаагүй", "Өөр арга"], scores: { "Хоолны хэмжээг багасгах": ["hungerSafety"], "Калори тоолох": ["collapse"], "Нүүрс ус багасгах": ["hungerSafety"], "Орой хоол идэхгүй байх": ["hungerSafety"], "Завсарлагатай мацаг / мацаг барих": ["hungerSafety", "glucose"], "Хоол орлуулах бүтээгдэхүүн": ["hungerSafety"], "Эм, тариа, нэмэлт бүтээгдэхүүн": ["medical"], "Детокс / “цэвэрлэгээ” гэж нэрлэдэг арга": ["collapse", "hungerSafety"], "Нойр, стрессээ засах гэж оролдсон": ["circadian", "regulation"] } },

**Rendered context**

> Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ?
> Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу?
> Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?

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

**Answer options for S1-W03**

- Үгүй
- Нэг удаа
- Хэд хэдэн удаа
- Бараг бүх оролдлогоос хойш
- Санахгүй

## COPY-0461 — P2

**Exact current text**

> Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?

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
- Source line: 320
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-W03", module: "Past attempts", type: "single", text: "Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу?", options: ["Үгүй", "Нэг удаа", "Хэд хэдэн удаа", "Бараг бүх оролдлогоос хойш", "Санахгүй"], scores: { "Хэд хэдэн удаа": ["collapse"], "Бараг бүх оролдлогоос хойш": ["collapse", "hungerSafety"] } },

**Source item**

> { id: "S1-W04", module: "Past attempts", type: "multi", text: "Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?", options: ["Хоолны хэмжээг багасгах", "Калори тоолох", "Нүүрс ус багасгах", "Орой хоол идэхгүй байх", "Завсарлагатай мацаг / мацаг барих", "Алхалт нэмэх", "Фитнес / хүчний дасгал", "Кардио дасгал", "Иог / сунгалтын дасгал", "Усанд сэлэх", "Дугуй / спиннинг", "Бүжиг / хөдөлгөөнтэй хичээл", "Гэрийн дасгал", "Багийн спорт", "Дасгалжуулагчтай хөтөлбөр", "Бүлгийн challenge / сургалт", "Хоол орлуулах бүтээгдэхүүн", "Эм, тариа, нэмэлт бүтээгдэхүүн", "Детокс / “цэвэрлэгээ” гэж нэрлэдэг арга", "Нойр, стрессээ засах гэж оролдсон", "Оролдож байгаагүй", "Өөр арга"], scores: { "Хоолны хэмжээг багасгах": ["hungerSafety"], "Калори тоолох": ["collapse"], "Нүүрс ус багасгах": ["hungerSafety"], "Орой хоол идэхгүй байх": ["hungerSafety"], "Завсарлагатай мацаг / мацаг барих": ["hungerSafety", "glucose"], "Хоол орлуулах бүтээгдэхүүн": ["hungerSafety"], "Эм, тариа, нэмэлт бүтээгдэхүүн": ["medical"], "Детокс / “цэвэрлэгээ” гэж нэрлэдэг арга": ["collapse", "hungerSafety"], "Нойр, стрессээ засах гэж оролдсон": ["circadian", "regulation"] } },

**Source context after**

> { id: "S1-W05", module: "Past attempts", type: "text", text: "Туршиж үзсэн аргуудаас аль нь хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан бэ? Юу нь хамгийн их саад болсон бэ?", voice: true },

**Rendered context**

> Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу?
> Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?
> Туршиж үзсэн аргуудаас аль нь хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан бэ? Юу нь хамгийн их саад болсон бэ?

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

**Answer options for S1-W04**

- Хоолны хэмжээг багасгах
- Калори тоолох
- Нүүрс ус багасгах
- Орой хоол идэхгүй байх
- Завсарлагатай мацаг / мацаг барих
- Алхалт нэмэх
- Фитнес / хүчний дасгал
- Кардио дасгал
- Иог / сунгалтын дасгал
- Усанд сэлэх
- Дугуй / спиннинг
- Бүжиг / хөдөлгөөнтэй хичээл
- Гэрийн дасгал
- Багийн спорт
- Дасгалжуулагчтай хөтөлбөр
- Бүлгийн challenge / сургалт
- Хоол орлуулах бүтээгдэхүүн
- Эм, тариа, нэмэлт бүтээгдэхүүн
- Детокс / “цэвэрлэгээ” гэж нэрлэдэг арга
- Нойр, стрессээ засах гэж оролдсон
- Оролдож байгаагүй
- Өөр арга

## COPY-0462 — P2

**Exact current text**

> Туршиж үзсэн аргуудаас аль нь хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан бэ? Юу нь хамгийн их саад болсон бэ?

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
- Source line: 321
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-W04", module: "Past attempts", type: "multi", text: "Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?", options: ["Хоолны хэмжээг багасгах", "Калори тоолох", "Нүүрс ус багасгах", "Орой хоол идэхгүй байх", "Завсарлагатай мацаг / мацаг барих", "Алхалт нэмэх", "Фитнес / хүчний дасгал", "Кардио дасгал", "Иог / сунгалтын дасгал", "Усанд сэлэх", "Дугуй / спиннинг", "Бүжиг / хөдөлгөөнтэй хичээл", "Гэрийн дасгал", "Багийн спорт", "Дасгалжуулагчтай хөтөлбөр", "Бүлгийн challenge / сургалт", "Хоол орлуулах бүтээгдэхүүн", "Эм, тариа, нэмэлт бүтээгдэхүүн", "Детокс / “цэвэрлэгээ” гэж нэрлэдэг арга", "Нойр, стрессээ засах гэж оролдсон", "Оролдож байгаагүй", "Өөр арга"], scores: { "Хоолны хэмжээг багасгах": ["hungerSafety"], "Калори тоолох": ["collapse"], "Нүүрс ус багасгах": ["hungerSafety"], "Орой хоол идэхгүй байх": ["hungerSafety"], "Завсарлагатай мацаг / мацаг барих": ["hungerSafety", "glucose"], "Хоол орлуулах бүтээгдэхүүн": ["hungerSafety"], "Эм, тариа, нэмэлт бүтээгдэхүүн": ["medical"], "Детокс / “цэвэрлэгээ” гэж нэрлэдэг арга": ["collapse", "hungerSafety"], "Нойр, стрессээ засах гэж оролдсон": ["circadian", "regulation"] } },

**Source item**

> { id: "S1-W05", module: "Past attempts", type: "text", text: "Туршиж үзсэн аргуудаас аль нь хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан бэ? Юу нь хамгийн их саад болсон бэ?", voice: true },

**Source context after**

> { id: "S1-W06", module: "Past attempts", type: "single", text: "Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?", options: ["Дараагийн хоолноосоо хэвийн үргэлжлүүлье гэж боддог", "Өнөөдөр нэгэнт өнгөрлөө, маргаашаас эхэлье гэж боддог", "Маргааш илүү чанга барина гэж боддог", "Би ер нь чаддаггүй юм байна гэж боддог", "Одоо бүх юм нурчихлаа гэж санагддаг", "Тодорхой бодол төрдөггүй", "Надад хоолны дэглэм гэж тодорхой зүйл байдаггүй"], scores: { "Өнөөдөр нэгэнт өнгөрлөө, маргаашаас эхэлье гэж боддог": ["collapse"], "Маргааш илүү чанга барина гэж боддог": ["collapse"], "Би ер нь чаддаггүй юм байна гэж боддог": ["collapse", "identity"], "Одоо бүх юм нурчихлаа гэж санагддаг": ["collapse"] } },

**Rendered context**

> Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?
> Туршиж үзсэн аргуудаас аль нь хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан бэ? Юу нь хамгийн их саад болсон бэ?
> Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?

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

**Answer options for S1-W05**

- None

## COPY-0463 — P2

**Exact current text**

> Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?

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
- Source line: 322
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-W05", module: "Past attempts", type: "text", text: "Туршиж үзсэн аргуудаас аль нь хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан бэ? Юу нь хамгийн их саад болсон бэ?", voice: true },

**Source item**

> { id: "S1-W06", module: "Past attempts", type: "single", text: "Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?", options: ["Дараагийн хоолноосоо хэвийн үргэлжлүүлье гэж боддог", "Өнөөдөр нэгэнт өнгөрлөө, маргаашаас эхэлье гэж боддог", "Маргааш илүү чанга барина гэж боддог", "Би ер нь чаддаггүй юм байна гэж боддог", "Одоо бүх юм нурчихлаа гэж санагддаг", "Тодорхой бодол төрдөггүй", "Надад хоолны дэглэм гэж тодорхой зүйл байдаггүй"], scores: { "Өнөөдөр нэгэнт өнгөрлөө, маргаашаас эхэлье гэж боддог": ["collapse"], "Маргааш илүү чанга барина гэж боддог": ["collapse"], "Би ер нь чаддаггүй юм байна гэж боддог": ["collapse", "identity"], "Одоо бүх юм нурчихлаа гэж санагддаг": ["collapse"] } },

**Source context after**

> { id: "S1-M01", module: "Meal rhythm", type: "single", text: "Энгийн өдөр хоолны хэмнэл тань ихэвчлэн ямар байдаг вэ?", options: ["2-3 удаа тогтмол хооллодог", "Өглөөний хоол алгасдаг", "Өдрийн хоол алгасдаг", "Өдөр бага идээд орой нөхдөг", "Хоолны цаг өдөр бүр өөр", "Тодорхой хэмнэл байхгүй"], scores: { "Өглөөний хоол алгасдаг": ["hungerSafety", "circadian"], "Өглөө алгасах": ["hungerSafety", "circadian"], "Өдрийн хоол алгасдаг": ["hungerSafety", "executive"], "Өдрийн хоол алгасах": ["hungerSafety", "executive"], "Өдөр бага идээд орой нөхдөг": ["hungerSafety", "circadian"], "Өдөр бага идээд орой нөхөх": ["hungerSafety", "circadian"], "Хоолны цаг өдөр бүр өөр": ["executive"], "Хоолны цаг өөр": ["executive"] } },

**Rendered context**

> Туршиж үзсэн аргуудаас аль нь хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан бэ? Юу нь хамгийн их саад болсон бэ?
> Хоолны дэглэмээ зөрчсөн үед танд ихэвчлэн ямар бодол төрдөг вэ?
> Энгийн өдөр хоолны хэмнэл тань ихэвчлэн ямар байдаг вэ?

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

**Answer options for S1-W06**

- Дараагийн хоолноосоо хэвийн үргэлжлүүлье гэж боддог
- Өнөөдөр нэгэнт өнгөрлөө, маргаашаас эхэлье гэж боддог
- Маргааш илүү чанга барина гэж боддог
- Би ер нь чаддаггүй юм байна гэж боддог
- Одоо бүх юм нурчихлаа гэж санагддаг
- Тодорхой бодол төрдөггүй
- Надад хоолны дэглэм гэж тодорхой зүйл байдаггүй

## COPY-0489 — P2

**Exact current text**

> Хоолоо огцом багасгах үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?

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
- Source line: 348
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-G03", module: "Hunger-safety", type: "single", text: "Хоол үлдээхэд танд хэр хэцүү байдаг вэ?", options: ["Хэцүү биш", "Заримдаа", "Нэлээд хэцүү", "Маш хэцүү", "Анзаарч байгаагүй"], scores: { "Нэлээд хэцүү": ["hungerSafety"], "Маш хэцүү": ["hungerSafety"] } },

**Source item**

> { id: "S1-X01", module: "Restriction response", type: "single", text: "Хоолоо огцом багасгах үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?", options: ["Тайван", "Өлсөхөөс санаа зовдог", "Уур хүрдэг", "Идэх юм их бодогддог", "Бие сулрах вий гэж айдаг", "Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог"], scores: { "Өлсөхөөс санаа зовдог": ["hungerSafety"], "Уур хүрдэг": ["autonomy"], "Уур/эсэргүүцэл": ["autonomy"], "Идэх юм их бодогддог": ["reward"], "Идэх юм бодогдоно": ["reward"], "Бие сулрах вий гэж айдаг": ["physiological"], "Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог": ["collapse"], "Хэсэг сайн яваад дараа нь үргэлжлэхээ больдог": ["collapse"], "Хэсэг сайн яваад дараа нь нурдаг": ["collapse"] } },

**Source context after**

> { id: "S1-X02", module: "Restriction response", type: "single", text: "Хориглосон хоол улам их бодогдох үе байдаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Бараг үргэлж"], scores: { "Заримдаа": ["reward", "collapse"], "Ихэвчлэн": ["reward", "collapse"], "Бараг үргэлж": ["reward", "collapse"] } },

**Rendered context**

> Хоол үлдээхэд танд хэр хэцүү байдаг вэ?
> Хоолоо огцом багасгах үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?
> Хориглосон хоол улам их бодогдох үе байдаг уу?

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

**Answer options for S1-X01**

- Тайван
- Өлсөхөөс санаа зовдог
- Уур хүрдэг
- Идэх юм их бодогддог
- Бие сулрах вий гэж айдаг
- Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог

## COPY-0490 — P2

**Exact current text**

> Хориглосон хоол улам их бодогдох үе байдаг уу?

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
- Source line: 349
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-X01", module: "Restriction response", type: "single", text: "Хоолоо огцом багасгах үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?", options: ["Тайван", "Өлсөхөөс санаа зовдог", "Уур хүрдэг", "Идэх юм их бодогддог", "Бие сулрах вий гэж айдаг", "Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог"], scores: { "Өлсөхөөс санаа зовдог": ["hungerSafety"], "Уур хүрдэг": ["autonomy"], "Уур/эсэргүүцэл": ["autonomy"], "Идэх юм их бодогддог": ["reward"], "Идэх юм бодогдоно": ["reward"], "Бие сулрах вий гэж айдаг": ["physiological"], "Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог": ["collapse"], "Хэсэг сайн яваад дараа нь үргэлжлэхээ больдог": ["collapse"], "Хэсэг сайн яваад дараа нь нурдаг": ["collapse"] } },

**Source item**

> { id: "S1-X02", module: "Restriction response", type: "single", text: "Хориглосон хоол улам их бодогдох үе байдаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Бараг үргэлж"], scores: { "Заримдаа": ["reward", "collapse"], "Ихэвчлэн": ["reward", "collapse"], "Бараг үргэлж": ["reward", "collapse"] } },

**Source context after**

> { id: "S1-X03", module: "Restriction response", type: "single", text: "Нэг удаа хазайхаар ‘өнөөдөр өнгөрлөө’ гэж бодоод цааш нь тавьчихдаг уу?", options: ["Бараг үгүй", "Хааяа", "Нэлээд тэгдэг", "Ихэвчлэн тэгдэг", "Маш хүчтэй"], scores: { "Хааяа": ["collapse"], "Нэлээд тэгдэг": ["collapse"], "Заримдаа": ["collapse"], "Ихэвчлэн тэгдэг": ["collapse"], "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] } },

**Rendered context**

> Хоолоо огцом багасгах үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?
> Хориглосон хоол улам их бодогдох үе байдаг уу?
> Нэг удаа хазайхаар ‘өнөөдөр өнгөрлөө’ гэж бодоод цааш нь тавьчихдаг уу?

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

**Answer options for S1-X02**

- Үгүй
- Ховор
- Заримдаа
- Ихэвчлэн
- Бараг үргэлж

## COPY-0491 — P2

**Exact current text**

> Нэг удаа хазайхаар ‘өнөөдөр өнгөрлөө’ гэж бодоод цааш нь тавьчихдаг уу?

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
- Source line: 350
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-X02", module: "Restriction response", type: "single", text: "Хориглосон хоол улам их бодогдох үе байдаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Бараг үргэлж"], scores: { "Заримдаа": ["reward", "collapse"], "Ихэвчлэн": ["reward", "collapse"], "Бараг үргэлж": ["reward", "collapse"] } },

**Source item**

> { id: "S1-X03", module: "Restriction response", type: "single", text: "Нэг удаа хазайхаар ‘өнөөдөр өнгөрлөө’ гэж бодоод цааш нь тавьчихдаг уу?", options: ["Бараг үгүй", "Хааяа", "Нэлээд тэгдэг", "Ихэвчлэн тэгдэг", "Маш хүчтэй"], scores: { "Хааяа": ["collapse"], "Нэлээд тэгдэг": ["collapse"], "Заримдаа": ["collapse"], "Ихэвчлэн тэгдэг": ["collapse"], "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] } },

**Source context after**

> { id: "S1-V02", module: "Voice checkpoint", type: "text", text: "Хоолоо хасаж эхлэх үед таны биед хамгийн түрүүнд юу мэдрэгддэг вэ?", voice: true },

**Rendered context**

> Хориглосон хоол улам их бодогдох үе байдаг уу?
> Нэг удаа хазайхаар ‘өнөөдөр өнгөрлөө’ гэж бодоод цааш нь тавьчихдаг уу?
> Хоолоо хасаж эхлэх үед таны биед хамгийн түрүүнд юу мэдрэгддэг вэ?

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

**Answer options for S1-X03**

- Бараг үгүй
- Хааяа
- Нэлээд тэгдэг
- Ихэвчлэн тэгдэг
- Маш хүчтэй
