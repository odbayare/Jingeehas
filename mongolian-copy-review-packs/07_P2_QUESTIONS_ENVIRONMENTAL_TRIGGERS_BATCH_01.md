# P2 Questions — ENVIRONMENTAL_TRIGGERS — Batch 01

Questions and their owning options are kept together verbatim. No wording is proposed.

## COPY-0496 — P2

**Exact current text**

> Гэр/ажил дээр зууш харагдаж байвал танд юу тохиолддог вэ?

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
- Source line: 355
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-L03", module: "Executive load", type: "multi", text: "Хоол бэлдэхэд хамгийн их саад болдог зүйл юу вэ?", options: ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх", "Дэлгүүр/материал", "Бусдын хэрэгцээ", "Орчин", "Мэдэхгүй"], scores: { "Цаг": ["executive"], "Ядаргаа": ["executive"], "Юу хийхээ шийдэх": ["executive"], "Бусдын хэрэгцээ": ["executive", "social"] } },

**Source item**

> { id: "S1-L04", module: "Environment", type: "single", text: "Гэр/ажил дээр зууш харагдаж байвал танд юу тохиолддог вэ?", options: ["Нөлөөлөхгүй", "Заримдаа иддэг", "Ихэвчлэн иддэг", "Харагдвал бараг автоматаар иддэг", "Зууш ил байлгадаггүй"], scores: { "Заримдаа иддэг": ["cue"], "Ихэвчлэн иддэг": ["cue"], "Харагдвал бараг автоматаар иддэг": ["cue"] } },

**Source context after**

> { id: "S1-L05", module: "Environment", type: "single", text: "Хоолны зураг, үнэр, эсвэл захиалгын апп харахад идэх хүсэл гэнэт нэмэгддэг үү?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["cue", "reward"], "Ихэвчлэн": ["cue", "reward"], "Маш хүчтэй": ["cue", "reward"] } },

**Rendered context**

> Хоол бэлдэхэд хамгийн их саад болдог зүйл юу вэ?
> Гэр/ажил дээр зууш харагдаж байвал танд юу тохиолддог вэ?
> Хоолны зураг, үнэр, эсвэл захиалгын апп харахад идэх хүсэл гэнэт нэмэгддэг үү?

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

**Answer options for S1-L04**

- Нөлөөлөхгүй
- Заримдаа иддэг
- Ихэвчлэн иддэг
- Харагдвал бараг автоматаар иддэг
- Зууш ил байлгадаггүй

## COPY-0497 — P2

**Exact current text**

> Хоолны зураг, үнэр, эсвэл захиалгын апп харахад идэх хүсэл гэнэт нэмэгддэг үү?

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
- Source line: 356
- Source function/object: module/object scope
- Source mapping: RESOLVED
- Render proof: stageOneQuestions consumed by renderStageOne via question-bank [ISOLATED_COMPONENT]
- Cross-group references: None

**Source context before**

> { id: "S1-L04", module: "Environment", type: "single", text: "Гэр/ажил дээр зууш харагдаж байвал танд юу тохиолддог вэ?", options: ["Нөлөөлөхгүй", "Заримдаа иддэг", "Ихэвчлэн иддэг", "Харагдвал бараг автоматаар иддэг", "Зууш ил байлгадаггүй"], scores: { "Заримдаа иддэг": ["cue"], "Ихэвчлэн иддэг": ["cue"], "Харагдвал бараг автоматаар иддэг": ["cue"] } },

**Source item**

> { id: "S1-L05", module: "Environment", type: "single", text: "Хоолны зураг, үнэр, эсвэл захиалгын апп харахад идэх хүсэл гэнэт нэмэгддэг үү?", options: ["Үгүй", "Ховор", "Заримдаа", "Ихэвчлэн", "Маш хүчтэй"], scores: { "Заримдаа": ["cue", "reward"], "Ихэвчлэн": ["cue", "reward"], "Маш хүчтэй": ["cue", "reward"] } },

**Source context after**

> { id: "S1-N01", module: "Sleep / energy", type: "single", text: "Сүүлийн үед дундаж нойр тань ямар байна вэ?", options: ["4 цагаас бага", "4-6 цаг", "6-8 цаг", "8+ цаг", "Чанар муу", "Тогтворгүй"], scores: { "4 цагаас бага": ["circadian", "medical"], "4-6 цаг": ["circadian"], "Чанар муу": ["circadian"], "Тогтворгүй": ["circadian"] } },

**Rendered context**

> Гэр/ажил дээр зууш харагдаж байвал танд юу тохиолддог вэ?
> Хоолны зураг, үнэр, эсвэл захиалгын апп харахад идэх хүсэл гэнэт нэмэгддэг үү?
> Сүүлийн үед дундаж нойр тань ямар байна вэ?

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

**Answer options for S1-L05**

- Үгүй
- Ховор
- Заримдаа
- Ихэвчлэн
- Маш хүчтэй
