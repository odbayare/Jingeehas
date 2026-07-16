# Jingeehas

`Илүүдэл жингээс салах тест үнэлгээ` нь нэг удаагийн, `9,900₮`-ийн тест үнэлгээ. Одоогоор `WEIGHT_TEST_COMING_SOON_MODE` идэвхтэй тул олон нийтээс төлбөр авах урсгал хаалттай байна.

## Хамгаалагдсан бүтээгдэхүүн

- Бүтээгдэхүүний код: `WEIGHT_TEST_ONE_TIME`
- Дүн: `9900`
- Харагдах үнэ: `9,900₮`
- Нэхэмжлэл үүсгэх: `/.netlify/functions/qpay-create-invoice`
- Төлбөр шалгах: `/.netlify/functions/qpay-check-payment`

Өөр арилжааны бүтээгдэхүүн, нэмэлт шат, тэмдэглэлийн бүтээгдэхүүн байхгүй.

## Архитектур

Статик клиент нь Netlify Functions-тэй зөвхөн ижил домэйноор харилцана. Сервер HTTP-only cookie session үүсгэж, assessment, payment, entitlement, recovery, advisor/admin authorization-ыг сервер талд шийднэ. Browser storage-д эрүүл мэндийн хариулт, тайлан, төлбөрийн эрх, нууц үг, session эсвэл урилгын token хадгалахгүй.

Production database нь `netlify/functions/_lib/store.js` дахь adapter boundary-аар HTTPS database API-тай ажиллана. `database/schema.sql` нь шаардлагатай PostgreSQL entity болон хамаарлын contract. Environment байхгүй үед production endpoint `503` буцааж, memory/localStorage fallback хийхгүй. Memory adapter зөвхөн `NODE_ENV=test` үед explicit injection-оор ажиллана.

QPay integration нь [албан ёсны Merchant V2 урсгал](https://developer.qpay.mn/mn/docs/merchant?version=2.0.0)-ын `POST /v2/auth/token`, `POST /v2/invoice`, `POST /v2/payment/check` contract-ыг ашиглана. Автомат тест provider HTTP-г mock хийдэг бөгөөд бодит нэхэмжлэл үүсгэдэггүй.

## Environment variables

Production launch-аас өмнө:

- `JINGEEHAS_DATABASE_API_URL`
- `JINGEEHAS_DATABASE_API_KEY`
- `QPAY_API_BASE_URL`
- `QPAY_CLIENT_ID`
- `QPAY_CLIENT_SECRET`
- `QPAY_INVOICE_CODE`
- `QPAY_CALLBACK_ORIGIN`
- `QPAY_ALLOWED_APP_SCHEMES`
- `QPAY_ALLOWED_HTTPS_HOSTS`
- `RECOVERY_ENCRYPTION_KEY` — 32-byte key, base64
- `RECOVERY_HASH_PEPPER` — 32+ character secret
- `RECOVERY_DELIVERY_API_URL`
- `RECOVERY_DELIVERY_API_KEY`
- `CROSS_PROJECT_FORBIDDEN_TOKEN` — CI contamination guard secret

Admin account-ыг `admin_accounts` хүснэгтэд scrypt password hash-тайгаар аюулгүй bootstrap хийнэ. Нууц үгийг repository эсвэл browser storage-д оруулахгүй.

## Local development

```bash
npm ci
npm test
npm run test:contracts
npx playwright install chromium
npm run test:e2e
npm run verify:production-package
npm run verify:database-config
npm run verify:recovery-config
npm run verify:qpay-config
npm run verify:domain-config
npm run build:staging
npm run verify:staging-package
```

`npm run build:production` зөвхөн `index.html`, client JS/CSS, security files, local assets-ыг `dist/` рүү хуулна. Tests, fixtures, E2E mock server, source documentation publish package-д орохгүй.

## Mock дүрэм

- Production HTML mock backend ачаалахгүй.
- Memory database, QPay provider, recovery delivery injection зөвхөн test process-д нээгдэнэ.
- Automated tests бодит QPay HTTP хүсэлт, бодит нэхэмжлэл, бодит төлбөр хийхгүй.
- URL query, localStorage, raw advisor ID нь entitlement эсвэл privileged access болохгүй.

## Launch checklist

- [ ] Database API-г schema contract-аар provision хийж, backup/restore турших
- [ ] Recovery delivery provider болон rate limit-ийг staging-д баталгаажуулах
- [ ] QPay callback origin, app scheme, HTTPS host allowlist-ийг owner/provider-оор баталгаажуулах
- [ ] Admin account-ыг secure bootstrap хийх
- [ ] Privacy/terms/support copy-г owner/legal review хийх
- [ ] Canonical domain болон social preview URL-г owner баталгаажуулах
- [ ] Staging дээр owner-assisted sandbox payment хийх
- [ ] CI бүх алхам ногоон болох
- [ ] Дээрх blocker-ууд хаагдсаны дараа л coming-soon mode-г тусдаа owner-approved өөрчлөлтөөр нээх

Энэ repository-ийн CI deploy хийдэггүй. Энэ ажлын хүрээнд deploy, merge, бодит нэхэмжлэл эсвэл бодит төлбөр хийх ёсгүй.

## External launch certification status

- Database: **BLOCKED** — provider/credentials, schema deployment, backup and restore certification remain.
- Recovery: **BLOCKED** — delivery provider, shared rate-limit configuration, deployment and owner test contact remain.
- QPay sandbox: **NOT RUN** — owner approval phrase and staging deployment approval are absent.
- Admin bootstrap: **PREPARED** — dry-run/apply/rotation tooling is tested; no real administrator exists from this work.
- Owner/legal: **PENDING** — see `docs/OWNER_LAUNCH_REVIEW.md`.
- Domain: **PENDING** — repository consistency passes; ownership and DNS are not verified or changed.
- Staging deployment: **NOT AUTHORIZED** — the deterministic package exists but has not been deployed.

Engineering preparation and the staging package can pass while external certification and public launch remain blocked. Configuration verifiers report missing dependencies as `BLOCKED`; this is not a launch PASS.

Certification procedures:

- `docs/STAGING_DATABASE_CERTIFICATION.md`
- `docs/STAGING_RECOVERY_CERTIFICATION.md`
- `docs/QPAY_SANDBOX_CERTIFICATION.md`
- `docs/ADMIN_BOOTSTRAP_AND_ROTATION.md`
- `docs/OWNER_LAUNCH_REVIEW.md`
