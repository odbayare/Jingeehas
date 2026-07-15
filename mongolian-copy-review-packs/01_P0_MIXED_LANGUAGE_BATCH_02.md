# P0 Mixed Language — Batch 02

Evidence only. Current copy is quoted verbatim; no replacement wording is proposed or approved.

## COPY-0633 — P0

**Exact current text**

> Тайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: OTHER_PROVEN_RENDERED
- Role: INTERNAL_TESTER
- Scenario: internal-feedback-survey
- Render source: renderInternalTesterFeedbackSurvey with internalTest state
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 7131
- Source function/object: renderInternalTesterFeedbackSurvey
- Source mapping: RESOLVED
- Render proof: renderInternalTesterFeedbackSurvey with internalTest state via internal-feedback-survey [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> ${feedbackChoiceField("newInsight", "Тайлангаас танд хэрэгтэй шинэ өнцөг, шинэ ойлголт гарсан уу?", ["Тийм", "Бага зэрэг", "Үгүй"], "newInsightDetail", "Ямар хэсэг?")}

**Source item**

> ${feedbackChoiceField("aiGenericFeeling", "Тайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?", ["Үгүй", "Тийм"], "aiGenericDetail", "Аль хэсэг?")}

**Source context after**

> ${feedbackChoiceField("languageTone", "Тайлангийн хэл найруулга ямар санагдсан бэ?", ["Байгалийн монгол хэлтэй", "Зарим хэсэг хиймэл", "Хэт албархуу", "Хэт зөөлөн/бөөрөнхий"], "languageToneSuggestion", "Засах санал:")}

**Rendered context**

> Ямар хэсэг?
> Тайлан хэт ерөнхий, AI шиг, эсвэл худлаа санагдсан хэсэг байсан уу?
> Аль хэсэг?

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0651 — P0

**Exact current text**

> Дотоод туршилтын санал асуулгын JSON таталт.

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: OTHER_PROVEN_RENDERED
- Role: INTERNAL_TESTER
- Scenario: internal-feedback-export
- Render source: renderFeedbackExport with internalTest state
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 7204
- Source function/object: renderFeedbackExport
- Source mapping: RESOLVED
- Render proof: renderFeedbackExport with internalTest state via internal-feedback-export [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> <h2>Саналын экспорт</h2>

**Source item**

> <p class="muted">Дотоод туршилтын санал асуулгын JSON таталт.</p>

**Source context after**

> <pre class="feedback-export-json">${escapeHtml(JSON.stringify(records, null, 2))}</pre>

**Rendered context**

> Дахин эхлэх
> Дотоод туршилтын санал асуулгын JSON таталт.
> []

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0665 — P0

**Exact current text**

> QPay QR үүсгэж байна.

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 1547
- Source function/object: qpayStatusMessage
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> return {

**Source item**

> creating: "QPay QR үүсгэж байна.",

**Source context after**

> pending: "Төлбөр хүлээгдэж байна. Төлбөрөө хийсний дараа “Дахин шалгах” товчийг дарж болно.",

**Rendered context**

> Сонголт руу буцах
> QPay QR үүсгэж байна.
> Утаснаас төлөх бол банкны апп сонгож болно.

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0667 — P0

**Exact current text**

> T

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: UNRESOLVED_LATIN_TERM
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created, qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 4
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created, qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Утаснаас төлөх бол банкны апп сонгож болно.
> T
> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.

**Dynamic values**

- None

**Reason included**

UNRESOLVED_LATIN_TERM

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0668 — P0

**Exact current text**

> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created, qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: 4218
- Source function/object: renderQpayMobilePaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created, qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <div class="stack">

**Source item**

> <p class="muted">Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.</p>

**Source context after**

> ${renderQpayAppGrid(invoice)}

**Rendered context**

> T
> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.
> QR кодоор төлөх

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0669 — P0

**Exact current text**

> QR кодоор төлөх

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created, qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: 4222
- Source function/object: renderQpayMobilePaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created, qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <details class="qpay-mobile-qr-toggle">

**Source item**

> <summary>QR кодоор төлөх</summary>

**Source context after**

> <img src="${escapeAttr(qrImage)}" alt="QPay QR код" class="qpay-qr">

**Rendered context**

> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.
> QR кодоор төлөх
> Лавлах дугаар: INV-TEST-001

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0670 — P0

**Exact current text**

> Лавлах дугаар: INV-TEST-001

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created, qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created, qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> QR кодоор төлөх
> Лавлах дугаар: INV-TEST-001
> Шалгаж байна...

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0676 — P0

**Exact current text**

> T

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: UNRESOLVED_LATIN_TERM
- Surface: QPAY
- Role: PAID_USER
- Scenario: qpay-paid
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-paid [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Утаснаас төлөх бол банкны апп сонгож болно.
> T
> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.

**Dynamic values**

- None

**Reason included**

UNRESOLVED_LATIN_TERM

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0677 — P0

**Exact current text**

> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: QPAY
- Role: PAID_USER
- Scenario: qpay-paid
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 4218
- Source function/object: renderQpayMobilePaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-paid [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <div class="stack">

**Source item**

> <p class="muted">Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.</p>

**Source context after**

> ${renderQpayAppGrid(invoice)}

**Rendered context**

> T
> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.
> QR кодоор төлөх

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0678 — P0

**Exact current text**

> QR кодоор төлөх

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: QPAY
- Role: PAID_USER
- Scenario: qpay-paid
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 4222
- Source function/object: renderQpayMobilePaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-paid [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <details class="qpay-mobile-qr-toggle">

**Source item**

> <summary>QR кодоор төлөх</summary>

**Source context after**

> <img src="${escapeAttr(qrImage)}" alt="QPay QR код" class="qpay-qr">

**Rendered context**

> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.
> QR кодоор төлөх
> Лавлах дугаар: INV-TEST-001

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0679 — P0

**Exact current text**

> Лавлах дугаар: INV-TEST-001

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: QPAY
- Role: PAID_USER
- Scenario: qpay-paid
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-paid [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> QR кодоор төлөх
> Лавлах дугаар: INV-TEST-001
> Дахин шалгах

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0682 — P0

**Exact current text**

> Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно.

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-error
- Render source: renderWeightQpayPaymentBox with qpayStatusMessage(error)
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 1551
- Source function/object: qpayStatusMessage
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox with qpayStatusMessage(error) via qpay-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> paid: "Төлбөр баталгаажлаа. Таны бүрэн тайлан нээгдлээ.",

**Source item**

> error: "Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно."

**Source context after**

> }[status] || "";

**Rendered context**

> Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно.
> 9,900₮ төлөөд бүрэн тайлангаа нээх

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0942 — P0

**Exact current text**

> Бүлгийн challenge / сургалт

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: ANSWER_OPTIONS
- Role: PUBLIC_USER
- Scenario: answer-options
- Render source: stageOneQuestions/dailyCore consumed by renderInput
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 335
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions/dailyCore consumed by renderInput via answer-options [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-W03", module: "Past attempts", type: "single", text: "Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу?", options: ["Үгүй", "Нэг удаа", "Хэд хэдэн удаа", "Бараг бүх оролдлогоос хойш", "Санахгүй"], scores: { "Хэд хэдэн удаа": ["collapse"], "Бараг бүх оролдлогоос хойш": ["collapse", "hungerSafety"] } },

**Source item**

> { id: "S1-W04", module: "Past attempts", type: "multi", text: "Жингээ бууруулах эсвэл жингээ барихын тулд өмнө нь ямар аргууд туршиж байсан бэ?", options: ["Хоолны хэмжээг багасгах", "Калори тоолох", "Нүүрс ус багасгах", "Орой хоол идэхгүй байх", "Завсарлагатай мацаг / мацаг барих", "Алхалт нэмэх", "Фитнес / хүчний дасгал", "Кардио дасгал", "Иог / сунгалтын дасгал", "Усанд сэлэх", "Дугуй / спиннинг", "Бүжиг / хөдөлгөөнтэй хичээл", "Гэрийн дасгал", "Багийн спорт", "Дасгалжуулагчтай хөтөлбөр", "Бүлгийн challenge / сургалт", "Хоол орлуулах бүтээгдэхүүн", "Эм, тариа, нэмэлт бүтээгдэхүүн", "Детокс / “цэвэрлэгээ” гэж нэрлэдэг арга", "Нойр, стрессээ засах гэж оролдсон", "Оролдож байгаагүй", "Өөр арга"], scores: { "Хоолны хэмжээг багасгах": ["hungerSafety"], "Калори тоолох": ["collapse"], "Нүүрс ус багасгах": ["hungerSafety"], "Орой хоол идэхгүй байх": ["hungerSafety"], "Завсарлагатай мацаг / мацаг барих": ["hungerSafety", "glucose"], "Хоол орлуулах бүтээгдэхүүн": ["hungerSafety"], "Эм, тариа, нэмэлт бүтээгдэхүүн": ["medical"], "Детокс / “цэвэрлэгээ” гэж нэрлэдэг арга": ["collapse", "hungerSafety"], "Нойр, стрессээ засах гэж оролдсон": ["circadian", "regulation"] } },

**Source context after**

> { id: "S1-W05", module: "Past attempts", type: "text", text: "Туршиж үзсэн аргуудаас аль нь хоёр долоо хоногоос дээш үргэлжлүүлэхэд хамгийн хэцүү байсан бэ? Юу нь хамгийн их саад болсон бэ?", voice: true },

**Rendered context**

> Дасгалжуулагчтай хөтөлбөр
> Бүлгийн challenge / сургалт
> Хоол орлуулах бүтээгдэхүүн

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-1165 — P0

**Exact current text**

> PCOS оноштой эсвэл сэжигтэй

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE
- Surface: ANSWER_OPTIONS
- Role: PUBLIC_USER
- Scenario: answer-options
- Render source: stageOneQuestions/dailyCore consumed by renderInput
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
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

> Дааврын жирэмслэлтээс хамгаалах хэрэгсэл хэрэглэдэг
> PCOS оноштой эсвэл сэжигтэй
> Төрсний дараах эсвэл хөхүүл үе

**Dynamic values**

- None

**Reason included**

ENGLISH_TERM_INSIDE_MONGOLIAN_SENTENCE

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-1238 — P0

**Exact current text**

> progress

**Classification**

- Priority: P0
- Review group: mixed
- Structural signal: UNRESOLVED_LATIN_TERM
- Surface: ACCESSIBILITY
- Role: PUBLIC_USER
- Scenario: accessibility
- Render source: extractAccessibilityAttributes from exported renderers
- Extraction type: ATTRIBUTE_ONLY
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: extractAccessibilityAttributes from exported renderers via accessibility [ATTRIBUTE_ONLY]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> progress

**Dynamic values**

- None

**Reason included**

UNRESOLVED_LATIN_TERM

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:
