# Pilot V2.1 Structured Report Example

## Non-validation status

This synthetic example tests deterministic software behavior. It is not a participant result, human review, validation study, norm, diagnosis, or clinical evidence.

## Example excerpt

**Туршилтын үр дүнг хэрхэн унших вэ?** Энэ оноо хүн амын нормтой харьцуулаагүй, баталгаажсан өндөр/дунд/бага ангилал биш pilot profile score.

**Таны 9 хэмжээст профайл**

| Construct | Orientation | nativeScore | Coverage | Status |
|---|---|---:|---:|---|
| Сэтгэл хөдлөлтэй холбоотой идэлт | barrier | 75.0 | 6/6 | complete |
| Өлсгөлөн, цадалтын мэдрэмж | capability | — | 3/5 | insufficient_data |
| Хооллолтын өөртөө итгэх итгэл | capability | 80.0 | 6/6 | complete |

Each detail is derived from its aggregate, shows coverage, explains the scoring orientation, gives bounded within-profile wording, and asks one reflection question. It does not show raw answers or item scores.

Barrier candidates use only `barrierBurdenScore`; a capability-derived burden is worded as weakly supported capability rather than displaying an inverted score under a positive label. Capability strengths are ranked separately by capability `nativeScore`. No score is classified by a 50-point or other cut-point, and the report states that cross-construct metric equivalence is not established. The interaction section says: “Хэмжээсүүдийн хоорондын холбоог энэ pilot хувилбарт тайлбарлахгүй.”

Collected bounded context is rendered as concise facts under “Нэмэлт нөхцөл.” Raw profile, context, and safety responses are omitted. When stored safety codes route to safety, guidance appears first and ranking, strengths, and starting-direction interpretation stop.

Provenance renders the immutable instrument, bank hash, scoring version, report version, pilot status, and generated timestamp.
