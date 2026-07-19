# Virtual Cohort V2.1 — Quality Audit

## Executive Summary

- **10/10 assessment, 349/349 routed answer, 10/10 report амжилттай.** V2-ийн яг ижил cohort, answers, Q-METHOD-LONGEST linkage болон production API-тэй ижил in-memory start/save/complete урсгал ашигласан; payment, invoice, entitlement үүсгээгүй.
- **V2.1 release gates pass.** P0 0, P1 0, unsupported factual claim 0, internal contradiction 0, first-experiment fit 10/10. 10/10 тайлангийн guidance visibility-г шалгаж, trigger-тэй 3/3 guidance public output-д харагдсан.
- **Personalization 8.6/10; paid value 8.0/10; Mongolian 8.2/10.** Maximum exact-set Jaccard 58.3%, 65%-ийн gate-ээс доогуур.

## Unchanged method and rubric

V2-ийн formula-г өөрчлөөгүй: headings removed, public visible sentences normalized, boilerplate retained, length ≥35, exact-set Jaccard. Score scale 0–10. A–H rubric: factual correctness, attribution, multi-factor reasoning, Mongolian, personalization, paid value, safety, first-experiment fit.

## Six factuality checks

1. **Stable rhythm vs late hunger — PASS.** VU-04-ийн 3–4 цагийн хэмнэл irregular timing-ийг л үгүйсгэж, late hunger болон satiety difficulty-г хэвээр үлдээсэн.
2. **No change vs no regain — PASS.** VU-05-ийн no-change + no-regain хослол maintenance strength үүсгээгүй; paired test-д initial loss + no regain үед л зөвшөөрсөн.
3. **No method vs implementation — PASS.** VU-08-ийн no-method route implementation/adherence strength үүсгээгүй.
4. **Comparative “хооллолт өөрчлөгдөөгүй” — PASS.** Public output дахь unsupported fragment 0; stronger synthesis зөвхөн таван relevant eating-domain protective gate бүгд биелэхэд гарсан.
5. **Environmental cue/action match — PASS.** Visibility, app, other-people, smell/generic, multi-cue fallback болон no-cue route тус бүрийг deterministic report-level test-ээр шалгасан; VU-02 generic fallback хүнс зохиогоогүй.
6. **Stress wording gate — PASS.** VU-03 default rationale stress дурдаагүй; separate sentence зөвхөн independent emotional-regulation pattern-тэй paired case-д гарсан.

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

Score formulas: personalization = E column mean = 8.6; paid value = F column mean = 8.0; Mongolian = D column mean = 8.2. V2 rubric and scores were retained; V2.1 gates remove factual defects without inflating subjective scores.

## Manual sentence-to-answer review

Every visible factual sentence in all 10 reports was compared with the unchanged V2 fixture answers and the existing redacted answer artifact. No unsupported chronology, comparative eating claim, implementation history, maintenance success, cue target, stress factor, diagnosis, or internal ID remained. Copy-only scope/uncertainty sentences were separately checked for contradiction with preserved answers.

## Per-report findings

### VU-01 — Стрессийн үеийн идэх хүсэл давамгай

Стрессийн үеийн идэх хүсэл гол finding болсон; тогтвортой хоол, өлсөлт/цадалтын хамгаалах хариулттай зөрчилдөөгүй. Өмнөх олон аргаас зөвхөн linked diet chronology ашигласан бөгөөд туршилт хэрэгцээ ажиглахад чиглэсэн. Scores A–H: 10/10/9/8/9/8/10/10.

### VU-02 — Орчны хоолны дохио давамгай

Орчны харагдах байдал, апп, хамтын хоолны дохиог нэгтгэсэн; бага хөдөлгөөнийг тусдаа context болгон хадгалсан. Хамгийн хүчтэй ганц cue тодорхойгүй тул experiment нь нэг cue-г сонгон хүртээмж эсвэл нөлөөг нь багасгах generic fallback ашиглаж, хүнс зохиогоогүй. Scores A–H: 10/10/9/8/9/8/10/10.

### VU-03 — Тогтмол бус хоол ба оройн хэт өлсөлт

5+ цагийн хоолны зай, хожуу өлсөлт, ээлжийн хуваарийг зөв холбосон; restrictive/maintenance дүгнэлт нэмээгүй. Нэг хоолны цагийг тогтворжуулах нь dominant finding-тэй таарсан. Scores A–H: 10/10/9/8/8/8/10/10.

### VU-04 — Өлсөх, цадах дохио ба хэмжээний хүндрэл

3–4 цагийн хэмнэл irregular-meal дүгнэлтийг хаасан; хожуу өлсөлт, цадах болон portion evidence hunger/satiety-д үлдсэн. Mid-meal pause нь нэг хувьсагчтай. Scores A–H: 10/10/9/8/9/8/10/10.

### VU-05 — Нойр, ядаргаа ба хуваарийн үл нийцэл

Нойр, ядаргаа, шөнийн дуудлага, хуваарийг практик нөхцөл болгон нэгтгэсэн. No-change + no-regain хариултаас maintenance success зохиогоогүй; бэлтгэл багатай нэг default, fallback, return rule нь unsupported food prescription нэмээгүй. Scores A–H: 10/9/9/8/8/8/10/10.

### VU-06 — Хатуу дэглэмийн дараах эргэн нэмэгдэлт

