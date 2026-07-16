# Owner launch review

Status: **PENDING FINAL LAUNCH APPROVAL**. Owner-provided operational legal defaults are implemented in the product copy; this is not a claim of external legal-counsel review. The canonical repository value is `https://jingeehas.fit/`. The coming-soon mode remains enabled while external recovery delivery, payment sandbox, real administrator, and support-inbox gates remain open. The three approved hero sentences are unchanged.

## Database infrastructure status

Provider: **Supabase**. Hosting project: **Enneagram test**. Isolation: private `jingeehas` PostgreSQL schema with RLS default-deny, no `anon`/`authenticated` table privileges, private operation functions, service-role-only RPC bridge, and active service-role-only `jingeehas-database-gateway` Edge Function. Database schema and database-side transaction/rollback are **PASS**. Credential-free unauthorized gateway probes are **PASS**. The configured gateway credential returned HTTP 401 and was removed after an unsafe CLI JSON response exposed it; authenticated external lifecycle now requires a current replacement secret. Logical backup and disposable PostgreSQL 17 restore are **PASS**. This shared hosting project does not imply shared tables.

## Privacy policy

**Current text**

> Үйлчилгээ үзүүлэгч: Customer Business Development LLC-ийн ажиллуулдаг Jingeehas. Үйлчилгээ Монгол Улсын харьяалалд үйл ажиллагаа явуулна.
>
> Тестийн хариулт, аюулгүй байдлын шинж, холбоо барих мэдээлэл нь тайлан гаргах, төлбөр баталгаажуулах, тайлан сэргээх зорилгоор серверт хадгалагдана. Холбоо барих мэдээллийг шифрлэж, хайлтын утгыг тусад нь хэшлэнэ.
>
> Түүхий хариултыг QPay нэхэмжлэлийн тайлбар, төлбөрийн мэдээлэл эсвэл ерөнхий хэрэглээний хэмжилтэд дамжуулахгүй. Зөвлөх зөвхөн таны тодорхой зөвшөөрөлтэй бүрэн тайланг харж болох бөгөөд асуулт бүрийн түүхий хариултыг тусад нь харахгүй.
>
> Хэрэглэгч зөвшөөрлөө цуцалж, хууль болон төлбөрийн бүртгэлээр заавал хадгалах мэдээллээс бусдыг устгуулах хүсэлт гаргаж болно. Баталгаажсан устгах хүсэлтийг 30 хоногийн дотор шийдвэрлэнэ.
>
> Байнгын зочны мөрдөлт одоогоор эхлээгүй. Ирээдүйд ийм хэмжилт нэмэх бол хадгалалт эхлэхээс өмнө ил тод зөвшөөрөл авна.

**Why it exists:** explains collection, purpose, protection, sharing, and tracking.
**Data/process dependency:** database retention/deletion, encryption keys, recovery delivery, advisor access logs.
**Owner decision:** controller, jurisdiction, consent withdrawal, and 30-day deletion defaults supplied and implemented.
**Legal review status:** OWNER DEFAULTS IMPLEMENTED; EXTERNAL COUNSEL REVIEW NOT CLAIMED.
**Required change:** operationally verify the support inbox.
**Final approval status:** PENDING.

## Service terms

**Current text**

> Үйлчилгээ үзүүлэгч: Customer Business Development LLC-ийн ажиллуулдаг Jingeehas. Үйлчилгээ Монгол Улсын харьяалалд үйл ажиллагаа явуулна.
>
> Энэ тест үнэлгээ нь насанд хүрсэн хэрэглэгчийн өөрийн хариултад тулгуурласан ажиглалт гаргана. Эмнэлгийн онош тавихгүй бөгөөд эмч, сэтгэлзүйч, хоолзүйчийн зөвлөгөө, эмчилгээ, яаралтай тусламжийг орлохгүй.
>
> Нэг удаагийн бүтээгдэхүүний үнэ 9,900₮. Бүрэн тайлан зөвхөн сервер төлбөрийг баталгаажуулсны дараа нээгдэнэ. Аюулгүй байдлын зөвлөмж төлбөргүй.
>
> Давхар төлбөр, баталгаатай системийн алдаа, эсвэл төлбөр төлсөн боловч бүрэн тайланг техникийн шалтгаанаар өгөөгүй бөгөөд дэмжлэгээр шийдвэрлэж чадаагүй тохиолдлыг шалгаж, буцаан олголтын хүсэлтийг хянан шийдвэрлэнэ.

