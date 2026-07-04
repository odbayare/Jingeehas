# WP62 Question Clarity Audit

## Scope

Audited the question bank and answer options for unclear, vague, repetitive, over-abstract, shame-heavy, or clinical-feeling wording. WP62 fixes the worst clarity issues first, focusing on prompts that directly affect paid report quality.

Protected folder `audits/sprint-36-paid-depth-prototype/` was not touched.

## Fixed Questions

| ID | Current text before WP62 | Problem | Revised text after WP62 | Reason |
|---|---|---|---|---|
| `S1-W05` | `Өмнө туршсан аргуудаас аль нь эхэндээ болж байгаад дараа нь үргэлжлүүлэхэд хэцүү болсон бэ? Тэр үед юу өөрчлөгдсөн гэж санагддаг вэ?` | Two ideas in one question; asks user to analyze too much. | `Өмнө туршсан аргуудаас аль нь 2 долоо хоногоос дээш үргэлжлэхэд хамгийн хэцүү байсан бэ? Яагаад?` | Concrete timeframe and one clear reason request. |
| `S1-R03` | `Заримдаа идэхээс өмнөх хүсэл нь идэж байх үеийн сэтгэл ханамжаас илүү хүчтэй байдаг уу?` | Abstract comparison; hard to recognize quickly. | `Идэхээс өмнө бодогдох амттай зүйл идсэний дараа санаснаас бага таашаал өгдөг үү?` | Concrete before/after experience, plain wording. |
| `S1-X01` | `Хоол багасгах, хориглох үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?` | `хориглох` feels harsh and abstract; one option used `Уур/эсэргүүцэл`. | `Хоолоо огцом багасгах үед танд хамгийн түрүүнд юу мэдрэгддэг вэ?` Options include `Уур хүрдэг`, `Идэх юм их бодогддог`. | Plain, recognizable, less shaming. |
| `S1-V02` | `Хоол хасах, мацаг барих, эсвэл “маргаашаас эхэлнэ” гэж бодох үед таны биед, сэтгэлд юу хамгийн түрүүнд мэдрэгддэг вэ?` | Too many scenarios and asks body plus emotion at once. | `Хоолоо хасаж эхлэх үед таны биед хамгийн түрүүнд юу мэдрэгддэг вэ?` | One idea, body-focused, simple. |
| `S1-V03` | `Өмнө хэрэглэсэн ч хамгийн удаан үргэлжлээгүй аргаа бодоорой. Тэр арга яагаад эхэндээ ажилласан, дараа нь яагаад үргэлжлээгүй гэж та боддог вэ?` | Long and asks two explanations. | `Өмнө хэрэглэсэн нэг арга яагаад удаан үргэлжлээгүй вэ?` | One clear question. |
| `S1-V04` | `'Би яг ___ байвал илүү тогтвортой явж чадна' гэж өгүүлбэрийг дуусгаад тайлбарлаарай.` | Fill-in prompt feels abstract and school-like. | `Танд тогтвортой үргэлжлэхэд хамгийн их туслах нэг нөхцөл юу вэ?` | Concrete user-facing wording. |
| `D-V01` | `Өнөөдрийн идэлтэд хамгийн их нөлөөлсөн нэг мөчийг богино тайлбарлаарай. Юуны дараа болсон бэ? Тэр үед өлсөж байсан уу? Ямар мэдрэмж давамгай байсан бэ? Идсэний дараа юу өөрчлөгдсөн бэ?` | Five prompts at once; too much for daily use. | `Өнөөдрийн идэлтэд хамгийн их нөлөөлсөн нэг мөчийг богино бичнэ үү. Юуны дараа болсон бэ?` | Daily diary prompt is now short and answerable. |

## Remaining Watch Items

These are understandable enough to keep for WP62 but should be reviewed in a later copy pass:

| ID | Current text | Watch item | Recommended future direction |
|---|---|---|---|
| `S1-F01` | `Төлөвлөөгүй идэхийн яг өмнө танд юу хамгийн ойр санагддаг вэ?` | Good intent, but some answer options are long. | Shorten options if mobile readability feedback continues. |
| `S1-L01` | `Юу хийхээ мэдэж байсан ч хийх тэнхээ үлдээгүй үе хэр олон байдаг вэ?` | Understandable, but emotionally heavy. | Keep unless users report shame; it is concrete enough for now. |
| `S1-B04` | `Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу?` | Safety-heavy; necessary but can feel intense. | Keep because it protects safety routing. |

## Copy Rules Applied

- Simple Mongolian.
- One idea per question.
- No abstract `pattern` language in questions.
- No shame wording.
- No diagnosis claim.
- Answer options should be concrete and recognizable.

## Result

The worst unclear free-text prompts are shorter and easier to answer. This should improve paid report quality because user narrative input is now less scattered and less likely to produce repetitive or confusing report text.