Structured strict-rule anchor болон open-text restriction/collapse corroboration restrictive pattern-ийг баталсан. Flexible-rule experiment зөв gated; cycle guidance мөн харагдсан. Scores A–H: 10/10/9/8/9/8/10/10.

### VU-07 — Гэмтлийн дараах үр дүн хадгалах хүндрэл

Нэг жилээс урт linked exercise, initial success, regain, injury-caused stop, explicit no-replacement gap бүгд maintenance formulation-д орсон. Nonnumeric, cost-aware, injury-bounded plan харагдсан. Scores A–H: 10/10/10/8/9/9/10/10.

### VU-08 — Өдөр тутмын хөдөлгөөн бага, сэтгэлзүйн гол саадгүй

Сэтгэлзүйн хэв маяг болон өмнө хэрэгжүүлсэн арга зохиогоогүй; маш бага хөдөлгөөнийг contextual subtype болгосон. No-method + no-barrier хариултаас implementation strength үүсгээгүй, food task-ийн оронд давтаж болох movement context ажиглуулсан. Scores A–H: 10/10/8/8/8/8/10/10.

### VU-09 — Мөчлөгийн биологийн нөхцөл

Behavioral problem зохиогоогүй; biological subtype exact calm menstrual guidance болон relevant tracking харуулсан. Generic corrective behavior нэмээгүй. Scores A–H: 10/10/8/9/9/8/10/10.

### VU-10 — Ихэнх хариулт хамгаалах шинжтэй

Одоогийн хоол, хөдөлгөөн, emotional/cue/body-signal strengths-ийг хамгаалах profile болгон нэгтгэсэн. Шаардлагагүй засах туршилтын оронд ажиллаж буй хэмнэлийг хадгална. Scores A–H: 10/10/8/9/8/7/10/10.

## Best and worst

- **Best: VU-07.** Linked method, long duration, success, regain, explicit injury stop and missing replacement form one traceable formulation with a feasible nonnumeric plan.
- **Worst: VU-08.** It passes every factuality gate, but a low-movement-only profile necessarily provides less multi-factor depth than the other paid reports.

## First experiments

- **VU-01:** Стресс нэмэгдэж, хоол авах гэж буй мөчид ямар хэрэгцээ хамгийн хүчтэй байгааг ажиглана.
- **VU-02:** Эхний туршилтаар дараах нэг алхмыг хийнэ. Өлсөөгүй үед идэх хүсэл хамгийн их төрүүлдэг нэг орчны дохиог сонгож, түүний хүртээмж эсвэл нөлөөг нэг аргаар багасгана.
- **VU-03:** Эхний туршилтаар дараах нэг алхмыг хийнэ: өдөр тутам тогтвортой давтаж болох нэг хоолны цагаа сонгоод, эхний туршилтын хугацаанд баримтална.
- **VU-04:** Эхний туршилтаар дараах нэг алхмыг хийнэ: нэг үндсэн хоолны дунд халбагаа тавиад, өлсөлт болон цадалтын мэдрэмжээ түр ажиглана.
- **VU-05:** Шөнийн дуудлага эсвэл урт ажлын өдрийн дараа хэрэглэх, бэлтгэл хамгийн бага шаарддаг нэг өгөгдмөл хувилбарыг урьдчилж сонгоно.
- **VU-06:** Эхний туршилтаар дараах нэг алхмыг хийнэ: одоогийн төлөвлөгөөн дэх хамгийн хатуу нэг дүрмийг сонгоод, бүрэн хоригийн оронд урьдчилж тогтоосон уян хувилбараар солино.
- **VU-07:** Өдөр тутмын амьдралд давтаж болох нэг хөдөлгөөний хэмнэлийг туршиж, эхлэх болон эргэн харах өдрөө урьдчилан сонгоно.
- **VU-08:** өдөр тутмын нэг тогтмол үйл явдлын дараах эвтэйхэн хөдөлгөөний боломж
- **VU-09:** мөчлөгийн өөрчлөлт болон тухайн үеийн өдөр тутмын мэдрэмж
- **VU-10:** одоо тогтвортой ажиллаж буй хоол, хөдөлгөөний хэмнэл

## Top-five similarity pairs

1. **VU-08 + VU-10: 58.3%** — 14/24 exact visible sentence. Neutral scope/strength boilerplate давхцсан ч movement-context ба maintain-strengths action ялгаатай; зөвшөөрөхүйц.
2. **VU-08 + VU-09: 56.0%** — 14/25 exact visible sentence. Neutral structure shared боловч movement context ба cycle guidance/tracking ялгаатай; зөвшөөрөхүйц.
3. **VU-09 + VU-10: 50.0%** — 13/26 exact visible sentence. Protective тайлбарын хэсэг shared боловч biological referral ба maintain-strengths action ялгаатай; зөвшөөрөхүйц.
4. **VU-03 + VU-06: 45.1%** — 23/51 exact visible sentence. Meal-rhythm/hunger evidence shared; strict-rule formulation/guidance ба schedule-linked timing-аар ялгарсан; зөвшөөрөхүйц.
5. **VU-04 + VU-06: 42.1%** — 16/38 exact visible sentence. Hunger/satiety copy shared; regular-rhythm contradiction ба irregular-rhythm/strictness-аар ялгарсан; зөвшөөрөхүйц.

## Caveats

Энэ нь deterministic synthetic product audit бөгөөд clinical validation, бодит customer willingness-to-pay судалгаа биш. No fixes were applied after the V2.1 audit artifacts were generated.
