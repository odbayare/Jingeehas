# P0 Payment Critical — Batch 03

Evidence only. Current copy is quoted verbatim; no replacement wording is proposed or approved.

## COPY-0401 — P0

**Exact current text**

> 9,900₮-ийн QPay төлбөрийн QR код үүсгэх

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-pre-invoice
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-pre-invoice [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> 9,900₮-ийн QPay төлбөрийн QR код үүсгэх
> Сонголт руу буцах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0402 — P0

**Exact current text**

> Сонголт руу буцах

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-pre-invoice, qpay-invoice-created, qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 3
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-pre-invoice, qpay-invoice-created, qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> 9,900₮-ийн QPay төлбөрийн QR код үүсгэх
> Сонголт руу буцах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0403 — P0

**Exact current text**

> QPay төлбөрийн QR код үүсгэж байна.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 1478
- Source function/object: qpayStatusMessage
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> return {

**Source item**

> creating: "QPay төлбөрийн QR код үүсгэж байна.",

**Source context after**

> pending: "Төлбөр хараахан баталгаажаагүй байна. Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.",

**Rendered context**

> Сонголт руу буцах
> QPay төлбөрийн QR код үүсгэж байна.
> Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0404 — P0

**Exact current text**

> Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created, qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: 3331
- Source function/object: renderQpayDesktopPaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created, qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <div class="qpay-secondary-apps">

**Source item**

> <p class="muted">Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.</p>

**Source context after**

> ${renderQpayAppGrid(invoice, { emptyText: qrImage ? "Банкны аппын холбоос ирсэнгүй. QR кодыг уншуулж төлбөрөө үргэлжлүүлнэ үү." : "" })}

**Rendered context**

> QPay төлбөрийн QR код үүсгэж байна.
> Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.
> Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0405 — P0

**Exact current text**

> Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created, qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: 3343
- Source function/object: renderQpayMobilePaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created, qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <div class="stack">

**Source item**

> <p class="muted">Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.</p>

**Source context after**

> ${renderQpayAppGrid(invoice)}

**Rendered context**

> Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.
> Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.
> QR кодоор төлөх

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0406 — P0

**Exact current text**

> QR кодоор төлөх

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created, qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: 3347
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

> Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.
> QR кодоор төлөх
> Төлбөрийн лавлах дугаар: INV-TEST-001

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0407 — P0

**Exact current text**

> Төлбөрийн лавлах дугаар: INV-TEST-001

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
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
> Төлбөрийн лавлах дугаар: INV-TEST-001
> Төлбөр шалгаж байна…

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0408 — P0

**Exact current text**

> Төлбөр шалгаж байна…

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-invoice-created
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 3384
- Source function/object: renderWeightQpayPaymentBox
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> : invoice

**Source item**

> ? `<button class="button secondary" onclick="checkWeightQpayPayment()" ${busy ? "disabled" : ""}>${busy ? "Төлбөр шалгаж байна…" : checkError ? "Төлбөр дахин шалгах" : attemptedCheck ? "Дахин шалгах" : "Төлбөр шалгах"}</button>`

**Source context after**

> : `<button class="button secondary" onclick="createWeightQpayInvoice()" ${busy ? "disabled" : ""}>${busy ? "QR код үүсгэж байна…" : createError ? "QR код дахин үүсгэх" : `${oneTimePrice}-ийн QPay төлбөрийн QR код үүсгэх`}</button>`}

**Rendered context**

> Төлбөрийн лавлах дугаар: INV-TEST-001
> Төлбөр шалгаж байна…

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0409 — P0

**Exact current text**

> Төлбөр хараахан баталгаажаагүй байна. Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 1479
- Source function/object: qpayStatusMessage
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> creating: "QPay төлбөрийн QR код үүсгэж байна.",

**Source item**

> pending: "Төлбөр хараахан баталгаажаагүй байна. Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.",

**Source context after**

> checking: "Төлбөрийн төлөвийг шалгаж байна.",

**Rendered context**

> Төлбөрийн лавлах дугаар: INV-TEST-001
> Төлбөр хараахан баталгаажаагүй байна. Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.
> Төлбөр шалгах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0410 — P0

**Exact current text**

> Төлбөр шалгах

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PUBLIC_USER
- Scenario: qpay-pending
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Төлбөр хараахан баталгаажаагүй байна. Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.
> Төлбөр шалгах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0411 — P0

**Exact current text**

> Төлбөр амжилттай баталгаажлаа. Таны бүрэн тайлан нээгдлээ.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PAID_USER
- Scenario: qpay-paid
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 1481
- Source function/object: qpayStatusMessage
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-paid [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> checking: "Төлбөрийн төлөвийг шалгаж байна.",

**Source item**

> paid: context === "pre_test" ? "Төлбөр амжилттай баталгаажлаа. Тестээ эхлүүлэх боломжтой боллоо." : "Төлбөр амжилттай баталгаажлаа. Таны бүрэн тайлан нээгдлээ.",

**Source context after**

> create_error: "QPay төлбөрийн QR код үүсгэж чадсангүй. Түр хүлээгээд дахин оролдоно уу.",

**Rendered context**

> Төлбөр амжилттай баталгаажлаа. Таны бүрэн тайлан нээгдлээ.
> Төлбөрийн лавлах дугаар: INV-TEST-001

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0412 — P0

**Exact current text**

> Төлбөрийн лавлах дугаар: INV-TEST-001

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
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

> Төлбөр амжилттай баталгаажлаа. Таны бүрэн тайлан нээгдлээ.
> Төлбөрийн лавлах дугаар: INV-TEST-001
> Бүрэн тайлангаа харах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0413 — P0

**Exact current text**

> Бүрэн тайлангаа харах

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: QPAY
- Role: PAID_USER
- Scenario: qpay-paid
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 3382
- Source function/object: renderWeightQpayPaymentBox
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-paid [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> ${paid

**Source item**

> ? (context === "pre_test" ? `<button class="button" onclick="beginAssessment('one-time')">Тест эхлүүлэх</button>` : `<button class="button" onclick="render({ scrollToTop: true })">Бүрэн тайлангаа харах</button>`)

**Source context after**

> : invoice

**Rendered context**

> Төлбөрийн лавлах дугаар: INV-TEST-001
> Бүрэн тайлангаа харах
> Сонголт руу буцах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0414 — P0

**Exact current text**

> Сонголт руу буцах

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
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

> Бүрэн тайлангаа харах
> Сонголт руу буцах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0415 — P0

**Exact current text**

> QPay төлбөрийн QR код үүсгэж чадсангүй. Түр хүлээгээд дахин оролдоно уу.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-create-error
- Render source: renderWeightQpayPaymentBox with create error
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 1482
- Source function/object: qpayStatusMessage
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox with create error via qpay-create-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> paid: context === "pre_test" ? "Төлбөр амжилттай баталгаажлаа. Тестээ эхлүүлэх боломжтой боллоо." : "Төлбөр амжилттай баталгаажлаа. Таны бүрэн тайлан нээгдлээ.",

**Source item**

> create_error: "QPay төлбөрийн QR код үүсгэж чадсангүй. Түр хүлээгээд дахин оролдоно уу.",

**Source context after**

> check_error: "Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Энэ нь таны төлбөр цуцлагдсан гэсэн үг биш. Түр хүлээгээд дахин шалгана уу."

**Rendered context**

> QPay төлбөрийн QR код үүсгэж чадсангүй. Түр хүлээгээд дахин оролдоно уу.
> QR код дахин үүсгэх

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0416 — P0

**Exact current text**

> QR код дахин үүсгэх

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-create-error
- Render source: renderWeightQpayPaymentBox with create error
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 3385
- Source function/object: renderWeightQpayPaymentBox
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox with create error via qpay-create-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> ? `<button class="button secondary" onclick="checkWeightQpayPayment()" ${busy ? "disabled" : ""}>${busy ? "Төлбөр шалгаж байна…" : checkError ? "Төлбөр дахин шалгах" : attemptedCheck ? "Дахин шалгах" : "Төлбөр шалгах"}</button>`

**Source item**

> : `<button class="button secondary" onclick="createWeightQpayInvoice()" ${busy ? "disabled" : ""}>${busy ? "QR код үүсгэж байна…" : createError ? "QR код дахин үүсгэх" : `${oneTimePrice}-ийн QPay төлбөрийн QR код үүсгэх`}</button>`}

**Source context after**

> ${demoOnlyHtml(`<button class="button ghost" onclick="demoCompletePayment('one-time')">Дотоод туршилтаар нээх</button>`)}

**Rendered context**

> QPay төлбөрийн QR код үүсгэж чадсангүй. Түр хүлээгээд дахин оролдоно уу.
> QR код дахин үүсгэх
> Сонголт руу буцах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0417 — P0

**Exact current text**

> Сонголт руу буцах

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-create-error, qpay-check-error
- Render source: renderWeightQpayPaymentBox with create error
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 2
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox with create error via qpay-create-error, qpay-check-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> QR код дахин үүсгэх
> Сонголт руу буцах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0418 — P0

**Exact current text**

> Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Энэ нь таны төлбөр цуцлагдсан гэсэн үг биш. Түр хүлээгээд дахин шалгана уу.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-check-error
- Render source: renderWeightQpayPaymentBox with check error
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 1483
- Source function/object: qpayStatusMessage
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox with check error via qpay-check-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> create_error: "QPay төлбөрийн QR код үүсгэж чадсангүй. Түр хүлээгээд дахин оролдоно уу.",

**Source item**

> check_error: "Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Энэ нь таны төлбөр цуцлагдсан гэсэн үг биш. Түр хүлээгээд дахин шалгана уу."

**Source context after**

> }[status] || "";

**Rendered context**

> Сонголт руу буцах
> Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Энэ нь таны төлбөр цуцлагдсан гэсэн үг биш. Түр хүлээгээд дахин шалгана уу.
> Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0419 — P0

**Exact current text**

> Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-check-error
- Render source: renderWeightQpayPaymentBox with check error
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 3331
- Source function/object: renderQpayDesktopPaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox with check error via qpay-check-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <div class="qpay-secondary-apps">

**Source item**

> <p class="muted">Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.</p>

**Source context after**

> ${renderQpayAppGrid(invoice, { emptyText: qrImage ? "Банкны аппын холбоос ирсэнгүй. QR кодыг уншуулж төлбөрөө үргэлжлүүлнэ үү." : "" })}

**Rendered context**

> Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Энэ нь таны төлбөр цуцлагдсан гэсэн үг биш. Түр хүлээгээд дахин шалгана уу.
> Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.
> Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0420 — P0

**Exact current text**

> Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-check-error
- Render source: renderWeightQpayPaymentBox with check error
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 3343
- Source function/object: renderQpayMobilePaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox with check error via qpay-check-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <div class="stack">

**Source item**

> <p class="muted">Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.</p>

**Source context after**

> ${renderQpayAppGrid(invoice)}

**Rendered context**

> Утсаараа төлөх бол доорх банкны аппын холбоосыг сонгоно уу.
> Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.
> QR кодоор төлөх

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0421 — P0

**Exact current text**

> QR кодоор төлөх

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-check-error
- Render source: renderWeightQpayPaymentBox with check error
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 3347
- Source function/object: renderQpayMobilePaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox with check error via qpay-check-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <details class="qpay-mobile-qr-toggle">

**Source item**

> <summary>QR кодоор төлөх</summary>

**Source context after**

> <img src="${escapeAttr(qrImage)}" alt="QPay QR код" class="qpay-qr">

**Rendered context**

> Банкны эсвэл цахим хэтэвчийн аппыг сонгоод төлбөрөө үргэлжлүүлнэ үү.
> QR кодоор төлөх
> Төлбөрийн лавлах дугаар: INV-TEST-001

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0422 — P0

**Exact current text**

> Төлбөрийн лавлах дугаар: INV-TEST-001

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-check-error
- Render source: renderWeightQpayPaymentBox with check error
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox with check error via qpay-check-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> QR кодоор төлөх
> Төлбөрийн лавлах дугаар: INV-TEST-001
> Төлбөр дахин шалгах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0423 — P0

**Exact current text**

> Төлбөр дахин шалгах

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-check-error
- Render source: renderWeightQpayPaymentBox with check error
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 3384
- Source function/object: renderWeightQpayPaymentBox
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox with check error via qpay-check-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> : invoice

**Source item**

> ? `<button class="button secondary" onclick="checkWeightQpayPayment()" ${busy ? "disabled" : ""}>${busy ? "Төлбөр шалгаж байна…" : checkError ? "Төлбөр дахин шалгах" : attemptedCheck ? "Дахин шалгах" : "Төлбөр шалгах"}</button>`

**Source context after**

> : `<button class="button secondary" onclick="createWeightQpayInvoice()" ${busy ? "disabled" : ""}>${busy ? "QR код үүсгэж байна…" : createError ? "QR код дахин үүсгэх" : `${oneTimePrice}-ийн QPay төлбөрийн QR код үүсгэх`}</button>`}

**Rendered context**

> Төлбөрийн лавлах дугаар: INV-TEST-001
> Төлбөр дахин шалгах

**Dynamic values**

- None

**Reason included**

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:
