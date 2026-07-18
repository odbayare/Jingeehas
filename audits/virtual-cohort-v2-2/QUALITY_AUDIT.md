# Virtual Cohort V2.2 — Quality Audit

## Executive Summary

- **10/10 assessment, 349/349 routed answer, 10/10 report амжилттай.** V2.1-ийн яг ижил cohort, answers, Q-METHOD-LONGEST linkage болон in-memory start/save/complete урсгал ашигласан; payment, invoice, entitlement үүсгээгүй.
- **Гурван copy-exactness gate бүгд pass.** Menstrual guidance exact answer-аар салсан, environmental evidence зөвхөн selected cue-г нэрлэсэн, public “өгөгдмөл хувилбар” 0 болсон.
- **Release evidence хэвээр баталгаатай.** P0 0, P1 0, P2 0, unsupported factual claim 0, internal contradiction 0, first-experiment fit 10/10. 10/10 тайланг guidance visibility-аар шалгаж, trigger-тэй 3/3 guidance public output-д харагдсан.
- **V2.2 P2 closeout pass.** Neutral тайлангийн давхардсан хоёр scope өгүүлбэрийг хассан ч uncertainty, supported strengths, limitation, observation, decision rule болон гурван өөр subtype хэвээр. VU-03 688-аас 591 үг, VU-06 619-өөс 518 үг болж, зөвхөн давхардсан тайлбар хасагдсан.
- **Subjective scores автоматаар нэмэгдээгүй.** Personalization 8.6/10, paid value 8.0/10, Mongolian 8.2/10. Maximum exact-set Jaccard 54.5%, 65%-ийн gate-ээс доогуур.

## Unchanged cohort, engine, and rubric

V2.1 profile, answer, method linkage, inference engine, routing, signal mapping, pattern threshold, prioritization, safety болон similarity formula өөрчлөгдөөгүй. Зөвхөн public report composition-оос давхардсан өгүүлбэрийг хассан. Formula: headings removed, public visible sentences normalized, boilerplate retained, length ≥35, exact-set Jaccard. A–H rubric: factual correctness, attribution, multi-factor reasoning, Mongolian, personalization, paid value, safety, first-experiment fit.

## Three exactness checks

1. **Menstrual answer-specific guidance — PASS.** Four answers received paired rendered-report checks: “Заримдаа зөрдөг”, “Ихэнхдээ тогтмол биш”, “Сүүлийн 3 сард ирээгүй”, and “Тогтмол” with no irregular-cycle guidance.
2. **Selected environmental cues only — PASS.** Four individual cues, all six two-cue combinations, VU-02 three-cue combination, “Аль нь ч үгүй”, and “Хариулахгүй” were checked. VU-02 contains no unselected “үнэр” cue; its multi-cue experiment remains generic.
3. **Natural VU-05 option wording — PASS.** Public “өгөгдмөл хувилбар” count is 0. The replacement adds no unsupported food or movement prescription.

## Per-report score

| User | Factual | Attribution | Multi-factor | Mongolian | Personalization | Paid value | Safety | Experiment fit |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| VU-01 | 10 | 10 | 9 | 8 | 9 | 8 | 10 | 10 |
| VU-02 | 10 | 10 | 9 | 8 | 9 | 8 | 10 | 10 |
| VU-03 | 10 | 10 | 9 | 8 | 8 | 8 | 10 | 10 |
| VU-04 | 10 | 10 | 9 | 8 | 9 | 8 | 10 | 10 |
| VU-05 | 10 | 9 | 9 | 8 | 8 | 8 | 10 | 10 |
| VU-06 | 10 | 10 | 9 | 8 | 9 | 8 | 10 | 10 |
| VU-07 | 10 | 10 | 10 | 8 | 9 | 9 | 10 | 10 |
| VU-08 | 10 | 10 | 8 | 8 | 8 | 8 | 10 | 10 |
| VU-09 | 10 | 10 | 8 | 9 | 9 | 8 | 10 | 10 |
| VU-10 | 10 | 10 | 8 | 9 | 8 | 7 | 10 | 10 |

