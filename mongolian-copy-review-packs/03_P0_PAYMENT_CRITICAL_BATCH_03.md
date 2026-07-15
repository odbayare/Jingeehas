# P0 Payment Critical — Batch 03

Evidence only. Current copy is quoted verbatim; no replacement wording is proposed or approved.

## COPY-0405 — P0

**Exact current text**

> Буцах

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: PAYMENT
- Role: PUBLIC_USER
- Scenario: payment-contact
- Render source: renderContactCaptureForm
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderContactCaptureForm via payment-contact [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Мэдээллээ хадгалаад төлбөр рүү үргэлжлүүлэх
> Буцах

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

> 9,900₮ төлөөд бүрэн тайлангаа нээх

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

> 9,900₮ төлөөд бүрэн тайлангаа нээх
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

## COPY-0407 — P0

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

> 9,900₮ төлөөд бүрэн тайлангаа нээх
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

## COPY-0408 — P0

**Exact current text**

> QPay QR үүсгэж байна.

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
- Source line: 1476
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

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0409 — P0

**Exact current text**

> Утаснаас төлөх бол банкны апп сонгож болно.

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
- Source line: 3311
- Source function/object: renderQpayDesktopPaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created, qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <div class="qpay-secondary-apps">

**Source item**

> <p class="muted">Утаснаас төлөх бол банкны апп сонгож болно.</p>

**Source context after**

> ${renderQpayAppGrid(invoice, { emptyText: "Банкны аппын холбоос ирээгүй байна." })}

**Rendered context**

> QPay QR үүсгэж байна.
> Утаснаас төлөх бол банкны апп сонгож болно.
> T

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

> T

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
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

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0411 — P0

**Exact current text**

> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.

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
- Source line: 3323
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

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0412 — P0

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
- Source line: 3327
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

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0413 — P0

**Exact current text**

> Лавлах дугаар: INV-TEST-001

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
> Лавлах дугаар: INV-TEST-001
> Шалгаж байна...

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

> Шалгаж байна...

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
- Source line: 3355
- Source function/object: renderWeightQpayPaymentBox
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-invoice-created [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> ${invoice

**Source item**

> ? `<button class="button secondary" onclick="checkWeightQpayPayment()" ${busy ? "disabled" : ""}>${busy ? "Шалгаж байна..." : "Дахин шалгах"}</button>`

**Source context after**

> : `<button class="button secondary" onclick="createWeightQpayInvoice()" ${busy ? "disabled" : ""}>${busy ? "QR үүсгэж байна..." : `${oneTimePrice} төлөөд бүрэн тайлангаа нээх`}</button>`}

**Rendered context**

> Лавлах дугаар: INV-TEST-001
> Шалгаж байна...

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

> Төлбөр хүлээгдэж байна. Төлбөрөө хийсний дараа “Дахин шалгах” товчийг дарж болно.

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
- Source line: 1477
- Source function/object: qpayStatusMessage
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-pending [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> creating: "QPay QR үүсгэж байна.",

**Source item**

> pending: "Төлбөр хүлээгдэж байна. Төлбөрөө хийсний дараа “Дахин шалгах” товчийг дарж болно.",

**Source context after**

> checking: "Төлбөрийн төлөвийг шалгаж байна.",

**Rendered context**

> Лавлах дугаар: INV-TEST-001
> Төлбөр хүлээгдэж байна. Төлбөрөө хийсний дараа “Дахин шалгах” товчийг дарж болно.
> Дахин шалгах

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

> Дахин шалгах

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

> Төлбөр хүлээгдэж байна. Төлбөрөө хийсний дараа “Дахин шалгах” товчийг дарж болно.
> Дахин шалгах

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

> Төлбөр баталгаажлаа. Таны бүрэн тайлан нээгдлээ.

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
- Source line: 1479
- Source function/object: qpayStatusMessage
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-paid [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> checking: "Төлбөрийн төлөвийг шалгаж байна.",

**Source item**

> paid: "Төлбөр баталгаажлаа. Таны бүрэн тайлан нээгдлээ.",

**Source context after**

> error: "Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно."

**Rendered context**

> Төлбөр баталгаажлаа. Таны бүрэн тайлан нээгдлээ.
> Утаснаас төлөх бол банкны апп сонгож болно.

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

> Утаснаас төлөх бол банкны апп сонгож болно.

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
- Source line: 3311
- Source function/object: renderQpayDesktopPaymentSurface
- Source mapping: RESOLVED
- Render proof: renderWeightQpayPaymentBox via qpay-paid [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <div class="qpay-secondary-apps">

**Source item**

> <p class="muted">Утаснаас төлөх бол банкны апп сонгож болно.</p>

**Source context after**

> ${renderQpayAppGrid(invoice, { emptyText: "Банкны аппын холбоос ирээгүй байна." })}

**Rendered context**

> Төлбөр баталгаажлаа. Таны бүрэн тайлан нээгдлээ.
> Утаснаас төлөх бол банкны апп сонгож болно.
> T

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

> T

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
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

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0420 — P0

**Exact current text**

> Банк эсвэл wallet апп сонгоод утсаараа төлбөрөө үргэлжлүүлнэ үү.

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
- Source line: 3323
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
- Surface: QPAY
- Role: PAID_USER
- Scenario: qpay-paid
- Render source: renderWeightQpayPaymentBox
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 3327
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

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0422 — P0

**Exact current text**

> Лавлах дугаар: INV-TEST-001

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

> QR кодоор төлөх
> Лавлах дугаар: INV-TEST-001
> Дахин шалгах

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

> Дахин шалгах

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

> Лавлах дугаар: INV-TEST-001
> Дахин шалгах
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

## COPY-0424 — P0

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

> Дахин шалгах
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

## COPY-0425 — P0

**Exact current text**

> Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно.

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-error
- Render source: renderWeightQpayPaymentBox with qpayStatusMessage(error)
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: 1480
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

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0426 — P0

**Exact current text**

> 9,900₮ төлөөд бүрэн тайлангаа нээх

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-error
- Render source: renderWeightQpayPaymentBox with qpayStatusMessage(error)
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox with qpayStatusMessage(error) via qpay-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> Төлбөрийн төлөвийг одоогоор шалгаж чадсангүй. Таны эхний дохио хэвээр харагдана. Түр хүлээгээд QR-аа дахин үүсгэж эсвэл дахин шалгаж болно.
> 9,900₮ төлөөд бүрэн тайлангаа нээх
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

## COPY-0427 — P0

**Exact current text**

> Сонголт руу буцах

**Classification**

- Priority: P0
- Review group: payment
- Structural signal: Payment, price, entitlement, invoice, or recovery text.
- Surface: VISIBLE_ERROR
- Role: PUBLIC_USER
- Scenario: qpay-error
- Render source: renderWeightQpayPaymentBox with qpayStatusMessage(error)
- Extraction type: ISOLATED_COMPONENT
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderWeightQpayPaymentBox with qpayStatusMessage(error) via qpay-error [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> 9,900₮ төлөөд бүрэн тайлангаа нээх
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