**Why it exists:** defines scope, eligibility, price and entitlement boundary.
**Data/process dependency:** safety gate, QPay provider confirmation, entitlement service.
**Owner decision:** refund principle, failed-payment handling, governing law, and operator identity supplied and implemented.
**Legal review status:** OWNER DEFAULTS IMPLEMENTED; EXTERNAL COUNSEL REVIEW NOT CLAIMED.
**Required change:** no copy change; retain final owner launch approval.
**Final approval status:** PENDING.

## Payment support and paid-but-not-unlocked

**Current text**

> Нэхэмжлэл үүсэхгүй, хугацаа дууссан, эсвэл төлбөр баталгаажсан ч бүрэн тайлан нээгдэхгүй бол дахин төлөхөөсөө өмнө “Төлбөр шалгах” үйлдлийг ашиглана уу.
>
> Тайлангаа өөр төхөөрөмжөөс авах бол Тайлан сэргээх хэсэгт төлбөр хийхдээ ашигласан имэйл хаягаа оруулна уу. Утсаар сэргээх үйлчилгээ одоогоор нээгдээгүй.
>
> Дэмжлэгийн имэйл: support@jingeehas.fit.

Payment UI states: `QPay нэхэмжлэл үүсгэж байна…`; `Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.`; `Төлбөрийг шалгаж байна…`; `Төлбөр баталгаажлаа. Одоо тестээ эхлүүлнэ үү.`; `Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ.` The recovery action for `paid_but_not_unlocked` is `Тайлангийн эрхээ дахин нээх`.

**Why it exists:** prevents duplicate payment and provides entitlement repair.
**Data/process dependency:** QPay check, payment state machine, idempotent entitlement.
**Owner decision:** branded support channel and refund principle supplied and implemented.
**Legal review status:** OWNER DEFAULTS IMPLEMENTED; EXTERNAL COUNSEL REVIEW NOT CLAIMED.
**Required change:** prove `support@jingeehas.fit` reaches a monitored inbox before launch.
**Final approval status:** PENDING.

## Report recovery

**Current text**

> Төлбөр хийхдээ ашигласан имэйл хаягаа оруулна уу. Утсаар сэргээх үйлчилгээ одоогоор нээгдээгүй.
>
> Баталгаажуулах код авах
>
> Хэрэв тохирох бүрэн тайлан байгаа бол баталгаажуулах код илгээгдлээ.
>
> Баталгаажуулах код буруу эсвэл хугацаа дууссан байна.

**Why it exists:** restores entitled reports without revealing account existence.
**Data/process dependency:** encrypted contacts, delivery provider, shared rate limits, recovery challenges.
**Owner decision:** `Jingeehas <no-reply@mail.jingeehas.fit>`, the email-only channel, template, and abuse policy are supplied and implemented.
**Legal review status:** OWNER DEFAULTS IMPLEMENTED; EXTERNAL COUNSEL REVIEW NOT CLAIMED.
**Required change:** complete provider certification.
**Final approval status:** PENDING.

## Advisor consent and report sharing

**Current text**

> Тайлан хуваалцах зөвшөөрөл
>
> Би тест үнэлгээний бүрэн тайланг [Зөвлөх] зөвлөх харахыг зөвшөөрч байна.
>
> Бүрэн тайлангаа хуваалцахгүй.
>
> Миний асуулт бүрд өгсөн түүхий хариултыг тусад нь харуулахгүй.