Score formulas: personalization = E column mean = 8.6; paid value = F column mean = 8.0; Mongolian = D column mean = 8.2. V2.1 subjective scores were retained without automatic uplift.

## Manual sentence-to-answer review

Every retained public sentence and its surrounding report section was compared with the unchanged V2.1 fixture answers. VU-03 and VU-06 preserve every supported major pattern, attribution, interaction, context, safety guidance, and first experiment. The neutral profiles preserve all supported strengths and distinct observations. No unsupported diagnosis, cue, prescription, chronology, internal identifier, or contradictory claim remained.

## Per-report findings

### VU-01 — Стрессийн үеийн идэх хүсэл давамгай

Стрессийн үеийн идэх хүсэл гол finding болсон; тогтвортой хоол, өлсөлт/цадалтын хамгаалах хариулттай зөрчилдөөгүй. Өмнөх олон аргаас зөвхөн linked diet chronology ашигласан бөгөөд туршилт хэрэгцээ ажиглахад чиглэсэн. Scores A–H: 10/10/9/8/9/8/10/10.

### VU-02 — Орчны хоолны дохио давамгай

Сонгосон харагдах байдал, захиалгын апп, бусад хүн идэх дохиог яг нэрлэж, сонгоогүй үнэрийн cue-г оруулаагүй. Олон cue-гээс хамгийн хүчтэйг тогтоох боломжгүй тул experiment нь evidence-safe generic fallback хэвээр. Scores A–H: 10/10/9/8/9/8/10/10.

### VU-03 — Тогтмол бус хоол ба оройн хэт өлсөлт

5+ цагийн хоолны зай, хожуу өлсөлт, ээлжийн хуваарийг зөв холбосон; restrictive/maintenance дүгнэлт нэмээгүй. Нэг хоолны цагийг тогтворжуулах нь dominant finding-тэй таарсан. Scores A–H: 10/10/9/8/8/8/10/10.

### VU-04 — Өлсөх, цадах дохио ба хэмжээний хүндрэл

3–4 цагийн хэмнэл irregular-meal дүгнэлтийг хаасан; хожуу өлсөлт, цадах болон portion evidence hunger/satiety-д үлдсэн. Mid-meal pause нь нэг хувьсагчтай. Scores A–H: 10/10/9/8/9/8/10/10.

### VU-05 — Нойр, ядаргаа ба хуваарийн үл нийцэл

Нойр, ядаргаа, шөнийн дуудлага, хуваарийн formulation өөрчлөгдөөгүй. Experiment нь урьдчилан сонгосон, бэлтгэл бага шаарддаг хялбар хувилбар гэж natural Mongolian-аар бичигдэж, хоол эсвэл хөдөлгөөний prescription зохиогоогүй. Scores A–H: 10/9/9/8/8/8/10/10.

### VU-06 — Хатуу дэглэмийн дараах эргэн нэмэгдэлт

Restrictive pattern болон cycle routing өөрчлөгдөөгүй; `Заримдаа зөрдөг` хариултыг яг тусгасан conditional guidance харагдсан. Scores A–H: 10/10/9/8/9/8/10/10.

### VU-07 — Гэмтлийн дараах үр дүн хадгалах хүндрэл

Нэг жилээс урт linked exercise, initial success, regain, injury-caused stop, explicit no-replacement gap бүгд maintenance formulation-д орсон. Nonnumeric, cost-aware, injury-bounded plan харагдсан. Scores A–H: 10/10/10/8/9/9/10/10.

### VU-08 — Өдөр тутмын хөдөлгөөн бага, сэтгэлзүйн гол саадгүй

Сэтгэлзүйн хэв маяг зохиогоогүй; маш бага хөдөлгөөнийг contextual subtype болгосон. Food task-ийн оронд давтаж болох movement context ажиглуулсан. Scores A–H: 10/10/8/8/8/8/10/10.

### VU-09 — Мөчлөгийн биологийн нөхцөл

