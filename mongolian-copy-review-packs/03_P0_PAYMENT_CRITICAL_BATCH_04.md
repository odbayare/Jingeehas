# P0 Payment Critical — Batch 04

Evidence only. Current copy is quoted verbatim; no replacement wording is proposed or approved.

## COPY-0656 — P0

**Exact current text**

> Энэ нь бүртгэл биш. Тайлангаа дэлгэц дээр үзсэний дараа дэмжлэг авах, төлбөрийн лавлагаа шалгуулахад ашиглана.

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
- Source line: 2731
- Source function/object: renderContactCaptureForm
- Source mapping: RESOLVED
- Render proof: renderContactCaptureForm via payment-contact [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <h3>Төлбөрөөс өмнө мэдээллээ үлдээнэ үү</h3>

**Source item**

> <p class="muted">Энэ нь бүртгэл биш. Тайлангаа дэлгэц дээр үзсэний дараа дэмжлэг авах, төлбөрийн лавлагаа шалгуулахад ашиглана.</p>

**Source context after**

> </div>

**Rendered context**

> Төлбөрөөс өмнө мэдээллээ үлдээнэ үү
> Энэ нь бүртгэл биш. Тайлангаа дэлгэц дээр үзсэний дараа дэмжлэг авах, төлбөрийн лавлагаа шалгуулахад ашиглана.
> Нэр (сонголтоор)

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

## COPY-0657 — P0

**Exact current text**

> Нэр (сонголтоор)

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
- Source line: 2734
- Source function/object: renderContactCaptureForm
- Source mapping: RESOLVED
- Render proof: renderContactCaptureForm via payment-contact [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <label class="field">

**Source item**

> <span>Нэр (сонголтоор)</span>

**Source context after**

> <input type="text" value="${escapeAttr(contact.name)}" oninput="updateContactCaptureField('name', this.value)" autocomplete="name">

**Rendered context**

> Энэ нь бүртгэл биш. Тайлангаа дэлгэц дээр үзсэний дараа дэмжлэг авах, төлбөрийн лавлагаа шалгуулахад ашиглана.
> Нэр (сонголтоор)
> Утас

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

## COPY-0658 — P0

**Exact current text**

> Утас

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

> Нэр (сонголтоор)
> Утас
> Имэйл

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

## COPY-0659 — P0

**Exact current text**

> Имэйл

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

> Утас
> Имэйл
> Утас эсвэл имэйлийн аль нэгийг бөглөхөд хангалттай.

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

## COPY-0660 — P0

**Exact current text**

> Утас эсвэл имэйлийн аль нэгийг бөглөхөд хангалттай.

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
- Source line: 2745
- Source function/object: renderContactCaptureForm
- Source mapping: RESOLVED
- Render proof: renderContactCaptureForm via payment-contact [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> </label>

**Source item**

> <p class="muted">Утас эсвэл имэйлийн аль нэгийг бөглөхөд хангалттай.</p>

**Source context after**

> ${contact.message ? `<p class="danger-copy">${escapeHtml(contact.message)}</p>` : ""}

**Rendered context**

> Имэйл
> Утас эсвэл имэйлийн аль нэгийг бөглөхөд хангалттай.
> Мэдээллээ хадгалаад төлбөр рүү үргэлжлүүлэх

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

## COPY-0661 — P0

**Exact current text**

> Мэдээллээ хадгалаад төлбөр рүү үргэлжлүүлэх

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
- Source line: 2748
- Source function/object: renderContactCaptureForm
- Source mapping: RESOLVED
- Render proof: renderContactCaptureForm via payment-contact [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> <div class="actions">

**Source item**

> <button class="button secondary" onclick="saveContactCapture()">Мэдээллээ хадгалаад төлбөр рүү үргэлжлүүлэх</button>

**Source context after**

> <button class="button ghost" onclick="setView('choice')">Буцах</button>

**Rendered context**

> Утас эсвэл имэйлийн аль нэгийг бөглөхөд хангалттай.
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

## COPY-0662 — P0

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

## COPY-0663 — P0

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

## COPY-0664 — P0

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

## COPY-0665 — P0

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

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0666 — P0

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
- Source line: 4206
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

## COPY-0667 — P0

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

## COPY-0668 — P0

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

Payment, price, entitlement, invoice, or recovery text.

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

Payment, price, entitlement, invoice, or recovery text.

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

## COPY-0671 — P0

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
- Source line: 4250
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

## COPY-0672 — P0

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
- Source line: 1548
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

## COPY-0673 — P0

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

## COPY-0674 — P0

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
- Source line: 1550
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

## COPY-0675 — P0

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
- Source line: 4206
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

## COPY-0676 — P0

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

## COPY-0677 — P0

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

Payment, price, entitlement, invoice, or recovery text.

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

Payment, price, entitlement, invoice, or recovery text.

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

## COPY-0680 — P0

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
