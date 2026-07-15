# P2 Questions — SAFETY — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0774 — P2

**Exact current text**

> Идэх үедээ хяналтаа алдсан мэт мэдрэмж хүчтэй гардаг уу?

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
- Source line: 389
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "MC-07", module: MENSTRUAL_CONTEXT_MODULE, type: "single", text: "Мөчлөг тогтмол бус болох, ирэхээ болих, эсвэл их өөрчлөгдөх нь хоол хасалт, жин огцом буурах, эсвэл хэт их дасгалтай давхцаж байсан уу?", options: ["Тийм", "Үгүй", "Сайн мэдэхгүй", "Хариулахгүй"] },

**Source item**

> { id: "S1-S01", module: "Safety", type: "single", text: "Идэх үедээ хяналтаа алдсан мэт мэдрэмж хүчтэй гардаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] }, safety: value => ["Ихэвчлэн", "Маш хүчтэй"].includes(value) ? ["professional"] : [] },

**Source context after**

> { id: "S1-S02", module: "Safety", type: "single", text: "Идсэний дараа нуух, ичих, ганцаараа баймаар санагдах мэдрэмж хэр хүчтэй байдаг вэ?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["collapse"], "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] }, safety: value => ["Ихэвчлэн", "Маш хүчтэй"].includes(value) ? ["professional"] : [] },

**Rendered context**

> Мөчлөг тогтмол бус болох, ирэхээ болих, эсвэл их өөрчлөгдөх нь хоол хасалт, жин огцом буурах, эсвэл хэт их дасгалтай давхцаж байсан уу?
> Идэх үедээ хяналтаа алдсан мэт мэдрэмж хүчтэй гардаг уу?
> Идсэний дараа нуух, ичих, ганцаараа баймаар санагдах мэдрэмж хэр хүчтэй байдаг вэ?

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

**Answer options for S1-S01**

- Үгүй
- Ховор
- Заримдаа
- Ихэвчлэн
- Маш хүчтэй

## COPY-0775 — P2

**Exact current text**

> Идсэний дараа нуух, ичих, ганцаараа баймаар санагдах мэдрэмж хэр хүчтэй байдаг вэ?

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
- Source line: 390
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-S01", module: "Safety", type: "single", text: "Идэх үедээ хяналтаа алдсан мэт мэдрэмж хүчтэй гардаг уу?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] }, safety: value => ["Ихэвчлэн", "Маш хүчтэй"].includes(value) ? ["professional"] : [] },

**Source item**

> { id: "S1-S02", module: "Safety", type: "single", text: "Идсэний дараа нуух, ичих, ганцаараа баймаар санагдах мэдрэмж хэр хүчтэй байдаг вэ?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["collapse"], "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] }, safety: value => ["Ихэвчлэн", "Маш хүчтэй"].includes(value) ? ["professional"] : [] },

**Source context after**

> { id: "S1-S03", module: "Safety", type: "single", text: "Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?", options: ["Үгүй", "Өмнө байсан", "Одоо хааяа", "Одоо давтагддаг", "Хариулахгүй"], safety: value => ["Одоо хааяа", "Одоо давтагддаг"].includes(value) ? ["professional"] : [] },

**Rendered context**

> Идэх үедээ хяналтаа алдсан мэт мэдрэмж хүчтэй гардаг уу?
> Идсэний дараа нуух, ичих, ганцаараа баймаар санагдах мэдрэмж хэр хүчтэй байдаг вэ?
> Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?

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

**Answer options for S1-S02**

- Үгүй
- Ховор
- Заримдаа
- Ихэвчлэн
- Маш хүчтэй

## COPY-0776 — P2

**Exact current text**

> Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?

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
- Source line: 391
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-S02", module: "Safety", type: "single", text: "Идсэний дараа нуух, ичих, ганцаараа баймаар санагдах мэдрэмж хэр хүчтэй байдаг вэ?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["collapse"], "Ихэвчлэн": ["collapse"], "Маш хүчтэй": ["collapse"] }, safety: value => ["Ихэвчлэн", "Маш хүчтэй"].includes(value) ? ["professional"] : [] },

**Source item**

> { id: "S1-S03", module: "Safety", type: "single", text: "Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?", options: ["Үгүй", "Өмнө байсан", "Одоо хааяа", "Одоо давтагддаг", "Хариулахгүй"], safety: value => ["Одоо хааяа", "Одоо давтагддаг"].includes(value) ? ["professional"] : [] },

**Source context after**

> { id: "S1-S04", module: "Safety", type: "single", text: "Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?", options: ["Үгүй", "Өнгөрсөнд байсан", "Одоо хааяа бодогддог", "Одоо идэвхтэй бодогдож байна", "Хариулахгүй"], safety: value => value === "Одоо идэвхтэй бодогдож байна" ? ["urgent"] : value === "Одоо хааяа бодогддог" ? ["professional"] : [] },

**Rendered context**

> Идсэний дараа нуух, ичих, ганцаараа баймаар санагдах мэдрэмж хэр хүчтэй байдаг вэ?
> Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?
> Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?

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

**Answer options for S1-S03**

- Үгүй
- Өмнө байсан
- Одоо хааяа
- Одоо давтагддаг
- Хариулахгүй

## COPY-0777 — P2

**Exact current text**

> Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?

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
- Source line: 392
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-S03", module: "Safety", type: "single", text: "Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?", options: ["Үгүй", "Өмнө байсан", "Одоо хааяа", "Одоо давтагддаг", "Хариулахгүй"], safety: value => ["Одоо хааяа", "Одоо давтагддаг"].includes(value) ? ["professional"] : [] },

**Source item**

> { id: "S1-S04", module: "Safety", type: "single", text: "Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?", options: ["Үгүй", "Өнгөрсөнд байсан", "Одоо хааяа бодогддог", "Одоо идэвхтэй бодогдож байна", "Хариулахгүй"], safety: value => value === "Одоо идэвхтэй бодогдож байна" ? ["urgent"] : value === "Одоо хааяа бодогддог" ? ["professional"] : [] },

**Source context after**

> {

**Rendered context**

> Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу?
> Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?
> Жингээ бууруулах эсвэл жингээ барихын тулд өмнө туршсан нэг арга тань яагаад удаан үргэлжлээгүй вэ?

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

**Answer options for S1-S04**

- Үгүй
- Өнгөрсөнд байсан
- Одоо хааяа бодогддог
- Одоо идэвхтэй бодогдож байна
- Хариулахгүй
