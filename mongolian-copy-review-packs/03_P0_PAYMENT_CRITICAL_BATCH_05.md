# P0 Payment Critical — Batch 05

Evidence only. Current copy is quoted verbatim; no replacement wording is proposed or approved.

## COPY-0681 — P0

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

## COPY-0682 — P0

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

Payment, price, entitlement, invoice, or recovery text.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0683 — P0

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

## COPY-0684 — P0

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