**Why it exists:** makes report sharing explicit and optional.
**Data/process dependency:** one-time invitation, authenticated advisor, consent version, access log, active entitlement.
**Owner decision:** consent withdrawal principle supplied and implemented in privacy copy.
**Legal review status:** OWNER DEFAULTS IMPLEMENTED; EXTERNAL COUNSEL REVIEW NOT CLAIMED.
**Required change:** retain the existing explicit advisor opt-in and withdrawal operation.
**Final approval status:** PENDING.

## Data deletion

**Current text**

> Одоогийн баталгаажсан тест үнэлгээтэй холбоотой өгөгдөл устгах хүсэлт илгээж болно. Баталгаажсан хүсэлтийг 30 хоногийн дотор шийдвэрлэнэ. Хууль болон төлбөрийн бүртгэлээр заавал хадгалах мэдээлэл үлдэж болно.
>
> Өгөгдлийн эзэмшлийг баталгаажуулахын тулд эхлээд тайлангаа сэргээнэ үү. Дараа нь энэ хуудсанд буцаж хүсэлт илгээнэ.

**Why it exists:** provides an ownership-checked deletion request.
**Data/process dependency:** recovery identity, deletion queue, retention/anonymization procedure.
**Owner decision:** 30-day response deadline and mandatory legal/payment record exception supplied and implemented.
**Legal review status:** OWNER DEFAULTS IMPLEMENTED; EXTERNAL COUNSEL REVIEW NOT CLAIMED.
**Required change:** operator must execute and record the documented fulfillment procedure for real requests.
**Final approval status:** PENDING.

## Safety, emergency, and underage eligibility

**Current text**

> Энэ хэсэг төлбөргүй. Тест үнэлгээ танд тохирох эсэхийг эхэлж шалгана.
>
> Та яг одоо өөртөө хор хүргэх эрсдэлтэй бол ганцаараа үлдэхгүй, итгэдэг хүнтэйгээ хамт байж, 103 дугаар эсвэл хамгийн ойрын яаралтай тусламжийн тасагт нэн даруй хандана уу.
>
> Одоогийн будилах, ухаан балартах эсвэл бие огцом муудах шинж илэрсэн бол 103 дугаар эсвэл хамгийн ойрын яаралтай тусламжийн тасагт хандана уу.
>
> Идсэнээ буцаахын тулд хийж буй үйлдэл одоо давтагдаж байгаа тул жин хасах төлөвлөгөө эхлэхээс өмнө эмч эсвэл хооллолтын эмгэгийн чиглэлээр ажилладаг мэргэжилтэнтэй зөвлөлдөнө үү.
>
> Таны сонгосон нөхцөлд жин хасах тестээс өмнө эмчийн үнэлгээ илүү тохиромжтой.

Users under 18 are routed to the final professional-guidance text; there is currently no separate public sentence explicitly naming the age restriction.

**Why it exists:** blocks payment and commercial guidance where urgent/professional support is more appropriate.
**Data/process dependency:** age and safety routes, free guidance, emergency link `103`.
**Owner decision:** approve emergency resources, clinical/legal wording, and explicit underage copy.
**Legal review status:** PENDING.
**Required change:** specialist/owner review; add explicit age wording only after approval.
**Final approval status:** PENDING.

## Domain and brand decision

Canonical, `og:url`, `og:image`, and Twitter image consistently use `https://jingeehas.fit/`; recovery, privacy, terms and support links are same-origin relative paths. QPay callback origin is environment-configured. The local hero, favicon, and social preview contain no remote tracking asset.

**Owner decision:** prove control of the domain, approve the social preview and sender/support identities.
**Legal review status:** PENDING.
**Required change:** owner verification and, later, authorized staging configuration; no DNS action is part of this work.
**Final approval status:** PENDING.
