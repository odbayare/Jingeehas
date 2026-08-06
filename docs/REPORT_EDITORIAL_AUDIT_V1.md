# Тайлангийн редакцын аудит — PR 3

## Зорилго

V7 тайлангийн semantic бүтэц, нотолгооны хил, safety guidance болон хуучин snapshot compatibility-г өөрчлөхгүйгээр хэрэглэгчийн унших ачаалал, хэл найруулга, нэр томьёо, зааврын register-ийг цэвэрлэх.

## Илэрсэн үндсэн асуудал

1. Нэг ижил `observe` зөвлөмж context болон management хэсэгт давхар render хийгддэг.
2. Нэг болон хоёр хэв маягтай тайлан pattern card бүрт explanation, evidence, effect, uncertainty гэсэн дөрвөн догол мөр үзүүлж, overview-тэй давхцах ачаалал үүсгэдэг.
3. Зааврын хэлбэр `тэмдэглэ`, `тэмдэглээрэй`, `тэмдэглэнэ` гэж холилдсон.
4. `хамгаалах хүчин зүйл`, `хэрэгжүүлэх босго`, `суурь зураглал`, `нөлөөлөгч нөхцөл` зэрэг хэрэглэгчид хиймэл эсвэл техникийн сонсогдох хэллэг үлдсэн.
5. Management trigger болон combined-plan тайлбарууд ижил өгүүлбэрийн загварыг олон дахин ашигладаг.

## Редакцын гэрээ

- Public зааврыг эелдэг `-аарай/-ээрэй` хэлбэрт нэг мөр болгоно.
- Descriptive болон safety copy-г imperative болгон өөрчлөхгүй.
- Pattern card нэг хэв маягт гурваас олон substantive догол мөр үзүүлэхгүй.
- Context хэсэг management-ийн `observe` зөвлөмжийг давхар харуулахгүй.
- Narrative evidence, effect, uncertainty болон neutral limitations алдагдахгүй.
- V6 болон өмнө хадгалагдсан V7 snapshot-ууд хуучин агуулгатайгаа render хийгдэнэ.
- Payment, QPay, entitlement, questionnaire, scoring, pattern inference, safety routing болон database contract өөрчлөгдөхгүй.
