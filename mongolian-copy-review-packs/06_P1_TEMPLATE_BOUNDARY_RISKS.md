# P1 Template Boundary Risks

Evidence only. No corrections or replacement wording are included.

## COPY-0160 — P1

**Exact current text**

> жин, өндөр, зорилтын мэдээлэл одоогоор хугацаа амлахад хангалтгүй байна. өдөр тутмын ажлын/хөдөлгөөний мэдээлэл бага байна Үүн дээр Ядаргаа ба хамгийн хялбар сонголт ялах хамгийн түрүүнд шалгах хэв маяг болж байна; энэ нь баттай онош биш, одоогийн хариултаас харагдаж буй боломжит хэв маяг. Эхний стратеги нь олон зөвлөгөө зэрэг эхлүүлэх биш: Ядарсан өдөр ашиглах 2 бэлэн, бага хүч шаардсан хоолны сонголтоо урьдчилж нэрлэ.

**Classification**

- Priority: P1
- Review group: template
- Structural signal: Rendered structural boundary signal requiring source-template review.
- Surface: ONE_TIME_REPORT
- Role: PAID_USER
- Scenario: one-time-paid
- Render source: renderReport
- Extraction type: FULL_SURFACE
- Occurrence count: 1
- Duplicate group: None
- Source file: app.js
- Source line: UNRESOLVED
- Source function/object: UNRESOLVED
- Source mapping: UNRESOLVED
- Render proof: renderReport via one-time-paid [FULL_SURFACE]
- Cross-group references: None

**Source context before**

> None

**Source item**

> Source mapping: UNRESOLVED

**Source context after**

> None

**Rendered context**

> 1. Гол зураглал
> жин, өндөр, зорилтын мэдээлэл одоогоор хугацаа амлахад хангалтгүй байна. өдөр тутмын ажлын/хөдөлгөөний мэдээлэл бага байна Үүн дээр Ядаргаа ба хамгийн хялбар сонголт ялах хамгийн түрүүнд шалгах хэв маяг болж байна; энэ нь баттай онош биш, одоогийн хариултаас харагдаж буй боломжит хэв маяг. Эхний стратеги нь олон зөвлөгөө зэрэг эхлүүлэх биш: Ядарсан өдөр ашиглах 2 бэлэн, бага хүч шаардсан хоолны сонголтоо урьдчилж нэрлэ.
> Энэ тайлан онош, баталгаа, эсвэл жин бууруулах амлалт биш.

**Dynamic values**

- None

**Reason included**

Rendered structural boundary signal requiring source-template review.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:

## COPY-0414 — P1

**Exact current text**

> Шалгаж байна...

**Classification**

- Priority: P1
- Review group: template
- Structural signal: Rendered structural boundary signal requiring source-template review.
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

Rendered structural boundary signal requiring source-template review.

**Owner decision**

- Decision: `PENDING`
- Approved exact text:
- Approved by:
- Approval date:
- Notes:
