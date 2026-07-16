# Owner launch review

Status: **PENDING**. This is a review pack, not approval or launch evidence. The canonical repository value is `https://jingeehas.mn/`, but ownership, DNS, legal wording, provider identities, and public-launch approval remain unverified. The three approved hero sentences are unchanged.

## Database infrastructure status

Provider: **Supabase**. Hosting project: **Enneagram test**. Isolation: private `jingeehas` PostgreSQL schema with RLS default-deny, no `anon`/`authenticated` table privileges, private operation functions, service-role-only RPC bridge, and active service-role-only `jingeehas-database-gateway` Edge Function. Database schema and database-side transaction/rollback are **PASS**. Credential-free unauthorized gateway probes are **PASS**. Authenticated external lifecycle and application environment injection are **NOT RUN / PENDING**. Backup/restore is **PREPARED / NOT RUN**. This shared hosting project does not imply shared tables.

## Privacy policy

**Current text**

> Тестийн хариулт, аюулгүй байдлын шинж, холбоо барих мэдээлэл нь тайлан гаргах, төлбөр баталгаажуулах, тайлан сэргээх зорилгоор серверт хадгалагдана. Холбоо барих мэдээллийг шифрлэж, хайлтын утгыг тусад нь хэшлэнэ.
>
> Түүхий хариултыг QPay нэхэмжлэлийн тайлбар, төлбөрийн мэдээлэл эсвэл ерөнхий хэрэглээний хэмжилтэд дамжуулахгүй. Зөвлөх зөвхөн таны тодорхой зөвшөөрөлтэй бүрэн тайланг харж болох бөгөөд асуулт бүрийн түүхий хариултыг тусад нь харахгүй.
>
> Байнгын зочны мөрдөлт одоогоор эхлээгүй. Ирээдүйд ийм хэмжилт нэмэх бол хадгалалт эхлэхээс өмнө ил тод зөвшөөрөл авна.

**Why it exists:** explains collection, purpose, protection, sharing, and tracking.  
**Data/process dependency:** database retention/deletion, encryption keys, recovery delivery, advisor access logs.  
**Owner decision:** identify controller, retention periods, contact and jurisdiction.  
**Legal review status:** PENDING.  
**Required change:** owner/legal additions after decisions; do not silently invent them.  
**Final approval status:** PENDING.

## Service terms

**Current text**

> Энэ тест үнэлгээ нь насанд хүрсэн хэрэглэгчийн өөрийн хариултад тулгуурласан ажиглалт гаргана. Эмнэлгийн онош, эмчилгээ, яаралтай тусламжийг орлохгүй.
>
> Нэг удаагийн бүтээгдэхүүний үнэ 9,900₮. Бүрэн тайлан зөвхөн сервер төлбөрийг баталгаажуулсны дараа нээгдэнэ. Аюулгүй байдлын зөвлөмж төлбөргүй.

**Why it exists:** defines scope, eligibility, price and entitlement boundary.  
**Data/process dependency:** safety gate, QPay provider confirmation, entitlement service.  
**Owner decision:** refunds, failed-payment handling, governing law and support SLA.  
**Legal review status:** PENDING.  
**Required change:** add only owner/legal-approved commercial terms.  
**Final approval status:** PENDING.

## Payment support and paid-but-not-unlocked

**Current text**

> Нэхэмжлэл үүсэхгүй, хугацаа дууссан, эсвэл төлбөр баталгаажсан ч бүрэн тайлан нээгдэхгүй бол дахин төлөхөөсөө өмнө “Төлбөр шалгах” үйлдлийг ашиглана уу.
>
> Тайлангаа өөр төхөөрөмжөөс авах бол Тайлан сэргээх хэсэгт төлбөр хийхдээ ашигласан холбоо барих мэдээллээ оруулна уу.

Payment UI states: `QPay нэхэмжлэл үүсгэж байна…`; `Төлбөрөө хийсний дараа “Төлбөр шалгах” товчийг дарна уу.`; `Төлбөрийг шалгаж байна…`; `Төлбөр баталгаажлаа. Одоо тестээ эхлүүлнэ үү.`; `Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ.` The recovery action for `paid_but_not_unlocked` is `Тайлангийн эрхээ дахин нээх`.

**Why it exists:** prevents duplicate payment and provides entitlement repair.  
**Data/process dependency:** QPay check, payment state machine, idempotent entitlement.  
**Owner decision:** named support channel, hours, refund/escalation SLA.  
**Legal review status:** PENDING.  
**Required change:** add verified support identity before launch.  
**Final approval status:** PENDING.

## Report recovery

**Current text**

> Төлбөр хийхдээ ашигласан утас эсвэл имэйлээ оруулна уу.
>
> Баталгаажуулах код авах
>
> Хэрэв тохирох бүрэн тайлан байгаа бол баталгаажуулах код илгээгдлээ.
>
> Баталгаажуулах код буруу эсвэл хугацаа дууссан байна.

**Why it exists:** restores entitled reports without revealing account existence.  
**Data/process dependency:** encrypted contacts, delivery provider, shared rate limits, recovery challenges.  
**Owner decision:** approved sender identity, channels, template and abuse policy.  
**Legal review status:** PENDING.  
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
**Owner decision:** consent withdrawal method and advisor privacy obligations.  
**Legal review status:** PENDING.  
**Required change:** approve consent version and withdrawal copy.  
**Final approval status:** PENDING.

## Data deletion

**Current text**

> Одоогийн баталгаажсан тест үнэлгээтэй холбоотой өгөгдөл устгах хүсэлт илгээж болно. Хүсэлтийг шалгах хугацаанд тайлан сэргээх боломж хязгаарлагдаж болно.
>
> Өгөгдлийн эзэмшлийг баталгаажуулахын тулд эхлээд тайлангаа сэргээнэ үү. Дараа нь энэ хуудсанд буцаж хүсэлт илгээнэ.

**Why it exists:** provides an ownership-checked deletion request.  
**Data/process dependency:** recovery identity, deletion queue, retention/anonymization procedure.  
**Owner decision:** response deadline, financial/audit retention and completion notice.  
**Legal review status:** PENDING.  
**Required change:** define and implement the operator fulfillment procedure.  
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

Canonical, `og:url`, `og:image`, and Twitter image consistently use `https://jingeehas.mn/`; recovery, privacy, terms and support links are same-origin relative paths. QPay callback origin is environment-configured. The local hero, favicon, and social preview contain no remote tracking asset.

**Owner decision:** prove control of the domain, approve the social preview and sender/support identities.  
**Legal review status:** PENDING.  
**Required change:** owner verification and, later, authorized staging configuration; no DNS action is part of this work.  
**Final approval status:** PENDING.