Behavioral problem зохиогоогүй; `Ихэнхдээ тогтмол биш` хариултыг яг тусгасан calm menstrual guidance болон relevant tracking харагдсан. Scores A–H: 10/10/8/9/9/8/10/10.

### VU-10 — Ихэнх хариулт хамгаалах шинжтэй

Одоогийн хоол, хөдөлгөөн, emotional/cue/body-signal strengths-ийг хамгаалах profile болгон нэгтгэсэн. Шаардлагагүй засах туршилтын оронд ажиллаж буй хэмнэлийг хадгална. Scores A–H: 10/10/8/9/8/7/10/10.

## First experiments

- **VU-01:** Стресс нэмэгдэж, хоол авах гэж буй мөчид ямар хэрэгцээ хамгийн хүчтэй байгааг ажиглана.
- **VU-02:** Эхний туршилтаар дараах нэг алхмыг хийнэ. Өлсөөгүй үед идэх хүсэл хамгийн их төрүүлдэг нэг орчны дохиог сонгож, түүний хүртээмж эсвэл нөлөөг нэг аргаар багасгана.
- **VU-03:** Эхний туршилтаар дараах нэг алхмыг хийнэ: өдөр тутам тогтвортой давтаж болох нэг хоолны цагаа сонгоод, эхний туршилтын хугацаанд баримтална.
- **VU-04:** Эхний туршилтаар дараах нэг алхмыг хийнэ: нэг үндсэн хоолны дунд халбагаа тавиад, өлсөлт болон цадалтын мэдрэмжээ түр ажиглана.
- **VU-05:** Шөнийн дуудлага эсвэл урт ажлын өдрийн дараа хэрэглэх, урьдчилан сонгосон, бэлтгэл бага шаарддаг нэг хялбар хувилбар бэлдэнэ.
- **VU-06:** Эхний туршилтаар дараах нэг алхмыг хийнэ: одоогийн төлөвлөгөөн дэх хамгийн хатуу нэг дүрмийг сонгоод, бүрэн хоригийн оронд урьдчилж тогтоосон уян хувилбараар солино.
- **VU-07:** Өдөр тутмын амьдралд давтаж болох нэг хөдөлгөөний хэмнэлийг туршиж, эхлэх болон эргэн харах өдрөө урьдчилан сонгоно.
- **VU-08:** өдөр тутмын нэг тогтмол үйл явдлын дараах эвтэйхэн хөдөлгөөний боломж
- **VU-09:** мөчлөгийн өөрчлөлт болон тухайн үеийн өдөр тутмын мэдрэмж
- **VU-10:** одоо тогтвортой ажиллаж буй хоол, хөдөлгөөний хэмнэл

## Top-five similarity pairs

1. **VU-08 + VU-10: 54.5%** — 12/22 exact visible sentence. Neutral scope/strength boilerplate давхцсан ч movement-context ба maintain-strengths action ялгаатай; зөвшөөрөхүйц.
2. **VU-08 + VU-09: 50.0%** — 12/24 exact visible sentence. Neutral structure shared боловч movement context ба cycle guidance/tracking ялгаатай; зөвшөөрөхүйц.
3. **VU-09 + VU-10: 44.0%** — 11/25 exact visible sentence. Protective тайлбарын хэсэг shared боловч biological referral ба maintain-strengths action ялгаатай; зөвшөөрөхүйц.
4. **VU-03 + VU-06: 41.9%** — 18/43 exact visible sentence. Meal-rhythm/hunger evidence shared; strict-rule formulation/guidance ба schedule-linked timing-аар ялгарсан; зөвшөөрөхүйц.
5. **VU-04 + VU-06: 33.3%** — 12/36 exact visible sentence. Hunger/satiety copy shared; regular-rhythm contradiction ба irregular-rhythm/strictness-аар ялгарсан; зөвшөөрөхүйц.

## Caveats and assumptions

Энэ нь deterministic synthetic product audit бөгөөд clinical validation эсвэл бодит customer willingness-to-pay судалгаа биш. P2 closeout-ийн дараа ижил cohort-оор дахин үүсгэв.
